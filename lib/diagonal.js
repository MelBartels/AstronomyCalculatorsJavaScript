/*global
    MLB,$,window,document
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2011-2018

'use strict';

MLB.diagonal = {};

MLB.diagonal.common = {
    diagonalsInches: [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12],
    diagonalsMm: [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300],

    btnUom: function () {
        return $('[name=uom]');
    },
    btnGraphDiags: function () {
        return $('input[id=btnGraphDiags]');
    },
    uom: function () {
        return $('[name=uom]');
    },
    imperial: function () {
        return this.uom()[0].checked;
    },
    mirrorDia: function () {
        return $('[name=mirrorDia]');
    },
    focalLen: function () {
        return $('[name=focalLen]');
    },
    diagToFocalPlaneDistance: function () {
        return $('[name=diagToFocalPlaneDistance]');
    },
    maxField: function () {
        return $('[name=maxField]');
    },
    diagSizes: function () {
        return $('[name=diagSizes]');
    },
    acceptableMagLoss: function () {
        return $('[name=acceptableMagLoss]');
    },
    diagChart: function () {
        return $('#diagChart');
    },
    diagSizeMinObstruct: function () {
        return $('td[id=diagSizeMinObstruct]');
    },
    diagSizeMaxIllum: function () {
        return $('td[id=diagSizeMaxIllum]');
    },
    diagSizeEvenIllum: function () {
        return $('td[id=diagSizeEvenIllum]');
    },
    offset: function () {
        return $('td[id=offset]');
    }
};

MLB.diagonal.plot = function (series, selectedUomAbbrev, offAxisPts, formatString, seriesLabels, acceptableMagLoss) {
    $.jqplot.config.enablePlugins = true;
    $.jqplot('diagChart', series, {
        title: 'Off-axis illumination',
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            xaxis: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                label: 'off-axis distance (' + selectedUomAbbrev + ')',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                numberTicks: offAxisPts,
                tickOptions: {formatString: formatString},
                min: series[0][0][0],
                max: series[0][offAxisPts - 1][0]
            },
            yaxis: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                label: 'magnitude drop',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                max: 0,
                min: acceptableMagLoss
            }
        },
        series: seriesLabels
    }).replot();
};

MLB.diagonal.calcVignettedIllumPercent = function (diagSize) {
    var common = MLB.diagonal.common,
        diagObstructionArea = MLB.calcLib.diagObstructionArea,
        getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
        focalPlaneToDiagDistance = common.diagToFocalPlaneDistance().val(),
        aperture = +common.mirrorDia().val(),
        focalLength = +common.focalLen().val(),
        offAxisIncrement = common.imperial()
            ? 0.1
            : 2,
        maxField = +common.maxField().val(),
        lossDueToDiagonalSize = diagObstructionArea(aperture, diagSize),
        /* array[off-axis points], each element consisting of:
               array[2]: 1st element is the off-axis distance and 2nd element the illumination value
           array goes from one edge of field to center of field to opposite edge of field */
        diagIllumArray = getDiagIllumArray(aperture, focalLength, diagSize, focalPlaneToDiagDistance, offAxisIncrement, maxField),
        /* eg, [0] = 0, 1; [1] = 0.1, 1; ... [4] = 0.4, 0.918; ... [7] = 0.7, 0.788 */
        radiusIllumArray = diagIllumArray.slice(diagIllumArray.length / 2),
        rings = radiusIllumArray.length - 1,
        ix,
        e1,
        e2,
        avgIllum,
        area,
        ringArea,
        lastArea = 0,
        weightedIllum = 0;

    // illumination profile is a parabolic (?) curve; easiest to integrate illum by dividing into rings rather than deriving integral
    for (ix = 0; ix < rings; ix += 1) {
        e1 = radiusIllumArray[ix];
        e2 = radiusIllumArray[ix + 1];
        avgIllum = (e1[1] + e2[1]) / 2;
        area = e2[0] * e2[0] * Math.PI;
        ringArea = area - lastArea;
        // save for next iteration the amount to subtract from the circle area to get the ring area
        lastArea = area;
        weightedIllum += avgIllum * ringArea;
    }
    return weightedIllum / lastArea - lossDueToDiagonalSize;
};

