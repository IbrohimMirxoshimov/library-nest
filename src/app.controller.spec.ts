import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReqUser } from '@/modules/auth/auth.interface';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHello: jest.fn(),
  };

  const mockUser: ReqUser = {
    id: 1,
    roleId: 1,
    permissions: [],
    // other properties are omitted
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should be defined', () => {
      expect(appController.getHello).toBeDefined();
    });

    it('should call appService.getHello with the current user', () => {
      const expectedResult = 'Hello World!';
      mockAppService.getHello.mockReturnValue(expectedResult);

      const result = appController.getHello(mockUser);

      expect(mockAppService.getHello).toHaveBeenCalledWith(mockUser);
      expect(mockAppService.getHello).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });

    it('should return the result from appService.getHello', () => {
      const expectedResult = { message: 'Hello World!', user: mockUser };
      mockAppService.getHello.mockReturnValue(expectedResult);

      const result = appController.getHello(mockUser);

      expect(result).toEqual(expectedResult);
    });

    it('should handle different user objects', () => {
      const differentUser: ReqUser = {
        id: 2,
        roleId: 2,
        permissions: [],
        // other properties are omitted
      };
      const expectedResult = 'Hello different user!';
      mockAppService.getHello.mockReturnValue(expectedResult);

      const result = appController.getHello(differentUser);

      expect(mockAppService.getHello).toHaveBeenCalledWith(differentUser);
      expect(result).toBe(expectedResult);
    });

    it('should propagate errors from appService', () => {
      const error = new Error('Service error');
      mockAppService.getHello.mockImplementation(() => {
        throw error;
      });

      expect(() => appController.getHello(mockUser)).toThrow('Service error');
    });
  });

  describe('controller metadata', () => {
    it('should have the correct controller decorator', () => {
      const controllerMetadata = Reflect.getMetadata('path', AppController);
      expect(controllerMetadata).toBe('/');
    });

    it('should have ApiBearerAuth decorator', () => {
      const swaggerMetadata = Reflect.getMetadata(
        'swagger/apiSecurity',
        AppController,
      );
      expect(swaggerMetadata).toBeDefined();
    });
  });
});
