/*
 * Title: Assets Library
 * Description: Utility library for assets-related functions
 */

const fs = require("fs/promises");
const fss = require("fs"); // native for existsSync
const path = require("path");

// Assets object - Module scaffolding
const assets = {};

assets.getUserUploadedVideo = async () => {
  const videoPath = path.join(__dirname, "../uploads/demo-upload.mp4");

  // console.log("Checking path:", videoPath);
  // console.log("Exists? ", fss.existsSync(videoPath));

  try {
    await fs.access(videoPath);

    const stat = await fs.stat(videoPath);

    return {
      path: videoPath,
      size: stat.size,
    };
  } catch (err) {
    console.error("Caught error while accessing:", err);
    throw new Error("Video file not found or not accessible");
  }
};

module.exports = assets;
