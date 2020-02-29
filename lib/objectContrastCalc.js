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

    objMPAC: function () {
        return $('[name=objMPAC]');
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
    skyMPAC: function () {
        return $('[name=skyMPAC]');
    },
    ccntrastResult: function () {
        return $('[name=ccntrastResult]');
    },
    btnCalcObjectMPAC: function () {
        return $('input[id=btnCalcObjectMPAC]');
    },
    btnCalcContrast: function () {
        return $('input[id=btnCalcContrast]');
    },
    objMPACVal: function () {
        return +this.objMPAC().val();
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
    skyMPACVal: function () {
        return +this.skyMPAC().val();
    }
};

MLB.objectContrastCalc.calcObjectMPAC = function () {
    var util = MLB.objectContrastCalc.util,
        uom = MLB.sharedLib.uom,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        magDrop = getMagnitudeFromIllum(uom.sqrArcminToSqrArcsec * util.objSize1Val() * util.objSize2Val());

    util.objMPAC().val(roundToDecimal(util.objMagVal() - magDrop, util.magnitudeDecimalPlaces));
};

MLB.objectContrastCalc.calcContrast = function () {
    var util = MLB.objectContrastCalc.util,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        objMPAC = util.objMPACVal(),
        skyMPAC = util.skyMPACVal(),
        objectPlusSkyMPAC = getMagnitudeFromIllum(getIllumFromMagnitude(objMPAC) + getIllumFromMagnitude(skyMPAC)),
        // ex: object=24.5 MPAC, sky=21.5 MPAC, obj+sky=21.43 MPAC; 21.43 contrast to 21.5 = MPAC difference of 0.24 MPAC or 106% compared to background (=1=100%) or 6% difference
        contrast = getIllumFromMagnitude(objectPlusSkyMPAC - skyMPAC) - 1,
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
            + roundToDecimal(objMPAC, util.magnitudeDecimalPlaces)
            + ' MPAC<br>sky = '
            + roundToDecimal(skyMPAC, util.magnitudeDecimalPlaces)
            + ' MPAC<br>object+sky = '
            + roundToDecimal(objectPlusSkyMPAC, util.magnitudeDecimalPlaces)
            + ' MPAC<br><br>Contrast of object+sky to sky = '
            + roundToDecimal(contrast * 100, util.contrastResultDecimalPlaces)
            + '% difference.<br>Magnification needed for 5 degree apparent size = '
            + roundToDecimal(magnificationFiveDegApparentSize, util.magnificationDecimalPlaces)
            + 'X; for 100 degree apparent size = '
            + roundToDecimal(magnificationHundredDegApparentSize, util.magnificationDecimalPlaces)
            + 'X.');
};

$(window).ready(function () {
    var util = MLB.objectContrastCalc.util,
        calcObjectMPAC = MLB.objectContrastCalc.calcObjectMPAC,
        calcContrast = MLB.objectContrastCalc.calcContrast;

    // event hookups/subscribes
    util.btnCalcObjectMPAC().click(calcObjectMPAC);
    util.btnCalcContrast().click(calcContrast);

    calcObjectMPAC();
    calcContrast();
});

// end of file