"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const faqs: FaqItem[] = [
    {
      question: "Are my files uploaded to any servers?",
      answer: "No, never. CraftKit Pro operates 100% client-side. The tools leverage WebAssembly, HTML5 APIs, and WebGPU/WebGL to process your PDF documents and images locally directly inside your browser. No files, logs, or metadata are ever transmitted or stored on any server.",
    },
    {
      question: "Why is it completely free and uncapped?",
      answer: "Since all file processing runs on your local computer's processor (CPU/GPU) instead of our servers, we don't have to pay massive cloud computing bills. This allows us to keep the entire toolkit completely free, with no paywalls, subscriptions, watermark stamps, or file count limits.",
    },
    {
      question: "What technology powers this local processing?",
      answer: "We use WebAssembly (Wasm) compiled from high-performance libraries like PDF-Lib, Sharp, and ONNX Runtime. This allows complex operations like PDF text edits, page merging, image compression, and AI background removal to run at native speeds directly in Google Chrome, Safari, Firefox, or Edge.",
    },
    {
      question: "What are the file size limits?",
      answer: "Because processing happens locally on your machine, your system's RAM is the only practical limit. You can easily process files up to 100MB+ in size. Additionally, we have configured our backend actions to support up to 10MB payloads if any remote processing fallback is ever required.",
    },
    {
      question: "Do I need to sign up or install any software?",
      answer: "No registration, sign-up, or installation is required. Simply bookmark the website and launch any tool whenever you need it. Everything loads and runs directly in a browser sandbox.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-[#2a2a2d] bg-[#111112]/50 hover:bg-[#141416]/80 rounded-2xl overflow-hidden transition-colors duration-200"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full py-5 px-6 flex items-center justify-between text-left gap-4"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3 font-semibold text-white text-[15px] sm:text-base">
                <HelpCircle size={18} className="text-[#0a84ff] flex-shrink-0" />
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-[#8e8e93] transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] border-t border-[#2a2a2d]/50" : "max-h-0 overflow-hidden"
              }`}
            >
              <p className="p-6 text-sm text-[#8e8e93] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
