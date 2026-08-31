import type { Metadata } from 'next';
import ProgressPage from '../../views/ProgressPage';

export const metadata: Metadata = {
  title: 'SmartFlash | Progreso',
  description:
    'Revisa tu racha actual, mejor racha, aciertos, errores e historial de sesiones de estudio.',
  openGraph: {
    title: 'SmartFlash | Progreso',
    description:
      'Revisa tu racha actual, mejor racha, aciertos, errores e historial de sesiones de estudio.',
  },
};

export default function Page() {
  return <ProgressPage />;
}
