import { Mapper } from '../../src';
import { Foo } from './foo';

export const toBarMock = jest.fn();
export const fromBarMock = jest.fn();
export class StubMapper extends Mapper<Foo> {
  initMapper(): void {
    this.toMap.set('Bar', toBarMock);
    this.fromMap.set('Bar', fromBarMock);
  }

  getSourceType(): string {
    return 'Foo';
  }
}
