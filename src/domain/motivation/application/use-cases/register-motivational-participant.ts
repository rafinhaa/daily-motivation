import { MotivationalParticipant } from "@motivation/enterprise/entities/motivational-participant";

import { left, right } from "@core/either";
import { Either } from "@core/types";

import { MotivationalParticipantRepository } from "../repositories/motivational-participant";
import { ConflictError } from "./errors/conflict-error";

export interface RegisterMotivationalParticipantRequest {
  surname: string;
  password: string;
  email: string;
}

type RegisterMotivationalParticipantResponse = Either<
  ConflictError,
  { motivationalParticipant: MotivationalParticipant }
>;

export class RegisterMotivationalParticipantUseCase {
  constructor(
    private motivationalParticipantRepository: MotivationalParticipantRepository,
  ) {}

  async execute({
    surname,
    password,
    email,
  }: RegisterMotivationalParticipantRequest): Promise<RegisterMotivationalParticipantResponse> {
    const existingParticipant =
      await this.motivationalParticipantRepository.findByEmail(email);

    if (existingParticipant) {
      return left(new ConflictError("Email already in use"));
    }

    const motivationalParticipant = MotivationalParticipant.create({
      surname,
      password,
      email,
    });

    await this.motivationalParticipantRepository.create(
      motivationalParticipant,
    );

    return right({ motivationalParticipant });
  }
}
