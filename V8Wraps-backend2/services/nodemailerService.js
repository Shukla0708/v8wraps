// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function sendBookingEmail(data,file) {
//   const mailOptions = {
//     from: `"V8 Wraps Booking" <${process.env.EMAIL_USER}>`,
//     to: process.env.EMAIL_USER,
//     subject: "New Quotation Request",
//     html: `
//       <h2>New Quotation Request</h2>
//       <p><b>Name:</b> ${data.name}</p>
//       <p><b>Phone:</b> ${data.phone}</p>
//       <p><b>Email:</b> ${data.email}</p>
//       <p><b>Service:</b> ${data.service}</p>
//       <p><b>Date:</b> ${data.date}</p>
//       <p><b>Message:</b> ${data.message}</p>
//     `,
//     attachments: file
//       ? [
//           {
//             filename: file.originalname,
//             content: file.buffer,
//           },
//         ]
//       : [],
//   };

//   await transporter.sendMail(mailOptions);
// }

// async function sendContactEmail(data) {
//   const mailOptions = {
//     from: `"Contact Form" <${process.env.EMAIL_USER}>`,
//     to: process.env.EMAIL_USER,
//     subject: "New Contact Message",
//     html: `
//       <h3>Contact Inquiry</h3>
//       <p><b>Name:</b> ${data.name}</p>
//       <p><b>Email:</b> ${data.email}</p>
//       <p><b>Message:</b> ${data.message}</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }

// async function sendPaymentConfirmationEmail({ bookingData, paymentData }) {
//   try {
//     // Email to business owner
//     const businessMailOptions = {
//       from: `"V8 Wraps Payment" <${process.env.EMAIL_USER}>`,
//       to: process.env.EMAIL_USER,
//       subject: `Payment Confirmed - ${bookingData.service} Booking`,
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
//           <h2 style="color: #f97316; text-align: center;">💳 Payment Confirmed!</h2>
          
//           <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: #374151; margin-top: 0;">Booking Details</h3>
//             <p><b>Booking ID:</b> ${bookingData.bookingId}</p>
//             <p><b>Customer Name:</b> ${bookingData.name}</p>
//             <p><b>Service:</b> ${bookingData.service}</p>
//             <p><b>Date:</b> ${bookingData.date}</p>
//           </div>

//           <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: #374151; margin-top: 0;">Payment Information</h3>
//             <p><b>Payment ID:</b> ${paymentData.orderId}</p>
//             <p><b>Amount:</b> ${paymentData.currency} $${paymentData.amount}</p>
//             <p><b>Payer ID:</b> ${paymentData.payerId}</p>
//             <p><b>Status:</b> <span style="color: #059669; font-weight: bold;">${paymentData.status}</span></p>
//             <p><b>Payment Date:</b> ${new Date().toLocaleString()}</p>
//           </div>

//           <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
//             <p style="margin: 0; color: #92400e;">
//               <b>Next Steps:</b> The customer has been notified and their booking is confirmed. 
//               Please prepare for the appointment on ${bookingData.date}.
//             </p>
//           </div>
//         </div>
//       `,
//     };

//     // Email to customer
//     const customerMailOptions = {
//       from: `"V8 Wraps" <${process.env.EMAIL_USER}>`,
//       to: bookingData.email || paymentData.bookingData?.email,
//       subject: "Booking Confirmed - Payment Successful",
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
//           <h2 style="color: #f97316; text-align: center;">🎉 Booking Confirmed!</h2>
          
//           <p>Dear ${bookingData.name},</p>
          
//           <p>Thank you for your payment! Your booking has been confirmed.</p>

//           <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: #374151; margin-top: 0;">Your Booking Details</h3>
//             <p><b>Booking Reference:</b> ${bookingData.bookingId}</p>
//             <p><b>Service:</b> ${bookingData.service}</p>
//             <p><b>Date:</b> ${bookingData.date}</p>
//             <p><b>Amount Paid:</b> ${paymentData.currency} $${paymentData.amount}</p>
//           </div>

//           <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: #374151; margin-top: 0;">Payment Receipt</h3>
//             <p><b>Transaction ID:</b> ${paymentData.orderId}</p>
//             <p><b>Payment Method:</b> PayPal</p>
//             <p><b>Payment Date:</b> ${new Date().toLocaleString()}</p>
//           </div>

