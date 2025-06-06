import { sendCommentUpdationMailToBuyer, sendCommentUpdationMailToSupplier } from "../mail/mailController.js";
import models from "../models/index.js";
import admin from "../notification/firebase_config.js";
import { DATE, Op } from "sequelize";
import { getCurrentDate } from "../utils.js";

const { Suggestion, SuggestionStatus, User, Device, Messages, Comments } =
  models;


  

export const createComment = async (req, res) => {
  try {
    const { suggestion_id, text, submitted_by, isAdmin } = req.body;
    const files = req.files || []; // Assuming files come in req.files
    const attachment = files.map((file) => file.path); // Extract file paths

    const comment = await Comments.create({
      suggestion_id,
      text,
      submitted_by,
      attachment: attachment[0],
    });

    console.log(isAdmin===true);
    
    
    if (isAdmin=='true') {
      console.log('Is admin');
      
      const suggestion = await Suggestion.findOne({
        where: {
          id: suggestion_id,
        },
      });

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

      await Suggestion.update(
      { buyer_email: suggestion.buyer_email },
      { where: { id: suggestion.id } }
    );

      await Messages.create({
        receiver_id: parseInt(suggestion.dataValues.submitted_by),
        title: `${submitted_by} Commented on your suggestion`,
        body: `${text}`,
      });

      if(device){
        const message = {
          token: device.dataValues.firebase_token,
          data: {
            title: `${submitted_by} Commented on your suggestion`,
            body: `${text}`,
          },
          android: {
            notification: {
              title: `${submitted_by} Commented on your suggestion`,
              body: `${text}`,
              sound: "default",
              priority: "high", // Ensure high priority for background notifications
            },
          },
          apns: {
            payload: {
              aps: {
                alert: {
                  title: `${submitted_by} Commented on your suggestion`,
                  body: `${text}`,
                },
                badge: 1,
                sound: "default",
              },
            },
          },
        };
        await admin.messaging().send(message);

      }
  
      sendCommentUpdationMailToSupplier(
        user.dataValues.email,
        user.dataValues.name,
        submitted_by
      );

        

    } else {
      const suggestion = await Suggestion.findOne({
        where: {
          id: suggestion_id,
        },
      });

      const adminUsers = await User.findOne({
        where: {
          email: suggestion.dataValues.buyer_email,
        },
      });
      

      const device = await Device.findOne({
        where: {
          phone_number: adminUsers.dataValues.phone_number,
        },
      });

      const user = await User.findOne({
        where: {
          id: suggestion.dataValues.submitted_by,
        },
      });

       await Suggestion.update(
      { buyer_email: suggestion.buyer_email },
      { where: { id: suggestion.id } }
    );

     
      await Messages.create({
        receiver_id: parseInt(adminUsers.dataValues.id),
        title: `${submitted_by} Commented on their suggestion`,
        body: `${text}`,
      });

      sendCommentUpdationMailToBuyer(
        adminUsers.dataValues.email,
        adminUsers.dataValues.name,
        submitted_by
      );

      if(device){
        const message = {
          token: device.dataValues.firebase_token,
          data: {
            title: `${submitted_by} Commented on his suggestion`,
            body: `${text}`,
          },
          android: {
            notification: {
              title: `${submitted_by} Commented on his suggestion`,
              body: `${text}`,
              sound: "default",
              priority: "high", // Ensure high priority for background notifications
            },
          },
          apns: {
            payload: {
              aps: {
                alert: {
                  title: `${submitted_by} Commented on his suggestion`,
                  body: `${text}`,
                },
                badge: 1,
                sound: "default",
              },
            },
          },
        };
  
        await admin.messaging().send(message);
      }
    

     
    }

    res.status(200).json({
      status: true,
      message: "Comment Added Successfully",
      data: comment,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ message: "Internal server error", error: e });
  }
};

export const getCommentBySuggestion = async (req, res) => {
  try {
    const { suggestion_id } = req.body;
    const comment = await Comments.findAll({
      where: {
        suggestion_id: suggestion_id,
      },
    });
    res.status(200).json({
      status: true,
      data: comment,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", error: e });
  }
};
