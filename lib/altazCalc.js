// copyright Mel Bartels, 2012-2014

'use strict';

MLB.altazCalc = {};

MLB.altazCalc.trackingRatesNoCorrection = {
	calc: new MLB.coordLib.TrackingRates(),
	xform: new MLB.coordLib.XForm(MLB.coordLib.ConvertStyle.trig, 0)
};

MLB.altazCalc.calc = function () {
	var includeRefraction,
	    HA,
		Dec,
		latitude,
		HARad,
		DecRad,
		latitudeRad,
		state,
		rates,
		positionDecimals = 3,
		rateDecimals = 3,
		changeDecimals = 6,
		timeIntervalSecs = 1,
		HAOffset = 0,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom,
		trackingRatesNoCorrection = MLB.altazCalc.trackingRatesNoCorrection,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians;

	HA = $('input[name=HA]').val();
	Dec = $('input[name=Dec]').val();
	latitude = $('input[name=latitude]').val();
	includeRefraction = $('[name=includeRefraction]')[0].checked;

	HARad = parseCoordinateGetValueInRadians(HA, true).radians;
	DecRad = parseCoordinateGetValueInRadians(Dec).radians;
	latitudeRad = parseCoordinateGetValueInRadians(latitude).radians;

	state = trackingRatesNoCorrection;
	state.xform.latitude = latitudeRad;
	state.xform.presetAltaz();

	state.xform.position.RA = 0;
	state.xform.position.Dec = DecRad;
	state.xform.position.SidT = HARad;
	rates = state.calc.getRatesViaDeltaTime(state.xform, timeIntervalSecs, HAOffset, includeRefraction);

	$('td[id=az]').html(roundToDecimal(rates.initialAz / uom.degToRad, positionDecimals));
	$('td[id=alt]').html(roundToDecimal(rates.initialAlt / uom.degToRad, positionDecimals));
	$('td[id=FR]').html(roundToDecimal(rates.initialFR / uom.degToRad, positionDecimals));

	if (includeRefraction) {
		$('td[id=refract]').html(roundToDecimal(rates.refractionResults.refraction / uom.degToRad, positionDecimals));
	} else {
		$('td[id=refract]').html('');
	}

	$('td[id=azRate]').html(roundToDecimal(rates.azRate / uom.arcsecToRad, rateDecimals));
	$('td[id=altRate]').html(roundToDecimal(rates.altRate / uom.arcsecToRad, rateDecimals));
	$('td[id=FRRate]').html(roundToDecimal(rates.FRRate / uom.arcsecToRad, rateDecimals));

	$('td[id=azRateChange]').html(roundToDecimal(rates.changeAzRate / uom.arcsecToRad, changeDecimals));
	$('td[id=altRateChange]').html(roundToDecimal(rates.changeAltRate / uom.arcsecToRad, changeDecimals));
	$('td[id=FRRateChange]').html(roundToDecimal(rates.changeFRRate / uom.arcsecToRad, changeDecimals));
};

$(window).ready(function () {
	var btnCalc = $('input[id=btnCalc]'),
		calc = MLB.altazCalc.calc;

	// event hookups/subscribes
	btnCalc.click(function () {
		calc();
	});

	calc();
});

// end of file