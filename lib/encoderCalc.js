// copyright Mel Bartels, 2015

'use strict';

MLB.encoderCalc = {};

MLB.encoderCalc.data = {
	encoder: new MLB.encoderLib.encoder()
};

MLB.encoderCalc.update = function () {
	var uom = MLB.sharedLib.uom,
	    roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 3,
	    getReduction = MLB.sharedLib.getReduction,
	    update = MLB.encoderLib.update,
	    encoder = MLB.encoderCalc.data.encoder,

		encoderName = $('input[name=encoderName]').val(),
	    encoderMinCount = +$('input[name=encoderMinCount]').val(),
	    encoderMaxCount = +$('input[name=encoderMaxCount]').val(),
	    encoderGearReduction = getReduction($('input[name=encoderGearReduction]').val()),

	    encoderCurrentCount = $('input[name=encoderCurrentCount]'),
		encoderCurrentCountVal = +encoderCurrentCount.val(),
	    encoderLastCount = $('input[name=encoderLastCount]'),
		encoderLastCountVal = +encoderLastCount.val(),
	    encoderRotations = $('input[name=encoderRotations]'),
		encoderRotationsVal = +encoderRotations.val(),
	    encoderAngleOffsetDeg = $('input[name=encoderAngleOffsetDeg]'),
		encoderAngleOffsetDegVal = +encoderAngleOffsetDeg.val() * uom.degToRad,

	    encoderDirection = $('input[name=encoderDirection]'),
	    encoderAngleDeg = $('input[name=encoderAngleDeg]'),
	    encoderGearAngleDeg = $('input[name=encoderGearAngleDeg]'),
	    encoderGearAngleWithOffsetDeg = $('input[name=encoderGearAngleWithOffsetDeg]');

	encoder.name = encoderName;
	encoder.minCount = encoderMinCount;
	encoder.maxCount = encoderMaxCount;
	encoder.totalCounts = encoder.maxCount - encoder.minCount + 1;
	encoder.gearReduction = encoderGearReduction;
	encoder.offsetAngle = encoderAngleOffsetDegVal;

	encoder.lastCount = encoderLastCountVal;
	encoder.rotations = encoderRotationsVal;

	update(encoder, encoderCurrentCountVal);

	encoderLastCount.val(encoder.lastCount);
	encoderDirection.val(encoder.direction);
	encoderRotations.val(encoder.rotations);
	encoderAngleDeg.val(roundToDecimal(encoder.encoderAngle / uom.degToRad, decimalPoints));
	encoderGearAngleDeg.val(roundToDecimal(encoder.gearAngle / uom.degToRad, decimalPoints));
	encoderGearAngleWithOffsetDeg.val(roundToDecimal(encoder.gearAngleWithOffset / uom.degToRad, decimalPoints));
};

MLB.encoderCalc.reset = function () {
	var uom = MLB.sharedLib.uom,
	    roundToDecimal = MLB.sharedLib.roundToDecimal,
		decimalPoints = 3,
		reset = MLB.encoderLib.reset,
		encoder = MLB.encoderCalc.data.encoder,

		encoderCurrentCount = $('input[name=encoderCurrentCount]'),
		encoderLastCount = $('input[name=encoderLastCount]'),
	    encoderRotations = $('input[name=encoderRotations]'),
		encoderAngleOffsetDeg = $('input[name=encoderAngleOffsetDeg]'),
	    encoderDirection = $('input[name=encoderDirection]'),
	    encoderAngleDeg = $('input[name=encoderAngleDeg]'),
	    encoderGearAngleDeg = $('input[name=encoderGearAngleDeg]'),
	    encoderGearAngleWithOffsetDeg = $('input[name=encoderGearAngleWithOffsetDeg]');

	reset(encoder);

	encoderCurrentCount.val(encoder.currentCount);
	encoderLastCount.val(encoder.lastCount);
	encoderRotations.val(encoder.rotations);
	encoderAngleOffsetDeg.val(roundToDecimal(encoder.offsetAngle / uom.degToRad, decimalPoints));
	encoderDirection.val(encoder.direction);
	encoderAngleDeg.val(roundToDecimal(encoder.encoderAngle / uom.degToRad, decimalPoints));
	encoderGearAngleDeg.val(roundToDecimal(encoder.gearAngle / uom.degToRad, decimalPoints));
	encoderGearAngleWithOffsetDeg.val(roundToDecimal(encoder.gearAngleWithOffset / uom.degToRad, decimalPoints));
};

$(window).ready(function () {
	var update = MLB.encoderCalc.update,
	    reset = MLB.encoderCalc.reset,
		btnUpdateEncoder = $('input[id=btnUpdateEncoder]'),
		btnResetEncoder =  $('input[id=btnResetEncoder]');

	// event hookups/subscribes
	btnUpdateEncoder.click(function () {
		update();
	});
	btnResetEncoder.click(function () {
		reset();
	});

	update();
});

// end of file