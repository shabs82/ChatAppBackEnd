import { Injectable } from '@nestjs/common';
import { ChatUser } from '../core.domain/models/chat-user.model';
import { ChatMessage } from '../core.domain/models/chat-message.model';
import { IChatService } from '../core.domain/primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../infrastructure/data-source/entities/user';
import { Repository } from "typeorm";
import { error } from "next/dist/build/output/log";
import { json } from "express";

@Injectable()
export class ChatService implements IChatService {
  allMessages: ChatMessage[] = [];
  users: ChatUser[] = [];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  addMessage(message: string, userid: string): ChatMessage {
    const user = this.users.find((u) => u.id === userid);
    const chatMessage: ChatMessage = { message: message, sender: user};
    this.allMessages.push(chatMessage); // all messages being sent from front end is saved on local array.
    return chatMessage;
  }

  async addUser(id: string, username: string):Promise<ChatUser>  {
    const userDb = await this.userRepository.findOne({username: username})
    if(!userDb){
      let user = this.userRepository.create();
      user.id = id;
      user.username = username;
      user = await this.userRepository.save(user)
      return {id: user.id, username: user.username};
    }
    if(userDb.id === id){
      return {id: userDb.id , username: userDb.username};
    }else{
      throw new Error('username already in use');
    }

  }

  async getUsers():Promise<ChatUser[]> {
    const users = await  this.userRepository.find()
    const chatUsers : ChatUser[] = JSON.parse(JSON.stringify(users));
    return chatUsers;

  }

  getAllMessages(): ChatMessage[] {
    return this.allMessages;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({id: id});
  }

  userIsTyping(typing: boolean, id: string): ChatUser {
    const chatUser = this.users.find((u) => u.id === id);
    if (chatUser && chatUser.typing !== typing) {
      chatUser.typing = typing;
      return chatUser;
    }
  }
}
