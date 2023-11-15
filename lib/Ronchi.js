// copyright Mel Bartels, 2011-2023
// validate https://beautifytools.com/javascript-validator.php
// image to base64 string https://codebeautify.org/image-to-base64-converter

//var MLB, $;

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
    // defined...
    yes: 0,
    no: 1,
    imperial: 0,
    metric: 1,
    // ...defined

    // ruler...
    none: 0,
    zonal: 1,
    zonal10: 2,
    uomCenter: 3,
    uomEdge: 4,
    RonchiTapeMarks: 5,
    noneLit: 'none',
    zonalLit: 'zonal',
    zonal10Lit: 'zonal10',
    uomCenterLit: 'uomCenter',
    uomEdgeLit: 'uomEdge',
    RonchiTapeMarksLit: 'RonchiTapeMarks',
    numZonalRulers: 4,
    blackColor: 'black',
    rulerTextColor: '#ff0000',
    rulerThickness: 2,
    unwrapRulerThickness: 1,
    // ...ruler

    // rounding precisions...
    wavesDecimalPrecision: 2,
    gratingOffsetDecimalPrecision: 3,
    MLToleranceDecimalPrecision: 3,
    tapeBandDecimalPrecision: 2,
    MLToleranceDisplayDecimalPrecision: 2,
    parabolicCorrectionDisplayPrecision: 2,
    // ...rounding precisions

    // tape bands...
    tapes: [],
    transitions: [],
    pixelArray: undefined,
    tapeBandScalingFactor: 1000,
    tapeHeight: 20,
    // from 0 to 9 = 10 zones
    drawRonchiTapeMarksOnColoredBands: true,
    // ...tape bands

    // zones...
    zoneCount: 11, // for 0 to 1 in 0.1 increments
    //array of [zone, correctionFactor], eg, [[0, 1.0], [0.1, 0.9] ... [1.0, 1.1]] as numbers
    userZonalCorrections: [],
    peakValleyMLTolerance: undefined,
    weightedMLTolerance: undefined,
    zoneIdLit: 'id=zone',
    zoneId2Lit: 'id="zone',
    zoneCorrectionIdLit: 'id=zoneCorrection',
    zoneCorrectionId2Lit: 'id="zoneCorrection',
    MLToleranceIdLit: 'id=MLTolerance',
    MLToleranceId2Lit: 'id="MLTolerance',
    RoCChangeIdLit: 'id=RoCCorrection',
    RoCChangeId2Lit: 'id="RoCCorrection',
    zoneResultIdLit: 'id=zoneResult',
    zoneResult2Lit: 'id="zoneResult',
    useZonalCorrectionIdLit: 'id=chBoxUseZonalCorrection',
    useZonalCorrectionIdDoubleQuoteLit: 'id="chBoxUseZonalCorrection',
    // ...zones

    // parabolic distortions...
    RonchigramDistortions: [],
    // ...parabolic distortions

    // charts...
    RonchigramCount: undefined,
    startingRonchigramSize: 350,
    fontRatio: 30,
    fontSize: 12,
    fontLit: 'pt arial',
    opaque: 255,
    zonesTopViewLit: 'zonesTopView',
    zonesSideViewLit: 'zonesSideView',
    parabCorrLit: 'ParCorr=',
    unwrapLit: 'Unwrapped',
    // ...charts

    // images...
    pastedImageLit: 'pastedImage',
    exampleImages: {
    // mirrorDia, radiusOfCurvature, centralObstruction, gratingFreq, gratingOffsetSeries, userParabolicCorrection, RonchigramSize, borderSize, invertBands, RonchiTape, RonchiGrid, pastedImageTransparency, pastedImageWidth, pastedImageHeight, pastedImageOffsetX, pastedImageOffsetY, imageSource, distortionResolutionFactor, unwrapBandRuler, showBullseyeZones
          '16': [16.25, 93.6,  0,  65,  -0.05,  1, 400,  0,  true, false, false,  0.9, 400, 400,   1,   0, MLB.base64images._16,   3,  true, false],
          '25': [25.1,   131,  0,  65,  0.776,  1, 400, 10,  true, false, false,  0.9, 454, 461, -16, -19, MLB.base64images._25,   2, false, false],
          '13': [13.1,  80.6,  0,  66, -0.104,  1, 400,  0, false, false, false, 0.75, 400, 400,   0,   0, MLB.base64images._13,   3, false, false],
        'grid': [13.1,  80.6,  0,  65, -0.454,  1, 400,  0,  true, true,  true,   0.9, 398, 402,   0,  -5, MLB.base64images._grid, 2,  true, false]
    },
    images: {},
    lastRonchigramSize: undefined,
    MatchingRonchiTestLit: 'MatchingRonchiTest ',
    // ...images

    // controls...
    sliderOffsetMousedown: undefined,
    lastSliderOffsetValue: 0,
    gratingOffsetChange: 0.002,
    sliderParabolicCorrectionMousedown: undefined,
    imperialLit: 'imperial',
    wavelengthLightImperial: 0.000022,
    wavelengthLightMetric: 0.00056,
    // ...controls

    // ...wave errors
    waveErrors: [],
    normalizedWaveErrors: [],
    waveErrorsLowestIsZero: [],
    rangeWaveError: undefined,
    sideViewFillColor: "gray",
    // ...wave errors

    mirrorDia: function () {
        return $('[name=mirrorDia]');
    },
    radiusOfCurvature: function () {
        return $('[name=radiusOfCurvature]');
    },
    focalLength: function () {
        return $('[name=focalLength]');
    },
    focalRatio: function () {
        return $('[name=focalRatio]');
    },
    centralObstruction: function () {
        return $('[name=centralObstruction]');
    },
    gratingFreq: function () {
        return $('[name=gratingFreq]');
    },
    gratingOffsetSeries: function () {
        return $('[name=gratingOffsetSeries]');
    },
    btnIncreaseGratingOffsets: function () {
        return $('input[id=btnIncreaseGratingOffsets]');
    },
    btnDecreaseGratingOffsets: function () {
        return $('input[id=btnDecreaseGratingOffsets]');
    },
    sliderOffset: function () {
        return $('input[id=sliderOffset]');
    },
    userParabolicCorrection: function () {
        return $('[name=userParabolicCorrection]');
    },
    sliderParabolicCorrection: function () {
        return $('input[id=sliderParabolicCorrection]');
    },
    RonchigramSize: function () {
        return $('[name=RonchigramSize]');
    },
    borderSize: function () {
        return $('[name=borderSize]');
    },
    bandColorRGB: function () {
        return $('[name=bandColorRGB]');
    },
    backgroundBandColorRGB: function () {
        return $('[name=backgroundBandColorRGB]');
    },
    invertBands: function () {
        return $('[name=invertBands]');
    },
    backgroundColor: function () {
        return $('[name=backgroundColor]');
    },
    RonchiTape: function () {
        return $('[name=RonchiTape]');
    },
    RonchiGrid: function () {
        return $('[name=RonchiGrid]');
    },
    btnDrawRuler: function () {
        return $('[name=btnDrawRuler]');
    },
    btnDrawRulerVal: function () {
        return $('[name=btnDrawRuler]:checked').val();
    },
    drawZonalRuler: function () {
        return this.btnDrawRuler()[this.zonal].checked;
    },
    drawZonal10Ruler: function () {
        return this.btnDrawRuler()[this.zonal10].checked;
    },
    drawUomCenterRuler: function () {
        return this.btnDrawRuler()[this.uomCenter].checked;
    },
    drawUomEdgeRuler: function () {
        return this.btnDrawRuler()[this.uomEdge].checked;
    },
    drawRonchiTapeMarksRuler: function () {
        return this.btnDrawRuler()[this.RonchiTapeMarks].checked;
    },
    rulerTextRGB: function () {
        return $('[name=rulerTextRGB]');
    },
    Ronchigrams: function () {
        return $('[id=Ronchigrams]');
    },
    discussionDiv: function () {
        return $('[id=discussionDiv]');
    },
    zonalErrorsTableDiv: function () {
        return $('[id=zonalErrorsTableDiv]');
    },
    zonalErrorsViewDiv: function () {
        return $('[id=zonalErrorsViewDiv]');
    },
    zonalErrorsNotesDiv: function () {
        return $('[id=zonalErrorsNotesDiv]');
    },
    matchingRonchiTapeBands: function () {
        return $('[id=matchingRonchiTapeBands]');
    },
    waveNotes: function () {
        return $('[id=waveNotes]');
    },
    canvasSize: function () {
        return +this.RonchigramSize().val() + 2 * +this.borderSize().val();
    },
    btnWavelengthLightUOM: function () {
        return $('[name=btnWavelengthLightUOM]');
    },
    btnWavelengthLightUOMVal: function () {
        return $('[name=btnWavelengthLightUOM]:checked').val();
    },
    imperialSelected: function () {
        return this.btnWavelengthLightUOM()[this.imperial].checked;
    },
    metricSelected: function () {
        return this.btnWavelengthLightUOM()[this.metric].checked;
    },
    offsetRoC: function () {
        return $('[name=offsetRoC]');
    },
    waveErrorsLabel: function () {
        return $('[id=waveErrorsLabel]');
    },
    unwrapStraightnessLabel: function () {
        return $('[id=unwrapStraightnessLabel]');
    },
    btnSortZonalCorrectionTableByZone: function () {
        return $('input[id=btnSortZonalCorrectionTableByZone]');
    },
    btnCopyBands: function () {
        return $('input[id=btnCopyBands]');
    },
    btn11Zones: function () {
        return $('input[id=btn11Zones]');
    },
    btnResetCorrectionFactors: function () {
        return $('input[id=btnResetCorrectionFactors]');
    },
    btnResetCorrectionFactorsToParabCorrection: function () {
        return $('input[id=btnResetCorrectionFactorsToParabCorrection]');
    },
    btnUseAllZones: function () {
        return $('input[id=btnUseAllZones]');
    },
    btnUseNoZones: function () {
        return $('input[id=btnUseNoZones]');
    },
    zonalCorrectionTableBody: function () {
        return $('#zonalCorrectionTableBody');
    },
    zonalErrorsResultsLabel: function () {
        return $('[id=zonalErrorsResultsLabel]');
    },
    zonesTopViewID: function () {
        return $('#zonesTopView')[0];
    },
    zonesTopViewDiv: function () {
        return $('#zonesTopViewDiv');
    },
    zonesSideViewID: function () {
        return $('#zonesSideView')[0];
    },
    zonesSideViewDiv: function () {
        return $('#zonesSideViewDiv');
    },
    btnPasteExampleRonchigram16: function () {
        return $('input[id=btnPasteExampleRonchigram16]');
    },
    btnPasteExampleRonchigram25: function () {
        return $('input[id=btnPasteExampleRonchigram25]');
    },
    btnPasteExampleRonchigram13: function () {
        return $('input[id=btnPasteExampleRonchigram13]');
    },
    btnPasteExampleRonchigram6: function () {
        return $('input[id=btnPasteExampleRonchigram6]');
    },
    btnPasteExampleRonchigramGrid: function () {
        return $('input[id=btnPasteExampleRonchigramGrid]');
    },
    pastedImageActive: function () {
        return $('[name=pastedImageActive]');
    },
    pastedImageActiveIsChecked: function () {
        return this.pastedImageActive()[this.yes].checked;
    },
    pastedImageTransparency: function () {
        return $('[id=pastedImageTransparency]');
    },
    pastedImageWidth: function () {
        return $('[id=pastedImageWidth]');
    },
    pastedImageHeight: function () {
        return $('[id=pastedImageHeight]');
    },
    pastedImageOffsetX: function () {
        return $('[id=pastedImageOffsetX]');
    },
    pastedImageOffsetY: function () {
        return $('[id=pastedImageOffsetY]');
    },
    btnDeletedPastedImage: function () {
        return $('input[id=btnDeletedPastedImage]');
    },
    unwrapBandRuler: function () {
        return $('input[name=unwrapBandRuler]');
    },
    showBullseyeZones: function () {
        return $('input[name=showBullseyeZones]');
    },
    distortionResolutionFactor: function () {
        return $('[name=distortionResolutionFactor]');
    },
    btnDecreaseGratingOffsets2: function () {
        return $('input[id=btnDecreaseGratingOffsets2]');
    },
    pastedImageRonchiCanvas: function () {
        return $('[id=RonchiCanvas0]')[0];
    },
    btnPutData: function () {
        return $('input[id=btnPutData]');
    },
    dataName: function () {
        return $('[name=dataName]');
    },
    btnGetData: function () {
        return $('input[id=btnGetData]');
    },
    btnShowDataNames: function () {
        return $('input[id=btnShowDataNames]');
    },
    btnDeleteData: function () {
        return $('input[id=btnDeleteData]');
    }
};

