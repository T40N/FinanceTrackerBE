import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  EntityMetadata,
  EntityTarget,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { Identifiable } from './interfaces/identifiable.interface';
import { NotFoundException } from '@nestjs/common';
import { AbstractFactory } from './abstract.factory';

export abstract class AbstractService<T extends Identifiable, CreateDTO = any> {
  protected repository: Repository<T>;
  protected resourceName: string;
  protected factory: AbstractFactory<T, CreateDTO>;

  constructor(
    private readonly entityClass: EntityTarget<T>,
    @InjectDataSource() protected readonly dataSource: DataSource,
    factory: AbstractFactory<T>,
    resourceName?: string,
  ) {
    this.repository = this.dataSource.getRepository(entityClass);
    this.factory = factory;
    this.resourceName = resourceName || 'Resource';
  }

  async create(data: CreateDTO): Promise<T> {
    const resource = await this.factory.fromDto(data);
    return this.repository.save(resource);
  }

  async findAll(): Promise<T[]> {
    const metadata: EntityMetadata =
      this.repository.manager.connection.getMetadata(this.entityClass);

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
        `${this.resourceName} of id: ${id} not found`,
      );
    }

    Object.assign(resourceToUpdate, data);
    return this.repository.save(resourceToUpdate);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
