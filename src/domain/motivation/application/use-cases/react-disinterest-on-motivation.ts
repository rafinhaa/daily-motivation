import { React } from "@motivation/enterprise/entities/react";

import { left, right } from "@core/either";
import { Either } from "@core/types";
import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

import { MotivationRepository } from "../repositories/motivation-repository";
import { ReactRepository } from "../repositories/react-repository";
import { ReactionRepository } from "../repositories/reaction-repository";
import { NotAllowedError, ResourceNotFoundError } from "./errors";

export interface ReactDisinterestOnMotivationRequest {
  authorId: string;
  motivationId: string;
}

type ReactDisinterestOnMotivationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    react: React;
  }
>;

export class ReactDisinterestOnMotivationUseCase {
  constructor(
    private motivationRepository: MotivationRepository,
    private reactRepository: ReactRepository,
    private reactionRepository: ReactionRepository,
  ) {}

  async execute({
    authorId,
    motivationId,
  }: ReactDisinterestOnMotivationRequest): Promise<ReactDisinterestOnMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      return left(new ResourceNotFoundError("Motivation not found"));
    }

    if (motivation.authorId.toString() === authorId) {
      return left(
        new NotAllowedError("You cannot react on your own motivation"),
      );
    }

    const reaction = await this.reactionRepository.findDisinterest();

    if (!reaction) {
      return left(new ResourceNotFoundError("Reaction not found"));
    }

    const hasReaction = await this.reactRepository.findByAuthorId(authorId);

    if (hasReaction) {
      return left(
        new NotAllowedError("You already reacted on this motivation"),
      );
    }

    const react = React.create({
      authorId: new UniqueEntityID(authorId),
      motivationId: new UniqueEntityID(motivationId),
      reaction,
    });

    await this.reactRepository.create(react);

    return right({ react });
  }
}