MLB.ronchi.getWavelengthLight = function () {
    var constants = MLB.ronchi.constants;

    if (constants.btnWavelengthLightUOM()[constants.imperial].checked) {
        return constants.wavelengthLightImperial;
    }
    return constants.wavelengthLightMetric;
};

MLB.ronchi.processPixelArray = function () {
    var constants = MLB.ronchi.constants,
        pixelArray = constants.pixelArray,
        invertBands = constants.invertBands()[constants.yes].checked,
        RonchiTape = constants.RonchiTape()[constants.yes].checked,
        RonchiGrid = constants.RonchiGrid()[constants.yes].checked,
        scaledTapeHeight,
        pixelArrayGrid,
        x,
        y,
        xyLength = pixelArray.length,
        xyLengthSquared = xyLength * xyLength;

    if (!invertBands && !RonchiTape && ! RonchiGrid) {
        return;
    }

    if (RonchiTape) {
        scaledTapeHeight = xyLength / constants.tapeHeight;
    }

    for (x = 0; x < xyLength; x++) {
        for (y = 0; y < xyLength; y++) {
            if (x * x + y * y < xyLengthSquared) {
                if (invertBands) {
                    pixelArray[x][y] = pixelArray[x][y] === 0 ? 1 : 0;
                }
                if (RonchiTape) {
                    // invert if within the tape band
                    if (y < scaledTapeHeight) {
                        pixelArray[x][y] = pixelArray[x][y] === 0 ? 1 : 0;
                    }
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

MLB.ronchi.adjustColorForGrid = function (color) {
    return (255 - color) / 2;
};

MLB.ronchi.setImagePixelsQuadrants = function (imageData, circleCenter, x, y, red, green, blue, opaque) {
    var setPixel = MLB.sharedLib.setPixel;

    setPixel(imageData, circleCenter.x + x, circleCenter.y + y, red, green, blue, opaque);
    setPixel(imageData, circleCenter.x - x, circleCenter.y + y, red, green, blue, opaque);
    setPixel(imageData, circleCenter.x + x, circleCenter.y - y, red, green, blue, opaque);
    setPixel(imageData, circleCenter.x - x, circleCenter.y - y, red, green, blue, opaque);
};

MLB.ronchi.setImagePixels = function (imageData, circleCenter) {
    var constants = MLB.ronchi.constants,
        pixelArray = constants.pixelArray,
        setImagePixelsQuadrants = MLB.ronchi.setImagePixelsQuadrants,
        RonchiGrid = constants.RonchiGrid()[constants.yes].checked,
        bandColorRGB = constants.bandColorRGB().val().split(','),
        red = +bandColorRGB[0],
        green = +bandColorRGB[1],
        blue = +bandColorRGB[2],
        // only need to adjust grid color, not pixel color or pixel background color
        adjustColorForGrid = MLB.ronchi.adjustColorForGrid,
        gridRed = adjustColorForGrid(red),
        gridGreen = adjustColorForGrid(green),
        gridBlue = adjustColorForGrid(blue),
        opaque = constants.opaque,
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

Ronchi band transitions for 1st Ronchigram w/ defaults as above: [0, 0.528, 1.488, 2.352, 3.12, 3.792, 4.368, 4.896, 5.376, 5.808] (length = 10)

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

Ronchi Tape Band values #1: 0, 1.92, 3.46, 4.63, 5.59; Ronchigram #2: 0, 5.23; Ronchigram #3: 0, 2.21; Ronchigram #4: 0, 1.03, 2.09, 3.26, 4.82
and for inverted bands #1: 1.01, 2.74, 4.08, 5.14, 5.9; Ronchigram #2: 4.06, 5.83; Ronchigram #3: 1.06, 4.42; Ronchigram #4: 0.53, 1.56, 2.64, 3.96, 5.66
also use the provided mirror examples along with the Ruler:center

Note that by convention, the band is colored on the mirror's face when the light ray passes through the grating. As a user I want to see the Ronchi Tape marks on the colored bands, which is logically inverted. Accordingly, I use constants.drawRonchiTapeMarksOnColoredBands which is set to true, to control on which bands the tape marks appear.

scaling up the Ronchigram size makes computed values more accurate (catches the edge of the grating lines with more resolution)
*/

MLB.ronchi.createTapeBandsFromTransitions = function (mirrorRadius, transitions) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        drawRonchiTapeMarksOnColoredBands = constants.drawRonchiTapeMarksOnColoredBands,
        invertBands = constants.invertBands()[constants.yes].checked,
        tapeBandDecimalPrecision = constants.tapeBandDecimalPrecision,
        transitionsLength = transitions.length,
        transitionA,
        transitionB,
        ix,
        ixB,
        tapeMarks = [];

    if (invertBands && drawRonchiTapeMarksOnColoredBands || !invertBands && !drawRonchiTapeMarksOnColoredBands) {
        ix = 1;
    } else {
        ix = 2;
        tapeMarks.push(0);
    }
    for ( ; ix < transitionsLength; ix += 2) {
        transitionA = transitions[ix];
        ixB = ix + 1;
        if (ixB < transitionsLength) {
            transitionB = transitions[ixB];
        } else { // finish out last Ronchi band using the mirror's edge
            transitionB = mirrorRadius;
        }
        tapeMarks.push(roundToDecimal((transitionA + transitionB ) / 2, tapeBandDecimalPrecision));
    }
    constants.tapes.push(tapeMarks);
    return tapeMarks;
};

// from algorithm in Sky and Telescope magazine (Apr '91): trace light rays through grating
MLB.ronchi.calcRonchiBands = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, userParabolicCorrection) {
    var constants = MLB.ronchi.constants,
        getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
        mirrorRadius = mirrorDia / 2,
        scaledMirrorRadius,
        scaledMirrorRadiusSquared,
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
        transitions = [],
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
            // save transitions to calculate Ronchi Tape Band locations
            if (y === 0) { // only use the first row to calculate the tape bands
                if (band !== lastBand) {
                    lastBand = band;
                    transitions.push(x / scalingFactor);
                }
            }
        }
    }
    constants.pixelArray = pixelArray;
    return transitions;
};

MLB.ronchi.drawRonchigramOnCanvas = function (canvas, gratingOffset, userParabolicCorrection) {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        centralObstruction = +constants.centralObstruction().val(),
        gratingFreq = +constants.gratingFreq().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        setImageDataToBackgroundBandColor = MLB.ronchi.setImageDataToBackgroundBandColor,
        point = MLB.sharedLib.point,
        drawCircle = MLB.sharedLib.drawCircle,
        fillCircle = MLB.sharedLib.fillCircle,
        scalingFactor,
        ronchiCenter,
        context,
        imageData,
        mirrorRadius,
        scaledMirrorRadius,
        transitions,
        tapeMarks,
        calcRonchiBands = MLB.ronchi.calcRonchiBands,
        createTapeBandsFromTransitions = MLB.ronchi.createTapeBandsFromTransitions,
        processPixelArray = MLB.ronchi.processPixelArray,
        setImagePixels = MLB.ronchi.setImagePixels,
        drawRulers = MLB.ronchi.drawRulers,
        noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection;

    context = canvas.getContext("2d");

    scalingFactor = RonchigramSize / mirrorDia;
    mirrorRadius = mirrorDia / 2;
    scaledMirrorRadius = mirrorRadius * scalingFactor;
    ronchiCenter = point(canvas.width / 2, canvas.height / 2);

    // create a new pixel array
    imageData = context.createImageData(canvas.width, canvas.height);
    setImageDataToBackgroundBandColor(imageData, canvas.width, canvas.height);
    transitions = calcRonchiBands(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, userParabolicCorrection);
    constants.transitions.push(transitions);
    tapeMarks = createTapeBandsFromTransitions(mirrorRadius, transitions);
    processPixelArray();
    setImagePixels(imageData, ronchiCenter);

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // now draw the circle that outlines mirror's aperture in the Ronchigram
    drawCircle(context, ronchiCenter, scaledMirrorRadius, 1, constants.blackColor);
    // fill in any central obstruction
    fillCircle(context, ronchiCenter, scalingFactor * centralObstruction / 2, constants.blackColor);
    // draw circular rulers if any
    drawRulers(context, ronchiCenter, mirrorRadius, scalingFactor, tapeMarks);
    // note if parabolic correction != 1
    noteParabolicCorrection(context, ronchiCenter.x);
};

// study to ascertain how 'vertical' is the unwrap Ronchigram
MLB.ronchi.calcUnwrapVerticalStdDeviation = function () {
    var constants = MLB.ronchi.constants,
        int = MLB.sharedLib.int,
        canvasSize = constants.canvasSize(),
        canvasMidPt = int(canvasSize / 2),
        RonchigramSize = +constants.RonchigramSize().val(),
        canvas,
        context,
        imageData,
        mirrorRadius,
        mirrorRadiusSquared,
        yIx,
        xIx,
        yFromCenter,
        xFromCenter,
        imgIx,
        red,
        green,
        blue,
        data = [],
        cIx,
        sumDeviationSquared,
        deviation,
        deviationSquared,
        stdDeviation,
        totalStdDeviation = 0;

    canvas = $('[id=RonchiCanvas' + (MLB.ronchi.constants.RonchigramCount-1) + ']')[0];
    context = canvas.getContext('2d');
    imageData = context.getImageData(0, 0, canvasSize, canvasSize).data;

    mirrorRadius = RonchigramSize / 2;
    mirrorRadiusSquared = mirrorRadius * mirrorRadius;

    // go from left to right, calculating each column (y) in turn
    for (xIx = 0; xIx < canvasSize; xIx += 1) {
        xFromCenter = canvasMidPt - xIx;

        if (xFromCenter * xFromCenter > mirrorRadiusSquared) {
            continue;
        }
        for (yIx = 0; yIx < canvasSize; yIx += 1) {
            yFromCenter = canvasMidPt - yIx;

            if (xFromCenter * xFromCenter + yFromCenter * yFromCenter > mirrorRadiusSquared) {
                continue;
            }
            if (data[xIx] === undefined) {
                data[xIx] = [];
                data[xIx].count = 0;
            }
            imgIx = (xIx + yIx * canvasSize) * 4;
            red = imageData[imgIx];
            green = imageData[imgIx + 1];
            blue = imageData[imgIx + 2];

            data[xIx].count += 1;
            if (data[xIx].reds === undefined) {
                data[xIx].reds = [];
                data[xIx].greens = [];
                data[xIx].blues = [];
                data[xIx].redTotal = 0;
                data[xIx].greenTotal = 0;
                data[xIx].blueTotal = 0;
            }
            data[xIx].reds.push(red);
            data[xIx].greens.push(green);
            data[xIx].blues.push(blue);
            data[xIx].redTotal += red;
            data[xIx].greenTotal += green;
            data[xIx].blueTotal += blue;
        }
        data[xIx].redAvg = data[xIx].redTotal / data[xIx].count;
        data[xIx].greenAvg = data[xIx].greenTotal / data[xIx].count;
        data[xIx].blueAvg = data[xIx].blueTotal / data[xIx].count;

        sumDeviationSquared = 0;
        for (cIx = 0; cIx < data[xIx].count; cIx += 1) {
            deviation = data[xIx].reds[cIx] - data[xIx].redAvg;
            deviationSquared = deviation * deviation;
            sumDeviationSquared += deviationSquared;
        }
        stdDeviation = Math.sqrt(sumDeviationSquared / data[xIx].count);
        data[xIx].redStdDeviation = stdDeviation;

        sumDeviationSquared = 0;
        for (cIx = 0; cIx < data[xIx].count; cIx += 1) {
            deviation = data[xIx].greens[cIx] - data[xIx].greenAvg;
            deviationSquared = deviation * deviation;
            sumDeviationSquared += deviationSquared;
        }
        stdDeviation = Math.sqrt(sumDeviationSquared / data[xIx].count);
        data[xIx].greenStdDeviation = stdDeviation;

        sumDeviationSquared = 0;
        for (cIx = 0; cIx < data[xIx].count; cIx += 1) {
            deviation = data[xIx].blues[cIx] - data[xIx].blueAvg;
            deviationSquared = deviation * deviation;
            sumDeviationSquared += deviationSquared;
        }
        stdDeviation = Math.sqrt(sumDeviationSquared / data[xIx].count);
        data[xIx].blueStdDeviation = stdDeviation;

        // how to weigh the columns against each other?
        //totalStdDeviation += (data[xIx].redStdDeviation + data[xIx].greenStdDeviation + data[xIx].blueStdDeviation) * data[xIx].count;
        //totalStdDeviation += data[xIx].redStdDeviation + data[xIx].greenStdDeviation + data[xIx].blueStdDeviation;
        // only include columns that are substantially as tall as the central columns
        if (data[xIx].count * data[xIx].count > mirrorRadiusSquared * 3 / 4) {
            totalStdDeviation += data[xIx].redStdDeviation + data[xIx].greenStdDeviation + data[xIx].blueStdDeviation;
        }
    }

    constants.waveErrorsLabel().html('Unwrap straightness standard deviation (lower is straighter) is ' + int(totalStdDeviation));
};

MLB.ronchi.noteParabolicCorrection = function (context, ronchiCenterX) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        parabCorr = +constants.userParabolicCorrection().val(),
        txt;

    context.fillStyle = constants.rulerTextColor;
    context.font = constants.fontSize + constants.fontLit;
    txt = constants.parabCorrLit + roundToDecimal(parabCorr, constants.parabolicCorrectionDisplayPrecision);
    context.fillText(txt, ronchiCenterX * 1.44, constants.fontSize);
};

MLB.ronchi.drawRulers = function (context, RonchiCenter, mirrorRadius, scalingFactor, tapeMarks) {
    var constants = MLB.ronchi.constants,
        drawCircle = MLB.sharedLib.drawCircle,
        drawLine = MLB.sharedLib.drawLine,
        point = MLB.sharedLib.point,
        RonchiGrid = constants.RonchiGrid()[constants.yes].checked,
        ix,
        upperY,
        lowerY,
        leftX,
        rightX,
        scaledTapeHeight,
        uomIncrement,
        scaledMirrorRadius = mirrorRadius * scalingFactor,
        tapeMarksLength;

    if (constants.drawZonalRuler()) {
        for (ix = 1; ix < constants.numZonalRulers; ix++) {
            drawCircle(context, RonchiCenter, scaledMirrorRadius * ix / constants.numZonalRulers, constants.rulerThickness, constants.rulerTextColor);
        }

    } else if (constants.drawZonal10Ruler()) {
        for (ix = 1; ix < 10; ix++) {
            drawCircle(context, RonchiCenter, scaledMirrorRadius * ix / 10, constants.rulerThickness, constants.rulerTextColor);
        }

    } else if (constants.drawUomCenterRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(mirrorRadius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorRadius; ix += uomIncrement) {
            drawCircle(context, RonchiCenter, scalingFactor * ix, constants.rulerThickness, constants.rulerTextColor);
        }

    } else if (constants.drawUomEdgeRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(mirrorRadius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorRadius; ix += uomIncrement) {
            drawCircle(context, RonchiCenter, scaledMirrorRadius - scalingFactor * ix, constants.rulerThickness, constants.rulerTextColor);
        }

    } else if (constants.drawRonchiTapeMarksRuler() && tapeMarks) {
        tapeMarksLength = tapeMarks.length;
        scaledTapeHeight = scaledMirrorRadius / constants.tapeHeight;

        drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(RonchiCenter.x - scaledMirrorRadius, RonchiCenter.y), point(RonchiCenter.x + scaledMirrorRadius, RonchiCenter.y));

        upperY = RonchiCenter.y + scaledTapeHeight;
        lowerY = RonchiCenter.y - scaledTapeHeight;
        for (ix = 0; ix < tapeMarksLength; ix++) {
            leftX = RonchiCenter.x - tapeMarks[ix] * scalingFactor;
            rightX = RonchiCenter.x + tapeMarks[ix] * scalingFactor;
            drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(leftX, upperY), point(leftX, lowerY));
            drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(rightX, upperY), point(rightX, lowerY));
        }
        if (RonchiGrid) {
            drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(RonchiCenter.x, RonchiCenter.y - scaledMirrorRadius), point(RonchiCenter.x, RonchiCenter.y + scaledMirrorRadius));

            leftX = RonchiCenter.x + scaledTapeHeight;
            rightX = RonchiCenter.x - scaledTapeHeight;
            for (ix = 0; ix < tapeMarksLength; ix++) {
                lowerY = RonchiCenter.y - tapeMarks[ix] * scalingFactor;
                upperY = RonchiCenter.y + tapeMarks[ix] * scalingFactor;
                drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(leftX, upperY), point(rightX, upperY));
                drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(leftX, lowerY), point(rightX, lowerY));
            }
        }
    }
};

