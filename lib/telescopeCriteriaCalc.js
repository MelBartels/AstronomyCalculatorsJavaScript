/*global
    MLB,$,window
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2016

/*
Adding features:
    add to telescopeCriteriaCalc.html:
        optimizerHeaderNNN must match optimizerDetailNNN so that clicks in the header area open and close the detail area;
            not associated or numbered with discussionHeaderNNN/discussionDetailNNN;
        discussionHeaderNNN must match discussionDetailNNN so that clicks in the header area open and close the detail area;
            not associated or numbered with optimizerHeaderNNN/optimizerDetailNNN;
        if label uses a UOM, then label html set in JavaScript;
    add to telescopeCriteriaCalc.js:
        all constants go in MLB.telescopeCriteriaCalc.config();
        label:
            add wrapper function to MLB.telescopeCriteriaCalc.common() label section
            add label update call to MLB.telescopeCriteriaCalc.processUomChange();
        inputText:
            add wrapper functions to MLB.telescopeCriteriaCalc.common() label and field values sections
    add default value to telescopeCriteriaCalc.html
        or populate value from earlier optimizer using one of the chained functions;
    if new optimizer:
        add new strategy function to chained functions;
    add to summary if needed;
*/

'use strict';

MLB.telescopeCriteriaCalc = {};

MLB.telescopeCriteriaCalc.state = {
    focalRatioChecked: undefined,
    telescopeFocalLength: undefined,
    focusingTolerance: undefined,
    comaFreeDia: undefined,
    luminance: undefined,
    vignettedLuminance: undefined,
    radiance: undefined,
    radiancevignettedLuminancePerWeight: undefined,
    eyeOptRowSet: [],
    diagSize: undefined,
    minDiag: undefined,
    offaxisMask: {},
    scalingFactor: undefined,
    mirrorFrontEdgeToFocalPlaneDistance: undefined,
    tubeBackEndToFocalPlaneDistance: undefined,
    projectedFocuserBaffle: {},
    baffle: {},
    lowRiderModel: {},
    CG: {},
    friction: {},
    totalWeight: undefined,
    rocker: {},
    flexRocker: {}
};

MLB.telescopeCriteriaCalc.config = {
    optimizerHeaderDiagonal: 2,
    optimizerHeaderSummary: 9,

    drawCanvasOutline: false,
    drawTestLines: false,

    lbsLit: ' (lbs)',
    kgLit: ' (kg)',
    inchesLit: ' (inches)',
    mmLit: ' (mm)',
    mmLitNS: 'mm',
    degLit: ' deg',
    luminanceLit: ' cm^2deg^2',
    luminanceParensLit: ' (cm^2deg^2)',
    radianceLuminancePerWeightLit: ' cm^2deg^2/kg',
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
    foldingSecondaryOffsetLabelLit: 'Folding mirror offset (towards primary mirror and away from focuser)',
    focalPlaneToSecondaryDistanceLabelLit: 'Focal plane to folding secondary mirror distance',
    focalPointOffsetFromEdgeOfPrimaryLabelLit: 'Focal point offset from top edge of primary',
    tubeWeightLabelLit: 'Tube weight',
    rockerWeightLabelLit: 'Rocker weight',
    CGToEyepieceDistanceLabelLit: 'Center of gravity to eyepiece distance',
    flexRockerCGToBackEdgeOfTubeClearanceLit: 'Center of gravity to back edge of tube distance',
    altBearingRadiusLabelLit: 'Altitude bearing radius',
    azBearingRadiusLabelLit: 'Azimuth bearing radius',

    sideViewLit: 'Side view',
    frontViewLit: 'Front view',
    topViewLit: 'Top view',

    diagTooSmallErrMsg: 'Secondary too small or focal plane to secondary distance too long.',
    focalPointToDiagTooLongErrMsg: 'Focal point to folding secondary mirror distance too long, or focal point offset from edge of primary mirror too long.',
    cannotBaffleErrMsg: 'Cannot construct a baffle: folding angle too acute.',
    noResults: 'none',

    diagTooSmallAllowance: 0.01,

    decimalPointsAperture: 2,
    decimalPointsLimitingMagnitude: 1,
    decimalPointsFocalRatio: 2,
    decimalPointsTelescopeFocalLength: 2,
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
    decimalPointsDimension: 2,
    decimalPointsCG: 1,
    focusingTolerance: 4,
    decimalPointsLuminance: 0,
    decimalPointsRadiance: 1,
    decimalPointsComaFreeDiameter: 3,
    decimalPointsMaterialArea: 1,

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
    summaryEyeOptManufacturerID: 'summaryEyeOptManufacturer',
    summaryEyeOptTypeID: 'summaryEyeOptType',
    summaryEyeOptFocalLengthID: 'summaryEyeOptFocalLength',
    summaryEyeOptFieldStopID: 'summaryEyeOptFieldStop',
    summaryEyeOptApparentFieldID: 'summaryEyeOptApparentField',
    summaryEyeOptExitPupilID: 'summaryEyeOptExitPupil',
    summaryEyeOptFOVID: 'summaryEyeOptFOV',
    summaryEyeOptMagnificationID: 'summaryEyeOptMagnification',
    summaryEyeOptResolutionID: 'summaryEyeOptResolution',

    eyepieceRows: 10,

    diagonalsInches: [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12],
    diagonalsMm: [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300],

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
    canvasLightBaffleStyle: '#ffaaaa',
    canvasTestStyle: 'orange',
    canvasErrorStyle: 'red',
    projectedFocuserBaffleDimensionText: 'baffle dia = ',
    primaryMirrorBaffleDimensionText: 'baffle length = ',
    primaryMirrorToFocalPlaneDimensionText: 'primary mirror front edge to eyepiece = ',
    primaryMirrorToTubeEndDimensionText: 'primary mirror front edge to end of tube = ',
    primaryMirrorToFoldingMirrorText: 'primary mirror front edge to folding mirror = ',
    altitudeBearingSeparation: 'pad separation = ',
    rockerSideLengthText: 'rocker side length = ',
    rockerSideHeightText: 'rocker side height = ',
    padHeightText: 'pad height = ',
    centerOfGravityText: 'center of gravity',
    rockerFrontBoardWidthText: 'front board width = ',
    rockerFrontBoardHeightText: 'front board height = ',
    flexRockerBaseRingInnerDiaText: 'base ring inner diameter = ',
    flexRockerBaseRingOuterDiaText: 'base ring outer diameter = ',
    flexRockerLengthText: 'rocker inner length = ',
    flexRockerBaseRingHeightText: 'base ring height = ',
    flexRockerWidthText: 'rocker inner width = ',
    flexRockerTubeSwingText: 'tube swing radius = ',

    nightTimeEyePupilInches: 0.25,
    focusingToleranceInchesF1: 0.000043,
    primaryMirrorThicknessInches: 1.5,
    primaryMirrorCellThicknessInches: 2,
    woodThicknessInches: 0.5,
    // 1' x 1' x 1" thick glass weighs 13 lbs, conversion factor is 0.09
    glassLbsPer144CubicInches: 0.09,
    pushAngleDegFromHorizontal: 48,
    frictionOfMovementPadIdealPSI: 15,
    padThicknessInches: 0.25,
    altRimThicknessInches: 1.5,
    flexRockerBaseRingWidthFactor: 1.2,
    flexRockerThicknessInches: 1,

    weights: {
        mirrorMount: 3,
        tube: 15,
        focuser: 1,
        diagonal: 1,
        spider: 1,
        eyepiece: 1
    },

    CGParts: ['Primary mirror', 'Mirror mount', 'Tube', 'Altitude bearings', 'Mirror box', 'Truss tubes', 'Upper end', 'Focuser', 'Diagonal', 'Spider', 'Eyepiece', 'Finder', '(enter name)', '(enter name)', '(enter name)'],
    CGIxs: {
        primaryMirror: 0,
        mirrorMount: 1,
        tube: 2,
        upperEnd: 5,
        altitudeBearings: 6,
        focuser: 7,
        diagonal: 8,
        spider: 9,
        eyepiece: 10
    },
    CGIDs: ['CGPart', 'CGWeight', 'CGDistance']
};

MLB.telescopeCriteriaCalc.common = {
    // buttons...

    radBtnFocalRatioOrEyePupil_EyepieceFocalLength: function () {
        return $('[name=radBtnFocalRatioOrEyePupil_EyepieceFocalLength]');
    },
    btnUom: function () {
        return $('[name=uom]');
    },
    btnCalcAperture: function () {
        return $('[id=btnCalcAperture]');
    },
    btnCalcFocalRatio: function () {
        return $('[id=btnCalcFocalRatio]');
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
    btnCalcFoldingSecondaryOffset: function () {
        return $('[id=btnCalcFoldingSecondaryOffset]');
    },
    btnCalcMinFocalPlaneToSecondaryDistance: function () {
        return $('[id=btnCalcMinFocalPlaneToSecondaryDistance]');
    },
    btnCalcCG: function () {
        return $('[id=btnCalcCG]');
    },
    btnUpdateFrictionOfMovement: function () {
        return $('[id=btnUpdateFrictionOfMovement]');
    },
    btnUpdateFlexRocker: function () {
        return $('[id=btnUpdateFlexRocker]');
    },
    btnUpdateET: function () {
        return $('[id=btnUpdateET]');
    },

    focalRatioChecked: function () {
        return this.radBtnFocalRatioOrEyePupil_EyepieceFocalLength()[0].checked;
    },
    imperial: function () {
        return this.btnUom()[0].checked;
    },

    // labels...

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
    optimizedDiagSizeLabel: function () {
        return $('[name=optimizedDiagSizeLabel]');
    },
    focalPlaneToFocuserBarrelBottomDistanceLabel: function () {
        return $('[name=focalPlaneToFocuserBarrelBottomDistanceLabel]');
    },
    diagOffsetLabel: function () {
        return $('[name=diagOffsetLabel]');
    },
    foldingSecondaryMirrorSizeLabel: function () {
        return $('[name=foldingSecondaryMirrorSizeLabel]');
    },
    foldingSecondaryOffsetLabel: function () {
        return $('[name=foldingSecondaryOffsetLabel]');
    },
    focalPlaneToSecondaryDistanceLabel: function () {
        return $('[name=focalPlaneToSecondaryDistanceLabel]');
    },
    focalPointOffsetFromEdgeOfPrimaryLabel: function () {
        return $('[name=focalPointOffsetFromEdgeOfPrimaryLabel]');
    },
    tubeWeightLabel: function () {
        return $('[name=tubeWeightLabel]');
    },
    rockerWeightLabel: function () {
        return $('[name=rockerWeightLabel]');
    },
    CGToEyepieceDistanceLabel: function () {
        return $('[name=CGToEyepieceDistanceLabel]');
    },
    altBearingRadiusLabel: function () {
        return $('[name=altBearingRadiusLabel]');
    },
    azBearingRadiusLabel: function () {
        return $('[name=azBearingRadiusLabel]');
    },
    flexRockerCGToEyepieceDistanceLabel: function () {
        return $('[name=flexRockerCGToEyepieceDistanceLabel]');
    },
    flexRockerTubeWeightLabel: function () {
        return $('[name=flexRockerTubeWeightLabel]');
    },
    flexRockerRockerWeightLabel: function () {
        return $('[name=flexRockerRockerWeightLabel]');
    },
    flexRockerCGToBackEdgeOfTubeClearanceLabel: function () {
        return $('[name=flexRockerCGToBackEdgeOfTubeClearanceLabel]');
    },

    // input fields...

    aperture: function () {
        return $('[name=aperture]');
    },
    focalRatio: function () {
        return $('[name=focalRatio]');
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
    optimizedDiagSize: function () {
        return $('[name=optimizedDiagSize]');
    },
    focalPlaneToFocuserBarrelBottomDistance: function () {
        return $('[name=focalPlaneToFocuserBarrelBottomDistance]');
    },
    diagOffset: function () {
        return $('[name=diagOffset]');
    },
    foldingSecondaryMirrorSize: function () {
        return $('[name=foldingSecondaryMirrorSize]');
    },
    foldingSecondaryOffset: function () {
        return $('[name=foldingSecondaryOffset]');
    },
    focalPlaneToSecondaryDistance: function () {
        return $('[name=focalPlaneToSecondaryDistance]');
    },
    focalPointOffsetFromEdgeOfPrimary: function () {
        return $('[name=focalPointOffsetFromEdgeOfPrimary]');
    },
    tubeWeight: function () {
        return $('[name=tubeWeight]');
    },
    rockerWeight: function () {
        return $('[name=rockerWeight]');
    },
    CGToEyepieceDistance: function () {
        return $('[name=CGToEyepieceDistance]');
    },
    altBearingSeparationDeg: function () {
        return $('[name=altBearingSeparationDeg]');
    },
    altBearingRadius: function () {
        return $('[name=altBearingRadius]');
    },
    azBearingRadius: function () {
        return $('[name=azBearingRadius]');
    },
    flexRockerCGToEyepieceDistance: function () {
        return $('[name=flexRockerCGToEyepieceDistance]');
    },
    flexRockerTubeWeight: function () {
        return $('[name=flexRockerTubeWeight]');
    },
    flexRockerRockerWeight: function () {
        return $('[name=flexRockerRockerWeight]');
    },
    flexRockerCGToBackEdgeOfTubeClearance: function () {
        return $('[name=flexRockerCGToBackEdgeOfTubeClearance]');
    },
    flexRockerAltBearingSeparationDeg: function () {
        return $('[name=flexRockerAltBearingSeparationDeg]');
    },
    latitudeDeg: function () {
        return $('[name=latitudeDeg]');
    },

    // drop downs...

    comaCorrectorSelect: function () {
        return $('#comaCorrectorSelect');
    },
    eyepieceSelect: function () {
        return $('#eyepieceSelect');
    },
    focuserSelect: function () {
        return $('#focuserSelect');
    },
    altBearingMaterialsSelect: function () {
        return $('#altBearingMaterialsSelect');
    },
    azBearingMaterialsSelect: function () {
        return $('#azBearingMaterialsSelect');
    },
    flexRockerAltBearingMaterialsSelect: function () {
        return $('#flexRockerAltBearingMaterialsSelect');
    },
    flexRockerAzBearingMaterialsSelect: function () {
        return $('#flexRockerAzBearingMaterialsSelect');
    },

    // tables...

    tableElement: function (ID, idIx) {
        return $('[id=' + ID + idIx + ']');
    },

    eyeOptTableBody: function () {
        return $('#eyeOptTableBody');
    },
    CGTableBody: function () {
        return $('#CGTableBody');
    },
    summaryEyeOptTableBody: function () {
        return $('#summaryEyeOptTableBody');
    },

    // charts...

    diagChartID: function () {
        return 'diagChart';
    },
    summaryDiagChartID: function () {
        return 'summaryDiagChart';
    },

    // results fields...

    telescopeResults: function () {
        return $('[id=telescopeResults]');
    },
    diagResults: function () {
        return $('[id=diagResults]');
    },
    offaxisMaskResults: function () {
        return $('[id=offaxisMaskResults]');
    },
    baffleResults: function () {
        return $('[id=baffleResults]');
    },
    foldingReflectorResults: function () {
        return $('[id=foldingReflectorResults]');
    },
    frictionOfMovementResults: function () {
        return $('[id=frictionOfMovementResults]');
    },
    CGResults: function () {
        return $('[id=CGResults]');
    },
    rockerResults: function () {
        return $('[id=rockerResults]');
    },
    flexRockerResults: function () {
        return $('[id=flexRockerResults]');
    },
    ETResults: function () {
        return $('[id=ETResults]');
    },
    summaryMagnitudeLimit: function () {
        return $('[id=summaryMagnitudeLimit]');
    },
    summaryRadiance: function () {
        return $('[id=summaryRadiance]');
    },
    summaryDawesLimit: function () {
        return $('[id=summaryDawesLimit]');
    },
    summaryLuminance: function () {
        return $('[id=summaryLuminance]');
    },
    summaryVignettedLuminance: function () {
        return $('[id=summaryVignettedLuminance]');
    },
    summaryVignettedLuminanceRadiancePerWeight: function () {
        return $('[id=summaryVignettedLuminanceRadiancePerWeight]');
    },
    summaryAperture: function () {
        return $('[id=summaryAperture]');
    },
    summaryFocalRatio: function () {
        return $('[id=summaryFocalRatio]');
    },
    summaryTelescopeFocalLength: function () {
        return $('[id=summaryTelescopeFocalLength]');
    },
    summaryOptimizedEyepiece: function () {
        return $('[id=summaryOptimizedEyepiece]');
    },
    summaryOptimizedEyepieceFocalLength: function () {
        return $('[id=summaryOptimizedEyepieceFocalLength]');
    },
    summaryOptimizedEyepieceApparentField: function () {
        return $('[id=summaryOptimizedEyepieceApparentField]');
    },
    summaryOptimizedEyepieceFieldStop: function () {
        return $('[id=summaryOptimizedEyepieceFieldStop]');
    },
    summaryComaCorrector: function () {
        return $('[id=summaryComaCorrector]');
    },
    summaryComaFreeDiameter: function () {
        return $('[id=summaryComaFreeDiameter]');
    },
    summaryEyePupil: function () {
        return $('[id=summaryEyePupil]');
    },
    summaryFOV: function () {
        return $('[id=summaryFOV]');
    },
    summaryMagnification: function () {
        return $('[id=summaryMagnification]');
    },
    summaryUsefulMagnification: function () {
        return $('[id=summaryUsefulMagnification]');
    },
    summaryFocalPlaneToDiagonalDistance: function () {
        return $('[id=summaryFocalPlaneToDiagonalDistance]');
    },
    summaryDiagonalSize: function () {
        return $('[id=summaryDiagonalSize]');
    },
    summaryDiagOffset: function () {
        return $('[id=summaryDiagOffset]');
    },
    summaryFocuser: function () {
        return $('[id=summaryFocuser]');
    },
    summaryFocuserRackedInHeight: function () {
        return $('[id=summaryFocuserRackedInHeight]');
    },
    summaryFocuserTravel: function () {
        return $('[id=summaryFocuserTravel]');
    },
    summaryBarrelTubeInsideDiameter: function () {
        return $('[id=summaryBarrelTubeInsideDiameter]');
    },
    summaryBarrelTubeLength: function () {
        return $('[id=summaryBarrelTubeLength]');
    },
    summaryFocuserInwardFocusingDistance: function () {
        return $('[id=summaryFocuserInwardFocusingDistance]');
    },
    summaryFocusingTolerance: function () {
        return $('[id=summaryFocusingTolerance]');
    },
    summaryTelescopeTubeOD: function () {
        return $('[id=summaryTelescopeTubeOD]');
    },
    summaryTelescopeTubeThickness: function () {
        return $('[id=summaryTelescopeTubeThickness]');
    },
    summaryMirrorSagita: function () {
        return $('[id=summaryMirrorSagita]');
    },
    summaryOffaxisMaskDia: function () {
        return $('[id=summaryOffaxisMaskDia]');
    },
    summaryOffaxisMaskHighestMagnification: function () {
        return $('[id=summaryOffaxisMaskHighestMagnification]');
    },
    summaryOffaxisMaskResolution: function () {
        return $('[id=summaryOffaxisMaskResolution]');
    },
    summaryOffaxisMaskMagnitudeLimit: function () {
        return $('[id=summaryOffaxisMaskMagnitudeLimit]');
    },
    summaryBaffleOppositeFocuserDia: function () {
        return $('[id=summaryBaffleOppositeFocuserDia]');
    },
    summaryTiltedBaffleOppositeFocuserDia: function () {
        return $('[id=summaryTiltedBaffleOppositeFocuserDia]');
    },
    summaryBafflePrimaryMirrorExtension: function () {
        return $('[id=summaryBafflePrimaryMirrorExtension]');
    },
    summaryLowriderPrimaryMirrorFrontEdgeToEyepiece: function () {
        return $('[id=summaryLowriderPrimaryMirrorFrontEdgeToEyepiece]');
    },
    summaryLowriderPrimaryMirrorFrontEdgeToFoldingMirror: function () {
        return $('[id=summaryLowriderPrimaryMirrorFrontEdgeToFoldingMirror]');
    },
    summaryLowriderPrimaryMirrorFrontEdgeToEndOfTube: function () {
        return $('[id=summaryLowriderPrimaryMirrorFrontEdgeToEndOfTube]');
    },
    summaryLowriderBendingAngle: function () {
        return $('[id=summaryLowriderBendingAngle]');
    },
    summaryLowriderFoldingMirrorSize: function () {
        return $('[id=summaryLowriderFoldingMirrorSize]');
    },
    summaryOTAWeight: function () {
        return $('[id=summaryOTAWeight]');
    },
    summaryMountWeight: function () {
        return $('[id=summaryMountWeight]');
    },
    summaryTotalWeight: function () {
        return $('[id=summaryTotalWeight]');
    },
    summaryCG: function () {
        return $('[id=summaryCG]');
    },
    summaryCGSensitivity: function () {
        return $('[id=summaryCGSensitivity]');
    },
    summaryCGToEyepieceDistance: function () {
        return $('[id=summaryCGToEyepieceDistance]');
    },
    summaryCGToTubeBackCornerDistance: function () {
        return $('[id=summaryCGToTubeBackCornerDistance]');
    },
    summaryRockerDimensions: function () {
        return $('[id=summaryRockerDimensions]');
    },
    summaryAltFrictionAtEyepiece: function () {
        return $('[id=summaryAltFrictionAtEyepiece]');
    },
    summaryAzFrictionAtEyepiece: function () {
        return $('[id=summaryAzFrictionAtEyepiece]');
    },
    summaryAzPadSize: function () {
        return $('[id=summaryAzPadSize]');
    },
    summaryFlexRockerRockerDimensions: function () {
        return $('[id=summaryFlexRockerRockerDimensions]');
    },
    summaryFlexRockerBaseRingDimensions: function () {
        return $('[id=summaryFlexRockerBaseRingDimensions]');
    },
    summaryFlexRockerAltFrictionAtEyepiece: function () {
        return $('[id=summaryFlexRockerAltFrictionAtEyepiece]');
    },
    summaryFlexRockerAzFrictionAtEyepiece: function () {
        return $('[id=summaryFlexRockerAzFrictionAtEyepiece]');
    },
    summaryFlexRockerAzPadSize: function () {
        return $('[id=summaryFlexRockerAzPadSize]');
    },

    // canvas...

    baffleCanvasID: function () {
        return $('#baffleCanvas')[0];
    },
    foldingReflectorCanvasID: function () {
        return $('#foldingReflectorCanvas')[0];
    },
    rockerCanvasID: function () {
        return $('#rockerCanvas')[0];
    },
    flexRockerCanvasID: function () {
        return $('#flexRockerCanvas')[0];
    },

    // helper functions...

    getUomLengthLit: function () {
        var config = MLB.telescopeCriteriaCalc.config;

        return this.imperial()
            ? config.inchesLit
            : config.mmLit;
    },
    getUomWeightLit: function () {
        var config = MLB.telescopeCriteriaCalc.config;

        return this.imperial()
            ? config.lbsLit
            : config.kgLit;
    },

    convertUomToInches: function (value) {
        if (this.imperial()) {
            return value;
        }
        return value / 25.4;
    },
    convertUomToMm: function (value) {
        if (this.imperial()) {
            return value * 25.4;
        }
        return value;
    },
    convertInchesToUom: function (inches) {
        if (this.imperial()) {
            return inches;
        }
        return inches * 25.4;
    },
    convertMmToUom: function (mm) {
        if (this.imperial()) {
            return mm / 25.4;
        }
        return mm;
    },

    convertInchesSquaredToUom: function (inchesSquared) {
        if (this.imperial()) {
            return inchesSquared;
        }
        return inchesSquared * 25.4 * 25.4;
    },

    convertUomToLbs: function (value) {
        if (this.imperial()) {
            return value;
        }
        return value * 2.205;
    },
    convertUomToKg: function (value) {
        if (this.imperial()) {
            return value / 2.205;
        }
        return value;
    },
    convertLbsToUom: function (lbs) {
        if (this.imperial()) {
            return lbs;
        }
        return lbs / 2.205;
    },
    convertKgToUom: function (kg) {
        if (this.imperial()) {
            return kg * 2.205;
        }
        return kg;
    },

    getLengthConversionFactorIgnoreAtStartup: function (startup) {
        return startup !== undefined
            ? 1
            : this.imperial()
                ? (1 / 25.4)
                : 25.4;
    },
    getWeightConversionFactorIgnoreAtStartup: function (startup) {
        return startup !== undefined
            ? 1
            : this.imperial()
                ? 2.205
                : (1 / 2.205);
    },

    // field values...

    apertureVal: function () {
        return +this.aperture().val();
    },
    apertureInchesVal: function () {
        return this.convertUomToInches(this.apertureVal());
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
    foldingSecondaryOffsetVal: function () {
        return +this.foldingSecondaryOffset().val();
    },
    focalPlaneToSecondaryDistanceVal: function () {
        return +this.focalPlaneToSecondaryDistance().val();
    },
    focalPointOffsetFromEdgeOfPrimaryVal: function () {
        return +this.focalPointOffsetFromEdgeOfPrimary().val();
    },
    tubeWeightVal: function () {
        return +this.tubeWeight().val();
    },
    rockerWeightVal: function () {
        return +this.rockerWeight().val();
    },
    CGToEyepieceDistanceVal: function () {
        return +this.CGToEyepieceDistance().val();
    },
    altBearingSeparationDegVal: function () {
        return +this.altBearingSeparationDeg().val();
    },
    altBearingRadiusVal: function () {
        return +this.altBearingRadius().val();
    },
    altBearingRadiusInchesVal: function () {
        return this.convertUomToInches(this.altBearingRadiusVal());
    },
    azBearingRadiusVal: function () {
        return +this.azBearingRadius().val();
    },
    azBearingRadiusInchesVal: function () {
        return this.convertUomToInches(this.azBearingRadiusVal());
    },
    flexRockerCGToEyepieceDistanceVal: function () {
        return +this.flexRockerCGToEyepieceDistance().val();
    },
    flexRockerTubeWeightVal: function () {
        return +this.flexRockerTubeWeight().val();
    },
    flexRockerRockerWeightVal: function () {
        return +this.flexRockerRockerWeight().val();
    },
    flexRockerCGToBackEdgeOfTubeClearanceVal: function () {
        return +this.flexRockerCGToBackEdgeOfTubeClearance().val();
    },
    flexRockerAltBearingSeparationDegVal: function () {
        return +this.flexRockerAltBearingSeparationDeg().val();
    },
    latitudeDegVal: function () {
        return +this.latitudeDeg().val();
    }
};

MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor = function () {
    var common = MLB.telescopeCriteriaCalc.common;

    if (common.useComaCorrectorMagVal()) {
        return common.comaCorrectorMagVal();
    }
    return 1;
};

MLB.telescopeCriteriaCalc.calcComaFreeDia = function () {
    var common = MLB.telescopeCriteriaCalc.common,
        calcComaFreeDiaInches = MLB.calcLib.calcComaFreeDiaInches,
        comaFreeDiaFocalRatio = common.useComaCorrectorMagVal()
            ? 12
            : common.focalRatioVal();

    return common.convertInchesToUom(calcComaFreeDiaInches(comaFreeDiaFocalRatio));
};

MLB.telescopeCriteriaCalc.updateEyepieceOptimizerRows = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        eyepieceFocalLengthmm,
        eyepieceFieldStopmm,
        exitPupil,
        resultFOV,
        magnification,
        resolutionArcsec,
        ix;

    // update exit pupil, true field of view, magnification, resolution for each eyepiece row that's been selected
    for (ix = 0; ix < config.eyepieceRows; ix += 1) {
        if (state.eyeOptRowSet[ix] === true) {
            // get reused vars from page
            eyepieceFocalLengthmm = parseFloat(common.tableElement(config.EyeOptFocalLengthID, ix).html());
            eyepieceFieldStopmm = parseFloat(common.tableElement(config.EyeOptFieldStopID, ix).html());
            // calc
            exitPupil = eyepieceFocalLengthmm / common.focalRatioVal();
            magnification = common.apertureInchesVal() * common.focalRatioVal() / eyepieceFocalLengthmm * 25.4 * comaCorrectorMag;
            resolutionArcsec = resolutionFromAperture_Magnification(common.apertureInchesVal(), magnification);
            // ensure that focal ratio has been calculated and updated prior
            resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), eyepieceFieldStopmm, comaCorrectorMag);
            // display
            common.tableElement(config.EyeOptExitPupilID, ix).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + config.mmLitNS);
            common.tableElement(config.EyeOptFOVID, ix).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + config.degLit);
            common.tableElement(config.EyeOptMagnificationID, ix).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
            common.tableElement(config.EyeOptResolutionID, ix).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');
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

MLB.telescopeCriteriaCalc.updateTelescopeResults = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        focalRatioChecked = common.focalRatioChecked(),
        resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
        magnitudeDifferenceBetweenApertures = MLB.calcLib.magnitudeDifferenceBetweenApertures,
        calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
        calcMaxMagnification = MLB.calcLib.calcMaxMagnification,
        calcDisplayLimitingMagnitude = MLB.telescopeCriteriaCalc.calcDisplayLimitingMagnitude,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        calcComaFreeDia = MLB.telescopeCriteriaCalc.calcComaFreeDia,
        comaFreeDia,
        focalRatio,
        telescopeFocalLength,
        eyePupilmm,
        magnification,
        maxMagnification,
        resolutionArcsec,
        theoreticalResolutionArcsec,
        focusingTolerance,
        apertureCm,
        luminance,
        radiance,
        uomLengthLit = common.getUomLengthLit();

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

    telescopeFocalLength = common.focalRatioVal() * common.apertureVal();
    magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4;
    maxMagnification = calcMaxMagnification(common.apertureInchesVal());
    resolutionArcsec = resolutionFromAperture_Magnification(common.apertureInchesVal(), magnification);
    theoreticalResolutionArcsec = calcTheoreticalResolutionArcsec(common.apertureInchesVal());
    focusingTolerance = common.convertInchesToUom(config.focusingToleranceInchesF1) * common.focalRatioVal() * common.focalRatioVal();
    comaFreeDia = calcComaFreeDia();
    apertureCm = common.convertUomToMm(common.apertureVal()) / 10;
    luminance = apertureCm * apertureCm * common.FOVdegVal() * common.FOVdegVal();
    radiance = magnitudeDifferenceBetweenApertures(common.apertureInchesVal(), config.nightTimeEyePupilInches);
    // save values for use with other optimizers
    state.telescopeFocalLength = telescopeFocalLength;
    state.comaFreeDia = comaFreeDia;
    state.focusingTolerance = focusingTolerance;
    state.luminance = luminance;
    state.radiance = radiance;

    common.telescopeResults().html('telescope focal length = '
            + roundToDecimal(telescopeFocalLength, config.decimalPointsTelescopeFocalLength)
            + uomLengthLit
            + '<br>magnification = '
            + roundToDecimal(magnification, config.decimalPointsMagnification)
            + 'x, max = '
            + roundToDecimal(maxMagnification, config.decimalPointsMagnification)
            + 'x<br>resolution = '
            + roundToDecimal(resolutionArcsec, config.decimalPointsResolution)
            + ' arc seconds (Dawes\' Limit = '
            + roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution)
            + ' arc seconds)<br>focusing tolerance = '
            + roundToDecimal(focusingTolerance, config.focusingTolerance)
            + uomLengthLit
            + '<br>coma free diameter = '
            + roundToDecimal(comaFreeDia, config.decimalPointsComaFreeDiameter)
            + uomLengthLit
            + '<br>luminance (Richest Field effect) = '
            + roundToDecimal(luminance, config.decimalPointsLuminance)
            + config.luminanceParensLit
            + '<br>radiance (brightness) = '
            + roundToDecimal(radiance, config.decimalPointsRadiance)
            + ' magnitudes');
};

