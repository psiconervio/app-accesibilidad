import { Module } from '@nestjs/common';
import { AssistanceController } from './assistance.controller';
import { AssistanceService } from './assistance.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [AssistanceController],
  providers: [AssistanceService, PrismaService],
})
export class AssistanceModule {}