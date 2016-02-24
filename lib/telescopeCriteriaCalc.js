// copyright Mel Bartels, 2016

'use strict';

MLB.telescopeCriteriaCalc = {};

MLB.telescopeCriteriaCalc.state = {
	focalRatioChecked: undefined,
	eyeOptRowSet: []
};

MLB.telescopeCriteriaCalc.config = {
	inchesLit: ' (inches)',
	mmLit: ' (mm)',
	equalsLit: ' = ',

	calcAperture4ParmsLit: 'calc from FOV, focal ratio, field stop',
	calcFOV4ParmsLit: 'calc from aperture, focal ratio, field stop',
	calcEyepieceFieldStop4ParmsLit: 'calc from aperture, FOV, focal ratio',
	calcAperture5ParmsLit: 'calc from FOV, eye pupil, eyepiece FL, field stop',
	calcFOV5ParmsLit: 'calc from aperture, eye pupil, eyepiece FL, field stop',
	calcEyepieceFieldStop5ParmsLit: 'calc from aperture, FOV, eye pupil, eyepiece FL',

	apertureLabelLit: 'Aperture',
	focalLengthLabelLit: 'Focal length',
	focuserRackedInHeightLabelLit: 'Racked in height',
	focuserTravelLabelLit: 'Focuser tube travel',
	focuserInwardFocusingDistanceLabelLit: 'Desired inward focusing distance',
	tubeODLabelLit: 'Outside diameter',
	tubeThicknessLabelLit: 'Thickness',
	diagToFocalPlaneDistanceLabelLit: 'Diagonal to focal plane distance',
	diagSizesLabelLit: 'Sizes (m.a.) to select from',

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
	decimalPointsFocuser: 3,
	decimalPointsTube: 3,
	decimalPointsDiagOffset: 2,

	eyepieceRows: 5,

	tubeClearanceInches: 2,

	diagonalsInches: [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12],
	diagonalsMm: [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300]
};

