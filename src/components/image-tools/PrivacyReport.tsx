// ============================================================
// src/components/image-tools/PrivacyReport.tsx
// ============================================================

"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, Shield, AlertTriangle } from "lucide-react";

interface PrivacyReportProps {
  report: {
    riskLevel: "Low" | "Medium" | "High";
    findings: string[];
    explanation: string;
  };
}

export function PrivacyReport({ report }: PrivacyReportProps) {
  const getRiskColors = () => {
    switch (report.riskLevel) {
      case "High":
        return {
          bg: "bg-red-500/10 border-red-500/20 text-red-400",
          text: "text-red-400",
          badge: "bg-red-500/10 text-red-400 border-red-500/20",
          icon: <ShieldAlert size={20} className="text-red-400" />,
        };
      case "Medium":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          text: "text-amber-400",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: <AlertTriangle size={20} className="text-amber-400" />,
        };
      case "Low":
      default:
        return {
          bg: "bg-green-500/10 border-green-500/20 text-green-400",
          text: "text-green-400",
          badge: "bg-green-500/10 text-green-400 border-green-500/20",
          icon: <ShieldCheck size={20} className="text-green-400" />,
        };
    }
  };

  const colors = getRiskColors();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#2a2a2d] pb-3">
        <h4 className="text-[12px] font-bold text-[#ebebf5] uppercase tracking-wider">
          Privacy & Risk Analysis
        </h4>
        <span className={`px-2.5 py-0.5 text-[11px] font-bold border rounded-full ${colors.badge}`}>
          {report.riskLevel} Risk
        </span>
      </div>

      <div className={`p-4 border rounded-xl flex gap-3 ${colors.bg}`}>
        <div className="mt-0.5">{colors.icon}</div>
        <div className="space-y-1">
          <p className="text-[13px] font-bold text-white">Risk Evaluation</p>
          <p className="text-[12px] leading-relaxed text-[#ebebf5]/80">{report.explanation}</p>
        </div>
      </div>

      {report.findings.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
            Critical Findings
          </p>
          <ul className="space-y-2">
            {report.findings.map((finding, idx) => (
              <li
                key={idx}
                className="p-3 bg-[#1c1c1e] border border-[#2a2a2d] rounded-xl text-[12px] text-[#ebebf5] leading-relaxed flex items-start gap-2"
              >
                <span className="text-[#0a84ff] mt-0.5">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-3 bg-[#111112] border border-dashed border-[#2a2a2d] rounded-xl text-center text-[12px] text-[#8e8e93]">
          No privacy-sensitive metadata identified in this image.
        </div>
      )}
    </div>
  );
}
