// copyright Mel Bartels, 2011-2012
// see calcLib unitTests.htm for unit tests
// turn on jslint's Tolerate ++ and --

// sagitta

'use strict';

MLB.calcLib = {};

MLB.calcLib.calcSagitta = function (mirrorDia, focalRatio) {
	var twiceFocalRatio,
	    mirrorRadius;

	twiceFocalRatio = focalRatio * 2;
	mirrorRadius = mirrorDia / 2;
	return mirrorDia * twiceFocalRatio - Math.sqrt(mirrorDia * twiceFocalRatio * mirrorDia * twiceFocalRatio - mirrorRadius * mirrorRadius);
};

// above formula is for parabolic curves, this formula is for spherical curves
MLB.calcLib.calcSagittaSpherical = function (mirrorDia, focalRatio) {
	var mirrorRadius = mirrorDia / 2,
	    focalLength = mirrorDia * focalRatio;

	return mirrorRadius * mirrorRadius / (4 * focalLength);
};

MLB.calcLib.calcFocalRatio = function (mirrorDia, sagitta) {
	var mirrorRadius = mirrorDia / 2;

	return (sagitta * sagitta + mirrorRadius * mirrorRadius) / (8 * sagitta * mirrorRadius);
};

MLB.calcLib.calcFocalRatioFromSphericalSagitta = function (mirrorDia, sphericalSagitta) {
	return mirrorDia / (16 * sphericalSagitta);
};

// diagonal off-axis illumination; sources are mid-70's Sky and Telescope article on diagonal size and Telescope Making #9, pg. 11 on diagonal offset.

MLB.calcLib.calcOffAxisIllumination = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, offAxisDistance) {
	var r,
	    x,
		a,
		c;

	r = diagSize * focalLen / (diagToFocalPlaneDistance * mirrorDia);
	x = 2 * offAxisDistance * (focalLen - diagToFocalPlaneDistance) / (diagToFocalPlaneDistance * mirrorDia);
	a = (x * x + 1 - r * r) / (2 * x);
	if (a < -1) {
		return 1;
	}
	if (a > 1) {
		return 0;
	}
	c = (x * x + r * r - 1) / (2 * x * r);
	return (Math.acos(a) - x * Math.sqrt(1 - a * a) + r * r * Math.acos(c)) / Math.PI;
};

// < 1.0 illumination results in a positive magnitude drop
MLB.calcLib.magnitudeDrop = function (illumination) {
	var log10 = MLB.sharedLib.log10;

	return -2.5 * log10(illumination);
};

// aperture2 > aperture1 results in a negative magnitude difference
MLB.calcLib.magnitudeDifferenceBetweenApertures = function (aperture1, aperture2) {
	return MLB.calcLib.magnitudeDrop(aperture2 * aperture2 / aperture1 / aperture1);
};

MLB.calcLib.inverseMagnitudeDrop = function (value) {
	return Math.pow(10, -0.4 * value);
};

MLB.calcLib.diagObstructionArea = function (mirrorDia, diagSize) {
	return diagSize / mirrorDia * diagSize / mirrorDia;
};

// diagonal offset at right angle to focal plane: need to offset away from focuser and again towards the primary mirror;
// this formula appears more accurate as determined by a CAD program;
// from http://www.telescope-optics.net/newtonian.htm
MLB.calcLib.calcDiagOffset = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance) {
	return (mirrorDia - diagSize) * diagSize / (4 * (focalLen - diagToFocalPlaneDistance));
};

// from an old Sky and Telescope magazine article
MLB.calcLib.calcDiagOffset2 = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance) {
	var sagitta,
	    focalRatio,
		fullyIllumFieldDia,
		p,
		q,
		r,
		n,
		f,
		calcSagitta = MLB.calcLib.calcSagitta;

	sagitta = calcSagitta(mirrorDia, focalLen / mirrorDia);
	focalRatio = focalLen / mirrorDia;
	fullyIllumFieldDia = diagSize - diagToFocalPlaneDistance / focalRatio;
	p = fullyIllumFieldDia * (focalLen - sagitta) + diagToFocalPlaneDistance * (mirrorDia - fullyIllumFieldDia);
	q = 2 * (focalLen - sagitta) - (mirrorDia - fullyIllumFieldDia);
	r = 2 * (focalLen - sagitta) + (mirrorDia - fullyIllumFieldDia);
	n = p / q;
	f = p / r;
	return (f - n) / 2;
};

