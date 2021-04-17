
export class Constraint {
    maximum: number;
    minimum: number;
    enum: [];
    pattern: string;
    description: string;

    constructor(){
        this.maximum = null;
        this.minimum = null;
        this.enum = null;
        this.pattern = null;
        this.description = null;
    }
}