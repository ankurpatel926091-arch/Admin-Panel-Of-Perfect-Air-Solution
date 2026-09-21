import splitAcImg from "@/assets/split-ac.png";
import repairImg from "@/assets/about_ac_showcase.jpg";
import amcImg from "@/assets/commercial.jpg";
import vrfImg from "@/assets/vrv-vrf.png";
import ductableImg from "@/assets/categories/ductable.jpg";
import ahuImg from "@/assets/categories/air-handling-unit.png";
import chillerImg from "@/assets/categories/chiller.jpg";
import copperImg from "@/assets/categories/ventilation.jpg";

import coldRoomImg from "@/assets/categories/cold-room.png";
import cassetteImg from "@/assets/cassette-ac.png";
import indoorImg from "@/assets/why_choose_indoor.jpg";
import cleanCassetteImg from "@/assets/categories/cassette-ac.png";
import cleanVrfImg from "@/assets/categories/vrf.png";

export interface ServiceData {
  _id: string;
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  desc: string;
  longDesc: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  icon: string;
  image: string;
  highlights: string[];
  process: { step: string; title: string; desc: string }[];
}

export interface ProjectData {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  location: string;
  completionDate?: string;
  completionYear?: string;
  featuredImage: string;
  image?: string;
  images: string[];
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  systemType?: string;
  units?: string;
  metrics?: { label: string; value: string }[];
}

export interface BlogData {
  _id: string;
  slug: string;
  title: string;
  category: string;
  excerpt?: string;
  content: string[];
  image: string;
  readTime: string;
  date: string;
  author: string;
  tags?: string[];
}

export interface BrandData {
  _id: string;
  slug: string;
  brandName: string;
  name: string;
  heroImage: string;
  image: string;
  tagline: string;
  overview: string;
  rating: number;
  reviewsCount: number;
  badgeText: string;
  features: { title: string; desc: string; icon: string }[];
  products: { name: string; type: string; price: string; spec: string; image: string }[];
}

