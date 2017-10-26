// copyright Mel Bartels, 2011-2017

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
    yes: 0,
    no: 1,
    maxRulers: 4,
    decimalWaves: 1,
    decimalPercent: 0,
    gratingOffsetDecimalPrecision: 2,
    pastedImageLit: 'pastedImage',
    exampleImageURL: '25/mqo original.jpg',

    sliderOffsetMousedown: undefined,
    lastSliderOffsetValue: 0,
    sliderZonalErrorMouseDown: undefined,
    images: {},

    btnPlot: function () {
        return $('input[id=btnPlot]');
    },
    btnPlotError: function () {
        return $('input[id=btnPlotError]');
    },
    sliderOffset: function () {
        return $('input[id=sliderOffset]');
    },
    mirrorDia: function () {
        return $('[name=mirrorDia]');
    },
    radiusOfCurvature: function () {
        return $('[name=radiusOfCurvature]');
    },
    gratingFreq: function () {
        return $('[name=gratingFreq]');
    },
    gratingOffsetSeries: function () {
        return $('[name=gratingOffsetSeries]');
    },
    invertBands: function () {
        return $('[name=invertBands]');
    },
    drawRuler: function () {
        return $('[name=drawRuler]');
    },
    RonchigramSize: function () {
        return $('[name=RonchigramSize]');
    },
    borderSize: function () {
        return $('[name=borderSize]');
    },
    Ronchigrams: function () {
        return $('[id=Ronchigrams]');
    },
    waveNotes: function () {
        return $('td[id=waveNotes]');
    },
    displayErrorRonchigrams: function () {
        return $('[name=displayErrorRonchigrams]');
    },
    displayErrorRonchigramIsChecked: function () {
        return this.displayErrorRonchigrams()[this.yes].checked;
    },
    errorZone: function () {
        return $('[name=errorZone]');
    },
    wavefrontDeviation: function () {
        return $('[name=wavefrontDeviation]');
    },
    errorRonchigrams: function () {
        return $('[id=errorRonchigrams]');
    },
    sliderOffset: function () {
        return $('input[id=sliderOffset]');
    },
    sliderZonalError: function () {
        return $('[id=sliderZonalError]');
    },
    canvasSize: function () {
        return +this.RonchigramSize().val() + 2 * +this.borderSize().val();
    },
    btnPasteExampleRonchigram: function () {
        return $('input[id=btnPasteExampleRonchigram]');
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
    pastedImageRonchiCanvas: function () {
        return $('[id=RonchiCanvas0]')[0];
    },
    pastedImageErrorRonchiCanvas: function () {
        return $('[id=errorRonchiCanvas0]')[0];
    }
};

MLB.ronchi.quadrantSetPixel = function (imageData, cg, x, y, r, g, b, opaque) {
    var setPixel = MLB.sharedLib.setPixel;

    setPixel(imageData, cg.x + x, cg.y + y, r, g, b, opaque);
    setPixel(imageData, cg.x - x, cg.y + y, r, g, b, opaque);
    setPixel(imageData, cg.x + x, cg.y - y, r, g, b, opaque);
    setPixel(imageData, cg.x - x, cg.y - y, r, g, b, opaque);
};

MLB.ronchi.calcDeviationForScaledMirrorZone = function (scaledMirrorZone, scaledMirrorRadiusSquared, allowableParabolicDeviation, maxScaledMirrorZone, zoneSqrt) {
    if (scaledMirrorZone / scaledMirrorRadiusSquared < zoneSqrt) {
        // inside zone: shape gradually from perfect center to max allowableParabolicDeviation at zone
        return allowableParabolicDeviation * maxScaledMirrorZone * scaledMirrorZone / maxScaledMirrorZone / zoneSqrt;
    }
    // outside zone: shape gradually from perfect edge to max allowableParabolicDeviation at zone
    return allowableParabolicDeviation * maxScaledMirrorZone * (scaledMirrorRadiusSquared - scaledMirrorZone) / maxScaledMirrorZone / (1 - zoneSqrt);
};

MLB.ronchi.calcBand = function (scaledRadiusOfCurvature, scaledMirrorZone, deviationForScaledMirrorZone, scaledGratingOffset, x, scaledLineWidth) {
    var int = MLB.sharedLib.int,
        zZone = scaledRadiusOfCurvature + (scaledMirrorZone - deviationForScaledMirrorZone) / scaledRadiusOfCurvature,
        lZone = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zZone,
        uZone = Math.abs(lZone * x / zZone),
        tZone = int((uZone / scaledLineWidth) + 0.5);

    return tZone % 2 === 0;
};

