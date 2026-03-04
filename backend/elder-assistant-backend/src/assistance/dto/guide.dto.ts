import { IsArray, IsString } from 'class-validator';

export class GuideDto {
  @IsString()
  mode: string;

  @IsArray()
  screenTexts: string[];
}