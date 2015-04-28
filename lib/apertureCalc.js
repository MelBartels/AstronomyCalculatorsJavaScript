// copyright Mel Bartels, 2015

'use strict';

MLB.apertureCalc = {};

MLB.apertureCalc.getExitPupil = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		eyepieceFocalLengthmm = +$('input[name=eyepieceFocalLengthmm]').val(),
	    focalRatio = +$('input[name=focalRatio]').val(),
	    comaCorrectorMag = +$('input[name=comaCorrectorMag]').val(),
	    exitPupilmm = $('input[name=exitPupilmm]'),
		result = eyepieceFocalLengthmm / focalRatio / comaCorrectorMag;

	exitPupilmm.val(roundToDecimal(result, decimalPoints));
};

MLB.apertureCalc.calcAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcApertureFromEyepieceExitPupilFOV = MLB.calcLib.calcApertureFromEyepieceExitPupilFOV,
	    eyepieceFocalLengthmm = +$('input[name=eyepieceFocalLengthmm]').val(),
		exitPupilmm = +$('input[name=exitPupilmm]').val(),
	    eyepieceFieldStopmm = +$('input[name=eyepieceFieldStopmm]').val(),
	    FOVdeg = +$('input[name=FOVdeg]').val(),
		apertureInches = $('input[name=apertureInches]'),
		result = calcApertureFromEyepieceExitPupilFOV(FOVdeg, eyepieceFocalLengthmm, eyepieceFieldStopmm, exitPupilmm);

	apertureInches.val(roundToDecimal(result, decimalPoints));
};

$(window).ready(function () {
	var getExitPupil = MLB.apertureCalc.getExitPupil,
	    calcAperture = MLB.apertureCalc.calcAperture,
		btnGetExitPupil = $('input[id=btnGetExitPupil]'),
		btnCalcAperture = $('input[id=btnCalcAperture]');

	// event hookups/subscribes
	btnGetExitPupil.click(function () {
		getExitPupil();
	});
	btnCalcAperture.click(function () {
		calcAperture();
	});

	getExitPupil();
	calcAperture();
});

// end of file