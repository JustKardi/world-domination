function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function update(country, previousGDP) {

    let baseGrowth =
        0.01 +                               
        (country.govStability - 50) * 0.0002  
        - (country.corruption * 0.0003); 

    baseGrowth += randFloat(-0.01, 0.01);

    country.gdp *= (1 + baseGrowth);

    country.gdp = Math.max(0, country.gdp);

    let inflationPressure =
        (country.militaryExp * 0.02) -
        (country.govStability * 0.01);

    country.inflation += inflationPressure;
    country.inflation += (2 - country.inflation) * 0.05;
    country.inflation += randFloat(-0.2, 0.2);

    if (country.gdp > previousGDP) {
        country.unemployment -= randFloat(0.1, 0.3);
    } else {
        country.unemployment += randFloat(0.1, 0.3);
    }

    if (country.inflation > 6) {
        country.unemployment += 0.2;
    }

    country.govStability +=
        (country.humanDevIndex - 0.5) * 2 -
        (country.unemployment * 0.05) -
        (country.inflation * 0.03) -
        (country.corruption * 0.04);

    country.govStability += randFloat(-1, 1);

    country.humanDevIndex +=
        (country.gdp / 1_000_000_000_000) * 0.0005 -
        (country.corruption * 0.0005);

    country.humanDevIndex += randFloat(-0.005, 0.005);

    if (country.regime === "Autocracy") {
        country.corruption += randFloat(0, 0.5);
    } else {
        country.corruption -= randFloat(0, 0.3);
    }

    country.militaryExp += randFloat(-0.2, 0.2);

    country.army += (country.militaryExp * 10);
    country.army += randFloat(-50, 50);

    if (country.govStability <= 10) {

        if (Math.random() < 0.3) {
            country.regime =
                country.regime === "Democracy"
                    ? "Autocracy"
                    : "Democracy";
        }

        country.govStability = 50;
        country.gdp *= 0.9;
        country.army *= 0.7;
    }

    country.inflation = clamp(country.inflation, -5, 25);
    country.unemployment = clamp(country.unemployment, 0, 40);
    country.govStability = clamp(country.govStability, 0, 100);
    country.corruption = clamp(country.corruption, 0, 100);
    country.humanDevIndex = clamp(country.humanDevIndex, 0, 1);
    country.militaryExp = clamp(country.militaryExp, 0, 20);
    country.army = Math.max(0, country.army);
}
