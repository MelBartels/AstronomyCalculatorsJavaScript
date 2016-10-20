// copyright Mel Bartels, 2012-2014

'use strict';

MLB.diopterToFocalLengthConverter = {};

MLB.diopterToFocalLengthConverter.common = {
    // helper functions
    convertUomToInches: function (imperial, uom) {
        return imperial
            ? uom
            : uom / 25.4;
    },
    convertInchesToUom: function (imperial, inches) {
        return imperial
            ? inches
            : inches * 25.4;
    },
    // telescope...
    btnUomT: function () {
        return $('[name=btnUomT]');
    },
    imperialT: function () {
        return this.btnUomT()[0].checked;
    },
    btnConvertDiopterToFocalLengthT: function () {
        return $('[id=btnConvertDiopterToFocalLengthT]');
    },
    btnConvertFocalLengthToDiopterT: function () {
        return $('[id=btnConvertFocalLengthToDiopterT]');
    },
    diopterT: function () {
        return $('[name=diopterT]');
    },
    diopterTVal: function () {
        return +this.diopterT().val();
    },
    focalLengthT: function () {
        return $('[name=focalLengthT]');
    },
    focalLengthTVal: function () {
        return +this.focalLengthT().val();
    },
    btnUomE: function () {
        return $('[name=btnUomE]');
    },
    // eyepiece...
    imperialE: function () {
        return this.btnUomE()[0].checked;
    },
    btnConvertDiopterToFocalLengthE: function () {
        return $('[id=btnConvertDiopterToFocalLengthE]');
    },
    btnConvertFocalLengthToDiopterE: function () {
        return $('[id=btnConvertFocalLengthToDiopterE]');
    },
    diopterE: function () {
        return $('[name=diopterE]');
    },
    diopterEVal: function () {
        return +this.diopterE().val();
    },
    focalLengthE: function () {
        return $('[name=focalLengthE]');
    },
    focalLengthEVal: function () {
        return +this.focalLengthE().val();
    },
    // results...
    results: function () {
        return $('[id=results]');
    }
};

MLB.diopterToFocalLengthConverter.writeResults = function () {
    var common = MLB.diopterToFocalLengthConverter.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal;

    common.results().html('Eyepiece diopter divided by telescope diopter = '
            + roundToDecimal(common.diopterEVal() / common.diopterTVal(), 0)
            + ' power');
};

MLB.diopterToFocalLengthConverter.calcFocalLength = function (imperial, diopter) {
    var common = MLB.diopterToFocalLengthConverter.common,
        calcFocalLengthInches = MLB.calcLib.calcFocalLengthInches,
        focalLengthInches = calcFocalLengthInches(diopter);

    return common.convertInchesToUom(imperial, focalLengthInches);
};

MLB.diopterToFocalLengthConverter.calcFocalLengthT = function () {
    var common = MLB.diopterToFocalLengthConverter.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcFocalLength = MLB.diopterToFocalLengthConverter.calcFocalLength,
        writeResults = MLB.diopterToFocalLengthConverter.writeResults,
        focalLengthInches = calcFocalLength(common.imperialT(), common.diopterTVal());

    common.focalLengthT().val(roundToDecimal(focalLengthInches, 2));
    writeResults();
};

MLB.diopterToFocalLengthConverter.calcFocalLengthE = function () {
    var common = MLB.diopterToFocalLengthConverter.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcFocalLength = MLB.diopterToFocalLengthConverter.calcFocalLength,
        writeResults = MLB.diopterToFocalLengthConverter.writeResults,
        focalLengthInches = calcFocalLength(common.imperialE(), common.diopterEVal());

    common.focalLengthE().val(roundToDecimal(focalLengthInches, 2));
    writeResults();
};

MLB.diopterToFocalLengthConverter.calcDiopterT = function () {
    var common = MLB.diopterToFocalLengthConverter.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcDiopter = MLB.calcLib.calcDiopter,
        writeResults = MLB.diopterToFocalLengthConverter.writeResults,
        diopter = calcDiopter(common.convertUomToInches(common.imperialT(), common.focalLengthTVal()));

    common.diopterT().val(roundToDecimal(diopter, 2));
    writeResults();
};

MLB.diopterToFocalLengthConverter.calcDiopterE = function () {
    var common = MLB.diopterToFocalLengthConverter.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcDiopter = MLB.calcLib.calcDiopter,
        writeResults = MLB.diopterToFocalLengthConverter.writeResults,
        diopter = calcDiopter(common.convertUomToInches(common.imperialE(), common.focalLengthEVal()));

    common.diopterE().val(roundToDecimal(diopter, 2));
    writeResults();
};

$(window).ready(function () {
    var common = MLB.diopterToFocalLengthConverter.common,
        calcDiopterT = MLB.diopterToFocalLengthConverter.calcDiopterT,
        calcFocalLengthT = MLB.diopterToFocalLengthConverter.calcFocalLengthT,
        calcDiopterE = MLB.diopterToFocalLengthConverter.calcDiopterE,
        calcFocalLengthE = MLB.diopterToFocalLengthConverter.calcFocalLengthE;

    // event hookups/subscribes
    common.btnConvertDiopterToFocalLengthT().click(calcFocalLengthT);
    common.btnConvertFocalLengthToDiopterT().click(calcDiopterT);
    common.btnConvertDiopterToFocalLengthE().click(calcFocalLengthE);
    common.btnConvertFocalLengthToDiopterE().click(calcDiopterE);

    calcFocalLengthT();
    calcFocalLengthE();
});

// end of file