// copyright Mel Bartels, 2012-2014

'use strict';

MLB.scopeToSky = {};

MLB.scopeToSky.scopeToSkyState = {
	yes: 0,
	no: 1,

	RA: 0,
	HA: 1,

	trig: 0,
	matrix: 1,

	equatorial: 0,
	altazimuth: 1,
	star: 2,
	forceAlignment: 3,

	onWestSidePointingEast: 0,
	onEastSidePointingWest: 1,

	deltaTime: 0,
	formulae: 1,

	limitToHundredthsArcsec: true,
	limitToTenthsArcsec: true,
	positionDecimals: 4,
	rateDecimals: 4,
	changeDecimals: 6,

	properMotion: 0,
	HAOffset: 0,
	timeIntervalSecs: 1,
	notAvailable: 'n/a',

	analysisPositionSubString: 'analysisPosition',
	analysisPositionsSize: 3,
	analysisPositions: [new MLB.coordLib.Position(), new MLB.coordLib.Position(), new MLB.coordLib.Position()],

	JD: undefined,
	SidT: undefined,

	date: new Date(),

	xform: undefined,
	xformTrig: new MLB.coordLib.XForm(),
	xformMatrix: new MLB.coordLib.XForm(),

	trackingRates: new MLB.coordLib.TrackingRates(),
	refractPosition: new MLB.coordLib.Position(),

	lastLatitude: undefined,
	lastConversionStyle: undefined,
	lastAlignment: undefined,
	lastTrackingRatesAlgorithm: undefined,
	initCount: 0,
	initAnalysis: undefined,
	bestZ123: undefined,

	inputRAorHA: function () {
		return $('input[name=RAorHA]');
	},
	inputIncludeCorrections: function () {
		return $('input[name=includeCorrections]');
	},
	inputUseCurrentDateTime: function () {
		return $('input[name=useCurrentDateTime]');
	},
	inputDateTime: function () {
		return $('input[name=dateTime]');
	},
	inputTimeZone: function () {
		return $('input[name=timezone]');
	},
	inputLatitude: function () {
		return $('input[name=latitude]');
	},
	inputLongitude: function () {
		return $('input[name=longitude]');
	},
	inputIncludeRefraction: function () {
		return $('input[name=includeRefraction]');
	},
	inputCanFlipMeridian: function () {
		return $('input[name=canFlipMeridian]');
	},
	inputFlippedState: function () {
		return $('input[name=flippedState]');
	},
	inputFlipped: function () {
		return $('input[name=flipped]');
	},
	inputConversionStyle: function () {
		return $('input[name=conversionStyle]');
	},
	inputAlignment: function () {
		return $('input[name=alignment]');
	},
	inputTrackingRatesAlgorithm: function () {
		return $('input[name=trackingRatesAlgorithm]');
	},
	inputRAHA: function () {
		return $('input[name=inputRAHA]');
	},
	inputDec: function () {
		return $('input[name=inputDec]');
	},
	inputCoordinateYear: function () {
		return $('input[name=inputCoordinateYear]');
	},
	inOutScopeAzimuth: function () {
		return $('input[name=az]');
	},
	inOutScopeAltitude: function () {
		return $('input[name=alt]');
	},
	outputScopeFR: function () {
		return $('td[id=FR]');
	},
	inOutZ1: function () {
		return $('input[name=z1]');
	},
	inOutZ2: function () {
		return $('input[name=z2]');
	},
	inOutZ3: function () {
		return $('input[name=z3]');
	},
	inOutOne: function () {
		return $('input[name=one]');
	},
	inOutTwo: function () {
		return $('input[name=two]');
	},
	inOutThree: function () {
		return $('input[name=three]');
	},
	outputFabErrors: function () {
		return $('td[id=fabErrors]');
	},
	outputNotes1: function () {
		return $('td[id=notes1]');
	},
	outputNotes2: function () {
		return $('td[id=notes2]');
	},
	outputNotes3: function () {
		return $('td[id=notes3]');
	}
};

// immediately build out the two XForms...
(function () {
	MLB.scopeToSky.scopeToSkyState.xformTrig.setConvertStyle(MLB.coordLib.ConvertStyle.trig);
	MLB.scopeToSky.scopeToSkyState.xformMatrix.setConvertStyle(MLB.coordLib.ConvertStyle.matrix);
}());

MLB.scopeToSky.setXForm = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    xformTrig = scopeToSkyState.xformTrig,
	    xformMatrix = scopeToSkyState.xformMatrix,
	    inputConversionStyle = scopeToSkyState.inputConversionStyle,
	    trig = scopeToSkyState.trig,
		matrix = scopeToSkyState.matrix;

	if (inputConversionStyle()[trig].checked) {
		scopeToSkyState.xform = xformTrig;
	}
	if (inputConversionStyle()[matrix].checked) {
		scopeToSkyState.xform = xformMatrix;
	}
	return scopeToSkyState.xform;
};

MLB.scopeToSky.initUserDefinedMatrix = function (xform) {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    z1,
	    z2,
		z3,
		position1,
	    position2,
	    position3,
		init = 2,
		inOutZ1 = scopeToSkyState.inOutZ1,
		inOutZ2 = scopeToSkyState.inOutZ2,
		inOutZ3 = scopeToSkyState.inOutZ3,
		inOutOne = scopeToSkyState.inOutOne,
		inOutTwo = scopeToSkyState.inOutTwo,
		inOutThree = scopeToSkyState.inOutThree,
		uom = MLB.sharedLib.uom,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians,
		setPositionDegFromString = MLB.coordLib.setPositionDegFromString,
		isValidPosition = MLB.coordLib.isValidPosition,
	    InitType = MLB.coordLib.InitType,
		initMatrixFacade = MLB.coordLib.initMatrixFacade;

	z1 = inOutZ1().val();
	z2 = inOutZ2().val();
	z3 = inOutZ3().val();
	if (isNaN(z1) || isNaN(z2) || isNaN(z3)) {
		alert('Fabrication numbers must be valid');
		return;
	}
	xform.setFabErrorsDeg(parseCoordinateGetValueInRadians(z1).radians / uom.degToRad, parseCoordinateGetValueInRadians(z2).radians / uom.degToRad, parseCoordinateGetValueInRadians(z3).radians / uom.degToRad);

	position1 = inOutOne().val();
	setPositionDegFromString(position1, xform.cmws.one);
	if (!isValidPosition(xform.cmws.one)) {
		alert('Initialized position #1 must be valid');
		return;
	}
	position2 = inOutTwo().val();
	setPositionDegFromString(position2, xform.cmws.two);
	if (!isValidPosition(xform.cmws.two)) {
		alert('Initialized position #2 must be valid');
		return;
	}
	position3 = inOutThree().val().trim();
	if (position3.length > 0) {
		setPositionDegFromString(position3, xform.cmws.three);
		if (!isValidPosition(xform.cmws.three)) {
			alert('Initialized position #3 must be valid');
			return;
		}
		init = 3;
	}

	initMatrixFacade(xform.cmws, init);
	xform.initType = InitType.star;
};

