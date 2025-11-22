export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  
  summarize(text: string, options?: SummarizeOptions): Promise<string>;
  extractKeywords(text: string, limit?: number): Promise<string[]>;
  
  recognizeText(image: Blob | string): Promise<string>;
  
  semanticSearch?(query: string, documents: string[]): Promise<number[]>;
}

export interface SummarizeOptions {
  maxLength?: number;
  style?: 'brief' | 'detailed' | 'bullet-points';
}

export interface OCRResult {
  text: string;
  confidence: number;
  blocks?: {
    text: string;
    bbox: { x: number; y: number; width: number; height: number };
    confidence: number;
  }[];
}

export interface KeywordExtractionResult {
  keyword: string;
  score: number;
}
