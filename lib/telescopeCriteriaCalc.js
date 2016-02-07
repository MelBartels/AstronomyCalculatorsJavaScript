// copyright Mel Bartels, 2016

'use strict';

MLB.telescopeCriteriaCalc = {};

MLB.telescopeCriteriaCalc.state = {
	focalRatioChecked: undefined
};

MLB.telescopeCriteriaCalc.config = {
	decimalPointsAperture: 1,
	decimalPointsLimitingMagnitude: 1,
	decimalPointsFocalRatio: 2,
	decimalPointsTelescopeFocalLength: 1,
	decimalPointsFOV: 2,
	decimalPointsEyePupil: 2,
	decimalPointsEyepieceFL: 1,
	decimalPointsEyepieceFieldStop: 1,
	decimalPointsEyepieceApparentFOV: 0,
	decimalPointsMagnification: 0,
	decimalPointsResolution: 1,
	highlightColor: '#ffcccc',
	defaultColor: '#dddddd',
	noColor: '#ffffff',
	aperture_FocalRatio_FocalLength: '#ccccff',
	btnSecondaryActiveColor: '#ccffcc'
};

MLB.telescopeCriteriaCalc.common = {
	eyepiecesElement: function () {
		return $('#eyepieces');
	},
	focalRatioOrEyePupil_EyepieceFocalLength: function () {
		return $('input[name=focalRatioOrEyePupil_EyepieceFocalLength]');
	},
	btnCalcAperture: function () {
		return $('input[id=btnCalcAperture]');
	},
	btnCalcApertureFromFocalRatio_FocalLength: function () {
		return $('input[id=btnCalcApertureFromFocalRatio_FocalLength]');
	},
	btnCalcFocalRatio: function () {
		return $('input[id=btnCalcFocalRatio]');
	},
	btnCalcFocalRatioFromAperture_FocalLength: function () {
		return $('input[id=btnCalcFocalRatioFromAperture_FocalLength]');
	},
	btnCalcTelescopeFocalLengthFromAperture_FocalRatio: function () {
		return $('input[id=btnCalcTelescopeFocalLengthFromAperture_FocalRatio]');
	},
	btnCalcFOV: function () {
		return $('input[id=btnCalcFOV]');
	},
	btnCalcEyePupil: function () {
		return $('input[id=btnCalcEyePupil]');
	},
	btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil: function () {
		return $('input[id=btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil]');
	},
	btnCalcEyepieceWidestFieldForEyePupil: function () {
		return $('input[id=btnCalcEyepieceWidestFieldForEyePupil]');
	},
	btnCalcEyepieceFocalLength: function () {
		return $('input[id=btnCalcEyepieceFocalLength]');
	},
	btnCalcEyepieceFieldStop: function () {
		return $('input[id=btnCalcEyepieceFieldStop]');
	},
	btnCalcEyepieceFocalLengthFromFocalRatioEyePupil: function () {
		return $('input[id=btnCalcEyepieceFocalLengthFromFocalRatioEyePupil]');
	},
	btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength: function () {
		return $('input[id=btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength]');
	},
	btnCalcApertureFromLimitingMagnitude: function () {
		return $('input[id=btnCalcApertureFromLimitingMagnitude]');
	},
	apertureInches: function () {
		return $('input[name=apertureInches]');
	},
	focalRatio: function () {
		return $('input[name=focalRatio]');
	},
	telescopeFocalLength: function () {
		return $('input[name=telescopeFocalLength]');
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
	specs: function () {
		return $('td[id=specs]');
	},
	focalRatioChecked: function () {
		return this.focalRatioOrEyePupil_EyepieceFocalLength()[0].checked;
	},
	apertureInchesVal: function () {
		return +this.apertureInches().val();
	},
	focalRatioVal: function () {
		return +this.focalRatio().val();
	},
	telescopeFocalLengthVal: function () {
		return +this.telescopeFocalLength().val();
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
MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor = function (common) {
	if (common.useComaCorrectorMagVal()) {
		return common.comaCorrectorMagVal();
	}
	return 1;
};

MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitude = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    common = MLB.telescopeCriteriaCalc.common,
	    config = MLB.telescopeCriteriaCalc.config,
	    limitingMagnitude = MLB.calcLib.limitingMagnitude,
		highMagnificationMagnitudeLimit = limitingMagnitude(common.apertureInchesVal()),
		lowMagnificationMagnitudeLimit = highMagnificationMagnitudeLimit - 1;

	common.limitingMagnitude().val(roundToDecimal(lowMagnificationMagnitudeLimit, config.decimalPointsLimitingMagnitude));
};

MLB.telescopeCriteriaCalc.displaySpecs = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		focalRatioChecked = common.focalRatioChecked(),
		calcDisplayLimitingMagnitude = MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitude,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		focalRatio,
		telescopeFocalLength,
		eyePupilmm,
		magnification,
		maxMagnification,
		resolutionArcsec,
		theoreticalResolutionArcsec;

	calcDisplayLimitingMagnitude();

	if (focalRatioChecked) {
		// ignore eyepiece focal length here
		// must calc eyePupilmm
		eyePupilmm = common.eyepieceFocalLengthmmVal() / common.focalRatioVal() / comaCorrectorMag;
		common.eyePupilmm().val(roundToDecimal(eyePupilmm, config.decimalPointsEyePupil));
	} else {
		// must calc focalRatio
		focalRatio = common.eyepieceFocalLengthmmVal() / common.eyePupilmmVal() / comaCorrectorMag;
		common.focalRatio().val(roundToDecimal(focalRatio, config.decimalPointsFocalRatio));
	}

	telescopeFocalLength = common.focalRatioVal() * common.apertureInchesVal();
	common.telescopeFocalLength().val(roundToDecimal(telescopeFocalLength, config.decimalPointsTelescopeFocalLength));

	magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4;
	maxMagnification = 27 * common.apertureInchesVal();
	resolutionArcsec = 240 / magnification;
	theoreticalResolutionArcsec = 4.5 / common.apertureInchesVal();

	common.specs().html('magnification = '
		+ roundToDecimal(magnification, config.decimalPointsMagnification)
		+ 'x, max = '
		+ roundToDecimal(maxMagnification, config.decimalPointsMagnification)
		+ 'x; resolution = '
		+ roundToDecimal(resolutionArcsec, config.decimalPointsResolution)
		+ ' arc seconds (theoretical = '
		+ roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution)
		+ ')');
};

