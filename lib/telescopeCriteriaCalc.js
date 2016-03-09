// copyright Mel Bartels, 2016

'use strict';

MLB.telescopeCriteriaCalc = {};

MLB.telescopeCriteriaCalc.state = {
	focalRatioChecked: undefined,
	eyeOptRowSet: []
};

MLB.telescopeCriteriaCalc.config = {
	drawTestLines: false,

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
	barrelTubeInsideDiameterLabelLit: 'Barrel tube inside diameter',
	barrelTubeLengthLabelLit: 'Barrel tube length',
	focuserInwardFocusingDistanceLabelLit: 'Desired inward focusing distance',
	tubeODLabelLit: 'Outside diameter',
	tubeThicknessLabelLit: 'Thickness',
	focalPlaneToDiagDistanceLabelLit: 'Focal plane to diagonal distance',
	diagSizesLabelLit: 'Sizes (m.a.) to select from are',
	optimizedDiagSizeLabelLit: 'Diagonal (m.a.) size',
	focalPlaneToFocuserBarrelBottomDistanceLabelLit: 'Focal plane to bottom of focuser barrel distance',
	diagOffsetLabelLit: 'Diagonal offset (towards primary mirror and away from focuser)',

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
	decimalPointsDiag: 2,
	decimalPointsDimension: 1,

	eyepieceRows: 5,

	diagonalsInches: [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12],
	diagonalsMm: [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300],

	canvasBorder: 20,
	canvasGlassStyle: 'blue',
	canvasOpticalPathStyle: '#8888ff',
	canvasOpticalPathLightStyle: '#6666ff',
	canvasStructureStyle: 'black',
	canvasStructureLightStyle: 'gray',
	canvasRayStyle: 'red',
	canvasAccStyle: 'green',
	canvasTestStyle: 'orange',
	canvasLineWidth: 1,
	canvasFont: '10pt arial',

	primaryMirrorThicknessInches: 1.5,
	primaryMirrorCellThicknessInches: 2,

	baffleCanvasTestLineLength: 1000,

	canvasDimensionHalfHeight: 5,
	canvasTextBorder: 4,

	projectedFocuserBaffleDimensionText: 'projected focuser baffle = ',
	primaryMirrorBaffleDimensionText: 'primary mirror baffle = '
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
	btnUpdateBaffles: function () {
		return $('[id=btnUpdateBaffles]');
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
	barrelTubeInsideDiameterLabel: function () {
		return $('[name=barrelTubeInsideDiameterLabel]');
	},
	barrelTubeLengthLabel: function () {
		return $('[name=barrelTubeLengthLabel]');
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
	focalPlaneToDiagDistanceLabel: function () {
		return $('[name=focalPlaneToDiagDistanceLabel]');
	},
	diagSizesLabel: function () {
		return $('[name=diagSizesLabel]');
	},
	diagNotes: function () {
		return $('[id=diagNotes]');
	},
	optimizedDiagSizeLabel: function () {
		return $('[name=optimizedDiagSizeLabel]');
	},
	focalPlaneToFocuserBarrelBottomDistanceLabel: function () {
		return $('[name=focalPlaneToFocuserBarrelBottomDistanceLabel]');
	},
	diagOffsetLabel: function () {
		return $('[name=diagOffsetLabel]');
	},
	baffleNotes: function () {
		return $('[id=baffleNotes]');
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
	barrelTubeInsideDiameter: function () {
		return $('[name=barrelTubeInsideDiameter]');
	},
	barrelTubeLength: function () {
		return $('[name=barrelTubeLength]');
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
	focalPlaneToDiagDistance: function () {
		return $('[name=focalPlaneToDiagDistance]');
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
	optimizedDiagSize: function () {
		return $('[name=optimizedDiagSize]');
	},
	focalPlaneToFocuserBarrelBottomDistance: function () {
		return $('[name=focalPlaneToFocuserBarrelBottomDistance]');
	},
	diagOffset: function () {
		return $('[name=diagOffset]');
	},
	baffleCanvasID: function () {
		return $('#baffleCanvas');
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
	convertmmToUom: function (mm) {
		if (this.inInches()) {
			return mm / 25.4;
		}
		return mm;
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
	barrelTubeInsideDiameterInchesVal: function () {
		return this.convertToInches(+this.barrelTubeInsideDiameter().val());
	},
	barrelTubeLengthInchesVal: function () {
		return this.convertToInches(+this.barrelTubeLength().val());
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
	focalPlaneToDiagDistanceInchesVal: function () {
		return this.convertToInches(+this.focalPlaneToDiagDistance().val());
	},
	acceptableMagLossVal: function () {
		return +this.acceptableMagLoss().val();
	},
	diagSizesVal: function () {
		return this.diagSizes().val();
	},
	optimizedDiagSizeInchesVal: function () {
		return this.convertToInches(+this.optimizedDiagSize().val());
	},
	focalPlaneToFocuserBarrelBottomDistanceInchesVal: function () {
		return this.convertToInches(+this.focalPlaneToFocuserBarrelBottomDistance().val());
	},
	diagOffsetInchesVal: function () {
		return this.convertToInches(+this.diagOffset().val());
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
		+ 'x<Br>'
		+ 'resolution = '
		+ roundToDecimal(resolutionArcsec, config.decimalPointsResolution)
		+ ' arc seconds (theoretical = '
		+ roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution)
		+ ')');
};

MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		newTubeOD = common.apertureInchesVal() + common.telescopeTubeThicknessInchesVal() * 2 + common.convertmmToUom(common.eyepieceFieldStopmmVal()),
		newFocalPlaneToDiagDistance = newTubeOD / 2 + common.focuserRackedInHeightInchesVal() + common.focuserInwardFocusingDistanceInchesVal();

	common.telescopeTubeOD().val(roundToDecimal(common.convertInchesToUom(newTubeOD), config.decimalPointsTube));
	common.focalPlaneToDiagDistance().val(roundToDecimal(common.convertInchesToUom(newFocalPlaneToDiagDistance), config.decimalPointsTube));
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
	updateFollowOnFields();
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
	    updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		apertureInchesFromMagnitude = MLB.calcLib.apertureInchesFromMagnitude,
		// lower power reduces limiting magnitude by ~1 mag
		resultApertureInches = apertureInchesFromMagnitude(common.limitingMagnitudeVal() + 1);

	common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
	updateFollowOnFields();
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
		updateFollowOnFields = MLB.telescopeCriteriaCalc.updateFollowOnFields,
		resultApertureInches = common.telescopeFocalLengthInchesVal() / common.focalRatioVal();

	common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
	updateFollowOnFields();
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
	common.barrelTubeInsideDiameter().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelInsideDiameterInches), config.decimalPointsFocuser));
	common.barrelTubeLength().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelLengthInches), config.decimalPointsFocuser));

	common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelLengthInches + common.focuserInwardFocusingDistanceInchesVal()), config.decimalPointsFocuser));
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
		graphDiagIllum = MLB.telescopeCriteriaCalc.graphDiagIllum,
		graphBaffles = MLB.telescopeCriteriaCalc.graphBaffles,
		uomLit = common.inInches() ? config.inchesLit : config.mmLit,
		// no conversion at startup!
	    conversionFactor = startup !== undefined ? 1 : common.inInches() ? 0.03937 : 25.4,
		diags = common.inInches() ? config.diagonalsInches.join(',') : config.diagonalsMm.join(',');

	// update labels to include uom
	common.apertureLabel().html(config.apertureLabelLit + uomLit + config.equalsLit);
	common.focalLengthLabel().html(config.focalLengthLabelLit + uomLit + config.equalsLit);
	common.focuserRackedInHeightLabel().html(config.focuserRackedInHeightLabelLit + uomLit + config.equalsLit);
	common.focuserTravelLabel().html(config.focuserTravelLabelLit + uomLit + config.equalsLit);
	common.barrelTubeInsideDiameterLabel().html(config.barrelTubeInsideDiameterLabelLit + uomLit + config.equalsLit);
	common.barrelTubeLengthLabel().html(config.barrelTubeLengthLabelLit + uomLit + config.equalsLit);
	common.focuserInwardFocusingDistanceLabel().html(config.focuserInwardFocusingDistanceLabelLit + uomLit + config.equalsLit);
	common.tubeODLabel().html(config.tubeODLabelLit + uomLit + config.equalsLit);
	common.tubeThicknessLabel().html(config.tubeThicknessLabelLit + uomLit + config.equalsLit);
	common.focalPlaneToDiagDistanceLabel().html(config.focalPlaneToDiagDistanceLabelLit + uomLit + config.equalsLit);
	common.diagSizesLabel().html(config.diagSizesLabelLit + uomLit);
	common.optimizedDiagSizeLabel().html(config.optimizedDiagSizeLabelLit + uomLit + config.equalsLit);
	common.focalPlaneToFocuserBarrelBottomDistanceLabel().html(config.focalPlaneToFocuserBarrelBottomDistanceLabelLit + uomLit + config.equalsLit);
	common.diagOffsetLabel().html(config.diagOffsetLabelLit + uomLit + config.equalsLit);

	// replace field values with new uom values; uom state already switched
	common.aperture().val(roundToDecimal(+common.aperture().val() * conversionFactor, config.decimalPointsAperture));
	common.telescopeFocalLength().val(roundToDecimal(+common.telescopeFocalLength().val() * conversionFactor, config.decimalPointsTelescopeFocalLength));

	common.focuserRackedInHeight().val(roundToDecimal(common.focuserRackedInHeight().val() * conversionFactor, config.decimalPointsFocuser));
	common.focuserTravel().val(roundToDecimal(common.focuserTravel().val() * conversionFactor, config.decimalPointsFocuser));
	common.barrelTubeInsideDiameter().val(roundToDecimal(common.barrelTubeInsideDiameter().val() * conversionFactor, config.decimalPointsFocuser));
	common.barrelTubeLength().val(roundToDecimal(common.barrelTubeLength().val() * conversionFactor, config.decimalPointsFocuser));
	common.focuserInwardFocusingDistance().val(roundToDecimal(common.focuserInwardFocusingDistance().val() * conversionFactor, config.decimalPointsFocuser));

	common.telescopeTubeOD().val(roundToDecimal(+common.telescopeTubeOD().val() * conversionFactor, config.decimalPointsTube));
	common.telescopeTubeThickness().val(roundToDecimal(+common.telescopeTubeThickness().val() * conversionFactor, config.decimalPointsTube));
	common.focalPlaneToDiagDistance().val(roundToDecimal(+common.focalPlaneToDiagDistance().val() * conversionFactor, config.decimalPointsTube));

	common.diagSizes().val(diags);
	common.optimizedDiagSize().val(roundToDecimal(+common.optimizedDiagSize().val() * conversionFactor, config.decimalPointsDiag));
	common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(+common.focalPlaneToFocuserBarrelBottomDistance().val() * conversionFactor, config.decimalPointsFocuser));
	common.diagOffset().val(roundToDecimal(+common.diagOffset().val() * conversionFactor, config.decimalPointsDiag));

	if (startup === undefined) {
		// update the diagonal and baffle charts
		graphDiagIllum();
		graphBaffles();
	}
};

