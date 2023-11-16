import { Role } from "@motivation/enterprise/entities/value-objects/role";
import { makeMotivationalParticipant } from "@tests/factories/make-motivational-participant";
import { InMemoryMotivationalParticipantRepository } from "@tests/repositories/in-memory-motivational-participant-repository";
import { InMemoryRoleRepository } from "@tests/repositories/in-memory-role-repository";

import { DemoteMotivationalParticipantToMemberUseCase } from "../demote-motivational-participant-to-member";
import { NotAllowedError, ResourceNotFoundError } from "../errors";

let inMemoryMotivationalParticipantRepository: InMemoryMotivationalParticipantRepository;
let inMemoryRoleRepository: InMemoryRoleRepository;
let sut: DemoteMotivationalParticipantToMemberUseCase;

describe("DemoteMotivationalParticipantToMemberUseCase", () => {
  beforeEach(() => {
    inMemoryRoleRepository = new InMemoryRoleRepository();
    inMemoryMotivationalParticipantRepository =
      new InMemoryMotivationalParticipantRepository(inMemoryRoleRepository);
    sut = new DemoteMotivationalParticipantToMemberUseCase(
      inMemoryMotivationalParticipantRepository,
    );
  });

  it("should be able to admin demote a moderator to member", async () => {
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
      disqualifierId: admin.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isLeft()) throw result.value;

    expect(result.value.motivationalParticipant).toMatchObject({
      id: moderator.id,
      role: expect.objectContaining({
        type: "member",
      }),
    });
  });

  it("should not be able to demote a moderator to member if moderator not exists", async () => {
    const admin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });

    await inMemoryMotivationalParticipantRepository.create(admin);

    const result = await sut.execute({
      memberId: "unknown",
      disqualifierId: admin.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivational participant not found",
    });
  });

  it("should not be able to demote a moderator to member if admin not exists", async () => {
    const moderator = makeMotivationalParticipant({
      role: Role.createModerator(),
    });
    await inMemoryMotivationalParticipantRepository.create(moderator);

    const result = await sut.execute({
      memberId: moderator.id.toString(),
      disqualifierId: "unknown",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toMatchObject({
      message: "Motivational participant not found",
    });
  });

  it("should not be able to change member to member", async () => {
    const admin = makeMotivationalParticipant({
      role: Role.createAdmin(),
    });
    const member = makeMotivationalParticipant({
      role: Role.createMember(),
    });

    await inMemoryMotivationalParticipantRepository.create(admin);
    await inMemoryMotivationalParticipantRepository.create(member);

    const result = await sut.execute({
      memberId: member.id.toString(),
      disqualifierId: admin.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "Motivational participant is not a moderator",
    });
  });

  it("should not be able to change admin to member", async () => {
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
      disqualifierId: admin.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "Motivational participant is not a moderator",
    });
  });

  it("should not be able a member demote another member to member", async () => {
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
      disqualifierId: member.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "Motivational participant is not a moderator",
    });
  });

  it("should not be able a moderator demote moderator to member", async () => {
    const moderator = makeMotivationalParticipant({
      role: Role.createModerator(),
    });
    const anotherModerator = makeMotivationalParticipant({
      role: Role.createModerator(),
    });

    await inMemoryMotivationalParticipantRepository.create(moderator);
    await inMemoryMotivationalParticipantRepository.create(anotherModerator);

    const result = await sut.execute({
      memberId: anotherModerator.id.toString(),
      disqualifierId: moderator.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isRight()) throw result.value;

    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toMatchObject({
      message: "You cannot demote this motivational participant",
    });
  });
});
