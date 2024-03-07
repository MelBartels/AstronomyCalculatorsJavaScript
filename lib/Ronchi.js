// copyright Mel Bartels, 2011-2024
// validate https://beautifytools.com/javascript-validator.php
// image to base64 string https://codebeautify.org/image-to-base64-converter

//var MLB;

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
    blackColor: 'black',
    rulerTextColor: '#ff0000',
    rulerThickness: 2,
    // ...ruler

    // rounding precisions...
    dimensionDecimalPrecision: 1,
    wavesDecimalPrecision: 2,
    gratingOffsetDecimalPrecision: 3,
    tapeBandDecimalPrecision: 2,
    MLToleranceDecimalPrecision: 2,
    parabolicCorrectionDisplayPrecision: 2,
    // ...rounding precisions

    // tape bands...
    tapes: [],
    nullTapes: [],
    transitions: [],
    pixelArray: undefined,
    // ...tape bands

    // zones...
    zoneCount: 11, // for 0 to 1 in 0.1 increments
    //array of [zone, correctionFactor], eg, [[0, 1.0], [0.1, 0.9] ... [1.0, 1.1]] as numbers
    userZonalCorrections: [],
    savedCorrections: [],
    peakValleyMLTolerance: undefined,
    weightedMLTolerance: undefined,
    zoneIdLit: 'id=zone',
    zoneId2Lit: 'id="zone',
    zoneCorrectionIdLit: 'id=zoneCorrection',
    zoneCorrectionId2Lit: 'id="zoneCorrection',
    MLToleranceIdLit: 'id=MLTolerance',
    MLToleranceId2Lit: 'id="MLTolerance',
    zoneResultIdLit: 'id=zoneResult',
    zoneResult2Lit: 'id="zoneResult',
    goodColor: 'lightgreen',
    fairColor: 'yellow',
    badColor: 'red',
    // ...zones

    // parabolic distortions...
    RonchigramDistortions: [],
    smallestZeroGratingOffsetForNullRonchigram: 0.000001,
    // ...parabolic distortions

    // charts...
    RonchigramCount: undefined,
    startingRonchigramSize: 400,
    fontRatio: 30,
    fontSize: 12,
    fontLit: 'pt arial',
    opaque: 255,
    zonesSideViewLit: 'zonesSideView',
    parabCorrLit: 'ParCorr=',
    nullLit: 'Software nulled',
    // ...charts

    // images...
    pastedImageLit: 'pastedImage',
    exampleImages: {
    // mirrorDia, radiusOfCurvature, centralObstruction, gratingFreq, gratingOffset, userParabolicCorrection, RonchigramSize, invertBands, RonchiGrid, zonalRuler, pastedImageTransparency, pastedImageWidth, pastedImageHeight, pastedImageOffsetX, pastedImageOffsetY, imageSource, distortionResolutionFactor, showBullseyeZones, thinBands
        'thirteen':       [13.1,  80.6,  0,  65, -0.104,  1, 400, false, false, false, 0.75, 400, 400,   0,   0, MLB.base64images._13,   3, false, false],
        'thirteen2':      [13.1,  80.6,  0,  65, -0.106,  1, 400, true,  false, false, 1.0,  400, 400,  -1,   0, MLB.base64images._13,   3, false, true],
        'thirteenGrid':   [13.1,  80.6,  0,  65, -0.454,  1, 400, true,  true,  false,  0.9, 398, 402,   0,  -5, MLB.base64images._grid, 2, false, false],
        'twelveF5Under':  [12,     120,  3, 100, -0.178,  1, 400, false, false,  true, 0.85, 400, 400,  -3,   0, MLB.base64images._12F5, 2, false, false],
        'twelveF5Under2': [12,     120,  0, 100, -0.178,  1, 400, false, false, false,    1, 400, 400,  -3,   0, MLB.base64images._12F5, 2, false, true]
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
    yesLit: 'yes',
    imperialLit: 'imperial',
    wavelengthLightImperial: 0.000022,
    wavelengthLightMetric: 0.00056,
    // ...controls

    // ...wave errors
    waveErrors: [],
    waveErrorsWhereLowestIsZero: [],
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
    gratingOffset: function () {
        return $('[name=gratingOffset]');
    },
    btnIncreaseGratingOffset: function () {
        return $('input[id=btnIncreaseGratingOffset]');
    },
    btnDecreaseGratingOffset: function () {
        return $('input[id=btnDecreaseGratingOffset]');
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
    RonchiGrid: function () {
        return $('[name=RonchiGrid]');
    },
    zonalRuler: function () {
        return $('[name=zonalRuler]');
    },
    rulerTextRGB: function () {
        return $('[name=rulerTextRGB]');
    },
    Ronchigrams: function () {
        return $('[id=Ronchigrams]');
    },
    zonalErrorsNotesDiv: function () {
        return $('[id=zonalErrorsNotesDiv]');
    },
    tapeBandsDiv: function () {
        return $('[id=tapeBandsDiv]');
    },
    waveNotes: function () {
        return $('[id=waveNotes]');
    },
    canvasSize: function () {
        return +this.RonchigramSize().val();
    },
    chainWaveErrors: function () {
        return $('[name=chainWaveErrors]');
    },
    chainWaveErrorsVal: function () {
        return $('[name=chainWaveErrors]:checked').val();
    },
    chainWaveErrorsSelected: function () {
        return this.chainWaveErrors()[this.yes].checked;
    },
    wavelengthLightUOM: function () {
        return $('[name=wavelengthLightUOM]');
    },
    wavelengthLightUOMVal: function () {
        return $('[name=wavelengthLightUOM]:checked').val();
    },
    imperialSelected: function () {
        return this.wavelengthLightUOM()[this.imperial].checked;
    },
    metricSelected: function () {
        return this.wavelengthLightUOM()[this.metric].checked;
    },
    offsetRoC: function () {
        return $('[name=offsetRoC]');
    },
    waveErrorsLabel: function () {
        return $('[id=waveErrorsLabel]');
    },
    btnSortZonalCorrectionTableByZone: function () {
        return $('input[id=btnSortZonalCorrectionTableByZone]');
    },
    btnCopyBands: function () {
        return $('input[id=btnCopyBands]');
    },
    btn10Zones: function () {
        return $('input[id=btn10Zones]');
    },
    btnResetCorrectionFactors: function () {
        return $('input[id=btnResetCorrectionFactors]');
    },
    btnResetCorrectionFactorsToParabCorrection: function () {
        return $('input[id=btnResetCorrectionFactorsToParabCorrection]');
    },
    btnSaveCorrections: function () {
        return $('input[id=btnSaveCorrections]');
    },
    btnRestoreCorrections: function () {
        return $('input[id=btnRestoreCorrections]');
    },
    zonalCorrectionTableBody: function () {
        return $('#zonalCorrectionTableBody');
    },
    zonalErrorsResultsLabel: function () {
        return $('[id=zonalErrorsResultsLabel]');
    },
    zonesSideViewID: function () {
        return $('#zonesSideView')[0];
    },
    zonesSideViewDiv: function () {
        return $('#zonesSideViewDiv');
    },
    btnPasteExampleRonchigram13: function () {
        return $('input[id=btnPasteExampleRonchigram13]');
    },
    btnPasteExampleRonchigram13_2: function () {
        return $('input[id=btnPasteExampleRonchigram13_2]');
    },
    btnPasteExampleRonchigramGrid: function () {
        return $('input[id=btnPasteExampleRonchigramGrid]');
    },
    btnPasteExampleRonchigram12F5Under: function () {
        return $('input[id=btnPasteExampleRonchigram12F5Under]');
    },
    btnPasteExampleRonchigram12F5Under2: function () {
        return $('input[id=btnPasteExampleRonchigram12F5Under2]');
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
    showBullseyeZones: function () {
        return $('input[name=showBullseyeZones]');
    },
    thinBands: function () {
        return $('input[name=thinBands]');
    },
    distortionResolutionFactor: function () {
        return $('[name=distortionResolutionFactor]');
    },
    btnDecreaseGratingOffset2: function () {
        return $('input[id=btnDecreaseGratingOffset2]');
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

    if (constants.wavelengthLightUOM()[constants.imperial].checked) {
        return constants.wavelengthLightImperial;
    }
    return constants.wavelengthLightMetric;
};

MLB.ronchi.processPixelArray = function () {
    var constants = MLB.ronchi.constants,
        pixelArray = constants.pixelArray,
        invertBands = constants.invertBands()[constants.yes].checked,
        RonchiGrid = constants.RonchiGrid()[constants.yes].checked,
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

Note that by convention, the band is colored on the mirror's face when the light ray passes through the grating.

scaling up the Ronchigram size makes computed values more accurate (catches the edge of the grating lines with more resolution)
*/

MLB.ronchi.createTapeBandsFromTransitions = function (mirrorRadius, transitions) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        invertBands = constants.invertBands()[constants.yes].checked,
        tapeBandDecimalPrecision = constants.tapeBandDecimalPrecision,
        transitionsLength = transitions.length,
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
        canvasSize = constants.canvasSize(),
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
        calcRonchiBands = MLB.ronchi.calcRonchiBands,
        createTapeBandsFromTransitions = MLB.ronchi.createTapeBandsFromTransitions,
        processPixelArray = MLB.ronchi.processPixelArray,
        setImagePixels = MLB.ronchi.setImagePixels,
        drawRulers = MLB.ronchi.drawRulers,
        noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection,
        returnConcatenatedMirrorDiaFocalRatio = MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio;

    context = canvas.getContext("2d");

    scalingFactor = canvasSize / mirrorDia;
    mirrorRadius = mirrorDia / 2;
    scaledMirrorRadius = mirrorRadius * scalingFactor;
    ronchiCenter = point(canvasSize / 2, canvasSize / 2);

    // create a new pixel array
    imageData = context.createImageData(canvasSize, canvasSize);
    setImageDataToBackgroundBandColor(imageData, canvasSize, canvasSize);
    transitions = calcRonchiBands(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, userParabolicCorrection);
    constants.transitions.push(transitions);
    createTapeBandsFromTransitions(mirrorRadius, transitions);
    processPixelArray();
    setImagePixels(imageData, ronchiCenter);

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // now draw the circle that outlines mirror's aperture in the Ronchigram
    drawCircle(context, ronchiCenter, scaledMirrorRadius, 1, constants.blackColor);
    // fill in any central obstruction
    fillCircle(context, ronchiCenter, scalingFactor * centralObstruction / 2, constants.blackColor);
    // draw circular rulers if any
    drawRulers(context, ronchiCenter, mirrorRadius, scalingFactor);
    // note if parabolic correction != 1
    noteParabolicCorrection(context, ronchiCenter.x);
    // add mirror size + FR; relies on fillStyle and font being set in the function noteParabolicCorrection() called the line above
    context.fillText(returnConcatenatedMirrorDiaFocalRatio(), 2, constants.fontSize);
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

MLB.ronchi.drawRulers = function (context, RonchiCenter, mirrorRadius, scalingFactor) {
    var constants = MLB.ronchi.constants,
        drawCircle = MLB.sharedLib.drawCircle,
        zonalRuler = constants.zonalRuler()[constants.yes].checked,
        zoneCount = constants.zoneCount,
        ix,
        scaledMirrorRadius = mirrorRadius * scalingFactor;

    if (zonalRuler) {
        for (ix = 0; ix < zoneCount; ix++) {
            drawCircle(context, RonchiCenter, scaledMirrorRadius * ix / zoneCount, constants.rulerThickness, constants.rulerTextColor);
        }
    }
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
        gratingOffset = +constants.gratingOffset().val(),
        bandColorRGB = constants.bandColorRGB().val().split(','),
        red = +bandColorRGB[0],
        green = +bandColorRGB[1],
        blue = +bandColorRGB[2],
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        inchesToWavesGreenLight = MLB.calcLib.inchesToWavesGreenLight,
        RonchigramIx = 0,
        mirrorDia,
        radiusOfCurvature,
        focalRatio,
        userParabolicCorrection,
        wavesCorrection,
        matchingTapeBandStr,
        drawRonchigramOnCanvas = MLB.ronchi.drawRonchigramOnCanvas,
        canvasSize = constants.canvasSize(),
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
    constants.Ronchigrams().append("<canvas id='RonchiCanvas" + RonchigramIx + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas> &emsp;");
    drawRonchigramOnCanvas($('[id=RonchiCanvas' + RonchigramIx + ']')[0], gratingOffset, userParabolicCorrection);

    constants.RonchigramCount = RonchigramIx + 1;
    // load pasted image into first Ronchigram
    if (constants.pastedImageActiveIsChecked() && constants.images[constants.pastedImageLit] !== undefined) {
        loadPastedImageIntoCanvas(constants.pastedImageRonchiCanvas(), constants.images[constants.pastedImageLit]);
    }
    // display the tapes
    matchingTapeBandStr = '<p>The Ronchi bands cross the center at radii: ';
    constants.tapes.forEach(function (tape, RonchigramIx) {
        matchingTapeBandStr += 'Ronchigram <b>#' + (RonchigramIx + 1) + ': ' + tape.join(', ') + '</b>; ';
    });
    // remove that last '; '
    matchingTapeBandStr = matchingTapeBandStr.slice(0, -2);
    matchingTapeBandStr += '. See the <a href="#RonchiTape">Ronchi Tape Band discussion</a>.';
    constants.tapeBandsDiv().html(matchingTapeBandStr);
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

MLB.ronchi.calcRonchigramDistortions = function () {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        gratingFreq = +constants.gratingFreq().val(),
        gratingOffset = +constants.gratingOffset().val(),
        canvasSize = constants.canvasSize(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
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
        RGD = [];

    // if gratingOffset === 0 then xGratingLineNumberDoubledSphere becomes 0 and parabolicDistortion becomes infinite
    if (gratingOffset === 0) {
        gratingOffset = constants.smallestZeroGratingOffsetForNullRonchigram;
    }
    // eg, 2 means that the RonchigramDistortions array is twice the size in x and twice the size in y for an area increase of 4x of the canvasSize;
    // this to fill in the voids that occur while nullping the Ronchigram
    scalingFactor = canvasSize / mirrorDia * DRF;
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

MLB.ronchi.nullFirstRonchigram = function () {
    var constants = MLB.ronchi.constants,
        canvasSize = constants.canvasSize(),
        nullRonchigramIx = constants.RonchigramCount,
        showBullseyeZones = constants.showBullseyeZones()[constants.yes].checked,
        DRF = MLB.ronchi.getAndFixDistortionResolutionFactor(),
        int = MLB.sharedLib.int,
        point = MLB.sharedLib.point,
        nullSetPixel = MLB.ronchi.nullSetPixel,
        setImageDataToBackgroundBandColor = MLB.ronchi.setImageDataToBackgroundBandColor,
        calcRonchigramDistortions = MLB.ronchi.calcRonchigramDistortions,
        calcNullRuler = MLB.ronchi.calcNullRuler,
        drawNullRuler = MLB.ronchi.drawNullRuler,
        nullCanvas,
        context,
        nullImageData,
        pastedImageContext,
        origImg,
        origRonchiCenter,
        nullRonchiCenter,
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
        scaleNullRonchigram = MLB.ronchi.scaleNullRonchigram,
        noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection,
        returnConcatenatedMirrorDiaFocalRatio = MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio;

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

    constants.Ronchigrams().append("<canvas id='RonchiCanvas" + nullRonchigramIx + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
    nullCanvas = $('[id=RonchiCanvas' + nullRonchigramIx + ']')[0];
    context = nullCanvas.getContext("2d"); // or .getContext("2d", {willReadFrequently: true});
    nullImageData = context.createImageData(nullCanvas.width, nullCanvas.height);
    setImageDataToBackgroundBandColor(nullImageData, nullCanvas.width, nullCanvas.height);
    nullRonchiCenter = point(nullCanvas.width / 2, nullCanvas.height / 2);

    /* apply the calculated ideal distortion quadrant to each original Ronchigram quadrant, filling in gaps;
       distortion calculated in calcRonchiBands() by comparing the parabolic ray height at the offset grating to the spherical ray height
       while we have the x,y distortion, get the original image x,y pixels from each quadrant and apply the distortion to get the new nulled x,y pixels;
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
            nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, nullRonchiCenter, nullImageData, origImg);
            // upper right quadrant
            xDir = 1;
            yDir = -1;
            nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, nullRonchiCenter, nullImageData, origImg);
            // upper left quadrant
            xDir = -1;
            yDir = -1;
            nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, nullRonchiCenter, nullImageData, origImg);
            // lower left quadrant
            xDir = -1;
            yDir = 1;
            nullSetPixel(yIx_DRF, xIx_DRF, yDir, xDir, distortionOffsetY_DRF, distortionOffsetX_DRF, origRonchiCenter, nullRonchiCenter, nullImageData, origImg);
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
        scaleNullRonchigram(scalingFactor, canvasSize, context);
    }

    // draw rulers...
    calcNullRuler(nullRonchiCenter, RGD, DRF, maxDistortion, scalingFactor);
    drawNullRuler(context, canvasSize, constants.rulerThickness);

    // note if parabolic correction != 1
    noteParabolicCorrection(context, origRonchiCenter.x);
    // relies on context fillStyle and font being set
    context.fillText(constants.nullLit, 2, constants.fontSize);
    context.fillText(returnConcatenatedMirrorDiaFocalRatio(), 2, constants.fontSize * 2 + 2);

    constants.RonchigramCount++;
};

MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio = () => {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        mirrorDia = +constants.mirrorDia().val(),
        focalRatio = +constants.focalRatio().val();

    return roundToDecimal(mirrorDia, constants.dimensionDecimalPrecision)
            + 'F'
            + roundToDecimal(focalRatio, constants.dimensionDecimalPrecision);
};

MLB.ronchi.scaleNullRonchigram = function (scalingFactor, canvasSize, context) {
    var scaleImageData = MLB.sharedLib.scaleImageData,
        cornerOffsetXY;

    cornerOffsetXY = canvasSize * (scalingFactor - 1) / 2;
    context.putImageData(scaleImageData(context.getImageData(0, 0, canvasSize, canvasSize), scalingFactor), -cornerOffsetXY, -cornerOffsetXY);
};

MLB.ronchi.calcNullRuler = function (nullRonchiCenter, RGD, DRF, maxDistortion, scalingFactor) {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        int = MLB.sharedLib.int,
        tapeBandRelativeX,
        maxIx,
        nulledIx,
        distortion,
        distortionRatio,
        //s = '',
        nullIx,
        nullIxStretch,
        nullIxStretchScaled,
        nullTapes = [],
        leftVerticalRulerIx,
        rightVerticalRulerIx;

    //constants.tapes set in createTapeBandsFromTransitions(), called from drawRonchigramOnCanvas(), called from plotRonchigramsCalcRonchiTape()
    constants.tapes[0].forEach(t => {
        tapeBandRelativeX = t / mirrorDia * 2;
        // eg, 125
        maxIx = RGD[0].length;
        nulledIx = int(tapeBandRelativeX * maxIx); // not + 0.5 which results in wrong nulledIx
        distortion = RGD[0][nulledIx].distortion;
        distortionRatio = Math.abs(distortion / maxDistortion);
        nullIx = int(nulledIx * distortionRatio / DRF + 0.5);
        nullIxStretch = int(nulledIx * distortionRatio / DRF + 0.5);
        nullIxStretchScaled = nullIxStretch * scalingFactor;
        // vertical rulers, one to the right and one to the left of center
        leftVerticalRulerIx = nullRonchiCenter.x - nullIxStretchScaled;
        rightVerticalRulerIx = nullRonchiCenter.x + nullIxStretchScaled;
        nullTapes.push(leftVerticalRulerIx);
        nullTapes.push(rightVerticalRulerIx);
        /*
        s += 'tapeBandRelativeX: ' + tapeBandRelativeX
            + ', nulledIx: ' + nulledIx
            + ', distortion: ' + distortion
            + ', distortionRatio: ' + distortionRatio
            + ', nullIx: ' + nullIx
            + ', nullIxStretch: ' + nullIxStretch
            + ', scalingFactor: ' + scalingFactor
            + ', nullIxStretchScaled: ' + nullIxStretchScaled
            + '\n';
        */
    });
    constants.nullTapes = nullTapes;
    //console.log(s);
    /* default example:
        tapeBandRelativeX: 0, nulledIx: 0, distortion: NaN, distortionRatio: NaN, nullIx: 0, nullIxStretch: 0, scalingFactor: 1.0025062656641603, nullIxStretchScaled: 0
        tapeBandRelativeX: 0.43333333333333335, nulledIx: 173, distortion: 1.1397591898001271, distortionRatio: 0.6543114053020872, nullIx: 57, nullIxStretch: 57, scalingFactor: 1.0025062656641603, nullIxStretchScaled: 57.14285714285714
        tapeBandRelativeX: 0.7233333333333333, nulledIx: 289, distortion: 1.389691118875957, distortionRatio: 0.7977919871714432, nullIx: 115, nullIxStretch: 115, scalingFactor: 1.0025062656641603, nullIxStretchScaled: 115.28822055137844
        tapeBandRelativeX: 0.9233333333333333, nulledIx: 369, distortion: 1.634776674581454, distortionRatio: 0.9384903696087267, nullIx: 173, nullIxStretch: 173, scalingFactor: 1.0025062656641603, nullIxStretchScaled: 173.43358395989975

    set FR to 3 and grating offset to 0.36 for outside of RoC:
        tapeBandRelativeX: 0, nulledIx: 0, distortion: NaN, distortionRatio: NaN, nullIx: 0, nullIxStretch: 0, scalingFactor: 2.1739130434782608, nullIxStretchScaled: 0
        tapeBandRelativeX: 0.17500000000000002, nulledIx: 70, distortion: 0.9785245325429985, distortionRatio: 0.9785288221005743, nullIx: 34, nullIxStretch: 34, scalingFactor: 2.1739130434782608, nullIxStretchScaled: 73.91304347826086
        tapeBandRelativeX: 0.375, nulledIx: 150, distortion: 0.9014634146341465, distortionRatio: 0.9014673663789325, nullIx: 68, nullIxStretch: 68, scalingFactor: 2.1739130434782608, nullIxStretchScaled: 147.82608695652172
        tapeBandRelativeX: 0.6933333333333334, nulledIx: 277, distortion: 0.6647610048982241, distortionRatio: 0.6647639190107576, nullIx: 92, nullIxStretch: 92, scalingFactor: 2.1739130434782608, nullIxStretchScaled: 200
        tapeBandRelativeX: 0.9633333333333334, nulledIx: 385, distortion: 0.35438245057567563, distortionRatio: 0.35438400408187304, nullIx: 68, nullIxStretch: 68, scalingFactor: 2.1739130434782608, nullIxStretchScaled: 147.82608695652172 <= note the wrap around (147.82... should match with the 3rd band's 147.82... )
    */
};

MLB.ronchi.drawNullRuler = (context, canvasSize, thickness) => {
    var constants = MLB.ronchi.constants,
        nullTapes = constants.nullTapes,
        RonchiGrid = constants.RonchiGrid()[constants.yes].checked,
        drawLine = MLB.sharedLib.drawLine,
        point = MLB.sharedLib.point;

    nullTapes.forEach(ix => drawLine(context, constants.rulerTextColor, thickness, point(ix, 0), point(ix, canvasSize)));
    if (RonchiGrid) {
        // horizontal ruler
        nullTapes.forEach(ix => drawLine(context, constants.rulerTextColor, thickness, point(0, ix), point(canvasSize, ix)));
    }
};

MLB.ronchi.nullSetPixel = function (yIx, xIx, yDir, xDir, distortionOffsetY, distortionOffsetX, origRonchiCenter, nullRonchiCenter, nullImageData, origImg) {
    var setPixel = MLB.sharedLib.setPixel,
        int = MLB.sharedLib.int,
        origY = int(origRonchiCenter.y + yIx * yDir),
        origX = int(origRonchiCenter.x + xIx * xDir),
        origCanvasWidth = origRonchiCenter.x * 2,
        origIx = (origY * origCanvasWidth + origX) * 4,
        newY = int(nullRonchiCenter.y + distortionOffsetY * yDir),
        newX = int(nullRonchiCenter.x + distortionOffsetX * xDir);

    setPixel(nullImageData, newX, newY, origImg[origIx], origImg[origIx + 1], origImg[origIx + 2], origImg[origIx + 3]);
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

MLB.ronchi.setGratingOffsetFromOffset = function (offset) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        gratingOffset = constants.gratingOffset;

    gratingOffset().val(roundToDecimal(+gratingOffset().val() + offset, constants.gratingOffsetDecimalPrecision));
};

MLB.ronchi.setGratingOffsetFromSliderOffset = function () {
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
        canvasSize = constants.canvasSize(),
        context = canvas.getContext("2d");

    constants.images[canvas.id] = context.getImageData(0, 0, canvasSize, canvasSize);
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
    constants.gratingOffset().val(exampleImage[ix++]);
    constants.userParabolicCorrection().val(exampleImage[ix++]);
    constants.RonchigramSize().val(exampleImage[ix++]);

    constants.invertBands()[constants.yes].checked = exampleImage[ix++];
    constants.invertBands()[constants.no].checked = !constants.invertBands()[constants.yes].checked;

    constants.RonchiGrid()[constants.yes].checked = exampleImage[ix++];
    constants.RonchiGrid()[constants.no].checked = !constants.RonchiGrid()[constants.yes].checked;

    constants.zonalRuler()[constants.yes].checked = exampleImage[ix++];
    constants.zonalRuler()[constants.no].checked = !constants.zonalRuler()[constants.yes].checked;

    constants.pastedImageTransparency().val(exampleImage[ix++]);
    constants.pastedImageWidth().val(exampleImage[ix++]);
    constants.pastedImageHeight().val(exampleImage[ix++]);
    constants.pastedImageOffsetX().val(exampleImage[ix++]);
    constants.pastedImageOffsetY().val(exampleImage[ix++]);

    imgSrc = exampleImage[ix++];

    constants.distortionResolutionFactor().val(exampleImage[ix++]);

    constants.showBullseyeZones()[constants.yes].checked = exampleImage[ix++];
    constants.showBullseyeZones()[constants.no].checked = !constants.showBullseyeZones()[constants.yes].checked;

    constants.thinBands()[constants.yes].checked = exampleImage[ix++];
    constants.thinBands()[constants.no].checked = !constants.thinBands()[constants.yes].checked;

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
    constants.pastedImageOffsetX().val(0);
    constants.pastedImageOffsetY().val(0);

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

/*
MLB.ronchi.getNameIndexedElementChBoxValue = function (name, ix) {
    return MLB.ronchi.getNameIndexedElement(name, ix).is(':checked');
};

MLB.ronchi.setNameIndexedElementChBoxValue = function (name, ix, val) {
    MLB.ronchi.getNameIndexedElement(name, ix).prop('checked', val);
};
*/

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
        dataToSave,
        ix,
        zone,
        correction,
        zonalCorrectionTable = [];

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        zonalCorrectionTable.push({zone: zone, correctionFactor: correction});
    }

    dataToSave = {
        mirrorDia: constants.mirrorDia().val(),
        radiusOfCurvature: constants.radiusOfCurvature().val(),
        focalLength: constants.focalLength().val(),
        focalRatio: constants.focalRatio().val(),
        centralObstruction: constants.centralObstruction().val(),
        gratingFreq: constants.gratingFreq().val(),
        gratingOffset: constants.gratingOffset().val(),
        userParabolicCorrection: constants.userParabolicCorrection().val(),
        RonchigramSize: constants.RonchigramSize().val(),
        bandColorRGB: constants.bandColorRGB().val(),
        backgroundBandColorRGB: constants.backgroundBandColorRGB().val(),
        backgroundColor: constants.backgroundColor().val(),
        invertBands: constants.invertBands()[constants.yes].checked,
        RonchiGrid: constants.RonchiGrid()[constants.yes].checked,
        drawRuler: constants.zonalRuler()[constants.yes].checked,
        rulerTextRGB: constants.rulerTextRGB().val(),
        pastedImageTransparency: constants.pastedImageTransparency().val(),
        pastedImageWidth: constants.pastedImageWidth().val(),
        pastedImageHeight: constants.pastedImageHeight().val(),
        pastedImageOffsetX: constants.pastedImageOffsetX().val(),
        pastedImageOffsetY: constants.pastedImageOffsetY().val(),
        distortionResolutionFactor: constants.distortionResolutionFactor().val(),
        showBullseyeZones: constants.showBullseyeZones()[constants.yes].checked,
        thinBands: constants.thinBands()[constants.yes].checked,
        zonalCorrectionTable: zonalCorrectionTable,
        offsetRoC: constants.offsetRoC().val(),
        chainWaveErrors: constants.chainWaveErrorsVal(),
        wavelengthLightUOM: constants.wavelengthLightUOMVal()
    };

    localStorage.setItem(getLocalStorageName(), JSON.stringify(dataToSave));
};

MLB.ronchi.getData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        localStorageName = getLocalStorageName(),
        data = localStorage.getItem(localStorageName),
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
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
    constants.gratingOffset().val(parsedData.gratingOffset);
    constants.userParabolicCorrection().val(parsedData.userParabolicCorrection);
    constants.RonchigramSize().val(parsedData.RonchigramSize);
    constants.bandColorRGB().val(parsedData.bandColorRGB);
    if (parsedData.backgroundBandColorRGB) {
        constants.backgroundBandColorRGB().val(parsedData.backgroundBandColorRGB);
    }
    if (parsedData.backgroundColor) {
        constants.backgroundColor().val(parsedData.backgroundColor);
    }
    constants.invertBands()[constants.yes].checked = parsedData.invertBands;
    constants.invertBands()[constants.no].checked = !parsedData.invertBands;

    constants.RonchiGrid()[constants.yes].checked = parsedData.RonchiGrid;
    constants.RonchiGrid()[constants.no].checked = !parsedData.RonchiGrid;

    constants.zonalRuler()[constants.yes].checked = parsedData.zonalRuler;
    constants.zonalRuler()[constants.no].checked = !parsedData.zonalRuler;

    constants.rulerTextRGB().val(parsedData.rulerTextRGB);

    constants.pastedImageTransparency().val(parsedData.pastedImageTransparency);
    constants.pastedImageWidth().val(parsedData.pastedImageWidth);
    constants.pastedImageHeight().val(parsedData.pastedImageHeight);
    constants.pastedImageOffsetX().val(parsedData.pastedImageOffsetX);
    constants.pastedImageOffsetY().val(parsedData.pastedImageOffsetY);

    constants.distortionResolutionFactor().val(parsedData.distortionResolutionFactor);

    constants.showBullseyeZones()[constants.yes].checked = parsedData.showBullseyeZones;
    constants.showBullseyeZones()[constants.no].checked = !parsedData.showBullseyeZones;

    constants.thinBands()[constants.yes].checked = parsedData.thinBands;
    constants.thinBands()[constants.no].checked = !parsedData.thinBands;

    constants.offsetRoC().val(parsedData.offsetRoC);

    if (parsedData.chainWaveErrors === constants.yesLit) {
        constants.chainWaveErrors()[constants.yes].checked = true;
    } else {
        constants.chainWaveErrors()[constants.no].checked = true;
    }

    if (parsedData.wavelengthLightUOM === constants.imperialLit) {
        constants.wavelengthLightUOM()[constants.imperial].checked = true;
    } else {
        constants.wavelengthLightUOM()[constants.metric].checked = true;
    }

    for (ix = 0; ix < constants.zoneCount; ix++) {
        row = parsedData.zonalCorrectionTable[ix];
        setNameIndexedElementValue(constants.zoneIdLit, ix, row.zone);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, row.correctionFactor);
    }
};

MLB.ronchi.saveCorrections = () => {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        ix,
        zone,
        correction,
        savedCorrections = [];

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        savedCorrections.push({zone: zone, correctionFactor: correction});
    }
    constants.savedCorrections = savedCorrections;
};

MLB.ronchi.restoreCorrections = () => {
    var constants = MLB.ronchi.constants,
        savedCorrections = constants.savedCorrections,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        setNameIndexedElementValue(constants.zoneIdLit, ix, savedCorrections[ix].zone);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, savedCorrections[ix].correctionFactor);
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
                + '<td class="label">M-L: \r\n'
                + '<td> <label ' + constants.MLToleranceId2Lit + ix + '"></label> \r\n'
        ;

        constants.zonalCorrectionTableBody().append(htmlStr);
    }
};

MLB.ronchi.sortZonalCorrectionTableByZone = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        userZonalCorrections = [],
        sortedUserZonalCorrections,
        ix,
        zone,
        correction,
        val;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
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
    }
};

