// copyright Mel Bartels, 2011-2014

'use strict';

MLB.airmassCalc = {};

MLB.airmassCalc.plot = function () {
	var elevation, airmassPoint, series, seriesLabels, seriesLabel = MLB.sharedLib.seriesLabel, calcAirMass = MLB.coordLib.calcAirMass;

	series = [];
	airmassPoint = [];
	for (elevation = 0; elevation <= 90; elevation++) {
		airmassPoint.push([calcAirMass(elevation), elevation]);
	}
	series.push(airmassPoint);
	// build the series labels
	seriesLabels = [seriesLabel('airmass')];

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot('airmassChart', series, {
		title: 'Plot of airmass for elevation',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'airmass',
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
	MLB.airmassCalc.plot();
});

// end of file