// cardsData.ts

import Making1 from "/assets/TheMaking/the-making-1.png";
import Making2 from "/assets/TheMaking/the-making-2.png";
import Making3 from "/assets/TheMaking/the-making-3.png";

export interface CardData {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  overlayContent?: React.ReactNode;
}

export const cardsData: CardData[] = [
  {
    imageSrc: Making3,
    altText: "The Making -Part 3",
    captionText: "Coding Work",
  },
  {
    imageSrc: Making2,
    altText: "The Making -Part 2",
    captionText: "Designing",
  },
  {
    imageSrc: Making1,
    altText: "The Making -Part 1",
    captionText: "The Idea",
  },
];
