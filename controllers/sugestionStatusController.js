import { sendStatusChangeMail } from "../mail/mailController.js";
import models from "../models/index.js";
import admin from "../notification/firebase_config.js";
import { getCurrentDate } from "../utils.js";

const { Suggestion, SuggestionStatus, User, Device, Messages } = models;

export const getSuggestionStatus = async (req, res) => {
  try {
    const { suggestion_id } = req.body;

    // Check if the status is valid

    // Update the status
    const status = await SuggestionStatus.findOne({ where: { suggestion_id } });

    res.status(200).json({
      status: true,
      data: status,
    });
  } catch (e) {
    console.error("Error updating suggestion status:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSuggestionStatus = async (req, res) => {
  try {
    const { suggestion_id, status } = req.body;

    // Check if the status is valid
    const validStatuses = ["in review", "approved", "declined"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value.",
      });
    }

    // Update the status
    const updated = await SuggestionStatus.update(
      { status },
      { where: { suggestion_id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({
        status: false,
        message: "Suggestion not found.",
      });
    }

    const suggestion = await Suggestion.findOne({
      where: {
        id: suggestion_id,
      },
    });

    console.log(suggestion);

    // suggestion.updatedAt = getCurrentDate(); // or getCurrentDate()
    // suggestion.buyer_email = suggestion.buyer_email ;
    // await suggestion.save();

    await Suggestion.update(
      { buyer_email: suggestion.buyer_email },
      { where: { id: suggestion.id } }
    );

    const user = await User.findOne({
      where: {
        id: suggestion.dataValues.submitted_by,
      },
    });

    const device = await Device.findOne({
      where: {
        phone_number: user.dataValues.phone_number,
      },
    });

    if (device) {
      const message = {
        token: device.firebase_token,
        data: {
          title: "Status Changed",
          body: `The status of your suggestion has been changed to ${status}`,
        },
        android: {
          notification: {
            title: "Status Changed",
            body: `The status of your suggestion has been changed to ${status}`,
            sound: "default",
            priority: "high", // Ensure high priority for background notifications
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: "Status Changed",
                body: `The status of your suggestion has been changed to ${status}`,
              },
              badge: 1,
              sound: "default",
            },
          },
        },
      };

      await admin.messaging().send(message);
    }

    await Messages.create({
      receiver_id: parseInt(suggestion.dataValues.submitted_by),
      title: "Status Changed",
      body: `the status of your suggestion has been changed to ${status}`,
    });

    sendStatusChangeMail(user.dataValues.email, user.dataValues.name, status);

    res.status(200).json({
      status: true,
      message: "Suggestion status updated successfully.",
    });
  } catch (e) {
    console.error("Error updating suggestion status:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
