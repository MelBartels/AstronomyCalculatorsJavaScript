// copyright Mel Bartels, 2013-2021

'use strict';

MLB.magnitudeCalc = {};

MLB.magnitudeCalc.calcUsingPercent = function () {
    var magDecimals = 2,
        percent = +$('input[name=percent]').val(),
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        magDiff = -getMagnitudeFromIllum(percent / 100);

    $('input[name=magOutPercent]').val(roundToDecimal(magDiff, magDecimals));
};

MLB.magnitudeCalc.calcUsingAperture = function () {
    var magDecimals = 2,
        aperture1 = +$('input[name=aperture1]').val(),
        aperture2 = +$('input[name=aperture2]').val(),
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        magnitudeDifferenceBetweenApertures = MLB.calcLib.magnitudeDifferenceBetweenApertures,
        magDiff = -magnitudeDifferenceBetweenApertures(aperture1, aperture2);

    $('input[name=magOutAperture]').val(roundToDecimal(magDiff, magDecimals));
};

MLB.magnitudeCalc.addMagnitudes = function () {
    var magDecimals = 2,
        magnitude1 = +$('input[name=magnitude1]').val(),
        magnitude2 = +$('input[name=magnitude2]').val(),
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        adddMagnitudes = MLB.calcLib.addMagnitudes,
        combinedMagnitude = adddMagnitudes(magnitude1, magnitude2);

    $('input[name=combinedMagnitude]').val(roundToDecimal(combinedMagnitude, magDecimals));
};

MLB.magnitudeCalc.calcTotalMagnitude = function () {
    var magDecimals = 2,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        adddMagnitudes = MLB.calcLib.addMagnitudes,
        combinedMagnitude;

    combinedMagnitude = $('input[name=magnitudesToAdd]')
            .val()
            .split(/[ ,]+/)
            .filter(Number)
            .reduce((a, b) => adddMagnitudes(a, b));

    $('input[name=totalMagnitude]').val(roundToDecimal(combinedMagnitude, magDecimals));
};

$(window).ready(function () {
    var btnCalcPercent = $('#btnCalcPercent')[0],
        btnCalcAperture = $('#btnCalcAperture')[0],
        btnAddMagnitudes = $('#btnAddMagnitudes')[0],
        btnCalcTotalMagnitude = $('#btnCalcTotalMagnitude')[0],
        calcUsingPercent = MLB.magnitudeCalc.calcUsingPercent,
        calcUsingAperture = MLB.magnitudeCalc.calcUsingAperture,
        addMagnitudes = MLB.magnitudeCalc.addMagnitudes,
        calcTotalMagnitude = MLB.magnitudeCalc.calcTotalMagnitude;

    // event hookups/subscribes
    btnCalcPercent.onclick = function () {
        calcUsingPercent();
    };
    btnCalcAperture.onclick = function () {
        calcUsingAperture();
    };
    btnAddMagnitudes.onclick = function () {
        addMagnitudes();
    };
    btnCalcTotalMagnitude.onclick = function () {
        calcTotalMagnitude();
    };

    calcUsingPercent();
    calcUsingAperture();
    addMagnitudes();
});

// end of file