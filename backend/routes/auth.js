import express from "express";
import { login, logout, signup } from "../controller/Auth.js";
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout",protectRoute, logout);

export default router;