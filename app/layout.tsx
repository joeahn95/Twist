import { GeistSans } from "geist/font/sans";
import "./globals.css";
import DeployButton from "../components/HomeButton";
import AuthButton from "../components/AuthButton";
import ChannelsButton from "@/components/ChannelsButton";
import "../utils/firebase";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-14">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <DeployButton />
              <div className="flex justify-between">
                <AuthButton />
                <ChannelsButton />
              </div>
            </div>
          </nav>
          {children}
          <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            Stonks Team Full Stack
          </footer>
        </main>
      </body>
    </html>
  );
}
