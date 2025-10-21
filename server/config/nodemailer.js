import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_STMP_HOST,
    port: process.env.BREVO_STMP_PORT,
    auth: {
        user: process.env.BREVO_STMP_USER,
        pass: process.env.BREVO_STMP_PASSWORD,
    },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send messages");
  }
});

export default transporter;