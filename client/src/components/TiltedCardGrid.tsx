// TiltedCardGrid.tsx

import TiltedCard from "@/components/TiltedCard";
import { cardsData } from "@/constants/cardsData";

export default function TiltedCardGrid() {
  return (
    <div className="w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">

      {cardsData.map((card, index) => (
        <TiltedCard
          key={index}
          imageSrc={card.imageSrc}
          altText={card.altText}
          captionText={card.captionText}
          imageHeight="300px"
          imageWidth="100%"
          containerHeight="320px"
          containerWidth="100%"
          scaleOnHover={1.1}
          rotateAmplitude={14}
        />
      ))}
    </div>
  );
}
