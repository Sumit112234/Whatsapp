import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar ,getUserDetails, UpdateProfile,getUser } from "../controller/User.js";
import { addMultipleUsers } from "../controller/Auth.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/getmyuser", getUser);
router.get("/getuser", protectRoute, getUserDetails);
router.post("/addMultipleUser", addMultipleUsers);
router.post("/update-profile",protectRoute,upload.single("profilePic"), UpdateProfile);

export default router;