import "@/app/globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { getSession } from "@/lib/cookies";


export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}