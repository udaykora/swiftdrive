const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

/* =========================
   RESEND INIT (ONLY ENV USED)
========================= */
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   APP + MIDDLEWARE
========================= */
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* =========================
   MULTER
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   CLOUDINARY
========================= */
cloudinary.config({
  cloud_name: "ds1ysygvb",
  api_key: "385643874825617",
  api_secret: "FTZNWNQRccQIbY7uh9qo3DguVig",
});

/* =========================
   MYSQL
========================= */
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
  else console.log("mysql database connected...");
});

/* =========================
   USERS
========================= */
app.get("/users", (req, res) => {
  db.query("SELECT * FROM bankistregister", (err, data) => {
    if (err) return res.status(500).json({ status: "failed" });
    res.json({ status: "success", data });
  });
});

app.post("/signup", (req, res) => {
  const { fullname, email, phonenumber, address, password } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, results) => {
    if (results.length > 0) {
      return res.json({ status: "failed", message: "Email id Already Exists" });
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

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, admin) => {
    if (admin.length > 0 && admin[0].password === password) {
      return res.json({ status: "adminsuccess", message: "admin login" });
    }

    db.query("SELECT * FROM swiftrental WHERE email = ?", [email], (err, users) => {
      if (users.length === 0)
        return res.json({ status: "failed", message: "No account found" });

      if (users[0].password !== password)
        return res.json({ status: "failed", message: "invalid credentials" });

      res.json({ status: "success", message: users[0] });
    });
  });
});

/* =========================
   EMAIL VERIFY (RESEND)
========================= */
app.post("/emailverify", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (results.length > 0)
      return res.json({ status: false, message: "Email Already Exists" });

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const verifyLink = `https://swiftdrive.vercel.app/signup?token=${token}&email=${encodeURIComponent(email)}`;

    try {
      await resend.emails.send({
        from: "SwiftDrive <onboarding@resend.dev>",
        to: email,
        subject: "SwiftDrive Email Verification",
        html: `
          <p>Hi,</p>
          <p>Verify your email:</p>
          <a href="${verifyLink}">Verify Email</a>
        `,
      });

      res.json({ status: true, message: "Verification email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Email failed" });
    }
  });
});

/* =========================
   TOKEN VERIFY
========================= */
app.post("/tokenverify", (req, res) => {
  try {
    jwt.verify(req.body.token, "superkey");
    res.json({ status: true });
  } catch {
    res.json({ status: false });
  }
});

/* =========================
   PASSWORD RESET (RESEND)
========================= */
app.post("/passwordverifylink", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM swiftrental WHERE email = ?", [email], async (err, results) => {
    if (results.length === 0)
      return res.json({ status: false, message: "Email not found" });

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const resetLink = `https://swiftdrive.vercel.app/forgotpasswordui?token=${token}&email=${email}`;

    try {
      await resend.emails.send({
        from: "SwiftDrive <onboarding@resend.dev>",
        to: email,
        subject: "SwiftDrive Password Reset",
        html: `<a href="${resetLink}">Reset Password</a>`,
      });

      res.json({ status: true });
    } catch {
      res.status(500).json({ status: false });
    }
  });
});

app.post("/forgotpassword", (req, res) => {
  const { email, password } = req.body;
  db.query("UPDATE swiftrental SET password = ? WHERE email = ?", [password, email], () =>
    res.json({ status: true })
  );
});

/* =========================
   CARS
========================= */
app.post("/carupload", upload.single("carImage"), async (req, res) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: "auto" },
    (err, result) => {
      db.query(
        "INSERT INTO cars SET ?",
        { ...req.body, path: result.secure_url },
        () => res.json({ status: true })
      );
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) =>
    res.json({ status: "success", message: results })
  );
});

/* =========================
   BOOKINGS
========================= */
app.post("/bookedcars", (req, res) => {
  db.query("INSERT INTO bookedcars SET ?", req.body, () =>
    res.json({ status: "success" })
  );
});

app.post("/usersbookedcars", (req, res) => {
  db.query(
    "SELECT * FROM bookedcars WHERE bookedbyid = ?",
    [req.body.userid],
    (err, results) => res.json({ status: "success", data: results })
  );
});

app.get("/adminbookedcars", (req, res) => {
  db.query("SELECT * FROM bookedcars", (err, results) =>
    res.json({ status: "success", data: results })
  );
});

/* =========================
   SERVER
========================= */
app.listen(8085, () => {
  console.log("🚀 Server running on port 8085");
});
