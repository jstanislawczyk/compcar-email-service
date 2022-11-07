import {IsNotEmpty, IsString} from 'class-validator';

export abstract class EmailDto {

  @IsString()
  @IsNotEmpty()
  public readonly receiverAddress: string;

  @IsString()
  @IsNotEmpty()
  public readonly subject: string;

  @IsString()
  @IsNotEmpty()
  public readonly html: string;

  @IsString()
  @IsNotEmpty()
  public readonly text: string;
}