MLB.telescopeCriteriaCalc.calcFoldingSecondaryOffset = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        uom = MLB.sharedLib.uom,
        calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian,
        calcDiagOffset3 = MLB.calcLib.calcDiagOffset3,
        model = calcFoldedNewtonian(common.apertureVal(), common.focalRatioVal(), common.foldingSecondaryMirrorSizeVal(), 0, common.focalPointOffsetFromEdgeOfPrimaryVal(), common.focalPlaneToSecondaryDistanceVal()),
        offsetMultiplier = Math.sin(model.elbowAngleDeg / 2 * uom.degToRad) / Math.sin(45 * uom.degToRad),
        offset = calcDiagOffset3(common.foldingSecondaryMirrorSizeVal(), common.focalPlaneToSecondaryDistanceVal());

    common.foldingSecondaryOffset().val(roundToDecimal(offset * offsetMultiplier, config.decimalPointsDiag));
};

MLB.telescopeCriteriaCalc.writeOffaxisMaskResults = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        offaxisMask = state.offaxisMask,
        calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
        limitingMagnitude = MLB.calcLib.limitingMagnitude,
        uomLengthLit = common.getUomLengthLit(),
        offaxisMaskDia = (common.apertureVal() - common.optimizedDiagSizeVal()) / 2,
        offaxisMaskDiaInches = common.convertUomToInches(offaxisMaskDia),
        highestMagnification = offaxisMaskDiaInches * 25,
        theoreticalResolutionArcsec = calcTheoreticalResolutionArcsec(offaxisMaskDiaInches),
        magnitudeLimit = limitingMagnitude(offaxisMaskDiaInches);

    offaxisMask.offaxisMaskDia = offaxisMaskDia;
    offaxisMask.highestMagnification = highestMagnification;
    offaxisMask.theoreticalResolutionArcsec = theoreticalResolutionArcsec;
    offaxisMask.magnitudeLimit = magnitudeLimit;

    common.offaxisMaskResults().html('maximum off-axis diameter = '
            + roundToDecimal(offaxisMaskDia, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>highest magnification = '
            + roundToDecimal(highestMagnification, config.decimalPointsMagnification)
            + 'x<br>Dawes\' Limit = '
            + roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution)
            + ' arc seconds<br>limiting magnitude = '
            + roundToDecimal(magnitudeLimit, config.decimalPointsLimitingMagnitude));
};

MLB.telescopeCriteriaCalc.calcVignettedIllumPercent = function () {
    var common = MLB.telescopeCriteriaCalc.common,
        diagObstructionArea = MLB.calcLib.diagObstructionArea,
        getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
        focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
        focalLen = common.apertureVal() * common.focalRatioVal(),
        aperture = common.apertureVal(),
        diagSize = common.optimizedDiagSizeVal(),
        offAxisIncrement = common.imperial()
            ? 0.1
            : 2,
        maxField = common.convertMmToUom(common.eyepieceFieldStopmmVal()),
        lossDueToDiagonalSize = diagObstructionArea(aperture, diagSize),
        /* array[off-axis points], each element consisting of:
               array[2]: 1st element is the off-axis distance and 2nd element the illumination value
           array goes from one edge of field to center of field to opposite edge of field */
        diagIllumArray = getDiagIllumArray(aperture, focalLen, diagSize, focalPlaneToDiagDistance, offAxisIncrement, maxField),
        /* eg, [0] = 0, 1; [1] = 0.1, 1; ... [4] = 0.4, 0.918; ... [7] = 0.7, 0.788 */
        radiusIllumArray = diagIllumArray.slice(diagIllumArray.length / 2),
        rings = radiusIllumArray.length - 1,
        ix,
        e1,
        e2,
        avgIllum,
        area,
        ringArea,
        lastArea = 0,
        weightedIllum = 0;

    // illumination profile is a parabolic (?) curve; easiest to integrate illum by dividing into rings rather than deriving integral
    for (ix = 0; ix < rings; ix += 1) {
        e1 = radiusIllumArray[ix];
        e2 = radiusIllumArray[ix + 1];
        avgIllum = (e1[1] + e2[1]) / 2;
        area = e2[0] * e2[0] * Math.PI;
        ringArea = area - lastArea;
        // save for next iteration the amount to subtract from the circle area to get the ring area
        lastArea = area;
        weightedIllum += avgIllum * ringArea;
    }
    return weightedIllum / lastArea - lossDueToDiagonalSize;
};

MLB.telescopeCriteriaCalc.graphDiagIllumSubr = function (chart, diagonals) {
    var state = MLB.telescopeCriteriaCalc.state,
        common = MLB.telescopeCriteriaCalc.common,
        minIllum,
        uomLengthLit,
        offAxisIncrement,
        formatString,
        focalPlaneToDiagDistance,
        focalRatio,
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
        diagIx,
        illumIx,
        series,
        tickLabel,
        drop,
        maxDrop,
        seriesLabels,
        seriesLabel = MLB.sharedLib.seriesLabel,
        calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
        magnitudeDrop = MLB.calcLib.magnitudeDrop,
        inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
        diagObstructionArea = MLB.calcLib.diagObstructionArea,
        getDiagIllumArray = MLB.calcLib.getDiagIllumArray;

    uomLengthLit = common.getUomLengthLit();
    if (common.imperial()) {
        offAxisIncrement = 0.1;
        formatString = '%3.1f';
    } else {
        offAxisIncrement = 2;
        formatString = '%1d';
    }
    maxField = common.convertMmToUom(common.eyepieceFieldStopmmVal());
    focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
    focalRatio = common.focalRatioVal();
    focalLen = common.apertureVal() * focalRatio;
    aperture = common.apertureVal();
    acceptableMagLoss = common.acceptableMagLossVal();

    minDiag = focalPlaneToDiagDistance / (focalLen / aperture);
    minIllum = inverseMagnitudeDrop(acceptableMagLoss);

    suitableDiags = [];
    diagonalsLength = diagonals.length;
    for (ix = 0; ix < diagonalsLength; ix += 1) {
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
    for (ix = 0; ix < suitableDiagsLength; ix += 1) {
        calcs.push(getDiagIllumArray(aperture, focalLen, suitableDiags[ix], focalPlaneToDiagDistance, offAxisIncrement, maxField));
        lossDueToDiagonals.push(diagObstructionArea(aperture, suitableDiags[ix]));
    }

    // generate plot data
    offAxisPts = calcs[0].length;
    series = [];
    // include array for maxDrop
    suitableDiagsLength = suitableDiags.length;
    for (diagIx = 0; diagIx <= suitableDiagsLength; diagIx += 1) {
        series.push([]);
    }

    // for each offaxis distance, push the illuminations of the various diagonals followed by the max allowed illum drop
    for (illumIx = 0; illumIx < offAxisPts; illumIx += 1) {
        tickLabel = Math.round(calcs[0][illumIx][0] / offAxisIncrement) * offAxisIncrement;
        maxDrop = magnitudeDrop(minIllum);
        suitableDiagsLength = suitableDiags.length;
        for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
            drop = magnitudeDrop(calcs[diagIx][illumIx][1] - lossDueToDiagonals[diagIx]);
            series[diagIx].push([tickLabel, drop]);
        }
        series[diagIx].push([tickLabel, maxDrop]);
    }

    // build the series labels: each series label represents a diagonal size, ending with the max allowed illum drop label
    seriesLabels = [];
    suitableDiagsLength = suitableDiags.length;
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
        seriesLabels.push(seriesLabel(suitableDiags[diagIx] + uomLengthLit + ' m.a. diagonal'));
    }
    seriesLabels.push(seriesLabel('max allowed drop'));

    $.jqplot.config.enablePlugins = true;
    $.jqplot(chart, series, {
        title: 'Diagonal off-axis illumination',
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            xaxis: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                label: 'off-axis distance' + uomLengthLit,
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

    state.diagSize = suitableDiags[0];
    state.minDiag = minDiag;
};

MLB.telescopeCriteriaCalc.graphDiagIllum = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        graphDiagIllumSubr = MLB.telescopeCriteriaCalc.graphDiagIllumSubr,
        uomLengthLit,
        aperture,
        focalLen,
        offset,
        calcDiagOffset3 = MLB.calcLib.calcDiagOffset3,
        minDiagWhenOffset,
        calcFoldingSecondaryOffset = MLB.telescopeCriteriaCalc.calcFoldingSecondaryOffset,
        writeOffaxisMaskResults = MLB.telescopeCriteriaCalc.writeOffaxisMaskResults;

    graphDiagIllumSubr(common.diagChartID(), common.diagSizesVal().split(',').map(Number));

    uomLengthLit = common.getUomLengthLit();
    aperture = common.apertureVal();
    focalLen = aperture * common.focalRatioVal();
    offset = calcDiagOffset3(state.diagSize, common.focalPlaneToDiagDistanceVal());
    // offset is negative by convention...
    minDiagWhenOffset = state.minDiag + -offset / (focalLen / aperture);
    common.diagResults().html('minimum m.a. size = '
            + roundToDecimal(state.minDiag, config.decimalPointsDiag)
            + uomLengthLit
            + ', '
            + roundToDecimal(minDiagWhenOffset, config.decimalPointsDiag)
            + uomLengthLit
            + ' when offset;<br>offset = '
            + roundToDecimal(offset, config.decimalPointsDiag)
            + uomLengthLit);
    common.optimizedDiagSize().val(roundToDecimal(state.diagSize, config.decimalPointsDiag));
    common.diagOffset().val(roundToDecimal(offset, config.decimalPointsDiag));
    common.foldingSecondaryMirrorSize().val(roundToDecimal(common.optimizedDiagSizeVal(), config.decimalPointsDiag));
    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.optimizedDiagSizeVal() * common.focalRatioVal(), config.decimalPointsDimension));
    calcFoldingSecondaryOffset();
    writeOffaxisMaskResults();
};

