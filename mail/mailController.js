import { createTransport } from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.IP ;


let transporter = createTransport({
  port: 587, // true for 465, false for other ports
  host: "smtp.sendgrid.net",
  auth: {
    user: process.env.SENDGRIDUSER,
    pass: process.env.SENDGRIDPASSWORD,
  },
  // secure :true
});

export async function sendOTPViaMail(
  otp,
  receiver,
  name,
  onSuccess,
  onFail,
  onCatch
) {
  const mailData = {
    from: "noreply.ekl@escortskubota.com", // sender address
    to: receiver, // list of receivers
    subject: "OTP for Authentication",
    text: "OTP",
    html: `<p>Dear, <b>${name} </b> </p>
        <br>
        <br>
        Your One time password for EKL supplier suggest login is  <b>${otp}</b>
        <br>
        <br>
         <br>
        Escort Kubota Limited
        <br>
         <br>
          <br>
        <img src='https://www.escortskubota.com/_next/image?url=%2Flogo.png&w=3840&q=75'>`,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log(err);
        
        onFail();
      } else {
        onSuccess();
      }
    });
  } catch (e) {
    console.log(e);
    onCatch(e);
  }
}

export async function sendSuggestionCreationMail(receiver, name) {
  const mailData = {
    from: "noreply.ekl@escortskubota.com", // sender address
    to: receiver, // list of receivers
    subject: "Suggestion Received",
    html: `
        <header>Supplier Suggest</header>
        <p>Dear, <b>${name} </b> </p>
        <br>
        <br>
        <h3>You have received a new suggestion from a supplier, please login to EKL Supplier Siggest Portal to view the suggestion and proceed accordingly</h3>
        <br>
        <br>
        <br>
        <a target="blank" href="${host}">Click here</a>
        <br>
        <br>
        <br>
        <footer>
        <img src='https://www.escortskubota.com/_next/image?url=%2Flogo.png&w=3840&q=75'>,
        </footer>`,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log("Error Sending Mail : " + err);
      } else {
        console.log("Mail Sent");
      }
    });
  } catch (e) {
    console.log(e);
    onCatch();
  }
}



export async function sendCommentUpdationMailToSupplier(receiver, name, admin) {
  const mailData = {
    from: "noreply.ekl@escortskubota.com", // sender address
    to: receiver, // list of receivers
    subject: "Comment Added",
    html: `
        <header>Supplier Suggest</header>
        <p>Dear, <b>${name} </b> </p>
        <br>
        <br>
        <h3>${admin} has added a new comment on your suggestion</h3>
        <br>
        <br>
        <br>
        <a target="blank" href="${host}">Click here</a>
        <br>
        <br>
        <br>
        <footer>
        <img src='https://www.escortskubota.com/_next/image?url=%2Flogo.png&w=3840&q=75'>,
        </footer>`,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log("Error Sending Mail : " + err);
      } else {
        console.log("Mail Sent");
      }
    });
  } catch (e) {
    console.log(e);
    onCatch();
  }
}


export async function sendCommentUpdationMailToBuyer(receiver, buyer , supplier) {
  const mailData = {
    from: "noreply.ekl@escortskubota.com", // sender address
    to: receiver, // list of receivers
    subject: "Comment Added",
    html: `
        <header>Supplier Suggest</header>
        <p>Dear, <b>${buyer} </b> </p>
        <br>
        <br>
        <h3>${supplier} has added a new comment on their suggestion</h3>
        <br>
        <br>
        <br>
        <a target="blank" href="${host}">Click here</a>
        <br>
        <br>
        <br>
        <footer>
        <img src='https://www.escortskubota.com/_next/image?url=%2Flogo.png&w=3840&q=75'>,
        </footer>`,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log("Error Sending Mail : " + err);
      } else {
        console.log("Mail Sent");
      }
    });
  } catch (e) {
    console.log(e);
    onCatch();
  }
}

export async function sendStatusChangeMail(receiver, supplier, status) {
  const mailData = {
    from: "noreply.ekl@escortskubota.com", // sender address
    to: receiver, // list of receivers
    subject: "Status Changed",
    html: `
        <header>Supplier Suggest</header>
        <p>Dear, <b>${supplier} </b> </p>
        <br>
        <br>
        <h3> The status of your suggestion has been changed to ${status}</h3>
        <br>
        <br>
        <br>
        <a target="blank" href="${host}">Click here</a>
        <br>
        <br>
        <br>
        <footer>
        <img src='https://www.escortskubota.com/_next/image?url=%2Flogo.png&w=3840&q=75'>,
        </footer>`,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log("Error Sending Mail : " + err);
      } else {
        console.log("Mail Sent");
      }
    });
  } catch (e) {
    console.log(e);
    onCatch();
  }
}
