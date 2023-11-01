import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { constants } from "@core/constants";

import { FetchRecentMotivationsByAuthorIdUseCase } from "../fetch-recent-motivations-by-author-id";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: FetchRecentMotivationsByAuthorIdUseCase;

describe("FetchRecentMotivationsByAuthorIdUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new FetchRecentMotivationsByAuthorIdUseCase(
      inMemoryMotivationRepository,
    );
  });

  it("should be able to fetch recent motivations by author ordered by date of creation", async () => {
    const dates = [
      new Date(2023, 0, 3),
      new Date(2023, 0, 2),
      new Date(2023, 0, 1),
    ];

    const motivationParticipant = makeMotivation();

    Array.from({ length: dates.length }).forEach((_, index) => {
      inMemoryMotivationRepository.create(
        makeMotivation({
          createdAt: dates[index],
          authorId: motivationParticipant.id,
        }),
      );
    });

    const { motivations } = await sut.execute({
      authorId: motivationParticipant.id.toString(),
    });

    expect(motivations).toHaveLength(3);
    expect(motivations[0].createdAt).toEqual(dates[2]);
    expect(motivations[1].createdAt).toEqual(dates[1]);
    expect(motivations[2].createdAt).toEqual(dates[0]);
  });

  it("should be able to fetch paginate motivations by author", async () => {
    const FIVE = 5;
    const LENGTH_OF_MOTIVATIONS = constants.LIMIT_PER_PAGE + FIVE;

    const motivationParticipant = makeMotivation();

    Array.from({ length: LENGTH_OF_MOTIVATIONS }).forEach((_, index) => {
      inMemoryMotivationRepository.create(
        makeMotivation({
          createdAt: new Date(2023, 0, index + 1),
          authorId: motivationParticipant.id,
        }),
      );
    });

    const { motivations } = await sut.execute({
      authorId: motivationParticipant.id.toString(),
      page: 1,
    });

    expect(motivations.length).toEqual(constants.LIMIT_PER_PAGE);
  });

  it("should be able to fetch paginate motivations with limit", async () => {
    const motivationParticipant = makeMotivation();

    Array.from({ length: constants.LIMIT_PER_PAGE }).forEach((_, index) => {
      inMemoryMotivationRepository.create(
        makeMotivation({
          createdAt: new Date(2023, 0, index + 1),
          authorId: motivationParticipant.id,
        }),
      );
    });

    const { motivations } = await sut.execute({
      authorId: motivationParticipant.id.toString(),
      page: 1,
      limitPerPage: 5,
    });

    expect(motivations.length).toEqual(5);
  });
});
