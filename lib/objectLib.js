// copyright Mel Bartels, 2013-2022
// see objectLib unitTests.htm for unit tests
// turn on jslint's Tolerate ++ and --

// var MLB, _;
'use strict';

/*
for regex, see http://regex101.com/
for underscorejs, see http://underscorejs.org/
for NGC descriptions and Saguaro database interpretation, see http://obs.nineplanets.org/ngc.html and Sacdoc.txt
Saguaro db at http://www.saguaroastro.org/content/downloads.htm
references for Abell galaxy clusters:
    http://en.wikipedia.org/wiki/Abell_catalogue
    http://www.saguaroastro.org/content/Abel-Galaxy-Clusters.htm
    http://en.wikipedia.org/wiki/Bautz-Morgan_type
    Webb Society Deep-Sky Observer's Handbook pg 97
*/

(function () {
    if (!window.console) {
        console = {
            log: function () {},
            warn: function () {},
            error: function () {}
        };
    }
}());

MLB.objectLib = {};

MLB.objectLib.romanNumbers = [
    {key: 'I', value: 1},
    {key: 'V', value: 5},
    {key: 'X', value: 10},
    {key: 'L', value: 50},
    {key: 'C', value: 100},
    {key: 'D', value: 500},
    {key: 'M', value: 1000}
];

MLB.objectLib.convertRomanNumeral = function (value) {
    var romanNumbers = MLB.objectLib.romanNumbers,
        values = value.split(''),
        numbers = [],
        numbersToCheck,
        ix;

    // build array of numbers based on character to roman numeral lookup, think 'join'; if preceding roman number is less, eg I is less than V in the two character set IV, it should be subtracted, ie, -1+5=4
    numbers = _.map(values, function (s) { return _.find(romanNumbers, function (keyValue) { return keyValue.key === s; }).value; });
    numbersToCheck = numbers.length - 1;
    for (ix = 0; ix < numbersToCheck; ix++) {
        if (numbers[ix] < numbers[ix + 1]) {
            numbers[ix] = -numbers[ix];
        }
    }
    return _.reduce(numbers, function (start, num) { return start + num; }, 0);
};

MLB.objectLib.constellations = [
    {key: 'AND', value: 'ANDROMEDA'},
    {key: 'ANT', value: 'ANTLIA'},
    {key: 'APS', value: 'APUS'},
    {key: 'AQR', value: 'AQUARIUS'},
    {key: 'AQL', value: 'AQUILA'},
    {key: 'ARA', value: 'ARA'},
    {key: 'ARI', value: 'ARIES'},
    {key: 'AUR', value: 'AURIGA'},
    {key: 'BOO', value: 'BOOTES'},
    {key: 'CAE', value: 'CAELUM'},
    {key: 'CAM', value: 'CAMELOPARDALIS'},
    {key: 'CNC', value: 'CANCER'},
    {key: 'CVN', value: 'CANES VENATICI'},
    {key: 'CMA', value: 'CANIS MAJOR'},
    {key: 'CMI', value: 'CANIS MINOR'},
    {key: 'CAP', value: 'CAPRICORNUS'},
    {key: 'CAR', value: 'CARINA'},
    {key: 'CAS', value: 'CASSIOPEIA'},
    {key: 'CEN', value: 'CENTAURUS'},
    {key: 'CEP', value: 'CEPHEUS'},
    {key: 'CET', value: 'CETUS'},
    {key: 'CHA', value: 'CHAMAELEON'},
    {key: 'CIR', value: 'CIRCINUS'},
    {key: 'COL', value: 'COLUMBA'},
    {key: 'COM', value: 'COMA BERENICES'},
    {key: 'CRA', value: 'CORONA AUSTRALIS'},
    {key: 'CRB', value: 'CORONA BOREALIS'},
    {key: 'CRV', value: 'CORVUS'},
    {key: 'CRT', value: 'CRATER'},
    {key: 'CRU', value: 'CRUX'},
    {key: 'CYG', value: 'CYGNUS'},
    {key: 'DEL', value: 'DELPHINUS'},
    {key: 'DOR', value: 'DORADO'},
    {key: 'DRA', value: 'DRACO'},
    {key: 'EQU', value: 'EQUULEUS'},
    {key: 'ERI', value: 'ERIDANUS'},
    {key: 'FOR', value: 'FORNAX'},
    {key: 'GEM', value: 'GEMINI'},
    {key: 'GRU', value: 'GRUS'},
    {key: 'HER', value: 'HERCULES'},
    {key: 'HOR', value: 'HOROLOGIUM'},
    {key: 'HYA', value: 'HYDRA'},
    {key: 'HYI', value: 'HYDRUS'},
    {key: 'IND', value: 'INDUS'},
    {key: 'LAC', value: 'LACERTA'},
    {key: 'LEO', value: 'LEO'},
    {key: 'LMI', value: 'LEO MINOR'},
    {key: 'LEP', value: 'LEPUS'},
    {key: 'LIB', value: 'LIBRA'},
    {key: 'LUP', value: 'LUPUS'},
    {key: 'LYN', value: 'LYNX'},
    {key: 'LYR', value: 'LYRA'},
    {key: 'MEN', value: 'MENSA'},
    {key: 'MIC', value: 'MICROSCOPIUM'},
    {key: 'MON', value: 'MONOCEROS'},
    {key: 'MUS', value: 'MUSCA'},
    {key: 'NOR', value: 'NORMA'},
    {key: 'OCT', value: 'OCTANS'},
    {key: 'OPH', value: 'OPHIUCHUS'},
    {key: 'ORI', value: 'ORION'},
    {key: 'PAV', value: 'PAVO'},
    {key: 'PEG', value: 'PEGASUS'},
    {key: 'PER', value: 'PERSEUS'},
    {key: 'PHE', value: 'PHOENIX'},
    {key: 'PIC', value: 'PICTOR'},
    {key: 'PSC', value: 'PISCES'},
    {key: 'PSA', value: 'PISCES AUSTRINUS'},
    {key: 'PUP', value: 'PUPPIS'},
    {key: 'PYX', value: 'PYXIS'},
    {key: 'RET', value: 'RETICULUM'},
    {key: 'SGE', value: 'SAGITTA'},
    {key: 'SGR', value: 'SAGITTARIUS'},
    {key: 'SCO', value: 'SCORPIUS'},
    {key: 'SCL', value: 'SCULPTOR'},
    {key: 'SCT', value: 'SCUTUM'},
    {key: 'SER', value: 'SERPENS'},
    {key: 'SEX', value: 'SEXTANS'},
    {key: 'TAU', value: 'TAURUS'},
    {key: 'TEL', value: 'TELESCOPIUM'},
    {key: 'TRA', value: 'TRIANGULUM AUSTRALE'},
    {key: 'TRI', value: 'TRIANGULUM'},
    {key: 'TUC', value: 'TUCANA'},
    {key: 'UMA', value: 'URSA MAJOR'},
    {key: 'UMI', value: 'URSA MINOR'},
    {key: 'VEL', value: 'VELA'},
    {key: 'VIR', value: 'VIRGO'},
    {key: 'VOL', value: 'VOLANS'},
    {key: 'VUL', value: 'VULPECULA'}
];

MLB.objectLib.catalogs = [
    {key: '3C', value: 'Third Cambridge Catalog of Radio Wave Sources'},
    {key: 'Abell', value: 'George Abell (planetary nebulae and galaxy clusters'},
    {key: 'ADS', value: 'Aitken Double Star catalog'},
    {key: 'AM', value: 'Arp,Madore (globular clusters)'},
    {key: 'Antalova', value: '(open clusters)'},
    {key: 'Ap', value: 'Apriamasvili (planetary nebulae)'},
    {key: 'Arp', value: 'Halton Arp (interacting galaxies)'},
    {key: 'Bark', value: 'Barkhatova (open clusters)'},
    {key: 'B', value: 'Barnard (dark nebulae)'},
    {key: 'Basel', value: '(open clusters)'},
    {key: 'BD', value: 'Bonner Durchmusterung (stars)'},
    {key: 'Berk', value: 'Berkeley (open clusters)'},
    {key: 'Be', value: 'Bernes (dark nebulae)'},
    {key: 'Biur', value: 'Biurakan (open clusters)'},
    {key: 'Blanco', value: '(open clusters)'},
    {key: 'Bochum', value: '(open clusters)'},
    {key: 'Ced', value: 'Cederblad (bright nebulae)'},
    {key: 'CGCG', value: 'Catalog of Galaxies and Clusters of Galaxies)'},
    {key: 'Cr', value: 'Collinder (open clusters)'},
    {key: 'Czernik', value: '(open clusters)'},
    {key: 'Danks', value: '(open clusters)'},
    {key: 'DDO', value: 'David Dunlap Observatory (dwarf galaxies)'},
    {key: 'Djorgovski', value: '("globular clusters")'},
    {key: 'Do', value: 'Dolidze (open clusters)'},
    {key: 'DoDz', value: 'Dolidze,Dzimselejsvili (open clusters)'},
    {key: 'Dun', value: 'Dunlop (Southern objects of all types)'},
    {key: 'ESO', value: 'European Southern Observatory (Southern objects)'},
    {key: 'Fein', value: 'Feinstein (open clusters)'},
    {key: 'FCC', value: 'A catalog of galaxies in the central 3.5 degs of the Fornax Cluster by H. C. Ferguson - 1989'},
    {key: 'Fleming', value: '(planetary nebulae)'},
    {key: 'Frolov', value: '(open clusters)'},
    {key: 'GCL', value: 'Catalogue of Star Clusters and Associations by J. Ruprecht, B. Balazs, & R. E. White - 1981'},
    {key: 'Gum', value: '(bright nebulae)'},
    {key: 'H', value: 'William Herschel (globular clusters)'},
    {key: 'Haffner', value: '(open clusters)'},
    {key: 'Harvard', value: '(open clusters)'},
    {key: 'Hav,Moffat', value: 'Havermeyer and Moffat (open clusters)'},
    {key: 'He', value: 'Henize (planetary nebulae)'},
    {key: 'Hogg', value: '(open clusters)'},
    {key: 'Ho', value: 'Holmberg (galaxies)'},
    {key: 'HP', value: 'Haute Provence (globular clusters)'},
    {key: 'Hu', value: 'Humason (planetary nebulae)'},
    {key: 'I Zw', value: 'Zwicky (galaxies)'},
    {key: 'III Zw', value: 'Zwicky (galaxies)'},
    {key: 'IV Zw', value: 'Zwicky (galaxies)'},
    {key: 'IC', value: '1st and 2nd Index Catalogs to the NGC (All types of objects except dark nebulae)'},
    {key: 'Isk', value: 'Iskudarian (open clusters)'},
    {key: 'J', value: 'Jonckheere (planetary nebulae)'},
    {key: 'K', value: 'Kohoutek (planetary nebulae)'},
    {key: 'Kemble', value: 'Father Lucian Kemble (asterisms)'},
    {key: 'King', value: '(open clusters)'},
    {key: 'Kr', value: 'Krasnogorskaja (planetary nebulae)'},
    {key: 'Lac', value: 'Lacaille (globular clusters)'},
    {key: 'LBN', value: 'Lynds (bright nebula)'},
    {key: 'LDN', value: 'Lynds (dark nebulae)'},
    {key: 'Loden', value: '(open clusters)'},
    {key: 'Longmore', value: '(planetary nebulae'},
    {key: 'Lynga', value: '(open clusters)'},
    {key: 'M', value: 'Messier (all types of objects except dark nebulae)'},
    {key: 'MCG', value: 'Morphological Catalog of Galaxies'},
    {key: 'Me', value: 'Merrill (plantary nebulae)'},
    {key: 'Mrk', value: 'Markarian (open clusters and galaxies)'},
    {key: 'Mel', value: 'Melotte (open clusters)'},
    {key: 'M1', value: 'Minkowski (planetary nebulae)'},
    {key: 'M2', value: 'Minkowski (planetary nebulae)'},
    {key: 'M3', value: 'Minkowski (planetary nebulae)'},
    {key: 'M4', value: 'Minkowski (planetary nebulae)'},
    {key: 'New', value: '\"New\" galaxies in the Revised Shapley,Ames Catalog'},
    {key: 'NGC', value: 'New General Catalog of Nebulae & Clusters (All types of objects except dark nebulae)'},
    {key: 'NPM1G', value: 'Northern Proper Motion, 1st part, Galaxies'},
    {key: 'OCL', value: 'Catalogue of Star Clusters and Associations by J. Ruprecht, B. Balazs, & R. E. White - 1981'},
    {key: 'Pal', value: 'Palomar (globular clusters)'},
    {key: 'PB', value: 'Peimbert and Batiz (planetary nebulae)'},
    {key: 'PC', value: 'Peimbert and Costero (planetary nebulae)'},
    {key: 'Peimbert', value: 'Planetary nebulae (Peimbert)'},
    {key: 'Perek', value: 'Planetary nebulae (Perek)'},
    {key: 'PGC', value: 'Principal Galaxies Catalog'},
    {key: 'Pismis', value: '(open clusters)'},
    {key: 'PK', value: 'Perek & Kohoutek (planetary nebulae)'},
    {key: 'RCW', value: 'Rodgers, Campbell, & Whiteoak (bright nebulae)'},
    {key: 'Roslund', value: '(open clusters)'},
    {key: 'Ru', value: 'Ruprecht (open clusters)'},
    {key: 'Sa', value: 'Sandqvist (dark nebulae)'},
    {key: 'SAO', value: 'Smithsonian Astrophysical Observatory catalog'},
    {key: 'Sher', value: '(open clusters)'},
    {key: 'Sh', value: 'Sharpless (bright nebulae)'},
    {key: 'Sh2', value: 'A Catalogue of H II Regions by S. Sharpless - 1959'},
    {key: 'SL', value: 'Sandqvist & Lindroos (dark nebulae)'},
    //SL can also stand for {key: 'SL', value: 'Shapley & Lindsay (clusters in LMC)'},
    {key: 'Steph', value: 'Stephenson (open clusters)'},
    {key: 'Stock', value: '(open clusters)'},
    {key: 'Ter', value: 'Terzan (globular clusters)'},
    {key: 'Tombaugh', value: '(open clusters)'},
    {key: 'Ton', value: 'Tonantzintla (globular clusters)'},
    {key: 'Tr', value: 'Trumpler (open clusters)'},
    {key: 'UGC', value: 'Uppsala General Catalog (galaxies)'},
    {key: 'UGCA', value: 'Uppsala General Catalog, Addendum (galaxies)'},
    {key: 'UKS', value: 'United Kingdom Schmidt (globular clusters)'},
    {key: 'Upgren', value: '(open clusters)'},
    {key: 'V V', value: 'Vorontsov,Velyaminov (interacting galaxies)'},
    {key: 'vdB', value: 'van den Bergh (open clusters, bright nebulae)'},
    {key: 'vdBH', value: 'van den Bergh & Herbst (bright nebulae)'},
    {key: 'vdB,Ha', value: 'van den Bergh,Hagen (open clusters)'},
    {key: 'Vy', value: 'Vyssotsky (planetary nebulae)'},
    {key: 'Waterloo', value: '(open clusters)'},
    {key: 'Winnecke', value: 'Double Star (Messier 40)'},
    {key: 'ZwG', value: 'Zwicky (galaxies)'}
];

