import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty({ message: 'roomId không được trống' })
  roomId: string;

  @IsOptional()
  content: string;
}

export class GetMessagesPaginationDto {
  cursor?: string; // ID của tin nhắn cũ nhất hiện tại
  limit?: number = 20; // Số lượng tin nhắn muốn load
}
