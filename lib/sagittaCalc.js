// copyright Mel Bartels, 2012-2017

'use strict';

MLB.sagittaCalc = {};

MLB.sagittaCalc.calcCommonValues = function () {
    var mirrorDecimals = 2,
        sagittaDecimals = 4,
        sphereToParabolaDecimals = 6,
        wavesCorrectionDecimals = 1,
        mirrorDia = +$('input[name=mirrorDia]').val(),
        focalLen = +$('input[name=focalLen]').val(),
        calcSagitta = MLB.calcLib.calcSagitta,
        calcSagittaSpherical = MLB.calcLib.calcSagittaSpherical,
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        inchesToWavesGreenLight = MLB.calcLib.inchesToWavesGreenLight,
        calcSagittalVolume = MLB.calcLib.calcSagittalVolume,
        calcRotatingFurnaceRPM = MLB.calcLib.calcRotatingFurnaceRPM,
        focalRatio = focalLen / mirrorDia,
        parabolicSagitta = calcSagitta(mirrorDia, focalRatio),
        sphericalSagitta = calcSagittaSpherical(mirrorDia, focalRatio),
        sphereToParabolaDiffence = calcSphereParabolaDifference(mirrorDia, focalRatio),
        wavesCorrection = inchesToWavesGreenLight(sphereToParabolaDiffence),
        sagittalVolume = calcSagittalVolume(mirrorDia, focalRatio),
        RPM = calcRotatingFurnaceRPM(focalLen * 0.0254),
        roundToDecimal = MLB.sharedLib.roundToDecimal;

    $('input[name=parabolicSagitta]').val(roundToDecimal(parabolicSagitta, sagittaDecimals));
    $('input[name=sphericalSagitta]').val(roundToDecimal(sphericalSagitta, sagittaDecimals));
    $('input[name=sphereParabolaDifference]').val(roundToDecimal(sphereToParabolaDiffence, sphereToParabolaDecimals));
    $('td[id=wavesCorrection]').html(roundToDecimal(wavesCorrection, wavesCorrectionDecimals)
        + ' waves tangent to edge; minimal difference is '
        + roundToDecimal(wavesCorrection / 4, wavesCorrectionDecimals)
        + ' waves');
    $('input[name=sagittalVolume]').val(roundToDecimal(sagittalVolume, mirrorDecimals));
    $('input[name=rotatingFurnaceRPM]').val(roundToDecimal(RPM, mirrorDecimals));
};

MLB.sagittaCalc.calcUsingFocalLength = function () {
    var mirrorDecimals = 2,
        mirrorDia = +$('input[name=mirrorDia]').val(),
        focalLen = +$('input[name=focalLen]').val(),
        focalRatio = focalLen / mirrorDia,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcCommonValues = MLB.sagittaCalc.calcCommonValues;

    $('input[name=focalRatio]').val(roundToDecimal(focalRatio, mirrorDecimals));
    calcCommonValues();
};

MLB.sagittaCalc.calcUsingFocalRatio = function () {
    var mirrorDecimals = 2,
        mirrorDia = +$('input[name=mirrorDia]').val(),
        focalRatio = +$('input[name=focalRatio]').val(),
        focalLen = focalRatio * mirrorDia,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcCommonValues = MLB.sagittaCalc.calcCommonValues;

    $('input[name=focalLen]').val(roundToDecimal(focalLen, mirrorDecimals));
    calcCommonValues();
};

MLB.sagittaCalc.calcUsingParabolicSagitta = function () {
    var mirrorDecimals = 2,
        mirrorDia = +$('input[name=mirrorDia]').val(),
        parabolicSagitta = +$('input[name=parabolicSagitta]').val(),
        calcFocalRatio = MLB.calcLib.calcFocalRatio,
        focalRatio = calcFocalRatio(mirrorDia, parabolicSagitta),
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcUsingFocalRatio = MLB.sagittaCalc.calcUsingFocalRatio;

    $('input[name=focalRatio]').val(roundToDecimal(focalRatio, mirrorDecimals));

    calcUsingFocalRatio();
};

MLB.sagittaCalc.calcUsingSphericalSagitta = function () {
    var mirrorDecimals = 2,
        mirrorDia = +$('input[name=mirrorDia]').val(),
        sphericalSagitta = +$('input[name=sphericalSagitta]').val(),
        calcFocalRatioFromSphericalSagitta = MLB.calcLib.calcFocalRatioFromSphericalSagitta,
        focalRatio = calcFocalRatioFromSphericalSagitta(mirrorDia, sphericalSagitta),
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcUsingFocalRatio = MLB.sagittaCalc.calcUsingFocalRatio;

    $('input[name=focalRatio]').val(roundToDecimal(focalRatio, mirrorDecimals));

    calcUsingFocalRatio();
};

$(window).ready(function () {
    var btnFocalLength = $('#btnFocalLength')[0],
        btnFocalRatio = $('#btnFocalRatio')[0],
        btnParabolicSagitta = $('#btnParabolicSagitta')[0],
        btnSphericalSagitta = $('#btnSphericalSagitta')[0],
        calcUsingFocalLength = MLB.sagittaCalc.calcUsingFocalLength,
        calcUsingFocalRatio = MLB.sagittaCalc.calcUsingFocalRatio,
        calcUsingParabolicSagitta = MLB.sagittaCalc.calcUsingParabolicSagitta,
        calcUsingSphericalSagitta = MLB.sagittaCalc.calcUsingSphericalSagitta;

    // event hookups/subscribes
    btnFocalLength.onclick = function () {
        calcUsingFocalLength();
    };
    btnFocalRatio.onclick = function () {
        calcUsingFocalRatio();
    };
    btnParabolicSagitta.onclick = function () {
        calcUsingParabolicSagitta();
    };
    btnSphericalSagitta.onclick = function () {
        calcUsingSphericalSagitta();
    };

    calcUsingFocalLength();
});

// end of file