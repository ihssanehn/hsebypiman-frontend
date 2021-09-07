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
	is_always_true?: boolean;
	default_responsable?: Array<string>;
	slug?: string;
	ordre?: number;
	active?: boolean;
	creator_id?: number;
	is_other?: boolean;
	is_eu?: boolean;
	is_piman?: boolean;
	is_sous_traitant?: boolean;
	is_required_situation?: boolean;
	answer?: boolean;
	moyen?: Array<RisqueMoyenModel>;
	situation?: Array<RisqueMoyenModel>;
	other_pdp_moyen_risque?: Array<string>;
}

export class RisqueMoyenModel {
	id?: number;
	label?: string;
	answer?: string;
	is_selected?: boolean;
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
	is_selected?: boolean;
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
