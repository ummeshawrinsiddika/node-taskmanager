const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../configs/cloudinary");
cloudinaryConfig();

const uploadToCloudinary = async ({ mimetype, imgBuffer }) => {
  const dataUrl = `data:${mimetype};base64,${imgBuffer.toString("base64")}`;
  return await cloudinary.uploader.upload(dataUrl);
};

const destroyFromCloudinary = async (imageUrl) => {
  if(!imageUrl) return;
  const publicId = imageUrl.split("/").pop().split(".")[0];
  console.log("Deleting publicId:", publicId);
  const result = await cloudinary.uploader.destroy(publicId);
  console.log("Delete result:", result);
};

module.exports = { uploadToCloudinary, destroyFromCloudinary };