MLB.calcLib.getDiagIllumArray = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, increment, maxField) {
	var roundedMaxField,
	    fieldRadius,
		steps,
		illumArray,
		ix,
		offAxisDistance,
		offAxisIllumination,
		int = MLB.sharedLib.int,
		resolveNumberToPrecision = MLB.sharedLib.resolveNumberToPrecision,
		calcOffAxisIllumination = MLB.calcLib.calcOffAxisIllumination;

	roundedMaxField = resolveNumberToPrecision(maxField + increment, increment);
	fieldRadius = roundedMaxField / 2;
	steps = int(fieldRadius / increment);
	illumArray = [];
	for (ix = 0; ix <= steps; ix++) {
		offAxisDistance = increment * ix;
		offAxisIllumination = calcOffAxisIllumination(mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance, offAxisDistance);
		illumArray[steps + ix] = [offAxisDistance, offAxisIllumination];
		illumArray[steps - ix] = [-offAxisDistance, offAxisIllumination];
	}
	return illumArray;
};

// folded Newtonian

MLB.calcLib.calcFoldedNewtonian = function (mirrorDia, focalRatio, diagSize, focalPlaneToTertiaryDistance) {
	var diagToMirrorDistance,
	    eyepieceToMirrorDistance,
		diagTooSmall,
		diagTooLarge,
		elbowAngleRad,
		elbowAngleDeg,
		diagMajorAxisSize,
		uom = MLB.sharedLib.uom;

	if (mirrorDia === 0 || focalRatio === 0 || diagSize === 0) {
		return;
	}

	diagToMirrorDistance = focalRatio * (mirrorDia - diagSize);
	eyepieceToMirrorDistance = diagToMirrorDistance - Math.sqrt(Math.pow(diagSize * focalRatio - focalPlaneToTertiaryDistance, 2) - Math.pow(mirrorDia / 2, 2));

	diagTooSmall = isNaN(diagToMirrorDistance) || isNaN(eyepieceToMirrorDistance);
	diagTooLarge = diagSize > mirrorDia / 2;

	// for traditional Newtonian diagonal, optical axis reflected at angle = 90 degree, diagonal mirror at angle of half that = 45 degree
	// for a flat reflecting light back to primary, both optical axis angle and diagonal mirror angle = 0 degrees
	elbowAngleRad = uom.oneRev / 4 - Math.atan((diagToMirrorDistance - eyepieceToMirrorDistance) / (mirrorDia / 2));
	elbowAngleDeg = elbowAngleRad / uom.degToRad;
	diagMajorAxisSize = diagSize / Math.cos(elbowAngleRad / 2);

	if (diagTooSmall || diagTooLarge) {
		diagToMirrorDistance = 0;
		eyepieceToMirrorDistance = 0;
	}

	return {
		diagTooSmall: diagTooSmall,
		diagTooLarge: diagTooLarge,
		diagToMirrorDistance: diagToMirrorDistance,
		eyepieceToMirrorDistance: eyepieceToMirrorDistance,
		elbowAngleDeg: elbowAngleDeg,
		diagMajorAxisSize: diagMajorAxisSize
	};
};

// visual detection calculator

MLB.calcLib.limitingMagnitude = function (apertureIn) {
	var log10 = MLB.sharedLib.log10;

	// from http://adsabs.harvard.edu/full/1947PASP...59..253B
	// assumes 2 mag gain due to high magnification; no gain in limiting magnitude below 1.8mm exit pupil, 'RFT' exit pupil lowers limiting magnitude ~1
	return 10.8 + 5 * log10(apertureIn);
};

MLB.calcLib.VisualDetectCalcParms = function () {
	this.apertureIn = 0;
	this.bkgndBrightEye = 0;
	this.objName = "";
	this.objMag = 0;
	this.maxObjArcmin = 0;
	this.minObjArcmin = 0;
	this.eyepieceExitPupilmm = 0;
	this.apparentFoV = 0;
	this.eyeLimitMag = 6;
	this.exitPupilmm = 7;
	this.scopeTrans = 0.8;
	this.singleEyeFactor = 0.5;

	this.copyFrom = function () {
		var to = new MLB.calcLib.VisualDetectCalcParms(),
			v;
		for (v in this) {
			if (this.hasOwnProperty(v)) {
				to[v] = this[v];
			}
		}
		return to;
	};
};

