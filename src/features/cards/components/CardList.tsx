import { HelpCircle } from 'lucide-react';
import CardItem from './CardItem';
import type { Card } from '../types';

interface CardListProps {
  filteredCards: Card[];
  onDelete: (id: string) => void;
  searchTerm: string;
  selectedTopic: string;
}

export default function CardList({
  filteredCards,
  onDelete,
  searchTerm,
  selectedTopic,
}: CardListProps) {
  return (
    <div className="flex-1 space-y-4">
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-slate-900/5">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <HelpCircle size={20} />
          </div>
          <h4 className="text-lg font-bold text-slate-300">No se encontraron tarjetas</h4>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            {searchTerm || selectedTopic !== 'all' 
              ? 'Intenta modificando los filtros de búsqueda o categoría.' 
              : 'Crea tu primera tarjeta de estudio para empezar.'}
          </p>
        </div>
      )}
    </div>
  );
}
