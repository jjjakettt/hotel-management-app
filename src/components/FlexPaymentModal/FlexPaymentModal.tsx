'use client';

import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import { 
    initializeFlexMicroform, 
    setupFlexMicroform, 
    completeBookingWithFlex,
    cleanupFlexMicroform,
    BookingData 
} from '@/libs/cybersource-client';
import toast from 'react-hot-toast';

interface FlexPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingData: BookingData;
    onSuccess: (authorizationData: any) => void;
    totalPrice: number;
    roomName: string;
}

const FlexPaymentModal: React.FC<FlexPaymentModalProps> = ({
    isOpen,
    onClose,
    bookingData,
    onSuccess,
    totalPrice,
    roomName
}) => {
    const [cardholderName, setCardholderName] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFlexReady, setIsFlexReady] = useState(false);
    const [flexError, setFlexError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && !isFlexReady) {
            initializeFlex();
        }
        
        return () => {
            if (!isOpen) {
                cleanupFlexMicroform();
                setIsFlexReady(false);
            }
        };
    }, [isOpen]);

    const initializeFlex = async () => {
        try {
            setFlexError(null);
            const captureContext = await initializeFlexMicroform();
            
            // Setup microform with callbacks - now async
            await setupFlexMicroform(
                captureContext,
                (token) => {
                    // Token success callback (not used directly here)
                    console.log('Token generated successfully');
                },
                (error) => {
                    // Token error callback
                    setFlexError(error.message || 'Card validation failed');
                }
            );
            
            setIsFlexReady(true);
        } catch (error) {
            console.error('Failed to initialize Flex:', error);
            setFlexError('Failed to initialize payment form. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!cardholderName.trim()) {
            toast.error('Please enter cardholder name');
            return;
        }
        
        if (!isFlexReady) {
            toast.error('Payment form not ready. Please wait...');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // basic expiry validation
            const mm = expiryMonth.padStart(2, '0');
            const yyyy = expiryYear.length === 2 ? `20${expiryYear}` : expiryYear;
            if (!/^0[1-9]|1[0-2]$/.test(mm) || !/^\d{4}$/.test(yyyy)) {
                toast.error('Enter a valid expiry (MM/YYYY)');
                setIsLoading(false);
                return;
            }

            const response = await completeBookingWithFlex(
                cardholderName,
                bookingData,
                { expirationMonth: mm, expirationYear: yyyy }
            );
            
            if (response.success) {
                onSuccess(response.bookingDetails);
                onClose();
                // Reset form
                setCardholderName('');
                setExpiryMonth('');
                setExpiryYear('');
            }
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--background)] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b-2 border-b-secondary">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Secure Card Verification
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[var(--foreground)]"
                            disabled={isLoading}
                        >
                            <IoMdClose size={24} />
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-[var(--foreground)]">
                        Card will be verified only. Payment will be collected at reception.
                    </p>
                </div>

                {/* Booking Summary */}
                <div className="p-6 bg-[var(--background)] border-b-2 border-b-secondary">
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">
                        Booking Summary
                    </h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[var(--foreground)]">Room:</span>
                            <span className="font-medium text-[var(--foreground)]">{roomName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--foreground)]">Check-in:</span>
                            <span className="font-medium text-[var(--foreground)]">
                                {bookingData.checkinDate?.toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--foreground)]">Check-out:</span>
                            <span className="font-medium text-[var(--foreground)]">
                                {bookingData.checkoutDate?.toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="font-semibold text-[var(--foreground)]">Total (at reception):</span>
                            <span className="font-bold text-lg text-[var(--foreground)]">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {flexError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{flexError}</p>
                        </div>
                    )}
                    
                    {/* Info banner while loading */}
                    {!isFlexReady && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                        Initializing secure card fields...
                      </div>
                    )}

                    {/* Cardholder Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Cardholder Name 
                        </label>
                        <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-[var(--foreground)]"
                            required
                            disabled={isLoading || !isFlexReady}
                        />
                    </div>

                    {/* Card Number - Flex Microform */}
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      <span className="inline-flex items-center gap-2"><FaCreditCard /> Card Number</span>
                    </label>
                    <div
                      id="card-number-container"
                      className="w-full h-[50px] rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
                    />

                    {/* Expiry and CVV Row */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Expiry (MM / YYYY)</label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM"
                            maxLength={2}
                            value={expiryMonth}
                            onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-3 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-[var(--foreground)]"
                            disabled={isLoading || !isFlexReady}
                            required
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="YYYY"
                            maxLength={4}
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-3 border border-[var(--border)] rounded-md focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-[var(--foreground)]"
                            disabled={isLoading || !isFlexReady}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          CVV
                        </label>
                        <div
                          id="card-cvv-container"
                          className="w-full h-[50px] rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden"
                        />
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mb-6 p-3 bg-primary shadow-sm shadow-primary rounded-md">
                      <div className="flex items-start">
                        <FaLock className="text-white mt-0.5 mr-2" />
                        <div className="text-sm text-white">
                          <p className="font-semibold">Secure Zero-Amount Authorization</p>
                          <p className="mt-1">Your card will be verified but not charged. Payment will be collected at the hotel reception.</p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !isFlexReady}
                      className = "w-full bg-primary shadow-sm shadow-primary hover:bg-primary-hover text-white py-3 px-4 rounded-md font-semibold transition-colors"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying Card...
                        </span>
                      ) : (
                        'Verify Card & Confirm Booking'
                      )}
                    </button>

                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="w-full mt-3 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FlexPaymentModal;