MLB.calcLib.visualDetectCalcData = {
	angleSize: 7,
	ltcSize: 24,
	firstRowBkgndBright: 4,
	lastRowBkgndBright: 27,
	eyeLimitMagGainAtX: 2.5,

	logAngle: [-0.2255, 0.5563, 0.9859, 1.260, 1.742, 2.083, 2.556],

	// log threshold contrast as function of background brightness for angles of: 0.595, 3.60, 9.68, 18.2, 55.2, 121, 360
	// 0 to 23: first row is brightness of 4, last row is brightness of 27
	ltc: [
		[-0.3769, -1.8064, -2.3368, -2.4601, -2.5469, -2.5610, -2.5660],
		[-0.3315, -1.7747, -2.3337, -2.4608, -2.5465, -2.5607, -2.5658],
		[-0.2682, -1.7345, -2.3310, -2.4605, -2.5467, -2.5608, -2.5658],
		[-0.1982, -1.6851, -2.3140, -2.4572, -2.5481, -2.5615, -2.5665],
		[-0.1238, -1.6252, -2.2791, -2.4462, -2.5463, -2.5597, -2.5646],
		[-0.0424, -1.5529, -2.2297, -2.4214, -2.5343, -2.5501, -2.5552],
		[0.0498, -1.4655, -2.1659, -2.3763, -2.5047, -2.5269, -2.5333],
		[0.1596, -1.3581, -2.0810, -2.3036, -2.4499, -2.4823, -2.4937],
		[0.2934, -1.2256, -1.9674, -2.1965, -2.3631, -2.4092, -2.4318],
		[0.4557, -1.0673, -1.8186, -2.0531, -2.2445, -2.3083, -2.3491],
		[0.6500, -0.8841, -1.6292, -1.8741, -2.0989, -2.1848, -2.2505],
		[0.8808, -0.6687, -1.3967, -1.6611, -1.9284, -2.0411, -2.1375],
		[1.1558, -0.3952, -1.1264, -1.4176, -1.7300, -1.8727, -2.0034],
		[1.4822, -0.0419, -0.8243, -1.1475, -1.5021, -1.6768, -1.8420],
		[1.8559, 0.3458, -0.4924, -0.8561, -1.2661, -1.4721, -1.6624],
		[2.2669, 0.6960, -0.1315, -0.5510, -1.0562, -1.2892, -1.4827],
		[2.6760, 1.0880, 0.2060, -0.3210, -0.8800, -1.1370, -1.3620],
		[2.7766, 1.2065, 0.3467, -0.1377, -0.7361, -0.9964, -1.2439],
		[2.9304, 1.3821, 0.5353, 0.0328, -0.5605, -0.8606, -1.1187],
		[3.1634, 1.6107, 0.7708, 0.2531, -0.3895, -0.7030, -0.9681],
		[3.4643, 1.9034, 1.0338, 0.4943, -0.2033, -0.5259, -0.8288],
		[3.8211, 2.2564, 1.3265, 0.7605, 0.0172, -0.2992, -0.6394],
		[4.2210, 2.6320, 1.6990, 1.1320, 0.2860, -0.0510, -0.4080],
		[4.6100, 3.0660, 2.1320, 1.5850, 0.6520, 0.2410, -0.1210]
	]
};

