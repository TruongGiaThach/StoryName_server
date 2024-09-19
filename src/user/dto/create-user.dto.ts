import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly userAddress?: string;

  @IsOptional()
  @IsString()
  readonly secret?: Buffer;

  @IsOptional()
  @IsUUID()
  readonly nonce?: string;
}
