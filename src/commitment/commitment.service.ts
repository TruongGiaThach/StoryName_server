import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commitment, CommitmentDocument } from 'src/models/commitment.schema';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import * as crypto from 'crypto';
import { CommitmentDto } from 'src/utils/models/dtos/commitment.dto';
import { BaseResult } from 'src/utils/base.result';

@Injectable()
export class CommitmentService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = process.env.ENCRYPT_KEY;
  private readonly iv = crypto.randomBytes(16);

  constructor(
    @InjectModel(Commitment.name)
    private readonly commitmentModel: Model<CommitmentDocument>,
  ) {}

  async create(
    createCommitmentDto: CreateCommitmentDto,
    userAddress: string,
  ): Promise<Commitment> {
    const encryptedSecret = this.encrypt(createCommitmentDto.secret);
    const newCommitment = new this.commitmentModel({
      ...createCommitmentDto,
      userAddress,
      secret: encryptedSecret,
    });
    return await newCommitment.save();
  }

  async findOne(
    query: Partial<Commitment>,
  ): Promise<BaseResult<CommitmentDto>> {
    const commitment = await this.commitmentModel.findOne(query).exec();
    if (!commitment) {
      throw new NotFoundException(`Commitment not found`);
    }
    return new BaseResult<CommitmentDto>(CommitmentDto.from(commitment));
  }

  async remove(name: string): Promise<Commitment> {
    const commitment = await this.commitmentModel
      .findOneAndDelete({ name })
      .exec();
    if (!commitment) {
      throw new NotFoundException(`Commitment with ID ${name} not found`);
    }
    return commitment;
  }

  async getCommitmentForUser(userAddress: string): Promise<Commitment> {
    const commitment = await this.commitmentModel
      .findOne({ userAddress })
      .exec();
    if (!commitment) {
      throw new NotFoundException(`Commitment not found for this user`);
    }
    const decryptedSecret = this.decrypt(commitment.secret);
    const decryptedCommitment = {
      ...commitment.toObject(),
      secret: decryptedSecret,
    };
    return decryptedCommitment;
  }

  private encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key, 'hex'),
      this.iv,
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const result = this.iv.toString('hex') + ':' + encrypted.toString('hex');
    console.log('Encrypted result:', result);
    return result;
  }

  private decrypt(encryptedText: Buffer | string): string {
    const encryptedTextStr = encryptedText.toString('utf-8');

    const [ivHex, encryptedHex] = encryptedTextStr.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedTextBytes = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedTextBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}
