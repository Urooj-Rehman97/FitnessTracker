import transporter from "../../config/nodemailer.config.js";


export const adminEmailupdates = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"FitX Admin" <noreply@FitX.com>',
      to,
      subject,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; background: #111; color: #fff; border-radius: 12px;">
        <h2>Fit X Account Update</h2>
        ${html}
        <p style="margin-top: 20px; color: #aaa; font-size: 12px;">This is an automated message.</p>
      </div>`,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
};

