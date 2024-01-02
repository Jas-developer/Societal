import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
/*CREATE A POST*/
const createPost = async (req, res) => {
  try {
    // from client
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not exist" });
    }
    const newPost = await Post.create({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    if (newPost) {
      const post = await Post.find();
      res.status(201).json(post);
    }
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/*READ*/
const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    if (post) {
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/*UPDATE*/
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
export { createPost, getFeedPosts, getUserPosts, likePost };

