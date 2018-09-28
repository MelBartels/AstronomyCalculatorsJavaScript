/*global
    MLB,$,window,alert,document
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2016 - 2018

'use strict';

MLB.NewtDesigner = {};

MLB.NewtDesigner.state = {
    currentBtnSelect: undefined,
    currentDesigner: undefined,
    sliderFocalRatio: undefined,
    lastFocalRatio: 5,
    sliderAperture: undefined,
    lastAperture: 10,

    eyeOptRowSet: [],
    diagSize: undefined,
    minDiag: undefined,
    maxIllumDiag: undefined,
    evenIllumDiag: undefined,
    diagOffset: undefined,
    scalingFactor: undefined,
    mirrorFrontEdgeToFocalPlaneDistance: undefined,
    tubeBackEndToFocalPlaneDistance: undefined,
    lowriderModel: {},
    CG: {},
    rocker: {},
    flexRocker: {}
};

MLB.NewtDesigner.config = {

    // designers

    btnSelectTelescopeLit: 'btnSelectTelescope',
    btnSelectEyepiecesLit: 'btnSelectEyepieces',
    btnSelectDiagonalLit: 'btnSelectDiagonal',
    btnSelectBafflingLit: 'btnSelectBaffling',
    btnSelectLowriderBafflingLit: 'btnSelectLowriderBaffling',
    btnSelectTubeLit: 'btnSelectTube',
    btnSelectRockerLit: 'btnSelectRocker',
    btnSelectFlexRockerLit: 'btnSelectFlexRocker',
    btnSelectETLit: 'btnSelectET',

    designTelescopeLit: 'designTelescope',
    designEyepiecesLit: 'designEyepieces',
    designDiagonalLit: 'designDiagonal',
    designBafflingLit: 'designBaffling',
    designLowriderBafflingLit: 'designLowriderBaffling',
    designTubeLit: 'designTube',
    designRockertLit: 'designRocker',
    designFlexRockertLit: 'designFlexRocker',
    designETLit: 'designET',

    diagSharedParmsLit: 'diagSharedParms',

    btnSelectSelectedBackground: 'grey',
    btnSelectNotSelectedBackground: 'lightgrey',

    // uoms

    lbsLit: ' (lbs)',
    kgLit: ' (kg)',
    inchesLit: ' (inches)',
    sqrFtLit: ' ft^2',
    sqrMeterLit: ' m^2',
    mmLit: ' (mm)',
    mmLitNS: 'mm',
    degLit: ' deg',
    degLitNS: 'deg',
    etendueLit: ' cm^2deg^2',
    comaRMSLit: ' WavesRMS',
    etendueParensLit: ' (cm^2deg^2)',
    brightnessEtenduePerWeightLit: ' cm^2deg^2/kg',

    // labels

    focalPlaneToDiagDistanceLabelLit: 'Focal plane to diagonal distance',
    maxFieldDiaDiagLabelLit: ' Max field diameter',
    diagSizesLabelLit: 'Sizes (m.a.) to select from are',
    optimizedDiagSizeLabelLit: 'Diagonal (m.a.) size',
    focalPlaneToFocuserBarrelBottomDistanceLabelLit: 'Focal plane to bottom of focuser barrel distance',
    diagOffsetLabelLit: 'Diagonal offset (towards primary mirror and away from focuser)',
    focuserRackedInHeightLabelLit: 'Racked in height',
    focuserTravelLabelLit: 'Focuser tube travel',
    barrelTubeInsideDiameterLabelLit: 'Barrel tube inside diameter',
    barrelTubeLengthLabelLit: 'Barrel tube length',
    focuserInwardFocusingDistanceLabelLit: 'Desired inward focusing distance',
    tubeODLabelLit: 'Outside diameter',
    tubeThicknessLabelLit: 'Thickness',
    lowriderSecondaryMirrorSizeLabelLit: 'Folding secondary mirror size (m.a.)',
    lowriderSecondaryOffsetLabelLit: 'Folding mirror offset (towards primary mirror and away from focuser)',
    focalPlaneToSecondaryDistanceLabelLit: 'Focal plane to folding secondary mirror distance',
    focalPointOffsetFromEdgeOfPrimaryLabelLit: 'Focal point offset from top edge of primary',
    tubeWeightLabelLit: 'Tube weight',
    CGToEyepieceDistanceLabelLit: 'Center of gravity to eyepiece distance',
    flexRockerCGToBackEdgeOfTubeClearanceLit: 'Center of gravity to back edge of tube distance',
    altBearingRadiusLabelLit: 'Altitude bearing radius',
    azBearingRadiusLabelLit: 'Azimuth bearing radius',

    // views

    sideViewLit: 'Side view',
    frontViewLit: 'Front view',
    topViewLit: 'Top view',

    // save/retrieve data

    NewtDesignerLit: 'NewtDesigner ',
    eyepieceSortManufacturerLit: 'manufacturer',
    eyepieceSortFocalLengthLit: 'focal length',

    // diagonal error msgs

    diagTooSmallErrMsg: 'Secondary too small or focal plane to secondary distance too long.',
    focalPointToDiagTooLongErrMsg: 'Focal point to folding secondary mirror distance too long, or focal point offset from edge of primary mirror too long.',
    cannotBaffleErrMsg: 'Cannot construct a baffle: folding angle too acute.',
    noResults: 'none',

    // eyepiece table

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
    EyeOptLimitingMagnitudeID: 'EyeOptLimitingMagnitude',
    EyeOpEtendueID: 'EyeOptEtendue',
    EyeOptComaID: 'EyeOptComa',

    btnRemoveEyepieceRowLit: 'btnRemoveEyepieceRow',

    // testing purposes

    drawCanvasOutline: false,
    drawTestLines: false,

    maxPupil: 7,
    // allowance for diagonal sizing calcs
    diagTooSmallAllowance: 0.01,
    focusingTolerance: 4,

    // display decimal points

    decimalPointsAperture: 2,
    decimalPointsLimitingMagnitude: 1,
    decimalPointsFocalRatio: 2,
    decimalPointsFocalLength: 2,
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
    decimalPointsPercent: 1,
    decimalPointsDimension: 2,
    decimalPointSagitta: 4,
    decimalPointsAngle: 1,
    decimalPointsCG: 1,
    decimalPointsWeight: 1,
    decimalPointsEtendue: 0,
    decimalPointsRadiance: 1,
    decimalPointsComaFreeDiameter: 3,
    decimalPointsMaterialArea: 1,
    decimalPointsComaRMS: 1,

    // min, max, step for aperture slider

    sliderApertureUOMRange: [[4, 42, 0.1], [100, 1100, 25]],

    // # of eyepiece rows in eyepiece table

    eyepieceRows: 10,

    // starting diagonal sizes

    diagonalsInches: [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12],
    diagonalsMm: [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300],

    // drawing values

    baffleCanvasWidth: 1000,
    baffleCanvasHeight: 400,
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

    // drawing text

    projectedFocuserBaffleDimensionText: 'baffle dia = ',
    primaryMirrorBaffleDimensionText: 'baffle length = ',
    primaryMirrorToFocalPlaneDimensionText: 'primary mirror front edge to eyepiece = ',
    primaryMirrorToTubeEndDimensionText: 'primary mirror front edge to end of tube = ',
    primaryMirrorToFoldingMirrorText: 'primary mirror front edge to folding mirror = ',
    altitudeBearingSeparation: 'bearing separation = ',
    rockerSideLengthText: 'side board length = ',
    rockerSideHeightText: 'side board height = ',
    bearingHeightText: 'bearing height = ',
    centerOfGravityText: 'center of gravity',
    rockerFrontBoardWidthText: 'front board width = ',
    rockerFrontBoardHeightText: 'front board height = ',
    flexRockerBaseRingInnerDiaText: 'base ring inner diameter = ',
    flexRockerBaseRingOuterDiaText: 'base ring outer diameter = ',
    flexRockerLengthText: 'rocker inner length = ',
    flexRockerBaseRingHeightText: 'base ring height = ',
    flexRockerWidthText: 'rocker inner width = ',
    flexRockerCGHeight: 'tube CG height = ',
    flexRockerTubeSwingText: 'tube swing radius = ',

    // difference in limiting magnitude between lowest power (7mm pupil) and high power (2mm pupil)
    magnitudeLossDueToSkyBrightness: 1.5,
    nightTimeEyePupilInches: 0.25,
    focusingToleranceInchesF1: 0.000043,

    primaryMirrorThicknessInches: 1.5,
    primaryMirrorCellThicknessInches: 2,
    woodThicknessInches: 0.5,
    // 3/4" plywood weighs 2.2 lbs per square foot; 3/4" ply ft^2 is 1/16 of a cubic foot, so weight for a full cubic foot = 2.2*16~35
    woodLbsPerCubicFt: 35,
    // 1' x 1' x 1" thick glass weighs 13 lbs, conversion factor is 0.09
    glassLbsPer144CubicInches: 0.09,
    pushAngleDegFromHorizontal: 48,
    frictionOfMovementPadIdealPSI: 15,
    padThicknessInches: 0.25,
    altRimThicknessInches: 1.5,
    flexRockerBaseRingWidthFactor: 1.2,
    flexRockerThicknessInches: 1,

    // starting weights

    weights: {
        mirrorMount: 3,
        tube: 12,
        focuser: 1,
        diagonal: 1,
        spider: 1,
        eyepiece: 1
    },

    // CG table

    CGParts: ['Primary mirror', 'Mirror mount', 'Tube', 'Altitude bearings', 'Mirror box', 'Truss tubes', 'Upper end', 'Focuser', 'Diagonal', 'Spider', 'Eyepiece', 'Finder', '(enter name)', '(enter name)', '(enter name)'],
    CGIxs: {
        primaryMirror: 0,
        mirrorMount: 1,
        tube: 2,
        altitudeBearings: 3,
        mirrorBox: 4,
        trussTubes: 5,
        upperEnd: 6,
        focuser: 7,
        diagonal: 8,
        spider: 9,
        eyepiece: 10
    },
    CGIDs: ['CGPart', 'CGWeight', 'CGDistance']
};

MLB.NewtDesigner.common = {
    config: MLB.NewtDesigner.config,

    // designers

    btnSelectTelescope: function () {
        return $('[id=' + this.config.btnSelectTelescopeLit + ']');
    },
    btnSelectEyepieces: function () {
        return $('[id=' + this.config.btnSelectEyepiecesLit + ']');
    },
    btnSelectDiagonal: function () {
        return $('[id=' + this.config.btnSelectDiagonalLit + ']');
    },
    btnSelectBaffling: function () {
        return $('[id=' + this.config.btnSelectBafflingLit + ']');
    },
    btnSelectLowriderBaffling: function () {
        return $('[id=' + this.config.btnSelectLowriderBafflingLit + ']');
    },
    btnSelectTube: function () {
        return $('[id=' + this.config.btnSelectTubeLit + ']');
    },
    btnSelectRocker: function () {
        return $('[id=' + this.config.btnSelectRockerLit + ']');
    },
    btnSelectFlexRocker: function () {
        return $('[id=' + this.config.btnSelectFlexRockerLit + ']');
    },
    btnSelectET: function () {
        return $('[id=' + this.config.btnSelectETLit + ']');
    },
    designTelescope: function () {
        return $('[id=' + this.config.designTelescopeLit + ']');
    },
    designEyepieces: function () {
        return $('[id=' + this.config.designEyepiecesLit + ']');
    },
    designDiagonal: function () {
        return $('[id=' + this.config.designDiagonalLit + ']');
    },
    designBaffling: function () {
        return $('[id=' + this.config.designBafflingLit + ']');
    },
    designTube: function () {
        return $('[id=' + this.config.designTubeLit + ']');
    },
    designMount: function () {
        return $('[id=' + this.config.designRockertLit + ']');
    },
    designET: function () {
        return $('[id=' + this.config.designETLit + ']');
    },

    diagSharedParms: function () {
        return $('[id=' + this.config.diagSharedParmsLit + ']');
    },

    // telescope designer

    btnUom: function () {
        return $('[name=btnUom]');
    },
    sliderFocalRatio: function () {
        return $('[id=sliderFocalRatio]');
    },
    sliderFocalRatioVal: function () {
        return +this.sliderFocalRatio().val();
    },
    focalRatio: function () {
        return $('[name=focalRatio]');
    },
    focalRatioVal: function () {
        return +this.focalRatio().val();
    },
    sliderAperture: function () {
        return $('[id=sliderAperture]');
    },
    sliderApertureVal: function () {
        return +this.sliderAperture().val();
    },
    aperture: function () {
        return $('[name=aperture]');
    },
    apertureVal: function () {
        return +this.aperture().val();
    },
    apertureInchesVal: function () {
        return this.convertUomToInches(this.apertureVal());
    },
    apertureUOMlabel: function () {
        return $('[name=apertureUOMlabel]');
    },
    telescopeResults: function () {
        return $('[id=telescopeResults]');
    },
    telescopeDesignerResultsLabel: function () {
        return $('[name=telescopeDesignerResultsLabel]');
    },

    // eyepiece designer

    chBoxUseComaCorrector: function () {
        return $('[name=chBoxUseComaCorrector]');
    },
    useComaCorrectorMagVal: function () {
        return this.chBoxUseComaCorrector().is(':checked');
    },
    comaCorrectorSelect: function () {
        return $('#comaCorrectorSelect');
    },
    comaCorrectorSelectVal: function () {
        return this.comaCorrectorSelect().val();
    },
    comaCorrectorMag: function () {
        return $('[name=comaCorrectorMag]');
    },
    comaCorrectorMagVal: function () {
        return +this.comaCorrectorMag().val();
    },
    btnCalcEyepieceWidestFieldForEyePupil: function () {
        return $('[id=btnCalcEyepieceWidestFieldForEyePupil]');
    },
    eyePupilmm: function () {
        return $('[name=eyePupilmm]');
    },
    eyePupilmmVal: function () {
        return +this.eyePupilmm().val();
    },
    widestEyepiecesForEyePupilLabel: function () {
        return $('[name=widestEyepiecesForEyePupilLabel]');
    },
    btnEyepieceSort: function () {
        return $('[name=btnEyepieceSort]');
    },
    sortEyepiecesByManufacturer: function () {
        return this.btnEyepieceSort()[0].checked;
    },
    sortEyepiecesByFL: function () {
        return this.btnEyepieceSort()[1].checked;
    },
    eyeOptTableBody: function () {
        return $('#eyeOptTableBody');
    },

    // diagonal designer

    focalPlaneToDiagDistance: function () {
        return $('[name=focalPlaneToDiagDistance]');
    },
    focalPlaneToDiagDistanceVal: function () {
        return +this.focalPlaneToDiagDistance().val();
    },
    focalPlaneToDiagDistanceLabel: function () {
        return $('[name=focalPlaneToDiagDistanceLabel]');
    },
    maxFieldDiaDiag: function () {
        return $('[name=maxFieldDiaDiag]');
    },
    maxFieldDiaDiagVal: function () {
        return +this.maxFieldDiaDiag().val();
    },
    maxFieldDiaDiagLabel: function () {
        return $('[name=maxFieldDiaDiagLabel]');
    },
    acceptableMagLoss: function () {
        return $('[name=acceptableMagLoss]');
    },
    acceptableMagLossVal: function () {
        return +this.acceptableMagLoss().val();
    },
    diagSizes: function () {
        return $('[name=diagSizes]');
    },
    diagSizesVal: function () {
        return this.diagSizes().val();
    },
    diagSizesLabel: function () {
        return $('[name=diagSizesLabel]');
    },
    btnUpdateDiagIllum: function () {
        return $('[id=btnUpdateDiagIllum]');
    },
    diagChartID: function () {
        return 'diagChart';
    },
    diagResults: function () {
        return $('[id=diagResults]');
    },
    offaxisMaskResults: function () {
        return $('[id=offaxisMaskResults]');
    },

    // baffle designer...

    btnUpdateBaffles: function () {
        return $('[id=btnUpdateBaffles]');
    },
    btnUpdateLowrider: function () {
        return $('[id=btnUpdateLowrider]');
    },
    btnCalcMinLowriderSecondaryMirrorSize: function () {
        return $('[id=btnCalcMinLowriderSecondaryMirrorSize]');
    },
    btncalcLowriderSecondaryOffset: function () {
        return $('[id=btncalcLowriderSecondaryOffset]');
    },
    btnCalcMinFocalPlaneToSecondaryDistance: function () {
        return $('[id=btnCalcMinFocalPlaneToSecondaryDistance]');
    },

    focuserSelect: function () {
        return $('#focuserSelect');
    },
    focuserSelectVal: function () {
        return this.focuserSelect().val();
    },
    focuserRackedInHeight: function () {
        return $('[name=focuserRackedInHeight]');
    },
    focuserRackedInHeightVal: function () {
        return +this.focuserRackedInHeight().val();
    },
    focuserRackedInHeightLabel: function () {
        return $('[name=focuserRackedInHeightLabel]');
    },
    focuserTravel: function () {
        return $('[name=focuserTravel]');
    },
    focuserTravelVal: function () {
        return +this.focuserTravel().val();
    },
    focuserTravelLabel: function () {
        return $('[name=focuserTravelLabel]');
    },
    barrelTubeInsideDiameter: function () {
        return $('[name=barrelTubeInsideDiameter]');
    },
    barrelTubeInsideDiameterVal: function () {
        return +this.barrelTubeInsideDiameter().val();
    },
    barrelTubeInsideDiameterLabel: function () {
        return $('[name=barrelTubeInsideDiameterLabel]');
    },
    barrelTubeLength: function () {
        return $('[name=barrelTubeLength]');
    },
    barrelTubeLengthVal: function () {
        return +this.barrelTubeLength().val();
    },
    barrelTubeLengthLabel: function () {
        return $('[name=barrelTubeLengthLabel]');
    },
    focuserInwardFocusingDistance: function () {
        return $('[name=focuserInwardFocusingDistance]');
    },
    focuserInwardFocusingDistanceVal: function () {
        return +this.focuserInwardFocusingDistance().val();
    },
    focuserInwardFocusingDistanceLabel: function () {
        return $('[name=focuserInwardFocusingDistanceLabel]');
    },
    telescopeTubeOD: function () {
        return $('[name=telescopeTubeOD]');
    },
    telescopeTubeODVal: function () {
        return +this.telescopeTubeOD().val();
    },
    tubeODLabel: function () {
        return $('[name=tubeODLabel]');
    },
    telescopeTubeThickness: function () {
        return $('[name=telescopeTubeThickness]');
    },
    telescopeTubeThicknessVal: function () {
        return +this.telescopeTubeThickness().val();
    },
    tubeThicknessLabel: function () {
        return $('[name=tubeThicknessLabel]');
    },
    optimizedDiagSize: function () {
        return $('[name=optimizedDiagSize]');
    },
    optimizedDiagSizeVal: function () {
        return +this.optimizedDiagSize().val();
    },
    optimizedDiagSizeLabel: function () {
        return $('[name=optimizedDiagSizeLabel]');
    },
    focalPlaneToFocuserBarrelBottomDistance: function () {
        return $('[name=focalPlaneToFocuserBarrelBottomDistance]');
    },
    focalPlaneToFocuserBarrelBottomDistanceVal: function () {
        return +this.focalPlaneToFocuserBarrelBottomDistance().val();
    },
    focalPlaneToFocuserBarrelBottomDistanceLabel: function () {
        return $('[name=focalPlaneToFocuserBarrelBottomDistanceLabel]');
    },
    diagOffset: function () {
        return $('[name=diagOffset]');
    },
    diagOffsetVal: function () {
        return +this.diagOffset().val();
    },
    diagOffsetLabel: function () {
        return $('[name=diagOffsetLabel]');
    },
    baffleCanvasID: function () {
        return $('#baffleCanvas')[0];
    },
    baffleCanvasDiv: function () {
        return $('#baffleCanvasDiv');
    },
    baffleResults: function () {
        return $('[id=baffleResults]');
    },
    lowriderSecondaryMirrorSize: function () {
        return $('[name=lowriderSecondaryMirrorSize]');
    },
    lowriderSecondaryMirrorSizeVal: function () {
        return +this.lowriderSecondaryMirrorSize().val();
    },
    lowriderSecondaryMirrorSizeLabel: function () {
        return $('[name=lowriderSecondaryMirrorSizeLabel]');
    },
    lowriderSecondaryOffset: function () {
        return $('[name=lowriderSecondaryOffset]');
    },
    lowriderSecondaryOffsetVal: function () {
        return +this.lowriderSecondaryOffset().val();
    },
    lowriderSecondaryOffsetLabel: function () {
        return $('[name=lowriderSecondaryOffsetLabel]');
    },
    focalPlaneToSecondaryDistance: function () {
        return $('[name=focalPlaneToSecondaryDistance]');
    },
    focalPlaneToSecondaryDistanceVal: function () {
        return +this.focalPlaneToSecondaryDistance().val();
    },
    focalPlaneToSecondaryDistanceLabel: function () {
        return $('[name=focalPlaneToSecondaryDistanceLabel]');
    },
    focalPointOffsetFromEdgeOfPrimary: function () {
        return $('[name=focalPointOffsetFromEdgeOfPrimary]');
    },
    focalPointOffsetFromEdgeOfPrimaryVal: function () {
        return +this.focalPointOffsetFromEdgeOfPrimary().val();
    },
    focalPointOffsetFromEdgeOfPrimaryLabel: function () {
        return $('[name=focalPointOffsetFromEdgeOfPrimaryLabel]');
    },
    lowriderCanvasID: function () {
        return $('#lowriderCanvas')[0];
    },
    lowriderCanvasDiv: function () {
        return $('#lowriderCanvasDiv');
    },
    lowriderResults: function () {
        return $('[id=lowriderResults]');
    },

    // tube assembly designer...

    CGTableBody: function () {
        return $('#CGTableBody');
    },
    btnCalcCG: function () {
        return $('[id=btnCalcCG]');
    },
    CGResults: function () {
        return $('[id=CGResults]');
    },

    // Altaz mount designer...

    CGToEyepieceDistance: function () {
        return $('[name=CGToEyepieceDistance]');
    },
    CGToEyepieceDistanceVal: function () {
        return +this.CGToEyepieceDistance().val();
    },
    CGToEyepieceDistanceLabel: function () {
        return $('[name=CGToEyepieceDistanceLabel]');
    },
    tubeWeight: function () {
        return $('[name=tubeWeight]');
    },
    tubeWeightVal: function () {
        return +this.tubeWeight().val();
    },
    tubeWeightLabel: function () {
        return $('[name=tubeWeightLabel]');
    },
    altBearingSeparationDeg: function () {
        return $('[name=altBearingSeparationDeg]');
    },
    altBearingSeparationDegVal: function () {
        return +this.altBearingSeparationDeg().val();
    },
    altBearingRadius: function () {
        return $('[name=altBearingRadius]');
    },
    altBearingRadiusVal: function () {
        return +this.altBearingRadius().val();
    },
    altBearingRadiusInchesVal: function () {
        return this.convertUomToInches(this.altBearingRadiusVal());
    },
    azBearingRadius: function () {
        return $('[name=azBearingRadius]');
    },
    azBearingRadiusVal: function () {
        return +this.azBearingRadius().val();
    },
    azBearingRadiusInchesVal: function () {
        return this.convertUomToInches(this.azBearingRadiusVal());
    },
    altBearingRadiusLabel: function () {
        return $('[name=altBearingRadiusLabel]');
    },
    azBearingRadiusLabel: function () {
        return $('[name=azBearingRadiusLabel]');
    },
    altBearingMaterialsSelect: function () {
        return $('#altBearingMaterialsSelect');
    },
    azBearingMaterialsSelect: function () {
        return $('#azBearingMaterialsSelect');
    },
    btnUpdateRocker: function () {
        return $('[id=btnUpdateRocker]');
    },
    rockerResults: function () {
        return $('[id=rockerResults]');
    },
    rockerCanvasID: function () {
        return $('#rockerCanvas')[0];
    },
    rockerCanvasDiv: function () {
        return $('#rockerCanvasDiv');
    },

    flexRockerCGToEyepieceDistance: function () {
        return $('[name=flexRockerCGToEyepieceDistance]');
    },
    flexRockerCGToEyepieceDistanceVal: function () {
        return +this.flexRockerCGToEyepieceDistance().val();
    },
    flexRockerCGToEyepieceDistanceLabel: function () {
        return $('[name=flexRockerCGToEyepieceDistanceLabel]');
    },
    flexRockerTubeWeight: function () {
        return $('[name=flexRockerTubeWeight]');
    },
    flexRockerTubeWeightVal: function () {
        return +this.flexRockerTubeWeight().val();
    },
    flexRockerTubeWeightLabel: function () {
        return $('[name=flexRockerTubeWeightLabel]');
    },
    flexRockerCGToBackEdgeOfTubeClearance: function () {
        return $('[name=flexRockerCGToBackEdgeOfTubeClearance]');
    },
    flexRockerCGToBackEdgeOfTubeClearanceVal: function () {
        return +this.flexRockerCGToBackEdgeOfTubeClearance().val();
    },
    flexRockerCGToBackEdgeOfTubeClearanceLabel: function () {
        return $('[name=flexRockerCGToBackEdgeOfTubeClearanceLabel]');
    },
    flexRockerAltBearingSeparationDeg: function () {
        return $('[name=flexRockerAltBearingSeparationDeg]');
    },
    flexRockerAltBearingSeparationDegVal: function () {
        return +this.flexRockerAltBearingSeparationDeg().val();
    },
    btnUpdateFlexRocker: function () {
        return $('[id=btnUpdateFlexRocker]');
    },
    flexRockerAltBearingMaterialsSelect: function () {
        return $('#flexRockerAltBearingMaterialsSelect');
    },
    flexRockerAzBearingMaterialsSelect: function () {
        return $('#flexRockerAzBearingMaterialsSelect');
    },
    flexRockerCanvasID: function () {
        return $('#flexRockerCanvas')[0];
    },
    flexRockerCanvasDiv: function () {
        return $('#flexRockerCanvasDiv');
    },
    flexRockerResults: function () {
        return $('[id=flexRockerResults]');
    },

    // equatorial table designer...

    btnUpdateET: function () {
        return $('[id=btnUpdateET]');
    },
    ETLatitudeDeg: function () {
        return $('[name=ETLatitudeDeg]');
    },
    ETTrackingTimeMin: function () {
        return $('[name=ETTrackingTimeMin]');
    },
    ETLatitudeDegVal: function () {
        return +this.ETLatitudeDeg().val();
    },
    ETTrackingTimeMinVal: function () {
        return +this.ETTrackingTimeMin().val();
    },
    ETResults: function () {
        return $('[id=ETResults]');
    },
    ETCanvasID: function () {
        return $('#ETCanvas')[0];
    },
    ETCanvasDiv: function () {
        return $('#ETCanvasDiv');
    },

    // save/get telescope designs...

    btnPutDesign: function () {
        return $('input[id=btnPutDesign]');
    },
    btnGetDesign: function () {
        return $('input[id=btnGetDesign]');
    },
    textareaDesignData: function () {
        return $('#textareaDesignData');
    },

    // helper functions...

    tableElement: function (ID, idIx) {
        return $('[id=' + ID + idIx + ']');
    },
    getUomLengthLit: function () {
        return this.imperial()
            ? this.config.inchesLit
            : this.config.mmLit;
    },
    getUomWeightLit: function () {
        return this.imperial()
            ? this.config.lbsLit
            : this.config.kgLit;
    },
    getMaterialAreaLit: function () {
        return this.imperial()
            ? this.config.sqrFtLit
            : this.config.sqrMeterLit;
    },
    getMaterialAreaUomDivisor: function () {
        return this.imperial()
            ? 144
            : 1000000;
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

    weightElements: function () {
        return $('[name^=' + this.config.CGIDs[1] + ']');
    },
    distanceElements: function () {
        return $('[name^=' + this.config.CGIDs[2] + ']');
    },

    imperial: function () {
        return this.btnUom()[0].checked;
    },
    convertUomToInches: function (value) {
        return this.imperial()
            ? value
            : value / 25.4;
    },
    convertUomToMm: function (value) {
        return this.imperial()
            ? value * 25.4
            : value;
    },
    convertInchesToUom: function (inches) {
        return this.imperial()
            ? inches
            : inches * 25.4;
    },
    convertMmToUom: function (mm) {
        return this.imperial()
            ? mm / 25.4
            : mm;
    },
    convertInchesSquaredToUom: function (inchesSquared) {
        return this.imperial()
            ? inchesSquared
            : inchesSquared * 645.16; //25.4 * 25.4
    },
    convertUomToLbs: function (value) {
        return this.imperial()
            ? value
            : value * 2.205;
    },
    convertUomToKg: function (value) {
        return this.imperial()
            ? value / 2.205
            : value;
    },
    convertLbsToUom: function (lbs) {
        return this.imperial()
            ? lbs
            : lbs / 2.205;
    },
    convertKgToUom: function (kg) {
        return this.imperial()
            ? kg * 2.205
            : kg;
    },
    convertUomToCubicFt: function (value) {
        return this.imperial()
            ? value / 1728 // 12 * 12 * 12
            : value / 28316847; //25.4 / 25.4 / 25.4 / 1728
    }
};

MLB.NewtDesigner.getComaCorrectorMagnificationFactor = function () {
    var common = MLB.NewtDesigner.common;

    if (common.useComaCorrectorMagVal()) {
        return common.comaCorrectorMagVal();
    }
    return 1;
};

// if using coma corrector then focal ratio should be set to 12
MLB.NewtDesigner.calcComaFreeDia = function (focalRatio) {
    var common = MLB.NewtDesigner.common,
        calcComaFreeDiaInches = MLB.calcLib.calcComaFreeDiaInches;

    return common.convertInchesToUom(calcComaFreeDiaInches(focalRatio));
};

MLB.NewtDesigner.calcLimitingMagnitudeFromPupil = function (highMagnificationMagnitudeLimit, pupil) {
    var config = MLB.NewtDesigner.config,
        normalizedPupil = pupil > 7
            ? 7
            : pupil < 2
                ? 2
                : pupil;

    return highMagnificationMagnitudeLimit - config.magnitudeLossDueToSkyBrightness * (normalizedPupil - 2) / 5;
};

MLB.NewtDesigner.convertApertureToCm = function () {
    var common = MLB.NewtDesigner.common;

    return common.convertUomToMm(common.apertureVal()) / 10;
};

MLB.NewtDesigner.calcEtendue = function (apertureCm, FOVDeg) {
    return apertureCm * apertureCm * FOVDeg * FOVDeg;
};

MLB.NewtDesigner.calcLowriderSecondaryOffset = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        uom = MLB.sharedLib.uom,
        calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian,
        calcDiagOffset3 = MLB.calcLib.calcDiagOffset3,
        model = calcFoldedNewtonian(common.apertureVal(), common.focalRatioVal(), common.lowriderSecondaryMirrorSizeVal(), 0, common.focalPointOffsetFromEdgeOfPrimaryVal(), common.focalPlaneToSecondaryDistanceVal()),
        offsetMultiplier = Math.sin(model.elbowAngleDeg / 2 * uom.degToRad) / Math.sin(45 * uom.degToRad),
        offset = -calcDiagOffset3(common.lowriderSecondaryMirrorSizeVal(), common.focalPlaneToSecondaryDistanceVal());

    common.lowriderSecondaryOffset().val(roundToDecimal(offset * offsetMultiplier, config.decimalPointsDiag));
};

MLB.NewtDesigner.writeOffaxisMaskResults = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
        limitingMagnitude = MLB.calcLib.limitingMagnitude,
        uomLengthLit = common.getUomLengthLit(),
        offaxisMaskDia = (common.apertureVal() - common.optimizedDiagSizeVal()) / 2 + state.diagOffset,
        offaxisMaskDiaInches = common.convertUomToInches(offaxisMaskDia),
        highestMagnification = offaxisMaskDiaInches * 25,
        theoreticalResolutionArcsec = calcTheoreticalResolutionArcsec(offaxisMaskDiaInches),
        magnitudeLimit = limitingMagnitude(offaxisMaskDiaInches);

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

MLB.NewtDesigner.calcVignettedIllumPercent = function (diagSize) {
    var common = MLB.NewtDesigner.common,
        diagObstructionArea = MLB.calcLib.diagObstructionArea,
        getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
        focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
        aperture = common.apertureVal(),
        focalLength = aperture * common.focalRatioVal(),
        offAxisIncrement = common.imperial()
            ? 0.1
            : 2,
        maxField = common.maxFieldDiaDiagVal(),
        lossDueToDiagonalSize = diagObstructionArea(aperture, diagSize),
        /* array[off-axis points], each element consisting of:
               array[2]: 1st element is the off-axis distance and 2nd element the illumination value
           array goes from one edge of field to center of field to opposite edge of field */
        diagIllumArray = getDiagIllumArray(aperture, focalLength, diagSize, focalPlaneToDiagDistance, offAxisIncrement, maxField),
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

