// copyright Mel Bartels, 2011-2016
// see calcLib unitTests.htm for unit tests
// turn on jslint's Tolerate ++ and --

'use strict';

MLB.calcLib = {};

// Ronchi

// from a Sky and Telescope article
MLB.calcLib.wavefrontError = function (mirrorDia, radiusOfCurvature, correctionFactor) {
	var mirrorRadius = mirrorDia / 2,
	    zones = [0.3, 0.7, 0.93],
		zonalRadii = [],
		readings = [],
	    deviations = [],
	    errors = [],
		surfaceErrors = [],
		length = zones.length,
		wavelengthLight = 0.000022,
		ix,
		A,
		B,
		C,
		zr;

	// md = 20, rc = 200, cf = 0.86: zonalRadii = [3, 7, 9.3]
	for (ix = 0; ix < length; ix++) {
	    zonalRadii[ix] = zones[ix] * mirrorRadius;
	}

	// for fixed light source
	// md = 20, rc = 200, cf = 0.86: readings = [0.045, 0.245, 0.43245000000000006]
	for (ix = 0; ix < length; ix++) {
		readings[ix] = zonalRadii[ix] * zonalRadii[ix] / radiusOfCurvature;
	}

	// md = 20, rc = 200, cf = 0.86: deviations = [0.0063, 0.034300000000000004, 0.060543000000000013]
	for (ix = 0; ix < length; ix++) {
		deviations[ix] = readings[ix] * (1 - correctionFactor);
	}

	// md = 20, rc = 200, cf = 0.86: errors = [0.010738636363636363, 0.13642045454545457, 0.31991471590909104]
	for (ix = 0; ix < length; ix++) {
		errors[ix] = deviations[ix] * zonalRadii[ix] / (2 * radiusOfCurvature * radiusOfCurvature * wavelengthLight);
	}

	// md = 20, rc = 200, cf = 0.86: A = 0.0001012748943181821, B = 0.000015981517045452475, C = -0.010287304602272734
	A = (3.31 * errors[0] - 3.88 * errors[1] + 1.86 * errors[2]) / (mirrorRadius * mirrorRadius * mirrorRadius);
	B = (-7.19 * errors[0] + 6.37 * errors[1] - 2.47 * errors[2]) / (mirrorRadius * mirrorRadius);
	C = -mirrorRadius * (mirrorRadius * A + B);

	// md = 20, rc = 200, cf = 0.86: wavefronts = [-0.08395097402045464, -0.2554352439068186, -0.11930524737190273]
	for (ix = 0; ix < length; ix++) {
		zr = zonalRadii[ix];
		surfaceErrors[ix] = A * zr * zr * zr * zr + B * zr * zr * zr + C * zr * zr;
	}

	// 70% zone will have greatest deviation when smoothly under/over corrected (center and edge will have zero error);
	// wavefront error is twice that of surface error
	return Math.abs(2 * surfaceErrors[1]);
};

// parabolic correction tolerances: focalRatio 1: 98.3%; focalRatio 2: 96.7%; focalRatio 3: 95%; focalRatio 4: 93.3%; focalRatio 5: 91.7%; focalRatio 6: 90%; focalRatio 7: 88.4%; focalRatio 8: 86.7%; focalRatio 9: 85%; focalRatio 10: 83.4%;
MLB.calcLib.findAllowableCorrection = function (mirrorDia, radiusOfCurvature) {
	var wavefrontError = MLB.calcLib.wavefrontError,
	    iterations = 0,
	    maxIterations = 8,
		lastWavefrontError,
		currentWavefrontError,
	    direction = -1,
		stepSize = radiusOfCurvature / mirrorDia / 2 / 100, // make an initial guess
	    correction = 1 - stepSize;

	while (iterations < maxIterations) {
		currentWavefrontError = wavefrontError(mirrorDia, radiusOfCurvature, correction);
		if (lastWavefrontError !== undefined && currentWavefrontError > lastWavefrontError) {
			direction *= -1;
			stepSize /= 2;
		} else {
			lastWavefrontError = currentWavefrontError;
		}
		correction += stepSize * direction;
		iterations++;
	}

	return correction;
};

