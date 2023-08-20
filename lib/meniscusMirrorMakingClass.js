// copyright Mel Bartels, 2023

'use strict';

MLB.meniscusMirrorMakingClass = {};

MLB.meniscusMirrorMakingClass.calculateMirrorWeight = (form) => { // form passes itself via this.form
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        isMeniscus = true,
        results = MLB.calcLib.calcMirrorWeight(form.mirrorDia.value, form.focalRatio.value, form.edgeThickness.value, isMeniscus);

    form.results.value = roundToDecimal(results, 1) + ' pounds';
};

MLB.meniscusMirrorMakingClass.calculateToolVolume = (form) => { // form passes itself via this.form
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        results = MLB.calcLib.calcToolVolume(form.mirrorDia.value, form.focalRatio.value, form.plasterThickness.value);

    form.results.value = roundToDecimal(results, 0) + ' cubic inches';
};

MLB.meniscusMirrorMakingClass.calcSphereToParabolaDifference = (form) => { // form passes itself via this.form
    var mirrorDia = form.mirrorDia.value,
        focalRatio = form.focalRatio.value,
        mirrorRad = mirrorDia / 2,
        radiusOfCurvature = mirrorDia * focalRatio * 2;

    form.results.value = Math.pow(mirrorRad, 4) / (8 * Math.pow(radiusOfCurvature, 3));
};

// end of file