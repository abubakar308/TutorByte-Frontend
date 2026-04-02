"use client";

import { useState } from "react";
import { CreditCard, Smartphone, CheckCircle2, Loader2, X } from "lucide-react";
import { initiateStripePayment, submitManualPayment } from "@/services/payment";
import { toast } from "sonner";

interface PaymentModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ booking, onClose, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<"STRIPE" | "MANUAL" | null>(null);
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState("");
  const [manualGateway, setManualGateway] = useState("BKASH");

  // Stripe Flow
  const handleStripe = async () => {
    setLoading(true);
    try {
      const res = await initiateStripePayment(booking.id);
      if (res.success && res.data.clientSecret) {
        // এখানে আপনি Stripe Checkout বা Elements এ রিডাইরেক্ট করবেন
        toast.info("Redirecting to Stripe... (Integration pending)");
        // window.location.href = res.data.checkoutUrl; // যদি URL থাকে
      }
    } catch (error) {
      toast.error("Failed to start Stripe payment");
    } finally {
      setLoading(false);
    }
  };

  // Manual Flow
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId) return toast.error("Please enter Transaction ID");

    setLoading(true);
    try {
      const res = await submitManualPayment({
        bookingId: booking.id,
        transactionId: txId,
        paymentMethod: manualGateway,
      });
      if (res.success) {
        toast.success("Transaction ID submitted! Waiting for approval.");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h2 className="font-black text-xl tracking-tight">Complete Payment</h2>
            <p className="text-xs text-muted-foreground">Booking ID: #{booking.id.slice(-6)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex justify-between items-center">
            <span className="text-sm font-bold opacity-70">Total Amount</span>
            <span className="text-2xl font-black text-primary">${booking.totalPrice}</span>
          </div>

          {!method ? (
            <div className="grid gap-4">
              <button
                onClick={() => setMethod("STRIPE")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group text-left"
              >
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Pay with Card</p>
                  <p className="text-xs text-muted-foreground">Stripe, Visa, Mastercard</p>
                </div>
              </button>

              <button
                onClick={() => setMethod("MANUAL")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-rose-500 hover:bg-rose-50 transition-all group text-left"
              >
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Manual Payment</p>
                  <p className="text-xs text-muted-foreground">bKash, Nagad, Rocket</p>
                </div>
              </button>
            </div>
          ) : method === "MANUAL" ? (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {["BKASH", "NAGAD"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setManualGateway(m)}
                    className={`py-2 rounded-xl border-2 font-bold text-xs transition-all ${
                      manualGateway === m ? "border-rose-500 bg-rose-50 text-rose-600" : "border-border"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border">
                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">How to pay:</p>
                <p className="text-xs font-medium">1. Send <span className="font-bold">${booking.totalPrice}</span> to <span className="font-bold text-primary">01XXXXXXXXX</span></p>
                <p className="text-xs font-medium">2. Enter the Transaction ID below.</p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase ml-1 mb-1 block">Transaction ID</label>
                <input
                  required
                  placeholder="Ex: 8N77XPS9"
                  className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Submit Payment
              </button>
              <button type="button" onClick={() => setMethod(null)} className="w-full text-xs font-bold text-muted-foreground">Go Back</button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CreditCard className="h-8 w-8" />
              </div>
              <p className="font-bold">Stripe Secure Checkout</p>
              <p className="text-xs text-muted-foreground mb-6">Redirecting you to our secure payment partner.</p>
              <button
                onClick={handleStripe}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#635bff] text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Proceed to Stripe"}
              </button>
              <button onClick={() => setMethod(null)} className="mt-4 text-xs font-bold text-muted-foreground">Go Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}