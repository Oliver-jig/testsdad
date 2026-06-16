'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Spinner } from '@heroui/react';

const STYLES = [
  { id: 'lunar',      label: '🧧 Lunar New Year', color: '#ef4444', glow: '#ef444433', desc: 'red envelopes, lanterns, gold coins, fireworks' },
  { id: 'christmas',  label: '🎄 Christmas',       color: '#22c55e', glow: '#22c55e33', desc: 'Christmas tree, santa hat, snow, presents, stars' },
  { id: 'halloween',  label: '🎃 Halloween',        color: '#f97316', glow: '#f9731633', desc: 'pumpkin, witch hat, bats, spooky dark night' },
  { id: 'valentine',  label: '💝 Valentine',        color: '#ec4899', glow: '#ec489933', desc: 'hearts, roses, love, pink and red romantic' },
  { id: 'easter',     label: '🐣 Easter',           color: '#a78bfa', glow: '#a78bfa33', desc: 'Easter eggs, bunny ears, spring flowers, pastel colors' },
];

const QUICK_PICKS = [
  { emoji: '😴', label: 'Sleepy',   prompt: 'sleeping peacefully with tiny zzz bubbles floating above' },
  { emoji: '🎉', label: 'Party',    prompt: 'celebrating with confetti, party hat, and a tiny noisemaker' },
  { emoji: '😤', label: 'Grumpy',   prompt: 'looking grumpy with crossed arms and steam from ears' },
  { emoji: '💕', label: 'Love',     prompt: 'surrounded by pink hearts, blushing cheeks, holding a heart balloon' },
  { emoji: '🍜', label: 'Hungry',   prompt: 'drooling over a bowl of ramen noodles with starry excited eyes' },
  { emoji: '😭', label: 'Cry',      prompt: 'crying dramatically with giant anime tears' },
  { emoji: '🌈', label: 'Rainbow',  prompt: 'surfing on a rainbow with a big smile and stars all around' },
  { emoji: '🔥', label: 'Cool',     prompt: 'wearing sunglasses, sitting cool with tiny flames and sparkles' },
];

const LOADING_MSGS = [
  'Ding Ding is posing...',
  'Adding sparkles...',
  'Painting whiskers...',
  'Almost ready, meow!',
];

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;
    setLoading(true);
    setError(null);
    setImage(null);
    setLoadingMsg(LOADING_MSGS[0]);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[i]);
    }, 1800);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, style: selectedStyle.label, festivalDesc: selectedStyle.desc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setImage(data.image);
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const download = () => {
    if (!image) return;
    const a = document.createElement('a');
    a.href = image;
    a.download = `ding-ding-cat-${Date.now()}.png`;
    a.click();
  };

  const reset = () => { setImage(null); setPrompt(''); setError(null); };

  const s = selectedStyle;

  return (
    <main className="min-h-screen bg-[#111] py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white">
            🐱 Ding Ding Cat Sticker Generator
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Describe a cat sticker and let AI bring it to life
          </p>
        </div>

        {/* Style selector */}
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Sticker style
          </p>
          <div className="flex gap-2 flex-wrap">
            {STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStyle(st)}
                className="px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
                style={
                  s.id === st.id
                    ? { background: st.color, boxShadow: `0 0 16px ${st.glow}`, color: '#fff', borderColor: 'transparent' }
                    : { background: '#1e1e1e', borderColor: '#2e2e2e', color: '#777' }
                }
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt input */}
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Describe your sticker
          </p>
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
              placeholder="e.g. a cat wearing sunglasses, giving thumbs up"
              disabled={loading}
              className="flex-1 h-12 bg-[#1e1e1e] border border-[#2e2e2e] hover:border-[#444] focus:border-[#555] rounded-xl px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors disabled:opacity-50"
            />
            <Button
              onPress={() => generate()}
              isDisabled={loading || !prompt.trim()}
              className="font-semibold text-white h-12 px-5 shrink-0 flex items-center gap-2"
              style={{ background: s.color, boxShadow: `0 0 18px ${s.glow}` }}
            >
              {loading ? <Spinner size="sm" /> : '✦'} Generate
            </Button>
          </div>
        </div>

        {/* Quick picks */}
        <div>
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-3">
            Quick picks
          </p>
          <div className="flex gap-2 flex-wrap">
            {QUICK_PICKS.map((q) => (
              <button
                key={q.label}
                onClick={() => { setPrompt(q.prompt); generate(q.prompt); }}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-zinc-500 text-xs font-medium hover:border-[#444] hover:text-zinc-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {q.emoji} {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <Card
          className="border-[1.5px] transition-all duration-300 overflow-hidden"
          style={{
            background: '#1a1a1a',
            borderColor: image || loading ? `${s.color}55` : '#2a2a2a',
          }}
        >
          <Card.Content className="flex items-center justify-center py-10 min-h-[260px]">
            <AnimatePresence mode="wait">

              {!loading && !image && !error && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3">
                  <span className="text-4xl opacity-20">🐾</span>
                  <p className="text-sm text-zinc-600">Your sticker will appear here</p>
                </motion.div>
              )}

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 0.55, ease: 'easeInOut' }}
                    className="text-5xl"
                  >🐱</motion.div>
                  <p className="text-sm font-medium" style={{ color: s.color }}>{loadingMsg}</p>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i}
                        animate={{ scale: [1, 1.7, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: s.color }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3">
                  <span className="text-3xl">😿</span>
                  <p className="text-sm font-medium text-red-400">{error}</p>
                  <Button size="sm" variant="ghost" onPress={reset} className="text-zinc-400">
                    Try again
                  </Button>
                </motion.div>
              )}

              {image && !loading && (
                <motion.div key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <img src={image} alt="Generated Ding Ding Cat sticker"
                    className="max-h-64 object-contain rounded-xl" />
                </motion.div>
              )}

            </AnimatePresence>
          </Card.Content>

          {image && !loading && (
            <Card.Footer className="gap-2 px-4 py-3 border-t border-[#2a2a2a]">
              <Button
                fullWidth
                onPress={download}
                className="font-semibold text-white"
                style={{ background: s.color, boxShadow: `0 0 12px ${s.glow}` }}
              >
                ↓ Download sticker
              </Button>
              <Button
                variant="outline"
                onPress={reset}
                className="border-[#333] text-zinc-500 hover:border-[#555] hover:text-zinc-300 shrink-0"
              >
                ↺ New
              </Button>
            </Card.Footer>
          )}
        </Card>

        <p className="text-center text-xs text-zinc-800 pb-2">
          Made with 💕 by tramplus · Powered by Gemini Nano Banana 2
        </p>
      </div>
    </main>
  );
}
