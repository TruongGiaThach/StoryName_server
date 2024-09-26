import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Name, NameDocument } from 'src/models/names.schema';
import { CreateNameDto, UpdateNameDto } from './dto/create-name.dto';
import { labelhash } from 'viem';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';
import { ChainService } from 'src/chain/chain.service';
import { BaseResult } from 'src/utils/base.result';
import { NameDto } from 'src/utils/models/dtos/name.dto';
import { QueryFilterNameDto } from './dto/filter-name.dto';
import { CommitmentService } from 'src/commitment/commitment.service';

@Injectable()
export class NameService {
  constructor(
    @InjectModel(Name.name) private readonly nameModel: Model<NameDocument>,
    private readonly userService: UserService,
    private readonly chainService: ChainService,
    private readonly commitmentService: CommitmentService,
  ) {}

  async create(
    createNameDto: CreateNameDto,
    ownerAddress: string,
  ): Promise<BaseResult<NameDto>> {
    const userDocument = await this.userService.findOneByAddress(ownerAddress);

    if (!userDocument) {
      throw new BadRequestException('User not found');
    }

    const chainDocument = await this.chainService.findOne({
      name: createNameDto.chain,
    });
    if (!chainDocument) {
      throw new BadRequestException('Parent Chain not found');
    }

    // const commitDocument = await this.commitmentService.findOne({
    //   name: createNameDto.label,
    // });
    // if (!commitDocument) {
    //   throw new BadRequestException('Commitment not found');
    // }

    if (createNameDto.isPrimaryName) {
      await this.nameModel.updateMany(
        { owner: ownerAddress, isPrimaryName: true },
        { isPrimaryName: false },
      );
    }

    const labelHash = labelhash(createNameDto.label);
    const createdName = await this.nameModel.create({
      ...createNameDto,
      owner: ownerAddress,
      labelhash: labelHash,
    });

    return new BaseResult(NameDto.from(createdName));
  }

  async findOne(query: QueryFilterNameDto): Promise<BaseResult<NameDto>> {
    const filter: any = {};
    if (query.name) {
      filter.name = query.name;
    }
    if (query.owner) {
      filter.owner = query.owner;
    }
    const name = await this.nameModel.findOne(filter).exec();
    if (!name) {
      throw new NotFoundException(`Name not found`);
    }
    return new BaseResult<NameDto>(NameDto.from(name));
  }

  async remove(id: string, ownerAddress: string) {
    const name = await this.nameModel
      .findByIdAndDelete({ id, ownerAddress })
      .exec();
    if (!name) {
      throw new NotFoundException(`Name with ID ${id} not found`);
    }
    return new BaseResult('Community deleted successfully');
  }

  async setPrimaryName(name: string, ownerAddress: string) {
    const userName = await this.nameModel
      .findOne({ name, ownerAddress })
      .exec();
    if (!userName) {
      throw new NotFoundException(`Name with ID ${name} not found`);
    }

    await this.nameModel.updateMany(
      { owner: ownerAddress, isPrimaryName: true },
      { isPrimaryName: false },
    );

    userName.isPrimaryName = true;
    await userName.save();

    return userName;
  }

  async findAll(ownerAddress: string): Promise<BaseResult<NameDto[]>> {
    const names = await this.nameModel.find({ owner: ownerAddress }).exec();

    if (!names || names.length === 0) {
      throw new NotFoundException(`No names found for owner: ${ownerAddress}`);
    }

    const nameDtos = names.map((name) => NameDto.from(name));
    return new BaseResult<NameDto[]>(nameDtos);
  }

  // Note: doing
  async updateName(ownerAddress: string, updateNameDto: UpdateNameDto) {
    const name = await this.nameModel.findOne({
      owner: ownerAddress,
      name: updateNameDto.name,
    });
    return name ?? null;
  }
}
