import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "WiFi Control Engine",
  description: "Enterprise Captive Portal & Network Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