MLB.telescopeCriteriaCalc.buildEyepieceHtmlTable = function () {
	var config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
	    ix,
		htmlStr;

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
		uomLit,
		offAxisIncrement,
		formatString,
		focalPlaneToDiagDistance,
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
		minDiagWhenOffset,
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
		calcDiagOffset = MLB.calcLib.calcDiagOffset;

	if (common.inInches()) {
		uomLit = config.inchesLit;
		offAxisIncrement = 0.1;
		formatString = '%3.1f';
	} else {
		uomLit = config.mmLit;
		offAxisIncrement = 2;
		formatString = '%1d';
	}
	maxField = common.convertmmToUom(common.eyepieceFieldStopmmVal());
	diagonals = common.diagSizesVal().split(',').map(Number);
	focalPlaneToDiagDistance = +common.focalPlaneToDiagDistance().val();
	focalLen = common.telescopeFocalLength().val();
	mirrorDia = common.aperture().val();
	acceptableMagLoss = common.acceptableMagLossVal();

	minDiag = focalPlaneToDiagDistance / (focalLen / mirrorDia);
	minIllum = inverseMagnitudeDrop(acceptableMagLoss);

	suitableDiags = [];
	diagonalsLength = diagonals.length;
	for (ix = 0; ix < diagonalsLength; ix++) {
		diagSize = diagonals[ix];
		offAxisIllum = calcOffAxisIllumination(mirrorDia, focalLen, diagSize, focalPlaneToDiagDistance, maxField / 2);
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
		calcs.push(getDiagIllumArray(mirrorDia, focalLen, suitableDiags[ix], focalPlaneToDiagDistance, offAxisIncrement, maxField));
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
		seriesLabels.push(seriesLabel(suitableDiags[diagIx] + uomLit + ' m.a. diagonal'));
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
				label: 'off-axis distance' + uomLit,
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

    offset = calcDiagOffset(mirrorDia, focalLen, diagSize, focalPlaneToDiagDistance);
	minDiagWhenOffset = minDiag + offset / (parseFloat(focalLen) / parseFloat(mirrorDia));

	common.diagNotes().html('minimum m.a. size = '
		+ roundToDecimal(minDiag, config.decimalPointsDiag)
		+ uomLit
		+ ', '
		+ roundToDecimal(minDiagWhenOffset, config.decimalPointsDiag)
		+ uomLit
		+ ' when offset<br>'
		+ 'offset towards primary mirror = '
		+ roundToDecimal(offset, config.decimalPointsDiag)
		+ uomLit);

	common.optimizedDiagSize().val(roundToDecimal(suitableDiags[0], config.decimalPointsDiag));
	common.diagOffset().val(roundToDecimal(offset, config.decimalPointsDiag));
};

MLB.telescopeCriteriaCalc.graphBaffles = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    config = MLB.telescopeCriteriaCalc.config,
	    common = MLB.telescopeCriteriaCalc.common,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		uom = MLB.sharedLib.uom,
		calcProjectedFocuserBaffleRadius = MLB.calcLib.calcProjectedFocuserBaffleRadius,
		baffleScalingFactor = MLB.calcLib.baffleScalingFactor,
		calcSagitta = MLB.calcLib.calcSagitta,
	    canvas,
	    context,
		aperture,
		telescopeFocalLength,
		focalRatio,
		eyepieceFieldStop,
		barrelTubeInsideDiameter,
		barrelTubeLength,
		telescopeTubeOD,
		telescopeTubeThickness,
		focalPlaneToDiagDistance,
		diagSize,
		diagOffset,
		focalPlaneToFocuserBarrelBottomDistance,
		projectedFocuserBaffleRadius,
		primaryMirrorThicknessInUom,
		primaryMirrorCellThicknessInUom,
		modelMaxWidth,
		modelMaxHeight,
		scalingFactor,
		scaledAperture,
		scaledMirrorRadius,
		scaledTelescopeFocalLength,
		scaledEyepieceFieldStop,
		scaledBarrelTubeInsideDiameter,
		scaledBarrelTubeLength,
		scaledTelescopeTubeOD,
		scaledTelescopeTubeThickness,
		scaledFocalPlaneToDiagDistance,
		scaledDiagSize,
		scaledHalfDiagSize,
		scaledFocalPlaneToFocuserBarrelBottomDistance,
		scaledProjectedFocuserBaffleRadius,
		scaledPrimaryMirrorThicknessInUom,
		scaledPrimaryMirrorCellThicknessInUom,
		scaledDiagOffset,
		scaledHalfTubeID,
		scaledRadiusCurvature,
		scaledSagitta,
		mirrorCenterPt,
		tubePrimaryMirrorEndFrontCenterPt,
		primaryFocusPt,
		mirrorRadian,
		mirrorUpperFacePt,
		mirrorLowerFacePt,
		mirrorUpperBackPt,
		mirrorLowerBackPt,
		diagCenterPt,
		diagUpperPt,
		diagLowerPt,
		focalPlaneCenterPt,
		focalPlaneLeftPt,
		focalPlaneRightPt,
		focuserBarreltubeLowerRearPt,
		focuserBarreltubeLowerFrontPt,
		focuserBarreltubeUpperRearPt,
		focuserBarreltubeUpperFrontPt,
		projectedFocuserBaffleLeftPt,
		projectedFocuserBaffleRightPt,
		projectedFocuserBaffleLeftTubeODPt,
		projectedFocuserBaffleRightTubeODPt,
		tubeLowerRearPt,
		tubeLowerFrontPt,
		tubeUpperRearPt,
		tubeUpperFrontPt,
		diagUpperToLeftFocalPlaneYDelta,
		diagUpperToLeftEyepieceFieldStopXDelta,
		diagLowerToRightFocalPlaneYDelta,
		diagLowerToRightEyepieceFieldStopXDelta,
		diagUpperToLeftFocalPlaneAngleRad,
		diagLowerToRightFocalPlaneAngleRad,
		diagUpperToLeftFocalPlaneReflectedAngleRad,
		diagLowerToRightFocalPlaneReflectedAngleRad,
		diagUpperToLeftFocalPlaneReflectedCanvasAngleRad,
		diagLowerToRightFocalPlaneReflectedCanvasAngleRad,
		diagUpperToTubeUpperInsideYDelta,
		diagLowerToTubeLowerInsideYDelta,
		aTanDiagUpperToLeftFocalPlaneReflectedAngle,
		aTanDiagLowerToRightFocalPlaneReflectedAngle,
		diagUpperToTubeUpperInsideXDelta,
		diagLowerToTubeLowerInsideXDelta,
		primaryMirrorBaffleUpperFrontPt,
		primaryMirrorBaffleLowerIntersectPt,
		primaryMirrorBaffleLowerFrontPt,
		primaryMirrorBaffleUpperRearPt,
		primaryMirrorBaffleLowerRearPt,
		primaryMirrorBaffleUpperRearTopPt,
		primaryMirrorBaffleUpperFrontTopPt,
		primaryMirrorBaffleLowerRearBottomPt,
		primaryMirrorBaffleLowerFrontBottomPt,
		primaryMirrorBaffleBehindPrimaryTopPt,
		primaryMirrorBaffleBehindPrimaryBottomPt,
		a,
		uomLit = common.inInches() ? config.inchesLit : config.mmLit,
		dimension,
		dimensionLeftPt,
		dimensionRightPt,
		dimensionY;

	canvas = common.baffleCanvasID()[0];
	context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);

	aperture = +common.aperture().val();
	telescopeFocalLength = +common.telescopeFocalLength().val();
	focalRatio = telescopeFocalLength / aperture;
	eyepieceFieldStop = common.convertmmToUom(common.eyepieceFieldStopmmVal());
	barrelTubeInsideDiameter = +common.barrelTubeInsideDiameter().val();
	barrelTubeLength = +common.barrelTubeLength().val();
	telescopeTubeOD = +common.telescopeTubeOD().val();
	telescopeTubeThickness = +common.telescopeTubeThickness().val();
	focalPlaneToDiagDistance = +common.focalPlaneToDiagDistance().val();
	diagSize = +common.optimizedDiagSize().val();
	diagOffset = +common.diagOffset().val();
	focalPlaneToFocuserBarrelBottomDistance = +common.focalPlaneToFocuserBarrelBottomDistance().val();

	projectedFocuserBaffleRadius = calcProjectedFocuserBaffleRadius(eyepieceFieldStop, barrelTubeInsideDiameter, +common.focalPlaneToFocuserBarrelBottomDistance().val(), focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness);

	primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
	primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

	// max width is the greater of the (telescope focal length) or the (primary mirror to diagonal + the projected focuser baffle radius distance)  
	modelMaxWidth = focalPlaneToDiagDistance + projectedFocuserBaffleRadius < 0 ? telescopeFocalLength - focalPlaneToDiagDistance + projectedFocuserBaffleRadius : telescopeFocalLength;
	// finally add in the primary mirror thickness, primary mirror cell thickness and tube thickness
	modelMaxWidth += primaryMirrorThicknessInUom + primaryMirrorCellThicknessInUom + telescopeTubeThickness;
	modelMaxHeight = focalPlaneToDiagDistance + telescopeTubeOD / 2;
	scalingFactor = baffleScalingFactor(canvas.width, canvas.height, modelMaxWidth, modelMaxHeight, config.canvasBorder);

	scaledAperture = scalingFactor * aperture;
	scaledMirrorRadius = scaledAperture / 2;
	scaledTelescopeFocalLength = scalingFactor * telescopeFocalLength;
	scaledEyepieceFieldStop = scalingFactor * eyepieceFieldStop;
	scaledBarrelTubeInsideDiameter = scalingFactor * barrelTubeInsideDiameter;
	scaledBarrelTubeLength = scalingFactor * barrelTubeLength;
	scaledTelescopeTubeOD = scalingFactor * telescopeTubeOD;
	scaledTelescopeTubeThickness = scalingFactor * telescopeTubeThickness;
	scaledFocalPlaneToDiagDistance = scalingFactor * focalPlaneToDiagDistance;
	scaledDiagSize = scalingFactor * diagSize;
	scaledHalfDiagSize = scaledDiagSize / 2;
	scaledFocalPlaneToFocuserBarrelBottomDistance = scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
	scaledProjectedFocuserBaffleRadius = scalingFactor * projectedFocuserBaffleRadius;
	scaledPrimaryMirrorThicknessInUom = scalingFactor * primaryMirrorThicknessInUom;
	scaledPrimaryMirrorCellThicknessInUom = scalingFactor * primaryMirrorCellThicknessInUom;
	scaledDiagOffset = scalingFactor * diagOffset;
	scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
	scaledRadiusCurvature = scaledAperture * focalRatio * 2;
	scaledSagitta = scalingFactor * calcSagitta(aperture, focalRatio);

	// calc primary mirror angle from mirror edge to radius of curvature:
	// circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
	// circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
	mirrorRadian = 1 / (2 * focalRatio);

	// canvas 0,0 is upper left
	mirrorCenterPt = point(config.canvasBorder + scaledPrimaryMirrorThicknessInUom + scaledPrimaryMirrorCellThicknessInUom + scaledTelescopeTubeThickness, focalPlaneToDiagDistance / (focalPlaneToDiagDistance + telescopeTubeOD / 2) * (canvas.height - config.canvasBorder * 2) + config.canvasBorder);
	tubePrimaryMirrorEndFrontCenterPt = point(config.canvasBorder + scaledTelescopeTubeThickness, mirrorCenterPt.y);
	primaryFocusPt = point(mirrorCenterPt.x + scaledTelescopeFocalLength, mirrorCenterPt.y);

	// calc mirror edges, back
	mirrorUpperFacePt = point(mirrorCenterPt.x + scaledSagitta, mirrorCenterPt.y - scaledMirrorRadius);
	mirrorLowerFacePt = point(mirrorCenterPt.x + scaledSagitta, mirrorCenterPt.y + scaledMirrorRadius);
	mirrorUpperBackPt = point(mirrorCenterPt.x - scaledPrimaryMirrorThicknessInUom, mirrorUpperFacePt.y);
	mirrorLowerBackPt = point(mirrorCenterPt.x - scaledPrimaryMirrorThicknessInUom, mirrorLowerFacePt.y);

	// calc diagonal
	diagCenterPt = point(mirrorCenterPt.x + scaledTelescopeFocalLength - scaledFocalPlaneToDiagDistance, mirrorCenterPt.y);
	// diag angle of 45 deg means that m.a. is the delta
	diagUpperPt = point(diagCenterPt.x + scaledHalfDiagSize - scaledDiagOffset, diagCenterPt.y - scaledHalfDiagSize + scaledDiagOffset);
	diagLowerPt = point(diagCenterPt.x - scaledHalfDiagSize - scaledDiagOffset, diagCenterPt.y + scaledHalfDiagSize + scaledDiagOffset);

	// calc focal plane field
	focalPlaneCenterPt = point(diagCenterPt.x, diagCenterPt.y - scaledFocalPlaneToDiagDistance);
	focalPlaneLeftPt = point(focalPlaneCenterPt.x - scaledEyepieceFieldStop / 2, focalPlaneCenterPt.y);
	focalPlaneRightPt = point(focalPlaneCenterPt.x + scaledEyepieceFieldStop / 2, focalPlaneCenterPt.y);

	// calc focuser barrel tube
	focuserBarreltubeLowerRearPt = point(focalPlaneCenterPt.x - scaledBarrelTubeInsideDiameter / 2, focalPlaneCenterPt.y + scaledFocalPlaneToFocuserBarrelBottomDistance);
	focuserBarreltubeLowerFrontPt = point(focalPlaneCenterPt.x + scaledBarrelTubeInsideDiameter / 2, focalPlaneCenterPt.y + scaledFocalPlaneToFocuserBarrelBottomDistance);
	focuserBarreltubeUpperRearPt = point(focuserBarreltubeLowerRearPt.x, focuserBarreltubeLowerRearPt.y - scaledBarrelTubeLength);
	focuserBarreltubeUpperFrontPt = point(focuserBarreltubeLowerFrontPt.x, focuserBarreltubeLowerFrontPt.y - scaledBarrelTubeLength);

	// calc projected focuser baffle on opposite side of tube
	projectedFocuserBaffleLeftPt = point(focalPlaneCenterPt.x - scaledProjectedFocuserBaffleRadius,  tubePrimaryMirrorEndFrontCenterPt.y + scaledHalfTubeID);
	projectedFocuserBaffleRightPt = point(focalPlaneCenterPt.x + scaledProjectedFocuserBaffleRadius,  tubePrimaryMirrorEndFrontCenterPt.y + scaledHalfTubeID);
	projectedFocuserBaffleLeftTubeODPt = point(projectedFocuserBaffleLeftPt.x, projectedFocuserBaffleLeftPt.y + scaledTelescopeTubeThickness);
	projectedFocuserBaffleRightTubeODPt = point(projectedFocuserBaffleRightPt.x, projectedFocuserBaffleRightPt.y + scaledTelescopeTubeThickness);

	// calc telescope tube
	tubeLowerRearPt = point(tubePrimaryMirrorEndFrontCenterPt.x, tubePrimaryMirrorEndFrontCenterPt.y + scaledTelescopeTubeOD / 2);
	tubeUpperRearPt = point(tubePrimaryMirrorEndFrontCenterPt.x, tubePrimaryMirrorEndFrontCenterPt.y - scaledTelescopeTubeOD / 2);
	tubeLowerFrontPt = point(projectedFocuserBaffleRightPt.x, tubeLowerRearPt.y);
	tubeUpperFrontPt = point(projectedFocuserBaffleRightPt.x, tubeLowerRearPt.y - scaledTelescopeTubeOD);

	/* calc primary mirror baffle ---
		canvas x is the horizontal coordinate, canvas y is the vertical coordinate;
		diagonal upper to left focal plane is -x, -y; diagonal lower to right focal plane is +x, -y;
		atan2(y,x): y is the horizontal coordinate, x is the vertical coordinate
			atan2(1,0) aims to the right; atan2(0,1) aims to the top; atan2(0,-1) aims to the bottom; atan2(-1,-1) aims to the left;
			or, 0deg aims to the right, 90deg aims to the top, -90deg aims to the bottom and 180/180deg aims to the left;
		canvas x,y changes for diagonal upper to left focal plane are -36,175,
		canvas x,y changes for diagonal lower to right focal plane are 36,229;
		using the atan2 coordinate system (y to the right, x to the top, 0 deg to the right, grows counter-clockwise:
		atan2 of diagonal upper to left focal plane points is an angle slightly greater than 90 (aimed upward slightly to the left);
		atan2 of diagonal lower to right focal plane points is an angle slightly less than 90 (aimed upward slightly to the right);
		the diagonal axis is 135deg when 'to the right' is 0deg;
		to reflect about the diagonal axis, double the diagonal axis and subtract the angle;
		to convert to canvas coordinates where 0deg is to the right, but grows clockwise, subtract from 360deg;
		note that the two angles are essentially reflections about the horizontal plane but starting from the upper/lower diagonal points;
		to get canvas 'x' values for given 'y' range, tan(180 - reflected ray angle);
		then use starting point + cos for 'x' coordinate and starting point + sin for 'y' coordinate to draw lines using distance and angle;	
		for atan() to project the primary baffle rays, subtract from 180 to make 0deg aim to the left;
	*/
	diagUpperToLeftFocalPlaneYDelta = scaledFocalPlaneToDiagDistance - scaledDiagSize / 2 + scaledDiagOffset;
	diagLowerToRightFocalPlaneYDelta = scaledFocalPlaneToDiagDistance + scaledDiagSize / 2 + scaledDiagOffset;
	diagLowerToRightEyepieceFieldStopXDelta = (scaledEyepieceFieldStop + scaledDiagSize) / 2 - scaledDiagOffset;
	diagUpperToLeftEyepieceFieldStopXDelta = -diagLowerToRightEyepieceFieldStopXDelta;
	diagUpperToLeftFocalPlaneAngleRad = Math.atan2(diagUpperToLeftFocalPlaneYDelta, diagUpperToLeftEyepieceFieldStopXDelta);
	diagLowerToRightFocalPlaneAngleRad = Math.atan2(diagLowerToRightFocalPlaneYDelta, diagLowerToRightEyepieceFieldStopXDelta);
	diagUpperToLeftFocalPlaneReflectedAngleRad = 270 * uom.degToRad - diagUpperToLeftFocalPlaneAngleRad;
	diagLowerToRightFocalPlaneReflectedAngleRad = 270 * uom.degToRad - diagLowerToRightFocalPlaneAngleRad;
	diagUpperToLeftFocalPlaneReflectedCanvasAngleRad = uom.oneRev - diagUpperToLeftFocalPlaneReflectedAngleRad;
	diagLowerToRightFocalPlaneReflectedCanvasAngleRad = uom.oneRev - diagLowerToRightFocalPlaneReflectedAngleRad;
	// calc the intersect points with the inner tube for the primary mirror baffle
	diagUpperToTubeUpperInsideYDelta = scaledHalfTubeID - scaledHalfDiagSize + scaledDiagOffset;
	diagLowerToTubeLowerInsideYDelta = scaledHalfTubeID - scaledHalfDiagSize - scaledDiagOffset;
	aTanDiagUpperToLeftFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagUpperToLeftFocalPlaneReflectedAngleRad);
	aTanDiagLowerToRightFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagLowerToRightFocalPlaneReflectedAngleRad);
	diagUpperToTubeUpperInsideXDelta = diagUpperToTubeUpperInsideYDelta / aTanDiagUpperToLeftFocalPlaneReflectedAngle;
	diagLowerToTubeLowerInsideXDelta = diagLowerToTubeLowerInsideYDelta / aTanDiagLowerToRightFocalPlaneReflectedAngle;

	// set the primary mirror baffle points: make the lower baffle the same length as the upper baffle for simplicity but do calculate the lower intercept point for drawing the lower light ray
	primaryMirrorBaffleUpperFrontPt = point(diagUpperPt.x - diagUpperToTubeUpperInsideXDelta, diagUpperPt.y - diagUpperToTubeUpperInsideYDelta);
	primaryMirrorBaffleLowerIntersectPt = point(diagLowerPt.x + diagLowerToTubeLowerInsideXDelta, diagLowerPt.y + diagLowerToTubeLowerInsideYDelta);
	primaryMirrorBaffleUpperRearPt = point(tubeUpperRearPt.x, tubePrimaryMirrorEndFrontCenterPt.y - scaledHalfTubeID);
	primaryMirrorBaffleUpperRearTopPt = point(tubeUpperRearPt.x, primaryMirrorBaffleUpperRearPt.y - scaledTelescopeTubeThickness);
	primaryMirrorBaffleUpperFrontTopPt = point(primaryMirrorBaffleUpperFrontPt.x, primaryMirrorBaffleUpperFrontPt.y - scaledTelescopeTubeThickness);
	primaryMirrorBaffleLowerFrontPt = point(primaryMirrorBaffleUpperFrontPt.x, diagLowerPt.y + diagLowerToTubeLowerInsideYDelta);
	primaryMirrorBaffleLowerRearPt = point(primaryMirrorBaffleUpperRearPt.x, tubePrimaryMirrorEndFrontCenterPt.y + scaledHalfTubeID);
	primaryMirrorBaffleLowerRearBottomPt = point(primaryMirrorBaffleUpperRearTopPt.x, primaryMirrorBaffleLowerRearPt.y + scaledTelescopeTubeThickness);
	primaryMirrorBaffleLowerFrontBottomPt = point(primaryMirrorBaffleUpperFrontTopPt.x, primaryMirrorBaffleLowerFrontPt.y + scaledTelescopeTubeThickness);
	// calc primary mirror baffle points behind primary
	primaryMirrorBaffleBehindPrimaryTopPt = point(primaryMirrorBaffleUpperRearTopPt.x - scaledTelescopeTubeThickness, primaryMirrorBaffleUpperRearTopPt.y);
	primaryMirrorBaffleBehindPrimaryBottomPt = point(primaryMirrorBaffleLowerRearBottomPt.x - scaledTelescopeTubeThickness, primaryMirrorBaffleLowerRearBottomPt.y);

	// draw test rays for primary mirror baffle  using line, angle; these lines should exactly overlay the lines calculated above using coordinate rotation and tan()
	if (config.drawTestLines) {
		context.strokeStyle = config.canvasTestStyle;
		context.beginPath();
		context.moveTo(diagUpperPt.x, diagUpperPt.y);
		context.lineTo(diagUpperPt.x + config.baffleCanvasTestLineLength * Math.cos(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad), diagUpperPt.y + config.baffleCanvasTestLineLength * Math.sin(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad));
		context.stroke();
		context.beginPath();
		context.moveTo(diagLowerPt.x, diagLowerPt.y);
		context.lineTo(diagLowerPt.x + config.baffleCanvasTestLineLength * Math.cos(diagLowerToRightFocalPlaneReflectedCanvasAngleRad), diagLowerPt.y + config.baffleCanvasTestLineLength * Math.sin(diagLowerToRightFocalPlaneReflectedCanvasAngleRad));
		context.stroke();
		// draw test diagonal axis lines from upper, lower diag points
		a = 225 * uom.degToRad;
		context.beginPath();
		context.moveTo(diagUpperPt.x, diagUpperPt.y);
		context.lineTo(diagUpperPt.x + config.baffleCanvasTestLineLength * Math.cos(a), diagUpperPt.y + config.baffleCanvasTestLineLength * Math.sin(a));
		context.stroke();
		context.beginPath();
		context.moveTo(diagLowerPt.x, diagLowerPt.y);
		context.lineTo(diagLowerPt.x + config.baffleCanvasTestLineLength * Math.cos(a), diagLowerPt.y + config.baffleCanvasTestLineLength * Math.sin(a));
		context.stroke();
		// draw focal plane to diagonal crossing light rays
		drawLine(context, config.canvasTestStyle, config.canvasLineWidth, focalPlaneLeftPt, diagUpperPt);
		drawLine(context, config.canvasTestStyle, config.canvasLineWidth, focalPlaneRightPt, diagLowerPt);
	}
	// draw primary mirror to primary focus light rays
	drawLine(context, config.canvasOpticalPathLightStyle, config.canvasLineWidth, mirrorUpperFacePt, primaryFocusPt);
	drawLine(context, config.canvasOpticalPathLightStyle, config.canvasLineWidth, mirrorLowerFacePt, primaryFocusPt);
	// draw focal plane edges to cross diagonal edges
	drawLine(context, config.canvasRayStyle, config.canvasLineWidth, focalPlaneLeftPt, diagUpperPt);
	drawLine(context, config.canvasRayStyle, config.canvasLineWidth, focalPlaneRightPt, diagLowerPt);
	// draw primary mirror baffle diagonal to inner tube lines
	drawLine(context, config.canvasRayStyle, config.canvasLineWidth, primaryMirrorBaffleUpperFrontPt, diagUpperPt);
	drawLine(context, config.canvasRayStyle, config.canvasLineWidth, primaryMirrorBaffleLowerIntersectPt, diagLowerPt);
	// draw focal plane to projected focuser baffle light rays
	drawLine(context, config.canvasRayStyle, config.canvasLineWidth, focalPlaneLeftPt, projectedFocuserBaffleRightPt);
	drawLine(context, config.canvasRayStyle, config.canvasLineWidth, focalPlaneRightPt, projectedFocuserBaffleLeftPt);
	// draw optical paths
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorCenterPt, diagCenterPt);
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagCenterPt, focalPlaneCenterPt);
	// draw telescope tube
	drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeLowerRearPt, tubeLowerFrontPt);
	drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeUpperRearPt, tubeUpperFrontPt);
	drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeLowerRearPt, tubeUpperRearPt);
	// draw projected focuser baffle on opposite side of tube
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, projectedFocuserBaffleLeftPt, projectedFocuserBaffleRightPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, projectedFocuserBaffleRightTubeODPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, projectedFocuserBaffleLeftPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, projectedFocuserBaffleRightTubeODPt, projectedFocuserBaffleRightPt);
	// draw primary mirror baffles
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRearPt, primaryMirrorBaffleUpperFrontPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRearTopPt, primaryMirrorBaffleUpperFrontTopPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRearTopPt, primaryMirrorBaffleUpperRearPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleUpperFrontTopPt, primaryMirrorBaffleUpperFrontPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRearPt, primaryMirrorBaffleLowerFrontPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRearBottomPt, primaryMirrorBaffleLowerFrontBottomPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRearPt, primaryMirrorBaffleLowerRearBottomPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleLowerFrontPt, primaryMirrorBaffleLowerFrontBottomPt);
	// draw primary mirror baffle behind mirror
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryTopPt, primaryMirrorBaffleUpperRearTopPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryTopPt, primaryMirrorBaffleBehindPrimaryBottomPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, tubeLowerRearPt, tubeUpperRearPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryBottomPt, primaryMirrorBaffleLowerRearBottomPt);
	// draw focuser barrel tube
	drawLine(context, config.canvasAccStyle, config.canvasLineWidth, focuserBarreltubeLowerRearPt, focuserBarreltubeLowerFrontPt);
	drawLine(context, config.canvasAccStyle, config.canvasLineWidth, focuserBarreltubeLowerFrontPt, focuserBarreltubeUpperFrontPt);
	drawLine(context, config.canvasAccStyle, config.canvasLineWidth, focuserBarreltubeUpperFrontPt, focuserBarreltubeUpperRearPt);
	drawLine(context, config.canvasAccStyle, config.canvasLineWidth, focuserBarreltubeUpperRearPt, focuserBarreltubeLowerRearPt);
	// draw focal plane field
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, focalPlaneLeftPt, focalPlaneRightPt);
	// draw diagonal
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, diagUpperPt, diagLowerPt);
	// draw mirror edges, back
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperFacePt, mirrorUpperBackPt);
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorLowerFacePt, mirrorLowerBackPt);
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperBackPt, mirrorLowerBackPt);
	// draw primary mirror face
	context.beginPath();
	context.arc(mirrorCenterPt.x + scaledRadiusCurvature, mirrorCenterPt.y, scaledRadiusCurvature, uom.halfRev - mirrorRadian / 2, uom.halfRev + mirrorRadian / 2);
	context.lineWidth = config.canvasLineWidth;
	context.strokeStyle = config.canvasGlassStyle;
	context.stroke();

	// write dimension for projected focuser baffle
	context.font = config.canvasFont;
	dimension = roundToDecimal(scaledProjectedFocuserBaffleRadius * 2 / scalingFactor, config.decimalPointsDimension) + uomLit;
	dimensionY = projectedFocuserBaffleRightPt.y + config.canvasBorder;
	dimensionRightPt = point(projectedFocuserBaffleRightPt.x, dimensionY);
	dimensionLeftPt = point(projectedFocuserBaffleLeftPt.x, dimensionY);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight));
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight));
	context.fillText(config.projectedFocuserBaffleDimensionText + dimension, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
	// write dimension for primary mirror baffle
	dimension = roundToDecimal((primaryMirrorBaffleLowerFrontPt.x - mirrorLowerFacePt.x) / scalingFactor, config.decimalPointsDimension) + uomLit;
	dimensionY = primaryMirrorBaffleLowerRearPt.y + config.canvasBorder;
	dimensionRightPt = point(primaryMirrorBaffleLowerFrontPt.x, dimensionY);
	dimensionLeftPt = point(mirrorLowerFacePt.x, dimensionY);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight));
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight));
	context.fillText(config.primaryMirrorBaffleDimensionText + dimension, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
	// write out notes
	common.baffleNotes().html('mirror front edge to focal plane center line = '
		+ roundToDecimal((focalPlaneCenterPt.x - mirrorLowerFacePt.x) / scalingFactor, config.decimalPointsDimension)
		+ uomLit
		+ '<br>'
		+ 'mirror front edge to front end of tube = '
		+ roundToDecimal((projectedFocuserBaffleRightPt.x - mirrorLowerFacePt.x) / scalingFactor, config.decimalPointsDimension)
		+ uomLit
		+ '<br>'
		+ 'mirror sagitta = '
		+ roundToDecimal(scaledSagitta / scalingFactor, config.decimalPointsDimension)
		+ uomLit);
};

/* 
called from
	calcAperture()
	calcFOV()
	calcEyepieceFieldStop()
	calcFocalRatio()
	calcEyePupil()
	calcEyepieceFocalLength()
*/
MLB.telescopeCriteriaCalc.updateFollowOnFields = function () {
	var updateFieldsDependentOnAperture = MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture,
	    updateSpecs = MLB.telescopeCriteriaCalc.updateSpecs,
		updateEyepieceOptimizerRows = MLB.telescopeCriteriaCalc.updateEyepieceOptimizerRows,
		graphDiagIllum = MLB.telescopeCriteriaCalc.graphDiagIllum,
		graphBaffles = MLB.telescopeCriteriaCalc.graphBaffles;

	updateFieldsDependentOnAperture();
	updateSpecs();
	updateEyepieceOptimizerRows();
	graphDiagIllum();
	graphBaffles();
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
		graphBaffles = MLB.telescopeCriteriaCalc.graphBaffles,
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
		graphBaffles();
	});
	common.btnUpdateBaffles().click(function () {
		graphBaffles();
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
	// wire up selected focuser change for telescope optimizer
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
});

// end of file