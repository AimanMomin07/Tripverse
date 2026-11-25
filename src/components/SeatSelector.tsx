import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SeatType = "window" | "middle" | "aisle" | "extra-leg" | "regular";

type Seat = {
  id: string;
  row: number;
  col: number;
  type: SeatType;
};

type Props = {
  rows?: number;
  passengers?: number;
  onConfirm: (seats: { id: string; type: string }[]) => void;
  onClose: () => void;
};

export default function SeatSelector({ rows = 10, passengers = 1, onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const seatPrices: Record<SeatType, number> = {
    window: 600,
    middle: 400,
    aisle: 500,
    "extra-leg": 800,
    regular: 450,
  };

  const seatLetters = ["A", "B", "C", "D", "E", "F"];
  const seatLayout: Seat[] = [];

  // Generate seat layout (6 seats per row)
  for (let row = 1; row <= rows; row++) {
    for (let col = 0; col < 6; col++) {
      let type: SeatType = "regular";
      if (col === 0 || col === 5) type = "window";
      else if (col === 2 || col === 3) type = "aisle";
      else type = "middle";
      if (row <= 2) type = "extra-leg"; // first 2 rows are extra legroom
      seatLayout.push({ id: `${seatLetters[col]}${row}`, row, col, type });
    }
  }

  const toggleSeat = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= passengers) return prev; // prevent selecting more than passenger count
      return [...prev, id];
    });
  };

  const getSeatType = (id: string): SeatType => {
    const seat = seatLayout.find((s) => s.id === id);
    return seat ? seat.type : "regular";
  };

  const totalFare = useMemo(() => {
    return selected.reduce((sum, id) => sum + seatPrices[getSeatType(id)], 0);
  }, [selected]);

  const typeColors: Record<SeatType, string> = {
    window: "bg-[#C5A56F]/90 hover:bg-[#C5A56F] text-black", // gold
    middle: "bg-gray-500/70 hover:bg-gray-500",
    aisle: "bg-green-600/70 hover:bg-green-600",
    "extra-leg": "bg-purple-600/80 hover:bg-purple-600",
    regular: "bg-blue-600/80 hover:bg-blue-600",
  };

  const typeLabels: Record<SeatType, string> = {
    window: "Window Seat – ₹600 🌅",
    middle: "Middle Seat – ₹400",
    aisle: "Aisle Seat – ₹500 🚶‍♂️",
    "extra-leg": "Extra Legroom – ₹800 🦵",
    regular: "Regular Seat – ₹450",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 shadow-2xl w-full max-w-3xl"
        >
          <h3
            className="text-2xl font-semibold mb-5 text-center"
            style={{ color: "var(--gold, #C5A56F)" }}
          >
            ✈️ Choose Your Seats
          </h3>

          {/* Plane layout */}
          <div className="overflow-x-auto mb-6">
            <div className="flex flex-col items-center">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-4 mb-2">
                  {/* Left section A–C */}
                  <div className="flex gap-2">
                    {seatLayout
                      .filter((s) => s.row === rowIndex + 1 && s.col < 3)
                      .map((seat) => {
                        const isSelected = selected.includes(seat.id);
                        return (
                          <motion.div
                            key={seat.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSeat(seat.id)}
                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                              isSelected
                                ? "ring-4 ring-[#C5A56F]"
                                : "ring-1 ring-gray-700"
                            } ${typeColors[seat.type]}`}
                            title={typeLabels[seat.type]}
                          >
                            {seat.id}
                          </motion.div>
                        );
                      })}
                  </div>

                  {/* Aisle gap */}
                  <div className="w-6" />

                  {/* Right section D–F */}
                  <div className="flex gap-2">
                    {seatLayout
                      .filter((s) => s.row === rowIndex + 1 && s.col >= 3)
                      .map((seat) => {
                        const isSelected = selected.includes(seat.id);
                        return (
                          <motion.div
                            key={seat.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleSeat(seat.id)}
                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                              isSelected
                                ? "ring-4 ring-[#C5A56F]"
                                : "ring-1 ring-gray-700"
                            } ${typeColors[seat.type]}`}
                            title={typeLabels[seat.type]}
                          >
                            {seat.id}
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            {Object.entries(typeLabels).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2 text-gray-300">
                <div className={`w-4 h-4 rounded ${typeColors[type as SeatType]}`}></div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Total Fare */}
          <div className="text-center text-lg text-gray-200 font-medium mb-4">
            💰 Total Seat Fare:{" "}
            <span className="text-[#C5A56F] font-semibold">₹{totalFare}</span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn border border-gray-400 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onConfirm(
                  selected.map((id) => ({
                    id,
                    type: getSeatType(id),
                  }))
                )
              }
              disabled={selected.length !== passengers}
              className={`btn px-4 py-2 rounded-md font-semibold ${
                selected.length === passengers
                  ? "bg-[#C5A56F] hover:bg-[#b89655] text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Seats ({selected.length}/{passengers})
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
