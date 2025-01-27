import User from "../models/user.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserDetails = async (req, res) => {
	try {
		const loggedInUser = req.user;
		res.status(200).json({loggedInUser});
	} catch (error) {
		console.error("Error in getUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


// Cloudinary configuration (Ensure these values are set in your environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const UpdateProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Check if a file is provided
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "profile_pictures", // Optional: Specify a folder for organization
      use_filename: true,
      unique_filename: false,
    });

    // Update user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      { profilePic: result.secure_url },
      { new: true } // Return the updated user
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};