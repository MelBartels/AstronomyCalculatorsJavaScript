// copyright Mel Bartels, 2011-2014

'use strict';

MLB.trajectoryCalc = {};

MLB.trajectoryCalc.plot = function () {
	var initialDistance,
	    initialVel,
		endVel,
		maxVel,
		accel,
		traj,
		ru,
		mv,
		rd,
		totalTime,
		totalDistance,
		series,
		trajPlot,
		tIncr,
		t,
		distance,
		netDistance,
		seriesLabels,
		seriesLabel = MLB.sharedLib.seriesLabel,
		Trajectory = MLB.trajLib.Trajectory,
		trajFromAccelDistanceMaxVelBegVelEndVel = MLB.trajLib.trajFromAccelDistanceMaxVelBegVelEndVel,
		distanceFromTimeAccelBegVelEndVel = MLB.trajLib.distanceFromTimeAccelBegVelEndVel,
		distanceFromTrajTime = MLB.trajLib.distanceFromTrajTime;

	// set vars from user input
	initialDistance = +$('[name=initialDistance]')[0].value;
	initialVel = +$('[name=initialVel]')[0].value;
	endVel = +$('[name=endVel]')[0].value;
	maxVel = +$('[name=maxVel]')[0].value;
	accel = +$('[name=accel]')[0].value;

	// guard conditions
	if (maxVel < Math.abs(initialVel) || maxVel < Math.abs(endVel)) {
		alert('max velocity cannot be smaller than initial or ending velocity');
		return;
	}

	traj = new Trajectory();
	trajFromAccelDistanceMaxVelBegVelEndVel(traj, accel, initialDistance, maxVel, initialVel, endVel);
	ru = traj.rampUp;
	mv = traj.maxVel;
	rd = traj.rampDown;
	totalTime = traj.totalTime;
	totalDistance = traj.totalDistance;

	/* plots: position versus time for both trajectories (the constant velocity second trajectory will be a line) along with net distance versus time,
			  velocity versus time for both trajectories (the constant velocity second trajectory will be a line)
	*/

	// first plot: position versus time

	// chase trajectory
	series = [];
	trajPlot = [];
	// time, position at ramp up, max velocity, ramp down transition points
	trajPlot.push([0, 0]);
	trajPlot.push([ru.time, ru.distance]);
	trajPlot.push([ru.time + mv.time, ru.distance + mv.distance]);
	trajPlot.push([ru.time + mv.time + rd.time, ru.distance + mv.distance + rd.distance]);

	tIncr = traj.totalTime / 100;
	// ramp up curve
	for (t = tIncr; t < ru.time; t += tIncr) {
		distance = distanceFromTimeAccelBegVelEndVel(t, ru.accel, ru.begVel, ru.endVel);
		trajPlot.push([t, distance]);
	}
	// ramp down curve
	for (t = tIncr; t < rd.time; t += tIncr) {
		distance = distanceFromTimeAccelBegVelEndVel(t, rd.accel, rd.begVel, rd.endVel);
		trajPlot.push([ru.time + mv.time + t, ru.distance + mv.distance + distance]);
	}
	series.push(trajPlot);

	// target trajectory
	trajPlot = [];
	trajPlot.push([0, initialDistance]);
	trajPlot.push([totalTime, totalDistance]);
	series.push(trajPlot);

	// net distance
	trajPlot = [];
	// time, net distance at ramp up, max velocity, ramp down transition points
	for (t = 0; t <= traj.totalTime; t += tIncr) {
		distance = distanceFromTrajTime(traj, t);
		netDistance = initialDistance + endVel * t - distance;
		trajPlot.push([t, netDistance]);
	}
	series.push(trajPlot);

	// build the series labels
	seriesLabels = [seriesLabel('chase'), seriesLabel('target'), seriesLabel('net distance')];

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot('plot1', series, {
		title: 'Plot of distance versus time',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'time',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'distance',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			}
		},
		series: seriesLabels
	}).replot();

	// second plot: velocity versus time

	series = [];
	trajPlot = [];
	// time, velocity at ramp up, max velocity, ramp down transition points
	trajPlot.push([0, initialVel]);
	trajPlot.push([ru.time, ru.endVel]);
	trajPlot.push([ru.time + mv.time, mv.endVel]);
	trajPlot.push([ru.time + mv.time + rd.time, rd.endVel]);

	series.push(trajPlot);

	trajPlot = [];
	trajPlot.push([0, endVel]);
	trajPlot.push([traj.totalTime, endVel]);
	series.push(trajPlot);

	// build the series labels
	seriesLabels = [seriesLabel('chase'), seriesLabel('target')];

	// plot it, include replot
	$.jqplot.config.enablePlugins = true;
	$.jqplot('plot2', series, {
		title: 'Plot of velocity versus time',
		legend: {
			show: true,
			placement: 'outsideGrid'
		},
		axes: {
			xaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'time',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			},
			yaxis: {
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				label: 'velocity',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			}
		},
		series: seriesLabels
	}).replot();
};

$(window).ready(function () {
	var btnCalc = $('input[id=btnCalc]'),
		plot = MLB.trajectoryCalc.plot;

	// event hookups/subscribes
	btnCalc.click(function () {
		plot();
	});

	plot();
});

// end of file