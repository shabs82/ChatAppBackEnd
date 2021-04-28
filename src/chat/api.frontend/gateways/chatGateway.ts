import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../../../Core/services/chat.service';
import { WelcomeDto } from '../dto/welcome.dto';
import {
  IChatService,
  IChatServiceProvider,
} from '../../../Core/core.domain/primary-ports/chat.service.interface';
import { Inject } from '@nestjs/common';

@WebSocketGateway()
export class chatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@Inject(IChatServiceProvider) private chatService: IChatService){}
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleChatEvent(
    @MessageBody() message: string,
    @ConnectedSocket() user: Socket,
  ): void {
    const chatMsg = this.chatService.addMessage(message, user.id);
    this.server.emit('newMessage', chatMsg);
  }
  @SubscribeMessage('typing')
  handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() user: Socket,
  ): void {
    const chatUser = this.chatService.userIsTyping(typing, user.id);
    if (chatUser) {
      this.server.emit('user is typing...', chatUser);
    }
  }
  @SubscribeMessage('username')
  async handleUserNameEvent(
    @MessageBody() username: string,
    @ConnectedSocket() user: Socket,
  ): Promise <void> {
    try {
      const chatUser = await this.chatService.addUser(user.id, username);
      const chatUsers = await this.chatService.getUsers();
      const welcome: WelcomeDto = {
        users: chatUsers,
        messages: this.chatService.getAllMessages(),
        user: chatUser,
      };
      user.emit('welcome', welcome);
      this.server.emit('users', chatUsers);
    } catch (e) {
      user.error(e.message);
    }

  }
  async handleConnection(user: Socket, ...args): Promise<any> {
    this.server.emit('allMessages', this.chatService.getAllMessages());
    this.server.emit('allUsers', await this.chatService.getUsers()); // when a new user joins in, all messages are displayed fo them
  }
  async handleDisconnect(user: any): Promise<any> {
    await this.chatService.deleteUser(user.id);
    this.server.emit('user', await this.chatService.getUsers());
  }
}