//           <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
//             <p style="margin: 0; color: #065f46;">
//               <b>What's Next?</b><br>
//               • We'll contact you 24-48 hours before your appointment<br>
//               • Please bring your vehicle on the scheduled date<br>
//               • If you need to reschedule, contact us at least 48 hours in advance
//             </p>
//           </div>

//           <div style="text-align: center; margin: 30px 0;">
//             <p>Questions? Contact us:</p>
//             <p>📧 ${process.env.EMAIL_USER}<br>
//             📱 Your phone number here</p>
//           </div>

//           <div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px;">
//             <p>V8 Wraps - Professional Vehicle Customization</p>
//             <p>This is an automated confirmation email.</p>
//           </div>
//         </div>
//       `,
//     };
//     console.log(bookingData);
//     console.log(paymentData);
//     // Send both emails
//     await Promise.all([
//       transporter.sendMail(businessMailOptions),
//       transporter.sendMail(customerMailOptions)
//     ]);

//     console.log("✅ Payment confirmation emails sent successfully");

//   } catch (error) {
//     console.error("❌ Error sending payment confirmation emails:", error);
//     throw error;
//   }
// }

// async function sendBookingReminderEmail(bookingData) {
//   const customerMailOptions = {
//     from: `"V8 Wraps Reminder" <${process.env.EMAIL_USER}>`,
//     to: bookingData.email,
//     subject: "Appointment Reminder - V8 Wraps",
//     html: `
//       <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
//         <h2 style="color: #f97316; text-align: center;">📅 Appointment Reminder</h2>
        
//         <p>Dear ${bookingData.name},</p>
        
//         <p>This is a friendly reminder about your upcoming appointment with V8 Wraps.</p>

//         <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//           <h3 style="color: #374151; margin-top: 0;">Appointment Details</h3>
//           <p><b>Service:</b> ${bookingData.service}</p>
//           <p><b>Date:</b> ${bookingData.date}</p>
//           <p><b>Booking Reference:</b> ${bookingData.bookingId}</p>
//         </div>

//         <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
//           <p style="margin: 0; color: #92400e;">
//             <b>Please Remember:</b><br>
//             • Arrive 15 minutes early<br>
//             • Ensure your vehicle is clean<br>
//             • Remove all personal items from your vehicle<br>
//             • Bring a valid ID and your booking reference
//           </p>
//         </div>

//         <p>We look forward to seeing you!</p>

//         <div style="text-align: center; margin: 30px 0;">
//           <p>Need to reschedule? Contact us immediately:</p>
//           <p>📧 ${process.env.EMAIL_USER}</p>
//         </div>
//       </div>
//     `,
//   };

//   await transporter.sendMail(customerMailOptions);
// }

// module.exports = { 
//   sendBookingEmail, 
//   sendContactEmail, 
//   sendPaymentConfirmationEmail, 
//   sendBookingReminderEmail 
// };

