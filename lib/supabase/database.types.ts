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
export type PaymentProviderEnum = "stripe" | "paypal" | "wise";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded" | "cancelled";
export type CampaignStage =
  | "audit_benchmark"
  | "strategy"
  | "implementation"
  | "optimization"
  | "reporting"
  | "scaling";
export type CampaignHealth = "on_track" | "needs_attention" | "waiting_for_client" | "reporting";
export type TaskStatus = "planned" | "in_progress" | "waiting_for_client" | "review" | "completed" | "blocked";
export type TicketStatus = "open" | "in_progress" | "waiting_for_client" | "resolved" | "closed";

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
          went_live_at: string | null;
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
          went_live_at?: string | null;
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
      payments: TableDef<
        {
          id: string;
          organization_id: string;
          subscription_id: string | null;
          payment_provider: PaymentProviderEnum;
          status: PaymentStatus;
          amount_cents: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          stripe_invoice_id: string | null;
          paypal_transaction_id: string | null;
          wise_reference: string | null;
          description: string | null;
          paid_at: string | null;
          created_at: string;
        },
        { organization_id: string; payment_provider: PaymentProviderEnum; amount_cents: number; [key: string]: unknown }
      >;
      invoices: TableDef<
        {
          id: string;
          organization_id: string;
          subscription_id: string | null;
          payment_id: string | null;
          invoice_number: string;
          amount_cents: number;
          currency: string;
          status: PaymentStatus;
          pdf_url: string | null;
          issued_at: string;
          due_at: string | null;
          paid_at: string | null;
        },
        { organization_id: string; invoice_number: string; amount_cents: number; [key: string]: unknown }
      >;
      payment_webhook_events: TableDef<
        {
          id: string;
          provider: PaymentProviderEnum;
          event_id: string;
          event_type: string;
          payload: Record<string, unknown> | null;
          processed_at: string | null;
          created_at: string;
        },
        {
          provider: PaymentProviderEnum;
          event_id: string;
          event_type: string;
          payload?: Record<string, unknown> | null;
          processed_at?: string | null;
        }
      >;
      projects: TableDef<
        {
          id: string;
          organization_id: string;
          subscription_id: string | null;
          name: string;
          primary_objective: string | null;
          target_keywords: string[] | null;
          target_cities: string[] | null;
          target_states: string[] | null;
          account_manager_id: string | null;
          stage: CampaignStage;
          health: CampaignHealth;
          started_at: string | null;
          created_at: string;
          updated_at: string;
        },
        { organization_id: string; name: string; [key: string]: unknown }
      >;
      campaign_services: TableDef<
        { id: string; project_id: string; service_name: string; is_active: boolean; created_at: string },
        { project_id: string; service_name: string; is_active?: boolean }
      >;
      milestones: TableDef<
        {
          id: string;
          project_id: string;
          name: string;
          expected_date: string | null;
          completed_at: string | null;
          created_at: string;
        },
        { project_id: string; name: string; [key: string]: unknown }
      >;
      tasks: TableDef<
        {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: TaskStatus;
          client_visible: boolean;
          internal_notes: string | null;
          assigned_to: string | null;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        },
        { project_id: string; title: string; [key: string]: unknown }
      >;
      reports: TableDef<
        {
          id: string;
          organization_id: string;
          project_id: string | null;
          month: string;
          executive_summary: string | null;
          work_completed: string | null;
          recommendations: string | null;
          next_priorities: string | null;
          pdf_url: string | null;
          published_at: string | null;
          created_by: string | null;
          created_at: string;
        },
        { organization_id: string; month: string; [key: string]: unknown }
      >;
      report_metrics: TableDef<
        {
          id: string;
          report_id: string;
          metric_key: string;
          metric_label: string;
          value: number | null;
          value_text: string | null;
          change_direction: string | null;
          created_at: string;
        },
        { report_id: string; metric_key: string; metric_label: string; [key: string]: unknown }
      >;
      keyword_metrics: TableDef<
        {
          id: string;
          project_id: string;
          keyword: string;
          position: number | null;
          previous_position: number | null;
          search_volume: number | null;
          recorded_at: string;
          created_at: string;
        },
        { project_id: string; keyword: string; [key: string]: unknown }
      >;
      traffic_metrics: TableDef<
        {
          id: string;
          project_id: string;
          period_start: string;
          period_end: string;
          organic_sessions: number | null;
          impressions: number | null;
          clicks: number | null;
          avg_position: number | null;
          created_at: string;
        },
        { project_id: string; period_start: string; period_end: string; [key: string]: unknown }
      >;
      lead_metrics: TableDef<
        {
          id: string;
          project_id: string;
          period_start: string;
          period_end: string;
          leads_count: number | null;
          source: string | null;
          created_at: string;
        },
        { project_id: string; period_start: string; period_end: string; [key: string]: unknown }
      >;
      files: TableDef<
        {
          id: string;
          organization_id: string;
          uploaded_by: string | null;
          storage_path: string;
          file_name: string;
          file_type: string | null;
          file_size_bytes: number | null;
          category: string | null;
          created_at: string;
        },
        { organization_id: string; storage_path: string; file_name: string; [key: string]: unknown }
      >;
      conversations: TableDef<
        { id: string; organization_id: string; subject: string | null; created_at: string; updated_at: string },
        { organization_id: string; subject?: string | null }
      >;
      messages: TableDef<
        {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          attachment_file_id: string | null;
          read_at: string | null;
          created_at: string;
        },
        { conversation_id: string; sender_id: string; body: string; [key: string]: unknown }
      >;
      support_tickets: TableDef<
        {
          id: string;
          organization_id: string;
          created_by: string | null;
          category: string;
          subject: string;
          description: string;
          attachment_file_id: string | null;
          status: TicketStatus;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        },
        { organization_id: string; category: string; subject: string; description: string; [key: string]: unknown }
      >;
      notifications: TableDef<
        {
          id: string;
          user_id: string;
          organization_id: string | null;
          type: string;
          title: string;
          body: string | null;
          link_url: string | null;
          read_at: string | null;
          created_at: string;
        },
        { user_id: string; type: string; title: string; [key: string]: unknown }
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
      payment_provider: PaymentProviderEnum;
      payment_status: PaymentStatus;
      campaign_stage: CampaignStage;
      campaign_health: CampaignHealth;
      task_status: TaskStatus;
      ticket_status: TicketStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
