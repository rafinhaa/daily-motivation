import { makeMotivation } from "@tests/factories/make-motivation";
import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { EditMotivationUseCase } from "../edit-motivation";
import { NotAllowedError, ResourceNotFoundError } from "../errors";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: EditMotivationUseCase;

describe("EditMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new EditMotivationUseCase(inMemoryMotivationRepository);
  });

  it("should be able to edit by id a motivation", async () => {
    const motivationalParticipant = makeMotivationalParticipant();
    const newMotivation = makeMotivation({
      authorId: motivationalParticipant.id,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    const newContent = makeMotivation().content;

    const result = await sut.execute({
      authorId: motivationalParticipant.id.toString(),
      motivationId: newMotivation.id.toString(),
      content: newContent,
    });

    expect(result.isRight()).toBe(true);

    const updatedMotivation = await inMemoryMotivationRepository.findById(
      newMotivation.id.toString(),
    );

    if (!updatedMotivation) {
      throw updatedMotivation;
    }

    expect(updatedMotivation).toMatchObject({
      content: newContent,
      authorId: motivationalParticipant.id,
      updatedAt: expect.any(Date),
    });
  });

  it("should not be able to edit a motivation if the doesn't exist", async () => {
    const authorId = new UniqueEntityID();

    const result = await sut.execute({
      authorId: authorId.toString(),
      motivationId: "unknown",
      content: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivation not found",
    });
  });

  it("should not be able to edit a motivation if authorId doesn't match", async () => {
    const authorId = new UniqueEntityID();
    const newMotivation = makeMotivation({
      authorId,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    const result = await sut.execute({
      authorId: "another",
      motivationId: newMotivation.id.toString(),
      content: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "Not allowed to edit this motivation",
    });
  });
});
