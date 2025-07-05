import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: 'roomId không được trống' })
  @IsString()
  roomId: string;

  @IsNotEmpty({ message: 'roomId không được trống' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'senderId không được trống' })
  @IsString()
  senderId: string;
}
