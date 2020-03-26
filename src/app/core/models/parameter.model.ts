import { Option } from '@app/core/models/option.model';

export class Parameter {
    name: string;
    label: string;
    options?: Array<Option>;
}