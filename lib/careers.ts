export type JobStatus = "hiring" | "coming-soon";

export type Job = {
  slug: string;
  title: string;
  status: JobStatus;
  location: string;
  type: string;
  oneLiner: string;
  datePosted?: string; // ISO date — only set once a role is actually hiring
  /** Rich content, only meaningful for status: "hiring" roles with a real brief. */
  content?: {
    intro: string;
    responsibilities: string[];
    lookingFor: string[];
    compensation: { intro: string; bullets: string[]; closing: string };
    whyJoin: string[];
    performanceExpectations: string[];
    howToApply: { intro: string; bullets: string[] };
    closing: string;
  };
};

export const JOBS: Job[] = [
  {
    slug: "full-cycle-sales-closer",
    title: "Full-Cycle Sales Closer",
    status: "hiring",
    location: "Remote (Anywhere) — US Shift Schedule",
    type: "Commission-based",
    oneLiner:
      "Own the full sales cycle for the US market — from your own prospecting through to a closed, signed client.",
    datePosted: "2026-08-14",
    content: {
      intro:
        "Acendia is expanding its sales team and is looking for confident, motivated, and results-driven Full-Cycle Sales Closers for the US market who can generate opportunities, speak directly with business owners, present solutions, and close deals. This is not a traditional appointment-setting role. We need sales professionals with a closer's mentality — people who can build rapport with decision-makers, identify business challenges, communicate value clearly, and confidently guide prospects toward a decision for the US market.",
      responsibilities: [
        "Conduct outbound calls and engage directly with business owners.",
        "Follow up with warm leads generated through Facebook advertising and other marketing channels.",
        "Prospect and generate your own qualified sales opportunities.",
        "Qualify potential clients based on their needs, goals, budget, and decision-making authority.",
        "Book and manage your own sales appointments.",
        "Present Acendia's SEO, website development, and digital growth solutions.",
        "Handle objections, negotiate professionally, and close deals.",
        "Maintain accurate prospect and sales activity records in the CRM.",
        "Coordinate a smooth client handover to the account management and delivery teams.",
        "Maintain relationships with prospects throughout the sales process.",
      ],
      lookingFor: [
        "Previous experience in B2B sales, appointment setting, business development, account management, or closing.",
        "Strong experience speaking with business owners and senior decision-makers.",
        "A confident, consultative, and professional communication style.",
        "The ability to manage the complete sales process — from initial contact to signed agreement.",
        "Strong objection-handling, negotiation, and closing skills.",
        "Self-motivated and comfortable working in a performance-based environment.",
        "Reliable computer, internet connection, headset, and quiet working environment.",
        "Amenable to US Shift Schedule (EST/PST/MST/CST).",
        "Experience selling SEO, web development, digital marketing, SaaS, or professional services is highly desirable.",
        "Excellent spoken and written English.",
      ],
      compensation: {
        intro: "This is a commission-based position with no fixed salary. Successful candidates will receive:",
        bullets: [
          "A fee for every qualified appointment booked and attended.",
          "A competitive commission for every successfully closed client.",
          "A higher earning potential than a traditional appointment-setting structure.",
          "Warm leads from Acendia's advertising campaigns.",
          "The opportunity to generate and close your own outbound prospects.",
          "Ongoing sales support, product training, scripts, systems, and marketing resources.",
        ],
        closing:
          "The appointment fee provides regular earnings while you build your pipeline, but the majority of your earning potential will come from successfully closing deals.",
      },
      whyJoin: [
        "Work remotely from anywhere.",
        "Sell high-value services that help businesses increase their online visibility, leads, and revenue.",
        "Manage the complete sales journey instead of simply passing appointments to another closer.",
        "Unlimited commission-based earning potential.",
        "Join a growing international digital agency with opportunities for long-term advancement.",
      ],
      performanceExpectations: [
        "Generate qualified sales conversations.",
        "Book and attend quality appointments.",
        "Maintain an active and organised pipeline.",
        "Follow up professionally and consistently.",
        "Meet agreed appointment and sales targets.",
        "Close suitable clients and complete an accurate handover to the delivery team.",
      ],
      howToApply: {
        intro: "Submit the application below with your CV, and please include:",
        bullets: [
          "A brief introduction outlining your B2B sales experience.",
          "Details of the products or services you have previously sold.",
          "Your experience speaking with business owners or decision-makers.",
          "Your average appointment-setting or closing performance.",
          "A link to a short voice or video introduction demonstrating your communication skills (optional but recommended).",
          "Your availability to begin.",
        ],
      },
      closing:
        "Join Acendia and take ownership of the entire sales process — from the first conversation to closing the sale.",
    },
  },
  {
    slug: "web-developer",
    title: "Web Developer",
    status: "coming-soon",
    location: "Remote (Anywhere)",
    type: "Coming soon",
    oneLiner: "Build fast, modern, conversion-focused websites for US businesses.",
  },
  {
    slug: "social-media-manager",
    title: "Social Media Manager",
    status: "coming-soon",
    location: "Remote (Anywhere)",
    type: "Coming soon",
    oneLiner: "Plan and run social content and campaigns for Acendia's US clients.",
  },
];

export function getJob(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}
