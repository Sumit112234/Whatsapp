import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		mobile: {
			type: String,
			required: true,
		},
		profilePic: {
			type: String,
			default: "",
		},
		lastMessage: [
			{
			  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
			  message: { type: String, default: "" },
			},
		  ],
		  
		unreadMessages: [
			{
			  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
			  totalMessages: { type: Number, default: 0 },
			},
		  ],
		
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;