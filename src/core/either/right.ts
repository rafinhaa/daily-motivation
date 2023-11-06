import { Either } from "@core/types";

import { Left } from ".";

export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }
}

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value);
};
