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

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");


cloudinary.config({
  cloud_name: "ds1ysygvb",
  api_key: "385643874825617",
  api_secret: "FTZNWNQRccQIbY7uh9qo3DguVig",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "udaykora777@gmail.com",
    pass: "qzgy papu qmbe funk",
  },
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

db.getConnection((err) => {
  if (err) console.log(err);
  else console.log("mysql database connected");
});

app.get("/users", (req, res) => {
  const sql = "select * from bankistregister";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", data });
  });
});

app.post("/signup", (req, res) => {
  const { fullname, email, phonenumber, address, password } = req.body;
  let query2 = "select * from swiftrental where email = ?";
  db.query(query2, [email], (err, results) => {
    if (results.length > 0) {
      return res.json({ status: "failed", message: "Email id Already Exists" });
    } else {
      db.query(
        "INSERT INTO swiftrental SET ?",
        { email, fullname, phonenumber, address, password },
        (err) => {
          if (err) return res.status(500).json({ status: "failed" });
          return res.json({ status: "success", message: "User registered" });
        }
      );
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const querylogin = "SELECT * FROM swiftrental WHERE email= ?";
  const adminlogin = "SELECT * FROM admin WHERE email = ?";
  db.query(adminlogin, [email], (err, results5) => {
    if (err) return res.status(500).json({ status: "failed" });
    if (results5.length > 0 && results5[0].password == password) {
      return res.json({ status: "adminsuccess", message: "admin login" });
    } else {
      db.query(querylogin, [email], (err, results) => {
        if (err) return res.status(500).json({ status: "failed" });
        if (results.length > 0) {
          if (results[0].password === password) {
            return res.json({ status: "success", message: results[0] });
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
    const imageBuffer = carImage.buffer;
    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", public_id: timestamp },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(imageBuffer).pipe(upload_stream);
    });
    const path = result.secure_url;
    const query = `INSERT INTO cars SET ?`;
    db.query(
      query,
      { carName, carModel, fuelCapacity, capacity, transmission, fuelType, carPrice, path },
      (err) => {
        if (err) return res.status(500).json({ error: "Error inserting data" });
        res.json({ message: "Car data uploaded successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/userdata", (req, res) => {
  query3 = "select * from swiftrental";
  db.query(query3, (err, results6) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", message: results6 });
  });
});

app.post("/tokenverify",(req,res)=>{

  const {token}=req.body

  console.log(token)

  try {
  const decoded = jwt.verify(token,  "superkey");
  console.log("✅ Token is valid:", decoded);
  return res.json({status:true})
} catch (err) {
  console.log(" Invalid or expired token:", err.message);
}
})

app.post("/forgotpassword", (req, res) => {
  let { email, password } = req.body;
  let query = "UPDATE swiftrental SET password = ? where email = ?";
  db.query(query, [password, email], (err) => {
    if (err) return res.json({ status: false });
    return res.json({ status: true });
  });
});

app.post("/passwordverifylink", (req, res) => {
  let { email } = req.body;
  let query2 = "SELECT * FROM swiftrental WHERE email = ?";

  db.query(query2, [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false, message: err.message });

    if (results.length > 0) {
      console.log(email);

      const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
      const resetLink = `https://swiftdrive.vercel.app/forgotpasswordui?token=${token}&email=${encodeURIComponent(email)}`;

   const msg = {
  to: email,
  from: "udaykora777@gmail.com", 
  replyTo: "udaykora777@gmail.com",
  subject: "SwiftDrive Password Reset",
  text: `Hi, click this link to reset your password: ${resetLink}`,
  html: `<p>Hi,</p>
         <p>Click the link below to reset your SwiftDrive password:</p>
         <a href="${resetLink}">Reset Password</a>
         <p>If you did not request this, ignore this email.</p>`
};


      try {
        await sgMail.send(msg);
        return res.json({ status: true, message: "Verification sent" });
      } catch (mailError) {
        console.error("SendGrid Error:", mailError);
        return res.status(500).json({ status: false, message: mailError.message });
      }
    } else {
      return res.json({ status: false, message: "Email not found" });
    }
  });
});


app.get("/cars", (req, res) => {
  let query3 = "select * from cars ";
  db.query(query3, (err, results7) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", message: results7 });
  });
});

app.post("/bookedcars", (req, res) => {
  const { carid, carname, carmodel, bookedbyname, bookedbyid, pickupdate, dropdate, carimagepath, bookingprice } = req.body;
  let query4 = "insert into bookedcars SET ?";
  db.query(
    query4,
    { carid, carname, carmodel, bookedbyname, bookedbyid, pickupdate, dropdate, carimagepath, bookingprice },
    (err) => {
      if (err) return res.status(500).json({ status: "failed" });
      return res.json({ status: "success" });
    }
  );
});

app.post("/emailverify", async (req, res) => {
  let { email } = req.body;
  let query2 = "SELECT * FROM swiftrental WHERE email = ?";

  db.query(query2, [email], async (err, results) => {
    if (err) return res.status(500).json({ status: false, message: err.message });

    if (results.length > 0) {
      return res.json({ status: false, message: "Email Already Exists" });
    }

    const token = jwt.sign({ userId: email }, "superkey", { expiresIn: "1h" });
    const resetLink = `https://swiftdrive.vercel.app/signup?token=${token}&email=${encodeURIComponent(email)}`;

    const msg = {
      to: email,
      from: "udaykora777@gmail.com", 
      subject: "Email Verification",
      html: `<p>Click the link below to verify your email:</p><a href="${resetLink}">Verify Email</a>`,
    };

    try {
      await sgMail.send(msg);
      return res.json({ status: true, message: "Verification sent" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  });
});


app.post("/updateuserstatus", (req, res) => {
  let { updateuserstatus } = req.body;
  const statusupdate = updateuserstatus.status === "active" ? "deactive" : "active";
  let query5 = "UPDATE swiftrental SET status = ? WHERE id = ?";
  db.query(query5, [statusupdate, updateuserstatus.id], (err) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ message: "updated" });
  });
});

app.post("/usersbookedcars", (req, res) => {
  const { userid } = req.body;
  let query = "select * from bookedcars where bookedbyid = ?";
  db.query(query, [userid], (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", data: results });
  });
});

app.get("/adminbookedcars", (req, res) => {
  let query = "select * from bookedcars";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ status: "failed" });
    return res.json({ status: "success", data: results });
  });
});

app.listen(8085, () => {
  console.log("port running");
});
