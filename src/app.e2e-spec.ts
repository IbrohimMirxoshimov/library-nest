import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { Permissions } from '@/common/constants/constants.permissions';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('/ (GET) - should return 401 without authentication', () => {
    // This test checks if the endpoint is protected by JWT authentication
    return request(app.getHttpServer()).get('/').expect(401);
  });

  it('/ (GET) - should return 200 with valid JWT token and permissions', async () => {
    // Create a mock user with required permissions
    const mockUser = {
      id: 1,
      first_name: 'Test User',
      last_name: null,
      phone: '998001112233',
      extra: null,
      password: 'hashedpassword',
      gender: null,
      birth_date: null,
      address: null,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      avatar: null,
      refresh_token: null,
      email: null,
      role_id: 1,
      role: {
        id: 1,
        name: 'Admin',
        permissions: [Permissions.AUTHOR_CREATE],
        location_id: null,
      },
    };

    // Mock prisma user query
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockUser as any);

    // Generate JWT token
    const token = jwtService.sign({ sub: mockUser.id });

    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/ (GET) - should return 403 with valid JWT token but insufficient permissions', async () => {
    // Create a mock user without required permissions
    const mockUser = {
      id: 2,
      first_name: 'Test User 2',
      last_name: null,
      phone: '998001112234',
      extra: null,
      password: 'hashedpassword',
      gender: null,
      birth_date: null,
      address: null,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      avatar: null,
      refresh_token: null,
      email: null,
      role_id: 2,
      role: {
        id: 2,
        name: 'User',
        permissions: [Permissions.BOOK_READ], // Different permission
        location_id: null,
      },
    };

    // Mock prisma user query
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockUser as any);

    // Generate JWT token
    const token = jwtService.sign({ sub: mockUser.id });

    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('/ (GET) - should return 401 with invalid JWT token', () => {
    const invalidToken = 'invalid.jwt.token';

    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
