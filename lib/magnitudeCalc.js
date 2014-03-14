// copyright Mel Bartels, 2013-2014

'use strict';

MLB.magnitudeCalc = {};

MLB.magnitudeCalc.calcUsingPercent = function () {
	var magDecimals = 2,
	    percent = +$('input[name=percent]').val(),
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		magDiff = -magnitudeDrop(percent / 100);

	$('input[name=magOutPercent]').val(roundToDecimal(magDiff, magDecimals));
};

MLB.magnitudeCalc.calcUsingAperture = function () {
	var magDecimals = 2,
	    aperture1 = +$('input[name=aperture1]').val(),
	    aperture2 = +$('input[name=aperture2]').val(),
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		magnitudeDifferenceBetweenApertures = MLB.calcLib.magnitudeDifferenceBetweenApertures,
		magDiff = -magnitudeDifferenceBetweenApertures(aperture1, aperture2);

	$('input[name=magOutAperture]').val(roundToDecimal(magDiff, magDecimals));
};

MLB.magnitudeCalc.load = function () {
	var btnCalcPercent = document.getElementById('btnCalcPercent'),
		btnCalcAperture = document.getElementById('btnCalcAperture'),
		calcUsingPercent = MLB.magnitudeCalc.calcUsingPercent,
		calcUsingAperture = MLB.magnitudeCalc.calcUsingAperture;

	// event hookups/subscribes
	btnCalcPercent.onclick = function () {
		calcUsingPercent();
	};
	btnCalcAperture.onclick = function () {
		calcUsingAperture();
	};
};

// end of file