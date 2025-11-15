import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WB Ads Dashboard - Аналитика рекламных кампаний Wildberries",
  description: "Аналитический дашборд для работы с рекламными кампаниями Wildberries в реальном времени",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
