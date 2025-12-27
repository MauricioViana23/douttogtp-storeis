import React, { useState, useEffect } from 'react';
import { Zap, Brain, CheckSquare, ShieldAlert, Camera, Sparkles, Mic, Eye } from './components/Icons';
import { StrategyCard } from './components/StrategyCard';
import { StoryCard } from './components/StoryCard';
import { StrategyType, ToneType, FormatType, FormData, SequenceResponse } from './types';
import { generateStories } from './services/geminiService';

const MOCK_DATA: SequenceResponse = {
  sequence_title: "Mock Sequence",
  strategy: "Link Sprint",
  stories: [
    { 
      story_number: 1, 
      goal: "Hook", 
      on_screen_text: "Legenda: Cansaço inexplicável?", 
      visual_direction: "Camera frontal, segurando uma xícara de café", 
      spoken_script: "Você sente aquele cansaço absurdo logo depois do almoço? Aquele que nem o café resolve?",
      cta_line: "Ouça isso",
      layout_instruction: null
    },
    { 
      story_number: 2, 
      goal: "Engajamento", 
      on_screen_text: "Legenda: Pico de Insulina", 
      visual_direction: "Camera frontal", 
      spoken_script: "Isso não é preguiça. É um pico de insulina causado pelo que você comeu.",
      cta_line: "Explicação rápida",
      layout_instruction: null
    },
    { 
      story_number: 3, 
      goal: "CTA", 
      on_screen_text: "Agende sua avaliação", 
      visual_direction: "Camera frontal sorrindo", 
      spoken_script: "Quer descobrir como ter energia o dia todo? Toque no link e agende sua avaliação metabólica.",
      cta_line: "Toque no link",
      link_sticker_text: "Agendar Agora",
      layout_instruction: null
    }
  ]
};

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    audience: '',
    offer: '',
    tone: ToneType.WELCOMING,
    format: FormatType.VISUAL, // Default
    length: 5,
    strategy: null,
  });

  const [result, setResult] = useState<SequenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock initial load
  useEffect(() => {
    const timer = setTimeout(() => {
        setFormData(prev => ({
            ...prev,
            topic: "Jejum Intermitente",
            audience: "Mulheres 40+",
            offer: "Consulta Nutrologia",
            strategy: StrategyType.LINK_SPRINT,
            format: FormatType.SPOKEN
        }));
        setResult(MOCK_DATA);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async () => {
    if (!formData.strategy) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateStories(formData);
      setResult(data);
    } catch (e) {
      setError("Erro ao gerar stories. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.topic && formData.audience && formData.offer && formData.strategy;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 mb-6">
            <Camera className="w-3 h-3 text-pink-500" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">DoutorGPT - IA Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              DoutorGPT
            </span> Stories
          </h1>
          <p className="text-zinc-400 text-lg">Crie sequências de Stories que geram agendamentos.</p>
        </div>

        {/* Input Section */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-2xl mb-8">
          
          {/* Format Selector */}
          <div className="mb-8">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-3">Formato do Story</label>
             <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({...formData, format: FormatType.VISUAL})}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    formData.format === FormatType.VISUAL 
                    ? 'bg-zinc-800 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                    : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  <Eye className={`w-5 h-5 ${formData.format === FormatType.VISUAL ? 'text-pink-500' : ''}`} />
                  <div className="text-left">
                    <div className="text-sm font-bold">Visual</div>
                    <div className="text-[10px] opacity-60">Texto e Imagem na tela</div>
                  </div>
                </button>
                <button
                  onClick={() => setFormData({...formData, format: FormatType.SPOKEN})}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    formData.format === FormatType.SPOKEN 
                    ? 'bg-zinc-800 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  <Mic className={`w-5 h-5 ${formData.format === FormatType.SPOKEN ? 'text-purple-500' : ''}`} />
                  <div className="text-left">
                    <div className="text-sm font-bold">Falado</div>
                    <div className="text-[10px] opacity-60">Vídeo Selfie / Teleprompter</div>
                  </div>
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tema Médico</label>
              <input 
                type="text" 
                placeholder="ex: Resistência à insulina"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder:text-zinc-700"
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Público Alvo</label>
              <input 
                type="text" 
                placeholder="ex: Mulheres 30–45"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder:text-zinc-700"
                value={formData.audience}
                onChange={e => setFormData({...formData, audience: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Oferta / Próximo Passo</label>
              <input 
                type="text" 
                placeholder="Avaliação / Consulta / Check-up"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder:text-zinc-700"
                value={formData.offer}
                onChange={e => setFormData({...formData, offer: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tom</label>
              <select 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                value={formData.tone}
                onChange={e => setFormData({...formData, tone: e.target.value as ToneType})}
              >
                {Object.values(ToneType).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

           <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Tamanho da Sequência</label>
            <div className="inline-flex bg-[#1a1a1a] p-1 rounded-lg border border-white/10">
              {[5, 7, 9, 12].map(n => (
                <button
                  key={n}
                  onClick={() => setFormData({...formData, length: n})}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${formData.length === n ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
             <h2 className="text-lg font-bold text-white">Estratégia</h2>
             <span className="text-xs bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded border border-pink-500/20">Obrigatório</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <StrategyCard 
              type={StrategyType.LINK_SPRINT}
              title="Link Sprint"
              icon={<Zap className="w-5 h-5"/>}
              description="Hook → Dor → Valor → Prova → Objeção → CTA"
              isSelected={formData.strategy === StrategyType.LINK_SPRINT}
              onClick={() => setFormData({...formData, strategy: StrategyType.LINK_SPRINT})}
              isCritical
            />
            <StrategyCard 
              type={StrategyType.QUIZ_RESULT}
              title="Quiz → Link"
              icon={<Brain className="w-5 h-5"/>}
              description="Pergunta → Insight → Agendar"
              isSelected={formData.strategy === StrategyType.QUIZ_RESULT}
              onClick={() => setFormData({...formData, strategy: StrategyType.QUIZ_RESULT})}
            />
             <StrategyCard 
              type={StrategyType.CHECKLIST}
              title="Checklist"
              icon={<CheckSquare className="w-5 h-5"/>}
              description="Lista rápida → Link final"
              isSelected={formData.strategy === StrategyType.CHECKLIST}
              onClick={() => setFormData({...formData, strategy: StrategyType.CHECKLIST})}
            />
             <StrategyCard 
              type={StrategyType.MYTH_TRUTH}
              title="Mito x Verdade"
              icon={<ShieldAlert className="w-5 h-5"/>}
              description="Quebra crença → Link"
              isSelected={formData.strategy === StrategyType.MYTH_TRUTH}
              onClick={() => setFormData({...formData, strategy: StrategyType.MYTH_TRUTH})}
            />
             <StrategyCard 
              type={StrategyType.BTS}
              title="Bastidores"
              icon={<Camera className="w-5 h-5"/>}
              description="Processo → Convite"
              isSelected={formData.strategy === StrategyType.BTS}
              onClick={() => setFormData({...formData, strategy: StrategyType.BTS})}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-12">
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || isLoading}
            className={`
              w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all
              ${!isFormValid || isLoading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-blue-500/20'
              }
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Sequência
              </>
            )}
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Sequência Gerada</h3>
                <p className="text-zinc-500 text-sm">
                  Estratégia: <span className="text-pink-400">{result.strategy}</span> • 
                  Formato: <span className="text-zinc-300">{formData.format}</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {result.stories.map((story) => (
                <StoryCard 
                  key={story.story_number} 
                  story={story} 
                  totalStories={result.stories.length}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