MLB.calcLib.calcAllowableParabolicDeviationForQuarterWavefront = function (focalRatio) {
	return focalRatio * 0.0167;
};

// sagitta

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

// http://www.1728.org/sphere.htm and http://www.had2know.com/academics/spherical-cap-volume-surface-area-calculator.html
MLB.calcLib.calcSagittalVolume = function (mirrorDia, focalRatio) {
	var sagitta = MLB.calcLib.calcSagitta(mirrorDia, focalRatio),
	    RoC = mirrorDia * focalRatio * 2;

	return Math.PI * sagitta * sagitta * (3 * RoC - sagitta) / 3;
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
// from http://www.telescope-optics.net/newtonian.htm
MLB.calcLib.calcDiagOffset = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance) {
	return (mirrorDia - diagSize) * diagSize / (4 * (focalLen - diagToFocalPlaneDistance));
};

// from an old Sky and Telescope magazine article (note that the offset is negative)
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

MLB.calcLib.calcFoldedNewtonian = function (mirrorDia, focalRatio, diagSize, focalPlaneToTertiaryDistance, tertiaryOffsetFromEdgeOfPrimary) {
	var focalLength,
	    diagToPrimaryMirrorDistance,
		focalPointToDiagDistance,
	    focalPointToPrimaryMirrorDistance,
		bentLightPathLength,
		bentLightPathVerticalLength,
		bentLightPathHorizontalLength,
		elbowAngleRad,
		elbowAngleDeg,
		diagMajorAxisSize,
		uom = MLB.sharedLib.uom;

	focalLength = mirrorDia * focalRatio;
	// diagonal to primary mirror distance is the focal ratio times the difference between primary mirror and diagonal mirror sizes - an interesting formula;
	diagToPrimaryMirrorDistance = focalRatio * (mirrorDia - diagSize);
	focalPointToDiagDistance = focalLength - diagToPrimaryMirrorDistance;
	// the distance along the primary optical axis from the focal point projected onto this axis to the diagonal or folding mirror (excluding the focalPlaneToTertiaryDistance) that the light can be 'folded backwards' is one side of a triangle with the hypotenuse = bentLightPathLength and other side the bentLightPathVerticalLength;
	bentLightPathLength = focalPointToDiagDistance - focalPlaneToTertiaryDistance;
	bentLightPathVerticalLength = mirrorDia / 2 + tertiaryOffsetFromEdgeOfPrimary;
	bentLightPathHorizontalLength = Math.sqrt(Math.pow(bentLightPathLength, 2) - Math.pow(bentLightPathVerticalLength, 2));
	focalPointToPrimaryMirrorDistance = diagToPrimaryMirrorDistance - bentLightPathHorizontalLength;
	/*
	    canvas x is the horizontal coordinate, canvas y is the vertical coordinate;
        atan2(y,x): y is the horizontal coordinate, x is the vertical coordinate
        atan2(1,0) aims to the right; atan2(0,1) aims to the top; atan2(0,-1) aims to the bottom; atan2(-1,-1) aims to the left;
        or, 0deg aims to the right, 90deg aims to the top, -90deg aims to the bottom and 180/180deg aims to the left;
        using the atan2 coordinate system (y to the right, x to the top, 0 deg to the right, grows counter-clockwise:
	*/
	elbowAngleRad = Math.atan2(bentLightPathVerticalLength, bentLightPathHorizontalLength);
	elbowAngleDeg = elbowAngleRad / uom.degToRad;
	diagMajorAxisSize = diagSize / Math.cos(elbowAngleRad / 2);

	return {
		diagToPrimaryMirrorDistance: diagToPrimaryMirrorDistance,
		focalPointToPrimaryMirrorDistance: focalPointToPrimaryMirrorDistance,
		elbowAngleDeg: elbowAngleDeg,
		diagMajorAxisSize: diagMajorAxisSize
	};
};

