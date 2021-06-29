import {User} from '@app/core/auth'

export class ConsigneModel {
	id?: number;
	label?: string;
	slug?: string;
	ordre?: number;
	active?: boolean;
	is_comment_consigne: boolean;
	has_details: boolean;
	label_details: string;
	creator_id?: number;
}
