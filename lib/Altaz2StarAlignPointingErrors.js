// copyright Mel Bartels, 2014

'use strict';

MLB.Altaz2StarAlignPointingErrors = {};

// star name, RA in degrees, Dec in degrees
MLB.Altaz2StarAlignPointingErrors.stars = [
	['Altair', 297.6958333333333, 8.8683],
	['Deneb', 310.35791666666665, 45.280277777777776],
	['Fomalhaut', 344.4142416666666, -29.622913888888892],
	['Sadr (Gammi Cygni)', 305.557091, 40.256679166666665],
	['Polaris', 37.954166666666666, 89.2641],
	['Vega', 279.23333333333335, 38.7837]
];

// two columns for indeces for the two initialization stars into MLB.Altaz2StarAlignPointingErrors.stars followed by a column for their angular separation in degrees
MLB.Altaz2StarAlignPointingErrors.initStarsData = [
	[1, 2, 81],
	[4, 0, 81],
	[1, 0, 38],
	[4, 2, 119],
	[1, 5, 24],
	[5, 3, 20],
	[1, 3, 6]
];

MLB.Altaz2StarAlignPointingErrors.selectedInitStarsData = undefined;

MLB.Altaz2StarAlignPointingErrors.initStars = [
	new MLB.coordLib.Position(),
	new MLB.coordLib.Position()
];

MLB.Altaz2StarAlignPointingErrors.latitudeRad = 35 * MLB.sharedLib.uom.degToRad;
MLB.Altaz2StarAlignPointingErrors.refreshIntervalId = undefined;
MLB.Altaz2StarAlignPointingErrors.lastNumberTrials = undefined;

// 180 degrees, horizon to horizon, will fit into the canvas plus a border
MLB.Altaz2StarAlignPointingErrors.canvasBorder = 10;
MLB.Altaz2StarAlignPointingErrors.canvasSize = 360 + MLB.Altaz2StarAlignPointingErrors.canvasBorder;

MLB.Altaz2StarAlignPointingErrors.plotStar = function (position, starName, context, drawingScale, center) {
	var uom = MLB.sharedLib.uom,
	    mInt = MLB.sharedLib.int,
	    fillCircle = MLB.sharedLib.fillCircle,
		point = MLB.sharedLib.point,
	    azimuth,
		altitude,
		x,
		y,
		// scale the star's dot
		pointRadius = mInt(drawingScale) * 2;

	azimuth = position.az / uom.degToRad;
	altitude = position.alt / uom.degToRad;
	// zenith = 90 degrees (center of polar projection), horizon = 0 degrees (perimeter of projection's circle)
	y = center.y - mInt((90 - altitude) * Math.cos(azimuth * uom.degToRad) * drawingScale);
	x = center.x - mInt((90 - altitude) * Math.sin(azimuth * uom.degToRad) * drawingScale);
	fillCircle(context, point(x, y), pointRadius, 'black');
	context.fillText(starName, x + pointRadius, y);
};

