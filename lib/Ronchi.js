// copyright Mel Bartels, 2011-2026
// validate https://beautifytools.com/javascript-validator.php
// image to base64 string https://codebeautify.org/image-to-base64-converter

//var MLB; // uncomment for code validator

'use strict';

MLB.ronchi = {};

MLB.ronchi.common = {
	// common constants...
	yes: 0,
	no: 1,
	inches: 0,
	mm: 1,
	// ...common constants

	// diagnostic...
	calcZonalCorrectionsFromThinningDiagnostic: false,
	optimizeDiagnostics: false,
	// ... diagnostic

	// UI...
	// often used vars stored here for fastest retrieval rather than going to the html form then getting the value from the component
	// values here should match the form's default values
	UIRonchigramSize: 400,
	UIMirrorDia: 12,
	UIRadiusOfCurvature: 120,
	// ...UI

	// ruler...
	blackColor: 'black',
	rulerColor: '#ff0000',
	rulerThickness: 1,
	// ...ruler

	// rounding precisions...
	mirrorDiaPrecision: 2,
	radiusOfCurvaturePrecision: 2,
	focalRatioPrecision: 2,
	focalLengthPrecision: 2,
	dimensionDecimalPrecision: 1,
	wavesDecimalPrecision: 2,
	gratingFreqPrecisionInches: 1,
	gratingFreqPrecisionMM: 3,
	gratingOffsetDecimalPrecision: 3,
	gratingOffsetDisplayPrecision: 3,
	centralObstructionPrecision: 2,
	tapeBandDecimalPrecision: 2,
	MLToleranceDecimalPrecision: 2,
	MLToleranceAbsDecimalPrecision: 1,
	parabolicCorrectionDisplayPrecision: 2,
	zonalCorrectionDisplayPrecision: 3,
	// ...rounding precisions

	// tape bands...
	RonchiBands: [],
	nullRonchiBands: [],
	RonchiBandTransitions: [],
	// ...tape bands

	// zones...
	zonalErrorCount: 10,
	//array of [zone, correctionFactor], eg, [[0, 1.0], [0.1, 0.9] ... [1.0, 1.1]] as numbers where the first value is the zonal radius and the second value is the user correction factor
	userZonalCorrections: [],
	zoneIx: 0,
	correctionIx: 1,
	savedCorrections: [],
	MLTolerances: [],
	MLTolerancePeakValley: undefined,
	lastMLOffset: 0,
	zonalCircularRulersNulled: [],
	lastCalcZonalCorrectionsFromThinning: undefined,
	zoneIdLit: 'id=zone',
	zoneId2Lit: 'id="zone',
	zoneCorrectionIdLit: 'id=zoneCorrection',
	zoneCorrectionId2Lit: 'id="zoneCorrection',
	MLToleranceIdLit: 'id=MLTolerance',
	MLToleranceId2Lit: 'id="MLTolerance',
	goodColor: 'lightgreen',
	fairColor: 'yellow',
	badColor: 'red',
	// ...zones

	// parabolic distortions...
	RGD: [],
	RGD_NoUserError: [],
	smallestZeroGratingOffsetForNullRonchigram: 0.000001,
	// ...parabolic distortions

	// charts...
	RonchigramIx: 0,
	nullRonchigramIx: 1,
	context: undefined,
	scalingFactor: undefined,
	centralObstructionNullIx: undefined,
	nulledImageBlacksAtCanvasYMidpoint: [],
	avgRonchiBandDeviationFromNearestRuler: undefined,
	absAvgRonchiBandDeviationFromNearestRuler: undefined,
	bandDeviationLit: 'bands err=',
	ML_PV_Lit: 'ML PV=',
	zonalCorrectionsFromNulledRG: undefined,
	pixelArray: undefined,
	fontSize: 12,
	fontLit: 'pt arial',
	opaque: 255,
	zonesSideViewLit: 'zonesSideView',
	MLErrorsViewLit: 'MLErrorsView',
	parabCorrLit: 'ParCorr=',
	gratingOffsetLit: 'Offset=',
	nullLit: 'Software nulled',
	barsLit: ' bars',
	MatchingRonchiTestLit: 'MatchingRonchiTest ',
	// ...charts

	// images...
	pastedImageLit: 'pastedImage',
	exampleImages: {
	// mirrorDia, radiusOfCurvature, centralObstruction, gratingFreq, gratingOffset, userParabolicCorrection, RonchigramSize, invertBands, RonchiGrid, circularZonalRulerCount, pastedImageTransparency, pastedImageWidth, pastedImageHeight, pastedImageOffsetX, pastedImageOffsetY, imageName, imageSource, distortionResolutionFactor, showBullseyeZones, thinBands, showGradients, calcZonalCorrectionsFromThinning, pastedImageName
		'thirteenInside':        [13.1,  80.6, 3.1,  65, -0.104,  1, 400, false, false, 4, 0.75, 400, 400,   0,    0, '', MLB.base64images._13i,  3, false, false, false, false, '13F3 example'],
		'thirteenInsideThinned': [13.1,  80.6, 3.1,  65, -0.109,  1, 400, true,  false, 4, 1.0,  400, 400,  -0.25, 0, '', MLB.base64images._13i,  3, false, true,  false,  true, '13F3 example'],
		'thirteenOutside':       [13.1,  80.6, 3.1,  65,  0.576,  1, 400, false, false, 4, 0.75, 400, 400,   0,    0, '', MLB.base64images._13o,  3, false, false, false, false, '13F3 example'],
		'thirteenGrid':          [13.1,  80.6, 3.1,  65, -0.454,  1, 400, true,  true,  4,  0.9, 398, 402,   0,   -5, '', MLB.base64images._grid, 2, false, false, false, false, 'grid example'],
		'twelveF5Under':         [12,     120,   3, 100, -0.196,  1, 400, false, false, 4,    1, 400, 400,   0,    0, '', MLB.base64images._12F5, 2, false, true,  false, false, '-1/5 wave ex']
	},
	images: {},
	storedTransparency: 0.9, // match with starting value in Ronchi.html
	// ...images

	// controls...
	sliderOffsetMousedown: undefined,
	lastSliderOffsetValue: 0,
	gratingOffsetChangeInches: 0.002,
	gratingOffsetChangeMM: 0.05,
	sliderParabolicCorrectionMousedown: undefined,
	yesLit: 'yes',
	inchesLit: 'inches',
	mmLit: 'mm',
	wavelengthLightInches: 0.000022,
	wavelengthLightMM: 0.00056,
	// ...controls

	// ...wave errors
	waveErrors: [],
	waveErrorsWhereLowestIsZero: [],
	rangeWaveError: undefined,
	sideViewFillColor: 'gray',
	// ...wave errors

	mirrorDia: () => {
		return $('[name=mirrorDia]');
	},
	radiusOfCurvature: () => {
		return $('[name=radiusOfCurvature]');
	},
	focalLength: () => {
		return $('[name=focalLength]');
	},
	focalRatio: () => {
		return $('[name=focalRatio]');
	},
	centralObstruction: () => {
		return $('[name=centralObstruction]');
	},
	gratingFreq: () => {
		return $('[name=gratingFreq]');
	},
	gratingOffset: () => {
		return $('[name=gratingOffset]');
	},
	btnIncreaseGratingOffset: () => {
		return $('input[id=btnIncreaseGratingOffset]');
	},
	btnDecreaseGratingOffset: () => {
		return $('input[id=btnDecreaseGratingOffset]');
	},
	sliderOffset: () => {
		return $('input[id=sliderOffset]');
	},
	userParabolicCorrection: () => {
		return $('[name=userParabolicCorrection]');
	},
	sliderParabolicCorrection: () => {
		return $('input[id=sliderParabolicCorrection]');
	},
	RonchigramSize: () => {
		return $('[name=RonchigramSize]');
	},
	bandColorRGB: () => {
		return $('[name=bandColorRGB]');
	},
	backgroundBandColorRGB: () => {
		return $('[name=backgroundBandColorRGB]');
	},
	invertBands: () => {
		return $('[name=invertBands]');
	},
	backgroundColor: () => {
		return $('[name=backgroundColor]');
	},
	RonchiGrid: () => {
		return $('[name=RonchiGrid]');
	},
	circularZonalRulerCount: () => {
		return $('[name=circularZonalRulerCount]');
	},
	rulerTextRGB: () => {
		return $('[name=rulerTextRGB]');
	},
	Ronchigrams: () => {
		return $('[id=Ronchigrams]');
	},
	zonalErrorsNotesDiv: () => {
		return $('[id=zonalErrorsNotesDiv]');
	},
	tapeBandsDiv: () => {
		return $('[id=tapeBandsDiv]');
	},
	waveNotes: () => {
		return $('[id=waveNotes]');
	},
	btnIncludeParabCorr: () => {
		return $('[name=includeParabCorr]');    // note name is includeParabCorr, not btnIncludeParabCorr
	},
	includeParabCorr: function () {    // not () => because of scope issues with 'this.'
		return this.btnIncludeParabCorr()[this.yes].checked;
	},
	UOM: () => {
		return $('[name=UOM]');
	},
	UOMVal: () => {
		return $('[name=UOM]:checked').val();
	},
	inchesSelected: function () {    // not () => because of scope issues with 'this.'
		return this.UOM()[this.inches].checked;
	},
	mmSelected: function () {    // not () => because of scope issues with 'this.'
		return this.UOM()[this.mm].checked;
	},
	waveErrorsLabel: () => {
		return $('[id=waveErrorsLabel]');
	},
	MLErrorsLabel: () => {
		return $('[id=MLErrorsLabel]');
	},
	btnSortZonalCorrectionTableByZone: () => {
		return $('input[id=btnSortZonalCorrectionTableByZone]');
	},
	btnCopyBands: () => {
		return $('input[id=btnCopyBands]');
	},
	btnUseZonalRuler: () => {
		return $('input[id=btnUseZonalRuler]');
	},
	btn10Zones: () => {
		return $('input[id=btn10Zones]');
	},
	btnResetCorrectionFactors: () => {
		return $('input[id=btnResetCorrectionFactors]');
	},
	btnResetCorrectionFactorsToParabCorrection: () => {
		return $('input[id=btnResetCorrectionFactorsToParabCorrection]');
	},
	btnSaveCorrections: () => {
		return $('input[id=btnSaveCorrections]');
	},
	btnRestoreCorrections: () => {
		return $('input[id=btnRestoreCorrections]');
	},
	zonalCorrectionTableBody: () => {
		return $('#zonalCorrectionTableBody');
	},
	zonesSideViewID: () => {
		return $('#zonesSideView')[0];
	},
	zonesSideViewDiv: () => {
		return $('#zonesSideViewDiv');
	},
	MLErrorsViewID: () => {
		return $('#MLErrorsView')[0];
	},
	MLErrorsViewDiv: () => {
		return $('#MLErrorsViewDiv');
	},
	btnPasteExampleRonchigram13Inside: () => {
		return $('input[id=btnPasteExampleRonchigram13Inside]');
	},
	btnPasteExampleRonchigram13Inside2: () => {
		return $('input[id=btnPasteExampleRonchigram13Inside2]');
	},
	btnPasteExampleRonchigram13Outside: () => {
		return $('input[id=btnPasteExampleRonchigram13Outside]');
	},
	btnPasteExampleRonchigramGrid: () => {
		return $('input[id=btnPasteExampleRonchigramGrid]');
	},
	btnPasteExampleRonchigram12F5Under: () => {
		return $('input[id=btnPasteExampleRonchigram12F5Under]');
	},
	pastedImageActive: () => {
		return $('[name=pastedImageActive]');
	},
	pastedImageActiveIsChecked: function () {    // not () => because of scope issues with 'this.'
		return this.pastedImageActive()[this.yes].checked;
	},
	pastedImageTransparency: () => {
		return $('[id=pastedImageTransparency]');
	},
	pastedImageWidth: () => {
		return $('[id=pastedImageWidth]');
	},
	pastedImageHeight: () => {
		return $('[id=pastedImageHeight]');
	},
	pastedImageOffsetX: () => {
		return $('[id=pastedImageOffsetX]');
	},
	pastedImageOffsetY: () => {
		return $('[id=pastedImageOffsetY]');
	},
	pastedImageName: () => {
		return $('[id=pastedImageName]');
	},
	btnDeletedPastedImage: () => {
		return $('input[id=btnDeletedPastedImage]');
	},
	showBullseyeZones: () => {
		return $('input[name=showBullseyeZones]');
	},
	thinBands: () => {
		return $('input[name=thinBands]');
	},
	showGradients: () => {
		return $('input[name=showGradients]');
	},
	calcZonalCorrectionsFromThinning: () => {
		return $('input[name=calcZonalCorrectionsFromThinning]');
	},
	btnFlipThinning: () => {
		return $('input[id=btnFlipThinning]');
	},
	btnBestROCoffsetUsingBandErrors: () => {
		return $('input[id=btnBestROCoffsetUsingBandErrors]');
	},
	btnBestROCoffsetUsingZonalErrors: () => {
		return $('input[id=btnBestROCoffsetUsingZonalErrors]');
	},
	btnBestXoffset: () => {
		return $('input[id=btnBestXoffset]');
	},
	distortionResolutionFactor: () => {
		return $('[name=distortionResolutionFactor]');
	},
	btnDecreaseGratingOffset2: () => {
		return $('input[id=btnDecreaseGratingOffset2]');
	},
	pastedImageRonchiCanvas: () => {
		return $('[id=RonchiCanvas0]')[0];
	},
	btnPutData: () => {
		return $('input[id=btnPutData]');
	},
	dataName: () => {
		return $('[name=dataName]');
	},
	btnGetData: () => {
		return $('input[id=btnGetData]');
	},
	btnShowDataNames: () => {
		return $('input[id=btnShowDataNames]');
	},
	btnDeleteData: () => {
		return $('input[id=btnDeleteData]');
	},
	MLOffset: () => {
		return $('[name=MLOffset]');
	},
};

// needed for M-L
MLB.ronchi.getWavelengthLight = () => {
	var common = MLB.ronchi.common;

	if (common.UOM()[common.inches].checked) {
		return common.wavelengthLightInches;
	}
	return common.wavelengthLightMM;
};

MLB.ronchi.processPixelArray = () => {
	var common = MLB.ronchi.common,
		pixelArray = common.pixelArray,
		invertBands = common.invertBands()[common.yes].checked,
		RonchiGrid = common.RonchiGrid()[common.yes].checked,
		pixelArrayGrid,
		x,
		y,
		xyLength = pixelArray.length,
		xyLengthSquared = xyLength * xyLength;

	if (!invertBands && !RonchiGrid) {
		return;
	}

	for (x = 0; x < xyLength; x++) {
		for (y = 0; y < xyLength; y++) {
			if (x * x + y * y < xyLengthSquared) {
				if (invertBands) {
					pixelArray[x][y] = pixelArray[x][y] === 0 ? 1 : 0;
				}
			}
		}
	}

	// create two-tone grid by adding in the 90 deg rotated image;
	// create the 90 deg rotated image by swapping x,y
	if (RonchiGrid) {
		pixelArrayGrid = [...Array(xyLength)].map(_ => Array(xyLength).fill(0));

		for (x = 0; x < xyLength; x++) {
			for (y = 0; y < xyLength; y++) {
				if (x * x + y * y < xyLengthSquared) {
					pixelArrayGrid[x][y] = pixelArray[y][x];
				}
			}
		}
		for (x = 0; x < xyLength; x++) {
			for (y = 0; y < xyLength; y++) {
				if (x * x + y * y < xyLengthSquared) {
					pixelArray[x][y] += pixelArrayGrid[x][y];
				}
			}
		}
	}
};

MLB.ronchi.adjustColorForGrid = color => {
	return (255 - color) / 2;
};

MLB.ronchi.setImagePixelsQuadrants = (imageData, circleCenter, x, y, red, green, blue, opaque) => {
	var setPixel = MLB.sharedLib.setPixel;

	setPixel(imageData, circleCenter.x + x, circleCenter.y + y, red, green, blue, opaque);
	setPixel(imageData, circleCenter.x - x, circleCenter.y + y, red, green, blue, opaque);
	setPixel(imageData, circleCenter.x + x, circleCenter.y - y, red, green, blue, opaque);
	setPixel(imageData, circleCenter.x - x, circleCenter.y - y, red, green, blue, opaque);
};

MLB.ronchi.setImagePixels = (imageData, circleCenter) => {
	var common = MLB.ronchi.common,
		pixelArray = common.pixelArray,
		setImagePixelsQuadrants = MLB.ronchi.setImagePixelsQuadrants,
		RonchiGrid = common.RonchiGrid()[common.yes].checked,
		bandColorRGB = common.bandColorRGB().val().split(','),
		red = +bandColorRGB[0],
		green = +bandColorRGB[1],
		blue = +bandColorRGB[2],
		// only need to adjust grid color, not pixel color or pixel background color
		adjustColorForGrid = MLB.ronchi.adjustColorForGrid,
		gridRed = adjustColorForGrid(red),
		gridGreen = adjustColorForGrid(green),
		gridBlue = adjustColorForGrid(blue),
		opaque = common.opaque,
		x,
		y,
		xyLength = pixelArray.length;

	for (x = 0; x < xyLength; x++) {
		for (y = 0; y < xyLength; y++) {
			if (RonchiGrid) { // grid array is two-tone
				if (pixelArray[x][y] === 2) {
					setImagePixelsQuadrants(imageData, circleCenter, x, y, red, green, blue, opaque);
				} else if (pixelArray[x][y] === 1) {
					setImagePixelsQuadrants(imageData, circleCenter, x, y, gridRed, gridGreen, gridBlue, opaque);
				}
			} else { // not grid
				if (pixelArray[x][y] > 0) {
					setImagePixelsQuadrants(imageData, circleCenter, x, y, red, green, blue, opaque);
				}
			}
		}
	}
};

/*
no unit test so compare using UI with defaults of aperture = 12, focal ratio = 5, lpi grating = 100, Ronchigram size = 250: grating offset values = -0.3, 0.0, 0.3, 0.6
keep in mind that by convention, a ray that makes it through the grating is colored black for display

RonchiBandTransitions for 1st Ronchigram w/ defaults as above: [0, 0.528, 1.488, 2.352, 3.12, 3.792, 4.368, 4.896, 5.376, 5.808] (length = 10)
note that RonchiBandTransitions exclude user entered zonal correction factors

0: center
1: right hand edge of center band
2: left hand edge of next band (the first band to calculate)
3: right hand edge of current band
...

inverted:
0: center
1: left hand edge of 1st band to calculate
2: right hand edge of current band
...

Ronchi Tape Band values: 0, 1.92, 3.46, 4.63, 5.59
and for inverted bands: 1.01, 2.74, 4.08, 5.14, 5.9
also use the provided mirror examples along with the Ruler:center

Note that by convention, the band is colored on the mirror's face when the light ray passes through the grating.

scaling up the Ronchigram size makes computed values more accurate (catches the edge of the grating lines with more resolution)
*/
MLB.ronchi.createTapeBandsFromRonchiBandTransitions = (mirrorRadius, RonchiBandTransitions) => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		invertBands = common.invertBands()[common.yes].checked,
		tapeBandDecimalPrecision = common.tapeBandDecimalPrecision,
		RonchiBandTransitionsLength = RonchiBandTransitions.length,
		transitionA,
		transitionB,
		ix,
		ixB,
		tapeMarks = [];

	if (invertBands) {
		ix = 1;
	} else {
		ix = 2;
		tapeMarks.push(0);
	}
	for ( ; ix < RonchiBandTransitionsLength; ix += 2) {
		transitionA = RonchiBandTransitions[ix];
		ixB = ix + 1;
		if (ixB < RonchiBandTransitionsLength) {
			transitionB = RonchiBandTransitions[ixB];
		} else { // finish out last Ronchi band using the mirror's edge
			transitionB = mirrorRadius;
		}
		tapeMarks.push(roundToDecimal((transitionA + transitionB ) / 2, tapeBandDecimalPrecision));
	}
	common.RonchiBands.push(tapeMarks);
};

