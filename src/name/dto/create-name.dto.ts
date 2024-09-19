import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsHexadecimal,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNameDto {
  @ApiProperty({
    description: 'The ID of the wrapped name token (ERC1155)',
    example:
      '0x91b4480e97a5b9019d4d1b57d91f8ed08a096a274b0a2baa0ec3ffb6b3b04125',
  })
  @IsNotEmpty()
  @IsString()
  readonly wrappedNameTokenId: string;

  @ApiProperty({
    description: 'The ID of the name token (ERC721)',
    example:
      '65903892835380288152772587958418370832903440178584106568354280497978461405477',
  })
  @IsNotEmpty()
  @IsString()
  readonly unwrappedNameTokenId: string;

  @ApiProperty({
    description: 'The user`s ENS name',
    example: 'examplenName.story',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The hash of the ENS name',
    required: false,
  })
  @IsHexadecimal()
  readonly nameHash: string;

  @ApiProperty({
    description: 'The label of the ENS name. Without TLD (.story)',
    example: 'examplenName',
  })
  @IsNotEmpty()
  @IsString()
  readonly label: string;

  @ApiProperty({
    description:
      'The hash of the label. Server will hash it based on the label above',
    example:
      '0xbbd0b0f86948e88358987e430e8cffd3d41367575012e26c89daba6bbbdd2dea',
  })
  @IsString()
  @IsHexadecimal()
  @IsOptional()
  readonly labelHash: string;

  @ApiProperty({
    description: 'Indicates if the name is wrapped',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isWrapped: boolean;

  @ApiProperty({
    description: 'Blockchain network of the Name Service',
    example: 'Story',
  })
  @IsNotEmpty()
  @IsString()
  readonly chain: string;

  @ApiProperty({
    description: 'The metadata URL for the wrapped name',
    example:
      'https://storyname-server.onrender.com/metadata/wrapped-name/0x + wrappedNameTokenId',
  })
  @IsNotEmpty()
  @IsUrl()
  readonly wrappedMetadataUrl: string;

  @ApiProperty({
    description: 'The status of the name',
    example: 'ONCHAIN',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: 'Indicates if this is the primary name for the owner',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isPrimaryName: boolean;

  @ApiProperty({
    description: 'The expiration time of the name in seconds',
    example: 1696108800,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly expiresAt: number;
}

export class UpdateNameDto {
  @ApiProperty({
    description: 'The user`s ENS name',
    example: 'examplenName.story',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The status of the name',
    example: 'ONCHAIN',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: 'Indicates if this is the primary name for the owner',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isPrimaryName: boolean;

  @ApiProperty({
    description: 'The expiration time of the name in seconds',
    example: 1696108800,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly expiresAt: number;
}
