"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";

// ─── Icons ──────────────────────────────────────────────────────────
function DataIcon() {
  return (
    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-400 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

// ─── Particles Background ──────────────────────────────────────────
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles — fewer on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 50;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(165, 180, 252, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Fade In Section Wrapper ────────────────────────────────────────
function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDuration: "800ms" }}
    >
      {children}
    </div>
  );
}

// ─── Section 1: Hero ────────────────────────────────────────────────
function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#1a1a3e]">
      <ParticlesBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
          <span className="text-gradient">{t("hero.title")}</span>
          <br />
          <span className="text-white">{t("hero.tagline")}</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {t("hero.subtitle")}
          <br className="hidden sm:block" />
          {t("hero.subtitle2")}{" "}
          <span className="text-indigo-300 font-semibold">{t("hero.subtitleHighlight")}</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <a href={`/${locale}/register`}>
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 active:scale-95 text-lg shadow-lg shadow-indigo-600/25">
              {t("hero.cta")}
            </button>
          </a>
          <a href={`/${locale}/login`}>
            <button className="px-8 py-4 bg-[#1e1e3a] border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 font-semibold rounded-lg transition-all duration-200 active:scale-95 text-lg">
              {t("hero.signIn")}
            </button>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <a href={`/${locale}/analyze?sample=AAPL`}>
            <button className="px-6 py-3 bg-[#1e1e3a] border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 font-semibold rounded-lg transition-all duration-200 active:scale-95 text-base">
              {t("hero.sampleReport")}
            </button>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// ─── Section 2: Features ────────────────────────────────────────────
function FeaturesSection() {
  const t = useTranslations();
  const featuresRef = useRef<HTMLElement>(null);
  const features = [
    {
      icon: <DataIcon />,
      title: t("features.realTimeData.title"),
      description: t("features.realTimeData.description"),
    },
    {
      icon: <ChipIcon />,
      title: t("features.threeAnalysts.title"),
      description: t("features.threeAnalysts.description"),
    },
    {
      icon: <UserIcon />,
      title: t("features.personalizedInsights.title"),
      description: t("features.personalizedInsights.description"),
    },
  ];

  return (
    <section id="features" ref={featuresRef} className="py-24 md:py-32 bg-[#0a0a1a] relative">
      <div className="bg-gradient-radial absolute inset-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-gradient">{t("features.title")}</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 text-lg">
            {t("features.subtitle")}
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeInSection key={index} delay={index * 150}>
              <div className="card-hover bg-[#12122a] border border-indigo-500/10 rounded-xl p-8 h-full">
                <div className="mb-5 p-3 bg-indigo-500/10 rounded-lg inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Trust Badges ────────────────────────────────────────
function TrustSection() {
  const t = useTranslations();

  return (
    <section className="py-20 bg-[#0d0d24] border-t border-indigo-500/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeInSection>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <ShieldIcon />
              <span>{t("trust.secFilings")}</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-indigo-500/20" />
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{t("trust.disclaimer")}</span>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Section 4: CTA ─────────────────────────────────────────────────
function CTASection() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#0a0a1a] to-[#1a1a3e] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <FadeInSection>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">{t("cta.title")}</span>
          </h2>

          <p className="text-xl text-gray-300 mb-10">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`/${locale}/register`}>
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-200 active:scale-95 text-lg shadow-lg shadow-indigo-600/25">
                {t("cta.getStarted")}
              </button>
            </a>
            <a href={`/${locale}/pricing`}>
              <button className="px-8 py-4 bg-[#1e1e3a] border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 font-semibold rounded-lg transition-all duration-200 active:scale-95 text-lg">
                {t("cta.viewPricing")}
              </button>
            </a>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TrustSection />
      <CTASection />
    </main>
  );
}