// copyright Mel Bartels, 2011-2023
// validate https://beautifytools.com/javascript-validator.php

//var MLB, $;

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
    yes: 0,
    no: 1,
    // ruler...
    none: 0,
    zonal: 1,
    zones307093: 2,
    uomCenter: 3,
    uomEdge: 4,
    RonchiTapeMarks: 5,
    noneLit: 'none',
    zonalLit: 'zonal',
    uomCenterLit: 'uomCenter',
    uomEdgeLit: 'uomEdge',
    zones307093Lit: 'zones307093',
    RonchiTapeMarksLit: 'RonchiTapeMarks',
    numZonalRulers: 4,
    rulerColor: 'red',
    rulerThickness: 2,
    // ... ruler
    decimalWaves: 2,
    decimalPercent: 0,
    gratingOffsetDecimalPrecision: 3,
    MLToleranceDecimalPrecision: 3,
    tapeBandPrecision: 2,
    wavefrontAnalysisPrecision: 2,
    tapeBandScalingFactor: 1000,
    tapeHeight: 20,
    // from 0 to 9 = 10 zones
    drawRonchiTapeMarksOnColoredBands: true,
    zoneCount: 10,
    //array of [zone, correctionFactor], eg, [[0, 1.0], [0.1, 0.9] ... [1.0, 1.1]]
    corrections: [],
    minCorrection: undefined,
    maxCorrection: undefined,
    defaultZonesAndCorrections: [[0.0, 1], [0.3, 1], [0.7, 1], [0.93, 1], [1.0, 1]],
    zonesForAnalysis: [0.3, 0.7, 0.93],
    zoneIdLit: 'id=zone',
    zoneId2Lit: 'id="zone',
    zoneCorrectionIdLit: 'id=zoneCorrection',
    zoneCorrectionId2Lit: 'id="zoneCorrection',
    MLToleranceIdLit: 'id=MLTolerance',
    MLToleranceId2Lit: 'id="MLTolerance',
    useZonalCorrectionIdLit: 'id=chBoxUseZonalCorrection',
    useZonalCorrectionIdDoubleQuoteLit: 'id="chBoxUseZonalCorrection',
    pastedImageLit: 'pastedImage',
    exampleImages: {
    // mirrorDia, radiusOfCurvature, centralObstruction, gratingFreq, gratingOffsetSeries, userParabolicCorrection, RonchigramSize, borderSize, invertBands, RonchiTape, RonchiGrid, pastedImageTransparency, pastedImageWidth, pastedImageHeight, pastedImageOffsetX, pastedImageOffsetY
        '16in':  [16.25, 93.6, 0,  65, -0.05, 1, 500, 0,  true, true, false, 0.86, 500, 500,   0,   0, '16/final Ronchigram inside RoC.jpg'],
        '16out': [16.25, 93.6, 0,  65, 0.674, 1, 500, 0,  true, true, false, 0.86, 500, 500,   0,   0, '16/final Ronchigram outside RoC.jpg'],
        '25':    [25.1, 131,   0,  65, 0.776, 1, 400, 10, true, true, false, 0.8,  454, 461, -16, -19, 'RonchiExamples/25 example.jpg'],
        '13':    [13.1,  80.6, 0,  65, 0.570, 1, 250, 10, true, true, false, 0.75, 304, 320, -20, -28, 'RonchiExamples/13 example.jpg'],
        '10':    [10.4,  58.4, 0, 100, 0.362, 1, 400, 10, true, true, false, 0.9,  416, 428,   7,  -5, 'RonchiExamples/10 example.jpg'],
        '6':     [5.9,   33.9, 0, 100, 0.294, 1, 400, 10, true, true, false, 0.9,  530, 496, -60, -40, 'RonchiExamples/6 example.jpg']
    },
    sliderOffsetMousedown: undefined,
    lastSliderOffsetValue: 0,
    lastRonchigramSize: undefined,
    gratingOffsetChange: 0.002,
    pixelArray: undefined,
    images: {},
    MatchingRonchiTestLit: 'MatchingRonchiTest ',
    tapes: [],
    transitions: [],
    weightedMLTolerance: undefined,

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
    invertBands: function () {
        return $('[name=invertBands]');
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
    drawZones307093Ruler: function () {
        return this.btnDrawRuler()[this.zones307093].checked;
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
        return $('td[id=waveNotes]');
    },
    canvasSize: function () {
        return +this.RonchigramSize().val() + 2 * +this.borderSize().val();
    },
    wavelengthLight: function () {
        return $('[name=wavelengthLight]');
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
    btnResetDefaultZones: function () {
        return $('input[id=btnResetDefaultZones]');
    },
    zonalCorrectionTableBody: function () {
        return $('#zonalCorrectionTableBody');
    },
    zonalErrorsResultsLabel: function () {
        return $('[id=zonalErrorsResultsLabel]');
    },
    polishActionCanvasID: function () {
        return $('#polishActionCanvas')[0];
    },
    polishActionCanvasDiv: function () {
        return $('#polishActionCanvasDiv');
    },
    btnPasteExampleRonchigram16in: function () {
        return $('input[id=btnPasteExampleRonchigram16in]');
    },
    btnPasteExampleRonchigram16out: function () {
        return $('input[id=btnPasteExampleRonchigram16out]');
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

    for (x = 0; x < xyLength; x += 1) {
        for (y = 0; y < xyLength; y += 1) {
            if (x * x + y * y < xyLengthSquared) {
                if (invertBands) {
                    pixelArray[x][y] = pixelArray[x][y] === 0 ? 1 : 0;
                }
                if (RonchiTape) {
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

        for (x = 0; x < xyLength; x += 1) {
            for (y = 0; y < xyLength; y += 1) {
                if (x * x + y * y < xyLengthSquared) {
                    pixelArrayGrid[x][y] = pixelArray[y][x];
                }
            }
        }
        for (x = 0; x < xyLength; x += 1) {
            for (y = 0; y < xyLength; y += 1) {
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
        bandColorRGB = constants.bandColorRGB().val().split(','),
        red = +bandColorRGB[0],
        green = +bandColorRGB[1],
        blue = +bandColorRGB[2],
        adjustColorForGrid = MLB.ronchi.adjustColorForGrid,
        opaque = 255,
        gridRed = adjustColorForGrid(red),
        gridGreen = adjustColorForGrid(green),
        gridBlue = adjustColorForGrid(blue),
        RonchiGrid = constants.RonchiGrid()[constants.yes].checked,
        x,
        y,
        xyLength = pixelArray.length;

    for (x = 0; x < xyLength; x += 1) {
        for (y = 0; y < xyLength; y += 1) {
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
        xOnGratingLine,
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
            // test for ray blockage by grating; scaledLineWidth is half the grating frequency
            xOnGratingLine = int((xAtGrating / scaledLineWidth) + 0.5);
            // if band is true, then ray passes through grating
            band = xOnGratingLine % 2 === 0;
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

    transitions = calcRonchiBands(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, userParabolicCorrection);
    constants.transitions.push(transitions);
    tapeMarks = createTapeBandsFromTransitions(mirrorRadius, transitions);
    processPixelArray();
    setImagePixels(imageData, ronchiCenter);

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // now draw the circle that outlines mirror's aperture in the Ronchigram
    drawCircle(context, ronchiCenter, scaledMirrorRadius, 1, 'black');
    // fill in any central obstruction
    fillCircle(context, ronchiCenter, scalingFactor * centralObstruction / 2, 'black');
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

    } else if (constants.drawZones307093Ruler()) {
        constants.zonesForAnalysis.forEach(z => drawCircle(context, RonchiCenter, scaledMirrorRadius * z, constants.rulerThickness, constants.rulerColor));

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

MLB.ronchi.plotRonchigrams = function () {
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
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        drawPolishAction = MLB.ronchi.drawPolishAction;

    if (isNaN(red) || isNaN(green) || isNaN(blue) || red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
        alert("Band color of '" + bandColorRGB + "' not properly entered. Please correct and try again.");
        return;
    }

    mirrorDia = +constants.mirrorDia().val();
    radiusOfCurvature = +constants.radiusOfCurvature().val();
    focalRatio = radiusOfCurvature / mirrorDia / 2;
    userParabolicCorrection = +constants.userParabolicCorrection().val();

    wavesCorrection = inchesToWavesGreenLight(calcSphereParabolaDifference(mirrorDia, focalRatio));

    constants.waveNotes().html(roundToDecimal(wavesCorrection, constants.decimalWaves)
            + " waves correction fitting paraboloid to spheroid at edge or center. "
            + roundToDecimal(wavesCorrection / 4, constants.decimalWaves)
            + " waves best fit minimum paraboloidal deviation at 71% zone.");

    // reset the Ronchi tapes
    constants.tapes = [];
    constants.transitions = [];
    // build canvases for Ronchigrams
    constants.Ronchigrams().html('');
    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        constants.Ronchigrams().append("<canvas id='RonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
        drawRonchigramOnCanvas($('[id=RonchiCanvas' + ix + ']')[0], gratingOffsetSeriesValues[ix], userParabolicCorrection);
    }
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
    // draw the polishing action
    drawPolishAction();
};

MLB.ronchi.setGratingOffsetFromOffset = function (offset) {
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
        setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
        sliderOffsetValue;

    if (!constants.sliderOffsetMousedown) {
        return;
    }

    sliderOffsetValue = parseFloat(constants.sliderOffset().val());
    setGratingOffsetFromOffset(sliderOffsetValue - constants.lastSliderOffsetValue);
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
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        canvas = constants.pastedImageRonchiCanvas();

    saveCanvasImage(canvas);
    savePastedImage(e.target);
    loadPastedImageIntoCanvas(canvas, e.target);
    setPastedImageDefaults();
    setPastedImageActive();
    plotRonchigrams();
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
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive;

    constants.images = {};
    plotRonchigrams();
    setPastedImageInactive();
};

MLB.ronchi.pasteExampleRonchigram = function (exampleImage) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        savePastedImage = MLB.ronchi.savePastedImage,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        setPastedImageActive = MLB.ronchi.setPastedImageActive,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        calcAndDisplayMLTolerances = MLB.ronchi.calcAndDisplayMLTolerances,
        calcMirrorSurfaceProfile = MLB.ronchi.calcMirrorSurfaceProfile,
        canvas = constants.pastedImageRonchiCanvas(),
        image = new Image(),
        mirrorDia,
        RoC,
        ix = 0,
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

    image.onload = function (e) {
        savePastedImage(e.target);
        loadPastedImageIntoCanvas(canvas, e.target);
        setPastedImageActive();
        plotRonchigrams();
        calcAndDisplayMLTolerances();
        calcMirrorSurfaceProfile();
    };
    image.src = exampleImage[ix];

    scrollToTop();
};

MLB.ronchi.scrollToTop = function () {
    $('html,body').animate({
        scrollTop: $('#topDiv').offset().top
    });
};

MLB.ronchi.changeRonchigramSize = function () {
    var constants = MLB.ronchi.constants,
        plotRonchigrams = MLB.ronchi.plotRonchigrams;

    constants.pastedImageWidth().val(constants.canvasSize());
    constants.pastedImageHeight().val(constants.canvasSize());
    constants.pastedImageOffsetX().val(-constants.borderSize().val());
    constants.pastedImageOffsetY().val(-constants.borderSize().val());

    plotRonchigrams();
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
        invertBands: constants.invertBands()[constants.yes].checked,
        RonchiTape: constants.RonchiTape()[constants.yes].checked,
        RonchiGrid: constants.RonchiGrid()[constants.yes].checked,
        drawRuler: constants.btnDrawRulerVal(),
        zonalCorrectionTable: zonalCorrectionTable
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
        case constants.zones307093Lit:
            constants.btnDrawRuler()[constants.zones307093].checked = true;
            break;
        case constants.RonchiTapeMarksLit:
            constants.btnDrawRuler()[constants.RonchiTapeMarks].checked = true;
            break;
        default:
            constants.btnDrawRuler()[constants.none].checked = true;
    }
    for (ix = 0; ix < constants.zoneCount; ix++) {
        row = parsedData.zonalCorrectionTable[ix];
        setNameIndexedElementValue(constants.zoneIdLit, ix, row.zone);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, row.correctionFactor);
        setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, row.use);
    }
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

    // find corrections[] element that fits zone
    for (px = 0; px < correctionsLength; px += 1) {
        if (corrections[px][0] >= zone) {
            break;
        }
    }
    // interpolate for correction
    if (px === 0) { // initial value in table
        correction = corrections[px][1];
    } else if (px === correctionsLength) { // beyond table
        correction = 1;
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
                + '<td class="label">' + 'Zone</td>\r\n'
                + '<td> <input class="inputText" ' + constants.zoneId2Lit + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> </td>\r\n'
                + '<td class="label"> correction factor </td>\r\n'
                + '<td> <input class="inputText" ' + constants.zoneCorrectionId2Lit + ix + '" onfocus="select();" type="number" step="0.05"> </td>\r\n'
                + '<td class="label"> M-L tolerance: </td>\r\n'
                + '<td> <label ' + constants.MLToleranceId2Lit + ix + '"></label> </td>\r\n'
                + '<td class="label"> Use? </td>\r\n'
                + '<td> <input ' + constants.useZonalCorrectionIdDoubleQuoteLit + ix + '" type="checkbox"> </td>\r\n'
                + '</tr>';
        constants.zonalCorrectionTableBody().append(htmlStr);
    }
};

MLB.ronchi.buildZoneAndCorrectionTableDefaultValues = function () {
    var constants = MLB.ronchi.constants,
        defaultZonesAndCorrectionsLength = constants.defaultZonesAndCorrections.length,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        setNameIndexedElementChBoxValue = MLB.ronchi.setNameIndexedElementChBoxValue,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        if (ix < defaultZonesAndCorrectionsLength) {
            setNameIndexedElementValue(constants.zoneIdLit, ix, constants.defaultZonesAndCorrections[ix][0]);
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, constants.defaultZonesAndCorrections[ix][1]);
            setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, true);
        } else {
            setNameIndexedElementValue(constants.zoneIdLit, ix, '');
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
            setNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix, false);
        }
    }
};

MLB.ronchi.buildcorrectionsArray = function () {
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

    constants.minCorrection = Number.MAX_VALUE;
    constants.maxCorrection = Number.MIN_VALUE;
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
        if (correction < constants.minCorrection) {
            constants.minCorrection = correction;
        }
        if (correction > constants.maxCorrection) {
            constants.maxCorrection = correction;
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

// remove correction and use check if zone is not a number
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

MLB.ronchi.calcAndDisplayMLTolerances = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcMillesLacroixTolerance = MLB.calcLib.calcMillesLacroixTolerance,
        calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        setIdIndexedLabelValue = MLB.ronchi.setIdIndexedLabelValue,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        wavelengthLight = +constants.wavelengthLight().val(),
        ix,
        zone,
        MLTolerance,
        parabolicCorrectionForZone,
        correctionTolerance,
        displayToleranceStr,
        useCorrection,
        userEnteredParabolicCorrection,
        weightedMLToleranceCount = 0,
        weightedMLToleranceTotal = 0;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        if (isNaN(zone)) {
            displayToleranceStr = '';
        } else {
            MLTolerance = calcMillesLacroixTolerance(wavelengthLight, mirrorDia, radiusOfCurvature, zone);
            parabolicCorrectionForZone = calcParabolicCorrectionForZone(mirrorDia, radiusOfCurvature, zone);
            if (MLTolerance === Infinity) {
                displayToleranceStr = Infinity;
            } else {
                correctionTolerance = MLTolerance / parabolicCorrectionForZone;
                displayToleranceStr = roundToDecimal(1 - correctionTolerance, constants.MLToleranceDecimalPrecision)
                        + ' to '
                        + roundToDecimal(1 + correctionTolerance, constants.MLToleranceDecimalPrecision);
                // get weighted ML tolerance
                useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
                if (useCorrection) {
                    userEnteredParabolicCorrection = getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix);
                    if (!isNaN(userEnteredParabolicCorrection)) {
                        weightedMLToleranceCount += zone * zone;
                        weightedMLToleranceTotal += Math.abs((userEnteredParabolicCorrection - 1) / correctionTolerance * zone * zone);
                    }
                }
            }
        }
        setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, displayToleranceStr);
    }
    constants.weightedMLTolerance = weightedMLToleranceTotal / weightedMLToleranceCount;
};

MLB.ronchi.calcMirrorSurfaceProfile = function () {
var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        getNameIndexedElementChBoxValue = MLB.ronchi.getNameIndexedElementChBoxValue,
        ix,
        useCorrection,
        zone,
        userEnteredParabolicCorrection,
        zonalRoC,
        fullyParabolizedZonalRoC,
        mirrorZone,
        mirrorZoneSquared,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        MSPdata = [];

    MSPdata.mirrorRadius = mirrorDia / 2;
    MSPdata.RoC = radiusOfCurvature;
    MSPdata.zones = []

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
        userEnteredParabolicCorrection = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        if (isNaN(userEnteredParabolicCorrection)) {
            continue;
        }

        mirrorZone = zone * mirrorDia / 2;
        mirrorZoneSquared = mirrorZone * mirrorZone;
        // eg, for 20 inch F/1 at edge zone, zonalRoC = 20 + 5*5/20 = 20.125
        zonalRoC = radiusOfCurvature + mirrorZoneSquared / radiusOfCurvature * userParabolicCorrection * userEnteredParabolicCorrection;
        fullyParabolizedZonalRoC = radiusOfCurvature + mirrorZoneSquared / radiusOfCurvature;

        MSPdata.zones.push({zone: zone, zonalRoC: zonalRoC, fullyParabolizedZonalRoC: fullyParabolizedZonalRoC});
    }

    MSPdata.zones.sort((a, b) => {
        return a.zone - b.zone;
    });

    // note todo


};