// from algorithm in Sky and Telescope magazine (Apr '91): trace light rays through grating
MLB.ronchi.calcRonchiBands = (gratingFreq, gratingOffset, scalingFactor, userParabolicCorrection) => {
	var common = MLB.ronchi.common,
		getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
		mirrorDia = common.UIMirrorDia,
		mirrorRadius = mirrorDia / 2,
		scaledMirrorRadius,
		scaledMirrorRadiusSquared,
		radiusOfCurvature = common.UIRadiusOfCurvature,
		scaledRadiusOfCurvature,
		scaledGratingOffset,
		scaledLineWidth,
		scaledMirrorZoneSquared,
		scaledMirrorZone,
		pixelArray,
		x,
		y,
		ySquared,
		userErrorCorrectionFactor,
		zonalRoC,
		gratingToZonalRoC,
		xAtGrating,
		xGratingLineNumberDoubled,
		intXGratingLineNumberDoubled,
		band,
		lastBand,
		RonchiBandTransitions = [],
		int = MLB.sharedLib.int;

	scaledMirrorRadius = int(mirrorRadius * scalingFactor);
	scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
	scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
	scaledGratingOffset = gratingOffset * scalingFactor;
	scaledLineWidth = scalingFactor / (2 * gratingFreq);

	pixelArray = [...Array(scaledMirrorRadius)].map(_ => Array(scaledMirrorRadius).fill(0));

	//x, y are ray's coordinates on mirror's face;
	// calculate just one quadrant that later can be applied to the other three quadrants
	for (y = 0; y < scaledMirrorRadius; y++) {
		ySquared = y * y;
		for (x = 0; x < scaledMirrorRadius; x++) {
			scaledMirrorZoneSquared = ySquared + x * x;
			if (scaledMirrorZoneSquared > scaledMirrorRadiusSquared) {
				break; // done with 'x' for loop
			}
			scaledMirrorZone = Math.sqrt(scaledMirrorZoneSquared);
			userErrorCorrectionFactor = getInterpolatedCorrection(scaledMirrorZone / scaledMirrorRadius);
			// for spherical mirror, zonalRoC=RoC; for full parabolic mirror w/ no zonal error, zonalRoC=RoC + mirrorZone/RoC;
			// amount RoC is pushed back = mirrorZone/RoC = 0 @ mirror center, parabolic sagitta*2 @ mirror edge, 1/4th that at the 50% zone
			// userParabolicCorrection is set by the user, eg, 0.5 for half corrected; userErrorCorrectionFactor is set by the user in the zonal error table, eg, 0.9 or 1.1
			zonalRoC = scaledRadiusOfCurvature + scaledMirrorZoneSquared / scaledRadiusOfCurvature * userParabolicCorrection * userErrorCorrectionFactor;
			// offset*2 for light source that moves with Ronchi grating
			gratingToZonalRoC = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zonalRoC;
			// xAtGrating = projection of ray at scaledMirrorRadius onto grating displaced from RC by gratingOffset;
			// use similar triangles to calculate x position of ray where it passes through the grating; works regardless if grating is in front or behind
			xAtGrating = Math.abs(gratingToZonalRoC * x / zonalRoC);
			// test for ray blockage by grating; scaledLineWidth is half the grating frequency to create odd and even numbers because one solid and one transparent line = one grating line overall
			xGratingLineNumberDoubled = xAtGrating / scaledLineWidth;
			intXGratingLineNumberDoubled = int(xGratingLineNumberDoubled + 0.5);
			// if modulus intXGratingLineNumberDoubled is true, then ray passes through grating
			band = intXGratingLineNumberDoubled % 2 === 0;
			// if ray makes it through, then mark Ronchi band for display;
			// one can argue that a dark Ronchi band should appear if the ray does not make it through, but this convention is consistent with other software
			if (band) {
				pixelArray[x][y] = 1;
			}

			// calculate band transitions without userErrorCorrectionFactor; this so that the Ronchi bands and the software nulled graph are not distorted by user entered zonal correction factors
			// only use the first row to calculate the tape bands
			if (y === 0) {
				zonalRoC = scaledRadiusOfCurvature + scaledMirrorZoneSquared / scaledRadiusOfCurvature * userParabolicCorrection;
				gratingToZonalRoC = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zonalRoC;
				xAtGrating = Math.abs(gratingToZonalRoC * x / zonalRoC);
				xGratingLineNumberDoubled = xAtGrating / scaledLineWidth;
				intXGratingLineNumberDoubled = int(xGratingLineNumberDoubled + 0.5);
				band = intXGratingLineNumberDoubled % 2 === 0;
				// save RonchiBandTransitions to calculate Ronchi Tape Band locations
				if (band !== lastBand) {
					lastBand = band;
					RonchiBandTransitions.push(x / scalingFactor);
				}
			}
		}
	}
	common.pixelArray = pixelArray;
	return RonchiBandTransitions;
};

MLB.ronchi.drawRonchigramOnCanvas = (canvas, gratingOffset, userParabolicCorrection) => {
	var common = MLB.ronchi.common,
		mirrorDia = common.UIMirrorDia,
		gratingFreq = +common.gratingFreq().val(),
		RonchigramSize = common.UIRonchigramSize,
		setImageDataToBackgroundBandColor = MLB.ronchi.setImageDataToBackgroundBandColor,
		point = MLB.sharedLib.point,
		scalingFactor,
		ronchiCenter,
		context,
		imageData,
		mirrorRadius,
		scaledMirrorRadius,
		RonchiBandTransitions,
		calcRonchiBands = MLB.ronchi.calcRonchiBands,
		createTapeBandsFromRonchiBandTransitions = MLB.ronchi.createTapeBandsFromRonchiBandTransitions,
		processPixelArray = MLB.ronchi.processPixelArray,
		setImagePixels = MLB.ronchi.setImagePixels;

	context = canvas.getContext("2d", {willReadFrequently: true});

	scalingFactor = RonchigramSize / mirrorDia;
	mirrorRadius = mirrorDia / 2;
	scaledMirrorRadius = mirrorRadius * scalingFactor;
	ronchiCenter = point(RonchigramSize / 2, RonchigramSize / 2);

	// create a new pixel array
	imageData = context.createImageData(RonchigramSize, RonchigramSize);
	setImageDataToBackgroundBandColor(imageData, RonchigramSize, RonchigramSize);
	RonchiBandTransitions = calcRonchiBands(gratingFreq, gratingOffset, scalingFactor, userParabolicCorrection);
	common.RonchiBandTransitions.push(RonchiBandTransitions);
	createTapeBandsFromRonchiBandTransitions(mirrorRadius, RonchiBandTransitions);
	processPixelArray();
	setImagePixels(imageData, ronchiCenter);

	// copy the image data back onto the canvas
	context.putImageData(imageData, 0, 0);

	common.context = context;
	common.scalingFactor = scalingFactor;
};

MLB.ronchi.drawPostRonchigramInformation = () => {
	var common = MLB.ronchi.common,
		RonchigramSize = common.UIRonchigramSize,
		drawRulers = MLB.ronchi.drawRulers,
		noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection,
		writeGratingOffset = MLB.ronchi.writeGratingOffset,
		gratingFreq = +common.gratingFreq().val(),
		returnConcatenatedMirrorDiaFocalRatio = MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio,
		point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		mirrorDia = common.UIMirrorDia,
		centralObstruction = +common.centralObstruction().val(),
		pastedImageName = common.pastedImageName().val(),
		ronchiCenter = point(RonchigramSize / 2, RonchigramSize / 2),
		scalingFactor = common.scalingFactor,
		mirrorRadius = mirrorDia / 2,
		scaledMirrorRadius = mirrorRadius * scalingFactor,
		uom,
		context = common.context;

	// draw the circle that outlines mirror's aperture in the Ronchigram
	drawCircle(context, ronchiCenter, scaledMirrorRadius, 1, common.blackColor);
	// fill in any central obstruction
	fillCircle(context, ronchiCenter, scalingFactor * centralObstruction / 2, common.blackColor);
	// draw circular rulers if any
	drawRulers(context, ronchiCenter, mirrorRadius, scalingFactor);
	// write parabolic correction which also sets the fillStyle and font
	noteParabolicCorrection(context, RonchigramSize);
	// write grating offset
	writeGratingOffset(context, RonchigramSize);
	// add mirror size + FR
	context.fillText(returnConcatenatedMirrorDiaFocalRatio(), 2, common.fontSize);
	// write grating frequency
	context.fillText(gratingFreq + common.barsLit, 2, common.fontSize * 2 + 2);
	// write UOM
	if (common.inchesSelected()) {
		uom = common.inchesLit;
	} else {
		uom = common.mmLit;
	}
	context.fillText(uom, 5, common.fontSize * 3 + 2);
	// write name
	context.fillText(pastedImageName, RonchigramSize / 2 * 1.5, RonchigramSize - common.fontSize);
	// write if image is pasted and match to rulers
	if (common.pastedImageActiveIsChecked()) {
		context.fillText(common.pastedImageLit, 0, RonchigramSize - common.fontSize);
	}
};

MLB.ronchi.noteParabolicCorrection = (context, RonchigramSize) => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		parabCorr = +common.userParabolicCorrection().val(),
		txt;

	context.fillStyle = common.rulerColor;
	context.font = common.fontSize + common.fontLit;
	txt = common.parabCorrLit + roundToDecimal(parabCorr, common.parabolicCorrectionDisplayPrecision);
	context.fillText(txt, RonchigramSize - 100, common.fontSize);
};

MLB.ronchi.writeGratingOffset = (context, RonchigramSize) => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		gratingOffset = +common.gratingOffset().val(),
		txt;

	context.fillStyle = common.rulerColor;
	context.font = common.fontSize + common.fontLit;
	txt = common.gratingOffsetLit + roundToDecimal(gratingOffset, common.gratingOffsetDisplayPrecision);
	context.fillText(txt, RonchigramSize - 100, common.fontSize * 2);
};

MLB.ronchi.adjustRulerThickness = (ix, circularZonalRulerCount) => {
	var common = MLB.ronchi.common,
		rulerThickness = common.rulerThickness;

	// thicken the circle at the mid-point
	return rulerThickness + (ix % (circularZonalRulerCount / 2) === 0 ? 1 : 0);
};

MLB.ronchi.drawRulers = (context, RonchiCenter, mirrorRadius, scalingFactor) => {
	var common = MLB.ronchi.common,
		drawCircle = MLB.sharedLib.drawCircle,
		circularZonalRulerCount = common.circularZonalRulerCount().val(),
		adjustRulerThickness = MLB.ronchi.adjustRulerThickness,
		ix,
		scaledMirrorRadius = mirrorRadius * scalingFactor;

	for (ix = 1; ix < circularZonalRulerCount; ix++) {
		drawCircle(context,
				RonchiCenter,
				scaledMirrorRadius * ix / circularZonalRulerCount,
				adjustRulerThickness(ix, circularZonalRulerCount),
				common.rulerColor);
	}
};

MLB.ronchi.loadPastedImageIntoCanvas = (canvas, image) => {
	var common = MLB.ronchi.common,
		context = canvas.getContext("2d", {willReadFrequently: true});

	context.globalAlpha = +common.pastedImageTransparency().val();
	context.drawImage(image, +common.pastedImageOffsetX().val(), +common.pastedImageOffsetY().val(), +common.pastedImageWidth().val(), +common.pastedImageHeight().val());
};

MLB.ronchi.plotRonchigramsCalcRonchiTape = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		gratingOffset = +common.gratingOffset().val(),
		bandColorRGB = common.bandColorRGB().val().split(','),
		red = +bandColorRGB[0],
		green = +bandColorRGB[1],
		blue = +bandColorRGB[2],
		calcWavefrontErrorForSphericalMirror = MLB.calcLib.calcWavefrontErrorForSphericalMirror,
		RonchigramIx = common.RonchigramIx,
		mirrorDia = common.UIMirrorDia,
		mirrorDiaInches,
		focalRatio,
		userParabolicCorrection,
		wavesCorrection,
		matchingTapeBandStr,
		drawRonchigramOnCanvas = MLB.ronchi.drawRonchigramOnCanvas,
		RonchigramSize = common.UIRonchigramSize,
		loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
		unitLit;

	if (isNaN(red) || isNaN(green) || isNaN(blue) || red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
		alert("Band color of '" + bandColorRGB + "' not properly entered. Please correct and try again.");
		return;
	}

	focalRatio = +common.focalRatio().val();
	userParabolicCorrection = +common.userParabolicCorrection().val();
	if (common.inchesSelected()) {
		mirrorDiaInches = mirrorDia;
		unitLit = common.inchesLit;
	} else {
		mirrorDiaInches = mirrorDia / 25.4;
		unitLit = common.mmLit;
	}
	wavesCorrection = calcWavefrontErrorForSphericalMirror(mirrorDiaInches, focalRatio);
	common.waveNotes().html(roundToDecimal(wavesCorrection, common.wavesDecimalPrecision)
			+ ' waves correction fitting paraboloid to spheroid at edge or center; '
			+ roundToDecimal(wavesCorrection / 4, common.wavesDecimalPrecision)
			+ ' waves best fit minimum paraboloidal deviation at 71% zone.'
	);

	// reset the Ronchi RonchiBands
	common.RonchiBands = [];
	common.RonchiBandTransitions = [];

	// build canvases for Ronchigrams...
	// start by 'zeroing out' the html
	common.Ronchigrams().html('');
	common.Ronchigrams().append("<canvas id='RonchiCanvas" + RonchigramIx + "' width='" + RonchigramSize + "' height='" + RonchigramSize + "'></canvas> &emsp;");
	// now draw the Ronchigram
	drawRonchigramOnCanvas($('[id=RonchiCanvas' + RonchigramIx + ']')[0], gratingOffset, userParabolicCorrection);

	// load pasted image into first Ronchigram
	if (common.pastedImageActiveIsChecked() && common.images[common.pastedImageLit] !== undefined) {
		loadPastedImageIntoCanvas(common.pastedImageRonchiCanvas(), common.images[common.pastedImageLit]);
	}
	// display the RonchiBands
	matchingTapeBandStr = "<p>The Ronchi bands horizontally cross the mirror's center at radii: ";
	common.RonchiBands.forEach(tape => {
		matchingTapeBandStr += '<b>: ' + tape.join(', ') + '</b>; ';
	});
	// remove that last '; '
	matchingTapeBandStr = matchingTapeBandStr.slice(0, -2);
	matchingTapeBandStr += ' ' + unitLit;
	matchingTapeBandStr += '. See the <a href="#RonchiTape">Ronchi Tape Band discussion</a>.';
	common.tapeBandsDiv().html(matchingTapeBandStr);
};

// for outside use eg in a spreadsheet
// y is the y axis value, eg, horizontal line through mirror's center is 0
MLB.ronchi.stringifyRonchigramDistortions = y => {
	var common = MLB.ronchi.common,
		RGD = common.RGD,
		xs = RGD[y],
		s = '';

	xs.forEach(x => s += x.sphere + ', ' + x.parabola + ', ' + x.distortion + ';');

	return s;
};

MLB.ronchi.getAndFixDistortionResolutionFactor = () => {
	var common = MLB.ronchi.common,
		DRF = +common.distortionResolutionFactor().val();

	if (DRF === 0) {
		DRF = 2;
		common.distortionResolutionFactor().val('2');
	}
	return DRF;
};

MLB.ronchi.calcRonchigramDistortions = () => {
	var common = MLB.ronchi.common,
		mirrorDia = common.UIMirrorDia,
		radiusOfCurvature = common.UIRadiusOfCurvature,
		gratingFreq = +common.gratingFreq().val(),
		gratingOffset = +common.gratingOffset().val(),
		RonchigramSize = common.UIRonchigramSize,
		userParabolicCorrection = +common.userParabolicCorrection().val(),
		DRF = MLB.ronchi.getAndFixDistortionResolutionFactor(),
		int = MLB.sharedLib.int,
		getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
		mirrorRadius = mirrorDia / 2,
		scalingFactor,
		scaledMirrorRadius,
		scaledMirrorRadiusSquared,
		scaledRadiusOfCurvature,
		scaledGratingOffset,
		scaledLineWidth,
		scaledMirrorZoneSquared,
		scaledMirrorZone,
		x,
		y,
		ySquared,
		userErrorCorrectionFactor,
		zonalRoC,
		gratingToZonalRoC,
		xAtGrating,
		xGratingLineNumberDoubled,
		intXGratingLineNumberDoubled,
		xGratingLineNumberDoubledSphere,
		parabolicDistortion,
		RGD = [],
		RGD_NoUserError = [];

	// if gratingOffset === 0 then xGratingLineNumberDoubledSphere becomes 0 and parabolicDistortion becomes infinite
	if (gratingOffset === 0) {
		gratingOffset = common.smallestZeroGratingOffsetForNullRonchigram;
	}
	// eg, 2 means that the RonchigramDistortions array is twice the size in x and twice the size in y for an area increase of 4x of the RonchigramSize;
	// this to fill in the voids that occur while nullping the Ronchigram
	scalingFactor = RonchigramSize / mirrorDia * DRF;
	scaledMirrorRadius = int(mirrorRadius * scalingFactor);
	scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
	scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
	scaledGratingOffset = gratingOffset * scalingFactor;
	scaledLineWidth = scalingFactor / (2 * gratingFreq);

	// calculate just one quadrant that later can be applied to the other three quadrants (note that scaledMirrorRadius is increased by DRF here)
	for (y = 0; y < scaledMirrorRadius; y++) {
		ySquared = y * y;
		RGD[y] = [];
		RGD_NoUserError[y] = [];

		for (x = 0; x < scaledMirrorRadius; x++) {
			scaledMirrorZoneSquared = ySquared + x * x;
			if (scaledMirrorZoneSquared > scaledMirrorRadiusSquared) {
				break; // done with 'x' for loop
			}
			scaledMirrorZone = Math.sqrt(scaledMirrorZoneSquared);
			userErrorCorrectionFactor = getInterpolatedCorrection(scaledMirrorZone / scaledMirrorRadius);

			// include userErrorCorrectionFactor
			// duplicate formula of calcRonchiBands() but here the scalingFactor is increased by DRF which means that the scaledMirrorRadius is increased by DRF too so cannot simply reuse the zonalRoC values
			zonalRoC = scaledRadiusOfCurvature + scaledMirrorZoneSquared / scaledRadiusOfCurvature * userParabolicCorrection * userErrorCorrectionFactor;
			gratingToZonalRoC = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zonalRoC;
			xAtGrating = Math.abs(gratingToZonalRoC * x / zonalRoC);
			xGratingLineNumberDoubled = xAtGrating / scaledLineWidth;
			intXGratingLineNumberDoubled = int(xGratingLineNumberDoubled + 0.5);
			// calculate for sphere, ie, no parab correction
			xGratingLineNumberDoubledSphere = Math.abs(scaledGratingOffset * 2 * x / scaledRadiusOfCurvature / scaledLineWidth);
			parabolicDistortion = xGratingLineNumberDoubled / xGratingLineNumberDoubledSphere;
			RGD[y][x] = {
				sphere: xGratingLineNumberDoubledSphere,
				parabola: xGratingLineNumberDoubled,
				distortion: parabolicDistortion
			};

			// and again but do not include userErrorCorrectionFactor: zonal circular rulers and central obstruction are independent of any user error correction factors
			zonalRoC = scaledRadiusOfCurvature + scaledMirrorZoneSquared / scaledRadiusOfCurvature * userParabolicCorrection;
			gratingToZonalRoC = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zonalRoC;
			xAtGrating = Math.abs(gratingToZonalRoC * x / zonalRoC);
			xGratingLineNumberDoubled = xAtGrating / scaledLineWidth;
			intXGratingLineNumberDoubled = int(xGratingLineNumberDoubled + 0.5);
			// calculate for sphere, ie, no parab correction
			// not needed for no user error situation
			// xGratingLineNumberDoubledSphere = Math.abs(scaledGratingOffset * 2 * x / scaledRadiusOfCurvature / scaledLineWidth);
			parabolicDistortion = xGratingLineNumberDoubled / xGratingLineNumberDoubledSphere;
			RGD_NoUserError[y][x] = {
				distortion: parabolicDistortion
			};
		}
	}
	common.RGD = RGD;
	common.RGD_NoUserError = RGD_NoUserError;
};

