import { NextStep, NextStepProvider, Tour } from "nextstepjs";
import { Toaster } from "@/components/ui/sonner";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Mednow - Medical appointments",
};

const steps: Tour[] = [
  {
    tour: "bookingTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome to Mednow",
        content: <p>This tour will help you to test this app and its main features.</p>,
        // showSkip: true,
        showControls: true,
      },
      {
        icon: "🩺",
        title: "Book an appointment",
        content: <p>Start by booking an appointment</p>,
        selector: "#step-book",
        side: "right",
        showSkip: true,
        // showControls: true,
      },
      {
        icon: "⌨️",
        title: "Auto-type",
        content: <p>Use some help to fill the required fields.</p>,
        selector: "#step-testing-option",
        side: "bottom",
        showSkip: true,
      },
      {
        icon: "📩",
        title: "Email",
        content: <p>Receive all the booking information in your email.</p>,
        selector: "#step-email-calendar",
        side: "top",
        // showSkip: true,
        showControls: true,
      },
      {
        icon: "🔒",
        title: "Dashboard",
        content: <p>And do not forget to take a look at our fully functional dashboard</p>,
        selector: "#step-dashboard",
        side: "top-left",
        pointerPadding: 15,
        // showSkip: true,
        showControls: true,
      },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-none">
      <body className={outfit.className}>
        <NextStepProvider>
          <NextStep steps={steps} disableConsoleLogs>
            {children}
          </NextStep>
        </NextStepProvider>
        <Toaster />
      </body>
    </html>
  );
}
