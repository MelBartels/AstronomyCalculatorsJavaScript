// copyright Mel Bartels, 2011-2017

'use strict';

MLB.visualDetectionCalc = {};

MLB.visualDetectionCalc.data = {
    parms: new MLB.calcLib.VisualDetectCalcParms(),
    VisualDetectCalc: new MLB.calcLib.VisualDetectCalc()
};

MLB.visualDetectionCalc.setParms = function (parms) {
    var aperture,
        bkgndBrightEye,
        objName,
        objMag,
        objSize1,
        objSize2;

    // set vars from user input
    aperture = +$('[name=aperture]')[0].value;
    bkgndBrightEye = +$('[name=bkgndBrightEye]')[0].value;
    objName = $('[name=objName]')[0].value;
    objMag = +$('[name=objMag]')[0].value;
    objSize1 = +$('[name=objSize1]')[0].value;
    objSize2 = +$('[name=objSize2]')[0].value;

    parms.apertureIn = aperture;
    parms.bkgndBrightEye = bkgndBrightEye;
    parms.objName = objName;
    parms.objMag = +objMag;
    parms.maxObjArcmin = +(objSize1 >= objSize2
        ? objSize1
        : objSize2);
    parms.minObjArcmin = +(objSize1 >= objSize2
        ? objSize2
        : objSize1);
    // exit pupil sequence within aperture sequence sets this value; set here because writeDetailText() needs it
    parms.eyepieceExitPupilmm = 6;
    parms.apparentFoV = 100;
    // can override defaults if desired
    //parms.eyeLimitMag = ;
    //parms.exitPupilmm = ;
    //parms.scopeTrans = ;
    //parms.singleEyeFactor = ;
};

MLB.visualDetectionCalc.plot = function () {
    var btnUom,
        selectedUomAbbrev,
        divisor,
        limitMag,
        formattedLimitMag,
        apertureSeq,
        aps,
        ap,
        eps,
        ep,
        logContrast,
        seriesLabels,
        apsLength,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        seriesLabelDiamondMarker = MLB.sharedLib.seriesLabelDiamondMarker,
        data = MLB.visualDetectionCalc.data,
        parms = data.parms,
        setParms = MLB.visualDetectionCalc.setParms,
        limitingMagnitude = MLB.calcLib.limitingMagnitude,
        VisualDetectCalcApertures = MLB.calcLib.VisualDetectCalcApertures;

    // set uom
    btnUom = $('[name=uom]');
    if (btnUom[0].checked) {
        selectedUomAbbrev = '"';
        divisor = 1;
    } else if (btnUom[1].checked) {
        selectedUomAbbrev = 'mm';
        divisor = 25.4;
    }

    setParms(parms);

    // limiting magnitude
    limitMag = limitingMagnitude(parms.apertureIn);
    if (parms.bkgndBrightEye < 21.5) {
        limitMag -= 21.5 - parms.bkgndBrightEye;
    }
    formattedLimitMag = roundToDecimal(limitMag, 1);
    $('[name=limitMag]')[0].value = roundToDecimal(formattedLimitMag - 1, 1) + ' to ' + formattedLimitMag;

    // calculate detection thresholds
    apertureSeq = new VisualDetectCalcApertures(parms);

    // generate plot data
    aps = [];
    for (ap = 0; ap < 3; ap++) {
        eps = [];
        for (ep = 7; ep > 0; ep--) {
            logContrast = apertureSeq[ap][ep - 1];
            if (logContrast.fitsFoV) {
                eps.push([ep, logContrast.logContrastDiff]);
            }
        }
        aps.push(eps);
    }

    // build the series labels: each series label represents an aperture
    seriesLabels = [];
    apsLength = aps.length;
    for (ap = 0; ap < apsLength; ap++) {
        seriesLabels.push(seriesLabelDiamondMarker(apertureSeq[ap][0].parms.apertureIn * divisor + selectedUomAbbrev));
    }

    // if object too big for doubled aperture, then remove doubled aperture from graph
    if (aps[0].length === 0) {
        aps.splice(0, 1);
        seriesLabels.splice(0, 1);
    }
    // if object too big for selected aperture, then alert
    if (aps[0].length === 0) {
        alert('object too big for selected aperture');
        return;
    }

    // plot it, include replot
    $.jqplot.config.enablePlugins = true;
    $.jqplot('visualDetectionCalcChart', aps, {
        title: 'Visual Detection Chart for ' + parms.objName,
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            xaxis: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                label: 'Exit pupil (mm)',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                numberTicks: 7,
                min: 7,
                max: 1
            },
            yaxis: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                label: 'Eye\'s ability to detect (log contrast)',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            }
        },
        series: seriesLabels
    }).replot();
};

MLB.visualDetectionCalc.writeDetailText = function () {
    var data = MLB.visualDetectionCalc.data,
        parms = data.parms,
        VisualDetectCalc = data.VisualDetectCalc,
        setParms = MLB.visualDetectionCalc.setParms,
        results,
        string,
        json,
        detail,
        detailTable,
        htmlStr;

    setParms(parms);

    results = VisualDetectCalc.calc(parms);
    string = VisualDetectCalc.includeResultAsString(results).text;
    json = VisualDetectCalc.includeResultAsJSON(results).json;

    //detail = $('#detail');
    //detail.html('<div>Text detail is:<br>' + string.replace(/ /g, '&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br>') + '</div>');

    htmlStr = '<table><tbody>';
    $.each(json, function (ix, row) {
        htmlStr += '<tr>';
        htmlStr += '<td>' + row.label + '</td><td>' + row.result + '</tr>';
        htmlStr += '</tr>';
    });
    htmlStr += '</table></tbody>';

    detailTable = $('#detailTable');
    detailTable.html(htmlStr);
};

$(window).ready(function () {
    var plot = MLB.visualDetectionCalc.plot,
        writeDetailText = MLB.visualDetectionCalc.writeDetailText,
        btnCalc = $('input[id=btnCalc]');

    // event hookups/subscribes
    btnCalc.click(function () {
        plot();
        writeDetailText();
    });

    plot();
    writeDetailText();
});

// end of file