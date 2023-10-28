import { Motivation } from "@motivation/enterprise/entities/motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { GetMotivationByIdUseCase } from "../get-motivation-by-id";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: GetMotivationByIdUseCase;

describe("GetMotivationByIdUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new GetMotivationByIdUseCase(inMemoryMotivationRepository);
  });

  it("should be able to get by id a motivation", async () => {
    const newMotivation = Motivation.create({
      content: "motivation",
      authorId: new UniqueEntityID("authorId"),
      createdAt: new Date(),
    });

    await inMemoryMotivationRepository.create(newMotivation);

    const { motivation } = await sut.execute({
      motivationId: newMotivation.id.toString(),
    });

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    expect(motivation.id).toEqual(expect.any(String));
    expect(motivation.content).toEqual(newMotivation.content);
    expect(motivation.authorId).toEqual(
      new UniqueEntityID(newMotivation.authorId.toString()),
    );
  });

  it("should not be able to get a motivation if the doesn't exist", async () => {
    await expect(() =>
      sut.execute({ motivationId: "unknown" }),
    ).rejects.toThrowError();
  });
});
