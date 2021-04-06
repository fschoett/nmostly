class Car{

    name: string;
    tires: Tire[] = [];

    constructor(){
        for( let i=0; i<4; i++ ){
            let newTire = new Tire();
            this.tires.push( newTire );
        }
    }


    getTires(){
        return this.tires;
    }

    printTirePressures(){
        console.log( this.tires );
        
    }
}

class Tire{
    pressure: number;

    constructor(){
        this.pressure = 2;
    }

    public setPressure( newPressure ){ this.pressure = newPressure}
}


let car = new Car();
car.getTires()[2].setPressure( 4 );
car.printTirePressures();

/*
output:
[
  Tire { pressure: 2 },
  Tire { pressure: 2 },
  Tire { pressure: 4 },
  Tire { pressure: 2 }
]
*/