MLB.ronchi.processChangeInZonalErrorTable = function () {
    var buildcorrectionsArray = MLB.ronchi.buildcorrectionsArray,
        calcAndDisplayMLTolerances = MLB.ronchi.calcAndDisplayMLTolerances,
        calcMirrorSurfaceProfile = MLB.ronchi.calcMirrorSurfaceProfile,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        analyzeZonalErrorTable = MLB.ronchi.analyzeZonalErrorTable;

    calcAndDisplayMLTolerances();
    calcMirrorSurfaceProfile();
    buildcorrectionsArray();
    plotRonchigrams();
    analyzeZonalErrorTable();
};

MLB.ronchi.analyzeZonalErrorTable = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        wavefrontErrorFromCorrectionsArray = MLB.calcLib.wavefrontErrorFromCorrectionsArray,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        wavelengthLight = +constants.wavelengthLight().val(),
        getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
        correctionsArray = [],
        analysis;

    constants.zonesForAnalysis.forEach(z => correctionsArray.push(getInterpolatedCorrection(z)));
    analysis = wavefrontErrorFromCorrectionsArray(mirrorDia, radiusOfCurvature, wavelengthLight, correctionsArray, constants.zoneCount);

    constants.zonalErrorsResultsLabel().html('wavefront P-V = '
            + roundToDecimal(analysis.wavefrontPV, constants.wavefrontAnalysisPrecision)
            + ' and RMS = '
            + roundToDecimal(analysis.wavefrontRMS, constants.wavefrontAnalysisPrecision)
            + ' waves (calculated from the 30+70+93% zones);'
            + '<br>weighted ML tolerance = '
            + roundToDecimal(constants.weightedMLTolerance, constants.wavefrontAnalysisPrecision)
            + ' (based on all zones in "use").');
};

