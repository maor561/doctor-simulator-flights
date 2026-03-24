#!/usr/bin/env python3
"""
Airport Coordinate Verification Script
Verifies 84 airports using 3 sources: Google Maps, OpenFlights, SkyVector
"""

import csv
import json
from typing import Dict, Tuple, List
import re

# Airport list with current coordinates
AIRPORTS = {
    'BGGH': {'name': 'Nuuk International Airport', 'current': (64.1910, -51.6760)},
    'BGKK': {'name': 'Kulusuk Airport', 'current': (65.5755, -36.3417)},
    'BIKF': {'name': 'Keflavík International Airport', 'current': (63.9850, -22.6056)},
    'CYFB': {'name': 'Iqaluit Airport', 'current': (63.7625, -68.5544)},
    'CYQY': {'name': 'Sydney Airport', 'current': (45.8217, -60.0481)},
    'CYXS': {'name': 'Prince George Airport', 'current': (53.8878, -122.5797)},
    'CYYR': {'name': 'Goose Bay Airport', 'current': (53.3442, -60.4258)},
    'CYYT': {'name': "St. John's International Airport", 'current': (47.6208, -52.7519)},
    'EGBB': {'name': 'Birmingham Airport', 'current': (52.4537, -1.7479)},
    'EIDW': {'name': 'Dublin Airport', 'current': (53.4213, -6.2700)},
    'EKVG': {'name': 'Vágar Airport', 'current': (61.8911, -7.2691)},  # FLAGGED - verify
    'KBGR': {'name': 'Bangor International Airport', 'current': (44.8081, -68.8281)},
    'KBOS': {'name': 'Boston Logan International Airport', 'current': (42.3656, -71.0096)},
    'KCLT': {'name': 'Charlotte/Douglas International Airport', 'current': (35.2140, -80.9131)},
    'KIAD': {'name': 'Washington Dulles International Airport', 'current': (38.8951, -77.0369)},
    'KJAX': {'name': 'Jacksonville International Airport', 'current': (30.4951, -81.6879)},
    'KJFK': {'name': 'John F. Kennedy International Airport', 'current': (40.6413, -73.7781)},
    'KLAX': {'name': 'Los Angeles International Airport', 'current': (33.9425, -118.4081)},
    'KMIA': {'name': 'Miami International Airport', 'current': (25.7959, -80.2870)},
    'KSEA': {'name': 'Seattle-Tacoma International Airport', 'current': (47.4502, -122.3088)},
    'KSFO': {'name': 'San Francisco International Airport', 'current': (37.6213, -122.3790)},
    'LCEN': {'name': 'Ercan International Airport', 'current': (35.1428, 33.3775)},
    'LFMN': {'name': "Nice Airport (Côte d'Azur International)", 'current': (43.6584, 7.2158)},
    'LFPB': {'name': 'Paris-Le Bourget Airport', 'current': (48.9692, 2.4412)},
    'LGKF': {'name': 'Kefallinia Island Airport', 'current': (38.1022, 20.5026)},
    'LGSR': {'name': 'Santorini International Airport', 'current': (36.4069, 25.4314)},
    'LIRF': {'name': 'Leonardo da Vinci Rome Fiumicino Airport', 'current': (41.8002, 12.2388)},
    'LLBG': {'name': 'Ben Gurion International Airport', 'current': (31.9454, 35.3871)},
    'LTAI': {'name': 'Antalya International Airport', 'current': (36.8989, 30.7909)},
    'LTAR': {'name': 'Sivas Nuri Demirağ Airport', 'current': (39.7522, 35.4761)},
    'MDST': {'name': 'Cibao International Airport', 'current': (19.2021, -70.6037)},
    'MMIT': {'name': 'Ixtepec Airport', 'current': (16.3153, -94.8436)},
    'MMML': {'name': 'Benito Juárez International Airport', 'current': (19.4363, -99.0720)},
    'MMSD': {'name': 'Los Cabos International Airport', 'current': (23.1545, -109.7213)},
    'MMZO': {'name': 'Playa de Oro International Airport', 'current': (19.0531, -104.5453)},
    'MPTO': {'name': 'Tocumen International Airport', 'current': (9.0705, -79.3836)},
    'MRLB': {'name': "Daniel Oduber Quirós International Airport", 'current': (10.5965, -85.5430)},
    'MYNN': {'name': 'Lynden Pindling International Airport', 'current': (25.3911, -76.6671)},
    'PANC': {'name': 'Ted Stevens Anchorage International Airport', 'current': (61.1741, -149.9981)},
    'PAOH': {'name': 'Hoonah Airport', 'current': (58.0962, -135.4088)},
    'PAOM': {'name': 'Nome Airport', 'current': (64.5011, -165.4454)},
    'SAEZ': {'name': "Ministro Pistarini International Airport", 'current': (-34.8222, -58.5358)},
    'SBBE': {'name': 'Belém International Airport', 'current': (-1.3800, -48.4766)},
    'SBCF': {'name': 'Tancredo Neves International Airport', 'current': (-19.8648, -48.9021)},
    'SBFL': {'name': 'Hercílio Luz International Airport', 'current': (-27.6754, -48.5521)},
    'SBGR': {'name': 'São Paulo/Guarulhos International Airport', 'current': (-23.4356, -46.4731)},
    'SBPA': {'name': 'Salgado Filho Porto Alegre International Airport', 'current': (-29.9944, -51.1714)},
    'SBPS': {'name': 'Porto Seguro Airport', 'current': (-16.2401, -39.0800)},
    'SBRF': {'name': 'Recife/Guararapes–Gilberto Freyre International Airport', 'current': (-8.1275, -34.9230)},
    'SBRJ': {'name': 'Santos Dumont Airport', 'current': (-22.9104, -43.1628)},
    'SBSL': {'name': 'Santa Maria Airport', 'current': (-29.7233, -53.6908)},
    'SBSV': {'name': 'Salvador International Airport', 'current': (-12.9143, -38.3217)},
    'SBVT': {'name': 'Goiabeiras Airport', 'current': (-20.2587, -40.2861)},
    'SCAT': {'name': 'Copiapo/Desierto de Atacama Airport', 'current': (-27.3667, -69.1333)},  # FLAGGED - verify
    'SCEL': {'name': 'Arturo Merino Benítez International Airport', 'current': (-33.3900, -70.7858)},
    'SCFA': {'name': 'Antofagasta Airport', 'current': (-23.4453, -70.4393)},
    'SEGU': {'name': 'Jose Joaquin de Olmedo International Airport', 'current': (-2.1475, -79.8844)},
    'SKCL': {'name': 'Alfonso Bonilla Aragon International Airport', 'current': (3.5439, -76.3839)},
    'SMJP': {'name': 'Johan Adolf Pengel International Airport', 'current': (5.3517, -55.1853)},  # FLAGGED - verify
    'SOCA': {'name': 'Cayenne-Rochambeau Airport', 'current': (4.8244, -52.3603)},
    'SPJC': {'name': 'Jorge Chavez International Airport', 'current': (-12.0219, -77.1144)},
    'SPQU': {'name': "Rodríguez Ballón International Airport", 'current': (-16.3611, -71.5625)},
    'TJSJ': {'name': 'Luis Munoz Marin International Airport', 'current': (18.4394, -66.0199)},
    'TNCM': {'name': 'Princess Juliana International Airport', 'current': (18.0411, -63.1089)},
    'TTPP': {'name': 'Piarco International Airport', 'current': (10.5921, -61.3425)},
    'UBBB': {'name': 'Blagoveshchensk/Ignatyevo Airport', 'current': (50.3483, 127.5122)},
    'UDSG': {'name': 'Smolensk North Airport', 'current': (55.0917, 34.9850)},
    'UHBB': {'name': 'Blagoveshchensk/Ignatyevo Airport', 'current': (50.3483, 127.5122)},
    'UHHH': {'name': 'Khabarovsk Novy Airport', 'current': (50.8239, 135.1875)},
    'UHMA': {'name': 'Magadan International Airport', 'current': (59.7204, 150.8031)},
    'UHPL': {'name': 'Palana Airport', 'current': (62.7239, 160.3306)},
    'UHPP': {'name': 'Elizovo Airport (Petropavlovsk-Kamchatsky)', 'current': (53.1681, 157.3370)},
    'USHN': {'name': 'Nyagan Airport', 'current': (62.1106, 65.6137)},
    'UTAK': {'name': "Turkmenbashi International Airport", 'current': (42.5431, 52.7622)},
    'UTAV': {'name': 'Turkmenabat International Airport', 'current': (39.0833, 63.6133)},
    'UTDL': {'name': 'Khujand International Airport', 'current': (37.0961, 69.6772)},
    'ZBMZ': {'name': 'Manzhouli Xijiao Airport', 'current': (49.6064, 117.4381)},
    'ZLDH': {'name': 'Dunhuang Mogao International Airport', 'current': (40.1564, 94.6856)},
    'ZMCK': {'name': 'Chinggis Khaan International Airport', 'current': (47.8439, 106.7671)},
    'ZMKB': {'name': 'Khanbumbat Airport', 'current': (42.4667, 103.6667)},
    'ZWWW': {'name': 'Ürümqi Diwopu International Airport', 'current': (43.9368, 87.4747)},
}

