import { Injectable } from '@nestjs/common';

@Injectable()
export class UvcCodeService {
  findAll() {
    return `This action returns all uvcCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uvcCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} uvcCode`;
  }
}
