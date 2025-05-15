import { WordEntry, Wordset } from "./wordset.model"

export interface Progress {
    id: string,
    wordsetId: string,
    progress: {
            flashcard: string[],
            quizWrong: string[],
            quizCorrect: string[],
            definitionWrong: string[],
            definitionCorrect: string[]
    }
}

export type ProgressType = 'not shown' | 'flashcard' | 'quizWrong' | 'quizCorrect' | 'definitionWrong' | 'definitionCorrect';

export type LearningElementType = 'flashcard' | 'quiz' | 'definition';

export function getEntryProgress(progress: Progress, entry: WordEntry): ProgressType {
    if(progress.progress.flashcard.includes(entry.word)) {
        return 'flashcard';
    }
    if(progress.progress.quizWrong.includes(entry.word)) {
        return 'quizWrong';
    }
    if(progress.progress.quizCorrect.includes(entry.word)) {
        return 'quizCorrect';
    }
    if(progress.progress.definitionWrong.includes(entry.word)) {
        return 'definitionWrong';
    }
    if(progress.progress.definitionCorrect.includes(entry.word)) {
        return 'definitionCorrect';
    }
    return 'not shown';
}

export function getLearningElementType(progress: ProgressType): LearningElementType {
    switch(progress) {
        case 'not shown':
            return 'flashcard';
        case 'flashcard':
            return 'quiz';
        case 'quizWrong':
            return 'quiz';
        case 'quizCorrect':
            return 'definition';
        case 'definitionWrong':
            return 'definition';
        case 'definitionCorrect':
            return 'definition';
    }
}

export function calculateProgress(wordset: Wordset, progress: Progress): number {

    if (!wordset || !progress) {
        return 0;
    }

    const totalWordsInProgress = 
        0.2 * progress.progress.flashcard.length +
        0.4 * progress.progress.quizWrong.length +
        0.6 * progress.progress.quizCorrect.length +
        0.8 * progress.progress.definitionWrong.length +
        1.0 * progress.progress.definitionCorrect.length;
        
    const totalWords = wordset.wordEntries.length;

    if (totalWords === 0) {
        return 0;
    } else {
        return Math.ceil((totalWordsInProgress / totalWords) * 100);
    }
}