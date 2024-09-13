import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export const getRepositoryMock = (entity: EntityClassOrSchema) => {
  return {
    provide: getRepositoryToken(entity),
    useValue: {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    },
  };
};