MLB.telescopeCriteriaCalc.calcAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil,
		calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		focalRatioChecked = common.focalRatioChecked(),
		resultAperture;

	if (focalRatioChecked) {
		resultAperture = calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.FOVdegVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
	} else {
		resultAperture = calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil(common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
	}
	common.apertureInches().val(roundToDecimal(resultAperture, config.decimalPointsAperture));
	displaySpecs();
};

MLB.telescopeCriteriaCalc.calcFOV = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		focalRatioChecked = common.focalRatioChecked(),
		resultFOV;

	if (focalRatioChecked) {
		resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
	} else {
		resultFOV = calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
	}

	common.FOVdeg().val(roundToDecimal(resultFOV, config.decimalPointsFOV));
	displaySpecs();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStop = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
	    displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil,
		calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		focalRatioChecked = common.focalRatioChecked(),
		resultEyepieceFieldStop;

	if (focalRatioChecked) {
		resultEyepieceFieldStop = calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.focalRatioVal(), comaCorrectorMag);
	} else {
		resultEyepieceFieldStop = calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyePupilmmVal());
	}
	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStop, config.decimalPointsEyepieceFieldStop));
	displaySpecs();
};

MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		apertureInchesFromMagnitude = MLB.calcLib.apertureInchesFromMagnitude,
		// lower power reduces limiting magnitude by ~1 mag
		resultAperture = apertureInchesFromMagnitude(common.limitingMagnitudeVal() + 1);

	common.apertureInches().val(roundToDecimal(resultAperture, config.decimalPointsAperture));
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFieldStopmm = common.eyepieceFocalLengthmmVal() * common.eyepieceApparentFielddegVal() / 57.3;

	common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStopmm, config.decimalPointsEyepieceFieldStop));
};