// remove correction and check if zone is not a number
MLB.ronchi.cleanupZonalCorrectionTable = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        ix,
        zone;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        if (isNaN(zone)) {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
        }
    }
};

MLB.ronchi.copyBandPositionsToErrorTable = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        mirrorDia = +constants.mirrorDia().val(),
        mirrorRadius = mirrorDia / 2,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
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
        ix++;
    }
    for ( ; ix < constants.zoneCount; ix++, tapeIx++) {
        if (tapeIx < tapesLength) {
            // use first image Ronchi image values, tapes[0]
            bandVal = roundToDecimal(constants.tapes[0][tapeIx] / mirrorRadius, constants.tapeBandDecimalPrecision);

            setNameIndexedElementValue(constants.zoneIdLit, ix, bandVal);
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
        } else {
            if (lastEntryDone) {
                setNameIndexedElementValue(constants.zoneIdLit, ix, '');
                setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
            } else {
                // set mirror's edge as final entry in table
                setNameIndexedElementValue(constants.zoneIdLit, ix, 1);
                setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
                lastEntryDone = true;
            }
        }
    }
};

MLB.ronchi.resetZonesToOneTenthIncrement = function () {
    var constants = MLB.ronchi.constants,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        ix;

    for (ix = 0; ix < 11; ix++) {
        setNameIndexedElementValue(constants.zoneIdLit, ix, ix / 10);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
    }
};