MLB.NewtDesigner.graphDiagIllumSubr = function (chart, diagonals) {
    var state = MLB.NewtDesigner.state,
        common = MLB.NewtDesigner.common,
        minIllum,
        uomLengthLit,
        offAxisIncrement,
        formatString,
        focalPlaneToDiagDistance,
        focalRatio,
        focalLength,
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
        maxIllumDiag,
        maxIllum,
        diagIntegratedVignettedIllums = [],
        diagIntegratedVignettedIllum,
        calcVignettedIllumPercent = MLB.NewtDesigner.calcVignettedIllumPercent,
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
    focalRatio = common.focalRatioVal();
    aperture = common.apertureVal();
    focalLength = aperture * focalRatio;
    maxField = common.maxFieldDiaDiagVal();
    focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
    acceptableMagLoss = common.acceptableMagLossVal();

    minDiag = focalPlaneToDiagDistance / (focalLength / aperture);
    minIllum = inverseMagnitudeDrop(acceptableMagLoss);

    suitableDiags = [];
    diagonalsLength = diagonals.length;
    for (ix = 0; ix < diagonalsLength; ix += 1) {
        diagSize = diagonals[ix];
        offAxisIllum = calcOffAxisIllumination(aperture, focalLength, diagSize, focalPlaneToDiagDistance, maxField / 2);
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
        calcs.push(getDiagIllumArray(aperture, focalLength, suitableDiags[ix], focalPlaneToDiagDistance, offAxisIncrement, maxField));
        lossDueToDiagonals.push(diagObstructionArea(aperture, suitableDiags[ix]));
    }

    // generate plot data
    offAxisPts = calcs[0].length;

    /* series is an array of diagonal sizes with the last array element the max illumination drop;
       each diagonal size is an array of [distances from field center, illumination drop in magnitudes]
       for example, one diagonal with the max illum drop:
       series[0]
            [-0.7, 0.10638105150315147]
            [-0.6, 0.10457897039648882]
            [-0.5, 0.10457897039648882]
            [-0.4, 0.10457897039648882]
            [-0.3, 0.10457897039648882]
            [-0.2, 0.10457897039648882]
            [-0.1, 0.10457897039648882]
            [-0, 0.10457897039648882]
            [0.1, 0.10457897039648882]
            [0.2, 0.10457897039648882]
            ...
       series[1]
            [-0.7, 0.4000000000000001]
            [-0.6, 0.4000000000000001]
            [-0.5, 0.4000000000000001]
            ...
    */
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

    // calc integrated vignetted illumination
    maxIllum = 0;
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
        diagIntegratedVignettedIllum = calcVignettedIllumPercent(suitableDiags[diagIx]);
        if (diagIntegratedVignettedIllum > maxIllum) {
            maxIllum = diagIntegratedVignettedIllum;
            maxIllumDiag = suitableDiags[diagIx];
        }
        diagIntegratedVignettedIllums.push([suitableDiags[diagIx], diagIntegratedVignettedIllum]);
    }

    state.diagSize = suitableDiags[0];
    state.minDiag = suitableDiags[0];
    state.maxIllumDiag = maxIllumDiag;
    state.evenIllumDiag = suitableDiags[suitableDiagsLength - 1];
    state.diagIntegratedVignettedIllum = diagIntegratedVignettedIllums;
};

MLB.NewtDesigner.graphDiagIllum = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        graphDiagIllumSubr = MLB.NewtDesigner.graphDiagIllumSubr,
        uomLengthLit,
        offset,
        diagIntegratedVignettedIllumStr = '',
        calcDiagOffset3 = MLB.calcLib.calcDiagOffset3,
        calcLowriderSecondaryOffset = MLB.NewtDesigner.calcLowriderSecondaryOffset,
        writeOffaxisMaskResults = MLB.NewtDesigner.writeOffaxisMaskResults;

    // remove comma, turn string to number, sort
    graphDiagIllumSubr(common.diagChartID(), common.diagSizesVal().split(',').map(Number).sort(function (a, b) {return a - b;}));

    uomLengthLit = common.getUomLengthLit();
    offset = -calcDiagOffset3(state.diagSize, common.focalPlaneToDiagDistanceVal());
    state.diagIntegratedVignettedIllum.map(function (item) {
        diagIntegratedVignettedIllumStr += item[0] + ': ' + roundToDecimal(item[1] * 100, config.decimalPointsPercent) + '%; ';
    });

    common.diagResults().html('diagonal size for least obstruction = '
            + roundToDecimal(state.minDiag, config.decimalPointsDiag)
            + uomLengthLit
            + '<br>diagonal size for most even illumination across the field =  '
            + state.evenIllumDiag
            + uomLengthLit
            + '<br><br>diagonal size maximizing illumination integrated across the field =  '
            + state.maxIllumDiag
            + uomLengthLit
            + '<br>&nbsp&nbsp&nbsp&nbsp note: illumination integrated across the field: &nbsp'
            + diagIntegratedVignettedIllumStr
            + '<br><br>Diagonal offset towards primary mirror and away from focuser = '
            + roundToDecimal(offset, config.decimalPointsDiag)
            + uomLengthLit);

    state.diagOffset = offset;

    common.optimizedDiagSize().val(roundToDecimal(state.diagSize, config.decimalPointsDiag));
    common.diagOffset().val(roundToDecimal(offset, config.decimalPointsDiag));
    writeOffaxisMaskResults();

    common.lowriderSecondaryMirrorSize().val(roundToDecimal(common.optimizedDiagSizeVal(), config.decimalPointsDiag));
    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.optimizedDiagSizeVal() * common.focalRatioVal(), config.decimalPointsDimension));
    calcLowriderSecondaryOffset();
};

MLB.NewtDesigner.drawCanvasOutline = function (context, canvas) {
    var config = MLB.NewtDesigner.config;

    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();
    context.rect(config.canvasBorder, config.canvasBorder, canvas.width - 2 * config.canvasBorder, canvas.height - 2 * config.canvasBorder);
    context.stroke();
};

