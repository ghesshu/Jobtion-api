const nodeMailer = require("nodemailer");
const axios = require("axios");
const { config } = require("dotenv");

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
          message: response.message,
        }
      : {
          message: response.message,
        };

  return transFormData;
};

const Email = async (to, message) => {
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
    subject: "Testing", // Subject line
    text: message, // plain text body
    html: `<b>${message}</b>`, // html body
  });

  // console.log("Message sent: %s", info);

  const transformSentResponse = {
    accepted: info.accepted,
    rejected: info.rejected,
    messageId: info.messageId,
  };

  return transformSentResponse;
};

module.exports = { SMS, Email };
