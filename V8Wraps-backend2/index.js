require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const path = require("path");
const { sendBookingEmail, sendContactEmail, sendPaymentConfirmationEmail } = require("./services/nodemailerService");
const { addToGoogleSheet, updateBookingStatus } = require("./services/sheetsService");
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// Set up Multer storage
// const storage = multer.memoryStorage();
const { storage } = require('./lib/cloudinary'); 
const upload = multer({ storage });

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const data = req.body;

  try {
    await sendContactEmail(data);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Create booking endpoint (for payment flow)
app.post("/api/create-booking", upload.single("photo"), async (req, res) => {
  const { name, phone, email, service, date, message, status } = req.body;
  const file = req.file;

  try {
    console.log("📝 Creating new booking:", { name, service, date, status });

    // Generate a unique booking ID
    const bookingId = `BOOKING_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add to Google Sheets with booking ID and status
    const sheetData = {
      bookingId,
      name,
      phone,
      email,
      service,
      date,
      message,
      status: status || 'pending_payment',
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    await addToGoogleSheet(sheetData, file);

    console.log("✅ Booking created successfully with ID:", bookingId);

    res.status(200).json({ 
      message: "Booking created successfully!",
      bookingId: bookingId,
      status: 'pending_payment'
    });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res.status(500).json({ error: "Failed to create booking." });
  }
});

// Confirm payment endpoint
app.post("/api/confirm-payment", async (req, res) => {
  const { bookingId, paymentData } = req.body;

  try {
    console.log("💳 Confirming payment for booking:", bookingId);
    console.log("💰 Payment data:", paymentData);

    // Update booking status in Google Sheets
    await updateBookingStatus(bookingId, {
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentId: paymentData.orderId,
      payerId: paymentData.payerId,
      paymentAmount: paymentData.amount,
      paymentCurrency: paymentData.currency,
      paymentDate: new Date().toISOString(),
      paymentDetails: JSON.stringify(paymentData.paymentDetails)
    });

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail({
        bookingData: paymentData.bookingData,
        paymentData: paymentData
      });
      console.log("📧 Payment confirmation email sent");
    } catch (emailError) {
      console.error("📧 Failed to send confirmation email:", emailError);
      // Don't fail the whole request if email fails
    }

    console.log("✅ Payment confirmed successfully");

    res.status(200).json({ 
      message: "Payment confirmed successfully!",
      bookingId: bookingId,
      status: 'confirmed'
    });
  } catch (err) {
    console.error("❌ Payment confirmation error:", err);
    res.status(500).json({ error: "Failed to confirm payment." });
  }
});

//Quotation
app.post("/api/quotation", upload.single("photo"), async (req, res) => {
  const data = req.body;
  const file = req.file;

  try {
    console.log("Uploaded file:", file?.originalname);

    // Add to Google Sheets (old format)
    await sendBookingEmail(data, file);

    res.status(200).json({ message: "Booking received!" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed." });
  }
});

// Original booking endpoint (kept for backward compatibility)
app.post("/api/book", upload.single("photo"), async (req, res) => {
  const { name, phone, email, service, date, message } = req.body;
  const file = req.file;

  try {
    console.log("Uploaded file:", file?.originalname);

    // Add to Google Sheets (old format)
    await addToGoogleSheet({ name, phone, email, service, date, message }, file);

    res.status(200).json({ message: "Booking received!" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed." });
  }
});

// Get booked dates endpoint
app.get("/api/booked-dates", async (req, res) => {
  try {
    console.log("🔍 Fetching booked dates from Google Sheets...");
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A2:L", // Extended range to include new columns
    });

    if (!response.data.values || response.data.values.length === 0) {
      console.log("📋 No data found in sheet");
      return res.json([]);
    }

    // Extract dates from confirmed bookings using NEW format only
    // New format: Date in column G (index 6), Status in columns I and J (indices 8 and 9)
    const confirmedDates = response.data.values
      .filter(row => {
        // Check if we have a date in the new format (column G)
        const date = row[6]; // Column G (new format)
        if (!date || date.trim() === "") {
          return false; // Skip rows without dates in new format
        }

        // Check status in columns I and J (indices 8 and 9)
        const statusI = row[8]?.toLowerCase(); // Column I
        const statusJ = row[9]?.toLowerCase(); // Column J
        
        // Consider booking confirmed if either status column shows confirmed/paid
        const isConfirmed = statusI === 'confirmed' || statusI === 'paid' || 
                           statusJ === 'confirmed' || statusJ === 'paid';
        
        console.log(`Row check - Date: ${date}, Status I: ${statusI}, Status J: ${statusJ}, Confirmed: ${isConfirmed}`);
        
        return isConfirmed;
      })
      .map(row => row[6]) // Get date from column G (index 6)
      .map(date => {
        try {
          const dateObj = new Date(date);
          if (isNaN(dateObj.getTime())) {
            console.warn("Invalid date found:", date);
            return null;
          }
          return dateObj.toISOString().split('T')[0];
        } catch (error) {
          console.warn("Error parsing date:", date, error);
          return null;
        }
      })
      .filter(date => date !== null);

    console.log("📅 Confirmed booking dates:", confirmedDates);

    // Count occurrences of each date
    const counts = confirmedDates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    console.log("📊 Date counts:", counts);

    // Define slot limit
    const SLOT_LIMIT = 2;

    // Get dates that have reached the slot limit
    const fullDates = Object.entries(counts)
      .filter(([_, count]) => count >= SLOT_LIMIT)
      .map(([date]) => date);

    console.log("🚫 Fully booked dates:", fullDates);

    res.json(fullDates);
  } catch (err) {
    console.error("❌ Error fetching booked dates:", err);
    res.status(500).json({ error: "Failed to fetch booked dates" });
  }

});

// Get booking details endpoint (optional - for admin purposes)
app.get("/api/booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    console.log("🔍 Fetching booking details for:", bookingId);
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A2:L",
    });

    if (!response.data.values || response.data.values.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Find booking by ID
    const booking = response.data.values.find(row => row[1] === bookingId); // Assuming booking ID is in column B

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Return booking details
    const bookingDetails = {
      timestamp: booking[0],
      bookingId: booking[1],
      name: booking[2],
      phone: booking[3],
      email: booking[4],
      service: booking[5],
      date: booking[6],
      message: booking[7],
      status: booking[8],
      paymentStatus: booking[9],
      paymentId: booking[10],
      paymentAmount: booking[11]
    };

    res.json(bookingDetails);
  } catch (err) {
    console.error("❌ Error fetching booking details:", err);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});