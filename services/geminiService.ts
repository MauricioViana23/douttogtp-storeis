import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData, SequenceResponse, FormatType } from "../types";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sequence_title: { type: Type.STRING },
    strategy: { type: Type.STRING },
    stories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          story_number: { type: Type.INTEGER },
          goal: { 
            type: Type.STRING, 
            enum: ["Hook", "Engajamento", "Valor", "Prova", "Objeção", "CTA", "Reforço"] 
          },
          on_screen_text: { type: Type.STRING },
          visual_direction: { type: Type.STRING },
          layout_instruction: { type: Type.STRING, nullable: true }, // Onde a imagem fica
          spoken_script: { type: Type.STRING, nullable: true },      // Teleprompter
          cta_line: { type: Type.STRING },
          link_sticker_text: { type: Type.STRING, nullable: true },
        },
        required: ["story_number", "goal", "on_screen_text", "visual_direction", "cta_line", "link_sticker_text"],
      },
    },
  },
  required: ["sequence_title", "strategy", "stories"],
};

export const generateStories = async (formData: FormData): Promise<SequenceResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isSpoken = formData.format === FormatType.SPOKEN;

  const systemInstruction = `Você é o DoutorGPT Stories Maker.
  
  MODO: ${formData.format}
  
  Regras Gerais:
  - Foco: conversão (clique no link).
  - Link sticker: apenas stories finais.
  
  Regras Específicas para o MODO:
  ${isSpoken 
    ? `- GERE um ROTEIRO FALADO no campo 'spoken_script'. O médico vai ler isso para a câmera.
       - IMPORTANTE: O texto deve ser CONVERSACIONAL, ENGAJADOR e NATURAL. Imagine um médico falando diretamente para a câmera com um amigo. Evite linguagem excessivamente formal ou robótica.
       - 'on_screen_text' deve ter apenas legendas curtas ou tópicos para reforçar o que é dito.
       - 'visual_direction' deve ser "Camera Frontal/Selfie".`
    : `- GERE uma SEQUÊNCIA VISUAL (imagens/textos estáticos).
       - Preencha o campo 'layout_instruction' descrevendo EXATAMENTE onde posicionar a imagem e o texto (ex: "Imagem no topo 50%, Texto no fundo preto rodapé").
       - 'spoken_script' deve ser null.`
  }
  
  Responda estritamente com JSON válido no schema.`;

  const userPrompt = `Gere uma sequência de ${formData.length} Stories.
  Formato: ${formData.format}
  Tema: ${formData.topic}
  Público: ${formData.audience}
  Oferta: ${formData.offer}
  Tom: ${formData.tone}
  Estratégia: ${formData.strategy}

  Regras:
  - Se formato for 'Visual', detalhe o layout em 'layout_instruction'.
  - Se formato for 'Falado', escreva o roteiro exato em 'spoken_script' priorizando um tom de conversa natural e direto com a câmera.
  - Link sticker apenas nos stories finais.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as SequenceResponse;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};