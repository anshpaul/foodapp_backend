const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'zomato', // You can rename this folder if needed
    allowed_formats: ['jpg', 'png', 'jpeg'], // include 'jpeg'
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional resize
  },
});

module.exports = {
  cloudinary,
  storage
};