MLB.telescopeCriteriaCalc.graphSummaryDiagIllum = function () {
    var common = MLB.telescopeCriteriaCalc.common,
        graphDiagIllumSubr = MLB.telescopeCriteriaCalc.graphDiagIllumSubr;

    graphDiagIllumSubr(common.summaryDiagChartID(), [common.optimizedDiagSizeVal()]);
};

MLB.telescopeCriteriaCalc.setCanvasScalingFactor = function () {
    var state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        baffleScalingFactor = MLB.calcLib.baffleScalingFactor;

    state.scalingFactor = baffleScalingFactor(config.canvasWidth, config.canvasHeight, common.apertureVal() * common.focalRatioVal(), common.apertureVal() * 2, config.canvasBorder);
};

MLB.telescopeCriteriaCalc.drawCanvasOutline = function (context, canvas) {
    var config = MLB.telescopeCriteriaCalc.config;

    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();
    context.rect(config.canvasBorder, config.canvasBorder, canvas.width - 2 * config.canvasBorder, canvas.height - 2 * config.canvasBorder);
    context.stroke();
};

MLB.telescopeCriteriaCalc.graphBaffles = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        baffle = state.baffle,
        calcVignettedIllumPercent = MLB.telescopeCriteriaCalc.calcVignettedIllumPercent,
        drawCanvasOutline = MLB.telescopeCriteriaCalc.drawCanvasOutline,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        drawHorizDimen = MLB.sharedLib.drawHorizDimen,
        uom = MLB.sharedLib.uom,
        calcProjectedFocuserBaffleRadius = MLB.calcLib.calcProjectedFocuserBaffleRadius,
        calcSagitta = MLB.calcLib.calcSagitta,
        projectedFocuserBaffle = state.projectedFocuserBaffle,
        canvas,
        context,
        aperture,
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
        scaledHalfTubeID,
        scaledFocalPlaneToDiagDistance,
        scaledDiagSize,
        scaledHalfDiagSize,
        scaledFocalPlaneToFocuserBarrelBottomDistance,
        scaledProjectedFocuserBaffleRadius,
        scaledPrimaryMirrorThicknessInUom,
        scaledPrimaryMirrorCellThicknessInUom,
        scaledDiagOffset,
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
        focuserBarrelRect,
        projectedFocuserBaffleLeftPt,
        projectedFocuserBaffleRightPt,
        projectedFocuserBaffleLeftTubeODPt,
        projectedFocuserBaffleRightTubeODPt,
        telescopeTubeRect,
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
        tanDiagUpperToLeftFocalPlaneReflectedAngle,
        tanDiagLowerToRightFocalPlaneReflectedAngle,
        diagUpperToTubeUpperInsideXDelta,
        diagLowerToTubeLowerInsideXDelta,
        primaryMirrorBaffleLowerIntersectPt,
        primaryMirrorBaffleUpperRect,
        primaryMirrorBaffleLowerRect,
        primaryMirrorBaffleBehindPrimaryRect,
        barrelTubeBottomToProjectedFocuserBaffleY,
        barrelTubePrimaryMirrorSideToTubeEndX,
        angleFromTubeEndToBarrelTubeBottomPrimaryMirrorSideRad,
        increasedReflectionAngleRad,
        angledLengthX,
        angledLengthRatio,
        angledLengthY,
        forwardAngledPt,
        rearAngledPt,
        projectedFocuserBafflePartBRect,
        a,
        uomLengthLit = common.getUomLengthLit(),
        text,
        dimensionY,
        vignettedLuminance;

    canvas = common.baffleCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    aperture = common.apertureVal();
    focalRatio = state.telescopeFocalLength / aperture;
    eyepieceFieldStop = common.convertMmToUom(common.eyepieceFieldStopmmVal());
    barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
    barrelTubeLength = common.barrelTubeLengthVal();
    telescopeTubeOD = common.telescopeTubeODVal();
    telescopeTubeThickness = common.telescopeTubeThicknessVal();
    focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
    diagSize = common.optimizedDiagSizeVal();
    // offsets are negative by convention
    diagOffset = -common.diagOffsetVal();
    focalPlaneToFocuserBarrelBottomDistance = common.focalPlaneToFocuserBarrelBottomDistanceVal();

    projectedFocuserBaffleRadius = calcProjectedFocuserBaffleRadius(eyepieceFieldStop, barrelTubeInsideDiameter, common.focalPlaneToFocuserBarrelBottomDistanceVal(), focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness);
    sagitta = calcSagitta(aperture, focalRatio);

    primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
    primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

    scaledAperture = state.scalingFactor * aperture;
    scaledMirrorRadius = scaledAperture / 2;
    scaledTelescopeFocalLength = state.scalingFactor * state.telescopeFocalLength;
    scaledEyepieceFieldStop = state.scalingFactor * eyepieceFieldStop;
    scaledBarrelTubeInsideDiameter = state.scalingFactor * barrelTubeInsideDiameter;
    scaledBarrelTubeLength = state.scalingFactor * barrelTubeLength;
    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledTelescopeTubeThickness = state.scalingFactor * telescopeTubeThickness;
    scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
    scaledFocalPlaneToDiagDistance = state.scalingFactor * focalPlaneToDiagDistance;
    scaledDiagSize = state.scalingFactor * diagSize;
    scaledHalfDiagSize = scaledDiagSize / 2;
    scaledFocalPlaneToFocuserBarrelBottomDistance = state.scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
    scaledProjectedFocuserBaffleRadius = state.scalingFactor * projectedFocuserBaffleRadius;
    scaledPrimaryMirrorThicknessInUom = state.scalingFactor * primaryMirrorThicknessInUom;
    scaledPrimaryMirrorCellThicknessInUom = state.scalingFactor * primaryMirrorCellThicknessInUom;
    scaledDiagOffset = state.scalingFactor * diagOffset;
    scaledRadiusCurvature = scaledAperture * focalRatio * 2;
    scaledSagitta = state.scalingFactor * sagitta;

    // calc primary mirror angle from mirror edge to radius of curvature:
    // circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
    // circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
    mirrorRadian = 1 / (2 * focalRatio);

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
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
    focuserBarrelRect = rect(focalPlaneCenterPt.x - scaledBarrelTubeInsideDiameter / 2, focalPlaneCenterPt.y + scaledFocalPlaneToFocuserBarrelBottomDistance - scaledBarrelTubeLength, scaledBarrelTubeInsideDiameter, scaledBarrelTubeLength);

    // calc telescope tube
    telescopeTubeRect = rect(tubeRearEndFrontCenterPt.x, tubeRearEndFrontCenterPt.y - scaledTelescopeTubeOD / 2, focalPlaneCenterPt.x + scaledProjectedFocuserBaffleRadius - tubeRearEndFrontCenterPt.x, scaledTelescopeTubeOD);

    // calc projected focuser baffle on opposite side of tube
    projectedFocuserBaffleLeftPt = point(focalPlaneCenterPt.x - scaledProjectedFocuserBaffleRadius, tubeRearEndFrontCenterPt.y + scaledHalfTubeID);
    projectedFocuserBaffleRightPt = point(focalPlaneCenterPt.x + scaledProjectedFocuserBaffleRadius, tubeRearEndFrontCenterPt.y + scaledHalfTubeID);
    projectedFocuserBaffleLeftTubeODPt = point(projectedFocuserBaffleLeftPt.x, projectedFocuserBaffleLeftPt.y + scaledTelescopeTubeThickness);
    projectedFocuserBaffleRightTubeODPt = point(projectedFocuserBaffleRightPt.x, projectedFocuserBaffleRightPt.y + scaledTelescopeTubeThickness);
    // design baffle located opposite diagonal for focuser tube barrel where the edges are tilted to direct light out of the focuser barrel
    // focuser barrel tube bottom to projected focuser baffle inside
    barrelTubeBottomToProjectedFocuserBaffleY = projectedFocuserBaffleRightPt.y - focuserBarrelRect.endY;
    barrelTubePrimaryMirrorSideToTubeEndX = telescopeTubeRect.endX - focuserBarrelRect.x;
    angleFromTubeEndToBarrelTubeBottomPrimaryMirrorSideRad = Math.atan2(barrelTubePrimaryMirrorSideToTubeEndX, barrelTubeBottomToProjectedFocuserBaffleY);
    increasedReflectionAngleRad = angleFromTubeEndToBarrelTubeBottomPrimaryMirrorSideRad / 2;
    angledLengthX = barrelTubePrimaryMirrorSideToTubeEndX / 2;
    // since bottom of focuser barrel tube closer to opposite side of tube than tube end, must increase the length
    angledLengthRatio = (projectedFocuserBaffleLeftPt.y - focuserBarrelRect.endY) / (scaledHalfTubeID * 2);
    angledLengthX += angledLengthX * (1 - angledLengthRatio);
    angledLengthY = Math.tan(increasedReflectionAngleRad) * angledLengthX;
    forwardAngledPt = point(projectedFocuserBaffleRightPt.x - angledLengthX, projectedFocuserBaffleRightPt.y + angledLengthY);
    rearAngledPt = point(projectedFocuserBaffleLeftPt.x + angledLengthX, projectedFocuserBaffleLeftPt.y + angledLengthY);
    projectedFocuserBafflePartBRect = rect(rearAngledPt.x, rearAngledPt.y, forwardAngledPt.x - rearAngledPt.x, scaledTelescopeTubeThickness);

    /* calc primary mirror baffle ---
        canvas x is the horizontal coordinate, canvas y is the vertical coordinate;
        diagonal upper to left focal plane is -x, -y; diagonal lower to right focal plane is +x, -y;
        atan2(y,x): y is the horizontal coordinate, x is the vertical coordinate
            atan2(1,0) aims to the right; atan2(0,1) aims to the top; atan2(0,-1) aims to the bottom; atan2(-1,-1) aims to the left;
            or, 0deg aims to the right, 90deg aims to the top, -90deg aims to the bottom and 180/180deg aims to the left;
        using the atan2 coordinate system (y to the right, x to the top, 0 deg to the right, grows counter-clockwise:
        atan2 of diagonal upper to left focal plane points is an angle slightly greater than 90 (aimed upward slightly to the left);
        atan2 of diagonal lower to right focal plane points is an angle slightly less than 90 (aimed upward slightly to the right);
        the diagonal axis is 135deg when 'to the right' is 0deg;
        to reflect about the diagonal axis, double the diagonal axis and subtract the angle;
        to convert to canvas coordinates where 0deg is to the right, but grows clockwise, subtract from 360deg;
        note that the two angles are essentially reflections about the horizontal plane but starting from the upper/lower diagonal points;
        to get canvas 'x' values for given 'y' range, tan(180 - reflected ray angle);
        then use starting point + cos for 'x' coordinate and starting point + sin for 'y' coordinate to draw lines using distance and angle;
        for tan() to project the primary baffle rays, subtract from 180 to make 0deg aim to the left;
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
    tanDiagUpperToLeftFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagUpperToLeftFocalPlaneReflectedAngleRad);
    tanDiagLowerToRightFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagLowerToRightFocalPlaneReflectedAngleRad);
    diagUpperToTubeUpperInsideXDelta = diagUpperToTubeUpperInsideYDelta / tanDiagUpperToLeftFocalPlaneReflectedAngle;
    diagLowerToTubeLowerInsideXDelta = diagLowerToTubeLowerInsideYDelta / tanDiagLowerToRightFocalPlaneReflectedAngle;

    // primary mirror baffles: make the lower baffle the same length as the upper baffle for simplicity but do calculate the lower intercept point for drawing the lower light ray (there's no upper intersect because the upper baffle will always be the longest thanks to the baffle ray intersecting with the tube sooner)
    primaryMirrorBaffleLowerIntersectPt = point(diagLowerPt.x + diagLowerToTubeLowerInsideXDelta, diagLowerPt.y + diagLowerToTubeLowerInsideYDelta);
    primaryMirrorBaffleBehindPrimaryRect = rect(telescopeTubeRect.x, telescopeTubeRect.y, scaledTelescopeTubeThickness, telescopeTubeRect.height);
    primaryMirrorBaffleUpperRect = rect(telescopeTubeRect.x + scaledTelescopeTubeThickness, telescopeTubeRect.y, diagUpperPt.x - diagUpperToTubeUpperInsideXDelta - telescopeTubeRect.x - scaledTelescopeTubeThickness, scaledTelescopeTubeThickness);
    primaryMirrorBaffleLowerRect = rect(primaryMirrorBaffleUpperRect.x, telescopeTubeRect.endY - scaledTelescopeTubeThickness, primaryMirrorBaffleUpperRect.width, primaryMirrorBaffleUpperRect.height);

    // save dimensions for use with other optimizers
    state.mirrorFrontEdgeToFocalPlaneDistance = (focalPlaneCenterPt.x - mirrorLowerFacePt.x) / state.scalingFactor;
    state.tubeBackEndToFocalPlaneDistance = (focalPlaneCenterPt.x - telescopeTubeRect.x) / state.scalingFactor;
    projectedFocuserBaffle.tiltAngleDeg = increasedReflectionAngleRad / uom.degToRad;
    projectedFocuserBaffle.tiltedDistance = Math.sqrt(angledLengthX * angledLengthX + angledLengthY * angledLengthY) / state.scalingFactor;
    projectedFocuserBaffle.flatDistance = (projectedFocuserBaffleRightPt.x - projectedFocuserBaffleLeftPt.x - angledLengthX * 2) / state.scalingFactor;

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }
    if (config.drawTestLines) {
        // draw test rays for primary mirror baffle using line and angle; these lines should exactly overlay the lines calculated above using coordinate rotation and tan()
        context.strokeStyle = config.canvasTestStyle;
        context.beginPath();
        context.moveTo(diagUpperPt.x, diagUpperPt.y);
        context.lineTo(diagUpperPt.x + config.canvasTestLineLength * Math.cos(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad), diagUpperPt.y + config.canvasTestLineLength * Math.sin(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad));
        context.stroke();
        context.beginPath();
        context.moveTo(diagLowerPt.x, diagLowerPt.y);
        context.lineTo(diagLowerPt.x + config.canvasTestLineLength * Math.cos(diagLowerToRightFocalPlaneReflectedCanvasAngleRad), diagLowerPt.y + config.canvasTestLineLength * Math.sin(diagLowerToRightFocalPlaneReflectedCanvasAngleRad));
        context.stroke();
        // draw test diagonal optical axis lines from upper, lower diag points
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
    // draw in order: light rays, optics, structure, baffles
    // draw primary mirror to primary focus light rays
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorUpperFacePt, primaryFocusPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorLowerFacePt, primaryFocusPt);
    // draw optical paths
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorCenterPt, diagCenterPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagCenterPt, focalPlaneCenterPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagCenterPt, primaryFocusPt);
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
    // draw telescope tube
    drawRect(context, config.canvasStructureLightStyle, config.canvasLineWidth, telescopeTubeRect);
    // draw focuser barrel tube
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarrelRect);
    // draw focal plane edges to cross diagonal edges
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, focalPlaneLeftPt, diagUpperPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, focalPlaneRightPt, diagLowerPt);
    // draw primary mirror baffle diagonal to inner tube lines
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, point(primaryMirrorBaffleUpperRect.endX, primaryMirrorBaffleUpperRect.endY), diagUpperPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerIntersectPt, diagLowerPt);
    // draw focal plane to projected focuser baffle light rays
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, focalPlaneLeftPt, projectedFocuserBaffleRightPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, focalPlaneRightPt, projectedFocuserBaffleLeftPt);
    // draw primary mirror baffles
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryRect);
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRect);
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRect);
    // draw projected focuser baffle on opposite side of tube
    //drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftPt, projectedFocuserBaffleRightPt);
    //drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, projectedFocuserBaffleRightTubeODPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, projectedFocuserBaffleLeftPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleRightTubeODPt, projectedFocuserBaffleRightPt);
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBafflePartBRect);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, forwardAngledPt, projectedFocuserBaffleRightPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, rearAngledPt, projectedFocuserBaffleLeftPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleLeftTubeODPt, point(projectedFocuserBafflePartBRect.x, projectedFocuserBafflePartBRect.endY));
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleRightTubeODPt, point(projectedFocuserBafflePartBRect.endX, projectedFocuserBafflePartBRect.endY));
    // draw directed light rays
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, forwardAngledPt, point(telescopeTubeRect.endX, telescopeTubeRect.y));
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, forwardAngledPt, point(focuserBarrelRect.x, focuserBarrelRect.endY));
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleRightPt, point(focuserBarrelRect.x, focuserBarrelRect.endY));
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, projectedFocuserBaffleRightPt, point(telescopeTubeRect.endX, telescopeTubeRect.y));

    // write dimension for projected focuser baffle
    baffle.oppositeFocuserDia = projectedFocuserBaffleRadius * 2;
    text = config.projectedFocuserBaffleDimensionText + roundToDecimal(baffle.oppositeFocuserDia, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = projectedFocuserBafflePartBRect.endY + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, projectedFocuserBaffleLeftPt.x, projectedFocuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write dimension for primary mirror baffle
    baffle.primaryMirrorExtension = (primaryMirrorBaffleLowerRect.endX - mirrorLowerFacePt.x) / state.scalingFactor;
    text = config.primaryMirrorBaffleDimensionText + roundToDecimal(baffle.primaryMirrorExtension, config.decimalPointsDimension) + uomLengthLit;
    // keep same dimensionY
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, primaryMirrorBaffleLowerRect.endX, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write mirror front edge to focal plane center line dimension
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    text = config.primaryMirrorToFocalPlaneDimensionText + roundToDecimal(state.mirrorFrontEdgeToFocalPlaneDistance, config.decimalPointsDimension) + uomLengthLit;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, focalPlaneCenterPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write mirror front edge to tube front dimension
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    text = config.primaryMirrorToTubeEndDimensionText + roundToDecimal((projectedFocuserBaffleRightPt.x - mirrorLowerFacePt.x) / state.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, projectedFocuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // write out notes
    vignettedLuminance = state.luminance * calcVignettedIllumPercent();
    state.vignettedLuminance = vignettedLuminance;

    common.baffleResults().html('projected focuser baffle tilt angle = '
            + roundToDecimal(projectedFocuserBaffle.tiltAngleDeg, config.decimalPointsDimension)
            + ' deg<br>projected focuser baffle tilted length = '
            + roundToDecimal(projectedFocuserBaffle.tiltedDistance, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>projected focuser baffle flat length = '
            + roundToDecimal(projectedFocuserBaffle.flatDistance, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>mirror sagitta = '
            + roundToDecimal(sagitta, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>vignetted luminance = '
            + roundToDecimal(vignettedLuminance, config.decimalPointsLuminance)
            + config.luminanceParensLit);
};

MLB.telescopeCriteriaCalc.graphLowRider = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        drawCanvasOutline = MLB.telescopeCriteriaCalc.drawCanvasOutline,
        canvas,
        context,
        aperture,
        focalRatio,
        eyepieceFieldStop,
        barrelTubeInsideDiameter,
        barrelTubeLength,
        telescopeTubeOD,
        telescopeTubeThickness,
        focalPlaneToFocuserBarrelBottomDistance,
        foldingSecondaryMirrorSize,
        foldingSecondaryOffset,
        focalPlaneToSecondaryDistance,
        focalPointOffsetFromEdgeOfPrimary,
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
        scaledFocalPlaneToFocuserBarrelBottomDistance,
        scaledSagitta,
        scaledHalfDiagMajorAxisSize,
        scaledFoldingSecondaryOffset,
        mirrorRadian,
        mirrorCenterPt,
        tubeRearEndFrontCenterPt,
        primaryFocusPt,
        mirrorUpperFacePt,
        mirrorLowerFacePt,
        mirrorUpperBackPt,
        mirrorLowerBackPt,
        tubeIDLowerY,
        tubeIDUpperY,
        diagAngleDeg,
        diagPt,
        focalPt,
        focalPlaneAngleRad,
        xDelta,
        yDelta,
        xDeltaOffset,
        yDeltaOffset,
        focalPlaneRightPt,
        focalPlaneLeftPt,
        focuserBarrelBottomMidPt,
        focuserBarrelTopMidPt,
        focuserBarrelTubeLowerLeftPt,
        focuserBarrelTubeLowerRightPt,
        focuserBarrelTubeUpperLeftPt,
        focuserBarrelTubeUpperRightPt,
        diagAngleRad,
        diagUpperPt,
        diagLowerPt,
        text,
        dimensionY,
        diagonalString,
        slope,
        yDeltaToTraverse,
        xTravel,
        focuserBaffleRightPt,
        focuserBaffleRightTubeODPt,
        focuserBaffleLeftPt,
        focuserBaffleLeftTubeODPt,
        diagUpperToLeftFocalPlaneAngleRad,
        diagUpperToLeftFocalPlaneReflectedAngleRad,
        diagUpperToLeftFocalPlaneReflectedCanvasAngleRad,
        diagUpperToTubeUpperInsideYDelta,
        tanDiagUpperToLeftFocalPlaneReflectedAngle,
        diagUpperToTubeUpperInsideXDelta,
        primaryMirrorBaffleLowerIntersectPt,
        diagLowerToRightFocalPlaneAngleRad,
        diagLowerToRightFocalPlaneReflectedAngleRad,
        diagLowerToRightFocalPlaneReflectedCanvasAngleRad,
        diagLowerToTubeUpperInsideYDelta,
        tanDiagLowerToRightFocalPlaneReflectedAngle,
        diagLowerToTubeLowerInsideXDelta,
        primaryMirrorBaffleUpperIntersectPt,
        primaryMirrorBaffleX,
        telescopeTubeRect,
        primaryMirrorBaffleUpperRect,
        primaryMirrorBaffleLowerRect,
        primaryMirrorBaffleUpperFrontPt,
        primaryMirrorBaffleLowerFrontPt,
        primaryMirrorBaffleBehindPrimaryRect,
        a,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        drawHorizDimen = MLB.sharedLib.drawHorizDimen,
        uom = MLB.sharedLib.uom,
        calcSagitta = MLB.calcLib.calcSagitta,
        calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian,
        uomLengthLit = common.getUomLengthLit();

    canvas = common.foldingReflectorCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    aperture = common.apertureVal();
    focalRatio = state.telescopeFocalLength / aperture;
    eyepieceFieldStop = common.convertMmToUom(common.eyepieceFieldStopmmVal());
    barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
    barrelTubeLength = common.barrelTubeLengthVal();
    telescopeTubeOD = common.telescopeTubeODVal();
    telescopeTubeThickness = common.telescopeTubeThicknessVal();
    focalPlaneToFocuserBarrelBottomDistance = common.focalPlaneToFocuserBarrelBottomDistanceVal();
    foldingSecondaryMirrorSize = common.foldingSecondaryMirrorSizeVal();
    // offsets are negative by convention
    foldingSecondaryOffset = -common.foldingSecondaryOffsetVal();
    focalPlaneToSecondaryDistance = common.focalPlaneToSecondaryDistanceVal();
    focalPointOffsetFromEdgeOfPrimary = common.focalPointOffsetFromEdgeOfPrimaryVal();

    primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
    primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

    sagitta = calcSagitta(aperture, focalRatio);

    // focalPlaneToTertiaryDistance = 0
    state.lowRiderModel = calcFoldedNewtonian(aperture, focalRatio, foldingSecondaryMirrorSize, 0, focalPointOffsetFromEdgeOfPrimary, focalPlaneToSecondaryDistance);

    if (foldingSecondaryMirrorSize + config.diagTooSmallAllowance < focalPlaneToSecondaryDistance / focalRatio) {
        context.fillStyle = config.canvasErrorStyle;
        context.fillText(config.diagTooSmallErrMsg, 0, canvas.height / 2);
        common.foldingReflectorResults().html(config.noResults);
        return;
    }
    if (isNaN(state.lowRiderModel.elbowAngleDeg)) {
        context.fillStyle = config.canvasErrorStyle;
        context.fillText(config.focalPointToDiagTooLongErrMsg, 0, canvas.height / 2);
        common.foldingReflectorResults().html(config.noResults);
        return;
    }

    scaledMainAxisLength = state.scalingFactor * state.lowRiderModel.diagToPrimaryMirrorDistance;
    scaledAperture = state.scalingFactor * aperture;
    scaledRadiusCurvature = scaledAperture * focalRatio * 2;
    scaledMirrorRadius = scaledAperture / 2;
    scaledTelescopeFocalLength = state.scalingFactor * state.telescopeFocalLength;
    scaledEyepieceFieldStop = state.scalingFactor * eyepieceFieldStop;
    scaledBarrelTubeInsideDiameter = state.scalingFactor * barrelTubeInsideDiameter;
    scaledBarrelTubeLength = state.scalingFactor * barrelTubeLength;
    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledTelescopeTubeThickness = state.scalingFactor * telescopeTubeThickness;
    scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
    scaledFocalPlaneToFocuserBarrelBottomDistance = state.scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
    scaledPrimaryMirrorThicknessInUom = state.scalingFactor * primaryMirrorThicknessInUom;
    scaledPrimaryMirrorCellThicknessInUom = state.scalingFactor * primaryMirrorCellThicknessInUom;
    scaledSagitta = state.scalingFactor * sagitta;
    scaledHalfDiagMajorAxisSize = state.scalingFactor * state.lowRiderModel.diagMajorAxisSize / 2;
    scaledFoldingSecondaryOffset = state.scalingFactor * foldingSecondaryOffset;

    // calc primary mirror angle from mirror edge to radius of curvature:
    // circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
    // circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
    mirrorRadian = 1 / (2 * focalRatio);

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
    // calc key points
    mirrorCenterPt = point(config.canvasBorder + scaledPrimaryMirrorThicknessInUom + scaledPrimaryMirrorCellThicknessInUom + scaledTelescopeTubeThickness, canvas.height / 2);
    tubeRearEndFrontCenterPt = point(config.canvasBorder + scaledTelescopeTubeThickness, mirrorCenterPt.y);
    primaryFocusPt = point(mirrorCenterPt.x + scaledTelescopeFocalLength, mirrorCenterPt.y);

    // calc mirror edges, back
    mirrorUpperFacePt = point(mirrorCenterPt.x + scaledSagitta, mirrorCenterPt.y - scaledMirrorRadius);
    mirrorLowerFacePt = point(mirrorCenterPt.x + scaledSagitta, mirrorCenterPt.y + scaledMirrorRadius);
    mirrorUpperBackPt = point(mirrorCenterPt.x - scaledPrimaryMirrorThicknessInUom, mirrorUpperFacePt.y);
    mirrorLowerBackPt = point(mirrorCenterPt.x - scaledPrimaryMirrorThicknessInUom, mirrorLowerFacePt.y);

    // calc tube Ys
    tubeIDLowerY = mirrorCenterPt.y + scaledHalfTubeID;
    tubeIDUpperY = mirrorCenterPt.y - scaledHalfTubeID;

    // calc diagonal/folding mirror
    diagAngleDeg = state.lowRiderModel.elbowAngleDeg / 2;
    diagPt = point(mirrorCenterPt.x + scaledMainAxisLength, mirrorCenterPt.y);
    diagAngleRad = diagAngleDeg * uom.degToRad;
    xDelta = Math.sin(diagAngleRad) * scaledHalfDiagMajorAxisSize;
    yDelta = Math.cos(diagAngleRad) * scaledHalfDiagMajorAxisSize;
    xDeltaOffset = Math.sin(diagAngleRad) * scaledFoldingSecondaryOffset;
    yDeltaOffset = Math.cos(diagAngleRad) * scaledFoldingSecondaryOffset;
    diagUpperPt = point(diagPt.x + xDelta - xDeltaOffset, diagPt.y - yDelta + yDeltaOffset);
    diagLowerPt = point(diagPt.x - xDelta - xDeltaOffset, diagPt.y + yDelta + yDeltaOffset);

    // calc focal point and focal plane points
    focalPt = point(mirrorCenterPt.x + state.scalingFactor * state.lowRiderModel.focalPointToPrimaryMirrorDistance, mirrorCenterPt.y - state.scalingFactor * (aperture / 2 + focalPointOffsetFromEdgeOfPrimary));
    focalPlaneAngleRad = state.lowRiderModel.elbowAngleDeg * uom.degToRad;
    xDelta = Math.sin(focalPlaneAngleRad) * scaledEyepieceFieldStop / 2;
    yDelta = Math.cos(focalPlaneAngleRad) * scaledEyepieceFieldStop / 2;
    focalPlaneRightPt = point(focalPt.x + xDelta, focalPt.y - yDelta);
    focalPlaneLeftPt = point(focalPt.x - xDelta, focalPt.y + yDelta);

    // calc focuser barrel tube
    // top, bottom of barrel are at focalPlaneAngleRad, axis and sides of barrel are at 90 degrees to focalPlaneAngleRad
    xDelta = Math.sin(focalPlaneAngleRad + uom.qtrRev) * scaledFocalPlaneToFocuserBarrelBottomDistance;
    yDelta = Math.cos(focalPlaneAngleRad + uom.qtrRev) * scaledFocalPlaneToFocuserBarrelBottomDistance;
    focuserBarrelBottomMidPt = point(focalPt.x + xDelta, focalPt.y - yDelta);
    xDelta = Math.sin(focalPlaneAngleRad - uom.qtrRev) * scaledBarrelTubeLength;
    yDelta = Math.cos(focalPlaneAngleRad - uom.qtrRev) * scaledBarrelTubeLength;
    focuserBarrelTopMidPt = point(focuserBarrelBottomMidPt.x + xDelta, focuserBarrelBottomMidPt.y - yDelta);
    xDelta = Math.sin(focalPlaneAngleRad) * scaledBarrelTubeInsideDiameter / 2;
    yDelta = Math.cos(focalPlaneAngleRad) * scaledBarrelTubeInsideDiameter / 2;
    focuserBarrelTubeLowerRightPt = point(focuserBarrelBottomMidPt.x + xDelta, focuserBarrelBottomMidPt.y - yDelta);
    focuserBarrelTubeLowerLeftPt = point(focuserBarrelBottomMidPt.x - xDelta, focuserBarrelBottomMidPt.y + yDelta);
    focuserBarrelTubeUpperRightPt = point(focuserBarrelTopMidPt.x + xDelta, focuserBarrelTopMidPt.y - yDelta);
    focuserBarrelTubeUpperLeftPt = point(focuserBarrelTopMidPt.x - xDelta, focuserBarrelTopMidPt.y + yDelta);

    // calc focuser barrel tube projected baffle using x, y slope
    if (focuserBarrelTubeLowerRightPt.y <= focalPlaneLeftPt.y) {
        context.fillStyle = config.canvasErrorStyle;
        context.fillText(config.cannotBaffleErrMsg, 0, canvas.height / 2);
        common.foldingReflectorResults().html(config.noResults);
        return;
    }

    // right most projection
    xDelta = focuserBarrelTubeLowerRightPt.x - focalPlaneLeftPt.x;
    yDelta = focuserBarrelTubeLowerRightPt.y - focalPlaneLeftPt.y;
    slope = yDelta / xDelta;
    yDeltaToTraverse = tubeIDLowerY - focalPlaneLeftPt.y;
    xTravel = yDeltaToTraverse / slope;
    focuserBaffleRightPt = point(focalPlaneLeftPt.x + xTravel, tubeIDLowerY);
    focuserBaffleRightTubeODPt = point(focuserBaffleRightPt.x, focuserBaffleRightPt.y + scaledTelescopeTubeThickness);
    // left most projection
    xDelta = focuserBarrelTubeLowerLeftPt.x - focalPlaneRightPt.x;
    yDelta = focuserBarrelTubeLowerLeftPt.y - focalPlaneRightPt.y;
    slope = yDelta / xDelta;
    yDeltaToTraverse = tubeIDLowerY - focalPlaneRightPt.y;
    xTravel = yDeltaToTraverse / slope;
    focuserBaffleLeftPt = point(focalPlaneRightPt.x + xTravel, tubeIDLowerY);
    focuserBaffleLeftTubeODPt = point(focuserBaffleLeftPt.x, focuserBaffleLeftPt.y + scaledTelescopeTubeThickness);

    // save calculated frontEndOfTubeToPrimaryMirrorDistance value to model
    state.lowRiderModel.frontEndOfTubeToPrimaryMirrorDistance = (focuserBaffleRightPt.x - mirrorLowerFacePt.x) / state.scalingFactor;

    /* calc folding mirror baffles that are placed around primary mirror ---
        canvas x is the horizontal coordinate, canvas y is the vertical coordinate;
        diagonal upper to left focal plane is -x, -y; diagonal lower to right focal plane is +x, -y;
        atan2(y,x): y is the horizontal coordinate, x is the vertical coordinate
            atan2(1,0) aims to the right; atan2(0,1) aims to the top; atan2(0,-1) aims to the bottom; atan2(-1,-1) aims to the left;
            or, 0deg aims to the right, 90deg aims to the top, -90deg aims to the bottom and 180/180deg aims to the left;
        using the atan2 coordinate system (y to the right, x to the top, 0 deg to the right, grows counter-clockwise:
        atan2 of diagonal to focal plane points is an angle greater than 90 (aimed upward to the left);
        the diagonal axis is between 135deg and 180deg when 'to the right' is 0deg;
        to reflect about the diagonal axis, double the diagonal axis and subtract the angle;
        to convert to canvas coordinates where 0deg is to the right, but grows clockwise, subtract from 360deg;
        note that the two angles are essentially reflections about the horizontal plane but starting from the upper/lower diagonal points;
        to get canvas 'x' values for given 'y' range, tan(180 - reflected ray angle);
        then use starting point + cos for 'x' coordinate and starting point + sin for 'y' coordinate to draw lines using distance and angle;
        for tan() to project the primary baffle rays, subtract from 180 to make 0deg aim to the left;
    */
    // top baffle
    xDelta = diagUpperPt.x - focalPlaneLeftPt.x;
    yDelta = diagUpperPt.y - focalPlaneLeftPt.y;
    diagUpperToLeftFocalPlaneAngleRad = Math.atan2(yDelta, -xDelta);
    diagUpperToLeftFocalPlaneReflectedAngleRad = uom.oneRev - state.lowRiderModel.elbowAngleDeg * uom.degToRad - diagUpperToLeftFocalPlaneAngleRad;
    diagUpperToLeftFocalPlaneReflectedCanvasAngleRad = uom.oneRev - diagUpperToLeftFocalPlaneReflectedAngleRad;
    diagUpperToTubeUpperInsideYDelta = diagUpperPt.y - tubeIDUpperY;
    tanDiagUpperToLeftFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagUpperToLeftFocalPlaneReflectedAngleRad);
    diagUpperToTubeUpperInsideXDelta = diagUpperToTubeUpperInsideYDelta / tanDiagUpperToLeftFocalPlaneReflectedAngle;
    primaryMirrorBaffleLowerIntersectPt = point(diagUpperPt.x - diagUpperToTubeUpperInsideXDelta, diagUpperPt.y - diagUpperToTubeUpperInsideYDelta);
    // bottom baffle
    xDelta = diagLowerPt.x - focalPlaneRightPt.x;
    yDelta = diagLowerPt.y - focalPlaneRightPt.y;
    diagLowerToRightFocalPlaneAngleRad = Math.atan2(yDelta, -xDelta);
    diagLowerToRightFocalPlaneReflectedAngleRad = uom.oneRev - state.lowRiderModel.elbowAngleDeg * uom.degToRad - diagLowerToRightFocalPlaneAngleRad;
    diagLowerToRightFocalPlaneReflectedCanvasAngleRad = uom.oneRev - diagLowerToRightFocalPlaneReflectedAngleRad;
    diagLowerToTubeUpperInsideYDelta = diagLowerPt.y - tubeIDLowerY;
    tanDiagLowerToRightFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagLowerToRightFocalPlaneReflectedAngleRad);
    diagLowerToTubeLowerInsideXDelta = diagLowerToTubeUpperInsideYDelta / tanDiagLowerToRightFocalPlaneReflectedAngle;
    primaryMirrorBaffleUpperIntersectPt = point(diagLowerPt.x - diagLowerToTubeLowerInsideXDelta, diagLowerPt.y - diagLowerToTubeUpperInsideYDelta);
    // longest baffle 'x'
    primaryMirrorBaffleX = primaryMirrorBaffleLowerIntersectPt.x > primaryMirrorBaffleUpperIntersectPt.x
        ? primaryMirrorBaffleLowerIntersectPt.x
        : primaryMirrorBaffleUpperIntersectPt.x;

    // calc telescope tube
    telescopeTubeRect = rect(tubeRearEndFrontCenterPt.x, tubeRearEndFrontCenterPt.y - scaledTelescopeTubeOD / 2, focuserBaffleRightPt.x - tubeRearEndFrontCenterPt.x, scaledTelescopeTubeOD);

    // set the primary mirror baffle points
    primaryMirrorBaffleUpperRect = rect(telescopeTubeRect.x + scaledTelescopeTubeThickness, telescopeTubeRect.y, primaryMirrorBaffleX - telescopeTubeRect.x - scaledTelescopeTubeThickness, scaledTelescopeTubeThickness);
    primaryMirrorBaffleLowerRect = rect(primaryMirrorBaffleUpperRect.x, telescopeTubeRect.endY - scaledTelescopeTubeThickness, primaryMirrorBaffleUpperRect.width, primaryMirrorBaffleUpperRect.height);
    primaryMirrorBaffleBehindPrimaryRect = rect(telescopeTubeRect.x, telescopeTubeRect.y, scaledTelescopeTubeThickness, telescopeTubeRect.height);

    primaryMirrorBaffleUpperFrontPt = point(primaryMirrorBaffleX, tubeRearEndFrontCenterPt.y - scaledHalfTubeID);
    primaryMirrorBaffleLowerFrontPt = point(primaryMirrorBaffleUpperFrontPt.x, tubeRearEndFrontCenterPt.y + scaledHalfTubeID);

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }
    if (config.drawTestLines) {
        // draw test diagonal optical axis lines from upper, lower diag points
        context.strokeStyle = config.canvasTestStyle;
        context.beginPath();
        context.moveTo(diagUpperPt.x, diagUpperPt.y);
        context.lineTo(diagUpperPt.x + config.canvasTestLineLength * Math.cos(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad), diagUpperPt.y + config.canvasTestLineLength * Math.sin(diagUpperToLeftFocalPlaneReflectedCanvasAngleRad));
        context.stroke();
        context.beginPath();
        context.moveTo(diagLowerPt.x, diagLowerPt.y);
        context.lineTo(diagLowerPt.x + config.canvasTestLineLength * Math.cos(diagLowerToRightFocalPlaneReflectedCanvasAngleRad), diagLowerPt.y + config.canvasTestLineLength * Math.sin(diagLowerToRightFocalPlaneReflectedCanvasAngleRad));
        context.stroke();
        a = (180 + diagAngleDeg) * uom.degToRad;
        context.beginPath();
        context.moveTo(diagUpperPt.x, diagUpperPt.y);
        context.lineTo(diagUpperPt.x + config.canvasTestLineLength * Math.cos(a), diagUpperPt.y + config.canvasTestLineLength * Math.sin(a));
        context.stroke();
        context.beginPath();
        context.moveTo(diagLowerPt.x, diagLowerPt.y);
        context.lineTo(diagLowerPt.x + config.canvasTestLineLength * Math.cos(a), diagLowerPt.y + config.canvasTestLineLength * Math.sin(a));
        context.stroke();
    }
    // draw in order: light rays, optics, structure, baffles
    // draw primary mirror to prime focus
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorCenterPt, primaryFocusPt);
    // draw primary mirror to primary focus light rays
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorUpperFacePt, primaryFocusPt);
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, mirrorLowerFacePt, primaryFocusPt);
    // draw diag to focal point
    drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, diagPt, focalPt);
    // draw primary mirror curved face
    context.beginPath();
    context.arc(mirrorCenterPt.x + scaledRadiusCurvature, mirrorCenterPt.y, scaledRadiusCurvature, uom.halfRev - mirrorRadian / 2, uom.halfRev + mirrorRadian / 2);
    context.strokeStyle = config.canvasGlassStyle;
    context.stroke();
    // draw mirror edges, back
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperFacePt, mirrorUpperBackPt);
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorLowerFacePt, mirrorLowerBackPt);
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, mirrorUpperBackPt, mirrorLowerBackPt);
    // draw diagonal
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, diagUpperPt, diagLowerPt);
    // draw focuser barrel tube
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarrelTubeLowerLeftPt, focuserBarrelTubeLowerRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarrelTubeLowerRightPt, focuserBarrelTubeUpperRightPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarrelTubeUpperRightPt, focuserBarrelTubeUpperLeftPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, focuserBarrelTubeUpperLeftPt, focuserBarrelTubeLowerLeftPt);
    // draw primary mirror baffles
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleUpperRect);
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleLowerRect);
    drawRect(context, config.canvasBaffleStyle, config.canvasLineWidth, primaryMirrorBaffleBehindPrimaryRect);
    // draw telescope tube
    drawRect(context, config.canvasStructureLightStyle, config.canvasLineWidth, telescopeTubeRect);
    // draw focuser barrel tube projected baffle
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focuserBaffleLeftPt, focuserBaffleRightPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focuserBaffleLeftTubeODPt, focuserBaffleRightTubeODPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focuserBaffleRightPt, focuserBaffleRightTubeODPt);
    drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, focuserBaffleLeftPt, focuserBaffleLeftTubeODPt);
    // draw directed light rays for focuser projected baffle
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, focalPlaneLeftPt, focuserBaffleRightPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, focalPlaneRightPt, focuserBaffleLeftPt);
    // draw directed light rays for baffles around primary mirror
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagUpperPt, focalPlaneLeftPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagUpperPt, primaryMirrorBaffleLowerIntersectPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagLowerPt, focalPlaneRightPt);
    drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagLowerPt, primaryMirrorBaffleUpperIntersectPt);
    // draw focal plane
    drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, focalPlaneLeftPt, focalPlaneRightPt);

    // write dimension for projected focuser baffle
    text = config.projectedFocuserBaffleDimensionText + roundToDecimal((focuserBaffleRightPt.x - focuserBaffleLeftPt.x) / state.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = focuserBaffleRightPt.y + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, focuserBaffleLeftPt.x, focuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write dimension for primary mirror baffle
    text = config.primaryMirrorBaffleDimensionText + roundToDecimal((primaryMirrorBaffleLowerFrontPt.x - mirrorLowerFacePt.x) / state.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
    // keep same dimensionY
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, primaryMirrorBaffleLowerFrontPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // draw focal point to mirror dimension line
    text = config.primaryMirrorToFocalPlaneDimensionText + roundToDecimal(state.lowRiderModel.focalPointToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, focalPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // draw diagonal to mirror dimension line
    text = config.primaryMirrorToFoldingMirrorText + roundToDecimal(state.lowRiderModel.diagToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, diagPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write mirror front edge to tube front dimension
    text = config.primaryMirrorToTubeEndDimensionText + roundToDecimal(state.lowRiderModel.frontEndOfTubeToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, focuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // write diagonal dimensions
    diagonalString = 'bending angle = '
            + roundToDecimal(state.lowRiderModel.elbowAngleDeg, config.decimalPointsDimension)
            + ' deg<br>folding mirror: '
            + roundToDecimal(foldingSecondaryMirrorSize, config.decimalPointsDimension)
            + 'x'
            + roundToDecimal(state.lowRiderModel.diagMajorAxisSize, config.decimalPointsDimension)
            + uomLengthLit
            + '; angle = '
            // diagonal angle is half that of the elbow optical angle
            + roundToDecimal(diagAngleDeg, config.decimalPointsDimension)
            + config.degLit;
    common.foldingReflectorResults().html(diagonalString
            + '<br>mirror sagitta = '
            + roundToDecimal(sagitta, config.decimalPointsDimension) + uomLengthLit);
};

MLB.telescopeCriteriaCalc.graphRocker = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        CG = state.CG,
        rocker = state.rocker,
        drawCanvasOutline = MLB.telescopeCriteriaCalc.drawCanvasOutline,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        drawCircle = MLB.sharedLib.drawCircle,
        drawHorizDimen = MLB.sharedLib.drawHorizDimen,
        drawVertDimen = MLB.sharedLib.drawVertDimen,
        uom = MLB.sharedLib.uom,
        canvas,
        context,
        altBearingSeparationHalfAngleRad,
        altBearingRadius,
        altBearingSeparation,
        azBearingDiameter,
        telescopeTubeOD,
        woodThickness,
        rockerSideLength,
        rockerSideHeightFromTube,
        rockerSideHeightFromAltBearings,
        rockerSideHeight,
        scaledTelescopeTubeOD,
        scaledWoodThickness,
        scaledCGHeightToClearRockerBottomDistance,
        scaledRockerSideLength,
        scaledRockerSideHeight,
        scaledCGToBearingPointY,
        CGPt,
        scaledRockerSideTopY,
        rockerBottomBoardRect,
        rockerSideBoardRect,
        rockerFrontBoardRect,
        bearingArcLeftPt,
        bearingArcRightPt,
        bearingArcLeftIntersectWithRockerSideTopPt,
        bearingArcRightIntersectWithRockerSideTopPt,
        uomLengthLit = common.getUomLengthLit(),
        text,
        dimensionY,
        padHeight,
        dimensionX,
        rockerWidth,
        frontViewCenterPt,
        frontRockerBoardOutsideWidth,
        scaledFrontRockerBoardOutsideWidth,
        frontRockerFrontBoardRect,
        frontRockerLeftBearingBoardRect,
        frontRockerRightBearingBoardRect,
        materialArea,
        materialAreaUomDivisor,
        materialAreaLit;

    canvas = common.rockerCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }

    altBearingSeparationHalfAngleRad = common.altBearingSeparationDegVal() * uom.degToRad / 2;
    altBearingRadius = common.altBearingRadiusVal();
    altBearingSeparation = altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad) * 2;
    azBearingDiameter = common.azBearingRadiusVal() * 2;
    telescopeTubeOD = common.telescopeTubeODVal();
    woodThickness = common.convertInchesToUom(config.woodThicknessInches);

    rockerSideLength = altBearingSeparation;
    if (rockerSideLength < telescopeTubeOD) {
        rockerSideLength = telescopeTubeOD;
    }
    if (rockerSideLength < azBearingDiameter) {
        rockerSideLength = azBearingDiameter;
    }

    rockerSideHeightFromTube = CG.heightToClearRockerBottomDistance - common.telescopeTubeODVal() / 2;
    rockerSideHeightFromAltBearings = CG.heightToClearRockerBottomDistance - altBearingRadius;
    rockerSideHeight = rockerSideHeightFromTube < rockerSideHeightFromAltBearings
        ? rockerSideHeightFromTube
        : rockerSideHeightFromAltBearings;

    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledWoodThickness = state.scalingFactor * woodThickness;
    scaledCGHeightToClearRockerBottomDistance = state.scalingFactor * CG.heightToClearRockerBottomDistance;
    scaledRockerSideLength = state.scalingFactor * rockerSideLength;
    scaledRockerSideHeight = state.scalingFactor * rockerSideHeight;
    scaledCGToBearingPointY = state.scalingFactor * altBearingRadius * Math.cos(altBearingSeparationHalfAngleRad);

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate

    // draw rocker side...

    // calc key points
    CGPt = point(canvas.width / 6, 4 * config.canvasDimensionHalfHeight);
    frontViewCenterPt = point(canvas.width * 2 / 3, CGPt.y);
    scaledRockerSideTopY = CGPt.y + scaledCGHeightToClearRockerBottomDistance - scaledRockerSideHeight;
    // rocker boards
    rockerBottomBoardRect = rect(CGPt.x - scaledRockerSideLength / 2, CGPt.y + scaledCGHeightToClearRockerBottomDistance, scaledRockerSideLength, scaledWoodThickness);
    rockerSideBoardRect = rect(CGPt.x - scaledRockerSideLength / 2, scaledRockerSideTopY, scaledRockerSideLength, scaledRockerSideHeight);
    rockerFrontBoardRect = rect(CGPt.x + scaledRockerSideLength / 2, scaledRockerSideTopY, scaledWoodThickness, scaledRockerSideHeight + scaledWoodThickness);
    // bearing arc
    bearingArcLeftPt = point(CGPt.x - state.scalingFactor * altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad), CGPt.y + scaledCGToBearingPointY);
    bearingArcRightPt = point(CGPt.x + state.scalingFactor * altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad), bearingArcLeftPt.y);
    bearingArcLeftIntersectWithRockerSideTopPt = point(bearingArcLeftPt.x, rockerSideBoardRect.y);
    bearingArcRightIntersectWithRockerSideTopPt = point(bearingArcRightPt.x, rockerSideBoardRect.y);
    // draw in order: light rays, optics, structure, baffles
    // draw CG to pads
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, CGPt, bearingArcRightPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, CGPt, bearingArcLeftPt);
    // draw boards
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, rockerBottomBoardRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, rockerSideBoardRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, rockerFrontBoardRect);
    // draw bearing arc
    context.beginPath();
    context.arc(CGPt.x, CGPt.y, state.scalingFactor * altBearingRadius, uom.qtrRev - altBearingSeparationHalfAngleRad, uom.qtrRev + altBearingSeparationHalfAngleRad);
    context.lineWidth = config.canvasLineWidth;
    context.strokeStyle = config.canvasStructureStyle;
    context.stroke();
    // draw arc down to top of rocker side
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, bearingArcLeftPt, bearingArcLeftIntersectWithRockerSideTopPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, bearingArcRightPt, bearingArcRightIntersectWithRockerSideTopPt);
    // write CG
    context.fillStyle = config.canvasStructureLightStyle;
    context.fillText(config.centerOfGravityText, CGPt.x, CGPt.y);
    // write horizontal dimension for altitude bearings support board
    text = config.altitudeBearingSeparation + roundToDecimal(altBearingSeparation, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = rockerBottomBoardRect.endY + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, bearingArcLeftPt.x, bearingArcRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write horizontal dimension for rocker side length
    text = config.rockerSideLengthText + roundToDecimal(rockerSideLength, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, rockerSideBoardRect.x, rockerSideBoardRect.endX, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write vertical dimension for rocker side height
    text = config.rockerSideHeightText + roundToDecimal(rockerSideHeight, config.decimalPointsDimension) + uomLengthLit;
    dimensionX = rockerFrontBoardRect.x + 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, rockerSideBoardRect.endY, rockerFrontBoardRect.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write vertical dimension for pad board height
    padHeight = rockerSideBoardRect.y - bearingArcRightPt.y;
    text = config.padHeightText + roundToDecimal(padHeight / state.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
    drawVertDimen(context, text, dimensionX, rockerSideBoardRect.y, bearingArcRightPt.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // draw front of rocker...

    frontRockerBoardOutsideWidth = telescopeTubeOD + 4 * woodThickness;
    if (frontRockerBoardOutsideWidth < azBearingDiameter) {
        frontRockerBoardOutsideWidth = azBearingDiameter;
    }

    scaledFrontRockerBoardOutsideWidth = state.scalingFactor * frontRockerBoardOutsideWidth;

    // rectangles defining the rocker's boards
    frontRockerFrontBoardRect = rect(frontViewCenterPt.x - scaledFrontRockerBoardOutsideWidth / 2, scaledRockerSideTopY, scaledFrontRockerBoardOutsideWidth, scaledRockerSideHeight + scaledWoodThickness);
    frontRockerLeftBearingBoardRect = rect(frontViewCenterPt.x - scaledFrontRockerBoardOutsideWidth / 2, frontViewCenterPt.y + scaledCGToBearingPointY, scaledWoodThickness, scaledRockerSideTopY - frontViewCenterPt.y - scaledCGToBearingPointY);
    // uses values from frontRockerLeftBearingBoardRect
    frontRockerRightBearingBoardRect = rect(frontViewCenterPt.x + scaledFrontRockerBoardOutsideWidth / 2 - scaledWoodThickness, frontRockerLeftBearingBoardRect.y, scaledWoodThickness, frontRockerLeftBearingBoardRect.height);

    // draw in order: light rays, optics, structure, baffles
    // draw tube
    drawCircle(context, frontViewCenterPt, scaledTelescopeTubeOD / 2, config.canvasLineWidth, config.canvasStructureStyle);
    // draw rocker boards
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, frontRockerFrontBoardRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, frontRockerLeftBearingBoardRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, frontRockerRightBearingBoardRect);
    // write front board width, height
    text = config.rockerFrontBoardWidthText + roundToDecimal(frontRockerBoardOutsideWidth, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = frontRockerFrontBoardRect.endY + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, frontRockerFrontBoardRect.x, frontRockerRightBearingBoardRect.endX, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    text = config.rockerFrontBoardHeightText + roundToDecimal(frontRockerFrontBoardRect.height / state.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
    dimensionX = frontRockerFrontBoardRect.endX + 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, frontRockerFrontBoardRect.endY, frontRockerFrontBoardRect.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // label views
    context.fillStyle = config.canvasStructureLightStyle;
    context.fillText(config.sideViewLit, rockerSideBoardRect.x + rockerSideBoardRect.width / 2, rockerSideBoardRect.y + rockerSideBoardRect.height / 2);
    context.fillText(config.frontViewLit, frontRockerFrontBoardRect.x + frontRockerFrontBoardRect.width / 2, frontRockerFrontBoardRect.y + frontRockerFrontBoardRect.height / 2);

    // save rocker dimensions
    rocker.width = frontRockerBoardOutsideWidth;
    rocker.height = rockerSideHeight;
    rocker.length = rockerSideLength;

    // write out results: sides, front, bottom+ground, pads
    rockerWidth = telescopeTubeOD + woodThickness * 2;
    materialArea = 2 * rockerSideLength * rockerSideHeight + rockerSideHeight * rockerWidth + 2 * rockerSideLength * rockerWidth + 2 * altBearingSeparation * padHeight;
    if (common.imperial()) {
        materialAreaUomDivisor = 144;
        materialAreaLit = ' ft^2';
    } else {
        materialAreaUomDivisor = 1000000;
        materialAreaLit = ' m^2';
    }
    common.rockerResults().html('rocker dimensions = '
            + roundToDecimal(rocker.width, config.decimalPointsDimension)
            + uomLengthLit
            + ' wide by '
            + roundToDecimal(rocker.length, config.decimalPointsDimension)
            + uomLengthLit
            + ' long by '
            + roundToDecimal(rocker.height, config.decimalPointsDimension)
            + uomLengthLit
            + ' high<br>material area = '
            + roundToDecimal(materialArea / materialAreaUomDivisor, config.decimalPointsMaterialArea)
            + materialAreaLit);
};

MLB.telescopeCriteriaCalc.graphFlexRocker = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        calcDobFriction = MLB.calcLib.calcDobFriction,
        flexRocker = state.flexRocker,
        friction,
        materials = MLB.materialFrictionJson.materials,
        altCoF = +materials[common.flexRockerAltBearingMaterialsSelect().get(0).selectedIndex].friction,
        azCoF = +materials[common.flexRockerAzBearingMaterialsSelect().get(0).selectedIndex].friction,
        pushAngleDegFromHorizontal = config.pushAngleDegFromHorizontal,
        momentArmInches = common.convertUomToInches(common.CGToEyepieceDistanceVal()),
        tubeWeightLbs = common.convertUomToLbs(common.flexRockerTubeWeightVal()),
        rockerWeightLbs = common.convertUomToLbs(common.flexRockerRockerWeightVal()),
        tubeOD = common.telescopeTubeODVal(),
        altBearingRadius = common.flexRockerCGToBackEdgeOfTubeClearanceVal(),
        altRimThickness = common.convertInchesToUom(config.altRimThicknessInches),
        altBearingSeparationDeg = common.flexRockerAltBearingSeparationDegVal(),
        altBearingSeparationHalfAngleRad,
        altBearingSeparation,
        altBearingSideToSideSeparation,
        altBearingHeight,
        flexRockerThickness,
        swingAltBearingSeparation,
        azInnerRadius,
        azOuterRadius,
        baseRingHeight,
        calcFriction,
        padSizeInchesSquared,
        padSizeUom,
        roundedPadSizeSideUom,
        uomLengthLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        drawCanvasOutline = MLB.telescopeCriteriaCalc.drawCanvasOutline,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        drawCircle = MLB.sharedLib.drawCircle,
        drawHorizDimen = MLB.sharedLib.drawHorizDimen,
        drawVertDimen = MLB.sharedLib.drawVertDimen,
        uom = MLB.sharedLib.uom,
        canvas,
        context,
        topViewCenterPt,
        sideViewCenterPt,
        scaledAzInnerRadius,
        scaledAzOuterRadius,
        scaledAltBearingRadius,
        scaledAltBearingSeparation,
        scaledAltBearingSideToSideSeparation,
        scaledAltBearingHeight,
        scaledBaseRingHeight,
        scaledFlexRockerThickness,
        scaledPadSizeSideUom,
        scaledPadThicknessUom,
        rockerTopInnerRect,
        rockerTopOuterRect,
        baseRingSideViewRect,
        sideViewCGPt,
        rockerSideViewRect,
        sideViewLeftAzPadRect,
        sideViewRightAzPadRect,
        bearingArcLeftPt,
        bearingArcRightPt,
        text,
        dimensionY,
        dimensionX;

    flexRocker.friction = flexRocker.friction || {};
    friction = flexRocker.friction;

    altBearingSeparationHalfAngleRad = altBearingSeparationDeg * uom.degToRad / 2;
    altBearingSeparation = altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad) * 2;
    // assume bearings on outside edge
    altBearingSideToSideSeparation = tubeOD + altRimThickness * 2;
    altBearingHeight = altBearingRadius * Math.cos(altBearingSeparationHalfAngleRad);
    flexRockerThickness = common.convertLbsToUom(config.flexRockerThicknessInches);
    // tube swings through thickness of rocker, so base inner radius can be reduced
    swingAltBearingSeparation = altBearingSeparation - 2 * flexRockerThickness / Math.cos(altBearingSeparationHalfAngleRad);
    azInnerRadius = Math.sqrt(swingAltBearingSeparation * swingAltBearingSeparation + altBearingSideToSideSeparation * altBearingSideToSideSeparation) / 2;
    azOuterRadius = azInnerRadius * config.flexRockerBaseRingWidthFactor;
    baseRingHeight = azOuterRadius - azInnerRadius;
    calcFriction = calcDobFriction(azCoF, altCoF, momentArmInches, tubeWeightLbs + rockerWeightLbs, tubeWeightLbs, azInnerRadius, altBearingRadius, altBearingSeparationDeg / 2, pushAngleDegFromHorizontal);
    friction.alt = common.convertLbsToUom(calcFriction.alt);
    friction.az = common.convertLbsToUom(calcFriction.az);
    padSizeInchesSquared = (tubeWeightLbs + rockerWeightLbs) / config.frictionOfMovementPadIdealPSI / 3;
    padSizeUom = common.convertInchesSquaredToUom(padSizeInchesSquared);
    friction.padSizeSideUom = Math.sqrt(padSizeUom);
    roundedPadSizeSideUom = roundToDecimal(friction.padSizeSideUom, config.decimalPointsCG);

    canvas = common.flexRockerCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }

    // calc key points
    topViewCenterPt = point(canvas.width / 4, canvas.height / 2);
    sideViewCenterPt = point(canvas.width * 3 / 4, topViewCenterPt.y);

    // scaled dimensions
    scaledAzInnerRadius = state.scalingFactor * azInnerRadius;
    scaledAzOuterRadius = state.scalingFactor * azOuterRadius;
    scaledAltBearingRadius = state.scalingFactor * altBearingRadius;
    scaledAltBearingSeparation = state.scalingFactor * altBearingSeparation;
    scaledAltBearingSideToSideSeparation = state.scalingFactor * altBearingSideToSideSeparation;
    scaledAltBearingHeight = state.scalingFactor * altBearingHeight;
    scaledBaseRingHeight = state.scalingFactor * baseRingHeight;
    scaledFlexRockerThickness = state.scalingFactor * flexRockerThickness;
    scaledPadSizeSideUom = state.scalingFactor * friction.padSizeSideUom;
    scaledPadThicknessUom = state.scalingFactor * common.convertInchesToUom(config.padThicknessInches);

    // rectangles
    rockerTopInnerRect = rect(topViewCenterPt.x - scaledAltBearingSeparation / 2, topViewCenterPt.y - scaledAltBearingSideToSideSeparation / 2, scaledAltBearingSeparation, scaledAltBearingSideToSideSeparation);
    rockerTopOuterRect = rect(rockerTopInnerRect.x - scaledFlexRockerThickness, rockerTopInnerRect.y - scaledFlexRockerThickness, rockerTopInnerRect.width + scaledFlexRockerThickness * 2, rockerTopInnerRect.height + scaledFlexRockerThickness * 2);

    sideViewCGPt = point(sideViewCenterPt.x, 4 * config.canvasDimensionHalfHeight);
    // height from CG is vertical distance to alt bearing point + pad thickness + rocker thickness
    baseRingSideViewRect = rect(sideViewCenterPt.x - scaledAzOuterRadius, scaledAltBearingHeight + scaledPadThicknessUom + scaledFlexRockerThickness + sideViewCGPt.y, scaledAzOuterRadius * 2, scaledBaseRingHeight);
    rockerSideViewRect = rect(sideViewCenterPt.x - scaledAltBearingSeparation / 2 - scaledFlexRockerThickness, baseRingSideViewRect.y - scaledPadThicknessUom - scaledFlexRockerThickness, scaledAltBearingSeparation + 2 * scaledFlexRockerThickness, scaledFlexRockerThickness);
    sideViewLeftAzPadRect = rect(rockerSideViewRect.x + scaledFlexRockerThickness - scaledPadSizeSideUom, rockerSideViewRect.endY, scaledPadSizeSideUom, scaledPadThicknessUom);
    sideViewRightAzPadRect = rect(rockerSideViewRect.endX - scaledFlexRockerThickness, rockerSideViewRect.endY, scaledPadSizeSideUom, scaledPadThicknessUom);
    // bearing arc pts
    bearingArcLeftPt = point(rockerSideViewRect.x + scaledFlexRockerThickness, rockerSideViewRect.y);
    bearingArcRightPt = point(rockerSideViewRect.endX - scaledFlexRockerThickness, rockerSideViewRect.y);

    // draw in order: light rays, optics, structure, baffles
    // top view
    // draw base ring top
    drawCircle(context, topViewCenterPt, scaledAzInnerRadius, config.canvasLineWidth, config.canvasStructureStyle);
    drawCircle(context, topViewCenterPt, scaledAzOuterRadius, config.canvasLineWidth, config.canvasStructureStyle);
    // draw rocker top
    context.clearRect(rockerTopOuterRect.x, rockerTopOuterRect.y, rockerTopOuterRect.width, rockerTopOuterRect.height);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, rockerTopInnerRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, rockerTopOuterRect);
    // side view
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, baseRingSideViewRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, rockerSideViewRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, sideViewLeftAzPadRect);
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, sideViewRightAzPadRect);
    // draw CG to alt bearing pts
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, sideViewCGPt, bearingArcRightPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, sideViewCGPt, bearingArcLeftPt);
    // draw alt bearing arc
    context.beginPath();
    context.arc(sideViewCGPt.x, sideViewCGPt.y, scaledAltBearingRadius, uom.qtrRev - altBearingSeparationHalfAngleRad, uom.qtrRev + altBearingSeparationHalfAngleRad);
    context.lineWidth = config.canvasLineWidth;
    context.strokeStyle = config.canvasStructureLightStyle;
    context.stroke();

    // write CG
    context.fillStyle = config.canvasStructureLightStyle;
    context.fillText(config.centerOfGravityText, sideViewCGPt.x, sideViewCGPt.y);
    // label views
    context.fillStyle = config.canvasStructureLightStyle;
    context.fillText(config.topViewLit, topViewCenterPt.x, topViewCenterPt.y);
    context.fillText(config.sideViewLit, sideViewCenterPt.x, sideViewCenterPt.y);

    // write top view dimensions: horizontal
    text = config.flexRockerBaseRingInnerDiaText + roundToDecimal(azInnerRadius * 2, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = topViewCenterPt.y + 8 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, topViewCenterPt.x - scaledAzInnerRadius, topViewCenterPt.x + scaledAzInnerRadius, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    text = config.flexRockerBaseRingOuterDiaText + roundToDecimal(azOuterRadius * 2, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, topViewCenterPt.x - scaledAzOuterRadius, topViewCenterPt.x + scaledAzOuterRadius, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    text = config.flexRockerLengthText + roundToDecimal(altBearingSeparation, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, topViewCenterPt.x - scaledAltBearingSeparation / 2, topViewCenterPt.x + scaledAltBearingSeparation / 2, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write top view dimensions: vertical
    text = config.flexRockerWidthText + roundToDecimal(altBearingSideToSideSeparation, config.decimalPointsDimension) + uomLengthLit;
    dimensionX = rockerTopInnerRect.endX + 8 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, rockerTopInnerRect.y, rockerTopInnerRect.endY, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write side view dimensions: horizontal
    // write side view dimensions: vertical
    text = config.flexRockerBaseRingHeightText + roundToDecimal(baseRingHeight, config.decimalPointsDimension) + uomLengthLit;
    dimensionX = baseRingSideViewRect.x - 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, baseRingSideViewRect.y, baseRingSideViewRect.endY, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    text = config.flexRockerTubeSwingText + roundToDecimal(altBearingRadius, config.decimalPointsDimension) + uomLengthLit;
    dimensionX -= 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, sideViewCGPt.y, sideViewCGPt.y + scaledAltBearingRadius, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // save values
    flexRocker.rocker = flexRocker.rocker || {};
    flexRocker.rocker.width = altBearingSideToSideSeparation;
    flexRocker.rocker.length = altBearingSeparation;
    flexRocker.rocker.thickness = flexRockerThickness;
    flexRocker.baseRing = flexRocker.baseRing || {};
    flexRocker.baseRing.innerRadius = azInnerRadius;
    flexRocker.baseRing.outerRadius = azOuterRadius;
    flexRocker.baseRing.height = baseRingHeight;

    // write results
    common.flexRockerResults().html('Flex rocker dimensions = '
            + roundToDecimal(altBearingSeparation, config.decimalPointsDimension)
            + uomLengthLit
            + ' long by '
            + roundToDecimal(altBearingSideToSideSeparation, config.decimalPointsDimension)
            + uomLengthLit
            + ' wide by '
            + roundToDecimal(flexRockerThickness, config.decimalPointsDimension)
            + uomLengthLit
            + ' thick<br>base ring dimensions = '
            + roundToDecimal(azInnerRadius * 2, config.decimalPointsDimension)
            + uomLengthLit
            + ' inner diameter by '
            + roundToDecimal(azOuterRadius * 2, config.decimalPointsDimension)
            + uomLengthLit
            + ' outer diameter by '
            + roundToDecimal(baseRingHeight, config.decimalPointsDimension)
            + uomLengthLit
            + ' high<br>altitude friction of movement at eyepiece = '
            + roundToDecimal(friction.alt, config.decimalPointsTelescopeFocalLength)
            + uomWeightLit
            + '<br>azimuth friction of movement at eyepiece = '
            + roundToDecimal(friction.az, config.decimalPointsTelescopeFocalLength)
            + uomWeightLit
            + '<br>azimuth pad size = '
            + roundedPadSizeSideUom
            + uomLengthLit
            + ' x '
            + roundedPadSizeSideUom
            + uomLengthLit);
};

MLB.telescopeCriteriaCalc.graphEquatorialTable = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common;

    // write results
    common.ETResults().html(common.latitudeDegVal());
};

/*  <tr>
        <td>
            <input class="CGPart" name="CGPart0" value="Primary mirror" onfocus="select();" type="text">
        </td>
        <td>
            <input class="inputText" name="CGWeight0" value="" onfocus="select();" type="text">
        </td>
        <td>
            <input class="inputText" name="CGDistance0" value="" onfocus="select();" type="text">
        </td>
    </tr>
    <tr>
        <td>
            <input class="CGPart" name="CGPart1" value="Mirror mount" onfocus="select();" type="text">
        </td>
        <td>
            <input class="inputText" name="CGWeight1" value="" onfocus="select();" type="text">
        </td>
        <td>
            <input class="inputText" name="CGDistance1" value="" onfocus="select();" type="text">
        </td>
    </tr>
    ...
*/
MLB.telescopeCriteriaCalc.buildCGHtmlTable = function () {
    var config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        parts = config.CGParts,
        IDs = config.CGIDs,
        htmlStr = '\r\n';

    common.CGTableBody().append(htmlStr);

    $.each(parts, function (pIx, pV) {
        htmlStr = "<tr>\r\n";
        $.each(IDs, function (IDIx, IDV) {
            htmlStr += "    <td>\r\n";
            if (IDIx === 0) {
                htmlStr += "        <input class='CGPart' name='" + IDV + pIx + "' value='" + pV + "' onfocus='select();' type='text'";
            } else {
                htmlStr += "        <input class='inputText' name='" + IDV + pIx + "' value='' onfocus='select();' type='text'";
            }
            if (IDIx === 3) {
                htmlStr += " readonly";
            }
            htmlStr += ">\r\n";
            htmlStr += "    </td>\r\n";
        });
        htmlStr += "</tr>\r\n";
        common.CGTableBody().append(htmlStr);
    });
};

// based on starting default hard coded 12" f/4 example
MLB.telescopeCriteriaCalc.seedCGTable = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        CGIxs = config.CGIxs,
        weights = config.weights,
        mirrorMountDistanceInches = config.primaryMirrorThicknessInches + config.primaryMirrorCellThicknessInches / 2,
        mirrorMountDistance = common.convertInchesToUom(mirrorMountDistanceInches);

    // set distance for primary mirror
    $('[name=CGDistance' + CGIxs.primaryMirror + ']').val(0);
    // set distance for primary mirror mount (negative because it is behind the primary mirror's front edge, which is the reference point or '0'
    $('[name=CGDistance' + CGIxs.mirrorMount + ']').val(roundToDecimal(-mirrorMountDistance, config.decimalPointsCG));

    // set weights, one for each value in the weights array
    $('[name=CGWeight' + CGIxs.mirrorMount + ']').val(weights.mirrorMount);
    $('[name=CGWeight' + CGIxs.tube + ']').val(weights.tube);
    $('[name=CGWeight' + CGIxs.focuser + ']').val(weights.focuser);
    $('[name=CGWeight' + CGIxs.diagonal + ']').val(weights.diagonal);
    $('[name=CGWeight' + CGIxs.spider + ']').val(weights.spider);
    $('[name=CGWeight' + CGIxs.eyepiece + ']').val(weights.eyepiece);
};

