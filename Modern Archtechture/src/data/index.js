// All content below comes from the original "Luxe Studio" site (images, copy, brand)
// and is mapped to what a construction / architecture project needs.
import heroImg from "../assets/images/pic-1.png";
import aboutImg from "../assets/images/ab-3.jpeg";
import modern from "../assets/images/modern.jpg";
import glass from "../assets/images/glass.jpeg";
import glassHouse from "../assets/images/glass-hous.png";
import penthouse from "../assets/images/penthouse.jpg";
import sofa from "../assets/images/sofa.jpeg";
import wind from "../assets/images/wind.jpeg";
import white from "../assets/images/white.jpeg";
import hotel from "../assets/images/hotel.jpg";
import homeThree from "../assets/images/home-3.jpg";
const urban = homeThree;
import homeFive from "../assets/images/home-5.jpg";
import sittingImage from "../assets/images/sitting-image.png";
import oip from "../assets/images/OIP.webp";
import michael from "../assets/images/michael.jpg";
import emma from "../assets/images/emma.jpg";
import Ahamd from "../assets/images/ahmad.webp";
import Bilal from "../assets/images/bilal.webp";
import Safora from "../assets/images/safora.jpeg";
import Sarah from "../assets/images/sarah.jpg";
import logo from "../assets/images/Luxe.jpeg";
import homeOne from "../assets/images/home-1.jpg";
import homeTwo from "../assets/images/home-2.jpg";

export const IMG = {
  heroImg,
  aboutImg,
  modern,
  glass,
  glassHouse,
  penthouse,
  sofa,
  wind,
  white,
  hotel,
  urban,
  homeThree,
  homeFive,
  sittingImage,
  oip,
  michael,
  emma,
  Safora,
  Sarah,
  logo,
  Ahamd,
  Bilal,
};

export const BRAND = {
  name: "LUXE",
  sub: "STUDIO",
  product: "Modern Archetecture",
};

export const PALETTE = {
  gold: "#e2b41e",
  bronze: "#e1aa80",
  sand: "#f4d6a0",
  charcoal: "#222222",
  slate: "#a99f90",
  olive: "#c5d444",
  brick: "#d6320d",
};

//  ---------- Phases (from the "Our Design Journey" process section) ----------
export const PHASES = [
  {
    key: "discovery",
    label: "Discovery",
    text: "Understanding your vision, lifestyle, and project requirements through detailed consultation and site analysis.",
  },
  {
    key: "concept",
    label: "Concept",
    text: "Developing initial design concepts, mood boards, and spatial planning to establish the project direction.",
  },
  {
    key: "design",
    label: "Design",
    text: "Refining designs through detailed drawings, 3D visualizations, and material selection for approval.",
  },
  {
    key: "execution",
    label: "Execution",
    text: "Managing construction and installation phases to ensure flawless delivery of your dream space.",
  },
];

//  ---------- Services (from the "Comprehensive Design Solutions" section) ----------
export const SERVICES = [
  {
    id: "arch",
    title: "Architecture Design",
    image: heroImg,
    text: "Complete architectural solutions from initial concept through construction documentation and project management.",
    search: "architecture architect design construction documents",
  },
  {
    id: "interior",
    title: "Interior Design",
    image: penthouse,
    text: "Thoughtful interior spaces that seamlessly blend functionality with aesthetic excellence and personal style.",
    search: "interior design furniture finishes",
  },
  {
    id: "space",
    title: "Space Planning",
    image: homeFive,
    text: "Strategic space optimization that maximizes functionality while maintaining elegant design principles.",
    search: "space planning layout optimization",
  },
  {
    id: "pm",
    title: "Project Management",
    image: wind,
    text: "Comprehensive project oversight ensuring timely delivery, quality control, and seamless execution.",
    search: "project management schedule quality control",
  },
  {
    id: "viz",
    title: "Design Consultation",
    image: oip,
    text: "Expert guidance and creative direction to help bring your architectural and design vision to life.",
    search: "design consultation advice direction",
  },
  {
    id: "consult",
    title: "3D Visualization",
    image: homeThree,
    text: "Photorealistic renderings and virtual walkthroughs that bring your project to life before construction begins.",
    search: "3d visualization rendering walkthrough",
  },
  {
    id: "luxury-interiors",
    title: "Luxury Home Interiors",
    image: homeOne,
    text: "Elegant living spaces designed around comfort, refined materials, and your personal style.",
    search: "luxury home interior living room renovation decor",
  },
  {
    id: "modern-homes",
    title: "Modern Home Design",
    image: homeTwo,
    text: "Contemporary residential design that balances clean architecture, natural light, and outdoor living.",
    search: "modern home residential house architecture exterior",
  },
];

