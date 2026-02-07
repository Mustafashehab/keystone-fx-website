"use client";

import { Lang, t } from "@/lib/i18n";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function Contact() {
  const params = useParams();
  const lang = (params?.lang as Lang) || "en";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert(t(lang, "contact.form.successMessage") as string);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Multiple Animated Background Layers */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'slide 20s linear infinite'
          }}></div>
        </div>

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Multiple Gradient Orbs with Different Animations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-32 text-center text-white">
          <div className="inline-block mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg animate-bounce">
            💬 {t(lang, "contact.hero.badge")}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent inline-block animate-gradient">
              {t(lang, "contact.hero.title")}
            </span>
          </h1>
          
          <p className="mx-auto max-w-3xl text-xl text-slate-300 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t(lang, "contact.hero.subtitle")}
          </p>

          {/* Animated Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="mx-auto w-6 h-10 rounded-full border-2 border-yellow-400 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes slide {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(50px) translateY(50px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </section>

      {/* Contact Info Cards */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
          {/* Phone */}
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-xl transition-all hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg group-hover:scale-110 transition-transform">
              📞
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {t(lang, "contact.info.phone.title")}
            </h3>
            <p className="text-slate-600 mb-2">{t(lang, "contact.info.phone.description")}</p>
            <a href="tel:+9611253999" className="text-2xl font-bold text-slate-900 hover:text-yellow-600 transition">
              +961 1 253 999
            </a>
          </div>

          {/* Email - UPDATED */}
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-xl transition-all hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg group-hover:scale-110 transition-transform">
              ✉️
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {t(lang, "contact.info.email.title")}
            </h3>
            <p className="text-slate-600 mb-2">{t(lang, "contact.info.email.description")}</p>
            <a href="mailto:info@keystone-fx.com" className="text-lg font-bold text-slate-900 hover:text-yellow-600 transition break-all">
              info@keystone-fx.com
            </a>
          </div>

          {/* Hours */}
          <div className="group rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-xl transition-all hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg group-hover:scale-110 transition-transform">
              🕒
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {t(lang, "contact.info.hours.title")}
            </h3>
            <p className="text-slate-600 mb-2">{t(lang, "contact.info.hours.description")}</p>
            <p className="text-2xl font-bold text-slate-900">24/5</p>
            <p className="text-sm text-slate-500 mt-1">{t(lang, "contact.info.hours.note")}</p>
          </div>
        </div>
      </section>

      {/* Main Content - Form + Map */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {t(lang, "contact.form.title")}
              </h2>
              <p className="text-slate-600 text-lg">
                {t(lang, "contact.form.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t(lang, "contact.form.fullName")}
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                  placeholder={t(lang, "contact.form.fullNamePlaceholder") as string}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t(lang, "contact.form.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                  placeholder={t(lang, "contact.form.emailPlaceholder") as string}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t(lang, "contact.form.phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                  placeholder={t(lang, "contact.form.phonePlaceholder") as string}
                />
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t(lang, "contact.form.topic")}
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                >
                  <option value="">{t(lang, "contact.form.topicPlaceholder")}</option>
                  <option value="accounts">{t(lang, "contact.form.topics.accounts")}</option>
                  <option value="platform">{t(lang, "contact.form.topics.platform")}</option>
                  <option value="funding">{t(lang, "contact.form.topics.funding")}</option>
                  <option value="partnership">{t(lang, "contact.form.topics.partnership")}</option>
                  <option value="other">{t(lang, "contact.form.topics.other")}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  {t(lang, "contact.form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 transition focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 resize-none"
                  placeholder={t(lang, "contact.form.messagePlaceholder") as string}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-900 transition hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/50 hover:scale-105"
              >
                {t(lang, "contact.form.submit")}
              </button>
            </form>
          </div>

          {/* Map + Location */}
          <div className="space-y-8">
            {/* Location Card */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 inline-block rounded-full bg-yellow-400 p-4 text-4xl shadow-lg">
                📍
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {t(lang, "contact.location.title")}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Charles Helou avenue, Dora - Beirut highway<br />
                Bourj Hammoud, Beirut, Lebanon
              </p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=33.8955278,35.5444722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-700 transition"
              >
                <span>{t(lang, "contact.location.viewMap")}</span>
                <span>→</span>
              </a>
            </div>

            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-2 ring-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.5!2d35.5444722!3d33.8955278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDUzJzQzLjkiTiAzNcKwMzInNDAuMSJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900">{t(lang, "contact.disclaimer.title")}</span> {t(lang, "contact.disclaimer.text")}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            {t(lang, "contact.cta.title")}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t(lang, "contact.cta.subtitle")}
          </p>
          <button className="rounded-xl bg-yellow-400 px-12 py-5 text-lg font-bold text-slate-900 transition-all hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:scale-105">
            {t(lang, "contact.cta.button")}
          </button>
        </div>
      </section>
    </div>
  );
}