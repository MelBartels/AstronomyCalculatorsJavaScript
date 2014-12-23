// copyright Mel Bartels, 2011-2014

'use strict';

MLB.foldedNewtonian = [];

MLB.foldedNewtonian.plot = function () {
	var canvas,
	    context,
		mirrorDia,
		focalRatio,
		diagSize,
		focalPlaneToTertiaryDistance,
		model,
		scalingFactor,
		cg,
		opticalStyle,
		diagStyle,
		elbowStyle,
		precision,
		mainAxisLength,
		diagPt,
		mirrorPt,
		rightAngleDiagToFocLength,
		rightAngleFocPt,
		mirrorRadian,
		scaledRadiusCurvature,
		scaledSagitta,
		scaledMirrorRadius,
		upperMirrorPt,
		lowerMirrorPt,
		elbowEndPt,
		focalPlanePt,
		diagAngleRad,
		halfDiagLen,
		xDelta,
		yDelta,
		diagUpperLeftPt,
		diagLowerRightPt,
		eyepieceMirrorString,
		dimension,
		height,
		textBorder,
		y,
		dimensionLeftPt,
		dimensionRightPt,
		diagonalToMirrorString,
		diagonalString,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		uom = MLB.sharedLib.uom,
		getFoldedNewtonianScalingFactor = MLB.calcLib.getFoldedNewtonianScalingFactor,
		calcSagitta = MLB.calcLib.calcSagitta,
		calcFoldedNewtonian = MLB.calcLib.calcFoldedNewtonian;

	canvas = $('#foldedNewtCanvas')[0];
	context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);

	mirrorDia = +$('input[name=mirrorDia]').val();
	focalRatio = +$('input[name=focalRatio]').val();
	diagSize = +$('input[name=diagSize]').val();
	focalPlaneToTertiaryDistance = +$('input[name=focalPlaneToTertiaryDistance]').val();

	model = calcFoldedNewtonian(mirrorDia, focalRatio, diagSize, focalPlaneToTertiaryDistance);
	scalingFactor = getFoldedNewtonianScalingFactor(canvas.width, canvas.height, focalRatio, diagSize, focalPlaneToTertiaryDistance, model.diagToMirrorDistance);

	if (model.diagTooSmall) {
		context.fillText('The diagonal is too small. Please try again.', 10, 10);
		return;
	}
	if (model.diagTooLarge) {
		context.fillText('The diagonal is too large. Please try again.', 10, 10);
		return;
	}
	if (scalingFactor === undefined || scalingFactor === 0) {
		context.fillText('Oops. Scaling factor is ' + scalingFactor, 10, 10);
		return;
	}

	cg = point(canvas.width / 2, canvas.height / 2);
	opticalStyle = 'red';
	diagStyle = 'blue';
	elbowStyle = 'green';
	precision = 2;

	// draw diag to primary axis
	mainAxisLength = scalingFactor * model.diagToMirrorDistance;
	diagPt = point(cg.x - mainAxisLength / 2, cg.y);
	mirrorPt = point(cg.x + mainAxisLength / 2, cg.y);
	drawLine(context, opticalStyle, 2, diagPt, mirrorPt);

	// draw right angle diag to focal plane
	rightAngleDiagToFocLength = scalingFactor * diagSize * focalRatio;
	rightAngleFocPt = point(diagPt.x, cg.y - rightAngleDiagToFocLength);
	drawLine(context, opticalStyle, 2, diagPt, rightAngleFocPt);

	// draw primary mirror
	// circumference = 2 * PI * RoC;RoC = MD * FR * 2; circumference = 2 * PI * Radian
	// circumference = 2 * PI * MD * FR * 2; Radian = MD * FR * 2; MD = Radian / (FR * 2); MD / Radian = 1 / (FR * 2)
	mirrorRadian = 1 / (2 * focalRatio);
	scaledRadiusCurvature = scalingFactor * mirrorDia * focalRatio * 2;

	context.beginPath();
	context.arc(mirrorPt.x - scaledRadiusCurvature, mirrorPt.y, scaledRadiusCurvature, uom.oneRev - mirrorRadian / 2, mirrorRadian / 2, false);
	context.strokeStyle = diagStyle;
	context.stroke();

	// for testing purposes, draw line between mirror top and bottom
	scaledSagitta = scalingFactor * calcSagitta(mirrorDia, focalRatio);
	scaledMirrorRadius = scalingFactor * mirrorDia / 2;
	upperMirrorPt = point(mirrorPt.x - scaledSagitta, mirrorPt.y - scaledMirrorRadius);
	lowerMirrorPt = point(mirrorPt.x - scaledSagitta, mirrorPt.y + scaledMirrorRadius);
	/*
	context.beginPath();
	context.moveTo(upperMirrorPt.x, upperMirrorPt.y);
	drawLine(context, opticalStyle, 2, upperMirrorPt, lowerMirrorPt);
	context.stroke();
	*/

	// draw elbow bend: position of elbow end is at eyepiece to primary mirror distance, at projection of mirror edge (mirror radius distance)
	elbowEndPt = point(mirrorPt.x - scalingFactor * model.eyepieceToMirrorDistance, mirrorPt.y - scalingFactor * mirrorDia / 2);
	drawLine(context, elbowStyle, 2, diagPt, elbowEndPt);

	// draw tertiary path
	focalPlanePt = point(elbowEndPt.x, elbowEndPt.y - scalingFactor * focalPlaneToTertiaryDistance);
	drawLine(context, elbowStyle, 2, elbowEndPt, focalPlanePt);

	// draw diagonal
	diagAngleRad = model.elbowAngleDeg / 2 * uom.degToRad;
	halfDiagLen = scalingFactor * diagSize / 2;
	xDelta = Math.sin(diagAngleRad) * halfDiagLen;
	yDelta = Math.cos(diagAngleRad) * halfDiagLen;
	diagUpperLeftPt = point(diagPt.x - xDelta, diagPt.y - yDelta);
	diagLowerRightPt = point(diagPt.x + xDelta, diagPt.y + yDelta);
	drawLine(context, diagStyle, 2, diagUpperLeftPt, diagLowerRightPt);

	// draw eyepiece to mirror dimension line
	dimension = Math.round(model.eyepieceToMirrorDistance);
	height = 10;
	textBorder = 2;
	y = 4 * height;
	dimensionLeftPt = point(elbowEndPt.x, y);
	dimensionRightPt = point(mirrorPt.x, y);
	drawLine(context, elbowStyle, 1, dimensionLeftPt, dimensionRightPt);
	drawLine(context, elbowStyle, 1, point(dimensionLeftPt.x, dimensionLeftPt.y - height / 2), point(dimensionLeftPt.x, dimensionLeftPt.y + height / 2));
	drawLine(context, elbowStyle, 1, point(dimensionRightPt.x, dimensionRightPt.y - height / 2), point(dimensionRightPt.x, dimensionRightPt.y + height / 2));
	// write dimension
	context.font = '10pt arial';
	context.fillStyle = elbowStyle;
	eyepieceMirrorString = 'eyepiece to mirror distance = ' + roundToDecimal(model.eyepieceToMirrorDistance, precision);
	context.fillText(eyepieceMirrorString, dimensionLeftPt.x + textBorder, y - textBorder);

	// draw diagonal to mirror dimension line
	dimension = Math.round(model.diagToMirrorDistance);
	y -= 2 * height;
	dimensionLeftPt = point(diagPt.x, y);
	dimensionRightPt = point(mirrorPt.x, y);
	drawLine(context, opticalStyle, 1, dimensionLeftPt, dimensionRightPt);
	drawLine(context, opticalStyle, 1, point(dimensionLeftPt.x, dimensionLeftPt.y - height / 2), point(dimensionLeftPt.x, dimensionLeftPt.y + height / 2));
	drawLine(context, opticalStyle, 1, point(dimensionRightPt.x, dimensionRightPt.y - height / 2), point(dimensionRightPt.x, dimensionRightPt.y + height / 2));
	// write dimension
	context.font = '10pt arial';
	context.fillStyle = opticalStyle;
	diagonalToMirrorString = 'diagonal to mirror distance = ' + roundToDecimal(model.diagToMirrorDistance, precision);
	context.fillText(diagonalToMirrorString, dimensionLeftPt.x + textBorder, y - textBorder);

	// write diagonal dimensions
	context.fillStyle = diagStyle;
	diagonalString = 'diagonal: '
		+ roundToDecimal(diagSize + 0.05, precision)
		+ 'x'
		+ roundToDecimal(model.diagMajorAxisSize, precision)
		+ ' at angle of '
		// diagonal angle is half that of the elbow optical angle
		+ roundToDecimal(model.elbowAngleDeg / 2, precision)
		+ ' deg';
	context.fillText(diagonalString, diagLowerRightPt.x + textBorder, diagLowerRightPt.y + height);

	$('td[id=dimensions]').html(eyepieceMirrorString + '<br>' + diagonalToMirrorString + '<br>' + diagonalString);
};

$(window).ready(function () {
	var btnPlot = $('input[id=btnPlot]'),
		plot = MLB.foldedNewtonian.plot;

	// event hookups/subscribes
	btnPlot.click(function () {
		plot();
	});

	plot();
});

// end of file