import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEthereumAddress } from 'class-validator';
import { BaseSchema } from 'src/models/base.schema';
import { Commitment } from 'src/models/commitment.schema';

export class CommitmentDto extends BaseSchema {
  @ApiProperty({ description: 'The name associated with the commitment' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User address associated with the commitment' })
  @IsEthereumAddress()
  userAddress: string;

  static from(commitment: Commitment): CommitmentDto {
    return {
      name: commitment.name,
      userAddress: commitment.userAddress,
    };
  }
}
