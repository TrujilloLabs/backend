import { Test, TestingModule } from '@nestjs/testing';
import { LinceseController } from './lincese.controller';
import { LinceseService } from './lincese.service';

describe('LinceseController', () => {
  let controller: LinceseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinceseController],
      providers: [LinceseService],
    }).compile();

    controller = module.get<LinceseController>(LinceseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
