import type { Metadata } from 'next';
import HomePage from '../views/HomePage';

export const metadata: Metadata = {
  title: 'SmartFlash | Inicio',
  description:
    'Crea, repasa y practica tus tarjetas de estudio. Modo quiz, modo repaso y seguimiento de tu progreso.',
  openGraph: {
    title: 'SmartFlash | Inicio',
    description:
      'Crea, repasa y practica tus tarjetas de estudio. Modo quiz, modo repaso y seguimiento de tu progreso.',
  },
};

export default function Page() {
  return <HomePage />;
}