MLB.ronchi.resetCorrectionFactors = function () {
    var constants = MLB.ronchi.constants,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        userEnteredZone,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        userEnteredZone = getNameIndexedElementValue(constants.zoneIdLit, ix);
        if (userEnteredZone !== '' && !isNaN(userEnteredZone)) {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, 1);
        } else {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
        }
    }
};

MLB.ronchi.resetCorrectionFactorsToParabCorrection = function () {
    var constants = MLB.ronchi.constants,
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        userEnteredZone,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix++) {
        userEnteredZone = getNameIndexedElementValue(constants.zoneIdLit, ix);
        if (userEnteredZone !== '' && !isNaN(userEnteredZone)) {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, userParabolicCorrection);
        } else {
            setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, '');
        }
    }
};

MLB.ronchi.processZonalErrors = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcMillesLacroixTolerance = MLB.calcLib.calcMillesLacroixTolerance,
        calcParabolicCorrectionForZone = MLB.calcLib.calcParabolicCorrectionForZone,
        getNameIndexedElementValue = MLB.ronchi.getNameIndexedElementValue,
        setIdIndexedLabelValue = MLB.ronchi.setIdIndexedLabelValue,
        setIdIndexedLabelBackground = MLB.ronchi.setIdIndexedLabelBackground,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        userParabolicCorrection = +constants.userParabolicCorrection().val(),
        offsetRoC = +constants.offsetRoC().val(),
        calcWaveErrorForZone = MLB.ronchi.calcWaveErrorForZone,
        chainWaveErrors = MLB.ronchi.chainWaveErrors,
        calcSaveWaveErrorResults = MLB.ronchi.calcSaveWaveErrorResults,
        chainWaveErrorsSelected = constants.chainWaveErrorsSelected(),
        getWavelengthLight = MLB.ronchi.getWavelengthLight,
        wavelengthLight = getWavelengthLight(),
        ix,
        zone,
        userEnteredZonalCorrection,
        zoneIsANumber,
        userEnteredZonalCorrectionIsANumber,
        MLTolerance,
        zoneResultStr,
        zoneResultBackgroundColor,
        parabolicCorrectionForZone,
        correctionTolerance,
        displayToleranceStr,
        MLToleranceDecimalPrecision,
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

        zoneIsANumber = zone.trim() != '' && !isNaN(zone);
        userEnteredZonalCorrectionIsANumber = userEnteredZonalCorrection.trim() != '' && !isNaN(userEnteredZonalCorrection);

        if (!zoneIsANumber) {
            setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, '');
            setIdIndexedLabelValue(constants.zoneResultIdLit, ix, '');
            continue;
        }

        parabolicCorrectionForZone = calcParabolicCorrectionForZone(mirrorDia, radiusOfCurvature, zone);

        MLTolerance = calcMillesLacroixTolerance(wavelengthLight, mirrorDia, radiusOfCurvature, zone);
        if (MLTolerance === Infinity) {
            displayToleranceStr = Infinity;
        } else {
            correctionTolerance = MLTolerance / parabolicCorrectionForZone;
            if (Math.abs(correctionTolerance) < 10) {
                MLToleranceDecimalPrecision = constants.MLToleranceDecimalPrecision;
            } else {
                MLToleranceDecimalPrecision = constants.MLToleranceDecimalPrecision - 1;
            }
            displayToleranceStr = roundToDecimal(1 - correctionTolerance, MLToleranceDecimalPrecision)
                    + ' to '
                    + roundToDecimal(1 + correctionTolerance, MLToleranceDecimalPrecision);

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
            if (!isNaN(userEnteredZonalCorrection)) {
                weightedMLToleranceCount += zone * zone;
                weightedMLToleranceTotal += Math.abs((userEnteredZonalCorrection - 1) / correctionTolerance * zone * zone);
            }
        }

        setIdIndexedLabelValue(constants.MLToleranceIdLit, ix, displayToleranceStr);

        zoneResultStr = roundToDecimal(-peakValleyMLTolerance * 100, 0) + '%';
        if (peakValleyMLTolerance < 0) {
            zoneResultStr = '+' + zoneResultStr;
        }
        setIdIndexedLabelValue(constants.zoneResultIdLit, ix, zoneResultStr);
        if (peakValleyMLTolerance > 1 || peakValleyMLTolerance < -1) {
            zoneResultBackgroundColor = constants.badColor;
        } else if (peakValleyMLTolerance > 0.5 || peakValleyMLTolerance < -0.5) {
            zoneResultBackgroundColor = constants.fairColor;
        } else {
            zoneResultBackgroundColor = constants.goodColor;
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
        // note that zone needs to be turned into a number
        calcWaveErrorForZone(+zone, mirrorDia, radiusOfCurvature, userParabolicCorrection, userEnteredZonalCorrection, wavelengthLight, offsetRoC, waveErrors);
    }

    if (chainWaveErrorsSelected) {
        chainWaveErrors(waveErrors);
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
    constants.zonalErrorsResultsLabel().html('Peak-valley M-L = '
            + roundToDecimal(constants.peakValleyMLTolerance, constants.MLToleranceDecimalPrecision)
            + '; weighted M-L = '
            + roundToDecimal(constants.weightedMLTolerance, constants.MLToleranceDecimalPrecision)
            + '.'
    );

    waveErrorResults = calcSaveWaveErrorResults(waveErrors);
    constants.waveErrorsLabel().html('Peak-valley wavefront = '
            + roundToDecimal(waveErrorResults.PV, constants.wavesDecimalPrecision)
            + ', RMS = '
            + roundToDecimal(waveErrorResults.rms, constants.wavesDecimalPrecision)
            + '.'
    );
};

