import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationalParticipantRepository } from "@tests/repositories/in-memory-motivational-participant-repository";
import { InMemoryRoleRepository } from "@tests/repositories/in-memory-role-repository";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { ConflictError } from "../errors/conflict-error";
import { RegisterMotivationalParticipantUseCase } from "../register-motivational-participant";

let inMemoryMotivationParticipantRepository: InMemoryMotivationalParticipantRepository;
let inMemoryRoleRepository: InMemoryRoleRepository;
let sut: RegisterMotivationalParticipantUseCase;

describe("RegisterMotivationalParticipantUseCase", () => {
  beforeEach(() => {
    inMemoryRoleRepository = new InMemoryRoleRepository();
    inMemoryMotivationParticipantRepository =
      new InMemoryMotivationalParticipantRepository(inMemoryRoleRepository);
    sut = new RegisterMotivationalParticipantUseCase(
      inMemoryMotivationParticipantRepository,
    );
  });

  it("should be able to register a motivational participant", async () => {
    const motivationalParticipant = makeMotivationalParticipant();

    const result = await sut.execute({
      email: motivationalParticipant.email,
      surname: motivationalParticipant.surname,
      password: motivationalParticipant.password,
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;

    expect(result.value.motivationalParticipant).toMatchObject({
      email: motivationalParticipant.email,
      surname: motivationalParticipant.surname,
      id: expect.any(UniqueEntityID),
      createdAt: result.value.motivationalParticipant.createdAt,
      role: expect.objectContaining({
        type: "member",
      }),
    });
  });

  it("should not be able to register a motivational participant with an existing email", async () => {
    const existingParticipant = makeMotivationalParticipant();

    await inMemoryMotivationParticipantRepository.create(existingParticipant);

    const result = await sut.execute({
      email: existingParticipant.email,
      surname: existingParticipant.surname,
      password: existingParticipant.password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictError);
    expect(result.value).toMatchObject({
      message: "Email already in use",
    });
  });
});
