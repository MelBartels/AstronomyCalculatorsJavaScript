// copyright Mel Bartels, 2011-2014

'use strict';

MLB.motorCalc = {};

MLB.motorCalc.drive = {
	drive: undefined
};

MLB.motorCalc.addAReduction = function (drive, reductionName, val) {
	var addReduction = MLB.motorLib.addReduction,
	    getReduction = MLB.motorLib.getReduction,
	    reduction = getReduction(val);

	if (reduction !== undefined) {
		addReduction(drive, reductionName, reduction);
	}
};

MLB.motorCalc.calcResultsUsingGearReductions = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    addAReduction = MLB.motorCalc.addAReduction,
	    driveBuilder = MLB.motorLib.driveBuilder,
	    calcMotorEncoderTicksPerArcsec = MLB.motorLib.calcMotorEncoderTicksPerArcsec,
	    calcRPMs = MLB.motorLib.calcRPMs,
	    calcTotalReductionUnitsPerSec = MLB.motorLib.calcTotalReductionUnitsPerSec,
	    calcMaxSlewSpeedDegSec = MLB.motorLib.calcMaxSlewSpeedDegSec,
	    motorMaxRPM = $('input[name=motorMaxRPM]').val(),
	    axisSpeedArcsecondsPerSec = $('input[name=axisSpeedArcsecondsPerSec]').val(),
	    totalTicksPerAxis = $('input[name=totalTicksPerAxis]'),
	    ticksPerArcsecond = $('td[id=ticksPerArcsecond]'),
	    motorMaxSpeed = $('td[id=motorMaxSpeed]'),
	    motorSpeed = $('td[id=motorSpeed]'),
	    ticksSecond = $('td[id=ticksSecond]'),
	    drive,
		reductionValue,
		ix;

	// begin again with a new 'drive'
	MLB.motorCalc.drive = driveBuilder('motorCalc');
	for (ix = 0; ix < 4; ix++) {
		reductionValue = $('input[name=reduction' + (ix + 1) + ']').val();
		addAReduction(MLB.motorCalc.drive, ix, reductionValue);
	}
	drive = MLB.motorCalc.drive;
	totalTicksPerAxis.val(drive.totalReduction);
	ticksPerArcsecond.html(roundToDecimal(calcMotorEncoderTicksPerArcsec(drive), 2));
	motorMaxSpeed.html(roundToDecimal(calcMaxSlewSpeedDegSec(drive, parseFloat(motorMaxRPM)), 3) + ' deg/sec');
	// calcRPMs() expects deg/sec
	motorSpeed.html(roundToDecimal(calcRPMs(drive, parseFloat(axisSpeedArcsecondsPerSec / 3600))[1], 2) + ' rpm');
	// calcTotalReductionUnitsPerSec() expects deg/sec
	ticksSecond.html(roundToDecimal(calcTotalReductionUnitsPerSec(drive, axisSpeedArcsecondsPerSec / 3600), 2));
};

MLB.motorCalc.calcResultsUsingTotalTicksPerAxis = function () {
	var uom = MLB.sharedLib.uom,
	    roundToDecimal = MLB.sharedLib.roundToDecimal,
	    motorMaxRPM = $('input[name=motorMaxRPM]').val(),
		reduction1 = $('input[name=reduction1]').val(),
	    totalTicksPerAxis = $('input[name=totalTicksPerAxis]').val(),
	    axisSpeedArcsecondsPerSec = $('input[name=axisSpeedArcsecondsPerSec]').val(),
		ticksPerArcsecond = $('td[id=ticksPerArcsecond]'),
	    motorMaxSpeed = $('td[id=motorMaxSpeed]'),
	    motorSpeed = $('td[id=motorSpeed]'),
	    ticksSecond = $('td[id=ticksSecond]'),
		maxSpeedDegSec,
		motorSpeedRPM,
		calcTicksSec;

	ticksPerArcsecond.html(roundToDecimal(totalTicksPerAxis * uom.arcsecToRev, 2));

	// from MLB.motorLib.calcMaxSlewSpeedDegSec(): maxMotorRPM * drive.speedReductions[0].reduction / drive.totalReduction * 6;
	maxSpeedDegSec = parseFloat(motorMaxRPM) * parseFloat(reduction1) / parseFloat(totalTicksPerAxis) * 6;
	motorMaxSpeed.html(roundToDecimal(maxSpeedDegSec, 3) + ' deg/sec');
	// axisSpeedArcsecondsPerSec / 3600 = axis speed deg/sec; axis speed deg/sec / 360 = axis speed rev/sec; axis speed rev/sec * 60 = axis speed rev/min; finally multiply by the mechanical gear reduction (total reduction / encoder reduction) to get motor rev/min or rpms
	motorSpeedRPM = parseFloat(axisSpeedArcsecondsPerSec) / 21600 * parseFloat(totalTicksPerAxis) / parseFloat(reduction1);
	motorSpeed.html(roundToDecimal(motorSpeedRPM, 2) + ' rpm');
	// axisSpeedArcsecondsPerSec * arcsec/rev = axis speed rev/sec
	calcTicksSec = parseFloat(axisSpeedArcsecondsPerSec) * uom.arcsecToRev * parseFloat(totalTicksPerAxis);
	ticksSecond.html(roundToDecimal(calcTicksSec, 2));
};

MLB.motorCalc.calcSpeeds = function () {
	var uom = MLB.sharedLib.uom,
	    roundToDecimal = MLB.sharedLib.roundToDecimal,
		reduction1 = $('input[name=reduction1]').val(),
		totalTicksPerAxis = $('input[name=totalTicksPerAxis]').val(),
	    axisSpeedArcsecondsPerSec = $('input[name=axisSpeedArcsecondsPerSec]').val(),
	    motorSpeed = $('td[id=motorSpeed]'),
	    ticksSecond = $('td[id=ticksSecond]'),
		motorSpeedRPM,
		calcTicksSec;

	// see notes in MLB.motorCalc.calcResultsUsingTotalTicksPerAxis()
	motorSpeedRPM = parseFloat(axisSpeedArcsecondsPerSec) / 21600 * parseFloat(totalTicksPerAxis) / parseFloat(reduction1);
	motorSpeed.html(roundToDecimal(motorSpeedRPM, 2) + ' rpm');
	calcTicksSec = parseFloat(axisSpeedArcsecondsPerSec) * uom.arcsecToRev * parseFloat(totalTicksPerAxis);
	ticksSecond.html(roundToDecimal(calcTicksSec, 2));
};

$(window).ready(function () {
	var calcResultsUsingGearReductions = MLB.motorCalc.calcResultsUsingGearReductions,
		calcResultsUsingTotalTicksPerAxis = MLB.motorCalc.calcResultsUsingTotalTicksPerAxis,
	    calcSpeeds = MLB.motorCalc.calcSpeeds,
		btnCalcUsingGearReductions = $('input[id=btnCalcUsingGearReductions]'),
		inputTotalTicksPerAxis = $('input[name=totalTicksPerAxis]'),
	    btnCalcSpeeds = $('input[id=btnCalcSpeeds]');

	// event hookups/subscribes
	btnCalcUsingGearReductions.click(function () {
		calcResultsUsingGearReductions();
	});
	btnCalcSpeeds.click(function () {
		calcSpeeds();
	});
	// if user changes field then calculate using the total ticks
	inputTotalTicksPerAxis.change(function () {
		calcResultsUsingTotalTicksPerAxis();
	});

	calcResultsUsingGearReductions();
});

// end of file