export const staticServices: ServiceData[] = [
  {
    _id: "srv-1",
    slug: "ac-installation",
    title: "AC Installation",
    badge: "Residential & Commercial",
    tagline: "Precision Split, Cassette & Central AC Fitting",
    desc: "Certified installation for Split, Cassette, Ductable, and VRF systems with vacuum leak testing and precision copper piping.",
    longDesc: "Our factory-trained technicians deliver flawless air conditioning installation using pure copper piping, nitrogen pressure testing, and precision CFM airflow balancing to maximize cooling efficiency and unit lifespan.",
    price: "Starting ₹1,499",
    duration: "2 - 4 Hours",
    rating: 4.9,
    reviews: 480,
    icon: "Wrench",
    image: splitAcImg,
    highlights: ["OEM Certified Copper Piping", "Nitrogen Pressure Leak Testing", "Airflow CFM Balancing", "Vacuum Evacuation & Leak Check"],
    process: [
      { step: "01", title: "Site Inspection & Sizing", desc: "Heat load calculation and optimal placement evaluation." },
      { step: "02", title: "Precision Piping & Mounting", desc: "Hard copper piping with zero-condensation insulation." },
      { step: "03", title: "Vacuum & Pressure Check", desc: "Nitrogen pressure holding check and deep vacuum evacuation." },
      { step: "04", title: "Commissioning & Testing", desc: "CFM airflow measurement and cooling performance audit." },
    ],
  },
  {
    _id: "srv-2",
    slug: "ac-repair-maintenance",
    title: "AC Repair & Maintenance",
    badge: "24/7 Emergency Support",
    tagline: "Deep Foam Jet Wash & Eco Refrigerant Top-Up",
    desc: "Complete servicing, high-pressure jet washing, eco-friendly gas top-up (R32/R410A), and compressor troubleshooting.",
    longDesc: "Restore factory-cooling performance with high-pressure deep foam jet cleaning, indoor coil sanitization, PCB electrical diagnosis, and precision refrigerant charging.",
    price: "Starting ₹499",
    duration: "1 - 2 Hours",
    rating: 4.95,
    reviews: 620,
    icon: "Activity",
    image: repairImg,
    highlights: ["Chemical Jet Washing", "Gas Leakage Detection", "Electrical & PCB Diagnostics", "Anti-Fungal Coil Treatment"],
    process: [
      { step: "01", title: "Diagnostic Inspection", desc: "Complete electrical, pressure, and temperature differential check." },
      { step: "02", title: "High-Pressure Jet Wash", desc: "Deep cleaning of evaporator and condenser coils with jacket protection." },
      { step: "03", title: "Gas Top-Up & Leak Repair", desc: "Electronic leak detection and pure R32/R410A gas refilling." },
      { step: "04", title: "Final Temperature Audit", desc: "Verifying grill temperature drop and noise levels." },
    ],
  },
  {
    _id: "srv-3",
    slug: "amc-services",
    title: "AMC Services",
    badge: "Zero Downtime Guarantee",
    tagline: "Comprehensive Annual Maintenance Contracts",
    desc: "Comprehensive & Non-Comprehensive annual contracts ensuring regular preventive maintenance and breakdown response.",
    longDesc: "Protect your commercial and residential cooling investment with priority breakdown response, quarterly routine maintenance audits, and 100% genuine spare part coverage.",
    price: "Custom Plan",
    duration: "1 Year Contract",
    rating: 5.0,
    reviews: 310,
    icon: "ShieldCheck",
    image: amcImg,
    highlights: ["Scheduled Servicing Audits", "< 2 Hour Emergency Response", "100% Genuine Spare Parts", "Free Spare Parts & Gas Refill (Comprehensive)"],
    process: [
      { step: "01", title: "Equipment Audit", desc: "Condition rating and baseline performance logging." },
      { step: "02", title: "Scheduled Quarterly Service", desc: "Quarterly preventative deep cleaning and electrical checkups." },
      { step: "03", title: "Priority Breakdown Support", desc: "Dedicated team dispatched within 2 hours of complaint." },
      { step: "04", title: "Annual Performance Report", desc: "Energy consumption and component health diagnostic report." },
    ],
  },
  {
    _id: "srv-4",
    slug: "hvac-design-consultation",
    title: "HVAC Design & Consultation",
    badge: "Engineering Precision",
    tagline: "Custom Heat Load Calculation & Duct Layout Design",
    desc: "Thermal heat load calculation, duct layout design, air balancing, and energy audit for residential & commercial facilities.",
    longDesc: "Turnkey HVAC engineering consultation including 3D duct layout design, static pressure drop optimization, acoustic lining, copper piping routing, and energy efficiency audits for multi-storey buildings.",
    price: "Custom Quote",
    duration: "Project Based",
    rating: 4.95,
    reviews: 190,
    icon: "Settings2",
    image: copperImg,
    highlights: ["3D CAD Duct Layout Design", "Heat Load BTU Sizing", "CFM Air Velocity Balancing", "BMS Integration Planning"],
    process: [
      { step: "01", title: "Architectural CAD Survey", desc: "Building orientation and thermal envelope evaluation." },
      { step: "02", title: "BTU Heat Load Calculation", desc: "Solar heat gain and occupant capacity calculations." },
      { step: "03", title: "Duct & Equipment Sizing", desc: "Static pressure drop and fan CFM specification." },
      { step: "04", title: "Consultation Report", desc: "Detailed technical BOQ and execution roadmap." },
    ],
  },
  {
    _id: "srv-5",
    slug: "commercial-hvac-solutions",
    title: "Commercial HVAC Solutions",
    badge: "Towers & Malls",
    tagline: "Turnkey VRF/VRV Central Cooling & Chiller Plants",
    desc: "Turnkey VRF/VRV central cooling, chiller plants, Air Handling Units (AHUs), and ventilation systems for towers & malls.",
    longDesc: "Engineered commercial climate control solutions for high-rise corporate offices, hospitals, shopping malls, and industrial plants with Daikin & Blue Star certified multi-zone VRF systems.",
    price: "Project Based",
    duration: "Custom Timeline",
    rating: 4.98,
    reviews: 245,
    icon: "Building2",
    image: vrfImg,
    highlights: ["Multi-Zone VRF / VRV Systems", "Up to 40% Power Savings", "High-Tonnage Chiller Plants", "Centralized BMS Automation"],
    process: [
      { step: "01", title: "Commercial Heat Audit", desc: "Floors heat load and occupancy zone mapping." },
      { step: "02", title: "Multi-Module Piping CAD", desc: "Refnet joint selection and nitrogen purged brazing." },
      { step: "03", title: "Commissioning & BMS", desc: "Central touch controller and smart meter setup." },
    ],
  },
  {
    _id: "srv-6",
    slug: "preventive-maintenance",
    title: "Preventive Maintenance",
    badge: "Preventive Care",
    tagline: "Scheduled Chemical Jet Wash & Coil Descaling",
    desc: "Scheduled chemical jet washing, filter replacement, electrical checks, and coil descaling to extend HVAC lifespan.",
    longDesc: "Prevent costly compressor breakdowns and high power bills with proactive quarterly preventive maintenance, evaporator coil sanitization, electrical contactor checks, and eco-refrigerant level audits.",
    price: "Starting ₹699",
    duration: "2 Hours",
    rating: 4.92,
    reviews: 380,
    icon: "Wind",
    image: ahuImg,
    highlights: ["High-Pressure Chemical Jet Wash", "Coil Descaling & Rust Protection", "Compressor Health Audit", "Electrical Amperage Testing"],
    process: [
      { step: "01", title: "Visual & Electrical Inspection", desc: "Capacitor, contactor, and wire tightness check." },
      { step: "02", title: "Deep Chemical Coil Cleaning", desc: "High-pressure jet wash with protective jacket cover." },
      { step: "03", title: "Pressure & Gas Audit", desc: "Checking suction/discharge pressure and temperature drop." },
      { step: "04", title: "Preventive Health Report", desc: "Logged maintenance checklist for unit performance history." },
    ],
  },
  {
    _id: "srv-7",
    slug: "ductable-cassette-ac",
    title: "Ductable & Cassette AC Solutions",
    badge: "Flush Ceiling Fit",
    tagline: "Uniform 360° Air Diffusion Systems",
    desc: "Heavy-duty ductable and 4-way ceiling cassette AC setups engineered for uniform 360-degree air distribution.",
    longDesc: "Architectural cooling solutions with ductable hidden units and flush ceiling 4-way cassette ACs designed for luxury spaces, restaurants, showrooms, and open offices.",
    price: "Custom Quote",
    duration: "Project Based",
    rating: 4.9,
    reviews: 210,
    icon: "Wind",
    image: ductableImg,
    highlights: ["360° Air Diffusion Vents", "Low-Noise Operation", "Sleek Flush Ceiling Design", "Drain Pump Lift In-Built"],
    process: [
      { step: "01", title: "False Ceiling Survey", desc: "Ceiling height and plenum space measurement." },
      { step: "02", title: "Hanger & Duct Placement", desc: "Vibration isolators and flexible duct connections." },
      { step: "03", title: "Diffuser & Grill Balancing", desc: "Air velocity balancing across all diffusers." },
    ],
  },
  {
    _id: "srv-8",
    slug: "chiller-ahu-services",
    title: "Chiller Plants & AHU Systems",
    badge: "Commercial Central Plant",
    tagline: "Industrial Heavy Cooling & Cleanroom Ventilation",
    desc: "Water-cooled & Air-cooled Chiller servicing, Air Handling Unit (AHU) installation, HEPA filtration, and cleanroom setup.",
    longDesc: "Heavy industrial cooling, chilled water piping, AHU coil maintenance, HEPA filter validation, and hospital modular OT air treatment systems.",
    price: "Custom Estimate",
    duration: "Project Based",
    rating: 4.95,
    reviews: 98,
    icon: "Settings2",
    image: chillerImg,
    highlights: ["Air & Water-Cooled Chillers", "Cleanroom HEPA Filtration", "Thermal Energy Audits", "Descaling & Chilled Water Balancing"],
    process: [
      { step: "01", title: "Hydronic & Water Audit", desc: "Flow rate, pressure drop, and glycol concentration check." },
      { step: "02", title: "Condenser Tube Descaling", desc: "Chemical descaling and tube cleaning." },
      { step: "03", title: "Filter & Blower Calibration", desc: "Static pressure check and HEPA filter integrity validation." },
    ],
  },
  {
    _id: "srv-9",
    slug: "cleanroom-industrial-ventilation",
    title: "Cleanroom & Industrial Ventilation",
    badge: "HEPA & Cleanroom Air",
    tagline: "Sterile Air Treatment & Positive Pressure Ventilation",
    desc: "Turnkey cleanroom positive pressure ventilation, HEPA filtration, exhaust ducting, and industrial air treatment.",
    longDesc: "Turnkey cleanroom ventilation for pharmaceutical plants, electronics manufacturing, and hospital surgical suites with HEPA air purification and positive pressure control.",
    price: "Custom Quote",
    duration: "Project Based",
    rating: 4.96,
    reviews: 142,
    icon: "MapPin",
    image: coldRoomImg,
    highlights: ["HEPA Cleanroom Filtration", "Positive Pressure Airflow", "Industrial Exhaust Ducting", "NABH Compliance Audits"],
    process: [
      { step: "01", title: "Cleanroom Class Survey", desc: "ISO cleanroom classification and particle count measurement." },
      { step: "02", title: "HEPA AHU Duct Layout", desc: "Sealed ductwork with HEPA filter modules." },
      { step: "03", title: "Pressure & Particle Validation", desc: "Differential pressure balancing and zero-leakage certification." },
    ],
  },
];

