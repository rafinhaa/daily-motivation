import { Either } from "@core/types/either";

import { left, right } from "..";

function doSomething(x: boolean): Either<string, boolean> {
  if (x) return right(true);

  return left("failure");
}

describe("Either", () => {
  test("success returns Right", () => {
    const success = right("success");

    expect(success.value).toEqual("success");
  });

  test("failure returns Left", () => {
    const failure = left("failure");

    expect(failure.value).toEqual("failure");
  });

  test("doSomething returns Right", () => {
    const success = doSomething(true);

    expect(success.isRight()).toBe(true);
    expect(success.isLeft()).toBe(false);
  });

  test("doSomething returns Left", () => {
    const failure = doSomething(false);

    expect(failure.isLeft()).toEqual(true);
    expect(failure.isRight()).toEqual(false);
  });
});