MLB.ronchi.decodeGratingOffsetSeries = function () {
    var constants = MLB.ronchi.constants;

    return constants.gratingOffsetSeries().val().split(',').map(Number);
};

MLB.ronchi.loadPastedImageIntoCanvas = function (canvas, image) {
    var constants = MLB.ronchi.constants,
        context = canvas.getContext("2d");

    context.globalAlpha = +constants.pastedImageTransparency().val();
    context.drawImage(image, +constants.pastedImageOffsetX().val(), +constants.pastedImageOffsetY().val(), +constants.pastedImageWidth().val(), +constants.pastedImageHeight().val());
};

MLB.ronchi.plotRonchigramsCalcRonchiTape = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        bandColorRGB = constants.bandColorRGB().val().split(','),
        red = +bandColorRGB[0],
        green = +bandColorRGB[1],
        blue = +bandColorRGB[2],
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        inchesToWavesGreenLight = MLB.calcLib.inchesToWavesGreenLight,
        mirrorDia,
        radiusOfCurvature,
        focalRatio,
        userParabolicCorrection,
        wavesCorrection,
        ix,
        matchingTapeBandStr,
        drawRonchigramOnCanvas = MLB.ronchi.drawRonchigramOnCanvas,
        canvasSize = constants.canvasSize(),
        decodeGratingOffsetSeries = MLB.ronchi.decodeGratingOffsetSeries,
        gratingOffsetSeriesValues = decodeGratingOffsetSeries(),
        gratingOffsetSeriesValuesLength = gratingOffsetSeriesValues.length,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas;

    if (isNaN(red) || isNaN(green) || isNaN(blue) || red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
        alert("Band color of '" + bandColorRGB + "' not properly entered. Please correct and try again.");
        return;
    }

    mirrorDia = +constants.mirrorDia().val();
    radiusOfCurvature = +constants.radiusOfCurvature().val();
    focalRatio = +constants.focalRatio().val();
    userParabolicCorrection = +constants.userParabolicCorrection().val();

    wavesCorrection = inchesToWavesGreenLight(calcSphereParabolaDifference(mirrorDia, focalRatio));
    constants.waveNotes().html(roundToDecimal(wavesCorrection, constants.wavesDecimalPrecision)
            + " waves correction fitting paraboloid to spheroid at edge or center; "
            + roundToDecimal(wavesCorrection / 4, constants.wavesDecimalPrecision)
            + " waves best fit minimum paraboloidal deviation at 71% zone; "
            + roundToDecimal(wavesCorrection * userParabolicCorrection, constants.wavesDecimalPrecision)
            + " waves for parabolic correction factor entered above."
    );

    // reset the Ronchi tapes
    constants.tapes = [];
    constants.transitions = [];

    // build canvases for Ronchigrams...
    // start by 'zeroing out' the html
    constants.Ronchigrams().html('');
    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        constants.Ronchigrams().append("<canvas id='RonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas> &emsp;");
        drawRonchigramOnCanvas($('[id=RonchiCanvas' + ix + ']')[0], gratingOffsetSeriesValues[ix], userParabolicCorrection);
    }
    constants.RonchigramCount = ix;
    // load pasted image into first Ronchigram
    if (constants.pastedImageActiveIsChecked() && constants.images[constants.pastedImageLit] !== undefined) {
        loadPastedImageIntoCanvas(constants.pastedImageRonchiCanvas(), constants.images[constants.pastedImageLit]);
    }
    // display the tapes
    matchingTapeBandStr = '<p>The Ronchi bands cross the center at radii: ';
    constants.tapes.forEach(function (tape, ix) {
        matchingTapeBandStr += 'Ronchigram <b>#' + (ix + 1) + ': ' + tape.join(', ') + '</b>; ';
    });
    // remove that last '; '
    matchingTapeBandStr = matchingTapeBandStr.slice(0, -2);
    matchingTapeBandStr += '. See the <a href="#MatchingRonchiTape">Ronchi Tape Band discussion</a>.';
    constants.matchingRonchiTapeBands().html(matchingTapeBandStr);
};

// for outside use eg in a spreadsheet
// y is the y axis value, eg, horizontal line through mirror's center is 0
MLB.ronchi.stringifyRonchigramDistortions = function (y) {
    var constants = MLB.ronchi.constants,
        RGD = constants.RonchigramDistortions,
        xs = RGD[y],
        s = '';

    xs.forEach(x => s += x.sphere + ', ' + x.parabola + ', ' + x.distortion + ';');

    return s;
};

MLB.ronchi.getAndFixDistortionResolutionFactor = function () {
    var constants = MLB.ronchi.constants,
        DRF = +constants.distortionResolutionFactor().val();

    if (DRF === 0) {
        DRF = 2;
        constants.distortionResolutionFactor().val('2');
    }
    return DRF;
};

MLB.ronchi.adjustRonchigramDivDiscussionDivWidths = function () {
    var constants = MLB.ronchi.constants,
        borderSize = +constants.borderSize().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        RonchigramAndBorderSize = RonchigramSize + borderSize * 2,
        RonchigramCount = constants.RonchigramCount,
        divWidth;

    divWidth = RonchigramCount * (RonchigramAndBorderSize + 40);

    constants.Ronchigrams().width(divWidth);
    constants.discussionDiv().width(screen.width - divWidth - 40);
};

MLB.ronchi.adjustZonalErrorsNotesDiv = function () {
    var constants = MLB.ronchi.constants;

    constants.zonalErrorsNotesDiv().width(Math.floor(screen.width - constants.zonalErrorsTableDiv().width() - constants.zonalErrorsViewDiv().width() - 100));
};

MLB.ronchi.calcRonchigramDistortions = function () {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        gratingFreq = +constants.gratingFreq().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        DRF = MLB.ronchi.getAndFixDistortionResolutionFactor(),
        int = MLB.sharedLib.int,
        decodeGratingOffsetSeries = MLB.ronchi.decodeGratingOffsetSeries,
        getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
        mirrorRadius = mirrorDia / 2,
        gratingOffset,
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
        RGD = [];

    gratingOffset = decodeGratingOffsetSeries()[0];

    // eg, 2 means that the RonchigramDistortions array is twice the size in x and twice the size in y for an area increase of 4x of the RonchigramSize;
    // this to fill in the voids that occur while unwrapping the Ronchigram
    scalingFactor = RonchigramSize / mirrorDia * DRF;
    scaledMirrorRadius = int(mirrorRadius * scalingFactor);
    scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
    scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
    scaledGratingOffset = gratingOffset * scalingFactor;
    scaledLineWidth = scalingFactor / (2 * gratingFreq);

    // calculate just one quadrant that later can be applied to the other three quadrants
    for (y = 0; y < scaledMirrorRadius; y++) {
        ySquared = y * y;
        RGD[y] = [];
        for (x = 0; x < scaledMirrorRadius; x++) {
            scaledMirrorZoneSquared = ySquared + x * x;
            if (scaledMirrorZoneSquared > scaledMirrorRadiusSquared) {
                break; // done with 'x' for loop
            }
            scaledMirrorZone = Math.sqrt(scaledMirrorZoneSquared);
            userErrorCorrectionFactor = getInterpolatedCorrection(scaledMirrorZone / scaledMirrorRadius);
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
        }
    }
    constants.RonchigramDistortions = RGD;
    return RGD;
};