MLB.Altaz2StarAlignPointingErrors.plotEngine = function (context, drawingScale, center, plotData, maxPointErrorDeg, minPointingErrorDeg, spacingDeg) {
	var plotStar = MLB.Altaz2StarAlignPointingErrors.plotStar,
	    stars = MLB.Altaz2StarAlignPointingErrors.stars,
	    initStars = MLB.Altaz2StarAlignPointingErrors.initStars,
	    initStarsData = MLB.Altaz2StarAlignPointingErrors.initStarsData,
		selectedInitStarsData = MLB.Altaz2StarAlignPointingErrors.selectedInitStarsData,
	    uom = MLB.sharedLib.uom,
	    mInt = MLB.sharedLib.int,
	    point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		drawLine = MLB.sharedLib.drawLine,
		maxPointErrorRad = maxPointErrorDeg * uom.degToRad,
		minPointingErrorRad = minPointingErrorDeg * uom.degToRad,
		ix,
		plotDataLength = plotData.length,
		row,
		azimuth,
		altitude,
		x,
		y,
		error,
		pointRadius,
		brightness,
		errorToBrightnessScale,
		starName,
		circleAltitude,
		circleAzimuth,
		azimuthPoint1,
		azimuthPoint2;

	// make the pointRadius large enough to cover all pixels
	pointRadius = mInt(drawingScale * spacingDeg);
	for (ix = 0; ix < plotDataLength; ix++) {
		row = plotData[ix];
		error = row.error;
		azimuth = row.azimuth;
		altitude = row.altitude;
		// zenith = 90 degrees (center of polar projection), horizon = 0 degrees (perimeter of projection's circle)
		y = center.y - mInt((90 - altitude / uom.degToRad) * Math.cos(azimuth) * drawingScale);
		x = center.x - mInt((90 - altitude / uom.degToRad) * Math.sin(azimuth) * drawingScale);
		errorToBrightnessScale = 255 / (maxPointErrorRad - minPointingErrorRad);
		brightness = mInt((error - minPointingErrorRad) * errorToBrightnessScale);
		if (brightness > 255) {
			brightness = 255;
		} else if (brightness < 0) {
			brightness = 0;
		}
		fillCircle(context, point(x, y), pointRadius, 'rgb(' + brightness.toString() + ',' + (255 - brightness).toString() + ', 0)');
	}

	// initStarsData is an array of that associates the two initialization stars
	// stars is an array of star data
	starName = stars[initStarsData[selectedInitStarsData][0]][0];
	plotStar(initStars[0], starName, context, drawingScale, center);
	starName = stars[initStarsData[selectedInitStarsData][1]][0];
	plotStar(initStars[1], starName, context, drawingScale, center);

	// draw azimuth circles for varying altitudes
	for (circleAltitude = 90 * drawingScale; circleAltitude > 0; circleAltitude -= 30 * drawingScale) {
		drawCircle(context, center, circleAltitude, 1, 'blue');
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
	context.fillText('North', center.x, 6);
	context.fillText('South', center.x, center.y * 2);
	context.fillText('East', center.x * 2 - 22, center.y);
	context.fillText('West', 1, center.y);
};

MLB.Altaz2StarAlignPointingErrors.updateInitStarsFromInitStarsList = function () {
	var uom = MLB.sharedLib.uom,
	    copyPosition = MLB.coordLib.copyPosition,
	    convertStyle = MLB.coordLib.ConvertStyle.matrix,
	    XForm = MLB.coordLib.XForm,
	    stars = MLB.Altaz2StarAlignPointingErrors.stars,
		initStars = MLB.Altaz2StarAlignPointingErrors.initStars,
	    initStarsData = MLB.Altaz2StarAlignPointingErrors.initStarsData,
		latitudeRad = MLB.Altaz2StarAlignPointingErrors.latitudeRad,
	    initStarsList = $('#initStarsList')[0],
		xform,
		starsIx,
		getAltaz = function (xform, position) {
			copyPosition(position, xform.position);
			xform.position.SidT = 0;
			xform.getAltaz();
			copyPosition(xform.position, position);
		};

	// initStarsData holds pairings of init stars (index star 1, index star 2, and separation)
	// stars is the array of potential initialization stars
	// initStars holds the two Positions used for altaz initialization
	MLB.Altaz2StarAlignPointingErrors.selectedInitStarsData = initStarsList.selectedIndex;
	starsIx = initStarsData[MLB.Altaz2StarAlignPointingErrors.selectedInitStarsData][0];
	initStars[0].RA = stars[starsIx][1] * uom.degToRad;
	initStars[0].Dec = stars[starsIx][2] * uom.degToRad;

	starsIx = initStarsData[MLB.Altaz2StarAlignPointingErrors.selectedInitStarsData][1];
	initStars[1].RA = stars[starsIx][1] * uom.degToRad;
	initStars[1].Dec = stars[starsIx][2] * uom.degToRad;

	// set altaz for the two initStars
	xform = new XForm(convertStyle, latitudeRad);
	xform.presetAltaz();
	getAltaz(xform, initStars[0]);
	getAltaz(xform, initStars[1]);
};

MLB.Altaz2StarAlignPointingErrors.plot = function () {
	var point = MLB.sharedLib.point,
		initErrorsPlot = MLB.calcLib.initErrorsPlot,
		canvasBorder = MLB.Altaz2StarAlignPointingErrors.canvasBorder,
		canvasSize = MLB.Altaz2StarAlignPointingErrors.canvasSize,
		plotEngine = MLB.Altaz2StarAlignPointingErrors.plotEngine,
		latitudeRad = MLB.Altaz2StarAlignPointingErrors.latitudeRad,
	    initStars = MLB.Altaz2StarAlignPointingErrors.initStars,
		updateInitStarsFromInitStarsList = MLB.Altaz2StarAlignPointingErrors.updateInitStarsFromInitStarsList,
		numberTrials = $('#numberTrials')[0].value,
		maxInitErrorDeg = $('#maxInitErrorDeg')[0].value,
		maxPointErrorDeg = $('#maxPointErrorDeg')[0].value,
		z1Deg = $('#z1Deg')[0].value,
		z2Deg = $('#z2Deg')[0].value,
		// randomized init errors center on midpoint of maxInitErrorDeg, so minimum pointing error in two dimensions is init error / 2 * 1.4
		minPointingErrorDeg = maxInitErrorDeg * 0.7,
		// positions aimed at in the sky are angularly separated by this number of degrees
		spacingDeg = 2,
	    canvas,
	    context,
		center,
		drawingScale,
		plotData;

	canvas = $('#c1')[0];
	context = canvas.getContext('2d');
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	// eg, 90 degrees fits into half of the canvas' size
	drawingScale = (canvasSize - canvasBorder) / 2 / 90;
	center = point(canvas.width / 2, canvas.height / 2);

	updateInitStarsFromInitStarsList();

	// plot, using the positions' altaz for the starsData
	plotData = initErrorsPlot(latitudeRad, spacingDeg, numberTrials, maxInitErrorDeg, initStars[0], initStars[1], z1Deg, z2Deg);
	plotEngine(context, drawingScale, center, plotData, maxPointErrorDeg, minPointingErrorDeg, spacingDeg);
};

MLB.Altaz2StarAlignPointingErrors.stopInitializationLoop = function () {
	var numberTrials = $('#numberTrials')[0];

	if (MLB.Altaz2StarAlignPointingErrors.refreshIntervalId !== undefined) {
		clearInterval(MLB.Altaz2StarAlignPointingErrors.refreshIntervalId);
		MLB.Altaz2StarAlignPointingErrors.refreshIntervalId = undefined;
		numberTrials.value = MLB.Altaz2StarAlignPointingErrors.lastNumberTrials;
	}
};

MLB.Altaz2StarAlignPointingErrors.startInitializationLoop = function () {
	var plot = MLB.Altaz2StarAlignPointingErrors.plot,
	    numberTrials = $('#numberTrials')[0];

	MLB.Altaz2StarAlignPointingErrors.lastNumberTrials = numberTrials.value;
	numberTrials.value = '1';
	// in case already running, stop the loop
	MLB.Altaz2StarAlignPointingErrors.stopInitializationLoop();
	MLB.Altaz2StarAlignPointingErrors.refreshIntervalId = setInterval(function () {
		plot();
	}, 1000);
};

MLB.Altaz2StarAlignPointingErrors.load = function () {
	var stars = MLB.Altaz2StarAlignPointingErrors.stars,
	    initStarsData = MLB.Altaz2StarAlignPointingErrors.initStarsData,
	    initStarsDataLength = initStarsData.length,
	    plot = MLB.Altaz2StarAlignPointingErrors.plot,
		startInitializationLoop = MLB.Altaz2StarAlignPointingErrors.startInitializationLoop,
		stopInitializationLoop = MLB.Altaz2StarAlignPointingErrors.stopInitializationLoop,
	    btnPlot = $('#btnPlot')[0],
	    btnStartLoop = $('#btnStartLoop')[0],
	    btnStopLoop = $('#btnStopLoop')[0],
		initStarsList = $('#initStarsList')[0],
		ix,
		starIx1,
		starIx2,
		starName1,
		starName2,
		option;

	btnPlot.onclick = function () {
		plot();
	};
	btnStartLoop.onclick = function () {
		startInitializationLoop();
	};
	btnStopLoop.onclick = function () {
		stopInitializationLoop();
	};

	// create drop down list of init stars pairings at runtime
	for (ix = 0; ix < initStarsDataLength; ix++) {
		option = document.createElement("option");
		// initStarsData column 1 and column 2 contain indexes into the stars array; the stars array holds the names and equat coords
		starIx1 = initStarsData[ix][0];
		starIx2 = initStarsData[ix][1];
		starName1 = stars[starIx1][0];
		starName2 = stars[starIx2][0];
		option.text = starName1 + ' - ' + starName2 + ' (separation ' + initStarsData[ix][2] + ' degrees)';
		initStarsList.add(option);
	}

	plot();
};

$(window).ready(function () {
	MLB.Altaz2StarAlignPointingErrors.load();
});

// end of file