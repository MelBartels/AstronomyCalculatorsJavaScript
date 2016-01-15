// copyright Mel Bartels, 2015

'use strict';

MLB.telescopeCriteriaCalc = {};

MLB.telescopeCriteriaCalc.common = {
	apertureInches: function () {
		return $('input[name=apertureInches]');
	},
	FOVdeg: function () {
		return $('input[name=FOVdeg]');
	},
	eyePupilmm: function () {
		return $('input[name=eyePupilmm]');
	},
	eyepieceFocalLengthmm: function () {
		return $('input[name=eyepieceFocalLengthmm]');
	},
	eyepieceFieldStopmm: function () {
		return $('input[name=eyepieceFieldStopmm]');
	},
	comaCorrectorMag: function () {
		return $('input[name=comaCorrectorMag]');
	},
	focalRatio: function () {
		return $('input[name=focalRatio]');
	},
	details: function () {
		return $('td[id=details]');
	},
	apertureInchesVal: function () {
		return +this.apertureInches().val();
	},
	FOVdegVal: function () {
		return +this.FOVdeg().val();
	},
	eyePupilmmVal: function () {
		return +this.eyePupilmm().val();
	},
	eyepieceFocalLengthmmVal: function () {
		return +this.eyepieceFocalLengthmm().val();
	},
	eyepieceFieldStopmmVal: function () {
		return +this.eyepieceFieldStopmm().val();
	},
	comaCorrectorMagVal: function () {
		return +this.comaCorrectorMag().val();
	},
	focalRatioVal: function () {
		return +this.focalRatio().val();
	}
};

MLB.telescopeCriteriaCalc.displayDetails = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    limitingMagnitude = MLB.calcLib.limitingMagnitude,
		decimalPointsMag = 0,
		decimalPointsResolution = 1,
		decimalPointsMagLimit = 1,
		common = MLB.telescopeCriteriaCalc.common,
		magnification = common.apertureInchesVal() * common.focalRatioVal() * common.comaCorrectorMagVal() / common.eyepieceFocalLengthmmVal() * 25.4,
		resolutionArcsec = 240 / magnification,
		magLimit = limitingMagnitude(common.apertureInchesVal()) - 1;    // lower power reduces limiting magnitude by ~1 mag

	common.details().html('magnification is '
		+ roundToDecimal(magnification, decimalPointsMag)
		+ 'x, resolution is '
		+ roundToDecimal(resolutionArcsec, decimalPointsResolution)
		+ ' arc seconds, limiting magnitude is '
		+ roundToDecimal(magLimit, decimalPointsMagLimit));
};

MLB.telescopeCriteriaCalc.calcAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultAperture = calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil(common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

	common.apertureInches().val(roundToDecimal(resultAperture, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcFOV = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultFOV = calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

	common.FOVdeg().val(roundToDecimal(resultFOV, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyePupil = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyePupilmm = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal());

	common.eyePupilmm().val(roundToDecimal(resultEyePupilmm, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFL = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil = MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFocalLengthmm = calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

	common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStop = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFieldStop = calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyePupilmmVal());

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStop, decimalPoints));
	displayDetails();
};

$(window).ready(function () {
	var calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		calcEyePupil = MLB.telescopeCriteriaCalc.calcEyePupil,
		calcEyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFL,
	    calcEyepieceFieldStop = MLB.telescopeCriteriaCalc.calcEyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
	    btnCalcAperture = $('input[id=btnCalcAperture]'),
		btnCalcFOV = $('input[id=btnCalcFOV]'),
		btnCalcEyePupil = $('input[id=btnCalcEyePupil]'),
		btnCalcEyepieceFL = $('input[id=btnCalcEyepieceFL]'),
		btnCalcEyepieceFieldStop = $('input[id=btnCalcEyepieceFieldStop]');

	// event hookups/subscribes
	btnCalcAperture.click(function () {
		calcAperture();
	});
	btnCalcFOV.click(function () {
		calcFOV();
	});
	btnCalcEyePupil.click(function () {
		calcEyePupil();
	});
	btnCalcEyepieceFL.click(function () {
		calcEyepieceFL();
	});
	btnCalcEyepieceFieldStop.click(function () {
		calcEyepieceFieldStop();
	});

	displayDetails();
});

// end of file