import { faker } from "@faker-js/faker";
import {
  Motivation,
  MotivationProps,
} from "@motivation/enterprise/entities/motivation";

import { UniqueEntityID } from "@core/value-objects/unique-entity-id";

export const makeMotivation = (
  overrides?: Partial<MotivationProps>,
  id?: UniqueEntityID,
) => {
  return Motivation.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(faker.string.uuid()),
      createdAt: faker.date.past(),
      dailyMotivation: null,
      ...overrides,
    },
    id,
  );
};
