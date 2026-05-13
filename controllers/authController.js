const User = require("../models/User.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// ═════════════════ REGISTER ═════════════════

const registerUser = async (req, res) => {

  try {

    // Get data from frontend
    const { email, password, confirmPassword } = req.body

    // Check empty fields
    if (!email || !password || !confirmPassword) {

      return res.status(400).json({
        message: "All fields are required"
      })

    }

    // Check password match
    if (password !== confirmPassword) {

      return res.status(400).json({
        message: "Passwords do not match"
      })

    }

    // Check existing email
    const userExists = await User.findOne({ email })

    if (userExists) {

      return res.status(400).json({
        message: "Email already exists"
      })

    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    })

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Success response
    res.status(201).json({
      message: "Registration Successful",
      token
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

// ═════════════════ LOGIN ═════════════════

const loginUser = async (req, res) => {

  try {

    // Get frontend data
    const { email, password } = req.body

    // Check empty fields
    if (!email || !password) {

      return res.status(400).json({
        message: "All fields are required"
      })

    }

    // Find user
    const user = await User.findOne({ email })

    // Check user exists
    if (!user) {

      return res.status(400).json({
        message: "Invalid Email"
      })

    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    // Wrong password
    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Password"
      })

    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Success response
    res.status(200).json({
      message: "Login Successful",
      token
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

module.exports = {
  registerUser,
  loginUser
}