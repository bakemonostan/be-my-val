import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "motion/react";
import confettiLib from "canvas-confetti";
import toast, { Toaster } from "react-hot-toast";

// Memoized Heart Component
const FloatingHeart = memo(
  ({
    heart,
  }: {
    heart: { id: number; left: number; delay: number; duration: number };
  }) => (
    <motion.div
      className="absolute text-2xl sm:text-3xl md:text-4xl pointer-events-none"
      style={{ left: `${heart.left}%`, bottom: "-10%" }}
      animate={{
        y: [0, -1200],
        x: [0, Math.sin(heart.id) * 50],
        rotate: [0, 360],
      }}
      transition={{
        duration: heart.duration,
        repeat: Infinity,
        delay: heart.delay,
        ease: "linear",
      }}
    >
      ❤️
    </motion.div>
  )
);
FloatingHeart.displayName = "FloatingHeart";

// Memoized Sparkle Component
const Sparkle = memo(
  ({
    sparkle,
  }: {
    sparkle: { id: number; left: number; top: number; delay: number };
  }) => (
    <motion.div
      className="absolute text-yellow-300 text-sm sm:text-base"
      style={{ left: `${sparkle.left}%`, top: `${sparkle.top}%` }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: sparkle.delay,
      }}
    >
      ✨
    </motion.div>
  )
);
Sparkle.displayName = "Sparkle";

// Memoized Media Component
interface MediaItem {
  id: number;
  src: string;
  isVideo: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
  rotate: number;
  size: number;
}

