import { Role } from "@motivation/enterprise/entities/role";
import { makeMotivation } from "@tests/factories/make-motivation";
import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationRepository } from "@tests/repositories/in-memory-motivation-repository";
import { InMemoryMotivationalParticipantRepository } from "@tests/repositories/in-memory-motivational-participant-repository";
import { InMemoryRoleRepository } from "@tests/repositories/in-memory-role-repository";

import { DeleteMotivationUseCase } from "../delete-motivation";

let inMemoryMotivationRepository: InMemoryMotivationRepository;
let inMemoryMotivationalParticipantRepository: InMemoryMotivationalParticipantRepository;
let inMemoryRoleRepository: InMemoryRoleRepository;
let sut: DeleteMotivationUseCase;

describe("DeleteMotivationUseCase", () => {
  beforeEach(() => {
    inMemoryRoleRepository = new InMemoryRoleRepository();

    inMemoryMotivationRepository = new InMemoryMotivationRepository();
    inMemoryMotivationalParticipantRepository =
      new InMemoryMotivationalParticipantRepository(inMemoryRoleRepository);
    sut = new DeleteMotivationUseCase(
      inMemoryMotivationRepository,
      inMemoryMotivationalParticipantRepository,
    );
  });

  it("should be able to delete by id a motivation", async () => {
    const motivationalParticipant = makeMotivationalParticipant();

    makeMotivationalParticipant();
    await inMemoryMotivationalParticipantRepository.create(
      motivationalParticipant,
    );
    const newMotivation = makeMotivation({
      authorId: motivationalParticipant.id,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(
      sut.execute({
        authorId: motivationalParticipant.id.toString(),
        motivationId: newMotivation.id.toString(),
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to delete a motivation if the doesn't exist", async () => {
    const motivationalParticipant = makeMotivationalParticipant();
    await inMemoryMotivationalParticipantRepository.create(
      motivationalParticipant,
    );

    await expect(() =>
      sut.execute({
        authorId: motivationalParticipant.id.toString(),
        motivationId: "unknown",
      }),
    ).rejects.toThrowError("Motivation not found");
  });

  it("should not be able to delete a motivation if authorId doesn't match", async () => {
    const motivationalParticipant = makeMotivationalParticipant();
    const anotherParticipant = makeMotivationalParticipant();

    await inMemoryMotivationalParticipantRepository.create(
      motivationalParticipant,
    );
    await inMemoryMotivationalParticipantRepository.create(anotherParticipant);

    const newMotivation = makeMotivation({
      authorId: motivationalParticipant.id,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(() =>
      sut.execute({
        authorId: anotherParticipant.id.toString(),
        motivationId: newMotivation.id.toString(),
      }),
    ).rejects.toThrowError("Not allowed to delete this motivation");
  });

  it("should not be able to delete a motivation if author doesn't exist", async () => {
    const motivationalParticipant = makeMotivationalParticipant();

    await inMemoryMotivationalParticipantRepository.create(
      motivationalParticipant,
    );

    const newMotivation = makeMotivation({
      authorId: motivationalParticipant.id,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(() =>
      sut.execute({
        authorId: "another",
        motivationId: newMotivation.id.toString(),
      }),
    ).rejects.toThrowError("Author not found");
  });

  it("should be able to delete a motivation if motivational participant is admin", async () => {
    const motivationalParticipantAdmin = makeMotivationalParticipant({
      role: Role.create({
        type: "admin",
      }),
    });

    const motivationalParticipant = makeMotivationalParticipant();

    await inMemoryMotivationalParticipantRepository.create(
      motivationalParticipantAdmin,
    );

    await inMemoryMotivationalParticipantRepository.create(
      motivationalParticipant,
    );

    const newMotivation = makeMotivation({
      authorId: motivationalParticipant.id,
    });

    await inMemoryMotivationRepository.create(newMotivation);

    await expect(
      sut.execute({
        authorId: motivationalParticipantAdmin.id.toString(),
        motivationId: newMotivation.id.toString(),
      }),
    ).resolves.not.toThrow();
  });
});
