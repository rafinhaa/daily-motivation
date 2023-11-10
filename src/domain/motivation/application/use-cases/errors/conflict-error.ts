import { UseCaseError } from "@core/errors/use-case-error";

export class ConflictError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || "Resource already exists");
  }
}
