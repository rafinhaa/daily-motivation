import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { constants } from "@core/constants";

import { FetchRecentMotivationsUseCase } from "../fetch-recent-motivations";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: FetchRecentMotivationsUseCase;

describe("FetchRecentMotivationsUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new FetchRecentMotivationsUseCase(inMemoryMotivationRepository);
  });

  it("should be able to fetch recent motivations ordered by date of creation", async () => {
    const dates = [
      new Date(2023, 0, 3),
      new Date(2023, 0, 2),
      new Date(2023, 0, 1),
    ];

    Array.from({ length: dates.length }).forEach((_, index) => {
      inMemoryMotivationRepository.create(
        makeMotivation({ createdAt: dates[index] }),
      );
    });

    const result = await sut.execute();

    if (!result.value) {
      throw result.value;
    }

    expect(result.value.motivations).toHaveLength(3);
    expect(result.value.motivations[0].createdAt).toEqual(dates[2]);
    expect(result.value.motivations[1].createdAt).toEqual(dates[1]);
    expect(result.value.motivations[2].createdAt).toEqual(dates[0]);
  });

  it("should be able to fetch paginate motivations", async () => {
    const FIVE = 5;
    const LENGTH_OF_MOTIVATIONS = constants.LIMIT_PER_PAGE + FIVE;

    Array.from({ length: LENGTH_OF_MOTIVATIONS }).forEach((_, index) => {
      inMemoryMotivationRepository.create(
        makeMotivation({
          createdAt: new Date(2023, 0, index + 1),
        }),
      );
    });

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);

    if (!result.value) {
      throw result.value;
    }

    expect(result.value.motivations.length).toEqual(constants.LIMIT_PER_PAGE);
  });

  it("should be able to fetch paginate motivations with limit", async () => {
    Array.from({ length: constants.LIMIT_PER_PAGE }).forEach((_, index) => {
      inMemoryMotivationRepository.create(
        makeMotivation({
          createdAt: new Date(2023, 0, index + 1),
        }),
      );
    });

    const result = await sut.execute({
      page: 1,
      limitPerPage: 5,
    });

    expect(result.isRight()).toBe(true);

    if (!result.value) {
      throw result.value;
    }

    expect(result.value.motivations.length).toEqual(5);
  });
});
