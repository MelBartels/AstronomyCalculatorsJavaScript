// copyright Mel Bartels, 2011-2016

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

MLB.diagonal.graphDiags = function () {
	var common = MLB.diagonal.common,
		roundToDecimal =  MLB.sharedLib.roundToDecimal,
		plot = MLB.diagonal.plot,
		calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		getDiagIllumArray = MLB.calcLib.getDiagIllumArray,
		calcDiagOffset = MLB.calcLib.calcDiagOffset,
		seriesLabel = MLB.sharedLib.seriesLabel,
		displayOffset = MLB.diagonal.displayOffset,
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
		minDiag,
		suitableDiags,
		diagonalsLength,
		ix,
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
		seriesLabels;

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

    diagonals = common.diagSizes().val().split(',').map(Number);
	diagToFocalPlaneDistance = +common.diagToFocalPlaneDistance().val();
	focalLen = +common.focalLen().val();
	mirrorDia = +common.mirrorDia().val();
	maxField = +common.maxField().val();
	acceptableMagLoss = +common.acceptableMagLoss().val();
	
	minDiag = diagToFocalPlaneDistance / (focalLen / mirrorDia);
	minIllum = inverseMagnitudeDrop(acceptableMagLoss);

	suitableDiags = [];
	diagonalsLength = diagonals.length;
	for (ix = 0; ix < diagonalsLength; ix++) {
		diagSize = diagonals[ix];
		offAxisIllum = calcOffAxisIllumination(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, maxField / 2);
		if (diagSize >= minDiag && offAxisIllum >= minIllum) {
			suitableDiags.push(diagSize);
		}
		if (offAxisIllum === 1) {
			break;
		}
	}

	/* calcs[] is: array[diagonals], each element consisting of:
					array[off-axis points], each element consisting of:
					 array[2]: 1st element is the off-axis distance and 2nd element the illumination value */
	calcs = [];
	lossDueToDiagonals = [];
	suitableDiagsLength = suitableDiags.length;
	for (ix = 0; ix < suitableDiagsLength; ix++) {
		calcs.push(getDiagIllumArray(mirrorDia, focalLen, suitableDiags[ix], diagToFocalPlaneDistance, offAxisIncrement, maxField));
		lossDueToDiagonals.push(diagObstructionArea(mirrorDia, suitableDiags[ix]));
	}

	// generate plot data
	offAxisPts = calcs[0].length;
	inverseIncr = 1 / offAxisIncrement;
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

	plot(series, selectedUomAbbrev, offAxisPts, formatString, seriesLabels, acceptableMagLoss);

	offset = calcDiagOffset(mirrorDia, focalLen, suitableDiags[0], diagToFocalPlaneDistance);
	common.offset().html(roundToDecimal(offset, digits) + selectedUomAbbrev);
};

MLB.diagonal.processUomChange = function (startup) {
	var common = MLB.diagonal.common,
		roundToDecimal =  MLB.sharedLib.roundToDecimal,
		digits,
		lengthConversionFactor = 1;

	if (common.imperial()) {
		digits = 1,
		common.diagSizes().val(common.diagonalsInches.join(', '));
		if (startup === undefined) {
			lengthConversionFactor = 1 / 25.4;
		}
	} else {
		digits = 0,
		common.diagSizes().val(common.diagonalsMm.join(', '));
		if (startup === undefined) {
			lengthConversionFactor = 25.4;
		}
	}
	common.mirrorDia().val(roundToDecimal(+common.mirrorDia().val() * lengthConversionFactor, digits));
	common.focalLen().val(roundToDecimal(+common.focalLen().val() * lengthConversionFactor, digits));
	common.diagToFocalPlaneDistance().val(roundToDecimal(+common.diagToFocalPlaneDistance().val() * lengthConversionFactor, digits));
	common.maxField().val(roundToDecimal(+common.maxField().val() * lengthConversionFactor, digits));
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