MLB.NewtDesigner.graphBaffles = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        calcVignettedIllumPercent = MLB.NewtDesigner.calcVignettedIllumPercent,
        drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        drawHorizDimen = MLB.sharedLib.drawHorizDimen,
        uom = MLB.sharedLib.uom,
        baffleScalingFactor = MLB.calcLib.baffleScalingFactor,
        calcProjectedFocuserBaffleRadius = MLB.calcLib.calcProjectedFocuserBaffleRadius,
        calcSagitta = MLB.calcLib.calcSagitta,
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        baffleScalingResults,
        canvas,
        context,
        aperture,
        focalRatio,
        telescopeFocalLength,
        maxFieldDia,
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
        scaledmaxFieldDia,
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
        diagUpperToLeftmaxFieldDiaXDelta,
        diagLowerToRightFocalPlaneYDelta,
        diagLowerToRightmaxFieldDiaXDelta,
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
        tiltAngleDeg,
        tiltedDistance,
        flatDistance,
        oppositeFocuserDia,
        primaryMirrorExtension,
        uomLengthLit = common.getUomLengthLit(),
        text,
        dimensionY,
        vignettedIllum;

    aperture = common.apertureVal();
    focalRatio = common.focalRatioVal();
    telescopeFocalLength = aperture * focalRatio;
    focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
    maxFieldDia = common.maxFieldDiaDiagVal();
    diagSize = common.optimizedDiagSizeVal();
    barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
    barrelTubeLength = common.barrelTubeLengthVal();
    telescopeTubeOD = common.telescopeTubeODVal();
    telescopeTubeThickness = common.telescopeTubeThicknessVal();
    diagOffset = common.diagOffsetVal();
    focalPlaneToFocuserBarrelBottomDistance = common.focalPlaneToFocuserBarrelBottomDistanceVal();

    projectedFocuserBaffleRadius = calcProjectedFocuserBaffleRadius(maxFieldDia, barrelTubeInsideDiameter, common.focalPlaneToFocuserBarrelBottomDistanceVal(), focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness);
    sagitta = calcSagitta(aperture, focalRatio);

    primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
    primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

    // set scalingFactor
    // factors determined empirically by inspecting 4" F2, F12 and 40" F2, F12
    baffleScalingResults = baffleScalingFactor(config.baffleCanvasWidth, config.baffleCanvasHeight, aperture * focalRatio * 1.5, aperture * 2.5, config.canvasBorder);
    state.scalingFactor = baffleScalingResults.scalingFactor;

    scaledAperture = state.scalingFactor * aperture;
    scaledMirrorRadius = scaledAperture / 2;
    scaledTelescopeFocalLength = state.scalingFactor * telescopeFocalLength;
    scaledmaxFieldDia = state.scalingFactor * maxFieldDia;
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

    // build canvas, context
    common.baffleCanvasDiv().append(buildCanvasElement('baffleCanvas', baffleScalingResults.width, baffleScalingResults.height));
    canvas = common.baffleCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
    // calc key points
    // factors determined empirically by inspecting 4" F2, F12 and 40" F2, F12
    mirrorCenterPt = point(config.canvasBorder + scaledPrimaryMirrorThicknessInUom + scaledPrimaryMirrorCellThicknessInUom + scaledTelescopeTubeThickness, canvas.height / 2 - 16);
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
    focalPlaneLeftPt = point(focalPlaneCenterPt.x - scaledmaxFieldDia / 2, focalPlaneCenterPt.y);
    focalPlaneRightPt = point(focalPlaneCenterPt.x + scaledmaxFieldDia / 2, focalPlaneCenterPt.y);

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
    diagLowerToRightmaxFieldDiaXDelta = (scaledmaxFieldDia + scaledDiagSize) / 2 - scaledDiagOffset;
    diagUpperToLeftmaxFieldDiaXDelta = -diagLowerToRightmaxFieldDiaXDelta;
    diagUpperToLeftFocalPlaneAngleRad = Math.atan2(diagUpperToLeftFocalPlaneYDelta, diagUpperToLeftmaxFieldDiaXDelta);
    diagLowerToRightFocalPlaneAngleRad = Math.atan2(diagLowerToRightFocalPlaneYDelta, diagLowerToRightmaxFieldDiaXDelta);
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
    tiltAngleDeg = increasedReflectionAngleRad / uom.degToRad;
    tiltedDistance = Math.sqrt(angledLengthX * angledLengthX + angledLengthY * angledLengthY) / state.scalingFactor;
    flatDistance = (projectedFocuserBaffleRightPt.x - projectedFocuserBaffleLeftPt.x - angledLengthX * 2) / state.scalingFactor;

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
    oppositeFocuserDia = projectedFocuserBaffleRadius * 2;
    text = config.projectedFocuserBaffleDimensionText + roundToDecimal(oppositeFocuserDia, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = projectedFocuserBafflePartBRect.endY + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, projectedFocuserBaffleLeftPt.x, projectedFocuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write dimension for primary mirror baffle
    primaryMirrorExtension = (primaryMirrorBaffleLowerRect.endX - mirrorLowerFacePt.x) / state.scalingFactor;
    text = config.primaryMirrorBaffleDimensionText + roundToDecimal(primaryMirrorExtension, config.decimalPointsDimension) + uomLengthLit;
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
    vignettedIllum = calcVignettedIllumPercent(diagSize);

    common.baffleResults().html('projected focuser baffle tilt angle = '
            + roundToDecimal(tiltAngleDeg, config.decimalPointsDimension)
            + ' deg<br>projected focuser baffle tilted length = '
            + roundToDecimal(tiltedDistance, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>projected focuser baffle flat length = '
            + roundToDecimal(flatDistance, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>mirror sagitta = '
            + roundToDecimal(sagitta, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>intgrated vignetted illumination = '
            + roundToDecimal(vignettedIllum, 2));
};

MLB.NewtDesigner.graphLowrider = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        canvas,
        context,
        aperture,
        focalRatio,
        telescopeFocalLength,
        maxFieldDia,
        barrelTubeInsideDiameter,
        barrelTubeLength,
        telescopeTubeOD,
        telescopeTubeThickness,
        focalPlaneToFocuserBarrelBottomDistance,
        lowriderSecondaryMirrorSize,
        lowriderSecondaryOffset,
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
        scaledmaxFieldDia,
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
        scaledlowriderSecondaryOffset,
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

    aperture = common.apertureVal();
    focalRatio = common.focalRatioVal();
    telescopeFocalLength = aperture * focalRatio;
    maxFieldDia = common.maxFieldDiaDiagVal();
    barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
    barrelTubeLength = common.barrelTubeLengthVal();
    telescopeTubeOD = common.telescopeTubeODVal();
    telescopeTubeThickness = common.telescopeTubeThicknessVal();
    focalPlaneToFocuserBarrelBottomDistance = common.focalPlaneToFocuserBarrelBottomDistanceVal();
    lowriderSecondaryMirrorSize = common.lowriderSecondaryMirrorSizeVal();
    lowriderSecondaryOffset = common.lowriderSecondaryOffsetVal();
    focalPlaneToSecondaryDistance = common.focalPlaneToSecondaryDistanceVal();
    focalPointOffsetFromEdgeOfPrimary = common.focalPointOffsetFromEdgeOfPrimaryVal();

    primaryMirrorThicknessInUom = common.convertInchesToUom(config.primaryMirrorThicknessInches);
    primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

    sagitta = calcSagitta(aperture, focalRatio);

    // focalPlaneToTertiaryDistance = 0
    state.lowriderModel = calcFoldedNewtonian(aperture, focalRatio, lowriderSecondaryMirrorSize, 0, focalPointOffsetFromEdgeOfPrimary, focalPlaneToSecondaryDistance);

    if (lowriderSecondaryMirrorSize + config.diagTooSmallAllowance < focalPlaneToSecondaryDistance / focalRatio) {
        context.fillStyle = config.canvasErrorStyle;
        context.fillText(config.diagTooSmallErrMsg, 0, canvas.height / 2);
        common.lowriderResults().html(config.noResults);
        return;
    }
    if (isNaN(state.lowriderModel.elbowAngleDeg)) {
        context.fillStyle = config.canvasErrorStyle;
        context.fillText(config.focalPointToDiagTooLongErrMsg, 0, canvas.height / 2);
        common.lowriderResults().html(config.noResults);
        return;
    }

    scaledMainAxisLength = state.scalingFactor * state.lowriderModel.diagToPrimaryMirrorDistance;
    scaledAperture = state.scalingFactor * aperture;
    scaledRadiusCurvature = scaledAperture * focalRatio * 2;
    scaledMirrorRadius = scaledAperture / 2;
    scaledTelescopeFocalLength = state.scalingFactor * telescopeFocalLength;
    scaledmaxFieldDia = state.scalingFactor * maxFieldDia;
    scaledBarrelTubeInsideDiameter = state.scalingFactor * barrelTubeInsideDiameter;
    scaledBarrelTubeLength = state.scalingFactor * barrelTubeLength;
    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledTelescopeTubeThickness = state.scalingFactor * telescopeTubeThickness;
    scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
    scaledFocalPlaneToFocuserBarrelBottomDistance = state.scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
    scaledPrimaryMirrorThicknessInUom = state.scalingFactor * primaryMirrorThicknessInUom;
    scaledPrimaryMirrorCellThicknessInUom = state.scalingFactor * primaryMirrorCellThicknessInUom;
    scaledSagitta = state.scalingFactor * sagitta;
    scaledHalfDiagMajorAxisSize = state.scalingFactor * state.lowriderModel.diagMajorAxisSize / 2;
    scaledlowriderSecondaryOffset = state.scalingFactor * lowriderSecondaryOffset;

    // calc primary mirror angle from mirror edge to radius of curvature:
    // circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
    // circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
    mirrorRadian = 1 / (2 * focalRatio);

    // build canvas, context
    common.lowriderCanvasDiv().append(buildCanvasElement('lowriderCanvas', common.baffleCanvasID().width * 1.5, common.baffleCanvasID().height));
    canvas = common.lowriderCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

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
    diagAngleDeg = state.lowriderModel.elbowAngleDeg / 2;
    diagPt = point(mirrorCenterPt.x + scaledMainAxisLength, mirrorCenterPt.y);
    diagAngleRad = diagAngleDeg * uom.degToRad;
    xDelta = Math.sin(diagAngleRad) * scaledHalfDiagMajorAxisSize;
    yDelta = Math.cos(diagAngleRad) * scaledHalfDiagMajorAxisSize;
    xDeltaOffset = Math.sin(diagAngleRad) * scaledlowriderSecondaryOffset;
    yDeltaOffset = Math.cos(diagAngleRad) * scaledlowriderSecondaryOffset;
    diagUpperPt = point(diagPt.x + xDelta - xDeltaOffset, diagPt.y - yDelta + yDeltaOffset);
    diagLowerPt = point(diagPt.x - xDelta - xDeltaOffset, diagPt.y + yDelta + yDeltaOffset);

    // calc focal point and focal plane points
    focalPt = point(mirrorCenterPt.x + state.scalingFactor * state.lowriderModel.focalPointToPrimaryMirrorDistance, mirrorCenterPt.y - state.scalingFactor * (aperture / 2 + focalPointOffsetFromEdgeOfPrimary));
    focalPlaneAngleRad = state.lowriderModel.elbowAngleDeg * uom.degToRad;
    xDelta = Math.sin(focalPlaneAngleRad) * scaledmaxFieldDia / 2;
    yDelta = Math.cos(focalPlaneAngleRad) * scaledmaxFieldDia / 2;
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
        common.lowriderResults().html(config.noResults);
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
    state.lowriderModel.frontEndOfTubeToPrimaryMirrorDistance = (focuserBaffleRightPt.x - mirrorLowerFacePt.x) / state.scalingFactor;

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
    diagUpperToLeftFocalPlaneReflectedAngleRad = uom.oneRev - state.lowriderModel.elbowAngleDeg * uom.degToRad - diagUpperToLeftFocalPlaneAngleRad;
    diagUpperToLeftFocalPlaneReflectedCanvasAngleRad = uom.oneRev - diagUpperToLeftFocalPlaneReflectedAngleRad;
    diagUpperToTubeUpperInsideYDelta = diagUpperPt.y - tubeIDUpperY;
    tanDiagUpperToLeftFocalPlaneReflectedAngle = Math.tan(uom.halfRev - diagUpperToLeftFocalPlaneReflectedAngleRad);
    diagUpperToTubeUpperInsideXDelta = diagUpperToTubeUpperInsideYDelta / tanDiagUpperToLeftFocalPlaneReflectedAngle;
    primaryMirrorBaffleLowerIntersectPt = point(diagUpperPt.x - diagUpperToTubeUpperInsideXDelta, diagUpperPt.y - diagUpperToTubeUpperInsideYDelta);
    // bottom baffle
    xDelta = diagLowerPt.x - focalPlaneRightPt.x;
    yDelta = diagLowerPt.y - focalPlaneRightPt.y;
    diagLowerToRightFocalPlaneAngleRad = Math.atan2(yDelta, -xDelta);
    diagLowerToRightFocalPlaneReflectedAngleRad = uom.oneRev - state.lowriderModel.elbowAngleDeg * uom.degToRad - diagLowerToRightFocalPlaneAngleRad;
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
    text = config.primaryMirrorToFocalPlaneDimensionText + roundToDecimal(state.lowriderModel.focalPointToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, focalPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // draw diagonal to mirror dimension line
    text = config.primaryMirrorToFoldingMirrorText + roundToDecimal(state.lowriderModel.diagToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, diagPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write mirror front edge to tube front dimension
    text = config.primaryMirrorToTubeEndDimensionText + roundToDecimal(state.lowriderModel.frontEndOfTubeToPrimaryMirrorDistance, config.decimalPointsDimension) + uomLengthLit;
    dimensionY += 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, focuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // write diagonal dimensions
    diagonalString = 'bending angle = '
            + roundToDecimal(state.lowriderModel.elbowAngleDeg, config.decimalPointsDimension)
            + ' deg<br>folding mirror: '
            + roundToDecimal(lowriderSecondaryMirrorSize, config.decimalPointsDimension)
            + 'x'
            + roundToDecimal(state.lowriderModel.diagMajorAxisSize, config.decimalPointsDimension)
            + uomLengthLit
            + '; angle = '
            // diagonal angle is half that of the elbow optical angle
            + roundToDecimal(diagAngleDeg, config.decimalPointsDimension)
            + config.degLit;
    common.lowriderResults().html(diagonalString
            + '<br>mirror sagitta = '
            + roundToDecimal(sagitta, config.decimalPointsDimension) + uomLengthLit);
};

MLB.NewtDesigner.graphRocker = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        CG = state.CG,
        rocker = state.rocker,
        friction = {},
        calcDobFriction = MLB.calcLib.calcDobFriction,
        materials = MLB.materialFrictionJson.materials,
        uomDistanceLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        altCoF = +materials[common.altBearingMaterialsSelect().get(0).selectedIndex].friction,
        azCoF = +materials[common.azBearingMaterialsSelect().get(0).selectedIndex].friction,
        pushAngleDegFromHorizontal = config.pushAngleDegFromHorizontal,
        momentArmInches = common.convertUomToInches(common.CGToEyepieceDistanceVal()),
        tubeWeightLbs = common.convertUomToLbs(common.tubeWeightVal()),
        drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
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
        padBoardHeight,
        dimensionX,
        frontViewCenterPt,
        frontRockerBoardOutsideWidth,
        scaledFrontRockerBoardOutsideWidth,
        frontRockerFrontBoardRect,
        frontRockerLeftBearingBoardRect,
        frontRockerRightBearingBoardRect,
        materialArea = {},
        materialCG = {},
        materialAreaUomDivisor,
        materialAreaLit,
        materialVolume,
        materialWeightLbs,
        materialWeightUom,
        rockerWeightLbs,
        calcFriction,
        padSizeInchesSquared,
        padSizeUom,
        roundedPadSizeSideUom;

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

    frontRockerBoardOutsideWidth = telescopeTubeOD + 4 * woodThickness;
    if (frontRockerBoardOutsideWidth < azBearingDiameter) {
        frontRockerBoardOutsideWidth = azBearingDiameter;
    }

    scaledTelescopeTubeOD = state.scalingFactor * telescopeTubeOD;
    scaledWoodThickness = state.scalingFactor * woodThickness;
    scaledCGHeightToClearRockerBottomDistance = state.scalingFactor * CG.heightToClearRockerBottomDistance;
    scaledRockerSideLength = state.scalingFactor * rockerSideLength;
    scaledRockerSideHeight = state.scalingFactor * rockerSideHeight;
    scaledCGToBearingPointY = state.scalingFactor * altBearingRadius * Math.cos(altBearingSeparationHalfAngleRad);
    scaledFrontRockerBoardOutsideWidth = state.scalingFactor * frontRockerBoardOutsideWidth;

    // build canvas, context
    common.rockerCanvasDiv().append(buildCanvasElement('rockerCanvas', scaledRockerSideLength * 6, scaledCGHeightToClearRockerBottomDistance * 1.5));
    canvas = common.rockerCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
    // calc key points
    CGPt = point(canvas.width / 6, 4 * config.canvasDimensionHalfHeight);
    frontViewCenterPt = point(canvas.width * 2 / 3, CGPt.y);
    scaledRockerSideTopY = CGPt.y + scaledCGHeightToClearRockerBottomDistance - scaledRockerSideHeight;
    // rocker side boards
    rockerBottomBoardRect = rect(CGPt.x - scaledRockerSideLength / 2, CGPt.y + scaledCGHeightToClearRockerBottomDistance, scaledRockerSideLength, scaledWoodThickness);
    rockerSideBoardRect = rect(CGPt.x - scaledRockerSideLength / 2, scaledRockerSideTopY, scaledRockerSideLength, scaledRockerSideHeight);
    rockerFrontBoardRect = rect(CGPt.x + scaledRockerSideLength / 2, scaledRockerSideTopY, scaledWoodThickness, scaledRockerSideHeight + scaledWoodThickness);
    // rocker front boards
    frontRockerFrontBoardRect = rect(frontViewCenterPt.x - scaledFrontRockerBoardOutsideWidth / 2, scaledRockerSideTopY, scaledFrontRockerBoardOutsideWidth, scaledRockerSideHeight + scaledWoodThickness);
    frontRockerLeftBearingBoardRect = rect(frontViewCenterPt.x - scaledFrontRockerBoardOutsideWidth / 2, frontViewCenterPt.y + scaledCGToBearingPointY, scaledWoodThickness, scaledRockerSideTopY - frontViewCenterPt.y - scaledCGToBearingPointY);
    // uses values from frontRockerLeftBearingBoardRect
    frontRockerRightBearingBoardRect = rect(frontViewCenterPt.x + scaledFrontRockerBoardOutsideWidth / 2 - scaledWoodThickness, frontRockerLeftBearingBoardRect.y, scaledWoodThickness, frontRockerLeftBearingBoardRect.height);
    // bearing arc
    bearingArcLeftPt = point(CGPt.x - state.scalingFactor * altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad), CGPt.y + scaledCGToBearingPointY);
    bearingArcRightPt = point(CGPt.x + state.scalingFactor * altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad), bearingArcLeftPt.y);
    bearingArcLeftIntersectWithRockerSideTopPt = point(bearingArcLeftPt.x, rockerSideBoardRect.y);
    bearingArcRightIntersectWithRockerSideTopPt = point(bearingArcRightPt.x, rockerSideBoardRect.y);
    padBoardHeight = (rockerSideBoardRect.y - bearingArcRightPt.y) / state.scalingFactor;

    // material area
    materialArea.side = rockerSideLength * rockerSideHeight;
    materialArea.front = frontRockerBoardOutsideWidth * (rockerSideHeight + woodThickness);
    materialArea.bottom = rockerSideLength * frontRockerBoardOutsideWidth;
    materialArea.bearingBoard = altBearingSeparation * padBoardHeight;
    materialArea.total = 2 * materialArea.side + materialArea.front + materialArea.bottom + 2 * materialArea.bearingBoard;
    // material CG
    materialCG.momentArm = {};
    materialCG.momentArm.side = materialArea.side * (rockerSideHeight / 2 + woodThickness);
    materialCG.momentArm.front = materialArea.front * (rockerSideHeight + woodThickness) / 2;
    materialCG.momentArm.bottom = materialArea.bottom * woodThickness / 2;
    materialCG.momentArm.bearingBoard = materialArea.bearingBoard * (padBoardHeight / 2 + rockerSideHeight + woodThickness);
    materialCG.momentArm.total = 2 * materialCG.momentArm.side + materialCG.momentArm.front + materialCG.momentArm.bottom + 2 * materialCG.momentArm.bearingBoard;
    materialCG.CG = materialCG.momentArm.total / materialArea.total;

    // display in ft^2 or m^2 as opposed to standard uom of inches and mm
    materialAreaUomDivisor = common.getMaterialAreaUomDivisor();
    materialAreaLit = common.getMaterialAreaLit();
    // weight
    materialVolume = materialArea.total * woodThickness;
    materialWeightLbs = config.woodLbsPerCubicFt * common.convertUomToCubicFt(materialVolume);
    materialWeightUom = common.convertLbsToUom(materialWeightLbs);

    // note that length is measured from rocker back to front of front board and that
    // height is measured from the bottom of the bottom board to the top of the bearing board
    rocker.baseBoardThickness = woodThickness;
    rocker.width = frontRockerBoardOutsideWidth;
    rocker.sideHeight = rockerSideHeight;
    rocker.padBoardHeight = padBoardHeight;
    rocker.height = rockerSideHeight + rocker.baseBoardThickness + padBoardHeight;
    rocker.length = rockerSideLength + woodThickness;
    rocker.altBearingSeparationHalfAngleRad = altBearingSeparationHalfAngleRad;
    rocker.altBearingRadius = altBearingRadius;
    rocker.CG = materialCG.CG;
    rocker.weight = materialWeightUom;
    // calculate from ground, presuming ground board thickness is same as rocker base board thickness and that azimuth pads height is same as altitude bearing pad height
    rocker.eyepieceHeight = 2 * rocker.baseBoardThickness + 2 * config.padThicknessInches + CG.heightToClearRockerBottomDistance + common.CGToEyepieceDistanceVal();

    rockerWeightLbs = common.convertUomToLbs(state.rocker.weight);
    rocker.combinedWeight = common.tubeWeightVal() + state.rocker.weight;

    calcFriction = calcDobFriction(azCoF, altCoF, momentArmInches, tubeWeightLbs + rockerWeightLbs, tubeWeightLbs, common.azBearingRadiusInchesVal(), common.altBearingRadiusInchesVal(), common.altBearingSeparationDegVal() / 2, pushAngleDegFromHorizontal);
    padSizeInchesSquared = (tubeWeightLbs + rockerWeightLbs) / config.frictionOfMovementPadIdealPSI / 3;
    padSizeUom = common.convertInchesSquaredToUom(padSizeInchesSquared);

    friction.alt = common.convertLbsToUom(calcFriction.alt);
    friction.az = common.convertLbsToUom(calcFriction.az);
    friction.padSizeSideUom = Math.sqrt(padSizeUom);
    roundedPadSizeSideUom = roundToDecimal(friction.padSizeSideUom, config.decimalPointsCG);

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }
    // draw rocker side...
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
    dimensionY = rockerSideBoardRect.y + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, bearingArcLeftPt.x, bearingArcRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write horizontal dimension for rocker side length
    text = config.rockerSideLengthText + roundToDecimal(rockerSideLength, config.decimalPointsDimension) + uomLengthLit;
    dimensionY = rockerBottomBoardRect.endY + 4 * config.canvasDimensionHalfHeight;
    drawHorizDimen(context, text, dimensionY, rockerSideBoardRect.x, rockerSideBoardRect.endX, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write vertical dimension for rocker side height
    text = config.rockerSideHeightText + roundToDecimal(rockerSideHeight, config.decimalPointsDimension) + uomLengthLit;
    dimensionX = rockerFrontBoardRect.x + 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, rockerSideBoardRect.endY, rockerFrontBoardRect.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    // write vertical dimension for pad board height
    text = config.bearingHeightText + roundToDecimal(padBoardHeight, config.decimalPointsDimension) + uomLengthLit;
    drawVertDimen(context, text, dimensionX, rockerSideBoardRect.y, bearingArcRightPt.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

    // draw rocker front...
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

    // write out results
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
            + roundToDecimal(materialArea.total / materialAreaUomDivisor, config.decimalPointsMaterialArea)
            + materialAreaLit
            + '<br>CG = '
            + roundToDecimal(materialCG.CG, config.decimalPointsCG)
            + uomLengthLit
            + '<br>rocker weight = '
            + roundToDecimal(materialWeightUom, config.decimalPointsWeight)
            + uomWeightLit
            + '; combined weight = '
            + roundToDecimal(rocker.combinedWeight, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>eyepiece height from bottom of rocker = '
            + roundToDecimal(rocker.eyepieceHeight, config.decimalPointsDimension)
            + uomLengthLit
            + '<br><br>altitude friction of movement at eyepiece = '
            + roundToDecimal(friction.alt, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>azimuth friction of movement at eyepiece = '
            + roundToDecimal(friction.az, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>azimuth pad size = '
            + roundedPadSizeSideUom
            + uomDistanceLit
            + ' x '
            + roundedPadSizeSideUom
            + uomDistanceLit);
};

MLB.NewtDesigner.graphFlexRocker = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        calcDobFriction = MLB.calcLib.calcDobFriction,
        flexRocker = state.flexRocker,
        materials = MLB.materialFrictionJson.materials,
        altCoF = +materials[common.flexRockerAltBearingMaterialsSelect().get(0).selectedIndex].friction,
        azCoF = +materials[common.flexRockerAzBearingMaterialsSelect().get(0).selectedIndex].friction,
        pushAngleDegFromHorizontal = config.pushAngleDegFromHorizontal,
        momentArmInches = common.convertUomToInches(common.CGToEyepieceDistanceVal()),
        tubeWeightUom = common.flexRockerTubeWeightVal(),
        tubeWeightLbs = common.convertUomToLbs(tubeWeightUom),
        tubeOD = common.telescopeTubeODVal(),
        woodThickness = common.convertInchesToUom(config.woodThicknessInches),
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
        padThicknessUom,
        uomLengthLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        drawCircle = MLB.sharedLib.drawCircle,
        drawHorizDimen = MLB.sharedLib.drawHorizDimen,
        drawVertDimen = MLB.sharedLib.drawVertDimen,
        uom = MLB.sharedLib.uom,
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
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
        scaledCGHeight,
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

    altBearingSeparationHalfAngleRad = altBearingSeparationDeg * uom.degToRad / 2;
    altBearingSeparation = altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad) * 2;
    // assume bearings on outside edge
    altBearingSideToSideSeparation = tubeOD + altRimThickness * 2;
    altBearingHeight = altBearingRadius * Math.cos(altBearingSeparationHalfAngleRad);
    flexRockerThickness = common.convertInchesToUom(config.flexRockerThicknessInches);
    // tube swings through thickness of rocker, so base inner radius can be reduced
    swingAltBearingSeparation = altBearingSeparation - 2 * flexRockerThickness / Math.cos(altBearingSeparationHalfAngleRad);
    azInnerRadius = Math.sqrt(swingAltBearingSeparation * swingAltBearingSeparation + altBearingSideToSideSeparation * altBearingSideToSideSeparation) / 2;
    azOuterRadius = azInnerRadius * config.flexRockerBaseRingWidthFactor;
    baseRingHeight = azOuterRadius - azInnerRadius;

    // show work; save values
    flexRocker.rocker = {};
    flexRocker.rocker.width = altBearingSideToSideSeparation;
    flexRocker.rocker.length = altBearingSeparation;
    flexRocker.rocker.thickness = flexRockerThickness;
    flexRocker.rocker.volume = (2 * (flexRocker.rocker.width - 2 * flexRocker.rocker.thickness) + 2 * flexRocker.rocker.length) * flexRocker.rocker.thickness;
    flexRocker.rocker.weightLbs = config.woodLbsPerCubicFt * common.convertUomToCubicFt(flexRocker.rocker.volume);
    flexRocker.rocker.weightUom = common.convertLbsToUom(flexRocker.rocker.weightLbs);
    flexRocker.baseRing = {};
    flexRocker.baseRing.innerRadius = azInnerRadius;
    flexRocker.baseRing.outerRadius = azOuterRadius;
    flexRocker.baseRing.height = baseRingHeight;
    flexRocker.baseRing.volume = {};
    flexRocker.baseRing.volume.ring = (azOuterRadius * azOuterRadius * Math.PI - azInnerRadius * azInnerRadius * Math.PI) * woodThickness;
    // assume cylinder that separates upper and bottom rings of thickness = woodThickness at a mid-radius
    flexRocker.baseRing.volume.spacer = (flexRocker.baseRing.height - 2 * woodThickness) * Math.PI * (azOuterRadius - azInnerRadius) * woodThickness;
    // assume upper and bottom rings
    flexRocker.baseRing.volume.total = 2 * flexRocker.baseRing.volume.ring + flexRocker.baseRing.volume.spacer;
    flexRocker.baseRing.weightLbs = config.woodLbsPerCubicFt * common.convertUomToCubicFt(flexRocker.baseRing.volume.total);
    flexRocker.baseRing.weightUom = common.convertLbsToUom(flexRocker.baseRing.weightLbs);
    flexRocker.combinedWeight = tubeWeightUom + flexRocker.rocker.weightUom + flexRocker.baseRing.weightUom;

    calcFriction = calcDobFriction(azCoF, altCoF, momentArmInches, flexRocker.combinedWeight, tubeWeightLbs, azInnerRadius, altBearingRadius, altBearingSeparationDeg / 2, pushAngleDegFromHorizontal);
    flexRocker.friction = {};
    flexRocker.friction.alt = common.convertLbsToUom(calcFriction.alt);
    flexRocker.friction.az = common.convertLbsToUom(calcFriction.az);
    padSizeInchesSquared = flexRocker.combinedWeight / config.frictionOfMovementPadIdealPSI / 3;
    padSizeUom = common.convertInchesSquaredToUom(padSizeInchesSquared);
    flexRocker.friction.padSizeSideUom = Math.sqrt(padSizeUom);
    roundedPadSizeSideUom = roundToDecimal(flexRocker.friction.padSizeSideUom, config.decimalPointsCG);
    padThicknessUom = common.convertInchesToUom(config.padThicknessInches);
    flexRocker.CGHeight = altBearingRadius * Math.cos(altBearingSeparationHalfAngleRad) + flexRocker.rocker.thickness + padThicknessUom + flexRocker.baseRing.height;
    flexRocker.eyepieceHeight = flexRocker.CGHeight + common.CGToEyepieceDistanceVal();

    // scaled dimensions
    scaledAzInnerRadius = state.scalingFactor * azInnerRadius;
    scaledAzOuterRadius = state.scalingFactor * azOuterRadius;
    scaledAltBearingRadius = state.scalingFactor * altBearingRadius;
    scaledAltBearingSeparation = state.scalingFactor * altBearingSeparation;
    scaledAltBearingSideToSideSeparation = state.scalingFactor * altBearingSideToSideSeparation;
    scaledAltBearingHeight = state.scalingFactor * altBearingHeight;
    scaledBaseRingHeight = state.scalingFactor * baseRingHeight;
    scaledFlexRockerThickness = state.scalingFactor * flexRockerThickness;
    scaledPadSizeSideUom = state.scalingFactor * flexRocker.friction.padSizeSideUom;
    scaledPadThicknessUom = state.scalingFactor * padThicknessUom;
    scaledCGHeight = state.scalingFactor * flexRocker.CGHeight;

    // build canvas, context
    common.flexRockerCanvasDiv().append(buildCanvasElement('flexRockerCanvas', scaledAzOuterRadius * 6, scaledAzOuterRadius * 2.5));
    canvas = common.flexRockerCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
    // calc key points
    topViewCenterPt = point(canvas.width / 4, canvas.height / 2);
    sideViewCenterPt = point(canvas.width * 3 / 4, topViewCenterPt.y);

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

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }
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
    text = config.flexRockerCGHeight + roundToDecimal(flexRocker.CGHeight, config.decimalPointsDimension) + uomLengthLit;
    dimensionX = baseRingSideViewRect.x - 2 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, sideViewCGPt.y, sideViewCGPt.y + scaledCGHeight, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    text = config.flexRockerTubeSwingText + roundToDecimal(altBearingRadius, config.decimalPointsDimension) + uomLengthLit;
    dimensionX += 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, sideViewCGPt.y, sideViewCGPt.y + scaledAltBearingRadius, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
    text = config.flexRockerBaseRingHeightText + roundToDecimal(baseRingHeight, config.decimalPointsDimension) + uomLengthLit;
    dimensionX += 4 * config.canvasDimensionHalfHeight;
    drawVertDimen(context, text, dimensionX, baseRingSideViewRect.y, baseRingSideViewRect.endY, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

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
            + ' high<br>flex rocker weight = '
            + roundToDecimal(flexRocker.rocker.weightUom, config.decimalPointsWeight)
            + uomWeightLit
            + '; base ring weight = '
            + roundToDecimal(flexRocker.baseRing.weightUom, config.decimalPointsWeight)
            + uomWeightLit
            + '; combined weight = '
            + roundToDecimal(flexRocker.combinedWeight, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>eyepiece height from bottom of base ring = '
            + roundToDecimal(flexRocker.eyepieceHeight, config.decimalPointsDimension)
            + uomLengthLit
            + '<br><br>altitude friction of movement at eyepiece = '
            + roundToDecimal(flexRocker.friction.alt, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>azimuth friction of movement at eyepiece = '
            + roundToDecimal(flexRocker.friction.az, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>azimuth pad size = '
            + roundedPadSizeSideUom
            + uomLengthLit
            + ' x '
            + roundedPadSizeSideUom
            + uomLengthLit);
};

// get highest tilt and yaw: empirical testing by calculating altitude for all azimuths shows that highest tilt occurs at east/west horizons
MLB.NewtDesigner.setEquatorialTableMaxTiltYaw = function () {
    var common = MLB.NewtDesigner.common,
        uom = MLB.sharedLib.uom,
        ConvertStyle = MLB.coordLib.ConvertStyle,
        XForm = MLB.coordLib.XForm,
        xform = new XForm(ConvertStyle.trig, common.ETLatitudeDegVal() * uom.degToRad);

    xform.presetAltaz();
    xform.position.SidT = 0;
    xform.position.az = uom.qtrRev;
    xform.position.alt = 0;
    xform.getEquat();
    xform.position.SidT = common.ETTrackingTimeMinVal() / 2 * uom.minToRad;
    xform.getAltaz();

    return {
        platformMaxTiltDeg: xform.position.alt / uom.degToRad,
        platformMaxYawDeg: (xform.position.az - uom.qtrRev) / uom.degToRad
    };
};

// standard rocker...
// estimate weight of moving part of table: use rocker box footprint, knowing that polar axis can be adjusted to pass through combined scope+platform CG
MLB.NewtDesigner.setEquatorialTableStandardPlatformCG = function () {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        platform = {},
        woodThickness = common.convertInchesToUom(config.woodThicknessInches),
        padThicknessUom = common.convertInchesToUom(config.padThicknessInches);

    platform.width = state.rocker.width;
    platform.length = state.rocker.length;
    // platform declared as dbl wood thickness
    platform.thickness = woodThickness * 2;
    platform.volume = platform.width * platform.length * platform.thickness;
    platform.weightLbs = config.woodLbsPerCubicFt * common.convertUomToCubicFt(platform.volume);
    platform.weightUom = common.convertLbsToUom(platform.weightLbs);
    // get combined CG; bottom of platform piece has CG = 0; show work in progress
    platform.CG = {};
    platform.CG.weight = {};
    platform.CG.weight.OTA = common.tubeWeightVal();
    platform.CG.weight.rocker = state.rocker.weight;
    platform.CG.weight.platform = platform.weightUom;
    platform.CG.weight.total = platform.CG.weight.OTA + platform.CG.weight.rocker + platform.CG.weight.platform;
    platform.CG.OTA = state.CG.heightToClearRockerBottomDistance + state.rocker.baseBoardThickness + padThicknessUom + platform.thickness;
    platform.CG.rocker = state.rocker.CG / 2 + padThicknessUom + platform.thickness;
    platform.CG.platform = platform.thickness / 2;
    platform.CG.momentArm = {};
    platform.CG.momentArm.OTA = platform.CG.weight.OTA * platform.CG.OTA;
    platform.CG.momentArm.rocker = platform.CG.weight.rocker * platform.CG.rocker;
    platform.CG.momentArm.platform = platform.CG.weight.platform * platform.CG.platform;
    platform.CG.momentArm.total = platform.CG.momentArm.OTA + platform.CG.momentArm.rocker + platform.CG.momentArm.platform;
    platform.CG.combined = platform.CG.momentArm.total / platform.CG.weight.total;

    return platform;
};

// flex rocker...
// base ring acts as the equatorial platform; bottom of base ring has CG = 0; show work in progress
MLB.NewtDesigner.setEquatorialTableFlexRockerPlatformCG = function () {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        flexRockerPlatform = {},
        padThicknessUom = common.convertInchesToUom(config.padThicknessInches);

    flexRockerPlatform.CG = {};
    flexRockerPlatform.CG.weight = {};
    flexRockerPlatform.CG.weight.OTA = common.tubeWeightVal();
    flexRockerPlatform.CG.weight.rocker = state.flexRocker.rocker.weightUom;
    flexRockerPlatform.CG.weight.baseRing = state.flexRocker.baseRing.weightUom;
    flexRockerPlatform.CG.weight.total = flexRockerPlatform.CG.weight.OTA + flexRockerPlatform.CG.weight.rocker + flexRockerPlatform.CG.weight.baseRing;
    flexRockerPlatform.CG.OTA = state.flexRocker.CGHeight;
    flexRockerPlatform.CG.rocker = state.flexRocker.baseRing.height + padThicknessUom + state.flexRocker.rocker.thickness / 2;
    flexRockerPlatform.CG.baseRing = state.flexRocker.baseRing.height / 2;
    flexRockerPlatform.CG.momentArm = {};
    flexRockerPlatform.CG.momentArm.OTA = flexRockerPlatform.CG.weight.OTA * flexRockerPlatform.CG.OTA;
    flexRockerPlatform.CG.momentArm.rocker = flexRockerPlatform.CG.weight.rocker * flexRockerPlatform.CG.rocker;
    flexRockerPlatform.CG.momentArm.baseRing = flexRockerPlatform.CG.weight.baseRing * flexRockerPlatform.CG.baseRing;
    flexRockerPlatform.CG.momentArm.total = flexRockerPlatform.CG.momentArm.OTA + flexRockerPlatform.CG.momentArm.rocker + flexRockerPlatform.CG.momentArm.baseRing;
    flexRockerPlatform.CG.combined = flexRockerPlatform.CG.momentArm.total / flexRockerPlatform.CG.weight.total;

    return flexRockerPlatform;
};

/* consider a right angle triangle upside down where
   the hypotenuse is on the bottom and consists of the line between the south polar point and platformX;
   the angle from the point(x, y) to the intersect point with the polar axis is 90 deg - latitude;
   then the length to the intersect point is cos(this angle) * hypotenuse;
   and the intersect point is the cos/sin of this angle * the intersect line's length + offsets in X and Y;
  */
MLB.NewtDesigner.ETSideViewBearingPlane = function (hypotenuse, compLat, startX, startY) {
    var point = MLB.sharedLib.point,
        length = Math.cos(compLat) * hypotenuse,
        x = startX + Math.cos(compLat) * length,
        y = startY - Math.sin(compLat) * length,
        pt = point(x, y);

    return {
        hypotenuse: hypotenuse,
        length: length,
        x: x,
        y: y,
        pt: pt
    };
};

// sideViewIntersectLength is in the compLat plane;
// delta x,y from intercept point in the compLat plane
MLB.NewtDesigner.ETFrontViewTrackingArcPts = function (centerLineToBearingDistanceX, sideViewIntersectLength, trackAngleRad, compLat) {
    var radius = Math.sqrt(centerLineToBearingDistanceX * centerLineToBearingDistanceX + sideViewIntersectLength * sideViewIntersectLength),
        bearingAngleRad = Math.atan(centerLineToBearingDistanceX / sideViewIntersectLength),
        bearingHighAngleRad = bearingAngleRad + trackAngleRad / 2,
        bearingLowAngleRad = bearingAngleRad - trackAngleRad / 2,
        sinCompLat = Math.sin(compLat),

        bearingHighAngleDeltaXY = {
            x: radius * Math.sin(bearingHighAngleRad),
            y: sinCompLat * radius * Math.cos(bearingHighAngleRad)
        },
        bearingAngleDeltaXY = {
            x: radius * Math.sin(bearingAngleRad),
            y: sinCompLat * radius * Math.cos(bearingAngleRad)
        },
        bearingLowAngleDeltaXY = {
            x: radius * Math.sin(bearingLowAngleRad),
            y: sinCompLat * radius * Math.cos(bearingLowAngleRad)
        };

    return {
        radius: radius,
        bearingHighAngleRad: bearingHighAngleRad,
        bearingAngleRad: bearingAngleRad,
        bearingLowAngleRad: bearingLowAngleRad,
        bearingHighAngleDeltaXY: bearingHighAngleDeltaXY,
        bearingAngleDeltaXY: bearingAngleDeltaXY,
        bearingLowAngleDeltaXY: bearingLowAngleDeltaXY
    };
};

MLB.NewtDesigner.drawFrontViewTrackingArcs = function (intersectPt, trackArc, context) {
    var config = MLB.NewtDesigner.config,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        leftHighBearingPt = point(intersectPt.x - trackArc.bearingHighAngleDeltaXY.x, intersectPt.y + trackArc.bearingHighAngleDeltaXY.y),
        leftBearingPt = point(intersectPt.x - trackArc.bearingAngleDeltaXY.x, intersectPt.y + trackArc.bearingAngleDeltaXY.y),
        leftLowBearingPt = point(intersectPt.x - trackArc.bearingLowAngleDeltaXY.x, intersectPt.y + trackArc.bearingLowAngleDeltaXY.y),
        leftInteriorPt = point(leftLowBearingPt.x, leftHighBearingPt.y),
        rightHighBearingPt = point(intersectPt.x + trackArc.bearingHighAngleDeltaXY.x, intersectPt.y + trackArc.bearingHighAngleDeltaXY.y),
        rightBearingPt = point(intersectPt.x + trackArc.bearingAngleDeltaXY.x, intersectPt.y + trackArc.bearingAngleDeltaXY.y),
        rightLowBearingPt = point(intersectPt.x + trackArc.bearingLowAngleDeltaXY.x, intersectPt.y + trackArc.bearingLowAngleDeltaXY.y),
        rightInteriorPt = point(rightLowBearingPt.x, rightHighBearingPt.y);

    // the arcs

    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, leftHighBearingPt, leftBearingPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, leftBearingPt, leftLowBearingPt);

    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, rightHighBearingPt, rightBearingPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, rightBearingPt, rightLowBearingPt);

    // the angles (just do the right side for now)

    //drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, leftHighBearingPt, intersectPt);
    //drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, leftLowBearingPt, intersectPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, rightHighBearingPt, intersectPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, rightLowBearingPt, intersectPt);

    // complete the arcs (just do the left side for now)
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, leftHighBearingPt, leftInteriorPt);
    drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, leftInteriorPt, leftLowBearingPt);
    //drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, rightHighBearingPt, rightInteriorPt);
    //drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, rightInteriorPt, rightLowBearingPt);

    return {
        width: leftInteriorPt.x - leftHighBearingPt.x,
        leftHighBearingPt: leftHighBearingPt,
        leftBearingPt: leftBearingPt,
        leftLowBearingPt: leftLowBearingPt,
        rightHighBearingPt: rightHighBearingPt,
        rightBearingPt: rightBearingPt,
        rightLowBearingPt: rightLowBearingPt
    };
};

