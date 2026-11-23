import { createLandingRoute } from "@/features/job/lib/landing-route";

const route = createLandingRoute("level");

export const generateMetadata = route.generateMetadata;
export default route.Page;