// from algorithm in Sky and Telescope magazine: trace light rays through grating;
// correction factor of 1 = parabola
MLB.ronchi.ronchiCalcWithAllowableDeviation = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg, allowableParabolicDeviation, includeDeviation, invertBands, zoneSqrt) {
    var scaledMirrorRadius,
        scaledMirrorRadiusSquared,
        scaledRadiusOfCurvature,
        scaledGratingOffset,
        scaledLineWidth,
        scaledMirrorZone,
        maxScaledMirrorZone,
        x,
        y,
        ySquared,
        z,
        l,
        u,
        t,
        band,
        opaque = 255,
        int = MLB.sharedLib.int,
        deviationForScaledMirrorZone,
        calcDeviationForScaledMirrorZone = MLB.ronchi.calcDeviationForScaledMirrorZone,
        calcBand = MLB.ronchi.calcBand,
        quadrantSetPixel = MLB.ronchi.quadrantSetPixel;

    scaledMirrorRadius = mirrorDia / 2 * scalingFactor;
    scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
    scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
    scaledGratingOffset = gratingOffset * scalingFactor;
    scaledLineWidth = scalingFactor / (2 * gratingFreq);

    for (y = 0; y < scaledMirrorRadius; y++) {
        ySquared = y * y;
        maxScaledMirrorZone = ySquared + scaledMirrorRadiusSquared;
        for (x = 0; x < scaledMirrorRadius; x++) {
            scaledMirrorZone = ySquared + x * x;
            if (scaledMirrorZone > scaledMirrorRadiusSquared) {
                break;
            }
            // for spherical mirror, Z=RC;
            z = scaledRadiusOfCurvature + scaledMirrorZone / scaledRadiusOfCurvature;
            // offset*2 for light source that moves with Ronchi grating
            l = scaledRadiusOfCurvature + scaledGratingOffset * 2 - z;
            // u = projection of ray at scaledMirrorRadius onto grating displaced from RC by gratingOffset
            u = Math.abs(l * x / z);
            // test for ray blockage by grating
            t = int((u / scaledLineWidth) + 0.5);
            band = t % 2 === 0;

            if (includeDeviation) {
                deviationForScaledMirrorZone = calcDeviationForScaledMirrorZone(scaledMirrorZone, scaledMirrorRadiusSquared, allowableParabolicDeviation, maxScaledMirrorZone, zoneSqrt);
                band = calcBand(scaledRadiusOfCurvature, scaledMirrorZone, deviationForScaledMirrorZone, scaledGratingOffset, x, scaledLineWidth);
            }
            if ((band && !invertBands) || (!band && invertBands)) {
                quadrantSetPixel(imageData, cg, x, y, 0, 0, 0, opaque);
            }
        }
    }
};

