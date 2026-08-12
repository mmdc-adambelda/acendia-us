// Hand-written types for the tables this phase's code actually queries.
// This is NOT the full schema (see supabase/migrations/0001_schema.sql for
// that) — once you have Supabase CLI access to the project, regenerate the
// authoritative version with:
//
//   npx supabase gen types typescript --project-id <your-project-ref> > lib/supabase/database.types.ts
//
// and it will safely replace/extend this file. See CLIENT-PORTAL-SETUP.md.
//
// Note: the shape below (Tables/Views/Functions/Enums/CompositeTypes, each
// Table having Row/Insert/Update/Relationships) mirrors exactly what the
// Supabase CLI itself generates — @supabase/supabase-js's query builder
// generics need that full shape to infer row types correctly; leaving any
// of it out makes every query silently resolve to `never`.

export type UserRole = "client" | "staff" | "admin" | "super_admin";
export type OrgMemberRole = "owner" | "member";
export type PlanType = "core" | "addon" | "custom";
export type BillingCycle = "monthly" | "quarterly" | "annual";
export type SubscriptionStatus =
  | "pending"
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "cancelled"
  | "expired";

type TableDef<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<
        {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
        }
      >;
      organizations: TableDef<
        {
          id: string;
          name: string;
          industry: string | null;
          employee_count: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          address: string | null;
          phone: string | null;
          account_manager_id: string | null;
          onboarding_status: string;
          created_at: string;
          updated_at: string;
        },
        {
          name: string;
          industry?: string | null;
          employee_count?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          address?: string | null;
          phone?: string | null;
          account_manager_id?: string | null;
          onboarding_status?: string;
        }
      >;
      organization_members: TableDef<
        {
          id: string;
          organization_id: string;
          user_id: string;
          role: OrgMemberRole;
          created_at: string;
          organizations?: { name: string } | null;
        },
        {
          organization_id: string;
          user_id: string;
          role?: OrgMemberRole;
        }
      >;
      websites: TableDef<
        {
          id: string;
          organization_id: string;
          url: string;
          primary_service: string | null;
          target_service: string | null;
          current_seo_provider: string | null;
          google_business_profile_url: string | null;
          competitors: string[] | null;
          approx_monthly_leads: string | null;
          approx_monthly_traffic: string | null;
          primary_challenge: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          organization_id: string;
          url: string;
          primary_service?: string | null;
          target_service?: string | null;
          current_seo_provider?: string | null;
          google_business_profile_url?: string | null;
          competitors?: string[] | null;
          approx_monthly_leads?: string | null;
          approx_monthly_traffic?: string | null;
          primary_challenge?: string | null;
        }
      >;
      locations: TableDef<
        {
          id: string;
          organization_id: string;
          label: string;
          city: string | null;
          state: string | null;
          is_primary: boolean;
          created_at: string;
        },
        {
          organization_id: string;
          label: string;
          city?: string | null;
          state?: string | null;
          is_primary?: boolean;
        }
      >;
      plans: TableDef<
        {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          plan_type: PlanType;
          setup_fee_cents: number | null;
          monthly_price_cents: number | null;
          quarterly_price_cents: number | null;
          annual_price_cents: number | null;
          stripe_price_id_monthly: string | null;
          stripe_price_id_quarterly: string | null;
          stripe_price_id_annual: string | null;
          paypal_plan_id_monthly: string | null;
          paypal_plan_id_quarterly: string | null;
          paypal_plan_id_annual: string | null;
          wise_available: boolean;
          features: string[];
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        },
        { name: string; slug: string; [key: string]: unknown }
      >;
      subscriptions: TableDef<
        {
          id: string;
          organization_id: string;
          plan_id: string;
          billing_cycle: BillingCycle;
          payment_provider: "stripe" | "paypal" | "wise" | null;
          status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          paypal_subscriber_id: string | null;
          paypal_subscription_id: string | null;
          wise_reference: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          cancelled_at: string | null;
          terms_version: string | null;
          service_agreement_version: string | null;
          terms_accepted_at: string | null;
          terms_accepted_by: string | null;
          terms_accepted_ip: string | null;
          created_at: string;
          updated_at: string;
        },
        { organization_id: string; plan_id: string; [key: string]: unknown }
      >;
      onboarding_items: TableDef<
        {
          id: string;
          label: string;
          description: string | null;
          display_order: number;
          is_active: boolean;
        },
        { label: string; description?: string | null; display_order?: number; is_active?: boolean }
      >;
      onboarding_responses: TableDef<
        {
          id: string;
          organization_id: string;
          onboarding_item_id: string;
          completed: boolean;
          completed_at: string | null;
          response_value: string | null;
        },
        {
          organization_id: string;
          onboarding_item_id: string;
          completed?: boolean;
          completed_at?: string | null;
          response_value?: string | null;
        }
      >;
      activity_logs: TableDef<
        {
          id: string;
          organization_id: string | null;
          actor_id: string | null;
          action: string;
          metadata: Record<string, unknown> | null;
          created_at: string;
        },
        {
          organization_id?: string | null;
          actor_id?: string | null;
          action: string;
          metadata?: Record<string, unknown> | null;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      org_member_role: OrgMemberRole;
      plan_type: PlanType;
      billing_cycle: BillingCycle;
      subscription_status: SubscriptionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
