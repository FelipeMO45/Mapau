// src/components/Tabs.tsx
import React, { ReactNode, useState } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
   <div className="w-full">
     {/* Tab list */}
  <div className="border-b overflow-x-auto">
      <ul className="flex whitespace-nowrap justify-center mx-auto max-w-max">
          {tabs.map((tab, idx) => (
            <li key={idx} className="mr-2 last:mr-0">
              <button
                onClick={() => setActiveIndex(idx)}
                className={`
                  py-2 px-4 text-sm font-medium
                  ${activeIndex === idx
                    ? 'border-b-2 border-white-600 text-[#D89216]'
                    : 'text-white-600 hover:text-[#D89216]'}
                  transition
                `}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Panels */}
      <div className="pt-4">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            role="tabpanel"
            hidden={idx !== activeIndex}
            className=""
          >
            {idx === activeIndex && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