MLB.ronchi.computeNullRonchigram = () => {
	var common = MLB.ronchi.common,
		RonchigramSize = common.UIRonchigramSize,
		nullRonchigramIx = common.nullRonchigramIx,
		showBullseyeZones = common.showBullseyeZones()[common.yes].checked,
		DRF = MLB.ronchi.getAndFixDistortionResolutionFactor(),
		int = MLB.sharedLib.int,
		point = MLB.sharedLib.point,
		nullSetPixel = MLB.ronchi.nullSetPixel,
		setImageDataToBackgroundBandColor = MLB.ronchi.setImageDataToBackgroundBandColor,
		calcRonchigramDistortions = MLB.ronchi.calcRonchigramDistortions,
		calcNullRonchiBandRulers = MLB.ronchi.calcNullRonchiBandRulers,
		calcZonalCircularRulers = MLB.ronchi.calcZonalCircularRulers,
		calcCentralObstructionNull = MLB.ronchi.calcCentralObstructionNull,
		nullCanvas,
		context,
		nullImageData,
		pastedImageContext,
		origImg,
		RonchiCenter,
		RGD,
		distortionLength,
		distortion,
		dx,
		maxDistortion,
		maxX = 0,
		distortionDRXSet = [],
		distortionNewCount = 0,
		distortionAlreadySetCount = 0,
		scalingFactor,
		scaleNullRonchigram = MLB.ronchi.scaleNullRonchigram;

	calcRonchigramDistortions();
	RGD = common.RGD;
	distortionLength = RGD[0].length;
	maxDistortion = 0;
	for (dx = 0; dx < distortionLength; dx++) {
		distortion = RGD[0][dx].distortion;
		if (distortion > maxDistortion) {
			maxDistortion = distortion;
		}
	}

	// RonchigramSize is size of first Ronchigram
	RonchiCenter = point(RonchigramSize / 2, RonchigramSize / 2);

	common.Ronchigrams().append("<canvas id='RonchiCanvas" + nullRonchigramIx + "' width='" + RonchigramSize + "' height='" + RonchigramSize + "'></canvas>");
	nullCanvas = $('[id=RonchiCanvas' + nullRonchigramIx + ']')[0];
	context = nullCanvas.getContext("2d", {willReadFrequently: true});
	nullImageData = context.createImageData(nullCanvas.width, nullCanvas.height);
	setImageDataToBackgroundBandColor(nullImageData, nullCanvas.width, nullCanvas.height);

	/* apply the calculated ideal distortion quadrant to each original Ronchigram quadrant, filling in gaps;
	   distortion calculated in calcRonchiBands() by comparing the parabolic ray height at the offset grating to the spherical ray height
	   while we have the x,y distortion, get the original image x,y pixels from each quadrant and apply the distortion to get the new nulled x,y pixels;
	   start at the originating Ronchigram center, working outward horizontally and vertically, +-x,+-y for each quadrant as needed;
	  */

	// make one call to pastedImageContext() as Firefox is impossibly slow otherwise (~1 minute to make pastedImageContext() on individual x,u basis)
	pastedImageContext = common.pastedImageRonchiCanvas().getContext("2d", {willReadFrequently: true});
	origImg = pastedImageContext.getImageData(0, 0, RonchigramSize, RonchigramSize).data;

	RGD.forEach((RGDy, yIx) => {
		RGDy.forEach((RGDx, xIx) => {
			var distortionRatio,
				distortionOffsetX,
				distortionOffsetY,
				yDir,
				xDir,
				yIx_DRF,
				xIx_DRF,
				distortionOffsetY_DRF,
				distortionOffsetX_DRF;

			// ie, 75% zone is at Math.pow(yIx / distortionLength, 2) + Math.pow(xIx / distortionLength, 2) === Math.sqrt(0.75)

			/* eg, distortionRatios for default Ronchigram 12F5:
				yIx,xIx: 0,0    = NaN
						 0,1    = 0.577
						 0,124  = 1
						 62,1   = 0.683
						 62,108 = 1.004
						 120,35 = 1.007
				16F2.9 inside RoC example, distortionRatio at:
						 0,1   = 0.126 (distortion = 1.0000195706001; distortion varies from ~1 to ~8; maxDistortion = 7.969608521281272 which occurs on final 'x')
				25F2.6 outside RoC example ,distortionRatio at:
						 0,1   = 1 (distortion = 0.999995100864859; distortion varies from ~1 to ~0.23; maxDistortion = 0.999995100864859 which occurs on initial 'x'; parabola varies from 0 to 4.37883185253084, with max of 8.41948051098935 @ row of 263 out of 400)
			*/
			distortion = RGDx.distortion;
			distortionRatio = Math.abs(distortion / maxDistortion);

			distortionOffsetY = int(yIx * distortionRatio + 0.5); // adjust for any scaling here...
			distortionOffsetX = int(xIx * distortionRatio + 0.5); // adjust for any scaling here...

			// set MaxX for scaling later
			if (distortionOffsetX > maxX) {
				maxX = distortionOffsetX;
			}

			// DRF = distortion resolution factor: need more resolution in the distortion array compared to the Ronchigram so that, when the Ronchigram is nulled, there are no gaps in the displayed pixels
			yIx_DRF = yIx / DRF;
			xIx_DRF = xIx / DRF;
			distortionOffsetY_DRF = distortionOffsetY / DRF;
			distortionOffsetX_DRF = distortionOffsetX / DRF;

			if (!showBullseyeZones) {
				// don't repeat already set pixels (can cause a shift of a pixel or so in the final nulled Ronchigram)
				if (!distortionDRXSet[distortionOffsetY_DRF]) {
					distortionDRXSet[distortionOffsetY_DRF] = [];
				}
				if (!distortionDRXSet[distortionOffsetY_DRF][distortionOffsetX_DRF]) {
					distortionDRXSet[distortionOffsetY_DRF][distortionOffsetX_DRF] = true;
					distortionNewCount++;
				} else {
					distortionAlreadySetCount++;
					// remember we are in an anonymous lambda function from the inner forEach
					return;
				}
			}

			// lower right quadrant
			xDir = 1;
			yDir = 1;
			nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, RonchiCenter, nullImageData, origImg);
			// upper right quadrant
			xDir = 1;
			yDir = -1;
			nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, RonchiCenter, nullImageData, origImg);
			// upper left quadrant
			xDir = -1;
			yDir = -1;
			nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, RonchiCenter, nullImageData, origImg);
			// lower left quadrant
			xDir = -1;
			yDir = 1;
			nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, RonchiCenter, nullImageData, origImg);
		});
	});

	//console.log('distortions already set ' + distortionAlreadySetCount + '; new distortions ' + distortionNewCount);

	// maxX is 0 for RoC grating offset of 0
	if (maxX === 0) {
		return;
	}

	context.putImageData(nullImageData, 0, 0);

	// scaling needed to maintain nulled Ronchigram size when outside RoC with looping: the loops wrap back on themselves, reducing the max Ronchigram width/height;
	// scaling here reduces resolution but is easier and faster; could scale earlier during the parabolic distortion calculations but that means many more calcs et al;
	// scalingFactor is never less than 1;
	scalingFactor = distortionLength / maxX;
	if (scalingFactor > 1) {
		scaleNullRonchigram(context, scalingFactor);
	}

	calcNullRonchiBandRulers(DRF, maxDistortion, scalingFactor);
	calcZonalCircularRulers(RonchiCenter, DRF, maxDistortion, scalingFactor);
	calcCentralObstructionNull(RonchiCenter, DRF, maxDistortion, scalingFactor);

	common.nullContext = context;
};

MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		mirrorDia = +common.UIMirrorDia,
		focalRatio = +common.focalRatio().val();

	return roundToDecimal(mirrorDia, common.dimensionDecimalPrecision)
			+ 'F'
			+ roundToDecimal(focalRatio, common.dimensionDecimalPrecision);
};

MLB.ronchi.scaleNullRonchigram = (context, scalingFactor) => {
	var common = MLB.ronchi.common,
		RonchigramSize = common.UIRonchigramSize,
		scaleImageData = MLB.sharedLib.scaleImageData,
		cornerOffsetXY;

	cornerOffsetXY = RonchigramSize * (scalingFactor - 1) / 2;
	context.putImageData(scaleImageData(context.getImageData(0, 0, RonchigramSize, RonchigramSize), scalingFactor), -cornerOffsetXY, -cornerOffsetXY);
};

MLB.ronchi.calcNulledStretchedScaledIx = (v, DRF, maxDistortion, scalingFactor) => {
	var common = MLB.ronchi.common,
		int = MLB.sharedLib.int,
		mirrorDia = common.UIMirrorDia,
		// note: user zonal errors are not used here...
		RGD = common.RGD_NoUserError,
		RonchiBandRelativeX,
		maxIx,
		nulledIx,
		distortion,
		distortionRatio,
		nullIxStretch,
		nullIxStretchScaled;

	RonchiBandRelativeX = v / mirrorDia * 2;
	maxIx = RGD[0].length; // eg, 125
	nulledIx = int(RonchiBandRelativeX * maxIx); // not + 0.5 which results in wrong nulledIx
	distortion = RGD[0][nulledIx].distortion;
	distortionRatio = Math.abs(distortion / maxDistortion);
	nullIxStretch = int(nulledIx * distortionRatio / DRF + 0.5); // round to nearest index before stretching the Ronchigram (when outside RoC with bullseye)
	nullIxStretchScaled = int(nullIxStretch * scalingFactor + 0.5);
	/*
	console.log('RonchiBandRelativeX: ' + RonchiBandRelativeX
			+ ', nulledIx: ' + nulledIx
			+ ', distortion: ' + distortion
			+ ', distortionRatio: ' + distortionRatio
			+ ', nullIxStretch: ' + nullIxStretch
			+ ', scalingFactor: ' + scalingFactor
			+ ', nullIxStretchScaled: ' + nullIxStretchScaled
			+ '\n');
	*/
	return nullIxStretchScaled;
};

/*
default example:
RonchiBandRelativeX: 0,                   nulledIx: 0,   distortion: NaN,                 distortionRatio: NaN,                 nullIxStretch: 0,   scalingFactor: 1,                  nullIxStretchScaled: 0
RonchiBandRelativeX: 0.43333333333333335, nulledIx: 173, distortion: 1.1397591898001271,  distortionRatio: 0.6543114053020872,  nullIxStretch: 57,  scalingFactor: 1,                  nullIxStretchScaled: 57
RonchiBandRelativeX: 0.7233333333333333,  nulledIx: 289, distortion: 1.389691118875957,   distortionRatio: 0.7977919871714432,  nullIxStretch: 115, scalingFactor: 1,                  nullIxStretchScaled: 115
RonchiBandRelativeX: 0.9233333333333333,  nulledIx: 369, distortion: 1.634776674581454,   distortionRatio: 0.9384903696087267,  nullIxStretch: 173, scalingFactor: 1,                  nullIxStretchScaled: 173

set FR to 3 and grating offset to 0.36 for outside of RoC:
RonchiBandRelativeX: 0,                   nulledIx: 0,   distortion: NaN,                 distortionRatio: NaN,                 nullIxStretch: 0,   scalingFactor: 2.1739130434782608, nullIxStretchScaled: 0
RonchiBandRelativeX: 0.17500000000000002, nulledIx: 70,  distortion: 0.9785245325429985,  distortionRatio: 0.9785288221005743,  nullIxStretch: 34,  scalingFactor: 2.1739130434782608, nullIxStretchScaled: 74
RonchiBandRelativeX: 0.375,               nulledIx: 150, distortion: 0.9014634146341465,  distortionRatio: 0.9014673663789325,  nullIxStretch: 68,  scalingFactor: 2.1739130434782608, nullIxStretchScaled: 148 <= should agree with each other
RonchiBandRelativeX: 0.6933333333333334,  nulledIx: 277, distortion: 0.6647610048982241,  distortionRatio: 0.6647639190107576,  nullIxStretch: 92,  scalingFactor: 2.1739130434782608, nullIxStretchScaled: 200
RonchiBandRelativeX: 0.9633333333333334,  nulledIx: 385, distortion: 0.35438245057567563, distortionRatio: 0.35438400408187304, nullIxStretch: 68,  scalingFactor: 2.1739130434782608, nullIxStretchScaled: 148 <= should agree with each other
*/

// eg, defaults: 0, 57, 115, 173
MLB.ronchi.calcNullRonchiBandRulers = (DRF, maxDistortion, scalingFactor) => {
	var common = MLB.ronchi.common,
		RonchiBands = common.RonchiBands,
		calcNulledStretchedScaledIx = MLB.ronchi.calcNulledStretchedScaledIx,
		nullIxStretchScaled,
		nullRonchiBands = [];

	RonchiBands[0].forEach(t => {
		nullIxStretchScaled = calcNulledStretchedScaledIx(t, DRF, maxDistortion, scalingFactor);
		nullRonchiBands.push(nullIxStretchScaled);
	});
	common.nullRonchiBands = nullRonchiBands;
};

MLB.ronchi.drawNullRonchiBandRulers = (context, RonchigramSize) => {
	var common = MLB.ronchi.common,
		nullRonchiBands = common.nullRonchiBands,
		RonchiGrid = common.RonchiGrid()[common.yes].checked,
		rulerThickness = common.rulerThickness,
		drawLine = MLB.sharedLib.drawLine,
		point = MLB.sharedLib.point,
		midPt = RonchigramSize / 2;

	// nullRonchiBands for the default example are: [0, 57, 115, 173]
	// vertical: 1st right hand side then left hand side
	nullRonchiBands.forEach(ix => drawLine(context, common.rulerColor, rulerThickness, point(ix + midPt, 0), point(ix + midPt, RonchigramSize)));
	nullRonchiBands.forEach(ix => drawLine(context, common.rulerColor, rulerThickness, point(midPt - ix, 0), point(midPt - ix, RonchigramSize)));
	if (RonchiGrid) {
		// horizontal: 1st bottom half then top half
		nullRonchiBands.forEach(ix => drawLine(context, common.rulerColor, rulerThickness, point(0, ix + midPt), point(RonchigramSize, ix + midPt)));
		nullRonchiBands.forEach(ix => drawLine(context, common.rulerColor, rulerThickness, point(0, midPt - ix), point(RonchigramSize, midPt - ix)));
	}
};

MLB.ronchi.calcZonalCircularRulers = (RonchiCenter, DRF, maxDistortion, scalingFactor) => {
	var common = MLB.ronchi.common,
		mirrorDia = common.UIMirrorDia,
		circularZonalRulerCount = +common.circularZonalRulerCount().val(),
		calcNulledStretchedScaledIx = MLB.ronchi.calcNulledStretchedScaledIx,
		zIx,
		z,
		nullIxStretchScaled,
		zonalCircularRulersNulled = [];

	for (zIx = 0; zIx < circularZonalRulerCount; zIx++) {
		z = mirrorDia / 2 * zIx / circularZonalRulerCount;

		nullIxStretchScaled = calcNulledStretchedScaledIx (z, DRF, maxDistortion, scalingFactor);
		zonalCircularRulersNulled.push(nullIxStretchScaled);
	}

	common.zonalCircularRulersNulled = zonalCircularRulersNulled;
};

MLB.ronchi.drawZonalCircularRulers = (context, RonchigramSize) => {
	var common = MLB.ronchi.common,
		zonalCircularRulersNulled = common.zonalCircularRulersNulled,
		circularZonalRulerCount = +common.circularZonalRulerCount().val(),
		adjustRulerThickness = MLB.ronchi.adjustRulerThickness,
		rulerColor = common.rulerColor,
		drawCircle = MLB.sharedLib.drawCircle,
		point = MLB.sharedLib.point;

	zonalCircularRulersNulled.forEach((value, ix) => drawCircle(context,
			point(RonchigramSize / 2, RonchigramSize / 2),
			value,
			adjustRulerThickness(ix, circularZonalRulerCount),
			rulerColor));
};

MLB.ronchi.calcCentralObstructionNull = (RonchiCenter, DRF, maxDistortion, scalingFactor) => {
	var common = MLB.ronchi.common,
		calcNulledStretchedScaledIx = MLB.ronchi.calcNulledStretchedScaledIx,
		centralObstruction = +common.centralObstruction().val(),
		nullIxStretchScaled;

	nullIxStretchScaled = calcNulledStretchedScaledIx(centralObstruction / 2, DRF, maxDistortion, scalingFactor);
	common.centralObstructionNullIx = nullIxStretchScaled;
};

MLB.ronchi.drawCentralObstructionNull = (context, RonchigramSize) => {
	var common = MLB.ronchi.common,
		centralObstructionNullIx = common.centralObstructionNullIx,
		point = MLB.sharedLib.point,
		fillCircle = MLB.sharedLib.fillCircle;

	fillCircle(context, point(RonchigramSize / 2, RonchigramSize / 2), centralObstructionNullIx, common.blackColor);
};

MLB.ronchi.nullSetPixel = (yIx, xIx, yDir, xDir, distortionOffsetY, distortionOffsetX, RonchiCenter, nullImageData, origImg) => {
	var setPixel = MLB.sharedLib.setPixel,
		int = MLB.sharedLib.int,
		origY = int(RonchiCenter.y + yIx * yDir),
		origX = int(RonchiCenter.x + xIx * xDir),
		RonchigramWidth = RonchiCenter.x * 2,
		origIx = (origY * RonchigramWidth + origX) * 4,
		newY = int(RonchiCenter.y + distortionOffsetY * yDir),
		newX = int(RonchiCenter.x + distortionOffsetX * xDir);

	setPixel(nullImageData, newX, newY, origImg[origIx], origImg[origIx + 1], origImg[origIx + 2], origImg[origIx + 3]);
};

MLB.ronchi.setImageDataToBackgroundBandColor = (imageData, width, height) => {
	var common = MLB.ronchi.common,
		backgroundBandColorRGB = common.backgroundBandColorRGB().val().split(','),
		backgroundRed = +backgroundBandColorRGB[0],
		backgroundGreen = +backgroundBandColorRGB[1],
		backgroundBlue = +backgroundBandColorRGB[2],
		opaque = common.opaque,
		setPixel = MLB.sharedLib.setPixel,
		x,
		y;

	for(x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			setPixel(imageData, x, y, backgroundRed, backgroundGreen, backgroundBlue, opaque);
		}
	}
};

MLB.ronchi.setGratingOffsetFromOffset = offset => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		gratingOffset = common.gratingOffset;

	gratingOffset().val(roundToDecimal(+gratingOffset().val() + offset, common.gratingOffsetDecimalPrecision));
};

MLB.ronchi.setGratingOffsetFromSliderOffset = () => {
	var common = MLB.ronchi.common,
		setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
		sliderOffsetValue;

	if (!common.sliderOffsetMousedown) {
		return;
	}

	sliderOffsetValue = parseFloat(common.sliderOffset().val());
	setGratingOffsetFromOffset(sliderOffsetValue - common.lastSliderOffsetValue);
	common.lastSliderOffsetValue = sliderOffsetValue;
};

MLB.ronchi.setParabolicCorrectionFromSliderParabolicCorrection = () => {
	var common = MLB.ronchi.common,
		sliderValue;

	if (!common.sliderParabolicCorrectionMousedown) {
		return;
	}
	sliderValue = parseFloat(common.sliderParabolicCorrection().val());
	common.userParabolicCorrection().val(sliderValue);
};

MLB.ronchi.saveCanvasImage = canvas => {
	var common = MLB.ronchi.common,
		RonchigramSize = common.UIRonchigramSize,
		context = canvas.getContext("2d", {willReadFrequently: true});

	common.images[canvas.id] = context.getImageData(0, 0, RonchigramSize, RonchigramSize);
};

MLB.ronchi.savePastedImage = image => {
	var common = MLB.ronchi.common;

	common.images[common.pastedImageLit] = image;
};

MLB.ronchi.setPastedImageDefaults = () => {
	var common = MLB.ronchi.common,
		RonchigramSize = common.UIRonchigramSize;

	common.pastedImageHeight().val(RonchigramSize);
	common.pastedImageWidth().val(RonchigramSize);
	common.pastedImageOffsetX().val(0);
	common.pastedImageOffsetY().val(0);
	common.pastedImageName().val('');
};

MLB.ronchi.setPastedImageActive = () => {
	var common = MLB.ronchi.common;

	common.pastedImageActive()[common.yes].checked = true;
};

MLB.ronchi.setPastedImageInactive = () => {
	var common = MLB.ronchi.common;

	common.pastedImageActive()[common.no].checked = true;
};

