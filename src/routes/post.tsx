import { useState } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { createListing } from "@/lib/listings-api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CloudUpload,
  Plus,
  X,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/post")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Post a Listing â€” MarketUK" }] }),
  component: PostListing,
});

const STEPS = [
  { label: "Property Info" },
  { label: "Location" },
  { label: "Pricing" },
  { label: "Details" },
  { label: "Media" },
  { label: "Review" },
];

type StepErrors = Record<string, string>;

interface FormData {
  // Step 1
  title: string;
  propertyType: string;
  description: string;
  keyFeatures: string[];
  // Step 2
  address1: string;
  address2: string;
  city: string;
  county: string;
  postcode: string;
  region: string;
  // Step 3
  askingPrice: string;
  offersInvited: boolean;
  priceQualifier: string;
  tenure: string;
  serviceCharge: string;
  groundRent: string;
  // Step 4
  bedrooms: string;
  bathrooms: string;
  floorArea: string;
  floorAreaUnit: "sqft" | "sqm";
  yearBuilt: string;
  condition: string;
  epcRating: string;
  councilTaxBand: string;
  parking: string;
  garden: string;
  centralHeating: boolean;
  broadband: boolean;
  // Step 5 â€” simulated
  // Step 6
  selectedPackage: string;
  agreedTerms: boolean;
}

const defaultForm: FormData = {
  title: "",
  propertyType: "",
  description: "",
  keyFeatures: [""],
  address1: "",
  address2: "",
  city: "",
  county: "",
  postcode: "",
  region: "",
  askingPrice: "",
  offersInvited: false,
  priceQualifier: "",
  tenure: "",
  serviceCharge: "",
  groundRent: "",
  bedrooms: "",
  bathrooms: "",
  floorArea: "",
  floorAreaUnit: "sqft",
  yearBuilt: "",
  condition: "",
  epcRating: "",
  councilTaxBand: "",
  parking: "",
  garden: "",
  centralHeating: false,
  broadband: false,
  selectedPackage: "",
  agreedTerms: false,
};

