'use client';

export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center opacity-100 transition-opacity duration-500"
    >
      <div className="relative w-16 h-16">
        {/* Outer rotating circle */}
        <div className="absolute inset-0 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin" />
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
