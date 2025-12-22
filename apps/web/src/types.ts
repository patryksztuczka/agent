export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  category?: string;
}
