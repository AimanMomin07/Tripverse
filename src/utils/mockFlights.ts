// types and helpers
export type FareClassType = 'Economy' | 'Premium' | 'Business' | 'First';

export interface FareClassDetails {
  type: FareClassType;
  price: number;
  baggage: string;
  amenities: string[];
}

export type Flight = {
  id: string;
  airline: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  durationMin: number;
  price: number;
  stops: number;
  aircraft?: string;
  baggage?: string;
  amenities?: string[];
  rating?: number;
  description?: string;
  fareClasses: FareClassDetails[];
  returnSegment?: string; // ID of return flight if part of round trip
};

// Airport codes reference:
// RPR: Raipur, BOM: Mumbai, DEL: Delhi, BLR: Bangalore
// DXB: Dubai, SIN: Singapore, LHR: London Heathrow
// BKK: Bangkok, HKG: Hong Kong, FRA: Frankfurt

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const formatDate = (d: Date) => d.toISOString().split('.')[0];
const addHours = (date: Date, h: number) => {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + h);
  return formatDate(newDate);
};

// Helper to create return flight ID
const returnId = (id: string) => id + 'R';

export const MOCK_FLIGHTS: Flight[] = [
  // Original flights
  { id: 'TV100', airline: 'Aurora Air', from: 'RPR', to: 'BOM', depart: formatDate(tomorrow), arrive: addHours(tomorrow, 2), durationMin: 120, price: 5500, stops: 0, aircraft: 'A320neo', baggage: '20kg', amenities: ['wifi','meal','entertainment'], rating: 4.6, description: 'Direct morning flight to Mumbai.', fareClasses: [
    { type: 'Economy', price: 5500, baggage: '20kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Premium', price: 8500, baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge'] },
    { type: 'Business', price: 12500, baggage: '40kg', amenities: ['wifi','meal','entertainment','lounge','flatbed'] }
  ], returnSegment: 'TV100R' },
  { id: 'TV100R', airline: 'Aurora Air', from: 'BOM', to: 'RPR', depart: addHours(tomorrow, 12), arrive: addHours(tomorrow, 14), durationMin: 120, price: 5800, stops: 0, aircraft: 'A320neo', baggage: '20kg', amenities: ['wifi','meal','entertainment'], rating: 4.6, description: 'Direct evening return to Raipur.', fareClasses: [
    { type: 'Economy', price: 5800, baggage: '20kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Premium', price: 8800, baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge'] },
    { type: 'Business', price: 13000, baggage: '40kg', amenities: ['wifi','meal','entertainment','lounge','flatbed'] }
  ] },
  { id: 'TV101', airline: 'Regal Wings', from: 'RPR', to: 'BOM', depart: addHours(tomorrow, 4), arrive: addHours(tomorrow, 6), durationMin: 120, price: 4800, stops: 0, aircraft: 'B737-800', baggage: '15kg', amenities: ['wifi','snack'], rating: 4.2, description: 'Afternoon direct service.', fareClasses: [
    { type: 'Economy', price: 4800, baggage: '15kg', amenities: ['wifi','snack'] },
    { type: 'Premium', price: 7500, baggage: '25kg', amenities: ['wifi','meal','entertainment'] }
  ], returnSegment: 'TV101R' },
  { id: 'TV101R', airline: 'Regal Wings', from: 'BOM', to: 'RPR', depart: addHours(tomorrow, 16), arrive: addHours(tomorrow, 18), durationMin: 120, price: 4600, stops: 0, aircraft: 'B737-800', baggage: '15kg', amenities: ['wifi','snack'], rating: 4.2, description: 'Evening return service.', fareClasses: [
    { type: 'Economy', price: 4600, baggage: '15kg', amenities: ['wifi','snack'] },
    { type: 'Premium', price: 7200, baggage: '25kg', amenities: ['wifi','meal','entertainment'] }
  ] },
  { id: 'TV200', airline: 'Emirates', from: 'BOM', to: 'DXB', depart: formatDate(tomorrow), arrive: addHours(tomorrow, 4), durationMin: 240, price: 32000, stops: 0, aircraft: 'B777-300ER', baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge'], rating: 4.8, description: 'Premium direct Dubai service.', fareClasses: [
    { type: 'Economy', price: 32000, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 95000, baggage: '40kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa'] },
    { type: 'First', price: 185000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa','chauffeur'] }
  ], returnSegment: 'TV200R' },
  { id: 'TV200R', airline: 'Emirates', from: 'DXB', to: 'BOM', depart: addHours(tomorrow, 24), arrive: addHours(tomorrow, 28), durationMin: 240, price: 34000, stops: 0, aircraft: 'B777-300ER', baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge'], rating: 4.8, description: 'Return Dubai-Mumbai service.', fareClasses: [
    { type: 'Economy', price: 34000, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 98000, baggage: '40kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa'] },
    { type: 'First', price: 190000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa','chauffeur'] }
  ] },
  { id: 'TV300', airline: 'Lufthansa', from: 'BOM', to: 'FRA', depart: formatDate(tomorrow), arrive: addHours(tomorrow, 12), durationMin: 720, price: 75000, stops: 0, aircraft: 'A340-600', baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge'], rating: 4.7, description: 'Direct Frankfurt service.', fareClasses: [
    { type: 'Economy', price: 75000, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 245000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','limousine'] }
  ], returnSegment: 'TV300R' },
  { id: 'TV300R', airline: 'Lufthansa', from: 'FRA', to: 'BOM', depart: addHours(tomorrow, 36), arrive: addHours(tomorrow, 48), durationMin: 720, price: 78000, stops: 0, aircraft: 'A340-600', baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge'], rating: 4.7, description: 'Return Frankfurt-Mumbai service.', fareClasses: [
    { type: 'Economy', price: 78000, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 250000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','limousine'] }
  ] },

  // Additional 15 flights (domestic + international)
  { id: 'TV400', airline: 'Indigo Airlines', from: 'DEL', to: 'BLR', depart: addHours(tomorrow, 2), arrive: addHours(tomorrow, 5), durationMin: 180, price: 6000, stops: 0, aircraft: 'A320', baggage: '20kg', amenities: ['wifi','snack'], rating: 4.3, description: 'Morning non-stop flight to Bangalore.', fareClasses: [
    { type: 'Economy', price: 6000, baggage: '20kg', amenities: ['wifi','snack'] },
    { type: 'Premium', price: 9500, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 15500, baggage: '40kg', amenities: ['wifi','meal','entertainment','lounge'] }
  ], returnSegment: 'TV400R' },
  { id: 'TV400R', airline: 'Indigo Airlines', from: 'BLR', to: 'DEL', depart: addHours(tomorrow, 14), arrive: addHours(tomorrow, 17), durationMin: 180, price: 6200, stops: 0, aircraft: 'A320', baggage: '20kg', amenities: ['wifi','snack'], rating: 4.3, description: 'Evening return flight to Delhi.', fareClasses: [
    { type: 'Economy', price: 6200, baggage: '20kg', amenities: ['wifi','snack'] },
    { type: 'Premium', price: 9700, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 16000, baggage: '40kg', amenities: ['wifi','meal','entertainment','lounge'] }
  ] },
  { id: 'TV500', airline: 'Singapore Airlines', from: 'SIN', to: 'BKK', depart: addHours(tomorrow, 3), arrive: addHours(tomorrow, 6), durationMin: 180, price: 18000, stops: 0, aircraft: 'A350-900', baggage: '25kg', amenities: ['wifi','meal','entertainment','lounge'], rating: 4.9, description: 'Direct flight to Bangkok with premium services.', fareClasses: [
    { type: 'Economy', price: 18000, baggage: '25kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 55000, baggage: '35kg', amenities: ['wifi','meal','entertainment','lounge','flatbed'] },
    { type: 'First', price: 110000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','chauffeur'] }
  ], returnSegment: 'TV500R' },
  { id: 'TV500R', airline: 'Singapore Airlines', from: 'BKK', to: 'SIN', depart: addHours(tomorrow, 15), arrive: addHours(tomorrow, 18), durationMin: 180, price: 18500, stops: 0, aircraft: 'A350-900', baggage: '25kg', amenities: ['wifi','meal','entertainment','lounge'], rating: 4.9, description: 'Return flight from Bangkok to Singapore.', fareClasses: [
    { type: 'Economy', price: 18500, baggage: '25kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 56000, baggage: '35kg', amenities: ['wifi','meal','entertainment','lounge','flatbed'] },
    { type: 'First', price: 112000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','chauffeur'] }
  ] },
  { id: 'TV600', airline: 'British Airways', from: 'LHR', to: 'HKG', depart: addHours(tomorrow, 5), arrive: addHours(tomorrow, 17), durationMin: 720, price: 120000, stops: 0, aircraft: 'B777-300ER', baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge','spa'], rating: 4.7, description: 'Long-haul premium flight to Hong Kong.', fareClasses: [
    { type: 'Economy', price: 120000, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 350000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa'] },
    { type: 'First', price: 700000, baggage: '60kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa','chauffeur'] }
  ], returnSegment: 'TV600R' },
  { id: 'TV600R', airline: 'British Airways', from: 'HKG', to: 'LHR', depart: addHours(tomorrow, 30), arrive: addHours(tomorrow, 42), durationMin: 720, price: 125000, stops: 0, aircraft: 'B777-300ER', baggage: '30kg', amenities: ['wifi','meal','entertainment','lounge','spa'], rating: 4.7, description: 'Return long-haul flight from Hong Kong to London.', fareClasses: [
    { type: 'Economy', price: 125000, baggage: '30kg', amenities: ['wifi','meal','entertainment'] },
    { type: 'Business', price: 360000, baggage: '50kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa'] },
    { type: 'First', price: 710000, baggage: '60kg', amenities: ['wifi','meal','entertainment','lounge','flatbed','spa','chauffeur'] }
  ] },
];
