import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryFilterRecordDto {
  @ApiPropertyOptional({
    description: 'ID of the EthNameRecord',
  })
  @IsOptional()
  @IsString()
  readonly id?: string;

  @ApiPropertyOptional({
    description: 'Name of the User',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'The User`s Name on Ethereum',
  })
  @IsOptional()
  @IsString()
  readonly ethName?: string;
}
