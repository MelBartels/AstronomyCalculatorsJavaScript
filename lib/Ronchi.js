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
    uomCenter: 2,
    uomEdge: 3,
    RonchiTapeMarks: 4,
    noneLit: 'none',
    zonalLit: 'zonal',
    uomCenterLit: 'uomCenter',
    uomEdgeLit: 'uomEdge',
    RonchiTapeMarksLit: 'RonchiTapeMarks',
    numZonalRulers: 4,
    rulerColor: 'red',
    blackColor: 'black',
    textColor: 'blue',
    rulerThickness: 2,
    unwrapRulerThickness: 1,
    // ...ruler

    // rounding precisions...
    decimalWaves: 2,
    gratingOffsetDecimalPrecision: 3,
    MLToleranceDecimalPrecision: 3,
    tapeBandPrecision: 2,
    wavefrontAnalysisPrecision: 2,
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
    //array of [zone, correctionFactor], eg, [[0, 1.0], [0.1, 0.9] ... [1.0, 1.1]]
    corrections: [],
    weightedMLTolerance: undefined,
    MSPZones: undefined,
    MSPZonesStats: undefined,
    zoneIdLit: 'id=zone',
    zoneId2Lit: 'id="zone',
    zoneCorrectionIdLit: 'id=zoneCorrection',
    zoneCorrectionId2Lit: 'id="zoneCorrection',
    RoCChangeIdLit: 'id=RoCCorrection',
    RoCChangeId2Lit: 'id="RoCCorrection',
    MLToleranceIdLit: 'id=MLTolerance',
    MLToleranceId2Lit: 'id="MLTolerance',
    useZonalCorrectionIdLit: 'id=chBoxUseZonalCorrection',
    useZonalCorrectionIdDoubleQuoteLit: 'id="chBoxUseZonalCorrection',
    // ...zones

    // parabolic distortions...
    RonchigramDistortions: [],
    displayUnwrappedRonchigram: false,
    // ...parabolic distortions

    // charts...
    RonchigramCount: undefined,
    font: '12pt arial',
    opaque: 255,
    MSPCanvasLit: 'MSPCanvas',
    MSPChartSize: {x: 500, y: 200},
    MSPMarginY: 0.25,
    MSPCanvasColor: 'lightgray',
    MSPColor: 'green',
    // ...charts

    // images...
    pastedImageLit: 'pastedImage',
    exampleImages: {
    // mirrorDia, radiusOfCurvature, centralObstruction, gratingFreq, gratingOffsetSeries, userParabolicCorrection, RonchigramSize, borderSize, invertBands, RonchiTape, RonchiGrid, pastedImageTransparency, pastedImageWidth, pastedImageHeight, pastedImageOffsetX, pastedImageOffsetY, imageSource, displayUnwrappedRonchigram, unwrapY, stretchX, distortionResolutionFactor, unwrapBandRuler
        '16': [16.25, 93.6,  0,  65, -0.05, 1, 500,  0, true, false, false,  0.9, 500, 500,   1,   0, MLB.base64images._16, true, false, 1, 3, true],
        '30': [29.8, 162.5,  0,  65, 0.908, 1, 500,  0, true, false, false,  0.8, 500, 500,   0,   0, MLB.base64images._30, true, false, 2, 2, true],
        '25': [25.1, 131,    0,  65, 0.776, 1, 400, 10, true, false, false,  0.8, 454, 461, -16, -19, MLB.base64images._25, true, false, 2, 2, true],
        '10': [10.4,  58.4,  0, 100, -0.04, 1, 250,  0, true, false, false,  0.9, 250, 250,   0,   0, MLB.base64images._10, true, false, 1, 3, true],
         '6': [5.9,   33.9,  0, 100, 0.294, 1, 400, 10, true, false, false,  0.9, 530, 496, -60, -40, MLB.base64images._6,  true, false, 2, 2, true],
        '13': [13.1,  80.6,  0,  65, 0.570, 1, 250, 10, true, false, false, 0.75, 304, 320, -20, -28, MLB.base64images._13, true, false, 2, 2, true]
    },
    images: {},
    lastRonchigramSize: undefined,
    MatchingRonchiTestLit: 'MatchingRonchiTest ',
    // ...images

    // controls...
    sliderOffsetMousedown: undefined,
    lastSliderOffsetValue: 0,
    gratingOffsetChange: 0.002,
    wavelengthLightImperial: 0.000022,
    wavelengthLightMetric: 0.00056,
    // ...controls

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
    drawUomCenterRuler: function () {
        return this.btnDrawRuler()[this.uomCenter].checked;
    },
    drawUomEdgeRuler: function () {
        return this.btnDrawRuler()[this.uomEdge].checked;
    },
    drawRonchiTapeMarksRuler: function () {
        return this.btnDrawRuler()[this.RonchiTapeMarks].checked;
    },
    Ronchigrams: function () {
        return $('[id=Ronchigrams]');
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
    wavelengthLightUOM: function () {
        return $('[name=wavelengthLightUOM]');
    },
    btnUpdateZonalCorrectionTable: function () {
        return $('input[id=btnUpdateZonalCorrectionTable]');
    },
    btnSortZonalCorrectionTableByZone: function () {
        return $('input[id=btnSortZonalCorrectionTableByZone]');
    },
    btnResetCorrectionFactors: function () {
        return $('input[id=btnResetCorrectionFactors]');
    },
    btnCopyBands: function () {
        return $('input[id=btnCopyBands]');
    },
    btn11Zones: function () {
        return $('input[id=btn11Zones]');
    },
    zonalCorrectionTableBody: function () {
        return $('#zonalCorrectionTableBody');
    },
    MSPResultsLabel: function () {
        return $('[id=MSPResultsLabel]');
    },
    zonalErrorsResultsLabel: function () {
        return $('[id=zonalErrorsResultsLabel]');
    },
    MSPCanvasID: function () {
        return $('#MSPCanvas')[0];
    },
    MSPCanvasDiv: function () {
        return $('#MSPCanvasDiv');
    },
    btnPasteExampleRonchigram16: function () {
        return $('input[id=btnPasteExampleRonchigram16]');
    },
    btnPasteExampleRonchigram30: function () {
        return $('input[id=btnPasteExampleRonchigram30]');
    },
    btnPasteExampleRonchigram25: function () {
        return $('input[id=btnPasteExampleRonchigram25]');
    },
    btnPasteExampleRonchigram13: function () {
        return $('input[id=btnPasteExampleRonchigram13]');
    },
    btnPasteExampleRonchigram10: function () {
        return $('input[id=btnPasteExampleRonchigram10]');
    },
    btnPasteExampleRonchigram6: function () {
        return $('input[id=btnPasteExampleRonchigram6]');
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
    btnUnwrapFirstRonchigram: function () {
        return $('input[id=btnUnwrapFirstRonchigram]');
    },
    btnDeleteUnwrap: function () {
        return $('input[id=btnDeleteUnwrap]');
    },
    unwrapY: function () {
        return $('[name=unwrapY]');
    },
    stretchX: function () {
        return $('[name=stretchX]');
    },
    unwrapBandRuler: function () {
        return $('input[name=unwrapBandRuler]');
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
    },
    offsetRoC: function () {
        return $('[name=offsetRoC]');
    }
};

MLB.ronchi.getWavelengthLight = function () {
    var constants = MLB.ronchi.constants;

    if (constants.wavelengthLightUOM()[constants.imperial].checked) {
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

Note that by convention, the band is colored on the mirror's face when the light ray passes through the grating. As a user I want to see the Ronchi Tape marks on the colored bands, which is logically inverted. Accordingly, I use config.drawRonchiTapeBandsOnColoredBands which is set to true, to control on which bands the tape marks appear.

scaling up the Ronchigram size makes computed values more accurate (catches the edge of the grating lines with more resolution)
*/

MLB.ronchi.createTapeBandsFromTransitions = function (mirrorRadius, transitions) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        drawRonchiTapeMarksOnColoredBands = constants.drawRonchiTapeMarksOnColoredBands,
        invertBands = constants.invertBands()[constants.yes].checked,
        tapeBandPrecision = constants.tapeBandPrecision,
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
        tapeMarks.push(roundToDecimal((transitionA + transitionB ) / 2, tapeBandPrecision));
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
        drawRulers = MLB.ronchi.drawRulers;

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
    // draw the circular ruler if any
    drawRulers(context, ronchiCenter, mirrorRadius, scalingFactor, tapeMarks);
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
            drawCircle(context, RonchiCenter, scaledMirrorRadius * ix / constants.numZonalRulers, constants.rulerThickness, constants.rulerColor);
        }

    } else if (constants.drawUomCenterRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(mirrorRadius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorRadius; ix += uomIncrement) {
            drawCircle(context, RonchiCenter, scalingFactor * ix, constants.rulerThickness, constants.rulerColor);
        }

    } else if (constants.drawUomEdgeRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(mirrorRadius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorRadius; ix += uomIncrement) {
            drawCircle(context, RonchiCenter, scaledMirrorRadius - scalingFactor * ix, constants.rulerThickness, constants.rulerColor);
        }

    } else if (constants.drawRonchiTapeMarksRuler()) {
        tapeMarksLength = tapeMarks.length;
        scaledTapeHeight = scaledMirrorRadius / constants.tapeHeight;

        drawLine(context, constants.rulerColor, constants.rulerThickness, point(RonchiCenter.x - scaledMirrorRadius, RonchiCenter.y), point(RonchiCenter.x + scaledMirrorRadius, RonchiCenter.y));

        upperY = RonchiCenter.y + scaledTapeHeight;
        lowerY = RonchiCenter.y - scaledTapeHeight;
        for (ix = 0; ix < tapeMarksLength; ix++) {
            leftX = RonchiCenter.x - tapeMarks[ix] * scalingFactor;
            rightX = RonchiCenter.x + tapeMarks[ix] * scalingFactor;
            drawLine(context, constants.rulerColor, constants.rulerThickness, point(leftX, upperY), point(leftX, lowerY));
            drawLine(context, constants.rulerColor, constants.rulerThickness, point(rightX, upperY), point(rightX, lowerY));
        }
        if (RonchiGrid) {
            drawLine(context, constants.rulerColor, constants.rulerThickness, point(RonchiCenter.x, RonchiCenter.y - scaledMirrorRadius), point(RonchiCenter.x, RonchiCenter.y + scaledMirrorRadius));

            leftX = RonchiCenter.x + scaledTapeHeight;
            rightX = RonchiCenter.x - scaledTapeHeight;
            for (ix = 0; ix < tapeMarksLength; ix++) {
                lowerY = RonchiCenter.y - tapeMarks[ix] * scalingFactor;
                upperY = RonchiCenter.y + tapeMarks[ix] * scalingFactor;
                drawLine(context, constants.rulerColor, constants.rulerThickness, point(leftX, upperY), point(rightX, upperY));
                drawLine(context, constants.rulerColor, constants.rulerThickness, point(leftX, lowerY), point(rightX, lowerY));
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

MLB.ronchi.plotRonchigramsCalcRonchiTaps = function () {
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

    constants.waveNotes().html(roundToDecimal(wavesCorrection, constants.decimalWaves)
            + " waves correction fitting paraboloid to spheroid at edge or center; "
            + roundToDecimal(wavesCorrection / 4, constants.decimalWaves)
            + " waves best fit minimum paraboloidal deviation at 71% zone; "
            + roundToDecimal(wavesCorrection * userParabolicCorrection, constants.decimalWaves)
            + " waves for parabolic correction factor entered above."
    );

    // reset the Ronchi tapes
    constants.tapes = [];
    constants.transitions = [];

    // build canvases for Ronchigrams...
    // start by 'zeroing out' the html
    constants.Ronchigrams().html('');
    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        constants.Ronchigrams().append("&emsp; <canvas id='RonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
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
    matchingTapeBandStr += '<br>See the <a href="#MatchingRonchiTape">Ronchi Tape Band discussion</a>.';
    constants.matchingRonchiTapeBands().html(matchingTapeBandStr);

    if (constants.displayUnwrappedRonchigram) {
        MLB.ronchi.unwrapFirstRonchigram();
    }
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

MLB.ronchi.calcRonchigramDistortions = function () {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        gratingFreq = +constants.gratingFreq().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        distortionResolutionFactor = +constants.distortionResolutionFactor().val(),
        int = MLB.sharedLib.int,
        decodeGratingOffsetSeries = MLB.ronchi.decodeGratingOffsetSeries,
        getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
        mirrorRadius = mirrorDia / 2,
        gratingOffset,
        // eg, 2 means that the RonchigramDistortions array is twice the size in x and twice the size in y for an area increase of 4x of the RonchigramSize;
        // this to fill in the voids that occur while unwrapping the Ronchigram
        scalingFactor = RonchigramSize / mirrorDia * distortionResolutionFactor,
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
        unwrapY = constants.unwrapY()[constants.yes].checked,
        stretchX = constants.stretchX().val(),
        unwrapBandRuler = constants.unwrapBandRuler()[constants.yes].checked,
        DRF = +constants.distortionResolutionFactor().val(),
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
        distortionRatio,
        distortionOffsetX,
        distortionOffsetY,
        yDir,
        xDir,
        yIx_DRF,
        xIx_DRF,
        distortionOffsetY_DRF,
        distortionOffsetX_DRF,
        distortionDRXSet = [],
        distortionNewCount = 0,
        distortionAlreadySetCount = 0;

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

    constants.Ronchigrams().append("&emsp; <canvas id='RonchiCanvas" + unwrapRonchigramIx + "' width='" + canvasSize * stretchX + "' height='" + canvasSize + "'></canvas>");
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
            /* eg, distortionRatios for default Ronchigram (no Y axis unwrap and setting distortionResolutionFactor to 1):
                yIx,xIx: 0,0   = NaN
                         0,1   = 0.577
                         0,124 = 1
                         62,1  = 0.683
                         62,108= 1.004
                         120,35= 1.007
               distortionRatio for 16F2.9 example (no Y axis unwrap):
                         0,1   = 0.126
            */
            distortion = RGDx.distortion;
            distortionRatio = Math.abs(distortion / maxDistortion);

            if (unwrapY) {
                distortionOffsetY = int(yIx * distortionRatio);
            } else {
                distortionOffsetY = yIx;
            }
            distortionOffsetX = int(xIx * distortionRatio * stretchX);

            // DRF = distortion resolution factor: need more resolution in the distortion array compared to the Ronchigram so that, when the Ronchigram is unwrapped, there are no gaps in the displayed pixels
            yIx_DRF = yIx / DRF;
            xIx_DRF = xIx / DRF;
            distortionOffsetY_DRF = distortionOffsetY / DRF;
            distortionOffsetX_DRF = distortionOffsetX / DRF;

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
    unwrapContext.fillStyle = constants.textColor;
    unwrapContext.font = constants.font;
    unwrapContext.fillText('Unwrapped 1st Ronchigram', 2, 12);

    // draw rulers...

    if (unwrapBandRuler) {
        drawUnwrapBandRuler(unwrapCanvas, unwrapContext, unwrapRonchiCenter, unwrapY, stretchX, RGD, DRF, maxDistortion);
    }
};

MLB.ronchi.drawUnwrapBandRuler = function (unwrapCanvas, unwrapContext, unwrapRonchiCenter, unwrapY, stretchX, RGD, DRF, maxDistortion) {
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
        unwrapIx,
        unwrapIxStretch;

    //constants.tapes set in createTapeBandsFromTransitions(), called from drawRonchigramOnCanvas(), called from plotRonchigramsCalcRonchiTaps()
    // eg, [0, '2.62', '4.34', '5.54']
    constants.tapes[0].forEach(t => {
        // eg, 0, 0.4366666666666667, 0.7233333333333333, 0.9233333333333333
        tapeBandRelativeX = t / mirrorDia * 2;
        // eg, 125
        maxIx = RGD[0].length;
        // eg, 0, 54, 90, 115
        wrappedIx = int(tapeBandRelativeX * maxIx); // not + 0.5 which results in wrong wrappedIx
        // eg, NaN, 1.1394363845604456, 1.3870024448314904, 1.6313480674892065
        distortion = RGD[0][wrappedIx].distortion;
        // eg, NaN, 0.6571967980034353, 0.7999863598509095, 0.9409184583802662
        distortionRatio = Math.abs(distortion / maxDistortion);
        // eg, 0, 35, 71, 108
        unwrapIx = int(wrappedIx * distortionRatio / DRF + 0.5);
        unwrapIxStretch = int(wrappedIx * distortionRatio * stretchX / DRF + 0.5);
        // vertical ruler
        drawLine(unwrapContext, constants.rulerColor, constants.unwrapRulerThickness, point(unwrapRonchiCenter.x + unwrapIxStretch, 0), point(unwrapRonchiCenter.x + unwrapIxStretch, unwrapCanvas.height));
        drawLine(unwrapContext, constants.rulerColor, constants.unwrapRulerThickness, point(unwrapRonchiCenter.x - unwrapIxStretch, 0), point(unwrapRonchiCenter.x - unwrapIxStretch, unwrapCanvas.height));
        // horizontal ruler
        if (unwrapY) {
            drawLine(unwrapContext, constants.rulerColor, constants.unwrapRulerThickness, point(0, unwrapRonchiCenter.y + unwrapIx), point(unwrapCanvas.width, unwrapRonchiCenter.y + unwrapIx));
            drawLine(unwrapContext, constants.rulerColor, constants.unwrapRulerThickness, point(0, unwrapRonchiCenter.y - unwrapIx), point(unwrapCanvas.width, unwrapRonchiCenter.y - unwrapIx));
        }
    });
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
        plotRonchigramsCalcRonchiTaps = MLB.ronchi.plotRonchigramsCalcRonchiTaps,
        canvas = constants.pastedImageRonchiCanvas();

    saveCanvasImage(canvas);
    savePastedImage(e.target);
    loadPastedImageIntoCanvas(canvas, e.target);
    setPastedImageDefaults();
    setPastedImageActive();
    plotRonchigramsCalcRonchiTaps();
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
        plotRonchigramsCalcRonchiTaps = MLB.ronchi.plotRonchigramsCalcRonchiTaps,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive;

    constants.images = {};
    plotRonchigramsCalcRonchiTaps();
    setPastedImageInactive();
};

MLB.ronchi.pasteExampleRonchigram = function (exampleImage) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        savePastedImage = MLB.ronchi.savePastedImage,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        setPastedImageActive = MLB.ronchi.setPastedImageActive,
        plotRonchigramsCalcRonchiTaps = MLB.ronchi.plotRonchigramsCalcRonchiTaps,
        copyBandPositionsToErrorTable = MLB.ronchi.copyBandPositionsToErrorTable,
        resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors,
        processChangeInZonalErrorTable = MLB.ronchi.processChangeInZonalErrorTable,
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
    constants.displayUnwrappedRonchigram = exampleImage[ix++];

    constants.unwrapY()[constants.yes].checked = exampleImage[ix++];
    constants.unwrapY()[constants.no].checked = !constants.unwrapY()[constants.yes].checked;

    constants.stretchX().val(exampleImage[ix++]);
    constants.distortionResolutionFactor().val(exampleImage[ix++]);

    constants.unwrapBandRuler()[constants.yes].checked = exampleImage[ix++];
    constants.unwrapBandRuler()[constants.no].checked = !constants.unwrapBandRuler()[constants.yes].checked;

    image.onload = function (e) {
        savePastedImage(e.target);
        loadPastedImageIntoCanvas(canvas, e.target);
        setPastedImageActive();
        plotRonchigramsCalcRonchiTaps();
        copyBandPositionsToErrorTable();
        resetCorrectionFactors();
        processChangeInZonalErrorTable();
    };
    image.src = imgSrc;

    scrollToTop();
};

MLB.ronchi.scrollToTop = function () {
    $('html,body').animate({
        scrollTop: $('#topDiv').offset().top
    });
};

MLB.ronchi.changeRonchigramSize = function () {
    var constants = MLB.ronchi.constants,
        plotRonchigramsCalcRonchiTaps = MLB.ronchi.plotRonchigramsCalcRonchiTaps;

    constants.pastedImageWidth().val(constants.canvasSize());
    constants.pastedImageHeight().val(constants.canvasSize());
    constants.pastedImageOffsetX().val(-constants.borderSize().val());
    constants.pastedImageOffsetY().val(-constants.borderSize().val());

    plotRonchigramsCalcRonchiTaps();
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
        unwrapY: constants.unwrapY()[constants.yes].checked,
        stretchX: constants.stretchX().val(),
        distortionResolutionFactor: constants.distortionResolutionFactor().val(),
        unwrapBandRuler: constants.unwrapBandRuler()[constants.yes].checked,
        zonalCorrectionTable: zonalCorrectionTable,
        offsetRoC: constants.offsetRoC().val()
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

    constants.unwrapY()[constants.yes].checked = parsedData.unwrapY;
    constants.unwrapY()[constants.no].checked = !parsedData.unwrapY;

    constants.stretchX().val(parsedData.stretchX);
    constants.distortionResolutionFactor().val(parsedData.distortionResolutionFactor);

    constants.unwrapBandRuler()[constants.yes].checked = parsedData.unwrapBandRuler;
    constants.unwrapBandRuler()[constants.no].checked = !parsedData.unwrapBandRuler;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        row = parsedData.zonalCorrectionTable[ix];
        setNameIndexedElementValue(constants.zoneIdLit, ix, row.zone);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, row.correctionFactor);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, row.use);
    }

    constants.offsetRoC().val(parsedData.offsetRoC);
};

// zone can range from 0 to 1: comes from user defined corrections per zones
MLB.ronchi.getInterpolatedCorrection = function (zone) {
    var constants = MLB.ronchi.constants,
        corrections = constants.corrections,
        correctionsLength = corrections.length,
        px,
        correction,
        zoneA,
        zoneB,
        contactA,
        contactB;

    if (correctionsLength === 0) {
        return 1;
    }

    // find corrections[] element that fits zone
    for (px = 0; px < correctionsLength; px++) {
        if (corrections[px][0] >= zone) {
            break;
        }
    }
    // interpolate for correction
    if (px === 0) { // initial value in table
        correction = corrections[px][1];
    } else if (px === correctionsLength) { // beyond table so use last correction
        correction = corrections[correctionsLength - 1][1];
    } else { // interpolate between 2 values
        zoneA = corrections[px - 1][0];
        zoneB = corrections[px][0];
        contactA = corrections[px - 1][1];
        contactB = corrections[px][1];
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
                + '<td class="label">M-L tol: \r\n'
                + '<td> <label ' + constants.MLToleranceId2Lit + ix + '"></label> \r\n'
                + '<td class="label">&emsp; RoC chg: \r\n'
                + '<td> <label ' + constants.RoCChangeId2Lit + ix + '"></label> \r\n'
                + '<td class="label">&emsp;Use? \r\n'
                + '<td> <input ' + constants.useZonalCorrectionIdDoubleQuoteLit + ix + '" type="checkbox"> \r\n';

        constants.zonalCorrectionTableBody().append(htmlStr);
    }
};

MLB.ronchi.buildZonalCorrectionsArrayForRonchigrams = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        corrections = [],
        ix,
        useCorrection,
        zone,
        correction,
        zoneZeroFound,
        zoneOneFound;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
        if (!useCorrection) {
            continue;
        }
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        if (isNaN(zone) || isNaN(correction)) {
            continue;
        }
        if (zone === 0) {
            zoneZeroFound = true;
        }
        if (zone === 1) {
            zoneOneFound = true;
        }
        corrections.push([zone, correction]);
    }
    // supply default values if necessary
    if (!zoneZeroFound) {
        corrections.push([0, 1]);
    }
    if (!zoneOneFound) {
        corrections.push([1, 1]);
    }
    constants.corrections = corrections.sort();
};

