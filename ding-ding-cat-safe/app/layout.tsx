import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ding Ding Cat Sticker Generator',
  description: 'Describe a cat sticker and let AI bring it to life.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#111] min-h-screen">
        {children}
      </body>
    </html>
  );
}