MLB.telescopeCriteriaCalc.common = {
	EyeOptSelectID: 'EyeOptSelect',
	EyeOptManufacturerID: 'EyeOptManufacturer',
	EyeOptTypeID: 'EyeOptType',
	EyeOptFocalLengthID: 'EyeOptFocalLength',
	EyeOptFieldStopID: 'EyeOptFieldStop',
	EyeOptApparentFieldID: 'EyeOptApparentField',
	EyeOptExitPupilID: 'EyeOptExitPupil',
	EyeOptFOVID: 'EyeOptFOV',
	EyeOptMagnificationID: 'EyeOptMagnification',
	EyeOptResolutionID: 'EyeOptResolution',

	EyeOptElement: function (ID, idIx) {
		return $('[id=' + ID + idIx + ']');
	},

	radBtnFocalRatioOrEyePupil_EyepieceFocalLength: function () {
		return $('[name=radBtnFocalRatioOrEyePupil_EyepieceFocalLength]');
	},
	btnUom: function () {
		return $('[name=uom]');
	},
	btnCalcAperture: function () {
		return $('[id=btnCalcAperture]');
	},
	btnCalcApertureFromFocalRatio_FocalLength: function () {
		return $('[id=btnCalcApertureFromFocalRatio_FocalLength]');
	},
	btnCalcFocalRatio: function () {
		return $('[id=btnCalcFocalRatio]');
	},
	btnCalcFocalRatioFromAperture_FocalLength: function () {
		return $('[id=btnCalcFocalRatioFromAperture_FocalLength]');
	},
	btnCalcTelescopeFocalLengthFromAperture_FocalRatio: function () {
		return $('[id=btnCalcTelescopeFocalLengthFromAperture_FocalRatio]');
	},
	btnCalcFOV: function () {
		return $('[id=btnCalcFOV]');
	},
	btnCalcEyePupil: function () {
		return $('[id=btnCalcEyePupil]');
	},
	btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil: function () {
		return $('[id=btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil]');
	},
	btnCalcEyepieceWidestFieldForEyePupil: function () {
		return $('[id=btnCalcEyepieceWidestFieldForEyePupil]');
	},
	btnCalcEyepieceFocalLength: function () {
		return $('[id=btnCalcEyepieceFocalLength]');
	},
	btnCalcEyepieceFieldStop: function () {
		return $('[id=btnCalcEyepieceFieldStop]');
	},
	btnCalcEyepieceFocalLengthFromFocalRatioEyePupil: function () {
		return $('[id=btnCalcEyepieceFocalLengthFromFocalRatioEyePupil]');
	},
	btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength: function () {
		return $('[id=btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength]');
	},
	btnCalcApertureFromLimitingMagnitude: function () {
		return $('[id=btnCalcApertureFromLimitingMagnitude]');
	},
	btnUpdateDiagIllum: function () {
		return $('[id=btnUpdateDiagIllum]');
	},

	apertureLabel: function () {
		return $('[name=apertureLabel]');
	},
	focalLengthLabel: function () {
		return $('[name=focalLengthLabel]');
	},
	focuserRackedInHeightLabel: function () {
		return $('[name=focuserRackedInHeightLabel]');
	},
	focuserTravelLabel: function () {
		return $('[name=focuserTravelLabel]');
	},
	focuserInwardFocusingDistanceLabel: function () {
		return $('[name=focuserInwardFocusingDistanceLabel]');
	},
	tubeODLabel: function () {
		return $('[name=tubeODLabel]');
	},
	tubeThicknessLabel: function () {
		return $('[name=tubeThicknessLabel]');
	},
	diagToFocalPlaneDistanceLabel: function () {
		return $('[name=diagToFocalPlaneDistanceLabel]');
	},
	diagSizesLabel: function () {
		return $('[name=diagSizesLabel]');
	},
	diagNotes: function () {
		return $('[id=diagNotes]');
	},

	aperture: function () {
		return $('[name=aperture]');
	},
	focalRatio: function () {
		return $('[name=focalRatio]');
	},
	telescopeFocalLength: function () {
		return $('[name=telescopeFocalLength]');
	},
	FOVdeg: function () {
		return $('[name=FOVdeg]');
	},
	eyePupilmm: function () {
		return $('[name=eyePupilmm]');
	},
	eyepieceFocalLengthmm: function () {
		return $('[name=eyepieceFocalLengthmm]');
	},
	eyepieceFieldStopmm: function () {
		return $('[name=eyepieceFieldStopmm]');
	},
	eyepieceApparentFielddeg: function () {
		return $('[name=eyepieceApparentFielddeg]');
	},
	limitingMagnitude: function () {
		return $('[name=limitingMagnitude]');
	},
	useComaCorrectorMagVal: function () {
		return $('[name=chBoxUseComaCorrector]').is(':checked');
	},
	comaCorrectorMag: function () {
		return $('[name=comaCorrectorMag]');
	},
	specs: function () {
		return $('[id=specs]');
	},
	comaCorrectorSelect: function () {
		return $('#comaCorrectorSelect');
	},
	eyepieceSelect: function () {
		return $('#eyepieceSelect');
	},
	eyeOptTableBody: function () {
		return $('#eyeOptTableBody');
	},
	focuserSelect: function () {
		return $('#focuserSelect');
	},
	focuserRackedInHeight: function () {
		return $('[name=focuserRackedInHeight]');
	},
	focuserTravel: function () {
		return $('[name=focuserTravel]');
	},
	focuserInwardFocusingDistance: function () {
		return $('[name=focuserInwardFocusingDistance]');
	},
	telescopeTubeOD: function () {
		return $('[name=telescopeTubeOD]');
	},
	telescopeTubeThickness: function () {
		return $('[name=telescopeTubeThickness]');
	},
	diagToFocalPlaneDistance: function () {
		return $('[name=diagToFocalPlaneDistance]');
	},
	acceptableMagLoss: function () {
		return $('[name=acceptableMagLoss]');
	},
	diagSizes: function () {
		return $('[name=diagSizes]');
	},
	diagChartID: function () {
		return 'diagChart';
	},

	focalRatioChecked: function () {
		return this.radBtnFocalRatioOrEyePupil_EyepieceFocalLength()[0].checked;
	},
	inInches: function () {
		return this.btnUom()[0].checked;
	},
	convertToInches: function (value) {
		if (this.inInches()) {
			return value;
		}
		return value / 25.4;
	},
	convertInchesToUom: function (inches) {
		if (this.inInches()) {
			return inches;
		}
		return inches * 25.4;
	},
	apertureInchesVal: function () {
		return this.convertToInches(+this.aperture().val());
	},
	focalRatioVal: function () {
		return +this.focalRatio().val();
	},
	telescopeFocalLengthInchesVal: function () {
		return this.convertToInches(+this.telescopeFocalLength().val());
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
	focuserRackedInHeightInchesVal: function () {
		return this.convertToInches(+this.focuserRackedInHeight().val());
	},
	focuserTravelInchesVal: function () {
		return this.convertToInches(+this.focuserTravel().val());
	},
	focuserInwardFocusingDistanceInchesVal: function () {
		return this.convertToInches(+this.focuserInwardFocusingDistance().val());
	},
	telescopeTubeODInchesVal: function () {
		return this.convertToInches(+this.telescopeTubeOD().val());
	},
	telescopeTubeThicknessInchesVal: function () {
		return this.convertToInches(+this.telescopeTubeThickness().val());
	},
	diagToFocalPlaneDistanceInchesVal: function () {
		return this.convertToInches(+this.diagToFocalPlaneDistance().val());
	},
	acceptableMagLossVal: function () {
		return +this.acceptableMagLoss().val();
	},
	diagSizesVal: function () {
		return this.diagSizes().val();
	}
};

MLB.telescopeCriteriaCalc.updateEyepieceOptimizerRows = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    state = MLB.telescopeCriteriaCalc.state,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		eyepieceFocalLengthmm,
		eyepieceFieldStopmm,
		exitPupil,
		resultFOV,
		magnification,
		resolutionArcsec,
	    ix;

	// update eixt pupil, true field of view, magnification, resolution for each eyepiece row that's been selected
	for (ix = 0; ix < config.eyepieceRows; ix++) {
		if (state.eyeOptRowSet[ix] === true) {
			// get reused vars from page
			eyepieceFocalLengthmm = parseFloat(common.EyeOptElement(common.EyeOptFocalLengthID, ix).html());
			eyepieceFieldStopmm = parseFloat(common.EyeOptElement(common.EyeOptFieldStopID, ix).html());
			// calc
			exitPupil = eyepieceFocalLengthmm / common.focalRatioVal();
			magnification = common.telescopeFocalLengthInchesVal() / eyepieceFocalLengthmm * 25.4 * comaCorrectorMag;
			resolutionArcsec = resolutionFromAperture_Magnification(common.apertureInchesVal(), magnification);
			// ensure that focal ratio has been calculated and updated prior
			resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), eyepieceFieldStopmm, comaCorrectorMag);
			// display
			common.EyeOptElement(common.EyeOptExitPupilID, ix).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + 'mm');
			common.EyeOptElement(common.EyeOptFOVID, ix).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + ' deg');
			common.EyeOptElement(common.EyeOptMagnificationID, ix).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
			common.EyeOptElement(common.EyeOptResolutionID, ix).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');
		}
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

