import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  roomId: string;

  @IsString()
  content: string;

  @IsString()
  sender_id: string;
}
