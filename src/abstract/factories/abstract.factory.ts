import { Identifiable } from '../definitions/identifiable.interface';

export interface AbstractFactory<T extends Identifiable, CreateDTO = any> {
  fromDto(dto: CreateDTO): Promise<T>;
}