MLB.ronchi.unwrapFirstRonchigram = function () {
    var constants = MLB.ronchi.constants,
        canvasSize = constants.canvasSize(),
        unwrapRonchigramIx = constants.RonchigramCount,
        unwrapBandRuler = constants.unwrapBandRuler()[constants.yes].checked,
        showBullseyeZones = constants.showBullseyeZones()[constants.yes].checked,
        DRF = MLB.ronchi.getAndFixDistortionResolutionFactor(),
        int = MLB.sharedLib.int,
        point = MLB.sharedLib.point,
        unwrapSetPixel = MLB.ronchi.unwrapSetPixel,
        setImageDataToBackgroundBandColor = MLB.ronchi.setImageDataToBackgroundBandColor,
        calcRonchigramDistortions = MLB.ronchi.calcRonchigramDistortions,
        drawUnwrapBandRuler = MLB.ronchi.drawUnwrapBandRuler,
        unwrapCanvas,
        unwrapContext,
        unwrapImageData,
        pastedImageContext,
        origImg,
        origRonchiCenter,
        unwrapRonchiCenter,
        RGD,
        distortionLength,
        distortion,
        dx,
        maxDistortion,
        maxX = 0,
        distortionDRXSet = [],
        distortionNewCount = 0,
        distortionAlreadySetCount = 0,
        scaleUnwrapRonchigram = MLB.ronchi.scaleUnwrapRonchigram,
        noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection;

    RGD = calcRonchigramDistortions();
    distortionLength = RGD[0].length;
    maxDistortion = 0;
    for (dx = 0; dx < distortionLength; dx++) {
        distortion = RGD[0][dx].distortion;
        if (distortion > maxDistortion) {
            maxDistortion = distortion;
        }
    }

    // canvasSize is size of first Ronchigram
    origRonchiCenter = point(canvasSize / 2, canvasSize / 2);

    constants.Ronchigrams().append("&emsp; <canvas id='RonchiCanvas" + unwrapRonchigramIx + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
    unwrapCanvas = $('[id=RonchiCanvas' + unwrapRonchigramIx + ']')[0];
    unwrapContext = unwrapCanvas.getContext("2d"); // or .getContext("2d", {willReadFrequently: true});
    unwrapImageData = unwrapContext.createImageData(unwrapCanvas.width, unwrapCanvas.height);
    setImageDataToBackgroundBandColor(unwrapImageData, unwrapCanvas.width, unwrapCanvas.height);
    unwrapRonchiCenter = point(unwrapCanvas.width / 2, unwrapCanvas.height / 2);

    /* apply the calculated ideal distortion quadrant to each original Ronchigram quadrant, filling in gaps;
       distortion calculated in calcRonchiBands() by comparing the parabolic ray height at the offset grating to the spherical ray height
       while we have the x,y distortion, get the original image x,y pixels from each quadrant and apply the distortion to get the new unwrapped x,y pixels;
       start at the originating Ronchigram center, working outward horizontally and vertically, +-x,+-y for each quadrant as needed;
      */

    // make one call to pastedImageContext() as Firefox is impossibly slow otherwise (~1 minute to make pastedImageContext() on individual x,u basis)
    pastedImageContext = constants.pastedImageRonchiCanvas().getContext("2d");
    origImg = pastedImageContext.getImageData(0, 0, canvasSize, canvasSize).data;

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
                yIx,xIx: 0,0   = NaN
                         0,1   = 0.577
                         0,124 = 1
                         62,1  = 0.683
                         62,108= 1.004
                         120,35= 1.007
                16F2.9 inside RoC example, distortionRatio at:
                         0,1   = 0.126 (distortion = 1.0000195706001; distortion varies from ~1 to ~8; maxDistortion = 7.969608521281272 which occurs on final 'x')
                25F2.6 outside RoC example ,distortionRatio at:
                         0,1   = 1 (distortion = 0.999995100864859; distortion varies from ~1 to ~0.23; maxDistortion = 0.999995100864859 which occurs on initial 'x'; parabola varies from 0 to 4.37883185253084, with max of 8.41948051098935 @ row of 263 out of 400)
            */
            distortion = RGDx.distortion;
            distortionRatio = Math.abs(distortion / maxDistortion);

            distortionOffsetY = int(yIx * distortionRatio); // adjust for any scaling here...
            distortionOffsetX = int(xIx * distortionRatio); // adjust for any scaling here...

            // set MaxX for scaling later
            if (distortionOffsetX > maxX) {
                maxX = distortionOffsetX;
            }

            // DRF = distortion resolution factor: need more resolution in the distortion array compared to the Ronchigram so that, when the Ronchigram is unwrapped, there are no gaps in the displayed pixels
            yIx_DRF = yIx / DRF;
            xIx_DRF = xIx / DRF;
            distortionOffsetY_DRF = distortionOffsetY / DRF;
            distortionOffsetX_DRF = distortionOffsetX / DRF;

            if (!showBullseyeZones) {
                // don't repeat already set pixels (can cause a shift of a pixel or so in the final unwrapped Ronchigram)
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
            unwrapSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, unwrapRonchiCenter, unwrapImageData, origImg);
            // upper right quadrant
            xDir = 1;
            yDir = -1;
            unwrapSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, unwrapRonchiCenter, unwrapImageData, origImg);
            // upper left quadrant
            xDir = -1;
            yDir = -1;
            unwrapSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, unwrapRonchiCenter, unwrapImageData, origImg);
            // lower left quadrant
            xDir = -1;
            yDir = 1;
            unwrapSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, unwrapRonchiCenter, unwrapImageData, origImg);
        });
    });

    //console.log('distortions already set ' + distortionAlreadySetCount + '; new distortions ' + distortionNewCount);

    unwrapContext.putImageData(unwrapImageData, 0, 0);

    // draw rulers...

    if (unwrapBandRuler) {
        drawUnwrapBandRuler(unwrapCanvas, unwrapContext, unwrapRonchiCenter, RGD, DRF, maxDistortion);
    }

    scaleUnwrapRonchigram(distortionLength, maxX, canvasSize, unwrapContext);

    // note if parabolic correction != 1
    noteParabolicCorrection(unwrapContext, origRonchiCenter.x);
    // relies on context fillStyle and font being set
    unwrapContext.fillText(constants.unwrapLit, 2, constants.fontSize);

    constants.RonchigramCount++;
};

MLB.ronchi.scaleUnwrapRonchigram = function (distortionLength, maxX, canvasSize, unwrapContext) {
    var scaleImageData = MLB.sharedLib.scaleImageData,
        scalingFactor,
        cornerOffsetXY;

    // scaling needed to maintain unwrapped Ronchigram size when outside RoC with looping: the loops wrap back on themselves, reducing the max Ronchigram width/height;
    // scaling here reduces resolution but is easier and faster; could scale earlier during the parabolic distortion calculations but that means many more calcs et al;
    scalingFactor = distortionLength / maxX;
    // maxX is 0 for RoC offset of 0
    if (maxX !== 0 && scalingFactor > 1) {
        cornerOffsetXY = canvasSize * (scalingFactor - 1) / 2;
        unwrapContext.putImageData(scaleImageData(unwrapContext.getImageData(0, 0, canvasSize, canvasSize), scalingFactor), -cornerOffsetXY, -cornerOffsetXY);
    }

};

MLB.ronchi.drawUnwrapBandRuler = function (unwrapCanvas, unwrapContext, unwrapRonchiCenter, RGD, DRF, maxDistortion) {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        int = MLB.sharedLib.int,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        tapeBandRelativeX,
        maxIx,
        wrappedIx,
        distortion,
        distortionRatio,
        //s = '',
        unwrapIx,
        unwrapIxStretch;

    //constants.tapes set in createTapeBandsFromTransitions(), called from drawRonchigramOnCanvas(), called from plotRonchigramsCalcRonchiTape()
    constants.tapes[0].forEach(t => {
        tapeBandRelativeX = t / mirrorDia * 2;
        // eg, 125
        maxIx = RGD[0].length;
        wrappedIx = int(tapeBandRelativeX * maxIx); // not + 0.5 which results in wrong wrappedIx
        distortion = RGD[0][wrappedIx].distortion;
        distortionRatio = Math.abs(distortion / maxDistortion);
        unwrapIx = int(wrappedIx * distortionRatio / DRF + 0.5);
        unwrapIxStretch = int(wrappedIx * distortionRatio / DRF + 0.5);
        // vertical ruler
        drawLine(unwrapContext, constants.rulerTextColor, constants.unwrapRulerThickness, point(unwrapRonchiCenter.x + unwrapIxStretch, 0), point(unwrapRonchiCenter.x + unwrapIxStretch, unwrapCanvas.height));
        drawLine(unwrapContext, constants.rulerTextColor, constants.unwrapRulerThickness, point(unwrapRonchiCenter.x - unwrapIxStretch, 0), point(unwrapRonchiCenter.x - unwrapIxStretch, unwrapCanvas.height));
        // horizontal ruler
        drawLine(unwrapContext, constants.rulerTextColor, constants.unwrapRulerThickness, point(0, unwrapRonchiCenter.y + unwrapIx), point(unwrapCanvas.width, unwrapRonchiCenter.y + unwrapIx));
        drawLine(unwrapContext, constants.rulerTextColor, constants.unwrapRulerThickness, point(0, unwrapRonchiCenter.y - unwrapIx), point(unwrapCanvas.width, unwrapRonchiCenter.y - unwrapIx));
        /*
        s += 'tapeBandRelativeX: ' + tapeBandRelativeX
            + ', wrappedIx: ' + wrappedIx
            + ', distortion: ' + distortion
            + ', distortionRatio: ' + distortionRatio
            + ', unwrapIx: ' + unwrapIx
            + ', unwrapIxStretch: ' + unwrapIxStretch
            + '\n';
        */
    });
    //console.log(s);
    /* default example:
        tapeBandRelativeX: 0, wrappedIx: 0, distortion: NaN, distortionRatio: NaN, unwrapIx: 0, unwrapIxStretch: 0
        tapeBandRelativeX: 0.4366666666666667, wrappedIx: 109, distortion: 1.1420292620135208, distortionRatio: 0.656452788320534, unwrapIx: 36, unwrapIxStretch: 36
        tapeBandRelativeX: 0.7233333333333333, wrappedIx: 180, distortion: 1.3870024448314904, distortionRatio: 0.7972664559502765, unwrapIx: 72, unwrapIxStretch: 72
        tapeBandRelativeX: 0.9233333333333333, wrappedIx: 230, distortion: 1.6313480674892065, distortionRatio: 0.9377193941042165, unwrapIx: 108, unwrapIxStretch: 108
       set FR to 3 and grating offset to 0.36 for outside of RoC:
        tapeBandRelativeX: 0, wrappedIx: 0, distortion: NaN, distortionRatio: NaN, unwrapIx: 0, unwrapIxStretch: 0
        tapeBandRelativeX: 0.17166666666666666, wrappedIx: 42, distortion: 0.9802078792556594, distortionRatio: 0.9802188794885313, unwrapIx: 21, unwrapIxStretch: 21
        tapeBandRelativeX: 0.37666666666666665, wrappedIx: 94, distortion: 0.9009377016076294, distortionRatio: 0.9009478122430675, unwrapIx: 42, unwrapIxStretch: 42
        tapeBandRelativeX: 0.6966666666666667, wrappedIx: 174, distortion: 0.6613751340490557, distortionRatio: 0.6613825562302523, unwrapIx: 58, unwrapIxStretch: 58
        tapeBandRelativeX: 0.9633333333333334, wrappedIx: 240, distortion: 0.3577106518283049, distortionRatio: 0.3577146661813356, unwrapIx: 43, unwrapIxStretch: 43 <= note the wrap around (should match with the 3rd band's 42)
    */
};

MLB.ronchi.unwrapSetPixel = function (yIx, xIx, yDir, xDir, distortionOffsetY, distortionOffsetX, origRonchiCenter, unwrapRonchiCenter, unwrapImageData, origImg) {
    var setPixel = MLB.sharedLib.setPixel,
        int = MLB.sharedLib.int,
        origY = int(origRonchiCenter.y + yIx * yDir),
        origX = int(origRonchiCenter.x + xIx * xDir),
        origCanvasWidth = origRonchiCenter.x * 2,
        origIx = (origY * origCanvasWidth + origX) * 4,
        newY = int(unwrapRonchiCenter.y + distortionOffsetY * yDir),
        newX = int(unwrapRonchiCenter.x + distortionOffsetX * xDir);

    setPixel(unwrapImageData, newX, newY, origImg[origIx], origImg[origIx + 1], origImg[origIx + 2], origImg[origIx + 3]);
};

MLB.ronchi.setImageDataToBackgroundBandColor = function (imageData, width, height) {
    var constants = MLB.ronchi.constants,
        backgroundBandColorRGB = constants.backgroundBandColorRGB().val().split(','),
        backgroundRed = +backgroundBandColorRGB[0],
        backgroundGreen = +backgroundBandColorRGB[1],
        backgroundBlue = +backgroundBandColorRGB[2],
        opaque = constants.opaque,
        setPixel = MLB.sharedLib.setPixel,
        x,
        y;

    for(x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            setPixel(imageData, x, y, backgroundRed, backgroundGreen, backgroundBlue, opaque);
        }
    }
};

MLB.ronchi.setGratingOffsetsFromOffset = function (offset) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        decodeGratingOffsetSeries = MLB.ronchi.decodeGratingOffsetSeries,
        gratingOffsetSeries = constants.gratingOffsetSeries,
        gratingOffsetSeriesValues,
        gratingOffsetSeriesValuesLength,
        ix,
        newGratingOffsetValue,
        gratingOffsetSeriesString = '';

    gratingOffsetSeriesValues = decodeGratingOffsetSeries();
    gratingOffsetSeriesValuesLength = gratingOffsetSeriesValues.length;

    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        newGratingOffsetValue = roundToDecimal(gratingOffsetSeriesValues[ix] + offset, constants.gratingOffsetDecimalPrecision);
        gratingOffsetSeriesString += newGratingOffsetValue;
        if (ix < gratingOffsetSeriesValuesLength - 1) {
            gratingOffsetSeriesString += ', ';
        }
    }
    gratingOffsetSeries().val(gratingOffsetSeriesString);
};

