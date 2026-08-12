import { describe, it, expect } from "vitest";
import { accountStepSchema, planStepSchema, registerCompleteSchema } from "@/lib/validation/register";

const validAccount = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "(555) 123-4567",
  password: "supersecret1",
  confirmPassword: "supersecret1",
};

describe("accountStepSchema", () => {
  it("accepts a fully valid account step", () => {
    const result = accountStepSchema.safeParse(validAccount);
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords with an error on confirmPassword", () => {
    const result = accountStepSchema.safeParse({ ...validAccount, confirmPassword: "different" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("confirmPassword"))).toBe(true);
    }
  });

  it("rejects a password under 8 characters", () => {
    const result = accountStepSchema.safeParse({ ...validAccount, password: "short", confirmPassword: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = accountStepSchema.safeParse({ ...validAccount, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("planStepSchema", () => {
  it("requires planId to be a real uuid, not an arbitrary client-supplied string", () => {
    const result = planStepSchema.safeParse({ planId: "growth-package", billingCycle: "monthly" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid plan selection with no addons", () => {
    const result = planStepSchema.safeParse({
      planId: "11111111-1111-4111-8111-111111111111",
      billingCycle: "monthly",
    });
    expect(result.success).toBe(true);
  });
});

describe("registerCompleteSchema", () => {
  it("never accepts a raw password field passed alongside account info (server never re-collects credentials)", () => {
    const payload = {
      userId: "11111111-1111-4111-8111-111111111111",
      account: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", phone: "(555) 123-4567" },
      business: {
        businessName: "Acme LLC",
        industry: "Home Services",
        employeeCount: "2-10",
        city: "Austin",
        state: "Texas",
      },
      website: { websiteUrl: "https://acme.example.com", primaryService: "SEO" },
      goals: { mainGoal: "Generate more leads" },
      plan: { planId: "11111111-1111-4111-8111-111111111111", billingCycle: "monthly" },
    };
    const result = registerCompleteSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect("password" in result.data.account).toBe(false);
    }
  });
});
