import { React } from "@motivation/enterprise/entities/react";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { MotivationRepository } from "../repositories/motivation-repository";
import { ReactRepository } from "../repositories/react-repository";
import { ReactionRepository } from "../repositories/reaction-repository";

export interface ReactOnMotivationRequest {
  authorId: string;
  motivationId: string;
}

interface ReactOnMotivationResponse {
  react: React;
}

export class ReactInspirationOnMotivationUseCase {
  constructor(
    private motivationRepository: MotivationRepository,
    private reactRepository: ReactRepository,
    private reactionRepository: ReactionRepository,
  ) {}

  async execute({
    authorId,
    motivationId,
  }: ReactOnMotivationRequest): Promise<ReactOnMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    if (motivation.authorId.toString() === authorId) {
      throw new Error("You cannot react on your own motivation");
    }

    const reaction = await this.reactionRepository.findInspiration();

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    const hasReaction = await this.reactRepository.findByAuthorId(authorId);

    if (hasReaction) {
      throw new Error("You already reacted on this motivation");
    }

    const react = React.create({
      authorId: new UniqueEntityID(authorId),
      motivationId: new UniqueEntityID(motivationId),
      reaction,
    });

    await this.reactRepository.create(react);

    return { react };
  }
}
