// copyright Mel Bartels, 2011-2017

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
    yes: 0,
    no: 1,
    shrinkForBorders: 0.9,
    maxRulers: 4,

    btnPlot: function () {
        return $('input[id=btnPlot]');
    },
    btnPlot2: function () {
        return $('input[id=btnPlot2]');
    },
    btnPlot3: function () {
        return $('input[id=btnPlot3]');
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
    canvas: function () {
        return $('[id=RonchiCanvas]')[0];
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
    errorZone: function () {
        return $('[name=errorZone]');
    },
    wavefrontDeviation: function () {
        return $('[name=wavefrontDeviation]');
    },
    errorRonchigrams: function () {
        return $('[id=errorRonchigrams]');
    },
    displayErrorRonchigrams2: function () {
        return $('[name=displayErrorRonchigrams2]');
    },
    errorZone2: function () {
        return $('[name=errorZone2]');
    },
    wavefrontDeviation2: function () {
        return $('[name=wavefrontDeviation2]');
    },
    errorRonchigrams2: function () {
        return $('[id=errorRonchigrams2]');
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
MLB.ronchi.ronchiCalcWithAllowableDeviation = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg, allowableParabolicDeviation, displayErrorRonchigram, invertBands, zoneSqrt) {
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

            if (displayErrorRonchigram) {
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
    var context,
        imageData,
        mirrorDia,
        radiusOfCurvature,
        gratingFreq,
        scalingFactor,
        ronchiCenter,
        ronchiWidth,
        circleCenter,
        point = MLB.sharedLib.point,
        drawCircle = MLB.sharedLib.drawCircle,
        constants = MLB.ronchi.constants,
        radius,
        drawRuler = constants.drawRuler()[constants.yes].checked,
        ix,
        ronchiCalcWithAllowableDeviation = MLB.ronchi.ronchiCalcWithAllowableDeviation;

    context = canvas.getContext("2d");

    mirrorDia = +constants.mirrorDia().val();
    radiusOfCurvature = +constants.radiusOfCurvature().val();
    gratingFreq = +constants.gratingFreq().val();

    scalingFactor = canvas.height / mirrorDia * constants.shrinkForBorders;
    radius = mirrorDia / 2 * scalingFactor;
    ronchiCenter = point(canvas.width / 2, canvas.height / 2);
    ronchiWidth = canvas.width;

    // create a new pixel array
    imageData = context.createImageData(ronchiWidth, canvas.height);
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

MLB.ronchi.plotRonchigrams = function () {
    var constants = MLB.ronchi.constants,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        decimalWaves = 1,
        decimalPercent = 0,
        calcSphereParabolaDifference = MLB.calcLib.calcSphereParabolaDifference,
        inchesToWavesGreenLight = MLB.calcLib.inchesToWavesGreenLight,
        calcAllowableParabolicDeviationForQuarterWavefront = MLB.calcLib.calcAllowableParabolicDeviationForQuarterWavefront,
        mirrorDia,
        radiusOfCurvature,
        focalRatio,
        invertBands,
        zoneSqrt,
        zoneSqrt2,
        wavesCorrection,
        allowableParabolicDeviation,
        wavefrontDeviation,
        ix,
        plot = MLB.ronchi.plot,
        displayErrorRonchigram,
        displayErrorRonchigram2,
        RonchigramSize = +constants.RonchigramSize().val(),
        canvasSize = RonchigramSize / constants.shrinkForBorders,
        gratingOffsetSeries = constants.gratingOffsetSeries().val().split(',').map(Number),
        gratingOffsetSeriesLength = gratingOffsetSeries.length;

    mirrorDia = +constants.mirrorDia().val();
    radiusOfCurvature = +constants.radiusOfCurvature().val();
    focalRatio = radiusOfCurvature / mirrorDia / 2;
    invertBands = constants.invertBands()[constants.yes].checked;
    zoneSqrt = +constants.errorZone().val() * +constants.errorZone().val();
    zoneSqrt2 = +constants.errorZone2().val() * +constants.errorZone2().val();
    wavesCorrection = inchesToWavesGreenLight(calcSphereParabolaDifference(mirrorDia, focalRatio));
    allowableParabolicDeviation = calcAllowableParabolicDeviationForQuarterWavefront(focalRatio) * +constants.wavefrontDeviation().val() / 0.25;
    wavefrontDeviation = calcAllowableParabolicDeviationForQuarterWavefront(focalRatio) * +constants.wavefrontDeviation2().val() / 0.25;
    constants.waveNotes().html(roundToDecimal(wavesCorrection, decimalWaves)
        + " waves correction; 1/4 wavefront paraboloidal deviation is "
        + roundToDecimal(allowableParabolicDeviation * 100, decimalPercent)
        + '%. ');

    // build canvases for Ronchigrams
    constants.Ronchigrams().html('');
    for (ix = 0; ix < gratingOffsetSeriesLength; ix++) {
        constants.Ronchigrams().append("<canvas id='RonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
        plot($('[id=RonchiCanvas' + ix + ']')[0], gratingOffsetSeries[ix], undefined, 0, invertBands, undefined);
    }
    // build canvases for errorRonchigrams
    constants.errorRonchigrams().html('');
    displayErrorRonchigram = constants.displayErrorRonchigrams()[constants.yes].checked;
    if (displayErrorRonchigram) {
        for (ix = 0; ix < gratingOffsetSeriesLength; ix++) {
            constants.errorRonchigrams().append("<canvas id='errorRonchiCanvas" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
            plot($('[id=errorRonchiCanvas' + ix + ']')[0], gratingOffsetSeries[ix], displayErrorRonchigram, allowableParabolicDeviation, invertBands, zoneSqrt);
        }
    }
    // build canvases for errorRonchigrams2
    constants.errorRonchigrams2().html('');
    displayErrorRonchigram2 = constants.displayErrorRonchigrams2()[constants.yes].checked;
    if (displayErrorRonchigram2) {
        for (ix = 0; ix < gratingOffsetSeriesLength; ix++) {
            constants.errorRonchigrams2().append("<canvas id='errorRonchiCanvas2" + ix + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>");
            plot($('[id=errorRonchiCanvas2' + ix + ']')[0], gratingOffsetSeries[ix], displayErrorRonchigram2, wavefrontDeviation, invertBands, zoneSqrt2);
        }
    }
};

$(window).ready(function () {
    var constants = MLB.ronchi.constants,
        plotRonchigrams = MLB.ronchi.plotRonchigrams;

    constants.invertBands()[constants.no].checked = true;
    constants.drawRuler()[constants.no].checked = true;
    constants.displayErrorRonchigrams()[constants.no].checked = true;
    constants.displayErrorRonchigrams2()[constants.no].checked = true;

    // event hookups/subscribes
    constants.mirrorDia().change(plotRonchigrams);
    constants.radiusOfCurvature().change(plotRonchigrams);
    constants.gratingFreq().change(plotRonchigrams);
    constants.gratingOffsetSeries().change(plotRonchigrams);
    constants.RonchigramSize().change(plotRonchigrams);
    constants.invertBands().change(plotRonchigrams);
    constants.drawRuler().change(plotRonchigrams);
    constants.errorZone().change(plotRonchigrams);
    constants.wavefrontDeviation().change(plotRonchigrams);
    constants.errorZone2().change(plotRonchigrams);
    constants.wavefrontDeviation2().change(plotRonchigrams);
    constants.displayErrorRonchigrams().change(plotRonchigrams);
    constants.displayErrorRonchigrams2().change(plotRonchigrams);

    constants.btnPlot().click(plotRonchigrams);
    constants.btnPlot2().click(plotRonchigrams);
    constants.btnPlot3().click(plotRonchigrams);

    plotRonchigrams();
});

// end of file