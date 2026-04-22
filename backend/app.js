const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const brevo = require('@getbrevo/brevo');

const brevoClient = new brevo.TransactionalEmailsApi();
brevoClient.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY 
);

cloudinary.config({
  cloud_name: "ds1ysygvb",
  api_key: "385643874825617",
  api_secret: "FTZNWNQRccQIbY7uh9qo3DguVig",
});

const db = mysql.createPool({
  host: "bhuuscz4mdhat5a1zefe-mysql.services.clever-cloud.com",
  user: "ubrij124q6yydvsc",
  password: "biYYIyZyRO4qBM29YXNU",
  database: "bhuuscz4mdhat5a1zefe",
  waitForConnections: true,
  connectionLimit: 140,
  queueLimit: 0,
});



const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await brevoClient.sendTransacEmail({
      sender: {
        name: "SwiftDrive",
        email: "udaykora777@gmail.com", 
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    });
  } catch (error) {
    console.error("Brevo Error:", error);
    throw error;
  }
};

db.getConnection((err) => {
  if (err) console.log(err);
  else console.log("mysql database connected...");
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM bankistregister", (err, data) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", data });
  });
});

app.post("/signup", (req, res) => {
  const { fullname, email, phonenumber, address, password } = req.body;
  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, results) => {
    if (results.length > 0) {
      return res.json({ status: "failed", message: "Email id Already Exists" });
    } else {
      db.query("INSERT INTO swiftrental SET ?", { email, fullname, phonenumber, address, password }, (err) => {
        if (err) return res.status(500).json({ status: "failed" });
        return res.json({ status: "success", message: "User registered" });
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, adminResults) => {
    if (err) return res.status(500).json({ status: "failed" });
    if (adminResults.length > 0 && adminResults[0].password === password) {
      return res.json({ status: "adminsuccess", message: "admin login" });
    } else {
      db.query("SELECT * FROM swiftrental WHERE email= ?", [email], (err, userResults) => {
        if (err) return res.status(500).json({ status: "failed" });
        if (userResults.length > 0) {
          if (userResults[0].password === password) {
            return res.json({ status: "success", message: userResults[0] });
          } else {
            return res.json({ status: "failed", message: "invalid credentials" });
          }
        } else {
          return res.json({ status: "failed", message: "No account found" });
        }
      });
    }
  });
});

app.post("/carupload", upload.single("carImage"), async (req, res) => {
  const { carName, carModel, fuelCapacity, capacity, transmission, fuelType, carPrice } = req.body;
  const carImage = req.file;
  const timestamp = new Date().getTime();
  try {
    if (!carImage || !carImage.buffer) throw new Error("File buffer missing");
    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream({ resource_type: "auto", public_id: timestamp }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      streamifier.createReadStream(carImage.buffer).pipe(upload_stream);
    });
    db.query("INSERT INTO cars SET ?", { carName, carModel, fuelCapacity, capacity, transmission, fuelType, carPrice, path: result.secure_url }, (err) => {
      if (err) return res.status(500).json({ error: "Error inserting data" });
      res.json({ message: "Car data uploaded successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/userdata", (req, res) => {
  db.query("SELECT * FROM swiftrental", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", message: results });
  });
});

app.post("/tokenverify", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, "superkey");
    return res.json({ status: true });
  } catch (err) {
    return res.json({ status: false, message: "Invalid or expired token" });
  }
});

app.post("/forgotpassword", (req, res) => {
  const { email, password } = req.body;
  db.query("UPDATE swiftrental SET password = ? WHERE email = ?", [password, email], (err) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true });
  });
});


app.post("/passwordverifylink", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false });
    if (results.length === 0) return res.json({ status: false, message: "Email not found" });

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const resetLink = `https://swiftdrive.vercel.app/forgotpasswordui?token=${token}&email=${encodeURIComponent(email)}`;

    const html = `
      <p>Hi,</p>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}" style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;">
        Reset Password
      </a>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "SwiftDrive Password Reset",
        html,
        text: `Reset your password: ${resetLink}`
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
    return res.json({ status: "success", message: results });
  });
});

app.post("/bookedcars", (req, res) => {
  db.query("INSERT INTO bookedcars SET ?", req.body, (err) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success" });
  });
});


app.post("/emailverify", async (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false });

    if (results.length > 0)
      return res.json({ status: false, message: "Email exists" });

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const verifyLink = `https://swiftdrive.vercel.app/signup?token=${token}&email=${encodeURIComponent(email)}`;

    const html = `
      <p>Hi,</p>
      <p>Verify your account:</p>
      <a href="${verifyLink}" style="padding:10px 20px;background:#1a73e8;color:white;text-decoration:none;">
        Verify Email
      </a>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "SwiftDrive Email Verification",
        html,
        text: `Verify your account: ${verifyLink}`
      });

      res.json({ status: true, message: "Verification sent" });
    } catch {
      res.status(500).json({ status: false });
    }
  });
});



app.post("/updateuserstatus", (req, res) => {
  const { updateuserstatus } = req.body;
  const statusupdate = updateuserstatus.status === "active" ? "deactive" : "active";
  db.query("UPDATE swiftrental SET status = ? WHERE id = ?", [statusupdate, updateuserstatus.id], (err) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ message: "updated" });
  });
});

app.post("/usersbookedcars", (req, res) => {
  db.query("SELECT * FROM bookedcars WHERE bookedbyid = ?", [req.body.userid], (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", data: results });
  });
});

app.get("/adminbookedcars", (req, res) => {
  db.query("SELECT * FROM bookedcars", (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", data: results });
  });
});

app.listen(8085, () => {
  console.log("port running");
});