// ---------- Projects (from the portfolio section) ----------
export const PROJECTS = [
  {
    id: "P-101",
    name: "Modern Villa",
    type: "Residential",
    kind: "Residential Design",
    image: modern,
    phase: "execution",
    progress: 68,
    budget: 420000,
    spent: 281000,
    area: "Wazir Akbar Khan, Kabul",
    lat: 34.5412,
    lng: 69.1927,
    manager: "Emma Rodriguez",
    due: "2027-02-14",
    services: ["Online scheduling", "Site open today"],
  },
  {
    id: "P-102",
    name: "Corporate Headquarters",
    type: "Commercial",
    kind: "Commercial Architecture",
    image: glass,
    phase: "design",
    progress: 41,
    budget: 1850000,
    spent: 612000,
    area: "Shahr-e-Naw, Kabul",
    lat: 34.5313,
    lng: 69.1665,
    manager: "Michael Chen",
    due: "2027-09-30",
    services: ["Online scheduling"],
  },
  {
    id: "P-103",
    name: "Luxury Penthouse",
    type: "Interior",
    kind: "Interior Design",
    image: penthouse,
    phase: "execution",
    progress: 82,
    budget: 260000,
    spent: 214000,
    area: "Taimani, Kabul",
    lat: 34.5242,
    lng: 69.1362,
    manager: "Sarah Johnson",
    due: "2026-12-05",
    services: ["Site open today", "Online scheduling"],
  },
  {
    id: "P-104",
    name: "Contemporary Home",
    type: "Residential",
    kind: "Residential Interior",
    image: sofa,
    phase: "concept",
    progress: 22,
    budget: 310000,
    spent: 38000,
    area: "Karte Parwan, Kabul",
    lat: 34.5239,
    lng: 69.1537,
    manager: "Emma Rodriguez",
    due: "2027-05-20",
    services: [],
  },
  {
    id: "P-105",
    name: "Boutique Hotel",
    type: "Hospitality",
    kind: "Hospitality Design",
    image: wind,
    phase: "design",
    progress: 47,
    budget: 960000,
    spent: 355000,
    area: "Khair Khana, Kabul",
    lat: 34.5791,
    lng: 69.1403,
    manager: "Michael Chen",
    due: "2027-07-11",
    services: ["Online scheduling", "Site open today"],
  },
  {
    id: "P-106",
    name: "Urban Complex",
    type: "Mixed-Use",
    kind: "Mixed-Use Architecture",
    image: oip,
    phase: "discovery",
    progress: 9,
    budget: 3200000,
    spent: 96000,
    area: "Macroryan, Kabul",
    lat: 34.5683,
    lng: 69.2318,
    manager: "Sarah Johnson",
    due: "2028-03-01",
    services: [],
  },
];

