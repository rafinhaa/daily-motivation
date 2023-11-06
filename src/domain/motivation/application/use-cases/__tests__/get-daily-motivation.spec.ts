import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { ResourceNotFoundError } from "../errors";
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

    const result = await sut.execute();

    const sameResult = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(sameResult.isRight()).toBe(true);

    if (!result.isRight() || !sameResult.isRight()) {
      throw new Error();
    }

    expect(result.value.motivation).toEqual(dailyMotivation);
    expect(sameResult.value.motivation).toEqual(dailyMotivation);
  });

  it("should be able to get a new daily motivation", async () => {
    const previousResult = await sut.execute();

    expect(previousResult.isRight()).toBe(true);

    vi.setSystemTime(TOMORROW);

    const result = await sut.execute();

    if (!result.isRight() || !previousResult.isRight()) {
      throw result.value;
    }

    expect(previousResult.value.motivation.id).equal(dailyMotivation.id);

    expect(result.value.motivation.id.toString()).not.toEqual(
      dailyMotivation.id.toString(),
    );
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
    const result = await sut.execute();

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Daily motivation not found",
    });
  });
});
