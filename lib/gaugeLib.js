// copyright Mel Bartels, 2012-2014

'use strict';

MLB.gaugeLib = {};

MLB.gaugeLib.GaugeState = function () {
	this.canvas = 'undefined';
	this.canvasID = undefined;
	this.context = undefined;
	this.inputID = undefined;
	this.scale = undefined;
	this.cg = undefined;
	this.gaugeType = undefined;
	this.gaugeStyle = undefined;
	this.convertRadiansToStringFunction = undefined;
	this.validRadiansFunction = undefined;
	this.parseCoordinateUseHours = undefined;
	this.angleRadians = undefined;
	this.displayValue = undefined;
	this.pointerAngleSensitivity = undefined;
	this.majorTicksCount = undefined;
	this.minorTicksSubdivisionsPerMajorTick = undefined;
	this.tickLabels = undefined;
	this.title = undefined;
	this.uom = undefined;
	this.font = undefined;
	this.fontSize = undefined;
	this.tickStyle = undefined;
	this.labelStyle = undefined;
	this.titleFillStyle = undefined;
	this.pointerStyle = undefined;
	this.hubFillStyle = undefined;
	this.dynamicFillStyle = undefined;
	this.radiusScale = undefined;
	this.tickLengthScale = undefined;
	this.majorTickWidth = undefined;
	this.minorTickWidth = undefined;
	this.labelScaleOffset = undefined;
	this.labelYOffset = undefined;
	this.noseLengthScale = undefined;
	this.wingTipLengthScale = undefined;
	this.wingTipAngleRadians = undefined;
	this.hubRadiusScale = undefined;
	this.titleYOffsetScale = undefined;
	this.repaintCenterScale = undefined;
};

MLB.gaugeLib.stateInstances = {
	states: []
};

/* states array consists of states;
   each state in turn consists of a two part array: canvasID and gaugeState;
   gaugeStates are created in createGaugeState();
   each gauge gets its own canvas */
MLB.gaugeLib.getState = function (canvasID) {
	var keyIx = 0,
	    valueIx = 1,
		stateInstances = MLB.gaugeLib.stateInstances,
		states = stateInstances.states,
	    statesLength = states.length,
	    ix;

	for (ix = 0; ix < statesLength; ix++) {
		if (states[ix][keyIx] === canvasID) {
			return states[ix][valueIx];
		}
	}
};

MLB.gaugeLib.drawTick = function (state, tickWidth, angle, tickLength) {
	var cg = state.cg,
		scale = state.scale,
		context = state.context,
		tickStyle = state.tickStyle,
	    point = MLB.sharedLib.point,
		drawLine = MLB.sharedLib.drawLine,
		outerPt = point(cg.x + Math.sin(angle) * scale, cg.y - Math.cos(angle) * scale),
	    innerPt = point(cg.x + Math.sin(angle) * scale * (1 - tickLength), cg.y - Math.cos(angle) * scale * (1 - tickLength));

	drawLine(context, tickStyle, tickWidth, innerPt, outerPt);
};

MLB.gaugeLib.drawTicks = function (state) {
	var majorTicksCount = state.majorTicksCount,
	    minorTicksSubdivisionsPerMajorTick = state.minorTicksSubdivisionsPerMajorTick,
	    tickLengthScale = state.tickLengthScale,
	    majorTickWidth = state.majorTickWidth,
		minorTickWidth = state.minorTickWidth,
	    tickCount = 0,
		totalTickCount = majorTicksCount * minorTicksSubdivisionsPerMajorTick,
		uom = MLB.sharedLib.uom,
	    tickStepAngleRadians = uom.oneRev / totalTickCount,
	    tickAngle,
		drawTick = MLB.gaugeLib.drawTick;

	while (tickCount < totalTickCount) {
		tickAngle = tickCount * tickStepAngleRadians;
		if (tickCount % minorTicksSubdivisionsPerMajorTick === 0) {
			drawTick(state, majorTickWidth, tickAngle, tickLengthScale);
		} else {
			drawTick(state, minorTickWidth, tickAngle, tickLengthScale);
		}
		tickCount++;
	}
};

MLB.gaugeLib.drawTickLabels = function (state) {
	var context = state.context,
	    cg = state.cg,
		scale = state.scale,
		labelStyle = state.labelStyle,
		tickLabels = state.tickLabels,
	    labelScaleOffset = state.labelScaleOffset,
	    labelYOffset = state.labelYOffset,
		font = state.font,
	    labelCount = 0,
	    labelLength = tickLabels.length,
		uom = MLB.sharedLib.uom,
	    labelStepAngleRadians = uom.oneRev / labelLength,
		labelAngle;

	while (labelCount < labelLength) {
		labelAngle = labelCount * labelStepAngleRadians;
		context.font = font;
		context.fillStyle = labelStyle;
		context.textAlign = 'center';
		// x,y is bottom left of string
		context.fillText(tickLabels[labelCount], cg.x + Math.sin(labelAngle) * scale * labelScaleOffset, cg.y - Math.cos(labelAngle) * scale * labelScaleOffset + labelYOffset);
		labelCount++;
	}
};

