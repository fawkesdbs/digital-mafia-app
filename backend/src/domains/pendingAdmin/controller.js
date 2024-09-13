const PendingAdmin = require("./model");
const User = require("../user/model");
const { hashData } = require("./../../util/hashData");

const registerAdmin = async (req, res) => {
  const { name, surname, email, phoneNumber, birthDate, password } = req.body;

  // Validate required fields
  if (!name || !surname || !email || !phoneNumber || !birthDate || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Check if the email already exists
    const existingAdmin = await PendingAdmin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).send("Email already exists");
    }

    // Create new user
    const hashedPassword = await hashData(password);
    const requestDate = new Date();
    const newAdmin = await PendingAdmin.create({
      name,
      surname,
      email,
      phoneNumber,
      birthDate,
      password: hashedPassword,
      requestDate,
    });

    res.status(201).send("Admin waiting for approval");
  } catch (error) {
    console.error("Error registering admin:", error.message);
    res.status(500).send("Error registering admin");
  }
};

const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await PendingAdmin.findAll({
      attributes: [
        "id",
        "name",
        "surname",
        "email",
        "phoneNumber",
        "requestDate",
      ],
    });

    if (!pendingAdmins) {
      return res.status(404).send("No pending admins found.");
    }

    return res.json(pendingAdmins);
  } catch (error) {
    console.error("Error fetching pending admins:", error.message);
    if (!res.headersSent) {
      return res.status(500).send("Error fetching pending admins");
    }
  }
};

const approveAdmin = async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) {
    return res.status(400).send("Admin ID is required.");
  }

  try {
    // Move user from PendingAdmins to Users or perform any approval logic here
    const approvedAdmin = await PendingAdmin.findByPk(adminId);
    if (!approvedAdmin) {
      return res.status(404).send("Pending admin not found.");
    }

    const newUser = await User.create({
      name: approvedAdmin.name,
      surname: approvedAdmin.surname,
      email: approvedAdmin.email,
      phoneNumber: approvedAdmin.phoneNumber,
      birthDate: approvedAdmin.birthDate,
      password: approvedAdmin.password,
      role: "admin",
    });
    console.log(newUser);

    // Removing admin from pendingAdmins table
    await PendingAdmin.destroy({ where: { id: adminId } });
    return res.status(200).send("Admin approved successfully");
  } catch (error) {
    console.error("Error approving admin:", error.message);
    if (!res.headersSent) {
      return res.status(500).send("Error approving admin.");
    }
  }
};

const rejectAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Removing admin from pendingAdmins table
    await PendingAdmin.destroy({ where: { id: adminId } });
    res.status(200).send("Admin rejected successfully");
  } catch (error) {
    console.error("Error rejecting admin:", error.message);
    res.status(500).send("Error rejecting admin");
  }
};

module.exports = {
  registerAdmin,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
};
