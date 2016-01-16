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
	details: function () {
		return $('td[id=details]');
	},
	eyepieceApparentFielddeg: function () {
		return $('input[name=eyepieceApparentFielddeg]');
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
	eyepieceApparentFielddegVal: function () {
		return +this.eyepieceApparentFielddeg().val();
	}
};

MLB.telescopeCriteriaCalc.commonT = {
	apertureInches: function () {
		return $('input[name=apertureInchesT]');
	},
	focalRatio: function () {
		return $('input[name=focalRatioT]');
	},
	eyepieceFieldStopmm: function () {
		return $('input[name=eyepieceFieldStopmmT]');
	},
	eyepieceApparentFielddeg: function () {
		return $('input[name=eyepieceApparentFielddegT]');
	},
	eyepieceFocalLengthmm: function () {
		return $('input[name=eyepieceFocalLengthmmT]');
	},
	FOVdeg: function () {
		return $('input[name=FOVdegT]');
	},
	details: function () {
		return $('td[id=detailsT]');
	},
	apertureInchesVal: function () {
		return +this.apertureInches().val();
	},
	focalRatioVal: function () {
		return +this.focalRatio().val();
	},
	eyepieceFieldStopmmVal: function () {
		return +this.eyepieceFieldStopmm().val();
	},
	eyepieceApparentFielddegVal: function () {
		return +this.eyepieceApparentFielddeg().val();
	},
	eyepieceFocalLengthmmVal: function () {
		return +this.eyepieceFocalLengthmm().val();
	},
	FOVdegVal: function () {
		return +this.FOVdeg().val();
	}
};

MLB.telescopeCriteriaCalc.displayDetails = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    limitingMagnitude = MLB.calcLib.limitingMagnitude,
		decimalPointsFocalRatio = 1,
		decimalPointsMag = 0,
		decimalPointsResolution = 1,
		decimalPointsMagLimit = 1,
		common = MLB.telescopeCriteriaCalc.common,
		focalRatio = common.eyepieceFocalLengthmmVal() / common.eyePupilmmVal(),
		magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4,
		resolutionArcsec = 240 / magnification,
		magLimit = limitingMagnitude(common.apertureInchesVal()) - 1;    // lower power reduces limiting magnitude by ~1 mag

	common.details().html('focal ratio is '
	    + roundToDecimal(focalRatio, decimalPointsFocalRatio)
	    + ', magnification is '
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

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 2,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFieldStopmm = common.eyepieceFocalLengthmmVal() * common.eyepieceApparentFielddegVal() / 57.3;

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStopmm, decimalPoints));
};

MLB.telescopeCriteriaCalc.displayDetailsT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    limitingMagnitude = MLB.calcLib.limitingMagnitude,
		decimalPointsEyePupil = 1,
		decimalPointsMag = 0,
		decimalPointsResolution = 1,
		decimalPointsMagLimit = 1,
		common = MLB.telescopeCriteriaCalc.commonT,
		eyePupilmm = common.eyepieceFocalLengthmmVal() / common.focalRatioVal(),
		magnification = common.apertureInchesVal() / eyePupilmm * 25.4,
		resolutionArcsec = 240 / magnification,
		magLimit = limitingMagnitude(common.apertureInchesVal()) - 1;    // lower power reduces limiting magnitude by ~1 mag

	common.details().html('eye pupil is '
	    + roundToDecimal(eyePupilmm, decimalPointsEyePupil)
	    + 'mm, magnification is '
		+ roundToDecimal(magnification, decimalPointsMag)
		+ 'x, resolution is '
		+ roundToDecimal(resolutionArcsec, decimalPointsResolution)
		+ ' arc seconds, limiting magnitude is '
		+ roundToDecimal(magLimit, decimalPointsMagLimit));
};

MLB.telescopeCriteriaCalc.calcApertureT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcApertureFromFOV_FocalRatio_EyepieceFieldStop = MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		common = MLB.telescopeCriteriaCalc.commonT,
		resultAperture = calcApertureFromFOV_FocalRatio_EyepieceFieldStop(common.FOVdegVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal());

	common.apertureInches().val(roundToDecimal(resultAperture, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcFocalRatioT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcFocalRatioFromAperture_FOV_EyepieceFieldStop = MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		common = MLB.telescopeCriteriaCalc.commonT,
		resultFocalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal());

	common.focalRatio().val(roundToDecimal(resultFocalRatio, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcEyepieceFieldStopFromAperture_FOV_FocalRatio = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.commonT,
		resultEyepieceFieldStop = calcEyepieceFieldStopFromAperture_FOV_FocalRatio(common.apertureInchesVal(), common.FOVdegVal(), common.focalRatioVal());

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStop, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcFOVT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		common = MLB.telescopeCriteriaCalc.commonT,
		resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop(common.apertureInchesVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal());

	common.FOVdeg().val(roundToDecimal(resultFOV, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 2,
		common = MLB.telescopeCriteriaCalc.commonT,
		resultEyepieceFieldStopmm = common.eyepieceFocalLengthmmVal() * common.eyepieceApparentFielddegVal() / 57.3;

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStopmm, decimalPoints));
};

$(window).ready(function () {
	var calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		calcEyePupil = MLB.telescopeCriteriaCalc.calcEyePupil,
		calcEyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFL,
	    calcEyepieceFieldStop = MLB.telescopeCriteriaCalc.calcEyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL,

		calcApertureT = MLB.telescopeCriteriaCalc.calcApertureT,
		calcFocalRatioT = MLB.telescopeCriteriaCalc.calcFocalRatioT,
		calcEyepieceFieldStopT = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopT,
		calcFOVT = MLB.telescopeCriteriaCalc.calcFOVT,
		displayDetailsT = MLB.telescopeCriteriaCalc.displayDetailsT,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFLT = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLT,

	    btnCalcAperture = $('input[id=btnCalcAperture]'),
		btnCalcFOV = $('input[id=btnCalcFOV]'),
		btnCalcEyePupil = $('input[id=btnCalcEyePupil]'),
		btnCalcEyepieceFL = $('input[id=btnCalcEyepieceFL]'),
		btnCalcEyepieceFieldStop = $('input[id=btnCalcEyepieceFieldStop]'),
		btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFL = $('input[id=btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFL]'),

	    btnCalcApertureT = $('input[id=btnCalcApertureT]'),
	    btnCalcFocalRatioT = $('input[id=btnCalcFocalRatioT]'),
	    btnCalcFOVT = $('input[id=btnCalcFOVT]'),
		btnCalcEyepieceFieldStopT = $('input[id=btnCalcEyepieceFieldStopT]'),
		btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFLT = $('input[id=btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFLT]');

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
	btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFL.click(function () {
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL();
	});

	btnCalcApertureT.click(function () {
		calcApertureT();
	});
	btnCalcFocalRatioT.click(function () {
		calcFocalRatioT();
	});
	btnCalcEyepieceFieldStopT.click(function () {
		calcEyepieceFieldStopT();
	});
	btnCalcFOVT.click(function () {
		calcFOVT();
	});
	btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFLT.click(function () {
		calcEyepieceFieldStopFromApparentFOV_EyepieceFLT();
	});

	// calc and display details for form default
	displayDetails();
	displayDetailsT();
});

// end of file