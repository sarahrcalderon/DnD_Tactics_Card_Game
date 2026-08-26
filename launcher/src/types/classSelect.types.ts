export interface ClassAttributes {
  cha: number;
  win: number;
  for: number;
  dex: number;
  int: number;
}

export interface ClassData {
  id: string;
  name: string;
  icon: string;
  image: string;
  color: string;
  description: string;
  attributes: ClassAttributes;
  pros: string[];
  cons: string[];
}