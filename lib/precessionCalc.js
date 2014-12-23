// copyright Mel Bartels, 2013-2014

'use strict';

MLB.precessionCalc = {};

MLB.precessionCalc.precessionCalcState = {
	position: new MLB.coordLib.Position()
};

MLB.precessionCalc.calc = function () {
	var RA,
	    Dec,
		fromYear,
		toYear,
		RARadians,
		DecRadians,
		precession,
		limitToHundredthsArcsec = true,
		limitToTenthsArcsec = true,
		convertRadiansToHMSMString = MLB.coordLib.convertRadiansToHMSMString,
		convertRadiansToDMSMString = MLB.coordLib.convertRadiansToDMSMString,
		dateTodayString = MLB.coordLib.dateTodayString,
		calcPrecessionRigorous = MLB.coordLib.calcPrecessionRigorous,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians;

	if ($('input[name=toYear]').val() === '') {
		$('input[name=toYear]').val(new Date().getFullYear());
	}

	// set vars from user input using jquery;
	// fromYear is a number, the rest are strings
	RA = $('input[name=RA]').val();
	Dec = $('input[name=Dec]').val();
	fromYear = +$('input[name=fromYear]').val();
	toYear = +$('input[name=toYear]').val();

	RARadians = parseCoordinateGetValueInRadians(RA, true).radians;
	DecRadians = parseCoordinateGetValueInRadians(Dec).radians;

	precession = calcPrecessionRigorous(RARadians, DecRadians, fromYear, toYear - fromYear);

	$('input[name=RAout]').val(convertRadiansToHMSMString(RARadians + precession.deltaRA, limitToHundredthsArcsec));
	$('input[name=Decout]').val(convertRadiansToDMSMString(DecRadians + precession.deltaDec, limitToTenthsArcsec));
};

$(window).ready(function () {
	var btnPrecess = $('input[id=btnPrecess]'),
		calc = MLB.precessionCalc.calc;

	// event hookups/subscribes
	btnPrecess.click(function () {
		calc();
	});

	calc();
});

// end of file