function r(a) {
    return Math.floor(Math.random() * a);
}

export function update(country, startGDP) {
    if (country.stability < 50) {
        country.inflation += r(5);
        country.unemployment += r(5);
        country.gdp -= r(1000000000000);
        country.corruption += r(2);
        country.humanDevIndex -= r(0.2);
        country.army -= r(1000);
    }
    if (country.stability <= 0) {
        country.regime = (r(1)) ? 'Autocracy' : 'Democracy';
        let counter = 90;
        for (let i = 0; i < country.revoltCounter; i++) {
            counter *= r(0.99);
        }
        country.stability = Math.floor(counter);
        country.gdp -= r(20000000000000);
        country.army /= 2;
    }
    if (country.gdp < startGDP) {
        country.stability -= r(3);
        country.unemployment += r(1);
        country.humanDevIndex -= r(0.1);
        country.militaryExp -= r(0.5);
    }
}