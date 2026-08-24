import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import '../index.css';

export const metadata: Metadata = {
  title: 'SmartFlash',
  description: 'Aplicacion de flashcards para estudiar y medir progreso.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 flex flex-col min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
