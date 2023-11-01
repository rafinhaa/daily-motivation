import { faker } from "@faker-js/faker";
import {
  MotivationalParticipant,
  MotivationalParticipantProps,
} from "@motivation/enterprise/entities/motivational-participant";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export const makeMotivationalParticipant = (
  overrides?: Partial<MotivationalParticipantProps>,
  id?: UniqueEntityID,
) => {
  return MotivationalParticipant.create(
    {
      surname: faker.person.lastName(),
      ...overrides,
    },
    id,
  );
};