MLB.ronchi.loadPastedImage = e => {
	var common = MLB.ronchi.common,
		saveCanvasImage = MLB.ronchi.saveCanvasImage,
		savePastedImage = MLB.ronchi.savePastedImage,
		loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
		setPastedImageDefaults = MLB.ronchi.setPastedImageDefaults,
		setPastedImageActive = MLB.ronchi.setPastedImageActive,
		godProcess = MLB.ronchi.godProcess,
		canvas = common.pastedImageRonchiCanvas();

	saveCanvasImage(canvas);
	savePastedImage(e.target);
	loadPastedImageIntoCanvas(canvas, e.target);
	setPastedImageDefaults();
	setPastedImageActive();

	godProcess();
};

MLB.ronchi.copyClipboardImage = e => {
	var items,
		ix,
		imageItem,
		blob,
		objectURL,
		source,
		pastedImage,
		loadPastedImage = MLB.ronchi.loadPastedImage;

	e.preventDefault();

	if (e.clipboardData) {
		items = e.clipboardData.items;
		// items can be array of url and image
		for (ix = 0; ix < items.length; ix++) {
			// eg, "image/png"
			if (items[ix].type.indexOf("image") > -1) {
				imageItem = items[ix];
				break;
			}
		}
		if (imageItem) {
			blob = imageItem.getAsFile();
			objectURL = window.URL || window.webkitURL;
			source = objectURL.createObjectURL(blob);

			pastedImage = new Image();
			pastedImage.onload = loadPastedImage;
			pastedImage.src = source;
			return;
		}
	}
	alert('No image found in clipboard');
};

MLB.ronchi.setDropEffectToCopy = e => {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
};

MLB.ronchi.dragAndDropImage = e => {
	var files,
		file,
		ix,
		objectURL,
		source,
		pastedImage,
		loadPastedImage = MLB.ronchi.loadPastedImage;

	e.stopPropagation();
	e.preventDefault();
	files = e.dataTransfer.files;

	for (ix = 0; ix < files.length; ix+=1) {
		file = files[ix];
		if (file.type.match(/image.*/)) {
			objectURL = window.URL || window.webkitURL;
			source = objectURL.createObjectURL(file);

			pastedImage = new Image();
			pastedImage.onload = loadPastedImage;
			pastedImage.src = source;
			return;
		}
	}
	alert('File is not an image');
};

MLB.ronchi.deleteImage = () => {
	var common = MLB.ronchi.common,
		godProcess = MLB.ronchi.godProcess,
		setPastedImageInactive = MLB.ronchi.setPastedImageInactive;

	common.images = {};
	setPastedImageInactive();
	godProcess();
};

MLB.ronchi.pasteExampleRonchigram = exampleImage => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		savePastedImage = MLB.ronchi.savePastedImage,
		loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
		setPastedImageActive = MLB.ronchi.setPastedImageActive,
		copyZonalRulerToErrorTable = MLB.ronchi.copyZonalRulerToErrorTable,
		resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors,
		godProcess = MLB.ronchi.godProcess,
		canvas = common.pastedImageRonchiCanvas(),
		image = new Image(),
		mirrorDia,
		RoC,
		ix = 0,
		imgSrc,
		scrollToTop = MLB.ronchi.scrollToTop;

	mirrorDia = exampleImage[ix++];
	common.mirrorDia().val(mirrorDia);
	common.UIMirrorDia = mirrorDia;

	RoC = exampleImage[ix++];
	common.radiusOfCurvature().val(RoC);
	common.UIRadiusOfCurvature = RoC;
	common.focalLength().val(roundToDecimal(RoC / 2, common.focalLengthPrecision));
	common.focalRatio().val(roundToDecimal(RoC / mirrorDia / 2, common.focalRatioPrecision));

	common.centralObstruction().val(exampleImage[ix++]);
	common.gratingFreq().val(exampleImage[ix++]);
	common.gratingOffset().val(exampleImage[ix++]);
	common.userParabolicCorrection().val(exampleImage[ix++]);

	common.RonchigramSize().val(exampleImage[ix]);
	common.UIRonchigramSize = exampleImage[ix++];

	common.invertBands()[common.yes].checked = exampleImage[ix++];
	common.invertBands()[common.no].checked = !common.invertBands()[common.yes].checked;

	common.RonchiGrid()[common.yes].checked = exampleImage[ix++];
	common.RonchiGrid()[common.no].checked = !common.RonchiGrid()[common.yes].checked;

	common.circularZonalRulerCount().val(exampleImage[ix++]);

	common.pastedImageTransparency().val(exampleImage[ix++]);
	common.pastedImageWidth().val(exampleImage[ix++]);
	common.pastedImageHeight().val(exampleImage[ix++]);
	common.pastedImageOffsetX().val(exampleImage[ix++]);
	common.pastedImageOffsetY().val(exampleImage[ix++]);
	common.pastedImageName().val(exampleImage[ix++]);

	imgSrc = exampleImage[ix++];

	common.distortionResolutionFactor().val(exampleImage[ix++]);

	common.showBullseyeZones()[common.yes].checked = exampleImage[ix++];
	common.showBullseyeZones()[common.no].checked = !common.showBullseyeZones()[common.yes].checked;

	common.thinBands()[common.yes].checked = exampleImage[ix++];
	common.thinBands()[common.no].checked = !common.thinBands()[common.yes].checked;

	common.showGradients()[common.yes].checked = exampleImage[ix++];
	common.showGradients()[common.no].checked = !common.showGradients()[common.yes].checked;

	common.calcZonalCorrectionsFromThinning()[common.yes].checked = exampleImage[ix++];
	common.calcZonalCorrectionsFromThinning()[common.no].checked = !common.calcZonalCorrectionsFromThinning()[common.yes].checked;

	common.pastedImageName().val(exampleImage[ix++]);

	image.onload = e => {
		savePastedImage(e.target);
		loadPastedImageIntoCanvas(canvas, e.target);
		setPastedImageActive();
		resetCorrectionFactors();
		copyZonalRulerToErrorTable();
		godProcess();
	};
	image.src = imgSrc;

	scrollToTop();
};

MLB.ronchi.scrollToTop = () => {
	$('html,body').animate({
		scrollTop: $('#topDiv').offset().top
	});
};

MLB.ronchi.changeRonchigramSize = () => {
	var common = MLB.ronchi.common,
		godProcess = MLB.ronchi.godProcess;

	common.pastedImageWidth().val(common.UIRonchigramSize);
	common.pastedImageHeight().val(common.UIRonchigramSize);
	common.pastedImageOffsetX().val(0);
	common.pastedImageOffsetY().val(0);

	godProcess();
};

MLB.ronchi.getLocalStorageName = () => {
	var common = MLB.ronchi.common;

	return common.MatchingRonchiTestLit + common.dataName().val();
};

MLB.ronchi.showMatchingRonchiLocalStorageItems = () => {
  var common = MLB.ronchi.common,
	  findMatchingLocalStorageItems = MLB.sharedLib.findMatchingLocalStorageItems,
	  items = findMatchingLocalStorageItems(common.MatchingRonchiTestLit);

	alert('local storage data names are:\n' + items.join('\n'));
};

MLB.ronchi.removeMatchingRonchiLocalStorageItems = () => {
  var common = MLB.ronchi.common,
	  removeMatchingLocalStorageItems = MLB.sharedLib.removeMatchingLocalStorageItems;

	removeMatchingLocalStorageItems(common.MatchingRonchiTestLit);
};

MLB.ronchi.getNameIndexedElement = (name, ix) => {
	return $('[' + name + ix + ']');
};

MLB.ronchi.getNameIndexedElementValue = (name, ix) => {
	return MLB.ronchi.getNameIndexedElement(name, ix).val();
};

MLB.ronchi.setNameIndexedElementValue = (name, ix, val) => {
	MLB.ronchi.getNameIndexedElement(name, ix).val(val);
};

MLB.ronchi.getNameIndexedElementChBoxValue = (name, ix) => {
	return MLB.ronchi.getNameIndexedElement(name, ix).is(':checked');
};

MLB.ronchi.setNameIndexedElementChBoxValue = (name, ix, val) => {
	MLB.ronchi.getNameIndexedElement(name, ix).prop('checked', val);
};

MLB.ronchi.setIdIndexedLabelValue = (id, ix, val) => {
	$('[' + id + ix + ']').html(val);
};

MLB.ronchi.setIdIndexedLabelBackground = (id, ix, val) => {
	$('[' + id + ix + ']').css('background-color', val);
};

MLB.ronchi.setIdLabelBackground = (id, val) => {
	id.css('background-color', val);
};

MLB.ronchi.putData = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		getLocalStorageName = MLB.ronchi.getLocalStorageName,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		dataToSave,
		ix,
		zone,
		correction,
		zonalCorrectionTable = [];

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		zone = parseFloat(getNameIndexedElementValue(common.zoneIdLit, ix));
		correction = parseFloat(getNameIndexedElementValue(common.zoneCorrectionIdLit, ix));
		zonalCorrectionTable.push({zone: zone, correctionFactor: correction});
	}

	dataToSave = {
		mirrorDia: common.UIMirrorDia,
		radiusOfCurvature: common.UIRadiusOfCurvature,
		focalLength: common.focalLength().val(),
		focalRatio: common.focalRatio().val(),
		centralObstruction: common.centralObstruction().val(),
		gratingFreq: common.gratingFreq().val(),
		gratingOffset: common.gratingOffset().val(),
		userParabolicCorrection: common.userParabolicCorrection().val(),
		RonchigramSize: common.UIRonchigramSize,
		bandColorRGB: common.bandColorRGB().val(),
		backgroundBandColorRGB: common.backgroundBandColorRGB().val(),
		backgroundColor: common.backgroundColor().val(),
		invertBands: common.invertBands()[common.yes].checked,
		RonchiGrid: common.RonchiGrid()[common.yes].checked,
		circularZonalRulerCount: common.circularZonalRulerCount().val(),
		rulerTextRGB: common.rulerTextRGB().val(),
		pastedImageTransparency: common.pastedImageTransparency().val(),
		pastedImageWidth: common.pastedImageWidth().val(),
		pastedImageHeight: common.pastedImageHeight().val(),
		pastedImageOffsetX: common.pastedImageOffsetX().val(),
		pastedImageOffsetY: common.pastedImageOffsetY().val(),
		pastedImageName: common.pastedImageName().val(),
		distortionResolutionFactor: common.distortionResolutionFactor().val(),
		showBullseyeZones: common.showBullseyeZones()[common.yes].checked,
		thinBands: common.thinBands()[common.yes].checked,
		showGradients: common.showGradients()[common.yes].checked,
		calcZonalCorrectionsFromThinning: common.calcZonalCorrectionsFromThinning()[common.yes].checked,
		zonalCorrectionTable: zonalCorrectionTable,
		UOM: common.UOMVal(),
		includeParabCorr: common.includeParabCorr()
	};

	localStorage.setItem(getLocalStorageName(), JSON.stringify(dataToSave));
};

MLB.ronchi.noDataFound = (localStorageName) => alert('no data under ' + localStorageName);

MLB.ronchi.getData = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		getLocalStorageName = MLB.ronchi.getLocalStorageName,
		localStorageName = getLocalStorageName(),
		data = localStorage.getItem(localStorageName),
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		parsedData,
		ix,
		row,
		setPastedImageInactive = MLB.ronchi.setPastedImageInactive;

	if (data === null) {
		return false;
	}

	parsedData = JSON.parse(data);

	common.mirrorDia().val(parsedData.mirrorDia);
	common.UIMirrorDia = +parsedData.mirrorDia;

	common.radiusOfCurvature().val(parsedData.radiusOfCurvature);
	common.UIRadiusOfCurvature = +parsedData.radiusOfCurvature;

	common.focalLength().val(parsedData.focalLength);
	common.focalRatio().val(parsedData.focalRatio);
	common.centralObstruction().val(parsedData.centralObstruction);
	common.gratingFreq().val(parsedData.gratingFreq);
	common.gratingOffset().val(parsedData.gratingOffset);
	common.userParabolicCorrection().val(parsedData.userParabolicCorrection);

	common.RonchigramSize().val(parsedData.RonchigramSize);
	common.UIRonchigramSize = +parsedData.RonchigramSize;

	common.bandColorRGB().val(parsedData.bandColorRGB);
	if (parsedData.backgroundBandColorRGB) {
		common.backgroundBandColorRGB().val(parsedData.backgroundBandColorRGB);
	}
	if (parsedData.backgroundColor) {
		common.backgroundColor().val(parsedData.backgroundColor);
	}
	common.invertBands()[common.yes].checked = parsedData.invertBands;
	common.invertBands()[common.no].checked = !parsedData.invertBands;

	common.RonchiGrid()[common.yes].checked = parsedData.RonchiGrid;
	common.RonchiGrid()[common.no].checked = !parsedData.RonchiGrid;

	common.circularZonalRulerCount().val(parsedData.circularZonalRulerCount);

	common.rulerTextRGB().val(parsedData.rulerTextRGB);

	common.pastedImageTransparency().val(parsedData.pastedImageTransparency);
	common.pastedImageWidth().val(parsedData.pastedImageWidth);
	common.pastedImageHeight().val(parsedData.pastedImageHeight);
	common.pastedImageOffsetX().val(parsedData.pastedImageOffsetX);
	common.pastedImageOffsetY().val(parsedData.pastedImageOffsetY);
	common.pastedImageName().val(parsedData.pastedImageName);

	common.distortionResolutionFactor().val(parsedData.distortionResolutionFactor);

	common.showBullseyeZones()[common.yes].checked = parsedData.showBullseyeZones;
	common.showBullseyeZones()[common.no].checked = !parsedData.showBullseyeZones;

	common.thinBands()[common.yes].checked = parsedData.thinBands;
	common.thinBands()[common.no].checked = !parsedData.thinBands;

	common.showGradients()[common.yes].checked = parsedData.showGradients;
	common.showGradients()[common.no].checked = !parsedData.showGradients;

	common.calcZonalCorrectionsFromThinning()[common.yes].checked = parsedData.calcZonalCorrectionsFromThinning;
	common.calcZonalCorrectionsFromThinning()[common.no].checked = !parsedData.calcZonalCorrectionsFromThinning;

	// imperial for backwards compatibility
	if (parsedData.UOM === common.inchesLit || parsedData.UOM === 'imperial') {
		common.UOM()[common.inches].checked = true;
	} else if (parsedData.UOM === common.mmLit) {
		common.UOM()[common.mm].checked = true;
	} else {
		alert('bad uom value of ' + parsedData.UOM + ' in getData()');
	}

	common.btnIncludeParabCorr()[common.yes].checked = parsedData.includeParabCorr;
	common.btnIncludeParabCorr()[common.no].checked = !parsedData.includeParabCorr;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		row = parsedData.zonalCorrectionTable[ix];
		setNameIndexedElementValue(common.zoneIdLit, ix, row.zone);
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, row.correctionFactor);
	}

	// remove any active image as the old active image will show up in the software nulled Ronchigram
	setPastedImageInactive();

	return true;
};

MLB.ronchi.saveCorrections = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		ix,
		zone,
		correction,
		savedCorrections = [];

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		zone = parseFloat(getNameIndexedElementValue(common.zoneIdLit, ix));
		correction = parseFloat(getNameIndexedElementValue(common.zoneCorrectionIdLit, ix));
		savedCorrections.push({zone: zone, correctionFactor: correction});
	}
	common.savedCorrections = savedCorrections;
};

MLB.ronchi.restoreCorrections = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		savedCorrections = common.savedCorrections,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		ix;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		setNameIndexedElementValue(common.zoneIdLit, ix, savedCorrections[ix].zone);
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, savedCorrections[ix].correctionFactor);
	}
};

// zone can range from 0 to 1: comes from user defined userZonalCorrections per zones
MLB.ronchi.getInterpolatedCorrection = zone => {
	var common = MLB.ronchi.common,
		zoneIx = common.zoneIx,
		correctionIx = common.correctionIx,
		userZonalCorrections = common.userZonalCorrections,
		userZonalCorrectionsLength = userZonalCorrections.length,
		px,
		correction,
		zoneA,
		zoneB,
		contactA,
		contactB;

	if (userZonalCorrectionsLength === 0) {
		return 1;
	}

	// find userZonalCorrections[] element that fits zone
	for (px = 0; px < userZonalCorrectionsLength; px++) {
		if (userZonalCorrections[px][zoneIx] >= zone) {
			break;
		}
	}
	// interpolate for correction
	if (px === 0) { // initial value in table
		correction = userZonalCorrections[px][correctionIx];
	} else if (px === userZonalCorrectionsLength) { // beyond table so use last correction
		correction = userZonalCorrections[userZonalCorrectionsLength - 1][correctionIx];
	} else { // interpolate between 2 values
		zoneA = userZonalCorrections[px - 1][zoneIx];
		zoneB = userZonalCorrections[px][zoneIx];
		contactA = userZonalCorrections[px - 1][correctionIx];
		contactB = userZonalCorrections[px][correctionIx];
		correction = contactA + (contactB - contactA) * (zone - zoneA) / (zoneB - zoneA);
	}
	return correction;
};

MLB.ronchi.buildZoneAndCorrectionTable = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		ix,
		htmlStr;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		htmlStr = '<tr>\r\n'
				+ '<td class="label">' + 'Zone \r\n'
				+ '<td> <input class="inputTextShort" ' + common.zoneId2Lit + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> \r\n'
				+ '<td class="label"> correction \r\n'
				+ '<td> <input class="inputTextShort" ' + common.zoneCorrectionId2Lit + ix + '" onfocus="select();" type="number" step="0.05"> \r\n'
				+ '<td class="label">M-L: \r\n'
				+ '<td> <label ' + common.MLToleranceId2Lit + ix + '"></label> \r\n'
		;

		common.zonalCorrectionTableBody().append(htmlStr);
	}
};

MLB.ronchi.sortZonalCorrectionTableByZone = () => {
	var common = MLB.ronchi.common,
		zoneIx = common.zoneIx,
		correctionIx = common.correctionIx,
		zonalErrorCount = common.zonalErrorCount,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		userZonalCorrections = [],
		sortedUserZonalCorrections,
		ix,
		zone,
		correction,
		val;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		zone = parseFloat(getNameIndexedElementValue(common.zoneIdLit, ix));
		correction = parseFloat(getNameIndexedElementValue(common.zoneCorrectionIdLit, ix));
		userZonalCorrections.push([zone, correction]);
	}
	sortedUserZonalCorrections = userZonalCorrections.sort((a, b) => {
		if (isNaN(a[0])) {
			return 1;
		}
		if (isNaN(b[0])) {
			return -1;
		}
		return a[0] - b[0];
	});

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		val = sortedUserZonalCorrections[ix][zoneIx];
		if (isNaN(val)) {
			val = '';
		}
		setNameIndexedElementValue(common.zoneIdLit, ix, val);

		val = sortedUserZonalCorrections[ix][correctionIx];
		if (isNaN(val)) {
			val = '';
		}
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, val);
	}
};

// remove correction and check if zone is not a number
MLB.ronchi.cleanupZonalCorrectionTable = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		ix,
		zone;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		zone = parseFloat(getNameIndexedElementValue(common.zoneIdLit, ix));
		if (isNaN(zone)) {
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, '');
		}
	}
};

MLB.ronchi.copyBandPositionsToErrorTableSetCorrectionsToOne = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		zonalErrorCount = common.zonalErrorCount,
		mirrorDia = common.UIMirrorDia,
		mirrorRadius = mirrorDia / 2,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		invertBands = common.invertBands()[common.yes].checked,
		ix,
		RonchiBandsLength = common.RonchiBands[0].length,
		tapeIx,
		bandVal,
		lastEntryDone = false;

	ix = 0;
	tapeIx = 0;
	if (invertBands) {
		// include 0, which is missing when invertBands
		setNameIndexedElementValue(common.zoneIdLit, ix, 0);
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, 1);
		ix++;
	}
	for ( ; ix <= zonalErrorCount; ix++, tapeIx++) {
		if (tapeIx < RonchiBandsLength) {
			// use first image Ronchi image values, RonchiBands[0]
			bandVal = roundToDecimal(common.RonchiBands[0][tapeIx] / mirrorRadius, common.tapeBandDecimalPrecision);

			setNameIndexedElementValue(common.zoneIdLit, ix, bandVal);
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, 1);
		} else {
			if (lastEntryDone) {
				setNameIndexedElementValue(common.zoneIdLit, ix, '');
				setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, '');
			} else {
				// set mirror's edge as final entry in table
				setNameIndexedElementValue(common.zoneIdLit, ix, 1);
				setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, 1);
				lastEntryDone = true;
			}
		}
	}
};

