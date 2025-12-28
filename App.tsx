
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene3D } from './components/Scene3D';
import { Step, CardData } from './types';

const APPRECIATION_CARDS: CardData[] = [
  { title: "Success in all your endeavors", icon: "🚀", color: "from-blue-500/20 to-purple-500/20" },
  { title: "Brand new opportunities ahead", icon: "✨", color: "from-purple-500/20 to-pink-500/20" },
  { title: "Nothing but the best for you", icon: "🌟", color: "from-pink-500/20 to-orange-500/20" }
];

// Cheerful background music URL
const MUSIC_URL = "bgg.mp3"; 

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.Welcome);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const nextStep = useCallback(() => {
    // Attempt to play on first click if not already playing
    if (step === Step.Welcome && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
      setIsMuted(false);
    }
    
    if (step < Step.Final) {
      setStep(prev => prev + 1);
      
      // Fire small confetti on some steps
      if (step === Step.Wish) {
        fireConfetti(0.2);
      }
    }
  }, [step]);

  const fireConfetti = (scalar = 1) => {
    // @ts-ignore
    window.confetti({
      particleCount: 150 * scalar,
      spread: 70 * scalar,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#fbbf24', '#3b82f6'],
      disableForReducedMotion: true
    });
  };

  const openGift = () => {
    setIsGiftOpen(true);
    fireConfetti(1.5);
    setTimeout(() => {
      nextStep();
    }, 1500);
  };

  const handleFinalRedirect = () => {
    window.open('https://pavneet-portfolio-olive.vercel.app/', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden selection:bg-pink-500/30">
      <Scene3D currentStep={step} isGiftOpen={isGiftOpen} />

      {/* Music Control */}
      {step > Step.Welcome && (
        <button 
          onClick={toggleMusic}
          className="fixed top-6 right-6 z-50 p-4 rounded-full glass hover:scale-110 transition-all group"
        >
          {isMuted ? '🔈' : '🔊'}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform" />
        </button>
      )}

      <main className="relative z-10 w-full max-w-4xl px-6 text-center">
        <AnimatePresence mode="wait">
          {step === Step.Welcome && (
            <motion.div
              key="welcome"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter">
                Hi <span className="text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500">Pavneet</span> ✨
              </motion.div>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 font-light max-w-lg mx-auto">
                Ready for a little celebration? I built this interactive space just for you.
              </motion.p>
              <motion.button
                variants={itemVariants}
                onClick={nextStep}
                className="group relative px-10 py-4 rounded-full bg-white text-black font-extrabold hover:scale-110 transition-all neon-glow overflow-hidden"
              >
                <span className="relative z-10">Start the Magic ✨</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 translate-y-full group-hover:translate-y-0 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {step === Step.Wish && (
            <motion.div
              key="wish"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-8"
            >
              <h1 className="text-7xl md:text-9xl font-black leading-none drop-shadow-2xl">
                <span className="block text-white">HAPPY</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-600 font-cursive py-4">
                  Birthday!
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl text-purple-200 font-semibold"
              >
                Wishing you the most amazing year ever, Pavnnet! 🎈
              </motion.p>
              <div className="pt-10">
                <button
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl border border-white/20 glass hover:bg-white/20 transition-all font-bold tracking-widest uppercase text-sm"
                >
                  Continue ➔
                </button>
              </div>
            </motion.div>
          )}

          {step === Step.Apology && (
            <motion.div
              key="apology"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-xl mx-auto space-y-8 glass p-10 md:p-14 rounded-[2.5rem] border-pink-500/20 shadow-2xl shadow-pink-500/10"
            >
              <div className="text-6xl animate-bounce">😅</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-pink-200">
                Better Late Than Never!
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm sorry this is reaching you a bit late. But a special person deserves a special wish, no matter the timing!
              </p>
              <button
                onClick={nextStep}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black hover:opacity-90 transition-all shadow-xl"
              >
                No Worries! 😊
              </button>
            </motion.div>
          )}

          {step === Step.Appreciation && (
            <motion.div
              key="appreciation"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-12"
            >
              <motion.h2 variants={itemVariants} className="text-5xl font-black">Success Awaits! 🚀</motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {APPRECIATION_CARDS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className={`p-10 rounded-3xl glass bg-gradient-to-br ${card.color} border-white/10 flex flex-col items-center space-y-6 transition-all cursor-default relative overflow-hidden`}
                  >
                    <div className="text-6xl mb-2">{card.icon}</div>
                    <p className="text-xl font-bold leading-tight">{card.title}</p>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full" />
                  </motion.div>
                ))}
              </div>
              <motion.button
                variants={itemVariants}
                onClick={nextStep}
                className="px-12 py-5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-black tracking-widest text-lg transition-all shadow-2xl shadow-indigo-600/40"
              >
                Show Me The Gift 🎁
              </motion.button>
            </motion.div>
          )}

          {step === Step.Gift && (
            <motion.div
              key="gift"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-40"
            >
              <div className="h-48" /> {/* Offset for 3D Gift */}
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                  One last surprise...
                </h2>
                {!isGiftOpen && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openGift}
                    className="px-16 py-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-2xl font-black uppercase tracking-tighter neon-glow"
                  >
                    Click to Open 💖
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {step === Step.Final && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 glass p-12 md:p-20 rounded-[4rem] border-white/20 relative"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-7xl">🎉</div>
              <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                Surprise!
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                I've set up a personalized digital space for you. It's a small token of appreciation for being a great friend!
              </p>
              <div className="pt-4">
                <button
                  onClick={handleFinalRedirect}
                  className="group relative px-16 py-8 rounded-3xl bg-white text-black text-3xl font-black transition-all hover:tracking-widest"
                >
                  Enter Your Space ➔
                  <div className="absolute inset-0 rounded-3xl bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </button>
              </div>
              <p className="text-pink-400 font-bold text-lg animate-pulse">
                Happy Birthday, Pavnnet! Enjoy your day to the fullest! 🎂✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Track */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 glass px-6 py-3 rounded-full">
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            onClick={() => s < step && setStep(s as Step)}
            className={`h-2.5 rounded-full transition-all duration-700 cursor-pointer ${
              step === s ? 'w-12 bg-gradient-to-r from-pink-500 to-purple-500' : 'w-2.5 bg-white/20'
            }`}
          />
        ))}
      </div>
      
      {/* Dynamic Background Blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[150px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.3, 0.1] 
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[150px] rounded-full pointer-events-none" 
      />
    </div>
  );
};

export default App;