export const staticProjects: ProjectData[] = [
  {
    _id: "proj-1",
    slug: "apollo-medical-hospital-vrf-ot",
    title: "Apollo Medical Hospital VRF & Modular OT Cleanroom",
    category: "Hospital & Industrial",
    completionDate: "2024",
    completionYear: "2024",
    location: "Lucknow, UP",
    client: "Apollo Healthcare Group",
    systemType: "Daikin VRF System + HEPA AHU Units",
    units: "250 HP Capacity (45 Outdoor Units)",
    featuredImage: repairImg,
    image: repairImg,
    images: [repairImg, ahuImg, vrfImg],
    description: "The multi-storey medical hospital required 24/7 continuous temperature and humidity control across sterile surgical operating suites, intensive care units, and diagnostic laboratories with zero tolerance for downtime or contamination.",
    challenge: "The multi-storey medical hospital required 24/7 continuous temperature and humidity control across sterile surgical operating suites, intensive care units, and diagnostic laboratories with zero tolerance for downtime or contamination.",
    solution: "Engineered an inverted multi-module VRF climate control system coupled with specialized Air Handling Units (AHUs) fitted with HEPA filtration to maintain positive air pressure and sub-micron purity.",
    results: [
      "100% Sterile positive-pressure airflow maintained across surgical suites",
      "32% Reduction in seasonal electrical energy consumption",
      "Zero operational downtime achieved during system commissioning",
    ],
    metrics: [
      { label: "Capacity", value: "250 HP" },
      { label: "Energy Saved", value: "32%" },
    ],
  },
  {
    _id: "proj-2",
    slug: "grand-palace-hotel-chiller-plant",
    title: "Grand Palace Hotel & Convention Center Central Chiller Plant",
    category: "Commercial HVAC",
    completionDate: "2023",
    completionYear: "2023",
    location: "Kanpur, UP",
    client: "Grand Palace Hospitality",
    systemType: "Water-Cooled Screw Chiller & FCU Network",
    units: "400 Tonnage Plant",
    featuredImage: amcImg,
    image: amcImg,
    images: [amcImg, chillerImg],
    description: "The 5-star hotel required ultra-quiet, high-capacity cooling across 180 guest rooms, 3 grand banquet halls, and fine dining restaurants with flexible zone control during peak events.",
    challenge: "The 5-star hotel required ultra-quiet, high-capacity cooling across 180 guest rooms, 3 grand banquet halls, and fine dining restaurants with flexible zone control during peak events.",
    solution: "Installed dual high-efficiency Water-Cooled Screw Chillers connected to an automated Building Management System (BMS) for intelligent variable load balancing.",
    results: [
      "Ultra-silent indoor room acoustics (<32 dB noise rating)",
      "Automated energy optimization during low-occupancy hours",
      "Project delivered and commissioned 15 days ahead of schedule",
    ],
    metrics: [
      { label: "Tonnage", value: "400 TR" },
      { label: "Noise Rating", value: "< 32 dB" },
    ],
  },
  {
    _id: "proj-3",
    slug: "apex-agro-cold-storage-park",
    title: "Apex Agro Fresh Cold Storage & Preservation Park",
    category: "Chiller & Cold Storage",
    completionDate: "2024",
    completionYear: "2024",
    location: "Unnao Industrial Zone",
    client: "Apex Agro Logistics",
    systemType: "Industrial Refrigeration & Modular Cold Rooms",
    units: "1,500 MT Capacity",
    featuredImage: coldRoomImg,
    image: coldRoomImg,
    images: [coldRoomImg, chillerImg],
    description: "Required precise temperature regulation between -25°C to +4°C with dual-chamber insulation for perishable agricultural export storage.",
    challenge: "Required precise temperature regulation between -25°C to +4°C with dual-chamber insulation for perishable agricultural export storage.",
    solution: "Designed heavy-duty industrial condensing units with 150mm polyurethane insulated sandwich panels and automated backup generator failover loops.",
    results: [
      "Precision temperature stability within ±0.5°C tolerance",
      "Rapid pull-down chilling performance during fresh stock intake",
      "Integrated 24/7 IoT remote telemetry and emergency alarm alerts",
    ],
    metrics: [
      { label: "Capacity", value: "1,500 MT" },
      { label: "Temp Tolerance", value: "±0.5°C" },
    ],
  },
  {
    _id: "proj-4",
    slug: "horizon-tech-park-vrv",
    title: "Horizon Tech Park Tower-B Commercial VRV Air Conditioning",
    category: "VRF Systems",
    completionDate: "2023",
    completionYear: "2023",
    location: "Noida, NCR",
    client: "Horizon Realtech Developers",
    systemType: "Heat Recovery VRV + Ceiling Cassettes",
    units: "600 HP (12 Floors)",
    featuredImage: vrfImg,
    image: vrfImg,
    images: [vrfImg, ductableImg],
    description: "A 12-storey commercial IT park required independent tenant power usage billing, simultaneous heating/cooling capability, and low-profile ceiling aesthetic diffusers.",
    challenge: "A 12-storey commercial IT park required independent tenant power usage billing, simultaneous heating/cooling capability, and low-profile ceiling aesthetic diffusers.",
    solution: "Deployed variable refrigerant flow technology with heat recovery units and centralized touch-screen monitoring connected to individual tenant smart meters.",
    results: [
      "Precise individual tenant power metering and billing integration",
      "40% Lower operational energy costs compared to central plant designs",
      "Committed 5-Year Comprehensive AMC Service Agreement",
    ],
    metrics: [
      { label: "Capacity", value: "600 HP" },
      { label: "Floors", value: "12 Floors" },
    ],
  },
  {
    _id: "proj-5",
    slug: "premier-textile-ducting-ventilation",
    title: "Premier Textile Manufacturing Facility Ducting & Ventilation",
    category: "Hospital & Industrial",
    completionDate: "2023",
    completionYear: "2023",
    location: "Hardoi Industrial Area",
    client: "Premier Textiles Ltd",
    systemType: "Heavy-Duty Air Handling Units & Evaporative Ducting",
    units: "80,000 CFM Airflow",
    featuredImage: ahuImg,
    image: ahuImg,
    images: [ahuImg, copperImg],
    description: "High heat generation from industrial weaving looms and airborne fiber dust compromised worker safety and factory air quality.",
    challenge: "High heat generation from industrial weaving looms and airborne fiber dust compromised worker safety and factory air quality.",
    solution: "Engineered positive-pressure evaporative cooling units paired with high-volume centrifugal exhaust fans and galvanized spiral duct distribution.",
    results: [
      "12°C Ambient temperature reduction across the manufacturing floor",
      "99.2% Airborne fiber dust filtration efficiency",
      "Full compliance with industrial safety and air purity norms",
    ],
    metrics: [
      { label: "Airflow", value: "80,000 CFM" },
      { label: "Filtration", value: "99.2%" },
    ],
  },
  {
    _id: "proj-6",
    slug: "civil-lines-executive-villa-ductable",
    title: "Civil Lines Executive Villa Architectural Ductable Climate System",
    category: "VRF Systems",
    completionDate: "2024",
    completionYear: "2024",
    location: "Hardoi, UP",
    client: "Private Luxury Residence",
    systemType: "Slim Concealed Ductable ACs & Cassettes",
    units: "35 Tonnage",
    featuredImage: ductableImg,
    image: ductableImg,
    images: [ductableImg, splitAcImg],
    description: "The client requested completely hidden air conditioning with architectural linear slot diffusers that blended seamlessly into luxury interior ceiling woodwork.",
    challenge: "The client requested completely hidden air conditioning with architectural linear slot diffusers that blended seamlessly into luxury interior ceiling woodwork.",
    solution: "Installed ultra-slim ceiling concealed ductable split units with custom continuous slot diffusers and silent inverter compressor technology.",
    results: [
      "Seamless architectural ceiling integration with zero exposed units",
      "Independent room-by-room Wi-Fi smart mobile app controls",
      "100% Client satisfaction rating and ongoing maintenance",
    ],
    metrics: [
      { label: "Capacity", value: "35 TR" },
      { label: "Controls", value: "Smart Wi-Fi" },
    ],
  },
];