MLB.scopeToSky.setXFormAlignment = function (xform, inputAlignment) {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    matrix = scopeToSkyState.matrix,
		inputConversionStyle = scopeToSkyState.inputConversionStyle,
	    initUserDefinedMatrix = MLB.scopeToSky.initUserDefinedMatrix,
	    equatorial = scopeToSkyState.equatorial,
	    altazimuth = scopeToSkyState.altazimuth,
		star = scopeToSkyState.star,
		notAvailable = scopeToSkyState.notAvailable,
		outputNotes1 = scopeToSkyState.outputNotes1,
		outputNotes3 = scopeToSkyState.outputNotes3,
		outputFabErrors = scopeToSkyState.outputFabErrors;

	if (inputAlignment()[equatorial].checked) {
		xform.presetEquat();
	}
	if (inputAlignment()[altazimuth].checked) {
		xform.presetAltaz();
	}
	if (inputAlignment()[star].checked) {
		initUserDefinedMatrix(xform);
	}

	outputNotes1().html('init type (count): ' + xform.initType + ' (' + (++scopeToSkyState.initCount) + ')');
	if (inputConversionStyle()[matrix].checked) {
		outputNotes3().html('# of init points used: ' + xform.cmws.init);
	} else {
		outputNotes3().html('');
	}
	scopeToSkyState.bestZ123 = undefined;
	outputFabErrors().html(notAvailable);
};

MLB.scopeToSky.latitudeChanged = function (xform) {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    lastLatitude = scopeToSkyState.lastLatitude;

	return lastLatitude !== xform.latitude;
};

MLB.scopeToSky.conversionStyleChanged = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    trig = scopeToSkyState.trig,
	    matrix = scopeToSkyState.matrix,
		lastConversionStyle = scopeToSkyState.lastConversionStyle,
	    inputConversionStyle = scopeToSkyState.inputConversionStyle;

	return (lastConversionStyle === trig && inputConversionStyle()[matrix].checked) || (lastConversionStyle === matrix && inputConversionStyle()[trig].checked);
};

MLB.scopeToSky.alignmentChanged = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    altazimuth = scopeToSkyState.altazimuth,
	    equatorial = scopeToSkyState.equatorial,
		star = scopeToSkyState.star,
		forceAligment = scopeToSkyState.forceAlignment,
		lastAlignment = scopeToSkyState.lastAlignment,
		inputAlignment = scopeToSkyState.inputAlignment;

	return (lastAlignment === forceAligment) || (lastAlignment === altazimuth && !inputAlignment()[altazimuth].checked) || (lastAlignment === equatorial && !inputAlignment()[equatorial].checked) || (lastAlignment === star && !inputAlignment()[star].checked);
};

MLB.scopeToSky.trackingRatesAlgorithmChanged = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    deltaTime = scopeToSkyState.deltaTime,
	    formulae = scopeToSkyState.formulae,
	    lastTrackingRatesAlgorithm = scopeToSkyState.lastTrackingRatesAlgorithm,
	    inputTrackingRatesAlgorithm = scopeToSkyState.inputTrackingRatesAlgorithm;

	return (lastTrackingRatesAlgorithm === deltaTime && !inputTrackingRatesAlgorithm()[deltaTime].checked) || (lastTrackingRatesAlgorithm === formulae && !inputTrackingRatesAlgorithm()[formulae].checked);
};

MLB.scopeToSky.updateLastInitializationNeeded = function (xform) {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    trig = scopeToSkyState.trig,
	    matrix = scopeToSkyState.matrix,
	    altazimuth = scopeToSkyState.altazimuth,
	    equatorial = scopeToSkyState.equatorial,
		star = scopeToSkyState.star,
		deltaTime = scopeToSkyState.deltaTime,
	    formulae = scopeToSkyState.formulae,
	    inputConversionStyle = scopeToSkyState.inputConversionStyle,
		inputAlignment = scopeToSkyState.inputAlignment,
	    inputTrackingRatesAlgorithm = scopeToSkyState.inputTrackingRatesAlgorithm;

	scopeToSkyState.lastLatitude = xform.latitude;

	if (inputConversionStyle()[trig].checked) {
		scopeToSkyState.lastConversionStyle = trig;
	}
	if (inputConversionStyle()[matrix].checked) {
		scopeToSkyState.lastConversionStyle = matrix;
	}

	if (inputAlignment()[equatorial].checked) {
		scopeToSkyState.lastAlignment = equatorial;
	}
	if (inputAlignment()[altazimuth].checked) {
		scopeToSkyState.lastAlignment = altazimuth;
	}
	if (inputAlignment()[star].checked) {
		scopeToSkyState.lastAlignment = star;
	}

	if (inputTrackingRatesAlgorithm()[deltaTime].checked) {
		scopeToSkyState.lastTrackingRatesAlgorithm = deltaTime;
	}
	if (inputTrackingRatesAlgorithm()[formulae].checked) {
		scopeToSkyState.lastTrackingRatesAlgorithm = formulae;
	}
};