MLB.telescopeCriteriaCalc.updateSpecs = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		focalRatioChecked = common.focalRatioChecked(),
		calcDisplayLimitingMagnitude = MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitude,
		resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
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
	common.telescopeFocalLength().val(roundToDecimal(common.convertInchesToUom(telescopeFocalLength), config.decimalPointsTelescopeFocalLength));

	magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4;
	maxMagnification = 27 * common.apertureInchesVal();
	resolutionArcsec = resolutionFromAperture_Magnification(common.apertureInchesVal(), magnification);
	theoreticalResolutionArcsec = 4.6 / common.apertureInchesVal();

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

MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		newTubeOD = common.apertureInchesVal() + common.telescopeTubeThicknessInchesVal() * 2 + config.tubeClearanceInches,
		newDiagToFocalPlaneDistance = newTubeOD / 2 + common.focuserRackedInHeightInchesVal() + common.focuserInwardFocusingDistanceInchesVal();

	common.telescopeTubeOD().val(roundToDecimal(common.convertInchesToUom(newTubeOD), config.decimalPointsTube));
	common.diagToFocalPlaneDistance().val(roundToDecimal(common.convertInchesToUom(newDiagToFocalPlaneDistance), config.decimalPointsTube));
};

MLB.telescopeCriteriaCalc.updateFollowOnFields = function (aperture) {
	var updateFieldsDependentOnAperture = MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture,
	    updateSpecs = MLB.telescopeCriteriaCalc.updateSpecs,
		updateEyepieceOptimizerRows = MLB.telescopeCriteriaCalc.updateEyepieceOptimizerRows,
		graphDiagIllum = MLB.telescopeCriteriaCalc.graphDiagIllum;

	if (aperture !== undefined) {
		updateFieldsDependentOnAperture();
	}
	updateSpecs();
	updateEyepieceOptimizerRows();
	graphDiagIllum();
};

MLB.telescopeCriteriaCalc.calcAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil,
		calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		focalRatioChecked = common.focalRatioChecked(),
		resultApertureInches;

	if (focalRatioChecked) {
		resultApertureInches = calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.FOVdegVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
	} else {
		resultApertureInches = calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil(common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
	}
	common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
	updateFollowOnFields('aperture');
};

MLB.telescopeCriteriaCalc.calcFOV = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
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
	updateFollowOnFields();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStop = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
	    updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
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
	updateFollowOnFields();
};

MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		updateFieldsDependentOnAperture = MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture,
		apertureInchesFromMagnitude = MLB.calcLib.apertureInchesFromMagnitude,
		// lower power reduces limiting magnitude by ~1 mag
		resultApertureInches = apertureInchesFromMagnitude(common.limitingMagnitudeVal() + 1);

	common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
	updateFieldsDependentOnAperture();
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
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		common = MLB.telescopeCriteriaCalc.common,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		resultFocalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);

	common.focalRatio().val(roundToDecimal(resultFocalRatio, config.decimalPointsFocalRatio));
	updateFollowOnFields();
};

MLB.telescopeCriteriaCalc.calcEyePupil = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyePupilmm = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal());

	common.eyePupilmm().val(roundToDecimal(resultEyePupilmm, config.decimalPointsEyePupil));
	updateFollowOnFields();
};

MLB.telescopeCriteriaCalc.calcEyepieceFocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil = MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil,
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		common = MLB.telescopeCriteriaCalc.common,
		resultEyepieceFocalLengthmm = calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

	common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, config.decimalPointsEyepieceFL));
	updateFollowOnFields();
};

MLB.telescopeCriteriaCalc.calcApertureFromFocalRatio_FocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		updateFieldsDependentOnAperture = MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture,
		resultApertureInches = common.telescopeFocalLengthInchesVal() / common.focalRatioVal();

	common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
	updateFieldsDependentOnAperture();
};

MLB.telescopeCriteriaCalc.calcFocalRatioFromAperture_FocalLength = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		resultFocalRatio = common.telescopeFocalLengthInchesVal() / common.apertureInchesVal();

	common.focalRatio().val(roundToDecimal(resultFocalRatio, config.decimalPointsFocalRatio));
};

MLB.telescopeCriteriaCalc.calcTelescopeFocalLengthFromAperture_FocalRatio = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
		common = MLB.telescopeCriteriaCalc.common,
		resultTelescopeFocalLengthInches = common.apertureInchesVal() * common.focalRatioVal();

	common.telescopeFocalLength().val(roundToDecimal(common.convertInchesToUom(resultTelescopeFocalLengthInches), config.decimalPointsTelescopeFocalLength));
};

MLB.telescopeCriteriaCalc.setSelectedComaCorrector = function (comaCorrectorsIx) {
	var common = MLB.telescopeCriteriaCalc.common,
		comaCorrectorsJson = MLB.comaCorrectorsJson,
	    comaCorrector = comaCorrectorsJson.comaCorrectors[comaCorrectorsIx];

	common.comaCorrectorMag().val(comaCorrector.magnification);
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

MLB.telescopeCriteriaCalc.setEyeOptSelectedEyepiece = function (idIx, selectedIndex) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    state = MLB.telescopeCriteriaCalc.state,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		eyepiecesJson = MLB.eyepiecesJson,
	    eyepiece = eyepiecesJson.eyepieces[selectedIndex],
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
		getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(common),
		// uses aperture, focal ratio
		magnification = common.apertureInchesVal() * common.focalRatioVal() / +eyepiece.focalLengthmm * 25.4 * comaCorrectorMag,
		resolutionArcsec = resolutionFromAperture_Magnification(common.apertureInchesVal(), magnification),
		exitPupil = +eyepiece.focalLengthmm / common.focalRatioVal(),
		resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), +eyepiece.fieldStopmm, comaCorrectorMag);

	common.EyeOptElement(common.EyeOptManufacturerID, idIx).html(eyepiece.manufacturer);
	common.EyeOptElement(common.EyeOptTypeID, idIx).html(eyepiece.type);
	common.EyeOptElement(common.EyeOptFocalLengthID, idIx).html(roundToDecimal(+eyepiece.focalLengthmm, config.decimalPointsEyepieceFL) + 'mm');
	common.EyeOptElement(common.EyeOptFieldStopID, idIx).html(roundToDecimal(+eyepiece.fieldStopmm, config.decimalPointsEyepieceFieldStop) + 'mm');
	common.EyeOptElement(common.EyeOptExitPupilID, idIx).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + 'mm');
	common.EyeOptElement(common.EyeOptApparentFieldID, idIx).html(roundToDecimal(+eyepiece.apparentField, config.decimalPointsEyepieceApparentFOV) + ' deg');
	common.EyeOptElement(common.EyeOptFOVID, idIx).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + ' deg');
	common.EyeOptElement(common.EyeOptMagnificationID, idIx).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
	common.EyeOptElement(common.EyeOptResolutionID, idIx).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');

	state.eyeOptRowSet[idIx] = true;
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
	common.eyepieceSelect().get(0).selectedIndex = bestIx;
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
	common.eyepieceSelect().get(0).selectedIndex = bestIx;
	setSelectedEyepiece(bestIx);
	// update FOV to view widest field results
	calcFOV();
};