MLB.gaugeLib.drawPointer = function (state) {
	var context = state.context,
	    cg = state.cg,
		scale = state.scale,
		pointerStyle = state.pointerStyle,
	    noseLengthScale = state.noseLengthScale,
	    wingTipLengthScale = state.wingTipLengthScale,
	    wingTipAngleRadians = state.wingTipAngleRadians,
		// expand to full circle
		angleRadians = state.angleRadians * state.pointerAngleSensitivity,
		points = [],
		fillPolygon = MLB.sharedLib.fillPolygon,
		point = MLB.sharedLib.point;

	// nose
	points.push(point(cg.x + Math.sin(angleRadians) * scale * (1 - noseLengthScale), cg.y - Math.cos(angleRadians) * scale * (1 - noseLengthScale)));
	// left wing tip
	points.push(point(cg.x + Math.sin(angleRadians - wingTipAngleRadians) * scale * (1 - wingTipLengthScale), cg.y - Math.cos(angleRadians - wingTipAngleRadians) * scale * (1 - wingTipLengthScale)));
	// right wing tip
	points.push(point(cg.x + Math.sin(angleRadians + wingTipAngleRadians) * scale * (1 - wingTipLengthScale), cg.y - Math.cos(angleRadians + wingTipAngleRadians) * scale * (1 - wingTipLengthScale)));

	fillPolygon(context, points, pointerStyle);
};

MLB.gaugeLib.drawHub = function (state) {
	var context = state.context,
	    cg = state.cg,
		scale = state.scale,
		hubFillStyle = state.hubFillStyle,
	    hubRadiusScale = state.hubRadiusScale,
		hubRadius = hubRadiusScale * scale,
		fillCircle = MLB.sharedLib.fillCircle;

	fillCircle(context, cg, hubRadius, hubFillStyle);
};

MLB.gaugeLib.drawCenterText = function (context, cg, scale, text, yOffsetScale, font, fontSize, fillStyle) {
	var textWidthOffset = context.measureText(text).width / 2;

	context.font = font;
	context.fillStyle = fillStyle;
	context.textAlign = 'left';
	context.fillText(text, cg.x - textWidthOffset, cg.y + yOffsetScale * scale + fontSize / 2);
};

MLB.gaugeLib.drawTitle = function (state) {
	var drawCenterText = MLB.gaugeLib.drawCenterText;

	drawCenterText(state.context, state.cg, state.scale, state.title, -state.titleYOffsetScale, state.font, state.fontSize, state.titleFillStyle);
};

MLB.gaugeLib.drawValue = function (state) {
	var drawCenterText = MLB.gaugeLib.drawCenterText;

	drawCenterText(state.context, state.cg, state.scale, state.displayValue, 0, state.font, state.fontSize, state.titleFillStyle);
};

MLB.gaugeLib.drawUom = function (state) {
	var drawCenterText = MLB.gaugeLib.drawCenterText;

	drawCenterText(state.context, state.cg, state.scale, state.uom, state.titleYOffsetScale, state.font, state.fontSize, state.titleFillStyle);
};

MLB.gaugeLib.drawGaugeDynamicElements = function (state) {
	var fillCircle = MLB.sharedLib.fillCircle,
		drawPointer = MLB.gaugeLib.drawPointer,
		drawHub = MLB.gaugeLib.drawHub,
		drawTitle = MLB.gaugeLib.drawTitle,
		drawValue = MLB.gaugeLib.drawValue,
		drawUom = MLB.gaugeLib.drawUom;

	fillCircle(state.context, state.cg, state.scale * state.repaintCenterScale, state.dynamicFillStyle);
	drawPointer(state);
	drawHub(state);
	drawTitle(state);
	drawValue(state);
	drawUom(state);
};

MLB.gaugeLib.drawGaugeStaticElements = function (state) {
	var drawTicks = MLB.gaugeLib.drawTicks,
	    drawTickLabels = MLB.gaugeLib.drawTickLabels;

	drawTicks(state);
	drawTickLabels(state);
};

