import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: 'roomId không được trống' })
  roomId: string;

  @IsOptional()
  content: string;
}
