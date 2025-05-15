export interface Wordset {
  id: string;
  title: string;
  description: string | null;
  wordEntries: WordEntry[];
}

export interface WordEntry {
  word: string;
  definition: string;
}