MLB.ronchi.sortZonalCorrectionTableByZone = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        corrections = [],
        sortedCorrections,
        ix,
        useCorrection,
        zone,
        correction,
        val;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        corrections.push([zone, correction, useCorrection]);
    }
    sortedCorrections = corrections.sort((a, b) => {
        if (isNaN(a[0])) {
            return 1;
        }
        if (isNaN(b[0])) {
            return -1;
        }
        return a[0] - b[0];
    });

    for (ix = 0; ix < constants.zoneCount; ix++) {
        val = sortedCorrections[ix][0];
        if (isNaN(val)) {
            val = '';
        }
        setNameIndexedElementValue(constants.zoneIdLit, ix, val);

        val = sortedCorrections[ix][1];
        if (isNaN(val)) {
            val = '';
        }
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, val);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, sortedCorrections[ix][2]);
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
            bandVal = roundToDecimal(constants.tapes[0][tapeIx] / mirrorRadius, constants.tapeBandPrecision);

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

MLB.ronchi.calcAndDisplayRoCChangesAndMLTolerances = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcMillesLacroixTolerance = MLB.calcLib.calcMillesLacroixTolerance,
        calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        setIdIndexedLabelValue = MLB.ronchi.setIdIndexedLabelValue,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        getWavelengthLight = MLB.ronchi.getWavelengthLight,
        wavelengthLight = getWavelengthLight(),
        ix,
        zone,
        userEnteredZonalParabolicCorrection,
        zoneIsANumber,
        userEnteredZonalParabolicCorrectionIsANumber,
        RoCChange,
        RoCChangeStr,
        MLTolerance,
        parabolicCorrectionForZone,
        correctionTolerance,
        displayToleranceStr,
        useCorrection,
        weightedMLToleranceCount = 0,
        weightedMLToleranceTotal = 0;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = (getNameIndexedElementValue(constants.zoneIdLit, ix));
        userEnteredZonalParabolicCorrection = getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix);
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);

        zoneIsANumber = zone.trim() != '' && !isNaN(zone);
        userEnteredZonalParabolicCorrectionIsANumber = userEnteredZonalParabolicCorrection.trim() != '' && !isNaN(userEnteredZonalParabolicCorrection);

        if (!zoneIsANumber) {
            setIdIndexedLabelValue(constants.RoCChangeIdLit, ix, '');
            setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, '');
            continue;
        }

        parabolicCorrectionForZone = calcParabolicCorrectionForZone(mirrorDia, radiusOfCurvature, zone);

        if (userEnteredZonalParabolicCorrectionIsANumber) {
            RoCChange = parabolicCorrectionForZone * userEnteredZonalParabolicCorrection;
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

            // get weighted ML tolerance
            if (useCorrection) {
                if (!isNaN(userEnteredZonalParabolicCorrection)) {
                    weightedMLToleranceCount += zone * zone;
                    weightedMLToleranceTotal += Math.abs((userEnteredZonalParabolicCorrection - 1) / correctionTolerance * zone * zone);
                }
            }
        }

        setIdIndexedLabelValue(constants.RoCChangeIdLit, ix, RoCChangeStr);
        setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, displayToleranceStr);
    }
    constants.weightedMLTolerance = weightedMLToleranceTotal / weightedMLToleranceCount;

    constants.zonalErrorsResultsLabel().html('Weighted ML tolerance = '
            + roundToDecimal(constants.weightedMLTolerance, constants.wavefrontAnalysisPrecision)
    );
};

