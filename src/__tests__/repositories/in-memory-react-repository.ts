import { ReactRepository } from "@motivation/application/repositories/react-repository";
import { React } from "@motivation/enterprise/entities/react";

export class InMemoryReactRepository implements ReactRepository {
  private reacts: React[] = [];

  async create(react: React): Promise<void> {
    this.reacts.push(react);
  }

  async findByAuthorId(reactId: string): Promise<React | null> {
    return (
      this.reacts.find((react) => react.authorId.toString() === reactId) || null
    );
  }
}