MLB.diagonal.graphDiags = function () {
    var common = MLB.diagonal.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        plot = MLB.diagonal.plot,
        calcVignettedIllumPercent = MLB.diagonal.calcVignettedIllumPercent,
        calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
        magnitudeDrop = MLB.calcLib.magnitudeDrop,
        inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
        diagObstructionArea = MLB.calcLib.diagObstructionArea,
        getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
        calcDiagOffsetUsingEyeToDiagDistance = MLB.calcLib.calcDiagOffsetUsingEyeToDiagDistance,
        seriesLabel = MLB.sharedLib.seriesLabel,
        minIllum,
        diagonals = [],
        selectedUomAbbrev,
        offAxisIncrement,
        formatString,
        digits,
        diagToFocalPlaneDistance,
        focalLen,
        mirrorDia,
        maxField,
        acceptableMagLoss,
        focalRatio,
        minDiag,
        suitableDiags,
        diagonalsLength,
        offAxisIllum,
        diagSize,
        calcs,
        lossDueToDiagonals,
        suitableDiagsLength,
        offAxisPts,
        inverseIncr,
        diagIx,
        illumIx,
        series,
        tickLabel,
        drop,
        maxDrop,
        offset,
        seriesLabels,
        diagIllum = [],
        accumIllumDrop,
        illumArray,
        maxIllumDiag,
        maxIllum,
        diagIntegratedVignettedIllums = [],
        diagIntegratedVignettedIllum;

    if (common.imperial()) {
        selectedUomAbbrev = '"';
        offAxisIncrement = 0.1;
        formatString = '%3.1f';
        digits = 2;
    } else {
        selectedUomAbbrev = 'mm';
        offAxisIncrement = 2;
        formatString = '%1d';
        digits = 0;
    }

    // remove comma, turn string to number, sort
    diagonals = common.diagSizes().val().split(',').map(Number).sort(function (a, b) { return a - b;});
    diagToFocalPlaneDistance = +common.diagToFocalPlaneDistance().val();
    focalLen = +common.focalLen().val();
    mirrorDia = +common.mirrorDia().val();
    maxField = +common.maxField().val();
    acceptableMagLoss = +common.acceptableMagLoss().val();

    focalRatio = focalLen / mirrorDia;
    minDiag = diagToFocalPlaneDistance / focalRatio;
    minIllum = inverseMagnitudeDrop(acceptableMagLoss);

    suitableDiags = [];
    diagonalsLength = diagonals.length;
    for (diagIx = 0; diagIx < diagonalsLength; diagIx++) {
        diagSize = diagonals[diagIx];
        offAxisIllum = calcOffAxisIllumination(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, maxField / 2);
        if (diagSize >= minDiag && offAxisIllum >= minIllum) {
            suitableDiags.push(diagSize);
        }
        // no need adding additonal larger diagonal sizes that also fully illuminate the field
        if (offAxisIllum === 1) {
            break;
        }
    }
    // guard condition: bail if no suitable diagonal(s)
    if (suitableDiags.length < 1) {
        common.diagChart().text('No diagonal met the criteria. Please pick another size.');
        return;
    }

    /* calcs[] is: array[diagonals], each element consisting of:
                    array[off-axis points], each element consisting of:
                     array[2]: 1st element is the off-axis distance and 2nd element the illumination value */
    calcs = [];
    lossDueToDiagonals = [];
    suitableDiagsLength = suitableDiags.length;
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
        calcs.push(getDiagIllumArray(mirrorDia, focalLen, suitableDiags[diagIx], diagToFocalPlaneDistance, offAxisIncrement, maxField));
        lossDueToDiagonals.push(diagObstructionArea(mirrorDia, suitableDiags[diagIx]));
    }

    // generate plot data
    offAxisPts = calcs[0].length;
    inverseIncr = 1 / offAxisIncrement;

    /* series is an array of diagonal sizes with the last array element the max illumination drop;
       each diagonal size is an array of [distances from field center, illumination drop in magnitudes]
       for example, one diagonal with the max illum drop:
       series[0]
            [-0.7, 0.10638105150315147]
            [-0.6, 0.10457897039648882]
            [-0.5, 0.10457897039648882]
            [-0.4, 0.10457897039648882]
            [-0.3, 0.10457897039648882]
            [-0.2, 0.10457897039648882]
            [-0.1, 0.10457897039648882]
            [-0, 0.10457897039648882]
            [0.1, 0.10457897039648882]
            [0.2, 0.10457897039648882]
            ...
       series[1]
            [-0.7, 0.4000000000000001]
            [-0.6, 0.4000000000000001]
            [-0.5, 0.4000000000000001]
            ...
    */
    series = [];
    // include array for maxDrop
    suitableDiagsLength = suitableDiags.length;
    for (diagIx = 0; diagIx <= suitableDiagsLength; diagIx++) {
        series.push([]);
    }

    // for each offaxis distance, push the illuminations of the various diagonals followed by the max allowed illum drop
    for (illumIx = 0; illumIx < offAxisPts; illumIx++) {
        tickLabel = Math.round(calcs[0][illumIx][0] * inverseIncr) / inverseIncr;
        maxDrop = magnitudeDrop(minIllum);
        suitableDiagsLength = suitableDiags.length;
        for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
            drop = magnitudeDrop(calcs[diagIx][illumIx][1] - lossDueToDiagonals[diagIx]);
            series[diagIx].push([tickLabel, drop]);
        }
        series[diagIx].push([tickLabel, maxDrop]);
    }

    // build the series labels: each series label represents a diagonal size, ending with the max allowed illum drop label
    seriesLabels = [];
    suitableDiagsLength = suitableDiags.length;
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
        seriesLabels.push(seriesLabel(suitableDiags[diagIx] + selectedUomAbbrev + ' diagonal'));
    }
    seriesLabels.push(seriesLabel('max allowed drop'));

    // plot the graph
    plot(series, selectedUomAbbrev, offAxisPts, formatString, seriesLabels, acceptableMagLoss);

    // calc diag sizes for maximum integrated illumination and most even illumination
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
        accumIllumDrop = 0;
        for (illumIx = 0; illumIx < offAxisPts; illumIx++) {
            illumArray = series[diagIx][illumIx];
            // illum drop weighted by distance from field center
            accumIllumDrop += illumArray[0] * illumArray[0] * illumArray[1];
        }
        // push the diagonal size and accum illum drop weighted by area
        diagIllum.push([suitableDiags[diagIx], accumIllumDrop]);
    }
    maxIllum = Number.MAX_VALUE;
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx++) {
        if (diagIllum[diagIx][1] < maxIllum) {
            maxIllumDiag = suitableDiags[diagIx];
            maxIllum = diagIllum[diagIx][1];
        }
    }

    // calc integrated vignetted illumination
    maxIllum = 0;
    for (diagIx = 0; diagIx < suitableDiagsLength; diagIx += 1) {
        diagIntegratedVignettedIllum = calcVignettedIllumPercent(suitableDiags[diagIx]);
        if (diagIntegratedVignettedIllum > maxIllum) {
            maxIllum = diagIntegratedVignettedIllum;
            maxIllumDiag = suitableDiags[diagIx];
        }
        diagIntegratedVignettedIllums.push([suitableDiags[diagIx], diagIntegratedVignettedIllum]);
    }

    offset = -calcDiagOffsetUsingEyeToDiagDistance(suitableDiags[0], diagToFocalPlaneDistance);
    common.offset().html(roundToDecimal(offset, digits) + selectedUomAbbrev + '.');
    common.diagSizeMinObstruct().html(suitableDiags[0] + selectedUomAbbrev + '.');
    common.diagSizeMaxIllum().html(maxIllumDiag + selectedUomAbbrev + '.');
    common.diagSizeEvenIllum().html(suitableDiags[suitableDiagsLength - 1] + selectedUomAbbrev + '.');
};

