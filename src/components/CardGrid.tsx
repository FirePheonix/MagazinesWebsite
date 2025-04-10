import React from "react";
import SpotlightCard from "@/components/spotlightCard";
import { cards } from "@/constants/CardData";

const CardGrid: React.FC = () => {
  return (
    <div className="w-[85%] mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
      {cards.map((card) => (
        <SpotlightCard
          key={card.id}
          spotlightColor={card.spotlightColor}
          className="min-h-[180px]"
        >
          <h2 className="text-xl font-bold text-white mb-2">{card.title}</h2>
          <p className="text-neutral-400">{card.description}</p>
        </SpotlightCard>
      ))}
    </div>
  );
};

export default CardGrid;
