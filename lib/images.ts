// Static imports give Next.js the size and a blur placeholder for each image,
// and it serves them as AVIF/WebP in the right size for each screen.
import hero from "@/assets/images/hero-living-room.jpg";
import family from "@/assets/images/family-tv.jpg";
import devices from "@/assets/images/devices.jpg";
import train from "@/assets/images/train-tablet.jpg";
import stadium from "@/assets/images/stadium.jpg";
import aurora from "@/assets/images/northern-lights.jpg";
import install from "@/assets/images/install-tv.jpg";
import support from "@/assets/images/support-desk.jpg";
import town from "@/assets/images/coastal-town.jpg";
import phone from "@/assets/images/phone-app.jpg";
import shop from "@/assets/images/reseller-shop.jpg";

export const img = { hero, family, devices, train, stadium, aurora, install, support, town, phone, shop };
export type ImgKey = keyof typeof img;