MLB.calcLib.VisualDetectCalc = function () {
	var x,
	    minX,
		maxXMaxObj,
		maxXMinObj,
		maxXBasedOn1MmExitPupil,
		actualFoV,
		fitsFoV,
		singleEyeMagChange,
		scopeTransMagChange,
		limitMag,
		surfBrightObj,
		logContrastObject,
		brightReductionAtX,
		bkgndBrightAtX,
		surfBrightObjAtX,
		objPlusBkgnd,
		surfBrightObjPlusBkgndAtX,
		apparentAngle,
		logApparentAngle,
		bbX,
		intbbX,
		bbIxA,
		bbIxB,
		ix,
		interpAngle,
		interpA,
		interpB,
		logContrastRequired,
		logContrastDiff,
		detectable,
		int = MLB.sharedLib.int,
		log10 = MLB.sharedLib.log10,
		uom = MLB.sharedLib.uom,
		magnitudeDrop = MLB.calcLib.magnitudeDrop,
		inverseMagnitudeDrop = MLB.calcLib.inverseMagnitudeDrop,
		visualDetectCalcData = MLB.calcLib.visualDetectCalcData;

	this.data = visualDetectCalcData;

	this.calc = function (parms) {
		// magnifications
		x = parms.apertureIn * 25.4 / parms.eyepieceExitPupilmm;
		minX = parms.apertureIn * 25.4 / parms.exitPupilmm;
		maxXMaxObj = parms.apparentFoV / (parms.minObjArcmin / 60);
		maxXMinObj = parms.apparentFoV / (parms.maxObjArcmin / 60);
		maxXBasedOn1MmExitPupil = 25.4 * parms.apertureIn;
		if (maxXMaxObj > maxXBasedOn1MmExitPupil) {
			maxXMaxObj = maxXBasedOn1MmExitPupil;
		}
		if (maxXMinObj > maxXBasedOn1MmExitPupil) {
			maxXMinObj = maxXBasedOn1MmExitPupil;
		}
		// fields of view
		actualFoV = parms.apparentFoV / x;
		fitsFoV = x <= maxXMaxObj;
		// magnitude drops
		singleEyeMagChange = magnitudeDrop(parms.singleEyeFactor);
		scopeTransMagChange = magnitudeDrop(parms.scopeTrans);
		limitMag = parms.eyeLimitMag + this.data.eyeLimitMagGainAtX - magnitudeDrop(minX * minX) - singleEyeMagChange;
		// object brightness
		surfBrightObj = parms.objMag - magnitudeDrop(uom.sqrArcminToSqrArcsec * parms.minObjArcmin * parms.maxObjArcmin);
		logContrastObject = -0.4 * (surfBrightObj - parms.bkgndBrightEye);
		// brightness reduction due to magnification
		brightReductionAtX = -2 * magnitudeDrop(x / minX);
		bkgndBrightAtX = parms.bkgndBrightEye + brightReductionAtX + singleEyeMagChange + scopeTransMagChange;
		surfBrightObjAtX = magnitudeDrop(inverseMagnitudeDrop(surfBrightObj)) + brightReductionAtX + singleEyeMagChange + scopeTransMagChange;
		// surface brightness of object + background brightness 
		objPlusBkgnd = inverseMagnitudeDrop(surfBrightObj) + inverseMagnitudeDrop(parms.bkgndBrightEye);
		surfBrightObjPlusBkgndAtX = magnitudeDrop(objPlusBkgnd) + brightReductionAtX;
		// 2 dimensional interpolation of LTC array 
		apparentAngle = x * parms.minObjArcmin;
		logApparentAngle = log10(apparentAngle);
		bbX = bkgndBrightAtX;
		// int of background brightness 
		intbbX = int(bbX);
		// background brightness index A 
		bbIxA = intbbX - this.data.firstRowBkgndBright;
		// min index must be at least 0 
		if (bbIxA < 0) {
			bbIxA = 0;
		}
		// max bbIxA index cannot > 22 to leave room for bbIxB 
		if (bbIxA > this.data.ltcSize - 2) {
			bbIxA = this.data.ltcSize - 2;
		}
		// background brightness index B 
		bbIxB = bbIxA + 1;
		ix = 0;
		while (ix < this.data.angleSize && logApparentAngle > this.data.logAngle[ix]) {
			ix++;
		}
		// found 1st Angle[] value > logApparentAngle, so back up 2 
		ix -= 2;
		if (ix < 0) {
			ix = 0;
			logApparentAngle = this.data.logAngle[0];
		}
		// eg, if LogApparentAngle = 4 and Angle[ix] = 3 and Angle[ix+1] = 5: * InterpAngle = .5, or .5 of the way between Angle[ix] and Angle[ix+1] 
		interpAngle = (logApparentAngle - this.data.logAngle[ix]) / (this.data.logAngle[ix + 1] - this.data.logAngle[ix]);
		interpA = this.data.ltc[bbIxA][ix] + interpAngle * (this.data.ltc[bbIxA][ix + 1] - this.data.ltc[bbIxA][ix]);
		interpB = this.data.ltc[bbIxB][ix] + interpAngle * (this.data.ltc[bbIxB][ix + 1] - this.data.ltc[bbIxB][ix]);
		// log contrast
		if (bbX < this.data.firstRowBkgndBright) {
			bbX = this.data.firstRowBkgndBright;
		}
		if (intbbX >= this.data.lastRowBkgndBright) {
			logContrastRequired = interpB + (bbX - this.data.lastRowBkgndBright) * (interpB - interpA);
		} else {
			logContrastRequired = interpA + (bbX - intbbX) * (interpB - interpA);
		}
		logContrastDiff = logContrastObject - logContrastRequired;
		detectable = logContrastDiff > 0;

		return {
			parms: parms,
			limitMag: limitMag,
			logContrastDiff: logContrastDiff,
			logContrastObject: logContrastObject,
			logContrastRequired: logContrastRequired,
			detectable: detectable,
			x: x,
			minX: minX,
			maxXMaxObj: maxXMaxObj,
			maxXMinObj: maxXMinObj,
			fitsFoV: fitsFoV,
			actualFoV: actualFoV,
			scopeTransMagChange: scopeTransMagChange,
			singleEyeMagChange: singleEyeMagChange,
			surfBrightObj: surfBrightObj,
			brightReductionAtX: brightReductionAtX,
			bkgndBrightAtX: bkgndBrightAtX,
			surfBrightObjAtX: surfBrightObjAtX,
			surfBrightObjPlusBkgndAtX: surfBrightObjPlusBkgndAtX
		};
	};

	this.includeResultAsString = function (result) {
		var r,
		    p,
			s;

		r = result;
		p = r.parms;
		s =
			'input values:\n' +
			'  aperture (in)                ' + p.apertureIn + '\n' +
			'  eye limiting magnitude       ' + p.eyeLimitMag + '\n' +
			'  eye max exit pupil mm        ' + p.exitPupilmm + '\n' +
			'  sky background brightness    ' + p.bkgndBrightEye + '\n' +
			'  object name                  ' + p.objName + '\n' +
			'  object integrated magnitude  ' + p.objMag + '\n' +
			'  object dimensions            ' + p.maxObjArcmin + ' x ' + p.minObjArcmin + '\n' +
			'  eyepiece apparent field deg  ' + p.apparentFoV + '\n' +
			'calculated values:\n' +
			'  magnification                ' + Math.round(r.x) + '\n' +
			'  minimum useful X             ' + Math.round(r.minX) + '\n' +
			'  maximum useful X varies from ' + Math.round(r.maxXMinObj) + ' to ' + Math.round(r.maxXMaxObj) + '\n' +
			'  actual field deg             ' + r.actualFoV + '\n' +
			'  object fits FoV?             ' + r.fitsFoV + '\n' +
			'  faintest star                ' + r.limitMag + '\n' +
			'  single eye mag reduction     ' + r.singleEyeMagChange + '\n' +
			'  scope xmit mag reduction     ' + r.scopeTransMagChange + '\n' +
			'  brightness (mag/arcsec^2):\n ' +
			'	object without telescope    ' + r.surfBrightObj + '\n' +
			'	brightness reduction at X   ' + r.brightReductionAtX + '\n' +
			'	object in scope at X        ' + r.surfBrightObjAtX + '\n' +
			'	background in scope at X    ' + r.bkgndBrightAtX + '\n' +
			'	object+bkgnd in scope at X  ' + r.surfBrightObjPlusBkgndAtX + '\n' +
			'  log object contrast          ' + r.logContrastObject + '\n' +
			'  log contrast required        ' + r.logContrastRequired + '\n' +
			'  log contrast difference      ' + r.logContrastDiff + '\n' +
			'  detectable?                  ' + r.detectable + '\n';

		return {
			parms: p,
			result: r,
			text: s
		};
	};
};

