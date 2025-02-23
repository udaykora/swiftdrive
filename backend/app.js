const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const streamifier = require("streamifier");
const util = require("util");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(cors());

app.use(express.json());

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

db.getConnection((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("mysql database connected.......");
  }
});

app.use("/", (req, res) => {
  res.send("from backend side");
});

app.get("/users", (req, res) => {
  const sql = "select * from bankistregister";

  db.query(sql, (err, data) => {
    if (err) {
      console.log("error connecting in database");
    } else {
      console.log("hii");
    }
  });
});

app.post("/signup", (req, res) => {
  const { fullname, email, phonenumber, address, password } = req.body;

  let query2 = "select * from swiftrental where email = ?";

  db.query(query2, [email], (err, results) => {
    console.log(results);

    if (results.length > 0) {
      return res.json({ status: "failed", message: "Email id Already Exists" });
    } else {
      db.query(
        "INSERT INTO swiftrental SET ?",
        {
          
          email: email,
          fullname: fullname,

          phonenumber: phonenumber,
          address: address,
          password: password,
          
        },
        (err) => {
          if (err) {
            console.log("Error connecting to database");
            return res.status(500).json({
              status: "failed",
              message: "Error connecting to database",
            });
          } else {
            console.log("Data sent securely...");
            return res.status(200).json({
              status: "success",
              message: "User registered successfully!",
            });
          }
        }
      );
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  const querylogin = "SELECT * FROM swiftrental WHERE email= ?";
  const adminlogin = "SELECT * FROM admin WHERE email = ?";
  db.query(adminlogin, [email], (err, results5) => {
    if (err) {
      return res.status(500).json({
        status: "failed to load",
        message: "error connecting to the database",
      });
    }
    if (results5.length > 0 && results5[0].password == password) {
      return res
        .status(200)
        .json({ status: "adminsuccess", message: "admin login" });
    } else {
      db.query(querylogin, [email], (err, results) => {
        if (err) {
          return res.status(500).json({
            status: "failed to load",
            message: "error connecting to the database",
          });
        }

        if (results.length > 0) {
          if (results[0].password === password) {
            console.log("fff");
            return res
              .status(200)
              .json({ status: "success", message: results[0] });
          } else {
            console.log("fff");
            return res.json({
              status: "failed",
              message: "invalid credentials",
            });
          }
        } else {
          console.log("fff");
          return res.json({ status: "failed", message: "No account found" });
        }
      });
    }
  });
});

app.post("/carupload", upload.single("carImage"), async (req, res) => {
  const {
    carName,
    carModel,
    fuelCapacity,
    capacity,
    transmission,
    fuelType,
    carPrice,
  } = req.body;

  console.log(carName);

  const carImage = req.file;
  const timestamp = new Date().getTime();

  try {
    if (!carImage || !carImage.buffer) {
      throw new Error("File buffer is not available.");
    }

    const imageBuffer = carImage.buffer;
    console.log("Image Buffer:", imageBuffer);

    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: timestamp,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Stream Error:", error);
            reject(error);
          } else {
            console.log("Cloudinary Upload Result:", result);
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(imageBuffer).pipe(upload_stream);
    });

    const path = result.secure_url;
    console.log("Cloudinary Image Path:", path);

    const query = `INSERT INTO cars SET ?`;
    db.query(
      query,
      {
        carName,
        carModel,
        fuelCapacity,
        capacity,
        transmission,
        fuelType,
        carPrice,
        path,
      },
      (err, result) => {
        if (err) {
          console.error("Database Insertion Error:", err);
          return res.status(500).json({ error: "Error inserting data" });
        }
        res.status(200).json({ message: "Car data uploaded successfully" });
      }
    );
  } catch (error) {
    console.error("Cloudinary Upload or Database Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/userdata", (req, res) => {
  query3 = "select * from swiftrental";
  db.query(query3, (err, results6) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "failed", message: "error connecting database" });
    } else {
      console.log(results6);
      return res.status(200).json({ status: "success", message: results6 });
    }
  });
});

app.get("/cars", (req, res) => {
  let query3 = "select * from cars ";
  console.log("hii");
  db.query(query3, (err, results7) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "failed", message: "error connecting database" });
    } else {
      console.log(results7);
      return res.status(200).json({ status: "success", message: results7 });
    }
  });
});

app.post("/bookedcars", (req, res) => {
  const {
    carid,
    carname,
    carmodel,
    bookedbyname,
    bookedbyid,
    pickupdate,
    dropdate,
    carimagepath,
    bookingprice,
  } = req.body;

  console.log(carid);
  console.log(carname);
  console.log(bookedbyname);
  console.log(bookedbyid);
  console.log(pickupdate);
  console.log(dropdate);
  console.log(carimagepath);
  console.log(bookingprice);

  let query4 = "insert into bookedcars SET ?";
  db.query(
    query4,
    {
      carid,
      carname,
      carmodel,
      bookedbyname,
      bookedbyid,
      pickupdate,
      dropdate,
      carimagepath,
      bookingprice,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("data stored successfully");
      }
    }
  );
});

app.post("/updateuserstatus", (req, res) => {
  let { updateuserstatus } = req.body;
  const statusupdate =
    updateuserstatus.status === "active" ? "deactive" : "active";
  let query5 = "UPDATE swiftrental SET status = ? WHERE id = ?";

  db.query(query5, [statusupdate, updateuserstatus.id], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({ message: "updated" });
    }
  });
});

app.post("/usersbookedcars", (req, res) => {
  const { userid } = req.body;
  console.log(userid);
  let query = "select * from bookedcars where bookedbyid = ?";

  db.query(query, [userid], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      return res.json({ status: "success", data: results });
    }
  });
});

app.get("/adminbookedcars", (req, res) => {
  let query = "select * from bookedcars";

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      return res.json({ status: "success", data: results });
    }
  });
});

app.listen(8085, () => {
  console.log("port running");
});
