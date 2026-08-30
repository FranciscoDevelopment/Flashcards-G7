import type { Metadata } from 'next';
import CardForm from '../../../features/cards/components/CardForm';

export const metadata: Metadata = {
  title: 'SmartFlash | Editar Tarjeta',
  description: 'Edita una tarjeta de estudio existente.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CardForm />;
}
