import React from 'react';

const CMSLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        {/* Animated Grid Background for the icon */}
        <div className="absolute inset-0 -m-8 opacity-10 pointer-events-none">
          <div className="w-full h-full border border-primary/20 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-primary/10" />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="w-20 h-20 border-2 border-emerald-50 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">
              database
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary" />
                <div className="w-1.5 h-1.5 bg-primary" />
                <div className="w-1.5 h-1.5 bg-primary" />
            </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary ml-1">
            Loading Data
          </span>
          <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-stone-400">
            Digital Architect Architecture
          </span>
        </div>
      </div>
    </div>
  );
};

export default CMSLoader;