const epcColors: Record<string, string> = {
  A: "bg-[#008054] text-white",
  B: "bg-[#19b459] text-white",
  C: "bg-[#8dce46] text-black",
  D: "bg-[#ffd500] text-black",
  E: "bg-[#fcaa65] text-black",
  F: "bg-[#ef8023] text-white",
  G: "bg-[#e9153b] text-white",
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {STEPS.map((step, i) => {
          const num = i + 1;
          const done = num < current;
          const active = num === current;
          return (
            <div key={i} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                  ${done ? "bg-[#C8922A] border-[#C8922A] text-white" : ""}
                  ${active ? "bg-white border-[#0D2B4E] text-[#0D2B4E]" : ""}
                  ${!done && !active ? "bg-white border-gray-300 text-gray-400" : ""}
                `}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
              <span
                className={`mt-1 text-xs text-center hidden sm:block font-medium
                  ${active ? "text-[#0D2B4E]" : done ? "text-[#C8922A]" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PillButton({
  label,
  selected,
  onClick,
  className = "",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer
        ${selected ? "bg-[#0D2B4E] text-white border-[#0D2B4E]" : "bg-white text-gray-700 border-gray-300 hover:border-[#0D2B4E]"}
        ${className}
      `}
    >
      {label}
    </button>
  );
}

interface UploadedImage {
  id: number;
  url: string;
  featured: boolean;
  uploading?: boolean;
  error?: string;
}

function PostListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<StepErrors>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  function validateStep(s: number): StepErrors {
    const e: StepErrors = {};
    if (s === 1) {
      if (!form.title.trim()) e.title = "Listing title is required";
      if (!form.propertyType) e.propertyType = "Please select a property type";
      if (form.description.trim().length < 100)
        e.description = `Description must be at least 100 characters (currently ${form.description.trim().length})`;
    }
    if (s === 2) {
      if (!form.address1.trim()) e.address1 = "Address Line 1 is required";
      if (!form.city.trim()) e.city = "City/Town is required";
      if (!form.postcode.trim()) e.postcode = "Postcode is required";
      if (!form.region) e.region = "Please select a region";
    }
    if (s === 3) {
      if (!form.askingPrice.trim()) e.askingPrice = "Asking price is required";
      if (!form.tenure) e.tenure = "Please select a tenure";
    }
    if (s === 4) {
      if (!form.bedrooms) e.bedrooms = "Please select number of bedrooms";
      if (!form.bathrooms) e.bathrooms = "Please select number of bathrooms";
    }
    if (s === 6) {
      if (!form.selectedPackage) e.selectedPackage = "Please select a package";
      if (!form.agreedTerms) e.agreedTerms = "You must agree to the Terms & Conditions";
    }
    return e;
  }

  async function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});

    // On step 6 â€” submit to Supabase
    if (step === 6) {
      if (!user) {
        setSubmitError("You must be signed in to publish a listing.");
        return;
      }
      setSubmitting(true);
      setSubmitError(null);
      try {
        // Images are already uploaded to Cloudinary during Step 5 selection
        const readyImages = images.filter((i) => !i.uploading && !i.error);
        const imageUrls = readyImages.map((i) => i.url);
        const featuredImage = readyImages.find((i) => i.featured)?.url ?? imageUrls[0] ?? null;

        const { listing, error } = await createListing({
          user_id: user.id,
          title: form.title,
          slug: "", // auto-generated by DB trigger
          description: form.description,
          property_type: form.propertyType,
          status: "draft",
          asking_price: form.askingPrice ? Number(form.askingPrice.replace(/[^0-9.]/g, "")) : null,
          price_qualifier: form.priceQualifier || null,
          offers_invited: form.offersInvited,
          tenure: form.tenure || null,
          service_charge: form.serviceCharge ? Number(form.serviceCharge) : null,
          ground_rent: form.groundRent ? Number(form.groundRent) : null,
          address_line1: form.address1,
          address_line2: form.address2 || null,
          city: form.city,
          county: form.county || null,
          postcode: form.postcode,
          region: form.region,
          bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
          bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
          floor_area: form.floorArea ? Number(form.floorArea) : null,
          floor_area_unit: form.floorAreaUnit,
          year_built: form.yearBuilt ? Number(form.yearBuilt) : null,
          condition: form.condition || null,
          epc_rating: form.epcRating || null,
          council_tax_band: form.councilTaxBand || null,
          parking: form.parking || null,
          garden: form.garden || null,
          central_heating: form.centralHeating,
          broadband: form.broadband,
          key_features: form.keyFeatures.filter(Boolean),
          images: imageUrls,
          featured_image: featuredImage,
          documents: {},
          is_featured: form.selectedPackage === "premium",
        });

        if (error) {
          setSubmitError(error.message);
        } else {
          navigate({ to: "/dashboard/seller" });
        }
      } catch (err) {
        setSubmitError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setStep((s) => Math.min(s + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addFeature() {
    if (form.keyFeatures.length < 8)
      set("keyFeatures", [...form.keyFeatures, ""]);
  }

  function removeFeature(i: number) {
    set("keyFeatures", form.keyFeatures.filter((_, idx) => idx !== i));
  }

  function updateFeature(i: number, val: string) {
    const arr = [...form.keyFeatures];
    arr[i] = val;
    set("keyFeatures", arr);
  }

  function formatPrice(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("en-GB");
  }

  const isLeasehold = form.tenure === "Leasehold";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Post a Listing</h1>
        <p className="text-gray-500 mb-8">Complete all steps to publish your property on MarketUK</p>

        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {/* â”€â”€â”€ STEP 1 â”€â”€â”€ */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary">Property Information</h2>

              <div>
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  className="mt-1"
                  placeholder="e.g. 4-Bed Detached House, Kensington"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={form.propertyType} onValueChange={(v) => set("propertyType", v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Residential","Commercial","New Build","Industrial","Land & Development","Office","Retail Unit","Student Property","HMO & BTL","Holiday Let","Auction"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
              </div>

              <div>
                <Label htmlFor="description">
                  Description * <span className="text-gray-400 font-normal text-xs">(min 100 chars)</span>
                </Label>
                <Textarea
                  id="description"
                  className="mt-1 min-h-[140px]"
                  placeholder="Describe the property in detail â€” location highlights, interior features, nearby amenities..."
                  maxLength={2000}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description
                    ? <p className="text-red-500 text-sm">{errors.description}</p>
                    : <span />}
                  <span className="text-xs text-gray-400">{form.description.length} / 2000</span>
                </div>
              </div>

              <div>
                <Label>Key Features <span className="text-gray-400 font-normal text-xs">(up to 8)</span></Label>
                <div className="mt-2 space-y-2">
                  {form.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder={`Feature ${i + 1}, e.g. South-facing garden`}
                        value={feat}
                        onChange={(e) => updateFeature(i, e.target.value)}
                      />
                      {form.keyFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {form.keyFeatures.length < 8 && (
                  <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 flex items-center gap-1 text-sm text-[#C8922A] hover:text-[#a07020] font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Feature
                  </button>
                )}
              </div>
            </div>
          )}

          {/* â”€â”€â”€ STEP 2 â”€â”€â”€ */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary">Location</h2>
              <div>
                <Label htmlFor="addr1">Address Line 1 *</Label>
                <Input id="addr1" className="mt-1" placeholder="House number and street name" value={form.address1} onChange={(e) => set("address1", e.target.value)} />
                {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
              </div>
              <div>
                <Label htmlFor="addr2">Address Line 2 <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                <Input id="addr2" className="mt-1" placeholder="Apartment, suite, etc." value={form.address2} onChange={(e) => set("address2", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City / Town *</Label>
                  <Input id="city" className="mt-1" placeholder="e.g. Manchester" value={form.city} onChange={(e) => set("city", e.target.value)} />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input id="county" className="mt-1" placeholder="e.g. Greater Manchester" value={form.county} onChange={(e) => set("county", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input id="postcode" className="mt-1" placeholder="e.g. SW1A 1AA" value={form.postcode} onChange={(e) => set("postcode", e.target.value.toUpperCase())} />
                  {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
                </div>
                <div>
                  <Label htmlFor="region">Region *</Label>
                  <Select value={form.region} onValueChange={(v) => set("region", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {["London","South East","South West","East of England","East Midlands","West Midlands","Yorkshire","North West","North East","Scotland","Wales","Northern Ireland"].map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€â”€ STEP 3 â”€â”€â”€ */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-primary">Pricing</h2>

              <div>
                <Label htmlFor="price">Asking Price *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Â£</span>
                  <Input
                    id="price"
                    className="pl-7"
                    placeholder="485,000"
                    value={form.askingPrice}
                    onChange={(e) => set("askingPrice", formatPrice(e.target.value))}
                  />
                </div>
                {errors.askingPrice && <p className="text-red-500 text-sm mt-1">{errors.askingPrice}</p>}
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="offersInvited"
                  checked={form.offersInvited}
                  onCheckedChange={(v) => set("offersInvited", v)}
                />
                <Label htmlFor="offersInvited" className="cursor-pointer">Offers Invited</Label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Price Qualifier</Label>
                  <Select value={form.priceQualifier} onValueChange={(v) => set("priceQualifier", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select qualifier" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Guide Price","Fixed Price","OIEO","OIRO","POA","Shared Ownership"].map((q) => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tenure *</Label>
                  <Select value={form.tenure} onValueChange={(v) => set("tenure", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Freehold","Leasehold","Share of Freehold","Commonhold"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tenure && <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>}
                </div>
              </div>

              {isLeasehold && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div>
                    <Label htmlFor="serviceCharge">Service Charge (Â£/year)</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Â£</span>
                      <Input id="serviceCharge" className="pl-7" placeholder="2,400" value={form.serviceCharge} onChange={(e) => set("serviceCharge", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="groundRent">Ground Rent (Â£/year)</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Â£</span>
                      <Input id="groundRent" className="pl-7" placeholder="250" value={form.groundRent} onChange={(e) => set("groundRent", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* â”€â”€â”€ STEP 4 â”€â”€â”€ */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary">Property Details</h2>

              <div>
                <Label>Bedrooms *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["0","1","2","3","4","5","6","7","8+"].map((b) => (
                    <PillButton key={b} label={b} selected={form.bedrooms === b} onClick={() => set("bedrooms", b)} />
                  ))}
                </div>
                {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
              </div>

              <div>
                <Label>Bathrooms *</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["1","2","3","4","5+"].map((b) => (
                    <PillButton key={b} label={b} selected={form.bathrooms === b} onClick={() => set("bathrooms", b)} />
                  ))}
                </div>
                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Floor Area</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="e.g. 1,200"
                      value={form.floorArea}
                      onChange={(e) => set("floorArea", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => set("floorAreaUnit", form.floorAreaUnit === "sqft" ? "sqm" : "sqft")}
                      className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium bg-gray-50 hover:bg-gray-100 whitespace-nowrap"
                    >
                      {form.floorAreaUnit}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input id="yearBuilt" className="mt-1" placeholder="e.g. 2005" value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Condition</Label>
                <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {["New Build","Excellent","Good","Fair","Needs Renovation"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>EPC Rating</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["A","B","C","D","E","F","G"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set("epcRating", r)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all cursor-pointer
                        ${form.epcRating === r ? `${epcColors[r]} border-transparent` : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"}
                      `}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Council Tax Band</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["A","B","C","D","E","F","G","H"].map((b) => (
                    <PillButton key={b} label={b} selected={form.councilTaxBand === b} onClick={() => set("councilTaxBand", b)} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Parking</Label>
                  <Select value={form.parking} onValueChange={(v) => set("parking", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select parking" /></SelectTrigger>
                    <SelectContent>
                      {["None","On Street","Single Garage","Double Garage","Allocated Space","Multiple"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Garden</Label>
                  <Select value={form.garden} onValueChange={(v) => set("garden", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select garden" /></SelectTrigger>
                    <SelectContent>
                      {["None","Front Only","Rear Only","Front & Rear","Communal"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Switch id="ch" checked={form.centralHeating} onCheckedChange={(v) => set("centralHeating", v)} />
                  <Label htmlFor="ch" className="cursor-pointer">Central Heating</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="bb" checked={form.broadband} onCheckedChange={(v) => set("broadband", v)} />
                  <Label htmlFor="bb" className="cursor-pointer">Broadband Available</Label>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€â”€ STEP 5 â”€â”€â”€ */}
          {step === 5 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-primary">Media</h2>

              {/* Photo Upload â€” Cloudinary */}
              <div>
                <Label className="text-base font-semibold">Property Photos</Label>
                <label className="mt-3 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:border-[#C8922A] transition-colors cursor-pointer">
                  <CloudUpload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">Click to select photos</p>
                  <p className="text-gray-400 text-sm mb-4">PNG, JPG, WEBP â€” max 10MB each</p>
                  <span className="inline-flex items-center px-4 py-2 rounded-md bg-[#C8922A] text-white text-sm font-medium">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (!files.length) return;
                      if (images.length + files.length > 20) {
                        alert("Maximum 20 images allowed.");
                        return;
                      }
                      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const tempId = Date.now() + i;
                        const localUrl = URL.createObjectURL(file);
                        setImages((prev) => [...prev, { id: tempId, url: localUrl, featured: prev.length === 0, uploading: !!cloudName }]);
                        if (cloudName) {
                          setUploadProgress(`Uploading ${i + 1} of ${files.length}…`);
                          const { result, error } = await uploadToCloudinary(file, "marketuk/listings");
                          setImages((prev) => prev.map((img) =>
                            img.id === tempId
                              ? result ? { ...img, url: result.secureUrl, uploading: false }
                                       : { ...img, uploading: false, error: error ?? "Failed" }
                              : img
                          ));
                        }
                      }
                      setUploadProgress(null);
                      e.target.value = "";
                    }}
                  />
                </label>
                {uploadProgress && (
                  <p className="mt-2 text-sm text-[#C8922A] font-medium flex items-center gap-2">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#C8922A] border-t-transparent" />
                    {uploadProgress}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Maximum 20 images. Star = featured listing photo.</p>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img) => (
                    <div key={img.id} className={`relative group rounded-lg overflow-hidden border ${img.error ? "border-red-300" : "border-gray-200"}`}>
                      <img src={img.url} alt="property" className={`w-full h-28 object-cover ${img.uploading ? "opacity-50" : ""}`} />
                      {img.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}
                      {img.error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/80">
                          <span className="text-white text-xs px-1 text-center">{img.error}</span>
                        </div>
                      )}
                      {!img.uploading && !img.error && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setImages((imgs) => imgs.map((i) => ({ ...i, featured: i.id === img.id })))}
                            className={`p-1.5 rounded-full ${img.featured ? "bg-[#C8922A] text-white" : "bg-white text-gray-700"}`}
                            title="Set as featured"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setImages((imgs) => imgs.filter((i) => i.id !== img.id))}
                            className="p-1.5 rounded-full bg-red-500 text-white"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {img.featured && !img.uploading && (
                        <span className="absolute top-1 left-1 bg-[#C8922A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Documents */}
              <div>
                <Label className="text-base font-semibold">PDF Documents</Label>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Floor Plan","EPC Certificate","Title Register","Other Documents"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{doc}</span>
                      </div>
                      <label className="cursor-pointer">
                        <span className="text-xs text-[#C8922A] font-semibold hover:underline">Upload</span>
                        <input type="file" accept=".pdf" className="hidden" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€â”€ STEP 6 â”€â”€â”€ */}
          {step === 6 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-primary">Review &amp; Publish</h2>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-3 text-sm">
                <h3 className="font-semibold text-[#0D2B4E] mb-3">Listing Summary</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-gray-500">Title</div>
                  <div className="font-medium">{form.title || "â€”"}</div>
                  <div className="text-gray-500">Type</div>
                  <div className="font-medium">{form.propertyType || "â€”"}</div>
                  <div className="text-gray-500">Address</div>
                  <div className="font-medium">{[form.address1, form.city, form.postcode].filter(Boolean).join(", ") || "â€”"}</div>
                  <div className="text-gray-500">Region</div>
                  <div className="font-medium">{form.region || "â€”"}</div>
                  <div className="text-gray-500">Asking Price</div>
                  <div className="font-medium text-[#C8922A]">{form.askingPrice ? `Â£${form.askingPrice}` : "â€”"}</div>
                  <div className="text-gray-500">Tenure</div>
                  <div className="font-medium">{form.tenure || "â€”"}</div>
                  <div className="text-gray-500">Bedrooms</div>
                  <div className="font-medium">{form.bedrooms || "â€”"}</div>
                  <div className="text-gray-500">Bathrooms</div>
                  <div className="font-medium">{form.bathrooms || "â€”"}</div>
                  <div className="text-gray-500">EPC Rating</div>
                  <div className="font-medium">{form.epcRating || "â€”"}</div>
                  <div className="text-gray-500">Parking</div>
                  <div className="font-medium">{form.parking || "â€”"}</div>
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <h3 className="font-semibold text-[#0D2B4E] mb-4">Choose Your Plan</h3>
                {errors.selectedPackage && <p className="text-red-500 text-sm mb-3">{errors.selectedPackage}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Free */}
                  <div
                    onClick={() => set("selectedPackage", "free")}
                    className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all
                      ${form.selectedPackage === "free" ? "border-[#0D2B4E] bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    <p className="text-gray-500 text-sm font-medium">Free</p>
                    <p className="text-2xl font-bold text-[#0D2B4E] mt-1">Â£0<span className="text-sm font-normal text-gray-400">/mo</span></p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li>âœ“ 1 listing</li>
                      <li>âœ“ 3 images</li>
                      <li>âœ“ Standard placement</li>
                    </ul>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4 border-[#0D2B4E] text-[#0D2B4E]"
                      onClick={() => set("selectedPackage", "free")}
                    >
                      Select Free
                    </Button>
                  </div>

                  {/* Standard */}
                  <div
                    onClick={() => set("selectedPackage", "standard")}
                    className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all
                      ${form.selectedPackage === "standard" ? "border-[#C8922A] bg-amber-50" : "border-[#C8922A]/50 hover:border-[#C8922A]"}
                    `}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8922A] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                      MOST POPULAR
                    </span>
                    <p className="text-gray-500 text-sm font-medium">Standard</p>
                    <p className="text-2xl font-bold text-[#0D2B4E] mt-1">Â£29<span className="text-sm font-normal text-gray-400">/mo</span></p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li>âœ“ 10 listings</li>
                      <li>âœ“ 10 images</li>
                      <li>âœ“ Highlighted border</li>
                    </ul>
                    <Button
                      type="button"
                      className="w-full mt-4 bg-[#C8922A] hover:bg-[#a07020] text-white"
                      onClick={() => set("selectedPackage", "standard")}
                    >
                      Select Standard
                    </Button>
                  </div>

                  {/* Premium */}
                  <div
                    onClick={() => set("selectedPackage", "premium")}
                    className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all
                      ${form.selectedPackage === "premium" ? "border-[#0D2B4E] bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    <p className="text-gray-500 text-sm font-medium">Premium</p>
                    <p className="text-2xl font-bold text-[#0D2B4E] mt-1">Â£59<span className="text-sm font-normal text-gray-400">/mo</span></p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li>âœ“ Unlimited listings</li>
                      <li>âœ“ 20 images</li>
                      <li>âœ“ Featured badge</li>
                      <li>âœ“ Analytics dashboard</li>
                    </ul>
                    <Button
                      type="button"
                      className="w-full mt-4 bg-[#0D2B4E] hover:bg-[#0a2040] text-white"
                      onClick={() => set("selectedPackage", "premium")}
                    >
                      Select Premium
                    </Button>
                  </div>
                </div>
              </div>

              {/* T&Cs */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={form.agreedTerms}
                  onCheckedChange={(v) => set("agreedTerms", !!v)}
                />
                <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#C8922A] underline hover:no-underline">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#C8922A] underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreedTerms && <p className="text-red-500 text-sm -mt-4">{errors.agreedTerms}</p>}
            </div>
          )}

          {/* â”€â”€â”€ NAV BUTTONS â”€â”€â”€ */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={back} className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <Button
                type="button"
                onClick={next}
                className="bg-[#C8922A] hover:bg-[#a07020] text-white flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex flex-col items-end gap-2 w-full max-w-xs">
                {submitError && (
                  <p className="text-sm text-red-500 text-right">{submitError}</p>
                )}
                <Button
                  type="button"
                  onClick={next}
                  disabled={submitting}
                  className="w-full bg-[#C8922A] hover:bg-[#a07020] text-white text-base py-5"
                >
                  {submitting ? "Publishingâ€¦" : "Publish Listing"}
                </Button>
                <button type="button" className="text-sm text-gray-400 hover:text-gray-600 underline">
                  Save as Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
