// copyright Mel Bartels, 2011-2014

'use strict';

MLB.baffle = {};

MLB.baffle.plot = function () {
	var canvas,
	    context,
		focalPlaneDia,
		focuserBarrelBottomToFocalPlaneDistance,
		focuserBarrelID,
		diagSizeMinorAxis,
		diagToFocalPlaneDistance,
		diagtoFocuserBaffleDistance,
		diagToOppositeSideBaffleDistance,
		primaryMirrorDia,
		primaryMirrorFocalLength,
		primaryToBaffleDistance,
		tubeID,
		oppositeBaffleY,
		model,
		borderFactor,
		border,
		totalHeight,
		scalingFactorY,
		scalingFactorX,
		scalingFactor,
		cg,
		baffleStyle,
		opticsStyle,
		focuserStyle,
		lineOfSightStyle,
		focalPlaneLength,
		focalPlaneY,
		focalPlaneLeftPt,
		focalPlaneRightPt,
		oppositeBaffleLength,
		oppositeBaffleLeftPt,
		oppositeBaffleRightPt,
		diagDelta,
		diagY,
		diagUpperLeftPt,
		diagLowerRightPt,
		focuserBaffleY,
		focuserBaffleODLeftPt,
		focuserBaffleIDRightPt,
		focuserBaffleIDLeftPt,
		focuserBaffleODRightPt,
		focuserBarrelBottomY,
		focuserBarrelHalfWidth,
		focuserBarrelBottomLeftPt,
		focuserBarrelBottomRightPt,
		focuserBarrelTopLeftPt,
		focuserBarrelTopRightPt,
		decimals,
		textBorder,
		focuserBaffleString,
		diagonalBaffleString,
		primaryBaffleString,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		calcNewtBaffle = MLB.calcLib.calcNewtBaffle;

	canvas = $('#diagBaffleCanvas')[0];
	context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);

	focalPlaneDia = +$('input[name=focalPlaneDia]').val();
	focuserBarrelBottomToFocalPlaneDistance = +$('input[name=focuserBarrelBottomToFocalPlaneDistance]').val();
	focuserBarrelID = +$('input[name=focuserBarrelID]').val();
	diagSizeMinorAxis = +$('input[name=diagSizeMinorAxis]').val();
	diagToFocalPlaneDistance = +$('input[name=diagToFocalPlaneDistance]').val();
	diagtoFocuserBaffleDistance = +$('input[name=diagtoFocuserBaffleDistance]').val();
	diagToOppositeSideBaffleDistance = +$('input[name=diagToOppositeSideBaffleDistance]').val();
	primaryMirrorDia = +$('input[name=primaryMirrorDia]').val();
	primaryMirrorFocalLength = +$('input[name=primaryMirrorFocalLength]').val();
	primaryToBaffleDistance = +$('input[name=primaryToBaffleDistance]').val();
	tubeID = +$('input[name=tubeID]').val();

	model = calcNewtBaffle(focalPlaneDia, focuserBarrelBottomToFocalPlaneDistance, focuserBarrelID, diagSizeMinorAxis, diagToFocalPlaneDistance, diagtoFocuserBaffleDistance, diagToOppositeSideBaffleDistance, primaryMirrorDia, primaryMirrorFocalLength, primaryToBaffleDistance, tubeID);

	borderFactor = 0.1;
	border = canvas.height * borderFactor;
	totalHeight = diagToFocalPlaneDistance + diagToOppositeSideBaffleDistance;
	scalingFactorY = canvas.height / totalHeight * (1 - 2 * borderFactor);
	scalingFactorX = canvas.width / model.diagonalBaffleOD *  (1 - 2 * borderFactor);
	scalingFactor = scalingFactorY < scalingFactorX ? scalingFactorY : scalingFactorX;

	if (scalingFactor === undefined || scalingFactor === 0) {
		context.fillText('Oops. Scaling factor is ' + scalingFactor, 10, 10);
		return;
	}

	cg = point(canvas.width / 2, canvas.height / 2);
	baffleStyle = 'red';
	opticsStyle = 'blue';
	focuserStyle = 'green';
	lineOfSightStyle = 'gray';

	// draw focal plane
	focalPlaneLength = scalingFactor * focalPlaneDia;
	focalPlaneY = cg.y - (totalHeight * scalingFactor) / 2;
	focalPlaneLeftPt = point(cg.x - focalPlaneLength / 2, focalPlaneY);
	focalPlaneRightPt = point(cg.x + focalPlaneLength / 2, focalPlaneY);
	drawLine(context, opticsStyle, 2, focalPlaneLeftPt, focalPlaneRightPt);

	// draw baffle opposite diagonal
	oppositeBaffleLength = scalingFactor * model.diagonalBaffleOD;
	oppositeBaffleY = focalPlaneY + totalHeight * scalingFactor;
	oppositeBaffleLeftPt = point(cg.x - oppositeBaffleLength / 2, oppositeBaffleY);
	oppositeBaffleRightPt = point(cg.x + oppositeBaffleLength / 2, oppositeBaffleY);
	drawLine(context, baffleStyle, 2, oppositeBaffleLeftPt, oppositeBaffleRightPt);

	// draw diagonal
	diagDelta = diagSizeMinorAxis * scalingFactor / 2;
	diagY = focalPlaneY + diagToFocalPlaneDistance * scalingFactor;
	diagUpperLeftPt = point(cg.x - diagDelta, diagY - diagDelta);
	diagLowerRightPt = point(cg.x + diagDelta, diagY + diagDelta);
	drawLine(context, opticsStyle, 2, diagUpperLeftPt, diagLowerRightPt);

	// draw focuser baffle OD
	focuserBaffleY = diagY - diagtoFocuserBaffleDistance * scalingFactor;
	focuserBaffleODLeftPt = point(cg.x - model.focuserBaffleOD * scalingFactor / 2, focuserBaffleY);
	focuserBaffleODRightPt = point(cg.x + model.focuserBaffleOD * scalingFactor / 2, focuserBaffleY);
	drawLine(context, baffleStyle, 2, focuserBaffleODLeftPt, focuserBaffleODRightPt);

	// draw focuser baffle ID
	focuserBaffleIDLeftPt = point(cg.x - model.focuserBaffleID * scalingFactor / 2, focuserBaffleY);
	focuserBaffleIDRightPt = point(cg.x + model.focuserBaffleID * scalingFactor / 2, focuserBaffleY);
	drawLine(context, 'white', 2, focuserBaffleIDLeftPt, focuserBaffleIDRightPt);

	// draw focuser barrel bottom
	focuserBarrelBottomY = focalPlaneY + focuserBarrelBottomToFocalPlaneDistance * scalingFactor;
	focuserBarrelHalfWidth = focuserBarrelID * scalingFactor / 2;
	focuserBarrelBottomLeftPt = point(cg.x - focuserBarrelHalfWidth, focuserBarrelBottomY);
	focuserBarrelBottomRightPt = point(cg.x + focuserBarrelHalfWidth, focuserBarrelBottomY);
	drawLine(context, focuserStyle, 2, focuserBarrelBottomLeftPt, focuserBarrelBottomRightPt);

	// draw focuser barrel sides
	focuserBarrelTopLeftPt = point(cg.x - focuserBarrelHalfWidth, focalPlaneY);
	focuserBarrelTopRightPt = point(cg.x + focuserBarrelHalfWidth, focalPlaneY);
	drawLine(context, focuserStyle, 2, focuserBarrelBottomLeftPt, focuserBarrelTopLeftPt);
	drawLine(context, focuserStyle, 2, focuserBarrelBottomRightPt, focuserBarrelTopRightPt);

	// draw lines of sight:
	// crisscrossing lines between focal plane and opposite baffle
	drawLine(context, lineOfSightStyle, 1, focalPlaneLeftPt, oppositeBaffleRightPt);
	drawLine(context, lineOfSightStyle, 1, focalPlaneRightPt, oppositeBaffleLeftPt);
	// crisscrossing lines between focal plane and focuser baffle
	drawLine(context, lineOfSightStyle, 1, focalPlaneLeftPt, focuserBaffleODRightPt);
	drawLine(context, lineOfSightStyle, 1, focalPlaneRightPt, focuserBaffleODLeftPt);
	// lines between focal plane and diagonal
	drawLine(context, lineOfSightStyle, 1, focalPlaneLeftPt, diagUpperLeftPt);
	drawLine(context, lineOfSightStyle, 1, focalPlaneRightPt, diagLowerRightPt);

	// write components and dimensions
	decimals = 2;
	textBorder = border / 2;
	context.font = '10pt arial';
	context.fillStyle = opticsStyle;
	context.fillText('focal plane', focalPlaneRightPt.x + textBorder, focalPlaneRightPt.y);
	context.fillStyle = focuserStyle;
	context.fillText('focuser barrel', focuserBarrelBottomRightPt.x + textBorder, focuserBarrelBottomRightPt.y);
	context.fillStyle = opticsStyle;
	context.fillText('diagonal', diagLowerRightPt.x + textBorder, diagLowerRightPt.y);
	context.fillStyle = baffleStyle;
	diagonalBaffleString = 'diagonal baffle = ' + roundToDecimal(model.diagonalBaffleOD, decimals) + ' OD';
	primaryBaffleString = 'primary baffle = ' + roundToDecimal(model.primaryBaffleOD, decimals) + ' OD or telescope tube extension = ' + roundToDecimal(model.tubeExtension, decimals);
	context.fillText(diagonalBaffleString, cg.x, oppositeBaffleRightPt.y - border / decimals);
	focuserBaffleString = 'focuser baffle = ' + roundToDecimal(model.focuserBaffleID, decimals) + ' ID x ' + roundToDecimal(model.focuserBaffleOD, decimals) + ' OD';
	context.fillText(focuserBaffleString, cg.x, focuserBaffleIDRightPt.y + border / decimals);

	$('td[id=dimensions]').html(focuserBaffleString + '<br>' + diagonalBaffleString + '<br>' + primaryBaffleString);
};

$(document).ready(function () {
	var btnPlot = $('input[id=btnPlot]'),
		plot = MLB.baffle.plot;

	// event hookups/subscribes
	btnPlot.click(function () {
		plot();
	});

	plot();
});

// end of file