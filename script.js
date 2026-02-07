import { Country } from './country.js';

const allPaths = document.querySelectorAll('path');
const toolTip = document.getElementById('tooltip');
const title = document.getElementById('countryTitle');
const hovering = document.getElementById('hovering');
const info = document.getElementById('info');
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

// Load world data FIRST, then set up event listeners
await loadWorld();
setupEventListeners();

function nextMonth() {
    gameState.month++;

    for (const country of Object.values(gameState.nations)) {
        country.update();
    }

    console.log(`Month ${gameState.month} processed`);
}

function renderCountryInfo(country) {

    info.textContent = `
        GDP: ${Math.round(country.gdp)}
        Inflation: ${country.inflation}%
        Stability: ${Math.round(country.govStability)}
        Unemployment: ${country.unemployment}%
        Regime Type: ${country.regime}
        Corruption: ${country.corruption}
        Human Development: ${country.humanDevIndex}
        Military Spending: $${country.militaryExp}
        Army Power: ${country.army}
        Nuclear Capability: ${country.isNuclear}
        Alliances: ${country.alliances}
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