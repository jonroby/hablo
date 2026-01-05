export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  corrected?: string;
  translation?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
