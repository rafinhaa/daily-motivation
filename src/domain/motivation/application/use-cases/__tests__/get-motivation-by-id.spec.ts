import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { GetMotivationByIdUseCase } from "../get-motivation-by-id";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let sut: GetMotivationByIdUseCase;

describe("GetMotivationByIdUseCase", () => {
  beforeEach(() => {
    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    sut = new GetMotivationByIdUseCase(inMemoryMotivationRepository);
  });

  it("should be able to get by id a motivation", async () => {
    const newMotivation = makeMotivation();

    await inMemoryMotivationRepository.create(newMotivation);

    const { motivation } = await sut.execute({
      motivationId: newMotivation.id.toString(),
    });

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    expect(motivation).toMatchObject({
      content: newMotivation.content,
      authorId: newMotivation.authorId,
      id: newMotivation.id,
    });
  });

  it("should not be able to get a motivation if the doesn't exist", async () => {
    await expect(() =>
      sut.execute({ motivationId: "unknown" }),
    ).rejects.toThrowError();
  });
});
