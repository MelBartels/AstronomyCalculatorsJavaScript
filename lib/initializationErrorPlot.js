// copyright Mel Bartels, 2014

'use strict';

MLB.initializationErrorPlot = {};

// so that 180 degrees, or horizon to horizon just fits the canvas
MLB.initializationErrorPlot.radius = 90;
// init points random error is this, so this is the best possible pointing error
MLB.initializationErrorPlot.minPointingError = 0.7;

MLB.initializationErrorPlot.plotStar = function (star, context, center) {
	var radius = MLB.initializationErrorPlot.radius,
	    uom = MLB.sharedLib.uom,
	    mInt = MLB.sharedLib.int,
	    fillCircle = MLB.sharedLib.fillCircle,
		point = MLB.sharedLib.point,
	    azimuth,
		altitude,
		x,
		y;

	azimuth = star[0];
	altitude = star[1];
	y = center.y - mInt((radius - altitude) * Math.cos(azimuth * uom.degToRad));
	x = center.x - mInt((radius - altitude) * Math.sin(azimuth * uom.degToRad));
	fillCircle(context, point(x, y), 2, 'black');
};

MLB.initializationErrorPlot.plot = function (context, center, data, stars, maxError) {
	var plotStar = MLB.initializationErrorPlot.plotStar,
	    radius = MLB.initializationErrorPlot.radius,
		minPointingError = MLB.initializationErrorPlot.minPointingError,
	    uom = MLB.sharedLib.uom,
	    mInt = MLB.sharedLib.int,
	    point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		drawLine = MLB.sharedLib.drawLine,
		ix,
		row,
		azimuth,
		altitude,
		x,
		y,
		pointingError,
		brightness,
		errorToBrightnessScale,
		circleAltitude,
		circleAzimuth,
		azimuthPoint1,
		azimuthPoint2;

	for (ix = 0; ix < data.length; ix++) {
		row = data[ix];
		pointingError = row[1];
		azimuth = row[2];
		altitude = row[3];
		y = center.y - mInt((radius - altitude) * Math.cos(azimuth * uom.degToRad));
		x = center.x - mInt((radius - altitude) * Math.sin(azimuth * uom.degToRad));
		errorToBrightnessScale = 255 / (maxError - minPointingError);
		brightness = mInt((pointingError - minPointingError) * errorToBrightnessScale);
		if (brightness > 255) {
			brightness = 255;
		}
		if (brightness < 0) {
			brightness = 0;
		}
		fillCircle(context, point(x, y), 1, 'rgb(' + brightness.toString() + ',' + (255 - brightness).toString() + ', 0)');
	}

	plotStar(stars[0], context, center);
	plotStar(stars[1], context, center);

	for (circleAltitude = radius; circleAltitude > 0; circleAltitude -= 30) {
		drawCircle(context, center, circleAltitude, 1, 'blue');
	}
	for (circleAzimuth = 0; circleAzimuth < 180; circleAzimuth += 30) {
		azimuthPoint1 = point(center.x - radius * Math.cos(circleAzimuth * uom.degToRad), center.y - radius * Math.sin(circleAzimuth * uom.degToRad));
		azimuthPoint2 = point(2 * center.x - azimuthPoint1.x, 2 * center.y - azimuthPoint1.y);
		drawLine(context, 'blue', 1, azimuthPoint1, azimuthPoint2);
	}
};

MLB.initializationErrorPlot.load = function () {
	var radius = MLB.initializationErrorPlot.radius,
	    maxError = 2 * MLB.initializationErrorPlot.minPointingError,
		point = MLB.sharedLib.point,
	    canvas,
	    context,
		width,
	    height,
		center;

	canvas = document.getElementById("c1");
	context = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
	center = point(radius, height / 2);
	MLB.initializationErrorPlot.plot(context, center, MLB.initializationErrorPlotData.separation6, MLB.initializionErrorPlotStarAltaz6, maxError);

	canvas = document.getElementById("c2");
	context = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
	center = point(radius, height / 2);
	MLB.initializationErrorPlot.plot(context, center, MLB.initializationErrorPlotData.separation24, MLB.initializionErrorPlotStarAltaz24, maxError);

	canvas = document.getElementById("c3");
	context = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
	center = point(radius, height / 2);
	MLB.initializationErrorPlot.plot(context, center, MLB.initializationErrorPlotData.separation38, MLB.initializionErrorPlotStarAltaz38, maxError);

	canvas = document.getElementById("c4");
	context = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
	center = point(radius, height / 2);
	MLB.initializationErrorPlot.plot(context, center, MLB.initializationErrorPlotData.separation81, MLB.initializionErrorPlotStarAltaz81, maxError);
};

// end of file