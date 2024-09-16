const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

//CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/rest-api")
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("Mongo errror", err));

//SCHEMAS

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

//Model
const User = mongoose.model("user", userSchema);

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()} : ${req.method} : ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

//Routes
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
          <ul>
              ${allDbUsers
                .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
                .join("")}
          </ul>
      `;
  res.send(html);
});

//ENDPOINTS
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});

  return res.json(allDbUsers);
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "user not found" });
  return res.json(user);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body.first_name ||
    !body.last_name ||
    !body.gender ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json("All fields are required");
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ msg: "Success" });
});

app.patch("/api/users/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { last_name: "Changed" });
  return res.json({ status: "success" });
});

app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "success" });
});

app.listen(PORT, () => console.log("Server is started at port 8000"));
