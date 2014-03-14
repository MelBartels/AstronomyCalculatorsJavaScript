// copyright Mel Bartels, 2013-2014

'use strict';

MLB.DobFrictionCalc = {};

MLB.DobFrictionCalc.calc = function () {
	var roundToDecimal = MLB.sharedLib.roundToDecimal,
	    decimals = 1,
	    azimuthFrictionCoefficient = +$('input[name=azimuthFrictionCoefficient]').val(),
	    altitudeFrictionCoefficient = +$('input[name=altitudeFrictionCoefficient]').val(),
		momentArm = +$('input[name=momentArm]').val(),
		azWeight = +$('input[name=azWeight]').val(),
		altWeight = +$('input[name=altWeight]').val(),
		azBearingRadius = +$('input[name=azBearingRadius]').val(),
		altBearingRadius = +$('input[name=altBearingRadius]').val(),
		altBearingAngleDegFromVertical = +$('input[name=altBearingAngleDegFromVertical]').val(),
		altitudeAngleDegFromHorizontal = +$('input[name=altitudeAngleDegFromHorizontal]').val(),
		friction = MLB.calcLib.calcDobFriction(azimuthFrictionCoefficient, altitudeFrictionCoefficient, momentArm, azWeight, altWeight, azBearingRadius, altBearingRadius, altBearingAngleDegFromVertical, altitudeAngleDegFromHorizontal);

	$('td[id=azFriction]').html(roundToDecimal(friction.az, decimals));
	$('td[id=altFriction]').html(roundToDecimal(friction.alt, decimals));
};

MLB.DobFrictionCalc.load = function () {
	var btnCalc = $('input[id=btnCalc]'),
		calc = MLB.DobFrictionCalc.calc;

	// event hookups/subscribes
	btnCalc.click(function () {
		calc();
	});

	calc();
};

// end of file