MLB.telescopeCriteriaCalc.setSelectedFocuser = function (focusersIx) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		focusersJson = MLB.focusersJson,
	    focuser = focusersJson.focusers[focusersIx];

	common.focuserRackedInHeight().val(roundToDecimal(common.convertInchesToUom(+focuser.rackedInHeightInches), config.decimalPointsFocuser));
	common.focuserTravel().val(roundToDecimal(common.convertInchesToUom(+focuser.travelInches), config.decimalPointsFocuser));
};

MLB.telescopeCriteriaCalc.processCalculatorType = function () {
	var config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		state = MLB.telescopeCriteriaCalc.state,
		focalRatioChecked = common.focalRatioChecked();

	if (focalRatioChecked !== state.focalRatioChecked) {
		if (focalRatioChecked) {
			common.btnCalcAperture().val(config.calcAperture4ParmsLit);
			common.btnCalcFOV().val(config.calcFOV4ParmsLit);
			common.btnCalcEyepieceFieldStop().val(config.calcEyepieceFieldStop4ParmsLit);

			common.btnCalcFocalRatio().removeAttr('disabled');
			common.btnCalcEyePupil().attr('disabled', 'disabled');
			common.btnCalcEyepieceFocalLength().attr('disabled', 'disabled');
		} else {
			common.btnCalcAperture().val(config.calcAperture5ParmsLit);
			common.btnCalcFOV().val(config.calcFOV5ParmsLit);
			common.btnCalcEyepieceFieldStop().val(config.calcEyepieceFieldStop5ParmsLit);

			common.btnCalcFocalRatio().attr('disabled', 'disabled');
			common.btnCalcEyePupil().removeAttr('disabled');
			common.btnCalcEyepieceFocalLength().removeAttr('disabled');
		}
		state.focalRatioChecked = common.focalRatioChecked();
	}
};

MLB.telescopeCriteriaCalc.processUomChange = function (startup) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		uomLit = common.inInches() ? config.inchesLit : config.mmLit,
		// no conversion at startup!
	    conversionFactor = startup !== undefined ? 1 : common.inInches() ? 0.03937 : 25.4,
		diags = common.inInches() ? config.diagonalsInches.join(',') : config.diagonalsMm.join(',');

	// update labels to include uom
	common.apertureLabel().html(config.apertureLabelLit + uomLit + config.equalsLit);
	common.focalLengthLabel().html(config.focalLengthLabelLit + uomLit + config.equalsLit);
	common.focuserRackedInHeightLabel().html(config.focuserRackedInHeightLabelLit + uomLit + config.equalsLit);
	common.focuserTravelLabel().html(config.focuserTravelLabelLit + uomLit + config.equalsLit);
	common.focuserInwardFocusingDistanceLabel().html(config.focuserInwardFocusingDistanceLabelLit + uomLit + config.equalsLit);
	common.tubeODLabel().html(config.tubeODLabelLit + uomLit + config.equalsLit);
	common.tubeThicknessLabel().html(config.tubeThicknessLabelLit + uomLit + config.equalsLit);
	common.diagToFocalPlaneDistanceLabel().html(config.diagToFocalPlaneDistanceLabelLit + uomLit + config.equalsLit);
	common.diagSizesLabel().html(config.diagSizesLabelLit + uomLit);

	// uom state already switched!
	common.aperture().val(roundToDecimal(+common.aperture().val() * conversionFactor, config.decimalPointsAperture));
	common.telescopeFocalLength().val(roundToDecimal(+common.telescopeFocalLength().val() * conversionFactor, config.decimalPointsTelescopeFocalLength));

	common.focuserRackedInHeight().val(roundToDecimal(common.focuserRackedInHeight().val() * conversionFactor, config.decimalPointsFocuser));
	common.focuserTravel().val(roundToDecimal(common.focuserTravel().val() * conversionFactor, config.decimalPointsFocuser));
	common.focuserInwardFocusingDistance().val(roundToDecimal(common.focuserInwardFocusingDistance().val() * conversionFactor, config.decimalPointsFocuser));

	common.telescopeTubeOD().val(roundToDecimal(+common.telescopeTubeOD().val() * conversionFactor, config.decimalPointsTube));
	common.telescopeTubeThickness().val(roundToDecimal(+common.telescopeTubeThickness().val() * conversionFactor, config.decimalPointsTube));
	common.diagToFocalPlaneDistance().val(roundToDecimal(+common.diagToFocalPlaneDistance().val() * conversionFactor, config.decimalPointsTube));

	common.diagSizes().val(diags);
};

