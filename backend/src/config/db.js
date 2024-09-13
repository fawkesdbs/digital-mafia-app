require("dotenv").config();
const { DB_DATABASE, DB_PASSWORD } = process.env;
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const { createInitialConnection } = require("./../util/createDBConnection");
const { hashData } = require("./../util/hashData");

const dbName = DB_DATABASE;

const databaseExists = async (connection, dbName) => {
  try {
    const [rows] = await connection.query("SHOW DATABASES LIKE ?", [dbName]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking database existence:", error);
    return false;
  }
};

const createDatabase = async (connection, dbName) => {
  try {
    if (await databaseExists(connection, dbName)) {
      console.log(`Database "${dbName}" already exists.`);
    } else {
      console.log(`Creating database "${dbName}".`);
      await connection.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created.`);
    }
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

const createTablesAndInsertDefaultUser = async (connection, dbName) => {
  try {
    await connection.query(`USE ${dbName}`);

    const tableCreationQueries = [
      `CREATE TABLE IF NOT EXISTS pendingadmins (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      surname varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      phoneNumber varchar(20) NOT NULL,
      birthDate date NOT NULL,
      password varchar(255) NOT NULL,
      requestDate datetime DEFAULT NULL,
      PRIMARY KEY (id)
      )`,
      `CREATE TABLE IF NOT EXISTS users (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      surname varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      phoneNumber varchar(20) NOT NULL,
      birthDate date NOT NULL,
      password varchar(255) NOT NULL,
      role varchar(10) DEFAULT NULL,
      PRIMARY KEY (id)
      )`,
      `CREATE TABLE IF NOT EXISTS time_entries (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      date DATETIME NOT NULL,
      hours FLOAT NOT NULL,
      description VARCHAR(255) DEFAULT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS OTP (
      id INT NOT NULL AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      otp VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL,
      expiresAt DATETIME NOT NULL,
      PRIMARY KEY (id)
      );`,
    ];

    for (const query of tableCreationQueries) {
      await connection.query(query);
      console.log("Table created successfully.");
    }

    // Check if the default user already exists
    const [rows] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      ["root@root.com"]
    );

    if (rows.length === 0) {
      const birthDate = new Date();
      const password = await hashData("password123");
      const insertUserQuery = `INSERT INTO users (name, surname, email, phoneNumber, birthDate, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await connection.query(insertUserQuery, [
        "John",
        "Doe",
        "root@root.com",
        "0123456789",
        birthDate,
        password,
        "admin",
      ]);
      console.log("Default user added.");
    } else {
      console.log("Default user already exists.");
    }
  } catch (error) {
    console.error("Error creating tables or handling default user:", error);
  }
};

const setupDatabaseAndTables = async (dbName) => {
  const connection = await createInitialConnection();

  try {
    await createDatabase(connection, dbName);
    await createTablesAndInsertDefaultUser(connection, dbName);
  } finally {
    await connection.end();
  }
};

setupDatabaseAndTables(dbName);

const sequelize = new Sequelize(dbName, "root", DB_PASSWORD, {
  host: "localhost", // Replace with your database host
  dialect: "mysql", // Replace with your database dialect ('mysql', 'postgres', 'sqlite', 'mariadb')
  logging: false, // Set to true if you want to see SQL queries in the console
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

module.exports = sequelize;