export const staticBlogs: BlogData[] = [
  {
    _id: "blog-1",
    slug: "how-vrf-systems-save-40-percent-energy",
    title: "How VRF Systems Save Up to 40% Energy in Commercial Buildings",
    category: "Technology",
    excerpt: "Discover how Variable Refrigerant Flow (VRF) technology delivers multi-zone temperature control and cuts seasonal power consumption in high-rise corporate towers and commercial projects.",
    readTime: "5 min read",
    date: "Sep 12, 2024",
    author: "Eng. Alok Sharma",
    image: vrfImg,
    tags: ["VRF / VRV", "Energy Efficiency", "Commercial HVAC", "BMS Automation"],
    content: [
      "Variable Refrigerant Flow (VRF) and Variable Refrigerant Volume (VRV) systems have revolutionized modern commercial climate control across IT parks, shopping complexes, and healthcare facilities.",
      "Unlike traditional central chiller plants that operate at fixed speeds regardless of occupancy, VRF inverter compressors dynamically match the exact thermal heat load of individual zones.",
      "By utilizing heat recovery units, excess heat extracted from cooling zones (such as server rooms) can be redistributed to zones requiring heating, driving energy savings up to 40%.",
      "Perfect Air Solution specializes in Daikin, Mitsubishi, and Blue Star VRF system design, nitrogen-purged copper piping execution, and automated Building Management System (BMS) integration."
    ],
  },
  {
    _id: "blog-2",
    slug: "5-signs-your-ac-needs-gas-refill",
    title: "5 Clear Signs Your AC Needs Gas Refilling & Servicing",
    category: "Maintenance Tips",
    excerpt: "Is your air conditioner blowing warm air or forming ice on the coils? Learn the 5 warning signs of refrigerant gas leakage and how timely servicing saves your compressor.",
    readTime: "4 min read",
    date: "Aug 28, 2026",
    author: "Rajesh Kumar",
    image: repairImg,
    tags: ["Gas Refill", "AC Servicing", "Compressor Health", "Preventive Care"],
    content: [
      "Air conditioners operate on a closed-loop refrigerant system. Under normal conditions, refrigerant gas (R-32, R-410A, or R-22) does not get consumed over time unless there is a pinhole leak in copper joints or coils.",
      "Sign 1: Ice formation on the outdoor brass valves or indoor evaporator cooling coil.",
      "Sign 2: Warm or lukewarm airflow coming from the indoor unit even when set to 16°C in Cool mode.",
      "Sign 3: Hissing or bubbling noises near flare nuts or brazed copper joints indicating active gas escape.",
      "Sign 4: Unusually high monthly electricity bills caused by the compressor running continuously without reaching set temperatures.",
      "Sign 5: Foul odor or high humidity retention inside the room due to improper evaporation pressure.",
      "At Perfect Air Solution, our certified technicians perform high-pressure nitrogen leak detection, flare repair, deep vacuuming down to 500 microns, and precise R-32/R-410A weight-scale gas charging."
    ],
  },
  {
    _id: "blog-3",
    slug: "why-annual-maintenance-contract-amc-is-essential",
    title: "Why an Annual Maintenance Contract (AMC) Saves You Thousands",
    category: "Guide",
    excerpt: "Prevent costly breakdown emergencies during peak summer. Explore how scheduled quarterly AMC preventive maintenance extends HVAC life and reduces power bills.",
    readTime: "6 min read",
    date: "Jul 15, 2024",
    author: "Service Team",
    image: amcImg,
    tags: ["AMC Plans", "Cost Savings", "Preventive Care", "Maintenance"],
    content: [
      "Emergency HVAC breakdowns during peak summer heat can paralyze business operations and cost thousands in urgent compressor replacements.",
      "An Annual Maintenance Contract (AMC) from Perfect Air Solution guarantees quarterly high-pressure chemical jet washing, electrical contactor audits, coil rust protection coating, and free labor for emergency call-outs.",
      "Regular chemical jet washing removes stubborn dust layers from condenser coils, reducing compressor heat stress and saving up to 25% on annual electricity consumption.",
      "Whether for residential multi-splits or commercial VRF plants, AMC plans provide peace of mind with guaranteed 2-hour response times and OEM spare parts warranty."
    ],
  },
  {
    _id: "blog-4",
    slug: "commercial-hvac-heat-load-calculations",
    title: "Importance of Precise Heat Load Calculation for Commercial HVAC Projects",
    category: "Engineering",
    excerpt: "Why oversized or undersized HVAC systems lead to high power bills and poor cooling performance. Understanding thermal heat load calculations.",
    readTime: "5 min read",
    date: "Jun 20, 2024",
    author: "Er. V. K. Singh",
    image: copperImg,
    tags: ["Heat Load Sizing", "Engineering", "HVAC Design", "BTU Calculation"],
    content: [
      "Selecting HVAC equipment based on raw square footage alone is a critical mistake in commercial project execution.",
      "Accurate heat load calculation considers solar heat gain through glass facades, equipment heat dissipation, occupant density, fresh air ventilation CFM rates, and roof insulation values.",
      "Undersized systems run 100% continuously without achieving set temperatures, leading to premature motor failure. Oversized units cycle rapidly, causing humidity spikes and wasted power.",
      "Perfect Air Solution uses advanced CAD and heat load simulation software to size VRF modules, ductable split units, and chiller plants with exact BTU/hr precision."
    ],
  },
  {
    _id: "blog-5",
    slug: "cleanroom-ventilation-modular-ot-hvac",
    title: "Designing Cleanroom Ventilation & HEPA Air Filtration for Hospital OTs",
    category: "Healthcare HVAC",
    excerpt: "How positive pressure airflow and HEPA AHU systems maintain sterile contamination-free environments in modern modular operating theaters.",
    readTime: "7 min read",
    date: "May 10, 2024",
    author: "Healthcare Project Team",
    image: ahuImg,
    tags: ["Cleanroom HVAC", "HEPA Filtration", "Modular OT", "Hospital Ventilation"],
    content: [
      "Surgical suites and pharmaceutical cleanrooms require specialized HVAC systems that go far beyond standard comfort cooling.",
      "Maintaining positive air pressure relative to surrounding corridors prevents airborne bacteria and contaminants from entering sterile surgical zones.",
      "Air Handling Units (AHUs) integrated with 99.97% HEPA filters (0.3-micron filtration) ensure continuous sterile air changes per hour (ACH) complying with NABH and ISO cleanroom standards.",
      "Perfect Air Solution has successfully designed and executed turnkey modular OT air treatment systems for leading hospitals across Uttar Pradesh."
    ],
  },
];