MLB.objectLib.openClusters = [
    {key: 'ASTER', value: 'Asterism'},
    {key: 'IV', value: 'Not well detached from surrounding star field'},
    {key: 'III', value: 'Detached, no concentration toward the center'},
    {key: 'II', value: 'Detached, weak concentration toward the center'},
    {key: 'I', value: 'Detached, strong concentration toward the center'},
    {key: '1', value: 'Small range'},
    {key: '2', value: 'Moderate range'},
    {key: '3', value: 'Large range'},
    {key: 'p', value: 'Poor (<50 stars)'},
    {key: 'm', value: 'Moderately rich (50-100 stars)'},
    {key: 'r', value: 'Rich (>100 stars)'},
    {key: 'n', value: 'nebulosity in cluster'},
    // references to scientific papers that are ignored
    {key: ':a', value: ''},
    {key: ':b', value: ''}
];

MLB.objectLib.galaxies = [
    {key: 'elliptical', value: 'elliptical'},
    {key: 'compact', value: 'compact'},
    {key: 'ring', value: 'ring'},
    {key: 'bar', value: 'with central bar'},
    {key: 'pec', value: 'peculiar'},
    {key: 'ir', value: 'irregular'},
    {key: 'sbo', value: 'barred spiral lenticular'},
    {key: 'sb', value: 'barred spiral'},
    {key: 'so', value: 'lenticular'},
    {key: 'd', value: 'irregular'},
    {key: 'e', value: 'elliptical'},
    {key: 'm', value: 'Magellanic'},
    {key: 'pec', value: 'peculiar'},
    {key: 'p', value: 'peculiar'},
    {key: 's', value: 'spiral'},
    {key: '*', value: 'star'},
    {key: '+', value: 'plus'},
    {key: '-', value: '-'},
    {key: '/', value: '/'},
    {key: '(', value: '('},
    {key: ')', value: ')'},
    {key: '0', value: 'very round'},
    {key: '1', value: 'almost round'},
    {key: '2', value: 'barely round'},
    {key: '3', value: 'semi round'},
    {key: '4', value: 'flat round'},
    {key: '5', value: 'semi flat'},
    {key: '6', value: 'almost flat'},
    {key: '7', value: 'very flat'}
];

MLB.objectLib.AbellRichness = [
    {key: '0', value: '30 to 49 galaxies'},
    {key: '1', value: '50 to 79 galaxies'},
    {key: '2', value: '80 to 129 galaxies'},
    {key: '3', value: '130 to 199 galaxies'},
    {key: '4', value: '200 to 299 galaxies'},
    {key: '5', value: 'more than 299 galaxies'}
];

MLB.objectLib.AbellDistance = [
    {key: '1', value: 'mag 13.3 to 14.0'},
    {key: '2', value: 'mag 14.1 to 14.8'},
    {key: '3', value: 'mag 14.9 to 15.6'},
    {key: '4', value: 'mag 15.7 to 16.4'},
    {key: '5', value: 'mag 16.5 to 17.2'},
    {key: '6', value: 'mag 17.3 to 18.0'},
    {key: '7', value: 'mag fainter than 18.0'}
];

MLB.objectLib.BautzMorgan = [
    {key: 'I', value: 'cluster dominated by a bright, large, supermassive cD galaxy, e.g. Abell 2029 and Abell 2199'},
    {key: 'II', value: 'cluster contains elliptical galaxies whose brightness relative to the cluster is intermediate to that of type I and type III, e.g. the Coma Cluster '},
    {key: 'III', value: 'cluster has no remarkable members, e.g. the Virgo Cluster'},
    {key: 'IIIE', value: 'cluster has no remarkable members, does not contain giant spirals'},
    {key: 'IIIS', value: 'cluster has no remarkable members, contains many giant spirals'},
    {key: 'I-II', value: 'cluster intermediate between being dominated by supermassive cD galaxy and containing bright elliptical galaxies'},
    {key: 'II-III', value: 'cluster intermediate between containing bright elliptical galaxies and containing no remarkable members'}
];

MLB.objectLib.ellipticals = [
    {key: 'c', value: 'supergiant'},
    {key: 'd', value: 'dwarf'},
    {key: 'D', value: 'diffuse halo'}
];

MLB.objectLib.spirals = [
    {key: 'a', value: 'tightly wound arms'},
    {key: 'b', value: 'moderately wound arms'},
    {key: 'c', value: 'loosely wound arms'}
];

MLB.objectLib.planetaries = [
    {key: '1', value: 'Stellar'},
    {key: '2', value: 'Smooth disk'},
    {key: '3', value: 'Irregular disk'},
    {key: '4', value: 'Ring structure'},
    {key: '5', value: 'Irregular form similar to diffuse nebula'},
    {key: '6', value: 'Anomalous form, no regular structure'},
    {key: '(', value: ' ('},
    {key: ')', value: ') '}
];

MLB.objectLib.planetaries2 = [
    {key: 'a', value: 'brighter center'},
    {key: 'b', value: 'uniform brightness'},
    {key: 'c', value: 'traces of ring structure'}
];

MLB.objectLib.planetaries3 = [
    {key: 'a', value: 'very irregular brightness distribution'},
    {key: 'b', value: 'traces of ring structure'}
];

MLB.objectLib.objectTypes = [
    {key: 'ASTER', value: 'Asterism'},
    {key: 'BRTNB', value: 'Bright Nebula'},
    {key: 'CL+NB', value: 'Cluster with Nebulosity'},
    {key: 'DRKNB', value: 'Dark Nebula'},
    {key: 'GALCL', value: 'Galaxy cluster'},
    {key: 'GALXY', value: 'Galaxy'},
    {key: 'GLOCL', value: 'Globular Cluster'},
    {key: 'GX+DN', value: 'Diffuse Nebula in a Galaxy'},
    {key: 'GX+GC', value: 'Globular Cluster in a Galaxy'},
    {key: 'G+C+N', value: 'Cluster with Nebulosity in a Galaxy'},
    {key: 'LMCCN', value: 'Cluster with Nebulosity in the LMC'},
    {key: 'LMCDN', value: 'Diffuse Nebula in the LMC'},
    {key: 'LMCGC', value: 'Globular Cluster in the LMC'},
    {key: 'LMCOC', value: 'Open cluster in the LMC'},
    {key: 'NONEX', value: 'Nonexistent'},
    {key: 'OPNCL', value: 'Open Cluster'},
    {key: 'PLNNB', value: 'Planetary Nebula'},
    {key: 'SMCCN', value: 'Cluster with Nebulosity in the SMC'},
    {key: 'SMCDN', value: 'Diffuse Nebula in the SMC'},
    {key: 'SMCGC', value: 'Globular Cluster in the SMC'},
    {key: 'SMCOC', value: 'Open cluster in the SMC'},
    {key: 'SNREM', value: 'Supernova Remnant'},
    {key: 'QUASR', value: 'Quasar'}
];

