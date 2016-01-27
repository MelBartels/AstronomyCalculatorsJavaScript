// copyright Mel Bartels, 2015-2016

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
	eyepieceApparentFielddeg: function () {
		return $('input[name=eyepieceApparentFielddeg]');
	},
	limitingMagnitude: function () {
		return $('input[name=limitingMagnitude]');
	},
	comaCorrectorMag: function () {
		return $('input[name=comaCorrectorMag]');
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
	eyepieceApparentFielddegVal: function () {
		return +this.eyepieceApparentFielddeg().val();
	},
	limitingMagnitudeVal: function () {
		return +this.limitingMagnitude().val();
	},
	comaCorrectorMagVal: function () {
		return +this.comaCorrectorMag().val();
	},
	useComaCorrectorMagVal: function () {
		return $('input[name=chBoxUseComaCorrector]').is(':checked');
	}
};

MLB.telescopeCriteriaCalc.commonT = {
	apertureInches: function () {
		return $('input[name=apertureInchesT]');
	},
	focalRatio: function () {
		return $('input[name=focalRatioT]');
	},
	eyepieceFocalLengthmm: function () {
		return $('input[name=eyepieceFocalLengthmmT]');
	},
	eyepieceFieldStopmm: function () {
		return $('input[name=eyepieceFieldStopmmT]');
	},
	eyepieceApparentFielddeg: function () {
		return $('input[name=eyepieceApparentFielddegT]');
	},
	FOVdeg: function () {
		return $('input[name=FOVdegT]');
	},
	limitingMagnitude: function () {
		return $('input[name=limitingMagnitudeT]');
	},
	comaCorrectorMag: function () {
		return $('input[name=comaCorrectorMag]');
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
	},
	limitingMagnitudeVal: function () {
		return +this.limitingMagnitude().val();
	},
	comaCorrectorMagVal: function () {
		return +this.comaCorrectorMag().val();
	},
	useComaCorrectorMagVal: function () {
		return $('input[name=chBoxUseComaCorrectorT]').is(':checked');
	}
};

MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor = function (common) {
	if (common.useComaCorrectorMagVal()) {
		return common.comaCorrectorMagVal();
	}
	return 1;
};

MLB.telescopeCriteriaCalc.displayDetails = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPointsFocalRatio = 1,
		decimalPointsFocalLength = 0,
		decimalPointsMag = 0,
		decimalPointsResolution = 1,
		common = MLB.telescopeCriteriaCalc.common,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		focalRatio = common.eyepieceFocalLengthmmVal() / common.eyePupilmmVal() / comaCorrectorMag,
		focalLength = focalRatio * common.apertureInchesVal(),
		magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4,
		resolutionArcsec = 240 / magnification;

	common.details().html('focal ratio = '
	    + roundToDecimal(focalRatio, decimalPointsFocalRatio)
	    + ', focal length = '
	    + roundToDecimal(focalLength, decimalPointsFocalLength)
	    + ' inches, magnification = '
		+ roundToDecimal(magnification, decimalPointsMag)
		+ 'x, resolution = '
		+ roundToDecimal(resolutionArcsec, decimalPointsResolution)
		+ ' arc seconds');
};

MLB.telescopeCriteriaCalc.displayDetailsT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPointsEyePupil = 1,
		decimalPointsFocalLength = 0,
		decimalPointsMag = 0,
		decimalPointsResolution = 1,
		common = MLB.telescopeCriteriaCalc.commonT,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		eyePupilmm = common.eyepieceFocalLengthmmVal() / common.focalRatioVal() / comaCorrectorMag,
		focalLength = common.focalRatioVal() * common.apertureInchesVal(),
		magnification = common.apertureInchesVal() / eyePupilmm * 25.4,
		resolutionArcsec = 240 / magnification;

	common.details().html('eye pupil = '
	    + roundToDecimal(eyePupilmm, decimalPointsEyePupil)
	    + 'mm, focal length = '
	    + roundToDecimal(focalLength, decimalPointsFocalLength)
	    + ' inches, magnification = '
		+ roundToDecimal(magnification, decimalPointsMag)
		+ 'x, resolution = '
		+ roundToDecimal(resolutionArcsec, decimalPointsResolution)
		+ ' arc seconds');
};

MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitudeStrategy = function (common) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPointsMagLimit = 1,
	    limitingMagnitude = MLB.calcLib.limitingMagnitude,
		highMagnificationMagnitudeLimit = limitingMagnitude(common.apertureInchesVal()),
		lowMagnificationMagnitudeLimit = highMagnificationMagnitudeLimit - 1;

	common.limitingMagnitude().val(roundToDecimal(lowMagnificationMagnitudeLimit, decimalPointsMagLimit));
};

// calc aperture...