export const staticBrands: BrandData[] = [
  {
    _id: "brand-daikin",
    slug: "daikin",
    brandName: "Daikin",
    name: "Daikin Air Conditioners",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><polygon points="15,45 40,15 40,45" fill="%23009FE3"/><text x="50" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="%23009FE3" letter-spacing="1">DAIKIN</text></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><polygon points="15,45 40,15 40,45" fill="%23009FE3"/><text x="50" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="%23009FE3" letter-spacing="1">DAIKIN</text></svg>`,
    tagline: "Japanese Precision & Inverter VRV Technology",
    overview: "Daikin is a global leader in air conditioning solutions, famous for pioneering VRV central cooling technology, patented R-32 refrigerant, and 5-Star energy efficiency.",
    rating: 4.9,
    reviewsCount: 1250,
    badgeText: "Authorized Partner",
    features: [
      { title: "Streamer Discharge Air Purification", desc: "Eliminates 99.9% of bacteria and airborne allergens.", icon: "star" },
      { title: "Neo Swing Inverter Compressor", desc: "Ultra-quiet friction reduction technology for high power savings.", icon: "trophy" },
      { title: "Coanda Airflow Design", desc: "Draft-free uniform temperature distribution across the room.", icon: "rupee" },
    ],
    products: [
      { name: "Daikin FTXM 1.5 Ton 5 Star Inverter Split AC", type: "Split AC", price: "₹45,900", spec: "5-Star ISEER, R-32, Titanium Apatite Filter", image: splitAcImg },
      { name: "Daikin 4-Way Ceiling Cassette AC 3.0 Ton", type: "Cassette AC", price: "₹89,000", spec: "360° Air Diffusion, Quiet Motor", image: ductableImg },
    ],
  },
  {
    _id: "brand-blue-star",
    slug: "blue-star",
    brandName: "Blue Star",
    name: "Blue Star Experts",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60"><polygon points="25,12 30,25 43,25 32,33 36,46 25,37 14,46 18,33 7,25 20,25" fill="%23004B93"/><text x="52" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%23004B93" letter-spacing="1">BLUE STAR</text></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60"><polygon points="25,12 30,25 43,25 32,33 36,46 25,37 14,46 18,33 7,25 20,25" fill="%23004B93"/><text x="52" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%23004B93" letter-spacing="1">BLUE STAR</text></svg>`,
    tagline: "India's Leading Commercial Cooling Specialist",
    overview: "Blue Star has over 80 years of cooling expertise in commercial HVAC, chillers, ductable ACs, cold rooms, and heavy duty residential split units.",
    rating: 4.85,
    reviewsCount: 980,
    badgeText: "Authorized Dealer & Service",
    features: [
      { title: "Precision Cooling Technology", desc: "Maintains temperature setting within 0.1°C precision.", icon: "star" },
      { title: "100% Copper Condenser & Evaporator", desc: "Corrosion-resistant anti-corrosive blue fins.", icon: "trophy" },
    ],
    products: [
      { name: "Blue Star 1.5 Ton 5-Star Heavy Duty Split AC", type: "Split AC", price: "₹42,500", spec: "53°C Extreme Cooling, 100% Copper", image: splitAcImg },
    ],
  },
  {
    _id: "brand-carrier",
    slug: "carrier",
    brandName: "Carrier",
    name: "Carrier Air Conditioning",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><ellipse cx="100" cy="30" rx="90" ry="24" fill="none" stroke="%23003366" stroke-width="4"/><text x="100" y="38" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="26" fill="%23003366" text-anchor="middle">Carrier</text></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><ellipse cx="100" cy="30" rx="90" ry="24" fill="none" stroke="%23003366" stroke-width="4"/><text x="100" y="38" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="26" fill="%23003366" text-anchor="middle">Carrier</text></svg>`,
    tagline: "Inventors of Modern Air Conditioning",
    overview: "Willis Carrier invented modern air conditioning in 1902. Today, Carrier remains a world authority in high-performance residential and commercial climate systems.",
    rating: 4.88,
    reviewsCount: 820,
    badgeText: "Official Sales & AMC Partner",
    features: [
      { title: "Flexicool 6-in-1 Convertible", desc: "Adjust cooling capacity from 40% to 110% power.", icon: "star" },
      { title: "PM 2.5 Air Filter", desc: "Protects indoor air against dust and pollutants.", icon: "trophy" },
    ],
    products: [
      { name: "Carrier Induct 1.5 Ton 5-Star Inverter AC", type: "Split AC", price: "₹43,900", spec: "6-in-1 Convertible, Hydro Blue Fin", image: splitAcImg },
    ],
  },
  {
    _id: "brand-hitachi",
    slug: "hitachi",
    brandName: "Hitachi",
    name: "Hitachi Air Conditioning",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="%23CC0000" text-anchor="middle" letter-spacing="2">HITACHI</text><line x1="20" y1="48" x2="180" y2="48" stroke="%23CC0000" stroke-width="3"/></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="%23CC0000" text-anchor="middle" letter-spacing="2">HITACHI</text><line x1="20" y1="48" x2="180" y2="48" stroke="%23CC0000" stroke-width="3"/></svg>`,
    tagline: "Japanese Innovation & FrostWash Cleaning",
    overview: "Hitachi air conditioners combine advanced Japanese engineering with FrostWash self-cleaning technology for healthy, bacteria-free indoor cooling.",
    rating: 4.9,
    reviewsCount: 750,
    badgeText: "Authorized Partner",
    features: [
      { title: "FrostWash Technology", desc: "Freezes coils to capture dust and melts it clean automatically.", icon: "star" },
    ],
    products: [
      { name: "Hitachi Yoshi 1.5 Ton 5-Star Inverter AC", type: "Split AC", price: "₹46,500", spec: "FrostWash, Odour Free Air", image: splitAcImg },
    ],
  },
  {
    _id: "brand-mitsubishi",
    slug: "mitsubishi",
    brandName: "Mitsubishi Heavy",
    name: "Mitsubishi Heavy Industries",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60"><polygon points="25,15 37,35 13,35" fill="%23E60012"/><polygon points="37,35 49,55 25,55" fill="%23E60012"/><polygon points="13,35 25,55 1,55" fill="%23E60012"/><text x="56" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="%23111" letter-spacing="1">MITSUBISHI</text></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60"><polygon points="25,15 37,35 13,35" fill="%23E60012"/><polygon points="37,35 49,55 25,55" fill="%23E60012"/><polygon points="13,35 25,55 1,55" fill="%23E60012"/><text x="56" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="%23111" letter-spacing="1">MITSUBISHI</text></svg>`,
    tagline: "Heavy Duty Tropical Air Conditioners",
    overview: "Mitsubishi Heavy Industries designs ultra-reliable HVAC systems, hyper-inverter split ACs, and VRF plants built to perform in extreme 55°C heat.",
    rating: 4.95,
    reviewsCount: 1100,
    badgeText: "Heavy Duty Certified Dealer",
    features: [
      { title: "Jet Air Flow Technology", desc: "Long air throw reaching up to 18 meters distance.", icon: "star" },
      { title: "Hyper Inverter Efficiency", desc: "Rapid cooling reaching desired temperatures in minutes.", icon: "trophy" },
    ],
    products: [
      { name: "Mitsubishi Heavy 2.0 Ton 5-Star Hyper Inverter AC", type: "Split AC", price: "₹64,900", spec: "18m Air Throw, 3D Auto Airflow", image: splitAcImg },
    ],
  },
  {
    _id: "brand-voltas",
    slug: "voltas",
    brandName: "Voltas",
    name: "Voltas Tata Company",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="%23008080" text-anchor="middle" letter-spacing="3">VOLTAS</text></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><text x="100" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="%23008080" text-anchor="middle" letter-spacing="3">VOLTAS</text></svg>`,
    tagline: "India's No. 1 Air Conditioning Brand by TATA",
    overview: "Voltas, a TATA Enterprise, is India's most trusted air conditioning brand, delivering high cooling performance, low power consumption, and all-weather inverter ACs.",
    rating: 4.8,
    reviewsCount: 1450,
    badgeText: "Authorized TATA Voltas Dealer",
    features: [
      { title: "Adjustable Inverter Cooling", desc: "Run AC at 4 different tonnage capacities based on occupancy.", icon: "star" },
      { title: "Superdry Mode", desc: "Dehumidifies indoor room air quickly during rainy season.", icon: "trophy" },
    ],
    products: [
      { name: "Voltas 1.5 Ton 3-Star Adjustable Inverter AC", type: "Split AC", price: "₹34,500", spec: "4-in-1 Adjustable, Anti-Microbial Filter", image: splitAcImg },
    ],
  },
  {
    _id: "brand-general",
    slug: "o-general",
    brandName: "O General",
    name: "O General Air Conditioners",
    heroImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60"><circle cx="25" cy="30" r="16" fill="none" stroke="%23E30613" stroke-width="6"/><text x="50" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%23E30613" letter-spacing="1">GENERAL</text></svg>`,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60"><circle cx="25" cy="30" r="16" fill="none" stroke="%23E30613" stroke-width="6"/><text x="50" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%23E30613" letter-spacing="1">GENERAL</text></svg>`,
    tagline: "Extreme Cooling Performance Engineered for Gulf Heat",
    overview: "O General is world-famous for heavy-duty tropical compressors designed to deliver uncompromised cooling even at 55°C ambient temperatures.",
    rating: 4.96,
    reviewsCount: 890,
    badgeText: "Authorized Premium Partner",
    features: [
      { title: "Tropical Rotary Compressor", desc: "Extreme durability and cooling power in high ambient heat.", icon: "star" },
    ],
    products: [
      { name: "O General 1.5 Ton 5-Star Tropical Inverter AC", type: "Split AC", price: "₹58,900", spec: "Hyper Tropical V-PAM, Copper", image: splitAcImg },
    ],
  }
];

