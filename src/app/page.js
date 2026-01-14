"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function HomePage() {
  const [images, setImages] = useState([]);
  const [youtubeFolders, setYoutubeFolders] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentVideoEmbed, setCurrentVideoEmbed] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const playerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  function parseYouTubeId(url) {
    if (!url || typeof url !== "string") return null;
    const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/v\/)([A-Za-z0-9_-]{6,})/);
    if (m) return m[1];
    try {
      const u = new URL(url, typeof window !== "undefined" ? window.location.href : "http://localhost");
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    } catch (e) {}
    return null;
  }
  
  function youtubeThumbUrl(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  
  function youTubeEmbedSrc(url) {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1` : null;
  }

  // ESC key handler
  const handleEscKey = useCallback((e) => {
    if (e.key === 'Escape' && isVideoPlaying) {
      setCurrentVideoEmbed(null);
      setIsVideoPlaying(false);
      // Post message to YouTube iframe to stop
      const iframe = playerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
      }
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    if (isVideoPlaying) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [handleEscKey, isVideoPlaying]);

  function normalizeHeroItem(item) {
    if (!item) return null;
    if (typeof item === "string") return { src: item, name: "", about: "" };
    const src = item.original || item.optimized || item.thumb || item.url || item.src || "";
    const name = item.title || item.name || item.caption || "";
    const about = item.about || item.description || item.alt || "";
    return src ? { src, name, about } : null;
  }

  async function loadHomeAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/event-photos");
      const text = await res.text().catch(() => "");
      if (!text) {
        setImages([]);
        setYoutubeFolders([]);
        setLoading(false);
        return;
      }

      let body;
      try {
        body = JSON.parse(text);
      } catch (err) {
        console.warn("home: invalid JSON", err);
        setImages([]);
        setYoutubeFolders([]);
        setLoading(false);
        return;
      }

      const gallery = body.gallery ?? body;
      const sliderRaw = body.slider ?? body.home_slider ?? body.homeSlider ?? [];
      const processed = Array.isArray(sliderRaw) && sliderRaw.length > 0
        ? sliderRaw.map(normalizeHeroItem).filter(Boolean)
        : [];

      setImages(processed);
      const yFolders = Object.entries(gallery || {}).filter(
        ([k, items]) => Array.isArray(items) && items.length > 0 && items[0]?.youtube === true
      );
      setYoutubeFolders(yFolders);
    } catch (e) {
      console.warn("home: failed to load /api/event-photos", e);
      setImages([]);
      setYoutubeFolders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHomeAssets();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    autoSlideIntervalRef.current = setInterval(() => {
      if (!isVideoPlaying) {
        setIndex((prev) => (prev + 1) % images.length);
      }
    }, 4000);
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [images.length, isVideoPlaying]);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const touchThreshold = 40;
  
  function onTouchStart(e) { 
    touchDeltaX.current = 0; 
    touchStartX.current = e.touches?.[0]?.clientX ?? null; 
  }
  
  function onTouchMove(e) { 
    if (touchStartX.current == null) return; 
    const x = e.touches?.[0]?.clientX ?? null; 
    if (x == null) return; 
    touchDeltaX.current = x - touchStartX.current; 
  }
  
  function onTouchEnd() {
    if (Math.abs(touchDeltaX.current) > touchThreshold && images.length > 0) {
      if (touchDeltaX.current > 0) setIndex((i) => (i - 1 + images.length) % images.length);
      else setIndex((i) => (i + 1) % images.length);
    }
    touchStartX.current = null; 
    touchDeltaX.current = 0;
  }

  const handleIndicatorClick = (i) => setIndex(i);
  const handleImageClick = (i) => setIndex(i);

  const playVideo = (embedUrl) => {
    setCurrentVideoEmbed(embedUrl);
    setIsVideoPlaying(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0a0a] to-[#2d0a0a]">
        <div className="text-center text-yellow-300 animate-pulse">
          <div className="text-6xl mb-8 animate-bounce">🥢</div>
          <div className="text-3xl font-black mb-6 luxury-text bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Sri Venkateswara Kolata Samithi
          </div>
          <div className="text-xl mb-4">Loading kolatam performances...</div>
          <div className="w-24 h-24 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0a0a] to-[#2d0a0a]">
        <div className="text-center text-yellow-300 max-w-2xl mx-auto px-4">
          <div className="text-7xl mb-8 animate-pulse">🥢</div>
          <h1 className="luxury-text text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Sri Venkateswara Kolata Samithi
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Authentic kolatam performances preserving centuries-old traditions
          </p>
          <p className="text-lg opacity-75">Content loading from gallery... Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ESC instruction */}
      {/* {isVideoPlaying && (
        <div className="fixed top-4 right-4 z-[1000] bg-black/80 text-yellow-300 px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-yellow-500/50">
          Press <kbd className="bg-yellow-500/20 px-2 py-1 rounded font-bold text-yellow-300">ESC</kbd> to stop video
        </div>
      )} */}

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-black via-[#1a0a0a] to-[#2d0a0a]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-roledescription="kolatam carousel"
      >
        <div className="w-full">
          {/* Carousel Container */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => handleImageClick(i)}
                aria-label={`View ${img.name || `kolatam performance ${i + 1}`}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out focus:outline-none ${
                  index === i ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <img 
                  src={img.src} 
                  alt={`${img.name || "Kolatam"} performance`}
                  className="w-full h-full object-cover brightness-75"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </button>
            ))}

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[11] pointer-events-none" />

            {/* Navigation Indicators */}
            <div className="absolute left-0 right-0 bottom-4 sm:bottom-6 md:bottom-8 flex justify-center gap-2 sm:gap-3 z-20 pointer-events-auto px-4">
              {images.map((_, i) => (
                <button
                  key={`ind-${i}`}
                  onClick={() => handleIndicatorClick(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all focus:outline-none border-2 backdrop-blur-sm ${
                    index === i 
                      ? "bg-yellow-400 border-yellow-400 scale-125 shadow-lg shadow-yellow-500/50" 
                      : "bg-white/30 border-white/50 hover:bg-white/60 hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hero Text Content */}
          <div className="luxury-bg py-8 sm:py-10 md:py-14 px-6 sm:px-8 backdrop-blur-sm">
            <div className="max-w-9xl mx-auto text-center">
              <h1 className="luxury-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl  bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                Sri Venkateswara Kolata Samithi
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto opacity-90">
                {images[index]?.about || "Rhythmic stick dance performances celebrating centuries-old traditions with perfect synchronization."}
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-lg">
                {images[index]?.name || "Authentic Kolatam Performances"}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section */}
      <div id="home-video-player" className="max-w-6xl mx-auto my-12 px-4 sm:px-6 lg:px-8" ref={playerRef}>
        {currentVideoEmbed ? (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-black to-gray-900 border-4 border-yellow-600/40 shadow-2xl backdrop-blur-sm">
            <div style={{ paddingTop: "56.25%" }} className="relative">
              <iframe 
                src={currentVideoEmbed} 
                title="Kolatam performance video" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                allowFullScreen 
                className="absolute top-0 left-0 w-full h-full border-0 rounded-2xl"
              />
            </div>
            <div className="absolute -top-12 right-4">
              <button
                onClick={() => {
                  setCurrentVideoEmbed(null);
                  setIsVideoPlaying(false);
                }}
                className="bg-red-600/90 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-red-400/50"
              >
                ⏹️ Stop
              </button>
            </div>
          </div>
        ) : (
          <div className="luxury-card text-center py-16 md:py-20 px-8 border-4 border-yellow-600/30 backdrop-blur-sm rounded-3xl">
            <div className="text-6xl mb-6">📺</div>
            <h3 className="text-2xl md:text-3xl font-black text-yellow-300 mb-4">Watch Our Performances</h3>
            <p className="text-xl text-yellow-200 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Click any kolatam video below to experience the rhythm and energy of traditional stick dance
            </p>
          </div>
        )}
      </div>

      {/* Our Performances Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="luxury-text text-4xl md:text-5xl lg:text-6xl font-black text-center mb-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
          Our Kolatam Performances
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
          {youtubeFolders.slice(0, 8).map(([folder, items], idx) => {
            const url = items?.[0]?.url || "";
            const thumb = youtubeThumbUrl(url);
            const title = items?.[0]?.title || folder.replace(/_/g, " ").replace(/kolatam?/i, "Kolatam");
            const embed = youTubeEmbedSrc(url);
            
            return (
              <div key={folder + idx} className="luxury-card group border-1 border-yellow-600/30 rounded-2xl overflow-hidden hover:border-yellow-500/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
                <button
                  onClick={() => embed && playVideo(embed + "&autoplay=1")}
                  className="relative w-full h-48 md:h-56 lg:h-60 block focus:outline-none rounded-t-2xl overflow-hidden"
                  aria-label={`Play kolatam performance: ${title}`}
                  disabled={!embed}
                >
                  {thumb ? (
                    <img 
                      src={thumb} 
                      alt={`${title} - kolatam performance`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      <div className="text-3xl text-yellow-400 animate-pulse">🥢</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center group-hover:bg-black/70 transition-all duration-300">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl group-hover:scale-125 transition-all duration-300 border-4 border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 text-black font-bold" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </button>
                <div className="p-6">
                  <h4 className="font-bold text-lg md:text-xl text-yellow-300 line-clamp-2 group-hover:text-yellow-200 transition-colors mb-2">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-300 opacity-90">Kolatam Performance</p>
                </div>
              </div>
            );
          })}

          {youtubeFolders.length === 0 && (
            <div className="col-span-full text-center py-24 text-yellow-300">
              <div className="text-8xl mb-8 animate-pulse mx-auto max-w-min">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  <rect x="15" y="20" width="8" height="70" rx="4" fill="#FFD700" stroke="#FF8C00" strokeWidth="3"/>
                  <rect x="65" y="10" width="8" height="70" rx="4" transform="rotate(-35 69 45)" fill="#FFA500" stroke="#FF4500" strokeWidth="3"/>
                  <circle cx="51" cy="47" r="12" fill="#FFD700" opacity="0.8"/>
                  <circle cx="51" cy="47" r="8" fill="#FF8C00"/>
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-yellow-300">Kolatam Videos Loading...</h3>
              <p className="text-xl opacity-90">Authentic performances coming soon</p>
            </div>
          )}
        </div>

        {youtubeFolders.length > 0 && (
          <div className="mt-16 flex justify-center">
            <a 
              href="/gallery" 
              className="group relative inline-flex px-12 py-6 md:px-16 md:py-7 rounded-3xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 text-black font-black text-xl md:text-2xl shadow-2xl hover:shadow-3xl hover:scale-105 hover:from-yellow-400 hover:to-orange-400 transition-all duration-500 border-4 border-yellow-400/50 overflow-hidden"
            >
              <span className="relative z-10 tracking-wide">🥢 WATCH MORE KOLATAM</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </div>
        )}
      </section>

      {/* Services Section - Kolatam Only */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 ">
        <h2 className="luxury-text text-5xl lg:text-6xl xl:text-7xl font-black text-center mb-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
          Kolatam Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Kolatam Dance */}
          <article className="luxury-card p-10 lg:p-12 rounded-3xl border-4 border-yellow-600/40 hover:border-yellow-500/80 hover:shadow-3xl transition-all group hover:-translate-y-4 backdrop-blur-xl bg-gradient-to-br from-black/60 to-transparent">
            <div className="text-6xl lg:text-7xl mb-8 group-hover:scale-110 transition-transform">🥢</div>
            <h4 className="text-3xl lg:text-4xl font-black mb-6 text-yellow-300 group-hover:text-yellow-200 transition-all text-center">
              Authentic Kolatam
            </h4>
            <p className="text-xl leading-relaxed text-gray-200 text-center max-w-md mx-auto opacity-95">
              Traditional stick dance with perfect synchronization, rhythmic clapping, and centuries-old choreography
            </p>
          </article>
          
          {/* Cultural Events */}
          <article className="luxury-card p-10 lg:p-12 rounded-3xl border-4 border-yellow-600/40 hover:border-yellow-500/80 hover:shadow-3xl transition-all group hover:-translate-y-4 backdrop-blur-xl bg-gradient-to-br from-black/60 to-transparent">
            <div className="text-6xl lg:text-7xl mb-8 group-hover:scale-110 transition-transform">🎭</div>
            <h4 className="text-3xl lg:text-4xl font-black mb-6 text-yellow-300 group-hover:text-yellow-200 transition-all text-center">
              Cultural Events
            </h4>
            <p className="text-xl leading-relaxed text-gray-200 text-center max-w-md mx-auto opacity-95">
              Temple festivals featuring vibrant kolatam performances
            </p>
          </article>
          
          {/* Heritage Preservation */}
          <article className="luxury-card p-10 lg:p-12 rounded-3xl border-4 border-yellow-600/40 hover:border-yellow-500/80 hover:shadow-3xl transition-all group hover:-translate-y-4 backdrop-blur-xl bg-gradient-to-br from-black/60 to-transparent">
            <div className="text-6xl lg:text-7xl mb-8 group-hover:scale-110 transition-transform">🏆</div>
            <h4 className="text-3xl lg:text-4xl font-black mb-6 text-yellow-300 group-hover:text-yellow-200 transition-all text-center">
              Heritage Preservation
            </h4>
            <p className="text-xl leading-relaxed text-gray-200 text-center max-w-md mx-auto opacity-95">
              Training next generation in authentic kolatam techniques to preserve sacred traditions
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
