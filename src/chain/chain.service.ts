import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chain, ChainDocument } from 'src/models/chain.schema';
import { CreateChainDto } from './dto/create-chain.dto';
import { QueryFilterChainDto } from './dto/filter-chain.dto';

@Injectable()
export class ChainService {
  constructor(
    @InjectModel(Chain.name) private readonly chainModel: Model<ChainDocument>,
  ) {}

  async create(createChainDto: CreateChainDto): Promise<Chain> {
    const newChain = new this.chainModel(createChainDto);
    return await newChain.save();
  }

  async findAll(): Promise<Chain[]> {
    return await this.chainModel.find().exec();
  }

  async findOne(query: QueryFilterChainDto): Promise<Chain> {
    const filter: any = {};
    if (query.name) {
      filter.name = query.name;
    }
    const chain = await this.chainModel.findOne(filter).exec();
    if (!chain) {
      throw new NotFoundException(`Chain not found`);
    }
    return chain;
  }

  async remove(id: string): Promise<Chain> {
    const chain = await this.chainModel.findByIdAndDelete(id).exec();
    if (!chain) {
      throw new NotFoundException(`Chain with ID ${id} not found`);
    }
    return chain;
  }
}
