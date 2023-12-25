import { User } from "../models/User.js";

/*READ*/
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/*UPDATE*/
const addRemoveFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendId);
    if (user.friends.includes(req.params.friendId)) {
      user.friends = user.friends.filter((id) => id !== req.params.friendId);
      friend.friends = friend.friends.filter((id) => id !== req.params.id);
    } else {
      user.friends.push(req.params.friendId);
      friend.friends.push(req.params.id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export { getUser, addRemoveFriend, getUserFriends };
