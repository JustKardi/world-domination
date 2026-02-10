export class Country {
    constructor(data) {

        this.id = data.iso2;
        this.name = data.name;

        this.gdp = data.gdp || 0;
        this.inflation = data.inflation || 2.0;
        this.unemployment = data.unemployment || 5.0;
        this.tradeBalance = 0;

        this.govStability = 100;
        this.regime = "Democracy"; 
        this.corruption = data.corruption || 10;
        this.humanDevIndex = 0.7;

        this.relations = {};
        this.militaryExp = data.military_spending || 2.0;
        this.army = 1000; 
        this.isNuclear = false;

        this.alliances = {
            nato: false,
            un: true,
            eu: false
        };

        this.revoltCounter = 0;
    }

    update() {
        this.calculateEconomy();
        this.checkStability();
    }

    calculateEconomy() {
        if (this.unemployment > 10) {
            this.gdp *= 0.99; 
            this.govStability -= 0.1;
        }
    }

    checkStability() {
        if (this.govStability < 20) {
            console.log(`${this.name} is facing a revolution!`);
        }
    }
}