// ---------- People ----------
export const TEAM = [
  {
    id: 1,
    name: "Emma Rodriguez",
    role: "Creative Director",
    photo: emma,
    discipline: "Interior Design",
    rating: 4.9,
    jobs: 128,
    next: "Today, 2:30 PM",
    color: "gold",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Principal Architect",
    photo: michael,
    discipline: "Architecture Design",
    rating: 4.8,
    jobs: 96,
    next: "Tomorrow, 9:00 AM",
    color: "bronze",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Project Manager",
    photo: Sarah,
    discipline: "Project Management",
    rating: 4.9,
    jobs: 84,
    next: "Thu, 11:15 AM",
    color: "olive",
  },
  {
    id: 4,
    name: "Ahmad Karimi",
    role: "Structural Engineer",
    photo: Ahamd,
    discipline: "Structural Engineering",
    rating: 4.7,
    jobs: 112,
    next: "Today, 4:00 PM",
    color: "brick",
  },
  {
    id: 5,
    name: "Laila Noori",
    role: "3D Visualization Artist",
    photo: Safora,
    discipline: "3D Visualization",
    rating: 4.8,
    jobs: 73,
    next: "Fri, 10:00 AM",
    color: "gold",
  },
  {
    id: 6,
    name: "Bilal Ahmadi",
    role: "Site Supervisor",
    photo: Bilal,
    discipline: "Project Management",
    rating: 4.6,
    jobs: 101,
    next: "Today, 5:30 PM",
    color: "bronze",
  },
];

export const SPECIALTIES = [
  "Architecture Design",
  "Interior Design",
  "Space Planning",
  "Structural Engineering",
  "Project Management",
  "3D Visualization",
  "Design Consultation",
];

// ---------- Testimonials ----------
export const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    photo: Sarah,
    text: "Luxe Studio transformed our home into a masterpiece. Their attention to detail and ability to understand our vision was extraordinary.",
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    photo: michael,
    text: "The team's professionalism and creative expertise resulted in a space that exceeded all our expectations. Truly remarkable work.",
  },
  {
    name: "Emma Rodriguez",
    role: "Creative Director",
    photo: emma,
    text: "From concept to completion, Luxe Studio delivered an exceptional experience. Our new office space inspires creativity daily.",
  },
];

// ---------- Blog (Design Insights) ----------
export const INSIGHTS = [
  {
    image: wind,
    date: "March 15, 2025",
    tag: "Trends",
    title: "Top Design Trends for 2025",
    text: "Discover the emerging trends that are shaping the future of architecture and interior design this year.",
  },
  {
    image: modern,
    date: "March 8, 2025",
    tag: "Sustainability",
    title: "Sustainable Design Practices",
    text: "How we integrate eco-friendly materials and energy-efficient solutions into our design philosophy.",
  },
  {
    image: penthouse,
    date: "February 28, 2025",
    tag: "Tips",
    title: "Maximizing Small Spaces",
    text: "Creative strategies for making compact spaces feel larger and more functional without sacrificing style.",
  },
];

export const STUDIO_STATS = [
  { value: "200+", label: "Projects Completed" },
  { value: "15+", label: "Awards Won" },
  { value: "98%", label: "Client Satisfaction" },
];

// ---------- Marketplace: construction materials & interior finishes ----------
export const MATERIALS = [
  {
    id: 1,
    image: white,
    category: "Finishes",
    price: 48,
    supplier: "Kabul Stone & Tile",
    logo: urban,
    text: "Premium porcelain slabs in matte white, ready for floors and feature walls.",
  },
  {
    id: 2,
    image: glass,
    category: "Facade",
    price: 120,
    supplier: "Pamir Glass Works",
    logo: hotel,
    text: "Double-glazed low-E curtain wall panels with thermal break frames.",
  },
  {
    id: 3,
    image: wind,
    category: "Windows",
    price: 85,
    supplier: "Arg Aluminium",
    logo: modern,
    text: "Slim-profile aluminium windows with sound-insulating glazing.",
  },
  {
    id: 4,
    image: sofa,
    category: "Furniture",
    price: 640,
    supplier: "Studio Atelier",
    logo: penthouse,
    text: "Contemporary modular sofa with solid-wood frame and linen upholstery.",
  },
];

