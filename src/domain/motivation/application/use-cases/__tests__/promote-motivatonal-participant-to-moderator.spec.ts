import { Role } from "@motivation/enterprise/entities/value-objects/role";
import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationalParticipantRepository } from "@tests/repositories/in-memory-motivational-participant-repository";
import { InMemoryRoleRepository } from "@tests/repositories/in-memory-role-repository";

import { NotAllowedError, ResourceNotFoundError } from "../errors";
import { PromoteMotivationalParticipantToModeratorUseCase } from "../promote-motivational-participant-to-moderator";

let inMemoryMotivationalParticipantRepository: InMemoryMotivationalParticipantRepository;
let inMemoryRoleRepository: InMemoryRoleRepository;
let sut: PromoteMotivationalParticipantToModeratorUseCase;

describe("PromoteMotivationalParticipantToModeratorUseCase", () => {
  beforeEach(() => {
    inMemoryRoleRepository = new InMemoryRoleRepository();
    inMemoryMotivationalParticipantRepository =
      new InMemoryMotivationalParticipantRepository(inMemoryRoleRepository);
    sut = new PromoteMotivationalParticipantToModeratorUseCase(
      inMemoryMotivationalParticipantRepository,
    );
  });

  it("should be able to admin promote a member to moderator", async () => {
    const admin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });
    const member = makeMotivationalParticipant();

    await inMemoryMotivationalParticipantRepository.create(admin);
    await inMemoryMotivationalParticipantRepository.create(member);

    const result = await sut.execute({
      memberId: member.id.toString(),
      promoterId: admin.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;

    expect(result.value.motivationalParticipant).toMatchObject({
      id: member.id,
      role: expect.objectContaining({
        type: "moderator",
      }),
    });
  });

  it("should not be able to promote a member to moderator if member not exists", async () => {
    const admin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });

    await inMemoryMotivationalParticipantRepository.create(admin);

    const result = await sut.execute({
      memberId: "unknown",
      promoterId: admin.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivational participant not found",
    });
  });

  it("should not be able to promote a member to moderator if admin not exists", async () => {
    const member = makeMotivationalParticipant();
    await inMemoryMotivationalParticipantRepository.create(member);

    const result = await sut.execute({
      memberId: member.id.toString(),
      promoterId: "unknown",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivational participant not found",
    });
  });

  it("should not be able to change moderator to moderator", async () => {
    const admin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });
    const moderator = makeMotivationalParticipant({
      role: Role.createModerator(),
    });

    await inMemoryMotivationalParticipantRepository.create(admin);
    await inMemoryMotivationalParticipantRepository.create(moderator);

    const result = await sut.execute({
      memberId: moderator.id.toString(),
      promoterId: admin.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "Motivational participant is not a member",
    });
  });

  it("should not be able to change admin to moderator", async () => {
    const admin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });
    const anotherAdmin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });

    await inMemoryMotivationalParticipantRepository.create(admin);
    await inMemoryMotivationalParticipantRepository.create(anotherAdmin);

    const result = await sut.execute({
      memberId: anotherAdmin.id.toString(),
      promoterId: admin.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "Motivational participant is not a member",
    });
  });

  it("should not be able a member promote another member to moderator", async () => {
    const member = makeMotivationalParticipant({
      role: Role.createMember(),
    });
    const anotherMember = makeMotivationalParticipant({
      role: Role.createMember(),
    });

    await inMemoryMotivationalParticipantRepository.create(member);
    await inMemoryMotivationalParticipantRepository.create(anotherMember);

    const result = await sut.execute({
      memberId: anotherMember.id.toString(),
      promoterId: member.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "You cannot promote this motivational participant",
    });
  });
});