MLB.scopeToSky.initializationNeeded = function (xform) {
	var latitudeChanged = MLB.scopeToSky.latitudeChanged,
	    conversionStyleChanged = MLB.scopeToSky.conversionStyleChanged,
	    alignmentChanged = MLB.scopeToSky.alignmentChanged,
	    trackingRatesAlgorithmChanged = MLB.scopeToSky.trackingRatesAlgorithmChanged;

	return latitudeChanged(xform) || conversionStyleChanged() || alignmentChanged() || trackingRatesAlgorithmChanged();
};

MLB.scopeToSky.setXFormMeridianFlip = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    yes = scopeToSkyState.yes,
		onWestSidePointingEast = scopeToSkyState.onWestSidePointingEast,
		onEastSidePointingWest = scopeToSkyState.onEastSidePointingWest,
	    inputCanFlipMeridian = scopeToSkyState.inputCanFlipMeridian,
		inputFlippedState = scopeToSkyState.inputFlippedState,
		inputFlipped = scopeToSkyState.inputFlipped,
		xform = scopeToSkyState.xform,
		MeridianFlipStates = MLB.coordLib.MeridianFlipStates,
		setFlipState = MLB.coordLib.setFlipState;

	xform.meridianFlip.canFlip = inputCanFlipMeridian()[yes].checked;
	if (inputFlippedState()[onWestSidePointingEast].checked) {
		xform.meridianFlip.inputFlippedState = MeridianFlipStates.onWestSidePointingEast;
	} else if (inputFlippedState()[onEastSidePointingWest].checked) {
		xform.meridianFlip.inputFlippedState = MeridianFlipStates.onEastSidePointingWest;
	}
	setFlipState(inputFlipped()[yes].checked, xform.meridianFlip);
};

MLB.scopeToSky.setupXForm = function (latitude) {
	var xform,
	    scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
		setXForm = MLB.scopeToSky.setXForm,
		setXFormAlignment = MLB.scopeToSky.setXFormAlignment,
		updateLastInitializationNeeded = MLB.scopeToSky.updateLastInitializationNeeded,
		initializationNeeded = MLB.scopeToSky.initializationNeeded,
		setXFormMeridianFlip = MLB.scopeToSky.setXFormMeridianFlip,
	    matrix = scopeToSkyState.matrix,
		inputAlignment = scopeToSkyState.inputAlignment,
	    inputConversionStyle = scopeToSkyState.inputConversionStyle;

	xform = setXForm();
	setXFormMeridianFlip();

	xform.latitude = latitude;

	if (initializationNeeded(xform)) {
		setXFormAlignment(xform, inputAlignment);
		if (inputConversionStyle()[matrix].checked) {
			scopeToSkyState.initAnalysis = xform.initAltazResults();
		}
		updateLastInitializationNeeded(xform);
	}

	return xform;
};

MLB.scopeToSky.updateCorrections = function (pnaCorrections, correctedRA, correctedDec) {
	var outputPrecessionRA = $('td[id=precessionRA]'),
		outputPrecessionDEC = $('td[id=precessionDec]'),
		outputNutationRA = $('td[id=nutationRA]'),
		outputNutationDec = $('td[id=nutationDec]'),
		outputAnnualAberrationRA = $('td[id=annualAberrationRA]'),
		outputAnnualAberrationDec = $('td[id=annualAberrationDec]'),
		outputCorrectedRA = $('td[id=correctedRA]'),
		outputCorrectedDec = $('td[id=correctedDec]'),
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    yes = scopeToSkyState.yes,
		limitToHundredthsArcsec = scopeToSkyState.limitToHundredthsArcsec,
		limitToTenthsArcsec = scopeToSkyState.limitToTenthsArcsec,
		notAvailable = scopeToSkyState.notAvailable,
	    inputIncludeCorrections = scopeToSkyState.inputIncludeCorrections,
		convertRadiansToHMSMString = MLB.coordLib.convertRadiansToHMSMString,
		convertRadiansToDMSMString = MLB.coordLib.convertRadiansToDMSMString;

	if (inputIncludeCorrections()[yes].checked) {
		outputPrecessionRA.html(convertRadiansToHMSMString(pnaCorrections.precession.deltaRA, limitToHundredthsArcsec));
		outputPrecessionDEC.html(convertRadiansToDMSMString(pnaCorrections.precession.deltaDec, limitToTenthsArcsec));
		outputNutationRA.html(convertRadiansToHMSMString(pnaCorrections.nutation.deltaRA, limitToHundredthsArcsec));
		outputNutationDec.html(convertRadiansToDMSMString(pnaCorrections.nutation.deltaDec, limitToTenthsArcsec));
		outputAnnualAberrationRA.html(convertRadiansToHMSMString(pnaCorrections.annualAberration.deltaRA, limitToHundredthsArcsec));
		outputAnnualAberrationDec.html(convertRadiansToDMSMString(pnaCorrections.annualAberration.deltaDec, limitToTenthsArcsec));
		outputCorrectedRA.html(convertRadiansToHMSMString(correctedRA, limitToHundredthsArcsec));
		outputCorrectedDec.html(convertRadiansToDMSMString(correctedDec, limitToTenthsArcsec));
	} else {
		outputPrecessionRA.html(notAvailable);
		outputPrecessionDEC.html(notAvailable);
		outputNutationRA.html(notAvailable);
		outputNutationDec.html(notAvailable);
		outputAnnualAberrationRA.html(notAvailable);
		outputAnnualAberrationDec.html(notAvailable);
		outputCorrectedRA.html(notAvailable);
		outputCorrectedDec.html(notAvailable);
	}
};