MLB.ronchi.copyZonalRulerToErrorTable = () => {
	var common = MLB.ronchi.common,
		circularZonalRulerCount = common.circularZonalRulerCount().val(),
		zonalErrorCount = common.zonalErrorCount,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		ix;

	for (ix = 0; ix <= circularZonalRulerCount; ix++) {
		setNameIndexedElementValue(common.zoneIdLit, ix, ix / circularZonalRulerCount);
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, 1);
	}
	for ( ; ix <= zonalErrorCount; ix++) {
		setNameIndexedElementValue(common.zoneIdLit, ix, '');
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, '');
	}
};

MLB.ronchi.copyTenZonesToErrorTable = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		ix;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		setNameIndexedElementValue(common.zoneIdLit, ix, ix / 10);
		setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, 1);
	}
};

MLB.ronchi.resetCorrectionFactors = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		userEnteredZone,
		ix,
		setMLOffsetToZero = MLB.ronchi.setMLOffsetToZero;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		userEnteredZone = getNameIndexedElementValue(common.zoneIdLit, ix);
		if (userEnteredZone !== '' && !isNaN(Number(userEnteredZone))) {
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, 1);
		} else {
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, '');
		}
	}
	setMLOffsetToZero();
};

MLB.ronchi.resetCorrectionFactorsToParabCorrection = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		zonalErrorCount = common.zonalErrorCount,
		userParabolicCorrection = +common.userParabolicCorrection().val(),
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		userEnteredZone,
		ix,
		setMLOffsetToZero = MLB.ronchi.setMLOffsetToZero;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		userEnteredZone = getNameIndexedElementValue(common.zoneIdLit, ix);
		if (userEnteredZone !== '' && !isNaN(Number(userEnteredZone))) {
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, roundToDecimal(userParabolicCorrection, common.parabolicCorrectionDisplayPrecision));
		} else {
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, '');
		}
	}
	setMLOffsetToZero();
};

MLB.ronchi.updateZonalSlopeErrorsFromNulledRG = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		zonalErrorCount = common.zonalErrorCount,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
		ix,
		userEnteredZone,
		zonalCorrectionsFromNulledRG = common.zonalCorrectionsFromNulledRG,
		zonalCorrection;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		userEnteredZone = getNameIndexedElementValue(common.zoneIdLit, ix);
		if (userEnteredZone !== '' && !isNaN(Number(userEnteredZone))) {
			if (ix >= zonalCorrectionsFromNulledRG.length) {
				zonalCorrection = 1;
			} else {
				// zonal corrections show what needs to be done to bring the Ronchi band to full correction, eg, an overcorrected situation calls for less zonal correction
				zonalCorrection = 1 - zonalCorrectionsFromNulledRG[ix];
			}
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, roundToDecimal(zonalCorrection, common.zonalCorrectionDisplayPrecision));
		} else {
			setNameIndexedElementValue(common.zoneCorrectionIdLit, ix, '');
		}
	}
};

MLB.ronchi.processZonalErrors = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		calcMilliesLacroixTolerance = MLB.calcLib.calcMilliesLacroixTolerance,
		calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
		calcStrehlFromRMS = MLB.calcLib.calcStrehlFromRMS,
		getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
		setIdIndexedLabelValue = MLB.ronchi.setIdIndexedLabelValue,
		setIdIndexedLabelBackground = MLB.ronchi.setIdIndexedLabelBackground,
		mirrorDia = common.UIMirrorDia,
		radiusOfCurvature = +common.radiusOfCurvature().val(),
		userParabolicCorrection = +common.userParabolicCorrection().val(),
		includeParabCorr = common.includeParabCorr(),
		calcWaveErrorForZone = MLB.ronchi.calcWaveErrorForZone,
		calcSaveWaveErrorResults = MLB.ronchi.calcSaveWaveErrorResults,
		getWavelengthLight = MLB.ronchi.getWavelengthLight,
		wavelengthLight = getWavelengthLight(),
		zonalErrorCount = common.zonalErrorCount,
		ix,
		zone,
		userEnteredZonalCorrection,
		zoneIsANumber,
		userEnteredZonalCorrectionIsANumber,
		MLTolerance,
		MLToleranceDecimalPrecision,
		MLTolerancePeakValley,
		MLToleranceHighestPeakValley = 0,
		MLToleranceLowestPeakValley = 0,
		zoneResultBackgroundColor,
		parabolicCorrectionForZone,
		correctionTolerance,
		displayToleranceStr,
		netCorrection,
		userZonalCorrections = [],
		MLTolerances = [],
		zoneZeroFound,
		zoneOneFound,
		waveErrors = [],
		waveErrorResults,
		Strehl;

	for (ix = 0; ix <= zonalErrorCount; ix++) {
		// get the zone and user entered zonal correction
		zone = (getNameIndexedElementValue(common.zoneIdLit, ix));
		zoneIsANumber = zone.trim() != '' && !isNaN(Number(zone));

		userEnteredZonalCorrection = getNameIndexedElementValue(common.zoneCorrectionIdLit, ix);
		userEnteredZonalCorrectionIsANumber = userEnteredZonalCorrection.trim() != '' && !isNaN(Number(userEnteredZonalCorrection));

		// if either number is invalid, then clear out the ML results, bail and continue on to the next zone
		if (!zoneIsANumber || !userEnteredZonalCorrectionIsANumber) {
			setIdIndexedLabelValue(common.MLToleranceIdLit, ix, '');
			continue;
		}

		// get the MLTolerance and process it, bailing and continuing on to the next zone if the tolerance is not computable
		MLTolerance = calcMilliesLacroixTolerance(wavelengthLight, mirrorDia, radiusOfCurvature, zone);

		// correction tolerance
		parabolicCorrectionForZone = calcParabolicCorrectionForZone(mirrorDia, radiusOfCurvature, zone);

		/* zonal correctionTolerance for the opening scenario:
			35.78666666666665
			4.473333333333331
			1.3254320987654322
			0.5591666666666664
			0.2862933333333333
			0.16567901234567903
			0.10433430515063172 <= 0.7 zone: eg, a user set correction of 1.15 is at 144% of tolerance
			0.0698958333333333
			0.049090077732053025
			0.03578666666666666
		*/
		correctionTolerance = MLTolerance / parabolicCorrectionForZone;

		if (Math.abs(correctionTolerance) < 10) {
			MLToleranceDecimalPrecision = common.MLToleranceDecimalPrecision;
		} else {
			MLToleranceDecimalPrecision = common.MLToleranceDecimalPrecision - 1;
		}
		if (MLTolerance === Infinity) {
			displayToleranceStr = Infinity;
		} else {
		displayToleranceStr = roundToDecimal(1 - correctionTolerance, MLToleranceDecimalPrecision)
				+ ' to '
				+ roundToDecimal(1 + correctionTolerance, MLToleranceDecimalPrecision);
		}

		// peak to valley ML tolerance (for each zone)
		netCorrection = userEnteredZonalCorrection - 1;
		MLTolerancePeakValley = netCorrection / correctionTolerance;
		// display the calculated tolerance
		setIdIndexedLabelValue(common.MLToleranceIdLit, ix, displayToleranceStr);
		// calc for total ML PV
		if (MLTolerancePeakValley > MLToleranceHighestPeakValley) {
			MLToleranceHighestPeakValley = MLTolerancePeakValley;
		}
		if (MLTolerancePeakValley < MLToleranceLowestPeakValley) {
			MLToleranceLowestPeakValley = MLTolerancePeakValley;
		}

		// display the result
		if (MLTolerancePeakValley > 1 || MLTolerancePeakValley < -1) {
			zoneResultBackgroundColor = common.badColor;
		} else if (MLTolerancePeakValley > 0.5 || MLTolerancePeakValley < -0.5) {
			zoneResultBackgroundColor = common.fairColor;
		} else {
			zoneResultBackgroundColor = common.goodColor;
		}
		setIdIndexedLabelBackground(common.MLToleranceIdLit, ix, zoneResultBackgroundColor);

		// userZonalCorrections array for the Ronchigram display: build here for speed since we already have the values
		if (+zone === 0) {
			zoneZeroFound = true;
		}
		if (+zone === 1) {
			zoneOneFound = true;
		}
		userZonalCorrections.push([+zone, +userEnteredZonalCorrection]);

		// save for ML tolerances graphiing and analysis later with possible adjustments so don't use userZonalCorrections[]
		MLTolerances.push({netCorrection: netCorrection,
				correctionTolerance: correctionTolerance,
				correctionToToleranceRatio: netCorrection / correctionTolerance});

		// wave error: waveErrors array added to by this function
		// note that zone needs to be turned into a number
		calcWaveErrorForZone(+zone, includeParabCorr, userParabolicCorrection, userEnteredZonalCorrection, waveErrors);
	}

	// supply default values for userZonalCorrections if necessary
	if (!zoneZeroFound) {
		userZonalCorrections.push([0, 1]);
	}
	if (!zoneOneFound) {
		userZonalCorrections.push([1, 1]);
	}

	// adjust center wave error to that of the first zone, otherwise the center zone's error will always be zero (correctionTolerance is infinite)
	// waveErrors array is: zone, error
	if (waveErrors.length) {
		waveErrors[0].error = waveErrors[1].error;
	}

	// wave errors: PV and RMS
	waveErrorResults = calcSaveWaveErrorResults(waveErrors);
	Strehl = calcStrehlFromRMS(waveErrorResults.rms);
	common.waveErrorsLabel().html('Peak-valley wavefront = '
			+ roundToDecimal(waveErrorResults.PV, common.wavesDecimalPrecision)
			+ ', RMS = '
			+ roundToDecimal(waveErrorResults.rms, common.wavesDecimalPrecision)
			+ ', Strehl = '
			+ roundToDecimal(Strehl, common.wavesDecimalPrecision)
			// no ending period as it creates confusion with the decimal point
	);

	// save values for use elsewhere
	common.userZonalCorrections = userZonalCorrections.sort();
	common.MLTolerances = MLTolerances;
};

MLB.ronchi.calcSaveWaveErrorResults = waveErrors => {
	var common = MLB.ronchi.common,
		waveErrorsWhereLowestIsZero = [],
		lowestWaveError = 0,
		highestWaveError = 0,
		rangeWaveError,
		rmsCount = 0,
		rms = 0;

	waveErrors.forEach(we => {
		if (we.error > highestWaveError) {
			highestWaveError = we.error;
		}
		if (we.error < lowestWaveError) {
			lowestWaveError = we.error;
		}
		rmsCount += we.zone * we.zone;
		rms += we.error * we.error * we.zone * we.zone;
	});

	rangeWaveError = highestWaveError - lowestWaveError;
	waveErrors.forEach(we => {
		// this way for drawing the polygon in the zonal errors side view
		waveErrorsWhereLowestIsZero.push({zone: we.zone, error: we.error - lowestWaveError});
	});

	common.waveErrors = waveErrors;
	common.waveErrorsWhereLowestIsZero = waveErrorsWhereLowestIsZero;
	common.rangeWaveError = rangeWaveError;

	return {
		PV: highestWaveError - lowestWaveError,
		rms: Math.sqrt(rms / rmsCount)
	};
};

// idea here is that if the difference between spherical and parabolic is 'x' waves, and the user sets the zonal error to half that, then the wavefront error for the zone is x/2
// eg, if parabolic correction is 2 waves and the mirror looks to be half parabolized, then the wave error for the zone is 1 wave
MLB.ronchi.calcWaveErrorForZone = (zone, includeParabCorr, userParabolicCorrection, userEnteredZonalCorrection, waveErrors) => {
	var common = MLB.ronchi.common,
		mirrorDia = common.UIMirrorDia,
		mirrorDiaInches,
		zonalDia,
		radiusOfCurvature = common.UIRadiusOfCurvature,
		zonalFocalRatio,
		calcWavefrontErrorForSphericalMirror = MLB.calcLib.calcWavefrontErrorForSphericalMirror,
		calcError,
		adjustedError;

	// zone 0, the mirror's center, has no parabolic correction, ie, the mirror's center defines the RoC
	if (zone === 0) {
		waveErrors.push({
			zone: 0,
			error: 0
		});
		return;
	}

 	if (common.mmSelected()) {
		mirrorDiaInches = mirrorDia / 25.4;
	} else {
		mirrorDiaInches = mirrorDia;
	}
	zonalDia = zone * mirrorDiaInches;
	zonalFocalRatio = radiusOfCurvature / mirrorDia / 2 / zone;

	calcError = calcWavefrontErrorForSphericalMirror(zonalDia, zonalFocalRatio);
	adjustedError = calcError * (1 - userEnteredZonalCorrection);
	if (includeParabCorr) {
		adjustedError -= calcError * (1 - userParabolicCorrection);
	}

	waveErrors.push({
		zone: zone,
		error: Math.abs(adjustedError)
	});
};

MLB.ronchi.drawZonalErrorsSideView = () => {
	var common = MLB.ronchi.common,
		waveErrorsWhereLowestIsZero = common.waveErrorsWhereLowestIsZero,
		rangeWaveError = common.rangeWaveError,
		mirrorDia = common.UIMirrorDia,
		RonchigramSize = common.UIRonchigramSize,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		int = MLB.sharedLib.int,
		fillRect = MLB.sharedLib.fillRect,
		rect = MLB.sharedLib.rect,
		drawLine = MLB.sharedLib.drawLine,
		point = MLB.sharedLib.point,
		fillPolygon = MLB.sharedLib.fillPolygon,
		canvasWidth = common.UIRonchigramSize,
		halfCanvasWidth = canvasWidth / 2,
		canvasHeight = canvasWidth / 3,
		floor = canvasHeight * 3 / 4,
		ceiling = canvasHeight * 1 / 4,
		floorToCeilingHeight = floor - ceiling,
		basement = canvasHeight - common.rulerThickness,
		canvas,
		context,
		ceilingWaveError,
		verticalScalingFactor,
		scalingFactor,
		mirrorRadius,
		scaledMirrorRadius,
		startX,
		endX,
		points = [],
		txt;

	common.zonesSideViewDiv().append(buildCanvasElement(common.zonesSideViewLit, canvasWidth, canvasHeight));
	canvas = common.zonesSideViewID();
	context = canvas.getContext('2d', {willReadFrequently: true});
	context.fillStyle = common.rulerColor;
	context.font = common.fontSize + common.fontLit;
	fillRect(context, "white", rect(0, 0, canvasWidth, canvasHeight));

	if (rangeWaveError <= 0.25) {
		ceilingWaveError = 0.25;
	} else {
		ceilingWaveError = int(rangeWaveError + 1);
	}
	verticalScalingFactor = floorToCeilingHeight / ceilingWaveError;

	scalingFactor = RonchigramSize / mirrorDia;
	mirrorRadius = mirrorDia / 2;
	scaledMirrorRadius = mirrorRadius * scalingFactor;
	startX = halfCanvasWidth - scaledMirrorRadius;
	endX = canvasWidth - startX;

	// right hand side of the polygon
	waveErrorsWhereLowestIsZero.forEach(we => {
		// error is height (y), zone is width (x)
		points.push(point(we.zone * scaledMirrorRadius + halfCanvasWidth, floor - we.error * verticalScalingFactor));
	});
	// add points across the bottom of the graph so that the polygon can be filled in
	points.push(point(endX, basement));
	points.push(point(startX, basement));
	// left hand side of the polygon
	waveErrorsWhereLowestIsZero.reverse().forEach(we => {
		// error is height (y), zone is width (x)
		points.push(point(halfCanvasWidth - we.zone * scaledMirrorRadius, floor - we.error * verticalScalingFactor));
	});
	fillPolygon(context, points, common.sideViewFillColor);

	// draw the vertical zonal lines
	waveErrorsWhereLowestIsZero.forEach(we => {
		var rightX = we.zone * scaledMirrorRadius + halfCanvasWidth,
			leftX = canvasWidth - rightX,
			height = floor - we.error * verticalScalingFactor;

		drawLine(context, common.rulerColor, common.rulerThickness, point(rightX, basement), point(rightX, height));
		drawLine(context, common.rulerColor, common.rulerThickness, point(leftX, basement), point(leftX, height));
	});

	// draw horizontal lines
	drawLine(context, common.blackColor, common.rulerThickness, point(startX, basement), point(endX, basement));
	drawLine(context, common.blackColor, common.rulerThickness, point(startX, floor), point(endX, floor));
	drawLine(context, common.blackColor, common.rulerThickness, point(startX, ceiling), point(endX, ceiling));

	// write upper line's wave error
	context.fillStyle = common.blackColor;
	txt = 'This line is wavefront error '
			+ ceilingWaveError
			+ ' (surface '
			+ ceilingWaveError / 2
			+ ')';
	context.fillText(txt, startX, ceiling - 4);
};

MLB.ronchi.drawMLErrorsGraph = () => {
	var common = MLB.ronchi.common,
		zoneIx = common.zoneIx,
		userZonalCorrections = common.userZonalCorrections,
		MLTolerances = common.MLTolerances,
		MLTolerancesLength = MLTolerances.length,
		buildCanvasElement = MLB.sharedLib.buildCanvasElement,
		fillRect = MLB.sharedLib.fillRect,
		rect = MLB.sharedLib.rect,
		drawLine = MLB.sharedLib.drawLine,
		point = MLB.sharedLib.point,
		canvasWidth = common.UIRonchigramSize,
		canvasHeight = canvasWidth / 4,
		canvas,
		context,
		verticalScalingFactor,
		highPoint,
		correctionToToleranceRatio,
		correctionToToleranceRatioAbs,
		toleranceTopY,
		toleranceBottomY,
		topY,
		bottomY,
		y,
		lastY,
		rightX,
		leftX,
		lastRightX,
		lastLeftX,
		ix,
		calcAndDisplayMLAnalysis = MLB.ronchi.calcAndDisplayMLAnalysis;

	common.MLErrorsViewDiv().append(buildCanvasElement(common.MLErrorsViewLit, canvasWidth, canvasHeight));
	canvas = common.MLErrorsViewID();
	context = canvas.getContext('2d', {willReadFrequently: true});
	context.fillStyle = common.rulerColor;
	context.font = common.fontSize + common.fontLit;
	fillRect(context, "white", rect(0, 0, canvasWidth, canvasHeight));

	// top/bottom ML tolerance rulers set to 1 or set to the worst ML zonal value if > 1
	highPoint = 1;
	MLTolerances.forEach(ML => {
		correctionToToleranceRatioAbs = Math.abs(ML.correctionToToleranceRatio);
		if (correctionToToleranceRatioAbs > highPoint) {
			highPoint = correctionToToleranceRatioAbs;
		}
	});
	// top/bottom rulers set to full scale of the vertical range
	verticalScalingFactor = canvasHeight / 2 / highPoint;

	// draw horizonal ML tolerance rulers
	toleranceBottomY = canvasHeight / 2 + verticalScalingFactor;
	toleranceTopY = canvasHeight / 2 - verticalScalingFactor;
	drawLine(context, common.blackColor, common.rulerThickness, point(0, toleranceBottomY), point(canvasWidth, toleranceBottomY));
	drawLine(context, common.blackColor, common.rulerThickness, point(0, toleranceTopY), point(canvasWidth, toleranceTopY));

	// draw ML zones
	for (ix = 1; ix < MLTolerancesLength; ix++) {

		// vertical markers should go between tolerance rulers unless the correctionToToleranceRatio exceeds the tolerance,
		// then the marker should reach past the tolerance ruler to the correctionToToleranceRatio
		correctionToToleranceRatio = MLTolerances[ix].correctionToToleranceRatio;
		y = canvasHeight / 2 - correctionToToleranceRatio * verticalScalingFactor;
		if (correctionToToleranceRatio > 1) {
			topY = y;
			bottomY = toleranceBottomY;
		} else if (correctionToToleranceRatio < -1) {
			bottomY = y;
			topY = toleranceTopY;
		} else {
			topY = toleranceTopY;
			bottomY = toleranceBottomY;
		}
		// userZonalCorrections[][zoneIx] is the zone's radius ranging from 0 to 1
		rightX = canvasWidth / 2 + canvasWidth / 2 * userZonalCorrections[ix][zoneIx];
		leftX = canvasWidth / 2 - canvasWidth / 2 * userZonalCorrections[ix][zoneIx];

		// draw center marker and zones across center
		if (ix === 1) {
			lastRightX = lastLeftX = canvasWidth / 2;
			// draw vertical central zone marker
			drawLine(context, common.rulerColor, common.rulerThickness, point(lastRightX, topY), point(lastRightX, bottomY));
		}

		// draw vertical zone markers
		drawLine(context, common.rulerColor, common.rulerThickness, point(rightX, topY), point(rightX, bottomY));
		drawLine(context, common.rulerColor, common.rulerThickness, point(leftX, topY), point(leftX, bottomY));

		// draw zones
		// center zone has no meaning in M-L criteria since the mirror center's tolerance envelope is infinitely sized, so connect the inner most zone across the center
		if (ix === 2) {
			drawLine(context, common.blackColor, common.rulerThickness, point(lastLeftX, lastY), point(lastRightX, lastY));
		}
		drawLine(context, common.blackColor, common.rulerThickness, point(lastRightX, lastY), point(rightX, y));
		drawLine(context, common.blackColor, common.rulerThickness, point(lastLeftX, lastY), point(leftX, y));

		// save for next iteration
		lastY = y;
		lastRightX = rightX;
		lastLeftX = leftX;
	}

	calcAndDisplayMLAnalysis();
};

