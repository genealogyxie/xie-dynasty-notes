export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  definitions: string[];
  synonyms?: string[];
  antonyms?: string[];
  examples?: string[];
  etymology?: string;
}

export interface DictionaryResult {
  word: string;
  entries: DictionaryEntry[];
  suggestions?: string[];
}
