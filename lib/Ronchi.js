// copyright Mel Bartels, 2011-2021

//var MLB, $;

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
    yes: 0,
    no: 1,
    // ruler...
    none: 0,
    zonal: 1,
    uomCenter: 2,
    uomEdge: 3,
    zones307093: 4,
    noneLit: 'none',
    zonalLit: 'zonal',
    uomCenterLit: 'uomCenter',
    uomEdgeLit: 'uomEdge',
    zones307093Lit: 'zones307093',
    numZonalRulers: 4,
    rulerColor: 'red',
    rulerThickness: 2,
    // ... ruler
    decimalWaves: 1,
    decimalPercent: 0,
    gratingOffsetDecimalPrecision: 3,
    MLToleranceDecimalPrecision: 3,
    tapeBandPrecision: 2,
    wavefrontAnalysisPrecision: 2,
    tapeBandScalingFactor: 1000,
    zoneCount: 11,
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
    useZonalCorrectionId2Lit: 'id="chBoxUseZonalCorrection',
    pastedImageLit: 'pastedImage',
    exampleImages: {
        '25': [25.1, 131, 5.5, 65, 0.776, 400, 10, true, 0.8, 454, 461, -16, -19, 'RonchiExamples/25 example.jpg'],
        '13': [13.1, 80.6, 3.1, 65, 0.570, 250, 10, true, 0.75, 304, 320, -20, -28, 'RonchiExamples/13 example.jpg'],
        '10': [10.4, 58.4, 3.1, 100, 0.362, 400, 10, true, 0.9, 416, 428, 7, -5, 'RonchiExamples/10 example.jpg'],
        '6': [5.9, 33.9, 2.14, 100, 0.294, 400, 10, true, 0.9, 530, 496, -60, -40, 'RonchiExamples/6 example.jpg']
    },
    sliderOffsetMousedown: undefined,
    lastSliderOffsetValue: 0,
    lastRonchigramSize: undefined,
    gratingOffsetChange: 0.002,
    wavefrontErrorsArraySize: 11,
    images: {},
    MatchingRonchiTestLit: 'MatchingRonchiTest ',
    tapes: [],
    weightedMLTolerance: undefined,

    mirrorDia: function () {
        return $('[name=mirrorDia]');
    },
    radiusOfCurvature: function () {
        return $('[name=radiusOfCurvature]');
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
    drawzones307093Ruler: function () {
        return this.btnDrawRuler()[this.zones307093].checked;
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

MLB.ronchi.quadrantSetPixel = function (imageData, cg, x, y, r, g, b, opaque) {
    var setPixel = MLB.sharedLib.setPixel;

    setPixel(imageData, cg.x + x, cg.y + y, r, g, b, opaque);
    setPixel(imageData, cg.x - x, cg.y + y, r, g, b, opaque);
    setPixel(imageData, cg.x + x, cg.y - y, r, g, b, opaque);
    setPixel(imageData, cg.x - x, cg.y - y, r, g, b, opaque);
};

MLB.ronchi.calcBand = function (scaledRadiusOfCurvature, scaledMirrorZone, scaledGratingOffset, x, scaledLineWidth) {
    var int = MLB.sharedLib.int,
        zZone = scaledRadiusOfCurvature + scaledMirrorZone / scaledRadiusOfCurvature,
        lZone = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zZone,
        uZone = Math.abs(lZone * x / zZone),
        tZone = int((uZone / scaledLineWidth) + 0.5);

    return tZone % 2 === 0;
};

// from algorithm in Sky and Telescope magazine: trace light rays through grating
MLB.ronchi.plotRonchiBands = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg, invertBands) {
    var constants = MLB.ronchi.constants,
        getInterpolatedCorrection = MLB.ronchi.getInterpolatedCorrection,
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
        correctionFactor,
        z,
        l,
        u,
        t,
        band,
        opaque = 255,
        int = MLB.sharedLib.int,
        quadrantSetPixel = MLB.ronchi.quadrantSetPixel,
        bandColorRGB = constants.bandColorRGB().val().split(','),
        red = +bandColorRGB[0],
        green = +bandColorRGB[1],
        blue = +bandColorRGB[2];

    if (isNaN(red) || isNaN(green) || isNaN(blue) || red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
        alert("Band color of '" + bandColorRGB + "' not properly entered. Please correct and try again.");
        return;
    }

    scaledMirrorRadius = mirrorDia / 2 * scalingFactor;
    scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
    scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
    scaledGratingOffset = gratingOffset * scalingFactor;
    scaledLineWidth = scalingFactor / (2 * gratingFreq);

    for (y = 0; y < scaledMirrorRadius; y++) {
        ySquared = y * y;
        for (x = 0; x < scaledMirrorRadius; x++) {
            scaledMirrorZoneSquared = ySquared + x * x;
            if (scaledMirrorZoneSquared > scaledMirrorRadiusSquared) {
                break;
            }
            scaledMirrorZone = Math.sqrt(scaledMirrorZoneSquared);
            correctionFactor = getInterpolatedCorrection(scaledMirrorZone / scaledMirrorRadius);
            // for spherical mirror, Z=RC;
            z = scaledRadiusOfCurvature + scaledMirrorZoneSquared * correctionFactor / scaledRadiusOfCurvature;
            // offset*2 for light source that moves with Ronchi grating
            l = scaledRadiusOfCurvature + scaledGratingOffset * 2 - z;
            // u = projection of ray at scaledMirrorRadius onto grating displaced from RC by gratingOffset
            u = Math.abs(l * x / z);
            // test for ray blockage by grating
            t = int((u / scaledLineWidth) + 0.5);
            band = t % 2 === 0;

            if ((band && !invertBands) || (!band && invertBands)) {
                quadrantSetPixel(imageData, cg, x, y, red, green, blue, opaque);
            }
        }
    }
};

MLB.ronchi.matchingRonchiTapeBand = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, invertBands) {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        tapes = constants.tapes,
        tapeMarks = [],
        tapeBandScalingFactor = constants.tapeBandScalingFactor,
        scaledMirrorRadius,
        scaledMirrorRadiusSquared,
        scaledRadiusOfCurvature,
        scaledGratingOffset,
        scaledLineWidth,
        scaledMirrorZone,
        maxScaledMirrorZone,
        x,
        z,
        l,
        u,
        t,
        band,
        lastBand,
        lastBandX,
        skippedTransitions = 0,
        int = MLB.sharedLib.int;

    scaledMirrorRadius = mirrorDia / 2 * tapeBandScalingFactor;
    scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
    scaledRadiusOfCurvature = radiusOfCurvature * tapeBandScalingFactor;
    scaledGratingOffset = gratingOffset * tapeBandScalingFactor;
    scaledLineWidth = tapeBandScalingFactor / (2 * gratingFreq);

    maxScaledMirrorZone = scaledMirrorRadiusSquared;
    for (x = 0; x < scaledMirrorRadius; x++) {
        scaledMirrorZone = x * x;
        if (scaledMirrorZone > scaledMirrorRadiusSquared) {
            break;
        }
        // for spherical mirror, Z=RC; no correction factor should be applied here
        z = scaledRadiusOfCurvature + scaledMirrorZone / scaledRadiusOfCurvature;
        // offset*2 for light source that moves with Ronchi grating
        l = scaledRadiusOfCurvature + scaledGratingOffset * 2 - z;
        // u = projection of ray at scaledMirrorRadius onto grating displaced from RC by gratingOffset
        u = Math.abs(l * x / z);
        // test for ray blockage by grating
        t = int((u / scaledLineWidth) + 0.5);
        band = t % 2 === 0;

        if (band !== lastBand) {
            // first transition is the start of the sequence where x === 0, second transition is the edge of the center band
            if (skippedTransitions >= 2) {
                if ((band && !invertBands) || (!band && invertBands)) {
                    tapeMarks.push(roundToDecimal((x + lastBandX ) / 2 / tapeBandScalingFactor, constants.tapeBandPrecision));
                }
            } else {
                skippedTransitions += 1;
            }
            lastBand = band;
            lastBandX = x;
        }
    }
    if (invertBands) {
        tapeMarks.push(roundToDecimal((x + lastBandX ) / 2 / tapeBandScalingFactor, constants.tapeBandPrecision));
    }
    tapes.push(tapeMarks);
};

