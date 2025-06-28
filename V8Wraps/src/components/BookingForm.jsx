import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PayPalPayment from "./PayPalPayment"; // Import the PayPal component

export default function BookingForm() {
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const backend = import.meta.env.VITE_APP_API_BASE_URL;
    // Service pricing (you can customize these)
    const servicePrices = {
        "Vehicle Wrap": 250,
        "Paint Protection Film (PPF)": 180,
        "Ceramic Tint": 80,
        "Headlight/Taillight Tint": 30,
        "Custom Stickers & Logos": 15
    };

    const [dateValidation, setDateValidation] = useState({
        isValid: true,
        message: "",
        type: "",
        isBooked: false,
        dayOfWeek: "",
        daysFromToday: 0
    });

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        message: "",
    });

    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const res = await fetch(`${backend}api/booked-dates`);
                const data = await res.json();
                setBookedDates(data);
            } catch (error) {
                console.error("Failed to fetch booked dates:", error);
            }
        };
        fetchBookedDates();
    }, [form]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const validateDate = (date) => {
        if (!date) {
            setDateValidation({
                isValid: true,
                message: "",
                type: "",
                isBooked: false,
                dayOfWeek: "",
                daysFromToday: 0
            });
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDateCopy = new Date(date);
        selectedDateCopy.setHours(0, 0, 0, 0);

        const timeDiff = selectedDateCopy.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = dayNames[date.getDay()];

        const dateString =
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");
        const isBooked = bookedDates.includes(dateString);

        let validation = {
            isValid: true,
            message: "",
            type: "success",
            isBooked: isBooked,
            dayOfWeek: dayOfWeek,
            daysFromToday: daysDiff
        };

        if (isBooked) {
            validation.isValid = false;
            validation.message = "This date is already booked. Please select another date.";
            validation.type = "error";
        } else if (daysDiff < 0) {
            validation.isValid = false;
            validation.message = "Cannot select past dates.";
            validation.type = "error";
        } else if (daysDiff === 0) {
            validation.message = "Today - Same day booking (subject to availability)";
            validation.type = "warning";
        } else if (daysDiff === 1) {
            validation.message = "Tomorrow - Next day booking";
            validation.type = "info";
        } else if (daysDiff <= 7) {
            validation.message = `${daysDiff} days from now (${dayOfWeek})`;
            validation.type = "info";
        } else if (daysDiff <= 30) {
            const weeks = Math.floor(daysDiff / 7);
            validation.message = `${weeks} week${weeks > 1 ? 's' : ''} from now (${dayOfWeek})`;
            validation.type = "info";
        } else {
            validation.message = `${dayOfWeek} - Long advance booking`;
            validation.type = "info";
        }

        if (date.getDay() === 0 || date.getDay() === 6) {
            if (validation.isValid) {
                validation.message += " - Weekend appointment";
                validation.type = "warning";
            }
        }

        if (validation.isValid && daysDiff > 0 && daysDiff < 2) {
            validation.message += " - Please call to confirm availability";
        }

        setDateValidation(validation);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);

        if (date) {
            const formattedDate =
                date.getFullYear() + "-" +
                String(date.getMonth() + 1).padStart(2, "0") + "-" +
                String(date.getDate()).padStart(2, "0");
            setForm({ ...form, date: formattedDate });
        } else {
            setForm({ ...form, date: "" });
        }

        validateDate(date);
    };

    // Create booking without payment first
    const createBooking = async () => {
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) =>
                formData.append(key, value)
            );
            if (photo) formData.append("photo", photo);

            // Add status as pending payment
            formData.append("status", "pending_payment");

            const response = await fetch(`${backend}api/create-booking`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const bookingData = await response.json();
                setBookingId(bookingData.bookingId);
                return bookingData;
            } else {
                throw new Error("Failed to create booking");
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate || !form.date) {
            alert("Please select a preferred date.");
            return;
        }

        if (!dateValidation.isValid) {
            alert("Please select a valid date. " + dateValidation.message);
            return;
        }

        try {
            // Create booking first
            const bookingData = await createBooking();

            // Show payment form
            setShowPayment(true);
        } catch (err) {
            alert("Failed to create booking. Please try again.");
        }
    };

    const handleQuote = async () => {


        if (!form.name) {
            alert("Please enter your name.");
            return;
        } if (!form.phone) {
            alert("Please enter your Phone number.");
            return;
        } if (!form.email) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!form.service) {
            alert("Please select a service.");
            return;
        }

        try {

            const quoteData = new FormData();
            Object.entries(form).forEach(([key, value]) =>
                quoteData.append(key, value)
            );
            if (photo) quoteData.append("photo", photo);

            const response = await fetch(`${backend}api/quotation`, {
                method: "POST",
                body: quoteData,
            });

            if (response.ok) {
                alert("Quotation request successful!")
            } else {
                throw new Error("Failed to create booking");
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    // Handle successful payment
    const handlePaymentSuccess = async (paymentData) => {
        try {
            // Update booking with payment information
            const response = await fetch(`${backend}api/confirm-payment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    paymentData: paymentData
                }),
            });

            if (response.ok) {
                alert("Booking confirmed and payment successful!");

                // Reset form
                setForm({
                    name: "",
                    phone: "",
                    email: "",
                    service: "",
                    date: "",
                    message: "",
                });
                setPhoto(null);
                setSelectedDate(null);
                setShowPayment(false);
                setBookingId(null);
                setDateValidation({
                    isValid: true,
                    message: "",
                    type: "",
                    isBooked: false,
                    dayOfWeek: "",
                    daysFromToday: 0
                });
            } else {
                throw new Error("Failed to confirm payment");
            }
        } catch (error) {
            console.error("Payment confirmation failed:", error);
            alert("Payment successful but confirmation failed. Please contact support.");
        }
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        alert("Payment failed. Please try again or contact support.");
    };

    const handlePaymentCancel = () => {
        alert("Payment cancelled. Your booking is still reserved for 15 minutes.");
    };

    const getValidationStyle = () => {
        switch (dateValidation.type) {
            case 'error':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'info':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'success':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return '';
        }
    };

    const getServicePrice = () => {
        return servicePrices[form.service] || 0;
    };

    // If payment is being shown
    if (showPayment) {
        return (
            <section className="bg-gray-100 py-20 px-6" id="booking">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">
                        Complete Your Payment
                    </h2>

                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Name:</span> {form.name}</p>
                            <p><span className="font-medium">Service:</span> {form.service}</p>
                            <p><span className="font-medium">Date:</span> {form.date}</p>
                            <p><span className="font-medium">Total Amount:</span> ${getServicePrice()}</p>
                        </div>
                    </div>

                    <PayPalPayment
                        amount={getServicePrice()}
                        currency="USD"
                        description={`${form.service} - Booking for ${form.date}`}
                        bookingData={{
                            bookingId: bookingId,
                            service: form.service,
                            date: form.date,
                            name: form.name,
                            email: form.email
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onCancel={handlePaymentCancel}
                    />

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setShowPayment(false)}
                            className="text-gray-600 underline hover:text-gray-800"
                        >
                            ← Back to Booking Form
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-100 py-20 px-6" id="booking">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">
                    Book Your Spot
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Service Required
                        </label>
                        <select
                            name="service"
                            value={form.service}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        >
                            <option value="">Select a Service</option>
                            <option value="Vehicle Wrap">Vehicle Wrap - $2,50</option>
                            <option value="Paint Protection Film (PPF)">Paint Protection Film (PPF) - $1,80</option>
                            <option value="Ceramic Tint">Ceramic Tint - $80</option>
                            <option value="Headlight/Taillight Tint">Headlight/Taillight Tint - $30</option>
                            <option value="Custom Stickers & Logos">Custom Stickers & Logos - $15</option>
                        </select>
                        {form.service && (
                            <p className="mt-1 text-sm text-green-600 font-medium">
                                Price: ${getServicePrice()}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Upload Car Photo (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Preferred Date
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            dayClassName={(date) => {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                const iso = `${year}-${month}-${day}`;
                                if (bookedDates.includes(iso)) {
                                    return "bg-red-200 text-red-800 cursor-not-allowed";
                                }
                                if (date.getDay() === 0 || date.getDay() === 6) {
                                    return "bg-yellow-100 text-yellow-800";
                                }
                                return undefined;
                            }}
                            className={`w-full border px-4 py-2 rounded-lg ${dateValidation.isValid ? 'border-gray-300' : 'border-red-300'
                                }`}
                            placeholderText="Select a date"
                            required
                        />

                        {dateValidation.message && (
                            <div className={`mt-2 p-2 rounded-md border text-sm ${getValidationStyle()}`}>
                                <div className="flex items-center">
                                    <span className="font-medium">
                                        {dateValidation.type === 'error' ? '⚠️' :
                                            dateValidation.type === 'warning' ? '⚡' :
                                                dateValidation.type === 'info' ? 'ℹ️' : '✅'}
                                    </span>
                                    <span className="ml-2">{dateValidation.message}</span>
                                </div>
                                {selectedDate && (
                                    <div className="mt-1 text-xs opacity-75">
                                        Selected: {selectedDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-2 text-xs text-gray-600">
                            <div className="flex flex-wrap gap-4">
                                <span className="flex items-center">
                                    <div className="w-3 h-3 bg-red-200 rounded mr-1"></div>
                                    Booked
                                </span>
                                <span className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-100 rounded mr-1"></div>
                                    Weekend
                                </span>
                                <span className="flex items-center">
                                    <div className="w-3 h-3 bg-white border rounded mr-1"></div>
                                    Available
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Message / Notes
                        </label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                            rows="4"
                            placeholder="Any special requirements or notes..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={!dateValidation.isValid && selectedDate}
                        className={`w-full font-semibold py-3 rounded-lg transition ${dateValidation.isValid || !selectedDate
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                    >
                        Proceed to Payment
                    </button>
                    <button
                        type="button"
                        // disabled={!dateValidation.isValid && selectedDate}
                        onClick={() => handleQuote()}
                        className={`w-full font-semibold py-3 rounded-lg transition ${dateValidation.isValid || !selectedDate
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                    >
                        Get free Quotation
                    </button>
                </form>
            </div>
        </section>
    );
}