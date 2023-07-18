export interface AudioAsset {
  type: 'audio';
  src: string;
  trim: number;
  volume: number;
  effect?: 'fadeIn' | 'fadeOut' | 'fadeInFadeOut';
}
