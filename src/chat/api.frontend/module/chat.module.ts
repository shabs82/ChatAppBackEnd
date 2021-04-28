import { Module } from '@nestjs/common';
import { chatGateway } from '../gateways/chatGateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../infrastructure/data-source/entities/user';
import { IChatServiceProvider } from '../../../Core/core.domain/primary-ports/chat.service.interface';
import { ChatService } from '../../../Core/services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    chatGateway,
    {
      provide: IChatServiceProvider,
      useClass: ChatService,
    },
  ],
})
export class ChatModule {}
