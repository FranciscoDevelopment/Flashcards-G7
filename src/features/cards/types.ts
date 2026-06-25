export type CardDifficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  /** Identificador único de la tarjeta */
  id: string;

  /** Pregunta o concepto en el anverso */
  question: string;

  /** Respuesta o detalle en el reverso */
  answer: string;

  /** Tema, categoría o etiqueta al que pertenece (ej. "React", "Hardware", "Cisco") */
  topic: string;

  /** Nivel de dificultad establecido por el usuario */
  difficulty: CardDifficulty;

  /** Número de aciertos en el modo Quiz */
  hits: number;

  /** Número de fallos en el modo Quiz */
  misses: number;

  /** Historial de respuestas individuales (D3 - últimas respuestas en orden cronológico) */
  history: ('hit' | 'miss')[];

  /** Fecha de creación de la tarjeta (Formato ISO String) */
  createdAt: string;

  /** Fecha del último repaso (Formato ISO String, opcional) */
  lastReviewedAt?: string;
}
