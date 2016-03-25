// copyright Mel Bartels, 2016

'use strict';

MLB.telescopeCriteriaCalc = {};

MLB.telescopeCriteriaCalc.state = {
    focalRatioChecked: undefined,
    eyeOptRowSet: [],
	scalingFactor: undefined
};

MLB.telescopeCriteriaCalc.config = {
    drawCanvasOutline: false,
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
    foldingSecondaryMirrorSizeLabelLit: 'Folding secondary mirror size (m.a.)',
	focalPlaneToSecondaryDistanceLabelLit: 'Focal plane to folding secondary mirror distance',
    focalPointOffsetFromEdgeOfPrimaryLabelLit: 'Focal point offset from top edge of primary',

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

    primaryMirrorThicknessInches: 1.5,
    primaryMirrorCellThicknessInches: 2,

	canvasWidth: 1000,
	canvasHeight: 400,
    canvasBorder: 10,
    canvasDimensionHeight: 50,
    canvasDimensionHalfHeight: 5,
    canvasTextBorder: 4,
    canvasLineWidth: 1,
    canvasTestLineLength: 1000,
    canvasFont: '10pt arial',
    canvasGlassStyle: 'blue',
    canvasOpticalPathStyle: '#aaaaff',
    canvasStructureStyle: 'black',
    canvasStructureLightStyle: 'gray',
    canvasBaffleStyle: 'red',
    canvasTestStyle: 'orange',
    projectedFocuserBaffleDimensionText: 'baffle dia = ',
    primaryMirrorBaffleDimensionText: 'baffle length = ',
    primaryMirrorToFocalPlaneDimensionText: 'primary mirror front edge to focal point = ',
    primaryMirrorToTubeEndDimensionText: 'primary mirror front edge to end of tube = ',
	primaryMirrorToFoldingMirrorText: 'primary mirror front edge to folding mirror = '
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
    btnUpdateFoldingReflector: function () {
        return $('[id=btnUpdateFoldingReflector]');
    },
	btnCalcMinFoldingMirrorSize: function () {
		return $('[id=btnCalcMinFoldingMirrorSize]');
	},
	btnCalcMinFocalPlaneToSecondaryDistance: function () {
		return $('[id=btnCalcMinFocalPlaneToSecondaryDistance]');
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
    foldingSecondaryMirrorSizeLabel: function () {
        return $('[name=foldingSecondaryMirrorSizeLabel]');
    },
    focalPlaneToSecondaryDistanceLabel: function () {
        return $('[name=focalPlaneToSecondaryDistanceLabel]');
    },
    focalPointOffsetFromEdgeOfPrimaryLabel: function () {
        return $('[name=focalPointOffsetFromEdgeOfPrimaryLabel]');
    },
    foldingReflectorNotes: function () {
        return $('[id=foldingReflectorNotes]');
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
    foldingSecondaryMirrorSize: function () {
        return $('[name=foldingSecondaryMirrorSize]');
    },
    focalPlaneToSecondaryDistance: function () {
        return $('[name=focalPlaneToSecondaryDistance]');
    },
    focalPointOffsetFromEdgeOfPrimary: function () {
        return $('[name=focalPointOffsetFromEdgeOfPrimary]');
    },
    foldingReflectorCanvasID: function () {
        return $('#foldingReflectorCanvas');
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

	apertureVal: function () {
		return +this.aperture().val();
	},
    apertureInchesVal: function () {
        return this.convertToInches(this.apertureVal());
    },
    focalRatioVal: function () {
        return +this.focalRatio().val();
    },
    telescopeFocalLengthVal: function () {
        return +this.telescopeFocalLength().val();
    },
    telescopeFocalLengthInchesVal: function () {
        return this.convertToInches(+this.telescopeFocalLengthVal());
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
	focuserRackedInHeightVal: function () {
		return +this.focuserRackedInHeight().val();
	},
	focuserTravelVal: function () {
		return +this.focuserTravel().val();
	},
	barrelTubeInsideDiameterVal: function () {
		return +this.barrelTubeInsideDiameter().val();
	},
	barrelTubeLengthVal: function () {
		return +this.barrelTubeLength().val();
	},
	telescopeTubeODVal: function () {
		return +this.telescopeTubeOD().val();
	},
	focuserInwardFocusingDistanceVal: function () {
		return +this.focuserInwardFocusingDistance().val();
	},
	telescopeTubeThicknessVal: function () {
		return +this.telescopeTubeThickness().val();
	},
    focalPlaneToDiagDistanceVal: function () {
        return +this.focalPlaneToDiagDistance().val();
    },
    acceptableMagLossVal: function () {
        return +this.acceptableMagLoss().val();
    },
    diagSizesVal: function () {
        return this.diagSizes().val();
    },
    optimizedDiagSizeVal: function () {
        return +this.optimizedDiagSize().val();
    },
    focalPlaneToFocuserBarrelBottomDistanceVal: function () {
        return +this.focalPlaneToFocuserBarrelBottomDistance().val();
    },
    diagOffsetVal: function () {
        return +this.diagOffset().val();
    },
    foldingSecondaryMirrorSizeVal: function () {
        return +this.foldingSecondaryMirrorSize().val();
    },
    focalPlaneToSecondaryDistanceVal: function () {
        return +this.focalPlaneToSecondaryDistance().val();
    },
    focalPointOffsetFromEdgeOfPrimaryVal: function () {
        return +this.focalPointOffsetFromEdgeOfPrimary().val();
    }
};

MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor = function (common) {
    if (common.useComaCorrectorMagVal()) {
        return common.comaCorrectorMagVal();
    }
    return 1;
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
        aperture,
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
    focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
    focalLen = common.telescopeFocalLengthVal();
    aperture = common.apertureVal();
    acceptableMagLoss = common.acceptableMagLossVal();

    minDiag = focalPlaneToDiagDistance / (focalLen / aperture);
    minIllum = inverseMagnitudeDrop(acceptableMagLoss);

    suitableDiags = [];
    diagonalsLength = diagonals.length;
    for (ix = 0; ix < diagonalsLength; ix++) {
        diagSize = diagonals[ix];
        offAxisIllum = calcOffAxisIllumination(aperture, focalLen, diagSize, focalPlaneToDiagDistance, maxField / 2);
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
        calcs.push(getDiagIllumArray(aperture, focalLen, suitableDiags[ix], focalPlaneToDiagDistance, offAxisIncrement, maxField));
        lossDueToDiagonals.push(diagObstructionArea(aperture, suitableDiags[ix]));
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

    offset = calcDiagOffset(aperture, focalLen, diagSize, focalPlaneToDiagDistance);
    minDiagWhenOffset = minDiag + offset / (parseFloat(focalLen) / parseFloat(aperture));

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
	common.foldingSecondaryMirrorSize().val(roundToDecimal(common.optimizedDiagSizeVal(), config.decimalPointsDiag));
	common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.optimizedDiagSizeVal() * common.focalRatioVal(), config.decimalPointsDimension));
};

MLB.telescopeCriteriaCalc.setCanvasScalingFactor = function () {
    var state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
		baffleScalingFactor = MLB.calcLib.baffleScalingFactor;

    state.scalingFactor = baffleScalingFactor(config.canvasWidth, config.canvasHeight, common.telescopeFocalLengthVal(), common.apertureVal() * 2, config.canvasBorder);
};

MLB.telescopeCriteriaCalc.graphBaffles = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        setCanvasScalingFactor = MLB.telescopeCriteriaCalc.setCanvasScalingFactor,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        uom = MLB.sharedLib.uom,
        calcProjectedFocuserBaffleRadius = MLB.calcLib.calcProjectedFocuserBaffleRadius,
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
		sagitta,
        diagSize,
        diagOffset,
        focalPlaneToFocuserBarrelBottomDistance,
        projectedFocuserBaffleRadius,
        primaryMirrorThicknessInUom,
        primaryMirrorCellThicknessInUom,
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
        tubeRearEndFrontCenterPt,
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

    aperture = common.apertureVal();
    telescopeFocalLength = common.telescopeFocalLengthVal();
    focalRatio = telescopeFocalLength / aperture;
    eyepieceFieldStop = common.convertmmToUom(common.eyepieceFieldStopmmVal());
    barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
    barrelTubeLength = common.barrelTubeLengthVal();
    telescopeTubeOD = common.telescopeTubeODVal();
    telescopeTubeThickness = common.telescopeTubeThicknessVal();
    focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
    diagSize = common.optimizedDiagSizeVal();
    diagOffset = common.diagOffsetVal();
    focalPlaneToFocuserBarrelBottomDistance = common.focalPlaneToFocuserBarrelBottomDistanceVal();

    projectedFocuserBaffleRadius = calcProjectedFocuserBaffleRadius(eyepieceFieldStop, barrelTubeInsideDiameter, common.focalPlaneToFocuserBarrelBottomDistanceVal(), focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness);
	sagitta = calcSagitta(aperture, focalRatio);

    primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
    primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

	setCanvasScalingFactor();
    scaledAperture = state.scalingFactor * aperture;
    scaledMirrorRadius = scaledAperture / 2;
    scaledTelescopeFocalLength = state.scalingFactor * telescopeFocalLength;
    scaledEyepieceFieldStop = state.scalingFactor * eyepieceFieldStop;
    scaledBarrelTubeInsideDiameter = state.scalingFactor * barrelTubeInsideDiameter;
    scaledBarrelTubeLength = state.scalingFactor * barrelTubeLength;
    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledTelescopeTubeThickness = state.scalingFactor * telescopeTubeThickness;
    scaledFocalPlaneToDiagDistance = state.scalingFactor * focalPlaneToDiagDistance;
    scaledDiagSize = state.scalingFactor * diagSize;
    scaledHalfDiagSize = scaledDiagSize / 2;
    scaledFocalPlaneToFocuserBarrelBottomDistance = state.scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
    scaledProjectedFocuserBaffleRadius = state.scalingFactor * projectedFocuserBaffleRadius;
    scaledPrimaryMirrorThicknessInUom = state.scalingFactor * primaryMirrorThicknessInUom;
    scaledPrimaryMirrorCellThicknessInUom = state.scalingFactor * primaryMirrorCellThicknessInUom;
    scaledDiagOffset = state.scalingFactor * diagOffset;
    scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
    scaledRadiusCurvature = scaledAperture * focalRatio * 2;
    scaledSagitta = state.scalingFactor * sagitta;

    // calc primary mirror angle from mirror edge to radius of curvature:
    // circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
    // circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
    mirrorRadian = 1 / (2 * focalRatio);

    // canvas 0,0 is upper left
	// calc key points
    mirrorCenterPt = point(config.canvasBorder + scaledPrimaryMirrorThicknessInUom + scaledPrimaryMirrorCellThicknessInUom + scaledTelescopeTubeThickness, canvas.height / 2);
    tubeRearEndFrontCenterPt = point(config.canvasBorder + scaledTelescopeTubeThickness, mirrorCenterPt.y);
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
    projectedFocuserBaffleLeftPt = point(focalPlaneCenterPt.x - scaledProjectedFocuserBaffleRadius,  tubeRearEndFrontCenterPt.y + scaledHalfTubeID);
    projectedFocuserBaffleRightPt = point(focalPlaneCenterPt.x + scaledProjectedFocuserBaffleRadius,  tubeRearEndFrontCenterPt.y + scaledHalfTubeID);
    projectedFocuserBaffleLeftTubeODPt = point(projectedFocuserBaffleLeftPt.x, projectedFocuserBaffleLeftPt.y + scaledTelescopeTubeThickness);
    projectedFocuserBaffleRightTubeODPt = point(projectedFocuserBaffleRightPt.x, projectedFocuserBaffleRightPt.y + scaledTelescopeTubeThickness);

    // calc telescope tube
    tubeLowerRearPt = point(tubeRearEndFrontCenterPt.x, tubeRearEndFrontCenterPt.y + scaledTelescopeTubeOD / 2);
    tubeUpperRearPt = point(tubeRearEndFrontCenterPt.x, tubeRearEndFrontCenterPt.y - scaledTelescopeTubeOD / 2);
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
    primaryMirrorBaffleUpperRearPt = point(tubeUpperRearPt.x, tubeRearEndFrontCenterPt.y - scaledHalfTubeID);
    primaryMirrorBaffleUpperRearTopPt = point(tubeUpperRearPt.x, primaryMirrorBaffleUpperRearPt.y - scaledTelescopeTubeThickness);
    primaryMirrorBaffleUpperFrontTopPt = point(primaryMirrorBaffleUpperFrontPt.x, primaryMirrorBaffleUpperFrontPt.y - scaledTelescopeTubeThickness);
    primaryMirrorBaffleLowerFrontPt = point(primaryMirrorBaffleUpperFrontPt.x, diagLowerPt.y + diagLowerToTubeLowerInsideYDelta);
    primaryMirrorBaffleLowerRearPt = point(primaryMirrorBaffleUpperRearPt.x, tubeRearEndFrontCenterPt.y + scaledHalfTubeID);
    primaryMirrorBaffleLowerRearBottomPt = point(primaryMirrorBaffleUpperRearTopPt.x, primaryMirrorBaffleLowerRearPt.y + scaledTelescopeTubeThickness);
    primaryMirrorBaffleLowerFrontBottomPt = point(primaryMirrorBaffleUpperFrontTopPt.x, primaryMirrorBaffleLowerFrontPt.y + scaledTelescopeTubeThickness);
    // calc primary mirror baffle points behind primary
    primaryMirrorBaffleBehindPrimaryTopPt = point(primaryMirrorBaffleUpperRearTopPt.x - scaledTelescopeTubeThickness, primaryMirrorBaffleUpperRearTopPt.y);
    primaryMirrorBaffleBehindPrimaryBottomPt = point(primaryMirrorBaffleLowerRearBottomPt.x - scaledTelescopeTubeThickness, primaryMirrorBaffleLowerRearBottomPt.y);

    if (config.drawCanvasOutline) {
        context.rect(0, 0, canvas.width, canvas.height);
        context.stroke();
        context.rect(config.canvasBorder, config.canvasBorder, canvas.width - 2 * config.canvasBorder, canvas.height - 2 * config.canvasBorder);
        context.stroke();
    }
    // draw test rays for primary mirror baffle  using line, angle; these lines should exactly overlay the lines calculated above using coordinate rotation and tan()
    if (config.drawTestLines) {
        context.strokeStyle = config.canvasTestStyle;
        context.beginPath();
        context.moveTo(diagUpperPt.x, diagUpperPt.y);
        context.lineTo(diagUpperPt.x + config.canvasTestLineLength * Math.cos(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad), diagUpperPt.y + config.canvasTestLineLength * Math.sin(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad));
        context.stroke();
        context.beginPath();
        context.moveTo(diagLowerPt.x, diagLowerPt.y);
        context.lineTo(diagLowerPt.x + config.canvasTestLineLength * Math.cos(diagLowerToRightFocalPlaneReflectedCanvasAngleRad), diagLowerPt.y + config.canvasTestLineLength * Math.sin(diagLowerToRightFocalPlaneReflectedCanvasAngleRad));
        context.stroke();
        // draw test diagonal axis lines from upper, lower diag points
        a = 225 * uom.degToRad;
        context.beginPath();
        context.moveTo(diagUpperPt.x, diagUpperPt.y);
        context.lineTo(diagUpperPt.x + config.canvasTestLineLength * Math.cos(a), diagUpperPt.y + config.canvasTestLineLength * Math.sin(a));
        context.stroke();
        context.beginPath();
        context.moveTo(diagLowerPt.x, diagLowerPt.y);
        context.lineTo(diagLowerPt.x + config.canvasTestLineLength * Math.cos(a), diagLowerPt.y + config.canvasTestLineLength * Math.sin(a));
        context.stroke();
        // draw focal plane to diagonal crossing light rays
        drawLine(context, config.canvasTestStyle, config.canvasLineWidth, focalPlaneLeftPt, diagUpperPt);
        drawLine(context, config.canvasTestStyle, config.canvasLineWidth, focalPlaneRightPt, diagLowerPt);
    }
    // draw primary mirror to primary focus light rays
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorUpperFacePt, primaryFocusPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorLowerFacePt, primaryFocusPt);
    // draw focal plane edges to cross diagonal edges
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focalPlaneLeftPt, diagUpperPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focalPlaneRightPt, diagLowerPt);
    // draw primary mirror baffle diagonal to inner tube lines
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperFrontPt, diagUpperPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerIntersectPt, diagLowerPt);
    // draw focal plane to projected focuser baffle light rays
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focalPlaneLeftPt, projectedFocuserBaffleRightPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focalPlaneRightPt, projectedFocuserBaffleLeftPt);
    // draw optical paths
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorCenterPt, diagCenterPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagCenterPt, focalPlaneCenterPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagCenterPt, primaryFocusPt);
    // draw telescope tube
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeLowerRearPt, tubeLowerFrontPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeUpperRearPt, tubeUpperFrontPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeLowerRearPt, tubeUpperRearPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, tubeUpperFrontPt, tubeLowerFrontPt);
    // draw projected focuser baffle on opposite side of tube
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftPt, projectedFocuserBaffleRightPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, projectedFocuserBaffleRightTubeODPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, projectedFocuserBaffleLeftPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleRightTubeODPt, projectedFocuserBaffleRightPt);
    // draw primary mirror baffles
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRearPt, primaryMirrorBaffleUpperFrontPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRearTopPt, primaryMirrorBaffleUpperFrontTopPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRearTopPt, primaryMirrorBaffleUpperRearPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperFrontTopPt, primaryMirrorBaffleUpperFrontPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRearPt, primaryMirrorBaffleLowerFrontPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRearBottomPt, primaryMirrorBaffleLowerFrontBottomPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRearPt, primaryMirrorBaffleLowerRearBottomPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerFrontPt, primaryMirrorBaffleLowerFrontBottomPt);
    // draw primary mirror baffle behind mirror
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryTopPt, primaryMirrorBaffleUpperRearTopPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryTopPt, primaryMirrorBaffleBehindPrimaryBottomPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, tubeLowerRearPt, tubeUpperRearPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryBottomPt, primaryMirrorBaffleLowerRearBottomPt);
    // draw focuser barrel tube
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarreltubeLowerRearPt, focuserBarreltubeLowerFrontPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarreltubeLowerFrontPt, focuserBarreltubeUpperFrontPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarreltubeUpperFrontPt, focuserBarreltubeUpperRearPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarreltubeUpperRearPt, focuserBarreltubeLowerRearPt);
    // draw focal plane field
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, focalPlaneLeftPt, focalPlaneRightPt);
    // draw diagonal
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, diagUpperPt, diagLowerPt);
    // draw mirror edges, back
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperFacePt, mirrorUpperBackPt);
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorLowerFacePt, mirrorLowerBackPt);
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperBackPt, mirrorLowerBackPt);
    // draw primary mirror curved face
    context.beginPath();
    context.arc(mirrorCenterPt.x + scaledRadiusCurvature, mirrorCenterPt.y, scaledRadiusCurvature, uom.halfRev - mirrorRadian / 2, uom.halfRev + mirrorRadian / 2);
    context.lineWidth = config.canvasLineWidth;
    context.strokeStyle = config.canvasGlassStyle;
    context.stroke();
    // write dimension for projected focuser baffle
    context.font = config.canvasFont;
    dimension = roundToDecimal(projectedFocuserBaffleRadius * 2, config.decimalPointsDimension) + uomLit;
    dimensionY = projectedFocuserBaffleRightPt.y + 4 * config.canvasDimensionHalfHeight;
    dimensionRightPt = point(projectedFocuserBaffleRightPt.x, dimensionY);
    dimensionLeftPt = point(projectedFocuserBaffleLeftPt.x, dimensionY);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight));
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight));
    context.fillText(config.projectedFocuserBaffleDimensionText + dimension, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
    // write dimension for primary mirror baffle
    dimension = roundToDecimal((primaryMirrorBaffleLowerFrontPt.x - mirrorLowerFacePt.x) / state.scalingFactor, config.decimalPointsDimension) + uomLit;
    dimensionRightPt = point(primaryMirrorBaffleLowerFrontPt.x, dimensionY);
    dimensionLeftPt = point(mirrorLowerFacePt.x, dimensionY);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight));
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight));
    context.fillText(config.primaryMirrorBaffleDimensionText + dimension, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
    // write mirror front edge to focal plane center line dimension
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    dimension = roundToDecimal((focalPlaneCenterPt.x - mirrorLowerFacePt.x) / state.scalingFactor, config.decimalPointsDimension) + uomLit;
    dimensionRightPt = point(focalPlaneCenterPt.x, dimensionY);
    dimensionLeftPt = point(mirrorLowerFacePt.x, dimensionY);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight));
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight));
    context.fillText(config.primaryMirrorToFocalPlaneDimensionText + dimension, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
    // write mirror front edge to tube front dimension
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    dimension = roundToDecimal((projectedFocuserBaffleRightPt.x - mirrorLowerFacePt.x) / state.scalingFactor, config.decimalPointsDimension) + uomLit;
    dimensionRightPt = point(projectedFocuserBaffleRightPt.x, dimensionY);
    dimensionLeftPt = point(mirrorLowerFacePt.x, dimensionY);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight));
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight));
    context.fillText(config.primaryMirrorToTubeEndDimensionText + dimension, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
    // write out notes
    common.baffleNotes().html('mirror sagitta = ' + roundToDecimal(sagitta, config.decimalPointsDimension) + uomLit);
};

