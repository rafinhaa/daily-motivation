import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { MotivationRepository } from "@domain/repositories/motivation-repository";

import { CreateNewMotivation } from "../create-new-motivation";

const fakeMotivationRepository: MotivationRepository = {
  create: vitest.fn(),
};

describe("CreateNewMotivation", () => {
  test("should create a new motivation", async () => {
    const authorId = new UniqueEntityID().toString();
    const content = "motivation";

    const newMotivation = new CreateNewMotivation(fakeMotivationRepository);

    const motivation = await newMotivation.execute({
      authorId,
      content,
    });

    expect(motivation.id).toEqual(expect.any(String));
    expect(motivation.content).toEqual(content);
    expect(motivation.authorId).toEqual(new UniqueEntityID(authorId));
  });
});
