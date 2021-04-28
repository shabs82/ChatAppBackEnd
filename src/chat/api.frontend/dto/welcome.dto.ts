import { ChatUser } from '../../../Core/core.domain/models/chat-user.model';
import { ChatMessage } from '../../../Core/core.domain/models/chat-message.model';

export interface WelcomeDto {
  users: ChatUser[];
  user: ChatUser;
  messages: ChatMessage[];
}
