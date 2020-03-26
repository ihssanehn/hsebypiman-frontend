import { Option } from '@app/core/models/option.model';

export interface ParameterService {
    get();
    createOption(option: Option);
    deleteOption(id: number);
    updateOption(option: Option);
}