MLB.diagonal.processUomChange = function (startup) {
    var common = MLB.diagonal.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        graphDiags = MLB.diagonal.graphDiags,
        digits,
        lengthConversionFactor = 1;

    if (common.imperial()) {
        digits = 1;
        common.diagSizes().val(common.diagonalsInches.join(', '));
        if (startup === undefined) {
            lengthConversionFactor = 1 / 25.4;
        }
    } else {
        digits = 0;
        common.diagSizes().val(common.diagonalsMm.join(', '));
        if (startup === undefined) {
            lengthConversionFactor = 25.4;
        }
    }
    common.mirrorDia().val(roundToDecimal(+common.mirrorDia().val() * lengthConversionFactor, digits));
    common.focalLen().val(roundToDecimal(+common.focalLen().val() * lengthConversionFactor, digits));
    common.diagToFocalPlaneDistance().val(roundToDecimal(+common.diagToFocalPlaneDistance().val() * lengthConversionFactor, digits));
    common.maxField().val(roundToDecimal(+common.maxField().val() * lengthConversionFactor, digits));

    graphDiags();
};

$(document).ready(function () {
    var common = MLB.diagonal.common,
        graphDiags = MLB.diagonal.graphDiags,
        processUomChange = MLB.diagonal.processUomChange;

    // event hookups/subscribes
    common.btnGraphDiags().click(function () {
        graphDiags();
    });
    common.btnUom().click(function () {
        processUomChange();
    });

    processUomChange('startup');
    graphDiags();
});

// end of file