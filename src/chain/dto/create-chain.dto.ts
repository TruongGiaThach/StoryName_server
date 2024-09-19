import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChainDto {
  @ApiProperty({
    description: 'The unique identifier for the blockchain.',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  readonly chainId: string;

  @ApiProperty({
    description: 'The name of the blockchain.',
    example: 'Ethereum',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The symbol of the blockchain.',
    example: 'ETH',
  })
  @IsString()
  @IsNotEmpty()
  readonly symbol: string;

  @ApiProperty({
    description: 'The RPC URL to interact with the blockchain.',
    example: 'https://eth-mainnet.g.alchemy.com/v2/{Alchemy Key}',
  })
  @IsUrl()
  @IsNotEmpty()
  readonly rpcUrl: string;

  @ApiProperty({
    description: 'The explorer URL to view blockchain transactions and data.',
    example: 'https://etherscan.io/',
  })
  @IsUrl()
  @IsNotEmpty()
  readonly explorerUrl: string;
}
