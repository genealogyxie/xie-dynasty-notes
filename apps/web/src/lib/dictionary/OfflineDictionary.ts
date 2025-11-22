import Dexie, { Table } from 'dexie';
import { DictionaryEntry, DictionaryResult } from './types';

interface StoredEntry {
  word: string;
  data: DictionaryEntry[];
}

class DictionaryDatabase extends Dexie {
  entries!: Table<StoredEntry>;

  constructor() {
    super('XieDynastyDictionary');
    
    this.version(1).stores({
      entries: 'word',
    });
  }
}

export class OfflineDictionary {
  private db: DictionaryDatabase;
  private isLoaded: boolean = false;

  constructor() {
    this.db = new DictionaryDatabase();
  }

  /**
   * Load dictionary data from a JSON file or API
   * This would be called on first use or during app initialization
   */
  async loadDictionary(data: StoredEntry[]): Promise<void> {
    await this.db.entries.bulkPut(data);
    this.isLoaded = true;
  }

  /**
   * Check if dictionary is loaded
   */
  async isReady(): Promise<boolean> {
    if (this.isLoaded) return true;
    
    const count = await this.db.entries.count();
    this.isLoaded = count > 0;
    return this.isLoaded;
  }

  /**
   * Look up a word in the offline dictionary
   */
  async lookup(word: string): Promise<DictionaryResult | null> {
    const normalizedWord = word.toLowerCase().trim();
    
    const entry = await this.db.entries.get(normalizedWord);
    if (entry) {
      return {
        word: normalizedWord,
        entries: entry.data,
      };
    }

    const variations = this.getWordVariations(normalizedWord);
    for (const variation of variations) {
      const varEntry = await this.db.entries.get(variation);
      if (varEntry) {
        return {
          word: variation,
          entries: varEntry.data,
        };
      }
    }

    const suggestions = await this.findSimilarWords(normalizedWord);
    
    return {
      word: normalizedWord,
      entries: [],
      suggestions,
    };
  }

  /**
   * Get word variations (basic lemmatization)
   */
  private getWordVariations(word: string): string[] {
    const variations: string[] = [];
    
    if (word.endsWith('s')) {
      variations.push(word.slice(0, -1)); // books -> book
    }
    if (word.endsWith('es')) {
      variations.push(word.slice(0, -2)); // boxes -> box
    }
    if (word.endsWith('ed')) {
      variations.push(word.slice(0, -2)); // walked -> walk
      variations.push(word.slice(0, -1)); // smiled -> smile
    }
    if (word.endsWith('ing')) {
      variations.push(word.slice(0, -3)); // walking -> walk
      variations.push(word.slice(0, -3) + 'e'); // smiling -> smile
    }
    if (word.endsWith('ly')) {
      variations.push(word.slice(0, -2)); // quickly -> quick
    }
    if (word.endsWith('er')) {
      variations.push(word.slice(0, -2)); // bigger -> big
      variations.push(word.slice(0, -1)); // faster -> fast
    }
    if (word.endsWith('est')) {
      variations.push(word.slice(0, -3)); // biggest -> big
      variations.push(word.slice(0, -2)); // fastest -> fast
    }
    
    return variations;
  }

  /**
   * Find similar words using prefix matching
   */
  private async findSimilarWords(word: string, limit: number = 5): Promise<string[]> {
    const prefix = word.slice(0, Math.min(3, word.length));
    const entries = await this.db.entries
      .where('word')
      .startsWith(prefix)
      .limit(limit)
      .toArray();
    
    return entries.map(e => e.word);
  }

  /**
   * Search for words matching a pattern
   */
  async search(query: string, limit: number = 20): Promise<string[]> {
    const normalizedQuery = query.toLowerCase().trim();
    
    const entries = await this.db.entries
      .where('word')
      .startsWith(normalizedQuery)
      .limit(limit)
      .toArray();
    
    return entries.map(e => e.word);
  }

  /**
   * Get random word (for "word of the day" feature)
   */
  async getRandomWord(): Promise<DictionaryResult | null> {
    const count = await this.db.entries.count();
    if (count === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * count);
    const entry = await this.db.entries.offset(randomIndex).first();
    
    if (entry) {
      return {
        word: entry.word,
        entries: entry.data,
      };
    }
    
    return null;
  }

  /**
   * Clear dictionary data
   */
  async clear(): Promise<void> {
    await this.db.entries.clear();
    this.isLoaded = false;
  }
}

/**
 * Sample dictionary data generator
 * In production, this would be replaced with actual WordNet/Wiktionary data
 */
export function generateSampleDictionary(): StoredEntry[] {
  return [
    {
      word: 'note',
      data: [
        {
          word: 'note',
          partOfSpeech: 'noun',
          definitions: [
            'A brief record of something written down to assist the memory or for future reference',
            'A short informal letter or written message',
            'A single tone of definite pitch made by a musical instrument or voice',
          ],
          synonyms: ['memo', 'reminder', 'annotation', 'comment'],
          examples: [
            'I made a note of her address',
            'She left a note on the kitchen table',
          ],
        },
        {
          word: 'note',
          partOfSpeech: 'verb',
          definitions: [
            'Notice or pay particular attention to something',
            'Record something in writing',
          ],
          synonyms: ['observe', 'notice', 'record', 'write down'],
          examples: [
            'Please note that the meeting has been rescheduled',
            'He noted the time in his diary',
          ],
        },
      ],
    },
    {
      word: 'notebook',
      data: [
        {
          word: 'notebook',
          partOfSpeech: 'noun',
          definitions: [
            'A book of blank or ruled pages for writing notes in',
            'A portable computer smaller than a laptop',
          ],
          synonyms: ['notepad', 'journal', 'diary', 'laptop'],
          examples: [
            'She pulled out her notebook and started writing',
            'I carry my notebook everywhere for work',
          ],
        },
      ],
    },
    {
      word: 'organize',
      data: [
        {
          word: 'organize',
          partOfSpeech: 'verb',
          definitions: [
            'Arrange systematically; order',
            'Make arrangements or preparations for an event or activity',
            'Form or be formed into a structured whole',
          ],
          synonyms: ['arrange', 'order', 'structure', 'systematize', 'coordinate'],
          antonyms: ['disorganize', 'disorder', 'confuse'],
          examples: [
            'She organized her notes by topic',
            'They organized a conference for next month',
          ],
        },
      ],
    },
    {
      word: 'write',
      data: [
        {
          word: 'write',
          partOfSpeech: 'verb',
          definitions: [
            'Mark coherent words on paper or another surface',
            'Compose text for publication',
            'Enter data into a computer or storage device',
          ],
          synonyms: ['compose', 'author', 'pen', 'record', 'inscribe'],
          examples: [
            'She writes in her journal every day',
            'He writes novels for a living',
          ],
        },
      ],
    },
    {
      word: 'document',
      data: [
        {
          word: 'document',
          partOfSpeech: 'noun',
          definitions: [
            'A piece of written, printed, or electronic matter that provides information or evidence',
            'A computer file containing text or data',
          ],
          synonyms: ['record', 'paper', 'file', 'certificate'],
          examples: [
            'Please sign the document',
            'Save the document before closing',
          ],
        },
        {
          word: 'document',
          partOfSpeech: 'verb',
          definitions: [
            'Record something in written, photographic, or other form',
            'Support or accompany with documentation',
          ],
          synonyms: ['record', 'chronicle', 'register', 'log'],
          examples: [
            'The photographer documented the event',
            'Make sure to document your findings',
          ],
        },
      ],
    },
  ];
}