MLB.ronchi.plot = function (canvas, gratingOffset, displayErrorRonchigrams, allowableParabolicDeviation, invertBands, zoneSqrt) {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        gratingFreq = +constants.gratingFreq().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        borderSize = +constants.borderSize().val(),
        drawRuler = constants.drawRuler()[constants.yes].checked,
        point = MLB.sharedLib.point,
        drawCircle = MLB.sharedLib.drawCircle,
        constants = MLB.ronchi.constants,
        scalingFactor,
        ronchiCenter,
        circleCenter,
        context,
        imageData,
        radius,
        ix,
        ronchiCalcWithAllowableDeviation = MLB.ronchi.ronchiCalcWithAllowableDeviation;

    context = canvas.getContext("2d");

    scalingFactor = RonchigramSize / mirrorDia;
    radius = mirrorDia / 2 * scalingFactor;
    ronchiCenter = point(canvas.width / 2, canvas.height / 2);

    // create a new pixel array
    imageData = context.createImageData(canvas.width, canvas.height);
    circleCenter = point(ronchiCenter.x, ronchiCenter.y);

    ronchiCalcWithAllowableDeviation(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, ronchiCenter, allowableParabolicDeviation, displayErrorRonchigrams, invertBands, zoneSqrt);

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);

    // now draw the circle that outlines mirror's aperture in the Ronchigram
    drawCircle(context, circleCenter, radius, 1, 'black');
    // draw ruler
    if (drawRuler) {
        for (ix = 1; ix < constants.maxRulers; ix += 1) {
            drawCircle(context, circleCenter, radius * ix / constants.maxRulers, 1, 'gray');
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
        calcAllowableParabolicDeviationForQuarterWavefront = MLB.calcLib.calcAllowableParabolicDeviationForQuarterWavefront,
        mirrorDia,
        radiusOfCurvature,
        focalRatio,
        invertBands,
        zoneSqrt,
        wavesCorrection,
        allowableParabolicDeviation,
        ix,
        plot = MLB.ronchi.plot,
        displayErrorRonchigramIsChecked,
        canvasSize = constants.canvasSize(),
        decodeGratingOffsetSeries = MLB.ronchi.decodeGratingOffsetSeries,
        gratingOffsetSeriesValues = decodeGratingOffsetSeries(),
        gratingOffsetSeriesValuesLength = gratingOffsetSeriesValues.length,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas;

    mirrorDia = +constants.mirrorDia().val();
    radiusOfCurvature = +constants.radiusOfCurvature().val();
    focalRatio = radiusOfCurvature / mirrorDia / 2;
    invertBands = constants.invertBands()[constants.yes].checked;
    zoneSqrt = +constants.errorZone().val() * +constants.errorZone().val();
    wavesCorrection = inchesToWavesGreenLight(calcSphereParabolaDifference(mirrorDia, focalRatio));
    allowableParabolicDeviation = calcAllowableParabolicDeviationForQuarterWavefront(focalRatio) * +constants.wavefrontDeviation().val() / 0.25;
    constants.waveNotes().html(roundToDecimal(wavesCorrection, constants.decimalWaves)
        + " waves correction fitting paraboloid to spheroid at edge or center ("
        + roundToDecimal(wavesCorrection / 4, constants.decimalWaves)
        + " waves best fit minimum paraboloidal deviation); 1/4 wavefront paraboloidal deviation is "
        + roundToDecimal(allowableParabolicDeviation * 100, constants.decimalPercent)
        + '%. ');

    // build canvases for Ronchigrams
    constants.Ronchigrams().html('');
    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        constants.Ronchigrams().append("<canvas id='RonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
        plot($('[id=RonchiCanvas' + ix + ']')[0], gratingOffsetSeriesValues[ix], undefined, 0, invertBands, undefined);
    }
    // load pasted image into first Ronchigram
    if (constants.pastedImageActiveIsChecked() && constants.images[constants.pastedImageLit] !== undefined) {
        loadPastedImageIntoCanvas(constants.pastedImageRonchiCanvas(), constants.images[constants.pastedImageLit]);
    }
    // build canvases for errorRonchigrams
    constants.errorRonchigrams().html('');
    displayErrorRonchigramIsChecked = constants.displayErrorRonchigramIsChecked();
    if (displayErrorRonchigramIsChecked) {
        for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
            constants.errorRonchigrams().append("<canvas id='errorRonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
            plot($('[id=errorRonchiCanvas' + ix + ']')[0], gratingOffsetSeriesValues[ix], displayErrorRonchigramIsChecked, allowableParabolicDeviation, invertBands, zoneSqrt);
        }
        // load pasted image into first errorRonchigram
        if (constants.pastedImageActiveIsChecked() && constants.images[constants.pastedImageLit] !== undefined) {
            loadPastedImageIntoCanvas(constants.pastedImageErrorRonchiCanvas(), constants.images[constants.pastedImageLit]);
        }
    }
};

MLB.ronchi.plotRonchigramsUsingSliderOffset = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        decodeGratingOffsetSeries = MLB.ronchi.decodeGratingOffsetSeries,
        gratingOffsetSeries = constants.gratingOffsetSeries,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        gratingOffsetSeriesValues,
        gratingOffsetSeriesValuesLength,
        sliderOffsetValue,
        ix,
        newGratingOffsetValue,
        gratingOffsetSeriesString = '';

    if (!constants.sliderOffsetMousedown)
        return;

    gratingOffsetSeriesValues = decodeGratingOffsetSeries(),
    gratingOffsetSeriesValuesLength = gratingOffsetSeriesValues.length;
    sliderOffsetValue = parseFloat(constants.sliderOffset().val());

    for (ix = 0; ix < gratingOffsetSeriesValuesLength; ix++) {
        newGratingOffsetValue = roundToDecimal(gratingOffsetSeriesValues[ix] + sliderOffsetValue - constants.lastSliderOffsetValue, constants.gratingOffsetDecimalPrecision)
        gratingOffsetSeriesString += newGratingOffsetValue;
        if (ix < gratingOffsetSeriesValuesLength - 1) {
            gratingOffsetSeriesString += ', ';
        }
    }
    constants.lastSliderOffsetValue = sliderOffsetValue;
    gratingOffsetSeries().val(gratingOffsetSeriesString);
    plotRonchigrams();
};

MLB.ronchi.updateZonalError = function () {
    var constants = MLB.ronchi.constants,
        plotRonchigrams = MLB.ronchi.plotRonchigrams;

    if (!constants.sliderZonalErrorMouseDown)
        return;

    constants.wavefrontDeviation().val(constants.sliderZonalError().val());
    plotRonchigrams();
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
        canvas = constants.pastedImageRonchiCanvas(),
        errorCanvas = constants.pastedImageErrorRonchiCanvas();

    saveCanvasImage(canvas);
    savePastedImage(e.target);
    loadPastedImageIntoCanvas(canvas, e.target);
    if (constants.displayErrorRonchigramIsChecked()) {
        saveCanvasImage(errorCanvas);
        loadPastedImageIntoCanvas(errorCanvas, e.target);
    }
    setPastedImageDefaults();
    setPastedImageActive();
};

