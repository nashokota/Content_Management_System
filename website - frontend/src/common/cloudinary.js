// src/common/cloudinary.js

// Replace with your Cloudinary Cloud Name
const CLOUD_NAME = "dxnwmyy98"; // ✅ Your cloud name
const UPLOAD_PRESET = "cms-blog-website"; // Must match your preset name

/**
 * Uploads a file to Cloudinary using unsigned upload
 * @param {File} file - The file to upload (image or video)
 * @returns {Promise<string>} - Secure URL of the uploaded asset
 */
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    // ✅ FIXED: Removed extra spaces in URL
    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url) {
          console.log("✅ Upload successful:", data.secure_url);
          resolve(data.secure_url); // This is the public URL
        } else {
          reject(new Error(data.error?.message || "Upload failed"));
        }
      })
      .catch((error) => {
        console.error("❌ Upload error:", error);
        reject(error);
      });
  });
};