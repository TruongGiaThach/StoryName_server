import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
  IsEthereumAddress,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateAddressesDto {
  @ApiProperty({
    description: 'EVM address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsNotEmpty()
  @IsEthereumAddress()
  '60': string;
}

class CreateTextDataDto {
  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'User`s input description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'User`s External Website URL',
    example: 'https://example.com',
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Warpcast handle',
    example: 'hayden27',
  })
  @IsOptional()
  @IsString()
  warpcast?: string;

  @ApiPropertyOptional({
    description: 'Twitter handle',
    example: '@userX',
  })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Telegram handle',
    example: '@userTel',
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Discord handle',
    example: 'user#1234',
  })
  @IsOptional()
  @IsString()
  discord?: string;
}

class CreateDataDto {
  @ApiProperty({
    description: 'EVM Address depend on Chain',
    type: CreateAddressesDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressesDto)
  addresses: CreateAddressesDto;

  @ApiPropertyOptional({
    description: 'Text data object',
    type: CreateTextDataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTextDataDto)
  text?: CreateTextDataDto;
}

export class CreateEthNameRecordDto {
  @ApiProperty({
    description: 'Story Name of the record',
    example: 'exampleName.story',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ENS name on Ethereum',
    example: 'exampleName.evm',
  })
  @IsOptional()
  @IsString()
  ethName: string;

  @ApiProperty({
    description: 'Data object containing addresses and optional text data',
    type: CreateDataDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateDataDto)
  data: CreateDataDto;
}
