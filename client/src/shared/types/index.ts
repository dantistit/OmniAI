export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  userId: string;
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

export interface ApiError {
  message: string;
  status?: number;
}