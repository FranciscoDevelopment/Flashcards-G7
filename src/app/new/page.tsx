import type { Metadata } from 'next';
import CardForm from '../../features/cards/components/CardForm';

export const metadata: Metadata = {
  title: 'SmartFlash | Crear Nueva Tarjeta',
  description: 'Crea una nueva tarjeta de estudio con pregunta, respuesta, tema y dificultad.',
  openGraph: {
    title: 'SmartFlash | Crear Nueva Tarjeta',
    description: 'Crea una nueva tarjeta de estudio con pregunta, respuesta, tema y dificultad.',
  },
};

export default function Page() {
  return <CardForm />;
}
