// copyright Mel Bartels, 2011-2014

'use strict';

MLB.visualDetectionCalc = {};

MLB.visualDetectionCalc.visualDetectCalcState = {
	parms: new MLB.calcLib.VisualDetectCalcParms()
};

MLB.visualDetectionCalc.plot = function () {
	var btnUom,
	    selectedUomAbbrev,
		divisor,
		aperture,
		bkgndBrightEye,
		objName,
		objMag,
		objSize1,
		objSize2,
		limitMag,
		formattedLimitMag,
		visualDetectCalcParms,
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
		visualDetectCalcState = MLB.visualDetectionCalc.visualDetectCalcState,
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

	// set vars from user input
	aperture = +$('[name=aperture]')[0].value;
	bkgndBrightEye = +$('[name=bkgndBrightEye]')[0].value;
	objName = $('[name=objName]')[0].value;
	objMag = +$('[name=objMag]')[0].value;
	objSize1 = +$('[name=objSize1]')[0].value;
	objSize2 = +$('[name=objSize2]')[0].value;

	// limiting magnitude
	limitMag = limitingMagnitude(aperture);
	if (bkgndBrightEye < 21.5) {
		limitMag -= 21.5 - bkgndBrightEye;
	}
	formattedLimitMag = roundToDecimal(limitMag, 1);
	$('[name=limitMag]')[0].value = roundToDecimal(formattedLimitMag - 1, 1) + ' to ' + formattedLimitMag;

	visualDetectCalcParms = visualDetectCalcState.parms;
	visualDetectCalcParms.apertureIn = aperture / divisor;
	visualDetectCalcParms.bkgndBrightEye = +bkgndBrightEye;
	visualDetectCalcParms.objName = objName;
	visualDetectCalcParms.objMag = +objMag;
	visualDetectCalcParms.maxObjArcmin = +(objSize1 >= objSize2 ? objSize1 : objSize2);
	visualDetectCalcParms.minObjArcmin = +(objSize1 >= objSize2 ? objSize2 : objSize1);
	// exit pupil sequence within aperture sequence sets this value
	//visualDetectCalcParms.eyepieceExitPupilmm = ;
	visualDetectCalcParms.apparentFoV = 100;
	// can override defaults if desired
	//visualDetectCalcParms.eyeLimitMag = ;
	//visualDetectCalcParms.exitPupilmm = ;
	//visualDetectCalcParms.scopeTrans = ;
	//visualDetectCalcParms.singleEyeFactor = ;

	// calculate detection thresholds
	apertureSeq = new VisualDetectCalcApertures(visualDetectCalcParms);

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
		title: 'Visual Detection Chart for ' + objName,
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

$(window).ready(function() {
	MLB.visualDetectionCalc.plot();
});

// end of file