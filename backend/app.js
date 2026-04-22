require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");

const SibApiV3Sdk = require("@getbrevo/brevo");

const app = express();
app.use(cors());
app.use(express.json());


const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await brevoClient.sendTransacEmail({
      sender: {
        name: "Swift drive",
        email: "udaykora777@gmail.com", 
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    });
  } catch (error) {
    console.error("Brevo Error:", error.response?.body || error);
    throw error;
  }
};

// ---------------- CLOUDINARY ---------------- //
cloudinary.config({
  cloud_name: "ds1ysygvb",
  api_key: "385643874825617",
  api_secret: "FTZNWNQRccQIbY7uh9qo3DguVig",
});

// ---------------- MYSQL ---------------- //
const db = mysql.createPool({
  host: "bhuuscz4mdhat5a1zefe-mysql.services.clever-cloud.com",
  user: "ubrij124q6yydvsc",
  password: "biYYIyZyRO4qBM29YXNU",
  database: "bhuuscz4mdhat5a1zefe",
  waitForConnections: true,
  connectionLimit: 140,
});

db.getConnection((err) => {
  if (err) console.log(err);
  else console.log("MySQL connected...");
});

// ---------------- MULTER ---------------- //
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- ROUTES ---------------- //

app.get("/users", (req, res) => {
  db.query("SELECT * FROM bankistregister", (err, data) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", data });
  });
});

app.post("/signup", (req, res) => {
  const { fullname, email, phonenumber, address, password } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });

    if (results.length > 0) {
      return res.json({ status: "failed", message: "Email already exists" });
    }

    db.query(
      "INSERT INTO swiftrental SET ?",
      { email, fullname, phonenumber, address, password },
      (err) => {
        if (err) return res.status(500).json({ status: "failed" });
        res.json({ status: "success", message: "User registered" });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, adminResults) => {
    if (err) return res.status(500).json({ status: "failed" });

    if (adminResults.length > 0 && adminResults[0].password === password) {
      return res.json({ status: "adminsuccess", message: "admin login" });
    }

    db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, userResults) => {
      if (err) return res.status(500).json({ status: "failed" });

      if (userResults.length > 0) {
        if (userResults[0].password === password) {
          return res.json({ status: "success", message: userResults[0] });
        }
      }

      res.json({ status: "failed", message: "Invalid credentials" });
    });
  });
});

// ---------------- CAR UPLOAD ---------------- //
app.post("/carupload", upload.single("carImage"), async (req, res) => {
  const { carName, carModel, fuelCapacity, capacity, transmission, fuelType, carPrice } = req.body;
  const carImage = req.file;

  try {
    if (!carImage?.buffer) throw new Error("File missing");

    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(carImage.buffer).pipe(upload_stream);
    });

    db.query(
      "INSERT INTO cars SET ?",
      {
        carName,
        carModel,
        fuelCapacity,
        capacity,
        transmission,
        fuelType,
        carPrice,
        path: result.secure_url,
      },
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ message: "Car uploaded successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/userdata", (req, res) => {
  db.query("SELECT * FROM swiftrental", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", message: results });
  });
});

app.post("/tokenverify", (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, "superkey");
    res.json({ status: true });
  } catch {
    res.json({ status: false });
  }
});

app.post("/forgotpassword", (req, res) => {
  const { email, password } = req.body;
  db.query("UPDATE swiftrental SET password = ? WHERE email = ?", [password, email], (err) => {
    if (err) return res.json({ status: false });
    res.json({ status: true });
  });
});

// ---------------- PASSWORD RESET EMAIL ---------------- //
app.post("/passwordverifylink", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false });

    if (results.length === 0)
      return res.json({ status: false, message: "Email not found" });

    const token = jwt.sign({ email }, "superkey", { expiresIn: "1h" });
    const link = `https://swiftdrive.vercel.app/forgotpasswordui?token=${token}&email=${email}`;

    try {
      await sendEmail({
        to: email,
        subject: "SwiftDrive Password Reset",
        html: `<a href="${link}">Reset Password</a>`,
        text: link,
      });

      res.json({ status: true, message: "Email sent" });
    } catch {
      res.status(500).json({ status: false, message: "Email failed" });
    }
  });
});

app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", message: results });
  });
});

app.post("/bookedcars", (req, res) => {
  db.query("INSERT INTO bookedcars SET ?", req.body, (err) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success" });
  });
});

// ---------------- EMAIL VERIFY ---------------- //
app.post("/emailverify", (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, "superkey", { expiresIn: "1h" });
  const link = `https://swiftdrive.vercel.app/signup?token=${token}&email=${email}`;

  sendEmail({
    to: email,
    subject: "SwiftDrive Email Verification",
    html: `<a href="${link}">Verify Email</a>`,
    text: link,
  })
    .then(() => res.json({ status: true, message: "Verification sent" }))
    .catch(() => res.status(500).json({ status: false }));
});

app.post("/updateuserstatus", (req, res) => {
  const { updateuserstatus } = req.body;
  const statusupdate = updateuserstatus.status === "active" ? "deactive" : "active";

  db.query(
    "UPDATE swiftrental SET status = ? WHERE id = ?",
    [statusupdate, updateuserstatus.id],
    (err) => {
      if (err) return res.status(500).json({ status: "failed" });
      res.json({ message: "updated" });
    }
  );
});

app.post("/usersbookedcars", (req, res) => {
  db.query(
    "SELECT * FROM bookedcars WHERE bookedbyid = ?",
    [req.body.userid],
    (err, results) => {
      if (err) return res.status(500).json({ status: "failed" });
      res.json({ status: "success", data: results });
    }
  );
});

app.get("/adminbookedcars", (req, res) => {
  db.query("SELECT * FROM bookedcars", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", data: results });
  });
});

app.listen(8085, () => {
  console.log("Server running on port 8085");
});