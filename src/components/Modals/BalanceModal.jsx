import React, { useRef, useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import '../../App.css'
import { transicationTick } from '@/assets';


const BalanceModal = ({ setBalanceModal, accountingPay }) => {
    const [showPayroll, setShowPayroll] = useState(false);
    const [showPinScreen, setShowPinScreen] = useState(false);
    const [pin, setPin] = useState(['', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [nextPaymentScreen, setNextPaymentScreen] = useState(false);
    const [intialScreen, setInitialScreen] = useState(true);


    const handleProceed = () => {
        setShowPayroll(true);

    };
    const handlePayProceed = () => {
        setNextPaymentScreen(true);
        setInitialScreen(false);
    };


    const handleGoBack = () => {
        setShowPayroll(false);
        setShowPinScreen(false);
        setShowSuccessScreen(false)
    };
    const handlePayrollProceed = () => {
        setShowPinScreen(true);
    };
    const handleFundWallet = () => {
        setShowSuccessScreen(true);
    };
    const handlePinChange = (index, value) => {
        const newPin = [...pin];
        const numericValue = value.replace(/[^0-9]/g, '');
        newPin[index] = numericValue;
        setPin(newPin);

        if (numericValue && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };
    return (
        <div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-30 z-50">
            {/* Left Side Drawer */}
            <div className="bg-white w-[400px] max-w-full h-full shadow-xl flex flex-col">
                <div className="flex justify-end p-4">
                    <button onClick={() => setBalanceModal(false)}>
                        <RxCross1 size={22} color='black' />
                    </button>
                </div>
                {intialScreen ? (
                    <div className="px-6 pb-6">
                        <h1 className="text-4xl font-medium text-gray-700 mb-1">Fund Wallet</h1>
                        <p className="text-sm text-gray-600 mb-6">To fund wallet provide the detials below</p>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600">Wallet Balance</p>
                            <p className="text-4xl font-medium text-red-600">$ 3,041,730</p>
                        </div>

                        <div className="border-t border-gray-200 my-4"></div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">Amount</p>
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-start space-x-8 mb-8">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked
                                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-0"
                                />
                                <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-gray-300 border-[#F2F2F2A6] bg-[#F2F2F2A6] rounded focus:ring-0"
                                />
                                <span className="ml-2 text-sm text-gray-700">Fund by Card</span>
                            </label>
                        </div>

                        <div className="border border-dashed border-gray-300 rounded-md  mb-6">
                            <div className="grid grid-cols-2 gap-4 mb-4 p-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                                    <p className="text-sm font-medium">0123456789</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                                    <p className="text-sm font-medium">Guaranty Trust Bank Plc.</p>
                                </div>
                            </div>
                            <hr className='border border-gray-100' />
                            <div className="grid grid-cols-2 gap-4 p-4">
                                <p className="text-xs text-gray-500 mb-1">Beneficiary Name</p>
                                <p className="text-sm font-medium">Adebola Toheeb</p>
                            </div>
                        </div>
                        <div className="px-6 mt-5">
                            <button
                                className="w-full bg-[#C01824] text-white py-2 rounded-md text-sm font-medium uppercase"
                                onClick={handlePayProceed}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                ) : showPayroll && !showPinScreen && !showSuccessScreen || nextPaymentScreen ? (
                    accountingPay ? (
                        <div className="flex flex-col p-6">
                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-medium">Fund Wallet</p>
                                <p className="text-gray-600">To fund wallet provide the detials below</p>
                            </div>
                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-medium">Wallet Balance</p>
                                <p className="text-4xl font-bold text-red-600">₦ 3,041,730</p>
                            </div>

                            <div className="border-t border-gray-200 my-4 w-[25%]"></div>

                            <div className="border border-dashed border-gray-300 rounded-md">
                                <div className="grid grid-cols-2 p-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-500">Amount</p>
                                        <p className="text-base font-medium text-gray-800">₦ 2,600</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="text-base font-medium text-gray-800">Card</p>
                                    </div>
                                </div>

                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm text-gray-500">Beneficiary Name</p>
                                    <p className="text-base font-medium text-gray-800">Adebola Toheeb</p>
                                </div>

                                <div className="p-4">
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="text-base font-medium text-gray-800">I need to make this payment Asap</p>
                                </div>
                            </div>

                            <button
                                className="w-full bg-[#C01824] text-white py-4 rounded-md text-base font-medium uppercase mt-12"
                                onClick={handleProceed}
                            >
                                PROCEED
                            </button>
                        </div>
                    ) : !showPayroll  ? (
                        <>
                            <div className="px-6 pt-2 pb-6">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Amount</h2>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Balance</p>
                                    <p className="text-3xl font-semibold text-red-600">$ 3,041,730</p>
                                </div>

                                <div className="border-t border-gray-300 my-3"></div>
                            </div>

                            <div className="px-6 mt-5">
                                <button
                                    className="w-full bg-[#C01824] text-white py-2 rounded-md text-sm font-medium uppercase"
                                    onClick={handleProceed}
                                >
                                    Proceed
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="w-full px-6 pb-6 flex flex-col items-center justify-between min-h-[400px]">

                                {/* Header */}
                                <div className="w-full flex flex-col items-start gap-4 mb-6">
                                    <button
                                        className="text-[#C01824] underline text-sm font-medium"
                                        onClick={handleGoBack}
                                    >
                                        &larr; Go Back
                                    </button>
                                    <h5 className="text-lg font-semibold text-gray-800">Payroll</h5>
                                </div>

                                {/* Amount Display */}
                                <div className="w-full mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="text"
                                        value="$3,041,730"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-gray-100 outline-none"
                                    />
                                </div>

                                {/* Payment Method */}
                                <div className="w-full mb-5 flex items-center space-x-6">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            className="form-radio text-[#C01824] border-gray-300 focus:ring-[#C01824]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked
                                            readOnly
                                            className="form-checkbox text-[#C01824] border-gray-300 focus:ring-[#C01824]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Fund by Card</span>
                                    </label>
                                </div>

                                {/* Card Selection */}
                                <div className="w-full space-y-3">
                                    {/* Selected Card */}
                                    <div className="border border-[#C01824] rounded-lg p-3 flex items-center">
                                        <input
                                            type="radio"
                                            name="cardSelect"
                                            checked
                                            readOnly
                                            className="form-radio text-[#C01824] border-gray-300 focus:ring-[#C01824]"
                                        />
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm text-gray-600">•••• •••• 9793</p>
                                            <p className="text-xs text-gray-400">CARD NUMBER</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">01/24</p>
                                            <p className="text-xs text-gray-400">EXPIRY DATE</p>
                                        </div>
                                    </div>

                                    {/* Unselected Card */}
                                    <div className="border rounded-lg p-3 flex items-center bg-[#F6F5F5]">
                                        <input
                                            type="radio"
                                            name="cardSelect"
                                            className="form-radio text-[#C01824] border-gray-300 focus:ring-[#C01824]"
                                        />
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm text-gray-600">•••• •••• 0843</p>
                                            <p className="text-xs text-gray-400">CARD NUMBER</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">05/22</p>
                                            <p className="text-xs text-gray-400">EXPIRY DATE</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Proceed Button */}
                                <div className="mt-6 w-full">
                                    <button
                                        className="w-full bg-[#C01824] text-white py-2 rounded-md text-sm font-medium uppercase"
                                        onClick={handlePayrollProceed}
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </div>

                    )
                ) : showPinScreen && !showSuccessScreen ? (
                    // Step 3 - Transaction Pin Screen
                    <div className="w-full px-6 pb-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Transaction Pin</h2>
                            <p className="text-sm text-gray-600">Provide transaction to fund wallet from card</p>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm font-medium text-gray-700 mb-4">Enter your 4 Digits Pin</p>

                            <div className="flex justify-between gap-2">
                                {[0, 1, 2, 3].map((i) => (
                                    <input
                                        key={i}
                                        ref={inputRefs[i]}
                                        type="password"
                                        maxLength="1"
                                        value={pin[i]}
                                        onChange={(e) => handlePinChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className="w-16 h-16 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:border-[#C01824]"
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleFundWallet}
                            className="w-full bg-[#C01824] text-white py-3 rounded-md text-sm font-medium uppercase"
                        >
                            Fund Wallet
                        </button>
                    </div>
                ) : (
                    <div className='w-full h-full flex flex-col justify-center'>
                        <div className="w-full px-6 pb-6 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
                            {/* Success Icon */}
                            <div className="mb-6">
                                <img src={transicationTick} />
                            </div>

                            {/* Success Message */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-1">Transaction Successful</h2>
                                <p className="text-sm text-gray-600">You have successfully funded your wallet</p>
                            </div>

                            {/* Return Button */}
                            <button
                                className="w-full bg-[#C01824] text-white py-3 rounded-md text-sm font-medium uppercase"
                                onClick={handleGoBack}
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default BalanceModal;