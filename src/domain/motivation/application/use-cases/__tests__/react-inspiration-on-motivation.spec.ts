import { makeMotivation } from "@tests/factories/make-motivation";
import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";
import { InMemoryReactRepository } from "@tests/repositories/in-memory-react-repository";
import { InMemoryReactionRepository } from "@tests/repositories/in-memory-reaction-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { ReactInspirationOnMotivationUseCase } from "../react-inspiration-on-motivation";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let inMemoryReactRepository: InMemoryReactRepository;
let inMemoryReactionRepository: InMemoryReactionRepository;
let sut: ReactInspirationOnMotivationUseCase;

describe("ReactInspirationOnMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    inMemoryReactRepository = new InMemoryReactRepository();
    inMemoryReactionRepository = new InMemoryReactionRepository();
    sut = new ReactInspirationOnMotivationUseCase(
      inMemoryMotivationRepository,
      inMemoryReactRepository,
      inMemoryReactionRepository,
    );
  });

  it("should be able to react inspiration on a motivation", async () => {
    const motivation = makeMotivation();

    const peopleInspired = new UniqueEntityID();

    await inMemoryMotivationRepository.create(motivation);

    const { react } = await sut.execute({
      authorId: peopleInspired.toString(),
      motivationId: motivation.id.toString(),
    });

    expect(react).toMatchObject({
      authorId: peopleInspired,
      motivationId: motivation.id,
      reaction: {
        reaction: "inspiration",
        createdAt: expect.any(Date),
      },
    });
  });

  it("should not be able to react a motivation if the doesn't exist", async () => {
    const authorId = new UniqueEntityID();

    await expect(() =>
      sut.execute({ authorId: authorId.toString(), motivationId: "unknown" }),
    ).rejects.toThrowError("Motivation not found");
  });

  it("should not be able to react a your motivation", async () => {
    const motivation = makeMotivation();

    await inMemoryMotivationRepository.create(motivation);

    await expect(() =>
      sut.execute({
        authorId: motivation.authorId.toString(),
        motivationId: motivation.id.toString(),
      }),
    ).rejects.toThrowError("You cannot react on your own motivation");
  });

  it("should not be able to react inspiration if your already reacted", async () => {
    const motivation = makeMotivation();

    const motivationalParticipant = makeMotivationalParticipant();

    await inMemoryMotivationRepository.create(motivation);

    await sut.execute({
      authorId: motivationalParticipant.id.toString(),
      motivationId: motivation.id.toString(),
    });

    await expect(() =>
      sut.execute({
        authorId: motivationalParticipant.id.toString(),
        motivationId: motivation.id.toString(),
      }),
    ).rejects.toThrowError("You already reacted on this motivation");
  });
});
