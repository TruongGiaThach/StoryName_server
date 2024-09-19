import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryFilterChainDto {
  @ApiPropertyOptional({
    description: 'Chain ID of the blockchain',
  })
  @IsOptional()
  @IsString()
  chainId?: string;

  @ApiPropertyOptional({
    description: 'Name of the blockchain',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Symbol of the blockchain',
  })
  @IsOptional()
  @IsString()
  symbol?: string;
}
