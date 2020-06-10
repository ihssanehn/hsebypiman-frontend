
export class Outillage {
    id(id: any) {
      throw new Error("Method not implemented.");
    }
    _id?: number;
    libelle?: string;
    type?: string;

    constructor(type: string, libelle: string = '') {
        this.libelle = libelle;
        this.type = type;
    }
}