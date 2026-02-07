import xml.etree.ElementTree as ET
import json

SVG_FILE = "../assets/world.svg"
OUTPUT = "simplemaps_countries.json"

tree = ET.parse(SVG_FILE)
root = tree.getroot()

# SVGs use XML namespaces
ns = {"svg": "http://www.w3.org/2000/svg"}

countries = []

for path in root.findall(".//svg:path", ns):
    iso = path.attrib.get("id")
    name = path.attrib.get("name")

    # Filter out junk paths
    if iso and name and len(iso) == 2:
        countries.append({
            "iso2": iso.upper(),
            "name": name
        })

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(countries, f, indent=2)

print(f"Extracted {len(countries)} countries → {OUTPUT}")