MLB.telescopeCriteriaCalc.calcEyepieceFocalLengthFromFocalRatioEyePupil = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		resultEyepieceFocalLengthmm = common.focalRatioVal() * common.eyePupilmmVal() * comaCorrectorMag;

	common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, config.decimalPointsEyepieceFL));
};

MLB.telescopeCriteriaCalc.calcFocalRatio = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor,
		displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		common = MLB.telescopeCriteriaCalc.common,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		resultFocalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);

	common.focalRatio().val(roundToDecimal(resultFocalRatio, config.decimalPointsFocalRatio));
	displaySpecs();
};

MLB.telescopeCriteriaCalc.calcEyePupil = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyePupilmm = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal());

	common.eyePupilmm().val(roundToDecimal(resultEyePupilmm, config.decimalPointsEyePupil));
	displaySpecs();
};

MLB.telescopeCriteriaCalc.calcEyepieceFocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil = MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil,
		displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFocalLengthmm = calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

	common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, config.decimalPointsEyepieceFL));
	displaySpecs();
};

MLB.telescopeCriteriaCalc.calcApertureFromFocalRatio_FocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		resultAperture = common.telescopeFocalLengthVal() / common.focalRatioVal();

	common.apertureInches().val(roundToDecimal(resultAperture, config.decimalPointsAperture));
};

MLB.telescopeCriteriaCalc.calcFocalRatioFromAperture_FocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		resultFocalRatio = common.telescopeFocalLengthVal() / common.apertureInchesVal();

	common.focalRatio().val(roundToDecimal(resultFocalRatio, config.decimalPointsFocalRatio));
};

MLB.telescopeCriteriaCalc.calcTelescopeFocalLengthFromAperture_FocalRatio = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		resultTelescopeFocalLength = common.apertureInchesVal() * common.focalRatioVal();

	common.telescopeFocalLength().val(roundToDecimal(resultTelescopeFocalLength, config.decimalPointsTelescopeFocalLength));
};

MLB.telescopeCriteriaCalc.setSelectedEyepiece = function (eyepiecesIx) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		eyepiecesJson = MLB.eyepiecesJson,
	    eyepiece = eyepiecesJson.eyepieces[eyepiecesIx];

	common.eyepieceFocalLengthmm().val(roundToDecimal(+eyepiece.focalLengthmm, config.decimalPointsEyepieceFL));
	common.eyepieceFieldStopmm().val(roundToDecimal(+eyepiece.fieldStopmm, config.decimalPointsEyepieceFieldStop));
	common.eyepieceApparentFielddeg().val(roundToDecimal(+eyepiece.apparentField, config.decimalPointsEyepieceApparentFOV));
};

MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldFromFocalRatio_EyePupil = function () {
	var common = MLB.telescopeCriteriaCalc.common,
		eyepiecesJson = MLB.eyepiecesJson,
		setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		targetEyepieceFLmm = common.focalRatioVal() * common.eyePupilmmVal() * comaCorrectorMag,
		bestFitEyepiece,
		bestFitDeviation,
		bestIx,
		eyepieceDeviation;

	$.each(eyepiecesJson.eyepieces, function (i, v) {
		eyepieceDeviation = Math.abs(v.focalLengthmm - targetEyepieceFLmm);
		if (bestFitDeviation === undefined || eyepieceDeviation < bestFitDeviation || (eyepieceDeviation === bestFitDeviation && +v.apparentField > +bestFitEyepiece.apparentField)) {
			bestFitDeviation = eyepieceDeviation;
			bestFitEyepiece = v;
			bestIx = i;
		}
	});
	common.eyepiecesElement().get(0).selectedIndex = bestIx;
	setSelectedEyepiece(bestIx);
	// update FOV to view widest field results
	calcFOV();
};

MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldForEyePupil = function () {
	var common = MLB.telescopeCriteriaCalc.common,
		eyepiecesJson = MLB.eyepiecesJson,	
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		bestFitEyepiece,
		bestFOV,
		bestIx,
		eyePupil,
		FOV;

	$.each(eyepiecesJson.eyepieces, function (i, v) {
		FOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), +v.fieldStopmm, comaCorrectorMag);
		eyePupil = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), FOV, +v.focalLengthmm, +v.fieldStopmm);
		if (eyePupil <= common.eyePupilmmVal() && (bestFOV === undefined || bestFOV < FOV)) {
			bestFOV = FOV;
			bestFitEyepiece = v;
			bestIx = i;
		}
	});
	common.eyepiecesElement().get(0).selectedIndex = bestIx;
	setSelectedEyepiece(bestIx);
	// update FOV to view widest field results
	calcFOV();
};

