// copyright Mel Bartels, 2016 - 2025
// validate https://beautifytools.com/javascript-validator.php

// var MLB = {}; var $ = {}; var _ = {};

'use strict';

MLB.NewtDesigner = {};

MLB.NewtDesigner.state = {
	currentBtnSelect: undefined,
	currentDesigner: undefined,
	currentImage: undefined,
	lastUomSelected: 0,
	sliderFocalRatioChanging: undefined,
	sliderApertureChanging: undefined,
	lastApertureForFocalPlaneToDiagDistance: 10,
	sliderTelescopeFocalLengthChanging: undefined,
	sliderBortleScaleChanging: undefined,
	sliderVisualDetectionEyepieceApparentFOVChanging: undefined,
	sliderBinoscopeSecondaryBendingAngleDegChanging: undefined,
	sliderBinoscopeEyepieceDivergenceDeg: undefined,
	sliderBinoscopeSecondaryAxisDownwardTiltAngleDegChanging: undefined,

	combinedMirrorsReflectivity: undefined,
	mirrorEdgeThicknessInches: 1.625,
	isMeniscus: false,
	mirrorWeightLbs: undefined,
	eyeOptRowSet: [],
	diag: {},
	P2Intrusion: {},
	diagSeries: undefined,
	mirrorSupportPoints: undefined,
	scaling: undefined,
	mirrorFrontEdgeToFocalPlaneDistance: undefined,
	tubeBackEndToFocalPlaneDistance: undefined,
	lowriderModel: {},
	binoscopeModel: {},
	CG: {},
	rocker: {},
	flexRocker: {}
};

MLB.NewtDesigner.config = {
	titleText: '<h2>Newtonian Telescope Designer by Mel Bartels</h2>',

	// url hash, eg, https://www.bbastrodesigns.com/NewtDesigner.html#diagonal; matches names in the html page
	jumpTo: {
		// introduction

		// telescope designer
		telescope: 'telescope',
		whatDoesATelescopeDo: 'whatDoesATelescopeDo',
		telescopeParts: 'telescopeParts',
		howDoesATelescopeWork: 'howDoesATelescopeWork',
		scopePerformanceAsAFunctionOfExitPupil: 'scopePerformanceAsAFunctionOfExitPupil',
		focalLengthAndAperture: 'focalLengthAndAperture',
		focalRatios: 'focalRatios',
		apparentSizeImageSize: 'apparentSizeImageSize',
		FOV: 'FOV',
		calcApertureFREtendue: 'calcApertureFREtendue',
		fourXs: 'fourXs',
		rayTracing: 'rayTracing',
		theEyepiece: 'theEyepiece',
		theEye: 'theEye',
		resolution: 'resolution',
		diffractionAiryDisk: 'diffractionAiryDisk',
		etendue: 'etendue',
		HET: 'HET',
		lowMags: 'lowMags',
		idealTelescope: 'idealTelescope',
		telescopeCriteria: 'telescopeCriteria',
		makingYourOwnTelescope: 'makingYourOwnTelescope',
		RFT: 'RFT',
		collimation: 'collimation',
		focusingTolerance: 'focusingTolerance',
		turbulence: 'turbulence',
		fieldCurvature: 'fieldCurvature',
		natureOfTelescopeDesign: 'natureOfTelescopeDesign',
		foldingSlidingScopes: 'foldingSlidingScopes',
		whoInventedTheReflectingTelescope: 'whoInventedTheReflectingTelescope',
		formulae: 'formulae',
		// visual detection
		visualDetection: 'visual',
		visualUom: 'visualUom',
		visualMagnitudeScale: 'visualMagnitudeScale',
		visualBortleScale: 'visualBortleScale',
		visualObjectTypes: 'visualObjectTypes',
		visualObjectBrightness: 'visualObjectBrightness',
		visualHowFaint: 'visualHowFaint',
		visualApertureVsLP: 'visualApertureVsLP',
		visualHowToObserve: 'visualHowToObserve',
		visualBinoscopes: 'visualBinoscopes',
		visualNightVisionDevices: 'visualNightVisionDevices',
		// eyepieces
		eyepieces: 'eyepieces',
		magnification: 'magnification',
		// coma corrector
		comaCorrector: 'comaCorrector',
		// diagonal designer
		diagonal: 'diagonal',
		secondarySizeExperiment: 'secondarySizeExperiment',
		diagonalOffsetStudy: 'diagonalOffsetStudy',
		optimizeDiagonalSize: 'optimizeDiagonalSize',
		twoUnknownOptimizations: 'twoUnknownOptimizations',
		offAxisMask: 'offAxisMask',
		// spider and diffraction
		spiderDiffraction: 'spiderDiffraction',
		// mirror cell
		mirrorCell: 'mirrorCell',
		mirrorBackSupport: 'mirrorBackSupport',
		mirrorEdgeSupport: 'mirrorEdgeSupport',
		mirrorVentilation: 'mirrorVentilation',
		// focuser
		focuser: 'focuser',
		// optical layout, baffling
		opticalLayoutBaffling: 'opticalLayoutBaffling',
		// lowrider layout, baffling
		lowrider: 'lowrider',
		// binoscope
		binoscope: 'binoscope',
		binoscopeVisualObs: 'binoscopeVisualObs',
		OSPBinoscopes: 'OSPBinoscopes',
		binoscopeDesign: 'binoscopeDesign',
		// center of gravity
		COG: 'COG',
		// tube types
		tubeTypes: 'tubeTypes',
		// mount types
		mountTypes: 'mountTypes',
		vibration: 'vibration',
		ballscopes: 'ballscopes',
		panMount: 'panMount',
		EarlOfCrawford: 'EarlOfCrawford',
		threeAxisMounts: 'threeAxisMounts',
		Holcombe: 'Holcombe',
		Morse: 'Morse',
		// rocker
		rocker: 'rocker',
		movementFriction: 'movementFriction',
		// flex rocker
		flexRocker: 'flexRocker',
		// equatorial table
		ET: 'ET',
		omniLatitudeET: 'omniLatitudeET',
		turretET: 'turretET',
		tiltET: 'tiltET',
		// export and import designs
		exportImport: 'exportImport',
		design30inch: 'design30inch',
		proposedDesign30inchBinoscope: 'proposedDesign30inchBinoscope'
	},

	/* designers: each need three literals: button, designer div and image div
				  also add a common.btn...() function,
					   add a btn handler in $(window).ready(function () {}
					   and add a strategy to updateCurrentlySelectedDesigner()
	*/

	btnSelectIntroLit: 'btnSelectIntro',
	btnSelectTelescopeLit: 'btnSelectTelescope',
	btnSelectVisualLit: 'btnSelectVisual',
	btnSelectEyepiecesLit: 'btnSelectEyepieces',
	btnSelectComaCorrectorLit: 'btnSelectComaCorrector',
	btnSelectDiagonalLit: 'btnSelectDiagonal',
	btnSelectSpiderLit: 'btnSelectSpider',
	btnSelectMirrorCellLit: 'btnSelectMirrorCell',
	btnSelectFocuserLit: 'btnSelectFocuser',
	btnSelectBafflingLit: 'btnSelectBaffling',
	btnSelectLowriderBafflingLit: 'btnSelectLowriderBaffling',
	btnSelectBinoscopeLit: 'btnSelectBinoscope',
	btnSelectCGLit: 'btnSelectCG',
	btnSelectTubeLit: 'btnSelectTube',
	btnSelectMountLit: 'btnSelectMount',
	btnSelectRockerLit: 'btnSelectRocker',
	btnSelectFlexRockerLit: 'btnSelectFlexRocker',
	btnSelectETLit: 'btnSelectET',
	btnSelectExportImportLit: 'btnSelectExportImport',
	btnSelectNotesLit: 'btnSelectNotes',

	designIntroLit: 'designIntro',
	designTelescopeLit: 'designTelescope',
	designVisualLit: 'designVisual',
	designEyepiecesLit: 'designEyepieces',
	designComaCorrectorLit: 'designComaCorrector',
	designDiagonalLit: 'designDiagonal',
	designSpiderLit: 'designSpider',
	designMirrorCellLit: 'designMirrorCell',
	designFocuserLit: 'designFocuser',
	designBafflingLit: 'designBaffling',
	designLowriderBafflingLit: 'designLowriderBaffling',
	designBinoscopeLit: 'designBinoscope',
	designCGLit: 'designCG',
	designTubeLit: 'designTube',
	designMountLit: 'designMount',
	designRockerLit: 'designRocker',
	designFlexRockerLit: 'designFlexRocker',
	designETLit: 'designET',
	designExportImportLit: 'designExportImport',
	designNotesLit: 'designNotes',

	designIntroImageLit: 'designIntroImage',
	designTelescopeImageLit: 'designTelescopeImage',
	designVisualImageLit: 'designVisualImage',
	designEyepieceImageLit: 'designEyepieceImage',
	designComaCorrectorImageLit: 'designComaCorrectorImage',
	designDiagonalImageLit: 'designDiagonalImage',
	designSpiderImageLit: 'designSpiderImage',
	designMirrorCellImageLit: 'designMirrorCellImage',
	designFocuserImageLit: 'designFocuserImage',
	designBafflingImageLit: 'designBafflingImage',
	designLowriderBafflingImageLit: 'designLowriderBafflingImage',
	designBinoscopeImageLit: 'designBinoscopeImage',
	designCGImageLit: 'designCGImage',
	designTubeImageLit: 'designTubeImage',
	designMountImageLit: 'designMountImage',
	designRockerImageLit: 'designRockerImage',
	designFlexRockerImageLit: 'designFlexRockerImage',
	designETImageLit: 'designETImage',
	designExportImportImageLit: 'designExportImportImage',
	designNotesImageLit: 'designNotesImage',

	uomFocalRatioApertureSharedParmsLit: 'uomFocalRatioApertureSharedParms',
	diagSharedParmsLit: 'diagSharedParms',
	tubeSharedParmsLit: 'tubeSharedParms',
	focuserSharedParmsLit: 'focuserSharedParms',
	diagonalSharedParmsLit: 'diagonalSharedParms',

	btnSelectSelectedBackground: 'grey',
	btnSelectNotSelectedBackground: 'lightgrey',
	spiderTypeBackgroundColor: '#b5651d',
	tubeTypeBackgroundColor: '#d1eee1',
	mountTypeBackgroundColor: 'NavajoWhite',

	// uoms

	lbsLit: ' (lbs)',
	kgLit: ' (kg)',
	inchesLit: ' (inches)',
	sqrInchesLit: 'inches^2',
	sqrMmLit: 'mm^2',
	sqrFtLit: ' ft^2',
	sqrMeterLit: ' m^2',
	mmLit: ' (mm)',
	mmLitNS: 'mm',
	psiLit: ' lbs/square inches',
	kscLit: ' kg/square cms',
	degLit: ' deg',
	degLitNS: 'deg',
	etendueLit: ' cm^2deg^2',
	comaRMSLit: ' WavesRMS',

	// labels

	focalPlaneToDiagDistanceLabelLit: 'Focal plane to diagonal distance',
	maxFieldDiaDiagLabelLit: ' Max field diameter',
	diagSizesLabelLit: 'Diagonals (minor axis) to select from',
	sharedDiagSizeLabelLit: 'Diagonal (minor axis) size',
	diagOffsetFullIllumLabelLit: 'Diagonal offset using fully illuminated field',
	diagOffsetFocalPointLabelLit: 'Diagonal offset at center of focal plane',
	diagOffsetEyeToDiagLabelLit: 'Diagonal offset ',
	diagOffsetEyeToDiagLabel2Lit: ' above focal point = ',
	diagOffsetFieldEdgeLabelLit: 'Diagonal offset balancing edge of field illumination',
	diagOffsetShadowLit: 'Diagonal offset from front of tube or in de-focused star image',
	diagOffsetShadowLegendLit: 'Yellow = primary, blue = diagonal',
	diagOffsetAlignmentLit: 'Diagonal offset looking into focuser',
	diagOffsetAlignmentLegendLit: 'Yellow = primary, lightblue = diagonal, green = focuser, blue = eye',
	P2IntrusionLegendLit: 'black = P2',
	focuserRackedInHeightLabelLit: 'Racked in height',
	focuserTravelLabelLit: 'Focuser tube travel',
	barrelTubeInsideDiameterLabelLit: 'Barrel tube inside diameter',
	barrelTubeLengthLabelLit: 'Barrel tube length',
	focuserInwardFocusingDistanceLabelLit: 'Desired inward focusing distance',
	tubeODLabelLit: 'Outside diameter',
	tubeThicknessLabelLit: 'Thickness',
	lowriderSecondaryMirrorSizeLabelLit: 'Secondary size (minor axis)',
	lowriderSecondaryOffsetLabelLit: 'Secondary offset (towards primary and away from focuser)',
	focalPlaneToSecondaryDistanceLabelLit: 'Focal plane to secondary slanted distance',
	focalPointPerpendicularOffsetFromEdgeOfPrimaryLabelLit: 'Focal point perpendicular height from top edge of primary',
	binoscopeFocalPlaneToSecondaryDistanceLabelLit: 'Focal plane to secondary distance',
	binoscopeFocalPlaneToTertiaryDistanceLabelLit: 'Focal plane to tertiary distance',
	binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryLabelLit: 'Focal point perpendicular height from top edge of primary',
	tubeWeightLabelLit: 'Tube weight',
	CGToEyepieceDistanceLabelLit: 'Center of gravity to eyepiece distance',
	flexRockerCGToBackEdgeOfTubeClearanceLit: 'Center of gravity to back edge of tube distance',
	altBearingRadiusLabelLit: 'Altitude bearing radius',
	azBearingRadiusLabelLit: 'Azimuth bearing radius',
	rockerWeightLabelLit: 'rocker weight',
	flexRockerWeightLabelLit: 'rocker weight',

	// views

	sideViewLit: 'Side view',
	frontViewLit: 'Front view',
	topViewLit: 'Top view',

	// save/retrieve data

	NewtDesignerLit: 'NewtDesigner ',
	eyepieceSortManufacturerLit: 'manufacturer',
	eyepieceSortFocalLengthLit: 'focal length',
	eyepieceSortTrueFieldLit: 'true field of view',

	// visual detection

	matchedObjectsSelectLit: 'matchedObjectsSelect',
	easyToDetectLit: 'object is likely easy to detect',
	hardToDetectLit: 'object is likely hard to detect',
	impossibleToDetectLit: 'object is likely impossible to detect',

	// diag chart titles

	diagOffaxisIllumTitle: 'Diagonal off-axis illumination (includes light blocked by the diagonal)',
	diagIntegratedIllumTitle: 'Integrated illumination accross the field normalized to 1.0 (the closer to 1.0 the more light transmitted)',

	// diagonal error msgs

	diagTooSmallErrMsg: 'Secondary too small or focal plane to secondary distance too long.',
	focalPointToDiagTooLongErrMsg: 'Focal point to folding secondary mirror distance too long, or focal point offset from edge of primary mirror too long.',
	cannotBaffleErrMsg: 'Cannot construct a baffle: folding angle too acute.',
	binoscopeFocalPlaneToSecondaryDistanceTooShortMsg: 'The binscope focal plane to secondary distance is too short.',
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
	EyeOptMagnificationPerInchID: 'EyeOptMagnificationPerInch',
	EyeOptResolutionID: 'EyeOptResolution',
	EyeOptLimitingMagnitudeID: 'EyeOptLimitingMagnitude',
	EyeOpEtendueID: 'EyeOptEtendue',
	EyeOptComaID: 'EyeOptComa',

	btnRemoveEyepieceRowLit: 'btnRemoveEyepieceRow',

	// sorting eyepiece table
	eyepieceTableLit: 'eyeOptTable',
	manufacturerMatchStr: 'Manufacturer',
	manufacturerMatchIx: 1,
	focalLengthIx: 3,
	trueFieldOfViewIx: 7,

	// mount table

	categoryNameChar: ':',
	fieldToIgnore: 'priAxisAlign',

	// testing purposes

	drawCanvasOutline: true,
	drawTestLines: false,

	defaultCombinedMirrorsReflectivity: 0.8,
	maxPupil: 7,
	widestEyepieceFOVTopCount: 20,
	// allowance for diagonal sizing calcs
	diagTooSmallAllowance: 0.01,
	focusingTolerance: 4,
	eyeAboveFocalPlaneInches: 3,
	P2LengthBelowFocalPlaneInches: 3.55,
	P2WidthInches: 2,

	// display decimal points

	decimalPointsAiryDisk: 5,
	decimalPointsAngle: 1,
	decimalPointsAperture: 2,
	decimalPointsCG: 1,
	decimalPointsComaFreeDiameter: 3,
	decimalPointsComaRMS: 1,
	decimalPointsDiag: 2,
	decimalPointsDimension: 2,
	decimalPointsEtendue: 0,
	decimalPointsEyepieceApparentFOV: 0,
	decimalPointsEyepieceFieldStop: 1,
	decimalPointsEyepieceFL: 1,
	decimalPointsEyePupil: 2,
	decimalPointsFocalLength: 2,
	decimalPointsFocalRatio: 2,
	decimalPointsFocuser: 3,
	decimalPointsFOV: 2,
	decimalPointsLimitingMagnitude: 1,
	decimalPointsMagnification: 0,
	decimalPointsMagnitude: 2,
	decimalPointsMaterialArea: 1,
	decimalPointsPercent: 1,
	decimalPointsPressurePerArea: 4,
	decimalPointsRadiance: 1,
	decimalPointsResolution: 1,
	decimalPointsSagitta: 4,
	decimalPointsSagittalDifference: 6,
	decimalPointsTelescopeFocalLength: 2,
	decimalPointsTube: 3,
	decimalPointsWeight: 1,

	// min, max, step for aperture and telescope focal length sliders (focal ratio range set in html since it independent of unit conversions)

	sliderApertureUOMRange: [[4, 40, 0.1], [100, 1000, 2.5]],
	sliderTelescopeFocalLengthUOMRange: [[16, 140, 1], [400, 3500, 25]],

	contrastPercents: [6, 5, 4, 3, 2, 1],

	selectObjectLit: '---select an object---',
	noObjectMatchedLit: 'No object matched. Please try again.',

	bestEyepieceLit: '- best eyepiece is ',
	selectEyepieceLit: '---select an eyepiece---',

	// # of eyepiece rows in eyepiece table

	maxEyepieceRows: 12,

	// starting diagonal sizes

	diagonalsInches: [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12],
	diagonalsMm: [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300],

	// diagonal obstructions
	diagonalObstructionRatioNoImpact: 0.2,
	diagonalObstructionRatioSomeImpact: 0.33,
	diagonalObstructionRatioNoImpactColor: 'lightgreen',
	diagonalObstructionRatioSomeImpactColor: 'yellow',
	diagonalObstructionRatioMajorImpactColor: 'red',

	// drawing values

	canvasWidth: 1200,
	canvasHeight: 500,
	canvasBorder: 5,
	apertureToCanvasRatio: 0.8,
	canvasDimensionHeight: 50,
	canvasDimensionHalfHeight: 5,
	canvasTextBorder: 4,
	canvasLineWidth: 1,
	canvasTestLineLength: 1500,
	canvasFont: '10pt arial',
	canvasAxisStyle: 'blue',
	canvasBackBearingStyle: 'green',
	canvasBaffleAngleStyle: 'lightgreen',
	canvasBaffleEdgeStyle: 'darkgreen',
	canvasBaffleStyle: 'red',
	canvasCrosshairStyle: 'red',
	canvasDiagStyle: 'lightblue',
	canvasErrorStyle: 'red',
	canvasEyeStyle: 'white',
	canvasFocuserBaffleStyle: 'limegreen',
	canvasFocuserStyle: 'green',
	canvasFrontBearingStyle: 'red',
	canvasGlassStyle: 'blue',
	canvasHumanStyle: 'lightgray',
	canvasLightBaffleStyle: '#ffaaaa',
	canvasMirrorFaceStyle: 'yellow',
	canvasOpticalPathAltStyle: 'red',
	canvasOpticalPathStyle: '#aaaaff',
	canvasStructureLightStyle: 'gray',
	canvasStructureStyle: 'black',
	canvasTestStyle: 'orange',
	mirrorCellSupportPointRadius: 3,

	// drawing text

	projectedBaffleDimensionText: 'baffle dia = ',
	primaryMirrorBaffleDimensionText: 'baffle length = ',
	primaryMirrorToFocalPlaneDimensionText: 'primary mirror front edge to focal point = ',
	primaryMirrorToTubeEndDimensionText: 'primary mirror front edge to end of tube = ',
	primaryMirrorToFocalPlaneVerticalHeightText: 'primary mirror to focal plane vertical distance = ',
	focalPlaneToFoldingMirrorSlantedText: 'focal plane to folding mirror slanted distance = ',
	primaryMirrorToFoldingMirrorText: 'primary mirror front edge to folding mirror = ',
	primaryMirrorToSecondaryMirrorText: 'primary mirror front edge to secondary mirror = ',
	secondaryMirrorToTertiaryMirrorText: 'secondary mirror to tertiary mirror = ',
	primaryMirrorToP3MirrorText: 'primary mirror to focal plane = ',
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
	// per A.E.Conrady, focusing tolerance for F4 is 0.0014"; since tolerance goes as focal ratio squared, F1 = 0.0014/16=0.000088
	focusingToleranceInchesForFocalRatioOf1: 0.000088,

	primaryMirrorCellThicknessInches: 2,
	woodThicknessInches: 0.5,
	// 3/4" plywood weighs 2.2 lbs per square foot; 3/4" ply ft^2 is 1/16 of a cubic foot, so weight for a full cubic foot = 2.2*16~35
	woodLbsPerCubicFt: 35,
	// 1x1x1 inch glass cube weighs 0.09 lbs
	glassPoundsPerCubicInch: 0.09,
	pushAngleDegFromHorizontal: 48,
	frictionOfMovementPadIdealPSI: 15,
	padThicknessInches: 0.25,
	altRimThicknessInches: 1.5,
	flexRockerBaseRingWidthFactor: 1.2,
	flexRockerThicknessInches: 1,

	// binoscope designer
	binoscopeFocalPlaneToSecondaryDistance: 10.5,
	binoscopeFocalPlaneToTertiaryDistance: 2,
	binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary: 3,
	humanFaceWidthInches: 5.7,
	humanFaceHeightInches: 8.9,
	humanEyeToShoulderInches: 6,
	humanShoulderWidthInches: 20,
	humanShoulderDepthInches: 6,
	humanNeckWidthInches: 4,

	// CG designer...

	// starting weights
	weights: {
		mirrorMount: 3,
		tube: 10,
		altitudeBearings: 2,
		focuser: 1,
		diagonal: 1,
		spider: 1,
		eyepiece: 1
	},
	// starting vertical offsets
	verticalOffsetsInches: {
		altitudeBearings: -2,
		focuser: 4,
		eyepiece: 5
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
	// lits
	CGIDs: {
		part: 'CGPart',
		weight: 'CGWeight',
		distance: 'CGDistance',
		verticalOffset: 'CGVerticalOffset'
	}
};

MLB.NewtDesigner.common = {
	config: MLB.NewtDesigner.config,

	titleText: function () {
		return $('[id=titleText]');
	},
	btnScrollToTop: function () {
		return $('[id=btnScrollToTop]');
	},

	// designers

	btnSelectIntro: function () {
		return $('[id=' + this.config.btnSelectIntroLit + ']');
	},
	btnSelectTelescope: function () {
		return $('[id=' + this.config.btnSelectTelescopeLit + ']');
	},
	btnSelectVisual: function () {
		return $('[id=' + this.config.btnSelectVisualLit + ']');
	},
	btnSelectEyepieces: function () {
		return $('[id=' + this.config.btnSelectEyepiecesLit + ']');
	},
	btnSelectComaCorrector: function () {
		return $('[id=' + this.config.btnSelectComaCorrectorLit + ']');
	},
	btnSelectDiagonal: function () {
		return $('[id=' + this.config.btnSelectDiagonalLit + ']');
	},
	btnSelectSpider: function () {
		return $('[id=' + this.config.btnSelectSpiderLit + ']');
	},
	btnSelectMirrorCell: function () {
		return $('[id=' + this.config.btnSelectMirrorCellLit + ']');
	},
	btnSelectFocuser: function () {
		return $('[id=' + this.config.btnSelectFocuserLit + ']');
	},
	btnSelectBaffling: function () {
		return $('[id=' + this.config.btnSelectBafflingLit + ']');
	},
	btnSelectLowriderBaffling: function () {
		return $('[id=' + this.config.btnSelectLowriderBafflingLit + ']');
	},
	btnSelectBinoscope: function () {
		return $('[id=' + this.config.btnSelectBinoscopeLit + ']');
	},
	btnSelectTube: function () {
		return $('[id=' + this.config.btnSelectTubeLit + ']');
	},
	btnSelectCG: function () {
		return $('[id=' + this.config.btnSelectCGLit + ']');
	},
	btnSelectMount: function () {
		return $('[id=' + this.config.btnSelectMountLit + ']');
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
	btnSelectExportImport: function () {
		return $('[id=' + this.config.btnSelectExportImportLit + ']');
	},
	btnSelectNotes: function () {
		return $('[id=' + this.config.btnSelectNotesLit + ']');
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
	designSpider: function () {
		return $('[id=' + this.config.designSpiderLit + ']');
	},
	designBaffling: function () {
		return $('[id=' + this.config.designBafflingLit + ']');
	},
	designTube: function () {
		return $('[id=' + this.config.designTubeLit + ']');
	},
	designMount: function () {
		return $('[id=' + this.config.designRockerLit + ']');
	},
	designET: function () {
		return $('[id=' + this.config.designETLit + ']');
	},

	// collapsing sections using classes with associated buttons...

	accordions: function () {
		return $('.accordion');
	},
	// intro
	// telescope
	btnWhatDoesATelescopeDo: function () {
		return $('[id=btnWhatDoesATelescopeDo]')[0];
	},
	btnTelescopeParts: function () {
		return $('[id=btnTelescopeParts]')[0];
	},
	btnHowDoesATelescopeWork: function () {
		return $('[id=btnHowDoesATelescopeWork]')[0];
	},
	btnIdealTelescope: function () {
		return $('[id=btnIdealTelescope]')[0];
	},
	btnTelescopeCriteria: function () {
		return $('[id=btnTelescopeCriteria]')[0];
	},
	btnMakeYourOwnTelescope: function () {
		return $('[id=btnMakeYourOwnTelescope]')[0];
	},
	btnRFT: function () {
		return $('[id=btnRFT]')[0];
	},
	btnCollimation: function () {
		return $('[id=btnCollimation]')[0];
	},
	btnFocusingTolerance: function () {
		return $('[id=btnFocusingTolerance]')[0];
	},
	btnTurbulence: function () {
		return $('[id=btnTurbulence]')[0];
	},
	btnFieldCurvature: function () {
		return $('[id=btnFieldCurvature]')[0];
	},
	btnNatureOfTelescopeDesign: function () {
		return $('[id=btnNatureOfTelescopeDesign]')[0];
	},
	btnFoldingSlidingScopes: function () {
		return $('[id=btnFoldingSlidingScopes]')[0];
	},
	btnWhoInventedTheReflectingTelescope: function () {
		return $('[id=btnWhoInventedTheReflectingTelescope]')[0];
	},
	btnUsefulFormulae: function () {
		return $('[id=btnUsefulFormulae]')[0];
	},
	// visual detection
	btnVisualUom: function () {
		return $('[id=btnVisualUom]')[0];
	},
	btnVisualMagnitudeScale: function () {
		return $('[id=btnVisualMagnitudeScale]')[0];
	},
	btnVisualBortleScale: function () {
		return $('[id=btnVisualBortleScale]')[0];
	},
	btnVisualObjectTypes: function () {
		return $('[id=btnVisualObjectTypes]')[0];
	},
	btnVisualObjectBrightness: function () {
		return $('[id=btnVisualObjectBrightness]')[0];
	},
	btnVisualHowFaint: function () {
		return $('[id=btnVisualHowFaint]')[0];
	},
	btnVisualApertureVsLP: function () {
		return $('[id=btnVisualApertureVsLP]')[0];
	},
	btnVisualHowToObserve: function () {
		return $('[id=btnVisualHowToObserve]')[0];
	},
	btnVisualBinoscopes: function () {
		return $('[id=btnVisualBinoscopes]')[0];
	},
	btnVisualNightVisionDevices: function () {
		return $('[id=btnVisualNightVisionDevices]')[0];
	},
	// eyepieces
	btnMagnification: function () {
		return $('[id=btnMagnification]')[0];
	},
	distanceToObject: function () {
		return $('[id=distanceToObject]');
	},
	eyepieceTravelLabel: function () {
		return $('[id=eyepieceTravelLabel]');
	},
	// coma corrector
	// diagonal
	btnSecondarySizeExperiment: function () {
		return $('[id=btnSecondarySizeExperiment]')[0];
	},
	btnDiagonalOffsetStudy: function () {
		return $('[id=btnDiagonalOffsetStudy]')[0];
	},
	btnOptimizeDiagonalSize: function () {
		return $('[id=btnOptimizeDiagonalSize]')[0];
	},
	btnOffAxisMask: function () {
		return $('[id=btnOffAxisMask]')[0];
	},
	// spider and diffraction
	// mirror cell
	btnMirrorBackSupport: function () {
		return $('[id=btnMirrorBackSupport]')[0];
	},
	btnMirrorEdgeSupport: function () {
		return $('[id=btnMirrorEdgeSupport]')[0];
	},
	btnMirrorVentilation: function () {
		return $('[id=btnMirrorVentilation]')[0];
	},
	// focuser
	// optical layout, baffling
	// lowrider layout, baffling
	// binoscope
	btnBinoscopeVisualObs: function () {
		return $('[id=btnBinoscopeVisualObs]')[0];
	},
	btnOSPBinoscopes: function () {
		return $('[id=btnOSPBinoscopes]')[0];
	},
	btnBinoscopeDesign: function () {
		return $('[id=btnBinoscopeDesign]')[0];
	},
	// center of gravity
	// tube types
	// mount types
	btnVibration: function () {
		return $('[id=btnVibration]')[0];
	},
	btnBallscopes: function () {
		return $('[id=btnBallscopes]')[0];
	},
	btnPanMount: function () {
		return $('[id=btnPanMount]')[0];
	},
	btnEarlOfCrawford: function () {
		return $('[id=btnEarlOfCrawford]')[0];
	},
	btnThreeAxisMounts: function () {
		return $('[id=btnThreeAxisMounts]')[0];
	},
	btnHolcombe: function () {
		return $('[id=btnHolcombe]')[0];
	},
	btnMorse: function () {
		return $('[id=btnMorse]')[0];
	},
	// rocker
	// flex rocker
	// equatorial table
	btnOmniLatitudeET: function () {
		return $('[id=btnOmniLatitudeET]')[0];
	},
	btnTurretET: function () {
		return $('[id=btnTurretET]')[0];
	},
	btnTiltET: function () {
		return $('[id=btnTiltET]')[0];
	},

	// export and import designs

	// ...end of collapsing sections using classes with associated buttons

	// shared parms divs

	uomFocalRatioApertureSharedParms: function () {
		return $('[id=' + this.config.uomFocalRatioApertureSharedParmsLit + ']');
	},
	diagSharedParms: function () {
		return $('[id=' + this.config.diagSharedParmsLit + ']');
	},
	tubeSharedParms: function () {
		return $('[id=' + this.config.tubeSharedParmsLit + ']');
	},
	focuserSharedParms: function () {
		return $('[id=' + this.config.focuserSharedParmsLit + ']');
	},
	diagonalSharedParms: function () {
		return $('[id=' + this.config.diagonalSharedParmsLit + ']');
	},

	// shared parms elements

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
		return $('[id=focalRatio]');
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
		return $('[id=aperture]');
	},
	apertureVal: function () {
		return +this.aperture().val();
	},
	apertureInchesVal: function () {
		return this.convertUomToInches(this.apertureVal());
	},
	apertureUOMlabel: function () {
		return $('[id=apertureUOMlabel]');
	},
	RadianceFluxlabel: function () {
		return $('[id=RadianceFluxlabel]');
	},
	sliderTelescopeFocalLength: function () {
		return $('[id=sliderTelescopeFocalLength]');
	},
	sliderTelescopeFocalLengthVal: function () {
		return +this.sliderTelescopeFocalLength().val();
	},
	telescopeFocalLength: function () {
		return $('[id=telescopeFocalLength]');
	},
	telescopeFocalLengthVal: function () {
		return +this.telescopeFocalLength().val();
	},
	telescopeFocalLengthInchesVal: function () {
		return this.convertUomToInches(this.telescopeFocalLengthVal());
	},
	telescopeFocalLengthUOMlabel: function () {
		return $('[id=telescopeFocalLengthUOMlabel]');
	},
	chBoxLockFocalLength: function () {
		return $('[id=chBoxLockFocalLength]');
	},
	lockFocalLength: function () {
		return this.chBoxLockFocalLength().is(':checked');
	},
	telescopeResults: function () {
		return $('[id=telescopeResults]');
	},
	telescopeDesignerResultsLabel: function () {
		return $('[id=telescopeDesignerResultsLabel]');
	},

	// telescope designer

	btnUpdateTelescopeResults: function () {
		return $('[id=btnUpdateTelescopeResults]');
	},
	combinedMirrorsReflectivity: function () {
		return $('[id=combinedMirrorsReflectivity]');
	},
	combinedMirrorsReflectivityVal: function () {
		return +this.combinedMirrorsReflectivity().val();
	},
	spacePenetratingPowerLabel: function () {
		return $('[id=spacePenetratingPowerLabel]');
	},
	mirrorEdgeThickness: function () {
		return $('[id=mirrorEdgeThickness]');
	},
	mirrorEdgeThicknessVal: function () {
		return +this.mirrorEdgeThickness().val();
	},
	mirrorEdgeThicknessInchesVal: function () {
		return this.convertUomToInches(this.mirrorEdgeThicknessVal());
	},
	mirrorWeightLabel: function () {
		return $('[id=mirrorWeightLabel]');
	},
	mirrorCGLabel: function () {
		return $('[id=mirrorCGLabel]');
	},
	chBoxIsMeniscus: function () {
		return $('[id=chBoxIsMeniscus]');
	},
	isMeniscus: function () {
		return this.chBoxIsMeniscus().is(':checked');
	},
	chBoxAEFUseComaCorrector: function () {
		return $('[id=chBoxAEFUseComaCorrector]');
	},
	useAEFComaCorrectorMagnificationVal: function () {
		return this.chBoxAEFUseComaCorrector().is(':checked');
	},
	AEFComaCorrectorSelect: function () {
		return $('#AEFComaCorrectorSelect');
	},
	AEFComaCorrectorSelectVal: function () {
		return this.AEFComaCorrectorSelect().val();
	},
	AEFComaCorrectorMag: function () {
		return $('[id=AEFComaCorrectorMag]');
	},
	AEFComaCorrectorMagVal: function () {
		return +this.AEFComaCorrectorMag().val();
	},
	AEFEyepieceSelect: function () {
		return $('#AEFEyepieceSelect');
	},
	AEFEyepieceSelectVal: function () {
		return this.AEFEyepieceSelect().val();
	},
	AEFPupil: function () {
		return $('[id=AEFPupil]');
	},
	AEFPupilVal: function () {
		return +this.AEFPupil().val();
	},
	AEFFOVDeg: function () {
		return $('[id=AEFFOVDeg]');
	},
	AEFFOVDegVal: function () {
		return +this.AEFFOVDeg().val();
	},
	AEFResultsLabel: function () {
		return $('[id=AEFResultsLabel]');
	},

	// eyepiece designer

	chBoxUseComaCorrector: function () {
		return $('[id=chBoxUseComaCorrector]');
	},
	useComaCorrectorMagnificationVal: function () {
		return this.chBoxUseComaCorrector().is(':checked');
	},
	comaCorrectorSelect: function () {
		return $('#comaCorrectorSelect');
	},
	comaCorrectorSelectVal: function () {
		return this.comaCorrectorSelect().val();
	},
	comaCorrectorMag: function () {
		return $('[id=comaCorrectorMag]');
	},
	comaCorrectorMagVal: function () {
		return +this.comaCorrectorMag().val();
	},
	btnListEyepiecesWidestFieldForEyePupil: function () {
		return $('[id=btnListEyepiecesWidestFieldForEyePupil]');
	},
	btnCalcEyepieceWidestFieldForEyePupil: function () {
		return $('[id=btnCalcEyepieceWidestFieldForEyePupil]');
	},
	btnCopySelectedEyepieceToEyepieceTable: function () {
		return $('[id=btnCopySelectedEyepieceToEyepieceTable]');
	},
	eyePupilmm: function () {
		return $('[id=eyePupilmm]');
	},
	eyePupilmmVal: function () {
		return +this.eyePupilmm().val();
	},
	widestEyepiecesForEyePupilLabel: function () {
		return $('[id=widestEyepiecesForEyePupilLabel]');
	},
	btnEyepieceSortManufacturer: function () {
		return $('[name=btnEyepieceSortManufacturer]');
	},
	btnEyepieceSortFocalLength: function () {
		return $('[name=btnEyepieceSortFocalLength]');
	},
	btnEyepieceSortFieldOfView: function () {
		return $('[name=btnEyepieceSortFieldOfView]');
	},
	btnEyepieceTableSortFocalLength: function () {
		return $('[name=btnEyepieceTableSortFocalLength]');
	},
	btnEyepieceTableSortFieldOfView: function () {
		return $('[name=btnEyepieceTableSortFieldOfView]');
	},
	eyeOptTableBody: function () {
		return $('#eyeOptTableBody');
	},

	// calc FR for max etendue calculator

	calcFRMaxEtendueEyePupilmm: function () {
		return $('[id=calcFRMaxEtendueEyePupilmm]');
	},
	calcFRMaxEtendueEyePupilmmVal: function () {
		return +this.calcFRMaxEtendueEyePupilmm().val();
	},
	calcFRMaxEtendueEyepieceFLmm: function () {
		return $('[id=calcFRMaxEtendueEyepieceFLmm]');
	},
	calcFRMaxEtendueEyepieceFLmmVal: function () {
		return +this.calcFRMaxEtendueEyepieceFLmm().val();
	},
	calcFRMaxEtendueComaCorrectorMag: function () {
		return $('[id=calcFRMaxEtendueComaCorrectorMag]');
	},
	calcFRMaxEtendueComaCorrectorMagVal: function () {
		return +this.calcFRMaxEtendueComaCorrectorMag().val();
	},
	btnCalcFRMaxEtendue: function () {
		return $('[id=btnCalcFRMaxEtendue]');
	},
	calcFRMaxEtendueResultFR: function () {
		return $('[id=calcFRMaxEtendueResultFR]');
	},
	calcFRMaxEtendueEyepieceFOV: function () {
		return $('[id=calcFRMaxEtendueEyepieceFOV]');
	},
	calcFRMaxEtendueEyepieceFOVVal: function () {
		return +this.calcFRMaxEtendueEyepieceFOV().val();
	},
	btnCalcFREtendue: function () {
		return $('[id=btnCalcFREtendue]');
	},
	calcFRMaxEtendueResultEtendue: function () {
		return $('[id=calcFRMaxEtendueResultEtendue]');
	},

	// visual detection designer

	limitingMagnitude: function () {
		return $('[id=limitingMagnitude]');
	},
	searchObjectString: function () {
		return $('[id=searchObjectString]');
	},
	searchObjectStringVal: function () {
		return this.searchObjectString().val();
	},
	btnSearchObjectCatalog: function () {
		return $('[id=btnSearchObjectCatalog]');
	},
	matchedObjectsSelect: function () {
		return $('#' + this.config.matchedObjectsSelectLit);
	},
	matchedObjectsSelectVal: function () {
		return this.matchedObjectsSelect().val();
	},
	objectName: function () {
		return $('[id=objectName]');
	},
	objectNameVal: function () {
		return this.objectName().val();
	},
	objectApparentMagnitude: function () {
		return $('[id=objectApparentMagnitude]');
	},
	objectApparentMagnitudeVal: function () {
		return +this.objectApparentMagnitude().val();
	},
	objectCalculatedSurfaceBrightness: function () {
		return $('[id=objectCalculatedSurfaceBrightness]');
	},
	objectSizeArcMin1: function () {
		return $('[id=objectSizeArcMin1]');
	},
	objectSizeArcMin1Val: function () {
		return +this.objectSizeArcMin1().val();
	},
	objectSizeArcMin2: function () {
		return $('[id=objectSizeArcMin2]');
	},
	objectSizeArcMin2Val: function () {
		return +this.objectSizeArcMin2().val();
	},
	skyBackgroundBrightnessUnaidedEye: function () {
		return $('[id=skyBackgroundBrightnessUnaidedEye]');
	},
	skyBackgroundBrightnessUnaidedEyeVal: function () {
		return +this.skyBackgroundBrightnessUnaidedEye().val();
	},
	sliderBortleScale: function () {
		return $('[id=sliderBortleScale]');
	},
	sliderBortleScaleVal: function () {
		return +this.sliderBortleScale().val();
	},
	BortleScale: function () {
		return $('[id=BortleScale]');
	},
	BortleScaleVal: function () {
		return +this.BortleScale().val();
	},
	visualDetectionResultsTable: function () {
		return $('#visualDetectionResultsTable');
	},
	visualDetectionApertureVariance: function () {
		return $('[id=visualDetectionApertureVariance]');
	},
	visualDetectionApertureVarianceVal: function () {
		return +this.visualDetectionApertureVariance().val();
	},
	visualDetectionCalcChartID: function () {
		return 'visualDetectionCalcChart';
	},
	visualDetectionObjectApparentSizeVsMagnificationChartID: function () {
		return 'visualDetectionObjectApparentSizeVsMagnificationChart';
	},
	visualDetectionSQMsForObjectContrastsChartID: function () {
		return 'visualDetectionSQMsForObjectContrastsChart';
	},
	magnitudesToAdd: function () {
		return $('[id=magnitudesToAdd]');
	},
	btnCalcTotalMagnitude: function () {
		return $('[id=btnCalcTotalMagnitude]');
	},
	totalMagnitude: function () {
		return $('[id=totalMagnitude]');
	},

	// diagonal designer

	focalPlaneToDiagDistance: function () {
		return $('[id=focalPlaneToDiagDistance]');
	},
	focalPlaneToDiagDistanceVal: function () {
		return +this.focalPlaneToDiagDistance().val();
	},
	focalPlaneToDiagDistanceLabel: function () {
		return $('[id=focalPlaneToDiagDistanceLabel]');
	},
	btnCalcFocalPlaneToDiagDistanceFromFocuserDesigner: function () {
		return $('[id=btnCalcFocalPlaneToDiagDistanceFromFocuserDesigner]');
	},
	maxFieldDiaDiag: function () {
		return $('[id=maxFieldDiaDiag]');
	},
	maxFieldDiaDiagVal: function () {
		return +this.maxFieldDiaDiag().val();
	},
	maxFieldDiaDiagLabel: function () {
		return $('[id=maxFieldDiaDiagLabel]');
	},
	acceptableMagLoss: function () {
		return $('[id=acceptableMagLoss]');
	},
	acceptableMagLossVal: function () {
		return +this.acceptableMagLoss().val();
	},
	diagSizes: function () {
		return $('[id=diagSizes]');
	},
	diagSizesVal: function () {
		return this.diagSizes().val();
	},
	diagSizesLabel: function () {
		return $('[id=diagSizesLabel]');
	},
	chBoxIncludeFocuserBarrelVignetting: function () {
		return $('[id=chBoxIncludeFocuserBarrelVignetting]');
	},
	includeFocuserBarrelVignetting: function () {
		return this.chBoxIncludeFocuserBarrelVignetting().is(':checked');
	},
	btnUpdateDiagIllum: function () {
		return $('[id=btnUpdateDiagIllum]');
	},
	diagChartID: function () {
		return 'diagChart';
	},
	diagIntegratedIllumChartID: function () {
		return 'diagIntegratedIllumChart';
	},
	diagResults: function () {
		return $('[id=diagResults]');
	},
	chBoxIncludeP2Intrusion: function () {
		return $('[id=chBoxIncludeP2Intrusion]');
	},
	includeP2Intrusion: function () {
		return this.chBoxIncludeP2Intrusion().is(':checked');
	},
	P2IntrusionResultsLabel: function () {
		return $('[id=P2IntrusionResultsLabel]');
	},
	offaxisMaskResults: function () {
		return $('[id=offaxisMaskResults]');
	},
	offsetShadowCanvasID: function () {
		return $('#offsetShadowCanvas')[0];
	},
	offsetShadowCanvasDiv: function () {
		return $('#offsetShadowCanvasDiv');
	},

	offsetAlignmentCanvasID: function () {
		return $('#offsetAlignmentCanvas')[0];
	},
	offsetAlignmentCanvasDiv: function () {
		return $('#offsetAlignmentCanvasDiv');
	},

	// spider designer...

	spiderTypeSelect: function () {
		return $('#spiderTypeSelect');
	},
	spiderTypeSelectVal: function () {
		return this.spiderTypeSelect().val();
	},
	spiderTypeTableBody: function () {
		return $('#spiderTypeTableBody');
	},

	// mirror cell designer...

	mirrorCellDesignerResultsLabel: function () {
		return $('[id=mirrorCellDesignerResultsLabel]');
	},
	btnMirrorSupportPoints: function () {
		return $('[name=btnMirrorSupportPoints]');
	},
	btnMirrorSupportPointsCheckedValue: function () {
		return $("input[name=btnMirrorSupportPoints]:checked").val();
	},
	mirrorCellCanvasID: function () {
		return $('#mirrorCellCanvas')[0];
	},
	mirrorCellCanvasDiv: function () {
		return $('#mirrorCellCanvasDiv');
	},
	mirrorCellDetailsLabel: function () {
		return $('[id=mirrorCellDetailsLabel]');
	},

	// telescope tube parms...

	telescopeTubeOD: function () {
		return $('[id=telescopeTubeOD]');
	},
	telescopeTubeODVal: function () {
		return +this.telescopeTubeOD().val();
	},
	tubeODLabel: function () {
		return $('[id=tubeODLabel]');
	},
	telescopeTubeThickness: function () {
		return $('[id=telescopeTubeThickness]');
	},
	telescopeTubeThicknessVal: function () {
		return +this.telescopeTubeThickness().val();
	},
	tubeThicknessLabel: function () {
		return $('[id=tubeThicknessLabel]');
	},

	// focuser parms...

	focuserSelect: function () {
		return $('#focuserSelect');
	},
	focuserSelectVal: function () {
		return this.focuserSelect().val();
	},
	focuserRackedInHeight: function () {
		return $('[id=focuserRackedInHeight]');
	},
	focuserRackedInHeightVal: function () {
		return +this.focuserRackedInHeight().val();
	},
	focuserRackedInHeightLabel: function () {
		return $('[id=focuserRackedInHeightLabel]');
	},
	focuserTravel: function () {
		return $('[id=focuserTravel]');
	},
	focuserTravelVal: function () {
		return +this.focuserTravel().val();
	},
	focuserTravelLabel: function () {
		return $('[id=focuserTravelLabel]');
	},
	barrelTubeInsideDiameter: function () {
		return $('[id=barrelTubeInsideDiameter]');
	},
	barrelTubeInsideDiameterVal: function () {
		return +this.barrelTubeInsideDiameter().val();
	},
	barrelTubeInsideDiameterLabel: function () {
		return $('[id=barrelTubeInsideDiameterLabel]');
	},
	barrelTubeLength: function () {
		return $('[id=barrelTubeLength]');
	},
	barrelTubeLengthVal: function () {
		return +this.barrelTubeLength().val();
	},
	barrelTubeLengthLabel: function () {
		return $('[id=barrelTubeLengthLabel]');
	},
	focuserInwardFocusingDistance: function () {
		return $('[id=focuserInwardFocusingDistance]');
	},
	focuserInwardFocusingDistanceVal: function () {
		return +this.focuserInwardFocusingDistance().val();
	},
	focuserInwardFocusingDistanceLabel: function () {
		return $('[id=focuserInwardFocusingDistanceLabel]');
	},

	// focuser baffle designer...

	diagToFocuserBaffleDistance: function () {
		return $('[id=diagToFocuserBaffleDistance]');
	},
	diagToFocuserBaffleDistanceVal: function () {
		return +this.diagToFocuserBaffleDistance().val();
	},
	btnPlotFocuserBaffle: function () {
		return $('[id=btnPlotFocuserBaffle]');
	},
	focuserBaffleCanvasID: function () {
		return $('#focuserBaffleCanvas')[0];
	},
	focuserBaffleCanvasDiv: function () {
		return $('#focuserBaffleCanvasDiv');
	},

	// baffle designer...

	sharedDiagSize: function () {
		return $('[id=sharedDiagSize]');
	},
	sharedDiagSizeVal: function () {
		return +this.sharedDiagSize().val();
	},
	sharedDiagSizeLabel: function () {
		return $('[id=sharedDiagSizeLabel]');
	},
	diagOffset: function () {
		return $('[id=diagOffset]');
	},
	diagOffsetVal: function () {
		return +this.diagOffset().val();
	},
	diagOffsetLabel: function () {
		return $('[id=diagOffsetLabel]');
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
	btnUpdateBaffles: function () {
		return $('[id=btnUpdateBaffles]');
	},
	focuserBaffleDesignerResultsLabel: function () {
		return $('[id=focuserBaffleDesignerResultsLabel]');
	},

	// lowrider baffle designer...

	btnCalcMinLowriderSecondaryMirrorSize: function () {
		return $('[id=btnCalcMinLowriderSecondaryMirrorSize]');
	},
	btnCalcLowriderSecondaryOffset: function () {
		return $('[id=btnCalcLowriderSecondaryOffset]');
	},
	btnCalcMaxFocalPlaneToSecondaryDistance: function () {
		return $('[id=btnCalcMaxFocalPlaneToSecondaryDistance]');
	},
	btnUpdateLowriderBaffleDiagonalFromBaffleDesigner: function () {
		return $('[id=btnUpdateLowriderBaffleDiagonalFromBaffleDesigner]');
	},
	lowriderSecondaryMirrorSize: function () {
		return $('[id=lowriderSecondaryMirrorSize]');
	},
	lowriderSecondaryMirrorSizeVal: function () {
		return +this.lowriderSecondaryMirrorSize().val();
	},
	lowriderSecondaryMirrorSizeLabel: function () {
		return $('[id=lowriderSecondaryMirrorSizeLabel]');
	},
	lowriderSecondaryOffset: function () {
		return $('[id=lowriderSecondaryOffset]');
	},
	lowriderSecondaryOffsetVal: function () {
		return +this.lowriderSecondaryOffset().val();
	},
	lowriderSecondaryOffsetLabel: function () {
		return $('[id=lowriderSecondaryOffsetLabel]');
	},
	focalPlaneToSecondaryDistance: function () {
		return $('[id=focalPlaneToSecondaryDistance]');
	},
	focalPlaneToSecondaryDistanceVal: function () {
		return +this.focalPlaneToSecondaryDistance().val();
	},
	focalPlaneToSecondaryDistanceLabel: function () {
		return $('[id=focalPlaneToSecondaryDistanceLabel]');
	},
	focalPointPerpendicularOffsetFromEdgeOfPrimary: function () {
		return $('[id=focalPointPerpendicularOffsetFromEdgeOfPrimary]');
	},
	focalPointPerpendicularOffsetFromEdgeOfPrimaryVal: function () {
		return +this.focalPointPerpendicularOffsetFromEdgeOfPrimary().val();
	},
	focalPointPerpendicularOffsetFromEdgeOfPrimaryLabel: function () {
		return $('[id=focalPointPerpendicularOffsetFromEdgeOfPrimaryLabel]');
	},
	btnUpdateLowrider: function () {
		return $('[id=btnUpdateLowrider]');
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

	// binoscope designer...

	chBoxBinoscopeLockSecondaryBendingAngle: function () {
		return $('[id=chBoxBinoscopeLockSecondaryBendingAngle]');
	},
	binoscopeLockSecondaryBendingAngle: function () {
		return this.chBoxBinoscopeLockSecondaryBendingAngle().is(':checked');
	},
	chBoxBinoscopeLockEyepieceDivergence: function () {
		return $('[id=chBoxBinoscopeLockEyepieceDivergence]');
	},
	binoscopeLockEyepieceDivergence: function () {
		return this.chBoxBinoscopeLockEyepieceDivergence().is(':checked');
	},
	chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle: function () {
		return $('[id=chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle]');
	},
	binoscopeLockEyepieceDivergenceIncludeTertiarySecondaryRightAngle: function () {
		return this.chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle().is(':checked');
	},
	binoscopeFocalPlaneToSecondaryDistance: function () {
		return $('[id=binoscopeFocalPlaneToSecondaryDistance]');
	},
	binoscopeFocalPlaneToSecondaryDistanceVal: function () {
		return +this.binoscopeFocalPlaneToSecondaryDistance().val();
	},
	binoscopeFocalPlaneToSecondaryDistanceLabel: function () {
		return $('[id=binoscopeFocalPlaneToSecondaryDistanceLabel]');
	},
	btnSetBinoscopeFocalPlaneToSecondaryToMinimumDistance: function () {
		return $('[id=btnSetBinoscopeFocalPlaneToSecondaryToMinimumDistance]');
	},
	binoscopeFocalPlaneToTertiaryDistance: function () {
		return $('[id=binoscopeFocalPlaneToTertiaryDistance]');
	},
	binoscopeFocalPlaneToTertiaryDistanceVal: function () {
		return +this.binoscopeFocalPlaneToTertiaryDistance().val();
	},
	binoscopeFocalPlaneToTertiaryDistanceLabel: function () {
		return $('[id=binoscopeFocalPlaneToTertiaryDistanceLabel]');
	},
	binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary: function () {
		return $('[id=binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary]');
	},
	binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal: function () {
		return +this.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary().val();
	},
	binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryLabel: function () {
		return $('[id=binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryLabel]');
	},
	binoscopeSecondaryBendingAngleDeg: function () {
		return $('[id=binoscopeSecondaryBendingAngleDeg]');
	},
	binoscopeSecondaryBendingAngleDegVal: function () {
		return +this.binoscopeSecondaryBendingAngleDeg().val();
	},
	sliderBinoscopeSecondaryBendingAngleDeg: function () {
		return $('[id=sliderBinoscopeSecondaryBendingAngleDeg]');
	},
	sliderBinoscopeSecondaryBendingAngleDegVal: function () {
		return +this.sliderBinoscopeSecondaryBendingAngleDeg().val();
	},
	binoscopeTertiaryBendingAngleDeg: function () {
		return $('[id=binoscopeTertiaryBendingAngleDeg]');
	},
	binoscopeTertiaryBendingAngleDegVal: function () {
		return +this.binoscopeTertiaryBendingAngleDeg().val();
	},
	binoscopeEyepieceDivergenceDeg: function () {
		return $('[id=binoscopeEyepieceDivergenceDeg]');
	},
	binoscopeEyepieceDivergenceDegVal: function () {
		return +this.binoscopeEyepieceDivergenceDeg().val();
	},
	sliderBinoscopeEyepieceDivergenceDeg: function () {
		return $('[id=sliderBinoscopeEyepieceDivergenceDeg]');
	},
	sliderBinoscopeEyepieceDivergenceDegVal: function () {
		return +this.sliderBinoscopeEyepieceDivergenceDeg().val();
	},
	btnUpdateBinoscope: function () {
		return $('[id=btnUpdateBinoscope]');
	},
	binoscopeCanvasID: function () {
		return $('#binoscopeCanvas')[0];
	},
	binoscopeCanvasDiv: function () {
		return $('#binoscopeCanvasDiv');
	},
	binoscopeResults: function () {
		return $('[id=binoscopeResults]');
	},
	IPD: function () {
		return $('[id=IPD]');
	},
	IPDVal: function () {
		return +this.IPD().val();
	},
	binoscopeSecondaryAxisDownwardTiltAngleDeg: function () {
		return $('[id=binoscopeSecondaryAxisDownwardTiltAngleDeg]');
	},
	binoscopeSecondaryAxisDownwardTiltAngleDegVal: function () {
		return +this.binoscopeSecondaryAxisDownwardTiltAngleDeg().val();
	},
	sliderBinoscopeSecondaryAxisDownwardTiltAngleDeg: function () {
		return $('[id=sliderBinoscopeSecondaryAxisDownwardTiltAngleDeg]');
	},
	sliderBinoscopeSecondaryAxisDownwardTiltAngleDegVal: function () {
		return +this.sliderBinoscopeSecondaryAxisDownwardTiltAngleDeg().val();
	},
	binoscopeFrontViewCanvasID: function () {
		return $('#binoscopeFrontViewCanvas')[0];
	},
	binoscopeFrontViewCanvasDiv: function () {
		return $('#binoscopeFrontViewCanvasDiv');
	},
	binoscopeFrontViewResults: function () {
		return $('[id=binoscopeFrontViewResults]');
	},

	// CG assembly designer...

	CGTableBody: function () {
		return $('#CGTableBody');
	},
	btnCalcCG: function () {
		return $('[id=btnCalcCG]');
	},
	CGResults: function () {
		return $('[id=CGResults]');
	},

	// tube designer...

	tubeTypeSelect: function () {
		return $('#tubeTypeSelect');
	},
	tubeTypeSelectVal: function () {
		return this.tubeTypeSelect().val();
	},
	tubeTypeTableBody: function () {
		return $('#tubeTypeTableBody');
	},

	// Mount type designer...

	mountTypeSelect: function () {
		return $('#mountTypeSelect');
	},
	mountTypeSelectVal: function () {
		return this.mountTypeSelect().val();
	},
	mountTypeTableBody: function () {
		return $('#mountTypeTableBody');
	},

	// Rocker designer...

	CGToEyepieceDistance: function () {
		return $('[id=CGToEyepieceDistance]');
	},
	CGToEyepieceDistanceVal: function () {
		return +this.CGToEyepieceDistance().val();
	},
	CGToEyepieceDistanceLabel: function () {
		return $('[id=CGToEyepieceDistanceLabel]');
	},
	tubeWeight: function () {
		return $('[id=tubeWeight]');
	},
	tubeWeightVal: function () {
		return +this.tubeWeight().val();
	},
	tubeWeightLabel: function () {
		return $('[id=tubeWeightLabel]');
	},
	altBearingSeparationDeg: function () {
		return $('[id=altBearingSeparationDeg]');
	},
	altBearingSeparationDegVal: function () {
		return +this.altBearingSeparationDeg().val();
	},
	altBearingRadius: function () {
		return $('[id=altBearingRadius]');
	},
	altBearingRadiusVal: function () {
		return +this.altBearingRadius().val();
	},
	altBearingRadiusInchesVal: function () {
		return this.convertUomToInches(this.altBearingRadiusVal());
	},
	azBearingRadius: function () {
		return $('[id=azBearingRadius]');
	},
	azBearingRadiusVal: function () {
		return +this.azBearingRadius().val();
	},
	azBearingRadiusInchesVal: function () {
		return this.convertUomToInches(this.azBearingRadiusVal());
	},
	altBearingRadiusLabel: function () {
		return $('[id=altBearingRadiusLabel]');
	},
	azBearingRadiusLabel: function () {
		return $('[id=azBearingRadiusLabel]');
	},
	altBearingMaterialsSelect: function () {
		return $('#altBearingMaterialsSelect');
	},
	azBearingMaterialsSelect: function () {
		return $('#azBearingMaterialsSelect');
	},
	rockerWeightLabel: function () {
		return $('[id=rockerWeightLabel]');
	},
	rockerWeight: function () {
		return $('[id=rockerWeight]');
	},
	rockerWeightVal: function () {
		return +this.rockerWeight().val();
	},
	chBoxAutoCalcRockerWeight: function () {
		return $('[id=chBoxAutoCalcRockerWeight]');
	},
	chBoxAutoCalcRockerWeightChecked: function () {
		return this.chBoxAutoCalcRockerWeight().is(':checked');
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
		return $('[id=flexRockerCGToEyepieceDistance]');
	},
	flexRockerCGToEyepieceDistanceVal: function () {
		return +this.flexRockerCGToEyepieceDistance().val();
	},
	flexRockerCGToEyepieceDistanceLabel: function () {
		return $('[id=flexRockerCGToEyepieceDistanceLabel]');
	},
	flexRockerTubeWeight: function () {
		return $('[id=flexRockerTubeWeight]');
	},
	flexRockerTubeWeightVal: function () {
		return +this.flexRockerTubeWeight().val();
	},
	flexRockerTubeWeightLabel: function () {
		return $('[id=flexRockerTubeWeightLabel]');
	},
	flexRockerCGToBackEdgeOfTubeClearance: function () {
		return $('[id=flexRockerCGToBackEdgeOfTubeClearance]');
	},
	flexRockerCGToBackEdgeOfTubeClearanceVal: function () {
		return +this.flexRockerCGToBackEdgeOfTubeClearance().val();
	},
	flexRockerCGToBackEdgeOfTubeClearanceLabel: function () {
		return $('[id=flexRockerCGToBackEdgeOfTubeClearanceLabel]');
	},
	flexRockerAltBearingSeparationDeg: function () {
		return $('[id=flexRockerAltBearingSeparationDeg]');
	},
	flexRockerAltBearingSeparationDegVal: function () {
		return +this.flexRockerAltBearingSeparationDeg().val();
	},
	flexRockerWeightLabel: function () {
		return $('[id=flexRockerWeightLabel]');
	},
	flexRockerWeight: function () {
		return $('[id=flexRockerWeight]');
	},
	flexRockerWeightVal: function () {
		return +this.flexRockerWeight().val();
	},
	chBoxAutoCalcFlexRockerWeight: function () {
		return $('[id=chBoxAutoCalcFlexRockerWeight]');
	},
	chBoxAutoCalcFlexRockerWeightChecked: function () {
		return this.chBoxAutoCalcFlexRockerWeight().is(':checked');
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
		return $('[id=ETLatitudeDeg]');
	},
	ETTrackingTimeMin: function () {
		return $('[id=ETTrackingTimeMin]');
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
	btnSelect30inchDesign: function () {
		return $('input[id=btnSelect30inchDesign]');
	},
	btnSelect13inchDesign: function () {
		return $('input[id=btnSelect13inchDesign]');
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
	getAreaLit: function () {
		return this.imperial()
			? this.config.sqrInchesLit
			: this.config.sqrMmLit;
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
	getWeightPerSquareAreaLit: function () {
		return this.imperial()
			? this.config.psiLit
			: this.config.kscLit;
	},
	getLengthConversionFactorIgnoreAtStartup: function (startup) {
		return startup !== undefined
			? 1
			: this.imperial()
				? 1 / 25.4
				: 25.4;
	},
	getWeightConversionFactorIgnoreAtStartup: function (startup) {
		return startup !== undefined
			? 1
			: this.imperial()
				? 2.205
				: 1 / 2.205;
	},

	partElements: function () {
		return $('[id^=' + this.config.CGIDs.part + ']');
	},
	weightElements: function () {
		return $('[id^=' + this.config.CGIDs.weight + ']');
	},
	distanceElements: function () {
		return $('[id^=' + this.config.CGIDs.distance + ']');
	},
	verticalOffsetElements: function () {
		return $('[id^=' + this.config.CGIDs.verticalOffset + ']');
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
			: inchesSquared * 645.16; // 25.4 * 25.4
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

MLB.NewtDesigner.getComaCorrectorMagnificationFactor = () => {
	var common = MLB.NewtDesigner.common;

	if (common.useComaCorrectorMagnificationVal()) {
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

MLB.NewtDesigner.convertApertureToCm = () => {
	var common = MLB.NewtDesigner.common;

	return common.convertUomToMm(common.apertureVal()) / 10;
};

MLB.NewtDesigner.calcFRMaxEtendueFR = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		eyePupilmm = common.calcFRMaxEtendueEyePupilmmVal(),
		eyepieceFLmm = common.calcFRMaxEtendueEyepieceFLmmVal(),
		comaCorrectorMagFactor = common.calcFRMaxEtendueComaCorrectorMagVal(),
		calcFocalRatioForMaxEtendue = MLB.calcLib.calcFocalRatioForMaxEtendue,
		FR = calcFocalRatioForMaxEtendue(eyepieceFLmm, eyePupilmm, comaCorrectorMagFactor);

	common.calcFRMaxEtendueResultFR().val(roundToDecimal(FR, config.decimalPointsFocalRatio));
};

MLB.NewtDesigner.calcFRMaxEtendueEtendue = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		eyePupilmm = common.calcFRMaxEtendueEyePupilmmVal(),
		eyepieceFOV = common.calcFRMaxEtendueEyepieceFOVVal(),
		calcEtendue = MLB.calcLib.calcEtendue,
		etendue = calcEtendue(eyePupilmm / 10, eyepieceFOV);

	common.calcFRMaxEtendueResultEtendue().val(roundToDecimal(etendue, config.decimalPointsEtendue));
};

/*
1st entry from abbreviated Saguaro catalog:
{
"OBJECT": "NGC 7831",
"OTHER": "IC 1530",
"TYPE": "GALXY",
"CON": "AND",
"MAG": 12.8,
"SUBR": 12.3,
"SIZE_MAX": "1.5 m",
"SIZE_MIN": "0.3 m",
"CLASS": "Sb",
"NGC_DESCR": "eF;vS;mE;vF*v nr",
"NOTES": ""
},
*/
MLB.NewtDesigner.copySelectedObject = function (object) {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		decodeObjectSize = MLB.objectLib.decodeObjectSize,
		parsedObject = object.split('|'),
		objectMag = parsedObject[1].trim(),
		objectSizeArcMin1Str = decodeObjectSize(parsedObject[2].trim(), config.decimalPointsDimension),
		objectSizeArcMin2Str = decodeObjectSize(parsedObject[3].trim(), config.decimalPointsDimension);

	if (objectMag === '99.9') {
		alert('Catalog does not specify an object magnitude. Cannot select this object for visual detection analysis.');
		return;
	}
	if (objectSizeArcMin1Str.length === 0) {
		alert('Catalog does not specify an object size. Cannot select this object for visual detection analysis.');
		return;
	}

	// if object minimum size missing, then assume that the object is round and use the object maximum size
	if (objectSizeArcMin2Str.length === 0) {
		objectSizeArcMin2Str = objectSizeArcMin1Str;
	}

	common.objectName().val(parsedObject[0].trim());
	common.objectApparentMagnitude().val(objectMag);
	common.objectSizeArcMin1().val(objectSizeArcMin1Str);
	common.objectSizeArcMin2().val(objectSizeArcMin2Str);
};

MLB.NewtDesigner.searchObjectCatalog = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		createObjectFieldsString = MLB.objectLib.createObjectFieldsString,
		createObjectDescriptionString = MLB.objectLib.createObjectDescriptionString,
		filterObjectCatalog = MLB.objectLib.filterObjectCatalog,
		Saguaro81Abbr = MLB.Saguaro81AbbrJson.Saguaro81Abbr,
		searchStr = common.searchObjectStringVal(),
		searchResults = filterObjectCatalog(Saguaro81Abbr, searchStr),
		objectFieldsString,
		objectDescriptionString,
		optionStr;

	/*
	Here I want the user to select an object before populating object fields; just like the eyepiece selector but unlike the coma corrector selector where the fields are pre-populated with a default selection;
	I put an instruction to the user in the zero-th row and let the selected index default to 0; that way the instruction / zero-th row appears in the dropdown;
	The change() event will not fire if the user selects the zero-th row; alternatively should the selected index be set to -1, eg, common.matchedObjectsSelect().val(-1), then nothing will appear in the dropdown;
	*/

	// remove any previous options
	$('#' + config.matchedObjectsSelectLit + ' option').remove();

	// no object found
	if (searchResults.length === 0) {
		common.matchedObjectsSelect().append('<option>' + config.noObjectMatchedLit + '</option>');
		return;
	}

	// make first row the select msg
	common.matchedObjectsSelect().append('<option>' + config.selectObjectLit + '</option>');
	// build options based on objects matched
	$.each(searchResults, function (i, v) {
		objectFieldsString = createObjectFieldsString(v);
		objectDescriptionString = createObjectDescriptionString(v);
		optionStr = '<option value="' + objectFieldsString + '">' + objectDescriptionString + '</option>';
		common.matchedObjectsSelect().append(optionStr);
	});
};

MLB.NewtDesigner.calcVisualDetection = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uom = MLB.sharedLib.uom,
		calcContrastOfObjectPlusSkyToSky = MLB.calcLib.calcContrastOfObjectPlusSkyToSky,
		calcDetectionFromContrastAndObjectApparentSize = MLB.calcLib.calcDetectionFromContrastAndObjectApparentSize,
		calcMagnificationFromApertureAndPupil = MLB.calcLib.calcMagnificationFromApertureAndPupil,
		translateDetectionLevelIntoWords = MLB.calcLib.translateDetectionLevelIntoWords,
		plotRangeOfVisualDetections = MLB.NewtDesigner.plotRangeOfVisualDetections,
		plotApparentSizeVsMagnification = MLB.NewtDesigner.plotApparentSizeVsMagnification,
		plotSQMsForObjectContrasts = MLB.NewtDesigner.plotSQMsForObjectContrasts,
		aperture = common.apertureVal(),
		objMag = common.objectApparentMagnitudeVal(),
		objectSize1Arcmin = common.objectSizeArcMin1Val(),
		objectSize2Arcmin = common.objectSizeArcMin2Val(),
		largestObjectSizeArcmin = objectSize1Arcmin > objectSize2Arcmin
				? objectSize1Arcmin
				: objectSize2Arcmin,
		bkgndBrightEye = common.skyBackgroundBrightnessUnaidedEyeVal(),
		contrastResults = calcContrastOfObjectPlusSkyToSky(objMag, objectSize1Arcmin, objectSize2Arcmin, bkgndBrightEye),
		objectMPAM = contrastResults.objectSurfaceBrightness - uom.sqrArcminToSqrArcsecCircularMagnitudeChange,
		detectableLit,
		magnification = calcMagnificationFromApertureAndPupil(common.convertUomToMm(aperture), config.maxPupil),
		detectionLevel = translateDetectionLevelIntoWords(calcDetectionFromContrastAndObjectApparentSize(contrastResults.contrastPercent, largestObjectSizeArcmin / 60 * magnification));

	if (contrastResults.contrastPercent < 3) {
		detectableLit = config.impossibleToDetectLit;
	} else if (contrastResults.contrastPercent < 6) {
		detectableLit = config.hardToDetectLit;
	} else {
		detectableLit = config.easyToDetectLit;
	}
	common.visualDetectionResultsTable().html('<b>Results:</b><br>Calculated object surface brightness = '
			+ roundToDecimal(contrastResults.objectSurfaceBrightness, config.decimalPointsMagnitude)
			+ ' MPAS ('
			+ roundToDecimal(objectMPAM, config.decimalPointsMagnitude)
			+ ' MPAM)<br>Object + sky background brightness  = '
			+ roundToDecimal(contrastResults.objectPlusSkyBackgroundSurfaceBrightness, config.decimalPointsMagnitude)
			+ ' MPAS<br>Contrast of object + sky to sky = '
			+ roundToDecimal(contrastResults.contrastPercent, config.decimalPointsMagnitude)
			+ '%<br><br>'
			//+ 'Based solely on contrast, '
			//+ detectableLit
			//+ '<br>'
			+ 'Based on contrast and object apparent size, object is likely '
			+ detectionLevel
			+ ' to detect.');

	// and now jump to plotting the results against a range of apertures and Bortle levels plus more charts
	plotRangeOfVisualDetections();
	plotApparentSizeVsMagnification();
	plotSQMsForObjectContrasts();
};

// a series of apertures (3x, x, x/3): for each aperture, plot Bortle levels vs detectionLevel
MLB.NewtDesigner.plotRangeOfVisualDetections = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcContrastOfObjectPlusSkyToSky = MLB.calcLib.calcContrastOfObjectPlusSkyToSky,
		calcDetectionFromContrastAndObjectApparentSize = MLB.calcLib.calcDetectionFromContrastAndObjectApparentSize,
		calcMagnificationFromApertureAndPupil = MLB.calcLib.calcMagnificationFromApertureAndPupil,
		seriesLabelDiamondMarker = MLB.sharedLib.seriesLabelDiamondMarker,
		BortleScale = MLB.BortleScaleJson.BortleScale,
		aperture = common.apertureVal(),
		apertureSeries,
		apertureVariation = common.visualDetectionApertureVarianceVal(),
		chartApertureValues,
		chartApertureValuesLength,
		apIx,
		Bortles,
		BortleLevel,
		backgroundBrightness,
		contrastResults,
		detectionLevel,
		magnification,
		seriesLabels = [],
		objMag = common.objectApparentMagnitudeVal(),
		objectSize1Arcmin = common.objectSizeArcMin1Val(),
		objectSize2Arcmin = common.objectSizeArcMin2Val(),
		largestObjectSizeArcmin = objectSize1Arcmin > objectSize2Arcmin
				? objectSize1Arcmin
				: objectSize2Arcmin,
		uomLengthLit = common.getUomLengthLit();

	// calculate detection thresholds
	apertureSeries = [[aperture * apertureVariation], [aperture], [aperture / apertureVariation]];
	apertureSeries.forEach((ap, ix, thisArray) => thisArray[ix][0] = roundToDecimal(ap[0], config.decimalPointsAperture));

	// generate plot data
	chartApertureValues = [];
	for (apIx = 0; apIx < 3; apIx += 1) {
		magnification = calcMagnificationFromApertureAndPupil(common.convertUomToMm(apertureSeries[apIx]), config.maxPupil);
		Bortles = [];
		for (BortleLevel = 1; BortleLevel <= 9; BortleLevel += 1) {
			backgroundBrightness = BortleScale[BortleLevel - 1].MPAS;
			contrastResults = calcContrastOfObjectPlusSkyToSky(objMag, objectSize1Arcmin, objectSize2Arcmin, backgroundBrightness);
			detectionLevel = calcDetectionFromContrastAndObjectApparentSize(contrastResults.contrastPercent, largestObjectSizeArcmin / 60 * magnification);
			Bortles.push([BortleLevel, detectionLevel]);
		}
		chartApertureValues.push(Bortles);
	}

	// build the series labels: each series label represents an aperture
	chartApertureValuesLength = chartApertureValues.length;
	for (apIx = 0; apIx < chartApertureValuesLength; apIx += 1) {
		seriesLabels.push(seriesLabelDiamondMarker(apertureSeries[apIx] + uomLengthLit));
	}

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot(common.visualDetectionCalcChartID(), chartApertureValues, {
		title: 'Visual detection chart for a range of apertures and Bortle levels',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				label: 'Bortle level (1=darkest skies to 8=brightest city skies)',
				numberTicks: 9,
				min: 1,
				max: 9
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				renderer: $.jqplot.CategoryAxisRenderer,
				label: 'detection level',
				ticks: MLB.calcLib.detectionLevels,
				numberTicks: 6,
				min: 1,
				max: 6
			}
		},
		series: seriesLabels,
		seriesDefaults: {
			pointLabels: {show: false},
			showMarker: false
		}
	}).replot();
};

MLB.NewtDesigner.plotApparentSizeVsMagnification = () => {
	var common = MLB.NewtDesigner.common,
		calcMinMagnification = MLB.calcLib.calcMinMagnification,
		calcMaxMagnification = MLB.calcLib.calcMaxMagnification,
		apertureInches = common.apertureInchesVal(),
		objectSize1Arcmin = common.objectSizeArcMin1Val(),
		objectSize2Arcmin = common.objectSizeArcMin2Val(),
		largestObjectSizeArcmin = objectSize1Arcmin > objectSize2Arcmin
				? objectSize1Arcmin
				: objectSize2Arcmin,
		minMagnification,
		maxMagnification,
		minObjectSizeDeg,
		maxObjectSizeDeg,
		steps = 5,
		magnificationStep,
		objectSizeStep,
		ix,
		data = [];

	minMagnification = calcMinMagnification(apertureInches);
	maxMagnification = calcMaxMagnification(apertureInches);
	minObjectSizeDeg = largestObjectSizeArcmin / 60 * minMagnification;
	maxObjectSizeDeg = largestObjectSizeArcmin / 60 * maxMagnification;
	magnificationStep = (maxMagnification - minMagnification) / steps;
	objectSizeStep = (maxObjectSizeDeg - minObjectSizeDeg) / steps;

	for (ix = 0; ix <= steps; ix += 1) {
		data.push([minObjectSizeDeg + objectSizeStep * ix, minMagnification + magnificationStep * ix]);
	}

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot(common.visualDetectionObjectApparentSizeVsMagnificationChartID(), [data], {
		title: 'Object apparent size vs magnification',
		axes: {
			xaxis: {
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				label: 'object size',
				tickOptions: {formatString: '%3.0fdeg'},
				numberTicks: steps,
				min: minObjectSizeDeg,
				max: maxObjectSizeDeg
			},
			yaxis: {
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				label: 'magnification',
				tickOptions: {formatString: '%3.0fx'},
				numberTicks: steps,
				min: minMagnification,
				max: maxMagnification
			}
		},
		seriesDefaults: {
			pointLabels: {show: false},
			showMarker: false
		}
	}).replot();
};

MLB.NewtDesigner.plotSQMsForObjectContrasts = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		objMag = common.objectApparentMagnitudeVal(),
		objectSize1Arcmin = common.objectSizeArcMin1Val(),
		objectSize2Arcmin = common.objectSizeArcMin2Val(),
		calcSurfaceBrightnessFromArea = MLB.calcLib.calcSurfaceBrightnessFromArea,
		objectSurfaceBrightness = calcSurfaceBrightnessFromArea(objMag, objectSize1Arcmin, objectSize2Arcmin),
		contrastPercents = config.contrastPercents,
		steps = contrastPercents.length,
		data = [];

	contrastPercents.forEach(contrastPercent => {
		var calcSkyFromObjectPlusContrast = MLB.calcLib.calcSkyFromObjectPlusContrast,
			bkgndBrightEye = calcSkyFromObjectPlusContrast(objectSurfaceBrightness, contrastPercent).bkgndBrightEye;
		data.push(bkgndBrightEye);
	});

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot(common.visualDetectionSQMsForObjectContrastsChartID(), [data], {
		title: 'SQM required to detect object at various contrasts',
		axes: {
			xaxis: {
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				label: 'contrast percent',
				tickOptions: {formatString: '%1.0f' + '%'},
				numberTicks: steps,
				min: contrastPercents[0],
				max: contrastPercents[steps - 1]
			},
			yaxis: {
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				label: 'SQM',
				tickOptions: {formatString: '%2.1f'},
			}
		},
		seriesDefaults: {
			pointLabels: {show: false},
			showMarker: false
		}
	}).replot();
};

MLB.NewtDesigner.calcTotalMagnitude = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		adddMagnitudes = MLB.calcLib.addMagnitudes,
		combinedMagnitude;

	combinedMagnitude = common.magnitudesToAdd()
			.val()
			.split(/[ ,]+/)
			.filter(Number)
			.reduce((a, b) => adddMagnitudes(a, b));

	common.totalMagnitude().val(roundToDecimal(combinedMagnitude, config.decimalPointsLimitingMagnitude));
};

MLB.NewtDesigner.calcLowriderSecondaryOffset = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uom = MLB.sharedLib.uom,
		calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian,
		calcDiagOffsetUsingEyeToDiagDistance = MLB.calcLib.calcDiagOffsetUsingEyeToDiagDistance,
		model = calcFoldedNewtonian(common.apertureVal(), common.focalRatioVal(), common.lowriderSecondaryMirrorSizeVal(), 0, common.focalPointPerpendicularOffsetFromEdgeOfPrimaryVal(), common.focalPlaneToSecondaryDistanceVal()),
		offsetMultiplier = Math.sin(model.elbowAngleDeg / 2 * uom.degToRad) / Math.sin(45 * uom.degToRad),
		offset = -calcDiagOffsetUsingEyeToDiagDistance(common.lowriderSecondaryMirrorSizeVal(), common.focalPlaneToSecondaryDistanceVal());

	common.lowriderSecondaryOffset().val(roundToDecimal(offset * offsetMultiplier, config.decimalPointsDiag));
};

MLB.NewtDesigner.writeOffaxisMaskResults = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
		limitingMagnitude = MLB.calcLib.limitingMagnitude,
		diag = state.diag,
		uomLengthLit = common.getUomLengthLit(),
		offaxisMaskDia = (common.apertureVal() - diag.smallestUserDefinedSize) / 2 + diag.offset.fullIllum,
		offaxisMaskDiaInches = common.convertUomToInches(offaxisMaskDia),
		// don't convert to uom because the '25' would have to be converted too
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

MLB.NewtDesigner.updateFocalPlaneToDiagDistanceFromFocuserDesigner = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		telescopeTubeOD = common.telescopeTubeODVal(),
		focuserRackedInHeight = common.focuserRackedInHeightVal(),
		focuserInwardFocusingDistance = common.focuserInwardFocusingDistanceVal(),
		focalPlaneToDiagDistance = telescopeTubeOD / 2 + focuserRackedInHeight + focuserInwardFocusingDistance;

	common.focalPlaneToDiagDistance().val(roundToDecimal(focalPlaneToDiagDistance, config.decimalPointsDiag));
};

// various sizes of diagSize are passed in: do not use state.diag.smallestUserDefinedSize
MLB.NewtDesigner.calcVignettedIllumPercent = function (diagSize, illumArray) {
	var common = MLB.NewtDesigner.common,
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		aperture = common.apertureVal(),
		lossDueToDiagonalSize = diagObstructionArea(aperture, diagSize),
		radiusIllumArray,
		rings,
		ix,
		e1,
		e2,
		avgIllum,
		area,
		ringArea,
		lastArea = 0,
		weightedIllum = 0;

	/* array[off-axis points], each element consisting of:
		   array[2]: 1st element is the off-axis radius and 2nd element the illumination value
	   array goes from one edge of field to center of field to opposite edge of field */

	// eg, [0] = 0, 1; [1] = 0.1, 1; ... [4] = 0.4, 0.918; ... [7] = 0.7, 0.788
	radiusIllumArray = illumArray.slice(illumArray.length / 2);
	rings = radiusIllumArray.length - 1;

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

MLB.NewtDesigner.calcDiag = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		minIllum,
		focalPlaneToDiagDistance,
		focalLength,
		aperture,
		diagToFocalPlaneDistance,
		maxFieldDia,
		acceptableMagLoss,
		minSize,
		diagonalsLength,
		offAxisIllum,
		diagSize,
		suitableDiagsLength,
		diagIx,
		maxIllumDiag,
		maxIllum,
		diag = state.diag,
		diagonals,
		suitableDiags = [],
		integratedVignettedIllum,
		integratedVignettedIllums = [],
		calcVignettedIllumPercent = MLB.NewtDesigner.calcVignettedIllumPercent,
		diagOffsetFocalPoint,
		diagOffsetFullIllum,
		diagOffsetEyeToDiag,
		diagOffsetFieldEdge,
		eyeAboveFocalPlane,
		diagToEyeDistance,
		calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
		getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
		calcDiagOffsetUsingFocalPoint = MLB.calcLib.calcDiagOffsetUsingFocalPoint,
		calcDiagOffsetUsingFullIllumField = MLB.calcLib.calcDiagOffsetUsingFullIllumField,
		calcDiagOffsetUsingEyeToDiagDistance = MLB.calcLib.calcDiagOffsetUsingEyeToDiagDistance,
		calcDiagOffsetUsingFieldEdge = MLB.calcLib.calcDiagOffsetUsingFieldEdge,
		focuserBarrelTubeID = common.barrelTubeInsideDiameterVal(),
		focuserBarrelTubeLength = common.barrelTubeLengthVal(),
		includeFocuserBarrelVignetting = common.includeFocuserBarrelVignetting(),
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		offAxisIncrement,
		formatString,
	    illumArray,
	    illumArrays = [],
	    lossDueToDiagonals = [],
	    getDiagFocuserIllumArray = MLB.NewtDesigner.getDiagFocuserIllumArray;

	aperture = common.apertureVal();
	focalLength = common.telescopeFocalLengthVal();
	diagToFocalPlaneDistance = common.focalPlaneToDiagDistanceVal();
	maxFieldDia = common.maxFieldDiaDiagVal();
	focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
	acceptableMagLoss = common.acceptableMagLossVal();
	eyeAboveFocalPlane = common.convertInchesToUom(config.eyeAboveFocalPlaneInches);
	diagToEyeDistance = diagToFocalPlaneDistance + eyeAboveFocalPlane;

	minSize = focalPlaneToDiagDistance / (focalLength / aperture);
	minIllum = getIllumFromMagnitude(acceptableMagLoss);

	// remove comma, turn string to number, sort
	diagonals = common.diagSizesVal().split(',').map(Number).sort(function (a, b) {return a - b;});
	diagonalsLength = diagonals.length;

	//create suitable diagonals array based on criteria
	for (diagIx = 0; diagIx < diagonalsLength; diagIx += 1) {
		diagSize = diagonals[diagIx];
		offAxisIllum = calcOffAxisIllumination(aperture, focalLength, diagSize, focalPlaneToDiagDistance, maxFieldDia / 2);
		// ok to add diag sizes that don't meet criteria for edge illumination
		//if (diagSize >= minSize && offAxisIllum >= minIllum) {
		if (diagSize >= minSize) {
			suitableDiags.push(diagSize);
		}
		// once we find a diag size that fully illuminates the field, no need to look at larger diag sizes
		if (offAxisIllum === 1) {
			break;
		}
	}
	suitableDiagsLength = suitableDiags.length;

	// imperial or metric off axis resolution and formatting
	if (common.imperial()) {
		offAxisIncrement = 0.1;
		formatString = '%3.1f';
	} else {
		offAxisIncrement = 2;
		formatString = '%1d';
	}

	// build illum arrays for all suitable diagonals
	for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
		illumArray = getDiagFocuserIllumArray(aperture, focalLength, suitableDiags[diagIx], focalPlaneToDiagDistance, offAxisIncrement, maxFieldDia, focuserBarrelTubeID, focuserBarrelTubeLength, includeFocuserBarrelVignetting);
		illumArrays.push(illumArray);
		lossDueToDiagonals.push(diagObstructionArea(aperture, suitableDiags[diagIx]));
	}

	// calc integrated vignetted illumination; is array of arrays: [diagonal minor axis, integrated illum percent], []...
	maxIllum = 0;
	for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
		integratedVignettedIllum = calcVignettedIllumPercent(suitableDiags[diagIx], illumArrays[diagIx]);
		if (integratedVignettedIllum > maxIllum) {
			maxIllum = integratedVignettedIllum;
			maxIllumDiag = suitableDiags[diagIx];
		}
		integratedVignettedIllums.push([suitableDiags[diagIx], integratedVignettedIllum]);
	}

	// go with the smallest acceptable (does not vignette primary mirror at field center) user defined size
	diagSize = suitableDiags[0];
	diagOffsetFocalPoint = calcDiagOffsetUsingFocalPoint(aperture, focalLength, diagSize, diagToFocalPlaneDistance);
	diagOffsetFullIllum = -calcDiagOffsetUsingFullIllumField(aperture, focalLength, diagSize, diagToFocalPlaneDistance);
	diagOffsetEyeToDiag = -calcDiagOffsetUsingEyeToDiagDistance(diagSize, diagToEyeDistance);
	diagOffsetFieldEdge = calcDiagOffsetUsingFieldEdge(diagSize, diagToFocalPlaneDistance, maxFieldDia);

	// save to state.diag
	diag.offAxisIncrement = offAxisIncrement;
	diag.formatString = formatString;
	diag.illumArrays = illumArrays;
	diag.lossDueToDiagonals = lossDueToDiagonals;
	diag.suitableDiags = suitableDiags;
	diag.minSize = minSize;
	diag.smallestUserDefinedSize = diagSize;
	diag.maxIllumSize = maxIllumDiag;
	diag.evenIllumSize = suitableDiags[suitableDiagsLength - 1];
	diag.integratedVignettedIllums = integratedVignettedIllums;
	diag.offset = {};
	diag.offset.focalPoint = diagOffsetFocalPoint;
	diag.offset.fullIllum = diagOffsetFullIllum;
	diag.offset.eyeToDiag = diagOffsetEyeToDiag;
	diag.offset.fieldEdge = diagOffsetFieldEdge;
};

// getDiagIllumArray returns an array of +-off axis distances with illuminations
// getDiagIllumArray(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, increment, maxField) translates to
// getDiagIllumArray(diag size, diagToFocalPlaneDistance, barrel ID, barrel length, increment, maxField)
MLB.NewtDesigner.getDiagFocuserIllumArray = (aperture, focalLength, diags, focalPlaneToDiagDistance, offAxisIncrement, maxFieldDia, focuserBarrelTubeID, focuserBarrelTubeLength, includeFocuserBarrelVignetting) => {
	var getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
		diagIllumArray,
		focuserBarrelIllumArray,
		illumArray,
		illumArrayLength,
		ix;

	// getDiagIllumArray returns an array of +-off axis distances with illuminations - see comment on series below
	diagIllumArray = getDiagIllumArray(aperture, focalLength, diags, focalPlaneToDiagDistance, offAxisIncrement, maxFieldDia);

	// getDiagIllumArray(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, increment, maxField) translates to
	// getDiagIllumArray(diag size, diagToFocalPlaneDistance, barrel ID, barrel length, increment, maxField)
	focuserBarrelIllumArray = getDiagIllumArray(diags, focalPlaneToDiagDistance, focuserBarrelTubeID, focuserBarrelTubeLength, offAxisIncrement, maxFieldDia);

	illumArray = [...diagIllumArray];

	if (includeFocuserBarrelVignetting) {
		illumArrayLength = illumArray.length;
		for (ix = 0; ix < illumArrayLength; ix += 1) {
			illumArray[ix][1] = diagIllumArray[ix][1] - (1 - focuserBarrelIllumArray[ix][1]);
		}
	}

	return illumArray;
};

MLB.NewtDesigner.graphDiagIllum = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		minIllum,
		uomLengthLit,
		offAxisIncrement,
		formatString,
		focalPlaneToDiagDistance,
		focalLength,
		aperture,
		maxFieldDia,
		acceptableMagLoss,
		calcs,
		lossDueToDiagonals,
		offAxisPts,
		diagIx,
		illumIx,
		series = [],
		tickLabel,
		drop,
		seriesLabels = [],
		diag = state.diag,
		suitableDiagsLength = diag.suitableDiags.length,
		seriesLabel = MLB.sharedLib.seriesLabel,
		getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
		getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude;

	aperture = common.apertureVal();
	focalLength = common.telescopeFocalLengthVal();
	maxFieldDia = common.maxFieldDiaDiagVal();
	focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
	acceptableMagLoss = common.acceptableMagLossVal();
	minIllum = getIllumFromMagnitude(acceptableMagLoss);
	uomLengthLit = common.getUomLengthLit();

	/* calcs[] is: array[diagonals], each element consisting of:
					array[off-axis distance points], each element consisting of:
					 array[2]: off-axis radius and its illumination value */
	calcs = diag.illumArrays;
	offAxisPts = calcs[0].length;
	offAxisIncrement = diag.offAxisIncrement;
	formatString = diag.formatString;
	lossDueToDiagonals = diag.lossDueToDiagonals;

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
	suitableDiagsLength = diag.suitableDiags.length;
	for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
		series.push([]);
	}

	// for each off-axis radius, push the illuminations of the various diagonals followed by the max allowed illum drop
	for (illumIx = 0; illumIx < offAxisPts; illumIx += 1) {
		tickLabel = Math.round(calcs[0][illumIx][0] / offAxisIncrement) * offAxisIncrement;
		suitableDiagsLength = diag.suitableDiags.length;
		for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
			drop = getMagnitudeFromIllum(calcs[diagIx][illumIx][1] - lossDueToDiagonals[diagIx]);
			series[diagIx].push([tickLabel, drop]);
	   }
	}

	// build the series labels: each series label represents a diagonal size, ending with the max allowed illum drop label
	suitableDiagsLength = diag.suitableDiags.length;
	for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
		seriesLabels.push(seriesLabel(diag.suitableDiags[diagIx] + uomLengthLit + ' m.a. diag'));
	}
	seriesLabels.push(seriesLabel('max allowed drop'));

	$.jqplot.config.enablePlugins = true;
	$.jqplot(common.diagChartID(), series, {
		title: config.diagOffaxisIllumTitle,
		legend: {
			show: true,
			location: 'ne',
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'off-axis radius' + uomLengthLit,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: offAxisPts,
				tickOptions: {formatString: formatString},
				min: series[0][0][0],
				max: series[0][offAxisPts - 1][0]
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'magnitude loss',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				max: 0,
				min: acceptableMagLoss
			}
		},
		series: seriesLabels,
		seriesDefaults: {
			pointLabels: {show: false}
		}

	}).replot();

	// save for future use
	state.diagSeries = series;
};

MLB.NewtDesigner.graphIntegratedIllum = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uomLengthLit = common.getUomLengthLit(),
		diag = state.diag,
		getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
		series = [],
		formatString;

	if (common.imperial()) {
		formatString = '%2.2f';
	} else {
		formatString = '%1d';
	}

	diag.integratedVignettedIllums.map(function (item) {
		series.push(roundToDecimal(1 - getMagnitudeFromIllum(item[1]), config.decimalPointsDiag));
	});

	$.jqplot(common.diagIntegratedIllumChartID(), [series], {
		title: config.diagIntegratedIllumTitle,
		axes: {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'diagonal minor axis size' + uomLengthLit,
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				ticks: diag.suitableDiags,
				tickOptions: {formatString: formatString}
			},
			yaxis: {
				label: 'Integrated magnitude',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				pad: 1.3,
				//tickOptions: {formatString: '%1.3f'},
				numberTicks: 11,
				min: 0,
				max: 1
			}
		},
		seriesDefaults: {
			renderer:$.jqplot.BarRenderer,
			rendererOptions: {
				fillToZero: true,
				varyBarColor: true
			},
			pointLabels: {
				show: true,
				location: 's'
			}
		}
	}).replot();
};

MLB.NewtDesigner.writeDiagResults = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		diag = state.diag,
		obstructions = [],
		int = MLB.sharedLib.int,
		calcRMSCausedByCentralObstruction = MLB.calcLib.calcRMSCausedByCentralObstruction,
		aperture = common.apertureVal(),
		eyeAboveFocalPlane = common.convertInchesToUom(config.eyeAboveFocalPlaneInches),
		uomLengthLit = common.getUomLengthLit(),
		calculateApertureFromMagnitude = MLB.calcLib.calculateApertureFromMagnitude,
		integratedVignettedIllumsStr = '',
		centralObstructionsStr = '',
		RMSCausedByCentralObstructionStr = '',
		equivalentApertureStr = '',
		midSeriesIx,
		focalRatio = common.focalRatioVal(),
		maxFieldDia = common.maxFieldDiaDiagVal(),
		focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
		focuserBarrelTubeID = common.barrelTubeInsideDiameterVal(),
		focuserBarrelTubeLength = common.barrelTubeLengthVal(),
		fieldAtBarrelBottom,
		focuserBarrelVignettes,
		focuserBarrelVignettesStr,
		fieldAtBarrelBottomArray = [],
		fieldAtBarrelBottomStr;

	diag.suitableDiags.forEach(diag => {
		var obstructionColor,
			obstructionRatio = diag / aperture;

		if (obstructionRatio <= config.diagonalObstructionRatioNoImpact) {
			obstructionColor = config.diagonalObstructionRatioNoImpactColor;
		} else if (obstructionRatio <= config.diagonalObstructionRatioSomeImpact) {
			obstructionColor = config.diagonalObstructionRatioSomeImpactColor;
		} else {
			obstructionColor = config.diagonalObstructionRatioMajorImpactColor;
		}

		obstructions.push({obstructionRatio: obstructionRatio, obstructionColor: obstructionColor});
	});

	diag.suitableDiags.map((diag, ix) => {
		var obstructionRatio = obstructions[ix].obstructionRatio,
		    obstructionColor = obstructions[ix].obstructionColor;

		centralObstructionsStr += '<span style="background-color: '
				+ obstructionColor
				+ ';"><b>'
				+ diag
				+ '</b>: ' + roundToDecimal(100 * obstructionRatio, config.decimalPointsPercent)
				+ '% linear, '
				+ roundToDecimal(100 * obstructionRatio * obstructionRatio, config.decimalPointsPercent)
				+ '% area</span>; &emsp;';

		RMSCausedByCentralObstructionStr += '<b>'
				+ diag
				+ '</b>: 1/'
				+ int(1 / calcRMSCausedByCentralObstruction(diag / aperture))
				+ '; &emsp;';
	});

	centralObstructionsStr += '<br>&emsp;'
				+ '(<span style="background-color: '
				+ config.diagonalObstructionRatioNoImpactColor
				+ '">'
				+ '0%-'
				+ config.diagonalObstructionRatioNoImpact * 100
				+ '%: '
				+ config.diagonalObstructionRatioNoImpactColor
				+ '</span>; &emsp;'
				+ '<span style="background-color: '
				+ config.diagonalObstructionRatioSomeImpactColor
				+ '">'
				+ config.diagonalObstructionRatioNoImpact * 100
				+ '%-'
				+ config.diagonalObstructionRatioSomeImpact * 100
				+ '%: '
				+ config.diagonalObstructionRatioSomeImpactColor
				+ '</span>; &emsp;'
				+ '<span style="background-color: '
				+ config.diagonalObstructionRatioMajorImpactColor
				+ '">>'
				+ config.diagonalObstructionRatioSomeImpact * 100
				+ '%: '
				+ config.diagonalObstructionRatioMajorImpactColor
				+ '</span>)';

	diag.integratedVignettedIllums.map((item) => {
		integratedVignettedIllumsStr += '<b>'
				+ item[0]
				+ '</b>: '
				+ roundToDecimal(item[1] * 100, config.decimalPointsPercent)
				+ '%; &emsp;';
	});

	midSeriesIx = Math.floor(state.diagSeries[0].length / 2);
	diag.suitableDiags.map((diag, ix) => {
		equivalentApertureStr += '<b>'
				+ diag
				+ '</b>: '
				+ roundToDecimal(calculateApertureFromMagnitude(state.diagSeries[ix][midSeriesIx][1]) * aperture, config.decimalPointsDiag)
				+ '-'
				+ roundToDecimal(calculateApertureFromMagnitude(state.diagSeries[ix][0][1]) * aperture, config.decimalPointsDiag)
				+ uomLengthLit
				+ '; &emsp;';
	});

	focuserBarrelVignettesStr = '<br>Focuser barrel vignettes? &emsp;';
	diag.suitableDiags.map(diag => {
		var slope = (diag - maxFieldDia) / focalPlaneToDiagDistance;

		if (slope > focalRatio) {
			slope = focalRatio;
		}
		fieldAtBarrelBottom = maxFieldDia + focuserBarrelTubeLength * slope;
		focuserBarrelVignettes = fieldAtBarrelBottom > focuserBarrelTubeID;
		focuserBarrelVignettesStr += '<b>'
				+ diag
				+ '</b>: '
				+ (focuserBarrelVignettes ? 'yes' : 'no')
				+ '; &emsp;';
		// to build the fieldAtBarrelBottomStr coming up
		fieldAtBarrelBottomArray.push(fieldAtBarrelBottom);
	});
	focuserBarrelVignettesStr += ' (assuming that the top of the focuser barrel is at the focal plane).';

	fieldAtBarrelBottomStr = '<br><br>Field width at focuser barrel bottom (see the Focuser Designer) &emsp;';
	diag.suitableDiags.map((diag, ix) => {
		fieldAtBarrelBottomStr += '<b>'
				+ diag
				+ '</b>: '
				+ roundToDecimal(fieldAtBarrelBottomArray[ix], config.decimalPointsDiag)
				+ uomLengthLit
				+ '; &emsp;';
	});

	common.diagResults().html('Smallest possible diagonal  = '
			+ roundToDecimal(diag.minSize, config.decimalPointsDiag)
			+ uomLengthLit
			+ '<br>Smallest user defined diagonal =  '
			+ diag.smallestUserDefinedSize
			+ uomLengthLit
			+ '<br>Diagonal size maximizing illumination integrated across the field =  '
			+ diag.maxIllumSize
			+ uomLengthLit
			+ '<br>Diagonal size for most even illumination across the field =  '
			+ diag.evenIllumSize
			+ uomLengthLit
			+ '<br>&emsp; illumination integrated across the field: '
			+ integratedVignettedIllumsStr
			+ '<br>Equivalent aperture ranges from field center to field edge for each diagonal size:<br>&emsp;'
			+ equivalentApertureStr
			+ '<br><br>Central obstructions are '
			+ centralObstructionsStr
			+ '<br>RMS wave deformations due to central obstruction are '
			+ RMSCausedByCentralObstructionStr
			+ '<br><br>'
			+ config.diagOffsetFocalPointLabelLit
			+ ' = '
			+ roundToDecimal(diag.offset.focalPoint, config.decimalPointsDiag)
			+ uomLengthLit
			+ '<br>'
			+ config.diagOffsetFieldEdgeLabelLit
			+ ' = '
			+ roundToDecimal(diag.offset.fieldEdge, config.decimalPointsDiag)
			+ uomLengthLit
			+ '<br>'
			+ config.diagOffsetFullIllumLabelLit
			+ ' = '
			+ roundToDecimal(diag.offset.fullIllum, config.decimalPointsDiag)
			+ uomLengthLit
			+ '<br>'
			+ config.diagOffsetEyeToDiagLabelLit
			+ roundToDecimal(eyeAboveFocalPlane, config.decimalPointsDiag)
			+ uomLengthLit
			+ config.diagOffsetEyeToDiagLabel2Lit
			+ roundToDecimal(diag.offset.eyeToDiag, config.decimalPointsDiag)
			+ uomLengthLit
			+ '<br>Multiply these values by 1.4 to get the offset along the diagonal face.'
			+ fieldAtBarrelBottomStr
			+ focuserBarrelVignettesStr
	);
};

MLB.NewtDesigner.propogateDiagToDesigners = () => {
	var state = MLB.NewtDesigner.state,
		diag = state.diag,
		updateBaffleDesignerFromDiagonalDesigner = MLB.NewtDesigner.updateBaffleDesignerFromDiagonalDesigner,
		updateLowriderBaffleDesignerFromStateDiagSize = MLB.NewtDesigner.updateLowriderBaffleDesignerFromStateDiagSize;

	if (diag.smallestUserDefinedSize === diag.lastSmallestUserDefinedSize) {
		return;
	}

	updateBaffleDesignerFromDiagonalDesigner();
	updateLowriderBaffleDesignerFromStateDiagSize();

	diag.lastSmallestUserDefinedSize = diag.smallestUserDefinedSize;
};

MLB.NewtDesigner.calcAndGraphDiag = () => {
	var calcDiag = MLB.NewtDesigner.calcDiag,
		propogateDiagToDesigners = MLB.NewtDesigner.propogateDiagToDesigners,
		graphDiagIllum = MLB.NewtDesigner.graphDiagIllum,
		graphIntegratedIllum = MLB.NewtDesigner.graphIntegratedIllum,
		writeDiagResults = MLB.NewtDesigner.writeDiagResults,
		writeOffaxisMaskResults = MLB.NewtDesigner.writeOffaxisMaskResults,
		calcP2Intrusion = MLB.NewtDesigner.calcP2Intrusion,
		drawOffsetShadow = MLB.NewtDesigner.drawOffsetShadow,
		drawOffsetInFocuser = MLB.NewtDesigner.drawOffsetInFocuser;

	calcDiag();
	propogateDiagToDesigners();
	graphDiagIllum();
	graphIntegratedIllum();
	writeDiagResults();
	writeOffaxisMaskResults();
	calcP2Intrusion();
	drawOffsetShadow();
	drawOffsetInFocuser();
};

MLB.NewtDesigner.updateBaffleDesignerFromDiagonalDesigner = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		diag = state.diag;

	common.sharedDiagSize().val(roundToDecimal(diag.smallestUserDefinedSize, config.decimalPointsDiag));
	common.diagOffset().val(roundToDecimal(diag.offset.fullIllum, config.decimalPointsDiag));
};

MLB.NewtDesigner.updateLowriderBaffleDesignerFromStateDiagSize = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcLowriderSecondaryOffset = MLB.NewtDesigner.calcLowriderSecondaryOffset,
		updateFocalPlaneToSecondaryDistanceToMax = MLB.NewtDesigner.updateFocalPlaneToSecondaryDistanceToMax;

	common.lowriderSecondaryMirrorSize().val(roundToDecimal(state.diag.smallestUserDefinedSize, config.decimalPointsDiag));
	updateFocalPlaneToSecondaryDistanceToMax();
	calcLowriderSecondaryOffset();
};

// see P2Intrusion.jpg, NewtDesignerTestWithDiagToFLDistance7.jpg
MLB.NewtDesigner.calcP2Intrusion = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uom = MLB.sharedLib.uom,
		aperture,
		focalPlaneToDiagDistance,
		P2LengthBelowFocalPlaneUom,
		P2WidthUOM,
		P2HalfWidthUOM,
		r, a, h, i, j, k, l, m, s, t, u, b, v, x, y;

	state.P2Intrusion = {};

	if (!common.includeP2Intrusion()) {
		state.P2Intrusion.include = false;
		return;
	}
	state.P2Intrusion.include = true;

	aperture = common.apertureVal();
	focalPlaneToDiagDistance = common.focalPlaneToDiagDistance().val();
	P2LengthBelowFocalPlaneUom = common.convertInchesToUom(config.P2LengthBelowFocalPlaneInches);
	r = aperture / 2;
	j = focalPlaneToDiagDistance - P2LengthBelowFocalPlaneUom;
	i = r - j;

	if (i <= 0) {
		state.P2Intrusion.intrudes = false;
		return;
	}
	state.P2Intrusion.intrudes = true;

	P2WidthUOM = common.convertInchesToUom(config.P2WidthInches);
	P2HalfWidthUOM = P2WidthUOM / 2;
	h = Math.sqrt(r * r - j * j);
	if (h < P2HalfWidthUOM) {
		state.P2Intrusion.intrudesFully = false;
	} else {
		state.P2Intrusion.intrudesFully = true;
		h = P2HalfWidthUOM;
	}

	m = Math.sqrt(r * r - h * h);
	k = r - m;
	l = i - k;    // l should = 0 when P2 only intrudes partially
	a = Math.atan(h / (j + l));

	// solve for x, the arc's minor segment area (upper half)
	b = r * r * Math.PI;
	s = b * a / uom.oneRev;
	t = h * m / 2;
	x = s - t;

	y = l * h;
	u = x + y;
	v = u / b;

	state.P2Intrusion.intrusion = i;
	state.P2Intrusion.intrusionWidth = h * 2;
	state.P2Intrusion.arcMinorSegmentLength = k;
	state.P2Intrusion.barrelIntrusionLength = l;
	state.P2Intrusion.apertureCenterToP2Bottom = j;
	state.P2Intrusion.intrusionAngleRad = a * 2;
	state.P2Intrusion.intrusionArea = u * 2;
	state.P2Intrusion.intrusionRatio = v * 2;
};

MLB.NewtDesigner.drawP2Intrusion = function (context, canvasCenter, scalingFactor, diagToApertureAreaRatio) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uom = MLB.sharedLib.uom,
		rect = MLB.sharedLib.rect,
		fillRect = MLB.sharedLib.fillRect,
		scaledIntrusion,
		scaledIntrusionWidth,
		scaledArcMinorSegmentLength,
		scaledBarrelIntrusionLength,
		scaledApertureCenterToP2Bottom,
		fillStyle,
		P2Intrusion = state.P2Intrusion,
		intrusionRatio = P2Intrusion.intrusionRatio,
		intrusionAngleRad = state.P2Intrusion.intrusionAngleRad,
		upperLeftX,
		upperLeftY,
		P2rect;

	if (!P2Intrusion.include) {
		common.P2IntrusionResultsLabel().html('');
		return;
	}

	scaledIntrusion = P2Intrusion.intrusion * scalingFactor;
	scaledIntrusionWidth = P2Intrusion.intrusionWidth * scalingFactor;
	scaledArcMinorSegmentLength = P2Intrusion.arcMinorSegmentLength * scalingFactor;
	scaledBarrelIntrusionLength = P2Intrusion.barrelIntrusionLength * scalingFactor;
	scaledApertureCenterToP2Bottom = P2Intrusion.apertureCenterToP2Bottom * scalingFactor;

	// draw P2 intrusion arc
	fillStyle = config.canvasStructureStyle;
	context.fillStyle = fillStyle;
	context.beginPath();
	context.arc(canvasCenter.x, canvasCenter.y, scaledApertureCenterToP2Bottom + scaledIntrusion, uom.halfRev + intrusionAngleRad / 2, uom.halfRev - intrusionAngleRad / 2, true);
	context.closePath();
	context.fill();

	// draw P2 barrel
	if (P2Intrusion.intrudesFully) {
		// here, scaledIntrusionWidth is the height
		upperLeftX = canvasCenter.x - scaledApertureCenterToP2Bottom - scaledBarrelIntrusionLength;
		upperLeftY = canvasCenter.y - scaledIntrusionWidth / 2;
		P2rect = rect(upperLeftX, upperLeftY, scaledBarrelIntrusionLength, scaledIntrusionWidth);
		fillRect(context, fillStyle, P2rect);
	}

	if (P2Intrusion.intrudes) {
		common.P2IntrusionResultsLabel().html('P2 intrusion length is '
				+ roundToDecimal(P2Intrusion.intrusion, config.decimalPointsDimension)
				+ common.getUomLengthLit()
				+ ', intrusion area is '
				+ roundToDecimal(P2Intrusion.intrusionArea, config.decimalPointsDimension)
				+ ' ('
				+ common.getAreaLit()
				+ '); percentage of aperture area is '
				+ roundToDecimal(intrusionRatio * 100, config.decimalPointsPercent)
				+ '%, diagonal area obstruction is '
				+ roundToDecimal(diagToApertureAreaRatio * 100, config.decimalPointsPercent)
				+ '%, total area obstruction is '
				+ roundToDecimal((intrusionRatio + diagToApertureAreaRatio) * 100, config.decimalPointsPercent)
				+ '%'
		);
	} else {
		common.P2IntrusionResultsLabel().html('P2 does not intrude'
				+ ', diagonal area obstruction is '
				+ roundToDecimal(diagToApertureAreaRatio * 100, config.decimalPointsPercent)
				+ '%'
		);
	}
};

MLB.NewtDesigner.drawOffsetShadow = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		drawP2Intrusion = MLB.NewtDesigner.drawP2Intrusion,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		canvas,
		context,
		aperture,
		diagonalSize,
		offset,
		scalingFactor,
		canvasSize,
		scaledAperture,
		scaledApertureRadius,
		scaledDiagonal,
		scaledDiagonalRadius,
		scaledOffset,
		canvasCenter,
		diagonalCenter,
		diagOffsetShadowLegendStr;

	aperture = common.apertureVal();
	diagonalSize = state.diag.smallestUserDefinedSize;
	offset = state.diag.offset.focalPoint;

	canvasSize = state.scaling.height;
	scalingFactor = canvasSize / aperture * config.apertureToCanvasRatio;
	scaledAperture = scalingFactor * aperture;
	scaledApertureRadius = scaledAperture / 2;
	scaledDiagonal = scalingFactor * diagonalSize;
	scaledDiagonalRadius = scaledDiagonal / 2;
	scaledOffset = scalingFactor * offset;

	// build canvas, context
	common.offsetShadowCanvasDiv().append(buildCanvasElement('offsetShadowCanvas', canvasSize, canvasSize));
	canvas = common.offsetShadowCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}

	canvasCenter = point(canvasSize / 2, canvasSize / 2 + config.canvasDimensionHalfHeight * 4);
	diagonalCenter = point(canvasCenter.x + scaledOffset, canvasCenter.y);

	// draw primary mirror
	fillCircle(context, canvasCenter, scaledApertureRadius, config.canvasMirrorFaceStyle);
	// then draw any P2 intrusion
	drawP2Intrusion(context, canvasCenter, scalingFactor, Math.pow(diagonalSize / aperture, 2));
	drawCircle(context, canvasCenter, scaledApertureRadius, config.canvasLineWidth, config.canvasCrosshairStyle);
	// draw offset diagonal
	fillCircle(context, diagonalCenter, scaledDiagonalRadius, config.canvasGlassStyle);

	// draw crosshairs
	drawLine(context, config.canvasCrosshairStyle, config.canvasLineWidth, point(canvasCenter.x - scaledApertureRadius, canvasCenter.y), point(canvasCenter.x + scaledApertureRadius, canvasCenter.y));
	drawLine(context, config.canvasCrosshairStyle, config.canvasLineWidth, point(canvasCenter.x, canvasCenter.y - scaledApertureRadius), point(canvasCenter.x, canvasCenter.y + scaledApertureRadius));

	// draw title and legend
	context.fillStyle = config.canvasStructureStyle;
	context.fillText(config.diagOffsetShadowLit, config.canvasDimensionHalfHeight * 2, config.canvasDimensionHeight / 2);
	diagOffsetShadowLegendStr = common.includeP2Intrusion()
			? config.diagOffsetShadowLegendLit + ', ' + config.P2IntrusionLegendLit
			: config.diagOffsetShadowLegendLit;
	context.fillText(diagOffsetShadowLegendStr, config.canvasDimensionHalfHeight * 2, config.canvasDimensionHeight);
};

MLB.NewtDesigner.drawOffsetInFocuser = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		drawP2Intrusion = MLB.NewtDesigner.drawP2Intrusion,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		canvas,
		context,
		aperture,
		diagonalSize,
		offset,
		scalingFactor,
		canvasSize,
		scaledAperture,
		scaledApertureRadius,
		scaledDiagonal,
		scaledDiagonalRadius,
		scaledOffset,
		scaledFocuserRadius,
		scaledEyeRadius,
		canvasCenter,
		diagonalCenter;

	aperture = common.apertureVal();
	diagonalSize = state.diag.smallestUserDefinedSize;
	offset = state.diag.offset.focalPoint;

	canvasSize = state.scaling.height;
	scalingFactor = canvasSize / aperture * config.apertureToCanvasRatio;
	scaledAperture = scalingFactor * aperture;
	scaledApertureRadius = scaledAperture / 2;
	scaledDiagonal = scalingFactor * diagonalSize;
	scaledDiagonalRadius = scaledDiagonal / 2;
	scaledOffset = scalingFactor * offset;
	scaledFocuserRadius = scaledDiagonalRadius - scaledOffset - config.canvasLineWidth * 4;
	scaledEyeRadius = scaledFocuserRadius / 4;

	// build canvas, context
	common.offsetAlignmentCanvasDiv().append(buildCanvasElement('offsetAlignmentCanvas', canvasSize, canvasSize));
	canvas = common.offsetAlignmentCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}

	canvasCenter = point(canvasSize / 2, canvasSize / 2 + config.canvasDimensionHalfHeight * 4);
	diagonalCenter = point(canvasCenter.x + scaledOffset, canvasCenter.y);

	// draw primary mirror
	fillCircle(context, canvasCenter, scaledApertureRadius, config.canvasMirrorFaceStyle);
	// then draw any P2 intrusion
	drawP2Intrusion(context, canvasCenter, scalingFactor, Math.pow(diagonalSize / aperture, 2));
	drawCircle(context, canvasCenter, scaledApertureRadius, config.canvasLineWidth, config.canvasCrosshairStyle);
	// draw offset diagonal
	fillCircle(context, diagonalCenter, scaledDiagonalRadius, config.canvasDiagStyle);
	// draw space inside focuser tube
	fillCircle(context, canvasCenter, scaledFocuserRadius, config.canvasEyeStyle);
	// draw focuser tube
	drawCircle(context, canvasCenter, scaledFocuserRadius, config.canvasLineWidth * 4, config.canvasFocuserStyle);
	// draw eye
	fillCircle(context, canvasCenter, scaledEyeRadius, config.canvasGlassStyle);

	// draw crosshairs
	drawLine(context, config.canvasCrosshairStyle, config.canvasLineWidth, point(canvasCenter.x - scaledApertureRadius, canvasCenter.y), point(canvasCenter.x + scaledApertureRadius, canvasCenter.y));
	drawLine(context, config.canvasCrosshairStyle, config.canvasLineWidth, point(canvasCenter.x, canvasCenter.y - scaledApertureRadius), point(canvasCenter.x, canvasCenter.y + scaledApertureRadius));

	// draw title
	context.fillStyle = config.canvasStructureStyle;
	context.fillText(config.diagOffsetAlignmentLit, config.canvasDimensionHalfHeight * 2, config.canvasDimensionHeight / 2);
	context.fillText(config.diagOffsetAlignmentLegendLit, config.canvasDimensionHalfHeight * 2, config.canvasDimensionHeight);
	if (common.includeP2Intrusion()) {
		context.fillText(config.P2IntrusionLegendLit, config.canvasDimensionHalfHeight * 2, config.canvasDimensionHeight * 3 / 2);
	}
};

MLB.NewtDesigner.drawCanvasOutline = function (context, canvas) {
	var config = MLB.NewtDesigner.config;

	context.rect(0, 0, canvas.width, canvas.height);
	context.stroke();
	context.rect(config.canvasBorder, config.canvasBorder, canvas.width - 2 * config.canvasBorder, canvas.height - 2 * config.canvasBorder);
	context.stroke();
};

MLB.NewtDesigner.graphBaffles = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		point = MLB.sharedLib.point,
		rect = MLB.sharedLib.rect,
		drawLine = MLB.sharedLib.drawLine,
		drawRect = MLB.sharedLib.drawRect,
		drawHorizDimen = MLB.sharedLib.drawHorizDimen,
		uom = MLB.sharedLib.uom,
		calcProjectedFocuserBaffleRadius = MLB.calcLib.calcProjectedFocuserBaffleRadius,
		calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic,
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
		focalPlaneToDiagDistance,
		sagitta,
		diagSize,
		diagOffset,
		focalPlaneToFocuserBarrelBottomDistance,
		projectedFocuserBaffleRadius,
		primaryMirrorThicknessInUom,
		primaryMirrorCellThicknessInUom,
		scalingFactor,
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
		dimensionY;

	aperture = common.apertureVal();
	focalRatio = common.focalRatioVal();
	telescopeFocalLength = common.telescopeFocalLengthVal();
	focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal();
	maxFieldDia = common.maxFieldDiaDiagVal();
	diagSize = common.sharedDiagSizeVal();
	barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
	barrelTubeLength = common.barrelTubeLengthVal();
	telescopeTubeOD = common.telescopeTubeODVal();
	telescopeTubeThickness = common.telescopeTubeThicknessVal();
	diagOffset = common.diagOffsetVal();
	focalPlaneToFocuserBarrelBottomDistance = common.focuserInwardFocusingDistanceVal() + common.barrelTubeLengthVal();

	projectedFocuserBaffleRadius = calcProjectedFocuserBaffleRadius(maxFieldDia, barrelTubeInsideDiameter, focalPlaneToFocuserBarrelBottomDistance, focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness);
	sagitta = calcSagittaParabolic(aperture, focalRatio);

	primaryMirrorThicknessInUom = common.convertInchesToUom(state.mirrorEdgeThicknessInches);
	primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

	scalingFactor = state.scaling.scalingFactor;
	scaledAperture = scalingFactor * aperture;
	scaledMirrorRadius = scaledAperture / 2;
	scaledTelescopeFocalLength = scalingFactor * telescopeFocalLength;
	scaledmaxFieldDia = scalingFactor * maxFieldDia;
	scaledBarrelTubeInsideDiameter = scalingFactor * barrelTubeInsideDiameter;
	scaledBarrelTubeLength = scalingFactor * barrelTubeLength;
	scaledTelescopeTubeOD = scalingFactor * telescopeTubeOD;
	scaledTelescopeTubeThickness = scalingFactor * telescopeTubeThickness;
	scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
	scaledFocalPlaneToDiagDistance = scalingFactor * focalPlaneToDiagDistance;
	scaledDiagSize = scalingFactor * diagSize;
	scaledHalfDiagSize = scaledDiagSize / 2;
	scaledFocalPlaneToFocuserBarrelBottomDistance = scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
	scaledProjectedFocuserBaffleRadius = scalingFactor * projectedFocuserBaffleRadius;
	scaledPrimaryMirrorThicknessInUom = scalingFactor * primaryMirrorThicknessInUom;
	scaledPrimaryMirrorCellThicknessInUom = scalingFactor * primaryMirrorCellThicknessInUom;
	scaledDiagOffset = scalingFactor * diagOffset;
	scaledRadiusCurvature = scaledAperture * focalRatio * 2;
	scaledSagitta = scalingFactor * sagitta;

	// calc primary mirror angle from mirror edge to radius of curvature:
	// circumference = 2 * PI * RoC; RoC = MD * FR * 2; circumference = 2 * PI * Radian
	// circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
	mirrorRadian = 1 / (2 * focalRatio);

	// build canvas, context
	common.baffleCanvasDiv().append(buildCanvasElement('baffleCanvas', state.scaling.width, state.scaling.height));
	canvas = common.baffleCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}


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
	// diag angle of 45 deg means that minor axis is the delta
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
	state.mirrorFrontEdgeToFocalPlaneDistance = (focalPlaneCenterPt.x - mirrorLowerFacePt.x) / state.scaling.scalingFactor;
	state.tubeBackEndToFocalPlaneDistance = (focalPlaneCenterPt.x - telescopeTubeRect.x) / state.scaling.scalingFactor;
	tiltAngleDeg = increasedReflectionAngleRad / uom.degToRad;
	tiltedDistance = Math.sqrt(angledLengthX * angledLengthX + angledLengthY * angledLengthY) / state.scaling.scalingFactor;
	flatDistance = (projectedFocuserBaffleRightPt.x - projectedFocuserBaffleLeftPt.x - angledLengthX * 2) / state.scaling.scalingFactor;

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
	drawLine(context, config.canvasFocuserBaffleStyle, config.canvasLineWidth, focalPlaneLeftPt, projectedFocuserBaffleRightPt);
	drawLine(context, config.canvasFocuserBaffleStyle, config.canvasLineWidth, focalPlaneRightPt, projectedFocuserBaffleLeftPt);
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
	drawLine(context, config.canvasBaffleEdgeStyle, config.canvasLineWidth, forwardAngledPt, point(telescopeTubeRect.endX, telescopeTubeRect.y));
	drawLine(context, config.canvasBaffleEdgeStyle, config.canvasLineWidth, forwardAngledPt, point(focuserBarrelRect.x, focuserBarrelRect.endY));
	drawLine(context, config.canvasBaffleAngleStyle, config.canvasLineWidth, projectedFocuserBaffleRightPt, point(focuserBarrelRect.x, focuserBarrelRect.endY));
	drawLine(context, config.canvasBaffleAngleStyle, config.canvasLineWidth, projectedFocuserBaffleRightPt, point(telescopeTubeRect.endX, telescopeTubeRect.y));

	// write dimension for projected focuser baffle
	oppositeFocuserDia = projectedFocuserBaffleRadius * 2;
	text = config.projectedBaffleDimensionText + roundToDecimal(oppositeFocuserDia, config.decimalPointsDimension) + uomLengthLit;
	dimensionY = projectedFocuserBafflePartBRect.endY + 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, projectedFocuserBaffleLeftPt.x, projectedFocuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// write dimension for primary mirror baffle
	primaryMirrorExtension = (primaryMirrorBaffleLowerRect.endX - mirrorLowerFacePt.x) / state.scaling.scalingFactor;
	text = config.primaryMirrorBaffleDimensionText + roundToDecimal(primaryMirrorExtension, config.decimalPointsDimension) + uomLengthLit;
	// keep same dimensionY
	drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, primaryMirrorBaffleLowerRect.endX, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// write mirror front edge to focal plane center line dimension
	dimensionY += 4 * config.canvasDimensionHalfHeight;
	text = config.primaryMirrorToFocalPlaneDimensionText + roundToDecimal(state.mirrorFrontEdgeToFocalPlaneDistance, config.decimalPointsDimension) + uomLengthLit;
	drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, focalPlaneCenterPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// write mirror front edge to tube front dimension
	dimensionY += 4 * config.canvasDimensionHalfHeight;
	text = config.primaryMirrorToTubeEndDimensionText + roundToDecimal((projectedFocuserBaffleRightPt.x - mirrorLowerFacePt.x) / state.scaling.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
	drawHorizDimen(context, text, dimensionY, mirrorLowerFacePt.x, projectedFocuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

	// write out notes
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
			+ uomLengthLit);
};

MLB.NewtDesigner.graphFocuserBaffles = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		calcNewtBaffle = MLB.calcLib.calcNewtBaffle,
		canvas,
		context,
		aperture,
		focalRatio,
		telescopeFocalLength,
		focalPlaneDia,
		focuserBarrelBottomToFocalPlaneDistance,
		focuserBarrelID,
		diagSizeMinorAxis,
		diagToFocalPlaneDistance,
		diagToFocuserBaffleDistance,
		diagToOppositeSideBaffleDistance,
		primaryToBaffleDistance,
		tubeID,
		oppositeBaffleY,
		model,
		border,
		totalHeight,
		scalingFactor,
		cg,
		focalPlaneLength,
		focalPlaneY,
		focalPlaneLeftPt,
		focalPlaneRightPt,
		oppositeBaffleLength,
		oppositeBaffleLeftPt,
		oppositeBaffleRightPt,
		diagDelta,
		diagY,
		diagUpperLeftPt,
		diagLowerRightPt,
		focuserBaffleY,
		focuserBaffleODLeftPt,
		focuserBaffleIDRightPt,
		focuserBaffleIDLeftPt,
		focuserBaffleODRightPt,
		focuserBarrelBottomY,
		focuserBarrelHalfWidth,
		focuserBarrelBottomLeftPt,
		focuserBarrelBottomRightPt,
		focuserBarrelTopLeftPt,
		focuserBarrelTopRightPt,
		decimals,
		textBorder,
		focuserBaffleString,
		diagonalBaffleString,
		primaryBaffleString,
		uomLengthLit = common.getUomLengthLit();

	// build canvas, context
	// if altering width, height then change the cg point below
	common.focuserBaffleCanvasDiv().append(buildCanvasElement('focuserBaffleCanvas', common.baffleCanvasID().width / 2, common.baffleCanvasID().height));
	canvas = common.focuserBaffleCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	aperture = common.apertureVal();
	focalRatio = common.focalRatioVal();
	telescopeFocalLength = common.telescopeFocalLengthVal();

	focalPlaneDia = common.maxFieldDiaDiagVal();
	focuserBarrelBottomToFocalPlaneDistance = common.focuserInwardFocusingDistanceVal() + common.barrelTubeLengthVal();
	focuserBarrelID = common.barrelTubeInsideDiameterVal();
	diagSizeMinorAxis = common.sharedDiagSizeVal();
	diagToFocalPlaneDistance = common.focalPlaneToDiagDistanceVal();
	diagToFocuserBaffleDistance = common.diagToFocuserBaffleDistanceVal();
	tubeID = common.telescopeTubeODVal() - common.telescopeTubeThicknessVal() * 2;
	diagToOppositeSideBaffleDistance = tubeID / 2;
	primaryToBaffleDistance = 0;

	model = calcNewtBaffle(focalPlaneDia, focuserBarrelBottomToFocalPlaneDistance, focuserBarrelID, diagSizeMinorAxis, diagToFocalPlaneDistance, diagToFocuserBaffleDistance, diagToOppositeSideBaffleDistance, telescopeFocalLength, primaryToBaffleDistance, tubeID);

	totalHeight = diagToFocalPlaneDistance + diagToOppositeSideBaffleDistance;
	scalingFactor = state.scaling.scalingFactor;

	cg = point(canvas.width / 3, canvas.height / 2);

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}

	// draw focal plane
	focalPlaneLength = scalingFactor * focalPlaneDia;
	focalPlaneY = cg.y - totalHeight * scalingFactor / 2;
	focalPlaneLeftPt = point(cg.x - focalPlaneLength / 2, focalPlaneY);
	focalPlaneRightPt = point(cg.x + focalPlaneLength / 2, focalPlaneY);
	drawLine(context, config.canvasGlassStyle, 2, focalPlaneLeftPt, focalPlaneRightPt);

	// draw baffle opposite diagonal
	oppositeBaffleLength = scalingFactor * model.diagonalBaffleOD;
	oppositeBaffleY = focalPlaneY + totalHeight * scalingFactor;
	oppositeBaffleLeftPt = point(cg.x - oppositeBaffleLength / 2, oppositeBaffleY);
	oppositeBaffleRightPt = point(cg.x + oppositeBaffleLength / 2, oppositeBaffleY);
	drawLine(context, config.canvasBaffleStyle, 2, oppositeBaffleLeftPt, oppositeBaffleRightPt);

	// draw diagonal
	diagDelta = diagSizeMinorAxis * scalingFactor / 2;
	diagY = focalPlaneY + diagToFocalPlaneDistance * scalingFactor;
	diagUpperLeftPt = point(cg.x - diagDelta, diagY + diagDelta);
	diagLowerRightPt = point(cg.x + diagDelta, diagY - diagDelta);
	drawLine(context, config.canvasGlassStyle, 2, diagUpperLeftPt, diagLowerRightPt);

	// draw focuser baffle OD
	focuserBaffleY = diagY - diagToFocuserBaffleDistance * scalingFactor;
	focuserBaffleODLeftPt = point(cg.x - model.focuserBaffleOD * scalingFactor / 2, focuserBaffleY);
	focuserBaffleODRightPt = point(cg.x + model.focuserBaffleOD * scalingFactor / 2, focuserBaffleY);
	drawLine(context, config.canvasBaffleStyle, 2, focuserBaffleODLeftPt, focuserBaffleODRightPt);

	// draw focuser baffle ID
	focuserBaffleIDLeftPt = point(cg.x - model.focuserBaffleID * scalingFactor / 2, focuserBaffleY);
	focuserBaffleIDRightPt = point(cg.x + model.focuserBaffleID * scalingFactor / 2, focuserBaffleY);
	drawLine(context, 'white', 2, focuserBaffleIDLeftPt, focuserBaffleIDRightPt);

	// draw focuser barrel bottom
	focuserBarrelBottomY = focalPlaneY + focuserBarrelBottomToFocalPlaneDistance * scalingFactor;
	focuserBarrelHalfWidth = focuserBarrelID * scalingFactor / 2;
	focuserBarrelBottomLeftPt = point(cg.x - focuserBarrelHalfWidth, focuserBarrelBottomY);
	focuserBarrelBottomRightPt = point(cg.x + focuserBarrelHalfWidth, focuserBarrelBottomY);
	drawLine(context, config.canvasStructureLightStyle, 2, focuserBarrelBottomLeftPt, focuserBarrelBottomRightPt);

	// draw focuser barrel sides
	focuserBarrelTopLeftPt = point(cg.x - focuserBarrelHalfWidth, focalPlaneY);
	focuserBarrelTopRightPt = point(cg.x + focuserBarrelHalfWidth, focalPlaneY);
	drawLine(context, config.canvasStructureLightStyle, 2, focuserBarrelBottomLeftPt, focuserBarrelTopLeftPt);
	drawLine(context, config.canvasStructureLightStyle, 2, focuserBarrelBottomRightPt, focuserBarrelTopRightPt);

	// draw lines of sight:
	// crisscrossing lines between focal plane and opposite baffle
	drawLine(context, config.canvasLightBaffleStyle, 1, focalPlaneLeftPt, oppositeBaffleRightPt);
	drawLine(context, config.canvasLightBaffleStyle, 1, focalPlaneRightPt, oppositeBaffleLeftPt);
	// crisscrossing lines between focal plane and focuser baffle
	drawLine(context, config.canvasLightBaffleStyle, 1, focalPlaneLeftPt, focuserBaffleODRightPt);
	drawLine(context, config.canvasLightBaffleStyle, 1, focalPlaneRightPt, focuserBaffleODLeftPt);
	// lines between focal plane and diagonal
	drawLine(context, config.canvasLightBaffleStyle, 1, focalPlaneLeftPt, diagUpperLeftPt);
	drawLine(context, config.canvasLightBaffleStyle, 1, focalPlaneRightPt, diagLowerRightPt);

	// write components and dimensions
	decimals = config.decimalPointsDimension;
	border = config.canvasBorder * 4;
	textBorder = border / 2;

	diagonalBaffleString = 'diagonal baffle = '
			+ roundToDecimal(model.diagonalBaffleOD, decimals)
			+ ' OD'
			+ uomLengthLit;
	focuserBaffleString = 'focuser baffle = '
			+ roundToDecimal(model.focuserBaffleID, decimals)
			+ ' ID'
			+ uomLengthLit
			+ ' x '
			+ roundToDecimal(model.focuserBaffleOD, decimals)
			+ ' OD'
			+ uomLengthLit;
	primaryBaffleString = 'primary baffle = '
			+ roundToDecimal(model.primaryBaffleOD, decimals)
			+ ' OD'
			+ uomLengthLit
			+ ' at primary mirror or extend telescope tube forward of primary mirror = '
			+ roundToDecimal(model.tubeExtension, decimals)
			+ uomLengthLit;

	context.fillStyle = config.canvasGlassStyle;
	context.fillText('focal plane', focalPlaneRightPt.x + textBorder, focalPlaneRightPt.y);
	context.fillStyle = config.canvasStructureStyle;
	context.fillText('focuser barrel', focuserBarrelBottomRightPt.x + textBorder, focuserBarrelBottomRightPt.y);
	context.fillStyle = config.canvasGlassStyle;
	context.fillText('diagonal', diagLowerRightPt.x + textBorder, diagLowerRightPt.y);
	context.fillStyle = config.canvasBaffleStyle;

	context.fillText(diagonalBaffleString, cg.x, oppositeBaffleRightPt.y - border / decimals);
	context.fillText(focuserBaffleString, cg.x, focuserBaffleIDRightPt.y + border / decimals);

	// write out results
	common.focuserBaffleDesignerResultsLabel().html(focuserBaffleString
			+ '<br>'
			+ diagonalBaffleString
			+ '<br>'
			+ primaryBaffleString);
};

MLB.NewtDesigner.graphLowrider = () => {
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
		focalPointPerpendicularOffsetFromEdgeOfPrimary,
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
		scaledFocalPlaneToFoldingMirrorSlantedDistance,
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
		dimensionX,
		diagonalString,
		slopeRight,
		slopeLeft,
		yDeltaToTraverse,
		xTravel,
		// focuser baffle is the baffle for the light cone exiting the focuser; placed on the far opposite side of the tube
		focuserBaffleRightPt,
		focuserBaffleLeftPt,
		focuserBaffleRightTubeODPt,
		focuserBaffleLeftTubeODPt,
		diagBaffleRightPt,
		diagBaffleLeftPt,
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
		drawVertDimen = MLB.sharedLib.drawVertDimen,
		uom = MLB.sharedLib.uom,
		calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic,
		calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian,
		uomLengthLit = common.getUomLengthLit();

	aperture = common.apertureVal();
	focalRatio = common.focalRatioVal();
	telescopeFocalLength = common.telescopeFocalLengthVal();
	maxFieldDia = common.maxFieldDiaDiagVal();
	barrelTubeInsideDiameter = common.barrelTubeInsideDiameterVal();
	barrelTubeLength = common.barrelTubeLengthVal();
	telescopeTubeOD = common.telescopeTubeODVal();
	telescopeTubeThickness = common.telescopeTubeThicknessVal();
	focalPlaneToFocuserBarrelBottomDistance = common.focuserInwardFocusingDistanceVal() + common.barrelTubeLengthVal();
	lowriderSecondaryMirrorSize = common.lowriderSecondaryMirrorSizeVal();
	lowriderSecondaryOffset = common.lowriderSecondaryOffsetVal();
	focalPlaneToSecondaryDistance = common.focalPlaneToSecondaryDistanceVal();
	focalPointPerpendicularOffsetFromEdgeOfPrimary = common.focalPointPerpendicularOffsetFromEdgeOfPrimaryVal();

	primaryMirrorThicknessInUom = common.convertInchesToUom(state.mirrorEdgeThicknessInches);
	primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);

	sagitta = calcSagittaParabolic(aperture, focalRatio);

	// calcFoldedNewtonian(mirrorDia, focalRatio, diagSize, focalPointOffsetFromEdgeOfPrimary, focalPointToTertiaryDistance, focalPointToDiagDistance) {
	// focalPlaneToTertiaryDistance = 0
	state.lowriderModel = calcFoldedNewtonian(aperture, focalRatio, lowriderSecondaryMirrorSize, focalPointPerpendicularOffsetFromEdgeOfPrimary, 0, focalPlaneToSecondaryDistance);

	// build canvas, context
	common.lowriderCanvasDiv().append(buildCanvasElement('lowriderCanvas', common.baffleCanvasID().width * 1.5, common.baffleCanvasID().height));
	canvas = common.lowriderCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

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

	scaledMainAxisLength = state.scaling.scalingFactor * state.lowriderModel.diagToPrimaryMirrorDistance;
	scaledAperture = state.scaling.scalingFactor * aperture;
	scaledRadiusCurvature = scaledAperture * focalRatio * 2;
	scaledMirrorRadius = scaledAperture / 2;
	scaledTelescopeFocalLength = state.scaling.scalingFactor * telescopeFocalLength;
	scaledmaxFieldDia = state.scaling.scalingFactor * maxFieldDia;
	scaledBarrelTubeInsideDiameter = state.scaling.scalingFactor * barrelTubeInsideDiameter;
	scaledBarrelTubeLength = state.scaling.scalingFactor * barrelTubeLength;
	scaledTelescopeTubeOD = state.scaling.scalingFactor * telescopeTubeOD;
	scaledTelescopeTubeThickness = state.scaling.scalingFactor * telescopeTubeThickness;
	scaledHalfTubeID = scaledTelescopeTubeOD / 2 - scaledTelescopeTubeThickness;
	scaledFocalPlaneToFocuserBarrelBottomDistance = state.scaling.scalingFactor * focalPlaneToFocuserBarrelBottomDistance;
	scaledPrimaryMirrorThicknessInUom = state.scaling.scalingFactor * primaryMirrorThicknessInUom;
	scaledPrimaryMirrorCellThicknessInUom = state.scaling.scalingFactor * primaryMirrorCellThicknessInUom;
	scaledSagitta = state.scaling.scalingFactor * sagitta;
	scaledHalfDiagMajorAxisSize = state.scaling.scalingFactor * state.lowriderModel.diagMajorAxisSize / 2;
	scaledlowriderSecondaryOffset = state.scaling.scalingFactor * lowriderSecondaryOffset;

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
	focalPt = point(mirrorCenterPt.x + state.scaling.scalingFactor * state.lowriderModel.focalPointToPrimaryMirrorDistance, mirrorCenterPt.y - state.scaling.scalingFactor * (aperture / 2 + focalPointPerpendicularOffsetFromEdgeOfPrimary));
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

	// slopes for baffles
	xDelta = focuserBarrelTubeLowerRightPt.x - focalPlaneLeftPt.x;
	yDelta = focuserBarrelTubeLowerRightPt.y - focalPlaneLeftPt.y;
	slopeRight = yDelta / xDelta;
	xDelta = focuserBarrelTubeLowerLeftPt.x - focalPlaneRightPt.x;
	yDelta = focuserBarrelTubeLowerLeftPt.y - focalPlaneRightPt.y;
	slopeLeft = yDelta / xDelta;

	// baffle at the far side of the tube right
	yDeltaToTraverse = tubeIDLowerY - focalPlaneLeftPt.y;
	xTravel = yDeltaToTraverse / slopeRight;
	focuserBaffleRightPt = point(focalPlaneLeftPt.x + xTravel, tubeIDLowerY);
	focuserBaffleRightTubeODPt = point(focuserBaffleRightPt.x, focuserBaffleRightPt.y + scaledTelescopeTubeThickness);
	// baffle at the far side of the tube left
	yDeltaToTraverse = tubeIDLowerY - focalPlaneRightPt.y;
	xTravel = yDeltaToTraverse / slopeLeft;
	focuserBaffleLeftPt = point(focalPlaneRightPt.x + xTravel, tubeIDLowerY);
	focuserBaffleLeftTubeODPt = point(focuserBaffleLeftPt.x, focuserBaffleLeftPt.y + scaledTelescopeTubeThickness);

	// baffle at the diagonal right
	yDeltaToTraverse = diagLowerPt.y - focalPlaneLeftPt.y;
	xTravel = yDeltaToTraverse / slopeRight;
	diagBaffleRightPt = point(focalPlaneLeftPt.x + xTravel, diagLowerPt.y);
	// baffle at the diagonal left
	yDeltaToTraverse = diagLowerPt.y - focalPlaneRightPt.y;
	xTravel = yDeltaToTraverse / slopeLeft;
	diagBaffleLeftPt = point(focalPlaneRightPt.x + xTravel, diagLowerPt.y);

	// save calculated frontEndOfTubeToPrimaryMirrorDistance value to model
	state.lowriderModel.frontEndOfTubeToPrimaryMirrorDistance = (focuserBaffleRightPt.x - mirrorLowerFacePt.x) / state.scaling.scalingFactor;

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
	// draw baffle on opposite side of diagonal
	drawLine(context, config.canvasBaffleStyle, config.canvasLineWidth, diagBaffleLeftPt, diagBaffleRightPt);
	// draw directed light rays for baffles around primary mirror
	drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagUpperPt, focalPlaneLeftPt);
	drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagUpperPt, primaryMirrorBaffleLowerIntersectPt);
	drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagLowerPt, focalPlaneRightPt);
	drawLine(context, config.canvasLightBaffleStyle, config.canvasLineWidth, diagLowerPt, primaryMirrorBaffleUpperIntersectPt);
	// draw focal plane
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, focalPlaneLeftPt, focalPlaneRightPt);

	// write dimension for projected focuser baffle
	text = config.projectedBaffleDimensionText + roundToDecimal((focuserBaffleRightPt.x - focuserBaffleLeftPt.x) / state.scaling.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
	dimensionY = focuserBaffleRightPt.y + 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, focuserBaffleLeftPt.x, focuserBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// write dimension for diagonal baffle
	text = config.projectedBaffleDimensionText + roundToDecimal((diagBaffleRightPt.x - diagBaffleLeftPt.x) / state.scaling.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
	dimensionY = diagBaffleRightPt.y + 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, diagBaffleLeftPt.x, diagBaffleRightPt.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// write dimension for primary mirror baffle
	text = config.primaryMirrorBaffleDimensionText + roundToDecimal((primaryMirrorBaffleLowerFrontPt.x - mirrorLowerFacePt.x) / state.scaling.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
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
	// draw folding dimensions...
	// draw focal plane to primary mirror edge dimension line
	// calculated: text = config.primaryMirrorToFocalPlaneVerticalHeightText + roundToDecimal((mirrorUpperFacePt.y - focalPt.y) / state.scaling.scalingFactor, config.decimalPointsDimension) + uomLengthLit;
	text = config.primaryMirrorToFocalPlaneVerticalHeightText + focalPointPerpendicularOffsetFromEdgeOfPrimary + uomLengthLit;
	dimensionX = focuserBarrelTubeLowerRightPt.x + config.canvasBorder;
	drawVertDimen(context, text, dimensionX, focalPt.y, mirrorUpperFacePt.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// draw diag to focal point
	drawLine(context, config.canvasStructureLightStyle, config.canvasLineWidth, point(dimensionX + diagPt.x - focalPt.x, diagPt.y), point(dimensionX, focalPt.y));
	// add text with dimension
	scaledFocalPlaneToFoldingMirrorSlantedDistance = Math.sqrt(Math.pow(focalPt.y - diagPt.y, 2) + Math.pow(focalPt.x - diagPt.x, 2)) / state.scaling.scalingFactor;
	// calculated: text = config.focalPlaneToFoldingMirrorSlantedText + roundToDecimal(scaledFocalPlaneToFoldingMirrorSlantedDistance, config.decimalPointsDimension) + uomLengthLit;
	text = config.focalPlaneToFoldingMirrorSlantedText + focalPlaneToSecondaryDistance + uomLengthLit;
	context.fillStyle = config.canvasStructureLightStyle;
	context.fillText(text, dimensionX + (diagPt.x - focalPt.x) / 2, (diagPt.y + focalPt.y) / 2);

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
			+ config.degLit
			+ '<br>bending distance = '
			+ roundToDecimal(state.lowriderModel.diagToPrimaryMirrorDistance - state.lowriderModel.focalPointToPrimaryMirrorDistance, config.decimalPointsDimension)
			+ uomLengthLit
			+ '<br>focal point to mirror center line lateral distance = '
			+ roundToDecimal(aperture / 2 + focalPointPerpendicularOffsetFromEdgeOfPrimary, config.decimalPointsDimension)
			+ uomLengthLit
			+ '<br>mirror sagitta = '
			+ roundToDecimal(sagitta, config.decimalPointsDimension) + uomLengthLit;
	common.lowriderResults().html(diagonalString);
};

MLB.NewtDesigner.useSecondaryBendingAngle = () => {
	var common = MLB.NewtDesigner.common;

	return common.binoscopeLockSecondaryBendingAngle() && !isNaN(common.binoscopeSecondaryBendingAngleDegVal()) && common.binoscopeSecondaryBendingAngleDegVal() > 0;
};

MLB.NewtDesigner.getBinoscopeMinimumFocalPlaneToSecondaryDistance = () => {
	var common = MLB.NewtDesigner.common,
		useSecondaryBendingAngle = MLB.NewtDesigner.useSecondaryBendingAngle,
		calcBinoscopeMinimumFocalPlaneToSecondaryDistance = MLB.calcLib.calcBinoscopeMinimumFocalPlaneToSecondaryDistance;

	return calcBinoscopeMinimumFocalPlaneToSecondaryDistance(
			common.apertureVal(),
			common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal(),
			common.binoscopeFocalPlaneToTertiaryDistanceVal(),
			useSecondaryBendingAngle() ? common.binoscopeSecondaryBendingAngleDegVal() : 90,
			common.binoscopeTertiaryBendingAngleDegVal()
	);
	// return is minimumFocalPlaneToSecondaryDistance, shortenedVerticalDistanceDueToTertiaryBendingAngle, secondaryToTertiaryDistance
};

MLB.NewtDesigner.setBinoscopeFocalPlaneToSecondaryDistanceToMinimum = () => {
	var common = MLB.NewtDesigner.common,
		getBinoscopeMinimumFocalPlaneToSecondaryDistance = MLB.NewtDesigner.getBinoscopeMinimumFocalPlaneToSecondaryDistance,
		minimumFocalPlaneToSecondaryDistance = getBinoscopeMinimumFocalPlaneToSecondaryDistance().minimumFocalPlaneToSecondaryDistance;

	common.binoscopeFocalPlaneToSecondaryDistance().val(minimumFocalPlaneToSecondaryDistance);
};

MLB.NewtDesigner.setBinoscopeTertiaryBendingAngleFromEyepieceDivergence = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcTertiaryBendingAngleFromEyepieceDivergence = MLB.calcLib.calcTertiaryBendingAngleFromEyepieceDivergence,
		secondaryAxisDownwardTiltAngleDeg = common.binoscopeSecondaryAxisDownwardTiltAngleDegVal(),
		eyepieceDivergenceAngleDeg = common.binoscopeEyepieceDivergenceDegVal();

	common.binoscopeTertiaryBendingAngleDeg().val(roundToDecimal(calcTertiaryBendingAngleFromEyepieceDivergence(eyepieceDivergenceAngleDeg, secondaryAxisDownwardTiltAngleDeg), config.decimalPointsDimension));
};

MLB.NewtDesigner.setBinoscopeEyepieceDivergenceFromTertiaryBendingAngle = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcEyepieceDivergenceFromTertiaryBendingAngle = MLB.calcLib.calcEyepieceDivergenceFromTertiaryBendingAngle,
		tertiaryBendingAngleDeg = common.binoscopeTertiaryBendingAngleDegVal(),
		secondaryAxisDownwardTiltAngleDeg = common.binoscopeSecondaryAxisDownwardTiltAngleDegVal();

	common.binoscopeEyepieceDivergenceDeg().val(roundToDecimal(calcEyepieceDivergenceFromTertiaryBendingAngle(tertiaryBendingAngleDeg, secondaryAxisDownwardTiltAngleDeg), config.decimalPointsDimension));
};

MLB.NewtDesigner.setBinoscopeSecondaryBendingAngleToFormRightAngleWithTertiaryAngle = () => {
	var common = MLB.NewtDesigner.common,
		uom = MLB.sharedLib.uom;

	common.binoscopeSecondaryBendingAngleDeg().val((uom.qtrRev - common.binoscopeTertiaryBendingAngleDegVal() * uom.degToRad) / uom.degToRad);
};

MLB.NewtDesigner.binoscopeWorkflow = () => {
	var common = MLB.NewtDesigner.common,
		useSecondaryBendingAngle = MLB.NewtDesigner.useSecondaryBendingAngle,
		setBinoscopeFocalPlaneToSecondaryDistanceToMinimum = MLB.NewtDesigner.setBinoscopeFocalPlaneToSecondaryDistanceToMinimum,
		calcBinoscopeSecondaryBendingAngle = MLB.calcLib.calcBinoscopeSecondaryBendingAngle,
		setBinoscopeTertiaryBendingAngleFromEyepieceDivergence = MLB.NewtDesigner.setBinoscopeTertiaryBendingAngleFromEyepieceDivergence,
		setBinoscopeEyepieceDivergenceFromTertiaryBendingAngle = MLB.NewtDesigner.setBinoscopeEyepieceDivergenceFromTertiaryBendingAngle,
		setBinoscopeSecondaryBendingAngleToFormRightAngleWithTertiaryAngle = MLB.NewtDesigner.setBinoscopeSecondaryBendingAngleToFormRightAngleWithTertiaryAngle,
		displayFocalPlaneToSecondaryDistanceTooSmallError = MLB.NewtDesigner.displayFocalPlaneToSecondaryDistanceTooSmallError,
		graphBinoscope = MLB.NewtDesigner.graphBinoscope,
		graphBinoscopeFrontView = MLB.NewtDesigner.graphBinoscopeFrontView,
		aperture = common.apertureVal(),
		focalPointPerpendicularOffsetFromEdgeOfPrimary = common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal(),
		focalPlaneToSecondaryDistance = common.binoscopeFocalPlaneToSecondaryDistanceVal(),
		focalPlaneToTertiaryDistance =  common.binoscopeFocalPlaneToTertiaryDistanceVal(),
		tertiaryBendingAngleDeg = common.binoscopeTertiaryBendingAngleDegVal(),
		eyepieceDivergenceLocked,
		secondaryBendingAngleLocked,
		secondaryBendingAngleResults,
		elbowAngleDeg;

	if (common.binoscopeLockEyepieceDivergence()) {
		eyepieceDivergenceLocked = true;
		setBinoscopeTertiaryBendingAngleFromEyepieceDivergence();
	}
	if (common.binoscopeLockEyepieceDivergenceIncludeTertiarySecondaryRightAngle()) {
		eyepieceDivergenceLocked = true;
		secondaryBendingAngleLocked = true;
		setBinoscopeTertiaryBendingAngleFromEyepieceDivergence();
		setBinoscopeSecondaryBendingAngleToFormRightAngleWithTertiaryAngle();
	}
	if (!eyepieceDivergenceLocked) {
		setBinoscopeEyepieceDivergenceFromTertiaryBendingAngle();
	}

	if (secondaryBendingAngleLocked || useSecondaryBendingAngle()) {
		// reset focal plane to secondary distance based on secondary bending angle
		setBinoscopeFocalPlaneToSecondaryDistanceToMinimum();
	} else {
		// set secondary bending angle based on focal plane to secondary distance if possible...
		secondaryBendingAngleResults = calcBinoscopeSecondaryBendingAngle(aperture, focalPointPerpendicularOffsetFromEdgeOfPrimary, focalPlaneToSecondaryDistance, focalPlaneToTertiaryDistance, tertiaryBendingAngleDeg);
		elbowAngleDeg = secondaryBendingAngleResults.elbowAngleDeg;
		if (isNaN(elbowAngleDeg)) {
			displayFocalPlaneToSecondaryDistanceTooSmallError();
			return;
		}
		common.binoscopeSecondaryBendingAngleDeg().val(elbowAngleDeg);
	}

	graphBinoscope();
	graphBinoscopeFrontView();
};

MLB.NewtDesigner.displayFocalPlaneToSecondaryDistanceTooSmallError = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		getBinoscopeMinimumFocalPlaneToSecondaryDistance = MLB.NewtDesigner.getBinoscopeMinimumFocalPlaneToSecondaryDistance,
		requiredDistance,
		canvas,
		context,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		uomLengthLit = common.getUomLengthLit();

	requiredDistance = getBinoscopeMinimumFocalPlaneToSecondaryDistance().minimumFocalPlaneToSecondaryDistance;
	common.binoscopeCanvasDiv().append(buildCanvasElement('binoscopeCanvas', common.baffleCanvasID().width, common.baffleCanvasID().height));
	canvas = common.binoscopeCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;
	context.fillStyle = config.canvasErrorStyle;
	context.fillText(config.binoscopeFocalPlaneToSecondaryDistanceTooShortMsg + ' Needs to be at least ' + requiredDistance + uomLengthLit + '.', 0, canvas.height / 2);
	common.binoscopeResults().html(config.noResults);
};

/*
What I’m looking for is the ability to set the tertiary at an arbitrary angle, to enable a tilt not matched to the secondary. The benefits and consequences include:-
1. the eyepieces are tilted away from the main beam, permitting a shorter secondary to tertiary path, permitting a smaller secondary, reducing obstruction
2. the eyepieces are consequently tilted toward each other, as recommended by Clive, for more comfortable viewing
3. the angle your calculator describes as “Secondary to tertiary downward tilt” is modified.
Because the angles selected for #1 and #2 affect #3, then it would be terrific if your calculator provided a result for any one based on the other. It certainly would have saved me from making my clumsy mechanical model, and would even now give me far more confidence for cutting material.
*/
MLB.NewtDesigner.graphBinoscope = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		point = MLB.sharedLib.point,
		rect = MLB.sharedLib.rect,
		drawLine = MLB.sharedLib.drawLine,
		drawRect = MLB.sharedLib.drawRect,
		drawHorizDimen = MLB.sharedLib.drawHorizDimen,
		uom = MLB.sharedLib.uom,
		calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic,
		uomLengthLit = common.getUomLengthLit(),
		calcBinoscope = MLB.calcLib.calcBinoscope,
		calcBinoscopeEquivalentApertureBinoviewer = MLB.calcLib.calcBinoscopeEquivalentApertureBinoviewer,
		calcBinoscopeEquivalentApertureStar = MLB.calcLib.calcBinoscopeEquivalentApertureStar,
		calcBinoscopeEquivalentApertureNebulosity = MLB.calcLib.calcBinoscopeEquivalentApertureNebulosity,
		binoscopeEquivalentApertureBinoviewer,
		binoscopeEquivalentApertureStar,
		binoscopeEquivalentApertureNebulosity,
		binoscopeModel,
		canvas,
		context,
		aperture,
		focalRatio,
		telescopeFocalLength,
		maxFieldDia,
		telescopeTubeOD,
		focalPointOffsetFromEdgeOfPrimary,
		focalPlaneToTertiaryDistance,
		focalPlaneToSecondaryDistance,
		secondaryBendingAngleDeg,
		tertiaryBendingAngleDeg,
		primaryMirrorThicknessInUom,
		primaryMirrorCellThicknessInUom,
		sagitta,
		scaling,
		scalingFactor,
		scaledHalfTubeID,
		mirrorRadian,
		points = {},
		text,
		dimensionY,
		resultsString,
		telescopeTubeRect;

	// build canvas, context
	common.binoscopeCanvasDiv().append(buildCanvasElement('binoscopeCanvas', common.baffleCanvasID().width, common.baffleCanvasID().height));
	canvas = common.binoscopeCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	// get user input vars
	aperture = common.apertureVal();
	focalRatio = common.focalRatioVal();
	telescopeFocalLength = common.telescopeFocalLengthVal();
	maxFieldDia = common.maxFieldDiaDiagVal();
	telescopeTubeOD = common.telescopeTubeODVal();
	focalPointOffsetFromEdgeOfPrimary = common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal();
	focalPlaneToTertiaryDistance = common.binoscopeFocalPlaneToTertiaryDistanceVal();
	focalPlaneToSecondaryDistance = common.binoscopeFocalPlaneToSecondaryDistanceVal();
	secondaryBendingAngleDeg = common.binoscopeSecondaryBendingAngleDegVal();
	tertiaryBendingAngleDeg = common.binoscopeTertiaryBendingAngleDegVal();
	// vars stored in state, config
	primaryMirrorThicknessInUom = common.convertInchesToUom(state.mirrorEdgeThicknessInches);
	primaryMirrorCellThicknessInUom = common.convertInchesToUom(config.primaryMirrorCellThicknessInches);
	// calc vars
	binoscopeEquivalentApertureBinoviewer = calcBinoscopeEquivalentApertureBinoviewer(aperture);
	binoscopeEquivalentApertureStar = calcBinoscopeEquivalentApertureStar(aperture);
	binoscopeEquivalentApertureNebulosity = calcBinoscopeEquivalentApertureNebulosity(aperture);
	sagitta = calcSagittaParabolic(aperture, focalRatio);
	// calc primary mirror angle from mirror edge to radius of curvature:
	// circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
	// circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
	mirrorRadian = 1 / (2 * focalRatio);

	// get the binoscope model:
	// call is calcBinoscope(mirrorDia, focalRatio, focalPointOffsetFromEdgeOfPrimary, focalPlaneToTertiaryDistance, focalPlaneToSecondaryDistance, secondaryBendingAngleDeg, tertiaryBendingAngleDeg, fieldDia)
	state.binoscopeModel = calcBinoscope(aperture, focalRatio, focalPointOffsetFromEdgeOfPrimary, focalPlaneToTertiaryDistance, focalPlaneToSecondaryDistance, secondaryBendingAngleDeg, tertiaryBendingAngleDeg, maxFieldDia);
	// make a local reference
	binoscopeModel = state.binoscopeModel;

	// scaling
	state.binoscopeModel.scaling = {};
	scaling = binoscopeModel.scaling;
	scalingFactor = state.scaling.scalingFactor;
	scaling.focalLength = scalingFactor * binoscopeModel.focalLength;
	scaling.primaryToSecondaryDistance = scalingFactor * binoscopeModel.primaryToSecondaryDistance;
	scaling.primaryToP3HorizontalDistance = scalingFactor * binoscopeModel.primaryToP3HorizontalDistance;
	scaling.secondaryToTertiaryDistance = scalingFactor * binoscopeModel.secondaryToTertiaryDistance;
	scaling.secondaryToTertiaryVerticalLength = scalingFactor * binoscopeModel.secondaryToTertiaryVerticalLength;
	scaling.secondaryToTertiaryHorizontalLength = scalingFactor * binoscopeModel.secondaryToTertiaryHorizontalLength;
	scaling.secondaryCenterToPrimaryMirrorEdgeRayLength = scalingFactor * binoscopeModel.secondaryCenterToPrimaryMirrorEdgeRayLength;
	scaling.secondaryUpperLength = scalingFactor * binoscopeModel.secondaryUpperLength;
	scaling.secondaryLowerLength = scalingFactor * binoscopeModel.secondaryLowerLength;
	scaling.secondaryMajorAxis = scalingFactor * binoscopeModel.secondaryMajorAxis;
	scaling.secondaryMinorAxis = scalingFactor * binoscopeModel.secondaryMinorAxis;
	scaling.secondaryOffset = scalingFactor * binoscopeModel.secondaryOffset;
	scaling.secondaryUpperPointYLength = scalingFactor * binoscopeModel.secondaryUpperPointYLength;
	scaling.secondaryUpperPointXLength = scalingFactor * binoscopeModel.secondaryUpperPointXLength;
	scaling.secondaryLowerPointYLength = scalingFactor * binoscopeModel.secondaryLowerPointYLength;
	scaling.secondaryLowerPointXLength = scalingFactor * binoscopeModel.secondaryLowerPointXLength;
	scaling.tertiarySizedForP3UpperLength = scalingFactor * binoscopeModel.tertiarySizedForP3UpperLength;
	scaling.tertiarySizedForP3LowerLength = scalingFactor * binoscopeModel.tertiarySizedForP3LowerLength;
	scaling.tertiarySizedForP3MajorAxis = scalingFactor * binoscopeModel.tertiarySizedForP3MajorAxis;
	scaling.tertiarySizedForP3MinorAxis = scalingFactor * binoscopeModel.tertiarySizedForP3MinorAxis;
	scaling.tertiarySizedForP3Offset = scalingFactor * binoscopeModel.tertiarySizedForP3Offset;
	scaling.tertiarySizedForP3UpperPointYLength = scalingFactor * binoscopeModel.tertiarySizedForP3UpperPointYLength;
	scaling.tertiarySizedForP3UpperPointXLength = scalingFactor * binoscopeModel.tertiarySizedForP3UpperPointXLength;
	scaling.tertiarySizedForP3LowerPointYLength = scalingFactor * binoscopeModel.tertiarySizedForP3LowerPointYLength;
	scaling.tertiarySizedForP3LowerPointXLength = scalingFactor * binoscopeModel.tertiarySizedForP3LowerPointXLength;
	scaling.P2centerXLengthFromSecondaryCenter = scalingFactor * binoscopeModel. P2centerXLengthFromSecondaryCenter;
	scaling.P2centerYLengthFromSecondaryCenter = scalingFactor * binoscopeModel. P2centerYLengthFromSecondaryCenter;
	scaling.P2centerXLengthFromTertiaryCenter = scalingFactor * binoscopeModel. P2centerXLengthFromTertiaryCenter;
	scaling.P2centerYLengthFromTertiaryCenter = scalingFactor * binoscopeModel. P2centerYLengthFromTertiaryCenter;
	scaling.P2FieldEdgeXLengthFromP2Center = scalingFactor * binoscopeModel. P2FieldEdgeXLengthFromP2Center;
	scaling.P2FieldEdgeYLengthFromP2Center = scalingFactor * binoscopeModel. P2FieldEdgeYLengthFromP2Center;
	scaling.tertiarySizedForP3FieldUpperPointXLength = scalingFactor * binoscopeModel.tertiarySizedForP3FieldUpperPointXLength;
	scaling.tertiarySizedForP3FieldUpperPointYLength = scalingFactor * binoscopeModel.tertiarySizedForP3FieldUpperPointYLength;
	scaling.tertiarySizedForP3FieldUpperLength = scalingFactor * binoscopeModel.tertiarySizedForP3FieldUpperLength;
	scaling.tertiarySizedForP3FieldLowerPointXLength = scalingFactor * binoscopeModel.tertiarySizedForP3FieldLowerPointXLength;
	scaling.tertiarySizedForP3FieldLowerPointYLength = scalingFactor * binoscopeModel.tertiarySizedForP3FieldLowerPointYLength;
	scaling.tertiarySizedForP3FieldLowerLength = scalingFactor * binoscopeModel.tertiarySizedForP3FieldLowerLength;
	scaling.tertiarySizedForP3FieldMajorAxis = scalingFactor * binoscopeModel.tertiarySizedForP3FieldMajorAxis;
	scaling.tertiarySizedForP3FieldMinorAxis = scalingFactor * binoscopeModel.tertiarySizedForP3FieldMinorAxis;
	scaling.tertiarySizedForP3FieldOffset = scalingFactor * binoscopeModel.tertiarySizedForP3FieldOffset;
	scaling.aperture = scalingFactor * aperture;
	scaling.RadiusCurvature = scaling.aperture * focalRatio * 2;
	scaling.primaryMirrorRadius = scaling.aperture / 2;
	scaling.telescopeFocalLength = scalingFactor * telescopeFocalLength;
	scaling.maxFieldDia = scalingFactor * maxFieldDia;
	scaling.telescopeTubeOD = scalingFactor * telescopeTubeOD;
	scaling.primaryMirrorThicknessInUom = scalingFactor * primaryMirrorThicknessInUom;
	scaling.primaryMirrorCellThicknessInUom = scalingFactor * primaryMirrorCellThicknessInUom;
	scaling.sagitta = scalingFactor * sagitta;
	scaling.focalPlaneToTertiaryDistance = scalingFactor * focalPlaneToTertiaryDistance;
	scaling.P3centerXLengthFromTertiaryCenter = scalingFactor * binoscopeModel.P3centerXLengthFromTertiaryCenter;
	scaling.P3centerYLengthFromTertiaryCenter = scalingFactor * binoscopeModel.P3centerYLengthFromTertiaryCenter;
	scaling.P3FieldEdgeXLengthFromP3Center = scalingFactor * binoscopeModel.P3FieldEdgeXLengthFromP3Center;
	scaling.P3FieldEdgeYLengthFromP3Center = scalingFactor * binoscopeModel.P3FieldEdgeYLengthFromP3Center;
	scaling.tertiaryAngledAtMaxLengthMinorAxis = scalingFactor * binoscopeModel.tertiaryAngledAtMaxLengthMinorAxis;
	scaling.tertiaryAngledAtMaxLengthMajorAxis = scalingFactor * binoscopeModel.tertiaryAngledAtMaxLengthMajorAxis;
	scaling.tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter = scalingFactor * binoscopeModel.tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter;
	scaling.tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter = scalingFactor * binoscopeModel.tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter;

	// points
	// canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
	// calc key points...
	points.mirror = {};
	points.tube = {};
	points.mirror.center = point(config.canvasBorder + scaling.primaryMirrorThicknessInUom + scaling.primaryMirrorCellThicknessInUom, canvas.height / 2);
	points.tube.rearCenter = point(config.canvasBorder, points.mirror.center.y);
	points.primaryFocusP1 = point(points.mirror.center.x + scaling.telescopeFocalLength, points.mirror.center.y);
	// calc mirror edges, back
	points.mirror.upperFace = point(points.mirror.center.x + scaling.sagitta, points.mirror.center.y - scaling.primaryMirrorRadius);
	points.mirror.lowerFace = point(points.mirror.center.x + scaling.sagitta, points.mirror.center.y + scaling.primaryMirrorRadius);
	points.mirror.upperBack = point(points.mirror.center.x - scaling.primaryMirrorThicknessInUom, points.mirror.upperFace.y);
	points.mirror.lowerBack = point(points.mirror.center.x - scaling.primaryMirrorThicknessInUom, points.mirror.lowerFace.y);
	// calc tube Ys
	points.tube.lowerY = points.mirror.center.y + scaledHalfTubeID;
	points.tube.upperY = points.mirror.center.y - scaledHalfTubeID;
	// secondary
	points.secondary = {};
	points.secondary.center = point(points.mirror.center.x + scaling.primaryToSecondaryDistance, points.mirror.center.y);
	points.secondary.upper = point(points.secondary.center.x + scaling.secondaryUpperPointXLength, points.secondary.center.y - scaling.secondaryUpperPointYLength);
	points.secondary.lower = point(points.secondary.center.x - scaling.secondaryLowerPointXLength, points.secondary.center.y + scaling.secondaryLowerPointYLength);
	// tertiarySizedForP3Field
	points.tertiarySizedForP3Field = {};
	points.tertiarySizedForP3Field.center = point(points.secondary.center.x - scaling.secondaryToTertiaryHorizontalLength, points.secondary.center.y - scaling.secondaryToTertiaryVerticalLength);
	points.tertiarySizedForP3Field.upper = point(points.tertiarySizedForP3Field.center.x + scaling.tertiarySizedForP3FieldUpperPointXLength, points.tertiarySizedForP3Field.center.y - scaling.tertiarySizedForP3FieldUpperPointYLength);
	points.tertiarySizedForP3Field.lower = point(points.tertiarySizedForP3Field.center.x - scaling.tertiarySizedForP3FieldLowerPointXLength, points.tertiarySizedForP3Field.center.y + scaling.tertiarySizedForP3FieldLowerPointYLength);
	// tertiarySizedForP3
	points.tertiarySizedForP3 = {};
	points.tertiarySizedForP3.center = point(points.secondary.center.x - scaling.secondaryToTertiaryHorizontalLength, points.secondary.center.y - scaling.secondaryToTertiaryVerticalLength);
	points.tertiarySizedForP3.upper = point(points.tertiarySizedForP3.center.x + scaling.tertiarySizedForP3UpperPointXLength, points.tertiarySizedForP3.center.y - scaling.tertiarySizedForP3UpperPointYLength);
	points.tertiarySizedForP3.lower = point(points.tertiarySizedForP3.center.x - scaling.tertiarySizedForP3LowerPointXLength, points.tertiarySizedForP3.center.y + scaling.tertiarySizedForP3LowerPointYLength);
	// P2
	points.P2 = {};
	points.P2.center = point(points.secondary.center.x - scaling.P2centerXLengthFromSecondaryCenter, points.secondary.center.y - scaling.P2centerYLengthFromSecondaryCenter);
	points.P2.upper = point(points.P2.center.x + scaling.P2FieldEdgeXLengthFromP2Center, points.P2.center.y - scaling.P2FieldEdgeYLengthFromP2Center);
	points.P2.lower = point(points.P2.center.x - scaling.P2FieldEdgeXLengthFromP2Center, points.P2.center.y + scaling.P2FieldEdgeYLengthFromP2Center);
	// focal plane
	points.focalPlane = {};
	points.focalPlane.center = point(points.tertiarySizedForP3.center.x + scaling.focalPlaneToTertiaryDistance, points.tertiarySizedForP3.center.y);
	points.focalPlane.top = point(points.focalPlane.center.x, points.focalPlane.center.y + scaling.maxFieldDia / 2);
	points.focalPlane.bottom = point(points.focalPlane.center.x, points.focalPlane.center.y - scaling.maxFieldDia / 2);

	// angled focal plane when tertiary to focal plane is bent or angled
	points.focalPlane2 = {};
	points.focalPlane2.center = point(points.tertiarySizedForP3.center.x + scaling.P3centerXLengthFromTertiaryCenter, points.tertiarySizedForP3.center.y - scaling.P3centerYLengthFromTertiaryCenter);
	points.focalPlane2.top = point(points.focalPlane2.center.x - scaling.P3FieldEdgeXLengthFromP3Center, points.focalPlane2.center.y - scaling.P3FieldEdgeYLengthFromP3Center);
	points.focalPlane2.bottom = point(points.focalPlane2.center.x + scaling.P3FieldEdgeXLengthFromP3Center, points.focalPlane2.center.y + scaling.P3FieldEdgeYLengthFromP3Center);

	// tertiary when tertiary to focal plane is bent or angled
	points.tertiaryAngled = {};
	points.tertiaryAngled.center = point(points.tertiarySizedForP3.center.x, points.tertiarySizedForP3.center.y);
	points.tertiaryAngled.top = point(points.tertiaryAngled.center.x + scaling.tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter, points.tertiaryAngled.center.y - scaling.tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter);
	points.tertiaryAngled.bottom = point(points.tertiaryAngled.center.x - scaling.tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter, points.tertiaryAngled.center.y + scaling.tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter);

	// calc telescope tube
	telescopeTubeRect = rect(points.tube.rearCenter.x, points.tube.rearCenter.y - scaling.telescopeTubeOD / 2, points.primaryFocusP1.x - points.tube.rearCenter.x, scaling.telescopeTubeOD);

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}

	// draw mirror, lines, rects...

	// draw primary mirror curved face
	context.beginPath();
	context.arc(points.mirror.center.x + scaling.RadiusCurvature, points.mirror.center.y, scaling.RadiusCurvature, uom.halfRev - mirrorRadian / 2, uom.halfRev + mirrorRadian / 2);
	context.strokeStyle = config.canvasGlassStyle;
	context.stroke();
	// draw telescope tube
	drawRect(context, config.canvasStructureLightStyle, config.canvasLineWidth, telescopeTubeRect);
	// draw mirror edges, back
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.mirror.upperFace, points.mirror.upperBack);
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.mirror.lowerFace, points.mirror.lowerBack);
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.mirror.upperBack, points.mirror.lowerBack);
	// draw primary mirror to prime focus
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.mirror.center, points.primaryFocusP1);
	// draw primary mirror to primary focus light rays
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.mirror.upperFace, points.primaryFocusP1);
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.mirror.lowerFace, points.primaryFocusP1);
	// draw secondary
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.secondary.upper, points.secondary.lower);
	// draw secondary to tertiary
	//drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.secondary.center, points.tertiarySizedForP3.center);
	//drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.secondary.upper, points.tertiarySizedForP3.upper);
	//drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.secondary.lower, points.tertiarySizedForP3.lower);
	// draw secondary to P2
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.secondary.center, points.P2.center);
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.secondary.upper, points.P2.center);
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.secondary.lower, points.P2.center);
	// draw tertiarySizedForP3Field
	//drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.upper, points.tertiarySizedForP3Field.lower);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.secondary.upper, points.tertiarySizedForP3Field.upper);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.secondary.lower, points.tertiarySizedForP3Field.lower);
	// draw tertiarySizedForP3Field to P3Field
	//drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.center, points.focalPlane.center);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.upper, points.focalPlane.bottom);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.lower, points.focalPlane.top);
	// draw tertiarySizedForP3
	//drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.tertiarySizedForP3.upper, points.tertiarySizedForP3.lower);
	// draw tertiarySizedForP3 to focal plane
	//drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.tertiarySizedForP3.upper, points.focalPlane.center);
	//drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.tertiarySizedForP3.lower, points.focalPlane.center);
	// draw P2
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.P2.upper, points.P2.lower);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.center, points.P2.center);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.upper, points.P2.upper);
	//drawLine(context, config.canvasOpticalPathAltStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.lower, points.P2.lower);
	// draw focal plane (P3)
	//drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.focalPlane.top, points.focalPlane.bottom);

	// draw tertiary to tilted focal plane (P3)
	drawLine(context, config.canvasOpticalPathStyle, config.canvasLineWidth, points.tertiarySizedForP3Field.center, points.focalPlane2.center);
	// draw tilted focal plane (P3)
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.focalPlane2.top, points.focalPlane2.bottom);
	// draw tertiary tilted for bent focal plane to tertiary
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.tertiaryAngled.top, points.tertiaryAngled.bottom);

	/* draw dimensions...
		primary mirror to focal point P1
		primary mirror to secondary mirror
		secondary mirror to tertiary mirror
		primary mirror to P3
	*/
	dimensionY = telescopeTubeRect.y + telescopeTubeRect.height;
	// draw primary to focal point, P1
	text = config.primaryMirrorToFocalPlaneDimensionText + roundToDecimal(binoscopeModel.focalLength, config.decimalPointsDimension) + uomLengthLit;
	dimensionY += 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, points.mirror.lowerFace.x, points.primaryFocusP1.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// draw primary to secondary
	text = config.primaryMirrorToSecondaryMirrorText + roundToDecimal(binoscopeModel.primaryToSecondaryDistance, config.decimalPointsDimension) + uomLengthLit;
	dimensionY += 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, points.mirror.lowerFace.x, points.secondary.center.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// draw secondary to tertiary
	text = config.secondaryMirrorToTertiaryMirrorText + roundToDecimal(binoscopeModel.secondaryToTertiaryHorizontalLength, config.decimalPointsDimension) + uomLengthLit;
	dimensionY += 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, points.tertiarySizedForP3Field.center.x, points.secondary.center.x, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);
	// draw primary to focal plane, P3
	text = config.primaryMirrorToP3MirrorText + roundToDecimal(binoscopeModel.primaryToP3HorizontalDistance, config.decimalPointsDimension) + uomLengthLit;
	dimensionY += 4 * config.canvasDimensionHalfHeight;
	drawHorizDimen(context, text, dimensionY, points.mirror.lowerFace.x, points.mirror.lowerFace.x + scaling.primaryToP3HorizontalDistance, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

	// write results
	resultsString = 'secondary mirror: tilted at '
			+ roundToDecimal(binoscopeModel.angleSecondaryFaceToVerticalDeg, config.decimalPointsDimension)
			+ ' deg; minimum size = '
			+ roundToDecimal(binoscopeModel.secondaryMinorAxis, config.decimalPointsDimension)
			+ 'x'
			+ roundToDecimal(binoscopeModel.secondaryMajorAxis, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', minor axis x major axis'
			+ '<br>tertiary mirror:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tilted at '
			+ roundToDecimal(binoscopeModel.tertiaryAngledAtPrimaryDeg, config.decimalPointsDimension)
			+ ' deg; maximum size (fully illuminated field) = '
			+ roundToDecimal(binoscopeModel.tertiaryAngledAtMaxLengthMinorAxis, config.decimalPointsDimension)
			+ 'x'
			+ roundToDecimal(binoscopeModel.tertiaryAngledAtMaxLengthMajorAxis, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', minor axis x major axis'
			+ '<br>vertical height from secondary to tertiary = '
			+ roundToDecimal(binoscopeModel.secondaryToTertiaryVerticalLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ '<br>vertical height from tertiary to focal plane = '
			+ roundToDecimal(binoscopeModel.P3centerYLengthFromTertiaryCenter, config.decimalPointsDimension)
			+ uomLengthLit
			+ '<br>field diameter as set in the diagonal designer = '
			+ roundToDecimal(common.maxFieldDiaDiagVal(), config.decimalPointsDimension)
			+ uomLengthLit
			+ '<br>equivalent monoscope+binoviewer aperture is '
			+ roundToDecimal(binoscopeEquivalentApertureBinoviewer, config.decimalPointsAperture)
			+ uomLengthLit
			+ '; equivalent monoscope aperture for stars ranges from '
			+ roundToDecimal(binoscopeEquivalentApertureStar.low, config.decimalPointsAperture)
			+ ' to '
			+ roundToDecimal(binoscopeEquivalentApertureStar.high, config.decimalPointsAperture)
			+ uomLengthLit
			+ '; equivalent monoscope aperture for nebulosity ranges from '
			+ roundToDecimal(binoscopeEquivalentApertureNebulosity.low, config.decimalPointsAperture)
			+ ' to '
			+ roundToDecimal(binoscopeEquivalentApertureNebulosity.high, config.decimalPointsAperture)
			+ uomLengthLit;

	common.binoscopeResults().html(resultsString);
};

MLB.NewtDesigner.graphBinoscopeFrontView = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		drawLine = MLB.sharedLib.drawLine,
		fillEllipse = MLB.sharedLib.fillEllipse,
		fillRect = MLB.sharedLib.fillRect,
		rect = MLB.sharedLib.rect,
		uom = MLB.sharedLib.uom,
		uomLengthLit = common.getUomLengthLit(),
		calcEyepieceTipdownFromSecToTertTipdownAndTertBend = MLB.calcLib.calcEyepieceTipdownFromSecToTertTipdownAndTertBend,
		eyepieceTipdownFromSecToTertTipdownAndTertBend,
		canvas,
		context,
		aperture,
		apertureRadius,
		focalPointOffsetFromEdgeOfPrimary,
		IPD,
		binoscopeSecondaryAxisDownwardTiltAngleDeg,
		binoscopeSecondaryAxisDownwardTiltAngleRad,
		tertiaryBendingAngleDeg,
		focalPointXOffsetFromMirrorCenter,
		focalPointYOffsetFromMirrorCenter,
		primaryMirrorsSeparation,
		humanFaceWidthUom,
		humanFaceHeightUom,
		humanEyeToShoulderUom,
		humanShoulderWidthUom,
		humanShoulderDepthUom,
		humanNeckWidthUom,
		shoulderRect,
		neckRect,
		binoscopeModel = state.binoscopeModel,
		scalingFactor,
		scaling = {},
		points = {},
		resultsString;

	// build canvas, context
	common.binoscopeFrontViewCanvasDiv().append(buildCanvasElement('binoscopeFrontViewCanvas', state.scaling.width / 2, state.scaling.height));
	canvas = common.binoscopeFrontViewCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	// get user input vars
	aperture = common.apertureVal();
	focalPointOffsetFromEdgeOfPrimary = common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal();
	IPD = common.IPDVal();
	binoscopeSecondaryAxisDownwardTiltAngleDeg = common.binoscopeSecondaryAxisDownwardTiltAngleDegVal();
	tertiaryBendingAngleDeg = common.binoscopeTertiaryBendingAngleDegVal();

	// calc
	apertureRadius = aperture / 2;
	binoscopeSecondaryAxisDownwardTiltAngleRad = binoscopeSecondaryAxisDownwardTiltAngleDeg * uom.degToRad;
	focalPointXOffsetFromMirrorCenter = Math.cos(binoscopeSecondaryAxisDownwardTiltAngleRad) * (focalPointOffsetFromEdgeOfPrimary + apertureRadius);
	focalPointYOffsetFromMirrorCenter = Math.sin(binoscopeSecondaryAxisDownwardTiltAngleRad) * (focalPointOffsetFromEdgeOfPrimary + apertureRadius);
	primaryMirrorsSeparation = 2 * focalPointXOffsetFromMirrorCenter - aperture + common.convertMmToUom(IPD);

	eyepieceTipdownFromSecToTertTipdownAndTertBend = calcEyepieceTipdownFromSecToTertTipdownAndTertBend(tertiaryBendingAngleDeg, binoscopeSecondaryAxisDownwardTiltAngleDeg);

	humanFaceWidthUom = common.convertInchesToUom(config.humanFaceWidthInches);
	humanFaceHeightUom = common.convertInchesToUom(config.humanFaceHeightInches);
	humanEyeToShoulderUom = common.convertInchesToUom(config.humanEyeToShoulderInches);
	humanShoulderWidthUom = common.convertInchesToUom(config.humanShoulderWidthInches);
	humanShoulderDepthUom = common.convertInchesToUom(config.humanShoulderDepthInches);
	humanNeckWidthUom = common.convertInchesToUom(config.humanNeckWidthInches);

	// scaling
	scalingFactor = state.scaling.scalingFactor;
	scaling.aperture = scalingFactor * aperture;
	scaling.apertureRadius = scalingFactor * apertureRadius;
	scaling.focalPointXOffsetFromMirrorCenter = scalingFactor * focalPointXOffsetFromMirrorCenter;
	scaling.focalPointYOffsetFromMirrorCenter = scalingFactor * focalPointYOffsetFromMirrorCenter;
	scaling.primaryMirrorsSeparation = scalingFactor * primaryMirrorsSeparation;
	scaling.humanFaceWidthUom = scalingFactor * humanFaceWidthUom;
	scaling.humanFaceHeightUom = scalingFactor * humanFaceHeightUom;
	scaling.humanEyeToShoulderUom = scalingFactor * humanEyeToShoulderUom;
	scaling.humanShoulderWidthUom = scalingFactor * humanShoulderWidthUom;
	scaling.humanShoulderDepthUom = scalingFactor * humanShoulderDepthUom;
	scaling.humanNeckWidthUom = scalingFactor * humanNeckWidthUom;
	scaling.secondaryRadius = scalingFactor * binoscopeModel.secondaryMinorAxis / 2;
	scaling.tertiaryRadius = scalingFactor * binoscopeModel.tertiarySizedForP3FieldMinorAxis / 2;

	// points
	// canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
	// calc key points...
	// center of mirrors 1/3 down from top to bottom
	points.leftPrimaryMirrorCenter = point(canvas.width / 2 - scaling.primaryMirrorsSeparation / 2 - scaling.apertureRadius, canvas.height / 3);
	points.rightPrimaryMirrorCenter = point(canvas.width / 2 + scaling.primaryMirrorsSeparation / 2 + scaling.apertureRadius, canvas.height / 3);
	points.leftFocalPoint = point(points.leftPrimaryMirrorCenter.x + scaling.focalPointXOffsetFromMirrorCenter, points.leftPrimaryMirrorCenter.y + scaling.focalPointYOffsetFromMirrorCenter);
	points.rightFocalPoint = point(points.rightPrimaryMirrorCenter.x - scaling.focalPointXOffsetFromMirrorCenter, points.rightPrimaryMirrorCenter.y + scaling.focalPointYOffsetFromMirrorCenter);

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}

	// draw human adult face, shoulders
	fillEllipse(context, config.canvasHumanStyle, 2, canvas.width / 2, points.leftFocalPoint.y, scaling.humanFaceWidthUom / 2, scaling.humanFaceHeightUom / 2, 0, Math.PI * 2);
	shoulderRect = rect((canvas.width - scaling.humanShoulderWidthUom) / 2, points.leftFocalPoint.y + scaling.humanEyeToShoulderUom, scaling.humanShoulderWidthUom, scaling.humanShoulderDepthUom);
	fillRect(context, config.canvasHumanStyle, shoulderRect);
	neckRect = rect((canvas.width - scaling.humanNeckWidthUom) / 2, points.leftFocalPoint.y, scaling.humanNeckWidthUom, scaling.humanShoulderDepthUom);
	fillRect(context, config.canvasHumanStyle, neckRect);

	// draw mirrors, lines between mirror centers

	// primaries
	drawCircle(context, points.leftPrimaryMirrorCenter, scaling.apertureRadius, config.canvasLineWidth, config.canvasStructureStyle);
	drawCircle(context, points.rightPrimaryMirrorCenter, scaling.apertureRadius, config.canvasLineWidth, config.canvasStructureStyle);
	// secondaries
	drawCircle(context, points.leftPrimaryMirrorCenter, scaling.secondaryRadius, config.canvasLineWidth, config.canvasStructureStyle);
	drawCircle(context, points.rightPrimaryMirrorCenter, scaling.secondaryRadius, config.canvasLineWidth, config.canvasStructureStyle);
	// tertiaries (centered on eyes)
	drawCircle(context, points.leftFocalPoint, scaling.tertiaryRadius, config.canvasLineWidth, config.canvasStructureStyle);
	drawCircle(context, points.rightFocalPoint, scaling.tertiaryRadius, config.canvasLineWidth, config.canvasStructureStyle);
	// connect secondaries to tertiaries
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.leftPrimaryMirrorCenter, points.leftFocalPoint);
	drawLine(context, config.canvasGlassStyle, config.canvasLineWidth, points.rightPrimaryMirrorCenter, points.rightFocalPoint);

	// write results
	resultsString = 'primary mirror edges are separated by: '
			+ roundToDecimal(primaryMirrorsSeparation, config.decimalPointsDimension)
			+ uomLengthLit
			+ '<br>Eyepiece tipdown angle = '
			+ roundToDecimal(eyepieceTipdownFromSecToTertTipdownAndTertBend, config.decimalPointsDimension)
			+ ' deg';
	common.binoscopeFrontViewResults().html(resultsString);
};

MLB.NewtDesigner.graphRocker = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		CG = state.CG,
		rocker = state.rocker,
		friction = {},
		calcDobFriction = MLB.calcLib.calcDobFriction,
		materials = MLB.materialFrictionJson.materials,
		uomLengthLit = common.getUomLengthLit(),
		uomWeightLit = common.getUomWeightLit(),
		altCoF = +materials[common.altBearingMaterialsSelect().get(0).selectedIndex].friction,
		azCoF = +materials[common.azBearingMaterialsSelect().get(0).selectedIndex].friction,
		pushAngleDegFromHorizontal = config.pushAngleDegFromHorizontal,
		CGToEyepieceDistance = common.CGToEyepieceDistanceVal(),
		momentArmInches = common.convertUomToInches(CGToEyepieceDistance),
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
		roundedPadSizeSideUom,
		roundedRockerWeight,
		scalingFactor;

	scalingFactor = state.scaling.scalingFactor;
	if (!common.imperial()) {
		scalingFactor /= 25.4;
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

	frontRockerBoardOutsideWidth = telescopeTubeOD + 4 * woodThickness;
	if (frontRockerBoardOutsideWidth < azBearingDiameter) {
		frontRockerBoardOutsideWidth = azBearingDiameter;
	}

	scaledTelescopeTubeOD = scalingFactor * telescopeTubeOD;
	scaledWoodThickness = scalingFactor * woodThickness;
	scaledCGHeightToClearRockerBottomDistance = scalingFactor * CG.heightToClearRockerBottomDistance;
	scaledRockerSideLength = scalingFactor * rockerSideLength;
	scaledRockerSideHeight = scalingFactor * rockerSideHeight;
	scaledCGToBearingPointY = scalingFactor * altBearingRadius * Math.cos(altBearingSeparationHalfAngleRad);
	scaledFrontRockerBoardOutsideWidth = scalingFactor * frontRockerBoardOutsideWidth;

	// build canvas, context
	common.rockerCanvasDiv().append(buildCanvasElement('rockerCanvas', config.canvasWidth, config.canvasHeight));
	canvas = common.rockerCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;

	// canvas 0,0 is upper left; x is horizontal coordinate, y is vertical coordinate
	// calc key points
	CGPt = point(canvas.width / 6, canvas.height / 3);
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
	bearingArcLeftPt = point(CGPt.x - scalingFactor * altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad), CGPt.y + scaledCGToBearingPointY);
	bearingArcRightPt = point(CGPt.x + scalingFactor * altBearingRadius * Math.sin(altBearingSeparationHalfAngleRad), bearingArcLeftPt.y);
	bearingArcLeftIntersectWithRockerSideTopPt = point(bearingArcLeftPt.x, rockerSideBoardRect.y);
	bearingArcRightIntersectWithRockerSideTopPt = point(bearingArcRightPt.x, rockerSideBoardRect.y);
	padBoardHeight = (rockerSideBoardRect.y - bearingArcRightPt.y) / scalingFactor;

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
	if (common.chBoxAutoCalcRockerWeightChecked()) {
		rocker.weight = materialWeightUom;
	} else {
		rocker.weight = common.rockerWeightVal();
	}
	roundedRockerWeight = roundToDecimal(materialWeightUom, config.decimalPointsWeight);
	// calculate from ground, presuming ground board thickness is same as rocker base board thickness and that azimuth pads height is same as altitude bearing pad height
	rocker.eyepieceHeight = 2 * rocker.baseBoardThickness + 2 * config.padThicknessInches + CG.heightToClearRockerBottomDistance + CGToEyepieceDistance;

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
	context.arc(CGPt.x, CGPt.y, scalingFactor * altBearingRadius, uom.qtrRev - altBearingSeparationHalfAngleRad, uom.qtrRev + altBearingSeparationHalfAngleRad);
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
	text = config.rockerFrontBoardHeightText + roundToDecimal(frontRockerFrontBoardRect.height / scalingFactor, config.decimalPointsDimension) + uomLengthLit;
	dimensionX = frontRockerFrontBoardRect.endX + 4 * config.canvasDimensionHalfHeight;
	drawVertDimen(context, text, dimensionX, frontRockerFrontBoardRect.endY, frontRockerFrontBoardRect.y, config.canvasTextBorder, config.canvasLineWidth, config.canvasStructureLightStyle);

	// label views
	context.fillStyle = config.canvasStructureLightStyle;
	context.fillText(config.sideViewLit, rockerSideBoardRect.x + rockerSideBoardRect.width / 2, rockerSideBoardRect.y + rockerSideBoardRect.height / 2);
	context.fillText(config.frontViewLit, frontRockerFrontBoardRect.x + frontRockerFrontBoardRect.width / 2, frontRockerFrontBoardRect.y + frontRockerFrontBoardRect.height / 2);

	// update UI fields
	if (common.chBoxAutoCalcRockerWeightChecked()) {
		common.rockerWeight().val(roundedRockerWeight);
	}
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
			+ '<br>tube weight = '
			+ roundToDecimal(common.tubeWeightVal(), config.decimalPointsWeight)
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
			+ uomLengthLit
			+ ' x '
			+ roundedPadSizeSideUom
			+ uomLengthLit);
};

MLB.NewtDesigner.graphFlexRocker = () => {
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
		flexRockerCGToEyepieceDistance = common.flexRockerCGToEyepieceDistanceVal(),
		momentArmInches = common.convertUomToInches(flexRockerCGToEyepieceDistance),
		tubeWeightUom = common.flexRockerTubeWeightVal(),
		tubeWeightLbs = common.convertUomToLbs(tubeWeightUom),
		tubeOD = common.telescopeTubeODVal(),
		woodThickness = common.convertInchesToUom(config.woodThicknessInches),
		altBearingRadius = common.convertInchesToUom(common.flexRockerCGToBackEdgeOfTubeClearanceVal()),
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
		dimensionX,
		scalingFactor,
		roundedFlexRockerWeight;

	scalingFactor = state.scaling.scalingFactor;
	if (!common.imperial()) {
		scalingFactor /= 25.4;
	}

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
	if (common.chBoxAutoCalcFlexRockerWeightChecked()) {
		flexRocker.rocker.weightUom = common.convertLbsToUom(flexRocker.rocker.weightLbs);
	} else {
		flexRocker.rocker.weightUom = common.flexRockerWeightVal();
	}
	roundedFlexRockerWeight = roundToDecimal(flexRocker.rocker.weightUom, config.decimalPointsWeight);
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
	flexRocker.eyepieceHeight = flexRocker.CGHeight + flexRockerCGToEyepieceDistance;

	// scaled dimensions
	scaledAzInnerRadius = scalingFactor * azInnerRadius;
	scaledAzOuterRadius = scalingFactor * azOuterRadius;
	scaledAltBearingRadius = scalingFactor * altBearingRadius;
	scaledAltBearingSeparation = scalingFactor * altBearingSeparation;
	scaledAltBearingSideToSideSeparation = scalingFactor * altBearingSideToSideSeparation;
	scaledAltBearingHeight = scalingFactor * altBearingHeight;
	scaledBaseRingHeight = scalingFactor * baseRingHeight;
	scaledFlexRockerThickness = scalingFactor * flexRockerThickness;
	scaledPadSizeSideUom = scalingFactor * flexRocker.friction.padSizeSideUom;
	scaledPadThicknessUom = scalingFactor * padThicknessUom;
	scaledCGHeight = scalingFactor * flexRocker.CGHeight;

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

	// update UI fields
	if (common.chBoxAutoCalcFlexRockerWeightChecked()) {
		common.flexRockerWeight().val(roundedFlexRockerWeight);
	}
	// write results
	common.flexRockerResults().html('flex rocker dimensions = '
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
			+ ' high<br>tube weight = '
			+ roundToDecimal(common.tubeWeightVal(), config.decimalPointsWeight)
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
MLB.NewtDesigner.setEquatorialTableMaxTiltYaw = () => {
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
MLB.NewtDesigner.setEquatorialTableStandardPlatformCG = () => {
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
MLB.NewtDesigner.setEquatorialTableFlexRockerPlatformCG = () => {
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

MLB.NewtDesigner.drawFrontViewTrackingArcs = function (intersectPt, trackArc, context, style) {
	var config = MLB.NewtDesigner.config,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		leftHighBearingPt = point(intersectPt.x - trackArc.bearingHighAngleDeltaXY.x, intersectPt.y + trackArc.bearingHighAngleDeltaXY.y),
		leftBearingPt = point(intersectPt.x - trackArc.bearingAngleDeltaXY.x, intersectPt.y + trackArc.bearingAngleDeltaXY.y),
		leftLowBearingPt = point(intersectPt.x - trackArc.bearingLowAngleDeltaXY.x, intersectPt.y + trackArc.bearingLowAngleDeltaXY.y),
		leftInteriorPt = point(leftLowBearingPt.x, leftHighBearingPt.y),
		rightHighBearingPt = point(intersectPt.x + trackArc.bearingHighAngleDeltaXY.x, intersectPt.y + trackArc.bearingHighAngleDeltaXY.y),
		rightBearingPt = point(intersectPt.x + trackArc.bearingAngleDeltaXY.x, intersectPt.y + trackArc.bearingAngleDeltaXY.y),
		rightLowBearingPt = point(intersectPt.x + trackArc.bearingLowAngleDeltaXY.x, intersectPt.y + trackArc.bearingLowAngleDeltaXY.y);
		//  rightInteriorPt = point(rightLowBearingPt.x, rightHighBearingPt.y);

	// the arcs

	drawLine(context, style, config.canvasLineWidth, leftHighBearingPt, leftBearingPt);
	drawLine(context, style, config.canvasLineWidth, leftBearingPt, leftLowBearingPt);

	drawLine(context, style, config.canvasLineWidth, rightHighBearingPt, rightBearingPt);
	drawLine(context, style, config.canvasLineWidth, rightBearingPt, rightLowBearingPt);

	// the angles (just do the right side for now)

	//drawLine(context, style, config.canvasLineWidth, leftHighBearingPt, intersectPt);
	//drawLine(context, style, config.canvasLineWidth, leftLowBearingPt, intersectPt);
	drawLine(context, style, config.canvasLineWidth, rightHighBearingPt, intersectPt);
	drawLine(context, style, config.canvasLineWidth, rightLowBearingPt, intersectPt);

	// complete the arcs (just do the left side for now)
	drawLine(context, style, config.canvasLineWidth, leftHighBearingPt, leftInteriorPt);
	drawLine(context, style, config.canvasLineWidth, leftInteriorPt, leftLowBearingPt);
	//drawLine(context, style, config.canvasLineWidth, rightHighBearingPt, rightInteriorPt);
	//drawLine(context, style, config.canvasLineWidth, rightInteriorPt, rightLowBearingPt);

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

MLB.NewtDesigner.ETSideViewDrawArcExtension = function (context, style, platformX, platformY, arcLowY, compLat) {
	var config = MLB.NewtDesigner.config,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		deltaX = (arcLowY - platformY) / Math.tan(compLat);

	drawLine(context, style, config.canvasLineWidth, point(platformX, platformY), point(platformX - deltaX, arcLowY));
};

MLB.NewtDesigner.graphEquatorialTable = () => {
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
	scaledRockerSideLength = state.scaling.scalingFactor * state.rocker.length;
	scaledRockerFrontWidth = state.scaling.scalingFactor * state.rocker.width;
	scaledPlatformThickness = state.scaling.scalingFactor * platform.thickness;
	scaledETCGToPlatformBottom = state.scaling.scalingFactor * platform.CG.combined;

	// for flex rocker
	flexRockerPlatform = setEquatorialTableFlexRockerPlatformCG();
	/*
	scaledRockerSideLength = state.scaling.scalingFactor * state.flexRocker.baseRing.outerRadius * 2;
	scaledRockerFrontWidth = scaledRockerSideLength;
	scaledPlatformThickness = state.scaling.scalingFactor * state.flexRocker.baseRing.height;
	scaledETCGToPlatformBottom = state.scaling.scalingFactor * flexRockerPlatform.CG.combined;
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
	drawLine(context, config.canvasAxisStyle, config.canvasLineWidth, ETCGSidePt, southPolarPt);
	drawLine(context, config.canvasAxisStyle, config.canvasLineWidth, ETCGSidePt, northPolarPt);
	// draw azimuth axis
	drawLine(context, config.canvasAxisStyle, config.canvasLineWidth, point(ETCGSidePt.x, 0), point(ETCGSidePt.x, southPolarPt.y));
	// draw intersecting tracking axes
	drawLine(context, config.canvasFrontBearingStyle, config.canvasLineWidth, point(platformSideRect.endX, platformSideRect.endY), sideViewSouthIntersect.pt);
	drawLine(context, config.canvasBackBearingStyle, config.canvasLineWidth, point(platformSideRect.x, platformSideRect.endY), sideViewNorthIntersect.pt);

	// front view

	// platform
	drawRect(context, config.canvasStructureStyle, config.canvasLineWidth, platformFrontRect);
	// draw azimuth axis
	drawLine(context, config.canvasAxisStyle, config.canvasLineWidth, point(ETCGFrontPt.x, 0), point(ETCGFrontPt.x, southPolarPt.y));
	// draw tracking arcs
	frontViewSouthDrawnArc = drawFrontViewTrackingArcs(frontViewSouthIntersectPt, frontViewSouthTrackArc, context, config.canvasFrontBearingStyle);
	frontViewNorthDrawnArc = drawFrontViewTrackingArcs(frontViewNorthIntersectPt, frontViewNorthTrackArc, context, config.canvasBackBearingStyle);

	// return to the side view

	//after the front view's arc have been calculated, go back to the side view and complete the tracking radius arcs
	ETSideViewDrawArcExtension(context, config.canvasFrontBearingStyle, platformSideRect.endX, platformSideRect.endY, frontViewSouthDrawnArc.leftLowBearingPt.y, compLat);
	ETSideViewDrawArcExtension(context, config.canvasBackBearingStyle, platformSideRect.x, platformSideRect.endY, frontViewNorthDrawnArc.leftLowBearingPt.y, compLat);

	// label views
	context.fillStyle = config.canvasStructureLightStyle;
	context.fillText(config.centerOfGravityText + ' ' + config.sideViewLit, ETCGSidePt.x, ETCGSidePt.y);
	context.fillText(config.frontViewLit, ETCGFrontPt.x, ETCGFrontPt.y);

	// save values
	southTrack.radius = frontViewSouthTrackArc.radius / state.scaling.scalingFactor;
	southTrack.bearingSeparationAngleDeg = frontViewSouthTrackArc.bearingAngleRad * 2 / uom.degToRad;
	southTrack.arcWidth = frontViewSouthDrawnArc.width / state.scaling.scalingFactor;

	northTrack.radius = frontViewNorthTrackArc.radius / state.scaling.scalingFactor;
	northTrack.bearingSeparationAngleDeg = frontViewNorthTrackArc.bearingAngleRad * 2 / uom.degToRad;
	northTrack.arcWidth = frontViewNorthDrawnArc.width / state.scaling.scalingFactor;

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
			<input class="CGPart" id="CGPart0" value="Primary mirror" onfocus="select();" type="text">
		</td>
		<td>
			<input class="inputText" id="CGWeight0" value="" onfocus="select();" type="text">
		</td>
		<td>
			<input class="inputText" id="CGDistance0" value="" onfocus="select();" type="text">
		</td>
		<td>
			<input class="inputText" id="CGVerticalOffset0" value="" onfocus="select();" type="text">
		</td>
	</tr>
	<tr>
		<td>
			<input class="CGPart" id="CGPart1" value="Mirror mount" onfocus="select();" type="text">
		</td>
		<td>
			<input class="inputText" id="CGWeight1" value="" onfocus="select();" type="text">
		</td>
		<td>
			<input class="inputText" id="CGDistance1" value="" onfocus="select();" type="text">
		</td>
		<td>
			<input class="inputText" id="CGVerticalOffset1" value="" onfocus="select();" type="text">
		</td>
	</tr>
	...
*/
MLB.NewtDesigner.buildCGHtmlTable = () => {
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
			if (IDIx === 'part') {
				htmlStr += "        <input class='CGPart' id='" + IDV + pIx + "' value='" + pV + "' onfocus='select();' type='text'";
			} else {
				htmlStr += "        <input class='inputText' id='" + IDV + pIx + "' value='' onfocus='select();' type='text'";
			}
			htmlStr += ">\r\n";
			htmlStr += "    </td>\r\n";
		});
		htmlStr += "</tr>\r\n";
		common.CGTableBody().append(htmlStr);
	});
};

MLB.NewtDesigner.buildSpiderTypeHtmlTable = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		spiderTypesJson = MLB.spiderTypesJson.spiderTypes,
		colorRow = 0,
		htmlStr = '\r\n';

	common.spiderTypeTableBody().append(htmlStr);

	$.each(spiderTypesJson, function (i, mv) {
		if (colorRow % 2 === 0) {
			htmlStr = "<tr>";
		} else {
			htmlStr = "<tr style='background-color: " + config.spiderTypeBackgroundColor + ";'>";
		}
		htmlStr += "\r\n    ";

		$.each(mv, function (i, fv) {
			htmlStr += "<td>" + fv + "</td> ";
		});

		htmlStr += "\r\n</tr>\r\n";
		common.spiderTypeTableBody().append(htmlStr);
		colorRow += 1;
	});
};

MLB.NewtDesigner.buildTubeTypeHtmlTable = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		tubeTypesJson = MLB.tubeTypesJson.tubeTypes,
		colorRow = 0,
		htmlStr = '\r\n';

	common.tubeTypeTableBody().append(htmlStr);

	$.each(tubeTypesJson, function (i, mv) {
		if (colorRow % 2 === 0) {
			htmlStr = "<tr>";
		} else {
			htmlStr = "<tr style='background-color: " + config.tubeTypeBackgroundColor + ";'>";
		}
		htmlStr += "\r\n    ";

		$.each(mv, function (i, fv) {
			htmlStr += "<td>" + fv + "</td> ";
		});

		htmlStr += "\r\n</tr>\r\n";
		common.tubeTypeTableBody().append(htmlStr);
		colorRow += 1;
	});
};

/*
depends on mountType.js being constructed 'just so';

"<tr>
	<td>AltAlt</td> <td>Geographic</td> <td>yes</td> <td>no</td> <td>no</td> <td>no</td> <td>no</td> <td>Horizontal yoke</td>
</tr>
"
"<tr style='background-color: NavajoWhite;'>
	<td>Altaz</td> <td>Geographic</td> <td>yes</td> <td>no</td> <td>yes</td> <td>no</td> <td>no</td> <td>The Dobsonian</td>
</tr>
"
*/
MLB.NewtDesigner.buildMountTypeHtmlTable = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		mountTypesJson = MLB.mountTypesJson.mountTypes,
		colorRow = 0,
		htmlStr = '\r\n';

	common.mountTypeTableBody().append(htmlStr);

	$.each(mountTypesJson, function (i, mv) {
		// section title background clear, otherwise alternate colored background
		if (mv.mountType.indexOf(config.categoryNameChar) > -1) {
			colorRow = 0;
		}
		if (colorRow % 2 === 0) {
			htmlStr = "<tr>";
		} else {
			htmlStr = "<tr style='background-color: " + config.mountTypeBackgroundColor + ";'>";
		}
		htmlStr += "\r\n    ";

		$.each(mv, function (fIx, fv) {
			if (fIx !== config.fieldToIgnore) {
				htmlStr += "<td>" + fv + "</td> ";
			}
		});

		htmlStr += "\r\n</tr>\r\n";
		common.mountTypeTableBody().append(htmlStr);
		colorRow += 1;
	});
};

MLB.NewtDesigner.fillSpiderTypeSelections = () => {
	var common = MLB.NewtDesigner.common,
		spiderTypesJson = MLB.spiderTypesJson.spiderTypes,
		optionStr;

	// fill spider type selection table rows
	$.each(spiderTypesJson, function (i, v) {
		optionStr = '<option value="' + v.spiderType + '">' + v.spiderType + '</option>';
		common.spiderTypeSelect().append(optionStr);
	});
};

MLB.NewtDesigner.fillTubeTypeSelections = () => {
	var common = MLB.NewtDesigner.common,
		tubeTypesJson = MLB.tubeTypesJson.tubeTypes,
		optionStr;

	// fill tube type selection table rows
	$.each(tubeTypesJson, function (i, v) {
		optionStr = '<option value="' + v.tubeType + '">' + v.tubeType + '</option>';
		common.tubeTypeSelect().append(optionStr);
	});
};

// based on starting default hard coded 10" f/5 example
MLB.NewtDesigner.fillMountTypeSelections = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		mountTypesJson = MLB.mountTypesJson.mountTypes,
		optionStr;

	// fill mount type selection table rows
	$.each(mountTypesJson, function (i, v) {
		if (v.mountType.indexOf(config.categoryNameChar) === -1) {
			optionStr = '<option value="' + v.mountType + '">' + v.mountType + '</option>';
			common.mountTypeSelect().append(optionStr);
		}
	});
};

// based on starting default hard coded 10" f/5 example
MLB.NewtDesigner.seedCGTable = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		CGIxs = config.CGIxs,
		weights = config.weights,
		verticalOffsetsInches = config.verticalOffsetsInches,
		CGIDs = config.CGIDs;

	// set weights, one for each value in the weights array
	$('[id=' + CGIDs.weight + CGIxs.mirrorMount + ']').val(weights.mirrorMount);
	$('[id=' + CGIDs.weight + CGIxs.tube + ']').val(weights.tube);
	$('[id=' + CGIDs.weight + CGIxs.altitudeBearings + ']').val(weights.altitudeBearings);
	$('[id=' + CGIDs.weight + CGIxs.focuser + ']').val(weights.focuser);
	$('[id=' + CGIDs.weight + CGIxs.diagonal + ']').val(weights.diagonal);
	$('[id=' + CGIDs.weight + CGIxs.spider + ']').val(weights.spider);
	$('[id=' + CGIDs.weight + CGIxs.eyepiece + ']').val(weights.eyepiece);

	// set distances for primary mirror and cell (negative because these are behind the primary mirror's front edge, which is the reference point or '0')
	$('[id=' + CGIDs.distance + CGIxs.primaryMirror + ']').val(roundToDecimal(-common.convertInchesToUom(state.mirrorEdgeThicknessInches) / 2, config.decimalPointsCG));
	$('[id=' + CGIDs.distance + CGIxs.mirrorMount + ']').val(roundToDecimal(-common.convertInchesToUom(state.mirrorEdgeThicknessInches + config.primaryMirrorCellThicknessInches / 2), config.decimalPointsCG));

	// set vertical offsets
	$('[id=' + CGIDs.verticalOffset + CGIxs.altitudeBearings + ']').val(roundToDecimal(common.convertInchesToUom(verticalOffsetsInches.altitudeBearings), config.decimalPointsCG));
	$('[id=' + CGIDs.verticalOffset + CGIxs.focuser + ']').val(roundToDecimal(common.convertInchesToUom(verticalOffsetsInches.focuser), config.decimalPointsCG));
	$('[id=' + CGIDs.verticalOffset + CGIxs.eyepiece + ']').val(roundToDecimal(common.convertInchesToUom(verticalOffsetsInches.eyepiece), config.decimalPointsCG));
};

// not currently called
MLB.NewtDesigner.updateCGDistances = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		telescopeFocalLength = common.telescopeFocalLengthVal(),
		focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
		CGIxs = config.CGIxs,
		ixs = [CGIxs.focuser, CGIxs.diagonal, CGIxs.spider, CGIxs.finder, CGIxs.eyepiece],
		distance;

	// set distance for upper end items
	distance = roundToDecimal(telescopeFocalLength - focalPlaneToDiagDistance, config.decimalPointsCG);
	$.each(ixs, function (i, v) {
		$('[id=CGDistance' + v + ']').val(distance);
	});
	// set distance for tube
	distance = roundToDecimal(common.apertureVal() * common.focalRatioVal() / 2, config.decimalPointsCG);
	$('[id=CGDistance' + config.CGIxs.tube + ']').val(distance);
};

MLB.NewtDesigner.calcCGSensitivity = () => {
	var state = MLB.NewtDesigner.state,
		common = MLB.NewtDesigner.common,
		telescopeFocalLength = common.telescopeFocalLengthVal(),
		focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
		CG = state.CG,
		// either 1 lb or 1 kg
		weightToAdd = 1;

	return (CG.weight * CG.CG + weightToAdd * (telescopeFocalLength - focalPlaneToDiagDistance)) / (CG.weight + weightToAdd) - CG.CG;
};

MLB.NewtDesigner.calcCG = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		common = MLB.NewtDesigner.common,
		config = MLB.NewtDesigner.config,
		aperture = common.apertureVal(),
		telescopeFocalLength = common.telescopeFocalLengthVal(),
		focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
		CG = state.CG,
		calcCGSensitivity = MLB.NewtDesigner.calcCGSensitivity,
		weightElements,
		distanceElements,
		verticalOffsetElements,
		weight,
		distance,
		distances,
		minDistance,
		momentArm,
		totalWeight = 0,
		totalMomentArm = 0,
		verticalOffset,
		verticalOffsetMomentArm,
		verticalOffsetTotalMomentArm = 0,
		uomLengthLit = common.getUomLengthLit(),
		uomWeightLit = common.getUomWeightLit(),
		weightPerSquareAreaLit = common.getWeightPerSquareAreaLit();

	weightElements = common.weightElements();
	distanceElements = common.distanceElements();
	verticalOffsetElements = common.verticalOffsetElements();

	weightElements.each(function (i, v) {
		weight = parseFloat(v.value);
		if (!isNaN(weight)) {
			totalWeight += weight;

			distance = parseFloat(distanceElements[i].value);
			if (!isNaN(distance)) {
				momentArm = weight * distance;
				totalMomentArm += momentArm;
			}

			verticalOffset = parseFloat(verticalOffsetElements[i].value);
			if (!isNaN(verticalOffset)) {
				verticalOffsetMomentArm = weight * verticalOffset;
				verticalOffsetTotalMomentArm += verticalOffsetMomentArm;
			}
		}
	});
	CG.CG = totalMomentArm / totalWeight;
	CG.weight = totalWeight;
	CG.psi = totalWeight / (aperture * aperture / 4 * Math.PI);
	// if metric, convert from kg per mm^2 to kg to cm^2
	if (!common.imperial()) {
		CG.psi *= 100;
	}
	CG.sensitivity = calcCGSensitivity();

	distances = distanceElements.map((ix, de) => {
		var v = parseFloat(de.value);
		if (!isNaN(v)) {
			return v;
		}
	});
	minDistance = Math.min(...distances);
	CG.heightToClearRockerBottomDistance = Math.sqrt(Math.pow(common.telescopeTubeODVal() / 2, 2) + Math.pow(CG.CG - minDistance, 2));

	// update fields for friction of movement
	common.CGToEyepieceDistance().val(roundToDecimal(telescopeFocalLength - focalPlaneToDiagDistance - CG.CG, config.decimalPointsCG));
	common.tubeWeight().val(roundToDecimal(totalWeight, config.decimalPointsCG));
	common.flexRockerCGToEyepieceDistance().val(common.CGToEyepieceDistanceVal());
	common.flexRockerTubeWeight().val(common.tubeWeightVal());
	//common.flexRockerCGToBackEdgeOfTubeClearance().val(roundToDecimal(CG.heightToClearRockerBottomDistance, config.decimalPointsCG));

	common.CGResults().html('Total weight = '
			+ roundToDecimal(totalWeight, config.decimalPointsWeight)
			+ uomWeightLit
			+ ' (weight per mirror square area = '
			+ roundToDecimal(CG.psi, config.decimalPointsPressurePerArea)
			+ weightPerSquareAreaLit
			+ ')<br>CG = '
			+ roundToDecimal(CG.CG, config.decimalPointsCG)
			+ uomLengthLit
			+ '<br>vertical offset = '
			+ roundToDecimal(verticalOffsetTotalMomentArm / totalWeight, config.decimalPointsCG)
			+ uomLengthLit
			+ ' (positive is up, negative is down)<br>Sensitivity: CG changes by '
			+ roundToDecimal(CG.sensitivity, config.decimalPointsCG)
			+ uomLengthLit
			+ ' for a 1 '
			+ uomWeightLit
			+ ' change at the eyepiece<br>CG to eyepiece distance = '
			+ common.CGToEyepieceDistanceVal()
			+ uomLengthLit
			+ '<br>CG to back corner of telescope tube based on most minimum distance (distance needed for tube to clear rocker bottom) = '
			+ roundToDecimal(CG.heightToClearRockerBottomDistance, config.decimalPointsCG)
			+ uomLengthLit);
};

MLB.NewtDesigner.updateCGFieldsDependentOnFocalLength = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic,
		sagitta,
		aperture = common.apertureVal(),
		focalRatio = common.focalRatioVal(),
		focalPlaneToDiagDistance = common.focalPlaneToDiagDistanceVal(),
		focalLength = common.telescopeFocalLengthVal(),
		focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter;

	sagitta = calcSagittaParabolic(aperture, focalRatio);
	focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter = focalLength - focalPlaneToDiagDistance - sagitta;
	// update focuser, diagonal, spider, eyepiece and tube CG distances
	$('[id=CGDistance' + config.CGIxs.focuser + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
	$('[id=CGDistance' + config.CGIxs.diagonal + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
	$('[id=CGDistance' + config.CGIxs.spider + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
	$('[id=CGDistance' + config.CGIxs.eyepiece + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter, config.decimalPointsDimension));
	$('[id=CGDistance' + config.CGIxs.tube + ']').val(roundToDecimal(focuserDiagonalSpiderEyepieceDistanceToMirrorFrontCenter / 2, config.decimalPointsDimension));
};

// factors determined empirically by inspecting 4" F2, F12 and 40" F2, F12
MLB.NewtDesigner.setScalingFactorBasedOnFocalLength = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		aperture = common.apertureVal(),
		focalLength = common.telescopeFocalLengthVal(),
		scalingFactor = MLB.calcLib.scalingFactor;

	state.scaling = scalingFactor(config.canvasWidth, config.canvasHeight, focalLength * 1.5, aperture * 2.5, config.canvasBorder);
};

MLB.NewtDesigner.UpdateRadianceFlux = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		aperture = common.apertureVal(),
		focalRatio = common.focalRatioVal(),
		radianceFlux = aperture * aperture / (focalRatio * focalRatio);

	common.RadianceFluxlabel().html(roundToDecimal(radianceFlux, config.decimalPointsRadiance));
};

MLB.NewtDesigner.updateFieldsDependentOnApertureSubr = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		UpdateRadianceFlux = MLB.NewtDesigner.UpdateRadianceFlux,
		calcMirrorWeight = MLB.calcLib.calcMirrorWeight,
		aperture = common.apertureVal(),
		apertureInches = common.apertureInchesVal(),
		focalRatio = common.focalRatioVal(),
		newTubeOD,
		conversionFactor,
		mirrorWeightLbs,
		mirrorWeightUom,
		limitingMagnitude = MLB.calcLib.limitingMagnitude,
		highMagnitudeLimit,
		setBinoscopeFocalPlaneToSecondaryDistanceToMinimum = MLB.NewtDesigner.setBinoscopeFocalPlaneToSecondaryDistanceToMinimum;

	UpdateRadianceFlux();

	highMagnitudeLimit = limitingMagnitude(apertureInches);
	common.limitingMagnitude().val(roundToDecimal(highMagnitudeLimit, config.decimalPointsMagnitude));

	newTubeOD = aperture + common.telescopeTubeThicknessVal() * 2 + common.maxFieldDiaDiagVal();
	conversionFactor = common.convertLbsToUom(config.glassPoundsPerCubicInch);

	mirrorWeightLbs = calcMirrorWeight(apertureInches, focalRatio, state.mirrorEdgeThicknessInches, state.isMeniscus);
	mirrorWeightUom = common.convertLbsToUom(mirrorWeightLbs);

	setBinoscopeFocalPlaneToSecondaryDistanceToMinimum();

	// keep the same focal plane to diagonal spacing relative to aperture
	common.focalPlaneToDiagDistance().val(roundToDecimal(common.focalPlaneToDiagDistanceVal() + (aperture - state.lastApertureForFocalPlaneToDiagDistance) / 2, config.decimalPointsDiag));
	common.telescopeTubeOD().val(roundToDecimal(newTubeOD, config.decimalPointsTube));
	$('[id=' + config.CGIDs.weight + config.CGIxs.primaryMirror + ']').val(roundToDecimal(mirrorWeightUom, config.decimalPointsCG));
};

MLB.NewtDesigner.updateFieldsDependentOnFocalRatio = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		updateFieldsDependentOnApertureSubr = MLB.NewtDesigner.updateFieldsDependentOnApertureSubr,
		setScalingFactorBasedOnFocalLength = MLB.NewtDesigner.setScalingFactorBasedOnFocalLength,
		updateCGFieldsDependentOnFocalLength = MLB.NewtDesigner.updateCGFieldsDependentOnFocalLength,
		UpdateRadianceFlux = MLB.NewtDesigner.UpdateRadianceFlux,
		updateCurrentlySelectedDesigner = MLB.NewtDesigner.updateCurrentlySelectedDesigner,
		aperture,
		telescopeFocalLength,
		calcDiag = MLB.NewtDesigner.calcDiag,
		propogateDiagToDesigners = MLB.NewtDesigner.propogateDiagToDesigners;

	if (common.lockFocalLength()) {
		aperture = roundToDecimal(common.telescopeFocalLengthVal() / common.focalRatioVal(), config.decimalPointsAperture);
		common.aperture().val(aperture);
		common.sliderAperture().val(aperture);

		updateFieldsDependentOnApertureSubr();
	} else {
		telescopeFocalLength = roundToDecimal(common.focalRatioVal() * common.apertureVal(), config.decimalPointsTelescopeFocalLength);
		common.telescopeFocalLength().val(telescopeFocalLength);
		common.sliderTelescopeFocalLength().val(telescopeFocalLength);

		setScalingFactorBasedOnFocalLength();
		UpdateRadianceFlux();
		updateCGFieldsDependentOnFocalLength();
	}

	calcDiag();
	propogateDiagToDesigners();

	// each baffle designer, if selected, updates values dependent on focal ratio updated in updateCurrentlySelectedDesigner()
	updateCurrentlySelectedDesigner();
};

MLB.NewtDesigner.updateFieldsDependentOnAperture = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		updateFieldsDependentOnApertureSubr = MLB.NewtDesigner.updateFieldsDependentOnApertureSubr,
		setScalingFactorBasedOnFocalLength = MLB.NewtDesigner.setScalingFactorBasedOnFocalLength,
		updateCGFieldsDependentOnFocalLength = MLB.NewtDesigner.updateCGFieldsDependentOnFocalLength,
		updateCurrentlySelectedDesigner = MLB.NewtDesigner.updateCurrentlySelectedDesigner,
		aperture = common.apertureVal(),
		focalRatio,
		telescopeFocalLength,
		calcDiag = MLB.NewtDesigner.calcDiag,
		propogateDiagToDesigners = MLB.NewtDesigner.propogateDiagToDesigners;

	if (common.lockFocalLength()) {
		focalRatio = roundToDecimal(common.telescopeFocalLengthVal() / aperture, config.decimalPointsFocalRatio);
		common.focalRatio().val(focalRatio);
		common.sliderFocalRatio().val(focalRatio);
	} else {
		telescopeFocalLength = roundToDecimal(aperture * common.focalRatioVal(), config.decimalPointsTelescopeFocalLength);
		common.telescopeFocalLength().val(telescopeFocalLength);
		common.sliderTelescopeFocalLength().val(telescopeFocalLength);

		updateFieldsDependentOnApertureSubr();

		setScalingFactorBasedOnFocalLength();
		updateCGFieldsDependentOnFocalLength();
	}
	state.lastApertureForFocalPlaneToDiagDistance = aperture;
	// discard user set mirror support point value here: only place where this occurs
	state.mirrorSupportPoints = undefined;

	calcDiag();
	propogateDiagToDesigners();

	// each baffle designer, if selected, updates values dependent on aperture updated in updateCurrentlySelectedDesigner()
	updateCurrentlySelectedDesigner();
};

// does not update interdependent UI components whose change calls this function
MLB.NewtDesigner.updateFieldsDependentOnTelescopeFocalLength = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		setScalingFactorBasedOnFocalLength = MLB.NewtDesigner.setScalingFactorBasedOnFocalLength,
		updateCGFieldsDependentOnFocalLength = MLB.NewtDesigner.updateCGFieldsDependentOnFocalLength,
		updateCurrentlySelectedDesigner = MLB.NewtDesigner.updateCurrentlySelectedDesigner,
		focalRatio,
		calcDiag = MLB.NewtDesigner.calcDiag,
		propogateDiagToDesigners = MLB.NewtDesigner.propogateDiagToDesigners;

	focalRatio = roundToDecimal(common.telescopeFocalLengthVal() / common.apertureVal(), config.decimalPointsFocalRatio);
	common.focalRatio().val(focalRatio);
	common.sliderFocalRatio().val(focalRatio);

	setScalingFactorBasedOnFocalLength();
	updateCGFieldsDependentOnFocalLength();

	calcDiag();
	propogateDiagToDesigners();

	// each baffle designer, if selected, updates values dependent on focal length updated in updateCurrentlySelectedDesigner()
	updateCurrentlySelectedDesigner();
};

// for aperture, etendue, focal ratio calculator

MLB.NewtDesigner.updateAEF = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		eyepiecesJson = MLB.eyepiecesJson,
		buildEyepieceString = MLB.NewtDesigner.buildEyepieceString,
		calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil = MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil,
		calcFocalRatioFromAperture_FOV_EyepieceFieldStop = MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop,
		calcEtendue = MLB.calcLib.calcEtendue,
		uomLengthLit = common.getUomLengthLit(),
		eyepieceSelect = common.AEFEyepieceSelectVal(),
		eyepieceStr,
		eyepiece,
		useComaCorrector = common.useAEFComaCorrectorMagnificationVal(),
		commaCorrectorMagnificationFactor = useComaCorrector
				? common.AEFComaCorrectorMagVal()
				: 1,
		eyePupilmm = common.AEFPupilVal(),
		FOVdeg = common.AEFFOVDegVal(),
		aperture,
		focalRatio,
		etendue;

	// set eyepiece
	$.each(eyepiecesJson.eyepieces, function (i, v) {
		eyepieceStr = buildEyepieceString(v);
		if (eyepieceSelect === eyepieceStr) {
			eyepiece = v;
		}
	});

	aperture = calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil(FOVdeg, +eyepiece.focalLengthmm, +eyepiece.fieldStopmm, eyePupilmm) / commaCorrectorMagnificationFactor;
	focalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop(common.convertUomToInches(aperture), FOVdeg, +eyepiece.fieldStopmm) / commaCorrectorMagnificationFactor;
	// etendue is in cm^2deg^2
	etendue = calcEtendue(common.convertUomToMm(aperture) / 10, FOVdeg);
	common.AEFResultsLabel().html('Calculated aperture = '
			+ roundToDecimal(aperture, config.decimalPointsAperture)
			+ uomLengthLit
			+ '<br>focal ratio = '
			+ roundToDecimal(focalRatio, config.decimalPointsFocalRatio)
			+ (commaCorrectorMagnificationFactor > 1
				? ' (effective focal ratio with coma corrector = '
						+ roundToDecimal(focalRatio * commaCorrectorMagnificationFactor, config.decimalPointsFocalRatio)
						+ ')'
				: '')
			+ '<br>etendue = '
			+ roundToDecimal(etendue, config.decimalPointsEtendue)
			+ config.etendueLit);
};

MLB.NewtDesigner.setAEFSelectedComaCorrector = function (comaCorrectorsIx) {
	var common = MLB.NewtDesigner.common,
		comaCorrectorsJson = MLB.comaCorrectorsJson,
		comaCorrector = comaCorrectorsJson.comaCorrectors[comaCorrectorsIx];

	common.AEFComaCorrectorMag().val(comaCorrector.magnification);
};

MLB.NewtDesigner.setSelectedComaCorrector = function (comaCorrectorsIx, comaCorrectorMagField) {
	var comaCorrectorsJson = MLB.comaCorrectorsJson,
		comaCorrector = comaCorrectorsJson.comaCorrectors[comaCorrectorsIx];

	comaCorrectorMagField().val(comaCorrector.magnification);
};

MLB.NewtDesigner.getEyepieceCCMag = (manufacturer, type, focalLengthmm) => {
	var eyepiecesJson = MLB.eyepiecesJson;

	for (const e of eyepiecesJson.eyepieces) {
		if (e.manufacturer === manufacturer && e.type === type && e.focalLengthmm === focalLengthmm) {
			return e.CCMag;
		}
	}

	return '';
};

MLB.NewtDesigner.updateEyepieceOptimizerRows = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
		calcLimitingMagnitudeFromPupil = MLB.NewtDesigner.calcLimitingMagnitudeFromPupil,
		convertApertureToCm = MLB.NewtDesigner.convertApertureToCm,
		getEyepieceCCMag = MLB.NewtDesigner.getEyepieceCCMag,
		calcEtendue = MLB.calcLib.calcEtendue,
		resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
		calcGreaterComaWithComaCorrector = MLB.calcLib.calcGreaterComaWithComaCorrector,
		limitingMagnitude = MLB.calcLib.limitingMagnitude,
		apertureInches = common.apertureInchesVal(),
		focalRatio = common.focalRatioVal(),
		highMagnitudeLimit = limitingMagnitude(apertureInches),
		comaCorrectorMag,
		CCMag,
		manufacturer,
		type,
		eyepieceFocalLengthmm,
		eyepieceFieldStopmm,
		exitPupil,
		resultFOV,
		magnification,
		magnificationPerInch,
		resolutionArcsec,
		magnitudeLimit,
		etendue,
		coma,
		ix;

	// update eye pupil, true field of view, magnification, resolution, magnitude limit, etendue and coma for each eyepiece row that's been selected
	for (ix = 0; ix < config.maxEyepieceRows; ix += 1) {
		if (state.eyeOptRowSet[ix]) {
			// get reused vars from page
			manufacturer = common.tableElement(config.EyeOptManufacturerID, ix).html();
			type = common.tableElement(config.EyeOptTypeID, ix).html();
			eyepieceFocalLengthmm = parseFloat(common.tableElement(config.EyeOptFocalLengthID, ix).html());
			eyepieceFieldStopmm = parseFloat(common.tableElement(config.EyeOptFieldStopID, ix).html());
			comaCorrectorMag = getComaCorrectorMagnificationFactor();
			// get CCMag, if any, from eyepiece data then use it in place of the program wide coma corrector magnification factor
			CCMag = getEyepieceCCMag(manufacturer, type, eyepieceFocalLengthmm.toString());
			if (CCMag != '') {
				comaCorrectorMag = +CCMag;
			}
			// calc
			magnification = apertureInches * focalRatio / eyepieceFocalLengthmm * 25.4 * comaCorrectorMag;
			magnificationPerInch = focalRatio / eyepieceFocalLengthmm * 25.4 * comaCorrectorMag;
			resolutionArcsec = resolutionFromAperture_Magnification(apertureInches, magnification);
			// ensure that focal ratio has been calculated and updated prior
			resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(apertureInches, focalRatio, eyepieceFieldStopmm, comaCorrectorMag);
			exitPupil = eyepieceFocalLengthmm / focalRatio / comaCorrectorMag;
			magnitudeLimit = calcLimitingMagnitudeFromPupil(highMagnitudeLimit, exitPupil);
			// resultFOV already includes coma corrector magnification factor
			etendue = calcEtendue(convertApertureToCm(), resultFOV);
			coma = calcGreaterComaWithComaCorrector(eyepieceFieldStopmm, focalRatio, common.useComaCorrectorMagnificationVal());
			// display
			common.tableElement(config.EyeOptExitPupilID, ix).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + config.mmLitNS);
			common.tableElement(config.EyeOptFOVID, ix).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + config.degLitNS);
			common.tableElement(config.EyeOptMagnificationID, ix).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
			common.tableElement(config.EyeOptMagnificationPerInchID, ix).html(roundToDecimal(magnificationPerInch, config.decimalPointsMagnification) + 'x/inch');
			common.tableElement(config.EyeOptResolutionID, ix).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');
			common.tableElement(config.EyeOptLimitingMagnitudeID, ix).html(roundToDecimal(magnitudeLimit, config.decimalPointsLimitingMagnitude));
			common.tableElement(config.EyeOpEtendueID, ix).html(roundToDecimal(etendue, config.decimalPointsEtendue) /*+ config.etendueLit*/ );
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
		getEyepieceCCMag = MLB.NewtDesigner.getEyepieceCCMag,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		resolutionFromAperture_Magnification = MLB.calcLib.resolutionFromAperture_Magnification,
		calcGreaterComaWithComaCorrector = MLB.calcLib.calcGreaterComaWithComaCorrector,
		calcLimitingMagnitudeFromPupil = MLB.NewtDesigner.calcLimitingMagnitudeFromPupil,
		convertApertureToCm = MLB.NewtDesigner.convertApertureToCm,
		calcEtendue = MLB.calcLib.calcEtendue,
		limitingMagnitude = MLB.calcLib.limitingMagnitude,
		getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
		comaCorrectorMag = getComaCorrectorMagnificationFactor(),
		focalRatio = common.focalRatioVal(),
		aperture = common.apertureVal(),
		apertureInches = common.apertureInchesVal(),
		CCMag,
		magnification,
		magnificationPerInch,
		resolutionArcsec,
		resultFOV,
		exitPupil,
		highMagnitudeLimit,
		magnitudeLimit,
		etendue,
		coma;

	// get CCMag, if any, from eyepiece data then use it in place of the program wide coma corrector magnification factor
	CCMag = getEyepieceCCMag(eyepiece.manufacturer, eyepiece.type, eyepiece.focalLengthmm);
	if (CCMag != '') {
		comaCorrectorMag = +CCMag;
	}
	magnification = aperture * focalRatio / +eyepiece.focalLengthmm * 25.4 * comaCorrectorMag;
	magnificationPerInch = focalRatio / +eyepiece.focalLengthmm * 25.4 * comaCorrectorMag;
	resolutionArcsec = resolutionFromAperture_Magnification(aperture, magnification);
	resultFOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(aperture, focalRatio, +eyepiece.fieldStopmm, comaCorrectorMag);
	exitPupil = +eyepiece.focalLengthmm / focalRatio / comaCorrectorMag;
	highMagnitudeLimit = limitingMagnitude(apertureInches);
	magnitudeLimit = calcLimitingMagnitudeFromPupil(highMagnitudeLimit, exitPupil);
	// resultFOV already includes coma corrector magnification factor
	etendue = calcEtendue(convertApertureToCm(), resultFOV);
	coma = calcGreaterComaWithComaCorrector(+eyepiece.fieldStopmm, focalRatio, common.useComaCorrectorMagnificationVal());

	common.tableElement(config.EyeOptManufacturerID, idIx).html(eyepiece.manufacturer);
	common.tableElement(config.EyeOptTypeID, idIx).html(eyepiece.type);
	common.tableElement(config.EyeOptFocalLengthID, idIx).html(roundToDecimal(+eyepiece.focalLengthmm, config.decimalPointsEyepieceFL) + config.mmLitNS);
	common.tableElement(config.EyeOptFieldStopID, idIx).html(roundToDecimal(+eyepiece.fieldStopmm, config.decimalPointsEyepieceFieldStop) + config.mmLitNS);
	common.tableElement(config.EyeOptExitPupilID, idIx).html(roundToDecimal(exitPupil, config.decimalPointsEyePupil) + config.mmLitNS);
	common.tableElement(config.EyeOptApparentFieldID, idIx).html(roundToDecimal(+eyepiece.apparentField, config.decimalPointsEyepieceApparentFOV) + config.degLitNS);
	common.tableElement(config.EyeOptFOVID, idIx).html(roundToDecimal(resultFOV, config.decimalPointsFOV) + config.degLitNS);
	common.tableElement(config.EyeOptMagnificationID, idIx).html(roundToDecimal(magnification, config.decimalPointsMagnification) + 'x');
	common.tableElement(config.EyeOptMagnificationPerInchID, idIx).html(roundToDecimal(magnificationPerInch, config.decimalPointsMagnification) + 'x/inch');
	common.tableElement(config.EyeOptResolutionID, idIx).html(roundToDecimal(resolutionArcsec, config.decimalPointsResolution) + '"');
	common.tableElement(config.EyeOptLimitingMagnitudeID, idIx).html(roundToDecimal(magnitudeLimit, config.decimalPointsLimitingMagnitude));
	common.tableElement(config.EyeOpEtendueID, idIx).html(roundToDecimal(etendue, config.decimalPointsEtendue) /*+ config.etendueLit*/ );
	common.tableElement(config.EyeOptComaID, idIx).html(roundToDecimal(coma, config.decimalPointsComaRMS) + config.comaRMSLit);

	state.eyeOptRowSet[idIx] = true;
};

MLB.NewtDesigner.calcEyepieceWidestFieldForEyePupil = function (focalRatio, apertureInches, maxPupil) {
	var eyepiecesJson = MLB.eyepiecesJson,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
		widestFOV,
		pupilWidestFOV,
		bestIx;

	$.each(eyepiecesJson.eyepieces, function (i, e) {
		var comaCorrectorMag = getComaCorrectorMagnificationFactor(),
			getEyepieceCCMag = MLB.NewtDesigner.getEyepieceCCMag,
			CCMag,
			FOV,
			eyePupil;

		// get CCMag, if any, from eyepiece data then use it in place of the program wide coma corrector magnification factor
		CCMag = getEyepieceCCMag(e.manufacturer, e.type, e.focalLengthmm);
		if (CCMag != '') {
			comaCorrectorMag = +CCMag;
		}
		FOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(apertureInches, focalRatio, +e.fieldStopmm, comaCorrectorMag);
		eyePupil = calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(apertureInches, FOV, +e.focalLengthmm, +e.fieldStopmm);
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

MLB.NewtDesigner.listWidestFieldEyepieces = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		eyepiecesJson = MLB.eyepiecesJson,
		buildEyepieceString = MLB.NewtDesigner.buildEyepieceString,
		calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor,
		calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = MLB.calcLib.calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop,
		getComaCorrectorMagnificationFactor = MLB.NewtDesigner.getComaCorrectorMagnificationFactor,
		focalRatio = common.focalRatioVal(),
		apertureInches = common.apertureInchesVal(),
		maxPupil = common.eyePupilmmVal(),
		widestFieldEyepieces = [],
		topCount = config.widestEyepieceFOVTopCount,
		topWidestFieldEyepieces,
		mappedTop,
		mappedTopStr;

	$.each(eyepiecesJson.eyepieces, function (i, e) {
		var comaCorrectorMag = getComaCorrectorMagnificationFactor(),
			getEyepieceCCMag = MLB.NewtDesigner.getEyepieceCCMag,
			CCMag,
			FOV,
			eyePupil,
			magnification;

		// get CCMag, if any, from eyepiece data then use it in place of the program wide coma corrector magnification factor
		CCMag = getEyepieceCCMag(e.manufacturer, e.type, e.focalLengthmm);
		if (CCMag != '') {
			comaCorrectorMag = +CCMag;
		}
		FOV = calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor(apertureInches, focalRatio, +e.fieldStopmm, comaCorrectorMag);
		eyePupil = calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop(apertureInches, FOV, +e.focalLengthmm, +e.fieldStopmm);
		magnification = apertureInches * focalRatio * comaCorrectorMag / +e.focalLengthmm * 25.4;
		if (eyePupil <= maxPupil) {
			widestFieldEyepieces.push({'FOV': FOV, 'pupil': eyePupil, 'magnification': magnification, 'eyepiece': e});
		}
	});
	widestFieldEyepieces.sort(function(x, y) {
		return y.FOV - x.FOV;
	});
	topWidestFieldEyepieces = widestFieldEyepieces.slice(0, topCount);
	mappedTop = topWidestFieldEyepieces.map(e => ({'FOV': e.FOV,
			'pupil': e.pupil,
			'magnification': e.magnification,
			'eyepiece': buildEyepieceString(e.eyepiece)
	}));
	mappedTopStr = 'Top ' + topCount + ' widest field eyepieces not to exceed pupil of ' + maxPupil + 'mm:\n\n';
	mappedTop.forEach(e => {mappedTopStr += roundToDecimal(e.FOV, 2)
			+ 'deg; '
			+ roundToDecimal(e.pupil, config.decimalPointsEyePupil)
			+ 'mm; '
			+ roundToDecimal(e.magnification, config.decimalPointsMagnification)
			+ 'X; '
			+ e.eyepiece
			+ '\n';});
	alert(mappedTopStr);
};

MLB.NewtDesigner.findWidestFieldEyepiece = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcEyepieceWidestFieldForEyePupil = MLB.NewtDesigner.calcEyepieceWidestFieldForEyePupil,
		focalRatio = common.focalRatioVal(),
		apertureInches = common.apertureInchesVal(),
		maxPupil = common.eyePupilmmVal(),
		bestEyepiece = calcEyepieceWidestFieldForEyePupil(focalRatio, apertureInches, maxPupil);

	common.widestEyepiecesForEyePupilLabel().html(config.bestEyepieceLit
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

	// make button visible that copies selected eyepiece to eyepiece table
	common.btnCopySelectedEyepieceToEyepieceTable().show();
};

MLB.NewtDesigner.copySelectedEyepieceToEyepieceTable = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		setEyeOptSelectedEyepieceUsingSelectStr = MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr,
		nextAvailRow = 0,
		selectedHtml,
		selectedEyepiece,
		selectedEyepieceCommaSplit,
		selectedEyepieceMatch;


	// see if a row in the eyepiece table is available
	while (nextAvailRow < config.maxEyepieceRows) {
		if (!state.eyeOptRowSet[nextAvailRow]) {
			break;
		}
		nextAvailRow += 1;
	}
	if (nextAvailRow === config.maxEyepieceRows) {
		alert('No available row in eyepiece table to insert selected eyepiece');
		return;
	}

	// eg, '- best eyepiece is Explore Scientific 100 series 30mm, 100deg, FOV=2.36 deg, pupil=6mm'
	selectedHtml = common.widestEyepiecesForEyePupilLabel().html();
	// remove literal, leaving 'Explore Scientific 100 series 30mm, 100deg, FOV=2.36 deg, pupil=6mm'
	selectedEyepiece = selectedHtml.replace(config.bestEyepieceLit, '');
	// eg, 'Explore Scientific 100 series 30mm'
	selectedEyepieceCommaSplit = selectedEyepiece.split(',');
	// eg, 'Explore Scientific 100 series 30mm' and ', 100deg'...
	selectedEyepieceMatch = selectedEyepieceCommaSplit[0] + selectedEyepieceCommaSplit[1];

	setEyeOptSelectedEyepieceUsingSelectStr(nextAvailRow, selectedEyepieceMatch);
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
};

MLB.NewtDesigner.changeUom = function (ignoreLengthConversion) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		updateCurrentlySelectedDesigner = MLB.NewtDesigner.updateCurrentlySelectedDesigner,
		setScalingFactorBasedOnFocalLength = MLB.NewtDesigner.setScalingFactorBasedOnFocalLength,
		updateEyepieceFocuserTravelDistance = MLB.NewtDesigner.updateEyepieceFocuserTravelDistance,
		newAperture,
		newTelescopeFocalLength,
		weightElements,
		weight,
		distanceElements,
		distance,
		verticalOffsetElements,
		verticalOffset,
		distanceToObject,
		uomLengthLit = common.getUomLengthLit(),
		uomWeightLit = common.getUomWeightLit(),
		lengthConversionFactor = common.getLengthConversionFactorIgnoreAtStartup(ignoreLengthConversion),
		weightConversionFactor = common.getWeightConversionFactorIgnoreAtStartup(ignoreLengthConversion),
		imperial = common.imperial(),
		diags = imperial
			? config.diagonalsInches.join(', ')
			: config.diagonalsMm.join(', '),
		sliderApertureUOMIx = imperial
			? 0
			: 1,
		sliderTelescopeFocalLengthUOMIx = imperial
			? 0
			: 1;

	common.sliderAperture().prop({
		'min': config.sliderApertureUOMRange[sliderApertureUOMIx][0],
		'max': config.sliderApertureUOMRange[sliderApertureUOMIx][1],
		'step': config.sliderApertureUOMRange[sliderApertureUOMIx][2]
	});
	common.sliderTelescopeFocalLength().prop({
		'min': config.sliderTelescopeFocalLengthUOMRange[sliderTelescopeFocalLengthUOMIx][0],
		'max': config.sliderTelescopeFocalLengthUOMRange[sliderTelescopeFocalLengthUOMIx][1],
		'step': config.sliderTelescopeFocalLengthUOMRange[sliderTelescopeFocalLengthUOMIx][2]
	});

	// update labels to include uom
	common.apertureUOMlabel().html(uomLengthLit);
	common.telescopeFocalLengthUOMlabel().html(uomLengthLit);
	common.focalPlaneToDiagDistanceLabel().html(config.focalPlaneToDiagDistanceLabelLit + uomLengthLit + ' = ');
	common.maxFieldDiaDiagLabel().html(config.maxFieldDiaDiagLabelLit + uomLengthLit + ' = ');
	common.diagSizesLabel().html(config.diagSizesLabelLit + uomLengthLit);
	common.sharedDiagSizeLabel().html(config.sharedDiagSizeLabelLit + uomLengthLit + ' = ');

	common.focuserRackedInHeightLabel().html(config.focuserRackedInHeightLabelLit + uomLengthLit + ' = ');
	common.focuserTravelLabel().html(config.focuserTravelLabelLit + uomLengthLit + ' = ');
	common.barrelTubeInsideDiameterLabel().html(config.barrelTubeInsideDiameterLabelLit + uomLengthLit + ' = ');
	common.barrelTubeLengthLabel().html(config.barrelTubeLengthLabelLit + uomLengthLit + ' = ');
	common.focuserInwardFocusingDistanceLabel().html(config.focuserInwardFocusingDistanceLabelLit + uomLengthLit + ' = ');
	common.tubeODLabel().html(config.tubeODLabelLit + uomLengthLit + ' = ');
	common.tubeThicknessLabel().html(config.tubeThicknessLabelLit + uomLengthLit + ' = ');
	common.diagOffsetLabel().html(config.diagOffsetFullIllumLabelLit + uomLengthLit + ' = ');
	common.lowriderSecondaryMirrorSizeLabel().html(config.lowriderSecondaryMirrorSizeLabelLit + uomLengthLit + ' = ');
	common.lowriderSecondaryOffsetLabel().html(config.lowriderSecondaryOffsetLabelLit + uomLengthLit + ' = ');
	common.focalPlaneToSecondaryDistanceLabel().html(config.focalPlaneToSecondaryDistanceLabelLit + uomLengthLit + ' = ');
	common.focalPointPerpendicularOffsetFromEdgeOfPrimaryLabel().html(config.focalPointPerpendicularOffsetFromEdgeOfPrimaryLabelLit + uomLengthLit + ' = ');
	common.binoscopeFocalPlaneToSecondaryDistanceLabel().html(config.binoscopeFocalPlaneToSecondaryDistanceLabelLit + uomLengthLit + ' = ');
	common.binoscopeFocalPlaneToTertiaryDistanceLabel().html(config.binoscopeFocalPlaneToTertiaryDistanceLabelLit + uomLengthLit + ' = ');
	common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryLabel().html(config.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryLabelLit + uomLengthLit + ' = ');
	common.tubeWeightLabel().html(config.tubeWeightLabelLit + uomWeightLit + ' = ');
	common.CGToEyepieceDistanceLabel().html(config.CGToEyepieceDistanceLabelLit + uomLengthLit + ' = ');
	common.altBearingRadiusLabel().html(config.altBearingRadiusLabelLit + uomLengthLit + ' = ');
	common.azBearingRadiusLabel().html(config.azBearingRadiusLabelLit + uomLengthLit + ' = ');
	common.rockerWeightLabel().html(config.rockerWeightLabelLit + uomWeightLit + ' = ');
	common.flexRockerCGToEyepieceDistanceLabel().html(config.CGToEyepieceDistanceLabelLit + uomLengthLit + ' = ');
	common.flexRockerTubeWeightLabel().html(config.tubeWeightLabelLit + uomWeightLit + ' = ');
	common.flexRockerCGToBackEdgeOfTubeClearanceLabel().html(config.flexRockerCGToBackEdgeOfTubeClearanceLit + uomLengthLit + ' = ');
	common.flexRockerWeightLabel().html(config.flexRockerWeightLabelLit + uomWeightLit + ' = ');

	// replace field values with new uom values; uom state already switched

	newAperture = roundToDecimal(common.apertureVal() * lengthConversionFactor, config.decimalPointsAperture);
	common.aperture().val(newAperture);
	common.sliderAperture().val(newAperture);
	state.lastApertureForFocalPlaneToDiagDistance = newAperture;
	newTelescopeFocalLength = roundToDecimal(common.telescopeFocalLengthVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength);
	common.telescopeFocalLength().val(newTelescopeFocalLength);
	common.sliderTelescopeFocalLength().val(newTelescopeFocalLength);

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

	common.sharedDiagSize().val(roundToDecimal(common.sharedDiagSizeVal() * lengthConversionFactor, config.decimalPointsDiag));
	common.diagOffset().val(roundToDecimal(common.diagOffsetVal() * lengthConversionFactor, config.decimalPointsDiag));

	common.diagToFocuserBaffleDistance().val(roundToDecimal(common.diagToFocuserBaffleDistanceVal() * lengthConversionFactor, config.decimalPointsFocuser));

	common.lowriderSecondaryMirrorSize().val(roundToDecimal(common.lowriderSecondaryMirrorSizeVal() * lengthConversionFactor, config.decimalPointsDiag));
	common.lowriderSecondaryOffset().val(roundToDecimal(common.lowriderSecondaryOffsetVal() * lengthConversionFactor, config.decimalPointsDiag));
	common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() * lengthConversionFactor, config.decimalPointsDiag));
	common.focalPointPerpendicularOffsetFromEdgeOfPrimary().val(roundToDecimal(common.focalPointPerpendicularOffsetFromEdgeOfPrimaryVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));

	common.binoscopeFocalPlaneToSecondaryDistance().val(roundToDecimal(common.binoscopeFocalPlaneToSecondaryDistanceVal() * lengthConversionFactor, config.decimalPointsDiag));
	common.binoscopeFocalPlaneToTertiaryDistance().val(roundToDecimal(common.binoscopeFocalPlaneToTertiaryDistanceVal() * lengthConversionFactor, config.decimalPointsDiag));
	common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary().val(roundToDecimal(common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));

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
	verticalOffsetElements = common.verticalOffsetElements();
	verticalOffsetElements.each(function (i, v) {
		verticalOffset = parseFloat(v.value);
		if (!isNaN(verticalOffset)) {
			v.value = roundToDecimal(verticalOffset * lengthConversionFactor, config.decimalPointsCG);
		}
	});

	common.tubeWeight().val(roundToDecimal(common.tubeWeightVal() * weightConversionFactor, config.decimalPointsCG));
	common.CGToEyepieceDistance().val(roundToDecimal(common.CGToEyepieceDistanceVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
	common.altBearingRadius().val(roundToDecimal(common.altBearingRadiusVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
	common.azBearingRadius().val(roundToDecimal(common.azBearingRadiusVal() * lengthConversionFactor, config.decimalPointsTelescopeFocalLength));
	common.rockerWeight().val(roundToDecimal(common.rockerWeightVal() * weightConversionFactor, config.decimalPointsCG));
	common.flexRockerWeight().val(roundToDecimal(common.flexRockerWeightVal() * weightConversionFactor, config.decimalPointsCG));

	setScalingFactorBasedOnFocalLength();

	updateCurrentlySelectedDesigner();

	// calculate after focal length is updated
	distanceToObject = +roundToDecimal(common.distanceToObject().val() * lengthConversionFactor, 0);
	common.distanceToObject().val(distanceToObject);
	updateEyepieceFocuserTravelDistance(distanceToObject);
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
		<td class="columnHeaders">MagXPerInch</td>
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
		<td id="EyeOptMagXPerInch0"></td>
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
		<td id="EyeOptMagXPerInch1"></td>
		<td id="EyeOptRes1"></td>
		<td id='EyeOptMagLimit1</td>
		<td id='EyeOptEtendue1</td>
		<td id='EyeOptComa1</td>
		<td><input id='btnRemoveEyepieceRow1' value='remove' type='button'></td>
	</tr>
	...etc
*/
MLB.NewtDesigner.buildEyepieceHtmlTable = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		eyepieceRow,
		htmlStr;

	for (eyepieceRow = 0; eyepieceRow < config.maxEyepieceRows; eyepieceRow += 1) {
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
				+ "<td id='" + config.EyeOptMagnificationPerInchID + eyepieceRow + "'></td>\r\n"
				+ "<td id='" + config.EyeOptResolutionID + eyepieceRow + "'></td>\r\n"
				+ "<td id='" + config.EyeOptLimitingMagnitudeID + eyepieceRow + "'></td>\r\n"
				+ "<td id='" + config.EyeOpEtendueID + eyepieceRow + "'></td>\r\n"
				+ "<td id='" + config.EyeOptComaID + eyepieceRow + "'></td>\r\n"
				+ "<td><input id='" + config.btnRemoveEyepieceRowLit + eyepieceRow + "' value='remove' type='button'></td>\r\n"
				+ "</tr>\r\n";
		common.eyeOptTableBody().append(htmlStr);
	}
};

MLB.NewtDesigner.seedComaCorrector = function (manufacturer, model, comaCorrectorSelectField, comaCorrectorMagField) {
	var setSelectedComaCorrector = MLB.NewtDesigner.setSelectedComaCorrector,
		comaCorrectorsJson = MLB.comaCorrectorsJson,
		e,
		row;

	comaCorrectorSelectField().val(manufacturer + ' ' + model);

	for (row = 0; row < comaCorrectorsJson.comaCorrectors.length; row += 1) {
		e = comaCorrectorsJson.comaCorrectors[row];
		if (e.manufacturer === manufacturer && e.model === model) {
			break;
		}
	}
	setSelectedComaCorrector(row, comaCorrectorMagField);
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

MLB.NewtDesigner.calcMinFoldingMirrorSize = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common;

	common.lowriderSecondaryMirrorSize().val(roundToDecimal(common.focalPlaneToSecondaryDistanceVal() / common.focalRatioVal(), config.decimalPointsDiag));
};

MLB.NewtDesigner.updateFocalPlaneToSecondaryDistanceToMax = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common;

	common.focalPlaneToSecondaryDistance().val(roundToDecimal(common.lowriderSecondaryMirrorSizeVal() * common.focalRatioVal(), config.decimalPointsDimension));
};

MLB.NewtDesigner.seedMaterialFrictions = () => {
	var common = MLB.NewtDesigner.common,
		selectedMaterialPairing = MLB.materialFrictionJson.materials[1];

	common.altBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
	common.azBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
	common.flexRockerAltBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
	common.flexRockerAzBearingMaterialsSelect().val(selectedMaterialPairing.materialPairing + ' ' + selectedMaterialPairing.friction);
};

MLB.NewtDesigner.buildEyepieceString = function (eyepiece) {
	var config = MLB.NewtDesigner.config;

	return eyepiece.manufacturer + ' ' + eyepiece.type + ' ' + eyepiece.focalLengthmm + config.mmLitNS + ' ' + eyepiece.apparentField + config.degLitNS;
};

// must look through eyepiece Json because not able to separate manufacturer and type, eg, 'APM HDC Extreme Wide Angle 20mm 100deg'
// find eyepiece Json and add to table: assumes that Json sorted the same as when saved
MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr = function (eyepieceRow, eyepieceSelect) {
	var config = MLB.NewtDesigner.config,
		buildEyepieceString = MLB.NewtDesigner.buildEyepieceString,
		setEyeOptSelectedEyepiece = MLB.NewtDesigner.setEyeOptSelectedEyepiece,
		eyepiecesJson = MLB.eyepiecesJson,
		eyepieceStr;

	$.each(eyepiecesJson.eyepieces, function (i, v) {
		eyepieceStr = buildEyepieceString(v);
		if (eyepieceSelect === eyepieceStr) {
			setEyeOptSelectedEyepiece(eyepieceRow, i);
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
	common.tableElement(config.EyeOptMagnificationPerInchID, eyepieceRow).html('');
	common.tableElement(config.EyeOptResolutionID, eyepieceRow).html('');
	common.tableElement(config.EyeOptLimitingMagnitudeID, eyepieceRow).html('');
	common.tableElement(config.EyeOpEtendueID, eyepieceRow).html('');
	common.tableElement(config.EyeOptComaID, eyepieceRow).html('');

	state.eyeOptRowSet[eyepieceRow] = undefined;
};

MLB.NewtDesigner.buildData = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		selectedEyepiece,
		eyepieces = [],
		eyepieceRow,
		partElements,
		weightElements,
		distanceElements,
		verticalOffsetElements,
		CGTableLength,
		CGRow,
		CGs = [];

	// build eyepieces array first...
	for (eyepieceRow = 0; eyepieceRow < config.maxEyepieceRows; eyepieceRow += 1) {
		selectedEyepiece = $('#' + config.EyeOptSelectID + eyepieceRow).val();
		eyepieces.push(selectedEyepiece);
	}

	// build CGs first...
	partElements = common.partElements();
	weightElements = common.weightElements();
	distanceElements = common.distanceElements();
	verticalOffsetElements = common.verticalOffsetElements();
	CGTableLength = weightElements.length;
	for (CGRow = 0; CGRow < CGTableLength; CGRow += 1) {
		CGs.push({part: partElements[CGRow].value, weight: weightElements[CGRow].value, distance: distanceElements[CGRow].value, verticalOffset: verticalOffsetElements[CGRow].value});
	}

	return {
		designDate: new Date().toString(),
		imperial: common.imperial(),
		focalLength: common.telescopeFocalLengthVal(),
		focalRatio: common.focalRatioVal(),
		aperture: common.apertureVal(),
		telescopeFocalLength: common.telescopeFocalLengthVal(),
		combinedMirrorsReflectivity: state.combinedMirrorsReflectivity,
		mirrorEdgeThicknessInches: state.mirrorEdgeThicknessInches,
		isMeniscus: state.isMeniscus,
		useComaCorrector: common.useComaCorrectorMagnificationVal(),
		comaCorrectorSelect: common.comaCorrectorSelectVal(),
		comaCorrectorMag: common.comaCorrectorMagVal(),
		eyePupilmm: common.eyePupilmmVal(),
		widestEyepiecesForEyePupilLabel: common.widestEyepiecesForEyePupilLabel().html(),
		eyepieceRowSet: state.eyeOptRowSet,
		eyepieces: eyepieces,
		AEFEyepieceSelect: common.AEFEyepieceSelectVal(),
		AEFUseComaCorrector: common.useAEFComaCorrectorMagnificationVal(),
		AEFComaCorrectorSelect: common.AEFComaCorrectorSelectVal(),
		AEFComaCorrectorMag: common.AEFComaCorrectorMagVal(),
		AEFPupil: common.AEFPupilVal(),
		AEFFOVDeg: common.AEFFOVDegVal(),
		skyBackgroundBrightnessUnaidedEye: common.skyBackgroundBrightnessUnaidedEyeVal(),
		BortleScale: common.BortleScaleVal(),
		objectName: common.objectNameVal(),
		objectApparentMagnitude: common.objectApparentMagnitudeVal(),
		objectSizeArcMin1: common.objectSizeArcMin1Val(),
		objectSizeArcMin2: common.objectSizeArcMin2Val(),
		visualDetectionApertureVariance: common.visualDetectionApertureVarianceVal(),
		focalPlaneToDiagDistance: common.focalPlaneToDiagDistanceVal(),
		maxFieldDiaDiag: common.maxFieldDiaDiagVal(),
		acceptableMagLoss: common.acceptableMagLossVal(),
		diagSizes: common.diagSizesVal(),
		includeFocuserBarrelVignetting: common.includeFocuserBarrelVignetting(),
		includeP2Intrusion: common.includeP2Intrusion(),
		mirrorSupportPoints: Math.floor(common.btnMirrorSupportPointsCheckedValue()),
		focuserSelect: common.focuserSelectVal(),
		focuserRackedInHeight: common.focuserRackedInHeightVal(),
		focuserTravel: common.focuserTravelVal(),
		focuserTubeID: common.barrelTubeInsideDiameterVal(),
		focuserTubeLength: common.barrelTubeLengthVal(),
		focuserInwardFocusingDistance: common.focuserInwardFocusingDistanceVal(),
		telescopeTubeOD: common.telescopeTubeODVal(),
		telescopeTubeThickness: common.telescopeTubeThicknessVal(),
		baffleDesignerDiagSize: common.sharedDiagSizeVal(),
		baffleDesignerDiagOffset: common.diagOffsetVal(),
		diagToFocuserBaffleDistance: common.diagToFocuserBaffleDistanceVal(),
		lowriderDiagSize: common.lowriderSecondaryMirrorSizeVal(),
		lowriderDiagOffset: common.lowriderSecondaryOffsetVal(),
		lowriderFocalPlaneToDiagDistance: common.focalPlaneToSecondaryDistanceVal(),
		lowriderfocalPointPerpendicularOffsetFromEdgeOfPrimaryMirror: common.focalPointPerpendicularOffsetFromEdgeOfPrimaryVal(),
		binoscopeLockSecondaryBendingAngle: common.binoscopeLockSecondaryBendingAngle(),
		binoscopeLockEyepieceDivergence: common.binoscopeLockEyepieceDivergence(),
		binoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle: common.binoscopeLockEyepieceDivergenceIncludeTertiarySecondaryRightAngle(),
		binoscopeFocalPointOffsetFromEdgeOfPrimary: common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimaryVal(),
		binoscopeFocalPlaneToTertiaryDistance: common.binoscopeFocalPlaneToTertiaryDistanceVal(),
		binoscopeFocalPlaneToSecondaryDistance: common.binoscopeFocalPlaneToSecondaryDistanceVal(),
		binoscopeSecondaryBendingAngleDeg: common.binoscopeSecondaryBendingAngleDegVal(),
		binoscopeTertiaryBendingAngleDeg: common.binoscopeTertiaryBendingAngleDegVal(),
		binoscopeEyepieceDivergenceDeg: common.binoscopeEyepieceDivergenceDegVal(),
		IPD: common.IPDVal(),
		binoscopeSecondaryAxisDownwardTiltAngleDeg: common.binoscopeSecondaryAxisDownwardTiltAngleDegVal(),
		CGs: CGs,
		spiderType: common.spiderTypeSelectVal(),
		tubeType: common.tubeTypeSelectVal(),
		mountType: common.mountTypeSelectVal(),
		CGToEyepieceDistance: common.CGToEyepieceDistanceVal(),
		tubeWeight: common.tubeWeightVal(),
		altBearingSeparationDeg: common.altBearingSeparationDegVal(),
		altBearingRadius: common.altBearingRadiusVal(),
		azBearingRadius: common.azBearingRadiusVal(),
		altBearingMaterialsSelect: common.altBearingMaterialsSelect().val(),
		azBearingMaterialsSelect: common.azBearingMaterialsSelect().val(),
		rockerWeight: common.rockerWeightVal(),
		flexRockerCGToEyepieceDistance: common.flexRockerCGToEyepieceDistanceVal(),
		flexRockerTubeWeight: common.flexRockerTubeWeightVal(),
		flexRockerCGToBackEdgeOfTubeClearance: common.flexRockerCGToBackEdgeOfTubeClearanceVal(),
		flexRockerAltBearingSeparationDeg: common.flexRockerAltBearingSeparationDegVal(),
		flexRockerAltBearingMaterialsSelect: common.flexRockerAltBearingMaterialsSelect().val(),
		flexRockerAzBearingMaterialsSelect: common.flexRockerAzBearingMaterialsSelect().val(),
		flexRockerWeight: common.flexRockerWeightVal(),
		ETLatitudeDeg: common.ETLatitudeDegVal(),
		ETTrackingTimeMin: common.ETTrackingTimeMinVal()
	};
};

MLB.NewtDesigner.putData = () => {
	var common = MLB.NewtDesigner.common,
		buildData = MLB.NewtDesigner.buildData,
		JSONdata = JSON.stringify(buildData(), null, 4);

	common.textareaDesignData().val(JSONdata);
	common.textareaDesignData().select();
	document.execCommand('copy');
};

MLB.NewtDesigner.getData = () => {
	var common = MLB.NewtDesigner.common,
		data;

	data = common.textareaDesignData().val();
	return JSON.parse(data);
};

MLB.NewtDesigner.importMelBartels30InchDesign = () => {
	var common = MLB.NewtDesigner.common,
		getDataUpdateUI = MLB.NewtDesigner.getDataUpdateUI,
		MelBartels30InchDesignData = MLB.NewtDesigner.MelBartels30InchDesignData;

	common.textareaDesignData().val(JSON.stringify(MelBartels30InchDesignData, null, 4));
	getDataUpdateUI(MelBartels30InchDesignData);
};

MLB.NewtDesigner.importMelBartelsZipDobIIDesign = () => {
	var common = MLB.NewtDesigner.common,
		getDataUpdateUI = MLB.NewtDesigner.getDataUpdateUI,
		MelBartelsZipDobIIDesignData = MLB.NewtDesigner.MelBartelsZipDobIIDesignData;

	common.textareaDesignData().val(JSON.stringify(MelBartelsZipDobIIDesignData, null, 4));
	getDataUpdateUI(MelBartelsZipDobIIDesignData);
};

MLB.NewtDesigner.getDataUpdateUI = function (parsedData) {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		changeUom = MLB.NewtDesigner.changeUom,
		updateFieldsDependentOnAperture = MLB.NewtDesigner.updateFieldsDependentOnAperture,
		eyepieces,
		eyepieceRowSet,
		eyepieceSelect,
		eyepieceRow,
		CGLength,
		CGRow,
		setEyeOptSelectedEyepieceUsingSelectStr = MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr,
		removeEyeOptSelectedEyepiece = MLB.NewtDesigner.removeEyeOptSelectedEyepiece,
		setCheckmarkMirrorSupportPointsRadioButtons = MLB.NewtDesigner.setCheckmarkMirrorSupportPointsRadioButtons;

	if (common.imperial() !== parsedData.imperial) {
		common.btnUom()[0].checked = parsedData.imperial;
		common.btnUom()[1].checked = !parsedData.imperial;
		changeUom();
		state.lastUomSelected = parsedData.imperial;
	}
	common.focalRatio().val(parsedData.focalRatio);
	common.sliderFocalRatio().val(parsedData.focalRatio);
	common.aperture().val(parsedData.aperture);
	common.sliderAperture().val(parsedData.aperture);
	updateFieldsDependentOnAperture();
	// updateFieldsDependentOnAperture() uses focal ratio to calculate focal length unless the focal length is locked;
	// since the user is not asking to focal length during import, the focal length needs to be set after calling updateFieldsDependentOnAperture();
	// focal length was not originally part of the data export/import so verify that it exists
	if (parsedData.telescopeFocalLength) {
		common.telescopeFocalLength().val(parsedData.telescopeFocalLength);
		common.sliderTelescopeFocalLength().val(parsedData.telescopeFocalLength);
	}
	state.combinedMirrorsReflectivity = parsedData.combinedMirrorsReflectivity;
	if (parsedData.mirrorEdgeThicknessInches) {
		state.mirrorEdgeThicknessInches = parsedData.mirrorEdgeThicknessInches;
	}
	if (parsedData.isMeniscus) {
		state.isMeniscus = parsedData.isMeniscus;
	}
	common.chBoxIncludeFocuserBarrelVignetting().prop('checked', parsedData.includeFocuserBarrelVignetting);
	common.chBoxUseComaCorrector().prop('checked', parsedData.useComaCorrector);
	if (parsedData.includeP2Intrusion) {
		common.chBoxIncludeP2Intrusion().prop('checked', parsedData.includeP2Intrusion);
	} else { // if not includeP2Intrusion then fallback to using useComaCorrector for chBoxIncludeP2Intrusion
		common.chBoxIncludeP2Intrusion().prop('checked', parsedData.useComaCorrector);
	}
	common.comaCorrectorSelect().val(parsedData.comaCorrectorSelect);
	common.comaCorrectorMag().val(parsedData.comaCorrectorMag);
	common.eyePupilmm().val(parsedData.eyePupilmm);
	common.widestEyepiecesForEyePupilLabel().html(parsedData.widestEyepiecesForEyePupilLabel);
	eyepieces = parsedData.eyepieces;
	eyepieceRowSet = parsedData.eyepieceRowSet;
	for (eyepieceRow = 0; eyepieceRow < config.maxEyepieceRows; eyepieceRow += 1) {
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

	// for upgrading from earlier versions: ignore values if undefined
	if (parsedData.AEFEyepieceSelect !== undefined) {
		common.AEFEyepieceSelect().val(parsedData.AEFEyepieceSelect);
		common.chBoxAEFUseComaCorrector().prop('checked', parsedData.AEFUseComaCorrector);
		common.AEFComaCorrectorSelect().val(parsedData.AEFComaCorrectorSelect);
		common.AEFComaCorrectorMag().val(parsedData.AEFComaCorrectorMag);
		common.AEFPupil().val(parsedData.AEFPupil);
		common.AEFFOVDeg().val(parsedData.AEFFOVDeg);
	}
	// for upgrading from earlier versions: ignore values if undefined
	if (parsedData.objectName !== undefined) {
		common.skyBackgroundBrightnessUnaidedEye().val(parsedData.skyBackgroundBrightnessUnaidedEye);
		common.BortleScale().val(parsedData.BortleScale);
		common.sliderBortleScale().val(parsedData.BortleScale);
		common.objectName().val(parsedData.objectName);
		common.objectApparentMagnitude().val(parsedData.objectApparentMagnitude);
		common.objectSizeArcMin1().val(parsedData.objectSizeArcMin1);
		common.objectSizeArcMin2().val(parsedData.objectSizeArcMin2);
		common.visualDetectionApertureVariance().val(parsedData.visualDetectionApertureVariance);
	}
	common.focalPlaneToDiagDistance().val(parsedData.focalPlaneToDiagDistance);
	common.maxFieldDiaDiag().val(parsedData.maxFieldDiaDiag);
	common.acceptableMagLoss().val(parsedData.acceptableMagLoss);
	common.diagSizes().val(parsedData.diagSizes);

	state.mirrorSupportPoints = parsedData.mirrorSupportPoints;
	setCheckmarkMirrorSupportPointsRadioButtons(parsedData.mirrorSupportPoints);

	common.focuserSelect().val(parsedData.focuserSelect);
	common.focuserRackedInHeight().val(parsedData.focuserRackedInHeight);
	common.focuserTravel().val(parsedData.focuserTravel);
	common.barrelTubeInsideDiameter().val(parsedData.focuserTubeID);
	common.barrelTubeLength().val(parsedData.focuserTubeLength);
	common.focuserInwardFocusingDistance().val(parsedData.focuserInwardFocusingDistance);
	common.telescopeTubeOD().val(parsedData.telescopeTubeOD);
	common.telescopeTubeThickness().val(parsedData.telescopeTubeThickness);
	common.sharedDiagSize().val(parsedData.baffleDesignerDiagSize);
	common.diagOffset().val(parsedData.baffleDesignerDiagOffset);
	common.diagToFocuserBaffleDistance().val(parsedData.diagToFocuserBaffleDistance);
	common.lowriderSecondaryMirrorSize().val(parsedData.lowriderDiagSize);
	common.lowriderSecondaryOffset().val(parsedData.lowriderDiagOffset);
	common.focalPlaneToSecondaryDistance().val(parsedData.lowriderFocalPlaneToDiagDistance);
	common.focalPointPerpendicularOffsetFromEdgeOfPrimary().val(parsedData.lowriderfocalPointPerpendicularOffsetFromEdgeOfPrimaryMirror);

	common.chBoxBinoscopeLockSecondaryBendingAngle().prop('checked', parsedData.binoscopeLockSecondaryBendingAngle);
	common.chBoxBinoscopeLockEyepieceDivergence().prop('checked', parsedData.binoscopeLockEyepieceDivergence);
	common.chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle().prop('checked', parsedData.binoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle);
	common.binoscopeSecondaryBendingAngleDeg().val(parsedData.binoscopeSecondaryBendingAngleDeg);
	common.binoscopeTertiaryBendingAngleDeg().val(parsedData.binoscopeTertiaryBendingAngleDeg);
	common.binoscopeEyepieceDivergenceDeg().val(parsedData.binoscopeEyepieceDivergenceDeg);
	common.IPD().val(parsedData.IPD);
	common.binoscopeSecondaryAxisDownwardTiltAngleDeg().val(parsedData.binoscopeSecondaryAxisDownwardTiltAngleDeg);
	common.binoscopeFocalPlaneToSecondaryDistance().val(parsedData.binoscopeFocalPlaneToSecondaryDistance);
	common.binoscopeFocalPlaneToTertiaryDistance().val(parsedData.binoscopeFocalPlaneToTertiaryDistance);
	common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary().val(parsedData.binoscopeFocalPointOffsetFromEdgeOfPrimary);

	CGLength = parsedData.CGs.length;
	for (CGRow = 0; CGRow < CGLength; CGRow += 1) {
		$('[id=' + config.CGIDs.part + CGRow + ']').val(parsedData.CGs[CGRow].part);
		$('[id=' + config.CGIDs.weight + CGRow + ']').val(parsedData.CGs[CGRow].weight);
		$('[id=' + config.CGIDs.distance + CGRow + ']').val(parsedData.CGs[CGRow].distance);
		$('[id=' + config.CGIDs.verticalOffset + CGRow + ']').val(parsedData.CGs[CGRow].verticalOffset);
	}

	common.spiderTypeSelect().val(parsedData.spiderType);
	common.tubeTypeSelect().val(parsedData.tubeType);
	common.mountTypeSelect().val(parsedData.mountType);
	common.CGToEyepieceDistance().val(parsedData.CGToEyepieceDistance);
	common.tubeWeight().val(parsedData.tubeWeight);
	common.altBearingSeparationDeg().val(parsedData.altBearingSeparationDeg);
	common.altBearingRadius().val(parsedData.altBearingRadius);
	common.azBearingRadius().val(parsedData.azBearingRadius);
	common.altBearingMaterialsSelect().val(parsedData.altBearingMaterialsSelect);
	common.azBearingMaterialsSelect().val(parsedData.azBearingMaterialsSelect);
	common.rockerWeight().val(parsedData.rockerWeight);
	common.chBoxAutoCalcRockerWeight().prop('checked', false);
	common.flexRockerCGToEyepieceDistance().val(parsedData.flexRockerCGToEyepieceDistance);
	common.flexRockerTubeWeight().val(parsedData.flexRockerTubeWeight);
	common.flexRockerCGToBackEdgeOfTubeClearance().val(parsedData.flexRockerCGToBackEdgeOfTubeClearance);
	common.flexRockerAltBearingSeparationDeg().val(parsedData.flexRockerAltBearingSeparationDeg);
	common.flexRockerAltBearingMaterialsSelect().val(parsedData.flexRockerAltBearingMaterialsSelect);
	common.flexRockerAzBearingMaterialsSelect().val(parsedData.flexRockerAzBearingMaterialsSelect);
	common.flexRockerWeight().val(parsedData.flexRockerWeight);
	common.chBoxAutoCalcFlexRockerWeight().prop('checked', false);
	common.ETLatitudeDeg().val(parsedData.ETLatitudeDeg);
	common.ETTrackingTimeMin().val(parsedData.ETTrackingTimeMin);
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

MLB.NewtDesigner.updateTelescopeResults = () => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		magnitudeDifferenceBetweenApertures = MLB.calcLib.magnitudeDifferenceBetweenApertures,
		calcTheoreticalResolutionArcsec = MLB.calcLib.calcTheoreticalResolutionArcsec,
		calcAiryDiskInches = MLB.calcLib.calcAiryDiskInches,
		calcMinMagnification = MLB.calcLib.calcMinMagnification,
		calcMaxMagnification = MLB.calcLib.calcMaxMagnification,
		calcDiopter = MLB.calcLib.calcDiopter,
		calcComaFreeDia = MLB.NewtDesigner.calcComaFreeDia,
		calcSagittaSpherical = MLB.calcLib.calcSagittaSpherical,
		calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic,
		calcWavefrontErrorForSphericalMirror = MLB.calcLib.calcWavefrontErrorForSphericalMirror,
		calcSagittalVolume = MLB.calcLib.calcSagittalVolume,
		calcSagittalVolumeRemovedDuringParabolization = MLB.calcLib.calcSagittalVolumeRemovedDuringParabolization,
		glassRemovalDuringPolishingFrom10MicronAluminumOxideCubicInches = MLB.calcLib.glassRemovalDuringPolishingFrom10MicronAluminumOxideCubicInches,
		calcMirrorSlumpingParms = MLB.calcLib.calcMirrorSlumpingParms,
		calcRotatingFurnaceRPM = MLB.calcLib.calcRotatingFurnaceRPM,
		calcCollimationToleranceInches = MLB.calcLib.calcCollimationToleranceInches,
		calcAndDisplaySpacePenetratingPower = MLB.NewtDesigner.calcAndDisplaySpacePenetratingPower,
		calcAndDisplayMirrorWeightAndMirrorCG = MLB.NewtDesigner.calcAndDisplayMirrorWeightAndMirrorCG,
		focalRatio = common.focalRatioVal(),
		aperture = common.apertureVal(),
		apertureInches = common.apertureInchesVal(),
		telescopeFocalLengthInches = focalRatio * apertureInches,
		comaFreeDia = calcComaFreeDia(focalRatio),
		minMagnification,
		maxMagnification,
		theoreticalResolutionArcsec,
		AiryDiskSize,
		focusingTolerance,
		collimationToleranceInches,
		brightnessGain,
		sagittaSpherical,
		sagittaParabolic,
		sagittalVolume,
		parabolicRemovalVolume,
		wavesCorrection,
		glassRemovedDuringPolishingCubicInches,
		glassRemovedDuringPolishing,
		mirrorSlumpingParms,
		RPM,
		diopter,
		uomLengthLit = common.getUomLengthLit(),
		uomWeightLit = common.getUomWeightLit();

	minMagnification = calcMinMagnification(apertureInches);
	maxMagnification = calcMaxMagnification(apertureInches);
	theoreticalResolutionArcsec = calcTheoreticalResolutionArcsec(apertureInches);
	AiryDiskSize = common.convertInchesToUom(calcAiryDiskInches(common.focalRatioVal()));
	focusingTolerance = common.convertInchesToUom(config.focusingToleranceInchesForFocalRatioOf1) * focalRatio * focalRatio;
	collimationToleranceInches = calcCollimationToleranceInches(apertureInches, focalRatio);
	brightnessGain = magnitudeDifferenceBetweenApertures(apertureInches, config.nightTimeEyePupilInches);
	sagittaSpherical = calcSagittaSpherical(aperture, focalRatio);
	sagittaParabolic = calcSagittaParabolic(aperture, focalRatio);
	sagittalVolume = calcSagittalVolume(aperture, focalRatio);
	parabolicRemovalVolume = calcSagittalVolumeRemovedDuringParabolization(aperture, focalRatio);
	wavesCorrection = calcWavefrontErrorForSphericalMirror(apertureInches, focalRatio);
	glassRemovedDuringPolishingCubicInches = glassRemovalDuringPolishingFrom10MicronAluminumOxideCubicInches(apertureInches, focalRatio);
	glassRemovedDuringPolishing = common.convertInchesToUom(common.convertInchesToUom(common.convertInchesToUom(glassRemovedDuringPolishingCubicInches)));
	mirrorSlumpingParms = calcMirrorSlumpingParms(aperture, focalRatio);
	diopter = calcDiopter(telescopeFocalLengthInches);
	RPM = calcRotatingFurnaceRPM(apertureInches * focalRatio * 0.0254);

	// save values for use with other optimizers
	state.brightnessGain = brightnessGain;

	common.telescopeDesignerResultsLabel().html('brightness gain = '
			+ roundToDecimal(brightnessGain, config.decimalPointsRadiance)
			+ ' magnitudes'
			+ "<br>William Herschel's Space Penetrating Power based on combined mirrors' reflectivity of "
			+ "<input class='inputText' id='combinedMirrorsReflectivity' onfocus='select();' type='text'>"
			+ " = <label id='spacePenetratingPowerLabel' for=''> </label>"
			+ '<br>Dawes\' Limit = '
			+ roundToDecimal(theoreticalResolutionArcsec, config.decimalPointsResolution)
			+ ' arc seconds'
			+ '<br>Airy disk size = '
			+ roundToDecimal(AiryDiskSize, config.decimalPointsAiryDisk)
			+ uomLengthLit
			+ '<br>magnifications: for eye pupil of 7mm = '
			+ roundToDecimal(minMagnification, config.decimalPointsMagnification)
			+ 'x, to match eye resolution = '
			+ roundToDecimal(maxMagnification, config.decimalPointsMagnification)
			+ 'x, maximum for double star resolving = '
			+ roundToDecimal(4 * maxMagnification, config.decimalPointsMagnification)
			+ 'x'

			+ '<br><br>focusing tolerance = '
			+ roundToDecimal(focusingTolerance, config.focusingTolerance)
			+ uomLengthLit
			+ '<br>coma free diameter = '
			+ roundToDecimal(comaFreeDia, config.decimalPointsComaFreeDiameter)
			+ uomLengthLit
			+ ' ignores any coma corrector / coma correcting eyepiece'
			+ '<br>collimation tolerance (primary mirror projected to the focuser) = '
			+ roundToDecimal(common.convertInchesToUom(collimationToleranceInches.primaryMirrorAlignment), config.decimalPointsComaFreeDiameter)
			+ uomLengthLit
			+ ' and collimation tolerance (focuser projected onto the primary mirror) = '
			+ roundToDecimal(common.convertInchesToUom(collimationToleranceInches.focuserAlignment), config.decimalPointsComaFreeDiameter)
			+ uomLengthLit

			+ '<br><br>mirror edge thickness = '
			+ "<input class='inputText' id='mirrorEdgeThickness' onfocus='select();' type='text'>"
			+ uomLengthLit
			+ ' meniscus? '
			+ "<input id='chBoxIsMeniscus' type='checkbox'>"
			+ "&emsp; mirror weight = <label id='mirrorWeightLabel' for=''> </label>"
			+ uomWeightLit
			+ ", mirror CG from front edge = <label id='mirrorCGLabel' for=''> </label>"
			+ uomLengthLit

			+ '<br>mirror sagitta: spherical = '
			+ roundToDecimal(sagittaSpherical, config.decimalPointsSagitta)
			+ uomLengthLit
			+ ', parabolic = '
			+ roundToDecimal(sagittaParabolic, config.decimalPointsSagitta)
			+ uomLengthLit
			+ ', difference = '
			+ roundToDecimal(sagittaSpherical - sagittaParabolic, config.decimalPointsSagittalDifference)
			+ uomLengthLit
			+ '&emsp; <a href="sagitta.html" target="_blank">Calculate focal length from sagitta</a>'

			+ '<br>sagittal volume = '
			+ roundToDecimal(sagittalVolume, config.decimalPointsSagitta)
			+ uomLengthLit
			+ '^3, volume removed during parabolizing (tangent to center or edge) = '
			+ roundToDecimal(parabolicRemovalVolume, config.decimalPointsSagitta)
			+ uomLengthLit
			+ '^3, volume removed during polishing from 10 micron aluminum oxide = '
			+ roundToDecimal(glassRemovedDuringPolishing, config.decimalPointsSagitta)
			+ uomLengthLit
			+ '^3'

			+ '<br><br>parabolic correction = '
			+ roundToDecimal(wavesCorrection, config.decimalPointsDimension)
			+ ' waves tangent to edge or center; minimum parabolic correction = '
			+ roundToDecimal(wavesCorrection / 4, config.decimalPointsDimension)
			+ ' waves tangent to the 70.7% zone'

			+ '<br><br>effective diameter if mirror is slumped = '
			+ roundToDecimal(mirrorSlumpingParms.effectiveDia, config.decimalPointsAperture)
			+ uomLengthLit
			+ ', edge angle = '
			+ roundToDecimal(mirrorSlumpingParms.edgeAngleDeg, config.decimalPointsAngle)
			+ ' deg'
			+ '<br>rotate liquid to match sagitta at '
			+ roundToDecimal(RPM, config.decimalPointsDimension)
			+ ' rpm. Coriolis Effect comes into play at 100 inches diameter [2.5m] and can be compensated for by tipping north or south.'
			+ '<br>telescope diopter = '
			+ roundToDecimal(diopter, config.decimalPointsResolution));

	// combinedMirrorsReflectivity...
	// set state to default if not defined
	if (state.combinedMirrorsReflectivity === undefined) {
		state.combinedMirrorsReflectivity = config.defaultCombinedMirrorsReflectivity;
	}
	// set control's value to state
	common.combinedMirrorsReflectivity().val(state.combinedMirrorsReflectivity);
	// wire up the change function since the control is built in this function
	common.combinedMirrorsReflectivity().change(function () {
		state.combinedMirrorsReflectivity = common.combinedMirrorsReflectivityVal();
		calcAndDisplaySpacePenetratingPower(apertureInches);
	});
	// calculate value and display
	calcAndDisplaySpacePenetratingPower(apertureInches);

	// isMeniscus...
	// use state.isMeniscus to set display value since control is built new each time this function is called
	common.chBoxIsMeniscus().prop('checked', state.isMeniscus);
	common.chBoxIsMeniscus().change(function () {
		state.isMeniscus = !state.isMeniscus;
		calcAndDisplayMirrorWeightAndMirrorCG(apertureInches, focalRatio, state.mirrorEdgeThicknessInches, state.isMeniscus);
	});

	// mirrorEdgeThickness...
	// use state.mirrorEdgeThicknessInches to set display value since control is built new each time this function is called
	common.mirrorEdgeThickness().val(roundToDecimal(common.convertInchesToUom(state.mirrorEdgeThicknessInches), config.decimalPointsDimension));
	// wire up the change function since the control is built in this function
	common.mirrorEdgeThickness().change(function (e) {
		// state's value can only change here...
		state.mirrorEdgeThicknessInches = common.convertUomToInches(+e.target.value);
		calcAndDisplayMirrorWeightAndMirrorCG(apertureInches, focalRatio, state.mirrorEdgeThicknessInches, state.isMeniscus);
	});
	// calculate value and display
	calcAndDisplayMirrorWeightAndMirrorCG(apertureInches, focalRatio, state.mirrorEdgeThicknessInches, state.isMeniscus);
};

MLB.NewtDesigner.calcAndDisplaySpacePenetratingPower = function (apertureInches) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		diagonalSizeInches = 0,
		calcWilliamHerschelSpacePenetratingPower = MLB.calcLib.calcWilliamHerschelSpacePenetratingPower,
		spacePenetratingPower = calcWilliamHerschelSpacePenetratingPower(apertureInches, diagonalSizeInches, state.combinedMirrorsReflectivity);

	common.spacePenetratingPowerLabel().html(roundToDecimal(spacePenetratingPower, config.decimalPointsResolution));
};

MLB.NewtDesigner.calcAndDisplayMirrorWeightAndMirrorCG = function (apertureInches, focalRatio, mirrorEdgeThicknessInches, isMeniscus) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		calcMirrorWeight = MLB.calcLib.calcMirrorWeight,

		calcMirrorCG = MLB.calcLib.calcMirrorCG,

		mirrorWeightLbs = calcMirrorWeight(apertureInches, focalRatio, mirrorEdgeThicknessInches, isMeniscus),
		mirrorWeightUom = common.convertLbsToUom(mirrorWeightLbs),
		mirrorCGInches = calcMirrorCG(apertureInches, focalRatio, mirrorEdgeThicknessInches, isMeniscus),
		mirrorCGUom = common.convertInchesToUom(mirrorCGInches);

	// weight...
	common.mirrorWeightLabel().html(roundToDecimal(mirrorWeightUom, config.decimalPointsResolution));
	state.mirrorWeightLbs = mirrorWeightLbs;

	// edge CG...
	common.mirrorCGLabel().html(roundToDecimal(mirrorCGUom, config.decimalPointsDimension));
};

MLB.NewtDesigner.drawSupportPoints = function (context, centerPt, offsets) {
	var config = MLB.NewtDesigner.config,
		point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		centerCircle,
		centerCircles = [];

	offsets.forEach(function (offsetValue) {
		centerCircle = point(centerPt.x + offsetValue.x, centerPt.y - offsetValue.y);
		centerCircles.push(centerCircle);
		drawCircle(context, centerCircle, 3, config.canvasLineWidth, config.canvasStructureStyle);
	});
	return centerCircles;
};

MLB.NewtDesigner.buildXYOffsetsFromMirrorCenter = function (ix, numberOfPoints, offsetAngleRad, scaledRadius) {
	var uom = MLB.sharedLib.uom;

	return {
		x: Math.sin(ix * uom.oneRev / numberOfPoints + offsetAngleRad) * scaledRadius,
		y: Math.cos(ix * uom.oneRev / numberOfPoints + offsetAngleRad) * scaledRadius
	};
};

MLB.NewtDesigner.setCheckmarkMirrorSupportPointsRadioButtons = function (supportPoints) {
	var common = MLB.NewtDesigner.common,
		btnMirrorSupportPoints = common.btnMirrorSupportPoints(),
		btnMirrorSupportPointsLength = btnMirrorSupportPoints.length,
		ix;

	for (ix = 0; ix < btnMirrorSupportPointsLength; ix += 1) {
		btnMirrorSupportPoints[ix].checked = parseInt(btnMirrorSupportPoints[ix].value) === supportPoints;
	}
};

MLB.NewtDesigner.updateMirrorCellFromAperture = () => {
	var state = MLB.NewtDesigner.state,
		common = MLB.NewtDesigner.common,
		setCheckmarkMirrorSupportPointsRadioButtons = MLB.NewtDesigner.setCheckmarkMirrorSupportPointsRadioButtons,
		calcMinimumMirrorSupportPoints = MLB.calcLib.calcMinimumMirrorSupportPoints,
		updateMirrorCellFromMirrorSupportPoints = MLB.NewtDesigner.updateMirrorCellFromMirrorSupportPoints,
		apertureInches = common.apertureInchesVal(),
		mirrorSupportPoints;

	// state.mirrorSupportPoints set in getDataUpdateUI() and updateMirrorCellFromRadioBtns(): the saved value is restored and used here;
	// the state is set undefined when aperture changes
	if (state.mirrorSupportPoints) {
		mirrorSupportPoints = state.mirrorSupportPoints;
	} else {
		// requires aperture in inches where as mirrorCellDimensions = calcMirrorCell...(radius) requires radius in UOM
		mirrorSupportPoints = calcMinimumMirrorSupportPoints(apertureInches);
	}

	common.mirrorCellDesignerResultsLabel().html('Mirror support points required = ' + mirrorSupportPoints + '&emsp; (automatically selected based on aperture)');
	setCheckmarkMirrorSupportPointsRadioButtons(mirrorSupportPoints);

	updateMirrorCellFromMirrorSupportPoints(mirrorSupportPoints);
};

MLB.NewtDesigner.updateMirrorCellFromRadioBtns = () => {
	var state = MLB.NewtDesigner.state,
		common = MLB.NewtDesigner.common,
		updateMirrorCellFromMirrorSupportPoints = MLB.NewtDesigner.updateMirrorCellFromMirrorSupportPoints,
		mirrorSupportPoints;

	mirrorSupportPoints = Math.floor(common.btnMirrorSupportPointsCheckedValue());
	updateMirrorCellFromMirrorSupportPoints(mirrorSupportPoints);
	// user overriden mirrorSupportPoints will stay in effect until aperture changes
	state.mirrorSupportPoints = mirrorSupportPoints;
};

MLB.NewtDesigner.updateMirrorCellFromMirrorSupportPoints = function (mirrorSupportPoints) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uom = MLB.sharedLib.uom,
		calcMirrorCell3pt = MLB.calcLib.calcMirrorCell3pt,
		calcMirrorCell6pt = MLB.calcLib.calcMirrorCell6pt,
		calcMirrorCell9pt = MLB.calcLib.calcMirrorCell9pt,
		calcMirrorCell12pt = MLB.calcLib.calcMirrorCell12pt,
		calcMirrorCell18pt = MLB.calcLib.calcMirrorCell18pt,
		calcMirrorCell27pt = MLB.calcLib.calcMirrorCell27pt,
		calcMirrorCell54pt = MLB.calcLib.calcMirrorCell54pt,
		findWeightedCenterOfPoints = MLB.calcLib.findWeightedCenterOfPoints,
		findOffsetCenterBetweenTwoPoints = MLB.calcLib.findOffsetCenterBetweenTwoPoints,
		aperture = common.apertureVal(),
		radius = aperture / 2,
		mirrorCellDimensions,
		scalingFactor = MLB.calcLib.scalingFactor,
		scaling,
		scaledAperture,
		canvas,
		context,
		centerPt,
		ix,
		ix2,
		ixInner,
		ixOuter,
		IxOuters,
		ixTriangle,
		xyOffsetsFromMirrorCenter = [],
		innerTriangles = [],
		outerTriangles = [],
		centerCircles,
		centerCirclesOuter,
		centerCirclesMid,
		centerCirclesInner,
		innerPoint,
		outerPoint1,
		outerPoint2,
		barOffsetPoint1,
		barOffsetPoint2,
		barPoint1,
		barPoint2,
		barCenterPoint,
		CGpoint,
		//collimationRadius,
		barLength,
		triangleSideLengths = [],
		angles,
		outerPointsMidPoints = [],
		midPointsMidPoints = [],
		barRadius,
		barPtsHalfAngle,
		barBalancePointRadius,
		outerPivotPtsHalfAngle,
		largeTriangleOuterLength,
		largeTriangleOuterHalfLength,
		largeTriangleYLength,
		largeTriangleSidesLength,
		largeTrianglePivotFromFrontPtLength,
		innerTrianglePtsHalfAngle,
		innerTriangleOuterLength,
		innerTriangleOuterHalfLength,
		innerTriangleYLength,
		innerTriangleSidesLength,
		innerTrianglePivotFromFrontPtLength,
		outerTrianglePtsHalfAngle,
		outerTriangleOuterLength,
		outerTriangleOuterHalfLength,
		outerTriangleYLength,
		outerTriangleSidesLength,
		outerTrianglePivotFromFrontPtLength,
		explanatoryText,
		uomLengthLit = common.getUomLengthLit(),
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		drawCanvasOutline = MLB.NewtDesigner.drawCanvasOutline,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		drawCircle = MLB.sharedLib.drawCircle,
		getDistance = MLB.sharedLib.getDistance,
		buildXYOffsetsFromMirrorCenter = MLB.NewtDesigner.buildXYOffsetsFromMirrorCenter,
		drawSupportPoints = MLB.NewtDesigner.drawSupportPoints,
		drawPoints54Helper = MLB.NewtDesigner.drawPoints54Helper,
		drawTriangles54Helper = MLB.NewtDesigner.drawTriangles54Helper,
		getOuterIxsNoOffset = MLB.NewtDesigner.getOuterIxsNoOffset,
		getOuterIxsWithOffset = MLB.NewtDesigner.getOuterIxsWithOffset,
		mirrorSurfaceAreaPerSupportPoint,
		maxRecommendedMirrorSurfaceAreaPerSupportPoint;

	// build canvas, context
	// pass in aperture twice because we want a square graph based on aperture (no focal length involved here)
	scaling = scalingFactor(config.canvasWidth, config.canvasHeight, aperture, aperture, config.canvasBorder);
	scaledAperture = scaling.scalingFactor * aperture;

	common.mirrorCellCanvasDiv().append(buildCanvasElement('mirrorCellCanvas', scaling.width, scaling.height));
	canvas = common.mirrorCellCanvasID();
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.font = config.canvasFont;
	centerPt = point(canvas.width / 2, canvas.height / 2);

	if (config.drawCanvasOutline) {
		drawCanvasOutline(context, canvas);
	}

	// draw mirror edge
	drawCircle(context, centerPt, scaledAperture / 2, config.canvasLineWidth, config.canvasStructureStyle);
	// draw mirror center
	drawCircle(context, centerPt, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);

	// draw cell components
	switch (mirrorSupportPoints) {
	case 3:
		mirrorCellDimensions = calcMirrorCell3pt(radius);
		for (ix = 0; ix < 3; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 3, 0, mirrorCellDimensions.radius * scaling.scalingFactor));
		}
		drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		explanatoryText = '3 pt support radius: '
				+ roundToDecimal(mirrorCellDimensions.radius, config.decimalPointsDimension)
				+ uomLengthLit;
		break;
	case 6:
		mirrorCellDimensions = calcMirrorCell6pt(radius);
		for (ix = 0; ix < 6; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 6, uom.oneRev / 12, mirrorCellDimensions.radius * scaling.scalingFactor));
		}
		centerCircles = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// draw pivot bars
		for (ix = 0; ix < 6; ix += 2) {
			ix2 = ix + 1;
			if (ix2 === 6) {
				ix2 = 0;
			}
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCircles[ix], centerCircles[ix2]);
		}
		// draw bar support points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 3; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 3, uom.oneRev / 6, mirrorCellDimensions.balanceRadius * scaling.scalingFactor));
		}
		drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		barLength = getDistance(centerCircles[0], centerCircles[1]);
		explanatoryText = '6 pt support radius: '
				+ roundToDecimal(mirrorCellDimensions.radius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; balance bar radius: '
				+ roundToDecimal(mirrorCellDimensions.balanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '<br>bar length: '
				+ roundToDecimal(barLength / scaling.scalingFactor, config.decimalPointsDimension)
				+ uomLengthLit;
		break;
	case 9:
		mirrorCellDimensions = calcMirrorCell9pt(radius);
		// outer radius points
		for (ix = 0; ix < 6; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 6, uom.oneRev / 12, mirrorCellDimensions.outerRadius * scaling.scalingFactor));
		}
		centerCirclesOuter = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// inner radius points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 3; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 3, 0, mirrorCellDimensions.innerRadius * scaling.scalingFactor));
		}
		centerCirclesInner = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// draw triangles
		for (ix = 1; ix < 6; ix += 2) {
			ix2 = ix + 1;
			if (ix2 === 6) {
				ix2 = 0;
			}
			ixInner = Math.floor(ix / 2 + 1);
			if (ixInner === 3) {
				ixInner = 0;
			}
			// line between outer points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix], centerCirclesOuter[ix2]);
			// lines to inner point
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix], centerCirclesInner[ixInner]);
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix2], centerCirclesInner[ixInner]);
		}
		// draw triangle balance points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 3; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 3, 0, mirrorCellDimensions.balanceRadius * scaling.scalingFactor));
		}
		drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// get triangle lengths: between outer points and between outer and inner points
		triangleSideLengths.push(getDistance(centerCirclesOuter[0], centerCirclesOuter[1]));
		triangleSideLengths.push(getDistance(centerCirclesOuter[0], centerCirclesInner[0]));
		explanatoryText = '9 pt support inner radius: '
				+ roundToDecimal(mirrorCellDimensions.innerRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; outer radius: '
				+ roundToDecimal(mirrorCellDimensions.outerRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; triangle balance radius: '
				+ roundToDecimal(mirrorCellDimensions.balanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '<br>triangle side lengths: '
				+ roundToDecimal(triangleSideLengths[0] / scaling.scalingFactor, config.decimalPointsDimension)
				+ ' x '
				+ roundToDecimal(triangleSideLengths[1] / scaling.scalingFactor, config.decimalPointsDimension)
				+ ' x '
				+ roundToDecimal(triangleSideLengths[1] / scaling.scalingFactor, config.decimalPointsDimension)
				+ uomLengthLit;
		break;
	case 12:
		mirrorCellDimensions = calcMirrorCell12pt(radius);
		// outer radius points
		for (ix = 0; ix < 9; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 9, 0, mirrorCellDimensions.outerRadius * scaling.scalingFactor));
		}
		centerCirclesOuter = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// inner radius points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 3; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 3, uom.oneRev / 6, mirrorCellDimensions.innerRadius * scaling.scalingFactor));
		}
		centerCirclesInner = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// draw 3 outer bars, skipping outer support point between bars
		for (ix = 0; ix < 3; ix += 1) {
			ix2 = ix * 3;
			// line between outer points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix2], centerCirclesOuter[ix2 + 1]);
			// save midpoint between the outer points
			CGpoint = findOffsetCenterBetweenTwoPoints(centerCirclesOuter[ix2], centerCirclesOuter[ix2 + 1], mirrorCellDimensions.outerBarBalanceAlongBar);
			outerPointsMidPoints.push(CGpoint);
			drawCircle(context, CGpoint, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
			// to verify bar length in calcLib.calcMirrorCell12pt()
			// barLength = Math.sqrt(Math.pow(centerCirclesOuter[ix2 + 1].x - centerCirclesOuter[ix2].x, 2) + Math.pow(centerCirclesOuter[ix2 + 1].y - centerCirclesOuter[ix2].y, 2));
		}
		// draw 3 bars between inner and outer points
		for (ix = 0; ix < 3; ix += 1) {
			ix2 = ix * 3;
			// line between inner and outer points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesInner[ix], centerCirclesOuter[ix2 + 2]);
			// save midpoint between the outer points
			CGpoint = findOffsetCenterBetweenTwoPoints(centerCirclesInner[ix], centerCirclesOuter[ix2 + 2], mirrorCellDimensions.innerBarBalanceAlongBar);
			midPointsMidPoints.push(CGpoint);
			drawCircle(context, CGpoint, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
			// to verify bar length in calcLib.calcMirrorCell12pt()
			// barLength = Math.sqrt(Math.pow(centerCirclesOuter[ix2 + 2].x - centerCirclesInner[ix].x, 2) + Math.pow(centerCirclesOuter[ix2 + 2].y - centerCirclesInner[ix].y, 2));
		}
		// draw mid-bar line connecting two previous lines
		for (ix = 0; ix < 3; ix += 1) {
			ix2 = ix - 1;
			if (ix2 < 0) {
				ix2 += 3;
			}
			// line
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, midPointsMidPoints[ix2], outerPointsMidPoints[ix]);
			CGpoint = findOffsetCenterBetweenTwoPoints(midPointsMidPoints[ix2], outerPointsMidPoints[ix], mirrorCellDimensions.midBarBalanceAlongBar);
			drawCircle(context, CGpoint, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
			// to verify collimation radius in calcLib.calcMirrorCell12pt()
			// collimationRadius = Math.sqrt(Math.pow(CGpoint.x - centerPt.x, 2) + Math.pow(CGpoint.y - centerPt.y, 2));
			// drawCircle(context, centerPt, collimationRadius, config.canvasLineWidth, config.canvasStructureStyle);
			// to verify bar length in calcLib.calcMirrorCell12pt()
			// barLength = Math.sqrt(Math.pow(outerPointsMidPoints[ix].x - midPointsMidPoints[ix2].x, 2) + Math.pow(outerPointsMidPoints[ix].y - midPointsMidPoints[ix2].y, 2));
		}
		explanatoryText = '12 pt support inner radius: '
				+ roundToDecimal(mirrorCellDimensions.innerRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; outer radius: '
				+ roundToDecimal(mirrorCellDimensions.outerRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; collimation radius: '
				+ roundToDecimal(mirrorCellDimensions.collimationRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '<br>outer bar length: '
				+ roundToDecimal(mirrorCellDimensions.outerBarLength, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; mid bar length: '
				+ roundToDecimal(mirrorCellDimensions.midBarLength, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; inner bar length: '
				+ roundToDecimal(mirrorCellDimensions.innerBarLength, config.decimalPointsDimension)
				+ uomLengthLit
				+ '<br>outer bar support point from end: '
				+ roundToDecimal(mirrorCellDimensions.outerBarBalance, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; mid bar support point from end: '
				+ roundToDecimal(mirrorCellDimensions.midBarBalance, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; inner bar support point from end: '
				+ roundToDecimal(mirrorCellDimensions.innerBarBalance, config.decimalPointsDimension)
				+ uomLengthLit;
		break;
	case 18:
		mirrorCellDimensions = calcMirrorCell18pt(radius);
		// outer radius points
		for (ix = 0; ix < 12; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 12, uom.oneRev / 24, mirrorCellDimensions.outerRadius * scaling.scalingFactor));
		}
		centerCirclesOuter = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// inner radius points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 6; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 6, uom.oneRev / 12, mirrorCellDimensions.innerRadius * scaling.scalingFactor));
		}
		centerCirclesInner = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// draw triangles
		for (ix = 0; ix < 12; ix += 2) {
			ix2 = ix + 1;
			if (ix2 === 12) {
				ix2 = 0;
			}
			ixInner = Math.floor(ix / 2);
			if (ixInner === 6) {
				ixInner = 0;
			}
			// line between outer points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix], centerCirclesOuter[ix2]);
			// lines to inner point
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix], centerCirclesInner[ixInner]);
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix2], centerCirclesInner[ixInner]);
		}
		// draw triangle balance points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 6; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 6, uom.oneRev / 12, mirrorCellDimensions.triangleBalanceRadius * scaling.scalingFactor));
		}
		centerCircles = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// draw pivot bars
		for (ix = 1; ix < 6; ix += 2) {
			ix2 = ix + 1;
			if (ix2 === 6) {
				ix2 = 0;
			}
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCircles[ix], centerCircles[ix2]);
		}
		// draw pivot bar balance points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 3; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 3, 0, mirrorCellDimensions.pivotBarBalanceRadius * scaling.scalingFactor));
		}
		drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		barLength = getDistance(centerCircles[0], centerCircles[1]);
		// get triangle lengths: between outer points and between outer and inner points
		triangleSideLengths.push(getDistance(centerCirclesOuter[0], centerCirclesOuter[1]));
		triangleSideLengths.push(getDistance(centerCirclesOuter[0], centerCirclesInner[0]));
		explanatoryText = '18 pt support inner radius: '
				+ roundToDecimal(mirrorCellDimensions.innerRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; outer radius: '
				+ roundToDecimal(mirrorCellDimensions.outerRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; triangle balance radius: '
				+ roundToDecimal(mirrorCellDimensions.triangleBalanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; balance bar radius: '
				+ roundToDecimal(mirrorCellDimensions.pivotBarBalanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '<br>bar length: '
				+ roundToDecimal(barLength / scaling.scalingFactor, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; triangle side lengths: '
				+ roundToDecimal(triangleSideLengths[0] / scaling.scalingFactor, config.decimalPointsDimension)
				+ ' x '
				+ roundToDecimal(triangleSideLengths[1] / scaling.scalingFactor, config.decimalPointsDimension)
				+ ' x '
				+ roundToDecimal(triangleSideLengths[1] / scaling.scalingFactor, config.decimalPointsDimension)
				+ uomLengthLit;
		break;
	case 27:
		mirrorCellDimensions = calcMirrorCell27pt(radius);
		// inner 6 radius points
		for (ix = 0; ix < 6; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 6, uom.oneRev / 12, mirrorCellDimensions.inner6Radius * scaling.scalingFactor));
		}
		centerCirclesInner = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// mid 9 radius points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 9; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 9, 0, mirrorCellDimensions.mid9Radius * scaling.scalingFactor));
		}
		centerCirclesMid = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// outer 12 radius points
		xyOffsetsFromMirrorCenter = [];
		for (ix = 0; ix < 12; ix += 1) {
			xyOffsetsFromMirrorCenter.push(buildXYOffsetsFromMirrorCenter(ix, 12, uom.oneRev / 24, mirrorCellDimensions.outer12Radius * scaling.scalingFactor));
		}
		centerCirclesOuter = drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter);
		// draw inner triangles
		for (ixTriangle = 0; ixTriangle < 3; ixTriangle += 1) {
			ix = ixTriangle * 2 - 1;
			if (ix < 0) {
				ix = 5;
			}
			ix2 = ix + 1;
			if (ix2 === 6) {
				ix2 = 0;
			}
			ixOuter = ixTriangle * 3;
			// line between inner points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesInner[ix], centerCirclesInner[ix2]);
			// lines to outer point
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesInner[ix], centerCirclesMid[ixOuter]);
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesInner[ix2], centerCirclesMid[ixOuter]);
			// save for later
			innerTriangles.push([centerCirclesInner[ix], centerCirclesInner[ix2], centerCirclesMid[ixOuter]]);
		}
		// draw outer triangles
		for (ixTriangle = 0; ixTriangle < 6; ixTriangle += 1) {
			ix = ixTriangle * 2;
			ix2 = ix + 1;
			ixInner = [1, 2, 4, 5, 7, 8][ixTriangle];
			// line between outer points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix], centerCirclesOuter[ix2]);
			// lines to inner point
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix], centerCirclesMid[ixInner]);
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, centerCirclesOuter[ix2], centerCirclesMid[ixInner]);
			// save for later
			outerTriangles.push([centerCirclesMid[ixInner], centerCirclesOuter[ix], centerCirclesOuter[ix2]]);
		}
		// draw base triangles
		// get points of base triangle using moments
		for (ix = 0; ix < 3; ix += 1) {
			ix2 = (ix * 2 + 5) % 6;
			innerPoint = findWeightedCenterOfPoints(innerTriangles[ix]);
			outerPoint1 = findWeightedCenterOfPoints(outerTriangles[ix2]);
			outerPoint2 = findWeightedCenterOfPoints(outerTriangles[(ix2 + 1) % 6]);
			// compare calculated value against measured value in calcMirrorCell27pt()
			//var radius = Math.sqrt(Math.pow(outerPoint1.x - centerPt.x, 2) + Math.pow(outerPoint1.y - centerPt.y, 2)) / scaling.scalingFactor;
			drawCircle(context, innerPoint, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
			drawCircle(context, outerPoint1, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
			drawCircle(context, outerPoint2, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
			// line between outer points
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, outerPoint1, outerPoint2);
			// lines to inner point
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, outerPoint1, innerPoint);
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, outerPoint2, innerPoint);
			// get and draw CG of base triangle
			CGpoint = findWeightedCenterOfPoints([innerPoint, outerPoint1, outerPoint2]);
			drawCircle(context, CGpoint, config.mirrorCellSupportPointRadius, config.canvasLineWidth, config.canvasStructureStyle);
		}
		angles = _.map(mirrorCellDimensions.outerTriangleBalancePtAngles, function (v) { return v / uom.degToRad; }).join(', ');
		explanatoryText = '27 pt support inner 6 points radius: '
				+ roundToDecimal(mirrorCellDimensions.inner6Radius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; mid 9 points radius: '
				+ roundToDecimal(mirrorCellDimensions.mid9Radius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; outer 12 points radius: '
				+ roundToDecimal(mirrorCellDimensions.outer12Radius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '<br>inner triangle center radius: '
				+ roundToDecimal(mirrorCellDimensions.innerTriangleBalanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; outer triangle center radius '
				+ roundToDecimal(mirrorCellDimensions.outerTriangleBalanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ '; base triangle center radius: '
				+ roundToDecimal(mirrorCellDimensions.baseTriangleBalanceRadius, config.decimalPointsDimension)
				+ uomLengthLit
				+ ' at angles of '
				+ angles
				+ ' degs';
		break;
	case 54:
		// see mirror cell 54 pt support naming.jpg and lockwood 42 inch f3.75 54 pt support
		/* xyOffsetsFromMirrorCenter takes the form of an array of arrays, each sub-array contains x, y values
			0: {x: 0, y: 56.35000000000001}, ...
			1: {x: 31.705333025058792, y: 118.32591372041087}, ...
			... */
		mirrorCellDimensions = calcMirrorCell54pt(radius);
		// draw support pts
		drawPoints54Helper(mirrorCellDimensions.supportPts, xyOffsetsFromMirrorCenter, scaling.scalingFactor, context, centerPt);
		// draw triangles
		// inner triangles...
		for (ix = 0; ix < mirrorCellDimensions.supportPts[0].pts; ix += 1) {
			IxOuters = getOuterIxsNoOffset(ix, mirrorCellDimensions.supportPts[1].pts);
			drawTriangles54Helper(ix, xyOffsetsFromMirrorCenter[0], xyOffsetsFromMirrorCenter[1], IxOuters.ix1, IxOuters.ix2, context, centerPt);
		}
		// outer triangles...
		for (ix = 0; ix < mirrorCellDimensions.supportPts[2].pts; ix += 1) {
			IxOuters = getOuterIxsWithOffset(ix);
			drawTriangles54Helper(ix, xyOffsetsFromMirrorCenter[2], xyOffsetsFromMirrorCenter[3], IxOuters.ix1, IxOuters.ix2, context, centerPt);
		}
		// draw pivot pts
		xyOffsetsFromMirrorCenter = [];
		drawPoints54Helper(mirrorCellDimensions.pivotPts, xyOffsetsFromMirrorCenter, scaling.scalingFactor, context, centerPt);
		// pivot triangles...
		for (ix = 0; ix < mirrorCellDimensions.pivotPts[0].pts; ix += 1) {
			IxOuters = getOuterIxsNoOffset(ix, mirrorCellDimensions.pivotPts[1].pts);
			drawTriangles54Helper(ix, xyOffsetsFromMirrorCenter[0], xyOffsetsFromMirrorCenter[1], IxOuters.ix1, IxOuters.ix2, context, centerPt);
		}
		// draw 3 pivot bars
		xyOffsetsFromMirrorCenter = [];
		drawPoints54Helper(mirrorCellDimensions.barPts, xyOffsetsFromMirrorCenter, scaling.scalingFactor, context, centerPt);
		for (ix = 0; ix < 3; ix += 1) {
			barOffsetPoint1 = xyOffsetsFromMirrorCenter[0][ix * 2];
			barOffsetPoint2 = xyOffsetsFromMirrorCenter[0][ix * 2 + 1];
			barPoint1 = point(barOffsetPoint1.x + centerPt.x, barOffsetPoint1.y + centerPt.y);
			barPoint2 = point(barOffsetPoint2.x + centerPt.x, barOffsetPoint2.y + centerPt.y);
			drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, barPoint1, barPoint2);
			// include the bar center
			barCenterPoint = point((barOffsetPoint1.x + barOffsetPoint2.x) / 2, (barOffsetPoint1.y + barOffsetPoint2.y) / 2);
			drawSupportPoints(context, centerPt, [barCenterPoint]);
		}
		// lengths, distances, sizing
		barRadius = mirrorCellDimensions.barPts[0].radius;
		barPtsHalfAngle = uom.oneRev / mirrorCellDimensions.barPts[0].pts / 2;
		barBalancePointRadius = barRadius * Math.cos(barPtsHalfAngle);
		barLength = barRadius * Math.sin(barPtsHalfAngle) * 2;

		outerPivotPtsHalfAngle = uom.oneRev / mirrorCellDimensions.pivotPts[1].pts / 2;
		largeTriangleOuterLength = mirrorCellDimensions.pivotPts[1].radius * Math.sin(outerPivotPtsHalfAngle) * 2;
		largeTriangleOuterHalfLength = largeTriangleOuterLength / 2;
		largeTriangleYLength = mirrorCellDimensions.pivotPts[1].radius * Math.cos(outerPivotPtsHalfAngle) - mirrorCellDimensions.pivotPts[0].radius;
		largeTriangleSidesLength = Math.sqrt(largeTriangleOuterHalfLength * largeTriangleOuterHalfLength + largeTriangleYLength * largeTriangleYLength);
		largeTrianglePivotFromFrontPtLength = mirrorCellDimensions.barPts[0].radius - mirrorCellDimensions.pivotPts[0].radius;

		innerTrianglePtsHalfAngle = uom.oneRev / mirrorCellDimensions.supportPts[1].pts / 2;
		innerTriangleOuterLength = mirrorCellDimensions.supportPts[1].radius * Math.sin(innerTrianglePtsHalfAngle) * 2;
		innerTriangleOuterHalfLength = innerTriangleOuterLength / 2;
		innerTriangleYLength = mirrorCellDimensions.supportPts[1].radius * Math.cos(innerTrianglePtsHalfAngle) - mirrorCellDimensions.supportPts[0].radius;
		innerTriangleSidesLength = Math.sqrt(innerTriangleOuterHalfLength * innerTriangleOuterHalfLength + innerTriangleYLength * innerTriangleYLength);
		innerTrianglePivotFromFrontPtLength = mirrorCellDimensions.pivotPts[0].radius - mirrorCellDimensions.supportPts[0].radius;

		// pretend that outer triangle is vertically centered
		outerTrianglePtsHalfAngle = uom.oneRev / mirrorCellDimensions.supportPts[3].pts / 2;
		outerTriangleOuterLength = mirrorCellDimensions.supportPts[3].radius * Math.sin(outerTrianglePtsHalfAngle) * 2;
		outerTriangleOuterHalfLength = outerTriangleOuterLength / 2;
		outerTriangleYLength = mirrorCellDimensions.supportPts[3].radius * Math.cos(outerTrianglePtsHalfAngle) - mirrorCellDimensions.supportPts[2].radius;
		outerTriangleSidesLength = Math.sqrt(outerTriangleOuterHalfLength * outerTriangleOuterHalfLength + outerTriangleYLength * outerTriangleYLength);
		outerTrianglePivotFromFrontPtLength = mirrorCellDimensions.pivotPts[1].radius - mirrorCellDimensions.supportPts[2].radius;

		// text...
		explanatoryText = '54 pt support radii = '
			+ _.map(mirrorCellDimensions.supportPts, (vp) => {return roundToDecimal(vp.radius, config.decimalPointsDimension) + uomLengthLit;}).join(', ')

			+ '<br>Bar length = '
			+ roundToDecimal(barLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', bar balance point radius = '
			+ roundToDecimal(barBalancePointRadius, config.decimalPointsDimension)
			+ uomLengthLit

			+ '<br>Large support triangle far side length = '
			+ roundToDecimal(largeTriangleOuterLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', sides length = '
			+ roundToDecimal(largeTriangleSidesLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', triangle pivot to front point length = '
			+ roundToDecimal(largeTrianglePivotFromFrontPtLength, config.decimalPointsDimension)
			+ uomLengthLit

			+ '<br>Inner triangle far side length = '
			+ roundToDecimal(innerTriangleOuterLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', sides length = '
			+ roundToDecimal(innerTriangleSidesLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', triangle pivot to front point length = '
			+ roundToDecimal(innerTrianglePivotFromFrontPtLength, config.decimalPointsDimension)
			+ uomLengthLit

			+ '<br>Outer triangle far side length = '
			+ roundToDecimal(outerTriangleOuterLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', sides length = '
			+ roundToDecimal(outerTriangleSidesLength, config.decimalPointsDimension)
			+ uomLengthLit
			+ ', triangle pivot to front point length = '
			+ roundToDecimal(outerTrianglePivotFromFrontPtLength, config.decimalPointsDimension)
			+ uomLengthLit;
		break;
	default:
		context.fillText('No mirror cell schematic available', centerPt.x, centerPt.y);
		explanatoryText = 'none';
	}

	mirrorSurfaceAreaPerSupportPoint = radius * radius * Math.PI / mirrorSupportPoints;
	maxRecommendedMirrorSurfaceAreaPerSupportPoint = 40;
	if (!common.imperial()) {
		maxRecommendedMirrorSurfaceAreaPerSupportPoint *= 25.4 * 25.4;
	}

	explanatoryText += '<br><br>Mirror surface area per support point: '
			+ roundToDecimal(mirrorSurfaceAreaPerSupportPoint, config.decimalPointsDimension)
			+ uomLengthLit
			+ '^2 (do not exceed '
			+ roundToDecimal(maxRecommendedMirrorSurfaceAreaPerSupportPoint, config.decimalPointsMaterialArea)
			+ ' '
			+ common.getAreaLit()
			+ ')';

	common.mirrorCellDetailsLabel().html(explanatoryText);
};

MLB.NewtDesigner.getOuterIxsWithOffset = function (ix) {
	return {
		ix1: ix * 2,
		ix2: ix * 2 + 1
	};
};

MLB.NewtDesigner.getOuterIxsNoOffset = function (ix, maxPts) {
	if (ix === 0) {
		return {
			ix1: maxPts - 1,
			ix2: 0
		};
	}
	return {
		ix1: ix * 2 - 1,
		ix2: ix * 2
	};
};

MLB.NewtDesigner.drawTriangles54Helper = function (ix, xyOffsetsFromMirrorCenterInner, xyOffsetsFromMirrorCenterOuter, ix1, ix2, context, centerPt) {
	var config = MLB.NewtDesigner.config,
		innerPoint,
		outerPoint1,
		outerPoint2,
		offsetInnerPoint,
		offsetOuterPoint1,
		offsetOuterPoint2,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine;

	offsetInnerPoint = xyOffsetsFromMirrorCenterInner[ix];
	offsetOuterPoint1 = xyOffsetsFromMirrorCenterOuter[ix1];
	offsetOuterPoint2 = xyOffsetsFromMirrorCenterOuter[ix2];
	// get the points from the mirror center
	innerPoint = point(offsetInnerPoint.x + centerPt.x, offsetInnerPoint.y + centerPt.y);
	outerPoint1 = point(offsetOuterPoint1.x + centerPt.x, offsetOuterPoint1.y + centerPt.y);
	outerPoint2 = point(offsetOuterPoint2.x + centerPt.x, offsetOuterPoint2.y + centerPt.y);
	// draw the 3 lines comprising the triangle
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, innerPoint, outerPoint1);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, innerPoint, outerPoint2);
	drawLine(context, config.canvasStructureStyle, config.canvasLineWidth, outerPoint1, outerPoint2);
};

MLB.NewtDesigner.drawPoints54Helper = function (pointsToDraw, xyOffsetsFromMirrorCenter, scalingFactor, context, centerPt) {
	var uom = MLB.sharedLib.uom,
		ix,
		offsetAngleRad,
		buildXYOffsetsFromMirrorCenter = MLB.NewtDesigner.buildXYOffsetsFromMirrorCenter,
		drawSupportPoints = MLB.NewtDesigner.drawSupportPoints;

	pointsToDraw.forEach((vp, ip) => { // value, index, array
		xyOffsetsFromMirrorCenter[ip] = [];
		for (ix = 0; ix < vp.pts; ix += 1) {
			offsetAngleRad = vp.offset
				? uom.oneRev / vp.pts / 2
				: 0;
			xyOffsetsFromMirrorCenter[ip].push(buildXYOffsetsFromMirrorCenter(ix, vp.pts, offsetAngleRad, vp.radius * scalingFactor));
		}
		drawSupportPoints(context, centerPt, xyOffsetsFromMirrorCenter[ip]);
	});
};

MLB.NewtDesigner.updateCurrentlySelectedDesigner = () => {
	var state = MLB.NewtDesigner.state,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		updateTelescopeResults = MLB.NewtDesigner.updateTelescopeResults,
		updateEyepieceOptimizerRows = MLB.NewtDesigner.updateEyepieceOptimizerRows,
		calcVisualDetection = MLB.NewtDesigner.calcVisualDetection,
		calcAndGraphDiag = MLB.NewtDesigner.calcAndGraphDiag,
		updateMirrorCellFromAperture = MLB.NewtDesigner.updateMirrorCellFromAperture,
		graphBaffles = MLB.NewtDesigner.graphBaffles,
		graphFocuserBaffles = MLB.NewtDesigner.graphFocuserBaffles,
		graphLowrider = MLB.NewtDesigner.graphLowrider,
		binoscopeWorkflow = MLB.NewtDesigner.binoscopeWorkflow,
		calcCG = MLB.NewtDesigner.calcCG,
		graphRocker = MLB.NewtDesigner.graphRocker,
		graphFlexRocker = MLB.NewtDesigner.graphFlexRocker,
		graphEquatorialTable = MLB.NewtDesigner.graphEquatorialTable;

	switch (state.currentDesigner) {
	case config.designIntroLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	case config.designTelescopeLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		updateTelescopeResults();
		break;
	case config.designVisualLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		calcVisualDetection();
		break;
	case config.designEyepiecesLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		updateEyepieceOptimizerRows();
		break;
	case config.designComaCorrectorLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	case config.designDiagonalLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().show();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		calcAndGraphDiag();
		break;
	case config.designSpiderLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	case config.designMirrorCellLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		updateMirrorCellFromAperture();
		break;
	case config.designBafflingLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().show();
		common.focuserSharedParms().show();
		common.diagonalSharedParms().show();

		graphBaffles();
		break;
	case config.designFocuserLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().show();
		common.focuserSharedParms().show();
		common.diagonalSharedParms().show();

		graphFocuserBaffles();
		break;
	case config.designLowriderBafflingLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().show();
		common.focuserSharedParms().show();
		common.diagonalSharedParms().hide();

		graphLowrider();
		break;
	case config.designBinoscopeLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		binoscopeWorkflow();
		break;
	case config.designCGLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().show();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		calcCG();
		break;
	case config.designTubeLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	case config.designMountLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	case config.designRockerLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().show();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		graphRocker();
		break;
	case config.designFlexRockerLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().show();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		graphFlexRocker();
		break;
	case config.designETLit:
		common.uomFocalRatioApertureSharedParms().show();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		graphEquatorialTable();
		break;
	case config.designExportImportLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	case config.designNotesLit:
		common.uomFocalRatioApertureSharedParms().hide();
		common.diagSharedParms().hide();
		common.tubeSharedParms().hide();
		common.focuserSharedParms().hide();
		common.diagonalSharedParms().hide();

		break;
	default:
		alert('Unknown state.currentDesigner value of ' + state.currentDesigner);
	}
};

// sort manufacturer, type, descending focal length;
MLB.NewtDesigner.sortEyepiecesJsonByManufacturerTypeFL = () => {
	var eyepiecesJson = MLB.eyepiecesJson;

	eyepiecesJson.eyepieces = eyepiecesJson.eyepieces.sort(function (x, y) {
		var xManufacturer = x.manufacturer,
			yManufacturer = y.manufacturer,
			xType = x.type,
			yType = y.type,
			xFL = +x.focalLengthmm,
			yFL = +y.focalLengthmm;

		if (xManufacturer === yManufacturer) {
			if (xType === yType) {
				return xFL > yFL
					? -1
					: xFL < yFL
						? 1
						: 0;
			}
			return xType > yType
				? 1
				: -1;
		}
		return xManufacturer > yManufacturer
			? 1
			: -1;
	});
};

// sort descending focal length, apparent field, type;
MLB.NewtDesigner.sortEyepiecesJsonByFLApparentFieldType = () => {
	var eyepiecesJson = MLB.eyepiecesJson;

	eyepiecesJson.eyepieces = eyepiecesJson.eyepieces.sort(function (x, y) {
		var xFL = +x.focalLengthmm,
			yFL = +y.focalLengthmm,
			xApparentField = +x.apparentField,
			yApparentField = +y.apparentField,
			xType = x.type,
			yType = y.type;

		if (xFL === yFL) {
			if (xApparentField === yApparentField) {
				return xType > yType
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

// sort descending real field, manufacturer;
MLB.NewtDesigner.sortEyepiecesJsonByTrueFieldManufacturer = () => {
	var eyepiecesJson = MLB.eyepiecesJson;

	eyepiecesJson.eyepieces = eyepiecesJson.eyepieces.sort(function (x, y) {
		var xFieldStop = +x.fieldStopmm,
			yFieldStop = +y.fieldStopmm,
			xManufacturer = x.manufacturer,
			yManufacturer = y.manufacturer;

		if (xFieldStop === yFieldStop) {
			return xManufacturer < yManufacturer
				? 1
				: -1;
		}
		return xFieldStop < yFieldStop
			? 1
			: -1;
	});
};

MLB.NewtDesigner.clearEyepieceSelections = () => {
	var config = MLB.NewtDesigner.config,
		eyepieceRow;

	for (eyepieceRow = 0; eyepieceRow < config.maxEyepieceRows; eyepieceRow += 1) {
		$('#' + config.EyeOptSelectID + eyepieceRow + ' option').remove();
	}
};

MLB.NewtDesigner.fillEyepieceSelections = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		eyepiecesJson = MLB.eyepiecesJson,
		buildEyepieceString = MLB.NewtDesigner.buildEyepieceString,
		eyepieceStr,
		optionStr,
		eyepieceRow;

	// fill eyepiece selection table rows
	$.each(eyepiecesJson.eyepieces, function (i, v) {
		// fill in missing field stops
		if (v.fieldStopmm === '') {
			v.fieldStopmm = +v.focalLengthmm * +v.apparentField / 57.3;
		}
		if (v.manufacturer === config.selectEyepieceLit) {
			eyepieceStr = v.manufacturer;
		} else {
			eyepieceStr = buildEyepieceString(v);
		}
		optionStr = '<option value="' + eyepieceStr + '">' + eyepieceStr + '</option>';
		// drop down boxes for eyepiece selection
		for (eyepieceRow = 0; eyepieceRow < config.maxEyepieceRows; eyepieceRow += 1) {
			$('#' + config.EyeOptSelectID + eyepieceRow).append(optionStr);
		}
		common.AEFEyepieceSelect().append(optionStr);
	});
};

MLB.NewtDesigner.setSelectedEyepieceFromTable = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		manufacturerStr,
		eyepieceStr,
		eyepieceRow = 0;

	for (eyepieceRow = 0; eyepieceRow < config.maxEyepieceRows; eyepieceRow++) {
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
	}
};

MLB.NewtDesigner.insertEyepiecesSelectLit = () => {
	var config = MLB.NewtDesigner.config,
		eyepiecesJson = MLB.eyepiecesJson;

	// remove existing selectEyepieceLit
	eyepiecesJson.eyepieces = eyepiecesJson.eyepieces.filter(function (eyepiece) {
		return eyepiece.manufacturer !== config.selectEyepieceLit;
	});
	// insert selectEyepieceLit at start of array
	eyepiecesJson.eyepieces.splice(0, 0, {manufacturer: config.selectEyepieceLit});
};

MLB.NewtDesigner.sortEyepiecesByManufacturerAddToSelections = () => {
	var sortEyepiecesJsonByManufacturerTypeFL = MLB.NewtDesigner.sortEyepiecesJsonByManufacturerTypeFL,
		insertEyepiecesSelectLit = MLB.NewtDesigner.insertEyepiecesSelectLit,
		clearEyepieceSelections = MLB.NewtDesigner.clearEyepieceSelections,
		fillEyepieceSelections = MLB.NewtDesigner.fillEyepieceSelections,
		setSelectedEyepieceFromTable = MLB.NewtDesigner.setSelectedEyepieceFromTable;

	sortEyepiecesJsonByManufacturerTypeFL();
	insertEyepiecesSelectLit();
	clearEyepieceSelections();
	fillEyepieceSelections();
	setSelectedEyepieceFromTable();
};

MLB.NewtDesigner.sortEyepiecesByFLAddToSelections = () => {
	var sortEyepiecesJsonByFLApparentFieldType = MLB.NewtDesigner.sortEyepiecesJsonByFLApparentFieldType,
		insertEyepiecesSelectLit = MLB.NewtDesigner.insertEyepiecesSelectLit,
		clearEyepieceSelections = MLB.NewtDesigner.clearEyepieceSelections,
		fillEyepieceSelections = MLB.NewtDesigner.fillEyepieceSelections,
		setSelectedEyepieceFromTable = MLB.NewtDesigner.setSelectedEyepieceFromTable;

	sortEyepiecesJsonByFLApparentFieldType();
	insertEyepiecesSelectLit();
	clearEyepieceSelections();
	fillEyepieceSelections();
	setSelectedEyepieceFromTable();
};

MLB.NewtDesigner.sortEyepiecesByTrueFieldAddToSelections = () => {
	var sortEyepiecesJsonByTrueFieldManufacturer = MLB.NewtDesigner.sortEyepiecesJsonByTrueFieldManufacturer,
		insertEyepiecesSelectLit = MLB.NewtDesigner.insertEyepiecesSelectLit,
		clearEyepieceSelections = MLB.NewtDesigner.clearEyepieceSelections,
		fillEyepieceSelections = MLB.NewtDesigner.fillEyepieceSelections,
		setSelectedEyepieceFromTable = MLB.NewtDesigner.setSelectedEyepieceFromTable;

	sortEyepiecesJsonByTrueFieldManufacturer();
	insertEyepiecesSelectLit();
	clearEyepieceSelections();
	fillEyepieceSelections();
	setSelectedEyepieceFromTable();
};

// called from $(window).ready()
MLB.NewtDesigner.runAllDesigners = () => {
	var updateTelescopeResults = MLB.NewtDesigner.updateTelescopeResults,
		updateEyepieceOptimizerRows = MLB.NewtDesigner.updateEyepieceOptimizerRows,
		calcVisualDetection = MLB.NewtDesigner.calcVisualDetection,
		calcAndGraphDiag = MLB.NewtDesigner.calcAndGraphDiag,
		graphBaffles = MLB.NewtDesigner.graphBaffles,
		graphFocuserBaffles = MLB.NewtDesigner.graphFocuserBaffles,
		graphLowrider = MLB.NewtDesigner.graphLowrider,
		binoscopeWorkflow = MLB.NewtDesigner.binoscopeWorkflow,
		calcCG = MLB.NewtDesigner.calcCG,
		graphRocker = MLB.NewtDesigner.graphRocker,
		graphFlexRocker = MLB.NewtDesigner.graphFlexRocker,
		graphEquatorialTable = MLB.NewtDesigner.graphEquatorialTable,
		updateMirrorCellFromAperture = MLB.NewtDesigner.updateMirrorCellFromAperture;

	updateTelescopeResults();
	updateEyepieceOptimizerRows();
	calcVisualDetection();
	calcAndGraphDiag();
	updateMirrorCellFromAperture();
	graphBaffles();
	graphFocuserBaffles();
	graphLowrider();
	binoscopeWorkflow();
	calcCG();
	graphRocker();
	graphFlexRocker();
	graphEquatorialTable();
};

MLB.NewtDesigner.updateSelected = function (btnId, designId, imageId) {
	var state = MLB.NewtDesigner.state,
		setBackground = MLB.NewtDesigner.setBackground,
		updateCurrentlySelectedDesigner = MLB.NewtDesigner.updateCurrentlySelectedDesigner;

	setBackground(btnId);

	// display off/on only if changed div
	if (designId !== state.currentDesigner) {
		// turn off display of current div
		$('[id=' + state.currentDesigner + ']').toggle();
		// display new div
		$('[id=' + designId + ']').toggle();
		// save newly displaying div
		state.currentDesigner = designId;

		// turn off display of current div
		$('[id=' + state.currentImage + ']').toggle();
		// display new div
		$('[id=' + imageId + ']').toggle();
		// save newly displaying div
		state.currentImage = imageId;
	}

	updateCurrentlySelectedDesigner();
};

MLB.NewtDesigner.scrollToTop = function (div) {
	if (div === undefined) {
		$('html,body').animate({
			scrollTop: 0
		});
	} else {
		$('html,body').animate({
			scrollTop: $('#' + div).offset().top
		});
	}
};

MLB.NewtDesigner.processAcordionBtnAndPanel = function (btn) {
	var panel;

	// see .active in css where adding the active class changes content from '+' to '-'
	btn.classList.toggle('active');
	panel = btn.nextElementSibling;
	if (panel.style.display === 'block') {
		panel.style.display = 'none';
	} else {
		panel.style.display = 'block';
	}
};

MLB.NewtDesigner.updateSelectedThenScrollToTop = function (accordionBtn, btnId, designId, imageId, div) {
	var processAcordionBtnAndPanel = MLB.NewtDesigner.processAcordionBtnAndPanel,
		updateSelected = MLB.NewtDesigner.updateSelected,
		scrollToTop = MLB.NewtDesigner.scrollToTop;

	if (accordionBtn) {
		processAcordionBtnAndPanel(accordionBtn);
	}
	updateSelected(btnId, designId, imageId);
	scrollToTop(div);
};

// eg, .../NewtDesigner.html#diagonal
MLB.NewtDesigner.processURLhash = () => {
	var config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		jumpTo = config.jumpTo,
		updateSelectedThenScrollToTop = MLB.NewtDesigner.updateSelectedThenScrollToTop,
		importMelBartels30InchDesign = MLB.NewtDesigner.importMelBartels30InchDesign,
		hash;

	if (!window.location.hash) {
		return;
	}

	hash = window.location.hash.substring(1);

	// updateSelectedThenScrollToTop(...) must define the first parm, a button, to open the corresponding accordion section; if no accordion button then leave undefined;
	// if jumping to a designer leave the first parm undefined and use undefined or config.uomFocalRatioApertureSharedParmsLit for the final parm depending if the shared parms is to be at the top of the screen
	switch(hash) {
	// introduction

	// telescope designer
	case jumpTo.telescope:
		updateSelectedThenScrollToTop(undefined, config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, undefined);
		break;
	case jumpTo.whatDoesATelescopeDo:
		updateSelectedThenScrollToTop(common.btnWhatDoesATelescopeDo(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.telescopeParts:
		updateSelectedThenScrollToTop(common.btnTelescopeParts(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.howDoesATelescopeWork:
	//sub-sections of howDoesATelescopeWork...
	case jumpTo.scopePerformanceAsAFunctionOfExitPupil:
	case jumpTo.focalLengthAndAperture:
	case jumpTo.focalRatios:
	case jumpTo.apparentSizeImageSize:
	case jumpTo.FOV:
	case jumpTo.calcApertureFREtendue:
	case jumpTo.fourXs:
	case jumpTo.rayTracing:
	case jumpTo.theEyepiece:
	case jumpTo.theEye:
	case jumpTo.resolution:
	case jumpTo.diffractionAiryDisk:
	case jumpTo.etendue:
	case jumpTo.HET:
	case jumpTo.lowMags:
		updateSelectedThenScrollToTop(common.btnHowDoesATelescopeWork(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	//...end sub-sections
	case jumpTo.idealTelescope:
		updateSelectedThenScrollToTop(common.btnIdealTelescope(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.telescopeCriteria:
		updateSelectedThenScrollToTop(common.btnTelescopeCriteria(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.makingYourOwnTelescope:
		updateSelectedThenScrollToTop(common.btnMakeYourOwnTelescope(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.RFT:
		updateSelectedThenScrollToTop(common.btnRFT(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.collimation:
		updateSelectedThenScrollToTop(common.btnCollimation(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.focusingTolerance:
		updateSelectedThenScrollToTop(common.btnFocusingTolerance(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.turbulence:
		updateSelectedThenScrollToTop(common.btnTurbulence(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.fieldCurvature:
		updateSelectedThenScrollToTop(common.btnFieldCurvature(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.natureOfTelescopeDesign:
		updateSelectedThenScrollToTop(common.btnNatureOfTelescopeDesign(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.foldingSlidingScopes:
		updateSelectedThenScrollToTop(common.btnFoldingSlidingScopes(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.whoInventedTheReflectingTelescope:
		updateSelectedThenScrollToTop(common.btnWhoInventedTheReflectingTelescope(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	case jumpTo.formulae:
		updateSelectedThenScrollToTop(common.btnUsefulFormulae(), config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit, hash);
		break;
	// visual detection
	case jumpTo.visualDetection:
		updateSelectedThenScrollToTop(undefined, config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, undefined);
		break;
	case jumpTo.visualUom:
		updateSelectedThenScrollToTop(common.btnVisualUom(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualMagnitudeScale:
		updateSelectedThenScrollToTop(common.btnVisualMagnitudeScale(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualBortleScale:
		updateSelectedThenScrollToTop(common.btnVisualBortleScale(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualObjectTypes:
		updateSelectedThenScrollToTop(common.btnVisualObjectTypes(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualObjectBrightness:
		updateSelectedThenScrollToTop(common.btnVisualObjectBrightness(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualHowFaint:
		updateSelectedThenScrollToTop(common.btnVisualHowFaint(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualApertureVsLP:
		updateSelectedThenScrollToTop(common.btnVisualApertureVsLP(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualHowToObserve:
		updateSelectedThenScrollToTop(common.btnvisualHowToObserve(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualBinoscopes:
		updateSelectedThenScrollToTop(common.btnVisualBinoscopes(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	case jumpTo.visualNightVisionDevices:
		updateSelectedThenScrollToTop(common.btnVisualNightVisionDevices(), config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit, hash);
		break;
	// eyepieces
	case jumpTo.eyepieces:
		updateSelectedThenScrollToTop(undefined, config.btnSelectEyepiecesLit, config.designEyepiecesLit, config.designEyepieceImageLit, undefined);
		break;
	case jumpTo.magnification:
		updateSelectedThenScrollToTop(common.btnMagnification(), config.btnSelectEyepiecesLit, config.designEyepiecesLit, config.designEyepieceImageLit, hash);
		break;
	// coma corrector
	case jumpTo.comaCorrector:
		updateSelectedThenScrollToTop(undefined, config.btnSelectComaCorrectorLit, config.designComaCorrectorLit, config.designComaCorrectorImageLit, undefined);
		break;
	// diagonal designer
	case jumpTo.diagonal:
		updateSelectedThenScrollToTop(undefined, config.btnSelectDiagonalLit, config.designDiagonalLit, config.designDiagonalImageLit, undefined);
		break;
	case jumpTo.secondarySizeExperiment:
		updateSelectedThenScrollToTop(common.btnSecondarySizeExperiment(), config.btnSelectDiagonalLit, config.designDiagonalLit, config.designDiagonalImageLit, hash);
		break;
	case jumpTo.diagonalOffsetStudy:
		updateSelectedThenScrollToTop(common.btnDiagonalOffsetStudy(), config.btnSelectDiagonalLit, config.designDiagonalLit, config.designDiagonalImageLit, hash);
		break;
	case jumpTo.optimizeDiagonalSize:
	case jumpTo.twoUnknownOptimizations:
		updateSelectedThenScrollToTop(common.btnOptimizeDiagonalSize(), config.btnSelectDiagonalLit, config.designDiagonalLit, config.designDiagonalImageLit, hash);
		break;
	case jumpTo.offAxisMask:
		updateSelectedThenScrollToTop(common.btnOffAxisMask(), config.btnSelectDiagonalLit, config.designDiagonalLit, config.designDiagonalImageLit, hash);
		break;
	// spider and diffraction
	case jumpTo.spiderDiffraction:
		updateSelectedThenScrollToTop(undefined, config.btnSelectSpiderLit, config.designSpiderLit, config.designSpiderImageLit, undefined);
		break;
	// mirror cell
	case jumpTo.mirrorCell:
		updateSelectedThenScrollToTop(undefined, config.btnSelectMirrorCellLit, config.designMirrorCellLit, config.designMirrorCellImageLit, undefined);
		break;
	case jumpTo.mirrorBackSupport:
		updateSelectedThenScrollToTop(common.btnMirrorBackSupport(), config.btnSelectMirrorCellLit, config.designMirrorCellLit, config.designMirrorCellImageLit, hash);
		break;
	case jumpTo.mirrorEdgeSupport:
		updateSelectedThenScrollToTop(common.btnMirrorEdgeSupport(), config.btnSelectMirrorCellLit, config.designMirrorCellLit, config.designMirrorCellImageLit, hash);
		break;
	case jumpTo.mirrorVentilation:
		updateSelectedThenScrollToTop(common.btnMirrorVentilation(), config.btnSelectMirrorCellLit, config.designMirrorCellLit, config.designMirrorCellImageLit, hash);
		break;
	// focuser
	case jumpTo.focuser:
		updateSelectedThenScrollToTop(undefined, config.btnSelectFocuserLit, config.designFocuserLit, config.designFocuserImageLit, undefined);
		break;
	// optical layout, baffling
	case jumpTo.opticalLayoutBaffling:
		updateSelectedThenScrollToTop(undefined, config.btnSelectBafflingLit, config.designBafflingLit, config.designBafflingImageLit, undefined);
		break;
	// lowrider layout, baffling
	case jumpTo.lowrider:
		updateSelectedThenScrollToTop(undefined, config.btnSelectLowriderBafflingLit, config.designLowriderBafflingLit, config.designLowriderBafflingImageLit, undefined);
		break;
	// binoscope
	case jumpTo.binoscope:
		updateSelectedThenScrollToTop(undefined, config.btnSelectBinoscopeLit, config.designBinoscopeLit, config.designBinoscopeImageLit, undefined);
		break;
	case jumpTo.binoscopeVisualObs:
		updateSelectedThenScrollToTop(common.btnBinoscopeVisualObs(), config.btnSelectBinoscopeLit, config.designBinoscopeLit, config.designBinoscopeImageLit, hash);
		break;
	case jumpTo.OSPBinoscopes:
		updateSelectedThenScrollToTop(common.btnOSPBinoscopes(), config.btnSelectBinoscopeLit, config.designBinoscopeLit, config.designBinoscopeImageLit, hash);
		break;
	case jumpTo.binoscopeDesign:
		updateSelectedThenScrollToTop(common.btnBinoscopeDesign(), config.btnSelectBinoscopeLit, config.designBinoscopeLit, config.designBinoscopeImageLit, hash);
		break;
	// center of gravity
	case jumpTo.COG:
		updateSelectedThenScrollToTop(undefined, config.btnSelectCGLit, config.designCGLit, config.designCGImageLit, undefined);
		break;
	// tube types
	case jumpTo.tubeTypes:
		updateSelectedThenScrollToTop(undefined, config.btnSelectTubeLit, config.designTubeLit, config.designTubeImageLit, undefined);
		break;
	// mount types
	case jumpTo.mountTypes:
		updateSelectedThenScrollToTop(undefined, config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, undefined);
		break;
	case jumpTo.vibration:
		updateSelectedThenScrollToTop(common.btnVibration(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	case jumpTo.ballscopes:
		updateSelectedThenScrollToTop(common.btnBallscopes(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	case jumpTo.panMount:
		updateSelectedThenScrollToTop(common.btnPanMount(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	case jumpTo.EarlOfCrawford:
		updateSelectedThenScrollToTop(common.btnEarlOfCrawford(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	case jumpTo.threeAxisMounts:
		updateSelectedThenScrollToTop(common.btnThreeAxisMounts(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	case jumpTo.Holcombe:
		updateSelectedThenScrollToTop(common.btnHolcombe(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	case jumpTo.Morse:
		updateSelectedThenScrollToTop(common.btnMorse(), config.btnSelectMountLit, config.designMountLit, config.designMountImageLit, hash);
		break;
	// rocker
	case jumpTo.rocker:
		updateSelectedThenScrollToTop(undefined, config.btnSelectRockerLit, config.designRockerLit, config.designRockerImageLit, undefined);
		break;
	case jumpTo.movementFriction:
		updateSelectedThenScrollToTop(undefined, config.btnSelectRockerLit, config.designRockerLit, config.designRockerImageLit, hash);
		break;
	// flex rocker
	case jumpTo.flexRocker:
		updateSelectedThenScrollToTop(undefined, config.btnSelectFlexRockerLit, config.designFlexRockerLit, config.designFlexRockerImageLit, undefined);
		break;
	// equatorial table
	case jumpTo.ET:
		updateSelectedThenScrollToTop(undefined, config.btnSelectETLit, config.designETLit, config.designETImageLit, undefined);
		break;
	case jumpTo.omniLatitudeET:
		updateSelectedThenScrollToTop(common.btnOmniLatitudeET(), config.btnSelectETLit, config.designETLit, config.designETImageLit, hash);
		break;
	case jumpTo.turretET:
		updateSelectedThenScrollToTop(common.btnTurretET(), config.btnSelectETLit, config.designETLit, config.designETImageLit, hash);
		break;
	case jumpTo.tiltET:
		updateSelectedThenScrollToTop(common.btnTiltET(), config.btnSelectETLit, config.designETLit, config.designETImageLit, hash);
		break;
	// export and import designs
	case jumpTo.exportImport:
		updateSelectedThenScrollToTop(undefined, config.btnSelectExportImportLit, config.designExportImportLit, config.designExportImportImageLit, undefined);
		break;
   case jumpTo.design30inch:
		importMelBartels30InchDesign();
		break;
	case jumpTo.proposedDesign30inchBinoscope:
		importMelBartels30InchDesign();
		updateSelectedThenScrollToTop(undefined, config.btnSelectBinoscopeLit, config.designBinoscopeLit, config.designBinoscopeImageLit, undefined);
		break;
	default:
		alert('Unknown or no longer valid URL hash of #' + hash + ' in processURLhash()');
	}
};

MLB.NewtDesigner.setBinoscopeLocksDistanceLogic = () => {
	var common = MLB.NewtDesigner.common;

	common.chBoxBinoscopeLockSecondaryBendingAngle().prop('checked', false);
	common.chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle().prop('checked', false);
};

MLB.NewtDesigner.setBinoscopeLocksAnglesLogic = function (secondaryBendingAngle) {
	var common = MLB.NewtDesigner.common;

	if (secondaryBendingAngle) {
		common.chBoxBinoscopeLockSecondaryBendingAngle().prop('checked', true);
		common.chBoxBinoscopeLockEyepieceDivergence().prop('checked', false);
		common.chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle().prop('checked', false);
		return;
	}
	common.chBoxBinoscopeLockSecondaryBendingAngle().prop('checked', false);
	// only set if chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle not set
	if (!common.binoscopeLockEyepieceDivergenceIncludeTertiarySecondaryRightAngle()) {
		common.chBoxBinoscopeLockEyepieceDivergence().prop('checked', true);
	}
};

// eg, focalLengthIx: 3, trueFieldOfViewIx: 7
MLB.NewtDesigner.sortEyepieceTable = function (ix) {
	var config = MLB.NewtDesigner.config,
		manufacturerStr = config.manufacturerMatchStr,
		manufacturerIx = config.manufacturerMatchIx,
		eyepieceTable = document.getElementById(config.eyepieceTableLit),
		eyepieceRows = eyepieceTable.rows;

	Array.from(eyepieceRows)
		.sort(function (a, b) {
			var mText = b.cells[manufacturerIx].textContent,
				aText = a.cells[ix].textContent,
				bText = b.cells[ix].textContent,
				aNum,
				bNum;

			// 1st row is column headers; detect and abort the sort
			if (mText.startsWith(manufacturerStr)) {
				return 1;
			}
			// empty rows
			if (aText == '') {
				return 1;
			}
			if (bText == '') {
				return -1;
			}
			//FL and TFOV needs mm or deg stripped then converted to a number
			aNum = +aText.replace('mm', '').replace('deg', '');
			bNum = +bText.replace('mm', '').replace('deg', '');

			// eg, for default example ordered 31, 17, 6
			// aNum: 17, bNum: 31 followed by aNum: 6, bNum: 17
			// console.log('aNum: ' + aNum + ', bNum: ' + bNum);

			// sorts high to low
			return bNum - aNum;
		})
		// if row already exists then appendChild() moves the row to the new position
		.forEach(row => eyepieceTable.appendChild(row));
};

MLB.NewtDesigner.updateEyepieceFocuserTravelDistance = (distanceFromObjectiveToObject) => {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		uomLengthLit = common.getUomLengthLit(),
		focalLength = common.telescopeFocalLengthVal(),
		eyepieceTravel = MLB.calcLib.eyepieceTravel;

	common.eyepieceTravelLabel().html(
			' in '
			+ uomLengthLit
			+ ' therefore eyepiece/focuser travel distance is '
			+ roundToDecimal(eyepieceTravel(focalLength, distanceFromObjectiveToObject), config.decimalPointsDimension));
};

$(window).ready(function () {
	var state = MLB.NewtDesigner.state,
		updateSelected = MLB.NewtDesigner.updateSelected,
		scrollToTop = MLB.NewtDesigner.scrollToTop,
		updateTelescopeResults = MLB.NewtDesigner.updateTelescopeResults,
		updateAEF = MLB.NewtDesigner.updateAEF,
		updateEyepieceOptimizerRows = MLB.NewtDesigner.updateEyepieceOptimizerRows,
		sortEyepiecesByManufacturerAddToSelections = MLB.NewtDesigner.sortEyepiecesByManufacturerAddToSelections,
		sortEyepiecesByFLAddToSelections = MLB.NewtDesigner.sortEyepiecesByFLAddToSelections,
		sortEyepiecesByTrueFieldAddToSelections = MLB.NewtDesigner.sortEyepiecesByTrueFieldAddToSelections,
		buildEyepieceHtmlTable = MLB.NewtDesigner.buildEyepieceHtmlTable,
		sortEyepieceTable = MLB.NewtDesigner.sortEyepieceTable,
		setEyeOptSelectedEyepiece = MLB.NewtDesigner.setEyeOptSelectedEyepiece,
		removeEyeOptSelectedEyepiece = MLB.NewtDesigner.removeEyeOptSelectedEyepiece,
		listWidestFieldEyepieces = MLB.NewtDesigner.listWidestFieldEyepieces,
		findWidestFieldEyepiece = MLB.NewtDesigner.findWidestFieldEyepiece,
		copySelectedEyepieceToEyepieceTable = MLB.NewtDesigner.copySelectedEyepieceToEyepieceTable,
		updateFocalPlaneToDiagDistanceFromFocuserDesigner = MLB.NewtDesigner.updateFocalPlaneToDiagDistanceFromFocuserDesigner,
		calcFRMaxEtendueFR = MLB.NewtDesigner.calcFRMaxEtendueFR,
		calcFRMaxEtendueEtendue = MLB.NewtDesigner.calcFRMaxEtendueEtendue,
		runAllDesigners = MLB.NewtDesigner.runAllDesigners,
		updateFieldsDependentOnTelescopeFocalLength = MLB.NewtDesigner.updateFieldsDependentOnTelescopeFocalLength,
		updateFieldsDependentOnFocalRatio = MLB.NewtDesigner.updateFieldsDependentOnFocalRatio,
		updateFieldsDependentOnAperture = MLB.NewtDesigner.updateFieldsDependentOnAperture,
		calcP2Intrusion = MLB.NewtDesigner.calcP2Intrusion,
		drawOffsetShadow = MLB.NewtDesigner.drawOffsetShadow,
		drawOffsetInFocuser = MLB.NewtDesigner.drawOffsetInFocuser,
		buildCGHtmlTable = MLB.NewtDesigner.buildCGHtmlTable,
		buildSpiderTypeHtmlTable = MLB.NewtDesigner.buildSpiderTypeHtmlTable,
		fillSpiderTypeSelections = MLB.NewtDesigner.fillSpiderTypeSelections,
		buildTubeTypeHtmlTable = MLB.NewtDesigner.buildTubeTypeHtmlTable,
		fillTubeTypeSelections = MLB.NewtDesigner.fillTubeTypeSelections,
		buildMountTypeHtmlTable = MLB.NewtDesigner.buildMountTypeHtmlTable,
		fillMountTypeSelections = MLB.NewtDesigner.fillMountTypeSelections,
		changeUom = MLB.NewtDesigner.changeUom,
		searchObjectCatalog = MLB.NewtDesigner.searchObjectCatalog,
		copySelectedObject = MLB.NewtDesigner.copySelectedObject,
		calcVisualDetection = MLB.NewtDesigner.calcVisualDetection,
		calcTotalMagnitude = MLB.NewtDesigner.calcTotalMagnitude,
		BortleScale = MLB.BortleScaleJson.BortleScale,
		BortleScaleNum,
		updateMirrorCellFromRadioBtns = MLB.NewtDesigner.updateMirrorCellFromRadioBtns,
		graphBaffles = MLB.NewtDesigner.graphBaffles,
		graphFocuserBaffles = MLB.NewtDesigner.graphFocuserBaffles,
		sliderBinoscopeSecondaryAxisDownwardTiltAngleDegValue,
		sliderBinoscopeSecondaryBendingAngleDegValue,
		sliderBinoscopeEyepieceDivergenceDegValue,
		calcCG = MLB.NewtDesigner.calcCG,
		graphRocker = MLB.NewtDesigner.graphRocker,
		graphLowrider = MLB.NewtDesigner.graphLowrider,
		graphFlexRocker = MLB.NewtDesigner.graphFlexRocker,
		graphEquatorialTable = MLB.NewtDesigner.graphEquatorialTable,
		setBinoscopeLocksDistanceLogic = MLB.NewtDesigner.setBinoscopeLocksDistanceLogic,
		setBinoscopeLocksAnglesLogic = MLB.NewtDesigner.setBinoscopeLocksAnglesLogic,
		binoscopeWorkflow = MLB.NewtDesigner.binoscopeWorkflow,
		updateCurrentlySelectedDesigner = MLB.NewtDesigner.updateCurrentlySelectedDesigner,
		seedCGTable = MLB.NewtDesigner.seedCGTable,
		calcAndGraphDiag = MLB.NewtDesigner.calcAndGraphDiag,
		calcMinFoldingMirrorSize = MLB.NewtDesigner.calcMinFoldingMirrorSize,
		calcLowriderSecondaryOffset = MLB.NewtDesigner.calcLowriderSecondaryOffset,
		updateLowriderBaffleDesignerFromStateDiagSize = MLB.NewtDesigner.updateLowriderBaffleDesignerFromStateDiagSize,
		updateFocalPlaneToSecondaryDistanceToMax = MLB.NewtDesigner.updateFocalPlaneToSecondaryDistanceToMax,
		setBinoscopeFocalPlaneToSecondaryDistanceToMinimum = MLB.NewtDesigner.setBinoscopeFocalPlaneToSecondaryDistanceToMinimum,
		setSelectedComaCorrector = MLB.NewtDesigner.setSelectedComaCorrector,
		setSelectedFocuser = MLB.NewtDesigner.setSelectedFocuser,
		seedComaCorrector = MLB.NewtDesigner.seedComaCorrector,
		setEyeOptSelectedEyepieceUsingSelectStr = MLB.NewtDesigner.setEyeOptSelectedEyepieceUsingSelectStr,
		updateEyepieceFocuserTravelDistance = MLB.NewtDesigner.updateEyepieceFocuserTravelDistance,
		seedFocuser = MLB.NewtDesigner.seedFocuser,
		seedMaterialFrictions = MLB.NewtDesigner.seedMaterialFrictions,
		config = MLB.NewtDesigner.config,
		common = MLB.NewtDesigner.common,
		putData = MLB.NewtDesigner.putData,
		getDataUpdateUI = MLB.NewtDesigner.getDataUpdateUI,
		getData = MLB.NewtDesigner.getData,
		importMelBartels30InchDesign = MLB.NewtDesigner.importMelBartels30InchDesign,
		importMelBartelsZipDobIIDesign = MLB.NewtDesigner.importMelBartelsZipDobIIDesign,
		processAcordionBtnAndPanel = MLB.NewtDesigner.processAcordionBtnAndPanel,
		processURLhash = MLB.NewtDesigner.processURLhash,
		comaCorrectorsJson = MLB.comaCorrectorsJson,
		focusersJson = MLB.focusersJson,
		materialFrictionJson = MLB.materialFrictionJson,
		comaCorrectorStr,
		focuserStr,
		materialPairingStr,
		optionStr;

	// write out interim title
	common.titleText().html('<h2>Setting up initial example...</h2>');

	// set initially selected designer
	//updateSelected(config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit);
	updateSelected(config.btnSelectIntroLit, config.designIntroLit, config.designIntroImageLit);

	common.btnSelectIntro().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectIntroLit, config.designIntroLit, config.designIntroImageLit);
	});
	common.btnSelectTelescope().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectTelescopeLit, config.designTelescopeLit, config.designTelescopeImageLit);
	});
	common.btnSelectVisual().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectVisualLit, config.designVisualLit, config.designVisualImageLit);
	});
	common.btnSelectEyepieces().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectEyepiecesLit, config.designEyepiecesLit, config.designEyepieceImageLit);
	});
	common.btnSelectComaCorrector().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectComaCorrectorLit, config.designComaCorrectorLit, config.designComaCorrectorImageLit);
	});
	common.btnSelectDiagonal().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectDiagonalLit, config.designDiagonalLit, config.designDiagonalImageLit);
	});
	common.btnSelectSpider().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectSpiderLit, config.designSpiderLit, config.designSpiderImageLit);
	});
	common.btnSelectMirrorCell().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectMirrorCellLit, config.designMirrorCellLit, config.designMirrorCellImageLit);
	});
	common.btnSelectFocuser().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectFocuserLit, config.designFocuserLit, config.designFocuserImageLit);
	});
	common.btnSelectBaffling().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectBafflingLit, config.designBafflingLit, config.designBafflingImageLit);
	});
	common.btnSelectLowriderBaffling().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectLowriderBafflingLit, config.designLowriderBafflingLit, config.designLowriderBafflingImageLit);
	});
	common.btnSelectBinoscope().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectBinoscopeLit, config.designBinoscopeLit, config.designBinoscopeImageLit);
	});
	common.btnSelectCG().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectCGLit, config.designCGLit, config.designCGImageLit);
	});
	common.btnSelectTube().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectTubeLit, config.designTubeLit, config.designTubeImageLit);
	});
	common.btnSelectMount().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectMountLit, config.designMountLit, config.designMountImageLit);
	});
	common.btnSelectRocker().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectRockerLit, config.designRockerLit, config.designRockerImageLit);
	});
	common.btnSelectFlexRocker().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectFlexRockerLit, config.designFlexRockerLit, config.designFlexRockerImageLit);
	});
	common.btnSelectET().click(function () {
		//scrollToTop(config.uomFocalRatioApertureSharedParmsLit);
		scrollToTop(undefined);
		updateSelected(config.btnSelectETLit, config.designETLit, config.designETImageLit);
	});
	common.btnSelectExportImport().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectExportImportLit, config.designExportImportLit, config.designExportImportImageLit);
	});
	common.btnSelectNotes().click(function () {
		scrollToTop(undefined);
		updateSelected(config.btnSelectNotesLit, config.designNotesLit, config.designNotesImageLit);
	});

	// event hookups/subscribes...

	// if .click(foo) then event passed to function as a parm which we don't want here because changeUom() function has optional parms
	common.btnUom().click(function () {
		var currentUomSelected = common.btnUom()[0].checked
				? 0
				: common.btnUom()[1].checked
					? 1
					: undefined;

		if (currentUomSelected !== state.lastUomSelected) {
			changeUom();
			state.lastUomSelected = currentUomSelected;
		}
	});

	common.sliderFocalRatio().mousedown(function () {MLB.NewtDesigner.state.sliderFocalRatioChanging = true; });
	common.sliderFocalRatio().mouseup(function () {MLB.NewtDesigner.state.sliderFocalRatioChanging = false; });
	common.sliderFocalRatio().mousemove(function () {
		if (!state.sliderFocalRatioChanging) {
			return;
		}
		// input number box
		common.focalRatio().val(common.sliderFocalRatioVal());
		updateFieldsDependentOnFocalRatio();
	});
	// change event only fires when field is edited and changed: it does not fire when field changed programmatically
	common.focalRatio().change(function () {
		common.sliderFocalRatio().val(common.focalRatioVal());
		updateFieldsDependentOnFocalRatio();
	});

	common.sliderAperture().mousedown(function () {MLB.NewtDesigner.state.sliderApertureChanging = true; });
	common.sliderAperture().mouseup(function () {MLB.NewtDesigner.state.sliderApertureChanging = false; });
	common.sliderAperture().mousemove(function () {
		if (!state.sliderApertureChanging) {
			return;
		}
		// input number box
		common.aperture().val(common.sliderApertureVal());
		updateFieldsDependentOnAperture();
	});
	// change event only fires when field is edited and changed: it does not fire when field changed programmatically
	common.aperture().change(function () {
		common.sliderAperture().val(common.apertureVal());
		updateFieldsDependentOnAperture();
	});

	common.sliderTelescopeFocalLength().mousedown(function () {MLB.NewtDesigner.state.sliderTelescopeFocalLengthChanging = true; });
	common.sliderTelescopeFocalLength().mouseup(function () {MLB.NewtDesigner.state.sliderTelescopeFocalLengthChanging = false; });
	common.sliderTelescopeFocalLength().mousemove(function () {
		if (!state.sliderTelescopeFocalLengthChanging) {
			return;
		}
		// input number box
		common.telescopeFocalLength().val(common.sliderTelescopeFocalLengthVal());
		updateFieldsDependentOnTelescopeFocalLength();
	});
	// change event only fires when field is edited and changed: it does not fire when field changed programmatically
	common.telescopeFocalLength().change(function () {
		common.sliderTelescopeFocalLength().val(common.telescopeFocalLengthVal());
		updateFieldsDependentOnTelescopeFocalLength();
	});

	common.btnUpdateTelescopeResults().click(updateTelescopeResults);

	common.AEFEyepieceSelect().change(updateAEF);
	common.chBoxAEFUseComaCorrector().change(updateAEF);
	common.AEFComaCorrectorSelect().change(updateAEF);
	common.AEFComaCorrectorMag().change(updateAEF);
	common.AEFPupil().change(updateAEF);
	common.AEFFOVDeg().change(updateAEF);

	common.distanceToObject().change((e) => {
		updateEyepieceFocuserTravelDistance(+e.target.value);
	});
	updateEyepieceFocuserTravelDistance(+common.distanceToObject().val());

	common.chBoxUseComaCorrector().change(updateEyepieceOptimizerRows);
	common.comaCorrectorSelect().change(updateEyepieceOptimizerRows);
	common.comaCorrectorMag().change(updateEyepieceOptimizerRows);
	common.btnListEyepiecesWidestFieldForEyePupil().click(listWidestFieldEyepieces);
	common.btnCalcEyepieceWidestFieldForEyePupil().click(findWidestFieldEyepiece);
	common.btnCopySelectedEyepieceToEyepieceTable().click(copySelectedEyepieceToEyepieceTable);

	common.btnEyepieceSortManufacturer().click(sortEyepiecesByManufacturerAddToSelections);
	common.btnEyepieceSortFocalLength().click(sortEyepiecesByFLAddToSelections);
	common.btnEyepieceSortFieldOfView().click(sortEyepiecesByTrueFieldAddToSelections);
	common.btnEyepieceTableSortFocalLength().click(() => sortEyepieceTable(config.focalLengthIx));
	common.btnEyepieceTableSortFieldOfView().click(() => sortEyepieceTable(config.trueFieldOfViewIx));

	// calc FR for max etendue calculator

	common.calcFRMaxEtendueEyePupilmm().change(function () {
		calcFRMaxEtendueFR();
		calcFRMaxEtendueEtendue();
	});
	common.calcFRMaxEtendueEyepieceFLmm().change(calcFRMaxEtendueFR);
	common.calcFRMaxEtendueComaCorrectorMag().change(calcFRMaxEtendueFR);
	common.btnCalcFRMaxEtendue().click(calcFRMaxEtendueFR);
	common.calcFRMaxEtendueEyepieceFOV().change(calcFRMaxEtendueEtendue);
	common.btnCalcFREtendue().click(calcFRMaxEtendueEtendue);

	// start Visual Detection designer...

	common.searchObjectString().change(searchObjectCatalog);
	common.btnSearchObjectCatalog().click(searchObjectCatalog);
	common.matchedObjectsSelect().change(function () {
		if (this.value !== config.selectObjectLit) {
			copySelectedObject(this.value);
			calcVisualDetection();
		}
	});
	common.objectApparentMagnitude().change(calcVisualDetection);
	common.objectSizeArcMin1().change(calcVisualDetection);
	common.objectSizeArcMin2().change(calcVisualDetection);

	common.sliderBortleScale().mousedown(function () {MLB.NewtDesigner.state.sliderBortleScaleChanging = true; });
	common.sliderBortleScale().mouseup(function () {MLB.NewtDesigner.state.sliderBortleScaleChanging = false; });
	common.sliderBortleScale().mousemove(function () {
		if (!state.sliderBortleScaleChanging) {
			return;
		}
		BortleScaleNum = common.sliderBortleScaleVal();
		// input number box
		common.BortleScale().val(BortleScaleNum);
		common.skyBackgroundBrightnessUnaidedEye().val(BortleScale[BortleScaleNum - 1].MPAS);
		calcVisualDetection();
	});
	// change event only fires when field is edited and changed: it does not fire when field changed programmatically
	common.BortleScale().change(function () {
		BortleScaleNum = common.BortleScaleVal();
		common.sliderBortleScale().val(BortleScaleNum);
		common.skyBackgroundBrightnessUnaidedEye().val(BortleScale[BortleScaleNum - 1].MPAS);
		calcVisualDetection();
	});
	// set Bortle Scale slider and sky background brightness to Bortle Scale input text value
	BortleScaleNum = common.BortleScaleVal();
	common.sliderBortleScale().val(BortleScaleNum);
	common.skyBackgroundBrightnessUnaidedEye().val(BortleScale[BortleScaleNum - 1].MPAS);
	common.skyBackgroundBrightnessUnaidedEye().change(calcVisualDetection);
	common.visualDetectionApertureVariance().change(calcVisualDetection);

	common.btnCalcTotalMagnitude().click(calcTotalMagnitude);

	// ...end Visual Detection designer

	common.focalPlaneToDiagDistance().change(calcAndGraphDiag);
	common.btnCalcFocalPlaneToDiagDistanceFromFocuserDesigner().click(() => {
		updateFocalPlaneToDiagDistanceFromFocuserDesigner();
		calcAndGraphDiag();
	});
	common.maxFieldDiaDiag().change(calcAndGraphDiag);
	common.acceptableMagLoss().change(calcAndGraphDiag);
	common.diagSizes().change(calcAndGraphDiag);
	common.chBoxIncludeFocuserBarrelVignetting().click(calcAndGraphDiag);

	common.chBoxIncludeP2Intrusion().click(() => {
		calcP2Intrusion();
		drawOffsetShadow();
		drawOffsetInFocuser();
	});

	common.btnMirrorSupportPoints().click(updateMirrorCellFromRadioBtns);
	common.btnUpdateDiagIllum().click(calcAndGraphDiag);
	common.focuserRackedInHeight().change(graphBaffles);
	common.focuserInwardFocusingDistance().change(graphBaffles);
	common.telescopeTubeThickness().change(graphBaffles);
	common.focalPlaneToDiagDistance().change(updateCurrentlySelectedDesigner);
	common.btnUpdateBaffles().click(graphBaffles);
	common.btnPlotFocuserBaffle().click(graphFocuserBaffles);

	common.btnUpdateLowriderBaffleDiagonalFromBaffleDesigner().click(function () {
		updateLowriderBaffleDesignerFromStateDiagSize();
		graphLowrider();
	});
	common.btnCalcMinLowriderSecondaryMirrorSize().click(function () {
		calcLowriderSecondaryOffset();
		calcMinFoldingMirrorSize();
		graphLowrider();
	});
	common.btnCalcLowriderSecondaryOffset().click(function () {
		calcLowriderSecondaryOffset();
		graphLowrider();
	});
	common.btnCalcMaxFocalPlaneToSecondaryDistance().click(function () {
		calcLowriderSecondaryOffset();
		updateFocalPlaneToSecondaryDistanceToMax();
		graphLowrider();
	});
	common.btnUpdateLowrider().click(graphLowrider);

	common.chBoxBinoscopeLockSecondaryBendingAngle().click(binoscopeWorkflow);
	common.chBoxBinoscopeLockEyepieceDivergence().click(binoscopeWorkflow);
	common.chBoxBinoscopeLockEyepieceDivergenceAndTertiarySecondaryRightAngle().click(binoscopeWorkflow);
	common.binoscopeFocalPlaneToSecondaryDistance().change(function () {
		setBinoscopeLocksDistanceLogic();
		binoscopeWorkflow();
	});
	common.binoscopeFocalPlaneToTertiaryDistance().change(binoscopeWorkflow);
	common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary().change(binoscopeWorkflow);
	common.btnSetBinoscopeFocalPlaneToSecondaryToMinimumDistance().click(function () {
		setBinoscopeLocksDistanceLogic();
		setBinoscopeFocalPlaneToSecondaryDistanceToMinimum();
		binoscopeWorkflow();
	});
	common.binoscopeSecondaryBendingAngleDeg().change(function () {
		setBinoscopeLocksAnglesLogic(true);
		binoscopeWorkflow();
	});

	common.sliderBinoscopeSecondaryBendingAngleDeg().mousedown(function () {MLB.NewtDesigner.state.sliderBinoscopeSecondaryBendingAngleDegChanging = true; });
	common.sliderBinoscopeSecondaryBendingAngleDeg().mouseup(function () {MLB.NewtDesigner.state.sliderBinoscopeSecondaryBendingAngleDegChanging = false; });
	common.sliderBinoscopeSecondaryBendingAngleDeg().mousemove(function () {
		if (!state.sliderBinoscopeSecondaryBendingAngleDegChanging) {
			return;
		}
		sliderBinoscopeSecondaryBendingAngleDegValue = common.sliderBinoscopeSecondaryBendingAngleDegVal();
		// input number box
		common.binoscopeSecondaryBendingAngleDeg().val(sliderBinoscopeSecondaryBendingAngleDegValue);
		setBinoscopeLocksAnglesLogic(true);
		binoscopeWorkflow();
	});

	common.binoscopeTertiaryBendingAngleDeg().change(binoscopeWorkflow);

	common.binoscopeEyepieceDivergenceDeg().change(function() {
		setBinoscopeLocksAnglesLogic(false);
		binoscopeWorkflow();
	});
	common.sliderBinoscopeEyepieceDivergenceDeg().mousedown(function () {MLB.NewtDesigner.state.sliderBinoscopeEyepieceDivergenceDegChanging = true; });
	common.sliderBinoscopeEyepieceDivergenceDeg().mouseup(function () {MLB.NewtDesigner.state.sliderBinoscopeEyepieceDivergenceDegChanging = false; });
	common.sliderBinoscopeEyepieceDivergenceDeg().mousemove(function () {
		if (!state.sliderBinoscopeEyepieceDivergenceDegChanging) {
			return;
		}
		sliderBinoscopeEyepieceDivergenceDegValue = common.sliderBinoscopeEyepieceDivergenceDegVal();
		// input number box
		common.binoscopeEyepieceDivergenceDeg().val(sliderBinoscopeEyepieceDivergenceDegValue);
		setBinoscopeLocksAnglesLogic(false);
		binoscopeWorkflow();
	});

	common.btnUpdateBinoscope().click(binoscopeWorkflow);
	common.IPD().change(binoscopeWorkflow);

	common.binoscopeSecondaryAxisDownwardTiltAngleDeg().change(binoscopeWorkflow);
	common.sliderBinoscopeSecondaryAxisDownwardTiltAngleDeg().mousedown(function () {MLB.NewtDesigner.state.sliderBinoscopeSecondaryAxisDownwardTiltAngleDegChanging = true; });
	common.sliderBinoscopeSecondaryAxisDownwardTiltAngleDeg().mouseup(function () {MLB.NewtDesigner.state.sliderBinoscopeSecondaryAxisDownwardTiltAngleDegChanging = false; });
	common.sliderBinoscopeSecondaryAxisDownwardTiltAngleDeg().mousemove(function () {
		if (!state.sliderBinoscopeSecondaryAxisDownwardTiltAngleDegChanging) {
			return;
		}
		sliderBinoscopeSecondaryAxisDownwardTiltAngleDegValue = common.sliderBinoscopeSecondaryAxisDownwardTiltAngleDegVal();
		// input number box
		common.binoscopeSecondaryAxisDownwardTiltAngleDeg().val(sliderBinoscopeSecondaryAxisDownwardTiltAngleDegValue);

		binoscopeWorkflow();
	});

	common.btnCalcCG().click(calcCG);
	common.rockerWeight().change(function () {
		graphRocker();
	});
	common.chBoxAutoCalcRockerWeight().change(function () {
		graphRocker();
	});
	common.btnUpdateRocker().click(graphRocker);
	common.flexRockerWeight().change(function () {
		graphFlexRocker();
	});
	common.chBoxAutoCalcFlexRockerWeight().change(function () {
		graphFlexRocker();
	});
	common.btnUpdateFlexRocker().click(graphFlexRocker);
	common.btnUpdateET().click(graphEquatorialTable);
	// get/put events
	common.btnPutDesign().click(putData);
	common.btnGetDesign().click(function () {
		getDataUpdateUI(getData());
	});
	common.btnSelect30inchDesign().click(importMelBartels30InchDesign);
	common.btnSelect13inchDesign().click(importMelBartelsZipDobIIDesign);

	// wire up accordion sections (detailed text on a particular subject)
	common.accordions().each(function () {
		$(this).click(function() {
			processAcordionBtnAndPanel(this);
		});
	});

	common.btnScrollToTop().click(function () {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});

	// hide button until an eyepiece is selected to copy from
	common.btnCopySelectedEyepieceToEyepieceTable().hide();

	// fill select coma corrector drop down boxes: AEFComaCorrectorSelect and comaCorrectorSelect
	$.each(comaCorrectorsJson.comaCorrectors, function (i, v) {
		comaCorrectorStr = v.manufacturer + ' ' + v.model;
		optionStr = '<option value="' + comaCorrectorStr + '">' + comaCorrectorStr + '</option>';
		common.AEFComaCorrectorSelect().append(optionStr);
		common.comaCorrectorSelect().append(optionStr);
	});

	// wire up selected comaCorrector change for eyepiece designer
	common.AEFComaCorrectorSelect().change(function () {
		setSelectedComaCorrector(this.selectedIndex, common.AEFComaCorrectorMag);
	});
	common.comaCorrectorSelect().change(function () {
		setSelectedComaCorrector(this.selectedIndex, common.comaCorrectorMag);
	});

	buildEyepieceHtmlTable();
	// includes AEF selection
	sortEyepiecesByManufacturerAddToSelections();
	// wire up selected eyepiece change for eyepiece designer
	$('[id^=' + config.EyeOptSelectID + ']').each(function (idIx) {
		$(this).change(function (e) {
			setEyeOptSelectedEyepiece(idIx, e.currentTarget.selectedIndex);
		});
	});
	// wire up buttons that remove selected eyepiece row
	$('[id^=' + config.btnRemoveEyepieceRowLit + ']').each(function (idIx) {
		$(this).click(function () {
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
		updateCurrentlySelectedDesigner();
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

	// other values set in html
	common.AEFEyepieceSelect().val('TeleVue Ethos 21mm 100deg');
	updateAEF();

	seedComaCorrector('TeleVue', 'Paracorr II', common.comaCorrectorSelect, common.comaCorrectorMag);
	seedComaCorrector('TeleVue', 'Paracorr II', common.AEFComaCorrectorSelect, common.AEFComaCorrectorMag);
	setEyeOptSelectedEyepieceUsingSelectStr(0, 'TeleVue Nagler 5 31mm 82deg');
	setEyeOptSelectedEyepieceUsingSelectStr(1, 'Nikon NAV 17mm 102deg');
	setEyeOptSelectedEyepieceUsingSelectStr(2, 'Clave Plossl 6mm 48deg');
	seedFocuser('MoonLite', 'CR 1.5');
	fillSpiderTypeSelections();
	buildSpiderTypeHtmlTable();
	fillTubeTypeSelections();
	buildTubeTypeHtmlTable();
	fillMountTypeSelections();
	buildMountTypeHtmlTable();
	buildCGHtmlTable();
	seedCGTable();
	seedMaterialFrictions();
	// must wait for seeded focuser et al
	// no conversion at startup
	changeUom('ignore length conversion');

	// set binoscope values first before updateFieldsDependentOnAperture() so that setBinoscopeFocalPlaneToSecondaryDistanceToMinimum() has values to work with
	common.binoscopeFocalPlaneToTertiaryDistance().val(config.binoscopeFocalPlaneToTertiaryDistance);
	common.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary().val(config.binoscopeFocalPointPerpendicularOffsetFromEdgeOfPrimary);
	updateFieldsDependentOnAperture();

	runAllDesigners();

	// now set the binoscope focal plane to secondary distance in order to portray a bent optical path;
	// when the binoscope designer is selected, the graphs and numbers will be recalculated
	common.binoscopeFocalPlaneToSecondaryDistance().val(config.binoscopeFocalPlaneToSecondaryDistance);

	// write out title
	common.titleText().html(config.titleText);

	processURLhash();
});

// end of file