MLB.ronchi.copyClipboardImage = function (e) {
    var items,
        blob,
        objectURL,
        source,
        pastedImage,
        loadPastedImage = MLB.ronchi.loadPastedImage;

    if (e.clipboardData) {
        items = e.clipboardData.items;
        if (!items || items[0].type.indexOf("image") === -1) {
            return;
        }

        blob = items[0].getAsFile();
        objectURL = window.URL || window.webkitURL;
        source = objectURL.createObjectURL(blob);

        pastedImage = new Image();
        pastedImage.onload = loadPastedImage;
        pastedImage.src = source;
    }
    e.preventDefault();
};

MLB.ronchi.pasteExampleRonchigram = function () {
    var constants = MLB.ronchi.constants,
        savePastedImage = MLB.ronchi.savePastedImage,
        loadPastedImageIntoCanvas = MLB.ronchi.loadPastedImageIntoCanvas,
        setPastedImageActive = MLB.ronchi.setPastedImageActive,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        canvas = constants.pastedImageRonchiCanvas(),
        image = new Image;

    constants.mirrorDia().val(25.1);
    constants.radiusOfCurvature().val(131.0);
    constants.gratingFreq().val(65);
    constants.gratingOffsetSeries().val(0.78);
	constants.RonchigramSize().val(400)
    constants.invertBands()[constants.yes].checked = true;
	constants.pastedImageTransparency().val(0.75);
    constants.pastedImageWidth().val(454);
    constants.pastedImageHeight().val(446);
    constants.pastedImageOffsetX().val(-19);
    constants.pastedImageOffsetY().val(-12);

    image.onload = function (e) {
        savePastedImage(e.target);
        loadPastedImageIntoCanvas(canvas, e.target);
        setPastedImageActive();
        plotRonchigrams();
    };
    image.src = constants.exampleImageURL;
};

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        plotRonchigramsUsingSliderOffset = MLB.ronchi.plotRonchigramsUsingSliderOffset,
        updateZonalError = MLB.ronchi.updateZonalError,
        copyClipboardImage = MLB.ronchi.copyClipboardImage,
        pasteExampleRonchigram = MLB.ronchi.pasteExampleRonchigram;

    // starting values
    constants.invertBands()[constants.no].checked = true;
    constants.drawRuler()[constants.no].checked = true;
    constants.displayErrorRonchigrams()[constants.no].checked = true;
    setPastedImageInactive();

    // event hookups/subscribes
    constants.mirrorDia().change(plotRonchigrams);
    constants.radiusOfCurvature().change(plotRonchigrams);
    constants.gratingFreq().change(plotRonchigrams);
    constants.gratingOffsetSeries().change(plotRonchigrams);
    constants.RonchigramSize().change(plotRonchigrams);
    constants.borderSize().change(plotRonchigrams);
    constants.invertBands().change(plotRonchigrams);
    constants.drawRuler().change(plotRonchigrams);
    constants.errorZone().change(plotRonchigrams);
    constants.wavefrontDeviation().change(plotRonchigrams);
    constants.displayErrorRonchigrams().change(plotRonchigrams);

    constants.pastedImageActive().change(plotRonchigrams);
    constants.pastedImageTransparency().change(plotRonchigrams);
    constants.pastedImageHeight().change(plotRonchigrams);
    constants.pastedImageWidth().change(plotRonchigrams);
    constants.pastedImageOffsetX().change(plotRonchigrams);
    constants.pastedImageOffsetY().change(plotRonchigrams);

    constants.sliderOffset().mousemove(plotRonchigramsUsingSliderOffset);
    constants.sliderOffset().mousedown(function () { MLB.ronchi.constants.sliderOffsetMousedown = true; });
    constants.sliderOffset().mouseup(function () { MLB.ronchi.constants.sliderOffsetMousedown = false; });

    constants.sliderZonalError().mousemove(updateZonalError);
    constants.sliderZonalError().mousedown(function () { MLB.ronchi.constants.sliderZonalErrorMouseDown = true; });
    constants.sliderZonalError().mouseup(function () { MLB.ronchi.constants.sliderZonalErrorMouseDown = false; });

    constants.btnPlot().click(plotRonchigrams);
    constants.btnPlotError().click(plotRonchigrams);
    document.addEventListener('paste', copyClipboardImage);

    constants.btnPasteExampleRonchigram().click(pasteExampleRonchigram);

    plotRonchigrams();
});

// end of file
