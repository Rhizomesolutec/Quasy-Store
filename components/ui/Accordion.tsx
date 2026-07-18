"use client";

import { useState, ReactNode } from "react";

interface AccordionItemData {
  title: string;
  content: ReactNode;
}

export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItemData[]; defaultOpen?: number | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between py-4 text-left group"
              aria-expanded={isOpen}
            >
              <span className="font-heading text-sm md:text-base text-[#F5F2EF] uppercase tracking-wider group-hover:text-[#E50914] transition-colors">
                {item.title}
              </span>
              <span
                className={`text-[#E50914] text-lg leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"}`}
            >
              <div className="font-sans text-sm text-[#F5F2EF]/60 leading-relaxed">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
