import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { DeleteMotivationUseCase } from "../delete-motivation";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: DeleteMotivationUseCase;

describe("DeleteMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new DeleteMotivationUseCase(inMemoryMotivationRepository);
  });

  it("should be able to delete by id a motivation", async () => {
    const authorId = new UniqueEntityID();
    const newMotivation = makeMotivation({
      authorId,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(
      sut.execute({
        authorId: authorId.toString(),
        motivationId: newMotivation.id.toString(),
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to delete a motivation if the doesn't exist", async () => {
    const authorId = new UniqueEntityID();

    await expect(() =>
      sut.execute({ authorId: authorId.toString(), motivationId: "unknown" }),
    ).rejects.toThrowError("Motivation not found");
  });

  it("should not be able to delete a motivation if authorId doesn't match", async () => {
    const authorId = new UniqueEntityID();
    const newMotivation = makeMotivation({
      authorId,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(() =>
      sut.execute({
        authorId: "another",
        motivationId: newMotivation.id.toString(),
      }),
    ).rejects.toThrowError("Not allowed to delete this motivation");
  });
});
