import db from "../models/index.js";

const { Messages } = db;

// export const sendPushNotification = async (req, res) => {
//   try {
//     const { data } = req.body;

//     if (!data) {
//       return res
//         .status(400)
//         .json({ status: false, message: "data is required" });
//     }

//     // Fetch the device token from the database using the phone number
//     const device = await Device.findAll();

//     // if (!device) {
//     //     return res.status(404).json({ status: false, message: 'Device not found for the provided phone number' });
//     // }

//     device.forEach(async (e) => {
//       const message = {
//         token: e.firebase_token,
//         data: data, // Optional data payload
//         android: {
//           notification: {
//             title: data["title"], // Title for Android notification
//             body: data["body"], // Body for Android notification
//             sound: "default",
//             priority: "high", // Ensure high priority for background notifications
//           },
//         },
//         apns: {
//           payload: {
//             aps: {
//               alert: {
//                 title: data["title"], // Title for iOS notification
//                 body: data["body"], // Body for iOS notification
//               },
//               badge: 1,
//               sound: "default",
//             },
//           },
//         },
//       };

//       // Send a message to the device corresponding to the provided token
//       try {
//         await admin.messaging().send(message);
//       } catch (e) {
//         console.error("Error sending notification:", e);
//       }
//     });

//     await Messages.create({
//       title: data["title"],
//       body: data["body"],
//     });

//     res
//       .status(200)
//       .json({ status: true, message: "Push notification sent successfully" });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Failed to send push notification",
//       error: error.message,
//     });
//   }
// };

export const getNotificationofUser = async (req, res) => {
  const { receiver_id } = req.body;
  try {
    const messages = await Messages.findAll({
      where: {
        receiver_id: receiver_id,
      },
      order: [["createdAt", "DESC"]], 
      limit : 10
    });

    const messageCount = await Messages.count({
      where: {
        receiver_id: receiver_id,
        status: 0,
      },
    });

    res.status(200).json({ status: true, messages, unreadCount: messageCount });
  } catch (error) {
    console.error("Error getting push notification:", error.message);
    res.status(500).json({
      status: false,
      message: "Failed to get push notification",
      error: error.message,
    });
  }
};

export const openNotifications = async (req, res) => {
  const { receiver_id } = req.body;
  try {
    const message  = await Messages.update(
      { status: 1 },
      {
        where: {
          receiver_id: receiver_id,
        },
      }
    );
    res.status(200).json({ status: true, message : "Marked as read" });
  } catch (error) {
    console.error("Error getting push notification:", error.message);
    res.status(500).json({
      status: false,
      message: "Failed to get push notification",
      error: error.message,
    });
  }
};
