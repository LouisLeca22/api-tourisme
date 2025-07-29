export const CUISINES = [
  'french',
  'local',
  'vegetarian',
  'norman',
  'seafood',
  'fish',
  'organic',
  'vegan',
  'moroccan',
  'mediterranean',
  'italian',
  'japanese',
  'asian',
  'southwest',
  'bistro',
] as const;

export type Cuisine = (typeof CUISINES)[number];