MLB.telescopeCriteriaCalc.buildEyepieceHtmlTable = function () {
	var config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
	    ix,
		htmlStr,
		idStr;

	for (ix = 0; ix < config.eyepieceRows; ix++) {
		htmlStr = "<tr>\r\n"
			+ "<td><select id='" + common.EyeOptSelectID + ix + "'></select></td>\r\n"
			+ "<td id='" + common.EyeOptManufacturerID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptTypeID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptFocalLengthID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptFieldStopID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptApparentFieldID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptExitPupilID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptFOVID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptMagnificationID + ix + "'></td>\r\n"
			+ "<td id='" + common.EyeOptResolutionID + ix + "'></td>\r\n"
			+ "</tr>\r\n";
		common.eyeOptTableBody().append(htmlStr);
		// css for the select drop down
		idStr = '#' + common.EyeOptSelectID + ix;
		//$(idStr).css({'font-family': 'Verdana, Geneva, sans-serif',	'font-size': '1em'});
	}
};

MLB.telescopeCriteriaCalc.seedComaCorrector = function (manufacturer, model) {
	var common = MLB.telescopeCriteriaCalc.common,
		setSelectedComaCorrector = MLB.telescopeCriteriaCalc.setSelectedComaCorrector,
		comaCorrectorsJson = MLB.comaCorrectorsJson,
		e,
		row;

	common.comaCorrectorSelect().val(manufacturer + ' ' + model);

	for (row = 0; row < comaCorrectorsJson.comaCorrectors.length; row++) {
		e = comaCorrectorsJson.comaCorrectors[row];
		if (e.manufacturer === manufacturer && e.model === model) {
			break;
		}
	}
	setSelectedComaCorrector(row);
};

MLB.telescopeCriteriaCalc.seedEyepiece = function (manufacturer, type, focalLengthmm) {
	var common = MLB.telescopeCriteriaCalc.common,
		setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
		eyepiecesJson = MLB.eyepiecesJson,
		e,
		row;

	common.eyepieceSelect().val(manufacturer + ' ' + type  + ' ' + focalLengthmm + 'mm');
	for (row = 0; row < eyepiecesJson.eyepieces.length; row++) {
		e = eyepiecesJson.eyepieces[row];
		if (e.manufacturer === manufacturer && e.type === type && e.focalLengthmm === focalLengthmm) {
			break;
		}
	}
	setSelectedEyepiece(row);
};

MLB.telescopeCriteriaCalc.seedEyeOptEyepiece = function (idIx, manufacturer, type, focalLengthmm) {
	var common = MLB.telescopeCriteriaCalc.common,
		setEyeOptSelectedEyepiece = MLB.telescopeCriteriaCalc.setEyeOptSelectedEyepiece,
		eyepiecesJson = MLB.eyepiecesJson,
		e,
		row;

	$('#' + common.EyeOptSelectID + idIx).val(manufacturer + ' ' + type  + ' ' + focalLengthmm + 'mm');
	for (row = 0; row < eyepiecesJson.eyepieces.length; row++) {
		e = eyepiecesJson.eyepieces[row];
		if (e.manufacturer === manufacturer && e.type === type && e.focalLengthmm === focalLengthmm) {
			break;
		}
	}
	setEyeOptSelectedEyepiece(idIx, row);
};

MLB.telescopeCriteriaCalc.seedFocuser = function (manufacturer, model) {
	var common = MLB.telescopeCriteriaCalc.common,
		setSelectedFocuser = MLB.telescopeCriteriaCalc.setSelectedFocuser,
		focusersJson = MLB.focusersJson,
		e,
		row;

	common.focuserSelect().val(manufacturer + ' ' + model);

	for (row = 0; row < focusersJson.focusers.length; row++) {
		e = focusersJson.focusers[row];
		if (e.manufacturer === manufacturer && e.model === model) {
			break;
		}
	}
	setSelectedFocuser(row);
};

