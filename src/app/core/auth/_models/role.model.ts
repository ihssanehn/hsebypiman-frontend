import { BaseModel } from '../../_base/crud';

export class Role extends BaseModel {
    id: number;
    title: string;
    slug: string;
    libelle: string;
    code: string;
    isCoreRole = false;
    permissions : number[];

    clear(): void {
        this.id = undefined;
        this.title = '';
        this.slug = "";
        this.permissions = [];
        this.isCoreRole = false;
	}
}