export const staticBookings = [
  { _id: "b-101", name: "Rahul Verma", phone: "9839171701", email: "rahul@gmail.com", service: "AC Installation", createdAt: "2024-09-15" },
  { _id: "b-102", name: "Vikram Singh", phone: "9876543210", email: "vikram@outlook.com", service: "AMC Service", createdAt: "2024-09-16" },
];

/* ─── Gallery Data (Matches Frontend /gallery) ─────────────────────────── */
export interface GalleryData {
  _id: string;
  category: "all" | "residential" | "commercial" | "vrf" | "ductable" | "maintenance";
  image: string;
}

export const staticGallery: GalleryData[] = [
  { _id: "gal-1", category: "vrf", image: amcImg },
  { _id: "gal-2", category: "maintenance", image: indoorImg },
  { _id: "gal-3", category: "commercial", image: cleanCassetteImg },
  { _id: "gal-4", category: "ductable", image: ductableImg },
  { _id: "gal-5", category: "vrf", image: cleanVrfImg },
  { _id: "gal-6", category: "maintenance", image: ahuImg },
  { _id: "gal-7", category: "commercial", image: chillerImg },
  { _id: "gal-8", category: "ductable", image: coldRoomImg },
];

/* ─── Contact Inquiries (Matches Frontend /contact-us) ─────────────────── */
export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "New" | "Contacted" | "In Progress" | "Resolved";
  createdAt: string;
}

