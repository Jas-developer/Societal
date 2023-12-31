import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import router from "./routes/authRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { postRoutes } from "./routes/postRoutes.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";

/*CONFIGURATIONS*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*FILE STORAGE*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES
 *desc THESE ROUTES WILL UPLOAD FILES
 */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/*ROUTES */
app.use("/auth", router);
app.use("/users", userRouter);
/*POST ROUTES*/
app.use("/posts", postRoutes);
/*MONGOOSE SET UP*/
/*ADD THE DATA ONE TIME*/
// User.insertMany(users);
// Post.insertMany(posts);
const PORT = process.env.PORT || 6001;
const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () => console.log(`Server Port:${PORT}`));
    })
    .catch((error) => console.log(error));
};

dbConnect();
