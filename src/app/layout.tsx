import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ThemeProvider from "@/app/components/ThemeProvider";
import "./globals.css";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Journalix - Trading Journal",
  description: "Minimalist trading journal dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialDarkMode = true;
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isDarkMode: true }
    });
    if (user) {
      initialDarkMode = user.isDarkMode;
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${hankenGrotesk.variable} h-full antialiased ${initialDarkMode ? 'dark' : 'light'}`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-ink text-slate-50 transition-colors duration-200">
        <ThemeProvider initialDarkMode={initialDarkMode}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