MLB.ronchi.calcMirrorSurfaceProfilePlotWriteResults = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        plotMirrorSurfaceProfileWriteResults = MLB.ronchi.plotMirrorSurfaceProfileWriteResults,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        offsetRoC = +constants.offsetRoC().val(),
        getWavelengthLight = MLB.ronchi.getWavelengthLight,
        wavelengthLight = getWavelengthLight(),
        MSPZones = constants.MSPZones = [],
        ix,
        useCorrection,
        zone,
        userEnteredZonalParabolicCorrection,
        mirrorZone,
        mirrorZoneSquared,
        zonalFocalRatio,
        idealWavesCorrection,
        parabolicCorrectionForZone,
        perfectParabolicCorrectionForZone,
        userRoCChg,
        waveErrorFactor,
        waveError;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        // guards
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
        if (!useCorrection) {
            continue;
        }
        // the following two values must be valid numbers; note the parseFloat before the isNaN
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        if (isNaN(zone)) {
            continue;
        }
        userEnteredZonalParabolicCorrection = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        if (isNaN(userEnteredZonalParabolicCorrection)) {
            continue;
        }
        // zone 0, the mirror's center, has no parabolic correction, ie, the mirror's center defines the RoC
        if (zone === 0) {
            MSPZones.push({
                zone: 0,
                waveError: 0
            });
            continue;
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
        // user adjustments from perfect...
        userRoCChg = perfectParabolicCorrectionForZone * userEnteredZonalParabolicCorrection + offsetRoC;
        /* compare userRoCChg to perfectParabolicCorrectionForZone
            ex: userRoCChg = perfect then error = 0
                userRoCChg = 0 then error = idealWavesCorrection (no correction at all means spherical, so error is the full idealWavesCorrection)
                userRoCChg = 2x perfect, then error = idealWavesCorrection (dbl correction is like spherical but error has opposite sign)
        */
        waveErrorFactor = (perfectParabolicCorrectionForZone - userRoCChg) / perfectParabolicCorrectionForZone;
        waveError = idealWavesCorrection * waveErrorFactor;

        MSPZones.push({
            zone: zone,
            waveError: waveError
        });
    }
    MSPZones.sort((a, b) => {
        return a.zone - b.zone;
    });
    /*
    console.log('begin MSPZones...');
    MSPZones.forEach(z => console.log('    ' + z.zone + ' ' + z.waveError));
    console.log('...end MSPZones');
    */

    plotMirrorSurfaceProfileWriteResults();
};

