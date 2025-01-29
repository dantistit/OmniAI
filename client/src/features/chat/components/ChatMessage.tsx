import { type ChatMessage as ChatMessageType } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div
      className={`p-4 rounded-lg mb-4 ${
        isAssistant ? 'bg-blue-100 ml-4' : 'bg-gray-100 mr-4'
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium text-gray-900">
          {isAssistant ? 'AI Assistant' : 'You'}
        </span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="mt-2 text-gray-700">{message.content}</p>
    </div>
  );
}