const app = require("./app");
const PORT = process.env.PORT || 3000;

const startApp = () => {
  app.listen(PORT, () => {
    console.log(`Auth Backend running on port ${PORT}`);
  });
};

startApp();