MLB.NewtDesigner.ETSideViewDrawArcExtension = function (context, platformX, platformY, arcLowY, compLat) {
    var config = MLB.NewtDesigner.config,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        deltaX = (arcLowY - platformY) / Math.tan(compLat);

    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(platformX, platformY), point(platformX - deltaX, arcLowY));
};

MLB.NewtDesigner.graphEquatorialTable = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        uom = MLB.sharedLib.uom,
        setEquatorialTableMaxTiltYaw = MLB.NewtDesigner.setEquatorialTableMaxTiltYaw,
        setEquatorialTableStandardPlatformCG = MLB.NewtDesigner.setEquatorialTableStandardPlatformCG,
        setEquatorialTableFlexRockerPlatformCG = MLB.NewtDesigner.setEquatorialTableFlexRockerPlatformCG,
        ETSideViewBearingPlane = MLB.NewtDesigner.ETSideViewBearingPlane,
        ETSideViewDrawArcExtension = MLB.NewtDesigner.ETSideViewDrawArcExtension,
        ETFrontViewTrackingArcPts = MLB.NewtDesigner.ETFrontViewTrackingArcPts,
        drawFrontViewTrackingArcs = MLB.NewtDesigner.drawFrontViewTrackingArcs,

        yaw,
        southTrack = {},
        northTrack = {},
        platform,
        flexRockerPlatform,
        uomLengthLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),
        latitudeRad = common.ETLatitudeDegVal() * uom.degToRad,

        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
        point = MLB.sharedLib.point,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        drawRect = MLB.sharedLib.drawRect,
        canvas,
        context,

        ETCGSidePt,
        ETCGFrontPt,
        platformSideRect,
        platformFrontRect,
        scaledRockerSideLength,
        scaledRockerFrontWidth,
        scaledPlatformThickness,
        scaledETCGToPlatformBottom,
        platformBottomY,
        latitudeRadOffsetPt,
        southPolarPt,
        northPolarPt,
        compLat,
        sideViewSouthIntersect,
        sideViewNorthIntersect,
        halfPlatformFrontViewX,
        trackAngleRad,
        frontViewSouthIntersectPt,
        frontViewNorthIntersectPt,
        frontViewSouthTrackArc,
        frontViewNorthTrackArc,
        frontViewSouthDrawnArc,
        frontViewNorthDrawnArc;

    yaw = setEquatorialTableMaxTiltYaw();

    // get scaled dimens
    platform = setEquatorialTableStandardPlatformCG();
    scaledRockerSideLength = state.scalingFactor * state.rocker.length;
    scaledRockerFrontWidth = state.scalingFactor * state.rocker.width;
    scaledPlatformThickness = state.scalingFactor * platform.thickness;
    scaledETCGToPlatformBottom = state.scalingFactor * platform.CG.combined;

    // for flex rocker
    flexRockerPlatform = setEquatorialTableFlexRockerPlatformCG();
    /*
    scaledRockerSideLength = state.scalingFactor * state.flexRocker.baseRing.outerRadius * 2;
    scaledRockerFrontWidth = scaledRockerSideLength;
    scaledPlatformThickness = state.scalingFactor * state.flexRocker.baseRing.height;
    scaledETCGToPlatformBottom = state.scalingFactor * flexRockerPlatform.CG.combined;
    */

    // build canvas, context
    common.ETCanvasDiv().append(buildCanvasElement('ETCanvas', 5 * scaledRockerSideLength, 1.5 * scaledETCGToPlatformBottom));
    canvas = common.ETCanvasID();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = config.canvasFont;

    // calculate geometry...

    // canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
    // calc key points
    ETCGSidePt = point(canvas.width / 6, 4 * config.canvasDimensionHalfHeight);
    ETCGFrontPt = point(canvas.width * 2 / 3, ETCGSidePt.y);
    platformBottomY = ETCGSidePt.y + scaledETCGToPlatformBottom;
    // side view
    southPolarPt = point(ETCGSidePt.x + scaledETCGToPlatformBottom / Math.tan(latitudeRad), platformBottomY);
    northPolarPt = point(ETCGSidePt.x - ETCGSidePt.y / Math.tan(latitudeRad), 0);

    // platform rectangles for side and front views
    platformSideRect = rect(ETCGSidePt.x - scaledRockerSideLength / 2, platformBottomY - scaledPlatformThickness, scaledRockerSideLength, scaledPlatformThickness);
    platformFrontRect = rect(ETCGFrontPt.x - scaledRockerFrontWidth / 2, platformBottomY - scaledPlatformThickness, scaledRockerFrontWidth, scaledPlatformThickness);

    compLat = uom.qtrRev - latitudeRad;

    // side view

    // latitude line goes through ETCGSidePt and southPolarPt;
    // south arc pts are platformSideRect.endX & .endY
    sideViewSouthIntersect = new ETSideViewBearingPlane(southPolarPt.x - platformSideRect.endX, compLat, platformSideRect.endX, platformSideRect.endY);
    // north arc points are platformSideRect.x & .endY
    sideViewNorthIntersect = new ETSideViewBearingPlane(southPolarPt.x - platformSideRect.x, compLat, platformSideRect.x, platformSideRect.endY);

    // front view

    // bearings placed at corners of platform
    trackAngleRad = common.ETTrackingTimeMinVal() * uom.minToRad;
    // note: calculated in the compLat plane
    halfPlatformFrontViewX = platformFrontRect.width / 2;
    // transfer over the intersect points from the side view
    frontViewSouthIntersectPt = point(platformFrontRect.x + halfPlatformFrontViewX, sideViewSouthIntersect.pt.y);
    frontViewNorthIntersectPt = point(platformFrontRect.x + halfPlatformFrontViewX, sideViewNorthIntersect.pt.y);
    // get the x,y of the tracking points (high track point, bearing point, low track point)
    frontViewSouthTrackArc = new ETFrontViewTrackingArcPts(halfPlatformFrontViewX, sideViewSouthIntersect.length, trackAngleRad, compLat);
    frontViewNorthTrackArc = new ETFrontViewTrackingArcPts(halfPlatformFrontViewX, sideViewNorthIntersect.length, trackAngleRad, compLat);

    if (config.drawCanvasOutline) {
        drawCanvasOutline(context, canvas);
    }
    if (config.drawTestLines) {
        // draw latitude through CG
        latitudeRadOffsetPt = point(1000 * Math.cos(latitudeRad), 1000 * Math.sin(latitudeRad));
        drawLine(context, config.canvasTestStyle, config.canvasLineWidth, ETCGSidePt, point(ETCGSidePt.x + latitudeRadOffsetPt.x, ETCGSidePt.y + latitudeRadOffsetPt.y));
        drawLine(context, config.canvasTestStyle, config.canvasLineWidth, ETCGSidePt, point(ETCGSidePt.x - latitudeRadOffsetPt.x, ETCGSidePt.y - latitudeRadOffsetPt.y));
    }

    // draw...

    // side view

    // platform
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, platformSideRect);
    // draw latitude through CG
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, ETCGSidePt, southPolarPt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, ETCGSidePt, northPolarPt);
    // draw azimuth axis
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(ETCGSidePt.x, 0), point(ETCGSidePt.x, southPolarPt.y));
    // draw intersecting tracking axes
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(platformSideRect.endX, platformSideRect.endY), sideViewSouthIntersect.pt);
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(platformSideRect.x, platformSideRect.endY), sideViewNorthIntersect.pt);

    // front view

    // platform
    drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, platformFrontRect);
    // draw azimuth axis
    drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, point(ETCGFrontPt.x, 0), point(ETCGFrontPt.x, southPolarPt.y));
    // draw tracking arcs
    frontViewSouthDrawnArc = drawFrontViewTrackingArcs(frontViewSouthIntersectPt, frontViewSouthTrackArc, context);
    frontViewNorthDrawnArc = drawFrontViewTrackingArcs(frontViewNorthIntersectPt, frontViewNorthTrackArc, context);

    // return to the side view

    //after the front view's arc have been calculated, go back to the side view and complete the tracking radius arcs
    new ETSideViewDrawArcExtension(context, platformSideRect.endX, platformSideRect.endY, frontViewSouthDrawnArc.leftLowBearingPt.y, compLat);
    new ETSideViewDrawArcExtension(context, platformSideRect.x, platformSideRect.endY, frontViewNorthDrawnArc.leftLowBearingPt.y, compLat);

    // label views
    context.fillStyle = config.canvasStructureLightStyle;
    context.fillText(config.centerOfGravityText + ' ' + config.sideViewLit, ETCGSidePt.x, ETCGSidePt.y);
    context.fillText(config.frontViewLit, ETCGFrontPt.x, ETCGFrontPt.y);

    // save values
    southTrack.radius = frontViewSouthTrackArc.radius / state.scalingFactor;
    southTrack.bearingSeparationAngleDeg = frontViewSouthTrackArc.bearingAngleRad * 2 / uom.degToRad;
    southTrack.arcWidth = frontViewSouthDrawnArc.width / state.scalingFactor;

    northTrack.radius = frontViewNorthTrackArc.radius / state.scalingFactor;
    northTrack.bearingSeparationAngleDeg = frontViewNorthTrackArc.bearingAngleRad * 2 / uom.degToRad;
    northTrack.arcWidth = frontViewNorthDrawnArc.width / state.scalingFactor;

    // write results
    common.ETResults().html('latitude = '
            + common.ETLatitudeDegVal()
            + ' deg<br>tracking time = '
            + common.ETTrackingTimeMinVal()
            + ' min<br>max pitch = '
            + roundToDecimal(yaw.platformMaxTiltDeg, config.decimalPointsAngle)
            + ' deg; max yaw = '
            + roundToDecimal(yaw.platformMaxYawDeg, config.decimalPointsAngle)
            + ' deg<br>south tracking radius = '
            + roundToDecimal(southTrack.radius, config.decimalPointsDimension)
            + uomLengthLit
            + '; bearing separation angle = '
            + roundToDecimal(southTrack.bearingSeparationAngleDeg, config.decimalPointsAngle)
            + ' deg; arc width = '
            + roundToDecimal(southTrack.arcWidth, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>north tracking radius = '
            + roundToDecimal(northTrack.radius, config.decimalPointsDimension)
            + uomLengthLit
            + '; bearing separation angle = '
            + roundToDecimal(northTrack.bearingSeparationAngleDeg, config.decimalPointsAngle)
            + ' deg; arc width = '
            + roundToDecimal(northTrack.arcWidth, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>platform size = '
            + roundToDecimal(state.rocker.length, config.decimalPointsDimension)
            + uomLengthLit
            + ' long x '
            + roundToDecimal(state.rocker.width, config.decimalPointsDimension)
            + uomLengthLit
            + ' wide x '
            + roundToDecimal(platform.thickness, config.decimalPointsDimension)
            + uomLengthLit
            + ' thick<br>platform weight = '
            + roundToDecimal(platform.weightUom, config.decimalPointsWeight)
            + uomWeightLit
            + '<br>total weight = '
            + roundToDecimal(platform.CG.weight.total, config.decimalPointsWeight)
            + uomWeightLit);
            /* for flex rocker
            + '; total flexRocker weight = '
            + roundToDecimal(flexRockerPlatform.CG.weight.total, config.decimalPointsWeight)
            + uomWeightLit
            + '<br> total CG = '
            + roundToDecimal(platform.CG.combined, config.decimalPointsCG)
            + uomLengthLit
            + '; total flexRocker CG = '
            + roundToDecimal(flexRockerPlatform.CG.combined, config.decimalPointsCG)
            + uomLengthLit
            */
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
MLB.NewtDesigner.buildCGHtmlTable = function () {
    var config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
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

// based on starting default hard coded 10" f/5 example
MLB.NewtDesigner.seedCGTable = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
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

MLB.NewtDesigner.updateCGDistances = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
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
};

MLB.NewtDesigner.calcCGSensitivity = function () {
    var state = MLB.NewtDesigner.state,
        CG = state.CG,
        // either 1 lb or 1 kg
        weightToAdd = 1;

    return (CG.weight * CG.CG + weightToAdd * state.mirrorFrontEdgeToFocalPlaneDistance) / (CG.weight + weightToAdd) - CG.CG;
};

MLB.NewtDesigner.calcCG = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        common = MLB.NewtDesigner.common,
        config = MLB.NewtDesigner.config,
        CG = state.CG,
        calcCGSensitivity = MLB.NewtDesigner.calcCGSensitivity,
        weightElements,
        distanceElements,
        weight,
        distance,
        momentArm,
        totalWeight = 0,
        totalMomentArm = 0,
        uomLengthLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit();

    weightElements = common.weightElements();
    distanceElements = common.distanceElements();

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
    common.CGToEyepieceDistance().val(roundToDecimal(state.mirrorFrontEdgeToFocalPlaneDistance - CG.CG, config.decimalPointsCG));
    common.tubeWeight().val(roundToDecimal(totalWeight, config.decimalPointsCG));
    common.flexRockerCGToEyepieceDistance().val(common.CGToEyepieceDistanceVal());
    common.flexRockerTubeWeight().val(common.tubeWeightVal());
    common.flexRockerCGToBackEdgeOfTubeClearance().val(roundToDecimal(CG.heightToClearRockerBottomDistance, config.decimalPointsCG));

    common.CGResults().html('Total weight = '
            + roundToDecimal(totalWeight, config.decimalPointsWeight)
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

MLB.NewtDesigner.updateFieldsDependentOnFocalRatio = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        calcSagitta = MLB.calcLib.calcSagitta,
        sagitta,
        aperture = common.apertureVal(),
        focalRatio = common.focalRatioVal(),
        focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
        focalLength = aperture * focalRatio,
        focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter;

    sagitta = calcSagitta(aperture, focalRatio);
    focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter = focalLength - focalPlaneToDiagDistance - sagitta;
    // update focuser, diagonal, spider, eyepiece distance
    // not state.mirrorFrontEdgeToFocalPlaneDistance as it is updated once in graphBaffle() and not subsequently when the Tube assembly designer is visible
    $('[name=CGDistance' + config.CGIxs.focuser + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
    $('[name=CGDistance' + config.CGIxs.diagonal + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
    $('[name=CGDistance' + config.CGIxs.spider + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
    $('[name=CGDistance' + config.CGIxs.eyepiece + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
    // also update tube CG distance...
    $('[name=CGDistance' + config.CGIxs.tube + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter / 2, config.decimalPointsDimension));

    state.lastFocalRatio = common.focalRatioVal();
};

MLB.NewtDesigner.updateFieldsDependentOnAperture = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        newTubeOD = common.apertureVal() + common.telescopeTubeThicknessVal() * 2 + common.maxFieldDiaDiagVal(),
        conversionFactor = common.convertLbsToUom(config.glassLbsPer144CubicInches),
        weight = Math.pow(common.apertureInchesVal() / 2, 2) * Math.PI * config.primaryMirrorThicknessInches * conversionFactor;

    common.focalPlaneToDiagDistance().val(roundToDecimal(common.focalPlaneToDiagDistanceVal() + (common.apertureVal() - state.lastAperture) / 2, config.decimalPointsDiag));
    common.telescopeTubeOD().val(roundToDecimal(newTubeOD, config.decimalPointsTube));
    $('[name=CGWeight' + config.CGIxs.primaryMirror + ']').val(roundToDecimal(weight, config.decimalPointsCG));

    state.lastAperture = common.apertureVal();
};

MLB.NewtDesigner.setSelectedComaCorrector = function (comaCorrectorsIx) {
    var common = MLB.NewtDesigner.common,
        comaCorrectorsJson = MLB.comaCorrectorsJson,
        comaCorrector = comaCorrectorsJson.comaCorrectors[comaCorrectorsIx];

    common.comaCorrectorMag().val(comaCorrector.magnification);
};

MLB.NewtDesigner.updateEyepieceOptimizerRows = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
        getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
        calcLimitingMagnitudeFromPupil = MLB.NewtDesigner.calcLimitingMagnitudeFromPupil,
        convertApertureToCm = MLB.NewtDesigner.convertApertureToCm,
        calcEtendue = MLB.NewtDesigner.calcEtendue,
        resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
        calcGreaterComaWithComaCorrector = MLB.calcLib.calcGreaterComaWithComaCorrector,
        limitingMagnitude = MLB.calcLib.limitingMagnitude,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        apertureInches = common.apertureInchesVal(),
        focalRatio = common.focalRatioVal(),
        highMagnitudeLimit = limitingMagnitude(common.apertureInchesVal()),
        eyepieceFocalLengthmm,
        eyepieceFieldStopmm,
        exitPupil,
        resultFOV,
        magnification,
        resolutionArcsec,
        magnitudeLimit,
        etendue,
        coma,
        ix;

    // update eye pupil, true field of view, magnification, resolution, magnitude limit, etendue and coma for each eyepiece row that's been selected
    for (ix = 0; ix < config.eyepieceRows; ix += 1) {
        if (state.eyeOptRowSet[ix]) {
            // get reused vars from page
            eyepieceFocalLengthmm = parseFloat(common.tableElement(config.EyeOptFocalLengthID, ix).html());
            eyepieceFieldStopmm = parseFloat(common.tableElement(config.EyeOptFieldStopID, ix).html());
            // calc
            magnification = apertureInches * focalRatio / eyepieceFocalLengthmm * 25.4 * comaCorrectorMag;
            resolutionArcsec = resolutionFromAperture_Magnification(apertureInches, magnification);
            // ensure that focal ratio has been calculated and updated prior
            resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(apertureInches, focalRatio, eyepieceFieldStopmm, comaCorrectorMag);
            exitPupil = eyepieceFocalLengthmm / focalRatio / comaCorrectorMag;
            magnitudeLimit = calcLimitingMagnitudeFromPupil(highMagnitudeLimit, exitPupil);
            // resultFOV already includes coma corrector magnification factor
            etendue = calcEtendue(convertApertureToCm(), resultFOV);
            coma = calcGreaterComaWithComaCorrector(eyepieceFieldStopmm, focalRatio, common.useComaCorrectorMagVal());
            // display
            common.tableElement(config.EyeOptExitPupilID, ix).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + config.mmLitNS);
            common.tableElement(config.EyeOptFOVID, ix).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + config.degLitNS);
            common.tableElement(config.EyeOptMagnificationID, ix).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
            common.tableElement(config.EyeOptResolutionID, ix).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');
            common.tableElement(config.EyeOptLimitingMagnitudeID, ix).html(roundToDecimal(magnitudeLimit, config.decimalPointsLimitingMagnitude));
            common.tableElement(config.EyeOpEtendueID, ix).html(roundToDecimal(etendue, config.decimalPointsEtendue) + config.etendueLit);
            common.tableElement(config.EyeOptComaID, ix).html(roundToDecimal(coma, config.decimalPointsComaRMS) + config.comaRMSLit);
        }
    }
};

MLB.NewtDesigner.setEyeOptSelectedEyepiece = function (idIx, selectedIndex) {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        eyepiecesJson = MLB.eyepiecesJson,
        eyepiece = eyepiecesJson.eyepieces[selectedIndex],
        calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
        resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
        calcGreaterComaWithComaCorrector = MLB.calcLib.calcGreaterComaWithComaCorrector,
        calcLimitingMagnitudeFromPupil = MLB.NewtDesigner.calcLimitingMagnitudeFromPupil,
        convertApertureToCm = MLB.NewtDesigner.convertApertureToCm,
        calcEtendue = MLB.NewtDesigner.calcEtendue,
        limitingMagnitude = MLB.calcLib.limitingMagnitude,
        getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        focalRatio = common.focalRatioVal(),
        aperture = common.apertureVal(),
        apertureInches = common.apertureInchesVal(),
        magnification = aperture * focalRatio / +eyepiece.focalLengthmm * 25.4 * comaCorrectorMag,
        resolutionArcsec = resolutionFromAperture_Magnification(aperture, magnification),
        resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(aperture, focalRatio, +eyepiece.fieldStopmm, comaCorrectorMag),
        exitPupil = +eyepiece.focalLengthmm / focalRatio / comaCorrectorMag,
        highMagnitudeLimit = limitingMagnitude(apertureInches),
        magnitudeLimit = calcLimitingMagnitudeFromPupil(highMagnitudeLimit, exitPupil),
        // resultFOV already includes coma corrector magnification factor
        etendue = calcEtendue(convertApertureToCm(), resultFOV),
        coma = calcGreaterComaWithComaCorrector(+eyepiece.fieldStopmm, focalRatio, common.useComaCorrectorMagVal());

    common.tableElement(config.EyeOptManufacturerID, idIx).html(eyepiece.manufacturer);
    common.tableElement(config.EyeOptTypeID, idIx).html(eyepiece.type);
    common.tableElement(config.EyeOptFocalLengthID, idIx).html(roundToDecimal(+eyepiece.focalLengthmm, config.decimalPointsEyepieceFL) + config.mmLitNS);
    common.tableElement(config.EyeOptFieldStopID, idIx).html(roundToDecimal(+eyepiece.fieldStopmm, config.decimalPointsEyepieceFieldStop) + config.mmLitNS);
    common.tableElement(config.EyeOptExitPupilID, idIx).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + config.mmLitNS);
    common.tableElement(config.EyeOptApparentFieldID, idIx).html(roundToDecimal(+eyepiece.apparentField, config.decimalPointsEyepieceApparentFOV) + config.degLitNS);
    common.tableElement(config.EyeOptFOVID, idIx).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + config.degLitNS);
    common.tableElement(config.EyeOptMagnificationID, idIx).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
    common.tableElement(config.EyeOptResolutionID, idIx).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');
    common.tableElement(config.EyeOptLimitingMagnitudeID, idIx).html(roundToDecimal(magnitudeLimit, config.decimalPointsLimitingMagnitude));
    common.tableElement(config.EyeOpEtendueID, idIx).html(roundToDecimal(etendue, config.decimalPointsEtendue) + config.etendueLit);
    common.tableElement(config.EyeOptComaID, idIx).html(roundToDecimal(coma, config.decimalPointsComaRMS) + config.comaRMSLit);

    state.eyeOptRowSet[idIx] = true;
};

