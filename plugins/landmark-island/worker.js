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
  }
];

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
  }
];
var decorationById = (id) => decorations.find((d) => d.id === id);
var DUPLICATE_MATERIALS = 3;
var isFloor = (id) => ["grass", "path", "stonepath"].includes(id);
var canRotate = (id) => ["bench", "gate"].includes(decorationById(id)?.shape ?? "");

// plugins/landmark-island/src/game.ts
var weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
var empty = () => ({
  version: 5,
  floors: [],
  landFloor: 0,
  crafts: [],
  decorations: [],
  tickets: [],
  receipts: [],
  placements: []
});
function quantity(s, id) {
  return s.receipts.filter((r) => r.landmark === id).length;
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
  return (d.gift && quantity(s, d.landmark) > 0 ? 1 : 0) + s.crafts.filter((c) => c.decoration === id).length;
}
function validate(value) {
  if (value == null) return empty();
  const raw = value;
  const version = value.version;
  const s = raw;
  if (version !== 1 && version !== 2 && version !== 3 && version !== 4 && version !== 5 || !Array.isArray(s.receipts) || !Array.isArray(s.placements))
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
  for (const p of s.placements) {
    if (!p || !isLand(p.cell) || cells.has(p.cell) || !landmarks_default.some((l) => l.id === p.landmark) || p.rotation !== void 0 && p.rotation !== 0 && p.rotation !== 1)
      throw Error("Invalid placement");
    cells.add(p.cell);
    placed.set(p.landmark, (placed.get(p.landmark) ?? 0) + 1);
    if (placed.get(p.landmark) > (owned.get(p.landmark) ?? 0))
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
  const landFloor = version === 3 || version === 4 || version === 5 ? s.landFloor : Math.max(
    0,
    ...s.placements.map((p) => expansionLevel.get(p.cell) ?? 0)
  );
  const crafts = version === 3 || version === 4 || version === 5 ? s.crafts : [];
  const oldDecor = version === 3 || version === 4 || version === 5 ? s.decorations : [];
  if (!Array.isArray(oldDecor)) throw Error("Invalid decoration placements");
  const floors = version === 4 || version === 5 ? s.floors : oldDecor.filter((p) => p && isFloor(p.decoration));
  const decor = version === 4 || version === 5 ? oldDecor : oldDecor.filter((p) => !p || !isFloor(p.decoration));
  if (!Number.isInteger(landFloor) || landFloor < 0 || landFloor > MAX_LAND_LEVEL || !Array.isArray(crafts) || !Array.isArray(decor) || !Array.isArray(floors))
    throw Error("Invalid island progression");
  const craftIds = /* @__PURE__ */ new Set();
  for (const c of crafts) {
    const d = c && decorationById(c.decoration);
    if (!d?.landmark || !owned.has(d.landmark) || typeof c.id !== "string" || !c.id || c.id.length > 128 || craftIds.has(c.id))
      throw Error("Invalid crafting ledger");
    craftIds.add(c.id);
  }
  const next = { ...s, landFloor, crafts, decorations: decor, floors };
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
    version: 5,
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
}
export {
  activate as default
};
