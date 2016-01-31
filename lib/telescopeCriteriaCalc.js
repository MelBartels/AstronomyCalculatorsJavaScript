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
	decimalPointsFOV: 2,
	decimalPointsEyePupil: 2,
	decimalPointsEyepieceFL: 1,
	decimalPointsEyepieceFieldStop: 1,
	decimalPointsEyepieceApparentFOV: 0,
	decimalPointsTelescopeFocalLength: 0,
	decimalPointsMagnification: 0,
	decimalPointsResolution: 1
};

MLB.telescopeCriteriaCalc.common = {
	focalRatioOrEyePupil_EyepieceFocalLength: function () {
		return $('input[name=focalRatioOrEyePupil_EyepieceFocalLength]');
	},
	btnCalcAperture: function () {
		return $('input[id=btnCalcAperture]');
	},
	btnCalcFocalRatio: function () {
		return $('input[id=btnCalcFocalRatio]');
	},
	btnCalcFOV: function () {
		return $('input[id=btnCalcFOV]');
	},
	btnCalcEyePupil: function () {
		return $('input[id=btnCalcEyePupil]');
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
	focalRatioChecked: function () {
		return this.focalRatioOrEyePupil_EyepieceFocalLength()[0].checked;
	},
	apertureInchesVal: function () {
		return +this.apertureInches().val();
	},
	focalRatioVal: function () {
		return +this.focalRatio().val();
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

MLB.telescopeCriteriaCalc.displayDetails = function () {
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
		resolutionArcsec;

	calcDisplayLimitingMagnitude();

	if (focalRatioChecked) {
		// ignore eyepiece focal length here
		// must calc eyePupilmm
		eyePupilmm = common.eyepieceFocalLengthmmVal() / common.focalRatioVal() / comaCorrectorMag,
		common.eyePupilmm().val(roundToDecimal(eyePupilmm, config.decimalPointsEyePupil));
	} else {
		// must calc focalRatio
		focalRatio = common.eyepieceFocalLengthmmVal() / common.eyePupilmmVal() / comaCorrectorMag,
		common.focalRatio().val(roundToDecimal(focalRatio, config.decimalPointsFocalRatio));
	}

	telescopeFocalLength = common.focalRatioVal() * common.apertureInchesVal(),
	magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4,
	resolutionArcsec = 240 / magnification;

	common.details().html('telescope focal length = '
	    + roundToDecimal(telescopeFocalLength, config.decimalPointsTelescopeFocalLength)
	    + ' inches, magnification = '
		+ roundToDecimal(magnification, config.decimalPointsMagnification)
		+ 'x, resolution = '
		+ roundToDecimal(resolutionArcsec, config.decimalPointsResolution)
		+ ' arc seconds');
};

MLB.telescopeCriteriaCalc.calcAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
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
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcFOV = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
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
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStop = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
	    displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
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
	displayDetails();
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
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		resultFocalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);

	common.focalRatio().val(roundToDecimal(resultFocalRatio, config.decimalPointsFocalRatio));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyePupil = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyePupilmm = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal());

	common.eyePupilmm().val(roundToDecimal(resultEyePupilmm, config.decimalPointsEyePupil));
	displayDetails();
};

MLB.telescopeCriteriaCalc.calcEyepieceFocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil = MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFocalLengthmm = calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

	common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, config.decimalPointsEyepieceFL));
	displayDetails();
};

MLB.telescopeCriteriaCalc.changeSelectedEyepiece = function (e) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		eyepiecesJson = MLB.eyepiecesJson,
	    eyepiece = eyepiecesJson.eyepieces[e.selectedIndex];

	common.eyepieceFocalLengthmm().val(roundToDecimal(+eyepiece.focalLengthmm, config.decimalPointsEyepieceFL));
	common.eyepieceFieldStopmm().val(roundToDecimal(+eyepiece.fieldStopmm, config.decimalPointsEyepieceFieldStop));
	common.eyepieceApparentFielddeg().val(roundToDecimal(+eyepiece.apparentField, config.decimalPointsEyepieceApparentFOV));
	//alert('text=' + $("option:selected", e).text() + ' fl=' + eyepiece.focalLengthmm);
};