MLB.calcLib.VisualDetectCalcExitPupils = function (parms) {
	var epCalcs,
	    vdc,
		eyepieceExitPupilmm,
		newParms,
		VisualDetectCalc = MLB.calcLib.VisualDetectCalc;

	epCalcs = [];
	vdc = new VisualDetectCalc();
	for (eyepieceExitPupilmm = 1; eyepieceExitPupilmm <= 7; eyepieceExitPupilmm++) {
		newParms = parms.copyFrom();
		newParms.eyepieceExitPupilmm = eyepieceExitPupilmm;
		epCalcs.push(vdc.calc(newParms));
	}
	return epCalcs;
};

MLB.calcLib.VisualDetectCalcApertures = function (parms) {
	var apertureCalcs,
	    dblApertureParms,
		halfApertureParms,
		VisualDetectCalcExitPupils = MLB.calcLib.VisualDetectCalcExitPupils;

	apertureCalcs = [];

	dblApertureParms = parms.copyFrom();
	dblApertureParms.apertureIn *= 2;
	apertureCalcs.push(new VisualDetectCalcExitPupils(dblApertureParms));

	apertureCalcs.push(new VisualDetectCalcExitPupils(parms));

	halfApertureParms = parms.copyFrom();
	halfApertureParms.apertureIn /= 2;
	apertureCalcs.push(new VisualDetectCalcExitPupils(halfApertureParms));

	return apertureCalcs;
};

MLB.calcLib.calcNewtBaffle = function (focalPlaneDia, focuserBarrelBottomToFocalPlaneDistance, focuserBarrelID, diagSize, diagToFocalPlaneDistance, diagtoFocuserBaffleDistance, diagToOppositeSideBaffleDistance) {
	var focuserBaffleToFocalPlaneDistance,
	    focuserBaffleOD,
		focuserBaffleID,
		oppositeSideBaffleOD;

	focuserBaffleToFocalPlaneDistance = (diagToFocalPlaneDistance - diagtoFocuserBaffleDistance);
	focuserBaffleOD = (focalPlaneDia + focuserBarrelID) / focuserBarrelBottomToFocalPlaneDistance * (focuserBaffleToFocalPlaneDistance - focuserBarrelBottomToFocalPlaneDistance) + focuserBarrelID;
	focuserBaffleID = (diagSize / 1.414213562373095 - focalPlaneDia) / diagToFocalPlaneDistance * focuserBaffleToFocalPlaneDistance + focalPlaneDia;
	oppositeSideBaffleOD = (focalPlaneDia + focuserBaffleID) / focuserBaffleToFocalPlaneDistance * (diagtoFocuserBaffleDistance + diagToOppositeSideBaffleDistance) + focuserBaffleID;
	return {
		focuserBaffleID: focuserBaffleID,
		focuserBaffleOD: focuserBaffleOD,
		oppositeSideBaffleOD: oppositeSideBaffleOD
	};
};

// Z12 mounting errors in azimuth calculator

MLB.calcLib.MeasurementType = {
	real: 'real',
	apparent: 'apparent'
};

