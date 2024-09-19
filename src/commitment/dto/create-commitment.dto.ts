import { IsNotEmpty, IsString, IsDate, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommitmentDto {
  @ApiProperty({
    description: 'Unique hash for the commitment of the user`s name',
  })
  @IsNotEmpty()
  @IsString()
  commitmentHash: string;

  //   @ApiProperty({ description: 'User address associated with the commitment' })
  //   @IsNotEmpty()
  //   @IsString()
  //   userAddress: string;

  @ApiProperty({ description: 'User`s name in the commitment' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Secret value stored as a hex string (bytes32)' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^0x[0-9a-fA-F]{64}$/, {
    message: 'secret must be a 32-byte hex string',
  })
  secret: string;

  @ApiProperty({ description: 'Timestamp when the commitment was created' })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
