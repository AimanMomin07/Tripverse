import React, { useState, useEffect, useRef } from "react";
import SeatSelector from "./SeatSelector";
import GroupSplit from "./GroupSplit";
import { Flight } from "../utils/mockFlights";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  flight: Flight;
  passengers: number;
  classType: string;
  onComplete: (booking: any) => void;
  onClose: () => void;
};

export default function BookingFlow({
  flight,
  passengers,
  classType,
  onComplete,
  onClose,
}: Props) {
  const [step, setStep] =
    useState<"confirm" | "seats" | "group" | "done">("confirm");
  const [seats, setSeats] = useState<{ id: string; type: string }[]>([]);
  const [split, setSplit] = useState<{ name: string; share: number }[]>([]);
  const [seatFare, setSeatFare] = useState<number>(0); // 💰 Added: extra fare based on seats
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll card into view whenever step changes
  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [step]);

  // 🧮 Base fare per passenger (from selected class)
  const baseFare =
    flight.fareClasses.find((fc) => fc.type === classType)?.price ||
    flight.price;

  // 🧮 Total fare = base fare + extra seat charges
  const totalFare = baseFare * passengers + seatFare;

  return (
    <>
      {/* Step 1: Confirm Booking */}
      <AnimatePresence>
        {step === "confirm" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2 md:px-0"
          >
            <motion.div
              ref={cardRef}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="glass-card p-6 rounded-xl w-full max-w-md glow-animated"
            >
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Confirm Your Booking
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <div>
                    <p className="text-white font-medium">
                      {flight.airline} {flight.id}
                    </p>
                    <p className="text-gray-400">
                      {flight.from} → {flight.to}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">
                      ₹{baseFare.toLocaleString()}
                    </p>
                    <p className="text-gray-400">{classType}</p>
                  </div>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Number of Passengers</span>
                  <span>{passengers}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Total Amount</span>
                  <span>₹{(baseFare * passengers).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="btn btn-outline text-primary border-gray-200 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("seats")}
                  className="btn btn-primary"
                >
                  Continue to Seat Selection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Seat Selector */}
      {step === "seats" && (
        <SeatSelector
          passengers={passengers}
          onConfirm={(selectedSeats) => {
            setSeats(selectedSeats);

            // 💰 calculate seatFare dynamically
            const seatTypePrices: Record<string, number> = {
              window: 600,
              middle: 400,
              aisle: 500,
              "extra-leg": 800,
              regular: 450,
            };

            const extraFare = selectedSeats.reduce(
              (sum, s) => sum + (seatTypePrices[s.type] || 0),
              0
            );
            setSeatFare(extraFare);

            setStep("group");
          }}
          onClose={() => setStep("confirm")}
        />
      )}

      {/* Step 3: Group Split */}
      {step === "group" && (
        <GroupSplit
          amount={totalFare} // ✅ dynamically updated total
          onConfirm={(spl) => {
            setSplit(spl);
            const booking = {
              id: "BK_" + Date.now(),
              flight,
              seats,
              seatFare,
              totalFare,
              split: spl,
              classType,
              createdAt: new Date().toISOString(),
            };

            // save to localStorage (My Trips)
            const trips = JSON.parse(
              localStorage.getItem("tv_my_trips") || "[]"
            );
            trips.unshift(booking);
            localStorage.setItem("tv_my_trips", JSON.stringify(trips));

            onComplete(booking);
            setStep("done");
          }}
          onClose={() => setStep("seats")}
        />
      )}
    </>
  );
}
