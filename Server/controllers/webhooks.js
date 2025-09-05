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

