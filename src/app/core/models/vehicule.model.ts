
export class Vehicule {
    _id?: number;
    libelle?: string;
    type?: string;

    constructor(type: string, libelle: string = '') {
        this.libelle = libelle;
        this.type = type;
    }
}