const FloatingMedia = memo(
  ({
    media,
    index,
    mediaOffsets,
    isMobile,
  }: {
    media: MediaItem;
    index: number;
    mediaOffsets: { x: number; y: number }[];
    isMobile: boolean;
  }) => (
    <motion.div
      id={`media-${media.id}`}
      className="absolute pointer-events-none w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[120px] md:h-[120px]"
      style={{
        left: `${media.startX}%`,
        top: `${media.startY}%`,
      }}
      animate={{
        left: `${media.endX}%`,
        top: `${media.endY}%`,
        x: mediaOffsets[index]?.x || 0,
        y: mediaOffsets[index]?.y || 0,
        rotate: [media.rotate, media.rotate + 360],
      }}
      transition={{
        duration: media.duration,
        repeat: Infinity,
        repeatType: "reverse",
        delay: media.delay,
        ease: "easeInOut",
        x: { type: "spring", stiffness: 300, damping: 20 },
        y: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-full"
        style={{
          boxShadow:
            "0 0 1.875rem rgba(255, 105, 180, 0.8), 0 0 3.75rem rgba(255, 20, 147, 0.6)",
          border: ".1875rem solid rgba(255, 182, 193, 0.5)",
        }}
      >
        {media.isVideo ? (
          <video
            src={media.src}
            autoPlay
            loop
            muted
            playsInline
            preload={isMobile ? "none" : "auto"}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media.src}
            alt="memory"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </motion.div>
  )
);
FloatingMedia.displayName = "FloatingMedia";

import image1 from "./assets/WhatsApp Image 2026-02-06 at 12.07.24 (1).jpeg";
import image2 from "./assets/WhatsApp Image 2026-02-06 at 12.07.24.jpeg";
import image3 from "./assets/WhatsApp Image 2026-02-06 at 12.11.09.jpeg";
import image4 from "./assets/WhatsApp Image 2026-02-06 at 12.11.43.jpeg";
import image5 from "./assets/WhatsApp Image 2026-02-06 at 12.11.55 (1).jpeg";
import image6 from "./assets/WhatsApp Image 2026-02-06 at 12.11.55.jpeg";
import image7 from "./assets/WhatsApp Image 2026-02-06 at 12.11.56 (1).jpeg";
import image8 from "./assets/WhatsApp Image 2026-02-06 at 12.11.56.jpeg";
import video1 from "./assets/WhatsApp Video 2026-02-06 at 12.07.25.mp4";
import video2 from "./assets/WhatsApp Video 2026-02-06 at 12.17.29.mp4";
import video3 from "./assets/WhatsApp Video 2026-02-06 at 12.17.51.mp4";
import video4 from "./assets/WhatsApp Video 2026-02-06 at 12.18.49.mp4";
import video5 from "./assets/WhatsApp Video 2026-02-06 at 12.20.52.mp4";

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mediaOffsets, setMediaOffsets] = useState<{ x: number; y: number }[]>(
    []
  );
  const [isMobile, setIsMobile] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const noDodgeCountRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate floating hearts - fewer on mobile
  const [hearts] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }))
  );

  // Generate sparkles - fewer on mobile
  const [sparkles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }))
  );

  // Generate floating media (images and video) - fewer on mobile
  const [floatingMedia] = useState(() => {
    const allMedia = [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      video1,
      video2,
      video3,
      video4,
      video5,
    ];
    // Use fewer items on mobile for performance
    const media = window.innerWidth < 768 ? allMedia.slice(0, 6) : allMedia;
    const items = media.map((src, i) => ({
      id: i,
      src,
      isVideo: src.endsWith(".mp4"),
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      endX: Math.random() * 100,
      endY: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      rotate: Math.random() * 360,
      size: 100 + Math.random() * 80,
    }));
    return items;
  });

  // Track mouse position globally
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Calculate avoidance for media items - optimized for mobile
  useEffect(() => {
    // Skip collision detection on mobile for better performance
    if (isMobile) {
      return;
    }

    const interval = setInterval(() => {
      const newOffsets = floatingMedia.map((media, index) => {
        const mediaElement = document.getElementById(`media-${media.id}`);
        if (!mediaElement) return mediaOffsets[index] || { x: 0, y: 0 };

        const rect = mediaElement.getBoundingClientRect();
        const mediaCenterX = rect.left + rect.width / 2;
        const mediaCenterY = rect.top + rect.height / 2;

        let offsetX = 0;
        let offsetY = 0;

        // Avoid cursor
        const distanceFromCursor = Math.sqrt(
          Math.pow(mousePos.x - mediaCenterX, 2) +
            Math.pow(mousePos.y - mediaCenterY, 2)
        );
        const cursorThreshold = 200;

        if (distanceFromCursor < cursorThreshold) {
          const angle = Math.atan2(
            mediaCenterY - mousePos.y,
            mediaCenterX - mousePos.x
          );
          const pushStrength = (cursorThreshold - distanceFromCursor) / 2;
          offsetX += Math.cos(angle) * pushStrength;
          offsetY += Math.sin(angle) * pushStrength;
        }

        return { x: offsetX, y: offsetY };
      });

      setMediaOffsets(newOffsets);
    }, 100); // Slower interval for better performance

    return () => clearInterval(interval);
  }, [floatingMedia, mousePos, mediaOffsets, isMobile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Unmute and ensure playback
    const startAudio = async () => {
      audio.muted = false;
      audio.volume = 1;
      try {
        await audio.play();
      } catch {
        // If unmuted autoplay fails, try muted then unmute
        audio.muted = true;
        await audio.play();
        audio.muted = false;
      }
    };

    startAudio();

    // Play on any user interaction (click, tap, mouse move)
    const playOnInteraction = () => {
      if (audio.paused) {
        audio.muted = false;
        audio.volume = 1;
        audio.play().catch(() => {});
      }
    };

    // Handle page visibility to resume playback
    const handleVisibility = () => {
      if (!document.hidden && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("click", playOnInteraction);
    document.addEventListener("touchstart", playOnInteraction);
    document.addEventListener("mousemove", playOnInteraction);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("click", playOnInteraction);
      document.removeEventListener("touchstart", playOnInteraction);
      document.removeEventListener("mousemove", playOnInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!buttonRef.current || !containerRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      let clientX: number;
      let clientY: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const distanceX = clientX - buttonCenterX;
      const distanceY = clientY - buttonCenterY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Smaller threshold on mobile for better UX
      const threshold = isMobile ? 150 : 250;

      if (distance < threshold) {
        const angle = Math.atan2(distanceY, distanceX);

        // Calculate max boundaries
        const maxX = (containerRect.width - buttonRect.width) / 2;
        const maxY = (containerRect.height - buttonRect.height) / 2;

        // Jump to the opposite edge - all the way!
        const newX = -Math.cos(angle) * maxX;
        const newY = -Math.sin(angle) * maxY;

        setPosition({ x: newX, y: newY });

        // Track dodges and show random sweet messages every 5th interval
        noDodgeCountRef.current += 1;
        const count = noDodgeCountRef.current;

        // Sweet messages to show randomly
        const sweetMessages = [
          "💔 You are breaking my heart 😢",
          "😭 Come on Pookie 😭",
          "🧎 Should I kneel down? 😭😭",
          "🥺 Please baby, just one chance 🥺",
          "💕 I promise to make you happy 💕",
          "😢 Don't do this to me 😢",
          "🌹 You're my everything 🌹",
          "💖 I'll wait forever for you 💖",
          "💞 Just say yes, pretty please 💞",
          "✨ You're the one I've been waiting for ✨",
        ];

        // Show random message every 5th dodge
        if (count % 5 === 0) {
          const randomMessage =
            sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
          toast(randomMessage, {
            duration: 3000,
            position: "bottom-center",
            style: {
              background: "#ef4444",
              color: "#fff",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              borderRadius: "9999px",
              padding: "12px 24px",
            },
          });
        }
      }
    },
    [isMobile]
  );

  const handleYesClick = useCallback(() => {
    setShowCelebration(true);

    // Massive confetti explosion!
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: ["#ff1493", "#ff69b4", "#ff85c1", "#ffc0cb", "#ff6b9d"],
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = isMobile ? 30 : 50;

      // Multiple confetti bursts from different positions
      confettiLib({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confettiLib({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, [isMobile]);

  // Memoize sliced arrays to prevent re-computation
  const visibleHearts = useMemo(
    () => hearts.slice(0, isMobile ? 15 : 30),
    [hearts, isMobile]
  );
  const visibleSparkles = useMemo(
    () => sparkles.slice(0, isMobile ? 10 : 20),
    [sparkles, isMobile]
  );

  // Generate celebration confetti - fewer on mobile
  const [confetti] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      emoji: ["🎉", "💕", "❤️", "✨", "🎊", "💖"][
        Math.floor(Math.random() * 6)
      ],
    }))
  );

  return (
    <section className="relative flex flex-col items-center justify-center bg-linear-to-br from-pink-100 via-rose-100 to-red-100 h-screen px-5 overflow-hidden">
      {/* Toast Container */}
      <Toaster />

      {/* Audio player - A Thousand Years by Christina Perri */}
      <audio ref={audioRef} autoPlay loop muted>
        <source
          src="/Christina Perri - A Thousand Years [Official Music Video] - Christina Perri (youtube).mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Floating hearts - fewer on mobile */}
      {visibleHearts.map((heart) => (
        <FloatingHeart key={heart.id} heart={heart} />
      ))}

      {/* Sparkles - fewer on mobile */}
      {visibleSparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} sparkle={sparkle} />
      ))}

      {/* Floating media (images and video) with heart shape and glow */}
      {floatingMedia.map((media, index) => (
        <FloatingMedia
          key={media.id}
          media={media}
          index={index}
          mediaOffsets={mediaOffsets}
          isMobile={isMobile}
        />
      ))}

      {/* Main content */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 z-10 relative px-4 text-center"
        style={{
          fontFamily: "'Pacifico', cursive",
          background:
            "linear-gradient(45deg, #c71585, #db7093, #c71585, #db7093)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter:
            "drop-shadow(0 0 20px rgba(199, 21, 133, 0.8)) drop-shadow(0 0 40px rgba(219, 112, 147, 0.6)) drop-shadow(0 0 60px rgba(199, 21, 133, 0.4))",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        Be My Valentine? 💕
      </motion.h1>

      <div
        ref={containerRef}
        className="relative max-w-[45.75rem] p-3 sm:p-5 w-full mx-4 min-h-[20rem] sm:min-h-[25rem] md:min-h-[30rem] border-2 sm:border-4 border-pink-300 rounded-2xl flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-2xl touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        <button
          onClick={handleYesClick}
          className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 text-xl sm:text-2xl md:text-3xl font-bold text-white bg-linear-to-r from-pink-500 to-red-500 rounded-full shadow-lg hover:from-pink-600 hover:to-red-600 transition-all active:scale-95"
        >
          YES 💖
        </button>
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <button
            ref={buttonRef}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-full shadow-lg select-none bg-gray-200 text-gray-600 pointer-events-none"
          >
            NO 😢
          </button>
        </motion.div>
      </div>

      <p className="mt-4 sm:mt-6 text-pink-600 text-base sm:text-lg italic px-4 text-center">
        Hint: Try clicking NO... if you can 😉
      </p>

      {/* Celebration Overlay */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-linear-to-br from-pink-400 via-red-400 to-pink-500 z-50 flex flex-col items-center justify-center px-4"
        >
          {/* Confetti - fewer on mobile */}
          {confetti.slice(0, isMobile ? 25 : 50).map((item) => (
            <motion.div
              key={item.id}
              className="absolute text-3xl sm:text-4xl md:text-5xl"
              style={{ left: `${item.left}%`, top: "-10%" }}
              animate={{
                y: [0, window.innerHeight + 100],
                rotate: [0, 360, 720],
                x: [0, Math.sin(item.id) * 100],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                ease: "easeIn",
              }}
            >
              {item.emoji}
            </motion.div>
          ))}

          {/* Main Message */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1, delay: 0.3 }}
            className="text-center z-10"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              YAYYYY! 🎉
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl sm:text-2xl md:text-3xl text-white mb-6 sm:mb-8"
            >
              I knew you'd say yes! 💕
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-md mx-auto"
            >
              You just made me the happiest person! 😊✨
            </motion.div>
          </motion.div>

          {/* Floating hearts animation */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 sm:gap-8 pb-8 sm:pb-12"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="text-4xl sm:text-5xl md:text-6xl"
              >
                ❤️
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

export default App;
