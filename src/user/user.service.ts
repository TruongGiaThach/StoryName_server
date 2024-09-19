import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResult } from 'src/utils/base.result';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<BaseResult<User>> {
    try {
      const newUser = new this.userModel(createUserDto);
      await newUser.save();
      return new BaseResult<User>(newUser);
    } catch (error) {
      return new BaseResult<User>(null).setError(error.message);
    }
  }

  async findAll(): Promise<BaseResult<User[]>> {
    try {
      const users = await this.userModel.find().exec();
      return new BaseResult<User[]>(users);
    } catch (error) {
      return new BaseResult<User[]>(null).setError(error.message);
    }
  }

  async findOneByAddress(userAddress: string): Promise<BaseResult<User>> {
    try {
      const user = await this.userModel.findOne({ userAddress }).exec();
      if (!user) {
        const newUserDto: CreateUserDto = { userAddress: userAddress };
        const newUser = new this.userModel(newUserDto);
        await newUser.save();
        return new BaseResult<User>(newUser);
      }
      return new BaseResult<User>(user);
    } catch (error) {
      return new BaseResult<User>(null).setError(error.message);
    }
  }

  async saveNonce(userAddress: string, nonce: string): Promise<void> {
    await this.findOneByAddress(userAddress);
    await this.userModel
      .updateOne({ userAddress }, { $set: { nonce } }, { upsert: true })
      .exec();
  }

  async validateNonce(userAddress: string, nonce: string): Promise<boolean> {
    const result = await this.findOneByAddress(userAddress);
    if (result && result.data.nonce === nonce) {
      // invalidate the nonce after it's used to prevent reuse
      await this.userModel
        .updateOne({ userAddress }, { $unset: { nonce: 1 } })
        .exec();
      return true;
    }
    return false;
  }
}
