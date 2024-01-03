import { Module } from '@nestjs/common';
import { UvcCodeService } from './uvc_code.service';
import { UvcCodeController } from './uvc_code.controller';

@Module({
  controllers: [UvcCodeController],
  providers: [UvcCodeService],
})
export class UvcCodeModule {}