MLB.ronchi.drawRonchigramOnCanvas = function (canvas, gratingOffset, invertBands) {
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
        circleCenter,
        context,
        imageData,
        mirrorRadius,
        scaledMirrorRadius,
        plotRonchiBands = MLB.ronchi.plotRonchiBands,
        matchingRonchiTapeBand = MLB.ronchi.matchingRonchiTapeBand,
        drawRulers = MLB.ronchi.drawRulers;

    context = canvas.getContext("2d");

    scalingFactor = RonchigramSize / mirrorDia;
    mirrorRadius = mirrorDia / 2;
    scaledMirrorRadius = mirrorRadius * scalingFactor;
    ronchiCenter = point(canvas.width / 2, canvas.height / 2);

    // create a new pixel array
    imageData = context.createImageData(canvas.width, canvas.height);
    circleCenter = point(ronchiCenter.x, ronchiCenter.y);

    plotRonchiBands(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, ronchiCenter, invertBands);
    matchingRonchiTapeBand(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, invertBands);

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // now draw the circle that outlines mirror's aperture in the Ronchigram
    drawCircle(context, circleCenter, scaledMirrorRadius, 1, 'black');
    // fill in any central obstruction
    fillCircle(context, circleCenter, scalingFactor * centralObstruction / 2, 'black');

    drawRulers(context, circleCenter, mirrorRadius, scalingFactor);
};

