import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		const { fullName, mobile,username, password, gender, pic ,email} = req.body;

		
		const user = await User.findOne({ username }) || await User.findOne({ email });

		if (user) {
			return res.status(400).json({ error: "Username or email already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// https://avatar-placeholder.iran.liara.run/
        
        
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
            mobile,
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: pic ? pic : gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			// Generate JWT token here
			await newUser.save();
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
				
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const addMultipleUsers = async (req, res) => {

	req.body.map(async(user)=>{
		try {
			const { fullName, mobile,username, password, gender, pic } = user;
	
			
	
			// HASH PASSWORD HERE
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
	
			// https://avatar-placeholder.iran.liara.run/
			
			
			const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
			const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
	
			const newUser = new User({
				mobile,
				fullName,
				username,
				password: hashedPassword,
				gender,
				profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
			});
	
			
				await newUser.save();
			
		} catch (error) {
			
			console.log("error",error)
		}
	})
	res.status(200).json({status : 'success!'})
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
	
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");


		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			user,
			cookie : req.cookies
		
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ e : error, error: "Internal Server Error" });
	}
};


export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
  };