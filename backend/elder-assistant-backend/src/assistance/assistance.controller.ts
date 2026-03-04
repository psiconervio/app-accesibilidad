import { Controller, Post, Body } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { GuideDto } from './dto/guide.dto';

@Controller('assistance')
export class AssistanceController {
  constructor(private readonly assistanceService: AssistanceService) {}

  @Post('guide')
  guide(@Body() body: GuideDto) {
    return this.assistanceService.guide(body.mode, body.screenTexts);
  }
}