MLB.ronchi.setGratingOffsetsFromSliderOffset = function () {
    var constants = MLB.ronchi.constants,
        setGratingOffsetsFromOffset = MLB.ronchi.setGratingOffsetsFromOffset,
        sliderOffsetValue;

    if (!constants.sliderOffsetMousedown) {
        return;
    }

    sliderOffsetValue = parseFloat(constants.sliderOffset().val());
    setGratingOffsetsFromOffset(sliderOffsetValue - constants.lastSliderOffsetValue);
    constants.lastSliderOffsetValue = sliderOffsetValue;
};

MLB.ronchi.setParabolicCorrectionFromSliderParabolicCorrection = function () {
    var constants = MLB.ronchi.constants,
        sliderValue;

    if (!constants.sliderParabolicCorrectionMousedown) {
        return;
    }
    sliderValue = parseFloat(constants.sliderParabolicCorrection().val());
    constants.userParabolicCorrection().val(sliderValue);
};

MLB.ronchi.saveCanvasImage = function (canvas) {
    var constants = MLB.ronchi.constants,
        borderSize = +constants.borderSize().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        context = canvas.getContext("2d");

    constants.images[canvas.id] = context.getImageData(borderSize, borderSize, RonchigramSize, RonchigramSize);
};

MLB.ronchi.savePastedImage = function (image) {
    var constants = MLB.ronchi.constants;

    constants.images[constants.pastedImageLit] = image;
};

MLB.ronchi.setPastedImageDefaults = function () {
    var constants = MLB.ronchi.constants,
        canvasSize = constants.canvasSize();

    constants.pastedImageHeight().val(canvasSize);
    constants.pastedImageWidth().val(canvasSize);
    constants.pastedImageOffsetX().val(0);
    constants.pastedImageOffsetY().val(0);
};

MLB.ronchi.setPastedImageActive = function () {
    var constants = MLB.ronchi.constants;

    constants.pastedImageActive()[constants.yes].checked = true;
};

MLB.ronchi.setPastedImageInactive = function () {
    var constants = MLB.ronchi.constants;

    constants.pastedImageActive()[constants.no].checked = true;
};

MLB.ronchi.loadPastedImage = function (e) {
    var constants = MLB.ronchi.constants,
        saveCanvasImage = MLB.ronchi.saveCanvasImage,
        savePastedImage = MLB.ronchi.savePastedImage,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        setPastedImageDefaults = MLB.ronchi.setPastedImageDefaults,
        setPastedImageActive = MLB.ronchi.setPastedImageActive,
        godProcess = MLB.ronchi.godProcess,
        canvas = constants.pastedImageRonchiCanvas();

    saveCanvasImage(canvas);
    savePastedImage(e.target);
    loadPastedImageIntoCanvas(canvas, e.target);
    setPastedImageDefaults();
    setPastedImageActive();

    godProcess();
};

MLB.ronchi.copyClipboardImage = function (e) {
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

MLB.ronchi.setDropEffectToCopy = function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
};

MLB.ronchi.dragAndDropImage = function (e) {
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

MLB.ronchi.deleteImage = function () {
    var constants = MLB.ronchi.constants,
        godProcess = MLB.ronchi.godProcess,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive;

    constants.images = {};
    godProcess();
    setPastedImageInactive();
};

MLB.ronchi.pasteExampleRonchigram = function (exampleImage) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        savePastedImage = MLB.ronchi.savePastedImage,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        setPastedImageActive = MLB.ronchi.setPastedImageActive,
        copyBandPositionsToErrorTable = MLB.ronchi.copyBandPositionsToErrorTable,
        resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors,
        godProcess = MLB.ronchi.godProcess,
        canvas = constants.pastedImageRonchiCanvas(),
        image = new Image(),
        mirrorDia,
        RoC,
        ix = 0,
        imgSrc,
        scrollToTop = MLB.ronchi.scrollToTop;

    mirrorDia = exampleImage[ix];
    constants.mirrorDia().val(mirrorDia);
    ix++;

    RoC = exampleImage[ix];
    constants.radiusOfCurvature().val(RoC);
    constants.focalLength().val(roundToDecimal(RoC / 2, 2));
    constants.focalRatio().val(roundToDecimal(RoC / mirrorDia / 2, 2));
    ix++;

    constants.centralObstruction().val(exampleImage[ix++]);
    constants.gratingFreq().val(exampleImage[ix++]);
    constants.gratingOffsetSeries().val(exampleImage[ix++]);
    constants.userParabolicCorrection().val(exampleImage[ix++]);
    constants.RonchigramSize().val(exampleImage[ix++]);
    constants.borderSize().val(exampleImage[ix++]);

    constants.invertBands()[constants.yes].checked = exampleImage[ix++];
    constants.invertBands()[constants.no].checked = !constants.invertBands()[constants.yes].checked;

    constants.RonchiTape()[constants.yes].checked = exampleImage[ix++];
    constants.RonchiTape()[constants.no].checked = !constants.RonchiTape()[constants.yes].checked;

    constants.RonchiGrid()[constants.yes].checked = exampleImage[ix++];
    constants.RonchiGrid()[constants.no].checked = !constants.RonchiGrid()[constants.yes].checked;

    constants.pastedImageTransparency().val(exampleImage[ix++]);
    constants.pastedImageWidth().val(exampleImage[ix++]);
    constants.pastedImageHeight().val(exampleImage[ix++]);
    constants.pastedImageOffsetX().val(exampleImage[ix++]);
    constants.pastedImageOffsetY().val(exampleImage[ix++]);

    imgSrc = exampleImage[ix++];

    constants.distortionResolutionFactor().val(exampleImage[ix++]);

    constants.unwrapBandRuler()[constants.yes].checked = exampleImage[ix++];
    constants.unwrapBandRuler()[constants.no].checked = !constants.unwrapBandRuler()[constants.yes].checked;

    constants.showBullseyeZones()[constants.yes].checked = exampleImage[ix++];
    constants.showBullseyeZones()[constants.no].checked = !constants.showBullseyeZones()[constants.yes].checked;

    image.onload = function (e) {
        savePastedImage(e.target);
        loadPastedImageIntoCanvas(canvas, e.target);
        setPastedImageActive();
        copyBandPositionsToErrorTable();
        resetCorrectionFactors();
        godProcess();
    };
    image.src = imgSrc;

    scrollToTop();
};

MLB.ronchi.scrollToTop = function () {
    $('html,body').animate({
        scrollTop: $('#topDiv').offset().top
    });
};

MLB.ronchi.changeFontSize = function (size) {
    var constants = MLB.ronchi.constants;

    constants.fontSize = Math.floor(size / constants.fontRatio);
};

MLB.ronchi.changeRonchigramSize = function () {
    var constants = MLB.ronchi.constants,
        godProcess = MLB.ronchi.godProcess;

    constants.pastedImageWidth().val(constants.canvasSize());
    constants.pastedImageHeight().val(constants.canvasSize());
    constants.pastedImageOffsetX().val(-constants.borderSize().val());
    constants.pastedImageOffsetY().val(-constants.borderSize().val());

    godProcess();
};

MLB.ronchi.getLocalStorageName = function () {
    var constants = MLB.ronchi.constants;

    return constants.MatchingRonchiTestLit + constants.dataName().val();
};

MLB.ronchi.showMatchingRonchiLocalStorageItems = function () {
  var constants = MLB.ronchi.constants,
      findMatchingLocalStorageItems = MLB.sharedLib.findMatchingLocalStorageItems,
      items = findMatchingLocalStorageItems(constants.MatchingRonchiTestLit);

    alert('local storage data names are:\n' + items.join('\n'));
};

MLB.ronchi.removeMatchingRonchiLocalStorageItems = function () {
  var constants = MLB.ronchi.constants,
      removeMatchingLocalStorageItems = MLB.sharedLib.removeMatchingLocalStorageItems;

    removeMatchingLocalStorageItems(constants.MatchingRonchiTestLit);
};

MLB.ronchi.getNameIndexedElement = function (name, ix) {
    return $('[' + name + ix + ']');
};

MLB.ronchi.getNameIndexedElementValue = function (name, ix) {
    return MLB.ronchi.getNameIndexedElement(name, ix).val();
};

MLB.ronchi.setNameIndexedElementValue = function (name, ix, val) {
    MLB.ronchi.getNameIndexedElement(name, ix).val(val);
};

MLB.ronchi.getNameIndexedElementChBoxValue = function (name, ix) {
    return MLB.ronchi.getNameIndexedElement(name, ix).is(':checked');
};

MLB.ronchi.setNameIndexedElementChBoxValue = function (name, ix, val) {
    MLB.ronchi.getNameIndexedElement(name, ix).prop('checked', val);
};

MLB.ronchi.setIdIndexedLabelValue = function (id, ix, val) {
    $('[' + id + ix + ']').html(val);
};

MLB.ronchi.setIdIndexedLabelBackground = function (id, ix, val) {
    $('[' + id + ix + ']').css('background-color', val);
};

MLB.ronchi.putData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        dataToSave,
        ix,
        zone,
        correction,
        useCorrection,
        zonalCorrectionTable = [];

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
        zonalCorrectionTable.push({zone: zone, correctionFactor: correction, use: useCorrection});
    }

    dataToSave = {
        mirrorDia: constants.mirrorDia().val(),
        radiusOfCurvature: constants.radiusOfCurvature().val(),
        focalLength: constants.focalLength().val(),
        focalRatio: constants.focalRatio().val(),
        centralObstruction: constants.centralObstruction().val(),
        gratingFreq: constants.gratingFreq().val(),
        gratingOffsetSeries: constants.gratingOffsetSeries().val(),
        userParabolicCorrection: constants.userParabolicCorrection().val(),
        RonchigramSize: constants.RonchigramSize().val(),
        borderSize: constants.borderSize().val(),
        bandColorRGB: constants.bandColorRGB().val(),
        backgroundBandColorRGB: constants.backgroundBandColorRGB().val(),
        backgroundColor: constants.backgroundColor().val(),
        invertBands: constants.invertBands()[constants.yes].checked,
        RonchiTape: constants.RonchiTape()[constants.yes].checked,
        RonchiGrid: constants.RonchiGrid()[constants.yes].checked,
        drawRuler: constants.btnDrawRulerVal(),
        rulerTextRGB: constants.rulerTextRGB().val(),
        pastedImageTransparency: constants.pastedImageTransparency().val(),
        pastedImageWidth: constants.pastedImageWidth().val(),
        pastedImageHeight: constants.pastedImageHeight().val(),
        pastedImageOffsetX: constants.pastedImageOffsetX().val(),
        pastedImageOffsetY: constants.pastedImageOffsetY().val(),
        distortionResolutionFactor: constants.distortionResolutionFactor().val(),
        unwrapBandRuler: constants.unwrapBandRuler()[constants.yes].checked,
        showBullseyeZones: constants.showBullseyeZones()[constants.yes].checked,
        zonalCorrectionTable: zonalCorrectionTable,
        offsetRoC: constants.offsetRoC().val(),
        wavelengthLightUOM: constants.btnWavelengthLightUOMVal()
    };

    localStorage.setItem(getLocalStorageName(), JSON.stringify(dataToSave));
};