MLB.scopeToSky.updateRefraction = function (includeRefraction, refractionResults) {
	var outputRefraction = $('td[id=refraction]'),
		outputRefractedAltitude = $('td[id=refractedAltitude]'),
		outputRefractionRA = $('td[id=refractionRA]'),
		outputRefractionDec = $('td[id=refractionDec]'),
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    limitToHundredthsArcsec = scopeToSkyState.limitToHundredthsArcsec,
		limitToTenthsArcsec = scopeToSkyState.limitToTenthsArcsec,
		positionDecimals = scopeToSkyState.positionDecimals,
		notAvailable = scopeToSkyState.notAvailable,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom,
		convertRadiansToHMSMString = MLB.coordLib.convertRadiansToHMSMString,
		convertRadiansToDMSMString = MLB.coordLib.convertRadiansToDMSMString;

	if (includeRefraction) {
		outputRefraction.html(roundToDecimal(refractionResults.refraction / uom.degToRad, positionDecimals));
		outputRefractedAltitude.html(roundToDecimal(refractionResults.refractedAlt / uom.degToRad, positionDecimals));
		outputRefractionRA.html(convertRadiansToHMSMString(refractionResults.deltaRA, limitToHundredthsArcsec));
		outputRefractionDec.html(convertRadiansToDMSMString(refractionResults.deltaDec, limitToTenthsArcsec));
	} else {
		outputRefraction.html(notAvailable);
		outputRefractedAltitude.html(notAvailable);
		outputRefractionRA.html(notAvailable);
		outputRefractionDec.html(notAvailable);
	}
};

MLB.scopeToSky.updateSiteAltaz = function (siteAz, siteAlt) {
	var outputAzimuth = $('td[id=azimuth]'),
		outputAltitude = $('td[id=altitude]'),
	    scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    positionDecimals = scopeToSkyState.positionDecimals,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom;

	outputAzimuth.html(roundToDecimal(siteAz / uom.degToRad, positionDecimals));
	outputAltitude.html(roundToDecimal(siteAlt / uom.degToRad, positionDecimals));
};

MLB.scopeToSky.updateTrackingRates = function (rates) {
	var outputScopeAzimuthRate = $('td[id=azRate]'),
		outputScopeAltitudeRate = $('td[id=altRate]'),
		outputScopeFRRate = $('td[id=FRRate]'),
		outputScopeAzimuthRateChange = $('td[id=azRateChange]'),
		outputScopeAltitudeRateChange = $('td[id=altRateChange]'),
		outputScopeFRRateChange = $('td[id=FRRateChange]'),
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    rateDecimals = scopeToSkyState.rateDecimals,
		changeDecimals = scopeToSkyState.changeDecimals,
		outputNotes2 = scopeToSkyState.outputNotes2,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom;

	outputScopeAzimuthRate.html(roundToDecimal(rates.azRate / uom.arcsecToRad, rateDecimals));
	outputScopeAltitudeRate.html(roundToDecimal(rates.altRate / uom.arcsecToRad, rateDecimals));
	outputScopeFRRate.html(roundToDecimal(rates.FRRate / uom.arcsecToRad, rateDecimals));

	outputScopeAzimuthRateChange.html(roundToDecimal(rates.changeAzRate / uom.arcsecToRad, changeDecimals));
	outputScopeAltitudeRateChange.html(roundToDecimal(rates.changeAltRate / uom.arcsecToRad, changeDecimals));
	outputScopeFRRateChange.html(roundToDecimal(rates.changeFRRate / uom.arcsecToRad, changeDecimals));

	outputNotes2().html('tracking strategy: ' + rates.trackingRatesStrategy);
};

MLB.scopeToSky.starAligned = function (xform) {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    inputConversionStyle = scopeToSkyState.inputConversionStyle,
		matrix = scopeToSkyState.matrix;

	return inputConversionStyle()[matrix].checked && xform.cmws !== undefined;
};

MLB.scopeToSky.updateMatrix = function (xform) {
	var outputInitAnalysis = $('td[id=initAnalysis]'),
	    fabErrors,
	    scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
		starAligned = MLB.scopeToSky.starAligned,
	    notAvailable = scopeToSkyState.notAvailable,
	    positionDecimals = scopeToSkyState.positionDecimals,
		initAnalysis = scopeToSkyState.initAnalysis,
		inOutZ1 = scopeToSkyState.inOutZ1,
		inOutZ2 = scopeToSkyState.inOutZ2,
		inOutZ3 = scopeToSkyState.inOutZ3,
		inOutOne = scopeToSkyState.inOutOne,
		inOutTwo = scopeToSkyState.inOutTwo,
		inOutThree = scopeToSkyState.inOutThree,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom,
		positionDegToString = MLB.coordLib.positionDegToString;

	if (starAligned(xform)) {
		fabErrors = xform.cmws.fabErrors;
		inOutZ1().val(roundToDecimal(fabErrors.z1 / uom.degToRad, positionDecimals));
		inOutZ2().val(roundToDecimal(fabErrors.z2 / uom.degToRad, positionDecimals));
		inOutZ3().val(roundToDecimal(fabErrors.z3 / uom.degToRad, positionDecimals));
		inOutOne().val(positionDegToString(xform.cmws.one));
		inOutTwo().val(positionDegToString(xform.cmws.two));
		if (xform.cmws.init === 3) {
			inOutThree().val(positionDegToString(xform.cmws.three));
		} else {
			inOutThree().val('');
		}
		outputInitAnalysis.html('latitude: ' + roundToDecimal(initAnalysis.initLatitude / uom.degToRad, positionDecimals) + ', azimuth offset: ' + roundToDecimal(initAnalysis.azOffset / uom.degToRad, positionDecimals) + ', hour angle offset: ' + roundToDecimal(initAnalysis.HAOffset / uom.degToRad, positionDecimals));
	} else {
		inOutZ1().val(notAvailable);
		inOutZ2().val(notAvailable);
		inOutZ3().val(notAvailable);
		inOutOne().val(notAvailable);
		inOutTwo().val(notAvailable);
		inOutThree().val('');
		outputInitAnalysis.html(notAvailable);
	}
};

MLB.scopeToSky.updateInputIncludeCorrectionsBasedOnInputRAorHA = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    HA = scopeToSkyState.HA,
		no = scopeToSkyState.no,
		inputRAorHA = scopeToSkyState.inputRAorHA,
	    inputIncludeCorrections = scopeToSkyState.inputIncludeCorrections,
		HAChecked = inputRAorHA()[HA].checked;

	if (HAChecked) {
		inputIncludeCorrections()[no].checked = 'true';
	}
};

