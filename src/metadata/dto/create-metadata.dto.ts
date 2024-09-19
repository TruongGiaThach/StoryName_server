import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetadataDto {
  @ApiProperty({
    description: 'The ID of the wrapped name token (ERC1155)',
    example:
      '0x91b4480e97a5b9019d4d1b57d91f8ed08a096a274b0a2baa0ec3ffb6b3b04125',
  })
  @IsString()
  tokenId: string;

  @ApiProperty({
    description: 'The user`s ENS name',
    example: 'Example.story',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the Name',
    example: 'Story Id on Storyd',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL of the image associated with the Name',
    example: 'https://example.com/image.png',
  })
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'A URL providing more details about the token or asset',
    example: 'https://storyName.xyz',
  })
  @IsUrl()
  url: string;
}