// accumulate wave errors from the outside zone inward to the center;
// this to turn slope measurements into wave errors by chaining the slopes together ala Texereau
MLB.ronchi.chainWaveErrors = (waveErrors) => {
    var waveErrorsLength = waveErrors.length,
        chainedWaveErrors = [...Array(waveErrorsLength)].fill(0),
        ixA;

    // start by reversing the waveErrors array then for each zone, accumulate that error in each chainedWaveErrors element until the end of the array
    waveErrors.reverse().forEach((we, ix) => {
        for (ixA = ix; ixA < waveErrorsLength; ixA++) {
            chainedWaveErrors[ixA] += we.error;
        }
    });
    // copy the accumulated chained errors back to the waveErrors array
    chainedWaveErrors.forEach((e, ix) => {
        waveErrors[ix].error = e;
    });
    // reverse to get back to original sequence, but now the errors are accumulated from outside zone inward to the center
    waveErrors.reverse();
};

MLB.ronchi.calcSaveWaveErrorResults = function (waveErrors) {
    var constants = MLB.ronchi.constants,
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
        waveErrorsWhereLowestIsZero.push({zone: we.zone, error: highestWaveError - we.error});
    });

    constants.waveErrors = waveErrors;
    constants.waveErrorsWhereLowestIsZero = waveErrorsWhereLowestIsZero;
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