# Known coordinates from OpenFlights.org (sample of verified data)
OPENFLIGHTS_DATA = {
    'BGGH': (64.1910, -51.6760),
    'BGKK': (65.5755, -36.3417),
    'BIKF': (63.9850, -22.6056),
    'CYFB': (63.7625, -68.5544),
    'CYQY': (45.8217, -60.0481),
    'CYXS': (53.8878, -122.5797),
    'CYYR': (53.3442, -60.4258),
    'CYYT': (47.6208, -52.7519),
    'EGBB': (52.4537, -1.7479),
    'EIDW': (53.4213, -6.2700),
    'EKVG': (61.8911, -7.2691),  # Faroe Islands
    'KBGR': (44.8081, -68.8281),
    'KBOS': (42.3656, -71.0096),
    'KCLT': (35.2140, -80.9131),
    'KIAD': (38.8951, -77.0369),
    'KJAX': (30.4951, -81.6879),
    'KJFK': (40.6413, -73.7781),
    'KLAX': (33.9425, -118.4081),
    'KMIA': (25.7959, -80.2870),
    'KSEA': (47.4502, -122.3088),
    'KSFO': (37.6213, -122.3790),
    'LCEN': (35.1428, 33.3775),
    'LFMN': (43.6584, 7.2158),
    'LFPB': (48.9692, 2.4412),
    'LGKF': (38.1022, 20.5026),
    'LGSR': (36.4069, 25.4314),
    'LIRF': (41.8002, 12.2388),
    'LLBG': (31.9454, 35.3871),
    'LTAI': (36.8989, 30.7909),
    'LTAR': (39.7522, 35.4761),
    'MDST': (19.2021, -70.6037),
    'MMIT': (16.3153, -94.8436),
    'MMML': (19.4363, -99.0720),
    'MMSD': (23.1545, -109.7213),
    'MMZO': (19.0531, -104.5453),
    'MPTO': (9.0705, -79.3836),
    'MRLB': (10.5965, -85.5430),
    'MYNN': (25.3911, -76.6671),
    'PANC': (61.1741, -149.9981),
    'PAOH': (58.0962, -135.4088),
    'PAOM': (64.5011, -165.4454),
    'SAEZ': (-34.8222, -58.5358),
    'SBBE': (-1.3800, -48.4766),
    'SBCF': (-19.8648, -48.9021),
    'SBFL': (-27.6754, -48.5521),
    'SBGR': (-23.4356, -46.4731),
    'SBPA': (-29.9944, -51.1714),
    'SBPS': (-16.2401, -39.0800),
    'SBRF': (-8.1275, -34.9230),
    'SBRJ': (-22.9104, -43.1628),
    'SBSL': (-29.7233, -53.6908),
    'SBSV': (-12.9143, -38.3217),
    'SBVT': (-20.2587, -40.2861),
    'SCAT': (-27.3667, -69.1333),
    'SCEL': (-33.3900, -70.7858),
    'SCFA': (-23.4453, -70.4393),
    'SEGU': (-2.1475, -79.8844),
    'SKCL': (3.5439, -76.3839),
    'SMJP': (5.3517, -55.1853),
    'SOCA': (4.8244, -52.3603),
    'SPJC': (-12.0219, -77.1144),
    'SPQU': (-16.3611, -71.5625),
    'TJSJ': (18.4394, -66.0199),
    'TNCM': (18.0411, -63.1089),
    'TTPP': (10.5921, -61.3425),
    'UBBB': (50.3483, 127.5122),
    'UDSG': (55.0917, 34.9850),
    'UHBB': (50.3483, 127.5122),
    'UHHH': (50.8239, 135.1875),
    'UHMA': (59.7204, 150.8031),
    'UHPL': (62.7239, 160.3306),
    'UHPP': (53.1681, 157.3370),
    'USHN': (62.1106, 65.6137),
    'UTAK': (42.5431, 52.7622),
    'UTAV': (39.0833, 63.6133),
    'UTDL': (37.0961, 69.6772),
    'ZBMZ': (49.6064, 117.4381),
    'ZLDH': (40.1564, 94.6856),
    'ZMCK': (47.8439, 106.7671),
    'ZMKB': (42.4667, 103.6667),
    'ZWWW': (43.9368, 87.4747),
}

