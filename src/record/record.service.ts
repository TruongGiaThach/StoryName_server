import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  EthNameRecord,
  EthNameRecordDocument,
} from 'src/models/records.schema';
import { CreateEthNameRecordDto } from './dto/create-record.dto';
import { UpdateEthNameRecordDto } from './dto/update-record.dto';
import { Name, NameDocument } from 'src/models/names.schema';

@Injectable()
export class EthNameRecordService {
  constructor(
    @InjectModel(EthNameRecord.name)
    private readonly ethNameRecordModel: Model<EthNameRecordDocument>,
    @InjectModel(Name.name) private readonly nameModel: Model<NameDocument>,
  ) {}

  async create(
    createEthNameRecordDto: CreateEthNameRecordDto,
    userAddress: string,
  ): Promise<EthNameRecord> {
    const nameExists = await this.nameModel.exists({
      name: createEthNameRecordDto.name,
      owner: userAddress,
    });
    if (!nameExists) {
      throw new NotFoundException(
        `Name ${createEthNameRecordDto.name} does not exist.`,
      );
    }

    const newRecord = new this.ethNameRecordModel(createEthNameRecordDto);
    return await newRecord.save();
  }

  async findAll(): Promise<EthNameRecord[]> {
    return await this.ethNameRecordModel.find().exec();
  }

  async findOne(
    query: FilterQuery<EthNameRecordDocument>,
  ): Promise<EthNameRecord> {
    const record = await this.ethNameRecordModel.findOne(query).exec();
    if (!record) {
      throw new NotFoundException(`EthNameRecord not found`);
    }
    return record;
  }

  async remove(name: string, userAddress: string): Promise<EthNameRecord> {
    const nameExists = await this.nameModel.exists({
      name,
      owner: userAddress,
    });
    if (!nameExists) {
      throw new NotFoundException(`Name ${name} does not exist.`);
    }

    const record = await this.ethNameRecordModel
      .findOneAndDelete({ name })
      .exec();
    if (!record) {
      throw new NotFoundException(`EthNameRecord with ID ${name} not found`);
    }
    return record;
  }

  async updateByName(
    name: string,
    updateEthNameRecordDto: UpdateEthNameRecordDto,
    userAddress: string,
  ): Promise<EthNameRecord> {
    const nameExists = await this.nameModel.exists({
      name,
      owner: userAddress,
    });
    if (!nameExists) {
      throw new NotFoundException(`Name ${name} does not exist.`);
    }

    const updatedRecord = await this.ethNameRecordModel
      .findOneAndUpdate(
        { name },
        {
          $set: {
            ...(updateEthNameRecordDto.name && {
              name: updateEthNameRecordDto.name,
            }),
            ...(updateEthNameRecordDto.ethName && {
              ethName: updateEthNameRecordDto.ethName,
            }),
            ...(updateEthNameRecordDto.addresses && {
              'data.addresses': updateEthNameRecordDto.addresses,
            }),
            ...(updateEthNameRecordDto.text && {
              'data.text': updateEthNameRecordDto.text,
            }),
          },
        },
        { new: true },
      )
      .exec();

    console.log(
      `Updating EthNameRecord: name=${name}, userAddress=${userAddress}, data=`,
      updateEthNameRecordDto,
    );

    if (!updatedRecord) {
      throw new NotFoundException(`EthNameRecord with name ${name} not found`);
    }

    return updatedRecord;
  }
}
