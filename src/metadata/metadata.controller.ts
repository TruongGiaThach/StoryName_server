import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata } from 'src/models/metadata.schema';
import { NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('metadata')
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @ApiOperation({ summary: 'Create a new Metadata' })
  @ApiResponse({
    status: 201,
    description: 'The metadata has been successfully created.',
    type: Metadata,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post()
  async create(
    @Body() createMetadataDto: CreateMetadataDto,
  ): Promise<Metadata> {
    return this.metadataService.create(createMetadataDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all Metadata entries' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved metadata.',
    type: [Metadata],
  })
  async findAll(): Promise<Metadata[]> {
    return this.metadataService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Metadata by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the Metadata to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved metadata.',
    type: Metadata,
  })
  @ApiResponse({ status: 404, description: 'Metadata not found.' })
  async findOne(@Param('id') id: string): Promise<Metadata> {
    return this.metadataService.findOne(id);
  }

  @Get('wrapped-name/:tokenId')
  @ApiOperation({ summary: 'Retrieve Metadata by wrapped name token ID' })
  @ApiParam({
    name: 'tokenId',
    description: 'The token ID associated with the wrapped name',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved metadata.',
    type: Metadata,
  })
  @ApiResponse({ status: 404, description: 'Metadata not found.' })
  async findMetadataByTokenId(
    @Param('tokenId') tokenId: string,
  ): Promise<Metadata> {
    try {
      return await this.metadataService.findMetadataByTokenId(tokenId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Metadata with tokenId ${tokenId} not found`,
        );
      }
      throw error;
    }
  }
}
