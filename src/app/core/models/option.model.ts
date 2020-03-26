
export class Option {
    _id?: number;
    label?: string;
    type: string;

    constructor(type: string, label: string = '') {
        this.label = label;
        this.type = type;
    }
}