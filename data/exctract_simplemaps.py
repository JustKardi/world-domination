import xml.etree.ElementTree as ET
import json

SVG_FILE = "../assets/world.svg"
OUTPUT = "simplemaps_countries.json"

tree = ET.parse(SVG_FILE)
root = tree.getroot()

# SVGs use XML namespaces
ns = {"svg": "http://www.w3.org/2000/svg"}

countries = {}  # Use dict to avoid duplicates

for path in root.findall(".//svg:path", ns):
    iso = path.attrib.get("id")
    name = path.attrib.get("name")
    class_name = path.attrib.get("class")

    # Case 1: Single landmass country (has id)
    if iso and name and len(iso) == 2:
        iso_upper = iso.upper()
        if iso_upper not in countries:
            countries[iso_upper] = {
                "iso2": iso_upper,
                "name": name
            }
    
    # Case 2: Multi-landmass country (only has class, no id)
    elif class_name and not iso:
        # The class name IS the country name (e.g., "United States")
        # We need to manually map these to ISO codes
        country_name = class_name.strip()
        
        # Manual ISO mapping for multi-landmass countries
        iso_map = {
            "United States": "US",
            "Russia": "RU",
            "United Kingdom": "GB",
            "France": "FR",
            "Netherlands": "NL",
            "Denmark": "DK",
            "Norway": "NO",
            "Indonesia": "ID",
            "Malaysia": "MY",
            "Philippines": "PH",
            "Japan": "JP",
            "New Zealand": "NZ",
            "Canada": "CA",
            "Australia": "AU",
            "Chile": "CL",
            "Italy": "IT",
            "Greece": "GR",
            "Croatia": "HR",
            "Ecuador": "EC",
            "Portugal": "PT",
            "Spain": "ES",
            "Finland": "FI",
            "Sweden": "SE",
            "India": "IN",
            "China": "CN",
        }
        
        if country_name in iso_map:
            iso_code = iso_map[country_name]
            if iso_code not in countries:
                countries[iso_code] = {
                    "iso2": iso_code,
                    "name": country_name
                }

# Convert dict to list
countries_list = list(countries.values())

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(countries_list, f, indent=2)

print(f"Extracted {len(countries_list)} countries → {OUTPUT}")