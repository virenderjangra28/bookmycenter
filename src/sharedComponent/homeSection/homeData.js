export const SEARCH_LOCATIONS = [
  "Gurugram, Haryana",
  "New Delhi, Delhi",
  "Noida, Uttar Pradesh",
  "Bengaluru, Karnataka",
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Chandigarh",
];

export const SEARCH_CENTER_TYPES = [
  "CBT Center",
  "Pen & Paper Exam Center",
  "Skill Assessment Center",
  "Training Center",
  "Certification Center",
  "Business & Interview Center",
];

export const CENTER_TYPES = [
  {
    title: "Computer-Based Test Centers",
    icon: "cbt",
    color: "bg-[#e8f1ff] text-[#0056D2]",
    href: "/book-a-center?type=CBT",
  },
  {
    title: "Pen & Paper Exam Centers",
    icon: "pbt",
    color: "bg-[#fff3e8] text-[#e67a22]",
    href: "/book-a-center?type=PBT",
  },
  {
    title: "Skill Assessment Centers",
    icon: "skill",
    color: "bg-[#f3e8ff] text-[#7c3aed]",
    href: "/book-a-center?type=Assessment",
  },
  {
    title: "Training Centers",
    icon: "training",
    color: "bg-[#e8f8f0] text-[#0f9d58]",
    href: "/book-a-center?type=Training",
  },
  {
    title: "Certification Centers",
    icon: "certification",
    color: "bg-[#fde8ee] text-[#d92d4a]",
    href: "/book-a-center?type=Certification",
  },
  {
    title: "Business & Interview Centers",
    icon: "business",
    color: "bg-[#e8f6fb] text-[#0e8abb]",
    href: "/book-a-center?type=Business",
  },
];

export const FEATURED_CENTERS = [
  {
    id: 1,
    name: "ABC Digital Examination Center",
    location: "Gurugram, Haryana",
    rating: 4.8,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    seats: 250,
    labs: 4,
    internet: "Dual",
    price: "₹650",
    available: true,
  },
  {
    id: 2,
    name: "Bright Future CBT Center",
    location: "Noida, Uttar Pradesh",
    rating: 4.7,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    seats: 200,
    labs: 3,
    internet: "Dual",
    price: "₹600",
    available: true,
  },
  {
    id: 3,
    name: "Knowledge Hub Exam Center",
    location: "Delhi, Delhi",
    rating: 4.6,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
    seats: 300,
    labs: 5,
    internet: "Dual",
    price: "₹700",
    available: true,
  },
  {
    id: 4,
    name: "Excel Test Center",
    location: "Bengaluru, Karnataka",
    rating: 4.5,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80",
    seats: 150,
    labs: 2,
    internet: "Dual",
    price: "₹550",
    available: true,
  },
  {
    id: 5,
    name: "Premier Assessment Center",
    location: "Pune, Maharashtra",
    rating: 4.7,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    seats: 180,
    labs: 3,
    internet: "Dual",
    price: "₹680",
    available: true,
  },
];

export const VALUE_PROPS = [
  {
    label: "Verified Infrastructure",
    description: "All centers are verified for quality, security & reliability.",
    icon: "shield",
  },
  {
    label: "Live Availability",
    description: "Real-time availability for your preferred dates & shifts.",
    icon: "calendar",
  },
  {
    label: "Transparent Comparison",
    description: "Compare centers based on facilities, ratings & price.",
    icon: "compare",
  },
  {
    label: "Enterprise Support",
    description: "Dedicated support for multi-city and bulk requirements.",
    icon: "support",
  },
];

export const ENTERPRISE_STATS = [
  { value: "75+", label: "Cities", icon: "cities" },
  { value: "22,500+", label: "Candidates", icon: "candidates" },
  { value: "12 Sept 2025", label: "Exam Date", icon: "date" },
  { value: "3", label: "Shifts", icon: "shifts" },
];

export const ENTERPRISE_STEPS = [
  { label: "Center Discovery", icon: "discovery" },
  { label: "Availability Matching", icon: "matching" },
  { label: "Infrastructure Verification", icon: "verification" },
  { label: "Consolidated Proposal", icon: "proposal" },
  { label: "End to End Support", icon: "support" },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search",
    description: "Enter location, center type, date and capacity.",
    icon: "search",
    color: "bg-[#e8f1ff] text-[#0056D2]",
  },
  {
    step: "02",
    title: "Compare",
    description: "Compare verified centers based on facilities, price, ratings & availability.",
    icon: "compare",
    color: "bg-[#e8f8f0] text-[#0f9d58]",
  },
  {
    step: "03",
    title: "Book",
    description: "Select your preferred center and confirm your booking.",
    icon: "book",
    color: "bg-[#f3e8ff] text-[#7c3aed]",
  },
  {
    step: "04",
    title: "Conduct",
    description: "Use the center for your exams, assessments or training.",
    icon: "conduct",
    color: "bg-[#fff3e8] text-[#e67a22]",
  },
];
