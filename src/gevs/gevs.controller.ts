import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { GevsService } from './gevs.service';
import { StatusDto } from './dto/status.dto';

@Controller('gevs')
export class GevsController {
  constructor(private readonly gevsService: GevsService) {}

  @Get('results')
  getResults() {
    return this.gevsService.getResults();
  }

  @Get('constituency/:name')
  getResultsByConstituency(@Param('name') name: string) {
    return this.gevsService.getResultsByConstituency(name);
  }

  @Patch('status')
  changeStatus(@Body() statusDto: StatusDto) {
    return this.gevsService.changeStatus(statusDto);
  }
}
