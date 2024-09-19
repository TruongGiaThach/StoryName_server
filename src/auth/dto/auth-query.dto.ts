import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsUUID } from 'class-validator';
import { REGEX_ADDRESS } from 'src/utils/format';
export class GetNoneceDto {
  @ApiProperty({
    required: true,
    example: '',
  })
  @IsNotEmpty({ message: 'Address is required' })
  @Matches(/^(0x)?[0-9a-fA-F]{40,}$/, {
    message: 'Address must be a valid Ethereum or EVM address',
  })
  userAddress: string;
}

// Login API
export class BodyRequestTokenDto {
  @ApiProperty({
    required: true,
    example: '',
  })
  @IsNotEmpty({ message: 'Address is required' })
  @Matches(REGEX_ADDRESS, {
    message: 'Address must be a valid Ethereum or EVM address',
  })
  userAddress: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({ message: 'Signature is required' })
  signature: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({ message: 'Nonce is required' })
  @IsUUID()
  nonce: string;
}

export class CreateAuthDto {}