MLB.scopeToSky.getIncludeRefractionUpdateButton = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    yes = scopeToSkyState.yes,
	    no = scopeToSkyState.no,
		equatorial = scopeToSkyState.equatorial,
	    formulae = scopeToSkyState.formulae,
	    inputIncludeRefraction = scopeToSkyState.inputIncludeRefraction,
	    inputAlignment = scopeToSkyState.inputAlignment,
		inputTrackingRatesAlgorithm = scopeToSkyState.inputTrackingRatesAlgorithm,
		refractionChecked = inputIncludeRefraction()[yes].checked;

	if (refractionChecked && inputTrackingRatesAlgorithm()[formulae].checked && !inputAlignment()[equatorial].checked) {
		inputIncludeRefraction()[no].checked = 'true';
		return false;
	}
	return refractionChecked;
};

MLB.scopeToSky.updateCanFlipButton = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    yes = scopeToSkyState.yes,
	    inputCanFlipMeridian = scopeToSkyState.inputCanFlipMeridian,
		inputFlipped = scopeToSkyState.inputFlipped;

	if (inputFlipped()[yes].checked) {
		inputCanFlipMeridian()[yes].checked = 'true';
	}
};

MLB.scopeToSky.computeScope = function () {
	var includeRefraction,
	    startingRAHA,
		startingRA,
		startingDec,
		latitude,
		coordJD,
		pnaCorrections,
		correctedRA,
		correctedDec,
		xform,
		rates,
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
		setupXForm = MLB.scopeToSky.setupXForm,
		updateCorrections = MLB.scopeToSky.updateCorrections,
		updateRefraction = MLB.scopeToSky.updateRefraction,
		updateSiteAltaz = MLB.scopeToSky.updateSiteAltaz,
		updateTrackingRates = MLB.scopeToSky.updateTrackingRates,
		updateMatrix = MLB.scopeToSky.updateMatrix,
		updateInputIncludeCorrectionsBasedOnInputRAorHA = MLB.scopeToSky.updateInputIncludeCorrectionsBasedOnInputRAorHA,
		getIncludeRefractionUpdateButton = MLB.scopeToSky.getIncludeRefractionUpdateButton,
	    updateCanFlipButton = MLB.scopeToSky.updateCanFlipButton,
		yes = scopeToSkyState.yes,
		HA = scopeToSkyState.HA,
		inputRAorHA = scopeToSkyState.inputRAorHA,
		deltaTime = scopeToSkyState.deltaTime,
	    formulae = scopeToSkyState.formulae,
		positionDecimals = scopeToSkyState.positionDecimals,
		properMotion = scopeToSkyState.properMotion,
		HAOffset = scopeToSkyState.HAOffset,
		timeIntervalSecs = scopeToSkyState.timeIntervalSecs,
		JD = scopeToSkyState.JD,
		SidT = scopeToSkyState.SidT,
		trackingRates = scopeToSkyState.trackingRates,
	    inputIncludeCorrections = scopeToSkyState.inputIncludeCorrections,
		inputLatitude = scopeToSkyState.inputLatitude,
	    inputTrackingRatesAlgorithm = scopeToSkyState.inputTrackingRatesAlgorithm,
		inputRAHA = scopeToSkyState.inputRAHA,
		inputDec = scopeToSkyState.inputDec,
		inputCoordinateYear = scopeToSkyState.inputCoordinateYear,
		inOutScopeAzimuth = scopeToSkyState.inOutScopeAzimuth,
		inOutScopeAltitude = scopeToSkyState.inOutScopeAltitude,
		outputScopeFR = scopeToSkyState.outputScopeFR,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom,
		validRev = MLB.coordLib.validRev,
		calcJDFromJulianYear = MLB.coordLib.calcJDFromJulianYear,
		calcProperMotionPrecessionNutationAnnualAberration = MLB.coordLib.calcProperMotionPrecessionNutationAnnualAberration,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians;

	// update/read UI
	updateInputIncludeCorrectionsBasedOnInputRAorHA();
	includeRefraction = getIncludeRefractionUpdateButton();
	updateCanFlipButton();

	// read UI
	startingRAHA = parseCoordinateGetValueInRadians(inputRAHA().val(), true).radians;
	if (inputRAorHA()[HA].checked) {
		// SidT set in processDateTime() which is called from the button's click event
		startingRA = validRev(SidT - startingRAHA);

	} else {
		startingRA = startingRAHA;
	}
	startingDec = parseCoordinateGetValueInRadians(inputDec().val()).radians;
	latitude = parseCoordinateGetValueInRadians(inputLatitude().val()).radians;
	coordJD = calcJDFromJulianYear(+inputCoordinateYear().val());

	// coordinate corrections
	correctedRA = startingRA;
	correctedDec = startingDec;
	if (inputIncludeCorrections()[yes].checked) {
		pnaCorrections = calcProperMotionPrecessionNutationAnnualAberration(startingRA, startingDec, coordJD, JD, properMotion, properMotion);
		correctedRA += pnaCorrections.total.deltaRA;
		correctedDec += pnaCorrections.total.deltaDec;
	}

	// set xform
	xform = setupXForm(latitude);
	xform.position.SidT = SidT;
	xform.position.RA = correctedRA;
	xform.position.Dec = correctedDec;

	// scope tracking rates
	if (inputTrackingRatesAlgorithm()[deltaTime].checked) {
		rates = trackingRates.getRatesViaDeltaTime(xform, timeIntervalSecs, HAOffset, includeRefraction);
	} else if (inputTrackingRatesAlgorithm()[formulae].checked) {
		rates = trackingRates.getRatesViaFormulae(xform, timeIntervalSecs, HAOffset, includeRefraction);
	}

	// update UI
	updateCorrections(pnaCorrections, correctedRA, correctedDec);
	updateRefraction(includeRefraction, rates.refractionResults);
	updateSiteAltaz(rates.siteAz, rates.siteAlt);
	updateTrackingRates(rates);
	updateMatrix(xform);
	// update UI individual fields
	inOutScopeAzimuth().val(roundToDecimal(rates.initialAz / uom.degToRad, positionDecimals));
	inOutScopeAltitude().val(roundToDecimal(rates.initialAlt / uom.degToRad, positionDecimals));
	outputScopeFR().html(roundToDecimal(rates.initialFR / uom.degToRad, positionDecimals));
};

