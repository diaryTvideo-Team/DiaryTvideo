import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await service.$disconnect();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should have $connect method", () => {
    expect(typeof service.$connect).toBe("function");
  });

  it("should have $disconnect method", () => {
    expect(typeof service.$disconnect).toBe("function");
  });

  it("should extend PrismaClient", () => {
    expect(service.user).toBeDefined();
    expect(service.diaryEntry).toBeDefined();
  });
});
