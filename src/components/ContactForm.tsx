"use client";

import React, { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate sending email
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-[#111112] border border-[#2a2a2d] p-6 rounded-2xl">
      {status === "success" ? (
        <div className="text-center py-8">
          <span className="text-4xl">🎉</span>
          <h3 className="text-lg font-bold text-white mt-4 mb-2">Message Sent Successfully!</h3>
          <p className="text-[13px] text-[#8e8e93] mb-6">
            Thank you for reaching out. We will get back to you as soon as possible.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#0a84ff] hover:bg-[#0070e3] rounded-lg transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1c1c1e] text-[#ebebf5] text-[13px] rounded-lg px-3 py-2.5 border border-[#2a2a2d] focus:border-[#0a84ff] focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1c1c1e] text-[#ebebf5] text-[13px] rounded-lg px-3 py-2.5 border border-[#2a2a2d] focus:border-[#0a84ff] focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-[#1c1c1e] text-[#ebebf5] text-[13px] rounded-lg px-3 py-2.5 border border-[#2a2a2d] focus:border-[#0a84ff] focus:outline-none transition-colors"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#1c1c1e] text-[#ebebf5] text-[13px] rounded-lg px-3 py-2.5 border border-[#2a2a2d] focus:border-[#0a84ff] focus:outline-none transition-colors resize-none"
              placeholder="Type your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3 text-sm font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20 active:scale-[0.98]"
          >
            {status === "sending" ? "Sending Message..." : "Submit Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
