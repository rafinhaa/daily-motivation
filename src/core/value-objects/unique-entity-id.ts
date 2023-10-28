import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private _id: string;

  toString(): string {
    return this._id;
  }

  constructor(id?: string) {
    this._id = id ?? randomUUID();
  }
}
