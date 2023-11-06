import { Either } from "@core/types";

import { Right } from ".";

export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isRight(): this is Right<L, R> {
    return false;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }
}

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value);
};
