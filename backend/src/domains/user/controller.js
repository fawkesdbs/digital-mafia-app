const User = require("./model");
const jwt = require("jsonwebtoken");
const { hashData, verifyHashedData } = require("../../util/hashData");
const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

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
  const { name, surname, email, phoneNumber, birthDate, password, role } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !surname ||
    !email ||
    !phoneNumber ||
    !birthDate ||
    !password ||
    !role
  ) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    // Create new user
    const hashedPassword = await hashData(password);
    const newUser = await User.create({
      name,
      surname,
      email,
      phoneNumber,
      birthDate,
      password: hashedPassword,
      role,
    });
    console.log(newUser);

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
        const token = jwt.sign({ id: user.id, role: user.role }, TOKEN_KEY, {
          expiresIn: TOKEN_EXPIRY,
        });
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

module.exports = {
  checkUser,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserRole,
};
