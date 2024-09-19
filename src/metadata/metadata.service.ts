import { Injectable } from '@nestjs/common';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { Metadata } from 'src/models/metadata.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel(Metadata.name) private readonly metadataModel: Model<Metadata>,
  ) {}

  async create(createMetadataDto: CreateMetadataDto): Promise<Metadata> {
    const createdMetadata = new this.metadataModel(createMetadataDto);
    return createdMetadata.save();
  }

  async findAll(): Promise<Metadata[]> {
    return this.metadataModel.find().exec();
  }

  async findOne(id: string): Promise<Metadata> {
    const metadata = await this.metadataModel.findById(id).exec();
    if (!metadata) {
      throw new NotFoundException(`Metadata with id ${id} not found`);
    }
    return metadata;
  }

  async findMetadataByTokenId(tokenId: string): Promise<Metadata> {
    const metadata = await this.metadataModel.findOne({ tokenId }).exec();
    if (!metadata) {
      throw new NotFoundException(`Metadata with tokenId ${tokenId} not found`);
    }
    return metadata;
  }
}
