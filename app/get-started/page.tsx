import { redirect } from "next/navigation";

// Kept as its own marketing-friendly URL per the brief's route list —
// currently a straight redirect into the registration wizard. If a
// dedicated "get started" landing experience is wanted later (distinct
// copy/CTA framing from /register itself), this is the file to expand.
export default function GetStartedPage() {
  redirect("/register/");
}
