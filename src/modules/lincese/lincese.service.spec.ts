import { Test, TestingModule } from '@nestjs/testing';
import { LinceseService } from './lincese.service';

describe('LinceseService', () => {
  let service: LinceseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinceseService],
    }).compile();

    service = module.get<LinceseService>(LinceseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
