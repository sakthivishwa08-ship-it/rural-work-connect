// Indian States and Major Districts Directory for Rural Work Connect

export interface StateDistrictMap {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictMap[] = [
  {
    state: 'Tamil Nadu',
    districts: [
      'Madurai',
      'Thanjavur',
      'Coimbatore',
      'Tiruchirappalli',
      'Salem',
      'Tirunelveli',
      'Dindigul',
      'Erode',
      'Cuddalore',
      'Vellore',
      'Theni',
      'Virudhunagar',
      'Sivaganga',
      'Ramanathapuram',
      'Thoothukudi',
      'Kanyakumari',
      'Dharmapuri',
      'Krishnagiri',
      'Namakkal',
      'Karur',
      'Nagapattinam',
      'Tiruvarur',
      'Pudukkottai',
      'Ariyalur',
      'Perambalur',
      'Viluppuram',
      'Kallakurichi',
      'Tirupathur',
      'Ranipet',
      'Chengalpattu',
      'Kanchipuram',
      'Tiruvallur',
      'Chennai'
    ]
  },
  {
    state: 'Andhra Pradesh',
    districts: [
      'Guntur',
      'Krishna',
      'East Godavari',
      'West Godavari',
      'Visakhapatnam',
      'Kurnool',
      'Anantapur',
      'Chittoor',
      'YSR Kadapa',
      'Nellore',
      'Prakasam',
      'Srikakulam',
      'Vizianagaram'
    ]
  },
  {
    state: 'Telangana',
    districts: [
      'Warangal',
      'Karimnagar',
      'Khammam',
      'Nalgonda',
      'Nizamabad',
      'Mahabubnagar',
      'Medak',
      'Rangareddy',
      'Adilabad',
      'Hyderabad'
    ]
  },
  {
    state: 'Karnataka',
    districts: [
      'Mysuru',
      'Mandya',
      'Hassan',
      'Belagavi',
      'Tumakuru',
      'Ballari',
      'Kalaburagi',
      'Shivamogga',
      'Davanagere',
      'Dharwad',
      'Dakshina Kannada',
      'Bengaluru Rural',
      'Bengaluru Urban'
    ]
  },
  {
    state: 'Kerala',
    districts: [
      'Palakkad',
      'Thrissur',
      'Malappuram',
      'Kozhikode',
      'Ernakulam',
      'Alappuzha',
      'Kottayam',
      'Kollam',
      'Thiruvananthapuram',
      'Kannur',
      'Wayanad',
      'Idukki',
      'Kasaragod',
      'Pathanamthitta'
    ]
  },
  {
    state: 'Maharashtra',
    districts: [
      'Pune',
      'Nashik',
      'Ahmednagar',
      'Solapur',
      'Kolhapur',
      'Satara',
      'Aurangabad (Chhatrapati Sambhajinagar)',
      'Nagpur',
      'Amravati',
      'Jalgaon',
      'Latur',
      'Nanded'
    ]
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      'Varanasi',
      'Gorakhpur',
      'Prayagraj',
      'Lucknow',
      'Kanpur',
      'Bareilly',
      'Agra',
      'Meerut',
      'Aligarh',
      'Ayodhya',
      'Jhansi',
      'Moradabad'
    ]
  },
  {
    state: 'Bihar',
    districts: [
      'Patna',
      'Gaya',
      'Muzaffarpur',
      'Bhagalpur',
      'Darbhanga',
      'Purnia',
      'Samastipur',
      'Rohtas',
      'Bhojpur',
      'Vaishali'
    ]
  },
  {
    state: 'Rajasthan',
    districts: [
      'Jaipur',
      'Jodhpur',
      'Udaipur',
      'Kota',
      'Bikaner',
      'Ajmer',
      'Alwar',
      'Bhilwara',
      'Sikar',
      'Pali'
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      'Indore',
      'Bhopal',
      'Jabalpur',
      'Gwalior',
      'Ujjain',
      'Sagar',
      'Dewas',
      'Satna',
      'Ratlam',
      'Rewa'
    ]
  },
  {
    state: 'Gujarat',
    districts: [
      'Ahmedabad',
      'Surat',
      'Vadodara',
      'Rajkot',
      'Bhavnagar',
      'Junagadh',
      'Anand',
      'Mehsana',
      'Kutch',
      'Amreli'
    ]
  },
  {
    state: 'Punjab',
    districts: [
      'Ludhiana',
      'Amritsar',
      'Jalandhar',
      'Patiala',
      'Bathinda',
      'Hoshiarpur',
      'Sangrur',
      'Firozpur',
      'Gurdaspur',
      'Moga'
    ]
  },
  {
    state: 'West Bengal',
    districts: [
      'Bardhaman',
      'Hooghly',
      'Nadia',
      'North 24 Parganas',
      'South 24 Parganas',
      'Murshidabad',
      'Malda',
      'Birbhum',
      'Medinipur',
      'Kolkata'
    ]
  },
  {
    state: 'Odisha',
    districts: [
      'Cuttack',
      'Ganjam',
      'Balasore',
      'Puri',
      'Bhadrak',
      'Sambalpur',
      'Bargarh',
      'Khurda',
      'Mayurbhanj',
      'Jajpur'
    ]
  }
];

export const COMMON_VILLAGES_AND_TOWNS: Record<string, string[]> = {
  Madurai: ['Alanganallur', 'Vadipatti', 'Melur', 'Sholavandan', 'Usilampatti', 'Thiruparankundram', 'Othakadai', 'Kalligudi'],
  Thanjavur: ['Papanasam', 'Kumbakonam', 'Orathanadu', 'Pattukkottai', 'Thiruvaiyaru', 'Budalur', 'Peravurani'],
  Coimbatore: ['Pollachi', 'Sulur', 'Kinathukadavu', 'Mettupalayam', 'Annur', 'Madukkarai', 'Karamadai'],
  Salem: ['Attur', 'Mettur', 'Omalur', 'Edappadi', 'Sankari', 'Yercaud', 'Valapady'],
  Guntur: ['Tenali', 'Mangalagiri', 'Bapatla', 'Narasaraopet', 'Sattenapalle', 'Ponnur'],
  Warangal: ['Hanamkonda', 'Jangaon', 'Narsampet', 'Parkal', 'Wardhannapet'],
  Mysuru: ['Nanjangud', 'Hunsur', 'T. Narasipura', 'Periyapatna', 'K.R. Nagar'],
  Palakkad: ['Chittur', 'Alathur', 'Ottapalam', 'Mannarkkad', 'Pattambi']
};

export const WORK_CATEGORIES = [
  'Agriculture and Farm Work',
  'Construction and Masonry',
  'Painting',
  'Plumbing',
  'Electrical Work',
  'Cleaning',
  'Gardening',
  'Loading and Unloading',
  'Driving',
  'Cooking and Catering',
  'Housekeeping',
  'Delivery',
  'Shop Assistance',
  'General Labour',
  'Other Skills'
] as const;

export function isValidPinCode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}