MLB.ronchi.calcAndDisplayMLAnalysis = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		MLTolerances = common.MLTolerances,
		setIdLabelBackground = MLB.ronchi.setIdLabelBackground,
		MLWarning = '',
		MLBackgroundColor,
		MLToleranceHighestPeakValley = 0,
		MLToleranceLowestPeakValley = 0,
		MLToleranceAbsPeakValley,
		MLPeakToValley;

	// calculate and display M-L values
	MLTolerances.forEach(ML => {
		if (ML.correctionToToleranceRatio > MLToleranceHighestPeakValley) {
			MLToleranceHighestPeakValley = ML.correctionToToleranceRatio;
		} else if (ML.correctionToToleranceRatio < MLToleranceLowestPeakValley) {
			MLToleranceLowestPeakValley = ML.correctionToToleranceRatio;
		}
	});
	MLToleranceAbsPeakValley = (MLToleranceHighestPeakValley - MLToleranceLowestPeakValley);
	// eg, if zones vary from -1 to 1, then that's ML PV of 1, if zones vary from 0 to 1 then that's ML PV of 0.5
	MLPeakToValley = MLToleranceAbsPeakValley / 2;

	if (MLPeakToValley > 1) {
		MLBackgroundColor = common.badColor;
		MLWarning = ' (exceeds tolerance)';
	} else if (MLPeakToValley > 0.5) {
		MLBackgroundColor = common.fairColor;
	} else {
		MLBackgroundColor = common.goodColor;
	}
	setIdLabelBackground(common.MLErrorsLabel(), MLBackgroundColor);
	common.MLErrorsLabel().html(roundToDecimal(MLPeakToValley, common.MLToleranceAbsDecimalPrecision) + MLWarning);
	common.MLPeakToValley = MLPeakToValley;
};

MLB.ronchi.changeMLOffset = (offset) => {
	var common = MLB.ronchi.common,
		MLTolerances = common.MLTolerances,
		drawMLErrorsGraph = MLB.ronchi.drawMLErrorsGraph,
		MLOffsetChange;

	MLOffsetChange = offset - common.lastMLOffset;
	MLTolerances.forEach(ML => {
		ML.netCorrection += MLOffsetChange;
		ML.correctionToToleranceRatio = ML.netCorrection / ML.correctionTolerance;
	});
	common.lastMLOffset = offset;

	drawMLErrorsGraph();
};

MLB.ronchi.setMLOffsetToZero = () => {
	var common = MLB.ronchi.common;

	common.MLOffset().val(0);
};

MLB.ronchi.godProcess = () => {
	var common = MLB.ronchi.common,
		pastedImageActive = common.pastedImageActiveIsChecked(),
		thinBands = common.thinBands()[common.yes].checked,
		calcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked,
		processZonalErrors = MLB.ronchi.processZonalErrors,
		drawZonalErrorsSideView = MLB.ronchi.drawZonalErrorsSideView,
		drawMLErrorsGraph = MLB.ronchi.drawMLErrorsGraph,
		plotRonchigramsCalcRonchiTape = MLB.ronchi.plotRonchigramsCalcRonchiTape,
		computeNullRonchigram = MLB.ronchi.computeNullRonchigram,
		thinNullImageAndPutToCanvas = MLB.ronchi.thinNullImageAndPutToCanvas,
		drawPostNullRonchigramInformation = MLB.ronchi.drawPostNullRonchigramInformation,
		drawPostRonchigramInformation = MLB.ronchi.drawPostRonchigramInformation,
		copyBandPositionsToErrorTableSetCorrectionsToOne = MLB.ronchi.copyBandPositionsToErrorTableSetCorrectionsToOne,
		updateZonalSlopeErrorsFromNulledRG = MLB.ronchi.updateZonalSlopeErrorsFromNulledRG;

	if (pastedImageActive && thinBands && calcZonalCorrectionsFromThinning) {
		copyBandPositionsToErrorTableSetCorrectionsToOne();
	}
	processZonalErrors();
	drawZonalErrorsSideView();
	drawMLErrorsGraph();
	plotRonchigramsCalcRonchiTape();
	computeNullRonchigram();

	if (thinBands) {
		if (+common.pastedImageTransparency().val() < 1) {
			common.pastedImageTransparency().val(1);
			common.storedTransparency = 1;

			plotRonchigramsCalcRonchiTape();
			computeNullRonchigram();
		}
		thinNullImageAndPutToCanvas();

		if (pastedImageActive && calcZonalCorrectionsFromThinning) {
			updateZonalSlopeErrorsFromNulledRG();
			processZonalErrors();
			drawZonalErrorsSideView();
			drawMLErrorsGraph();
			plotRonchigramsCalcRonchiTape();
			// recompute the null after updating the zonal errors from common.zonalCorrectionsFromNulledRG[] (set by thinNulledImageData() which is called from thinNullImageAndPutToCanvas())
			computeNullRonchigram();
			thinNullImageAndPutToCanvas();
		}
	}

	// only after processing the nulled image, add information
	drawPostNullRonchigramInformation();
	drawPostRonchigramInformation();
};

// scan a range of xoffsets for best xOffset based on common.absAvgRonchiBandDeviationFromNearestRuler
// takes longer than directional searching but will find the lowest common.absAvgRonchiBandDeviationFromNearestRuler (ie, 1, .9, 1, .7, 1 where after the .9, 1 sequence direction would reverse and miss the .7 later on)

MLB.ronchi.bestXoffsetFromBandErrorsController = () => {
	var common = MLB.ronchi.common,
		pastedImageActive = common.pastedImageActiveIsChecked(),
		thinBands = common.thinBands()[common.yes].checked,
		calcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked,
		bestXoffsetFromBandErrors = MLB.ronchi.bestXoffsetFromBandErrors,
		calcZonalCorrectionsFromThinningIsOn,
		xOffset,
		xOffsetRange,
		bestXoffset,
		incrXoffset;

	if (!pastedImageActive){
		alert('paste an image first');
		return;
	}
	if (!thinBands) {
		alert('turn on thinning first');
		return;
	}
	if (calcZonalCorrectionsFromThinning) {
		calcZonalCorrectionsFromThinningIsOn = true;
		common.calcZonalCorrectionsFromThinning()[common.yes].checked = false;
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
	} else {
		calcZonalCorrectionsFromThinningIsOn = false;
	}
	
	alert('This is a long running process. An alert will appear when finished.');

	// coarse finding...
	// eg, RG size of 400 means scan -4 to 4
	xOffsetRange = common.UIRonchigramSize / 100;
	// eg, RG size of 400 means step size of 1
	incrXoffset = common.UIRonchigramSize / 400;
	xOffset = -xOffsetRange / 2;
	bestXoffset = bestXoffsetFromBandErrors(xOffsetRange, incrXoffset, xOffset);

	// fine finding...
	xOffsetRange /= 4;
	incrXoffset /= 4;
	xOffset = bestXoffset;
	bestXoffsetFromBandErrors(xOffsetRange, incrXoffset, xOffset);

	if (calcZonalCorrectionsFromThinningIsOn) {
		common.calcZonalCorrectionsFromThinning()[common.yes].checked = true;
		common.calcZonalCorrectionsFromThinning()[common.no].checked = false;
	}

	alert('Long running process finished.');
};

// assumes pasted image, thinned bands, no calc zonal corrections
MLB.ronchi.bestXoffsetFromBandErrors = (xOffsetRange, incrXoffset, xOffset) => {
	var common = MLB.ronchi.common,
		godProcess = MLB.ronchi.godProcess,
		bestAbsAvgRonchiBandDeviationFromNearestRuler,
		bestXoffset,
		godProcessCount = 0,
		str = '\nbestXoffsetFromBandErrors()...';

	bestXoffset = Number.MAX_VALUE;
	bestAbsAvgRonchiBandDeviationFromNearestRuler = Number.MAX_VALUE;

	for (xOffset = -xOffsetRange; xOffset <= xOffsetRange; xOffset += incrXoffset) {

		common.pastedImageOffsetX().val(xOffset);
		godProcess();
		godProcessCount += 1;

		str += '\ncommon.absAvgRonchiBandDeviationFromNearestRuler=' + common.absAvgRonchiBandDeviationFromNearestRuler + ', xOffset=' + xOffset;

		// if same, take the one with the xoffset closest to 0
		if (Math.abs(common.absAvgRonchiBandDeviationFromNearestRuler) === Math.abs(bestAbsAvgRonchiBandDeviationFromNearestRuler)) {
			if (Math.abs(xOffset) < Math.abs(bestXoffset)) {

				str += '\nsame absAvgRonchiBandDeviationFromNearestRuler, choosing xOffset=' + xOffset + ' over previous bestXoffset=' + bestXoffset;

				bestAbsAvgRonchiBandDeviationFromNearestRuler = common.absAvgRonchiBandDeviationFromNearestRuler;
				bestXoffset = xOffset;

				str += '\nnew bestAbsAvgRonchiBandDeviationFromNearestRuler=' + bestAbsAvgRonchiBandDeviationFromNearestRuler + ', bestXoffset=' + bestXoffset;
			}
		} else if (Math.abs(common.absAvgRonchiBandDeviationFromNearestRuler) < Math.abs(bestAbsAvgRonchiBandDeviationFromNearestRuler)) {

			bestAbsAvgRonchiBandDeviationFromNearestRuler = common.absAvgRonchiBandDeviationFromNearestRuler;
			bestXoffset = xOffset;

			str += 'new bestAbsAvgRonchiBandDeviationFromNearestRuler=' + bestAbsAvgRonchiBandDeviationFromNearestRuler + ', bestXoffset=' + bestXoffset;
		}
	}

	common.pastedImageOffsetX().val(bestXoffset);
	godProcess();
	godProcessCount += 1;
	str += '\ngodProcessCount=' + godProcessCount;
	if (common.optimizeDiagnostics) {
		console.log(str);
	}

	return bestXoffset;
};

// scan a range of ROC offsets to minimize Ronchi Band errors based on common.common.absAvgRonchiBandDeviationFromNearestRuler
MLB.ronchi.bestROCoffsetFromBandErrorsController = () => {
	var common = MLB.ronchi.common,
		pastedImageActive = common.pastedImageActiveIsChecked(),
		thinBands = common.thinBands()[common.yes].checked,
		calcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked,
		bestROCoffsetFromBandErrors = MLB.ronchi.bestROCoffsetFromBandErrors,
		startingROCoffset,
		ROCincrement,
		ROCoffsetRange,
		bestROCoffset;

	if (!pastedImageActive){
		alert('paste an image first');
		return;
	}
	if (!thinBands) {
		alert('turn on thinning first');
		return;
	}
	// if calcZonalCorrectionsFromThinning is turned on, turn it off and leave it off
	if (!calcZonalCorrectionsFromThinning) {
		common.calcZonalCorrectionsFromThinning()[common.yes].checked = false;
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
	}

	alert('This is a long running process. An alert will appear when finished.');

	// coarse finding...
	startingROCoffset = +common.gratingOffset().val();
	ROCincrement = +common.sliderOffset().attr('step') * 2;
	ROCoffsetRange = ROCincrement * 8;
	bestROCoffset = bestROCoffsetFromBandErrors(startingROCoffset, ROCoffsetRange, ROCincrement);

	// fine finding...
	ROCincrement /= 4;
	ROCoffsetRange = ROCincrement * 8;
	bestROCoffsetFromBandErrors(bestROCoffset, ROCoffsetRange, ROCincrement);

	alert('Long running process finished.');
};

// assumes pasted image, thinned bands, calc zonal corrections all turned on
MLB.ronchi.bestROCoffsetFromBandErrors = (startingROCoffset, ROCoffsetRange, ROCincrement) => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		godProcess = MLB.ronchi.godProcess,
		bestAbsAvgRonchiBandDeviationFromNearestRuler,
		ROCoffset,
		bestROCoffset,
		godProcessCount = 0,
		str = '\nbestROCoffsetFromBandErrors()...';

	bestROCoffset = Number.MAX_VALUE;
	bestAbsAvgRonchiBandDeviationFromNearestRuler = Number.MAX_VALUE;

	for (ROCoffset = startingROCoffset - ROCoffsetRange / 2; ROCoffset <= startingROCoffset + ROCoffsetRange / 2; ROCoffset += ROCincrement) {
		str += '\ntrying ROCoffset=' + ROCoffset;

		common.gratingOffset().val(ROCoffset);
		godProcess();
		godProcessCount += 1;

		str += '\nresult is common.absAvgRonchiBandDeviationFromNearestRuler=' + common.absAvgRonchiBandDeviationFromNearestRuler + ', ROCoffset=' + ROCoffset;

		if (Math.abs(common.absAvgRonchiBandDeviationFromNearestRuler) < Math.abs(bestAbsAvgRonchiBandDeviationFromNearestRuler)) {
			bestAbsAvgRonchiBandDeviationFromNearestRuler = common.absAvgRonchiBandDeviationFromNearestRuler;
			bestROCoffset = ROCoffset;

			str += '\nnew bestAbsAvgRonchiBandDeviationFromNearestRuler=' + bestAbsAvgRonchiBandDeviationFromNearestRuler + ', bestROCoffset=' + bestROCoffset;
		}
	}

	common.gratingOffset().val(roundToDecimal(bestROCoffset, common.gratingOffsetDisplayPrecision));
	godProcess();
	godProcessCount += 1;
	str += '\ngodProcessCount=' + godProcessCount;
	if (common.optimizeDiagnostics) {
		console.log(str);
	}

	return bestROCoffset;
};

// scan a range of ROC offsets for best MLPeakToValley based on common.MLPeakToValley
MLB.ronchi.bestROCoffsetFromMLPeakToValleyController = () => {
	var common = MLB.ronchi.common,
		pastedImageActive = common.pastedImageActiveIsChecked(),
		thinBands = common.thinBands()[common.yes].checked,
		calcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked,
		bestROCoffsetFromMLPeakToValley = MLB.ronchi.bestROCoffsetFromMLPeakToValley,
		startingROCoffset,
		ROCincrement,
		ROCoffsetRange,
		bestROCoffset;

	if (!pastedImageActive){
		alert('paste an image first');
		return;
	}
	if (!thinBands) {
		alert('turn on thinning first');
		return;
	}
	// if calcZonalCorrectionsFromThinning is not turned on, turn it on and leave it on
	if (!calcZonalCorrectionsFromThinning) {
		common.calcZonalCorrectionsFromThinning()[common.yes].checked = true;
		common.calcZonalCorrectionsFromThinning()[common.no].checked = false;
	}

	alert('This is a long running process. An alert will appear when finished.');

	// coarse finding...
	startingROCoffset = +common.gratingOffset().val();
	ROCincrement = +common.sliderOffset().attr('step') * 2;
	ROCoffsetRange = ROCincrement * 8;
	bestROCoffset = bestROCoffsetFromMLPeakToValley(startingROCoffset, ROCoffsetRange, ROCincrement);

	// fine finding...
	ROCincrement /= 4;
	ROCoffsetRange = ROCincrement * 8;
	bestROCoffsetFromMLPeakToValley(bestROCoffset, ROCoffsetRange, ROCincrement);

	// leave calcZonalCorrectionsFromThinning on
	alert('Long running process finished.');
};

// assumes pasted image, thinned bands, calc zonal corrections all turned on
MLB.ronchi.bestROCoffsetFromMLPeakToValley = (startingROCoffset, ROCoffsetRange, ROCincrement) => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		godProcess = MLB.ronchi.godProcess,
		bestMLPeakToValley,
		ROCoffset,
		bestROCoffset,
		godProcessCount = 0,
		str = '\nbestROCoffsetFromMLPeakToValley()...';

	bestROCoffset = Number.MAX_VALUE;
	bestMLPeakToValley = Number.MAX_VALUE;

	for (ROCoffset = startingROCoffset - ROCoffsetRange / 2; ROCoffset <= startingROCoffset + ROCoffsetRange / 2; ROCoffset += ROCincrement) {
		str += '\ntrying ROCoffset=' + ROCoffset;

		common.gratingOffset().val(ROCoffset);
		godProcess();
		godProcessCount += 1;

		str += '\nresult is common.MLPeakToValley=' + common.MLPeakToValley + ', ROCoffset=' + ROCoffset;

		if (Math.abs(common.MLPeakToValley) < Math.abs(bestMLPeakToValley)) {
			bestMLPeakToValley = common.MLPeakToValley;
			bestROCoffset = ROCoffset;

			str += 'new bestMLPeakToValley=' + bestMLPeakToValley + ', bestROCoffset=' + bestROCoffset;
		}
	}

	common.gratingOffset().val(roundToDecimal(bestROCoffset, common.gratingOffsetDisplayPrecision));
	godProcess();
	godProcessCount += 1;
	str += 'godProcessCount=' + godProcessCount;
	if (common.optimizeDiagnostics) {
		console.log(str);
	}

	return bestROCoffset;
};

MLB.ronchi.flipThinning = () => {
	var common = MLB.ronchi.common,
		godProcess = MLB.ronchi.godProcess,
		checked;

	checked = common.thinBands()[common.yes].checked;
	common.thinBands()[common.no].checked = checked;
	common.thinBands()[common.yes].checked = !checked;

	if (checked) {
		common.pastedImageTransparency().val(common.storedTransparency);
	} else {
		common.pastedImageTransparency().val(1);
	}

	checked = common.invertBands()[common.yes].checked;
	common.invertBands()[common.yes].checked = !checked;
	common.invertBands()[common.no].checked = checked;

	godProcess();
};

MLB.ronchi.addEventHandlersForEachZonalErrorTableRow = () => {
	var common = MLB.ronchi.common,
		zonalErrorCount = common.zonalErrorCount,
		godProcess = MLB.ronchi.godProcess,
		ix,
		getNameIndexedElement = MLB.ronchi.getNameIndexedElement;

	// add in change event handlers for each zone, correction and use flag
	for (ix = 0; ix <= zonalErrorCount; ix++) {
		getNameIndexedElement(common.zoneIdLit, ix).change(godProcess);
		getNameIndexedElement(common.zoneCorrectionIdLit, ix).change(godProcess);
		getNameIndexedElement(common.useZonalCorrectionIdLit, ix).change(godProcess);
	}
};

MLB.ronchi.rgbToHex = rgb => {
	var str = '#';

	rgb.split(',').map(Number).forEach(v => {
		var n = Number(v).toString(16);
		if (v > 15) {
			str += n;
		} else {
			str += '0' + n;
		}
	});

	return str;
};

MLB.ronchi.thinNullImageAndPutToCanvas = () => {
	var common = MLB.ronchi.common,
		nullRonchigramIx = common.nullRonchigramIx,
		thinNulledImageData = MLB.ronchi.thinNulledImageData,
		RonchigramSize = common.UIRonchigramSize,
		nullCanvas,
		context,
		imageData,
		newImageData;

	nullCanvas = $('[id=RonchiCanvas' + (nullRonchigramIx) + ']')[0];
	context = nullCanvas.getContext('2d', {willReadFrequently: true});

	imageData = context.getImageData(0, 0, RonchigramSize, RonchigramSize);
	newImageData = context.createImageData(nullCanvas.width, nullCanvas.height);

	thinNulledImageData(imageData, newImageData, RonchigramSize);

	// copy the new image data to the nullCanvas
	context.putImageData(newImageData, 0, 0);

	common.nullContext = context;
};

