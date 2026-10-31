import MisfiledSheet from "@/components/site/MisfiledSheet";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function SiteNotFound() {
  return <MisfiledSheet />;
}