MLB.telescopeCriteriaCalc.updateCGDistances = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        CG = state.CG,
        CGIxs = config.CGIxs,
        ixs = [CGIxs.focuser, CGIxs.diagonal, CGIxs.spider, CGIxs.finder, CGIxs.eyepiece],
        distance;

    // set distance for upper end items
    distance = roundToDecimal(state.mirrorFrontEdgeToFocalPlaneDistance, config.decimalPointsCG);
    $.each(ixs, function (i, v) {
        $('[name=CGDistance' + v + ']').val(distance);
    });
    // set distance for tube
    distance = roundToDecimal(common.apertureVal() * common.focalRatioVal() / 2, config.decimalPointsCG);
    $('[name=CGDistance' + config.CGIxs.tube + ']').val(distance);
    // set distance for altitude bearings
    if (!isNaN(CG.CG)) {
        distance = roundToDecimal(CG.CG, config.decimalPointsCG);
        $('[name=CGDistance' + config.CGIxs.altitudeBearings + ']').val(distance);
    }
};

MLB.telescopeCriteriaCalc.calcCGSensitivity = function () {
    var state = MLB.telescopeCriteriaCalc.state,
        CG = state.CG,
        // either 1 lb or 1 kg
        weightToAdd = 1;

    return (CG.weight * CG.CG + weightToAdd * state.mirrorFrontEdgeToFocalPlaneDistance) / (CG.weight + weightToAdd) - CG.CG;
};

