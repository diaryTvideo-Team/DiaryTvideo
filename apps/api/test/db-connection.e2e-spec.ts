import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { PrismaModule } from "../src/prisma/prisma.module";

describe("Database Connection (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe("Connection", () => {
    it("should connect to database and execute query", async () => {
      const result = await prisma.$queryRaw`SELECT 1 as value`;
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("User CRUD", () => {
    let testUserId: number;

    afterEach(async () => {
      if (testUserId) {
        await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
      }
    });

    it("should create and find a user", async () => {
      const user = await prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          name: "Test User",
          passwordHash: "hashed_password_123",
        },
      });

      testUserId = user.id;

      expect(user.id).toBeDefined();
      expect(user.email).toContain("test-");
      expect(user.emailVerified).toBe(false);

      const foundUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(foundUser?.name).toBe("Test User");
    });
  });
});
