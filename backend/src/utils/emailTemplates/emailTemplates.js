// src/utils/emailTemplates.js

export const verificationEmailTemplate = (username, verifyUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email | FitX</title>
</head>

<body style="margin:0; padding:0; background:#0b0b0b; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">

  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; color:#000000;">
    Verify your FitX account and start your fitness journey today.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 10px;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#111111; border-radius:12px; overflow:hidden; box-shadow:0 0 30px rgba(255,0,0,0.25);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#000000; padding:30px;">
              <img src="https://res.cloudinary.com/djyusoukf/image/upload/v1767867054/logo_xsgvdk.png"
                alt="FitX Logo"
                style="max-width:220px; display:block;" />
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:35px 30px 10px 30px;">
              <h1 style="margin:0; color:#ff1f1f; font-size:28px; letter-spacing:1px;">
                WELCOME TO FITX
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:10px 30px 30px 30px; color:#e5e5e5;">
              <p style="font-size:17px; line-height:1.6; margin:0 0 15px;">
                Hey <strong style="color:#ffffff;">${username}</strong> 👋
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 20px;">
                You’re officially one step away from unlocking your <strong>premium fitness experience</strong>.
                Verify your email to activate your FitX account and start tracking your workouts like a pro.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:35px 0;">
                <a href="${verifyUrl}"
                  style="
                    background:linear-gradient(135deg, #ff1f1f, #b30000);
                    color:#ffffff;
                    padding:16px 36px;
                    font-size:16px;
                    font-weight:bold;
                    text-decoration:none;
                    border-radius:50px;
                    display:inline-block;
                    letter-spacing:0.5px;
                    box-shadow:0 0 15px rgba(255,31,31,0.6);
                  ">
                  VERIFY EMAIL
                </a>
              </div>

              <p style="font-size:14px; color:#9ca3af; text-align:center;">
                ⏳ This link will expire in <strong>24 hours</strong>
              </p>

              <hr style="border:none; border-top:1px solid #2a2a2a; margin:35px 0;" />

              <!-- Features -->
              <p style="font-size:16px; margin-bottom:10px; color:#ffffff;">
                What you’ll unlock:
              </p>

              <ul style="padding-left:18px; margin:10px 0; color:#c7c7c7; font-size:15px; line-height:1.7;">
                <li>🏋️ Personalized workout tracking</li>
                <li>🔥 Calories & progress analytics</li>
                <li>🎯 Goal setting & streaks</li>
                <li>📊 Visual performance insights</li>
              </ul>

              <p style="margin-top:25px; font-size:15px; color:#c7c7c7;">
                Discipline builds legends.  
                <strong style="color:#ff1f1f;">Let’s train smart.</strong> 💪
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#000000; padding:22px; text-align:center; font-size:12px; color:#9ca3af;">
              <p style="margin:0;">
                © ${new Date().getFullYear()} FitX • All Rights Reserved
              </p>
              <p style="margin:8px 0 0;">
                <a href="#" style="color:#ff1f1f; text-decoration:none;">Website</a> ·
                <a href="mailto:support@fitx.com" style="color:#ff1f1f; text-decoration:none;">Support</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export const resetPasswordTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>
<body style="background:#0b0b0b; color:#ffffff; font-family:Arial; padding:30px;">
  <h2 style="color:#ff1f1f;">Reset Your Password</h2>
  <p style="font-size:16px;">
    Click the button below to reset your password. This link expires in 15 minutes.
  </p>
  <a href="${resetUrl}"
    style="
      display:inline-block;
      margin-top:20px;
      background:#ff1f1f;
      color:#ffffff;
      padding:14px 28px;
      text-decoration:none;
      font-weight:bold;
      border-radius:40px;
    ">
    RESET PASSWORD
  </a>
</body>
</html>
`;
