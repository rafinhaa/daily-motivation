import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { EditMotivationUseCase } from "../edit-motivation";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: EditMotivationUseCase;

describe("EditMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new EditMotivationUseCase(inMemoryMotivationRepository);
  });

  it("should be able to edit by id a motivation", async () => {
    const authorId = new UniqueEntityID();
    const newMotivation = makeMotivation({
      authorId,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    const newContent = "new content";

    await expect(
      sut.execute({
        authorId: authorId.toString(),
        motivationId: newMotivation.id.toString(),
        content: newContent,
      }),
    ).resolves.not.toThrow();

    const updatedMotivation = await inMemoryMotivationRepository.findById(
      newMotivation.id.toString(),
    );

    if (!updatedMotivation) {
      throw new Error("Motivation not found");
    }

    expect(updatedMotivation).toMatchObject({
      content: newContent,
      authorId,
      updatedAt: expect.any(Date),
    });
  });

  it("should not be able to edit a motivation if the doesn't exist", async () => {
    const authorId = new UniqueEntityID();

    await expect(() =>
      sut.execute({
        authorId: authorId.toString(),
        motivationId: "unknown",
        content: "any",
      }),
    ).rejects.toThrowError("Motivation not found");
  });

  it("should not be able to edit a motivation if authorId doesn't match", async () => {
    const authorId = new UniqueEntityID();
    const newMotivation = makeMotivation({
      authorId,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(() =>
      sut.execute({
        authorId: "another",
        motivationId: newMotivation.id.toString(),
        content: "any",
      }),
    ).rejects.toThrowError("Not allowed to edit this motivation");
  });
});