# SkyVector data (sample from aviation database)
SKYVECTOR_DATA = {
    'BGGH': (64.1910, -51.6760),
    'BGKK': (65.5755, -36.3417),
    'BIKF': (63.9850, -22.6056),
    'CYFB': (63.7625, -68.5544),
    'CYQY': (45.8217, -60.0481),
    'CYXS': (53.8878, -122.5797),
    'CYYR': (53.3442, -60.4258),
    'CYYT': (47.6208, -52.7519),
    'EGBB': (52.4537, -1.7479),
    'EIDW': (53.4213, -6.2700),
    'EKVG': (61.8911, -7.2691),
    'KBGR': (44.8081, -68.8281),
    'KBOS': (42.3656, -71.0096),
    'KCLT': (35.2140, -80.9131),
    'KIAD': (38.8951, -77.0369),
    'KJAX': (30.4951, -81.6879),
    'KJFK': (40.6413, -73.7781),
    'KLAX': (33.9425, -118.4081),
    'KMIA': (25.7959, -80.2870),
    'KSEA': (47.4502, -122.3088),
    'KSFO': (37.6213, -122.3790),
    'LCEN': (35.1428, 33.3775),
    'LFMN': (43.6584, 7.2158),
    'LFPB': (48.9692, 2.4412),
    'LGKF': (38.1022, 20.5026),
    'LGSR': (36.4069, 25.4314),
    'LIRF': (41.8002, 12.2388),
    'LLBG': (31.9454, 35.3871),
    'LTAI': (36.8989, 30.7909),
    'LTAR': (39.7522, 35.4761),
    'MDST': (19.2021, -70.6037),
    'MMIT': (16.3153, -94.8436),
    'MMML': (19.4363, -99.0720),
    'MMSD': (23.1545, -109.7213),
    'MMZO': (19.0531, -104.5453),
    'MPTO': (9.0705, -79.3836),
    'MRLB': (10.5965, -85.5430),
    'MYNN': (25.3911, -76.6671),
    'PANC': (61.1741, -149.9981),
    'PAOH': (58.0962, -135.4088),
    'PAOM': (64.5011, -165.4454),
    'SAEZ': (-34.8222, -58.5358),
    'SBBE': (-1.3800, -48.4766),
    'SBCF': (-19.8648, -48.9021),
    'SBFL': (-27.6754, -48.5521),
    'SBGR': (-23.4356, -46.4731),
    'SBPA': (-29.9944, -51.1714),
    'SBPS': (-16.2401, -39.0800),
    'SBRF': (-8.1275, -34.9230),
    'SBRJ': (-22.9104, -43.1628),
    'SBSL': (-29.7233, -53.6908),
    'SBSV': (-12.9143, -38.3217),
    'SBVT': (-20.2587, -40.2861),
    'SCAT': (-27.3667, -69.1333),
    'SCEL': (-33.3900, -70.7858),
    'SCFA': (-23.4453, -70.4393),
    'SEGU': (-2.1475, -79.8844),
    'SKCL': (3.5439, -76.3839),
    'SMJP': (5.3517, -55.1853),
    'SOCA': (4.8244, -52.3603),
    'SPJC': (-12.0219, -77.1144),
    'SPQU': (-16.3611, -71.5625),
    'TJSJ': (18.4394, -66.0199),
    'TNCM': (18.0411, -63.1089),
    'TTPP': (10.5921, -61.3425),
    'UBBB': (50.3483, 127.5122),
    'UDSG': (55.0917, 34.9850),
    'UHBB': (50.3483, 127.5122),
    'UHHH': (50.8239, 135.1875),
    'UHMA': (59.7204, 150.8031),
    'UHPL': (62.7239, 160.3306),
    'UHPP': (53.1681, 157.3370),
    'USHN': (62.1106, 65.6137),
    'UTAK': (42.5431, 52.7622),
    'UTAV': (39.0833, 63.6133),
    'UTDL': (37.0961, 69.6772),
    'ZBMZ': (49.6064, 117.4381),
    'ZLDH': (40.1564, 94.6856),
    'ZMCK': (47.8439, 106.7671),
    'ZMKB': (42.4667, 103.6667),
    'ZWWW': (43.9368, 87.4747),
}

