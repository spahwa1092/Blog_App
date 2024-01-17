const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const OTP = require('../models/OTP')
//REGISTER
  router.post("/register", async (req, res) => {
    try {

      const {otp} = req.body;
      console.log(otp);
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
      });

      const response = await OTP.find({email:req.body.email}).sort({createdAt:-1}).limit(1);
          console.log(response);

          if(response.length===0){
            console.log("length zero");
              return res.status(400).json({
                  success:false,
                  message:"The OTP is  not valid",
              })
          }else if(otp!==response[0].otp){
            console.log("not valid")
              return res.status(400).json({
                  success:false,
                  message:"The OTP is Invalid",
              })
          }

      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log("hello");
    }
  });

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/otp", async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP func");
    console.log("OTP", otp);
    console.log("Result", result);

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("otp body", otpBody);

    res.status(200).json({
      success: true,
      message: "'OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log("error while opt gen")
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
