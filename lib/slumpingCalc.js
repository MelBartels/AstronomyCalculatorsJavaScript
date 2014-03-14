// copyright Mel Bartels, 2012-2014

'use strict';

MLB.slumpingCalc = {};

MLB.slumpingCalc.plot = function () {
	var border,
	    cg,
		slumpedStyle,
		straightStyle,
		precision,
		digits,
		curveSpacing,
		dimSpacing,
		markLength,
		canvas,
		context,
		mirrorDia,
		focalRatio,
		scalingFactor,
		mirrorLeftPt,
		mirrorRightPt,
		mirrorRadian,
		scaledRadiusCurvature,
		straightDimLeftPt,
		straightDimRightPt,
		mirrorSlumpingParms,
		effectiveAperture,
		sphericalSagitta,
		edgeAngleDeg,
		xSlump,
		ySlump,
		slumpDimLeftPt,
		slumpDimRightPt,
		slumpingParmsString,
		mirrorDiaString,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		uom = MLB.sharedLib.uom,
		calcSagittaSpherical = MLB.calcLib.calcSagittaSpherical,
		calcMirrorSlumpingParms = MLB.calcLib.calcMirrorSlumpingParms;

	border = 20;
	slumpedStyle = "red";
	straightStyle = "blue";
	precision = 0.01;
	digits = 2;
	curveSpacing = 2;
	dimSpacing = 20;
	markLength = 5;

	canvas = document.getElementById('plot');
	context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);

	mirrorDia = +$('input[name=mirrorDia]').val();
	focalRatio = +$('input[name=focalRatio]').val();

	scalingFactor = (canvas.width - border) / mirrorDia;
	if (scalingFactor === undefined || scalingFactor === 0) {
		context.fillText("Oops. Scaling factor is " + scalingFactor, 10, 10);
		return;
	}

	cg = point(canvas.width * 0.5, canvas.height * 0.75);

	// draw mirrorDia as horizontal line
	mirrorLeftPt = point(cg.x - mirrorDia / 2 * scalingFactor, cg.y);
	mirrorRightPt = point(cg.x + mirrorDia / 2 * scalingFactor, cg.y);
	drawLine(context, straightStyle, 2, mirrorLeftPt, mirrorRightPt);

	// circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
	// circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
	mirrorRadian = 1 / (2 * focalRatio);
	scaledRadiusCurvature = scalingFactor * mirrorDia * focalRatio * 2;
	context.beginPath();
	context.arc(cg.x, cg.y - scaledRadiusCurvature - curveSpacing, scaledRadiusCurvature, uom.qtrRev - mirrorRadian / 2, uom.qtrRev + mirrorRadian / 2, false);
	context.strokeStyle = slumpedStyle;
	context.stroke();

	// draw dimension line for line
	straightDimLeftPt = point(mirrorLeftPt.x, mirrorLeftPt.y + dimSpacing);
	straightDimRightPt = point(mirrorRightPt.x, mirrorRightPt.y + dimSpacing);
	drawLine(context, straightStyle, 1, point(straightDimLeftPt.x, straightDimLeftPt.y - markLength), point(straightDimLeftPt.x, straightDimLeftPt.y + markLength));
	drawLine(context, straightStyle, 1, point(straightDimRightPt.x, straightDimRightPt.y - markLength), point(straightDimRightPt.x, straightDimRightPt.y + markLength));
	drawLine(context, straightStyle, 1, straightDimLeftPt, straightDimRightPt);

	// draw dimension line for slump
	mirrorSlumpingParms = calcMirrorSlumpingParms(mirrorDia, focalRatio);
	effectiveAperture = mirrorSlumpingParms.effectiveDia;
	sphericalSagitta = mirrorSlumpingParms.sphericalSagitta;
	edgeAngleDeg = mirrorSlumpingParms.edgeAngleDeg;
	xSlump = (mirrorDia - effectiveAperture) * scalingFactor / 2;
	ySlump = calcSagittaSpherical(mirrorDia, focalRatio) * scalingFactor;
	slumpDimLeftPt = point(mirrorLeftPt.x + xSlump, mirrorLeftPt.y - curveSpacing - ySlump - dimSpacing);
	slumpDimRightPt = point(mirrorRightPt.x - xSlump, mirrorRightPt.y - curveSpacing - ySlump - dimSpacing);
	drawLine(context, slumpedStyle, 1, point(slumpDimLeftPt.x, slumpDimLeftPt.y - markLength), point(slumpDimLeftPt.x, slumpDimLeftPt.y + markLength));
	drawLine(context, slumpedStyle, 1, point(slumpDimRightPt.x, slumpDimRightPt.y - markLength), point(slumpDimRightPt.x, slumpDimRightPt.y + markLength));
	drawLine(context, slumpedStyle, 1, slumpDimLeftPt, slumpDimRightPt);

	// write dimension texts
	slumpingParmsString = 'effective aperture = ' + roundToDecimal(effectiveAperture, digits)  + ', sagitta = ' + roundToDecimal(sphericalSagitta, digits) + ', edge angle = ' + roundToDecimal(edgeAngleDeg, digits) + '°';
	mirrorDiaString = roundToDecimal(mirrorDia, digits);
	context.fillStyle = slumpedStyle;
	context.fillText(slumpingParmsString, straightDimLeftPt.x + markLength, slumpDimLeftPt.y - markLength * 2);
	context.fillStyle = straightStyle;
	context.fillText('diameter before slumping = ' + mirrorDiaString, straightDimLeftPt.x + markLength, straightDimLeftPt.y + markLength * 4);
	$('td[id=effectiveAperture]').html(slumpingParmsString);
};

MLB.slumpingCalc.load = function () {
	var btnPlot = $('input[id=btnPlot]'),
		plot = MLB.slumpingCalc.plot;

	// event hookups/subscribes
	btnPlot.click(function () {
		plot();
	});

	plot();
};

// end of file