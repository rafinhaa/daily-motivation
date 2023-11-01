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

    const { motivation } = await sut.execute({
      authorId: motivationalParticipant.id.toString(),
      content,
    });

    expect(motivation).toMatchObject({
      content,
      authorId: motivationalParticipant.id,
      createdAt: motivation.createdAt,
      id: expect.any(UniqueEntityID),
    });

    expect(motivation.id).toBeInstanceOf(UniqueEntityID);
    expect(motivation.content).toEqual(content);
    expect(motivation.authorId).toEqual(motivationalParticipant.id);
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

    const motivations = await inMemoryMotivationRepository.findByAuthorId(
      motivationalParticipant.id.toString(),
      {
        page: 1,
        limitPerPage: manyMotivations,
      },
    );

    expect(motivations).toHaveLength(manyMotivations);
  });
});
