import Redis from "ioredis";
import { sendOtp } from "../services/otpService.js";
import { Op } from "sequelize";
import models from "../models/index.js";
import { sendOTPViaMail } from "../mail/mailController.js";
import generateToken from "../middleware/generate_token.js";

const { User } = models;
const redis = new Redis(); // Connect to Redis

const OTP_LIMIT = 5;
const BLOCK_DURATION = 10 * 60; // 10 minutes in seconds
const OTP_VERIFY_LIMIT = 3;

export const login = async (req, res) => {
  const { phone_number, email } = req.body;
  const identifier = phone_number || email;

  if (!identifier) {
    return res
      .status(400)
      .json({ status: false, message: "Phone number or Email is required" });
  }

  try {
    // Check rate limit
    const attempts = await redis.get(`otp_attempts:${identifier}`);
    const blockedUntil = await redis.get(`blocked:${identifier}`);

    if (blockedUntil) {
      return res.status(429).json({
        status: false,
        message: `Too many requests. Try again after ${Math.ceil(
          (blockedUntil - Date.now()) / 1000
        )} seconds.`,
      });
    }

    if (attempts && attempts >= OTP_LIMIT) {
      // Block the user for 10 minutes
      await redis.set(
        `blocked:${identifier}`,
        Date.now() + BLOCK_DURATION * 1000,
        "EX",
        BLOCK_DURATION
      );
      await redis.del(`otp_attempts:${identifier}`); // Reset attempts
      return res
        .status(429)
        .json({
          status: false,
          message: "Too many OTP requests. Try again in 10 minutes.",
        });
    }

    // Check if the user exists
    const user = await User.findOne({
      where: { [phone_number ? "phone_number" : "email"]: identifier },
    });

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not registered" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes

    user.otp = otp;
    user.otp_expiry = otpExpiry;
    await user.save();

    // Increment OTP request count
    await redis.incr(`otp_attempts:${identifier}`);
    await redis.expire(`otp_attempts:${identifier}`, 300); // Expire attempts in 5 minutes

    // Send OTP
    if (phone_number) {
      const otpUrl = `https://nimbusit.net/api/pushsms?user=ITnet&authkey=92D3fdWe78XU&sender=ESCORT&mobile=${phone_number}&text=Your%20Escorts%20Group%20verification%20code%20is%20${otp}`;
      const result = await sendOtp(otpUrl);
      if (!result.success)
        return res.status(500).json({ error: "Failed to send OTP" });
    } else {
      await sendOTPViaMail(otp, user.email, user.name, () =>
        res.status(200).json({ status: true, message: "OTP sent successfully" })
      );
    }

    res.status(200).json({ status: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify OTP API
export const verifyOtp = async (req, res) => {
  const { phone_number, email, otp } = req.body;
  const identifier = phone_number || email;

  if (!identifier || !otp) {
    return res
      .status(400)
      .json({
        status: false,
        message: "Phone number or Email and OTP are required",
      });
  }

  try {
    // Check if the user is blocked from OTP verification
    const blockedUntil = await redis.get(`otp_verify_blocked:${identifier}`);

    if (blockedUntil) {
      return res.status(429).json({
        status: false,
        message: `Too many incorrect attempts. Try again after ${Math.ceil(
          (blockedUntil - Date.now()) / 1000
        )} seconds.`,
      });
    }

    // Get the user's OTP verification attempts
    const attempts = await redis.get(`otp_verify_attempts:${identifier}`);

    if (attempts && attempts >= OTP_VERIFY_LIMIT) {
      // Block the user for 10 minutes
      await redis.set(
        `otp_verify_blocked:${identifier}`,
        Date.now() + BLOCK_DURATION * 1000,
        "EX",
        BLOCK_DURATION
      );
      await redis.del(`otp_verify_attempts:${identifier}`); // Reset attempts
      return res
        .status(429)
        .json({
          status: false,
          message: "Too many incorrect OTP attempts. Try again in 10 minutes.",
        });
    }

    // Check if the user exists
    const user = await User.findOne({
      where: { [phone_number ? "phone_number" : "email"]: identifier },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User not registered" });
    }

    // Check if OTP matches and is valid
    if (
      !user.otp ||
      user.otp !== otp ||
      new Date(user.otp_expiry) < new Date()
    ) {
      // Increment the OTP verification attempts
      await redis.incr(`otp_verify_attempts:${identifier}`);
      await redis.expire(`otp_verify_attempts:${identifier}`, 600); // Expire attempts in 10 minutes

      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired OTP" });
    }

    // OTP is valid - Reset OTP attempts
    await redis.del(`otp_verify_attempts:${identifier}`);

    // Generate Token
    const token = generateToken(user.id, user.email);

    // Clear OTP after successful verification
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    res
      .status(200)
      .json({
        status: true,
        message: "OTP verified successfully",
        token,
        user: {
          phone_number : user.phone_number,
          name : user.name,
          email : user.email,
          usertype : user.usertype,
          department_id : user.department_id,
          access_token : user.access_token,
          id : user.id
          
        },
      });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
