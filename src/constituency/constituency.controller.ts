import { Controller, Get, Param } from '@nestjs/common';
import { ConstituencyService } from './constituency.service';
import { ResultsByConstituency } from '../shared/interfaces/result.interface';

@Controller('constituency')
export class ConstituencyController {
  constructor(private readonly constituencyService: ConstituencyService) {}

  @Get()
  findAll() {
    return this.constituencyService.findAll();
  }

  @Get(':sub')
  findResultsByConstituency(@Param('sub') sub: string) {
    return this.constituencyService.getResultsByConstituency(sub);
  }
}
