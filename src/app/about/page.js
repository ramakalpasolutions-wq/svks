"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function About() {
  const router = useRouter();

  return (
    <main className="min-h-screen luxury-bg text-white p-4 sm:p-8">
      
      {/* FULL WIDTH HERO */}
      <section className="w-full text-center py-16 sm:py-20">
        
        
        <h1 className="luxury-text text-3xl sm:text-5xl md:text-7xl font-black mb-4 ">
          SRI VENKATESWARA
        </h1>
        <h1 className="luxury-text text-3xl sm:text-5xl md:text-7xl font-black mb-6 sm:mb-8 leading-tight">
          KOLATA SAMITHI
        </h1>
        
        <div className="text-xl sm:text-2xl md:text-3xl text-[var(--gold)] mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
          Established 2018 - Preserving sacred Kolatam tradition through exclusive devotional performances for Devotional entities.
        </div>
        
        <div className="h-1 sm:h-2 w-24 sm:w-32 md:w-48 mx-auto bg-[var(--gold)] rounded-full mb-8"></div>
      </section>

      {/* FULL WIDTH MAIN CONTENT */}
      <section className="w-full space-y-12 sm:space-y-16 px-4 max-w-7xl mx-auto">
        
        {/* NEW KOLATAM PARAGRAPH SECTION */}
        <div className="w-full luxury-card p-8 sm:p-12 md:p-16 rounded-3xl border-6 border-[rgba(255,215,0,0.4)] group hover:scale-[1.02] transition-all duration-500">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center luxury-text">
            What is Sacred Kolatam? 🙏
          </h2>
         <div className="max-w-4xl mx-auto prose prose-2xl text-xl sm:text-2xl md:text-3xl leading-relaxed text-[var(--gold)] text-center px-4">
  <p className="mb-8">
    <strong>Kolatam</strong> - the sacred <strong>stick dance of devotion</strong> - is performed only in <strong>temple and devotional occations</strong>. 
    Graceful dancers form a <strong>holy circle</strong>, each holding <strong>two divinely blessed wooden sticks</strong>, striking perfect synchronized rhythms 
    while moving clockwise around the sacred sanctum in mesmerizing circular patterns.
  </p>
  <p className="mb-8">
    Every <strong>stick collision</strong> creates pure, resonant sounds that echo through temple corridors, invoking <strong>divine grace</strong>. 
    This ancient art form - blending rhythm, devotion, and precision - is our sacred offering during <strong>Brahmotsavams,swamy vari kalyanam and temple Utsavams</strong>.
  </p>
  
</div>

        </div>

        {/* SACRED KOLATAM KEY POINTS */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="group luxury-card p-6 sm:p-8 rounded-2xl border-2 border-[rgba(255,215,0,0.3)] hover:scale-105 hover:border-[var(--gold)] transition-all duration-300 text-center">
            <div className="text-4xl sm:text-5xl mb-4">🥢</div>
            <h3 className="text-xl sm:text-2xl font-bold luxury-text mb-3">Sacred Sticks</h3>
            <p className="text-lg sm:text-xl text-[var(--gold)]">Venkateswara-blessed for divine rhythm</p>
          </div>

          <div className="group luxury-card p-6 sm:p-8 rounded-2xl border-2 border-[rgba(255,215,0,0.3)] hover:scale-105 hover:border-[var(--gold)] transition-all duration-300 text-center">
            <div className="text-4xl sm:text-5xl mb-4">⭕</div>
            <h3 className="text-xl sm:text-2xl font-bold luxury-text mb-3">Temple Circles</h3>
            <p className="text-lg sm:text-xl text-[var(--gold)]">Clockwise around holy sanctum</p>
          </div>

          <div className="group luxury-card p-6 sm:p-8 rounded-2xl border-2 border-[rgba(255,215,0,0.3)] hover:scale-105 hover:border-[var(--gold)] transition-all duration-300 text-center">
            <div className="text-4xl sm:text-5xl mb-4">🙏</div>
            <h3 className="text-xl sm:text-2xl font-bold luxury-text mb-3">Divine Service</h3>
            <p className="text-lg sm:text-xl text-[var(--gold)]">Temple performances only</p>
          </div>
        </div>

        {/* FULL WIDTH VIDEO SECTION */}
        <div className="w-full luxury-card p-8 sm:p-12 rounded-3xl border-4 border-[rgba(255,215,0,0.4)] group hover:scale-[1.02] transition-all duration-500">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center luxury-text">
            Witness Our Devotion
          </h2>
          <div className="w-full aspect-video rounded-2xl border-4 border-[rgba(255,215,0,0.4)] overflow-hidden group-hover:border-[var(--gold)] transition-all">
            <iframe
              src="https://www.youtube.com/embed/8xmIAYzOVd4"
              title="Sri Venkateswara Kolata Samithi Devotional Performance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl"
            />
          </div>
          <p className="text-center text-lg sm:text-xl mt-6 text-[var(--gold)]">
            🙏 Our sacred offering to Sri Venkateswara Swamy 🙏
          </p>
        </div>

        {/* DEVOTIONAL FOCUS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-6 sm:gap-8">
          <div className="luxury-card p-6 sm:p-10 rounded-2xl border-4 border-[rgba(255,215,0,0.3)] group hover:scale-105 transition-all">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 luxury-text text-center">Temple Festivals</h3>
            <ul className="space-y-3 text-lg text-center sm:text-xl text-[var(--gold)]">
              <li>• Brahmotsavams</li>
              <li>• Vaikunta Dwadasi</li>
              <li>• Hanuman Jayanti</li>
              <li>• Tirupati Utsavams</li>
              <li>• Venkateswara kalyanam</li>

            </ul>
          </div>

          {/* <div className="luxury-card p-6 sm:p-10 rounded-2xl border-4 border-[rgba(255,215,0,0.3)] group hover:scale-105 transition-all">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 luxury-text text-center">Sacred Songs</h3>
            <ul className="space-y-3 text-lg sm:text-xl text-[var(--gold)]">
              <li>• Venkateswara Suprabhatam</li>
              <li>• Ashtalakshmi Stotram</li>
              <li>• Suprabhat Seva Bhajans</li>
              <li>• Sahasranama Archana</li>
            </ul>
          </div> */}
        </div>

        {/* FULL WIDTH CTA */}
        <div className="w-full text-center py-16 sm:py-20 luxury-card rounded-3xl border-6 border-[rgba(255,215,0,0.5)] group hover:scale-[1.02] transition-all">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 luxury-text">
            Experience Divine Kolatam
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center max-w-lg mx-auto">
            <button 
              className="px-8 sm:px-12 py-4 sm:py-6 luxury-bg text-[var(--gold)] text-lg sm:text-xl font-black rounded-2xl border-4 border-[var(--gold)] hover:scale-105 hover:bg-[rgba(255,215,0,0.1)] transition-all duration-300 flex-1 sm:flex-none"
              onClick={() => router.push("/gallery")}
            >
              🥢 Gallery
            </button>
            <button 
              className="px-8 sm:px-12 py-4 sm:py-6 border-4 border-[var(--gold)] text-[var(--gold)] text-lg sm:text-xl font-black rounded-2xl hover:bg-[rgba(255,215,0,0.2)] hover:scale-105 transition-all duration-300 flex-1 sm:flex-none"
              onClick={() => router.push("/contact")}
            >
              🙏 Contact
            </button>
          </div>
          <p className="text-lg sm:text-xl mt-8 text-[var(--gold)] opacity-80">
            Sri Venkateswara Kolata Samithi - Established 2018
          </p>
        </div>

      </section>
    </main>
  );
}