MLB.ronchi.drawRulers = function (context, circleCenter, mirrorRadius, scalingFactor) {
    var constants = MLB.ronchi.constants,
        drawCircle = MLB.sharedLib.drawCircle,
        ix,
        uomIncrement,
        scaledMirrorRadius = mirrorRadius * scalingFactor;

    if (constants.drawZonalRuler()) {
        for (ix = 1; ix < constants.numZonalRulers; ix += 1) {
            drawCircle(context, circleCenter, scaledMirrorRadius * ix / constants.numZonalRulers, constants.rulerThickness, constants.rulerColor);
        }
    } else if (constants.drawUomCenterRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(mirrorRadius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorRadius; ix += uomIncrement) {
            drawCircle(context, circleCenter, scalingFactor * ix, constants.rulerThickness, constants.rulerColor);
        }
    } else if (constants.drawUomEdgeRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(mirrorRadius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorRadius; ix += uomIncrement) {
            drawCircle(context, circleCenter, scaledMirrorRadius - scalingFactor * ix, constants.rulerThickness, constants.rulerColor);
        }
    } else if (constants.drawzones307093Ruler()) {
        constants.zonesForAnalysis.forEach(z => drawCircle(context, circleCenter, scaledMirrorRadius * z, constants.rulerThickness, constants.rulerColor));
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
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        inchesToWavesGreenLight = MLB.calcLib.inchesToWavesGreenLight,
        mirrorDia,
        radiusOfCurvature,
        focalRatio,
        invertBands,
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

    mirrorDia = +constants.mirrorDia().val();
    radiusOfCurvature = +constants.radiusOfCurvature().val();
    focalRatio = radiusOfCurvature / mirrorDia / 2;
    invertBands = constants.invertBands()[constants.yes].checked;

    wavesCorrection = inchesToWavesGreenLight(calcSphereParabolaDifference(mirrorDia, focalRatio));

    constants.waveNotes().html(roundToDecimal(wavesCorrection, constants.decimalWaves)
            + " waves correction fitting paraboloid to spheroid at edge or center. "
            + roundToDecimal(wavesCorrection / 4, constants.decimalWaves)
            + " waves best fit minimum paraboloidal deviation at 71% zone.");

    // reset the Ronchi tapes
    constants.tapes = [];
    // build canvases for Ronchigrams
    constants.Ronchigrams().html('');
    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        constants.Ronchigrams().append("<canvas id='RonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
        drawRonchigramOnCanvas($('[id=RonchiCanvas' + ix + ']')[0], gratingOffsetSeriesValues[ix], invertBands);
    }
    // load pasted image into first Ronchigram
    if (constants.pastedImageActiveIsChecked() && constants.images[constants.pastedImageLit] !== undefined) {
        loadPastedImageIntoCanvas(constants.pastedImageRonchiCanvas(), constants.images[constants.pastedImageLit]);
    }
    // display the tapes
    matchingTapeBandStr = '<p>The Ronchi bands cross a horizontal line drawn through the center at these radii: ';
    constants.tapes.forEach(function (tape, ix) {
        matchingTapeBandStr += 'Ronchigram #' + (ix + 1) + ': ' + tape.join(', ') + '; ';
    });
    // remove that last '; '
    matchingTapeBandStr = matchingTapeBandStr.slice(0, -2);
    matchingTapeBandStr += '<br>See the Matching Ronchi tape band discussion below.';
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
        for (ix = 0; ix < items.length; ix += 1) {
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
        plotRonchigrams = MLB.ronchi.plotRonchigrams;

    constants.images = {};
    plotRonchigrams();
    constants.pastedImageActive()[1].checked = true;
};

MLB.ronchi.pasteExampleRonchigram = function (exampleImage) {
    var constants = MLB.ronchi.constants,
        savePastedImage = MLB.ronchi.savePastedImage,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        setPastedImageActive = MLB.ronchi.setPastedImageActive,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        calcAndDisplayMLTolerances = MLB.ronchi.calcAndDisplayMLTolerances,
        canvas = constants.pastedImageRonchiCanvas(),
        image = new Image(),
        ix = 0;

    constants.mirrorDia().val(exampleImage[ix++]);
    constants.radiusOfCurvature().val(exampleImage[ix++]);
    constants.centralObstruction().val(exampleImage[ix++]);
    constants.gratingFreq().val(exampleImage[ix++]);
    constants.gratingOffsetSeries().val(exampleImage[ix++]);
    constants.RonchigramSize().val(exampleImage[ix++]);
    constants.borderSize().val(exampleImage[ix++]);
    constants.invertBands()[constants.yes].checked = exampleImage[ix++];
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
    };
    image.src = exampleImage[ix];
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

    for (ix = 0; ix < constants.zoneCount; ix += 1) {
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
        RonchigramSize: constants.RonchigramSize().val(),
        borderSize: constants.borderSize().val(),
        bandColorRGB: constants.bandColorRGB().val(),
        invertBands: constants.invertBands()[constants.yes].checked,
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
    constants.RonchigramSize().val(parsedData.RonchigramSize);
    constants.borderSize().val(parsedData.borderSize);
    constants.bandColorRGB().val(parsedData.bandColorRGB);
    constants.invertBands()[constants.yes].checked = parsedData.invertBands;
    constants.invertBands()[constants.no].checked = !parsedData.invertBands;
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
        default:
            constants.btnDrawRuler()[constants.none].checked = true;
    }
    for (ix = 0; ix < constants.zoneCount; ix += 1) {
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

    for (ix = 0; ix < constants.zoneCount; ix += 1) {
        htmlStr = '<tr>\r\n'
                + '<td class="label">' + 'Zone</td>\r\n'
                + '<td> <input class="inputText" ' + constants.zoneId2Lit + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> </td>\r\n'
                + '<td class="label"> correction factor </td>\r\n'
                + '<td> <input class="inputText" ' + constants.zoneCorrectionId2Lit + ix + '" onfocus="select();" type="number" step="0.05"> </td>\r\n'
                + '<td class="label"> M-L tolerance: </td>\r\n'
                + '<td> <label ' + constants.MLToleranceId2Lit + ix + '"></label> </td>\r\n'
                + '<td class="label"> Use? </td>\r\n'
                + '<td> <input ' + constants.useZonalCorrectionId2Lit + ix + '" type="checkbox"> </td>\r\n'
                + '</tr>';
        constants.zonalCorrectionTableBody().append(htmlStr);
    }
};

MLB.ronchi.buildZoneAndCorrectionTableDefaultValues = function () {
    var constants = MLB.ronchi.constants,
        defaultZonesAndCorrectionsLength = constants.defaultZonesAndCorrections.length,
        setNameIndexedElementValue = MLB.ronchi.setNameIndexedElementValue,
        ix;

    for (ix = 0; ix < constants.zoneCount; ix += 1) {
        if (ix >= defaultZonesAndCorrectionsLength) {
            break;
        }
        setNameIndexedElementValue(constants.zoneIdLit, ix, constants.defaultZonesAndCorrections[ix][0]);
        setNameIndexedElementValue(constants.zoneCorrectionIdLit, ix, constants.defaultZonesAndCorrections[ix][1]);
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
    for (ix = 0; ix < constants.zoneCount; ix += 1) {
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

    for (ix = 0; ix < constants.zoneCount; ix += 1) {
        useCorrection = getNameIndexedElementChBoxValue(constants.useZonalCorrectionIdLit, ix);
        zone = parseFloat(getNameIndexedElementValue(constants.zoneIdLit, ix));
        correction = parseFloat(getNameIndexedElementValue(constants.zoneCorrectionIdLit, ix));
        corrections.push([zone, correction, useCorrection]);
    }
    sortedCorrections = corrections.sort((a, b) => {
        if (isNaN(a[0])) {
            return 0;
        }
        if (isNaN(b[0])) {
            return 1;
        }
        return a[0] - b[0];
    });

    for (ix = 0; ix < constants.zoneCount; ix += 1) {
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

    for (ix = 0; ix < constants.zoneCount; ix += 1) {
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

MLB.ronchi.zonalErrorTableAltered = function () {
    var buildcorrectionsArray = MLB.ronchi.buildcorrectionsArray,
        calcAndDisplayMLTolerances = MLB.ronchi.calcAndDisplayMLTolerances,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        analyzeZonalErrorTable = MLB.ronchi.analyzeZonalErrorTable;

    calcAndDisplayMLTolerances();
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
    analysis = wavefrontErrorFromCorrectionsArray(mirrorDia, radiusOfCurvature, wavelengthLight, correctionsArray, constants.wavefrontErrorsArraySize);

    constants.zonalErrorsResultsLabel().html('wavefront P-V = '
            + roundToDecimal(analysis.wavefrontPV, constants.wavefrontAnalysisPrecision)
            + ' and RMS = '
            + roundToDecimal(analysis.wavefrontRMS, constants.wavefrontAnalysisPrecision)
            + ' waves (based solely on the 30/70/93% zones). Weighted ML tolerance = '
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

    for (ix = 0; ix < scaledMirrorRadius; ix += 1) {
        correctionFactor = getInterpolatedCorrection(ix / scaledMirrorRadius);
        polishColor = 255 * (correctionFactor - constants.minCorrection) / (constants.maxCorrection - constants.minCorrection);
        strokeStyle = 'rgb(0,0,' + polishColor + ')';
        drawCircle(context, circleCenter, ix, 2, strokeStyle);
    }

    // draw the circle that outlines mirror's aperture
    drawCircle(context, circleCenter, scaledMirrorRadius, 1, 'black');

    drawRulers(context, circleCenter, mirrorRadius, scalingFactor);
};

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
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
        ix,
        buildZoneAndCorrectionTable = MLB.ronchi.buildZoneAndCorrectionTable,
        buildZoneAndCorrectionTableDefaultValues = MLB.ronchi.buildZoneAndCorrectionTableDefaultValues,
        buildcorrectionsArray = MLB.ronchi.buildcorrectionsArray,
        calcAndDisplayMLTolerances = MLB.ronchi.calcAndDisplayMLTolerances,
        analyzeZonalErrorTable = MLB.ronchi.analyzeZonalErrorTable,
        zonalErrorTableAltered = MLB.ronchi.zonalErrorTableAltered,
        sortZonalCorrectionTableByZone = MLB.ronchi.sortZonalCorrectionTableByZone,
        getNameIndexedElement = MLB.ronchi.getNameIndexedElement;

    // build and fill in zone and correction table
    buildZoneAndCorrectionTable();
    buildZoneAndCorrectionTableDefaultValues();
    calcAndDisplayMLTolerances();
    buildcorrectionsArray();
    analyzeZonalErrorTable();
    // add in change event handlers for each zone, correction and use flag
    for (ix = 0; ix < constants.zoneCount; ix += 1) {
        getNameIndexedElement(constants.zoneIdLit, ix).change(zonalErrorTableAltered);
        getNameIndexedElement(constants.zoneCorrectionIdLit, ix).change(zonalErrorTableAltered);
        getNameIndexedElement(constants.useZonalCorrectionIdLit, ix).change(zonalErrorTableAltered);
    }
    constants.btnSortZonalCorrectionTableByZone().click(sortZonalCorrectionTableByZone);

    // starting values
    constants.invertBands()[constants.no].checked = true;
    constants.btnDrawRuler()[constants.none].checked = true;
    setPastedImageInactive();

    // event hookups/subscribes
    constants.mirrorDia().change(plotRonchigrams);
    constants.radiusOfCurvature().change(plotRonchigrams);
    constants.centralObstruction().change(plotRonchigrams);
    constants.gratingFreq().change(plotRonchigrams);
    constants.gratingOffsetSeries().change(plotRonchigrams);
    constants.RonchigramSize().change(changeRonchigramSize);
    constants.borderSize().change(plotRonchigrams);
    constants.bandColorRGB().change(plotRonchigrams);
    constants.invertBands().change(plotRonchigrams);
    constants.btnDrawRuler().change(plotRonchigrams);

    constants.pastedImageActive().change(plotRonchigrams);
    constants.pastedImageTransparency().change(plotRonchigrams);
    constants.pastedImageHeight().change(plotRonchigrams);
    constants.pastedImageWidth().change(plotRonchigrams);
    constants.pastedImageOffsetX().change(plotRonchigrams);
    constants.pastedImageOffsetY().change(plotRonchigrams);
    constants.btnDeletedPastedImage().click(deleteImage);

    constants.btnIncreaseGratingOffsets().click(function () {
        setGratingOffsetFromOffset(constants.gratingOffsetChange);
        plotRonchigrams();
    });
    constants.btnDecreaseGratingOffsets().click(function () {
        setGratingOffsetFromOffset(-constants.gratingOffsetChange);
        plotRonchigrams();
    });
    constants.sliderOffset().mousemove(function () {
        setGratingOffsetsFromSliderOffset();
        plotRonchigrams();
    });
    constants.sliderOffset().mousedown(function () { MLB.ronchi.constants.sliderOffsetMousedown = true; });
    constants.sliderOffset().mouseup(function () { MLB.ronchi.constants.sliderOffsetMousedown = false; });

    document.addEventListener('paste', copyClipboardImage);
    document.addEventListener('dragover', setDropEffectToCopy);
    document.addEventListener('drop', dragAndDropImage);
    document.addEventListener('keydown', function(event) {
            const key = event.key;
            if (key === 'Delete' || key === 'Escape') {
                deleteImage();
            }
        });

    constants.btnPasteExampleRonchigram25().click(function () { pasteExampleRonchigram(constants.exampleImages['25']); });
    constants.btnPasteExampleRonchigram13().click(function () { pasteExampleRonchigram(constants.exampleImages['13']); });
    constants.btnPasteExampleRonchigram10().click(function () { pasteExampleRonchigram(constants.exampleImages['10']); });
    constants.btnPasteExampleRonchigram6().click(function () { pasteExampleRonchigram(constants.exampleImages['6']); });

    constants.btnPutData().click(putData);
    constants.btnGetData().click(function () {
        getData();
        plotRonchigrams();
    });
    constants.btnShowDataNames().click(showMatchingRonchiLocalStorageItems);
    constants.btnDeleteData().click(removeMatchingRonchiLocalStorageItems);

    plotRonchigrams();
});

// end of file