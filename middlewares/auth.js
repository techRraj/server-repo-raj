// import jwt from 'jsonwebtoken';

// const authUser = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const token = authHeader.split(' ')[1]; // Extract the token

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach the decoded token to req.user
//         next();
//     } catch (error) {
//         console.error("JWT verification failed:", error.message);
//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };

// export default authUser;

import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;