MLB.scopeToSky.computeEquatCoords = function () {
	var includeRefraction,
		latitude,
		coordJD,
		pnaCorrections,
		refractionResults,
		refractedRA,
		refractedDec,
		startingRA,
		startingDec,
		xform,
		rates,
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    setupXForm = MLB.scopeToSky.setupXForm,
	    updateCorrections = MLB.scopeToSky.updateCorrections,
	    updateRefraction = MLB.scopeToSky.updateRefraction,
	    updateSiteAltaz = MLB.scopeToSky.updateSiteAltaz,
	    updateTrackingRates = MLB.scopeToSky.updateTrackingRates,
	    updateMatrix = MLB.scopeToSky.updateMatrix,
		updateInputIncludeCorrectionsBasedOnInputRAorHA = MLB.scopeToSky.updateInputIncludeCorrectionsBasedOnInputRAorHA,
	    getIncludeRefractionUpdateButton = MLB.scopeToSky.getIncludeRefractionUpdateButton,
	    updateCanFlipButton = MLB.scopeToSky.updateCanFlipButton,
		yes = scopeToSkyState.yes,
		HA = scopeToSkyState.HA,
		inputRAorHA = scopeToSkyState.inputRAorHA,
	    deltaTime = scopeToSkyState.deltaTime,
	    formulae = scopeToSkyState.formulae,
		limitToHundredthsArcsec = scopeToSkyState.limitToHundredthsArcsec,
		limitToTenthsArcsec = scopeToSkyState.limitToTenthsArcsec,
		positionDecimals = scopeToSkyState.positionDecimals,
		properMotion = scopeToSkyState.properMotion,
		HAOffset = scopeToSkyState.HAOffset,
		timeIntervalSecs = scopeToSkyState.timeIntervalSecs,
		JD = scopeToSkyState.JD,
		SidT = scopeToSkyState.SidT,
		trackingRates = scopeToSkyState.trackingRates,
	    refractPosition = scopeToSkyState.refractPosition,
		inputIncludeCorrections = scopeToSkyState.inputIncludeCorrections,
		inputLatitude = scopeToSkyState.inputLatitude,
	    inputTrackingRatesAlgorithm = scopeToSkyState.inputTrackingRatesAlgorithm,
		inputRAHA = scopeToSkyState.inputRAHA,
		inputDec = scopeToSkyState.inputDec,
		inputCoordinateYear = scopeToSkyState.inputCoordinateYear,
		inOutScopeAzimuth = scopeToSkyState.inOutScopeAzimuth,
		inOutScopeAltitude = scopeToSkyState.inOutScopeAltitude,
		outputScopeFR = scopeToSkyState.outputScopeFR,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom,
		validRev = MLB.coordLib.validRev,
		convertRadiansToHMSMString = MLB.coordLib.convertRadiansToHMSMString,
		convertRadiansToDMSMString = MLB.coordLib.convertRadiansToDMSMString,
		calcJDFromJulianYear = MLB.coordLib.calcJDFromJulianYear,
		calcProperMotionPrecessionNutationAnnualAberration = MLB.coordLib.calcProperMotionPrecessionNutationAnnualAberration,
		parseCoordinateGetValueInRadians = MLB.coordLib.parseCoordinateGetValueInRadians,
		calcRefractionFromApparentEquatorialCorrection = MLB.coordLib.calcRefractionFromApparentEquatorialCorrection;

	// update/read UI
	updateInputIncludeCorrectionsBasedOnInputRAorHA();
	includeRefraction = getIncludeRefractionUpdateButton();
	updateCanFlipButton();

	// read UI
	latitude = parseCoordinateGetValueInRadians(inputLatitude().val()).radians;
	coordJD = calcJDFromJulianYear(+inputCoordinateYear().val());

	// set xform
	xform = setupXForm(latitude);
	xform.position.az = parseCoordinateGetValueInRadians(inOutScopeAzimuth().val()).radians;
	xform.position.alt = parseCoordinateGetValueInRadians(inOutScopeAltitude().val()).radians;
	xform.position.SidT = SidT;

	// get equatorial coordinates
	xform.getEquat();

	// refraction
	if (includeRefraction) {
		refractionResults = calcRefractionFromApparentEquatorialCorrection(xform.position.RA, xform.position.Dec, xform.position.SidT, xform.latitude, refractPosition);
		xform.position.RA += refractionResults.deltaRA;
		xform.position.Dec += refractionResults.deltaDec;
	}

	// coordinate corrections
	refractedRA = xform.position.RA;
	refractedDec = xform.position.Dec;
	startingRA = xform.position.RA;
	startingDec = xform.position.Dec;
	if (inputIncludeCorrections()[yes].checked) {
		pnaCorrections = calcProperMotionPrecessionNutationAnnualAberration(refractedRA, refractedDec, coordJD, JD, properMotion, properMotion);
		startingRA -= pnaCorrections.total.deltaRA;
		startingDec -= pnaCorrections.total.deltaDec;
	}

	// scope tracking rates
	// xform set to refracted equatorial position
	if (inputTrackingRatesAlgorithm()[deltaTime].checked) {
		rates = trackingRates.getRatesViaDeltaTime(xform, timeIntervalSecs, HAOffset, includeRefraction);
	} else if (inputTrackingRatesAlgorithm()[formulae].checked) {
		rates = trackingRates.getRatesViaFormulae(xform, timeIntervalSecs, HAOffset);
	}

	// update UI
	// RA, Dec comes from the scope axes positions so do not use startingRA/Dec, instead use refractedRA/Dec
	updateCorrections(pnaCorrections, refractedRA, refractedDec);
	updateRefraction(includeRefraction, rates.refractionResults);
	updateSiteAltaz(rates.siteAz, rates.siteAlt);
	updateTrackingRates(rates);
	updateMatrix(xform);
	// update UI individual fields
	outputScopeFR().html(roundToDecimal(rates.initialFR / uom.degToRad, positionDecimals));

	if (inputRAorHA()[HA].checked) {
		inputRAHA().val(convertRadiansToHMSMString(validRev(SidT - startingRA), limitToHundredthsArcsec));
	} else {
		inputRAHA().val(convertRadiansToHMSMString(startingRA, limitToHundredthsArcsec));
	}
	inputDec().val(convertRadiansToDMSMString(startingDec, limitToTenthsArcsec));
};

