import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { DeviceTopBar } from '../components/DeviceTopBar';

interface CheckoutScreenProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onBack, onComplete }) => {
  const { docket, addDocketItem, settleDocket, resetDocket, setActiveTab } = useSalon();

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [showAddAddonModal, setShowAddAddonModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  // Calculations
  const subtotal = docket.items.reduce((acc, curr) => acc + curr.price, 0);
  const taxes = Math.round(subtotal * docket.taxRate);
  const grandTotal = subtotal + taxes;
  const balanceDue = Math.max(0, grandTotal - docket.advancePaid);

  const handleSettle = () => {
    settleDocket(selectedMethod);
    setShowPaymentSuccessModal(true);
  };

  const handleQuickAddService = (title: string, price: number) => {
    addDocketItem({
      title,
      subtitle: 'Chair-side VIP add-on',
      price,
      isAddOn: true,
    });
    setShowAddAddonModal(false);
  };

  const handleFinishAndReturn = () => {
    setShowPaymentSuccessModal(false);
    if (onComplete) {
      onComplete();
    } else {
      setActiveTab('pulse');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fff9ef] text-[#1E1424] overflow-y-auto luxury-scrollbar relative">
      <DeviceTopBar islandText="Station 02" />

      {/* Header */}
      <div className="px-5 py-3 border-b border-[#1E1424]/10 bg-[#fff9ef] flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else setActiveTab('pulse');
            }}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E1424] shadow-xs border border-[#1E1424]/10 hover:bg-stone-50 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <h1 className="font-sans text-[20px] font-bold text-[#1E1424]">
            Station {docket.stationNumber} Docket
          </h1>
        </div>

        {docket.isSettled ? (
          <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-sans text-[11px] font-bold">
            Settled ✓
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans text-[11px] font-bold">
            Ready to Settle
          </span>
        )}
      </div>

      <div className="px-5 py-3 space-y-3.5 flex-1 font-sans">
        {/* Client VIP card */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#1E1424]/10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {docket.clientInitials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-sans text-[15px] font-bold text-[#1E1424]">
                  {docket.clientName}
                </h2>
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-bold rounded">
                  {docket.vipTier}
                </span>
              </div>
              <p className="text-[11px] text-[#1E1424]/60">
                {docket.phone} • {docket.visitCount} Visits
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E1424]/10 text-[11px] text-[#1E1424]/75 bg-[#fcf8f1] p-2 rounded-xl">
            {docket.notes}
          </div>
        </div>

        {/* In-Chair Bill items */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#1E1424]/10 space-y-2 shadow-xs text-[13px]">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              Service Breakdown
            </span>
            {!docket.isSettled && (
              <button
                type="button"
                onClick={() => setShowAddAddonModal(true)}
                className="text-[11px] font-semibold text-[#1E1424] hover:text-amber-900 flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">add_circle</span> Add item
              </button>
            )}
          </div>

          {docket.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-1.5 border-b border-[#1E1424]/5"
            >
              <div>
                <h3 className="font-bold text-[#1E1424] text-[13px]">{item.title}</h3>
                <span
                  className={`text-[11px] ${
                    item.isAddOn ? 'text-emerald-700 font-medium' : 'text-[#1E1424]/60'
                  }`}
                >
                  {item.subtitle}
                </span>
              </div>
              <span className="font-bold tabular-nums text-[#1E1424]">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          {/* Subtotal & taxes */}
          <div className="flex justify-between text-[#1E1424]/60 text-[12px] pt-1">
            <span>Subtotal</span>
            <span className="tabular-nums font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-[#1E1424]/60 text-[12px]">
            <span>Taxes & GST (18%)</span>
            <span className="tabular-nums font-semibold">₹{taxes.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-emerald-800 font-medium text-[12px]">
            <span>Online Advance Paid (UPI)</span>
            <span className="tabular-nums font-bold">
              -₹{docket.advancePaid.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border-t-2 border-[#1E1424]/10 pt-2 flex justify-between items-center text-[16px] font-bold text-[#1E1424]">
            <span>Balance Due at Front Desk</span>
            <span className="text-[20px] tabular-nums font-bold text-amber-900">
              ₹{balanceDue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Front desk payment actions */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E1424]/70 block mb-1.5">
            Collect Remaining Balance
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bold">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`p-2.5 rounded-xl flex flex-col items-center gap-1 shadow-xs cursor-pointer transition-all ${
                selectedMethod === 'upi'
                  ? 'bg-[#1E1424] text-white shadow-sm'
                  : 'bg-white border border-[#1E1424]/15 text-[#1E1424] hover:bg-stone-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              <span>UPI Scan</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-2.5 rounded-xl flex flex-col items-center gap-1 shadow-xs cursor-pointer transition-all ${
                selectedMethod === 'card'
                  ? 'bg-[#1E1424] text-white shadow-sm'
                  : 'bg-white border border-[#1E1424]/15 text-[#1E1424] hover:bg-stone-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">credit_card</span>
              <span>Card POS</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('cash')}
              className={`p-2.5 rounded-xl flex flex-col items-center gap-1 shadow-xs cursor-pointer transition-all ${
                selectedMethod === 'cash'
                  ? 'bg-[#1E1424] text-white shadow-sm'
                  : 'bg-white border border-[#1E1424]/15 text-[#1E1424] hover:bg-stone-50'
              }`}
            >
              <span className="material-symbols-outlined text-base">payments</span>
              <span>Cash Box</span>
            </button>
          </div>
        </div>

        {/* UPI Terminal Simulator snippet */}
        {selectedMethod === 'upi' && !docket.isSettled && (
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <div className="w-24 h-24 bg-white border border-stone-200 rounded-xl mx-auto flex items-center justify-center p-1.5 mb-1.5 shadow-xs">
              {/* QR Mockup visual */}
              <div className="w-full h-full border-2 border-stone-800 p-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-black" />
                  <div className="w-4 h-4 bg-black" />
                </div>
                <div className="text-[8px] font-mono font-bold tracking-tight text-center">
                  ₹{balanceDue}
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-black" />
                  <div className="w-2 h-2 bg-black self-end" />
                </div>
              </div>
            </div>
            <span className="text-[10px] text-[#1E1424]/70 font-medium">
              Scan via PhonePe, GPay, or Paytm terminal
            </span>
          </div>
        )}
      </div>

      {/* Sticky Completion Button */}
      <div className="p-4 bg-white border-t border-[#1E1424]/10 sticky bottom-0 z-30 shrink-0">
        {docket.isSettled ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPaymentSuccessModal(true)}
              className="flex-1 py-3 bg-emerald-800 text-white rounded-xl font-sans text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              View Invoice Receipt
            </button>
            <button
              type="button"
              onClick={resetDocket}
              className="py-3 px-3 bg-stone-100 hover:bg-stone-200 text-[#1E1424] rounded-xl font-sans text-[12px] font-semibold cursor-pointer"
            >
              Reset
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSettle}
            className="w-full py-3.5 bg-[#1E1424] hover:bg-[#2C1E35] text-white rounded-xl font-sans text-[14px] font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Collect ₹{balanceDue.toLocaleString('en-IN')} & Complete Visit
            <span className="material-symbols-outlined text-sm">check_circle</span>
          </button>
        )}
      </div>

      {/* Add Add-On Service Drawer */}
      {showAddAddonModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-sm shadow-2xl border-t border-[#1E1424]/15 font-sans">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-[#1E1424]">Add Chair-Side Treatment</h3>
              <button
                type="button"
                onClick={() => setShowAddAddonModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleQuickAddService('Kérastase Fusio-Dose Treatment', 1450)}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-[#1E1424] flex justify-between items-center text-left cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1E1424]">Kérastase Fusio-Dose Treatment</h4>
                  <span className="text-[10px] text-stone-500">Instant molecular hair repair</span>
                </div>
                <span className="text-xs font-bold text-amber-900">+₹1,450</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddService('Olaplex No. 2 Bond Multiplier', 1200)}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-[#1E1424] flex justify-between items-center text-left cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1E1424]">Olaplex No. 2 Bond Multiplier</h4>
                  <span className="text-[10px] text-stone-500">Bleach protection & strengthener</span>
                </div>
                <span className="text-xs font-bold text-amber-900">+₹1,200</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddService('Moroccanoil Argan Gloss Infusion', 950)}
                className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-[#1E1424] flex justify-between items-center text-left cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1E1424]">Moroccanoil Argan Gloss Infusion</h4>
                  <span className="text-[10px] text-stone-500">Mirror shine topcoat finish</span>
                </div>
                <span className="text-xs font-bold text-amber-900">+₹950</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Invoice Receipt Modal */}
      {showPaymentSuccessModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 font-sans text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1E1424]">Payment Settled</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Station {docket.stationNumber} • Ananya Sharma
            </p>

            <div className="my-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-stone-500">
                <span>Total Bill:</span>
                <span className="font-semibold text-stone-800">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Advance Paid:</span>
                <span className="font-semibold text-stone-800">-₹{docket.advancePaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-1.5">
                <span>Settled Amount:</span>
                <span className="text-emerald-700">₹{balanceDue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 pt-1">
                <span>Method:</span>
                <span className="uppercase font-semibold text-stone-700">{selectedMethod} Payment</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFinishAndReturn}
                className="flex-1 py-3 bg-[#1E1424] text-white rounded-xl text-xs font-bold hover:bg-[#2C1E35] cursor-pointer"
              >
                Close & Return to Pulse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
