const User = require("./model");
const jwt = require("jsonwebtoken");
const { hashData, verifyHashedData } = require("../../util/hashData");
const createToken = require("../../util/createToken");
const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '614257370060-4nk9tssa768onb8u28ccen9ri26borou.apps.googleusercontent.com'; // Replace with your Google Client ID
const client = new OAuth2Client(CLIENT_ID);

const registerWithGoogle = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).send("ID Token is required");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if the user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      // User exists, proceed with login
      const token = await createToken(
        { id: user.id, role: user.role },
        TOKEN_KEY,
        TOKEN_EXPIRY
      );
      return res.status(200).json({ success: true, token });
    }

    // User does not exist, create a new user
    user = await User.create({
      email,
      name: name || 'Unknown', // Default value if name is missing
      surname: '',
      phoneNumber: '',
      birthDate: new Date(),
      password: '', // Empty or default value
      role: 'user',
      fromGoogle: true, // Indicate that this registration is from Google
    });

    const token = await createToken(
      { id: user.id, role: user.role },
      TOKEN_KEY,
      TOKEN_EXPIRY
    );

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error with Google Sign-Up:", error.message);
    res.status(500).send("Error with Google Sign-Up");
  }
};


const checkUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const user = await User.findOne({ where: { email } });
    res.json(!!user);
  } catch (error) {
    console.error("Error checking user existence:", error.message);
    res.status(500).send("Error checking user existence");
  }
};

const registerUser = async (req, res) => {
  const { name, surname, email, phoneNumber, birthDate, password, role, fromGoogle } = req.body;

  // Skip validation if fromGoogle is true
  if (!fromGoogle && (!name || !surname || !email || !phoneNumber || !birthDate || !password || !role)) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    // Create new user
    const hashedPassword = !fromGoogle ? await hashData(password) : '';
    const newUser = await User.create({
      name: fromGoogle ? 'Unknown' : name,
      surname: fromGoogle ? '' : surname,
      email,
      phoneNumber: fromGoogle ? '' : phoneNumber,
      birthDate: fromGoogle ? new Date() : birthDate,
      password: hashedPassword,
      role: fromGoogle ? 'user' : role,
    });

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).send("Error registering user");
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const storedPassword = user.password;
      const match = await verifyHashedData(password, storedPassword);
      if (match) {
        const token = await createToken(
          { id: user.id, role: user.role },
          TOKEN_KEY,
          TOKEN_EXPIRY
        );
        console.log("Logged In");

        res.status(200).json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: "Incorrect password" });
      }
    } else {
      res.status(401).json({ success: false, message: "Incorrect email" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).send("Error during login");
  }
};

const getProfile = async (req, res) => {
  const { id } = req.params;
  const currentUser = await User.findOne({ where: { id } });
  if (!currentUser) {
    return res.status(401).json({ message: "User not found" });
  } else {
    return res.status(200).json({ user: currentUser });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, ...updatedData } = req.body;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (currentPassword && newPassword) {
      // Check if the current password matches
      const isMatch = await verifyHashedData(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Current password is incorrect" });
      }

      // Update password if a new password is provided
      const hashedPassword = await hashData(newPassword);
      updatedData.password = hashedPassword;
    }

    // Update the user's data
    await user.update(updatedData);
    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserRole = async (req, res) => {
  const { id } = req.params;
  const currentUser = await User.findOne({ where: { id } });
  if (!currentUser) {
    return res.status(401).json({ message: "User not found" });
  } else {
    return res.status(200).json({ role: currentUser.role });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "surname",
        "email",
        "phoneNumber",
        "birthDate",
        "role",
      ],
    });

    if (!users) {
      return res.status(404).send("No users found.");
    }

    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    if (!res.headersSent) {
      return res.status(500).send("Error fetching users");
    }
  }
};

module.exports = {
  checkUser,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserRole,
  getUsers,
  registerWithGoogle,
};
