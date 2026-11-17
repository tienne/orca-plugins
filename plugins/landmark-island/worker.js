// plugins/orcatopia/src/worker/main.ts
import { randomInt } from "node:crypto";

// plugins/orcatopia/src/timezone-cities.json
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

// plugins/orcatopia/src/weather.ts
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

// plugins/orcatopia/src/worker/weather.ts
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

// plugins/orcatopia/src/worker/expeditions.ts
import { createHash } from "node:crypto";

// plugins/orcatopia/src/expeditions.ts
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

// plugins/orcatopia/src/worker/expeditions.ts
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

// plugins/orcatopia/src/landmarks.json
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
  },
  {
    id: "greatbarrierreef",
    name: "Great Barrier Reef",
    country: "Australia",
    code: "AUS",
    tier: "epic",
    lat: -18.2871,
    lon: 147.6992,
    source: "https://whc.unesco.org/en/list/154/",
    region: "Queensland",
    description: "Coral gardens and shallow lagoons spread along northeastern Australia, providing habitats for marine turtles, dugongs and many kinds of reef fish. The miniature represents part of this extensive marine landscape.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/154/"
  },
  {
    id: "bluehole",
    name: "Great Blue Hole",
    country: "Belize",
    code: "BLZ",
    tier: "rare",
    lat: 17.316,
    lon: -87.534,
    source: "https://whc.unesco.org/en/list/764/",
    region: "Lighthouse Reef",
    description: "A deep circular marine sinkhole opens within Lighthouse Reef in Belize. Blue Hole Natural Monument is one of the protected areas of the Belize Barrier Reef Reserve System; its dark water contrasts with the surrounding shallows.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/764/"
  },
  {
    id: "geirangerfjord",
    name: "Geirangerfjord",
    country: "Norway",
    code: "NOR",
    tier: "rare",
    lat: 62.105,
    lon: 7.01,
    source: "https://whc.unesco.org/en/list/1195/",
    region: "Western Norway",
    description: "Steep rock walls enclose a narrow arm of the sea in western Norway. Waterfalls descend from the mountain sides into the fjord, one of the two fjord areas recognized in the West Norwegian Fjords World Heritage property.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1195/"
  },
  {
    id: "rockislands",
    name: "Rock Islands Southern Lagoon",
    country: "Palau",
    code: "PLW",
    tier: "rare",
    lat: 7.2,
    lon: 134.35,
    source: "https://whc.unesco.org/en/list/1386/",
    region: "Southern Lagoon",
    description: "Green limestone islets rise from turquoise lagoons in Palau. Their undercut, mushroom-like profiles sit among coral reefs, while the wider Rock Islands landscape includes marine lakes and traces of former island settlements.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1386/"
  },
  {
    id: "liriver",
    name: "Li River Karst",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 25.0022,
    lon: 110.425,
    source: "https://whc.unesco.org/en/list/1248/",
    region: "Guilin",
    description: "Towering limestone peaks line the Li River around Guilin. The Lijiang karst component of South China Karst preserves a landscape of steep green hills and river corridors, represented here by a small riverside scene.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1248/"
  },
  {
    id: "middlerhine",
    name: "Upper Middle Rhine Valley",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 50.173,
    lon: 7.694,
    source: "https://whc.unesco.org/en/list/1066/",
    region: "Middle Rhine",
    description: "Castles, vineyard slopes and historic towns follow the Middle Rhine in Germany. The World Heritage cultural landscape records centuries of settlement and travel along the river; the miniature combines a river bend and a hillside castle.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1066/"
  },
  {
    id: "jam",
    name: "Minaret of Jam",
    country: "Afghanistan",
    code: "AFG",
    tier: "rare",
    lat: 34.3964166667,
    lon: 64.5158888889,
    source: "https://whc.unesco.org/en/list/211/",
    region: "Asia and the Pacific",
    description: "An intricately decorated brick minaret rises in a remote mountain valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/211/"
  },
  {
    id: "bamiyan",
    name: "Bamiyan Valley",
    country: "Afghanistan",
    code: "AFG",
    tier: "epic",
    lat: 34.8469444444,
    lon: 67.82525,
    source: "https://whc.unesco.org/en/list/208/",
    region: "Asia and the Pacific",
    description: "Tall niches and Buddhist cave sanctuaries survive along the valley's sandstone cliffs. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/208/"
  },
  {
    id: "butrint",
    name: "Butrint",
    country: "Albania",
    code: "ALB",
    tier: "rare",
    lat: 39.745732,
    lon: 20.02095,
    source: "https://whc.unesco.org/en/list/570/",
    region: "Europe and North America",
    description: "A Greek and Roman archaeological city occupies a peninsula beside a lagoon. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/570/"
  },
  {
    id: "berat",
    name: "Berat and Gjirokastra",
    country: "Albania",
    code: "ALB",
    tier: "common",
    lat: 40.0741666667,
    lon: 20.1408333333,
    source: "https://whc.unesco.org/en/list/569/",
    region: "Europe and North America",
    description: "Ottoman-period houses climb the slopes of two historic Albanian towns. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/569/"
  },
  {
    id: "haghpat",
    name: "Haghpat and Sanahin Monasteries",
    country: "Armenia",
    code: "ARM",
    tier: "rare",
    lat: 41.0991128309,
    lon: 44.6581005821,
    source: "https://whc.unesco.org/en/list/777/",
    region: "Europe and North America",
    description: "Medieval Armenian monasteries combine domed churches with local vernacular building traditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/777/"
  },
  {
    id: "geghard",
    name: "Geghard Monastery",
    country: "Armenia",
    code: "ARM",
    tier: "rare",
    lat: 40.140439,
    lon: 44.818525,
    source: "https://whc.unesco.org/en/list/960/",
    region: "Europe and North America",
    description: "Churches and tombs are cut into rock within the steep Upper Azat Valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/960/"
  },
  {
    id: "zvartnots",
    name: "Echmiatsin and Zvartnots",
    country: "Armenia",
    code: "ARM",
    tier: "common",
    lat: 40.1586666667,
    lon: 44.3246388889,
    source: "https://whc.unesco.org/en/list/1011/",
    region: "Europe and North America",
    description: "Early Armenian churches and the remains of Zvartnots illustrate the development of central-domed architecture. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1011/"
  },
  {
    id: "bakuwalled",
    name: "Walled City of Baku",
    country: "Azerbaijan",
    code: "AZE",
    tier: "rare",
    lat: 40.36666667,
    lon: 49.83333333,
    source: "https://whc.unesco.org/en/list/958/",
    region: "Europe and North America",
    description: "The Maiden Tower and Shirvanshah palace stand within Baku's surviving fortified city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/958/"
  },
  {
    id: "gobustan",
    name: "Gobustan Rock Art",
    country: "Azerbaijan",
    code: "AZE",
    tier: "common",
    lat: 40.112561,
    lon: 49.381896,
    source: "https://whc.unesco.org/en/list/1076/",
    region: "Europe and North America",
    description: "Thousands of rock engravings record long human occupation among a plateau of rocky boulders. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1076/"
  },
  {
    id: "sheki",
    name: "Sheki Khan's Palace",
    country: "Azerbaijan",
    code: "AZE",
    tier: "rare",
    lat: 41.2033333333,
    lon: 47.1875,
    source: "https://whc.unesco.org/en/list/1549/",
    region: "Europe and North America",
    description: "The khan's palace anchors a trading town shaped by silk production and caravan routes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1549/"
  },
  {
    id: "visegrad",
    name: "Vi\u0161egrad Bridge",
    country: "Bosnia and Herzegovina",
    code: "BIH",
    tier: "rare",
    lat: 43.7814444444,
    lon: 19.288025,
    source: "https://whc.unesco.org/en/list/1260/",
    region: "Europe and North America",
    description: "Eleven masonry arches carry an Ottoman bridge over the Drina River. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1260/"
  },
  {
    id: "vjetrenica",
    name: "Vjetrenica Cave",
    country: "Bosnia and Herzegovina",
    code: "BIH",
    tier: "common",
    lat: 42.845,
    lon: 17.9888888889,
    source: "https://whc.unesco.org/en/list/1673/",
    region: "Europe and North America",
    description: "A karst cave shelters an exceptionally diverse community of underground animals. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1673/"
  },
  {
    id: "boyana",
    name: "Boyana Church",
    country: "Bulgaria",
    code: "BGR",
    tier: "common",
    lat: 42.6446707809,
    lon: 23.2661877076,
    source: "https://whc.unesco.org/en/list/42/",
    region: "Europe and North America",
    description: "A small medieval church preserves vivid thirteenth-century wall paintings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/42/"
  },
  {
    id: "madara",
    name: "Madara Rider",
    country: "Bulgaria",
    code: "BGR",
    tier: "common",
    lat: 43.2774166667,
    lon: 27.1189444444,
    source: "https://whc.unesco.org/en/list/43/",
    region: "Europe and North America",
    description: "A carved horseman stands high on a near-vertical cliff above an early Bulgarian sacred site. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/43/"
  },
  {
    id: "kazanlak",
    name: "Thracian Tomb of Kazanlak",
    country: "Bulgaria",
    code: "BGR",
    tier: "common",
    lat: 42.625774,
    lon: 25.399172,
    source: "https://whc.unesco.org/en/list/44/",
    region: "Europe and North America",
    description: "A vaulted Thracian tomb preserves painted scenes of a funerary banquet. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/44/"
  },
  {
    id: "ivanovo",
    name: "Rock-Hewn Churches of Ivanovo",
    country: "Bulgaria",
    code: "BGR",
    tier: "common",
    lat: 43.694858,
    lon: 25.987893,
    source: "https://whc.unesco.org/en/list/45/",
    region: "Europe and North America",
    description: "Medieval churches and monastic cells are carved into the cliffs above a river valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/45/"
  },
  {
    id: "nessebar",
    name: "Ancient Nessebar",
    country: "Bulgaria",
    code: "BGR",
    tier: "rare",
    lat: 42.6591111111,
    lon: 27.7360277778,
    source: "https://whc.unesco.org/en/list/217/",
    region: "Europe and North America",
    description: "Churches and historic houses cluster on a rocky peninsula in the Black Sea. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/217/"
  },
  {
    id: "srebarna",
    name: "Srebarna Nature Reserve",
    country: "Bulgaria",
    code: "BGR",
    tier: "common",
    lat: 44.11444,
    lon: 27.07806,
    source: "https://whc.unesco.org/en/list/219/",
    region: "Europe and North America",
    description: "A freshwater lake beside the Danube provides breeding grounds for waterbirds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/219/"
  },
  {
    id: "pirin",
    name: "Pirin National Park",
    country: "Bulgaria",
    code: "BGR",
    tier: "rare",
    lat: 41.7427222222,
    lon: 23.4304722222,
    source: "https://whc.unesco.org/en/list/225/",
    region: "Europe and North America",
    description: "Alpine peaks, glacial lakes and forests cover the Pirin mountain landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/225/"
  },
  {
    id: "qalabahrain",
    name: "Qal'at al-Bahrain",
    country: "Bahrain",
    code: "BHR",
    tier: "common",
    lat: 26.2344444444,
    lon: 50.5183333333,
    source: "https://whc.unesco.org/en/list/1192/",
    region: "Arab States",
    description: "An archaeological mound and coastal fort preserve layers of the ancient Dilmun trading centre. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1192/"
  },
  {
    id: "dilmunmounds",
    name: "Dilmun Burial Mounds",
    country: "Bahrain",
    code: "BHR",
    tier: "common",
    lat: 26.1802777778,
    lon: 50.4733333334,
    source: "https://whc.unesco.org/en/list/1542/",
    region: "Arab States",
    description: "Extensive fields of burial mounds reflect the funerary traditions of ancient Dilmun. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1542/"
  },
  {
    id: "mir",
    name: "Mir Castle",
    country: "Belarus",
    code: "BLR",
    tier: "rare",
    lat: 53.45108333,
    lon: 26.47272222,
    source: "https://whc.unesco.org/en/list/625/",
    region: "Europe and North America",
    description: "A quadrangular castle combines Gothic, Renaissance and Baroque architectural elements. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/625/"
  },
  {
    id: "nesvizh",
    name: "Nesvizh Castle",
    country: "Belarus",
    code: "BLR",
    tier: "common",
    lat: 53.22278,
    lon: 26.69139,
    source: "https://whc.unesco.org/en/list/1196/",
    region: "Europe and North America",
    description: "The Radziwill family's palace complex joins residential buildings with a landscaped setting. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1196/"
  },
  {
    id: "paphos",
    name: "Paphos",
    country: "Cyprus",
    code: "CYP",
    tier: "common",
    lat: 34.7583333333,
    lon: 32.4055555556,
    source: "https://whc.unesco.org/en/list/79/",
    region: "Europe and North America",
    description: "Roman villas preserve richly decorated mosaic floors in an ancient coastal city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/79/"
  },
  {
    id: "troodos",
    name: "Painted Churches of Troodos",
    country: "Cyprus",
    code: "CYP",
    tier: "common",
    lat: 34.9218331732,
    lon: 33.0947801737,
    source: "https://whc.unesco.org/en/list/351/",
    region: "Europe and North America",
    description: "Mountain churches with steep timber roofs preserve Byzantine wall paintings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/351/"
  },
  {
    id: "choirokoitia",
    name: "Choirokoitia",
    country: "Cyprus",
    code: "CYP",
    tier: "common",
    lat: 34.7967406661,
    lon: 33.3439431453,
    source: "https://whc.unesco.org/en/list/848/",
    region: "Europe and North America",
    description: "Remains of circular stone houses reveal a Neolithic settlement on Cyprus. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/848/"
  },
  {
    id: "ceskykrumlov",
    name: "\u010Cesk\xFD Krumlov",
    country: "Czechia",
    code: "CZE",
    tier: "rare",
    lat: 48.8106944444,
    lon: 14.3150277778,
    source: "https://whc.unesco.org/en/list/617/",
    region: "Europe and North America",
    description: "A large castle overlooks a medieval town wrapped in bends of the Vltava River. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/617/"
  },
  {
    id: "telc",
    name: "Tel\u010D",
    country: "Czechia",
    code: "CZE",
    tier: "common",
    lat: 49.1841388889,
    lon: 15.4539722222,
    source: "https://whc.unesco.org/en/list/621/",
    region: "Europe and North America",
    description: "Renaissance and Baroque houses line a historic market square beneath a castle. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/621/"
  },
  {
    id: "zelenahora",
    name: "Zelen\xE1 Hora Pilgrimage Church",
    country: "Czechia",
    code: "CZE",
    tier: "rare",
    lat: 49.5802,
    lon: 15.9420583333,
    source: "https://whc.unesco.org/en/list/690/",
    region: "Europe and North America",
    description: "A star-shaped pilgrimage church brings together Gothic and Baroque design. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/690/"
  },
  {
    id: "kutnahora",
    name: "Kutn\xE1 Hora",
    country: "Czechia",
    code: "CZE",
    tier: "rare",
    lat: 49.959828,
    lon: 15.290152,
    source: "https://whc.unesco.org/en/list/732/",
    region: "Europe and North America",
    description: "St Barbara's church rises above a historic town made prosperous by silver mining. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/732/"
  },
  {
    id: "lednice",
    name: "Lednice-Valtice",
    country: "Czechia",
    code: "CZE",
    tier: "common",
    lat: 48.7999444444,
    lon: 16.8033861111,
    source: "https://whc.unesco.org/en/list/763/",
    region: "Europe and North America",
    description: "Castles, gardens and romantic buildings form an extensive designed landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/763/"
  },
  {
    id: "olomouc",
    name: "Holy Trinity Column in Olomouc",
    country: "Czechia",
    code: "CZE",
    tier: "common",
    lat: 49.5939361111,
    lon: 17.2504583333,
    source: "https://whc.unesco.org/en/list/859/",
    region: "Europe and North America",
    description: "A tall Baroque column is covered in religious sculpture in the town square. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/859/"
  },
  {
    id: "kromeriz",
    name: "Krom\u011B\u0159\xED\u017E Gardens and Castle",
    country: "Czechia",
    code: "CZE",
    tier: "common",
    lat: 49.296474,
    lon: 17.38186,
    source: "https://whc.unesco.org/en/list/860/",
    region: "Europe and North America",
    description: "An episcopal residence adjoins formal gardens and a landscaped pleasure garden. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/860/"
  },
  {
    id: "litomysl",
    name: "Litomy\u0161l Castle",
    country: "Czechia",
    code: "CZE",
    tier: "common",
    lat: 49.87361,
    lon: 16.31444,
    source: "https://whc.unesco.org/en/list/901/",
    region: "Europe and North America",
    description: "An arcaded Renaissance castle is decorated with elaborate sgraffito facades. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/901/"
  },
  {
    id: "mtskheta",
    name: "Mtskheta Monuments",
    country: "Georgia",
    code: "GEO",
    tier: "rare",
    lat: 41.8428333333,
    lon: 44.7209444444,
    source: "https://whc.unesco.org/en/list/708/",
    region: "Europe and North America",
    description: "Historic churches in Georgia's former capital illustrate early Christian architecture. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/708/"
  },
  {
    id: "svaneti",
    name: "Upper Svaneti",
    country: "Georgia",
    code: "GEO",
    tier: "rare",
    lat: 42.914,
    lon: 43.009,
    source: "https://whc.unesco.org/en/list/709/",
    region: "Europe and North America",
    description: "Medieval defensive tower houses stand among mountain villages in the Caucasus. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/709/"
  },
  {
    id: "gelati",
    name: "Gelati Monastery",
    country: "Georgia",
    code: "GEO",
    tier: "common",
    lat: 42.2947222222,
    lon: 42.7683333333,
    source: "https://whc.unesco.org/en/list/710/",
    region: "Europe and North America",
    description: "A medieval Georgian monastery preserves churches decorated with mosaics and paintings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/710/"
  },
  {
    id: "colchic",
    name: "Colchic Rainforests and Wetlands",
    country: "Georgia",
    code: "GEO",
    tier: "common",
    lat: 41.8620194444,
    lon: 41.8015277778,
    source: "https://whc.unesco.org/en/list/1616/",
    region: "Europe and North America",
    description: "Humid forests and wetlands survive along the warm, wet eastern Black Sea coast. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1616/"
  },
  {
    id: "split",
    name: "Diocletian's Palace at Split",
    country: "Croatia",
    code: "HRV",
    tier: "rare",
    lat: 43.5088888889,
    lon: 16.4391666667,
    source: "https://whc.unesco.org/en/list/97/",
    region: "Europe and North America",
    description: "A living historic city grew within and around a Roman emperor's palace. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/97/"
  },
  {
    id: "plitvice",
    name: "Plitvice Lakes",
    country: "Croatia",
    code: "HRV",
    tier: "epic",
    lat: 44.87778,
    lon: 15.61444,
    source: "https://whc.unesco.org/en/list/98/",
    region: "Europe and North America",
    description: "Water cascades between terraced lakes divided by natural travertine barriers. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/98/"
  },
  {
    id: "porec",
    name: "Euphrasian Basilica at Pore\u010D",
    country: "Croatia",
    code: "HRV",
    tier: "common",
    lat: 45.2285833333,
    lon: 13.5933333333,
    source: "https://whc.unesco.org/en/list/809/",
    region: "Europe and North America",
    description: "An early Christian episcopal complex preserves outstanding Byzantine mosaics. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/809/"
  },
  {
    id: "trogir",
    name: "Historic Trogir",
    country: "Croatia",
    code: "HRV",
    tier: "common",
    lat: 43.5170833333,
    lon: 16.2513611111,
    source: "https://whc.unesco.org/en/list/810/",
    region: "Europe and North America",
    description: "Romanesque churches and later palaces fill the compact historic island town. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/810/"
  },
  {
    id: "sibenik",
    name: "Cathedral of St James in \u0160ibenik",
    country: "Croatia",
    code: "HRV",
    tier: "common",
    lat: 43.7356919539,
    lon: 15.8891302403,
    source: "https://whc.unesco.org/en/list/963/",
    region: "Europe and North America",
    description: "A stone cathedral combines Gothic and Renaissance forms beneath a distinctive dome. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/963/"
  },
  {
    id: "starigrad",
    name: "Stari Grad Plain",
    country: "Croatia",
    code: "HRV",
    tier: "common",
    lat: 43.1816666667,
    lon: 16.6386111111,
    source: "https://whc.unesco.org/en/list/1240/",
    region: "Europe and North America",
    description: "Ancient field divisions remain visible in an agricultural plain on Hvar Island. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1240/"
  },
  {
    id: "holloko",
    name: "Holl\xF3k\u0151",
    country: "Hungary",
    code: "HUN",
    tier: "common",
    lat: 47.99444,
    lon: 19.52917,
    source: "https://whc.unesco.org/en/list/401/",
    region: "Europe and North America",
    description: "A traditional village preserves houses and a rural layout developed before modern agricultural change. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/401/"
  },
  {
    id: "hortobagy",
    name: "Hortob\xE1gy Puszta",
    country: "Hungary",
    code: "HUN",
    tier: "common",
    lat: 47.59458,
    lon: 21.15678,
    source: "https://whc.unesco.org/en/list/474/",
    region: "Europe and North America",
    description: "Open grasslands preserve a long tradition of pastoral life on the Hungarian plain. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/474/"
  },
  {
    id: "pannonhalma",
    name: "Pannonhalma Abbey",
    country: "Hungary",
    code: "HUN",
    tier: "common",
    lat: 47.55889,
    lon: 17.78444,
    source: "https://whc.unesco.org/en/list/758/",
    region: "Europe and North America",
    description: "A Benedictine abbey crowns a hill and records a long monastic history. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/758/"
  },
  {
    id: "tokaj",
    name: "Tokaj Wine Landscape",
    country: "Hungary",
    code: "HUN",
    tier: "common",
    lat: 48.2666666667,
    lon: 21.45,
    source: "https://whc.unesco.org/en/list/1063/",
    region: "Europe and North America",
    description: "Vineyards and historic wine cellars form a landscape shaped by Tokaj wine production. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1063/"
  },
  {
    id: "sulaimantoo",
    name: "Sulaiman-Too",
    country: "Kyrgyzstan",
    code: "KGZ",
    tier: "rare",
    lat: 40.5311111111,
    lon: 72.7827777778,
    source: "https://whc.unesco.org/en/list/1230/",
    region: "Asia and the Pacific",
    description: "A sacred mountain above Osh contains pilgrimage places, caves and rock carvings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1230/"
  },
  {
    id: "yasawi",
    name: "Mausoleum of Khoja Ahmed Yasawi",
    country: "Kazakhstan",
    code: "KAZ",
    tier: "rare",
    lat: 43.2976944444,
    lon: 68.2710555556,
    source: "https://whc.unesco.org/en/list/1103/",
    region: "Asia and the Pacific",
    description: "A monumental Timurid mausoleum combines a vast portal with domed chambers. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1103/"
  },
  {
    id: "tanbaly",
    name: "Tanbaly Petroglyphs",
    country: "Kazakhstan",
    code: "KAZ",
    tier: "common",
    lat: 43.80333333,
    lon: 75.535,
    source: "https://whc.unesco.org/en/list/1145/",
    region: "Asia and the Pacific",
    description: "Rock engravings and archaeological remains mark a landscape used over many generations. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1145/"
  },
  {
    id: "saryarka",
    name: "Saryarka Steppe and Lakes",
    country: "Kazakhstan",
    code: "KAZ",
    tier: "common",
    lat: 51.4861111111,
    lon: 64.3036111111,
    source: "https://whc.unesco.org/en/list/1102/",
    region: "Asia and the Pacific",
    description: "Steppe grasslands and lakes provide important resting places for migratory waterbirds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1102/"
  },
  {
    id: "vilnius",
    name: "Vilnius Historic Centre",
    country: "Lithuania",
    code: "LTU",
    tier: "rare",
    lat: 54.68667,
    lon: 25.29306,
    source: "https://whc.unesco.org/en/list/541/",
    region: "Europe and North America",
    description: "A historic city preserves a mixture of Gothic, Renaissance, Baroque and classical buildings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/541/"
  },
  {
    id: "kernave",
    name: "Kernav\u0117",
    country: "Lithuania",
    code: "LTU",
    tier: "common",
    lat: 54.879,
    lon: 24.853,
    source: "https://whc.unesco.org/en/list/1137/",
    region: "Europe and North America",
    description: "Fortified hill mounds overlook archaeological traces of settlements in the Neris Valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1137/"
  },
  {
    id: "kuldiga",
    name: "Old Town of Kuld\u012Bga",
    country: "Latvia",
    code: "LVA",
    tier: "common",
    lat: 56.96775,
    lon: 21.9715277778,
    source: "https://whc.unesco.org/en/list/1658/",
    region: "Europe and North America",
    description: "A historic town preserves streets and buildings associated with the Duchy of Courland. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1658/"
  },
  {
    id: "durmitor",
    name: "Durmitor National Park",
    country: "Montenegro",
    code: "MNE",
    tier: "rare",
    lat: 43.133,
    lon: 19.0166,
    source: "https://whc.unesco.org/en/list/100/",
    region: "Europe and North America",
    description: "Glaciated mountains rise above deep canyons and clear mountain lakes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/100/"
  },
  {
    id: "kotor",
    name: "Kotor Region",
    country: "Montenegro",
    code: "MNE",
    tier: "rare",
    lat: 42.48333,
    lon: 18.7,
    source: "https://whc.unesco.org/en/list/125/",
    region: "Europe and North America",
    description: "Fortified towns and churches occupy a deeply indented Adriatic bay. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/125/"
  },
  {
    id: "orkhon",
    name: "Orkhon Valley",
    country: "Mongolia",
    code: "MNG",
    tier: "common",
    lat: 47.479214,
    lon: 102.678482,
    source: "https://whc.unesco.org/en/list/1081/",
    region: "Asia and the Pacific",
    description: "Grassland, archaeological remains and monastic sites follow the Orkhon River valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1081/"
  },
  {
    id: "burkhankhaldun",
    name: "Burkhan Khaldun Mountain",
    country: "Mongolia",
    code: "MNG",
    tier: "rare",
    lat: 48.7619777778,
    lon: 109.0093277778,
    source: "https://whc.unesco.org/en/list/1440/",
    region: "Asia and the Pacific",
    description: "A sacred mountain and its surrounding landscape are associated with Mongolian worship traditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1440/"
  },
  {
    id: "deerstones",
    name: "Mongolian Deer Stones",
    country: "Mongolia",
    code: "MNG",
    tier: "common",
    lat: 47.7427777777,
    lon: 101.225833333,
    source: "https://whc.unesco.org/en/list/1621/",
    region: "Asia and the Pacific",
    description: "Bronze Age standing stones bear stylized deer and other carved motifs. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1621/"
  },
  {
    id: "sagarmatha",
    name: "Sagarmatha National Park",
    country: "Nepal",
    code: "NPL",
    tier: "legendary",
    lat: 27.96528,
    lon: 86.91306,
    source: "https://whc.unesco.org/en/list/120/",
    region: "Asia and the Pacific",
    description: "Mount Everest rises above glaciers and deeply incised valleys in a Himalayan landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/120/"
  },
  {
    id: "chitwan",
    name: "Chitwan National Park",
    country: "Nepal",
    code: "NPL",
    tier: "rare",
    lat: 27.5,
    lon: 84.33333,
    source: "https://whc.unesco.org/en/list/284/",
    region: "Asia and the Pacific",
    description: "Subtropical lowland forests and grasslands shelter rhinoceroses and Bengal tigers. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/284/"
  },
  {
    id: "lumbini",
    name: "Lumbini",
    country: "Nepal",
    code: "NPL",
    tier: "rare",
    lat: 27.46889,
    lon: 83.27611,
    source: "https://whc.unesco.org/en/list/666/",
    region: "Asia and the Pacific",
    description: "The Buddha's birthplace preserves an Ashokan pillar and archaeological remains of early sanctuaries. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/666/"
  },
  {
    id: "bahla",
    name: "Bahla Fort",
    country: "Oman",
    code: "OMN",
    tier: "rare",
    lat: 22.96417,
    lon: 57.30111,
    source: "https://whc.unesco.org/en/list/433/",
    region: "Arab States",
    description: "Mud-brick walls and towers protect an oasis settlement in the Omani interior. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/433/"
  },
  {
    id: "bat",
    name: "Bat, Al-Khutm and Al-Ayn",
    country: "Oman",
    code: "OMN",
    tier: "common",
    lat: 23.26986,
    lon: 56.745,
    source: "https://whc.unesco.org/en/list/434/",
    region: "Arab States",
    description: "Stone towers and beehive tombs preserve a Bronze Age landscape in Oman. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/434/"
  },
  {
    id: "frankincense",
    name: "Land of Frankincense",
    country: "Oman",
    code: "OMN",
    tier: "common",
    lat: 18.2511111111,
    lon: 53.6352777778,
    source: "https://whc.unesco.org/en/list/1010/",
    region: "Arab States",
    description: "Ancient ports and an inland oasis recall the trade in frankincense from Dhofar. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1010/"
  },
  {
    id: "aflaj",
    name: "Aflaj Irrigation Systems",
    country: "Oman",
    code: "OMN",
    tier: "common",
    lat: 22.9833333333,
    lon: 57.5333333333,
    source: "https://whc.unesco.org/en/list/1207/",
    region: "Arab States",
    description: "Gravity-fed water channels distribute precious water through Omani communities and farms. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1207/"
  },
  {
    id: "moenjodaro",
    name: "Moenjodaro",
    country: "Pakistan",
    code: "PAK",
    tier: "epic",
    lat: 27.32916667,
    lon: 68.13888889,
    source: "https://whc.unesco.org/en/list/138/",
    region: "Asia and the Pacific",
    description: "Planned streets and brick buildings preserve a major city of the Indus civilization. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/138/"
  },
  {
    id: "taxila",
    name: "Taxila",
    country: "Pakistan",
    code: "PAK",
    tier: "rare",
    lat: 33.7439437902,
    lon: 72.8193318876,
    source: "https://whc.unesco.org/en/list/139/",
    region: "Asia and the Pacific",
    description: "Successive ancient cities and Buddhist monuments reflect a crossroads of Asian cultures. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/139/"
  },
  {
    id: "takhtibahi",
    name: "Takht-i-Bahi",
    country: "Pakistan",
    code: "PAK",
    tier: "common",
    lat: 34.2861111111,
    lon: 71.9472222222,
    source: "https://whc.unesco.org/en/list/140/",
    region: "Asia and the Pacific",
    description: "A Buddhist monastery occupies a hilltop above the remains of a neighbouring fortified city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/140/"
  },
  {
    id: "rohtas",
    name: "Rohtas Fort",
    country: "Pakistan",
    code: "PAK",
    tier: "rare",
    lat: 32.9625,
    lon: 73.58888889,
    source: "https://whc.unesco.org/en/list/586/",
    region: "Asia and the Pacific",
    description: "Massive walls, bastions and monumental gateways enclose a sixteenth-century fort. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/586/"
  },
  {
    id: "krakow",
    name: "Krak\xF3w Historic Centre",
    country: "Poland",
    code: "POL",
    tier: "rare",
    lat: 50.0613888889,
    lon: 19.9372222222,
    source: "https://whc.unesco.org/en/list/29/",
    region: "Europe and North America",
    description: "A medieval market square, royal castle and historic churches anchor the old city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/29/"
  },
  {
    id: "warsaw",
    name: "Warsaw Historic Centre",
    country: "Poland",
    code: "POL",
    tier: "common",
    lat: 52.25,
    lon: 21.013,
    source: "https://whc.unesco.org/en/list/30/",
    region: "Europe and North America",
    description: "The reconstructed old town restores streets and buildings destroyed during the Second World War. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/30/"
  },
  {
    id: "wieliczka",
    name: "Wieliczka and Bochnia Salt Mines",
    country: "Poland",
    code: "POL",
    tier: "rare",
    lat: 49.9691666667,
    lon: 20.4175,
    source: "https://whc.unesco.org/en/list/32/",
    region: "Europe and North America",
    description: "Underground galleries and chambers record centuries of rock-salt mining. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/32/"
  },
  {
    id: "zamosc",
    name: "Zamo\u015B\u0107",
    country: "Poland",
    code: "POL",
    tier: "common",
    lat: 50.7169444444,
    lon: 23.2527777778,
    source: "https://whc.unesco.org/en/list/564/",
    region: "Europe and North America",
    description: "An arcaded market square sits within a planned Renaissance town. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/564/"
  },
  {
    id: "torun",
    name: "Medieval Toru\u0144",
    country: "Poland",
    code: "POL",
    tier: "common",
    lat: 53.0105555556,
    lon: 18.6041666667,
    source: "https://whc.unesco.org/en/list/835/",
    region: "Europe and North America",
    description: "Brick churches, town houses and fortifications preserve a medieval trading town. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/835/"
  },
  {
    id: "malbork",
    name: "Malbork Castle",
    country: "Poland",
    code: "POL",
    tier: "epic",
    lat: 54.041,
    lon: 19.0297222222,
    source: "https://whc.unesco.org/en/list/847/",
    region: "Europe and North America",
    description: "An immense brick castle complex was built by the Teutonic Order. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/847/"
  },
  {
    id: "centennialhall",
    name: "Centennial Hall in Wroc\u0142aw",
    country: "Poland",
    code: "POL",
    tier: "common",
    lat: 51.1069472222,
    lon: 17.0770138888,
    source: "https://whc.unesco.org/en/list/1165/",
    region: "Europe and North America",
    description: "A pioneering reinforced-concrete hall spans a vast circular interior beneath a ribbed dome. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1165/"
  },
  {
    id: "danubedelta",
    name: "Danube Delta",
    country: "Romania",
    code: "ROU",
    tier: "rare",
    lat: 45.08333,
    lon: 29.5,
    source: "https://whc.unesco.org/en/list/588/",
    region: "Europe and North America",
    description: "Reed beds, lakes and branching waterways support abundant birds at the Danube's mouth. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/588/"
  },
  {
    id: "hurezi",
    name: "Hurezi Monastery",
    country: "Romania",
    code: "ROU",
    tier: "common",
    lat: 45.1697222222,
    lon: 24.0072222222,
    source: "https://whc.unesco.org/en/list/597/",
    region: "Europe and North America",
    description: "A richly decorated monastery illustrates the Brancovan style of Wallachian architecture. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/597/"
  },
  {
    id: "moldavia",
    name: "Painted Churches of Moldavia",
    country: "Romania",
    code: "ROU",
    tier: "common",
    lat: 47.5938888889,
    lon: 25.8541666667,
    source: "https://whc.unesco.org/en/list/598/",
    region: "Europe and North America",
    description: "Monastic churches carry elaborate frescoes across their exterior walls. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/598/"
  },
  {
    id: "sighisoara",
    name: "Sighi\u0219oara",
    country: "Romania",
    code: "ROU",
    tier: "common",
    lat: 46.21777778,
    lon: 24.79222222,
    source: "https://whc.unesco.org/en/list/902/",
    region: "Europe and North America",
    description: "A fortified hill town preserves medieval houses and towers linked to its craft guilds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/902/"
  },
  {
    id: "maramures",
    name: "Wooden Churches of Maramure\u0219",
    country: "Romania",
    code: "ROU",
    tier: "common",
    lat: 47.7238888889,
    lon: 23.9786111111,
    source: "https://whc.unesco.org/en/list/904/",
    region: "Europe and North America",
    description: "Tall, slender wooden towers rise above steep-roofed village churches. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/904/"
  },
  {
    id: "studenica",
    name: "Studenica Monastery",
    country: "Serbia",
    code: "SRB",
    tier: "common",
    lat: 43.4865277778,
    lon: 20.5316666667,
    source: "https://whc.unesco.org/en/list/389/",
    region: "Europe and North America",
    description: "A medieval Serbian monastery preserves marble churches and Byzantine-style frescoes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/389/"
  },
  {
    id: "gamzigrad",
    name: "Gamzigrad-Romuliana",
    country: "Serbia",
    code: "SRB",
    tier: "common",
    lat: 43.8993055556,
    lon: 22.1861111111,
    source: "https://whc.unesco.org/en/list/1253/",
    region: "Europe and North America",
    description: "Fortified walls surround the palace complex built for the Roman emperor Galerius. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1253/"
  },
  {
    id: "skocjan",
    name: "\u0160kocjan Caves",
    country: "Slovenia",
    code: "SVN",
    tier: "epic",
    lat: 45.66667,
    lon: 14,
    source: "https://whc.unesco.org/en/list/390/",
    region: "Europe and North America",
    description: "An underground river has carved an immense canyon through a limestone cave system. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/390/"
  },
  {
    id: "spis",
    name: "Spi\u0161 Castle and Levo\u010Da",
    country: "Slovakia",
    code: "SVK",
    tier: "rare",
    lat: 49.0256083334,
    lon: 20.5898888889,
    source: "https://whc.unesco.org/en/list/620/",
    region: "Europe and North America",
    description: "A vast ruined castle overlooks a region of medieval towns and religious monuments. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/620/"
  },
  {
    id: "vlkolinec",
    name: "Vlkol\xEDnec",
    country: "Slovakia",
    code: "SVK",
    tier: "common",
    lat: 49.0391666667,
    lon: 19.2783333333,
    source: "https://whc.unesco.org/en/list/622/",
    region: "Europe and North America",
    description: "Traditional log houses preserve a remarkably intact mountain village. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/622/"
  },
  {
    id: "bardejov",
    name: "Bardejov",
    country: "Slovakia",
    code: "SVK",
    tier: "common",
    lat: 49.2927777778,
    lon: 21.2755555556,
    source: "https://whc.unesco.org/en/list/973/",
    region: "Europe and North America",
    description: "A fortified medieval town preserves a central market square and historic burgher houses. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/973/"
  },
  {
    id: "sarazm",
    name: "Sarazm",
    country: "Tajikistan",
    code: "TJK",
    tier: "common",
    lat: 39.5078888889,
    lon: 67.4587222222,
    source: "https://whc.unesco.org/en/list/1141/",
    region: "Asia and the Pacific",
    description: "An early settlement records contacts between farming communities and wider Central Asian trade. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1141/"
  },
  {
    id: "pamirs",
    name: "Tajik National Park",
    country: "Tajikistan",
    code: "TJK",
    tier: "epic",
    lat: 38.765,
    lon: 72.3052777778,
    source: "https://whc.unesco.org/en/list/1252/",
    region: "Asia and the Pacific",
    description: "High Pamir peaks, glaciers and mountain lakes form an immense remote wilderness. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1252/"
  },
  {
    id: "merv",
    name: "Ancient Merv",
    country: "Turkmenistan",
    code: "TKM",
    tier: "rare",
    lat: 37.6648296397,
    lon: 62.1748923337,
    source: "https://whc.unesco.org/en/list/886/",
    region: "Asia and the Pacific",
    description: "Successive walled cities preserve a major oasis centre on the Silk Roads. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/886/"
  },
  {
    id: "kunyaurgench",
    name: "Kunya-Urgench",
    country: "Turkmenistan",
    code: "TKM",
    tier: "rare",
    lat: 42.3258333333,
    lon: 59.1458333333,
    source: "https://whc.unesco.org/en/list/1199/",
    region: "Asia and the Pacific",
    description: "Minarets, mausoleums and other monuments remain from a historic city on the Amu Darya. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1199/"
  },
  {
    id: "nisa",
    name: "Parthian Fortresses of Nisa",
    country: "Turkmenistan",
    code: "TKM",
    tier: "common",
    lat: 37.9663888889,
    lon: 58.1986111111,
    source: "https://whc.unesco.org/en/list/1242/",
    region: "Asia and the Pacific",
    description: "Two archaeological tells preserve the fortresses and ceremonial buildings of Parthian Nisa. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1242/"
  },
  {
    id: "kyivsophia",
    name: "Saint Sophia and Kyiv-Pechersk Lavra",
    country: "Ukraine",
    code: "UKR",
    tier: "rare",
    lat: 50.4339333333,
    lon: 30.558375,
    source: "https://whc.unesco.org/en/list/527/",
    region: "Europe and North America",
    description: "A cathedral and monastic ensemble preserve outstanding medieval mosaics and frescoes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/527/"
  },
  {
    id: "lviv",
    name: "Lviv Historic Centre",
    country: "Ukraine",
    code: "UKR",
    tier: "common",
    lat: 49.8416666667,
    lon: 24.0319444444,
    source: "https://whc.unesco.org/en/list/865/",
    region: "Europe and North America",
    description: "A historic urban centre brings together architectural traditions from several Central European cultures. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/865/"
  },
  {
    id: "itchankala",
    name: "Itchan Kala",
    country: "Uzbekistan",
    code: "UZB",
    tier: "rare",
    lat: 41.378088,
    lon: 60.360253,
    source: "https://whc.unesco.org/en/list/543/",
    region: "Asia and the Pacific",
    description: "High mud walls enclose Khiva's inner town with mosques, minarets and palaces. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/543/"
  },
  {
    id: "bukhara",
    name: "Historic Bukhara",
    country: "Uzbekistan",
    code: "UZB",
    tier: "rare",
    lat: 39.77472,
    lon: 64.42861,
    source: "https://whc.unesco.org/en/list/602/",
    region: "Asia and the Pacific",
    description: "A Central Asian trading city preserves mosques, madrasas and monumental minarets. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/602/"
  },
  {
    id: "shakhrisyabz",
    name: "Shakhrisyabz",
    country: "Uzbekistan",
    code: "UZB",
    tier: "common",
    lat: 39.05,
    lon: 66.83333,
    source: "https://whc.unesco.org/en/list/885/",
    region: "Asia and the Pacific",
    description: "Monumental palace remains and religious buildings recall the Timurid city's importance. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/885/"
  },
  {
    id: "abomey",
    name: "Royal Palaces of Abomey",
    country: "Benin",
    code: "BEN",
    tier: "rare",
    lat: 7.1875,
    lon: 1.9922222222,
    source: "https://whc.unesco.org/en/list/323/",
    region: "Africa",
    description: "Earthen royal palaces preserve the history and artistic traditions of the Kingdom of Dahomey. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/323/"
  },
  {
    id: "loropeni",
    name: "Ruins of Lorop\xE9ni",
    country: "Burkina Faso",
    code: "BFA",
    tier: "common",
    lat: 10.2500229431,
    lon: -3.5833384934,
    source: "https://whc.unesco.org/en/list/1225/",
    region: "Africa",
    description: "Imposing stone walls survive from a fortified settlement linked to West African gold trading. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1225/"
  },
  {
    id: "tiebele",
    name: "Royal Court of Ti\xE9b\xE9l\xE9",
    country: "Burkina Faso",
    code: "BFA",
    tier: "common",
    lat: 11.0892222222,
    lon: -0.9618611111,
    source: "https://whc.unesco.org/en/list/1713/",
    region: "Africa",
    description: "An earthen royal compound displays the decorated domestic architecture of the Kassena people. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1713/"
  },
  {
    id: "virunga",
    name: "Virunga National Park",
    country: "Congo - Kinshasa",
    code: "COD",
    tier: "epic",
    lat: -0.0500064233,
    lon: 29.5142959262,
    source: "https://whc.unesco.org/en/list/63/",
    region: "Africa",
    description: "Volcanoes, forests and savannas provide habitats for mountain gorillas and diverse wildlife. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/63/"
  },
  {
    id: "okapi",
    name: "Okapi Wildlife Reserve",
    country: "Congo - Kinshasa",
    code: "COD",
    tier: "rare",
    lat: 2,
    lon: 28.5,
    source: "https://whc.unesco.org/en/list/718/",
    region: "Africa",
    description: "The Ituri rainforest shelters okapis within a rich tropical forest ecosystem. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/718/"
  },
  {
    id: "odzala",
    name: "Odzala-Kokoua Forest",
    country: "Congo - Brazzaville",
    code: "COG",
    tier: "common",
    lat: 1.3355555556,
    lon: 14.8602777778,
    source: "https://whc.unesco.org/en/list/692/",
    region: "Africa",
    description: "Congo Basin forest and clearings support forest elephants, gorillas and other wildlife. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/692/"
  },
  {
    id: "taiforest",
    name: "Ta\xEF National Park",
    country: "C\xF4te d\u2019Ivoire",
    code: "CIV",
    tier: "common",
    lat: 5.6488888889,
    lon: -7.0952777778,
    source: "https://whc.unesco.org/en/list/195/",
    region: "Africa",
    description: "One of West Africa's remaining primary tropical forests shelters a rich variety of mammals. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/195/"
  },
  {
    id: "grandbassam",
    name: "Grand-Bassam",
    country: "C\xF4te d\u2019Ivoire",
    code: "CIV",
    tier: "common",
    lat: 5.205,
    lon: -3.7316666667,
    source: "https://whc.unesco.org/en/list/1322/",
    region: "Africa",
    description: "A coastal historic town preserves a planned colonial quarter beside a traditional fishing village. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1322/"
  },
  {
    id: "dja",
    name: "Dja Faunal Reserve",
    country: "Cameroon",
    code: "CMR",
    tier: "common",
    lat: 3.125,
    lon: 12.995,
    source: "https://whc.unesco.org/en/list/407/",
    region: "Africa",
    description: "Dense equatorial rainforest is almost enclosed by the looping Dja River. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/407/"
  },
  {
    id: "benihammad",
    name: "Al Qal'a of Beni Hammad",
    country: "Algeria",
    code: "DZA",
    tier: "common",
    lat: 35.81844,
    lon: 4.78684,
    source: "https://whc.unesco.org/en/list/102/",
    region: "Arab States",
    description: "The ruins of a fortified mountain capital preserve the remains of a monumental mosque. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/102/"
  },
  {
    id: "tassili",
    name: "Tassili n'Ajjer",
    country: "Algeria",
    code: "DZA",
    tier: "rare",
    lat: 25.5,
    lon: 9,
    source: "https://whc.unesco.org/en/list/179/",
    region: "Arab States",
    description: "Sandstone formations and rock art record environmental and human changes in the Sahara. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/179/"
  },
  {
    id: "mzab",
    name: "M'Zab Valley",
    country: "Algeria",
    code: "DZA",
    tier: "common",
    lat: 32.48313,
    lon: 3.68668,
    source: "https://whc.unesco.org/en/list/188/",
    region: "Arab States",
    description: "Compact fortified oasis towns are arranged around distinctive mosque minarets. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/188/"
  },
  {
    id: "djemila",
    name: "Dj\xE9mila",
    country: "Algeria",
    code: "DZA",
    tier: "common",
    lat: 36.32056,
    lon: 5.73667,
    source: "https://whc.unesco.org/en/list/191/",
    region: "Arab States",
    description: "Roman forums, temples and houses adapt an ancient town to a mountain setting. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/191/"
  },
  {
    id: "tipasa",
    name: "Tipasa",
    country: "Algeria",
    code: "DZA",
    tier: "common",
    lat: 36.5748333333,
    lon: 2.5531666667,
    source: "https://whc.unesco.org/en/list/193/",
    region: "Arab States",
    description: "Roman and early Christian ruins overlook the Mediterranean along an ancient trading shore. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/193/"
  },
  {
    id: "asmara",
    name: "Asmara",
    country: "Eritrea",
    code: "ERI",
    tier: "common",
    lat: 15.3352777778,
    lon: 38.9358333333,
    source: "https://whc.unesco.org/en/list/1550/",
    region: "Africa",
    description: "An African capital preserves an extensive ensemble of early modernist urban architecture. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1550/"
  },
  {
    id: "fasilghebbi",
    name: "Fasil Ghebbi",
    country: "Ethiopia",
    code: "ETH",
    tier: "rare",
    lat: 12.607909,
    lon: 37.4697,
    source: "https://whc.unesco.org/en/list/19/",
    region: "Africa",
    description: "Stone castles and palaces fill the royal enclosure of Ethiopia's former capital Gondar. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/19/"
  },
  {
    id: "harar",
    name: "Harar Jugol",
    country: "Ethiopia",
    code: "ETH",
    tier: "common",
    lat: 9.3088888888,
    lon: 42.1377777777,
    source: "https://whc.unesco.org/en/list/1189/",
    region: "Africa",
    description: "A walled Islamic city preserves numerous mosques, shrines and traditional town houses. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1189/"
  },
  {
    id: "balemountains",
    name: "Bale Mountains",
    country: "Ethiopia",
    code: "ETH",
    tier: "rare",
    lat: 6.7977777778,
    lon: 39.7488888889,
    source: "https://whc.unesco.org/en/list/111/",
    region: "Africa",
    description: "High plateaux, peaks and forests shelter endemic wildlife in Ethiopia's mountain landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/111/"
  },
  {
    id: "asante",
    name: "Asante Traditional Buildings",
    country: "Ghana",
    code: "GHA",
    tier: "common",
    lat: 6.4011111111,
    lon: -1.6258333333,
    source: "https://whc.unesco.org/en/list/35/",
    region: "Africa",
    description: "Earth, timber and thatch buildings preserve the architectural traditions of Asante culture. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/35/"
  },
  {
    id: "mountkenya",
    name: "Mount Kenya",
    country: "Kenya",
    code: "KEN",
    tier: "rare",
    lat: -0.155,
    lon: 37.3155555556,
    source: "https://whc.unesco.org/en/list/800/",
    region: "Africa",
    description: "A deeply eroded ancient volcano carries rugged peaks, glaciers and alpine vegetation. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/800/"
  },
  {
    id: "turkana",
    name: "Lake Turkana",
    country: "Kenya",
    code: "KEN",
    tier: "rare",
    lat: 2.6325,
    lon: 36.5947222222,
    source: "https://whc.unesco.org/en/list/801/",
    region: "Africa",
    description: "Desert lake parks protect breeding grounds for crocodiles, hippos and migratory birds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/801/"
  },
  {
    id: "lamu",
    name: "Lamu Old Town",
    country: "Kenya",
    code: "KEN",
    tier: "common",
    lat: -2.284444444,
    lon: 40.8525,
    source: "https://whc.unesco.org/en/list/1055/",
    region: "Africa",
    description: "Coral-stone and mangrove-timber houses preserve a Swahili town on the East African coast. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1055/"
  },
  {
    id: "fortjesus",
    name: "Fort Jesus",
    country: "Kenya",
    code: "KEN",
    tier: "common",
    lat: -4.0627777778,
    lon: 39.6794444444,
    source: "https://whc.unesco.org/en/list/1295/",
    region: "Africa",
    description: "A Portuguese-built fort guards the old harbour entrance at Mombasa. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1295/"
  },
  {
    id: "thimlich",
    name: "Thimlich Ohinga",
    country: "Kenya",
    code: "KEN",
    tier: "common",
    lat: -0.8913380556,
    lon: 34.326107,
    source: "https://whc.unesco.org/en/list/1450/",
    region: "Africa",
    description: "Dry-stone enclosures preserve a fortified settlement near Lake Victoria. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1450/"
  },
  {
    id: "ambohimanga",
    name: "Royal Hill of Ambohimanga",
    country: "Madagascar",
    code: "MDG",
    tier: "common",
    lat: -18.75917,
    lon: 47.56278,
    source: "https://whc.unesco.org/en/list/950/",
    region: "Africa",
    description: "A fortified royal city and burial places occupy a sacred wooded hill. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/950/"
  },
  {
    id: "atsinanana",
    name: "Atsinanana Rainforests",
    country: "Madagascar",
    code: "MDG",
    tier: "rare",
    lat: -15.6144444444,
    lon: 50.1777777778,
    source: "https://whc.unesco.org/en/list/1257/",
    region: "Africa",
    description: "Eastern Madagascar's rainforests protect ancient lineages of plants and endemic animals. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1257/"
  },
  {
    id: "timbuktu",
    name: "Timbuktu",
    country: "Mali",
    code: "MLI",
    tier: "rare",
    lat: 16.77333333,
    lon: -2.999444444,
    source: "https://whc.unesco.org/en/list/119/",
    region: "Africa",
    description: "Earthen mosques recall the city's role as a centre of Islamic learning and trans-Saharan trade. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/119/"
  },
  {
    id: "bandiagara",
    name: "Cliff of Bandiagara",
    country: "Mali",
    code: "MLI",
    tier: "rare",
    lat: 14.4049575002,
    lon: -3.6986554779,
    source: "https://whc.unesco.org/en/list/516/",
    region: "Africa",
    description: "Dogon villages and granaries occupy a dramatic landscape of cliffs and sandy plateaux. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/516/"
  },
  {
    id: "askia",
    name: "Tomb of Askia",
    country: "Mali",
    code: "MLI",
    tier: "common",
    lat: 16.2898,
    lon: -0.04456,
    source: "https://whc.unesco.org/en/list/1139/",
    region: "Africa",
    description: "A pyramidal earthen tomb and mosque complex stand in the historic city of Gao. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1139/"
  },
  {
    id: "bancarguin",
    name: "Banc d'Arguin",
    country: "Mauritania",
    code: "MRT",
    tier: "rare",
    lat: 20.23472,
    lon: -16.10889,
    source: "https://whc.unesco.org/en/list/506/",
    region: "Arab States",
    description: "Coastal dunes, islands and shallow waters shelter immense gatherings of migratory birds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/506/"
  },
  {
    id: "lemorne",
    name: "Le Morne",
    country: "Mauritius",
    code: "MUS",
    tier: "rare",
    lat: -20.4519444444,
    lon: 57.3283333333,
    source: "https://whc.unesco.org/en/list/1259/",
    region: "Africa",
    description: "A rugged mountain overlooking the ocean recalls the refuge sought by escaped enslaved people. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1259/"
  },
  {
    id: "lakemalawi",
    name: "Lake Malawi National Park",
    country: "Malawi",
    code: "MWI",
    tier: "common",
    lat: -14.03333,
    lon: 34.88333,
    source: "https://whc.unesco.org/en/list/289/",
    region: "Africa",
    description: "Clear lake waters and rocky shores support an exceptional diversity of freshwater fish. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/289/"
  },
  {
    id: "mozambiqueisland",
    name: "Island of Mozambique",
    country: "Mozambique",
    code: "MOZ",
    tier: "common",
    lat: -15.0503611111,
    lon: 40.7263888889,
    source: "https://whc.unesco.org/en/list/599/",
    region: "Africa",
    description: "Stone-built houses and fortifications recall a historic maritime trading centre. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/599/"
  },
  {
    id: "twyfelfontein",
    name: "Twyfelfontein",
    country: "Namibia",
    code: "NAM",
    tier: "common",
    lat: -20.5947689881,
    lon: 14.3750965572,
    source: "https://whc.unesco.org/en/list/1255/",
    region: "Africa",
    description: "Rock engravings depicting animals survive in a dry sandstone landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1255/"
  },
  {
    id: "agadez",
    name: "Agadez",
    country: "Niger",
    code: "NER",
    tier: "common",
    lat: 16.9736111111,
    lon: 7.9913888889,
    source: "https://whc.unesco.org/en/list/1268/",
    region: "Africa",
    description: "An earthen minaret rises above a Saharan trading town of traditional mud-brick houses. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1268/"
  },
  {
    id: "osunosogbo",
    name: "Osun-Osogbo Sacred Grove",
    country: "Nigeria",
    code: "NGA",
    tier: "common",
    lat: 7.75556,
    lon: 4.55222,
    source: "https://whc.unesco.org/en/list/1118/",
    region: "Africa",
    description: "Sacred forest, shrines and sculptures line the Osun River near Osogbo. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1118/"
  },
  {
    id: "aldabra",
    name: "Aldabra Atoll",
    country: "Seychelles",
    code: "SYC",
    tier: "epic",
    lat: -9.416666667,
    lon: 46.41666667,
    source: "https://whc.unesco.org/en/list/185/",
    region: "Africa",
    description: "Coral islands surround a shallow lagoon that supports a large giant-tortoise population. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/185/"
  },
  {
    id: "valleedemai",
    name: "Vall\xE9e de Mai",
    country: "Seychelles",
    code: "SYC",
    tier: "common",
    lat: -4.331,
    lon: 55.738,
    source: "https://whc.unesco.org/en/list/261/",
    region: "Africa",
    description: "A remnant palm forest preserves the distinctive coco-de-mer palm. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/261/"
  },
  {
    id: "sanganeb",
    name: "Sanganeb Marine Parks",
    country: "Sudan",
    code: "SDN",
    tier: "rare",
    lat: 19.7361111111,
    lon: 37.4430555556,
    source: "https://whc.unesco.org/en/list/262/",
    region: "Arab States",
    description: "Red Sea coral reefs, islands and lagoons shelter diverse marine life. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/262/"
  },
  {
    id: "djoudj",
    name: "Djoudj Bird Sanctuary",
    country: "Senegal",
    code: "SEN",
    tier: "common",
    lat: 16.414602,
    lon: -16.237906,
    source: "https://whc.unesco.org/en/list/25/",
    region: "Africa",
    description: "Wetlands at the Senegal River delta provide a refuge for migratory waterbirds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/25/"
  },
  {
    id: "saintlouis",
    name: "Island of Saint-Louis",
    country: "Senegal",
    code: "SEN",
    tier: "common",
    lat: 16.02778,
    lon: -16.50444,
    source: "https://whc.unesco.org/en/list/956/",
    region: "Africa",
    description: "A planned historic town occupies an island near the mouth of the Senegal River. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/956/"
  },
  {
    id: "saloum",
    name: "Saloum Delta",
    country: "Senegal",
    code: "SEN",
    tier: "rare",
    lat: 13.8352777778,
    lon: -16.4986111111,
    source: "https://whc.unesco.org/en/list/1359/",
    region: "Africa",
    description: "Brackish channels, mangrove islands and shell mounds form a coastal cultural landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1359/"
  },
  {
    id: "ounianga",
    name: "Lakes of Ounianga",
    country: "Chad",
    code: "TCD",
    tier: "rare",
    lat: 19.055,
    lon: 20.5055555556,
    source: "https://whc.unesco.org/en/list/1400/",
    region: "Africa",
    description: "Permanent desert lakes lie between dunes and sandstone formations in the Sahara. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1400/"
  },
  {
    id: "ennedi",
    name: "Ennedi Massif",
    country: "Chad",
    code: "TCD",
    tier: "rare",
    lat: 17.0416666667,
    lon: 21.8627777778,
    source: "https://whc.unesco.org/en/list/1475/",
    region: "Africa",
    description: "Sandstone arches and pillars rise above desert valleys containing rock art. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1475/"
  },
  {
    id: "ichkeul",
    name: "Ichkeul National Park",
    country: "Tunisia",
    code: "TUN",
    tier: "common",
    lat: 37.16361,
    lon: 9.67472,
    source: "https://whc.unesco.org/en/list/8/",
    region: "Arab States",
    description: "A lake and marshes provide a seasonal stopping place for migrating waterbirds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/8/"
  },
  {
    id: "kilwa",
    name: "Kilwa Kisiwani and Songo Mnara",
    country: "Tanzania",
    code: "TZA",
    tier: "common",
    lat: -9.0494444444,
    lon: 39.5672222222,
    source: "https://whc.unesco.org/en/list/144/",
    region: "Africa",
    description: "Mosque and palace ruins recall prosperous Swahili trading towns on offshore islands. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/144/"
  },
  {
    id: "bwindi",
    name: "Bwindi Impenetrable Forest",
    country: "Uganda",
    code: "UGA",
    tier: "epic",
    lat: -1.047,
    lon: 29.692,
    source: "https://whc.unesco.org/en/list/682/",
    region: "Africa",
    description: "Dense montane forest shelters mountain gorillas and exceptionally rich plant life. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/682/"
  },
  {
    id: "rwenzori",
    name: "Rwenzori Mountains",
    country: "Uganda",
    code: "UGA",
    tier: "rare",
    lat: 0.223611111,
    lon: 29.92416667,
    source: "https://whc.unesco.org/en/list/684/",
    region: "Africa",
    description: "Equatorial mountains carry glaciers above moorlands and distinctive high-altitude vegetation. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/684/"
  },
  {
    id: "capefloral",
    name: "Cape Floral Region",
    country: "South Africa",
    code: "ZAF",
    tier: "rare",
    lat: -34.3558051153,
    lon: 18.4750321846,
    source: "https://whc.unesco.org/en/list/1007/",
    region: "Africa",
    description: "Fynbos shrublands contain an extraordinary concentration of endemic plant species. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1007/"
  },
  {
    id: "mapungubwe",
    name: "Mapungubwe",
    country: "South Africa",
    code: "ZAF",
    tier: "common",
    lat: -22.1925,
    lon: 29.23889,
    source: "https://whc.unesco.org/en/list/1099/",
    region: "Africa",
    description: "A sandstone hill and archaeological remains recall a southern African trading kingdom. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1099/"
  },
  {
    id: "manapools",
    name: "Mana Pools",
    country: "Zimbabwe",
    code: "ZWE",
    tier: "rare",
    lat: -15.81944444,
    lon: 29.40805556,
    source: "https://whc.unesco.org/en/list/302/",
    region: "Africa",
    description: "Floodplain pools beside the Zambezi support elephants and many other large animals. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/302/"
  },
  {
    id: "matobo",
    name: "Matobo Hills",
    country: "Zimbabwe",
    code: "ZWE",
    tier: "common",
    lat: -20.5,
    lon: 28.5,
    source: "https://whc.unesco.org/en/list/306/",
    region: "Africa",
    description: "Granite formations and rock paintings mark a landscape with enduring spiritual significance. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/306/"
  },
  {
    id: "khami",
    name: "Khami Ruins",
    country: "Zimbabwe",
    code: "ZWE",
    tier: "common",
    lat: -20.15833333,
    lon: 28.37666667,
    source: "https://whc.unesco.org/en/list/365/",
    region: "Africa",
    description: "Terraced dry-stone walls preserve the remains of a former southern African capital. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/365/"
  },
  {
    id: "antiguadockyard",
    name: "Antigua Naval Dockyard",
    country: "Antigua & Barbuda",
    code: "ATG",
    tier: "common",
    lat: 17.0069444444,
    lon: -61.7616666667,
    source: "https://whc.unesco.org/en/list/1499/",
    region: "Latin America and the Caribbean",
    description: "Georgian naval buildings and dockyard structures stand within a sheltered Caribbean harbour. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1499/"
  },
  {
    id: "bridgetown",
    name: "Historic Bridgetown",
    country: "Barbados",
    code: "BRB",
    tier: "common",
    lat: 13.0966666667,
    lon: -59.6138888889,
    source: "https://whc.unesco.org/en/list/1376/",
    region: "Latin America and the Caribbean",
    description: "A historic port and garrison preserve an early British colonial urban layout in the Caribbean. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1376/"
  },
  {
    id: "potosi",
    name: "Potos\xED",
    country: "Bolivia",
    code: "BOL",
    tier: "rare",
    lat: -19.599112,
    lon: -65.749813,
    source: "https://whc.unesco.org/en/list/420/",
    region: "Latin America and the Caribbean",
    description: "A mining city below Cerro Rico preserves the legacy of large-scale silver extraction. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/420/"
  },
  {
    id: "sucre",
    name: "Historic Sucre",
    country: "Bolivia",
    code: "BOL",
    tier: "common",
    lat: -19.04799,
    lon: -65.259592,
    source: "https://whc.unesco.org/en/list/566/",
    region: "Latin America and the Caribbean",
    description: "Whitewashed churches and historic civic buildings preserve Bolivia's early capital. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/566/"
  },
  {
    id: "samaipata",
    name: "Fuerte de Samaipata",
    country: "Bolivia",
    code: "BOL",
    tier: "common",
    lat: -18.178323,
    lon: -63.820485,
    source: "https://whc.unesco.org/en/list/883/",
    region: "Latin America and the Caribbean",
    description: "A great carved rock and surrounding remains record pre-Hispanic ceremonial traditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/883/"
  },
  {
    id: "noelkempff",
    name: "Noel Kempff Mercado",
    country: "Bolivia",
    code: "BOL",
    tier: "common",
    lat: -14.26667,
    lon: -60.86667,
    source: "https://whc.unesco.org/en/list/967/",
    region: "Latin America and the Caribbean",
    description: "Forest, savanna and escarpments protect varied ecosystems at the edge of the Amazon basin. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/967/"
  },
  {
    id: "olinda",
    name: "Historic Olinda",
    country: "Brazil",
    code: "BRA",
    tier: "common",
    lat: -8.013333333,
    lon: -34.845,
    source: "https://whc.unesco.org/en/list/189/",
    region: "Latin America and the Caribbean",
    description: "Churches and colourful houses fill a hillside town shaped by the sugar economy. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/189/"
  },
  {
    id: "congonhas",
    name: "Bom Jesus do Congonhas",
    country: "Brazil",
    code: "BRA",
    tier: "rare",
    lat: -20.508201,
    lon: -43.860806,
    source: "https://whc.unesco.org/en/list/334/",
    region: "Latin America and the Caribbean",
    description: "A pilgrimage sanctuary displays Baroque sculptures along its stairway and chapels. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/334/"
  },
  {
    id: "pantanal",
    name: "Pantanal Conservation Area",
    country: "Brazil",
    code: "BRA",
    tier: "rare",
    lat: -17.656,
    lon: -57.359,
    source: "https://whc.unesco.org/en/list/999/",
    region: "Latin America and the Caribbean",
    description: "Seasonal floodwaters create a mosaic of wetlands rich in aquatic and terrestrial wildlife. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/999/"
  },
  {
    id: "fernandonoronha",
    name: "Fernando de Noronha and Atol das Rocas",
    country: "Brazil",
    code: "BRA",
    tier: "rare",
    lat: -3.8604444444,
    lon: -33.8196666667,
    source: "https://whc.unesco.org/en/list/1000/",
    region: "Latin America and the Caribbean",
    description: "Atlantic volcanic islands and an atoll provide feeding and breeding grounds for marine wildlife. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1000/"
  },
  {
    id: "lencois",
    name: "Len\xE7\xF3is Maranhenses",
    country: "Brazil",
    code: "BRA",
    tier: "epic",
    lat: -2.5366666667,
    lon: -43.0636111111,
    source: "https://whc.unesco.org/en/list/1611/",
    region: "Latin America and the Caribbean",
    description: "White coastal dunes surround seasonal rain-fed lagoons. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1611/"
  },
  {
    id: "pampulha",
    name: "Pampulha Modern Ensemble",
    country: "Brazil",
    code: "BRA",
    tier: "common",
    lat: -19.8519444444,
    lon: -43.9736111111,
    source: "https://whc.unesco.org/en/list/1493/",
    region: "Latin America and the Caribbean",
    description: "Curving modern buildings and designed gardens surround an artificial lake. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1493/"
  },
  {
    id: "lanseauxmeadows",
    name: "L'Anse aux Meadows",
    country: "Canada",
    code: "CAN",
    tier: "rare",
    lat: 51.5847222222,
    lon: -55.55,
    source: "https://whc.unesco.org/en/list/4/",
    region: "Europe and North America",
    description: "Remains of timber-framed turf buildings record a Norse settlement in Newfoundland. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/4/"
  },
  {
    id: "sgang",
    name: "SGang Gwaay",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 52.095,
    lon: -131.2202778,
    source: "https://whc.unesco.org/en/list/157/",
    region: "Europe and North America",
    description: "Carved mortuary and memorial poles survive in the remains of a Haida village. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/157/"
  },
  {
    id: "woodbuffalo",
    name: "Wood Buffalo National Park",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 59.35833333,
    lon: -112.2933333,
    source: "https://whc.unesco.org/en/list/256/",
    region: "Europe and North America",
    description: "Boreal forest and a vast inland delta support wood bison and other wildlife. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/256/"
  },
  {
    id: "oldquebec",
    name: "Old Qu\xE9bec",
    country: "Canada",
    code: "CAN",
    tier: "rare",
    lat: 46.80944444,
    lon: -71.21055556,
    source: "https://whc.unesco.org/en/list/300/",
    region: "Europe and North America",
    description: "Fortified upper and lower towns preserve a historic French colonial city in North America. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/300/"
  },
  {
    id: "rideau",
    name: "Rideau Canal",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 44.9943861111,
    lon: -75.765125,
    source: "https://whc.unesco.org/en/list/1221/",
    region: "Europe and North America",
    description: "Locks, dams and channels preserve an early nineteenth-century slackwater canal. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1221/"
  },
  {
    id: "joggins",
    name: "Joggins Fossil Cliffs",
    country: "Canada",
    code: "CAN",
    tier: "common",
    lat: 45.7097222222,
    lon: -64.4358333333,
    source: "https://whc.unesco.org/en/list/1285/",
    region: "Europe and North America",
    description: "Coastal cliffs expose fossil-rich layers from ancient coal-age tropical forests. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1285/"
  },
  {
    id: "humberstone",
    name: "Humberstone and Santa Laura",
    country: "Chile",
    code: "CHL",
    tier: "common",
    lat: -20.20582,
    lon: -69.79406,
    source: "https://whc.unesco.org/en/list/1178/",
    region: "Latin America and the Caribbean",
    description: "Abandoned nitrate works preserve industrial structures in the Atacama Desert. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1178/"
  },
  {
    id: "sewell",
    name: "Sewell Mining Town",
    country: "Chile",
    code: "CHL",
    tier: "common",
    lat: -34.0844444444,
    lon: -70.3827777777,
    source: "https://whc.unesco.org/en/list/1214/",
    region: "Latin America and the Caribbean",
    description: "A mountain mining town uses stairways to connect buildings across steep Andean slopes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1214/"
  },
  {
    id: "mompox",
    name: "Santa Cruz de Mompox",
    country: "Colombia",
    code: "COL",
    tier: "common",
    lat: 9.240492,
    lon: -74.423084,
    source: "https://whc.unesco.org/en/list/742/",
    region: "Latin America and the Caribbean",
    description: "A historic river town preserves houses and churches along the Magdalena River. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/742/"
  },
  {
    id: "sanagustin",
    name: "San Agust\xEDn Archaeological Park",
    country: "Colombia",
    code: "COL",
    tier: "rare",
    lat: 1.887475,
    lon: -76.297726,
    source: "https://whc.unesco.org/en/list/744/",
    region: "Latin America and the Caribbean",
    description: "Large stone sculptures and burial monuments preserve a distinctive Andean ceremonial landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/744/"
  },
  {
    id: "chiribiquete",
    name: "Chiribiquete National Park",
    country: "Colombia",
    code: "COL",
    tier: "epic",
    lat: 0.5252777778,
    lon: -72.7972222222,
    source: "https://whc.unesco.org/en/list/1174/",
    region: "Latin America and the Caribbean",
    description: "Table mountains rise over tropical forests containing extensive rock paintings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1174/"
  },
  {
    id: "cocosisland",
    name: "Cocos Island",
    country: "Costa Rica",
    code: "CRI",
    tier: "rare",
    lat: 5.533333333,
    lon: -87.06666667,
    source: "https://whc.unesco.org/en/list/820/",
    region: "Latin America and the Caribbean",
    description: "A remote oceanic island supports humid forest and exceptionally rich surrounding marine life. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/820/"
  },
  {
    id: "diquis",
    name: "Diqu\xEDs Stone Spheres",
    country: "Costa Rica",
    code: "CRI",
    tier: "common",
    lat: 8.910732,
    lon: -83.478855,
    source: "https://whc.unesco.org/en/list/1453/",
    region: "Latin America and the Caribbean",
    description: "Large stone spheres survive at pre-Columbian settlements in the Diqu\xEDs Delta. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1453/"
  },
  {
    id: "havana",
    name: "Old Havana",
    country: "Cuba",
    code: "CUB",
    tier: "rare",
    lat: 23.136521,
    lon: -82.352078,
    source: "https://whc.unesco.org/en/list/204/",
    region: "Latin America and the Caribbean",
    description: "Fortifications, plazas and arcaded buildings preserve a historic Caribbean port city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/204/"
  },
  {
    id: "vinales",
    name: "Vi\xF1ales Valley",
    country: "Cuba",
    code: "CUB",
    tier: "rare",
    lat: 22.61667,
    lon: -83.71667,
    source: "https://whc.unesco.org/en/list/840/",
    region: "Latin America and the Caribbean",
    description: "Limestone hills rise above a valley of traditional farms and tobacco fields. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/840/"
  },
  {
    id: "sanpedroroca",
    name: "San Pedro de la Roca Castle",
    country: "Cuba",
    code: "CUB",
    tier: "common",
    lat: 19.968446,
    lon: -75.870441,
    source: "https://whc.unesco.org/en/list/841/",
    region: "Latin America and the Caribbean",
    description: "Terraced fortifications guard a Caribbean harbour entrance from a rocky promontory. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/841/"
  },
  {
    id: "mornetrois",
    name: "Morne Trois Pitons",
    country: "Dominica",
    code: "DMA",
    tier: "rare",
    lat: 15.331113,
    lon: -61.30661,
    source: "https://whc.unesco.org/en/list/814/",
    region: "Latin America and the Caribbean",
    description: "A volcanic mountain landscape contains hot springs, fumaroles and tropical forest. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/814/"
  },
  {
    id: "santodomingo",
    name: "Colonial Santo Domingo",
    country: "Dominican Republic",
    code: "DOM",
    tier: "common",
    lat: 18.472394,
    lon: -69.885841,
    source: "https://whc.unesco.org/en/list/526/",
    region: "Latin America and the Caribbean",
    description: "An early European colonial city preserves a grid of historic streets and monuments. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/526/"
  },
  {
    id: "galapagos",
    name: "Gal\xE1pagos Islands",
    country: "Ecuador",
    code: "ECU",
    tier: "legendary",
    lat: -0.68986,
    lon: -90.501319,
    source: "https://whc.unesco.org/en/list/1/",
    region: "Latin America and the Caribbean",
    description: "Remote volcanic islands harbour distinctive wildlife shaped by isolation and ocean conditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1/"
  },
  {
    id: "sangay",
    name: "Sangay National Park",
    country: "Ecuador",
    code: "ECU",
    tier: "rare",
    lat: -1.83333,
    lon: -78.33333,
    source: "https://whc.unesco.org/en/list/260/",
    region: "Latin America and the Caribbean",
    description: "Active volcanoes rise above a range of ecosystems from tropical forest to mountain grassland. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/260/"
  },
  {
    id: "antiguaguatemala",
    name: "Antigua Guatemala",
    country: "Guatemala",
    code: "GTM",
    tier: "common",
    lat: 14.549022,
    lon: -90.75448,
    source: "https://whc.unesco.org/en/list/65/",
    region: "Latin America and the Caribbean",
    description: "Baroque churches and civic buildings preserve a former colonial capital beneath volcanoes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/65/"
  },
  {
    id: "quirigua",
    name: "Quirigu\xE1",
    country: "Guatemala",
    code: "GTM",
    tier: "common",
    lat: 15.27059,
    lon: -89.04025,
    source: "https://whc.unesco.org/en/list/149/",
    region: "Latin America and the Caribbean",
    description: "Finely carved Maya stelae and sculpted monuments survive in a tropical archaeological park. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/149/"
  },
  {
    id: "rioplatano",
    name: "R\xEDo Pl\xE1tano Biosphere Reserve",
    country: "Honduras",
    code: "HND",
    tier: "common",
    lat: 15.74444444,
    lon: -84.675,
    source: "https://whc.unesco.org/en/list/196/",
    region: "Latin America and the Caribbean",
    description: "Tropical rainforest and mountainous lowlands follow a river toward the Caribbean coast. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/196/"
  },
  {
    id: "pitons",
    name: "Saint Lucia Pitons",
    country: "St. Lucia",
    code: "LCA",
    tier: "rare",
    lat: 13.80708333,
    lon: -61.07036111,
    source: "https://whc.unesco.org/en/list/1161/",
    region: "Latin America and the Caribbean",
    description: "Two steep volcanic spires rise above the Caribbean Sea beside a volcanic landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1161/"
  },
  {
    id: "eltajin",
    name: "El Taj\xEDn",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 20.446095,
    lon: -97.377642,
    source: "https://whc.unesco.org/en/list/631/",
    region: "Latin America and the Caribbean",
    description: "Pyramids with decorative niches preserve the ceremonial core of an ancient Gulf Coast city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/631/"
  },
  {
    id: "paquime",
    name: "Paquim\xE9",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 30.367128,
    lon: -107.948122,
    source: "https://whc.unesco.org/en/list/560/",
    region: "Latin America and the Caribbean",
    description: "Multi-storeyed earthen ruins preserve a trading settlement in northern Mexico. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/560/"
  },
  {
    id: "vizcaino",
    name: "El Vizca\xEDno Whale Sanctuary",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 26.97861,
    lon: -113.164903,
    source: "https://whc.unesco.org/en/list/554/",
    region: "Latin America and the Caribbean",
    description: "Coastal lagoons provide winter breeding grounds for grey whales. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/554/"
  },
  {
    id: "xochicalco",
    name: "Xochicalco",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 18.803972,
    lon: -99.29639,
    source: "https://whc.unesco.org/en/list/939/",
    region: "Latin America and the Caribbean",
    description: "A fortified ceremonial city preserves pyramids and relief-carved monuments on a hilltop. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/939/"
  },
  {
    id: "monarch",
    name: "Monarch Butterfly Reserve",
    country: "Mexico",
    code: "MEX",
    tier: "rare",
    lat: 19.3691666667,
    lon: -100.2602777778,
    source: "https://whc.unesco.org/en/list/1290/",
    region: "Latin America and the Caribbean",
    description: "High-elevation forests shelter vast numbers of overwintering monarch butterflies. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1290/"
  },
  {
    id: "pinacate",
    name: "El Pinacate and Gran Desierto",
    country: "Mexico",
    code: "MEX",
    tier: "epic",
    lat: 32,
    lon: -113.9166666667,
    source: "https://whc.unesco.org/en/list/1410/",
    region: "Latin America and the Caribbean",
    description: "Volcanic craters and dark lava fields meet a vast sand-dune desert. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1410/"
  },
  {
    id: "padretembleque",
    name: "Padre Tembleque Aqueduct",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 19.8352777778,
    lon: -98.6625666667,
    source: "https://whc.unesco.org/en/list/1463/",
    region: "Latin America and the Caribbean",
    description: "A colonial hydraulic system includes a remarkable high arcade carrying water across a valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1463/"
  },
  {
    id: "coiba",
    name: "Coiba National Park",
    country: "Panama",
    code: "PAN",
    tier: "rare",
    lat: 7.433,
    lon: -81.766,
    source: "https://whc.unesco.org/en/list/1138/",
    region: "Latin America and the Caribbean",
    description: "Forested Pacific islands and surrounding waters protect rich marine and terrestrial ecosystems. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1138/"
  },
  {
    id: "chavin",
    name: "Chav\xEDn",
    country: "Peru",
    code: "PER",
    tier: "rare",
    lat: -9.5927725444,
    lon: -77.1784535027,
    source: "https://whc.unesco.org/en/list/330/",
    region: "Latin America and the Caribbean",
    description: "Ancient stone temples and carved monuments stand in a high Andean valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/330/"
  },
  {
    id: "huascaran",
    name: "Huascar\xE1n National Park",
    country: "Peru",
    code: "PER",
    tier: "rare",
    lat: -9.33333,
    lon: -77.4,
    source: "https://whc.unesco.org/en/list/333/",
    region: "Latin America and the Caribbean",
    description: "Glaciers and deep ravines shape the high peaks of the Cordillera Blanca. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/333/"
  },
  {
    id: "caral",
    name: "Sacred City of Caral-Supe",
    country: "Peru",
    code: "PER",
    tier: "epic",
    lat: -10.8916666667,
    lon: -77.5213888889,
    source: "https://whc.unesco.org/en/list/1269/",
    region: "Latin America and the Caribbean",
    description: "Ancient platform mounds and circular courts preserve an early urban centre in the Supe Valley. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1269/"
  },
  {
    id: "chankillo",
    name: "Chankillo",
    country: "Peru",
    code: "PER",
    tier: "rare",
    lat: -9.5568611111,
    lon: -78.2359166666,
    source: "https://whc.unesco.org/en/list/1624/",
    region: "Latin America and the Caribbean",
    description: "Thirteen towers form the horizon markers of an ancient solar observatory. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1624/"
  },
  {
    id: "paramaribo",
    name: "Paramaribo Historic Centre",
    country: "Suriname",
    code: "SUR",
    tier: "common",
    lat: 5.82611,
    lon: -55.15,
    source: "https://whc.unesco.org/en/list/940/",
    region: "Latin America and the Caribbean",
    description: "Timber buildings combine European urban planning with local building techniques. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/940/"
  },
  {
    id: "redwood",
    name: "Redwood National and State Parks",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 41.37388889,
    lon: -123.9980556,
    source: "https://whc.unesco.org/en/list/134/",
    region: "Europe and North America",
    description: "Towering coast redwoods grow along a Pacific landscape of forests, rivers and coastline. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/134/"
  },
  {
    id: "olympic",
    name: "Olympic National Park",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 47.79848,
    lon: -123.5792,
    source: "https://whc.unesco.org/en/list/151/",
    region: "Europe and North America",
    description: "Glaciated peaks and temperate rainforest meet a wild Pacific coastline. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/151/"
  },
  {
    id: "cahokia",
    name: "Cahokia Mounds",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 38.65861111,
    lon: -90.06138889,
    source: "https://whc.unesco.org/en/list/198/",
    region: "Europe and North America",
    description: "Large earthen mounds preserve the centre of a major pre-Columbian settlement. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/198/"
  },
  {
    id: "hawaiivolcanoes",
    name: "Hawaii Volcanoes",
    country: "United States",
    code: "USA",
    tier: "epic",
    lat: 19.5,
    lon: -155.25,
    source: "https://whc.unesco.org/en/list/409/",
    region: "Europe and North America",
    description: "Active shield volcanoes continually reshape a landscape of lava flows and craters. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/409/"
  },
  {
    id: "colonia",
    name: "Colonia del Sacramento",
    country: "Uruguay",
    code: "URY",
    tier: "common",
    lat: -34.47119,
    lon: -57.849898,
    source: "https://whc.unesco.org/en/list/747/",
    region: "Latin America and the Caribbean",
    description: "A historic riverside settlement preserves a mixture of Portuguese and Spanish colonial traditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/747/"
  },
  {
    id: "canaima",
    name: "Canaima National Park",
    country: "Venezuela",
    code: "VEN",
    tier: "legendary",
    lat: 5.337994,
    lon: -62.037883,
    source: "https://whc.unesco.org/en/list/701/",
    region: "Latin America and the Caribbean",
    description: "Table mountains and towering waterfalls dominate the Guiana Shield landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/701/"
  },
  {
    id: "kakadu",
    name: "Kakadu National Park",
    country: "Australia",
    code: "AUS",
    tier: "rare",
    lat: -12.1052777778,
    lon: 132.3838888889,
    source: "https://whc.unesco.org/en/list/147/",
    region: "Asia and the Pacific",
    description: "Escarpments, wetlands and rock-art sites preserve a landscape with a long Aboriginal history. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/147/"
  },
  {
    id: "uluru",
    name: "Uluru-Kata Tjuta",
    country: "Australia",
    code: "AUS",
    tier: "legendary",
    lat: -25.33333333,
    lon: 131,
    source: "https://whc.unesco.org/en/list/447/",
    region: "Asia and the Pacific",
    description: "An immense sandstone monolith and rounded rock domes rise from the central Australian plain. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/447/"
  },
  {
    id: "sharkbay",
    name: "Shark Bay",
    country: "Australia",
    code: "AUS",
    tier: "rare",
    lat: -25.48611111,
    lon: 113.4361111,
    source: "https://whc.unesco.org/en/list/578/",
    region: "Asia and the Pacific",
    description: "Seagrass beds and stromatolites occur in a broad bay on Australia's western coast. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/578/"
  },
  {
    id: "bluemountains",
    name: "Greater Blue Mountains",
    country: "Australia",
    code: "AUS",
    tier: "rare",
    lat: -33.7,
    lon: 150,
    source: "https://whc.unesco.org/en/list/917/",
    region: "Asia and the Pacific",
    description: "Sandstone plateaux and deep gorges support a remarkable diversity of eucalypt vegetation. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/917/"
  },
  {
    id: "purnululu",
    name: "Purnululu",
    country: "Australia",
    code: "AUS",
    tier: "epic",
    lat: -17.5,
    lon: 128.5,
    source: "https://whc.unesco.org/en/list/1094/",
    region: "Asia and the Pacific",
    description: "Orange and dark-striped sandstone domes form the distinctive Bungle Bungle range. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1094/"
  },
  {
    id: "ningaloo",
    name: "Ningaloo Coast",
    country: "Australia",
    code: "AUS",
    tier: "rare",
    lat: -22.451,
    lon: 113.81,
    source: "https://whc.unesco.org/en/list/1369/",
    region: "Asia and the Pacific",
    description: "An extensive fringing reef lies beside an arid coast visited by whale sharks. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1369/"
  },
  {
    id: "tongariro",
    name: "Tongariro National Park",
    country: "New Zealand",
    code: "NZL",
    tier: "epic",
    lat: -39.2770935487,
    lon: 175.568632584,
    source: "https://whc.unesco.org/en/list/421/",
    region: "Asia and the Pacific",
    description: "Volcanoes and lakes form a mountain landscape of deep cultural significance to M\u0101ori people. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/421/"
  },
  {
    id: "tewahipounamu",
    name: "Te Wahipounamu",
    country: "New Zealand",
    code: "NZL",
    tier: "rare",
    lat: -45.03602778,
    lon: 167.3196111,
    source: "https://whc.unesco.org/en/list/551/",
    region: "Asia and the Pacific",
    description: "Glaciers, fjords and ancient forests shape the southwest of New Zealand's South Island. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/551/"
  },
  {
    id: "levuka",
    name: "Levuka Historical Port Town",
    country: "Fiji",
    code: "FJI",
    tier: "common",
    lat: -17.6833777778,
    lon: 178.8345333333,
    source: "https://whc.unesco.org/en/list/1399/",
    region: "Asia and the Pacific",
    description: "Low timber buildings preserve a Pacific port town beneath steep volcanic slopes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1399/"
  },
  {
    id: "roimata",
    name: "Chief Roi Mata's Domain",
    country: "Vanuatu",
    code: "VUT",
    tier: "common",
    lat: -17.6280694444,
    lon: 168.1777194444,
    source: "https://whc.unesco.org/en/list/1280/",
    region: "Asia and the Pacific",
    description: "Settlement, burial and cave sites recall a Pacific chief and the traditions surrounding his life. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1280/"
  },
  {
    id: "eastrennell",
    name: "East Rennell",
    country: "Solomon Islands",
    code: "SLB",
    tier: "rare",
    lat: -11.68333,
    lon: 160.33333,
    source: "https://whc.unesco.org/en/list/854/",
    region: "Asia and the Pacific",
    description: "A raised coral atoll contains a large lake surrounded by dense tropical forest. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/854/"
  },
  {
    id: "kuk",
    name: "Kuk Early Agricultural Site",
    country: "Papua New Guinea",
    code: "PNG",
    tier: "common",
    lat: -5.7837111111,
    lon: 144.3317222222,
    source: "https://whc.unesco.org/en/list/887/",
    region: "Asia and the Pacific",
    description: "Ancient drainage systems record the development of agriculture in the New Guinea highlands. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/887/"
  },
  {
    id: "bagerhat",
    name: "Mosque City of Bagerhat",
    country: "Bangladesh",
    code: "BGD",
    tier: "common",
    lat: 22.66667,
    lon: 89.8,
    source: "https://whc.unesco.org/en/list/321/",
    region: "Asia and the Pacific",
    description: "Historic brick mosques and water infrastructure survive in a city founded near the Ganges delta. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/321/"
  },
  {
    id: "paharpur",
    name: "Somapura Mahavihara at Paharpur",
    country: "Bangladesh",
    code: "BGD",
    tier: "rare",
    lat: 25.03333333,
    lon: 88.98333333,
    source: "https://whc.unesco.org/en/list/322/",
    region: "Asia and the Pacific",
    description: "A great Buddhist monastery surrounds a monumental central shrine decorated with terracotta plaques. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/322/"
  },
  {
    id: "preahvihear",
    name: "Temple of Preah Vihear",
    country: "Cambodia",
    code: "KHM",
    tier: "rare",
    lat: 14.390841,
    lon: 104.680325,
    source: "https://whc.unesco.org/en/list/1224/",
    region: "Asia and the Pacific",
    description: "A sequence of sanctuaries follows a long axis along a high plateau edge. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1224/"
  },
  {
    id: "kohker",
    name: "Koh Ker",
    country: "Cambodia",
    code: "KHM",
    tier: "rare",
    lat: 13.7830555556,
    lon: 104.5372222222,
    source: "https://whc.unesco.org/en/list/1667/",
    region: "Asia and the Pacific",
    description: "A stepped temple pyramid rises above the remains of a former Khmer capital. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1667/"
  },
  {
    id: "komodo",
    name: "Komodo National Park",
    country: "Indonesia",
    code: "IDN",
    tier: "epic",
    lat: -8.54333,
    lon: 119.48944,
    source: "https://whc.unesco.org/en/list/609/",
    region: "Asia and the Pacific",
    description: "Rugged islands shelter Komodo dragons beside a rich marine environment. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/609/"
  },
  {
    id: "prambanan",
    name: "Prambanan Temple Compounds",
    country: "Indonesia",
    code: "IDN",
    tier: "rare",
    lat: -7.75222,
    lon: 110.49167,
    source: "https://whc.unesco.org/en/list/642/",
    region: "Asia and the Pacific",
    description: "Tall Hindu temple towers rise from a complex decorated with narrative reliefs. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/642/"
  },
  {
    id: "balisubak",
    name: "Bali Subak Landscape",
    country: "Indonesia",
    code: "IDN",
    tier: "rare",
    lat: -8.2591666667,
    lon: 115.4027777778,
    source: "https://whc.unesco.org/en/list/1194/",
    region: "Asia and the Pacific",
    description: "Water temples and terraced rice fields form a landscape managed by the subak irrigation system. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1194/"
  },
  {
    id: "kinabalu",
    name: "Kinabalu Park",
    country: "Malaysia",
    code: "MYS",
    tier: "rare",
    lat: 6.147,
    lon: 116.642,
    source: "https://whc.unesco.org/en/list/1012/",
    region: "Asia and the Pacific",
    description: "A granite mountain supports vegetation ranging from tropical forest to alpine habitats. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1012/"
  },
  {
    id: "gunungmulu",
    name: "Gunung Mulu",
    country: "Malaysia",
    code: "MYS",
    tier: "epic",
    lat: 4.13333,
    lon: 114.91667,
    source: "https://whc.unesco.org/en/list/1013/",
    region: "Asia and the Pacific",
    description: "Limestone pinnacles and immense caves form a spectacular tropical karst landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1013/"
  },
  {
    id: "puertoprincesa",
    name: "Puerto-Princesa Subterranean River",
    country: "Philippines",
    code: "PHL",
    tier: "rare",
    lat: 10.16666667,
    lon: 118.9166667,
    source: "https://whc.unesco.org/en/list/652/",
    region: "Asia and the Pacific",
    description: "A subterranean river flows through limestone caves before reaching the sea. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/652/"
  },
  {
    id: "tubbataha",
    name: "Tubbataha Reefs",
    country: "Philippines",
    code: "PHL",
    tier: "epic",
    lat: 8.9533333333,
    lon: 119.8675,
    source: "https://whc.unesco.org/en/list/653/",
    region: "Asia and the Pacific",
    description: "Remote coral atolls support rich reef communities and breeding seabirds. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/653/"
  },
  {
    id: "cordilleraterraces",
    name: "Philippine Cordilleras Rice Terraces",
    country: "Philippines",
    code: "PHL",
    tier: "rare",
    lat: 16.8333333333,
    lon: 120.9666666667,
    source: "https://whc.unesco.org/en/list/722/",
    region: "Asia and the Pacific",
    description: "Steep mountain slopes are shaped into irrigated rice terraces maintained by local communities. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/722/"
  },
  {
    id: "hue",
    name: "Hu\xE9 Monuments",
    country: "Vietnam",
    code: "VNM",
    tier: "rare",
    lat: 16.4694444444,
    lon: 107.577777778,
    source: "https://whc.unesco.org/en/list/678/",
    region: "Asia and the Pacific",
    description: "Palaces, temples and fortified enclosures preserve the ceremonial heart of Vietnam's former capital. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/678/"
  },
  {
    id: "hoian",
    name: "Hoi An",
    country: "Vietnam",
    code: "VNM",
    tier: "common",
    lat: 15.88333333,
    lon: 108.3333333,
    source: "https://whc.unesco.org/en/list/948/",
    region: "Asia and the Pacific",
    description: "Timber buildings and narrow streets preserve a Southeast Asian trading port. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/948/"
  },
  {
    id: "trangan",
    name: "Trang An",
    country: "Vietnam",
    code: "VNM",
    tier: "epic",
    lat: 20.2566666667,
    lon: 105.8963888889,
    source: "https://whc.unesco.org/en/list/1438/",
    region: "Asia and the Pacific",
    description: "Limestone towers rise above waterways, caves and archaeological sites. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1438/"
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura",
    country: "Sri Lanka",
    code: "LKA",
    tier: "rare",
    lat: 8.333333333,
    lon: 80.38333333,
    source: "https://whc.unesco.org/en/list/200/",
    region: "Asia and the Pacific",
    description: "Large stupas and monastic ruins preserve a sacred city centred on a revered Bodhi tree. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/200/"
  },
  {
    id: "galle",
    name: "Galle Fort",
    country: "Sri Lanka",
    code: "LKA",
    tier: "common",
    lat: 6.028051,
    lon: 80.216346,
    source: "https://whc.unesco.org/en/list/451/",
    region: "Asia and the Pacific",
    description: "Fortified streets and buildings combine European planning with South Asian traditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/451/"
  },
  {
    id: "dambulla",
    name: "Dambulla Cave Temple",
    country: "Sri Lanka",
    code: "LKA",
    tier: "rare",
    lat: 7.856666667,
    lon: 80.64916667,
    source: "https://whc.unesco.org/en/list/561/",
    region: "Asia and the Pacific",
    description: "Cave sanctuaries preserve Buddhist statues and extensive painted surfaces. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/561/"
  },
  {
    id: "gyeongju",
    name: "Gyeongju Historic Areas",
    country: "South Korea",
    code: "KOR",
    tier: "rare",
    lat: 35.83,
    lon: 129.22,
    source: "https://whc.unesco.org/en/list/976/",
    region: "Asia and the Pacific",
    description: "Royal tombs, temple remains and palace sites preserve the former Silla capital. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/976/"
  },
  {
    id: "hahoeyangdong",
    name: "Hahoe and Yangdong Villages",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 36.5391666667,
    lon: 128.5166666667,
    source: "https://whc.unesco.org/en/list/1324/",
    region: "Asia and the Pacific",
    description: "Traditional clan villages preserve tiled and thatched houses within wooded river landscapes. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1324/"
  },
  {
    id: "namhansanseong",
    name: "Namhansanseong",
    country: "South Korea",
    code: "KOR",
    tier: "rare",
    lat: 37.4788888889,
    lon: 127.181111111,
    source: "https://whc.unesco.org/en/list/1439/",
    region: "Asia and the Pacific",
    description: "Mountain walls and gates surround a refuge capital developed for the Joseon dynasty. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1439/"
  },
  {
    id: "seowon",
    name: "Seowon Academies",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 36.9254055556,
    lon: 128.580108333,
    source: "https://whc.unesco.org/en/list/1498/",
    region: "Asia and the Pacific",
    description: "Neo-Confucian academies place study halls and shrines within carefully chosen natural settings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1498/"
  },
  {
    id: "qinmausoleum",
    name: "First Qin Emperor's Mausoleum",
    country: "China",
    code: "CHN",
    tier: "epic",
    lat: 34.3851944444,
    lon: 109.273444445,
    source: "https://whc.unesco.org/en/list/441/",
    region: "Asia and the Pacific",
    description: "An imperial burial complex includes a vast terracotta army arranged in underground pits. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/441/"
  },
  {
    id: "pingyao",
    name: "Ancient Ping Yao",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 37.286204,
    lon: 112.278907,
    source: "https://whc.unesco.org/en/list/812/",
    region: "Asia and the Pacific",
    description: "A walled Chinese city preserves traditional houses and historic commercial buildings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/812/"
  },
  {
    id: "yungang",
    name: "Yungang Grottoes",
    country: "China",
    code: "CHN",
    tier: "epic",
    lat: 40.10972,
    lon: 113.12222,
    source: "https://whc.unesco.org/en/list/1039/",
    region: "Asia and the Pacific",
    description: "Buddhist cave temples contain monumental statues carved into sandstone cliffs. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1039/"
  },
  {
    id: "westlake",
    name: "West Lake of Hangzhou",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 30.2375,
    lon: 120.1408333333,
    source: "https://whc.unesco.org/en/list/1334/",
    region: "Asia and the Pacific",
    description: "Causeways, gardens and temples shape a lake landscape celebrated in Chinese art. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1334/"
  },
  {
    id: "haniterraces",
    name: "Honghe Hani Rice Terraces",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 23.0932777778,
    lon: 102.7799805556,
    source: "https://whc.unesco.org/en/list/1111/",
    region: "Asia and the Pacific",
    description: "Irrigated terraces descend from forested mountains past Hani villages. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1111/"
  },
  {
    id: "pattadakal",
    name: "Pattadakal",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 15.950194,
    lon: 75.815611,
    source: "https://whc.unesco.org/en/list/239/",
    region: "Asia and the Pacific",
    description: "Chalukya-period temples bring together northern and southern Indian architectural forms. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/239/"
  },
  {
    id: "shivajiterminus",
    name: "Chhatrapati Shivaji Terminus",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 18.9401222222,
    lon: 72.8362027777,
    source: "https://whc.unesco.org/en/list/945/",
    region: "Asia and the Pacific",
    description: "A monumental railway station combines Victorian Gothic Revival and Indian architectural traditions. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/945/"
  },
  {
    id: "nalanda",
    name: "Nalanda Mahavihara",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 25.1366666667,
    lon: 85.4438888889,
    source: "https://whc.unesco.org/en/list/1502/",
    region: "Asia and the Pacific",
    description: "Monasteries, shrines and educational remains record a long-lived Buddhist learning centre. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1502/"
  },
  {
    id: "bam",
    name: "Bam and its Cultural Landscape",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 29.11683,
    lon: 58.3666666667,
    source: "https://whc.unesco.org/en/list/1208/",
    region: "Asia and the Pacific",
    description: "An earthen citadel and oasis landscape record the history of a desert trading city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1208/"
  },
  {
    id: "shushtar",
    name: "Shushtar Hydraulic System",
    country: "Iran",
    code: "IRN",
    tier: "rare",
    lat: 32.0186111111,
    lon: 48.8358333333,
    source: "https://whc.unesco.org/en/list/1315/",
    region: "Asia and the Pacific",
    description: "Dams, tunnels and canals distribute water through a historic system of mills and irrigation. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1315/"
  },
  {
    id: "gonbadeqabus",
    name: "Gonbad-e Q\u0101bus",
    country: "Iran",
    code: "IRN",
    tier: "common",
    lat: 37.2580277778,
    lon: 55.169,
    source: "https://whc.unesco.org/en/list/1398/",
    region: "Asia and the Pacific",
    description: "A tall brick funerary tower rises above a star-shaped plan beneath a conical roof. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1398/"
  },
  {
    id: "cappadocia",
    name: "G\xF6reme and Cappadocia",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "epic",
    lat: 38.5947222222,
    lon: 34.9988055556,
    source: "https://whc.unesco.org/en/list/357/",
    region: "Europe and North America",
    description: "Eroded volcanic rock formations contain rock-cut churches and dwellings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/357/"
  },
  {
    id: "nemrut",
    name: "Nemrut Da\u011F",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "rare",
    lat: 37.9807939663,
    lon: 38.7409837493,
    source: "https://whc.unesco.org/en/list/448/",
    region: "Europe and North America",
    description: "Colossal stone statues flank a royal funerary mound high in the mountains. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/448/"
  },
  {
    id: "pamukkale",
    name: "Hierapolis-Pamukkale",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "epic",
    lat: 37.92389,
    lon: 29.12333,
    source: "https://whc.unesco.org/en/list/485/",
    region: "Europe and North America",
    description: "White travertine terraces formed by thermal waters lie below the remains of an ancient city. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/485/"
  },
  {
    id: "troy",
    name: "Troy",
    country: "T\xFCrkiye",
    code: "TUR",
    tier: "rare",
    lat: 39.95644,
    lon: 26.239,
    source: "https://whc.unesco.org/en/list/849/",
    region: "Europe and North America",
    description: "Successive settlement layers preserve a city associated with ancient Mediterranean history and epic poetry. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/849/"
  },
  {
    id: "baalbek",
    name: "Baalbek",
    country: "Lebanon",
    code: "LBN",
    tier: "epic",
    lat: 34.0066666667,
    lon: 36.2041666667,
    source: "https://whc.unesco.org/en/list/294/",
    region: "Arab States",
    description: "Monumental Roman temples preserve towering columns and richly carved stonework. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/294/"
  },
  {
    id: "byblos",
    name: "Byblos",
    country: "Lebanon",
    code: "LBN",
    tier: "rare",
    lat: 34.11917,
    lon: 35.6455555556,
    source: "https://whc.unesco.org/en/list/295/",
    region: "Arab States",
    description: "A long-inhabited coastal city preserves traces of successive Mediterranean civilizations. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/295/"
  },
  {
    id: "quseiramra",
    name: "Quseir Amra",
    country: "Jordan",
    code: "JOR",
    tier: "common",
    lat: 31.8018055556,
    lon: 36.5873055556,
    source: "https://whc.unesco.org/en/list/327/",
    region: "Arab States",
    description: "An early Islamic desert residence preserves remarkable wall paintings inside its bath complex. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/327/"
  },
  {
    id: "wadirum",
    name: "Wadi Rum",
    country: "Jordan",
    code: "JOR",
    tier: "epic",
    lat: 29.6397222222,
    lon: 35.4338888889,
    source: "https://whc.unesco.org/en/list/1377/",
    region: "Arab States",
    description: "Sandstone cliffs, narrow gorges and natural arches form a desert landscape rich in rock art. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1377/"
  },
  {
    id: "atturaif",
    name: "At-Turaif",
    country: "Saudi Arabia",
    code: "SAU",
    tier: "common",
    lat: 24.7341333333,
    lon: 46.5724666667,
    source: "https://whc.unesco.org/en/list/1329/",
    region: "Arab States",
    description: "Mud-brick palaces and urban remains preserve the early Saudi capital at ad-Dir'iyah. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1329/"
  },
  {
    id: "alahsa",
    name: "Al-Ahsa Oasis",
    country: "Saudi Arabia",
    code: "SAU",
    tier: "rare",
    lat: 25.3785194444,
    lon: 49.5757138889,
    source: "https://whc.unesco.org/en/list/1563/",
    region: "Arab States",
    description: "Palm groves, springs and canals form an extensive oasis shaped by long settlement. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1563/"
  },
  {
    id: "alzubarah",
    name: "Al Zubarah",
    country: "Qatar",
    code: "QAT",
    tier: "common",
    lat: 25.9780555556,
    lon: 51.0297222222,
    source: "https://whc.unesco.org/en/list/1402/",
    region: "Arab States",
    description: "The remains of a walled Gulf town record pearling and maritime trade. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1402/"
  },
  {
    id: "alain",
    name: "Al Ain Cultural Sites",
    country: "United Arab Emirates",
    code: "ARE",
    tier: "common",
    lat: 24.290984,
    lon: 55.77942,
    source: "https://whc.unesco.org/en/list/1343/",
    region: "Arab States",
    description: "Oases, tombs and ancient settlements record life in the Arabian desert over millennia. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1343/"
  },
  {
    id: "shirakami",
    name: "Shirakami-Sanchi",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 40.4525,
    lon: 140.1155555556,
    source: "https://whc.unesco.org/en/list/663/",
    region: "Asia and the Pacific",
    description: "An extensive cool-temperate beech forest survives across a rugged mountain landscape. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/663/"
  },
  {
    id: "ogasawara",
    name: "Ogasawara Islands",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 24.235,
    lon: 141.4625,
    source: "https://whc.unesco.org/en/list/1362/",
    region: "Asia and the Pacific",
    description: "Oceanic islands harbour many endemic species shaped by isolated evolution. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1362/"
  },
  {
    id: "tomioka",
    name: "Tomioka Silk Mill",
    country: "Japan",
    code: "JPN",
    tier: "common",
    lat: 36.2552777778,
    lon: 138.8877777778,
    source: "https://whc.unesco.org/en/list/1449/",
    region: "Asia and the Pacific",
    description: "A historic silk mill and related sites record Japan's transition to industrial silk production. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1449/"
  },
  {
    id: "salzburg",
    name: "Historic Salzburg",
    country: "Austria",
    code: "AUT",
    tier: "rare",
    lat: 47.80055556,
    lon: 13.04333333,
    source: "https://whc.unesco.org/en/list/784/",
    region: "Europe and North America",
    description: "Ecclesiastical and civic buildings preserve a Baroque city between the river and surrounding hills. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/784/"
  },
  {
    id: "hallstatt",
    name: "Hallstatt-Dachstein",
    country: "Austria",
    code: "AUT",
    tier: "rare",
    lat: 47.55944444,
    lon: 13.64638889,
    source: "https://whc.unesco.org/en/list/806/",
    region: "Europe and North America",
    description: "Alpine settlement and mountain scenery reflect a long history of salt mining. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/806/"
  },
  {
    id: "berne",
    name: "Old City of Berne",
    country: "Switzerland",
    code: "CHE",
    tier: "common",
    lat: 46.94806,
    lon: 7.45028,
    source: "https://whc.unesco.org/en/list/267/",
    region: "Europe and North America",
    description: "Arcaded streets and historic fountains preserve a planned medieval city beside the Aare River. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/267/"
  },
  {
    id: "stgall",
    name: "Abbey of St Gall",
    country: "Switzerland",
    code: "CHE",
    tier: "rare",
    lat: 47.42333,
    lon: 9.37778,
    source: "https://whc.unesco.org/en/list/268/",
    region: "Europe and North America",
    description: "A monastic complex and its library preserve an important centre of European learning. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/268/"
  },
  {
    id: "wurzburg",
    name: "W\xFCrzburg Residence",
    country: "Germany",
    code: "DEU",
    tier: "rare",
    lat: 49.7927777778,
    lon: 9.9388888889,
    source: "https://whc.unesco.org/en/list/169/",
    region: "Europe and North America",
    description: "A richly decorated Baroque residence combines a grand staircase with formal court gardens. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/169/"
  },
  {
    id: "trier",
    name: "Roman Monuments of Trier",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 49.7561944444,
    lon: 6.6432222222,
    source: "https://whc.unesco.org/en/list/367/",
    region: "Europe and North America",
    description: "Roman gates, baths and later churches preserve layers of a city on the Moselle. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/367/"
  },
  {
    id: "speicherstadt",
    name: "Speicherstadt and Kontorhaus",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 53.5455555556,
    lon: 9.9994444444,
    source: "https://whc.unesco.org/en/list/1467/",
    region: "Europe and North America",
    description: "Brick warehouses line canals beside a district of early modern office buildings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1467/"
  },
  {
    id: "kronborg",
    name: "Kronborg Castle",
    country: "Denmark",
    code: "DNK",
    tier: "rare",
    lat: 56.03889,
    lon: 12.62083333,
    source: "https://whc.unesco.org/en/list/696/",
    region: "Europe and North America",
    description: "A Renaissance castle guards the narrow sound between Denmark and Sweden. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/696/"
  },
  {
    id: "ilulissat",
    name: "Ilulissat Icefjord",
    country: "Denmark",
    code: "DNK",
    tier: "epic",
    lat: 69.13333333,
    lon: -49.5,
    source: "https://whc.unesco.org/en/list/1149/",
    region: "Europe and North America",
    description: "A fast-moving glacier releases immense icebergs into a Greenland fjord. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1149/"
  },
  {
    id: "suomenlinna",
    name: "Suomenlinna Fortress",
    country: "Finland",
    code: "FIN",
    tier: "rare",
    lat: 60.14722,
    lon: 24.98722,
    source: "https://whc.unesco.org/en/list/583/",
    region: "Europe and North America",
    description: "Bastions and military buildings spread across islands at the entrance to Helsinki's harbour. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/583/"
  },
  {
    id: "rauma",
    name: "Old Rauma",
    country: "Finland",
    code: "FIN",
    tier: "common",
    lat: 61.12806,
    lon: 21.51167,
    source: "https://whc.unesco.org/en/list/582/",
    region: "Europe and North America",
    description: "Colourful timber houses preserve a traditional Nordic town around its medieval core. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/582/"
  },
  {
    id: "orangetheatre",
    name: "Roman Theatre of Orange",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 44.1421109344,
    lon: 4.8047909061,
    source: "https://whc.unesco.org/en/list/163/",
    region: "Europe and North America",
    description: "A Roman theatre retains its monumental stage wall beside other ancient urban remains. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/163/"
  },
  {
    id: "cordouan",
    name: "Cordouan Lighthouse",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 45.5863055556,
    lon: -1.1733333333,
    source: "https://whc.unesco.org/en/list/1625/",
    region: "Europe and North America",
    description: "A monumental stone lighthouse stands on a rocky platform at the Gironde estuary. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1625/"
  },
  {
    id: "maisoncarree",
    name: "Maison Carr\xE9e of N\xEEmes",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 43.8382222222,
    lon: 4.3561944444,
    source: "https://whc.unesco.org/en/list/1569/",
    region: "Europe and North America",
    description: "A well-preserved Roman temple stands on a high podium behind a columned portico. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1569/"
  },
  {
    id: "edinburgh",
    name: "Old and New Edinburgh",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 55.95,
    lon: -3.216666667,
    source: "https://whc.unesco.org/en/list/728/",
    region: "Europe and North America",
    description: "A medieval old town contrasts with a carefully planned neoclassical new town. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/728/"
  },
  {
    id: "pontcysyllte",
    name: "Pontcysyllte Aqueduct",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 52.9702777778,
    lon: -3.0877777778,
    source: "https://whc.unesco.org/en/list/1303/",
    region: "Europe and North America",
    description: "A cast-iron water trough carries a navigable canal high above the River Dee. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1303/"
  },
  {
    id: "kew",
    name: "Royal Botanic Gardens Kew",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 51.48194444,
    lon: -0.2940277778,
    source: "https://whc.unesco.org/en/list/1084/",
    region: "Europe and North America",
    description: "Historic glasshouses and designed landscapes preserve a major centre of botanical study. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1084/"
  },
  {
    id: "delphi",
    name: "Delphi",
    country: "Greece",
    code: "GRC",
    tier: "epic",
    lat: 38.48149,
    lon: 22.49617,
    source: "https://whc.unesco.org/en/list/393/",
    region: "Europe and North America",
    description: "The sanctuary of Apollo occupies terraces on the slopes of Mount Parnassus. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/393/"
  },
  {
    id: "epidaurus",
    name: "Sanctuary of Asklepios at Epidaurus",
    country: "Greece",
    code: "GRC",
    tier: "rare",
    lat: 37.6,
    lon: 23.0805555556,
    source: "https://whc.unesco.org/en/list/491/",
    region: "Europe and North America",
    description: "A theatre and religious buildings preserve an ancient sanctuary associated with healing. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/491/"
  },
  {
    id: "mycenae",
    name: "Mycenae and Tiryns",
    country: "Greece",
    code: "GRC",
    tier: "rare",
    lat: 37.6,
    lon: 22.8,
    source: "https://whc.unesco.org/en/list/941/",
    region: "Europe and North America",
    description: "Massive stone fortifications preserve centres of the Mycenaean civilization. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/941/"
  },
  {
    id: "brunaboinne",
    name: "Br\xFA na B\xF3inne",
    country: "Ireland",
    code: "IRL",
    tier: "rare",
    lat: 53.6946944444,
    lon: -6.4755,
    source: "https://whc.unesco.org/en/list/659/",
    region: "Europe and North America",
    description: "Large prehistoric passage tombs occupy a river landscape decorated with megalithic art. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/659/"
  },
  {
    id: "thingvellir",
    name: "\xDEingvellir",
    country: "Iceland",
    code: "ISL",
    tier: "rare",
    lat: 64.25380556,
    lon: -21.03725,
    source: "https://whc.unesco.org/en/list/1152/",
    region: "Europe and North America",
    description: "A rift-valley landscape preserves the site of Iceland's historic open-air assembly. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1152/"
  },
  {
    id: "agrigento",
    name: "Valley of the Temples at Agrigento",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 37.28972222,
    lon: 13.59333333,
    source: "https://whc.unesco.org/en/list/831/",
    region: "Europe and North America",
    description: "Doric temples preserve the monumental remains of a major ancient Greek city in Sicily. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/831/"
  },
  {
    id: "cinqueterre",
    name: "Portovenere and Cinque Terre",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 44.0430555556,
    lon: 9.8425,
    source: "https://whc.unesco.org/en/list/826/",
    region: "Europe and North America",
    description: "Coastal villages and cultivated terraces cling to steep slopes above the Ligurian Sea. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/826/"
  },
  {
    id: "bryggen",
    name: "Bryggen",
    country: "Norway",
    code: "NOR",
    tier: "common",
    lat: 60.3974955,
    lon: 5.3242268,
    source: "https://whc.unesco.org/en/list/59/",
    region: "Europe and North America",
    description: "Rows of timber merchants' buildings preserve Bergen's historic Hanseatic waterfront. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/59/"
  },
  {
    id: "tomar",
    name: "Convent of Christ in Tomar",
    country: "Portugal",
    code: "PRT",
    tier: "rare",
    lat: 39.60472,
    lon: -8.4175,
    source: "https://whc.unesco.org/en/list/265/",
    region: "Europe and North America",
    description: "A fortified religious complex combines a round Templar church with later monastic buildings. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/265/"
  },
  {
    id: "teide",
    name: "Teide National Park",
    country: "Spain",
    code: "ESP",
    tier: "epic",
    lat: 28.2713888889,
    lon: -16.6436111111,
    source: "https://whc.unesco.org/en/list/1258/",
    region: "Europe and North America",
    description: "A high volcanic cone rises above lava fields and a vast caldera on Tenerife. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1258/"
  },
  {
    id: "eddystone",
    name: "Eddystone Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 50.180717,
    lon: -4.2656,
    source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/eddystone-lighthouse",
    region: "Eddystone Rocks",
    description: "A tapering granite tower marks the Eddystone rocks off Plymouth; the stump of an earlier lighthouse remains nearby.",
    descriptionSourceName: "Trinity House",
    descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/eddystone-lighthouse"
  },
  {
    id: "bishoprock",
    name: "Bishop Rock Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 49.872861,
    lon: -6.445556,
    source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/bishop-rock-lighthouse",
    region: "Isles of Scilly",
    description: "A tall stone lighthouse rises from a small Atlantic rock west of the Isles of Scilly, with a landing platform above its lantern.",
    descriptionSourceName: "Trinity House",
    descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/bishop-rock-lighthouse"
  },
  {
    id: "wolfrock",
    name: "Wolf Rock Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 49.945317,
    lon: -5.809167,
    source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/wolf-rock-lighthouse",
    region: "Cornwall",
    description: "Granite masonry forms this isolated lighthouse between Land\u2019s End and the Isles of Scilly, surrounded by open water.",
    descriptionSourceName: "Trinity House",
    descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/wolf-rock-lighthouse"
  },
  {
    id: "longships",
    name: "Longships Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 50.066867,
    lon: -5.746867,
    source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/longships-lighthouse",
    region: "Land\u2019s End",
    description: "The stone tower stands on the largest of the Longships rocks, marking the sea approaches to Land\u2019s End.",
    descriptionSourceName: "Trinity House",
    descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/longships-lighthouse"
  },
  {
    id: "needleslight",
    name: "The Needles Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 50.662233,
    lon: -1.591667,
    source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/needles-lighthouse",
    region: "Isle of Wight",
    description: "A red-and-white tower stands at the seaward end of the chalk Needles, where pale rock pinnacles meet the Solent approaches.",
    descriptionSourceName: "Trinity House",
    descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/needles-lighthouse"
  },
  {
    id: "smallslight",
    name: "Smalls Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 51.721267,
    lon: -5.669867,
    source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/smalls-lighthouse",
    region: "Pembrokeshire",
    description: "A granite tower replaced an earlier timber lighthouse on the remote Smalls rocks off the Welsh coast.",
    descriptionSourceName: "Trinity House",
    descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/smalls-lighthouse"
  },
  {
    id: "bellrock",
    name: "Bell Rock Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 56.43441667,
    lon: -2.38716667,
    source: "https://www.nlb.org.uk/lighthouses/bell-rock/",
    region: "Firth of Forth approaches",
    description: "Built on a reef covered at high tide, the slender masonry tower guides shipping off Scotland\u2019s east coast.",
    descriptionSourceName: "Northern Lighthouse Board",
    descriptionSource: "https://www.nlb.org.uk/lighthouses/bell-rock/"
  },
  {
    id: "skerryvore",
    name: "Skerryvore Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 56.32276667,
    lon: -7.1147,
    source: "https://www.nlb.org.uk/lighthouses/skerryvore/",
    region: "Tiree",
    description: "A tall, curved granite tower stands on a reef southwest of Tiree, a landmark of Scottish rock-lighthouse engineering.",
    descriptionSourceName: "Northern Lighthouse Board",
    descriptionSource: "https://www.nlb.org.uk/lighthouses/skerryvore/"
  },
  {
    id: "dubhartach",
    name: "Dubh Artach Lighthouse",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 56.13256667,
    lon: -6.63465,
    source: "https://www.nlb.org.uk/lighthouses/dubh-artach/",
    region: "Inner Hebrides",
    description: "The offshore rock supports a stone lighthouse with a broad red band, exposed to Atlantic waves southwest of Mull.",
    descriptionSourceName: "Northern Lighthouse Board",
    descriptionSource: "https://www.nlb.org.uk/lighthouses/dubh-artach/"
  },
  {
    id: "chickenrock",
    name: "Chicken Rock Lighthouse",
    country: "Isle of Man",
    code: "IMN",
    tier: "common",
    lat: 54.03785,
    lon: -4.83858333,
    source: "https://www.nlb.org.uk/lighthouses/chicken-rock/",
    region: "Calf of Man",
    description: "An isolated granite tower marks a submerged hazard off the Calf of Man at the southern approaches to the Isle of Man.",
    descriptionSourceName: "Northern Lighthouse Board",
    descriptionSource: "https://www.nlb.org.uk/lighthouses/chicken-rock/"
  },
  {
    id: "fastnet",
    name: "Fastnet Lighthouse",
    country: "Ireland",
    code: "IRL",
    tier: "rare",
    lat: 51.3893,
    lon: -9.60297,
    source: "https://irishlights.ie/safety-navigation/our-lighthouses/fastnet.aspx",
    region: "County Cork",
    description: "A curved granite tower rises above Fastnet Rock southwest of Cape Clear, built to resist powerful Atlantic waves.",
    descriptionSourceName: "Commissioners of Irish Lights",
    descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/fastnet.aspx"
  },
  {
    id: "tuskar",
    name: "Tuskar Lighthouse",
    country: "Ireland",
    code: "IRL",
    tier: "common",
    lat: 52.20292,
    lon: -6.20742,
    source: "https://irishlights.ie/safety-navigation/our-lighthouses/tuskar-rock.aspx",
    region: "County Wexford",
    description: "A white round tower marks Tuskar Rock off County Wexford, helping vessels approaching Ireland\u2019s southeast coast.",
    descriptionSourceName: "Commissioners of Irish Lights",
    descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/tuskar-rock.aspx"
  },
  {
    id: "rockabill",
    name: "Rockabill Lighthouse",
    country: "Ireland",
    code: "IRL",
    tier: "common",
    lat: 53.59685,
    lon: -6.00495,
    source: "https://irishlights.ie/safety-navigation/our-lighthouses/rockabill.aspx",
    region: "County Dublin",
    description: "A white lighthouse with a dark band stands on one of two small rocky islands off the Dublin coast. The neighbouring rocks form a distinctive offshore pair.",
    descriptionSourceName: "Commissioners of Irish Lights",
    descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/rockabill.aspx"
  },
  {
    id: "kishbank",
    name: "Kish Bank Lighthouse",
    country: "Ireland",
    code: "IRL",
    tier: "rare",
    lat: 53.31083,
    lon: -5.9257,
    source: "https://irishlights.ie/safety-navigation/our-lighthouses/kish-bank.aspx",
    region: "Dublin Bay approaches",
    description: "A caisson-based lighthouse with a broad upper platform marks the Kish Bank sandbank in the approaches to Dublin Bay.",
    descriptionSourceName: "Commissioners of Irish Lights",
    descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/kish-bank.aspx"
  },
  {
    id: "beanrock",
    name: "Bean Rock Lighthouse",
    country: "New Zealand",
    code: "NZL",
    tier: "rare",
    lat: -36.833,
    lon: 174.831,
    source: "https://www.heritage.org.nz/list-details/3295/Bean%20Rock%20Lighthouse",
    region: "Waitemat\u0101 Harbour",
    description: "A small wooden lighthouse cottage stands above a harbour reef on iron legs, a distinctive form in Auckland\u2019s Waitemat\u0101 Harbour.",
    descriptionSourceName: "Heritage New Zealand",
    descriptionSource: "https://www.heritage.org.nz/list-details/3295/Bean%20Rock%20Lighthouse"
  },
  {
    id: "brotherslight",
    name: "Brothers Islands Lighthouse",
    country: "New Zealand",
    code: "NZL",
    tier: "common",
    lat: -41.1,
    lon: 174.43333333,
    source: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/brothers-island/",
    region: "Cook Strait",
    description: "A compact white lighthouse and keeper buildings occupy a rocky island in Cook Strait between New Zealand\u2019s main islands.",
    descriptionSourceName: "Maritime New Zealand",
    descriptionSource: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/brothers-island/"
  },
  {
    id: "dogisland",
    name: "Dog Island Lighthouse",
    country: "New Zealand",
    code: "NZL",
    tier: "rare",
    lat: -46.65,
    lon: 168.41666667,
    source: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/dog-island/",
    region: "Foveaux Strait",
    description: "New Zealand\u2019s tallest lighthouse uses broad dark bands on a pale tower to mark the eastern approach to Foveaux Strait.",
    descriptionSourceName: "Maritime New Zealand",
    descriptionSource: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/dog-island/"
  },
  {
    id: "oryukdolight",
    name: "Oryukdo Lighthouse",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 35.09116361,
    lon: 129.12688634,
    source: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=81575",
    region: "Busan",
    description: "The white lighthouse crowns Deungdaeseom, one of the offshore rock islands of Oryukdo at the entrance to Busan\u2019s waters.",
    descriptionSourceName: "Korea Tourism Organization",
    descriptionSource: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=81575"
  },
  {
    id: "somaemuldolight",
    name: "Somaemuldo Lighthouse",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 34.61951668,
    lon: 128.54806406,
    source: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=111029",
    region: "Tongyeong",
    description: "A white lighthouse tops Deungdaeseom beside Somaemuldo, where a rocky tidal connection separates the two small islands.",
    descriptionSourceName: "Korea Tourism Organization",
    descriptionSource: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=111029"
  },
  {
    id: "gageodolight",
    name: "Gageodo Lighthouse",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 34.094667,
    lon: 125.099278,
    source: "https://mokpo.mof.go.kr/en/page.do?menuIdx=1598",
    region: "Sinan",
    description: "A low white brick lighthouse stands high on Gageodo\u2019s northern headland, marking the approach from the open East China Sea.",
    descriptionSourceName: "Mokpo Regional Office of Oceans and Fisheries",
    descriptionSource: "https://mokpo.mof.go.kr/en/page.do?menuIdx=1598"
  },
  {
    id: "bikiniatoll",
    name: "Bikini Atoll",
    country: "Marshall Islands",
    code: "MHL",
    tier: "epic",
    lat: 11.6,
    lon: 165.38055556,
    source: "https://whc.unesco.org/en/list/1339/",
    region: "Bikini Atoll",
    description: "The lagoon contains sunken test vessels and other remains of twentieth-century nuclear testing; the miniature depicts submerged hulls within the atoll.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1339/"
  },
  {
    id: "phoenixislands",
    name: "Phoenix Islands Protected Area",
    country: "Kiribati",
    code: "KIR",
    tier: "legendary",
    lat: -3.864454,
    lon: -172.650203,
    source: "https://whc.unesco.org/en/list/1325/",
    region: "Phoenix Islands",
    description: "Remote coral atolls, reefs and deep ocean habitats form this protected Pacific seascape within Kiribati.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1325/"
  },
  {
    id: "malpelo",
    name: "Malpelo Sanctuary",
    country: "Colombia",
    code: "COL",
    tier: "epic",
    lat: 4.003344,
    lon: -81.607572,
    source: "https://whc.unesco.org/en/list/1216/",
    region: "Eastern Pacific",
    description: "A steep oceanic rock and its surrounding protected waters support large gatherings of sharks in the eastern Pacific.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1216/"
  },
  {
    id: "surtsey",
    name: "Surtsey",
    country: "Iceland",
    code: "ISL",
    tier: "rare",
    lat: 63.30305556,
    lon: -20.60222222,
    source: "https://whc.unesco.org/en/list/1267/",
    region: "Vestmannaeyjar",
    description: "Formed by a volcanic eruption beginning in 1963, this young ocean island is protected for research into natural colonisation.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1267/"
  },
  {
    id: "goughislands",
    name: "Gough and Inaccessible Islands",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: -38.81236111,
    lon: -11.30597222,
    source: "https://whc.unesco.org/en/list/740/",
    region: "South Atlantic",
    description: "Steep volcanic islands in the South Atlantic provide nesting grounds for large seabird colonies far from continental shores.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/740/"
  },
  {
    id: "newcaledonialagoons",
    name: "New Caledonia Lagoons",
    country: "France",
    code: "FRA",
    tier: "epic",
    lat: -20.49587963,
    lon: 165.04791667,
    source: "https://whc.unesco.org/en/list/1115/",
    region: "New Caledonia",
    description: "Six marine clusters preserve extensive coral reefs and lagoons around New Caledonia; the model shows a representative reef channel.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1115/"
  },
  {
    id: "aporeef",
    name: "Apo Reef Natural Park",
    country: "Philippines",
    code: "PHL",
    tier: "common",
    lat: 12.74583333,
    lon: 120.3961111,
    source: "https://whc.unesco.org/en/tentativelists/5033/",
    region: "Occidental Mindoro",
    description: "Shallow reefs, channels and clear marine water form the protected Apo Reef complex west of Mindoro. The miniature separates the reef rim from its interior water channels.",
    descriptionSourceName: "UNESCO Tentative Lists",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/5033/"
  },
  {
    id: "bunaken",
    name: "Bunaken National Park",
    country: "Indonesia",
    code: "IDN",
    tier: "common",
    lat: 1.66666667,
    lon: 124.65,
    source: "https://whc.unesco.org/en/tentativelists/2002/",
    region: "North Sulawesi",
    description: "Coral reefs and steep underwater walls surround islands off North Sulawesi, providing a wide range of marine habitats.",
    descriptionSourceName: "UNESCO Tentative Lists",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/2002/"
  },
  {
    id: "rajaampat",
    name: "Raja Ampat Islands Marine Park",
    country: "Indonesia",
    code: "IDN",
    tier: "rare",
    lat: -0.7125553,
    lon: 130.3034473,
    source: "https://kkprajaampat.id/en/kawasan-kelola-kami/kepulauan-raja-ampat/",
    region: "Southwest Papua",
    description: "A network of coral reefs and island waters protects marine habitats in Raja Ampat, represented here by limestone islets and a reef passage.",
    descriptionSourceName: "Kupang National Marine Protected Areas Office",
    descriptionSource: "https://kkprajaampat.id/en/kawasan-kelola-kami/kepulauan-raja-ampat/"
  },
  {
    id: "wakatobi",
    name: "Wakatobi National Park",
    country: "Indonesia",
    code: "IDN",
    tier: "common",
    lat: -5.9011111,
    lon: 124.1165972,
    source: "https://whc.unesco.org/en/tentativelists/2006/",
    region: "Southeast Sulawesi",
    description: "Coral reefs around the Wakatobi islands form a marine park in the heart of the Coral Triangle. Its name joins the names of the four main islands: Wangi-Wangi, Kaledupa, Tomia and Binongko.",
    descriptionSourceName: "UNESCO Tentative Lists",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/2006/"
  },
  {
    id: "sipadan",
    name: "Sipadan Island Park",
    country: "Malaysia",
    code: "MYS",
    tier: "rare",
    lat: 4.1122015,
    lon: 118.6304382,
    source: "https://www.sabahparks.org.my/sipadan-island-park",
    region: "Sabah",
    description: "A small oceanic island rises above deep water, with coral-covered walls and marine turtle habitat around its edge.",
    descriptionSourceName: "Sabah Parks",
    descriptionSource: "https://www.sabahparks.org.my/sipadan-island-park"
  },
  {
    id: "surin",
    name: "Mu Ko Surin National Park",
    country: "Thailand",
    code: "THA",
    tier: "common",
    lat: 9.4001641,
    lon: 97.8657727,
    source: "https://www.tourismthailand.org/Articles/mu-koh-surin-the-tropical-paradise-in-andaman",
    region: "Phang Nga",
    description: "The Surin islands and their surrounding Andaman Sea reefs form a protected tropical marine landscape.",
    descriptionSourceName: "Tourism Authority of Thailand",
    descriptionSource: "https://www.tourismthailand.org/Articles/mu-koh-surin-the-tropical-paradise-in-andaman"
  },
  {
    id: "similan",
    name: "Mu Ko Similan National Park",
    country: "Thailand",
    code: "THA",
    tier: "rare",
    lat: 8.5771331,
    lon: 97.6463514,
    source: "https://www.tourismthailand.org/Attraction/mu-ko-similan-national-park",
    region: "Phang Nga",
    description: "Large rounded granite boulders rise above turquoise water, while coral reefs shelter marine life around the Similan islands.",
    descriptionSourceName: "Tourism Authority of Thailand",
    descriptionSource: "https://www.tourismthailand.org/Attraction/mu-ko-similan-national-park"
  },
  {
    id: "rasmohammed",
    name: "Ras Mohammed Marine Reserve",
    country: "Egypt",
    code: "EGY",
    tier: "rare",
    lat: 27.8786491,
    lon: 34.3578071,
    source: "https://www.sis.gov.eg/newVR/protected/html/rasmoh.htm",
    region: "South Sinai",
    description: "Reefs fringe the southern tip of Sinai where the gulfs of Suez and Aqaba meet, creating a striking underwater landscape.",
    descriptionSourceName: "Egypt State Information Service",
    descriptionSource: "https://www.sis.gov.eg/newVR/protected/html/rasmoh.htm"
  },
  {
    id: "bluebay",
    name: "Blue Bay Marine Park",
    country: "Mauritius",
    code: "MUS",
    tier: "common",
    lat: -20.45,
    lon: 57.7,
    source: "https://rsis.ramsar.org/ris/1744",
    region: "Grand Port",
    description: "A sheltered lagoon in southeastern Mauritius contains coral communities and shallow marine habitats. The miniature represents the reef and lagoon rather than the shore facilities.",
    descriptionSourceName: "Ramsar Sites Information Service",
    descriptionSource: "https://rsis.ramsar.org/ris/1744"
  },
  {
    id: "sainteanne",
    name: "Sainte Anne Marine National Park",
    country: "Seychelles",
    code: "SYC",
    tier: "common",
    lat: -4.605356,
    lon: 55.504711,
    source: "https://www.spga.gov.sc/parks/st-anne",
    region: "Mah\xE9",
    description: "Island waters near Mah\xE9 protect coral reefs and seagrass beds within Seychelles\u2019 Sainte Anne Marine National Park.",
    descriptionSourceName: "Seychelles Parks and Gardens Authority",
    descriptionSource: "https://www.spga.gov.sc/parks/st-anne"
  },
  {
    id: "watamu",
    name: "Watamu Marine National Park",
    country: "Kenya",
    code: "KEN",
    tier: "common",
    lat: -3.36777778,
    lon: 40.01638889,
    source: "https://kws.go.ke/park/watamu-marine-national-park-reserve/",
    region: "Kilifi",
    description: "Reef-protected lagoons and coral gardens shelter fish and sea turtles along Kenya\u2019s Indian Ocean coast.",
    descriptionSourceName: "Kenya Wildlife Service",
    descriptionSource: "https://kws.go.ke/park/watamu-marine-national-park-reserve/"
  },
  {
    id: "mafiaisland",
    name: "Mafia Island Marine Park",
    country: "Tanzania",
    code: "TZA",
    tier: "common",
    lat: -7.75194444,
    lon: 39.90027778,
    source: "https://www.marineparks.go.tz/parks/mafia-island",
    region: "Mafia Archipelago",
    description: "Coral reefs, mangroves and sheltered bays form a connected marine landscape around the southern part of Mafia Island.",
    descriptionSourceName: "Tanzania Marine Parks and Reserves Unit",
    descriptionSource: "https://www.marineparks.go.tz/parks/mafia-island"
  },
  {
    id: "biscayne",
    name: "Biscayne National Park",
    country: "United States",
    code: "USA",
    tier: "common",
    lat: 25.5031223,
    lon: -80.2348496,
    source: "https://www.nps.gov/bisc/index.htm",
    region: "Florida",
    description: "Biscayne protects marine water, islands and coral reefs beside South Florida, with underwater habitats forming most of the park.",
    descriptionSourceName: "National Park Service",
    descriptionSource: "https://www.nps.gov/bisc/index.htm"
  },
  {
    id: "drytortugas",
    name: "Dry Tortugas National Park",
    country: "United States",
    code: "USA",
    tier: "epic",
    lat: 24.6377223,
    lon: -82.8767982,
    source: "https://www.nps.gov/drto/index.htm",
    region: "Florida Keys",
    description: "Fort Jefferson\u2019s brick walls stand on a small island amid the clear water and reefs of the Dry Tortugas.",
    descriptionSourceName: "National Park Service",
    descriptionSource: "https://www.nps.gov/drto/index.htm"
  },
  {
    id: "cabopulmo",
    name: "Cabo Pulmo National Park",
    country: "Mexico",
    code: "MEX",
    tier: "common",
    lat: 23.4379644,
    lon: -109.4056184,
    source: "https://conanp.gob.mx/conanp/dominios/cabo_pulmo/index.php",
    region: "Baja California Sur",
    description: "A reef in the Gulf of California supports dense schools of fish along the eastern shore of Baja California Sur.",
    descriptionSourceName: "CONANP",
    descriptionSource: "https://conanp.gob.mx/conanp/dominios/cabo_pulmo/index.php"
  },
  {
    id: "abrolhos",
    name: "Abrolhos Marine National Park",
    country: "Brazil",
    code: "BRA",
    tier: "rare",
    lat: -17.971,
    lon: -38.7,
    source: "https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/parna-marinho-dos-abrolhos/guia-do-visitante/informacoes-sobre-visitacao",
    region: "Bahia",
    description: "Mushroom-shaped coral formations and island waters shelter marine life off Bahia, including a humpback whale breeding area.",
    descriptionSourceName: "ICMBio",
    descriptionSource: "https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/parna-marinho-dos-abrolhos/guia-do-visitante/informacoes-sobre-visitacao"
  },
  {
    id: "namena",
    name: "Namena Marine Reserve",
    country: "Fiji",
    code: "FJI",
    tier: "rare",
    lat: -17.1108726,
    lon: 179.098435,
    source: "https://fiji.wcs.org/Initiatives/Protected-Areas/Namena-Marine-Reserve.aspx",
    region: "Bligh Water",
    description: "A community-established no-take reserve around Namena protects reefs and the marine life that uses them.",
    descriptionSourceName: "Wildlife Conservation Society Fiji",
    descriptionSource: "https://fiji.wcs.org/Initiatives/Protected-Areas/Namena-Marine-Reserve.aspx"
  },
  {
    id: "exumacays",
    name: "Exuma Cays Land and Sea Park",
    country: "Bahamas",
    code: "BHS",
    tier: "common",
    lat: 24.42,
    lon: -76.69,
    source: "https://bnt.bs/explore/exuma/exuma-cays-land-sea-park/",
    region: "Exuma",
    description: "Shallow turquoise channels, cays and marine habitats form a protected seascape in the Exuma island chain.",
    descriptionSourceName: "Bahamas National Trust",
    descriptionSource: "https://bnt.bs/explore/exuma/exuma-cays-land-sea-park/"
  },
  {
    id: "jardinesreina",
    name: "Jardines de la Reina",
    country: "Cuba",
    code: "CUB",
    tier: "common",
    lat: 20.9292729,
    lon: -79.0706878,
    source: "https://www.cuba.travel/destinos/ciego-de-avila/naturaleza",
    region: "Southern Cuba",
    description: "Coral reefs, mangrove islands and shallow lagoons form a marine archipelago off Cuba\u2019s southern coast.",
    descriptionSourceName: "Cuba Travel",
    descriptionSource: "https://www.cuba.travel/destinos/ciego-de-avila/naturaleza"
  },
  {
    id: "flowergarden",
    name: "Flower Garden Banks Sanctuary",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 27.8700385,
    lon: -93.8328397,
    source: "https://flowergarden.noaa.gov/",
    region: "Northwestern Gulf",
    description: "Offshore banks rise from deeper Gulf water and support coral communities, sponges and other marine life.",
    descriptionSourceName: "NOAA",
    descriptionSource: "https://flowergarden.noaa.gov/"
  },
  {
    id: "stellwagen",
    name: "Stellwagen Bank Sanctuary",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 42.4006174,
    lon: -70.3357931,
    source: "https://stellwagen.noaa.gov/",
    region: "Massachusetts Bay",
    description: "A shallow offshore bank at the entrance to Massachusetts Bay creates productive feeding habitat for whales and other marine animals.",
    descriptionSourceName: "NOAA",
    descriptionSource: "https://stellwagen.noaa.gov/"
  },
  {
    id: "monitorwreck",
    name: "USS Monitor Sanctuary",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 35.0016689,
    lon: -75.4063896,
    source: "https://monitor.noaa.gov/",
    region: "Cape Hatteras",
    description: "The wreck of the ironclad USS Monitor lies offshore from Cape Hatteras, protected as an important maritime archaeological site.",
    descriptionSourceName: "NOAA",
    descriptionSource: "https://monitor.noaa.gov/"
  },
  {
    id: "portcros",
    name: "Port-Cros Marine Waters",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 43.064623,
    lon: 6.4586434,
    source: "https://portcros-parcnational.fr/fr/des-decouvertes/une-destination-dexception/la-mer",
    region: "Hy\xE8res Islands",
    description: "Mediterranean marine habitats around Port-Cros include seagrass meadows and rocky underwater communities.",
    descriptionSourceName: "Port-Cros National Park",
    descriptionSource: "https://portcros-parcnational.fr/fr/des-decouvertes/une-destination-dexception/la-mer"
  },
  {
    id: "sydneybridge",
    name: "Sydney Harbour Bridge",
    country: "Australia",
    code: "AUS",
    tier: "epic",
    lat: -33.8521165,
    lon: 151.2107812,
    source: "https://www.dcceew.gov.au/parks-heritage/heritage/places/national/sydney-harbour-bridge",
    region: "Port Jackson",
    description: "A broad steel arch carries traffic across Sydney Harbour; its stone pylons and suspended deck form a silhouette distinct from the Opera House.",
    descriptionSourceName: "Australian Government DCCEEW",
    descriptionSource: "https://www.dcceew.gov.au/parks-heritage/heritage/places/national/sydney-harbour-bridge"
  },
  {
    id: "towerbridge",
    name: "Tower Bridge",
    country: "United Kingdom",
    code: "GBR",
    tier: "epic",
    lat: 51.5055158,
    lon: -0.0753665,
    source: "https://www.towerbridge.org.uk/about-us",
    region: "River Thames, London",
    description: "Two stone-clad towers and a lifting central span carry a crossing over the Thames while allowing tall vessels to pass.",
    descriptionSourceName: "Tower Bridge official website",
    descriptionSource: "https://www.towerbridge.org.uk/about-us"
  },
  {
    id: "charlesbridge",
    name: "Charles Bridge",
    country: "Czechia",
    code: "CZE",
    tier: "rare",
    lat: 50.0864344,
    lon: 14.41190698,
    source: "https://prague.eu/en/objevujte/charles-bridge-karluv-most/",
    region: "Vltava, Prague",
    description: "Sandstone arches cross the Vltava between Prague\u2019s historic riverbanks, with statues lining the pedestrian bridge.",
    descriptionSourceName: "Prague City Tourism",
    descriptionSource: "https://prague.eu/en/objevujte/charles-bridge-karluv-most/"
  },
  {
    id: "chainbridge",
    name: "Sz\xE9chenyi Chain Bridge",
    country: "Hungary",
    code: "HUN",
    tier: "rare",
    lat: 47.4989791,
    lon: 19.0436494,
    source: "https://visithungary.com/articles/the-szechenyi-chain-bridge",
    region: "Danube, Budapest",
    description: "Suspension chains run between stone towers above the Danube, linking the Buda and Pest riverbanks. Its gate-like towers make the chain-supported structure easy to recognise.",
    descriptionSourceName: "Visit Hungary",
    descriptionSource: "https://visithungary.com/articles/the-szechenyi-chain-bridge"
  },
  {
    id: "pontevecchio",
    name: "Ponte Vecchio",
    country: "Italy",
    code: "ITA",
    tier: "rare",
    lat: 43.7680307,
    lon: 11.2531614,
    source: "https://www.visittuscany.com/en/attractions/ponte-vecchio/",
    region: "Arno, Florence",
    description: "Shops cluster above three broad arches across the Arno, with the elevated Vasari Corridor running over the bridge.",
    descriptionSourceName: "Visit Tuscany",
    descriptionSource: "https://www.visittuscany.com/en/attractions/ponte-vecchio/"
  },
  {
    id: "alexandrebridge",
    name: "Pont Alexandre III",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 48.8634697,
    lon: 2.3135181,
    source: "https://parisjetaime.com/eng/transport/pont-alexandre-iii-p1875",
    region: "Seine, Paris",
    description: "A low metal arch crosses the Seine between ornate lamp standards and tall pillars topped with gilded sculptures.",
    descriptionSourceName: "Paris Tourist Office",
    descriptionSource: "https://parisjetaime.com/eng/transport/pont-alexandre-iii-p1875"
  },
  {
    id: "millauviaduct",
    name: "Millau Viaduct",
    country: "France",
    code: "FRA",
    tier: "epic",
    lat: 44.0799775,
    lon: 3.0224087,
    source: "https://www.leviaducdemillau.com/sites/viaducdemillau/accueil-viaduc-de-millau/le-viaduc/le-viaduc-presentation-du-viaduc.html",
    region: "Tarn Valley",
    description: "Slender piers and cable stays carry a long deck high above the Tarn River valley near Millau. Seven main piers give the crossing its repeated slender profile.",
    descriptionSourceName: "Compagnie Eiffage du Viaduc de Millau",
    descriptionSource: "https://www.leviaducdemillau.com/sites/viaducdemillau/accueil-viaduc-de-millau/le-viaduc/le-viaduc-presentation-du-viaduc.html"
  },
  {
    id: "garabit",
    name: "Garabit Viaduct",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 44.9745645,
    lon: 3.1774879,
    source: "https://www.pays-saint-flour.fr/en/must-see/viaduc-de-garabit/",
    region: "Truy\xE8re Valley",
    description: "A red metal arch carries the railway across the Truy\xE8re valley, a prominent work associated with Gustave Eiffel.",
    descriptionSourceName: "Saint-Flour Tourist Office",
    descriptionSource: "https://www.pays-saint-flour.fr/en/must-see/viaduc-de-garabit/"
  },
  {
    id: "landwasser",
    name: "Landwasser Viaduct",
    country: "Switzerland",
    code: "CHE",
    tier: "rare",
    lat: 46.6809366,
    lon: 9.6760239,
    source: "https://www.rhb.ch/en/excursions/landwasser-express/",
    region: "Landwasser River, Filisur",
    description: "A curved stone railway viaduct crosses the Landwasser gorge and leads directly into a tunnel in the rock face.",
    descriptionSourceName: "Rhaetian Railway",
    descriptionSource: "https://www.rhb.ch/en/excursions/landwasser-express/"
  },
  {
    id: "chapelbridge",
    name: "Chapel Bridge",
    country: "Switzerland",
    code: "CHE",
    tier: "rare",
    lat: 47.05134195,
    lon: 8.30724012,
    source: "https://www.luzern.com/en/poi/chapel-bridge",
    region: "Reuss, Lucerne",
    description: "A covered timber bridge crosses the Reuss beside an octagonal water tower, with painted panels beneath its roof.",
    descriptionSourceName: "Lucerne Tourism",
    descriptionSource: "https://www.luzern.com/en/poi/chapel-bridge"
  },
  {
    id: "magdeburgbridge",
    name: "Magdeburg Water Bridge",
    country: "Germany",
    code: "DEU",
    tier: "rare",
    lat: 52.230833,
    lon: 11.701389,
    source: "https://www.magdeburg-tourist.de/Tourismus-Freizeit/System/Wasserstra%C3%9Fenkreuz.php?object=tx%2C115.3397.1",
    region: "Elbe, Magdeburg",
    description: "A navigable trough carries canal boats over the Elbe as part of Magdeburg\u2019s waterway crossing. Canal water and river water pass at different levels.",
    descriptionSourceName: "Magdeburg Tourism",
    descriptionSource: "https://www.magdeburg-tourist.de/Tourismus-Freizeit/System/Wasserstra%C3%9Fenkreuz.php?object=tx%2C115.3397.1"
  },
  {
    id: "hohenzollernbridge",
    name: "Hohenzollern Bridge",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 50.9414,
    lon: 6.964602,
    source: "https://www.koelntourismus.de/kunst-kultur/sehenswuerdigkeiten/detail/hohenzollernbruecke",
    region: "Rhine, Cologne",
    description: "Parallel metal arches carry railway tracks and footpaths over the Rhine beside central Cologne. Successive arch groups give the crossing a repeated curved outline.",
    descriptionSourceName: "Cologne Tourist Board",
    descriptionSource: "https://www.koelntourismus.de/kunst-kultur/sehenswuerdigkeiten/detail/hohenzollernbruecke"
  },
  {
    id: "glienickebridge",
    name: "Glienicke Bridge",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 52.413462,
    lon: 13.090227,
    source: "https://www.potsdam.de/en/glienicker-bruecke",
    region: "Havel, Potsdam",
    description: "A steel bridge crosses the Havel between Potsdam and Berlin, remembered for exchanges during the Cold War.",
    descriptionSourceName: "City of Potsdam",
    descriptionSource: "https://www.potsdam.de/en/glienicker-bruecke"
  },
  {
    id: "regensburgbridge",
    name: "Regensburg Stone Bridge",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 49.0226092,
    lon: 12.0972361,
    source: "https://tourismus.regensburg.de/en/experience-discover/sightseeing-unesco-world-heritage/stone-bridge",
    region: "Danube, Regensburg",
    description: "A long sequence of medieval stone arches crosses the Danube beside Regensburg\u2019s old town. The bridge links the old town with Stadtamhof across the river.",
    descriptionSourceName: "Regensburg Tourism",
    descriptionSource: "https://tourismus.regensburg.de/en/experience-discover/sightseeing-unesco-world-heritage/stone-bridge"
  },
  {
    id: "visegradbridge",
    name: "Mehmed Pa\u0161a Sokolovi\u0107 Bridge",
    country: "Bosnia and Herzegovina",
    code: "BIH",
    tier: "epic",
    lat: 43.78144444,
    lon: 19.288025,
    source: "https://whc.unesco.org/en/list/1260/",
    region: "Drina, Vi\u0161egrad",
    description: "Eleven masonry arches span the Drina at Vi\u0161egrad, forming an Ottoman bridge associated with architect Sinan.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1260/"
  },
  {
    id: "vizcayabridge",
    name: "Vizcaya Bridge",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 43.323175,
    lon: -3.01683333,
    source: "https://whc.unesco.org/en/list/1217/",
    region: "Nervi\xF3n, Biscay",
    description: "A high iron frame carries a suspended transporter gondola across the Nervi\xF3n estuary without blocking shipping.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/1217/"
  },
  {
    id: "alcantarabridge",
    name: "Roman Bridge of Alc\xE1ntara",
    country: "Spain",
    code: "ESP",
    tier: "rare",
    lat: 39.72247234,
    lon: -6.89229238,
    source: "https://www.spain.info/en/places-of-interest/puente-alcantara/",
    region: "Tagus, Extremadura",
    description: "Large stone arches and a central commemorative arch carry the Roman bridge over the Tagus at Alc\xE1ntara.",
    descriptionSourceName: "Spain Tourism",
    descriptionSource: "https://www.spain.info/en/places-of-interest/puente-alcantara/"
  },
  {
    id: "pulteneybridge",
    name: "Pulteney Bridge",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 51.38305556,
    lon: -2.35777778,
    source: "https://www.visitbath.co.uk/things-to-do/pulteney-bridge-p56151",
    region: "Avon, Bath",
    description: "Shops line both sides of this three-arched bridge over the Avon, beside the curved weir in central Bath.",
    descriptionSourceName: "Visit Bath",
    descriptionSource: "https://www.visitbath.co.uk/things-to-do/pulteney-bridge-p56151"
  },
  {
    id: "cliftonbridge",
    name: "Clifton Suspension Bridge",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 51.455,
    lon: -2.62776,
    source: "https://cliftonbridge.org.uk/",
    region: "Avon Gorge, Bristol",
    description: "Suspension chains carry a slender deck between masonry towers high over the tidal Avon Gorge. The bridge\u2019s anchorages meet the steep rocky sides of the gorge.",
    descriptionSourceName: "Clifton Suspension Bridge Trust",
    descriptionSource: "https://cliftonbridge.org.uk/"
  },
  {
    id: "gatesheadbridge",
    name: "Gateshead Millennium Bridge",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 54.96944444,
    lon: -1.59972222,
    source: "https://wilkinsoneyre.com/projects/gateshead-millennium-bridge",
    region: "Tyne",
    description: "A curved pedestrian deck and its supporting arch tilt together so boats can pass along the Tyne. The single sweeping arch rises above a curved walking and cycling route.",
    descriptionSourceName: "WilkinsonEyre",
    descriptionSource: "https://wilkinsoneyre.com/projects/gateshead-millennium-bridge"
  },
  {
    id: "newriverbridge",
    name: "New River Gorge Bridge",
    country: "United States",
    code: "USA",
    tier: "rare",
    lat: 38.06888889,
    lon: -81.0825,
    source: "https://www.nps.gov/neri/planyourvisit/nrgbridge.htm",
    region: "New River, West Virginia",
    description: "A great steel arch supports the road high above the New River, framing the wooded gorge beneath it. The miniature keeps the steel arch below the roadway, above the river.",
    descriptionSourceName: "National Park Service",
    descriptionSource: "https://www.nps.gov/neri/planyourvisit/nrgbridge.htm"
  },
  {
    id: "howrahbridge",
    name: "Howrah Bridge",
    country: "India",
    code: "IND",
    tier: "rare",
    lat: 22.5850528,
    lon: 88.3469761,
    source: "https://www.wbtourism.gov.in/district/detail/Howrah",
    region: "Hooghly, Kolkata",
    description: "A cantilevered steel truss spans the Hooghly between Kolkata and Howrah without river piers in its main span.",
    descriptionSourceName: "West Bengal Tourism",
    descriptionSource: "https://www.wbtourism.gov.in/district/detail/Howrah"
  },
  {
    id: "chengyangbridge",
    name: "Chengyang Wind and Rain Bridge",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 25.9004032,
    lon: 109.6380668,
    source: "https://sjfw.mct.gov.cn/site/dataservice/culdetails?curId=10&id=35025",
    region: "Linxi River, Guangxi",
    description: "Multiple timber pavilions and covered walkways stand above stone piers across the Linxi River in a Dong community landscape.",
    descriptionSourceName: "Ministry of Culture and Tourism of China",
    descriptionSource: "https://sjfw.mct.gov.cn/site/dataservice/culdetails?curId=10&id=35025"
  },
  {
    id: "zhaozhoubridge",
    name: "Zhaozhou Bridge",
    country: "China",
    code: "CHN",
    tier: "rare",
    lat: 37.7202212,
    lon: 114.7632736,
    source: "https://www.sjz.gov.cn/english/columns/19e5d37f-e324-41da-826a-bf5ccaa8c428/201706/08/2a04ae55-b98f-4be7-8f71-a0fb4c638069.html",
    region: "Xiao River, Hebei",
    description: "A broad segmental stone arch crosses the Xiao River, with smaller open arches reducing the weight above its shoulders.",
    descriptionSourceName: "Shijiazhuang Municipal Government",
    descriptionSource: "https://www.sjz.gov.cn/english/columns/19e5d37f-e324-41da-826a-bf5ccaa8c428/201706/08/2a04ae55-b98f-4be7-8f71-a0fb4c638069.html"
  },
  {
    id: "ludingbridge",
    name: "Luding Bridge",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 29.9144973,
    lon: 102.2302051,
    source: "https://www.luding.gov.cn/lsyg/article/682783",
    region: "Dadu River, Sichuan",
    description: "Iron chains span the Dadu River beneath a plank walkway, with anchoring structures at the two riverbanks.",
    descriptionSourceName: "Luding County Government",
    descriptionSource: "https://www.luding.gov.cn/lsyg/article/682783"
  },
  {
    id: "kintaibridge",
    name: "Kintai Bridge",
    country: "Japan",
    code: "JPN",
    tier: "rare",
    lat: 34.1676435,
    lon: 132.1783208,
    source: "https://kintaikyo.iwakuni-city.net/en/summary.html",
    region: "Nishiki River, Iwakuni",
    description: "Five timber arches cross the Nishiki River on stone piers, creating a repeated wave-like profile below Iwakuni\u2019s hills.",
    descriptionSourceName: "Iwakuni City",
    descriptionSource: "https://kintaikyo.iwakuni-city.net/en/summary.html"
  },
  {
    id: "banpobridge",
    name: "Banpo Bridge Rainbow Fountain",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 37.514556,
    lon: 126.9965074,
    source: "https://english.visitseoul.net/attractions/Banpodaegyo-Bridge-Moonlight-Rainbow-Fountain_/2222",
    region: "Hangang, Seoul",
    description: "Rows of water jets extend from the bridge sides toward the Han River, combining a working crossing with a large fountain.",
    descriptionSourceName: "Seoul Tourism Organization",
    descriptionSource: "https://english.visitseoul.net/attractions/Banpodaegyo-Bridge-Moonlight-Rainbow-Fountain_/2222"
  },
  {
    id: "seungilbridge",
    name: "Seungil Bridge",
    country: "South Korea",
    code: "KOR",
    tier: "common",
    lat: 38.1870538,
    lon: 127.3003263,
    source: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=66587",
    region: "Hantangang, Cheorwon",
    description: "Concrete arches carry the old crossing above the Hantangang\u2019s volcanic gorge near Cheorwon. Its construction history connects work undertaken before and after the Korean War.",
    descriptionSourceName: "Korea Tourism Organization",
    descriptionSource: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=66587"
  },
  {
    id: "panamacanal",
    name: "Panama Canal",
    country: "Panama",
    code: "PAN",
    tier: "legendary",
    lat: 9.0620248,
    lon: -79.664308,
    source: "https://pancanal.com/en/",
    region: "Isthmus of Panama",
    description: "Lock chambers lift ships between sea level and an inland waterway across the isthmus, connecting Atlantic and Pacific routes.",
    descriptionSourceName: "Panama Canal Authority",
    descriptionSource: "https://pancanal.com/en/"
  },
  {
    id: "suezcanal",
    name: "Suez Canal",
    country: "Egypt",
    code: "EGY",
    tier: "common",
    lat: 30.6052767,
    lon: 32.3331003,
    source: "https://www.suezcanal.gov.eg/English/About/SuezCanal/Pages/CanalCharacteristics.aspx",
    region: "Isthmus of Suez",
    description: "A sea-level shipping canal cuts through the Suez isthmus, linking Mediterranean and Red Sea routes without lock lifts.",
    descriptionSourceName: "Suez Canal Authority",
    descriptionSource: "https://www.suezcanal.gov.eg/English/About/SuezCanal/Pages/CanalCharacteristics.aspx"
  },
  {
    id: "corinthcanal",
    name: "Corinth Canal",
    country: "Greece",
    code: "GRC",
    tier: "common",
    lat: 37.9341193,
    lon: 22.9846912,
    source: "https://corinthcanal.com/",
    region: "Isthmus of Corinth",
    description: "A narrow straight waterway cuts between steep rock walls across the isthmus separating the Peloponnese from mainland Greece.",
    descriptionSourceName: "Corinth Canal Authority",
    descriptionSource: "https://corinthcanal.com/"
  },
  {
    id: "kielcanal",
    name: "Kiel Canal",
    country: "Germany",
    code: "DEU",
    tier: "common",
    lat: 54.2081189,
    lon: 9.5721775,
    source: "https://initiative-kiel-canal.de/en/technical-data/",
    region: "Schleswig-Holstein",
    description: "An inland shipping canal links North Sea and Baltic approaches, with locks at its ends and bridges above the channel.",
    descriptionSourceName: "Initiative Kiel Canal",
    descriptionSource: "https://initiative-kiel-canal.de/en/technical-data/"
  },
  {
    id: "canaldumidi",
    name: "Canal du Midi",
    country: "France",
    code: "FRA",
    tier: "rare",
    lat: 43.61,
    lon: 1.416,
    source: "https://whc.unesco.org/en/list/770/",
    region: "Occitanie",
    description: "Canal channels, locks, aqueducts and bridges form a historic engineered waterway across southern France.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/770/"
  },
  {
    id: "canalcentre",
    name: "Canal du Centre Boat Lifts",
    country: "Belgium",
    code: "BEL",
    tier: "epic",
    lat: 50.48111,
    lon: 4.13722,
    source: "https://whc.unesco.org/en/list/856/",
    region: "Hainaut",
    description: "Four historic hydraulic boat lifts raise and lower vessels between canal levels in Belgium\u2019s industrial waterway landscape.",
    descriptionSourceName: "UNESCO World Heritage Centre",
    descriptionSource: "https://whc.unesco.org/en/list/856/"
  },
  {
    id: "falkirkwheel",
    name: "Falkirk Wheel",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 56.0003559,
    lon: -3.841725,
    source: "https://www.scottishcanals.co.uk/visit/canals/visit-the-forth-clyde-canal/attractions/the-falkirk-wheel",
    region: "Forth and Clyde Canal",
    description: "Two water-filled gondolas rotate around a central axle to move boats between canal levels near Falkirk.",
    descriptionSourceName: "Scottish Canals",
    descriptionSource: "https://www.scottishcanals.co.uk/visit/canals/visit-the-forth-clyde-canal/attractions/the-falkirk-wheel"
  },
  {
    id: "andertonlift",
    name: "Anderton Boat Lift",
    country: "United Kingdom",
    code: "GBR",
    tier: "rare",
    lat: 53.2729693,
    lon: -2.53069879,
    source: "https://canalrivertrust.org.uk/things-to-do/museums-and-attractions/anderton-boat-lift-and-visitor-centre-cheshire",
    region: "River Weaver",
    description: "A pair of water-filled caissons lifts boats between the River Weaver and the higher Trent and Mersey Canal.",
    descriptionSourceName: "Canal and River Trust",
    descriptionSource: "https://canalrivertrust.org.uk/things-to-do/museums-and-attractions/anderton-boat-lift-and-visitor-centre-cheshire"
  },
  {
    id: "bingleylocks",
    name: "Bingley Five Rise Locks",
    country: "United Kingdom",
    code: "GBR",
    tier: "common",
    lat: 53.856254,
    lon: -1.8381464,
    source: "https://canalrivertrust.org.uk/news-and-views/media-centre/filming-and-photography/our-filming-and-photography-locations/bingley-five-rise-locks-leeds-and-liverpool-canal",
    region: "Leeds and Liverpool Canal",
    description: "Five adjoining lock chambers form a steep staircase for boats on the Leeds and Liverpool Canal. The upper gate of one chamber also serves the chamber above it.",
    descriptionSourceName: "Canal and River Trust",
    descriptionSource: "https://canalrivertrust.org.uk/news-and-views/media-centre/filming-and-photography/our-filming-and-photography-locations/bingley-five-rise-locks-leeds-and-liverpool-canal"
  },
  {
    id: "briareaqueduct",
    name: "Briare Aqueduct",
    country: "France",
    code: "FRA",
    tier: "common",
    lat: 47.6311883,
    lon: 2.734394,
    source: "https://www.terresdeloireetcanaux.com/patrimoine-culturel/pont-canal-de-briare/",
    region: "Loire, Briare",
    description: "An iron water trough carries canal boats above the Loire, with decorated lamp posts lining the aqueduct\u2019s walkway.",
    descriptionSourceName: "Briare Tourist Office",
    descriptionSource: "https://www.terresdeloireetcanaux.com/patrimoine-culturel/pont-canal-de-briare/"
  },
  {
    id: "gotacanal",
    name: "G\xF6ta Canal",
    country: "Sweden",
    code: "SWE",
    tier: "common",
    lat: 58.5587698,
    lon: 15.0965535,
    source: "https://www.gotakanal.se/en",
    region: "G\xF6ta Canal",
    description: "Locks and hand-worked waterways connect inland stretches across southern Sweden, represented by a stepped lock and towpath.",
    descriptionSourceName: "G\xF6ta Canal Company",
    descriptionSource: "https://www.gotakanal.se/en"
  },
  {
    id: "rhinefalls",
    name: "Rhine Falls",
    country: "Switzerland",
    code: "CHE",
    tier: "common",
    lat: 47.6783615,
    lon: 8.6148706,
    source: "https://rheinfall.ch/en/",
    region: "Rhine, Schaffhausen",
    description: "The Rhine tumbles over a broad rocky ledge near Schaffhausen, splitting around rocks that stand within the falling water.",
    descriptionSourceName: "Rhine Falls Association",
    descriptionSource: "https://rheinfall.ch/en/"
  },
  {
    id: "gullfoss",
    name: "Gullfoss",
    country: "Iceland",
    code: "ISL",
    tier: "rare",
    lat: 64.327316,
    lon: -20.1191026,
    source: "https://ust.is/english/visiting-iceland/protected-areas/south/gullfoss/",
    region: "Hv\xEDt\xE1",
    description: "The Hv\xEDt\xE1 drops in two stages before entering a narrow canyon, making a stepped waterfall in southern Iceland.",
    descriptionSourceName: "Environment Agency of Iceland",
    descriptionSource: "https://ust.is/english/visiting-iceland/protected-areas/south/gullfoss/"
  },
  {
    id: "dettifoss",
    name: "Dettifoss",
    country: "Iceland",
    code: "ISL",
    tier: "common",
    lat: 65.8143509,
    lon: -16.3844911,
    source: "https://www.vatnajokulsthjodgardur.is/en/areas/jokulsargljufur",
    region: "J\xF6kuls\xE1 \xE1 Fj\xF6llum",
    description: "A powerful broad waterfall pours into the J\xF6kuls\xE1rglj\xFAfur canyon, carrying glacier-fed river water through dark rock.",
    descriptionSourceName: "Vatnaj\xF6kull National Park",
    descriptionSource: "https://www.vatnajokulsthjodgardur.is/en/areas/jokulsargljufur"
  },
  {
    id: "kaieteur",
    name: "Kaieteur Falls",
    country: "Guyana",
    code: "GUY",
    tier: "epic",
    lat: 5.1749417,
    lon: -59.4806521,
    source: "https://guyanatourism.com/kaieteur-falls/",
    region: "Potaro River",
    description: "The Potaro River drops in a single great plunge over a sandstone escarpment surrounded by forest. The miniature keeps the unbroken drop separate from the surrounding cliff.",
    descriptionSourceName: "Guyana Tourism Authority",
    descriptionSource: "https://guyanatourism.com/kaieteur-falls/"
  },
  {
    id: "khonefalls",
    name: "Khone Phapheng Falls",
    country: "Laos",
    code: "LAO",
    tier: "common",
    lat: 13.9597676,
    lon: 105.986526,
    source: "https://www.tourismlaos.org/waterfalls/",
    region: "Mekong, Champasak",
    description: "The Mekong spreads through rocky channels and powerful rapids at Khone Phapheng near the southern border of Laos.",
    descriptionSourceName: "Laos Tourism",
    descriptionSource: "https://www.tourismlaos.org/waterfalls/"
  },
  {
    id: "bangiocfalls",
    name: "Ban Gioc Waterfall",
    country: "Vietnam",
    code: "VNM",
    tier: "rare",
    lat: 22.8542722,
    lon: 106.7233149,
    source: "https://vietnam.travel/things-to-do/ban-gioc-waterfall-majestic-beauty-northern-border/",
    region: "Qu\xE2y S\u01A1n River, Cao Bang",
    description: "Broad tiers of water fall among green karst hills on the Qu\xE2y S\u01A1n River at the Vietnam\u2013China border. The miniature uses separate rock shelves for the stepped streams.",
    descriptionSourceName: "Vietnam National Authority of Tourism",
    descriptionSource: "https://vietnam.travel/things-to-do/ban-gioc-waterfall-majestic-beauty-northern-border/"
  },
  {
    id: "huangguoshu",
    name: "Huangguoshu Waterfall",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 25.992,
    lon: 105.666,
    source: "https://whc.unesco.org/en/tentativelists/6380/",
    region: "Baishui River, Guizhou",
    description: "A wide curtain of river water falls over a limestone ledge, with a passage known for running behind the waterfall.",
    descriptionSourceName: "UNESCO Tentative Lists",
    descriptionSource: "https://whc.unesco.org/en/tentativelists/6380/"
  },
  {
    id: "shifenfalls",
    name: "Shifen Waterfall",
    country: "Taiwan",
    code: "TWN",
    tier: "common",
    lat: 25.04897,
    lon: 121.78746,
    source: "https://newtaipei.travel/en/Attractions/Detail/111592",
    region: "Keelung River, Pingxi",
    description: "The Keelung River spreads across a curved rock ledge to form a broad horseshoe-shaped waterfall near Shifen.",
    descriptionSourceName: "New Taipei City Tourism and Travel Department",
    descriptionSource: "https://newtaipei.travel/en/Attractions/Detail/111592"
  },
  {
    id: "hukoufalls",
    name: "Hukou Waterfall",
    country: "China",
    code: "CHN",
    tier: "common",
    lat: 36.14722222,
    lon: 110.44388889,
    source: "https://english.www.gov.cn/news/202408/12/content_WS66b96ebbc6d0868f4e8e9da0.html",
    region: "Yellow River, Shanxi\u2013Shaanxi",
    description: "The Yellow River narrows sharply through a rocky opening, creating a forceful waterfall between Shanxi and Shaanxi.",
    descriptionSourceName: "State Council of China",
    descriptionSource: "https://english.www.gov.cn/news/202408/12/content_WS66b96ebbc6d0868f4e8e9da0.html"
  },
  {
    id: "athirappilly",
    name: "Athirappilly Falls",
    country: "India",
    code: "IND",
    tier: "common",
    lat: 10.28472222,
    lon: 76.56861111,
    source: "https://www.keralatourism.org/destination/athirappalli-vazhachal-waterfalls/79/",
    region: "Chalakudy River, Kerala",
    description: "The Chalakudy River drops over a broad rocky face in forested Kerala, breaking into several white streams.",
    descriptionSourceName: "Kerala Tourism",
    descriptionSource: "https://www.keralatourism.org/destination/athirappalli-vazhachal-waterfalls/79/"
  },
  {
    id: "tequendama",
    name: "Tequendama Falls",
    country: "Colombia",
    code: "COL",
    tier: "common",
    lat: 4.57486111,
    lon: -74.29338889,
    source: "https://colombia.travel/en/cerca-de-bogota-soacha-guatavita-y-la-calera",
    region: "Bogot\xE1 River, Cundinamarca",
    description: "The Bogot\xE1 River plunges into a steep forest-lined gorge southwest of the Colombian capital. The miniature contrasts the narrow falling water with the tall rock walls.",
    descriptionSourceName: "Colombia Travel",
    descriptionSource: "https://colombia.travel/en/cerca-de-bogota-soacha-guatavita-y-la-calera"
  },
  {
    id: "saltosmonday",
    name: "Saltos del Monday",
    country: "Paraguay",
    code: "PRY",
    tier: "common",
    lat: -25.56194444,
    lon: -54.63138889,
    source: "https://visitparaguay.travel/places/saltos-del-monday",
    region: "Monday River, Presidente Franco",
    description: "Several strong river cascades descend through forest near Presidente Franco, separate from the nearby Iguaz\xFA Falls system.",
    descriptionSourceName: "Paraguay National Tourism Secretariat",
    descriptionSource: "https://visitparaguay.travel/places/saltos-del-monday"
  }
];

// plugins/orcatopia/src/landmark-variants.ts
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

// plugins/orcatopia/src/tourism.ts
var TOURISM = {
  minuteMs: 6e4,
  visitsPerPlacePerMinute: 1,
  coinsPerVisit: 1,
  offlineCapMs: 12 * 60 * 6e4,
  awaySummaryMs: 6e4,
  pollMs: 3e4,
  maxCoins: 1e9,
  maxVisitors: 6,
  entranceCell: 14,
  visualPlacesPerVisitor: 2
};
var specialBuildings = [
  {
    id: "tourism-info",
    name: "Tourist information",
    cost: 10,
    color: "#69a99a",
    activity: "guide"
  },
  {
    id: "tourism-cafe",
    name: "Island caf\xE9",
    cost: 60,
    color: "#d2a078",
    activity: "drink"
  },
  {
    id: "tourism-shop",
    name: "Souvenir shop",
    cost: 180,
    color: "#c58a9e",
    activity: "shop"
  },
  {
    id: "tourism-lookout",
    name: "Scenic lookout",
    cost: 360,
    color: "#829fc0",
    activity: "photo"
  }
];
var specialBuilding = (id) => specialBuildings.find((b) => b.id === id);
function tourismRate(state) {
  return new Set(
    state.placements.filter((p) => landmarkById(p.landmark)).map((p) => baseId(p.landmark))
  ).size * TOURISM.visitsPerPlacePerMinute;
}
function startTourism(now) {
  return { coins: 0, settledAt: now, remainder: 0, buildings: [], away: null };
}
function settleTourism(tourism, rate, now) {
  if (tourism.settledAt - now > TOURISM.offlineCapMs)
    return { ...tourism, settledAt: now };
  const elapsed = Math.max(0, now - tourism.settledAt);
  const creditedMs = Math.min(elapsed, TOURISM.offlineCapMs);
  const units = creditedMs * rate + tourism.remainder;
  const visitors = Math.floor(units / TOURISM.minuteMs);
  const coins = Math.min(
    TOURISM.maxCoins - tourism.coins,
    visitors * TOURISM.coinsPerVisit
  );
  return {
    ...tourism,
    coins: tourism.coins + coins,
    settledAt: Math.max(now, tourism.settledAt),
    remainder: units % TOURISM.minuteMs,
    away: elapsed >= TOURISM.awaySummaryMs ? {
      at: now,
      elapsedMs: creditedMs,
      coins,
      visitors,
      capped: elapsed > creditedMs
    } : tourism.away
  };
}
function validateTourism(value) {
  if (value === null) return null;
  const t = value;
  const integer = (n) => Number.isSafeInteger(n) && n >= 0;
  if (!t || !integer(t.coins) || t.coins > TOURISM.maxCoins || !integer(t.settledAt) || !integer(t.remainder) || t.remainder >= TOURISM.minuteMs || !Array.isArray(t.buildings) || new Set(t.buildings).size !== t.buildings.length || t.buildings.some((id) => !specialBuilding(id)) || t.away !== null && (!t.away || !integer(t.away.at) || !integer(t.away.elapsedMs) || t.away.elapsedMs > TOURISM.offlineCapMs || !integer(t.away.coins) || !integer(t.away.visitors) || typeof t.away.capped !== "boolean"))
    throw Error("Invalid tourism ledger. Save was not overwritten.");
  return structuredClone({
    coins: t.coins,
    settledAt: t.settledAt,
    remainder: t.remainder,
    buildings: t.buildings,
    away: t.away
  });
}

// plugins/orcatopia/src/catalog-700.json
var catalog_700_default = [
  {
    record: {
      id: "eddystone",
      name: "Eddystone Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 50.180717,
      lon: -4.2656,
      source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/eddystone-lighthouse",
      region: "Eddystone Rocks",
      description: "A tapering granite tower marks the Eddystone rocks off Plymouth; the stump of an earlier lighthouse remains nearby.",
      descriptionSourceName: "Trinity House",
      descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/eddystone-lighthouse"
    },
    korean: {
      name: "\uC5D0\uB514\uC2A4\uD1A4 \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uC5D0\uB514\uC2A4\uD1A4 \uC554\uCD08",
      description: "\uD50C\uB9AC\uBA38\uC2A4 \uC55E\uBC14\uB2E4 \uC5D0\uB514\uC2A4\uD1A4 \uC554\uCD08\uC5D0 \uD654\uAC15\uC554 \uB4F1\uB300\uAC00 \uC11C \uC788\uACE0, \uAC00\uAE4C\uC774\uC5D0\uB294 \uC61B \uB4F1\uB300\uC758 \uBC11\uBD80\uBD84\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD2B8\uB9AC\uB2C8\uD2F0\uD558\uC6B0\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 74,
      width: 19,
      spans: 0,
      terrainHeight: 8,
      actorX: 19,
      color: "#c88b73",
      motif: "beacon"
    },
    scene: {
      description: "Eddystone Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uC5D0\uB514\uC2A4\uD1A4 \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bishoprock",
      name: "Bishop Rock Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 49.872861,
      lon: -6.445556,
      source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/bishop-rock-lighthouse",
      region: "Isles of Scilly",
      description: "A tall stone lighthouse rises from a small Atlantic rock west of the Isles of Scilly, with a landing platform above its lantern.",
      descriptionSourceName: "Trinity House",
      descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/bishop-rock-lighthouse"
    },
    korean: {
      name: "\uBE44\uC20D\uB85D \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uC2E4\uB9AC \uC81C\uB3C4",
      description: "\uC2E4\uB9AC \uC81C\uB3C4 \uC11C\uCABD\uC758 \uC791\uC740 \uB300\uC11C\uC591 \uC554\uCD08 \uC704\uC5D0 \uB192\uC740 \uC11D\uC870 \uB4F1\uB300\uAC00 \uC19F\uC544 \uC788\uC73C\uBA70, \uB4F1\uB871 \uC704\uB85C \uCC29\uB959\uC7A5\uC774 \uB193\uC5EC \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD2B8\uB9AC\uB2C8\uD2F0\uD558\uC6B0\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 94,
      width: 18,
      spans: 0,
      terrainHeight: 5,
      actorX: 95,
      color: "#629b9f",
      motif: "gulls"
    },
    scene: {
      description: "Bishop Rock Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uBE44\uC20D\uB85D \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "wolfrock",
      name: "Wolf Rock Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 49.945317,
      lon: -5.809167,
      source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/wolf-rock-lighthouse",
      region: "Cornwall",
      description: "Granite masonry forms this isolated lighthouse between Land\u2019s End and the Isles of Scilly, surrounded by open water.",
      descriptionSourceName: "Trinity House",
      descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/wolf-rock-lighthouse"
    },
    korean: {
      name: "\uC6B8\uD504\uB85D \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uCF58\uC6D4",
      description: "\uB79C\uC988\uC5D4\uB4DC\uC640 \uC2E4\uB9AC \uC81C\uB3C4 \uC0AC\uC774 \uBC14\uB2E4 \uD55C\uAC00\uC6B4\uB370, \uD654\uAC15\uC554\uC744 \uC313\uC544 \uC62C\uB9B0 \uB4F1\uB300\uAC00 \uC678\uB530\uB85C \uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD2B8\uB9AC\uB2C8\uD2F0\uD558\uC6B0\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 80,
      width: 17,
      spans: 0,
      terrainHeight: 10,
      actorX: 20,
      color: "#d4b078",
      motif: "spray"
    },
    scene: {
      description: "Wolf Rock Lighthouse: Small wave crests curl around the tower base.",
      descriptionKo: "\uC6B8\uD504\uB85D \uB4F1\uB300: \uC791\uC740 \uD30C\uB3C4\uAC00 \uB4F1\uB300 \uBC11\uBD80\uBD84\uC744 \uD718\uAC10\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "longships",
      name: "Longships Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 50.066867,
      lon: -5.746867,
      source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/longships-lighthouse",
      region: "Land\u2019s End",
      description: "The stone tower stands on the largest of the Longships rocks, marking the sea approaches to Land\u2019s End.",
      descriptionSourceName: "Trinity House",
      descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/longships-lighthouse"
    },
    korean: {
      name: "\uB871\uC2ED\uC2A4 \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uB79C\uC988\uC5D4\uB4DC",
      description: "\uB871\uC2ED\uC2A4 \uC554\uCD08 \uC911 \uAC00\uC7A5 \uD070 \uBC14\uC704\uC5D0 \uC138\uC6B4 \uC11D\uC870 \uB4F1\uB300\uAC00 \uB79C\uC988\uC5D4\uB4DC\uB85C \uB4E4\uC5B4\uC624\uB294 \uBC14\uB2F7\uAE38\uC744 \uC54C\uB9BD\uB2C8\uB2E4.",
      descriptionSourceName: "\uD2B8\uB9AC\uB2C8\uD2F0\uD558\uC6B0\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 65,
      width: 20,
      spans: 0,
      terrainHeight: 21,
      actorX: 102,
      color: "#839b70",
      motif: "beacon"
    },
    scene: {
      description: "Longships Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uB871\uC2ED\uC2A4 \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "needleslight",
      name: "The Needles Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 50.662233,
      lon: -1.591667,
      source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/needles-lighthouse",
      region: "Isle of Wight",
      description: "A red-and-white tower stands at the seaward end of the chalk Needles, where pale rock pinnacles meet the Solent approaches.",
      descriptionSourceName: "Trinity House",
      descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/needles-lighthouse"
    },
    korean: {
      name: "\uB2C8\uB4E4\uC2A4 \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uC640\uC774\uD2B8\uC12C",
      description: "\uBD89\uACE0 \uD770 \uB4F1\uB300\uAC00 \uD770 \uBC31\uC545 \uBC14\uC704 \uAE30\uB465\uB4E4\uC774 \uBC14\uB2E4\uB85C \uBED7\uC740 \uB2C8\uB4E4\uC2A4 \uB05D\uC5D0\uC11C \uC194\uB7F0\uD2B8 \uD574\uD611\uC758 \uC785\uAD6C\uB97C \uBE44\uCDA5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD2B8\uB9AC\uB2C8\uD2F0\uD558\uC6B0\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "stripedlight",
      height: 70,
      width: 21,
      spans: 3,
      terrainHeight: 40,
      actorX: 16,
      color: "#93a8b0",
      motif: "gulls"
    },
    scene: {
      description: "The Needles Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uB2C8\uB4E4\uC2A4 \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "smallslight",
      name: "Smalls Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 51.721267,
      lon: -5.669867,
      source: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/smalls-lighthouse",
      region: "Pembrokeshire",
      description: "A granite tower replaced an earlier timber lighthouse on the remote Smalls rocks off the Welsh coast.",
      descriptionSourceName: "Trinity House",
      descriptionSource: "https://www.trinityhouse.co.uk/lighthouses-and-lightvessels/smalls-lighthouse"
    },
    korean: {
      name: "\uC2A4\uBAB0\uC2A4 \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uD3A8\uBE0C\uB85C\uD06C\uC154",
      description: "\uC6E8\uC77C\uC2A4 \uC55E\uBC14\uB2E4\uC758 \uC678\uB534 \uC2A4\uBAB0\uC2A4 \uC554\uCD08\uC5D0\uB294 \uC61B \uBAA9\uC870 \uB4F1\uB300\uB97C \uB300\uC2E0\uD55C \uD654\uAC15\uC554 \uB4F1\uB300\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD2B8\uB9AC\uB2C8\uD2F0\uD558\uC6B0\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 79,
      width: 20,
      spans: 0,
      terrainHeight: 7,
      actorX: 93,
      color: "#b79889",
      motif: "spray"
    },
    scene: {
      description: "Smalls Lighthouse: Small wave crests curl around the tower base.",
      descriptionKo: "\uC2A4\uBAB0\uC2A4 \uB4F1\uB300: \uC791\uC740 \uD30C\uB3C4\uAC00 \uB4F1\uB300 \uBC11\uBD80\uBD84\uC744 \uD718\uAC10\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bellrock",
      name: "Bell Rock Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 56.43441667,
      lon: -2.38716667,
      source: "https://www.nlb.org.uk/lighthouses/bell-rock/",
      region: "Firth of Forth approaches",
      description: "Built on a reef covered at high tide, the slender masonry tower guides shipping off Scotland\u2019s east coast.",
      descriptionSourceName: "Northern Lighthouse Board",
      descriptionSource: "https://www.nlb.org.uk/lighthouses/bell-rock/"
    },
    korean: {
      name: "\uBCA8\uB85D \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uD3EC\uC2A4\uB9CC \uBC14\uAE65 \uD56D\uB85C",
      description: "\uBC00\uBB3C\uC774\uBA74 \uC7A0\uAE30\uB294 \uC554\uCD08 \uC704\uC5D0 \uAC00\uB290\uB2E4\uB780 \uC11D\uC870 \uB4F1\uB300\uB97C \uC138\uC6CC \uC2A4\uCF54\uD2C0\uB79C\uB4DC \uB3D9\uD574\uC548\uC758 \uBC30\uB4E4\uC744 \uC548\uB0B4\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uBD81\uBD80\uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 89,
      width: 17,
      spans: 0,
      terrainHeight: 4,
      actorX: 18,
      color: "#c88b73",
      motif: "beacon"
    },
    scene: {
      description: "Bell Rock Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uBCA8\uB85D \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "skerryvore",
      name: "Skerryvore Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 56.32276667,
      lon: -7.1147,
      source: "https://www.nlb.org.uk/lighthouses/skerryvore/",
      region: "Tiree",
      description: "A tall, curved granite tower stands on a reef southwest of Tiree, a landmark of Scottish rock-lighthouse engineering.",
      descriptionSourceName: "Northern Lighthouse Board",
      descriptionSource: "https://www.nlb.org.uk/lighthouses/skerryvore/"
    },
    korean: {
      name: "\uC2A4\uCF00\uB9AC\uBCF4\uC5B4 \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uD0C0\uC774\uB9AC\uC12C \uC55E\uBC14\uB2E4",
      description: "\uD0C0\uC774\uB9AC\uC12C \uB0A8\uC11C\uCABD \uC554\uCD08 \uC704\uC5D0 \uACE1\uC120\uD615 \uD654\uAC15\uC554 \uB4F1\uB300\uAC00 \uB192\uC774 \uC19F\uC544 \uC2A4\uCF54\uD2C0\uB79C\uB4DC \uD574\uC0C1 \uB4F1\uB300 \uAC74\uCD95\uC758 \uD2B9\uC9D5\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4.",
      descriptionSourceName: "\uBD81\uBD80\uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 102,
      width: 20,
      spans: 0,
      terrainHeight: 9,
      actorX: 97,
      color: "#629b9f",
      motif: "gulls"
    },
    scene: {
      description: "Skerryvore Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uC2A4\uCF00\uB9AC\uBCF4\uC5B4 \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "dubhartach",
      name: "Dubh Artach Lighthouse",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 56.13256667,
      lon: -6.63465,
      source: "https://www.nlb.org.uk/lighthouses/dubh-artach/",
      region: "Inner Hebrides",
      description: "The offshore rock supports a stone lighthouse with a broad red band, exposed to Atlantic waves southwest of Mull.",
      descriptionSourceName: "Northern Lighthouse Board",
      descriptionSource: "https://www.nlb.org.uk/lighthouses/dubh-artach/"
    },
    korean: {
      name: "\uB450 \uC544\uB974\uD0C0\uD750 \uB4F1\uB300",
      country: "\uC601\uAD6D",
      region: "\uC774\uB108\uD5E4\uBE0C\uB9AC\uB514\uC2A4 \uC81C\uB3C4",
      description: "\uBA40\uC12C \uB0A8\uC11C\uCABD\uC758 \uB300\uC11C\uC591 \uD30C\uB3C4\uB97C \uBC1B\uB294 \uC554\uCD08\uC5D0 \uBD89\uC740 \uB760\uB97C \uB450\uB978 \uC11D\uC870 \uB4F1\uB300\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uBD81\uBD80\uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "stripedlight",
      height: 76,
      width: 23,
      spans: 1,
      terrainHeight: 16,
      actorX: 20,
      color: "#d4b078",
      motif: "spray"
    },
    scene: {
      description: "Dubh Artach Lighthouse: Small wave crests curl around the tower base.",
      descriptionKo: "\uB450 \uC544\uB974\uD0C0\uD750 \uB4F1\uB300: \uC791\uC740 \uD30C\uB3C4\uAC00 \uB4F1\uB300 \uBC11\uBD80\uBD84\uC744 \uD718\uAC10\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "chickenrock",
      name: "Chicken Rock Lighthouse",
      country: "Isle of Man",
      code: "IMN",
      tier: "common",
      lat: 54.03785,
      lon: -4.83858333,
      source: "https://www.nlb.org.uk/lighthouses/chicken-rock/",
      region: "Calf of Man",
      description: "An isolated granite tower marks a submerged hazard off the Calf of Man at the southern approaches to the Isle of Man.",
      descriptionSourceName: "Northern Lighthouse Board",
      descriptionSource: "https://www.nlb.org.uk/lighthouses/chicken-rock/"
    },
    korean: {
      name: "\uCE58\uD0A8\uB85D \uB4F1\uB300",
      country: "\uB9E8\uC12C",
      region: "\uCE7C\uD504\uC624\uBE0C\uB9E8 \uC55E\uBC14\uB2E4",
      description: "\uB9E8\uC12C \uB0A8\uCABD \uCE7C\uD504\uC624\uBE0C\uB9E8 \uC55E\uBC14\uB2E4\uC758 \uC7A0\uAE34 \uC554\uCD08\uB97C \uC678\uB530\uB85C \uC120 \uD654\uAC15\uC554 \uB4F1\uB300\uAC00 \uC54C\uB9BD\uB2C8\uB2E4.",
      descriptionSourceName: "\uBD81\uBD80\uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 86,
      width: 21,
      spans: 0,
      terrainHeight: 5,
      actorX: 102,
      color: "#839b70",
      motif: "beacon"
    },
    scene: {
      description: "Chicken Rock Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uCE58\uD0A8\uB85D \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "fastnet",
      name: "Fastnet Lighthouse",
      country: "Ireland",
      code: "IRL",
      tier: "rare",
      lat: 51.3893,
      lon: -9.60297,
      source: "https://irishlights.ie/safety-navigation/our-lighthouses/fastnet.aspx",
      region: "County Cork",
      description: "A curved granite tower rises above Fastnet Rock southwest of Cape Clear, built to resist powerful Atlantic waves.",
      descriptionSourceName: "Commissioners of Irish Lights",
      descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/fastnet.aspx"
    },
    korean: {
      name: "\uD328\uC2A4\uD2B8\uB137 \uB4F1\uB300",
      country: "\uC544\uC77C\uB79C\uB4DC",
      region: "\uCF54\uD06C\uC8FC",
      description: "\uCF00\uC774\uD504\uD074\uB9AC\uC5B4 \uB0A8\uC11C\uCABD \uD328\uC2A4\uD2B8\uB137 \uC554\uCD08 \uC704\uC5D0 \uB300\uC11C\uC591\uC758 \uAC70\uC13C \uD30C\uB3C4\uB97C \uACAC\uB514\uB3C4\uB85D \uACE1\uC120\uD615 \uD654\uAC15\uC554 \uB4F1\uB300\uB97C \uC138\uC6E0\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC544\uC77C\uB79C\uB4DC \uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 91,
      width: 25,
      spans: 0,
      terrainHeight: 24,
      actorX: 16,
      color: "#93a8b0",
      motif: "gulls"
    },
    scene: {
      description: "Fastnet Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uD328\uC2A4\uD2B8\uB137 \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "tuskar",
      name: "Tuskar Lighthouse",
      country: "Ireland",
      code: "IRL",
      tier: "common",
      lat: 52.20292,
      lon: -6.20742,
      source: "https://irishlights.ie/safety-navigation/our-lighthouses/tuskar-rock.aspx",
      region: "County Wexford",
      description: "A white round tower marks Tuskar Rock off County Wexford, helping vessels approaching Ireland\u2019s southeast coast.",
      descriptionSourceName: "Commissioners of Irish Lights",
      descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/tuskar-rock.aspx"
    },
    korean: {
      name: "\uD130\uC2A4\uCEE4 \uB4F1\uB300",
      country: "\uC544\uC77C\uB79C\uB4DC",
      region: "\uC6E9\uC2A4\uD37C\uB4DC\uC8FC",
      description: "\uC6E9\uC2A4\uD37C\uB4DC\uC8FC \uC55E\uBC14\uB2E4 \uD130\uC2A4\uCEE4 \uC554\uCD08\uC758 \uD770 \uC6D0\uD615 \uB4F1\uB300\uAC00 \uC544\uC77C\uB79C\uB4DC \uB0A8\uB3D9\uCABD \uD574\uC548\uC73C\uB85C \uB2E4\uAC00\uC624\uB294 \uBC30\uB97C \uC548\uB0B4\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC544\uC77C\uB79C\uB4DC \uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 77,
      width: 25,
      spans: 0,
      terrainHeight: 13,
      actorX: 99,
      color: "#b79889",
      motif: "spray"
    },
    scene: {
      description: "Tuskar Lighthouse: Small wave crests curl around the tower base.",
      descriptionKo: "\uD130\uC2A4\uCEE4 \uB4F1\uB300: \uC791\uC740 \uD30C\uB3C4\uAC00 \uB4F1\uB300 \uBC11\uBD80\uBD84\uC744 \uD718\uAC10\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "rockabill",
      name: "Rockabill Lighthouse",
      country: "Ireland",
      code: "IRL",
      tier: "common",
      lat: 53.59685,
      lon: -6.00495,
      source: "https://irishlights.ie/safety-navigation/our-lighthouses/rockabill.aspx",
      region: "County Dublin",
      description: "A white lighthouse with a dark band stands on one of two small rocky islands off the Dublin coast. The neighbouring rocks form a distinctive offshore pair.",
      descriptionSourceName: "Commissioners of Irish Lights",
      descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/rockabill.aspx"
    },
    korean: {
      name: "\uB85C\uCEE4\uBE4C \uB4F1\uB300",
      country: "\uC544\uC77C\uB79C\uB4DC",
      region: "\uB354\uBE14\uB9B0\uC8FC \uC55E\uBC14\uB2E4",
      description: "\uB354\uBE14\uB9B0 \uC55E\uBC14\uB2E4\uC758 \uC791\uC740 \uBC14\uC704\uC12C \uB450 \uAC1C \uC911 \uD55C \uACF3\uC5D0 \uAC80\uC740 \uB760\uB97C \uB450\uB978 \uD770 \uB4F1\uB300\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4. \uC774\uC6C3\uD55C \uB450 \uBC14\uC704\uC12C\uC774 \uBC14\uB2E4 \uC704\uC5D0\uC11C \uB69C\uB837\uD55C \uD55C \uC30D\uC744 \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uC544\uC77C\uB79C\uB4DC \uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "stripedlight",
      height: 68,
      width: 22,
      spans: 1,
      terrainHeight: 14,
      actorX: 18,
      color: "#c88b73",
      motif: "beacon"
    },
    scene: {
      description: "Rockabill Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uB85C\uCEE4\uBE4C \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "kishbank",
      name: "Kish Bank Lighthouse",
      country: "Ireland",
      code: "IRL",
      tier: "rare",
      lat: 53.31083,
      lon: -5.9257,
      source: "https://irishlights.ie/safety-navigation/our-lighthouses/kish-bank.aspx",
      region: "Dublin Bay approaches",
      description: "A caisson-based lighthouse with a broad upper platform marks the Kish Bank sandbank in the approaches to Dublin Bay.",
      descriptionSourceName: "Commissioners of Irish Lights",
      descriptionSource: "https://irishlights.ie/safety-navigation/our-lighthouses/kish-bank.aspx"
    },
    korean: {
      name: "\uD0A4\uC2DC\uBC45\uD06C \uB4F1\uB300",
      country: "\uC544\uC77C\uB79C\uB4DC",
      region: "\uB354\uBE14\uB9B0\uB9CC \uBC14\uAE65 \uD56D\uB85C",
      description: "\uB354\uBE14\uB9B0\uB9CC\uC73C\uB85C \uB4E4\uC5B4\uAC00\uB294 \uD56D\uB85C\uC758 \uD0A4\uC2DC\uBC45\uD06C \uBAA8\uB798\uD1B1\uC5D0 \uB113\uC740 \uC0C1\uBD80 \uD50C\uB7AB\uD3FC\uC744 \uAC16\uCD98 \uCF00\uC774\uC2A8\uC2DD \uB4F1\uB300\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC544\uC77C\uB79C\uB4DC \uB4F1\uB300\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "caissonlight",
      height: 59,
      width: 30,
      spans: 2,
      terrainHeight: 3,
      actorX: 96,
      color: "#629b9f",
      motif: "gulls"
    },
    scene: {
      description: "Kish Bank Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uD0A4\uC2DC\uBC45\uD06C \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "beanrock",
      name: "Bean Rock Lighthouse",
      country: "New Zealand",
      code: "NZL",
      tier: "rare",
      lat: -36.833,
      lon: 174.831,
      source: "https://www.heritage.org.nz/list-details/3295/Bean%20Rock%20Lighthouse",
      region: "Waitemat\u0101 Harbour",
      description: "A small wooden lighthouse cottage stands above a harbour reef on iron legs, a distinctive form in Auckland\u2019s Waitemat\u0101 Harbour.",
      descriptionSourceName: "Heritage New Zealand",
      descriptionSource: "https://www.heritage.org.nz/list-details/3295/Bean%20Rock%20Lighthouse"
    },
    korean: {
      name: "\uBE48\uB85D \uB4F1\uB300",
      country: "\uB274\uC9C8\uB79C\uB4DC",
      region: "\uC640\uC774\uD14C\uB9C8\uD0C0\uD56D",
      description: "\uC624\uD074\uB79C\uB4DC \uC640\uC774\uD14C\uB9C8\uD0C0\uD56D\uC758 \uC554\uCD08 \uC704\uC5D0 \uCCA0\uC81C \uB2E4\uB9AC\uB97C \uC138\uC6B0\uACE0 \uC791\uC740 \uBAA9\uC870 \uB4F1\uB300\uC9D1\uC744 \uC5B9\uC5C8\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uB274\uC9C8\uB79C\uB4DC \uAD6D\uAC00\uC720\uC0B0\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "pilelight",
      height: 37,
      width: 35,
      spans: 0,
      terrainHeight: 3,
      actorX: 22,
      color: "#d4b078",
      motif: "spray"
    },
    scene: {
      description: "Bean Rock Lighthouse: Small wave crests curl around the tower base.",
      descriptionKo: "\uBE48\uB85D \uB4F1\uB300: \uC791\uC740 \uD30C\uB3C4\uAC00 \uB4F1\uB300 \uBC11\uBD80\uBD84\uC744 \uD718\uAC10\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "brotherslight",
      name: "Brothers Islands Lighthouse",
      country: "New Zealand",
      code: "NZL",
      tier: "common",
      lat: -41.1,
      lon: 174.43333333,
      source: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/brothers-island/",
      region: "Cook Strait",
      description: "A compact white lighthouse and keeper buildings occupy a rocky island in Cook Strait between New Zealand\u2019s main islands.",
      descriptionSourceName: "Maritime New Zealand",
      descriptionSource: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/brothers-island/"
    },
    korean: {
      name: "\uBE0C\uB77C\uB354\uC2A4 \uC81C\uB3C4 \uB4F1\uB300",
      country: "\uB274\uC9C8\uB79C\uB4DC",
      region: "\uCFE1 \uD574\uD611",
      description: "\uB274\uC9C8\uB79C\uB4DC\uC758 \uB450 \uD070 \uC12C \uC0AC\uC774 \uCFE1 \uD574\uD611\uC758 \uBC14\uC704\uC12C\uC5D0 \uC544\uB2F4\uD55C \uD770 \uB4F1\uB300\uC640 \uAD00\uB9AC \uAC74\uBB3C\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uB274\uC9C8\uB79C\uB4DC \uD574\uC0AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 48,
      width: 21,
      spans: 0,
      terrainHeight: 34,
      actorX: 100,
      color: "#839b70",
      motif: "beacon"
    },
    scene: {
      description: "Brothers Islands Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uBE0C\uB77C\uB354\uC2A4 \uC81C\uB3C4 \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "dogisland",
      name: "Dog Island Lighthouse",
      country: "New Zealand",
      code: "NZL",
      tier: "rare",
      lat: -46.65,
      lon: 168.41666667,
      source: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/dog-island/",
      region: "Foveaux Strait",
      description: "New Zealand\u2019s tallest lighthouse uses broad dark bands on a pale tower to mark the eastern approach to Foveaux Strait.",
      descriptionSourceName: "Maritime New Zealand",
      descriptionSource: "https://www.maritimenz.govt.nz/about-us/who-we-are/our-history-and-heritage/lighthouses-of-new-zealand/dog-island/"
    },
    korean: {
      name: "\uB3C4\uADF8\uC12C \uB4F1\uB300",
      country: "\uB274\uC9C8\uB79C\uB4DC",
      region: "\uD3EC\uBCF4 \uD574\uD611",
      description: "\uB274\uC9C8\uB79C\uB4DC\uC5D0\uC11C \uAC00\uC7A5 \uB192\uC740 \uB4F1\uB300\uAC00 \uBC1D\uC740 \uD0D1\uC5D0 \uAD75\uC740 \uAC80\uC740 \uB760\uB97C \uB450\uB974\uACE0 \uD3EC\uBCF4 \uD574\uD611 \uB3D9\uCABD \uC785\uAD6C\uB97C \uC54C\uB9BD\uB2C8\uB2E4.",
      descriptionSourceName: "\uB274\uC9C8\uB79C\uB4DC \uD574\uC0AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "stripedlight",
      height: 99,
      width: 24,
      spans: 3,
      terrainHeight: 5,
      actorX: 16,
      color: "#93a8b0",
      motif: "gulls"
    },
    scene: {
      description: "Dog Island Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uB3C4\uADF8\uC12C \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "oryukdolight",
      name: "Oryukdo Lighthouse",
      country: "South Korea",
      code: "KOR",
      tier: "common",
      lat: 35.09116361,
      lon: 129.12688634,
      source: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=81575",
      region: "Busan",
      description: "The white lighthouse crowns Deungdaeseom, one of the offshore rock islands of Oryukdo at the entrance to Busan\u2019s waters.",
      descriptionSourceName: "Korea Tourism Organization",
      descriptionSource: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=81575"
    },
    korean: {
      name: "\uC624\uB959\uB3C4 \uB4F1\uB300",
      country: "\uB300\uD55C\uBBFC\uAD6D",
      region: "\uBD80\uC0B0",
      description: "\uBD80\uC0B0 \uBC14\uB2F7\uAE38 \uC785\uAD6C\uC5D0 \uB298\uC5B4\uC120 \uC624\uB959\uB3C4 \uBC14\uC704\uC12C \uC911 \uB4F1\uB300\uC12C \uAF2D\uB300\uAE30\uC5D0 \uD770 \uB4F1\uB300\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD55C\uAD6D\uAD00\uAD11\uACF5\uC0AC"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 40,
      width: 19,
      spans: 0,
      terrainHeight: 44,
      actorX: 99,
      color: "#b79889",
      motif: "spray"
    },
    scene: {
      description: "Oryukdo Lighthouse: Small wave crests curl around the tower base.",
      descriptionKo: "\uC624\uB959\uB3C4 \uB4F1\uB300: \uC791\uC740 \uD30C\uB3C4\uAC00 \uB4F1\uB300 \uBC11\uBD80\uBD84\uC744 \uD718\uAC10\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "somaemuldolight",
      name: "Somaemuldo Lighthouse",
      country: "South Korea",
      code: "KOR",
      tier: "common",
      lat: 34.61951668,
      lon: 128.54806406,
      source: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=111029",
      region: "Tongyeong",
      description: "A white lighthouse tops Deungdaeseom beside Somaemuldo, where a rocky tidal connection separates the two small islands.",
      descriptionSourceName: "Korea Tourism Organization",
      descriptionSource: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=111029"
    },
    korean: {
      name: "\uC18C\uB9E4\uBB3C\uB3C4 \uB4F1\uB300",
      country: "\uB300\uD55C\uBBFC\uAD6D",
      region: "\uD1B5\uC601",
      description: "\uC18C\uB9E4\uBB3C\uB3C4 \uACC1 \uB4F1\uB300\uC12C \uC815\uC0C1\uC5D0 \uD770 \uB4F1\uB300\uAC00 \uC11C \uC788\uACE0, \uB450 \uC12C \uC0AC\uC774\uC5D0\uB294 \uBB3C\uB54C\uC5D0 \uB530\uB77C \uB4DC\uB7EC\uB098\uB294 \uBC14\uC717\uAE38\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uD55C\uAD6D\uAD00\uAD11\uACF5\uC0AC"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 32,
      width: 18,
      spans: 0,
      terrainHeight: 54,
      actorX: 17,
      color: "#c88b73",
      motif: "beacon"
    },
    scene: {
      description: "Somaemuldo Lighthouse: A beacon sweeps above the rock tower.",
      descriptionKo: "\uC18C\uB9E4\uBB3C\uB3C4 \uB4F1\uB300: \uB4F1\uB300\uC758 \uBD88\uBE5B\uC774 \uC554\uCD08 \uC704\uB97C \uD6D1\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "gageodolight",
      name: "Gageodo Lighthouse",
      country: "South Korea",
      code: "KOR",
      tier: "common",
      lat: 34.094667,
      lon: 125.099278,
      source: "https://mokpo.mof.go.kr/en/page.do?menuIdx=1598",
      region: "Sinan",
      description: "A low white brick lighthouse stands high on Gageodo\u2019s northern headland, marking the approach from the open East China Sea.",
      descriptionSourceName: "Mokpo Regional Office of Oceans and Fisheries",
      descriptionSource: "https://mokpo.mof.go.kr/en/page.do?menuIdx=1598"
    },
    korean: {
      name: "\uAC00\uAC70\uB3C4 \uB4F1\uB300",
      country: "\uB300\uD55C\uBBFC\uAD6D",
      region: "\uC2E0\uC548",
      description: "\uAC00\uAC70\uB3C4 \uBD81\uCABD\uC758 \uB192\uC740 \uACF6\uC5D0 \uB0AE\uC740 \uD770 \uBCBD\uB3CC \uB4F1\uB300\uAC00 \uC11C\uC11C \uB3D9\uC911\uAD6D\uD574 \uC678\uD574\uC5D0\uC11C \uB2E4\uAC00\uC624\uB294 \uBC30\uC5D0 \uC721\uC9C0\uC758 \uC704\uCE58\uB97C \uC54C\uB9BD\uB2C8\uB2E4.",
      descriptionSourceName: "\uBAA9\uD3EC\uC9C0\uBC29\uD574\uC591\uC218\uC0B0\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "lighthouse",
      height: 27,
      width: 20,
      spans: 0,
      terrainHeight: 66,
      actorX: 100,
      color: "#629b9f",
      motif: "gulls"
    },
    scene: {
      description: "Gageodo Lighthouse: Seabirds glide around the rocky outline.",
      descriptionKo: "\uAC00\uAC70\uB3C4 \uB4F1\uB300: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bikiniatoll",
      name: "Bikini Atoll",
      country: "Marshall Islands",
      code: "MHL",
      tier: "epic",
      lat: 11.6,
      lon: 165.38055556,
      source: "https://whc.unesco.org/en/list/1339/",
      region: "Bikini Atoll",
      description: "The lagoon contains sunken test vessels and other remains of twentieth-century nuclear testing; the miniature depicts submerged hulls within the atoll.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1339/"
    },
    korean: {
      name: "\uBE44\uD0A4\uB2C8 \uD658\uCD08",
      country: "\uB9C8\uC15C \uC81C\uB3C4",
      region: "\uBE44\uD0A4\uB2C8 \uD658\uCD08",
      description: "\uD658\uCD08\uC758 \uC11D\uD638\uC5D0\uB294 20\uC138\uAE30 \uD575\uC2E4\uD5D8\uC5D0 \uC4F0\uC778 \uCE68\uBAB0 \uC120\uBC15 \uB4F1 \uC720\uC0B0\uC774 \uB0A8\uC544 \uC788\uC73C\uBA70, \uBAA8\uD615\uC740 \uD658\uCD08 \uC548\uC758 \uC218\uC911 \uC120\uCCB4\uB97C \uD45C\uD604\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "sea",
    visual: {
      shape: "wreck",
      height: 19,
      width: 81,
      spans: 2,
      terrainHeight: 8,
      actorX: 21,
      color: "#d4b078",
      motif: "diver"
    },
    scene: {
      description: "Bikini Atoll: A small diver surveys the submerged hull.",
      descriptionKo: "\uBE44\uD0A4\uB2C8 \uD658\uCD08: \uC791\uC740 \uC7A0\uC218\uBD80\uAC00 \uAC00\uB77C\uC549\uC740 \uC120\uCCB4\uB97C \uC0B4\uD54D\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "phoenixislands",
      name: "Phoenix Islands Protected Area",
      country: "Kiribati",
      code: "KIR",
      tier: "legendary",
      lat: -3.864454,
      lon: -172.650203,
      source: "https://whc.unesco.org/en/list/1325/",
      region: "Phoenix Islands",
      description: "Remote coral atolls, reefs and deep ocean habitats form this protected Pacific seascape within Kiribati.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1325/"
    },
    korean: {
      name: "\uD53C\uB2C9\uC2A4 \uC81C\uB3C4 \uBCF4\uD638\uAD6C\uC5ED",
      country: "\uD0A4\uB9AC\uBC14\uC2DC",
      region: "\uD53C\uB2C9\uC2A4 \uC81C\uB3C4",
      description: "\uD0A4\uB9AC\uBC14\uC2DC\uC758 \uC678\uB534 \uC0B0\uD638 \uD658\uCD08\uC640 \uC554\uCD08, \uAE4A\uC740 \uBC14\uB2E4 \uC11C\uC2DD\uC9C0\uAC00 \uD0DC\uD3C9\uC591\uC758 \uB113\uC740 \uBCF4\uD638 \uD574\uC5ED\uC744 \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "sea",
    visual: {
      shape: "atoll",
      height: 24,
      width: 103,
      spans: 5,
      terrainHeight: 12,
      actorX: 98,
      color: "#839b70",
      motif: "fish"
    },
    scene: {
      description: "Phoenix Islands Protected Area: A fish school weaves between the reef forms.",
      descriptionKo: "\uD53C\uB2C9\uC2A4 \uC81C\uB3C4 \uBCF4\uD638\uAD6C\uC5ED: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "malpelo",
      name: "Malpelo Sanctuary",
      country: "Colombia",
      code: "COL",
      tier: "epic",
      lat: 4.003344,
      lon: -81.607572,
      source: "https://whc.unesco.org/en/list/1216/",
      region: "Eastern Pacific",
      description: "A steep oceanic rock and its surrounding protected waters support large gatherings of sharks in the eastern Pacific.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1216/"
    },
    korean: {
      name: "\uB9D0\uD3A0\uB85C \uBCF4\uD638\uAD6C\uC5ED",
      country: "\uCF5C\uB86C\uBE44\uC544",
      region: "\uB3D9\uD0DC\uD3C9\uC591",
      description: "\uB3D9\uD0DC\uD3C9\uC591\uC758 \uAC00\uD30C\uB978 \uBC14\uC704\uC12C\uACFC \uC8FC\uBCC0 \uBCF4\uD638 \uD574\uC5ED\uC740 \uC0C1\uC5B4\uB4E4\uC774 \uD070 \uBB34\uB9AC\uB97C \uC774\uB8E8\uB294 \uC11C\uC2DD\uC9C0\uC785\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "sea",
    visual: {
      shape: "seastack",
      height: 83,
      width: 51,
      spans: 3,
      terrainHeight: 14,
      actorX: 17,
      color: "#93a8b0",
      motif: "gulls"
    },
    scene: {
      description: "Malpelo Sanctuary: Seabirds glide around the rocky outline.",
      descriptionKo: "\uB9D0\uD3A0\uB85C \uBCF4\uD638\uAD6C\uC5ED: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "surtsey",
      name: "Surtsey",
      country: "Iceland",
      code: "ISL",
      tier: "rare",
      lat: 63.30305556,
      lon: -20.60222222,
      source: "https://whc.unesco.org/en/list/1267/",
      region: "Vestmannaeyjar",
      description: "Formed by a volcanic eruption beginning in 1963, this young ocean island is protected for research into natural colonisation.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1267/"
    },
    korean: {
      name: "\uC26C\uB974\uD2B8\uC138\uC774",
      country: "\uC544\uC774\uC2AC\uB780\uB4DC",
      region: "\uBCA0\uC2A4\uD2B8\uB9CC \uC81C\uB3C4",
      description: "1963\uB144\uC5D0 \uC2DC\uC791\uB41C \uD654\uC0B0 \uBD84\uCD9C\uB85C \uC0DD\uAE34 \uC5B4\uB9B0 \uBC14\uB2E4\uC12C\uC73C\uB85C, \uC0DD\uBB3C\uC774 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC815\uCC29\uD558\uB294 \uACFC\uC815\uC744 \uC5F0\uAD6C\uD558\uB3C4\uB85D \uBCF4\uD638\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "sea",
    visual: {
      shape: "volcanicisland",
      height: 52,
      width: 97,
      spans: 2,
      terrainHeight: 10,
      actorX: 101,
      color: "#b79889",
      motif: "gulls"
    },
    scene: {
      description: "Surtsey: Seabirds glide around the rocky outline.",
      descriptionKo: "\uC26C\uB974\uD2B8\uC138\uC774: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "goughislands",
      name: "Gough and Inaccessible Islands",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: -38.81236111,
      lon: -11.30597222,
      source: "https://whc.unesco.org/en/list/740/",
      region: "South Atlantic",
      description: "Steep volcanic islands in the South Atlantic provide nesting grounds for large seabird colonies far from continental shores.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/740/"
    },
    korean: {
      name: "\uACE0\uD504\uC12C\uACFC \uC774\uB108\uC561\uC138\uC11C\uBE14\uC12C",
      country: "\uC601\uAD6D",
      region: "\uB0A8\uB300\uC11C\uC591",
      description: "\uB300\uB959\uC5D0\uC11C \uBA40\uB9AC \uB5A8\uC5B4\uC9C4 \uB0A8\uB300\uC11C\uC591\uC758 \uAC00\uD30C\uB978 \uD654\uC0B0\uC12C\uB4E4\uC774 \uC218\uB9CE\uC740 \uBC14\uB2F7\uC0C8\uC758 \uBC88\uC2DD\uC9C0\uAC00 \uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "sea",
    visual: {
      shape: "seastack",
      height: 75,
      width: 79,
      spans: 2,
      terrainHeight: 11,
      actorX: 20,
      color: "#c88b73",
      motif: "gulls"
    },
    scene: {
      description: "Gough and Inaccessible Islands: Seabirds glide around the rocky outline.",
      descriptionKo: "\uACE0\uD504\uC12C\uACFC \uC774\uB108\uC561\uC138\uC11C\uBE14\uC12C: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "newcaledonialagoons",
      name: "New Caledonia Lagoons",
      country: "France",
      code: "FRA",
      tier: "epic",
      lat: -20.49587963,
      lon: 165.04791667,
      source: "https://whc.unesco.org/en/list/1115/",
      region: "New Caledonia",
      description: "Six marine clusters preserve extensive coral reefs and lagoons around New Caledonia; the model shows a representative reef channel.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1115/"
    },
    korean: {
      name: "\uB204\uBCA8\uCE7C\uB808\uB3C4\uB2C8 \uC11D\uD638",
      country: "\uD504\uB791\uC2A4",
      region: "\uB204\uBCA8\uCE7C\uB808\uB3C4\uB2C8",
      description: "\uB204\uBCA8\uCE7C\uB808\uB3C4\uB2C8 \uC8FC\uBCC0 \uC5EC\uC12F \uD574\uC5ED\uC5D0 \uB113\uC740 \uC0B0\uD638\uCD08\uC640 \uC11D\uD638\uAC00 \uBCF4\uC874\uB418\uC5B4 \uC788\uC73C\uBA70, \uBAA8\uD615\uC740 \uADF8\uC911 \uB300\uD45C\uC801\uC778 \uC0B0\uD638\uCD08 \uBB3C\uAE38\uC744 \uD45C\uD604\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 18,
      width: 105,
      spans: 6,
      terrainHeight: 9,
      actorX: 96,
      color: "#629b9f",
      motif: "fish"
    },
    scene: {
      description: "New Caledonia Lagoons: A fish school weaves between the reef forms.",
      descriptionKo: "\uB204\uBCA8\uCE7C\uB808\uB3C4\uB2C8 \uC11D\uD638: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "aporeef",
      name: "Apo Reef Natural Park",
      country: "Philippines",
      code: "PHL",
      tier: "common",
      lat: 12.74583333,
      lon: 120.3961111,
      source: "https://whc.unesco.org/en/tentativelists/5033/",
      region: "Occidental Mindoro",
      description: "Shallow reefs, channels and clear marine water form the protected Apo Reef complex west of Mindoro. The miniature separates the reef rim from its interior water channels.",
      descriptionSourceName: "UNESCO Tentative Lists",
      descriptionSource: "https://whc.unesco.org/en/tentativelists/5033/"
    },
    korean: {
      name: "\uC544\uD3EC\uB9AC\uD504 \uC790\uC5F0\uACF5\uC6D0",
      country: "\uD544\uB9AC\uD540",
      region: "\uC11C\uBBFC\uB3C4\uB85C",
      description: "\uBBFC\uB3C4\uB85C \uC11C\uCABD\uC758 \uC544\uD3EC\uB9AC\uD504\uC5D0\uB294 \uC595\uC740 \uC0B0\uD638\uCD08\uC640 \uC218\uB85C, \uB9D1\uC740 \uBC14\uB2E4\uAC00 \uC5B4\uC6B0\uB7EC\uC9C4 \uBCF4\uD638 \uD574\uC5ED\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4. \uBAA8\uD615\uC740 \uC0B0\uD638\uCD08\uC758 \uD14C\uB450\uB9AC\uC640 \uC548\uCABD \uBB3C\uAE38\uC744 \uAD6C\uBD84\uD574 \uD45C\uD604\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0 \uC7A0\uC815\uBAA9\uB85D"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 23,
      width: 98,
      spans: 2,
      terrainHeight: 12,
      actorX: 18,
      color: "#d4b078",
      motif: "fish"
    },
    scene: {
      description: "Apo Reef Natural Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uC544\uD3EC\uB9AC\uD504 \uC790\uC5F0\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bunaken",
      name: "Bunaken National Park",
      country: "Indonesia",
      code: "IDN",
      tier: "common",
      lat: 1.66666667,
      lon: 124.65,
      source: "https://whc.unesco.org/en/tentativelists/2002/",
      region: "North Sulawesi",
      description: "Coral reefs and steep underwater walls surround islands off North Sulawesi, providing a wide range of marine habitats.",
      descriptionSourceName: "UNESCO Tentative Lists",
      descriptionSource: "https://whc.unesco.org/en/tentativelists/2002/"
    },
    korean: {
      name: "\uBD80\uB098\uCF04 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uC778\uB3C4\uB124\uC2DC\uC544",
      region: "\uBD81\uC220\uB77C\uC6E8\uC2DC",
      description: "\uBD81\uC220\uB77C\uC6E8\uC2DC \uC55E\uBC14\uB2E4\uC758 \uC12C \uB458\uB808\uC5D0 \uC0B0\uD638\uCD08\uC640 \uAC00\uD30C\uB978 \uC218\uC911 \uC808\uBCBD\uC774 \uBC1C\uB2EC\uD574 \uB2E4\uC591\uD55C \uD574\uC591 \uC11C\uC2DD\uC9C0\uB97C \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0 \uC7A0\uC815\uBAA9\uB85D"
    },
    surface: "sea",
    visual: {
      shape: "reefwalls",
      height: 65,
      width: 94,
      spans: 3,
      terrainHeight: 8,
      actorX: 103,
      color: "#839b70",
      motif: "fish"
    },
    scene: {
      description: "Bunaken National Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uBD80\uB098\uCF04 \uAD6D\uB9BD\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "rajaampat",
      name: "Raja Ampat Islands Marine Park",
      country: "Indonesia",
      code: "IDN",
      tier: "rare",
      lat: -0.7125553,
      lon: 130.3034473,
      source: "https://kkprajaampat.id/en/kawasan-kelola-kami/kepulauan-raja-ampat/",
      region: "Southwest Papua",
      description: "A network of coral reefs and island waters protects marine habitats in Raja Ampat, represented here by limestone islets and a reef passage.",
      descriptionSourceName: "Kupang National Marine Protected Areas Office",
      descriptionSource: "https://kkprajaampat.id/en/kawasan-kelola-kami/kepulauan-raja-ampat/"
    },
    korean: {
      name: "\uB77C\uC790\uC554\uD31F \uC81C\uB3C4 \uD574\uC591\uACF5\uC6D0",
      country: "\uC778\uB3C4\uB124\uC2DC\uC544",
      region: "\uD30C\uD478\uC544 \uB0A8\uC11C\uBD80",
      description: "\uB77C\uC790\uC554\uD31F\uC758 \uC0B0\uD638\uCD08\uC640 \uC12C \uC8FC\uBCC0 \uD574\uC5ED\uC774 \uD574\uC591 \uC11C\uC2DD\uC9C0\uB97C \uC9C0\uD0A4\uBA70, \uBAA8\uD615\uC5D0\uC11C\uB294 \uC11D\uD68C\uC554 \uC791\uC740 \uC12C\uACFC \uC0B0\uD638\uCD08 \uC218\uB85C\uB85C \uD45C\uD604\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uCFE0\uD321 \uAD6D\uB9BD\uD574\uC591\uBCF4\uD638\uAD6C\uC5ED\uAD00\uB9AC\uC0AC\uBB34\uC18C"
    },
    surface: "sea",
    visual: {
      shape: "karstlagoon",
      height: 63,
      width: 88,
      spans: 4,
      terrainHeight: 10,
      actorX: 23,
      color: "#93a8b0",
      motif: "fish"
    },
    scene: {
      description: "Raja Ampat Islands Marine Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uB77C\uC790\uC554\uD31F \uC81C\uB3C4 \uD574\uC591\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "wakatobi",
      name: "Wakatobi National Park",
      country: "Indonesia",
      code: "IDN",
      tier: "common",
      lat: -5.9011111,
      lon: 124.1165972,
      source: "https://whc.unesco.org/en/tentativelists/2006/",
      region: "Southeast Sulawesi",
      description: "Coral reefs around the Wakatobi islands form a marine park in the heart of the Coral Triangle. Its name joins the names of the four main islands: Wangi-Wangi, Kaledupa, Tomia and Binongko.",
      descriptionSourceName: "UNESCO Tentative Lists",
      descriptionSource: "https://whc.unesco.org/en/tentativelists/2006/"
    },
    korean: {
      name: "\uC640\uCE74\uD1A0\uBE44 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uC778\uB3C4\uB124\uC2DC\uC544",
      region: "\uC220\uB77C\uC6E8\uC2DC \uB0A8\uB3D9\uBD80",
      description: "\uCF54\uB784\uD2B8\uB77C\uC774\uC575\uAE00 \uC548\uCABD \uC640\uCE74\uD1A0\uBE44 \uC81C\uB3C4 \uC8FC\uBCC0\uC758 \uC0B0\uD638\uCD08\uAC00 \uD574\uC591 \uAD6D\uB9BD\uACF5\uC6D0\uC744 \uC774\uB8F9\uB2C8\uB2E4. \uC774\uB984\uC740 \uC8FC\uC694 \uB124 \uC12C\uC778 \uC655\uC774\uC655\uC774, \uCE7C\uB808\uB450\uD30C, \uD1A0\uBBF8\uC544, \uBE44\uB18D\uCF54\uC5D0\uC11C \uB530\uC654\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0 \uC7A0\uC815\uBAA9\uB85D"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 22,
      width: 109,
      spans: 4,
      terrainHeight: 7,
      actorX: 94,
      color: "#b79889",
      motif: "fish"
    },
    scene: {
      description: "Wakatobi National Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uC640\uCE74\uD1A0\uBE44 \uAD6D\uB9BD\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "sipadan",
      name: "Sipadan Island Park",
      country: "Malaysia",
      code: "MYS",
      tier: "rare",
      lat: 4.1122015,
      lon: 118.6304382,
      source: "https://www.sabahparks.org.my/sipadan-island-park",
      region: "Sabah",
      description: "A small oceanic island rises above deep water, with coral-covered walls and marine turtle habitat around its edge.",
      descriptionSourceName: "Sabah Parks",
      descriptionSource: "https://www.sabahparks.org.my/sipadan-island-park"
    },
    korean: {
      name: "\uC2DC\uD30C\uB2E8\uC12C \uACF5\uC6D0",
      country: "\uB9D0\uB808\uC774\uC2DC\uC544",
      region: "\uC0AC\uBC14",
      description: "\uAE4A\uC740 \uBC14\uB2E4 \uC704\uB85C \uC791\uC740 \uC12C\uC774 \uC19F\uC544 \uC788\uC73C\uBA70, \uAC00\uC7A5\uC790\uB9AC\uC5D0\uB294 \uC0B0\uD638\uB85C \uB36E\uC778 \uC218\uC911 \uC808\uBCBD\uACFC \uBC14\uB2E4\uAC70\uBD81 \uC11C\uC2DD\uC9C0\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uC0AC\uBC14 \uACF5\uC6D0\uAD00\uB9AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "reefwalls",
      height: 70,
      width: 73,
      spans: 1,
      terrainHeight: 11,
      actorX: 19,
      color: "#c88b73",
      motif: "turtle"
    },
    scene: {
      description: "Sipadan Island Park: A turtle glides past the reef edge.",
      descriptionKo: "\uC2DC\uD30C\uB2E8\uC12C \uACF5\uC6D0: \uAC70\uBD81\uC774 \uC0B0\uD638\uCD08 \uAC00\uC7A5\uC790\uB9AC\uB97C \uB530\uB77C \uD5E4\uC5C4\uCE69\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "surin",
      name: "Mu Ko Surin National Park",
      country: "Thailand",
      code: "THA",
      tier: "common",
      lat: 9.4001641,
      lon: 97.8657727,
      source: "https://www.tourismthailand.org/Articles/mu-koh-surin-the-tropical-paradise-in-andaman",
      region: "Phang Nga",
      description: "The Surin islands and their surrounding Andaman Sea reefs form a protected tropical marine landscape.",
      descriptionSourceName: "Tourism Authority of Thailand",
      descriptionSource: "https://www.tourismthailand.org/Articles/mu-koh-surin-the-tropical-paradise-in-andaman"
    },
    korean: {
      name: "\uC218\uB9B0 \uC81C\uB3C4 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uD0DC\uAD6D",
      region: "\uD321\uC751\uC544",
      description: "\uC218\uB9B0 \uC81C\uB3C4\uC640 \uC8FC\uBCC0 \uC548\uB2E4\uB9CC\uD574\uC758 \uC0B0\uD638\uCD08\uAC00 \uBCF4\uD638\uBC1B\uB294 \uC5F4\uB300 \uD574\uC591 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uD0DC\uAD6D\uC815\uBD80\uAD00\uAD11\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 31,
      width: 106,
      spans: 5,
      terrainHeight: 9,
      actorX: 101,
      color: "#629b9f",
      motif: "fish"
    },
    scene: {
      description: "Mu Ko Surin National Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uC218\uB9B0 \uC81C\uB3C4 \uAD6D\uB9BD\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "similan",
      name: "Mu Ko Similan National Park",
      country: "Thailand",
      code: "THA",
      tier: "rare",
      lat: 8.5771331,
      lon: 97.6463514,
      source: "https://www.tourismthailand.org/Attraction/mu-ko-similan-national-park",
      region: "Phang Nga",
      description: "Large rounded granite boulders rise above turquoise water, while coral reefs shelter marine life around the Similan islands.",
      descriptionSourceName: "Tourism Authority of Thailand",
      descriptionSource: "https://www.tourismthailand.org/Attraction/mu-ko-similan-national-park"
    },
    korean: {
      name: "\uC2DC\uBC00\uB780 \uC81C\uB3C4 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uD0DC\uAD6D",
      region: "\uD321\uC751\uC544",
      description: "\uB465\uADFC \uD654\uAC15\uC554 \uBC14\uC704\uAC00 \uCCAD\uB85D\uBE5B \uBC14\uB2E4 \uC704\uB85C \uC19F\uACE0, \uC2DC\uBC00\uB780 \uC81C\uB3C4 \uC8FC\uBCC0 \uC0B0\uD638\uCD08\uC5D0\uB294 \uC5EC\uB7EC \uD574\uC591 \uC0DD\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4.",
      descriptionSourceName: "\uD0DC\uAD6D\uC815\uBD80\uAD00\uAD11\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "graniteisland",
      height: 54,
      width: 92,
      spans: 3,
      terrainHeight: 12,
      actorX: 20,
      color: "#d4b078",
      motif: "gulls"
    },
    scene: {
      description: "Mu Ko Similan National Park: Seabirds glide around the rocky outline.",
      descriptionKo: "\uC2DC\uBC00\uB780 \uC81C\uB3C4 \uAD6D\uB9BD\uACF5\uC6D0: \uBC14\uB2F7\uC0C8\uAC00 \uBC14\uC704 \uC724\uACFD \uC8FC\uC704\uB97C \uB0A0\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "rasmohammed",
      name: "Ras Mohammed Marine Reserve",
      country: "Egypt",
      code: "EGY",
      tier: "rare",
      lat: 27.8786491,
      lon: 34.3578071,
      source: "https://www.sis.gov.eg/newVR/protected/html/rasmoh.htm",
      region: "South Sinai",
      description: "Reefs fringe the southern tip of Sinai where the gulfs of Suez and Aqaba meet, creating a striking underwater landscape.",
      descriptionSourceName: "Egypt State Information Service",
      descriptionSource: "https://www.sis.gov.eg/newVR/protected/html/rasmoh.htm"
    },
    korean: {
      name: "\uB77C\uC2A4\uBAA8\uD558\uBA54\uB4DC \uD574\uC591\uBCF4\uD638\uAD6C\uC5ED",
      country: "\uC774\uC9D1\uD2B8",
      region: "\uB0A8\uC2DC\uB098\uC774",
      description: "\uC218\uC5D0\uC988\uB9CC\uACFC \uC544\uCE74\uBC14\uB9CC\uC774 \uB9CC\uB098\uB294 \uC2DC\uB098\uC774\uBC18\uB3C4 \uB0A8\uB2E8\uC744 \uC0B0\uD638\uCD08\uAC00 \uB458\uB7EC\uC2F8 \uB3C5\uD2B9\uD55C \uC218\uC911 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uC774\uC9D1\uD2B8 \uAD6D\uAC00\uC815\uBCF4\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "reefwalls",
      height: 68,
      width: 105,
      spans: 2,
      terrainHeight: 13,
      actorX: 97,
      color: "#839b70",
      motif: "fish"
    },
    scene: {
      description: "Ras Mohammed Marine Reserve: A fish school weaves between the reef forms.",
      descriptionKo: "\uB77C\uC2A4\uBAA8\uD558\uBA54\uB4DC \uD574\uC591\uBCF4\uD638\uAD6C\uC5ED: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bluebay",
      name: "Blue Bay Marine Park",
      country: "Mauritius",
      code: "MUS",
      tier: "common",
      lat: -20.45,
      lon: 57.7,
      source: "https://rsis.ramsar.org/ris/1744",
      region: "Grand Port",
      description: "A sheltered lagoon in southeastern Mauritius contains coral communities and shallow marine habitats. The miniature represents the reef and lagoon rather than the shore facilities.",
      descriptionSourceName: "Ramsar Sites Information Service",
      descriptionSource: "https://rsis.ramsar.org/ris/1744"
    },
    korean: {
      name: "\uBE14\uB8E8\uBCA0\uC774 \uD574\uC591\uACF5\uC6D0",
      country: "\uBAA8\uB9AC\uC154\uC2A4",
      region: "\uADF8\uB791\uD3EC\uB974",
      description: "\uBAA8\uB9AC\uC154\uC2A4 \uB0A8\uB3D9\uCABD\uC758 \uC794\uC794\uD55C \uC11D\uD638\uC5D0 \uC0B0\uD638 \uAD70\uB77D\uACFC \uC595\uC740 \uBC14\uB2E4 \uC11C\uC2DD\uC9C0\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4. \uBAA8\uD615\uC740 \uD574\uC548 \uC2DC\uC124\uC774 \uC544\uB2CC \uC0B0\uD638\uCD08\uC640 \uC11D\uD638\uB97C \uD45C\uD604\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uB78C\uC0AC\uB974 \uC2B5\uC9C0\uC815\uBCF4\uC11C\uBE44\uC2A4"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 19,
      width: 97,
      spans: 7,
      terrainHeight: 8,
      actorX: 18,
      color: "#93a8b0",
      motif: "fish"
    },
    scene: {
      description: "Blue Bay Marine Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uBE14\uB8E8\uBCA0\uC774 \uD574\uC591\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "sainteanne",
      name: "Sainte Anne Marine National Park",
      country: "Seychelles",
      code: "SYC",
      tier: "common",
      lat: -4.605356,
      lon: 55.504711,
      source: "https://www.spga.gov.sc/parks/st-anne",
      region: "Mah\xE9",
      description: "Island waters near Mah\xE9 protect coral reefs and seagrass beds within Seychelles\u2019 Sainte Anne Marine National Park.",
      descriptionSourceName: "Seychelles Parks and Gardens Authority",
      descriptionSource: "https://www.spga.gov.sc/parks/st-anne"
    },
    korean: {
      name: "\uC0DD\uD2B8\uC548 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uC138\uC774\uC178",
      region: "\uB9C8\uC5D0\uC12C \uC55E\uBC14\uB2E4",
      description: "\uC138\uC774\uC178 \uB9C8\uC5D0\uC12C \uAC00\uAE4C\uC6B4 \uC0DD\uD2B8\uC548 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0\uC758 \uC12C \uC8FC\uBCC0 \uBC14\uB2E4\uC5D0\uB294 \uC0B0\uD638\uCD08\uC640 \uD574\uCD08\uBC2D\uC774 \uBCF4\uD638\uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uC138\uC774\uC178 \uACF5\uC6D0\uC815\uC6D0\uAD00\uB9AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "seagrass",
      height: 36,
      width: 91,
      spans: 6,
      terrainHeight: 9,
      actorX: 100,
      color: "#b79889",
      motif: "seagrass"
    },
    scene: {
      description: "Sainte Anne Marine National Park: Underwater leaves sway beside the protected shallows.",
      descriptionKo: "\uC0DD\uD2B8\uC548 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0: \uBCF4\uD638\uBC1B\uB294 \uC595\uC740 \uBC14\uB2E4\uC5D0\uC11C \uD574\uCD08 \uC78E\uC774 \uD754\uB4E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "watamu",
      name: "Watamu Marine National Park",
      country: "Kenya",
      code: "KEN",
      tier: "common",
      lat: -3.36777778,
      lon: 40.01638889,
      source: "https://kws.go.ke/park/watamu-marine-national-park-reserve/",
      region: "Kilifi",
      description: "Reef-protected lagoons and coral gardens shelter fish and sea turtles along Kenya\u2019s Indian Ocean coast.",
      descriptionSourceName: "Kenya Wildlife Service",
      descriptionSource: "https://kws.go.ke/park/watamu-marine-national-park-reserve/"
    },
    korean: {
      name: "\uC640\uD0C0\uBB34 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uCF00\uB0D0",
      region: "\uD0AC\uB9AC\uD53C",
      description: "\uCF00\uB0D0\uC758 \uC778\uB3C4\uC591 \uD574\uC548\uC5D0 \uC0B0\uD638\uCD08\uAC00 \uAC10\uC2FC \uC11D\uD638\uC640 \uC0B0\uD638 \uC815\uC6D0\uC774 \uC774\uC5B4\uC838 \uBB3C\uACE0\uAE30\uC640 \uBC14\uB2E4\uAC70\uBD81\uC758 \uD130\uC804\uC774 \uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uCF00\uB0D0 \uC57C\uC0DD\uB3D9\uBB3C\uAD00\uB9AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 24,
      width: 107,
      spans: 4,
      terrainHeight: 7,
      actorX: 20,
      color: "#c88b73",
      motif: "turtle"
    },
    scene: {
      description: "Watamu Marine National Park: A turtle glides past the reef edge.",
      descriptionKo: "\uC640\uD0C0\uBB34 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0: \uAC70\uBD81\uC774 \uC0B0\uD638\uCD08 \uAC00\uC7A5\uC790\uB9AC\uB97C \uB530\uB77C \uD5E4\uC5C4\uCE69\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "mafiaisland",
      name: "Mafia Island Marine Park",
      country: "Tanzania",
      code: "TZA",
      tier: "common",
      lat: -7.75194444,
      lon: 39.90027778,
      source: "https://www.marineparks.go.tz/parks/mafia-island",
      region: "Mafia Archipelago",
      description: "Coral reefs, mangroves and sheltered bays form a connected marine landscape around the southern part of Mafia Island.",
      descriptionSourceName: "Tanzania Marine Parks and Reserves Unit",
      descriptionSource: "https://www.marineparks.go.tz/parks/mafia-island"
    },
    korean: {
      name: "\uB9C8\uD53C\uC544\uC12C \uD574\uC591\uACF5\uC6D0",
      country: "\uD0C4\uC790\uB2C8\uC544",
      region: "\uB9C8\uD53C\uC544 \uC81C\uB3C4",
      description: "\uB9C8\uD53C\uC544\uC12C \uB0A8\uCABD\uC5D0 \uC0B0\uD638\uCD08\uC640 \uB9F9\uADF8\uB85C\uBE0C, \uC794\uC794\uD55C \uB9CC\uC774 \uC11C\uB85C \uC774\uC5B4\uC9C4 \uD574\uC591 \uACBD\uAD00\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uD0C4\uC790\uB2C8\uC544 \uD574\uC591\uACF5\uC6D0\uBCF4\uD638\uAD6C\uC5ED\uAD00\uB9AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "mangrovereef",
      height: 37,
      width: 103,
      spans: 5,
      terrainHeight: 11,
      actorX: 97,
      color: "#629b9f",
      motif: "seagrass"
    },
    scene: {
      description: "Mafia Island Marine Park: Underwater leaves sway beside the protected shallows.",
      descriptionKo: "\uB9C8\uD53C\uC544\uC12C \uD574\uC591\uACF5\uC6D0: \uBCF4\uD638\uBC1B\uB294 \uC595\uC740 \uBC14\uB2E4\uC5D0\uC11C \uD574\uCD08 \uC78E\uC774 \uD754\uB4E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "biscayne",
      name: "Biscayne National Park",
      country: "United States",
      code: "USA",
      tier: "common",
      lat: 25.5031223,
      lon: -80.2348496,
      source: "https://www.nps.gov/bisc/index.htm",
      region: "Florida",
      description: "Biscayne protects marine water, islands and coral reefs beside South Florida, with underwater habitats forming most of the park.",
      descriptionSourceName: "National Park Service",
      descriptionSource: "https://www.nps.gov/bisc/index.htm"
    },
    korean: {
      name: "\uBE44\uC2A4\uCF00\uC778 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uBBF8\uAD6D",
      region: "\uD50C\uB85C\uB9AC\uB2E4",
      description: "\uD50C\uB85C\uB9AC\uB2E4 \uB0A8\uCABD\uC758 \uBC14\uB2E4\uC640 \uC12C, \uC0B0\uD638\uCD08\uB97C \uBCF4\uD638\uD558\uBA70 \uACF5\uC6D0 \uB300\uBD80\uBD84\uC744 \uC218\uC911 \uC11C\uC2DD\uC9C0\uAC00 \uCC28\uC9C0\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uBBF8\uAD6D \uAD6D\uB9BD\uACF5\uC6D0\uAD00\uB9AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "seagrass",
      height: 17,
      width: 99,
      spans: 6,
      terrainHeight: 8,
      actorX: 19,
      color: "#d4b078",
      motif: "seagrass"
    },
    scene: {
      description: "Biscayne National Park: Underwater leaves sway beside the protected shallows.",
      descriptionKo: "\uBE44\uC2A4\uCF00\uC778 \uAD6D\uB9BD\uACF5\uC6D0: \uBCF4\uD638\uBC1B\uB294 \uC595\uC740 \uBC14\uB2E4\uC5D0\uC11C \uD574\uCD08 \uC78E\uC774 \uD754\uB4E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "drytortugas",
      name: "Dry Tortugas National Park",
      country: "United States",
      code: "USA",
      tier: "epic",
      lat: 24.6377223,
      lon: -82.8767982,
      source: "https://www.nps.gov/drto/index.htm",
      region: "Florida Keys",
      description: "Fort Jefferson\u2019s brick walls stand on a small island amid the clear water and reefs of the Dry Tortugas.",
      descriptionSourceName: "National Park Service",
      descriptionSource: "https://www.nps.gov/drto/index.htm"
    },
    korean: {
      name: "\uB4DC\uB77C\uC774\uD1A0\uB974\uD22C\uAC00\uC2A4 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uBBF8\uAD6D",
      region: "\uD50C\uB85C\uB9AC\uB2E4\uD0A4\uC2A4",
      description: "\uB4DC\uB77C\uC774\uD1A0\uB974\uD22C\uAC00\uC2A4\uC758 \uB9D1\uC740 \uBC14\uB2E4\uC640 \uC0B0\uD638\uCD08 \uC0AC\uC774 \uC791\uC740 \uC12C\uC5D0 \uD3EC\uD2B8\uC81C\uD37C\uC2A8\uC758 \uBCBD\uB3CC \uC131\uBCBD\uC774 \uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uBBF8\uAD6D \uAD6D\uB9BD\uACF5\uC6D0\uAD00\uB9AC\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "seafort",
      height: 52,
      width: 103,
      spans: 6,
      terrainHeight: 10,
      actorX: 101,
      color: "#839b70",
      motif: "flag"
    },
    scene: {
      description: "Dry Tortugas National Park: A flag moves above the island fort.",
      descriptionKo: "\uB4DC\uB77C\uC774\uD1A0\uB974\uD22C\uAC00\uC2A4 \uAD6D\uB9BD\uACF5\uC6D0: \uC791\uC740 \uC12C\uC758 \uC694\uC0C8 \uC704\uC5D0\uC11C \uAE43\uBC1C\uC774 \uC6C0\uC9C1\uC785\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "cabopulmo",
      name: "Cabo Pulmo National Park",
      country: "Mexico",
      code: "MEX",
      tier: "common",
      lat: 23.4379644,
      lon: -109.4056184,
      source: "https://conanp.gob.mx/conanp/dominios/cabo_pulmo/index.php",
      region: "Baja California Sur",
      description: "A reef in the Gulf of California supports dense schools of fish along the eastern shore of Baja California Sur.",
      descriptionSourceName: "CONANP",
      descriptionSource: "https://conanp.gob.mx/conanp/dominios/cabo_pulmo/index.php"
    },
    korean: {
      name: "\uCE74\uBCF4\uD480\uBAA8 \uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uBA55\uC2DC\uCF54",
      region: "\uBC14\uD558\uCE7C\uB9AC\uD3EC\uB974\uB2C8\uC544\uC218\uB974",
      description: "\uBC14\uD558\uCE7C\uB9AC\uD3EC\uB974\uB2C8\uC544\uC218\uB974 \uB3D9\uCABD \uCE98\uB9AC\uD3EC\uB2C8\uC544\uB9CC\uC758 \uC0B0\uD638\uCD08 \uC8FC\uBCC0\uC5D0 \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uBAA8\uC5EC\uB4ED\uB2C8\uB2E4.",
      descriptionSourceName: "\uBA55\uC2DC\uCF54 \uC790\uC5F0\uBCF4\uD638\uAD6C\uC5ED\uC704\uC6D0\uD68C"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 28,
      width: 100,
      spans: 5,
      terrainHeight: 7,
      actorX: 22,
      color: "#93a8b0",
      motif: "fish"
    },
    scene: {
      description: "Cabo Pulmo National Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uCE74\uBCF4\uD480\uBAA8 \uAD6D\uB9BD\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "abrolhos",
      name: "Abrolhos Marine National Park",
      country: "Brazil",
      code: "BRA",
      tier: "rare",
      lat: -17.971,
      lon: -38.7,
      source: "https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/parna-marinho-dos-abrolhos/guia-do-visitante/informacoes-sobre-visitacao",
      region: "Bahia",
      description: "Mushroom-shaped coral formations and island waters shelter marine life off Bahia, including a humpback whale breeding area.",
      descriptionSourceName: "ICMBio",
      descriptionSource: "https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/parna-marinho-dos-abrolhos/guia-do-visitante/informacoes-sobre-visitacao"
    },
    korean: {
      name: "\uC544\uBE0C\uB864\uB958\uC2A4 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0",
      country: "\uBE0C\uB77C\uC9C8",
      region: "\uBC14\uC774\uC544",
      description: "\uBC14\uC774\uC544 \uC55E\uBC14\uB2E4\uC758 \uBC84\uC12F \uBAA8\uC591 \uC0B0\uD638\uC640 \uC12C \uC8FC\uBCC0 \uBC14\uB2E4\uAC00 \uD574\uC591 \uC0DD\uBB3C\uC758 \uD130\uC804\uC774\uBA70 \uD639\uB4F1\uACE0\uB798\uC758 \uBC88\uC2DD \uD574\uC5ED\uC774\uAE30\uB3C4 \uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uBE0C\uB77C\uC9C8 \uCE58\uCFE0\uBA58\uC9C0\uC2A4 \uC0DD\uBB3C\uB2E4\uC591\uC131\uBCF4\uC804\uC5F0\uAD6C\uC18C"
    },
    surface: "sea",
    visual: {
      shape: "mushroomreef",
      height: 40,
      width: 102,
      spans: 4,
      terrainHeight: 11,
      actorX: 94,
      color: "#b79889",
      motif: "whale"
    },
    scene: {
      description: "Abrolhos Marine National Park: A whale silhouette passes above the offshore bank.",
      descriptionKo: "\uC544\uBE0C\uB864\uB958\uC2A4 \uD574\uC591\uAD6D\uB9BD\uACF5\uC6D0: \uACE0\uB798\uC758 \uBAA8\uC2B5\uC774 \uD574\uC800 \uB454\uB355 \uC704\uB97C \uC9C0\uB098\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "namena",
      name: "Namena Marine Reserve",
      country: "Fiji",
      code: "FJI",
      tier: "rare",
      lat: -17.1108726,
      lon: 179.098435,
      source: "https://fiji.wcs.org/Initiatives/Protected-Areas/Namena-Marine-Reserve.aspx",
      region: "Bligh Water",
      description: "A community-established no-take reserve around Namena protects reefs and the marine life that uses them.",
      descriptionSourceName: "Wildlife Conservation Society Fiji",
      descriptionSource: "https://fiji.wcs.org/Initiatives/Protected-Areas/Namena-Marine-Reserve.aspx"
    },
    korean: {
      name: "\uB098\uBA54\uB098 \uD574\uC591\uBCF4\uD638\uAD6C\uC5ED",
      country: "\uD53C\uC9C0",
      region: "\uBE14\uB77C\uC774\uC6CC\uD130",
      description: "\uB098\uBA54\uB098 \uC8FC\uBCC0\uC5D0\uB294 \uC9C0\uC5ED \uACF5\uB3D9\uCCB4\uAC00 \uC870\uC131\uD55C \uCC44\uCDE8 \uAE08\uC9C0 \uBCF4\uD638\uAD6C\uC5ED\uC774 \uC788\uC5B4 \uC0B0\uD638\uCD08\uC640 \uD574\uC591 \uC0DD\uBB3C\uC744 \uC9C0\uD0B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC57C\uC0DD\uB3D9\uBB3C\uBCF4\uC804\uD611\uD68C \uD53C\uC9C0"
    },
    surface: "sea",
    visual: {
      shape: "reef",
      height: 31,
      width: 99,
      spans: 5,
      terrainHeight: 10,
      actorX: 20,
      color: "#c88b73",
      motif: "fish"
    },
    scene: {
      description: "Namena Marine Reserve: A fish school weaves between the reef forms.",
      descriptionKo: "\uB098\uBA54\uB098 \uD574\uC591\uBCF4\uD638\uAD6C\uC5ED: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "exumacays",
      name: "Exuma Cays Land and Sea Park",
      country: "Bahamas",
      code: "BHS",
      tier: "common",
      lat: 24.42,
      lon: -76.69,
      source: "https://bnt.bs/explore/exuma/exuma-cays-land-sea-park/",
      region: "Exuma",
      description: "Shallow turquoise channels, cays and marine habitats form a protected seascape in the Exuma island chain.",
      descriptionSourceName: "Bahamas National Trust",
      descriptionSource: "https://bnt.bs/explore/exuma/exuma-cays-land-sea-park/"
    },
    korean: {
      name: "\uC5D1\uC218\uB9C8\uCF00\uC774\uC2A4 \uC721\uD574\uC0C1\uACF5\uC6D0",
      country: "\uBC14\uD558\uB9C8",
      region: "\uC5D1\uC218\uB9C8",
      description: "\uC5D1\uC218\uB9C8 \uC81C\uB3C4\uC5D0 \uC595\uC740 \uCCAD\uB85D\uBE5B \uC218\uB85C\uC640 \uC791\uC740 \uC12C, \uD574\uC591 \uC11C\uC2DD\uC9C0\uAC00 \uC5B4\uC6B0\uB7EC\uC9C4 \uBCF4\uD638 \uACBD\uAD00\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uBC14\uD558\uB9C8 \uB0B4\uC154\uB110\uD2B8\uB7EC\uC2A4\uD2B8"
    },
    surface: "sea",
    visual: {
      shape: "sandbar",
      height: 18,
      width: 108,
      spans: 4,
      terrainHeight: 7,
      actorX: 103,
      color: "#629b9f",
      motif: "fish"
    },
    scene: {
      description: "Exuma Cays Land and Sea Park: A fish school weaves between the reef forms.",
      descriptionKo: "\uC5D1\uC218\uB9C8\uCF00\uC774\uC2A4 \uC721\uD574\uC0C1\uACF5\uC6D0: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "jardinesreina",
      name: "Jardines de la Reina",
      country: "Cuba",
      code: "CUB",
      tier: "common",
      lat: 20.9292729,
      lon: -79.0706878,
      source: "https://www.cuba.travel/destinos/ciego-de-avila/naturaleza",
      region: "Southern Cuba",
      description: "Coral reefs, mangrove islands and shallow lagoons form a marine archipelago off Cuba\u2019s southern coast.",
      descriptionSourceName: "Cuba Travel",
      descriptionSource: "https://www.cuba.travel/destinos/ciego-de-avila/naturaleza"
    },
    korean: {
      name: "\uD558\uB974\uB514\uB124\uC2A4\uB370\uB77C\uB808\uC774\uB098",
      country: "\uCFE0\uBC14",
      region: "\uCFE0\uBC14 \uB0A8\uCABD \uD574\uC5ED",
      description: "\uCFE0\uBC14 \uB0A8\uCABD \uD574\uC548 \uC55E\uBC14\uB2E4\uC5D0 \uC0B0\uD638\uCD08\uC640 \uB9F9\uADF8\uB85C\uBE0C\uC12C, \uC595\uC740 \uC11D\uD638\uB85C \uC774\uB8E8\uC5B4\uC9C4 \uD574\uC591 \uAD70\uB3C4\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uCFE0\uBC14 \uAD00\uAD11\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "mangrovereef",
      height: 42,
      width: 97,
      spans: 6,
      terrainHeight: 12,
      actorX: 16,
      color: "#d4b078",
      motif: "seagrass"
    },
    scene: {
      description: "Jardines de la Reina: Underwater leaves sway beside the protected shallows.",
      descriptionKo: "\uD558\uB974\uB514\uB124\uC2A4\uB370\uB77C\uB808\uC774\uB098: \uBCF4\uD638\uBC1B\uB294 \uC595\uC740 \uBC14\uB2E4\uC5D0\uC11C \uD574\uCD08 \uC78E\uC774 \uD754\uB4E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "flowergarden",
      name: "Flower Garden Banks Sanctuary",
      country: "United States",
      code: "USA",
      tier: "rare",
      lat: 27.8700385,
      lon: -93.8328397,
      source: "https://flowergarden.noaa.gov/",
      region: "Northwestern Gulf",
      description: "Offshore banks rise from deeper Gulf water and support coral communities, sponges and other marine life.",
      descriptionSourceName: "NOAA",
      descriptionSource: "https://flowergarden.noaa.gov/"
    },
    korean: {
      name: "\uD50C\uB77C\uC6CC\uAC00\uB4E0\uBC45\uD06C\uC2A4 \uBCF4\uD638\uAD6C\uC5ED",
      country: "\uBBF8\uAD6D",
      region: "\uBA55\uC2DC\uCF54\uB9CC \uBD81\uC11C\uBD80",
      description: "\uBA55\uC2DC\uCF54\uB9CC\uC758 \uAE4A\uC740 \uBB3C\uC18D\uC5D0\uC11C \uC19F\uC740 \uD574\uC800 \uB454\uB355\uC5D0 \uC0B0\uD638 \uAD70\uB77D\uACFC \uD574\uBA74 \uB4F1 \uD574\uC591 \uC0DD\uBB3C\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uBBF8\uAD6D \uD574\uC591\uB300\uAE30\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "mushroomreef",
      height: 37,
      width: 105,
      spans: 5,
      terrainHeight: 9,
      actorX: 95,
      color: "#839b70",
      motif: "fish"
    },
    scene: {
      description: "Flower Garden Banks Sanctuary: A fish school weaves between the reef forms.",
      descriptionKo: "\uD50C\uB77C\uC6CC\uAC00\uB4E0\uBC45\uD06C\uC2A4 \uBCF4\uD638\uAD6C\uC5ED: \uBB3C\uACE0\uAE30 \uB5BC\uAC00 \uC0B0\uD638\uCD08 \uC0AC\uC774\uB97C \uC624\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "stellwagen",
      name: "Stellwagen Bank Sanctuary",
      country: "United States",
      code: "USA",
      tier: "rare",
      lat: 42.4006174,
      lon: -70.3357931,
      source: "https://stellwagen.noaa.gov/",
      region: "Massachusetts Bay",
      description: "A shallow offshore bank at the entrance to Massachusetts Bay creates productive feeding habitat for whales and other marine animals.",
      descriptionSourceName: "NOAA",
      descriptionSource: "https://stellwagen.noaa.gov/"
    },
    korean: {
      name: "\uC2A4\uD154\uC640\uAC90\uBC45\uD06C \uBCF4\uD638\uAD6C\uC5ED",
      country: "\uBBF8\uAD6D",
      region: "\uB9E4\uC0AC\uCD94\uC138\uCE20\uB9CC",
      description: "\uB9E4\uC0AC\uCD94\uC138\uCE20\uB9CC \uC785\uAD6C\uC758 \uC595\uC740 \uD574\uC800 \uB454\uB355\uC774 \uACE0\uB798\uC640 \uC5EC\uB7EC \uD574\uC591 \uB3D9\uBB3C\uC758 \uD48D\uBD80\uD55C \uBA39\uC774\uD130\uAC00 \uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uBBF8\uAD6D \uD574\uC591\uB300\uAE30\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "sandbank",
      height: 26,
      width: 109,
      spans: 2,
      terrainHeight: 11,
      actorX: 19,
      color: "#93a8b0",
      motif: "whale"
    },
    scene: {
      description: "Stellwagen Bank Sanctuary: A whale silhouette passes above the offshore bank.",
      descriptionKo: "\uC2A4\uD154\uC640\uAC90\uBC45\uD06C \uBCF4\uD638\uAD6C\uC5ED: \uACE0\uB798\uC758 \uBAA8\uC2B5\uC774 \uD574\uC800 \uB454\uB355 \uC704\uB97C \uC9C0\uB098\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "monitorwreck",
      name: "USS Monitor Sanctuary",
      country: "United States",
      code: "USA",
      tier: "rare",
      lat: 35.0016689,
      lon: -75.4063896,
      source: "https://monitor.noaa.gov/",
      region: "Cape Hatteras",
      description: "The wreck of the ironclad USS Monitor lies offshore from Cape Hatteras, protected as an important maritime archaeological site.",
      descriptionSourceName: "NOAA",
      descriptionSource: "https://monitor.noaa.gov/"
    },
    korean: {
      name: "USS \uBAA8\uB2C8\uD130 \uBCF4\uD638\uAD6C\uC5ED",
      country: "\uBBF8\uAD6D",
      region: "\uD574\uD130\uB7EC\uC2A4\uACF6 \uC55E\uBC14\uB2E4",
      description: "\uCCA0\uAC11\uD568 USS \uBAA8\uB2C8\uD130\uC758 \uC794\uD574\uAC00 \uD574\uD130\uB7EC\uC2A4\uACF6 \uC55E\uBC14\uB2E4\uC5D0 \uAC00\uB77C\uC549\uC544 \uC911\uC694\uD55C \uD574\uC591 \uACE0\uACE0\uD559 \uC720\uC0B0\uC73C\uB85C \uBCF4\uD638\uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uBBF8\uAD6D \uD574\uC591\uB300\uAE30\uCCAD"
    },
    surface: "sea",
    visual: {
      shape: "wreck",
      height: 18,
      width: 98,
      spans: 2,
      terrainHeight: 8,
      actorX: 101,
      color: "#b79889",
      motif: "diver"
    },
    scene: {
      description: "USS Monitor Sanctuary: A small diver surveys the submerged hull.",
      descriptionKo: "USS \uBAA8\uB2C8\uD130 \uBCF4\uD638\uAD6C\uC5ED: \uC791\uC740 \uC7A0\uC218\uBD80\uAC00 \uAC00\uB77C\uC549\uC740 \uC120\uCCB4\uB97C \uC0B4\uD54D\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "portcros",
      name: "Port-Cros Marine Waters",
      country: "France",
      code: "FRA",
      tier: "common",
      lat: 43.064623,
      lon: 6.4586434,
      source: "https://portcros-parcnational.fr/fr/des-decouvertes/une-destination-dexception/la-mer",
      region: "Hy\xE8res Islands",
      description: "Mediterranean marine habitats around Port-Cros include seagrass meadows and rocky underwater communities.",
      descriptionSourceName: "Port-Cros National Park",
      descriptionSource: "https://portcros-parcnational.fr/fr/des-decouvertes/une-destination-dexception/la-mer"
    },
    korean: {
      name: "\uD3EC\uB974\uD06C\uB85C \uD574\uC591\uAD6C\uC5ED",
      country: "\uD504\uB791\uC2A4",
      region: "\uC774\uC5D0\uB974 \uC81C\uB3C4",
      description: "\uD3EC\uB974\uD06C\uB85C \uC8FC\uBCC0 \uC9C0\uC911\uD574 \uBC14\uB2E4\uC5D0\uB294 \uD574\uCD08\uBC2D\uACFC \uBC14\uC704 \uC9C0\uD615\uC758 \uC218\uC911 \uC0DD\uD0DC\uACC4\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uD3EC\uB974\uD06C\uB85C \uAD6D\uB9BD\uACF5\uC6D0"
    },
    surface: "sea",
    visual: {
      shape: "seagrass",
      height: 39,
      width: 103,
      spans: 7,
      terrainHeight: 9,
      actorX: 21,
      color: "#c88b73",
      motif: "seagrass"
    },
    scene: {
      description: "Port-Cros Marine Waters: Underwater leaves sway beside the protected shallows.",
      descriptionKo: "\uD3EC\uB974\uD06C\uB85C \uD574\uC591\uAD6C\uC5ED: \uBCF4\uD638\uBC1B\uB294 \uC595\uC740 \uBC14\uB2E4\uC5D0\uC11C \uD574\uCD08 \uC78E\uC774 \uD754\uB4E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "sydneybridge",
      name: "Sydney Harbour Bridge",
      country: "Australia",
      code: "AUS",
      tier: "epic",
      lat: -33.8521165,
      lon: 151.2107812,
      source: "https://www.dcceew.gov.au/parks-heritage/heritage/places/national/sydney-harbour-bridge",
      region: "Port Jackson",
      description: "A broad steel arch carries traffic across Sydney Harbour; its stone pylons and suspended deck form a silhouette distinct from the Opera House.",
      descriptionSourceName: "Australian Government DCCEEW",
      descriptionSource: "https://www.dcceew.gov.au/parks-heritage/heritage/places/national/sydney-harbour-bridge"
    },
    korean: {
      name: "\uC2DC\uB4DC\uB2C8 \uD558\uBC84\uBE0C\uB9AC\uC9C0",
      country: "\uD638\uC8FC",
      region: "\uD3EC\uD2B8\uC7AD\uC2A8",
      description: "\uB113\uC740 \uAC15\uCCA0 \uC544\uCE58\uAC00 \uC2DC\uB4DC\uB2C8\uD56D\uC744 \uAC00\uB85C\uC9C0\uB974\uBA70, \uC11D\uC870 \uC8FC\uD0D1\uACFC \uB9E4\uB2EC\uB9B0 \uC0C1\uD310\uC774 \uC624\uD398\uB77C\uD558\uC6B0\uC2A4\uC640 \uB2E4\uB978 \uC724\uACFD\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
      descriptionSourceName: "\uD638\uC8FC \uAE30\uD6C4\uBCC0\uD654\uC5D0\uB108\uC9C0\uD658\uACBD\uC218\uC790\uC6D0\uBD80"
    },
    surface: "sea",
    visual: {
      shape: "steelarch",
      height: 83,
      width: 110,
      spans: 1,
      terrainHeight: 8,
      actorX: 98,
      color: "#68847c",
      motif: "train"
    },
    scene: {
      description: "Sydney Harbour Bridge: A tiny train follows the elevated crossing.",
      descriptionKo: "\uC2DC\uB4DC\uB2C8 \uD558\uBC84\uBE0C\uB9AC\uC9C0: \uC791\uC740 \uAE30\uCC28\uAC00 \uB192\uC774 \uB193\uC778 \uB2E4\uB9AC\uB97C \uAC74\uB119\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "towerbridge",
      name: "Tower Bridge",
      country: "United Kingdom",
      code: "GBR",
      tier: "epic",
      lat: 51.5055158,
      lon: -0.0753665,
      source: "https://www.towerbridge.org.uk/about-us",
      region: "River Thames, London",
      description: "Two stone-clad towers and a lifting central span carry a crossing over the Thames while allowing tall vessels to pass.",
      descriptionSourceName: "Tower Bridge official website",
      descriptionSource: "https://www.towerbridge.org.uk/about-us"
    },
    korean: {
      name: "\uD0C0\uC6CC\uBE0C\uB9AC\uC9C0",
      country: "\uC601\uAD6D",
      region: "\uB7F0\uB358 \uD15C\uC2A4\uAC15",
      description: "\uC11D\uC7AC\uB85C \uAC10\uC2FC \uB450 \uD0D1 \uC0AC\uC774 \uC911\uC559 \uC0C1\uD310\uC774 \uC5F4\uB824 \uD15C\uC2A4\uAC15\uC744 \uC9C0\uB098\uB294 \uD070 \uBC30\uC5D0 \uAE38\uC744 \uB0B4\uC90D\uB2C8\uB2E4.",
      descriptionSourceName: "\uD0C0\uC6CC\uBE0C\uB9AC\uC9C0 \uACF5\uC2DD \uC6F9\uC0AC\uC774\uD2B8"
    },
    surface: "river",
    visual: {
      shape: "bascule",
      height: 70,
      width: 108,
      spans: 2,
      terrainHeight: 0,
      actorX: 18,
      color: "#d4b078",
      motif: "walk"
    },
    scene: {
      description: "Tower Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uD0C0\uC6CC\uBE0C\uB9AC\uC9C0: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "charlesbridge",
      name: "Charles Bridge",
      country: "Czechia",
      code: "CZE",
      tier: "rare",
      lat: 50.0864344,
      lon: 14.41190698,
      source: "https://prague.eu/en/objevujte/charles-bridge-karluv-most/",
      region: "Vltava, Prague",
      description: "Sandstone arches cross the Vltava between Prague\u2019s historic riverbanks, with statues lining the pedestrian bridge.",
      descriptionSourceName: "Prague City Tourism",
      descriptionSource: "https://prague.eu/en/objevujte/charles-bridge-karluv-most/"
    },
    korean: {
      name: "\uCE74\uB97C\uAD50",
      country: "\uCCB4\uCF54",
      region: "\uD504\uB77C\uD558 \uBE14\uD0C0\uBC14\uAC15",
      description: "\uC0AC\uC554 \uC544\uCE58\uAC00 \uD504\uB77C\uD558\uC758 \uC61B \uAC15\uBCC0 \uC0AC\uC774 \uBE14\uD0C0\uBC14\uAC15\uC744 \uAC00\uB85C\uC9C0\uB974\uBA70, \uBCF4\uD589\uAD50\uB97C \uB530\uB77C \uC870\uAC01\uC0C1\uB4E4\uC774 \uB298\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD504\uB77C\uD558 \uACF5\uC2DD \uAD00\uAD11 \uC548\uB0B4"
    },
    surface: "river",
    visual: {
      shape: "stonebridge",
      height: 44,
      width: 112,
      spans: 8,
      terrainHeight: 0,
      actorX: 100,
      color: "#839b70",
      motif: "walk"
    },
    scene: {
      description: "Charles Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uCE74\uB97C\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "chainbridge",
      name: "Sz\xE9chenyi Chain Bridge",
      country: "Hungary",
      code: "HUN",
      tier: "rare",
      lat: 47.4989791,
      lon: 19.0436494,
      source: "https://visithungary.com/articles/the-szechenyi-chain-bridge",
      region: "Danube, Budapest",
      description: "Suspension chains run between stone towers above the Danube, linking the Buda and Pest riverbanks. Its gate-like towers make the chain-supported structure easy to recognise.",
      descriptionSourceName: "Visit Hungary",
      descriptionSource: "https://visithungary.com/articles/the-szechenyi-chain-bridge"
    },
    korean: {
      name: "\uC138\uCCB4\uB2C8 \uC0AC\uC2AC\uAD50",
      country: "\uD5DD\uAC00\uB9AC",
      region: "\uBD80\uB2E4\uD398\uC2A4\uD2B8 \uB2E4\uB274\uBE0C\uAC15",
      description: "\uB2E4\uB274\uBE0C\uAC15 \uC704 \uC11D\uC870 \uC8FC\uD0D1 \uC0AC\uC774\uB85C \uD604\uC218 \uC0AC\uC2AC\uC774 \uC774\uC5B4\uC838 \uBD80\uB2E4\uC640 \uD398\uC2A4\uD2B8 \uAC15\uBCC0\uC744 \uC787\uC2B5\uB2C8\uB2E4. \uBB38\uCC98\uB7FC \uC0DD\uAE34 \uC8FC\uD0D1\uC774 \uC0AC\uC2AC\uB85C \uBC1B\uCE5C \uAD6C\uC870\uC758 \uD2B9\uC9D5\uC744 \uB4DC\uB7EC\uB0C5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD5DD\uAC00\uB9AC \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "chainbridge",
      height: 53,
      width: 110,
      spans: 2,
      terrainHeight: 0,
      actorX: 18,
      color: "#93a8b0",
      motif: "walk"
    },
    scene: {
      description: "Sz\xE9chenyi Chain Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uC138\uCCB4\uB2C8 \uC0AC\uC2AC\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "pontevecchio",
      name: "Ponte Vecchio",
      country: "Italy",
      code: "ITA",
      tier: "rare",
      lat: 43.7680307,
      lon: 11.2531614,
      source: "https://www.visittuscany.com/en/attractions/ponte-vecchio/",
      region: "Arno, Florence",
      description: "Shops cluster above three broad arches across the Arno, with the elevated Vasari Corridor running over the bridge.",
      descriptionSourceName: "Visit Tuscany",
      descriptionSource: "https://www.visittuscany.com/en/attractions/ponte-vecchio/"
    },
    korean: {
      name: "\uBCA0\uD0A4\uC624 \uB2E4\uB9AC",
      country: "\uC774\uD0C8\uB9AC\uC544",
      region: "\uD53C\uB80C\uCCB4 \uC544\uB974\uB178\uAC15",
      description: "\uC544\uB974\uB178\uAC15\uC744 \uAC74\uB108\uB294 \uB113\uC740 \uC544\uCE58 \uC138 \uAC1C \uC704\uC5D0 \uC0C1\uC810\uB4E4\uC774 \uBAA8\uC5EC \uC788\uACE0, \uADF8 \uC704\uB85C \uBC14\uC0AC\uB9AC \uD68C\uB791\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uD1A0\uC2A4\uCE74\uB098 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "shopbridge",
      height: 39,
      width: 107,
      spans: 3,
      terrainHeight: 0,
      actorX: 98,
      color: "#b79889",
      motif: "walk"
    },
    scene: {
      description: "Ponte Vecchio: A visitor follows the crossing above the river.",
      descriptionKo: "\uBCA0\uD0A4\uC624 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "alexandrebridge",
      name: "Pont Alexandre III",
      country: "France",
      code: "FRA",
      tier: "rare",
      lat: 48.8634697,
      lon: 2.3135181,
      source: "https://parisjetaime.com/eng/transport/pont-alexandre-iii-p1875",
      region: "Seine, Paris",
      description: "A low metal arch crosses the Seine between ornate lamp standards and tall pillars topped with gilded sculptures.",
      descriptionSourceName: "Paris Tourist Office",
      descriptionSource: "https://parisjetaime.com/eng/transport/pont-alexandre-iii-p1875"
    },
    korean: {
      name: "\uC54C\uB809\uC0C1\uB4DC\uB974 3\uC138 \uB2E4\uB9AC",
      country: "\uD504\uB791\uC2A4",
      region: "\uD30C\uB9AC \uC13C\uAC15",
      description: "\uD654\uB824\uD55C \uAC00\uB85C\uB4F1\uACFC \uAE08\uBE5B \uC870\uAC01\uC0C1\uC744 \uC5B9\uC740 \uB192\uC740 \uAE30\uB465 \uC0AC\uC774\uB85C \uB0AE\uC740 \uAE08\uC18D \uC544\uCE58\uAC00 \uC13C\uAC15\uC744 \uAC00\uB85C\uC9C0\uB985\uB2C8\uB2E4.",
      descriptionSourceName: "\uD30C\uB9AC \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "lowarch",
      height: 29,
      width: 109,
      spans: 1,
      terrainHeight: 0,
      actorX: 19,
      color: "#c88b73",
      motif: "walk"
    },
    scene: {
      description: "Pont Alexandre III: A visitor follows the crossing above the river.",
      descriptionKo: "\uC54C\uB809\uC0C1\uB4DC\uB974 3\uC138 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "millauviaduct",
      name: "Millau Viaduct",
      country: "France",
      code: "FRA",
      tier: "epic",
      lat: 44.0799775,
      lon: 3.0224087,
      source: "https://www.leviaducdemillau.com/sites/viaducdemillau/accueil-viaduc-de-millau/le-viaduc/le-viaduc-presentation-du-viaduc.html",
      region: "Tarn Valley",
      description: "Slender piers and cable stays carry a long deck high above the Tarn River valley near Millau. Seven main piers give the crossing its repeated slender profile.",
      descriptionSourceName: "Compagnie Eiffage du Viaduc de Millau",
      descriptionSource: "https://www.leviaducdemillau.com/sites/viaducdemillau/accueil-viaduc-de-millau/le-viaduc/le-viaduc-presentation-du-viaduc.html"
    },
    korean: {
      name: "\uBBF8\uC694 \uACE0\uAC00\uAD50",
      country: "\uD504\uB791\uC2A4",
      region: "\uD0C0\uB978 \uACC4\uACE1",
      description: "\uAC00\uB290\uB2E4\uB780 \uAD50\uAC01\uACFC \uC0AC\uC7A5 \uCF00\uC774\uBE14\uC774 \uBBF8\uC694 \uADFC\uCC98 \uD0C0\uB978\uAC15 \uACC4\uACE1 \uB192\uC740 \uACF3\uC5D0\uC11C \uAE34 \uC0C1\uD310\uC744 \uBC1B\uCE69\uB2C8\uB2E4. \uC77C\uACF1 \uC8FC \uAD50\uAC01\uC774 \uBC18\uBCF5\uB418\uB294 \uAC00\uB290\uB2E4\uB780 \uC724\uACFD\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
      descriptionSourceName: "\uC5D0\uD30C\uC8FC \uBBF8\uC694 \uACE0\uAC00\uAD50 \uC6B4\uC601\uC0AC"
    },
    surface: "river",
    visual: {
      shape: "cablestayed",
      height: 92,
      width: 113,
      spans: 7,
      terrainHeight: 0,
      actorX: 102,
      color: "#629b9f",
      motif: "walk"
    },
    scene: {
      description: "Millau Viaduct: A visitor follows the crossing above the river.",
      descriptionKo: "\uBBF8\uC694 \uACE0\uAC00\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "garabit",
      name: "Garabit Viaduct",
      country: "France",
      code: "FRA",
      tier: "rare",
      lat: 44.9745645,
      lon: 3.1774879,
      source: "https://www.pays-saint-flour.fr/en/must-see/viaduc-de-garabit/",
      region: "Truy\xE8re Valley",
      description: "A red metal arch carries the railway across the Truy\xE8re valley, a prominent work associated with Gustave Eiffel.",
      descriptionSourceName: "Saint-Flour Tourist Office",
      descriptionSource: "https://www.pays-saint-flour.fr/en/must-see/viaduc-de-garabit/"
    },
    korean: {
      name: "\uAC00\uB77C\uBE44 \uACE0\uAC00\uAD50",
      country: "\uD504\uB791\uC2A4",
      region: "\uD2B8\uB93C\uC608\uB974 \uACC4\uACE1",
      description: "\uBD89\uC740 \uAE08\uC18D \uC544\uCE58\uAC00 \uD2B8\uB93C\uC608\uB974 \uACC4\uACE1\uC744 \uAC74\uB108\uB294 \uCCA0\uB3C4\uB97C \uBC1B\uCE58\uBA70, \uADC0\uC2A4\uD0C0\uBE0C \uC5D0\uD3A0\uACFC \uAD00\uB828\uB41C \uB300\uD45C\uC801\uC778 \uD1A0\uBAA9 \uC720\uC0B0\uC785\uB2C8\uB2E4.",
      descriptionSourceName: "\uC0DD\uD50C\uB8E8\uB974 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "steelarch",
      height: 70,
      width: 109,
      spans: 1,
      terrainHeight: 0,
      actorX: 18,
      color: "#d4b078",
      motif: "train"
    },
    scene: {
      description: "Garabit Viaduct: A tiny train follows the elevated crossing.",
      descriptionKo: "\uAC00\uB77C\uBE44 \uACE0\uAC00\uAD50: \uC791\uC740 \uAE30\uCC28\uAC00 \uB192\uC774 \uB193\uC778 \uB2E4\uB9AC\uB97C \uAC74\uB119\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "landwasser",
      name: "Landwasser Viaduct",
      country: "Switzerland",
      code: "CHE",
      tier: "rare",
      lat: 46.6809366,
      lon: 9.6760239,
      source: "https://www.rhb.ch/en/excursions/landwasser-express/",
      region: "Landwasser River, Filisur",
      description: "A curved stone railway viaduct crosses the Landwasser gorge and leads directly into a tunnel in the rock face.",
      descriptionSourceName: "Rhaetian Railway",
      descriptionSource: "https://www.rhb.ch/en/excursions/landwasser-express/"
    },
    korean: {
      name: "\uB780\uD2B8\uBC14\uC11C \uACE0\uAC00\uAD50",
      country: "\uC2A4\uC704\uC2A4",
      region: "\uD544\uB9AC\uC8FC\uC5B4 \uB780\uD2B8\uBC14\uC11C\uAC15",
      description: "\uAD7D\uC740 \uC11D\uC870 \uCCA0\uB3C4\uAD50\uAC00 \uB780\uD2B8\uBC14\uC11C\uAC15 \uD611\uACE1\uC744 \uAC74\uB108 \uBC14\uC704 \uC808\uBCBD\uC758 \uD130\uB110\uB85C \uACE7\uC7A5 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uB808\uD2F0\uC170 \uCCA0\uB3C4"
    },
    surface: "river",
    visual: {
      shape: "railviaduct",
      height: 86,
      width: 104,
      spans: 6,
      terrainHeight: 0,
      actorX: 97,
      color: "#839b70",
      motif: "train"
    },
    scene: {
      description: "Landwasser Viaduct: A tiny train follows the elevated crossing.",
      descriptionKo: "\uB780\uD2B8\uBC14\uC11C \uACE0\uAC00\uAD50: \uC791\uC740 \uAE30\uCC28\uAC00 \uB192\uC774 \uB193\uC778 \uB2E4\uB9AC\uB97C \uAC74\uB119\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "chapelbridge",
      name: "Chapel Bridge",
      country: "Switzerland",
      code: "CHE",
      tier: "rare",
      lat: 47.05134195,
      lon: 8.30724012,
      source: "https://www.luzern.com/en/poi/chapel-bridge",
      region: "Reuss, Lucerne",
      description: "A covered timber bridge crosses the Reuss beside an octagonal water tower, with painted panels beneath its roof.",
      descriptionSourceName: "Lucerne Tourism",
      descriptionSource: "https://www.luzern.com/en/poi/chapel-bridge"
    },
    korean: {
      name: "\uCE74\uD3A0\uAD50",
      country: "\uC2A4\uC704\uC2A4",
      region: "\uB8E8\uCCB4\uB978 \uB85C\uC774\uC2A4\uAC15",
      description: "\uD314\uAC01\uD615 \uC218\uD0D1 \uACC1\uC73C\uB85C \uC9C0\uBD95\uC744 \uC5B9\uC740 \uBAA9\uC870 \uB2E4\uB9AC\uAC00 \uB85C\uC774\uC2A4\uAC15\uC744 \uAC74\uB108\uBA70, \uC9C0\uBD95 \uC544\uB798\uC5D0\uB294 \uADF8\uB9BC \uD328\uB110\uC774 \uAC78\uB824 \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uB8E8\uCCB4\uB978 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "coveredbridge",
      height: 34,
      width: 108,
      spans: 5,
      terrainHeight: 0,
      actorX: 20,
      color: "#93a8b0",
      motif: "walk"
    },
    scene: {
      description: "Chapel Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uCE74\uD3A0\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "magdeburgbridge",
      name: "Magdeburg Water Bridge",
      country: "Germany",
      code: "DEU",
      tier: "rare",
      lat: 52.230833,
      lon: 11.701389,
      source: "https://www.magdeburg-tourist.de/Tourismus-Freizeit/System/Wasserstra%C3%9Fenkreuz.php?object=tx%2C115.3397.1",
      region: "Elbe, Magdeburg",
      description: "A navigable trough carries canal boats over the Elbe as part of Magdeburg\u2019s waterway crossing. Canal water and river water pass at different levels.",
      descriptionSourceName: "Magdeburg Tourism",
      descriptionSource: "https://www.magdeburg-tourist.de/Tourismus-Freizeit/System/Wasserstra%C3%9Fenkreuz.php?object=tx%2C115.3397.1"
    },
    korean: {
      name: "\uB9C8\uADF8\uB370\uBD80\uB974\uD06C \uC218\uB85C\uAD50",
      country: "\uB3C5\uC77C",
      region: "\uB9C8\uADF8\uB370\uBD80\uB974\uD06C \uC5D8\uBCA0\uAC15",
      description: "\uB9C8\uADF8\uB370\uBD80\uB974\uD06C \uC218\uB85C \uAD50\uCC28 \uC9C0\uC810\uC5D0\uC11C \uC120\uBC15\uC774 \uC9C0\uB098\uB294 \uC218\uB85C\uAD50\uAC00 \uC5D8\uBCA0\uAC15 \uC704\uB97C \uAC74\uB119\uB2C8\uB2E4. \uC6B4\uD558\uC758 \uBB3C\uACFC \uAC15\uBB3C\uC774 \uC11C\uB85C \uB2E4\uB978 \uB192\uC774\uB85C \uC9C0\uB098\uAC11\uB2C8\uB2E4.",
      descriptionSourceName: "\uB9C8\uADF8\uB370\uBD80\uB974\uD06C \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "waterbridge",
      height: 40,
      width: 112,
      spans: 3,
      terrainHeight: 0,
      actorX: 100,
      color: "#b79889",
      motif: "walk"
    },
    scene: {
      description: "Magdeburg Water Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uB9C8\uADF8\uB370\uBD80\uB974\uD06C \uC218\uB85C\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "hohenzollernbridge",
      name: "Hohenzollern Bridge",
      country: "Germany",
      code: "DEU",
      tier: "common",
      lat: 50.9414,
      lon: 6.964602,
      source: "https://www.koelntourismus.de/kunst-kultur/sehenswuerdigkeiten/detail/hohenzollernbruecke",
      region: "Rhine, Cologne",
      description: "Parallel metal arches carry railway tracks and footpaths over the Rhine beside central Cologne. Successive arch groups give the crossing a repeated curved outline.",
      descriptionSourceName: "Cologne Tourist Board",
      descriptionSource: "https://www.koelntourismus.de/kunst-kultur/sehenswuerdigkeiten/detail/hohenzollernbruecke"
    },
    korean: {
      name: "\uD638\uC5D4\uCD10\uB808\uB978 \uB2E4\uB9AC",
      country: "\uB3C5\uC77C",
      region: "\uCFB0\uB978 \uB77C\uC778\uAC15",
      description: "\uB098\uB780\uD788 \uC120 \uAE08\uC18D \uC544\uCE58\uB4E4\uC774 \uCFB0\uB978 \uB3C4\uC2EC \uC606 \uB77C\uC778\uAC15\uC744 \uAC74\uB108\uB294 \uCCA0\uB85C\uC640 \uBCF4\uD589\uB85C\uB97C \uBC1B\uCE69\uB2C8\uB2E4. \uC5F0\uC18D\uB41C \uC544\uCE58 \uBB36\uC74C\uC774 \uBC18\uBCF5\uB418\uB294 \uACE1\uC120 \uC724\uACFD\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
      descriptionSourceName: "\uCFB0\uB978 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "trussbridge",
      height: 53,
      width: 111,
      spans: 3,
      terrainHeight: 0,
      actorX: 18,
      color: "#c88b73",
      motif: "train"
    },
    scene: {
      description: "Hohenzollern Bridge: A tiny train follows the elevated crossing.",
      descriptionKo: "\uD638\uC5D4\uCD10\uB808\uB978 \uB2E4\uB9AC: \uC791\uC740 \uAE30\uCC28\uAC00 \uB192\uC774 \uB193\uC778 \uB2E4\uB9AC\uB97C \uAC74\uB119\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "glienickebridge",
      name: "Glienicke Bridge",
      country: "Germany",
      code: "DEU",
      tier: "common",
      lat: 52.413462,
      lon: 13.090227,
      source: "https://www.potsdam.de/en/glienicker-bruecke",
      region: "Havel, Potsdam",
      description: "A steel bridge crosses the Havel between Potsdam and Berlin, remembered for exchanges during the Cold War.",
      descriptionSourceName: "City of Potsdam",
      descriptionSource: "https://www.potsdam.de/en/glienicker-bruecke"
    },
    korean: {
      name: "\uAE00\uB9AC\uB2C8\uCF00 \uB2E4\uB9AC",
      country: "\uB3C5\uC77C",
      region: "\uD3EC\uCE20\uB2F4 \uD558\uD3A0\uAC15",
      description: "\uD3EC\uCE20\uB2F4\uACFC \uBCA0\uB97C\uB9B0 \uC0AC\uC774 \uD558\uD3A0\uAC15\uC744 \uAC74\uB108\uB294 \uAC15\uCCA0 \uB2E4\uB9AC\uB85C, \uB0C9\uC804\uAE30\uC758 \uAD50\uD658 \uC7A5\uC18C\uB85C\uB3C4 \uAE30\uC5B5\uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uD3EC\uCE20\uB2F4\uC2DC"
    },
    surface: "river",
    visual: {
      shape: "trussbridge",
      height: 41,
      width: 108,
      spans: 3,
      terrainHeight: 0,
      actorX: 102,
      color: "#629b9f",
      motif: "walk"
    },
    scene: {
      description: "Glienicke Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uAE00\uB9AC\uB2C8\uCF00 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "regensburgbridge",
      name: "Regensburg Stone Bridge",
      country: "Germany",
      code: "DEU",
      tier: "common",
      lat: 49.0226092,
      lon: 12.0972361,
      source: "https://tourismus.regensburg.de/en/experience-discover/sightseeing-unesco-world-heritage/stone-bridge",
      region: "Danube, Regensburg",
      description: "A long sequence of medieval stone arches crosses the Danube beside Regensburg\u2019s old town. The bridge links the old town with Stadtamhof across the river.",
      descriptionSourceName: "Regensburg Tourism",
      descriptionSource: "https://tourismus.regensburg.de/en/experience-discover/sightseeing-unesco-world-heritage/stone-bridge"
    },
    korean: {
      name: "\uB808\uAC90\uC2A4\uBD80\uB974\uD06C \uC11D\uAD50",
      country: "\uB3C5\uC77C",
      region: "\uB808\uAC90\uC2A4\uBD80\uB974\uD06C \uB2E4\uB274\uBE0C\uAC15",
      description: "\uB808\uAC90\uC2A4\uBD80\uB974\uD06C \uAD6C\uC2DC\uAC00\uC9C0 \uACC1\uC5D0\uC11C \uC911\uC138 \uC11D\uC870 \uC544\uCE58\uAC00 \uAE38\uAC8C \uC774\uC5B4\uC838 \uB2E4\uB274\uBE0C\uAC15\uC744 \uAC74\uB119\uB2C8\uB2E4. \uB2E4\uB9AC\uB294 \uAC15 \uAC74\uB108 \uC288\uD0C0\uD2B8\uC554\uD638\uD504\uC640 \uAD6C\uC2DC\uAC00\uC9C0\uB97C \uC787\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uB808\uAC90\uC2A4\uBD80\uB974\uD06C \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "stonebridge",
      height: 40,
      width: 113,
      spans: 8,
      terrainHeight: 0,
      actorX: 18,
      color: "#d4b078",
      motif: "walk"
    },
    scene: {
      description: "Regensburg Stone Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uB808\uAC90\uC2A4\uBD80\uB974\uD06C \uC11D\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "visegradbridge",
      name: "Mehmed Pa\u0161a Sokolovi\u0107 Bridge",
      country: "Bosnia and Herzegovina",
      code: "BIH",
      tier: "epic",
      lat: 43.78144444,
      lon: 19.288025,
      source: "https://whc.unesco.org/en/list/1260/",
      region: "Drina, Vi\u0161egrad",
      description: "Eleven masonry arches span the Drina at Vi\u0161egrad, forming an Ottoman bridge associated with architect Sinan.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1260/"
    },
    korean: {
      name: "\uBA54\uD750\uBA54\uB4DC\uD30C\uC0E4 \uC18C\uCF5C\uB85C\uBE44\uCE58 \uB2E4\uB9AC",
      country: "\uBCF4\uC2A4\uB2C8\uC544 \uD5E4\uB974\uCCB4\uACE0\uBE44\uB098",
      region: "\uBE44\uC170\uADF8\uB77C\uB4DC \uB4DC\uB9AC\uB098\uAC15",
      description: "\uBE44\uC170\uADF8\uB77C\uB4DC\uC758 \uB4DC\uB9AC\uB098\uAC15\uC744 \uC5F4\uD55C \uAC1C\uC758 \uC11D\uC870 \uC544\uCE58\uAC00 \uAC00\uB85C\uC9C0\uB974\uBA70, \uAC74\uCD95\uAC00 \uC2DC\uB09C\uACFC \uAD00\uB828\uB41C \uC624\uC2A4\uB9CC \uC2DC\uB300 \uB2E4\uB9AC\uC785\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "river",
    visual: {
      shape: "stonebridge",
      height: 45,
      width: 111,
      spans: 11,
      terrainHeight: 0,
      actorX: 96,
      color: "#839b70",
      motif: "walk"
    },
    scene: {
      description: "Mehmed Pa\u0161a Sokolovi\u0107 Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uBA54\uD750\uBA54\uB4DC\uD30C\uC0E4 \uC18C\uCF5C\uB85C\uBE44\uCE58 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "vizcayabridge",
      name: "Vizcaya Bridge",
      country: "Spain",
      code: "ESP",
      tier: "rare",
      lat: 43.323175,
      lon: -3.01683333,
      source: "https://whc.unesco.org/en/list/1217/",
      region: "Nervi\xF3n, Biscay",
      description: "A high iron frame carries a suspended transporter gondola across the Nervi\xF3n estuary without blocking shipping.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1217/"
    },
    korean: {
      name: "\uBE44\uC2A4\uCE74\uC57C \uB2E4\uB9AC",
      country: "\uC2A4\uD398\uC778",
      region: "\uBE44\uC2A4\uCE74\uC57C \uB124\uB974\uBE44\uC628\uAC15",
      description: "\uB192\uC740 \uCCA0\uC81C \uAD6C\uC870\uBB3C\uC5D0 \uB9E4\uB2E8 \uC6B4\uBC18 \uACE4\uB3CC\uB77C\uAC00 \uC120\uBC15\uC758 \uD1B5\uD589\uC744 \uB9C9\uC9C0 \uC54A\uACE0 \uB124\uB974\uBE44\uC628\uAC15 \uD558\uAD6C\uB97C \uC624\uAC11\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "river",
    visual: {
      shape: "transporter",
      height: 86,
      width: 109,
      spans: 2,
      terrainHeight: 0,
      actorX: 20,
      color: "#93a8b0",
      motif: "gondola"
    },
    scene: {
      description: "Vizcaya Bridge: A suspended gondola travels across the river.",
      descriptionKo: "\uBE44\uC2A4\uCE74\uC57C \uB2E4\uB9AC: \uB9E4\uB2EC\uB9B0 \uACE4\uB3CC\uB77C\uAC00 \uAC15\uC744 \uAC00\uB85C\uC9C0\uB985\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "alcantarabridge",
      name: "Roman Bridge of Alc\xE1ntara",
      country: "Spain",
      code: "ESP",
      tier: "rare",
      lat: 39.72247234,
      lon: -6.89229238,
      source: "https://www.spain.info/en/places-of-interest/puente-alcantara/",
      region: "Tagus, Extremadura",
      description: "Large stone arches and a central commemorative arch carry the Roman bridge over the Tagus at Alc\xE1ntara.",
      descriptionSourceName: "Spain Tourism",
      descriptionSource: "https://www.spain.info/en/places-of-interest/puente-alcantara/"
    },
    korean: {
      name: "\uC54C\uCE78\uD0C0\uB77C \uB85C\uB9C8 \uB2E4\uB9AC",
      country: "\uC2A4\uD398\uC778",
      region: "\uC5D1\uC2A4\uD2B8\uB808\uB9C8\uB450\uB77C \uD0C0\uD638\uAC15",
      description: "\uD070 \uC11D\uC870 \uC544\uCE58\uC640 \uC911\uC559\uC758 \uAE30\uB150 \uC544\uCE58\uB97C \uAC16\uCD98 \uB85C\uB9C8 \uB2E4\uB9AC\uAC00 \uC54C\uCE78\uD0C0\uB77C\uC5D0\uC11C \uD0C0\uD638\uAC15\uC744 \uAC74\uB119\uB2C8\uB2E4.",
      descriptionSourceName: "\uC2A4\uD398\uC778 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "romanbridge",
      height: 64,
      width: 110,
      spans: 6,
      terrainHeight: 0,
      actorX: 98,
      color: "#b79889",
      motif: "walk"
    },
    scene: {
      description: "Roman Bridge of Alc\xE1ntara: A visitor follows the crossing above the river.",
      descriptionKo: "\uC54C\uCE78\uD0C0\uB77C \uB85C\uB9C8 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "pulteneybridge",
      name: "Pulteney Bridge",
      country: "United Kingdom",
      code: "GBR",
      tier: "common",
      lat: 51.38305556,
      lon: -2.35777778,
      source: "https://www.visitbath.co.uk/things-to-do/pulteney-bridge-p56151",
      region: "Avon, Bath",
      description: "Shops line both sides of this three-arched bridge over the Avon, beside the curved weir in central Bath.",
      descriptionSourceName: "Visit Bath",
      descriptionSource: "https://www.visitbath.co.uk/things-to-do/pulteney-bridge-p56151"
    },
    korean: {
      name: "\uD384\uD2B8\uB2C8 \uB2E4\uB9AC",
      country: "\uC601\uAD6D",
      region: "\uBC30\uC2A4 \uC5D0\uC774\uBC88\uAC15",
      description: "\uBC30\uC2A4 \uB3C4\uC2EC \uC5D0\uC774\uBC88\uAC15\uC758 \uAD7D\uC740 \uBCF4 \uACC1\uC5D0 \uC138 \uC544\uCE58 \uB2E4\uB9AC\uAC00 \uB193\uC5EC \uC788\uACE0, \uB2E4\uB9AC \uC591\uC606\uC744 \uC0C1\uC810\uB4E4\uC774 \uCC44\uC6C1\uB2C8\uB2E4.",
      descriptionSourceName: "\uBC30\uC2A4 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "shopbridge",
      height: 43,
      width: 105,
      spans: 3,
      terrainHeight: 0,
      actorX: 20,
      color: "#c88b73",
      motif: "walk"
    },
    scene: {
      description: "Pulteney Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uD384\uD2B8\uB2C8 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "cliftonbridge",
      name: "Clifton Suspension Bridge",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 51.455,
      lon: -2.62776,
      source: "https://cliftonbridge.org.uk/",
      region: "Avon Gorge, Bristol",
      description: "Suspension chains carry a slender deck between masonry towers high over the tidal Avon Gorge. The bridge\u2019s anchorages meet the steep rocky sides of the gorge.",
      descriptionSourceName: "Clifton Suspension Bridge Trust",
      descriptionSource: "https://cliftonbridge.org.uk/"
    },
    korean: {
      name: "\uD074\uB9AC\uD504\uD134 \uD604\uC218\uAD50",
      country: "\uC601\uAD6D",
      region: "\uBE0C\uB9AC\uC2A4\uD2C0 \uC5D0\uC774\uBC88 \uD611\uACE1",
      description: "\uC870\uC218\uC758 \uC601\uD5A5\uC744 \uBC1B\uB294 \uC5D0\uC774\uBC88 \uD611\uACE1 \uC704 \uB192\uC740 \uACF3\uC5D0\uC11C \uC11D\uC870 \uC8FC\uD0D1 \uC0AC\uC774 \uD604\uC218 \uC0AC\uC2AC\uC774 \uAC00\uB290\uB2E4\uB780 \uC0C1\uD310\uC744 \uBC1B\uCE69\uB2C8\uB2E4. \uB2E4\uB9AC\uB97C \uACE0\uC815\uD558\uB294 \uC591\uCABD \uAD6C\uC870\uBB3C\uC774 \uD611\uACE1\uC758 \uAC00\uD30C\uB978 \uBC14\uC704 \uC0AC\uBA74\uACFC \uB9CC\uB0A9\uB2C8\uB2E4.",
      descriptionSourceName: "\uD074\uB9AC\uD504\uD134 \uD604\uC218\uAD50 \uC7AC\uB2E8"
    },
    surface: "river",
    visual: {
      shape: "suspension",
      height: 78,
      width: 110,
      spans: 2,
      terrainHeight: 0,
      actorX: 98,
      color: "#629b9f",
      motif: "walk"
    },
    scene: {
      description: "Clifton Suspension Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uD074\uB9AC\uD504\uD134 \uD604\uC218\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "gatesheadbridge",
      name: "Gateshead Millennium Bridge",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 54.96944444,
      lon: -1.59972222,
      source: "https://wilkinsoneyre.com/projects/gateshead-millennium-bridge",
      region: "Tyne",
      description: "A curved pedestrian deck and its supporting arch tilt together so boats can pass along the Tyne. The single sweeping arch rises above a curved walking and cycling route.",
      descriptionSourceName: "WilkinsonEyre",
      descriptionSource: "https://wilkinsoneyre.com/projects/gateshead-millennium-bridge"
    },
    korean: {
      name: "\uAC8C\uC774\uCE20\uD5E4\uB4DC \uBC00\uB808\uB2C8\uC5C4\uBE0C\uB9AC\uC9C0",
      country: "\uC601\uAD6D",
      region: "\uD0C0\uC778\uAC15",
      description: "\uAD7D\uC740 \uBCF4\uD589 \uC0C1\uD310\uACFC \uC9C0\uC9C0 \uC544\uCE58\uAC00 \uD568\uAED8 \uAE30\uC6B8\uC5B4\uC838 \uD0C0\uC778\uAC15\uC744 \uB530\uB77C \uBC30\uAC00 \uC9C0\uB098\uAC08 \uACF5\uAC04\uC744 \uB9CC\uB4ED\uB2C8\uB2E4. \uD558\uB098\uC758 \uD070 \uC544\uCE58 \uC544\uB798\uB85C \uAD7D\uC740 \uBCF4\uD589\xB7\uC790\uC804\uAC70 \uAE38\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uC70C\uD0A8\uC2A8\uC5D0\uC5B4 \uAC74\uCD95\uC0AC\uBB34\uC18C"
    },
    surface: "river",
    visual: {
      shape: "tiltingbridge",
      height: 67,
      width: 109,
      spans: 1,
      terrainHeight: 0,
      actorX: 18,
      color: "#d4b078",
      motif: "walk"
    },
    scene: {
      description: "Gateshead Millennium Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uAC8C\uC774\uCE20\uD5E4\uB4DC \uBC00\uB808\uB2C8\uC5C4\uBE0C\uB9AC\uC9C0: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "newriverbridge",
      name: "New River Gorge Bridge",
      country: "United States",
      code: "USA",
      tier: "rare",
      lat: 38.06888889,
      lon: -81.0825,
      source: "https://www.nps.gov/neri/planyourvisit/nrgbridge.htm",
      region: "New River, West Virginia",
      description: "A great steel arch supports the road high above the New River, framing the wooded gorge beneath it. The miniature keeps the steel arch below the roadway, above the river.",
      descriptionSourceName: "National Park Service",
      descriptionSource: "https://www.nps.gov/neri/planyourvisit/nrgbridge.htm"
    },
    korean: {
      name: "\uB274\uB9AC\uBC84\uACE0\uC9C0 \uB2E4\uB9AC",
      country: "\uBBF8\uAD6D",
      region: "\uC6E8\uC2A4\uD2B8\uBC84\uC9C0\uB2C8\uC544 \uB274\uB9AC\uBC84",
      description: "\uAC70\uB300\uD55C \uAC15\uCCA0 \uC544\uCE58\uAC00 \uB274\uB9AC\uBC84 \uB192\uC740 \uACF3\uC5D0\uC11C \uB3C4\uB85C\uB97C \uBC1B\uCE58\uBA70, \uADF8 \uC544\uB798\uB85C \uC232\uC774 \uC6B0\uAC70\uC9C4 \uD611\uACE1\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4. \uBAA8\uD615\uC5D0\uC11C\uB3C4 \uAC15\uACFC \uB3C4\uB85C \uC0AC\uC774\uC5D0 \uAC15\uCCA0 \uC544\uCE58\uB97C \uB193\uC558\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uBBF8\uAD6D \uAD6D\uB9BD\uACF5\uC6D0\uAD00\uB9AC\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "steelarch",
      height: 79,
      width: 113,
      spans: 1,
      terrainHeight: 0,
      actorX: 100,
      color: "#839b70",
      motif: "walk"
    },
    scene: {
      description: "New River Gorge Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uB274\uB9AC\uBC84\uACE0\uC9C0 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "howrahbridge",
      name: "Howrah Bridge",
      country: "India",
      code: "IND",
      tier: "rare",
      lat: 22.5850528,
      lon: 88.3469761,
      source: "https://www.wbtourism.gov.in/district/detail/Howrah",
      region: "Hooghly, Kolkata",
      description: "A cantilevered steel truss spans the Hooghly between Kolkata and Howrah without river piers in its main span.",
      descriptionSourceName: "West Bengal Tourism",
      descriptionSource: "https://www.wbtourism.gov.in/district/detail/Howrah"
    },
    korean: {
      name: "\uD558\uC6B0\uB77C \uB2E4\uB9AC",
      country: "\uC778\uB3C4",
      region: "\uCF5C\uCE74\uD0C0 \uD6C4\uAE00\uB9AC\uAC15",
      description: "\uCE94\uD2F8\uB808\uBC84\uC2DD \uAC15\uCCA0 \uD2B8\uB7EC\uC2A4\uAC00 \uCF5C\uCE74\uD0C0\uC640 \uD558\uC6B0\uB77C \uC0AC\uC774 \uD6C4\uAE00\uB9AC\uAC15\uC744 \uAC00\uB85C\uC9C0\uB974\uBA70 \uC8FC \uACBD\uAC04 \uC548\uC5D0\uB294 \uAC15\uBC14\uB2E5 \uAD50\uAC01\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC11C\uBCB5\uACE8 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "cantilever",
      height: 70,
      width: 111,
      spans: 2,
      terrainHeight: 0,
      actorX: 18,
      color: "#93a8b0",
      motif: "walk"
    },
    scene: {
      description: "Howrah Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uD558\uC6B0\uB77C \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "chengyangbridge",
      name: "Chengyang Wind and Rain Bridge",
      country: "China",
      code: "CHN",
      tier: "rare",
      lat: 25.9004032,
      lon: 109.6380668,
      source: "https://sjfw.mct.gov.cn/site/dataservice/culdetails?curId=10&id=35025",
      region: "Linxi River, Guangxi",
      description: "Multiple timber pavilions and covered walkways stand above stone piers across the Linxi River in a Dong community landscape.",
      descriptionSourceName: "Ministry of Culture and Tourism of China",
      descriptionSource: "https://sjfw.mct.gov.cn/site/dataservice/culdetails?curId=10&id=35025"
    },
    korean: {
      name: "\uCCAD\uC591 \uD48D\uC6B0\uAD50",
      country: "\uC911\uAD6D",
      region: "\uAD11\uC2DC \uB9B0\uC2DC\uAC15",
      description: "\uB465\uC871 \uB9C8\uC744 \uACBD\uAD00 \uC18D \uB9B0\uC2DC\uAC15\uC744 \uAC74\uB108\uB294 \uC11D\uC870 \uAD50\uAC01 \uC704\uC5D0 \uC5EC\uB7EC \uBAA9\uC870 \uB204\uAC01\uACFC \uC9C0\uBD95 \uC788\uB294 \uBCF4\uD589\uB85C\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uC911\uAD6D \uBB38\uD654\uC5EC\uC720\uBD80"
    },
    surface: "river",
    visual: {
      shape: "coveredpagoda",
      height: 50,
      width: 108,
      spans: 5,
      terrainHeight: 0,
      actorX: 99,
      color: "#b79889",
      motif: "walk"
    },
    scene: {
      description: "Chengyang Wind and Rain Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uCCAD\uC591 \uD48D\uC6B0\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "zhaozhoubridge",
      name: "Zhaozhou Bridge",
      country: "China",
      code: "CHN",
      tier: "rare",
      lat: 37.7202212,
      lon: 114.7632736,
      source: "https://www.sjz.gov.cn/english/columns/19e5d37f-e324-41da-826a-bf5ccaa8c428/201706/08/2a04ae55-b98f-4be7-8f71-a0fb4c638069.html",
      region: "Xiao River, Hebei",
      description: "A broad segmental stone arch crosses the Xiao River, with smaller open arches reducing the weight above its shoulders.",
      descriptionSourceName: "Shijiazhuang Municipal Government",
      descriptionSource: "https://www.sjz.gov.cn/english/columns/19e5d37f-e324-41da-826a-bf5ccaa8c428/201706/08/2a04ae55-b98f-4be7-8f71-a0fb4c638069.html"
    },
    korean: {
      name: "\uC790\uC624\uC800\uC6B0 \uB2E4\uB9AC",
      country: "\uC911\uAD6D",
      region: "\uD5C8\uBCA0\uC774 \uC0E4\uC624\uD5C8\uAC15",
      description: "\uC0E4\uC624\uD5C8\uAC15\uC744 \uAC74\uB108\uB294 \uB113\uACE0 \uB0AE\uC740 \uC11D\uC870 \uC544\uCE58 \uC591\uCABD \uC5B4\uAE68\uC5D0 \uC791\uC740 \uC5F4\uB9B0 \uC544\uCE58\uB4E4\uC744 \uB450\uC5B4 \uBB34\uAC8C\uB97C \uC904\uC600\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC2A4\uC790\uC8A1\uC2DC \uC778\uBBFC\uC815\uBD80"
    },
    surface: "river",
    visual: {
      shape: "openarch",
      height: 28,
      width: 111,
      spans: 1,
      terrainHeight: 0,
      actorX: 18,
      color: "#c88b73",
      motif: "walk"
    },
    scene: {
      description: "Zhaozhou Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uC790\uC624\uC800\uC6B0 \uB2E4\uB9AC: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "ludingbridge",
      name: "Luding Bridge",
      country: "China",
      code: "CHN",
      tier: "common",
      lat: 29.9144973,
      lon: 102.2302051,
      source: "https://www.luding.gov.cn/lsyg/article/682783",
      region: "Dadu River, Sichuan",
      description: "Iron chains span the Dadu River beneath a plank walkway, with anchoring structures at the two riverbanks.",
      descriptionSourceName: "Luding County Government",
      descriptionSource: "https://www.luding.gov.cn/lsyg/article/682783"
    },
    korean: {
      name: "\uB8E8\uB529\uAD50",
      country: "\uC911\uAD6D",
      region: "\uC4F0\uCD28 \uB2E4\uB450\uD5C8\uAC15",
      description: "\uB2E4\uB450\uD5C8\uAC15 \uC704\uB85C \uBED7\uC740 \uCCA0\uC81C \uC0AC\uC2AC\uC774 \uB110\uD310 \uBCF4\uD589\uB85C\uB97C \uBC1B\uCE58\uBA70 \uC591\uCABD \uAC15\uBCC0\uC5D0 \uACE0\uC815 \uAD6C\uC870\uBB3C\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uB8E8\uB529\uD604 \uC778\uBBFC\uC815\uBD80"
    },
    surface: "river",
    visual: {
      shape: "chainfootbridge",
      height: 52,
      width: 107,
      spans: 2,
      terrainHeight: 0,
      actorX: 98,
      color: "#629b9f",
      motif: "walk"
    },
    scene: {
      description: "Luding Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uB8E8\uB529\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "kintaibridge",
      name: "Kintai Bridge",
      country: "Japan",
      code: "JPN",
      tier: "rare",
      lat: 34.1676435,
      lon: 132.1783208,
      source: "https://kintaikyo.iwakuni-city.net/en/summary.html",
      region: "Nishiki River, Iwakuni",
      description: "Five timber arches cross the Nishiki River on stone piers, creating a repeated wave-like profile below Iwakuni\u2019s hills.",
      descriptionSourceName: "Iwakuni City",
      descriptionSource: "https://kintaikyo.iwakuni-city.net/en/summary.html"
    },
    korean: {
      name: "\uAE34\uD0C0\uC774\uAD50",
      country: "\uC77C\uBCF8",
      region: "\uC774\uC640\uCFE0\uB2C8 \uB2C8\uC2DC\uD0A4\uAC15",
      description: "\uC11D\uC870 \uAD50\uAC01 \uC704 \uB2E4\uC12F \uBAA9\uC870 \uC544\uCE58\uAC00 \uB2C8\uC2DC\uD0A4\uAC15\uC744 \uAC74\uB108\uBA70 \uC774\uC640\uCFE0\uB2C8 \uC0B0\uC790\uB77D \uC544\uB798 \uBB3C\uACB0 \uAC19\uC740 \uC724\uACFD\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
      descriptionSourceName: "\uC774\uC640\uCFE0\uB2C8\uC2DC"
    },
    surface: "river",
    visual: {
      shape: "fivearch",
      height: 58,
      width: 109,
      spans: 5,
      terrainHeight: 0,
      actorX: 21,
      color: "#d4b078",
      motif: "walk"
    },
    scene: {
      description: "Kintai Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uAE34\uD0C0\uC774\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "banpobridge",
      name: "Banpo Bridge Rainbow Fountain",
      country: "South Korea",
      code: "KOR",
      tier: "common",
      lat: 37.514556,
      lon: 126.9965074,
      source: "https://english.visitseoul.net/attractions/Banpodaegyo-Bridge-Moonlight-Rainbow-Fountain_/2222",
      region: "Hangang, Seoul",
      description: "Rows of water jets extend from the bridge sides toward the Han River, combining a working crossing with a large fountain.",
      descriptionSourceName: "Seoul Tourism Organization",
      descriptionSource: "https://english.visitseoul.net/attractions/Banpodaegyo-Bridge-Moonlight-Rainbow-Fountain_/2222"
    },
    korean: {
      name: "\uBC18\uD3EC\uB300\uAD50 \uB2EC\uBE5B\uBB34\uC9C0\uAC1C\uBD84\uC218",
      country: "\uB300\uD55C\uBBFC\uAD6D",
      region: "\uC11C\uC6B8 \uD55C\uAC15",
      description: "\uB2E4\uB9AC \uC591\uC606\uC758 \uBD84\uC0AC\uAD6C\uC5D0\uC11C \uD55C\uAC15\uC744 \uD5A5\uD574 \uBB3C\uC904\uAE30\uAC00 \uBED7\uC5B4 \uB098\uC640 \uAD50\uB7C9\uACFC \uD070 \uBD84\uC218\uAC00 \uD55C \uAD6C\uC870\uBB3C\uC5D0 \uC5B4\uC6B0\uB7EC\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uC11C\uC6B8\uAD00\uAD11\uC7AC\uB2E8"
    },
    surface: "river",
    visual: {
      shape: "fountainbridge",
      height: 26,
      width: 115,
      spans: 1,
      terrainHeight: 0,
      actorX: 100,
      color: "#839b70",
      motif: "fountain"
    },
    scene: {
      description: "Banpo Bridge Rainbow Fountain: Arcs of water fall from the bridge sides.",
      descriptionKo: "\uBC18\uD3EC\uB300\uAD50 \uB2EC\uBE5B\uBB34\uC9C0\uAC1C\uBD84\uC218: \uB2E4\uB9AC \uC591\uC606\uC5D0\uC11C \uBB3C\uC904\uAE30\uAC00 \uD3EC\uBB3C\uC120\uC744 \uADF8\uB9AC\uBA70 \uB5A8\uC5B4\uC9D1\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "seungilbridge",
      name: "Seungil Bridge",
      country: "South Korea",
      code: "KOR",
      tier: "common",
      lat: 38.1870538,
      lon: 127.3003263,
      source: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=66587",
      region: "Hantangang, Cheorwon",
      description: "Concrete arches carry the old crossing above the Hantangang\u2019s volcanic gorge near Cheorwon. Its construction history connects work undertaken before and after the Korean War.",
      descriptionSourceName: "Korea Tourism Organization",
      descriptionSource: "https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=66587"
    },
    korean: {
      name: "\uC2B9\uC77C\uAD50",
      country: "\uB300\uD55C\uBBFC\uAD6D",
      region: "\uCCA0\uC6D0 \uD55C\uD0C4\uAC15",
      description: "\uCCA0\uC6D0 \uADFC\uCC98 \uD55C\uD0C4\uAC15\uC758 \uD654\uC0B0 \uD611\uACE1 \uC704\uC5D0 \uCF58\uD06C\uB9AC\uD2B8 \uC544\uCE58\uAC00 \uC61B \uB2E4\uB9AC\uB97C \uBC1B\uCE58\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD55C\uAD6D\uC804\uC7C1 \uC804\uD6C4\uC5D0 \uB098\uB204\uC5B4 \uC774\uB8E8\uC5B4\uC9C4 \uACF5\uC0AC \uACFC\uC815\uC774 \uB2E4\uB9AC\uC758 \uC5ED\uC0AC\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD55C\uAD6D\uAD00\uAD11\uACF5\uC0AC"
    },
    surface: "river",
    visual: {
      shape: "concretearch",
      height: 51,
      width: 108,
      spans: 3,
      terrainHeight: 0,
      actorX: 18,
      color: "#93a8b0",
      motif: "walk"
    },
    scene: {
      description: "Seungil Bridge: A visitor follows the crossing above the river.",
      descriptionKo: "\uC2B9\uC77C\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "panamacanal",
      name: "Panama Canal",
      country: "Panama",
      code: "PAN",
      tier: "legendary",
      lat: 9.0620248,
      lon: -79.664308,
      source: "https://pancanal.com/en/",
      region: "Isthmus of Panama",
      description: "Lock chambers lift ships between sea level and an inland waterway across the isthmus, connecting Atlantic and Pacific routes.",
      descriptionSourceName: "Panama Canal Authority",
      descriptionSource: "https://pancanal.com/en/"
    },
    korean: {
      name: "\uD30C\uB098\uB9C8 \uC6B4\uD558",
      country: "\uD30C\uB098\uB9C8",
      region: "\uD30C\uB098\uB9C8 \uC9C0\uD611",
      description: "\uAC11\uBB38\uC774 \uBC30\uB97C \uD574\uC218\uBA74\uACFC \uB0B4\uB959 \uC218\uB85C \uC0AC\uC774\uB85C \uC62C\uB9AC\uACE0 \uB0B4\uB824 \uD30C\uB098\uB9C8 \uC9C0\uD611\uC744 \uAC00\uB85C\uC9C8\uB7EC \uB300\uC11C\uC591\uACFC \uD0DC\uD3C9\uC591 \uD56D\uB85C\uB97C \uC787\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD30C\uB098\uB9C8 \uC6B4\uD558\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "lock",
      height: 44,
      width: 106,
      spans: 3,
      terrainHeight: 0,
      actorX: 99,
      color: "#b79889",
      motif: "lock"
    },
    scene: {
      description: "Panama Canal: A little vessel waits between the lock gates.",
      descriptionKo: "\uD30C\uB098\uB9C8 \uC6B4\uD558: \uC791\uC740 \uBC30\uAC00 \uAC11\uBB38 \uBB38 \uC0AC\uC774\uC5D0\uC11C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "suezcanal",
      name: "Suez Canal",
      country: "Egypt",
      code: "EGY",
      tier: "common",
      lat: 30.6052767,
      lon: 32.3331003,
      source: "https://www.suezcanal.gov.eg/English/About/SuezCanal/Pages/CanalCharacteristics.aspx",
      region: "Isthmus of Suez",
      description: "A sea-level shipping canal cuts through the Suez isthmus, linking Mediterranean and Red Sea routes without lock lifts.",
      descriptionSourceName: "Suez Canal Authority",
      descriptionSource: "https://www.suezcanal.gov.eg/English/About/SuezCanal/Pages/CanalCharacteristics.aspx"
    },
    korean: {
      name: "\uC218\uC5D0\uC988 \uC6B4\uD558",
      country: "\uC774\uC9D1\uD2B8",
      region: "\uC218\uC5D0\uC988 \uC9C0\uD611",
      description: "\uD574\uC218\uBA74 \uB192\uC774\uC758 \uC218\uB85C\uAC00 \uC218\uC5D0\uC988 \uC9C0\uD611\uC744 \uAC00\uB974\uBA70 \uAC11\uBB38 \uC2B9\uAC15 \uC5C6\uC774 \uC9C0\uC911\uD574\uC640 \uD64D\uD574 \uD56D\uB85C\uB97C \uC787\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC218\uC5D0\uC988 \uC6B4\uD558\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "shipcanal",
      height: 22,
      width: 102,
      spans: 1,
      terrainHeight: 0,
      actorX: 19,
      color: "#c88b73",
      motif: "canalship"
    },
    scene: {
      description: "Suez Canal: A small ship proceeds between the canal banks.",
      descriptionKo: "\uC218\uC5D0\uC988 \uC6B4\uD558: \uC791\uC740 \uBC30\uAC00 \uC6B4\uD558\uC758 \uC591\uCABD \uB451 \uC0AC\uC774\uB85C \uB098\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "corinthcanal",
      name: "Corinth Canal",
      country: "Greece",
      code: "GRC",
      tier: "common",
      lat: 37.9341193,
      lon: 22.9846912,
      source: "https://corinthcanal.com/",
      region: "Isthmus of Corinth",
      description: "A narrow straight waterway cuts between steep rock walls across the isthmus separating the Peloponnese from mainland Greece.",
      descriptionSourceName: "Corinth Canal Authority",
      descriptionSource: "https://corinthcanal.com/"
    },
    korean: {
      name: "\uCF54\uB9B0\uD1A0\uC2A4 \uC6B4\uD558",
      country: "\uADF8\uB9AC\uC2A4",
      region: "\uCF54\uB9B0\uD1A0\uC2A4 \uC9C0\uD611",
      description: "\uD3A0\uB85C\uD3F0\uB124\uC18C\uC2A4\uC640 \uADF8\uB9AC\uC2A4 \uBCF8\uD1A0 \uC0AC\uC774 \uC9C0\uD611\uC744 \uAC00\uD30C\uB978 \uBC14\uC704\uBCBD \uC0AC\uC774\uC758 \uC881\uACE0 \uACE7\uC740 \uC218\uB85C\uAC00 \uAC00\uB85C\uC9C0\uB985\uB2C8\uB2E4.",
      descriptionSourceName: "\uCF54\uB9B0\uD1A0\uC2A4 \uC6B4\uD558\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "cutcanal",
      height: 66,
      width: 103,
      spans: 1,
      terrainHeight: 0,
      actorX: 98,
      color: "#629b9f",
      motif: "canalship"
    },
    scene: {
      description: "Corinth Canal: A small ship proceeds between the canal banks.",
      descriptionKo: "\uCF54\uB9B0\uD1A0\uC2A4 \uC6B4\uD558: \uC791\uC740 \uBC30\uAC00 \uC6B4\uD558\uC758 \uC591\uCABD \uB451 \uC0AC\uC774\uB85C \uB098\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "kielcanal",
      name: "Kiel Canal",
      country: "Germany",
      code: "DEU",
      tier: "common",
      lat: 54.2081189,
      lon: 9.5721775,
      source: "https://initiative-kiel-canal.de/en/technical-data/",
      region: "Schleswig-Holstein",
      description: "An inland shipping canal links North Sea and Baltic approaches, with locks at its ends and bridges above the channel.",
      descriptionSourceName: "Initiative Kiel Canal",
      descriptionSource: "https://initiative-kiel-canal.de/en/technical-data/"
    },
    korean: {
      name: "\uD0AC \uC6B4\uD558",
      country: "\uB3C5\uC77C",
      region: "\uC290\uB808\uC2A4\uBE44\uD788\uD640\uC288\uD0C0\uC778",
      description: "\uB0B4\uB959 \uC218\uB85C\uAC00 \uBD81\uD574\uC640 \uBC1C\uD2B8\uD574 \uD56D\uB85C\uB97C \uC787\uACE0, \uC6B4\uD558 \uC591\uB05D\uC758 \uAC11\uBB38\uACFC \uC218\uB85C \uC704 \uB2E4\uB9AC\uB4E4\uC774 \uC120\uBC15 \uD1B5\uD589\uC744 \uB3D5\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uD0AC \uC6B4\uD558 \uD611\uD68C"
    },
    surface: "river",
    visual: {
      shape: "shipcanal",
      height: 41,
      width: 108,
      spans: 2,
      terrainHeight: 0,
      actorX: 20,
      color: "#d4b078",
      motif: "canalship"
    },
    scene: {
      description: "Kiel Canal: A small ship proceeds between the canal banks.",
      descriptionKo: "\uD0AC \uC6B4\uD558: \uC791\uC740 \uBC30\uAC00 \uC6B4\uD558\uC758 \uC591\uCABD \uB451 \uC0AC\uC774\uB85C \uB098\uC544\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "canaldumidi",
      name: "Canal du Midi",
      country: "France",
      code: "FRA",
      tier: "rare",
      lat: 43.61,
      lon: 1.416,
      source: "https://whc.unesco.org/en/list/770/",
      region: "Occitanie",
      description: "Canal channels, locks, aqueducts and bridges form a historic engineered waterway across southern France.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/770/"
    },
    korean: {
      name: "\uBBF8\uB514 \uC6B4\uD558",
      country: "\uD504\uB791\uC2A4",
      region: "\uC625\uC2DC\uD0C0\uB2C8",
      description: "\uD504\uB791\uC2A4 \uB0A8\uBD80\uB97C \uAC00\uB85C\uC9C0\uB974\uB294 \uC5ED\uC0AC\uC801\uC778 \uC218\uB85C\uC5D0 \uC6B4\uD558\uC640 \uAC11\uBB38, \uC218\uB85C\uAD50\uC640 \uB2E4\uB9AC\uAC00 \uD558\uB098\uC758 \uC2DC\uC124\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "river",
    visual: {
      shape: "lock",
      height: 44,
      width: 104,
      spans: 4,
      terrainHeight: 0,
      actorX: 96,
      color: "#839b70",
      motif: "lock"
    },
    scene: {
      description: "Canal du Midi: A little vessel waits between the lock gates.",
      descriptionKo: "\uBBF8\uB514 \uC6B4\uD558: \uC791\uC740 \uBC30\uAC00 \uAC11\uBB38 \uBB38 \uC0AC\uC774\uC5D0\uC11C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "canalcentre",
      name: "Canal du Centre Boat Lifts",
      country: "Belgium",
      code: "BEL",
      tier: "epic",
      lat: 50.48111,
      lon: 4.13722,
      source: "https://whc.unesco.org/en/list/856/",
      region: "Hainaut",
      description: "Four historic hydraulic boat lifts raise and lower vessels between canal levels in Belgium\u2019s industrial waterway landscape.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/856/"
    },
    korean: {
      name: "\uC0C1\uD2B8\uB974 \uC6B4\uD558 \uBCF4\uD2B8 \uB9AC\uD504\uD2B8",
      country: "\uBCA8\uAE30\uC5D0",
      region: "\uC5D0\uB178",
      description: "\uBCA8\uAE30\uC5D0\uC758 \uC0B0\uC5C5 \uC218\uB85C \uACBD\uAD00 \uC18D \uC5ED\uC0AC\uC801\uC778 \uC218\uC555\uC2DD \uBCF4\uD2B8 \uB9AC\uD504\uD2B8 \uB124 \uACF3\uC774 \uBC30\uB97C \uC6B4\uD558\uC758 \uC11C\uB85C \uB2E4\uB978 \uB192\uC774\uB85C \uC62E\uAE41\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    surface: "river",
    visual: {
      shape: "boatlift",
      height: 78,
      width: 107,
      spans: 2,
      terrainHeight: 0,
      actorX: 20,
      color: "#93a8b0",
      motif: "lift"
    },
    scene: {
      description: "Canal du Centre Boat Lifts: A boat container rises beside the canal frame.",
      descriptionKo: "\uC0C1\uD2B8\uB974 \uC6B4\uD558 \uBCF4\uD2B8 \uB9AC\uD504\uD2B8: \uBC30\uB97C \uB2F4\uC740 \uC6B4\uBC18\uD568\uC774 \uC6B4\uD558 \uAD6C\uC870\uBB3C \uACC1\uC5D0\uC11C \uC62C\uB77C\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "falkirkwheel",
      name: "Falkirk Wheel",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 56.0003559,
      lon: -3.841725,
      source: "https://www.scottishcanals.co.uk/visit/canals/visit-the-forth-clyde-canal/attractions/the-falkirk-wheel",
      region: "Forth and Clyde Canal",
      description: "Two water-filled gondolas rotate around a central axle to move boats between canal levels near Falkirk.",
      descriptionSourceName: "Scottish Canals",
      descriptionSource: "https://www.scottishcanals.co.uk/visit/canals/visit-the-forth-clyde-canal/attractions/the-falkirk-wheel"
    },
    korean: {
      name: "\uD3F4\uCEE4\uD06C \uD720",
      country: "\uC601\uAD6D",
      region: "\uD3EC\uC2A4\uC564\uB4DC\uD074\uB77C\uC774\uB4DC \uC6B4\uD558",
      description: "\uBB3C\uC744 \uCC44\uC6B4 \uB450 \uACE4\uB3CC\uB77C\uAC00 \uC911\uC2EC\uCD95\uC744 \uB3CC\uC544 \uD3F4\uCEE4\uD06C \uC778\uADFC \uC6B4\uD558\uC758 \uC11C\uB85C \uB2E4\uB978 \uB192\uC774 \uC0AC\uC774\uB85C \uBC30\uB97C \uC62E\uAE41\uB2C8\uB2E4.",
      descriptionSourceName: "\uC2A4\uCF54\uD2C0\uB79C\uB4DC \uC6B4\uD558\uAD00\uB9AC\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "rotatinglift",
      height: 65,
      width: 106,
      spans: 2,
      terrainHeight: 0,
      actorX: 97,
      color: "#b79889",
      motif: "wheel"
    },
    scene: {
      description: "Falkirk Wheel: The paired boat containers turn around their axle.",
      descriptionKo: "\uD3F4\uCEE4\uD06C \uD720: \uD55C \uC30D\uC758 \uBC30 \uC6B4\uBC18\uD568\uC774 \uC911\uC2EC\uCD95\uC744 \uB3D5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "andertonlift",
      name: "Anderton Boat Lift",
      country: "United Kingdom",
      code: "GBR",
      tier: "rare",
      lat: 53.2729693,
      lon: -2.53069879,
      source: "https://canalrivertrust.org.uk/things-to-do/museums-and-attractions/anderton-boat-lift-and-visitor-centre-cheshire",
      region: "River Weaver",
      description: "A pair of water-filled caissons lifts boats between the River Weaver and the higher Trent and Mersey Canal.",
      descriptionSourceName: "Canal and River Trust",
      descriptionSource: "https://canalrivertrust.org.uk/things-to-do/museums-and-attractions/anderton-boat-lift-and-visitor-centre-cheshire"
    },
    korean: {
      name: "\uC564\uB354\uD134 \uBCF4\uD2B8 \uB9AC\uD504\uD2B8",
      country: "\uC601\uAD6D",
      region: "\uC704\uBC84\uAC15",
      description: "\uBB3C\uC744 \uCC44\uC6B4 \uD55C \uC30D\uC758 \uCF00\uC774\uC2A8\uC774 \uC704\uBC84\uAC15\uACFC \uB354 \uB192\uC740 \uD2B8\uB80C\uD2B8\uC564\uB4DC\uBA38\uC9C0 \uC6B4\uD558 \uC0AC\uC774\uB85C \uBC30\uB97C \uB4E4\uC5B4 \uC62C\uB9BD\uB2C8\uB2E4.",
      descriptionSourceName: "\uC601\uAD6D \uC6B4\uD558\uD558\uCC9C\uC7AC\uB2E8"
    },
    surface: "river",
    visual: {
      shape: "boatlift",
      height: 49,
      width: 105,
      spans: 5,
      terrainHeight: 0,
      actorX: 19,
      color: "#c88b73",
      motif: "lift"
    },
    scene: {
      description: "Anderton Boat Lift: A boat container rises beside the canal frame.",
      descriptionKo: "\uC564\uB354\uD134 \uBCF4\uD2B8 \uB9AC\uD504\uD2B8: \uBC30\uB97C \uB2F4\uC740 \uC6B4\uBC18\uD568\uC774 \uC6B4\uD558 \uAD6C\uC870\uBB3C \uACC1\uC5D0\uC11C \uC62C\uB77C\uAC11\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bingleylocks",
      name: "Bingley Five Rise Locks",
      country: "United Kingdom",
      code: "GBR",
      tier: "common",
      lat: 53.856254,
      lon: -1.8381464,
      source: "https://canalrivertrust.org.uk/news-and-views/media-centre/filming-and-photography/our-filming-and-photography-locations/bingley-five-rise-locks-leeds-and-liverpool-canal",
      region: "Leeds and Liverpool Canal",
      description: "Five adjoining lock chambers form a steep staircase for boats on the Leeds and Liverpool Canal. The upper gate of one chamber also serves the chamber above it.",
      descriptionSourceName: "Canal and River Trust",
      descriptionSource: "https://canalrivertrust.org.uk/news-and-views/media-centre/filming-and-photography/our-filming-and-photography-locations/bingley-five-rise-locks-leeds-and-liverpool-canal"
    },
    korean: {
      name: "\uBE59\uB9AC \uD30C\uC774\uBE0C\uB77C\uC774\uC988 \uAC11\uBB38",
      country: "\uC601\uAD6D",
      region: "\uB9AC\uC988\uC564\uB4DC\uB9AC\uBC84\uD480 \uC6B4\uD558",
      description: "\uB9AC\uC988\uC564\uB4DC\uB9AC\uBC84\uD480 \uC6B4\uD558\uC5D0\uC11C \uC11C\uB85C \uB9DE\uBD99\uC740 \uAC11\uBB38\uC2E4 \uB2E4\uC12F \uAC1C\uAC00 \uBC30\uB97C \uC62E\uAE30\uB294 \uAC00\uD30C\uB978 \uACC4\uB2E8\uC744 \uC774\uB8F9\uB2C8\uB2E4. \uD55C \uAC11\uBB38\uC2E4\uC758 \uC717\uBB38\uC744 \uBC14\uB85C \uC704 \uAC11\uBB38\uC2E4\uC774 \uD568\uAED8 \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC601\uAD6D \uC6B4\uD558\uD558\uCC9C\uC7AC\uB2E8"
    },
    surface: "river",
    visual: {
      shape: "stairlock",
      height: 36,
      width: 103,
      spans: 1,
      terrainHeight: 0,
      actorX: 99,
      color: "#629b9f",
      motif: "lock"
    },
    scene: {
      description: "Bingley Five Rise Locks: A little vessel waits between the lock gates.",
      descriptionKo: "\uBE59\uB9AC \uD30C\uC774\uBE0C\uB77C\uC774\uC988 \uAC11\uBB38: \uC791\uC740 \uBC30\uAC00 \uAC11\uBB38 \uBB38 \uC0AC\uC774\uC5D0\uC11C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "briareaqueduct",
      name: "Briare Aqueduct",
      country: "France",
      code: "FRA",
      tier: "common",
      lat: 47.6311883,
      lon: 2.734394,
      source: "https://www.terresdeloireetcanaux.com/patrimoine-culturel/pont-canal-de-briare/",
      region: "Loire, Briare",
      description: "An iron water trough carries canal boats above the Loire, with decorated lamp posts lining the aqueduct\u2019s walkway.",
      descriptionSourceName: "Briare Tourist Office",
      descriptionSource: "https://www.terresdeloireetcanaux.com/patrimoine-culturel/pont-canal-de-briare/"
    },
    korean: {
      name: "\uBE0C\uB9AC\uC544\uB974 \uC218\uB85C\uAD50",
      country: "\uD504\uB791\uC2A4",
      region: "\uBE0C\uB9AC\uC544\uB974 \uB8E8\uC544\uB974\uAC15",
      description: "\uCCA0\uC81C \uC218\uB85C\uAC00 \uB8E8\uC544\uB974\uAC15 \uC704\uB85C \uC6B4\uD558 \uC120\uBC15\uC744 \uB098\uB974\uACE0, \uC218\uB85C\uAD50 \uBCF4\uD589\uB85C\uC5D0\uB294 \uC7A5\uC2DD \uAC00\uB85C\uB4F1\uC774 \uB298\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uBE0C\uB9AC\uC544\uB974 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "waterbridge",
      height: 53,
      width: 109,
      spans: 3,
      terrainHeight: 0,
      actorX: 18,
      color: "#d4b078",
      motif: "walk"
    },
    scene: {
      description: "Briare Aqueduct: A visitor follows the crossing above the river.",
      descriptionKo: "\uBE0C\uB9AC\uC544\uB974 \uC218\uB85C\uAD50: \uAD00\uB78C\uAC1D\uC774 \uAC15 \uC704\uC758 \uB2E4\uB9AC\uB97C \uB530\uB77C \uAC77\uC2B5\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "gotacanal",
      name: "G\xF6ta Canal",
      country: "Sweden",
      code: "SWE",
      tier: "common",
      lat: 58.5587698,
      lon: 15.0965535,
      source: "https://www.gotakanal.se/en",
      region: "G\xF6ta Canal",
      description: "Locks and hand-worked waterways connect inland stretches across southern Sweden, represented by a stepped lock and towpath.",
      descriptionSourceName: "G\xF6ta Canal Company",
      descriptionSource: "https://www.gotakanal.se/en"
    },
    korean: {
      name: "\uC608\uD0C0 \uC6B4\uD558",
      country: "\uC2A4\uC6E8\uB374",
      region: "\uC608\uD0C0 \uC6B4\uD558",
      description: "\uC2A4\uC6E8\uB374 \uB0A8\uBD80\uC758 \uB0B4\uB959 \uAD6C\uAC04\uB4E4\uC744 \uAC11\uBB38\uACFC \uC218\uB85C\uAC00 \uC774\uC73C\uBA70, \uBAA8\uD615\uC740 \uACC4\uB2E8\uC2DD \uAC11\uBB38\uACFC \uC608\uC778\uB85C\uB97C \uD45C\uD604\uD569\uB2C8\uB2E4.",
      descriptionSourceName: "\uC608\uD0C0 \uC6B4\uD558 \uC6B4\uC601\uC0AC"
    },
    surface: "river",
    visual: {
      shape: "lock",
      height: 38,
      width: 101,
      spans: 3,
      terrainHeight: 0,
      actorX: 97,
      color: "#839b70",
      motif: "lock"
    },
    scene: {
      description: "G\xF6ta Canal: A little vessel waits between the lock gates.",
      descriptionKo: "\uC608\uD0C0 \uC6B4\uD558: \uC791\uC740 \uBC30\uAC00 \uAC11\uBB38 \uBB38 \uC0AC\uC774\uC5D0\uC11C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "rhinefalls",
      name: "Rhine Falls",
      country: "Switzerland",
      code: "CHE",
      tier: "common",
      lat: 47.6783615,
      lon: 8.6148706,
      source: "https://rheinfall.ch/en/",
      region: "Rhine, Schaffhausen",
      description: "The Rhine tumbles over a broad rocky ledge near Schaffhausen, splitting around rocks that stand within the falling water.",
      descriptionSourceName: "Rhine Falls Association",
      descriptionSource: "https://rheinfall.ch/en/"
    },
    korean: {
      name: "\uB77C\uC778 \uD3ED\uD3EC",
      country: "\uC2A4\uC704\uC2A4",
      region: "\uC0E4\uD504\uD558\uC6B0\uC820 \uB77C\uC778\uAC15",
      description: "\uC0E4\uD504\uD558\uC6B0\uC820 \uC778\uADFC\uC5D0\uC11C \uB77C\uC778\uAC15\uC774 \uB113\uC740 \uBC14\uC704 \uD131\uC744 \uB118\uC5B4 \uC3DF\uC544\uC9C0\uBA70, \uD3ED\uD3EC \uD55C\uAC00\uC6B4\uB370 \uC19F\uC740 \uBC14\uC704\uB97C \uAC08\uB77C \uD750\uB985\uB2C8\uB2E4.",
      descriptionSourceName: "\uB77C\uC778 \uD3ED\uD3EC \uD611\uD68C"
    },
    surface: "river",
    visual: {
      shape: "widefalls",
      height: 38,
      width: 111,
      spans: 3,
      terrainHeight: 0,
      actorX: 20,
      color: "#93a8b0",
      motif: "cascade"
    },
    scene: {
      description: "Rhine Falls: Foam descends along the different river ledges.",
      descriptionKo: "\uB77C\uC778 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "gullfoss",
      name: "Gullfoss",
      country: "Iceland",
      code: "ISL",
      tier: "rare",
      lat: 64.327316,
      lon: -20.1191026,
      source: "https://ust.is/english/visiting-iceland/protected-areas/south/gullfoss/",
      region: "Hv\xEDt\xE1",
      description: "The Hv\xEDt\xE1 drops in two stages before entering a narrow canyon, making a stepped waterfall in southern Iceland.",
      descriptionSourceName: "Environment Agency of Iceland",
      descriptionSource: "https://ust.is/english/visiting-iceland/protected-areas/south/gullfoss/"
    },
    korean: {
      name: "\uAD74\uD3EC\uC2A4",
      country: "\uC544\uC774\uC2AC\uB780\uB4DC",
      region: "\uD750\uBE44\uD0C0\uAC15",
      description: "\uC544\uC774\uC2AC\uB780\uB4DC \uB0A8\uBD80\uC5D0\uC11C \uD750\uBE44\uD0C0\uAC15\uC774 \uB450 \uB2E8\uC73C\uB85C \uB5A8\uC5B4\uC9C4 \uB4A4 \uC881\uC740 \uD611\uACE1\uC73C\uB85C \uB4E4\uC5B4\uAC00 \uACC4\uB2E8\uD615 \uD3ED\uD3EC\uB97C \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uC544\uC774\uC2AC\uB780\uB4DC \uD658\uACBD\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "tieredfalls",
      height: 63,
      width: 108,
      spans: 2,
      terrainHeight: 0,
      actorX: 98,
      color: "#b79889",
      motif: "cascade"
    },
    scene: {
      description: "Gullfoss: Foam descends along the different river ledges.",
      descriptionKo: "\uAD74\uD3EC\uC2A4: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "dettifoss",
      name: "Dettifoss",
      country: "Iceland",
      code: "ISL",
      tier: "common",
      lat: 65.8143509,
      lon: -16.3844911,
      source: "https://www.vatnajokulsthjodgardur.is/en/areas/jokulsargljufur",
      region: "J\xF6kuls\xE1 \xE1 Fj\xF6llum",
      description: "A powerful broad waterfall pours into the J\xF6kuls\xE1rglj\xFAfur canyon, carrying glacier-fed river water through dark rock.",
      descriptionSourceName: "Vatnaj\xF6kull National Park",
      descriptionSource: "https://www.vatnajokulsthjodgardur.is/en/areas/jokulsargljufur"
    },
    korean: {
      name: "\uB370\uD2F0\uD3EC\uC2A4",
      country: "\uC544\uC774\uC2AC\uB780\uB4DC",
      region: "\uC694\uCFE8\uC0AC\uC544\uD53C\uC69C\uB8F8\uAC15",
      description: "\uBE59\uD558\uC5D0\uC11C \uD758\uB7EC\uC628 \uAC15\uBB3C\uC774 \uC5B4\uB450\uC6B4 \uBC14\uC704\uB97C \uC9C0\uB098 \uC694\uCFE8\uC0AC\uB974\uAE00\uB9AC\uC6B0\uD478\uB974 \uD611\uACE1\uC73C\uB85C \uB113\uACE0 \uD798\uCC28\uAC8C \uC3DF\uC544\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uBC14\uD2B8\uB098\uC694\uCFE8 \uAD6D\uB9BD\uACF5\uC6D0"
    },
    surface: "river",
    visual: {
      shape: "widefalls",
      height: 68,
      width: 111,
      spans: 1,
      terrainHeight: 0,
      actorX: 18,
      color: "#c88b73",
      motif: "cascade"
    },
    scene: {
      description: "Dettifoss: Foam descends along the different river ledges.",
      descriptionKo: "\uB370\uD2F0\uD3EC\uC2A4: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "kaieteur",
      name: "Kaieteur Falls",
      country: "Guyana",
      code: "GUY",
      tier: "epic",
      lat: 5.1749417,
      lon: -59.4806521,
      source: "https://guyanatourism.com/kaieteur-falls/",
      region: "Potaro River",
      description: "The Potaro River drops in a single great plunge over a sandstone escarpment surrounded by forest. The miniature keeps the unbroken drop separate from the surrounding cliff.",
      descriptionSourceName: "Guyana Tourism Authority",
      descriptionSource: "https://guyanatourism.com/kaieteur-falls/"
    },
    korean: {
      name: "\uCE74\uC774\uC5D0\uD22C\uB974 \uD3ED\uD3EC",
      country: "\uAC00\uC774\uC544\uB098",
      region: "\uD3EC\uD0C0\uB85C\uAC15",
      description: "\uC232\uC73C\uB85C \uB458\uB7EC\uC2F8\uC778 \uC0AC\uC554 \uC808\uBCBD\uC5D0\uC11C \uD3EC\uD0C0\uB85C\uAC15\uC774 \uD55C \uBC88\uC5D0 \uD06C\uAC8C \uB5A8\uC5B4\uC838 \uD3ED\uD3EC\uB97C \uC774\uB8F9\uB2C8\uB2E4. \uBAA8\uD615\uC5D0\uC11C\uB294 \uB04A\uAE30\uC9C0 \uC54A\uACE0 \uB5A8\uC5B4\uC9C0\uB294 \uBB3C\uC904\uAE30\uC640 \uC8FC\uBCC0 \uC808\uBCBD\uC744 \uAD6C\uBD84\uD588\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uAC00\uC774\uC544\uB098 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "plungefalls",
      height: 91,
      width: 69,
      spans: 1,
      terrainHeight: 0,
      actorX: 100,
      color: "#629b9f",
      motif: "cascade"
    },
    scene: {
      description: "Kaieteur Falls: Foam descends along the different river ledges.",
      descriptionKo: "\uCE74\uC774\uC5D0\uD22C\uB974 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "khonefalls",
      name: "Khone Phapheng Falls",
      country: "Laos",
      code: "LAO",
      tier: "common",
      lat: 13.9597676,
      lon: 105.986526,
      source: "https://www.tourismlaos.org/waterfalls/",
      region: "Mekong, Champasak",
      description: "The Mekong spreads through rocky channels and powerful rapids at Khone Phapheng near the southern border of Laos.",
      descriptionSourceName: "Laos Tourism",
      descriptionSource: "https://www.tourismlaos.org/waterfalls/"
    },
    korean: {
      name: "\uCF58\uD30C\uD3AD \uD3ED\uD3EC",
      country: "\uB77C\uC624\uC2A4",
      region: "\uCC38\uD30C\uC0AD \uBA54\uCF69\uAC15",
      description: "\uB77C\uC624\uC2A4 \uB0A8\uCABD \uAD6D\uACBD \uAC00\uAE4C\uC6B4 \uCF58\uD30C\uD3AD\uC5D0\uC11C \uBA54\uCF69\uAC15\uC774 \uBC14\uC704 \uC218\uB85C\uC640 \uAC70\uC13C \uAE09\uB958\uB85C \uB113\uAC8C \uAC08\uB77C\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uB77C\uC624\uC2A4 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "rapids",
      height: 35,
      width: 113,
      spans: 6,
      terrainHeight: 0,
      actorX: 20,
      color: "#d4b078",
      motif: "cascade"
    },
    scene: {
      description: "Khone Phapheng Falls: Foam descends along the different river ledges.",
      descriptionKo: "\uCF58\uD30C\uD3AD \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "bangiocfalls",
      name: "Ban Gioc Waterfall",
      country: "Vietnam",
      code: "VNM",
      tier: "rare",
      lat: 22.8542722,
      lon: 106.7233149,
      source: "https://vietnam.travel/things-to-do/ban-gioc-waterfall-majestic-beauty-northern-border/",
      region: "Qu\xE2y S\u01A1n River, Cao Bang",
      description: "Broad tiers of water fall among green karst hills on the Qu\xE2y S\u01A1n River at the Vietnam\u2013China border. The miniature uses separate rock shelves for the stepped streams.",
      descriptionSourceName: "Vietnam National Authority of Tourism",
      descriptionSource: "https://vietnam.travel/things-to-do/ban-gioc-waterfall-majestic-beauty-northern-border/"
    },
    korean: {
      name: "\uBC18\uC871 \uD3ED\uD3EC",
      country: "\uBCA0\uD2B8\uB0A8",
      region: "\uAE4C\uC624\uBC29 \uAFB8\uC5B4\uC774\uC120\uAC15",
      description: "\uBCA0\uD2B8\uB0A8\uACFC \uC911\uAD6D \uAD6D\uACBD\uC758 \uAFB8\uC5B4\uC774\uC120\uAC15\uC5D0\uC11C \uD478\uB978 \uCE74\uB974\uC2A4\uD2B8 \uC5B8\uB355 \uC0AC\uC774\uB85C \uB113\uC740 \uBB3C\uC904\uAE30\uAC00 \uC5EC\uB7EC \uB2E8\uC744 \uC774\uB8E8\uC5B4 \uB5A8\uC5B4\uC9D1\uB2C8\uB2E4. \uBAA8\uD615\uC5D0\uC11C\uB294 \uCE35\uCE35\uC774 \uD750\uB974\uB294 \uBB3C\uC904\uAE30\uB9C8\uB2E4 \uBC14\uC704 \uD131\uC744 \uB530\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uBCA0\uD2B8\uB0A8 \uAD6D\uAC00\uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "tieredfalls",
      height: 54,
      width: 109,
      spans: 3,
      terrainHeight: 0,
      actorX: 96,
      color: "#839b70",
      motif: "cascade"
    },
    scene: {
      description: "Ban Gioc Waterfall: Foam descends along the different river ledges.",
      descriptionKo: "\uBC18\uC871 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "huangguoshu",
      name: "Huangguoshu Waterfall",
      country: "China",
      code: "CHN",
      tier: "common",
      lat: 25.992,
      lon: 105.666,
      source: "https://whc.unesco.org/en/tentativelists/6380/",
      region: "Baishui River, Guizhou",
      description: "A wide curtain of river water falls over a limestone ledge, with a passage known for running behind the waterfall.",
      descriptionSourceName: "UNESCO Tentative Lists",
      descriptionSource: "https://whc.unesco.org/en/tentativelists/6380/"
    },
    korean: {
      name: "\uD669\uAD88\uC218 \uD3ED\uD3EC",
      country: "\uC911\uAD6D",
      region: "\uAD6C\uC774\uC800\uC6B0 \uBC14\uC774\uC218\uC774\uAC15",
      description: "\uB113\uC740 \uAC15\uBB3C\uC774 \uC11D\uD68C\uC554 \uD131\uC5D0\uC11C \uC7A5\uB9C9\uCC98\uB7FC \uC3DF\uC544\uC9C0\uBA70, \uD3ED\uD3EC \uB4A4\uCABD\uC73C\uB85C \uC774\uC5B4\uC9C4 \uD1B5\uB85C\uAC00 \uC54C\uB824\uC838 \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0 \uC7A0\uC815\uBAA9\uB85D"
    },
    surface: "river",
    visual: {
      shape: "curtainfalls",
      height: 66,
      width: 106,
      spans: 1,
      terrainHeight: 0,
      actorX: 18,
      color: "#93a8b0",
      motif: "cascade"
    },
    scene: {
      description: "Huangguoshu Waterfall: Foam descends along the different river ledges.",
      descriptionKo: "\uD669\uAD88\uC218 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "shifenfalls",
      name: "Shifen Waterfall",
      country: "Taiwan",
      code: "TWN",
      tier: "common",
      lat: 25.04897,
      lon: 121.78746,
      source: "https://newtaipei.travel/en/Attractions/Detail/111592",
      region: "Keelung River, Pingxi",
      description: "The Keelung River spreads across a curved rock ledge to form a broad horseshoe-shaped waterfall near Shifen.",
      descriptionSourceName: "New Taipei City Tourism and Travel Department",
      descriptionSource: "https://newtaipei.travel/en/Attractions/Detail/111592"
    },
    korean: {
      name: "\uC2A4\uD380 \uD3ED\uD3EC",
      country: "\uB300\uB9CC",
      region: "\uD551\uC2DC \uC9C0\uB8FD\uAC15",
      description: "\uC2A4\uD380 \uC778\uADFC\uC5D0\uC11C \uC9C0\uB8FD\uAC15\uC774 \uAD7D\uC740 \uBC14\uC704 \uD131 \uC704\uB85C \uD3BC\uCCD0\uC838 \uB113\uC740 \uB9D0\uAD7D \uBAA8\uC591 \uD3ED\uD3EC\uB97C \uC774\uB8F9\uB2C8\uB2E4.",
      descriptionSourceName: "\uC2E0\uBCA0\uC774\uC2DC \uAD00\uAD11\uC5EC\uD589\uAD6D"
    },
    surface: "river",
    visual: {
      shape: "horseshoefalls",
      height: 38,
      width: 100,
      spans: 4,
      terrainHeight: 0,
      actorX: 98,
      color: "#b79889",
      motif: "cascade"
    },
    scene: {
      description: "Shifen Waterfall: Foam descends along the different river ledges.",
      descriptionKo: "\uC2A4\uD380 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "hukoufalls",
      name: "Hukou Waterfall",
      country: "China",
      code: "CHN",
      tier: "common",
      lat: 36.14722222,
      lon: 110.44388889,
      source: "https://english.www.gov.cn/news/202408/12/content_WS66b96ebbc6d0868f4e8e9da0.html",
      region: "Yellow River, Shanxi\u2013Shaanxi",
      description: "The Yellow River narrows sharply through a rocky opening, creating a forceful waterfall between Shanxi and Shaanxi.",
      descriptionSourceName: "State Council of China",
      descriptionSource: "https://english.www.gov.cn/news/202408/12/content_WS66b96ebbc6d0868f4e8e9da0.html"
    },
    korean: {
      name: "\uD6C4\uCEE4\uC6B0 \uD3ED\uD3EC",
      country: "\uC911\uAD6D",
      region: "\uC0B0\uC2DC\xB7\uC0B0\uC2DC\uC131 \uACBD\uACC4 \uD669\uD5C8\uAC15",
      description: "\uC0B0\uC2DC\uC131\uACFC \uC0B0\uC2DC\uC131 \uC0AC\uC774\uC5D0\uC11C \uD669\uD5C8\uAC15\uC774 \uBC14\uC704 \uD2C8\uC73C\uB85C \uAE09\uACA9\uD788 \uC881\uC544\uC9C0\uBA70 \uD798\uCC2C \uD3ED\uD3EC\uB97C \uB9CC\uB4ED\uB2C8\uB2E4.",
      descriptionSourceName: "\uC911\uAD6D \uAD6D\uBB34\uC6D0"
    },
    surface: "river",
    visual: {
      shape: "gorgefalls",
      height: 58,
      width: 98,
      spans: 1,
      terrainHeight: 0,
      actorX: 20,
      color: "#c88b73",
      motif: "cascade"
    },
    scene: {
      description: "Hukou Waterfall: Foam descends along the different river ledges.",
      descriptionKo: "\uD6C4\uCEE4\uC6B0 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "athirappilly",
      name: "Athirappilly Falls",
      country: "India",
      code: "IND",
      tier: "common",
      lat: 10.28472222,
      lon: 76.56861111,
      source: "https://www.keralatourism.org/destination/athirappalli-vazhachal-waterfalls/79/",
      region: "Chalakudy River, Kerala",
      description: "The Chalakudy River drops over a broad rocky face in forested Kerala, breaking into several white streams.",
      descriptionSourceName: "Kerala Tourism",
      descriptionSource: "https://www.keralatourism.org/destination/athirappalli-vazhachal-waterfalls/79/"
    },
    korean: {
      name: "\uC544\uD2F0\uB77C\uD544\uB9AC \uD3ED\uD3EC",
      country: "\uC778\uB3C4",
      region: "\uCF00\uB784\uB77C \uCC30\uB77C\uCFE0\uB514\uAC15",
      description: "\uC232\uC774 \uC6B0\uAC70\uC9C4 \uCF00\uB784\uB77C\uC5D0\uC11C \uCC30\uB77C\uCFE0\uB514\uAC15\uC774 \uB113\uC740 \uBC14\uC704 \uC808\uBCBD\uC744 \uB118\uC5B4 \uC5EC\uB7EC \uD770 \uBB3C\uC904\uAE30\uB85C \uAC08\uB77C\uC838 \uB5A8\uC5B4\uC9D1\uB2C8\uB2E4.",
      descriptionSourceName: "\uCF00\uB784\uB77C \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "widefalls",
      height: 47,
      width: 111,
      spans: 3,
      terrainHeight: 0,
      actorX: 99,
      color: "#629b9f",
      motif: "cascade"
    },
    scene: {
      description: "Athirappilly Falls: Foam descends along the different river ledges.",
      descriptionKo: "\uC544\uD2F0\uB77C\uD544\uB9AC \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "tequendama",
      name: "Tequendama Falls",
      country: "Colombia",
      code: "COL",
      tier: "common",
      lat: 4.57486111,
      lon: -74.29338889,
      source: "https://colombia.travel/en/cerca-de-bogota-soacha-guatavita-y-la-calera",
      region: "Bogot\xE1 River, Cundinamarca",
      description: "The Bogot\xE1 River plunges into a steep forest-lined gorge southwest of the Colombian capital. The miniature contrasts the narrow falling water with the tall rock walls.",
      descriptionSourceName: "Colombia Travel",
      descriptionSource: "https://colombia.travel/en/cerca-de-bogota-soacha-guatavita-y-la-calera"
    },
    korean: {
      name: "\uD14C\uCF04\uB2E4\uB9C8 \uD3ED\uD3EC",
      country: "\uCF5C\uB86C\uBE44\uC544",
      region: "\uCFE4\uB514\uB098\uB9C8\uB974\uCE74 \uBCF4\uACE0\uD0C0\uAC15",
      description: "\uCF5C\uB86C\uBE44\uC544 \uC218\uB3C4 \uB0A8\uC11C\uCABD\uC5D0\uC11C \uBCF4\uACE0\uD0C0\uAC15\uC774 \uC232\uC73C\uB85C \uB458\uB7EC\uC2F8\uC778 \uAC00\uD30C\uB978 \uD611\uACE1\uC73C\uB85C \uB5A8\uC5B4\uC9D1\uB2C8\uB2E4. \uBAA8\uD615\uC740 \uC881\uAC8C \uB5A8\uC5B4\uC9C0\uB294 \uBB3C\uC904\uAE30\uC640 \uB192\uC740 \uBC14\uC704\uBCBD\uC744 \uB300\uBE44\uD574 \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uCF5C\uB86C\uBE44\uC544 \uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "plungefalls",
      height: 87,
      width: 72,
      spans: 1,
      terrainHeight: 0,
      actorX: 19,
      color: "#d4b078",
      motif: "cascade"
    },
    scene: {
      description: "Tequendama Falls: Foam descends along the different river ledges.",
      descriptionKo: "\uD14C\uCF04\uB2E4\uB9C8 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  },
  {
    record: {
      id: "saltosmonday",
      name: "Saltos del Monday",
      country: "Paraguay",
      code: "PRY",
      tier: "common",
      lat: -25.56194444,
      lon: -54.63138889,
      source: "https://visitparaguay.travel/places/saltos-del-monday",
      region: "Monday River, Presidente Franco",
      description: "Several strong river cascades descend through forest near Presidente Franco, separate from the nearby Iguaz\xFA Falls system.",
      descriptionSourceName: "Paraguay National Tourism Secretariat",
      descriptionSource: "https://visitparaguay.travel/places/saltos-del-monday"
    },
    korean: {
      name: "\uBAAC\uB2E4\uC774 \uD3ED\uD3EC",
      country: "\uD30C\uB77C\uACFC\uC774",
      region: "\uD504\uB808\uC2DC\uB374\uD14C\uD504\uB791\uCF54 \uBAAC\uB2E4\uC774\uAC15",
      description: "\uD504\uB808\uC2DC\uB374\uD14C\uD504\uB791\uCF54 \uADFC\uCC98 \uC232\uC18D\uC5D0\uC11C \uAC15\uBB3C\uC774 \uC5EC\uB7EC \uAD75\uC740 \uD3ED\uD3EC\uB85C \uB5A8\uC5B4\uC9C0\uBA70, \uAC00\uAE4C\uC6B4 \uC774\uAD6C\uC544\uC218 \uD3ED\uD3EC\uC640\uB294 \uB2E4\uB978 \uAC15\uC758 \uD3ED\uD3EC\uC785\uB2C8\uB2E4.",
      descriptionSourceName: "\uD30C\uB77C\uACFC\uC774 \uAD6D\uAC00\uAD00\uAD11\uCCAD"
    },
    surface: "river",
    visual: {
      shape: "splitfalls",
      height: 52,
      width: 107,
      spans: 3,
      terrainHeight: 0,
      actorX: 100,
      color: "#839b70",
      motif: "cascade"
    },
    scene: {
      description: "Saltos del Monday: Foam descends along the different river ledges.",
      descriptionKo: "\uBAAC\uB2E4\uC774 \uD3ED\uD3EC: \uAC15\uC758 \uBC14\uC704 \uD131\uC744 \uB530\uB77C \uBB3C\uAC70\uD488\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4."
    }
  }
];

// plugins/orcatopia/src/water-catalog.json
var water_catalog_default = [
  {
    record: {
      id: "greatbarrierreef",
      name: "Great Barrier Reef",
      country: "Australia",
      code: "AUS",
      tier: "epic",
      lat: -18.2871,
      lon: 147.6992,
      source: "https://whc.unesco.org/en/list/154/",
      region: "Queensland",
      description: "Coral gardens and shallow lagoons spread along northeastern Australia, providing habitats for marine turtles, dugongs and many kinds of reef fish. The miniature represents part of this extensive marine landscape.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/154/"
    },
    korean: {
      name: "\uADF8\uB808\uC774\uD2B8\uBC30\uB9AC\uC5B4\uB9AC\uD504",
      country: "\uD638\uC8FC",
      region: "\uD038\uC990\uB79C\uB4DC",
      description: "\uD638\uC8FC \uBD81\uB3D9\uBD80 \uBC14\uB2E4\uC5D0 \uC0B0\uD638\uCD08\uC640 \uC595\uC740 \uC11D\uD638\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4. \uBC14\uB2E4\uAC70\uBD81\uACFC \uB4C0\uACF5, \uB2E4\uC591\uD55C \uC0B0\uD638\uCD08 \uBB3C\uACE0\uAE30\uAC00 \uC0B4\uC544\uAC00\uB294 \uB113\uC740 \uD574\uC591 \uACBD\uAD00\uC758 \uC77C\uBD80\uB97C \uC791\uC740 \uBAA8\uD615\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    visual: {
      id: "greatbarrierreef",
      name: "Great Barrier Reef",
      nameKo: "\uADF8\uB808\uC774\uD2B8\uBC30\uB9AC\uC5B4\uB9AC\uD504",
      shape: "reef",
      feature: "Coral gardens and shallow lagoons spread along northeastern Australia, providing habitats for marine turtles, dugongs and many kinds of reef fish. The miniature represents part of this extensive marine landscape.",
      featureKo: "\uD638\uC8FC \uBD81\uB3D9\uBD80 \uBC14\uB2E4\uC5D0 \uC0B0\uD638\uCD08\uC640 \uC595\uC740 \uC11D\uD638\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4. \uBC14\uB2E4\uAC70\uBD81\uACFC \uB4C0\uACF5, \uB2E4\uC591\uD55C \uC0B0\uD638\uCD08 \uBB3C\uACE0\uAE30\uAC00 \uC0B4\uC544\uAC00\uB294 \uB113\uC740 \uD574\uC591 \uACBD\uAD00\uC758 \uC77C\uBD80\uB97C \uC791\uC740 \uBAA8\uD615\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      seed: 201,
      color: "#5ab7ad"
    },
    surface: "sea"
  },
  {
    record: {
      id: "bluehole",
      name: "Great Blue Hole",
      country: "Belize",
      code: "BLZ",
      tier: "rare",
      lat: 17.316,
      lon: -87.534,
      source: "https://whc.unesco.org/en/list/764/",
      region: "Lighthouse Reef",
      description: "A deep circular marine sinkhole opens within Lighthouse Reef in Belize. Blue Hole Natural Monument is one of the protected areas of the Belize Barrier Reef Reserve System; its dark water contrasts with the surrounding shallows.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/764/"
    },
    korean: {
      name: "\uADF8\uB808\uC774\uD2B8\uBE14\uB8E8\uD640",
      country: "\uBCA8\uB9AC\uC988",
      region: "\uB77C\uC774\uD2B8\uD558\uC6B0\uC2A4\uB9AC\uD504",
      description: "\uBCA8\uB9AC\uC988 \uB77C\uC774\uD2B8\uD558\uC6B0\uC2A4\uB9AC\uD504 \uC548\uCABD\uC5D0 \uB465\uADFC \uD574\uC591 \uC2F1\uD06C\uD640\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4. \uBCA8\uB9AC\uC988 \uC0B0\uD638\uCD08 \uBCF4\uD638\uAD6C\uC5ED\uC744 \uC774\uB8E8\uB294 \uBE14\uB8E8\uD640 \uC790\uC5F0\uAE30\uB150\uBB3C\uB85C, \uC9D9\uC740 \uBB3C\uBE5B\uACFC \uC8FC\uBCC0\uC758 \uC595\uC740 \uBC14\uB2E4\uAC00 \uB69C\uB837\uD558\uAC8C \uB300\uBE44\uB429\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    visual: {
      id: "bluehole",
      name: "Great Blue Hole",
      nameKo: "\uADF8\uB808\uC774\uD2B8\uBE14\uB8E8\uD640",
      shape: "reef",
      feature: "A deep circular marine sinkhole opens within Lighthouse Reef in Belize. Blue Hole Natural Monument is one of the protected areas of the Belize Barrier Reef Reserve System; its dark water contrasts with the surrounding shallows.",
      featureKo: "\uBCA8\uB9AC\uC988 \uB77C\uC774\uD2B8\uD558\uC6B0\uC2A4\uB9AC\uD504 \uC548\uCABD\uC5D0 \uB465\uADFC \uD574\uC591 \uC2F1\uD06C\uD640\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4. \uBCA8\uB9AC\uC988 \uC0B0\uD638\uCD08 \uBCF4\uD638\uAD6C\uC5ED\uC744 \uC774\uB8E8\uB294 \uBE14\uB8E8\uD640 \uC790\uC5F0\uAE30\uB150\uBB3C\uB85C, \uC9D9\uC740 \uBB3C\uBE5B\uACFC \uC8FC\uBCC0\uC758 \uC595\uC740 \uBC14\uB2E4\uAC00 \uB69C\uB837\uD558\uAC8C \uB300\uBE44\uB429\uB2C8\uB2E4.",
      seed: 202,
      color: "#4f9fac"
    },
    surface: "sea"
  },
  {
    record: {
      id: "geirangerfjord",
      name: "Geirangerfjord",
      country: "Norway",
      code: "NOR",
      tier: "rare",
      lat: 62.105,
      lon: 7.01,
      source: "https://whc.unesco.org/en/list/1195/",
      region: "Western Norway",
      description: "Steep rock walls enclose a narrow arm of the sea in western Norway. Waterfalls descend from the mountain sides into the fjord, one of the two fjord areas recognized in the West Norwegian Fjords World Heritage property.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1195/"
    },
    korean: {
      name: "\uAC8C\uC774\uB791\uC5D0\uB974\uD53C\uC624\uB974",
      country: "\uB178\uB974\uC6E8\uC774",
      region: "\uB178\uB974\uC6E8\uC774 \uC11C\uBD80",
      description: "\uB178\uB974\uC6E8\uC774 \uC11C\uBD80\uC758 \uAC00\uD30C\uB978 \uC554\uBCBD \uC0AC\uC774\uB85C \uC881\uACE0 \uAE34 \uBC14\uB2F7\uAE38\uC774 \uB4E4\uC5B4\uC635\uB2C8\uB2E4. \uC0B0\uBE44\uD0C8\uC758 \uD3ED\uD3EC\uAC00 \uD53C\uC624\uB974\uB85C \uD758\uB7EC\uB4E4\uBA70, \uB178\uB974\uC6E8\uC774 \uC11C\uBD80 \uD53C\uC624\uB974 \uC138\uACC4\uC720\uC0B0\uC744 \uC774\uB8E8\uB294 \uB450 \uC9C0\uC5ED \uC911 \uD558\uB098\uC785\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    visual: {
      id: "geirangerfjord",
      name: "Geirangerfjord",
      nameKo: "\uAC8C\uC774\uB791\uC5D0\uB974\uD53C\uC624\uB974",
      shape: "fjord",
      feature: "Steep rock walls enclose a narrow arm of the sea in western Norway. Waterfalls descend from the mountain sides into the fjord, one of the two fjord areas recognized in the West Norwegian Fjords World Heritage property.",
      featureKo: "\uB178\uB974\uC6E8\uC774 \uC11C\uBD80\uC758 \uAC00\uD30C\uB978 \uC554\uBCBD \uC0AC\uC774\uB85C \uC881\uACE0 \uAE34 \uBC14\uB2F7\uAE38\uC774 \uB4E4\uC5B4\uC635\uB2C8\uB2E4. \uC0B0\uBE44\uD0C8\uC758 \uD3ED\uD3EC\uAC00 \uD53C\uC624\uB974\uB85C \uD758\uB7EC\uB4E4\uBA70, \uB178\uB974\uC6E8\uC774 \uC11C\uBD80 \uD53C\uC624\uB974 \uC138\uACC4\uC720\uC0B0\uC744 \uC774\uB8E8\uB294 \uB450 \uC9C0\uC5ED \uC911 \uD558\uB098\uC785\uB2C8\uB2E4.",
      seed: 203,
      color: "#759eaf"
    },
    surface: "sea"
  },
  {
    record: {
      id: "rockislands",
      name: "Rock Islands Southern Lagoon",
      country: "Palau",
      code: "PLW",
      tier: "rare",
      lat: 7.2,
      lon: 134.35,
      source: "https://whc.unesco.org/en/list/1386/",
      region: "Southern Lagoon",
      description: "Green limestone islets rise from turquoise lagoons in Palau. Their undercut, mushroom-like profiles sit among coral reefs, while the wider Rock Islands landscape includes marine lakes and traces of former island settlements.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1386/"
    },
    korean: {
      name: "\uD314\uB77C\uC6B0 \uB85D\uC544\uC77C\uB79C\uB4DC",
      country: "\uD314\uB77C\uC6B0",
      region: "\uB0A8\uBD80 \uC11D\uD638",
      description: "\uD314\uB77C\uC6B0\uC758 \uCCAD\uB85D\uBE5B \uC11D\uD638 \uC704\uB85C \uCD08\uB85D\uBE5B \uC11D\uD68C\uC554 \uC12C\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uB7AB\uBD80\uBD84\uC774 \uAE4E\uC778 \uBC84\uC12F \uBAA8\uC591 \uC12C\uACFC \uC0B0\uD638\uCD08\uAC00 \uC5B4\uC6B0\uB7EC\uC9C0\uBA70, \uC8FC\uBCC0\uC5D0\uB294 \uD574\uC591 \uD638\uC218\uC640 \uC61B \uC12C \uACF5\uB3D9\uCCB4\uC758 \uD754\uC801\uB3C4 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    visual: {
      id: "rockislands",
      name: "Rock Islands Southern Lagoon",
      nameKo: "\uD314\uB77C\uC6B0 \uB85D\uC544\uC77C\uB79C\uB4DC",
      shape: "island",
      feature: "Green limestone islets rise from turquoise lagoons in Palau. Their undercut, mushroom-like profiles sit among coral reefs, while the wider Rock Islands landscape includes marine lakes and traces of former island settlements.",
      featureKo: "\uD314\uB77C\uC6B0\uC758 \uCCAD\uB85D\uBE5B \uC11D\uD638 \uC704\uB85C \uCD08\uB85D\uBE5B \uC11D\uD68C\uC554 \uC12C\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uB7AB\uBD80\uBD84\uC774 \uAE4E\uC778 \uBC84\uC12F \uBAA8\uC591 \uC12C\uACFC \uC0B0\uD638\uCD08\uAC00 \uC5B4\uC6B0\uB7EC\uC9C0\uBA70, \uC8FC\uBCC0\uC5D0\uB294 \uD574\uC591 \uD638\uC218\uC640 \uC61B \uC12C \uACF5\uB3D9\uCCB4\uC758 \uD754\uC801\uB3C4 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.",
      seed: 204,
      color: "#68b6a2"
    },
    surface: "sea"
  },
  {
    record: {
      id: "liriver",
      name: "Li River Karst",
      country: "China",
      code: "CHN",
      tier: "rare",
      lat: 25.0022,
      lon: 110.425,
      source: "https://whc.unesco.org/en/list/1248/",
      region: "Guilin",
      description: "Towering limestone peaks line the Li River around Guilin. The Lijiang karst component of South China Karst preserves a landscape of steep green hills and river corridors, represented here by a small riverside scene.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1248/"
    },
    korean: {
      name: "\uB9AC\uAC15 \uCE74\uB974\uC2A4\uD2B8",
      country: "\uC911\uAD6D",
      region: "\uAD6C\uC774\uB9B0",
      description: "\uAD6C\uC774\uB9B0\uC758 \uB9AC\uAC15\uC744 \uB530\uB77C \uAC00\uD30C\uB978 \uC11D\uD68C\uC554 \uBD09\uC6B0\uB9AC\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4. \uC911\uAD6D \uB0A8\uBD80 \uCE74\uB974\uC2A4\uD2B8 \uC720\uC0B0\uC758 \uB9AC\uC7A5 \uAD6C\uC5ED\uC5D0 \uC18D\uD55C \uC0B0\uBD09\uC6B0\uB9AC\uC640 \uAC15\uBCC0 \uD48D\uACBD\uC744 \uC791\uC740 \uBAA8\uD615\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    visual: {
      id: "liriver",
      name: "Li River Karst",
      nameKo: "\uB9AC\uAC15 \uCE74\uB974\uC2A4\uD2B8",
      shape: "coast",
      feature: "Towering limestone peaks line the Li River around Guilin. The Lijiang karst component of South China Karst preserves a landscape of steep green hills and river corridors, represented here by a small riverside scene.",
      featureKo: "\uAD6C\uC774\uB9B0\uC758 \uB9AC\uAC15\uC744 \uB530\uB77C \uAC00\uD30C\uB978 \uC11D\uD68C\uC554 \uBD09\uC6B0\uB9AC\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4. \uC911\uAD6D \uB0A8\uBD80 \uCE74\uB974\uC2A4\uD2B8 \uC720\uC0B0\uC758 \uB9AC\uC7A5 \uAD6C\uC5ED\uC5D0 \uC18D\uD55C \uC0B0\uBD09\uC6B0\uB9AC\uC640 \uAC15\uBCC0 \uD48D\uACBD\uC744 \uC791\uC740 \uBAA8\uD615\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      seed: 205,
      color: "#77aaa0"
    },
    surface: "river"
  },
  {
    record: {
      id: "middlerhine",
      name: "Upper Middle Rhine Valley",
      country: "Germany",
      code: "DEU",
      tier: "common",
      lat: 50.173,
      lon: 7.694,
      source: "https://whc.unesco.org/en/list/1066/",
      region: "Middle Rhine",
      description: "Castles, vineyard slopes and historic towns follow the Middle Rhine in Germany. The World Heritage cultural landscape records centuries of settlement and travel along the river; the miniature combines a river bend and a hillside castle.",
      descriptionSourceName: "UNESCO World Heritage Centre",
      descriptionSource: "https://whc.unesco.org/en/list/1066/"
    },
    korean: {
      name: "\uB77C\uC778\uAC15 \uC911\uC0C1\uB958 \uACC4\uACE1",
      country: "\uB3C5\uC77C",
      region: "\uB77C\uC778\uAC15 \uC911\uB958",
      description: "\uB3C5\uC77C \uB77C\uC778\uAC15\uC744 \uB530\uB77C \uACE0\uC131\uACFC \uD3EC\uB3C4\uBC2D, \uC624\uB798\uB41C \uB9C8\uC744\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4. \uC218\uBC31 \uB144 \uB3D9\uC548 \uAC15\uACFC \uD568\uAED8 \uC0B4\uC544\uC628 \uBB38\uD654\uACBD\uAD00\uC744 \uAD7D\uC774\uCE58\uB294 \uBB3C\uAE38\uACFC \uC5B8\uB355 \uC704 \uC131\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      descriptionSourceName: "\uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC720\uC0B0\uC13C\uD130"
    },
    visual: {
      id: "middlerhine",
      name: "Upper Middle Rhine Valley",
      nameKo: "\uB77C\uC778\uAC15 \uC911\uC0C1\uB958 \uACC4\uACE1",
      shape: "castle",
      feature: "Castles, vineyard slopes and historic towns follow the Middle Rhine in Germany. The World Heritage cultural landscape records centuries of settlement and travel along the river; the miniature combines a river bend and a hillside castle.",
      featureKo: "\uB3C5\uC77C \uB77C\uC778\uAC15\uC744 \uB530\uB77C \uACE0\uC131\uACFC \uD3EC\uB3C4\uBC2D, \uC624\uB798\uB41C \uB9C8\uC744\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4. \uC218\uBC31 \uB144 \uB3D9\uC548 \uAC15\uACFC \uD568\uAED8 \uC0B4\uC544\uC628 \uBB38\uD654\uACBD\uAD00\uC744 \uAD7D\uC774\uCE58\uB294 \uBB3C\uAE38\uACFC \uC5B8\uB355 \uC704 \uC131\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
      seed: 206,
      color: "#9baf86"
    },
    surface: "river"
  }
];

// plugins/orcatopia/src/catalog-600.json
var catalog_600_default = [
  {
    id: "jam",
    placement: "land",
    heights: [
      0,
      18,
      99,
      15,
      0
    ],
    detail: "brick"
  },
  {
    id: "bamiyan",
    placement: "land",
    heights: [
      73,
      91,
      85,
      62,
      77
    ],
    detail: "niches"
  },
  {
    id: "butrint",
    placement: "land",
    heights: [
      24,
      39,
      52,
      35,
      19
    ],
    detail: "theatre"
  },
  {
    id: "berat",
    placement: "land",
    heights: [
      42,
      58,
      70,
      55,
      35
    ],
    detail: "windows"
  },
  {
    id: "haghpat",
    placement: "land",
    heights: [
      25,
      52,
      79,
      48,
      30
    ],
    detail: "cross"
  },
  {
    id: "geghard",
    placement: "land",
    heights: [
      64,
      79,
      96,
      74,
      54
    ],
    detail: "niches"
  },
  {
    id: "zvartnots",
    placement: "land",
    heights: [
      18,
      35,
      63,
      38,
      21
    ],
    detail: "columns"
  },
  {
    id: "bakuwalled",
    placement: "land",
    heights: [
      44,
      61,
      82,
      53,
      36
    ],
    detail: "bastions"
  },
  {
    id: "gobustan",
    placement: "land",
    heights: [
      47,
      59,
      40,
      64,
      32
    ],
    detail: "engravings"
  },
  {
    id: "sheki",
    placement: "land",
    heights: [
      31,
      47,
      68,
      49,
      28
    ],
    detail: "lattice"
  },
  {
    id: "visegrad",
    placement: "river",
    heights: [
      26,
      33,
      39,
      33,
      26
    ],
    detail: "arches"
  },
  {
    id: "vjetrenica",
    placement: "land",
    heights: [
      61,
      82,
      87,
      72,
      44
    ],
    detail: "cave"
  },
  {
    id: "boyana",
    placement: "land",
    heights: [
      29,
      42,
      58,
      39,
      24
    ],
    detail: "fresco"
  },
  {
    id: "madara",
    placement: "land",
    heights: [
      68,
      87,
      99,
      85,
      62
    ],
    detail: "horse"
  },
  {
    id: "kazanlak",
    placement: "land",
    heights: [
      18,
      30,
      53,
      32,
      19
    ],
    detail: "fresco"
  },
  {
    id: "ivanovo",
    placement: "land",
    heights: [
      54,
      82,
      91,
      76,
      55
    ],
    detail: "niches"
  },
  {
    id: "nessebar",
    placement: "coastal",
    heights: [
      28,
      48,
      60,
      41,
      24
    ],
    detail: "seabird"
  },
  {
    id: "srebarna",
    placement: "river",
    heights: [
      17,
      23,
      31,
      20,
      14
    ],
    detail: "waterbirds"
  },
  {
    id: "pirin",
    placement: "land",
    heights: [
      55,
      80,
      98,
      77,
      48
    ],
    detail: "snow"
  },
  {
    id: "qalabahrain",
    placement: "coastal",
    heights: [
      26,
      45,
      55,
      42,
      27
    ],
    detail: "bastions"
  },
  {
    id: "dilmunmounds",
    placement: "land",
    heights: [
      24,
      35,
      45,
      31,
      22
    ],
    detail: "mounds"
  },
  {
    id: "mir",
    placement: "land",
    heights: [
      72,
      51,
      38,
      54,
      78
    ],
    detail: "spires"
  },
  {
    id: "nesvizh",
    placement: "land",
    heights: [
      34,
      49,
      66,
      48,
      33
    ],
    detail: "garden"
  },
  {
    id: "paphos",
    placement: "land",
    heights: [
      18,
      32,
      44,
      28,
      20
    ],
    detail: "mosaic"
  },
  {
    id: "troodos",
    placement: "land",
    heights: [
      27,
      43,
      68,
      41,
      25
    ],
    detail: "fresco"
  },
  {
    id: "choirokoitia",
    placement: "land",
    heights: [
      25,
      39,
      46,
      36,
      22
    ],
    detail: "roundhouses"
  },
  {
    id: "ceskykrumlov",
    placement: "land",
    heights: [
      44,
      67,
      91,
      60,
      36
    ],
    detail: "spires"
  },
  {
    id: "telc",
    placement: "land",
    heights: [
      47,
      54,
      66,
      50,
      41
    ],
    detail: "arcade"
  },
  {
    id: "zelenahora",
    placement: "land",
    heights: [
      32,
      57,
      87,
      59,
      34
    ],
    detail: "star"
  },
  {
    id: "kutnahora",
    placement: "land",
    heights: [
      39,
      71,
      94,
      68,
      37
    ],
    detail: "spires"
  },
  {
    id: "lednice",
    placement: "land",
    heights: [
      42,
      63,
      83,
      66,
      44
    ],
    detail: "garden"
  },
  {
    id: "olomouc",
    placement: "land",
    heights: [
      0,
      24,
      96,
      21,
      0
    ],
    detail: "sculpture"
  },
  {
    id: "kromeriz",
    placement: "land",
    heights: [
      19,
      37,
      58,
      35,
      21
    ],
    detail: "garden"
  },
  {
    id: "litomysl",
    placement: "land",
    heights: [
      37,
      48,
      60,
      46,
      34
    ],
    detail: "sgraffito"
  },
  {
    id: "mtskheta",
    placement: "land",
    heights: [
      33,
      51,
      76,
      49,
      31
    ],
    detail: "cross"
  },
  {
    id: "svaneti",
    placement: "land",
    heights: [
      73,
      51,
      85,
      62,
      94
    ],
    detail: "towers"
  },
  {
    id: "gelati",
    placement: "land",
    heights: [
      27,
      46,
      72,
      43,
      28
    ],
    detail: "mosaic"
  },
  {
    id: "colchic",
    placement: "river",
    heights: [
      44,
      62,
      79,
      58,
      38
    ],
    detail: "forestwater"
  },
  {
    id: "split",
    placement: "land",
    heights: [
      34,
      48,
      71,
      46,
      29
    ],
    detail: "arcade"
  },
  {
    id: "plitvice",
    placement: "river",
    heights: [
      28,
      43,
      62,
      46,
      26
    ],
    detail: "cascade"
  },
  {
    id: "porec",
    placement: "land",
    heights: [
      27,
      46,
      64,
      43,
      25
    ],
    detail: "mosaic"
  },
  {
    id: "trogir",
    placement: "coastal",
    heights: [
      37,
      58,
      78,
      52,
      30
    ],
    detail: "seabird"
  },
  {
    id: "sibenik",
    placement: "land",
    heights: [
      30,
      53,
      84,
      52,
      28
    ],
    detail: "dome"
  },
  {
    id: "starigrad",
    placement: "land",
    heights: [
      23,
      35,
      49,
      36,
      21
    ],
    detail: "fields"
  },
  {
    id: "holloko",
    placement: "land",
    heights: [
      32,
      45,
      59,
      43,
      27
    ],
    detail: "timber"
  },
  {
    id: "hortobagy",
    placement: "land",
    heights: [
      13,
      20,
      26,
      18,
      11
    ],
    detail: "herd"
  },
  {
    id: "pannonhalma",
    placement: "land",
    heights: [
      38,
      56,
      82,
      59,
      35
    ],
    detail: "cross"
  },
  {
    id: "tokaj",
    placement: "land",
    heights: [
      20,
      37,
      54,
      36,
      19
    ],
    detail: "vineyard"
  },
  {
    id: "sulaimantoo",
    placement: "land",
    heights: [
      38,
      60,
      83,
      57,
      33
    ],
    detail: "cairns"
  },
  {
    id: "yasawi",
    placement: "land",
    heights: [
      25,
      55,
      86,
      57,
      28
    ],
    detail: "blue"
  },
  {
    id: "tanbaly",
    placement: "land",
    heights: [
      38,
      56,
      69,
      49,
      28
    ],
    detail: "engravings"
  },
  {
    id: "saryarka",
    placement: "river",
    heights: [
      16,
      27,
      39,
      23,
      15
    ],
    detail: "waterbirds"
  },
  {
    id: "vilnius",
    placement: "land",
    heights: [
      47,
      64,
      83,
      57,
      34
    ],
    detail: "spires"
  },
  {
    id: "kernave",
    placement: "land",
    heights: [
      25,
      44,
      61,
      49,
      30
    ],
    detail: "mounds"
  },
  {
    id: "kuldiga",
    placement: "land",
    heights: [
      38,
      49,
      64,
      46,
      33
    ],
    detail: "timber"
  },
  {
    id: "durmitor",
    placement: "land",
    heights: [
      53,
      77,
      96,
      71,
      45
    ],
    detail: "snow"
  },
  {
    id: "kotor",
    placement: "coastal",
    heights: [
      65,
      87,
      96,
      75,
      53
    ],
    detail: "seabird"
  },
  {
    id: "orkhon",
    placement: "land",
    heights: [
      19,
      34,
      49,
      29,
      17
    ],
    detail: "fields"
  },
  {
    id: "burkhankhaldun",
    placement: "land",
    heights: [
      43,
      63,
      90,
      66,
      41
    ],
    detail: "cairns"
  },
  {
    id: "deerstones",
    placement: "land",
    heights: [
      42,
      60,
      79,
      56,
      35
    ],
    detail: "deer"
  },
  {
    id: "sagarmatha",
    placement: "land",
    heights: [
      60,
      85,
      108,
      79,
      51
    ],
    detail: "snow"
  },
  {
    id: "chitwan",
    placement: "land",
    heights: [
      40,
      58,
      72,
      61,
      43
    ],
    detail: "rhino"
  },
  {
    id: "lumbini",
    placement: "land",
    heights: [
      23,
      38,
      62,
      41,
      22
    ],
    detail: "pillar"
  },
  {
    id: "bahla",
    placement: "land",
    heights: [
      53,
      37,
      69,
      42,
      58
    ],
    detail: "bastions"
  },
  {
    id: "bat",
    placement: "land",
    heights: [
      27,
      42,
      51,
      38,
      24
    ],
    detail: "beehive"
  },
  {
    id: "frankincense",
    placement: "land",
    heights: [
      19,
      34,
      50,
      37,
      20
    ],
    detail: "palm"
  },
  {
    id: "aflaj",
    placement: "river",
    heights: [
      22,
      38,
      48,
      33,
      18
    ],
    detail: "channels"
  },
  {
    id: "moenjodaro",
    placement: "land",
    heights: [
      21,
      37,
      57,
      32,
      16
    ],
    detail: "brick"
  },
  {
    id: "taxila",
    placement: "land",
    heights: [
      24,
      43,
      59,
      38,
      21
    ],
    detail: "stupa"
  },
  {
    id: "takhtibahi",
    placement: "land",
    heights: [
      31,
      47,
      63,
      42,
      26
    ],
    detail: "niches"
  },
  {
    id: "rohtas",
    placement: "land",
    heights: [
      56,
      42,
      74,
      47,
      61
    ],
    detail: "bastions"
  },
  {
    id: "krakow",
    placement: "land",
    heights: [
      39,
      61,
      84,
      57,
      32
    ],
    detail: "arcade"
  },
  {
    id: "warsaw",
    placement: "land",
    heights: [
      46,
      56,
      74,
      51,
      39
    ],
    detail: "windows"
  },
  {
    id: "wieliczka",
    placement: "land",
    heights: [
      50,
      73,
      92,
      68,
      41
    ],
    detail: "salt"
  },
  {
    id: "zamosc",
    placement: "land",
    heights: [
      40,
      53,
      72,
      54,
      36
    ],
    detail: "arcade"
  },
  {
    id: "torun",
    placement: "land",
    heights: [
      45,
      64,
      86,
      58,
      34
    ],
    detail: "brick"
  },
  {
    id: "malbork",
    placement: "land",
    heights: [
      61,
      47,
      91,
      52,
      72
    ],
    detail: "brick"
  },
  {
    id: "centennialhall",
    placement: "land",
    heights: [
      25,
      48,
      77,
      49,
      24
    ],
    detail: "ribs"
  },
  {
    id: "danubedelta",
    placement: "river",
    heights: [
      20,
      31,
      42,
      28,
      17
    ],
    detail: "waterbirds"
  },
  {
    id: "hurezi",
    placement: "land",
    heights: [
      30,
      47,
      70,
      45,
      28
    ],
    detail: "arcade"
  },
  {
    id: "moldavia",
    placement: "land",
    heights: [
      33,
      48,
      72,
      44,
      27
    ],
    detail: "fresco"
  },
  {
    id: "sighisoara",
    placement: "land",
    heights: [
      49,
      71,
      94,
      63,
      40
    ],
    detail: "clock"
  },
  {
    id: "maramures",
    placement: "land",
    heights: [
      28,
      47,
      102,
      43,
      25
    ],
    detail: "timber"
  },
  {
    id: "studenica",
    placement: "land",
    heights: [
      29,
      49,
      75,
      46,
      26
    ],
    detail: "marble"
  },
  {
    id: "gamzigrad",
    placement: "land",
    heights: [
      35,
      51,
      66,
      47,
      30
    ],
    detail: "mosaic"
  },
  {
    id: "skocjan",
    placement: "river",
    heights: [
      56,
      81,
      95,
      74,
      48
    ],
    detail: "caveriver"
  },
  {
    id: "spis",
    placement: "land",
    heights: [
      68,
      46,
      84,
      58,
      39
    ],
    detail: "bastions"
  },
  {
    id: "vlkolinec",
    placement: "land",
    heights: [
      33,
      44,
      57,
      41,
      29
    ],
    detail: "timber"
  },
  {
    id: "bardejov",
    placement: "land",
    heights: [
      43,
      56,
      76,
      53,
      37
    ],
    detail: "windows"
  },
  {
    id: "sarazm",
    placement: "land",
    heights: [
      17,
      28,
      43,
      31,
      21
    ],
    detail: "brick"
  },
  {
    id: "pamirs",
    placement: "land",
    heights: [
      58,
      88,
      103,
      82,
      49
    ],
    detail: "snow"
  },
  {
    id: "merv",
    placement: "land",
    heights: [
      20,
      39,
      65,
      35,
      18
    ],
    detail: "brick"
  },
  {
    id: "kunyaurgench",
    placement: "land",
    heights: [
      25,
      47,
      101,
      52,
      29
    ],
    detail: "brick"
  },
  {
    id: "nisa",
    placement: "land",
    heights: [
      26,
      40,
      57,
      37,
      23
    ],
    detail: "bastions"
  },
  {
    id: "kyivsophia",
    placement: "land",
    heights: [
      36,
      63,
      91,
      61,
      33
    ],
    detail: "gold"
  },
  {
    id: "lviv",
    placement: "land",
    heights: [
      46,
      59,
      81,
      54,
      38
    ],
    detail: "windows"
  },
  {
    id: "itchankala",
    placement: "land",
    heights: [
      43,
      62,
      84,
      51,
      38
    ],
    detail: "blue"
  },
  {
    id: "bukhara",
    placement: "land",
    heights: [
      34,
      57,
      93,
      62,
      32
    ],
    detail: "blue"
  },
  {
    id: "shakhrisyabz",
    placement: "land",
    heights: [
      28,
      88,
      52,
      92,
      31
    ],
    detail: "blue"
  },
  {
    id: "abomey",
    placement: "land",
    heights: [
      31,
      42,
      54,
      38,
      27
    ],
    detail: "earth"
  },
  {
    id: "loropeni",
    placement: "land",
    heights: [
      51,
      62,
      58,
      66,
      46
    ],
    detail: "bastions"
  },
  {
    id: "tiebele",
    placement: "land",
    heights: [
      24,
      37,
      48,
      34,
      25
    ],
    detail: "paintedearth"
  },
  {
    id: "virunga",
    placement: "land",
    heights: [
      44,
      75,
      99,
      70,
      40
    ],
    detail: "gorilla"
  },
  {
    id: "okapi",
    placement: "land",
    heights: [
      49,
      68,
      82,
      62,
      45
    ],
    detail: "okapi"
  },
  {
    id: "odzala",
    placement: "land",
    heights: [
      45,
      64,
      79,
      58,
      41
    ],
    detail: "gorilla"
  },
  {
    id: "taiforest",
    placement: "land",
    heights: [
      48,
      69,
      86,
      65,
      43
    ],
    detail: "forest"
  },
  {
    id: "grandbassam",
    placement: "coastal",
    heights: [
      29,
      45,
      60,
      43,
      26
    ],
    detail: "seabird"
  },
  {
    id: "dja",
    placement: "land",
    heights: [
      51,
      71,
      89,
      67,
      47
    ],
    detail: "monkey"
  },
  {
    id: "benihammad",
    placement: "land",
    heights: [
      45,
      38,
      87,
      42,
      51
    ],
    detail: "brick"
  },
  {
    id: "tassili",
    placement: "land",
    heights: [
      57,
      77,
      62,
      91,
      44
    ],
    detail: "engravings"
  },
  {
    id: "mzab",
    placement: "land",
    heights: [
      35,
      54,
      94,
      49,
      30
    ],
    detail: "earth"
  },
  {
    id: "djemila",
    placement: "land",
    heights: [
      21,
      38,
      56,
      33,
      19
    ],
    detail: "columns"
  },
  {
    id: "tipasa",
    placement: "coastal",
    heights: [
      23,
      41,
      58,
      36,
      18
    ],
    detail: "seabird"
  },
  {
    id: "asmara",
    placement: "land",
    heights: [
      29,
      48,
      67,
      44,
      26
    ],
    detail: "windows"
  },
  {
    id: "fasilghebbi",
    placement: "land",
    heights: [
      66,
      49,
      80,
      55,
      69
    ],
    detail: "bastions"
  },
  {
    id: "harar",
    placement: "land",
    heights: [
      34,
      52,
      69,
      47,
      29
    ],
    detail: "earth"
  },
  {
    id: "balemountains",
    placement: "land",
    heights: [
      48,
      71,
      93,
      68,
      43
    ],
    detail: "moorland"
  },
  {
    id: "asante",
    placement: "land",
    heights: [
      27,
      39,
      53,
      36,
      24
    ],
    detail: "paintedearth"
  },
  {
    id: "mountkenya",
    placement: "land",
    heights: [
      51,
      83,
      105,
      74,
      46
    ],
    detail: "snow"
  },
  {
    id: "turkana",
    placement: "river",
    heights: [
      23,
      37,
      55,
      33,
      20
    ],
    detail: "waterbirds"
  },
  {
    id: "lamu",
    placement: "coastal",
    heights: [
      33,
      46,
      62,
      41,
      28
    ],
    detail: "seabird"
  },
  {
    id: "fortjesus",
    placement: "coastal",
    heights: [
      43,
      61,
      50,
      67,
      39
    ],
    detail: "bastions"
  },
  {
    id: "thimlich",
    placement: "land",
    heights: [
      33,
      42,
      39,
      47,
      30
    ],
    detail: "drystone"
  },
  {
    id: "ambohimanga",
    placement: "land",
    heights: [
      31,
      48,
      64,
      45,
      27
    ],
    detail: "timber"
  },
  {
    id: "atsinanana",
    placement: "land",
    heights: [
      53,
      73,
      88,
      66,
      47
    ],
    detail: "forest"
  },
  {
    id: "timbuktu",
    placement: "land",
    heights: [
      29,
      54,
      87,
      48,
      27
    ],
    detail: "earth"
  },
  {
    id: "bandiagara",
    placement: "land",
    heights: [
      67,
      88,
      99,
      79,
      55
    ],
    detail: "granaries"
  },
  {
    id: "askia",
    placement: "land",
    heights: [
      20,
      43,
      80,
      46,
      24
    ],
    detail: "earth"
  },
  {
    id: "bancarguin",
    placement: "sea",
    heights: [
      15,
      24,
      35,
      20,
      12
    ],
    detail: "waterbirds"
  },
  {
    id: "lemorne",
    placement: "land",
    heights: [
      47,
      76,
      101,
      72,
      42
    ],
    detail: "quiet"
  },
  {
    id: "lakemalawi",
    placement: "river",
    heights: [
      20,
      34,
      51,
      31,
      18
    ],
    detail: "fish"
  },
  {
    id: "mozambiqueisland",
    placement: "coastal",
    heights: [
      26,
      42,
      56,
      38,
      23
    ],
    detail: "seabird"
  },
  {
    id: "twyfelfontein",
    placement: "land",
    heights: [
      38,
      55,
      71,
      51,
      29
    ],
    detail: "engravings"
  },
  {
    id: "agadez",
    placement: "land",
    heights: [
      19,
      42,
      103,
      37,
      24
    ],
    detail: "earth"
  },
  {
    id: "osunosogbo",
    placement: "land",
    heights: [
      48,
      67,
      83,
      61,
      43
    ],
    detail: "sculpture"
  },
  {
    id: "aldabra",
    placement: "sea",
    heights: [
      17,
      31,
      43,
      29,
      15
    ],
    detail: "turtle"
  },
  {
    id: "valleedemai",
    placement: "land",
    heights: [
      45,
      65,
      81,
      60,
      42
    ],
    detail: "palm"
  },
  {
    id: "sanganeb",
    placement: "sea",
    heights: [
      15,
      28,
      39,
      24,
      13
    ],
    detail: "fish"
  },
  {
    id: "djoudj",
    placement: "river",
    heights: [
      18,
      26,
      38,
      24,
      14
    ],
    detail: "waterbirds"
  },
  {
    id: "saintlouis",
    placement: "river",
    heights: [
      30,
      43,
      58,
      39,
      25
    ],
    detail: "boat"
  },
  {
    id: "saloum",
    placement: "river",
    heights: [
      25,
      44,
      59,
      39,
      21
    ],
    detail: "forestwater"
  },
  {
    id: "ounianga",
    placement: "river",
    heights: [
      27,
      46,
      61,
      42,
      24
    ],
    detail: "dunes"
  },
  {
    id: "ennedi",
    placement: "land",
    heights: [
      59,
      81,
      67,
      95,
      47
    ],
    detail: "archrock"
  },
  {
    id: "ichkeul",
    placement: "river",
    heights: [
      21,
      34,
      46,
      29,
      17
    ],
    detail: "waterbirds"
  },
  {
    id: "kilwa",
    placement: "coastal",
    heights: [
      25,
      41,
      57,
      36,
      22
    ],
    detail: "seabird"
  },
  {
    id: "bwindi",
    placement: "land",
    heights: [
      56,
      75,
      91,
      69,
      50
    ],
    detail: "gorilla"
  },
  {
    id: "rwenzori",
    placement: "land",
    heights: [
      57,
      84,
      104,
      78,
      48
    ],
    detail: "snow"
  },
  {
    id: "capefloral",
    placement: "land",
    heights: [
      24,
      40,
      56,
      36,
      21
    ],
    detail: "flowers"
  },
  {
    id: "mapungubwe",
    placement: "land",
    heights: [
      54,
      73,
      68,
      82,
      43
    ],
    detail: "quiet"
  },
  {
    id: "manapools",
    placement: "river",
    heights: [
      23,
      37,
      49,
      33,
      20
    ],
    detail: "herd"
  },
  {
    id: "matobo",
    placement: "land",
    heights: [
      48,
      65,
      83,
      61,
      36
    ],
    detail: "engravings"
  },
  {
    id: "khami",
    placement: "land",
    heights: [
      24,
      39,
      54,
      35,
      21
    ],
    detail: "drystone"
  },
  {
    id: "antiguadockyard",
    placement: "coastal",
    heights: [
      28,
      41,
      53,
      37,
      24
    ],
    detail: "sail"
  },
  {
    id: "bridgetown",
    placement: "coastal",
    heights: [
      34,
      47,
      61,
      43,
      29
    ],
    detail: "windows"
  },
  {
    id: "potosi",
    placement: "land",
    heights: [
      41,
      63,
      87,
      58,
      35
    ],
    detail: "mine"
  },
  {
    id: "sucre",
    placement: "land",
    heights: [
      39,
      52,
      73,
      49,
      32
    ],
    detail: "white"
  },
  {
    id: "samaipata",
    placement: "land",
    heights: [
      38,
      58,
      76,
      53,
      31
    ],
    detail: "engravings"
  },
  {
    id: "noelkempff",
    placement: "land",
    heights: [
      47,
      68,
      84,
      63,
      44
    ],
    detail: "forest"
  },
  {
    id: "olinda",
    placement: "land",
    heights: [
      42,
      57,
      76,
      53,
      34
    ],
    detail: "painted"
  },
  {
    id: "congonhas",
    placement: "land",
    heights: [
      38,
      56,
      81,
      59,
      35
    ],
    detail: "sculpture"
  },
  {
    id: "pantanal",
    placement: "river",
    heights: [
      21,
      35,
      47,
      31,
      19
    ],
    detail: "herd"
  },
  {
    id: "fernandonoronha",
    placement: "sea",
    heights: [
      29,
      57,
      78,
      48,
      23
    ],
    detail: "fish"
  },
  {
    id: "lencois",
    placement: "river",
    heights: [
      18,
      35,
      48,
      31,
      16
    ],
    detail: "dunes"
  },
  {
    id: "pampulha",
    placement: "land",
    heights: [
      22,
      42,
      63,
      35,
      19
    ],
    detail: "curves"
  },
  {
    id: "lanseauxmeadows",
    placement: "land",
    heights: [
      26,
      38,
      49,
      35,
      23
    ],
    detail: "turf"
  },
  {
    id: "sgang",
    placement: "coastal",
    heights: [
      48,
      63,
      85,
      59,
      38
    ],
    detail: "poles"
  },
  {
    id: "woodbuffalo",
    placement: "land",
    heights: [
      46,
      62,
      78,
      56,
      39
    ],
    detail: "bison"
  },
  {
    id: "oldquebec",
    placement: "land",
    heights: [
      54,
      41,
      79,
      46,
      62
    ],
    detail: "bastions"
  },
  {
    id: "rideau",
    placement: "river",
    heights: [
      21,
      37,
      52,
      31,
      18
    ],
    detail: "lock"
  },
  {
    id: "joggins",
    placement: "coastal",
    heights: [
      57,
      71,
      86,
      64,
      42
    ],
    detail: "fossils"
  },
  {
    id: "humberstone",
    placement: "land",
    heights: [
      31,
      56,
      91,
      47,
      24
    ],
    detail: "wheel"
  },
  {
    id: "sewell",
    placement: "land",
    heights: [
      43,
      61,
      78,
      54,
      36
    ],
    detail: "stairs"
  },
  {
    id: "mompox",
    placement: "river",
    heights: [
      31,
      46,
      63,
      41,
      27
    ],
    detail: "boat"
  },
  {
    id: "sanagustin",
    placement: "land",
    heights: [
      46,
      65,
      83,
      59,
      35
    ],
    detail: "sculpture"
  },
  {
    id: "chiribiquete",
    placement: "land",
    heights: [
      79,
      95,
      88,
      102,
      63
    ],
    detail: "tablemountain"
  },
  {
    id: "cocosisland",
    placement: "sea",
    heights: [
      28,
      54,
      73,
      46,
      24
    ],
    detail: "fish"
  },
  {
    id: "diquis",
    placement: "land",
    heights: [
      26,
      41,
      54,
      36,
      23
    ],
    detail: "spheres"
  },
  {
    id: "havana",
    placement: "coastal",
    heights: [
      41,
      58,
      82,
      53,
      32
    ],
    detail: "arcade"
  },
  {
    id: "vinales",
    placement: "land",
    heights: [
      49,
      71,
      91,
      66,
      40
    ],
    detail: "karst"
  },
  {
    id: "sanpedroroca",
    placement: "coastal",
    heights: [
      56,
      41,
      72,
      48,
      61
    ],
    detail: "bastions"
  },
  {
    id: "mornetrois",
    placement: "land",
    heights: [
      42,
      68,
      95,
      61,
      35
    ],
    detail: "steam"
  },
  {
    id: "santodomingo",
    placement: "land",
    heights: [
      36,
      49,
      68,
      45,
      30
    ],
    detail: "arcade"
  },
  {
    id: "galapagos",
    placement: "sea",
    heights: [
      27,
      48,
      76,
      43,
      21
    ],
    detail: "turtle"
  },
  {
    id: "sangay",
    placement: "land",
    heights: [
      41,
      72,
      101,
      64,
      34
    ],
    detail: "steam"
  },
  {
    id: "antiguaguatemala",
    placement: "land",
    heights: [
      40,
      59,
      79,
      55,
      32
    ],
    detail: "arcade"
  },
  {
    id: "quirigua",
    placement: "land",
    heights: [
      48,
      71,
      93,
      65,
      39
    ],
    detail: "engravings"
  },
  {
    id: "rioplatano",
    placement: "land",
    heights: [
      50,
      68,
      85,
      63,
      44
    ],
    detail: "forest"
  },
  {
    id: "pitons",
    placement: "coastal",
    heights: [
      17,
      100,
      31,
      91,
      19
    ],
    detail: "twin"
  },
  {
    id: "eltajin",
    placement: "land",
    heights: [
      24,
      45,
      81,
      48,
      22
    ],
    detail: "niches"
  },
  {
    id: "paquime",
    placement: "land",
    heights: [
      21,
      39,
      62,
      34,
      18
    ],
    detail: "earth"
  },
  {
    id: "vizcaino",
    placement: "sea",
    heights: [
      13,
      22,
      34,
      20,
      11
    ],
    detail: "whale"
  },
  {
    id: "xochicalco",
    placement: "land",
    heights: [
      26,
      47,
      79,
      44,
      23
    ],
    detail: "relief"
  },
  {
    id: "monarch",
    placement: "land",
    heights: [
      48,
      67,
      84,
      61,
      42
    ],
    detail: "butterflies"
  },
  {
    id: "pinacate",
    placement: "land",
    heights: [
      32,
      55,
      72,
      47,
      26
    ],
    detail: "crater"
  },
  {
    id: "padretembleque",
    placement: "river",
    heights: [
      32,
      47,
      59,
      46,
      30
    ],
    detail: "arches"
  },
  {
    id: "coiba",
    placement: "sea",
    heights: [
      29,
      52,
      71,
      45,
      22
    ],
    detail: "fish"
  },
  {
    id: "chavin",
    placement: "land",
    heights: [
      35,
      53,
      73,
      48,
      29
    ],
    detail: "relief"
  },
  {
    id: "huascaran",
    placement: "land",
    heights: [
      55,
      82,
      106,
      79,
      47
    ],
    detail: "snow"
  },
  {
    id: "caral",
    placement: "land",
    heights: [
      21,
      43,
      74,
      39,
      19
    ],
    detail: "platforms"
  },
  {
    id: "chankillo",
    placement: "land",
    heights: [
      38,
      55,
      70,
      53,
      34
    ],
    detail: "sun"
  },
  {
    id: "paramaribo",
    placement: "land",
    heights: [
      34,
      48,
      65,
      42,
      28
    ],
    detail: "timber"
  },
  {
    id: "redwood",
    placement: "land",
    heights: [
      65,
      85,
      107,
      89,
      59
    ],
    detail: "gianttrees"
  },
  {
    id: "olympic",
    placement: "land",
    heights: [
      55,
      77,
      98,
      73,
      47
    ],
    detail: "forest"
  },
  {
    id: "cahokia",
    placement: "land",
    heights: [
      19,
      40,
      67,
      36,
      17
    ],
    detail: "mounds"
  },
  {
    id: "hawaiivolcanoes",
    placement: "land",
    heights: [
      25,
      48,
      79,
      43,
      22
    ],
    detail: "lava"
  },
  {
    id: "colonia",
    placement: "coastal",
    heights: [
      30,
      44,
      59,
      39,
      26
    ],
    detail: "sail"
  },
  {
    id: "canaima",
    placement: "river",
    heights: [
      73,
      98,
      85,
      103,
      59
    ],
    detail: "waterfall"
  },
  {
    id: "kakadu",
    placement: "river",
    heights: [
      38,
      58,
      77,
      53,
      32
    ],
    detail: "waterbirds"
  },
  {
    id: "uluru",
    placement: "land",
    heights: [
      31,
      68,
      76,
      65,
      27
    ],
    detail: "monolith"
  },
  {
    id: "sharkbay",
    placement: "sea",
    heights: [
      12,
      24,
      36,
      21,
      10
    ],
    detail: "stromatolite"
  },
  {
    id: "bluemountains",
    placement: "land",
    heights: [
      63,
      82,
      91,
      76,
      49
    ],
    detail: "forest"
  },
  {
    id: "purnululu",
    placement: "land",
    heights: [
      45,
      69,
      88,
      62,
      38
    ],
    detail: "bands"
  },
  {
    id: "ningaloo",
    placement: "sea",
    heights: [
      16,
      29,
      42,
      26,
      14
    ],
    detail: "whaleshark"
  },
  {
    id: "tongariro",
    placement: "land",
    heights: [
      39,
      69,
      97,
      63,
      33
    ],
    detail: "steam"
  },
  {
    id: "tewahipounamu",
    placement: "coastal",
    heights: [
      59,
      81,
      96,
      74,
      46
    ],
    detail: "ice"
  },
  {
    id: "levuka",
    placement: "coastal",
    heights: [
      27,
      41,
      54,
      36,
      23
    ],
    detail: "timber"
  },
  {
    id: "roimata",
    placement: "coastal",
    heights: [
      24,
      47,
      68,
      41,
      20
    ],
    detail: "quiet"
  },
  {
    id: "eastrennell",
    placement: "sea",
    heights: [
      21,
      38,
      56,
      34,
      18
    ],
    detail: "lagoon"
  },
  {
    id: "kuk",
    placement: "land",
    heights: [
      17,
      31,
      46,
      28,
      15
    ],
    detail: "drainage"
  },
  {
    id: "bagerhat",
    placement: "land",
    heights: [
      26,
      47,
      68,
      43,
      24
    ],
    detail: "brick"
  },
  {
    id: "paharpur",
    placement: "land",
    heights: [
      25,
      48,
      86,
      44,
      22
    ],
    detail: "terracotta"
  },
  {
    id: "preahvihear",
    placement: "land",
    heights: [
      38,
      59,
      81,
      54,
      32
    ],
    detail: "stairs"
  },
  {
    id: "kohker",
    placement: "land",
    heights: [
      23,
      44,
      90,
      46,
      21
    ],
    detail: "steps"
  },
  {
    id: "komodo",
    placement: "sea",
    heights: [
      32,
      59,
      81,
      51,
      26
    ],
    detail: "dragon"
  },
  {
    id: "prambanan",
    placement: "land",
    heights: [
      46,
      74,
      104,
      70,
      40
    ],
    detail: "towers"
  },
  {
    id: "balisubak",
    placement: "river",
    heights: [
      23,
      42,
      61,
      37,
      20
    ],
    detail: "channels"
  },
  {
    id: "kinabalu",
    placement: "land",
    heights: [
      54,
      84,
      102,
      76,
      45
    ],
    detail: "granite"
  },
  {
    id: "gunungmulu",
    placement: "land",
    heights: [
      63,
      89,
      104,
      78,
      52
    ],
    detail: "cave"
  },
  {
    id: "puertoprincesa",
    placement: "river",
    heights: [
      52,
      76,
      92,
      69,
      43
    ],
    detail: "caveriver"
  },
  {
    id: "tubbataha",
    placement: "sea",
    heights: [
      14,
      27,
      41,
      25,
      12
    ],
    detail: "fish"
  },
  {
    id: "cordilleraterraces",
    placement: "river",
    heights: [
      29,
      49,
      72,
      44,
      25
    ],
    detail: "channels"
  },
  {
    id: "hue",
    placement: "land",
    heights: [
      34,
      52,
      77,
      48,
      30
    ],
    detail: "tiles"
  },
  {
    id: "hoian",
    placement: "land",
    heights: [
      35,
      47,
      61,
      43,
      29
    ],
    detail: "timber"
  },
  {
    id: "trangan",
    placement: "river",
    heights: [
      51,
      79,
      99,
      72,
      43
    ],
    detail: "karst"
  },
  {
    id: "anuradhapura",
    placement: "land",
    heights: [
      24,
      46,
      83,
      43,
      21
    ],
    detail: "bodhi"
  },
  {
    id: "galle",
    placement: "coastal",
    heights: [
      48,
      36,
      67,
      41,
      55
    ],
    detail: "bastions"
  },
  {
    id: "dambulla",
    placement: "land",
    heights: [
      55,
      77,
      89,
      68,
      45
    ],
    detail: "niches"
  },
  {
    id: "gyeongju",
    placement: "land",
    heights: [
      24,
      41,
      58,
      37,
      20
    ],
    detail: "mounds"
  },
  {
    id: "hahoeyangdong",
    placement: "land",
    heights: [
      32,
      46,
      63,
      42,
      27
    ],
    detail: "tiles"
  },
  {
    id: "namhansanseong",
    placement: "land",
    heights: [
      57,
      41,
      78,
      47,
      62
    ],
    detail: "bastions"
  },
  {
    id: "seowon",
    placement: "land",
    heights: [
      26,
      39,
      57,
      36,
      23
    ],
    detail: "tiles"
  },
  {
    id: "qinmausoleum",
    placement: "land",
    heights: [
      38,
      57,
      78,
      53,
      32
    ],
    detail: "army"
  },
  {
    id: "pingyao",
    placement: "land",
    heights: [
      51,
      38,
      74,
      43,
      57
    ],
    detail: "bastions"
  },
  {
    id: "yungang",
    placement: "land",
    heights: [
      64,
      87,
      101,
      79,
      52
    ],
    detail: "niches"
  },
  {
    id: "westlake",
    placement: "river",
    heights: [
      22,
      39,
      57,
      34,
      19
    ],
    detail: "causeway"
  },
  {
    id: "haniterraces",
    placement: "river",
    heights: [
      26,
      47,
      69,
      42,
      23
    ],
    detail: "channels"
  },
  {
    id: "pattadakal",
    placement: "land",
    heights: [
      39,
      62,
      88,
      57,
      33
    ],
    detail: "towers"
  },
  {
    id: "shivajiterminus",
    placement: "land",
    heights: [
      47,
      69,
      96,
      65,
      41
    ],
    detail: "clock"
  },
  {
    id: "nalanda",
    placement: "land",
    heights: [
      22,
      40,
      62,
      36,
      19
    ],
    detail: "brick"
  },
  {
    id: "bam",
    placement: "land",
    heights: [
      56,
      42,
      82,
      49,
      63
    ],
    detail: "earth"
  },
  {
    id: "shushtar",
    placement: "river",
    heights: [
      29,
      46,
      64,
      41,
      25
    ],
    detail: "wheel"
  },
  {
    id: "gonbadeqabus",
    placement: "land",
    heights: [
      0,
      20,
      105,
      18,
      0
    ],
    detail: "flutes"
  },
  {
    id: "cappadocia",
    placement: "land",
    heights: [
      42,
      74,
      96,
      66,
      35
    ],
    detail: "niches"
  },
  {
    id: "nemrut",
    placement: "land",
    heights: [
      44,
      66,
      89,
      60,
      37
    ],
    detail: "heads"
  },
  {
    id: "pamukkale",
    placement: "river",
    heights: [
      27,
      49,
      70,
      44,
      24
    ],
    detail: "whitewater"
  },
  {
    id: "troy",
    placement: "land",
    heights: [
      20,
      38,
      56,
      32,
      17
    ],
    detail: "brick"
  },
  {
    id: "baalbek",
    placement: "land",
    heights: [
      40,
      65,
      91,
      61,
      34
    ],
    detail: "columns"
  },
  {
    id: "byblos",
    placement: "coastal",
    heights: [
      23,
      43,
      61,
      37,
      20
    ],
    detail: "seabird"
  },
  {
    id: "quseiramra",
    placement: "land",
    heights: [
      22,
      41,
      61,
      38,
      19
    ],
    detail: "fresco"
  },
  {
    id: "wadirum",
    placement: "land",
    heights: [
      66,
      91,
      78,
      102,
      52
    ],
    detail: "archrock"
  },
  {
    id: "atturaif",
    placement: "land",
    heights: [
      33,
      51,
      73,
      46,
      27
    ],
    detail: "earth"
  },
  {
    id: "alahsa",
    placement: "land",
    heights: [
      24,
      44,
      62,
      39,
      21
    ],
    detail: "palm"
  },
  {
    id: "alzubarah",
    placement: "land",
    heights: [
      44,
      32,
      62,
      38,
      49
    ],
    detail: "bastions"
  },
  {
    id: "alain",
    placement: "land",
    heights: [
      25,
      41,
      58,
      36,
      22
    ],
    detail: "palm"
  },
  {
    id: "shirakami",
    placement: "land",
    heights: [
      50,
      72,
      88,
      66,
      45
    ],
    detail: "forest"
  },
  {
    id: "ogasawara",
    placement: "sea",
    heights: [
      25,
      49,
      70,
      43,
      21
    ],
    detail: "seabird"
  },
  {
    id: "tomioka",
    placement: "land",
    heights: [
      35,
      48,
      64,
      43,
      28
    ],
    detail: "silk"
  },
  {
    id: "salzburg",
    placement: "land",
    heights: [
      45,
      66,
      89,
      60,
      37
    ],
    detail: "dome"
  },
  {
    id: "hallstatt",
    placement: "river",
    heights: [
      58,
      79,
      94,
      71,
      44
    ],
    detail: "lakeside"
  },
  {
    id: "berne",
    placement: "land",
    heights: [
      42,
      57,
      78,
      52,
      34
    ],
    detail: "arcade"
  },
  {
    id: "stgall",
    placement: "land",
    heights: [
      39,
      64,
      87,
      61,
      35
    ],
    detail: "library"
  },
  {
    id: "wurzburg",
    placement: "land",
    heights: [
      37,
      54,
      74,
      51,
      31
    ],
    detail: "garden"
  },
  {
    id: "trier",
    placement: "land",
    heights: [
      34,
      71,
      43,
      75,
      30
    ],
    detail: "arches"
  },
  {
    id: "speicherstadt",
    placement: "river",
    heights: [
      49,
      62,
      78,
      57,
      42
    ],
    detail: "brick"
  },
  {
    id: "kronborg",
    placement: "coastal",
    heights: [
      63,
      47,
      88,
      52,
      69
    ],
    detail: "spires"
  },
  {
    id: "ilulissat",
    placement: "sea",
    heights: [
      49,
      76,
      99,
      69,
      41
    ],
    detail: "ice"
  },
  {
    id: "suomenlinna",
    placement: "coastal",
    heights: [
      39,
      29,
      58,
      34,
      44
    ],
    detail: "bastions"
  },
  {
    id: "rauma",
    placement: "land",
    heights: [
      34,
      47,
      63,
      42,
      29
    ],
    detail: "timber"
  },
  {
    id: "orangetheatre",
    placement: "land",
    heights: [
      28,
      51,
      73,
      49,
      25
    ],
    detail: "stagewall"
  },
  {
    id: "cordouan",
    placement: "sea",
    heights: [
      0,
      29,
      102,
      25,
      0
    ],
    detail: "beacon"
  },
  {
    id: "maisoncarree",
    placement: "land",
    heights: [
      41,
      65,
      82,
      63,
      36
    ],
    detail: "columns"
  },
  {
    id: "edinburgh",
    placement: "land",
    heights: [
      55,
      72,
      96,
      64,
      43
    ],
    detail: "spires"
  },
  {
    id: "pontcysyllte",
    placement: "river",
    heights: [
      35,
      51,
      64,
      50,
      32
    ],
    detail: "ironwater"
  },
  {
    id: "kew",
    placement: "land",
    heights: [
      20,
      39,
      62,
      37,
      18
    ],
    detail: "glasshouse"
  },
  {
    id: "delphi",
    placement: "land",
    heights: [
      35,
      56,
      81,
      51,
      29
    ],
    detail: "columns"
  },
  {
    id: "epidaurus",
    placement: "land",
    heights: [
      26,
      46,
      65,
      43,
      23
    ],
    detail: "theatre"
  },
  {
    id: "mycenae",
    placement: "land",
    heights: [
      40,
      70,
      45,
      74,
      36
    ],
    detail: "cyclopean"
  },
  {
    id: "brunaboinne",
    placement: "land",
    heights: [
      21,
      44,
      65,
      41,
      18
    ],
    detail: "spiral"
  },
  {
    id: "thingvellir",
    placement: "land",
    heights: [
      47,
      68,
      83,
      59,
      37
    ],
    detail: "rift"
  },
  {
    id: "agrigento",
    placement: "land",
    heights: [
      36,
      62,
      86,
      58,
      31
    ],
    detail: "columns"
  },
  {
    id: "cinqueterre",
    placement: "coastal",
    heights: [
      48,
      68,
      89,
      61,
      39
    ],
    detail: "terracedtown"
  },
  {
    id: "bryggen",
    placement: "coastal",
    heights: [
      46,
      59,
      76,
      55,
      40
    ],
    detail: "timber"
  },
  {
    id: "tomar",
    placement: "land",
    heights: [
      33,
      55,
      82,
      51,
      29
    ],
    detail: "roundchurch"
  },
  {
    id: "teide",
    placement: "land",
    heights: [
      40,
      73,
      106,
      68,
      34
    ],
    detail: "lava"
  }
];

// plugins/orcatopia/src/water-themes.ts
var marineMotifs = ["fish", "turtle", "whale", "seagrass"];
var additionalWaterThemes = [
  ...water_catalog_default.map((entry) => ({
    id: entry.record.id,
    placement: entry.surface,
    gift: entry.surface === "river" ? "lotus" : entry.record.id === "bluehole" || entry.record.id === "geirangerfjord" ? "buoy" : "coral",
    special: entry.surface === "river" ? entry.record.id === "middlerhine" ? "waterwheel" : "raft" : entry.record.id === "greatbarrierreef" ? "buoy" : "sailboat"
  })),
  ...catalog_600_default.filter((entry) => entry.placement !== "land").map((entry) => ({
    id: entry.id,
    placement: entry.placement,
    gift: entry.placement === "river" ? "lotus" : "buoy",
    special: entry.placement === "river" ? "raft" : "sailboat"
  })),
  ...catalog_700_default.map((entry) => ({
    id: entry.record.id,
    placement: entry.surface,
    gift: entry.surface === "river" ? "lotus" : marineMotifs.includes(entry.visual.motif) ? "coral" : "buoy",
    special: entry.surface === "river" ? ["lock", "lift", "wheel"].includes(entry.visual.motif) ? "waterwheel" : "raft" : marineMotifs.includes(entry.visual.motif) ? "buoy" : "sailboat"
  }))
];
var expandedWaterIds = new Set(
  additionalWaterThemes.map((theme) => theme.id)
);
var waterThemes = [
  { id: "halong", placement: "sea", gift: "buoy", special: "sailboat" },
  { id: "papahanaumokuakea", placement: "sea", gift: "coral", special: "buoy" },
  ...["montsaintmichel", "venice", "nanmadol", "liberty", "opera", "belem"].map(
    (id) => ({
      id,
      placement: "coastal",
      gift: "buoy",
      special: "sailboat"
    })
  ),
  ...["mostar", "pontdugard", "kinderdijk", "grandcanal", "dujiangyan"].map(
    (id) => ({
      id,
      placement: "river",
      gift: "lotus",
      special: ["kinderdijk", "dujiangyan"].includes(id) ? "waterwheel" : "raft"
    })
  ),
  ...additionalWaterThemes
];
var byId2 = new Map(waterThemes.map((t) => [t.id, t]));
var waterTheme = (id) => byId2.get(id.endsWith("+") ? id.slice(0, -1) : id);
var waterShapeNames = {
  coral: ["coral garden", "\uC0B0\uD638 \uC815\uC6D0"],
  buoy: ["navigation buoy", "\uD56D\uB85C \uBD80\uD45C"],
  sailboat: ["sailboat", "\uBC94\uC120"],
  lotus: ["floating lotus bed", "\uC218\uC0C1 \uC5F0\uAF43\uBC2D"],
  raft: ["river raft", "\uAC15 \uB5CF\uBAA9"],
  waterwheel: ["waterwheel", "\uBB3C\uB808\uBC29\uC544"]
};

// plugins/orcatopia/src/world.ts
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

// plugins/orcatopia/src/placement.ts
function placementType(id) {
  return waterTheme(baseId(id))?.placement ?? "land";
}
var isWorldCell = (cell) => Number.isInteger(cell) && Boolean(tiles[cell]);
var allowsSea = (id) => ["sea", "coastal"].includes(placementType(id));
var allowsRiver = (id) => placementType(id) === "river";

// plugins/orcatopia/src/water-decorations.ts
var waterDecorations = waterThemes.flatMap((theme) => {
  const landmark = landmarks_default.find((l) => l.id === theme.id);
  return [theme.gift, theme.special].map((shape, index) => ({
    id: `${theme.id}-${expandedWaterIds.has(theme.id) ? "" : "water-"}${index === 0 ? "gift" : "special"}`,
    name: `${landmark.name} ${waterShapeNames[shape][0]}`,
    landmark: theme.id,
    cost: index === 0 ? 3 : 6,
    gift: index === 0,
    shape,
    surface: theme.placement === "river" ? "river" : "sea",
    color: theme.placement === "river" ? "#85b995" : "#68b8c4",
    walkable: false
  }));
});

// plugins/orcatopia/src/landmark-expansion.json
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
  },
  {
    id: "greatbarrierreef",
    name: "Great Barrier Reef",
    nameKo: "\uADF8\uB808\uC774\uD2B8\uBC30\uB9AC\uC5B4\uB9AC\uD504",
    shape: "reef",
    feature: "Coral gardens and shallow lagoons spread along northeastern Australia, providing habitats for marine turtles, dugongs and many kinds of reef fish. The miniature represents part of this extensive marine landscape.",
    featureKo: "\uD638\uC8FC \uBD81\uB3D9\uBD80 \uBC14\uB2E4\uC5D0 \uC0B0\uD638\uCD08\uC640 \uC595\uC740 \uC11D\uD638\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4. \uBC14\uB2E4\uAC70\uBD81\uACFC \uB4C0\uACF5, \uB2E4\uC591\uD55C \uC0B0\uD638\uCD08 \uBB3C\uACE0\uAE30\uAC00 \uC0B4\uC544\uAC00\uB294 \uB113\uC740 \uD574\uC591 \uACBD\uAD00\uC758 \uC77C\uBD80\uB97C \uC791\uC740 \uBAA8\uD615\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
    seed: 201,
    color: "#5ab7ad"
  },
  {
    id: "bluehole",
    name: "Great Blue Hole",
    nameKo: "\uADF8\uB808\uC774\uD2B8\uBE14\uB8E8\uD640",
    shape: "reef",
    feature: "A deep circular marine sinkhole opens within Lighthouse Reef in Belize. Blue Hole Natural Monument is one of the protected areas of the Belize Barrier Reef Reserve System; its dark water contrasts with the surrounding shallows.",
    featureKo: "\uBCA8\uB9AC\uC988 \uB77C\uC774\uD2B8\uD558\uC6B0\uC2A4\uB9AC\uD504 \uC548\uCABD\uC5D0 \uB465\uADFC \uD574\uC591 \uC2F1\uD06C\uD640\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4. \uBCA8\uB9AC\uC988 \uC0B0\uD638\uCD08 \uBCF4\uD638\uAD6C\uC5ED\uC744 \uC774\uB8E8\uB294 \uBE14\uB8E8\uD640 \uC790\uC5F0\uAE30\uB150\uBB3C\uB85C, \uC9D9\uC740 \uBB3C\uBE5B\uACFC \uC8FC\uBCC0\uC758 \uC595\uC740 \uBC14\uB2E4\uAC00 \uB69C\uB837\uD558\uAC8C \uB300\uBE44\uB429\uB2C8\uB2E4.",
    seed: 202,
    color: "#4f9fac"
  },
  {
    id: "geirangerfjord",
    name: "Geirangerfjord",
    nameKo: "\uAC8C\uC774\uB791\uC5D0\uB974\uD53C\uC624\uB974",
    shape: "fjord",
    feature: "Steep rock walls enclose a narrow arm of the sea in western Norway. Waterfalls descend from the mountain sides into the fjord, one of the two fjord areas recognized in the West Norwegian Fjords World Heritage property.",
    featureKo: "\uB178\uB974\uC6E8\uC774 \uC11C\uBD80\uC758 \uAC00\uD30C\uB978 \uC554\uBCBD \uC0AC\uC774\uB85C \uC881\uACE0 \uAE34 \uBC14\uB2F7\uAE38\uC774 \uB4E4\uC5B4\uC635\uB2C8\uB2E4. \uC0B0\uBE44\uD0C8\uC758 \uD3ED\uD3EC\uAC00 \uD53C\uC624\uB974\uB85C \uD758\uB7EC\uB4E4\uBA70, \uB178\uB974\uC6E8\uC774 \uC11C\uBD80 \uD53C\uC624\uB974 \uC138\uACC4\uC720\uC0B0\uC744 \uC774\uB8E8\uB294 \uB450 \uC9C0\uC5ED \uC911 \uD558\uB098\uC785\uB2C8\uB2E4.",
    seed: 203,
    color: "#759eaf"
  },
  {
    id: "rockislands",
    name: "Rock Islands Southern Lagoon",
    nameKo: "\uD314\uB77C\uC6B0 \uB85D\uC544\uC77C\uB79C\uB4DC",
    shape: "island",
    feature: "Green limestone islets rise from turquoise lagoons in Palau. Their undercut, mushroom-like profiles sit among coral reefs, while the wider Rock Islands landscape includes marine lakes and traces of former island settlements.",
    featureKo: "\uD314\uB77C\uC6B0\uC758 \uCCAD\uB85D\uBE5B \uC11D\uD638 \uC704\uB85C \uCD08\uB85D\uBE5B \uC11D\uD68C\uC554 \uC12C\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4. \uC544\uB7AB\uBD80\uBD84\uC774 \uAE4E\uC778 \uBC84\uC12F \uBAA8\uC591 \uC12C\uACFC \uC0B0\uD638\uCD08\uAC00 \uC5B4\uC6B0\uB7EC\uC9C0\uBA70, \uC8FC\uBCC0\uC5D0\uB294 \uD574\uC591 \uD638\uC218\uC640 \uC61B \uC12C \uACF5\uB3D9\uCCB4\uC758 \uD754\uC801\uB3C4 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4.",
    seed: 204,
    color: "#68b6a2"
  },
  {
    id: "liriver",
    name: "Li River Karst",
    nameKo: "\uB9AC\uAC15 \uCE74\uB974\uC2A4\uD2B8",
    shape: "coast",
    feature: "Towering limestone peaks line the Li River around Guilin. The Lijiang karst component of South China Karst preserves a landscape of steep green hills and river corridors, represented here by a small riverside scene.",
    featureKo: "\uAD6C\uC774\uB9B0\uC758 \uB9AC\uAC15\uC744 \uB530\uB77C \uAC00\uD30C\uB978 \uC11D\uD68C\uC554 \uBD09\uC6B0\uB9AC\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4. \uC911\uAD6D \uB0A8\uBD80 \uCE74\uB974\uC2A4\uD2B8 \uC720\uC0B0\uC758 \uB9AC\uC7A5 \uAD6C\uC5ED\uC5D0 \uC18D\uD55C \uC0B0\uBD09\uC6B0\uB9AC\uC640 \uAC15\uBCC0 \uD48D\uACBD\uC744 \uC791\uC740 \uBAA8\uD615\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
    seed: 205,
    color: "#77aaa0"
  },
  {
    id: "middlerhine",
    name: "Upper Middle Rhine Valley",
    nameKo: "\uB77C\uC778\uAC15 \uC911\uC0C1\uB958 \uACC4\uACE1",
    shape: "castle",
    feature: "Castles, vineyard slopes and historic towns follow the Middle Rhine in Germany. The World Heritage cultural landscape records centuries of settlement and travel along the river; the miniature combines a river bend and a hillside castle.",
    featureKo: "\uB3C5\uC77C \uB77C\uC778\uAC15\uC744 \uB530\uB77C \uACE0\uC131\uACFC \uD3EC\uB3C4\uBC2D, \uC624\uB798\uB41C \uB9C8\uC744\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4. \uC218\uBC31 \uB144 \uB3D9\uC548 \uAC15\uACFC \uD568\uAED8 \uC0B4\uC544\uC628 \uBB38\uD654\uACBD\uAD00\uC744 \uAD7D\uC774\uCE58\uB294 \uBB3C\uAE38\uACFC \uC5B8\uB355 \uC704 \uC131\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
    seed: 206,
    color: "#9baf86"
  },
  {
    id: "jam",
    name: "Minaret of Jam",
    nameKo: "\uC7A0\uC758 \uBBF8\uB098\uB808\uD2B8",
    shape: "minaret",
    feature: "An intricately decorated brick minaret rises in a remote mountain valley",
    featureKo: "\uC678\uB534 \uC0B0\uACE8\uC9DC\uAE30\uC5D0 \uC815\uAD50\uD55C \uBCBD\uB3CC \uC7A5\uC2DD\uC744 \uB450\uB978 \uBBF8\uB098\uB808\uD2B8\uAC00 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 207,
    color: "#b69772"
  },
  {
    id: "bamiyan",
    name: "Bamiyan Valley",
    nameKo: "\uBC14\uBBF8\uC548 \uACC4\uACE1",
    shape: "cliffbuddha",
    feature: "Tall niches and Buddhist cave sanctuaries survive along the valley's sandstone cliffs",
    featureKo: "\uACC4\uACE1\uC758 \uC0AC\uC554 \uC808\uBCBD\uC5D0 \uCEE4\uB2E4\uB780 \uAC10\uC2E4\uACFC \uBD88\uAD50 \uC11D\uAD74 \uC0AC\uC6D0\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 208,
    color: "#c4ac88"
  },
  {
    id: "butrint",
    name: "Butrint",
    nameKo: "\uBD80\uD2B8\uB9B0\uD2B8",
    shape: "theatre",
    feature: "A Greek and Roman archaeological city occupies a peninsula beside a lagoon",
    featureKo: "\uC11D\uD638 \uC606 \uBC18\uB3C4\uC5D0 \uADF8\uB9AC\uC2A4\uC640 \uB85C\uB9C8 \uC2DC\uB300 \uB3C4\uC2DC \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 209,
    color: "#aeb9a0"
  },
  {
    id: "berat",
    name: "Berat and Gjirokastra",
    nameKo: "\uBCA0\uB77C\uD2B8\uC640 \uC9C0\uB85C\uCE74\uC2A4\uD2B8\uB77C",
    shape: "town",
    feature: "Ottoman-period houses climb the slopes of two historic Albanian towns",
    featureKo: "\uC54C\uBC14\uB2C8\uC544\uC758 \uB450 \uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uC624\uC2A4\uB9CC \uC2DC\uB300 \uC8FC\uD0DD\uC774 \uC0B0\uBE44\uD0C8\uC744 \uB530\uB77C \uB4E4\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 210,
    color: "#bc8b70"
  },
  {
    id: "haghpat",
    name: "Haghpat and Sanahin Monasteries",
    nameKo: "\uD558\uADF8\uD30C\uD2B8\uC640 \uC0AC\uB098\uD78C \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "Medieval Armenian monasteries combine domed churches with local vernacular building traditions",
    featureKo: "\uC911\uC138 \uC544\uB974\uBA54\uB2C8\uC544 \uC218\uB3C4\uC6D0\uC5D0\uC11C \uB3D4 \uAD50\uD68C\uC640 \uD1A0\uCC29 \uAC74\uCD95 \uC804\uD1B5\uC774 \uC5B4\uC6B0\uB7EC\uC9D1\uB2C8\uB2E4",
    seed: 211,
    color: "#8baba4"
  },
  {
    id: "geghard",
    name: "Geghard Monastery",
    nameKo: "\uAC8C\uD558\uB974\uD2B8 \uC218\uB3C4\uC6D0",
    shape: "rocktemple",
    feature: "Churches and tombs are cut into rock within the steep Upper Azat Valley",
    featureKo: "\uAC00\uD30C\uB978 \uC544\uC790\uD2B8 \uACC4\uACE1\uC758 \uBC14\uC704 \uC18D\uC5D0 \uAD50\uD68C\uC640 \uBB34\uB364\uC774 \uC0C8\uACA8\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 212,
    color: "#d3b17c"
  },
  {
    id: "zvartnots",
    name: "Echmiatsin and Zvartnots",
    nameKo: "\uC5D0\uCE58\uBBF8\uC544\uC9C4\uACFC \uC988\uBC14\uB974\uD2B8\uB178\uCE20",
    shape: "ruins",
    feature: "Early Armenian churches and the remains of Zvartnots illustrate the development of central-domed architecture",
    featureKo: "\uCD08\uAE30 \uC544\uB974\uBA54\uB2C8\uC544 \uAD50\uD68C\uC640 \uC988\uBC14\uB974\uD2B8\uB178\uCE20 \uC720\uC801\uC774 \uC911\uC559 \uB3D4 \uAC74\uCD95\uC758 \uBC1C\uC804\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 213,
    color: "#b7a28c"
  },
  {
    id: "bakuwalled",
    name: "Walled City of Baku",
    nameKo: "\uBC14\uCFE0 \uC131\uACFD\uB3C4\uC2DC",
    shape: "fortress",
    feature: "The Maiden Tower and Shirvanshah palace stand within Baku's surviving fortified city",
    featureKo: "\uBC14\uCFE0\uC758 \uC131\uACFD \uC548\uC5D0 \uCC98\uB140\uC758 \uD0D1\uACFC \uC2DC\uB974\uBC18\uC0E4 \uAD81\uC804\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 214,
    color: "#829b8a"
  },
  {
    id: "gobustan",
    name: "Gobustan Rock Art",
    nameKo: "\uACE0\uBD80\uC2A4\uD0C4 \uC554\uAC01\uD654",
    shape: "redrocks",
    feature: "Thousands of rock engravings record long human occupation among a plateau of rocky boulders",
    featureKo: "\uBC14\uC704\uAC00 \uB110\uB9B0 \uACE0\uC6D0\uC5D0 \uC218\uB9CE\uC740 \uC554\uAC01\uD654\uAC00 \uC624\uB79C \uC778\uAC04\uC758 \uD754\uC801\uC744 \uB0A8\uACBC\uC2B5\uB2C8\uB2E4",
    seed: 215,
    color: "#bca6a0"
  },
  {
    id: "sheki",
    name: "Sheki Khan's Palace",
    nameKo: "\uC170\uD0A4 \uCE78 \uAD81\uC804",
    shape: "palace",
    feature: "The khan's palace anchors a trading town shaped by silk production and caravan routes",
    featureKo: "\uBE44\uB2E8 \uC0DD\uC0B0\uACFC \uB300\uC0C1 \uAD50\uC5ED\uB85C\uB85C \uC131\uC7A5\uD55C \uB3C4\uC2DC\uC758 \uC911\uC2EC\uC5D0 \uCE78\uC758 \uAD81\uC804\uC774 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 216,
    color: "#b69772"
  },
  {
    id: "visegrad",
    name: "Vi\u0161egrad Bridge",
    nameKo: "\uBE44\uC170\uADF8\uB77C\uB4DC \uB2E4\uB9AC",
    shape: "bridge",
    feature: "Eleven masonry arches carry an Ottoman bridge over the Drina River",
    featureKo: "\uC5F4\uD55C \uAC1C\uC758 \uC11D\uC870 \uC544\uCE58\uAC00 \uB4DC\uB9AC\uB098\uAC15 \uC704\uC758 \uC624\uC2A4\uB9CC \uC2DC\uB300 \uB2E4\uB9AC\uB97C \uB5A0\uBC1B\uCE69\uB2C8\uB2E4",
    seed: 217,
    color: "#c4ac88"
  },
  {
    id: "vjetrenica",
    name: "Vjetrenica Cave",
    nameKo: "\uBE44\uC608\uD2B8\uB808\uB2C8\uCC28 \uB3D9\uAD74",
    shape: "cave",
    feature: "A karst cave shelters an exceptionally diverse community of underground animals",
    featureKo: "\uCE74\uB974\uC2A4\uD2B8 \uB3D9\uAD74 \uC548\uC5D0 \uB2E4\uC591\uD55C \uC9C0\uD558 \uB3D9\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 218,
    color: "#aeb9a0"
  },
  {
    id: "boyana",
    name: "Boyana Church",
    nameKo: "\uBCF4\uC57C\uB098 \uAD50\uD68C",
    shape: "basilica",
    feature: "A small medieval church preserves vivid thirteenth-century wall paintings",
    featureKo: "\uC791\uC740 \uC911\uC138 \uAD50\uD68C\uC5D0 \uC0DD\uC0DD\uD55C 13\uC138\uAE30 \uBCBD\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 219,
    color: "#bc8b70"
  },
  {
    id: "madara",
    name: "Madara Rider",
    nameKo: "\uB9C8\uB2E4\uB77C \uAE30\uB9C8\uC0C1",
    shape: "cliff",
    feature: "A carved horseman stands high on a near-vertical cliff above an early Bulgarian sacred site",
    featureKo: "\uCD08\uAE30 \uBD88\uAC00\uB9AC\uC544 \uC131\uC9C0 \uC704\uC758 \uAC00\uD30C\uB978 \uC808\uBCBD\uC5D0 \uB9D0\uC744 \uD0C4 \uC778\uBB3C\uC774 \uC0C8\uACA8\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 220,
    color: "#8baba4"
  },
  {
    id: "kazanlak",
    name: "Thracian Tomb of Kazanlak",
    nameKo: "\uCE74\uC794\uB77C\uD06C \uD2B8\uB77C\uD0A4\uC544 \uBB34\uB364",
    shape: "tomb",
    feature: "A vaulted Thracian tomb preserves painted scenes of a funerary banquet",
    featureKo: "\uB465\uADFC \uCC9C\uC7A5\uC758 \uD2B8\uB77C\uD0A4\uC544 \uBB34\uB364\uC5D0 \uC7A5\uB840 \uC5F0\uD68C \uC7A5\uBA74\uC744 \uADF8\uB9B0 \uBCBD\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 221,
    color: "#d3b17c"
  },
  {
    id: "ivanovo",
    name: "Rock-Hewn Churches of Ivanovo",
    nameKo: "\uC774\uBC14\uB178\uBCF4 \uC554\uAD74\uAD50\uD68C",
    shape: "clifftemple",
    feature: "Medieval churches and monastic cells are carved into the cliffs above a river valley",
    featureKo: "\uAC15 \uACC4\uACE1 \uC704\uC758 \uC808\uBCBD\uC5D0 \uC911\uC138 \uAD50\uD68C\uC640 \uC218\uB3C4\uC2E4\uC774 \uD30C\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 222,
    color: "#b7a28c"
  },
  {
    id: "nessebar",
    name: "Ancient Nessebar",
    nameKo: "\uACE0\uB300 \uB124\uC138\uBC14\uB974",
    shape: "coast",
    feature: "Churches and historic houses cluster on a rocky peninsula in the Black Sea",
    featureKo: "\uD751\uD574\uC758 \uBC14\uC704 \uBC18\uB3C4\uC5D0 \uAD50\uD68C\uC640 \uC61B \uC8FC\uD0DD\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 223,
    color: "#829b8a"
  },
  {
    id: "srebarna",
    name: "Srebarna Nature Reserve",
    nameKo: "\uC2A4\uB808\uBC14\uB974\uB098 \uC790\uC5F0\uBCF4\uD638\uAD6C\uC5ED",
    shape: "wetland",
    feature: "A freshwater lake beside the Danube provides breeding grounds for waterbirds",
    featureKo: "\uB2E4\uB274\uBE0C\uAC15 \uC606 \uB2F4\uC218\uD638\uAC00 \uBB3C\uC0C8\uC758 \uBC88\uC2DD\uC9C0\uAC00 \uB429\uB2C8\uB2E4",
    seed: 224,
    color: "#bca6a0"
  },
  {
    id: "pirin",
    name: "Pirin National Park",
    nameKo: "\uD53C\uB9B0 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "peaks",
    feature: "Alpine peaks, glacial lakes and forests cover the Pirin mountain landscape",
    featureKo: "\uD53C\uB9B0\uC0B0\uB9E5\uC5D0 \uACE0\uC0B0 \uBD09\uC6B0\uB9AC\uC640 \uBE59\uD558\uD638, \uC232\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 225,
    color: "#b69772"
  },
  {
    id: "qalabahrain",
    name: "Qal'at al-Bahrain",
    nameKo: "\uCE7C\uB77C\uD2B8 \uC54C\uBC14\uB808\uC778",
    shape: "fortress",
    feature: "An archaeological mound and coastal fort preserve layers of the ancient Dilmun trading centre",
    featureKo: "\uD574\uC548 \uC694\uC0C8\uC640 \uC720\uC801 \uC5B8\uB355\uC5D0 \uACE0\uB300 \uB51C\uBB38 \uAD50\uC5ED \uC911\uC2EC\uC9C0\uC758 \uD754\uC801\uC774 \uACB9\uACB9\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 226,
    color: "#c4ac88"
  },
  {
    id: "dilmunmounds",
    name: "Dilmun Burial Mounds",
    nameKo: "\uB51C\uBB38 \uACE0\uBD84\uAD70",
    shape: "tomb",
    feature: "Extensive fields of burial mounds reflect the funerary traditions of ancient Dilmun",
    featureKo: "\uB113\uAC8C \uD3BC\uCCD0\uC9C4 \uBD09\uBD84 \uBB34\uB364\uB4E4\uC774 \uACE0\uB300 \uB51C\uBB38\uC758 \uC7A5\uB840 \uC804\uD1B5\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 227,
    color: "#aeb9a0"
  },
  {
    id: "mir",
    name: "Mir Castle",
    nameKo: "\uBBF8\uB974\uC131",
    shape: "castle",
    feature: "A quadrangular castle combines Gothic, Renaissance and Baroque architectural elements",
    featureKo: "\uC0AC\uAC01\uD615 \uC131\uC5D0 \uACE0\uB515\uACFC \uB974\uB124\uC0C1\uC2A4, \uBC14\uB85C\uD06C \uAC74\uCD95 \uC694\uC18C\uAC00 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 228,
    color: "#bc8b70"
  },
  {
    id: "nesvizh",
    name: "Nesvizh Castle",
    nameKo: "\uB124\uC2A4\uBE44\uC2DC\uC131",
    shape: "palace",
    feature: "The Radziwill family's palace complex joins residential buildings with a landscaped setting",
    featureKo: "\uB77C\uC9C0\uBE44\uC6B0 \uAC00\uBB38\uC758 \uAD81\uC804 \uB2E8\uC9C0\uC5D0 \uC8FC\uAC70 \uAC74\uBB3C\uACFC \uC870\uACBD \uACF5\uAC04\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 229,
    color: "#8baba4"
  },
  {
    id: "paphos",
    name: "Paphos",
    nameKo: "\uD30C\uD3EC\uC2A4",
    shape: "ruins",
    feature: "Roman villas preserve richly decorated mosaic floors in an ancient coastal city",
    featureKo: "\uACE0\uB300 \uD574\uC548 \uB3C4\uC2DC\uC758 \uB85C\uB9C8 \uC2DC\uB300 \uC800\uD0DD\uC5D0 \uC815\uAD50\uD55C \uBAA8\uC790\uC774\uD06C \uBC14\uB2E5\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 230,
    color: "#d3b17c"
  },
  {
    id: "troodos",
    name: "Painted Churches of Troodos",
    nameKo: "\uD2B8\uB85C\uB3C4\uC2A4 \uBCBD\uD654\uAD50\uD68C",
    shape: "woodchurch",
    feature: "Mountain churches with steep timber roofs preserve Byzantine wall paintings",
    featureKo: "\uAC00\uD30C\uB978 \uBAA9\uC870 \uC9C0\uBD95\uC744 \uC5B9\uC740 \uC0B0\uC545 \uAD50\uD68C\uC5D0 \uBE44\uC794\uD2F4 \uBCBD\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 231,
    color: "#b7a28c"
  },
  {
    id: "choirokoitia",
    name: "Choirokoitia",
    nameKo: "\uD0A4\uB85C\uD0A4\uD2F0\uC544",
    shape: "roundhouse",
    feature: "Remains of circular stone houses reveal a Neolithic settlement on Cyprus",
    featureKo: "\uB465\uADFC \uC11D\uC870 \uC8FC\uD0DD \uC720\uC801\uC774 \uD0A4\uD504\uB85C\uC2A4\uC758 \uC2E0\uC11D\uAE30 \uC815\uCC29\uC9C0\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 232,
    color: "#829b8a"
  },
  {
    id: "ceskykrumlov",
    name: "\u010Cesk\xFD Krumlov",
    nameKo: "\uCCB4\uC2A4\uD0A4\uD06C\uB8F8\uB85C\uD504",
    shape: "castle",
    feature: "A large castle overlooks a medieval town wrapped in bends of the Vltava River",
    featureKo: "\uCEE4\uB2E4\uB780 \uC131 \uC544\uB798\uB85C \uBE14\uD0C0\uBC14\uAC15 \uAD7D\uC774\uC5D0 \uB458\uB7EC\uC2F8\uC778 \uC911\uC138 \uB3C4\uC2DC\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 233,
    color: "#bca6a0"
  },
  {
    id: "telc",
    name: "Tel\u010D",
    nameKo: "\uD154\uCE58",
    shape: "square",
    feature: "Renaissance and Baroque houses line a historic market square beneath a castle",
    featureKo: "\uC131 \uC544\uB798\uC758 \uC61B \uC2DC\uC7A5 \uAD11\uC7A5\uC744 \uB974\uB124\uC0C1\uC2A4\uC640 \uBC14\uB85C\uD06C \uC8FC\uD0DD\uC774 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 234,
    color: "#b69772"
  },
  {
    id: "zelenahora",
    name: "Zelen\xE1 Hora Pilgrimage Church",
    nameKo: "\uC824\uB808\uB098\uD638\uB77C \uC21C\uB840\uAD50\uD68C",
    shape: "roundtemple",
    feature: "A star-shaped pilgrimage church brings together Gothic and Baroque design",
    featureKo: "\uBCC4 \uBAA8\uC591\uC758 \uC21C\uB840\uAD50\uD68C\uC5D0 \uACE0\uB515\uACFC \uBC14\uB85C\uD06C \uC124\uACC4\uAC00 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 235,
    color: "#c4ac88"
  },
  {
    id: "kutnahora",
    name: "Kutn\xE1 Hora",
    nameKo: "\uCFE0\uD2B8\uB098\uD638\uB77C",
    shape: "cathedral",
    feature: "St Barbara's church rises above a historic town made prosperous by silver mining",
    featureKo: "\uC740\uAD11\uC73C\uB85C \uBC88\uC601\uD55C \uC5ED\uC0AC \uB3C4\uC2DC \uC704\uB85C \uC131 \uBC14\uB974\uBC14\uB77C \uAD50\uD68C\uAC00 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 236,
    color: "#aeb9a0"
  },
  {
    id: "lednice",
    name: "Lednice-Valtice",
    nameKo: "\uB808\uB4DC\uB2C8\uCCB4\uBC1C\uD2F0\uCCB4",
    shape: "palace",
    feature: "Castles, gardens and romantic buildings form an extensive designed landscape",
    featureKo: "\uC131\uACFC \uC815\uC6D0, \uB0AD\uB9CC\uC801\uC778 \uAC74\uBB3C\uB4E4\uC774 \uB113\uC740 \uC870\uACBD \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 237,
    color: "#bc8b70"
  },
  {
    id: "olomouc",
    name: "Holy Trinity Column in Olomouc",
    nameKo: "\uC62C\uB85C\uBAA8\uC6B0\uCE20 \uC0BC\uC704\uC77C\uCCB4 \uAE30\uB150\uC8FC",
    shape: "minaret",
    feature: "A tall Baroque column is covered in religious sculpture in the town square",
    featureKo: "\uB3C4\uC2DC \uAD11\uC7A5\uC758 \uB192\uC740 \uBC14\uB85C\uD06C \uAE30\uB150\uC8FC\uB97C \uC885\uAD50 \uC870\uAC01\uC774 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 238,
    color: "#8baba4"
  },
  {
    id: "kromeriz",
    name: "Krom\u011B\u0159\xED\u017E Gardens and Castle",
    nameKo: "\uD06C\uB85C\uBA54\uB974\uC9C0\uC2DC \uC815\uC6D0\uACFC \uC131",
    shape: "garden",
    feature: "An episcopal residence adjoins formal gardens and a landscaped pleasure garden",
    featureKo: "\uC8FC\uAD50\uC758 \uAC70\uCC98 \uC606\uC5D0 \uC815\uD615\uC2DD \uC815\uC6D0\uACFC \uC870\uACBD \uC815\uC6D0\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 239,
    color: "#d3b17c"
  },
  {
    id: "litomysl",
    name: "Litomy\u0161l Castle",
    nameKo: "\uB9AC\uD1A0\uBBF8\uC290\uC131",
    shape: "palace",
    feature: "An arcaded Renaissance castle is decorated with elaborate sgraffito facades",
    featureKo: "\uC544\uCF00\uC774\uB4DC\uAC00 \uC788\uB294 \uB974\uB124\uC0C1\uC2A4 \uC131\uC758 \uC815\uBA74\uC744 \uC815\uAD50\uD55C \uC2A4\uADF8\uB77C\uD53C\uD1A0 \uC7A5\uC2DD\uC774 \uB36E\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 240,
    color: "#b7a28c"
  },
  {
    id: "mtskheta",
    name: "Mtskheta Monuments",
    nameKo: "\uBBC0\uCE20\uD5E4\uD0C0 \uC720\uC801",
    shape: "basilica",
    feature: "Historic churches in Georgia's former capital illustrate early Christian architecture",
    featureKo: "\uC870\uC9C0\uC544\uC758 \uC61B \uC218\uB3C4\uC5D0 \uC788\uB294 \uAD50\uD68C\uB4E4\uC774 \uCD08\uAE30 \uAE30\uB3C5\uAD50 \uAC74\uCD95\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 241,
    color: "#829b8a"
  },
  {
    id: "svaneti",
    name: "Upper Svaneti",
    nameKo: "\uC0C1\uC2A4\uBC14\uB124\uD2F0",
    shape: "towers",
    feature: "Medieval defensive tower houses stand among mountain villages in the Caucasus",
    featureKo: "\uCF54\uCE74\uC11C\uC2A4 \uC0B0\uC545 \uB9C8\uC744\uC5D0 \uC911\uC138\uC758 \uBC29\uC5B4\uC6A9 \uD0D1\uC9D1\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 242,
    color: "#bca6a0"
  },
  {
    id: "gelati",
    name: "Gelati Monastery",
    nameKo: "\uAC94\uB77C\uD2F0 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A medieval Georgian monastery preserves churches decorated with mosaics and paintings",
    featureKo: "\uC911\uC138 \uC870\uC9C0\uC544 \uC218\uB3C4\uC6D0\uC5D0 \uBAA8\uC790\uC774\uD06C\uC640 \uBCBD\uD654\uB85C \uC7A5\uC2DD\uD55C \uAD50\uD68C\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 243,
    color: "#b69772"
  },
  {
    id: "colchic",
    name: "Colchic Rainforests and Wetlands",
    nameKo: "\uCF5C\uD0A4\uC2A4 \uC6B0\uB9BC\uACFC \uC2B5\uC9C0",
    shape: "wetland",
    feature: "Humid forests and wetlands survive along the warm, wet eastern Black Sea coast",
    featureKo: "\uB530\uB73B\uD558\uACE0 \uBE44\uAC00 \uB9CE\uC740 \uD751\uD574 \uB3D9\uBD80 \uD574\uC548\uC5D0 \uC2B5\uC724\uD55C \uC232\uACFC \uC2B5\uC9C0\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 244,
    color: "#c4ac88"
  },
  {
    id: "split",
    name: "Diocletian's Palace at Split",
    nameKo: "\uC2A4\uD50C\uB9AC\uD2B8 \uB514\uC624\uD074\uB808\uD2F0\uC544\uB204\uC2A4 \uAD81\uC804",
    shape: "palace",
    feature: "A living historic city grew within and around a Roman emperor's palace",
    featureKo: "\uB85C\uB9C8 \uD669\uC81C\uC758 \uAD81\uC804 \uC548\uD30E\uC73C\uB85C \uC624\uB298\uB0A0\uAE4C\uC9C0 \uC0AC\uB78C\uC774 \uC0AC\uB294 \uC5ED\uC0AC \uB3C4\uC2DC\uAC00 \uC790\uB790\uC2B5\uB2C8\uB2E4",
    seed: 245,
    color: "#aeb9a0"
  },
  {
    id: "plitvice",
    name: "Plitvice Lakes",
    nameKo: "\uD50C\uB9AC\uD2B8\uBE44\uCCB4 \uD638\uC218",
    shape: "lakes",
    feature: "Water cascades between terraced lakes divided by natural travertine barriers",
    featureKo: "\uC790\uC5F0\uC801\uC73C\uB85C \uC790\uB780 \uC11D\uD68C\uC9C8 \uB451 \uC0AC\uC774\uB85C \uACC4\uB2E8\uC2DD \uD638\uC218\uC758 \uBB3C\uC774 \uD758\uB7EC\uB0B4\uB9BD\uB2C8\uB2E4",
    seed: 246,
    color: "#bc8b70"
  },
  {
    id: "porec",
    name: "Euphrasian Basilica at Pore\u010D",
    nameKo: "\uD3EC\uB808\uCE58 \uC5D0\uC6B0\uD504\uB77C\uC2DC\uC6B0\uC2A4 \uB300\uC131\uB2F9",
    shape: "basilica",
    feature: "An early Christian episcopal complex preserves outstanding Byzantine mosaics",
    featureKo: "\uCD08\uAE30 \uAE30\uB3C5\uAD50 \uC8FC\uAD50\uC88C \uB2E8\uC9C0\uC5D0 \uB6F0\uC5B4\uB09C \uBE44\uC794\uD2F4 \uBAA8\uC790\uC774\uD06C\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 247,
    color: "#8baba4"
  },
  {
    id: "trogir",
    name: "Historic Trogir",
    nameKo: "\uD2B8\uB85C\uAE30\uB974 \uC5ED\uC0AC\uB3C4\uC2DC",
    shape: "town",
    feature: "Romanesque churches and later palaces fill the compact historic island town",
    featureKo: "\uC791\uC740 \uC12C\uC758 \uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uB85C\uB9C8\uB124\uC2A4\uD06C \uAD50\uD68C\uC640 \uD6C4\uB300\uC758 \uAD81\uC804\uB4E4\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 248,
    color: "#d3b17c"
  },
  {
    id: "sibenik",
    name: "Cathedral of St James in \u0160ibenik",
    nameKo: "\uC2DC\uBCA0\uB2C8\uD06C \uC131 \uC57C\uACE0\uBCF4 \uB300\uC131\uB2F9",
    shape: "dome",
    feature: "A stone cathedral combines Gothic and Renaissance forms beneath a distinctive dome",
    featureKo: "\uB3CC\uB85C \uC9C0\uC740 \uC131\uB2F9\uC5D0 \uACE0\uB515\uACFC \uB974\uB124\uC0C1\uC2A4 \uD615\uC2DD\uC774 \uC5B4\uC6B0\uB7EC\uC9C0\uACE0 \uB3C5\uD2B9\uD55C \uB3D4\uC774 \uC5B9\uD600 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 249,
    color: "#b7a28c"
  },
  {
    id: "starigrad",
    name: "Stari Grad Plain",
    nameKo: "\uC2A4\uD0C0\uB9AC\uADF8\uB77C\uB4DC \uD3C9\uC6D0",
    shape: "terraces",
    feature: "Ancient field divisions remain visible in an agricultural plain on Hvar Island",
    featureKo: "\uD750\uBC14\uB974\uC12C\uC758 \uB18D\uACBD \uD3C9\uC6D0\uC5D0 \uACE0\uB300\uC758 \uACBD\uC791\uC9C0 \uAD6C\uD68D\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 250,
    color: "#829b8a"
  },
  {
    id: "holloko",
    name: "Holl\xF3k\u0151",
    nameKo: "\uD640\uB85C\uCFA8",
    shape: "thatched",
    feature: "A traditional village preserves houses and a rural layout developed before modern agricultural change",
    featureKo: "\uC804\uD1B5 \uB9C8\uC744\uC5D0 \uADFC\uB300 \uB18D\uC5C5 \uBCC0\uD654 \uC774\uC804\uC758 \uC8FC\uD0DD\uACFC \uB18D\uCD0C \uBC30\uCE58\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 251,
    color: "#bca6a0"
  },
  {
    id: "hortobagy",
    name: "Hortob\xE1gy Puszta",
    nameKo: "\uD638\uB974\uD1A0\uBC14\uC9C0 \uD478\uC2A4\uD0C0",
    shape: "savanna",
    feature: "Open grasslands preserve a long tradition of pastoral life on the Hungarian plain",
    featureKo: "\uD5DD\uAC00\uB9AC \uD3C9\uC6D0\uC758 \uB4DC\uB113\uC740 \uCD08\uC9C0\uC5D0 \uC624\uB79C \uBAA9\uCD95 \uC0DD\uD65C\uC758 \uC804\uD1B5\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 252,
    color: "#b69772"
  },
  {
    id: "pannonhalma",
    name: "Pannonhalma Abbey",
    nameKo: "\uD310\uB17C\uD560\uBA38 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A Benedictine abbey crowns a hill and records a long monastic history",
    featureKo: "\uC5B8\uB355 \uC704\uC758 \uBCA0\uB124\uB515\uD2B8\uD68C \uC218\uB3C4\uC6D0\uC774 \uC624\uB79C \uC218\uB3C4 \uC0DD\uD65C\uC758 \uC5ED\uC0AC\uB97C \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 253,
    color: "#c4ac88"
  },
  {
    id: "tokaj",
    name: "Tokaj Wine Landscape",
    nameKo: "\uD1A0\uCEE4\uC774 \uC640\uC778 \uACBD\uAD00",
    shape: "terraces",
    feature: "Vineyards and historic wine cellars form a landscape shaped by Tokaj wine production",
    featureKo: "\uD3EC\uB3C4\uBC2D\uACFC \uC61B \uC640\uC778 \uC800\uC7A5\uACE0\uAC00 \uD1A0\uCEE4\uC774 \uC640\uC778 \uC0DD\uC0B0\uC774 \uBE5A\uC740 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 254,
    color: "#aeb9a0"
  },
  {
    id: "sulaimantoo",
    name: "Sulaiman-Too",
    nameKo: "\uC220\uB77C\uC774\uB9CC\uD22C",
    shape: "peaks",
    feature: "A sacred mountain above Osh contains pilgrimage places, caves and rock carvings",
    featureKo: "\uC624\uC2DC \uC704\uC758 \uC131\uC0B0\uC5D0 \uC21C\uB840 \uC7A5\uC18C\uC640 \uB3D9\uAD74, \uC554\uAC01\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 255,
    color: "#bc8b70"
  },
  {
    id: "yasawi",
    name: "Mausoleum of Khoja Ahmed Yasawi",
    nameKo: "\uD638\uC790 \uC544\uD750\uBA54\uB4DC \uC57C\uC0AC\uC704 \uC601\uBB18",
    shape: "dome",
    feature: "A monumental Timurid mausoleum combines a vast portal with domed chambers",
    featureKo: "\uD2F0\uBB34\uB974 \uC2DC\uB300\uC758 \uAC70\uB300\uD55C \uC601\uBB18\uC5D0 \uB192\uC740 \uC815\uBB38\uACFC \uB3D4\uC744 \uC5B9\uC740 \uBC29\uB4E4\uC774 \uB4E4\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 256,
    color: "#8baba4"
  },
  {
    id: "tanbaly",
    name: "Tanbaly Petroglyphs",
    nameKo: "\uD0C4\uBC1C\uB9AC \uC554\uAC01\uD654",
    shape: "redrocks",
    feature: "Rock engravings and archaeological remains mark a landscape used over many generations",
    featureKo: "\uC5EC\uB7EC \uC138\uB300\uAC00 \uC774\uC6A9\uD55C \uACBD\uAD00\uC5D0 \uC554\uAC01\uD654\uC640 \uACE0\uACE0 \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 257,
    color: "#d3b17c"
  },
  {
    id: "saryarka",
    name: "Saryarka Steppe and Lakes",
    nameKo: "\uC0AC\uB7B4\uB974\uCE74 \uCD08\uC6D0\uACFC \uD638\uC218",
    shape: "wetland",
    feature: "Steppe grasslands and lakes provide important resting places for migratory waterbirds",
    featureKo: "\uCD08\uC6D0\uACFC \uD638\uC218\uAC00 \uCCA0\uC0C8 \uBB3C\uC0C8\uB4E4\uC758 \uC911\uC694\uD55C \uC27C\uD130\uAC00 \uB429\uB2C8\uB2E4",
    seed: 258,
    color: "#b7a28c"
  },
  {
    id: "vilnius",
    name: "Vilnius Historic Centre",
    nameKo: "\uBE4C\uB274\uC2A4 \uC5ED\uC0AC\uC911\uC2EC\uC9C0",
    shape: "town",
    feature: "A historic city preserves a mixture of Gothic, Renaissance, Baroque and classical buildings",
    featureKo: "\uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uACE0\uB515\uACFC \uB974\uB124\uC0C1\uC2A4, \uBC14\uB85C\uD06C, \uACE0\uC804\uC8FC\uC758 \uAC74\uBB3C\uC774 \uD568\uAED8 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 259,
    color: "#829b8a"
  },
  {
    id: "kernave",
    name: "Kernav\u0117",
    nameKo: "\uCF00\uB974\uB098\uBCA0",
    shape: "terraces",
    feature: "Fortified hill mounds overlook archaeological traces of settlements in the Neris Valley",
    featureKo: "\uBC29\uC5B4\uC6A9 \uC5B8\uB355\uB4E4\uC774 \uB124\uB9AC\uC2A4 \uACC4\uACE1\uC758 \uC815\uCC29\uC9C0 \uD754\uC801 \uC704\uB85C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 260,
    color: "#bca6a0"
  },
  {
    id: "kuldiga",
    name: "Old Town of Kuld\u012Bga",
    nameKo: "\uCFE8\uB514\uAC00 \uAD6C\uC2DC\uAC00\uC9C0",
    shape: "town",
    feature: "A historic town preserves streets and buildings associated with the Duchy of Courland",
    featureKo: "\uCFE0\uB97C\uB780\uD2B8 \uACF5\uAD6D\uACFC \uAD00\uB828\uB41C \uAC70\uB9AC\uC640 \uAC74\uBB3C\uB4E4\uC774 \uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 261,
    color: "#b69772"
  },
  {
    id: "durmitor",
    name: "Durmitor National Park",
    nameKo: "\uB450\uB974\uBBF8\uD1A0\uB974 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "peaks",
    feature: "Glaciated mountains rise above deep canyons and clear mountain lakes",
    featureKo: "\uBE59\uD558\uAC00 \uAE4E\uC740 \uC0B0\uB4E4\uC774 \uAE4A\uC740 \uD611\uACE1\uACFC \uB9D1\uC740 \uC0B0\uC545 \uD638\uC218 \uC704\uB85C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 262,
    color: "#c4ac88"
  },
  {
    id: "kotor",
    name: "Kotor Region",
    nameKo: "\uCF54\uD1A0\uB974 \uC9C0\uC5ED",
    shape: "coast",
    feature: "Fortified towns and churches occupy a deeply indented Adriatic bay",
    featureKo: "\uAE4A\uC219\uC774 \uB4E4\uC5B4\uC628 \uC544\uB4DC\uB9AC\uC544\uD574\uC758 \uB9CC\uC744 \uB530\uB77C \uC131\uACFD\uB3C4\uC2DC\uC640 \uAD50\uD68C\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 263,
    color: "#aeb9a0"
  },
  {
    id: "orkhon",
    name: "Orkhon Valley",
    nameKo: "\uC624\uB974\uD63C \uACC4\uACE1",
    shape: "terraces",
    feature: "Grassland, archaeological remains and monastic sites follow the Orkhon River valley",
    featureKo: "\uC624\uB974\uD63C\uAC15 \uACC4\uACE1\uC744 \uB530\uB77C \uCD08\uC6D0\uACFC \uACE0\uACE0 \uC720\uC801, \uC218\uB3C4\uC6D0 \uD130\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 264,
    color: "#bc8b70"
  },
  {
    id: "burkhankhaldun",
    name: "Burkhan Khaldun Mountain",
    nameKo: "\uBD80\uB974\uD55C \uD560\uB454\uC0B0",
    shape: "peaks",
    feature: "A sacred mountain and its surrounding landscape are associated with Mongolian worship traditions",
    featureKo: "\uBABD\uACE8\uC758 \uC2E0\uC559 \uC804\uD1B5\uACFC \uAD00\uB828\uB41C \uC131\uC0B0\uACFC \uC8FC\uBCC0 \uACBD\uAD00\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 265,
    color: "#8baba4"
  },
  {
    id: "deerstones",
    name: "Mongolian Deer Stones",
    nameKo: "\uBABD\uACE8 \uC0AC\uC2B4\uB3CC",
    shape: "stelae",
    feature: "Bronze Age standing stones bear stylized deer and other carved motifs",
    featureKo: "\uCCAD\uB3D9\uAE30 \uC2DC\uB300\uC758 \uC120\uB3CC\uC5D0 \uC591\uC2DD\uD654\uD55C \uC0AC\uC2B4\uACFC \uC5EC\uB7EC \uBB38\uC591\uC774 \uC0C8\uACA8\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 266,
    color: "#d3b17c"
  },
  {
    id: "sagarmatha",
    name: "Sagarmatha National Park",
    nameKo: "\uC0AC\uAC00\uB974\uB9C8\uD0C0 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "peaks",
    feature: "Mount Everest rises above glaciers and deeply incised valleys in a Himalayan landscape",
    featureKo: "\uD788\uB9D0\uB77C\uC57C \uACBD\uAD00\uC758 \uBE59\uD558\uC640 \uAE4A\uC740 \uACC4\uACE1 \uC704\uB85C \uC5D0\uBCA0\uB808\uC2A4\uD2B8\uC0B0\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 267,
    color: "#b7a28c"
  },
  {
    id: "chitwan",
    name: "Chitwan National Park",
    nameKo: "\uCE58\uD2B8\uC644 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "forest",
    feature: "Subtropical lowland forests and grasslands shelter rhinoceroses and Bengal tigers",
    featureKo: "\uC544\uC5F4\uB300 \uC800\uC9C0\uB300\uC758 \uC232\uACFC \uCD08\uC9C0\uC5D0 \uCF54\uBFD4\uC18C\uC640 \uBCB5\uACE8\uD638\uB791\uC774\uAC00 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 268,
    color: "#829b8a"
  },
  {
    id: "lumbini",
    name: "Lumbini",
    nameKo: "\uB8F8\uBE44\uB2C8",
    shape: "stupa",
    feature: "The Buddha's birthplace preserves an Ashokan pillar and archaeological remains of early sanctuaries",
    featureKo: "\uBD80\uCC98\uC758 \uD0C4\uC0DD\uC9C0\uC5D0 \uC544\uC18C\uCE74 \uC11D\uC8FC\uC640 \uCD08\uAE30 \uC131\uC18C\uC758 \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 269,
    color: "#bca6a0"
  },
  {
    id: "bahla",
    name: "Bahla Fort",
    nameKo: "\uBC1C\uB77C \uC694\uC0C8",
    shape: "fortress",
    feature: "Mud-brick walls and towers protect an oasis settlement in the Omani interior",
    featureKo: "\uC624\uB9CC \uB0B4\uB959\uC758 \uC624\uC544\uC2DC\uC2A4 \uC815\uCC29\uC9C0\uB97C \uD759\uBCBD\uB3CC \uC131\uBCBD\uACFC \uD0D1\uC774 \uC9C0\uD0A4\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 270,
    color: "#b69772"
  },
  {
    id: "bat",
    name: "Bat, Al-Khutm and Al-Ayn",
    nameKo: "\uBC14\uD2B8\xB7\uC54C\uCFE0\uD2C8\xB7\uC54C\uC544\uC778",
    shape: "tomb",
    feature: "Stone towers and beehive tombs preserve a Bronze Age landscape in Oman",
    featureKo: "\uC624\uB9CC\uC758 \uCCAD\uB3D9\uAE30 \uACBD\uAD00\uC5D0 \uC11D\uD0D1\uACFC \uBC8C\uC9D1 \uBAA8\uC591 \uBB34\uB364\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 271,
    color: "#c4ac88"
  },
  {
    id: "frankincense",
    name: "Land of Frankincense",
    nameKo: "\uC720\uD5A5\uC758 \uB545",
    shape: "ruins",
    feature: "Ancient ports and an inland oasis recall the trade in frankincense from Dhofar",
    featureKo: "\uC61B \uD56D\uAD6C\uC640 \uB0B4\uB959 \uC624\uC544\uC2DC\uC2A4\uAC00 \uB3C4\uD30C\uB974 \uC720\uD5A5 \uAD50\uC5ED\uC758 \uC5ED\uC0AC\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 272,
    color: "#aeb9a0"
  },
  {
    id: "aflaj",
    name: "Aflaj Irrigation Systems",
    nameKo: "\uC544\uD50C\uB77C\uC9C0 \uAD00\uAC1C\uC2DC\uC124",
    shape: "waterworks",
    feature: "Gravity-fed water channels distribute precious water through Omani communities and farms",
    featureKo: "\uC911\uB825\uC73C\uB85C \uD750\uB974\uB294 \uC218\uB85C\uAC00 \uC624\uB9CC\uC758 \uB9C8\uC744\uACFC \uB18D\uC9C0\uC5D0 \uADC0\uD55C \uBB3C\uC744 \uB098\uB204\uC5B4 \uC90D\uB2C8\uB2E4",
    seed: 273,
    color: "#bc8b70"
  },
  {
    id: "moenjodaro",
    name: "Moenjodaro",
    nameKo: "\uBAA8\uD5E8\uC870\uB2E4\uB85C",
    shape: "ruins",
    feature: "Planned streets and brick buildings preserve a major city of the Indus civilization",
    featureKo: "\uACC4\uD68D\uC801\uC73C\uB85C \uB0B8 \uAC70\uB9AC\uC640 \uBCBD\uB3CC \uAC74\uBB3C\uB4E4\uC774 \uC778\uB354\uC2A4 \uBB38\uBA85\uC758 \uC8FC\uC694 \uB3C4\uC2DC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 274,
    color: "#8baba4"
  },
  {
    id: "taxila",
    name: "Taxila",
    nameKo: "\uD0C1\uC2E4\uB77C",
    shape: "ruins",
    feature: "Successive ancient cities and Buddhist monuments reflect a crossroads of Asian cultures",
    featureKo: "\uC5EC\uB7EC \uC2DC\uB300\uC758 \uB3C4\uC2DC\uC640 \uBD88\uAD50 \uC720\uC801\uC774 \uC544\uC2DC\uC544 \uBB38\uD654\uAC00 \uB9CC\uB09C \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 275,
    color: "#d3b17c"
  },
  {
    id: "takhtibahi",
    name: "Takht-i-Bahi",
    nameKo: "\uD0C0\uD06C\uD2F0\uBC14\uD788",
    shape: "cloister",
    feature: "A Buddhist monastery occupies a hilltop above the remains of a neighbouring fortified city",
    featureKo: "\uBD88\uAD50 \uC218\uB3C4\uC6D0\uC774 \uC778\uADFC \uC131\uACFD\uB3C4\uC2DC \uC720\uC801\uC744 \uB0B4\uB824\uB2E4\uBCF4\uB294 \uC5B8\uB355 \uC704\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 276,
    color: "#b7a28c"
  },
  {
    id: "rohtas",
    name: "Rohtas Fort",
    nameKo: "\uB85C\uD0C0\uC2A4 \uC694\uC0C8",
    shape: "fortress",
    feature: "Massive walls, bastions and monumental gateways enclose a sixteenth-century fort",
    featureKo: "\uB450\uAEBC\uC6B4 \uC131\uBCBD\uACFC \uBCF4\uB8E8, \uAC70\uB300\uD55C \uC131\uBB38\uC774 16\uC138\uAE30 \uC694\uC0C8\uB97C \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 277,
    color: "#829b8a"
  },
  {
    id: "krakow",
    name: "Krak\xF3w Historic Centre",
    nameKo: "\uD06C\uB77C\uCFE0\uD504 \uC5ED\uC0AC\uC911\uC2EC\uC9C0",
    shape: "square",
    feature: "A medieval market square, royal castle and historic churches anchor the old city",
    featureKo: "\uC911\uC138 \uC2DC\uC7A5 \uAD11\uC7A5\uACFC \uC655\uC131, \uC61B \uAD50\uD68C\uB4E4\uC774 \uAD6C\uC2DC\uAC00\uC9C0\uC758 \uC911\uC2EC\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 278,
    color: "#bca6a0"
  },
  {
    id: "warsaw",
    name: "Warsaw Historic Centre",
    nameKo: "\uBC14\uB974\uC0E4\uBC14 \uC5ED\uC0AC\uC911\uC2EC\uC9C0",
    shape: "town",
    feature: "The reconstructed old town restores streets and buildings destroyed during the Second World War",
    featureKo: "\uBCF5\uC6D0\uB41C \uAD6C\uC2DC\uAC00\uC9C0\uC5D0 \uC81C2\uCC28 \uC138\uACC4\uB300\uC804 \uB54C \uD30C\uAD34\uB41C \uAC70\uB9AC\uC640 \uAC74\uBB3C\uB4E4\uC774 \uB418\uC0B4\uC544\uB0AC\uC2B5\uB2C8\uB2E4",
    seed: 279,
    color: "#b69772"
  },
  {
    id: "wieliczka",
    name: "Wieliczka and Bochnia Salt Mines",
    nameKo: "\uBE44\uC5D8\uB9AC\uCE58\uCE74\uC640 \uBCF4\uD750\uB2C8\uC544 \uC18C\uAE08\uAD11\uC0B0",
    shape: "mine",
    feature: "Underground galleries and chambers record centuries of rock-salt mining",
    featureKo: "\uC9C0\uD558 \uAC31\uB3C4\uC640 \uBC29\uB4E4\uC774 \uC218\uBC31 \uB144\uC5D0 \uAC78\uCE5C \uC554\uC5FC \uCC44\uAD74\uC758 \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 280,
    color: "#c4ac88"
  },
  {
    id: "zamosc",
    name: "Zamo\u015B\u0107",
    nameKo: "\uC790\uBAA8\uC2DC\uCE58",
    shape: "square",
    feature: "An arcaded market square sits within a planned Renaissance town",
    featureKo: "\uC544\uCF00\uC774\uB4DC\uAC00 \uB458\uB7EC\uC120 \uC2DC\uC7A5 \uAD11\uC7A5\uC774 \uACC4\uD68D\uC801\uC73C\uB85C \uC9C0\uC740 \uB974\uB124\uC0C1\uC2A4 \uB3C4\uC2DC \uC548\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 281,
    color: "#aeb9a0"
  },
  {
    id: "torun",
    name: "Medieval Toru\u0144",
    nameKo: "\uC911\uC138 \uD1A0\uB8EC",
    shape: "town",
    feature: "Brick churches, town houses and fortifications preserve a medieval trading town",
    featureKo: "\uBCBD\uB3CC \uAD50\uD68C\uC640 \uC8FC\uD0DD, \uBC29\uC5B4\uC2DC\uC124\uC774 \uC911\uC138 \uAD50\uC5ED\uB3C4\uC2DC\uC758 \uBAA8\uC2B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 282,
    color: "#bc8b70"
  },
  {
    id: "malbork",
    name: "Malbork Castle",
    nameKo: "\uB9D0\uBCF4\uB974\uD06C\uC131",
    shape: "castle",
    feature: "An immense brick castle complex was built by the Teutonic Order",
    featureKo: "\uD29C\uD134 \uAE30\uC0AC\uB2E8\uC774 \uC9C0\uC740 \uAC70\uB300\uD55C \uBCBD\uB3CC \uC131\uCC44 \uB2E8\uC9C0\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 283,
    color: "#8baba4"
  },
  {
    id: "centennialhall",
    name: "Centennial Hall in Wroc\u0142aw",
    nameKo: "\uBE0C\uB85C\uCE20\uC640\uD504 \uBC31\uC8FC\uB144\uAE30\uB150\uAD00",
    shape: "dome",
    feature: "A pioneering reinforced-concrete hall spans a vast circular interior beneath a ribbed dome",
    featureKo: "\uCCA0\uADFC\uCF58\uD06C\uB9AC\uD2B8 \uAC74\uCD95\uC758 \uCD08\uAE30 \uAE30\uB150\uAD00\uC5D0\uC11C \uB9AC\uBE0C \uB3D4\uC774 \uB113\uC740 \uC6D0\uD615 \uB0B4\uBD80\uB97C \uB36E\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 284,
    color: "#d3b17c"
  },
  {
    id: "danubedelta",
    name: "Danube Delta",
    nameKo: "\uB2E4\uB274\uBE0C \uC0BC\uAC01\uC8FC",
    shape: "wetland",
    feature: "Reed beds, lakes and branching waterways support abundant birds at the Danube's mouth",
    featureKo: "\uB2E4\uB274\uBE0C\uAC15 \uD558\uAD6C\uC758 \uAC08\uB300\uBC2D\uACFC \uD638\uC218, \uAC08\uB77C\uC9C0\uB294 \uBB3C\uAE38\uC5D0 \uB9CE\uC740 \uC0C8\uAC00 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 285,
    color: "#b7a28c"
  },
  {
    id: "hurezi",
    name: "Hurezi Monastery",
    nameKo: "\uD6C4\uB808\uC9C0 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A richly decorated monastery illustrates the Brancovan style of Wallachian architecture",
    featureKo: "\uC815\uAD50\uD558\uAC8C \uC7A5\uC2DD\uD55C \uC218\uB3C4\uC6D0\uC774 \uC648\uB77C\uD0A4\uC544 \uAC74\uCD95\uC758 \uBE0C\uB780\uCF54\uBCA0\uC544\uB204 \uC591\uC2DD\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 286,
    color: "#829b8a"
  },
  {
    id: "moldavia",
    name: "Painted Churches of Moldavia",
    nameKo: "\uBAB0\uB2E4\uBE44\uC544 \uBCBD\uD654\uAD50\uD68C",
    shape: "woodchurch",
    feature: "Monastic churches carry elaborate frescoes across their exterior walls",
    featureKo: "\uC218\uB3C4\uC6D0 \uAD50\uD68C\uC758 \uBC14\uAE65\uBCBD\uC744 \uC815\uAD50\uD55C \uD504\uB808\uC2A4\uCF54\uD654\uAC00 \uB36E\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 287,
    color: "#bca6a0"
  },
  {
    id: "sighisoara",
    name: "Sighi\u0219oara",
    nameKo: "\uC2DC\uAE30\uC1FC\uC544\uB77C",
    shape: "towers",
    feature: "A fortified hill town preserves medieval houses and towers linked to its craft guilds",
    featureKo: "\uC131\uBCBD\uC73C\uB85C \uB458\uB7EC\uC2FC \uC5B8\uB355 \uB3C4\uC2DC\uC5D0 \uC911\uC138 \uC8FC\uD0DD\uACFC \uC7A5\uC778 \uAE38\uB4DC\uC758 \uD0D1\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 288,
    color: "#b69772"
  },
  {
    id: "maramures",
    name: "Wooden Churches of Maramure\u0219",
    nameKo: "\uB9C8\uB77C\uBB34\uB808\uC288 \uBAA9\uC870\uAD50\uD68C",
    shape: "woodchurch",
    feature: "Tall, slender wooden towers rise above steep-roofed village churches",
    featureKo: "\uAC00\uD30C\uB978 \uC9C0\uBD95\uC744 \uC5B9\uC740 \uB9C8\uC744 \uAD50\uD68C \uC704\uB85C \uAC00\uB298\uACE0 \uB192\uC740 \uBAA9\uC870 \uD0D1\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 289,
    color: "#c4ac88"
  },
  {
    id: "studenica",
    name: "Studenica Monastery",
    nameKo: "\uC2A4\uD22C\uB370\uB2C8\uCC28 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A medieval Serbian monastery preserves marble churches and Byzantine-style frescoes",
    featureKo: "\uC911\uC138 \uC138\uB974\uBE44\uC544 \uC218\uB3C4\uC6D0\uC5D0 \uB300\uB9AC\uC11D \uAD50\uD68C\uC640 \uBE44\uC794\uD2F4 \uC591\uC2DD\uC758 \uD504\uB808\uC2A4\uCF54\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 290,
    color: "#aeb9a0"
  },
  {
    id: "gamzigrad",
    name: "Gamzigrad-Romuliana",
    nameKo: "\uAC10\uC9C0\uADF8\uB77C\uB4DC \uB85C\uBB3C\uB9AC\uC544\uB098",
    shape: "palace",
    feature: "Fortified walls surround the palace complex built for the Roman emperor Galerius",
    featureKo: "\uB85C\uB9C8 \uD669\uC81C \uAC08\uB808\uB9AC\uC6B0\uC2A4\uB97C \uC704\uD574 \uC9C0\uC740 \uAD81\uC804 \uB2E8\uC9C0\uB97C \uC131\uBCBD\uC774 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 291,
    color: "#bc8b70"
  },
  {
    id: "skocjan",
    name: "\u0160kocjan Caves",
    nameKo: "\uC288\uCF54\uCE58\uC548 \uB3D9\uAD74",
    shape: "cave",
    feature: "An underground river has carved an immense canyon through a limestone cave system",
    featureKo: "\uC9C0\uD558\uAC15\uC774 \uC11D\uD68C\uC554 \uB3D9\uAD74 \uC548\uC5D0 \uAC70\uB300\uD55C \uD611\uACE1\uC744 \uAE4E\uC544 \uB193\uC558\uC2B5\uB2C8\uB2E4",
    seed: 292,
    color: "#8baba4"
  },
  {
    id: "spis",
    name: "Spi\u0161 Castle and Levo\u010Da",
    nameKo: "\uC2A4\uD53C\uC288\uC131\uACFC \uB808\uBCF4\uCC28",
    shape: "castle",
    feature: "A vast ruined castle overlooks a region of medieval towns and religious monuments",
    featureKo: "\uAC70\uB300\uD55C \uC131\uD130 \uC544\uB798\uB85C \uC911\uC138 \uB3C4\uC2DC\uC640 \uC885\uAD50 \uC720\uC801\uC774 \uC790\uB9AC\uD55C \uC9C0\uC5ED\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 293,
    color: "#d3b17c"
  },
  {
    id: "vlkolinec",
    name: "Vlkol\xEDnec",
    nameKo: "\uBE14\uCF5C\uB9AC\uB124\uCE20",
    shape: "thatched",
    feature: "Traditional log houses preserve a remarkably intact mountain village",
    featureKo: "\uC804\uD1B5 \uD1B5\uB098\uBB34\uC9D1\uB4E4\uC774 \uC0B0\uC545 \uB9C8\uC744\uC758 \uC61B \uBAA8\uC2B5\uC744 \uC798 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 294,
    color: "#b7a28c"
  },
  {
    id: "bardejov",
    name: "Bardejov",
    nameKo: "\uBC14\uB974\uB370\uC694\uC6B0",
    shape: "square",
    feature: "A fortified medieval town preserves a central market square and historic burgher houses",
    featureKo: "\uC131\uBCBD\uC744 \uB450\uB978 \uC911\uC138 \uB3C4\uC2DC\uC5D0 \uC911\uC559 \uC2DC\uC7A5 \uAD11\uC7A5\uACFC \uC61B \uC2DC\uBBFC \uC8FC\uD0DD\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 295,
    color: "#829b8a"
  },
  {
    id: "sarazm",
    name: "Sarazm",
    nameKo: "\uC0AC\uB77C\uC998",
    shape: "ruins",
    feature: "An early settlement records contacts between farming communities and wider Central Asian trade",
    featureKo: "\uCD08\uAE30 \uC815\uCC29\uC9C0\uC758 \uD754\uC801\uC774 \uB18D\uACBD \uACF5\uB3D9\uCCB4\uC640 \uC911\uC559\uC544\uC2DC\uC544 \uAD50\uC5ED\uC758 \uC5F0\uACB0\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 296,
    color: "#bca6a0"
  },
  {
    id: "pamirs",
    name: "Tajik National Park",
    nameKo: "\uD0C0\uC9C0\uD06C \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "glacier",
    feature: "High Pamir peaks, glaciers and mountain lakes form an immense remote wilderness",
    featureKo: "\uB192\uC740 \uD30C\uBBF8\uB974 \uBD09\uC6B0\uB9AC\uC640 \uBE59\uD558, \uC0B0\uC545 \uD638\uC218\uAC00 \uAD11\uB300\uD55C \uC624\uC9C0 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 297,
    color: "#b69772"
  },
  {
    id: "merv",
    name: "Ancient Merv",
    nameKo: "\uACE0\uB300 \uBA54\uB974\uBE0C",
    shape: "ruins",
    feature: "Successive walled cities preserve a major oasis centre on the Silk Roads",
    featureKo: "\uC5EC\uB7EC \uC2DC\uB300\uC758 \uC131\uACFD\uB3C4\uC2DC\uAC00 \uC2E4\uD06C\uB85C\uB4DC\uC758 \uC8FC\uC694 \uC624\uC544\uC2DC\uC2A4 \uC911\uC2EC\uC9C0\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 298,
    color: "#c4ac88"
  },
  {
    id: "kunyaurgench",
    name: "Kunya-Urgench",
    nameKo: "\uCFE0\uB0D0\uC6B0\uB974\uAC90\uCE58",
    shape: "minaret",
    feature: "Minarets, mausoleums and other monuments remain from a historic city on the Amu Darya",
    featureKo: "\uC544\uBB34\uB2E4\uB9AC\uC57C\uAC15\uC758 \uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uBBF8\uB098\uB808\uD2B8\uC640 \uC601\uBB18 \uB4F1 \uC5EC\uB7EC \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 299,
    color: "#aeb9a0"
  },
  {
    id: "nisa",
    name: "Parthian Fortresses of Nisa",
    nameKo: "\uB2C8\uC0AC\uC758 \uD30C\uB974\uD2F0\uC544 \uC694\uC0C8",
    shape: "fortress",
    feature: "Two archaeological tells preserve the fortresses and ceremonial buildings of Parthian Nisa",
    featureKo: "\uB450 \uC720\uC801 \uC5B8\uB355\uC5D0 \uD30C\uB974\uD2F0\uC544 \uC2DC\uB300 \uB2C8\uC0AC\uC758 \uC694\uC0C8\uC640 \uC758\uB840\uC6A9 \uAC74\uBB3C \uD754\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 300,
    color: "#bc8b70"
  },
  {
    id: "kyivsophia",
    name: "Saint Sophia and Kyiv-Pechersk Lavra",
    nameKo: "\uD0A4\uC774\uC6B0 \uC131 \uC18C\uD53C\uC544\uC640 \uD398\uCCB4\uB974\uC2A4\uD06C \uC218\uB3C4\uC6D0",
    shape: "dome",
    feature: "A cathedral and monastic ensemble preserve outstanding medieval mosaics and frescoes",
    featureKo: "\uB300\uC131\uB2F9\uACFC \uC218\uB3C4\uC6D0 \uB2E8\uC9C0\uC5D0 \uB6F0\uC5B4\uB09C \uC911\uC138 \uBAA8\uC790\uC774\uD06C\uC640 \uD504\uB808\uC2A4\uCF54\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 301,
    color: "#8baba4"
  },
  {
    id: "lviv",
    name: "Lviv Historic Centre",
    nameKo: "\uB974\uBE44\uC6B0 \uC5ED\uC0AC\uC911\uC2EC\uC9C0",
    shape: "town",
    feature: "A historic urban centre brings together architectural traditions from several Central European cultures",
    featureKo: "\uC5ED\uC0AC \uB3C4\uC2EC\uC5D0 \uC911\uC559\uC720\uB7FD \uC5EC\uB7EC \uBB38\uD654\uC758 \uAC74\uCD95 \uC804\uD1B5\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 302,
    color: "#d3b17c"
  },
  {
    id: "itchankala",
    name: "Itchan Kala",
    nameKo: "\uC774\uCC2C\uCE7C\uB77C",
    shape: "fortress",
    feature: "High mud walls enclose Khiva's inner town with mosques, minarets and palaces",
    featureKo: "\uB192\uC740 \uD759 \uC131\uBCBD \uC548\uC758 \uD788\uBC14 \uB0B4\uC131\uC5D0 \uBAA8\uC2A4\uD06C\uC640 \uBBF8\uB098\uB808\uD2B8, \uAD81\uC804\uB4E4\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 303,
    color: "#b7a28c"
  },
  {
    id: "bukhara",
    name: "Historic Bukhara",
    nameKo: "\uBD80\uD558\uB77C \uC5ED\uC0AC\uB3C4\uC2DC",
    shape: "mosque",
    feature: "A Central Asian trading city preserves mosques, madrasas and monumental minarets",
    featureKo: "\uC911\uC559\uC544\uC2DC\uC544\uC758 \uAD50\uC5ED\uB3C4\uC2DC\uC5D0 \uBAA8\uC2A4\uD06C\uC640 \uB9C8\uB4DC\uB77C\uC0AC, \uAC70\uB300\uD55C \uBBF8\uB098\uB808\uD2B8\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 304,
    color: "#829b8a"
  },
  {
    id: "shakhrisyabz",
    name: "Shakhrisyabz",
    nameKo: "\uC0E4\uD750\uB9AC\uC0AC\uBE0C\uC988",
    shape: "gate",
    feature: "Monumental palace remains and religious buildings recall the Timurid city's importance",
    featureKo: "\uAC70\uB300\uD55C \uAD81\uC804 \uC720\uC801\uACFC \uC885\uAD50 \uAC74\uBB3C\uB4E4\uC774 \uD2F0\uBB34\uB974 \uC2DC\uB300 \uB3C4\uC2DC\uC758 \uC704\uC0C1\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 305,
    color: "#bca6a0"
  },
  {
    id: "abomey",
    name: "Royal Palaces of Abomey",
    nameKo: "\uC544\uBCF4\uBA54 \uC655\uAD81",
    shape: "adobe",
    feature: "Earthen royal palaces preserve the history and artistic traditions of the Kingdom of Dahomey",
    featureKo: "\uD759\uC73C\uB85C \uC9C0\uC740 \uC655\uAD81\uB4E4\uC774 \uB2E4\uD638\uBA54 \uC655\uAD6D\uC758 \uC5ED\uC0AC\uC640 \uC608\uC220 \uC804\uD1B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 306,
    color: "#b69772"
  },
  {
    id: "loropeni",
    name: "Ruins of Lorop\xE9ni",
    nameKo: "\uB85C\uB85C\uD398\uB2C8 \uC720\uC801",
    shape: "fortress",
    feature: "Imposing stone walls survive from a fortified settlement linked to West African gold trading",
    featureKo: "\uC11C\uC544\uD504\uB9AC\uCE74 \uAE08 \uAD50\uC5ED\uACFC \uC5F0\uACB0\uB41C \uC131\uACFD \uC815\uCC29\uC9C0\uC5D0 \uB450\uAEBC\uC6B4 \uC11D\uBCBD\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 307,
    color: "#c4ac88"
  },
  {
    id: "tiebele",
    name: "Royal Court of Ti\xE9b\xE9l\xE9",
    nameKo: "\uD2F0\uC5D0\uBCA8\uB808 \uC655\uAD81",
    shape: "adobe",
    feature: "An earthen royal compound displays the decorated domestic architecture of the Kassena people",
    featureKo: "\uD759\uC73C\uB85C \uC9C0\uC740 \uC655\uAD81 \uB2E8\uC9C0\uC5D0 \uCE74\uC138\uB098 \uC0AC\uB78C\uB4E4\uC758 \uC7A5\uC2DD \uC8FC\uAC70 \uAC74\uCD95\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 308,
    color: "#aeb9a0"
  },
  {
    id: "virunga",
    name: "Virunga National Park",
    nameKo: "\uBE44\uB8FD\uAC00 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "volcano",
    feature: "Volcanoes, forests and savannas provide habitats for mountain gorillas and diverse wildlife",
    featureKo: "\uD654\uC0B0\uACFC \uC232, \uC0AC\uBC14\uB098\uC5D0 \uB9C8\uC6B4\uD2F4\uACE0\uB9B4\uB77C\uB97C \uBE44\uB86F\uD55C \uB2E4\uC591\uD55C \uC57C\uC0DD\uB3D9\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 309,
    color: "#bc8b70"
  },
  {
    id: "okapi",
    name: "Okapi Wildlife Reserve",
    nameKo: "\uC624\uCE74\uD53C \uC57C\uC0DD\uB3D9\uBB3C\uBCF4\uD638\uAD6C\uC5ED",
    shape: "forest",
    feature: "The Ituri rainforest shelters okapis within a rich tropical forest ecosystem",
    featureKo: "\uC774\uD22C\uB9AC \uC5F4\uB300\uC6B0\uB9BC\uC758 \uD48D\uBD80\uD55C \uC0DD\uD0DC\uACC4 \uC548\uC5D0 \uC624\uCE74\uD53C\uAC00 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 310,
    color: "#8baba4"
  },
  {
    id: "odzala",
    name: "Odzala-Kokoua Forest",
    nameKo: "\uC624\uC798\uB77C\uCF54\uCFE0\uC544 \uC232",
    shape: "forest",
    feature: "Congo Basin forest and clearings support forest elephants, gorillas and other wildlife",
    featureKo: "\uCF69\uACE0 \uBD84\uC9C0\uC758 \uC232\uACFC \uC232\uC18D \uACF5\uD130\uC5D0 \uC232\uCF54\uB07C\uB9AC\uC640 \uACE0\uB9B4\uB77C \uB4F1 \uC57C\uC0DD\uB3D9\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 311,
    color: "#d3b17c"
  },
  {
    id: "taiforest",
    name: "Ta\xEF National Park",
    nameKo: "\uD0C0\uC774 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "forest",
    feature: "One of West Africa's remaining primary tropical forests shelters a rich variety of mammals",
    featureKo: "\uC11C\uC544\uD504\uB9AC\uCE74\uC5D0 \uB0A8\uC740 \uC6D0\uC2DC \uC5F4\uB300\uC6B0\uB9BC\uC5D0 \uB2E4\uC591\uD55C \uD3EC\uC720\uB958\uAC00 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 312,
    color: "#b7a28c"
  },
  {
    id: "grandbassam",
    name: "Grand-Bassam",
    nameKo: "\uADF8\uB791\uBC14\uC0BC",
    shape: "town",
    feature: "A coastal historic town preserves a planned colonial quarter beside a traditional fishing village",
    featureKo: "\uD574\uC548\uC758 \uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uACC4\uD68D\uB41C \uC2DD\uBBFC\uC9C0 \uAD6C\uC5ED\uACFC \uC804\uD1B5 \uC5B4\uCD0C\uC774 \uD568\uAED8 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 313,
    color: "#829b8a"
  },
  {
    id: "dja",
    name: "Dja Faunal Reserve",
    nameKo: "\uC790 \uB3D9\uBB3C\uBCF4\uD638\uAD6C\uC5ED",
    shape: "forest",
    feature: "Dense equatorial rainforest is almost enclosed by the looping Dja River",
    featureKo: "\uC6B8\uCC3D\uD55C \uC801\uB3C4 \uC6B0\uB9BC\uC744 \uAD7D\uC774\uCE58\uB294 \uC790\uAC15\uC774 \uAC70\uC758 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 314,
    color: "#bca6a0"
  },
  {
    id: "benihammad",
    name: "Al Qal'a of Beni Hammad",
    nameKo: "\uBCA0\uB2C8\uD558\uB9C8\uB4DC \uC694\uC0C8",
    shape: "fortress",
    feature: "The ruins of a fortified mountain capital preserve the remains of a monumental mosque",
    featureKo: "\uC0B0\uC545 \uC131\uACFD \uC218\uB3C4\uC758 \uC720\uC801\uC5D0 \uAC70\uB300\uD55C \uBAA8\uC2A4\uD06C\uC758 \uD754\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 315,
    color: "#b69772"
  },
  {
    id: "tassili",
    name: "Tassili n'Ajjer",
    nameKo: "\uD0C0\uC2E4\uB9AC\uB098\uC81C\uB974",
    shape: "redrocks",
    feature: "Sandstone formations and rock art record environmental and human changes in the Sahara",
    featureKo: "\uC0AC\uC554 \uC9C0\uD615\uACFC \uC554\uAC01\uD654\uAC00 \uC0AC\uD558\uB77C\uC758 \uD658\uACBD\uACFC \uC778\uAC04 \uC0DD\uD65C \uBCC0\uD654\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 316,
    color: "#c4ac88"
  },
  {
    id: "mzab",
    name: "M'Zab Valley",
    nameKo: "\uBBC0\uC790\uBE0C \uACC4\uACE1",
    shape: "adobe",
    feature: "Compact fortified oasis towns are arranged around distinctive mosque minarets",
    featureKo: "\uC791\uACE0 \uC870\uBC00\uD55C \uC624\uC544\uC2DC\uC2A4 \uC131\uACFD\uB3C4\uC2DC\uB4E4\uC774 \uB3C5\uD2B9\uD55C \uBAA8\uC2A4\uD06C \uBBF8\uB098\uB808\uD2B8\uB97C \uC911\uC2EC\uC73C\uB85C \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 317,
    color: "#aeb9a0"
  },
  {
    id: "djemila",
    name: "Dj\xE9mila",
    nameKo: "\uC81C\uBC00\uB77C",
    shape: "ruins",
    feature: "Roman forums, temples and houses adapt an ancient town to a mountain setting",
    featureKo: "\uB85C\uB9C8 \uC2DC\uB300\uC758 \uAD11\uC7A5\uACFC \uC2E0\uC804, \uC8FC\uD0DD\uC774 \uC0B0\uC545 \uC9C0\uD615\uC5D0 \uB9DE\uCD94\uC5B4 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 318,
    color: "#bc8b70"
  },
  {
    id: "tipasa",
    name: "Tipasa",
    nameKo: "\uD2F0\uD30C\uC0AC",
    shape: "ruins",
    feature: "Roman and early Christian ruins overlook the Mediterranean along an ancient trading shore",
    featureKo: "\uC9C0\uC911\uD574\uC758 \uC61B \uAD50\uC5ED \uD574\uC548\uC5D0 \uB85C\uB9C8\uC640 \uCD08\uAE30 \uAE30\uB3C5\uAD50 \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 319,
    color: "#8baba4"
  },
  {
    id: "asmara",
    name: "Asmara",
    nameKo: "\uC544\uC2A4\uB9C8\uB77C",
    shape: "modern",
    feature: "An African capital preserves an extensive ensemble of early modernist urban architecture",
    featureKo: "\uC544\uD504\uB9AC\uCE74\uC758 \uC218\uB3C4\uC5D0 \uCD08\uAE30 \uBAA8\uB354\uB2C8\uC998 \uB3C4\uC2DC \uAC74\uCD95\uC774 \uB113\uAC8C \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 320,
    color: "#d3b17c"
  },
  {
    id: "fasilghebbi",
    name: "Fasil Ghebbi",
    nameKo: "\uD30C\uC2E4\uAC8C\uBE44",
    shape: "castle",
    feature: "Stone castles and palaces fill the royal enclosure of Ethiopia's former capital Gondar",
    featureKo: "\uC5D0\uD2F0\uC624\uD53C\uC544\uC758 \uC61B \uC218\uB3C4 \uACE4\uB2E4\uB974 \uC655\uC2E4 \uAD6C\uC5ED\uC5D0 \uC11D\uC870 \uC131\uACFC \uAD81\uC804\uB4E4\uC774 \uB4E4\uC5B4\uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 321,
    color: "#b7a28c"
  },
  {
    id: "harar",
    name: "Harar Jugol",
    nameKo: "\uD558\uB77C\uB974 \uC8FC\uACE8",
    shape: "town",
    feature: "A walled Islamic city preserves numerous mosques, shrines and traditional town houses",
    featureKo: "\uC131\uBCBD\uC744 \uB450\uB978 \uC774\uC2AC\uB78C \uB3C4\uC2DC\uC5D0 \uB9CE\uC740 \uBAA8\uC2A4\uD06C\uC640 \uC131\uC18C, \uC804\uD1B5 \uC8FC\uD0DD\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 322,
    color: "#829b8a"
  },
  {
    id: "balemountains",
    name: "Bale Mountains",
    nameKo: "\uBC1C\uB808\uC0B0\uB9E5",
    shape: "peaks",
    feature: "High plateaux, peaks and forests shelter endemic wildlife in Ethiopia's mountain landscape",
    featureKo: "\uC5D0\uD2F0\uC624\uD53C\uC544 \uC0B0\uC545 \uACBD\uAD00\uC758 \uACE0\uC6D0\uACFC \uBD09\uC6B0\uB9AC, \uC232\uC5D0 \uACE0\uC720 \uC57C\uC0DD\uB3D9\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 323,
    color: "#bca6a0"
  },
  {
    id: "asante",
    name: "Asante Traditional Buildings",
    nameKo: "\uC544\uC0E8\uD2F0 \uC804\uD1B5\uAC74\uCD95",
    shape: "adobe",
    feature: "Earth, timber and thatch buildings preserve the architectural traditions of Asante culture",
    featureKo: "\uD759\uACFC \uB098\uBB34, \uC774\uC5C9\uC73C\uB85C \uC9C0\uC740 \uAC74\uBB3C\uB4E4\uC774 \uC544\uC0E8\uD2F0 \uBB38\uD654\uC758 \uAC74\uCD95 \uC804\uD1B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 324,
    color: "#b69772"
  },
  {
    id: "mountkenya",
    name: "Mount Kenya",
    nameKo: "\uCF00\uB0D0\uC0B0",
    shape: "peaks",
    feature: "A deeply eroded ancient volcano carries rugged peaks, glaciers and alpine vegetation",
    featureKo: "\uC624\uB798\uB41C \uD654\uC0B0\uC774 \uCE68\uC2DD\uB41C \uC0B0 \uC704\uC5D0 \uD5D8\uC900\uD55C \uBD09\uC6B0\uB9AC\uC640 \uBE59\uD558, \uACE0\uC0B0 \uC2DD\uC0DD\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 325,
    color: "#c4ac88"
  },
  {
    id: "turkana",
    name: "Lake Turkana",
    nameKo: "\uD22C\uB974\uCE74\uB098\uD638",
    shape: "lakes",
    feature: "Desert lake parks protect breeding grounds for crocodiles, hippos and migratory birds",
    featureKo: "\uC0AC\uB9C9 \uD638\uC218\uC758 \uACF5\uC6D0\uB4E4\uC774 \uC545\uC5B4\uC640 \uD558\uB9C8, \uCCA0\uC0C8\uC758 \uBC88\uC2DD\uC9C0\uB97C \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 326,
    color: "#aeb9a0"
  },
  {
    id: "lamu",
    name: "Lamu Old Town",
    nameKo: "\uB77C\uBB34 \uAD6C\uC2DC\uAC00\uC9C0",
    shape: "town",
    feature: "Coral-stone and mangrove-timber houses preserve a Swahili town on the East African coast",
    featureKo: "\uC0B0\uD638\uC11D\uACFC \uB9F9\uADF8\uB85C\uBE0C \uBAA9\uC7AC\uB85C \uC9C0\uC740 \uC8FC\uD0DD\uB4E4\uC774 \uB3D9\uC544\uD504\uB9AC\uCE74\uC758 \uC2A4\uC640\uD790\uB9AC \uB3C4\uC2DC\uB97C \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 327,
    color: "#bc8b70"
  },
  {
    id: "fortjesus",
    name: "Fort Jesus",
    nameKo: "\uD3EC\uD2B8\uC9C0\uC800\uC2A4",
    shape: "fortress",
    feature: "A Portuguese-built fort guards the old harbour entrance at Mombasa",
    featureKo: "\uD3EC\uB974\uD22C\uAC08\uC778\uC774 \uC9C0\uC740 \uC694\uC0C8\uAC00 \uBAB8\uBC14\uC0AC\uC758 \uC61B \uD56D\uAD6C \uC785\uAD6C\uB97C \uC9C0\uD0A4\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 328,
    color: "#8baba4"
  },
  {
    id: "thimlich",
    name: "Thimlich Ohinga",
    nameKo: "\uD300\uB9AC\uCE58 \uC624\uD79D\uAC00",
    shape: "fortress",
    feature: "Dry-stone enclosures preserve a fortified settlement near Lake Victoria",
    featureKo: "\uBE45\uD1A0\uB9AC\uC544\uD638 \uADFC\uCC98\uC5D0 \uB3CC\uC744 \uC313\uC544 \uB450\uB978 \uC131\uACFD \uC815\uCC29\uC9C0\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 329,
    color: "#d3b17c"
  },
  {
    id: "ambohimanga",
    name: "Royal Hill of Ambohimanga",
    nameKo: "\uC554\uBCF4\uD788\uB9DD\uAC00 \uC655\uC2E4\uC5B8\uB355",
    shape: "palace",
    feature: "A fortified royal city and burial places occupy a sacred wooded hill",
    featureKo: "\uC232\uC73C\uB85C \uB36E\uC778 \uC131\uC2A4\uB7EC\uC6B4 \uC5B8\uB355\uC5D0 \uC655\uC2E4 \uC131\uACFD\uB3C4\uC2DC\uC640 \uBB34\uB364\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 330,
    color: "#b7a28c"
  },
  {
    id: "atsinanana",
    name: "Atsinanana Rainforests",
    nameKo: "\uC544\uCE58\uB098\uB098\uB098 \uC6B0\uB9BC",
    shape: "forest",
    feature: "Eastern Madagascar's rainforests protect ancient lineages of plants and endemic animals",
    featureKo: "\uB9C8\uB2E4\uAC00\uC2A4\uCE74\uB974 \uB3D9\uBD80 \uC6B0\uB9BC\uC774 \uC624\uB79C \uC2DD\uBB3C \uACC4\uD1B5\uACFC \uACE0\uC720 \uB3D9\uBB3C\uB4E4\uC744 \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 331,
    color: "#829b8a"
  },
  {
    id: "timbuktu",
    name: "Timbuktu",
    nameKo: "\uD300\uBD81\uD22C",
    shape: "mosque",
    feature: "Earthen mosques recall the city's role as a centre of Islamic learning and trans-Saharan trade",
    featureKo: "\uD759\uC73C\uB85C \uC9C0\uC740 \uBAA8\uC2A4\uD06C\uB4E4\uC774 \uC774\uC2AC\uB78C \uD559\uBB38\uACFC \uC0AC\uD558\uB77C \uAD50\uC5ED \uC911\uC2EC\uC9C0\uC600\uB358 \uB3C4\uC2DC\uC758 \uC5ED\uC0AC\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 332,
    color: "#bca6a0"
  },
  {
    id: "bandiagara",
    name: "Cliff of Bandiagara",
    nameKo: "\uBC18\uB514\uC544\uAC00\uB77C \uC808\uBCBD",
    shape: "cliff",
    feature: "Dogon villages and granaries occupy a dramatic landscape of cliffs and sandy plateaux",
    featureKo: "\uC808\uBCBD\uACFC \uBAA8\uB798 \uACE0\uC6D0\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uACBD\uAD00\uC5D0 \uB3C4\uACE4\uC871 \uB9C8\uC744\uACFC \uACE1\uBB3C \uCC3D\uACE0\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 333,
    color: "#b69772"
  },
  {
    id: "askia",
    name: "Tomb of Askia",
    nameKo: "\uC544\uC2A4\uD0A4\uC544 \uBB34\uB364",
    shape: "pyramid",
    feature: "A pyramidal earthen tomb and mosque complex stand in the historic city of Gao",
    featureKo: "\uAC00\uC624\uC758 \uC5ED\uC0AC \uB3C4\uC2DC\uC5D0 \uD53C\uB77C\uBBF8\uB4DC \uBAA8\uC591 \uD759 \uBB34\uB364\uACFC \uBAA8\uC2A4\uD06C \uB2E8\uC9C0\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 334,
    color: "#c4ac88"
  },
  {
    id: "bancarguin",
    name: "Banc d'Arguin",
    nameKo: "\uBC29\uB2E4\uB974\uAC31",
    shape: "coast",
    feature: "Coastal dunes, islands and shallow waters shelter immense gatherings of migratory birds",
    featureKo: "\uD574\uC548 \uC0AC\uAD6C\uC640 \uC12C, \uC595\uC740 \uBC14\uB2E4\uAC00 \uC218\uB9CE\uC740 \uCCA0\uC0C8\uC5D0\uAC8C \uC27C\uD130\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4",
    seed: 335,
    color: "#aeb9a0"
  },
  {
    id: "lemorne",
    name: "Le Morne",
    nameKo: "\uB974\uBAA8\uB978",
    shape: "cliff",
    feature: "A rugged mountain overlooking the ocean recalls the refuge sought by escaped enslaved people",
    featureKo: "\uBC14\uB2E4\uB97C \uB0B4\uB824\uB2E4\uBCF4\uB294 \uD5D8\uC900\uD55C \uC0B0\uC774 \uD0C8\uCD9C\uD55C \uB178\uC608\uB4E4\uC774 \uCC3E\uC558\uB358 \uD53C\uB09C\uCC98\uC758 \uC5ED\uC0AC\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 336,
    color: "#bc8b70"
  },
  {
    id: "lakemalawi",
    name: "Lake Malawi National Park",
    nameKo: "\uB9D0\uB77C\uC704\uD638 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "lakes",
    feature: "Clear lake waters and rocky shores support an exceptional diversity of freshwater fish",
    featureKo: "\uB9D1\uC740 \uD638\uC218\uC640 \uBC14\uC704 \uD574\uC548\uC5D0 \uB9E4\uC6B0 \uB2E4\uC591\uD55C \uB2F4\uC218\uC5B4\uAC00 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 337,
    color: "#8baba4"
  },
  {
    id: "mozambiqueisland",
    name: "Island of Mozambique",
    nameKo: "\uBAA8\uC7A0\uBE44\uD06C\uC12C",
    shape: "coast",
    feature: "Stone-built houses and fortifications recall a historic maritime trading centre",
    featureKo: "\uC11D\uC870 \uC8FC\uD0DD\uACFC \uBC29\uC5B4\uC2DC\uC124\uC774 \uC61B \uD574\uC0C1 \uAD50\uC5ED \uC911\uC2EC\uC9C0\uC758 \uC5ED\uC0AC\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 338,
    color: "#d3b17c"
  },
  {
    id: "twyfelfontein",
    name: "Twyfelfontein",
    nameKo: "\uD2B8\uC704\uD3A0\uD3F0\uD14C\uC778",
    shape: "redrocks",
    feature: "Rock engravings depicting animals survive in a dry sandstone landscape",
    featureKo: "\uBA54\uB9C8\uB978 \uC0AC\uC554 \uACBD\uAD00\uC5D0 \uB3D9\uBB3C\uC744 \uC0C8\uAE34 \uC554\uAC01\uD654\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 339,
    color: "#b7a28c"
  },
  {
    id: "agadez",
    name: "Agadez",
    nameKo: "\uC544\uAC00\uB370\uC988",
    shape: "minaret",
    feature: "An earthen minaret rises above a Saharan trading town of traditional mud-brick houses",
    featureKo: "\uC804\uD1B5 \uD759\uBCBD\uB3CC \uC8FC\uD0DD\uC774 \uBAA8\uC778 \uC0AC\uD558\uB77C \uAD50\uC5ED\uB3C4\uC2DC \uC704\uB85C \uD759 \uBBF8\uB098\uB808\uD2B8\uAC00 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 340,
    color: "#829b8a"
  },
  {
    id: "osunosogbo",
    name: "Osun-Osogbo Sacred Grove",
    nameKo: "\uC624\uC21C\uC624\uC1FC\uADF8\uBCF4 \uC131\uB9BC",
    shape: "forest",
    feature: "Sacred forest, shrines and sculptures line the Osun River near Osogbo",
    featureKo: "\uC624\uC1FC\uADF8\uBCF4 \uADFC\uCC98 \uC624\uC21C\uAC15\uC744 \uB530\uB77C \uC131\uC2A4\uB7EC\uC6B4 \uC232\uACFC \uC131\uC18C, \uC870\uAC01\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 341,
    color: "#bca6a0"
  },
  {
    id: "aldabra",
    name: "Aldabra Atoll",
    nameKo: "\uC54C\uB2E4\uBE0C\uB77C \uD658\uCD08",
    shape: "reef",
    feature: "Coral islands surround a shallow lagoon that supports a large giant-tortoise population",
    featureKo: "\uC0B0\uD638\uC12C\uB4E4\uC774 \uB9CE\uC740 \uAC70\uBD81\uC774 \uC0B4\uC544\uAC00\uB294 \uC595\uC740 \uC11D\uD638\uB97C \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 342,
    color: "#b69772"
  },
  {
    id: "valleedemai",
    name: "Vall\xE9e de Mai",
    nameKo: "\uBC1C\uB808\uB4DC\uBA54",
    shape: "forest",
    feature: "A remnant palm forest preserves the distinctive coco-de-mer palm",
    featureKo: "\uB0A8\uC544 \uC788\uB294 \uC57C\uC790 \uC232\uC5D0 \uB3C5\uD2B9\uD55C \uCF54\uCF54\uB4DC\uBA54\uB974 \uC57C\uC790\uAC00 \uC790\uB77C\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 343,
    color: "#c4ac88"
  },
  {
    id: "sanganeb",
    name: "Sanganeb Marine Parks",
    nameKo: "\uC0B0\uAC00\uB124\uBE0C \uD574\uC591\uACF5\uC6D0",
    shape: "reef",
    feature: "Red Sea coral reefs, islands and lagoons shelter diverse marine life",
    featureKo: "\uD64D\uD574\uC758 \uC0B0\uD638\uCD08\uC640 \uC12C, \uC11D\uD638\uC5D0 \uB2E4\uC591\uD55C \uD574\uC591\uC0DD\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 344,
    color: "#aeb9a0"
  },
  {
    id: "djoudj",
    name: "Djoudj Bird Sanctuary",
    nameKo: "\uC8FC\uC9C0 \uC870\uB958\uBCF4\uD638\uAD6C\uC5ED",
    shape: "wetland",
    feature: "Wetlands at the Senegal River delta provide a refuge for migratory waterbirds",
    featureKo: "\uC138\uB124\uAC08\uAC15 \uC0BC\uAC01\uC8FC\uC758 \uC2B5\uC9C0\uAC00 \uCCA0\uC0C8 \uBB3C\uC0C8\uB4E4\uC5D0\uAC8C \uC27C\uD130\uAC00 \uB429\uB2C8\uB2E4",
    seed: 345,
    color: "#bc8b70"
  },
  {
    id: "saintlouis",
    name: "Island of Saint-Louis",
    nameKo: "\uC0DD\uB8E8\uC774\uC12C",
    shape: "town",
    feature: "A planned historic town occupies an island near the mouth of the Senegal River",
    featureKo: "\uC138\uB124\uAC08\uAC15 \uD558\uAD6C \uADFC\uCC98\uC758 \uC12C\uC5D0 \uACC4\uD68D\uC801\uC73C\uB85C \uC870\uC131\uD55C \uC5ED\uC0AC \uB3C4\uC2DC\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 346,
    color: "#8baba4"
  },
  {
    id: "saloum",
    name: "Saloum Delta",
    nameKo: "\uC0B4\uB8F8 \uC0BC\uAC01\uC8FC",
    shape: "mangrove",
    feature: "Brackish channels, mangrove islands and shell mounds form a coastal cultural landscape",
    featureKo: "\uAE30\uC218 \uBB3C\uAE38\uACFC \uB9F9\uADF8\uB85C\uBE0C\uC12C, \uC870\uAC1C\uBB34\uC9C0\uAC00 \uD574\uC548\uC758 \uBB38\uD654 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 347,
    color: "#d3b17c"
  },
  {
    id: "ounianga",
    name: "Lakes of Ounianga",
    nameKo: "\uC6B0\uB2C8\uC559\uAC00 \uD638\uC218\uAD70",
    shape: "lakes",
    feature: "Permanent desert lakes lie between dunes and sandstone formations in the Sahara",
    featureKo: "\uC0AC\uD558\uB77C\uC758 \uC0AC\uAD6C\uC640 \uC0AC\uC554 \uC9C0\uD615 \uC0AC\uC774\uC5D0 \uB9C8\uB974\uC9C0 \uC54A\uB294 \uC0AC\uB9C9 \uD638\uC218\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 348,
    color: "#b7a28c"
  },
  {
    id: "ennedi",
    name: "Ennedi Massif",
    nameKo: "\uC5D4\uB124\uB514 \uC0B0\uAD34",
    shape: "redrocks",
    feature: "Sandstone arches and pillars rise above desert valleys containing rock art",
    featureKo: "\uC554\uAC01\uD654\uAC00 \uB0A8\uC740 \uC0AC\uB9C9 \uACC4\uACE1 \uC704\uB85C \uC0AC\uC554 \uC544\uCE58\uC640 \uAE30\uB465\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 349,
    color: "#829b8a"
  },
  {
    id: "ichkeul",
    name: "Ichkeul National Park",
    nameKo: "\uC774\uC288\uCF08 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "wetland",
    feature: "A lake and marshes provide a seasonal stopping place for migrating waterbirds",
    featureKo: "\uD638\uC218\uC640 \uC2B5\uC9C0\uAC00 \uC774\uB3D9\uD558\uB294 \uBB3C\uC0C8\uB4E4\uC758 \uACC4\uC808 \uC27C\uD130\uAC00 \uB429\uB2C8\uB2E4",
    seed: 350,
    color: "#bca6a0"
  },
  {
    id: "kilwa",
    name: "Kilwa Kisiwani and Songo Mnara",
    nameKo: "\uD0AC\uC640\uD0A4\uC2DC\uC640\uB2C8\uC640 \uC1A1\uACE0\uBBC0\uB098\uB77C",
    shape: "ruins",
    feature: "Mosque and palace ruins recall prosperous Swahili trading towns on offshore islands",
    featureKo: "\uC55E\uBC14\uB2E4 \uC12C\uC758 \uBAA8\uC2A4\uD06C\uC640 \uAD81\uC804 \uC720\uC801\uC774 \uBC88\uC601\uD588\uB358 \uC2A4\uC640\uD790\uB9AC \uAD50\uC5ED\uB3C4\uC2DC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 351,
    color: "#b69772"
  },
  {
    id: "bwindi",
    name: "Bwindi Impenetrable Forest",
    nameKo: "\uBE0C\uC708\uB514 \uC6D0\uC2DC\uB9BC",
    shape: "forest",
    feature: "Dense montane forest shelters mountain gorillas and exceptionally rich plant life",
    featureKo: "\uC6B8\uCC3D\uD55C \uC0B0\uC9C0\uB9BC\uC5D0 \uB9C8\uC6B4\uD2F4\uACE0\uB9B4\uB77C\uC640 \uB2E4\uC591\uD55C \uC2DD\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 352,
    color: "#c4ac88"
  },
  {
    id: "rwenzori",
    name: "Rwenzori Mountains",
    nameKo: "\uB974\uC6EC\uC870\uB9AC\uC0B0\uB9E5",
    shape: "glacier",
    feature: "Equatorial mountains carry glaciers above moorlands and distinctive high-altitude vegetation",
    featureKo: "\uC801\uB3C4\uC758 \uC0B0 \uC704\uC5D0\uC11C \uBE59\uD558\uAC00 \uD669\uC57C\uC640 \uB3C5\uD2B9\uD55C \uACE0\uC0B0 \uC2DD\uC0DD \uC704\uB85C \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 353,
    color: "#aeb9a0"
  },
  {
    id: "capefloral",
    name: "Cape Floral Region",
    nameKo: "\uCF00\uC774\uD504 \uC2DD\uBB3C\uAD6C",
    shape: "garden",
    feature: "Fynbos shrublands contain an extraordinary concentration of endemic plant species",
    featureKo: "\uD540\uBCF4\uC2A4 \uAD00\uBAA9\uC9C0\uB300\uC5D0 \uC774 \uC9C0\uC5ED\uC5D0\uC11C\uB9CC \uC790\uB77C\uB294 \uC218\uB9CE\uC740 \uC2DD\uBB3C\uC885\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 354,
    color: "#bc8b70"
  },
  {
    id: "mapungubwe",
    name: "Mapungubwe",
    nameKo: "\uB9C8\uD48D\uAD6C\uBE0C\uC6E8",
    shape: "cliff",
    feature: "A sandstone hill and archaeological remains recall a southern African trading kingdom",
    featureKo: "\uC0AC\uC554 \uC5B8\uB355\uACFC \uACE0\uACE0 \uC720\uC801\uC774 \uB0A8\uBD80 \uC544\uD504\uB9AC\uCE74 \uAD50\uC5ED\uC655\uAD6D\uC758 \uC5ED\uC0AC\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 355,
    color: "#8baba4"
  },
  {
    id: "manapools",
    name: "Mana Pools",
    nameKo: "\uB9C8\uB098\uD480\uC2A4",
    shape: "wetland",
    feature: "Floodplain pools beside the Zambezi support elephants and many other large animals",
    featureKo: "\uC7A0\uBCA0\uC9C0\uAC15 \uC606 \uBC94\uB78C\uC6D0\uC758 \uC6C5\uB369\uC774\uC5D0 \uCF54\uB07C\uB9AC \uB4F1 \uB9CE\uC740 \uB300\uD615 \uB3D9\uBB3C\uC774 \uBAA8\uC5EC\uB4ED\uB2C8\uB2E4",
    seed: 356,
    color: "#d3b17c"
  },
  {
    id: "matobo",
    name: "Matobo Hills",
    nameKo: "\uB9C8\uD1A0\uBCF4 \uC5B8\uB355",
    shape: "redrocks",
    feature: "Granite formations and rock paintings mark a landscape with enduring spiritual significance",
    featureKo: "\uD654\uAC15\uC554 \uC9C0\uD615\uACFC \uC554\uBCBD\uD654\uAC00 \uC624\uB7AB\uB3D9\uC548 \uC2E0\uC559\uC758 \uC758\uBBF8\uB97C \uC9C0\uB2CC \uACBD\uAD00\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 357,
    color: "#b7a28c"
  },
  {
    id: "khami",
    name: "Khami Ruins",
    nameKo: "\uCE74\uBBF8 \uC720\uC801",
    shape: "ruins",
    feature: "Terraced dry-stone walls preserve the remains of a former southern African capital",
    featureKo: "\uACC4\uB2E8\uC2DD\uC73C\uB85C \uC313\uC740 \uC11D\uBCBD\uC5D0 \uB0A8\uBD80 \uC544\uD504\uB9AC\uCE74 \uC61B \uC218\uB3C4\uC758 \uD754\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 358,
    color: "#829b8a"
  },
  {
    id: "antiguadockyard",
    name: "Antigua Naval Dockyard",
    nameKo: "\uC564\uD2F0\uAC00 \uD574\uAD70\uC870\uC120\uC18C",
    shape: "harbor",
    feature: "Georgian naval buildings and dockyard structures stand within a sheltered Caribbean harbour",
    featureKo: "\uCE74\uB9AC\uBE0C\uD574\uC758 \uC544\uB291\uD55C \uD56D\uAD6C\uC5D0 \uC870\uC9C0 \uC655\uC870 \uC2DC\uB300 \uD574\uAD70 \uAC74\uBB3C\uACFC \uC870\uC120\uC18C \uC2DC\uC124\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 359,
    color: "#bca6a0"
  },
  {
    id: "bridgetown",
    name: "Historic Bridgetown",
    nameKo: "\uBE0C\uB9AC\uC9C0\uD0C0\uC6B4 \uC5ED\uC0AC\uB3C4\uC2DC",
    shape: "town",
    feature: "A historic port and garrison preserve an early British colonial urban layout in the Caribbean",
    featureKo: "\uCE74\uB9AC\uBE0C\uD574\uC758 \uC61B \uD56D\uAD6C\uC640 \uC8FC\uB454\uC9C0\uC5D0 \uCD08\uAE30 \uC601\uAD6D \uC2DD\uBBFC\uB3C4\uC2DC\uC758 \uBC30\uCE58\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 360,
    color: "#b69772"
  },
  {
    id: "potosi",
    name: "Potos\xED",
    nameKo: "\uD3EC\uD1A0\uC2DC",
    shape: "mine",
    feature: "A mining city below Cerro Rico preserves the legacy of large-scale silver extraction",
    featureKo: "\uC138\uB85C\uB9AC\uCF54 \uC544\uB798\uC758 \uAD11\uC0B0\uB3C4\uC2DC\uAC00 \uB300\uADDC\uBAA8 \uC740 \uCC44\uAD74\uC758 \uD754\uC801\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 361,
    color: "#c4ac88"
  },
  {
    id: "sucre",
    name: "Historic Sucre",
    nameKo: "\uC218\uD06C\uB808 \uC5ED\uC0AC\uB3C4\uC2DC",
    shape: "town",
    feature: "Whitewashed churches and historic civic buildings preserve Bolivia's early capital",
    featureKo: "\uD770 \uD68C\uBCBD \uAD50\uD68C\uC640 \uC61B \uACF5\uACF5\uAC74\uBB3C\uC774 \uBCFC\uB9AC\uBE44\uC544 \uCD08\uAE30 \uC218\uB3C4\uC758 \uBAA8\uC2B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 362,
    color: "#aeb9a0"
  },
  {
    id: "samaipata",
    name: "Fuerte de Samaipata",
    nameKo: "\uC0AC\uB9C8\uC774\uD30C\uD0C0 \uC694\uC0C8",
    shape: "rocktemple",
    feature: "A great carved rock and surrounding remains record pre-Hispanic ceremonial traditions",
    featureKo: "\uAC70\uB300\uD55C \uC870\uAC01 \uBC14\uC704\uC640 \uC8FC\uBCC0 \uC720\uC801\uC774 \uC5D0\uC2A4\uD30C\uB0D0 \uC9C4\uCD9C \uC774\uC804\uC758 \uC758\uB840 \uC804\uD1B5\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 363,
    color: "#bc8b70"
  },
  {
    id: "noelkempff",
    name: "Noel Kempff Mercado",
    nameKo: "\uB178\uC5D8\uCF10\uD504\uBA54\uB974\uCE74\uB3C4",
    shape: "forest",
    feature: "Forest, savanna and escarpments protect varied ecosystems at the edge of the Amazon basin",
    featureKo: "\uC544\uB9C8\uC874 \uBD84\uC9C0 \uAC00\uC7A5\uC790\uB9AC\uC758 \uC232\uACFC \uC0AC\uBC14\uB098, \uAE09\uACBD\uC0AC \uC9C0\uD615\uC774 \uB2E4\uC591\uD55C \uC0DD\uD0DC\uACC4\uB97C \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 364,
    color: "#8baba4"
  },
  {
    id: "olinda",
    name: "Historic Olinda",
    nameKo: "\uC62C\uB9B0\uB2E4 \uC5ED\uC0AC\uB3C4\uC2DC",
    shape: "town",
    feature: "Churches and colourful houses fill a hillside town shaped by the sugar economy",
    featureKo: "\uC124\uD0D5 \uACBD\uC81C\uB85C \uC131\uC7A5\uD55C \uC5B8\uB355 \uB3C4\uC2DC\uC5D0 \uAD50\uD68C\uC640 \uB2E4\uCC44\uB85C\uC6B4 \uC8FC\uD0DD\uC774 \uBAA8\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 365,
    color: "#d3b17c"
  },
  {
    id: "congonhas",
    name: "Bom Jesus do Congonhas",
    nameKo: "\uCF69\uACE0\uB0D0\uC2A4 \uBD09\uC81C\uC218\uC2A4 \uC131\uC5ED",
    shape: "basilica",
    feature: "A pilgrimage sanctuary displays Baroque sculptures along its stairway and chapels",
    featureKo: "\uC21C\uB840 \uC131\uC5ED\uC758 \uACC4\uB2E8\uACFC \uC608\uBC30\uB2F9\uC744 \uB530\uB77C \uBC14\uB85C\uD06C \uC870\uAC01\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 366,
    color: "#b7a28c"
  },
  {
    id: "pantanal",
    name: "Pantanal Conservation Area",
    nameKo: "\uD310\uD0C0\uB098\uC6B0 \uBCF4\uD638\uC9C0\uC5ED",
    shape: "wetland",
    feature: "Seasonal floodwaters create a mosaic of wetlands rich in aquatic and terrestrial wildlife",
    featureKo: "\uACC4\uC808\uB9C8\uB2E4 \uB118\uCE58\uB294 \uBB3C\uC774 \uC218\uC0DD\xB7\uC721\uC0C1 \uB3D9\uBB3C\uC774 \uD48D\uBD80\uD55C \uC2B5\uC9C0 \uACBD\uAD00\uC744 \uB9CC\uB4ED\uB2C8\uB2E4",
    seed: 367,
    color: "#829b8a"
  },
  {
    id: "fernandonoronha",
    name: "Fernando de Noronha and Atol das Rocas",
    nameKo: "\uD398\uB974\uB09C\uB450\uC9C0\uB178\uB85C\uB0D0\uC640 \uD638\uCE74\uC2A4\uD658\uCD08",
    shape: "island",
    feature: "Atlantic volcanic islands and an atoll provide feeding and breeding grounds for marine wildlife",
    featureKo: "\uB300\uC11C\uC591\uC758 \uD654\uC0B0\uC12C\uACFC \uD658\uCD08\uAC00 \uD574\uC591\uB3D9\uBB3C\uC758 \uBA39\uC774\uD130\uC640 \uBC88\uC2DD\uC9C0\uAC00 \uB429\uB2C8\uB2E4",
    seed: 368,
    color: "#bca6a0"
  },
  {
    id: "lencois",
    name: "Len\xE7\xF3is Maranhenses",
    nameKo: "\uB80C\uC18C\uC774\uC2A4\uB9C8\uB77C\uB160\uC2DC\uC2A4",
    shape: "lakes",
    feature: "White coastal dunes surround seasonal rain-fed lagoons",
    featureKo: "\uD770 \uD574\uC548 \uC0AC\uAD6C \uC0AC\uC774\uC5D0 \uBE57\uBB3C\uB85C \uC0DD\uAE30\uB294 \uACC4\uC808 \uC11D\uD638\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 369,
    color: "#b69772"
  },
  {
    id: "pampulha",
    name: "Pampulha Modern Ensemble",
    nameKo: "\uD31C\uD480\uB7B4 \uADFC\uB300\uAC74\uCD95\uB2E8\uC9C0",
    shape: "modern",
    feature: "Curving modern buildings and designed gardens surround an artificial lake",
    featureKo: "\uACE1\uC120\uC758 \uADFC\uB300 \uAC74\uBB3C\uACFC \uC870\uACBD \uC815\uC6D0\uC774 \uC778\uACF5\uD638\uC218\uB97C \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 370,
    color: "#c4ac88"
  },
  {
    id: "lanseauxmeadows",
    name: "L'Anse aux Meadows",
    nameKo: "\uB780\uC138\uC624\uBA54\uB3C4\uC2A4",
    shape: "thatched",
    feature: "Remains of timber-framed turf buildings record a Norse settlement in Newfoundland",
    featureKo: "\uB098\uBB34 \uACE8\uC870\uC5D0 \uC794\uB514\uB97C \uB36E\uC740 \uAC74\uBB3C \uC720\uC801\uC774 \uB274\uD380\uB4E4\uB79C\uB4DC\uC758 \uB178\uB974\uB4DC \uC815\uCC29\uC9C0\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 371,
    color: "#aeb9a0"
  },
  {
    id: "sgang",
    name: "SGang Gwaay",
    nameKo: "\uC2A4\uAC15\uACFC\uC774",
    shape: "stelae",
    feature: "Carved mortuary and memorial poles survive in the remains of a Haida village",
    featureKo: "\uD558\uC774\uB2E4 \uB9C8\uC744 \uC720\uC801\uC5D0 \uC870\uAC01\uD55C \uC7A5\uB840 \uAE30\uB465\uACFC \uAE30\uB150 \uAE30\uB465\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 372,
    color: "#bc8b70"
  },
  {
    id: "woodbuffalo",
    name: "Wood Buffalo National Park",
    nameKo: "\uC6B0\uB4DC\uBC84\uD384\uB85C \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "forest",
    feature: "Boreal forest and a vast inland delta support wood bison and other wildlife",
    featureKo: "\uBD81\uBC29\uB9BC\uACFC \uAC70\uB300\uD55C \uB0B4\uB959 \uC0BC\uAC01\uC8FC\uC5D0 \uC232\uB4E4\uC18C \uB4F1 \uC57C\uC0DD\uB3D9\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 373,
    color: "#8baba4"
  },
  {
    id: "oldquebec",
    name: "Old Qu\xE9bec",
    nameKo: "\uD018\uBCA1 \uAD6C\uC2DC\uAC00\uC9C0",
    shape: "fortress",
    feature: "Fortified upper and lower towns preserve a historic French colonial city in North America",
    featureKo: "\uBD81\uC544\uBA54\uB9AC\uCE74\uC758 \uC61B \uD504\uB791\uC2A4 \uC2DD\uBBFC\uB3C4\uC2DC\uC5D0 \uC131\uBCBD\uC73C\uB85C \uB458\uB7EC\uC2FC \uC704\xB7\uC544\uB798 \uB9C8\uC744\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 374,
    color: "#d3b17c"
  },
  {
    id: "rideau",
    name: "Rideau Canal",
    nameKo: "\uB9AC\uB3C4 \uC6B4\uD558",
    shape: "canal",
    feature: "Locks, dams and channels preserve an early nineteenth-century slackwater canal",
    featureKo: "\uC218\uBB38\uACFC \uB310, \uBB3C\uAE38\uC774 19\uC138\uAE30 \uCD08\uC758 \uC644\uB958\uC2DD \uC6B4\uD558\uB97C \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 375,
    color: "#b7a28c"
  },
  {
    id: "joggins",
    name: "Joggins Fossil Cliffs",
    nameKo: "\uC870\uAE34\uC2A4 \uD654\uC11D\uC808\uBCBD",
    shape: "cliff",
    feature: "Coastal cliffs expose fossil-rich layers from ancient coal-age tropical forests",
    featureKo: "\uD574\uC548 \uC808\uBCBD\uC5D0 \uC11D\uD0C4\uAE30 \uC5F4\uB300\uB9BC\uC758 \uD654\uC11D\uC774 \uD48D\uBD80\uD55C \uC9C0\uCE35\uC774 \uB4DC\uB7EC\uB098 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 376,
    color: "#829b8a"
  },
  {
    id: "humberstone",
    name: "Humberstone and Santa Laura",
    nameKo: "\uC6C0\uBCA0\uB974\uC2A4\uD1A4\uACFC \uC0B0\uD0C0\uB77C\uC6B0\uB77C",
    shape: "industrial",
    feature: "Abandoned nitrate works preserve industrial structures in the Atacama Desert",
    featureKo: "\uC544\uD0C0\uCE74\uB9C8\uC0AC\uB9C9\uC758 \uD3D0\uCD08\uC11D\uACF5\uC7A5\uC5D0 \uC0B0\uC5C5 \uC2DC\uC124\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 377,
    color: "#bca6a0"
  },
  {
    id: "sewell",
    name: "Sewell Mining Town",
    nameKo: "\uC138\uC6F0 \uAD11\uC0B0\uB3C4\uC2DC",
    shape: "town",
    feature: "A mountain mining town uses stairways to connect buildings across steep Andean slopes",
    featureKo: "\uC548\uB370\uC2A4\uC758 \uAC00\uD30C\uB978 \uC0B0\uBE44\uD0C8\uC5D0 \uC9C0\uC740 \uAD11\uC0B0\uB3C4\uC2DC\uC5D0\uC11C \uACC4\uB2E8\uC774 \uAC74\uBB3C\uB4E4\uC744 \uC774\uC5B4 \uC90D\uB2C8\uB2E4",
    seed: 378,
    color: "#b69772"
  },
  {
    id: "mompox",
    name: "Santa Cruz de Mompox",
    nameKo: "\uC0B0\uD0C0\uD06C\uB8E8\uC2A4\uB370\uBAB8\uD3EC\uC2A4",
    shape: "town",
    feature: "A historic river town preserves houses and churches along the Magdalena River",
    featureKo: "\uB9C9\uB2EC\uB808\uB098\uAC15\uC744 \uB530\uB77C \uC61B \uAC15\uBCC0 \uB3C4\uC2DC\uC758 \uC8FC\uD0DD\uACFC \uAD50\uD68C\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 379,
    color: "#c4ac88"
  },
  {
    id: "sanagustin",
    name: "San Agust\xEDn Archaeological Park",
    nameKo: "\uC0B0\uC544\uAD6C\uC2A4\uD2F4 \uACE0\uACE0\uACF5\uC6D0",
    shape: "stelae",
    feature: "Large stone sculptures and burial monuments preserve a distinctive Andean ceremonial landscape",
    featureKo: "\uCEE4\uB2E4\uB780 \uC11D\uC0C1\uACFC \uC7A5\uB840 \uC720\uC801\uC774 \uB3C5\uD2B9\uD55C \uC548\uB370\uC2A4 \uC758\uB840 \uACBD\uAD00\uC744 \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 380,
    color: "#aeb9a0"
  },
  {
    id: "chiribiquete",
    name: "Chiribiquete National Park",
    nameKo: "\uCE58\uB9AC\uBE44\uCF00\uD14C \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "cliff",
    feature: "Table mountains rise over tropical forests containing extensive rock paintings",
    featureKo: "\uB9CE\uC740 \uC554\uBCBD\uD654\uAC00 \uB0A8\uC740 \uC5F4\uB300\uB9BC \uC704\uB85C \uD0C1\uC0C1\uC0B0\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 381,
    color: "#bc8b70"
  },
  {
    id: "cocosisland",
    name: "Cocos Island",
    nameKo: "\uCF54\uCF54\uC2A4\uC12C",
    shape: "island",
    feature: "A remote oceanic island supports humid forest and exceptionally rich surrounding marine life",
    featureKo: "\uC678\uB534 \uB300\uC591\uC12C\uC5D0 \uC2B5\uC724\uD55C \uC232\uC774 \uC790\uB77C\uACE0 \uC8FC\uBCC0 \uBC14\uB2E4\uC5D0 \uB2E4\uC591\uD55C \uD574\uC591\uC0DD\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 382,
    color: "#8baba4"
  },
  {
    id: "diquis",
    name: "Diqu\xEDs Stone Spheres",
    nameKo: "\uB514\uD0A4\uC2A4 \uC11D\uAD6C",
    shape: "jars",
    feature: "Large stone spheres survive at pre-Columbian settlements in the Diqu\xEDs Delta",
    featureKo: "\uB514\uD0A4\uC2A4 \uC0BC\uAC01\uC8FC\uC758 \uCF5C\uB7FC\uBC84\uC2A4 \uC774\uC804 \uC815\uCC29\uC9C0\uC5D0 \uCEE4\uB2E4\uB780 \uB3CC\uAD6C\uC2AC\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 383,
    color: "#d3b17c"
  },
  {
    id: "havana",
    name: "Old Havana",
    nameKo: "\uC544\uBC14\uB098 \uAD6C\uC2DC\uAC00\uC9C0",
    shape: "town",
    feature: "Fortifications, plazas and arcaded buildings preserve a historic Caribbean port city",
    featureKo: "\uBC29\uC5B4\uC2DC\uC124\uACFC \uAD11\uC7A5, \uC544\uCF00\uC774\uB4DC \uAC74\uBB3C\uB4E4\uC774 \uCE74\uB9AC\uBE0C\uD574 \uD56D\uAD6C\uB3C4\uC2DC\uC758 \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 384,
    color: "#b7a28c"
  },
  {
    id: "vinales",
    name: "Vi\xF1ales Valley",
    nameKo: "\uBE44\uB0D8\uB808\uC2A4 \uACC4\uACE1",
    shape: "pillars",
    feature: "Limestone hills rise above a valley of traditional farms and tobacco fields",
    featureKo: "\uC804\uD1B5 \uB18D\uAC00\uC640 \uB2F4\uBC30\uBC2D\uC774 \uC788\uB294 \uACC4\uACE1 \uC704\uB85C \uC11D\uD68C\uC554 \uC5B8\uB355\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 385,
    color: "#829b8a"
  },
  {
    id: "sanpedroroca",
    name: "San Pedro de la Roca Castle",
    nameKo: "\uC0B0\uD398\uB4DC\uB85C\uB378\uB77C\uB85C\uCE74\uC131",
    shape: "fortress",
    feature: "Terraced fortifications guard a Caribbean harbour entrance from a rocky promontory",
    featureKo: "\uBC14\uC704 \uACF6\uC758 \uACC4\uB2E8\uC2DD \uBC29\uC5B4\uC2DC\uC124\uC774 \uCE74\uB9AC\uBE0C\uD574 \uD56D\uAD6C\uC758 \uC785\uAD6C\uB97C \uC9C0\uD0A4\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 386,
    color: "#bca6a0"
  },
  {
    id: "mornetrois",
    name: "Morne Trois Pitons",
    nameKo: "\uBAA8\uB978\uD2B8\uB8E8\uC544\uD53C\uD1B5",
    shape: "volcano",
    feature: "A volcanic mountain landscape contains hot springs, fumaroles and tropical forest",
    featureKo: "\uD654\uC0B0 \uC0B0\uC545 \uACBD\uAD00\uC5D0 \uC628\uCC9C\uACFC \uBD84\uAE30\uACF5, \uC5F4\uB300\uB9BC\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 387,
    color: "#b69772"
  },
  {
    id: "santodomingo",
    name: "Colonial Santo Domingo",
    nameKo: "\uC0B0\uD1A0\uB3C4\uBC0D\uACE0 \uC2DD\uBBFC\uB3C4\uC2DC",
    shape: "town",
    feature: "An early European colonial city preserves a grid of historic streets and monuments",
    featureKo: "\uCD08\uAE30 \uC720\uB7FD \uC2DD\uBBFC\uB3C4\uC2DC\uC5D0 \uACA9\uC790\uD615 \uC61B \uAC70\uB9AC\uC640 \uC720\uC801\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 388,
    color: "#c4ac88"
  },
  {
    id: "galapagos",
    name: "Gal\xE1pagos Islands",
    nameKo: "\uAC08\uB77C\uD30C\uACE0\uC2A4\uC81C\uB3C4",
    shape: "island",
    feature: "Remote volcanic islands harbour distinctive wildlife shaped by isolation and ocean conditions",
    featureKo: "\uC678\uB534 \uD654\uC0B0\uC12C\uB4E4\uC5D0 \uACE0\uB9BD\uACFC \uD574\uC591 \uD658\uACBD\uC774 \uBE5A\uC740 \uB3C5\uD2B9\uD55C \uC57C\uC0DD\uB3D9\uBB3C\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 389,
    color: "#aeb9a0"
  },
  {
    id: "sangay",
    name: "Sangay National Park",
    nameKo: "\uC0C1\uAC00\uC774 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "volcano",
    feature: "Active volcanoes rise above a range of ecosystems from tropical forest to mountain grassland",
    featureKo: "\uC5F4\uB300\uB9BC\uC5D0\uC11C \uC0B0\uC545 \uCD08\uC9C0\uB85C \uC774\uC5B4\uC9C0\uB294 \uB2E4\uC591\uD55C \uC0DD\uD0DC\uACC4 \uC704\uB85C \uD65C\uD654\uC0B0\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 390,
    color: "#bc8b70"
  },
  {
    id: "antiguaguatemala",
    name: "Antigua Guatemala",
    nameKo: "\uC548\uD2F0\uACFC\uACFC\uD14C\uB9D0\uB77C",
    shape: "town",
    feature: "Baroque churches and civic buildings preserve a former colonial capital beneath volcanoes",
    featureKo: "\uD654\uC0B0 \uC544\uB798\uC758 \uC61B \uC2DD\uBBFC\uC9C0 \uC218\uB3C4\uC5D0 \uBC14\uB85C\uD06C \uAD50\uD68C\uC640 \uACF5\uACF5\uAC74\uBB3C\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 391,
    color: "#8baba4"
  },
  {
    id: "quirigua",
    name: "Quirigu\xE1",
    nameKo: "\uD0A4\uB9AC\uACFC",
    shape: "stelae",
    feature: "Finely carved Maya stelae and sculpted monuments survive in a tropical archaeological park",
    featureKo: "\uC5F4\uB300\uC758 \uACE0\uACE0\uACF5\uC6D0\uC5D0 \uC815\uAD50\uD558\uAC8C \uC870\uAC01\uD55C \uB9C8\uC57C \uC11D\uBE44\uC640 \uAE30\uB150\uBB3C\uB4E4\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 392,
    color: "#d3b17c"
  },
  {
    id: "rioplatano",
    name: "R\xEDo Pl\xE1tano Biosphere Reserve",
    nameKo: "\uB9AC\uC624\uD50C\uB77C\uD0C0\uB178 \uC0DD\uBB3C\uAD8C\uBCF4\uC804\uC9C0\uC5ED",
    shape: "forest",
    feature: "Tropical rainforest and mountainous lowlands follow a river toward the Caribbean coast",
    featureKo: "\uC5F4\uB300\uC6B0\uB9BC\uACFC \uC0B0\uC545 \uC800\uC9C0\uB300\uAC00 \uAC15\uC744 \uB530\uB77C \uCE74\uB9AC\uBE0C\uD574 \uD574\uC548\uC73C\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 393,
    color: "#b7a28c"
  },
  {
    id: "pitons",
    name: "Saint Lucia Pitons",
    nameKo: "\uC138\uC778\uD2B8\uB8E8\uC2DC\uC544 \uD53C\uD1B5",
    shape: "peaks",
    feature: "Two steep volcanic spires rise above the Caribbean Sea beside a volcanic landscape",
    featureKo: "\uCE74\uB9AC\uBE0C\uD574 \uC704\uB85C \uAC00\uD30C\uB978 \uD654\uC0B0 \uBD09\uC6B0\uB9AC \uB450 \uAC1C\uAC00 \uC19F\uACE0 \uC8FC\uBCC0\uC5D0 \uD654\uC0B0 \uACBD\uAD00\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 394,
    color: "#829b8a"
  },
  {
    id: "eltajin",
    name: "El Taj\xEDn",
    nameKo: "\uC5D8\uD0C0\uD78C",
    shape: "pyramid",
    feature: "Pyramids with decorative niches preserve the ceremonial core of an ancient Gulf Coast city",
    featureKo: "\uC7A5\uC2DD \uAC10\uC2E4\uC774 \uC788\uB294 \uD53C\uB77C\uBBF8\uB4DC\uB4E4\uC774 \uBA55\uC2DC\uCF54\uB9CC \uD574\uC548 \uACE0\uB300 \uB3C4\uC2DC\uC758 \uC758\uB840 \uC911\uC2EC\uC9C0\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 395,
    color: "#bca6a0"
  },
  {
    id: "paquime",
    name: "Paquim\xE9",
    nameKo: "\uD30C\uD0A4\uBA54",
    shape: "adobe",
    feature: "Multi-storeyed earthen ruins preserve a trading settlement in northern Mexico",
    featureKo: "\uBA55\uC2DC\uCF54 \uBD81\uBD80\uC758 \uAD50\uC5ED \uC815\uCC29\uC9C0\uC5D0 \uC5EC\uB7EC \uCE35\uC73C\uB85C \uC9C0\uC740 \uD759 \uAC74\uBB3C \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 396,
    color: "#b69772"
  },
  {
    id: "vizcaino",
    name: "El Vizca\xEDno Whale Sanctuary",
    nameKo: "\uC5D8\uBE44\uC2A4\uCE74\uC774\uB178 \uACE0\uB798\uBCF4\uD638\uAD6C\uC5ED",
    shape: "coast",
    feature: "Coastal lagoons provide winter breeding grounds for grey whales",
    featureKo: "\uD574\uC548 \uC11D\uD638\uAC00 \uADC0\uC2E0\uACE0\uB798\uC758 \uACA8\uC6B8 \uBC88\uC2DD\uC9C0\uAC00 \uB429\uB2C8\uB2E4",
    seed: 397,
    color: "#c4ac88"
  },
  {
    id: "xochicalco",
    name: "Xochicalco",
    nameKo: "\uC18C\uCE58\uCE7C\uCF54",
    shape: "pyramid",
    feature: "A fortified ceremonial city preserves pyramids and relief-carved monuments on a hilltop",
    featureKo: "\uC5B8\uB355 \uC704\uC758 \uC758\uB840 \uC131\uACFD\uB3C4\uC2DC\uC5D0 \uD53C\uB77C\uBBF8\uB4DC\uC640 \uBD80\uC870\uB85C \uC7A5\uC2DD\uD55C \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 398,
    color: "#aeb9a0"
  },
  {
    id: "monarch",
    name: "Monarch Butterfly Reserve",
    nameKo: "\uBAA8\uB098\uD06C\uB098\uBE44 \uBCF4\uD638\uAD6C\uC5ED",
    shape: "forest",
    feature: "High-elevation forests shelter vast numbers of overwintering monarch butterflies",
    featureKo: "\uACE0\uC9C0\uB300 \uC232\uC5D0 \uACA8\uC6B8\uC744 \uB098\uB294 \uC218\uB9CE\uC740 \uBAA8\uB098\uD06C\uB098\uBE44\uAC00 \uBAA8\uC5EC\uB4ED\uB2C8\uB2E4",
    seed: 399,
    color: "#bc8b70"
  },
  {
    id: "pinacate",
    name: "El Pinacate and Gran Desierto",
    nameKo: "\uC5D8\uD53C\uB098\uCE74\uD14C\uC640 \uADF8\uB780\uB370\uC2DC\uC5D0\uB974\uD1A0",
    shape: "crater",
    feature: "Volcanic craters and dark lava fields meet a vast sand-dune desert",
    featureKo: "\uD654\uC0B0 \uBD84\uD654\uAD6C\uC640 \uAC80\uC740 \uC6A9\uC554 \uC9C0\uB300\uAC00 \uAD11\uB300\uD55C \uBAA8\uB798\uC0AC\uB9C9\uACFC \uB9CC\uB0A9\uB2C8\uB2E4",
    seed: 400,
    color: "#8baba4"
  },
  {
    id: "padretembleque",
    name: "Padre Tembleque Aqueduct",
    nameKo: "\uD30C\uB4DC\uB808\uD15C\uBE14\uB808\uCF00 \uC218\uB85C\uAD50",
    shape: "aqueduct",
    feature: "A colonial hydraulic system includes a remarkable high arcade carrying water across a valley",
    featureKo: "\uC2DD\uBBFC\uC9C0 \uC2DC\uB300 \uC218\uB9AC\uC2DC\uC124\uC5D0 \uACC4\uACE1\uC744 \uAC74\uB108 \uBB3C\uC744 \uB098\uB974\uB294 \uB192\uC740 \uC544\uCF00\uC774\uB4DC\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 401,
    color: "#d3b17c"
  },
  {
    id: "coiba",
    name: "Coiba National Park",
    nameKo: "\uCF54\uC774\uBC14 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "island",
    feature: "Forested Pacific islands and surrounding waters protect rich marine and terrestrial ecosystems",
    featureKo: "\uC232\uC73C\uB85C \uB36E\uC778 \uD0DC\uD3C9\uC591\uC758 \uC12C\uACFC \uC8FC\uBCC0 \uBC14\uB2E4\uAC00 \uD48D\uBD80\uD55C \uC721\uC0C1\xB7\uD574\uC591 \uC0DD\uD0DC\uACC4\uB97C \uC9C0\uD0B5\uB2C8\uB2E4",
    seed: 402,
    color: "#b7a28c"
  },
  {
    id: "chavin",
    name: "Chav\xEDn",
    nameKo: "\uCC28\uBE48",
    shape: "rocktemple",
    feature: "Ancient stone temples and carved monuments stand in a high Andean valley",
    featureKo: "\uB192\uC740 \uC548\uB370\uC2A4 \uACC4\uACE1\uC5D0 \uACE0\uB300 \uC11D\uC870 \uC2E0\uC804\uACFC \uC870\uAC01 \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 403,
    color: "#829b8a"
  },
  {
    id: "huascaran",
    name: "Huascar\xE1n National Park",
    nameKo: "\uC6B0\uC544\uC2A4\uCE74\uB780 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "glacier",
    feature: "Glaciers and deep ravines shape the high peaks of the Cordillera Blanca",
    featureKo: "\uBE59\uD558\uC640 \uAE4A\uC740 \uACE8\uC9DC\uAE30\uAC00 \uCF54\uB974\uB514\uC608\uB77C\uBE14\uB791\uCE74\uC758 \uB192\uC740 \uBD09\uC6B0\uB9AC\uB4E4\uC744 \uBE5A\uC5C8\uC2B5\uB2C8\uB2E4",
    seed: 404,
    color: "#bca6a0"
  },
  {
    id: "caral",
    name: "Sacred City of Caral-Supe",
    nameKo: "\uCE74\uB784\uC218\uD398 \uC131\uC2DC",
    shape: "pyramid",
    feature: "Ancient platform mounds and circular courts preserve an early urban centre in the Supe Valley",
    featureKo: "\uC218\uD398 \uACC4\uACE1\uC758 \uCD08\uAE30 \uB3C4\uC2DC \uC911\uC2EC\uC9C0\uC5D0 \uB2E8\uC744 \uC313\uC740 \uC5B8\uB355\uACFC \uC6D0\uD615 \uAD11\uC7A5\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 405,
    color: "#b69772"
  },
  {
    id: "chankillo",
    name: "Chankillo",
    nameKo: "\uCC2C\uD0A4\uC694",
    shape: "observatory",
    feature: "Thirteen towers form the horizon markers of an ancient solar observatory",
    featureKo: "\uC5F4\uC138 \uAC1C\uC758 \uD0D1\uC774 \uACE0\uB300 \uD0DC\uC591 \uAD00\uCE21\uC18C\uC758 \uC9C0\uD3C9\uC120 \uD45C\uC9C0\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 406,
    color: "#c4ac88"
  },
  {
    id: "paramaribo",
    name: "Paramaribo Historic Centre",
    nameKo: "\uD30C\uB77C\uB9C8\uB9AC\uBCF4 \uC5ED\uC0AC\uC911\uC2EC\uC9C0",
    shape: "town",
    feature: "Timber buildings combine European urban planning with local building techniques",
    featureKo: "\uBAA9\uC870 \uAC74\uBB3C\uB4E4\uC5D0 \uC720\uB7FD\uC2DD \uB3C4\uC2DC\uACC4\uD68D\uACFC \uD604\uC9C0 \uAC74\uCD95 \uAE30\uC220\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 407,
    color: "#aeb9a0"
  },
  {
    id: "redwood",
    name: "Redwood National and State Parks",
    nameKo: "\uB808\uB4DC\uC6B0\uB4DC \uAD6D\uB9BD\xB7\uC8FC\uB9BD\uACF5\uC6D0",
    shape: "forest",
    feature: "Towering coast redwoods grow along a Pacific landscape of forests, rivers and coastline",
    featureKo: "\uC232\uACFC \uAC15, \uD574\uC548\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uD0DC\uD3C9\uC591 \uACBD\uAD00\uC5D0 \uAC70\uB300\uD55C \uD574\uC548\uC0BC\uB098\uBB34\uB4E4\uC774 \uC790\uB78D\uB2C8\uB2E4",
    seed: 408,
    color: "#bc8b70"
  },
  {
    id: "olympic",
    name: "Olympic National Park",
    nameKo: "\uC62C\uB9BC\uD53D \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "forest",
    feature: "Glaciated peaks and temperate rainforest meet a wild Pacific coastline",
    featureKo: "\uBE59\uD558\uAC00 \uAE4E\uC740 \uBD09\uC6B0\uB9AC\uC640 \uC628\uB300\uC6B0\uB9BC\uC774 \uD0DC\uD3C9\uC591\uC758 \uC57C\uC0DD \uD574\uC548\uACFC \uB9CC\uB0A9\uB2C8\uB2E4",
    seed: 409,
    color: "#8baba4"
  },
  {
    id: "cahokia",
    name: "Cahokia Mounds",
    nameKo: "\uCE74\uD638\uD0A4\uC544 \uB9C8\uC6B4\uB4DC",
    shape: "pyramid",
    feature: "Large earthen mounds preserve the centre of a major pre-Columbian settlement",
    featureKo: "\uCEE4\uB2E4\uB780 \uD759 \uC5B8\uB355\uB4E4\uC774 \uCF5C\uB7FC\uBC84\uC2A4 \uC774\uC804 \uC8FC\uC694 \uC815\uCC29\uC9C0\uC758 \uC911\uC2EC\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 410,
    color: "#d3b17c"
  },
  {
    id: "hawaiivolcanoes",
    name: "Hawaii Volcanoes",
    nameKo: "\uD558\uC640\uC774 \uD654\uC0B0",
    shape: "volcano",
    feature: "Active shield volcanoes continually reshape a landscape of lava flows and craters",
    featureKo: "\uD65C\uB3D9\uD558\uB294 \uC21C\uC0C1\uD654\uC0B0\uC774 \uC6A9\uC554\uB958\uC640 \uBD84\uD654\uAD6C\uC758 \uACBD\uAD00\uC744 \uACC4\uC18D \uBC14\uAFB8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 411,
    color: "#b7a28c"
  },
  {
    id: "colonia",
    name: "Colonia del Sacramento",
    nameKo: "\uCF5C\uB85C\uB2C8\uC544\uB378\uC0AC\uD06C\uB77C\uBA58\uD1A0",
    shape: "town",
    feature: "A historic riverside settlement preserves a mixture of Portuguese and Spanish colonial traditions",
    featureKo: "\uAC15\uBCC0\uC758 \uC5ED\uC0AC \uC815\uCC29\uC9C0\uC5D0 \uD3EC\uB974\uD22C\uAC08\uACFC \uC5D0\uC2A4\uD30C\uB0D0\uC758 \uC2DD\uBBFC \uAC74\uCD95 \uC804\uD1B5\uC774 \uC11E\uC5EC \uC788\uC2B5\uB2C8\uB2E4",
    seed: 412,
    color: "#829b8a"
  },
  {
    id: "canaima",
    name: "Canaima National Park",
    nameKo: "\uCE74\uB098\uC774\uB9C8 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "waterfall",
    feature: "Table mountains and towering waterfalls dominate the Guiana Shield landscape",
    featureKo: "\uAE30\uC544\uB098 \uC21C\uC0C1\uC9C0\uC758 \uACBD\uAD00 \uC704\uB85C \uD0C1\uC0C1\uC0B0\uACFC \uB192\uC740 \uD3ED\uD3EC\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 413,
    color: "#bca6a0"
  },
  {
    id: "kakadu",
    name: "Kakadu National Park",
    nameKo: "\uCE74\uCE74\uB450 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "wetland",
    feature: "Escarpments, wetlands and rock-art sites preserve a landscape with a long Aboriginal history",
    featureKo: "\uC808\uBCBD\uACFC \uC2B5\uC9C0, \uC554\uBCBD\uD654 \uC720\uC801\uC774 \uC624\uB79C \uC6D0\uC8FC\uBBFC \uC5ED\uC0AC\uB97C \uD488\uC740 \uACBD\uAD00\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 414,
    color: "#b69772"
  },
  {
    id: "uluru",
    name: "Uluru-Kata Tjuta",
    nameKo: "\uC6B8\uB8E8\uB8E8\uCE74\uD0C0\uCD94\uD0C0",
    shape: "redrocks",
    feature: "An immense sandstone monolith and rounded rock domes rise from the central Australian plain",
    featureKo: "\uD638\uC8FC \uC911\uBD80 \uD3C9\uC6D0 \uC704\uB85C \uAC70\uB300\uD55C \uC0AC\uC554 \uBC14\uC704\uC640 \uB465\uADFC \uBC14\uC704 \uBD09\uC6B0\uB9AC\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 415,
    color: "#c4ac88"
  },
  {
    id: "sharkbay",
    name: "Shark Bay",
    nameKo: "\uC0E4\uD06C\uB9CC",
    shape: "coast",
    feature: "Seagrass beds and stromatolites occur in a broad bay on Australia's western coast",
    featureKo: "\uD638\uC8FC \uC11C\uD574\uC548\uC758 \uB113\uC740 \uB9CC\uC5D0 \uD574\uCD08 \uAD70\uB77D\uACFC \uC2A4\uD2B8\uB85C\uB9C8\uD1A8\uB77C\uC774\uD2B8\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 416,
    color: "#aeb9a0"
  },
  {
    id: "bluemountains",
    name: "Greater Blue Mountains",
    nameKo: "\uADF8\uB808\uC774\uD130\uBE14\uB8E8\uB9C8\uC6B4\uD2F4\uC2A4",
    shape: "cliff",
    feature: "Sandstone plateaux and deep gorges support a remarkable diversity of eucalypt vegetation",
    featureKo: "\uC0AC\uC554 \uACE0\uC6D0\uACFC \uAE4A\uC740 \uD611\uACE1\uC5D0 \uB2E4\uC591\uD55C \uC720\uCE7C\uB9BD\uD22C\uC2A4 \uC2DD\uC0DD\uC774 \uC790\uB78D\uB2C8\uB2E4",
    seed: 417,
    color: "#bc8b70"
  },
  {
    id: "purnululu",
    name: "Purnululu",
    nameKo: "\uD478\uB974\uB20C\uB8F0\uB8E8",
    shape: "pillars",
    feature: "Orange and dark-striped sandstone domes form the distinctive Bungle Bungle range",
    featureKo: "\uC8FC\uD669\uC0C9\uACFC \uC9D9\uC740 \uB760\uB97C \uB450\uB978 \uC0AC\uC554 \uB3D4\uB4E4\uC774 \uB3C5\uD2B9\uD55C \uBC99\uAE00\uBC99\uAE00\uC0B0\uB9E5\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 418,
    color: "#8baba4"
  },
  {
    id: "ningaloo",
    name: "Ningaloo Coast",
    nameKo: "\uB2DD\uAC08\uB8E8 \uD574\uC548",
    shape: "reef",
    feature: "An extensive fringing reef lies beside an arid coast visited by whale sharks",
    featureKo: "\uACE0\uB798\uC0C1\uC5B4\uAC00 \uCC3E\uC544\uC624\uB294 \uAC74\uC870\uD55C \uD574\uC548 \uC606\uC5D0 \uB113\uC740 \uAC70\uCD08\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 419,
    color: "#d3b17c"
  },
  {
    id: "tongariro",
    name: "Tongariro National Park",
    nameKo: "\uD1B5\uAC00\uB9AC\uB85C \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "volcano",
    feature: "Volcanoes and lakes form a mountain landscape of deep cultural significance to M\u0101ori people",
    featureKo: "\uD654\uC0B0\uACFC \uD638\uC218\uAC00 \uB9C8\uC624\uB9AC\uC778\uC5D0\uAC8C \uAE4A\uC740 \uBB38\uD654\uC801 \uC758\uBBF8\uB97C \uC9C0\uB2CC \uC0B0\uC545 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 420,
    color: "#b7a28c"
  },
  {
    id: "tewahipounamu",
    name: "Te Wahipounamu",
    nameKo: "\uD14C\uC640\uD788\uD3EC\uC6B0\uB098\uBB34",
    shape: "fjord",
    feature: "Glaciers, fjords and ancient forests shape the southwest of New Zealand's South Island",
    featureKo: "\uBE59\uD558\uC640 \uD53C\uC624\uB974, \uC624\uB798\uB41C \uC232\uC774 \uB274\uC9C8\uB79C\uB4DC \uB0A8\uC12C \uB0A8\uC11C\uBD80\uC758 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 421,
    color: "#829b8a"
  },
  {
    id: "levuka",
    name: "Levuka Historical Port Town",
    nameKo: "\uB808\uBD80\uCE74 \uC5ED\uC0AC\uD56D\uAD6C\uB3C4\uC2DC",
    shape: "harbor",
    feature: "Low timber buildings preserve a Pacific port town beneath steep volcanic slopes",
    featureKo: "\uAC00\uD30C\uB978 \uD654\uC0B0 \uBE44\uD0C8 \uC544\uB798 \uB0AE\uC740 \uBAA9\uC870 \uAC74\uBB3C\uB4E4\uC774 \uD0DC\uD3C9\uC591 \uD56D\uAD6C\uB3C4\uC2DC\uC758 \uBAA8\uC2B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 422,
    color: "#bca6a0"
  },
  {
    id: "roimata",
    name: "Chief Roi Mata's Domain",
    nameKo: "\uB85C\uC774\uB9C8\uD0C0 \uCD94\uC7A5 \uC720\uC801",
    shape: "island",
    feature: "Settlement, burial and cave sites recall a Pacific chief and the traditions surrounding his life",
    featureKo: "\uC815\uCC29\uC9C0\uC640 \uBB34\uB364, \uB3D9\uAD74 \uC720\uC801\uC774 \uD0DC\uD3C9\uC591 \uCD94\uC7A5\uACFC \uADF8\uC758 \uC0B6\uC5D0 \uC5BD\uD78C \uC804\uD1B5\uC744 \uC804\uD569\uB2C8\uB2E4",
    seed: 423,
    color: "#b69772"
  },
  {
    id: "eastrennell",
    name: "East Rennell",
    nameKo: "\uB3D9\uB808\uB12C",
    shape: "island",
    feature: "A raised coral atoll contains a large lake surrounded by dense tropical forest",
    featureKo: "\uC735\uAE30\uD55C \uC0B0\uD638 \uD658\uCD08 \uC548\uC5D0 \uC6B8\uCC3D\uD55C \uC5F4\uB300\uB9BC\uC73C\uB85C \uB458\uB7EC\uC2F8\uC778 \uD070 \uD638\uC218\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 424,
    color: "#c4ac88"
  },
  {
    id: "kuk",
    name: "Kuk Early Agricultural Site",
    nameKo: "\uCFE0\uD06C \uCD08\uAE30\uB18D\uACBD\uC720\uC801",
    shape: "terraces",
    feature: "Ancient drainage systems record the development of agriculture in the New Guinea highlands",
    featureKo: "\uC61B \uBC30\uC218\uC2DC\uC124\uC774 \uB274\uAE30\uB2C8 \uACE0\uC9C0\uB300\uC5D0\uC11C \uB18D\uC5C5\uC774 \uBC1C\uB2EC\uD55C \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 425,
    color: "#aeb9a0"
  },
  {
    id: "bagerhat",
    name: "Mosque City of Bagerhat",
    nameKo: "\uBC14\uAC8C\uB974\uD558\uD2B8 \uBAA8\uC2A4\uD06C\uB3C4\uC2DC",
    shape: "mosque",
    feature: "Historic brick mosques and water infrastructure survive in a city founded near the Ganges delta",
    featureKo: "\uAC20\uC9C0\uC2A4 \uC0BC\uAC01\uC8FC \uADFC\uCC98\uC5D0 \uC138\uC6B4 \uB3C4\uC2DC\uC5D0 \uC61B \uBCBD\uB3CC \uBAA8\uC2A4\uD06C\uC640 \uC218\uB9AC\uC2DC\uC124\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 426,
    color: "#bc8b70"
  },
  {
    id: "paharpur",
    name: "Somapura Mahavihara at Paharpur",
    nameKo: "\uD30C\uD558\uB974\uD478\uB974 \uC18C\uB9C8\uD478\uB77C \uC2B9\uC6D0",
    shape: "ziggurat",
    feature: "A great Buddhist monastery surrounds a monumental central shrine decorated with terracotta plaques",
    featureKo: "\uAC70\uB300\uD55C \uBD88\uAD50 \uC2B9\uC6D0\uC774 \uD14C\uB77C\uCF54\uD0C0 \uD310\uC73C\uB85C \uC7A5\uC2DD\uD55C \uC911\uC559 \uC0AC\uC6D0\uC744 \uB458\uB7EC\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 427,
    color: "#8baba4"
  },
  {
    id: "preahvihear",
    name: "Temple of Preah Vihear",
    nameKo: "\uD504\uB808\uC544\uBE44\uD5E4\uC544\uB974 \uC0AC\uC6D0",
    shape: "clifftemple",
    feature: "A sequence of sanctuaries follows a long axis along a high plateau edge",
    featureKo: "\uAE34 \uCD95\uC744 \uB530\uB77C \uC774\uC5B4\uC9C0\uB294 \uC131\uC18C\uB4E4\uC774 \uB192\uC740 \uACE0\uC6D0 \uAC00\uC7A5\uC790\uB9AC\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 428,
    color: "#d3b17c"
  },
  {
    id: "kohker",
    name: "Koh Ker",
    nameKo: "\uCF54\uCF00\uB974",
    shape: "pyramid",
    feature: "A stepped temple pyramid rises above the remains of a former Khmer capital",
    featureKo: "\uACC4\uB2E8\uC2DD \uC0AC\uC6D0 \uD53C\uB77C\uBBF8\uB4DC\uAC00 \uD06C\uBA54\uB974\uC758 \uC61B \uC218\uB3C4 \uC720\uC801 \uC704\uB85C \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 429,
    color: "#b7a28c"
  },
  {
    id: "komodo",
    name: "Komodo National Park",
    nameKo: "\uCF54\uBAA8\uB3C4 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "island",
    feature: "Rugged islands shelter Komodo dragons beside a rich marine environment",
    featureKo: "\uD5D8\uC900\uD55C \uC12C\uB4E4\uC5D0 \uCF54\uBAA8\uB3C4\uC655\uB3C4\uB9C8\uBC40\uC774 \uC0B4\uACE0 \uC8FC\uBCC0\uC5D0\uB294 \uD48D\uBD80\uD55C \uD574\uC591 \uC0DD\uD0DC\uACC4\uAC00 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 430,
    color: "#829b8a"
  },
  {
    id: "prambanan",
    name: "Prambanan Temple Compounds",
    nameKo: "\uD504\uB78C\uBC14\uB09C \uC0AC\uC6D0\uAD70",
    shape: "templetower",
    feature: "Tall Hindu temple towers rise from a complex decorated with narrative reliefs",
    featureKo: "\uC774\uC57C\uAE30\uB97C \uB2F4\uC740 \uBD80\uC870\uB85C \uC7A5\uC2DD\uD55C \uC0AC\uC6D0 \uB2E8\uC9C0 \uC704\uB85C \uB192\uC740 \uD78C\uB450\uAD50 \uC0AC\uC6D0\uD0D1\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 431,
    color: "#bca6a0"
  },
  {
    id: "balisubak",
    name: "Bali Subak Landscape",
    nameKo: "\uBC1C\uB9AC \uC218\uBC14\uD06C \uACBD\uAD00",
    shape: "terraces",
    feature: "Water temples and terraced rice fields form a landscape managed by the subak irrigation system",
    featureKo: "\uBB3C\uC758 \uC0AC\uC6D0\uACFC \uACC4\uB2E8\uC2DD \uB17C\uC774 \uC218\uBC14\uD06C \uAD00\uAC1C \uCCB4\uACC4\uB85C \uAD00\uB9AC\uD558\uB294 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 432,
    color: "#b69772"
  },
  {
    id: "kinabalu",
    name: "Kinabalu Park",
    nameKo: "\uD0A4\uB098\uBC1C\uB8E8 \uACF5\uC6D0",
    shape: "peaks",
    feature: "A granite mountain supports vegetation ranging from tropical forest to alpine habitats",
    featureKo: "\uD654\uAC15\uC554 \uC0B0\uC5D0 \uC5F4\uB300\uB9BC\uC5D0\uC11C \uACE0\uC0B0 \uC11C\uC2DD\uC9C0\uAE4C\uC9C0 \uB2E4\uC591\uD55C \uC2DD\uC0DD\uC774 \uC790\uB78D\uB2C8\uB2E4",
    seed: 433,
    color: "#c4ac88"
  },
  {
    id: "gunungmulu",
    name: "Gunung Mulu",
    nameKo: "\uAD6C\uB219\uBB3C\uB8E8",
    shape: "cave",
    feature: "Limestone pinnacles and immense caves form a spectacular tropical karst landscape",
    featureKo: "\uC11D\uD68C\uC554 \uCCA8\uBD09\uACFC \uAC70\uB300\uD55C \uB3D9\uAD74\uB4E4\uC774 \uC5F4\uB300 \uCE74\uB974\uC2A4\uD2B8 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 434,
    color: "#aeb9a0"
  },
  {
    id: "puertoprincesa",
    name: "Puerto-Princesa Subterranean River",
    nameKo: "\uD478\uC5D0\uB974\uD1A0\uD504\uB9B0\uC138\uC0AC \uC9C0\uD558\uAC15",
    shape: "cave",
    feature: "A subterranean river flows through limestone caves before reaching the sea",
    featureKo: "\uC9C0\uD558\uAC15\uC774 \uC11D\uD68C\uC554 \uB3D9\uAD74\uC744 \uC9C0\uB098 \uBC14\uB2E4\uB85C \uD758\uB7EC\uAC11\uB2C8\uB2E4",
    seed: 435,
    color: "#bc8b70"
  },
  {
    id: "tubbataha",
    name: "Tubbataha Reefs",
    nameKo: "\uD22C\uBC14\uD0C0\uD558 \uC0B0\uD638\uCD08",
    shape: "reef",
    feature: "Remote coral atolls support rich reef communities and breeding seabirds",
    featureKo: "\uC678\uB534 \uC0B0\uD638 \uD658\uCD08\uC5D0 \uD48D\uBD80\uD55C \uC0B0\uD638\uCD08 \uC0DD\uD0DC\uACC4\uC640 \uBC88\uC2DD\uD558\uB294 \uBC14\uB2F7\uC0C8\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 436,
    color: "#8baba4"
  },
  {
    id: "cordilleraterraces",
    name: "Philippine Cordilleras Rice Terraces",
    nameKo: "\uD544\uB9AC\uD540 \uCF54\uB974\uB514\uC608\uB77C \uACC4\uB2E8\uC2DD \uB17C",
    shape: "terraces",
    feature: "Steep mountain slopes are shaped into irrigated rice terraces maintained by local communities",
    featureKo: "\uC9C0\uC5ED \uACF5\uB3D9\uCCB4\uAC00 \uAC00\uAFB8\uB294 \uAD00\uAC1C \uACC4\uB2E8\uC2DD \uB17C\uC774 \uAC00\uD30C\uB978 \uC0B0\uBE44\uD0C8\uC744 \uB530\uB77C \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 437,
    color: "#d3b17c"
  },
  {
    id: "hue",
    name: "Hu\xE9 Monuments",
    nameKo: "\uD6C4\uC5D0 \uC720\uC801",
    shape: "palace",
    feature: "Palaces, temples and fortified enclosures preserve the ceremonial heart of Vietnam's former capital",
    featureKo: "\uAD81\uC804\uACFC \uC0AC\uC6D0, \uC131\uACFD \uAD6C\uC5ED\uC774 \uBCA0\uD2B8\uB0A8 \uC61B \uC218\uB3C4\uC758 \uC758\uB840 \uC911\uC2EC\uC9C0\uB97C \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 438,
    color: "#b7a28c"
  },
  {
    id: "hoian",
    name: "Hoi An",
    nameKo: "\uD638\uC774\uC548",
    shape: "town",
    feature: "Timber buildings and narrow streets preserve a Southeast Asian trading port",
    featureKo: "\uBAA9\uC870 \uAC74\uBB3C\uACFC \uC881\uC740 \uAC70\uB9AC\uB4E4\uC774 \uB3D9\uB0A8\uC544\uC2DC\uC544 \uAD50\uC5ED\uD56D\uC758 \uC61B \uBAA8\uC2B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 439,
    color: "#829b8a"
  },
  {
    id: "trangan",
    name: "Trang An",
    nameKo: "\uC9F1\uC548",
    shape: "pillars",
    feature: "Limestone towers rise above waterways, caves and archaeological sites",
    featureKo: "\uBB3C\uAE38\uACFC \uB3D9\uAD74, \uACE0\uACE0 \uC720\uC801 \uC704\uB85C \uC11D\uD68C\uC554 \uBD09\uC6B0\uB9AC\uB4E4\uC774 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 440,
    color: "#bca6a0"
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura",
    nameKo: "\uC544\uB204\uB77C\uB2E4\uD478\uB77C",
    shape: "stupa",
    feature: "Large stupas and monastic ruins preserve a sacred city centred on a revered Bodhi tree",
    featureKo: "\uC874\uACBD\uBC1B\uB294 \uBCF4\uB9AC\uC218\uB97C \uC911\uC2EC\uC73C\uB85C \uD55C \uC131\uC2A4\uB7EC\uC6B4 \uB3C4\uC2DC\uC5D0 \uD070 \uBD88\uD0D1\uACFC \uC218\uB3C4\uC6D0 \uC720\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 441,
    color: "#b69772"
  },
  {
    id: "galle",
    name: "Galle Fort",
    nameKo: "\uAC08\uB808 \uC694\uC0C8",
    shape: "fortress",
    feature: "Fortified streets and buildings combine European planning with South Asian traditions",
    featureKo: "\uC131\uBCBD \uC548\uC758 \uAC70\uB9AC\uC640 \uAC74\uBB3C\uC5D0 \uC720\uB7FD\uC2DD \uACC4\uD68D\uACFC \uB0A8\uC544\uC2DC\uC544 \uC804\uD1B5\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 442,
    color: "#c4ac88"
  },
  {
    id: "dambulla",
    name: "Dambulla Cave Temple",
    nameKo: "\uB2F4\uBD88\uB77C \uC11D\uAD74\uC0AC\uC6D0",
    shape: "rocktemple",
    feature: "Cave sanctuaries preserve Buddhist statues and extensive painted surfaces",
    featureKo: "\uC11D\uAD74 \uC131\uC18C\uB4E4\uC5D0 \uBD88\uC0C1\uACFC \uB113\uC740 \uBA74\uC744 \uB36E\uC740 \uBD88\uAD50 \uADF8\uB9BC\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 443,
    color: "#aeb9a0"
  },
  {
    id: "gyeongju",
    name: "Gyeongju Historic Areas",
    nameKo: "\uACBD\uC8FC \uC5ED\uC0AC\uC720\uC801\uC9C0\uAD6C",
    shape: "tomb",
    feature: "Royal tombs, temple remains and palace sites preserve the former Silla capital",
    featureKo: "\uC655\uB989\uACFC \uC0AC\uCC30 \uD130, \uAD81\uAD90 \uC720\uC801\uC774 \uC2E0\uB77C \uC61B \uC218\uB3C4\uC758 \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 444,
    color: "#bc8b70"
  },
  {
    id: "hahoeyangdong",
    name: "Hahoe and Yangdong Villages",
    nameKo: "\uD558\uD68C\uC640 \uC591\uB3D9\uB9C8\uC744",
    shape: "thatched",
    feature: "Traditional clan villages preserve tiled and thatched houses within wooded river landscapes",
    featureKo: "\uC232\uACFC \uAC15\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uB3D9\uC871\uB9C8\uC744\uC5D0 \uAE30\uC640\uC9D1\uACFC \uCD08\uAC00\uC9D1\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 445,
    color: "#8baba4"
  },
  {
    id: "namhansanseong",
    name: "Namhansanseong",
    nameKo: "\uB0A8\uD55C\uC0B0\uC131",
    shape: "fortress",
    feature: "Mountain walls and gates surround a refuge capital developed for the Joseon dynasty",
    featureKo: "\uC0B0\uC744 \uB530\uB77C \uB450\uB978 \uC131\uBCBD\uACFC \uC131\uBB38\uC774 \uC870\uC120\uC758 \uBE44\uC0C1 \uC218\uB3C4\uB97C \uAC10\uC2F8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 446,
    color: "#d3b17c"
  },
  {
    id: "seowon",
    name: "Seowon Academies",
    nameKo: "\uD55C\uAD6D\uC758 \uC11C\uC6D0",
    shape: "hall",
    feature: "Neo-Confucian academies place study halls and shrines within carefully chosen natural settings",
    featureKo: "\uC790\uC5F0 \uC18D\uC5D0 \uC790\uB9AC \uC7A1\uC740 \uC131\uB9AC\uD559 \uAD50\uC721\uAE30\uAD00\uC5D0 \uAC15\uD559\uB2F9\uACFC \uC0AC\uB2F9\uC774 \uBC30\uCE58\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 447,
    color: "#b7a28c"
  },
  {
    id: "qinmausoleum",
    name: "First Qin Emperor's Mausoleum",
    nameKo: "\uC9C4\uC2DC\uD669\uB989",
    shape: "stelae",
    feature: "An imperial burial complex includes a vast terracotta army arranged in underground pits",
    featureKo: "\uD669\uC81C\uC758 \uBB18\uC5ED \uC548 \uC9C0\uD558 \uAC31\uC5D0 \uAC70\uB300\uD55C \uBCD1\uB9C8\uC6A9 \uAD70\uB300\uAC00 \uC904\uC9C0\uC5B4 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 448,
    color: "#829b8a"
  },
  {
    id: "pingyao",
    name: "Ancient Ping Yao",
    nameKo: "\uD551\uC57C\uC624 \uACE0\uC131",
    shape: "fortress",
    feature: "A walled Chinese city preserves traditional houses and historic commercial buildings",
    featureKo: "\uC131\uBCBD\uC73C\uB85C \uB458\uB7EC\uC2FC \uC911\uAD6D \uB3C4\uC2DC\uC5D0 \uC804\uD1B5 \uC8FC\uD0DD\uACFC \uC61B \uC0C1\uC5C5 \uAC74\uBB3C\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 449,
    color: "#bca6a0"
  },
  {
    id: "yungang",
    name: "Yungang Grottoes",
    nameKo: "\uC708\uAC15 \uC11D\uAD74",
    shape: "cliffbuddha",
    feature: "Buddhist cave temples contain monumental statues carved into sandstone cliffs",
    featureKo: "\uC0AC\uC554 \uC808\uBCBD\uC5D0 \uC0C8\uAE34 \uBD88\uAD50 \uC11D\uAD74\uC0AC\uC6D0 \uC548\uC5D0 \uAC70\uB300\uD55C \uBD88\uC0C1\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 450,
    color: "#b69772"
  },
  {
    id: "westlake",
    name: "West Lake of Hangzhou",
    nameKo: "\uD56D\uC800\uC6B0 \uC11C\uD638",
    shape: "lakes",
    feature: "Causeways, gardens and temples shape a lake landscape celebrated in Chinese art",
    featureKo: "\uBC29\uC8FD\uACFC \uC815\uC6D0, \uC0AC\uC6D0\uB4E4\uC774 \uC911\uAD6D \uC608\uC220\uC5D0\uC11C \uC0AC\uB791\uBC1B\uC544 \uC628 \uD638\uC218 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 451,
    color: "#c4ac88"
  },
  {
    id: "haniterraces",
    name: "Honghe Hani Rice Terraces",
    nameKo: "\uD6D9\uD5C8 \uD558\uB2C8 \uACC4\uB2E8\uC2DD \uB17C",
    shape: "terraces",
    feature: "Irrigated terraces descend from forested mountains past Hani villages",
    featureKo: "\uC232\uC73C\uB85C \uB36E\uC778 \uC0B0\uC5D0\uC11C \uD558\uB2C8\uC871 \uB9C8\uC744\uC744 \uC9C0\uB098 \uAD00\uAC1C \uACC4\uB2E8\uC2DD \uB17C\uC774 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 452,
    color: "#aeb9a0"
  },
  {
    id: "pattadakal",
    name: "Pattadakal",
    nameKo: "\uD30C\uD0C0\uB2E4\uCE7C",
    shape: "templetower",
    feature: "Chalukya-period temples bring together northern and southern Indian architectural forms",
    featureKo: "\uCC30\uB8E8\uD0A4\uC544 \uC2DC\uB300 \uC0AC\uC6D0\uB4E4\uC774 \uC778\uB3C4 \uBD81\uBD80\uC640 \uB0A8\uBD80\uC758 \uAC74\uCD95 \uD615\uC2DD\uC744 \uD568\uAED8 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 453,
    color: "#bc8b70"
  },
  {
    id: "shivajiterminus",
    name: "Chhatrapati Shivaji Terminus",
    nameKo: "\uCC28\uD2B8\uB77C\uD30C\uD2F0 \uC2DC\uBC14\uC9C0 \uD130\uBBF8\uB108\uC2A4",
    shape: "hall",
    feature: "A monumental railway station combines Victorian Gothic Revival and Indian architectural traditions",
    featureKo: "\uAC70\uB300\uD55C \uCCA0\uB3C4\uC5ED\uC5D0 \uBE45\uD1A0\uB9AC\uC544 \uACE0\uB515 \uBD80\uD765 \uC591\uC2DD\uACFC \uC778\uB3C4 \uAC74\uCD95 \uC804\uD1B5\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 454,
    color: "#8baba4"
  },
  {
    id: "nalanda",
    name: "Nalanda Mahavihara",
    nameKo: "\uB0A0\uB780\uB2E4 \uB9C8\uD558\uBE44\uD558\uB77C",
    shape: "ruins",
    feature: "Monasteries, shrines and educational remains record a long-lived Buddhist learning centre",
    featureKo: "\uC218\uB3C4\uC6D0\uACFC \uC131\uC18C, \uAD50\uC721\uC2DC\uC124 \uC720\uC801\uC774 \uC624\uB798 \uC774\uC5B4\uC9C4 \uBD88\uAD50 \uD559\uBB38\uC758 \uC911\uC2EC\uC9C0\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 455,
    color: "#d3b17c"
  },
  {
    id: "bam",
    name: "Bam and its Cultural Landscape",
    nameKo: "\uBC24 \uBB38\uD654\uACBD\uAD00",
    shape: "adobe",
    feature: "An earthen citadel and oasis landscape record the history of a desert trading city",
    featureKo: "\uD759\uC73C\uB85C \uC9C0\uC740 \uC131\uCC44\uC640 \uC624\uC544\uC2DC\uC2A4 \uACBD\uAD00\uC774 \uC0AC\uB9C9 \uAD50\uC5ED\uB3C4\uC2DC\uC758 \uC5ED\uC0AC\uB97C \uC804\uD569\uB2C8\uB2E4",
    seed: 456,
    color: "#b7a28c"
  },
  {
    id: "shushtar",
    name: "Shushtar Hydraulic System",
    nameKo: "\uC288\uC288\uD0C0\uB974 \uC218\uB9AC\uC2DC\uC124",
    shape: "waterworks",
    feature: "Dams, tunnels and canals distribute water through a historic system of mills and irrigation",
    featureKo: "\uB310\uACFC \uD130\uB110, \uC6B4\uD558\uAC00 \uC61B \uBB3C\uB808\uBC29\uC544\uC640 \uAD00\uAC1C\uC2DC\uC124\uC5D0 \uBB3C\uC744 \uB098\uB204\uC5B4 \uBCF4\uB0C5\uB2C8\uB2E4",
    seed: 457,
    color: "#829b8a"
  },
  {
    id: "gonbadeqabus",
    name: "Gonbad-e Q\u0101bus",
    nameKo: "\uACE4\uBC14\uB370\uCE74\uBD80\uC2A4",
    shape: "minaret",
    feature: "A tall brick funerary tower rises above a star-shaped plan beneath a conical roof",
    featureKo: "\uBCC4 \uBAA8\uC591 \uD3C9\uBA74 \uC704\uB85C \uB192\uC740 \uBCBD\uB3CC \uC7A5\uB840\uD0D1\uC774 \uC19F\uACE0 \uC6D0\uBFD4 \uC9C0\uBD95\uC774 \uC5B9\uD600 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 458,
    color: "#bca6a0"
  },
  {
    id: "cappadocia",
    name: "G\xF6reme and Cappadocia",
    nameKo: "\uAD34\uB808\uBA54\uC640 \uCE74\uD30C\uB3C4\uD0A4\uC544",
    shape: "pillars",
    feature: "Eroded volcanic rock formations contain rock-cut churches and dwellings",
    featureKo: "\uCE68\uC2DD\uB41C \uD654\uC0B0\uC554 \uC9C0\uD615 \uC548\uC5D0 \uBC14\uC704\uB97C \uD30C \uB9CC\uB4E0 \uAD50\uD68C\uC640 \uC8FC\uAC70\uC9C0\uAC00 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 459,
    color: "#b69772"
  },
  {
    id: "nemrut",
    name: "Nemrut Da\u011F",
    nameKo: "\uB134\uB8E8\uD2B8\uC0B0",
    shape: "stelae",
    feature: "Colossal stone statues flank a royal funerary mound high in the mountains",
    featureKo: "\uB192\uC740 \uC0B0\uC758 \uC655\uC2E4 \uBB34\uB364 \uC5B8\uB355 \uC591\uC606\uC5D0 \uAC70\uB300\uD55C \uC11D\uC0C1\uB4E4\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 460,
    color: "#c4ac88"
  },
  {
    id: "pamukkale",
    name: "Hierapolis-Pamukkale",
    nameKo: "\uD788\uC5D0\uB77C\uD3F4\uB9AC\uC2A4\uD30C\uBB35\uCE7C\uB808",
    shape: "terraces",
    feature: "White travertine terraces formed by thermal waters lie below the remains of an ancient city",
    featureKo: "\uC628\uCC9C\uC218\uAC00 \uBE5A\uC740 \uD770 \uC11D\uD68C\uBD95\uC774 \uACE0\uB300 \uB3C4\uC2DC \uC720\uC801 \uC544\uB798\uB85C \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 461,
    color: "#aeb9a0"
  },
  {
    id: "troy",
    name: "Troy",
    nameKo: "\uD2B8\uB85C\uC774",
    shape: "ruins",
    feature: "Successive settlement layers preserve a city associated with ancient Mediterranean history and epic poetry",
    featureKo: "\uC5EC\uB7EC \uC2DC\uB300\uC758 \uC815\uCC29\uCE35\uC774 \uACE0\uB300 \uC9C0\uC911\uD574 \uC5ED\uC0AC\uC640 \uC11C\uC0AC\uC2DC\uB85C \uC54C\uB824\uC9C4 \uB3C4\uC2DC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 462,
    color: "#bc8b70"
  },
  {
    id: "baalbek",
    name: "Baalbek",
    nameKo: "\uBC14\uC54C\uBCA0\uD06C",
    shape: "columns",
    feature: "Monumental Roman temples preserve towering columns and richly carved stonework",
    featureKo: "\uAC70\uB300\uD55C \uB85C\uB9C8 \uC2E0\uC804\uC5D0 \uB192\uC740 \uAE30\uB465\uACFC \uC815\uAD50\uD55C \uC11D\uC870 \uC7A5\uC2DD\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 463,
    color: "#8baba4"
  },
  {
    id: "byblos",
    name: "Byblos",
    nameKo: "\uBE44\uBE14\uB85C\uC2A4",
    shape: "ruins",
    feature: "A long-inhabited coastal city preserves traces of successive Mediterranean civilizations",
    featureKo: "\uC624\uB7AB\uB3D9\uC548 \uC0AC\uB78C\uC774 \uC0B4\uC544\uC628 \uD574\uC548 \uB3C4\uC2DC\uC5D0 \uC5EC\uB7EC \uC9C0\uC911\uD574 \uBB38\uBA85\uC758 \uD754\uC801\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 464,
    color: "#d3b17c"
  },
  {
    id: "quseiramra",
    name: "Quseir Amra",
    nameKo: "\uCFE0\uC138\uC774\uB974\uC554\uB77C",
    shape: "dome",
    feature: "An early Islamic desert residence preserves remarkable wall paintings inside its bath complex",
    featureKo: "\uCD08\uAE30 \uC774\uC2AC\uB78C \uC0AC\uB9C9 \uAC70\uCC98\uC758 \uBAA9\uC695\uC2DC\uC124 \uC548\uC5D0 \uB6F0\uC5B4\uB09C \uBCBD\uD654\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 465,
    color: "#b7a28c"
  },
  {
    id: "wadirum",
    name: "Wadi Rum",
    nameKo: "\uC640\uB514\uB7FC",
    shape: "redrocks",
    feature: "Sandstone cliffs, narrow gorges and natural arches form a desert landscape rich in rock art",
    featureKo: "\uC0AC\uC554 \uC808\uBCBD\uACFC \uC881\uC740 \uD611\uACE1, \uC790\uC5F0 \uC544\uCE58\uAC00 \uC554\uAC01\uD654\uAC00 \uD48D\uBD80\uD55C \uC0AC\uB9C9 \uACBD\uAD00\uC744 \uC774\uB8F9\uB2C8\uB2E4",
    seed: 466,
    color: "#829b8a"
  },
  {
    id: "atturaif",
    name: "At-Turaif",
    nameKo: "\uC557\uD22C\uB77C\uC774\uD504",
    shape: "adobe",
    feature: "Mud-brick palaces and urban remains preserve the early Saudi capital at ad-Dir'iyah",
    featureKo: "\uD759\uBCBD\uB3CC \uAD81\uC804\uACFC \uB3C4\uC2DC \uC720\uC801\uC774 \uB514\uB9AC\uC57C\uC5D0 \uC788\uB358 \uCD08\uAE30 \uC0AC\uC6B0\uB514 \uC218\uB3C4\uC758 \uBAA8\uC2B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 467,
    color: "#bca6a0"
  },
  {
    id: "alahsa",
    name: "Al-Ahsa Oasis",
    nameKo: "\uC54C\uC544\uD750\uC0AC \uC624\uC544\uC2DC\uC2A4",
    shape: "garden",
    feature: "Palm groves, springs and canals form an extensive oasis shaped by long settlement",
    featureKo: "\uC57C\uC790 \uC232\uACFC \uC0D8, \uC218\uB85C\uAC00 \uC624\uB79C \uC815\uCC29\uC73C\uB85C \uBE5A\uC5B4\uC9C4 \uB113\uC740 \uC624\uC544\uC2DC\uC2A4\uB97C \uC774\uB8F9\uB2C8\uB2E4",
    seed: 468,
    color: "#b69772"
  },
  {
    id: "alzubarah",
    name: "Al Zubarah",
    nameKo: "\uC54C\uC8FC\uBC14\uB77C",
    shape: "fortress",
    feature: "The remains of a walled Gulf town record pearling and maritime trade",
    featureKo: "\uAC78\uD504 \uC9C0\uC5ED \uC131\uACFD\uB3C4\uC2DC\uC758 \uC720\uC801\uC774 \uC9C4\uC8FC \uCC44\uCDE8\uC640 \uD574\uC0C1 \uAD50\uC5ED\uC758 \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 469,
    color: "#c4ac88"
  },
  {
    id: "alain",
    name: "Al Ain Cultural Sites",
    nameKo: "\uC54C\uC544\uC778 \uBB38\uD654\uC720\uC801",
    shape: "garden",
    feature: "Oases, tombs and ancient settlements record life in the Arabian desert over millennia",
    featureKo: "\uC624\uC544\uC2DC\uC2A4\uC640 \uBB34\uB364, \uC61B \uC815\uCC29\uC9C0\uAC00 \uC218\uCC9C \uB144\uAC04 \uC774\uC5B4\uC9C4 \uC544\uB77C\uBE44\uC544 \uC0AC\uB9C9\uC758 \uC0B6\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 470,
    color: "#aeb9a0"
  },
  {
    id: "shirakami",
    name: "Shirakami-Sanchi",
    nameKo: "\uC2DC\uB77C\uCE74\uBBF8\uC0B0\uC9C0",
    shape: "forest",
    feature: "An extensive cool-temperate beech forest survives across a rugged mountain landscape",
    featureKo: "\uD5D8\uC900\uD55C \uC0B0\uC545 \uACBD\uAD00\uC5D0 \uB113\uC740 \uB0C9\uC628\uB300 \uB108\uB3C4\uBC24\uB098\uBB34 \uC232\uC774 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 471,
    color: "#bc8b70"
  },
  {
    id: "ogasawara",
    name: "Ogasawara Islands",
    nameKo: "\uC624\uAC00\uC0AC\uC640\uB77C\uC81C\uB3C4",
    shape: "island",
    feature: "Oceanic islands harbour many endemic species shaped by isolated evolution",
    featureKo: "\uB300\uC591\uC12C\uB4E4\uC5D0 \uACE0\uB9BD\uB41C \uC9C4\uD654\uAC00 \uBE5A\uC740 \uB9CE\uC740 \uACE0\uC720\uC885\uC774 \uC0B4\uC544\uAC11\uB2C8\uB2E4",
    seed: 472,
    color: "#8baba4"
  },
  {
    id: "tomioka",
    name: "Tomioka Silk Mill",
    nameKo: "\uB3C4\uBBF8\uC624\uCE74 \uC81C\uC0AC\uC7A5",
    shape: "industrial",
    feature: "A historic silk mill and related sites record Japan's transition to industrial silk production",
    featureKo: "\uC61B \uC81C\uC0AC\uC7A5\uACFC \uAD00\uB828 \uC720\uC801\uC774 \uC77C\uBCF8\uC758 \uC0B0\uC5C5\uC801 \uBE44\uB2E8 \uC0DD\uC0B0 \uC804\uD658\uC744 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 473,
    color: "#d3b17c"
  },
  {
    id: "salzburg",
    name: "Historic Salzburg",
    nameKo: "\uC798\uCE20\uBD80\uB974\uD06C \uC5ED\uC0AC\uB3C4\uC2DC",
    shape: "town",
    feature: "Ecclesiastical and civic buildings preserve a Baroque city between the river and surrounding hills",
    featureKo: "\uAC15\uACFC \uC8FC\uBCC0 \uC5B8\uB355 \uC0AC\uC774\uC5D0 \uC885\uAD50\xB7\uACF5\uACF5\uAC74\uBB3C\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uBC14\uB85C\uD06C \uB3C4\uC2DC\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 474,
    color: "#b7a28c"
  },
  {
    id: "hallstatt",
    name: "Hallstatt-Dachstein",
    nameKo: "\uD560\uC288\uD0C0\uD2B8\uB2E4\uD750\uC288\uD0C0\uC778",
    shape: "coast",
    feature: "Alpine settlement and mountain scenery reflect a long history of salt mining",
    featureKo: "\uC54C\uD504\uC2A4\uC758 \uC815\uCC29\uC9C0\uC640 \uC0B0\uC545 \uACBD\uAD00\uC774 \uC624\uB79C \uC18C\uAE08 \uCC44\uAD74\uC758 \uC5ED\uC0AC\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 475,
    color: "#829b8a"
  },
  {
    id: "berne",
    name: "Old City of Berne",
    nameKo: "\uBCA0\uB978 \uAD6C\uC2DC\uAC00\uC9C0",
    shape: "town",
    feature: "Arcaded streets and historic fountains preserve a planned medieval city beside the Aare River",
    featureKo: "\uC544\uB808\uAC15 \uC606\uC5D0 \uC544\uCF00\uC774\uB4DC \uAC70\uB9AC\uC640 \uC61B \uBD84\uC218\uB4E4\uC774 \uC911\uC138 \uACC4\uD68D\uB3C4\uC2DC\uC758 \uBAA8\uC2B5\uC744 \uAC04\uC9C1\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 476,
    color: "#bca6a0"
  },
  {
    id: "stgall",
    name: "Abbey of St Gall",
    nameKo: "\uC7A5\uD06C\uD2B8\uAC08\uB80C \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A monastic complex and its library preserve an important centre of European learning",
    featureKo: "\uC218\uB3C4\uC6D0 \uB2E8\uC9C0\uC640 \uB3C4\uC11C\uAD00\uC774 \uC720\uB7FD \uD559\uBB38\uC758 \uC911\uC694\uD55C \uC911\uC2EC\uC9C0\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 477,
    color: "#b69772"
  },
  {
    id: "wurzburg",
    name: "W\xFCrzburg Residence",
    nameKo: "\uBDD4\uB974\uCE20\uBD80\uB974\uD06C \uC8FC\uAD50\uAD81",
    shape: "palace",
    feature: "A richly decorated Baroque residence combines a grand staircase with formal court gardens",
    featureKo: "\uC815\uAD50\uD558\uAC8C \uC7A5\uC2DD\uD55C \uBC14\uB85C\uD06C \uAD81\uC804\uC5D0 \uC6C5\uC7A5\uD55C \uACC4\uB2E8\uACFC \uC815\uD615\uC2DD \uAD81\uC815 \uC815\uC6D0\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 478,
    color: "#c4ac88"
  },
  {
    id: "trier",
    name: "Roman Monuments of Trier",
    nameKo: "\uD2B8\uB9AC\uC5B4 \uB85C\uB9C8\uC720\uC801",
    shape: "gate",
    feature: "Roman gates, baths and later churches preserve layers of a city on the Moselle",
    featureKo: "\uB85C\uB9C8 \uC2DC\uB300 \uC131\uBB38\uACFC \uBAA9\uC695\uC7A5, \uD6C4\uB300 \uAD50\uD68C\uB4E4\uC774 \uBAA8\uC824\uAC15 \uB3C4\uC2DC\uC758 \uC5ED\uC0AC\uB97C \uCE35\uCE35\uC774 \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 479,
    color: "#aeb9a0"
  },
  {
    id: "speicherstadt",
    name: "Speicherstadt and Kontorhaus",
    nameKo: "\uC288\uD30C\uC774\uD5C8\uC288\uD0C0\uD2B8\uC640 \uCF58\uD1A0\uC5B4\uD558\uC6B0\uC2A4",
    shape: "canal",
    feature: "Brick warehouses line canals beside a district of early modern office buildings",
    featureKo: "\uC6B4\uD558\uB97C \uB530\uB77C \uBCBD\uB3CC \uCC3D\uACE0\uB4E4\uC774 \uB298\uC5B4\uC11C\uACE0 \uADFC\uB300 \uCD08\uAE30 \uC0AC\uBB34\uAC74\uBB3C \uAD6C\uC5ED\uC774 \uC774\uC6C3\uD574 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 480,
    color: "#bc8b70"
  },
  {
    id: "kronborg",
    name: "Kronborg Castle",
    nameKo: "\uD06C\uB860\uBCF4\uB974\uC131",
    shape: "castle",
    feature: "A Renaissance castle guards the narrow sound between Denmark and Sweden",
    featureKo: "\uB974\uB124\uC0C1\uC2A4 \uC131\uC774 \uB374\uB9C8\uD06C\uC640 \uC2A4\uC6E8\uB374 \uC0AC\uC774\uC758 \uC881\uC740 \uD574\uD611\uC744 \uC9C0\uD0A4\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 481,
    color: "#8baba4"
  },
  {
    id: "ilulissat",
    name: "Ilulissat Icefjord",
    nameKo: "\uC77C\uB8E8\uB9AC\uC0AC\uD2B8 \uC544\uC774\uC2A4\uD53C\uC624\uB974",
    shape: "glacier",
    feature: "A fast-moving glacier releases immense icebergs into a Greenland fjord",
    featureKo: "\uBE60\uB974\uAC8C \uC6C0\uC9C1\uC774\uB294 \uBE59\uD558\uAC00 \uADF8\uB9B0\uB780\uB4DC\uC758 \uD53C\uC624\uB974\uB85C \uAC70\uB300\uD55C \uBE59\uC0B0\uC744 \uB0B4\uBCF4\uB0C5\uB2C8\uB2E4",
    seed: 482,
    color: "#d3b17c"
  },
  {
    id: "suomenlinna",
    name: "Suomenlinna Fortress",
    nameKo: "\uC218\uC624\uBA58\uB9B0\uB098 \uC694\uC0C8",
    shape: "fortress",
    feature: "Bastions and military buildings spread across islands at the entrance to Helsinki's harbour",
    featureKo: "\uD5EC\uC2F1\uD0A4 \uD56D\uAD6C \uC785\uAD6C\uC758 \uC12C\uB4E4\uC744 \uB530\uB77C \uBCF4\uB8E8\uC640 \uAD70\uC0AC \uAC74\uBB3C\uB4E4\uC774 \uD3BC\uCCD0\uC9D1\uB2C8\uB2E4",
    seed: 483,
    color: "#b7a28c"
  },
  {
    id: "rauma",
    name: "Old Rauma",
    nameKo: "\uB77C\uC6B0\uB9C8 \uAD6C\uC2DC\uAC00\uC9C0",
    shape: "town",
    feature: "Colourful timber houses preserve a traditional Nordic town around its medieval core",
    featureKo: "\uB2E4\uCC44\uB85C\uC6B4 \uBAA9\uC870 \uC8FC\uD0DD\uB4E4\uC774 \uC911\uC138 \uC911\uC2EC\uBD80 \uC8FC\uBCC0\uC5D0 \uBD81\uC720\uB7FD \uC804\uD1B5\uB3C4\uC2DC\uC758 \uBAA8\uC2B5\uC744 \uB0A8\uAE30\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 484,
    color: "#829b8a"
  },
  {
    id: "orangetheatre",
    name: "Roman Theatre of Orange",
    nameKo: "\uC624\uB791\uC8FC \uB85C\uB9C8\uADF9\uC7A5",
    shape: "theatre",
    feature: "A Roman theatre retains its monumental stage wall beside other ancient urban remains",
    featureKo: "\uB85C\uB9C8\uADF9\uC7A5\uC5D0 \uAC70\uB300\uD55C \uBB34\uB300\uBCBD\uC774 \uB0A8\uC544 \uC788\uACE0 \uC8FC\uBCC0\uC5D0 \uACE0\uB300 \uB3C4\uC2DC \uC720\uC801\uC774 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 485,
    color: "#bca6a0"
  },
  {
    id: "cordouan",
    name: "Cordouan Lighthouse",
    nameKo: "\uCF54\uB974\uB450\uC559 \uB4F1\uB300",
    shape: "towers",
    feature: "A monumental stone lighthouse stands on a rocky platform at the Gironde estuary",
    featureKo: "\uC9C0\uB871\uB4DC\uAC15 \uD558\uAD6C\uC758 \uBC14\uC704 \uC9C0\uBC18 \uC704\uC5D0 \uAC70\uB300\uD55C \uC11D\uC870 \uB4F1\uB300\uAC00 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 486,
    color: "#b69772"
  },
  {
    id: "maisoncarree",
    name: "Maison Carr\xE9e of N\xEEmes",
    nameKo: "\uB2D8 \uBA54\uC885\uCE74\uB808",
    shape: "columns",
    feature: "A well-preserved Roman temple stands on a high podium behind a columned portico",
    featureKo: "\uC798 \uBCF4\uC874\uB41C \uB85C\uB9C8 \uC2E0\uC804\uC774 \uAE30\uB465 \uD604\uAD00 \uB4A4\uC758 \uB192\uC740 \uAE30\uB2E8 \uC704\uC5D0 \uC11C \uC788\uC2B5\uB2C8\uB2E4",
    seed: 487,
    color: "#c4ac88"
  },
  {
    id: "edinburgh",
    name: "Old and New Edinburgh",
    nameKo: "\uC5D0\uB4E0\uBC84\uB7EC \uAD6C\xB7\uC2E0\uC2DC\uAC00\uC9C0",
    shape: "town",
    feature: "A medieval old town contrasts with a carefully planned neoclassical new town",
    featureKo: "\uC911\uC138 \uAD6C\uC2DC\uAC00\uC9C0\uC640 \uACC4\uD68D\uC801\uC73C\uB85C \uC870\uC131\uD55C \uC2E0\uACE0\uC804\uC8FC\uC758 \uC2E0\uC2DC\uAC00\uC9C0\uAC00 \uB098\uB780\uD788 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 488,
    color: "#aeb9a0"
  },
  {
    id: "pontcysyllte",
    name: "Pontcysyllte Aqueduct",
    nameKo: "\uD3F0\uD2B8\uCE58\uC2E4\uD14C \uC218\uB85C\uAD50",
    shape: "aqueduct",
    feature: "A cast-iron water trough carries a navigable canal high above the River Dee",
    featureKo: "\uC8FC\uCCA0 \uC218\uB85C\uAC00 \uB514\uAC15 \uB192\uC740 \uACF3\uC5D0\uC11C \uBC30\uAC00 \uB2E4\uB2C8\uB294 \uC6B4\uD558\uB97C \uB5A0\uBC1B\uCE69\uB2C8\uB2E4",
    seed: 489,
    color: "#bc8b70"
  },
  {
    id: "kew",
    name: "Royal Botanic Gardens Kew",
    nameKo: "\uD050 \uC655\uB9BD\uC2DD\uBB3C\uC6D0",
    shape: "garden",
    feature: "Historic glasshouses and designed landscapes preserve a major centre of botanical study",
    featureKo: "\uC61B \uC720\uB9AC\uC628\uC2E4\uACFC \uC870\uACBD \uACBD\uAD00\uC774 \uC2DD\uBB3C \uC5F0\uAD6C\uC758 \uC8FC\uC694 \uC911\uC2EC\uC9C0\uB97C \uC774\uB8E8\uACE0 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 490,
    color: "#8baba4"
  },
  {
    id: "delphi",
    name: "Delphi",
    nameKo: "\uB378\uD3EC\uC774",
    shape: "columns",
    feature: "The sanctuary of Apollo occupies terraces on the slopes of Mount Parnassus",
    featureKo: "\uC544\uD3F4\uB860 \uC131\uC5ED\uC774 \uD30C\uB974\uB098\uC18C\uC2A4\uC0B0 \uBE44\uD0C8\uC758 \uACC4\uB2E8\uC2DD \uD130\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 491,
    color: "#d3b17c"
  },
  {
    id: "epidaurus",
    name: "Sanctuary of Asklepios at Epidaurus",
    nameKo: "\uC5D0\uD53C\uB2E4\uC6B0\uB85C\uC2A4 \uC544\uC2A4\uD074\uB808\uD53C\uC624\uC2A4 \uC131\uC5ED",
    shape: "theatre",
    feature: "A theatre and religious buildings preserve an ancient sanctuary associated with healing",
    featureKo: "\uADF9\uC7A5\uACFC \uC885\uAD50 \uAC74\uBB3C\uB4E4\uC774 \uCE58\uC720\uC640 \uAD00\uB828\uB41C \uACE0\uB300 \uC131\uC5ED\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 492,
    color: "#b7a28c"
  },
  {
    id: "mycenae",
    name: "Mycenae and Tiryns",
    nameKo: "\uBBF8\uCF00\uB124\uC640 \uD2F0\uB9B0\uC2A4",
    shape: "gate",
    feature: "Massive stone fortifications preserve centres of the Mycenaean civilization",
    featureKo: "\uAC70\uB300\uD55C \uC11D\uC870 \uBC29\uC5B4\uC2DC\uC124\uC774 \uBBF8\uCF00\uB124 \uBB38\uBA85\uC758 \uC911\uC2EC\uC9C0\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 493,
    color: "#829b8a"
  },
  {
    id: "brunaboinne",
    name: "Br\xFA na B\xF3inne",
    nameKo: "\uBE0C\uB8E8\uB098\uBCF4\uB108",
    shape: "tomb",
    feature: "Large prehistoric passage tombs occupy a river landscape decorated with megalithic art",
    featureKo: "\uAC70\uC11D \uC608\uC220\uB85C \uC7A5\uC2DD\uD55C \uCEE4\uB2E4\uB780 \uC120\uC0AC \uD1B5\uB85C\uBB34\uB364\uB4E4\uC774 \uAC15\uBCC0 \uACBD\uAD00\uC5D0 \uC790\uB9AC\uD569\uB2C8\uB2E4",
    seed: 494,
    color: "#bca6a0"
  },
  {
    id: "thingvellir",
    name: "\xDEingvellir",
    nameKo: "\uC2F1\uBCA8\uB9AC\uB974",
    shape: "cliff",
    feature: "A rift-valley landscape preserves the site of Iceland's historic open-air assembly",
    featureKo: "\uC5F4\uACE1 \uACBD\uAD00\uC5D0 \uC544\uC774\uC2AC\uB780\uB4DC\uC758 \uC61B \uC57C\uC678 \uC758\uD68C \uD130\uAC00 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 495,
    color: "#b69772"
  },
  {
    id: "agrigento",
    name: "Valley of the Temples at Agrigento",
    nameKo: "\uC544\uADF8\uB9AC\uC820\uD1A0 \uC2E0\uC804\uACC4\uACE1",
    shape: "columns",
    feature: "Doric temples preserve the monumental remains of a major ancient Greek city in Sicily",
    featureKo: "\uB3C4\uB9AC\uC2A4\uC2DD \uC2E0\uC804\uB4E4\uC774 \uC2DC\uCE60\uB9AC\uC544\uC758 \uC8FC\uC694 \uACE0\uB300 \uADF8\uB9AC\uC2A4 \uB3C4\uC2DC \uC720\uC801\uC5D0 \uB0A8\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 496,
    color: "#c4ac88"
  },
  {
    id: "cinqueterre",
    name: "Portovenere and Cinque Terre",
    nameKo: "\uD3EC\uB974\uD1A0\uBCA0\uB124\uB808\uC640 \uCE5C\uD018\uD14C\uB808",
    shape: "coast",
    feature: "Coastal villages and cultivated terraces cling to steep slopes above the Ligurian Sea",
    featureKo: "\uB9AC\uAD6C\uB9AC\uC544\uD574 \uC704\uC758 \uAC00\uD30C\uB978 \uBE44\uD0C8\uC5D0 \uD574\uC548\uB9C8\uC744\uACFC \uACBD\uC791 \uD14C\uB77C\uC2A4\uAC00 \uC774\uC5B4\uC9D1\uB2C8\uB2E4",
    seed: 497,
    color: "#aeb9a0"
  },
  {
    id: "bryggen",
    name: "Bryggen",
    nameKo: "\uBE0C\uB93C\uAC90",
    shape: "harbor",
    feature: "Rows of timber merchants' buildings preserve Bergen's historic Hanseatic waterfront",
    featureKo: "\uBAA9\uC870 \uC0C1\uC778 \uAC74\uBB3C\uB4E4\uC774 \uC904\uC9C0\uC5B4 \uBCA0\uB974\uAC90\uC758 \uC61B \uD55C\uC790\uB3D9\uB9F9 \uD56D\uAD6C\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4",
    seed: 498,
    color: "#bc8b70"
  },
  {
    id: "tomar",
    name: "Convent of Christ in Tomar",
    nameKo: "\uD1A0\uB9C8\uB974 \uADF8\uB9AC\uC2A4\uB3C4 \uC218\uB3C4\uC6D0",
    shape: "cloister",
    feature: "A fortified religious complex combines a round Templar church with later monastic buildings",
    featureKo: "\uBC29\uC5B4\uC2DC\uC124\uC744 \uAC16\uCD98 \uC885\uAD50 \uB2E8\uC9C0\uC5D0 \uB465\uADFC \uAE30\uC0AC\uB2E8 \uAD50\uD68C\uC640 \uD6C4\uB300\uC758 \uC218\uB3C4\uC6D0 \uAC74\uBB3C\uB4E4\uC774 \uC5B4\uC6B0\uB7EC\uC838 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 499,
    color: "#8baba4"
  },
  {
    id: "teide",
    name: "Teide National Park",
    nameKo: "\uD14C\uC774\uB370 \uAD6D\uB9BD\uACF5\uC6D0",
    shape: "volcano",
    feature: "A high volcanic cone rises above lava fields and a vast caldera on Tenerife",
    featureKo: "\uD14C\uB124\uB9AC\uD398\uC12C\uC758 \uC6A9\uC554 \uC9C0\uB300\uC640 \uAC70\uB300\uD55C \uCE7C\uB370\uB77C \uC704\uB85C \uB192\uC740 \uD654\uC0B0\uCCB4\uAC00 \uC19F\uC544 \uC788\uC2B5\uB2C8\uB2E4",
    seed: 500,
    color: "#d3b17c"
  }
];

// plugins/orcatopia/src/expanded-decorations.ts
var expandedDecorations = landmark_expansion_default.filter((entry) => !expandedWaterIds.has(entry.id)).flatMap((entry) => {
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

// plugins/orcatopia/src/decorations.ts
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
    id: "river",
    name: "River water",
    cost: 0,
    gift: false,
    shape: "path",
    color: "#65b6bd",
    walkable: false
  },
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
  ...specialBuildings.map((b) => ({
    id: b.id,
    name: b.name,
    cost: 0,
    gift: false,
    shape: "pavilion",
    color: b.color,
    walkable: false
  })),
  ...expandedDecorations,
  ...waterDecorations,
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
var isFloor = (id) => ["grass", "path", "stonepath", "river"].includes(id);
var canRotate = (id) => ["bench", "gate"].includes(decorationById(id)?.shape ?? "");

// plugins/orcatopia/src/game.ts
var weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
var collectionThresholds = { river: 12, sea: 25 };
var empty = () => ({
  version: 8,
  tourism: null,
  discoveredPlaces: [],
  firstExplorations: [],
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
function collectionDiscoveries(s) {
  return [
    .../* @__PURE__ */ new Set([
      ...s.discoveredPlaces,
      ...s.receipts.map((r) => baseId(r.landmark))
    ])
  ];
}
function collectionTheme(id) {
  const placement = waterTheme(id)?.placement;
  return placement === "coastal" ? "sea" : placement ?? "land";
}
function collectionUnlocked(s, theme) {
  return collectionDiscoveries(s).length >= collectionThresholds[theme];
}
function firstExplorationAvailable(s, theme) {
  return collectionUnlocked(s, theme) && !s.firstExplorations.some((e) => e.theme === theme);
}
function islandLevel(s) {
  return Math.max(s.landFloor, collectionDiscoveries(s).length);
}
function islandLand(s) {
  const reserved = new Set(
    s.decorations.filter((p) => decorationById(p.decoration)?.surface === "sea").map((p) => p.cell)
  );
  return landAtLevel(islandLevel(s)).filter((t) => !reserved.has(t.id));
}
function unlockedCell(s, cell) {
  return isLand(cell) && (expansionLevel.get(cell) ?? Infinity) <= islandLevel(s) && !s.decorations.some(
    (p) => p.cell === cell && decorationById(p.decoration)?.surface === "sea"
  );
}
function surfaceAt(s, cell) {
  if (!isWorldCell(cell)) return void 0;
  return !unlockedCell(s, cell) ? "sea" : s.floors.some((p) => p.cell === cell && p.decoration === "river") ? "river" : "land";
}
function canPlaceLandmark(s, id, cell) {
  const surface = surfaceAt(s, cell);
  return surface === "land" || surface === "sea" && allowsSea(id) || surface === "river" && allowsRiver(id);
}
function canPlaceDecoration(s, id, cell) {
  const decoration = decorationById(id);
  const surface = surfaceAt(s, cell);
  return Boolean(
    decoration && surface && (specialBuilding(id) ? surface === "land" : decoration.surface ? surface === decoration.surface : surface !== "sea")
  );
}
function placedFusionLandmark(s, from, cell) {
  if (!isWorldCell(from) || !isWorldCell(cell) || from === cell)
    return void 0;
  const source = s.placements.find((p) => p.cell === from);
  const target = s.placements.find((p) => p.cell === cell);
  return source && target && source.landmark === target.landmark && !isEnhanced(source.landmark) ? source.landmark : void 0;
}
function materials(s) {
  return (s.receipts.length - new Set(s.receipts.map((r) => r.landmark)).size) * DUPLICATE_MATERIALS - s.crafts.reduce((sum, c) => sum + decorationById(c.decoration).cost, 0);
}
function decorationQuantity(s, id) {
  const d = decorationById(id);
  if (!d) return 0;
  if (specialBuilding(id)) return s.tourism?.buildings.includes(id) ? 1 : 0;
  if (!d.landmark) return Infinity;
  return (d.gift && discovered(s, d.landmark) ? 1 : 0) + s.crafts.filter((c) => c.decoration === id).length;
}
function availableTickets(s) {
  const spent = new Set(s.receipts.map((r) => r.workspaceId));
  return s.tickets.filter((t) => !spent.has(t.workspaceId));
}
function validate(value) {
  if (value == null) return empty();
  const raw = value;
  const version = value.version;
  const s = raw;
  if (version !== 1 && version !== 2 && version !== 3 && version !== 4 && version !== 5 && version !== 6 && version !== 7 && version !== 8 || !Array.isArray(s.receipts) || !Array.isArray(s.placements))
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
  const fusions = version >= 6 ? s.fusions : [];
  if (!Array.isArray(fusions)) throw Error("Invalid fusion ledger");
  const fusionIds = /* @__PURE__ */ new Set();
  const fusedCounts = /* @__PURE__ */ new Map();
  for (const f of fusions) {
    if (!f || typeof f.id !== "string" || !f.id || f.id.length > 128 || fusionIds.has(f.id) || !landmarks_default.some((l) => l.id === f.landmark) || typeof f.at !== "string" || !Number.isFinite(Date.parse(f.at)) || (f.from !== void 0 || f.cell !== void 0) && (!isWorldCell(f.from) || !isWorldCell(f.cell) || f.from === f.cell))
      throw Error("Invalid fusion ledger");
    fusionIds.add(f.id);
    fusedCounts.set(f.landmark, (fusedCounts.get(f.landmark) ?? 0) + 1);
    if (fusedCounts.get(f.landmark) * 2 > (owned.get(f.landmark) ?? 0))
      throw Error("Fusion exceeds ownership");
  }
  const tourism = version >= 8 ? validateTourism(s.tourism) : null;
  const discoveredPlaces = version >= 7 ? s.discoveredPlaces : [];
  const firstExplorations = version >= 7 ? s.firstExplorations : [];
  if (!Array.isArray(discoveredPlaces) || discoveredPlaces.some((id) => !landmarks_default.some((l) => l.id === id)) || new Set(discoveredPlaces).size !== discoveredPlaces.length)
    throw Error("Invalid collection discovery ledger");
  if (!Array.isArray(firstExplorations) || firstExplorations.length > 2 || new Set(firstExplorations.map((e) => e?.theme)).size !== firstExplorations.length || new Set(
    firstExplorations.flatMap(
      (e) => e?.ticketId === void 0 ? [] : [e.ticketId]
    )
  ).size !== firstExplorations.filter((e) => e?.ticketId !== void 0).length || firstExplorations.some(
    (e) => !e || !["river", "sea"].includes(e.theme) || e.ticketId !== void 0 && (typeof e.ticketId !== "string" || !e.ticketId || e.ticketId.length > 256)
  ))
    throw Error("Invalid first exploration ledger");
  const history = [
    .../* @__PURE__ */ new Set([...discoveredPlaces, ...s.receipts.map((r) => r.landmark)])
  ].sort();
  for (const e of firstExplorations) {
    const reward = s.receipts.find((r) => r.workspaceId === e.ticketId);
    if (history.length < collectionThresholds[e.theme] || reward && collectionTheme(reward.landmark) !== e.theme)
      throw Error("Invalid first exploration ledger");
  }
  const inventory = {
    ...s,
    fusions,
    tourism,
    discoveredPlaces: history,
    firstExplorations
  };
  for (const p of s.placements) {
    if (!p || !isLand(p.cell) && !(isWorldCell(p.cell) && allowsSea(p.landmark)) || cells.has(p.cell) || !landmarkById(p.landmark) || p.rotation !== void 0 && p.rotation !== 0 && p.rotation !== 1)
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
  const landFloor = version >= 3 ? s.landFloor : Math.max(
    0,
    ...s.placements.map((p) => expansionLevel.get(p.cell) ?? 0)
  );
  const crafts = version >= 3 ? s.crafts : [];
  const oldDecor = version >= 3 ? s.decorations : [];
  if (!Array.isArray(oldDecor)) throw Error("Invalid decoration placements");
  const floors = version >= 4 ? s.floors : oldDecor.filter((p) => p && isFloor(p.decoration));
  const decor = version >= 4 ? oldDecor : oldDecor.filter((p) => !p || !isFloor(p.decoration));
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
    ...inventory,
    fusions,
    landFloor,
    crafts,
    decorations: decor,
    floors
  };
  if (materials(next) < 0) throw Error("Not enough materials");
  for (const p of s.placements)
    if (!unlockedCell(next, p.cell) && !(isWorldCell(p.cell) && allowsSea(p.landmark)))
      throw Error("Land is not unlocked");
  const usedDecor = /* @__PURE__ */ new Map();
  for (const p of decor) {
    if (!p || !decorationById(p.decoration) || isFloor(p.decoration) || p.rotation !== void 0 && (!canRotate(p.decoration) || !Number.isInteger(p.rotation) || p.rotation < 0 || p.rotation > 3) || !canPlaceDecoration(next, p.decoration, p.cell) || cells.has(p.cell))
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
    version: 8,
    tourism,
    discoveredPlaces: history,
    firstExplorations: firstExplorations.map(({ theme, ticketId }) => ({
      theme,
      ...ticketId !== void 0 ? { ticketId } : {}
    })).sort(
      (a, b) => collectionThresholds[a.theme] - collectionThresholds[b.theme]
    ),
    fusions: fusions.map(({ id, landmark, at: at2, from, cell }) => ({
      id,
      landmark,
      at: at2,
      ...from !== void 0 ? { from, cell } : {}
    })),
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
  const text = JSON.stringify({
    format: "landmark-island-backup",
    version: 1,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    state: validate(state)
  });
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
function draw(random, state, theme) {
  const progress = state ? collectionDiscoveries(state).length : Infinity;
  const candidates = landmarks_default.filter((l) => {
    const candidateTheme = collectionTheme(l.id);
    return theme ? candidateTheme === theme : candidateTheme === "land" || progress >= collectionThresholds[candidateTheme];
  });
  const tiers = Object.entries(weights).filter(
    ([tier]) => !theme || candidates.some((l) => l.tier === tier)
  );
  const total = tiers.reduce((sum, [, weight]) => sum + weight, 0);
  const roll = random() * total;
  let cumulative = 0;
  for (const [tier, weight] of tiers) {
    cumulative += weight;
    if (roll < cumulative) {
      const pool = candidates.filter((l) => l.tier === tier);
      if (!pool.length) throw Error("No landmarks available for this tier.");
      return pool[Math.floor(random() * pool.length)].id;
    }
  }
  throw Error("Invalid random source");
}
var Game = class {
  constructor(store, random = Math.random, now = Date.now) {
    this.store = store;
    this.random = random;
    this.now = now;
  }
  store;
  random;
  now;
  pendingState;
  // 정산과 변경을 한 번에 저장하도록 커밋은 queue 끝에서만 한다.
  stage(state) {
    this.pendingState = state;
  }
  tail = Promise.resolve();
  queue(action, settle = true) {
    const result = this.tail.then(async () => {
      this.pendingState = void 0;
      const state = validate(await this.store.read());
      let tourismChanged = false;
      if (settle) {
        const now = this.now();
        if (!Number.isSafeInteger(now) || now < 0)
          throw Error("Invalid tourism clock");
        const tourism = state.tourism ? settleTourism(state.tourism, tourismRate(state), now) : startTourism(now);
        if (JSON.stringify(tourism) !== JSON.stringify(state.tourism)) {
          state.tourism = tourism;
          tourismChanged = true;
        }
      }
      const output = await action(state);
      if (this.pendingState || tourismChanged)
        await this.store.write(this.pendingState ?? state);
      return output;
    });
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
    }, !previous);
  }
  restore(input) {
    return this.queue(async (s) => {
      const data = input;
      const next = decodeBackup(data?.text).state;
      next.discoveredPlaces = [
        .../* @__PURE__ */ new Set([
          ...collectionDiscoveries(next),
          ...collectionDiscoveries(s)
        ])
      ].sort();
      next.firstExplorations = ["river", "sea"].flatMap((theme) => {
        const spent = next.firstExplorations.find((e) => e.theme === theme) ?? s.firstExplorations.find((e) => e.theme === theme);
        if (!spent) return [];
        const reward = next.receipts.find(
          (r) => r.workspaceId === spent.ticketId && collectionTheme(r.landmark) === theme
        );
        return [{ theme, ...reward ? { ticketId: spent.ticketId } : {} }];
      });
      const content = (state) => JSON.stringify({
        ...state,
        tourism: {
          coins: state.tourism?.coins ?? 0,
          buildings: state.tourism?.buildings ?? []
        }
      });
      if (content(next) === content(s)) return s;
      if (!data?.expected || JSON.stringify(validate(data.expected)) !== JSON.stringify(s))
        throw Error(
          "Your island changed. Close Backups and review the file again before restoring."
        );
      if (!this.store.writeBackup)
        throw Error("Recovery storage is unavailable. Nothing was changed.");
      await this.store.writeBackup(s);
      const now = this.now();
      if (!Number.isSafeInteger(now) || now < 0)
        throw Error("Invalid tourism clock");
      next.tourism = next.tourism ? { ...next.tourism, settledAt: now, remainder: 0, away: null } : startTourism(now);
      const restored = validate(next);
      this.stage(restored);
      return restored;
    }, false);
  }
  construct(input) {
    return this.queue(async (s) => {
      const p = input;
      const building = p && specialBuilding(p.building);
      if (!building || !Number.isInteger(p?.cell))
        throw Error("Choose a special building and an empty land cell.");
      if (s.tourism.buildings.includes(building.id)) return s;
      checkLayout(s, input);
      if (!canPlaceDecoration(s, building.id, p.cell) || s.placements.some((x) => x.cell === p.cell) || s.decorations.some((x) => x.cell === p.cell))
        throw Error("Choose an empty land cell for construction.");
      if (s.tourism.coins < building.cost)
        throw Error("Not enough tourism coins.");
      s.tourism.coins -= building.cost;
      s.tourism.buildings.push(building.id);
      s.decorations.push({ decoration: building.id, cell: p.cell });
      const next = validate(s);
      this.stage(next);
      return next;
    });
  }
  acquire(event) {
    if (event.kind !== "worktree") return this.queue(async (s) => s, false);
    return this.queue(async (s) => {
      if (typeof event.workspaceId !== "string" || !event.workspaceId || event.workspaceId.length > 256)
        throw Error("Invalid workspace ID");
      if (s.tickets.some((r) => r.workspaceId === event.workspaceId)) return s;
      s.tickets.push({
        workspaceId: event.workspaceId,
        at: (/* @__PURE__ */ new Date()).toISOString()
      });
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
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
        landmark: draw(this.random, s),
        at: (/* @__PURE__ */ new Date()).toISOString()
      });
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
      return s;
    });
  }
  exploreTheme(input) {
    return this.queue(async (s) => {
      const { theme, ticketId } = input ?? {};
      if (theme !== "river" && theme !== "sea" || typeof ticketId !== "string" || !ticketId || ticketId.length > 256)
        throw Error("Choose a valid first exploration and ticket.");
      const prior = s.firstExplorations.find((e) => e.theme === theme);
      if (prior?.ticketId === ticketId && s.receipts.some(
        (r) => r.workspaceId === ticketId && collectionTheme(r.landmark) === theme
      ))
        return s;
      if (!firstExplorationAvailable(s, theme))
        throw Error("This first exploration is not available.");
      if (!availableTickets(s).some((t) => t.workspaceId === ticketId))
        throw Error("This ticket is not available");
      s.receipts.push({
        workspaceId: ticketId,
        landmark: draw(this.random, s, theme),
        at: (/* @__PURE__ */ new Date()).toISOString()
      });
      s.firstExplorations.push({ theme, ticketId });
      const next = validate(s);
      this.stage(next);
      return next;
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
        s.receipts.push({ workspaceId, landmark: draw(this.random, s), at: at2 });
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
      return s;
    });
  }
  fuse(input) {
    return this.queue(async (s) => {
      const p = input;
      if (typeof p?.id !== "string" || !p.id || p.id.length > 128 || typeof p.landmark !== "string" || isEnhanced(p.landmark) || !landmarkById(p.landmark))
        throw Error("Choose a normal landmark and a valid fusion request.");
      const onIsland = p.from !== void 0 || p.cell !== void 0;
      if (onIsland && (!isWorldCell(p.from) || !isWorldCell(p.cell) || p.from === p.cell))
        throw Error("Choose two different placed normal copies.");
      const prior = s.fusions.find((f) => f.id === p.id);
      if (prior) {
        if (prior.landmark !== p.landmark || prior.from !== p.from || prior.cell !== p.cell)
          throw Error("Fusion request was already used.");
        return s;
      }
      if (onIsland) {
        if (!p.expected || !sameLayout(layout(s), p.expected))
          throw Error("Island layout changed. Refresh before editing again.");
        if (placedFusionLandmark(s, p.from, p.cell) !== p.landmark)
          throw Error("Choose two placed copies of the same normal landmark.");
        const target = s.placements.find((item) => item.cell === p.cell);
        s.placements = s.placements.filter(
          (item) => item.cell !== p.from && item.cell !== p.cell
        );
        s.placements.push({ ...target, landmark: enhancedId(p.landmark) });
      } else {
        const placed = s.placements.filter(
          (item) => item.landmark === p.landmark
        ).length;
        if (quantity(s, p.landmark) - placed < 2)
          throw Error(
            "Fusion needs two unplaced normal copies. Return placed copies first."
          );
      }
      s.fusions.push({
        id: p.id,
        landmark: p.landmark,
        at: (/* @__PURE__ */ new Date()).toISOString(),
        ...onIsland ? { from: p.from, cell: p.cell } : {}
      });
      const next = validate(s);
      this.stage(next);
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
      this.stage(next);
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
      this.stage(next);
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
      this.stage(next);
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
      this.stage(next);
      return next;
    });
  }
  decorate(input) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input;
      if (!p || !isWorldCell(p.cell)) throw Error("Land is not unlocked");
      if (p.layer !== void 0 && p.layer !== "floor" && p.layer !== "objects")
        throw Error("Invalid editing layer");
      const floor = p.layer === "floor" || p.decoration !== void 0 && isFloor(p.decoration);
      if (floor) {
        if (!unlockedCell(s, p.cell)) throw Error("Land is not unlocked");
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
        const decoration = p.from !== void 0 ? s.decorations.find((x) => x.cell === p.from)?.decoration : p.decoration ?? s.decorations.find((x) => x.cell === p.cell)?.decoration;
        if (decoration ? !canPlaceDecoration(s, decoration, p.cell) : !unlockedCell(s, p.cell))
          throw Error("Choose the matching land, sea or river surface");
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
      this.stage(next);
      return next;
    });
  }
  place(input) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input;
      const landmark = p?.from !== void 0 ? s.placements.find((x) => x.cell === p.from)?.landmark : p?.landmark ?? s.placements.find((x) => x.cell === p?.cell)?.landmark;
      if (!p || (p.landmark === void 0 && p.from === void 0 ? !unlockedCell(s, p.cell) && !s.placements.some((x) => x.cell === p.cell) : !landmark || !canPlaceLandmark(s, landmark, p.cell)))
        throw Error("Land is not unlocked");
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
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
      return s;
    });
  }
};

// plugins/orcatopia/src/worker/main.ts
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
  orca.panels.handle("island.construct", async (input) => {
    const state = await game.construct(input);
    await notify();
    return state;
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
  orca.panels.handle("island.exploreTheme", async (input) => {
    const state = await game.exploreTheme(input);
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