MLB.calcLib.getFoldedNewtonianScalingFactor = function (width, height, focalRatio, diagSize, focalPlaneToTertiaryDistance, tertiaryOffsetFromEdgeOfPrimary, diagToMirrorDistance) {
	var maxWidth,
	    maxHeight,
		modelWidthToHeightRatio,
		graphicsWidthToHeightRatio,
		scalingFactor,
		margin;

	maxWidth = diagToMirrorDistance;
	maxHeight = (diagSize * focalRatio + focalPlaneToTertiaryDistance + tertiaryOffsetFromEdgeOfPrimary) * 2;
	modelWidthToHeightRatio = maxWidth / maxHeight;
	graphicsWidthToHeightRatio = width / height;
	margin = 0.1;

	if (maxWidth === 0 || maxHeight === 0) {
		scalingFactor = 0;
	} else if (modelWidthToHeightRatio > graphicsWidthToHeightRatio) {
		scalingFactor = width / maxWidth;
	} else {
		scalingFactor = height / maxHeight;
	}
	scalingFactor *= 1 - margin * 2;
	return scalingFactor;
};

// visual detection calculator

MLB.calcLib.limitingMagnitude = function (apertureIn) {
	var log10 = MLB.sharedLib.log10;

	// from http://adsabs.harvard.edu/full/1947PASP...59..253B
	// assumes 2 mag gain due to high magnification; no gain in limiting magnitude below 1.8mm exit pupil, 'RFT' exit pupil lowers limiting magnitude ~1
	return 10.8 + 5 * log10(apertureIn);
};

