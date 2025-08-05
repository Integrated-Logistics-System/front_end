// Chat 컴포넌트 통합 export

export { ChatMessage } from './ChatMessage';
export { ChatInput } from './ChatInput';
export { QuickReplies, QuickReplyButton } from './QuickReplies';

// 타입들도 re-export
export type {
  ChatMessage as IChatMessage,
  QuickReply,
  WebSocketMessage,
  ConnectionStatus,
  ChatError,
  ChatState,
  UserChatState,
} from '@/types/chat.types';