MLB.gaugeLib.getDisplayValue = function (state) {
	var validRadiansFunction = state.validRadiansFunction,
		angleRadians = state.angleRadians,
		pointerAngleSensitivity = state.pointerAngleSensitivity,
		// multiply by sensitivity to validate full circle radian, then devide by sensitivity to return to original value
		validAngleRadians = validRadiansFunction(angleRadians * pointerAngleSensitivity) / pointerAngleSensitivity;

	state.displayValue = state.convertRadiansToStringFunction(validAngleRadians);
};

MLB.gaugeLib.displayInputValue = function (state) {
	var inputID = state.inputID;

	$('input[name=' + inputID + ']').val(state.displayValue);
};

MLB.gaugeLib.plot = function (canvasID) {
	var getState = MLB.gaugeLib.getState,
	    drawGaugeDynamicElements = MLB.gaugeLib.drawGaugeDynamicElements,
		getDisplayValue = MLB.gaugeLib.getDisplayValue,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians,
	    state = getState(canvasID),
	    inputID = state.inputID,
		parseCoordinateUseHours = state.parseCoordinateUseHours,
	    val = $('input[name=' + inputID + ']').val();

	state.angleRadians = parseCoordinateGetValueInRadians(val, parseCoordinateUseHours).radians;
	getDisplayValue(state);
	drawGaugeDynamicElements(state);
};

MLB.gaugeLib.drawGaugeFirstTime = function (state) {
	var context = state.context,
	    canvas = state.canvas,
		canvasID = state.canvasID,
		cg = state.cg,
		dynamicFillStyle = state.dynamicFillStyle,
		scale = state.scale,
		radiusScale = state.radiusScale,
		fillCircle = MLB.sharedLib.fillCircle,
		drawGaugeStaticElements = MLB.gaugeLib.drawGaugeStaticElements,
		plot = MLB.gaugeLib.plot;

	context.clearRect(0, 0, canvas.width, canvas.height);
	fillCircle(context, cg, radiusScale * scale, dynamicFillStyle);
	drawGaugeStaticElements(state);
	plot(canvasID);
};

MLB.gaugeLib.setGaugeStateConstantsForHoursGauge = function (state) {
	state.majorTicksCount = 12;
	state.minorTicksSubdivisionsPerMajorTick = 2;
	state.tickLabels = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'];
	state.uom = 'hr';
};

MLB.gaugeLib.setGaugeStateConstantsForNegHoursGauge = function (state) {
	state.majorTicksCount = 12;
	state.minorTicksSubdivisionsPerMajorTick = 2;
	state.tickLabels = ['0', '2', '4', '6', '8', '10', '±12', '-10', '-8', '-6', '-4', '-2'];
	state.uom = 'hr';
};

MLB.gaugeLib.setGaugeStateConstantsForDegreesGauge = function (state) {
	state.majorTicksCount = 12;
	state.minorTicksSubdivisionsPerMajorTick = 3;
	state.tickLabels = ['0', '30', '60', '90', '120', '150', '180', '210', '240', '270', '300', '330'];
	state.uom = 'deg';
};

MLB.gaugeLib.setGaugeStateConstantsForNegDegreesGauge = function (state) {
	state.majorTicksCount = 12;
	state.minorTicksSubdivisionsPerMajorTick = 3;
	state.tickLabels = ['0', '30', '60', '90', '120', '150', '±180', '-150', '-120', '-90', '-60', '-30'];
	state.uom = 'deg';
};

MLB.gaugeLib.setGaugeStateConstantsForNeg10DegreesGauge = function (state) {
	state.majorTicksCount = 10;
	state.minorTicksSubdivisionsPerMajorTick = 2;
	state.tickLabels = ['0', '2', '4', '6', '8', '±10', '-8', '-6', '-4', '-2'];
	state.uom = 'deg';
};

// color names: http://www.w3schools.com/html/html_colornames.asp
// color wheel: http://www.allprofitallfree.com/color-wheel2.html

MLB.gaugeLib.grayOnWhiteGauge = function (state) {
	state.tickStyle = 'darkgray';
	state.labelStyle = 'black';
	state.titleFillStyle = 'black';
	state.pointerStyle = 'red';
	state.hubFillStyle = 'lightgray';
	state.dynamicFillStyle = 'white';
};

MLB.gaugeLib.redOnGrayGauge = function (state) {
	state.tickStyle = 'black';
	state.labelStyle = 'darkred';
	state.titleFillStyle = 'darkred';
	state.pointerStyle = 'red';
	state.hubFillStyle = 'lightgray';
	state.dynamicFillStyle = 'gray';
};

