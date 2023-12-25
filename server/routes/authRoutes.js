import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();
/*END POINTS*/
router.post("/login", login);

export default router;