MLB.calcLib.initZ12Calc = function () {
	var initLatitudeDeg,
	    altStepSizeDeg,
		positions,
		altDeg,
		position,
		uom = MLB.sharedLib.uom,
	    ConvertStyle = MLB.coordLib.ConvertStyle,
		XForm = MLB.coordLib.XForm;

	initLatitudeDeg = 40;
	altStepSizeDeg = 2;
	positions = [];

	for (altDeg = -(90 - altStepSizeDeg); altDeg < 90; altDeg += altStepSizeDeg) {
		position = new MLB.coordLib.Position();
		position.alt = altDeg  * uom.degToRad;
		positions.push(position);
	}
	return {
		xform: new XForm(ConvertStyle.matrix, initLatitudeDeg * uom.degToRad),
		positions: positions,
		azErrors: [],
		z1Errors: [],
		z2Errors: []
	};
};

MLB.calcLib.InitZ12Calc = {
	init: MLB.calcLib.initZ12Calc()
};

MLB.calcLib.setAlignment = function (xform, initType) {
	var InitType = MLB.coordLib.InitType;

	if (initType === InitType.altazimuth) {
		xform.presetAltaz();
	} else if (initType === InitType.equatorial) {
		xform.presetEquat();
	} else {
		throw ('unprocessed initType of ' + initType + ' in setAlignment');
	}
};

MLB.calcLib.generateZ12ErrorValues = function (z1Deg, z2Deg, latDeg, azDeg, xform, positions, azErrors, initType) {
	var az,
	    positionsLength,
		ix,
		uom = MLB.sharedLib.uom,
		setAlignment = MLB.calcLib.setAlignment;

	xform.latitude = latDeg * uom.degToRad;
	xform.setFabErrorsDeg(0, 0, 0);
	setAlignment(xform, initType);
	xform.position.SidT = 0;
	az = azDeg * uom.degToRad;
	xform.position.az = az;

	// getEquat() with z123 = 0 and preset az
	positionsLength = positions.length;
	for (ix = 0; ix < positionsLength; ix++) {
		xform.position.alt = positions[ix].alt;
		xform.getEquat();
		positions[ix].RA = xform.position.RA;
		positions[ix].Dec = xform.position.Dec;
	}

	// get altaz with input z12 and RA+Dec from above;
	// az error is difference between this az and starting az above
	xform.setFabErrorsDeg(z1Deg, z2Deg, 0);
	setAlignment(xform, initType);
	positionsLength = positions.length;
	for (ix = 0; ix < positionsLength; ix++) {
		xform.position.RA = positions[ix].RA;
		xform.position.Dec = positions[ix].Dec;
		xform.getAltaz();
		azErrors[ix] = az - xform.position.az;
	}
};

MLB.calcLib.getZ12ErrorValues = function (z1Deg, z2Deg, latDeg, azDeg, initType) {
	var init,
	    positionsLength,
		ix,
		InitZ12Calc = MLB.calcLib.InitZ12Calc,
		generateZ12ErrorValues = MLB.calcLib.generateZ12ErrorValues;

	init = InitZ12Calc.init;
	generateZ12ErrorValues(z1Deg, 0, latDeg, azDeg, init.xform, init.positions, init.azErrors, initType);
	positionsLength = init.positions.length;
	for (ix = 0; ix < positionsLength; ix++) {
		init.z1Errors[ix] = init.azErrors[ix];
	}
	generateZ12ErrorValues(0, z2Deg, latDeg, azDeg, init.xform, init.positions, init.azErrors, initType);
	positionsLength = init.positions.length;
	for (ix = 0; ix < positionsLength; ix++) {
		init.z2Errors[ix] = init.azErrors[ix];
	}
};

MLB.calcLib.setSecAxisDeg = function (position, initType) {
	var uom = MLB.sharedLib.uom,
	    InitType = MLB.coordLib.InitType;

	return initType === InitType.altazimuth || initType === InitType.star ? position.alt / uom.degToRad : position.Dec / uom.degToRad;
};

MLB.calcLib.includePriAxisError = function (position, initType) {
	var InitType = MLB.coordLib.InitType;

	return initType === InitType.equatorial || ((initType === InitType.altazimuth || initType === InitType.star) && position.alt >= 0);
};

MLB.calcLib.buildZ12AzErrors = function (positions, zErrors, measurementType, initType) {
	var zPoints,
	    positionsLength,
		ix,
		azErrorArcmin,
		uom = MLB.sharedLib.uom,
		setSecAxisDeg = MLB.calcLib.setSecAxisDeg,
		includePriAxisError = MLB.calcLib.includePriAxisError,
		MeasurementType = MLB.calcLib.MeasurementType;

	zPoints = [];
	positionsLength = positions.length;
	for (ix = 0; ix < positionsLength; ix++) {
		if (includePriAxisError(positions[ix], initType)) {
			azErrorArcmin = zErrors[ix] / uom.arcminToRad;
			if (measurementType === MeasurementType.apparent) {
				azErrorArcmin *= Math.cos(positions[ix].alt);
			}
			zPoints.push([azErrorArcmin, setSecAxisDeg(positions[ix], initType)]);
		}
	}
	return zPoints;
};

