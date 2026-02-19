import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from '../gemini/gemini.service';

type OKRUpdateEvent = {
  id: string;
  title: string;
  keyResults: { description: string }[];
};

@Injectable()
export class OKREmbeddingListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  @OnEvent('okr.changed', { async: true })
  async handleOKRChanged(event: OKRUpdateEvent) {
    const store = await this.geminiService.getVectorStore();

    const combinedText = `Objective: ${event.title}
    Key Results:
    ${event.keyResults.map((kr) => kr.description).join('\n')}
    `.trim();

    await this.prisma.document.deleteMany({
      where: { objectiveId: event.id },
    });

    const createdDoc = await this.prisma.document.create({
      data: {
        content: combinedText,
        objectiveId: event.id,
        metadata: {
          objectiveId: event.id,
          title: event.title,
          keyResults: event.keyResults.map((kr) => kr.description),
        },
      },
    });

    await store.addModels([createdDoc]);
  }
}
