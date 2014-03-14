// copyright Mel Bartels, 2012-2014

'use strict';
MLB.astroTimes = {};

MLB.astroTimes.getTimezone = function () {
	return +$('input[name=timezone]').val();
};

MLB.astroTimes.calcSidTJD = function () {
	var inputDate,
	    date,
		JD,
		SidT,
		longitudeDeg,
		getTimezone = MLB.astroTimes.getTimezone,
		convertRadiansToHMSString = MLB.coordLib.convertRadiansToHMSString,
		dateFromString = MLB.coordLib.dateFromString,
		calcJD = MLB.coordLib.calcJD,
		calcSidTFromJD = MLB.coordLib.calcSidTFromJD;

	if ($('input[name=dateTime]').val() === '') {
		$('input[name=dateTime]').val(new Date().toString());
	}

	inputDate = $('input[name=dateTime]').val();
	longitudeDeg = +$('input[name=longitude]').val();

	date = dateFromString(inputDate);
	$('input[name=timezone]').val(-date.getTimezoneOffset() / 60);

	JD = calcJD(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), getTimezone());
	$('input[name=JD]').val(JD);

	SidT = calcSidTFromJD(JD, longitudeDeg);
	$('input[name=SidT]').val(convertRadiansToHMSString(SidT));
};

MLB.astroTimes.calcDateTime = function () {
	var convertHMSMToString = MLB.coordLib.convertHMSMToString,
	    getMonth = MLB.coordLib.getMonth,
		calcDateFromJD = MLB.coordLib.calcDateFromJD,
	    getTimezone = MLB.astroTimes.getTimezone,
	    JD = $('input[name=JD]').val(),
	    date = calcDateFromJD(parseFloat(JD), getTimezone()),
		hmsm = {
			hours: date.hours,
			minutes: date.minutes,
			seconds: date.seconds
		},
		dateString = getMonth(date.month - 1) + ' ' + date.day + ', ' + date.year + ' ' + convertHMSMToString(hmsm);

	$('input[name=dateTime]').val(dateString);
};

MLB.astroTimes.load = function () {
	var btnCalcSidTJD = $('input[id=btnCalcSidTJD]'),
	    btnCalcDateTime = $('input[id=btnCalcDateTime]'),
		calcSidTJD = MLB.astroTimes.calcSidTJD,
	    calcDateTime = MLB.astroTimes.calcDateTime;

	// event hookups/subscribes
	btnCalcSidTJD.click(function () {
		calcSidTJD();
	});
	btnCalcDateTime.click(function () {
		calcDateTime();
	});

	calcSidTJD();
};

// end of file