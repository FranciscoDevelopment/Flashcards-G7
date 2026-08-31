import type { Metadata } from 'next';
import QuizPage from '../../../views/QuizPage';

export const metadata: Metadata = {
  title: 'SmartFlash | Modo Quiz',
  description: 'Pon a prueba tus tarjetas de estudio en modo quiz con registro de aciertos y errores.',
  openGraph: {
    title: 'SmartFlash | Modo Quiz',
    description:
      'Pon a prueba tus tarjetas de estudio en modo quiz con registro de aciertos y errores.',
  },
};

export default function Page() {
  return <QuizPage />;
}