MLB.NewtDesigner.calcEyepieceWidestFieldForEyePupil = function (focalRatio, aperture, maxPupil) {
    var common = MLB.NewtDesigner.common,
        eyepiecesJson = MLB.eyepiecesJson,
        calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
        calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
        getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
        comaCorrectorMag = getComaCorrectorMagnificationFactor(),
        widestFOV,
        pupilWidestFOV,
        bestIx;

    $.each(eyepiecesJson.eyepieces, function (i, v) {
        var FOV,
            eyePupil;

        FOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(aperture, focalRatio, +v.fieldStopmm, comaCorrectorMag);
        eyePupil = calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(common.apertureInchesVal(), FOV, +v.focalLengthmm, +v.fieldStopmm);
        if (eyePupil <= maxPupil && (widestFOV === undefined || widestFOV < FOV)) {
            // eyepiece = v
            widestFOV = FOV;
            pupilWidestFOV = eyePupil;
            bestIx = i;
        }
    });

    return {
        eyepiece: eyepiecesJson.eyepieces[bestIx],
        FOV: widestFOV,
        pupil: pupilWidestFOV
    };
};

MLB.NewtDesigner.findWidestFieldEyepiece = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        calcEyepieceWidestFieldForEyePupil = MLB.NewtDesigner.calcEyepieceWidestFieldForEyePupil,
        focalRatio = common.focalRatioVal(),
        aperture = common.apertureInchesVal(),
        maxPupil = common.eyePupilmmVal(),
        bestEyepiece = calcEyepieceWidestFieldForEyePupil(focalRatio, aperture, maxPupil);

    common.widestEyepiecesForEyePupilLabel().html(': best eyepiece is '
            + bestEyepiece.eyepiece.manufacturer
            + ' '
            + bestEyepiece.eyepiece.type
            + ' '
            + bestEyepiece.eyepiece.focalLengthmm
            + config.mmLitNS
            + ', '
            + bestEyepiece.eyepiece.apparentField
            + 'deg, FOV='
            + roundToDecimal(bestEyepiece.FOV, config.decimalPointsFOV)
            + ' deg, pupil='
            + roundToDecimal(bestEyepiece.pupil, config.decimalPointsEyePupil)
            + config.mmLitNS);
};

