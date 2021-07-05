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

export class DispositionModel {
	id?: number;
	label?: string;
	slug?: string;
	ordre?: number;
	active?: boolean;
	is_with_comment: boolean;
	creator_id?: number;
	items ?: Array<DispositionModel>;
}

export class TraveauxDangereuxModel {
	id?: number;
	label?: string;
	slug?: string;
	ordre?: number;
	active?: boolean;
	creator_id?: number;
}

export class RisqueModel {
	id?: number;
	label?: string;
	slug?: string;
	ordre?: number;
	active?: boolean;
	creator_id?: number;
	is_other?: boolean;
	moyen?: Array<RisqueMoyenModel>;
	situation?: Array<RisqueMoyenModel>;
}

class RisqueMoyenModel {
	id?: number;
	label?: string;
	slug?: string;
	ordre?: number;
	active?: boolean;
	creator_id?: number;
	cat_pdp_risque_id?: number;
	is_title?: boolean;
	is_with_comment?: boolean;
	pdp_risque_moyen_filtre: Array<RisqueSubMoyenModel>;
	type?: string;
}


class RisqueSubMoyenModel {
	id?: number;
	label?: string;
	slug?: string;
	ordre?: number;
	active?: boolean;
	creator_id?: number;
	pdp_risque_id?: number;
	is_with_comment?: boolean;
}

export class PDPFrequences {
	id?: number;
	label?: string;
	slug?: string;
	active?: boolean;
	entity_id?: number;
}