MLB.ronchi.getData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        localStorageName = getLocalStorageName(),
        data = localStorage.getItem(localStorageName),
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        parsedData,
        ix,
        row;

    if (data === null) {
        alert('no data under ' + localStorageName);
        return;
    }

    parsedData = JSON.parse(data);

    constants.mirrorDia().val(parsedData.mirrorDia);
    constants.radiusOfCurvature().val(parsedData.radiusOfCurvature);
    constants.focalLength().val(parsedData.focalLength);
    constants.focalRatio().val(parsedData.focalRatio);
    constants.centralObstruction().val(parsedData.centralObstruction);
    constants.gratingFreq().val(parsedData.gratingFreq);
    constants.gratingOffsetSeries().val(parsedData.gratingOffsetSeries);
    constants.userParabolicCorrection().val(parsedData.userParabolicCorrection);
    constants.RonchigramSize().val(parsedData.RonchigramSize);
    constants.borderSize().val(parsedData.borderSize);
    constants.bandColorRGB().val(parsedData.bandColorRGB);
    if (parsedData.backgroundBandColorRGB) {
        constants.backgroundBandColorRGB().val(parsedData.backgroundBandColorRGB);
    }
    if (parsedData.backgroundColor) {
        constants.backgroundColor().val(parsedData.backgroundColor);
    }
    constants.invertBands()[constants.yes].checked = parsedData.invertBands;
    constants.invertBands()[constants.no].checked = !parsedData.invertBands;

    constants.RonchiTape()[constants.yes].checked = parsedData.RonchiTape;
    constants.RonchiTape()[constants.no].checked = !parsedData.RonchiTape;

    constants.RonchiGrid()[constants.yes].checked = parsedData.RonchiGrid;
    constants.RonchiGrid()[constants.no].checked = !parsedData.RonchiGrid;

    switch (parsedData.drawRuler) {
        case constants.noneLit:
            constants.btnDrawRuler()[constants.none].checked = true;
            break;
        case constants.zonalLit:
            constants.btnDrawRuler()[constants.zonal].checked = true;
            break;
        case constants.zonal10Lit:
            constants.btnDrawRuler()[constants.zonal10].checked = true;
            break;
        case constants.uomCenterLit:
            constants.btnDrawRuler()[constants.uomCenter].checked = true;
            break;
        case constants.uomEdgeLit:
            constants.btnDrawRuler()[constants.uomEdge].checked = true;
            break;
        case constants.RonchiTapeMarksLit:
            constants.btnDrawRuler()[constants.RonchiTapeMarks].checked = true;
            break;
        default:
            constants.btnDrawRuler()[constants.none].checked = true;
    }
    constants.rulerTextRGB().val(parsedData.rulerTextRGB);

    constants.pastedImageTransparency().val(parsedData.pastedImageTransparency);
    constants.pastedImageWidth().val(parsedData.pastedImageWidth);
    constants.pastedImageHeight().val(parsedData.pastedImageHeight);
    constants.pastedImageOffsetX().val(parsedData.pastedImageOffsetX);
    constants.pastedImageOffsetY().val(parsedData.pastedImageOffsetY);

    constants.distortionResolutionFactor().val(parsedData.distortionResolutionFactor);

    constants.unwrapBandRuler()[constants.yes].checked = parsedData.unwrapBandRuler;
    constants.unwrapBandRuler()[constants.no].checked = !parsedData.unwrapBandRuler;

    constants.showBullseyeZones()[constants.yes].checked = parsedData.showBullseyeZones;
    constants.showBullseyeZones()[constants.no].checked = !parsedData.showBullseyeZones;

    constants.offsetRoC().val(parsedData.offsetRoC);

    if (parsedData.wavelengthLightUOM === constants.imperialLit) {
        constants.btnWavelengthLightUOM()[constants.imperial].checked = true;
    } else {
        constants.btnWavelengthLightUOM()[constants.metric].checked = true;
    }

    for (ix = 0; ix < constants.zoneCount; ix++) {
        row = parsedData.zonalCorrectionTable[ix];
        setNameIndexedElementValue(constants.zoneIdLit, ix, row.zone);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, row.correctionFactor);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, row.use);
    }
};

// zone can range from 0 to 1: comes from user defined userZonalCorrections per zones
MLB.ronchi.getInterpolatedCorrection = function (zone) {
    var constants = MLB.ronchi.constants,
        userZonalCorrections = constants.userZonalCorrections,
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
        if (userZonalCorrections[px][0] >= zone) {
            break;
        }
    }
    // interpolate for correction
    if (px === 0) { // initial value in table
        correction = userZonalCorrections[px][1];
    } else if (px === userZonalCorrectionsLength) { // beyond table so use last correction
        correction = userZonalCorrections[userZonalCorrectionsLength - 1][1];
    } else { // interpolate between 2 values
        zoneA = userZonalCorrections[px - 1][0];
        zoneB = userZonalCorrections[px][0];
        contactA = userZonalCorrections[px - 1][1];
        contactB = userZonalCorrections[px][1];
        correction = contactA + (contactB - contactA) * (zone - zoneA) / (zoneB - zoneA);
    }
    return correction;
};

MLB.ronchi.buildZoneAndCorrectionTable = function () {
    var constants = MLB.ronchi.constants,
        ix,
        htmlStr;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        htmlStr = '<tr>\r\n'
                + '<td class="label">' + 'Zone \r\n'
                + '<td> <input class="inputTextShort" ' + constants.zoneId2Lit + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> \r\n'
                + '<td class="label"> correction \r\n'
                + '<td> <input class="inputTextShort" ' + constants.zoneCorrectionId2Lit + ix + '" onfocus="select();" type="number" step="0.05"> \r\n'
                + '<td class="label">&nbsp; \r\n'
                + '<td> <label ' + constants.zoneResult2Lit + ix + '"></label> \r\n'
                + '<td class="label">M-L tol: \r\n'
                + '<td> <label ' + constants.MLToleranceId2Lit + ix + '"></label> \r\n'
                + '<td class="label">&nbsp; RoC chg: \r\n'
                + '<td> <label ' + constants.RoCChangeId2Lit + ix + '"></label> \r\n'
                + '<td class="label">&nbsp; Use? \r\n'
                + '<td> <input ' + constants.useZonalCorrectionIdDoubleQuoteLit + ix + '" type="checkbox"> \r\n';

        constants.zonalCorrectionTableBody().append(htmlStr);
    }
};

MLB.ronchi.sortZonalCorrectionTableByZone = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        userZonalCorrections = [],
        sortedUserZonalCorrections,
        ix,
        useCorrection,
        zone,
        correction,
        val;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        userZonalCorrections.push([zone, correction, useCorrection]);
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

    for (ix = 0; ix < constants.zoneCount; ix++) {
        val = sortedUserZonalCorrections[ix][0];
        if (isNaN(val)) {
            val = '';
        }
        setNameIndexedElementValue(constants.zoneIdLit, ix, val);

        val = sortedUserZonalCorrections[ix][1];
        if (isNaN(val)) {
            val = '';
        }
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, val);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, sortedUserZonalCorrections[ix][2]);
    }
};

// remove correction and check if zone is not a number
MLB.ronchi.cleanupZonalCorrectionTable = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        ix,
        zone;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        if (isNaN(zone)) {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
            setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, false);
        }
    }
};

MLB.ronchi.copyBandPositionsToErrorTable = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        mirrorDia = +constants.mirrorDia().val(),
        mirrorRadius = mirrorDia / 2,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        invertBands = constants.invertBands()[constants.yes].checked,
        ix,
        tapesLength = constants.tapes[0].length,
        tapeIx,
        bandVal,
        lastEntryDone = false;

    ix = 0;
    tapeIx = 0;
    if (invertBands) {
        // include 0, which is missing when invertBands
        setNameIndexedElementValue(constants.zoneIdLit, ix, 0);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, true);
        ix++;
    }
    for ( ; ix < constants.zoneCount; ix++, tapeIx++) {
        if (tapeIx < tapesLength) {
            // use first image Ronchi image values, tapes[0]
            bandVal = roundToDecimal(constants.tapes[0][tapeIx] / mirrorRadius, constants.tapeBandDecimalPrecision);

            setNameIndexedElementValue(constants.zoneIdLit, ix, bandVal);
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
            setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, true);
        } else {
            if (lastEntryDone) {
                setNameIndexedElementValue(constants.zoneIdLit, ix, '');
                setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
                setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, false);
            } else {
                // set mirror's edge as final entry in table
                setNameIndexedElementValue(constants.zoneIdLit, ix, 1);
                setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
                setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, true);
                lastEntryDone = true;
            }
        }
    }
};

MLB.ronchi.resetZonesToOneTenthIncrement = function () {
    var constants = MLB.ronchi.constants,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        ix;

    for (ix = 0; ix < 11; ix++) {
        setNameIndexedElementValue(constants.zoneIdLit, ix, ix / 10);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, true);
    }
};

MLB.ronchi.resetCorrectionFactors = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        userEnteredZone,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        userEnteredZone = getNameIndexedElementValue(constants.zoneIdLit, ix);
        if (userEnteredZone !== '' && !isNaN(userEnteredZone)) {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
        } else {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
            setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, false);
        }
    }
};

MLB.ronchi.resetCorrectionFactorsToParabCorrection = function () {
    var constants = MLB.ronchi.constants,
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        userEnteredZone,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        userEnteredZone = getNameIndexedElementValue(constants.zoneIdLit, ix);
        if (userEnteredZone !== '' && !isNaN(userEnteredZone)) {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, userParabolicCorrection);
        } else {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
            setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, false);
        }
    }
};

MLB.ronchi.processZonalErrors = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcMillesLacroixTolerance = MLB.calcLib.calcMillesLacroixTolerance,
        calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        setIdIndexedLabelValue = MLB.ronchi.setIdIndexedLabelValue,
        setIdIndexedLabelBackground = MLB.ronchi.setIdIndexedLabelBackground,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        offsetRoC = +constants.offsetRoC().val(),
        calcWaveErrorForZone = MLB.ronchi.calcWaveErrorForZone,
        calcSaveWaveErrorResults = MLB.ronchi.calcSaveWaveErrorResults,
        getWavelengthLight = MLB.ronchi.getWavelengthLight,
        wavelengthLight = getWavelengthLight(),
        ix,
        zone,
        userEnteredZonalCorrection,
        zoneIsANumber,
        userEnteredZonalCorrectionIsANumber,
        RoCChange,
        RoCChangeStr,
        MLTolerance,
        zoneResultStr,
        zoneResultBackgroundColor,
        parabolicCorrectionForZone,
        correctionTolerance,
        displayToleranceStr,
        useCorrection,
        peakValleyMLTolerance,
        greatestPositivePeakValleyMLTolerance = 0,
        greatestNegativePeakValleyMLTolerance = 0,
        weightedMLToleranceCount = 0,
        weightedMLToleranceTotal = 0,
        userZonalCorrections = [],
        zoneZeroFound,
        zoneOneFound,
        waveErrors = [],
        waveErrorResults;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = (getNameIndexedElementValue(constants.zoneIdLit, ix));
        userEnteredZonalCorrection = getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix);
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);

        zoneIsANumber = zone.trim() != '' && !isNaN(zone);
        userEnteredZonalCorrectionIsANumber = userEnteredZonalCorrection.trim() != '' && !isNaN(userEnteredZonalCorrection);

        if (!zoneIsANumber) {
            setIdIndexedLabelValue(constants.RoCChangeIdLit, ix, '');
            setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, '');
            setIdIndexedLabelValue(constants.zoneResultIdLit, ix, '');
            continue;
        }

        parabolicCorrectionForZone = calcParabolicCorrectionForZone(mirrorDia, radiusOfCurvature, zone);

        if (userEnteredZonalCorrectionIsANumber) {
            RoCChange = parabolicCorrectionForZone * userEnteredZonalCorrection;
            RoCChangeStr = roundToDecimal(RoCChange, constants.MLToleranceDecimalPrecision);
        } else {
            RoCChangeStr = '';
        }

        MLTolerance = calcMillesLacroixTolerance(wavelengthLight, mirrorDia, radiusOfCurvature, zone);
        if (MLTolerance === Infinity) {
            displayToleranceStr = Infinity;
        } else {
            correctionTolerance = MLTolerance / parabolicCorrectionForZone;
            displayToleranceStr = roundToDecimal(1 - correctionTolerance, constants.MLToleranceDecimalPrecision)
                    + ' to '
                    + roundToDecimal(1 + correctionTolerance, constants.MLToleranceDecimalPrecision);

            // peak to valley ML tolerance
            peakValleyMLTolerance = (userEnteredZonalCorrection - 1) / correctionTolerance;
            if (peakValleyMLTolerance > 0) {
                if (peakValleyMLTolerance > greatestPositivePeakValleyMLTolerance) {
                    greatestPositivePeakValleyMLTolerance = peakValleyMLTolerance;
                }
            } else {
                if (peakValleyMLTolerance < greatestNegativePeakValleyMLTolerance) {
                    greatestNegativePeakValleyMLTolerance = peakValleyMLTolerance;
                }
            }

            // weighted ML tolerance
            if (useCorrection) {
                if (!isNaN(userEnteredZonalCorrection)) {
                    weightedMLToleranceCount += zone * zone;
                    weightedMLToleranceTotal += Math.abs((userEnteredZonalCorrection - 1) / correctionTolerance * zone * zone);
                }
            }
        }

        setIdIndexedLabelValue(constants.RoCChangeIdLit, ix, RoCChangeStr);
        setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, displayToleranceStr);

        zoneResultStr = roundToDecimal(-peakValleyMLTolerance * 100, 0) + '%';
        if (peakValleyMLTolerance < 0) {
            zoneResultStr = '+' + zoneResultStr;
        }
        setIdIndexedLabelValue(constants.zoneResultIdLit, ix, zoneResultStr);
        if (peakValleyMLTolerance > 1 || peakValleyMLTolerance < -1) {
            zoneResultBackgroundColor = 'red';
        } else if (peakValleyMLTolerance > 0.5 || peakValleyMLTolerance < -0.5) {
            zoneResultBackgroundColor = 'yellow';
        } else {
            zoneResultBackgroundColor = 'lightgreen';
        }
        setIdIndexedLabelBackground(constants.zoneResultIdLit, ix, zoneResultBackgroundColor);

        // userZonalCorrections array for the Ronchigram display: build here for speed since we already have the values
        if (+zone === 0) {
            zoneZeroFound = true;
        }
        if (+zone === 1) {
            zoneOneFound = true;
        }
        userZonalCorrections.push([zone, +userEnteredZonalCorrection]);

        // wave error: waveErrors array added to by this function
        // note that zone needs to be turned into a number and that the passed in waveErrors array is filled in
        if (useCorrection) {
            calcWaveErrorForZone(+zone, mirrorDia, radiusOfCurvature, userParabolicCorrection, userEnteredZonalCorrection, wavelengthLight, offsetRoC, waveErrors);
        }
    }

    // supply default values for userZonalCorrections if necessary
    if (!zoneZeroFound) {
        userZonalCorrections.push([0, 1]);
    }
    if (!zoneOneFound) {
        userZonalCorrections.push([1, 1]);
    }
    constants.userZonalCorrections = userZonalCorrections.sort();

    constants.peakValleyMLTolerance = greatestPositivePeakValleyMLTolerance - greatestNegativePeakValleyMLTolerance;
    constants.weightedMLTolerance = weightedMLToleranceTotal / weightedMLToleranceCount;
    constants.zonalErrorsResultsLabel().html('Peak-valley ML tolerance = '
            + roundToDecimal(constants.peakValleyMLTolerance, constants.MLToleranceDisplayDecimalPrecision)
            + '; weighted ML tolerance = '
            + roundToDecimal(constants.weightedMLTolerance, constants.MLToleranceDisplayDecimalPrecision)
            + '.'
    );

    waveErrorResults = calcSaveWaveErrorResults(waveErrors);
    constants.waveErrorsLabel().html('Peak to valley wavefront error = '
            + roundToDecimal(waveErrorResults.PV, constants.wavesDecimalPrecision)
            + ', RMS = '
            + roundToDecimal(waveErrorResults.rms, constants.wavesDecimalPrecision)
            + '.'
    );
};

