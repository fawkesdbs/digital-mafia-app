const OTP = require("./model");
const generateOTP = require("./../../util/generateOTP");
const sendEmail = require("./../../util/sendEmail");
const { hashData, verifyHashedData } = require("./../../util/hashData");
const { AUTH_EMAIL } = process.env;

const verifyOTP = async ({ email, otp }) => {
  try {
    if (!(email && otp)) {
      throw Error("Provide values for email, otp");
    }

    // ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({ where: { email } });

    if (!matchedOTPRecord) {
      throw Error("No otp records found");
    }

    const { expiresAt } = matchedOTPRecord;

    // checking if code has expired
    if (expiresAt < Date.now()) {
      await OTP.destroy({ where: { email } });
      throw Error("Code has expired. Request a new one.");
    }

    // not expired yet, verify code
    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await verifyHashedData(otp, hashedOTP);
    return validOTP;
  } catch (error) {
    throw error;
  }
};

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error("Provide values for email, subject, message");
    }

    // clear any old record
    await OTP.destroy({ where: { email } });

    // generate PIN
    const generatedOTP = await generateOTP();

    // send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This code <b>expires in ${duration} hours</b>.</p>`,
    };
    await sendEmail(mailOptions);

    // save otp record
    const hashedOTP = await hashData(generatedOTP);
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * duration,
    });
    console.log(newOTP);

    return newOTP;
  } catch (error) {
    throw error;
  }
};

const deleteOTP = async (email) => {
  try {
    await OTP.destroy({ where: { email } });
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOTP, verifyOTP, deleteOTP };
