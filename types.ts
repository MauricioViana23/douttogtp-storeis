export enum StrategyType {
  LINK_SPRINT = 'Link Sprint',
  QUIZ_RESULT = 'Quiz → Resultado',
  CHECKLIST = 'Checklist Salvável',
  MYTH_TRUTH = 'Mito → Verdade',
  BTS = 'Bastidores/Processo'
}

export enum ToneType {
  DIRECT = 'Direto',
  WELCOMING = 'Acolhedor',
  PROVOCATIVE = 'Provocativo',
  PREMIUM = 'Premium'
}

export enum FormatType {
  VISUAL = 'Visual (Texto/Imagem)',
  SPOKEN = 'Falado (Teleprompter)'
}

export interface Story {
  story_number: number;
  goal: "Hook" | "Engajamento" | "Valor" | "Prova" | "Objeção" | "CTA" | "Reforço";
  on_screen_text: string;
  visual_direction: string;
  layout_instruction?: string | null; // Novo: Para modo visual
  spoken_script?: string | null;      // Novo: Para modo falado
  cta_line: string;
  link_sticker_text?: string | null;
}

export interface SequenceResponse {
  sequence_title: string;
  strategy: string;
  stories: Story[];
}

export interface FormData {
  topic: string;
  audience: string;
  offer: string;
  tone: ToneType;
  format: FormatType; // Novo campo
  length: number;
  strategy: StrategyType | null;
}
