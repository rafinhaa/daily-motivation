import { Left, Right } from "@core/either";

export type Either<L, R> = Left<L, R> | Right<L, R>;