MLB.objectLib.descriptions = [
    {key: '-', value: '-'},
    {key: '!!!', value: 'a magnificent or otherwise interesting object'},
    {key: '!!', value: 'extremely/very remarkable object'},
    {key: '!', value: 'remarkable object'},
    {key: '?*', value: 'star?'},
    {key: '?', value: '?'},
    {key: '.', value: '.'},
    {key: '\'V\'', value: '\'V\''},
    {key: '\'', value: 'arcminutes'},
    {key: '\"', value: 'arcseconds'},
    {key: '(', value: '('},
    {key: ')', value: ')'},
    {key: '[place?]', value: '[place?]'},
    {key: '@', value: '@'},
    {key: '***', value: 'triple star'},
    {key: '**', value: 'double star'},
    {key: '*', value: 'stars'},
    {key: '/', value: '/'},
    {key: '&', value: 'and'},
    {key: '%', value: '%'},
    {key: '+', value: '+'},
    {key: '=IC', value: '=IC'},
    {key: '=', value: '='},
    {key: '=', value: '='},
    {key: '1/2', value: '1/2'},
    {key: '1st', value: 'first'},
    {key: '2nd', value: 'second'},
    {key: '3rd', value: 'third'},
    {key: '4th', value: 'third'},
    {key: 'about', value: 'about'},
    {key: 'ab', value: 'ab'},
    {key: 'Ab', value: 'about'},
    {key: 'across', value: 'across'},
    {key: 'add', value: 'add'},
    {key: 'ADS', value: 'ADS'},
    {key: 'almost', value: 'almost'},
    {key: 'alm', value: 'almost'},
    {key: 'am', value: 'among'},
    {key: 'and', value: 'and'},
    {key: 'annular', value: 'annular'},
    {key: 'Annular', value: 'annular'},
    {key: 'another', value: 'another'},
    {key: 'anything', value: 'anything'},
    {key: 'apart', value: 'apart'},
    {key: 'appendages', value: 'appendages'},
    {key: 'approx', value: 'approximately'},
    {key: 'appx', value: 'approximately'},
    {key: 'app', value: 'appended'},
    {key: 'arcminutes', value: 'arcminutes'},
    {key: 'arcmin', value: 'arcminute'},
    {key: 'arcseconds', value: 'arcseconds'},
    {key: 'arcsec', value: 'arcseconds'},
    {key: 'arc', value: 'arc'},
    {key: 'area', value: 'area'},
    {key: 'are', value: 'are'},
    {key: 'Arizona', value: 'Arizona'},
    {key: 'arms', value: 'arms'},
    {key: 'around', value: 'around'},
    {key: 'arrowhead', value: 'arrowhead'},
    {key: 'ars', value: 'ars'},
    {key: 'ar', value: 'ar'},
    {key: 'aster', value: 'asterism'},
    {key: 'AS', value: 'AS'},
    {key: 'att.', value: 'attached'},
    {key: 'att', value: 'attached'},
    {key: 'at', value: 'at'},
    {key: 'Auw.', value: 'Auw.'},
    {key: 'Auw', value: 'Auw'},
    {key: 'averted', value: 'averted'},
    {key: 'axis', value: 'axis'},
    {key: 'a', value: 'a'},
    {key: 'A', value: 'A'},
    {key: 'B*around', value: 'bright star around'},
    {key: 'background', value: 'background'},
    {key: 'backrnd', value: 'background'},
    {key: 'backround', value: 'background'},
    {key: 'back', value: 'back'},
    {key: 'bar', value: 'bar'},
    {key: 'beautiful', value: 'beautiful'},
    {key: 'Belt', value: 'Belt'},
    {key: 'Beta', value: 'Beta'},
    {key: 'between', value: 'between'},
    {key: 'bet', value: 'between'},
    {key: 'be', value: 'between'},
    {key: 'bf', value: 'brightest towards the following side'},
    {key: 'bi-N', value: 'binuclear'},
    {key: 'BI-N', value: 'bi-nucleus'},
    {key: 'bin?', value: 'binary?'},
    {key: 'biN?', value: 'binary?'},
    {key: 'binocs-vB', value: 'binoculars - very bright'},
    {key: 'binocs', value: 'binoculars'},
    {key: 'biN', value: 'binuclear'},
    {key: 'Bin', value: 'binary'},
    {key: 'bipolar', value: 'bipolar'},
    {key: 'Bl-Gold', value: 'blue-gold'},
    {key: 'Black--MCG', value: 'Black--MCG'},
    {key: 'black', value: 'black'},
    {key: 'Black', value: 'Black'},
    {key: 'blue-white', value: 'blue-white'},
    {key: 'blue', value: 'blue'},
    {key: 'bn', value: 'brightest towards the north side'},
    {key: 'body', value: 'body'},
    {key: 'both', value: 'both'},
    {key: 'bp', value: 'brightest towards the preceding side'},
    {key: 'branches', value: 'branches'},
    {key: 'branch', value: 'branch'},
    {key: 'brghtness', value: 'brightness'},
    {key: 'brghtnes', value: 'brightness'},
    {key: 'brghtning', value: 'brightning'},
    {key: 'brghtnss', value: 'brightness'},
    {key: 'brighter', value: 'brighter'},
    {key: 'brightest', value: 'brightest'},
    {key: 'brightness', value: 'brightness'},
    {key: 'Brightness', value: 'brightness'},
    {key: 'brilliant', value: 'brilliant'},
    {key: 'brings', value: 'brings'},
    {key: 'broad', value: 'broad'},
    {key: 'brtnb', value: 'bright nebulae'},
    {key: 'BRTNB', value: 'bright nebula'},
    {key: 'brtness', value: 'brightness'},
    {key: 'brtns', value: 'brtns'},
    {key: 'brush', value: 'brush'},
    {key: 'Bstar', value: 'bright star'},
    {key: 'bs', value: 'brightest towards the south side'},
    {key: 'bulge', value: 'bulge'},
    {key: 'but', value: 'but'},
    {key: 'b', value: 'brighter'},
    {key: 'B', value: 'bright'},
    {key: 'Carinae', value: 'Carinae'},
    {key: 'Cass', value: 'Cass'},
    {key: 'cent.', value: 'center'},
    {key: 'cent*', value: 'center star'},
    {key: 'centered', value: 'centered'},
    {key: 'center', value: 'center'},
    {key: 'central', value: 'central'},
    {key: 'centre', value: 'centre'},
    {key: 'centr', value: 'center'},
    {key: 'centstar', value: 'center star'},
    {key: 'cent', value: 'center'},
    {key: 'CGH', value: 'Cape of Good Hope'},
    {key: 'chains', value: 'chains'},
    {key: 'chain', value: 'chain'},
    {key: 'chiefly', value: 'chiefly'},
    {key: 'chief', value: 'chief'},
    {key: 'ch', value: 'chevelure'},
    {key: 'circlet', value: 'circlet'},
    {key: 'circular', value: 'circular'},
    {key: 'CL?', value: 'cluster?'},
    {key: 'close*', value: 'close star'},
    {key: 'closest', value: 'closest'},
    {key: 'close', value: 'close'},
    {key: 'Close', value: 'close'},
    {key: 'cloud', value: 'cloud'},
    {key: 'clusters?', value: 'clusters?'},
    {key: 'clusters', value: 'clusters'},
    {key: 'cluster', value: 'cluster'},
    {key: 'clu', value: 'cluster'},
    {key: 'cl', value: 'cluster'},
    {key: 'Cl', value: 'cluster'},
    {key: 'coarse', value: 'coarse'},
    {key: 'Cocoon', value: 'Cocoon'},
    {key: 'color', value: 'color'},
    {key: 'comet-shaped', value: 'comet-shaped'},
    {key: 'cometary', value: 'cometary'},
    {key: 'cometic', value: 'cometic'},
    {key: 'comet', value: 'comet'},
    {key: 'companions', value: 'companions'},
    {key: 'Completely', value: 'completely'},
    {key: 'complex', value: 'complex'},
    {key: 'comp', value: 'companion'},
    {key: 'com', value: 'cometic'},
    {key: 'connected', value: 'connected'},
    {key: 'conn', value: 'connection'},
    {key: 'contrast', value: 'contrast'},
    {key: 'cont', value: 'in contact'},
    {key: 'core', value: 'in core'},
    {key: 'could', value: 'could'},
    {key: 'counted', value: 'counted '},
    {key: 'couple', value: 'couple'},
    {key: 'covered', value: 'covered'},
    {key: 'co', value: 'coarse/coarsely'},
    {key: 'crescent', value: 'crescent'},
    {key: 'curved', value: 'curved'},
    {key: 'Cygni', value: 'Cygni'},
    {key: 'c', value: 'considerably'},
    {key: 'C', value: 'compressed'},
    {key: 'd\'A', value: 'd\'A'},
    {key: 'D*?', value: 'double star?'},
    {key: 'D*center', value: 'double star in the center'},
    {key: 'dark', value: 'dark'},
    {key: 'Dark', value: 'dark'},
    {key: 'DARK', value: 'dark'},
    {key: 'dbl', value: 'double'},
    {key: 'def.', value: 'defined'},
    {key: 'def', value: 'defined'},
    {key: 'deg/', value: 'degrees at'},
    {key: 'degrees', value: 'degrees'},
    {key: 'deg', value: 'degree'},
    {key: 'Delta', value: 'Delta'},
    {key: 'densestars', value: 'dense stars'},
    {key: 'description', value: 'description'},
    {key: 'Descr', value: 'description'},
    {key: 'detached', value: 'detached'},
    {key: 'diam', value: 'diameter'},
    {key: 'Diam', value: 'diameter'},
    {key: 'difficult', value: 'difficult'},
    {key: 'diffic', value: 'difficult'},
    {key: 'diffuse', value: 'diffuse'},
    {key: 'diff', value: 'difficult'},
    {key: 'dif', value: 'diffused'},
    {key: 'Dif', value: 'difficult'},
    {key: 'DIF', value: 'difficult'},
    {key: 'dim', value: 'dim'},
    {key: 'disc', value: 'disc'},
    {key: 'disk', value: 'disk'},
    {key: 'dist', value: 'distance or distant'},
    {key: 'Dist', value: 'distance'},
    {key: 'Dneb?', value: 'double nebula?'},
    {key: 'double?', value: 'double?'},
    {key: 'double', value: 'double'},
    {key: 'Double', value: 'double'},
    {key: 'doubtful', value: 'doubtful'},
    {key: 'drk', value: 'dark'},
    {key: 'Dstar', value: 'double star'},
    {key: 'Dumbbell', value: 'Dumbbell'},
    {key: 'd', value: 'diameter'},
    {key: 'D', value: 'double'},
    {key: 'E-W', value: 'east-west'},
    {key: 'east', value: 'east'},
    {key: 'easy', value: 'easy'},
    {key: 'edge', value: 'edge'},
    {key: 'ee', value: 'most extremely'},
    {key: 'elliptic', value: 'elliptic'},
    {key: 'elongated', value: 'elongated'},
    {key: 'end', value: 'end'},
    {key: 'entire', value: 'entire'},
    {key: 'Epsilon', value: 'Epsilon'},
    {key: 'er', value: 'easily resolvable'},
    {key: 'ESE', value: 'east south-east'},
    {key: 'Eta', value: 'Eta'},
    {key: 'excellent', value: 'excellent'},
    {key: 'excentric', value: 'excentric'},
    {key: 'exc', value: 'eccentric'},
    {key: 'extends', value: 'extends'},
    {key: 'eye', value: 'eye'},
    {key: 'e', value: 'extremely/excessively'},
    {key: 'E', value: 'elongated/extended'},
    {key: 'F*centre', value: 'faint star center'},
    {key: 'F*in', value: 'faint star in'},
    {key: 'F*W', value: 'F*W'},
    {key: 'fainter-', value: 'fainter-'},
    {key: 'fainter...', value: 'fainter...'},
    {key: 'fainter..', value: 'fainter..'},
    {key: 'fainter.', value: 'fainter.'},
    {key: 'fainter', value: 'fainter'},
    {key: 'faint', value: 'faint'},
    {key: 'falcate', value: 'falcate'},
    {key: 'fan-shaped', value: 'fan-shaped'},
    {key: 'fan-sh', value: 'fan-shaped'},
    {key: 'fan', value: 'fan'},
    {key: 'few', value: 'few'},
    {key: 'fields', value: 'fields'},
    {key: 'field', value: 'field'},
    {key: 'filaments', value: 'filaments'},
    {key: 'fills', value: 'fills'},
    {key: 'fills', value: 'fills'},
    {key: 'filter', value: 'filter'},
    {key: 'filtr', value: 'filter'},
    {key: 'finder', value: 'finder'},
    {key: 'findr', value: 'finder'},
    {key: 'find', value: 'find'},
    {key: 'fine', value: 'fine'},
    {key: 'First', value: 'First'},
    {key: 'following', value: 'following'},
    {key: 'follows', value: 'follows'},
    {key: 'foll', value: 'following'},
    {key: 'forms', value: 'forms'},
    {key: 'found', value: 'found'},
    {key: 'four', value: 'four'},
    {key: 'FOV', value: 'field of view'},
    {key: 'from', value: 'from'},
    {key: 'front', value: 'front'},
    {key: 'Fstar', value: 'faint star'},
    {key: 'fuzzy', value: 'fuzzy'},
    {key: 'fuzz', value: 'fuzz'},
    {key: 'f', value: 'following'},
    {key: 'F', value: 'faint'},
    {key: 'galaxies', value: 'galaxies'},
    {key: 'gals', value: 'galaxies'},
    {key: 'gal', value: 'galaxy'},
    {key: 'Gamma', value: 'Gamma'},
    {key: 'gaseous', value: 'gaseous'},
    {key: 'GC', value: 'Globular Cluster'},
    {key: 'globular', value: 'globular'},
    {key: 'Globular', value: 'Globular'},
    {key: 'glow', value: 'glow'},
    {key: 'good', value: 'good'},
    {key: 'grainy', value: 'grainy'},
    {key: 'Grb', value: 'Grb'},
    {key: 'great', value: 'great'},
    {key: 'Great', value: 'Great'},
    {key: 'green', value: 'green'},
    {key: 'grey-green', value: 'grey-green'},
    {key: 'grey', value: 'grey'},
    {key: 'group!', value: 'group!'},
    {key: 'groups', value: 'groups'},
    {key: 'group', value: 'group'},
    {key: 'gr', value: 'group'},
    {key: 'g', value: 'gradually'},
    {key: 'has', value: 'has'},
    {key: 'haze', value: 'haze'},
    {key: 'hazy', value: 'hazy'},
    {key: 'held', value: 'held'},
    {key: 'helps', value: 'helps'},
    {key: 'help', value: 'help'},
    {key: 'hole', value: 'hole'},
    {key: 'hooked', value: 'hooked'},
    {key: 'hook', value: 'hook'},
    {key: 'horn-shaped', value: 'horn-shaped'},
    {key: 'horseshoe', value: 'horseshoe'},
    {key: 'Horse', value: 'Horse'},
    {key: 'hue', value: 'hue'},
    {key: 'huge', value: 'huge'},
    {key: 'ICF', value: 'ICF'},
    {key: 'IC', value: 'IC'},
    {key: 'if', value: 'if'},
    {key: 'iF', value: 'irregular figure'},
    {key: 'III', value: 'III'},
    {key: 'ill-defined', value: 'ill-defined'},
    {key: 'Ill-defined', value: 'Ill-defined'},
    {key: 'incl', value: 'including'},
    {key: 'inline', value: 'inline'},
    {key: 'inner', value: 'inner'},
    {key: 'Inner', value: 'inner'},
    {key: 'integral-shaped', value: 'integral-shaped'},
    {key: 'invl', value: 'involved/involving'},
    {key: 'involved', value: 'involved'},
    {key: 'invol', value: 'involved'},
    {key: 'inv', value: 'involved/involving'},
    {key: 'Inv', value: 'involved/involving'},
    {key: 'in', value: 'in'},
    {key: 'IN', value: 'IN'},
    {key: 'Irr', value: 'irregular'},
    {key: 'ir', value: 'irregular'},
    {key: 'i', value: 'irregular'},
    {key: 'I', value: 'I'},
    {key: 'just', value: 'just'},
    {key: 'Kappa', value: 'Kappa'},
    {key: 'knots', value: 'knots'},
    {key: 'knotty', value: 'knotty'},
    {key: 'lambda', value: 'lambda'},
    {key: 'lanes', value: 'lanes'},
    {key: 'lane', value: 'lane'},
    {key: 'larger', value: 'larger'},
    {key: 'large', value: 'large'},
    {key: 'last', value: 'last'},
    {key: 'lbs', value: 'pounds'},
    {key: 'leg', value: 'leg'},
    {key: 'lenticular', value: 'lenticular'},
    {key: 'light', value: 'light'},
    {key: 'like', value: 'like'},
    {key: 'Like', value: 'like'},
    {key: 'line', value: 'line'},
    {key: 'little', value: 'little'},
    {key: 'LMC', value: 'Large Magellanic Cloud'},
    {key: 'location', value: 'location'},
    {key: 'long', value: 'long'},
    {key: 'looks', value: 'looks'},
    {key: 'looped', value: 'looped'},
    {key: 'lots', value: 'lots'},
    {key: 'low', value: 'low'},
    {key: 'Low', value: 'low'},
    {key: 'l', value: 'little/long'},
    {key: 'L', value: 'large'},
    {key: 'magnitude', value: 'magnitude'},
    {key: 'mags', value: 'magnitude'},
    {key: 'mag', value: 'magnitude'},
    {key: 'Maia', value: 'Maia'},
    {key: 'Majoris', value: 'Majoris'},
    {key: 'makes', value: 'makes'},
    {key: 'many*', value: 'many stars'},
    {key: 'many', value: 'many'},
    {key: 'masses', value: 'masses'},
    {key: 'mediocre', value: 'mediocre'},
    {key: 'medium', value: 'medium'},
    {key: 'members', value: 'members'},
    {key: 'Merope', value: 'Merope'},
    {key: 'middle', value: 'middle'},
    {key: 'Milky', value: 'Milky'},
    {key: 'miniature', value: 'miniature'},
    {key: 'minor', value: 'minor'},
    {key: 'mm', value: 'mixed magnitudes'},
    {key: 'mn', value: 'milky nebulosity'},
    {key: 'mottled', value: 'mottled'},
    {key: 'much', value: 'much'},
    {key: 'mult', value: 'multiple'},
    {key: 'Musca', value: 'Musca'},
    {key: 'Mu', value: 'Mu'},
    {key: 'm', value: 'much'},
    {key: 'M', value: 'middle'},
    {key: 'N-S', value: 'north-south'},
    {key: 'naked', value: 'naked'},
    {key: 'Naked', value: 'Naked'},
    {key: 'narrow', value: 'narrow'},
    {key: 'nearby', value: 'nearby'},
    {key: 'nearly', value: 'nearly'},
    {key: 'near', value: 'near'},
    {key: 'neb?', value: 'nebulous??'},
    {key: 'neb*', value: 'nebulous star'},
    {key: 'neb&st', value: 'nebula and star'},
    {key: 'nebs?', value: 'nebulous?'},
    {key: 'nebs*', value: 'nebulous star'},
    {key: 'nebstar', value: 'nebulous star'},
    {key: 'nebs', value: 'nebulous'},
    {key: 'nebula', value: 'nebula'},
    {key: 'Nebula', value: 'Nebula'},
    {key: 'Nebula', value: 'Nebula'},
    {key: 'nebulosity', value: 'nebulosity'},
    {key: 'nebulous?', value: 'nebulous?'},
    {key: 'nebulous', value: 'nebulous'},
    {key: 'Nebulous', value: 'nebulous'},
    {key: 'neby?', value: 'nebulosity'},
    {key: 'neby', value: 'nebula'},
    {key: 'Neby', value: 'nebula'},
    {key: 'neb', value: 'nebula'},
    {key: 'Neb', value: 'nebula'},
    {key: 'nf', value: 'north following'},
    {key: 'NGC', value: 'NGC'},
    {key: 'nice', value: 'nice'},
    {key: 'night', value: 'night'},
    {key: 'nonexistent?', value: 'nonexistent?'},
    {key: 'nonexistent', value: 'nonexistent'},
    {key: 'Normae', value: 'Normae'},
    {key: 'north', value: 'north'},
    {key: 'notch', value: 'notch'},
    {key: 'nothing', value: 'nothing'},
    {key: 'not', value: 'not'},
    {key: 'no', value: 'no'},
    {key: 'No', value: 'no'},
    {key: 'np', value: 'north preceding'},
    {key: 'nr', value: 'near'},
    {key: 'Nu-2', value: 'Nu-2'},
    {key: 'Nubec.', value: 'Nubec.'},
    {key: 'nucleus', value: 'nucleus'},
    {key: 'nucl', value: 'nucleus'},
    {key: 'Nucl', value: 'nucleus'},
    {key: 'Nuc', value: 'nucleus'},
    {key: 'n', value: 'north'},
    {key: 'N', value: 'Nucleus or to a Nucleus'},
    {key: 'object', value: 'object'},
    {key: 'obj', value: 'object'},
    {key: 'oblong', value: 'oblong'},
    {key: 'obvious', value: 'obvious'},
    {key: 'of', value: 'of'},
    {key: 'OF', value: 'of'},
    {key: 'one', value: 'one'},
    {key: 'only', value: 'only'},
    {key: 'on', value: 'on'},
    {key: 'Ophiuchi', value: 'Ophiuchi'},
    {key: 'Or*', value: 'orange star'},
    {key: 'orange', value: 'orange'},
    {key: 'orionis', value: 'Orionis'},
    {key: 'Orionis', value: 'Orionis'},
    {key: 'Orion', value: 'Orion'},
    {key: 'or', value: 'or'},
    {key: 'others', value: 'others'},
    {key: 'outer', value: 'outer'},
    {key: 'out', value: 'out'},
    {key: 'oval', value: 'oval'},
    {key: 'O', value: '0'},
    {key: 'parallel', value: 'parallel'},
    {key: 'partly', value: 'partly'},
    {key: 'parts', value: 'parts'},
    {key: 'part', value: 'part'},
    {key: 'patches', value: 'patches'},
    {key: 'patch', value: 'patch'},
    {key: 'pattern', value: 'pattern'},
    {key: 'PA', value: 'position angle'},
    {key: 'pB', value: 'pretty bright'},
    {key: 'pDark', value: 'partly dark'},
    {key: 'perhaps', value: 'perhaps'},
    {key: 'pF', value: 'pretty faint'},
    {key: 'pg', value: 'pretty gradually'},
    {key: 'photosphere', value: 'photosphere'},
    {key: 'place', value: 'place'},
    {key: 'Place', value: 'Place'},
    {key: 'planetary', value: 'planetary'},
    {key: 'Planetary', value: 'planetary'},
    {key: 'plan', value: 'plan'},
    {key: 'Pleiades', value: 'Pleiades'},
    {key: 'pL', value: 'pretty large'},
    {key: 'pm', value: 'pretty much'},
    {key: 'points', value: 'points'},
    {key: 'poor', value: 'poor'},
    {key: 'portion', value: 'portion'},
    {key: 'Possibly', value: 'possible'},
    {key: 'pos', value: 'position'},
    {key: 'Praesepe', value: 'Praesepe'},
    {key: 'Praesepe', value: 'Praesepe'},
    {key: 'preceeding', value: 'preceeding'},
    {key: 'pretty', value: 'pretty'},
    {key: 'probably', value: 'probably'},
    {key: 'prob', value: 'prob'},
    {key: 'prominent', value: 'prominent'},
    {key: 'prominet', value: 'prominent'},
    {key: 'ps', value: 'pretty suddenly'},
    {key: 'pS', value: 'pretty small'},
    {key: 'pts', value: 'points'},
    {key: 'p', value: 'preceding'},
    {key: 'P', value: 'poor'},
    {key: 'quad', value: 'quadrilateral'},
    {key: 'quar', value: 'quartile'},
    {key: 'quite', value: 'quite'},
    {key: 'ray', value: 'ray'},
    {key: 'RA', value: 'RA'},
    {key: 'really', value: 'really'},
    {key: 'regions', value: 'regions'},
    {key: 'Regions', value: 'regions'},
    {key: 'requires', value: 'requires'},
    {key: 'resolvable', value: 'resolvable'},
    {key: 'resolved', value: 'resolved'},
    {key: 'resolv', value: 'resolved'},
    {key: 'RFT', value: 'Richest Field Telescope'},
    {key: 'Rho', value: 'Rho'},
    {key: 'rich', value: 'rich'},
    {key: 'ring', value: 'ring'},
    {key: 'Ring', value: 'Ring'},
    {key: 'Ri', value: 'rich'},
    {key: 'rough', value: 'rough'},
    {key: 'rows', value: 'rows'},
    {key: 'row', value: 'row'},
    {key: 'rrr', value: 'well resolved clearly consisting of stars'},
    {key: 'rr', value: 'partially resolved some stars seen'},
    {key: 'RR', value: 'exactly round'},
    {key: 'ruby*M', value: 'ruby*M'},
    {key: 'ruby', value: 'ruby'},
    {key: 'runs', value: 'runs'},
    {key: 'r', value: 'resolvable (mottled not resolved)'},
    {key: 'R', value: 'round'},
    {key: 's.', value: 's.'},
    {key: 'same', value: 'same'},
    {key: 'scattered', value: 'scattered'},
    {key: 'scatt', value: 'scattered'},
    {key: 'Scorpii', value: 'Scorpii'},
    {key: 'sc', value: 'scattered'},
    {key: 'sec.', value: 'seconds'},
    {key: 'Second', value: 'Second'},
    {key: 'secs.', value: 'seconds'},
    {key: 'sec', value: 'arcseconds'},
    {key: 'seems', value: 'seems'},
    {key: 'seen', value: 'seen'},
    {key: 'Seen', value: 'Seen'},
    {key: 'segment', value: 'segment'},
    {key: 'several', value: 'several'},
    {key: 'sev', value: 'several'},
    {key: 'Seyfert?', value: 'Seyfert?'},
    {key: 'sE', value: 'southeast'},
    {key: 'sf', value: 'south following'},
    {key: 'shaped', value: 'shaped'},
    {key: 'shape', value: 'shape'},
    {key: 'sharp', value: 'sharp'},
    {key: 'sh', value: 'shaped'},
    {key: 'side', value: 'side'},
    {key: 'site', value: 'site'},
    {key: 'size=', value: 'size ='},
    {key: 'slightly', value: 'slightly'},
    {key: 'smaller', value: 'smaller'},
    {key: 'small', value: 'small'},
    {key: 'Small', value: 'small'},
    {key: 'smooth', value: 'smooth'},
    {key: 'SN', value: 'supernova'},
    {key: 'somewhat', value: 'somewhat'},
    {key: 'some', value: 'some'},
    {key: 'south', value: 'south'},
    {key: 'so', value: 'so'},
    {key: 'sparse', value: 'sparse'},
    {key: 'spectrum-Pickering', value: 'spectrum-Pickering'},
    {key: 'spectrum', value: 'spectrum'},
    {key: 'spect', value: 'spect'},
    {key: 'spindle', value: 'spindle'},
    {key: 'spiral-Rosse', value: 'spiral-Rosse'},
    {key: 'spiral', value: 'spiral'},
    {key: 'SPOT!', value: 'spot!'},
    {key: 'spot', value: 'spot'},
    {key: 'sp', value: 'south preceding'},
    {key: 'stars', value: 'stars'},
    {key: 'star', value: 'star'},
    {key: 'steady', value: 'steady'},
    {key: 'stellar', value: 'stellar'},
    {key: 'Stellar', value: 'stellar'},
    {key: 'stell', value: 'stellar'},
    {key: 'stel', value: 'stellar'},
    {key: 'streak', value: 'streak'},
    {key: 'streamer', value: 'streamer'},
    {key: 'strongly', value: 'strongly'},
    {key: 'struct', value: 'struct'},
    {key: 'Struve', value: 'Struve'},
    {key: 'st', value: 'stars'},
    {key: 'superimposed', value: 'superimposed'},
    {key: 'surface', value: 'surface'},
    {key: 'Surface', value: 'surface'},
    {key: 'surf', value: 'surface'},
    {key: 'surrounding', value: 'surrounding'},
    {key: 'surrounds', value: 'surrounds'},
    {key: 'surround', value: 'surround'},
    {key: 'suspected', value: 'suspected'},
    {key: 'susp', value: 'suspected'},
    {key: 'SW', value: 'southwest'},
    {key: 's', value: 'suddenly/south'},
    {key: 'S', value: 'small'},
    {key: 'tails', value: 'tails'},
    {key: 'tail', value: 'tail'},
    {key: 'taken', value: 'taken'},
    {key: 'than', value: 'than'},
    {key: 'Theta', value: 'Theta'},
    {key: 'the', value: 'the'},
    {key: 'The', value: 'The'},
    {key: 'thin', value: 'thin'},
    {key: 'this', value: 'this'},
    {key: 'th', value: 'th'},
    {key: 'tiny', value: 'tiny'},
    {key: 'tip', value: 'tip'},
    {key: 'together', value: 'together'},
    {key: 'tostar', value: 'to star'},
    {key: 'total', value: 'total'},
    {key: 'to', value: 'to'},
    {key: 'train', value: 'train'},
    {key: 'trapezium', value: 'trapezium'},
    {key: 'trapezoid', value: 'trapezoid'},
    {key: 'trap', value: 'trapezium'},
    {key: 'triangle', value: 'triangle'},
    {key: 'triangular', value: 'triangular'},
    {key: 'triang', value: 'triangle'},
    {key: 'Trifid', value: 'Trifid'},
    {key: 'triN', value: 'tri-nuclear'},
    {key: 'triple', value: 'triple'},
    {key: 'tri', value: 'triangle'},
    {key: 'two', value: 'two'},
    {key: 'UHC', value: 'UHC'},
    {key: 'Ursa', value: 'Ursa'},
    {key: 'use', value: 'use'},
    {key: 'var?', value: 'variable?'},
    {key: 'var*', value: 'variable star'},
    {key: 'Var*', value: 'variable star'},
    {key: 'variable', value: 'variable'},
    {key: 'var', value: 'variable'},
    {key: 'vdif', value: 'very difficult'},
    {key: 'verification', value: 'verification'},
    {key: 'verified', value: 'verified'},
    {key: 'very', value: 'very'},
    {key: 'Very', value: 'very'},
    {key: 'vf', value: 'very faint'},
    {key: 'view', value: 'view'},
    {key: 'vision', value: 'vision'},
    {key: 'visual', value: 'visual'},
    {key: 'vizhlp', value: 'vision helpful'},
    {key: 'viz', value: 'vision'},
    {key: 'VS', value: 'VS'},
    {key: 'vv', value: 'very very'},
    {key: 'v', value: 'very'},
    {key: 'V', value: 'V'},
    {key: 'w/2', value: 'with two'},
    {key: 'w/', value: 'with'},
    {key: 'Way', value: 'Way'},
    {key: 'weak', value: 'weak'},
    {key: 'well', value: 'well'},
    {key: 'west', value: 'west'},
    {key: 'winding', value: 'winding'},
    {key: 'wisps', value: 'wisps'},
    {key: 'wisp', value: 'wisp'},
    {key: 'within', value: 'within'},
    {key: 'with', value: 'with'},
    {key: 'w', value: 'with'},
    {key: 'X', value: 'X'},
    {key: 'Yell', value: 'yellow'},
    {key: 'Zeta', value: 'Zeta'},
    {key: 'zigzags??', value: 'zigzags??'}
];

