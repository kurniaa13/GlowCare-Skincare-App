// Codelab-1 Modul 3 (Character Explorer).
// Bentuk data dari External API Jikan (https://api.jikan.moe/v4), sebagian field saja.

export interface CharacterImages {
  jpg: { image_url: string };
  webp?: { image_url: string; small_image_url?: string };
}

export interface Character {
  mal_id: number;
  url: string;
  images: CharacterImages;
  name: string;
  name_kanji: string | null;
  nicknames: string[];
  favorites: number;
  about: string | null;
}

// Response mentah Jikan: daftar karakter dan satu karakter.
export interface CharacterListResponse {
  data: Character[];
}

export interface CharacterDetailResponse {
  data: Character;
}