MLB.scopeToSky.readAnalysisPositions = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    analysisPositionSubString = scopeToSkyState.analysisPositionSubString,
		analysisPositionsSize = scopeToSkyState.analysisPositionsSize,
		analysisPositions = scopeToSkyState.analysisPositions,
		setPositionDegFromString = MLB.coordLib.setPositionDegFromString,
	    ix,
		ax,
		readString;

	for (ix = 0; ix < analysisPositionsSize; ix++) {
		ax = ix + 1;
		readString = $('input[name=' + analysisPositionSubString + ax + ']\'').val();
		setPositionDegFromString(readString, analysisPositions[ix]);
	}
};

MLB.scopeToSky.loadTakiTestData = function () {
	var data,
	    ix,
		ax,
		dx,
	    scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    analysisPositionSubString = scopeToSkyState.analysisPositionSubString,
		analysisPositionsSize = scopeToSkyState.analysisPositionsSize,
	    inOutZ1 = scopeToSkyState.inOutZ1,
	    inOutZ2 = scopeToSkyState.inOutZ2,
	    inOutZ3 = scopeToSkyState.inOutZ3,
	    inOutOne = scopeToSkyState.inOutOne,
	    inOutTwo = scopeToSkyState.inOutTwo;

	// formatted Taki data: 1st positions from Taki, last 3 positions generated from earlier software given Taki's z1=-.04, z2=.4, z3=-1.63
	data = [
		' 79.172    45.998   320.1     39.9     9.827 ',
		' 37.96     89.264   265.4     36.2    10.103 ',
		' 71.53     17.07      0.015   40.31   15.542 ',
		' 45.221   -41.564    60       10       9.827 ',
		'  5.885    24       120       80      11.281 '
	];

	inOutZ1().val('-0.04');
	inOutZ2().val('0.4');
	inOutZ3().val('-1.63');
	inOutOne().val(data[0]);
	inOutTwo().val(data[1]);

	for (ix = 0; ix < analysisPositionsSize; ix++) {
		ax = ix + 1;
		dx = ix + 2;
		$('input[name=' + analysisPositionSubString + ax + ']').val(data[ix + 2]);
	}
};

MLB.scopeToSky.getValidPositions = function () {
	var validPositions = [],
	    ix,
	    scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    analysisPositionsSize = scopeToSkyState.analysisPositionsSize,
		analysisPositions = scopeToSkyState.analysisPositions,
		isValidPosition = MLB.coordLib.isValidPosition;

	for (ix = 0; ix < analysisPositionsSize; ix++) {
		if (isValidPosition(analysisPositions[ix])) {
			validPositions.push(analysisPositions[ix]);
		}
	}
	return validPositions;
};

MLB.scopeToSky.calcAndDisplayBestZ123 = function () {
	var bestZ123,
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
		readAnalysisPositions = MLB.scopeToSky.readAnalysisPositions,
		getValidPositions = MLB.scopeToSky.getValidPositions,
	    matrix = scopeToSkyState.matrix,
		positionDecimals = scopeToSkyState.positionDecimals,
		xform = scopeToSkyState.xform,
		inputConversionStyle = scopeToSkyState.inputConversionStyle,
		notAvailable = scopeToSkyState.notAvailable,
		outputFabErrors = scopeToSkyState.outputFabErrors,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom;

	if (inputConversionStyle()[matrix].checked) {
		readAnalysisPositions();
		scopeToSkyState.bestZ123 = xform.bestZ123(getValidPositions());
		bestZ123 = scopeToSkyState.bestZ123;
		outputFabErrors().html('axes misalignment: ' + roundToDecimal(bestZ123.z1 / uom.degToRad, positionDecimals) + ', azimuth offset: ' + roundToDecimal(bestZ123.z2 / uom.degToRad, positionDecimals) + ', altitude offset: ' + roundToDecimal(bestZ123.z3 / uom.degToRad, positionDecimals));
	} else {
		outputFabErrors().html(notAvailable);
	}
};

MLB.scopeToSky.calcAndDisplayBestZ13 = function () {
	var bestZ123,
	    scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    readAnalysisPositions = MLB.scopeToSky.readAnalysisPositions,
	    getValidPositions = MLB.scopeToSky.getValidPositions,
	    matrix = scopeToSkyState.matrix,
		positionDecimals = scopeToSkyState.positionDecimals,
		xform = scopeToSkyState.xform,
		inputConversionStyle = scopeToSkyState.inputConversionStyle,
		notAvailable = scopeToSkyState.notAvailable,
		outputFabErrors = scopeToSkyState.outputFabErrors,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		uom = MLB.sharedLib.uom;

	if (inputConversionStyle()[matrix].checked) {
		readAnalysisPositions();
		scopeToSkyState.bestZ123 = xform.bestZ13(getValidPositions());
		bestZ123 = scopeToSkyState.bestZ123;
		outputFabErrors().html('axes misalignment: ' + roundToDecimal(bestZ123.z1 / uom.degToRad, positionDecimals) + ', altitude offset: ' + roundToDecimal(bestZ123.z3 / uom.degToRad, positionDecimals));
	} else {
		outputFabErrors().html(notAvailable);
	}
};

