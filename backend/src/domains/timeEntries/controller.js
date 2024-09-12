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
      console.log(match);

      if (match) {
        const token = jwt.sign({ id: user.id, role: user.role }, TOKEN_KEY, {
          expiresIn: TOKEN_EXPIRY,
        });
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

const getUserRole = async (req, res) => {
  const role = req.user.role; // Extracted role from token
  res.status(200).json({ role });
};

const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.findAll({
      where: { role: "pending-admin" },
    });
    res.json(pendingAdmins);
  } catch (error) {
    console.error("Error fetching pending admins:", error.message);
    res.status(500).send("Error fetching pending admins");
  }
};

const approveAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Move user from PendingAdmins to Users or perform any approval logic here
    await User.destroy({ where: { id: adminId, role: "pending-admin" } });
    res.status(200).send("Admin approved successfully");
  } catch (error) {
    console.error("Error approving admin:", error.message);
    res.status(500).send("Error approving admin");
  }
};

const rejectAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    await User.destroy({ where: { id: adminId, role: "pending-admin" } });
    res.status(200).send("Admin rejected successfully");
  } catch (error) {
    console.error("Error rejecting admin:", error.message);
    res.status(500).send("Error rejecting admin");
  }
};

module.exports = {
  checkUser,
  registerUser,
  loginUser,
  getUserRole,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
};
