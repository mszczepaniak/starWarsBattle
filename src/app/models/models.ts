export interface Person {
  name?: string;
  birth_year?: string;
  eye_color?: string;
  gender?: string;
  hair_color?: string;
  height?: string;
  mass?: string;
  skin_color?: string;
  homeworld?: string;
  url?: string;
  created?: string;
  edited?: string;
}

export interface Starship {
  name?: string;
  model?: string;
  starship_class?: string;
  manufacturer?: string;
  cost_in_credits?: string;
  length?: string;
  crew?: string;
  passengers?: string;
  max_atmosphering_speed?: string;
  MGLT?: string;
  cargo_capacity?: string;
  url?: string;
  created?: string;
  edited?: string;
}

export type StarWarsItem = Person | Starship;

export interface ApiResponse<T> {
  result: {
    properties: T;
  };
}

export type ResourceType = 'people' | 'starships';

export interface Card {
  properties: StarWarsItem;
}

export type Winner = 'left' | 'right' | 'draw' | null;
