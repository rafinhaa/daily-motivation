import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

import { FetchDataParams } from "@core/types";

export class InMemoryMotivationRepository implements MotivationRepository {
  private motivations: Motivation[] = [];

  async create(motivation: Motivation): Promise<void> {
    this.motivations.push(motivation);
  }

  async findById(motivationId: string): Promise<Motivation | null> {
    return (
      this.motivations.find(
        (motivation) => motivation.id.toString() === motivationId,
      ) || null
    );
  }

  async delete(motivation: Motivation): Promise<void> {
    const motivationIndex = this.motivations.findIndex(
      (item) => item.id === motivation.id,
    );
    this.motivations.splice(motivationIndex, 1);
  }

  async save(motivation: Motivation): Promise<void> {
    const motivationIndex = this.motivations.findIndex(
      (item) => item.id === motivation.id,
    );
    this.motivations[motivationIndex] = motivation;
  }

  async findManyRecent(
    params: Required<FetchDataParams>,
  ): Promise<Motivation[]> {
    return this.motivations
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(
        (params.page - 1) * params.limitPerPage,
        params.page * params.limitPerPage,
      );
  }

  async findManyRecentByAuthorId(
    authorId: string,
    params: Required<FetchDataParams>,
  ): Promise<Motivation[]> {
    return this.motivations
      .filter((motivation) => motivation.authorId.toString() === authorId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(
        (params.page - 1) * params.limitPerPage,
        params.page * params.limitPerPage,
      );
  }

  async getDailyMotivation(): Promise<Motivation | null> {
    return (
      this.motivations.find(
        (motivation) => motivation.dailyMotivation !== null,
      ) || null
    );
  }

  async getNewDailyMotivation(): Promise<Motivation> {
    return this.motivations[
      Math.floor(Math.random() * this.motivations.length)
    ];
  }
}
