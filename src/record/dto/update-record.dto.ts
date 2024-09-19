import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsOptional,
  IsEthereumAddress,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class CreateAddressesDto {
  @ApiPropertyOptional({
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
    example: 'User’s input description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'User’s External Website URL',
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateDataDto {
  @ApiPropertyOptional({
    description: 'EVM Address depending on Chain',
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

export class UpdateEthNameRecordDto {
  @ApiPropertyOptional({
    description: 'Story Name of the record',
    example: 'exampleName.story',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'ENS name on Ethereum',
    example: 'exampleName.evm',
  })
  @IsOptional()
  @IsString()
  readonly ethName?: string;

  @ApiPropertyOptional({
    description: 'EVM Address depending on Chain',
    type: CreateAddressesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressesDto)
  readonly addresses?: CreateAddressesDto;

  @ApiPropertyOptional({
    description: 'Text data object',
    type: CreateTextDataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTextDataDto)
  readonly text?: CreateTextDataDto;
}