MLB.NewtDesigner.setSelectedFocuser = function (focusersIx) {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        focusersJson = MLB.focusersJson,
        focuser = focusersJson.focusers[focusersIx];

    common.focuserRackedInHeight().val(roundToDecimal(common.convertInchesToUom(+focuser.rackedInHeightInches), config.decimalPointsFocuser));
    common.focuserTravel().val(roundToDecimal(common.convertInchesToUom(+focuser.travelInches), config.decimalPointsFocuser));
    common.barrelTubeInsideDiameter().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelInsideDiameterInches), config.decimalPointsFocuser));
    common.barrelTubeLength().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelLengthInches), config.decimalPointsFocuser));

    common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(common.convertInchesToUom(+focuser.barrelLengthInches) + common.focuserInwardFocusingDistanceVal(), config.decimalPointsFocuser));
};

MLB.NewtDesigner.processUomChange = function (ignoreLengthConversion) {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        newAperture,
        weightElements,
        weight,
        distanceElements,
        distance,
        uomDistanceLit = common.getUomLengthLit(),
        uomWeightLit = common.getUomWeightLit(),

        lengthConversionFactor = common.getLengthConversionFactorIgnoreAtStartup(ignoreLengthConversion),
        weightConversionFactor = common.getWeightConversionFactorIgnoreAtStartup(ignoreLengthConversion),
        imperial = common.imperial(),
        diags = imperial
            ? config.diagonalsInches.join(', ')
            : config.diagonalsMm.join(', '),
        sliderApertureUOMIx = imperial
            ? 0
            : 1;

    common.sliderAperture().prop({
        'min': config.sliderApertureUOMRange[sliderApertureUOMIx][0],
        'max': config.sliderApertureUOMRange[sliderApertureUOMIx][1],
        'step': config.sliderApertureUOMRange[sliderApertureUOMIx][2]
    });

    // update labels to include uom
    common.apertureUOMlabel().html(uomDistanceLit);
    common.focalPlaneToDiagDistanceLabel().html(config.focalPlaneToDiagDistanceLabelLit + uomDistanceLit + ' = ');
    common.maxFieldDiaDiagLabel().html(config.maxFieldDiaDiagLabelLit + uomDistanceLit + ' = ');
    common.diagSizesLabel().html(config.diagSizesLabelLit + uomDistanceLit);
    common.optimizedDiagSizeLabel().html(config.optimizedDiagSizeLabelLit + uomDistanceLit + ' = ');

    common.focuserRackedInHeightLabel().html(config.focuserRackedInHeightLabelLit + uomDistanceLit + ' = ');
    common.focuserTravelLabel().html(config.focuserTravelLabelLit + uomDistanceLit + ' = ');
    common.barrelTubeInsideDiameterLabel().html(config.barrelTubeInsideDiameterLabelLit + uomDistanceLit + ' = ');
    common.barrelTubeLengthLabel().html(config.barrelTubeLengthLabelLit + uomDistanceLit + ' = ');
    common.focuserInwardFocusingDistanceLabel().html(config.focuserInwardFocusingDistanceLabelLit + uomDistanceLit + ' = ');
    common.tubeODLabel().html(config.tubeODLabelLit + uomDistanceLit + ' = ');
    common.tubeThicknessLabel().html(config.tubeThicknessLabelLit + uomDistanceLit + ' = ');
    common.focalPlaneToFocuserBarrelBottomDistanceLabel().html(config.focalPlaneToFocuserBarrelBottomDistanceLabelLit + uomDistanceLit + ' = ');
    common.diagOffsetLabel().html(config.diagOffsetLabelLit + uomDistanceLit + ' = ');
    common.lowriderSecondaryMirrorSizeLabel().html(config.lowriderSecondaryMirrorSizeLabelLit + uomDistanceLit + ' = ');
    common.lowriderSecondaryOffsetLabel().html(config.lowriderSecondaryOffsetLabelLit + uomDistanceLit + ' = ');
    common.focalPlaneToSecondaryDistanceLabel().html(config.focalPlaneToSecondaryDistanceLabelLit + uomDistanceLit + ' = ');
    common.focalPointOffsetFromEdgeOfPrimaryLabel().html(config.focalPointOffsetFromEdgeOfPrimaryLabelLit + uomDistanceLit + ' = ');
    common.tubeWeightLabel().html(config.tubeWeightLabelLit + uomWeightLit + ' = ');
    common.CGToEyepieceDistanceLabel().html(config.CGToEyepieceDistanceLabelLit + uomDistanceLit + ' = ');
    common.altBearingRadiusLabel().html(config.altBearingRadiusLabelLit + uomDistanceLit + ' = ');
    common.azBearingRadiusLabel().html(config.azBearingRadiusLabelLit + uomDistanceLit + ' = ');
    common.flexRockerCGToEyepieceDistanceLabel().html(config.CGToEyepieceDistanceLabelLit + uomDistanceLit + ' = ');
    common.flexRockerTubeWeightLabel().html(config.tubeWeightLabelLit + uomWeightLit + ' = ');
    common.flexRockerCGToBackEdgeOfTubeClearanceLabel().html(config.flexRockerCGToBackEdgeOfTubeClearanceLit + uomDistanceLit + ' = ');

    // replace field values with new uom values; uom state already switched

    newAperture = roundToDecimal(common.apertureVal() * lengthConversionFactor, config.decimalPointsAperture);
    common.aperture().val(newAperture);
    common.sliderAperture().val(newAperture);
    state.lastAperture = newAperture;

    common.focalPlaneToDiagDistance().val(roundToDecimal(common.focalPlaneToDiagDistanceVal() * lengthConversionFactor, config.decimalPointsTube));
    common.maxFieldDiaDiag().val(roundToDecimal(common.maxFieldDiaDiagVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.diagSizes().val(diags);

    common.focuserRackedInHeight().val(roundToDecimal(common.focuserRackedInHeightVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.focuserTravel().val(roundToDecimal(common.focuserTravelVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.barrelTubeInsideDiameter().val(roundToDecimal(common.barrelTubeInsideDiameterVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.barrelTubeLength().val(roundToDecimal(common.barrelTubeLengthVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.focuserInwardFocusingDistance().val(roundToDecimal(common.focuserInwardFocusingDistanceVal() * lengthConversionFactor, config.decimalPointsFocuser));

    common.telescopeTubeOD().val(roundToDecimal(common.telescopeTubeODVal() * lengthConversionFactor, config.decimalPointsTube));
    common.telescopeTubeThickness().val(roundToDecimal(common.telescopeTubeThicknessVal() * lengthConversionFactor, config.decimalPointsTube));

    common.optimizedDiagSize().val(roundToDecimal(common.optimizedDiagSizeVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.focalPlaneToFocuserBarrelBottomDistance().val(roundToDecimal(common.focalPlaneToFocuserBarrelBottomDistanceVal() * lengthConversionFactor, config.decimalPointsFocuser));
    common.diagOffset().val(roundToDecimal(common.diagOffsetVal() * lengthConversionFactor, config.decimalPointsDiag));

    common.lowriderSecondaryMirrorSize().val(roundToDecimal(common.lowriderSecondaryMirrorSizeVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.lowriderSecondaryOffset().val(roundToDecimal(common.lowriderSecondaryOffsetVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() * lengthConversionFactor, config.decimalPointsDiag));
    common.focalPointOffsetFromEdgeOfPrimary().val(roundToDecimal(common.focalPointOffsetFromEdgeOfPrimaryVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));

    weightElements = common.weightElements();
    weightElements.each(function (i, v) {
        weight = parseFloat(v.value);
        if (!isNaN(weight)) {
            v.value = roundToDecimal(weight * weightConversionFactor, config.decimalPointsCG);
        }
    });
    distanceElements = common.distanceElements();
    distanceElements.each(function (i, v) {
        distance = parseFloat(v.value);
        if (!isNaN(distance)) {
            v.value = roundToDecimal(distance * lengthConversionFactor, config.decimalPointsCG);
        }
    });

    common.tubeWeight().val(roundToDecimal(common.tubeWeightVal() * weightConversionFactor, config.decimalPointsCG));
    common.CGToEyepieceDistance().val(roundToDecimal(common.CGToEyepieceDistanceVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
    common.altBearingRadius().val(roundToDecimal(common.altBearingRadiusVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
    common.azBearingRadius().val(roundToDecimal(common.azBearingRadiusVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));

    common.flexRockerTubeWeight().val(roundToDecimal(common.flexRockerTubeWeightVal() * weightConversionFactor, config.decimalPointsCG));
};

/*
common.eyeOptTableBody().html():
    <tr>
        <td class="columnHeaders">Select</td>
        <td class="columnHeaders">Manufacturer</td>
        <td class="columnHeaders">Type</td>
        <td class="columnHeaders">FocalLength</td>
        <td class="columnHeaders">FieldStop</td>
        <td class="columnHeaders">ApparentField</td>
        <td class="columnHeaders">ExitPupil</td>
        <td class="columnHeaders">TrueFOV</td>
        <td class="columnHeaders">MagX</td>
        <td class="columnHeaders">Res</td>
        <td class='columnHeaders'>MagLimit</td>
        <td class='columnHeaders'>Etendue</td>
        <td class='columnHeaders'>Coma</td>
    </tr>
    <!--detail rows added in JavaScript-->
    <tr>
        <td><select id="EyeOptSelect0"></select></td>
        <td id="EyeOptManufacturer0"></td>
        <td id="EyeOptType0"></td>
        <td id="EyeOptFocalLength0"></td>
        <td id="EyeOptFieldStop0"></td>
        <td id="EyeOptApparentField0"></td>
        <td id="EyeOptExitPupil0"></td>
        <td id="EyeOptFOV0"></td>
        <td id="EyeOptMagX0"></td>
        <td id="EyeOptRes0"></td>
        <td id='EyeOptMagLimit0</td>
        <td id='EyeOptEtendue0</td>
        <td id='EyeOptComa0</td>
        <td><input id='btnRemoveEyepieceRow0' value='remove' type='button'></td>
    </tr>
    <tr>
        <td><select id="EyeOptSelect1"></select></td>
        <td id="EyeOptManufacturer1"></td>
        <td id="EyeOptType1"></td>
        <td id="EyeOptFocalLength1"></td>
        <td id="EyeOptFieldStop1"></td>
        <td id="EyeOptApparentField1"></td>
        <td id="EyeOptExitPupil1"></td>
        <td id="EyeOptFOV1"></td>
        <td id="EyeOptMagX1"></td>
        <td id="EyeOptRes1"></td>
        <td id='EyeOptMagLimit1</td>
        <td id='EyeOptEtendue1</td>
        <td id='EyeOptComa1</td>
        <td><input id='btnRemoveEyepieceRow1' value='remove' type='button'></td>
    </tr>
    ...etc
*/
MLB.NewtDesigner.buildEyepieceHtmlTable = function () {
    var config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        eyepieceRow,
        htmlStr;

    for (eyepieceRow = 0; eyepieceRow < config.eyepieceRows; eyepieceRow += 1) {
        htmlStr = "<tr>\r\n"
                + "<td><select id='" + config.EyeOptSelectID + eyepieceRow + "'></select></td>\r\n"
                + "<td id='" + config.EyeOptManufacturerID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptTypeID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptFocalLengthID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptFieldStopID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptApparentFieldID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptExitPupilID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptFOVID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptMagnificationID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptResolutionID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptLimitingMagnitudeID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOpEtendueID + eyepieceRow + "'></td>\r\n"
                + "<td id='" + config.EyeOptComaID + eyepieceRow + "'></td>\r\n"
                + "<td><input id='" + config.btnRemoveEyepieceRowLit + eyepieceRow + "' value='remove' type='button'></td>\r\n"
                + "</tr>\r\n";
        common.eyeOptTableBody().append(htmlStr);
    }
};

MLB.NewtDesigner.seedComaCorrector = function (manufacturer, model) {
    var common = MLB.NewtDesigner.common,
        setSelectedComaCorrector = MLB.NewtDesigner.setSelectedComaCorrector,
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

MLB.NewtDesigner.seedFocuser = function (manufacturer, model) {
    var common = MLB.NewtDesigner.common,
        setSelectedFocuser = MLB.NewtDesigner.setSelectedFocuser,
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

MLB.NewtDesigner.calcMinFoldingMirrorSize = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common;

    common.lowriderSecondaryMirrorSize().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() / common.focalRatioVal(), config.decimalPointsDiag));
};

MLB.NewtDesigner.calcMinFocalPlaneToSecondaryDistance = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common;

    common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.lowriderSecondaryMirrorSizeVal() * common.focalRatioVal(), config.decimalPointsDimension));
};

MLB.NewtDesigner.seedMaterialFrictions = function () {
    var common = MLB.NewtDesigner.common,
        selectedMaterialPairing = MLB.materialFrictionJson.materials[1];

    common.altBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
    common.azBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
    common.flexRockerAltBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
    common.flexRockerAzBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
};

// must look through eyepiece Json because not able to separate manufacturer and type, eg, 'APM HDC Extreme Wide Angle 20mm 100deg'
// find eyepiece Json and add to table: assumes that Json sorted the same as when saved
MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr = function (eyepieceRow, eyepieceSelect) {
    var config = MLB.NewtDesigner.config,
        setEyeOptSelectedEyepiece = MLB.NewtDesigner.setEyeOptSelectedEyepiece,
        eyepiecesJson = MLB.eyepiecesJson,
        eyepieceStr;

    $.each(eyepiecesJson.eyepieces, function (i, v) {
        eyepieceStr = v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + config.mmLitNS + ' ' + v.apparentField + config.degLitNS;
        if (eyepieceSelect === eyepieceStr) {
            setEyeOptSelectedEyepiece(eyepieceRow, i);
            // break out of $.each() loop
            return false;
        }
    });
    $('#' + config.EyeOptSelectID + eyepieceRow).val(eyepieceSelect);
};

MLB.NewtDesigner.removeEyeOptSelectedEyepiece = function (eyepieceRow) {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common;

    common.tableElement(config.EyeOptManufacturerID, eyepieceRow).html('');
    common.tableElement(config.EyeOptTypeID, eyepieceRow).html('');
    common.tableElement(config.EyeOptFocalLengthID, eyepieceRow).html('');
    common.tableElement(config.EyeOptFieldStopID, eyepieceRow).html('');
    common.tableElement(config.EyeOptExitPupilID, eyepieceRow).html('');
    common.tableElement(config.EyeOptApparentFieldID, eyepieceRow).html('');
    common.tableElement(config.EyeOptFOVID, eyepieceRow).html('');
    common.tableElement(config.EyeOptMagnificationID, eyepieceRow).html('');
    common.tableElement(config.EyeOptResolutionID, eyepieceRow).html('');
    common.tableElement(config.EyeOptLimitingMagnitudeID, eyepieceRow).html('');
    common.tableElement(config.EyeOpEtendueID, eyepieceRow).html('');
    common.tableElement(config.EyeOptComaID, eyepieceRow).html('');

    state.eyeOptRowSet[eyepieceRow] = undefined;
};

MLB.NewtDesigner.buildData = function () {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        selectedEyepiece,
        eyepieces = [],
        eyepieceRow,
        weightElements,
        distanceElements,
        CGTableLength,
        CGRow,
        CGs = [];

    // build eyepieces array first...
    for (eyepieceRow = 0; eyepieceRow < config.eyepieceRows; eyepieceRow += 1) {
        selectedEyepiece = $('#' + config.EyeOptSelectID + eyepieceRow).val();
        eyepieces.push(selectedEyepiece);
    }

    // build CGs first...
    weightElements = common.weightElements();
    distanceElements = common.distanceElements();
    CGTableLength = weightElements.length;
    for (CGRow = 0; CGRow < CGTableLength; CGRow += 1) {
        CGs.push({weight: weightElements[CGRow].value, distance: distanceElements[CGRow].value});
    }

    return {
        imperial: common.imperial(),
        focalRatio: common.focalRatioVal(),
        aperture: common.apertureVal(),
        useComaCorrector: common.useComaCorrectorMagVal(),
        comaCorrectorSelect: common.comaCorrectorSelectVal(),
        comaCorrectorMag: common.comaCorrectorMagVal(),
        eyePupilmm: common.eyePupilmmVal(),
        widestEyepiecesForEyePupilLabel: common.widestEyepiecesForEyePupilLabel().html(),
        eyepieceSelectSort: common.btnEyepieceSort().val(),
        eyepieceRowSet: state.eyeOptRowSet,
        eyepieces: eyepieces,
        focalPlaneToDiagDistance: common.focalPlaneToDiagDistanceVal(),
        maxFieldDiaDiag: common.maxFieldDiaDiagVal(),
        acceptableMagLoss: common.acceptableMagLossVal(),
        diagSizes: common.diagSizesVal(),
        focuserSelect: common.focuserSelectVal(),
        focuserRackedInHeight: common.focuserRackedInHeightVal(),
        focuserTravel: common.focuserTravelVal(),
        focuserTubeID: common.barrelTubeInsideDiameterVal(),
        focuserTubeLength: common.barrelTubeLengthVal(),
        focuserInwardFocusingDistance: common.focuserInwardFocusingDistanceVal(),
        telescopeTubeOD: common.telescopeTubeODVal(),
        telescopeTubeThickness: common.telescopeTubeThicknessVal(),
        baffleDesignerDiagSize: common.optimizedDiagSizeVal(),
        baffleDesignerDiagOffset: common.diagOffsetVal(),
        focalPlaneToFocuserBarrelBottomDistance: common.focalPlaneToFocuserBarrelBottomDistanceVal(),
        lowriderDiagSize: common.lowriderSecondaryMirrorSizeVal(),
        lowriderDiagOffset: common.lowriderSecondaryOffsetVal(),
        lowriderFocalPlaneToDiagDistance: common.focalPlaneToSecondaryDistanceVal(),
        lowriderFocalPointOffsetFromEdgeOfPrimaryMirror: common.focalPointOffsetFromEdgeOfPrimaryVal(),
        CGs: CGs,
        CGToEyepieceDistance: common.CGToEyepieceDistanceVal(),
        tubeWeight: common.tubeWeightVal(),
        altBearingSeparationDeg: common.altBearingSeparationDegVal(),
        altBearingRadius: common.altBearingRadiusVal(),
        azBearingRadius: common.azBearingRadiusVal(),
        altBearingMaterialsSelect: common.altBearingMaterialsSelect().val(),
        azBearingMaterialsSelect: common.azBearingMaterialsSelect().val(),
        flexRockerCGToEyepieceDistance: common.flexRockerCGToEyepieceDistanceVal(),
        flexRockerTubeWeight: common.flexRockerTubeWeightVal(),
        flexRockerCGToBackEdgeOfTubeClearance: common.flexRockerCGToBackEdgeOfTubeClearanceVal(),
        flexRockerAltBearingSeparationDeg: common.flexRockerAltBearingSeparationDegVal(),
        flexRockerAltBearingMaterialsSelect: common.flexRockerAltBearingMaterialsSelect().val(),
        flexRockerAzBearingMaterialsSelect: common.flexRockerAzBearingMaterialsSelect().val(),
        ETLatitudeDeg: common.ETLatitudeDegVal(),
        ETTrackingTimeMin: common.ETTrackingTimeMinVal()
    };
};

MLB.NewtDesigner.putData = function () {
    var common = MLB.NewtDesigner.common,
        buildData = MLB.NewtDesigner.buildData,
        JSONdata = JSON.stringify(buildData());

    common.textareaDesignData().text(JSONdata.replace(/,/g, ',\n'));
    common.textareaDesignData().select();
    document.execCommand('copy');
};

MLB.NewtDesigner.getData = function () {
    var common = MLB.NewtDesigner.common,
        data;

    data = common.textareaDesignData().val().replace(/\n/g, '');
    return JSON.parse(data);
};

MLB.NewtDesigner.getDataUpdateUI = function () {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        processUomChange = MLB.NewtDesigner.processUomChange,
        updateFieldsDependentOnFocalRatio = MLB.NewtDesigner.updateFieldsDependentOnFocalRatio,
        updateFieldsDependentOnAperture = MLB.NewtDesigner.updateFieldsDependentOnAperture,
        sortEyepiecesByManufacturerAddToSelections = MLB.NewtDesigner.sortEyepiecesByManufacturerAddToSelections,
        sortEyepiecesByFLAddToSelections = MLB.NewtDesigner.sortEyepiecesByFLAddToSelections,
        getData = MLB.NewtDesigner.getData,
        parsedData = getData(),
        eyepieces,
        eyepieceRowSet,
        eyepieceSelect,
        eyepieceRow,
        CGLength,
        CGRow,
        setEyeOptSelectedEyepieceUsingSelectStr = MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr,
        removeEyeOptSelectedEyepiece = MLB.NewtDesigner.removeEyeOptSelectedEyepiece,
        runAllDesigners = MLB.NewtDesigner.runAllDesigners;

    if (common.imperial() !== parsedData.imperial) {
        common.btnUom()[0].checked = parsedData.imperial;
        common.btnUom()[1].checked = !parsedData.imperial;
        processUomChange();
    }
    common.focalRatio().val(parsedData.focalRatio);
    updateFieldsDependentOnFocalRatio();

    common.aperture().val(parsedData.aperture);
    updateFieldsDependentOnAperture();

    common.chBoxUseComaCorrector().prop('checked', parsedData.useComaCorrector);
    common.comaCorrectorSelect().val(parsedData.comaCorrectorSelect);
    common.comaCorrectorMag().val(parsedData.comaCorrectorMag);
    common.eyePupilmm().val(parsedData.eyePupilmm);
    common.widestEyepiecesForEyePupilLabel().html(parsedData.widestEyepiecesForEyePupilLabel);

    if (parsedData.eyepieceSelectSort === config.eyepieceSortManufacturerLit) {
        common.btnEyepieceSort()[0].checked = true;
        common.btnEyepieceSort()[1].checked = false;
        sortEyepiecesByManufacturerAddToSelections();
    } else if (parsedData.eyepieceSelectSort === config.eyepieceSortFocalLengthLit) {
        common.btnEyepieceSort()[0].checked = false;
        common.btnEyepieceSort()[1].checked = true;
        sortEyepiecesByFLAddToSelections();
    } else {
        alert('unknown eyepiece sort value of ' + parsedData.eyepieceSelectSort);
    }

    eyepieces = parsedData.eyepieces;
    eyepieceRowSet = parsedData.eyepieceRowSet;
    for (eyepieceRow = 0; eyepieceRow < config.eyepieceRows; eyepieceRow += 1) {
        if (eyepieceRowSet[eyepieceRow]) {
            eyepieceSelect = eyepieces[eyepieceRow];
            setEyeOptSelectedEyepieceUsingSelectStr(eyepieceRow, eyepieceSelect);
        } else {
            // remove existing row from eyepiece display table
            if (state.eyeOptRowSet[eyepieceRow]) {
                removeEyeOptSelectedEyepiece(eyepieceRow);
            }
        }
    }
    state.eyeOptRowSet = eyepieceRowSet;

    common.focalPlaneToDiagDistance().val(parsedData.focalPlaneToDiagDistance);
    common.maxFieldDiaDiag().val(parsedData.maxFieldDiaDiag);
    common.acceptableMagLoss().val(parsedData.acceptableMagLoss);
    common.diagSizes().val(parsedData.diagSizes);

    common.focuserSelect().val(parsedData.focuserSelect);
    common.focuserRackedInHeight().val(parsedData.focuserRackedInHeight);
    common.focuserTravel().val(parsedData.focuserTravel);
    common.barrelTubeInsideDiameter().val(parsedData.focuserTubeID);
    common.barrelTubeLength().val(parsedData.focuserTubeLength);
    common.focuserInwardFocusingDistance().val(parsedData.focuserInwardFocusingDistance);
    common.telescopeTubeOD().val(parsedData.telescopeTubeOD);
    common.telescopeTubeThickness().val(parsedData.telescopeTubeThickness);
    common.optimizedDiagSize().val(parsedData.baffleDesignerDiagSize);
    common.diagOffset().val(parsedData.baffleDesignerDiagOffset);
    common.focalPlaneToFocuserBarrelBottomDistance().val(parsedData.focalPlaneToFocuserBarrelBottomDistance);
    common.lowriderSecondaryMirrorSize().val(parsedData.lowriderDiagSize);
    common.lowriderSecondaryOffset().val(parsedData.lowriderDiagOffset);
    common.focalPlaneToSecondaryDistance().val(parsedData.lowriderFocalPlaneToDiagDistance);
    common.focalPointOffsetFromEdgeOfPrimary().val(parsedData.lowriderFocalPointOffsetFromEdgeOfPrimaryMirror);

    CGLength = parsedData.CGs.length;
    for (CGRow = 0; CGRow < CGLength; CGRow += 1) {
        $('[name=CGWeight' + CGRow + ']').val(parsedData.CGs[CGRow].weight);
        $('[name=CGDistance' + CGRow + ']').val(parsedData.CGs[CGRow].distance);
    }

    common.CGToEyepieceDistance().val(parsedData.CGToEyepieceDistance);
    common.tubeWeight().val(parsedData.tubeWeight);
    common.altBearingSeparationDeg().val(parsedData.altBearingSeparationDeg);
    common.altBearingRadius().val(parsedData.altBearingRadius);
    common.azBearingRadius().val(parsedData.azBearingRadius);
    common.altBearingMaterialsSelect().val(parsedData.altBearingMaterialsSelect);
    common.azBearingMaterialsSelect().val(parsedData.azBearingMaterialsSelect);
    common.flexRockerCGToEyepieceDistance().val(parsedData.flexRockerCGToEyepieceDistance);
    common.flexRockerTubeWeight().val(parsedData.flexRockerTubeWeight);
    common.flexRockerCGToBackEdgeOfTubeClearance().val(parsedData.flexRockerCGToBackEdgeOfTubeClearance);
    common.flexRockerAltBearingSeparationDeg().val(parsedData.flexRockerAltBearingSeparationDeg);
    common.flexRockerAltBearingMaterialsSelect().val(parsedData.flexRockerAltBearingMaterialsSelect);
    common.flexRockerAzBearingMaterialsSelect().val(parsedData.flexRockerAzBearingMaterialsSelect);
    common.ETLatitudeDeg().val(parsedData.ETLatitudeDeg);
    common.ETTrackingTimeMin().val(parsedData.ETTrackingTimeMin);

    runAllDesigners();
};

MLB.NewtDesigner.setBackground = function (id) {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config;

    // change background only if changed selection
    if (id !== state.currentBtnSelect) {
        // set old to not selected
        $('[id=' + state.currentBtnSelect + ']').css('backgroundColor', config.btnSelectNotSelectedBackground);
        // set new to selected
        $('[id=' + id + ']').css('backgroundColor', config.btnSelectSelectedBackground);
        // save newly selected btn
        state.currentBtnSelect = id;
    }
};

MLB.NewtDesigner.toggleId = function (id) {
    var state = MLB.NewtDesigner.state;

    // display off/on only if changed div
    if (id !== state.currentDesigner) {
        // turn off display of current div
        $('[id=' + state.currentDesigner + ']').toggle();
        // display new div
        $('[id=' + id + ']').toggle();
        // save newly displaying div
        state.currentDesigner = id;
    }
};

MLB.NewtDesigner.updateSelected = function (btnId, designId) {
    var setBackground = MLB.NewtDesigner.setBackground,
        toggleId = MLB.NewtDesigner.toggleId,
        updateDesigners = MLB.NewtDesigner.updateDesigners;

    setBackground(btnId);
    toggleId(designId);

    updateDesigners();
};

MLB.NewtDesigner.updateTelescopeResults = function () {
    var roundToDecimal = MLB.sharedLib.roundToDecimal,
        state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        magnitudeDifferenceBetweenApertures = MLB.calcLib.magnitudeDifferenceBetweenApertures,
        calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
        calcMinMagnification = MLB.calcLib.calcMinMagnification,
        calcMaxMagnification = MLB.calcLib.calcMaxMagnification,
        calcDiopter = MLB.calcLib.calcDiopter,
        calcComaFreeDia = MLB.NewtDesigner.calcComaFreeDia,
        calcSagitta = MLB.calcLib.calcSagitta,
        calcSagittalVolume = MLB.calcLib.calcSagittalVolume,
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        inchesToWavesGreenLight = MLB.calcLib.inchesToWavesGreenLight,
        calcRotatingFurnaceRPM = MLB.calcLib.calcRotatingFurnaceRPM,
        focalRatio = common.focalRatioVal(),
        aperture = common.apertureVal(),
        telescopeFocalLength = focalRatio * aperture,
        comaFreeDia = calcComaFreeDia(focalRatio),
        minMagnification,
        maxMagnification,
        theoreticalResolutionArcsec,
        focusingTolerance,
        brightnessGain,
        sagitta,
        sagittalVolume,
        wavesCorrection,
        RPM,
        uomLengthLit = common.getUomLengthLit();

    minMagnification = calcMinMagnification(aperture);
    maxMagnification = calcMaxMagnification(aperture);
    theoreticalResolutionArcsec = calcTheoreticalResolutionArcsec(aperture);
    focusingTolerance = common.convertInchesToUom(config.focusingToleranceInchesF1) * focalRatio * focalRatio;
    brightnessGain = magnitudeDifferenceBetweenApertures(aperture, config.nightTimeEyePupilInches);
    sagitta = calcSagitta(aperture, focalRatio);
    sagittalVolume = calcSagittalVolume(aperture, focalRatio);
    wavesCorrection = inchesToWavesGreenLight(calcSphereParabolaDifference(aperture, focalRatio));
    RPM = calcRotatingFurnaceRPM(aperture * focalRatio * 0.0254);

    // save values for use with other optimizers
    state.brightnessGain = brightnessGain;

    common.telescopeDesignerResultsLabel().html('telescope focal length = '
            + roundToDecimal(telescopeFocalLength, config.decimalPointsTelescopeFocalLength)
            + uomLengthLit
            + '<br>telescope diopter = '
            + roundToDecimal(calcDiopter(telescopeFocalLength), config.decimalPointsResolution)
            + '<br>min magnification = '
            + roundToDecimal(minMagnification, config.decimalPointsMagnification)
            + 'x, max = '
            + roundToDecimal(maxMagnification, config.decimalPointsMagnification)
            + 'x<br>Dawes\' Limit = '
            + roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution)
            + ' arc seconds<br>focusing tolerance = '
            + roundToDecimal(focusingTolerance, config.focusingTolerance)
            + uomLengthLit
            + '<br>coma free diameter = '
            + roundToDecimal(comaFreeDia, config.decimalPointsComaFreeDiameter)
            + uomLengthLit
            + '<br>brightness gain = '
            + roundToDecimal(brightnessGain, config.decimalPointsRadiance)
            + ' magnitudes<br>mirror sagitta = '
            + roundToDecimal(sagitta, config.decimalPointsDimension)
            + uomLengthLit
            + '<br>sagittal volume = '
            + roundToDecimal(sagittalVolume, config.decimalPointsDimension)
            + uomLengthLit
            + '^3<br>correction = '
            + roundToDecimal(wavesCorrection, config.decimalPointsDimension)
            + ' waves tangent to edge; minimal difference = '
            + roundToDecimal(wavesCorrection / 4, config.decimalPointsDimension)
            + ' waves<br>rotate liquid to match sagitta at '
            + roundToDecimal(RPM, config.decimalPointsDimension)
            + ' rpm');
};

MLB.NewtDesigner.updateDesigners = function () {
    var state = MLB.NewtDesigner.state,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        updateTelescopeResults = MLB.NewtDesigner.updateTelescopeResults,
        updateEyepieceOptimizerRows = MLB.NewtDesigner.updateEyepieceOptimizerRows,
        graphDiagIllum = MLB.NewtDesigner.graphDiagIllum,
        graphBaffles = MLB.NewtDesigner.graphBaffles,
        graphLowrider = MLB.NewtDesigner.graphLowrider,
        updateCGDistances = MLB.NewtDesigner.updateCGDistances,
        calcCG = MLB.NewtDesigner.calcCG,
        graphRocker = MLB.NewtDesigner.graphRocker,
        graphFlexRocker = MLB.NewtDesigner.graphFlexRocker,
        graphEquatorialTable = MLB.NewtDesigner.graphEquatorialTable;

    switch (state.currentDesigner) {
    case config.designTelescopeLit:
        common.diagSharedParms().hide();
        updateTelescopeResults();
        break;
    case config.designEyepiecesLit:
        common.diagSharedParms().hide();
        updateEyepieceOptimizerRows();
        break;
    case config.designDiagonalLit:
        common.diagSharedParms().show();
        graphDiagIllum();
        break;
    case config.designBafflingLit:
        common.diagSharedParms().show();
        graphBaffles();
        updateCGDistances();
        break;
    case config.designLowriderBafflingLit:
        common.diagSharedParms().show();
        graphLowrider();
        updateCGDistances();
        break;
    case config.designTubeLit:
        common.diagSharedParms().hide();
        calcCG();
        break;
    case config.designRockertLit:
        common.diagSharedParms().hide();
        graphRocker();
        break;
    case config.designFlexRockertLit:
        common.diagSharedParms().hide();
        graphFlexRocker();
        break;
    case config.designETLit:
        common.diagSharedParms().hide();
        graphEquatorialTable();
        break;
    default:
        alert('Unknown state.currentDesigner value of ' + state.currentDesigner);
    }
};

MLB.NewtDesigner.focalRatioSliderChanged = function () {
    var state = MLB.NewtDesigner.state,
        common = MLB.NewtDesigner.common,
        updateFieldsDependentOnFocalRatio = MLB.NewtDesigner.updateFieldsDependentOnFocalRatio,
        updateDesigners = MLB.NewtDesigner.updateDesigners;

    if (!state.sliderFocalRatio) {
        return;
    }

    common.focalRatio().val(common.sliderFocalRatioVal());
    updateFieldsDependentOnFocalRatio();
    updateDesigners();
};

MLB.NewtDesigner.apertureSliderChange = function () {
    var state = MLB.NewtDesigner.state,
        common = MLB.NewtDesigner.common,
        updateFieldsDependentOnAperture = MLB.NewtDesigner.updateFieldsDependentOnAperture,
        updateDesigners = MLB.NewtDesigner.updateDesigners;

    if (!state.sliderAperture) {
        return;
    }

    common.aperture().val(common.sliderApertureVal());
    updateFieldsDependentOnAperture();
    updateDesigners();
};

// sort manufacturer, type, descending focal length;
MLB.NewtDesigner.sortEyepiecesJsonByManufacturerTypeFL = function () {
    var eyepiecesJson = MLB.eyepiecesJson;

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
};

// sort descending focal length, apparent field, type;
MLB.NewtDesigner.sortEyepiecesJsonByFLApparentFieldType = function () {
    var eyepiecesJson = MLB.eyepiecesJson;

    eyepiecesJson.eyepieces = eyepiecesJson.eyepieces.sort(function (x, y) {
        var xFL = +x.focalLengthmm,
            yFL = +y.focalLengthmm,
            xApparentField = +x.apparentField,
            yApparentField = +y.apparentField;

        if (xFL === yFL) {
            if (xApparentField === yApparentField) {
                return x.type > y.type
                    ? 1
                    : -1;
            }
            return xApparentField < yApparentField
                ? 1
                : -1;
        }
        return xFL < yFL
            ? 1
            : -1;
    });
};

MLB.NewtDesigner.clearEyepieceSelections = function () {
    var config = MLB.NewtDesigner.config,
        eyepieceRow;

    for (eyepieceRow = 0; eyepieceRow < config.eyepieceRows; eyepieceRow += 1) {
        $('#' + config.EyeOptSelectID + eyepieceRow + ' option').remove();
    }
};

MLB.NewtDesigner.fillEyepieceSelections = function () {
    var config = MLB.NewtDesigner.config,
        eyepiecesJson = MLB.eyepiecesJson,
        eyepieceStr,
        optionStr,
        eyepieceRow;

    // fill eyepiece selection table rows
    $.each(eyepiecesJson.eyepieces, function (i, v) {
        // fill in missing field stops
        if (v.fieldStopmm === '') {
            v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
        }
        eyepieceStr = v.manufacturer + ' ' + v.type + ' ' + v.focalLengthmm + config.mmLitNS + ' ' + v.apparentField + config.degLitNS;
        optionStr = '<option value="' + eyepieceStr + '">' + eyepieceStr + '</option>';
        // drop down boxes for eyepiece selection
        for (eyepieceRow = 0; eyepieceRow < config.eyepieceRows; eyepieceRow += 1) {
            $('#' + config.EyeOptSelectID + eyepieceRow).append(optionStr);
        }
    });
};

MLB.NewtDesigner.setSelectedEyepieceFromTable = function () {
    var config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        manufacturerStr,
        eyepieceStr,
        eyepieceRow = 0;

    while (true) {
        manufacturerStr = common.tableElement(config.EyeOptManufacturerID, eyepieceRow).html();
        if (manufacturerStr) {
            eyepieceStr = manufacturerStr
                    + ' '
                    + common.tableElement(config.EyeOptTypeID, eyepieceRow).html()
                    + ' '
                    + common.tableElement(config.EyeOptFocalLengthID, eyepieceRow).html()
                    + ' '
                    + common.tableElement(config.EyeOptApparentFieldID, eyepieceRow).html();
            // eg, eyepieceStr = 'TeleVue Ethos 17mm 100deg'
            $('#' + config.EyeOptSelectID + eyepieceRow).val(eyepieceStr);
        }
        eyepieceRow += 1;
        if (eyepieceRow === config.eyepieceRows) {
            break;
        }
    }
};

MLB.NewtDesigner.sortEyepiecesByManufacturerAddToSelections = function () {
    var sortEyepiecesJsonByManufacturerTypeFL = MLB.NewtDesigner.sortEyepiecesJsonByManufacturerTypeFL,
        clearEyepieceSelections = MLB.NewtDesigner.clearEyepieceSelections,
        fillEyepieceSelections = MLB.NewtDesigner.fillEyepieceSelections,
        setSelectedEyepieceFromTable = MLB.NewtDesigner.setSelectedEyepieceFromTable;

    sortEyepiecesJsonByManufacturerTypeFL();
    clearEyepieceSelections();
    fillEyepieceSelections();
    setSelectedEyepieceFromTable();
};

MLB.NewtDesigner.sortEyepiecesByFLAddToSelections = function () {
    var sortEyepiecesJsonByFLApparentFieldType = MLB.NewtDesigner.sortEyepiecesJsonByFLApparentFieldType,
        clearEyepieceSelections = MLB.NewtDesigner.clearEyepieceSelections,
        fillEyepieceSelections = MLB.NewtDesigner.fillEyepieceSelections,
        setSelectedEyepieceFromTable = MLB.NewtDesigner.setSelectedEyepieceFromTable;

    sortEyepiecesJsonByFLApparentFieldType();
    clearEyepieceSelections();
    fillEyepieceSelections();
    setSelectedEyepieceFromTable();
};

MLB.NewtDesigner.runAllDesigners = function () {
    var updateTelescopeResults = MLB.NewtDesigner.updateTelescopeResults,
        updateEyepieceOptimizerRows = MLB.NewtDesigner.updateEyepieceOptimizerRows,
        graphDiagIllum = MLB.NewtDesigner.graphDiagIllum,
        graphBaffles = MLB.NewtDesigner.graphBaffles,
        graphLowrider = MLB.NewtDesigner.graphLowrider,
        updateCGDistances = MLB.NewtDesigner.updateCGDistances,
        calcCG = MLB.NewtDesigner.calcCG,
        graphRocker = MLB.NewtDesigner.graphRocker,
        graphFlexRocker = MLB.NewtDesigner.graphFlexRocker,
        graphEquatorialTable = MLB.NewtDesigner.graphEquatorialTable;

    updateTelescopeResults();
    updateEyepieceOptimizerRows();
    graphDiagIllum();
    graphBaffles();
    graphLowrider();
    updateCGDistances();
    calcCG();
    graphRocker();
    graphFlexRocker();
    graphEquatorialTable();
};

$(window).ready(function () {
    var updateSelected = MLB.NewtDesigner.updateSelected,
        focalRatioSliderChanged = MLB.NewtDesigner.focalRatioSliderChanged,
        apertureSliderChange = MLB.NewtDesigner.apertureSliderChange,
        updateEyepieceOptimizerRows = MLB.NewtDesigner.updateEyepieceOptimizerRows,
        sortEyepiecesByManufacturerAddToSelections = MLB.NewtDesigner.sortEyepiecesByManufacturerAddToSelections,
        sortEyepiecesByFLAddToSelections = MLB.NewtDesigner.sortEyepiecesByFLAddToSelections,
        buildEyepieceHtmlTable = MLB.NewtDesigner.buildEyepieceHtmlTable,
        setEyeOptSelectedEyepiece = MLB.NewtDesigner.setEyeOptSelectedEyepiece,
        removeEyeOptSelectedEyepiece = MLB.NewtDesigner.removeEyeOptSelectedEyepiece,
        findWidestFieldEyepiece = MLB.NewtDesigner.findWidestFieldEyepiece,
        runAllDesigners = MLB.NewtDesigner.runAllDesigners,
        updateFieldsDependentOnFocalRatio = MLB.NewtDesigner.updateFieldsDependentOnFocalRatio,
        updateFieldsDependentOnAperture = MLB.NewtDesigner.updateFieldsDependentOnAperture,
        buildCGHtmlTable = MLB.NewtDesigner.buildCGHtmlTable,
        processUomChange = MLB.NewtDesigner.processUomChange,
        graphBaffles = MLB.NewtDesigner.graphBaffles,
        calcCG = MLB.NewtDesigner.calcCG,
        graphRocker = MLB.NewtDesigner.graphRocker,
        graphLowrider = MLB.NewtDesigner.graphLowrider,
        graphFlexRocker = MLB.NewtDesigner.graphFlexRocker,
        graphEquatorialTable = MLB.NewtDesigner.graphEquatorialTable,
        updateDesigners = MLB.NewtDesigner.updateDesigners,
        seedCGTable = MLB.NewtDesigner.seedCGTable,
        graphDiagIllum = MLB.NewtDesigner.graphDiagIllum,
        calcMinFoldingMirrorSize = MLB.NewtDesigner.calcMinFoldingMirrorSize,
        calcLowriderSecondaryOffset = MLB.NewtDesigner.calcLowriderSecondaryOffset,
        calcMinFocalPlaneToSecondaryDistance = MLB.NewtDesigner.calcMinFocalPlaneToSecondaryDistance,
        setSelectedComaCorrector = MLB.NewtDesigner.setSelectedComaCorrector,
        setSelectedFocuser = MLB.NewtDesigner.setSelectedFocuser,
        seedComaCorrector = MLB.NewtDesigner.seedComaCorrector,
        setEyeOptSelectedEyepieceUsingSelectStr = MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr,
        seedFocuser = MLB.NewtDesigner.seedFocuser,
        seedMaterialFrictions = MLB.NewtDesigner.seedMaterialFrictions,
        config = MLB.NewtDesigner.config,
        common = MLB.NewtDesigner.common,
        putData = MLB.NewtDesigner.putData,
        getDataUpdateUI = MLB.NewtDesigner.getDataUpdateUI,
        comaCorrectorsJson = MLB.comaCorrectorsJson,
        focusersJson = MLB.focusersJson,
        materialFrictionJson = MLB.materialFrictionJson,
        comaCorrectorStr,
        focuserStr,
        materialPairingStr,
        optionStr;

    // set initially selected designer
    updateSelected(config.btnSelectTelescopeLit, config.designTelescopeLit);

    common.btnSelectTelescope().click(function () {
        updateSelected(config.btnSelectTelescopeLit, config.designTelescopeLit);
    });
    common.btnSelectEyepieces().click(function () {
        updateSelected(config.btnSelectEyepiecesLit, config.designEyepiecesLit);
    });
    common.btnSelectDiagonal().click(function () {
        updateSelected(config.btnSelectDiagonalLit, config.designDiagonalLit);
    });
    common.btnSelectBaffling().click(function () {
        updateSelected(config.btnSelectBafflingLit, config.designBafflingLit);
    });
    common.btnSelectLowriderBaffling().click(function () {
        updateSelected(config.btnSelectLowriderBafflingLit, config.designLowriderBafflingLit);
    });
    common.btnSelectTube().click(function () {
        updateSelected(config.btnSelectTubeLit, config.designTubeLit);
    });
    common.btnSelectRocker().click(function () {
        updateSelected(config.btnSelectRockerLit, config.designRockertLit);
    });
    common.btnSelectFlexRocker().click(function () {
        updateSelected(config.btnSelectFlexRockerLit, config.designFlexRockertLit);
    });
    common.btnSelectET().click(function () {
        updateSelected(config.btnSelectETLit, config.designETLit);
    });

    // event hookups/subscribes...

    // if .click(foo) then event passed to function as a parm which we don't want here because processUomChange() function has optional parms
    common.btnUom().click(function () {
        processUomChange();
        runAllDesigners();
    });
    common.sliderFocalRatio().mousemove(focalRatioSliderChanged);
    common.sliderFocalRatio().mousedown(function () {MLB.NewtDesigner.state.sliderFocalRatio = true;});
    common.sliderFocalRatio().mouseup(function () {MLB.NewtDesigner.state.sliderFocalRatio = false;});
    // change event only fires when field is edited and changed: it does not fire when field changed programmatically
    common.focalRatio().change(function () {
        updateFieldsDependentOnFocalRatio();
        updateDesigners();
    });

    common.sliderAperture().mousemove(apertureSliderChange);
    common.sliderAperture().mousedown(function () {MLB.NewtDesigner.state.sliderAperture = true;});
    common.sliderAperture().mouseup(function () {MLB.NewtDesigner.state.sliderAperture = false;});
    // change event only fires when field is edited and changed: it does not fire when field changed programmatically
    common.aperture().change(function () {
        updateFieldsDependentOnAperture();
        updateDesigners();
    });

    common.chBoxUseComaCorrector().change(updateEyepieceOptimizerRows);
    common.comaCorrectorSelect().change(updateEyepieceOptimizerRows);
    common.comaCorrectorMag().change(updateEyepieceOptimizerRows);
    common.btnCalcEyepieceWidestFieldForEyePupil().click(findWidestFieldEyepiece);
    common.btnEyepieceSort().click(function () {
        if (common.sortEyepiecesByManufacturer()) {
            sortEyepiecesByManufacturerAddToSelections();
        } else if (common.sortEyepiecesByFL()) {
            sortEyepiecesByFLAddToSelections();
        } else {
            alert('can not sort eyepieces: unknown sort selection checked');
        }
    });

    common.focalPlaneToDiagDistance().change(graphDiagIllum);
    common.maxFieldDiaDiag().change(graphDiagIllum);
    common.acceptableMagLoss().change(graphDiagIllum);
    common.diagSizes().change(graphDiagIllum);

    common.btnUpdateDiagIllum().click(graphDiagIllum);
    common.btnUpdateBaffles().click(graphBaffles);
    common.btnUpdateLowrider().click(graphLowrider);
    common.btnCalcMinLowriderSecondaryMirrorSize().click(calcMinFoldingMirrorSize);
    common.btncalcLowriderSecondaryOffset().click(calcLowriderSecondaryOffset);
    common.btnCalcMinFocalPlaneToSecondaryDistance().click(calcMinFocalPlaneToSecondaryDistance);
    common.btnCalcCG().click(calcCG);
    common.btnUpdateRocker().click(graphRocker);
    common.btnUpdateFlexRocker().click(graphFlexRocker);
    common.btnUpdateET().click(graphEquatorialTable);
    common.focuserRackedInHeight().change(graphBaffles);
    common.focuserInwardFocusingDistance().change(graphBaffles);
    common.telescopeTubeThickness().change(graphBaffles);
    common.focalPlaneToDiagDistance().change(updateDesigners);
    // get/put events
    common.btnPutDesign().click(putData);
    common.btnGetDesign().click(getDataUpdateUI);

    // fill select coma corrector drop down box
    $.each(comaCorrectorsJson.comaCorrectors, function (i, v) {
        comaCorrectorStr = v.manufacturer + ' ' + v.model;
        optionStr = '<option value="' + comaCorrectorStr + '">' + comaCorrectorStr + '</option>';
        common.comaCorrectorSelect().append(optionStr);
    });
    // wire up selected comaCorrector change for telescope designer
    common.comaCorrectorSelect().change(function () {
        setSelectedComaCorrector(this.selectedIndex);
    });

    buildEyepieceHtmlTable();
    sortEyepiecesByManufacturerAddToSelections();
    // wire up selected eyepiece change for eyepiece designer
    $('[id^=' + config.EyeOptSelectID + ']').each(function (idIx) {
        $(this).change(function (e) {
            setEyeOptSelectedEyepiece(idIx, e.currentTarget.selectedIndex);
        });
    });
    // wire up buttons that remove selected eyepiece row
    $('[id^=' + config.btnRemoveEyepieceRowLit + ']').each(function (idIx) {
        $(this).click(function (e) {
            removeEyeOptSelectedEyepiece(idIx);
        });
    });


    // fill select focuser drop down box
    $.each(focusersJson.focusers, function (i, v) {
        focuserStr = v.manufacturer + ' ' + v.model;
        optionStr = '<option value="' + focuserStr + '">' + focuserStr + '</option>';
        common.focuserSelect().append(optionStr);
    });
    // wire up selected focuser change for telescope designer
    common.focuserSelect().change(function () {
        setSelectedFocuser(this.selectedIndex);
        updateDesigners();
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
    seedComaCorrector('TeleVue', 'Paracorr II');
    setEyeOptSelectedEyepieceUsingSelectStr(0, 'TeleVue Nagler 5 31mm 82deg');
    setEyeOptSelectedEyepieceUsingSelectStr(1, 'Nikon NAV 17mm 102deg');
    setEyeOptSelectedEyepieceUsingSelectStr(2, 'Clave Plossl 6mm 48deg');
    seedFocuser('MoonLite', 'CR 1.5');
    seedCGTable();
    seedMaterialFrictions();
    // must wait for seeded focuser et al
    // no conversion at startup
    processUomChange('ignore length conversion');
    updateFieldsDependentOnFocalRatio();
    updateFieldsDependentOnAperture();

    runAllDesigners();
});

// end of file