import { useState, useEffect, useRef } from "react";

const PayPalPayment = ({ 
    amount, 
    currency = "USD", 
    description = "Service Booking Payment",
    onSuccess, 
    onError, 
    onCancel,
    disabled = false,
    bookingData = null 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const [error, setError] = useState(null);
    const paypalRef = useRef();

    // PayPal SDK configuration
    const PAYPAL_CLIENT_ID =  import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;
    console.log(PAYPAL_CLIENT_ID);

    useEffect(() => {
        // Load PayPal SDK
        const loadPayPalScript = () => {
            if (window.paypal) {
                setPaypalLoaded(true);
                return;
            }

            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`;
            script.async = true;
            script.onload = () => {
                setPaypalLoaded(true);
            };
            script.onerror = () => {
                setError("Failed to load PayPal SDK");
            };
            document.body.appendChild(script);
        };

        loadPayPalScript();
    }, [currency]);

    useEffect(() => {
        if (paypalLoaded && amount > 0 && paypalRef.current) {
            renderPayPalButtons();
        }
    }, [paypalLoaded, amount]);

    const renderPayPalButtons = () => {
        // Clear previous buttons
        if (paypalRef.current) {
            paypalRef.current.innerHTML = '';
        }

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toString(),
                            currency_code: currency
                        },
                        description: description,
                        // Add booking reference if available
                        reference_id: bookingData?.bookingId || `booking_${Date.now()}`
                    }]
                });
            },
            onApprove: async (data, actions) => {
                setIsLoading(true);
                try {
                    const order = await actions.order.capture();
                    
                    // Create payment record
                    const paymentData = {
                        orderId: order.id,
                        payerId: order.payer.payer_id,
                        amount: amount,
                        currency: currency,
                        status: order.status,
                        bookingData: bookingData,
                        paymentDetails: order
                    };

                    // Call the success callback
                    if (onSuccess) {
                        await onSuccess(paymentData);
                    }

                    setIsLoading(false);
                } catch (error) {
                    console.error("Payment capture failed:", error);
                    setIsLoading(false);
                    if (onError) {
                        onError(error);
                    }
                }
            },
            onCancel: (data) => {
                console.log("Payment cancelled:", data);
                if (onCancel) {
                    onCancel(data);
                }
            },
            onError: (err) => {
                console.error("PayPal error:", err);
                setError("Payment failed. Please try again.");
                if (onError) {
                    onError(err);
                }
            },
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal'
            }
        }).render(paypalRef.current);
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <span className="text-red-600 font-medium">❌ Payment Error</span>
                </div>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button 
                    onClick={() => {
                        setError(null);
                        if (paypalLoaded) renderPayPalButtons();
                    }}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!paypalLoaded) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                    <span className="ml-2 text-gray-600">Loading PayPal...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="paypal-payment-container">
            {/* Payment Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Payment Summary</h3>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">{description}</span>
                    <span className="font-semibold text-lg text-green-600">
                        {currency} ${amount}
                    </span>
                </div>
                {bookingData && (
                    <div className="mt-2 text-sm text-gray-500">
                        <p>Service: {bookingData.service}</p>
                        <p>Date: {bookingData.date}</p>
                    </div>
                )}
            </div>

            {/* PayPal Buttons Container */}
            <div className={`paypal-buttons-container ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div ref={paypalRef}></div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        <span className="ml-3 text-gray-700">Processing payment...</span>
                    </div>
                </div>
            )}

            {/* Security Notice */}
            <div className="mt-4 text-xs text-gray-500 text-center">
                <p>🔒 Secure payment powered by PayPal</p>
                <p>Your payment information is encrypted and secure</p>
            </div>
        </div>
    );
};

export default PayPalPayment;
