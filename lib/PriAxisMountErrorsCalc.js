// copyright Mel Bartels, 2011-2014

'use strict';

MLB.priAxisMountErrorsCalc = {};

MLB.priAxisMountErrorsCalc.setLabel = function (initType) {
	var InitType = MLB.coordLib.InitType;

	return initType === InitType.altazimuth || initType === InitType.star ? 'Elevation (degrees)' : 'Declination (degrees)';
};

MLB.priAxisMountErrorsCalc.setNumberTicks = function (initType) {
	var InitType = MLB.coordLib.InitType;

	return initType === InitType.altazimuth || initType === InitType.star ? 10 : 19;
};

MLB.priAxisMountErrorsCalc.setYmax = function (initType, latDeg) {
	var InitType = MLB.coordLib.InitType;

	return initType === InitType.altazimuth || initType === InitType.star ? 90 : latDeg >= 0 ? 90 : -90;
};

MLB.priAxisMountErrorsCalc.setYmin = function setYmin(initType, latDeg) {
	var InitType = MLB.coordLib.InitType;

	return initType === InitType.altazimuth || initType === InitType.star ? 0 : latDeg >= 0 ? -90 : 90;
};

MLB.priAxisMountErrorsCalc.plot = function () {
	var z1Deg,
	    z2Deg,
		latDeg,
		priAxisDeg,
		measurements,
		measurementType,
		mountingType,
		initType,
		init,
		series,
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		setLabel = MLB.priAxisMountErrorsCalc.setLabel,
		setNumberTicks = MLB.priAxisMountErrorsCalc.setNumberTicks,
		setYmax = MLB.priAxisMountErrorsCalc.setYmax,
		setYmin = MLB.priAxisMountErrorsCalc.setYmin,
		InitZ12Calc = MLB.calcLib.InitZ12Calc,
		getZ12ErrorValues = MLB.calcLib.getZ12ErrorValues,
		buildZ12AzErrors = MLB.calcLib.buildZ12AzErrors,
		MeasurementType = MLB.calcLib.MeasurementType,
		InitType = MLB.coordLib.InitType;

	// set vars from user input using jquery
	z1Deg = +$('input[name=z1Deg]').val();
	z2Deg = +$('input[name=z2Deg]').val();
	latDeg = +$('input[name=latDeg]').val();
	priAxisDeg = +$('input[name=priAxisDeg]').val();

	mountingType = $('input[name=mountingType]');
	if (mountingType[0].checked) {
		initType = InitType.altazimuth;
	} else if (mountingType[1].checked) {
		initType = InitType.equatorial;
	}

	measurements = $('input[name=measurements]');
	if (measurements[0].checked) {
		measurementType = MeasurementType.real;
	} else if (measurements[1].checked) {
		measurementType = MeasurementType.apparent;
	}

	getZ12ErrorValues(z1Deg, z2Deg, latDeg, priAxisDeg, initType);
	init = InitZ12Calc.init;

	series = [];
	series.push(buildZ12AzErrors(init.positions, init.z1Errors, measurementType, initType));
	series.push(buildZ12AzErrors(init.positions, init.z2Errors, measurementType, initType));

	// build the series labels
	seriesLabels = [seriesLabel('Bend only'), seriesLabel('Offset only')];

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot('plot', series, {
		title: 'Comparison of primary axis errors',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		sortData: false, // otherwise line chart zigzags between + and - values
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'Primary axis error (arc-minutes)',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: 13,
				max: 60,
				min: -60
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: setLabel(initType),
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: setNumberTicks(initType),
				max: setYmax(initType, latDeg),
				min: setYmin(initType, latDeg)
			}
		},
		series: seriesLabels
	}).replot();
};

// end of file