import {IsNotEmpty, IsString} from 'class-validator';

export abstract class EmailDto {

  @IsString()
  @IsNotEmpty()
  public receiverAddress: string;

  @IsString()
  @IsNotEmpty()
  public subject: string;

  @IsString()
  @IsNotEmpty()
  public html: string;

  @IsString()
  @IsNotEmpty()
  public text: string;
}
