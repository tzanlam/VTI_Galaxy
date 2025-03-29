import React from "react";

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white p-4 rounded-lg w-[80%] max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-2xl font-bold"
        >
          ×
        </button>
        <iframe
          width="100%"
          height="400"
          src={trailerUrl}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
