export interface CardContent {
    id: number;
    title: string;
    description: string;
    spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  }
  
  export const cards: CardContent[] = [
    {
      id: 1,
      title: "Card One",
      description: "This is the first spotlight card.",
      spotlightColor: "rgba(0, 229, 255, 0.2)",
    },
    {
      id: 2,
      title: "Card Two",
      description: "Here comes another cool card.",
      spotlightColor: "rgba(255, 0, 150, 0.2)",
    },
    {
      id: 3,
      title: "Card Three",
      description: "Last but not the least!",
      spotlightColor: "rgba(0, 255, 150, 0.2)",
    },
  ];
  