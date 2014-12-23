// copyright Mel Bartels, 2011-2014

'use strict';

MLB.diagonal = {};

MLB.diagonal.displayOffset = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, digits, selectedUomAbbrev) {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    calcDiagOffset = MLB.calcLib.calcDiagOffset,
	    offset = calcDiagOffset(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance);

	$('td[id=offset]').html(roundToDecimal(offset, digits) + selectedUomAbbrev);
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

MLB.diagonal.graphDiag = function () {
	var minIllum,
	    btnUom,
		selectedUomAbbrev,
		offAxisIncrement,
		formatString,
		digits,
		diagToFocalPlaneDistance,
		focalLen,
		mirrorDia,
		maxField,
		acceptableMagLoss,
		diagSize,
		minDiag,
		offAxisIllums,
		lossDueToDiagonal,
		offAxisPts,
		inverseIncr,
		illumIx,
		series,
		tickLabel,
		drop,
		maxDrop,
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		displayOffset = MLB.diagonal.displayOffset,
		plot = MLB.diagonal.plot,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		getDiagIllumArray = MLB.calcLib.getDiagIllumArray;

	btnUom = $('[name=uom]');
	if (btnUom[0].checked) {
		selectedUomAbbrev = '"';
		offAxisIncrement = 0.1;
		formatString = '%3.1f';
		digits = 2;
	} else if (btnUom[1].checked) {
		selectedUomAbbrev = 'mm';
		offAxisIncrement = 2;
		formatString = '%1d';
		digits = 0;
	}

	diagToFocalPlaneDistance = +$('[name=diagToFocalPlaneDistance]')[0].value;
	focalLen = +$('[name=focalLen]')[0].value;
	mirrorDia = +$('[name=mirrorDia]')[0].value;
	maxField = +$('[name=maxField]')[0].value;
	acceptableMagLoss = +$('[name=acceptableMagLoss]')[0].value;
	diagSize = +$('[name=diagSize]')[0].value;

	minDiag = diagToFocalPlaneDistance / (focalLen / mirrorDia);
	if (diagSize < minDiag) {
		alert('Diagonal too small, needs to be at least ' + minDiag + ', try again.');
		return;
	}

	minIllum = inverseMagnitudeDrop(acceptableMagLoss);

	/* offAxisIllums: array[off-axis points], each element consisting of:
					   array[2]: 1st element is the off-axis distance and 2nd element the illumination value */

	offAxisIllums = getDiagIllumArray(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, offAxisIncrement, maxField);
	lossDueToDiagonal = diagObstructionArea(mirrorDia, diagSize);

	// generate plot data
	offAxisPts = offAxisIllums.length;
	inverseIncr = 1 / offAxisIncrement;
	series = [
		[], []
	];

	for (illumIx = 0; illumIx < offAxisPts; illumIx++) {
		tickLabel = Math.round(offAxisIllums[illumIx][0] * inverseIncr) / inverseIncr;
		drop = magnitudeDrop(offAxisIllums[illumIx][1] - lossDueToDiagonal);
		maxDrop = magnitudeDrop(minIllum);
		series[0].push([tickLabel, drop]);
		series[1].push([tickLabel, maxDrop]);
	}
	seriesLabels = [];
	seriesLabels.push(seriesLabel(diagSize + selectedUomAbbrev + ' diagonal'));
	seriesLabels.push(seriesLabel('max allowed drop'));

	plot(series, selectedUomAbbrev, offAxisPts, formatString, seriesLabels, acceptableMagLoss);
	displayOffset(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, digits, selectedUomAbbrev);
};

MLB.diagonal.graphSelectedDiags = function () {
	var minIllum,
	    diagonalsInches,
		diagonalsMm,
		diagonals,
		btnUom,
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
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		displayOffset = MLB.diagonal.displayOffset,
		plot = MLB.diagonal.plot,
		calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
		diagObstructionArea = MLB.calcLib.diagObstructionArea,
		getDiagIllumArray = MLB.calcLib.getDiagIllumArray;

	diagonalsInches = [1, 1.3, 1.52, 1.83, 2.14, 2.6, 3.1, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12];
	diagonalsMm = [25, 35, 44, 50, 63, 75, 82, 100, 110, 120, 130, 140, 150, 160, 175, 200, 225, 250, 300];
	diagonals = [];

	btnUom = $('[name=uom]');
	if (btnUom[0].checked) {
		selectedUomAbbrev = '"';
		offAxisIncrement = 0.1;
		formatString = '%3.1f';
		digits = 2;
		diagonals = diagonalsInches;
	} else if (btnUom[1].checked) {
		selectedUomAbbrev = 'mm';
		offAxisIncrement = 2;
		formatString = '%1d';
		digits = 0;
		diagonals = diagonalsMm;
	}

	diagToFocalPlaneDistance = +$('[name=diagToFocalPlaneDistance]')[0].value;
	focalLen = +$('[name=focalLen]')[0].value;
	mirrorDia = +$('[name=mirrorDia]')[0].value;
	maxField = +$('[name=maxField]')[0].value;
	acceptableMagLoss = +$('[name=acceptableMagLoss]')[0].value;

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
	displayOffset(mirrorDia, focalLen, suitableDiags[0], diagToFocalPlaneDistance, digits, selectedUomAbbrev);
};

$(document).ready(function () {
	var btnGraphSelectedDiags = $('input[id=btnGraphSelectedDiags]'),
	    btnGraphDiag = $('input[id=btnGraphDiag]'),
		graphSelectedDiags = MLB.diagonal.graphSelectedDiags,
		graphDiag = MLB.diagonal.graphDiag;

	// event hookups/subscribes
	btnGraphSelectedDiags.click(function () {
		graphSelectedDiags();
	});
	btnGraphDiag.click(function () {
		graphDiag();
	});

	graphSelectedDiags();
});

// end of file