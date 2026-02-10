import xml.etree.ElementTree as ET
import json

SVG_FILE = "../assets/world.svg"
OUTPUT = "simplemaps_countries.json"

tree = ET.parse(SVG_FILE)
root = tree.getroot()
ns = {"svg": "http://www.w3.org/2000/svg"}

countries = {}

# Comprehensive ISO mapping for multi-landmass countries
iso_map = {
    "Angola": "AO",
    "Argentina": "AR",
    "Australia": "AU",
    "Azerbaijan": "AZ",
    "Canada": "CA",
    "China": "CN",
    "Denmark": "DK",
    "United States": "US",
    "Greece": "GR",
    "Indonesia": "ID",
    "Italy": "IT",
    "Japan": "JP",
    "Malaysia": "MY",
    "Norway": "NO",
    "Oman": "OM",
    "Philippines": "PH",
    "Papua New Guinea": "PG",
    "Turkey": "TR",
    "New Zealand": "NZ",
    "Chile": "CL",
    "Russian Federation": "RU",
    "Russia": "RU",
    "France": "FR",
    "American Samoa": "AS",
    "Antigua and Barbuda": "AG",
    "Bahamas": "BS",
    "Comoros": "KM",
    "Cape Verde": "CV",
    "Cayman Islands": "KY",
    "Cyprus": "CY",
    "Falkland Islands": "FK",
    "Faeroe Islands": "FO",
    "Federated States of Micronesia": "FM",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
    "Malta": "MT",
    "Northern Mariana Islands": "MP",
    "Mauritius": "MU",
    "Puerto Rico": "PR",
    "French Polynesia": "PF",
    "Solomon Islands": "SB",
    "São Tomé and Príncipe": "ST",
    "Seychelles": "SC",
    "Turks and Caicos Islands": "TC",
    "Tonga": "TO",
    "Trinidad and Tobago": "TT",
    "Vanuatu": "VU",
    "Samoa": "WS",
    "Canary Islands": "IC",
    "Guadeloupe": "GP",
    "Fiji": "FJ",
    "United Kingdom": "GB",
    "Netherlands": "NL",
    "Spain": "ES",
    "Portugal": "PT",
    "Sweden": "SE",
    "Finland": "FI",
    "Croatia": "HR",
    "Ecuador": "EC",
    "India": "IN",
    "Brazil": "BR",
    "Mexico": "MX",
}

for path in root.findall(".//svg:path", ns):
    iso = path.attrib.get("id")
    name = path.attrib.get("name")
    class_attr = path.attrib.get("class", "")
    
    # Get country name from classes (excluding highlight/activeCountry)
    classes = [c for c in class_attr.split() if c not in ['highlight', 'activeCountry']]
    class_name = ' '.join(classes) if classes else None

    # Case 1: Has valid 2-letter ISO id
    if iso and len(iso) == 2:
        iso_upper = iso.upper()
        display_name = name if name else class_name
        
        if display_name and iso_upper not in countries:
            countries[iso_upper] = {
                "iso2": iso_upper,
                "name": display_name
            }
    
    # Case 2: No id, use class name mapping
    elif class_name and class_name in iso_map:
        iso_code = iso_map[class_name]
        if iso_code not in countries:
            countries[iso_code] = {
                "iso2": iso_code,
                "name": class_name
            }

countries_list = list(countries.values())
countries_list.sort(key=lambda x: x["iso2"])

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(countries_list, f, indent=2)

print(f"Extracted {len(countries_list)} countries → {OUTPUT}")
print(f"\nMulti-landmass countries included: {sum(1 for c in countries_list if c['name'] in iso_map)}")