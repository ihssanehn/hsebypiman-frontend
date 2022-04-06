
export class Vehicule {
    id?: number;
    libelle?: string;
    marque?: string;
    type?: string;

    constructor(type: string, libelle: string = '', marque: string = '') {
        this.libelle = libelle;
        this.marque = marque;
        this.type = type;
    }
}