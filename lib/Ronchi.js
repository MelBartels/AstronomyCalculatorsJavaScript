/*global
    MLB,$,window,document,alert,Image,localStorage
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2011-2020

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
    yes: 0,
    no: 1,
    maxRulers: 4,
    rulerColor: 'red',
    rulerThickness: 2,
    decimalWaves: 1,
    decimalPercent: 0,
    gratingOffsetDecimalPrecision: 3,
    pastedImageLit: 'pastedImage',
    exampleImages: {
        '25': [25.1, 131, 65, 0.774, 400, 10, true, true, 0.8, 454, 461, -16, -19, 'RonchiExamples/25 example.jpg'],
        '13': [13.1, 80.6, 65, 0.568, 250, 10, true, true, 0.75, 304, 320, -20, -28, 'RonchiExamples/13 example.jpg'],
        '10': [10.4, 58.4, 100, 0.365, 400, 10, true, true, 0.9, 416, 428, 7, -5, 'RonchiExamples/10 example.jpg'],
        '6': [5.9, 33.9, 100, 0.294, 400, 10, true, true, 0.9, 530, 496, -60, -40, 'RonchiExamples/6 example.jpg']
    },
    sliderOffsetMousedown: undefined,
    sliderOffset2Mousedown: undefined,
    lastSliderOffsetValue: 0,
    gratingOffsetChange: 0.002,
    sliderZonalErrorMouseDown: undefined,
    images: {},
    MatchingRonchiTestLit: 'MatchingRonchiTest ',

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
    drawRuler: function () {
        return $('[name=drawRuler]');
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
    sliderZonalError: function () {
        return $('[id=sliderZonalError]');
    },
    canvasSize: function () {
        return +this.RonchigramSize().val() + 2 * +this.borderSize().val();
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
    btnIncreaseGratingOffsets2: function () {
        return $('input[id=btnIncreaseGratingOffsets2]');
    },
    btnDecreaseGratingOffsets2: function () {
        return $('input[id=btnDecreaseGratingOffsets2]');
    },
    sliderOffset2: function () {
        return $('input[id=sliderOffset2]');
    },
    pastedImageRonchiCanvas: function () {
        return $('[id=RonchiCanvas0]')[0];
    },
    pastedImageErrorRonchiCanvas: function () {
        return $('[id=errorRonchiCanvas0]')[0];
    },
    btnPutData: function () {
        return $('input[id=btnPutData]');
    },
    dataName: function () {
        return $('[name=dataName]');
    },
    btnGetData: function () {
        return $('input[id=btnGetData]');
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
    var constants = MLB.ronchi.constants,
        scaledMirrorRadius,
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
                quadrantSetPixel(imageData, cg, x, y, red, green, blue, opaque);
            }
        }
    }
};

MLB.ronchi.plot = function (canvas, gratingOffset, displayErrorRonchigrams, allowableParabolicDeviation, invertBands, zoneSqrt) {
    var constants = MLB.ronchi.constants,
        mirrorDia = +constants.mirrorDia().val(),
        radiusOfCurvature = +constants.radiusOfCurvature().val(),
        centralObstruction = +constants.centralObstruction().val(),
        gratingFreq = +constants.gratingFreq().val(),
        RonchigramSize = +constants.RonchigramSize().val(),
        drawRuler = constants.drawRuler()[constants.yes].checked,
        point = MLB.sharedLib.point,
        drawCircle = MLB.sharedLib.drawCircle,
        fillCircle = MLB.sharedLib.fillCircle,
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
    // fill in any central obstruction
    fillCircle(context, circleCenter, scalingFactor * centralObstruction / 2, 'black');
    // draw ruler
    if (drawRuler) {
        for (ix = 1; ix < constants.maxRulers; ix += 1) {
            drawCircle(context, circleCenter, radius * ix / constants.maxRulers, constants.rulerThickness, constants.rulerColor);
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
        errorAllowableParabolicDeviation,
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
    allowableParabolicDeviation = calcAllowableParabolicDeviationForQuarterWavefront(focalRatio);
    errorAllowableParabolicDeviation = allowableParabolicDeviation * +constants.wavefrontDeviation().val() / 0.25;
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
            plot($('[id=errorRonchiCanvas' + ix + ']')[0], gratingOffsetSeriesValues[ix], displayErrorRonchigramIsChecked, errorAllowableParabolicDeviation, invertBands, zoneSqrt);
        }
        // load pasted image into first errorRonchigram
        if (constants.pastedImageActiveIsChecked() && constants.images[constants.pastedImageLit] !== undefined) {
            loadPastedImageIntoCanvas(constants.pastedImageErrorRonchiCanvas(), constants.images[constants.pastedImageLit]);
        }
    }
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
    constants.sliderOffset2().val(sliderOffsetValue);
    constants.lastSliderOffsetValue = sliderOffsetValue;
};

MLB.ronchi.setGratingOffsetsFromSliderOffset2 = function () {
    var constants = MLB.ronchi.constants,
        setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
        sliderOffsetValue;

    if (!constants.sliderOffset2Mousedown) {
        return;
    }

    sliderOffsetValue = parseFloat(constants.sliderOffset2().val());
    setGratingOffsetFromOffset(sliderOffsetValue - constants.lastSliderOffsetValue);
    constants.sliderOffset().val(sliderOffsetValue);
    constants.lastSliderOffsetValue = sliderOffsetValue;
};

MLB.ronchi.updateZonalError = function () {
    var constants = MLB.ronchi.constants,
        plotRonchigrams = MLB.ronchi.plotRonchigrams;

    if (!constants.sliderZonalErrorMouseDown) {
        return;
    }

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
    constants.drawRuler()[constants.yes].checked = exampleImage[ix++];
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

    return constants.MatchingRonchiTestLit + constants.dataName();
};

MLB.ronchi.putData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        dataToSave;

    dataToSave = {
        mirrorDia: constants.mirrorDia().val(),
        radiusOfCurvature: constants.radiusOfCurvature().val(),
        gratingFreq: constants.gratingFreq().val(),
        gratingOffsetSeries: constants.gratingOffsetSeries().val(),
        RonchigramSize: constants.RonchigramSize().val(),
        borderSize: constants.borderSize().val(),
        invertBands: constants.invertBands()[constants.yes].checked,
        drawRuler: constants.drawRuler()[constants.yes].checked
    };

    localStorage.setItem(getLocalStorageName(), JSON.stringify(dataToSave));
};

MLB.ronchi.getData = function () {
    var constants = MLB.ronchi.constants,
        getLocalStorageName = MLB.ronchi.getLocalStorageName,
        data = localStorage.getItem(getLocalStorageName()),
        parsedData = JSON.parse(data);

    constants.mirrorDia().val(parsedData.mirrorDia);
    constants.radiusOfCurvature().val(parsedData.radiusOfCurvature);
    constants.gratingFreq().val(parsedData.gratingFreq);
    constants.gratingOffsetSeries().val(parsedData.gratingOffsetSeries);
    constants.RonchigramSize().val(parsedData.RonchigramSize);
    constants.borderSize().val(parsedData.borderSize);
    constants.invertBands()[constants.yes].checked = parsedData.invertBands;
    constants.invertBands()[constants.no].checked = !parsedData.invertBands;
    constants.drawRuler()[constants.yes].checked = parsedData.drawRuler;
    constants.drawRuler()[constants.no].checked = !parsedData.drawRuler;
};

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
        setPastedImageInactive = MLB.ronchi.setPastedImageInactive,
        plotRonchigrams = MLB.ronchi.plotRonchigrams,
        setGratingOffsetsFromSliderOffset = MLB.ronchi.setGratingOffsetsFromSliderOffset,
        setGratingOffsetsFromSliderOffset2 = MLB.ronchi.setGratingOffsetsFromSliderOffset2,
        setGratingOffsetFromOffset = MLB.ronchi.setGratingOffsetFromOffset,
        changeRonchigramSize = MLB.ronchi.changeRonchigramSize,
        updateZonalError = MLB.ronchi.updateZonalError,
        copyClipboardImage = MLB.ronchi.copyClipboardImage,
        setDropEffectToCopy = MLB.ronchi.setDropEffectToCopy,
        dragAndDropImage = MLB.ronchi.dragAndDropImage,
        deleteImage = MLB.ronchi.deleteImage,
        pasteExampleRonchigram = MLB.ronchi.pasteExampleRonchigram,
        putData = MLB.ronchi.putData,
        getData = MLB.ronchi.getData;

    // starting values
    constants.invertBands()[constants.no].checked = true;
    constants.drawRuler()[constants.no].checked = true;
    constants.displayErrorRonchigrams()[constants.no].checked = true;
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
    constants.btnIncreaseGratingOffsets2().click(function () {
        setGratingOffsetFromOffset(constants.gratingOffsetChange);
        plotRonchigrams();
    });
    constants.btnDecreaseGratingOffsets2().click(function () {
        setGratingOffsetFromOffset(-constants.gratingOffsetChange);
        plotRonchigrams();
    });
    constants.sliderOffset2().mousemove(function () {
        setGratingOffsetsFromSliderOffset2();
        plotRonchigrams();
    });
    constants.sliderOffset2().mousedown(function () { MLB.ronchi.constants.sliderOffset2Mousedown = true; });
    constants.sliderOffset2().mouseup(function () { MLB.ronchi.constants.sliderOffset2Mousedown = false; });
    constants.sliderZonalError().mousemove(updateZonalError);
    constants.sliderZonalError().mousedown(function () { MLB.ronchi.constants.sliderZonalErrorMouseDown = true; });
    constants.sliderZonalError().mouseup(function () { MLB.ronchi.constants.sliderZonalErrorMouseDown = false; });

    document.addEventListener('paste', copyClipboardImage);
    document.addEventListener('dragover', setDropEffectToCopy);
    document.addEventListener('drop', dragAndDropImage);
    document.addEventListener('keydown', function(event) {
            const key = event.key;
            if (key === 'Delete') {
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

    plotRonchigrams();
});

// end of file