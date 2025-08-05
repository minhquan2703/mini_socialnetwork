import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'type was not allowed to empty' })
  type: string;

  @IsNotEmpty({ message: 'id was not allowed to empty' })
  id: string;

  @IsNotEmpty({ message: 'reason was not allowed to empty' })
  reason: string;

  @IsNotEmpty({ message: 'content was not allowed to empty' })
  content: string;
}
