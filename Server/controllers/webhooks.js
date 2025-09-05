import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkWebhooks = async (req, res) => {
  try {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      return res.status(500).send("Webhook secret not configured");
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(req.body.toString());

    switch (type) {
      case "user.created":
        const existingUser = await User.findById(data.id);
        if (existingUser) return res.status(200).send("User already exists");

        await User.create({
          _id: data.id,
          email:
            data.email_addresses?.[0]?.email_address || "no-email@example.com",
          name:
            data.first_name && data.last_name
              ? `${data.first_name} ${data.last_name}`.trim()
              : data.username || data.first_name || data.last_name || "User",
          imageUrl: data.image_url || "https://via.placeholder.com/150",
          roles: ["student"],
        });
        return res.status(200).send("User created");

      case "user.updated":
        const updateData = {
          imageUrl: data.image_url || "https://via.placeholder.com/150",
        };
        if (data.first_name || data.last_name) {
          updateData.name =
            `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
            data.username ||
            "User";
        }
        if (data.email_addresses?.[0]?.email_address) {
          updateData.email = data.email_addresses[0].email_address;
        }
        await User.findByIdAndUpdate(data.id, updateData, { new: true });
        return res.status(200).send("User updated");

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        return res.status(200).send("User deleted");

      default:
        return res.status(200).send("Event acknowledged");
    }
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// ----------------- Stripe Webhooks -----------------

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  // Match the raw body to content type application/json
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );

      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";
      await purchaseData.save();
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
