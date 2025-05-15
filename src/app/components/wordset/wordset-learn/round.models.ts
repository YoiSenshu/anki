import { WordEntry } from "../../../models/wordset.model";

export interface Round {
    elements: RoundElement[]
}

export interface RoundElement {
    type: 'flashcard' | 'quiz' | 'definition';
    wordEntry: WordEntry;
}
