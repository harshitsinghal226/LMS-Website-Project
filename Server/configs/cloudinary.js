import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
    })
}