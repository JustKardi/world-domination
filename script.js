import { Country } from './country.js';
import { update } from './engine.js';

const allPaths = document.querySelectorAll('path');
const toolTip = document.getElementById('tooltip');
const title = document.getElementById('countryTitle');
const hovering = document.getElementById('hovering');
const info = document.getElementById('info');
const btn1 = document.getElementById('btn-1');
let selectedCountry;

const nameToISO = {};

const gameState = {
    nations: {},
    month: 0
}

async function loadWorld() {
    const res = await fetch('./data/countries.json');
    const data = await res.json();

    for (const iso in data) {
        const country = new Country(data[iso]);
        gameState.nations[iso] = country;

        nameToISO[country.name] = iso;

        if (iso === 'US') nameToISO['United States'] = iso;
        if (iso === 'GB') nameToISO['United Kingdom'] = iso;
        if (iso === 'RU') nameToISO['Russia'] = iso;
    }

    console.log("World loaded:", gameState.nations);
    console.log("Name to ISO mappings:", nameToISO);
}

function setupEventListeners() {
    allPaths.forEach(path => {
        path.addEventListener('mouseenter', () => {
            const countryClass = path.classList[0];

            let displayName = path.getAttribute('name') || path.classList.value;

            if (displayName.includes(' activeCountry')) {
                displayName = displayName.replaceAll(' activeCountry', '');
            }

            hovering.textContent = displayName;

            toolTip.innerText = displayName;
            toolTip.style.display = 'block';
            
            if (countryClass) {
                document.querySelectorAll('.' + countryClass).forEach(island => {
                    island.classList.add('highlight');
                });
            } else {
                path.classList.add('highlight');
            }
        });

        path.addEventListener('mousemove', (e) => {
            toolTip.style.left = (e.pageX + 15) + 'px';
            toolTip.style.top = (e.pageY + 15) + 'px';
        })

        path.addEventListener('mouseleave', () => {

            toolTip.style.display = 'none';

            hovering.textContent = '';

            const countryClass = path.classList[0];
            
            if (countryClass) {
                document.querySelectorAll('.' + countryClass).forEach(island => {
                    island.classList.remove('highlight');
                });
            } else {
                path.classList.remove('highlight');
            }
        });

        path.addEventListener('mousedown', () => {

            console.log('Path clicked:', {
                id: path.getAttribute('id'),
                name: path.getAttribute('name'),
                classes: path.classList.value
            });

            document.querySelectorAll('path').forEach(p => p.classList.remove('activeCountry'));

            const country = getCountryFromPath(path);
            if (!country) {
                console.warn("Country not found for path", path);
                console.log("nameToISO contents:", nameToISO);
                return;
            }

            selectedCountry = country;
            title.textContent = country.name;
            renderCountryInfo(country);

            const countryClass = path.classList[0];
            document.querySelectorAll('.' + countryClass).forEach(p => {
                p.classList.add('activeCountry');
            });
        });
    });
}

await loadWorld();
setupEventListeners();

function renderCountryInfo(country) {
    if (!country) return;

    info.innerHTML = `
        <strong>GDP:</strong> ${Math.round(country.gdp).toLocaleString()}
        <strong>Inflation:</strong> ${country.inflation}%
        <strong>Stability:</strong> ${Math.round(country.govStability)}
        <strong>Unemployment:</strong> ${country.unemployment}%
        <strong>Regime Type:</strong> ${country.regime}
        <strong>Corruption:</strong> ${country.corruption}
        <strong>Human Development:</strong> ${country.humanDevIndex}
        <strong>Military Spending:</strong> $${country.militaryExp}
        <strong>Army Power:</strong> ${country.army}
        <strong>Nuclear:</strong> ${country.isNuclear ? 'Yes' : 'No'}
        <strong>Alliances:</strong> ${country.alliances}
    `;
}


function getCountryFromPath(path) {

    let iso = path.getAttribute('id');

    if (!iso) {

        const nameAttr = path.getAttribute('name');
        if (nameAttr) {
            iso = nameToISO[nameAttr];
        }

        if (!iso) {

            const classList = Array.from(path.classList);
            const countryClasses = classList.filter(c => c !== 'highlight' && c !== 'activeCountry');

            const className = countryClasses.join(' ');
            
            console.log('Country class name:', className);
            
            if (className) {
                iso = nameToISO[className];
                
                if (!iso) {
                    const lowerClassName = className.toLowerCase();
                    for (const [name, isoCode] of Object.entries(nameToISO)) {
                        if (name.toLowerCase() === lowerClassName) {
                            iso = isoCode;
                            break;
                        }
                    }
                }
            }
        }
    }

    return gameState.nations[iso] || null;
}

function loop() {
    for (const country of Object.values(gameState.nations)) {
        const oldGDP = country.gdp;
        update(country, oldGDP);
    }
}

btn1.addEventListener('mousedown', (e) => {
    console.log("Button Clicked. Current Selected:", selectedCountry?.name);
    
    if (selectedCountry) {
        const oldStability = selectedCountry.govStability;
        loop();
        console.log(`Stability Change: ${oldStability} -> ${selectedCountry.govStability}`);
        renderCountryInfo(selectedCountry);
    } else {
        console.warn("No country selected! Click a country on the map first.");
    }
});
