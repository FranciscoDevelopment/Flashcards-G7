import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    // Inject light mode stylesheet overrides if not already injected
    let styleTag = document.getElementById('theme-override-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'theme-override-styles';
      styleTag.innerHTML = `
        /* Light mode override styling */
        html.light {
          color-scheme: light;
        }

        html.light body,
        html.light .bg-slate-950,
        html.light .bg-slate-950\\/80 {
          background-color: #f8fafc !important; /* slate-50 */
          color: #0f172a !important; /* slate-900 */
        }

        html.light .text-slate-100,
        html.light .text-white,
        html.light h1,
        html.light h2,
        html.light h3,
        html.light h4,
        html.light p.text-slate-200,
        html.light p.text-white {
          color: #0f172a !important;
        }

        html.light .text-slate-400,
        html.light .text-slate-500,
        html.light .text-slate-600,
        html.light p.text-slate-400 {
          color: #475569 !important; /* slate-600 */
        }

        html.light .bg-slate-900\\/10,
        html.light .bg-slate-900\\/20,
        html.light .bg-slate-900\\/40,
        html.light .bg-slate-900 {
          background-color: #f1f5f9 !important; /* slate-100 */
        }

        html.light .border-slate-900,
        html.light .border-slate-800,
        html.light .border-slate-900\\/40,
        html.light .border-slate-900\\/30,
        html.light .border-b {
          border-color: #cbd5e1 !important; /* slate-300 */
        }

        /* Inputs & Form styling */
        html.light input,
        html.light textarea,
        html.light select,
        html.light .bg-slate-950 {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: #cbd5e1 !important;
        }

        html.light input::placeholder,
        html.light textarea::placeholder {
          color: #94a3b8 !important; /* slate-400 */
        }

        html.light .hover\\:bg-slate-900:hover,
        html.light .hover\\:bg-slate-900\\/80:hover {
          background-color: #e2e8f0 !important; /* slate-200 */
          color: #0f172a !important;
        }

        html.light .text-slate-400 {
          color: #475569 !important;
        }

        /* Card 1 in welcome dashboard (indigo styling) */
        html.light .bg-indigo-50 {
          background-color: #e0e7ff !important;
        }

        /* Ambient glows */
        html.light .bg-violet-600\\/5,
        html.light .bg-indigo-600\\/5 {
          background-color: rgba(124, 58, 237, 0.02) !important;
        }
      `;
      document.head.appendChild(styleTag);
    }

    // Apply the class to documentElement
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm ml-1"
      title={theme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-amber-500" />
      ) : (
        <Moon size={16} className="text-violet-500" />
      )}
    </button>
  );
}
