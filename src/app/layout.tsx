import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import '../index.css';

export const metadata: Metadata = {
  title: 'SmartFlash',
  description: 'Aplicacion de flashcards para estudiar y medir progreso.',
};

const themeInitScript = `
  ( () => {
    try {
      var theme = localStorage.getItem('theme') || 'dark';
      var root = document.documentElement;
      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    } catch (e) {}
  })();
`;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning >
      <head>
        <script dangerouslySetInnerHTML={ {__html: themeInitScript} } />
      </head>

      <body>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1 flex flex-col min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
