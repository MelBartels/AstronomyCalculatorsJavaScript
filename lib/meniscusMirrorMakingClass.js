// copyright Mel Bartels, 2023

'use strict';

MLB.meniscusMirrorMakingClass = {};

// form passes itself via this.form ('this' is the input element and 'form' is its surrounding form)

MLB.meniscusMirrorMakingClass.calculateMirrorWeight = (form) => {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        isMeniscus = form.chBoxIsMeniscus.checked,
        weight = MLB.calcLib.calcMirrorWeight(form.mirrorDia.value, form.focalRatio.value, form.edgeThickness.value, isMeniscus);

    form.results.value = roundToDecimal(weight, 1) + ' pounds';
};

MLB.meniscusMirrorMakingClass.calculateToolVolume = (form) => {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        volume = MLB.calcLib.calcToolVolume(form.mirrorDia.value, form.focalRatio.value, form.plasterThickness.value);

    form.results.value = roundToDecimal(volume, 0) + ' cubic inches';
};

MLB.meniscusMirrorMakingClass.calcSphereToParabolaDifference = (form) => {
    var mirrorDia = form.mirrorDia.value,
        focalRatio = form.focalRatio.value,
        diff = MLB.calcLib.calcSphereParabolaDifference(mirrorDia, focalRatio);

    form.results.value = diff;
};

MLB.meniscusMirrorMakingClass.calcSagittaSpherical = (form) => {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        mirrorDia = form.mirrorDia.value,
        focalRatio = form.focalRatio.value,
        sagitta = MLB.calcLib.calcSagittaSpherical(mirrorDia, focalRatio);

    form.sagitta.value = roundToDecimal(sagitta, 3) + ' inches';;
};

MLB.meniscusMirrorMakingClass.calcFocalRatioAndFocalLength = (form) => {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        mirrorDia = form.mirrorDia.value,
        sagitta = form.sagitta.value,
        focalRatio = MLB.calcLib.calcFocalRatio(mirrorDia, sagitta),
        focalLength = mirrorDia * focalRatio;

    form.focalRatio.value = 'f/' + roundToDecimal(focalRatio, 2) + '; focal length = ' + roundToDecimal(focalLength, 2) + ' inches';
};

// end of file