const nodemailer = require("nodemailer");
const fetch = require('node-fetch'); // You might need to install this: npm install node-fetch

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBookingEmail(data, file) {
  let attachments = [];
  
  // Handle file attachments from Cloudinary
  if (file) {
    if (file.buffer) {
      // Traditional multer memory storage
      attachments = [{
        filename: file.originalname,
        content: file.buffer,
      }];
    } else if (file.cloudinaryUrl || file.path) {
      // Cloudinary URL - include in email body instead of attachment
      // Or you could fetch the file and attach it
      console.log("📎 File uploaded to Cloudinary:", file.cloudinaryUrl || file.path);
    }
  }

  const fileInfo = file ? 
    (file.cloudinaryUrl || file.path ? 
      `<p><b>Uploaded File:</b> <a href="${file.cloudinaryUrl || file.path}" target="_blank">${file.originalname}</a></p>` : 
      `<p><b>File:</b> ${file.originalname}</p>`
    ) : '';

  const mailOptions = {
    from: `"V8 Wraps Booking" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Quotation Request",
    html: `
      <h2>New Quotation Request</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Service:</b> ${data.service}</p>
      <p><b>Date:</b> ${data.date}</p>
      <p><b>Message:</b> ${data.message}</p>
      ${fileInfo}
    `,
    attachments: attachments,
  };

  await transporter.sendMail(mailOptions);
}

async function sendContactEmail(data) {
  const mailOptions = {
    from: `"Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Contact Message",
    html: `
      <h3>Contact Inquiry</h3>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Message:</b> ${data.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendPaymentConfirmationEmail({ bookingData, paymentData }) {
  try {
    // Email to business owner
    const businessMailOptions = {
      from: `"V8 Wraps Payment" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Payment Confirmed - ${bookingData.service} Booking`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #f97316; text-align: center;">💳 Payment Confirmed!</h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Booking Details</h3>
            <p><b>Booking ID:</b> ${bookingData.bookingId}</p>
            <p><b>Customer Name:</b> ${bookingData.name}</p>
            <p><b>Service:</b> ${bookingData.service}</p>
            <p><b>Date:</b> ${bookingData.date}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Payment Information</h3>
            <p><b>Payment ID:</b> ${paymentData.orderId}</p>
            <p><b>Amount:</b> ${paymentData.currency} $${paymentData.amount}</p>
            <p><b>Payer ID:</b> ${paymentData.payerId}</p>
            <p><b>Status:</b> <span style="color: #059669; font-weight: bold;">${paymentData.status}</span></p>
            <p><b>Payment Date:</b> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <b>Next Steps:</b> The customer has been notified and their booking is confirmed. 
              Please prepare for the appointment on ${bookingData.date}.
            </p>
          </div>
        </div>
      `,
    };

    // Email to customer
    const customerMailOptions = {
      from: `"V8 Wraps" <${process.env.EMAIL_USER}>`,
      to: bookingData.email || paymentData.bookingData?.email,
      subject: "Booking Confirmed - Payment Successful",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #f97316; text-align: center;">🎉 Booking Confirmed!</h2>
          
          <p>Dear ${bookingData.name},</p>
          
          <p>Thank you for your payment! Your booking has been confirmed.</p>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Booking Details</h3>
            <p><b>Booking Reference:</b> ${bookingData.bookingId}</p>
            <p><b>Service:</b> ${bookingData.service}</p>
            <p><b>Date:</b> ${bookingData.date}</p>
            <p><b>Amount Paid:</b> ${paymentData.currency} $${paymentData.amount}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Payment Receipt</h3>
            <p><b>Transaction ID:</b> ${paymentData.orderId}</p>
            <p><b>Payment Method:</b> PayPal</p>
            <p><b>Payment Date:</b> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #065f46;">
              <b>What's Next?</b><br>
              • We'll contact you 24-48 hours before your appointment<br>
              • Please bring your vehicle on the scheduled date<br>
              • If you need to reschedule, contact us at least 48 hours in advance
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p>Questions? Contact us:</p>
            <p>📧 ${process.env.EMAIL_USER}<br>
            📱 Your phone number here</p>
          </div>

          <div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px;">
            <p>V8 Wraps - Professional Vehicle Customization</p>
            <p>This is an automated confirmation email.</p>
          </div>
        </div>
      `,
    };
    
    console.log(bookingData);
    console.log(paymentData);
    
    // Send both emails
    await Promise.all([
      transporter.sendMail(businessMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log("✅ Payment confirmation emails sent successfully");

  } catch (error) {
    console.error("❌ Error sending payment confirmation emails:", error);
    throw error;
  }
}

async function sendBookingReminderEmail(bookingData) {
  const customerMailOptions = {
    from: `"V8 Wraps Reminder" <${process.env.EMAIL_USER}>`,
    to: bookingData.email,
    subject: "Appointment Reminder - V8 Wraps",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #f97316; text-align: center;">📅 Appointment Reminder</h2>
        
        <p>Dear ${bookingData.name},</p>
        
        <p>This is a friendly reminder about your upcoming appointment with V8 Wraps.</p>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Appointment Details</h3>
          <p><b>Service:</b> ${bookingData.service}</p>
          <p><b>Date:</b> ${bookingData.date}</p>
          <p><b>Booking Reference:</b> ${bookingData.bookingId}</p>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <b>Please Remember:</b><br>
            • Arrive 15 minutes early<br>
            • Ensure your vehicle is clean<br>
            • Remove all personal items from your vehicle<br>
            • Bring a valid ID and your booking reference
          </p>
        </div>

        <p>We look forward to seeing you!</p>

        <div style="text-align: center; margin: 30px 0;">
          <p>Need to reschedule? Contact us immediately:</p>
          <p>📧 ${process.env.EMAIL_USER}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(customerMailOptions);
}

module.exports = { 
  sendBookingEmail, 
  sendContactEmail, 
  sendPaymentConfirmationEmail, 
  sendBookingReminderEmail 
};