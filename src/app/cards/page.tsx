import type { Metadata } from 'next';
import CardsPage from '../../views/CardsPage';

export const metadata: Metadata = {
  title: 'SmartFlash | Mis Tarjetas',
  description:
    'Consulta, busca y filtra tus tarjetas de estudio por tema.',
  openGraph: {
    title: 'SmartFlash | Mis Tarjetas',
    description: 'Consulta, busca y filtra tus tarjetas de estudio por tema.',
  },
};

export default function Page() {
  return <CardsPage />;
}