export const MATERIAL_ROWS = [
  {
    rowKey: 1,
    image: white,
    name: "Porcelain Slab 120×60",
    category: "Finishes",
    serviceLogo: urban,
    serviceName: "Kabul Stone & Tile",
    discount: 0,
    price: 48,
    id: "MT-243598",
  },
  {
    rowKey: 2,
    image: glass,
    name: "Low-E Glass Panel",
    category: "Facade",
    serviceLogo: hotel,
    serviceName: "Pamir Glass Works",
    discount: 5,
    price: 120,
    id: "MT-877712",
  },
  {
    rowKey: 3,
    image: wind,
    name: "Aluminium Window Set",
    category: "Windows",
    serviceLogo: modern,
    serviceName: "Arg Aluminium",
    discount: 9,
    price: 85,
    id: "MT-013472",
  },
  {
    rowKey: 4,
    image: sofa,
    name: "Modular Linen Sofa",
    category: "Furniture",
    serviceLogo: penthouse,
    serviceName: "Studio Atelier",
    discount: 5,
    price: 640,
    id: "MT-113213",
  },
  {
    rowKey: 5,
    image: modern,
    name: "Reinforced Concrete Mix C35",
    category: "Structure",
    serviceLogo: urban,
    serviceName: "Hindu Kush Concrete",
    discount: 7,
    price: 95,
    id: "MT-634729",
  },
  {
    rowKey: 6,
    image: penthouse,
    name: "Oak Engineered Flooring",
    category: "Finishes",
    serviceLogo: hotel,
    serviceName: "Studio Atelier",
    discount: 0,
    price: 56,
    id: "MT-634730",
  },
];

// ---------- Contractors & equipment (replaces "Find Pharmacy") ----------
export const CONTRACTOR_ITEMS = [
  {
    id: 1,
    image: urban,
    category: "General Contractor",
    price: 350,
    unit: "day",
    supplier: "Hindu Kush Builders",
    logo: modern,
    text: "Full-scope structural works, 40+ skilled crew members on call.",
  },
  {
    id: 2,
    image: modern,
    category: "Electrical & MEP",
    price: 220,
    unit: "day",
    supplier: "Noor MEP Services",
    logo: glass,
    text: "Certified electrical, plumbing and HVAC installation teams.",
  },
  {
    id: 3,
    image: hotel,
    category: "Crane & Equipment",
    price: 480,
    unit: "day",
    supplier: "Kabul Heavy Lift",
    logo: wind,
    text: "Tower and mobile crane rental with licensed operators.",
  },
  {
    id: 4,
    image: penthouse,
    category: "Interior Fit-out",
    price: 190,
    unit: "day",
    supplier: "Atelier Fit-out Co.",
    logo: sofa,
    text: "Joinery, ceilings, paint and finishing crews for premium interiors.",
  },
];

export const CONTRACTOR_ROWS = [
  {
    rowKey: 1,
    image: urban,
    name: "Structural Works Crew",
    category: "Contractor",
    serviceLogo: modern,
    serviceName: "Hindu Kush Builders",
    discount: 3,
    price: 350,
    id: "CT-8234",
  },
  {
    rowKey: 2,
    image: modern,
    name: "MEP Installation Team",
    category: "Contractor",
    serviceLogo: glass,
    serviceName: "Noor MEP Services",
    discount: 0,
    price: 220,
    id: "CT-0872",
  },
  {
    rowKey: 3,
    image: hotel,
    name: "Mobile Crane 50t",
    category: "Equipment",
    serviceLogo: wind,
    serviceName: "Kabul Heavy Lift",
    discount: 5,
    price: 480,
    id: "CT-0134",
  },
  {
    rowKey: 4,
    image: penthouse,
    name: "Interior Fit-out Crew",
    category: "Contractor",
    serviceLogo: sofa,
    serviceName: "Atelier Fit-out Co.",
    discount: 5,
    price: 190,
    id: "CT-1130",
  },
  {
    rowKey: 5,
    image: oip,
    name: "Scaffolding (per 100 m²)",
    category: "Equipment",
    serviceLogo: urban,
    serviceName: "Hindu Kush Builders",
    discount: 7,
    price: 140,
    id: "CT-6290",
  },
  {
    rowKey: 6,
    image: white,
    name: "Painting & Plaster Crew",
    category: "Contractor",
    serviceLogo: sofa,
    serviceName: "Atelier Fit-out Co.",
    discount: 0,
    price: 120,
    id: "CT-6347",
  },
];

export const money = (n) => "$" + Number(n).toLocaleString("en-US");