// use this function to generate a sorted descriptions array
MLB.objectLib.sortDescriptions = function () {
    MLB.objectLib.descriptions.sort(function (a, b) {
        var aKey = a.key,
            bKey = b.key;

        // if a is 'foo' and b is 'foobar' then desired sort order is 'foobar then foo'
        // a is shorter than b and a is a subset of b so move a after b
        if (aKey.length < bKey.length && aKey.toLowerCase() === bKey.substr(0, aKey.length).toLowerCase()) {
            return 1;
        }
        // b is shorter than a and b is a subset of a so move a before b
        if (aKey.length > bKey.length && bKey.toLowerCase() === aKey.substr(0, bKey.length).toLowerCase()) {
            return -1;
        }
        return aKey.localeCompare(bKey);
    });

    _.each(MLB.objectLib.descriptions, function (kvp) {
        var fixedKey = kvp.key.replace(/(\"|\')/g, '\\$1'),
            fixedValue = kvp.value.replace(/(\"|\')/g, '\\$1');

        console.log('{key: \'' + fixedKey + '\', value: \'' + fixedValue + '\'},');
    });
};

// remove ending delimiter, eg '; ' (there could be multiple ending delimiters, eg if delimiter = '; ', then ending string could be '; ; ')
MLB.objectLib.fixEnd = function (value, delimiter) {
    var delimiterLength = delimiter.length,
        result = value;

    while (true) {
        if (result.substr(result.length - delimiterLength, delimiterLength) !== delimiter) {
            break;
        }
        result = result.substr(0, result.length - delimiterLength);
    }
    return result;
};

/*
1st entry from abbreviated Saguaro catalog:
{
"OBJECT": "NGC 7831",
"OTHER": "IC 1530",
"TYPE": "GALXY",
"CON": "AND",
"MAG": 12.8,
"SUBR": 12.3,
"SIZE_MAX": "1.5 m",
"SIZE_MIN": "0.3 m",
"CLASS": "Sb",
"NGC_DESCR": "eF;vS;mE;vF*v nr",
"NOTES": ""
},
*/

// for example, " 160 m " and " 40 m"
MLB.objectLib.decodeObjectSize = function (objSize, decimalPoints) {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        objSizeSplit = objSize.split(' ');

    // no uom
    if (objSizeSplit.length === 1) {
        return objSize;
    }
    if (objSizeSplit[1].charAt(0) === 'd') {
        return roundToDecimal(parseFloat(objSizeSplit[0]) * 60, decimalPoints);
    }
    if (objSizeSplit[1].charAt(0) === 'm') {
        return roundToDecimal(parseFloat(objSizeSplit[0]), decimalPoints);
    }
    if (objSizeSplit[1].charAt(0) === 's') {
        return roundToDecimal(parseFloat(objSizeSplit[0]) / 60, decimalPoints);
    }
    // give up
    return objSize;
};

MLB.objectLib.getObjectSize = function (value) {
    var splitValue = value.split(' ');

    if (splitValue.length === 2 && splitValue[1] === 'd') {
        return splitValue[0] + ' degree';
    }
    if (splitValue.length === 2 && splitValue[1] === 'm') {
        return splitValue[0] + ' arc-min';
    }
    if (splitValue.length === 2 && splitValue[1] === 's') {
        return splitValue[0] + ' arc-sec';
    }
    return value;
};

MLB.objectLib.getObjectSizeDeg = function (value) {
    var splitValue = value.replace(/  +/g, ' ').split(' ');

    if (splitValue.length === 2) {
        if (splitValue[1].match(/d/)) {
            return +splitValue[0];
        }
        if (splitValue[1].match(/m/)) {
            return splitValue[0] / 60;
        }
        if (splitValue[1].match(/s/)) {
            return splitValue[0] / 3600;
        }
    }
    return undefined;
};

MLB.objectLib.validMagSurB = function (value) {
    return typeof value === 'number' && value !== 79.9 && value !== 99.9;
};

/*
invalid records:
    ex 1: missing both sizes
        "SIZE_MAX": "",
        "SIZE_MIN": "",
    ex 2: one or more valid sizes but magnitude and surface brightness are both invalid
        "MAG": 79.9,
        "SUBR": 79.9,
        "SIZE_MAX": "60 m",
        "SIZE_MIN": "10 m",
    ex 3: another example of both magnitude and surface brightness being invalid
        "MAG": 99.9,
        "SUBR": 99.9,
        "SIZE_MAX": "8 m",
        "SIZE_MIN": "8 m",
valid record:
    ex 1: minimally necessary info: can calculate surface brightness and minimum size is assumed to be same as maximum size
        "MAG": 13.5,
        "SUBR": 99.9,
        "SIZE_MAX": "72.0 s",
        "SIZE_MIN": "",
*/
// determine if SB can be calculated from a record
MLB.objectLib.validRecordToCalcSurfaceBrightness = function (record) {
    var getObjectSizeDeg = MLB.objectLib.getObjectSizeDeg,
        validMagSurB = MLB.objectLib.validMagSurB;

    // missing both sizes
    if (isNaN(getObjectSizeDeg(record.SIZE_MAX)) && isNaN(getObjectSizeDeg(record.SIZE_MIN)))
        return false;

    // magnitude and surface brightness are both invalid
    if (!validMagSurB(record.MAG) && !validMagSurB(record.SUBR)) {
        return false;
    }

    return true;
};

// try to get SB directly; if not then calculate it
MLB.objectLib.getSurfaceBrightness = function (record, useSB) {
    var calcSurfaceBrightnessFromArea = MLB.calcLib.calcSurfaceBrightnessFromArea,
        getObjectSizeDeg = MLB.objectLib.getObjectSizeDeg,
        maxSizeArcmin,
        minSizeDeg,
        minSizeArcmin;

    if (useSB && typeof record.SUBR === 'number') {
        // SB in Sagurao db is MPAM, not MPAS, so to convert from mag per square arc-min to mag per square arc-sec add 8.63 mag
        return record.SUBR + 8.63;
    }
    maxSizeArcmin = getObjectSizeDeg(record.SIZE_MAX) * 60;
    minSizeDeg = getObjectSizeDeg(record.SIZE_MIN);
    if (typeof minSizeDeg !== 'number') {
        minSizeArcmin = maxSizeArcmin;
    } else {
        minSizeArcmin = minSizeDeg * 60;
    }
    return calcSurfaceBrightnessFromArea(record.MAG, maxSizeArcmin, minSizeArcmin);
};

// this function combines the previous two
MLB.objectLib.getSurfaceBrightnessAndSizeIfPossible = function(record, useSB) {
    var getObjectSizeDeg = MLB.objectLib.getObjectSizeDeg,
        validMagSurB = MLB.objectLib.validMagSurB,
        calcSurfaceBrightnessFromArea = MLB.calcLib.calcSurfaceBrightnessFromArea,
        isMagValid,
        isSBValid,
        isRecordValid,
        maxSizeDeg,
        maxSizeArcmin,
        minSizeDeg,
        minSizeArcmin,
        SB;

    // magnitude and surface brightness are both invalid then cannot compute SB
    isMagValid = validMagSurB(record.MAG);
    isSBValid = validMagSurB(record.SUBR);
    isRecordValid = isMagValid || isSBValid;
    if (!isRecordValid) {
        return false;
    }

    // max size must be valid; ok if min size is missing
    maxSizeDeg = getObjectSizeDeg(record.SIZE_MAX);
    if (maxSizeDeg === undefined) {
        isRecordValid = false;
    }
    if (!isRecordValid) {
        return false;
    }
    maxSizeArcmin = maxSizeDeg * 60;

    minSizeDeg = getObjectSizeDeg(record.SIZE_MIN);
    if (minSizeDeg === undefined) {
        minSizeArcmin = maxSizeArcmin;
    } else {
        minSizeArcmin = minSizeDeg * 60;
    }

    if (useSB && typeof record.SUBR === 'number') {
        // SB in Sagurao db is MPAM, not MPAS, so to convert from mag per square arc-min to mag per square arc-sec add 8.63 mag
        SB = record.SUBR + 8.63;
    } else {
        SB = calcSurfaceBrightnessFromArea(record.MAG, maxSizeArcmin, minSizeArcmin);
    }

    return {
        isValid: isRecordValid,
        SB: SB,
        maxSizeDeg: maxSizeDeg,
        minSizeDeg: minSizeDeg
    };
};

MLB.objectLib.getDetectionLevelForApertureAndBortle = function(apertureInches, BortleLevel, record, useSB) {
    var BortleScale = MLB.BortleScaleJson.BortleScale,
        getSurfaceBrightnessAndSizeIfPossible = MLB.objectLib.getSurfaceBrightnessAndSizeIfPossible,
        addArrayMagnitudes = MLB.calcLib.addArrayMagnitudes,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        calcMagnificationFromApertureAndPupil = MLB.calcLib.calcMagnificationFromApertureAndPupil,
        calcDetectionFromContrastAndObjectApparentSize = MLB.calcLib.calcDetectionFromContrastAndObjectApparentSize,
        eyePupilmm = 7,
        SBAndSize,
        backgroundSB,
        objectSBPlusSkySB,
        contrastPercent,
        magnification,
        detectionLevelNumber;

    SBAndSize = getSurfaceBrightnessAndSizeIfPossible(record, useSB);
    if (!SBAndSize) {
        return false;
    }

    backgroundSB = BortleScale[BortleLevel - 1].MPAS;
    objectSBPlusSkySB = addArrayMagnitudes([SBAndSize.SB, backgroundSB]),
    contrastPercent = (getIllumFromMagnitude(objectSBPlusSkySB - backgroundSB) - 1) * 100;
    magnification = calcMagnificationFromApertureAndPupil(apertureInches * 25.4, eyePupilmm);
    detectionLevelNumber = calcDetectionFromContrastAndObjectApparentSize(contrastPercent, SBAndSize.maxSizeDeg * magnification);

    return {
        objectSB: SBAndSize.surfaceBrightness,
        backgroundSB: backgroundSB,
        objectSBPlusSkySB: objectSBPlusSkySB,
        contrastPercent: contrastPercent,
        detectionLevelNumber: detectionLevelNumber
    };
};

// for example, "NGC 1499 | 5 | 160 m | 40 m"
MLB.objectLib.createObjectFieldsString = function (astroObj) {
    return astroObj.OBJECT
            + ' | '
            + astroObj.MAG
            + ' | '
            + astroObj.SIZE_MAX
            + ' | '
            + astroObj.SIZE_MIN;
};

MLB.objectLib.createObjectDescriptionString = function (astroObj) {
    var getCatalogs = MLB.objectLib.getCatalogs,
        getObjectType = MLB.objectLib.getObjectType,
        getObjectSize = MLB.objectLib.getObjectSize,
        getConstellation = MLB.objectLib.getConstellation,
        getClassificationFrom = MLB.objectLib.getClassificationFrom,
        getDescription = MLB.objectLib.getDescription;

    return 'Name: '
            + astroObj.OBJECT
            + ' / '
            + astroObj.OTHER
            + ' Mag: '
            + astroObj.MAG
            + ' SurfBright: '
            + astroObj.SUBR
            + ' Size: '
            + getObjectSize(astroObj.SIZE_MAX)
            + ' x '
            + getObjectSize(astroObj.SIZE_MIN)
            //+ ' Catalogs: '
            //+ getCatalogs(astroObj.OTHER)
            + ' Type: '
            + getObjectType(astroObj.TYPE)
            + ' Con: '
            + getConstellation(astroObj.CON)
            //+ ' Class: '
            //+ getClassificationFrom(astroObj.TYPE, astroObj.CLASS)
            + ' Descr: '
            + getDescription(astroObj.NGC_DESCR)
            //+ ' Notes: '
            //+ astroObj.NOTES
            ;
};

MLB.objectLib.filterObjectCatalog = function (catalog, searchStr) {
    var regEx = new RegExp(searchStr, 'gi');

    return catalog.filter(rec => rec.OBJECT.match(regEx) || rec.OTHER.match(regEx));
};

MLB.objectLib.getConstellation = function (key) {
    var keyValue = _.findWhere(MLB.objectLib.constellations, {key: key});

    if (keyValue !== undefined) {
        return MLB.sharedLib.capitalizeFirstLetterOnly(keyValue.value);
    }
    return undefined;
};

MLB.objectLib.getCatalogs = function (value) {
    var fixEnd = MLB.objectLib.fixEnd,
        catalogs = MLB.objectLib.catalogs,
        splitValue,
        keyValue,
        result = '';

    // space or semicolon
    splitValue = value.split(/ |;/);
    _.each(splitValue, function (str) {
        keyValue = _.findWhere(catalogs, {key: str});
        if (keyValue !== undefined) {
            result += keyValue.value + '; ';
        }
    });
    return fixEnd(result, '; ');
};

MLB.objectLib.getObjectType = function (key) {
    var number,
        result,
        starIx = key.indexOf('STAR');

    // eg, '2STAR' should result in '2 stars'
    if (starIx > -1) {
        number = parseInt(key.slice(0, starIx), 10);
        result = number + ' star';
        if (number > 1) {
            result += 's';
        }
        return result;
    }
    return _.findWhere(MLB.objectLib.objectTypes, {key: key}).value;
};

MLB.objectLib.getClassificationFrom = function (type, value) {
    var convertRomanNumeral = MLB.objectLib.convertRomanNumeral,
        openClusters = MLB.objectLib.openClusters,
        descriptions = MLB.objectLib.descriptions,
        galaxies = MLB.objectLib.galaxies,
        AbellRichness = MLB.objectLib.AbellRichness,
        AbellDistance = MLB.objectLib.AbellDistance,
        BautzMorgan = MLB.objectLib.BautzMorgan,
        ellipticals = MLB.objectLib.ellipticals,
        spirals = MLB.objectLib.spirals,
        planetaries = MLB.objectLib.planetaries,
        planetaries2 = MLB.objectLib.planetaries2,
        planetaries3 = MLB.objectLib.planetaries3,
        getDescription = MLB.objectLib.getDescription,
        fixEnd = MLB.objectLib.fixEnd,
        delimiter,
        delimiterToAdd,
        workingValue,
        splitValue,
        remainingValue,
        splitValueSansEmptyString,
        number,
        keyValue,
        keyInitialChar,
        galaxyType,
        planetaryType,
        found = true,
        result = '',

        // reused functionality using function level vars (result, delimiterToAdd, keyValue, workingValue)
        addToResult = function () {
            result += keyValue.value + delimiterToAdd;
        },
        updateWorkingValue = function () {
            workingValue = workingValue.replace(keyValue.key, '').trim();
        },
        findAndAddValueToResult = function (keyToFind) {
            keyValue = _.findWhere(descriptions, {key: keyToFind});
            if (keyValue !== undefined) {
                addToResult();
                return true;
            }
            return false;
        },
        // look for match where workingValue begins with key
        lookup = function (keyValueLookup) {
            return _.find(keyValueLookup, function (kvp) {
                var keyLength = kvp.key.length;
                // length of workingValue cannot be less than that of the key, ie, workingValue = 'abc' and key = 'ab' is fine, but workingValue = 'ab' and key = 'abc' is not valid
                return workingValue.length < keyLength ? undefined : workingValue.substr(0, keyLength) === kvp.key;
            });
        },
        // perfect match lookup
        perfectMatch = function (lookupTable, key) {
            keyValue = _.findWhere(lookupTable, {key: key});
            if (keyValue !== undefined) {
                result += keyValue.value;
            }
        },
        processSubLookup = function (lookupTable) {
            keyValue = lookup(lookupTable);
            if (keyValue === undefined) {
                found = false;
            } else {
                addToResult();
                updateWorkingValue();
            }
        },
        lookupPlanetaryDetail = function (lookupTable, key, planetaryTypeToMatch, limit) {
            if (planetaryType === planetaryTypeToMatch && key >= 'a' && key <= limit) {
                keyValue = _.findWhere(lookupTable, {key: key});
                if (keyValue !== undefined) {
                    result += ' with ' + keyValue.value;
                    return true;
                }
            }
            return false;
        };

    // nonexistent
    if (type === 'NONEX') {
        return '';
    }

    // stars (value is empty)
    // eg, '1STAR'
    if (type.indexOf('STAR') > -1) {
        return 'star(s)';
    }

    // if value all spaces then return empty string (match for any non-whitespace char)
    if (value.match(/\S/) === null) {
        return '';
    }

    // open cluster - Trumpler type: concentration, brightness range and richness, n=nebulosity present
    // eg 'E+R ', 'III 1p :a  ''IV 1 p     '
    if (type === 'OPNCL' || type === 'CL+NB' || type === 'ASTER') {
        // space, comma, semicolon, plus
        delimiter = / |,|;|\+/;
        delimiterToAdd = '; ';
        workingValue = value;
        while (found) {
            keyValue = _.find(openClusters, function (kvp) { return workingValue.indexOf(kvp.key) > -1; });
            if (keyValue === undefined) {
                // if open cluster key/value not found, then look in descriptions; create an array without empty strings and search for description keys that match
                splitValue = workingValue.split(delimiter);
                splitValueSansEmptyString = splitValue.filter(function (s) { return s !== ''; });
                keyValue = _.findWhere(descriptions, {key: splitValueSansEmptyString[0]});
            }
            if (keyValue === undefined) {
                found = false;
            } else {
                if (keyValue.value !== delimiterToAdd) {
                    addToResult();
                }
                updateWorkingValue();
            }
        }
        return fixEnd(result, delimiterToAdd);
    }

    // galaxy - Hubble type with differing details depending on type
    // eg 'S(B)dm', 'E+*', 'SB/P', 'SBO-a', 'Elliptical'
    if (type === 'GALXY' || type === 'G+C+N') {
        delimiter = ' ';
        delimiterToAdd = ' ';
        workingValue = value.toLowerCase();
        while (found) {
            keyValue = lookup(galaxies);
            // if we didn't find the key, then look in the elliptical and spiral details
            if (keyValue === undefined) {
                if (galaxyType === 'e') {
                    processSubLookup(ellipticals);
                } else if (galaxyType === 's') {
                    processSubLookup(spirals);
                } else {
                    found = false;
                }
            } else {
                if (keyValue.value !== delimiter) {
                    addToResult();
                }
                updateWorkingValue();
                // set galaxyType
                keyInitialChar = keyValue.key[0];
                if (keyInitialChar === 'e' || keyInitialChar === 's') {
                    galaxyType = keyInitialChar;
                }
            }
        }
        return fixEnd(result, delimiter);
    }

    // Abell galaxy clusters - Abell assigned numbers as follows: 1st number = distance value, 2nd number = assigned richness value, 3rd number = Bautz-Morgan classification
    // eg, '0 1 II', '2 3 III', '2 0 II-III'
    if (type === 'GALCL') {
        delimiter = ' ';
        workingValue = value;
        splitValue = workingValue.split(delimiter);
        if (splitValue.length > 0) {
            perfectMatch(AbellRichness, splitValue[0]);
        }
        if (splitValue.length > 1) {
            result += ', ';
            perfectMatch(AbellDistance, splitValue[1]);
        }
        if (splitValue.length > 2) {
            result += ', ';
            perfectMatch(BautzMorgan, splitValue[2]);
        }
        return result;
    }

    // planetary nebula - Vorontsov-Velyaminov type (1-6) with types 2 and 3 having different detail (denoted by a,b,c and a,b respectively)
    // eg '3b(2) ', ''2(2a)'
    if (type === 'PLNNB') {
        workingValue = value.trim();
        splitValue = workingValue.split('');
        _.each(splitValue, function (c) {
            keyValue = _.findWhere(planetaries, {key: c});
            if (keyValue !== undefined) {
                result += keyValue.value;
                planetaryType = c;
                // if we didn't find the key, then look in the detail tables; lookupPlanetaryDetail function includes guard statements so that the function can be chained
            } else if (!lookupPlanetaryDetail(planetaries2, c, '2', 'c') && !lookupPlanetaryDetail(planetaries3, c, '3', 'b')) {
                result += c;
            }
        });
        // get rid of possible trailing space, eg, 'aaa (bbb) '
        return result.trim();
    }

    // globular cluster - Shapley-Sawyer concentration rating for globular clusters, values range from 1 to 12, smaller numbers are more concentrated clusters
    // eg 'XI '
    if (type === 'GLOCL') {
        workingValue = value.trim();
        return 'concentration is ' + convertRomanNumeral(workingValue) + ' (1 is most concentrated, 12 is least concentrated)';
    }

    // dark nebula - opacity followed by descriptions
    // eg, '6 Co G '
    if (type === 'DRKNB') {
        delimiter = ' ';
        delimiterToAdd = '; ';
        workingValue = value.split(' ');
        if (value.length > 0) {
            number = parseInt(value[0], 10);
            if (!isNaN(number)) {
                result += 'opacity of ' + number + delimiterToAdd;
            }
            // go through the remaining space delimited values which should be descriptions, adding them as they are found (try case as given before trying lower case)
            remainingValue = workingValue.splice(1);
            _.each(remainingValue, function (str) {
                if (!findAndAddValueToResult(str)) {
                    findAndAddValueToResult(str.toLowerCase());
                }
            });
        }
        return fixEnd(result, delimiterToAdd);
    }

    // for the following, value can be eg, 'E' or 'R' or 'E+R' or 'E+*' or '2' or 'V' et al
    if (type === 'BRTNB'
            || type === 'GX+DN'
            || type === 'LMCCN'
            || type === 'LMCDN'
            || type === 'LMCGC'
            || type === 'LMCOC'
            || type === 'SMCCN'
            || type === 'SMCDN'
            || type === 'SMCGC'
            || type === 'SMCOC'
            || type === 'SNREM') {

        return getDescription(value);
    }

    return 'unknown value: ' + value + ' type: ' + type;
};

MLB.objectLib.noMatch = '';
MLB.objectLib.matchByChar = [];

MLB.objectLib.displayMatchByChar = function () {
    _.each(MLB.objectLib.matchByChar, function (str) {
        console.log(str);
    });
};

MLB.objectLib.clearMatchByChar = function () {
    MLB.objectLib.matchByChar = [];
};

// from Sacdoc.txt and http://obs.nineplanets.org/ngc.html and inspecting descriptions in Saguaro catalog
MLB.objectLib.getDescription = function (value) {
    var trimmedValue = value.trim(),
        description = MLB.objectLib.getDescriptionStrategy(trimmedValue),
        fixedTrimmedValue = trimmedValue.replace(/(\"|\')/g, '\\$1'),
        fixedDescription = description.replace(/(\"|\')/g, '\\$1');
/*
    console.log('       expected = \'' + fixedDescription + '\';');
    console.log('       result = getDescription(\'' + fixedTrimmedValue + '\');');
    console.log('       equal(result, expected, result + \' should be \' + expected);');
    console.log('');
*/
/*
    if (MLB.objectLib.noMatch.length > 0) {
        _.each(MLB.objectLib.noMatch.split('|'), function (str) {
            console.log('!match | ' + str + ' | in | ' + trimmedValue + ' | result | ' + description);
        });
        MLB.objectLib.noMatch = '';
    }
*/
/*
    if (MLB.objectLib.noMatch.length > 0) {
        console.log('!match | ' + MLB.objectLib.noMatch + ' | in | ' + trimmedValue + ' | result | ' + description);
        MLB.objectLib.noMatch = '';
    }
*/
    return description;
};

MLB.objectLib.getDescriptionStrategy = function (value) {
    var descriptions = MLB.objectLib.descriptions,
        getConstellation = MLB.objectLib.getConstellation,
        getDescriptionStrategy = MLB.objectLib.getDescriptionStrategy,
        fixedValue,
        delimitedValue,
        parsedValue,
        postGetDescriptionValue,
        keyValue,
        keyLength,
        constellation,
        matchCharStr,
        matchCharResults,
        buildResult,
        result = '',
        postGetDescriptionResult = '',
        finalResult,

        matched = function () {
            if (MLB.objectLib.noMatch.length > 0 && MLB.objectLib.noMatch.slice(-1) !== '|') {
                MLB.objectLib.noMatch += '|';
            }
            return 0;
        },
        // match leading chars of str to key
        matchStartingChars = function (kvp) {
            keyLength = kvp.key.length;
            // length of matchCharStr cannot be less than that of the key, ie, matchCharStr = 'abc' and key = 'ab' is fine, but matchCharStr = 'ab' and key = 'abc' is not valid
            return matchCharStr.length < keyLength ? undefined : matchCharStr.substr(0, keyLength) === kvp.key;
        },
        // search function in the form of a chain of responsibility implemented with guards in order to avoid structural nesting
        // the caller of this function returns 'finalResult' so the guards return value is ignored
        search = function (str) {
            // str can be empty string
            if (str.length === 0) {
                return matched();
            }
            // check for space
            if (str === ' ') {
                result += str;
                return matched();
            }
            // check for a delimiter (comma or semicolon) (because of the initial split, delimiters will always be found by themselves)
            if (str.match(/,|;/) !== null) {
                result = result.trim() + str;
                return matched();
            }
            // check for elongated with position angle, eg, 'E50' translates to 'elongated in position angle 50 degrees'
            if (str.match(/^E(\d+)$/) !== null) {
                result += str.replace(/E(\d+)/, 'elongated in position angle $1 degrees ');
                return matched();
            }
            // if starts with a digit, optionally has a decimal point and ends in a digit with an optional 'th' (covers 7 or 12.3 or 9th) then add what's there and return
            if (str.match(/^\d+\.?\d*(th)?$/) !== null) {
                result += str;
                return matched();
            }
            // eg, 135X already decoded
            if (str.match(/\d+[x|X]/) !== null) {
                result += str;
                return matched();
            }
            // break apart numbers and chars, eg '2or3' becomes '2 or 3' but not if the number is followed by an 'm', eg, '11m'
            if (str.match(/\d+\w/) !== null && str.match(/\d+[m|M]/) === null) {
                parsedValue = str.replace(/(\d+)/g, ' $1 ');
                result += getDescriptionStrategy(parsedValue);
                return matched();
            }
            // try matching with descriptions
            keyValue = _.findWhere(descriptions, {key: str});
            if (keyValue !== undefined) {
                result += keyValue.value;
                return matched();
            }
            // try matching constellations
            constellation = getConstellation(str.toUpperCase());
            if (constellation !== undefined) {
                result += constellation;
                return matched();
            }

            // no match found for 'str', so try matching characters, starting with longest key possible
            if (!_.contains(MLB.objectLib.matchByChar, str)) {
                MLB.objectLib.matchByChar.push(str);
            }
            buildResult = '';
            matchCharStr = str;
            while (matchCharStr.length > 0) {
                // numbers OK
                if (matchCharStr.substr(0, 1).match(/\d/) !== null) {
                    buildResult += matchCharStr.substr(0, 1);
                    matchCharStr = matchCharStr.substr(1);
                // dash OK; add space after
                } else if (matchCharStr.substr(0, 1).match(/-/) !== null) {
                    buildResult += matchCharStr.substr(0, 1) + ' ';
                    matchCharStr = matchCharStr.substr(1);
                // else not a number leading the string
                } else {
                    matchCharResults = _.find(descriptions, matchStartingChars);
                    if (matchCharResults === undefined) {
                        result += str;
                        MLB.objectLib.noMatch += str;
                        return 0;
                    }
                    buildResult += matchCharResults.value + ' ';
                    matchCharStr = matchCharStr.substr(matchCharResults.key.length);
                }
            }
            result += buildResult;
        };

    fixedValue = value
        // sometimes shorthand is '!  B': fix to be '!, B'
        .replace(/! {1,}B/, '!, B')
        // make sure that '+' is always separated by spaces
        .replace(/\+/, ' + ')

        // 4'.5 is 4.5 arcminutes, ditto for arcseconds
        .replace(/(\d)\'\.(\d+)/, '$1.$2 arcminutes ')
        .replace(/(\d)\"\.(\d+)/, '$1.$2 arcseconds ')

        // 4' or 4" should be "4 '" or '4 "' respectively
        .replace(/(\d)('|")/, '$1 $2')
        // "''" is arcseconds
        .replace(/\'\'/, ' arcseconds ')

        // magnitude range:
        // 'st 9 13' translates to 'stars from 9th to 13th magnitude'
        .replace(/st\s(\d+)\s(\d+)/, 'stars from $1th to $2th magnitude')
        // 'st 9..13' or 'st 9...13' translates to 'stars from 9th to 13th magnitude'
        .replace(/st\s(\d+)\.\.+(\d+)/, 'stars from $1th to $2th magnitude')
        // '*9..13' or '* 9..13' or '*9...13' translates to 'stars from 9th to 13th magnitude'
        .replace(/\*\s?(\d+)\.\.+(\d+)/, 'stars from $1th to $2th magnitude')
        // 'st 8 ' translates to 'stars 9th magnitude and fainter'
        .replace(/st\s(\d+)/, 'stars $1th magnitude and fainter')
        // '9..13' translates to '9th to 13th magnitude'
        .replace(/(\d+)\.{2,}(\d+)/, '$1th to $2th magnitude')
        // '8..' translates to '8th magnitude and fainter'
        .replace(/(\d+)\.{2,}/, '$1th magnitude and fainter')

        // '7*' or '7 *' is 7 stars
        .replace(/(\d+)\s*\*/, '$1 stars ')

        // check for magnitude:
        // '*10' and '* 10' translates to 'star of 10th magnitude' (note the space that sometimes occurs),
        // '*12.3' translates to 'star of 12.3th magnitude',
        // '* 7 mag ' translates to 'star of 7th magnitude'
        // '*11foo' translates to star of 11th magnitude followed by the translation of 'foo'
        // execute the dd.d replace before the dd replace because the dd replace cannot handle the '.'
        .replace(/\*\s*(\d+\.\d+)(\s*mag)?/, 'star of $1 magnitude ')
        .replace(/\*\s*(\d+)(\s*mag)?/, 'star of $1th magnitude ')
        // '11.5m' translates to 11.5 magnitude' and '11m' translates to '11th magnitude'
        .replace(/\s*(\d+\.\d+)m/, ' $1 magnitude')
        .replace(/\s*(\d+)m/, ' $1th magnitude')

        // 'dist' not always separated by spaces; place after magnitude checks above because of values like "*9dist2'"
        .replace(/(dist)/, ' $1 ');

        // start of main search strategy...
    // by placing the delimiters in a group, the delimiters are included
    delimitedValue = fixedValue.split(/(;|,| |\(|\))/);
    _.each(delimitedValue, search);
    // ...end of main search strategy

    // every delimiter should be followed by a space; () means to include the delimiters
    postGetDescriptionValue = result.split(/(, |; |,|;)/);
    postGetDescriptionResult = '';
    _.each(postGetDescriptionValue, function (str) {
        postGetDescriptionResult += str;
        if (str.match(/,|;/) !== null) {
            postGetDescriptionResult += ' ';
        }
    });
    // fix remaining issues
    finalResult = postGetDescriptionResult
        // replace two or more spaces with a single space
        .replace(/\s{2,}/g, ' ')
        // remove spaces from: number '/' number, ie, '8/10'
        .replace(/(\d)\s\/\s(\d)/, '$1/$2')
        .trim();

    return finalResult;
};

/*
MLB.Saguaro81.Saguaro81 record:
BCHM: ""
BRSTR: ""
CLASS: "Sb"
CON: "AND"
DEC: "+32 37"
MAG: 12.8
NGC DESCR: "eF;vS;mE;vF*v nr"
NOTES: ""
NSTS: ""
OBJECT: "NGC 7831"
OTHER: "IC 1530"
PA: 38
RA: "00 07.3"
SIZE_MAX: "1.5 m"
SIZE_MIN: "0.3 m"
SUBR: 12.3
TI: 4
TYPE: "GALXY"
U2K: 89
*/

MLB.objectLib.getEquatRadFromCatalogRec = function (rec) {
    var convertHMSMToRad = MLB.coordLib.convertHMSMToRad,
        convertDMSMToRad = MLB.coordLib.convertDMSMToRad,
        RAarray,
        DECarray,
        RArad,
        DECrad;

    RAarray = rec.RA.split(' ');
    DECarray = rec.DEC.split(' ');
    RArad = convertHMSMToRad(+RAarray[0], +RAarray[1], 0, 0);
    DECrad = convertDMSMToRad(+DECarray[0], +DECarray[1], 0, 0);
    return {
        RA: RArad,
        Dec: DECrad
    };
};

MLB.objectLib.buildGroupObjectStr = function (group) {
    var groupStr = '';

    group.forEach((rec) => {
        // get rid of multiple spaces
        groupStr += rec.rec.OBJECT.replace(/  +/g, ' ')
                + ' / '
                + rec.rec.OTHER.replace(/  +/g, ' ')
                + ' / '
                + rec.rec.TYPE
                + ', ';
    });

    return groupStr;
};

MLB.objectLib.findClosestObjects = function (minCount, minNonGalaxyCount, maxDistanceDeg, minMagnitude, minDecDeg, allowedTypes) {
    var calcAngularSepUsingRaDec = MLB.coordLib.calcAngularSepUsingRaDec,
        getEquatRadFromCatalogRec = MLB.objectLib.getEquatRadFromCatalogRec,
        buildGroupObjectStr = MLB.objectLib.buildGroupObjectStr,
        catalog = MLB.Saguaro81.Saguaro81,
        catalogLength = catalog.length,
        ixA,
        ixB,
        recA,
        recB,
        equatA,
        equatB,
        uom = MLB.sharedLib.uom,
        angularSepDeg,
        nonGalaxyCount,
        allowedType,
        group,
        groups = [],
        groupsStr,
        groupsStr2,
        groupsStr3,
        groupsStr4,
        objectsA,
        objectsB,
        include,
        gStrSplit,
        ixG,
        types,
        typesNoDup,
        reason;

    console.log('\nstarting findClosestObjects...');
    for (ixA = 0; ixA < catalogLength; ixA += 1) {
        nonGalaxyCount = 0;
        group = [];
        recA = catalog[ixA];
        if (allowedTypes !== undefined) {
            allowedType = allowedTypes.some((type, index) => {
                return recA.TYPE === type;
            });
        } else {
            allowedType = true;
        }
        if (!allowedType) {
            continue;
        }
        if (+recA.MAG > minMagnitude) {
            continue;
        }
        if (minDecDeg !== undefined && +recA.DEC.split(' ')[0] < minDecDeg) {
            continue;
        }
        equatA = getEquatRadFromCatalogRec(recA);
        group.push({rec: recA, sep: 0});
        if (recA.TYPE !== 'GALXY') {
            nonGalaxyCount += 1;
        }
        for (ixB = 0; ixB < catalogLength; ixB += 1) {
            if (ixA === ixB) {
                continue;
            }
            recB = catalog[ixB];
            if (allowedTypes !== undefined) {
                allowedType = allowedTypes.some((type, index) => {
                    return recB.TYPE === type;
                });
            } else {
                allowedType = true;
            }
            if (!allowedType) {
                continue;
            }
            if (+recB.MAG > minMagnitude) {
                continue;
            }
            if (minDecDeg !== undefined && +recB.DEC.split(' ')[0] < minDecDeg) {
                continue;
            }
            equatB = getEquatRadFromCatalogRec(recB);
            angularSepDeg = calcAngularSepUsingRaDec(equatA.RA, equatA.Dec, equatB.RA, equatB.Dec) / uom.degToRad;
            if (angularSepDeg <= maxDistanceDeg) {
                group.push({rec: recB, sep: angularSepDeg});
                if (recB.TYPE !== 'GALXY') {
                    nonGalaxyCount += 1;
                }
            }
        }
        if (group.length >= minCount && (minNonGalaxyCount === undefined || (minNonGalaxyCount !== undefined && nonGalaxyCount >= minNonGalaxyCount))) {
            group.sort((a, b) => {
                return b.rec.OBJECT < a.rec.OBJECT? 1: -1;
            });
            groups.push({group});
        }
    }
    // alphanumeric sort
    groups.sort((a, b) => {
        return buildGroupObjectStr(a.group) > buildGroupObjectStr(b.group)? 1: -1;
    });
    // convert to strings for easier manipulation...
    groupsStr = groups.map((group) => {
        return buildGroupObjectStr(group.group);
    });
    // remove dups
    groupsStr2 = [...new Set(groupsStr)];
    // remove naive subset dups (does NOT catch cases of 'a, b, d, ' included in 'a, b, c, d')
    groupsStr3 = groupsStr2.filter((groupStr, ix, groupsStr2) => {
        if (ix < groupsStr2.length - 1) {
            return !groupsStr2[ix + 1].includes(groupStr);
        }
        return true;
    });
    //console.log('before removing any smaller group with an object found in a larger group...');
    //groupsStr3.forEach((gStr, ix) => {
    //    console.log('group ' + ix + ': ' + gStr);
    //});
    // remove any subsequent groups that have an object found in a subsequent larger group...
    groupsStr4 = groupsStr3.filter(gStr => {
        include = true;
        // remove last ', '
        objectsA = gStr.slice(0, -2).split(',');
        for (let objA of objectsA) {
            for (let gStr2 of groupsStr3) {
                // don't compare with same rec
                if (gStr === gStr2) {
                    continue;
                }
                // only test smaller of the two...
                if (gStr.length > gStr2.length) {
                    continue;
                }
                // remove last ', '
                objectsB = gStr2.slice(0, -2).split(',');
                for (let objB of objectsB) {
                    if (objA === objB) {
                        //reason = 'removing ' + gStr + ' because ' + objA + ' matches ' + objB + ' in ' + gStr2;
                        include = false;
                        break;
                    }
                }
                if (!include) {
                    break;
                }
            }
            if (!include) {
                break;
            }
        }
        if (!include) {
            //console.log(reason);
        }
        return include;
    });
    console.log('final object cluster list');
    groupsStr4.forEach((gStr, ix) => {

        // every 3rd is the type, eg, NGC 3338 / UGC 5826 / GALXY
        types = [];
        gStrSplit = gStr.split(',');
        for (ixG = 0; ixG < gStrSplit.length; ixG += 1) {
            types.push(gStrSplit[ixG].split('/')[2]);
        }
        typesNoDup = [...new Set(types)];

        console.log('\ngroup '
                + ix
                + ' (count of '
                + gStr.slice(0, -2).split(',').length
                + '), (types:'
                + typesNoDup.join()
                + '): '
                + gStr);
    });
    console.log('\n...ending findClosestObjects');
    return groupsStr4;
};

// end of file
