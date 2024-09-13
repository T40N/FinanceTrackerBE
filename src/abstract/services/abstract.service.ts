import {
  DeepPartial,
  EntityMetadata,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { Identifiable } from '../interfaces/identifiable.interface';
import { AbstractFactory } from '../factories/abstract.factory';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractService<T extends Identifiable, CreateDTO = any> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly factory: AbstractFactory<T, CreateDTO>,
  ) {}

  async create(data: CreateDTO): Promise<T> {
    const resource = await this.factory.fromDto(data);
    return this.repository.save(resource);
  }

  async findAll(): Promise<T[]> {
    const metadata: EntityMetadata =
      this.repository.manager.connection.getMetadata(this.repository.target);

    const relations = metadata.relations.map(
      (relation) => relation.propertyPath,
    );

    return this.repository.find({ relations });
  }

  async findById(id: string): Promise<T> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this.repository.findBy({ id: In(ids) } as FindOptionsWhere<T>);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const resourceToUpdate = await this.findById(id);
    if (!resourceToUpdate) {
      throw new NotFoundException(
        `${this.repository.target.toString()} of id: ${id} not found`,
      );
    }

    Object.assign(resourceToUpdate, data);
    return this.repository.save(resourceToUpdate);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
