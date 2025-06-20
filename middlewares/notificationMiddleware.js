const nodeMailer = require("nodemailer");
const axios = require("axios");
const { config } = require("dotenv");
const logger = require("./../utils/logger");

config();
const SMS = async (contacts, message) => {
  const apiKey = process.env.SMS_API_KEY;
  const endPoint = process.env.SMS_URL;
  const data = {
    recipient: [contacts],
    sender: process.env.SENDER_ID,
    message: message,
    // 'is_schedule': 'false',
    // 'schedule_date': ''
  };
  let url = endPoint + "?key=" + apiKey;
  const config = {
    method: "post",
    // path: url,
    headers: {
      Accept: "application/json",
    },
    data: data,
  };
  const response = await axios(url, config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });

  const transFormData =
    response.code === "2000"
      ? {
          status: 1000,
          to: contacts,
          message: response.message,
        }
      : {
          to: contacts,
          message: response.message,
        };

  logger("sms").info("SMS Response : ", transFormData);

  return transFormData;
};

const Email = async (to, message) => {
  try {
    let transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      //   from: process.env.EMAIL_USERNAME, // sender address
      from: process.env.EMAIL_USERNAME,
      to: to, // list of receivers
      subject: "Jobtion", // Subject line
      text: message, // plain text body
      html: `${message}`, // html body
    });

    const transformSentResponse = {
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
    };

    logger("email").info("Email Response : ", transformSentResponse);

    return true;
  } catch (error) {
    const mainError =
      error.rejectedErrors?.[0]?.response || error.message || error;
    logger("email").error("Email Response : ", { mainError });
    return false;
  }
};

const ApplicationEmail = async (to, message, title) => {
  try {
    let transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME, // sender address
      to: to, // list of receivers
      subject: "Confirmation of Application for " + title, // Subject line
      text: message, // plain text body
      html: `${message}`, // html body
    });

    const transformSentResponse = {
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
    };

    logger("email").info("Email Response : ", transformSentResponse);
    return true;
  } catch (error) {
    // Fix: Use optional chaining to prevent TypeError
    const mainError =
      error.rejectedErrors?.[0]?.response || error.message || error;
    logger("email").error("Email Response : ", { mainError });
    return false;
  }
};

module.exports = { SMS, Email, ApplicationEmail };