MLB.ronchi.calcSaveWaveErrorResults = function (waveErrors) {
    var constants = MLB.ronchi.constants,
        normalizedWaveErrors = [],
        waveErrorsLowestIsZero = [],
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

    // build normalized wave errors that range from 0 to 1
    rangeWaveError = highestWaveError - lowestWaveError;
    waveErrors.forEach(we => {
        normalizedWaveErrors.push({zone: we.zone, error: (we.error - lowestWaveError) / rangeWaveError});
        // this way for plotting in the zonal errors side view
        waveErrorsLowestIsZero.push({zone: we.zone, error: highestWaveError - we.error});
    });

    constants.waveErrors = waveErrors;
    constants.normalizedWaveErrors = normalizedWaveErrors;
    constants.waveErrorsLowestIsZero = waveErrorsLowestIsZero;
    constants.rangeWaveError = rangeWaveError;

    return {
        PV: highestWaveError - lowestWaveError,
        rms: Math.sqrt(rms / rmsCount)
    };
};

MLB.ronchi.calcWaveErrorForZone = function (zone, mirrorDia, radiusOfCurvature, userParabolicCorrection, userEnteredZonalCorrection, wavelengthLight, offsetRoC, waveErrors) {
    var calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
        mirrorZone,
        mirrorZoneSquared,
        zonalFocalRatio,
        idealWavesCorrection,
        parabolicCorrectionForZone,
        perfectParabolicCorrectionForZone,
        userRoCChg,
        errorFactor,
        error;

    // zone 0, the mirror's center, has no parabolic correction, ie, the mirror's center defines the RoC
    if (zone === 0) {
        waveErrors.push({
            zone: 0,
            error: 0
        });
        return;
    }

    /* default with zone of 0.77:
        mirrorZone = 4.62,
        mirrorZoneSquared = 21.3444, (4.62 squared)
        zonalFocalRatio = 6.4935064935064934, (default FR of 5 divided by zone of 0.77)
        idealWavesCorrection = 1.49799890625, (change mirror dia to 9.14 [0.77*12] to verify 1.5 waves correction)
        parabolicCorrectionForZone = 0.088935, (use earlier versions to verify)
    */
    mirrorZone = zone * mirrorDia / 2;
    mirrorZoneSquared = mirrorZone * mirrorZone;
    zonalFocalRatio = radiusOfCurvature / mirrorZone / 4;
    idealWavesCorrection = calcSphereParabolaDifference(mirrorZone * 2, zonalFocalRatio) / wavelengthLight;
    parabolicCorrectionForZone = calcParabolicCorrectionForZone(mirrorDia, radiusOfCurvature, zone);
    // adjust for overall parab correction
    idealWavesCorrection *= userParabolicCorrection;
    perfectParabolicCorrectionForZone = parabolicCorrectionForZone * userParabolicCorrection;
    // user adjustments from perfect including altering the radius of curvature slightly...
    userRoCChg = perfectParabolicCorrectionForZone * userEnteredZonalCorrection + offsetRoC;
    /* compare userRoCChg to perfectParabolicCorrectionForZone
        ex: userRoCChg = perfect then error = 0
            userRoCChg = 0 then error = idealWavesCorrection (no correction at all means spherical, so error is the full idealWavesCorrection)
            userRoCChg = 2x perfect, then error = idealWavesCorrection (dbl correction is like spherical but error has opposite sign)
    */
    errorFactor = (perfectParabolicCorrectionForZone - userRoCChg) / perfectParabolicCorrectionForZone;
    error = idealWavesCorrection * errorFactor;

    waveErrors.push({
        zone: zone,
        error: error
    });
};

MLB.ronchi.drawZonalErrorsTopView = function () {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        drawRulers = MLB.ronchi.drawRulers,
        normalizedWaveErrorsAreZero = MLB.ronchi.normalizedWaveErrorsAreZero,
        getInterpolatedWaveError = MLB.ronchi.getInterpolatedWaveError,
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        drawCircle = MLB.sharedLib.drawCircle,
        point = MLB.sharedLib.point,
        setPixel = MLB.sharedLib.setPixel,
        canvasSize = constants.canvasSize(),
        canvas,
        context,
        imageData,
        scalingFactor,
        mirrorRadius,
        scaledMirrorRadius,
        ronchiCenter,
        yIx,
        xIx,
        radius,
        noErrors,
        error,
        color;

    constants.zonesTopViewDiv().append(buildCanvasElement(constants.zonesTopViewLit, canvasSize, canvasSize));
    canvas = constants.zonesTopViewID();
    context = canvas.getContext('2d');
    context.fillStyle = constants.rulerTextColor;
    context.font = constants.fontSize + constants.fontLit;
    imageData = context.createImageData(canvasSize, canvasSize);

    //scalingFactor uses RonchigramSize, not canvasSize (which includes borderSize)
    scalingFactor = RonchigramSize / mirrorDia;
    mirrorRadius = mirrorDia / 2;
    scaledMirrorRadius = mirrorRadius * scalingFactor;
    ronchiCenter = point(canvas.width / 2, canvas.height / 2);

    noErrors = normalizedWaveErrorsAreZero();

    for (yIx = 0; yIx < scaledMirrorRadius; yIx += 1) {
        for (xIx = 0; xIx < scaledMirrorRadius; xIx += 1) {
            radius = Math.sqrt(yIx * yIx + xIx * xIx);
            if (radius > scaledMirrorRadius) {
                continue;
            }
            if (noErrors) {
                color = 122; // neutral gray
            } else {
                // error ranges from 0 to 1
                error = getInterpolatedWaveError(radius / scaledMirrorRadius);
                // undercorrected is black
                color = error * 255;
            }
            setPixel(imageData, ronchiCenter.x + xIx, ronchiCenter.y + yIx, color, color, color, constants.opaque);
            setPixel(imageData, ronchiCenter.x - xIx, ronchiCenter.y + yIx, color, color, color, constants.opaque);
            setPixel(imageData, ronchiCenter.x + xIx, ronchiCenter.y - yIx, color, color, color, constants.opaque);
            setPixel(imageData, ronchiCenter.x - xIx, ronchiCenter.y - yIx, color, color, color, constants.opaque);
        }
    }

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // outline the circle
    drawCircle(context, ronchiCenter, scaledMirrorRadius, 1, constants.blackColor);

    // include rulers...
    drawRulers(context, ronchiCenter, mirrorRadius, scalingFactor, undefined);
};

MLB.ronchi.drawZonalErrorsSideView = function () {
    var constants = MLB.ronchi.constants,
        waveErrorsLowestIsZero = constants.waveErrorsLowestIsZero,
        rangeWaveError = constants.rangeWaveError,
        mirrorDia = +constants.mirrorDia().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        int = MLB.sharedLib.int,
        fillRect = MLB.sharedLib.fillRect,
        rect = MLB.sharedLib.rect,
        drawLine = MLB.sharedLib.drawLine,
        point = MLB.sharedLib.point,
        fillPolygon = MLB.sharedLib.fillPolygon,
        canvasWidth = constants.canvasSize(),
        halfCanvasWidth = canvasWidth / 2,
        canvasHeight = canvasWidth / 3,
        floor = canvasHeight * 3 / 4,
        ceiling = canvasHeight * 1 / 4,
        floorToCeilingHeight = floor - ceiling,
        basement = canvasHeight - constants.rulerThickness,
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

    constants.zonesSideViewDiv().append(buildCanvasElement(constants.zonesSideViewLit, canvasWidth, canvasHeight));
    canvas = constants.zonesSideViewID();
    context = canvas.getContext('2d');
    context.fillStyle = constants.rulerTextColor;
    context.font = constants.fontSize + constants.fontLit;
    fillRect(context, "white", rect(0, 0, canvasWidth, canvasHeight));

    if (rangeWaveError <= 0.25) {
        ceilingWaveError = 0.25;
    } else {
        ceilingWaveError = int(rangeWaveError + 1);
    }
    verticalScalingFactor = floorToCeilingHeight / ceilingWaveError;

    //scalingFactor uses RonchigramSize, not canvasSize (which includes borderSize)
    scalingFactor = RonchigramSize / mirrorDia;
    mirrorRadius = mirrorDia / 2;
    scaledMirrorRadius = mirrorRadius * scalingFactor;
    startX = halfCanvasWidth - scaledMirrorRadius;
    endX = canvasWidth - startX;

    // right hand side of the polygon
    waveErrorsLowestIsZero.forEach(we => {
        // error is height (y), zone is width (x)
        points.push(point(we.zone * scaledMirrorRadius + halfCanvasWidth, floor - we.error * verticalScalingFactor));
    });
    // add points across the bottom of the graph so that the polygon can be filled in
    points.push(point(endX, basement));
    points.push(point(startX, basement));
    // left hand side of the polygon
    waveErrorsLowestIsZero.reverse().forEach(we => {
        // error is height (y), zone is width (x)
        points.push(point(halfCanvasWidth - we.zone * scaledMirrorRadius, floor - we.error * verticalScalingFactor));
    });
    fillPolygon(context, points, constants.sideViewFillColor);

    // draw the vertical zonal lines
    waveErrorsLowestIsZero.forEach(we => {
        var rightX = we.zone * scaledMirrorRadius + halfCanvasWidth,
            leftX = canvasWidth - rightX,
            height = floor - we.error * verticalScalingFactor;

        drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(rightX, basement), point(rightX, height));
        drawLine(context, constants.rulerTextColor, constants.rulerThickness, point(leftX, basement), point(leftX, height));
    });

    // draw horizontal lines
    drawLine(context, constants.blackColor, constants.rulerThickness, point(startX, basement), point(endX, basement));
    drawLine(context, constants.blackColor, constants.rulerThickness, point(startX, floor), point(endX, floor));
    drawLine(context, constants.blackColor, constants.rulerThickness, point(startX, ceiling), point(endX, ceiling));

    // write upper line's wave error
    context.fillStyle = constants.blackColor;
    txt = 'Line is wavefront error '
            + ceilingWaveError
            + ' (surface '
            + ceilingWaveError / 2
            + ')';
    context.fillText(txt, startX, ceiling - 4);
};

