import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../sharedComponent/Footer";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/context/userProvider";
import Header from "@/sharedComponent/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookMyCenter",
  description: "One platform to discover, verify and book Test, Training, Assessment and Business Centers across India and worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <Header />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
