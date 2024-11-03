import TTSSelectionButton from "@/components/TTSSelectionButton";
import PollyProvider from "@/features/tts/providers/PollyProvider";
import TTSSelectionProvider from "@/features/tts/providers/TTSSelectionProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../assets/globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TTS + Highlight",
  description: "Text-to-Speech with Text-Selection by Frederik Nielsen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
      >
        <TTSSelectionProvider>
          <PollyProvider>
            <header className="bg-gray-700 sticky top-0">
              <div className="container p-4 mx-auto flex justify-between">
                <h1>TTS with highlight</h1>
                <TTSSelectionButton />
              </div>
            </header>
            <main className="grow">
              <div className="container p-4 mx-auto">{children}</div>
            </main>
            <footer className=" bg-gray-900">
              <div className="container p-4 mx-auto">
                © {new Date().getFullYear()} Frederik Nielsen
              </div>
            </footer>
          </PollyProvider>
        </TTSSelectionProvider>
      </body>
    </html>
  );
}