MLB.telescopeCriteriaCalc.graphDiagIllum = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
	    minIllum,
		diagonals,
		selectedUomLit,
		offAxisIncrement,
		formatString,
		diagToFocalPlaneDistance,
		focalLen,
		mirrorDia,
		maxField,
		acceptableMagLoss,
		minDiag,
		suitableDiags,
		diagonalsLength,
		ix,
		offAxisIllum,
		diagSize,
		calcs,
		lossDueToDiagonals,
		suitableDiagsLength,
		offAxisPts,
		inverseIncr,
		diagIx,
		illumIx,
		series,
		tickLabel,
		drop,
		maxDrop,
		offset,
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
		calcDiagOffset = MLB.calcLib.calcDiagOffset;

	if (common.inInches()) {
		maxField = common.eyepieceFieldStopmmVal() / 25.4;
		selectedUomLit = config.inchesLit;
		offAxisIncrement = 0.1;
		formatString = '%3.1f';
	} else {
		maxField = common.eyepieceFieldStopmmVal();
		selectedUomLit = config.mmLit;
		offAxisIncrement = 2;
		formatString = '%1d';
	}

	diagonals = common.diagSizesVal().split(',').map(Number);
	diagToFocalPlaneDistance = +common.diagToFocalPlaneDistance().val();
	focalLen = common.telescopeFocalLength().val();
	mirrorDia = common.aperture().val();
	acceptableMagLoss = common.acceptableMagLossVal();

	minDiag = diagToFocalPlaneDistance / (focalLen / mirrorDia);
	minIllum = inverseMagnitudeDrop(acceptableMagLoss);

	suitableDiags = [];
	diagonalsLength = diagonals.length;
	for (ix = 0; ix < diagonalsLength; ix++) {
		diagSize = diagonals[ix];
		offAxisIllum = calcOffAxisIllumination(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, maxField / 2);
		if (diagSize >= minDiag && offAxisIllum >= minIllum) {
			suitableDiags.push(diagSize);
		}
		if (offAxisIllum === 1) {
			break;
		}
	}

	/* calcs[] is: array[diagonals], each element consisting of:
					array[off-axis points], each element consisting of:
					 array[2]: 1st element is the off-axis distance and 2nd element the illumination value */
	calcs = [];
	lossDueToDiagonals = [];
	suitableDiagsLength = suitableDiags.length;
	for (ix = 0; ix < suitableDiagsLength; ix++) {
		calcs.push(getDiagIllumArray(mirrorDia, focalLen, suitableDiags[ix], diagToFocalPlaneDistance, offAxisIncrement, maxField));
		lossDueToDiagonals.push(diagObstructionArea(mirrorDia, suitableDiags[ix]));
	}

	// generate plot data
	offAxisPts = calcs[0].length;
	inverseIncr = 1 / offAxisIncrement;
	series = [];
	// include array for maxDrop
	suitableDiagsLength = suitableDiags.length;
	for (diagIx = 0; diagIx <= suitableDiagsLength; diagIx++) {
		series.push([]);
	}

	// for each offaxis distance, push the illuminations of the various diagonals followed by the max allowed illum drop
	for (illumIx = 0; illumIx < offAxisPts; illumIx++) {
		tickLabel = Math.round(calcs[0][illumIx][0] * inverseIncr) / inverseIncr;
		maxDrop = magnitudeDrop(minIllum);
		suitableDiagsLength = suitableDiags.length;
		for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
			drop = magnitudeDrop(calcs[diagIx][illumIx][1] - lossDueToDiagonals[diagIx]);
			series[diagIx].push([tickLabel, drop]);
		}
		series[diagIx].push([tickLabel, maxDrop]);
	}

	// build the series labels: each series label represents a diagonal size, ending with the max allowed illum drop label
	seriesLabels = [];
	suitableDiagsLength = suitableDiags.length;
	for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
		seriesLabels.push(seriesLabel(suitableDiags[diagIx] + selectedUomLit + ' m.a. diagonal'));
	}
	seriesLabels.push(seriesLabel('max allowed drop'));

	$.jqplot.config.enablePlugins = true;
	$.jqplot(common.diagChartID(), series, {
		title: 'Diagonal off-axis illumination',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'off-axis distance' + selectedUomLit,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: offAxisPts,
				tickOptions: {formatString: formatString},
				min: series[0][0][0],
				max: series[0][offAxisPts - 1][0]
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'magnitude drop',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				max: 0,
				min: acceptableMagLoss
			}
		},
		series: seriesLabels
	}).replot();

    offset = calcDiagOffset(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance);
	common.diagNotes().html('minimum m.a. size is '
		+ roundToDecimal(minDiag, config.decimalPointsDiagOffset)
		+ selectedUomLit
		+ '; offset towards primary mirror is '
		+ roundToDecimal(offset, config.decimalPointsDiagOffset)
		+ selectedUomLit);
};

