import React from 'react';
import { Story } from '../types';
import { Copy, AlertCircle, Mic, Eye } from './Icons';

interface StoryCardProps {
  story: Story;
  totalStories: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, totalStories }) => {
  const hasLink = !!story.link_sticker_text;
  const isSpoken = !!story.spoken_script;

  const handleCopy = () => {
    let text = `STORY ${story.story_number}/${totalStories} (${story.goal})\n`;
    
    if (isSpoken) {
      text += `🎥 Visual: ${story.visual_direction}\n`;
      text += `🗣️ ROTEIRO: ${story.spoken_script}\n`;
      text += `📝 Legenda: ${story.on_screen_text}\n`;
    } else {
      text += `🖼️ Visual: ${story.visual_direction}\n`;
      text += `📐 Layout: ${story.layout_instruction}\n`;
      text += `📝 Texto Tela: ${story.on_screen_text}\n`;
    }
    
    if (story.link_sticker_text) text += `🔗 Sticker: ${story.link_sticker_text}`;

    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-lg group hover:border-white/10 transition-colors">
      
      {/* Visual Preview / Type Indicator */}
      <div className="relative md:w-1/3 bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 min-h-[300px] md:min-h-auto">
        <div className="relative w-[180px] h-[320px] bg-zinc-800/30 rounded-lg overflow-hidden flex flex-col border border-white/5">
          {/* Background Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
             {isSpoken ? <Mic className="w-16 h-16" /> : <Eye className="w-16 h-16" />}
          </div>

          {/* Simulated Content */}
          <div className="relative z-10 flex-1 p-4 flex flex-col h-full">
            {isSpoken ? (
               // Spoken Preview (Face + Captions)
               <>
                 <div className="flex-1 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-zinc-700/50 flex items-center justify-center border border-white/10">
                      <span className="text-2xl">😊</span>
                    </div>
                 </div>
                 <div className="mt-auto bg-black/60 p-2 rounded text-center backdrop-blur-sm border-l-2 border-pink-500">
                    <p className="text-white font-medium text-[10px] leading-tight">
                      {story.on_screen_text}
                    </p>
                 </div>
               </>
            ) : (
              // Visual Preview (Layout blocks)
              <>
                 <div className="flex-1 flex flex-col gap-2 justify-center">
                    {/* Abstract representation of layout */}
                    <div className="bg-zinc-700/30 p-2 rounded border border-dashed border-zinc-600 text-[8px] text-zinc-400 text-center">
                       {story.layout_instruction || 'Layout customizado'}
                    </div>
                    <p className="text-white font-bold text-sm text-center drop-shadow-md bg-black/40 p-2 rounded">
                      {story.on_screen_text}
                    </p>
                 </div>
              </>
            )}

            {hasLink && (
              <div className="mt-4 bg-white text-black px-3 py-1 rounded text-[10px] font-bold shadow-lg transform rotate-[-2deg] self-center">
                🔗 {story.link_sticker_text}
              </div>
            )}
          </div>
        </div>
        
        {/* Format Badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isSpoken ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' : 'bg-blue-900/30 border-blue-500/30 text-blue-300'}`}>
            {isSpoken ? 'FALADO' : 'VISUAL'}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-pink-500 font-bold text-xs tracking-wider uppercase bg-pink-500/10 px-2 py-1 rounded">
                Story {story.story_number}/{totalStories}
              </span>
              <h3 className="text-white font-bold text-lg mt-2">{story.goal}</h3>
            </div>
            <button 
              onClick={handleCopy}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Copiar Story"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          {isSpoken ? (
            // SPOKEN MODE CONTENT
            <div className="space-y-4">
               <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 relative group-hover:border-pink-500/20 transition-colors">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                    <Mic className="w-3 h-3" />
                    Teleprompter (Leia isto)
                  </p>
                  <p className="text-white text-lg font-medium leading-relaxed">
                    "{story.spoken_script}"
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Legenda na tela</p>
                    <p className="text-zinc-300 text-sm">{story.on_screen_text}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Direção</p>
                    <p className="text-zinc-300 text-sm italic">{story.visual_direction}</p>
                  </div>
               </div>
            </div>
          ) : (
            // VISUAL MODE CONTENT
            <div className="space-y-4">
               <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    Instrução de Layout
                  </p>
                  <p className="text-blue-300 text-sm bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg">
                    {story.layout_instruction || story.visual_direction}
                  </p>
               </div>
               <div>
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Texto Principal</p>
                  <p className="text-white text-lg font-medium">{story.on_screen_text}</p>
               </div>
               <div>
                  <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Direção Visual</p>
                  <p className="text-zinc-300 text-sm">{story.visual_direction}</p>
               </div>
            </div>
          )}

          {hasLink && (
            <div className="bg-pink-900/10 border border-pink-500/20 rounded-lg p-3 flex items-start gap-3 mt-2">
              <AlertCircle className="w-5 h-5 text-pink-500 shrink-0" />
              <div>
                  <p className="text-pink-400 text-xs font-bold uppercase mb-1">Link Sticker</p>
                  <p className="text-white text-sm font-semibold">{story.link_sticker_text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
