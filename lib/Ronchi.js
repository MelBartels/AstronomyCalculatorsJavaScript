/*global
    MLB,$,window,document,alert,Image,localStorage
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2011-2021

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
    noneLit: 'none',
    zonalLit: 'zonal',
    uomCenterLit: 'uomCenter',
    uomEdgeLit: 'uomEdge',
    maxRulers: 4,
    rulerColor: 'red',
    rulerThickness: 2,
    // ... ruler
    decimalWaves: 1,
    decimalPercent: 0,
    gratingOffsetDecimalPrecision: 3,
    tapeBandPrecision: 2,
    tapeBandScalingFactor: 1000,
    zoneCount: 10,
    zoneCount: 10,
    //array of [zone, correctionFactor], eg, [[0, 1.0], [0.1, 0.9] ... [1.0, 1.1]]
    corrections: [],
    zoneIdLit: 'id=zone',
    zoneCorrectionIdLit: 'id=zoneCorrection',
    zoneCorrectionId2Lit: 'id="zoneCorrection',
    pastedImageLit: 'pastedImage',
    exampleImages: {
        '25': [25.1, 131, 65, 0.774, 400, 10, true, 0.8, 454, 461, -16, -19, 'RonchiExamples/25 example.jpg'],
        '13': [13.1, 80.6, 65, 0.568, 250, 10, true, 0.75, 304, 320, -20, -28, 'RonchiExamples/13 example.jpg'],
        '10': [10.4, 58.4, 100, 0.365, 400, 10, true, 0.9, 416, 428, 7, -5, 'RonchiExamples/10 example.jpg'],
        '6': [5.9, 33.9, 100, 0.294, 400, 10, true, 0.9, 530, 496, -60, -40, 'RonchiExamples/6 example.jpg']
    },
    sliderOffsetMousedown: undefined,
    lastSliderOffsetValue: 0,
    gratingOffsetChange: 0.002,
    images: {},
    MatchingRonchiTestLit: 'MatchingRonchiTest ',
    tapes: [],

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
    drawZonalRuler: function () {
        return this.btnDrawRuler()[this.zonal].checked;
    },
    drawUomCenterRuler: function () {
        return this.btnDrawRuler()[this.uomCenter].checked;
    },
    drawUomEdgeRuler: function () {
        return this.btnDrawRuler()[this.uomEdge].checked;
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
    zonalCorrectionTableBody: function () {
        return $('#zonalCorrectionTableBody');
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
        scaledMirrorRadius,
        scaledMirrorRadiusSquared,
        scaledRadiusOfCurvature,
        scaledGratingOffset,
        scaledLineWidth,
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
        calcBand = MLB.ronchi.calcBand,
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
            scaledMirrorZone = ySquared + x * x;
            if (scaledMirrorZone > scaledMirrorRadiusSquared) {
                break;
            }
            // for spherical mirror, Z=RC;
			correctionFactor = MLB.ronchi.getCorrectionForZone(Math.sqrt(scaledMirrorZone / scaledMirrorRadiusSquared));
            z = scaledRadiusOfCurvature + scaledMirrorZone * correctionFactor / scaledRadiusOfCurvature;
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
        radius,
        scaledRadius,
        ix,
        uomIncrement,
        plotRonchiBands = MLB.ronchi.plotRonchiBands,
        matchingRonchiTapeBand = MLB.ronchi.matchingRonchiTapeBand;

    context = canvas.getContext("2d");

    scalingFactor = RonchigramSize / mirrorDia;
    radius = mirrorDia / 2;
    scaledRadius = radius * scalingFactor;
    ronchiCenter = point(canvas.width / 2, canvas.height / 2);

    // create a new pixel array
    imageData = context.createImageData(canvas.width, canvas.height);
    circleCenter = point(ronchiCenter.x, ronchiCenter.y);

    plotRonchiBands(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, ronchiCenter, invertBands);
    matchingRonchiTapeBand(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, invertBands);

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // now draw the circle that outlines mirror's aperture in the Ronchigram
    drawCircle(context, circleCenter, scaledRadius, 1, 'black');
    // fill in any central obstruction
    fillCircle(context, circleCenter, scalingFactor * centralObstruction / 2, 'black');
    // draw a ruler?
    if (constants.drawZonalRuler()) {
        for (ix = 1; ix < constants.maxRulers; ix += 1) {
            drawCircle(context, circleCenter, scaledRadius * ix / constants.maxRulers, constants.rulerThickness, constants.rulerColor);
        }
    } else if (constants.drawUomCenterRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(radius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorDia / 2; ix += uomIncrement) {
            drawCircle(context, circleCenter, scalingFactor * ix, constants.rulerThickness, constants.rulerColor);
        }
    } else if (constants.drawUomEdgeRuler()) {
        // max 10 uom marks, otherwise too cluttered
        uomIncrement = Math.floor(radius / 10) + 1;
        for (ix = uomIncrement; ix < mirrorDia / 2; ix += uomIncrement) {
            drawCircle(context, circleCenter, scaledRadius - scalingFactor * ix, constants.rulerThickness, constants.rulerColor);
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
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas;

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
        canvas = constants.pastedImageRonchiCanvas(),
        image = new Image(),
        ix = 0;

    constants.mirrorDia().val(exampleImage[ix++]);
    constants.radiusOfCurvature().val(exampleImage[ix++]);
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

MLB.ronchi.putData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        dataToSave;

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
        drawRuler: constants.btnDrawRuler().val()
    };

    localStorage.setItem(getLocalStorageName(), JSON.stringify(dataToSave));
};

MLB.ronchi.getData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        localStorageName = getLocalStorageName(),
        data = localStorage.getItem(localStorageName),
        parsedData;

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
        default:
            constants.btnDrawRuler()[constants.none].checked = true;
    }
};

// zone can range from 0 to 1: comes from user defined corrections per zones
MLB.ronchi.getCorrectionForZone = function (zone) {
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
    if (px === 0) {
        correction = corrections[px][1];
    } else if (px === correctionsLength) {
        correction = 0;
    } else {
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

    for (ix = 0; ix <= constants.zoneCount; ix += 1) {
        htmlStr = '<tr>\r\n'
                + '<td class="label">' + 'Zone</td>\r\n'
                + '<td> <input class="inputText" id="zone' + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> </td>\r\n'
                + '<td class="label"> correction factor </td>\r\n'
                + '<td> <input class="inputText" ' + constants.zoneCorrectionId2Lit + ix + '" onfocus="select();" type="number" step="0.05"> </td>\r\n'
                + '</tr>';
        constants.zonalCorrectionTableBody().append(htmlStr);
    }
};

MLB.ronchi.buildZoneAndCorrectionTableDefaultValues = function () {
    var constants = MLB.ronchi.constants,
        ix;

    for (ix = 0; ix <= constants.zoneCount; ix += 1) {
        $('[' + constants.zoneIdLit + ix + ']').val(ix / 10);
        $('[' + constants.zoneCorrectionIdLit + ix + ']').val('1.0');
    }
};

MLB.ronchi.buildcorrectionsArray = function () {
    var constants = MLB.ronchi.constants,
        zoneCount = constants.zoneCount,
        corrections = [],
        ix,
        zone,
        contact;

    for (ix = 0; ix < zoneCount; ix += 1) {
        zone = parseFloat($('[' + constants.zoneIdLit + (ix + 1) + ']').val());
        contact = parseFloat($('[' + constants.zoneCorrectionIdLit + (ix + 1) + ']').val());
        if (!isNaN(zone) && !isNaN(contact)) {
            corrections.push([zone, contact]);
        }
    }
    constants.corrections = corrections.sort();
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
        buildcorrectionsArray = MLB.ronchi.buildcorrectionsArray;

    // build and fill in zone and correction table
    buildZoneAndCorrectionTable();
    buildZoneAndCorrectionTableDefaultValues();
    buildcorrectionsArray();
    // add in change event handlers for each zone and correction
    for (ix = 0; ix <= constants.zoneCount; ix += 1) {
        $('[' + constants.zoneIdLit + ix + ']').change(function () {
            buildcorrectionsArray();
            plotRonchigrams()
        });
        $('[' + constants.zoneCorrectionIdLit + ix + ']').change(function () {
            buildcorrectionsArray();
            plotRonchigrams()
        });
    }

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