MLB.calcLib.apertureInchesFromMagnitude = function (magnitude) {
	return Math.pow(10, (magnitude - 10.8) / 5);
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
			'  object dimensions arcmin     ' + p.maxObjArcmin + ' x ' + p.minObjArcmin + '\n' +
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

// Newtonian baffles: focuser, diagonal and primary mirrors

MLB.calcLib.calcNewtBaffle = function (focalPlaneDia, focuserBarrelBottomToFocalPlaneDistance, focuserBarrelID, diagSizeMinorAxis, diagToFocalPlaneDistance, diagtoFocuserBaffleDistance, diagToOppositeSideBaffleDistance, primaryMirrorFocalLength, primaryToBaffleDistance, tubeID) {
	var focuserBaffleToFocalPlaneDistance,
	    focuserBaffleOD,
		focuserBaffleID,
		diagonalBaffleOD,
		primaryBaffleOD,
		tubeExtension;

	focuserBaffleToFocalPlaneDistance = (diagToFocalPlaneDistance - diagtoFocuserBaffleDistance);
	focuserBaffleOD = (focalPlaneDia + focuserBarrelID) / focuserBarrelBottomToFocalPlaneDistance * (focuserBaffleToFocalPlaneDistance - focuserBarrelBottomToFocalPlaneDistance) + focuserBarrelID;
	focuserBaffleID = (diagSizeMinorAxis - focalPlaneDia) / diagToFocalPlaneDistance * focuserBaffleToFocalPlaneDistance + focalPlaneDia;
	diagonalBaffleOD = (focalPlaneDia + focuserBaffleID) / focuserBaffleToFocalPlaneDistance * (diagtoFocuserBaffleDistance + diagToOppositeSideBaffleDistance) + focuserBaffleID;
	primaryBaffleOD = (diagSizeMinorAxis + focalPlaneDia) * (primaryMirrorFocalLength - primaryToBaffleDistance) / diagToFocalPlaneDistance - focalPlaneDia;
	tubeExtension = primaryMirrorFocalLength - (diagToFocalPlaneDistance * (focalPlaneDia + tubeID) / (diagSizeMinorAxis + focalPlaneDia));

	return {
		focuserBaffleID: focuserBaffleID,
		focuserBaffleOD: focuserBaffleOD,
		diagonalBaffleOD: diagonalBaffleOD,
		primaryBaffleOD: primaryBaffleOD,
		tubeExtension: tubeExtension
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
Conclusions based on init star separation:
	bad for 0-20 and 160-180 degrees separation (error doubled from the init error),
	marginal for 20-45 and 135-160 degrees separation (error 30% greater of the init error),
	good for 40-140 degrees separation (error the same as the init error)
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
data engine for altazimuth tracking errors that accrue from constant motions
*/

MLB.calcLib.createAltazConstantMotionTrackingErrors = function (latitudeRad, constantTrackRateTimeRad, spacingDeg) {
	var uom = MLB.sharedLib.uom,
	    convertStyle = MLB.coordLib.ConvertStyle.trig,
	    XForm = MLB.coordLib.XForm,
		xform,
		trackingRates,
		altDeg,
		azSpacingDeg,
		azDeg,
		timeIntervalSec = 30,
		HAOffset = 0,
		includeRefraction = true,
		rates,
		adjustedConstantTrackRateAzError,
		rmsErrorRad,
		data = [];

	xform = new XForm(convertStyle, latitudeRad);
	xform.presetAltaz();
	trackingRates = new MLB.coordLib.TrackingRates();
	trackingRates.setConstantTrackRateTimeRad(constantTrackRateTimeRad);

	for (altDeg = 0; altDeg < 90; altDeg += spacingDeg) {
		azSpacingDeg = spacingDeg / Math.cos(altDeg * uom.degToRad);
		for (azDeg = 0; azDeg < 360; azDeg += azSpacingDeg) {
			xform.position.SidT = 0;
			xform.position.az = azDeg * uom.degToRad;
			xform.position.alt = altDeg * uom.degToRad;
			xform.getEquat();
			rates = trackingRates.getRatesViaDeltaTime(xform, timeIntervalSec, HAOffset, includeRefraction);
			// use apparent az error as seen in the eyepiece: adjust by the cosine of the altitude
			adjustedConstantTrackRateAzError = rates.constantTrackRateAzError * Math.cos(rates.initialAz);
			rmsErrorRad = Math.sqrt(adjustedConstantTrackRateAzError * adjustedConstantTrackRateAzError + rates.constantTrackRateAltError * rates.constantTrackRateAltError);
			data.push([xform.position.az, xform.position.alt, rmsErrorRad]);
		}
	}
	// ex, data[5][2] is the rms error in radians for the 6th entry
	return data;
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
to get entrance aperture, we know the hypotenuse and the angle: half of entrance aperture = RC*sin(1/4*FR) = MD*FR*2*sin(1/(4*FR)),
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
// http://www.unihedron.com/projects/darksky/NELM2BCalc.html taken from http://adsbit.harvard.edu/cgi-bin/nph-iarticle_query?bibcode=1990PASP..102..212S
// Formula: B_mpsas = 21.58 - 5 log(10^(1.586-NELM/5)-1)
// Formula: NELM=7.93-5*log(10^(4.316-(Bmpsas/5))+1)
// mag 6 ~= 20.8 skies

MLB.calcLib.SQMtoNELMconverter = function (SQMreading) {
	return 7.93 - 5 * MLB.sharedLib.log10(Math.pow(10, 4.316 - (SQMreading / 5)) + 1);
};

MLB.calcLib.NELMtoSQMconverter = function (NELM) {
	return 21.58 - 5 * MLB.sharedLib.log10(Math.pow(10, 1.586 - (NELM / 5)) - 1);
};

/*
old formulae from Cloudy Nights discussion - not accurate for brighter skies

// SQM (Sky Quality Meter) to NELM (Naked-Eye Limiting Magnitude) converter
MLB.calcLib.SQMtoNELMconverter = function (SQMreading) {
	return (SQMreading - 8.89) / 2 + 0.5;
};

MLB.calcLib.NELMtoSQMconverter = function (NELM) {
	return 2 * (NELM - 0.5) + 8.89;
};
*/

// from http://web.telia.com/~u41105032/misc/nulltest.htm
MLB.calcLib.artificialStarDistanceMM = function (mirrorDiameter, focalLength) {
	return MLB.sharedLib.int(14 * Math.pow(mirrorDiameter, 4) / Math.pow(focalLength, 2));
};

MLB.calcLib.artificialStarDistanceInches = function (mirrorDiameter, focalLength) {
	return MLB.sharedLib.int(25.4 * 14 * Math.pow(mirrorDiameter, 4) / Math.pow(focalLength, 2));
};

/*
Five fundamental parameters for telescope design:
	aperture, true field of view, eyepiece focal length, eyepiece field stop, eye pupil
	
From my 13.2 inch F3.0 ZipDob article, http://www.bbastrodesigns.com/ZipDob/ZipDob.html and my Richest Field Telescopes article, http://bbastrodesigns.com/rft.html
Formula is: mirror diameter = eyepiece field stop * exit pupil * 57.3 / (true field of view * eyepiece focal length * 25.4)
From: true field of view = eyepiece field stop / telescope focal length * 57.3; focal length = focal ratio * mirror diameter; eyepiece focal length / exit pupil = focal ratio

ex: 21mm Ethos with 36.2mm field stop, coma corrector with 1.15x factor, desired FOV of 1.8 deg and 13.2 inch primary mirror at F3 with focal length = 13*3.2=39.6:
exit pupil = 21/3/1.15=6.1, therefore aperture = 2.256 * 36.2 * 6.1 / 1.8 / 21 = 13.2;

coma corrector comments:
	without coma corrector, focal ratio increases from F3 to F3.5, focal length increases from 40 to 46 and magnification remains unchanged (or put another way, using a coma corrector with the above numbers means that focal ratio shrinks, focal length therefore shrinks, but magnification does not change);
	the following equations ignore any coma corrector magnification because they do not use focal ratio or focal length
*/

MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_EyePupil = function (FOVdeg, eyepieceFocalLengthmm, eyepieceFieldStopmm, eyePupilmm) {
	return 2.256 * eyepieceFieldStopmm * eyePupilmm / FOVdeg / eyepieceFocalLengthmm;
};

MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_EyePupil = function (apertureInches, eyepieceFocalLengthmm, eyepieceFieldStopmm, eyePupilmm) {
	return 2.256 * eyepieceFieldStopmm * eyePupilmm / apertureInches / eyepieceFocalLengthmm;
};

MLB.calcLib.calcEyePupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = function (apertureInches, FOVdeg, eyepieceFocalLengthmm, eyepieceFieldStopmm) {
	return apertureInches * FOVdeg * eyepieceFocalLengthmm / eyepieceFieldStopmm / 2.256;
};

MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_EyePupil = function (apertureInches, FOVdeg, eyepieceFocalLengthmm, eyePupilmm) {
	return apertureInches * FOVdeg * eyepieceFocalLengthmm / eyePupilmm / 2.256;
};

MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_EyePupil = function (apertureInches, FOVdeg, eyepieceFieldStopmm, eyePupilmm) {
	return 2.256 * eyepieceFieldStopmm * eyePupilmm / apertureInches / FOVdeg;
};

/*
If focal ratio known from eyepiece focal length and eye pupil, then can reduce to four fundamental parameters for telescope design:
	aperture, true field of view, eyepiece field stop, focal ratio
	
From: aperture = eyepiece field stop / (true field of view * focal ratio * 25.4 / 57.3)
*/

MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop = function (FOVdeg, focalRatio, eyepieceFieldStopmm) {
	return 2.256 * eyepieceFieldStopmm / FOVdeg / focalRatio;
};

MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop = function (apertureInches, focalRatio, eyepieceFieldStopmm) {
	return 2.256 * eyepieceFieldStopmm / apertureInches / focalRatio;
};

MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop = function (apertureInches, FOVdeg, eyepieceFieldStopmm) {
	return 2.256 * eyepieceFieldStopmm / apertureInches / FOVdeg;
};

MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio = function (apertureInches, FOVdeg, focalRatio) {
	return apertureInches * FOVdeg * focalRatio / 2.256;
};

/* 
adding in a coma corrector with magnifying power results in:
aperture = eyepiece field stop / (true field of view * focal ratio * comaCorrectorFactor * 25.4 / 57.3)
*/

MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = function (FOVdeg, focalRatio, eyepieceFieldStopmm, comaCorrectorFactor) {
	var calcApertureFromFOV_FocalRatio_EyepieceFieldStop = MLB.calcLib.calcApertureFromFOV_FocalRatio_EyepieceFieldStop,
	    apertureInches = calcApertureFromFOV_FocalRatio_EyepieceFieldStop(FOVdeg, focalRatio, eyepieceFieldStopmm);

	if (!isNaN(comaCorrectorFactor)) {
		apertureInches /= comaCorrectorFactor;
	}
	return apertureInches;
};

MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop_ComaCorrectorFactor = function (apertureInches, focalRatio, eyepieceFieldStopmm, comaCorrectorFactor) {
	var calcFOVFromAperture_FocalRatio_EyepieceFieldStop = MLB.calcLib.calcFOVFromAperture_FocalRatio_EyepieceFieldStop,
	    FOVdeg = calcFOVFromAperture_FocalRatio_EyepieceFieldStop(apertureInches, focalRatio, eyepieceFieldStopmm);

	if (!isNaN(comaCorrectorFactor)) {
		FOVdeg /= comaCorrectorFactor;
	}
	return FOVdeg;
};

MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop_ComaCorrectorFactor = function (apertureInches, FOVdeg, eyepieceFieldStopmm, comaCorrectorFactor) {
	var calcFocalRatioFromAperture_FOV_EyepieceFieldStop = MLB.calcLib.calcFocalRatioFromAperture_FOV_EyepieceFieldStop,
	    focalRatio = calcFocalRatioFromAperture_FOV_EyepieceFieldStop(apertureInches, FOVdeg, eyepieceFieldStopmm);

	if (!isNaN(comaCorrectorFactor)) {
		focalRatio /= comaCorrectorFactor;
	}
	return focalRatio;
};

MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio_ComaCorrectorFactor = function (apertureInches, FOVdeg, focalRatio, comaCorrectorFactor) {
	var calcEyepieceFieldStopFromAperture_FOV_FocalRatio = MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_FocalRatio,
	    eyepieceFieldStopmm = calcEyepieceFieldStopFromAperture_FOV_FocalRatio(apertureInches, FOVdeg, focalRatio);

	if (!isNaN(comaCorrectorFactor)) {
		eyepieceFieldStopmm *= comaCorrectorFactor;
	}
	return eyepieceFieldStopmm;
};

// based on unaided eye barely resolving Epsilon Lyrae
MLB.calcLib.resolutionFromAperture_Magnification = function (apertureInches, magnification) {
	var DawesLimit = 4.6 / apertureInches,
		resolution = 240 / magnification;

	if (resolution < DawesLimit) {
		return DawesLimit;
	}
	return resolution;
};

MLB.calcLib.calcProjectedFocuserBaffleRadius = function (eyepieceFieldStop, barrelTubeID, focalPlaneToFocuserBarrelBottomDistance, focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness) {
	var focuserBaffleSlope = (eyepieceFieldStop + barrelTubeID) / 2 / focalPlaneToFocuserBarrelBottomDistance;

	return (focalPlaneToDiagDistance + telescopeTubeOD / 2 - telescopeTubeThickness) * focuserBaffleSlope - eyepieceFieldStop / 2;
};

MLB.calcLib.baffleScalingFactor = function (maxWidth, maxHeight, modelWidth, modelHeight, border) {
	var widthFactor = (maxWidth - border * 2) / modelWidth,
	    heightFactor = (maxHeight  - border * 2) / modelHeight,
		scalingFactor = widthFactor < heightFactor ? widthFactor : heightFactor;

	return scalingFactor;
};

// end of file