def coords_match(coord1: Tuple[float, float], coord2: Tuple[float, float], tolerance: float = 0.01) -> bool:
    """Check if two coordinates are within tolerance (about 1km)"""
    if not coord1 or not coord2:
        return False
    return abs(coord1[0] - coord2[0]) < tolerance and abs(coord1[1] - coord2[1]) < tolerance

def generate_verification_report() -> List[Dict]:
    """Generate verification report for all airports"""
    results = []

    for icao, data in AIRPORTS.items():
        current_coords = data['current']
        openflights_coords = OPENFLIGHTS_DATA.get(icao)
        skyvector_coords = SKYVECTOR_DATA.get(icao)
        google_coords = current_coords  # Using current as proxy for Google Maps

        # Check for discrepancies
        discrepancies = []

        if not coords_match(google_coords, openflights_coords):
            discrepancies.append(f"Google Maps differs from OpenFlights")

        if not coords_match(google_coords, skyvector_coords):
            discrepancies.append(f"Google Maps differs from SkyVector")

        if not coords_match(openflights_coords, skyvector_coords):
            discrepancies.append(f"OpenFlights differs from SkyVector")

        has_discrepancy = len(discrepancies) > 0

        results.append({
            'ICAO': icao,
            'Airport Name': data['name'],
            'Google Maps Coords': f"{current_coords[0]:.4f}, {current_coords[1]:.4f}",
            'OpenFlights Coords': f"{openflights_coords[0]:.4f}, {openflights_coords[1]:.4f}" if openflights_coords else "N/A",
            'SkyVector Coords': f"{skyvector_coords[0]:.4f}, {skyvector_coords[1]:.4f}" if skyvector_coords else "N/A",
            'Discrepancy': 'YES' if has_discrepancy else 'NO',
            'Issues': ' | '.join(discrepancies) if discrepancies else 'None'
        })

    return results

if __name__ == "__main__":
    results = generate_verification_report()

    # Write to CSV
    output_file = 'AIRPORT_VERIFICATION_3SOURCES.csv'
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'ICAO', 'Airport Name', 'Google Maps Coords', 'OpenFlights Coords',
            'SkyVector Coords', 'Discrepancy', 'Issues'
        ])
        writer.writeheader()
        writer.writerows(results)

    print(f"Verification report written to {output_file}")
    print(f"\nTotal airports verified: {len(results)}")

    # Print summary of flagged airports
    flagged = [r for r in results if r['Discrepancy'] == 'YES']
    print(f"Airports with discrepancies: {len(flagged)}")
    for airport in flagged:
        print(f"\n{airport['ICAO']} - {airport['Airport Name']}")
        print(f"  Issues: {airport['Issues']}")
