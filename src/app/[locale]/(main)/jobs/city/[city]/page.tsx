import { createLandingRoute } from "@/features/job/lib/landing-route";

const route = createLandingRoute("city");

export const generateMetadata = route.generateMetadata;
export default route.Page;
