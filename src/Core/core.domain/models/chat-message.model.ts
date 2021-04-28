import { ChatUser } from './chat-user.model';
export interface ChatMessage {
  message: string;
  sender: ChatUser;
}
