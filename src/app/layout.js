import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sri Venkateswara Kolata Bajana Mandali",
  description: "Traditional devotional music and dance group preserving cultural heritage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="luxury-bg p-0 flex flex-col min-h-screen text-white">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
