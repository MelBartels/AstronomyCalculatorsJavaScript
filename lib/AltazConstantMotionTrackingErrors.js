// copyright Mel Bartels, 2015

'use strict';

MLB.AltazConstantMotionTrackingErrors = {};

// 180 degrees, horizon to horizon, will fit into the canvas plus a border
MLB.AltazConstantMotionTrackingErrors.canvasBorder = 10;
MLB.AltazConstantMotionTrackingErrors.canvasSize = 360 + MLB.AltazConstantMotionTrackingErrors.canvasBorder;

MLB.AltazConstantMotionTrackingErrors.plotEngine = function (context, drawingScale, center, data, spacingDeg, acceptableDriftArcseconds) {
	var uom = MLB.sharedLib.uom,
	    mInt = MLB.sharedLib.int,
	    point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		drawLine = MLB.sharedLib.drawLine,
		ix,
		dataLength = data.length,
		row,
		azimuth,
		altitude,
		x,
		y,
		errorArcsec,
		pointRadius,
		fillStyle = 'blue',
		brightness,
		errorToBrightnessScale,
		circleAzimuth,
		circleAltitude,
		azimuthPoint1,
		azimuthPoint2;

	// make the pointRadius large enough to cover all pixels
	pointRadius = mInt(drawingScale * spacingDeg);

	for (ix = 0; ix < dataLength; ix++) {
		row = data[ix];
		azimuth = row[0];
		altitude = row[1];
		errorArcsec = row[2] / uom.arcsecToRad;
		// zenith = 90 degrees (center of polar projection), horizon = 0 degrees (perimeter of projection's circle)
		y = center.y - mInt((90 - altitude / uom.degToRad) * Math.cos(azimuth) * drawingScale);
		x = center.x - mInt((90 - altitude / uom.degToRad) * Math.sin(azimuth) * drawingScale);
		errorToBrightnessScale = 255 / acceptableDriftArcseconds;
		brightness = mInt(errorArcsec * errorToBrightnessScale);
		if (brightness > 255) {
			brightness = 255;
		} else if (brightness < 0) {
			brightness = 0;
		}
		fillCircle(context, point(x, y), pointRadius, 'rgb(' + brightness.toString() + ',' + (255 - brightness).toString() + ', 0)');
	}

	// draw azimuth circles for varying altitudes
	for (circleAltitude = 90 * drawingScale; circleAltitude > 0; circleAltitude -= 30 * drawingScale) {
		drawCircle(context, center, circleAltitude, 1, fillStyle);
	}
	// draw altitude lines for varying azimuths
	for (circleAzimuth = 0; circleAzimuth < 180; circleAzimuth += 30) {
		azimuthPoint1 = point(center.x - 90 * drawingScale * Math.sin(circleAzimuth * uom.degToRad), center.y + 90 * drawingScale * Math.cos(circleAzimuth * uom.degToRad));
		azimuthPoint2 = point(2 * center.x - azimuthPoint1.x, 2 * center.y - azimuthPoint1.y);
		drawLine(context, 'blue', 1, azimuthPoint1, azimuthPoint2);
	}
	// draw circle to clean up any plotting outside of the zero azimuth circle; numbers determined empirically
	drawCircle(context, center, 92 * drawingScale, 5, 'white');
	// write out cardinal directions; constants determined empirically
	context.fillStyle = fillStyle;
	context.fillText('North', center.x, 6);
	context.fillText('South', center.x, center.y * 2);
	context.fillText('East', center.x * 2 - 22, center.y);
	context.fillText('West', 1, center.y);
};

MLB.AltazConstantMotionTrackingErrors.plot = function () {
	var uom = MLB.sharedLib.uom,
	    point = MLB.sharedLib.point,
		createAltazConstantMotionTrackingErrors = MLB.calcLib.createAltazConstantMotionTrackingErrors,
	    plotEngine = MLB.AltazConstantMotionTrackingErrors.plotEngine,
		canvasBorder = MLB.AltazConstantMotionTrackingErrors.canvasBorder,
		canvasSize = MLB.AltazConstantMotionTrackingErrors.canvasSize,
		latitudeDeg = $('#latitudeDeg')[0].value,
		latitudeRad = latitudeDeg * uom.degToRad,
		acceptableDriftArcseconds = $('#acceptableDriftArcseconds')[0].value,
		trackTimeSeconds = $('#trackTimeSeconds')[0].value,
		constantTrackRateTimeRad = trackTimeSeconds * uom.secToRad,
		// positions aimed at in the sky are angularly separated by this number of degrees
		spacingDeg = 1,
	    canvas,
	    context,
		center,
		drawingScale,
		data;

	canvas = $('#canvas')[0];
	context = canvas.getContext('2d');
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	// eg, 90 degrees fits into half of the canvas' size
	drawingScale = (canvasSize - canvasBorder) / 2 / 90;
	center = point(canvas.width / 2, canvas.height / 2);

	data = createAltazConstantMotionTrackingErrors(latitudeRad, constantTrackRateTimeRad, spacingDeg);
	plotEngine(context, drawingScale, center, data, spacingDeg, acceptableDriftArcseconds);
};

MLB.AltazConstantMotionTrackingErrors.load = function () {
	var btnPlot = $('#btnPlot')[0],
	    plot = MLB.AltazConstantMotionTrackingErrors.plot;

	btnPlot.onclick = function () {
		plot();
	};

	plot();
};

$(window).ready(function () {
	MLB.AltazConstantMotionTrackingErrors.load();
});

// end of file