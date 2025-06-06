import db from "../models/index.js";
import { Op } from "sequelize";

const { Device } = db;

export const storeDeviceDetails = async (req, res) => {
  try {
    const { phone_number, firebase_token, device_name, email } = req.body;

    if (!email || !firebase_token || !device_name) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    // Check if a device with the same device_name already exists
    let device = await Device.findOne({
      where: {
        email: email
      },
    });

    console.log(device?.dataValues);
    
    if (device) {
      // Update the existing device details
      device.firebase_token = firebase_token;
      device.device_name = device_name;
      if(phone_number){
        device.phone_number = phone_number;
      }
      device.email = email;
      await device.save();
      return res.status(200).json({
        status: true,
        message: "Device details updated successfully",
        device,
      });
    }
    // Create a new device record if none exists
    device = await Device.create({
      phone_number,
      firebase_token,
      device_name,
      email,
    });

    res.status(201).json({
      status: true,
      message: "Device details stored successfully",
      device,
    });
  } catch (error) {
    console.error("Error details:", error.message);
    res.status(500).json({
      status: false,
      message: "Failed to store device details",
      error: error.message,
    });
  }
};
