import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import FirebaseNotificationSetup from "@/components/FirebaseNotificationSetup";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Kuku Admin Panel",
  description:
    "Kuku is an innovative resale e-commerce platform aimed at revolutionising the buying and selling of pre-owned clothing items and apparels. The platform offers various revenue streams and key features to provide a seamless and sustainable marketplace for users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <FirebaseNotificationSetup/> 
          {children}
          </ClientLayout>
      </body>
    </html>
  );
}
