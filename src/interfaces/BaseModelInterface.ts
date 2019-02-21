import { ModelsInterface } from './ModelsInterface';

export interface BaseModelInterface {
    prototype?;
    associate?(model: ModelsInterface): void;
}