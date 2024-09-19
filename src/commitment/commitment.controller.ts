import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CommitmentService } from './commitment.service';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { iInfoToken, JWT, UserJWT } from 'src/modules/jwt';
import { QueryFilterCommitmentDto } from './dto/filter-commitment.dto';
import { CommitmentDto } from 'src/utils/models/dtos/commitment.dto';
import { BaseResult } from 'src/utils/base.result';

@ApiTags('commitment')
@Controller('commitment')
export class CommitmentController {
  constructor(private readonly commitmentService: CommitmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new commitment, secret will be encrypted',
  })
  @JWT()
  @HttpCode(200)
  create(
    @Body() createCommitmentDto: CreateCommitmentDto,
    @UserJWT() token: iInfoToken,
  ) {
    return this.commitmentService.create(
      createCommitmentDto,
      token.userAddress,
    );
  }

  @Get('filter')
  @ApiOperation({ summary: 'Find a commitment by query parameters' })
  async findOne(
    @Query() query: QueryFilterCommitmentDto,
  ): Promise<BaseResult<CommitmentDto>> {
    return await this.commitmentService.findOne(query);
  }

  @Get('getCommitment')
  @ApiOperation({
    summary: 'Find a commitment with decrypted secret by matching userAddress',
  })
  @JWT()
  async getCommitment(@UserJWT() token: iInfoToken) {
    return this.commitmentService.getCommitmentForUser(token.userAddress);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete a commitment by name' })
  @ApiParam({ name: 'name', description: 'name of the commitment to delete' })
  remove(@Param('name') name: string) {
    return this.commitmentService.remove(name);
  }
}
