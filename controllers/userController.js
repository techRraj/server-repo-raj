// import userModel from "../models/userModel.js";
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import validator from 'validator';
// import razorpay from 'razorpay';
// import transactionModel from "../models/transactionModel.js";

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validate inputs
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Missing Details' });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Please enter a valid email" });
//     }

//     if (password.length < 8) {
//       return res.status(400).json({ success: false, message: "Please enter a strong password" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const userData = { name, email, password: hashedPassword };
//     const newUser = new userModel(userData);
//     const user = await newUser.save();

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//     res.status(201).json({ success: true, token, user: { name: user.name } });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "An unexpected error occurred" });
//   }
// };

// const loginUser = async (req, res) => {
  
//   try {
//     const { email, password } = req.body;

//     // Validate inputs
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "Email and password are required" });
//     }

//     // Find the user by email
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ success: false, message: "User does not exist" });
//     }

//     console.log("User document:", user); // Log the user document for debugging

//     // Compare the provided password with the hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid credentials" });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//     res.status(200).json({ success: true, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const userCredits = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get userId from the decoded JWT token

//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res.status(400).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({ success: true, credits: user.creditBalance, user: { name: user.name } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "An unexpected error occurred" });
//   }
// };

// // const razorpayInstance = new razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_KEY_SECRET,
// // });

// const paymentRazorpay = async (req, res) => {
//   try {
//     const { userId, planId } = req.body;
//     const userData = await userModel.findById(userId);

//     if (!userData || !planId) {
//       return res.status(400).json({ success: false, message: 'Missing Details' });
//     }

//     let credits, plan, amount;

//     switch (planId) {
//       case 'Basic':
//         plan = 'Basic';
//         credits = 25;
//         amount = 10;
//         break;
//       case 'Advanced':
//         plan = 'Advanced';
//         credits = 70;
//         amount = 30;
//         break;
//       case 'Premier':
//         plan = 'Premier';
//         credits = 150;
//         amount = 50;
//         break;
//       default:
//         return res.status(400).json({ success: false, message: 'Plan not found' });
//     }

//     const transactionData = {
//       userId,
//       plan,
//       amount,
//       credits,
//       date: Date.now(),
//     };

//     const newTransaction = await transactionModel.create(transactionData);

//     const options = {
//       amount: amount * 100,
//       currency: process.env.CURRENCY,
//       receipt: newTransaction._id.toString(),
//     };

//     razorpayInstance.orders.create(options, (error, order) => {
//       if (error) {
//         console.error("Razorpay error:", error);
//         return res.status(400).json({ success: false, message: "Failed to create Razorpay order" });
//       }
//       res.status(200).json({ success: true, order });
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "An unexpected error occurred" });
//   }
// };

// const verifyRazorpay = async (req, res) => {
//   try {
//     const { razorpay_order_id } = req.body;
//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

//     if (orderInfo.status !== 'paid') {
//       return res.status(400).json({ success: false, message: 'Payment Failed' });
//     }

//     const transactionData = await transactionModel.findById(orderInfo.receipt);

//     if (transactionData.payment) {
//       return res.status(400).json({ success: false, message: 'Payment already verified' });
//     }

//     const userData = await userModel.findById(transactionData.userId);

//     await userModel.findByIdAndUpdate(
//       userData._id,
//       { $inc: { creditBalance: transactionData.credits } },
//       { new: true }
//     );

//     await transactionModel.findByIdAndUpdate(
//       transactionData._id,
//       { payment: true },
//       { new: true }
//     );

//     res.status(200).json({ success: true, message: "Credits Added" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "An unexpected error occurred" });
//   }
// };

// export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };


import userModel from "../models/userModel.js";
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import validator from 'validator';
import razorpay from 'razorpay';
import transactionModel from "../models/transactionModel.js";

// Initialize Razorpay instance
// const razorpayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ success: true, token, user: { name: user.name } });

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// Get User Credits
const userCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, credits: user.creditBalance, user });
  } catch (error) {
    console.error("Credits Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to load user data" });
  }
};

// Initiate Razorpay Payment
const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    let credits, plan, amount;

    switch (planId) {
      case 'Basic':
        plan = 'Basic';
        credits = 25;
        amount = 10;
        break;
      case 'Advanced':
        plan = 'Advanced';
        credits = 70;
        amount = 30;
        break;
      case 'Premier':
        plan = 'Premier';
        credits = 150;
        amount = 50;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Plan not found' });
    }

    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date: Date.now(),
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100, // Convert to paise
      currency: process.env.CURRENCY || 'INR',
      receipt: newTransaction._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Order Creation Error:", error);
        return res.status(400).json({ success: false, message: "Failed to create Razorpay order" });
      }
      res.status(200).json({ success: true, order });
    });

  } catch (error) {
    console.error("Payment Initiation Error:", error.message);
    res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Order ID missing' });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment Failed' });
    }

    const transactionData = await transactionModel.findById(orderInfo.receipt);

    if (!transactionData) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transactionData.payment) {
      return res.status(400).json({ success: false, message: 'Payment already verified' });
    }

    const userData = await userModel.findById(transactionData.userId);

    await userModel.findByIdAndUpdate(
      userData._id,
      { $inc: { creditBalance: transactionData.credits } },
      { new: true }
    );

    await transactionModel.findByIdAndUpdate(
      transactionData._id,
      { payment: true },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Credits Added" });

  } catch (error) {
    console.error("Payment Verification Error:", error.message);
    res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };