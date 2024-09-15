const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

//Routes
app.get("/users", (req, res) => {
  const html = `
          <ul>
              ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
          </ul>
      `;
  res.send(html);
});

//ENDPOINTS
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.listen(PORT, () => console.log("Server is started at port 8000"));
