const residentialImg = "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80";
const commercialImg = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80";
const officeImg = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";
const industrialImg = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";
const newBuildImg = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";
const landImg = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";
const londonImg = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80";
const manchesterImg = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80";
const birminghamImg = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80";
const edinburghImg = "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=800&q=80";

export type ListingStatus = "active" | "under-offer" | "sold";
export type ListingBadge = "featured" | "new" | "reduced" | null;

export interface Listing {
  id: string;
  ref: string;
  title: string;
  location: string;
  region: string;
  price: number;
  priceLabel?: string;
  offersInvited?: boolean;
  category: string;
  status: ListingStatus;
  badge: ListingBadge;
  image: string;
  description: string;
  turnover?: string;
  netProfit?: string;
  employees?: number;
  tenure?: string;
  established?: number;
  listedDate: string;
  views: number;
}

export const listings: Listing[] = [
  {
    id: "1",
    ref: "RE-10241",
    title: "Luxury 4-Bed Detached House — Prime Residential Location",
    location: "Kensington, London",
    region: "London",
    price: 2850000,
    category: "Residential",
    status: "active",
    badge: "featured",
    image: residentialImg,
    description:
      "Stunning four-bedroom detached family home in one of London's most prestigious postcodes. Beautifully refurbished throughout with south-facing garden, original period features and off-street parking.",
    tenure: "Freehold",
    listedDate: "2 days ago",
    views: 3142,
  },
  {
    id: "2",
    ref: "RE-10198",
    title: "Modern Grade A Office Space — City Centre",
    location: "Canary Wharf, London",
    region: "London",
    price: 1750000,
    category: "Commercial",
    status: "active",
    badge: "new",
    image: commercialImg,
    description:
      "10,500 sq ft of premium open-plan office space across two floors in an iconic Canary Wharf tower. Full fit-out, raised floors, VRF air conditioning and panoramic river views.",
    tenure: "Leasehold",
    listedDate: "5 days ago",
    views: 1284,
  },
  {
    id: "3",
    ref: "RE-09872",
    title: "New Build 3-Bed Semi-Detached — Help to Buy Available",
    location: "Didsbury, Manchester",
    region: "North West",
    price: 385000,
    category: "New Build",
    status: "active",
    badge: "featured",
    image: newBuildImg,
    description:
      "Brand new three-bedroom semi-detached home on an award-winning development. Energy efficient A-rated, 10-year NHBC warranty, private garden and allocated parking. Help to Buy eligible.",
    tenure: "Freehold",
    listedDate: "1 week ago",
    views: 2156,
  },
  {
    id: "4",
    ref: "RE-09745",
    title: "Industrial Logistics Hub — 42,000 sq ft Warehouse",
    location: "Trafford Park, Manchester",
    region: "North West",
    price: 3200000,
    offersInvited: true,
    category: "Industrial",
    status: "under-offer",
    badge: null,
    image: industrialImg,
    description:
      "Modern distribution warehouse with 12m eaves height, 8 dock levellers and 6 level access doors. Excellent M60 motorway access. Long-standing tenants generating £195,000 p.a. rent.",
    tenure: "Freehold",
    listedDate: "3 weeks ago",
    views: 987,
  },
  {
    id: "5",
    ref: "RE-10302",
    title: "Prime Development Land — Planning Granted for 24 Units",
    location: "Headingley, Leeds",
    region: "Yorkshire",
    price: 1100000,
    category: "Land",
    status: "active",
    badge: "reduced",
    image: landImg,
    description:
      "1.2-acre residential development site with full planning permission for 24 dwellings (mix of houses and apartments). Infrastructure in place, ideal for national or regional housebuilder.",
    tenure: "Freehold",
    listedDate: "Yesterday",
    views: 1640,
  },
  {
    id: "6",
    ref: "RE-10115",
    title: "Period Office Building — Georgian Townhouse Conversion",
    location: "New Town, Edinburgh",
    region: "Scotland",
    price: 875000,
    category: "Office",
    status: "active",
    badge: "featured",
    image: officeImg,
    description:
      "Beautifully preserved Grade B-listed Georgian townhouse arranged over four floors providing 4,800 sq ft of character office accommodation. Recently refurbished, EPC rating C.",
    tenure: "Freehold",
    listedDate: "4 days ago",
    views: 738,
  },
];

export const categories = [
  { name: "Residential", icon: "Home", count: 4820 },
  { name: "Commercial", icon: "Building2", count: 2340 },
  { name: "New Build", icon: "HardHat", count: 1186 },
  { name: "Industrial", icon: "Factory", count: 892 },
  { name: "Land", icon: "Map", count: 634 },
  { name: "Office", icon: "Briefcase", count: 1074 },
  { name: "Retail Units", icon: "ShoppingBag", count: 758 },
  { name: "Student Property", icon: "GraduationCap", count: 412 },
  { name: "HMO & BTL", icon: "Users", count: 965 },
  { name: "Auction", icon: "Gavel", count: 320 },
  { name: "Holiday Let", icon: "Palmtree", count: 287 },
  { name: "Development", icon: "Layers", count: 519 },
];

export const cities = [
  { name: "London", count: 3247, image: londonImg },
  { name: "Manchester", count: 1186, image: manchesterImg },
  { name: "Birmingham", count: 942, image: birminghamImg },
  { name: "Edinburgh", count: 614, image: edinburghImg },
];

export const testimonials = [
  {
    name: "James Whitfield",
    role: "Property Developer, London",
    quote:
      "Found our development site within a week. The platform connected us with serious vendors and we exchanged contracts in 6 weeks. Outstanding service.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Buy-to-Let Investor, Birmingham",
    quote:
      "The HMO and BTL category is brilliant. Detailed yield data and direct agent contact made comparing investment properties across the UK effortless.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "RICS Chartered Surveyor",
    quote:
      "Best property portal I've recommended to clients. Quality verified listings, professional tools and exceptional reach across every UK region.",
    rating: 5,
  },
];

export const stats = [
  { label: "Active Listings", value: "14,000+" },
  { label: "Registered Buyers", value: "38,000+" },
  { label: "UK Estate Agents", value: "850+" },
  { label: "Properties Sold", value: "£2.4B+" },
];

export function formatPrice(p: number): string {
  if (p >= 1_000_000) return `£${(p / 1_000_000).toFixed(2)}M`;
  if (p >= 1000) return `£${(p / 1000).toFixed(0)}k`;
  return `£${p.toLocaleString()}`;
}