MLB.scopeToSky.processDateTime = function () {
	var scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    yes = scopeToSkyState.yes,
	    inputUseCurrentDateTime = scopeToSkyState.inputUseCurrentDateTime,
		inputDateTime = scopeToSkyState.inputDateTime,
		inputTimeZone = scopeToSkyState.inputTimeZone,
		inputLongitude = scopeToSkyState.inputLongitude,
		outputJD = $('td[id=JD]'),
		outputSidT = $('td[id=SidT]'),
		date = scopeToSkyState.date,
		convertRadiansToHMSString = MLB.coordLib.convertRadiansToHMSString,
		dateFromString = MLB.coordLib.dateFromString,
		dateToString = MLB.coordLib.dateToString,
		calcJD = MLB.coordLib.calcJD,
		calcSidTFromJD = MLB.coordLib.calcSidTFromJD;

	// setup: datetime input
	if (inputUseCurrentDateTime()[yes].checked) {
		date = new Date();
		inputDateTime().val(dateToString(date));
	}
	// setup: datetime display
	date = dateFromString(inputDateTime().val());
	scopeToSkyState.JD = calcJD(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), inputTimeZone().val());
	scopeToSkyState.SidT = calcSidTFromJD(scopeToSkyState.JD, +inputLongitude().val());
	outputJD.html(scopeToSkyState.JD);
	outputSidT.html(convertRadiansToHMSString(scopeToSkyState.SidT));
};

MLB.scopeToSky.setInitialValues = function () {
	var startingLatitudeDeg = 40,
		startingDecDeg = 0,
		startingCoordYr = 2000,
		btnComputeTelescope = $('input[id=btnComputeTelescope]'),
		btnComputeEquatCoords = $('input[id=btnComputeEquatCoords]'),
		btnInitMatrix = $('input[id=btnInitMatrix]'),
		btnBestZ123 = $('input[id=btnBestZ123]'),
		btnBestZ13 = $('input[id=btnBestZ13]'),
		btnLoadTaki = $('input[id=btnLoadTaki]'),
		dst,
		startingRA,
		scopeToSkyState = MLB.scopeToSky.scopeToSkyState,
	    computeScope = MLB.scopeToSky.computeScope,
		computeEquatCoords = MLB.scopeToSky.computeEquatCoords,
		loadTakiTestData = MLB.scopeToSky.loadTakiTestData,
		calcAndDisplayBestZ123 = MLB.scopeToSky.calcAndDisplayBestZ123,
		calcAndDisplayBestZ13 = MLB.scopeToSky.calcAndDisplayBestZ13,
		processDateTime = MLB.scopeToSky.processDateTime,
		yes = scopeToSkyState.yes,
		RA = scopeToSkyState.RA,
		matrix = scopeToSkyState.matrix,
		star = scopeToSkyState.star,
		deltaTime = scopeToSkyState.deltaTime,
	    altazimuth = scopeToSkyState.altazimuth,
		forceAlignment = scopeToSkyState.forceAlignment,
		limitToHundredthsArcsec = scopeToSkyState.limitToHundredthsArcsec,
		limitToTenthsArcsec = scopeToSkyState.limitToTenthsArcsec,
		date = scopeToSkyState.date,
		inputRAorHA = scopeToSkyState.inputRAorHA,
		inputIncludeCorrections = scopeToSkyState.inputIncludeCorrections,
		inputUseCurrentDateTime = scopeToSkyState.inputUseCurrentDateTime,
		inputDateTime = scopeToSkyState.inputDateTime,
		inputTimeZone = scopeToSkyState.inputTimeZone,
		inputLatitude = scopeToSkyState.inputLatitude,
		inputLongitude = scopeToSkyState.inputLongitude,
		inputIncludeRefraction = scopeToSkyState.inputIncludeRefraction,
		inputAlignment = scopeToSkyState.inputAlignment,
		inputConversionStyle = scopeToSkyState.inputConversionStyle,
		inputTrackingRatesAlgorithm = scopeToSkyState.inputTrackingRatesAlgorithm,
		inputRAHA = scopeToSkyState.inputRAHA,
		inputDec = scopeToSkyState.inputDec,
		inputCoordinateYear = scopeToSkyState.inputCoordinateYear,
		int = MLB.sharedLib.int,
		uom = MLB.sharedLib.uom,
		convertRadiansToHMSString = MLB.coordLib.convertRadiansToHMSString,
		convertRadiansToDMSMString = MLB.coordLib.convertRadiansToDMSMString,
		dateToString = MLB.coordLib.dateToString;

	// event hookups/subscribes
	btnComputeTelescope.click(function () {
		processDateTime();
		computeScope();
	});

	btnComputeEquatCoords.click(function () {
		processDateTime();
		computeEquatCoords();
	});

	btnInitMatrix.click(function () {
		// ensure that matrix xform will be used
		inputConversionStyle()[matrix].checked = 'true';
		inputAlignment()[star].checked = 'true';
		scopeToSkyState.lastAlignment = forceAlignment;
		processDateTime();
		computeScope();
	});

	btnBestZ123.click(function () {
		calcAndDisplayBestZ123();
	});

	btnBestZ13.click(function () {
		calcAndDisplayBestZ13();
	});

	btnLoadTaki.click(function () {
		loadTakiTestData();
	});

	inputRAorHA()[RA].checked = 'true';
	inputIncludeCorrections()[yes].checked = 'true';
	inputUseCurrentDateTime()[yes].checked = 'true';
	inputIncludeRefraction()[yes].checked = 'true';
	inputAlignment()[altazimuth].checked = 'true';
	inputConversionStyle()[matrix].checked = 'true';
	inputTrackingRatesAlgorithm()[deltaTime].checked = 'true';

	inputDateTime().val(dateToString(date));
    inputTimeZone().val(-date.getTimezoneOffset() / 60);
	inputLatitude().val(startingLatitudeDeg);
	dst = date.toString().indexOf('Daylight') > -1;
	inputLongitude().val(+inputTimeZone().val() * 15 - (dst ? 15 : 0));

	processDateTime();

	// Coordinates: input
	// nearest whole number hour
	startingRA = int(scopeToSkyState.SidT / uom.hrToRad) * uom.hrToRad;
	inputRAHA().val(convertRadiansToHMSString(startingRA, limitToHundredthsArcsec));
	inputDec().val(convertRadiansToDMSMString(startingDecDeg, limitToTenthsArcsec));
	inputCoordinateYear().val(startingCoordYr);
};

$(window).ready(function () {
	var computeScope = MLB.scopeToSky.computeScope,
	    setInitialValues = MLB.scopeToSky.setInitialValues;

	setInitialValues();
	computeScope();
});

// end of file