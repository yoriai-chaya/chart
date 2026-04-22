import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import { Topbar } from "./components/topbar";
import { AppSidebar } from "./components/app-sidebar";
import TailwindIndicator from "./TailwindIndicator";
import { ThemeProvider } from "./components/theme-provider";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "KingFisher Dashboard",
  description: "Dashboard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning style={notoSansJP.style}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0">
              <div className="flex flex-col h-screen bg-page text-foreground">
                <Topbar />
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </SidebarInset>
          </SidebarProvider>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
