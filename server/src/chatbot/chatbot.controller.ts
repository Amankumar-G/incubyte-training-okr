import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}
  @Post()
  async handleChat(@Body() chatRequest: { message: string }) {
    const response = await this.chatbotService.handleChat(chatRequest.message);
    if (!response) {
      return { message: 'No response from chatbot' };
    }
    return { message: response };
  }
}
