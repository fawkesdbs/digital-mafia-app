const { DB_PASSWORD } = process.env;
const mysql = require("mysql2/promise");

const databaseExists = async (connection, dbName) => {
  try {
    const [rows] = await connection.query("SHOW DATABASES LIKE ?", [dbName]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking database existence:", error);
    return false;
  }
};

const createInitialConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: DB_PASSWORD,
    });
    console.log("Connected to MySQL");
    return connection;
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    throw error;
  }
};

const createConnection = async (dbName) => {
  const connection = await createInitialConnection();

  try {
    const exists = await databaseExists(connection, dbName);
    if (exists) {
      console.log(`Database "${dbName}" exists. Connecting...`);
      await connection.query(`USE ${dbName}`);
    }
  } catch (error) {
    console.error("Error during database connection setup:", error);
    throw error;
  }

  return connection;
};

module.exports = { databaseExists, createInitialConnection, createConnection };
