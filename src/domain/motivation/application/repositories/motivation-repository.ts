import { Motivation } from "@motivation/enterprise/entities/motivation";

import { FetchDataParams } from "@core/types";

export interface MotivationRepository {
  create(motivation: Motivation): Promise<void>;
  findById(motivationId: string): Promise<Motivation | null>;
  delete(motivation: Motivation): Promise<void>;
  save(motivation: Motivation): Promise<void>;
  findManyRecent(params: Required<FetchDataParams>): Promise<Motivation[]>;
  findManyRecentByAuthorId(
    authorId: string,
    params: Required<FetchDataParams>,
  ): Promise<Motivation[]>;
  getDailyMotivation(): Promise<Motivation | null>;
  getNewDailyMotivation(): Promise<Motivation>;
}
