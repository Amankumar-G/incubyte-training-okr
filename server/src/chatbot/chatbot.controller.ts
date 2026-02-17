import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Get('reset')
  async resetChat() {
    await this.chatbotService.resetChat();
    return { message: 'Chat session reset successfully' };
  }
}
