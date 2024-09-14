const { Op } = require("sequelize");
const Message = require("./model");

const sendMessage = (req, res) => {
  const { senderId, receiverId, content } = req.body;
  Message.create({ senderId, receiverId, content })
    .then(() => res.status(201).json({ message: "Message sent successfully" }))
    .catch((error) => res.status(500).json({ error: error.message }));
};

const getMessages = (req, res) => {
  const userId = req.params.userId;
  Message.findAll({
    where: {
      [Op.or]: [{ senderId: userId }, { receiverId: userId }],
    },
  })
    .then((messages) => res.status(200).json(messages))
    .catch((error) => res.status(500).json({ error: error.message }));
};

module.exports = { sendMessage, getMessages };
