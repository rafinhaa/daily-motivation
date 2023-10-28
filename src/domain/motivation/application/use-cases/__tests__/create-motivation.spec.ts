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
    const authorId = new UniqueEntityID().toString();
    const content = "motivation";

    const { motivation } = await sut.execute({
      authorId,
      content,
    });

    expect(motivation.id).toEqual(expect.any(String));
    expect(motivation.content).toEqual(content);
    expect(motivation.authorId).toEqual(new UniqueEntityID(authorId));
  });
});
