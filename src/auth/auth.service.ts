import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { verifyTypedData } from 'ethers';
import { BaseResult } from 'src/utils/base.result';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/models/user.schema';
import { RefreshToken } from 'src/models/refresh-token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { address } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async generateNonce(userAddress: string): Promise<string> {
    const nonce = uuidv4();
    await this.userService.saveNonce(userAddress, nonce);
    return nonce;
  }

  async validateUser(
    userAddress: string,
    signature: string,
    nonce: string,
  ): Promise<BaseResult<User>> {
    const domain = {
      name: 'Story Id',
      version: '1',
      chainId: 84532,
      verifyingContract: address.ETHRegistrarAddress,
    };

    const types = {
      Login: [
        { name: 'address', type: 'string' },
        { name: 'nonce', type: 'string' },
      ],
    };

    const value = {
      address: userAddress,
      nonce: nonce,
    };

    try {
      console.log('Value:', value);

      // Verify the signature
      const recoveredAddress = verifyTypedData(domain, types, value, signature);
      console.log('Recovered Address:', recoveredAddress);

      if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
        let user = await this.userService.findOneByAddress(userAddress);
        if (!user.data) {
          const createUserDto = { userAddress };
          user = await this.userService.create(createUserDto);
        }
        return new BaseResult<User>(user.data);
      } else {
        console.log('Signature does not match the address.');
        return new BaseResult<User>(null).setError('Invalid signature');
      }
    } catch (error) {
      console.error('Error verifying signature:', error);
      return new BaseResult<User>(null).setError('Invalid signature');
    }
  }

  async login(user: User): Promise<{ accessToken: string }> {
    console.log(user);
    const payload = { sub: user._id, userAddress: user.userAddress };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await new this.refreshTokenModel({
      userId: user._id,
      token: refreshToken,
    }).save();

    return {
      accessToken: accessToken,
    };
  }

  async refresh(refreshToken: string): Promise<BaseResult<string>> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const storedToken = await this.refreshTokenModel.findOne({
        userId: payload.sub,
        token: refreshToken,
      });

      if (!storedToken) {
        return new BaseResult<string>(null).setError('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, userAddress: payload.userAddress },
        { expiresIn: '1h' },
      );
      return new BaseResult<string>(newAccessToken);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return new BaseResult<string>(null).setError('Refresh token expired');
      }
      return new BaseResult<string>(null).setError('Invalid refresh token');
    }
  }
}