export const staticContacts: ContactInquiry[] = [
  {
    _id: "cnt-101",
    name: "Amitabh Sharma",
    email: "amitabh.sharma@tcs.com",
    phone: "9839171701",
    service: "VRF Systems",
    message: "Need multi-zone VRF HVAC installation quote for our new 5-floor corporate office in Gomti Nagar.",
    status: "New",
    createdAt: "2026-09-21T09:30:00Z",
  },
  {
    _id: "cnt-102",
    name: "Pooja Malhotra",
    email: "pooja.malhotra@apollo.org",
    phone: "9876543210",
    service: "AMC Service",
    message: "Looking for comprehensive annual maintenance contract (AMC) for 24 cassette and split AC units.",
    status: "Contacted",
    createdAt: "2026-09-20T14:15:00Z",
  },
  {
    _id: "cnt-103",
    name: "Rajesh Singhania",
    email: "singhania.infra@gmail.com",
    phone: "9918234567",
    service: "Commercial HVAC",
    message: "Require centralized chiller plant installation and ducting consultation for upcoming banquet hall.",
    status: "In Progress",
    createdAt: "2026-09-19T16:45:00Z",
  },
  {
    _id: "cnt-104",
    name: "Dr. Alok Srivastava",
    email: "dralok@medanta.org",
    phone: "9415012345",
    service: "Cold Storage",
    message: "Need quotation for pharmaceutical cold room and precision cleanroom AHU maintenance.",
    status: "Resolved",
    createdAt: "2026-09-18T09:20:00Z",
  },
  {
    _id: "cnt-105",
    name: "Kavita Rastogi",
    email: "kavita.r@gmail.com",
    phone: "9838056789",
    service: "AC Repair",
    message: "Master bedroom split AC cooling stopped and display showing error code E6. Need technician today.",
    status: "New",
    createdAt: "2026-09-21T08:10:00Z",
  },
  {
    _id: "cnt-106",
    name: "Deepak Choudhary",
    email: "deepak@choudharygroup.in",
    phone: "9792011223",
    service: "AC Installation",
    message: "Want to install 4 Daikin 1.5 Ton 5-Star inverter split ACs at residential villa with copper piping.",
    status: "New",
    createdAt: "2026-09-21T11:40:00Z",
  },
];