MLB.ronchi.drawPolishAction = function () {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        buildCanvasElement = MLB.sharedLib.buildCanvasElement,
        point = MLB.sharedLib.point,
        drawCircle = MLB.sharedLib.drawCircle,
        drawRulers = MLB.ronchi.drawRulers,
        getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
        canvas,
        context,
        scalingFactor,
        circleCenter,
        mirrorRadius,
        scaledMirrorRadius,
        ix,
        correctionFactor,
        polishColor,
        strokeStyle;

    if (constants.lastRonchigramSize !== RonchigramSize) {
        constants.polishActionCanvasDiv().append(buildCanvasElement('polishActionCanvas', RonchigramSize, RonchigramSize));
        constants.lastRonchigramSize = RonchigramSize;
    }
    canvas = constants.polishActionCanvasID();
    context = canvas.getContext('2d');
    circleCenter = point(canvas.width / 2, canvas.height / 2);

    scalingFactor = RonchigramSize / mirrorDia;
    mirrorRadius = mirrorDia / 2;
    scaledMirrorRadius = mirrorRadius * scalingFactor;

    for (ix = 0; ix < scaledMirrorRadius; ix++) {
        correctionFactor = getInterpolatedCorrection(ix / scaledMirrorRadius);
        polishColor = 255 * (correctionFactor - constants.minCorrection) / (constants.maxCorrection - constants.minCorrection);
        strokeStyle = 'rgb(0,0,' + polishColor + ')';
        drawCircle(context, circleCenter, ix, 2, strokeStyle);
    }

    // draw the circle that outlines mirror's aperture
    drawCircle(context, circleCenter, scaledMirrorRadius, 1, 'black');

    if (!constants.drawRonchiTapeMarksRuler()) {
        drawRulers(context, circleCenter, mirrorRadius, scalingFactor, undefined);
    }
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
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        setGratingOffsetsFromSliderOffset = MLB.ronchi.setGratingOffsetsFromSliderOffset,
        setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
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
        buildZoneAndCorrectionTableDefaultValues = MLB.ronchi.buildZoneAndCorrectionTableDefaultValues,
        buildcorrectionsArray = MLB.ronchi.buildcorrectionsArray,
        calcAndDisplayMLTolerances = MLB.ronchi.calcAndDisplayMLTolerances,
        calcMirrorSurfaceProfile = MLB.ronchi.calcMirrorSurfaceProfile,
        analyzeZonalErrorTable = MLB.ronchi.analyzeZonalErrorTable,
        addEventHandlersForEachZonalErrorTableRow = MLB.ronchi.addEventHandlersForEachZonalErrorTableRow,
        processChangeInZonalErrorTable = MLB.ronchi.processChangeInZonalErrorTable,
        sortZonalCorrectionTableByZone = MLB.ronchi.sortZonalCorrectionTableByZone,
        cleanupZonalCorrectionTable = MLB.ronchi.cleanupZonalCorrectionTable,
        copyBandPositionsToErrorTable = MLB.ronchi.copyBandPositionsToErrorTable,
        resetCorrectionFactors = MLB.ronchi.resetCorrectionFactors;

    // build and fill in zone and correction table
    buildZoneAndCorrectionTable();
    buildZoneAndCorrectionTableDefaultValues();
    calcAndDisplayMLTolerances();
    calcMirrorSurfaceProfile();
    buildcorrectionsArray();
    analyzeZonalErrorTable();
    addEventHandlersForEachZonalErrorTableRow();
    constants.btnSortZonalCorrectionTableByZone().click(() => {
        sortZonalCorrectionTableByZone();
        cleanupZonalCorrectionTable();
        calcAndDisplayMLTolerances();
        calcMirrorSurfaceProfile();
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
    constants.btnResetDefaultZones().click(() => {
        buildZoneAndCorrectionTableDefaultValues();
        resetCorrectionFactors();
        processChangeInZonalErrorTable();
    });

    // starting values
    constants.invertBands()[constants.no].checked = true;
    constants.RonchiTape()[constants.no].checked = true;
    constants.RonchiGrid()[constants.no].checked = true;
    constants.btnDrawRuler()[constants.none].checked = true;
    setPastedImageInactive();

    // event hookups/subscribes
    constants.mirrorDia().change(() => {
        // only focalRatio changes
        var mirrorDia = +constants.mirrorDia().val(),
            radiusOfCurvature = +constants.radiusOfCurvature().val();

        constants.focalRatio().val(roundToDecimal(radiusOfCurvature / mirrorDia / 2, 2));
        plotRonchigrams();
    });
    constants.radiusOfCurvature().change(() => {
        // focalLength and focalRatio change
        var mirrorDia = +constants.mirrorDia().val(),
            radiusOfCurvature = +constants.radiusOfCurvature().val();

        constants.focalLength().val(roundToDecimal(radiusOfCurvature / 2, 2));
        constants.focalRatio().val(roundToDecimal(radiusOfCurvature / mirrorDia / 2, 2));
        plotRonchigrams();
    });
    constants.focalLength().change(() => {
        // radiusOfCurvature and focalRatio change
        var mirrorDia = +constants.mirrorDia().val(),
            focalLength = +constants.focalLength().val();

        constants.radiusOfCurvature().val(roundToDecimal(focalLength * 2, 2));
        constants.focalRatio().val(roundToDecimal(focalLength / mirrorDia, 2));
        plotRonchigrams();
    });
    constants.focalRatio().change(() => {
        // radiusOfCurvature and focalLength change
        var mirrorDia = +constants.mirrorDia().val(),
            focalRatio = +constants.focalRatio().val(),
            radiusOfCurvature = mirrorDia * focalRatio * 2;

        constants.radiusOfCurvature().val(roundToDecimal(radiusOfCurvature, 2));
        constants.focalLength().val(roundToDecimal(radiusOfCurvature / 2, 2));
        plotRonchigrams();
    });
    constants.centralObstruction().change(plotRonchigrams);
    constants.gratingFreq().change(plotRonchigrams);
    constants.gratingOffsetSeries().change(plotRonchigrams);
    constants.userParabolicCorrection().change(plotRonchigrams);
    constants.RonchigramSize().change(changeRonchigramSize);
    constants.borderSize().change(plotRonchigrams);
    constants.bandColorRGB().change(plotRonchigrams);
    constants.invertBands().change(plotRonchigrams);
    constants.RonchiTape().change(plotRonchigrams);
    constants.RonchiGrid().change(plotRonchigrams);
    constants.btnDrawRuler().change(plotRonchigrams);

    constants.pastedImageActive().change(plotRonchigrams);
    constants.pastedImageTransparency().change(plotRonchigrams);
    constants.pastedImageHeight().change(plotRonchigrams);
    constants.pastedImageWidth().change(plotRonchigrams);
    constants.pastedImageOffsetX().change(plotRonchigrams);
    constants.pastedImageOffsetY().change(plotRonchigrams);
    constants.btnDeletedPastedImage().click(deleteImage);

    constants.btnIncreaseGratingOffsets().click(() => {
        setGratingOffsetFromOffset(constants.gratingOffsetChange);
        plotRonchigrams();
    });
    constants.btnDecreaseGratingOffsets().click(() => {
        setGratingOffsetFromOffset(-constants.gratingOffsetChange);
        plotRonchigrams();
    });
    constants.sliderOffset().mousemove(() => {
        setGratingOffsetsFromSliderOffset();
        plotRonchigrams();
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

    constants.btnPasteExampleRonchigram16in().click(() => { pasteExampleRonchigram(constants.exampleImages['16in']); });
    constants.btnPasteExampleRonchigram16out().click(() => { pasteExampleRonchigram(constants.exampleImages['16out']); });
    constants.btnPasteExampleRonchigram25().click(() => { pasteExampleRonchigram(constants.exampleImages['25']); });
    constants.btnPasteExampleRonchigram13().click(() => { pasteExampleRonchigram(constants.exampleImages['13']); });
    constants.btnPasteExampleRonchigram10().click(() => { pasteExampleRonchigram(constants.exampleImages['10']); });
    constants.btnPasteExampleRonchigram6().click(() => { pasteExampleRonchigram(constants.exampleImages['6']); });

    constants.btnPutData().click(putData);
    constants.btnGetData().click(() => {
        getData();
        plotRonchigrams();
    });
    constants.btnShowDataNames().click(showMatchingRonchiLocalStorageItems);
    constants.btnDeleteData().click(removeMatchingRonchiLocalStorageItems);

    plotRonchigrams();
});

// end of file