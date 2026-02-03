"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeBanner() {
  const { t } = useLanguage();

  // Mock user avatars (you can replace with real user images later)
  const userAvatars = [
    { initial: "A", color: "from-blue-500 to-indigo-500" },
    { initial: "B", color: "from-purple-500 to-pink-500" },
    { initial: "C", color: "from-green-500 to-emerald-500" },
    { initial: "D", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[550px] overflow-hidden mt-4 sm:mt-8">
      <Image
        src="/images/image-banner1.jpg"
        alt="PGNexus Banner"
        fill
        className="object-cover"
        priority
        style={{ objectPosition: "50% 80%" }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              {t(trans.homePage.bannerTitle)}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium mb-6 sm:mb-8 leading-relaxed" style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.5)' }}>
              {t(trans.homePage.bannerSubtitle)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link href="/hacker-discussions" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-3 sm:px-8 sm:py-6 rounded-lg transition-all hover:scale-105 shadow-lg cursor-pointer text-base sm:text-lg group"
                >
                  {t(trans.homePage.bannerCtaViewHighlights)}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/events-meetups" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-4 py-3 sm:px-8 sm:py-6 rounded-lg transition-all hover:scale-105 shadow-lg cursor-pointer text-base sm:text-lg group backdrop-blur-sm"
                >
                  {t(trans.homePage.bannerCtaExploreEvents)}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* User Avatars */}
              <div className="flex -space-x-2 sm:-space-x-3">
                {userAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${avatar.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2 border-white shadow-lg`}
                  >
                    {avatar.initial}
                  </div>
                ))}
              </div>

              {/* Social Proof Text */}
              <p className="text-white font-semibold text-sm sm:text-base md:text-lg" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)' }}>
                {t(trans.homePage.bannerSocialProof)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