MLB.gaugeLib.cyanOnBlackGauge = function (state) {
	state.tickStyle = 'cyan';
	state.labelStyle = 'white';
	state.titleFillStyle = 'white';
	state.pointerStyle = 'red';
	state.hubFillStyle = '#242424';
	state.dynamicFillStyle = 'black';
};

MLB.gaugeLib.blueGauge = function (state) {
	state.tickStyle = 'lightblue';
	state.labelStyle = 'white';
	state.titleFillStyle = 'white';
	state.pointerStyle = 'red';
	state.hubFillStyle = 'blue';
	state.dynamicFillStyle = 'darkblue';
};

MLB.gaugeLib.buildGaugeStyle = function (state) {
	var gaugeStyle = state.gaugeStyle,
	    grayOnWhiteGauge = MLB.gaugeLib.grayOnWhiteGauge,
	    redOnGrayGauge = MLB.gaugeLib.redOnGrayGauge,
	    cyanOnBlackGauge = MLB.gaugeLib.cyanOnBlackGauge,
		blueGauge = MLB.gaugeLib.blueGauge;

	if (gaugeStyle === 'grayOnWhiteGauge') {
		grayOnWhiteGauge(state);
	} else if (gaugeStyle === 'redOnGrayGauge') {
		redOnGrayGauge(state);
	} else if (gaugeStyle === 'cyanOnBlackGauge') {
		cyanOnBlackGauge(state);
	} else if (gaugeStyle === 'blueGauge') {
		blueGauge(state);
	}
};

MLB.gaugeLib.setGaugeStateConstantsForAllGauges = function (state) {
	var int = MLB.sharedLib.int,
		uom = MLB.sharedLib.uom;

	state.fontSize = int(state.scale / 7);
	state.font = state.fontSize + 'pt arial';
	state.radiusScale = 1.3;
	state.tickLengthScale = 0.2;
	state.majorTickWidth = 3;
	state.minorTickWidth = 1;
	state.labelScaleOffset = 1.13;
	state.labelYOffset = 5;
	state.noseLengthScale = 0.2;
	state.wingTipLengthScale = 0.5;
	state.wingTipAngleRadians = 20 * uom.degToRad;
	state.hubRadiusScale = 0.5;
	state.titleYOffsetScale = 0.22;
	state.repaintCenterScale = 0.8;
};

MLB.gaugeLib.createGaugeState = function (canvasID, inputID, title, scale, gaugeType, gaugeStyle) {
	var point = MLB.sharedLib.point,
	    GaugeState = MLB.gaugeLib.GaugeState,
	    state = new GaugeState(),
		stateInstances = MLB.gaugeLib.stateInstances,
		setGaugeStateConstantsForHoursGauge = MLB.gaugeLib.setGaugeStateConstantsForHoursGauge,
		setGaugeStateConstantsForNegHoursGauge = MLB.gaugeLib.setGaugeStateConstantsForNegHoursGauge,
		setGaugeStateConstantsForDegreesGauge = MLB.gaugeLib.setGaugeStateConstantsForDegreesGauge,
		setGaugeStateConstantsForNegDegreesGauge = MLB.gaugeLib.setGaugeStateConstantsForNegDegreesGauge,
		setGaugeStateConstantsForNeg10DegreesGauge = MLB.gaugeLib.setGaugeStateConstantsForNeg10DegreesGauge,
		buildGaugeStyle = MLB.gaugeLib.buildGaugeStyle,
		setGaugeStateConstantsForAllGauges = MLB.gaugeLib.setGaugeStateConstantsForAllGauges,
		validRev = MLB.coordLib.validRev,
		validHalfRev = MLB.coordLib.validHalfRev,
		convertRadiansToHMSString = MLB.coordLib.convertRadiansToHMSString,
		convertRadiansToDMSString = MLB.coordLib.convertRadiansToDMSString;

	stateInstances.states.push([canvasID, state]);

	state.canvas = document.getElementById(canvasID);
	state.canvasID = canvasID;
	state.context = state.canvas.getContext("2d");
	state.cg = point(state.canvas.width / 2, state.canvas.height / 2);
	state.title = title;
	state.scale = scale;
	state.inputID = inputID;
	state.gaugeType = gaugeType;
	state.gaugeStyle = gaugeStyle;

	buildGaugeStyle(state);
	setGaugeStateConstantsForAllGauges(state);

	if (gaugeType === 'hoursGauge') {
		state.convertRadiansToStringFunction = convertRadiansToHMSString;
		state.validRadiansFunction = validRev;
		state.pointerAngleSensitivity = 1;
		state.parseCoordinateUseHours = true;
		setGaugeStateConstantsForHoursGauge(state);

	} else if (gaugeType === 'negHoursGauge') {
		state.convertRadiansToStringFunction = convertRadiansToHMSString;
		state.validRadiansFunction = validHalfRev;
		state.pointerAngleSensitivity = 1;
		state.parseCoordinateUseHours = true;
		setGaugeStateConstantsForNegHoursGauge(state);

	} else if (gaugeType === 'degreesGauge') {
		state.convertRadiansToStringFunction = convertRadiansToDMSString;
		state.validRadiansFunction = validRev;
		state.pointerAngleSensitivity = 1;
		setGaugeStateConstantsForDegreesGauge(state);

	} else if (gaugeType === 'negDegreesGauge') {
		state.convertRadiansToStringFunction = convertRadiansToDMSString;
		state.validRadiansFunction = validHalfRev;
		state.pointerAngleSensitivity = 1;
		setGaugeStateConstantsForNegDegreesGauge(state);

	} else if (gaugeType === 'neg10DegreesGauge') {
		state.convertRadiansToStringFunction = convertRadiansToDMSString;
		state.validRadiansFunction = validHalfRev;
		// +- 10 degrees for this gauge compared to +-180 deg for negDegreesGauge
		state.pointerAngleSensitivity = 18;
		setGaugeStateConstantsForNeg10DegreesGauge(state);
	}

	return state;
};