// drawing the nullRonchiBands relies on update to the null ruler calcNullRonchiBandRulers() called in computeNullRonchigram()
MLB.ronchi.drawPostNullRonchigramInformation = () => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		context = common.nullContext,
		RonchigramSize = common.UIRonchigramSize,
		pastedImageName = common.pastedImageName().val(),
		drawNullRonchiBandRulers = MLB.ronchi.drawNullRonchiBandRulers,
		drawZonalCircularRulers = MLB.ronchi.drawZonalCircularRulers,
		drawCentralObstructionNull = MLB.ronchi.drawCentralObstructionNull,
		noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection,
		writeGratingOffset = MLB.ronchi.writeGratingOffset,
		gratingFreq = +common.gratingFreq().val(),
		uom,
		returnConcatenatedMirrorDiaFocalRatio = MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio;

	drawNullRonchiBandRulers(context, RonchigramSize);
	drawZonalCircularRulers(context, RonchigramSize);

	// central obstruction
	drawCentralObstructionNull(context, RonchigramSize);
	// write parabolic correction which also sets the fillStyle and font
	noteParabolicCorrection(context, RonchigramSize);
	// write grating offset
	writeGratingOffset(context, RonchigramSize);
	// write out the software nulled line
	context.fillText(common.nullLit, 2, common.fontSize);
	// and now the mirror dia + focal ratio
	context.fillText(returnConcatenatedMirrorDiaFocalRatio(), 2, common.fontSize * 2 + 2);
	// and the grating frequency
	context.fillText(gratingFreq + common.barsLit, 2, common.fontSize * 3 + 2);
	// write UOM
	if (common.inchesSelected()) {
		uom = 'inches';
	} else {
		uom = 'mm';
	}
	context.fillText(uom, 5, common.fontSize * 4 + 2);
	// write name
	context.fillText(pastedImageName, RonchigramSize / 2 * 1.5, RonchigramSize - common.fontSize);
	// write if image is pasted
	if (common.pastedImageActiveIsChecked()) {
		context.fillText(common.pastedImageLit, 0, RonchigramSize - common.fontSize);
		// and if thinned, the band deviation from ruled lines
		if (common.thinBands()[common.yes].checked) {
			context.fillText(common.bandDeviationLit + roundToDecimal(common.absAvgRonchiBandDeviationFromNearestRuler, common.dimensionDecimalPrecision), RonchigramSize - 100, common.fontSize * 3);
			context.fillText(common.ML_PV_Lit + roundToDecimal(common.MLPeakToValley, common.MLToleranceAbsDecimalPrecision), RonchigramSize - 100, common.fontSize * 4);
		}
	}
};

// called from thinNullImageAndPutToCanvas()
MLB.ronchi.thinNulledImageData = (imageData, newImageData, RonchigramSize) => {
	var common = MLB.ronchi.common,
		white = 0,
		black = 1,
		int = MLB.sharedLib.int,
		canvasMidPt = int(RonchigramSize / 2),
		data = imageData.data,
		newData = newImageData.data,
		mirrorRadius,
		mirrorRadiusSquared,
		yIx,
		xIx,
		yFromCenter,
		xFromCenter,
		imgIx,
		inNullRonchigram = [],
		nullRonchigramGrayscale = [],
		binary = [],
		binaryCount,
		binaryTotal,
		binaryMidPt,
		thin = [],
		thinning,
		red,
		green,
		blue,
		alpha,
		avg,
		nulledImageBlacksAtCanvasYMidpoint = [],
		nulledImageBlacksAtCanvasYMidpointValue,
		invertBands = common.invertBands()[common.yes].checked,
		nullRonchiBands = common.nullRonchiBands,
		nullRonchiBandsLeftToRight = [],
		nullRonchiBandsLeftToRightDifferences = [],
		ignoreEdgeX,
		ix,
		ix2,
		diffFromRuler,
		smallestDiffFromRuler,
		smallestDiffFromRulerIx2,
		nullRonchiBandsLeftToRightValue,
		str,
		zonalNumber,
		zones = [],
		zonalError,
		totalZonalError,
		absTotalZonalError,
		zoneCount,
		avgZonalError,
		absAvgZonalError,
		rulerCount,
		totalRulerSpacingX,
		avgRulerSpacingX,
		zonalCorrectionsFromNulledRG = [],
		showGradients = common.showGradients()[common.yes].checked;

	mirrorRadius = RonchigramSize / 2;
	mirrorRadiusSquared = mirrorRadius * mirrorRadius;

	// build inNullRonchigram and nullRonchigramGrayscale arrays...

	// go from top to bottom, for each  then go from left to right
	for (yIx = 0; yIx < RonchigramSize; yIx++) {
		yFromCenter = canvasMidPt - yIx;
		inNullRonchigram.push([]);
		nullRonchigramGrayscale.push([]);

		for (xIx = 0; xIx < RonchigramSize; xIx++) {
			xFromCenter = canvasMidPt - xIx;

			// row# times size of row + how far into the row --- all that *4 because red/green/blue/alpha (transparency)
			imgIx = (yIx * RonchigramSize + xIx) * 4;

			// if outside the Ronchigram then continue on to the next pixel
			if (yFromCenter * yFromCenter + xFromCenter * xFromCenter > mirrorRadiusSquared) {
				newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = newData[imgIx + 3] = 0;
				continue;
			}
			inNullRonchigram[yIx][xIx] = true;

			red = data[imgIx];
			green = data[imgIx + 1];
			blue = data[imgIx + 2];
			alpha = data[imgIx + 3];
			// grayscale the image
			avg = (red + green + blue) / 3;
			newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = avg;
			newData[imgIx + 3] = alpha;

			nullRonchigramGrayscale[yIx][xIx] = avg;
		}
	}

	// now that inNullRonchigram is filled in, make a binary image starting with getting equalizing info...

	binaryCount = binaryTotal = 0;
	for (yIx = 0; yIx < RonchigramSize; yIx++) {
		yFromCenter = canvasMidPt - yIx;
		for (xIx = 0; xIx < RonchigramSize; xIx++) {
			xFromCenter = canvasMidPt - xIx;
			if (inNullRonchigram[yIx][xIx]) {
				binaryCount++;
				binaryTotal += nullRonchigramGrayscale[yIx][xIx];
			}
		}
	}
	binaryMidPt = binaryTotal / binaryCount;
	// now make the binary array where the Ronchi bands are black
	for (yIx = 0; yIx < RonchigramSize; yIx++) {
		binary.push([]);
		for (xIx = 0; xIx < RonchigramSize; xIx++) {
			if (inNullRonchigram[yIx][xIx]) {
				if (nullRonchigramGrayscale[yIx][xIx] > binaryMidPt) {
					binary[yIx][xIx] = black;
				} else {
					binary[yIx][xIx] = white;
				}
			}
		}
	}

	// thin the Ronchi bands to two pixels wide...

	// create thin array from binary array
	for (yIx = 0; yIx < RonchigramSize; yIx++) {
		thin.push([]);
		for (xIx = 0; xIx < RonchigramSize; xIx++) {
			thin[yIx][xIx] = binary[yIx][xIx];
		}
	}
	// thin out a row at a time
	for (yIx = 0; yIx < RonchigramSize; yIx++) {
		// repeat until no change...
		thinning = true;
		while (thinning) {
			thinning = false;
			// left to right
			for (xIx = 1; xIx < RonchigramSize - 2; xIx++) {
				if (inNullRonchigram[yIx][xIx - 1] && inNullRonchigram[yIx][xIx] && inNullRonchigram[yIx][xIx + 1] && inNullRonchigram[yIx][xIx + 2]) {
					// if bwww then make it bbww and skip to the last w
					if (thin[yIx][xIx - 1] === black && thin[yIx][xIx] === white && thin[yIx][xIx + 1] === white && thin[yIx][xIx + 2] === white) {
						thin[yIx][xIx] = black;
						thinning = true;
						// skip to next to avoid chewing up long sequences, displacing the centroid to the right
						xIx += 2;
					}
				}
			}
			// right to left
			for (xIx = RonchigramSize - 2; xIx >= 2; xIx--) {
				if (inNullRonchigram[yIx][xIx + 1] && inNullRonchigram[yIx][xIx] && inNullRonchigram[yIx][xIx - 1] && inNullRonchigram[yIx][xIx - 2]) {
					// if wwwb then make it wwbb and skip to the first w
					if (thin[yIx][xIx + 1] === black && thin[yIx][xIx] === white && thin[yIx][xIx - 1] === white && thin[yIx][xIx - 2] === white) {
						thin[yIx][xIx] = black;
						thinning = true;
						// skip per above
						xIx -= 2;
					}
				}
			}
		}
	}

	// remove isolated white pixels...
	/* a white pixel surrounded by black becomes black
	   bbb    bbb
	   bwb -> bbb
	   bbb    bbb
	*/
	for (yIx = 1; yIx < RonchigramSize - 1; yIx++) {
		for (xIx = 1; xIx < RonchigramSize - 1; xIx++) {
			if (thin[yIx - 1][xIx - 1] === black        && thin[yIx - 1][xIx] === black && thin[yIx - 1][xIx + 1] === black
					&& thin[yIx][xIx - 1] === black     && thin[yIx][xIx] === white     && thin[yIx][xIx + 1] === black
					&& thin[yIx + 1][xIx - 1] === black && thin[yIx + 1][xIx] === black && thin[yIx + 1][xIx + 1] === black) {
				thin[yIx][xIx] = black;
			}
		}
	}

	// now draw the results...
	for (yIx = 0; yIx < RonchigramSize; yIx++) {
		for (xIx = 0; xIx < RonchigramSize; xIx++) {
			if (inNullRonchigram[yIx][xIx]) {
				imgIx = (yIx * RonchigramSize + xIx) * 4;
				// max intensity is 255, eg, 255,255,255 displays as white; so, a black value (which=1) displays as white
				//newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = binary[yIx][xIx] * 255;
				newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = thin[yIx][xIx] * 255;
			}
		}
	}

	//
	// compute actual Xs from ruler Xs where y is at the midpoint...
	// think Ronchi Tape Band values where deviations from ideal are directly translated to zonal corrections, ie, a shift 1/10th of the way to the next band is a 0.1 change in the zonal correction
	// after analyzing and calculating, values are stored in common.zonalCorrectionsFromNulledRG[]; also common.avgRonchiBandDeviationFromNearestRuler
	//

	str = '\nbegin calcZonalCorrectionsFromThinningDiagnostic...';

	// get ruler spacing
	totalRulerSpacingX = 0;
	rulerCount = 0;
	for (ix = 1; ix < nullRonchiBands.length - 1; ix += 1) {
		totalRulerSpacingX += nullRonchiBands[ix] - nullRonchiBands[ix - 1];
		rulerCount += 1;
	}
	avgRulerSpacingX = totalRulerSpacingX / rulerCount;
	str += '\nruler spacing X: ' + avgRulerSpacingX;

	// compute image Xs (note that white is actually a black per the 'now draw the results...' immediately above
	// may contain artifacts
	for (xIx = 0; xIx < RonchigramSize; xIx++) {
		// check 2 rows above and 2 rows below
		if (thin[canvasMidPt - 2][xIx] === white
		 && thin[canvasMidPt - 1][xIx] === white
		 && thin[canvasMidPt    ][xIx] === white
		 && thin[canvasMidPt + 1][xIx] === white
		 && thin[canvasMidPt + 2][xIx] === white) {

			nulledImageBlacksAtCanvasYMidpoint.push(xIx - canvasMidPt);
			while (xIx + 1 < RonchigramSize && thin[canvasMidPt][xIx] === white) {
				xIx += 1;
			}
		}
	}
	common.nulledImageBlacksAtCanvasYMidpoint = nulledImageBlacksAtCanvasYMidpoint;
	str += '\nbegin nulledImageBlacksAtCanvasYMidpoint... (may contain artifacts)\n';
	str += nulledImageBlacksAtCanvasYMidpoint.join(', ') + '\n';
	str += '... end';

	// compute nullRonchiBands (rules) from far left to far right
	if (invertBands) {
		for (ix = nullRonchiBands.length - 1; ix >= 0; ix -= 1) {
			nullRonchiBandsLeftToRight.push(-nullRonchiBands[ix]);
		}
		for (ix = 0; ix < nullRonchiBands.length; ix += 1) {
			nullRonchiBandsLeftToRight.push(nullRonchiBands[ix]);
		}
	} else {
		for (ix = nullRonchiBands.length - 1; ix > 0; ix -= 1) {
			nullRonchiBandsLeftToRight.push(-nullRonchiBands[ix]);
		}
		for (ix = 0; ix < nullRonchiBands.length; ix += 1) {
			nullRonchiBandsLeftToRight.push(nullRonchiBands[ix]);
		}
	}
	str += '\nbegin nullRonchiBandsLeftToRight...\n';
	str += nullRonchiBandsLeftToRight.join(', ') + '\n';
	str += '... end';

	// compute actual from desired Xs
	ignoreEdgeX = avgRulerSpacingX / 4;
	for (ix = 0; ix < nulledImageBlacksAtCanvasYMidpoint.length; ix += 1) {
		nulledImageBlacksAtCanvasYMidpointValue = nulledImageBlacksAtCanvasYMidpoint[ix];
		if (nulledImageBlacksAtCanvasYMidpointValue < -canvasMidPt + ignoreEdgeX || nulledImageBlacksAtCanvasYMidpointValue > canvasMidPt - ignoreEdgeX) {
			continue;
		}
		// have valid nulledImageBlacksAtCanvasYMidpointValue
		// find closest nullRonchiBandsLeftToRight
		smallestDiffFromRuler = Number.MAX_VALUE;
		for (ix2 = 0; ix2 < nullRonchiBandsLeftToRight.length; ix2 += 1) {
			diffFromRuler = nulledImageBlacksAtCanvasYMidpointValue - nullRonchiBandsLeftToRight[ix2];
			if (Math.abs(diffFromRuler) < Math.abs(smallestDiffFromRuler)) {
				smallestDiffFromRuler = diffFromRuler;
				smallestDiffFromRulerIx2 = ix2;
			}
		}
		nullRonchiBandsLeftToRightValue = nullRonchiBandsLeftToRight[smallestDiffFromRulerIx2];
		for (ix2 = 0; ix2 < nullRonchiBands.length;  ix2 += 1) {
			if (Math.abs(nullRonchiBandsLeftToRightValue) === nullRonchiBands[ix2]) {
				// inverted bands don't have a central ruler, so their zonal number starts 1 higher
				zonalNumber = ix2 + invertBands;
			}
		}
		nullRonchiBandsLeftToRightDifferences.push({
				nulledImageBlacksAtCanvasYMidpointValue: nulledImageBlacksAtCanvasYMidpointValue,
				nulledImageBlacksAtCanvasYMidpointIx: ix,
				nullRonchiBandsLeftToRightValue: nullRonchiBandsLeftToRightValue,
				nullRonchiBandsLeftToRightIx: smallestDiffFromRulerIx2,
				smallestDiffFromRuler: smallestDiffFromRuler,
				zonalNumber: zonalNumber
		});
	}
	str += '\nbegin nullRonchiBandsLeftToRightDifferences...\n';
	for (ix = 0; ix < nullRonchiBandsLeftToRightDifferences.length; ix += 1) {
		str += 'diff: ' + nullRonchiBandsLeftToRightDifferences[ix].smallestDiffFromRuler + ', ';
		str += 'ruler: ' + nullRonchiBandsLeftToRightDifferences[ix].nullRonchiBandsLeftToRightValue + ', ';
		str += 'zonalNumber: ' + nullRonchiBandsLeftToRightDifferences[ix].zonalNumber + ', ';
		str += '\n';
	}
	str += '... end';

	// combine left and right differences into zones
	// invertBands=falae always has a center ruler
	for (ix = 0; ix < nullRonchiBandsLeftToRightDifferences.length; ix += 1) {
		zonalNumber = nullRonchiBandsLeftToRightDifferences[ix].zonalNumber;
		if (zones[zonalNumber] === undefined) {
			zones[zonalNumber] = {values: [],
			                      count: 0,
								  total: 0,
								  avg: undefined
			};
		}
		zones[zonalNumber].count += 1;
		// a positive value is outside the ruler
		zonalError = nullRonchiBandsLeftToRightDifferences[ix].smallestDiffFromRuler;
		if (nullRonchiBandsLeftToRightDifferences[ix].nullRonchiBandsLeftToRightValue < 0) {
			zonalError = -zonalError;
		}
		zones[zonalNumber].values.push(zonalError);
	}
	// avg zonal error
	totalZonalError = 0;
	absTotalZonalError = 0;
	zoneCount = 0;
	for (ix = 0; ix < zones.length; ix += 1) {
		if (zones[ix] === undefined) {
			continue;
		}
		for (ix2 = 0; ix2 < zones[ix].values.length; ix2 += 1) {
			zones[ix].total += zones[ix].values[ix2];
		}
		zones[ix].avg = zones[ix].total / zones[ix].count;
		zones[ix].avgRuler = zones[ix].avg / avgRulerSpacingX;
		totalZonalError += zones[ix].avg;
		absTotalZonalError += Math.abs(zones[ix].avg);
		zoneCount += 1;
	}
	avgZonalError = totalZonalError / zoneCount;
	absAvgZonalError = absTotalZonalError / zoneCount;
	common.avgRonchiBandDeviationFromNearestRuler = avgZonalError;
	common.absAvgRonchiBandDeviationFromNearestRuler = absAvgZonalError;
	str += '\navgZonalError=' + avgZonalError + '; absAvgZonalError=' + absAvgZonalError;

	str += '\nbegin zones...';
	for (ix = 0; ix < zones.length; ix += 1) {
		if (zones[ix] === undefined) {
			continue;
		}
		str += '\nzone: ' + ix + ', ';
		str += 'values: ';
		for (ix2 = 0; ix2 < zones[ix].values.length; ix2 += 1) {
			str += zones[ix].values[ix2] + ', ';
		}
		str += 'count: ' + zones[ix].count + ', ';
		str += 'total: ' + zones[ix].total + ', ';
		str += 'avg: ' + zones[ix].avg + ', ';
		str += 'avgRuler: ' + zones[ix].avgRuler + ', ';
	}
	str += '\n... end';

	// save pertinent values to common.zonalCorrectionsFromNulledRG
	for (ix = 0; ix < zones.length; ix += 1) {
		if (zones[ix] === undefined) {
			zonalCorrectionsFromNulledRG.push(0);
			continue;
		}
		zonalCorrectionsFromNulledRG.push(zones[ix].avgRuler);
	}
	common.zonalCorrectionsFromNulledRG = zonalCorrectionsFromNulledRG;
	str += '\nbegin zonalCorrectionsFromNulledRG...';
	for (ix = 0; ix < zonalCorrectionsFromNulledRG.length; ix += 1) {
		str += '\nzone ' + ix;
		str += ' correction: ' + zonalCorrectionsFromNulledRG[ix] + ', ';
	}
	str += '\n... end';
	str += '\n...end calcZonalCorrectionsFromThinningDiagnostic';
	if (common.calcZonalCorrectionsFromThinningDiagnostic) {
		console.log(str);
	}

	//
	// ...end
	//

	//MLB.ronchi.displayGridsTrueFalse('inNullRonchigram', inNullRonchigram, RonchigramSize);
	//MLB.ronchi.displayGrids('nullRonchigramGrayscale', nullRonchigramGrayscale, RonchigramSize);
	//MLB.ronchi.displayGrids('binary', binary, RonchigramSize);
	//MLB.ronchi.displayGrids('thin', thin, RonchigramSize);

	/* for example, a Ronchigram size of 40 with the default settings: the thin array looks like (where '-' is undefined and '0' values indicate a black vertical line):
	'...........................................center is here:.V.........................................................
	-, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, 1, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, -, -, -, -, -, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, -, -, -, -, -, -, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, -, -, -, -, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, -, -, -, -, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, -, -, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, -, -, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, -, -, -, -, -, -,
	-, -, -, -, -, -, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, -, -, -, -, -,
	-, -, -, -, -, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, -, -, -, -,
	-, -, -, -, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, -, -, -,
	-, -, -, -, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, -, -, -,
	-, -, -, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, -, -,
	-, -, -, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, -, -,
	-, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, -,
	-, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, -,
	-, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
	-, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0,
	-, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0,
	-, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1,
	-, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
	-, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, -,
	-, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, -,
	-, -, -, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, -, -,
	-, -, -, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, -, -,
	-, -, -, -, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, -, -, -,
	-, -, -, -, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, -, -, -,
	-, -, -, -, -, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, -, -, -, -,
	-, -, -, -, -, -, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, -, -, -, -, -,
	-, -, -, -, -, -, -, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, -, -, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, -, -, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, -, -, -, -, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, -, -, -, -, -, -, -, -, -, -, -,
	-, -, -, -, -, -, -, -, -, -, -, -, -, -, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, -, -, -, -, -, -, -, -, -, -, -, -, -,
	*/

	// gradients...
	if (showGradients) {

		var contrast = 1.5,
			canCalcGradient = [],
			gradients = [],
			gradient,
			normalizedGradient,
			lowestGradient = Number.MAX_VALUE,
			highestGradient = Number.MIN_VALUE;

		// now that inNullRonchigram is filled in, work on the canCalcGradient array
		for (yIx = 0; yIx < RonchigramSize; yIx++) {
			canCalcGradient.push([]);
			for (xIx = 0; xIx < RonchigramSize; xIx++) {
				canCalcGradient[yIx][xIx] = yIx > 0 && yIx < RonchigramSize - 1
						&& xIx > 0 && xIx < RonchigramSize - 1
						&& inNullRonchigram[yIx - 1][xIx - 1] && inNullRonchigram[yIx - 1][xIx] && inNullRonchigram[yIx - 1][xIx + 1]
						&& inNullRonchigram[yIx][xIx - 1]     && inNullRonchigram[yIx][xIx]     && inNullRonchigram[yIx][xIx + 1]
						&& inNullRonchigram[yIx + 1][xIx - 1] && inNullRonchigram[yIx + 1][xIx] && inNullRonchigram[yIx + 1][xIx + 1];
			}
		}
		// now calculate the gradients using Sobel operator (https://www.cis.rit.edu/people/faculty/rhody/EdgeDetection.htm#:~:text=Vertical where edges are detected and the transition direction is vertical.)
		for (yIx = 0; yIx < RonchigramSize; yIx++) {
			gradients.push([]);
			for (xIx = 0; xIx < RonchigramSize; xIx++) {
				if (canCalcGradient[yIx][xIx]) {
					gradient = 1 / 4 * (
							+ -nullRonchigramGrayscale[yIx - 1][xIx - 1] + nullRonchigramGrayscale[yIx - 1][xIx + 1]
							+ -2 * nullRonchigramGrayscale[yIx][xIx - 1] + 2 * nullRonchigramGrayscale[yIx][xIx + 1]
							+ -nullRonchigramGrayscale[yIx + 1][xIx - 1] + nullRonchigramGrayscale[yIx + 1][xIx + 1]);

					gradients[yIx][xIx] = gradient;
					if (gradient < lowestGradient) {
						lowestGradient = gradient;
					}
					if (gradient > highestGradient) {
						highestGradient = gradient;
					}
				}
			}
		}
		// normalize gradients and set newImageData to display the gradients
		for (yIx = 0; yIx < RonchigramSize; yIx++) {
			for (xIx = 0; xIx < RonchigramSize; xIx++) {
				if (canCalcGradient[yIx][xIx]) {
					normalizedGradient = Math.floor((gradients[yIx][xIx] - lowestGradient) / (highestGradient - lowestGradient) * 255);

					// change contrast
					normalizedGradient = (normalizedGradient - 122) * contrast + 122;
					if (normalizedGradient > 255) {
						normalizedGradient = 255;
					} else if (normalizedGradient < 0) {
						normalizedGradient = 0;
					}

					imgIx = (yIx * RonchigramSize + xIx) * 4;
					newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = normalizedGradient;
				}
			}
		}
	}

	//MLB.ronchi.displayGridsTrueFalse('canCalcGradient', canCalcGradient, RonchigramSize);
	//MLB.ronchi.displayGrids('gradients', gradients, RonchigramSize);
	//MLB.ronchi.displayGrids('normalizedGradient', normalizedGradient, RonchigramSize);
};