MLB.ronchi.drawZonalErrorsSideView = function () {
    var constants = MLB.ronchi.constants,
        waveErrorsWhereLowestIsZero = constants.waveErrorsWhereLowestIsZero,
        rangeWaveError = constants.rangeWaveError,
        mirrorDia = +constants.mirrorDia().val(),
        canvasSize = constants.canvasSize(),
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

    scalingFactor = canvasSize / mirrorDia;
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
    fillPolygon(context, points, constants.sideViewFillColor);

    // draw the vertical zonal lines
    waveErrorsWhereLowestIsZero.forEach(we => {
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

MLB.ronchi.godProcess = function () {
    var constants = MLB.ronchi.constants;

    MLB.ronchi.processZonalErrors();
    MLB.ronchi.drawZonalErrorsSideView();
    MLB.ronchi.plotRonchigramsCalcRonchiTape();
    MLB.ronchi.nullFirstRonchigram();

    if (constants.thinBands()[constants.yes].checked) {
        if (+constants.pastedImageTransparency().val() < 1) {
            constants.pastedImageTransparency().val(1);

            MLB.ronchi.plotRonchigramsCalcRonchiTape();
            MLB.ronchi.nullFirstRonchigram();
        }
        MLB.ronchi.getAndProcessNulledImage();
    }
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

// these two functions, not currently in use, show how to get the image and process it

MLB.ronchi.getAndProcessNulledImage = () => {
    var constants = MLB.ronchi.constants,
        processNulledImage = MLB.ronchi.processNulledImage,
        noteParabolicCorrection = MLB.ronchi.noteParabolicCorrection,
        canvasSize = constants.canvasSize(),
        drawNullRuler = MLB.ronchi.drawNullRuler,
        nullRulerThickness = 1, // to match thinned Ronchi bands
        nullCanvas,
        context,
        imageData,
        newImageData,
        returnConcatenatedMirrorDiaFocalRatio = MLB.ronchi.returnConcatenatedMirrorDiaFocalRatio;

    nullCanvas = $('[id=RonchiCanvas' + (constants.RonchigramCount - 1) + ']')[0];
    context = nullCanvas.getContext('2d');

    imageData = context.getImageData(0, 0, canvasSize, canvasSize);
    newImageData = context.createImageData(nullCanvas.width, nullCanvas.height);

    processNulledImage(imageData, newImageData, canvasSize);

    // copy the new image data to the nullCanvas
    context.putImageData(newImageData, 0, 0);

    // drawing the nullTapes relies on update to the null ruler calcNullRuler() called in nullFirstRonchigram()
    drawNullRuler(context, canvasSize, nullRulerThickness);
    // note if parabolic correction != 1
    noteParabolicCorrection(context, canvasSize / 2);
    // relies on context fillStyle and font being set
    context.fillText(constants.nullLit, 2, constants.fontSize);
    context.fillText(returnConcatenatedMirrorDiaFocalRatio(), 2, constants.fontSize * 2 + 2);
};

MLB.ronchi.processNulledImage = (imageData, newImageData, canvasSize) => {
    var constants = MLB.ronchi.constants,
        white = 0,
        black = 1,
        contrast = 1.5,
        int = MLB.sharedLib.int,
        canvasMidPt = int(canvasSize / 2),
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
        canCalcGradient = [],
        gradients = [],
        red,
        green,
        blue,
        alpha,
        avg,
        gradient,
        normalizedGradient,
        lowestGradient = Number.MAX_VALUE,
        highestGradient = Number.MIN_VALUE;

    mirrorRadius = canvasSize / 2;
    mirrorRadiusSquared = mirrorRadius * mirrorRadius;

    // build inNullRonchigram and nullRonchigramGrayscale arrays...

    // go from top to bottom, for each  then go from left to right
    for (yIx = 0; yIx < canvasSize; yIx++) {
        yFromCenter = canvasMidPt - yIx;
        inNullRonchigram.push([]);
        nullRonchigramGrayscale.push([]);

        for (xIx = 0; xIx < canvasSize; xIx++) {
            xFromCenter = canvasMidPt - xIx;

            // row# times size of row + how far into the row --- all that *4 because red/green/blue/alpha (transparency)
            imgIx = (yIx * canvasSize + xIx) * 4;

            // if outside the Ronchigram then continue on to the next pixel
            if (yFromCenter * yFromCenter + xFromCenter * xFromCenter > mirrorRadiusSquared) {
                newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = 0;
                newData[imgIx + 2] = constants.opaque;

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
    for (yIx = 0; yIx < canvasSize; yIx++) {
        yFromCenter = canvasMidPt - yIx;
        for (xIx = 0; xIx < canvasSize; xIx++) {
            xFromCenter = canvasMidPt - xIx;
            if (inNullRonchigram[yIx][xIx]) {
                binaryCount++;
                binaryTotal += nullRonchigramGrayscale[yIx][xIx];
            }
        }
    }
    binaryMidPt = binaryTotal / binaryCount;
    // now make the binary array where the Ronchi bands are black
    for (yIx = 0; yIx < canvasSize; yIx++) {
        binary.push([]);
        for (xIx = 0; xIx < canvasSize; xIx++) {
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
    for (yIx = 0; yIx < canvasSize; yIx++) {
        thin.push([]);
        for (xIx = 0; xIx < canvasSize; xIx++) {
            thin[yIx][xIx] = binary[yIx][xIx];
        }
    }
    // thin out a row at a time
    for (yIx = 0; yIx < canvasSize; yIx++) {
        // repeat until no change...
        thinning = true;
        while (thinning) {
            thinning = false;
            // left to right
            for (xIx = 1; xIx < canvasSize - 2; xIx++) {
                if (inNullRonchigram[yIx][xIx - 1] && inNullRonchigram[yIx][xIx] && inNullRonchigram[yIx][xIx + 1] && inNullRonchigram[yIx][xIx + 2]) {
                    // if wbbb then make it wwbb and skip to the last b
                    if (thin[yIx][xIx - 1] === black && thin[yIx][xIx] === white && thin[yIx][xIx + 1] === white && thin[yIx][xIx + 2] === white) {
                        thin[yIx][xIx] = black;
                        thinning = true;
                        // skip to next to avoid chewing up long sequences, displacing the centroid to the right
                        xIx += 2;
                    }
                }
            }
            // right to left
            for (xIx = canvasSize - 2; xIx >= 2; xIx--) {
                if (inNullRonchigram[yIx][xIx + 1] && inNullRonchigram[yIx][xIx] && inNullRonchigram[yIx][xIx - 1] && inNullRonchigram[yIx][xIx - 2]) {
                    // if bbbw then make it bbww and skip to the first b
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

    // remove isolate pixels...

    for (yIx = 1; yIx < canvasSize - 1; yIx++) {
        for (xIx = 1; xIx < canvasSize - 1; xIx++) {
            if (thin[yIx - 1][xIx - 1] === black        && thin[yIx - 1][xIx] === black && thin[yIx - 1][xIx + 1] === black
                    && thin[yIx][xIx - 1] === black     && thin[yIx][xIx] === white     && thin[yIx][xIx + 1] === black
                    && thin[yIx + 1][xIx - 1] === black && thin[yIx + 1][xIx] === black && thin[yIx + 1][xIx + 1] === black) {
                thin[yIx][xIx] = black;
            }
        }
    }

    // now draw the results...

    for (yIx = 0; yIx < canvasSize; yIx++) {
        for (xIx = 0; xIx < canvasSize; xIx++) {
            if (inNullRonchigram[yIx][xIx]) {
                imgIx = (yIx * canvasSize + xIx) * 4;
                //newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = binary[yIx][xIx] * 255;
                newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = thin[yIx][xIx] * 255;
            }
        }
    }

    //MLB.ronchi.displayGridsTrueFalse('inNullRonchigram', inNullRonchigram, canvasSize);
    //MLB.ronchi.displayGrids('nullRonchigramGrayscale', nullRonchigramGrayscale, canvasSize);
    //MLB.ronchi.displayGrids('binary', binary, canvasSize);
    //MLB.ronchi.displayGrids('thin', thin, canvasSize);

    // end here to display thinned bands; for gradients comment out the return
    return;

    // gradients...

    // now that inNullRonchigram is filled in, work on the canCalcGradient array
    for (yIx = 0; yIx < canvasSize; yIx++) {
        canCalcGradient.push([]);
        for (xIx = 0; xIx < canvasSize; xIx++) {
            canCalcGradient[yIx][xIx] = yIx > 0 && yIx < canvasSize - 1
                    && xIx > 0 && xIx < canvasSize - 1
                    && inNullRonchigram[yIx - 1][xIx - 1] && inNullRonchigram[yIx - 1][xIx] && inNullRonchigram[yIx - 1][xIx + 1]
                    && inNullRonchigram[yIx][xIx - 1]     && inNullRonchigram[yIx][xIx]     && inNullRonchigram[yIx][xIx + 1]
                    && inNullRonchigram[yIx + 1][xIx - 1] && inNullRonchigram[yIx + 1][xIx] && inNullRonchigram[yIx + 1][xIx + 1];
        }
    }
    // now calculate the gradients using Sobel operator (https://www.cis.rit.edu/people/faculty/rhody/EdgeDetection.htm#:~:text=Vertical edges can be detected,the direction of the transition.)
    for (yIx = 0; yIx < canvasSize; yIx++) {
        gradients.push([]);
        for (xIx = 0; xIx < canvasSize; xIx++) {
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
    for (yIx = 0; yIx < canvasSize; yIx++) {
        for (xIx = 0; xIx < canvasSize; xIx++) {
            if (canCalcGradient[yIx][xIx]) {
                normalizedGradient = Math.floor((gradients[yIx][xIx] - lowestGradient) / (highestGradient - lowestGradient) * 255);

                // change contrast
                normalizedGradient = (normalizedGradient - 122) * contrast + 122;
                if (normalizedGradient > 255) {
                    normalizedGradient = 255;
                } else if (normalizedGradient < 0) {
                    normalizedGradient = 0;
                }

                imgIx = (yIx * canvasSize + xIx) * 4;
                newData[imgIx] = newData[imgIx + 1] = newData[imgIx + 2] = normalizedGradient;
            }
        }
    }

    //MLB.ronchi.displayGridsTrueFalse('canCalcGradient', canCalcGradient, canvasSize);
    //MLB.ronchi.displayGrids('gradients', gradients, canvasSize);
    //MLB.ronchi.displayGrids('normalizedGradient', normalizedGradient, canvasSize);
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
        rowStr = '';

    console.log('begin ' + name + '...');
    for (yIx = 0; yIx < size; yIx++) {
        for (xIx = 0; xIx < size; xIx++) {
            rowStr += grid[yIx][xIx] + ', ';
        }
        rowStr += '\n';
    }
    console.log(rowStr);
    console.log('... end ' + name);
};

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive,
        setGratingOffsetFromSliderOffset = MLB.ronchi.setGratingOffsetFromSliderOffset,
        setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
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
        saveCorrections = MLB.ronchi.saveCorrections,
        restoreCorrections = MLB.ronchi.restoreCorrections,
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
        rgbToHex = MLB.ronchi.rgbToHex;

    // starting values
    document.body.style.background = rgbToHex(constants.backgroundColor().val());
    constants.invertBands()[constants.no].checked = true;
    constants.RonchiGrid()[constants.no].checked = true;
    constants.zonalRuler()[constants.no].checked = true;
    constants.showBullseyeZones()[constants.no].checked = true;
    constants.thinBands()[constants.no].checked = true;
    setPastedImageInactive();
    constants.chainWaveErrors()[constants.no].checked = true;
    constants.wavelengthLightUOM()[constants.imperial].checked = true;

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
    constants.btn10Zones().click(() => {
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
    constants.btnSaveCorrections().click(saveCorrections);
    constants.btnRestoreCorrections().click(() => {
        restoreCorrections();
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
    constants.gratingOffset().change(godProcess);
    constants.userParabolicCorrection().change(godProcess);
    constants.RonchigramSize().change((e) => {
        changeFontSize(e.target.value);
        changeRonchigramSize();
    });
    constants.bandColorRGB().change(godProcess);
    constants.backgroundBandColorRGB().change(godProcess);
    constants.invertBands().change(godProcess);
    constants.backgroundColor().change(e => document.body.style.background = e.target.value);
    constants.RonchiGrid().change(godProcess);
    constants.zonalRuler().change(godProcess);
    constants.rulerTextRGB().change(() => {
        constants.rulerTextColor = rgbToHex(constants.rulerTextRGB().val());
        godProcess();
    });

    constants.pastedImageActive().change(godProcess);
    constants.pastedImageTransparency().change((e) => {
        // turn off thinned Ronchi bands which depend on transparency === 1;
        // here, if user lowers transparency, then user's desire is paramount so turn off the band thinning
        if (+e.target.value < 1 && constants.thinBands()[constants.yes].checked === true) {
            constants.thinBands()[constants.no].checked = true;
            alert('Thinning of nulled Ronchi bands has been turned off because transparency is being set less than 1');
        }
        godProcess();
    });
    constants.pastedImageHeight().change(godProcess);
    constants.pastedImageWidth().change(godProcess);
    constants.pastedImageOffsetX().change(godProcess);
    constants.pastedImageOffsetY().change(godProcess);
    constants.btnDeletedPastedImage().click(deleteImage);

    constants.btnIncreaseGratingOffset().click(() => {
        setGratingOffsetFromOffset(constants.gratingOffsetChange);
        godProcess();
    });
    constants.btnDecreaseGratingOffset().click(() => {
        setGratingOffsetFromOffset(-constants.gratingOffsetChange);
        godProcess();
    });
    constants.sliderOffset().mousemove(() => {
        setGratingOffsetFromSliderOffset();
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

    constants.btnPasteExampleRonchigram13().click(() =>         { pasteExampleRonchigram(constants.exampleImages.thirteen);       });
    constants.btnPasteExampleRonchigram13_2().click(() =>       { pasteExampleRonchigram(constants.exampleImages.thirteen2);      });
    constants.btnPasteExampleRonchigramGrid().click(() =>       { pasteExampleRonchigram(constants.exampleImages.thirteenGrid);   });
    constants.btnPasteExampleRonchigram12F5Under().click(() =>  { pasteExampleRonchigram(constants.exampleImages.twelveF5Under);  });
    constants.btnPasteExampleRonchigram12F5Under2().click(() => { pasteExampleRonchigram(constants.exampleImages.twelveF5Under2); });

    constants.btnPutData().click(putData);
    constants.btnGetData().click(() => {
        getData();
        godProcess();
    });
    constants.btnShowDataNames().click(showMatchingRonchiLocalStorageItems);
    constants.btnDeleteData().click(removeMatchingRonchiLocalStorageItems);
    constants.distortionResolutionFactor().change(godProcess);
    constants.showBullseyeZones().change(godProcess);
    constants.thinBands().change(godProcess);
    constants.chainWaveErrors().change(godProcess);
    constants.wavelengthLightUOM().change(godProcess);
    constants.offsetRoC().change(godProcess);

    changeFontSize(constants.startingRonchigramSize);
    // do not set zones to Ronchi bands because plotRonchigramsCalcRonchiTape() which calculates the bands has not been called yet
    resetZonesToOneTenthIncrement();
    godProcess();
});

// end of file
