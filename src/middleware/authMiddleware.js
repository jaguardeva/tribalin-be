// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Gunakan generateJwtSecret yang sama
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Token expired",
      });
    }

    return res.status(403).json({
      status: 403,
      success: false,
      message: "Failed to authenticate token",
      error: error.message,
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: 403,
      success: false,
      message: "Access denied",
    });
  }

  next();
};