$(window).ready(function () {
	var buildEyepieceHtmlTable = MLB.telescopeCriteriaCalc.buildEyepieceHtmlTable,
	    calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
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
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		calcEyepieceFieldStopFromApparentFOV_EyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL,
		calcApertureFromLimitingMagnitude = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude,
		processCalculatorType = MLB.telescopeCriteriaCalc.processCalculatorType,
		processUomChange = MLB.telescopeCriteriaCalc.processUomChange,
		graphDiagIllum = MLB.telescopeCriteriaCalc.graphDiagIllum,
		setSelectedComaCorrector = MLB.telescopeCriteriaCalc.setSelectedComaCorrector,
		setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
		setSelectedFocuser = MLB.telescopeCriteriaCalc.setSelectedFocuser,
		setEyeOptSelectedEyepiece = MLB.telescopeCriteriaCalc.setEyeOptSelectedEyepiece,
		seedComaCorrector = MLB.telescopeCriteriaCalc.seedComaCorrector,
		seedEyepiece = MLB.telescopeCriteriaCalc.seedEyepiece,
		seedEyeOptEyepiece = MLB.telescopeCriteriaCalc.seedEyeOptEyepiece,
		seedFocuser = MLB.telescopeCriteriaCalc.seedFocuser,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		comaCorrectorsJson = MLB.comaCorrectorsJson,
		eyepiecesJson = MLB.eyepiecesJson,
		focusersJson = MLB.focusersJson,
		comaCorrectorStr,
		eyepieceStr,
		focuserStr,
		optionStr,
		ix;

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

	common.radBtnFocalRatioOrEyePupil_EyepieceFocalLength().click(function () {
		processCalculatorType();
	});

	common.btnUom().click(function () {
		processUomChange();
	});

	common.btnUpdateDiagIllum().click(function () {
		graphDiagIllum();
	});

	// fill select coma corrector drop down box
	$.each(comaCorrectorsJson.comaCorrectors, function (i, v) {
		comaCorrectorStr = v.manufacturer + ' ' + v.model;
		optionStr = '<option value="' + comaCorrectorStr + '">' + comaCorrectorStr + '</option>';
		common.comaCorrectorSelect().append(optionStr);
	});
	// wire up selected comaCorrector change for telescope optimizer
	common.comaCorrectorSelect().change(function () {
		setSelectedComaCorrector(this.selectedIndex);
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

	buildEyepieceHtmlTable();
	// fill select eyepiece drop down box and eyepiece optimizer table rows
	$.each(eyepiecesJson.eyepieces, function (i, v) {
		// fill in missing field stops
		if (v.fieldStopmm === '') {
			v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
		}
		eyepieceStr = v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + 'mm';
		optionStr = '<option value="' + eyepieceStr + '">' + eyepieceStr + '</option>';
		// eyepiece drop down box for telescope optimizer
		common.eyepieceSelect().append(optionStr);
		// drop down boxes for eyepiece optimizer
		for (ix = 0; ix < config.eyepieceRows; ix++) {
			$('#' + common.EyeOptSelectID + ix).append(optionStr);
		}
	});
	// wire up selected eyepiece change for telescope optimizer
	common.eyepieceSelect().change(function () {
		setSelectedEyepiece(this.selectedIndex);
	});
	// wire up selected eyepiece change for eyepiece optimizer
	$('[id^=' + common.EyeOptSelectID + ']')
		.each(function (idIx) {
			$(this).change(function (e) {
				setEyeOptSelectedEyepiece(idIx, e.currentTarget.selectedIndex);
			});
		});

	// fill select focuser drop down box
	$.each(focusersJson.focusers, function (i, v) {
		focuserStr = v.manufacturer + ' ' + v.model;
		optionStr = '<option value="' + focuserStr + '">' + focuserStr + '</option>';
		common.focuserSelect().append(optionStr);
	});
	// wire up selected comaCorrector change for telescope optimizer
	common.focuserSelect().change(function () {
		setSelectedFocuser(this.selectedIndex);
	});

	processCalculatorType();
	// calc and display specs for form default
	seedComaCorrector('TeleVue', 'Paracorr II');
	seedEyepiece('Explore Scientific', '82 series', '24');
	seedEyeOptEyepiece(0, 'Celestron', 'Axiom', '40');
	seedEyeOptEyepiece(1, 'TeleVue', 'Ethos', '17');
	seedEyeOptEyepiece(2, 'Clave', 'Plossl', '6');
	seedFocuser('MoonLite', 'CR 1.5');

	// must wait for seeded focuser et al
	processUomChange('startup');

	updateFollowOnFields();
	graphDiagIllum();
});

// end of file