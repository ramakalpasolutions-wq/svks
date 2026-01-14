"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function Programmes() {
  const router = useRouter();

  return (
    <main className="min-h-screen luxury-bg text-white p-8">
      
      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center py-20">
        {/* <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-12 bg-yellow-500/20 rounded-3xl flex items-center justify-center border-4 border-yellow-600">
        </div> */}
        
          {/* <div className="text-5xl md:text-6xl">🛕</div> */}
        <h1 className="text-4xl md:text-6xl mb-8 text-yellow-300 uppercase">
         🛕Devotional Training & Programmes
        </h1>
        
        <p className="text-2xl md:text-5xl text-yellow-200 mb-12 max-w-2xl mx-auto font-serif">
         Sri Venkateswara Kolata Samithi
        </p>
        
        <div className="h-2 w-32 md:w-48 mx-auto bg-yellow-400 rounded-full mb-8"></div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-9xl mx-auto space-y-16 px-4">

        {/* 1. TEMPLE & DEVOTIONAL EVENTS */}
        <div className="luxury-card p-12 md:p-16 rounded-3xl border-4 border-yellow-600/50 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12 relative z-10">
            <div>
              {/* Replace /logo.webp with a photo of temple performance */}
              <img src="/logo.png" alt="Temple Kolatam" className="w-full h-80 md:h-96 object-cover rounded-2xl border-4 border-yellow-600/30 hover:scale-105 transition-all shadow-2xl shadow-yellow-900/20" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300">
               ॥ Temple Seva ॥
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We perform authentic Kolatam seva for Brahmotsavams, Jataras, and temple processions. Dedicated to Lord Venkateswara, our performance adds divine energy to the auspicious occasion.
              </p>
              
              <div className="space-y-4 text-xl">
                <div className="flex items-center gap-4 p-4 luxury-card rounded-xl border-2 border-yellow-600/30">
                  <div className="text-2xl">🔥</div>
                  <div>Brahmotsavams & Jataras</div>
                </div>
                <div className="flex items-center gap-4 p-4 luxury-card rounded-xl border-2 border-yellow-600/30">
                  <div className="text-2xl">🚶</div>
                  <div>Street Processions</div>
                </div>
                <div className="flex items-center gap-4 p-4 luxury-card rounded-xl border-2 border-yellow-600/30">
                  <div className="text-2xl">🕉️</div>
                  <div>Devotional Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* 2. TRAINING & EDUCATION (Updated for Daily/All Ages) */}
        <div className="luxury-card p-12 md:p-16 rounded-3xl border-4 border-yellow-600/50 relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12 relative z-10">
            <div className="order-2 md:order-1 text-center md:text-right">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300">
                {/* Daily Kolatam Training */}
                ॥ Daily Kolatam Training ॥

              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Join our daily practice sessions designed for everyone! We offer consistent training that blends physical fitness with devotion, open to students of all ages—from kids to elders.
              </p>

              <div className="space-y-4 text-xl">
                <div className="flex items-center gap-4 p-4 luxury-card rounded-xl border-2 border-yellow-600/30 justify-end">
                  <div>Daily Evening Batches</div>
                  <div className="text-2xl">🌅</div>
                </div>
                <div className="flex items-center gap-4 p-4 luxury-card rounded-xl border-2 border-yellow-600/30 justify-end">
                  <div>Open for All Ages (5 to 60+ Years)</div>
                  <div className="text-2xl">👨‍👩‍👧‍👦</div>
                </div>
                <div className="flex items-center gap-4 p-4 luxury-card rounded-xl border-2 border-yellow-600/30 justify-end">
                  <div>Step-by-Step Learning</div>
                  <div className="text-2xl">👣</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              {/* Replace /logo.webp with a photo of mixed age group training */}
              <img src="/logo.png" alt="Daily Kolatam Training" className="w-full h-80 md:h-96 object-cover rounded-2xl border-4 border-yellow-600/30 hover:scale-105 transition-all shadow-2xl shadow-yellow-900/20" />
            </div>
          </div>
        </div>

      {/* PROGRAMME TYPES GRID */}