MLB.telescopeCriteriaCalc.calcCG = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        common = MLB.telescopeCriteriaCalc.common,
        config = MLB.telescopeCriteriaCalc.config,
        CG = state.CG,
        calcCGSensitivity = MLB.telescopeCriteriaCalc.calcCGSensitivity,
        weightElements,
        distanceElements,
        weight,
        distance,
        momentArm,
        totalWeight = 0,
        totalMomentArm = 0,
        uomLengthLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit();

    weightElements = $('[name^=' + config.CGIDs[1] + ']');
    distanceElements = $('[name^=' + config.CGIDs[2] + ']');

    weightElements.each(function (i, v) {
        weight = parseFloat(v.value);
        distance = parseFloat(distanceElements[i].value);
        if (!isNaN(weight) && !isNaN(distance)) {
            momentArm = weight * distance;
            totalWeight += weight;
            totalMomentArm += momentArm;
        }
    });
    CG.CG = totalMomentArm / totalWeight;
    CG.weight = totalWeight;
    CG.sensitivity = calcCGSensitivity();
    CG.heightToClearRockerBottomDistance = Math.sqrt(Math.pow(common.telescopeTubeODVal() / 2, 2) + Math.pow(state.tubeBackEndToFocalPlaneDistance - state.mirrorFrontEdgeToFocalPlaneDistance + CG.CG, 2));
    // update fields for friction of movement
    common.CGToEyepieceDistance().val(roundToDecimal(state.mirrorFrontEdgeToFocalPlaneDistance, config.decimalPointsCG));
    common.tubeWeight().val(roundToDecimal(totalWeight, config.decimalPointsCG));
    common.flexRockerCGToEyepieceDistance().val(common.CGToEyepieceDistanceVal());
    common.flexRockerTubeWeight().val(common.tubeWeightVal());
    common.flexRockerCGToBackEdgeOfTubeClearance().val(roundToDecimal(CG.heightToClearRockerBottomDistance, config.decimalPointsCG));

    common.CGResults().html('Total weight = '
            + roundToDecimal(totalWeight, config.decimalPointsCG)
            + uomWeightLit
            + '; CG = '
            + roundToDecimal(CG.CG, config.decimalPointsCG)
            + uomLengthLit
            + '<br>Sensitivity: CG changes by '
            + roundToDecimal(CG.sensitivity, config.decimalPointsCG)
            + uomLengthLit
            + ' for a 1 '
            + uomWeightLit
            + ' change at the eyepiece<br>CG to eyepiece distance = '
            + common.CGToEyepieceDistanceVal()
            + uomLengthLit
            + '<br>CG to back corner of telescope tube (distance needed for tube to clear rocker bottom) = '
            + roundToDecimal(CG.heightToClearRockerBottomDistance, config.decimalPointsCG)
            + uomLengthLit);
};

