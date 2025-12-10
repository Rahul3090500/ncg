import { PhoneFormat } from '../types'

export const countryPhoneFormats: Record<string, PhoneFormat> = {
  '+93': { placeholder: '70 123 456', maxLength: 9 }, // Afghanistan
  '+355': { placeholder: '67 123 4567', maxLength: 9 }, // Albania
  '+213': { placeholder: '551 23 45 67', maxLength: 9 }, // Algeria
  '+376': { placeholder: '312 345', maxLength: 6 }, // Andorra
  '+244': { placeholder: '923 123 456', maxLength: 9 }, // Angola
  '+54': { placeholder: '11 1234-5678', maxLength: 10 }, // Argentina
  '+374': { placeholder: '91 123456', maxLength: 8 }, // Armenia
  '+61': { placeholder: '412 345 678', maxLength: 9 }, // Australia
  '+43': { placeholder: '664 123456', maxLength: 10 }, // Austria
  '+994': { placeholder: '50 123 45 67', maxLength: 9 }, // Azerbaijan
  '+973': { placeholder: '3612 3456', maxLength: 8 }, // Bahrain
  '+880': { placeholder: '1712 345678', maxLength: 10 }, // Bangladesh
  '+375': { placeholder: '29 123-45-67', maxLength: 9 }, // Belarus
  '+32': { placeholder: '470 12 34 56', maxLength: 9 }, // Belgium
  '+501': { placeholder: '612 3456', maxLength: 7 }, // Belize
  '+229': { placeholder: '90 12 34 56', maxLength: 8 }, // Benin
  '+975': { placeholder: '17 12 34 56', maxLength: 8 }, // Bhutan
  '+591': { placeholder: '712 34567', maxLength: 8 }, // Bolivia
  '+387': { placeholder: '61 123 456', maxLength: 9 }, // Bosnia
  '+267': { placeholder: '71 123 456', maxLength: 8 }, // Botswana
  '+55': { placeholder: '11 91234-5678', maxLength: 11 }, // Brazil
  '+673': { placeholder: '712 3456', maxLength: 7 }, // Brunei
  '+359': { placeholder: '888 123 456', maxLength: 9 }, // Bulgaria
  '+226': { placeholder: '70 12 34 56', maxLength: 8 }, // Burkina Faso
  '+257': { placeholder: '79 12 34 56', maxLength: 8 }, // Burundi
  '+855': { placeholder: '12 345 678', maxLength: 9 }, // Cambodia
  '+237': { placeholder: '6 12 34 56 78', maxLength: 9 }, // Cameroon
  '+1': { placeholder: '(555) 123-4567', maxLength: 10 }, // Canada/US
  '+238': { placeholder: '991 12 34', maxLength: 7 }, // Cape Verde
  '+236': { placeholder: '70 12 34 56', maxLength: 8 }, // Central African Republic
  '+235': { placeholder: '63 12 34 56', maxLength: 8 }, // Chad
  '+56': { placeholder: '9 1234 5678', maxLength: 9 }, // Chile
  '+86': { placeholder: '138 0013 8000', maxLength: 11 }, // China
  '+57': { placeholder: '321 123 4567', maxLength: 10 }, // Colombia
  '+269': { placeholder: '321 23 45', maxLength: 7 }, // Comoros
  '+242': { placeholder: '06 123 45 67', maxLength: 9 }, // Congo
  '+506': { placeholder: '8123 4567', maxLength: 8 }, // Costa Rica
  '+385': { placeholder: '91 123 4567', maxLength: 9 }, // Croatia
  '+53': { placeholder: '5 123 4567', maxLength: 8 }, // Cuba
  '+357': { placeholder: '96 123456', maxLength: 8 }, // Cyprus
  '+420': { placeholder: '601 123 456', maxLength: 9 }, // Czech Republic
  '+243': { placeholder: '812 345 678', maxLength: 9 }, // DR Congo
  '+45': { placeholder: '20 12 34 56', maxLength: 8 }, // Denmark
  '+253': { placeholder: '77 12 34 56', maxLength: 8 }, // Djibouti
  '+593': { placeholder: '99 123 4567', maxLength: 9 }, // Ecuador
  '+20': { placeholder: '10 1234 5678', maxLength: 10 }, // Egypt
  '+503': { placeholder: '7123 4567', maxLength: 8 }, // El Salvador
  '+240': { placeholder: '222 123 456', maxLength: 9 }, // Equatorial Guinea
  '+291': { placeholder: '7 123 4567', maxLength: 8 }, // Eritrea
  '+372': { placeholder: '5123 4567', maxLength: 8 }, // Estonia
  '+251': { placeholder: '911 23 45 67', maxLength: 9 }, // Ethiopia
  '+679': { placeholder: '701 2345', maxLength: 7 }, // Fiji
  '+358': { placeholder: '41 2345678', maxLength: 10 }, // Finland
  '+33': { placeholder: '6 12 34 56 78', maxLength: 9 }, // France
  '+241': { placeholder: '06 12 34 56', maxLength: 9 }, // Gabon
  '+220': { placeholder: '700 1234', maxLength: 7 }, // Gambia
  '+995': { placeholder: '555 12 34 56', maxLength: 9 }, // Georgia
  '+49': { placeholder: '151 23456789', maxLength: 11 }, // Germany
  '+233': { placeholder: '24 123 4567', maxLength: 9 }, // Ghana
  '+30': { placeholder: '691 234 5678', maxLength: 10 }, // Greece
  '+502': { placeholder: '5123 4567', maxLength: 8 }, // Guatemala
  '+224': { placeholder: '612 34 56 78', maxLength: 9 }, // Guinea
  '+245': { placeholder: '955 1234', maxLength: 7 }, // Guinea-Bissau
  '+592': { placeholder: '612 3456', maxLength: 7 }, // Guyana
  '+509': { placeholder: '34 12 3456', maxLength: 8 }, // Haiti
  '+504': { placeholder: '9123 4567', maxLength: 8 }, // Honduras
  '+852': { placeholder: '5123 4567', maxLength: 8 }, // Hong Kong
  '+36': { placeholder: '20 123 4567', maxLength: 9 }, // Hungary
  '+354': { placeholder: '612 3456', maxLength: 7 }, // Iceland
  '+91': { placeholder: '98765 43210', maxLength: 10 }, // India
  '+62': { placeholder: '812 345 678', maxLength: 10 }, // Indonesia
  '+98': { placeholder: '912 345 6789', maxLength: 10 }, // Iran
  '+964': { placeholder: '790 123 4567', maxLength: 10 }, // Iraq
  '+353': { placeholder: '85 123 4567', maxLength: 9 }, // Ireland
  '+972': { placeholder: '50-123-4567', maxLength: 9 }, // Israel
  '+39': { placeholder: '312 345 6789', maxLength: 10 }, // Italy
  '+225': { placeholder: '07 12 34 56 78', maxLength: 10 }, // Ivory Coast
  '+81': { placeholder: '90-1234-5678', maxLength: 10 }, // Japan
  '+962': { placeholder: '7 9123 4567', maxLength: 9 }, // Jordan
  '+7': { placeholder: '701 234 5678', maxLength: 10 }, // Kazakhstan/Russia
  '+254': { placeholder: '712 123456', maxLength: 9 }, // Kenya
  '+686': { placeholder: '72012', maxLength: 5 }, // Kiribati
  '+383': { placeholder: '44 123 456', maxLength: 9 }, // Kosovo
  '+965': { placeholder: '5012 3456', maxLength: 8 }, // Kuwait
  '+996': { placeholder: '555 12 34 56', maxLength: 9 }, // Kyrgyzstan
  '+856': { placeholder: '20 23 456 789', maxLength: 10 }, // Laos
  '+371': { placeholder: '21 234 567', maxLength: 8 }, // Latvia
  '+961': { placeholder: '3 123 456', maxLength: 8 }, // Lebanon
  '+266': { placeholder: '5012 3456', maxLength: 8 }, // Lesotho
  '+231': { placeholder: '77 123 4567', maxLength: 9 }, // Liberia
  '+218': { placeholder: '91 234 5678', maxLength: 9 }, // Libya
  '+423': { placeholder: '661 2345', maxLength: 7 }, // Liechtenstein
  '+370': { placeholder: '612 34567', maxLength: 8 }, // Lithuania
  '+352': { placeholder: '621 123 456', maxLength: 9 }, // Luxembourg
  '+853': { placeholder: '6612 3456', maxLength: 8 }, // Macau
  '+389': { placeholder: '72 123 456', maxLength: 8 }, // Macedonia
  '+261': { placeholder: '32 12 345 67', maxLength: 9 }, // Madagascar
  '+265': { placeholder: '991 23 45 67', maxLength: 9 }, // Malawi
  '+60': { placeholder: '12-345 6789', maxLength: 10 }, // Malaysia
  '+960': { placeholder: '771 2345', maxLength: 7 }, // Maldives
  '+223': { placeholder: '65 12 34 56', maxLength: 8 }, // Mali
  '+356': { placeholder: '9612 3456', maxLength: 8 }, // Malta
  '+692': { placeholder: '625 1234', maxLength: 7 }, // Marshall Islands
  '+222': { placeholder: '22 12 34 56', maxLength: 8 }, // Mauritania
  '+230': { placeholder: '5 123 4567', maxLength: 8 }, // Mauritius
  '+52': { placeholder: '55 1234 5678', maxLength: 10 }, // Mexico
  '+691': { placeholder: '350 1234', maxLength: 7 }, // Micronesia
  '+373': { placeholder: '621 12 345', maxLength: 8 }, // Moldova
  '+377': { placeholder: '6 12 34 56 78', maxLength: 9 }, // Monaco
  '+976': { placeholder: '9912 3456', maxLength: 8 }, // Mongolia
  '+382': { placeholder: '67 123 456', maxLength: 8 }, // Montenegro
  '+212': { placeholder: '612-345678', maxLength: 9 }, // Morocco
  '+258': { placeholder: '82 123 4567', maxLength: 9 }, // Mozambique
  '+95': { placeholder: '9 123 456 789', maxLength: 10 }, // Myanmar
  '+264': { placeholder: '81 123 4567', maxLength: 9 }, // Namibia
  '+977': { placeholder: '980-1234567', maxLength: 10 }, // Nepal
  '+31': { placeholder: '6 12345678', maxLength: 9 }, // Netherlands
  '+64': { placeholder: '21 123 4567', maxLength: 8 }, // New Zealand
  '+505': { placeholder: '8123 4567', maxLength: 8 }, // Nicaragua
  '+227': { placeholder: '90 12 34 56', maxLength: 8 }, // Niger
  '+234': { placeholder: '802 123 4567', maxLength: 11 }, // Nigeria
  '+850': { placeholder: '191 234 5678', maxLength: 10 }, // North Korea
  '+47': { placeholder: '412 34 567', maxLength: 8 }, // Norway
  '+968': { placeholder: '9212 3456', maxLength: 8 }, // Oman
  '+92': { placeholder: '300 1234567', maxLength: 10 }, // Pakistan
  '+680': { placeholder: '620 1234', maxLength: 7 }, // Palau
  '+970': { placeholder: '59 123 4567', maxLength: 9 }, // Palestine
  '+507': { placeholder: '6123-4567', maxLength: 8 }, // Panama
  '+675': { placeholder: '7123 4567', maxLength: 8 }, // Papua New Guinea
  '+595': { placeholder: '981 123456', maxLength: 9 }, // Paraguay
  '+51': { placeholder: '912 345 678', maxLength: 9 }, // Peru
  '+63': { placeholder: '912 345 6789', maxLength: 10 }, // Philippines
  '+48': { placeholder: '512 345 678', maxLength: 9 }, // Poland
  '+351': { placeholder: '912 345 678', maxLength: 9 }, // Portugal
  '+974': { placeholder: '3312 3456', maxLength: 8 }, // Qatar
  '+40': { placeholder: '712 034 567', maxLength: 9 }, // Romania
  '+250': { placeholder: '788 123 456', maxLength: 9 }, // Rwanda
  '+685': { placeholder: '7212345', maxLength: 7 }, // Samoa
  '+378': { placeholder: '66 66 12 34', maxLength: 9 }, // San Marino
  '+239': { placeholder: '991 12 34', maxLength: 7 }, // São Tomé
  '+966': { placeholder: '50 123 4567', maxLength: 9 }, // Saudi Arabia
  '+221': { placeholder: '70 123 45 67', maxLength: 9 }, // Senegal
  '+381': { placeholder: '64 123 4567', maxLength: 9 }, // Serbia
  '+248': { placeholder: '2 510 123', maxLength: 7 }, // Seychelles
  '+232': { placeholder: '76 123456', maxLength: 8 }, // Sierra Leone
  '+65': { placeholder: '9123 4567', maxLength: 8 }, // Singapore
  '+421': { placeholder: '912 123 456', maxLength: 9 }, // Slovakia
  '+386': { placeholder: '40 123 456', maxLength: 8 }, // Slovenia
  '+677': { placeholder: '74 12345', maxLength: 7 }, // Solomon Islands
  '+252': { placeholder: '7 123 4567', maxLength: 8 }, // Somalia
  '+27': { placeholder: '82 123 4567', maxLength: 9 }, // South Africa
  '+82': { placeholder: '10-1234-5678', maxLength: 10 }, // South Korea
  '+211': { placeholder: '912 123 456', maxLength: 9 }, // South Sudan
  '+34': { placeholder: '612 34 56 78', maxLength: 9 }, // Spain
  '+94': { placeholder: '71 234 5678', maxLength: 9 }, // Sri Lanka
  '+249': { placeholder: '91 123 4567', maxLength: 9 }, // Sudan
  '+597': { placeholder: '712 3456', maxLength: 7 }, // Suriname
  '+46': { placeholder: '70 123 45 67', maxLength: 9 }, // Sweden
  '+41': { placeholder: '76 123 45 67', maxLength: 9 }, // Switzerland
  '+963': { placeholder: '944 567 890', maxLength: 9 }, // Syria
  '+886': { placeholder: '912 345 678', maxLength: 9 }, // Taiwan
  '+992': { placeholder: '917 12 34 56', maxLength: 9 }, // Tajikistan
  '+255': { placeholder: '712 345 678', maxLength: 9 }, // Tanzania
  '+66': { placeholder: '81 234 5678', maxLength: 9 }, // Thailand
  '+228': { placeholder: '90 12 34 56', maxLength: 8 }, // Togo
  '+676': { placeholder: '771 5123', maxLength: 7 }, // Tonga
  '+216': { placeholder: '20 123 456', maxLength: 8 }, // Tunisia
  '+90': { placeholder: '532 123 45 67', maxLength: 10 }, // Turkey
  '+993': { placeholder: '62 12 34 56', maxLength: 8 }, // Turkmenistan
  '+256': { placeholder: '712 345678', maxLength: 9 }, // Uganda
  '+380': { placeholder: '50 123 4567', maxLength: 9 }, // Ukraine
  '+971': { placeholder: '50 123 4567', maxLength: 9 }, // UAE
  '+44': { placeholder: '7700 123456', maxLength: 10 }, // UK
  '+598': { placeholder: '99 123 456', maxLength: 8 }, // Uruguay
  '+998': { placeholder: '90 123 45 67', maxLength: 9 }, // Uzbekistan
  '+678': { placeholder: '771 5123', maxLength: 7 }, // Vanuatu
  '+58': { placeholder: '412 1234567', maxLength: 10 }, // Venezuela
  '+84': { placeholder: '91 234 5678', maxLength: 9 }, // Vietnam
  '+967': { placeholder: '712 345 678', maxLength: 9 }, // Yemen
  '+260': { placeholder: '96 123 4567', maxLength: 9 }, // Zambia
  '+263': { placeholder: '71 234 5678', maxLength: 9 }, // Zimbabwe
}

export const getPhoneFormat = (countryCode: string): PhoneFormat => {
  return countryPhoneFormats[countryCode] || { placeholder: '123 456 789', maxLength: 15 }
}

