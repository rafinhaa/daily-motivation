import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { GetDailyMotivationByIdUseCase } from "../get-daily-motivation";

let sut: GetDailyMotivationByIdUseCase;

const TEEN_MOTIVATION = 10;
const TODAY = new Date(2023, 0, 1);
const TOMORROW = new Date(2023, 0, 2);

describe("GetDailyMotivationByIdUseCase", () => {
  let inMemoryMotivationRepository: InMemoryMotivationRepository;

  const dailyMotivation = makeMotivation(
    {
      dailyMotivation: TODAY,
    },
    new UniqueEntityID("daily-motivation"),
  );

  beforeAll(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    const sortAnyMotivation = Math.floor(Math.random() * TEEN_MOTIVATION);

    Array.from({ length: TEEN_MOTIVATION }).forEach((_, index) => {
      if (sortAnyMotivation === index) {
        return inMemoryMotivationRepository.create(dailyMotivation);
      }

      return inMemoryMotivationRepository.create(makeMotivation());
    });
  });

  beforeEach(() => {
    sut = new GetDailyMotivationByIdUseCase(inMemoryMotivationRepository);
  });

  it("should be able to get daily motivation", async () => {
    vi.setSystemTime(TODAY);

    const { motivation } = await sut.execute();

    const { motivation: sameMotivation } = await sut.execute();

    expect(motivation).toEqual(dailyMotivation);
    expect(sameMotivation).toEqual(dailyMotivation);
  });

  it("should be able to get a new daily motivation", async () => {
    const { motivation: previousMotivation } = await sut.execute();

    if (!previousMotivation) {
      throw new Error("Motivation not found");
    }

    vi.setSystemTime(TOMORROW);

    const { motivation } = await sut.execute();

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    expect(previousMotivation.id).equal(dailyMotivation.id);

    expect(motivation.id.toString()).not.toEqual(dailyMotivation.id.toString());
  });
});

describe("GetDailyMotivationByIdUseCase Throw Error", () => {
  let inMemoryMotivationRepositoryThrowError: InMemoryMotivationRepository;

  beforeEach(() => {
    inMemoryMotivationRepositoryThrowError = new InMemoryMotivationRepository();

    sut = new GetDailyMotivationByIdUseCase(
      inMemoryMotivationRepositoryThrowError,
    );
  });

  it("should not be able to get daily if the doesn't exist", async () => {
    await expect(() => sut.execute()).rejects.toThrowError(
      "Daily motivation not found",
    );
  });
});
