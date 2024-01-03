import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UvcCodeService } from './uvc_code.service';

@Controller('uvc-code')
export class UvcCodeController {
  constructor(private readonly uvcCodeService: UvcCodeService) {}

  @Get()
  findAll() {
    return this.uvcCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uvcCodeService.findOne(+id);
  }
}
