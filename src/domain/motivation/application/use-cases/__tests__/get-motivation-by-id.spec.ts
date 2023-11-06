import { makeMotivation } from "@tests/factories/make-motivation";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";

import { ResourceNotFoundError } from "../errors";
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

    const result = await sut.execute({
      motivationId: newMotivation.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (!result.isRight()) {
      throw result.value;
    }

    expect(result.value.motivation).toMatchObject({
      content: newMotivation.content,
      authorId: newMotivation.authorId,
      id: newMotivation.id,
    });
  });

  it("should not be able to get a motivation if the doesn't exist", async () => {
    const result = await sut.execute({
      motivationId: "unknown",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivation not found",
    });
  });
});
