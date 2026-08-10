// web-client/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar"; // Adjust import path if necessary
import NotificationListener from "@/components/NotificationListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniWorkSL",
  description: "Student Gig Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Authenticate user and fetch role securely on the server
  const { userId } = await auth();
  let userRole: "STUDENT_EARNER" | "TASK_POSTER" | "CORPORATE_CLIENT" = "STUDENT_EARNER";

  if (userId) {
    try {
      const backendRes = await fetch(`http://127.0.0.1:8000/api/v1/auth/user/clerk/${userId}`, {
        next: { revalidate: 0 }
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.role) {
          userRole = data.role;
        }
      }
    } catch (err) {
      console.error("Layout ecosystem communication error:", err);
    }
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {/* Global Navbar injection */}
          <Navbar userRole={userRole} />
          
          {/* Page Content */}
          <main className="flex-1 flex flex-col">
            <NotificationListener />
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}