import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: 'roomId không được trống' })
  roomId: string;

  @IsNotEmpty({ message: 'roomId không được trống' })
  content: string;

  @IsNotEmpty({ message: 'senderId không được trống' })
  senderId: string;
}