MLB.telescopeCriteriaCalc.updateMirrorWeight = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        conversionFactor = common.convertLbsToUom(config.glassLbsPer144CubicInches),
        weight = Math.pow(common.apertureInchesVal() / 2, 2) * Math.PI * config.primaryMirrorThicknessInches * conversionFactor;

    $('[name=CGWeight' + config.CGIxs.primaryMirror + ']').val(roundToDecimal(weight, config.decimalPointsCG));
};

MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        updateMirrorWeight = MLB.telescopeCriteriaCalc.updateMirrorWeight,
        newTubeOD = common.apertureVal() + common.telescopeTubeThicknessVal() * 2 + common.convertMmToUom(common.eyepieceFieldStopmmVal()),
        newFocalPlaneToDiagDistance = newTubeOD / 2 + common.focuserRackedInHeightVal() + common.focuserInwardFocusingDistanceVal();

    common.telescopeTubeOD().val(roundToDecimal(newTubeOD, config.decimalPointsTube));
    common.focalPlaneToDiagDistance().val(roundToDecimal(newFocalPlaneToDiagDistance, config.decimalPointsTube));

    updateMirrorWeight();
};

MLB.telescopeCriteriaCalc.updateFrictionOfMovement = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        friction = state.friction,
        calcDobFriction = MLB.calcLib.calcDobFriction,
        materials = MLB.materialFrictionJson.materials,
        uomDistanceLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        altCoF = +materials[common.altBearingMaterialsSelect().get(0).selectedIndex].friction,
        azCoF = +materials[common.azBearingMaterialsSelect().get(0).selectedIndex].friction,
        pushAngleDegFromHorizontal = config.pushAngleDegFromHorizontal,
        momentArmInches = common.convertUomToInches(common.CGToEyepieceDistanceVal()),
        tubeWeightLbs = common.convertUomToLbs(common.tubeWeightVal()),
        rockerWeightLbs = common.convertUomToLbs(common.rockerWeightVal()),
        totalWeight = common.tubeWeightVal() + common.rockerWeightVal(),
        calcFriction = calcDobFriction(azCoF, altCoF, momentArmInches, tubeWeightLbs + rockerWeightLbs, tubeWeightLbs, common.azBearingRadiusInchesVal(), common.altBearingRadiusInchesVal(), common.altBearingSeparationDegVal() / 2, pushAngleDegFromHorizontal),
        padSizeInchesSquared = (tubeWeightLbs + rockerWeightLbs) / config.frictionOfMovementPadIdealPSI / 3,
        padSizeUom = common.convertInchesSquaredToUom(padSizeInchesSquared),
        roundedPadSizeSideUom,
        radiancevignettedLuminancePerWeight = state.vignettedLuminance * state.radiance / common.convertUomToKg(totalWeight);

    friction.alt = common.convertLbsToUom(calcFriction.alt);
    friction.az = common.convertLbsToUom(calcFriction.az);
    friction.padSizeSideUom = Math.sqrt(padSizeUom);
    roundedPadSizeSideUom = roundToDecimal(friction.padSizeSideUom, config.decimalPointsCG);
    state.totalWeight = totalWeight;
    state.radiancevignettedLuminancePerWeight = radiancevignettedLuminancePerWeight;
    common.frictionOfMovementResults().html('Altitude friction of movement at eyepiece = '
            + roundToDecimal(friction.alt, config.decimalPointsTelescopeFocalLength)
            + uomWeightLit
            + '<br>azimuth friction of movement at eyepiece = '
            + roundToDecimal(friction.az, config.decimalPointsTelescopeFocalLength)
            + uomWeightLit
            + '<br>azimuth pad size = '
            + roundedPadSizeSideUom
            + uomDistanceLit
            + ' x '
            + roundedPadSizeSideUom
            + uomDistanceLit
            + '<br>total weight of tube and rocker = '
            + roundToDecimal(totalWeight, config.decimalPointsCG)
            + uomWeightLit
            + '<br>vignetted luminance-radiance-weight = '
            + roundToDecimal(radiancevignettedLuminancePerWeight, config.decimalPointsRadiance) + config.radianceLuminancePerWeightLit);
};

// chained functions...

MLB.telescopeCriteriaCalc.execChainStartEquatorialTable = function (startup) {
    var graphEquatorialTable = MLB.telescopeCriteriaCalc.graphEquatorialTable,
        writeSummary = MLB.telescopeCriteriaCalc.writeSummary;

    graphEquatorialTable();
    writeSummary(startup);
};

MLB.telescopeCriteriaCalc.execChainStartFlexRocker = function (startup) {
    var graphFlexRocker = MLB.telescopeCriteriaCalc.graphFlexRocker,
        execChainStartEquatorialTable = MLB.telescopeCriteriaCalc.execChainStartEquatorialTable;

    graphFlexRocker();
    execChainStartEquatorialTable(startup);
};

MLB.telescopeCriteriaCalc.execChainStartFrictionOfMovemnet = function (startup) {
    var updateFrictionOfMovement = MLB.telescopeCriteriaCalc.updateFrictionOfMovement,
        graphRocker = MLB.telescopeCriteriaCalc.graphRocker,
        execChainStartFlexRocker = MLB.telescopeCriteriaCalc.execChainStartFlexRocker;

    updateFrictionOfMovement();
    graphRocker();
    execChainStartFlexRocker(startup);
};

MLB.telescopeCriteriaCalc.execChainStartCalcCG = function (startup) {
    var calcCG = MLB.telescopeCriteriaCalc.calcCG,
        execChainStartFrictionOfMovemnet = MLB.telescopeCriteriaCalc.execChainStartFrictionOfMovemnet;

    calcCG();
    execChainStartFrictionOfMovemnet(startup);
};

MLB.telescopeCriteriaCalc.execChainStartBaffles = function (startup) {
    var graphBaffles = MLB.telescopeCriteriaCalc.graphBaffles,
        graphLowRider = MLB.telescopeCriteriaCalc.graphLowRider,
        updateCGDistances = MLB.telescopeCriteriaCalc.updateCGDistances,
        execChainStartCalcCG = MLB.telescopeCriteriaCalc.execChainStartCalcCG;

    graphBaffles();
    graphLowRider();
    updateCGDistances();
    execChainStartCalcCG(startup);
};

MLB.telescopeCriteriaCalc.execChainStartDiagIllum = function (startup) {
    var graphDiagIllum = MLB.telescopeCriteriaCalc.graphDiagIllum,
        setCanvasScalingFactor = MLB.telescopeCriteriaCalc.setCanvasScalingFactor,
        execChainStartBaffles = MLB.telescopeCriteriaCalc.execChainStartBaffles;

    graphDiagIllum();
    setCanvasScalingFactor();
    execChainStartBaffles(startup);
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
MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy = function (startup) {
    var updateFieldsDependentOnAperture = MLB.telescopeCriteriaCalc.updateFieldsDependentOnAperture,
        updateTelescopeResults = MLB.telescopeCriteriaCalc.updateTelescopeResults,
        updateEyepieceOptimizerRows = MLB.telescopeCriteriaCalc.updateEyepieceOptimizerRows,
        execChainStartDiagIllum = MLB.telescopeCriteriaCalc.execChainStartDiagIllum;

    updateFieldsDependentOnAperture();
    updateTelescopeResults();
    updateEyepieceOptimizerRows();
    execChainStartDiagIllum(startup);
};

// end chained functions...

MLB.telescopeCriteriaCalc.calcAperture = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil,
        calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        focalRatioChecked = common.focalRatioChecked(),
        resultApertureInches;

    if (focalRatioChecked) {
        resultApertureInches = calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.FOVdegVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
    } else {
        resultApertureInches = calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil(common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
    }
    common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
    updateFollowOnFieldsStrategy();
};

MLB.telescopeCriteriaCalc.calcFOV = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil = MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil,
        calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        focalRatioChecked = common.focalRatioChecked(),
        resultFOV;

    if (focalRatioChecked) {
        resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);
    } else {
        resultFOV = calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());
    }

    common.FOVdeg().val(roundToDecimal(resultFOV, config.decimalPointsFOV));
    updateFollowOnFieldsStrategy();
};

