# build_countries.py
import json
import requests

with open("simplemaps_countries.json", "r", encoding="utf-8") as f:
    base = json.load(f)

def wb(indicator):
    url = f"https://api.worldbank.org/v2/country/all/indicator/{indicator}?format=json&per_page=20000"
    r = requests.get(url).json()
    out = {}

    if not isinstance(r, list) or len(r) < 2:
        return out

    for row in r[1]:
        if row.get("value") is None:
            continue

        # Extract ISO code safely
        iso = None
        if "countryiso2code" in row:
            iso = row["countryiso2code"]
        elif "country" in row and "id" in row["country"]:
            iso = row["country"]["id"]

        # FIRST value is the most recent → keep it
        if iso and iso not in out:
            out[iso] = row["value"]

    return out



gdp = wb("NY.GDP.MKTP.CD")
inflation = wb("FP.CPI.TOTL.ZG")
unemployment = wb("SL.UEM.TOTL.ZS")
military = wb("MS.MIL.XPND.GD.ZS")

NUCLEAR = {"US","RU","CN","FR","GB","IN","PK","IL","KP"}

world = {}

for c in base:
    iso = c["iso2"]

    world[iso] = {
        "iso2": iso,
        "name": c["name"],

        "gdp": gdp.get(iso, 0),
        "inflation": inflation.get(iso, 2.0),
        "unemployment": unemployment.get(iso, 5.0),
        "military_spending": military.get(iso, 2.0),

        "corruption": 50,
        "humanDevIndex": 0.7,

        "govStability": 100,
        "regime": "Democracy",
        "tradeBalance": 0,
        "army": 1000,

        "isNuclear": iso in NUCLEAR,
        "alliances": { "nato": False, "un": True, "eu": False },
        "relations": {}
    }

with open("countries.json", "w", encoding="utf-8") as f:
    json.dump(world, f, indent=2)

print("countries.json generated")