MLB.ronchi.displayGridsTrueFalse = (name, grid, size) => {
	var yIx,
		xIx,
		rowStr = '';

	console.log('begin ' + name + '...');
	for (yIx = 0; yIx < size; yIx++) {
		for (xIx = 0; xIx < size; xIx++) {
			rowStr += grid[yIx][xIx] ? '1' : '0';
		}
		rowStr += '\n';
	}
	console.log(rowStr);
	console.log('... end ' + name);
};

MLB.ronchi.displayGrids = (name, grid, size) => {
	var yIx,
		xIx,
		value,
		rowStr = '';

	console.log('begin ' + name + '...');
	for (yIx = 0; yIx < size; yIx++) {
		for (xIx = 0; xIx < size; xIx++) {
			value = grid[yIx][xIx];
			if (value === undefined) {
				value = '-';
			}
			rowStr += value + ', ';
		}
		rowStr += '\n';
	}
	console.log(rowStr);
	console.log('... end ' + name);
};

MLB.ronchi.changeGratingOffsetParms = () => {
	var common = MLB.ronchi.common;

	if (common.mmSelected()) {
		common.sliderOffset().attr({min: -25, max: 25, step: 0.05});
	} else {
		common.sliderOffset().attr({min: -1,  max: 1,  step: 0.002}); // starting default values from the html
	}
};

MLB.ronchi.getGratingOffsetValue = () => {
	var common = MLB.ronchi.common;

	if (common.mmSelected()) {
		return common.gratingOffsetChangeMM;
	}
	return common.gratingOffsetChangeInches;
};

$(window).ready(() => {
	var common = MLB.ronchi.common,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		setPastedImageInactive = MLB.ronchi.setPastedImageInactive,
		setGratingOffsetFromSliderOffset = MLB.ronchi.setGratingOffsetFromSliderOffset,
		setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
		setParabolicCorrectionFromSliderParabolicCorrection = MLB.ronchi.setParabolicCorrectionFromSliderParabolicCorrection,
		changeRonchigramSize = MLB.ronchi.changeRonchigramSize,
		copyClipboardImage = MLB.ronchi.copyClipboardImage,
		setDropEffectToCopy = MLB.ronchi.setDropEffectToCopy,
		dragAndDropImage = MLB.ronchi.dragAndDropImage,
		deleteImage = MLB.ronchi.deleteImage,
		pasteExampleRonchigram = MLB.ronchi.pasteExampleRonchigram,
		putData = MLB.ronchi.putData,
		noDataFound = MLB.ronchi.noDataFound,
		getData = MLB.ronchi.getData,
		saveCorrections = MLB.ronchi.saveCorrections,
		restoreCorrections = MLB.ronchi.restoreCorrections,
		showMatchingRonchiLocalStorageItems = MLB.ronchi.showMatchingRonchiLocalStorageItems,
		removeMatchingRonchiLocalStorageItems = MLB.ronchi.removeMatchingRonchiLocalStorageItems,
		buildZoneAndCorrectionTable = MLB.ronchi.buildZoneAndCorrectionTable,
		addEventHandlersForEachZonalErrorTableRow = MLB.ronchi.addEventHandlersForEachZonalErrorTableRow,
		godProcess = MLB.ronchi.godProcess,
		flipThinning = MLB.ronchi.flipThinning,
		sortZonalCorrectionTableByZone = MLB.ronchi.sortZonalCorrectionTableByZone,
		cleanupZonalCorrectionTable = MLB.ronchi.cleanupZonalCorrectionTable,
		copyBandPositionsToErrorTableSetCorrectionsToOne = MLB.ronchi.copyBandPositionsToErrorTableSetCorrectionsToOne,
		copyZonalRulerToErrorTable = MLB.ronchi.copyZonalRulerToErrorTable,
		copyTenZonesToErrorTable = MLB.ronchi.copyTenZonesToErrorTable,
		resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors,
		resetCorrectionFactorsToParabCorrection = MLB.ronchi.resetCorrectionFactorsToParabCorrection,
		rgbToHex = MLB.ronchi.rgbToHex,
		changeGratingOffsetParms = MLB.ronchi.changeGratingOffsetParms,
		getGratingOffsetValue = MLB.ronchi.getGratingOffsetValue,
		changeMLOffset = MLB.ronchi.changeMLOffset,
		bestXoffsetFromBandErrorsController = MLB.ronchi.bestXoffsetFromBandErrorsController,
		bestROCoffsetFromBandErrorsController = MLB.ronchi.bestROCoffsetFromBandErrorsController,
		bestROCoffsetFromMLPeakToValleyController = MLB.ronchi.bestROCoffsetFromMLPeakToValleyController;

	// starting values
	document.body.style.background = rgbToHex(common.backgroundColor().val());
	common.invertBands()[common.no].checked = true;
	common.RonchiGrid()[common.no].checked = true;
	common.showBullseyeZones()[common.no].checked = true;
	common.thinBands()[common.yes].checked = true;
	common.showGradients()[common.no].checked = true;
	common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
	common.lastCalcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked;
	setPastedImageInactive();
	common.UOM()[common.inches].checked = true;
	common.btnIncludeParabCorr()[common.no].checked = true;

	// build and fill in zone and correction table
	buildZoneAndCorrectionTable();
	addEventHandlersForEachZonalErrorTableRow();

	// event hookups/subscribes

	common.UOM().change(() => {
		var mirrorDia = common.mirrorDia().val(),
			radiusOfCurvature = common.radiusOfCurvature().val(),
			gratingFreq = common.gratingFreq().val(),
			gratingOffset = common.gratingOffset().val(),
			centralObstruction = common.centralObstruction().val(),
			gratingFreqPrecision;

		if (common.UOM()[common.inches].checked) {
			mirrorDia /= 25.4;
			radiusOfCurvature /= 25.4;
			gratingFreq *= 25.4;
			gratingOffset /= 25.4;
			gratingFreqPrecision = common.gratingFreqPrecisionInches;
			centralObstruction /= 25.4;
		} else {
			mirrorDia *= 25.4;
			radiusOfCurvature *= 25.4;
			gratingFreq /= 25.4;
			gratingOffset *= 25.4;
			gratingFreqPrecision = common.gratingFreqPrecisionMM;
			centralObstruction *= 25.4;
		}
		common.mirrorDia().val(roundToDecimal(mirrorDia, common.mirrorDiaPrecision));
		common.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, common.radiusOfCurvaturePrecision));
		common.gratingFreq().val(roundToDecimal(gratingFreq, gratingFreqPrecision));
		common.gratingOffset().val(roundToDecimal(gratingOffset, common.gratingOffsetDisplayPrecision));
		common.centralObstruction().val(roundToDecimal(centralObstruction, common.centralObstructionPrecision));

		common.UIMirrorDia = mirrorDia;
		common.UIRadiusOfCurvature = radiusOfCurvature;

		changeGratingOffsetParms();
		godProcess();
	});

	common.mirrorDia().change(e => {
		// keep FR, adjust RoC and FL
		var mirrorDia = e.target.value,
			focalRatio = +common.focalRatio().val(),
			radiusOfCurvature = mirrorDia * focalRatio * 2;

		common.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, common.radiusOfCurvaturePrecision));
		common.focalLength().val(roundToDecimal(mirrorDia * focalRatio, common.focalLengthPrecision));
		// zero out any central obstruction
		common.centralObstruction().val(0);

		common.UIMirrorDia = mirrorDia;
		common.UIRadiusOfCurvature = radiusOfCurvature;

		godProcess();
	});
	common.radiusOfCurvature().change(() => {
		// change FL and FR
		var mirrorDia = common.UIMirrorDia,
			radiusOfCurvature = +common.radiusOfCurvature().val();

		common.UIRadiusOfCurvature = radiusOfCurvature;
		common.focalLength().val(roundToDecimal(radiusOfCurvature / 2, common.focalLengthPrecision));
		common.focalRatio().val(roundToDecimal(radiusOfCurvature / mirrorDia / 2, common.focalRatioPrecision));
		godProcess();
	});
	common.focalLength().change(() => {
		// change RoC and FR
		var mirrorDia = common.UIMirrorDia,
			focalLength = +common.focalLength().val(),
			radiusOfCurvature = focalLength * 2;

		common.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, common.radiusOfCurvaturePrecision));
		common.UIRadiusOfCurvature = radiusOfCurvature;
		common.focalRatio().val(roundToDecimal(focalLength / mirrorDia, common.focalRatioPrecision));
		godProcess();
	});
	common.focalRatio().change(() => {
		// change RoC and FL
		var mirrorDia = common.UIMirrorDia,
			focalRatio = +common.focalRatio().val(),
			radiusOfCurvature = mirrorDia * focalRatio * 2;

		common.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, common.radiusOfCurvaturePrecision));
		common.UIRadiusOfCurvature = radiusOfCurvature;
		common.focalLength().val(roundToDecimal(radiusOfCurvature / 2, common.focalLengthPrecision));
		godProcess();
	});
	common.centralObstruction().change(godProcess);
	common.gratingFreq().change(() => {
		godProcess();
	});
	common.gratingOffset().change(() => {
		godProcess();
	});
	common.userParabolicCorrection().change(godProcess);
	common.RonchigramSize().change(e => {
		common.UIRonchigramSize = e.target.value;
		changeRonchigramSize();
	});
	common.bandColorRGB().change(godProcess);
	common.backgroundBandColorRGB().change(godProcess);
	common.invertBands().change(godProcess);
	common.backgroundColor().change(e => document.body.style.background = e.target.value);
	common.RonchiGrid().change(godProcess);
	common.circularZonalRulerCount().change(godProcess);
	common.rulerTextRGB().change(() => {
		common.rulerColor = rgbToHex(common.rulerTextRGB().val());
		godProcess();
	});

	common.pastedImageActive().change(godProcess);
	common.pastedImageTransparency().change(e => {
		// turn off thinned Ronchi bands which depend on transparency === 1;
		// here, if user lowers transparency, then user's desire is paramount so turn off the band thinning
		if (+e.target.value < 1 && common.thinBands()[common.yes].checked === true) {
			common.thinBands()[common.no].checked = true;
			/* turn off warning
			alert('Thinning of nulled Ronchi bands has been turned off because transparency is being set less than 1');
			*/
		}
		common.storedTransparency = e.target.value;
		godProcess();
	});
	common.pastedImageHeight().change(godProcess);
	common.pastedImageWidth().change(godProcess);
	common.pastedImageOffsetX().change(godProcess);
	common.pastedImageOffsetY().change(godProcess);
	common.pastedImageName().change(godProcess);
	common.btnDeletedPastedImage().click(deleteImage);

	common.btnIncreaseGratingOffset().click(() => {
		setGratingOffsetFromOffset(getGratingOffsetValue());
		godProcess();
	});
	common.btnDecreaseGratingOffset().click(() => {
		setGratingOffsetFromOffset(-getGratingOffsetValue());
		godProcess();
	});
	common.sliderOffset().mousemove(() => {
		setGratingOffsetFromSliderOffset();
		godProcess();
	});
	common.sliderOffset().mousedown(() => { MLB.ronchi.common.sliderOffsetMousedown = true; });
	common.sliderOffset().mouseup(() =>   { MLB.ronchi.common.sliderOffsetMousedown = false; });

	common.sliderParabolicCorrection().mousemove(() => {
		setParabolicCorrectionFromSliderParabolicCorrection();
		godProcess();
	});
	common.sliderParabolicCorrection().mousedown(() => { MLB.ronchi.common.sliderParabolicCorrectionMousedown = true; });
	common.sliderParabolicCorrection().mouseup(() =>   { MLB.ronchi.common.sliderParabolicCorrectionMousedown = false; });

	common.btnSortZonalCorrectionTableByZone().click(() => {
		sortZonalCorrectionTableByZone();
		cleanupZonalCorrectionTable();
		godProcess();
	});
	common.btnCopyBands().click(() => {
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
		copyBandPositionsToErrorTableSetCorrectionsToOne();
		resetCorrectionFactors();
		godProcess();
	});
	common.btnUseZonalRuler().click(() => {
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
		copyZonalRulerToErrorTable();
		resetCorrectionFactors();
		godProcess();
	});
	common.btn10Zones().click(() => {
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
		copyTenZonesToErrorTable();
		resetCorrectionFactors();
		godProcess();
	});
	common.btnResetCorrectionFactors().click(() => {
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
		common.lastCalcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked;
		resetCorrectionFactors();
		godProcess();
	});
	common.btnResetCorrectionFactorsToParabCorrection().click(() => {
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
		resetCorrectionFactorsToParabCorrection();
		godProcess();
	});
	common.btnSaveCorrections().click(saveCorrections);
	common.btnRestoreCorrections().click(() => {
		common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
		restoreCorrections();
		godProcess();
	});

	document.addEventListener('paste', e => {
		copyClipboardImage(e);
		godProcess();
	});
	document.addEventListener('dragover', setDropEffectToCopy);
	document.addEventListener('drop', dragAndDropImage);
	document.addEventListener('keydown', event => {
		const key = event.key;
		if (key === 'Delete' || key === 'Escape') {
			deleteImage();
		}
	});

	common.btnPasteExampleRonchigram13Inside().click(() =>  { pasteExampleRonchigram(common.exampleImages.thirteenInside);        });
	common.btnPasteExampleRonchigram13Inside2().click(() => { pasteExampleRonchigram(common.exampleImages.thirteenInsideThinned); });
	common.btnPasteExampleRonchigram13Outside().click(() => { pasteExampleRonchigram(common.exampleImages.thirteenOutside);       });
	common.btnPasteExampleRonchigramGrid().click(() =>      { pasteExampleRonchigram(common.exampleImages.thirteenGrid);          });
	common.btnPasteExampleRonchigram12F5Under().click(() => { pasteExampleRonchigram(common.exampleImages.twelveF5Under);         });

	common.btnPutData().click(putData);
	common.btnGetData().click(() => {
		var dataFound = getData();
		if (dataFound) {
			changeGratingOffsetParms();
			godProcess();
		} else {
			noDataFound();
		}
	});
	common.dataName().change(() => {
		getData(); // may be entering a new data name that has no saved data yet
		godProcess();
	});
	common.btnShowDataNames().click(showMatchingRonchiLocalStorageItems);
	common.btnDeleteData().click(removeMatchingRonchiLocalStorageItems);
	common.distortionResolutionFactor().change(godProcess);
	common.showBullseyeZones().change(godProcess);
	common.thinBands().change(godProcess);
	common.showGradients().change(() => {
		if (!common.pastedImageActiveIsChecked()) {
			alert('paste an image first');
			return;
		}
		if (common.thinBands()[common.no].checked) {
			alert('turn on thinning first');
			return;
		}
		godProcess();
	});
	common.calcZonalCorrectionsFromThinning().change(() => {
		if (common.lastCalcZonalCorrectionsFromThinning && common.calcZonalCorrectionsFromThinning()[common.no].checked) {
			resetCorrectionFactors();
		}
		if (!common.pastedImageActiveIsChecked()) {
			common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
			common.calcZonalCorrectionsFromThinning()[common.yes].checked = false;
			common.lastCalcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked;
			alert('paste an image first');
			return;
		}
		if (!common.thinBands()[common.yes].checked) {
			common.calcZonalCorrectionsFromThinning()[common.no].checked = true;
			common.calcZonalCorrectionsFromThinning()[common.yes].checked = false;
			common.lastCalcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked;
			alert('turn on thinning first');
			return;
		}
		common.lastCalcZonalCorrectionsFromThinning = common.calcZonalCorrectionsFromThinning()[common.yes].checked;
		godProcess();
	});
	common.btnFlipThinning().click(flipThinning);

	common.btnBestROCoffsetUsingBandErrors().click(bestROCoffsetFromBandErrorsController);
	common.btnBestROCoffsetUsingZonalErrors().click(bestROCoffsetFromMLPeakToValleyController);
	common.btnBestXoffset().click(bestXoffsetFromBandErrorsController);
	common.btnIncludeParabCorr().change(godProcess);
	common.MLOffset().change(e => changeMLOffset(e.target.value));

	// do not set zones to Ronchi bands because plotRonchigramsCalcRonchiTape() which calculates the bands has not been called yet
	copyZonalRulerToErrorTable();

	godProcess();
});

// end of file
