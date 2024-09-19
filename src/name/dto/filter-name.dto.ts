import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryFilterNameDto {
  @ApiPropertyOptional({ description: 'ID of the name' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'The name value' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Hash of the name' })
  @IsOptional()
  @IsString()
  nameHash?: string;

  @ApiPropertyOptional({
    description: 'Owner address associated with the name',
  })
  @IsOptional()
  @IsString()
  owner?: string;
}
