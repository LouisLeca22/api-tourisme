export const AMENITIES = [
  'wifi',
  'pool',
  'parking',
  'air_conditioning',
  'breakfast',
  'fireplace',
  'restaurant',
  'ski_storage',
  'sea_view',
  'terrace',
  'lake_view',
  'garden',
] as const;

export type Amenity = (typeof AMENITIES)[number];
