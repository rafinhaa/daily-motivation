import { makeMotivation } from "@tests/factories/make-motivation";
import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";
import { InMemoryReactRepository } from "@tests/repositories/in-memory-react-repository";
import { InMemoryReactionRepository } from "@tests/repositories/in-memory-reaction-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { NotAllowedError, ResourceNotFoundError } from "../errors";
import { ReactDisinterestOnMotivationUseCase } from "../react-disinterest-on-motivation";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let inMemoryReactRepository: InMemoryReactRepository;
let inMemoryReactionRepository: InMemoryReactionRepository;
let sut: ReactDisinterestOnMotivationUseCase;

describe("ReactDisinterestOnMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    inMemoryReactRepository = new InMemoryReactRepository();
    inMemoryReactionRepository = new InMemoryReactionRepository();
    sut = new ReactDisinterestOnMotivationUseCase(
      inMemoryMotivationRepository,
      inMemoryReactRepository,
      inMemoryReactionRepository,
    );
  });

  it("should be able to react disinterest on a motivation", async () => {
    const motivation = makeMotivation();

    const peopleInspired = new UniqueEntityID();

    await inMemoryMotivationRepository.create(motivation);

    const result = await sut.execute({
      authorId: peopleInspired.toString(),
      motivationId: motivation.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (!result.isRight()) {
      throw result.value;
    }

    expect(result.value.react).toMatchObject({
      authorId: peopleInspired,
      motivationId: motivation.id,
      reaction: {
        reaction: "disinterest",
        createdAt: expect.any(Date),
      },
    });
  });

  it("should not be able to react a motivation if the doesn't exist", async () => {
    const authorId = new UniqueEntityID();

    const result = await sut.execute({
      authorId: authorId.toString(),
      motivationId: "unknown",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivation not found",
    });
  });

  it("should not be able to react a your motivation", async () => {
    const motivation = makeMotivation();

    await inMemoryMotivationRepository.create(motivation);

    const result = await sut.execute({
      authorId: motivation.authorId.toString(),
      motivationId: motivation.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "You cannot react on your own motivation",
    });
  });

  it("should not be able to react inspiration if your already reacted", async () => {
    const motivation = makeMotivation();

    const motivationalParticipant = makeMotivationalParticipant();

    await inMemoryMotivationRepository.create(motivation);

    await sut.execute({
      authorId: motivationalParticipant.id.toString(),
      motivationId: motivation.id.toString(),
    });

    const result = await sut.execute({
      authorId: motivationalParticipant.id.toString(),
      motivationId: motivation.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "You already reacted on this motivation",
    });
  });
});