MLB.telescopeCriteriaCalc.calcEyepieceFieldStop = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil,
        calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        focalRatioChecked = common.focalRatioChecked(),
        resultEyepieceFieldStop;

    if (focalRatioChecked) {
        resultEyepieceFieldStop = calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.focalRatioVal(), comaCorrectorMag);
    } else {
        resultEyepieceFieldStop = calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyePupilmmVal());
    }
    common.eyepieceFieldStopmm().val(roundToDecimal(resultEyepieceFieldStop, config.decimalPointsEyepieceFieldStop));
    updateFollowOnFieldsStrategy();
};

MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        apertureInchesFromMagnitude = MLB.calcLib.apertureInchesFromMagnitude,
        // lower power reduces limiting magnitude by ~1 mag
        resultApertureInches = apertureInchesFromMagnitude(common.limitingMagnitudeVal() + 1);

    common.aperture().val(roundToDecimal(common.convertInchesToUom(resultApertureInches), config.decimalPointsAperture));
    updateFollowOnFieldsStrategy();
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
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        resultEyepieceFocalLengthmm = common.focalRatioVal() * common.eyePupilmmVal() * comaCorrectorMag;

    common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, config.decimalPointsEyepieceFL));
};

MLB.telescopeCriteriaCalc.calcFocalRatio = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        common = MLB.telescopeCriteriaCalc.common,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        resultFocalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), comaCorrectorMag);

    common.focalRatio().val(roundToDecimal(resultFocalRatio, config.decimalPointsFocalRatio));
    updateFollowOnFieldsStrategy();
};

MLB.telescopeCriteriaCalc.calcEyePupil = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        common = MLB.telescopeCriteriaCalc.common,
        resultEyePupilmm = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFocalLengthmmVal(), common.eyepieceFieldStopmmVal());

    common.eyePupilmm().val(roundToDecimal(resultEyePupilmm, config.decimalPointsEyePupil));
    updateFollowOnFieldsStrategy();
};

MLB.telescopeCriteriaCalc.calcEyepieceFocalLength = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.telescopeCriteriaCalc.config,
        calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil = MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        common = MLB.telescopeCriteriaCalc.common,
        resultEyepieceFocalLengthmm = calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil(common.apertureInchesVal(), common.FOVdegVal(), common.eyepieceFieldStopmmVal(), common.eyePupilmmVal());

    common.eyepieceFocalLengthmm().val(roundToDecimal(resultEyepieceFocalLengthmm, config.decimalPointsEyepieceFL));
    updateFollowOnFieldsStrategy();
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
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        // uses aperture, focal ratio
        magnification = common.apertureInchesVal() * common.focalRatioVal() / +eyepiece.focalLengthmm * 25.4 * comaCorrectorMag,
        resolutionArcsec = resolutionFromAperture_Magnification(common.apertureInchesVal(), magnification),
        exitPupil = +eyepiece.focalLengthmm / common.focalRatioVal(),
        resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), +eyepiece.fieldStopmm, comaCorrectorMag);

    common.tableElement(config.EyeOptManufacturerID, idIx).html(eyepiece.manufacturer);
    common.tableElement(config.EyeOptTypeID, idIx).html(eyepiece.type);
    common.tableElement(config.EyeOptFocalLengthID, idIx).html(roundToDecimal(+eyepiece.focalLengthmm, config.decimalPointsEyepieceFL) + config.mmLitNS);
    common.tableElement(config.EyeOptFieldStopID, idIx).html(roundToDecimal(+eyepiece.fieldStopmm, config.decimalPointsEyepieceFieldStop) + config.mmLitNS);
    common.tableElement(config.EyeOptExitPupilID, idIx).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + config.mmLitNS);
    common.tableElement(config.EyeOptApparentFieldID, idIx).html(roundToDecimal(+eyepiece.apparentField, config.decimalPointsEyepieceApparentFOV) + config.degLit);
    common.tableElement(config.EyeOptFOVID, idIx).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + config.degLit);
    common.tableElement(config.EyeOptMagnificationID, idIx).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
    common.tableElement(config.EyeOptResolutionID, idIx).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');

    state.eyeOptRowSet[idIx] = true;
};

MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldFromFocalRatio_EyePupil = function () {
    var common = MLB.telescopeCriteriaCalc.common,
        eyepiecesJson = MLB.eyepiecesJson,
        setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
        calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
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
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        bestFOV,
        bestIx;

    $.each(eyepiecesJson.eyepieces, function (i, v) {
        var FOV,
            eyePupil;

        FOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(common.apertureInchesVal(), common.focalRatioVal(), +v.fieldStopmm, comaCorrectorMag);
        eyePupil = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), FOV, +v.focalLengthmm, +v.fieldStopmm);
        if (eyePupil <= common.eyePupilmmVal() && (bestFOV === undefined || bestFOV < FOV)) {
            // best fitting eyepiece = v
            bestFOV = FOV;
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
            common.btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil().removeAttr('disabled');
            common.btnCalcEyepieceWidestFieldForEyePupil().removeAttr('disabled');
            common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().removeAttr('disabled');

            common.btnCalcEyePupil().attr('disabled', 'disabled');
            common.btnCalcEyepieceFocalLength().attr('disabled', 'disabled');
        } else {
            common.btnCalcAperture().val(config.calcAperture5ParmsLit);
            common.btnCalcFOV().val(config.calcFOV5ParmsLit);
            common.btnCalcEyepieceFieldStop().val(config.calcEyepieceFieldStop5ParmsLit);

            common.btnCalcFocalRatio().attr('disabled', 'disabled');
            common.btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil().attr('disabled', 'disabled');
            common.btnCalcEyepieceWidestFieldForEyePupil().attr('disabled', 'disabled');
            common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().attr('disabled', 'disabled');

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
        updateTelescopeResults = MLB.telescopeCriteriaCalc.updateTelescopeResults,
        execChainStartDiagIllum = MLB.telescopeCriteriaCalc.execChainStartDiagIllum,
        weightElements,
        weight,
        distanceElements,
        distance,
        uomDistanceLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        // no conversion at startup!
        lengthConversionFactor = common.getLengthConversionFactorIgnoreAtStartup(startup),
        weightConversionFactor = common.getWeightConversionFactorIgnoreAtStartup(startup),
        diags = common.imperial()
            ? config.diagonalsInches.join(', ')
            : config.diagonalsMm.join(', ');

    // update labels to include uom
    common.apertureLabel().html(config.apertureLabelLit + uomDistanceLit + config.equalsLit);
    common.focalLengthLabel().html(config.focalLengthLabelLit + uomDistanceLit + config.equalsLit);
    common.focuserRackedInHeightLabel().html(config.focuserRackedInHeightLabelLit + uomDistanceLit + config.equalsLit);
    common.focuserTravelLabel().html(config.focuserTravelLabelLit + uomDistanceLit + config.equalsLit);
    common.barrelTubeInsideDiameterLabel().html(config.barrelTubeInsideDiameterLabelLit + uomDistanceLit + config.equalsLit);
    common.barrelTubeLengthLabel().html(config.barrelTubeLengthLabelLit + uomDistanceLit + config.equalsLit);
    common.focuserInwardFocusingDistanceLabel().html(config.focuserInwardFocusingDistanceLabelLit + uomDistanceLit + config.equalsLit);
    common.tubeODLabel().html(config.tubeODLabelLit + uomDistanceLit + config.equalsLit);
    common.tubeThicknessLabel().html(config.tubeThicknessLabelLit + uomDistanceLit + config.equalsLit);
    common.focalPlaneToDiagDistanceLabel().html(config.focalPlaneToDiagDistanceLabelLit + uomDistanceLit + config.equalsLit);
    common.diagSizesLabel().html(config.diagSizesLabelLit + uomDistanceLit);
    common.optimizedDiagSizeLabel().html(config.optimizedDiagSizeLabelLit + uomDistanceLit + config.equalsLit);
    common.focalPlaneToFocuserBarrelBottomDistanceLabel().html(config.focalPlaneToFocuserBarrelBottomDistanceLabelLit + uomDistanceLit + config.equalsLit);
    common.diagOffsetLabel().html(config.diagOffsetLabelLit + uomDistanceLit + config.equalsLit);
    common.foldingSecondaryMirrorSizeLabel().html(config.foldingSecondaryMirrorSizeLabelLit + uomDistanceLit + config.equalsLit);
    common.foldingSecondaryOffsetLabel().html(config.foldingSecondaryOffsetLabelLit + uomDistanceLit + config.equalsLit);
    common.focalPlaneToSecondaryDistanceLabel().html(config.focalPlaneToSecondaryDistanceLabelLit + uomDistanceLit + config.equalsLit);
    common.focalPointOffsetFromEdgeOfPrimaryLabel().html(config.focalPointOffsetFromEdgeOfPrimaryLabelLit + uomDistanceLit + config.equalsLit);
    common.tubeWeightLabel().html(config.tubeWeightLabelLit + uomWeightLit + config.equalsLit);
    common.rockerWeightLabel().html(config.rockerWeightLabelLit + uomWeightLit + config.equalsLit);
    common.CGToEyepieceDistanceLabel().html(config.CGToEyepieceDistanceLabelLit + uomDistanceLit + config.equalsLit);
    common.altBearingRadiusLabel().html(config.altBearingRadiusLabelLit + uomDistanceLit + config.equalsLit);
    common.azBearingRadiusLabel().html(config.azBearingRadiusLabelLit + uomDistanceLit + config.equalsLit);
    common.flexRockerCGToEyepieceDistanceLabel().html(config.CGToEyepieceDistanceLabelLit + uomDistanceLit + config.equalsLit);
    common.flexRockerTubeWeightLabel().html(config.tubeWeightLabelLit + uomWeightLit + config.equalsLit);
    common.flexRockerRockerWeightLabel().html(config.rockerWeightLabelLit + uomWeightLit + config.equalsLit);
    common.flexRockerCGToBackEdgeOfTubeClearanceLabel().html(config.flexRockerCGToBackEdgeOfTubeClearanceLit + uomDistanceLit + config.equalsLit);

    // replace field values with new uom values; uom state already switched

    common.aperture().val(roundToDecimal(common.apertureVal() * lengthConversionFactor, config.decimalPointsAperture));

    common.focuserRackedInHeight().val(roundToDecimal(common.focuserRackedInHeightVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.focuserTravel().val(roundToDecimal(common.focuserTravelVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.barrelTubeInsideDiameter().val(roundToDecimal(common.barrelTubeInsideDiameterVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.barrelTubeLength().val(roundToDecimal(common.barrelTubeLengthVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.focuserInwardFocusingDistance().val(roundToDecimal(common.focuserInwardFocusingDistanceVal() * lengthConversionFactor, config.decimalPointsFocuser));

    common.telescopeTubeOD().val(roundToDecimal(common.telescopeTubeODVal() * lengthConversionFactor, config.decimalPointsTube));
    common.telescopeTubeThickness().val(roundToDecimal(common.telescopeTubeThicknessVal() * lengthConversionFactor, config.decimalPointsTube));
    common.focalPlaneToDiagDistance().val(roundToDecimal(common.focalPlaneToDiagDistanceVal() * lengthConversionFactor, config.decimalPointsTube));

    common.diagSizes().val(diags);
    common.optimizedDiagSize().val(roundToDecimal(common.optimizedDiagSizeVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(common.focalPlaneToFocuserBarrelBottomDistanceVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.diagOffset().val(roundToDecimal(common.diagOffsetVal() * lengthConversionFactor, config.decimalPointsDiag));

    common.foldingSecondaryMirrorSize().val(roundToDecimal(common.foldingSecondaryMirrorSizeVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.foldingSecondaryOffset().val(roundToDecimal(common.foldingSecondaryOffsetVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.focalPointOffsetFromEdgeOfPrimary().val(roundToDecimal(common.focalPointOffsetFromEdgeOfPrimaryVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));

    updateTelescopeResults();

    weightElements = $('[name^=' + config.CGIDs[1] + ']');
    weightElements.each(function (i, v) {
        weight = parseFloat(v.value);
        if (!isNaN(weight)) {
            v.value = roundToDecimal(weight * weightConversionFactor, config.decimalPointsCG);
        }
    });

    distanceElements = $('[name^=' + config.CGIDs[2] + ']');
    distanceElements.each(function (i, v) {
        distance = parseFloat(v.value);
        if (!isNaN(distance)) {
            v.value = roundToDecimal(distance * lengthConversionFactor, config.decimalPointsCG);
        }
    });

    common.tubeWeight().val(roundToDecimal(common.tubeWeightVal() * weightConversionFactor, config.decimalPointsCG));
    common.rockerWeight().val(roundToDecimal(common.rockerWeightVal() * weightConversionFactor, config.decimalPointsCG));
    common.CGToEyepieceDistance().val(roundToDecimal(common.CGToEyepieceDistanceVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
    common.altBearingRadius().val(roundToDecimal(common.altBearingRadiusVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
    common.azBearingRadius().val(roundToDecimal(common.azBearingRadiusVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));

    common.flexRockerTubeWeight().val(roundToDecimal(common.flexRockerTubeWeightVal() * weightConversionFactor, config.decimalPointsCG));

    if (startup === undefined) {
        execChainStartDiagIllum();
    }
};

MLB.telescopeCriteriaCalc.buildEyepieceHtmlTable = function () {
    var config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        ix,
        htmlStr;

    for (ix = 0; ix < config.eyepieceRows; ix += 1) {
        htmlStr = "<tr>\r\n"
                + "<td><select id='" + config.EyeOptSelectID + ix + "'></select></td>\r\n"
                + "<td id='" + config.EyeOptManufacturerID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptTypeID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptFocalLengthID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptFieldStopID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptApparentFieldID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptExitPupilID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptFOVID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptMagnificationID + ix + "'></td>\r\n"
                + "<td id='" + config.EyeOptResolutionID + ix + "'></td>\r\n"
                + "</tr>\r\n";
        common.eyeOptTableBody().append(htmlStr);
    }
};

MLB.telescopeCriteriaCalc.buildSummaryEyepieceHtmlTable = function () {
    var config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        ix,
        htmlStr;

    for (ix = 0; ix < config.eyepieceRows; ix += 1) {
        htmlStr = "<tr>\r\n"
                + "<td id='" + config.summaryEyeOptManufacturerID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptTypeID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptFocalLengthID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptFieldStopID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptApparentFieldID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptExitPupilID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptFOVID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptMagnificationID + ix + "'></td>\r\n"
                + "<td id='" + config.summaryEyeOptResolutionID + ix + "'></td>\r\n"
                + "</tr>\r\n";
        common.summaryEyeOptTableBody().append(htmlStr);
    }
};

MLB.telescopeCriteriaCalc.seedComaCorrector = function (manufacturer, model) {
    var common = MLB.telescopeCriteriaCalc.common,
        setSelectedComaCorrector = MLB.telescopeCriteriaCalc.setSelectedComaCorrector,
        comaCorrectorsJson = MLB.comaCorrectorsJson,
        e,
        row;

    common.comaCorrectorSelect().val(manufacturer + ' ' + model);

    for (row = 0; row < comaCorrectorsJson.comaCorrectors.length; row += 1) {
        e = comaCorrectorsJson.comaCorrectors[row];
        if (e.manufacturer === manufacturer && e.model === model) {
            break;
        }
    }
    setSelectedComaCorrector(row);
};

MLB.telescopeCriteriaCalc.seedEyepiece = function (manufacturer, type, focalLengthmm) {
    var config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
        eyepiecesJson = MLB.eyepiecesJson,
        e,
        row;

    common.eyepieceSelect().val(manufacturer + ' ' + type + ' ' + focalLengthmm + config.mmLitNS);
    for (row = 0; row < eyepiecesJson.eyepieces.length; row += 1) {
        e = eyepiecesJson.eyepieces[row];
        if (e.manufacturer === manufacturer && e.type === type && e.focalLengthmm === focalLengthmm) {
            break;
        }
    }
    setSelectedEyepiece(row);
};

MLB.telescopeCriteriaCalc.seedEyeOptEyepiece = function (idIx, manufacturer, type, focalLengthmm) {
    var config = MLB.telescopeCriteriaCalc.config,
        setEyeOptSelectedEyepiece = MLB.telescopeCriteriaCalc.setEyeOptSelectedEyepiece,
        eyepiecesJson = MLB.eyepiecesJson,
        e,
        row;

    $('#' + config.EyeOptSelectID + idIx).val(manufacturer + ' ' + type + ' ' + focalLengthmm + config.mmLitNS);
    for (row = 0; row < eyepiecesJson.eyepieces.length; row += 1) {
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

    for (row = 0; row < focusersJson.focusers.length; row += 1) {
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

MLB.telescopeCriteriaCalc.seedMaterialFrictions = function () {
    var common = MLB.telescopeCriteriaCalc.common,
        selectedMaterialPairing = MLB.materialFrictionJson.materials[1];

    common.altBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
    common.azBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
    common.flexRockerAltBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
    common.flexRockerAzBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
};

MLB.telescopeCriteriaCalc.writeSummary = function (startup) {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.telescopeCriteriaCalc.state,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        offaxisMask = state.offaxisMask,
        baffle = state.baffle,
        projectedFocuserBaffle = state.projectedFocuserBaffle,
        CG = state.CG,
        friction = state.friction,
        rocker = state.rocker,
        flexRocker = state.flexRocker,
        uomLengthLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        getComaCorrectorMagnificationFactor = MLB.telescopeCriteriaCalc.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        limitingMagnitude = MLB.calcLib.limitingMagnitude,
        highMagnificationMagnitudeLimit = limitingMagnitude(common.apertureInchesVal()),
        lowMagnificationMagnitudeLimit = highMagnificationMagnitudeLimit - 1,
        calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
        theoreticalResolutionArcsec = calcTheoreticalResolutionArcsec(common.apertureInchesVal()),
        focalRatio,
        eyepieceFieldStopmm,
        optComaCorrectorStr,
        eyePupilmm,
        magnification,
        calcMaxMagnification = MLB.calcLib.calcMaxMagnification,
        calcMinMagnification = MLB.calcLib.calcMinMagnification,
        focalPlaneToDiagDistance,
        diagSize,
        offset,
        calcDiagOffset3 = MLB.calcLib.calcDiagOffset3,
        graphSummaryDiagIllum = MLB.telescopeCriteriaCalc.graphSummaryDiagIllum,
        ix,
        calcSagitta = MLB.calcLib.calcSagitta,
        sagitta,
        roundedPadSizeSideUom,
        roundedFlexRockerPadSizeSideUom;

    common.summaryMagnitudeLimit().html(roundToDecimal(lowMagnificationMagnitudeLimit, config.decimalPointsLimitingMagnitude)
            + ' to '
            + roundToDecimal(highMagnificationMagnitudeLimit, config.decimalPointsLimitingMagnitude)
            + ' magnitudes');
    common.summaryRadiance().html(roundToDecimal(state.radiance, config.decimalPointsRadiance) + ' magnitudes');
    common.summaryDawesLimit().html(roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution) + ' arc seconds');
    common.summaryLuminance().html(roundToDecimal(state.luminance, config.decimalPointsLuminance) + config.luminanceLit);
    common.summaryVignettedLuminance().html(roundToDecimal(state.vignettedLuminance, config.decimalPointsLuminance) + config.luminanceLit);
    common.summaryVignettedLuminanceRadiancePerWeight().html(roundToDecimal(state.radiancevignettedLuminancePerWeight, config.decimalPointsRadiance) + config.radianceLuminancePerWeightLit);

    common.summaryAperture().html(common.apertureVal() + uomLengthLit);
    focalRatio = common.focalRatioVal();
    common.summaryFocalRatio().html(focalRatio);
    common.summaryTelescopeFocalLength().html(roundToDecimal(common.focalRatioVal() * common.apertureVal(), config.decimalPointsTelescopeFocalLength) + uomLengthLit);

    common.summaryOptimizedEyepiece().html(common.eyepieceSelect().val());
    common.summaryOptimizedEyepieceFocalLength().html(common.eyepieceFocalLengthmmVal() + config.mmLitNS);
    common.summaryOptimizedEyepieceApparentField().html(common.eyepieceApparentFielddegVal() + config.degLit);
    eyepieceFieldStopmm = common.eyepieceFieldStopmmVal();
    common.summaryOptimizedEyepieceFieldStop().html(eyepieceFieldStopmm + config.mmLitNS);

    if (common.useComaCorrectorMagVal()) {
        optComaCorrectorStr = common.comaCorrectorSelect().val()
                + '; magnification factor = '
                + common.comaCorrectorMagVal()
                + 'x';
    } else {
        optComaCorrectorStr = 'not used';
    }
    common.summaryComaCorrector().html(optComaCorrectorStr);
    common.summaryComaFreeDiameter().html(roundToDecimal(state.comaFreeDia, config.decimalPointsComaFreeDiameter) + uomLengthLit);

    eyePupilmm = common.eyepieceFocalLengthmmVal() / common.focalRatioVal() / comaCorrectorMag;
    common.summaryEyePupil().html(roundToDecimal(eyePupilmm, config.decimalPointsEyePupil) + config.mmLitNS);
    common.summaryFOV().html(common.FOVdegVal() + config.degLit);
    magnification = common.apertureInchesVal() / common.eyePupilmmVal() * 25.4;
    common.summaryMagnification().html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
    common.summaryUsefulMagnification().html(roundToDecimal(calcMinMagnification(common.apertureInchesVal()), config.decimalPointsMagnification) + 'x to ' + roundToDecimal(calcMaxMagnification(common.apertureInchesVal()), config.decimalPointsMagnification) + 'x');

    focalPlaneToDiagDistance = +common.focalPlaneToDiagDistance().val();
    common.summaryFocalPlaneToDiagonalDistance().html(focalPlaneToDiagDistance + uomLengthLit);
    diagSize = common.optimizedDiagSizeVal();
    common.summaryDiagonalSize().html(diagSize + uomLengthLit);
    offset = calcDiagOffset3(diagSize, focalPlaneToDiagDistance);
    common.summaryDiagOffset().html(roundToDecimal(offset, config.decimalPointsDiag) + uomLengthLit);
    common.summaryFocuser().html(common.focuserSelect().val());
    common.summaryFocuserRackedInHeight().html(common.focuserRackedInHeightVal() + uomLengthLit);
    common.summaryFocuserTravel().html(common.focuserTravelVal() + uomLengthLit);
    common.summaryBarrelTubeInsideDiameter().html(common.barrelTubeInsideDiameterVal() + uomLengthLit);
    common.summaryBarrelTubeLength().html(common.barrelTubeLengthVal() + uomLengthLit);
    common.summaryFocuserInwardFocusingDistance().html(common.focuserInwardFocusingDistanceVal() + uomLengthLit);
    common.summaryFocusingTolerance().html(roundToDecimal(state.focusingTolerance, config.focusingTolerance) + uomLengthLit);

    for (ix = 0; ix < config.eyepieceRows; ix += 1) {
        common.tableElement(config.summaryEyeOptManufacturerID, ix).html(common.tableElement(config.EyeOptManufacturerID, ix).html());
        common.tableElement(config.summaryEyeOptTypeID, ix).html(common.tableElement(config.EyeOptTypeID, ix).html());
        common.tableElement(config.summaryEyeOptFocalLengthID, ix).html(common.tableElement(config.EyeOptFocalLengthID, ix).html());
        common.tableElement(config.summaryEyeOptFieldStopID, ix).html(common.tableElement(config.EyeOptFieldStopID, ix).html());
        common.tableElement(config.summaryEyeOptExitPupilID, ix).html(common.tableElement(config.EyeOptExitPupilID, ix).html());
        common.tableElement(config.summaryEyeOptApparentFieldID, ix).html(common.tableElement(config.EyeOptApparentFieldID, ix).html());
        common.tableElement(config.summaryEyeOptFOVID, ix).html(common.tableElement(config.decimalPointsFOV, ix).html());
        common.tableElement(config.summaryEyeOptMagnificationID, ix).html(common.tableElement(config.EyeOptMagnificationID, ix).html());
        common.tableElement(config.summaryEyeOptResolutionID, ix).html(common.tableElement(config.EyeOptResolutionID, ix).html());
    }

    common.summaryTelescopeTubeOD().html(common.telescopeTubeODVal() + uomLengthLit);
    common.summaryTelescopeTubeThickness().html(common.telescopeTubeThicknessVal() + uomLengthLit);
    sagitta = calcSagitta(common.apertureVal(), common.focalRatioVal());
    common.summaryMirrorSagita().html(roundToDecimal(sagitta, config.decimalPointsDimension) + uomLengthLit);

    common.summaryOffaxisMaskDia().html(roundToDecimal(offaxisMask.offaxisMaskDia, config.decimalPointsDimension) + uomLengthLit);
    common.summaryOffaxisMaskHighestMagnification().html(roundToDecimal(offaxisMask.highestMagnification, config.decimalPointsMagnification) + 'x');
    common.summaryOffaxisMaskResolution().html(roundToDecimal(offaxisMask.theoreticalResolutionArcsec, config.decimalPointsResolution) + ' arc seconds');
    common.summaryOffaxisMaskMagnitudeLimit().html(roundToDecimal(offaxisMask.magnitudeLimit, config.decimalPointsLimitingMagnitude));

    common.summaryBaffleOppositeFocuserDia().html(roundToDecimal(baffle.oppositeFocuserDia, config.decimalPointsDimension) + uomLengthLit);

    common.summaryTiltedBaffleOppositeFocuserDia().html('tilt = '
            + roundToDecimal(projectedFocuserBaffle.tiltAngleDeg, config.decimalPointsDimension)
            + ' deg; tilted lengths = '
            + roundToDecimal(projectedFocuserBaffle.tiltedDistance, config.decimalPointsDimension)
            + uomLengthLit);

    common.summaryBafflePrimaryMirrorExtension().html(roundToDecimal(baffle.primaryMirrorExtension, config.decimalPointsDimension) + uomLengthLit);

    common.summaryLowriderPrimaryMirrorFrontEdgeToEyepiece().html(roundToDecimal(state.lowRiderModel.focalPointToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit);
    common.summaryLowriderPrimaryMirrorFrontEdgeToFoldingMirror().html(roundToDecimal(state.lowRiderModel.diagToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit);
    common.summaryLowriderPrimaryMirrorFrontEdgeToEndOfTube().html(roundToDecimal(state.lowRiderModel.frontEndOfTubeToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit);
    common.summaryLowriderBendingAngle().html(roundToDecimal(state.lowRiderModel.elbowAngleDeg, config.decimalPointsDimension) + config.degLit);
    common.summaryLowriderFoldingMirrorSize().html(roundToDecimal(common.foldingSecondaryMirrorSizeVal(), config.decimalPointsDimension)
            + uomLengthLit
            + ' x '
            + roundToDecimal(state.lowRiderModel.diagMajorAxisSize, config.decimalPointsDimension)
            + uomLengthLit);

    common.summaryOTAWeight().html(common.tubeWeightVal() + uomWeightLit);
    common.summaryMountWeight().html(common.rockerWeightVal() + uomWeightLit);
    common.summaryTotalWeight().html((+common.tubeWeightVal()) + (+common.rockerWeightVal()) + uomWeightLit);
    common.summaryCG().html(roundToDecimal(CG.CG, config.decimalPointsCG) + uomLengthLit);
    common.summaryCGSensitivity().html(roundToDecimal(CG.sensitivity, config.decimalPointsCG)
            + uomLengthLit
            + ' for a 1 '
            + uomWeightLit
            + ' change at the eyepiece');
    common.summaryCGToEyepieceDistance().html(common.CGToEyepieceDistanceVal() + uomLengthLit);
    common.summaryCGToTubeBackCornerDistance().html(roundToDecimal(CG.heightToClearRockerBottomDistance, config.decimalPointsCG) + uomLengthLit);

    common.summaryRockerDimensions().html(roundToDecimal(rocker.width, config.decimalPointsDimension)
            + uomLengthLit
            + ' wide by '
            + roundToDecimal(rocker.length, config.decimalPointsDimension)
            + uomLengthLit
            + ' long by '
            + roundToDecimal(rocker.height, config.decimalPointsDimension)
            + uomLengthLit
            + ' high');
    common.summaryAltFrictionAtEyepiece().html(roundToDecimal(friction.alt, config.decimalPointsTelescopeFocalLength) + uomWeightLit);
    common.summaryAzFrictionAtEyepiece().html(roundToDecimal(friction.az, config.decimalPointsTelescopeFocalLength) + uomWeightLit);
    roundedPadSizeSideUom = roundToDecimal(friction.padSizeSideUom, config.decimalPointsCG);
    common.summaryAzPadSize().html(roundedPadSizeSideUom
            + uomLengthLit
            + ' x '
            + roundedPadSizeSideUom
            + uomLengthLit);

    common.summaryFlexRockerRockerDimensions().html(roundToDecimal(flexRocker.rocker.length, config.decimalPointsDimension)
            + uomLengthLit
            + ' long by '
            + roundToDecimal(flexRocker.rocker.width, config.decimalPointsDimension)
            + uomLengthLit
            + ' wide by '
            + roundToDecimal(flexRocker.rocker.thickness, config.decimalPointsDimension)
            + uomLengthLit
            + ' thick');
    common.summaryFlexRockerBaseRingDimensions().html(roundToDecimal(flexRocker.baseRing.innerRadius * 2, config.decimalPointsDimension)
            + uomLengthLit
            + ' inner diameter by '
            + roundToDecimal(flexRocker.baseRing.outerRadius * 2, config.decimalPointsDimension)
            + uomLengthLit
            + ' outer diameter by '
            + roundToDecimal(flexRocker.baseRing.height, config.decimalPointsDimension)
            + uomLengthLit
            + ' high');
    common.summaryFlexRockerAltFrictionAtEyepiece().html(roundToDecimal(flexRocker.friction.alt, config.decimalPointsTelescopeFocalLength) + uomWeightLit);
    common.summaryFlexRockerAzFrictionAtEyepiece().html(roundToDecimal(flexRocker.friction.az, config.decimalPointsTelescopeFocalLength) + uomWeightLit);
    roundedFlexRockerPadSizeSideUom = roundToDecimal(flexRocker.friction.padSizeSideUom, config.decimalPointsCG);
    common.summaryFlexRockerAzPadSize().html(roundedFlexRockerPadSizeSideUom
            + uomLengthLit
            + ' x '
            + roundedFlexRockerPadSizeSideUom
            + uomLengthLit);

    if (startup === undefined) {
        graphSummaryDiagIllum();
    }
};

$(window).ready(function () {
    var buildEyepieceHtmlTable = MLB.telescopeCriteriaCalc.buildEyepieceHtmlTable,
        buildSummaryEyepieceHtmlTable = MLB.telescopeCriteriaCalc.buildSummaryEyepieceHtmlTable,
        calcAperture = MLB.telescopeCriteriaCalc.calcAperture,
        calcFocalRatio = MLB.telescopeCriteriaCalc.calcFocalRatio,
        calcFOV = MLB.telescopeCriteriaCalc.calcFOV,
        calcEyePupil = MLB.telescopeCriteriaCalc.calcEyePupil,
        calcEyepieceWidestFieldFromFocalRatio_EyePupil = MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldFromFocalRatio_EyePupil,
        calcEyepieceWidestFieldForEyePupil = MLB.telescopeCriteriaCalc.calcEyepieceWidestFieldForEyePupil,
        calcEyepieceFocalLength = MLB.telescopeCriteriaCalc.calcEyepieceFocalLength,
        calcEyepieceFieldStop = MLB.telescopeCriteriaCalc.calcEyepieceFieldStop,
        calcEyepieceFocalLengthFromFocalRatioEyePupil = MLB.telescopeCriteriaCalc.calcEyepieceFocalLengthFromFocalRatioEyePupil,
        updateFollowOnFieldsStrategy = MLB.telescopeCriteriaCalc.updateFollowOnFieldsStrategy,
        calcEyepieceFieldStopFromApparentFOV_EyepieceFL = MLB.telescopeCriteriaCalc.calcEyepieceFieldStopFromApparentFOV_EyepieceFL,
        calcApertureFromLimitingMagnitude = MLB.telescopeCriteriaCalc.calcApertureFromLimitingMagnitude,
        processCalculatorType = MLB.telescopeCriteriaCalc.processCalculatorType,
        buildCGHtmlTable = MLB.telescopeCriteriaCalc.buildCGHtmlTable,
        processUomChange = MLB.telescopeCriteriaCalc.processUomChange,
        execChainStartDiagIllum = MLB.telescopeCriteriaCalc.execChainStartDiagIllum,
        execChainStartBaffles = MLB.telescopeCriteriaCalc.execChainStartBaffles,
        execChainStartCalcCG = MLB.telescopeCriteriaCalc.execChainStartCalcCG,
        execChainStartFrictionOfMovemnet = MLB.telescopeCriteriaCalc.execChainStartFrictionOfMovemnet,
        execChainStartFlexRocker = MLB.telescopeCriteriaCalc.execChainStartFlexRocker,
        execChainStartEquatorialTable = MLB.telescopeCriteriaCalc.execChainStartEquatorialTable,
        seedCGTable = MLB.telescopeCriteriaCalc.seedCGTable,
        graphDiagIllum = MLB.telescopeCriteriaCalc.graphDiagIllum,
        graphSummaryDiagIllum = MLB.telescopeCriteriaCalc.graphSummaryDiagIllum,
        graphLowRider = MLB.telescopeCriteriaCalc.graphLowRider,
        calcMinFoldingMirrorSize = MLB.telescopeCriteriaCalc.calcMinFoldingMirrorSize,
        calcFoldingSecondaryOffset = MLB.telescopeCriteriaCalc.calcFoldingSecondaryOffset,
        calcMinFocalPlaneToSecondaryDistance = MLB.telescopeCriteriaCalc.calcMinFocalPlaneToSecondaryDistance,
        setSelectedComaCorrector = MLB.telescopeCriteriaCalc.setSelectedComaCorrector,
        setSelectedEyepiece = MLB.telescopeCriteriaCalc.setSelectedEyepiece,
        setSelectedFocuser = MLB.telescopeCriteriaCalc.setSelectedFocuser,
        setEyeOptSelectedEyepiece = MLB.telescopeCriteriaCalc.setEyeOptSelectedEyepiece,
        seedComaCorrector = MLB.telescopeCriteriaCalc.seedComaCorrector,
        seedEyepiece = MLB.telescopeCriteriaCalc.seedEyepiece,
        seedEyeOptEyepiece = MLB.telescopeCriteriaCalc.seedEyeOptEyepiece,
        seedFocuser = MLB.telescopeCriteriaCalc.seedFocuser,
        seedMaterialFrictions = MLB.telescopeCriteriaCalc.seedMaterialFrictions,
        config = MLB.telescopeCriteriaCalc.config,
        common = MLB.telescopeCriteriaCalc.common,
        comaCorrectorsJson = MLB.comaCorrectorsJson,
        eyepiecesJson = MLB.eyepiecesJson,
        focusersJson = MLB.focusersJson,
        materialFrictionJson = MLB.materialFrictionJson,
        comaCorrectorStr,
        eyepieceStr,
        focuserStr,
        materialPairingStr,
        optionStr,
        ix;

    // event hookups/subscribes...
    common.btnCalcAperture().click(calcAperture);
    common.btnCalcFocalRatio().click(calcFocalRatio);
    common.btnCalcFOV().click(calcFOV);
    common.btnCalcEyePupil().click(calcEyePupil);
    common.btnCalcEyepieceWidestFieldFromFocalRatio_EyePupil().click(calcEyepieceWidestFieldFromFocalRatio_EyePupil);
    common.btnCalcEyepieceWidestFieldForEyePupil().click(calcEyepieceWidestFieldForEyePupil);
    common.btnCalcEyepieceFocalLength().click(calcEyepieceFocalLength);
    common.btnCalcEyepieceFieldStop().click(calcEyepieceFieldStop);
    common.btnCalcEyepieceFocalLengthFromFocalRatioEyePupil().click(calcEyepieceFocalLengthFromFocalRatioEyePupil);
    common.btnCalcEyepieceFieldStopFromApparentFOV_EyepieceFocalLength().click(calcEyepieceFieldStopFromApparentFOV_EyepieceFL);
    common.btnCalcApertureFromLimitingMagnitude().click(calcApertureFromLimitingMagnitude);
    common.radBtnFocalRatioOrEyePupil_EyepieceFocalLength().click(processCalculatorType);
    common.btnUpdateFoldingReflector().click(graphLowRider);
    common.btnCalcMinFoldingMirrorSize().click(calcMinFoldingMirrorSize);
    common.btnCalcFoldingSecondaryOffset().click(calcFoldingSecondaryOffset);
    common.btnCalcMinFocalPlaneToSecondaryDistance().click(calcMinFocalPlaneToSecondaryDistance);
    // if .click(foo) then event passed to function as a parm which we don't want here because function has optional parms
    common.btnUom().click(function () {
        processUomChange();
    });
    common.btnUpdateDiagIllum().click(function () {
        execChainStartDiagIllum();
    });
    common.btnUpdateBaffles().click(function () {
        execChainStartBaffles();
    });
    common.btnCalcCG().click(function () {
        execChainStartCalcCG();
    });
    common.btnUpdateFrictionOfMovement().click(function () {
        execChainStartFrictionOfMovemnet();
    });
    common.btnUpdateFlexRocker().click(function () {
        execChainStartFlexRocker();
    });
    common.btnUpdateET().click(function () {
        execChainStartEquatorialTable();
    });

    /* add click event to discussionHeaders to toggle discussionDetails; css hides discussionDetails to begin
       by convention, html links headers to details by postpending a number like this:
        <div class='discussionHeader' ID='discussionHeader0'>
        <div class='discussionDetail' ID='discussionDetail0'>
    */
    $('[id^=discussionHeader').each(function (idIx) {
        $(this).click(function () {
            $('[id=discussionDetail' + idIx + ']').toggle();
            // return false to keep page focused at current location
            return false;
        });
    });

    // ditto for the individual optimizers...
    $('[id^=optimizerHeader').each(function (idIx) {
        $(this).click(function () {
            var element = $('[id=optimizerDetail' + idIx + ']');
            element.toggle();
            // the diagonal chart must be plotted after the div is displayed
            if (idIx === config.optimizerHeaderDiagonal && element.is(':visible')) {
                graphDiagIllum();
            }
            // ditto for the diagonal chart in the optimizer summary section
            if (idIx === config.optimizerHeaderSummary && element.is(':visible')) {
                graphSummaryDiagIllum();
            }
            // return false to keep page focused at current location
            return false;
        });
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
                return xFL > yFL
                    ? -1
                    : xFL < yFL
                        ? 1
                        : 0;
            }
            return x.type > y.type
                ? 1
                : -1;
        }
        return x.manufacturer > y.manufacturer
            ? 1
            : -1;
    });

    buildEyepieceHtmlTable();
    // fill select eyepiece drop down box and eyepiece optimizer table rows
    $.each(eyepiecesJson.eyepieces, function (i, v) {
        // fill in missing field stops
        if (v.fieldStopmm === '') {
            v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
        }
        eyepieceStr = v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + config.mmLitNS;
        optionStr = '<option value="' + eyepieceStr + '">' + eyepieceStr + '</option>';
        // eyepiece drop down box for telescope optimizer
        common.eyepieceSelect().append(optionStr);
        // drop down boxes for eyepiece optimizer
        for (ix = 0; ix < config.eyepieceRows; ix += 1) {
            $('#' + config.EyeOptSelectID + ix).append(optionStr);
        }
    });
    // wire up selected eyepiece change for telescope optimizer
    common.eyepieceSelect().change(function () {
        setSelectedEyepiece(this.selectedIndex);
    });
    // wire up selected eyepiece change for eyepiece optimizer
    $('[id^=' + config.EyeOptSelectID + ']').each(function (idIx) {
        $(this).change(function (e) {
            setEyeOptSelectedEyepiece(idIx, e.currentTarget.selectedIndex);
        });
    });
    buildSummaryEyepieceHtmlTable();

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

    // fill select alt/az materials
    $.each(materialFrictionJson.materials, function (i, v) {
        materialPairingStr = v.materialPairing + ' ' + v.friction;
        optionStr = '<option value="' + materialPairingStr + '">' + materialPairingStr + '</option>';
        common.altBearingMaterialsSelect().append(optionStr);
        common.azBearingMaterialsSelect().append(optionStr);
        common.flexRockerAltBearingMaterialsSelect().append(optionStr);
        common.flexRockerAzBearingMaterialsSelect().append(optionStr);
    });

    buildCGHtmlTable();
    processCalculatorType();
    seedComaCorrector('TeleVue', 'Paracorr II');
    seedEyepiece('Explore Scientific', '82 series', '24');
    seedEyeOptEyepiece(0, 'Celestron', 'Axiom', '40');
    seedEyeOptEyepiece(1, 'TeleVue', 'Ethos', '17');
    seedEyeOptEyepiece(2, 'Clave', 'Plossl', '6');
    seedFocuser('MoonLite', 'CR 1.5');
    seedCGTable();
    seedMaterialFrictions();
    // must wait for seeded focuser et al
    processUomChange('startup');
    updateFollowOnFieldsStrategy('startup');
});

// end of file