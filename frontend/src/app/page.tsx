import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.config";

// The dashboard guard sends signed-out users on to /login.
export default function HomePage() {
  redirect(ROUTES.dashboard);
}