/*
Generate pointing errors across the sky for an altazimuth initialized telescope given random initialization errors.
*/

MLB.calcLib.getRandomErrorDeg = function (maxErrorDeg) {
	return Math.random() * maxErrorDeg;
};

MLB.calcLib.createPerfectPositions = function (latitudeRad, spacingDeg) {
	var uom = MLB.sharedLib.uom,
		Position = MLB.coordLib.Position,
	    convertStyle = MLB.coordLib.ConvertStyle.matrix,
	    XForm = MLB.coordLib.XForm,
		xform,
		perfectPositions = [],
		altDeg,
		azSpacingDeg,
		azDeg;

	xform = new XForm(convertStyle, latitudeRad);
	xform.presetAltaz();

	for (altDeg = 0; altDeg < 90; altDeg += spacingDeg) {
		azSpacingDeg = spacingDeg / Math.cos(altDeg * uom.degToRad);
		for (azDeg = 0; azDeg < 360; azDeg += azSpacingDeg) {
			xform.position.SidT = 0;
			xform.position.az = azDeg * uom.degToRad;
			xform.position.alt = altDeg * uom.degToRad;
			xform.getEquat();
			perfectPositions.push(new Position(xform.position.RA, xform.position.Dec, xform.position.az, xform.position.alt, 0, 0));
		}
	}
	return perfectPositions;
};

MLB.calcLib.initErrorsPlot = function (latitudeRad, spacingDeg, numberTrials, maxErrorDeg, position1, position2, z1deg, z2deg) {
	var uom = MLB.sharedLib.uom,
	    validHalfRev = MLB.coordLib.validHalfRev,
		copyPosition = MLB.coordLib.copyPosition,
		ConvertStyle = MLB.coordLib.ConvertStyle,
		XForm = MLB.coordLib.XForm,
		clearPosition = MLB.coordLib.clearPosition,
		initMatrixFacade = MLB.coordLib.initMatrixFacade,
		createPerfectPositions = MLB.calcLib.createPerfectPositions,
		getRandomErrorDeg = MLB.calcLib.getRandomErrorDeg,
		xform,
		cmws,
		variances,
		trials,
		ppIx,
		azError,
		altError,
		totalError,
		errors = [],
		plotData = [],
		perfectPositions = createPerfectPositions(latitudeRad, spacingDeg),
		lengthPerfectPositions = perfectPositions.length;

	// main loop
	for (trials = 0; trials < numberTrials; trials++) {
		xform = new XForm(ConvertStyle.matrix, latitudeRad);
		cmws = xform.cmws;
		variances = [getRandomErrorDeg(maxErrorDeg), getRandomErrorDeg(maxErrorDeg), getRandomErrorDeg(maxErrorDeg), getRandomErrorDeg(maxErrorDeg)];
		copyPosition(position1, cmws.one);
		copyPosition(position2, cmws.two);
		// increase az per altitude
		cmws.one.az += variances[0] * uom.degToRad / Math.cos(cmws.one.alt);
		cmws.one.alt += variances[1] * uom.degToRad;
		cmws.two.az += variances[2] * uom.degToRad / Math.cos(cmws.two.alt);
		cmws.two.alt += variances[3] * uom.degToRad;
		clearPosition(cmws.three);
		initMatrixFacade(cmws, 2);
		// post-init setting of z1 equivalent to pre-init setting of z1+changed init positions:
		// see test module 'z1 (axis twist or non-perpendicularity) initialization study' in coordLib unitTests.htm
		xform.setFabErrorsDeg(z1deg, z2deg, 0);

		// for each position in perfectPositions, grab equat coords and convert to altaz, comparing converted altaz to perfect altaz
		for (ppIx = 0; ppIx < lengthPerfectPositions; ppIx++) {
			copyPosition(perfectPositions[ppIx], xform.position);
			xform.getAltaz();
			// shrink az per altitude
			azError = Math.abs(validHalfRev(xform.position.az - perfectPositions[ppIx].az)) * Math.cos(xform.position.alt);
			altError = Math.abs(xform.position.alt - perfectPositions[ppIx].alt);
			totalError = Math.sqrt(azError * azError + altError * altError);

			if (isNaN(errors[ppIx])) {
				errors[ppIx] = 0;
			}
			errors[ppIx] += totalError / numberTrials;
		}
	}

	// create plot data
	for (ppIx = 0; ppIx < lengthPerfectPositions; ppIx++) {
		plotData[ppIx] = {error: errors[ppIx], azimuth: perfectPositions[ppIx].az, altitude: perfectPositions[ppIx].alt};
	}
	return plotData;
};