MLB.telescopeCriteriaCalc.calcApertureStrategy = function (common, displayDetails, calcFunc) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPointsAperture = 1,
		calcDisplayLimitingMagnitudeStrategy = MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitudeStrategy,
		resultAperture = calcFunc();

	common.apertureInches().val(roundToDecimal(resultAperture, decimalPointsAperture));
	calcDisplayLimitingMagnitudeStrategy(common);
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcAperture = function () {
	var calcApertureStrategy = MLB.telescopeCriteriaCalc.calcApertureStrategy,
	    common = MLB.telescopeCriteriaCalc.common,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil,
		calcFunc = function () {
			return calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil(common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
		};

	calcApertureStrategy(common, displayDetails, calcFunc);
};

MLB.telescopeCriteriaCalc.calcApertureT = function () {
	var calcApertureStrategy = MLB.telescopeCriteriaCalc.calcApertureStrategy,
		common = MLB.telescopeCriteriaCalc.commonT,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		calcFunc = function () {
			return calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.FOVdegVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
		};

	calcApertureStrategy(common, displayDetails, calcFunc);
};

// ...calc aperture
// calc FOV

MLB.telescopeCriteriaCalc.calcFOVStrategy = function (common, displayDetails, calcFunc) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		resultFOV = calcFunc();

	common.FOVdeg().val(roundToDecimal(resultFOV, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcFOV = function () {
	var calcFOVStrategy = MLB.telescopeCriteriaCalc.calcFOVStrategy,
		common = MLB.telescopeCriteriaCalc.common,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil,
		calcFunc = function () {
			return calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
		};

	calcFOVStrategy(common, displayDetails, calcFunc);
};

MLB.telescopeCriteriaCalc.calcFOVT = function () {
	var calcFOVStrategy = MLB.telescopeCriteriaCalc.calcFOVStrategy,
		common = MLB.telescopeCriteriaCalc.commonT,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		calcFunc = function () {
			return calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
		};

	calcFOVStrategy(common, displayDetails, calcFunc);
};

// ...calc FOV
// calc aperture from limiting magnitude...

MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitudeStrategy = function (common) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPointsAperture = 1,
		calcDisplayLimitingMagnitudeStrategy = MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitudeStrategy,
		apertureInchesFromMagnitude = MLB.calcLib.apertureInchesFromMagnitude,
		// lower power reduces limiting magnitude by ~1 mag
		resultAperture = apertureInchesFromMagnitude(common.limitingMagnitudeVal() + 1);

	common.apertureInches().val(roundToDecimal(resultAperture, decimalPointsAperture));
	calcDisplayLimitingMagnitudeStrategy(common);
};

MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude = function () {
	var calcApertureFromLimitingMagnitudeStrategy = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitudeStrategy,
		common = MLB.telescopeCriteriaCalc.common;

	calcApertureFromLimitingMagnitudeStrategy(common);
};

MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitudeT = function () {
	var calcApertureFromLimitingMagnitudeStrategy = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitudeStrategy,
		common = MLB.telescopeCriteriaCalc.commonT;

	calcApertureFromLimitingMagnitudeStrategy(common);
};

// ...calc aperture from limiting magnitude
// calc eypieceFieldStop...

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopStrategy = function (common, displayDetails, calcFunc) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		resultEyepieceFieldStop = calcFunc();

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStop, decimalPoints));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStop = function () {
	var calcEyepieceFieldStopStrategy = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopStrategy,
		common = MLB.telescopeCriteriaCalc.common,
	    displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil,
		calcFunc = function () {
			return calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyePupilmmVal());
		};

	calcEyepieceFieldStopStrategy(common, displayDetails, calcFunc);
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopT = function () {
	var calcEyepieceFieldStopStrategy = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopStrategy,
		common = MLB.telescopeCriteriaCalc.commonT,
	    displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor,
		calcFunc = function () {
			return calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.focalRatioVal(), comaCorrectorMag);
		};

	calcEyepieceFieldStopStrategy(common, displayDetails, calcFunc);
};

// ...calc eypieceFieldStop
// calc eyepieceFieldStop from apparent FOV...

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLStrategy = function (common) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		resultEyepieceFieldStopmm = common.eyepieceFocalLengthmmVal() * common.eyepieceApparentFielddegVal() / 57.3;

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStopmm, decimalPoints));
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL = function () {
	MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLStrategy(MLB.telescopeCriteriaCalc.common);
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLT = function () {
	MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLStrategy(MLB.telescopeCriteriaCalc.commonT);
};

// ...calc eyepieceFieldStop from apparent FOV

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

MLB.telescopeCriteriaCalc.calcFocalRatioT = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 1,
		calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetailsT,
		common = MLB.telescopeCriteriaCalc.commonT,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		resultFocalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);

	common.focalRatio().val(roundToDecimal(resultFocalRatio, decimalPoints));
	displayDetails();
};

// change selected eyepiece...

