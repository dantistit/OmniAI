import { render, screen } from '@testing-library/react';
import ChatMessage from '@features/chat/components/ChatMessage';
import type { ChatMessage as ChatMessageType } from '@shared/types';

describe('ChatMessage Component', () => {
  const mockMessage: ChatMessageType = {
    id: '1',
    content: 'Hello, how can I help you?',
    role: 'assistant',
    createdAt: new Date().toISOString(),
    userId: 'user-1'
  };

  test('renders message content', () => {
    render(<ChatMessage message={mockMessage} />);
    expect(screen.getByText(mockMessage.content)).toBeInTheDocument();
  });

  test('applies correct styling based on role', () => {
    const { container } = render(<ChatMessage message={mockMessage} />);
    const messageElement = container.firstChild;
    
    expect(messageElement).toHaveClass(
      mockMessage.role === 'assistant' ? 'bg-blue-100' : 'bg-gray-100'
    );
  });
});