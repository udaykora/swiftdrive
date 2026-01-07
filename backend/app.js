const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Cloudinary config ---
cloudinary.config({
  cloud_name: "ds1ysygvb",
  api_key: "385643874825617",
  api_secret: "FTZNWNQRccQIbY7uh9qo3DguVig",
});

// --- MySQL config ---
const db = mysql.createPool({
  host: "bhuuscz4mdhat5a1zefe-mysql.services.clever-cloud.com",
  user: "ubrij124q6yydvsc",
  password: "biYYIyZyRO4qBM29YXNU",
  database: "bhuuscz4mdhat5a1zefe",
  waitForConnections: true,
  connectionLimit: 140,
  queueLimit: 0,
});

db.getConnection((err) => {
  if (err) console.log(err);
  else console.log("MySQL database connected...");
});

// --- Nodemailer config (Direct Gmail) ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "udaykora777@gmail.com", // <-- your Gmail
    pass: "gwbfgswfjkhwyxoh",      // <-- 16-char App Password
  },
});

// --- Helper to send emails ---
async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: "SwiftDrive <udaykora777@gmail.com>",
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

// --- Routes ---

// Signup
app.post("/signup", (req, res) => {
  const { fullname, email, phonenumber, address, password } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ status: "failed", message: err.message });
    if (results.length > 0) return res.json({ status: "failed", message: "Email already exists" });

    db.query("INSERT INTO swiftrental SET ?", { email, fullname, phonenumber, address, password }, (err) => {
      if (err) return res.status(500).json({ status: "failed", message: err.message });
      return res.json({ status: "success", message: "User registered" });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, adminResults) => {
    if (err) return res.status(500).json({ status: "failed", message: err.message });
    if (adminResults.length > 0 && adminResults[0].password === password)
      return res.json({ status: "adminsuccess", message: "Admin login" });

    db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, userResults) => {
      if (err) return res.status(500).json({ status: "failed", message: err.message });
      if (userResults.length === 0) return res.json({ status: "failed", message: "No account found" });
      if (userResults[0].password !== password) return res.json({ status: "failed", message: "Invalid credentials" });
      return res.json({ status: "success", message: userResults[0] });
    });
  });
});

// Upload Car
app.post("/carupload", upload.single("carImage"), async (req, res) => {
  const { carName, carModel, fuelCapacity, capacity, transmission, fuelType, carPrice } = req.body;
  const carImage = req.file;
  const timestamp = new Date().getTime();

  try {
    if (!carImage || !carImage.buffer) throw new Error("File buffer missing");

    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", public_id: timestamp },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(carImage.buffer).pipe(upload_stream);
    });

    db.query(
      "INSERT INTO cars SET ?",
      { carName, carModel, fuelCapacity, capacity, transmission, fuelType, carPrice, path: result.secure_url },
      (err) => {
        if (err) return res.status(500).json({ error: "Error inserting data" });
        res.json({ message: "Car data uploaded successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get("/userdata", (req, res) => {
  db.query("SELECT * FROM swiftrental", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", message: results });
  });
});

// Token verify
app.post("/tokenverify", (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, "superkey");
    res.json({ status: true });
  } catch (err) {
    res.json({ status: false, message: "Invalid or expired token" });
  }
});

// Forgot Password Update
app.post("/forgotpassword", (req, res) => {
  const { email, password } = req.body;
  db.query("UPDATE swiftrental SET password = ? WHERE email = ?", [password, email], (err) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true });
  });
});

// Password reset email
app.post("/passwordverifylink", async (req, res) => {
  const { email } = req.body;
  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false, message: err.message });
    if (results.length === 0) return res.json({ status: false, message: "Email not found" });

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const resetLink = `https://swiftdrive.vercel.app/forgotpasswordui?token=${token}&email=${encodeURIComponent(email)}`;

    const htmlContent = `
      <p>Hi,</p>
      <p>Click the button below to reset your SwiftDrive password:</p>
      <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
      ">Reset Password</a>
      <p>If you did not request this, ignore this email.</p>
    `;

    const sent = await sendEmail({ to: email, subject: "SwiftDrive Password Reset", html: htmlContent });
    if (sent) return res.json({ status: true, message: "Verification email sent" });
    return res.status(500).json({ status: false, message: "Failed to send email" });
  });
});

// Email verification for signup
app.post("/emailverify", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ status: false, message: "Email is required" });

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false, message: err.message });
    if (results.length > 0) return res.json({ status: false, message: "Email Already Exists" });

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const verifyLink = `https://swiftdrive.vercel.app/signup?token=${token}&email=${encodeURIComponent(email)}`;

    const htmlContent = `
      <p>Hi,</p>
      <p>Click the button below to verify your SwiftDrive account:</p>
      <a href="${verifyLink}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
      ">Verify Email</a>
      <p>If you did not request this, ignore this email.</p>
    `;

    const sent = await sendEmail({ to: email, subject: "SwiftDrive Email Verification", html: htmlContent });
    if (sent) return res.json({ status: true, message: "Verification email sent" });
    return res.status(500).json({ status: false, message: "Failed to send email" });
  });
});

// Get all cars
app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", message: results });
  });
});

// Book a car
app.post("/bookedcars", (req, res) => {
  db.query("INSERT INTO bookedcars SET ?", req.body, (err) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success" });
  });
});

// Start server
app.listen(8085, () => {
  console.log("Backend running on port 8085");
});