// 0 deg is directly upward, gauge advances clockwise; returns within 0-2*PI radians or 0-360 deg range 
MLB.gaugeLib.angleRadiansFromPoints = function (fromPoint, toPoint) {
	var xRange = Math.abs(toPoint.x - fromPoint.x),
	    yRange = Math.abs(toPoint.y - fromPoint.y),
		tangent = xRange / yRange,
		angleRad = Math.atan(tangent),
		uom = MLB.sharedLib.uom;

	if (toPoint.x >= fromPoint.x && toPoint.y <= fromPoint.y) {
		return angleRad;
	}
	if (toPoint.x >= fromPoint.x && toPoint.y >= fromPoint.y) {
		return uom.halfRev - angleRad;
	}
	if (toPoint.x <= fromPoint.x && toPoint.y >= fromPoint.y) {
		return uom.halfRev + angleRad;
	}
	if (toPoint.x <= fromPoint.x && toPoint.y <= fromPoint.y) {
		return uom.oneRev - angleRad;
	}
};

MLB.gaugeLib.getMousePos = function (canvas, evt) {
	var element = canvas,
		left = 0,
		top = 0,
		mouseX,
		mouseY;

	// get canvas position
	while (element.tagName !== 'BODY') {
		left += element.offsetLeft;
		top += element.offsetTop;
		element = element.offsetParent;
	}

	// return position within canvas
	mouseX = evt.clientX - left + window.pageXOffset;
	mouseY = evt.clientY - top + window.pageYOffset;
	return {
		x: mouseX,
		y: mouseY
	};
};

MLB.gaugeLib.addMouseEvents = function (state) {
	var mousePos,
	    mouseDown = false,
		canvas = state.canvas,
		cg = state.cg,
		validRadiansFunction = state.validRadiansFunction,
		pointerAngleSensitivity = state.pointerAngleSensitivity,
		canvasID = state.canvasID,
		getDisplayValue = MLB.gaugeLib.getDisplayValue,
		displayInputValue = MLB.gaugeLib.displayInputValue,
		plot = MLB.gaugeLib.plot,
		angleRadiansFromPoints = MLB.gaugeLib.angleRadiansFromPoints,
		getMousePos = MLB.gaugeLib.getMousePos;

	canvas.addEventListener("mousedown", function () {
		mouseDown = true;
	}, false);

	canvas.addEventListener("mouseup", function () {
		mouseDown = false;
	}, false);

	canvas.addEventListener("mousemove", function (evt) {
		mousePos = getMousePos(canvas, evt);
		if (mouseDown && mousePos !== null) {
			// take full circle mouse click position and scale down by sensitivity
			state.angleRadians = validRadiansFunction(angleRadiansFromPoints(cg, mousePos)) / pointerAngleSensitivity;
			getDisplayValue(state);
			displayInputValue(state);
			plot(canvasID);
		}
	}, false);
};

MLB.gaugeLib.init = function (canvasID, inputID, title, scale, gaugeType, gaugeStyle) {
	var createGaugeState = MLB.gaugeLib.createGaugeState,
	    state = createGaugeState(canvasID, inputID, title, scale, gaugeType, gaugeStyle),
	    drawGaugeFirstTime = MLB.gaugeLib.drawGaugeFirstTime,
		addMouseEvents = MLB.gaugeLib.addMouseEvents;

	drawGaugeFirstTime(state);
	addMouseEvents(state);
};

// end of file