// copyright Mel Bartels, 2012-2014

'use strict';

MLB.equatTrackingRatesCalc = {};

MLB.equatTrackingRatesCalc.trackingRatesNoCorrection = {
	calc: new MLB.coordLib.TrackingRates(),
	xform: new MLB.coordLib.XForm(MLB.coordLib.ConvertStyle.trig, 0)
};

MLB.equatTrackingRatesCalc.calc = function () {
	var HA,
	    Dec,
		latitude,
		HARad,
		DecRad,
		latitudeRad,
		state,
		rates,
		elevationString,
		KingRate,
		includeRefraction = true,
		positionDecimals = 3,
		rateDecimals = 3,
		changeDecimals = 6,
		timeIntervalSecs = 1,
		HAOffset = 0,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom,
		trackingRatesNoCorrection = MLB.equatTrackingRatesCalc.trackingRatesNoCorrection,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians,
		calcKingRateMinutesPerDay = MLB.coordLib.calcKingRateMinutesPerDay,
		calcKingRateArcsecPerSec = MLB.coordLib.calcKingRateArcsecPerSec;

	HA = $('input[name=HA]').val();
	Dec = $('input[name=Dec]').val();
	latitude = $('input[name=latitude]').val();

	HARad = parseCoordinateGetValueInRadians(HA, true).radians;
	DecRad = parseCoordinateGetValueInRadians(Dec).radians;
	latitudeRad = parseCoordinateGetValueInRadians(latitude).radians;

	state = trackingRatesNoCorrection;
	state.xform.latitude = latitudeRad;
	state.xform.presetEquat();

	state.xform.position.RA = 0;
	state.xform.position.Dec = DecRad;
	state.xform.position.SidT = HARad;
	rates = state.calc.getRatesViaDeltaTime(state.xform, timeIntervalSecs, HAOffset, includeRefraction);
	elevationString = roundToDecimal(rates.refractionResults.refractedAlt / uom.degToRad, positionDecimals);

	if (rates.refractionResults.refractedAlt < 0) {
		alert(elevationString + ' degrees below the horizon - try again');
		return;
	}

	KingRate = calcKingRateArcsecPerSec(calcKingRateMinutesPerDay(0, DecRad, HARad, latitudeRad));

	$('td[id=elevation]').html(elevationString);
	$('td[id=refract]').html(roundToDecimal(rates.refractionResults.refraction / uom.degToRad, positionDecimals));

	$('td[id=RARate]').html(roundToDecimal(rates.azRate / uom.arcsecToRad, rateDecimals));
	$('td[id=DecRate]').html(roundToDecimal(rates.altRate / uom.arcsecToRad, rateDecimals));

	$('td[id=KingRARate]').html(roundToDecimal(KingRate, rateDecimals));

	$('td[id=RARateChange]').html(roundToDecimal(rates.changeAzRate / uom.arcsecToRad, changeDecimals));
	$('td[id=DecRateChange]').html(roundToDecimal(rates.changeAltRate / uom.arcsecToRad, changeDecimals));
};

// end of file