<div className="luxury-card p-12 md:p-16 rounded-3xl border-6 border-yellow-600/50">
  <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-yellow-300">
    Our Offerings
  </h2>
  
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    
    {/* 1. Major Temple Events */}
    <div className="text-center p-8 luxury-card rounded-2xl border-2 border-yellow-600/30 hover:scale-105 transition-all group">
      <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🛕</div>
      <h3 className="text-xl font-bold text-yellow-300 mb-3">Brahmotsavams</h3>
      <p className="text-lg">Temple Processions</p>
      <p className="text-sm text-yellow-400">Divine Seva</p>
    </div>
    
    {/* 2. REPLACED: Kolatam Competitions */}
    <div className="text-center p-8 luxury-card rounded-2xl border-2 border-yellow-600/30 hover:scale-105 transition-all group">
      <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🥇</div>
      <h3 className="text-xl font-bold text-yellow-300 mb-3">Kolatam Competitions</h3>
      <p className="text-lg">Cultural Festivals</p>
    </div>
    {/* <div className="text-center p-8 luxury-card rounded-2xl border-2 border-yellow-600/30 hover:scale-105 transition-all group">
  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎭</div>
  <h3 className="text-xl font-bold text-yellow-300 mb-3">Stage Shows</h3>
  <p className="text-lg">Theatre Performances</p>
  <p className="text-sm text-yellow-400">Cultural Programs</p>
</div>
 */}
    
    {/* 3. Daily Training */}
    <div className="text-center p-8 luxury-card rounded-2xl border-2 border-yellow-600/30 hover:scale-105 transition-all group">
      <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎓</div>
      <h3 className="text-xl font-bold text-yellow-300 mb-3">Daily Classes</h3>
      <p className="text-lg">Flexible Timings</p>
      <p className="text-sm text-yellow-400">For All Ages</p>
    </div>
    
    <div className="text-center p-8 luxury-card rounded-2xl border-2 border-yellow-600/30 hover:scale-105 transition-all group">
  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎆</div>
  <h3 className="text-xl font-bold text-yellow-300 mb-3">Festival Special</h3>
  <p className="text-sm">Hindu Festivals Like: Dasara,Ekadashi,etc</p>
  <p className="text-sm text-yellow-400">Temple Celebrations</p>
</div>


  </div>
</div>


       {/* VIDEO GALLERY - DEVOTIONAL ONLY */}
        <div className="luxury-card p-8 md:p-16 rounded-3xl border-4 border-yellow-600/50 bg-black/40">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-yellow-300 underline decoration-yellow-600/50 underline-offset-8">
            Divine Performances
          </h2>

          {/* Grid Container: 2x2 Grid on Desktop */}
          <div className="grid md:grid-cols-2 gap-12 gap-y-16">
            
            {/* VIDEO 1: TEMPLE FESTIVAL */}
            <div className="flex flex-col space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-400 font-serif">
                🛕 Temple Seva
              </h3>
              <div className="aspect-video w-full rounded-2xl border-2 border-yellow-600/40 hover:scale-105 transition-all duration-300 overflow-hidden shadow-2xl shadow-yellow-900/20 group relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-300 z-10 pointer-events-none"></div>
                <iframe
                  src="https://www.youtube.com/embed/8xmIAYzOVd4"
                  title="Temple Festival"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* VIDEO 2: TRAINING SESSION */}
            <div className="flex flex-col space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-400 font-serif">
                🎓 Training Session
              </h3>
              <div className="aspect-video w-full rounded-2xl border-2 border-yellow-600/40 hover:scale-105 transition-all duration-300 overflow-hidden shadow-2xl shadow-yellow-900/20 group relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-300 z-10 pointer-events-none"></div>
                <iframe
                  src="https://www.youtube.com/embed/_MKthNONHI8"
                  title="Student Training"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* VIDEO 3: STREET PROCESSION (New) */}
            <div className="flex flex-col space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-400 font-serif">
                🥁 Street Procession
              </h3>
              <div className="aspect-video w-full rounded-2xl border-2 border-yellow-600/40 hover:scale-105 transition-all duration-300 overflow-hidden shadow-2xl shadow-yellow-900/20 group relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-300 z-10 pointer-events-none"></div>
                <iframe
                  src="https://www.youtube.com/embed/8xmIAYzOVd4" // Change this ID
                  title="Street Procession"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* VIDEO 4: KIDS BATCH (New) */}
            <div className="flex flex-col space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-center text-yellow-400 font-serif">
                👶 Kids Batch
              </h3>
              <div className="aspect-video w-full rounded-2xl border-2 border-yellow-600/40 hover:scale-105 transition-all duration-300 overflow-hidden shadow-2xl shadow-yellow-900/20 group relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-300 z-10 pointer-events-none"></div>
                <iframe
                  src="https://www.youtube.com/embed/_MKthNONHI8" // Change this ID
                  title="Kids Batch"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-yellow-300">
            Join Our Mission
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center max-w-xl mx-auto">
            <button 
              className="px-12 py-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-2xl text-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all hover:scale-105 border-2 border-yellow-600 shadow-lg shadow-yellow-500/20"
              onClick={() => router.push("/contact")}
            >
              📞 Book Temple Seva
            </button>
            <button 
              className="px-12 py-6 border-4 border-yellow-600 text-yellow-300 rounded-2xl text-xl font-bold hover:bg-yellow-600/20 hover:scale-105 transition-all"
              onClick={() => router.push("/contact")}
            >
              📝 Join Classes
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}