// copyright Mel Bartels, 2012-2014

'use strict';

MLB.coordErrorsCalc = {};

MLB.coordErrorsCalc.coordErrorsCalcState = {
	position: new MLB.coordLib.Position()
};

MLB.coordErrorsCalc.calc = function () {
	var RA,
	    Dec,
		SidT,
		latitude,
		coordYear,
		calcDate,
		RARadians,
		DecRadians,
		SidTRadians,
		latitudeRadians,
		coordJD,
		calcDateObject,
		JD,
		pnaCorrections,
		totalRA,
		totalDec,
		refractCorrection,
		properMotion = 0,
		timeZoneOffsetHrs = 0,
		limitToHundredthsArcsec = true,
		limitToTenthsArcsec = true,
		coordErrorsCalcState = MLB.coordErrorsCalc.coordErrorsCalcState,
		position = coordErrorsCalcState.position,
		convertRadiansToHMSMString = MLB.coordLib.convertRadiansToHMSMString,
		convertRadiansToDMSMString = MLB.coordLib.convertRadiansToDMSMString,
		dateFromString = MLB.coordLib.dateFromString,
		getMonth = MLB.coordLib.getMonth,
		dateTodayString = MLB.coordLib.dateTodayString,
		calcJDFromJulianYear = MLB.coordLib.calcJDFromJulianYear,
		calcJD = MLB.coordLib.calcJD,
		calcProperMotionPrecessionNutationAnnualAberration = MLB.coordLib.calcProperMotionPrecessionNutationAnnualAberration,
		calcRefractionFromTrue = MLB.coordLib.calcRefractionFromTrue,
		parseCoordinate = MLB.coordLib.parseCoordinate,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians,
		calcRefractionFromTrueEquatorialCorrection = MLB.coordLib.calcRefractionFromTrueEquatorialCorrection;

	if ($('input[name=calcDate]').val() === '') {
		$('input[name=calcDate]').val(dateTodayString());
	}

	// set vars from user input using jquery;
	// coordYear is a number, the rest are strings
	RA = $('input[name=RA]').val();
	Dec = $('input[name=Dec]').val();
	SidT = $('input[name=SidT]').val();
	latitude = $('input[name=latitude]').val();
	coordYear = +$('input[name=coordYear]').val();
	calcDate = $('input[name=calcDate]').val();

	RARadians = parseCoordinateGetValueInRadians(RA, true).radians;
	DecRadians = parseCoordinateGetValueInRadians(Dec).radians;
	SidTRadians = parseCoordinateGetValueInRadians(SidT, true).radians;
	latitudeRadians = parseCoordinateGetValueInRadians(latitude).radians;

	coordJD = calcJDFromJulianYear(coordYear);
	calcDateObject = dateFromString(calcDate);
	JD = calcJD(calcDateObject.getFullYear(), calcDateObject.getMonth() + 1, calcDateObject.getDate(), calcDateObject.getHours(), calcDateObject.getMinutes(), calcDateObject.getSeconds(), calcDateObject.getMilliseconds(), timeZoneOffsetHrs);

	pnaCorrections = calcProperMotionPrecessionNutationAnnualAberration(RARadians, DecRadians, coordJD, JD, properMotion, properMotion);
	totalRA = pnaCorrections.total.deltaRA;
	totalDec = pnaCorrections.total.deltaDec;
	refractCorrection = calcRefractionFromTrueEquatorialCorrection(RARadians + totalRA, DecRadians + totalDec, SidTRadians, latitudeRadians, position);

	$('td[id=precessionRA]').html(convertRadiansToHMSMString(pnaCorrections.precession.deltaRA, limitToHundredthsArcsec));
	$('td[id=precessionDec]').html(convertRadiansToDMSMString(pnaCorrections.precession.deltaDec, limitToTenthsArcsec));

	$('td[id=nutationRA]').html(convertRadiansToHMSMString(pnaCorrections.nutation.deltaRA, limitToHundredthsArcsec));
	$('td[id=nutationDec]').html(convertRadiansToDMSMString(pnaCorrections.nutation.deltaDec, limitToTenthsArcsec));

	$('td[id=annualAberrationRA]').html(convertRadiansToHMSMString(pnaCorrections.annualAberration.deltaRA, limitToHundredthsArcsec));
	$('td[id=annualAberrationDec]').html(convertRadiansToDMSMString(pnaCorrections.annualAberration.deltaDec, limitToTenthsArcsec));

	$('td[id=totalRA]').html(convertRadiansToHMSMString(totalRA, limitToHundredthsArcsec));
	$('td[id=totalDec]').html(convertRadiansToDMSMString(totalDec, limitToTenthsArcsec));

	$('td[id=refractionRA]').html(convertRadiansToHMSMString(refractCorrection.deltaRA, limitToHundredthsArcsec));
	$('td[id=refractionDec]').html(convertRadiansToDMSMString(refractCorrection.deltaDec, limitToTenthsArcsec));
};

MLB.coordErrorsCalc.load = function () {
	var btnCalc = $('input[id=btnCalc]'),
		calc = MLB.coordErrorsCalc.calc;

	// event hookups/subscribes
	btnCalc.click(function () {
		calc();
	});

	calc();
};

// end of file