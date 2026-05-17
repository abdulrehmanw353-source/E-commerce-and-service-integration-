import nodemailer from "nodemailer";
import {
   SMTP_HOST,
   SMTP_PORT,
   SMTP_USER,
   SMTP_PASS,
   SMTP_FROM_NAME,
   SMTP_FROM_EMAIL,
} from "../constants.js";

// ------ TRANSPORTER (lazy singleton)

let _transporter = null;

const getTransporter = () => {
   if (_transporter) return _transporter;

   if (!SMTP_USER || !SMTP_PASS) {
      console.warn("[email] SMTP credentials missing — emails will be logged to console only.");
      return null;
   }

   _transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
   });

   return _transporter;
};

// ------ GENERIC SEND

const sendEmail = async ({ to, subject, html, text }) => {
   const transporter = getTransporter();

   const mailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
   };

   if (!transporter) {
      // Fallback: log to console in dev when SMTP isn't configured
      console.log("─── EMAIL (console-only) ───");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Body:", text || html);
      console.log("────────────────────────────");
      return { messageId: "console-fallback", accepted: [to] };
   }

   const info = await transporter.sendMail(mailOptions);
   console.log(`[email] Sent to ${to} — messageId: ${info.messageId}`);
   return info;
};

// ------ TECHNICIAN REASSIGNMENT EMAIL

const sendTechnicianReassignmentEmail = async ({
   customerEmail,
   customerName,
   bookingId,
   oldTechnicianName,
   newTechnicianName,
   reassignmentReason,
   preferredDate,
   preferredTime,
}) => {
   const dateStr = preferredDate
      ? new Date(preferredDate).toLocaleDateString("en-US", {
           weekday: "long",
           month: "long",
           day: "numeric",
           year: "numeric",
        })
      : "N/A";

   const subject = `Booking Update — Technician Reassignment (#${bookingId?.slice(-8)?.toUpperCase()})`;

   const html = `
   <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9fb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6f50ff, #8c72ff); padding: 32px 24px; text-align: center;">
         <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0;">Technician Reassignment</h1>
         <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 8px 0 0;">Booking #${bookingId?.slice(-8)?.toUpperCase()}</p>
      </div>
      <div style="padding: 32px 24px;">
         <p style="font-size: 15px; color: #1d1d1f; margin: 0 0 16px;">
            Hi <strong>${customerName || "there"}</strong>,
         </p>
         <p style="font-size: 14px; color: #424245; line-height: 1.6; margin: 0 0 20px;">
            We're writing to let you know that the technician assigned to your booking has been updated.
         </p>

         <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
               <tr>
                  <td style="padding: 8px 0; color: #86868b; width: 140px;">Previous Technician</td>
                  <td style="padding: 8px 0; color: #1d1d1f; font-weight: 600;">${oldTechnicianName || "Not assigned"}</td>
               </tr>
               <tr>
                  <td style="padding: 8px 0; color: #86868b; border-top: 1px solid #f2f2f7;">New Technician</td>
                  <td style="padding: 8px 0; color: #6f50ff; font-weight: 600; border-top: 1px solid #f2f2f7;">${newTechnicianName}</td>
               </tr>
               <tr>
                  <td style="padding: 8px 0; color: #86868b; border-top: 1px solid #f2f2f7;">Scheduled Date</td>
                  <td style="padding: 8px 0; color: #1d1d1f; border-top: 1px solid #f2f2f7;">${dateStr}</td>
               </tr>
               <tr>
                  <td style="padding: 8px 0; color: #86868b; border-top: 1px solid #f2f2f7;">Time</td>
                  <td style="padding: 8px 0; color: #1d1d1f; border-top: 1px solid #f2f2f7;">${preferredTime || "N/A"}</td>
               </tr>
            </table>
         </div>

         ${reassignmentReason ? `
         <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #856404; font-weight: 600; margin: 0 0 6px;">Reason for Change</p>
            <p style="font-size: 14px; color: #664d03; line-height: 1.5; margin: 0;">${reassignmentReason}</p>
         </div>
         ` : ""}

         <p style="font-size: 14px; color: #424245; line-height: 1.6; margin: 0 0 8px;">
            Your booking schedule remains unchanged. If you have any questions, please don't hesitate to reach out via our support chat.
         </p>
         <p style="font-size: 14px; color: #86868b; margin: 24px 0 0;">
            — The ${SMTP_FROM_NAME} Team
         </p>
      </div>
      <div style="background: #f2f2f7; padding: 16px 24px; text-align: center;">
         <p style="font-size: 12px; color: #86868b; margin: 0;">This is an automated notification. Please do not reply to this email.</p>
      </div>
   </div>`;

   const text = `Hi ${customerName || "there"},\n\nYour booking technician has been updated.\n\nPrevious: ${oldTechnicianName || "Not assigned"}\nNew: ${newTechnicianName}\nDate: ${dateStr}\nTime: ${preferredTime || "N/A"}\n${reassignmentReason ? `Reason: ${reassignmentReason}\n` : ""}\nYour schedule remains unchanged.\n\n— ${SMTP_FROM_NAME} Team`;

   return sendEmail({ to: customerEmail, subject, html, text });
};

export { sendEmail, sendTechnicianReassignmentEmail };
