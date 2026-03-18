import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross1 } from "react-icons/rx";
import '../../App.css';
import { transicationTick } from '@/assets';
import { createWalletStripeSetup, fetchWalletBalance, fundWallet, payFromWallet } from '@/redux/slices/accountsPayableSlice';

const BalanceModal = ({ setBalanceModal, accountingPay, apId }) => {
    const dispatch = useDispatch();
    const { walletBalance, walletSetup, loading, error } = useSelector((state) => state.accountsPayable);

    const [showPayroll, setShowPayroll] = useState(false);
    const [showPinScreen, setShowPinScreen] = useState(false);
    const [pin, setPin] = useState(['', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [nextPaymentScreen, setNextPaymentScreen] = useState(false);
    const [intialScreen, setInitialScreen] = useState(true);

    // Fund wallet form state
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('BankTransfer');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [description, setDescription] = useState('');
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [cardHolder, setCardHolder] = useState('RouteIQ Wallet');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvc, setCardCvc] = useState('123');

    useEffect(() => {
        dispatch(fetchWalletBalance());
    }, [dispatch]);

    const handleProceed = () => {
        setShowPayroll(true);
    };

    const handlePayProceed = () => {
        if (paymentMethod === 'Card') {
            dispatch(createWalletStripeSetup());
        }
        setNextPaymentScreen(true);
        setInitialScreen(false);
    };

    const handleGoBack = () => {
        setShowPayroll(false);
        setShowPinScreen(false);
        setShowSuccessScreen(false);
        setInitialScreen(true);
        setNextPaymentScreen(false);
    };

    const handlePayrollProceed = () => {
        setShowPinScreen(true);
    };

    const handleFundWallet = async () => {
        const result = await dispatch(fundWallet({
            amount: parseFloat(amount),
            paymentMethod,
            accountNumber,
            bankName,
            beneficiaryName,
            description,
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            setShowSuccessScreen(true);
            dispatch(fetchWalletBalance());
        }
    };

    const handlePayFromWallet = async () => {
        const result = await dispatch(payFromWallet({
            amount: parseFloat(amount),
            paymentMethod,
            beneficiaryName,
            description,
            ...(apId ? { apId } : {}),
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            setShowSuccessScreen(true);
            dispatch(fetchWalletBalance());
        }
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

    const balanceDisplay = walletBalance?.balance != null
        ? `$ ${walletBalance.balance.toLocaleString()}`
        : loading.walletBalance ? 'Loading...' : '$ 0';

    return (
        <div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-30 z-50">
            <div className="bg-white w-[400px] max-w-full h-full shadow-xl flex flex-col">
                <div className="flex justify-end p-4">
                    <button onClick={() => setBalanceModal(false)}>
                        <RxCross1 size={22} color='black' />
                    </button>
                </div>

                {/* Step 1 — Fund Wallet Form */}
                {intialScreen && (
                    <div className="px-6 pb-6">
                        <h1 className="text-4xl font-medium text-gray-700 mb-1">Fund Wallet</h1>
                        <p className="text-sm text-gray-600 mb-6">To fund wallet provide the details below</p>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600">Wallet Balance</p>
                            <p className="text-4xl font-medium text-red-600">{balanceDisplay}</p>
                        </div>

                        <div className="border-t border-gray-200 my-4"></div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Amount</p>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="flex items-start space-x-8 mb-4">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="BankTransfer"
                                    checked={paymentMethod === 'BankTransfer'}
                                    onChange={() => setPaymentMethod('BankTransfer')}
                                    className="w-5 h-5"
                                />
                                <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Card"
                                    checked={paymentMethod === 'Card'}
                                    onChange={() => setPaymentMethod('Card')}
                                    className="w-5 h-5"
                                />
                                <span className="ml-2 text-sm text-gray-700">Fund by Card</span>
                            </label>
                        </div>

                        {paymentMethod === 'BankTransfer' && (
                            <div className="border border-dashed border-gray-300 rounded-md p-4 space-y-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Account Number"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Bank Name"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Beneficiary Name"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                    value={beneficiaryName}
                                    onChange={(e) => setBeneficiaryName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        )}

                        {paymentMethod === 'Card' && (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-[#FAFBFD] p-4 mb-4">
                                <div className="mb-4 rounded-xl bg-gradient-to-r from-[#7A0F18] to-[#C01824] p-4 text-white shadow-sm">
                                    <div className="mb-8 text-xs uppercase tracking-[0.16em] text-white/80">Saved Card Preview</div>
                                    <div className="text-xl font-semibold tracking-[0.24em]">{cardNumber}</div>
                                    <div className="mt-5 flex items-end justify-between">
                                        <div>
                                            <div className="text-[10px] uppercase text-white/70">Card Holder</div>
                                            <div className="text-sm font-medium">{cardHolder}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase text-white/70">Expiry</div>
                                            <div className="text-sm font-medium">{cardExpiry}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Card Holder Name"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none"
                                            value={cardCvc}
                                            onChange={(e) => setCardCvc(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-[#667085]">
                                        {walletSetup?.clientSecret
                                            ? 'Stripe setup intent ready for card save.'
                                            : 'Card details preview will appear here before confirmation.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {error.fundWallet && <p className="text-red-500 text-sm mb-3">{error.fundWallet}</p>}

                        <div className="px-0 mt-5">
                            <button
                                className="w-full bg-[#C01824] text-white py-2 rounded-md text-sm font-medium uppercase disabled:opacity-60"
                                onClick={handlePayProceed}
                                disabled={!amount}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2 — Confirm Screen */}
                {!intialScreen && nextPaymentScreen && !showPinScreen && !showSuccessScreen && (
                    accountingPay ? (
                        <div className="flex flex-col p-6">
                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-medium">Fund Wallet</p>
                                <p className="text-gray-600">To fund wallet provide the details below</p>
                            </div>
                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-medium">Wallet Balance</p>
                                <p className="text-4xl font-bold text-red-600">{balanceDisplay}</p>
                            </div>

                            <div className="border-t border-gray-200 my-4 w-[25%]"></div>

                            <div className="border border-dashed border-gray-300 rounded-md">
                                <div className="grid grid-cols-2 p-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-500">Amount</p>
                                        <p className="text-base font-medium text-gray-800">$ {amount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="text-base font-medium text-gray-800">{paymentMethod}</p>
                                    </div>
                                </div>
                                {paymentMethod === 'Card' && (
                                    <div className="border-b border-gray-200 p-4">
                                        <div className="rounded-xl bg-gradient-to-r from-[#7A0F18] to-[#C01824] p-4 text-white">
                                            <div className="mb-6 text-xs uppercase tracking-[0.16em] text-white/80">Card Payment</div>
                                            <div className="text-lg font-semibold tracking-[0.22em]">{cardNumber}</div>
                                            <div className="mt-4 flex items-end justify-between">
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/70">Card Holder</div>
                                                    <div className="text-sm font-medium">{cardHolder}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase text-white/70">Expiry</div>
                                                    <div className="text-sm font-medium">{cardExpiry}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-xs text-[#667085]">
                                            {walletSetup?.clientSecret ? 'Card setup prepared successfully.' : 'Using card payment preview.'}
                                        </div>
                                    </div>
                                )}
                                {beneficiaryName && (
                                    <div className="p-4 border-b border-gray-200">
                                        <p className="text-sm text-gray-500">Beneficiary Name</p>
                                        <p className="text-base font-medium text-gray-800">{beneficiaryName}</p>
                                    </div>
                                )}
                                {description && (
                                    <div className="p-4">
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-base font-medium text-gray-800">{description}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                className="w-full bg-[#C01824] text-white py-4 rounded-md text-base font-medium uppercase mt-12 disabled:opacity-60"
                                onClick={handleProceed}
                            >
                                PROCEED
                            </button>
                        </div>
                    ) : (
                        <div className="px-6 pt-2 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Amount</h2>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Balance</p>
                                <p className="text-3xl font-semibold text-red-600">{balanceDisplay}</p>
                            </div>
                            <div className="border-t border-gray-300 my-3"></div>
                            <div className="px-0 mt-5">
                                <button
                                    className="w-full bg-[#C01824] text-white py-2 rounded-md text-sm font-medium uppercase"
                                    onClick={handleProceed}
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    )
                )}

                {/* Step 3 — PIN Screen */}
                {showPayroll && showPinScreen && !showSuccessScreen && (
                    <div className="w-full px-6 pb-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Transaction Pin</h2>
                            <p className="text-sm text-gray-600">Provide transaction pin to fund wallet</p>
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
                        {error.fundWallet && <p className="text-red-500 text-sm mb-3">{error.fundWallet}</p>}
                        <button
                            onClick={handleFundWallet}
                            disabled={loading.fundWallet}
                            className="w-full bg-[#C01824] text-white py-3 rounded-md text-sm font-medium uppercase disabled:opacity-60"
                        >
                            {loading.fundWallet ? 'Processing...' : 'Fund Wallet'}
                        </button>
                    </div>
                )}

                {/* Step 4 — Success */}
                {showSuccessScreen && (
                    <div className='w-full h-full flex flex-col justify-center'>
                        <div className="w-full px-6 pb-6 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
                            <div className="mb-6">
                                <img src={transicationTick} alt="success" />
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-semibold text-gray-700 mb-1">Transaction Successful</h2>
                                <p className="text-sm text-gray-600">You have successfully funded your wallet</p>
                            </div>
                            <button
                                className="w-full bg-[#C01824] text-white py-3 rounded-md text-sm font-medium uppercase"
                                onClick={handleGoBack}
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BalanceModal;