MLB.ronchi.normalizedWaveErrorsAreZero = function () {
    var constants = MLB.ronchi.constants,
        normalizedWaveErrors = constants.normalizedWaveErrors,
        isZero = true;

    normalizedWaveErrors.forEach(we => {
        if (!isNaN(we.error) && we.error !== 0) {
            isZero = false;
        }
    });

    return isZero;
};

// radius can range from 0 to 1
// normalizedWaveErrors: [zone, error]
MLB.ronchi.getInterpolatedWaveError = function (radius) {
    var constants = MLB.ronchi.constants,
        normalizedWaveErrors = constants.normalizedWaveErrors,
        normalizedWaveErrorsLength = normalizedWaveErrors.length,
        ix,
        error,
        zoneA,
        zoneB,
        errorA,
        errorB;

    if (normalizedWaveErrorsLength === 0) {
        return 1;
    }

    // find normalizedWaveErrors[] element that fits radius
    for (ix = 0; ix < normalizedWaveErrorsLength; ix++) {
        if (normalizedWaveErrors[ix].zone >= radius) {
            break;
        }
    }
    // interpolate for error
    if (ix === 0) { // initial value in table
        error = normalizedWaveErrors[ix].error;
    } else if (ix === normalizedWaveErrorsLength) { // beyond table so use last error
        error = normalizedWaveErrors[normalizedWaveErrorsLength - 1][1];
    } else { // interpolate between 2 values
        zoneA = normalizedWaveErrors[ix - 1].zone;
        zoneB = normalizedWaveErrors[ix].zone;
        errorA = normalizedWaveErrors[ix - 1].error;
        errorB = normalizedWaveErrors[ix].error;
        error = errorA + (errorB - errorA) * (radius - zoneA) / (zoneB - zoneA);
    }
    return error;
};

MLB.ronchi.godProcess = function () {
    MLB.ronchi.processZonalErrors();
    MLB.ronchi.drawZonalErrorsTopView();
    MLB.ronchi.drawZonalErrorsSideView();
    MLB.ronchi.plotRonchigramsCalcRonchiTape();
    MLB.ronchi.unwrapFirstRonchigram();
    MLB.ronchi.adjustRonchigramDivDiscussionDivWidths();
    MLB.ronchi.adjustZonalErrorsNotesDiv();
    MLB.ronchi.calcUnwrapVerticalStdDeviation();
};

MLB.ronchi.addEventHandlersForEachZonalErrorTableRow = function () {
    var constants = MLB.ronchi.constants,
        godProcess = MLB.ronchi.godProcess,
        ix,
        getNameIndexedElement = MLB.ronchi.getNameIndexedElement;

    // add in change event handlers for each zone, correction and use flag
    for (ix = 0; ix < constants.zoneCount; ix++) {
        getNameIndexedElement(constants.zoneIdLit, ix).change(godProcess);
        getNameIndexedElement(constants.zoneCorrectionIdLit, ix).change(godProcess);
        getNameIndexedElement(constants.useZonalCorrectionIdLit, ix).change(godProcess);
    }
};

MLB.ronchi.setAllZonesUse = function (valueToUse) {
    var constants = MLB.ronchi.constants,
        ix,
        zone,
        correction,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        if (isNaN(zone) || isNaN(correction)) {
            continue;
        }
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, valueToUse);
    }
};

MLB.ronchi.rgbToHex = function (rgb) {
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

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive,
        setGratingOffsetsFromSliderOffset = MLB.ronchi.setGratingOffsetsFromSliderOffset,
        setGratingOffsetsFromOffset = MLB.ronchi.setGratingOffsetsFromOffset,
        setParabolicCorrectionFromSliderParabolicCorrection = MLB.ronchi.setParabolicCorrectionFromSliderParabolicCorrection,
        changeFontSize = MLB.ronchi.changeFontSize,
        changeRonchigramSize = MLB.ronchi.changeRonchigramSize,
        copyClipboardImage = MLB.ronchi.copyClipboardImage,
        setDropEffectToCopy = MLB.ronchi.setDropEffectToCopy,
        dragAndDropImage = MLB.ronchi.dragAndDropImage,
        deleteImage = MLB.ronchi.deleteImage,
        pasteExampleRonchigram = MLB.ronchi.pasteExampleRonchigram,
        putData = MLB.ronchi.putData,
        getData = MLB.ronchi.getData,
        showMatchingRonchiLocalStorageItems = MLB.ronchi.showMatchingRonchiLocalStorageItems,
        removeMatchingRonchiLocalStorageItems = MLB.ronchi.removeMatchingRonchiLocalStorageItems,
        buildZoneAndCorrectionTable = MLB.ronchi.buildZoneAndCorrectionTable,
        addEventHandlersForEachZonalErrorTableRow = MLB.ronchi.addEventHandlersForEachZonalErrorTableRow,
        godProcess = MLB.ronchi.godProcess,
        sortZonalCorrectionTableByZone = MLB.ronchi.sortZonalCorrectionTableByZone,
        cleanupZonalCorrectionTable = MLB.ronchi.cleanupZonalCorrectionTable,
        copyBandPositionsToErrorTable = MLB.ronchi.copyBandPositionsToErrorTable,
        resetZonesToOneTenthIncrement = MLB.ronchi.resetZonesToOneTenthIncrement,
        resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors,
        resetCorrectionFactorsToParabCorrection = MLB.ronchi.resetCorrectionFactorsToParabCorrection,
        setAllZonesUse = MLB.ronchi.setAllZonesUse,
        rgbToHex = MLB.ronchi.rgbToHex;

    // starting values
    document.body.style.background = constants.backgroundColor().val();
    constants.invertBands()[constants.no].checked = true;
    constants.RonchiTape()[constants.no].checked = true;
    constants.RonchiGrid()[constants.no].checked = true;
    //constants.btnDrawRuler()[constants.none].checked = true;
    constants.btnDrawRuler()[constants.RonchiTapeMarks].checked = true;
    constants.unwrapBandRuler()[constants.yes].checked = true;
    constants.showBullseyeZones()[constants.no].checked = true;
    setPastedImageInactive();
    constants.btnWavelengthLightUOM()[constants.imperial].checked = true;

    // build and fill in zone and correction table
    buildZoneAndCorrectionTable();
    addEventHandlersForEachZonalErrorTableRow();

    // event hookups/subscribes

    constants.btnSortZonalCorrectionTableByZone().click(() => {
        sortZonalCorrectionTableByZone();
        cleanupZonalCorrectionTable();
        godProcess();
    });
    constants.btnCopyBands().click(() => {
        copyBandPositionsToErrorTable();
        resetCorrectionFactors();
        godProcess();
    });
    constants.btn11Zones().click(() => {
        resetZonesToOneTenthIncrement();
        resetCorrectionFactors();
        godProcess();
    });
    constants.btnResetCorrectionFactors().click(() => {
        resetCorrectionFactors();
        godProcess();
    });
    constants.btnResetCorrectionFactorsToParabCorrection().click(() => {
        resetCorrectionFactorsToParabCorrection();
        godProcess();
    });
    constants.btnUseAllZones().click(() => {
        setAllZonesUse(true);
        godProcess();
    });
    constants.btnUseNoZones().click(() => {
        setAllZonesUse(false);
        godProcess();
    });
    constants.mirrorDia().change(() => {
        // keep FR, adjust RoC and FL
        var mirrorDia = +constants.mirrorDia().val(),
            focalRatio = +constants.focalRatio().val();

        constants.radiusOfCurvature().val(roundToDecimal(mirrorDia * focalRatio * 2, 2));
        constants.focalLength().val(roundToDecimal(mirrorDia * focalRatio, 2));
        godProcess();
    });
    constants.radiusOfCurvature().change(() => {
        // change FL and FR
        var mirrorDia = +constants.mirrorDia().val(),
            radiusOfCurvature = +constants.radiusOfCurvature().val();

        constants.focalLength().val(roundToDecimal(radiusOfCurvature / 2, 2));
        constants.focalRatio().val(roundToDecimal(radiusOfCurvature / mirrorDia / 2, 2));
        godProcess();
    });
    constants.focalLength().change(() => {
        // change RoC and FR
        var mirrorDia = +constants.mirrorDia().val(),
            focalLength = +constants.focalLength().val();

        constants.radiusOfCurvature().val(roundToDecimal(focalLength * 2, 2));
        constants.focalRatio().val(roundToDecimal(focalLength / mirrorDia, 2));
        godProcess();
    });
    constants.focalRatio().change(() => {
        // change RoC and FL
        var mirrorDia = +constants.mirrorDia().val(),
            focalRatio = +constants.focalRatio().val(),
            radiusOfCurvature = mirrorDia * focalRatio * 2;

        constants.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, 2));
        constants.focalLength().val(roundToDecimal(radiusOfCurvature / 2, 2));
        godProcess();
    });
    constants.centralObstruction().change(godProcess);
    constants.gratingFreq().change(godProcess);
    constants.gratingOffsetSeries().change(godProcess);
    constants.userParabolicCorrection().change(godProcess);
    constants.RonchigramSize().change((e) => {
        changeFontSize(e.target.value);
        changeRonchigramSize();
    });
    constants.borderSize().change(godProcess);
    constants.bandColorRGB().change(godProcess);
    constants.backgroundBandColorRGB().change(godProcess);
    constants.invertBands().change(godProcess);
    constants.backgroundColor().change(e => document.body.style.background = e.target.value);
    constants.RonchiTape().change(godProcess);
    constants.RonchiGrid().change(godProcess);
    constants.btnDrawRuler().change(godProcess);
    constants.rulerTextRGB().change(() => {
        constants.rulerTextColor = rgbToHex(constants.rulerTextRGB().val());
        godProcess();
    });

    constants.pastedImageActive().change(godProcess);
    constants.pastedImageTransparency().change(godProcess);
    constants.pastedImageHeight().change(godProcess);
    constants.pastedImageWidth().change(godProcess);
    constants.pastedImageOffsetX().change(godProcess);
    constants.pastedImageOffsetY().change(godProcess);
    constants.btnDeletedPastedImage().click(deleteImage);

    constants.btnIncreaseGratingOffsets().click(() => {
        setGratingOffsetsFromOffset(constants.gratingOffsetChange);
        godProcess();
    });
    constants.btnDecreaseGratingOffsets().click(() => {
        setGratingOffsetsFromOffset(-constants.gratingOffsetChange);
        godProcess();
    });
    constants.sliderOffset().mousemove(() => {
        setGratingOffsetsFromSliderOffset();
        godProcess();
    });
    constants.sliderOffset().mousedown(() => { MLB.ronchi.constants.sliderOffsetMousedown = true; });
    constants.sliderOffset().mouseup(() => { MLB.ronchi.constants.sliderOffsetMousedown = false; });

    constants.sliderParabolicCorrection().mousemove(() => {
        setParabolicCorrectionFromSliderParabolicCorrection();
        godProcess();
    });
    constants.sliderParabolicCorrection().mousedown(() => { MLB.ronchi.constants.sliderParabolicCorrectionMousedown = true; });
    constants.sliderParabolicCorrection().mouseup(() => { MLB.ronchi.constants.sliderParabolicCorrectionMousedown = false; });

    document.addEventListener('paste', (e) => {
        copyClipboardImage(e);
        godProcess();
    });
    document.addEventListener('dragover', setDropEffectToCopy);
    document.addEventListener('drop', dragAndDropImage);
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (key === 'Delete' || key === 'Escape') {
            deleteImage();
        }
    });

    constants.btnPasteExampleRonchigram16().click(() =>   { pasteExampleRonchigram(constants.exampleImages['16']); });
    constants.btnPasteExampleRonchigram25().click(() =>   { pasteExampleRonchigram(constants.exampleImages['25']); });
    constants.btnPasteExampleRonchigram13().click(() =>   { pasteExampleRonchigram(constants.exampleImages['13']); });
    // can do .grid here because 'grid' is a valid dot name
    constants.btnPasteExampleRonchigramGrid().click(() => { pasteExampleRonchigram(constants.exampleImages.grid);  });

    constants.btnPutData().click(putData);
    constants.btnGetData().click(() => {
        getData();
        godProcess();
    });
    constants.btnShowDataNames().click(showMatchingRonchiLocalStorageItems);
    constants.btnDeleteData().click(removeMatchingRonchiLocalStorageItems);
    constants.distortionResolutionFactor().change(godProcess);
    constants.unwrapBandRuler().change(godProcess);
    constants.showBullseyeZones().change(godProcess);
    constants.btnWavelengthLightUOM().change(godProcess);
    constants.offsetRoC().change(godProcess);

    changeFontSize(constants.startingRonchigramSize);
    // do not set zones to Ronchi bands because plotRonchigramsCalcRonchiTape() which calculates the bands has not been called yet
    resetZonesToOneTenthIncrement();
    godProcess();
});

// end of file
