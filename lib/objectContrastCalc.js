/*global
    MLB,$,window,document
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2018-2020

'use strict';

MLB.objectContrastCalc = {};

MLB.objectContrastCalc.util = {
    magnitudeDecimalPlaces: 2,
    contrastResultDecimalPlaces: 1,
    magnificationDecimalPlaces: 0,

    objMPAS: function () {
        return $('[name=objMPAS]');
    },
    objMag: function () {
        return $('[name=objMag]');
    },
    objSize1: function () {
        return $('[name=objSize1]');
    },
    objSize2: function () {
        return $('[name=objSize2]');
    },
    skyMPAS: function () {
        return $('[name=skyMPAS]');
    },
    ccntrastResult: function () {
        return $('[name=ccntrastResult]');
    },
    btnCalcObjectMPAS: function () {
        return $('input[id=btnCalcObjectMPAS]');
    },
    btnCalcContrast: function () {
        return $('input[id=btnCalcContrast]');
    },
    objMPASVal: function () {
        return +this.objMPAS().val();
    },
    objMagVal: function () {
        return +this.objMag().val();
    },
    objSize1Val: function () {
        return +this.objSize1().val();
    },
    objSize2Val: function () {
        return +this.objSize2().val();
    },
    skyMPASVal: function () {
        return +this.skyMPAS().val();
    }
};

MLB.objectContrastCalc.calcObjectMPAS = function () {
    var util = MLB.objectContrastCalc.util,
        uom = MLB.sharedLib.uom,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        magDrop = getMagnitudeFromIllum(uom.sqrArcminToSqrArcsec * util.objSize1Val() * util.objSize2Val());

    util.objMPAS().val(roundToDecimal(util.objMagVal() - magDrop, util.magnitudeDecimalPlaces));
};

MLB.objectContrastCalc.calcContrast = function () {
    var util = MLB.objectContrastCalc.util,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        objMPAS = util.objMPASVal(),
        skyMPAS = util.skyMPASVal(),
        objectPlusSkyMPAS = getMagnitudeFromIllum(getIllumFromMagnitude(objMPAS) + getIllumFromMagnitude(skyMPAS)),
        // ex: object=24.5 MPAS, sky=21.5 MPAS, obj+sky=21.43 MPAS; 21.43 contrast to 21.5 = MPAS difference of 0.24 MPAS or 106% compared to background (=1=100%) or 6% difference
        contrast = getIllumFromMagnitude(objectPlusSkyMPAS - skyMPAS) - 1,
        objectSize1 = util.objSize1Val(),
        objectSize2 = util.objSize2Val(),
        largestObjectSize = objectSize1 > objectSize2
            ? objectSize1
            : objectSize2,
        magnificationFiveDegApparentSize = 300 / largestObjectSize,
        magnificationHundredDegApparentSize = 6000 / largestObjectSize;

    if (magnificationFiveDegApparentSize < 1) {
        magnificationFiveDegApparentSize = 1;
    }
    if (magnificationHundredDegApparentSize < 1) {
        magnificationHundredDegApparentSize = 1;
    }

    util.ccntrastResult().html('Object = '
            + roundToDecimal(objMPAS, util.magnitudeDecimalPlaces)
            + ' MPAS<br>sky = '
            + roundToDecimal(skyMPAS, util.magnitudeDecimalPlaces)
            + ' MPAS<br>object+sky = '
            + roundToDecimal(objectPlusSkyMPAS, util.magnitudeDecimalPlaces)
            + ' MPAS<br>Contrast of object+sky to sky = '
            + roundToDecimal(contrast * 100, util.contrastResultDecimalPlaces)
            + '% difference.<br>Magnification needed for 5 degree apparent size = '
            + roundToDecimal(magnificationFiveDegApparentSize, util.magnificationDecimalPlaces)
            + 'X; for 100 degree apparent size = '
            + roundToDecimal(magnificationHundredDegApparentSize, util.magnificationDecimalPlaces)
            + 'X.');
};

$(window).ready(function () {
    var util = MLB.objectContrastCalc.util,
        calcObjectMPAS = MLB.objectContrastCalc.calcObjectMPAS,
        calcContrast = MLB.objectContrastCalc.calcContrast;

    // event hookups/subscribes
    util.btnCalcObjectMPAS().click(calcObjectMPAS);
    util.btnCalcContrast().click(calcContrast);

    calcObjectMPAS();
    calcContrast();
});

// end of file