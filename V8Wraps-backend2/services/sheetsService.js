const { google } = require("googleapis");
require('dotenv').config();

async function addToGoogleSheet(data, file = null) {
    try {
        console.log("🔍 Environment variables check:");
        console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL ? "✅ Set" : "❌ Missing");
        console.log("GOOGLE_PRIVATE_KEY length:", process.env.GOOGLE_PRIVATE_KEY?.length || "❌ Missing");
        console.log("GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID ? "✅ Set" : "❌ Missing");

        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
            throw new Error("Missing required Google credentials in environment variables");
        }

        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        privateKey = privateKey.replace(/^"|"$/g, '');
        privateKey = privateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        console.log("🔄 Attempting to get auth client...");
        const authClient = await auth.getClient();
        console.log("✅ Google Sheets authentication successful!");

        const sheets = google.sheets({ version: "v4", auth: authClient });
        
        // Prepare data based on whether it's the new format (with bookingId) or old format
        let values;
        
        if (data.bookingId) {
            // New format with payment integration
            values = [[
                new Date().toLocaleString(), // A: Timestamp
                data.bookingId,              // B: Booking ID
                data.name,                   // C: Name
                data.phone,                  // D: Phone
                data.email,                  // E: Email
                data.service,                // F: Service
                data.date,                   // G: Date
                data.message || "",          // H: Message
                data.status || "pending",    // I: Status
                data.paymentStatus || "pending", // J: Payment Status
                data.paymentId || "",        // K: Payment ID
                data.paymentAmount || "",    // L: Payment Amount
                file ? file.originalname : "" // M: File name (if any)
            ]];
        } else {
            // Old format for backward compatibility
            values = [[
                new Date().toLocaleString(),
                "",                    // Empty booking ID for old format
                data.name,
                data.phone,
                data.email,
                data.service,
                data.date,
                data.message,
                "confirmed",           // Old bookings are automatically confirmed
                "completed",           // Old bookings are considered paid
                "",                    // No payment ID
                "",                    // No payment amount
                file ? file.originalname : ""
            ]];
        }

        console.log("📝 Adding data to sheet...");
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Sheet1!A1",
            valueInputOption: "USER_ENTERED",
            resource: { values },
        });

        console.log("✅ Data successfully added to Google Sheet!");
        return response;

    } catch (error) {
        console.error("❌ Google Sheets Error:", error.message);
        console.error("Full error:", error);
        throw error;
    }
}

async function updateBookingStatus(bookingId, updateData) {
    try {
        console.log("🔄 Updating booking status for:", bookingId);
        
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        privateKey = privateKey.replace(/^"|"$/g, '');
        privateKey = privateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: authClient });

        // First, find the row with the booking ID
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Sheet1!A2:M", // Get all data to find the booking
        });

        if (!response.data.values || response.data.values.length === 0) {
            throw new Error("No bookings found in sheet");
        }

        // Find the row index for the booking ID
        let rowIndex = -1;
        for (let i = 0; i < response.data.values.length; i++) {
            if (response.data.values[i][1] === bookingId) { // Column B contains booking ID
                rowIndex = i + 2; // +2 because sheet rows start at 1 and we skipped header
                break;
            }
        }

        if (rowIndex === -1) {
            throw new Error(`Booking with ID ${bookingId} not found`);
        }

        console.log("📍 Found booking at row:", rowIndex);

        // Update specific columns based on the updateData
        const updates = [];

        if (updateData.status) {
            updates.push({
                range: `Sheet1!I${rowIndex}`, // Column I: Status
                values: [[updateData.status]]
            });
        }

        if (updateData.paymentStatus) {
            updates.push({
                range: `Sheet1!J${rowIndex}`, // Column J: Payment Status
                values: [[updateData.paymentStatus]]
            });
        }

        if (updateData.paymentId) {
            updates.push({
                range: `Sheet1!K${rowIndex}`, // Column K: Payment ID
                values: [[updateData.paymentId]]
            });
        }

        if (updateData.paymentAmount) {
            updates.push({
                range: `Sheet1!L${rowIndex}`, // Column L: Payment Amount
                values: [[`${updateData.paymentCurrency} ${updateData.paymentAmount}`]]
            });
        }

        // Add payment date to a new column if needed
        if (updateData.paymentDate) {
            updates.push({
                range: `Sheet1!M${rowIndex}`, // Column M: Payment Date
                values: [[updateData.paymentDate]]
            });
        }

        // Perform batch update
        if (updates.length > 0) {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                resource: {
                    valueInputOption: "USER_ENTERED",
                    data: updates
                }
            });

            console.log("✅ Booking status updated successfully!");
        }

        return { success: true, rowIndex, updatedFields: Object.keys(updateData) };

    } catch (error) {
        console.error("❌ Error updating booking status:", error.message);
        throw error;
    }
}

async function getBookingByStatus(status = 'pending_payment') {
    try {
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        privateKey = privateKey.replace(/^"|"$/g, '');
        privateKey = privateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: authClient });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Sheet1!A2:M",
        });

        if (!response.data.values || response.data.values.length === 0) {
            return [];
        }

        // Filter bookings by status
        const bookings = response.data.values
            .map((row, index) => ({
                rowIndex: index + 2,
                timestamp: row[0],
                bookingId: row[1],
                name: row[2],
                phone: row[3],
                email: row[4],
                service: row[5],
                date: row[6],
                message: row[7],
                status: row[8],
                paymentStatus: row[9],
                paymentId: row[10],
                paymentAmount: row[11]
            }))
            .filter(booking => booking.status === status);

        return bookings;

    } catch (error) {
        console.error("❌ Error fetching bookings by status:", error.message);
        throw error;
    }
}

module.exports = { 
    addToGoogleSheet, 
    updateBookingStatus, 
    getBookingByStatus 
};