// plugins/landmark-island/src/worker/main.ts
import { randomInt } from "node:crypto";

// plugins/landmark-island/src/timezone-cities.json
var timezone_cities_default = {
  version: "2026f",
  locations: {
    "Europe/Andorra": ["Andorra", 42.5, 1.516667],
    "Asia/Dubai": ["Dubai", 25.3, 55.3],
    "Asia/Kabul": ["Kabul", 34.516667, 69.2],
    "America/Antigua": ["Antigua", 17.05, -61.8],
    "America/Anguilla": ["Anguilla", 18.2, -63.066667],
    "Europe/Tirane": ["Tirane", 41.333333, 19.833333],
    "Asia/Yerevan": ["Yerevan", 40.183333, 44.5],
    "Africa/Luanda": ["Luanda", -8.8, 13.233333],
    "Antarctica/McMurdo": ["McMurdo", -77.833333, 166.6],
    "Antarctica/Casey": ["Casey", -66.283333, 110.516667],
    "Antarctica/Davis": ["Davis", -68.583333, 77.966667],
    "Antarctica/DumontDUrville": ["DumontDUrville", -66.666667, 140.016667],
    "Antarctica/Mawson": ["Mawson", -67.6, 62.883333],
    "Antarctica/Palmer": ["Palmer", -64.8, -64.1],
    "Antarctica/Rothera": ["Rothera", -67.566667, -68.133333],
    "Antarctica/Syowa": ["Syowa", -69.006111, 39.59],
    "Antarctica/Troll": ["Troll", -72.011389, 2.535],
    "Antarctica/Vostok": ["Vostok", -78.4, 106.9],
    "America/Argentina/Buenos_Aires": ["Buenos Aires", -34.6, -58.45],
    "America/Argentina/Cordoba": ["Cordoba", -31.4, -64.183333],
    "America/Argentina/Salta": ["Salta", -24.783333, -65.416667],
    "America/Argentina/Jujuy": ["Jujuy", -24.183333, -65.3],
    "America/Argentina/Tucuman": ["Tucuman", -26.816667, -65.216667],
    "America/Argentina/Catamarca": ["Catamarca", -28.466667, -65.783333],
    "America/Argentina/La_Rioja": ["La Rioja", -29.433333, -66.85],
    "America/Argentina/San_Juan": ["San Juan", -31.533333, -68.516667],
    "America/Argentina/Mendoza": ["Mendoza", -32.883333, -68.816667],
    "America/Argentina/San_Luis": ["San Luis", -33.316667, -66.35],
    "America/Argentina/Rio_Gallegos": ["Rio Gallegos", -51.633333, -69.216667],
    "America/Argentina/Ushuaia": ["Ushuaia", -54.8, -68.3],
    "Pacific/Pago_Pago": ["Pago Pago", -14.266667, -170.7],
    "Europe/Vienna": ["Vienna", 48.216667, 16.333333],
    "Australia/Lord_Howe": ["Lord Howe", -31.55, 159.083333],
    "Antarctica/Macquarie": ["Macquarie", -54.5, 158.95],
    "Australia/Hobart": ["Hobart", -42.883333, 147.316667],
    "Australia/Melbourne": ["Melbourne", -37.816667, 144.966667],
    "Australia/Sydney": ["Sydney", -33.866667, 151.216667],
    "Australia/Broken_Hill": ["Broken Hill", -31.95, 141.45],
    "Australia/Brisbane": ["Brisbane", -27.466667, 153.033333],
    "Australia/Lindeman": ["Lindeman", -20.266667, 149],
    "Australia/Adelaide": ["Adelaide", -34.916667, 138.583333],
    "Australia/Darwin": ["Darwin", -12.466667, 130.833333],
    "Australia/Perth": ["Perth", -31.95, 115.85],
    "Australia/Eucla": ["Eucla", -31.716667, 128.866667],
    "America/Aruba": ["Aruba", 12.5, -69.966667],
    "Europe/Mariehamn": ["Mariehamn", 60.1, 19.95],
    "Asia/Baku": ["Baku", 40.383333, 49.85],
    "Europe/Sarajevo": ["Sarajevo", 43.866667, 18.416667],
    "America/Barbados": ["Barbados", 13.1, -59.616667],
    "Asia/Dhaka": ["Dhaka", 23.716667, 90.416667],
    "Europe/Brussels": ["Brussels", 50.833333, 4.333333],
    "Africa/Ouagadougou": ["Ouagadougou", 12.366667, -1.516667],
    "Europe/Sofia": ["Sofia", 42.683333, 23.316667],
    "Asia/Bahrain": ["Bahrain", 26.383333, 50.583333],
    "Africa/Bujumbura": ["Bujumbura", -3.383333, 29.366667],
    "Africa/Porto-Novo": ["Porto-Novo", 6.483333, 2.616667],
    "America/St_Barthelemy": ["St Barthelemy", 17.883333, -62.85],
    "Atlantic/Bermuda": ["Bermuda", 32.283333, -64.766667],
    "Asia/Brunei": ["Brunei", 4.933333, 114.916667],
    "America/La_Paz": ["La Paz", -16.5, -68.15],
    "America/Kralendijk": ["Kralendijk", 12.150833, -68.276667],
    "America/Noronha": ["Noronha", -3.85, -32.416667],
    "America/Belem": ["Belem", -1.45, -48.483333],
    "America/Fortaleza": ["Fortaleza", -3.716667, -38.5],
    "America/Recife": ["Recife", -8.05, -34.9],
    "America/Araguaina": ["Araguaina", -7.2, -48.2],
    "America/Maceio": ["Maceio", -9.666667, -35.716667],
    "America/Bahia": ["Bahia", -12.983333, -38.516667],
    "America/Sao_Paulo": ["Sao Paulo", -23.533333, -46.616667],
    "America/Campo_Grande": ["Campo Grande", -20.45, -54.616667],
    "America/Cuiaba": ["Cuiaba", -15.583333, -56.083333],
    "America/Santarem": ["Santarem", -2.433333, -54.866667],
    "America/Porto_Velho": ["Porto Velho", -8.766667, -63.9],
    "America/Boa_Vista": ["Boa Vista", 2.816667, -60.666667],
    "America/Manaus": ["Manaus", -3.133333, -60.016667],
    "America/Eirunepe": ["Eirunepe", -6.666667, -69.866667],
    "America/Rio_Branco": ["Rio Branco", -9.966667, -67.8],
    "America/Nassau": ["Nassau", 25.083333, -77.35],
    "Asia/Thimphu": ["Thimphu", 27.466667, 89.65],
    "Africa/Gaborone": ["Gaborone", -24.65, 25.916667],
    "Europe/Minsk": ["Minsk", 53.9, 27.566667],
    "America/Belize": ["Belize", 17.5, -88.2],
    "America/St_Johns": ["St Johns", 47.566667, -52.716667],
    "America/Halifax": ["Halifax", 44.65, -63.6],
    "America/Glace_Bay": ["Glace Bay", 46.2, -59.95],
    "America/Moncton": ["Moncton", 46.1, -64.783333],
    "America/Goose_Bay": ["Goose Bay", 53.333333, -60.416667],
    "America/Blanc-Sablon": ["Blanc-Sablon", 51.416667, -57.116667],
    "America/Toronto": ["Toronto", 43.65, -79.383333],
    "America/Iqaluit": ["Iqaluit", 63.733333, -68.466667],
    "America/Atikokan": ["Atikokan", 48.758611, -91.621667],
    "America/Winnipeg": ["Winnipeg", 49.883333, -97.15],
    "America/Resolute": ["Resolute", 74.695556, -94.829167],
    "America/Rankin_Inlet": ["Rankin Inlet", 62.816667, -92.083056],
    "America/Regina": ["Regina", 50.4, -104.65],
    "America/Swift_Current": ["Swift Current", 50.283333, -107.833333],
    "America/Edmonton": ["Edmonton", 53.55, -113.466667],
    "America/Cambridge_Bay": ["Cambridge Bay", 69.113889, -105.052778],
    "America/Inuvik": ["Inuvik", 68.349722, -133.716667],
    "America/Vancouver": ["Vancouver", 49.266667, -123.116667],
    "America/Creston": ["Creston", 49.1, -116.516667],
    "America/Dawson_Creek": ["Dawson Creek", 55.766667, -120.233333],
    "America/Fort_Nelson": ["Fort Nelson", 58.8, -122.7],
    "America/Whitehorse": ["Whitehorse", 60.716667, -135.05],
    "America/Dawson": ["Dawson", 64.066667, -139.416667],
    "Indian/Cocos": ["Cocos", -12.166667, 96.916667],
    "Africa/Kinshasa": ["Kinshasa", -4.3, 15.3],
    "Africa/Lubumbashi": ["Lubumbashi", -11.666667, 27.466667],
    "Africa/Bangui": ["Bangui", 4.366667, 18.583333],
    "Africa/Brazzaville": ["Brazzaville", -4.266667, 15.283333],
    "Europe/Zurich": ["Zurich", 47.383333, 8.533333],
    "Africa/Abidjan": ["Abidjan", 5.316667, -4.033333],
    "Pacific/Rarotonga": ["Rarotonga", -21.233333, -159.766667],
    "America/Santiago": ["Santiago", -33.45, -70.666667],
    "America/Coyhaique": ["Coyhaique", -45.566667, -72.066667],
    "America/Punta_Arenas": ["Punta Arenas", -53.15, -70.916667],
    "Pacific/Easter": ["Easter", -27.15, -109.433333],
    "Africa/Douala": ["Douala", 4.05, 9.7],
    "Asia/Shanghai": ["Shanghai", 31.233333, 121.466667],
    "Asia/Urumqi": ["Urumqi", 43.8, 87.583333],
    "America/Bogota": ["Bogota", 4.6, -74.083333],
    "America/Costa_Rica": ["Costa Rica", 9.933333, -84.083333],
    "America/Havana": ["Havana", 23.133333, -82.366667],
    "Atlantic/Cape_Verde": ["Cape Verde", 14.916667, -23.516667],
    "America/Curacao": ["Curacao", 12.183333, -69],
    "Indian/Christmas": ["Christmas", -10.416667, 105.716667],
    "Asia/Nicosia": ["Nicosia", 35.166667, 33.366667],
    "Asia/Famagusta": ["Famagusta", 35.116667, 33.95],
    "Europe/Prague": ["Prague", 50.083333, 14.433333],
    "Europe/Berlin": ["Berlin", 52.5, 13.366667],
    "Europe/Busingen": ["Busingen", 47.7, 8.683333],
    "Africa/Djibouti": ["Djibouti", 11.6, 43.15],
    "Europe/Copenhagen": ["Copenhagen", 55.666667, 12.583333],
    "America/Dominica": ["Dominica", 15.3, -61.4],
    "America/Santo_Domingo": ["Santo Domingo", 18.466667, -69.9],
    "Africa/Algiers": ["Algiers", 36.783333, 3.05],
    "America/Guayaquil": ["Guayaquil", -2.166667, -79.833333],
    "Pacific/Galapagos": ["Galapagos", -0.9, -89.6],
    "Europe/Tallinn": ["Tallinn", 59.416667, 24.75],
    "Africa/Cairo": ["Cairo", 30.05, 31.25],
    "Africa/El_Aaiun": ["El Aaiun", 27.15, -13.2],
    "Africa/Asmara": ["Asmara", 15.333333, 38.883333],
    "Europe/Madrid": ["Madrid", 40.4, -3.683333],
    "Africa/Ceuta": ["Ceuta", 35.883333, -5.316667],
    "Atlantic/Canary": ["Canary", 28.1, -15.4],
    "Africa/Addis_Ababa": ["Addis Ababa", 9.033333, 38.7],
    "Europe/Helsinki": ["Helsinki", 60.166667, 24.966667],
    "Pacific/Fiji": ["Fiji", -18.133333, 178.416667],
    "Atlantic/Stanley": ["Stanley", -51.7, -57.85],
    "Pacific/Chuuk": ["Chuuk", 7.416667, 151.783333],
    "Pacific/Pohnpei": ["Pohnpei", 6.966667, 158.216667],
    "Pacific/Kosrae": ["Kosrae", 5.316667, 162.983333],
    "Atlantic/Faroe": ["Faroe", 62.016667, -6.766667],
    "Europe/Paris": ["Paris", 48.866667, 2.333333],
    "Africa/Libreville": ["Libreville", 0.383333, 9.45],
    "Europe/London": ["London", 51.508333, -0.125278],
    "America/Grenada": ["Grenada", 12.05, -61.75],
    "Asia/Tbilisi": ["Tbilisi", 41.716667, 44.816667],
    "America/Cayenne": ["Cayenne", 4.933333, -52.333333],
    "Europe/Guernsey": ["Guernsey", 49.454722, -2.536111],
    "Africa/Accra": ["Accra", 5.55, -0.216667],
    "Europe/Gibraltar": ["Gibraltar", 36.133333, -5.35],
    "America/Nuuk": ["Nuuk", 64.183333, -51.733333],
    "America/Danmarkshavn": ["Danmarkshavn", 76.766667, -18.666667],
    "America/Scoresbysund": ["Scoresbysund", 70.483333, -21.966667],
    "America/Thule": ["Thule", 76.566667, -68.783333],
    "Africa/Banjul": ["Banjul", 13.466667, -16.65],
    "Africa/Conakry": ["Conakry", 9.516667, -13.716667],
    "America/Guadeloupe": ["Guadeloupe", 16.233333, -61.533333],
    "Africa/Malabo": ["Malabo", 3.75, 8.783333],
    "Europe/Athens": ["Athens", 37.966667, 23.716667],
    "Atlantic/South_Georgia": ["South Georgia", -54.266667, -36.533333],
    "America/Guatemala": ["Guatemala", 14.633333, -90.516667],
    "Pacific/Guam": ["Guam", 13.466667, 144.75],
    "Africa/Bissau": ["Bissau", 11.85, -15.583333],
    "America/Guyana": ["Guyana", 6.8, -58.166667],
    "Asia/Hong_Kong": ["Hong Kong", 22.283333, 114.15],
    "America/Tegucigalpa": ["Tegucigalpa", 14.1, -87.216667],
    "Europe/Zagreb": ["Zagreb", 45.8, 15.966667],
    "America/Port-au-Prince": ["Port-au-Prince", 18.533333, -72.333333],
    "Europe/Budapest": ["Budapest", 47.5, 19.083333],
    "Asia/Jakarta": ["Jakarta", -6.166667, 106.8],
    "Asia/Pontianak": ["Pontianak", -0.033333, 109.333333],
    "Asia/Makassar": ["Makassar", -5.116667, 119.4],
    "Asia/Jayapura": ["Jayapura", -2.533333, 140.7],
    "Europe/Dublin": ["Dublin", 53.333333, -6.25],
    "Asia/Jerusalem": ["Jerusalem", 31.780556, 35.223889],
    "Europe/Isle_of_Man": ["Isle of Man", 54.15, -4.466667],
    "Asia/Kolkata": ["Kolkata", 22.533333, 88.366667],
    "Indian/Chagos": ["Chagos", -7.333333, 72.416667],
    "Asia/Baghdad": ["Baghdad", 33.35, 44.416667],
    "Asia/Tehran": ["Tehran", 35.666667, 51.433333],
    "Atlantic/Reykjavik": ["Reykjavik", 64.15, -21.85],
    "Europe/Rome": ["Rome", 41.9, 12.483333],
    "Europe/Jersey": ["Jersey", 49.183611, -2.106667],
    "America/Jamaica": ["Jamaica", 17.968056, -76.793333],
    "Asia/Amman": ["Amman", 31.95, 35.933333],
    "Asia/Tokyo": ["Tokyo", 35.654444, 139.744722],
    "Africa/Nairobi": ["Nairobi", -1.283333, 36.816667],
    "Asia/Bishkek": ["Bishkek", 42.9, 74.6],
    "Asia/Phnom_Penh": ["Phnom Penh", 11.55, 104.916667],
    "Pacific/Tarawa": ["Tarawa", 1.416667, 173],
    "Pacific/Kanton": ["Kanton", -2.783333, -171.716667],
    "Pacific/Kiritimati": ["Kiritimati", 1.866667, -157.333333],
    "Indian/Comoro": ["Comoro", -11.683333, 43.266667],
    "America/St_Kitts": ["St Kitts", 17.3, -62.716667],
    "Asia/Pyongyang": ["Pyongyang", 39.016667, 125.75],
    "Asia/Seoul": ["Seoul", 37.55, 126.966667],
    "Asia/Kuwait": ["Kuwait", 29.333333, 47.983333],
    "America/Cayman": ["Cayman", 19.3, -81.383333],
    "Asia/Almaty": ["Almaty", 43.25, 76.95],
    "Asia/Qyzylorda": ["Qyzylorda", 44.8, 65.466667],
    "Asia/Qostanay": ["Qostanay", 53.2, 63.616667],
    "Asia/Aqtobe": ["Aqtobe", 50.283333, 57.166667],
    "Asia/Aqtau": ["Aqtau", 44.516667, 50.266667],
    "Asia/Atyrau": ["Atyrau", 47.116667, 51.933333],
    "Asia/Oral": ["Oral", 51.216667, 51.35],
    "Asia/Vientiane": ["Vientiane", 17.966667, 102.6],
    "Asia/Beirut": ["Beirut", 33.883333, 35.5],
    "America/St_Lucia": ["St Lucia", 14.016667, -61],
    "Europe/Vaduz": ["Vaduz", 47.15, 9.516667],
    "Asia/Colombo": ["Colombo", 6.933333, 79.85],
    "Africa/Monrovia": ["Monrovia", 6.3, -10.783333],
    "Africa/Maseru": ["Maseru", -29.466667, 27.5],
    "Europe/Vilnius": ["Vilnius", 54.683333, 25.316667],
    "Europe/Luxembourg": ["Luxembourg", 49.6, 6.15],
    "Europe/Riga": ["Riga", 56.95, 24.1],
    "Africa/Tripoli": ["Tripoli", 32.9, 13.183333],
    "Africa/Casablanca": ["Casablanca", 33.65, -7.583333],
    "Europe/Monaco": ["Monaco", 43.7, 7.383333],
    "Europe/Chisinau": ["Chisinau", 47, 28.833333],
    "Europe/Podgorica": ["Podgorica", 42.433333, 19.266667],
    "America/Marigot": ["Marigot", 18.066667, -63.083333],
    "Indian/Antananarivo": ["Antananarivo", -18.916667, 47.516667],
    "Pacific/Majuro": ["Majuro", 7.15, 171.2],
    "Pacific/Kwajalein": ["Kwajalein", 9.083333, 167.333333],
    "Europe/Skopje": ["Skopje", 41.983333, 21.433333],
    "Africa/Bamako": ["Bamako", 12.65, -8],
    "Asia/Yangon": ["Yangon", 16.783333, 96.166667],
    "Asia/Ulaanbaatar": ["Ulaanbaatar", 47.916667, 106.883333],
    "Asia/Hovd": ["Hovd", 48.016667, 91.65],
    "Asia/Macau": ["Macau", 22.197222, 113.541667],
    "Pacific/Saipan": ["Saipan", 15.2, 145.75],
    "America/Martinique": ["Martinique", 14.6, -61.083333],
    "Africa/Nouakchott": ["Nouakchott", 18.1, -15.95],
    "America/Montserrat": ["Montserrat", 16.716667, -62.216667],
    "Europe/Malta": ["Malta", 35.9, 14.516667],
    "Indian/Mauritius": ["Mauritius", -20.166667, 57.5],
    "Indian/Maldives": ["Maldives", 4.166667, 73.5],
    "Africa/Blantyre": ["Blantyre", -15.783333, 35],
    "America/Mexico_City": ["Mexico City", 19.4, -99.15],
    "America/Cancun": ["Cancun", 21.083333, -86.766667],
    "America/Merida": ["Merida", 20.966667, -89.616667],
    "America/Monterrey": ["Monterrey", 25.666667, -100.316667],
    "America/Matamoros": ["Matamoros", 25.833333, -97.5],
    "America/Chihuahua": ["Chihuahua", 28.633333, -106.083333],
    "America/Ciudad_Juarez": ["Ciudad Juarez", 31.733333, -106.483333],
    "America/Ojinaga": ["Ojinaga", 29.566667, -104.416667],
    "America/Mazatlan": ["Mazatlan", 23.216667, -106.416667],
    "America/Bahia_Banderas": ["Bahia Banderas", 20.8, -105.25],
    "America/Hermosillo": ["Hermosillo", 29.066667, -110.966667],
    "America/Tijuana": ["Tijuana", 32.533333, -117.016667],
    "Asia/Kuala_Lumpur": ["Kuala Lumpur", 3.166667, 101.7],
    "Asia/Kuching": ["Kuching", 1.55, 110.333333],
    "Africa/Maputo": ["Maputo", -25.966667, 32.583333],
    "Africa/Windhoek": ["Windhoek", -22.566667, 17.1],
    "Pacific/Noumea": ["Noumea", -22.266667, 166.45],
    "Africa/Niamey": ["Niamey", 13.516667, 2.116667],
    "Pacific/Norfolk": ["Norfolk", -29.05, 167.966667],
    "Africa/Lagos": ["Lagos", 6.45, 3.4],
    "America/Managua": ["Managua", 12.15, -86.283333],
    "Europe/Amsterdam": ["Amsterdam", 52.366667, 4.9],
    "Europe/Oslo": ["Oslo", 59.916667, 10.75],
    "Asia/Kathmandu": ["Kathmandu", 27.716667, 85.316667],
    "Pacific/Nauru": ["Nauru", -0.516667, 166.916667],
    "Pacific/Niue": ["Niue", -19.016667, -169.916667],
    "Pacific/Auckland": ["Auckland", -36.866667, 174.766667],
    "Pacific/Chatham": ["Chatham", -43.95, -176.55],
    "Asia/Muscat": ["Muscat", 23.6, 58.583333],
    "America/Panama": ["Panama", 8.966667, -79.533333],
    "America/Lima": ["Lima", -12.05, -77.05],
    "Pacific/Tahiti": ["Tahiti", -17.533333, -149.566667],
    "Pacific/Marquesas": ["Marquesas", -9, -139.5],
    "Pacific/Gambier": ["Gambier", -23.133333, -134.95],
    "Pacific/Port_Moresby": ["Port Moresby", -9.5, 147.166667],
    "Pacific/Bougainville": ["Bougainville", -6.216667, 155.566667],
    "Asia/Manila": ["Manila", 14.586667, 120.967778],
    "Asia/Karachi": ["Karachi", 24.866667, 67.05],
    "Europe/Warsaw": ["Warsaw", 52.25, 21],
    "America/Miquelon": ["Miquelon", 47.05, -56.333333],
    "Pacific/Pitcairn": ["Pitcairn", -25.066667, -130.083333],
    "America/Puerto_Rico": ["Puerto Rico", 18.468333, -66.106111],
    "Asia/Gaza": ["Gaza", 31.5, 34.466667],
    "Asia/Hebron": ["Hebron", 31.533333, 35.095],
    "Europe/Lisbon": ["Lisbon", 38.716667, -9.133333],
    "Atlantic/Madeira": ["Madeira", 32.633333, -16.9],
    "Atlantic/Azores": ["Azores", 37.733333, -25.666667],
    "Pacific/Palau": ["Palau", 7.333333, 134.483333],
    "America/Asuncion": ["Asuncion", -25.266667, -57.666667],
    "Asia/Qatar": ["Qatar", 25.283333, 51.533333],
    "Indian/Reunion": ["Reunion", -20.866667, 55.466667],
    "Europe/Bucharest": ["Bucharest", 44.433333, 26.1],
    "Europe/Belgrade": ["Belgrade", 44.833333, 20.5],
    "Europe/Kaliningrad": ["Kaliningrad", 54.716667, 20.5],
    "Europe/Moscow": ["Moscow", 55.755833, 37.617778],
    "Europe/Simferopol": ["Simferopol", 44.95, 34.1],
    "Europe/Kirov": ["Kirov", 58.6, 49.65],
    "Europe/Volgograd": ["Volgograd", 48.733333, 44.416667],
    "Europe/Astrakhan": ["Astrakhan", 46.35, 48.05],
    "Europe/Saratov": ["Saratov", 51.566667, 46.033333],
    "Europe/Ulyanovsk": ["Ulyanovsk", 54.333333, 48.4],
    "Europe/Samara": ["Samara", 53.2, 50.15],
    "Asia/Yekaterinburg": ["Yekaterinburg", 56.85, 60.6],
    "Asia/Omsk": ["Omsk", 55, 73.4],
    "Asia/Novosibirsk": ["Novosibirsk", 55.033333, 82.916667],
    "Asia/Barnaul": ["Barnaul", 53.366667, 83.75],
    "Asia/Tomsk": ["Tomsk", 56.5, 84.966667],
    "Asia/Novokuznetsk": ["Novokuznetsk", 53.75, 87.116667],
    "Asia/Krasnoyarsk": ["Krasnoyarsk", 56.016667, 92.833333],
    "Asia/Irkutsk": ["Irkutsk", 52.266667, 104.333333],
    "Asia/Chita": ["Chita", 52.05, 113.466667],
    "Asia/Yakutsk": ["Yakutsk", 62, 129.666667],
    "Asia/Khandyga": ["Khandyga", 62.656389, 135.553889],
    "Asia/Vladivostok": ["Vladivostok", 43.166667, 131.933333],
    "Asia/Ust-Nera": ["Ust-Nera", 64.560278, 143.226667],
    "Asia/Magadan": ["Magadan", 59.566667, 150.8],
    "Asia/Sakhalin": ["Sakhalin", 46.966667, 142.7],
    "Asia/Srednekolymsk": ["Srednekolymsk", 67.466667, 153.716667],
    "Asia/Kamchatka": ["Kamchatka", 53.016667, 158.65],
    "Asia/Anadyr": ["Anadyr", 64.75, 177.483333],
    "Africa/Kigali": ["Kigali", -1.95, 30.066667],
    "Asia/Riyadh": ["Riyadh", 24.633333, 46.716667],
    "Pacific/Guadalcanal": ["Guadalcanal", -9.533333, 160.2],
    "Indian/Mahe": ["Mahe", -4.666667, 55.466667],
    "Africa/Khartoum": ["Khartoum", 15.6, 32.533333],
    "Europe/Stockholm": ["Stockholm", 59.333333, 18.05],
    "Asia/Singapore": ["Singapore", 1.283333, 103.85],
    "Atlantic/St_Helena": ["St Helena", -15.916667, -5.7],
    "Europe/Ljubljana": ["Ljubljana", 46.05, 14.516667],
    "Arctic/Longyearbyen": ["Longyearbyen", 78, 16],
    "Europe/Bratislava": ["Bratislava", 48.15, 17.116667],
    "Africa/Freetown": ["Freetown", 8.5, -13.25],
    "Europe/San_Marino": ["San Marino", 43.916667, 12.466667],
    "Africa/Dakar": ["Dakar", 14.666667, -17.433333],
    "Africa/Mogadishu": ["Mogadishu", 2.066667, 45.366667],
    "America/Paramaribo": ["Paramaribo", 5.833333, -55.166667],
    "Africa/Juba": ["Juba", 4.85, 31.616667],
    "Africa/Sao_Tome": ["Sao Tome", 0.333333, 6.733333],
    "America/El_Salvador": ["El Salvador", 13.7, -89.2],
    "America/Lower_Princes": ["Lower Princes", 18.051389, -63.047222],
    "Asia/Damascus": ["Damascus", 33.5, 36.3],
    "Africa/Mbabane": ["Mbabane", -26.3, 31.1],
    "America/Grand_Turk": ["Grand Turk", 21.466667, -71.133333],
    "Africa/Ndjamena": ["Ndjamena", 12.116667, 15.05],
    "Indian/Kerguelen": ["Kerguelen", -49.352778, 70.2175],
    "Africa/Lome": ["Lome", 6.133333, 1.216667],
    "Asia/Bangkok": ["Bangkok", 13.75, 100.516667],
    "Asia/Dushanbe": ["Dushanbe", 38.583333, 68.8],
    "Pacific/Fakaofo": ["Fakaofo", -9.366667, -171.233333],
    "Asia/Dili": ["Dili", -8.55, 125.583333],
    "Asia/Ashgabat": ["Ashgabat", 37.95, 58.383333],
    "Africa/Tunis": ["Tunis", 36.8, 10.183333],
    "Pacific/Tongatapu": ["Tongatapu", -21.133333, -175.2],
    "Europe/Istanbul": ["Istanbul", 41.016667, 28.966667],
    "America/Port_of_Spain": ["Port of Spain", 10.65, -61.516667],
    "Pacific/Funafuti": ["Funafuti", -8.516667, 179.216667],
    "Asia/Taipei": ["Taipei", 25.05, 121.5],
    "Africa/Dar_es_Salaam": ["Dar es Salaam", -6.8, 39.283333],
    "Europe/Kyiv": ["Kyiv", 50.433333, 30.516667],
    "Africa/Kampala": ["Kampala", 0.316667, 32.416667],
    "Pacific/Midway": ["Midway", 28.216667, -177.366667],
    "Pacific/Wake": ["Wake", 19.283333, 166.616667],
    "America/New_York": ["New York", 40.714167, -74.006389],
    "America/Detroit": ["Detroit", 42.331389, -83.045833],
    "America/Kentucky/Louisville": ["Louisville", 38.254167, -85.759444],
    "America/Kentucky/Monticello": ["Monticello", 36.829722, -84.849167],
    "America/Indiana/Indianapolis": ["Indianapolis", 39.768333, -86.158056],
    "America/Indiana/Vincennes": ["Vincennes", 38.677222, -87.528611],
    "America/Indiana/Winamac": ["Winamac", 41.051389, -86.603056],
    "America/Indiana/Marengo": ["Marengo", 38.375556, -86.344722],
    "America/Indiana/Petersburg": ["Petersburg", 38.491944, -87.278611],
    "America/Indiana/Vevay": ["Vevay", 38.747778, -85.067222],
    "America/Chicago": ["Chicago", 41.85, -87.65],
    "America/Indiana/Tell_City": ["Tell City", 37.953056, -86.761389],
    "America/Indiana/Knox": ["Knox", 41.295833, -86.625],
    "America/Menominee": ["Menominee", 45.107778, -87.614167],
    "America/North_Dakota/Center": ["Center", 47.116389, -101.299167],
    "America/North_Dakota/New_Salem": ["New Salem", 46.845, -101.410833],
    "America/North_Dakota/Beulah": ["Beulah", 47.264167, -101.777778],
    "America/Denver": ["Denver", 39.739167, -104.984167],
    "America/Boise": ["Boise", 43.613611, -116.2025],
    "America/Phoenix": ["Phoenix", 33.448333, -112.073333],
    "America/Los_Angeles": ["Los Angeles", 34.052222, -118.242778],
    "America/Anchorage": ["Anchorage", 61.218056, -149.900278],
    "America/Juneau": ["Juneau", 58.301944, -134.419722],
    "America/Sitka": ["Sitka", 57.176389, -135.301944],
    "America/Metlakatla": ["Metlakatla", 55.126944, -131.576389],
    "America/Yakutat": ["Yakutat", 59.546944, -139.727222],
    "America/Nome": ["Nome", 64.501111, -165.406389],
    "America/Adak": ["Adak", 51.88, -176.658056],
    "Pacific/Honolulu": ["Honolulu", 21.306944, -157.858333],
    "America/Montevideo": ["Montevideo", -34.909167, -56.2125],
    "Asia/Samarkand": ["Samarkand", 39.666667, 66.8],
    "Asia/Tashkent": ["Tashkent", 41.333333, 69.3],
    "Europe/Vatican": ["Vatican", 41.902222, 12.453056],
    "America/St_Vincent": ["St Vincent", 13.15, -61.233333],
    "America/Caracas": ["Caracas", 10.5, -66.933333],
    "America/Tortola": ["Tortola", 18.45, -64.616667],
    "America/St_Thomas": ["St Thomas", 18.35, -64.933333],
    "Asia/Ho_Chi_Minh": ["Ho Chi Minh", 10.75, 106.666667],
    "Pacific/Efate": ["Efate", -17.666667, 168.416667],
    "Pacific/Wallis": ["Wallis", -13.3, -176.166667],
    "Pacific/Apia": ["Apia", -13.833333, -171.733333],
    "Asia/Aden": ["Aden", 12.75, 45.2],
    "Indian/Mayotte": ["Mayotte", -12.783333, 45.233333],
    "Africa/Johannesburg": ["Johannesburg", -26.25, 28],
    "Africa/Lusaka": ["Lusaka", -15.416667, 28.283333],
    "Africa/Harare": ["Harare", -17.833333, 31.05]
  },
  aliases: {
    "Australia/ACT": "Australia/Sydney",
    "Australia/LHI": "Australia/Lord_Howe",
    "Australia/NSW": "Australia/Sydney",
    "Australia/North": "Australia/Darwin",
    "Australia/Queensland": "Australia/Brisbane",
    "Australia/South": "Australia/Adelaide",
    "Australia/Tasmania": "Australia/Hobart",
    "Australia/Victoria": "Australia/Melbourne",
    "Australia/West": "Australia/Perth",
    "Australia/Yancowinna": "Australia/Broken_Hill",
    "Brazil/Acre": "America/Rio_Branco",
    "Brazil/DeNoronha": "America/Noronha",
    "Brazil/East": "America/Sao_Paulo",
    "Brazil/West": "America/Manaus",
    CET: "Europe/Brussels",
    "Canada/Atlantic": "America/Halifax",
    "Canada/Central": "America/Winnipeg",
    "Canada/Eastern": "America/Toronto",
    "Canada/Mountain": "America/Edmonton",
    "Canada/Newfoundland": "America/St_Johns",
    "Canada/Pacific": "America/Vancouver",
    "Canada/Saskatchewan": "America/Regina",
    "Canada/Yukon": "America/Whitehorse",
    "Chile/Continental": "America/Santiago",
    "Chile/EasterIsland": "Pacific/Easter",
    Cuba: "America/Havana",
    EET: "Europe/Athens",
    EST: "America/Panama",
    Egypt: "Africa/Cairo",
    Eire: "Europe/Dublin",
    GB: "Europe/London",
    "GB-Eire": "Europe/London",
    Hongkong: "Asia/Hong_Kong",
    Iceland: "Africa/Abidjan",
    Iran: "Asia/Tehran",
    Israel: "Asia/Jerusalem",
    Jamaica: "America/Jamaica",
    Japan: "Asia/Tokyo",
    Kwajalein: "Pacific/Kwajalein",
    Libya: "Africa/Tripoli",
    MET: "Europe/Brussels",
    MST: "America/Phoenix",
    "Mexico/BajaNorte": "America/Tijuana",
    "Mexico/BajaSur": "America/Mazatlan",
    "Mexico/General": "America/Mexico_City",
    NZ: "Pacific/Auckland",
    "NZ-CHAT": "Pacific/Chatham",
    Navajo: "America/Denver",
    PRC: "Asia/Shanghai",
    Poland: "Europe/Warsaw",
    Portugal: "Europe/Lisbon",
    ROC: "Asia/Taipei",
    ROK: "Asia/Seoul",
    Singapore: "Asia/Singapore",
    Turkey: "Europe/Istanbul",
    "US/Alaska": "America/Anchorage",
    "US/Aleutian": "America/Adak",
    "US/Arizona": "America/Phoenix",
    "US/Central": "America/Chicago",
    "US/East-Indiana": "America/Indiana/Indianapolis",
    "US/Eastern": "America/New_York",
    "US/Hawaii": "Pacific/Honolulu",
    "US/Indiana-Starke": "America/Indiana/Knox",
    "US/Michigan": "America/Detroit",
    "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles",
    "US/Samoa": "Pacific/Pago_Pago",
    "W-SU": "Europe/Moscow",
    "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
    "America/Catamarca": "America/Argentina/Catamarca",
    "America/Cordoba": "America/Argentina/Cordoba",
    "America/Indianapolis": "America/Indiana/Indianapolis",
    "America/Jujuy": "America/Argentina/Jujuy",
    "America/Knox_IN": "America/Indiana/Knox",
    "America/Louisville": "America/Kentucky/Louisville",
    "America/Mendoza": "America/Argentina/Mendoza",
    "America/Virgin": "America/Puerto_Rico",
    "Pacific/Samoa": "Pacific/Pago_Pago",
    "Africa/Timbuktu": "Africa/Abidjan",
    "America/Argentina/ComodRivadavia": "America/Argentina/Catamarca",
    "America/Atka": "America/Adak",
    "America/Coral_Harbour": "America/Panama",
    "America/Ensenada": "America/Tijuana",
    "America/Fort_Wayne": "America/Indiana/Indianapolis",
    "America/Montreal": "America/Toronto",
    "America/Nipigon": "America/Toronto",
    "America/Pangnirtung": "America/Iqaluit",
    "America/Porto_Acre": "America/Rio_Branco",
    "America/Rainy_River": "America/Winnipeg",
    "America/Rosario": "America/Argentina/Cordoba",
    "America/Santa_Isabel": "America/Tijuana",
    "America/Shiprock": "America/Denver",
    "America/Thunder_Bay": "America/Toronto",
    "America/Yellowknife": "America/Edmonton",
    "Antarctica/South_Pole": "Pacific/Auckland",
    "Asia/Choibalsan": "Asia/Ulaanbaatar",
    "Asia/Chongqing": "Asia/Shanghai",
    "Asia/Harbin": "Asia/Shanghai",
    "Asia/Kashgar": "Asia/Urumqi",
    "Asia/Tel_Aviv": "Asia/Jerusalem",
    "Atlantic/Jan_Mayen": "Europe/Berlin",
    "Australia/Canberra": "Australia/Sydney",
    "Australia/Currie": "Australia/Hobart",
    "Europe/Belfast": "Europe/London",
    "Europe/Tiraspol": "Europe/Chisinau",
    "Europe/Uzhgorod": "Europe/Kyiv",
    "Europe/Zaporozhye": "Europe/Kyiv",
    "Pacific/Enderbury": "Pacific/Kanton",
    "Pacific/Johnston": "Pacific/Honolulu",
    "Pacific/Yap": "Pacific/Port_Moresby",
    WET: "Europe/Lisbon",
    "Africa/Asmera": "Africa/Nairobi",
    "America/Godthab": "America/Nuuk",
    "Asia/Ashkhabad": "Asia/Ashgabat",
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Chungking": "Asia/Shanghai",
    "Asia/Dacca": "Asia/Dhaka",
    "Asia/Istanbul": "Europe/Istanbul",
    "Asia/Katmandu": "Asia/Kathmandu",
    "Asia/Macao": "Asia/Macau",
    "Asia/Rangoon": "Asia/Yangon",
    "Asia/Saigon": "Asia/Ho_Chi_Minh",
    "Asia/Thimbu": "Asia/Thimphu",
    "Asia/Ujung_Pandang": "Asia/Makassar",
    "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
    "Atlantic/Faeroe": "Atlantic/Faroe",
    "Europe/Kiev": "Europe/Kyiv",
    "Europe/Nicosia": "Asia/Nicosia",
    HST: "Pacific/Honolulu",
    "Pacific/Ponape": "Pacific/Guadalcanal",
    "Pacific/Truk": "Pacific/Port_Moresby"
  }
};

// plugins/landmark-island/src/weather.ts
var WEATHER_HOUR = 60 * 60 * 1e3;
function timezoneLocation(timezone) {
  if (typeof timezone !== "string" || timezone.length > 100) return null;
  const locations = timezone_cities_default.locations;
  const aliases = timezone_cities_default.aliases;
  const zone = Object.hasOwn(locations, timezone) ? timezone : Object.hasOwn(aliases, timezone) ? aliases[timezone] : "";
  if (!Object.hasOwn(locations, zone)) return null;
  const [city, latitude, longitude] = locations[zone];
  if (typeof city !== "string" || typeof latitude !== "number" || typeof longitude !== "number" || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180)
    return null;
  return { zone, city, latitude, longitude };
}
function weatherKind(code) {
  if (code === 0 || code === 1) return 0;
  if ([2, 3, 45, 48].includes(code)) return 1;
  if ([
    51,
    53,
    55,
    56,
    57,
    61,
    63,
    65,
    66,
    67,
    80,
    81,
    82,
    95,
    96,
    97,
    99
  ].includes(code))
    return 2;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 3;
  return null;
}
function validWeather(value) {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 3;
}

// plugins/landmark-island/src/worker/weather.ts
async function fetchWeather(location) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "weather_code",
    forecast_days: "1",
    timeformat: "unixtime"
  }).toString();
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8e3),
    redirect: "error",
    headers: { Accept: "application/json" }
  });
  if (!response.ok || !response.body) throw new Error("Weather unavailable");
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 32768) throw new Error("Weather response too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {
    });
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const data = JSON.parse(new TextDecoder().decode(bytes));
  const weather = weatherKind(data?.current?.weather_code);
  if (data?.error || weather === null)
    throw new Error("Invalid weather response");
  return weather;
}
function validCache(value) {
  if (!value || typeof value !== "object") return false;
  const c = value;
  return Number.isFinite(c.attemptedAt) && c.attemptedAt >= 0 && typeof c.failed === "boolean" && (c.weather === null && c.updatedAt === null && c.failed || validWeather(c.weather) && Number.isFinite(c.updatedAt) && Number(c.updatedAt) >= 0 && Number(c.updatedAt) <= c.attemptedAt);
}
var WeatherService = class {
  constructor(store, fetcher = fetchWeather, now = Date.now) {
    this.store = store;
    this.fetcher = fetcher;
    this.now = now;
  }
  store;
  fetcher;
  now;
  memory = /* @__PURE__ */ new Map();
  pending = /* @__PURE__ */ new Map();
  async read(input) {
    const timezone = input?.timezone;
    if (typeof timezone !== "string" || timezone.length > 100)
      throw new Error("Invalid timezone");
    const location = timezoneLocation(timezone);
    if (!location)
      return {
        timezone,
        weather: null,
        updatedAt: null,
        status: "unsupported",
        nextCheckAt: this.now() + WEATHER_HOUR
      };
    const key = `weather-v1:${location.zone}`;
    let task = this.pending.get(key);
    if (!task) {
      task = this.load(key, location);
      this.pending.set(key, task);
    }
    let c;
    try {
      c = await task;
    } finally {
      if (this.pending.get(key) === task) this.pending.delete(key);
    }
    return {
      timezone,
      weather: c.weather,
      updatedAt: c.updatedAt,
      nextCheckAt: c.attemptedAt + WEATHER_HOUR,
      status: c.weather === null ? "unavailable" : c.failed ? "stale" : "fresh"
    };
  }
  async load(key, location) {
    let c = this.memory.get(key);
    if (!c) {
      try {
        const stored = await this.store.read(key);
        if (validCache(stored)) c = stored;
      } catch {
      }
    }
    const now = this.now();
    if (c && now >= c.attemptedAt && now - c.attemptedAt < WEATHER_HOUR) {
      this.memory.set(key, c);
      return c;
    }
    try {
      const weather = await this.fetcher(location);
      if (!validWeather(weather)) throw new Error("Invalid weather");
      const updatedAt = this.now();
      c = { weather, updatedAt, attemptedAt: updatedAt, failed: false };
    } catch {
      c = {
        weather: c?.weather ?? null,
        updatedAt: c?.updatedAt ?? null,
        attemptedAt: this.now(),
        failed: true
      };
      if (c.updatedAt !== null && c.updatedAt > c.attemptedAt)
        c = { ...c, weather: null, updatedAt: null };
    }
    this.memory.set(key, c);
    try {
      await this.store.write(key, c);
    } catch {
    }
    return c;
  }
};

// plugins/landmark-island/src/worker/expeditions.ts
import { createHash } from "node:crypto";

// plugins/landmark-island/src/expeditions.ts
var EXPEDITION_LIMIT = 24;
var states = /* @__PURE__ */ new Set(["working", "waiting", "blocked", "done"]);
var outcomes = /* @__PURE__ */ new Set([
  "success",
  "failure",
  "cancellation",
  "superseded",
  "interruption",
  "unconfirmed"
]);
function readExpeditions(value) {
  if (!Array.isArray(value)) return [];
  const seen = /* @__PURE__ */ new Set();
  return value.slice(0, EXPEDITION_LIMIT).filter((item) => {
    if (!item || typeof item !== "object") return false;
    const e = item;
    if (typeof e.id !== "string" || !/^[a-zA-Z0-9-]{1,64}$/.test(e.id) || seen.has(e.id) || typeof e.run !== "string" || e.run !== `${e.id}:${e.startedAt}` || !states.has(e.state) || !Number.isSafeInteger(e.startedAt) || e.startedAt < 0 || !Number.isSafeInteger(e.updatedAt) || e.updatedAt < e.startedAt || !outcomes.has(e.outcome) || typeof e.pending !== "boolean" || typeof e.welcomed !== "boolean" || e.pending && (e.state !== "done" || e.welcomed || !["success", "unconfirmed"].includes(e.outcome)))
      return false;
    seen.add(e.id);
    return true;
  }).slice(0, EXPEDITION_LIMIT).map((e) => ({
    id: e.id,
    name: typeof e.name === "string" ? e.name.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 60) : "",
    run: e.run,
    state: e.state,
    startedAt: e.startedAt,
    updatedAt: e.updatedAt,
    outcome: e.outcome,
    pending: e.pending,
    welcomed: e.welcomed
  }));
}
function observeExpedition(records, id, state, at2, outcome = "unconfirmed", name = "") {
  const prior = records.find((e) => e.id === id);
  if (prior && at2 <= prior.updatedAt) return records;
  if (!prior && state !== "working") return records;
  const newRun = !prior || prior.state === "done" && state === "working";
  const startedAt = newRun ? at2 : prior.startedAt;
  const resolved = outcomes.has(outcome) ? outcome : "unconfirmed";
  const next = {
    id,
    name: name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 60) || prior?.name || "",
    run: `${id}:${startedAt}`,
    state,
    startedAt,
    updatedAt: at2,
    outcome: state === "done" ? resolved : "unconfirmed",
    pending: state === "done" && ["success", "unconfirmed"].includes(resolved) && !(!newRun && prior?.welcomed),
    welcomed: !newRun && Boolean(prior?.welcomed)
  };
  return [next, ...records.filter((e) => e.id !== id)].slice(
    0,
    EXPEDITION_LIMIT
  );
}

// plugins/landmark-island/src/worker/expeditions.ts
var ExpeditionLog = class {
  constructor(storage) {
    this.storage = storage;
  }
  storage;
  queue = Promise.resolve();
  serial(operation) {
    const next = this.queue.then(operation, operation);
    this.queue = next.catch(() => {
    });
    return next;
  }
  /** 패널을 열었을 때만 별도 생활 기록을 읽는다. */
  read() {
    return this.serial(async () => readExpeditions(await this.storage.read()));
  }
  /** 프롬프트나 터미널 출력 없이 상태 이벤트만 받아들인다. */
  observe(input) {
    return this.serial(async () => {
      if (!input || typeof input !== "object") return false;
      const event = input;
      if (typeof event.workspaceId !== "string" || !event.workspaceId || event.workspaceId.length > 4096 || typeof event.paneKey !== "string" || !event.paneKey || event.paneKey.length > 1024 || !Number.isSafeInteger(event.receivedAt) || Number(event.receivedAt) < 0 || Number(event.receivedAt) > Date.now() + 3e5)
        return false;
      const main = event.mainAgent && typeof event.mainAgent === "object" ? event.mainAgent : void 0;
      const state = main?.state ?? event.state;
      if (!["working", "blocked", "waiting", "done"].includes(String(state)))
        return false;
      const id = createHash("sha256").update(JSON.stringify([event.workspaceId, event.paneKey])).digest("hex").slice(0, 32);
      const records = readExpeditions(await this.storage.read());
      const next = observeExpedition(
        records,
        id,
        state,
        Number(event.receivedAt),
        typeof main?.outcome === "string" ? main.outcome : void 0,
        typeof event.title === "string" ? event.title : ""
      );
      if (next === records) return false;
      await this.storage.write(next);
      return true;
    });
  }
  /** 현재 귀환 후보를 확인한 클릭만 한 번 기록한다. */
  welcome(input) {
    return this.serial(async () => {
      const run = input?.run;
      const records = readExpeditions(await this.storage.read());
      const candidate = records.find(
        (e) => e.run === run && (e.pending || e.welcomed)
      );
      if (!candidate)
        throw new Error("This expedition is no longer waiting to be welcomed.");
      if (candidate.welcomed) return records;
      const next = records.map(
        (e) => e === candidate ? { ...e, pending: false, welcomed: true } : e
      );
      await this.storage.write(next);
      return next;
    });
  }
};

// plugins/landmark-island/src/landmarks.json
var landmarks_default = [
  {
    id: "eiffel",
    name: "Eiffel Tower",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 48.858296,
    lon: 2.294479,
    source: "https://www.wikidata.org/wiki/Q243",
    region: "Paris",
    description: "Built for the 1889 Paris World\u2019s Fair, this iron tower grew from an ambitious engineering project into a symbol of France. Its open lattice structure was assembled from more than 18,000 metal parts.",
    descriptionSourceName: "Eiffel Tower official site",
    descriptionSource: "https://www.toureiffel.paris/en/the-monument/history"
  },
  {
    id: "colosseum",
    name: "Colosseum",
    country: "Italy",
    code: "ITA",
    tier: "epic",
    lat: 41.890277777778,
    lon: 12.492222222222,
    source: "https://www.wikidata.org/wiki/Q10285",
    region: "Rome",
    description: "The Flavian emperors built this vast amphitheatre in the first century CE. Crowds gathered here for gladiator contests and animal hunts, making it a major venue for public spectacles in ancient Rome.",
    descriptionSourceName: "Rome official tourism",
    descriptionSource: "https://www.turismoroma.it/en/places/parco-archeologico-del-colosseo"
  },
  {
    id: "stonehenge",
    name: "Stonehenge",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 51.17888888888889,
    lon: -1.826111111111111,
    source: "https://www.wikidata.org/wiki/Q39671",
    region: "Wiltshire, England",
    description: "Raised in prehistoric times, these enormous stones form a circle in the Wiltshire landscape. Together with nearby ancient sites, they offer clues to the beliefs and astronomical knowledge of the people who built them.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/373/"
  },
  {
    id: "liberty",
    name: "Statue of Liberty",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 40.689209166667,
    lon: -74.044425277778,
    source: "https://www.wikidata.org/wiki/Q9202",
    region: "New York Harbor",
    description: "France gave this monument to the United States, and it was dedicated in 1886. Standing at the entrance to New York Harbor, it became a symbol of liberty and a familiar sight for arriving immigrants.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/307/"
  },
  {
    id: "opera",
    name: "Sydney Opera House",
    country: "Australia",
    code: "AUS",
    tier: "rare",
    lat: -33.857058,
    lon: 151.214897,
    source: "https://www.wikidata.org/wiki/Q45178",
    region: "Sydney",
    description: "Opened in 1973, this performing arts landmark was designed by Danish architect J\xF8rn Utzon. Its overlapping shell-shaped roofs turn the edge of Sydney Harbour into a striking architectural silhouette.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/166/"
  },
  {
    id: "fuji",
    name: "Mount Fuji",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 35.36055555555556,
    lon: 138.7275,
    source: "https://www.wikidata.org/wiki/Q39231",
    region: "Honshu",
    description: "This 3,776-metre volcano has inspired pilgrims, poets and artists for centuries. Its often snow-covered summit appears in celebrated Japanese woodblock prints, while shrines and pilgrimage routes connect the mountain to living traditions.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1418/"
  },
  {
    id: "taj",
    name: "Taj Mahal",
    country: "India",
    code: "IND",
    tier: "epic",
    lat: 27.175,
    lon: 78.04194444444444,
    source: "https://www.wikidata.org/wiki/Q9141",
    region: "Agra",
    description: "Emperor Shah Jahan commissioned this white-marble mausoleum in the seventeenth century in memory of Mumtaz Mahal. Its carefully balanced buildings and gardens stand beside the Yamuna River and reflect the craft of Mughal architecture.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/252/"
  },
  {
    id: "petra",
    name: "Petra",
    country: "Jordan",
    code: "JOR",
    tier: "legendary",
    lat: 30.328888888889,
    lon: 35.440277777778,
    source: "https://www.wikidata.org/wiki/Q5788",
    region: "Southern Jordan",
    description: "The Nabataeans made Petra a crossroads for caravan trade. Buildings carved into rock sit among mountains and narrow gorges, combining local traditions with architectural influences from the Hellenistic world.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/326/"
  },
  {
    id: "chichen",
    name: "Chich\xE9n Itz\xE1",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 20.683055555556,
    lon: -88.568611111111,
    source: "https://www.wikidata.org/wiki/Q5859",
    region: "Yucat\xE1n Peninsula",
    description: "This ancient Maya city preserves temples and monuments shaped by both Maya traditions and influences from central Mexico. El Castillo and the round observatory El Caracol are among its best-known surviving buildings.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/483/"
  },
  {
    id: "angkor",
    name: "Angkor Wat",
    country: "Cambodia",
    code: "KHM",
    tier: "legendary",
    lat: 13.4125,
    lon: 103.86666666667,
    source: "https://www.wikidata.org/wiki/Q43473",
    region: "Angkor",
    description: "Built in the twelfth century under King Suryavarman II, Angkor Wat began as a temple devoted to Vishnu and later became a Buddhist sacred site. Its carved galleries tell religious stories and record scenes from the Khmer kingdom.",
    descriptionSourceName: "APSARA National Authority",
    descriptionSource: "https://apsaraauthority.gov.kh/2021/06/14/angkor-wat/"
  },
  {
    id: "machu",
    name: "Machu Picchu",
    country: "Peru",
    code: "PER",
    tier: "legendary",
    lat: -13.163333333333334,
    lon: -72.54555555555555,
    source: "https://www.wikidata.org/wiki/Q676203",
    region: "Andes",
    description: "The Inca built this mountain settlement about 2,430 metres above sea level. Stone walls, terraces and ramps follow the steep terrain, linking remarkable engineering with the surrounding mountain forest.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/274/"
  },
  {
    id: "giza",
    name: "Great Pyramid of Giza",
    country: "Egypt",
    code: "EGY",
    tier: "epic",
    lat: 29.97915,
    lon: 31.13422,
    source: "https://www.wikidata.org/wiki/Q37200",
    region: "Giza Plateau",
    description: "Built as the tomb of King Khufu, the Great Pyramid once had a smooth outer covering of fine limestone. It is the only surviving wonder of the ancient world\u2019s traditional Seven Wonders.",
    descriptionSourceName: "Egypt Ministry of Tourism and Antiquities",
    descriptionSource: "https://egymonuments.gov.eg/monuments/the-great-pyramid/"
  },
  {
    id: "gyeongbokgung",
    name: "Gyeongbokgung Palace",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 37.5798841,
    lon: 126.9767996,
    source: "https://www.wikidata.org/wiki/Q482485",
    region: "Seoul",
    description: "Founded in 1395, Gyeongbokgung was the principal palace of the Joseon dynasty. Its halls and courtyards stand below Bugaksan; after destruction in the sixteenth century, the palace was rebuilt in the nineteenth century.",
    descriptionSourceName: "Royal Palaces and Tombs Center",
    descriptionSource: "https://royal.cha.go.kr/ENG/contents/E101010000.do"
  },
  {
    id: "merlion",
    name: "Merlion",
    country: "Singapore",
    code: "SGP",
    tier: "common",
    lat: 1.2868055555555555,
    lon: 103.8545,
    source: "https://www.wikidata.org/wiki/Q208760",
    region: "Marina Bay",
    description: "With a lion\u2019s head and a fish\u2019s body, the Merlion brings together two images of Singapore. The original waterfront statue was unveiled in 1972 and became a familiar symbol of the city.",
    descriptionSourceName: "Singapore Tourism Board",
    descriptionSource: "https://www.stb.gov.sg/about-stb/media-publications/media-centre/50-and-still-fabulous--the-merlion-celebrates-its-golden-jubilee/"
  },
  {
    id: "brandenburg",
    name: "Brandenburg Gate",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 52.516272222222,
    lon: 13.377722222222,
    source: "https://www.wikidata.org/wiki/Q82425",
    region: "Berlin",
    description: "Built between 1788 and 1791, this sandstone gate brought Greek-inspired architecture to Berlin. A four-horse chariot crowns its columns, and the gate became closely associated with Germany\u2019s division and reunification.",
    descriptionSourceName: "visitBerlin",
    descriptionSource: "https://www.visitberlin.de/en/brandenburg-gate"
  },
  {
    id: "belem",
    name: "Bel\xE9m Tower",
    country: "Portugal",
    code: "PRT",
    tier: "common",
    lat: 38.691388888889,
    lon: -9.2158333333333,
    source: "https://www.wikidata.org/wiki/Q215003",
    region: "Lisbon",
    description: "This fortified tower stands beside the Tagus at the entrance to Lisbon\u2019s harbour. Its carved stonework and corner turrets recall the maritime world of sixteenth-century Portugal.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/263/"
  },
  {
    id: "christ",
    name: "Christ the Redeemer",
    country: "Brazil",
    code: "BRA",
    tier: "common",
    lat: -22.951915648887244,
    lon: -43.21046412278801,
    source: "https://www.wikidata.org/wiki/Q79961",
    region: "Rio de Janeiro",
    description: "Unveiled in 1931, this Art Deco statue stands on Corcovado above Rio de Janeiro. Its outstretched arms form a distinctive silhouette over the city\u2019s forested hills and coastline.",
    descriptionSourceName: "Rio official tourism",
    descriptionSource: "https://riotur.rio/en/que_fazer/christtheredeemer/"
  },
  {
    id: "burj",
    name: "Burj Khalifa",
    country: "United Arab Emirates",
    code: "ARE",
    tier: "rare",
    lat: 25.197222222222223,
    lon: 55.274166666666666,
    source: "https://www.wikidata.org/wiki/Q12495",
    region: "Dubai",
    description: "Opened in 2010, the 828-metre Burj Khalifa rises above central Dubai. Its tapering profile steps upward to a slender spire, while observation decks offer views across the city and desert.",
    descriptionSourceName: "Visit Dubai",
    descriptionSource: "https://www.visitdubai.com/en/places-to-visit/burj-khalifa"
  },
  {
    id: "hagia",
    name: "Hagia Sophia",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "rare",
    lat: 41.00833333333333,
    lon: 28.98,
    source: "https://www.wikidata.org/wiki/Q12506",
    region: "Istanbul",
    description: "A landmark of sixth-century Istanbul, Hagia Sophia is celebrated for its vast dome and the space beneath it. It forms part of the city\u2019s historic areas, where centuries of religious and architectural traditions meet.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/356/"
  },
  {
    id: "borobudur",
    name: "Borobudur Temple",
    country: "Indonesia",
    code: "IDN",
    tier: "rare",
    lat: -7.60793,
    lon: 110.20384,
    source: "https://www.wikidata.org/wiki/Q42798",
    region: "Central Java",
    description: "Built in the eighth and ninth centuries, this Buddhist temple rises through square terraces and circular platforms to a central stupa. Carved reliefs and smaller stupas turn the ascent into a journey through stone.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/592/"
  },
  {
    id: "zimbabwe",
    name: "Great Zimbabwe",
    country: "Zimbabwe",
    code: "ZWE",
    tier: "common",
    lat: -20.27,
    lon: 30.933,
    source: "https://www.wikidata.org/wiki/Q209217",
    region: "Masvingo",
    description: "The stone ruins of Great Zimbabwe preserve a major Shona centre that flourished between the eleventh and fifteenth centuries. Its great enclosures and conical tower recall a city connected to long-distance trade.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/364/"
  },
  {
    id: "sagrada",
    name: "Sagrada Fam\xEDlia",
    country: "Spain",
    code: "ESP",
    tier: "epic",
    lat: 41.40369,
    lon: 2.17433,
    source: "https://www.wikidata.org/wiki/Q48435",
    region: "Barcelona",
    description: "Antoni Gaud\xED made nature a guide for this Barcelona basilica. Branching columns distribute the building\u2019s weight like a stone forest, while geometric forms and coloured light shape its distinctive interior.",
    descriptionSourceName: "Sagrada Fam\xEDlia official site",
    descriptionSource: "https://blog.sagradafamilia.org/en/columns-sagrada-familia-geometry-mechanics-materials-stone-forest/"
  },
  {
    id: "moai",
    name: "Moai of Rapa Nui",
    country: "Chile",
    code: "CHL",
    tier: "rare",
    lat: -27.12,
    lon: -109.35,
    source: "https://www.wikidata.org/wiki/Q14452",
    region: "Rapa Nui",
    description: "The people of Rapa Nui developed a remarkable tradition of monumental stone sculpture. These large human figures, known as moai, stand within a Polynesian cultural landscape of ceremonial sites on the remote Pacific island.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/715/"
  },
  {
    id: "greatwall",
    name: "Great Wall of China",
    country: "China",
    code: "CHN",
    tier: "epic",
    lat: 40.43138888888889,
    lon: 116.56444444444445,
    source: "https://www.wikidata.org/wiki/Q12501",
    region: "Northern China",
    description: "Successive dynasties built and linked fortifications across northern China, with construction continuing into the Ming period. Walls, watchtowers and mountain passes form an immense defensive landscape shaped by centuries of work.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/438/"
  },
  {
    id: "cn",
    name: "CN Tower",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 43.642752777778,
    lon: -79.387147222222,
    source: "https://www.wikidata.org/wiki/Q134883",
    region: "Toronto",
    description: "Opened in 1976, Toronto\u2019s communications and observation tower rises about 553 metres. A broad observation pod wraps around its slender concrete shaft beneath a long antenna.",
    descriptionSourceName: "CN Tower official site",
    descriptionSource: "https://www.cntower.ca/history"
  },
  {
    id: "kinderdijk",
    name: "Kinderdijk Windmills",
    country: "Netherlands",
    code: "NLD",
    tier: "common",
    lat: 51.88861,
    lon: 4.63472,
    source: "https://www.wikidata.org/wiki/Q12012965",
    region: "South Holland",
    description: "Windmills, dykes and waterways at Kinderdijk tell the story of keeping low-lying land dry. The mill network belongs to a water-management landscape shaped over centuries for settlement and farming.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/818/"
  },
  {
    id: "hallgrim",
    name: "Hallgr\xEDmskirkja",
    country: "Iceland",
    code: "ISL",
    tier: "common",
    lat: 64.14194444444445,
    lon: -21.926944444444445,
    source: "https://www.wikidata.org/wiki/Q271466",
    region: "Reykjav\xEDk",
    description: "Consecrated in 1986, this Reykjav\xEDk church was designed by Gu\xF0j\xF3n Sam\xFAelsson. Its rising concrete forms echo Iceland\u2019s columnar rock, mountains and glaciers, gathering around a tall central tower.",
    descriptionSourceName: "Hallgr\xEDmskirkja official site",
    descriptionSource: "https://www.hallgrimskirkja.is/en-gb/husi%C3%B0-og-sagan"
  },
  {
    id: "atomium",
    name: "Atomium",
    country: "Belgium",
    code: "BEL",
    tier: "common",
    lat: 50.895,
    lon: 4.3413888888889,
    source: "https://www.wikidata.org/wiki/Q180901",
    region: "Brussels",
    description: "Built for the 1958 Brussels World\u2019s Fair, the Atomium turns an iron crystal\u2019s unit cell into architecture. Nine metallic spheres are joined by tubes, giving the structure its unmistakable geometric silhouette.",
    descriptionSourceName: "Atomium official site",
    descriptionSource: "https://atomium.be/the_atomium_in_figures"
  },
  {
    id: "petronas",
    name: "Petronas Twin Towers",
    country: "Malaysia",
    code: "MYS",
    tier: "common",
    lat: 3.1577777777777776,
    lon: 101.71166666666667,
    source: "https://www.wikidata.org/wiki/Q83063",
    region: "Kuala Lumpur",
    description: "Designed by C\xE9sar Pelli, these paired towers rise 451.9 metres above Kuala Lumpur. Their stepped profiles and slender spires frame a skybridge linking the two 88-storey buildings.",
    descriptionSourceName: "PETRONAS Twin Towers official site",
    descriptionSource: "https://www.petronastwintowers.com.my/the-towers/the-stories/"
  },
  {
    id: "shwedagon",
    name: "Shwedagon Pagoda",
    country: "Myanmar",
    code: "MMR",
    tier: "common",
    lat: 16.79833333,
    lon: 96.14944444,
    source: "https://www.wikidata.org/wiki/Q464535",
    region: "Yangon",
    description: "On Singuttara Hill in Yangon, Shwedagon is a major Buddhist pilgrimage site. Its gold-covered central stupa rises above terraces, shrines and pavilions, crowned by a jewelled umbrella.",
    descriptionSourceName: "UNESCO Tentative Lists \xB7 Myanmar submission",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/6367/"
  },
  {
    id: "acropolis",
    name: "Acropolis of Athens",
    country: "Greece",
    code: "GRC",
    tier: "rare",
    lat: 37.971666666666664,
    lon: 23.726111111111113,
    source: "https://www.wikidata.org/wiki/Q131013",
    region: "Athens",
    description: "Above Athens, this rocky hill preserves an ensemble of ancient Greek monuments. Major buildings from the fifth century BCE include the Parthenon, the Propylaea and the Erechtheion.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/404/"
  },
  {
    id: "basil",
    name: "Saint Basil\u2019s Cathedral",
    country: "Russia",
    code: "RUS",
    tier: "rare",
    lat: 55.7525,
    lon: 37.62305555555555,
    source: "https://www.wikidata.org/wiki/Q129846",
    region: "Moscow",
    description: "Built between 1555 and 1561, this cathedral stands on Moscow\u2019s Red Square. Its clustered chapels and varied onion-shaped domes create a distinctive skyline whose appearance evolved over later centuries.",
    descriptionSourceName: "State Historical Museum",
    descriptionSource: "https://en.shm.ru/museum/hvb/"
  },
  {
    id: "aitbenhaddou",
    name: "Ait-Ben-Haddou",
    country: "Morocco",
    code: "MAR",
    tier: "common",
    lat: 31.05,
    lon: -7.1333333333333,
    source: "https://www.wikidata.org/wiki/Q309436",
    region: "Ouarzazate",
    description: "This fortified settlement near Ouarzazate groups earthen buildings behind defensive walls and corner towers. Its compact hillside forms exemplify the traditional architecture of Morocco\u2019s pre-Saharan region.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/444/"
  },
  {
    id: "sigiriya",
    name: "Sigiriya",
    country: "Sri Lanka",
    code: "LKA",
    tier: "common",
    lat: 7.9569444444444,
    lon: 80.759722222222,
    source: "https://www.wikidata.org/wiki/Q272153",
    region: "Central Province",
    description: "A granite rock rises roughly 180 metres above the surrounding landscape at Sigiriya. The ruins of King Kassapa I\u2019s fifth-century capital occupy its summit, approached by galleries and stairways through a monumental lion entrance.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/202/"
  },
  {
    id: "sossusvlei",
    name: "Sossusvlei",
    country: "Namibia",
    code: "NAM",
    tier: "common",
    lat: -24.73983,
    lon: 15.28765,
    source: "https://www.wikidata.org/wiki/Q1932730",
    region: "Namib Desert",
    description: "Deep orange dunes surround a pale salt-and-clay pan in the Namib Desert. Sossusvlei formed where sand blocked the Tsauchab River; after exceptional rains, water can reach this usually dry basin.",
    descriptionSourceName: "Namibia Tourism Board",
    descriptionSource: "https://visitnamibia.com.na/2022/03/southern-region/"
  },
  {
    id: "kilimanjaro",
    name: "Mount Kilimanjaro",
    country: "Tanzania",
    code: "TZA",
    tier: "common",
    lat: -3.0666666666667,
    lon: 37.359166666667,
    source: "https://www.wikidata.org/wiki/Q7296",
    region: "Northern Tanzania",
    description: "At 5,895 metres, Kilimanjaro is Africa\u2019s highest mountain. Its volcanic massif rises above the surrounding plains, with forested slopes and a snow-covered summit forming a striking sequence of landscapes.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/403/"
  },
  {
    id: "pragueclock",
    name: "Prague Astronomical Clock",
    country: "Czechia",
    code: "CZE",
    tier: "common",
    lat: 50.08699,
    lon: 14.4207,
    source: "https://www.wikidata.org/wiki/Q729370",
    region: "Prague",
    description: "Mounted on Prague\u2019s Old Town Hall, this astronomical clock combines timekeeping with a calendar and zodiac display. Its decorated dials and figures turn the tower wall into a miniature theatre of the sky.",
    descriptionSourceName: "Prague City Tourism",
    descriptionSource: "https://prague.eu/en/objevujte/old-town-hall-with-astronomical-clock-staromestska-radnice-s-orlojem"
  },
  {
    id: "parliament",
    name: "Hungarian Parliament Building",
    country: "Hungary",
    code: "HUN",
    tier: "rare",
    lat: 47.50694444444444,
    lon: 19.045555555555556,
    source: "https://www.wikidata.org/wiki/Q11819",
    region: "Budapest",
    description: "This monumental home of Hungary\u2019s National Assembly combines a richly detailed Neo-Gothic exterior with a prominent central dome. Rows of pointed windows and slender pinnacles give the long building its distinctive skyline.",
    descriptionSourceName: "Hungarian National Assembly",
    descriptionSource: "https://www.parlament.hu/documents/1779743/1847361/Nevezetes_OH_lapozo_EN.pdf/ada2b046-99e0-f4a9-20a9-13ed2b82d141"
  },
  {
    id: "schonbrunn",
    name: "Sch\xF6nbrunn Palace",
    country: "Austria",
    code: "AUT",
    tier: "common",
    lat: 48.18479,
    lon: 16.31227,
    source: "https://www.wikidata.org/wiki/Q131330",
    region: "Vienna",
    description: "Sch\xF6nbrunn developed from a hunting estate into the Habsburgs\u2019 summer residence. Its broad yellow palace fronts an extensive garden landscape, bringing court architecture and formal outdoor spaces together.",
    descriptionSourceName: "Sch\xF6nbrunn Palace official site",
    descriptionSource: "https://www.schoenbrunn.at/en/about-schoenbrunn/the-palace/history/"
  },
  {
    id: "matterhorn",
    name: "Matterhorn",
    country: "Switzerland",
    code: "CHE",
    tier: "rare",
    lat: 45.97638888888889,
    lon: 7.658611111111111,
    source: "https://www.wikidata.org/wiki/Q1374",
    region: "Zermatt \xB7 Swiss\u2013Italian border",
    description: "The sharply angled Matterhorn rises above Zermatt on the border between Switzerland and Italy. Its steep rock faces and snowy ridges make a striking pyramid-shaped outline in the Alpine landscape.",
    descriptionSourceName: "Zermatt Tourism",
    descriptionSource: "https://zermatt.swiss/en/p/matterhorn-01tVj000005DoH6IAK"
  },
  {
    id: "mermaid",
    name: "The Little Mermaid",
    country: "Denmark",
    code: "DNK",
    tier: "common",
    lat: 55.69286,
    lon: 12.59926,
    source: "https://www.wikidata.org/wiki/Q214619",
    region: "Copenhagen",
    description: "Edvard Eriksen\u2019s bronze sculpture has sat beside Copenhagen\u2019s Langelinie waterfront since 1913. Inspired by Hans Christian Andersen\u2019s tale, the small figure on a rock became an enduring symbol of the city.",
    descriptionSourceName: "VisitCopenhagen",
    descriptionSource: "https://www.visitcopenhagen.com/copenhagen/planning/the-little-mermaid-gdk586951"
  },
  {
    id: "borgund",
    name: "Borgund Stave Church",
    country: "Norway",
    code: "NOR",
    tier: "common",
    lat: 61.04724,
    lon: 7.81224,
    source: "https://www.wikidata.org/wiki/Q755010",
    region: "L\xE6rdal",
    description: "Borgund preserves a distinctive example of Norway\u2019s medieval timber churches. Stacked roofs, carved dragon heads and elaborate portals rise above wooden galleries, showing the craft of stave construction.",
    descriptionSourceName: "National Trust of Norway",
    descriptionSource: "https://fortidsminneforeningen.no/en/museum/borgund-stave-church/"
  },
  {
    id: "helsinki",
    name: "Helsinki Cathedral",
    country: "Finland",
    code: "FIN",
    tier: "common",
    lat: 60.17038775,
    lon: 24.95212383,
    source: "https://www.wikidata.org/wiki/Q738015",
    region: "Helsinki",
    description: "Consecrated in 1852, Helsinki Cathedral is a central part of the city\u2019s neoclassical monumental centre. Its columned portico, broad steps and domes create a recognisable silhouette above Senate Square.",
    descriptionSourceName: "Helsinki Cathedral official site",
    descriptionSource: "https://helsingintuomiokirkko.fi/en/index/historyofthecathedral.html"
  },
  {
    id: "obelisco",
    name: "Obelisk of Buenos Aires",
    country: "Argentina",
    code: "ARG",
    tier: "common",
    lat: -34.60376,
    lon: -58.38162,
    source: "https://www.wikidata.org/wiki/Q831389",
    region: "Buenos Aires",
    description: "Built in 1936 to mark four centuries since the city\u2019s first foundation, the Obelisco stands where Avenida Corrientes meets Avenida 9 de Julio. Its slender shaft and pointed crown make it a familiar Buenos Aires landmark.",
    descriptionSourceName: "Buenos Aires official tourism",
    descriptionSource: "https://turismo.buenosaires.gob.ar/en/atractivo/obelisco-obelisk"
  },
  {
    id: "dubrovnik",
    name: "Walls of Dubrovnik",
    country: "Croatia",
    code: "HRV",
    tier: "rare",
    lat: 42.64,
    lon: 18.108,
    source: "https://www.wikidata.org/wiki/Q931733",
    region: "Dubrovnik",
    description: "Stone walls and defensive towers surround Dubrovnik\u2019s historic centre beside the Adriatic. Inside, churches, palaces and fountains recall the city\u2019s long life as an important Mediterranean maritime power.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/95/"
  },
  {
    id: "boudhanath",
    name: "Boudhanath Stupa",
    country: "Nepal",
    code: "NPL",
    tier: "rare",
    lat: 27.721389,
    lon: 85.361944,
    source: "https://www.wikidata.org/wiki/Q889902",
    region: "Kathmandu",
    description: "Boudhanath is one of the Buddhist monument groups within the Kathmandu Valley World Heritage property. A great white dome supports a gilded tower marked with Buddha\u2019s eyes, giving the stupa its powerful, simple form.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/121/"
  },
  {
    id: "halong",
    name: "Ha Long Bay",
    country: "Vietnam",
    code: "VNM",
    tier: "epic",
    lat: 20.9,
    lon: 107.2,
    source: "https://www.wikidata.org/wiki/Q190128",
    region: "Gulf of Tonkin",
    description: "Limestone islands and steep green towers rise from the waters of Ha Long Bay in northeastern Vietnam. Part of the Ha Long Bay\u2013Cat Ba Archipelago World Heritage property, the seascape reveals karst shaped over a long geological history.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/672/"
  },
  {
    id: "hegra",
    name: "Hegra",
    country: "Saudi Arabia",
    code: "SAU",
    tier: "epic",
    lat: 26.814166666667,
    lon: 37.9475,
    source: "https://www.wikidata.org/wiki/Q27356",
    region: "AlUla",
    description: "At Hegra, Nabataean builders cut monumental tombs directly into sandstone outcrops. Decorated facades, inscriptions and wells preserve traces of a caravan city and its skilful use of the desert landscape.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1293/"
  },
  {
    id: "lotte",
    name: "Lotte World Tower",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 37.5125,
    lon: 127.1025,
    source: "https://www.wikidata.org/wiki/Q494895",
    region: "Seoul",
    description: "Rising 555 metres above Seoul, this 123-storey tower brings offices, homes, a hotel and cultural spaces into a slender vertical city. Its tapered silhouette combines modern glass construction with inspiration from traditional Korean forms.",
    descriptionSourceName: "Lotte Engineering & Construction",
    descriptionSource: "https://www.lottecon.co.kr/Medias/tower_intro_stability"
  },
  {
    id: "marinabaysands",
    name: "Marina Bay Sands",
    country: "Singapore",
    code: "SGP",
    tier: "rare",
    lat: 1.2825,
    lon: 103.86,
    source: "https://www.wikidata.org/wiki/Q548679",
    region: "Marina Bay",
    description: "Three hotel towers support a long rooftop SkyPark above Singapore\u2019s Marina Bay. The elevated gardens and the dramatic overhanging deck make this waterfront complex recognisable as a group of towers joined by a ship-like crown.",
    descriptionSourceName: "Marina Bay Sands official site",
    descriptionSource: "https://www.marinabaysands.com/guides/exceptional-experiences/marina-bay-sands-architecture.html"
  },
  {
    id: "guggenheim",
    name: "Guggenheim Museum Bilbao",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 43.26883,
    lon: -2.934099,
    source: "https://www.wikidata.org/wiki/Q179199",
    region: "Bilbao",
    description: "Built between 1993 and 1997 on a former industrial wharf beside the Nervi\xF3n, the museum brought a new cultural use to Bilbao\u2019s riverfront. Curved titanium surfaces catch changing light across its sculptural forms.",
    descriptionSourceName: "Guggenheim Museum Bilbao official site",
    descriptionSource: "https://www.guggenheim-bilbao.eus/en/the-building/the-construction"
  },
  {
    id: "nmoq",
    name: "National Museum of Qatar",
    country: "Qatar",
    code: "QAT",
    tier: "rare",
    lat: 25.288469,
    lon: 51.549263,
    source: "https://www.wikidata.org/wiki/Q3084218",
    region: "Doha",
    description: "Jean Nouvel\u2019s museum takes its interlocking forms from the desert rose crystal. Completed in 2019, the new building surrounds a restored historic palace and connects Qatar\u2019s cultural story with its desert landscape.",
    descriptionSourceName: "National Museum of Qatar official site",
    descriptionSource: "https://nmoq.org.qa/en/about-us/architecture/"
  },
  {
    id: "heydar",
    name: "Heydar Aliyev Centre",
    country: "Azerbaijan",
    code: "AZE",
    tier: "rare",
    lat: 40.395278,
    lon: 49.866944,
    source: "https://www.wikidata.org/wiki/Q43928",
    region: "Baku",
    description: "Completed in 2012, this Baku cultural centre brings a museum, library and auditoria beneath a flowing roof. Its sweeping white surfaces rise from the surrounding plaza and fold around the spaces inside.",
    descriptionSourceName: "Zaha Hadid Architects",
    descriptionSource: "https://www.zha.com/projects/architecture/heydar-aliyev-centre"
  },
  {
    id: "baiterek",
    name: "Baiterek Tower",
    country: "Kazakhstan",
    code: "KAZ",
    tier: "common",
    lat: 51.128333,
    lon: 71.430556,
    source: "https://www.wikidata.org/wiki/Q804210",
    region: "Astana",
    description: "Astana\u2019s observation monument interprets the Turkic legend of the Tree of Life. A golden sphere rests above branching supports, recalling the egg laid by the mythical bird Samruk at the top of the sacred tree.",
    descriptionSourceName: "Kazakhstan Travel",
    descriptionSource: "https://kazakhstan.travel/en/attractions/423"
  },
  {
    id: "sangsad",
    name: "National Parliament House",
    country: "Bangladesh",
    code: "BGD",
    tier: "rare",
    lat: 23.762222,
    lon: 90.378611,
    source: "https://www.wikidata.org/wiki/Q497536",
    region: "Dhaka",
    description: "Designed by Louis Kahn, Bangladesh\u2019s parliament complex was built between 1962 and 1982 in Dhaka. Monumental geometric forms and the careful use of light give this modern civic building its distinctive presence.",
    descriptionSourceName: "Bangladesh Parliament",
    descriptionSource: "https://www.parliament.gov.bd/about/history"
  },
  {
    id: "kigali",
    name: "Kigali Convention Centre",
    country: "Rwanda",
    code: "RWA",
    tier: "common",
    lat: -1.954722,
    lon: 30.093889,
    source: "https://www.wikidata.org/wiki/Q25043410",
    region: "Kigali",
    description: "Opened in 2016, Kigali\u2019s convention centre is recognised by its ribbed dome. The rounded form recalls a traditional Rwandan royal residence, bringing a local architectural reference into a contemporary gathering place.",
    descriptionSourceName: "Rwanda Convention Bureau",
    descriptionSource: "https://rcb.rw/IMG/pdf/mpg_2023-24_v2.pdf"
  },
  {
    id: "blackstar",
    name: "Black Star Gate",
    country: "Ghana",
    code: "GHA",
    tier: "common",
    lat: 5.54901,
    lon: -0.19286,
    source: "https://www.wikidata.org/wiki/Q98410976",
    region: "Accra",
    description: "Standing north of Accra\u2019s Independence Square, this monumental gate is crowned by a five-pointed black star. It carries the words Freedom and Justice and commemorates Ghana\u2019s independence; it is distinct from the nearby Independence Arch.",
    descriptionSourceName: "Visit Ghana",
    descriptionSource: "https://visitghana.com/independence-square/"
  },
  {
    id: "biomuseo",
    name: "Biomuseo",
    country: "Panama",
    code: "PAN",
    tier: "common",
    lat: 8.93189,
    lon: -79.54473,
    source: "https://www.wikidata.org/wiki/Q6034184",
    region: "Panama City",
    description: "Frank Gehry\u2019s museum on the Amador Causeway celebrates Panama\u2019s biodiversity. Irregular metal canopies in vivid colours shelter an open-air atrium, turning the building itself into a lively introduction to the country\u2019s natural diversity.",
    descriptionSourceName: "Biomuseo official site",
    descriptionSource: "https://biomuseo.org/el-biomuseo/"
  },
  {
    id: "casapueblo",
    name: "Casapueblo",
    country: "Uruguay",
    code: "URY",
    tier: "common",
    lat: -34.908869,
    lon: -55.044906,
    source: "https://www.wikidata.org/wiki/Q377792",
    region: "Punta Ballena",
    description: "Artist Carlos P\xE1ez Vilar\xF3 shaped this seaside home and studio over decades at Punta Ballena. Its white walls, winding passages and terraces form a sculptural building whose museum preserves the artist\u2019s work.",
    descriptionSourceName: "Museo Taller Casapueblo",
    descriptionSource: "https://casapueblo.com.uy/"
  },
  {
    id: "taipei101",
    name: "Taipei 101",
    country: "Taiwan",
    code: "TWN",
    tier: "rare",
    lat: 25.033611,
    lon: 121.564722,
    source: "https://www.wikidata.org/wiki/Q83101",
    region: "Taipei",
    description: "Completed in 2004, this 508-metre tower rises above Taipei in stacked sections inspired by bamboo joints. Its eight-storey modules reinterpret traditional architectural forms in a glass-and-steel skyscraper.",
    descriptionSourceName: "Oneness & Associates project archive",
    descriptionSource: "https://www.onenessarchitects.com/project/Taipei-101?lang=en"
  },
  {
    id: "registan",
    name: "Registan Square",
    country: "Uzbekistan",
    code: "UZB",
    tier: "rare",
    lat: 39.654722,
    lon: 66.975556,
    source: "https://www.wikidata.org/wiki/Q1373583",
    region: "Samarkand",
    description: "Three madrasahs frame this historic square in Samarkand: Ulugh Beg, Sher-Dor and Tilla-Kari. Their monumental portals and tiled fa\xE7ades form an architectural ensemble at the heart of a city shaped by Silk Road exchanges.",
    descriptionSourceName: "Uzbekistan official tourism",
    descriptionSource: "https://uzbekistan.travel/en/i/samarkand/"
  },
  {
    id: "qaboos",
    name: "Sultan Qaboos Grand Mosque",
    country: "Oman",
    code: "OMN",
    tier: "rare",
    lat: 23.583889,
    lon: 58.389167,
    source: "https://www.wikidata.org/wiki/Q1548443",
    region: "Muscat",
    description: "Inaugurated in 2001, this mosque in Muscat combines Indian sandstone with a large central dome and five minarets. Its prayer halls and arcaded courtyards create a spacious architectural setting for worship.",
    descriptionSourceName: "Experience Oman tourism",
    descriptionSource: "https://experienceoman.om/en/destinations/muscat/sultan-qaboos-grand-mosque"
  },
  {
    id: "kuwaittowers",
    name: "Kuwait Towers",
    country: "Kuwait",
    code: "KWT",
    tier: "common",
    lat: 29.39,
    lon: 48.003056,
    source: "https://www.wikidata.org/wiki/Q1335640",
    region: "Kuwait City",
    description: "This waterfront group of three towers forms part of Kuwait\u2019s water-supply infrastructure. Slender shafts and blue-green spheres turn reservoirs and public viewing spaces into a distinctive silhouette above Kuwait City.",
    descriptionSourceName: "UNESCO tentative-list submission \u2014 Abraj Al-Kuwait",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/5933/"
  },
  {
    id: "bahrainwtc",
    name: "Bahrain World Trade Center",
    country: "Bahrain",
    code: "BHR",
    tier: "common",
    lat: 26.239167,
    lon: 50.581389,
    source: "https://www.wikidata.org/wiki/Q511612",
    region: "Manama",
    description: "Two sail-shaped towers in Manama are linked by three bridges carrying large wind turbines. The design channels sea breezes between the towers, integrating renewable-energy equipment into the building\u2019s architecture.",
    descriptionSourceName: "BWTC architectural guide",
    descriptionSource: "https://www.bahrainwtc.com/the-bwtc/architecture/"
  },
  {
    id: "skytower",
    name: "Sky Tower",
    country: "New Zealand",
    code: "NZL",
    tier: "common",
    lat: -36.848472,
    lon: 174.762306,
    source: "https://www.wikidata.org/wiki/Q722125",
    region: "Auckland",
    description: "Completed in 1997, Auckland\u2019s 328-metre observation and communications tower has a slender concrete shaft, elevated public decks and a long mast. Moller Architects designed the tower as a prominent element of the city skyline.",
    descriptionSourceName: "Moller Architects project archive",
    descriptionSource: "https://mollerarchitects.com/project/sky-tower"
  },
  {
    id: "tiranapyramid",
    name: "Pyramid of Tirana",
    country: "Albania",
    code: "ALB",
    tier: "common",
    lat: 41.323022,
    lon: 19.821567,
    source: "https://www.wikidata.org/wiki/Q177335",
    region: "Tirana",
    description: "Originally opened in 1988 as a museum dedicated to dictator Enver Hoxha, this concrete pyramid was transformed into a cultural and learning centre in 2023. MVRDV added climbable steps and colourful rooms around its retained structure.",
    descriptionSourceName: "MVRDV transformation project",
    descriptionSource: "https://www.mvrdv.com/projects/312/the-pyramid-of-tirana"
  },
  {
    id: "bucharestpalace",
    name: "Palace of Parliament",
    country: "Romania",
    code: "ROU",
    tier: "common",
    lat: 44.4275,
    lon: 26.0875,
    source: "https://www.wikidata.org/wiki/Q164150",
    region: "Bucharest",
    description: "Built during Nicolae Ceau\u0219escu\u2019s regime, this monumental palace in Bucharest combines broad terraces, repetitive colonnades and extensive ceremonial halls. Its architecture reflects a controversial project to concentrate state institutions in one vast building.",
    descriptionSourceName: "Romanian Parliament conference centre",
    descriptionSource: "https://cic.cdep.ro/en/prezentare/cladire"
  },
  {
    id: "lalibela",
    name: "Rock-Hewn Churches of Lalibela",
    country: "Ethiopia",
    code: "ETH",
    tier: "rare",
    lat: 12.02935,
    lon: 39.04042,
    region: "Lalibela",
    description: "Medieval churches were carved downward into the rock at Lalibela. Trenches and passages connect this Ethiopian pilgrimage landscape; the cross-shaped Church of Saint George gives it a memorable silhouette.",
    descriptionSource: "https://whc.unesco.org/en/list/18/",
    source: "https://www.wikidata.org/wiki/Q642979",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "djenne",
    name: "Great Mosque of Djenn\xE9",
    country: "Mali",
    code: "MLI",
    tier: "rare",
    lat: 13.905278,
    lon: -4.555556,
    region: "Djenn\xE9",
    description: "The Great Mosque anchors the earthen architecture of Djenn\xE9, a historic trading town in the Niger inland delta. Its buttressed walls and projecting timber form a distinctive part of the townscape.",
    descriptionSource: "https://whc.unesco.org/en/list/116/",
    source: "https://www.wikidata.org/wiki/Q683632",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "leptis",
    name: "Leptis Magna",
    country: "Libya",
    code: "LBY",
    tier: "rare",
    lat: 32.638332,
    lon: 14.290496,
    region: "Al Khums",
    description: "This Mediterranean city grew under the Roman Empire, especially during the reign of its native son Septimius Severus. Its surviving columns, public buildings and harbour reveal an extensive ancient urban landscape.",
    descriptionSource: "https://whc.unesco.org/en/list/183/",
    source: "https://www.wikidata.org/wiki/Q191504",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "eljem",
    name: "Amphitheatre of El Jem",
    country: "Tunisia",
    code: "TUN",
    tier: "common",
    lat: 35.296389,
    lon: 10.706944,
    region: "El Jem",
    description: "Built in the third century, this Roman amphitheatre rises above the town of El Jem. Its tiers of stone arches and open arena preserve the scale of public entertainment in Roman North Africa.",
    descriptionSource: "https://whc.unesco.org/en/list/38/",
    source: "https://www.wikidata.org/wiki/Q2914326",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "meroe",
    name: "Pyramids of Mero\xEB",
    country: "Sudan",
    code: "SDN",
    tier: "rare",
    lat: 16.935139,
    lon: 33.75075,
    region: "Mero\xEB",
    description: "Slender pyramids mark royal burial grounds of the Kingdom of Kush near the Nile. Together with temples and settlement remains, they record a civilization connected with both Africa and the Mediterranean.",
    descriptionSource: "https://whc.unesco.org/en/list/1336/",
    source: "https://www.wikidata.org/wiki/Q5780",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "timgad",
    name: "Arch of Trajan at Timgad",
    country: "Algeria",
    code: "DZA",
    tier: "common",
    lat: 35.4851,
    lon: 6.46694,
    region: "Timgad",
    description: "Timgad was founded as a Roman colony in AD 100 on the slopes of the Aur\xE8s mountains. Its monumental arch stands among the gridded streets and civic remains that make the ancient city plan readable today.",
    descriptionSource: "https://whc.unesco.org/en/list/194/",
    source: "https://www.wikidata.org/wiki/Q1393557",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "renaissance",
    name: "African Renaissance Monument",
    country: "Senegal",
    code: "SEN",
    tier: "common",
    lat: 14.722222,
    lon: -17.495,
    region: "Dakar",
    description: "A monumental bronze-colored family group rises above Dakar on a coastal hill. The figures turn outward toward the horizon, making the sculpture a prominent modern landmark of the Senegalese capital.",
    descriptionSource: "https://www.culture.gouv.sn/index.php/monument-de-la-renaissance/",
    source: "https://www.wikidata.org/wiki/Q470763",
    descriptionSourceName: "Official site"
  },
  {
    id: "yamoussoukro",
    name: "Basilica of Our Lady of Peace",
    country: "C\xF4te d\u2019Ivoire",
    code: "CIV",
    tier: "common",
    lat: 6.811111,
    lon: -5.296944,
    region: "Yamoussoukro",
    description: "A broad dome and sweeping colonnades define this basilica in Yamoussoukro. Designed by architect Pierre Fakhoury with references to Saint Peter\u2019s in Rome, it combines monumental religious architecture with landscaped grounds.",
    descriptionSource: "https://www.mairieyamoussoukro.ci/yamoussoukro/tourisme",
    source: "https://www.wikidata.org/wiki/Q815584",
    descriptionSourceName: "Official site"
  },
  {
    id: "mbanzakongo",
    name: "Mbanza Kongo",
    country: "Angola",
    code: "AGO",
    tier: "common",
    lat: -6.266667,
    lon: 14.25,
    region: "Zaire Province",
    description: "The former capital of the Kingdom of Kongo preserves traces of royal, religious and everyday life. Its surviving urban sites, including cathedral ruins, reflect encounters between Kongo traditions and European influences.",
    descriptionSource: "https://whc.unesco.org/en/list/1511/",
    source: "https://www.wikidata.org/wiki/Q500189",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "rila",
    name: "Rila Monastery",
    country: "Bulgaria",
    code: "BGR",
    tier: "rare",
    lat: 42.134379,
    lon: 23.339551,
    region: "Rila Mountains",
    description: "Founded around the legacy of Saint John of Rila, this mountain monastery became a major Bulgarian spiritual and literary centre. Arcaded courtyards and the nineteenth-century buildings surround its richly decorated church.",
    descriptionSource: "https://whc.unesco.org/en/list/216/",
    source: "https://www.wikidata.org/wiki/Q207945",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "mostar",
    name: "Old Bridge of Mostar",
    country: "Bosnia and Herzegovina",
    code: "BIH",
    tier: "common",
    lat: 43.337278,
    lon: 17.815028,
    region: "Mostar",
    description: "A high stone arch links the banks of the Neretva in Mostar. Destroyed during the 1990s war and rebuilt in 2004, the bridge is both an architectural landmark and a symbol of reconciliation.",
    descriptionSource: "https://whc.unesco.org/en/list/946/",
    source: "https://www.wikidata.org/wiki/Q188528",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "sava",
    name: "Temple of Saint Sava",
    country: "Serbia",
    code: "SRB",
    tier: "common",
    lat: 44.798083,
    lon: 20.46855,
    region: "Belgrade",
    description: "The Temple of Saint Sava is a prominent Orthodox landmark in Belgrade. A large central dome and smaller surrounding domes rise over its pale exterior, overlooking a public space used for gatherings and evening walks.",
    descriptionSource: "https://www.serbia.travel/en/stories-items/light-over-belgrade/",
    source: "https://www.wikidata.org/wiki/Q330385",
    descriptionSourceName: "Official site"
  },
  {
    id: "bled",
    name: "Bled Island Church",
    country: "Slovenia",
    code: "SVN",
    tier: "common",
    lat: 46.362234,
    lon: 14.090042,
    region: "Lake Bled",
    description: "A church and bell tower crown the small island in Lake Bled. Reached across the water, the island combines a long religious history with a distinctive setting of lake, woodland and surrounding mountains.",
    descriptionSource: "https://www.bled.si/en/what-to-see-do/attractions/2/bled-island/",
    source: "https://www.wikidata.org/wiki/Q2877401",
    descriptionSourceName: "Official site"
  },
  {
    id: "trakai",
    name: "Trakai Island Castle",
    country: "Lithuania",
    code: "LTU",
    tier: "common",
    lat: 54.6525,
    lon: 24.933056,
    region: "Lake Galv\u0117",
    description: "Red-brick towers rise from an island in Lake Galv\u0117 at Trakai. The castle is associated with the medieval rulers of Lithuania, while restoration has made its courtyards and steep-roofed towers recognizable again.",
    descriptionSource: "https://www.trakai-visit.lt/en/trakai-island-castle/",
    source: "https://www.wikidata.org/wiki/Q1482013",
    descriptionSourceName: "Official site"
  },
  {
    id: "blackheads",
    name: "House of the Blackheads",
    country: "Latvia",
    code: "LVA",
    tier: "common",
    lat: 56.947139,
    lon: 24.106917,
    region: "Riga",
    description: "This ornate building faces Riga\u2019s Town Hall Square and recalls the Brotherhood of the Blackheads, a historic merchant association. Its reconstructed facade pairs stepped gables with colorful architectural decoration.",
    descriptionSource: "https://www.liveriga.com/en/visit/what-to-see/top-sights/house-of-the-blackheads",
    source: "https://www.wikidata.org/wiki/Q74736",
    descriptionSourceName: "Official site"
  },
  {
    id: "tallinn",
    name: "Tallinn Town Hall",
    country: "Estonia",
    code: "EST",
    tier: "common",
    lat: 59.437005,
    lon: 24.745309,
    region: "Tallinn",
    description: "Tallinn\u2019s medieval town hall stands beside the market square in the Old Town. A slender tower, steep roof and ground-floor arcade make the civic building a distinctive landmark of the Baltic trading city.",
    descriptionSource: "https://web.visittallinn.ee/eng/visitor/see-do/things-to-do/attractions-museums/174683/tallinn-town-hall",
    source: "https://www.wikidata.org/wiki/Q904057",
    descriptionSourceName: "Official site"
  },
  {
    id: "taktsang",
    name: "Paro Taktsang",
    country: "Bhutan",
    code: "BTN",
    tier: "rare",
    lat: 27.491667,
    lon: 89.363333,
    region: "Paro Valley",
    description: "Known as the Tiger\u2019s Nest, this monastery clings to a cliff above the Paro Valley. Its white walls and golden roofs sit against the rock, creating one of Bhutan\u2019s most recognizable sacred landscapes.",
    descriptionSource: "https://bhutan.travel/journal/editorial/a-winter-s-tale",
    source: "https://www.wikidata.org/wiki/Q2209873",
    descriptionSourceName: "Official site"
  },
  {
    id: "xiengthong",
    name: "Wat Xieng Thong",
    country: "Laos",
    code: "LAO",
    tier: "common",
    lat: 19.8975,
    lon: 102.143056,
    region: "Luang Prabang",
    description: "Built in the sixteenth century near the Mekong, Wat Xieng Thong is an important monastery in Luang Prabang. Its low, sweeping rooflines and ornamental surfaces express the city\u2019s temple-building traditions.",
    descriptionSource: "https://www.tourismlaos.org/2816-2/",
    source: "https://www.wikidata.org/wiki/Q2671118",
    descriptionSourceName: "Official site"
  },
  {
    id: "watarun",
    name: "Wat Arun",
    country: "Thailand",
    code: "THA",
    tier: "rare",
    lat: 13.743689,
    lon: 100.488919,
    region: "Bangkok",
    description: "Wat Arun stands on the Chao Phraya River in Bangkok. Its central prang and surrounding towers form an ornate skyline, reflecting a royal temple history that spans the Thonburi and Bangkok periods.",
    descriptionSource: "https://www.tourismthailand.org/Attraction/wat-arun-ratchawararam-ratchawaramahawihan",
    source: "https://www.wikidata.org/wiki/Q724970",
    descriptionSourceName: "Official site"
  },
  {
    id: "badshahi",
    name: "Badshahi Mosque",
    country: "Pakistan",
    code: "PAK",
    tier: "rare",
    lat: 31.588056,
    lon: 74.309444,
    region: "Lahore",
    description: "Commissioned under the Mughal emperor Aurangzeb, this mosque stands beside Lahore Fort. Red sandstone walls, pale domes and tall corner minarets frame an expansive courtyard.",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/1277/",
    source: "https://www.wikidata.org/wiki/Q330872",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "golestan",
    name: "Golestan Palace",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 35.679722,
    lon: 51.420278,
    region: "Tehran",
    description: "The Golestan complex was a royal centre of the Qajar dynasty in Tehran. Its palaces and garden combine Persian craftsmanship with artistic and architectural influences from Europe.",
    descriptionSource: "https://whc.unesco.org/en/list/1422/",
    source: "https://www.wikidata.org/wiki/Q210610",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "chinggis",
    name: "Chinggis Khaan Statue",
    country: "Mongolia",
    code: "MNG",
    tier: "common",
    lat: 47.808083,
    lon: 107.529806,
    region: "Tsonjin Boldog",
    description: "A monumental equestrian statue of Chinggis Khaan stands at Tsonjin Boldog, east of Ulaanbaatar. The bright metal figure and circular base create a striking modern silhouette against the open steppe.",
    descriptionSource: "https://www.gomongolia.gov.mn/explore-experience/",
    source: "https://www.wikidata.org/wiki/Q1165021",
    descriptionSourceName: "Official site"
  },
  {
    id: "tikal",
    name: "Tikal",
    country: "Guatemala",
    code: "GTM",
    tier: "epic",
    lat: 17.222094,
    lon: -89.623614,
    region: "Pet\xE9n",
    description: "Steep temple pyramids rise above the forest at this major Maya city. Plazas, palaces and carved monuments preserve a ceremonial and urban landscape within Guatemala\u2019s rich tropical ecosystem.",
    descriptionSource: "https://whc.unesco.org/en/list/64/",
    source: "https://www.wikidata.org/wiki/Q181172",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "copan",
    name: "Cop\xE1n",
    country: "Honduras",
    code: "HND",
    tier: "rare",
    lat: 14.837964,
    lon: -89.142442,
    region: "Cop\xE1n Valley",
    description: "Cop\xE1n was a major Maya centre whose plazas contain intricately carved stelae and altars. The Hieroglyphic Stairway preserves a long sequence of inscriptions, linking monumental architecture with royal history.",
    descriptionSource: "https://whc.unesco.org/en/list/129/",
    source: "https://www.wikidata.org/wiki/Q214827",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "joyaceren",
    name: "Joya de Cer\xE9n",
    country: "El Salvador",
    code: "SLV",
    tier: "common",
    lat: 13.827494,
    lon: -89.356158,
    region: "La Libertad",
    description: "Volcanic ash preserved a Maya farming settlement at Joya de Cer\xE9n. Houses, storage areas and traces of daily work offer an unusually close view of ordinary life rather than royal monuments.",
    descriptionSource: "https://whc.unesco.org/en/list/675/",
    source: "https://www.wikidata.org/wiki/Q27985",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "arenal",
    name: "Arenal Volcano",
    country: "Costa Rica",
    code: "CRI",
    tier: "common",
    lat: 10.4625,
    lon: -84.703333,
    region: "La Fortuna",
    description: "The steep cone of Arenal rises above the forests near La Fortuna. Protected within a national park, the volcanic landscape includes old lava flows and habitats that support Costa Rica\u2019s rich wildlife.",
    descriptionSource: "https://www.sinac.go.cr/en-us/ac/acahn/pnva/pages/default.aspx",
    source: "https://www.wikidata.org/wiki/Q641588",
    descriptionSourceName: "Official site"
  },
  {
    id: "cartagena",
    name: "Cartagena Clock Tower",
    country: "Colombia",
    code: "COL",
    tier: "common",
    lat: 10.423097,
    lon: -75.549258,
    region: "Cartagena de Indias",
    description: "The Clock Tower stands over a gateway into Cartagena\u2019s walled city. Its three passages connect the old town with the surrounding streets, while the clock has become a familiar civic landmark.",
    descriptionSource: "https://colombia.travel/en/cartagena-de-indias/visit-gate-and-clock-tower",
    source: "https://www.wikidata.org/wiki/Q30594363",
    descriptionSourceName: "Official site"
  },
  {
    id: "quitofrancisco",
    name: "San Francisco of Quito",
    country: "Ecuador",
    code: "ECU",
    tier: "common",
    lat: -0.220278,
    lon: -78.515556,
    region: "Quito",
    description: "San Francisco forms part of Quito\u2019s historic religious architecture. Its church and convent reflect the artistic exchanges of the Quito school, where Indigenous craftsmanship and European traditions developed together.",
    descriptionSource: "https://whc.unesco.org/en/list/2/",
    source: "https://www.wikidata.org/wiki/Q5116751",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "tiwanaku",
    name: "Tiwanaku",
    country: "Bolivia",
    code: "BOL",
    tier: "common",
    lat: -16.554722,
    lon: -68.673333,
    region: "La Paz Department",
    description: "This highland centre was the capital of an influential pre-Hispanic civilization. Monumental stone platforms, carved monoliths and the Gate of the Sun preserve its distinctive architectural and ceremonial traditions.",
    descriptionSource: "https://whc.unesco.org/en/list/567/",
    source: "https://www.wikidata.org/wiki/Q61750",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "sanssouci",
    name: "Sans-Souci Palace",
    country: "Haiti",
    code: "HTI",
    tier: "common",
    lat: 19.604692,
    lon: -72.218596,
    region: "Milot",
    description: "The ruins of Sans-Souci stand near Milot in northern Haiti. Built after independence under Henri Christophe, the palace belongs to a group of monuments that express the ambitions of the new Haitian state.",
    descriptionSource: "https://whc.unesco.org/en/list/180/",
    source: "https://www.wikidata.org/wiki/Q930795",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "nanmadol",
    name: "Nan Madol",
    country: "Micronesia",
    code: "FSM",
    tier: "epic",
    lat: 6.841944,
    lon: 158.332222,
    region: "Pohnpei",
    description: "Massive basalt walls stand on artificial islets beside Pohnpei. Linked by waterways, this ceremonial centre records the power and building traditions of the Saudeleur dynasty in the western Pacific.",
    descriptionSource: "https://whc.unesco.org/en/list/1503/",
    source: "https://www.wikidata.org/wiki/Q846967",
    descriptionSourceName: "UNESCO World Heritage Centre"
  },
  {
    id: "pngparliament",
    name: "Papua New Guinea Parliament House",
    country: "Papua New Guinea",
    code: "PNG",
    tier: "common",
    lat: -9.428056,
    lon: 147.191667,
    region: "Port Moresby",
    description: "Papua New Guinea\u2019s Parliament House draws on the country\u2019s traditional architecture. Its bold roof form and carved decoration bring local cultural traditions into the setting of a modern national institution.",
    descriptionSource: "https://old.parliament.gov.pg/about/parliament",
    source: "https://www.wikidata.org/wiki/Q109236300",
    descriptionSourceName: "Official site"
  },
  {
    id: "tongapalace",
    name: "Royal Palace of Tonga",
    country: "Tonga",
    code: "TON",
    tier: "common",
    lat: -21.131389,
    lon: -175.200556,
    region: "Nuku\u02BBalofa",
    description: "The Royal Palace stands near the waterfront in Nuku\u02BBalofa, Tonga\u2019s capital. The pale wooden residence and its landscaped grounds form a landmark associated with the country\u2019s continuing monarchy.",
    descriptionSource: "https://www.tongatourism.travel/tonga-stories/post/top-10-things-to-do-in-tonga",
    source: "https://www.wikidata.org/wiki/Q2992825",
    descriptionSourceName: "Official site"
  },
  {
    id: "montsaintmichel",
    name: "Mont-Saint-Michel",
    country: "France",
    code: "FRA",
    tier: "legendary",
    lat: 48.63556,
    lon: -1.51056,
    source: "https://whc.unesco.org/en/list/80/",
    region: "Europe and North America",
    description: "An abbey crowns a rocky island above a broad tidal bay. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/80/"
  },
  {
    id: "versailles",
    name: "Palace of Versailles",
    country: "France",
    code: "FRA",
    tier: "epic",
    lat: 48.805,
    lon: 2.119444,
    source: "https://whc.unesco.org/en/list/83/",
    region: "Europe and North America",
    description: "Long palace wings face formal gardens laid out along straight avenues. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/83/"
  },
  {
    id: "chartres",
    name: "Chartres Cathedral",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 48.4475,
    lon: 1.487222,
    source: "https://whc.unesco.org/en/list/81/",
    region: "Europe and North America",
    description: "Two contrasting spires rise above a Gothic cathedral known for stained glass. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/81/"
  },
  {
    id: "amiens",
    name: "Amiens Cathedral",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 49.895,
    lon: 2.301667,
    source: "https://whc.unesco.org/en/list/162/",
    region: "Europe and North America",
    description: "A broad Gothic facade frames deep portals and a tall central nave. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/162/"
  },
  {
    id: "pontdugard",
    name: "Pont du Gard",
    country: "France",
    code: "FRA",
    tier: "epic",
    lat: 43.947222,
    lon: 4.535278,
    source: "https://whc.unesco.org/en/list/344/",
    region: "Europe and North America",
    description: "Three tiers of Roman arches carry an aqueduct above the river. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/344/"
  },
  {
    id: "avignon",
    name: "Palace of the Popes",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 43.952778,
    lon: 4.806111,
    source: "https://whc.unesco.org/en/list/228/",
    region: "Europe and North America",
    description: "Massive stone walls and square towers give the papal palace a fortified outline. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/228/"
  },
  {
    id: "carcassonne",
    name: "Carcassonne",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 43.207063,
    lon: 2.363656,
    source: "https://whc.unesco.org/en/list/345/",
    region: "Europe and North America",
    description: "Conical tower roofs punctuate the double walls of a fortified medieval town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/345/"
  },
  {
    id: "fontainebleau",
    name: "Fontainebleau Palace",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 48.401944,
    lon: 2.698056,
    source: "https://whc.unesco.org/en/list/160/",
    region: "Europe and North America",
    description: "Courtyards and steep roofs link successive wings of a royal residence. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/160/"
  },
  {
    id: "albi",
    name: "Albi Cathedral",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 43.929167,
    lon: 2.144167,
    source: "https://whc.unesco.org/en/list/1337/",
    region: "Europe and North America",
    description: "A monumental brick cathedral has a solid exterior and a tall bell tower. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1337/"
  },
  {
    id: "reims",
    name: "Reims Cathedral",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 49.254,
    lon: 4.034,
    source: "https://whc.unesco.org/en/list/601/",
    region: "Europe and North America",
    description: "A richly sculpted Gothic facade rises above three deep entrance portals. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/601/"
  },
  {
    id: "arles",
    name: "Arles Amphitheatre",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 43.677639,
    lon: 4.630694,
    source: "https://whc.unesco.org/en/list/164/",
    region: "Europe and North America",
    description: "An oval Roman amphitheatre encloses an arena within repeated stone arches. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/164/"
  },
  {
    id: "lehavre",
    name: "Le Havre",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 49.49278,
    lon: 0.1075,
    source: "https://whc.unesco.org/en/list/1181/",
    region: "Europe and North America",
    description: "Concrete buildings and a high church tower define a rebuilt port city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1181/"
  },
  {
    id: "brugge",
    name: "Bruges",
    country: "Belgium",
    code: "BEL",
    tier: "rare",
    lat: 51.20891,
    lon: 3.22527,
    source: "https://whc.unesco.org/en/list/996/",
    region: "Europe and North America",
    description: "Stepped gables and a belfry overlook canals in a medieval trading town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/996/"
  },
  {
    id: "brusselsplace",
    name: "Grand Place",
    country: "Belgium",
    code: "BEL",
    tier: "rare",
    lat: 50.84668,
    lon: 4.35242,
    source: "https://whc.unesco.org/en/list/857/",
    region: "Europe and North America",
    description: "Ornate guild houses surround a square watched over by a tall town-hall spire. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/857/"
  },
  {
    id: "tournai",
    name: "Tournai Cathedral",
    country: "Belgium",
    code: "BEL",
    tier: "common",
    lat: 50.60603,
    lon: 3.38926,
    source: "https://whc.unesco.org/en/list/1009/",
    region: "Europe and North America",
    description: "Five towers form the distinctive skyline of a great stone cathedral. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1009/"
  },
  {
    id: "cologne",
    name: "Cologne Cathedral",
    country: "Germany",
    code: "DEU",
    tier: "epic",
    lat: 50.941111,
    lon: 6.957222,
    source: "https://whc.unesco.org/en/list/292/",
    region: "Europe and North America",
    description: "Twin openwork spires rise above the long roof of a Gothic cathedral. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/292/"
  },
  {
    id: "aachen",
    name: "Aachen Cathedral",
    country: "Germany",
    code: "DEU",
    tier: "rare",
    lat: 50.774747,
    lon: 6.08392,
    source: "https://whc.unesco.org/en/list/3/",
    region: "Europe and North America",
    description: "An octagonal central chapel anchors a cathedral enlarged across many periods. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/3/"
  },
  {
    id: "speyer",
    name: "Speyer Cathedral",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 49.317222,
    lon: 8.442389,
    source: "https://whc.unesco.org/en/list/168/",
    region: "Europe and North America",
    description: "Romanesque towers and a long nave give this cathedral a strong geometric rhythm. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/168/"
  },
  {
    id: "wartburg",
    name: "Wartburg Castle",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 50.966778,
    lon: 10.307,
    source: "https://whc.unesco.org/en/list/897/",
    region: "Europe and North America",
    description: "A hilltop castle combines stone halls with timber-framed buildings. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/897/"
  },
  {
    id: "bamberg",
    name: "Bamberg",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 49.891667,
    lon: 10.888889,
    source: "https://whc.unesco.org/en/list/624/",
    region: "Europe and North America",
    description: "Historic roofs and church towers rise across a town built on several hills. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/624/"
  },
  {
    id: "quedlinburg",
    name: "Quedlinburg",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 51.786806,
    lon: 11.136528,
    source: "https://whc.unesco.org/en/list/535/",
    region: "Europe and North America",
    description: "Timber-framed houses cluster below a castle hill and collegiate church. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/535/"
  },
  {
    id: "maulbronn",
    name: "Maulbronn Monastery",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 49.000997,
    lon: 8.806665,
    source: "https://whc.unesco.org/en/list/546/",
    region: "Europe and North America",
    description: "Stone arcades surround quiet courtyards within a medieval monastery complex. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/546/"
  },
  {
    id: "volklingen",
    name: "V\xF6lklingen Ironworks",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 49.248722,
    lon: 6.844222,
    source: "https://whc.unesco.org/en/list/687/",
    region: "Europe and North America",
    description: "Blast furnaces and elevated metal walkways preserve the outline of an ironworks. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/687/"
  },
  {
    id: "zollverein",
    name: "Zollverein",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 51.491389,
    lon: 7.046111,
    source: "https://whc.unesco.org/en/list/975/",
    region: "Europe and North America",
    description: "A geometric winding tower stands above the brick buildings of a coal mine. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/975/"
  },
  {
    id: "bauhaus",
    name: "Bauhaus Dessau",
    country: "Germany",
    code: "DEU",
    tier: "rare",
    lat: 51.665708,
    lon: 12.110309,
    source: "https://whc.unesco.org/en/list/729/",
    region: "Europe and North America",
    description: "Glass curtain walls meet clean cubic volumes in a pioneering design school. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/729/"
  },
  {
    id: "lubeck",
    name: "L\xFCbeck",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 53.865648,
    lon: 10.686481,
    source: "https://whc.unesco.org/en/list/272/",
    region: "Europe and North America",
    description: "Brick Gothic church spires rise above the roofs of a Hanseatic port. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/272/"
  },
  {
    id: "neuschwanstein",
    name: "Neuschwanstein Castle",
    country: "Germany",
    code: "DEU",
    tier: "legendary",
    lat: 47.5575,
    lon: 10.749444,
    source: "https://whc.unesco.org/en/list/1726/",
    region: "Europe and North America",
    description: "Pale walls and slender turrets create a dramatic castle silhouette above forested slopes. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1726/"
  },
  {
    id: "pisa",
    name: "Leaning Tower of Pisa",
    country: "Italy",
    code: "ITA",
    tier: "epic",
    lat: 43.723056,
    lon: 10.396389,
    source: "https://whc.unesco.org/en/list/395/",
    region: "Europe and North America",
    description: "A leaning cylindrical bell tower is wrapped in successive rings of open arcades. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/395/"
  },
  {
    id: "florence",
    name: "Florence Cathedral",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 43.77306,
    lon: 11.25611,
    source: "https://whc.unesco.org/en/list/174/",
    region: "Europe and North America",
    description: "A great terracotta dome rises beside a slender marble-clad bell tower. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/174/"
  },
  {
    id: "venice",
    name: "Venice",
    country: "Italy",
    code: "ITA",
    tier: "epic",
    lat: 45.434306,
    lon: 12.338944,
    source: "https://whc.unesco.org/en/list/394/",
    region: "Europe and North America",
    description: "Palace facades and church domes face waterways within a lagoon city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/394/"
  },
  {
    id: "ravenna",
    name: "Ravenna Mosaics",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 44.414196,
    lon: 12.20465,
    source: "https://whc.unesco.org/en/list/788/",
    region: "Europe and North America",
    description: "Brick churches shelter richly coloured mosaics beneath simple exterior forms. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/788/"
  },
  {
    id: "assisi",
    name: "Basilica of Saint Francis",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 43.064583,
    lon: 12.5975,
    source: "https://whc.unesco.org/en/list/990/",
    region: "Europe and North America",
    description: "A hillside basilica joins stacked church spaces with a long arcaded convent. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/990/"
  },
  {
    id: "casteldelmonte",
    name: "Castel del Monte",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 41.084806,
    lon: 16.270944,
    source: "https://whc.unesco.org/en/list/398/",
    region: "Europe and North America",
    description: "An octagonal castle repeats its eight-sided geometry in towers at every corner. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/398/"
  },
  {
    id: "alberobello",
    name: "Alberobello Trulli",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 40.784282,
    lon: 17.237938,
    source: "https://whc.unesco.org/en/list/787/",
    region: "Europe and North America",
    description: "Whitewashed stone houses carry clusters of conical dry-stone roofs. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/787/"
  },
  {
    id: "sangimignano",
    name: "San Gimignano",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 43.46806,
    lon: 11.04167,
    source: "https://whc.unesco.org/en/list/550/",
    region: "Europe and North America",
    description: "Medieval stone towers rise at different heights above a compact Tuscan town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/550/"
  },
  {
    id: "siena",
    name: "Siena",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 43.318611,
    lon: 11.331667,
    source: "https://whc.unesco.org/en/list/717/",
    region: "Europe and North America",
    description: "A tall civic tower overlooks the sloping shell-shaped Piazza del Campo. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/717/"
  },
  {
    id: "paestum",
    name: "Paestum Temples",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 40.199352,
    lon: 15.281389,
    source: "https://whc.unesco.org/en/list/842/",
    region: "Europe and North America",
    description: "Rows of heavy Doric columns preserve the outlines of ancient Greek temples. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/842/"
  },
  {
    id: "pompeii",
    name: "Pompeii",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 40.77716,
    lon: 14.416029,
    source: "https://whc.unesco.org/en/list/829/",
    region: "Europe and North America",
    description: "Stone streets and roofless buildings reveal the plan of an ancient Roman town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/829/"
  },
  {
    id: "matera",
    name: "Sassi of Matera",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 40.666389,
    lon: 16.610278,
    source: "https://whc.unesco.org/en/list/670/",
    region: "Europe and North America",
    description: "Rock-cut dwellings and stone facades step down the sides of a ravine. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/670/"
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 40.633333,
    lon: 14.602778,
    source: "https://whc.unesco.org/en/list/830/",
    region: "Europe and North America",
    description: "Villages and cultivated terraces climb steep slopes above the Mediterranean. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/830/"
  },
  {
    id: "caserta",
    name: "Royal Palace of Caserta",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 41.07333,
    lon: 14.32639,
    source: "https://whc.unesco.org/en/list/549/",
    region: "Europe and North America",
    description: "A vast rectangular palace faces a long garden axis with water features. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/549/"
  },
  {
    id: "palermo",
    name: "Arab-Norman Palermo",
    country: "Italy",
    code: "ITA",
    tier: "common",
    lat: 38.100867,
    lon: 13.424527,
    source: "https://whc.unesco.org/en/list/1487/",
    region: "Europe and North America",
    description: "Domes and arcades combine architectural traditions across a Sicilian royal landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1487/"
  },
  {
    id: "etna",
    name: "Mount Etna",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 37.756111,
    lon: 14.996667,
    source: "https://whc.unesco.org/en/list/1427/",
    region: "Europe and North America",
    description: "A broad volcanic cone rises above the surrounding Sicilian landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1427/"
  },
  {
    id: "dolomites",
    name: "Dolomites",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 46.407685,
    lon: 11.818148,
    source: "https://whc.unesco.org/en/list/1237/",
    region: "Europe and North America",
    description: "Pale rock walls and sharply cut peaks form a distinctive mountain skyline. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1237/"
  },
  {
    id: "alhambra",
    name: "Alhambra",
    country: "Spain",
    code: "ESP",
    tier: "epic",
    lat: 37.176778,
    lon: -3.589917,
    source: "https://whc.unesco.org/en/list/314/",
    region: "Europe and North America",
    description: "Fortified walls enclose palace courtyards and gardens on a hill above Granada. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/314/"
  },
  {
    id: "segovia",
    name: "Aqueduct of Segovia",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 40.948472,
    lon: -4.11675,
    source: "https://whc.unesco.org/en/list/311/",
    region: "Europe and North America",
    description: "Two levels of granite arches carry a Roman aqueduct into the historic city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/311/"
  },
  {
    id: "santiago",
    name: "Santiago Cathedral",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 42.870917,
    lon: -8.550042,
    source: "https://whc.unesco.org/en/list/347/",
    region: "Europe and North America",
    description: "A monumental cathedral facade marks the destination of a long pilgrimage tradition. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/347/"
  },
  {
    id: "cordoba",
    name: "Mosque-Cathedral of C\xF3rdoba",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 37.879194,
    lon: -4.779722,
    source: "https://whc.unesco.org/en/list/313/",
    region: "Europe and North America",
    description: "Repeated columns and two-tiered arches create the mosque-cathedral's interior rhythm. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/313/"
  },
  {
    id: "toledo",
    name: "Toledo",
    country: "Spain",
    code: "ESP",
    tier: "common",
    lat: 39.856944,
    lon: -4.024444,
    source: "https://whc.unesco.org/en/list/379/",
    region: "Europe and North America",
    description: "Stone walls and clustered roofs occupy a hill above a bend in the river. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/379/"
  },
  {
    id: "avila",
    name: "Walls of \xC1vila",
    country: "Spain",
    code: "ESP",
    tier: "common",
    lat: 40.657098,
    lon: -4.698143,
    source: "https://whc.unesco.org/en/list/348/",
    region: "Europe and North America",
    description: "Round towers repeatedly interrupt a long circuit of medieval stone walls. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/348/"
  },
  {
    id: "cuenca",
    name: "Hanging Houses of Cuenca",
    country: "Spain",
    code: "ESP",
    tier: "common",
    lat: 40.07794,
    lon: -2.131365,
    source: "https://whc.unesco.org/en/list/781/",
    region: "Europe and North America",
    description: "Balconied houses stand along the edge of deep river gorges. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/781/"
  },
  {
    id: "seville",
    name: "Seville Cathedral and Alc\xE1zar",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 37.384713,
    lon: -5.992435,
    source: "https://whc.unesco.org/en/list/383/",
    region: "Europe and North America",
    description: "A great cathedral and royal palace bring towers and courtyards into one historic ensemble. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/383/"
  },
  {
    id: "burgos",
    name: "Burgos Cathedral",
    country: "Spain",
    code: "ESP",
    tier: "common",
    lat: 42.340733,
    lon: -3.704011,
    source: "https://whc.unesco.org/en/list/316/",
    region: "Europe and North America",
    description: "Lace-like Gothic spires frame a facade filled with sculpted openings. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/316/"
  },
  {
    id: "merida",
    name: "Roman Theatre of M\xE9rida",
    country: "Spain",
    code: "ESP",
    tier: "common",
    lat: 38.920458,
    lon: -6.330555,
    source: "https://whc.unesco.org/en/list/664/",
    region: "Europe and North America",
    description: "A semicircular theatre faces a reconstructed stage front with tall columns. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/664/"
  },
  {
    id: "lasmedulas",
    name: "Las M\xE9dulas",
    country: "Spain",
    code: "ESP",
    tier: "common",
    lat: 42.443681,
    lon: -6.789611,
    source: "https://whc.unesco.org/en/list/803/",
    region: "Europe and North America",
    description: "Red earth pinnacles reveal a landscape reshaped by Roman gold mining. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/803/"
  },
  {
    id: "batalha",
    name: "Batalha Monastery",
    country: "Portugal",
    code: "PRT",
    tier: "common",
    lat: 39.65778,
    lon: -8.82694,
    source: "https://whc.unesco.org/en/list/264/",
    region: "Europe and North America",
    description: "Carved Gothic stonework surrounds a monastery with quiet enclosed cloisters. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/264/"
  },
  {
    id: "alcobaca",
    name: "Alcoba\xE7a Monastery",
    country: "Portugal",
    code: "PRT",
    tier: "common",
    lat: 39.55,
    lon: -8.97667,
    source: "https://whc.unesco.org/en/list/505/",
    region: "Europe and North America",
    description: "A long church and restrained stone arcades form a Cistercian monastery. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/505/"
  },
  {
    id: "sintra",
    name: "Sintra",
    country: "Portugal",
    code: "PRT",
    tier: "rare",
    lat: 38.78333,
    lon: -9.41667,
    source: "https://whc.unesco.org/en/list/723/",
    region: "Europe and North America",
    description: "Palaces and castles rise among wooded hills in a romantic cultural landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/723/"
  },
  {
    id: "evora",
    name: "\xC9vora",
    country: "Portugal",
    code: "PRT",
    tier: "common",
    lat: 38.57306,
    lon: -7.90778,
    source: "https://whc.unesco.org/en/list/361/",
    region: "Europe and North America",
    description: "Roman columns and whitewashed buildings share the skyline of a historic town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/361/"
  },
  {
    id: "douro",
    name: "Douro Valley",
    country: "Portugal",
    code: "PRT",
    tier: "common",
    lat: 41.101667,
    lon: -7.798889,
    source: "https://whc.unesco.org/en/list/1046/",
    region: "Europe and North America",
    description: "Terraced vineyards follow steep hillsides beside a winding river. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1046/"
  },
  {
    id: "forthbridge",
    name: "Forth Bridge",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 56.001111,
    lon: -3.388889,
    source: "https://whc.unesco.org/en/list/1485/",
    region: "Europe and North America",
    description: "Three great red cantilever structures span a wide Scottish estuary. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1485/"
  },
  {
    id: "towerlondon",
    name: "Tower of London",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 51.508056,
    lon: -0.076111,
    source: "https://whc.unesco.org/en/list/488/",
    region: "Europe and North America",
    description: "A square central keep stands within successive rings of defensive walls. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/488/"
  },
  {
    id: "westminster",
    name: "Palace of Westminster",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 51.499,
    lon: -0.127,
    source: "https://whc.unesco.org/en/list/426/",
    region: "Europe and North America",
    description: "Gothic towers and long riverside facades line the edge of the Thames. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/426/"
  },
  {
    id: "bath",
    name: "Roman Baths of Bath",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 51.381306,
    lon: -2.359056,
    source: "https://whc.unesco.org/en/list/428/",
    region: "Europe and North America",
    description: "A columned bathing complex recalls the town's long use of thermal springs. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/428/"
  },
  {
    id: "durham",
    name: "Durham Cathedral",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 54.774722,
    lon: -1.576111,
    source: "https://whc.unesco.org/en/list/370/",
    region: "Europe and North America",
    description: "A Romanesque cathedral occupies a raised peninsula above the River Wear. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/370/"
  },
  {
    id: "canterbury",
    name: "Canterbury Cathedral",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 51.279019,
    lon: 1.088102,
    source: "https://whc.unesco.org/en/list/496/",
    region: "Europe and North America",
    description: "A long cathedral with a high crossing tower anchors a historic pilgrimage city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/496/"
  },
  {
    id: "blenheim",
    name: "Blenheim Palace",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 51.841944,
    lon: -1.361389,
    source: "https://whc.unesco.org/en/list/425/",
    region: "Europe and North America",
    description: "A monumental palace opens onto broad landscaped parkland. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/425/"
  },
  {
    id: "ironbridge",
    name: "Iron Bridge",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 52.626389,
    lon: -2.472778,
    source: "https://whc.unesco.org/en/list/371/",
    region: "Europe and North America",
    description: "A single cast-iron arch crosses a river in an early industrial landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/371/"
  },
  {
    id: "giantscauseway",
    name: "Giant's Causeway",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 55.240833,
    lon: -6.511667,
    source: "https://whc.unesco.org/en/list/369/",
    region: "Europe and North America",
    description: "Closely packed basalt columns step down toward the sea. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/369/"
  },
  {
    id: "meteora",
    name: "Meteora",
    country: "Greece",
    code: "GRC",
    tier: "rare",
    lat: 39.71667,
    lon: 21.63333,
    source: "https://whc.unesco.org/en/list/455/",
    region: "Europe and North America",
    description: "Monasteries stand atop narrow rock pillars above a broad valley. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/455/"
  },
  {
    id: "forbiddencity",
    name: "Forbidden City",
    country: "China",
    code: "CHN",
    tier: "legendary",
    lat: 39.917118,
    lon: 116.397151,
    source: "https://whc.unesco.org/en/list/439/",
    region: "Asia and the Pacific",
    description: "Successive courtyards and golden roofs extend along a monumental palace axis. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/439/"
  },
  {
    id: "templeheaven",
    name: "Temple of Heaven",
    country: "China",
    code: "CHN",
    tier: "epic",
    lat: 39.882167,
    lon: 116.406667,
    source: "https://whc.unesco.org/en/list/881/",
    region: "Asia and the Pacific",
    description: "A circular triple-roofed hall stands on concentric white stone terraces. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/881/"
  },
  {
    id: "summerpalace",
    name: "Summer Palace",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 39.996944,
    lon: 116.268028,
    source: "https://whc.unesco.org/en/list/880/",
    region: "Asia and the Pacific",
    description: "Pavilions and temples connect a garden hill with the waters of Kunming Lake. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/880/"
  },
  {
    id: "qufu",
    name: "Temple of Confucius at Qufu",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 35.613215,
    lon: 116.994561,
    source: "https://whc.unesco.org/en/list/704/",
    region: "Asia and the Pacific",
    description: "Courtyards and tiled halls preserve a ceremonial complex dedicated to Confucius. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/704/"
  },
  {
    id: "longmen",
    name: "Longmen Grottoes",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 34.466667,
    lon: 112.466667,
    source: "https://whc.unesco.org/en/list/1003/",
    region: "Asia and the Pacific",
    description: "Buddhist figures and cave openings are carved into limestone cliffs beside a river. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1003/"
  },
  {
    id: "mogao",
    name: "Mogao Caves",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 40.13333,
    lon: 94.81667,
    source: "https://whc.unesco.org/en/list/440/",
    region: "Asia and the Pacific",
    description: "Cave openings preserve Buddhist sanctuaries along a desert cliff face. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/440/"
  },
  {
    id: "potala",
    name: "Potala Palace",
    country: "China",
    code: "CHN",
    tier: "epic",
    lat: 29.652421,
    lon: 91.115109,
    source: "https://whc.unesco.org/en/list/707/",
    region: "Asia and the Pacific",
    description: "White and red palace walls climb a steep hill above Lhasa. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/707/"
  },
  {
    id: "jiuzhaigou",
    name: "Jiuzhaigou Valley",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 33.08333,
    lon: 103.91667,
    source: "https://whc.unesco.org/en/list/637/",
    region: "Asia and the Pacific",
    description: "Bright mountain lakes and waterfalls connect forested highland valleys. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/637/"
  },
  {
    id: "huanglong",
    name: "Huanglong",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 32.75417,
    lon: 103.82222,
    source: "https://whc.unesco.org/en/list/638/",
    region: "Asia and the Pacific",
    description: "Mineral deposits form terraces of small pools beneath mountain slopes. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/638/"
  },
  {
    id: "huangshan",
    name: "Mount Huangshan",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 30.145333,
    lon: 118.155083,
    source: "https://whc.unesco.org/en/list/547/",
    region: "Asia and the Pacific",
    description: "Granite peaks and pines emerge above drifting mountain clouds. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/547/"
  },
  {
    id: "wulingyuan",
    name: "Wulingyuan",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 29.33333,
    lon: 110.5,
    source: "https://whc.unesco.org/en/list/640/",
    region: "Asia and the Pacific",
    description: "Slender sandstone pillars rise in dense groups above wooded ravines. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/640/"
  },
  {
    id: "stoneforest",
    name: "South China Karst",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 26.638727,
    lon: 107.514352,
    source: "https://whc.unesco.org/en/list/1248/",
    region: "Asia and the Pacific",
    description: "Eroded limestone creates stone forests and steep karst formations. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1248/"
  },
  {
    id: "chengde",
    name: "Chengde Mountain Resort",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 40.98694,
    lon: 117.93833,
    source: "https://whc.unesco.org/en/list/703/",
    region: "Asia and the Pacific",
    description: "Lakeside pavilions and surrounding temples form a large imperial retreat. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/703/"
  },
  {
    id: "leshan",
    name: "Leshan Giant Buddha",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 29.544722,
    lon: 103.773333,
    source: "https://whc.unesco.org/en/list/779/",
    region: "Asia and the Pacific",
    description: "A seated Buddha is carved into a red sandstone cliff overlooking converging rivers. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/779/"
  },
  {
    id: "fujian",
    name: "Fujian Tulou",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 24.673222,
    lon: 117.076694,
    source: "https://whc.unesco.org/en/list/1113/",
    region: "Asia and the Pacific",
    description: "Large circular earthen houses enclose communal courtyards behind thick outer walls. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1113/"
  },
  {
    id: "kaiping",
    name: "Kaiping Diaolou",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 22.318688,
    lon: 112.57115,
    source: "https://whc.unesco.org/en/list/1112/",
    region: "Asia and the Pacific",
    description: "Tall fortified residences combine decorative facades with defensive upper floors. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1112/"
  },
  {
    id: "dujiangyan",
    name: "Dujiangyan Irrigation System",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 31.00167,
    lon: 103.60528,
    source: "https://whc.unesco.org/en/list/1001/",
    region: "Asia and the Pacific",
    description: "Channels and embankments divide river water in a long-lived irrigation system. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1001/"
  },
  {
    id: "grandcanal",
    name: "Grand Canal of China",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 34.066935,
    lon: 117.569462,
    source: "https://whc.unesco.org/en/list/1443/",
    region: "Asia and the Pacific",
    description: "A vast engineered waterway links canal towns through locks and river connections. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1443/"
  },
  {
    id: "suzhou",
    name: "Suzhou Gardens",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 31.294611,
    lon: 120.632417,
    source: "https://whc.unesco.org/en/list/813/",
    region: "Asia and the Pacific",
    description: "Pavilions and shaped rocks frame small ponds within carefully arranged gardens. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/813/"
  },
  {
    id: "lijiang",
    name: "Lijiang Old Town",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 26.911111,
    lon: 100.220833,
    source: "https://whc.unesco.org/en/list/811/",
    region: "Asia and the Pacific",
    description: "Tiled houses and small bridges follow waterways through a historic town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/811/"
  },
  {
    id: "shirakawa",
    name: "Shirakawa-go",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 36.336111,
    lon: 136.907431,
    source: "https://whc.unesco.org/en/list/734/",
    region: "Asia and the Pacific",
    description: "Steep thatched roofs rise above timber houses in a mountain village. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/734/"
  },
  {
    id: "himeji",
    name: "Himeji Castle",
    country: "Japan",
    code: "JPN",
    tier: "epic",
    lat: 34.833333,
    lon: 134.7,
    source: "https://whc.unesco.org/en/list/661/",
    region: "Asia and the Pacific",
    description: "Layered white keeps and curved tiled roofs dominate a fortified castle complex. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/661/"
  },
  {
    id: "horyuji",
    name: "Horyu-ji",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 34.618639,
    lon: 135.740181,
    source: "https://whc.unesco.org/en/list/660/",
    region: "Asia and the Pacific",
    description: "Timber halls and a five-storey pagoda preserve an early Buddhist temple layout. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/660/"
  },
  {
    id: "nikko",
    name: "Nikko Shrines",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 36.7475,
    lon: 139.610556,
    source: "https://whc.unesco.org/en/list/913/",
    region: "Asia and the Pacific",
    description: "Elaborately carved gates and sacred buildings stand among tall forest trees. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/913/"
  },
  {
    id: "itsukushima",
    name: "Itsukushima Shrine",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 34.294417,
    lon: 132.324639,
    source: "https://whc.unesco.org/en/list/776/",
    region: "Asia and the Pacific",
    description: "A great vermilion gate stands in tidal water before the shrine complex. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/776/"
  },
  {
    id: "kyoto",
    name: "Historic Kyoto",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 35.005006,
    lon: 135.755168,
    source: "https://whc.unesco.org/en/list/688/",
    region: "Asia and the Pacific",
    description: "Temple roofs and garden pavilions preserve the layered landscape of an old capital. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/688/"
  },
  {
    id: "nara",
    name: "Historic Nara",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 34.680992,
    lon: 135.816905,
    source: "https://whc.unesco.org/en/list/870/",
    region: "Asia and the Pacific",
    description: "Large timber temple halls and pagodas recall an early Japanese capital. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/870/"
  },
  {
    id: "hiraizumi",
    name: "Hiraizumi",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 38.992889,
    lon: 141.110056,
    source: "https://whc.unesco.org/en/list/1277/",
    region: "Asia and the Pacific",
    description: "Temple gardens use ponds and carefully arranged landforms to evoke a sacred landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1277/"
  },
  {
    id: "iwami",
    name: "Iwami Ginzan",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 35.106349,
    lon: 132.406151,
    source: "https://whc.unesco.org/en/list/1246/",
    region: "Asia and the Pacific",
    description: "Mine entrances and hillside settlements recall a mountain silver-mining landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1246/"
  },
  {
    id: "yakushima",
    name: "Yakushima",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 30.315,
    lon: 130.508611,
    source: "https://whc.unesco.org/en/list/662/",
    region: "Asia and the Pacific",
    description: "Ancient trees and dense evergreen forest cover a mountainous island. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/662/"
  },
  {
    id: "shiretoko",
    name: "Shiretoko",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 43.94944,
    lon: 144.96583,
    source: "https://whc.unesco.org/en/list/1193/",
    region: "Asia and the Pacific",
    description: "Forested mountains descend toward a cold sea shaped by seasonal ice. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1193/"
  },
  {
    id: "bulguksa",
    name: "Bulguksa and Seokguram",
    country: "South Korea",
    code: "KOR",
    tier: "rare",
    lat: 35.791498,
    lon: 129.349029,
    source: "https://whc.unesco.org/en/list/736/",
    region: "Asia and the Pacific",
    description: "Stone stairways and pagodas complement a Buddhist temple and granite grotto. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/736/"
  },
  {
    id: "hwaseong",
    name: "Hwaseong Fortress",
    country: "South Korea",
    code: "KOR",
    tier: "rare",
    lat: 37.27222,
    lon: 127.00833,
    source: "https://whc.unesco.org/en/list/817/",
    region: "Asia and the Pacific",
    description: "Stone and brick walls link gates and watchtowers around a planned fortress. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/817/"
  },
  {
    id: "changdeokgung",
    name: "Changdeokgung Palace",
    country: "South Korea",
    code: "KOR",
    tier: "rare",
    lat: 37.578889,
    lon: 126.991111,
    source: "https://whc.unesco.org/en/list/816/",
    region: "Asia and the Pacific",
    description: "Palace halls and gardens follow the natural slopes of a wooded site. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/816/"
  },
  {
    id: "haeinsa",
    name: "Haeinsa Janggyeong Panjeon",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 35.801672,
    lon: 128.098711,
    source: "https://whc.unesco.org/en/list/737/",
    region: "Asia and the Pacific",
    description: "Long timber repositories shelter the carved printing blocks of the Tripitaka Koreana. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/737/"
  },
  {
    id: "jongmyo",
    name: "Jongmyo Shrine",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 37.574722,
    lon: 126.993611,
    source: "https://whc.unesco.org/en/list/738/",
    region: "Asia and the Pacific",
    description: "An exceptionally long ceremonial hall faces a broad stone courtyard. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/738/"
  },
  {
    id: "jeju",
    name: "Jeju Volcanic Island",
    country: "South Korea",
    code: "KOR",
    tier: "rare",
    lat: 33.467011,
    lon: 126.740916,
    source: "https://whc.unesco.org/en/list/1264/",
    region: "Asia and the Pacific",
    description: "A shield volcano and lava formations reveal the origins of a volcanic island. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1264/"
  },
  {
    id: "sansa",
    name: "Sansa Mountain Monasteries",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 35.958929,
    lon: 127.887063,
    source: "https://whc.unesco.org/en/list/1562/",
    region: "Asia and the Pacific",
    description: "Temple halls are grouped around open courtyards within mountain landscapes. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1562/"
  },
  {
    id: "baekje",
    name: "Baekje Historic Areas",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 36.253924,
    lon: 127.005069,
    source: "https://whc.unesco.org/en/list/1477/",
    region: "Asia and the Pacific",
    description: "Stone pagodas and archaeological remains trace the cities of an ancient kingdom. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1477/"
  },
  {
    id: "agrafort",
    name: "Agra Fort",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 27.179806,
    lon: 78.021528,
    source: "https://whc.unesco.org/en/list/251/",
    region: "Asia and the Pacific",
    description: "Red sandstone walls enclose palaces and courts beside the Yamuna River. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/251/"
  },
  {
    id: "redfort",
    name: "Red Fort",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 28.655556,
    lon: 77.240833,
    source: "https://whc.unesco.org/en/list/231/",
    region: "Asia and the Pacific",
    description: "A long red sandstone wall guards ceremonial gateways and palace pavilions. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/231/"
  },
  {
    id: "qutb",
    name: "Qutb Minar",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 28.52583,
    lon: 77.18528,
    source: "https://whc.unesco.org/en/list/233/",
    region: "Asia and the Pacific",
    description: "A tapering fluted minaret rises above the remains of early Delhi monuments. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/233/"
  },
  {
    id: "humayun",
    name: "Humayun's Tomb",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 28.59333,
    lon: 77.25056,
    source: "https://whc.unesco.org/en/list/232/",
    region: "Asia and the Pacific",
    description: "A large domed tomb stands within a formally divided garden. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/232/"
  },
  {
    id: "fatehpur",
    name: "Fatehpur Sikri",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 27.097528,
    lon: 77.6665,
    source: "https://whc.unesco.org/en/list/255/",
    region: "Asia and the Pacific",
    description: "Red sandstone halls and large courtyards preserve a Mughal imperial city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/255/"
  },
  {
    id: "sanchi",
    name: "Sanchi Stupa",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 23.47944,
    lon: 77.73972,
    source: "https://whc.unesco.org/en/list/524/",
    region: "Asia and the Pacific",
    description: "Carved stone gateways surround a rounded Buddhist stupa. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/524/"
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 20.553111,
    lon: 75.70025,
    source: "https://whc.unesco.org/en/list/242/",
    region: "Asia and the Pacific",
    description: "Buddhist caves open along a curving rock face above a river valley. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/242/"
  },
  {
    id: "ellora",
    name: "Ellora Caves",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 20.02639,
    lon: 75.17917,
    source: "https://whc.unesco.org/en/list/243/",
    region: "Asia and the Pacific",
    description: "Rock-cut temples and monasteries are carved into a long basalt escarpment. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/243/"
  },
  {
    id: "elephanta",
    name: "Elephanta Caves",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 18.96667,
    lon: 72.93583,
    source: "https://whc.unesco.org/en/list/244/",
    region: "Asia and the Pacific",
    description: "Sculpted pillars and sacred figures occupy a rock-cut temple on an island. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/244/"
  },
  {
    id: "hampi",
    name: "Hampi",
    country: "India",
    code: "IND",
    tier: "epic",
    lat: 15.31444,
    lon: 76.47167,
    source: "https://whc.unesco.org/en/list/241/",
    region: "Asia and the Pacific",
    description: "Temple towers and stone halls rise among great granite boulders. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/241/"
  },
  {
    id: "konark",
    name: "Konark Sun Temple",
    country: "India",
    code: "IND",
    tier: "epic",
    lat: 19.8875,
    lon: 86.09472,
    source: "https://whc.unesco.org/en/list/246/",
    region: "Asia and the Pacific",
    description: "A carved stone temple takes the form of a monumental chariot with great wheels. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/246/"
  },
  {
    id: "mahabalipuram",
    name: "Mahabalipuram",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 12.621381,
    lon: 80.193785,
    source: "https://whc.unesco.org/en/list/249/",
    region: "Asia and the Pacific",
    description: "Rock-cut shrines and sculpted temples face the coast of the Bay of Bengal. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/249/"
  },
  {
    id: "khajuraho",
    name: "Khajuraho Temples",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 24.847193,
    lon: 79.930503,
    source: "https://whc.unesco.org/en/list/240/",
    region: "Asia and the Pacific",
    description: "Clusters of rising stone spires crown richly carved temple walls. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/240/"
  },
  {
    id: "chola",
    name: "Chola Temples",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 10.979518,
    lon: 79.312555,
    source: "https://whc.unesco.org/en/list/250/",
    region: "Asia and the Pacific",
    description: "Tall pyramidal temple towers reflect the monumental architecture of the Chola rulers. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/250/"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 26.924278,
    lon: 75.821861,
    source: "https://whc.unesco.org/en/list/1605/",
    region: "Asia and the Pacific",
    description: "Regular streets and palace facades form a carefully planned historic city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1605/"
  },
  {
    id: "jantarmantar",
    name: "Jantar Mantar",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 26.924722,
    lon: 75.825,
    source: "https://whc.unesco.org/en/list/1338/",
    region: "Asia and the Pacific",
    description: "Large masonry instruments turn astronomical measurement into monumental geometry. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1338/"
  },
  {
    id: "ranikivav",
    name: "Rani ki Vav",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 23.858889,
    lon: 72.101667,
    source: "https://whc.unesco.org/en/list/922/",
    region: "Asia and the Pacific",
    description: "Sculpted terraces descend through multiple levels into a deep stepwell. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/922/"
  },
  {
    id: "dholavira",
    name: "Dholavira",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 23.888408,
    lon: 70.213303,
    source: "https://whc.unesco.org/en/list/1645/",
    region: "Asia and the Pacific",
    description: "Stone walls and reservoirs preserve the ordered plan of a Harappan city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1645/"
  },
  {
    id: "mahabodhi",
    name: "Mahabodhi Temple",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 24.69528,
    lon: 84.99389,
    source: "https://whc.unesco.org/en/list/1056/",
    region: "Asia and the Pacific",
    description: "A tall pyramidal temple marks a central place in Buddhist tradition. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1056/"
  },
  {
    id: "kaziranga",
    name: "Kaziranga",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 26.666667,
    lon: 93.416667,
    source: "https://whc.unesco.org/en/list/337/",
    region: "Asia and the Pacific",
    description: "Wet grasslands and river habitats shelter a great population of one-horned rhinoceroses. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/337/"
  },
  {
    id: "sundarbans",
    name: "Sundarbans",
    country: "Bangladesh",
    code: "BGD",
    tier: "common",
    lat: 21.839118,
    lon: 89.472283,
    source: "https://whc.unesco.org/en/list/798/",
    region: "Asia and the Pacific",
    description: "Tidal creeks weave through an extensive mangrove forest in a great river delta. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/798/"
  },
  {
    id: "bagan",
    name: "Bagan",
    country: "Myanmar",
    code: "MMR",
    tier: "legendary",
    lat: 21.142753,
    lon: 94.90038,
    source: "https://whc.unesco.org/en/list/1588/",
    region: "Asia and the Pacific",
    description: "Thousands of brick temples and stupas spread across a plain beside the Ayeyarwady. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1588/"
  },
  {
    id: "ayutthaya",
    name: "Ayutthaya",
    country: "Thailand",
    code: "THA",
    tier: "rare",
    lat: 14.34778,
    lon: 100.56056,
    source: "https://whc.unesco.org/en/list/576/",
    region: "Asia and the Pacific",
    description: "Brick prangs and ruined temples mark the island of a former royal capital. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/576/"
  },
  {
    id: "sukhothai",
    name: "Sukhothai",
    country: "Thailand",
    code: "THA",
    tier: "common",
    lat: 16.980029,
    lon: 99.667878,
    source: "https://whc.unesco.org/en/list/574/",
    region: "Asia and the Pacific",
    description: "Temple ruins and lotus-shaped towers stand within a planned historic landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/574/"
  },
  {
    id: "vatphou",
    name: "Vat Phou",
    country: "Laos",
    code: "LAO",
    tier: "common",
    lat: 14.848333,
    lon: 105.822222,
    source: "https://whc.unesco.org/en/list/481/",
    region: "Asia and the Pacific",
    description: "A temple axis climbs from water basins toward a sanctuary on the mountain slope. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/481/"
  },
  {
    id: "plainjars",
    name: "Plain of Jars",
    country: "Laos",
    code: "LAO",
    tier: "common",
    lat: 19.419223,
    lon: 103.227518,
    source: "https://whc.unesco.org/en/list/1587/",
    region: "Asia and the Pacific",
    description: "Large stone jars stand in groups across the upland landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1587/"
  },
  {
    id: "persepolis",
    name: "Persepolis",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 29.93444,
    lon: 52.89028,
    source: "https://whc.unesco.org/en/list/114/",
    region: "Asia and the Pacific",
    description: "Tall columns and carved gateways rise from the terrace of an ancient royal complex. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/114/"
  },
  {
    id: "grandcanyon",
    name: "Grand Canyon",
    country: "United States",
    code: "USA",
    tier: "legendary",
    lat: 36.100833,
    lon: -112.090556,
    source: "https://whc.unesco.org/en/list/75/",
    region: "Europe and North America",
    description: "Layered rock walls descend toward a winding river in a vast canyon. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/75/"
  },
  {
    id: "yellowstone",
    name: "Yellowstone",
    country: "United States",
    code: "USA",
    tier: "epic",
    lat: 44.46056,
    lon: -110.82778,
    source: "https://whc.unesco.org/en/list/28/",
    region: "Europe and North America",
    description: "Geysers and hot springs punctuate a broad volcanic landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/28/"
  },
  {
    id: "yosemite",
    name: "Yosemite",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 37.746111,
    lon: -119.596667,
    source: "https://whc.unesco.org/en/list/308/",
    region: "Europe and North America",
    description: "Granite cliffs and waterfalls frame a deeply carved mountain valley. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/308/"
  },
  {
    id: "everglades",
    name: "Everglades",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 25.554444,
    lon: -80.996389,
    source: "https://whc.unesco.org/en/list/76/",
    region: "Europe and North America",
    description: "Broad shallow wetlands link sawgrass plains with coastal mangroves. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/76/"
  },
  {
    id: "mammothcave",
    name: "Mammoth Cave",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 37.187222,
    lon: -86.103056,
    source: "https://whc.unesco.org/en/list/150/",
    region: "Europe and North America",
    description: "An extensive limestone cave system unfolds in passages beneath wooded hills. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/150/"
  },
  {
    id: "carlsbad",
    name: "Carlsbad Caverns",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 32.137471,
    lon: -104.538096,
    source: "https://whc.unesco.org/en/list/721/",
    region: "Europe and North America",
    description: "Large underground chambers contain columns and hanging limestone formations. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/721/"
  },
  {
    id: "mesaverde",
    name: "Mesa Verde",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 37.261667,
    lon: -108.485556,
    source: "https://whc.unesco.org/en/list/27/",
    region: "Europe and North America",
    description: "Ancestral Pueblo dwellings occupy sheltered alcoves within sandstone cliffs. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/27/"
  },
  {
    id: "taos",
    name: "Taos Pueblo",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 36.438,
    lon: -105.546,
    source: "https://whc.unesco.org/en/list/492/",
    region: "Europe and North America",
    description: "Multi-storey earthen buildings rise in stepped clusters in a living Pueblo settlement. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/492/"
  },
  {
    id: "chaco",
    name: "Chaco Canyon",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 36.054239,
    lon: -107.956428,
    source: "https://whc.unesco.org/en/list/353/",
    region: "Europe and North America",
    description: "Great stone houses and circular ceremonial spaces preserve an ancestral settlement. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/353/"
  },
  {
    id: "sanantonio",
    name: "San Antonio Missions",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 29.322222,
    lon: -98.423472,
    source: "https://whc.unesco.org/en/list/1466/",
    region: "Europe and North America",
    description: "Mission churches and walled compounds follow a river landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1466/"
  },
  {
    id: "papahanaumokuakea",
    name: "Papah\u0101naumoku\u0101kea",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 25.34907,
    lon: -170.14582,
    source: "https://whc.unesco.org/en/list/1326/",
    region: "Europe and North America",
    description: "Low islands and coral reefs extend across a remote stretch of the Pacific. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1326/"
  },
  {
    id: "canadianrockies",
    name: "Canadian Rockies",
    country: "Canada",
    code: "CAN",
    tier: "rare",
    lat: 51.424722,
    lon: -116.479722,
    source: "https://whc.unesco.org/en/list/304/",
    region: "Europe and North America",
    description: "Rugged mountain ranges enclose glaciers and brightly coloured alpine lakes. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/304/"
  },
  {
    id: "dinosaurpark",
    name: "Dinosaur Provincial Park",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 50.767778,
    lon: -111.492222,
    source: "https://whc.unesco.org/en/list/71/",
    region: "Europe and North America",
    description: "Eroded badlands reveal layered rock and rich dinosaur fossil deposits. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/71/"
  },
  {
    id: "lunenburg",
    name: "Lunenburg",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 44.376111,
    lon: -64.309167,
    source: "https://whc.unesco.org/en/list/741/",
    region: "Europe and North America",
    description: "Colourful timber buildings line a historic North Atlantic fishing port. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/741/"
  },
  {
    id: "grosmorne",
    name: "Gros Morne",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 49.6125,
    lon: -57.531389,
    source: "https://whc.unesco.org/en/list/419/",
    region: "Europe and North America",
    description: "Steep fjord walls and exposed rock plateaus reveal a dramatic coastal landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/419/"
  },
  {
    id: "nahanni",
    name: "Nahanni",
    country: "Canada",
    code: "CAN",
    tier: "rare",
    lat: 61.547222,
    lon: -125.589444,
    source: "https://whc.unesco.org/en/list/24/",
    region: "Europe and North America",
    description: "A great waterfall and deep canyons interrupt a wild northern river. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/24/"
  },
  {
    id: "teotihuacan",
    name: "Teotihuacan",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 19.69167,
    lon: -98.84167,
    source: "https://whc.unesco.org/en/list/414/",
    region: "Latin America and the Caribbean",
    description: "Large stepped pyramids line a long ceremonial avenue in an ancient city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/414/"
  },
  {
    id: "palenque",
    name: "Palenque",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 17.48333,
    lon: -92.05,
    source: "https://whc.unesco.org/en/list/411/",
    region: "Latin America and the Caribbean",
    description: "Stepped temple platforms and a palace tower emerge from tropical forest. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/411/"
  },
  {
    id: "uxmal",
    name: "Uxmal",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 20.240072,
    lon: -89.66202,
    source: "https://whc.unesco.org/en/list/791/",
    region: "Latin America and the Caribbean",
    description: "A rounded pyramid and richly patterned stone facades mark a Maya ceremonial city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/791/"
  },
  {
    id: "montealban",
    name: "Monte Alb\xE1n",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 17.054134,
    lon: -96.7449,
    source: "https://whc.unesco.org/en/list/415/",
    region: "Latin America and the Caribbean",
    description: "Broad ceremonial terraces and stone platforms occupy a levelled hilltop. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/415/"
  },
  {
    id: "guanajuato",
    name: "Guanajuato",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 21.01694,
    lon: -101.25556,
    source: "https://whc.unesco.org/en/list/482/",
    region: "Latin America and the Caribbean",
    description: "Colourful buildings and narrow lanes climb the slopes of a historic mining town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/482/"
  },
  {
    id: "morelia",
    name: "Morelia",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 19.700927,
    lon: -101.190376,
    source: "https://whc.unesco.org/en/list/585/",
    region: "Latin America and the Caribbean",
    description: "Pink stone buildings and cathedral towers form a carefully ordered historic centre. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/585/"
  },
  {
    id: "campeche",
    name: "Campeche",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 19.84639,
    lon: -90.53722,
    source: "https://whc.unesco.org/en/list/895/",
    region: "Latin America and the Caribbean",
    description: "Sea walls and bastions protect a port lined with low colourful houses. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/895/"
  },
  {
    id: "calakmul",
    name: "Calakmul",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 18.053028,
    lon: -89.737283,
    source: "https://whc.unesco.org/en/list/1061/",
    region: "Latin America and the Caribbean",
    description: "Tall Maya pyramids rise above an extensive canopy of tropical forest. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1061/"
  },
  {
    id: "iguazu",
    name: "Iguaz\xFA Falls",
    country: "Argentina",
    code: "ARG",
    tier: "epic",
    lat: -25.577357,
    lon: -54.286073,
    source: "https://whc.unesco.org/en/list/303/",
    region: "Latin America and the Caribbean",
    description: "Many curtains of falling water span a broad forested river gorge. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/303/"
  },
  {
    id: "brasilia",
    name: "Bras\xEDlia",
    country: "Brazil",
    code: "BRA",
    tier: "rare",
    lat: -15.78333,
    lon: -47.9,
    source: "https://whc.unesco.org/en/list/445/",
    region: "Latin America and the Caribbean",
    description: "Sculptural civic buildings stand along the axes of a planned modern capital. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/445/"
  },
  {
    id: "ouropreto",
    name: "Ouro Preto",
    country: "Brazil",
    code: "BRA",
    tier: "common",
    lat: -20.388889,
    lon: -43.505556,
    source: "https://whc.unesco.org/en/list/124/",
    region: "Latin America and the Caribbean",
    description: "Baroque churches and tiled houses climb the steep streets of a former gold town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/124/"
  },
  {
    id: "salvador",
    name: "Salvador da Bahia",
    country: "Brazil",
    code: "BRA",
    tier: "common",
    lat: -12.972917,
    lon: -38.512981,
    source: "https://whc.unesco.org/en/list/309/",
    region: "Latin America and the Caribbean",
    description: "Colourful facades and church towers overlook the bay from a historic upper town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/309/"
  },
  {
    id: "centralamazon",
    name: "Central Amazon",
    country: "Brazil",
    code: "BRA",
    tier: "rare",
    lat: -2.28817,
    lon: -62.068366,
    source: "https://whc.unesco.org/en/list/998/",
    region: "Latin America and the Caribbean",
    description: "Seasonally flooded forests and broad channels form a great tropical river landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/998/"
  },
  {
    id: "losglaciares",
    name: "Los Glaciares",
    country: "Argentina",
    code: "ARG",
    tier: "rare",
    lat: -50,
    lon: -73.24944,
    source: "https://whc.unesco.org/en/list/145/",
    region: "Latin America and the Caribbean",
    description: "Great ice tongues flow from mountain icefields toward glacial lakes. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/145/"
  },
  {
    id: "quebrada",
    name: "Quebrada de Humahuaca",
    country: "Argentina",
    code: "ARG",
    tier: "common",
    lat: -23.199861,
    lon: -65.348861,
    source: "https://whc.unesco.org/en/list/1116/",
    region: "Latin America and the Caribbean",
    description: "Banded rock slopes frame a long valley used as a cultural route. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1116/"
  },
  {
    id: "nazca",
    name: "Nazca Lines",
    country: "Peru",
    code: "PER",
    tier: "rare",
    lat: -14.72583,
    lon: -75.14861,
    source: "https://whc.unesco.org/en/list/700/",
    region: "Latin America and the Caribbean",
    description: "Long lines and enormous animal figures are traced across an arid plateau. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/700/"
  },
  {
    id: "chanchan",
    name: "Chan Chan",
    country: "Peru",
    code: "PER",
    tier: "common",
    lat: -8.107836,
    lon: -79.074737,
    source: "https://whc.unesco.org/en/list/366/",
    region: "Latin America and the Caribbean",
    description: "High earthen walls enclose courtyards and geometric reliefs in a coastal city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/366/"
  },
  {
    id: "valparaiso",
    name: "Valpara\xEDso",
    country: "Chile",
    code: "CHL",
    tier: "common",
    lat: -33.040639,
    lon: -71.628,
    source: "https://whc.unesco.org/en/list/959/",
    region: "Latin America and the Caribbean",
    description: "Bright houses climb steep port hills served by historic hillside transport. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/959/"
  },
  {
    id: "chiloe",
    name: "Chilo\xE9 Churches",
    country: "Chile",
    code: "CHL",
    tier: "common",
    lat: -42.502479,
    lon: -73.578385,
    source: "https://whc.unesco.org/en/list/971/",
    region: "Latin America and the Caribbean",
    description: "Timber churches with slender towers reflect island building traditions. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/971/"
  },
  {
    id: "abusimbel",
    name: "Abu Simbel",
    country: "Egypt",
    code: "EGY",
    tier: "epic",
    lat: 22.337222,
    lon: 31.625806,
    source: "https://whc.unesco.org/en/list/88/",
    region: "Arab States",
    description: "Colossal seated figures guard a monumental temple carved into sandstone. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/88/"
  },
  {
    id: "thebes",
    name: "Ancient Thebes",
    country: "Egypt",
    code: "EGY",
    tier: "rare",
    lat: 25.716731,
    lon: 32.631102,
    source: "https://whc.unesco.org/en/list/87/",
    region: "Arab States",
    description: "Pylons and great columned halls preserve a monumental Nile-side sacred landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/87/"
  },
  {
    id: "historicairo",
    name: "Historic Cairo",
    country: "Egypt",
    code: "EGY",
    tier: "common",
    lat: 30.026056,
    lon: 31.257617,
    source: "https://whc.unesco.org/en/list/89/",
    region: "Arab States",
    description: "Domes and minarets rise above the close streets of a historic Islamic city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/89/"
  },
  {
    id: "carthage",
    name: "Carthage",
    country: "Tunisia",
    code: "TUN",
    tier: "common",
    lat: 36.851658,
    lon: 10.328122,
    source: "https://whc.unesco.org/en/list/37/",
    region: "Arab States",
    description: "Ancient walls and Roman remains overlook the Mediterranean coast. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/37/"
  },
  {
    id: "kairouan",
    name: "Great Mosque of Kairouan",
    country: "Tunisia",
    code: "TUN",
    tier: "rare",
    lat: 35.683444,
    lon: 10.095799,
    source: "https://whc.unesco.org/en/list/499/",
    region: "Arab States",
    description: "A square minaret watches over the broad courtyard of a historic mosque. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/499/"
  },
  {
    id: "dougga",
    name: "Dougga",
    country: "Tunisia",
    code: "TUN",
    tier: "common",
    lat: 36.42361,
    lon: 9.22028,
    source: "https://whc.unesco.org/en/list/794/",
    region: "Arab States",
    description: "A columned temple and theatre overlook the ruins of an ancient hill town. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/794/"
  },
  {
    id: "volubilis",
    name: "Volubilis",
    country: "Morocco",
    code: "MAR",
    tier: "common",
    lat: 34.07389,
    lon: -5.55694,
    source: "https://whc.unesco.org/en/list/836/",
    region: "Arab States",
    description: "A monumental arch and standing columns mark an ancient town among open fields. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/836/"
  },
  {
    id: "fes",
    name: "Fes Medina",
    country: "Morocco",
    code: "MAR",
    tier: "rare",
    lat: 34.058847,
    lon: -4.981486,
    source: "https://whc.unesco.org/en/list/170/",
    region: "Arab States",
    description: "Dense lanes and traditional buildings fill the walled heart of a historic city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/170/"
  },
  {
    id: "marrakesh",
    name: "Marrakesh Medina",
    country: "Morocco",
    code: "MAR",
    tier: "rare",
    lat: 31.622639,
    lon: -8.004444,
    source: "https://whc.unesco.org/en/list/331/",
    region: "Arab States",
    description: "A square minaret rises above red walls and the dense roofs of a historic medina. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/331/"
  },
  {
    id: "essaouira",
    name: "Essaouira",
    country: "Morocco",
    code: "MAR",
    tier: "common",
    lat: 31.504903,
    lon: -9.778486,
    source: "https://whc.unesco.org/en/list/753/",
    region: "Arab States",
    description: "Sea-facing ramparts and pale houses form a fortified Atlantic port. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/753/"
  },
  {
    id: "aksum",
    name: "Aksum Stelae",
    country: "Ethiopia",
    code: "ETH",
    tier: "rare",
    lat: 14.13019,
    lon: 38.71861,
    source: "https://whc.unesco.org/en/list/15/",
    region: "Africa",
    description: "Tall carved stone stelae preserve the monumental traces of an ancient kingdom. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/15/"
  },
  {
    id: "simien",
    name: "Simien Mountains",
    country: "Ethiopia",
    code: "ETH",
    tier: "common",
    lat: 13.183333,
    lon: 38.066667,
    source: "https://whc.unesco.org/en/list/9/",
    region: "Africa",
    description: "High escarpments and jagged peaks rise above deeply cut Ethiopian valleys. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/9/"
  },
  {
    id: "konso",
    name: "Konso Terraces",
    country: "Ethiopia",
    code: "ETH",
    tier: "common",
    lat: 5.3,
    lon: 37.4,
    source: "https://whc.unesco.org/en/list/1333/",
    region: "Africa",
    description: "Stone-walled terraces and fortified settlements shape a cultivated highland landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1333/"
  },
  {
    id: "victoriafalls",
    name: "Victoria Falls",
    country: "Zambia",
    code: "ZMB",
    tier: "epic",
    lat: -17.92453,
    lon: 25.85539,
    source: "https://whc.unesco.org/en/list/509/",
    region: "Africa",
    description: "A broad river plunges into a narrow gorge and sends mist above its edge. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/509/"
  },
  {
    id: "okavango",
    name: "Okavango Delta",
    country: "Botswana",
    code: "BWA",
    tier: "rare",
    lat: -19.283333,
    lon: 22.9,
    source: "https://whc.unesco.org/en/list/1432/",
    region: "Africa",
    description: "Seasonal floodwaters spread into channels and islands within an inland delta. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1432/"
  },
  {
    id: "serengeti",
    name: "Serengeti",
    country: "Tanzania",
    code: "TZA",
    tier: "rare",
    lat: -2.74,
    lon: 34.859,
    source: "https://whc.unesco.org/en/list/156/",
    region: "Africa",
    description: "Open grasslands support great moving herds across a vast savanna ecosystem. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/156/"
  },
  {
    id: "ngorongoro",
    name: "Ngorongoro",
    country: "Tanzania",
    code: "TZA",
    tier: "common",
    lat: -3.18722,
    lon: 35.54083,
    source: "https://whc.unesco.org/en/list/39/",
    region: "Africa",
    description: "A great volcanic crater encloses grasslands and lakes within a high rim. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/39/"
  },
  {
    id: "zanzibar",
    name: "Stone Town of Zanzibar",
    country: "Tanzania",
    code: "TZA",
    tier: "common",
    lat: -6.16306,
    lon: 39.18917,
    source: "https://whc.unesco.org/en/list/173/",
    region: "Africa",
    description: "Stone houses and carved doorways line the narrow streets of an Indian Ocean port. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/173/"
  },
  {
    id: "robbeneiland",
    name: "Robben Island",
    country: "South Africa",
    code: "ZAF",
    tier: "common",
    lat: -33.8,
    lon: 18.366667,
    source: "https://whc.unesco.org/en/list/916/",
    region: "Africa",
    description: "Low institutional buildings occupy an island with a history of imprisonment and resistance. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/916/"
  },
  {
    id: "tsodilo",
    name: "Tsodilo Hills",
    country: "Botswana",
    code: "BWA",
    tier: "common",
    lat: -18.75,
    lon: 21.733333,
    source: "https://whc.unesco.org/en/list/1021/",
    region: "Africa",
    description: "Rocky hills preserve a rich concentration of rock paintings in the Kalahari landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1021/"
  },
  {
    id: "samarra",
    name: "Spiral Minaret of Samarra",
    country: "Iraq",
    code: "IRQ",
    tier: "rare",
    lat: 34.233214,
    lon: 43.838049,
    source: "https://whc.unesco.org/en/list/276/",
    region: "Arab States",
    description: "A great spiral ramp winds around a monumental brick minaret. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/276/"
  },
  {
    id: "hatra",
    name: "Hatra",
    country: "Iraq",
    code: "IRQ",
    tier: "common",
    lat: 35.58806,
    lon: 42.71833,
    source: "https://whc.unesco.org/en/list/277/",
    region: "Arab States",
    description: "Great arched halls stand within the remains of a fortified ancient city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/277/"
  },
  {
    id: "babylon",
    name: "Babylon",
    country: "Iraq",
    code: "IRQ",
    tier: "rare",
    lat: 32.541969,
    lon: 44.420833,
    source: "https://whc.unesco.org/en/list/278/",
    region: "Arab States",
    description: "Mud-brick walls and monumental gateways recall a great Mesopotamian capital. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/278/"
  },
  {
    id: "choghazanbil",
    name: "Chogha Zanbil",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 32.00857,
    lon: 48.522118,
    source: "https://whc.unesco.org/en/list/113/",
    region: "Asia and the Pacific",
    description: "A stepped brick ziggurat anchors the remains of an ancient sacred complex. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/113/"
  },
  {
    id: "isfahan",
    name: "Naqsh-e Jahan Square",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 32.65745,
    lon: 51.677778,
    source: "https://whc.unesco.org/en/list/115/",
    region: "Asia and the Pacific",
    description: "Domes and grand arcades surround a broad royal square. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/115/"
  },
  {
    id: "pasargadae",
    name: "Pasargadae",
    country: "Iran",
    code: "IRN",
    tier: "common",
    lat: 30.19383,
    lon: 53.16729,
    source: "https://whc.unesco.org/en/list/1106/",
    region: "Asia and the Pacific",
    description: "A compact stone tomb rises on stepped courses within an ancient royal landscape. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1106/"
  },
  {
    id: "yazd",
    name: "Yazd",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 31.896111,
    lon: 54.364537,
    source: "https://whc.unesco.org/en/list/1544/",
    region: "Asia and the Pacific",
    description: "Earthen buildings and wind-catching towers form a city adapted to a desert climate. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1544/"
  },
  {
    id: "ephesus",
    name: "Library of Celsus at Ephesus",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "rare",
    lat: 37.941389,
    lon: 27.340556,
    source: "https://whc.unesco.org/en/list/1018/",
    region: "Europe and North America",
    description: "A two-storey columned library facade stands beside the streets of an ancient city. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1018/"
  },
  {
    id: "gobekli",
    name: "G\xF6bekli Tepe",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "rare",
    lat: 37.223242,
    lon: 38.922364,
    source: "https://whc.unesco.org/en/list/1572/",
    region: "Europe and North America",
    description: "T-shaped stone pillars stand in circular arrangements at a prehistoric site. Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1572/"
  }
];

// plugins/landmark-island/src/landmark-variants.ts
var enhancedId = (id) => `${id}+`;
var isEnhanced = (id) => id.endsWith("+");
var baseId = (id) => isEnhanced(id) ? id.slice(0, -1) : id;
var collectibleLandmarks = landmarks_default.flatMap((landmark) => [
  landmark,
  { ...landmark, id: enhancedId(landmark.id), name: `${landmark.name} +` }
]);
var byId = new Map(
  collectibleLandmarks.map((landmark) => [landmark.id, landmark])
);
var landmarkById = (id) => byId.get(id);

// plugins/landmark-island/src/world.ts
var SIZE = 40;
var WORLD_OFFSET = 8;
var MAX_LAND_LEVEL = 100;
var LEGACY_SIZE = 24;
var TILE_W = 80;
var TILE_H = 40;
var WORLD_W = SIZE * TILE_W + 160;
var WORLD_H = SIZE * TILE_H + 240;
var coordinates = [];
for (let row = 9; row < 15; row++)
  for (let col = 9; col < 15; col++) coordinates.push([col, row]);
for (let row = 0; row < LEGACY_SIZE; row++)
  for (let col = 0; col < LEGACY_SIZE; col++)
    if (!(col >= 9 && col < 15 && row >= 9 && row < 15))
      coordinates.push([col, row]);
var tiles = coordinates.map(([col, row], id) => {
  const edge = Math.hypot((col - 11.5) / 10.6, (row - 11.5) / 10.1);
  const coast = 1 + Math.sin(col * 0.8 + row * 0.5) * 0.045 + Math.cos(row * 1.1) * 0.035;
  const lake = Math.hypot(col - 17, row - 7) < 1.8;
  const land = id < 36 || edge < coast && !lake;
  const hill = Math.hypot(col - 6, row - 7);
  const height = id < 36 ? 16 : edge > 0.86 ? 4 : hill < 2.5 ? 48 : hill < 4.3 ? 32 : 16;
  const path = land && (col === 11 || col === 12 || row === 12 || row === 7 && col >= 6 && col <= 12 || col === 6 && row >= 7 && row <= 12);
  const kind = land && edge > 0.86 ? "sand" : path ? "path" : hill < 2.3 ? "rock" : "grass";
  const hash = (col * 17 + row * 31 + col * row * 7) % 31;
  const region = id < 36 ? "Landmark Commons" : hill < 4.3 ? "Pinecrest Heights" : col > 14 && row < 11 ? "Moonwater Lagoon" : row > 15 ? "Sunflower Meadows" : col < 8 ? "Whispering Woods" : "Coral Coast";
  const prop = !land || path || id < 36 || kind === "sand" ? null : col % 3 === 0 && row % 2 === 0 ? kind === "rock" || hash % 5 === 0 ? "rock" : col < 11 ? "pine" : "oak" : kind !== "rock" && hash < 8 ? "flowers" : null;
  return { id, col, row, land, height, kind, region, prop };
});
var legacyLand = new Set(tiles.filter((t) => t.land).map((t) => t.id));
function outerTile(col, row, id) {
  const edge = Math.hypot((col - 11.5) / 18.6, (row - 11.5) / 18.1);
  const coast = 1 + Math.sin(col * 0.8 + row * 0.5) * 0.025 + Math.cos(row * 1.1) * 0.02;
  const lake = Math.hypot(col - 17, row - 7) < 1.8;
  const land = edge < coast && !lake;
  const path = col === 11 || col === 12 || row === 12;
  const kind = edge > 0.94 ? "sand" : path ? "path" : "grass";
  return {
    id,
    col,
    row,
    land,
    height: edge > 0.94 ? 4 : 16,
    kind,
    region: row < 0 ? "Northern Orchard" : col > 23 ? "Sunrise Gardens" : row > 23 ? "Southern Wildflowers" : "Western Grove",
    prop: land && kind === "grass" && Math.abs(col * 17 + row * 31) % 13 === 0 ? "flowers" : null
  };
}
for (const tile of tiles)
  if (!tile.land) Object.assign(tile, outerTile(tile.col, tile.row, tile.id));
for (let row = -WORLD_OFFSET; row < SIZE - WORLD_OFFSET; row++)
  for (let col = -WORLD_OFFSET; col < SIZE - WORLD_OFFSET; col++)
    if (col < 0 || row < 0 || col >= LEGACY_SIZE || row >= LEGACY_SIZE)
      tiles.push(outerTile(col, row, tiles.length));
var landTiles = tiles.filter((t) => t.land);
var byCoordinate = new Map(tiles.map((t) => [`${t.col},${t.row}`, t.id]));
var at = (col, row) => byCoordinate.get(`${col},${row}`);
for (let pass = 0; pass < SIZE; pass++)
  for (const tile of landTiles) {
    for (const [dx, dy] of [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0]
    ]) {
      const id = at(tile.col + dx, tile.row + dy);
      if (id !== void 0 && tiles[id].land)
        tile.height = Math.min(tile.height, tiles[id].height + 16);
    }
  }
function isLand(id) {
  return Number.isInteger(id) && Boolean(tiles[id]?.land);
}
function neighbours(id) {
  const t = tiles[id];
  return t ? [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ].map(([x, y]) => at(t.col + x, t.row + y)).filter(
    (n) => n !== void 0 && isLand(n) && Math.abs(tiles[n].height - t.height) <= 16
  ) : [];
}
var solidProps = new Set(
  landTiles.filter((t) => t.prop === "pine" || t.prop === "oak" || t.prop === "rock").map((t) => t.id)
);
var expansionOrder = Array.from({ length: 36 }, (_, i) => i);
var reached = new Set(expansionOrder);
for (let i = 0; i < expansionOrder.length; i++) {
  for (const id of neighbours(expansionOrder[i])) {
    if (legacyLand.has(id) && !reached.has(id)) {
      reached.add(id);
      expansionOrder.push(id);
    }
  }
}
var legacyCount = expansionOrder.length;
for (let i = 0; i < expansionOrder.length; i++) {
  for (const id of neighbours(expansionOrder[i])) {
    if (!reached.has(id)) {
      reached.add(id);
      expansionOrder.push(id);
    }
  }
}
var expansionLevel = new Map(
  expansionOrder.map((id, rank) => [
    id,
    rank < 36 ? 0 : rank < legacyCount ? Math.ceil((rank - 35) * 12 / (legacyCount - 36)) : 12 + Math.ceil(
      (rank - legacyCount + 1) * (MAX_LAND_LEVEL - 12) / (landTiles.length - legacyCount)
    )
  ])
);
function landAtLevel(level) {
  return landTiles.filter(
    (t) => (expansionLevel.get(t.id) ?? Infinity) <= level
  );
}

// plugins/landmark-island/src/landmark-expansion.json
var landmark_expansion_default = [
  {
    id: "montsaintmichel",
    name: "Mont-Saint-Michel",
    nameKo: "\uBABD\uC0DD\uBBF8\uC178",
    shape: "island",
    feature: "An abbey crowns a rocky island above a broad tidal bay",
    featureKo: "\uBC14\uB2F7\uBB3C\uC774 \uB4DC\uB098\uB4DC\uB294 \uB9CC\uC758 \uBC14\uC704\uC12C \uC704\uB85C \uC218\uB3C4\uC6D0\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 1,
    color: "#b69772"
  },
  {
    id: "versailles",
    name: "Palace of Versailles",
    nameKo: "\uBCA0\uB974\uC0AC\uC720 \uAD81\uC804",
    shape: "palace",
    feature: "Long palace wings face formal gardens laid out along straight avenues",
    featureKo: "\uAE34 \uAD81\uC804 \uAC74\uBB3C \uC55E\uC5D0 \uACE7\uC740 \uAE38\uC744 \uB530\uB77C \uC815\uC6D0\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 2,
    color: "#c4ac88"
  },
  {
    id: "chartres",
    name: "Chartres Cathedral",
    nameKo: "\uC0E4\uB974\uD2B8\uB974 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "Two contrasting spires rise above a Gothic cathedral known for stained glass",
    featureKo: "\uC11C\uB85C \uB2E4\uB978 \uB450 \uCCA8\uD0D1\uACFC \uC2A4\uD14C\uC778\uB4DC\uAE00\uB77C\uC2A4\uAC00 \uACE0\uB515 \uC131\uB2F9\uC744 \uC7A5\uC2DD\uD569\uB2C8\uB2E4",
    seed: 3,
    color: "#aeb9a0"
  },
  {
    id: "amiens",
    name: "Amiens Cathedral",
    nameKo: "\uC544\uBBF8\uC575 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "A broad Gothic facade frames deep portals and a tall central nave",
    featureKo: "\uAE4A\uC740 \uCD9C\uC785\uAD6C\uC640 \uB192\uC740 \uC2E0\uB791\uC744 \uB113\uC740 \uACE0\uB515 \uC815\uBA74\uC774 \uAC10\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 4,
    color: "#bc8b70"
  },
  {
    id: "pontdugard",
    name: "Pont du Gard",
    nameKo: "\uD401\uB4A4\uAC00\uB974",
    shape: "aqueduct",
    feature: "Three tiers of Roman arches carry an aqueduct above the river",
    featureKo: "\uC138 \uCE35\uC758 \uB85C\uB9C8\uC2DD \uC544\uCE58\uAC00 \uAC15 \uC704\uB85C \uC218\uB85C\uB97C \uB5A0\uBC1B\uCE69\uB2C8\uB2E4",
    seed: 5,
    color: "#8baba4"
  },
  {
    id: "avignon",
    name: "Palace of the Popes",
    nameKo: "\uC544\uBE44\uB1FD \uAD50\uD669\uCCAD",
    shape: "fortress",
    feature: "Massive stone walls and square towers give the papal palace a fortified outline",
    featureKo: "\uB450\uAEBC\uC6B4 \uC11D\uBCBD\uACFC \uC0AC\uAC01 \uD0D1\uC774 \uAD50\uD669 \uAD81\uC804\uC744 \uC694\uC0C8\uCC98\uB7FC \uB458\uB7EC\uC309\uB2C8\uB2E4",
    seed: 6,
    color: "#d3b17c"
  },
  {
    id: "carcassonne",
    name: "Carcassonne",
    nameKo: "\uCE74\uB974\uCE74\uC190",
    shape: "castle",
    feature: "Conical tower roofs punctuate the double walls of a fortified medieval town",
    featureKo: "\uC6D0\uBFD4 \uC9C0\uBD95\uC758 \uD0D1\uB4E4\uC774 \uC911\uC138 \uB3C4\uC2DC\uC758 \uC774\uC911 \uC131\uBCBD\uC744 \uB530\uB77C \uB298\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 7,
    color: "#b7a28c"
  },
  {
    id: "fontainebleau",
    name: "Fontainebleau Palace",
    nameKo: "\uD401\uD150\uBE14\uB85C \uAD81\uC804",
    shape: "palace",
    feature: "Courtyards and steep roofs link successive wings of a royal residence",
    featureKo: "\uC548\uB730\uACFC \uAC00\uD30C\uB978 \uC9C0\uBD95\uC774 \uC655\uAD81\uC758 \uC5EC\uB7EC \uAC74\uBB3C\uC744 \uC774\uC5B4 \uC90D\uB2C8\uB2E4",
    seed: 8,
    color: "#829b8a"
  },
  {
    id: "albi",
    name: "Albi Cathedral",
    nameKo: "\uC54C\uBE44 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "A monumental brick cathedral has a solid exterior and a tall bell tower",
    featureKo: "\uAC70\uB300\uD55C \uBCBD\uB3CC \uC131\uB2F9\uC758 \uB2E8\uB2E8\uD55C \uC678\uBCBD \uC704\uB85C \uB192\uC740 \uC885\uD0D1\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 9,
    color: "#bca6a0"
  },
  {
    id: "reims",
    name: "Reims Cathedral",
    nameKo: "\uB7AD\uC2A4 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "A richly sculpted Gothic facade rises above three deep entrance portals",
    featureKo: "\uC138 \uAC1C\uC758 \uAE4A\uC740 \uBB38 \uC704\uB85C \uC870\uAC01\uC774 \uD48D\uBD80\uD55C \uACE0\uB515 \uC815\uBA74\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 10,
    color: "#b69772"
  },
  {
    id: "arles",
    name: "Arles Amphitheatre",
    nameKo: "\uC544\uB97C \uC6D0\uD615\uACBD\uAE30\uC7A5",
    shape: "arena",
    feature: "An oval Roman amphitheatre encloses an arena within repeated stone arches",
    featureKo: "\uD0C0\uC6D0\uD615 \uB85C\uB9C8 \uC6D0\uD615\uACBD\uAE30\uC7A5\uC758 \uC11D\uC870 \uC544\uCE58\uB4E4\uC774 \uACBD\uAE30\uC7A5\uC744 \uB458\uB7EC\uC309\uB2C8\uB2E4",
    seed: 11,
    color: "#c4ac88"
  },
  {
    id: "lehavre",
    name: "Le Havre",
    nameKo: "\uB974\uC544\uBE0C\uB974",
    shape: "modern",
    feature: "Concrete buildings and a high church tower define a rebuilt port city",
    featureKo: "\uCF58\uD06C\uB9AC\uD2B8 \uAC74\uBB3C\uACFC \uB192\uC740 \uAD50\uD68C \uD0D1\uC774 \uC7AC\uAC74\uB41C \uD56D\uAD6C \uB3C4\uC2DC\uC758 \uC724\uACFD\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 12,
    color: "#aeb9a0"
  },
  {
    id: "brugge",
    name: "Bruges",
    nameKo: "\uBE0C\uB93C\uD5E4",
    shape: "canal",
    feature: "Stepped gables and a belfry overlook canals in a medieval trading town",
    featureKo: "\uACC4\uB2E8\uC2DD \uBC15\uACF5\uACFC \uC885\uD0D1\uC774 \uC911\uC138 \uBB34\uC5ED \uB3C4\uC2DC\uC758 \uC6B4\uD558\uB97C \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 13,
    color: "#bc8b70"
  },
  {
    id: "brusselsplace",
    name: "Grand Place",
    nameKo: "\uBE0C\uB93C\uC140 \uADF8\uB791\uD50C\uB77C\uC2A4",
    shape: "square",
    feature: "Ornate guild houses surround a square watched over by a tall town-hall spire",
    featureKo: "\uC7A5\uC2DD\uC801\uC778 \uAE38\uB4DC \uAC74\uBB3C\uACFC \uB192\uC740 \uC2DC\uCCAD \uCCA8\uD0D1\uC774 \uAD11\uC7A5\uC744 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 14,
    color: "#8baba4"
  },
  {
    id: "tournai",
    name: "Tournai Cathedral",
    nameKo: "\uD22C\uB974\uB124 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "Five towers form the distinctive skyline of a great stone cathedral",
    featureKo: "\uB2E4\uC12F \uAC1C\uC758 \uD0D1\uC774 \uC11D\uC870 \uB300\uC131\uB2F9\uC758 \uB3C5\uD2B9\uD55C \uC724\uACFD\uC744 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 15,
    color: "#d3b17c"
  },
  {
    id: "cologne",
    name: "Cologne Cathedral",
    nameKo: "\uCFB0\uB978 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "Twin openwork spires rise above the long roof of a Gothic cathedral",
    featureKo: "\uACE0\uB515 \uB300\uC131\uB2F9\uC758 \uAE34 \uC9C0\uBD95 \uC704\uB85C \uC12C\uC138\uD55C \uC30D\uB465\uC774 \uCCA8\uD0D1\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 16,
    color: "#b7a28c"
  },
  {
    id: "aachen",
    name: "Aachen Cathedral",
    nameKo: "\uC544\uD5E8 \uB300\uC131\uB2F9",
    shape: "dome",
    feature: "An octagonal central chapel anchors a cathedral enlarged across many periods",
    featureKo: "\uD314\uAC01\uD615 \uC911\uC559 \uC608\uBC30\uB2F9\uC744 \uC911\uC2EC\uC73C\uB85C \uC5EC\uB7EC \uC2DC\uB300\uC758 \uAC74\uCD95\uBB3C\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 17,
    color: "#829b8a"
  },
  {
    id: "speyer",
    name: "Speyer Cathedral",
    nameKo: "\uC288\uD30C\uC774\uC5B4 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "Romanesque towers and a long nave give this cathedral a strong geometric rhythm",
    featureKo: "\uB85C\uB9C8\uB124\uC2A4\uD06C \uD0D1\uACFC \uAE34 \uC2E0\uB791\uC774 \uADDC\uCE59\uC801\uC778 \uC11D\uC870 \uC724\uACFD\uC744 \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 18,
    color: "#bca6a0"
  },
  {
    id: "wartburg",
    name: "Wartburg Castle",
    nameKo: "\uBC14\uB974\uD2B8\uBD80\uB974\uD06C \uC131",
    shape: "castle",
    feature: "A hilltop castle combines stone halls with timber-framed buildings",
    featureKo: "\uC5B8\uB355 \uC704 \uC131\uC5D0 \uC11D\uC870 \uD640\uACFC \uBAA9\uC870 \uACE8\uC870 \uAC74\uBB3C\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 19,
    color: "#b69772"
  },
  {
    id: "bamberg",
    name: "Bamberg",
    nameKo: "\uBC24\uBCA0\uB974\uD06C",
    shape: "town",
    feature: "Historic roofs and church towers rise across a town built on several hills",
    featureKo: "\uC5EC\uB7EC \uC5B8\uB355\uC5D0 \uAC78\uCE5C \uB3C4\uC2DC \uC704\uB85C \uC624\uB798\uB41C \uC9C0\uBD95\uACFC \uAD50\uD68C \uD0D1\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 20,
    color: "#c4ac88"
  },
  {
    id: "quedlinburg",
    name: "Quedlinburg",
    nameKo: "\uD06C\uBCA0\uB4E4\uB9B0\uBD80\uB974\uD06C",
    shape: "town",
    feature: "Timber-framed houses cluster below a castle hill and collegiate church",
    featureKo: "\uBAA9\uC870 \uACE8\uC870 \uC8FC\uD0DD\uB4E4\uC774 \uC131\uACFC \uAD50\uD68C\uAC00 \uC790\uB9AC\uD55C \uC5B8\uB355 \uC544\uB798 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 21,
    color: "#aeb9a0"
  },
  {
    id: "maulbronn",
    name: "Maulbronn Monastery",
    nameKo: "\uB9C8\uC6B8\uBE0C\uB860 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "Stone arcades surround quiet courtyards within a medieval monastery complex",
    featureKo: "\uC911\uC138 \uC218\uB3C4\uC6D0 \uC548\uC758 \uC870\uC6A9\uD55C \uC548\uB730\uC744 \uC11D\uC870 \uD68C\uB791\uC774 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 22,
    color: "#bc8b70"
  },
  {
    id: "volklingen",
    name: "V\xF6lklingen Ironworks",
    nameKo: "\uD448\uD074\uB9C1\uAC90 \uC81C\uCCA0\uC18C",
    shape: "industrial",
    feature: "Blast furnaces and elevated metal walkways preserve the outline of an ironworks",
    featureKo: "\uC6A9\uAD11\uB85C\uC640 \uB192\uC740 \uAE08\uC18D \uD1B5\uB85C\uAC00 \uC81C\uCCA0\uC18C\uC758 \uAD6C\uC870\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 23,
    color: "#8baba4"
  },
  {
    id: "zollverein",
    name: "Zollverein",
    nameKo: "\uCD10\uD398\uB77C\uC778 \uD0C4\uAD11",
    shape: "industrial",
    feature: "A geometric winding tower stands above the brick buildings of a coal mine",
    featureKo: "\uAE30\uD558\uD559\uC801\uC778 \uAD8C\uC591\uD0D1\uC774 \uD0C4\uAD11\uC758 \uBCBD\uB3CC \uAC74\uBB3C \uC704\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 24,
    color: "#d3b17c"
  },
  {
    id: "bauhaus",
    name: "Bauhaus Dessau",
    nameKo: "\uBC14\uC6B0\uD558\uC6B0\uC2A4 \uB370\uC0AC\uC6B0",
    shape: "modern",
    feature: "Glass curtain walls meet clean cubic volumes in a pioneering design school",
    featureKo: "\uC720\uB9AC \uCEE4\uD2BC\uC6D4\uACFC \uAC04\uACB0\uD55C \uC9C1\uC721\uBA74\uCCB4\uAC00 \uB514\uC790\uC778 \uD559\uAD50\uC758 \uC678\uD615\uC744 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 25,
    color: "#b7a28c"
  },
  {
    id: "lubeck",
    name: "L\xFCbeck",
    nameKo: "\uB93C\uBCA0\uD06C",
    shape: "town",
    feature: "Brick Gothic church spires rise above the roofs of a Hanseatic port",
    featureKo: "\uD55C\uC790 \uB3D9\uB9F9 \uD56D\uAD6C\uC758 \uC9C0\uBD95 \uC704\uB85C \uBCBD\uB3CC \uACE0\uB515 \uAD50\uD68C\uC758 \uCCA8\uD0D1\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 26,
    color: "#829b8a"
  },
  {
    id: "neuschwanstein",
    name: "Neuschwanstein Castle",
    nameKo: "\uB178\uC774\uC288\uBC18\uC288\uD0C0\uC778 \uC131",
    shape: "castle",
    feature: "Pale walls and slender turrets create a dramatic castle silhouette above forested slopes",
    featureKo: "\uC605\uC740 \uC131\uBCBD\uACFC \uAC00\uB290\uB2E4\uB780 \uD0D1\uB4E4\uC774 \uC232\uC774 \uC6B0\uAC70\uC9C4 \uBE44\uD0C8 \uC704\uC5D0 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 27,
    color: "#bca6a0"
  },
  {
    id: "pisa",
    name: "Leaning Tower of Pisa",
    nameKo: "\uD53C\uC0AC\uC758 \uC0AC\uD0D1",
    shape: "leaning",
    feature: "A leaning cylindrical bell tower is wrapped in successive rings of open arcades",
    featureKo: "\uAE30\uC6B8\uC5B4\uC9C4 \uC6D0\uD1B5\uD615 \uC885\uD0D1\uC744 \uC5EC\uB7EC \uCE35\uC758 \uC5F4\uB9B0 \uD68C\uB791\uC774 \uAC10\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 28,
    color: "#b69772"
  },
  {
    id: "florence",
    name: "Florence Cathedral",
    nameKo: "\uD53C\uB80C\uCCB4 \uB300\uC131\uB2F9",
    shape: "dome",
    feature: "A great terracotta dome rises beside a slender marble-clad bell tower",
    featureKo: "\uAC70\uB300\uD55C \uBD89\uC740 \uB3D4 \uC606\uC5D0 \uB300\uB9AC\uC11D\uC73C\uB85C \uC7A5\uC2DD\uD55C \uAC00\uB290\uB2E4\uB780 \uC885\uD0D1\uC774 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 29,
    color: "#c4ac88"
  },
  {
    id: "venice",
    name: "Venice",
    nameKo: "\uBCA0\uB124\uCE58\uC544",
    shape: "canal",
    feature: "Palace facades and church domes face waterways within a lagoon city",
    featureKo: "\uC11D\uD638 \uB3C4\uC2DC\uC758 \uBB3C\uAE38\uC744 \uB530\uB77C \uAD81\uC804 \uC815\uBA74\uACFC \uAD50\uD68C \uB3D4\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 30,
    color: "#aeb9a0"
  },
  {
    id: "ravenna",
    name: "Ravenna Mosaics",
    nameKo: "\uB77C\uBCA4\uB098 \uBAA8\uC790\uC774\uD06C \uC720\uC801",
    shape: "basilica",
    feature: "Brick churches shelter richly coloured mosaics beneath simple exterior forms",
    featureKo: "\uB2E8\uC815\uD55C \uBCBD\uB3CC \uAD50\uD68C \uC548\uC5D0 \uB2E4\uCC44\uB85C\uC6B4 \uBAA8\uC790\uC774\uD06C\uAC00 \uBCF4\uC874\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 31,
    color: "#bc8b70"
  },
  {
    id: "assisi",
    name: "Basilica of Saint Francis",
    nameKo: "\uC544\uC2DC\uC2DC \uC131 \uD504\uB780\uCCB4\uC2A4\uCF54 \uB300\uC131\uB2F9",
    shape: "basilica",
    feature: "A hillside basilica joins stacked church spaces with a long arcaded convent",
    featureKo: "\uC5B8\uB355 \uC704 \uB300\uC131\uB2F9\uC774 \uACB9\uCCD0\uC9C4 \uC608\uBC30 \uACF5\uAC04\uACFC \uAE34 \uC544\uCE58\uD615 \uC218\uB3C4\uC6D0\uC744 \uC5F0\uACB0\uD569\uB2C8\uB2E4",
    seed: 32,
    color: "#8baba4"
  },
  {
    id: "casteldelmonte",
    name: "Castel del Monte",
    nameKo: "\uCE74\uC2A4\uD154 \uB378 \uBAAC\uD14C",
    shape: "octagon",
    feature: "An octagonal castle repeats its eight-sided geometry in towers at every corner",
    featureKo: "\uD314\uAC01\uD615 \uC131\uC758 \uBAA8\uC11C\uB9AC\uB9C8\uB2E4 \uD314\uAC01 \uD0D1\uC774 \uAC19\uC740 \uAE30\uD558\uD559\uC744 \uBC18\uBCF5\uD569\uB2C8\uB2E4",
    seed: 33,
    color: "#d3b17c"
  },
  {
    id: "alberobello",
    name: "Alberobello Trulli",
    nameKo: "\uC54C\uBCA0\uB85C\uBCA8\uB85C \uD2B8\uB8F0\uB9AC",
    shape: "trulli",
    feature: "Whitewashed stone houses carry clusters of conical dry-stone roofs",
    featureKo: "\uD770 \uD68C\uCE60\uC744 \uD55C \uC11D\uC870 \uC8FC\uD0DD \uC704\uB85C \uC6D0\uBFD4\uD615 \uB3CC \uC9C0\uBD95\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 34,
    color: "#b7a28c"
  },
  {
    id: "sangimignano",
    name: "San Gimignano",
    nameKo: "\uC0B0\uC9C0\uBBF8\uB0D0\uB178",
    shape: "towers",
    feature: "Medieval stone towers rise at different heights above a compact Tuscan town",
    featureKo: "\uB192\uC774\uAC00 \uC81C\uAC01\uAC01\uC778 \uC911\uC138 \uC11D\uD0D1\uB4E4\uC774 \uD1A0\uC2A4\uCE74\uB098 \uC18C\uB3C4\uC2DC\uC758 \uC9C0\uBD95 \uC704\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 35,
    color: "#829b8a"
  },
  {
    id: "siena",
    name: "Siena",
    nameKo: "\uC2DC\uC5D0\uB098",
    shape: "square",
    feature: "A tall civic tower overlooks the sloping shell-shaped Piazza del Campo",
    featureKo: "\uB192\uC740 \uC2DC\uCCAD \uD0D1\uC774 \uC870\uAC1C\uAECD\uB370\uAE30 \uBAA8\uC591\uC73C\uB85C \uAE30\uC6B8\uC5B4\uC9C4 \uCE84\uD3EC \uAD11\uC7A5\uC744 \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 36,
    color: "#bca6a0"
  },
  {
    id: "paestum",
    name: "Paestum Temples",
    nameKo: "\uD30C\uC5D0\uC2A4\uD23C \uC2E0\uC804",
    shape: "columns",
    feature: "Rows of heavy Doric columns preserve the outlines of ancient Greek temples",
    featureKo: "\uAD75\uC740 \uB3C4\uB9AC\uC2A4\uC2DD \uAE30\uB465\uB4E4\uC774 \uACE0\uB300 \uADF8\uB9AC\uC2A4 \uC2E0\uC804\uC758 \uC724\uACFD\uC744 \uB0A8\uAE30\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 37,
    color: "#b69772"
  },
  {
    id: "pompeii",
    name: "Pompeii",
    nameKo: "\uD3FC\uD398\uC774",
    shape: "ruins",
    feature: "Stone streets and roofless buildings reveal the plan of an ancient Roman town",
    featureKo: "\uB3CC\uAE38\uACFC \uC9C0\uBD95\uC774 \uC0AC\uB77C\uC9C4 \uAC74\uBB3C\uB4E4\uC774 \uACE0\uB300 \uB85C\uB9C8 \uB3C4\uC2DC\uC758 \uAD6C\uC870\uB97C \uB4DC\uB7EC\uB0C5\uB2C8\uB2E4",
    seed: 38,
    color: "#c4ac88"
  },
  {
    id: "matera",
    name: "Sassi of Matera",
    nameKo: "\uB9C8\uD14C\uB77C \uB3D9\uAD74 \uC8FC\uAC70\uC9C0",
    shape: "cliff",
    feature: "Rock-cut dwellings and stone facades step down the sides of a ravine",
    featureKo: "\uBC14\uC704\uB97C \uD30C\uB0B8 \uC9D1\uACFC \uC11D\uC870 \uC815\uBA74\uC774 \uACC4\uACE1\uC758 \uBE44\uD0C8\uC744 \uB530\uB77C \uCE35\uCE35\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 39,
    color: "#aeb9a0"
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    nameKo: "\uC544\uB9D0\uD53C \uD574\uC548",
    shape: "coast",
    feature: "Villages and cultivated terraces climb steep slopes above the Mediterranean",
    featureKo: "\uB9C8\uC744\uACFC \uACBD\uC791 \uD14C\uB77C\uC2A4\uAC00 \uC9C0\uC911\uD574\uB97C \uB9C8\uC8FC\uD55C \uAC00\uD30C\uB978 \uBE44\uD0C8 \uC704\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 40,
    color: "#bc8b70"
  },
  {
    id: "caserta",
    name: "Royal Palace of Caserta",
    nameKo: "\uCE74\uC138\uB974\uD0C0 \uC655\uAD81",
    shape: "palace",
    feature: "A vast rectangular palace faces a long garden axis with water features",
    featureKo: "\uAC70\uB300\uD55C \uC9C1\uC0AC\uAC01\uD615 \uC655\uAD81 \uC55E\uC5D0 \uBB3C\uAE38\uC744 \uAC16\uCD98 \uAE34 \uC815\uC6D0 \uCD95\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 41,
    color: "#8baba4"
  },
  {
    id: "palermo",
    name: "Arab-Norman Palermo",
    nameKo: "\uD314\uB808\uB974\uBAA8 \uC544\uB78D \uB178\uB974\uB9CC \uC720\uC801",
    shape: "dome",
    feature: "Domes and arcades combine architectural traditions across a Sicilian royal landscape",
    featureKo: "\uB3D4\uACFC \uD68C\uB791\uC5D0 \uC5EC\uB7EC \uAC74\uCD95 \uC804\uD1B5\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uC2DC\uCE60\uB9AC\uC544 \uC655\uC2E4 \uC720\uC801\uC785\uB2C8\uB2E4",
    seed: 42,
    color: "#d3b17c"
  },
  {
    id: "etna",
    name: "Mount Etna",
    nameKo: "\uC5D0\uD2B8\uB098\uC0B0",
    shape: "volcano",
    feature: "A broad volcanic cone rises above the surrounding Sicilian landscape",
    featureKo: "\uB113\uC740 \uD654\uC0B0\uCCB4\uAC00 \uC2DC\uCE60\uB9AC\uC544\uC758 \uC8FC\uBCC0 \uD48D\uACBD \uC704\uB85C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 43,
    color: "#b7a28c"
  },
  {
    id: "dolomites",
    name: "Dolomites",
    nameKo: "\uB3CC\uB85C\uBBF8\uD2F0",
    shape: "peaks",
    feature: "Pale rock walls and sharply cut peaks form a distinctive mountain skyline",
    featureKo: "\uC605\uC740 \uC554\uBCBD\uACFC \uB0A0\uCE74\uB86D\uAC8C \uAC08\uB77C\uC9C4 \uBD09\uC6B0\uB9AC\uB4E4\uC774 \uC0B0\uC545 \uD48D\uACBD\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 44,
    color: "#829b8a"
  },
  {
    id: "alhambra",
    name: "Alhambra",
    nameKo: "\uC54C\uB78C\uBE0C\uB77C \uAD81\uC804",
    shape: "palace",
    feature: "Fortified walls enclose palace courtyards and gardens on a hill above Granada",
    featureKo: "\uADF8\uB77C\uB098\uB2E4\uC758 \uC5B8\uB355 \uC704 \uC131\uBCBD \uC548\uC5D0 \uAD81\uC804\uC758 \uC548\uB730\uACFC \uC815\uC6D0\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 45,
    color: "#bca6a0"
  },
  {
    id: "segovia",
    name: "Aqueduct of Segovia",
    nameKo: "\uC138\uACE0\uBE44\uC544 \uC218\uB3C4\uAD50",
    shape: "aqueduct",
    feature: "Two levels of granite arches carry a Roman aqueduct into the historic city",
    featureKo: "\uB450 \uCE35\uC758 \uD654\uAC15\uC554 \uC544\uCE58\uAC00 \uB85C\uB9C8 \uC218\uB3C4\uAD50\uB97C \uC624\uB798\uB41C \uB3C4\uC2EC\uC73C\uB85C \uC774\uB055\uB2C8\uB2E4",
    seed: 46,
    color: "#b69772"
  },
  {
    id: "santiago",
    name: "Santiago Cathedral",
    nameKo: "\uC0B0\uD2F0\uC544\uACE0 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "A monumental cathedral facade marks the destination of a long pilgrimage tradition",
    featureKo: "\uAC70\uB300\uD55C \uB300\uC131\uB2F9 \uC815\uBA74\uC774 \uC624\uB79C \uC21C\uB840 \uC804\uD1B5\uC758 \uBAA9\uC801\uC9C0\uB97C \uD45C\uC2DC\uD569\uB2C8\uB2E4",
    seed: 47,
    color: "#c4ac88"
  },
  {
    id: "cordoba",
    name: "Mosque-Cathedral of C\xF3rdoba",
    nameKo: "\uCF54\uB974\uB3C4\uBC14 \uBA54\uC2A4\uD0A4\uD0C0",
    shape: "arcades",
    feature: "Repeated columns and two-tiered arches create the mosque-cathedral's interior rhythm",
    featureKo: "\uBC18\uBCF5\uB418\uB294 \uAE30\uB465\uACFC \uC774\uC911 \uC544\uCE58\uAC00 \uBAA8\uC2A4\uD06C \uB300\uC131\uB2F9\uC758 \uB0B4\uBD80 \uB9AC\uB4EC\uC744 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 48,
    color: "#aeb9a0"
  },
  {
    id: "toledo",
    name: "Toledo",
    nameKo: "\uD1A8\uB808\uB3C4",
    shape: "town",
    feature: "Stone walls and clustered roofs occupy a hill above a bend in the river",
    featureKo: "\uAC15\uC774 \uAD7D\uC774\uCE58\uB294 \uC5B8\uB355 \uC704\uC5D0 \uC11D\uBCBD\uACFC \uBE7D\uBE7D\uD55C \uC9C0\uBD95\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 49,
    color: "#bc8b70"
  },
  {
    id: "avila",
    name: "Walls of \xC1vila",
    nameKo: "\uC544\uBE4C\uB77C \uC131\uBCBD",
    shape: "fortress",
    feature: "Round towers repeatedly interrupt a long circuit of medieval stone walls",
    featureKo: "\uC911\uC138 \uC11D\uC870 \uC131\uBCBD\uC744 \uB530\uB77C \uB465\uADFC \uD0D1\uB4E4\uC774 \uADDC\uCE59\uC801\uC73C\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 50,
    color: "#8baba4"
  },
  {
    id: "cuenca",
    name: "Hanging Houses of Cuenca",
    nameKo: "\uCFE0\uC5E5\uCE74 \uC808\uBCBD \uC8FC\uD0DD",
    shape: "cliff",
    feature: "Balconied houses stand along the edge of deep river gorges",
    featureKo: "\uBC1C\uCF54\uB2C8\uAC00 \uB2EC\uB9B0 \uC9D1\uB4E4\uC774 \uAE4A\uC740 \uAC15 \uACC4\uACE1\uC758 \uAC00\uC7A5\uC790\uB9AC\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 51,
    color: "#d3b17c"
  },
  {
    id: "seville",
    name: "Seville Cathedral and Alc\xE1zar",
    nameKo: "\uC138\uBE44\uC57C \uB300\uC131\uB2F9\uACFC \uC54C\uCE74\uC0AC\uB974",
    shape: "palace",
    feature: "A great cathedral and royal palace bring towers and courtyards into one historic ensemble",
    featureKo: "\uAC70\uB300\uD55C \uB300\uC131\uB2F9\uACFC \uC655\uAD81\uC758 \uD0D1\uACFC \uC548\uB730\uC774 \uD558\uB098\uC758 \uC5ED\uC0AC \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 52,
    color: "#b7a28c"
  },
  {
    id: "burgos",
    name: "Burgos Cathedral",
    nameKo: "\uBD80\uB974\uACE0\uC2A4 \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "Lace-like Gothic spires frame a facade filled with sculpted openings",
    featureKo: "\uB808\uC774\uC2A4\uCC98\uB7FC \uC12C\uC138\uD55C \uACE0\uB515 \uCCA8\uD0D1\uC774 \uC870\uAC01\uC73C\uB85C \uC7A5\uC2DD\uD55C \uC815\uBA74\uC744 \uAC10\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 53,
    color: "#829b8a"
  },
  {
    id: "merida",
    name: "Roman Theatre of M\xE9rida",
    nameKo: "\uBA54\uB9AC\uB2E4 \uB85C\uB9C8 \uADF9\uC7A5",
    shape: "theatre",
    feature: "A semicircular theatre faces a reconstructed stage front with tall columns",
    featureKo: "\uBC18\uC6D0\uD615 \uADF9\uC7A5\uC774 \uB192\uC740 \uAE30\uB465\uC73C\uB85C \uC774\uB8E8\uC5B4\uC9C4 \uBB34\uB300 \uC815\uBA74\uC744 \uB9C8\uC8FC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 54,
    color: "#bca6a0"
  },
  {
    id: "lasmedulas",
    name: "Las M\xE9dulas",
    nameKo: "\uB77C\uC2A4 \uBA54\uB458\uB77C\uC2A4",
    shape: "redrocks",
    feature: "Red earth pinnacles reveal a landscape reshaped by Roman gold mining",
    featureKo: "\uBD89\uC740 \uD759 \uBD09\uC6B0\uB9AC\uB4E4\uC774 \uB85C\uB9C8 \uC2DC\uB300 \uAE08 \uCC44\uAD74\uB85C \uBC14\uB010 \uD48D\uACBD\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 55,
    color: "#b69772"
  },
  {
    id: "batalha",
    name: "Batalha Monastery",
    nameKo: "\uBC14\uD0C8\uB7B4 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "Carved Gothic stonework surrounds a monastery with quiet enclosed cloisters",
    featureKo: "\uC815\uAD50\uD55C \uACE0\uB515 \uC11D\uC870 \uC7A5\uC2DD\uC774 \uC870\uC6A9\uD55C \uD68C\uB791\uC744 \uAC16\uCD98 \uC218\uB3C4\uC6D0\uC744 \uAC10\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 56,
    color: "#c4ac88"
  },
  {
    id: "alcobaca",
    name: "Alcoba\xE7a Monastery",
    nameKo: "\uC54C\uCF54\uBC14\uC0AC \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A long church and restrained stone arcades form a Cistercian monastery",
    featureKo: "\uAE34 \uAD50\uD68C\uC640 \uC808\uC81C\uB41C \uC11D\uC870 \uD68C\uB791\uC774 \uC2DC\uD1A0\uD68C \uC218\uB3C4\uC6D0\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 57,
    color: "#aeb9a0"
  },
  {
    id: "sintra",
    name: "Sintra",
    nameKo: "\uC2E0\uD2B8\uB77C",
    shape: "castle",
    feature: "Palaces and castles rise among wooded hills in a romantic cultural landscape",
    featureKo: "\uB0AD\uB9CC\uC801\uC778 \uBB38\uD654 \uACBD\uAD00 \uC18D \uC232\uC774 \uC6B0\uAC70\uC9C4 \uC5B8\uB355\uC5D0 \uAD81\uC804\uACFC \uC131\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 58,
    color: "#bc8b70"
  },
  {
    id: "evora",
    name: "\xC9vora",
    nameKo: "\uC5D0\uBCF4\uB77C",
    shape: "columns",
    feature: "Roman columns and whitewashed buildings share the skyline of a historic town",
    featureKo: "\uB85C\uB9C8 \uC2DC\uB300 \uAE30\uB465\uACFC \uD770 \uD68C\uCE60 \uAC74\uBB3C\uB4E4\uC774 \uC624\uB798\uB41C \uB3C4\uC2DC\uC758 \uC724\uACFD\uC744 \uD568\uAED8 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 59,
    color: "#8baba4"
  },
  {
    id: "douro",
    name: "Douro Valley",
    nameKo: "\uB3C4\uB8E8 \uACC4\uACE1",
    shape: "terraces",
    feature: "Terraced vineyards follow steep hillsides beside a winding river",
    featureKo: "\uACC4\uB2E8\uC2DD \uD3EC\uB3C4\uBC2D\uC774 \uAD7D\uC774\uCE58\uB294 \uAC15 \uC606\uC758 \uAC00\uD30C\uB978 \uC5B8\uB355\uC744 \uB530\uB77C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 60,
    color: "#d3b17c"
  },
  {
    id: "forthbridge",
    name: "Forth Bridge",
    nameKo: "\uD3EC\uC2A4\uAD50",
    shape: "bridge",
    feature: "Three great red cantilever structures span a wide Scottish estuary",
    featureKo: "\uAC70\uB300\uD55C \uBD89\uC740 \uCE94\uD2F8\uB808\uBC84 \uAD6C\uC870 \uC138 \uAC1C\uAC00 \uC2A4\uCF54\uD2C0\uB79C\uB4DC\uC758 \uB113\uC740 \uD558\uAD6C\uB97C \uAC74\uB119\uB2C8\uB2E4",
    seed: 61,
    color: "#b7a28c"
  },
  {
    id: "towerlondon",
    name: "Tower of London",
    nameKo: "\uB7F0\uB358\uD0D1",
    shape: "fortress",
    feature: "A square central keep stands within successive rings of defensive walls",
    featureKo: "\uC0AC\uAC01\uD615 \uC911\uC559 \uC131\uCC44\uB97C \uC5EC\uB7EC \uACB9\uC758 \uBC29\uC5B4 \uC131\uBCBD\uC774 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 62,
    color: "#829b8a"
  },
  {
    id: "westminster",
    name: "Palace of Westminster",
    nameKo: "\uC6E8\uC2A4\uD2B8\uBBFC\uC2A4\uD130 \uAD81\uC804",
    shape: "palace",
    feature: "Gothic towers and long riverside facades line the edge of the Thames",
    featureKo: "\uACE0\uB515 \uD0D1\uACFC \uAE34 \uC815\uBA74\uC774 \uD15C\uC2A4\uAC15 \uAC00\uC7A5\uC790\uB9AC\uB97C \uB530\uB77C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 63,
    color: "#bca6a0"
  },
  {
    id: "bath",
    name: "Roman Baths of Bath",
    nameKo: "\uBC14\uC2A4 \uB85C\uB9C8 \uBAA9\uC695\uC7A5",
    shape: "arcades",
    feature: "A columned bathing complex recalls the town's long use of thermal springs",
    featureKo: "\uAE30\uB465\uC774 \uB298\uC5B4\uC120 \uBAA9\uC695\uC7A5\uC774 \uC628\uCC9C\uC744 \uC774\uC6A9\uD574 \uC628 \uB3C4\uC2DC\uC758 \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 64,
    color: "#b69772"
  },
  {
    id: "durham",
    name: "Durham Cathedral",
    nameKo: "\uB354\uB7FC \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "A Romanesque cathedral occupies a raised peninsula above the River Wear",
    featureKo: "\uB85C\uB9C8\uB124\uC2A4\uD06C \uB300\uC131\uB2F9\uC774 \uC6E8\uC5B4\uAC15 \uC704\uC758 \uB192\uC740 \uBC18\uB3C4 \uC9C0\uD615\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 65,
    color: "#c4ac88"
  },
  {
    id: "canterbury",
    name: "Canterbury Cathedral",
    nameKo: "\uCE94\uD130\uBCA0\uB9AC \uB300\uC131\uB2F9",
    shape: "cathedral",
    feature: "A long cathedral with a high crossing tower anchors a historic pilgrimage city",
    featureKo: "\uB192\uC740 \uAD50\uCC28\uBD80 \uD0D1\uC744 \uAC16\uCD98 \uAE34 \uB300\uC131\uB2F9\uC774 \uC624\uB798\uB41C \uC21C\uB840 \uB3C4\uC2DC\uC758 \uC911\uC2EC\uC5D0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 66,
    color: "#aeb9a0"
  },
  {
    id: "blenheim",
    name: "Blenheim Palace",
    nameKo: "\uBE14\uB808\uB118 \uAD81\uC804",
    shape: "palace",
    feature: "A monumental palace opens onto broad landscaped parkland",
    featureKo: "\uAE30\uB150\uBE44\uC801\uC778 \uAD81\uC804 \uC55E\uC5D0 \uB113\uC740 \uD48D\uACBD\uC2DD \uACF5\uC6D0\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 67,
    color: "#bc8b70"
  },
  {
    id: "ironbridge",
    name: "Iron Bridge",
    nameKo: "\uC544\uC774\uC5B8\uBE0C\uB9AC\uC9C0",
    shape: "bridge",
    feature: "A single cast-iron arch crosses a river in an early industrial landscape",
    featureKo: "\uCD08\uAE30 \uC0B0\uC5C5 \uACBD\uAD00 \uC18D \uAC15 \uC704\uB85C \uD558\uB098\uC758 \uC8FC\uCCA0 \uC544\uCE58\uAC00 \uB193\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 68,
    color: "#8baba4"
  },
  {
    id: "giantscauseway",
    name: "Giant's Causeway",
    nameKo: "\uC790\uC774\uC5B8\uCE20 \uCF54\uC988\uC6E8\uC774",
    shape: "basalt",
    feature: "Closely packed basalt columns step down toward the sea",
    featureKo: "\uCD18\uCD18\uD558\uAC8C \uBAA8\uC778 \uD604\uBB34\uC554 \uAE30\uB465\uB4E4\uC774 \uBC14\uB2E4\uB97C \uD5A5\uD574 \uCE35\uCE35\uC774 \uB0B4\uB824\uAC11\uB2C8\uB2E4",
    seed: 69,
    color: "#d3b17c"
  },
  {
    id: "meteora",
    name: "Meteora",
    nameKo: "\uBA54\uD14C\uC624\uB77C",
    shape: "clifftemple",
    feature: "Monasteries stand atop narrow rock pillars above a broad valley",
    featureKo: "\uC881\uACE0 \uB192\uC740 \uBC14\uC704 \uAE30\uB465 \uC704\uB85C \uC218\uB3C4\uC6D0\uB4E4\uC774 \uACC4\uACE1\uC744 \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 70,
    color: "#b7a28c"
  },
  {
    id: "forbiddencity",
    name: "Forbidden City",
    nameKo: "\uC790\uAE08\uC131",
    shape: "pagoda",
    feature: "Successive courtyards and golden roofs extend along a monumental palace axis",
    featureKo: "\uC787\uB530\uB978 \uC548\uB730\uACFC \uD669\uAE08\uBE5B \uC9C0\uBD95\uC774 \uAC70\uB300\uD55C \uAD81\uC804\uC758 \uC911\uC2EC\uCD95\uC744 \uB530\uB77C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 71,
    color: "#829b8a"
  },
  {
    id: "templeheaven",
    name: "Temple of Heaven",
    nameKo: "\uCC9C\uB2E8",
    shape: "roundtemple",
    feature: "A circular triple-roofed hall stands on concentric white stone terraces",
    featureKo: "\uB465\uADFC \uC0BC\uC911 \uC9C0\uBD95\uC758 \uC804\uAC01\uC774 \uB3D9\uC2EC\uC6D0 \uBAA8\uC591\uC758 \uD770 \uC11D\uC870 \uB2E8 \uC704\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 72,
    color: "#bca6a0"
  },
  {
    id: "summerpalace",
    name: "Summer Palace",
    nameKo: "\uC774\uD654\uC6D0",
    shape: "pagoda",
    feature: "Pavilions and temples connect a garden hill with the waters of Kunming Lake",
    featureKo: "\uB204\uAC01\uACFC \uC0AC\uCC30\uC774 \uC815\uC6D0\uC758 \uC5B8\uB355\uC744 \uCFE4\uBC0D\uD638\uC758 \uBB3C\uAC00\uC640 \uC774\uC5B4 \uC90D\uB2C8\uB2E4",
    seed: 73,
    color: "#b69772"
  },
  {
    id: "qufu",
    name: "Temple of Confucius at Qufu",
    nameKo: "\uCDE8\uD478 \uACF5\uC790\uBB18",
    shape: "pagoda",
    feature: "Courtyards and tiled halls preserve a ceremonial complex dedicated to Confucius",
    featureKo: "\uC548\uB730\uACFC \uAE30\uC640 \uC804\uAC01\uB4E4\uC774 \uACF5\uC790\uB97C \uAE30\uB9AC\uB294 \uC758\uB840 \uACF5\uAC04\uC744 \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 74,
    color: "#c4ac88"
  },
  {
    id: "longmen",
    name: "Longmen Grottoes",
    nameKo: "\uB8FD\uBA3C \uC11D\uAD74",
    shape: "cliffbuddha",
    feature: "Buddhist figures and cave openings are carved into limestone cliffs beside a river",
    featureKo: "\uAC15 \uC606 \uC11D\uD68C\uC554 \uC808\uBCBD\uC5D0 \uBD88\uC0C1\uACFC \uC11D\uAD74 \uC785\uAD6C\uAC00 \uC0C8\uACA8\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 75,
    color: "#aeb9a0"
  },
  {
    id: "mogao",
    name: "Mogao Caves",
    nameKo: "\uB9C9\uACE0\uAD74",
    shape: "cliff",
    feature: "Cave openings preserve Buddhist sanctuaries along a desert cliff face",
    featureKo: "\uC0AC\uB9C9\uC758 \uC808\uBCBD\uC744 \uB530\uB77C \uBD88\uAD50 \uC131\uC18C\uB97C \uD488\uC740 \uC11D\uAD74 \uC785\uAD6C\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 76,
    color: "#bc8b70"
  },
  {
    id: "potala",
    name: "Potala Palace",
    nameKo: "\uD3EC\uD0C8\uB77C\uAD81",
    shape: "clifftemple",
    feature: "White and red palace walls climb a steep hill above Lhasa",
    featureKo: "\uD770\uC0C9\uACFC \uBD89\uC740\uC0C9 \uAD81\uC804 \uAC74\uBB3C\uC774 \uB77C\uC2F8 \uC704\uC758 \uAC00\uD30C\uB978 \uC5B8\uB355\uC744 \uB530\uB77C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 77,
    color: "#8baba4"
  },
  {
    id: "jiuzhaigou",
    name: "Jiuzhaigou Valley",
    nameKo: "\uC8FC\uC790\uC774\uAC70\uC6B0",
    shape: "lakes",
    feature: "Bright mountain lakes and waterfalls connect forested highland valleys",
    featureKo: "\uC120\uBA85\uD55C \uBE5B\uAE54\uC758 \uD638\uC218\uC640 \uD3ED\uD3EC\uAC00 \uC232\uC774 \uC6B0\uAC70\uC9C4 \uACE0\uC0B0 \uACC4\uACE1\uC744 \uC774\uC5B4 \uC90D\uB2C8\uB2E4",
    seed: 78,
    color: "#d3b17c"
  },
  {
    id: "huanglong",
    name: "Huanglong",
    nameKo: "\uD669\uB8FD",
    shape: "terraces",
    feature: "Mineral deposits form terraces of small pools beneath mountain slopes",
    featureKo: "\uAD11\uBB3C \uCE68\uC804\uBB3C\uC774 \uC0B0\uBE44\uD0C8 \uC544\uB798 \uC791\uC740 \uC5F0\uBABB\uC758 \uACC4\uB2E8\uC744 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 79,
    color: "#b7a28c"
  },
  {
    id: "huangshan",
    name: "Mount Huangshan",
    nameKo: "\uD669\uC0B0",
    shape: "peaks",
    feature: "Granite peaks and pines emerge above drifting mountain clouds",
    featureKo: "\uD654\uAC15\uC554 \uBD09\uC6B0\uB9AC\uC640 \uC18C\uB098\uBB34\uAC00 \uD750\uB974\uB294 \uC0B0\uAD6C\uB984 \uC704\uB85C \uBAA8\uC2B5\uC744 \uB4DC\uB7EC\uB0C5\uB2C8\uB2E4",
    seed: 80,
    color: "#829b8a"
  },
  {
    id: "wulingyuan",
    name: "Wulingyuan",
    nameKo: "\uC6B0\uB9C1\uC704\uC548",
    shape: "pillars",
    feature: "Slender sandstone pillars rise in dense groups above wooded ravines",
    featureKo: "\uAC00\uB290\uB2E4\uB780 \uC0AC\uC554 \uAE30\uB465\uB4E4\uC774 \uC232\uC774 \uC6B0\uAC70\uC9C4 \uACC4\uACE1 \uC704\uB85C \uBE7D\uBE7D\uD558\uAC8C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 81,
    color: "#bca6a0"
  },
  {
    id: "stoneforest",
    name: "South China Karst",
    nameKo: "\uC911\uAD6D \uB0A8\uBC29 \uCE74\uB974\uC2A4\uD2B8",
    shape: "pillars",
    feature: "Eroded limestone creates stone forests and steep karst formations",
    featureKo: "\uCE68\uC2DD\uB41C \uC11D\uD68C\uC554\uC774 \uB3CC\uC232\uACFC \uAC00\uD30C\uB978 \uCE74\uB974\uC2A4\uD2B8 \uC9C0\uD615\uC744 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 82,
    color: "#b69772"
  },
  {
    id: "chengde",
    name: "Chengde Mountain Resort",
    nameKo: "\uCCAD\uB354 \uD53C\uC11C\uC0B0\uC7A5",
    shape: "pagoda",
    feature: "Lakeside pavilions and surrounding temples form a large imperial retreat",
    featureKo: "\uD638\uC22B\uAC00 \uB204\uAC01\uACFC \uC8FC\uBCC0 \uC0AC\uCC30\uC774 \uB113\uC740 \uD669\uC2E4 \uBCC4\uAD81 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 83,
    color: "#c4ac88"
  },
  {
    id: "leshan",
    name: "Leshan Giant Buddha",
    nameKo: "\uB7EC\uC0B0 \uB300\uBD88",
    shape: "cliffbuddha",
    feature: "A seated Buddha is carved into a red sandstone cliff overlooking converging rivers",
    featureKo: "\uAC15\uB4E4\uC774 \uB9CC\uB098\uB294 \uACF3\uC744 \uB0B4\uB824\uB2E4\uBCF4\uB294 \uBD89\uC740 \uC0AC\uC554 \uC808\uBCBD\uC5D0 \uC88C\uBD88\uC774 \uC0C8\uACA8\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 84,
    color: "#aeb9a0"
  },
  {
    id: "fujian",
    name: "Fujian Tulou",
    nameKo: "\uD478\uC820 \uD1A0\uB8E8",
    shape: "roundhouse",
    feature: "Large circular earthen houses enclose communal courtyards behind thick outer walls",
    featureKo: "\uCEE4\uB2E4\uB780 \uC6D0\uD615 \uD759\uC9D1\uC758 \uB450\uAEBC\uC6B4 \uC678\uBCBD \uC548\uC5D0 \uACF5\uB3D9 \uC548\uB730\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 85,
    color: "#bc8b70"
  },
  {
    id: "kaiping",
    name: "Kaiping Diaolou",
    nameKo: "\uCE74\uC774\uD551 \uB31C\uC624\uB7EC\uC6B0",
    shape: "towers",
    feature: "Tall fortified residences combine decorative facades with defensive upper floors",
    featureKo: "\uB192\uACE0 \uACAC\uACE0\uD55C \uC8FC\uAC70 \uD0D1\uC5D0 \uC7A5\uC2DD\uC801\uC778 \uC815\uBA74\uACFC \uBC29\uC5B4\uC6A9 \uC0C1\uCE35\uBD80\uAC00 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 86,
    color: "#8baba4"
  },
  {
    id: "dujiangyan",
    name: "Dujiangyan Irrigation System",
    nameKo: "\uB450\uC7A5\uC60C",
    shape: "waterworks",
    feature: "Channels and embankments divide river water in a long-lived irrigation system",
    featureKo: "\uC218\uB85C\uC640 \uC81C\uBC29\uC774 \uAC15\uBB3C\uC744 \uB098\uB204\uC5B4 \uC624\uB798\uB41C \uAD00\uAC1C \uCCB4\uACC4\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 87,
    color: "#d3b17c"
  },
  {
    id: "grandcanal",
    name: "Grand Canal of China",
    nameKo: "\uC911\uAD6D \uB300\uC6B4\uD558",
    shape: "canal",
    feature: "A vast engineered waterway links canal towns through locks and river connections",
    featureKo: "\uAC11\uBB38\uACFC \uAC15\uC744 \uC787\uB294 \uAC70\uB300\uD55C \uC778\uACF5 \uC218\uB85C\uB97C \uB530\uB77C \uC6B4\uD558 \uB3C4\uC2DC\uB4E4\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 88,
    color: "#b7a28c"
  },
  {
    id: "suzhou",
    name: "Suzhou Gardens",
    nameKo: "\uC464\uC800\uC6B0 \uACE0\uC804 \uC815\uC6D0",
    shape: "garden",
    feature: "Pavilions and shaped rocks frame small ponds within carefully arranged gardens",
    featureKo: "\uC815\uAD50\uD558\uAC8C \uAFB8\uBBFC \uC815\uC6D0 \uC548\uC5D0\uC11C \uB204\uAC01\uACFC \uBC14\uC704\uAC00 \uC791\uC740 \uC5F0\uBABB\uC744 \uB458\uB7EC\uC309\uB2C8\uB2E4",
    seed: 89,
    color: "#829b8a"
  },
  {
    id: "lijiang",
    name: "Lijiang Old Town",
    nameKo: "\uB9AC\uC7A5 \uACE0\uC131",
    shape: "canal",
    feature: "Tiled houses and small bridges follow waterways through a historic town",
    featureKo: "\uAE30\uC640\uC9D1\uACFC \uC791\uC740 \uB2E4\uB9AC\uB4E4\uC774 \uC624\uB798\uB41C \uB3C4\uC2DC\uC758 \uBB3C\uAE38\uC744 \uB530\uB77C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 90,
    color: "#bca6a0"
  },
  {
    id: "shirakawa",
    name: "Shirakawa-go",
    nameKo: "\uC2DC\uB77C\uCE74\uC640\uACE0",
    shape: "thatched",
    feature: "Steep thatched roofs rise above timber houses in a mountain village",
    featureKo: "\uC0B0\uCD0C\uC758 \uBAA9\uC870 \uC8FC\uD0DD \uC704\uB85C \uAC00\uD30C\uB978 \uCD08\uAC00\uC9C0\uBD95\uC774 \uB192\uAC8C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 91,
    color: "#b69772"
  },
  {
    id: "himeji",
    name: "Himeji Castle",
    nameKo: "\uD788\uBA54\uC9C0\uC131",
    shape: "pagoda",
    feature: "Layered white keeps and curved tiled roofs dominate a fortified castle complex",
    featureKo: "\uD770\uC0C9 \uCC9C\uC218\uAC01\uACFC \uCE35\uCE35\uC774 \uAD7D\uC740 \uAE30\uC640\uC9C0\uBD95\uC774 \uC131\uACFD\uC758 \uC911\uC2EC\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 92,
    color: "#c4ac88"
  },
  {
    id: "horyuji",
    name: "Horyu-ji",
    nameKo: "\uD638\uB958\uC9C0",
    shape: "pagoda",
    feature: "Timber halls and a five-storey pagoda preserve an early Buddhist temple layout",
    featureKo: "\uBAA9\uC870 \uC804\uAC01\uACFC \uC624\uCE35\uD0D1\uC774 \uCD08\uAE30 \uBD88\uAD50 \uC0AC\uC6D0\uC758 \uBC30\uCE58\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 93,
    color: "#aeb9a0"
  },
  {
    id: "nikko",
    name: "Nikko Shrines",
    nameKo: "\uB2DB\uCF54 \uC0AC\uB2F9\uACFC \uC0AC\uC6D0",
    shape: "gate",
    feature: "Elaborately carved gates and sacred buildings stand among tall forest trees",
    featureKo: "\uC815\uAD50\uD558\uAC8C \uC870\uAC01\uD55C \uBB38\uACFC \uC2E0\uC131\uD55C \uAC74\uBB3C\uB4E4\uC774 \uB192\uC740 \uC232\uC758 \uB098\uBB34 \uC0AC\uC774\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 94,
    color: "#bc8b70"
  },
  {
    id: "itsukushima",
    name: "Itsukushima Shrine",
    nameKo: "\uC774\uC4F0\uCFE0\uC2DC\uB9C8 \uC2E0\uC0AC",
    shape: "torii",
    feature: "A great vermilion gate stands in tidal water before the shrine complex",
    featureKo: "\uBC00\uBB3C\uC774 \uB4DC\uB098\uB4DC\uB294 \uBB3C \uC704\uC5D0 \uCEE4\uB2E4\uB780 \uC8FC\uD64D\uC0C9 \uBB38\uC774 \uC2E0\uC0AC \uC55E\uC744 \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 95,
    color: "#8baba4"
  },
  {
    id: "kyoto",
    name: "Historic Kyoto",
    nameKo: "\uAD50\uD1A0 \uACE0\uB3C4 \uC720\uC801",
    shape: "pagoda",
    feature: "Temple roofs and garden pavilions preserve the layered landscape of an old capital",
    featureKo: "\uC0AC\uCC30 \uC9C0\uBD95\uACFC \uC815\uC6D0\uC758 \uB204\uAC01\uB4E4\uC774 \uC61B \uC218\uB3C4\uC758 \uACB9\uACB9\uC774 \uC313\uC778 \uACBD\uAD00\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 96,
    color: "#d3b17c"
  },
  {
    id: "nara",
    name: "Historic Nara",
    nameKo: "\uB098\uB77C \uACE0\uB3C4 \uC720\uC801",
    shape: "pagoda",
    feature: "Large timber temple halls and pagodas recall an early Japanese capital",
    featureKo: "\uD070 \uBAA9\uC870 \uC0AC\uCC30 \uC804\uAC01\uACFC \uD0D1\uB4E4\uC774 \uC77C\uBCF8\uC758 \uCD08\uAE30 \uC218\uB3C4\uB97C \uB5A0\uC62C\uB9AC\uAC8C \uD569\uB2C8\uB2E4",
    seed: 97,
    color: "#b7a28c"
  },
  {
    id: "hiraizumi",
    name: "Hiraizumi",
    nameKo: "\uD788\uB77C\uC774\uC988\uBBF8",
    shape: "garden",
    feature: "Temple gardens use ponds and carefully arranged landforms to evoke a sacred landscape",
    featureKo: "\uC0AC\uCC30 \uC815\uC6D0\uC774 \uC5F0\uBABB\uACFC \uC9C0\uD615\uC744 \uD65C\uC6A9\uD574 \uC2E0\uC131\uD55C \uD48D\uACBD\uC744 \uB098\uD0C0\uB0C5\uB2C8\uB2E4",
    seed: 98,
    color: "#829b8a"
  },
  {
    id: "iwami",
    name: "Iwami Ginzan",
    nameKo: "\uC774\uC640\uBBF8 \uC740\uAD11",
    shape: "mine",
    feature: "Mine entrances and hillside settlements recall a mountain silver-mining landscape",
    featureKo: "\uAC31\uB3C4 \uC785\uAD6C\uC640 \uC0B0\uBE44\uD0C8\uC758 \uB9C8\uC744\uC774 \uC740\uC744 \uCE90\uB358 \uC0B0\uC545 \uACBD\uAD00\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 99,
    color: "#bca6a0"
  },
  {
    id: "yakushima",
    name: "Yakushima",
    nameKo: "\uC57C\uCFE0\uC2DC\uB9C8",
    shape: "forest",
    feature: "Ancient trees and dense evergreen forest cover a mountainous island",
    featureKo: "\uC624\uB798\uB41C \uB098\uBB34\uC640 \uC6B8\uCC3D\uD55C \uC0C1\uB85D\uC218\uB9BC\uC774 \uC0B0\uC774 \uB9CE\uC740 \uC12C\uC744 \uB36E\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 100,
    color: "#b69772"
  },
  {
    id: "shiretoko",
    name: "Shiretoko",
    nameKo: "\uC2DC\uB808\uD1A0\uCF54",
    shape: "coast",
    feature: "Forested mountains descend toward a cold sea shaped by seasonal ice",
    featureKo: "\uC232\uC774 \uC6B0\uAC70\uC9C4 \uC0B0\uC774 \uACC4\uC808 \uD574\uBE59\uC758 \uC601\uD5A5\uC744 \uBC1B\uB294 \uCC28\uAC00\uC6B4 \uBC14\uB2E4\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 101,
    color: "#c4ac88"
  },
  {
    id: "bulguksa",
    name: "Bulguksa and Seokguram",
    nameKo: "\uBD88\uAD6D\uC0AC\uC640 \uC11D\uAD74\uC554",
    shape: "pagoda",
    feature: "Stone stairways and pagodas complement a Buddhist temple and granite grotto",
    featureKo: "\uC11D\uC870 \uACC4\uB2E8\uACFC \uC11D\uD0D1\uC774 \uBD88\uAD50 \uC0AC\uCC30\uACFC \uD654\uAC15\uC554 \uC11D\uAD74\uC744 \uD568\uAED8 \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 102,
    color: "#aeb9a0"
  },
  {
    id: "hwaseong",
    name: "Hwaseong Fortress",
    nameKo: "\uC218\uC6D0 \uD654\uC131",
    shape: "fortress",
    feature: "Stone and brick walls link gates and watchtowers around a planned fortress",
    featureKo: "\uB3CC\uACFC \uBCBD\uB3CC \uC131\uBCBD\uC774 \uACC4\uD68D\uC801\uC73C\uB85C \uBC30\uCE58\uD55C \uBB38\uACFC \uAC10\uC2DC\uD0D1\uC744 \uC5F0\uACB0\uD569\uB2C8\uB2E4",
    seed: 103,
    color: "#bc8b70"
  },
  {
    id: "changdeokgung",
    name: "Changdeokgung Palace",
    nameKo: "\uCC3D\uB355\uAD81",
    shape: "pagoda",
    feature: "Palace halls and gardens follow the natural slopes of a wooded site",
    featureKo: "\uAD81\uAD90\uC758 \uC804\uAC01\uACFC \uC815\uC6D0\uC774 \uC232\uC774 \uC6B0\uAC70\uC9C4 \uD130\uC758 \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uACBD\uC0AC\uB97C \uB530\uB985\uB2C8\uB2E4",
    seed: 104,
    color: "#8baba4"
  },
  {
    id: "haeinsa",
    name: "Haeinsa Janggyeong Panjeon",
    nameKo: "\uD574\uC778\uC0AC \uC7A5\uACBD\uD310\uC804",
    shape: "hall",
    feature: "Long timber repositories shelter the carved printing blocks of the Tripitaka Koreana",
    featureKo: "\uAE34 \uBAA9\uC870 \uBCF4\uAD00 \uAC74\uBB3C\uC774 \uACE0\uB824\uB300\uC7A5\uACBD\uC758 \uBAA9\uD310\uC744 \uD488\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 105,
    color: "#d3b17c"
  },
  {
    id: "jongmyo",
    name: "Jongmyo Shrine",
    nameKo: "\uC885\uBB18",
    shape: "hall",
    feature: "An exceptionally long ceremonial hall faces a broad stone courtyard",
    featureKo: "\uC720\uB09C\uD788 \uAE34 \uC758\uB840\uC6A9 \uC804\uAC01\uC774 \uB113\uC740 \uC11D\uC870 \uB9C8\uB2F9\uC744 \uB9C8\uC8FC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 106,
    color: "#b7a28c"
  },
  {
    id: "jeju",
    name: "Jeju Volcanic Island",
    nameKo: "\uC81C\uC8FC \uD654\uC0B0\uC12C",
    shape: "volcano",
    feature: "A shield volcano and lava formations reveal the origins of a volcanic island",
    featureKo: "\uC21C\uC0C1\uD654\uC0B0\uACFC \uC6A9\uC554 \uC9C0\uD615\uC774 \uD654\uC0B0\uC12C\uC774 \uB9CC\uB4E4\uC5B4\uC9C4 \uACFC\uC815\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 107,
    color: "#829b8a"
  },
  {
    id: "sansa",
    name: "Sansa Mountain Monasteries",
    nameKo: "\uC0B0\uC0AC \uD55C\uAD6D\uC758 \uC0B0\uC9C0\uC2B9\uC6D0",
    shape: "pagoda",
    feature: "Temple halls are grouped around open courtyards within mountain landscapes",
    featureKo: "\uC0B0\uC545 \uACBD\uAD00 \uC18D \uC5F4\uB9B0 \uB9C8\uB2F9 \uB458\uB808\uB85C \uC0AC\uCC30 \uC804\uAC01\uB4E4\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 108,
    color: "#bca6a0"
  },
  {
    id: "baekje",
    name: "Baekje Historic Areas",
    nameKo: "\uBC31\uC81C\uC5ED\uC0AC\uC720\uC801\uC9C0\uAD6C",
    shape: "pagoda",
    feature: "Stone pagodas and archaeological remains trace the cities of an ancient kingdom",
    featureKo: "\uC11D\uD0D1\uACFC \uACE0\uACE0\uD559 \uC720\uC801\uC774 \uACE0\uB300 \uC655\uAD6D \uB3C4\uC2DC\uC758 \uD754\uC801\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 109,
    color: "#b69772"
  },
  {
    id: "agrafort",
    name: "Agra Fort",
    nameKo: "\uC544\uADF8\uB77C \uC694\uC0C8",
    shape: "fortress",
    feature: "Red sandstone walls enclose palaces and courts beside the Yamuna River",
    featureKo: "\uBD89\uC740 \uC0AC\uC554 \uC131\uBCBD\uC774 \uC57C\uBB34\uB098\uAC15 \uC606\uC758 \uAD81\uC804\uACFC \uC548\uB730\uC744 \uB458\uB7EC\uC309\uB2C8\uB2E4",
    seed: 110,
    color: "#c4ac88"
  },
  {
    id: "redfort",
    name: "Red Fort",
    nameKo: "\uB378\uB9AC \uBD89\uC740 \uC694\uC0C8",
    shape: "fortress",
    feature: "A long red sandstone wall guards ceremonial gateways and palace pavilions",
    featureKo: "\uAE34 \uBD89\uC740 \uC0AC\uC554 \uC131\uBCBD\uC774 \uC758\uB840\uC6A9 \uBB38\uACFC \uAD81\uC804\uC758 \uB204\uAC01\uC744 \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 111,
    color: "#aeb9a0"
  },
  {
    id: "qutb",
    name: "Qutb Minar",
    nameKo: "\uCFE0\uD2B8\uBE0C \uBBF8\uB098\uB974",
    shape: "minaret",
    feature: "A tapering fluted minaret rises above the remains of early Delhi monuments",
    featureKo: "\uD648\uC774 \uD30C\uC778 \uAC00\uB298\uC5B4\uC9C0\uB294 \uBBF8\uB098\uB808\uD2B8\uAC00 \uB378\uB9AC \uCD08\uAE30 \uC720\uC801 \uC704\uB85C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 112,
    color: "#bc8b70"
  },
  {
    id: "humayun",
    name: "Humayun's Tomb",
    nameKo: "\uD6C4\uB9C8\uC724 \uBB18",
    shape: "dome",
    feature: "A large domed tomb stands within a formally divided garden",
    featureKo: "\uCEE4\uB2E4\uB780 \uB3D4\uC744 \uAC16\uCD98 \uBB18\uB2F9\uC774 \uBC18\uB4EF\uD558\uAC8C \uB098\uB208 \uC815\uC6D0 \uC548\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 113,
    color: "#8baba4"
  },
  {
    id: "fatehpur",
    name: "Fatehpur Sikri",
    nameKo: "\uD30C\uD14C\uD478\uB974 \uC2DC\uD06C\uB9AC",
    shape: "palace",
    feature: "Red sandstone halls and large courtyards preserve a Mughal imperial city",
    featureKo: "\uBD89\uC740 \uC0AC\uC554 \uC804\uAC01\uACFC \uD070 \uC548\uB730\uB4E4\uC774 \uBB34\uAD74 \uD669\uC2E4 \uB3C4\uC2DC\uC758 \uBAA8\uC2B5\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 114,
    color: "#d3b17c"
  },
  {
    id: "sanchi",
    name: "Sanchi Stupa",
    nameKo: "\uC0B0\uCE58 \uB300\uD0D1",
    shape: "stupa",
    feature: "Carved stone gateways surround a rounded Buddhist stupa",
    featureKo: "\uC870\uAC01\uC744 \uC0C8\uAE34 \uC11D\uC870 \uBB38\uB4E4\uC774 \uB465\uADFC \uBD88\uAD50 \uD0D1\uC744 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 115,
    color: "#b7a28c"
  },
  {
    id: "ajanta",
    name: "Ajanta Caves",
    nameKo: "\uC544\uC794\uD0C0 \uC11D\uAD74",
    shape: "cliff",
    feature: "Buddhist caves open along a curving rock face above a river valley",
    featureKo: "\uAC15 \uACC4\uACE1 \uC704\uB85C \uAD7D\uC774\uC9C4 \uC554\uBCBD\uC744 \uB530\uB77C \uBD88\uAD50 \uC11D\uAD74\uB4E4\uC774 \uC5F4\uB824 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 116,
    color: "#829b8a"
  },
  {
    id: "ellora",
    name: "Ellora Caves",
    nameKo: "\uC5D8\uB85C\uB77C \uC11D\uAD74",
    shape: "clifftemple",
    feature: "Rock-cut temples and monasteries are carved into a long basalt escarpment",
    featureKo: "\uAE34 \uD604\uBB34\uC554 \uC808\uBCBD\uC744 \uD30C\uB0B4 \uC0AC\uC6D0\uACFC \uC218\uB3C4\uC6D0\uB4E4\uC744 \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4",
    seed: 117,
    color: "#bca6a0"
  },
  {
    id: "elephanta",
    name: "Elephanta Caves",
    nameKo: "\uC5D8\uB808\uD310\uD0C0 \uC11D\uAD74",
    shape: "cliff",
    feature: "Sculpted pillars and sacred figures occupy a rock-cut temple on an island",
    featureKo: "\uC12C\uC758 \uC554\uAD74 \uC0AC\uC6D0 \uC548\uC5D0 \uC870\uAC01\uD55C \uAE30\uB465\uACFC \uC2E0\uC131\uD55C \uD615\uC0C1\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 118,
    color: "#b69772"
  },
  {
    id: "hampi",
    name: "Hampi",
    nameKo: "\uD568\uD53C",
    shape: "templetower",
    feature: "Temple towers and stone halls rise among great granite boulders",
    featureKo: "\uCEE4\uB2E4\uB780 \uD654\uAC15\uC554 \uBC14\uC704\uB4E4 \uC0AC\uC774\uB85C \uC0AC\uC6D0 \uD0D1\uACFC \uC11D\uC870 \uC804\uAC01\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 119,
    color: "#c4ac88"
  },
  {
    id: "konark",
    name: "Konark Sun Temple",
    nameKo: "\uCF54\uB098\uB77C\uD06C \uD0DC\uC591\uC2E0 \uC0AC\uC6D0",
    shape: "chariot",
    feature: "A carved stone temple takes the form of a monumental chariot with great wheels",
    featureKo: "\uC870\uAC01\uD55C \uC11D\uC870 \uC0AC\uC6D0\uC774 \uCEE4\uB2E4\uB780 \uBC14\uD034\uB97C \uAC16\uCD98 \uAC70\uB300\uD55C \uC804\uCC28\uC758 \uBAA8\uC2B5\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 120,
    color: "#aeb9a0"
  },
  {
    id: "mahabalipuram",
    name: "Mahabalipuram",
    nameKo: "\uB9C8\uD558\uBC1C\uB9AC\uD478\uB78C",
    shape: "templetower",
    feature: "Rock-cut shrines and sculpted temples face the coast of the Bay of Bengal",
    featureKo: "\uC554\uAD74 \uC0AC\uB2F9\uACFC \uC870\uAC01\uD55C \uC0AC\uC6D0\uB4E4\uC774 \uBCB5\uACE8\uB9CC\uC758 \uD574\uC548\uC744 \uB9C8\uC8FC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 121,
    color: "#bc8b70"
  },
  {
    id: "khajuraho",
    name: "Khajuraho Temples",
    nameKo: "\uCE74\uC8FC\uB77C\uD638 \uC0AC\uC6D0\uAD70",
    shape: "templetower",
    feature: "Clusters of rising stone spires crown richly carved temple walls",
    featureKo: "\uBE7D\uBE7D\uD558\uAC8C \uC19F\uC740 \uC11D\uC870 \uCCA8\uD0D1\uC774 \uC870\uAC01\uC73C\uB85C \uAC00\uB4DD\uD55C \uC0AC\uC6D0 \uBCBD \uC704\uB97C \uB36E\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 122,
    color: "#8baba4"
  },
  {
    id: "chola",
    name: "Chola Temples",
    nameKo: "\uCD10\uB77C \uB300\uC0AC\uC6D0",
    shape: "templetower",
    feature: "Tall pyramidal temple towers reflect the monumental architecture of the Chola rulers",
    featureKo: "\uB192\uC740 \uD53C\uB77C\uBBF8\uB4DC\uD615 \uC0AC\uC6D0 \uD0D1\uC774 \uCD10\uB77C \uC655\uC870\uC758 \uAC70\uB300\uD55C \uAC74\uCD95\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 123,
    color: "#d3b17c"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    nameKo: "\uC790\uC774\uD478\uB974",
    shape: "town",
    feature: "Regular streets and palace facades form a carefully planned historic city",
    featureKo: "\uBC18\uB4EF\uD55C \uAC70\uB9AC\uC640 \uAD81\uC804\uC758 \uC815\uBA74\uC774 \uACC4\uD68D\uC801\uC73C\uB85C \uC870\uC131\uD55C \uC5ED\uC0AC \uB3C4\uC2DC\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 124,
    color: "#b7a28c"
  },
  {
    id: "jantarmantar",
    name: "Jantar Mantar",
    nameKo: "\uC794\uD0C0\uB974 \uB9CC\uD0C0\uB974",
    shape: "observatory",
    feature: "Large masonry instruments turn astronomical measurement into monumental geometry",
    featureKo: "\uAC70\uB300\uD55C \uC11D\uC870 \uAD00\uCE21 \uAE30\uAD6C\uB4E4\uC774 \uCC9C\uBB38 \uCE21\uC815\uC744 \uAE30\uD558\uD559\uC801\uC778 \uAC74\uCD95\uC73C\uB85C \uBC14\uAFC9\uB2C8\uB2E4",
    seed: 125,
    color: "#829b8a"
  },
  {
    id: "ranikivav",
    name: "Rani ki Vav",
    nameKo: "\uB77C\uB2C8 \uD0A4 \uBC14\uBE0C",
    shape: "stepwell",
    feature: "Sculpted terraces descend through multiple levels into a deep stepwell",
    featureKo: "\uC870\uAC01\uD55C \uD14C\uB77C\uC2A4\uAC00 \uC5EC\uB7EC \uCE35\uC744 \uC9C0\uB098 \uAE4A\uC740 \uACC4\uB2E8\uC2DD \uC6B0\uBB3C\uB85C \uB0B4\uB824\uAC11\uB2C8\uB2E4",
    seed: 126,
    color: "#bca6a0"
  },
  {
    id: "dholavira",
    name: "Dholavira",
    nameKo: "\uB3CC\uB77C\uBE44\uB77C",
    shape: "ruins",
    feature: "Stone walls and reservoirs preserve the ordered plan of a Harappan city",
    featureKo: "\uC11D\uBCBD\uACFC \uC800\uC218\uC9C0\uAC00 \uD558\uB77C\uD30C \uBB38\uBA85\uC758 \uADDC\uCE59\uC801\uC778 \uB3C4\uC2DC \uAD6C\uC870\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 127,
    color: "#b69772"
  },
  {
    id: "mahabodhi",
    name: "Mahabodhi Temple",
    nameKo: "\uB9C8\uD558\uBCF4\uB514 \uC0AC\uC6D0",
    shape: "templetower",
    feature: "A tall pyramidal temple marks a central place in Buddhist tradition",
    featureKo: "\uB192\uC740 \uD53C\uB77C\uBBF8\uB4DC\uD615 \uC0AC\uC6D0\uC774 \uBD88\uAD50 \uC804\uD1B5\uC758 \uC911\uC694\uD55C \uC7A5\uC18C\uB97C \uD45C\uC2DC\uD569\uB2C8\uB2E4",
    seed: 128,
    color: "#c4ac88"
  },
  {
    id: "kaziranga",
    name: "Kaziranga",
    nameKo: "\uCE74\uC9C0\uB791\uAC00",
    shape: "savanna",
    feature: "Wet grasslands and river habitats shelter a great population of one-horned rhinoceroses",
    featureKo: "\uC2B5\uD55C \uCD08\uC6D0\uACFC \uAC15 \uC8FC\uBCC0 \uC11C\uC2DD\uC9C0\uC5D0 \uB9CE\uC740 \uC678\uBFD4\uCF54\uBFD4\uC18C\uAC00 \uC0B4\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 129,
    color: "#aeb9a0"
  },
  {
    id: "sundarbans",
    name: "Sundarbans",
    nameKo: "\uC21C\uB2E4\uB974\uBC18\uC2A4",
    shape: "mangrove",
    feature: "Tidal creeks weave through an extensive mangrove forest in a great river delta",
    featureKo: "\uCEE4\uB2E4\uB780 \uC0BC\uAC01\uC8FC\uC758 \uB113\uC740 \uB9F9\uADF8\uB85C\uBE0C \uC232 \uC0AC\uC774\uB85C \uC870\uC218\uB85C\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 130,
    color: "#bc8b70"
  },
  {
    id: "bagan",
    name: "Bagan",
    nameKo: "\uBC14\uAC04",
    shape: "pagoda",
    feature: "Thousands of brick temples and stupas spread across a plain beside the Ayeyarwady",
    featureKo: "\uC544\uC608\uC57C\uC640\uB514\uAC15 \uC606 \uD3C9\uC6D0\uC5D0 \uC218\uB9CE\uC740 \uBCBD\uB3CC \uC0AC\uC6D0\uACFC \uD0D1\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 131,
    color: "#8baba4"
  },
  {
    id: "ayutthaya",
    name: "Ayutthaya",
    nameKo: "\uC544\uC720\uD0C0\uC57C",
    shape: "stupa",
    feature: "Brick prangs and ruined temples mark the island of a former royal capital",
    featureKo: "\uBCBD\uB3CC \uD0D1\uACFC \uC0AC\uC6D0 \uC720\uC801\uC774 \uC61B \uC655\uB3C4\uC600\uB358 \uC12C\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 132,
    color: "#d3b17c"
  },
  {
    id: "sukhothai",
    name: "Sukhothai",
    nameKo: "\uC218\uCF54\uD0C0\uC774",
    shape: "stupa",
    feature: "Temple ruins and lotus-shaped towers stand within a planned historic landscape",
    featureKo: "\uC0AC\uC6D0 \uC720\uC801\uACFC \uC5F0\uAF43 \uBAA8\uC591 \uD0D1\uC774 \uACC4\uD68D\uC801\uC73C\uB85C \uC870\uC131\uD55C \uC5ED\uC0AC \uACBD\uAD00 \uC548\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 133,
    color: "#b7a28c"
  },
  {
    id: "vatphou",
    name: "Vat Phou",
    nameKo: "\uC653\uD478",
    shape: "clifftemple",
    feature: "A temple axis climbs from water basins toward a sanctuary on the mountain slope",
    featureKo: "\uC0AC\uC6D0\uC758 \uC911\uC2EC\uCD95\uC774 \uC5F0\uBABB\uC5D0\uC11C \uC0B0\uBE44\uD0C8\uC758 \uC131\uC18C\uB97C \uD5A5\uD574 \uC62C\uB77C\uAC11\uB2C8\uB2E4",
    seed: 134,
    color: "#829b8a"
  },
  {
    id: "plainjars",
    name: "Plain of Jars",
    nameKo: "\uD56D\uC544\uB9AC \uD3C9\uC6D0",
    shape: "jars",
    feature: "Large stone jars stand in groups across the upland landscape",
    featureKo: "\uCEE4\uB2E4\uB780 \uB3CC \uD56D\uC544\uB9AC\uB4E4\uC774 \uACE0\uC6D0 \uD48D\uACBD \uACF3\uACF3\uC5D0 \uBB34\uB9AC\uB97C \uC9C0\uC5B4 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 135,
    color: "#bca6a0"
  },
  {
    id: "persepolis",
    name: "Persepolis",
    nameKo: "\uD398\uB974\uC138\uD3F4\uB9AC\uC2A4",
    shape: "columns",
    feature: "Tall columns and carved gateways rise from the terrace of an ancient royal complex",
    featureKo: "\uACE0\uB300 \uC655\uC2E4 \uC720\uC801\uC758 \uB2E8 \uC704\uB85C \uB192\uC740 \uAE30\uB465\uACFC \uC870\uAC01\uD55C \uBB38\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 136,
    color: "#b69772"
  },
  {
    id: "grandcanyon",
    name: "Grand Canyon",
    nameKo: "\uADF8\uB79C\uB4DC \uCE90\uB2C8\uC5B8",
    shape: "canyon",
    feature: "Layered rock walls descend toward a winding river in a vast canyon",
    featureKo: "\uACB9\uACB9\uC774 \uB4DC\uB7EC\uB09C \uC554\uBCBD\uC774 \uAC70\uB300\uD55C \uD611\uACE1\uC758 \uAD7D\uC774\uCE58\uB294 \uAC15\uC744 \uD5A5\uD574 \uB0B4\uB824\uAC11\uB2C8\uB2E4",
    seed: 137,
    color: "#c4ac88"
  },
  {
    id: "yellowstone",
    name: "Yellowstone",
    nameKo: "\uC610\uB85C\uC2A4\uD1A4",
    shape: "geyser",
    feature: "Geysers and hot springs punctuate a broad volcanic landscape",
    featureKo: "\uAC04\uD5D0\uCC9C\uACFC \uC628\uCC9C\uC774 \uB113\uC740 \uD654\uC0B0 \uACBD\uAD00 \uACF3\uACF3\uC5D0\uC11C \uBAA8\uC2B5\uC744 \uB4DC\uB7EC\uB0C5\uB2C8\uB2E4",
    seed: 138,
    color: "#aeb9a0"
  },
  {
    id: "yosemite",
    name: "Yosemite",
    nameKo: "\uC694\uC138\uBBF8\uD2F0",
    shape: "waterfall",
    feature: "Granite cliffs and waterfalls frame a deeply carved mountain valley",
    featureKo: "\uD654\uAC15\uC554 \uC808\uBCBD\uACFC \uD3ED\uD3EC\uAC00 \uAE4A\uC774 \uAE4E\uC778 \uC0B0\uC545 \uACC4\uACE1\uC744 \uB458\uB7EC\uC309\uB2C8\uB2E4",
    seed: 139,
    color: "#bc8b70"
  },
  {
    id: "everglades",
    name: "Everglades",
    nameKo: "\uC5D0\uBC84\uAE00\uB808\uC774\uC988",
    shape: "wetland",
    feature: "Broad shallow wetlands link sawgrass plains with coastal mangroves",
    featureKo: "\uB113\uACE0 \uC595\uC740 \uC2B5\uC9C0\uAC00 \uD1B1\uD480 \uCD08\uC6D0\uACFC \uD574\uC548 \uB9F9\uADF8\uB85C\uBE0C\uB97C \uC774\uC5B4 \uC90D\uB2C8\uB2E4",
    seed: 140,
    color: "#8baba4"
  },
  {
    id: "mammothcave",
    name: "Mammoth Cave",
    nameKo: "\uB9E4\uBA38\uB4DC \uB3D9\uAD74",
    shape: "cave",
    feature: "An extensive limestone cave system unfolds in passages beneath wooded hills",
    featureKo: "\uC232\uC774 \uC6B0\uAC70\uC9C4 \uC5B8\uB355 \uC544\uB798\uB85C \uAC70\uB300\uD55C \uC11D\uD68C\uC554 \uB3D9\uAD74\uC758 \uD1B5\uB85C\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 141,
    color: "#d3b17c"
  },
  {
    id: "carlsbad",
    name: "Carlsbad Caverns",
    nameKo: "\uCE7C\uC988\uBC30\uB4DC \uB3D9\uAD74",
    shape: "cave",
    feature: "Large underground chambers contain columns and hanging limestone formations",
    featureKo: "\uCEE4\uB2E4\uB780 \uC9C0\uD558 \uACF5\uAC04\uC5D0 \uC11D\uD68C\uC554 \uAE30\uB465\uACFC \uB9E4\uB2EC\uB9B0 \uC885\uC720\uC11D\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 142,
    color: "#b7a28c"
  },
  {
    id: "mesaverde",
    name: "Mesa Verde",
    nameKo: "\uBA54\uC0AC \uBCA0\uB974\uB370",
    shape: "cliff",
    feature: "Ancestral Pueblo dwellings occupy sheltered alcoves within sandstone cliffs",
    featureKo: "\uC0AC\uC554 \uC808\uBCBD\uC758 \uC6C0\uD479 \uB4E4\uC5B4\uAC04 \uACF5\uAC04\uC5D0 \uD478\uC5D0\uBE14\uB85C \uC120\uC870\uB4E4\uC758 \uC8FC\uAC70\uC9C0\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 143,
    color: "#829b8a"
  },
  {
    id: "taos",
    name: "Taos Pueblo",
    nameKo: "\uD0C0\uC624\uC2A4 \uD478\uC5D0\uBE14\uB85C",
    shape: "adobe",
    feature: "Multi-storey earthen buildings rise in stepped clusters in a living Pueblo settlement",
    featureKo: "\uC9C0\uAE08\uB3C4 \uC774\uC5B4\uC9C0\uB294 \uD478\uC5D0\uBE14\uB85C \uB9C8\uC744\uC5D0 \uB2E4\uCE35 \uD759 \uAC74\uBB3C\uB4E4\uC774 \uACC4\uB2E8\uCC98\uB7FC \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 144,
    color: "#bca6a0"
  },
  {
    id: "chaco",
    name: "Chaco Canyon",
    nameKo: "\uCC28\uCF54 \uCE90\uB2C8\uC5B8",
    shape: "adobe",
    feature: "Great stone houses and circular ceremonial spaces preserve an ancestral settlement",
    featureKo: "\uCEE4\uB2E4\uB780 \uC11D\uC870 \uC9D1\uACFC \uB465\uADFC \uC758\uB840 \uACF5\uAC04\uC774 \uC624\uB798\uB41C \uC815\uCC29\uC9C0\uC758 \uBAA8\uC2B5\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 145,
    color: "#b69772"
  },
  {
    id: "sanantonio",
    name: "San Antonio Missions",
    nameKo: "\uC0CC\uC548\uD1A0\uB2C8\uC624 \uBBF8\uC158",
    shape: "basilica",
    feature: "Mission churches and walled compounds follow a river landscape",
    featureKo: "\uC120\uAD50 \uAD50\uD68C\uC640 \uC131\uBCBD\uC73C\uB85C \uB458\uB7EC\uC2FC \uAC74\uBB3C\uB4E4\uC774 \uAC15 \uC8FC\uBCC0 \uACBD\uAD00\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 146,
    color: "#c4ac88"
  },
  {
    id: "papahanaumokuakea",
    name: "Papah\u0101naumoku\u0101kea",
    nameKo: "\uD30C\uD30C\uD558\uB098\uC6B0\uBAA8\uCFE0\uC544\uCF00\uC544",
    shape: "reef",
    feature: "Low islands and coral reefs extend across a remote stretch of the Pacific",
    featureKo: "\uD0DC\uD3C9\uC591\uC758 \uC678\uB534 \uD574\uC5ED\uC744 \uB530\uB77C \uB0AE\uC740 \uC12C\uACFC \uC0B0\uD638\uCD08\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 147,
    color: "#aeb9a0"
  },
  {
    id: "canadianrockies",
    name: "Canadian Rockies",
    nameKo: "\uCE90\uB098\uB2E4 \uB85C\uD0A4\uC0B0\uB9E5",
    shape: "peaks",
    feature: "Rugged mountain ranges enclose glaciers and brightly coloured alpine lakes",
    featureKo: "\uD5D8\uC900\uD55C \uC0B0\uB9E5\uC774 \uBE59\uD558\uC640 \uC120\uBA85\uD55C \uBE5B\uAE54\uC758 \uACE0\uC0B0 \uD638\uC218\uB97C \uAC10\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 148,
    color: "#bc8b70"
  },
  {
    id: "dinosaurpark",
    name: "Dinosaur Provincial Park",
    nameKo: "\uACF5\uB8E1 \uC8FC\uB9BD\uACF5\uC6D0",
    shape: "badlands",
    feature: "Eroded badlands reveal layered rock and rich dinosaur fossil deposits",
    featureKo: "\uCE68\uC2DD\uB41C \uD669\uBB34\uC9C0\uC5D0 \uC9C0\uCE35\uACFC \uD48D\uBD80\uD55C \uACF5\uB8E1 \uD654\uC11D \uC0B0\uC9C0\uAC00 \uB4DC\uB7EC\uB098 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 149,
    color: "#8baba4"
  },
  {
    id: "lunenburg",
    name: "Lunenburg",
    nameKo: "\uB8E8\uB10C\uBC84\uADF8",
    shape: "harbor",
    feature: "Colourful timber buildings line a historic North Atlantic fishing port",
    featureKo: "\uB2E4\uCC44\uB85C\uC6B4 \uBAA9\uC870 \uAC74\uBB3C\uB4E4\uC774 \uBD81\uB300\uC11C\uC591\uC758 \uC624\uB798\uB41C \uC5B4\uD56D\uC744 \uB530\uB77C \uB298\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 150,
    color: "#d3b17c"
  },
  {
    id: "grosmorne",
    name: "Gros Morne",
    nameKo: "\uADF8\uB85C\uC2A4 \uBAAC",
    shape: "fjord",
    feature: "Steep fjord walls and exposed rock plateaus reveal a dramatic coastal landscape",
    featureKo: "\uAC00\uD30C\uB978 \uD53C\uC624\uB974 \uC554\uBCBD\uACFC \uB4DC\uB7EC\uB09C \uC554\uC11D \uACE0\uC6D0\uC774 \uADF9\uC801\uC778 \uD574\uC548 \uD48D\uACBD\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 151,
    color: "#b7a28c"
  },
  {
    id: "nahanni",
    name: "Nahanni",
    nameKo: "\uB098\uD558\uB2C8",
    shape: "waterfall",
    feature: "A great waterfall and deep canyons interrupt a wild northern river",
    featureKo: "\uAC70\uB300\uD55C \uD3ED\uD3EC\uC640 \uAE4A\uC740 \uD611\uACE1\uC774 \uBD81\uBC29\uC758 \uAC70\uCE5C \uAC15\uC904\uAE30\uB97C \uB530\uB77C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 152,
    color: "#829b8a"
  },
  {
    id: "teotihuacan",
    name: "Teotihuacan",
    nameKo: "\uD14C\uC624\uD2F0\uC6B0\uC544\uCE78",
    shape: "pyramid",
    feature: "Large stepped pyramids line a long ceremonial avenue in an ancient city",
    featureKo: "\uACE0\uB300 \uB3C4\uC2DC\uC758 \uAE34 \uC758\uB840\uC6A9 \uB300\uB85C\uB97C \uB530\uB77C \uCEE4\uB2E4\uB780 \uACC4\uB2E8\uC2DD \uD53C\uB77C\uBBF8\uB4DC\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 153,
    color: "#bca6a0"
  },
  {
    id: "palenque",
    name: "Palenque",
    nameKo: "\uD314\uB81D\uCF00",
    shape: "pyramid",
    feature: "Stepped temple platforms and a palace tower emerge from tropical forest",
    featureKo: "\uC5F4\uB300 \uC232 \uC0AC\uC774\uB85C \uACC4\uB2E8\uC2DD \uC0AC\uC6D0 \uAE30\uB2E8\uACFC \uAD81\uC804\uC758 \uD0D1\uC774 \uBAA8\uC2B5\uC744 \uB4DC\uB7EC\uB0C5\uB2C8\uB2E4",
    seed: 154,
    color: "#b69772"
  },
  {
    id: "uxmal",
    name: "Uxmal",
    nameKo: "\uC6B0\uC288\uB9D0",
    shape: "pyramid",
    feature: "A rounded pyramid and richly patterned stone facades mark a Maya ceremonial city",
    featureKo: "\uB465\uADFC \uC724\uACFD\uC758 \uD53C\uB77C\uBBF8\uB4DC\uC640 \uBB34\uB2AC\uAC00 \uD48D\uBD80\uD55C \uC11D\uC870 \uC815\uBA74\uC774 \uB9C8\uC57C \uC758\uB840 \uB3C4\uC2DC\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 155,
    color: "#c4ac88"
  },
  {
    id: "montealban",
    name: "Monte Alb\xE1n",
    nameKo: "\uBAAC\uD14C\uC54C\uBC18",
    shape: "pyramid",
    feature: "Broad ceremonial terraces and stone platforms occupy a levelled hilltop",
    featureKo: "\uD3C9\uD3C9\uD558\uAC8C \uB2E4\uB4EC\uC740 \uC5B8\uB355 \uC704\uC5D0 \uB113\uC740 \uC758\uB840\uC6A9 \uB2E8\uACFC \uC11D\uC870 \uAE30\uB2E8\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 156,
    color: "#aeb9a0"
  },
  {
    id: "guanajuato",
    name: "Guanajuato",
    nameKo: "\uACFC\uB098\uD6C4\uC544\uD1A0",
    shape: "town",
    feature: "Colourful buildings and narrow lanes climb the slopes of a historic mining town",
    featureKo: "\uB2E4\uCC44\uB85C\uC6B4 \uAC74\uBB3C\uACFC \uC881\uC740 \uACE8\uBAA9\uB4E4\uC774 \uC624\uB798\uB41C \uAD11\uC0B0 \uB3C4\uC2DC\uC758 \uBE44\uD0C8\uC744 \uB530\uB77C \uC62C\uB77C\uAC11\uB2C8\uB2E4",
    seed: 157,
    color: "#bc8b70"
  },
  {
    id: "morelia",
    name: "Morelia",
    nameKo: "\uBAA8\uB810\uB9AC\uC544",
    shape: "cathedral",
    feature: "Pink stone buildings and cathedral towers form a carefully ordered historic centre",
    featureKo: "\uBD84\uD64D\uBE5B \uC11D\uC870 \uAC74\uBB3C\uACFC \uB300\uC131\uB2F9 \uD0D1\uB4E4\uC774 \uBC18\uB4EF\uD55C \uAD6C\uB3C4\uC2EC\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 158,
    color: "#8baba4"
  },
  {
    id: "campeche",
    name: "Campeche",
    nameKo: "\uCE84\uD398\uCCB4",
    shape: "harbor",
    feature: "Sea walls and bastions protect a port lined with low colourful houses",
    featureKo: "\uB0AE\uACE0 \uB2E4\uCC44\uB85C\uC6B4 \uC9D1\uB4E4\uC774 \uB298\uC5B4\uC120 \uD56D\uAD6C\uB97C \uD574\uC548 \uC131\uBCBD\uACFC \uBCF4\uB8E8\uAC00 \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 159,
    color: "#d3b17c"
  },
  {
    id: "calakmul",
    name: "Calakmul",
    nameKo: "\uCE7C\uB77C\uD06C\uBB3C",
    shape: "pyramid",
    feature: "Tall Maya pyramids rise above an extensive canopy of tropical forest",
    featureKo: "\uB192\uC740 \uB9C8\uC57C \uD53C\uB77C\uBBF8\uB4DC\uB4E4\uC774 \uB113\uAC8C \uD3BC\uCCD0\uC9C4 \uC5F4\uB300 \uC232\uC758 \uC218\uAD00 \uC704\uB85C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 160,
    color: "#b7a28c"
  },
  {
    id: "iguazu",
    name: "Iguaz\xFA Falls",
    nameKo: "\uC774\uACFC\uC218 \uD3ED\uD3EC",
    shape: "waterfall",
    feature: "Many curtains of falling water span a broad forested river gorge",
    featureKo: "\uC218\uB9CE\uC740 \uBB3C\uC904\uAE30\uAC00 \uC232\uC774 \uC6B0\uAC70\uC9C4 \uB113\uC740 \uAC15 \uD611\uACE1\uC744 \uB530\uB77C \uC3DF\uC544\uC9D1\uB2C8\uB2E4",
    seed: 161,
    color: "#829b8a"
  },
  {
    id: "brasilia",
    name: "Bras\xEDlia",
    nameKo: "\uBE0C\uB77C\uC9C8\uB9AC\uC544",
    shape: "modern",
    feature: "Sculptural civic buildings stand along the axes of a planned modern capital",
    featureKo: "\uACC4\uD68D\uC801\uC73C\uB85C \uC138\uC6B4 \uD604\uB300 \uC218\uB3C4\uC758 \uC911\uC2EC\uCD95\uC744 \uB530\uB77C \uC870\uAC01 \uAC19\uC740 \uACF5\uACF5\uAC74\uBB3C\uB4E4\uC774 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 162,
    color: "#bca6a0"
  },
  {
    id: "ouropreto",
    name: "Ouro Preto",
    nameKo: "\uC624\uB8E8\uD504\uB808\uD22C",
    shape: "town",
    feature: "Baroque churches and tiled houses climb the steep streets of a former gold town",
    featureKo: "\uBC14\uB85C\uD06C \uAD50\uD68C\uC640 \uAE30\uC640\uC9D1\uC774 \uC61B \uAE08\uAD11 \uB3C4\uC2DC\uC758 \uAC00\uD30C\uB978 \uAC70\uB9AC\uB97C \uB530\uB77C \uB298\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 163,
    color: "#b69772"
  },
  {
    id: "salvador",
    name: "Salvador da Bahia",
    nameKo: "\uC0AC\uC6B0\uBC14\uB3C4\uB974",
    shape: "town",
    feature: "Colourful facades and church towers overlook the bay from a historic upper town",
    featureKo: "\uC624\uB798\uB41C \uC5B8\uB355 \uB3C4\uC2DC\uC758 \uB2E4\uCC44\uB85C\uC6B4 \uC815\uBA74\uACFC \uAD50\uD68C \uD0D1\uB4E4\uC774 \uB9CC\uC744 \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 164,
    color: "#c4ac88"
  },
  {
    id: "centralamazon",
    name: "Central Amazon",
    nameKo: "\uC911\uC559 \uC544\uB9C8\uC874",
    shape: "forest",
    feature: "Seasonally flooded forests and broad channels form a great tropical river landscape",
    featureKo: "\uACC4\uC808\uC5D0 \uB530\uB77C \uBB3C\uC5D0 \uC7A0\uAE30\uB294 \uC232\uACFC \uB113\uC740 \uBB3C\uAE38\uC774 \uAC70\uB300\uD55C \uC5F4\uB300 \uAC15 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 165,
    color: "#aeb9a0"
  },
  {
    id: "losglaciares",
    name: "Los Glaciares",
    nameKo: "\uB85C\uC2A4\uAE00\uB77C\uC2DC\uC544\uB808\uC2A4",
    shape: "glacier",
    feature: "Great ice tongues flow from mountain icefields toward glacial lakes",
    featureKo: "\uCEE4\uB2E4\uB780 \uBE59\uD558\uAC00 \uC0B0\uC545 \uBE59\uC6D0\uC5D0\uC11C \uBE59\uD558\uD638\uB97C \uD5A5\uD574 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4",
    seed: 166,
    color: "#bc8b70"
  },
  {
    id: "quebrada",
    name: "Quebrada de Humahuaca",
    nameKo: "\uC6B0\uB9C8\uC6B0\uC544\uCE74 \uD611\uACE1",
    shape: "redrocks",
    feature: "Banded rock slopes frame a long valley used as a cultural route",
    featureKo: "\uB760 \uBAA8\uC591 \uC9C0\uCE35\uC758 \uBE44\uD0C8\uC774 \uC624\uB79C \uAD50\uB958 \uACBD\uB85C\uC600\uB358 \uAE34 \uACC4\uACE1\uC744 \uB458\uB7EC\uC309\uB2C8\uB2E4",
    seed: 167,
    color: "#8baba4"
  },
  {
    id: "nazca",
    name: "Nazca Lines",
    nameKo: "\uB098\uC2A4\uCE74 \uC9C0\uC0C1\uD654",
    shape: "geoglyph",
    feature: "Long lines and enormous animal figures are traced across an arid plateau",
    featureKo: "\uAC74\uC870\uD55C \uACE0\uC6D0 \uC704\uC5D0 \uAE34 \uC120\uACFC \uAC70\uB300\uD55C \uB3D9\uBB3C \uD615\uC0C1\uC774 \uADF8\uB824\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 168,
    color: "#d3b17c"
  },
  {
    id: "chanchan",
    name: "Chan Chan",
    nameKo: "\uCC2C\uCC2C",
    shape: "adobe",
    feature: "High earthen walls enclose courtyards and geometric reliefs in a coastal city",
    featureKo: "\uD574\uC548 \uB3C4\uC2DC\uC758 \uB192\uC740 \uD759\uBCBD \uC548\uC5D0 \uC548\uB730\uACFC \uAE30\uD558\uD559\uC801 \uBD80\uC870\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 169,
    color: "#b7a28c"
  },
  {
    id: "valparaiso",
    name: "Valpara\xEDso",
    nameKo: "\uBC1C\uD30C\uB77C\uC774\uC18C",
    shape: "harbor",
    feature: "Bright houses climb steep port hills served by historic hillside transport",
    featureKo: "\uC624\uB798\uB41C \uC5B8\uB355 \uAD50\uD1B5\uC218\uB2E8\uC774 \uC774\uC5B4 \uC8FC\uB294 \uD56D\uAD6C\uC758 \uBE44\uD0C8\uC5D0 \uBC1D\uC740 \uC9D1\uB4E4\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 170,
    color: "#829b8a"
  },
  {
    id: "chiloe",
    name: "Chilo\xE9 Churches",
    nameKo: "\uCE60\uB85C\uC5D0 \uAD50\uD68C",
    shape: "woodchurch",
    feature: "Timber churches with slender towers reflect island building traditions",
    featureKo: "\uAC00\uB290\uB2E4\uB780 \uD0D1\uC744 \uAC16\uCD98 \uBAA9\uC870 \uAD50\uD68C\uB4E4\uC774 \uC12C\uC758 \uAC74\uCD95 \uC804\uD1B5\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 171,
    color: "#bca6a0"
  },
  {
    id: "abusimbel",
    name: "Abu Simbel",
    nameKo: "\uC544\uBD80\uC2EC\uBCA8",
    shape: "rocktemple",
    feature: "Colossal seated figures guard a monumental temple carved into sandstone",
    featureKo: "\uAC70\uB300\uD55C \uC88C\uC0C1\uB4E4\uC774 \uC0AC\uC554\uC744 \uAE4E\uC544 \uB9CC\uB4E0 \uC2E0\uC804\uC758 \uC785\uAD6C\uB97C \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 172,
    color: "#b69772"
  },
  {
    id: "thebes",
    name: "Ancient Thebes",
    nameKo: "\uACE0\uB300 \uD14C\uBCA0",
    shape: "columns",
    feature: "Pylons and great columned halls preserve a monumental Nile-side sacred landscape",
    featureKo: "\uAC70\uB300\uD55C \uD0D1\uBB38\uACFC \uC5F4\uC8FC \uD640\uC774 \uB098\uC77C\uAC15 \uC8FC\uBCC0\uC758 \uC2E0\uC131\uD55C \uACBD\uAD00\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 173,
    color: "#c4ac88"
  },
  {
    id: "historicairo",
    name: "Historic Cairo",
    nameKo: "\uCE74\uC774\uB85C \uAD6C\uB3C4\uC2EC",
    shape: "mosque",
    feature: "Domes and minarets rise above the close streets of a historic Islamic city",
    featureKo: "\uC774\uC2AC\uB78C \uAD6C\uB3C4\uC2DC\uC758 \uBE7D\uBE7D\uD55C \uAC70\uB9AC \uC704\uB85C \uB3D4\uACFC \uBBF8\uB098\uB808\uD2B8\uAC00 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 174,
    color: "#aeb9a0"
  },
  {
    id: "carthage",
    name: "Carthage",
    nameKo: "\uCE74\uB974\uD0C0\uACE0",
    shape: "ruins",
    feature: "Ancient walls and Roman remains overlook the Mediterranean coast",
    featureKo: "\uACE0\uB300 \uC131\uBCBD\uACFC \uB85C\uB9C8 \uC720\uC801\uC774 \uC9C0\uC911\uD574 \uD574\uC548\uC744 \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 175,
    color: "#bc8b70"
  },
  {
    id: "kairouan",
    name: "Great Mosque of Kairouan",
    nameKo: "\uCE74\uC774\uB974\uC644 \uB300\uBAA8\uC2A4\uD06C",
    shape: "mosque",
    feature: "A square minaret watches over the broad courtyard of a historic mosque",
    featureKo: "\uC0AC\uAC01\uD615 \uBBF8\uB098\uB808\uD2B8\uAC00 \uC624\uB798\uB41C \uBAA8\uC2A4\uD06C\uC758 \uB113\uC740 \uC548\uB730\uC744 \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 176,
    color: "#8baba4"
  },
  {
    id: "dougga",
    name: "Dougga",
    nameKo: "\uB450\uAC00",
    shape: "columns",
    feature: "A columned temple and theatre overlook the ruins of an ancient hill town",
    featureKo: "\uAE30\uB465\uC744 \uAC16\uCD98 \uC2E0\uC804\uACFC \uADF9\uC7A5\uC774 \uACE0\uB300 \uC5B8\uB355 \uB3C4\uC2DC\uC758 \uC720\uC801\uC744 \uB0B4\uB824\uB2E4\uBD05\uB2C8\uB2E4",
    seed: 177,
    color: "#d3b17c"
  },
  {
    id: "volubilis",
    name: "Volubilis",
    nameKo: "\uBCFC\uB8E8\uBE4C\uB9AC\uC2A4",
    shape: "ruins",
    feature: "A monumental arch and standing columns mark an ancient town among open fields",
    featureKo: "\uD0C1 \uD2B8\uC778 \uB4E4\uD310 \uC0AC\uC774\uC5D0\uC11C \uAC70\uB300\uD55C \uC544\uCE58\uC640 \uAE30\uB465\uC774 \uACE0\uB300 \uB3C4\uC2DC\uC758 \uD754\uC801\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 178,
    color: "#b7a28c"
  },
  {
    id: "fes",
    name: "Fes Medina",
    nameKo: "\uD398\uC2A4 \uBA54\uB514\uB098",
    shape: "town",
    feature: "Dense lanes and traditional buildings fill the walled heart of a historic city",
    featureKo: "\uCD18\uCD18\uD55C \uACE8\uBAA9\uACFC \uC804\uD1B5 \uAC74\uBB3C\uB4E4\uC774 \uC131\uBCBD \uC548\uC758 \uC624\uB798\uB41C \uB3C4\uC2EC\uC744 \uCC44\uC6C1\uB2C8\uB2E4",
    seed: 179,
    color: "#829b8a"
  },
  {
    id: "marrakesh",
    name: "Marrakesh Medina",
    nameKo: "\uB9C8\uB77C\uCF00\uC2DC \uBA54\uB514\uB098",
    shape: "minaret",
    feature: "A square minaret rises above red walls and the dense roofs of a historic medina",
    featureKo: "\uBD89\uC740 \uC131\uBCBD\uACFC \uBA54\uB514\uB098\uC758 \uBE7D\uBE7D\uD55C \uC9C0\uBD95 \uC704\uB85C \uC0AC\uAC01\uD615 \uBBF8\uB098\uB808\uD2B8\uAC00 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 180,
    color: "#bca6a0"
  },
  {
    id: "essaouira",
    name: "Essaouira",
    nameKo: "\uC5D0\uC0AC\uC6B0\uC774\uB77C",
    shape: "harbor",
    feature: "Sea-facing ramparts and pale houses form a fortified Atlantic port",
    featureKo: "\uBC14\uB2E4\uB97C \uB9C8\uC8FC\uD55C \uC131\uBCBD\uACFC \uC605\uC740 \uC9D1\uB4E4\uC774 \uC694\uC0C8\uD654\uD55C \uB300\uC11C\uC591 \uD56D\uAD6C\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 181,
    color: "#b69772"
  },
  {
    id: "aksum",
    name: "Aksum Stelae",
    nameKo: "\uC545\uC228 \uC11D\uBE44",
    shape: "stelae",
    feature: "Tall carved stone stelae preserve the monumental traces of an ancient kingdom",
    featureKo: "\uB192\uC774 \uC0C8\uAE34 \uC11D\uBE44\uB4E4\uC774 \uACE0\uB300 \uC655\uAD6D\uC758 \uAE30\uB150\uBE44\uC801\uC778 \uD754\uC801\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 182,
    color: "#c4ac88"
  },
  {
    id: "simien",
    name: "Simien Mountains",
    nameKo: "\uC2DC\uBBF8\uC5D4\uC0B0\uB9E5",
    shape: "peaks",
    feature: "High escarpments and jagged peaks rise above deeply cut Ethiopian valleys",
    featureKo: "\uAE4A\uC774 \uD328\uC778 \uC5D0\uD2F0\uC624\uD53C\uC544 \uACC4\uACE1 \uC704\uB85C \uB192\uC740 \uB2E8\uC560\uC640 \uAC70\uCE5C \uBD09\uC6B0\uB9AC\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 183,
    color: "#aeb9a0"
  },
  {
    id: "konso",
    name: "Konso Terraces",
    nameKo: "\uCF58\uC18C \uBB38\uD654 \uACBD\uAD00",
    shape: "terraces",
    feature: "Stone-walled terraces and fortified settlements shape a cultivated highland landscape",
    featureKo: "\uB3CC\uB2F4\uC744 \uC313\uC740 \uACC4\uB2E8\uC2DD \uBC2D\uACFC \uC694\uC0C8\uD654\uD55C \uB9C8\uC744\uC774 \uACE0\uC6D0 \uACBD\uC791\uC9C0\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 184,
    color: "#bc8b70"
  },
  {
    id: "victoriafalls",
    name: "Victoria Falls",
    nameKo: "\uBE45\uD1A0\uB9AC\uC544 \uD3ED\uD3EC",
    shape: "waterfall",
    feature: "A broad river plunges into a narrow gorge and sends mist above its edge",
    featureKo: "\uB113\uC740 \uAC15\uC774 \uC881\uC740 \uD611\uACE1\uC73C\uB85C \uB5A8\uC5B4\uC9C0\uBA70 \uAC00\uC7A5\uC790\uB9AC \uC704\uB85C \uBB3C\uC548\uAC1C\uB97C \uD53C\uC6C1\uB2C8\uB2E4",
    seed: 185,
    color: "#8baba4"
  },
  {
    id: "okavango",
    name: "Okavango Delta",
    nameKo: "\uC624\uCE74\uBC29\uACE0 \uC0BC\uAC01\uC8FC",
    shape: "wetland",
    feature: "Seasonal floodwaters spread into channels and islands within an inland delta",
    featureKo: "\uACC4\uC808\uC758 \uBC94\uB78C\uC218\uAC00 \uB0B4\uB959 \uC0BC\uAC01\uC8FC\uC758 \uBB3C\uAE38\uACFC \uC12C\uB4E4 \uC0AC\uC774\uB85C \uD37C\uC838 \uB098\uAC11\uB2C8\uB2E4",
    seed: 186,
    color: "#d3b17c"
  },
  {
    id: "serengeti",
    name: "Serengeti",
    nameKo: "\uC138\uB81D\uAC8C\uD2F0",
    shape: "savanna",
    feature: "Open grasslands support great moving herds across a vast savanna ecosystem",
    featureKo: "\uD0C1 \uD2B8\uC778 \uCD08\uC6D0 \uC704\uB85C \uAC70\uB300\uD55C \uBB34\uB9AC\uB4E4\uC774 \uC774\uB3D9\uD558\uB294 \uC0AC\uBC14\uB098 \uC0DD\uD0DC\uACC4\uC785\uB2C8\uB2E4",
    seed: 187,
    color: "#b7a28c"
  },
  {
    id: "ngorongoro",
    name: "Ngorongoro",
    nameKo: "\uC751\uACE0\uB871\uACE0\uB85C",
    shape: "crater",
    feature: "A great volcanic crater encloses grasslands and lakes within a high rim",
    featureKo: "\uAC70\uB300\uD55C \uD654\uC0B0 \uBD84\uD654\uAD6C\uC758 \uB192\uC740 \uD14C\uB450\uB9AC \uC548\uC5D0 \uCD08\uC6D0\uACFC \uD638\uC218\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 188,
    color: "#829b8a"
  },
  {
    id: "zanzibar",
    name: "Stone Town of Zanzibar",
    nameKo: "\uC794\uC9C0\uBC14\uB974 \uC2A4\uD1A4\uD0C0\uC6B4",
    shape: "harbor",
    feature: "Stone houses and carved doorways line the narrow streets of an Indian Ocean port",
    featureKo: "\uC778\uB3C4\uC591 \uD56D\uAD6C\uC758 \uC881\uC740 \uAC70\uB9AC\uB97C \uB530\uB77C \uC11D\uC870 \uC9D1\uACFC \uC870\uAC01\uD55C \uBB38\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 189,
    color: "#bca6a0"
  },
  {
    id: "robbeneiland",
    name: "Robben Island",
    nameKo: "\uB85C\uBCA4\uC12C",
    shape: "island",
    feature: "Low institutional buildings occupy an island with a history of imprisonment and resistance",
    featureKo: "\uC218\uAC10\uACFC \uC800\uD56D\uC758 \uC5ED\uC0AC\uB97C \uC9C0\uB2CC \uC12C \uC704\uB85C \uB0AE\uC740 \uAC74\uBB3C\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 190,
    color: "#b69772"
  },
  {
    id: "tsodilo",
    name: "Tsodilo Hills",
    nameKo: "\uCD08\uB51C\uB85C",
    shape: "redrocks",
    feature: "Rocky hills preserve a rich concentration of rock paintings in the Kalahari landscape",
    featureKo: "\uCE7C\uB77C\uD558\uB9AC\uC758 \uBC14\uC704 \uC5B8\uB355\uB4E4\uC5D0 \uC218\uB9CE\uC740 \uC554\uBCBD\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 191,
    color: "#c4ac88"
  },
  {
    id: "samarra",
    name: "Spiral Minaret of Samarra",
    nameKo: "\uC0AC\uB9C8\uB77C \uB098\uC120 \uBBF8\uB098\uB808\uD2B8",
    shape: "spiral",
    feature: "A great spiral ramp winds around a monumental brick minaret",
    featureKo: "\uAC70\uB300\uD55C \uB098\uC120\uD615 \uACBD\uC0AC\uB85C\uAC00 \uBCBD\uB3CC \uBBF8\uB098\uB808\uD2B8\uB97C \uAC10\uC2F8\uBA70 \uC62C\uB77C\uAC11\uB2C8\uB2E4",
    seed: 192,
    color: "#aeb9a0"
  },
  {
    id: "hatra",
    name: "Hatra",
    nameKo: "\uD558\uD2B8\uB77C",
    shape: "arcades",
    feature: "Great arched halls stand within the remains of a fortified ancient city",
    featureKo: "\uC694\uC0C8\uD654\uD55C \uACE0\uB300 \uB3C4\uC2DC\uC758 \uC720\uC801 \uC548\uC5D0 \uCEE4\uB2E4\uB780 \uC544\uCE58\uD615 \uC804\uAC01\uB4E4\uC774 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 193,
    color: "#bc8b70"
  },
  {
    id: "babylon",
    name: "Babylon",
    nameKo: "\uBC14\uBE4C\uB860",
    shape: "gate",
    feature: "Mud-brick walls and monumental gateways recall a great Mesopotamian capital",
    featureKo: "\uD759\uBCBD\uB3CC \uC131\uBCBD\uACFC \uAC70\uB300\uD55C \uBB38\uB4E4\uC774 \uBA54\uC18C\uD3EC\uD0C0\uBBF8\uC544\uC758 \uC61B \uC218\uB3C4\uB97C \uB5A0\uC62C\uB9AC\uAC8C \uD569\uB2C8\uB2E4",
    seed: 194,
    color: "#8baba4"
  },
  {
    id: "choghazanbil",
    name: "Chogha Zanbil",
    nameKo: "\uCD08\uAC00 \uC794\uBE4C",
    shape: "ziggurat",
    feature: "A stepped brick ziggurat anchors the remains of an ancient sacred complex",
    featureKo: "\uACC4\uB2E8\uC2DD \uBCBD\uB3CC \uC9C0\uAD6C\uB77C\uD2B8\uAC00 \uACE0\uB300 \uC131\uC5ED \uC720\uC801\uC758 \uC911\uC2EC\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 195,
    color: "#d3b17c"
  },
  {
    id: "isfahan",
    name: "Naqsh-e Jahan Square",
    nameKo: "\uB098\uD06C\uC170 \uC790\uD55C \uAD11\uC7A5",
    shape: "square",
    feature: "Domes and grand arcades surround a broad royal square",
    featureKo: "\uB113\uC740 \uC655\uC2E4 \uAD11\uC7A5\uC744 \uB3D4\uACFC \uAC70\uB300\uD55C \uC544\uCF00\uC774\uB4DC\uAC00 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 196,
    color: "#b7a28c"
  },
  {
    id: "pasargadae",
    name: "Pasargadae",
    nameKo: "\uD30C\uC0AC\uB974\uAC00\uB2E4\uC5D0",
    shape: "tomb",
    feature: "A compact stone tomb rises on stepped courses within an ancient royal landscape",
    featureKo: "\uACE0\uB300 \uC655\uC2E4 \uACBD\uAD00 \uC548\uC5D0\uC11C \uB2E8\uC815\uD55C \uC11D\uC870 \uBB18\uAC00 \uACC4\uB2E8\uD615 \uB2E8 \uC704\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 197,
    color: "#829b8a"
  },
  {
    id: "yazd",
    name: "Yazd",
    nameKo: "\uC57C\uC988\uB4DC",
    shape: "adobe",
    feature: "Earthen buildings and wind-catching towers form a city adapted to a desert climate",
    featureKo: "\uD759 \uAC74\uBB3C\uACFC \uBC14\uB78C\uC744 \uC7A1\uB294 \uD0D1\uB4E4\uC774 \uC0AC\uB9C9 \uAE30\uD6C4\uC5D0 \uC801\uC751\uD55C \uB3C4\uC2DC\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 198,
    color: "#bca6a0"
  },
  {
    id: "ephesus",
    name: "Library of Celsus at Ephesus",
    nameKo: "\uC5D0\uD398\uC18C\uC2A4 \uC140\uC218\uC2A4 \uB3C4\uC11C\uAD00",
    shape: "columns",
    feature: "A two-storey columned library facade stands beside the streets of an ancient city",
    featureKo: "\uACE0\uB300 \uB3C4\uC2DC\uC758 \uAC70\uB9AC \uC606\uC5D0 \uC774\uCE35 \uC5F4\uC8FC\uB85C \uC774\uB8E8\uC5B4\uC9C4 \uB3C4\uC11C\uAD00 \uC815\uBA74\uC774 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 199,
    color: "#b69772"
  },
  {
    id: "gobekli",
    name: "G\xF6bekli Tepe",
    nameKo: "\uAD34\uBCA0\uD074\uB9AC \uD14C\uD398",
    shape: "stelae",
    feature: "T-shaped stone pillars stand in circular arrangements at a prehistoric site",
    featureKo: "\uC120\uC0AC \uC720\uC801\uC758 \uC6D0\uD615 \uAD6C\uC870 \uC548\uC5D0 T\uC790\uD615 \uC11D\uC8FC\uB4E4\uC774 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 200,
    color: "#c4ac88"
  }
];

// plugins/landmark-island/src/expanded-decorations.ts
var expandedDecorations = landmark_expansion_default.flatMap((entry) => {
  const nature = [
    "peaks",
    "forest",
    "canyon",
    "savanna",
    "glacier",
    "redrocks",
    "badlands",
    "basalt",
    "cave",
    "volcano",
    "crater"
  ];
  const water = [
    "lakes",
    "wetland",
    "mangrove",
    "reef",
    "fjord",
    "coast",
    "waterfall",
    "geyser"
  ];
  const shape = entry.shape === "forest" ? "tree" : ["rocktemple", "minaret", "adobe"].includes(entry.shape) ? "palm" : "flowers";
  const special = nature.includes(entry.shape) ? "bench" : water.includes(entry.shape) ? "pond" : ["castle", "fortress", "gate", "torii"].includes(entry.shape) ? "gate" : "fountain";
  return [
    {
      id: `${entry.id}-gift`,
      name: `${entry.name} garden planting`,
      landmark: entry.id,
      cost: 3,
      gift: true,
      shape,
      color: entry.color,
      walkable: shape === "flowers"
    },
    {
      id: `${entry.id}-special`,
      name: `${entry.name} garden retreat`,
      landmark: entry.id,
      cost: 6,
      gift: false,
      shape: special,
      color: entry.color,
      walkable: false
    }
  ];
});

// plugins/landmark-island/src/decorations.ts
var themes = [
  ["eiffel", "Paris lantern", "lamp", "Caf\xE9 bench", "bench", "#426b65"],
  [
    "colosseum",
    "Roman cypress",
    "tree",
    "Travertine fountain",
    "fountain",
    "#cdbb9a"
  ],
  [
    "stonehenge",
    "Meadow flowers",
    "flowers",
    "Standing-stone garden",
    "stones",
    "#9dadaa"
  ],
  ["liberty", "Harbor lantern", "lamp", "Promenade bench", "bench", "#69a294"],
  [
    "opera",
    "Coastal flowers",
    "flowers",
    "Harborside fountain",
    "fountain",
    "#c6dce1"
  ],
  ["fuji", "Cherry blossom tree", "tree", "Woodland gate", "gate", "#dba3ae"],
  [
    "taj",
    "Mughal garden flowers",
    "flowers",
    "Marble fountain",
    "fountain",
    "#ead9be"
  ],
  ["petra", "Desert palm", "palm", "Sandstone garden", "stones", "#cd9278"],
  [
    "chichen",
    "Tropical flowers",
    "flowers",
    "Limestone garden",
    "stones",
    "#b2bd91"
  ],
  ["angkor", "Jungle tree", "tree", "Mossy garden gate", "gate", "#79977a"],
  [
    "machu",
    "Highland flowers",
    "flowers",
    "Terrace stone bench",
    "bench",
    "#a4ac86"
  ],
  ["giza", "Oasis palm", "palm", "Oasis fountain", "fountain", "#d7bc7e"],
  ["gyeongbokgung", "Palace pine", "tree", "Courtyard gate", "gate", "#688e76"],
  [
    "merlion",
    "Bay flowers",
    "flowers",
    "Lion City fountain",
    "fountain",
    "#a4c6c0"
  ],
  [
    "brandenburg",
    "Linden tree",
    "tree",
    "Berlin garden bench",
    "bench",
    "#a6b185"
  ],
  [
    "belem",
    "River lantern",
    "lamp",
    "Navigator fountain",
    "fountain",
    "#c5bb9b"
  ],
  ["christ", "Tropical palm", "palm", "Hilltop bench", "bench", "#91a98c"],
  ["burj", "Desert lantern", "lamp", "Skyline fountain", "fountain", "#8ab5bd"],
  ["hagia", "Tulip garden", "flowers", "Bosphorus gate", "gate", "#c79a85"],
  [
    "borobudur",
    "Lotus flowers",
    "flowers",
    "Volcanic stone garden",
    "stones",
    "#8f9a87"
  ],
  ["zimbabwe", "Savanna tree", "tree", "Granite garden", "stones", "#b2a487"],
  [
    "sagrada",
    "Mosaic flowers",
    "flowers",
    "Gaud\xED garden bench",
    "bench",
    "#c2ac7e"
  ],
  ["moai", "Island meadow", "flowers", "Basalt garden", "stones", "#8e9582"],
  ["greatwall", "Mountain pine", "tree", "Watchtower gate", "gate", "#a6aa7e"],
  ["cn", "Maple tree", "tree", "Lakeside bench", "bench", "#c78758"],
  [
    "kinderdijk",
    "Canal flowers",
    "flowers",
    "Windmill garden gate",
    "gate",
    "#c5af75"
  ],
  [
    "hallgrim",
    "Lava stones",
    "stones",
    "Northern light lantern",
    "lamp",
    "#879f9f"
  ],
  [
    "atomium",
    "Brussels garden flowers",
    "flowers",
    "Crystal fountain",
    "fountain",
    "#b2bcb6"
  ],
  [
    "petronas",
    "Skybridge lantern",
    "lamp",
    "Twin garden fountain",
    "fountain",
    "#83aeb5"
  ],
  [
    "shwedagon",
    "Golden garden lantern",
    "lamp",
    "Pagoda garden gate",
    "gate",
    "#d2ad57"
  ],
  [
    "acropolis",
    "Olive tree",
    "tree",
    "Athenian marble bench",
    "bench",
    "#a3ad7b"
  ],
  [
    "basil",
    "Cathedral garden flowers",
    "flowers",
    "Red Square lantern",
    "lamp",
    "#bb7e72"
  ],
  [
    "aitbenhaddou",
    "Valley date palm",
    "palm",
    "Earthen garden gate",
    "gate",
    "#c38a66"
  ],
  [
    "sigiriya",
    "Rock garden flowers",
    "flowers",
    "Lion Rock fountain",
    "fountain",
    "#a69c72"
  ],
  [
    "sossusvlei",
    "Dune stones",
    "stones",
    "Desert rest bench",
    "bench",
    "#ce9169"
  ],
  [
    "kilimanjaro",
    "Savanna tree",
    "tree",
    "Summit stone garden",
    "stones",
    "#9aa99c"
  ],
  [
    "pragueclock",
    "Old Town lantern",
    "lamp",
    "Astronomer\u2019s bench",
    "bench",
    "#bda271"
  ],
  [
    "parliament",
    "Danube garden flowers",
    "flowers",
    "Riverside fountain",
    "fountain",
    "#b68483"
  ],
  [
    "schonbrunn",
    "Palace rose bed",
    "flowers",
    "Imperial garden bench",
    "bench",
    "#d3ae84"
  ],
  [
    "matterhorn",
    "Alpine pine",
    "tree",
    "Alpine stone garden",
    "stones",
    "#8a9a8a"
  ],
  [
    "mermaid",
    "Harbour flowers",
    "flowers",
    "Seaside bench",
    "bench",
    "#9bb8b0"
  ],
  [
    "borgund",
    "Nordic woodland tree",
    "tree",
    "Carved woodland gate",
    "gate",
    "#82765b"
  ],
  [
    "helsinki",
    "Senate Square flowers",
    "flowers",
    "Cathedral garden fountain",
    "fountain",
    "#b5c3bd"
  ],
  [
    "obelisco",
    "Jacaranda tree",
    "tree",
    "Buenos Aires park bench",
    "bench",
    "#b39ac2"
  ],
  [
    "dubrovnik",
    "Adriatic lantern",
    "lamp",
    "Coastal stone garden",
    "stones",
    "#d5bc94"
  ],
  [
    "boudhanath",
    "Stupa garden flowers",
    "flowers",
    "Pilgrim\u2019s rest bench",
    "bench",
    "#d3b673"
  ],
  [
    "halong",
    "Bay garden tree",
    "tree",
    "Limestone garden rocks",
    "stones",
    "#83a997"
  ],
  ["hegra", "Oasis palm", "palm", "Sandstone garden gate", "gate", "#cdac84"],
  [
    "lotte",
    "Seoul skyline lantern",
    "lamp",
    "Sky garden bench",
    "bench",
    "#8caeb3"
  ],
  [
    "marinabaysands",
    "Bay rooftop palm",
    "palm",
    "SkyPark fountain",
    "fountain",
    "#8da991"
  ],
  [
    "guggenheim",
    "Riverside flower bed",
    "flowers",
    "Sculpture garden stones",
    "stones",
    "#afafa0"
  ],
  [
    "nmoq",
    "Desert rose stones",
    "stones",
    "Doha garden lantern",
    "lamp",
    "#cfb28f"
  ],
  [
    "heydar",
    "Caspian flower bed",
    "flowers",
    "Wave garden bench",
    "bench",
    "#8da8b5"
  ],
  ["baiterek", "Steppe tree", "tree", "Golden egg lantern", "lamp", "#c0a66e"],
  [
    "sangsad",
    "Dhaka courtyard tree",
    "tree",
    "Geometric garden gate",
    "gate",
    "#a9ada1"
  ],
  [
    "kigali",
    "Highland garden flowers",
    "flowers",
    "Kigali terrace bench",
    "bench",
    "#91ac7d"
  ],
  [
    "blackstar",
    "Accra coastal palm",
    "palm",
    "Independence garden gate",
    "gate",
    "#c7bb8a"
  ],
  [
    "biomuseo",
    "Biodiversity flowers",
    "flowers",
    "Tropical canopy tree",
    "tree",
    "#dfaa74"
  ],
  [
    "casapueblo",
    "Seaside artist flowers",
    "flowers",
    "White terrace fountain",
    "fountain",
    "#d2d4c2"
  ],
  [
    "taipei101",
    "Taipei bamboo garden",
    "tree",
    "Jade courtyard fountain",
    "fountain",
    "#7ca69b"
  ],
  [
    "registan",
    "Samarkand courtyard flowers",
    "flowers",
    "Mosaic garden gate",
    "gate",
    "#5c9eaf"
  ],
  [
    "qaboos",
    "Muscat courtyard palm",
    "palm",
    "Sandstone courtyard fountain",
    "fountain",
    "#d8c6a0"
  ],
  [
    "kuwaittowers",
    "Seafront turquoise lantern",
    "lamp",
    "Water-sphere fountain",
    "fountain",
    "#79aaa7"
  ],
  [
    "bahrainwtc",
    "Sea-breeze palm",
    "palm",
    "Harbor wind garden stones",
    "stones",
    "#9bb9c1"
  ],
  [
    "skytower",
    "Auckland garden tree",
    "tree",
    "Skyline lookout bench",
    "bench",
    "#8da9a4"
  ],
  [
    "tiranapyramid",
    "Tirana colour garden",
    "flowers",
    "Stepped park bench",
    "bench",
    "#dca187"
  ],
  [
    "bucharestpalace",
    "Bucharest garden tree",
    "tree",
    "Palace terrace gate",
    "gate",
    "#c6b89f"
  ],
  [
    "lalibela",
    "Highland acacia",
    "tree",
    "Rock-cut garden",
    "stones",
    "#ba9279"
  ],
  ["djenne", "Sahel palm", "palm", "Earthen courtyard gate", "gate", "#bc9570"],
  [
    "leptis",
    "Mediterranean olive",
    "tree",
    "Forum stone bench",
    "bench",
    "#c4b58e"
  ],
  [
    "eljem",
    "Arena cypress",
    "tree",
    "Sandstone fountain",
    "fountain",
    "#c9aa80"
  ],
  [
    "meroe",
    "Nile date palm",
    "palm",
    "Kush sandstone garden",
    "stones",
    "#d0a16a"
  ],
  ["timgad", "Aur\xE8s meadow", "flowers", "Colonnade bench", "bench", "#b8aa88"],
  [
    "renaissance",
    "Atlantic palm",
    "palm",
    "Horizon lantern",
    "lamp",
    "#ac9268"
  ],
  [
    "yamoussoukro",
    "Basilica garden flowers",
    "flowers",
    "Colonnade fountain",
    "fountain",
    "#d6c6a1"
  ],
  [
    "mbanzakongo",
    "Kingdom shade tree",
    "tree",
    "Old capital stone garden",
    "stones",
    "#a99c7e"
  ],
  [
    "rila",
    "Rila mountain pine",
    "tree",
    "Monastery courtyard bench",
    "bench",
    "#a7856b"
  ],
  [
    "mostar",
    "Neretva flowers",
    "flowers",
    "Riverside stone bench",
    "bench",
    "#9cbbb0"
  ],
  [
    "sava",
    "Belgrade garden tree",
    "tree",
    "Dome garden lantern",
    "lamp",
    "#9cae93"
  ],
  [
    "bled",
    "Alpine lakeside flowers",
    "flowers",
    "Island garden bench",
    "bench",
    "#94bba9"
  ],
  ["trakai", "Galv\u0117 willow", "tree", "Brick garden gate", "gate", "#b78163"],
  [
    "blackheads",
    "Riga square lantern",
    "lamp",
    "Merchant garden bench",
    "bench",
    "#bd866e"
  ],
  [
    "tallinn",
    "Baltic meadow flowers",
    "flowers",
    "Old town lantern",
    "lamp",
    "#acb7a2"
  ],
  [
    "taktsang",
    "Paro valley pine",
    "tree",
    "Cliffside prayer lantern",
    "lamp",
    "#be9d65"
  ],
  [
    "xiengthong",
    "Mekong garden flowers",
    "flowers",
    "Temple garden lantern",
    "lamp",
    "#ba9e68"
  ],
  [
    "watarun",
    "River lotus bed",
    "flowers",
    "Prang garden fountain",
    "fountain",
    "#c5b99b"
  ],
  [
    "badshahi",
    "Lahore courtyard flowers",
    "flowers",
    "Mughal stone bench",
    "bench",
    "#bd806c"
  ],
  [
    "golestan",
    "Persian rose bed",
    "flowers",
    "Palace garden fountain",
    "fountain",
    "#75a8a8"
  ],
  [
    "chinggis",
    "Steppe flowers",
    "flowers",
    "Steppe stone bench",
    "bench",
    "#b4baa9"
  ],
  [
    "tikal",
    "Pet\xE9n jungle tree",
    "tree",
    "Temple terrace stones",
    "stones",
    "#8c9e76"
  ],
  [
    "copan",
    "Cop\xE1n tropical flowers",
    "flowers",
    "Carved-stone garden",
    "stones",
    "#ada482"
  ],
  [
    "joyaceren",
    "Village garden flowers",
    "flowers",
    "Earthen village bench",
    "bench",
    "#b39c78"
  ],
  [
    "arenal",
    "Rainforest fern flowers",
    "flowers",
    "Lava stone garden",
    "stones",
    "#7d9c76"
  ],
  [
    "cartagena",
    "Caribbean bougainvillea",
    "flowers",
    "Clock square lantern",
    "lamp",
    "#d7b76b"
  ],
  [
    "quitofrancisco",
    "Andean courtyard flowers",
    "flowers",
    "Quito stone fountain",
    "fountain",
    "#c5b69b"
  ],
  [
    "tiwanaku",
    "Altiplano meadow",
    "flowers",
    "Sun gate stone garden",
    "stones",
    "#a6a083"
  ],
  [
    "sanssouci",
    "Milot garden palm",
    "palm",
    "Palace terrace bench",
    "bench",
    "#bfaa87"
  ],
  [
    "nanmadol",
    "Pohnpei palm",
    "palm",
    "Basalt lagoon garden",
    "stones",
    "#779b90"
  ],
  [
    "pngparliament",
    "Highland tropical flowers",
    "flowers",
    "Carved garden gate",
    "gate",
    "#bd8b65"
  ],
  [
    "tongapalace",
    "Tongan coastal palm",
    "palm",
    "Royal garden bench",
    "bench",
    "#c6b898"
  ]
];
var decorations = [
  {
    id: "grass",
    name: "Soft grass",
    cost: 0,
    gift: false,
    shape: "grass",
    color: "#91b96e",
    walkable: true
  },
  {
    id: "path",
    name: "Earth path",
    cost: 0,
    gift: false,
    shape: "path",
    color: "#c5ae82",
    walkable: true
  },
  {
    id: "stonepath",
    name: "Stone paving",
    cost: 0,
    gift: false,
    shape: "path",
    color: "#aeb5a1",
    walkable: true
  },
  {
    id: "oak",
    name: "Garden oak",
    cost: 0,
    gift: false,
    shape: "tree",
    color: "#79a960",
    walkable: false
  },
  ...themes.flatMap(([landmark, first, shape, second, shape2, color]) => [
    {
      id: `${landmark}-gift`,
      name: first,
      landmark,
      cost: 3,
      gift: true,
      shape,
      color,
      walkable: shape === "flowers"
    },
    {
      id: `${landmark}-special`,
      name: second,
      landmark,
      cost: 6,
      gift: false,
      shape: shape2,
      color,
      walkable: false
    }
  ]),
  {
    id: "fuji-pond",
    name: "Moonlit koi pond",
    landmark: "fuji",
    cost: 9,
    gift: false,
    shape: "pond",
    color: "#80b8ae",
    walkable: false
  },
  {
    id: "taj-pavilion",
    name: "Marble garden pavilion",
    landmark: "taj",
    cost: 12,
    gift: false,
    shape: "pavilion",
    color: "#e4dbc0",
    walkable: false
  },
  {
    id: "eiffel-rose-arch",
    name: "Rose-covered archway",
    landmark: "eiffel",
    cost: 9,
    gift: false,
    shape: "roseArch",
    color: "#bc8e91",
    walkable: false
  },
  {
    id: "angkor-fern-bed",
    name: "Fern sanctuary",
    landmark: "angkor",
    cost: 6,
    gift: false,
    shape: "fernBed",
    color: "#719c72",
    walkable: false
  },
  ...expandedDecorations,
  ...landmarks_default.map((l, index) => ({
    id: `${l.id}-plus-star`,
    name: `${l.name} star monument`,
    landmark: enhancedId(l.id),
    cost: 9,
    gift: true,
    shape: "starMonument",
    color: `hsl(${index * 137 % 360} 45% 62%)`,
    walkable: false
  }))
];
var decorationById = (id) => decorations.find((d) => d.id === id);
var DUPLICATE_MATERIALS = 3;
var isFloor = (id) => ["grass", "path", "stonepath"].includes(id);
var canRotate = (id) => ["bench", "gate"].includes(decorationById(id)?.shape ?? "");

// plugins/landmark-island/src/game.ts
var weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
var empty = () => ({
  version: 6,
  fusions: [],
  floors: [],
  landFloor: 0,
  crafts: [],
  decorations: [],
  tickets: [],
  receipts: [],
  placements: []
});
function quantity(s, id) {
  const fused = s.fusions.filter((f) => f.landmark === baseId(id)).length;
  return isEnhanced(id) ? fused : s.receipts.filter((r) => r.landmark === id).length - fused * 2;
}
function discovered(s, id) {
  return isEnhanced(id) ? s.fusions.some((f) => enhancedId(f.landmark) === id) : s.receipts.some((r) => r.landmark === id);
}
function islandLevel(s) {
  return Math.max(s.landFloor, new Set(s.receipts.map((r) => r.landmark)).size);
}
function islandLand(s) {
  return landAtLevel(islandLevel(s));
}
function unlockedCell(s, cell) {
  return isLand(cell) && (expansionLevel.get(cell) ?? Infinity) <= islandLevel(s);
}
function materials(s) {
  return (s.receipts.length - new Set(s.receipts.map((r) => r.landmark)).size) * DUPLICATE_MATERIALS - s.crafts.reduce((sum, c) => sum + decorationById(c.decoration).cost, 0);
}
function decorationQuantity(s, id) {
  const d = decorationById(id);
  if (!d) return 0;
  if (!d.landmark) return Infinity;
  return (d.gift && discovered(s, d.landmark) ? 1 : 0) + s.crafts.filter((c) => c.decoration === id).length;
}
function validate(value) {
  if (value == null) return empty();
  const raw = value;
  const version = value.version;
  const s = raw;
  if (version !== 1 && version !== 2 && version !== 3 && version !== 4 && version !== 5 && version !== 6 || !Array.isArray(s.receipts) || !Array.isArray(s.placements))
    throw Error("Unsupported or damaged save. Save was not overwritten.");
  const ids = /* @__PURE__ */ new Set();
  const cells = /* @__PURE__ */ new Set();
  const owned = /* @__PURE__ */ new Map();
  const placed = /* @__PURE__ */ new Map();
  for (const r of s.receipts) {
    if (!r || typeof r.workspaceId !== "string" || !r.workspaceId || ids.has(r.workspaceId) || !landmarks_default.some((l) => l.id === r.landmark) || typeof r.at !== "string")
      throw Error("Invalid acquisition receipt");
    ids.add(r.workspaceId);
    owned.set(r.landmark, (owned.get(r.landmark) ?? 0) + 1);
  }
  const fusions = version === 6 ? s.fusions : [];
  if (!Array.isArray(fusions)) throw Error("Invalid fusion ledger");
  const fusionIds = /* @__PURE__ */ new Set();
  const fusedCounts = /* @__PURE__ */ new Map();
  for (const f of fusions) {
    if (!f || typeof f.id !== "string" || !f.id || f.id.length > 128 || fusionIds.has(f.id) || !landmarks_default.some((l) => l.id === f.landmark) || typeof f.at !== "string" || !Number.isFinite(Date.parse(f.at)))
      throw Error("Invalid fusion ledger");
    fusionIds.add(f.id);
    fusedCounts.set(f.landmark, (fusedCounts.get(f.landmark) ?? 0) + 1);
    if (fusedCounts.get(f.landmark) * 2 > (owned.get(f.landmark) ?? 0))
      throw Error("Fusion exceeds ownership");
  }
  const inventory = { ...s, fusions };
  for (const p of s.placements) {
    if (!p || !isLand(p.cell) || cells.has(p.cell) || !landmarkById(p.landmark) || p.rotation !== void 0 && p.rotation !== 0 && p.rotation !== 1)
      throw Error("Invalid placement");
    cells.add(p.cell);
    placed.set(p.landmark, (placed.get(p.landmark) ?? 0) + 1);
    if (placed.get(p.landmark) > quantity(inventory, p.landmark))
      throw Error("Placement exceeds ownership");
  }
  const tickets = version === 1 ? s.receipts.map(({ workspaceId, at: at2 }) => ({ workspaceId, at: at2 })) : s.tickets;
  if (!Array.isArray(tickets)) throw Error("Invalid ticket ledger");
  const earned = /* @__PURE__ */ new Set();
  for (const t of tickets) {
    if (!t || typeof t.workspaceId !== "string" || !t.workspaceId || t.workspaceId.length > 256 || earned.has(t.workspaceId) || typeof t.at !== "string")
      throw Error("Invalid ticket ledger");
    earned.add(t.workspaceId);
  }
  if (s.receipts.some((r) => !earned.has(r.workspaceId)))
    throw Error("Reward has no matching ticket");
  const landFloor = version === 3 || version === 4 || version === 5 || version === 6 ? s.landFloor : Math.max(
    0,
    ...s.placements.map((p) => expansionLevel.get(p.cell) ?? 0)
  );
  const crafts = version === 3 || version === 4 || version === 5 || version === 6 ? s.crafts : [];
  const oldDecor = version === 3 || version === 4 || version === 5 || version === 6 ? s.decorations : [];
  if (!Array.isArray(oldDecor)) throw Error("Invalid decoration placements");
  const floors = version === 4 || version === 5 || version === 6 ? s.floors : oldDecor.filter((p) => p && isFloor(p.decoration));
  const decor = version === 4 || version === 5 || version === 6 ? oldDecor : oldDecor.filter((p) => !p || !isFloor(p.decoration));
  if (!Number.isInteger(landFloor) || landFloor < 0 || landFloor > MAX_LAND_LEVEL || !Array.isArray(crafts) || !Array.isArray(decor) || !Array.isArray(floors))
    throw Error("Invalid island progression");
  const craftIds = /* @__PURE__ */ new Set();
  for (const c of crafts) {
    const d = c && decorationById(c.decoration);
    if (!d?.landmark || !discovered(inventory, d.landmark) || typeof c.id !== "string" || !c.id || c.id.length > 128 || craftIds.has(c.id))
      throw Error("Invalid crafting ledger");
    craftIds.add(c.id);
  }
  const next = {
    ...s,
    fusions,
    landFloor,
    crafts,
    decorations: decor,
    floors
  };
  if (materials(next) < 0) throw Error("Not enough materials");
  for (const p of s.placements)
    if (!unlockedCell(next, p.cell)) throw Error("Land is not unlocked");
  const usedDecor = /* @__PURE__ */ new Map();
  for (const p of decor) {
    if (!p || !decorationById(p.decoration) || isFloor(p.decoration) || p.rotation !== void 0 && (!canRotate(p.decoration) || !Number.isInteger(p.rotation) || p.rotation < 0 || p.rotation > 3) || !unlockedCell(next, p.cell) || cells.has(p.cell))
      throw Error("Invalid decoration placement");
    cells.add(p.cell);
    usedDecor.set(p.decoration, (usedDecor.get(p.decoration) ?? 0) + 1);
    if (usedDecor.get(p.decoration) > decorationQuantity(next, p.decoration))
      throw Error("Decoration placement exceeds ownership");
  }
  const floorCells = /* @__PURE__ */ new Set();
  for (const p of floors) {
    if (!p || !isFloor(p.decoration) || !unlockedCell(next, p.cell) || floorCells.has(p.cell))
      throw Error("Invalid floor placement");
    floorCells.add(p.cell);
  }
  return structuredClone({
    version: 6,
    fusions: fusions.map(({ id, landmark, at: at2 }) => ({ id, landmark, at: at2 })),
    floors: floors.map(({ decoration, cell }) => ({ decoration, cell })),
    landFloor,
    crafts: crafts.map(({ id, decoration }) => ({ id, decoration })),
    decorations: decor.map(({ decoration, cell, rotation }) => ({
      decoration,
      cell,
      ...rotation ? { rotation } : {}
    })),
    tickets: tickets.map(({ workspaceId, at: at2 }) => ({ workspaceId, at: at2 })),
    receipts: s.receipts.map(({ workspaceId, landmark, at: at2 }) => ({
      workspaceId,
      landmark,
      at: at2
    })),
    placements: s.placements.map(({ landmark, cell, rotation }) => ({
      landmark,
      cell,
      ...rotation ? { rotation } : {}
    }))
  });
}
function layout(s) {
  return structuredClone({
    placements: s.placements,
    decorations: s.decorations,
    floors: s.floors
  });
}
function sameLayout(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function checkLayout(s, input) {
  const expected = input?.expected;
  if (expected !== void 0 && !sameLayout(layout(s), expected))
    throw Error("Island layout changed. Refresh before editing again.");
}
var MAX_BACKUP_BYTES = 256 * 1024;
function encodeBackup(state) {
  const text = JSON.stringify(
    {
      format: "landmark-island-backup",
      version: 1,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      state: validate(state)
    },
    null,
    2
  );
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES)
    throw Error("Backup exceeds the 256 KiB file limit. Nothing was changed.");
  return text;
}
function decodeBackup(text) {
  if (typeof text !== "string" || new TextEncoder().encode(text).length > MAX_BACKUP_BYTES)
    throw Error("Choose a Orcatopia backup of at most 256 KiB.");
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw Error("This file is not valid JSON.");
  }
  if (!data || data.format !== "landmark-island-backup" || data.version !== 1 || typeof data.exportedAt !== "string" || !Number.isFinite(Date.parse(data.exportedAt)) || !data.state || typeof data.state !== "object")
    throw Error("Unsupported or damaged Orcatopia backup.");
  return { state: validate(data.state), exportedAt: data.exportedAt };
}
function draw(random) {
  const roll = random() * 100;
  let cumulative = 0;
  for (const [tier, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (roll < cumulative) {
      const pool = landmarks_default.filter((l) => l.tier === tier);
      return pool[Math.floor(random() * pool.length)].id;
    }
  }
  throw Error("Invalid random source");
}
var Game = class {
  constructor(store, random = Math.random) {
    this.store = store;
    this.random = random;
  }
  store;
  random;
  tail = Promise.resolve();
  queue(action) {
    const result = this.tail.then(
      async () => action(validate(await this.store.read()))
    );
    this.tail = result.catch(() => {
    });
    return result;
  }
  snapshot() {
    return this.queue(async (s) => s);
  }
  exportBackup(previous = false) {
    return this.queue(async (s) => {
      if (!previous) return encodeBackup(s);
      const old = await this.store.readBackup?.();
      if (old == null) throw Error("No pre-restore backup is available yet.");
      return encodeBackup(validate(old));
    });
  }
  restore(input) {
    return this.queue(async (s) => {
      const data = input;
      const next = decodeBackup(data?.text).state;
      if (JSON.stringify(next) === JSON.stringify(s)) return s;
      if (!data?.expected || JSON.stringify(validate(data.expected)) !== JSON.stringify(s))
        throw Error(
          "Your island changed. Close Backups and review the file again before restoring."
        );
      if (!this.store.writeBackup)
        throw Error("Recovery storage is unavailable. Nothing was changed.");
      await this.store.writeBackup(s);
      await this.store.write(next);
      return next;
    });
  }
  acquire(event) {
    return this.queue(async (s) => {
      if (event.kind !== "worktree") return s;
      if (typeof event.workspaceId !== "string" || !event.workspaceId || event.workspaceId.length > 256)
        throw Error("Invalid workspace ID");
      if (s.tickets.some((r) => r.workspaceId === event.workspaceId)) return s;
      s.tickets.push({
        workspaceId: event.workspaceId,
        at: (/* @__PURE__ */ new Date()).toISOString()
      });
      await this.store.write(s);
      return s;
    });
  }
  redeem(input) {
    return this.queue(async (s) => {
      const ticketId = input?.ticketId;
      if (typeof ticketId !== "string" || !ticketId || ticketId.length > 256)
        throw Error("Invalid ticket ID");
      if (!s.tickets.some((t) => t.workspaceId === ticketId))
        throw Error("This ticket is not available");
      if (s.receipts.some((r) => r.workspaceId === ticketId)) return s;
      s.receipts.push({
        workspaceId: ticketId,
        landmark: draw(this.random),
        at: (/* @__PURE__ */ new Date()).toISOString()
      });
      await this.store.write(s);
      return s;
    });
  }
  redeemMany(input) {
    return this.queue(async (s) => {
      const ids = input?.ticketIds;
      if (!Array.isArray(ids) || ids.length !== 10 || ids.some((id) => typeof id !== "string" || !id || id.length > 256) || new Set(ids).size !== 10)
        throw Error("Choose 10 different exploration tickets.");
      if (ids.some((id) => !s.tickets.some((t) => t.workspaceId === id)))
        throw Error("One or more tickets are not available.");
      const unused = ids.filter(
        (id) => !s.receipts.some((r) => r.workspaceId === id)
      );
      if (!unused.length) return s;
      const at2 = (/* @__PURE__ */ new Date()).toISOString();
      for (const workspaceId of unused)
        s.receipts.push({ workspaceId, landmark: draw(this.random), at: at2 });
      await this.store.write(s);
      return s;
    });
  }
  fuse(input) {
    return this.queue(async (s) => {
      const p = input;
      if (typeof p?.id !== "string" || !p.id || p.id.length > 128 || typeof p.landmark !== "string" || isEnhanced(p.landmark) || !landmarkById(p.landmark))
        throw Error("Choose a normal landmark and a valid fusion request.");
      const prior = s.fusions.find((f) => f.id === p.id);
      if (prior) {
        if (prior.landmark !== p.landmark)
          throw Error("Fusion request was already used.");
        return s;
      }
      const placed = s.placements.filter(
        (item) => item.landmark === p.landmark
      ).length;
      if (quantity(s, p.landmark) - placed < 2)
        throw Error(
          "Fusion needs two unplaced normal copies. Return placed copies first."
        );
      s.fusions.push({
        id: p.id,
        landmark: p.landmark,
        at: (/* @__PURE__ */ new Date()).toISOString()
      });
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  craft(input) {
    return this.queue(async (s) => {
      const p = input;
      if (typeof p?.id !== "string" || !p.id || p.id.length > 128 || typeof p.decoration !== "string")
        throw Error("Invalid craft request");
      const prior = s.crafts.find((c) => c.id === p.id);
      if (prior) {
        if (prior.decoration !== p.decoration)
          throw Error("Craft request was already used");
        return s;
      }
      s.crafts.push({ id: p.id, decoration: p.decoration });
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  replaceLayout(input) {
    return this.queue(async (s) => {
      const p = input;
      if (!p?.layout || !p.expected) throw Error("Invalid layout request");
      const next = validate({
        ...s,
        placements: p.layout.placements,
        decorations: p.layout.decorations,
        floors: p.layout.floors
      });
      if (sameLayout(layout(s), layout(next))) return s;
      if (!sameLayout(layout(s), p.expected))
        throw Error("Island layout changed. Refresh before editing again.");
      await this.store.write(next);
      return next;
    });
  }
  rotate(input) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input;
      const item = s.placements.find((d) => d.cell === p?.cell) ?? s.decorations.find((d) => d.cell === p?.cell);
      if (!item || "decoration" in item && !canRotate(item.decoration) || !Number.isInteger(p?.rotation) || p.rotation < 0 || p.rotation > ("landmark" in item ? 1 : 3))
        throw Error(
          "Choose a piece that supports turning and a valid direction"
        );
      item.rotation = p.rotation;
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  paint(input) {
    return this.queue(async (s) => {
      const p = input;
      const d = p && decorationById(p.decoration);
      if (!d || !isFloor(d.id) && d.shape !== "flowers" || !Array.isArray(p?.cells) || !p.cells.length || p.cells.length > islandLand(s).length || new Set(p.cells).size !== p.cells.length || p.cells.some((cell) => !unlockedCell(s, cell)))
        throw Error("Invalid brush stroke");
      if (!p.expected || !sameLayout(layout(s), p.expected))
        throw Error("Island layout changed. Try the stroke again.");
      for (const cell of p.cells) {
        if (isFloor(d.id)) {
          s.floors = s.floors.filter((f) => f.cell !== cell);
          s.floors.push({ cell, decoration: d.id });
        } else {
          if (s.placements.some((x) => x.cell === cell) || s.decorations.some((x) => x.cell === cell))
            throw Error("Brush requires empty object cells");
          s.decorations.push({ cell, decoration: d.id });
        }
      }
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  decorate(input) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input;
      if (!p || !unlockedCell(s, p.cell)) throw Error("Land is not unlocked");
      if (p.layer !== void 0 && p.layer !== "floor" && p.layer !== "objects")
        throw Error("Invalid editing layer");
      const floor = p.layer === "floor" || p.decoration !== void 0 && isFloor(p.decoration);
      if (floor) {
        if (p.decoration !== void 0 && !isFloor(p.decoration))
          throw Error("Choose a floor");
        if (p.from !== void 0) {
          const old = s.floors.find((f) => f.cell === p.from);
          if (!old || p.from === p.cell || s.floors.some((f) => f.cell === p.cell))
            throw Error("Move requires an empty floor");
          old.cell = p.cell;
        } else {
          s.floors = s.floors.filter((f) => f.cell !== p.cell);
          if (p.decoration !== void 0)
            s.floors.push({ cell: p.cell, decoration: p.decoration });
        }
      } else {
        if (s.placements.some((x) => x.cell === p.cell))
          throw Error("Cell is occupied by a landmark");
        if (p.from !== void 0) {
          if (!Number.isInteger(p.from) || p.from === p.cell)
            throw Error("Choose another cell");
          const old = s.decorations.find((x) => x.cell === p.from);
          if (!old || s.decorations.some((x) => x.cell === p.cell))
            throw Error("Move requires an empty destination");
          old.cell = p.cell;
        } else {
          if (p.decoration !== void 0 && s.decorations.some((x) => x.cell === p.cell))
            throw Error("Choose an empty cell");
          s.decorations = s.decorations.filter((x) => x.cell !== p.cell);
          if (p.decoration !== void 0)
            s.decorations.push({
              cell: p.cell,
              decoration: p.decoration,
              ...p.rotation ? { rotation: p.rotation } : {}
            });
        }
      }
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  place(input) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input;
      if (!p || !unlockedCell(s, p.cell)) throw Error("Land is not unlocked");
      if (s.decorations.some((d) => d.cell === p.cell))
        throw Error("Cell is occupied by a decoration");
      if (p.from !== void 0) {
        if (!Number.isInteger(p.from) || p.from === p.cell)
          throw Error("Choose another cell");
        const old = s.placements.find((x) => x.cell === p.from);
        if (!old || s.placements.some((x) => x.cell === p.cell))
          throw Error("Move requires an empty destination");
        old.cell = p.cell;
      } else {
        if (p.landmark !== void 0 && s.placements.some((x) => x.cell === p.cell))
          throw Error("Choose an empty cell");
        s.placements = s.placements.filter((x) => x.cell !== p.cell);
        if (p.landmark !== void 0)
          s.placements.push({ cell: p.cell, landmark: p.landmark });
      }
      validate(s);
      await this.store.write(s);
      return s;
    });
  }
};

// plugins/landmark-island/src/worker/main.ts
function activate(orca) {
  const game = new Game(
    {
      read: async () => (await orca.host.call("storage.get", { key: "island-v1" })).value,
      write: async (value) => {
        await orca.host.call("storage.set", { key: "island-v1", value });
      },
      readBackup: async () => (await orca.host.call("storage.get", {
        key: "island-before-restore-v1"
      })).value,
      writeBackup: async (value) => {
        await orca.host.call("storage.set", {
          key: "island-before-restore-v1",
          value
        });
      }
    },
    () => randomInt(0, 2 ** 32) / 2 ** 32
  );
  const weather = new WeatherService({
    read: async (key) => (await orca.host.call("storage.get", { key })).value,
    write: async (key, value) => {
      await orca.host.call("storage.set", { key, value });
    }
  });
  orca.panels.handle("island.weather", (input) => weather.read(input));
  const notify = async () => {
    try {
      await orca.panels.post("island.changed", {});
    } catch (e) {
      orca.log(`Island saved; panel notification failed: ${String(e)}`);
    }
  };
  orca.events.on("workspace.created", async (event) => {
    await game.acquire(event);
    await notify();
  });
  orca.panels.handle("island.read", () => game.snapshot());
  orca.panels.handle(
    "island.backup",
    (input) => game.exportBackup(
      input?.previous === true
    )
  );
  orca.panels.handle("island.restore", async (input) => {
    const state = await game.restore(input);
    await notify();
    return state;
  });
  orca.panels.handle("island.draw", async (input) => {
    const state = await game.redeem(input);
    await notify();
    return state;
  });
  orca.panels.handle("island.drawMany", async (input) => {
    const state = await game.redeemMany(input);
    await notify();
    return state;
  });
  orca.panels.handle("island.fuse", async (input) => {
    const state = await game.fuse(input);
    await notify();
    return state;
  });
  orca.panels.handle("island.craft", async (input) => {
    const state = await game.craft(input);
    await notify();
    return state;
  });
  for (const [name, handler] of [
    ["island.layout", (input) => game.replaceLayout(input)],
    ["island.paint", (input) => game.paint(input)],
    ["island.rotate", (input) => game.rotate(input)]
  ]) {
    orca.panels.handle(name, async (input) => {
      const state = await handler(input);
      await notify();
      return state;
    });
  }
  orca.panels.handle("island.decorate", async (input) => {
    const state = await game.decorate(input);
    await notify();
    return state;
  });
  orca.panels.handle("island.place", async (input) => {
    const state = await game.place(input);
    await notify();
    return state;
  });
  const expeditions = new ExpeditionLog({
    read: async () => (await orca.host.call("storage.get", { key: "expeditions-v1" })).value,
    write: async (value) => {
      await orca.host.call("storage.set", { key: "expeditions-v1", value });
    }
  });
  const notifyExpeditions = async () => {
    try {
      await orca.panels.post("island.expeditions.changed", {});
    } catch {
      orca.log("Expedition saved; panel notification unavailable.");
    }
  };
  orca.events.on("agent.status.changed", async (event) => {
    if (await expeditions.observe(event)) await notifyExpeditions();
  });
  orca.panels.handle("island.expeditions", () => expeditions.read());
  orca.panels.handle("island.welcome", async (input) => {
    const records = await expeditions.welcome(input);
    await notifyExpeditions();
    return records;
  });
}
export {
  activate as default
};
