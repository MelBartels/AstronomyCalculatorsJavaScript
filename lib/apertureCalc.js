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
		resultExitPupil = eyepieceFocalLengthmm / focalRatio / comaCorrectorMag;

	exitPupilmm.val(roundToDecimal(resultExitPupil, decimalPoints));
};

MLB.apertureCalc.calcEyepieceFieldStop = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 2,
		eyepieceFieldStopmm = $('input[name=eyepieceFieldStopmm]'),
		eyepieceApparentFielddeg = +$('input[name=eyepieceApparentFielddeg]').val(),
		resultEyepieceFieldStop = eyepieceApparentFielddeg / 57.3 * 25.4,
		// guesstimate from 50 deg eyepieces = no distortion to 80 deg eyepieces = 15% distortion
		distortion = eyepieceApparentFielddeg < 50 ? 0 : (eyepieceApparentFielddeg - 50) * 0.005;

	eyepieceFieldStopmm.val(roundToDecimal(resultEyepieceFieldStop * (1 - distortion), decimalPoints));
};

MLB.apertureCalc.displayDetails = function (aperture, focalRatio, eyepieceFocalLengthmm) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    limitingMagnitude = MLB.calcLib.limitingMagnitude,
		decimalPointsMag = 0,
		decimalPointsResolution = 1,
		decimalPointsMagLimit = 1,
	    comaCorrectorMag = +$('input[name=comaCorrectorMag]').val(),
		details = $('td[id=details]'),
		magnification = aperture * focalRatio * comaCorrectorMag / eyepieceFocalLengthmm * 25.4,
		resolutionArcsec = 240 / magnification,
		magLimit = limitingMagnitude(aperture) - 1;    // lower power reduces limiting magnitude by ~1 mag

	details.html('magnification is '
		+ roundToDecimal(magnification, decimalPointsMag)
		+ 'x, resolution is '
		+ roundToDecimal(resolutionArcsec, decimalPointsResolution)
		+ ' arc seconds, limiting magnitude is '
		+ roundToDecimal(magLimit, decimalPointsMagLimit));
};

MLB.apertureCalc.calcFOV = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_Pupil = MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_Pupil,
		displayDetails = MLB.apertureCalc.displayDetails,
	    eyepieceFocalLengthmm = +$('input[name=eyepieceFocalLengthmm]').val(),
	    focalRatio = +$('input[name=focalRatio]').val(),
		exitPupilmm = +$('input[name=exitPupilmm]').val(),
	    eyepieceFieldStopmm = +$('input[name=eyepieceFieldStopmm]').val(),
	    FOVdeg = $('input[name=FOVdeg]'),
		apertureInches = +$('input[name=apertureInches]').val(),
		resultFOV = calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_Pupil(apertureInches, eyepieceFocalLengthmm, eyepieceFieldStopmm, exitPupilmm);

	FOVdeg.val(roundToDecimal(resultFOV, decimalPoints));
	displayDetails(apertureInches, focalRatio, eyepieceFocalLengthmm);
};

MLB.apertureCalc.calcAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil,
		displayDetails = MLB.apertureCalc.displayDetails,
	    eyepieceFocalLengthmm = +$('input[name=eyepieceFocalLengthmm]').val(),
	    focalRatio = +$('input[name=focalRatio]').val(),
		exitPupilmm = +$('input[name=exitPupilmm]').val(),
	    eyepieceFieldStopmm = +$('input[name=eyepieceFieldStopmm]').val(),
	    FOVdeg = +$('input[name=FOVdeg]').val(),
		apertureInches = $('input[name=apertureInches]'),
		resultAperture = calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil(FOVdeg, eyepieceFocalLengthmm, eyepieceFieldStopmm, exitPupilmm);

	apertureInches.val(roundToDecimal(resultAperture, decimalPoints));
	displayDetails(resultAperture, focalRatio, eyepieceFocalLengthmm);
};

$(window).ready(function () {
	var getExitPupil = MLB.apertureCalc.getExitPupil,
	    calcEyepieceFieldStop = MLB.apertureCalc.calcEyepieceFieldStop,
		calcFOV = MLB.apertureCalc.calcFOV,
	    calcAperture = MLB.apertureCalc.calcAperture,
		btnGetExitPupil = $('input[id=btnGetExitPupil]'),
		btnCalcEyepieceFieldStop = $('input[id=btnCalcEyepieceFieldStop]'),
		btnCalcFOV = $('input[id=btnCalcFOV]'),
		btnCalcAperture = $('input[id=btnCalcAperture]');

	// event hookups/subscribes
	btnGetExitPupil.click(function () {
		getExitPupil();
	});
	btnCalcEyepieceFieldStop.click(function () {
		calcEyepieceFieldStop();
	});
	btnCalcFOV.click(function () {
		calcFOV();
	});
	btnCalcAperture.click(function () {
		calcAperture();
	});

	getExitPupil();
	calcAperture();
});

// end of file