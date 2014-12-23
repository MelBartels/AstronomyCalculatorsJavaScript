// copyright Mel Bartels, 2011-2014

'use strict';

MLB.refractionCalc = {};

MLB.refractionCalc.plot = function () {
	var elevation,
	    refractionPoint,
		series,
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		uom = MLB.sharedLib.uom,
		calcRefractionFromTrue = MLB.coordLib.calcRefractionFromTrue;

	series = [];
	refractionPoint = [];
	for (elevation = 0; elevation <= 90; elevation++) {
		refractionPoint.push([calcRefractionFromTrue(elevation) / uom.arcminToRad, elevation]);
	}
	series.push(refractionPoint);
	// build the series labels
	seriesLabels = [seriesLabel('refraction')];

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot('refractionChart', series, {
		title: 'Plot of refraction for elevation',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'refraction (arc minutes)',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: 9,
				max: 40,
				min: 0
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'elevation (degrees)',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: 10,
				max: 90,
				min: 0
			}
		},
		series: seriesLabels
	}).replot();
};

$(window).ready(function () {
	MLB.refractionCalc.plot();
});

// end of file
