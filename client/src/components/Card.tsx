import React from "react";

interface CardProps {
  name: string;
  institute: string;
  field: string;
  research: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ name, institute, field, research, image }) => {
  return (
    <div className="relative w-full sm:w-1/2 lg:w-1/3 p-4">
      <div
        className="relative overflow-hidden bg-black text-white rounded-2xl shadow-lg p-6"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>

        <div className="relative z-10 text-left">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-lg font-semibold">{institute}</p>
          <p className="text-sm opacity-80">{field}</p>
          <p className="text-sm opacity-80">{research}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
