import React, { useEffect, useState } from "react";

const CreativeLoading = ({ loading = true }) => {
  const [progress, setProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (!loading) return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 120);

    // Cycle through animation phases
    const phaseInterval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(phaseInterval);
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="relative w-64 h-64">
        {/* Animated Cinema Ticket */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative bg-white rounded-lg w-56 h-32 overflow-hidden shadow-lg transform rotate-6 animate-pulse">
            {/* Ticket Top */}
            <div className="h-3/4 p-4 bg-gradient-to-r from-orange-400 to-orange-600">
              <div className="flex justify-between">
                <div className="text-white font-bold">GALAXY</div>
                <div className="text-white text-xs">Cinema</div>
              </div>

              {/* Seat Animation */}
              <div className="mt-4 flex justify-center space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm border border-white ${
                      animationPhase === i % 4 ? "bg-white" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Ticket Bottom */}
            <div className="h-1/4 bg-gray-100 border-t border-dashed border-gray-400 flex items-center justify-center">
              <div className="text-orange-500 text-xs font-semibold">
                {progress < 100 ? `${progress}%` : "Ready!"}
              </div>
            </div>
          </div>
        </div>

        {/* Orbital Loading Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
          <div
            className="absolute w-48 h-48 rounded-full border-4 border-transparent border-l-orange-300 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "3s" }}
          />
          <div
            className="absolute w-32 h-32 rounded-full border-4 border-transparent border-b-orange-600 animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Popcorn Animation */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="relative w-24 h-24">
            {/* Popcorn Bucket */}
            <div className="absolute bottom-0 w-20 h-14 bg-gradient-to-b from-red-500 to-red-600 rounded-b-lg left-1/2 transform -translate-x-1/2"></div>

            {/* Popcorn Pieces */}
            {[...Array(12)].map((_, i) => {
              const randomLeft = 4 + Math.random() * 16;
              const delay = Math.random() * 2;
              const duration = 1 + Math.random() * 1;

              return (
                <div
                  key={i}
                  className="absolute bottom-10 w-3 h-3 bg-yellow-100 rounded-full"
                  style={{
                    left: `${randomLeft}px`,
                    animation: `pop-up ${duration}s ease-out ${delay}s infinite`,
                    opacity: animationPhase % 2 === 0 ? 1 : 0.7,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-8 text-white font-medium">Đang tải dữ liệu...</p>
      <p className="mt-2 text-orange-300 text-sm animate-pulse">
        Mời bạn thưởng thức bắp trước khi phim bắt đầu
      </p>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pop-up {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-30px);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CreativeLoading;
