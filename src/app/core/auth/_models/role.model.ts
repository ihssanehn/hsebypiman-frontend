import { BaseModel } from '../../_base/crud';
import { Permission } from './permission.model';

export class Role extends BaseModel {
    id: number;
    title: string;
    slug: string;
    libelle: string;
    code: string;
    isCoreRole: boolean = false;
    permissions? : any[];

    clear(): void {
        this.id = undefined;
        this.title = '';
        this.slug = "";
        this.permissions = [];
        this.isCoreRole = false;
	}
}