MLB.telescopeCriteriaCalc.processFocalRatioChecked = function () {
	var common = MLB.telescopeCriteriaCalc.common,
	    config = MLB.telescopeCriteriaCalc.config,
		state = MLB.telescopeCriteriaCalc.state,
		focalRatioChecked = common.focalRatioChecked();

	common.btnCalcEyePupil().val('Calc using aperture, FOV, eyepiece FL, field stop');
	common.btnCalcEyepieceFocalLength().val('Calc using aperture, FOV, eye pupil, field stop');

	if (focalRatioChecked !== state.focalRatioChecked) {
		if (focalRatioChecked) {
			common.apertureInches().css({backgroundColor: config.highlightColor});
			common.focalRatio().css({backgroundColor: config.highlightColor});
			common.FOVdeg().css({backgroundColor: config.highlightColor});
			common.eyepieceFieldStopmm().css({backgroundColor: config.highlightColor});
			common.eyePupilmm().css({backgroundColor: config.noColor});
			common.eyepieceFocalLengthmm().css({backgroundColor: config.noColor});

			common.btnCalcFocalRatio().css({backgroundColor: config.highlightColor});
			common.btnCalcEyePupil().css({backgroundColor: config.defaultColor});
			common.btnCalcEyepieceFocalLength().css({backgroundColor: config.defaultColor});

			common.btnCalcAperture().val('Calc using FOV, focal ratio, field stop');
			common.btnCalcFocalRatio().val('Calc using aperture, FOV, field stop');
			common.btnCalcFOV().val('Calc using aperture, focal ratio, field stop');
			common.btnCalcEyepieceFieldStop().val('Calc using aperture, FOV, focal ratio');

			common.btnCalcFocalRatio().removeAttr('disabled');
			common.btnCalcEyePupil().attr('disabled', 'disabled');
			common.btnCalcEyepieceFocalLength().attr('disabled', 'disabled');
		} else {
			common.apertureInches().css({backgroundColor: config.highlightColor});
			common.FOVdeg().css({backgroundColor: config.highlightColor});
			common.eyePupilmm().css({backgroundColor: config.highlightColor});
			common.eyepieceFocalLengthmm().css({backgroundColor: config.highlightColor});
			common.eyepieceFieldStopmm().css({backgroundColor: config.highlightColor});
			common.focalRatio().css({backgroundColor: config.aperture_FocalRatio_FocalLength});

			common.btnCalcFocalRatio().css({backgroundColor: config.defaultColor});
			common.btnCalcEyePupil().css({backgroundColor: config.highlightColor});
			common.btnCalcEyepieceFocalLength().css({backgroundColor: config.highlightColor});

			common.btnCalcAperture().val('Calc using FOV, eye pupil, eyepiece FL, field stop');
			common.btnCalcFOV().val('Calc using aperture, eye pupil, eyepiece FL, field stop');
			common.btnCalcEyepieceFieldStop().val('Calc using aperture, FOV, eye pupil, eyepiece FL');

			common.btnCalcFocalRatio().attr('disabled', 'disabled');
			common.btnCalcEyePupil().removeAttr('disabled');
			common.btnCalcEyepieceFocalLength().removeAttr('disabled');
		}
		state.focalRatioChecked = common.focalRatioChecked();
	}
};

