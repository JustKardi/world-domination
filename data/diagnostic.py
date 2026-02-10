import xml.etree.ElementTree as ET

SVG_FILE = "../assets/world.svg"

tree = ET.parse(SVG_FILE)
root = tree.getroot()
ns = {"svg": "http://www.w3.org/2000/svg"}

print("Countries without ID (multi-landmass):")
seen = set()
for path in root.findall(".//svg:path", ns):
    iso = path.attrib.get("id")
    class_attr = path.attrib.get("class", "")
    
    if not iso and class_attr:
        # Remove highlight/activeCountry classes
        classes = [c for c in class_attr.split() if c not in ['highlight', 'activeCountry']]
        if classes:
            # Join remaining classes to get full country name
            class_name = ' '.join(classes)
            if class_name and class_name not in seen:
                seen.add(class_name)
                print(f"  {class_name}")

print(f"\nTotal: {len(seen)} countries")