/*
How much is the entrance aperture reduced when a mirror is slumped over a mold?
Circle: perimeter = 2* PI * radius;
if radius = RC (radius of curvature), which is MD (mirror dia) * FR (focal ratio) *2, 
then MD = 1/(2*FR) part of a radius and 1/(2*FR*2*PI)=1/(4*FR*PI) portion of a circle,
eg, MD=30, FR=2: therefore mirror covers 1/(8*PI)= 0.0398 portion of a circle;
a circle is 360 degrees or 2*PI radians, so in this example, the angle from the RC point to opposite edges of the mirror = 
	360/(8*PI)=14.32 degrees or 2*PI/(8*PI)=0.25 radians,
formula for mirror diameter subtended angle in radians = 2*PI/(4*FR*PI)=1/(2*FR),
angle from mirror's optical path centerline to mirror edge is half the subtended angle or 1/(4*FR);
to get entrance aperture, we know the hypotenus and the angle: half of entrance aperture = RC*sin(1/4*FR) = MD*FR*2*sin(1/(4*FR)),
and full entrance aperture = 2*RC*2*sin(1/4*FR) = MD*FR*4*sin(1/(4*FR)),
eg, MD=30, FR=2: entrance aperture = 2*30*2*2*sin(1/(4*2)) = 29.92;
*/
MLB.calcLib.calcMirrorSlumpingParms = function (mirrorDia, focalRatio) {
	var angle = 1 / (4 * focalRatio),
	    calcSagittaSpherical = MLB.calcLib.calcSagittaSpherical,
	    effectiveDia = mirrorDia * focalRatio * 4 * Math.sin(angle),
		sphericalSagitta = calcSagittaSpherical(mirrorDia, focalRatio),
		uom = MLB.sharedLib.uom;

	return {
		effectiveDia: effectiveDia,
		sphericalSagitta: sphericalSagitta,
		edgeAngleDeg: angle / uom.degToRad
	};
};

// from Thompson's Making Your Own Telescope, page 76
MLB.calcLib.calcSphereParabolaDifference = function (mirrorDia, focalRatio) {
	var mirrorRad = mirrorDia / 2,
	    radiusOfCurvature = mirrorDia * focalRatio * 2;

	return Math.pow(mirrorRad, 4) / (8 * Math.pow(radiusOfCurvature, 3));
};

/*
from Telescope Making #8, pg 36-, Richard Berry
	16 inch f5
	AZ radius 9, weight 120 lbs, 45deg bearing angle, moment arm 40inches, f=0.083
	0.088*120*9/(cos(45)*40)=3.2
	ALT radius 4, weight 80 lbs, 60deg bearing angle, moment arm 40inches, f=0.088
	1.3*80*(1/cos(60))*4/40=2.1
*/
MLB.calcLib.calcDobFriction = function (azimuthFrictionCoefficient, altitudeFrictionCoefficient, momentArm, azWeight, altWeight, azBearingRadius, altBearingRadius, altBearingAngleDegFromVertical, altitudeAngleDegFromHorizontal) {
	var uom = MLB.sharedLib.uom,
	    azFriction = azimuthFrictionCoefficient * azWeight * azBearingRadius / (momentArm * Math.cos(altitudeAngleDegFromHorizontal * uom.degToRad)),
		altFriction = altitudeFrictionCoefficient * altWeight * (1 / Math.cos(altBearingAngleDegFromVertical * uom.degToRad)) * altBearingRadius / momentArm;

	return {
		az: azFriction,
		alt: altFriction
	};
};

// SQM (Sky Quality Meter) to NELM (Naked-Eye Limiting Magnitude) converter
// see http://www.cloudynights.com/ubbthreads/showflat.php/Cat/0/Number/3572029/Main/3570104
MLB.calcLib.SQMtoNELMconverter = function (SQMreading) {
	return (SQMreading - 8.89) / 2 + 0.5;
};

MLB.calcLib.NELMtoSQMconverter = function (NELM) {
	return 2 * (NELM - 0.5) + 8.89;
};

// from http://web.telia.com/~u41105032/misc/nulltest.htm
MLB.calcLib.artificialStarDistanceMM = function (mirrorDiameter, focalLength) {
	return MLB.sharedLib.int(14 * Math.pow(mirrorDiameter, 4) / Math.pow(focalLength, 2));
};

MLB.calcLib.artificialStarDistanceInches = function (mirrorDiameter, focalLength) {
	return MLB.sharedLib.int(25.4 * 14 * Math.pow(mirrorDiameter, 4) / Math.pow(focalLength, 2));
};

// end of file
