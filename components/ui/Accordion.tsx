"use client";

import { useState, ReactNode } from "react";

interface AccordionItemData {
  title: string;
  content: ReactNode;
}

const NEON_COLORS = ["#00FF66", "#00F0FF", "#FFE600", "#FF0055", "#A855F7"];

export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItemData[]; defaultOpen?: number | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const color = NEON_COLORS[idx % NEON_COLORS.length];

        return (
          <div
            key={item.title}
            className="border-2 border-[#222] bg-[#0a0a0c] p-4 transition-all duration-300 retro-box-shadow"
            style={{ borderColor: isOpen ? color : '#222' }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between text-left group"
              aria-expanded={isOpen}
            >
              <span
                className="font-heading text-sm md:text-base uppercase tracking-wider transition-colors flex items-center gap-2"
                style={{ color: isOpen ? color : '#F5F2EF' }}
              >
                <span className="font-mono text-xs font-bold" style={{ color: color }}>0{idx + 1}.</span>
                <span>{item.title}</span>
              </span>
              <span
                className="font-mono font-bold text-sm px-2 py-0.5 border text-black transition-transform duration-300"
                style={{ backgroundColor: color, borderColor: color }}
              >
                {isOpen ? "▲" : "▼"}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 pt-3 border-t border-[#222] mt-3" : "max-h-0 opacity-0"}`}
            >
              <div className="font-mono text-xs text-[#F5F2EF]/80 leading-relaxed">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