MLB.ronchi.plotMirrorSurfaceProfileWriteResults = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        int = MLB.sharedLib.int,
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        drawLine = MLB.sharedLib.drawLine,
        rect = MLB.sharedLib.rect,
        fillRect = MLB.sharedLib.fillRect,
        point = MLB.sharedLib.point,
        fillPolygon = MLB.sharedLib.fillPolygon,
        points = [],
        canvas,
        context,
        chartCenter,
        MSPZones = constants.MSPZones,
        MSPZonesLength = MSPZones.length,
        // so that a value of 0 compares properly
        highestWaveError = -Number.MAX_VALUE,
        lowestWaveError = Number.MAX_VALUE,
        waveErrorRange,
        waveErrorAvg,
        rmsCount = 0,
        rms = 0,
        MSPZonesStats = constants.MSPZonesStats = [],
        xScale,
        yScale,
        MSPChartData = [],
        MSPChartSize = constants.MSPChartSize,
        waveErrorSurfaceRangeY,
        lowestZoneY = Number.MAX_VALUE,
        highestZoneY = Number.MIN_VALUE,
        zoneLineY,
        integerWaveErrorY;

    constants.MSPCanvasDiv().append(buildCanvasElement(constants.MSPCanvasLit, MSPChartSize.x, MSPChartSize.y));
    canvas = constants.MSPCanvasID();
    context = canvas.getContext('2d');
    fillRect(context, constants.MSPCanvasColor, rect(0, 0, MSPChartSize.x, MSPChartSize.y));
    chartCenter = point(MSPChartSize.x / 2, MSPChartSize.y / 2);

    MSPZones.forEach(z => {
        if (z.waveError > highestWaveError) {
            highestWaveError = z.waveError;
        }
        if (z.waveError < lowestWaveError) {
            lowestWaveError = z.waveError;
        }
        rmsCount += z.zone * z.zone;
        rms += z.waveError * z.waveError * z.zone * z.zone;
    });
    waveErrorRange = highestWaveError - lowestWaveError;
    MSPZonesStats.wavePV = waveErrorRange;
    MSPZonesStats.waveRMS = Math.sqrt(rms / rmsCount);

    // x scaling is from chart center to edge denoting mirror center to mirror edge
    xScale = MSPChartSize.x / 2;
    // mirror surface wave error is 1/2 wavefront error
    waveErrorSurfaceRangeY = int(waveErrorRange / 2 + 1);
    yScale = MSPChartSize.y * (1 - constants.MSPMarginY * 2) / waveErrorSurfaceRangeY;

    // convert from zone data to chart data which is laid out horizontally
    MSPZones.forEach(z => {
        MSPChartData.push({
            x: z.zone * xScale,
            // mirror surface wave error is 1/2 wavefront error
            y: (z.waveError - highestWaveError) / 2 * yScale + constants.MSPMarginY * MSPChartSize.y,
        });
    });

    // draw line denoting integer wave error
    integerWaveErrorY = (waveErrorSurfaceRangeY - waveErrorSurfaceRangeY) * yScale + constants.MSPMarginY * MSPChartSize.y;
    drawLine(context, constants.blackColor, constants.rulerThickness, point(0, integerWaveErrorY), point(MSPChartSize.x, integerWaveErrorY));
    context.fillStyle = constants.rulerColor;
    context.font = constants.font;
    context.fillText('mirror surface P-V wave error of ' + waveErrorSurfaceRangeY, 2, integerWaveErrorY - 4);

    // draw grid denoting mirror zones
    MSPChartData.forEach(d => {
        drawLine(context, constants.rulerColor, constants.rulerThickness, point(chartCenter.x + d.x, integerWaveErrorY), point(chartCenter.x + d.x, MSPChartSize.y));
        drawLine(context, constants.rulerColor, constants.rulerThickness, point(chartCenter.x - d.x, integerWaveErrorY), point(chartCenter.x - d.x, MSPChartSize.y));
    });

    // draw MSP data as a filled polygon
    MSPChartData.forEach(d => {
        var y = chartCenter.y + d.y;
        points.push(point(chartCenter.x + d.x, y));
        // save low/high y values (appears as bottom most)
        if (y > highestZoneY) {
            highestZoneY = y;
        }
        if (y < lowestZoneY) {
            lowestZoneY = y;
        }
    });
    points.push(point(chartCenter.x + MSPChartData[MSPZonesLength - 1].x, MSPChartSize.y));
    points.push(point(chartCenter.x - MSPChartData[MSPZonesLength - 1].x, MSPChartSize.y));
    MSPChartData.reverse().forEach(d => {
        points.push(point(chartCenter.x - d.x, chartCenter.y + d.y));
    });
    fillPolygon(context, points, constants.MSPColor);

    // draw line denoting lowest zone: lowest zone 'y' value but highest plot 'y' value
    zoneLineY = highestZoneY + constants.rulerThickness * 2;
    drawLine(context, constants.blackColor, constants.rulerThickness, point(0, zoneLineY), point(MSPChartSize.x, zoneLineY));

    // write out wave error results (mirror error on surface is half that at the wavefront)
    constants.MSPResultsLabel().html('Mirror surface P-V = '
            + roundToDecimal(MSPZonesStats.wavePV / 2, constants.wavefrontAnalysisPrecision)
            + ' and RMS = '
            + roundToDecimal(MSPZonesStats.waveRMS / 2, constants.wavefrontAnalysisPrecision)
    );
};

