import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AssistanceService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async guide(mode: string, screenTexts: string[]) {
    const instruction = this.aiService.generateInstruction(mode, screenTexts);

    const session = await this.prisma.session.create({
      data: {
        mode,
        instructions: { instruction },
      },
    });

    return {
      sessionId: session.id,
      instruction,
    };
  }
}