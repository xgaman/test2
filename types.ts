
export enum Step {
  Welcome = 0,
  Wish = 1,
  Apology = 2,
  Appreciation = 3,
  Gift = 4,
  Final = 5
}

export interface CardData {
  title: string;
  icon: string;
  color: string;
}
