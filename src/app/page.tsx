"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  TrendingUp,
  Shield,
  MessageSquare,
  Sparkles,
  ArrowRight,
  MapPin,
  Home,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AIRecommendations } from "@/components/ai-recommendations";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: Building2,
      title: "Extensive Listings",
      desc: "Browse thousands of properties — apartments, houses, commercial spaces, and land.",
    },
    {
      icon: Sparkles,
      title: "AI Recommendations",
      desc: "Get personalized property suggestions powered by Google AI.",
    },
    {
      icon: TrendingUp,
      title: "Price Predictions",
      desc: "AI-powered market price estimation to help you make informed decisions.",
    },
    {
      icon: Shield,
      title: "Verified Listings",
      desc: "All properties are verified by our team for authenticity and accuracy.",
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      desc: "Ask questions about any property and get instant, intelligent answers.",
    },
    {
      icon: MapPin,
      title: "Neighborhood Insights",
      desc: "AI-powered area analysis — safety, schools, transportation, and more.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Properties" },
    { value: "5K+", label: "Happy Clients" },
    { value: "200+", label: "Cities" },
    { value: "98%", label: "Satisfaction" },
  ];

  const propertyTypes = [
    { icon: Home, label: "Houses", query: "HOUSE" },
    { icon: Building2, label: "Apartments", query: "APARTMENT" },
    { icon: DollarSign, label: "Commercial", query: "COMMERCIAL" },
    { icon: MapPin, label: "Land", query: "LAND" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[90vh] flex items-center justify-center px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-amber-500/10 dark:from-blue-900/20 dark:to-amber-900/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
              AI-Powered Real Estate intelligence
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6"
          >
            Find Your{" "}
            <span className="gradient-text">Dream Property</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 sm:mb-10 max-w-2xl mx-auto"
          >
            Discover the perfect home, apartment, or commercial space with our AI-powered
            recommendations, price predictions, and neighborhood insights.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl p-2 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by city, neighborhood, or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm py-2 placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02]"
            >
              Search
            </button>
          </motion.form>

          {/* Quick links */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            {propertyTypes.map(({ icon: Icon, label, query }) => (
              <Link
                key={query}
                href={`/properties?type=${query}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {stats.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              className="text-center p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{value}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">EstateIQ</span>?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Experience the future of real estate with AI-powered features designed to help you find,
              analyze, and secure your perfect property.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-800 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <AIRecommendations />

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white shadow-2xl shadow-blue-500/20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of happy homeowners who found their perfect property with EstateIQ.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">EstateIQ</span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              AI-powered real estate platform for buying, selling, and renting properties.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <div className="space-y-2">
              {["Properties", "Dashboard", "AI Recommendations"].map((item) => (
                <Link key={item} href="/properties" className="block text-sm text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <div className="space-y-2">
              {["About Us", "Contact", "Privacy Policy"].map((item) => (
                <span key={item} className="block text-sm text-neutral-500 dark:text-neutral-400 cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="space-y-2">
              {["nandakumaryejarla@gmail.com", "+91 6304214979"].map((item) => (
                <span key={item} className="block text-sm text-neutral-500 dark:text-neutral-400">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} EstateIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
