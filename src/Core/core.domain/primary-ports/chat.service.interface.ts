import { ChatMessage } from '../models/chat-message.model';
import { ChatUser } from '../models/chat-user.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  addMessage(message: string, clientId: string): ChatMessage;

  addUser(id: string, username: string): Promise<ChatUser>;

  getUsers(): Promise<ChatUser[]>;

  getAllMessages(): ChatMessage[];

  deleteUser(id: string): Promise<void>;

  userIsTyping(typing: boolean, id: string): ChatUser;
}
