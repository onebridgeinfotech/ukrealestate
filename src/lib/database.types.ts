export type UserRole = "buyer" | "seller" | "agent" | "admin";
export type ListingStatus = "active" | "under_offer" | "sold" | "draft" | "pending" | "rejected";
export type EnquiryStatus = "new" | "read" | "replied" | "closed";
export type PackageName = "free" | "standard" | "premium";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: UserRole;
          company_name: string | null;
          bio: string | null;
          website: string | null;
          rics_number: string | null;
          avatar_url: string | null;
          package: PackageName;
          package_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          description: string | null;
          property_type: string;
          status: ListingStatus;
          asking_price: number | null;
          price_qualifier: string | null;
          offers_invited: boolean;
          tenure: string | null;
          service_charge: number | null;
          ground_rent: number | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          county: string | null;
          postcode: string;
          region: string;
          bedrooms: number | null;
          bathrooms: number | null;
          floor_area: number | null;
          floor_area_unit: string | null;
          year_built: number | null;
          condition: string | null;
          epc_rating: string | null;
          council_tax_band: string | null;
          parking: string | null;
          garden: string | null;
          central_heating: boolean;
          broadband: boolean;
          key_features: string[];
          images: string[];
          featured_image: string | null;
          documents: Record<string, string>;
          is_featured: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["listings"]["Row"], "id" | "created_at" | "updated_at" | "views">;
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      enquiries: {
        Row: {
          id: string;
          listing_id: string;
          sender_id: string | null;
          agent_id: string | null;
          sender_name: string;
          sender_email: string;
          sender_phone: string | null;
          message: string;
          status: EnquiryStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["enquiries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
      };
      saved_listings: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_listings"]["Row"], "id" | "created_at">;
        Update: never;
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          filters: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_searches"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["saved_searches"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      listing_status: ListingStatus;
      enquiry_status: EnquiryStatus;
    };
  };
}
