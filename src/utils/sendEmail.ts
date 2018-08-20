import Mailgun from "mailgun-js";

const mailGuncClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "",
  domain: "sandboxc169c9a6681c4729a8bd36f2dffed4a0.mailgun.org"
});

// const sendEmail = (to : string, subject: string, html: string) => {
// 위와 같은 방식으로 하면 to까지 지정해서 보낼수 있다 단, 이건 유료계정
const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: "yooja.ty@gmail.com",
    to: "yooja.ty@gmail.com",
    subject,
    html
  };
  return mailGuncClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email`;
  const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here</a>`;
  //임읠 만든 것
  return sendEmail(emailSubject, emailBody);
};
