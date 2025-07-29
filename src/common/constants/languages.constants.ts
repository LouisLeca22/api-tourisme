export const LANGUAGES = [
  'fr', // Français
  'en', // Anglais
  'de', // Allemand
  'es', // Espagnol
  'it', // Italien
  'pt', // Portugais
  'nl', // Néerlandais
  'ru', // Russe
  'zh', // Chinois
  'ja', // Japonais
  'ar', // Arabe
  'tr', // Turc
  'pl', // Polonais
  'sv', // Suédois
  'no', // Norvégien
  'fi', // Finnois
  'el', // Grec
  'da', // Danois
  'cs', // Tchèque
  'ro', // Roumain
  'hu', // Hongrois
  'sk', // Slovaque
] as const;

export type Language = (typeof LANGUAGES)[number];