$(window).ready(function () {
	var calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
	    calcApertureFromFocalRatio_FocalLength = MLB.telescopeCriteriaCalc.calcApertureFromFocalRatio_FocalLength,
		calcFocalRatio = MLB.telescopeCriteriaCalc.calcFocalRatio,
		calcFocalRatioFromAperture_FocalLength = MLB.telescopeCriteriaCalc.calcFocalRatioFromAperture_FocalLength,
		calcTelescopeFocalLengthFromAperture_FocalRatio = MLB.telescopeCriteriaCalc.calcTelescopeFocalLengthFromAperture_FocalRatio,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		calcEyePupil = MLB.telescopeCriteriaCalc.calcEyePupil,
		calcEyepieceWidestFieldFromFocalRatio_EyePupil = MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldFromFocalRatio_EyePupil,
		calcEyepieceWidestFieldForEyePupil = MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldForEyePupil,
		calcEyepieceFocalLength = MLB.telescopeCriteriaCalc.calcEyepieceFocalLength,
	    calcEyepieceFieldStop = MLB.telescopeCriteriaCalc.calcEyepieceFieldStop,
		calcEyepieceFocalLengthFromFocalRatioEyePupil = MLB.telescopeCriteriaCalc.calcEyepieceFocalLengthFromFocalRatioEyePupil,
		displaySpecs = MLB.telescopeCriteriaCalc.displaySpecs,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL,
		calcApertureFromLimitingMagnitude = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude,
		processFocalRatioChecked = MLB.telescopeCriteriaCalc.processFocalRatioChecked,
		setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
	    common = MLB.telescopeCriteriaCalc.common,
		eyepiecesJson = MLB.eyepiecesJson,
		eyepieceStr;

	// event hookups/subscribes
	common.btnCalcAperture().click(function () {
		calcAperture();
	});
	common.btnCalcApertureFromFocalRatio_FocalLength().click(function () {
		calcApertureFromFocalRatio_FocalLength();
	});
	common.btnCalcFocalRatio().click(function () {
		calcFocalRatio();
	});
	common.btnCalcFocalRatioFromAperture_FocalLength().click(function () {
		calcFocalRatioFromAperture_FocalLength();
	});
	common.btnCalcTelescopeFocalLengthFromAperture_FocalRatio().click(function () {
		calcTelescopeFocalLengthFromAperture_FocalRatio();
	});
	common.btnCalcFOV().click(function () {
		calcFOV();
	});
	common.btnCalcEyePupil().click(function () {
		calcEyePupil();
	});
	common.btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil().click(function () {
		calcEyepieceWidestFieldFromFocalRatio_EyePupil();
	});
	common.btnCalcEyepieceWidestFieldForEyePupil().click(function () {
		calcEyepieceWidestFieldForEyePupil();
	});
	common.btnCalcEyepieceFocalLength().click(function () {
		calcEyepieceFocalLength();
	});
	common.btnCalcEyepieceFieldStop().click(function () {
		calcEyepieceFieldStop();
	});
	common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().click(function () {
		calcEyepieceFocalLengthFromFocalRatioEyePupil();
	});
	common.btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength().click(function () {
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL();
	});
	common.btnCalcApertureFromLimitingMagnitude().click(function () {
		calcApertureFromLimitingMagnitude();
	});

	// sort eyepieces: manufacturer, type, descending focal length;
	eyepiecesJson.eyepieces = eyepiecesJson.eyepieces.sort(function (x, y) {
		var xFL = +x.focalLengthmm,
		    yFL = +y.focalLengthmm;

		if (x.manufacturer === y.manufacturer) {
			if (x.type === y.type) {
				return xFL > yFL ? -1 : xFL < yFL ? 1 : 0;
			}
			return x.type > y.type ? 1 : -1;
		}
		return x.manufacturer > y.manufacturer ? 1 : -1;
	});

	// fill select eyepiece drop down box
	$.each(eyepiecesJson.eyepieces, function (i, v) {
		// fill in missing field stops
		if (v.fieldStopmm === '') {
			v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
		}
		eyepieceStr = v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + 'mm';
		common.eyepiecesElement().append('<option value="' + eyepieceStr + '">' + eyepieceStr + '</option>');
	});
	// wire up selected eyepiece change
	common.eyepiecesElement().change(function () {
		setSelectedEyepiece(this.selectedIndex);
	});

	processFocalRatioChecked();
	common.focalRatioOrEyePupil_EyepieceFocalLength().click(function () {
		processFocalRatioChecked();
	});

	// calc and display specs for form default
	common.eyepiecesElement().val('Explore Scientific 82 series 24mm');
	displaySpecs();
});

// end of file