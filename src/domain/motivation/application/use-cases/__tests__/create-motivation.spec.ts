import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { CreateMotivationUseCase } from "../create-motivation";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: CreateMotivationUseCase;

describe("CreateMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new CreateMotivationUseCase(inMemoryMotivationRepository);
  });

  it("should be able to create a motivation", async () => {
    const motivationalParticipant = makeMotivationalParticipant();
    const content = "motivation";

    const result = await sut.execute({
      authorId: motivationalParticipant.id.toString(),
      content,
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;

    expect(result.value.motivation).toMatchObject({
      content,
      authorId: motivationalParticipant.id,
      createdAt: result.value.motivation.createdAt,
      id: expect.any(UniqueEntityID),
    });

    expect(result.value.motivation.id).toBeInstanceOf(UniqueEntityID);
    expect(result.value.motivation.content).toEqual(content);
    expect(result.value.motivation.authorId).toEqual(
      motivationalParticipant.id,
    );
  });

  it("should be able to create many motivations", async () => {
    const motivationalParticipant = makeMotivationalParticipant();
    const manyMotivations = 5;

    await Promise.all([
      Array.from({ length: manyMotivations }).forEach(() =>
        sut.execute({
          authorId: motivationalParticipant.id.toString(),
          content: "motivation",
        }),
      ),
    ]);

    const motivations =
      await inMemoryMotivationRepository.findManyRecentByAuthorId(
        motivationalParticipant.id.toString(),
        {
          page: 1,
          limitPerPage: manyMotivations,
        },
      );

    expect(motivations).toHaveLength(manyMotivations);
  });
});
