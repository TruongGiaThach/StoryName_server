import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Name } from 'src/models/names.schema';
import { BaseSchema } from 'src/models/base.schema';

export class NameDto extends BaseSchema {
  @ApiProperty({ description: 'The ID of the wrapped name token (ERC1155)' })
  @IsString()
  wrappedNameTokenId: string;

  @ApiProperty({ description: 'The ID of the name token (ERC721)' })
  @IsString()
  unwrappedNameTokenId: string;

  @ApiProperty({ description: 'The user`s ENS name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The hash of the ENS name' })
  @IsOptional()
  @IsString()
  nameHash?: string;

  @ApiProperty({
    description: 'The label of the ENS name. Without TLD (.story)',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description:
      'The hash of the label. Server will hash it based on the label above',
  })
  @IsOptional()
  @IsString()
  labelHash?: string;

  @ApiProperty({ description: 'Indicates if the name is wrapped' })
  @IsBoolean()
  isWrapped: boolean;

  @ApiProperty({ description: 'Blockchain network of the Name Service' })
  @IsString()
  chain: string;

  @ApiProperty({ description: 'The owner address of the ENS' })
  @IsString()
  owner: string;

  @ApiProperty({ description: 'The metadata URL for the wrapped name' })
  @IsUrl()
  wrappedMetadataUrl: string;

  @ApiProperty({ description: 'The status of the name' })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Indicates if this is the primary name for the owner',
  })
  @IsBoolean()
  isPrimaryName: boolean;

  @ApiProperty({ description: 'The expiration time of the name in seconds' })
  @IsNumber()
  expiresAt: number;

  static from(name: Name): NameDto {
    return {
      wrappedNameTokenId: name.wrappedNameTokenId,
      unwrappedNameTokenId: name.unwrappedNameTokenId,
      name: name.name,
      nameHash: name.nameHash,
      label: name.label,
      labelHash: name.labelHash,
      isWrapped: name.isWrapped,
      chain: name.chain,
      owner: name.owner,
      wrappedMetadataUrl: name.wrappedMetadataUrl,
      type: name.type,
      isPrimaryName: name.isPrimaryName,
      expiresAt: name.expiresAt,
      createdAt: name.createdAt,
      updatedAt: name.updatedAt,
    };
  }
}
