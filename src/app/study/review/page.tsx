import type { Metadata } from 'next';
import ReviewPage from '../../../views/ReviewPage';

export const metadata: Metadata = {
  title: 'SmartFlash | Modo Repaso',
  description: 'Repasa tus tarjetas de estudio por mazo o por todas las tarjetas.',
  openGraph: {
    title: 'SmartFlash | Modo Repaso',
    description: 'Repasa tus tarjetas de estudio por mazo o por todas las tarjetas.',
  },
};

export default function Page() {
  return <ReviewPage />;
}
