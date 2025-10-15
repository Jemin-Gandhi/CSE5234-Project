const PRODUCTS = [
  { 
    id: 1, 
    name: 'Colorado Ski Adventure', 
    price: 649.00,
    location: 'Breckenridge, CO',
    duration: '5 Days / 4 Nights',
    departureDate: 'January 15, 2026',
    images: [
      '/images/vacation1/breckenridge.jpeg',
      '/images/vacation1/cabin.jpeg',
      '/images/vacation1/hottub.jpg'
    ],
    shortDescription: 'Luxury ski resort getaway with mountain views',
    description: 'Experience the ultimate winter getaway at our premier Breckenridge ski resort.',
    includes: [
      'Luxury cabin accommodation with hot tub',
      'All-day lift tickets for 4 days',
      'Premium ski/snowboard equipment rental',
      'Daily gourmet breakfast buffet',
      'Guided ski tours with certified instructors',
      'Access to resort spa and fitness center',
      'Evening après-ski activities'
    ],
    highlights: [
      'Ski-in/ski-out access',
      'Private hot tub with mountain views',
      'Within walking distance to Main Street',
      'Perfect for all skill levels'
    ],
    availableTickets: 15
  },
  { 
    id: 2, 
    name: 'Tropical Paradise Retreat', 
    price: 899.00,
    location: 'Maui, Hawaii',
    duration: '7 Days / 6 Nights',
    departureDate: 'March 22, 2026',
    images: [
      '/images/vacation2/maui-beach.jpg',
      '/images/vacation2/maui-resort.jpg',
      '/images/vacation2/maui-snorkeling.webp'
    ],
    shortDescription: 'Beachfront resort with water activities',
    description: 'Escape to paradise with our exclusive Maui beach resort package.',
    includes: [
      'Oceanfront luxury suite',
      'Daily breakfast and dinner',
      'Snorkeling equipment and lessons',
      'Sunset dinner cruise',
      'Traditional Hawaiian luau experience',
      'Spa treatment package',
      'Airport transfers'
    ],
    highlights: [
      'Private beach access',
      'Infinity pool overlooking ocean',
      'Championship golf course nearby',
      'Complimentary surfboard rentals'
    ],
    availableTickets: 8
  },
  { 
    id: 3, 
    name: 'European City Explorer', 
    price: 1299.00,
    location: 'Paris, Rome & Barcelona',
    duration: '10 Days / 9 Nights',
    departureDate: 'April 10, 2026',
    images: [
      '/images/vacation3/paris.jpg',
      '/images/vacation3/rome.jpg',
      '/images/vacation3/barcelona.avif'
    ],
    shortDescription: 'Multi-city tour through Europe\'s finest',
    description: 'Discover three of Europe\'s most iconic cities in one unforgettable journey.',
    includes: [
      'Boutique hotel accommodations',
      'High-speed rail passes between cities',
      'Guided tours of major attractions',
      'Skip-the-line museum passes',
      'Daily continental breakfast',
      'Welcome dinner in each city',
      'Professional tour guide services'
    ],
    highlights: [
      'Eiffel Tower night tour',
      'Vatican Museums private viewing',
      'Sagrada Familia priority access',
      'Local food tasting experiences'
    ],
    availableTickets: 12
  },
  { 
    id: 4, 
    name: 'African Safari Experience', 
    price: 2199.00,
    location: 'Serengeti, Tanzania',
    duration: '8 Days / 7 Nights',
    departureDate: 'June 5, 2026',
    images: [
      '/images/vacation4/serengeti-national-park.jpg',
      '/images/vacation4/safari-lodge.jpg',
      '/images/vacation4/safari-hot-air-balloon.webp'
    ],
    shortDescription: 'Once-in-a-lifetime wildlife safari',
    description: 'Witness the Big Five and experience the majesty of the African wilderness.',
    includes: [
      'Luxury safari lodge accommodation',
      'All meals and beverages',
      'Daily game drives with expert guides',
      'Visit to Maasai village',
      'Hot air balloon safari',
      'Professional wildlife photography session',
      'International and domestic flights'
    ],
    highlights: [
      'Witness the Great Migration',
      'Big Five wildlife viewing',
      'Sunset safari drives',
      'Star gazing experiences'
    ],
    availableTickets: 6
  },
  { 
    id: 5, 
    name: 'Alaskan Cruise & Glacier Tour', 
    price: 1599.00,
    location: 'Alaska Inside Passage',
    duration: '9 Days / 8 Nights',
    departureDate: 'July 18, 2026',
    images: [
      '/images/vacation5/alaska-cruise-ship.jpg',
      '/images/vacation5/glacier-excursion.avif',
      '/images/vacation5/alaska-dog-sledding.png'
    ],
    shortDescription: 'Cruise through stunning glacial landscapes',
    description: 'Sail through Alaska\'s pristine waters and witness breathtaking glaciers up close.',
    includes: [
      'Balcony stateroom on luxury cruise ship',
      'All meals and entertainment onboard',
      'Shore excursions at each port',
      'Glacier Bay National Park tour',
      'Whale watching expedition',
      'Dog sledding adventure',
      'Specialty dining package'
    ],
    highlights: [
      'Glacier calving experiences',
      'Wildlife spotting opportunities',
      'Northern lights viewing (seasonal)',
      'Gold Rush heritage tours'
    ],
    availableTickets: 20
  },
];

export default PRODUCTS;