MLB.ronchi.processChangeInZonalErrorTable = function () {
    MLB.ronchi.calcAndDisplayRoCChangesAndMLTolerances();
    MLB.ronchi.buildZonalCorrectionsArrayForRonchigrams();
    MLB.ronchi.calcMirrorSurfaceProfilePlotWriteResults();
    MLB.ronchi.plotRonchigramsCalcRonchiTaps();
};

MLB.ronchi.addEventHandlersForEachZonalErrorTableRow = function () {
    var constants = MLB.ronchi.constants,
        processChangeInZonalErrorTable = MLB.ronchi.processChangeInZonalErrorTable,
        ix,
        getNameIndexedElement = MLB.ronchi.getNameIndexedElement;

    // add in change event handlers for each zone, correction and use flag
    for (ix = 0; ix < constants.zoneCount; ix++) {
        getNameIndexedElement(constants.zoneIdLit, ix).change(processChangeInZonalErrorTable);
        getNameIndexedElement(constants.zoneCorrectionIdLit, ix).change(processChangeInZonalErrorTable);
        getNameIndexedElement(constants.useZonalCorrectionIdLit, ix).change(processChangeInZonalErrorTable);
    }
};

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive,
        plotRonchigramsCalcRonchiTaps = MLB.ronchi.plotRonchigramsCalcRonchiTaps,
        setGratingOffsetsFromSliderOffset = MLB.ronchi.setGratingOffsetsFromSliderOffset,
        setGratingOffsetsFromOffset = MLB.ronchi.setGratingOffsetsFromOffset,
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
        calcMirrorSurfaceProfilePlotWriteResults = MLB.ronchi.calcMirrorSurfaceProfilePlotWriteResults,
        addEventHandlersForEachZonalErrorTableRow = MLB.ronchi.addEventHandlersForEachZonalErrorTableRow,
        buildZonalCorrectionsArrayForRonchigrams = MLB.ronchi.buildZonalCorrectionsArrayForRonchigrams,
        calcAndDisplayRoCChangesAndMLTolerances = MLB.ronchi.calcAndDisplayRoCChangesAndMLTolerances,
        processChangeInZonalErrorTable = MLB.ronchi.processChangeInZonalErrorTable,
        sortZonalCorrectionTableByZone = MLB.ronchi.sortZonalCorrectionTableByZone,
        cleanupZonalCorrectionTable = MLB.ronchi.cleanupZonalCorrectionTable,
        copyBandPositionsToErrorTable = MLB.ronchi.copyBandPositionsToErrorTable,
        resetZonesToOneTenthIncrement = MLB.ronchi.resetZonesToOneTenthIncrement,
        resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors;

    // starting values
    document.body.style.background = constants.backgroundColor().val();
    constants.invertBands()[constants.no].checked = true;
    constants.RonchiTape()[constants.no].checked = true;
    constants.RonchiGrid()[constants.no].checked = true;
    //constants.btnDrawRuler()[constants.none].checked = true;
    constants.btnDrawRuler()[constants.RonchiTapeMarks].checked = true;
    constants.unwrapY()[constants.no].checked = true;
    constants.unwrapBandRuler()[constants.yes].checked = true;
    setPastedImageInactive();
    constants.displayUnwrappedRonchigram = true;
    constants.wavelengthLightUOM()[constants.imperial].checked = true;

    // build and fill in zone and correction table
    buildZoneAndCorrectionTable();
    addEventHandlersForEachZonalErrorTableRow();
    constants.btnUpdateZonalCorrectionTable().click(processChangeInZonalErrorTable);
    constants.btnSortZonalCorrectionTableByZone().click(() => {
        sortZonalCorrectionTableByZone();
        cleanupZonalCorrectionTable();
        calcAndDisplayRoCChangesAndMLTolerances();
        buildZonalCorrectionsArrayForRonchigrams();
        calcMirrorSurfaceProfilePlotWriteResults();
    });
    constants.btnResetCorrectionFactors().click(() => {
        resetCorrectionFactors();
        processChangeInZonalErrorTable();
    });
    constants.btnCopyBands().click(() => {
        copyBandPositionsToErrorTable();
        resetCorrectionFactors();
        processChangeInZonalErrorTable();
    });
    constants.btn11Zones().click(() => {
        resetZonesToOneTenthIncrement();
        resetCorrectionFactors();
        processChangeInZonalErrorTable();
    });

    // event hookups/subscribes
    constants.mirrorDia().change(() => {
        // keep FR, adjust RoC and FL
        var mirrorDia = +constants.mirrorDia().val(),
            focalRatio = +constants.focalRatio().val();

        constants.radiusOfCurvature().val(roundToDecimal(mirrorDia * focalRatio * 2, 2));
        constants.focalLength().val(roundToDecimal(mirrorDia * focalRatio, 2));
        plotRonchigramsCalcRonchiTaps();
    });
    constants.radiusOfCurvature().change(() => {
        // change FL and FR
        var mirrorDia = +constants.mirrorDia().val(),
            radiusOfCurvature = +constants.radiusOfCurvature().val();

        constants.focalLength().val(roundToDecimal(radiusOfCurvature / 2, 2));
        constants.focalRatio().val(roundToDecimal(radiusOfCurvature / mirrorDia / 2, 2));
        plotRonchigramsCalcRonchiTaps();
    });
    constants.focalLength().change(() => {
        // change RoC and FR
        var mirrorDia = +constants.mirrorDia().val(),
            focalLength = +constants.focalLength().val();

        constants.radiusOfCurvature().val(roundToDecimal(focalLength * 2, 2));
        constants.focalRatio().val(roundToDecimal(focalLength / mirrorDia, 2));
        plotRonchigramsCalcRonchiTaps();
    });
    constants.focalRatio().change(() => {
        // change RoC and FL
        var mirrorDia = +constants.mirrorDia().val(),
            focalRatio = +constants.focalRatio().val(),
            radiusOfCurvature = mirrorDia * focalRatio * 2;

        constants.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, 2));
        constants.focalLength().val(roundToDecimal(radiusOfCurvature / 2, 2));
        plotRonchigramsCalcRonchiTaps();
    });
    constants.centralObstruction().change(plotRonchigramsCalcRonchiTaps);
    constants.gratingFreq().change(plotRonchigramsCalcRonchiTaps);
    constants.gratingOffsetSeries().change(plotRonchigramsCalcRonchiTaps);
    constants.userParabolicCorrection().change(plotRonchigramsCalcRonchiTaps);
    constants.RonchigramSize().change(changeRonchigramSize);
    constants.borderSize().change(plotRonchigramsCalcRonchiTaps);
    constants.bandColorRGB().change(plotRonchigramsCalcRonchiTaps);
    constants.backgroundBandColorRGB().change(plotRonchigramsCalcRonchiTaps);
    constants.invertBands().change(plotRonchigramsCalcRonchiTaps);
    constants.backgroundColor().change(e => document.body.style.background = e.target.value);
    constants.RonchiTape().change(plotRonchigramsCalcRonchiTaps);
    constants.RonchiGrid().change(plotRonchigramsCalcRonchiTaps);
    constants.btnDrawRuler().change(plotRonchigramsCalcRonchiTaps);

    constants.pastedImageActive().change(plotRonchigramsCalcRonchiTaps);
    constants.pastedImageTransparency().change(plotRonchigramsCalcRonchiTaps);
    constants.pastedImageHeight().change(plotRonchigramsCalcRonchiTaps);
    constants.pastedImageWidth().change(plotRonchigramsCalcRonchiTaps);
    constants.pastedImageOffsetX().change(plotRonchigramsCalcRonchiTaps);
    constants.pastedImageOffsetY().change(plotRonchigramsCalcRonchiTaps);
    constants.btnDeletedPastedImage().click(deleteImage);

    constants.btnIncreaseGratingOffsets().click(() => {
        setGratingOffsetsFromOffset(constants.gratingOffsetChange);
        plotRonchigramsCalcRonchiTaps();
    });
    constants.btnDecreaseGratingOffsets().click(() => {
        setGratingOffsetsFromOffset(-constants.gratingOffsetChange);
        plotRonchigramsCalcRonchiTaps();
    });
    constants.sliderOffset().mousemove(() => {
        setGratingOffsetsFromSliderOffset();
        plotRonchigramsCalcRonchiTaps();
    });
    constants.sliderOffset().mousedown(() => { MLB.ronchi.constants.sliderOffsetMousedown = true; });
    constants.sliderOffset().mouseup(() => { MLB.ronchi.constants.sliderOffsetMousedown = false; });

    document.addEventListener('paste', copyClipboardImage);
    document.addEventListener('dragover', setDropEffectToCopy);
    document.addEventListener('drop', dragAndDropImage);
    document.addEventListener('keydown', function(event) {
            const key = event.key;
            if (key === 'Delete' || key === 'Escape') {
                deleteImage();
            }
        });

    constants.btnPasteExampleRonchigram16().click(() => { pasteExampleRonchigram(constants.exampleImages['16']); });
    constants.btnPasteExampleRonchigram30().click(() => { pasteExampleRonchigram(constants.exampleImages['30']); });
    constants.btnPasteExampleRonchigram25().click(() => { pasteExampleRonchigram(constants.exampleImages['25']); });
    constants.btnPasteExampleRonchigram10().click(() => { pasteExampleRonchigram(constants.exampleImages['10']); });
    constants.btnPasteExampleRonchigram6().click(()  => { pasteExampleRonchigram(constants.exampleImages['6']);  });
    constants.btnPasteExampleRonchigram13().click(() => { pasteExampleRonchigram(constants.exampleImages['13']); });

    constants.btnPutData().click(putData);
    constants.btnGetData().click(() => {
        getData();
        plotRonchigramsCalcRonchiTaps();
    });
    constants.btnShowDataNames().click(showMatchingRonchiLocalStorageItems);
    constants.btnDeleteData().click(removeMatchingRonchiLocalStorageItems);
    constants.btnUnwrapFirstRonchigram().click(() => {
        constants.displayUnwrappedRonchigram = true;
        plotRonchigramsCalcRonchiTaps();
    });
    constants.btnDeleteUnwrap().click(() => {
        constants.displayUnwrappedRonchigram = false;
        plotRonchigramsCalcRonchiTaps();
    });
    constants.unwrapY().change(plotRonchigramsCalcRonchiTaps);
    constants.stretchX().change(plotRonchigramsCalcRonchiTaps);
    constants.distortionResolutionFactor().change(plotRonchigramsCalcRonchiTaps);
    constants.unwrapBandRuler().change(plotRonchigramsCalcRonchiTaps);

    constants.offsetRoC().change(() => {
        calcAndDisplayRoCChangesAndMLTolerances();
        buildZonalCorrectionsArrayForRonchigrams();
        calcMirrorSurfaceProfilePlotWriteResults();
    });
    constants.wavelengthLightUOM().change(() => {
        calcAndDisplayRoCChangesAndMLTolerances();
        buildZonalCorrectionsArrayForRonchigrams();
        calcMirrorSurfaceProfilePlotWriteResults();
    });

    plotRonchigramsCalcRonchiTaps();
    copyBandPositionsToErrorTable();
    calcAndDisplayRoCChangesAndMLTolerances();
    buildZonalCorrectionsArrayForRonchigrams();
    calcMirrorSurfaceProfilePlotWriteResults();
});

// end of file