MLB.telescopeCriteriaCalc.processFocalRatioChecked = function () {
	var common = MLB.telescopeCriteriaCalc.common,
		state = MLB.telescopeCriteriaCalc.state,
		focalRatioChecked = common.focalRatioChecked();

	if (focalRatioChecked !== state.focalRatioChecked) {
		if (focalRatioChecked) {
			common.btnCalcFocalRatio().removeAttr('disabled');
			common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().removeAttr('disabled');
			common.btnCalcEyePupil().attr('disabled', 'disabled');
			common.btnCalcEyepieceFocalLength().attr('disabled', 'disabled');
		} else {
			common.btnCalcFocalRatio().attr('disabled', 'disabled');
			common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().attr('disabled', 'disabled');
			common.btnCalcEyePupil().removeAttr('disabled');
			common.btnCalcEyepieceFocalLength().removeAttr('disabled');
		}
		state.focalRatioChecked = common.focalRatioChecked();
	}
};

$(window).ready(function () {
	var calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
		calcFocalRatio = MLB.telescopeCriteriaCalc.calcFocalRatio,
		calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
		calcEyePupil = MLB.telescopeCriteriaCalc.calcEyePupil,
		calcEyepieceFocalLength = MLB.telescopeCriteriaCalc.calcEyepieceFocalLength,
	    calcEyepieceFieldStop = MLB.telescopeCriteriaCalc.calcEyepieceFieldStop,
		calcEyepieceFocalLengthFromFocalRatioEyePupil = MLB.telescopeCriteriaCalc.calcEyepieceFocalLengthFromFocalRatioEyePupil,
		displayDetails = MLB.telescopeCriteriaCalc.displayDetails,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL,
		calcApertureFromLimitingMagnitude = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude,
		processFocalRatioChecked = MLB.telescopeCriteriaCalc.processFocalRatioChecked,
	    common = MLB.telescopeCriteriaCalc.common,
		changeSelectedEyepiece = MLB.telescopeCriteriaCalc.changeSelectedEyepiece,
		eyepiecesElement = $('#eyepieces'),
		eyepiecesJson = MLB.eyepiecesJson,
		str;

	// event hookups/subscribes
	common.btnCalcAperture().click(function () {
		calcAperture();
	});
	common.btnCalcFocalRatio().click(function () {
		calcFocalRatio();
	});
	common.btnCalcFOV().click(function () {
		calcFOV();
	});
	common.btnCalcEyePupil().click(function () {
		calcEyePupil();
	});
	common.btnCalcEyepieceFocalLength().click(function () {
		calcEyepieceFocalLength();
	});
	common.btnCalcEyepieceFieldStop().click(function () {
		calcEyepieceFieldStop();
	});
	common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().click(function () {
		calcEyepieceFocalLengthFromFocalRatioEyePupil();
	}),
	common.btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength().click(function () {
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL();
	});
	common.btnCalcApertureFromLimitingMagnitude().click(function () {
		calcApertureFromLimitingMagnitude();
	});

	// fill select eyepiece drop down box
	$.each(eyepiecesJson.eyepieces, function (i, v) {
		if (v.fieldStopmm === '') {
			v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
		}
		str = '<option value="' + v.type + '">' + v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + 'mm ' + '</option>';
		eyepiecesElement.append(str);
	});
	// wire up selected eyepiece change
	eyepiecesElement.change(function () {
		changeSelectedEyepiece(this);
	});

	processFocalRatioChecked();
	common.focalRatioOrEyePupil_EyepieceFocalLength().click(function () {
		processFocalRatioChecked();
	});

	// calc and display details for form default
	displayDetails();
});

// end of file