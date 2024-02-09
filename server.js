const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit-form", async (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    return res.json({ success: false, msg: "Please complete the captcha" });
  }

  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.captcha}`;
  //   console.log(process.env.SECRET_KEY, req.body.captcha);

  try {
    const response = await axios.get(verifyUrl);
    console.log(response);
    const data = await response.json();

    if (data.success) {
      return res.json({ success: true, msg: "Captcha verified" });
    } else {
      return res.json({ success: false, msg: "Captcha Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
