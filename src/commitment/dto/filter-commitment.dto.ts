import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEthereumAddress } from 'class-validator';

export class QueryFilterCommitmentDto {
  @ApiPropertyOptional({
    description: 'ID of the commitment',
  })
  @IsOptional()
  @IsString()
  readonly id?: string;

  @ApiPropertyOptional({
    description: 'User address associated with the commitment',
  })
  @IsOptional()
  @IsEthereumAddress()
  readonly userAddress?: string;

  @ApiPropertyOptional({
    description: 'Name of the commitment',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;
}
