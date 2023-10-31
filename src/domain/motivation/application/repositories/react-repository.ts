import { React } from "@motivation/enterprise/entities/react";

export interface ReactRepository {
  create(react: React): Promise<void>;
  findByAuthorId(authorId: string): Promise<React | null>;
}
