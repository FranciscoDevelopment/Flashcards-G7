type DeckOption = {
  id: string;
  title: string;
  count: number;
};

type DeckSelectorProps = {
  decks: DeckOption[];
  onSelectDeck: (deckId: string) => void;
};

export default function DeckSelector({ decks, onSelectDeck }: DeckSelectorProps) {
  return (
    <div className="mt-10 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Elegí qué mazo querés repasar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 overflow-visible">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelectDeck(deck.id)}
            className="deck-card group text-left"
          >
            <span className="deck-card-front">
              <h2 className="text-lg font-bold text-slate-950 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300">
                {deck.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {deck.count} {deck.count === 1 ? 'tarjeta' : 'tarjetas'}
              </p>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}