MLB.telescopeCriteriaCalc.changeSelectedEyepieceStrategy = function (e, common) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPointsEyepieceFocalLengthmm = 1,
		decimalPointsEyepieceFieldStopmm = 1,
		decimalPointsApparentFielddeg = 0,
		eyepiecesJson = MLB.eyepiecesJson,
	    eyepiece = eyepiecesJson.eyepieces[e.selectedIndex];

	common.eyepieceFocalLengthmm().val(roundToDecimal(+eyepiece.focalLengthmm, decimalPointsEyepieceFocalLengthmm));
	common.eyepieceFieldStopmm().val(roundToDecimal(+eyepiece.fieldStopmm, decimalPointsEyepieceFieldStopmm));
	common.eyepieceApparentFielddeg().val(roundToDecimal(+eyepiece.apparentField, decimalPointsApparentFielddeg));
	//alert('text=' + $("option:selected", e).text() + ' fl=' + eyepiece.focalLengthmm);
};

MLB.telescopeCriteriaCalc.changeSelectedEyepiece = function (e) {
	var changeSelectedEyepieceStrategy = MLB.telescopeCriteriaCalc.changeSelectedEyepieceStrategy,
	    common = MLB.telescopeCriteriaCalc.common;

	changeSelectedEyepieceStrategy(e, common);
};

MLB.telescopeCriteriaCalc.changeSelectedEyepieceT = function (e) {
	var changeSelectedEyepieceStrategy = MLB.telescopeCriteriaCalc.changeSelectedEyepieceStrategy,
	    common = MLB.telescopeCriteriaCalc.commonT;

	changeSelectedEyepieceStrategy(e, common);
};

// ...change selected eyepiece

$(window).ready(function () {
	var calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		calcEyePupil = MLB.telescopeCriteriaCalc.calcEyePupil,
		calcEyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFL,
	    calcEyepieceFieldStop = MLB.telescopeCriteriaCalc.calcEyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL,
		calcApertureFromLimitingMagnitude = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude,

		calcApertureT = MLB.telescopeCriteriaCalc.calcApertureT,
		calcFocalRatioT = MLB.telescopeCriteriaCalc.calcFocalRatioT,
		calcEyepieceFieldStopT = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopT,
		calcFOVT = MLB.telescopeCriteriaCalc.calcFOVT,
		displayDetailsT = MLB.telescopeCriteriaCalc.displayDetailsT,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFLT = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFLT,
		calcApertureFromLimitingMagnitudeT = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitudeT,

	    btnCalcAperture = $('input[id=btnCalcAperture]'),
		btnCalcFOV = $('input[id=btnCalcFOV]'),
		btnCalcEyePupil = $('input[id=btnCalcEyePupil]'),
		btnCalcEyepieceFL = $('input[id=btnCalcEyepieceFL]'),
		btnCalcEyepieceFieldStop = $('input[id=btnCalcEyepieceFieldStop]'),
		btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFL = $('input[id=btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFL]'),
		btnCalcApertureFromLimitingMagnitude = $('input[id=btnCalcApertureFromLimitingMagnitude]'),

	    btnCalcApertureT = $('input[id=btnCalcApertureT]'),
	    btnCalcFocalRatioT = $('input[id=btnCalcFocalRatioT]'),
	    btnCalcFOVT = $('input[id=btnCalcFOVT]'),
		btnCalcEyepieceFieldStopT = $('input[id=btnCalcEyepieceFieldStopT]'),
		btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFLT = $('input[id=btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFLT]'),
		btnCalcApertureFromLimitingMagnitudeT = $('input[id=btnCalcApertureFromLimitingMagnitudeT]'),

		changeSelectedEyepiece = MLB.telescopeCriteriaCalc.changeSelectedEyepiece,
		eyepiecesElement = $('#eyepieces'),
		changeSelectedEyepieceT = MLB.telescopeCriteriaCalc.changeSelectedEyepieceT,
		eyepiecesTElement = $('#eyepiecesT'),
		eyepiecesJson = MLB.eyepiecesJson,
		str;

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
	btnCalcApertureFromLimitingMagnitude.click(function () {
		calcApertureFromLimitingMagnitude();
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
	btnCalcApertureFromLimitingMagnitudeT.click(function () {
		calcApertureFromLimitingMagnitudeT();
	});

	// fill select eyepiece drop down box
	$.each(eyepiecesJson.eyepieces, function (i, v) {
		if (v.fieldStopmm === '') {
			v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
		}
		str = '<option value="' + v.type + '">' + v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + 'mm ' + '</option>';
		eyepiecesElement.append(str);
		eyepiecesTElement.append(str);
	});
	// wire up selected eyepiece change
	eyepiecesElement.change(function () {
		changeSelectedEyepiece(this);
	});
	eyepiecesTElement.change(function () {
		changeSelectedEyepieceT(this);
	});

	// calc and display details for form default
	displayDetails();
	displayDetailsT();
});

// end of file