MLB.telescopeCriteriaCalc.graphFoldingReflector = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        setCanvasScalingFactor = MLB.telescopeCriteriaCalc.setCanvasScalingFactor,
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
        foldingSecondaryMirrorSize,
		focalPlaneToSecondaryDistance,
        focalPointOffsetFromEdgeOfPrimary,
        model,
        primaryMirrorThicknessInUom,
        primaryMirrorCellThicknessInUom,
		sagitta,
        scaledMainAxisLength,
        scaledAperture,
        scaledRadiusCurvature,
        scaledMirrorRadius,
        scaledTelescopeFocalLength,
        scaledEyepieceFieldStop,
        scaledBarrelTubeInsideDiameter,
        scaledBarrelTubeLength,
        scaledTelescopeTubeOD,
        scaledTelescopeTubeThickness,
        scaledPrimaryMirrorThicknessInUom,
        scaledPrimaryMirrorCellThicknessInUom,
        scaledHalfTubeID,
        scaledSagitta,
        mirrorRadian,
        mirrorCenterPt,
        primaryFocusPt,
        mirrorUpperFacePt,
        mirrorLowerFacePt,
        mirrorUpperBackPt,
        mirrorLowerBackPt,
        diagPt,
        focalPt,
		focalPlaneAngleRad,
		focalPlaneRightPt,
		focalPlaneLeftPt,
        diagAngleRad,
        halfDiagLen,
        xDelta,
        yDelta,
        diagUpperLeftPt,
        diagLowerRightPt,
        eyepieceMirrorString,
        dimensionY,
        dimensionLeftPt,
        dimensionRightPt,
        diagonalToMirrorString,
        diagonalString,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        uom = MLB.sharedLib.uom,
        calcSagitta = MLB.calcLib.calcSagitta,
        calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian,
        uomLit = common.inInches() ? config.inchesLit : config.mmLit;

    canvas = common.foldingReflectorCanvasID()[0];
    context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    aperture = common.apertureVal();
    telescopeFocalLength = common.telescopeFocalLengthVal();
    focalRatio = telescopeFocalLength / aperture;
    eyepieceFieldStop = common.convertmmToUom(common.eyepieceFieldStopmmVal());
    barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
    barrelTubeLength = common.barrelTubeLengthVal();
    telescopeTubeOD = common.telescopeTubeODVal();
    telescopeTubeThickness = common.telescopeTubeThicknessVal();
    foldingSecondaryMirrorSize = common.foldingSecondaryMirrorSizeVal();
	focalPlaneToSecondaryDistance = common.focalPlaneToSecondaryDistanceVal();
    focalPointOffsetFromEdgeOfPrimary = common.focalPointOffsetFromEdgeOfPrimaryVal();

    primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
    primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

	sagitta = calcSagitta(aperture, focalRatio);

	// focalPlaneToTertiaryDistance = 0
    model = calcFoldedNewtonian(aperture, focalRatio, foldingSecondaryMirrorSize, 0, focalPointOffsetFromEdgeOfPrimary, focalPlaneToSecondaryDistance);

	setCanvasScalingFactor();
    scaledMainAxisLength = state.scalingFactor * model.diagToPrimaryMirrorDistance;
    scaledAperture = state.scalingFactor * aperture;
    scaledRadiusCurvature = scaledAperture * focalRatio * 2;
    scaledMirrorRadius = scaledAperture / 2;
    scaledTelescopeFocalLength = state.scalingFactor * telescopeFocalLength;
    scaledEyepieceFieldStop = state.scalingFactor * eyepieceFieldStop;
    scaledBarrelTubeInsideDiameter = state.scalingFactor * barrelTubeInsideDiameter;
    scaledBarrelTubeLength = state.scalingFactor * barrelTubeLength;
    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledTelescopeTubeThickness = state.scalingFactor * telescopeTubeThickness;
    scaledPrimaryMirrorThicknessInUom = state.scalingFactor * primaryMirrorThicknessInUom;
    scaledPrimaryMirrorCellThicknessInUom = state.scalingFactor * primaryMirrorCellThicknessInUom;
    scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
    scaledSagitta = state.scalingFactor * sagitta;

    // calc primary mirror angle from mirror edge to radius of curvature:
    // circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
    // circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
    mirrorRadian = 1 / (2 * focalRatio);

    // canvas 0,0 is upper left
	// calc key points
    mirrorCenterPt = point(config.canvasBorder + scaledPrimaryMirrorThicknessInUom + scaledPrimaryMirrorCellThicknessInUom + scaledTelescopeTubeThickness, canvas.height / 2);
    primaryFocusPt = point(mirrorCenterPt.x + scaledTelescopeFocalLength, mirrorCenterPt.y);

    // calc mirror edges, back
    mirrorUpperFacePt = point(mirrorCenterPt.x + scaledSagitta, mirrorCenterPt.y - scaledMirrorRadius);
    mirrorLowerFacePt = point(mirrorCenterPt.x + scaledSagitta, mirrorCenterPt.y + scaledMirrorRadius);
    mirrorUpperBackPt = point(mirrorCenterPt.x - scaledPrimaryMirrorThicknessInUom, mirrorUpperFacePt.y);
    mirrorLowerBackPt = point(mirrorCenterPt.x - scaledPrimaryMirrorThicknessInUom, mirrorLowerFacePt.y);

    // calc diag
    diagPt = point(mirrorCenterPt.x + scaledMainAxisLength, mirrorCenterPt.y);

    // calc focal point and focal plane points
    focalPt = point(mirrorCenterPt.x + state.scalingFactor * model.focalPointToPrimaryMirrorDistance, mirrorCenterPt.y - state.scalingFactor * (aperture / 2 + focalPointOffsetFromEdgeOfPrimary));
	focalPlaneAngleRad = model.elbowAngleDeg * uom.degToRad;
    xDelta = Math.sin(focalPlaneAngleRad) * scaledEyepieceFieldStop / 2;
    yDelta = Math.cos(focalPlaneAngleRad) * scaledEyepieceFieldStop / 2;
	focalPlaneRightPt = point(focalPt.x + xDelta, focalPt.y - yDelta);
	focalPlaneLeftPt = point(focalPt.x - xDelta, focalPt.y + yDelta);

    // calc diagonal
    diagAngleRad = model.elbowAngleDeg / 2 * uom.degToRad;
    halfDiagLen = state.scalingFactor * model.diagMajorAxisSize / 2;
    xDelta = Math.sin(diagAngleRad) * halfDiagLen;
    yDelta = Math.cos(diagAngleRad) * halfDiagLen;
    diagUpperLeftPt = point(diagPt.x + xDelta, diagPt.y - yDelta);
    diagLowerRightPt = point(diagPt.x - xDelta, diagPt.y + yDelta);

    // draw primary mirror to prime focus
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorCenterPt, primaryFocusPt);
    // draw primary mirror to primary focus light rays
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorUpperFacePt, primaryFocusPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorLowerFacePt, primaryFocusPt);
    // draw primary mirror curved face
    context.beginPath();
    context.arc(mirrorCenterPt.x + scaledRadiusCurvature, mirrorCenterPt.y, scaledRadiusCurvature, uom.halfRev - mirrorRadian / 2, uom.halfRev + mirrorRadian / 2);
    context.strokeStyle = config.canvasGlassStyle;
    context.stroke();
    // draw mirror edges, back
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperFacePt, mirrorUpperBackPt);
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorLowerFacePt, mirrorLowerBackPt);
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperBackPt, mirrorLowerBackPt);
    // draw diag to focal point
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagPt, focalPt);
    // draw diagonal
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, diagUpperLeftPt, diagLowerRightPt);
	// draw focal plane
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, focalPlaneLeftPt, focalPlaneRightPt);
    // draw focal point to mirror dimension line
    dimensionY = mirrorLowerFacePt.y + 4 * config.canvasDimensionHalfHeight;
    dimensionLeftPt = point(mirrorUpperFacePt.x, dimensionY);
    dimensionRightPt = point(focalPt.x, dimensionY);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight / 2), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight / 2));
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight / 2), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight / 2));
    // write primary mirror front edge to focal point dimension
    context.font = config.canvasFont;
    context.fillStyle = config.canvasStructureStyle;
    eyepieceMirrorString = config.primaryMirrorToFocalPlaneDimensionText + roundToDecimal(model.focalPointToPrimaryMirrorDistance, config.canvasLineWidth) + uomLit;
    context.fillText(eyepieceMirrorString, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);
    // draw diagonal to mirror dimension line
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    dimensionLeftPt = point(mirrorUpperFacePt.x, dimensionY);
    dimensionRightPt = point(diagPt.x, dimensionY);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - config.canvasDimensionHalfHeight / 2), point(dimensionLeftPt.x, dimensionLeftPt.y + config.canvasDimensionHalfHeight / 2));
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(dimensionRightPt.x, dimensionRightPt.y - config.canvasDimensionHalfHeight / 2), point(dimensionRightPt.x, dimensionRightPt.y + config.canvasDimensionHalfHeight / 2));
    // write primary mirror front edge to folding mirror dimension
    context.fillStyle = config.canvasStructureStyle;
    diagonalToMirrorString = config.primaryMirrorToFoldingMirrorText + roundToDecimal(model.diagToPrimaryMirrorDistance, config.canvasLineWidth) + uomLit;
    context.fillText(diagonalToMirrorString, dimensionLeftPt.x + config.canvasTextBorder, dimensionY - config.canvasTextBorder);

    // write diagonal dimensions
    diagonalString = 'folding mirror: '
        + roundToDecimal(foldingSecondaryMirrorSize, config.canvasLineWidth)
        + 'x'
        + roundToDecimal(model.diagMajorAxisSize, config.canvasLineWidth)
		+ uomLit
        + '; angle = '
        // diagonal angle is half that of the elbow optical angle
        + roundToDecimal(model.elbowAngleDeg / 2, config.canvasLineWidth)
        + ' deg';
    common.foldingReflectorNotes().html(diagonalString
	    + '<br>'
	    + 'mirror sagitta = '
		+ roundToDecimal(sagitta, config.decimalPointsDimension) + uomLit);
};

MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        newTubeOD = common.apertureVal() + common.telescopeTubeThicknessVal() * 2 + common.convertmmToUom(common.eyepieceFieldStopmmVal()),
        newFocalPlaneToDiagDistance = newTubeOD / 2 + common.focuserRackedInHeightVal() + common.focuserInwardFocusingDistanceVal();

    common.telescopeTubeOD().val(roundToDecimal(newTubeOD, config.decimalPointsTube));
    common.focalPlaneToDiagDistance().val(roundToDecimal(newFocalPlaneToDiagDistance, config.decimalPointsTube));
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
        graphBaffles = MLB.telescopeCriteriaCalc.graphBaffles,
        graphFoldingReflector = MLB.telescopeCriteriaCalc.graphFoldingReflector;

    updateFieldsDependentOnAperture();
    updateSpecs();
    updateEyepieceOptimizerRows();
    graphDiagIllum();
    graphBaffles();
    graphFoldingReflector();
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

    common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelLengthInches) + common.focuserInwardFocusingDistanceVal(), config.decimalPointsFocuser));
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
        graphFoldingReflector = MLB.telescopeCriteriaCalc.graphFoldingReflector,
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
    common.foldingSecondaryMirrorSizeLabel().html(config.foldingSecondaryMirrorSizeLabelLit + uomLit + config.equalsLit);
    common.focalPlaneToSecondaryDistanceLabel().html(config.focalPlaneToSecondaryDistanceLabelLit + uomLit + config.equalsLit);
    common.focalPointOffsetFromEdgeOfPrimaryLabel().html(config.focalPointOffsetFromEdgeOfPrimaryLabelLit + uomLit + config.equalsLit);

    // replace field values with new uom values; uom state already switched
    common.aperture().val(roundToDecimal(common.apertureVal() * conversionFactor, config.decimalPointsAperture));
    common.telescopeFocalLength().val(roundToDecimal(common.telescopeFocalLengthVal() * conversionFactor, config.decimalPointsTelescopeFocalLength));

    common.focuserRackedInHeight().val(roundToDecimal(common.focuserRackedInHeightVal() * conversionFactor, config.decimalPointsFocuser));
    common.focuserTravel().val(roundToDecimal(common.focuserTravelVal() * conversionFactor, config.decimalPointsFocuser));
    common.barrelTubeInsideDiameter().val(roundToDecimal(common.barrelTubeInsideDiameterVal() * conversionFactor, config.decimalPointsFocuser));
    common.barrelTubeLength().val(roundToDecimal(common.barrelTubeLengthVal() * conversionFactor, config.decimalPointsFocuser));
    common.focuserInwardFocusingDistance().val(roundToDecimal(common.focuserInwardFocusingDistanceVal() * conversionFactor, config.decimalPointsFocuser));

    common.telescopeTubeOD().val(roundToDecimal(common.telescopeTubeODVal() * conversionFactor, config.decimalPointsTube));
    common.telescopeTubeThickness().val(roundToDecimal(common.telescopeTubeThicknessVal() * conversionFactor, config.decimalPointsTube));
    common.focalPlaneToDiagDistance().val(roundToDecimal(common.focalPlaneToDiagDistanceVal() * conversionFactor, config.decimalPointsTube));

    common.diagSizes().val(diags);
    common.optimizedDiagSize().val(roundToDecimal(common.optimizedDiagSizeVal() * conversionFactor, config.decimalPointsDiag));
    common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(common.focalPlaneToFocuserBarrelBottomDistanceVal() * conversionFactor, config.decimalPointsFocuser));
    common.diagOffset().val(roundToDecimal(common.diagOffsetVal() * conversionFactor, config.decimalPointsDiag));

    common.foldingSecondaryMirrorSize().val(roundToDecimal(common.foldingSecondaryMirrorSizeVal() * conversionFactor, config.decimalPointsDiag));
    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() * conversionFactor, config.decimalPointsDiag));
    common.focalPointOffsetFromEdgeOfPrimary().val(roundToDecimal(common.focalPointOffsetFromEdgeOfPrimaryVal() * conversionFactor, config.decimalPointsTelescopeFocalLength));

    if (startup === undefined) {
        // update the diagonal and baffle charts
        graphDiagIllum();
        graphBaffles();
        graphFoldingReflector();
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

MLB.telescopeCriteriaCalc.calcMinFoldingMirrorSize = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common;

    common.foldingSecondaryMirrorSize().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() / common.focalRatioVal(), config.decimalPointsDiag));
};

MLB.telescopeCriteriaCalc.calcMinFocalPlaneToSecondaryDistance = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common;

    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.foldingSecondaryMirrorSizeVal() * common.focalRatioVal(), config.decimalPointsDimension));
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
        graphFoldingReflector = MLB.telescopeCriteriaCalc.graphFoldingReflector,
		calcMinFoldingMirrorSize = MLB.telescopeCriteriaCalc.calcMinFoldingMirrorSize,
		calcMinFocalPlaneToSecondaryDistance = MLB.telescopeCriteriaCalc.calcMinFocalPlaneToSecondaryDistance,
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
    common.btnUpdateFoldingReflector().click(function () {
        graphFoldingReflector();
    });
	common.btnCalcMinFoldingMirrorSize().click(function () {
		calcMinFoldingMirrorSize();
	});
	common.btnCalcMinFocalPlaneToSecondaryDistance().click(function () {
		calcMinFocalPlaneToSecondaryDistance();
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
    $('[id^=' + common.EyeOptSelectID + ']').each(function (idIx) {
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