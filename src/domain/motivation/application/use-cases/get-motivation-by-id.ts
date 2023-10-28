import { MotivationRepository } from "@motivation/application/repositories/motivation-repository";
import { Motivation } from "@motivation/enterprise/entities/motivation";

export interface GetMotivationRequest {
  motivationId: string;
}

interface GetMotivationResponse {
  motivation: Motivation | null;
}

export class GetMotivationByIdUseCase {
  constructor(private motivationRepository: MotivationRepository) {}

  async execute({
    motivationId,
  }: GetMotivationRequest): Promise<GetMotivationResponse> {
    const motivation = await this.motivationRepository.findById(motivationId);

    if (!motivation) {
      throw new Error("Motivation not found");
    }

    return { motivation };
  }
}
