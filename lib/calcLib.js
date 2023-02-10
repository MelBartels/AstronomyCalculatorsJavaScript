// copyright Mel Bartels, 2011-2023
// see calcLib unitTests.htm for unit tests

// var MLB = {}; var $ = {}; var _ = {};

'use strict';

MLB.calcLib = {};

// Ronchi

// from a Sky and Telescope article
// also see mirrors.xls spreadsheet
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

    // md = 20, rc = 200, cf = 0.86: surfaceErrors = [-0.08395097402045464, -0.2554352439068186, -0.11930524737190273]
    for (ix = 0; ix < length; ix++) {
        zr = zonalRadii[ix];
        surfaceErrors[ix] = A * zr * zr * zr * zr + B * zr * zr * zr + C * zr * zr;
    }

    // 70% zone will have greatest deviation when smoothly under/over corrected (center and edge will have zero error);
    // wavefront error is twice that of surface error
    return Math.abs(2 * surfaceErrors[1]);
};

// where corrections is an array of correction factors (1=perfectly parabolized) for the 30, 70 and 93% zones, eg, correctionsArray = [0.98, 1.0, 1.03]
// also see mirrors.xls spreadsheet
// returned is an array of wavefront errors starting with the center zone and ending with the edge zone
MLB.calcLib.wavefrontErrorFromCorrectionsArray = function (mirrorDia, radiusOfCurvature, wavelengthLight, correctionsArray, wavefrontErrorsArraySize) {
    var mirrorRadius = mirrorDia / 2,
        zones = [0.3, 0.7, 0.93],
        zonesLength = zones.length,
        zonalRadii = [],
        readings = [],
        deviations = [],
        errors = [],
        surfaceError,
        wavefrontErrors = [],
        ix,
        A,
        B,
        C,
        zr,
        lowestPV,
        highestPV,
        rms,
        rmsCount,
        wavefrontPV,
        wavefrontRMS;

    // md = 20, rc = 200, cf = 0.86: zonalRadii = [3, 7, 9.3]
    for (ix = 0; ix < zonesLength; ix++) {
        zonalRadii[ix] = zones[ix] * mirrorRadius;
    }

    // for fixed light source
    // md = 20, rc = 200, cf = 0.86: readings = [0.045, 0.245, 0.43245000000000006]
    for (ix = 0; ix < zonesLength; ix++) {
        readings[ix] = zonalRadii[ix] * zonalRadii[ix] / radiusOfCurvature;
    }

    // md = 20, rc = 200, cf = 0.86: deviations = [0.0063, 0.034300000000000004, 0.060543000000000013]
    for (ix = 0; ix < zonesLength; ix++) {
        deviations[ix] = readings[ix] * (1 - correctionsArray[ix]);
    }

    // md = 20, rc = 200, cf = 0.86: errors = [0.010738636363636363, 0.13642045454545457, 0.31991471590909104]
    for (ix = 0; ix < zonesLength; ix++) {
        errors[ix] = deviations[ix] * zonalRadii[ix] / (2 * radiusOfCurvature * radiusOfCurvature * wavelengthLight);
    }

    // md = 20, rc = 200, cf = 0.86: A = 0.0001012748943181821, B = 0.000015981517045452475, C = -0.010287304602272734
    A = (3.31 * errors[0] - 3.88 * errors[1] + 1.86 * errors[2]) / (mirrorRadius * mirrorRadius * mirrorRadius);
    B = (-7.19 * errors[0] + 6.37 * errors[1] - 2.47 * errors[2]) / (mirrorRadius * mirrorRadius);
    C = -mirrorRadius * (mirrorRadius * A + B);

    /* md = 20, rc = 200, cf = 0.86: waveErrors =
        0: {mirrorlRadius: 0, zonalRadius: 0, wavefrontError: 0}
        1: {mirrorlRadius: 1, zonalRadius: 0.1, wavefrontError: -0.0203400963818182}
        2: {mirrorlRadius: 2, zonalRadius: 0.2, wavefrontError: -0.0788019359272728}
        3: {mirrorlRadius: 3, zonalRadius: 0.3, wavefrontError: -0.16790194804090927}
        4: {mirrorlRadius: 4, zonalRadius: 0.4, wavefrontError: -0.27529536720000036}
        5: {mirrorlRadius: 5, zonalRadius: 0.5, wavefrontError: -0.38377623295454605}
        6: {mirrorlRadius: 6, zonalRadius: 0.6, wavefrontError: -0.4712773899272733}
        7: {mirrorlRadius: 7, zonalRadius: 0.7, wavefrontError: -0.5108704878136372}
        8: {mirrorlRadius: 8, zonalRadius: 0.8, wavefrontError: -0.4707659813818189}
        9: {mirrorlRadius: 9, zonalRadius: 0.9, wavefrontError: -0.3143131304727278}
        10: {mirrorlRadius: 10, zonalRadius: 1, wavefrontError: -4.440892098500626e-16}
    */
    lowestPV = 0;
    highestPV = 0;
    rms = 0;
    rmsCount = 0;
    for (ix = 0; ix < wavefrontErrorsArraySize; ix++) {
        zr = ix * mirrorDia / 2 / (wavefrontErrorsArraySize - 1);
        // surface errors need to be doubled for wavefront errors
        surfaceError = A * zr * zr * zr * zr + B * zr * zr * zr + C * zr * zr;

        if (surfaceError < lowestPV) {
            lowestPV = surfaceError;
        } else if (surfaceError > highestPV) {
            highestPV = surfaceError;
        }
        rmsCount += zr * zr;
        rms += Math.abs(surfaceError) * zr * zr;

        wavefrontErrors.push(
            {
                mirrorRadius: zr,
                zonalRadius: zr * 2 / mirrorDia,
                wavefrontError: 2 * surfaceError
        });
    }
    wavefrontPV = 2 * (highestPV - lowestPV);
    wavefrontRMS = 2 * (rms / rmsCount);

    return {
        wavefrontPV: wavefrontPV,
        wavefrontRMS: wavefrontRMS,
        wavefrontErrors: wavefrontErrors
    };
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

MLB.calcLib.calcSagittaSpherical = function (mirrorDia, focalRatio) {
    var RoC,
        mirrorRadius;

    RoC = mirrorDia * focalRatio * 2;
    mirrorRadius = mirrorDia / 2;
    return RoC - Math.sqrt(RoC * RoC  - mirrorRadius * mirrorRadius);
};

MLB.calcLib.calcSagittaParabolic = function (mirrorDia, focalRatio) {
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

// http://www.1728.org/sphere.htm
MLB.calcLib.calcSagittalVolume = function (mirrorDia, focalRatio) {
    var sagitta = MLB.calcLib.calcSagittaSpherical(mirrorDia, focalRatio),
        RoC = mirrorDia * focalRatio * 2;

    return Math.PI * sagitta * sagitta * (3 * RoC - sagitta) / 3;
};

MLB.calcLib.calcSagittalVolumeParabolic = function (mirrorDia, focalRatio) {
    var sagittaParabolic = MLB.calcLib.calcSagittaParabolic(mirrorDia, focalRatio),
        sagittaSpherical = MLB.calcLib.calcSagittaSpherical(mirrorDia, focalRatio),
        // the parabola touches the mirror center at the parabolic sagitta and touches the mirror edge at the spherical sagitta, so the sagitta to use will be between these two sagitti
        sagitta = ( sagittaSpherical + sagittaParabolic) / 2,
        RoC = mirrorDia * focalRatio * 2;

    return Math.PI * sagitta * sagitta * (3 * RoC - sagitta) / 3;
};

MLB.calcLib.calcSagittalVolumeRemovedDuringParabolization = function (mirrorDia, focalRatio) {
    var calcSagittalVolume = MLB.calcLib.calcSagittalVolume,
        calcSagittalVolumeParabolic = MLB.calcLib.calcSagittalVolumeParabolic,
        sphericalVolume = calcSagittalVolume(mirrorDia, focalRatio),
        parabolicVolume = calcSagittalVolumeParabolic(mirrorDia, focalRatio);

    return sphericalVolume - parabolicVolume;
};

// in cubic inches; 0.000393701 inches = 10 microns
// standard formula to calculate spherical captureEvents
MLB.calcLib.glassRemovalDuringPolishingFrom10MicronAluminumOxideCubicInches = function (mirrorDia, focalRatio) {
    var mirrorRadius = mirrorDia / 2,
        RoC = mirrorDia * focalRatio * 2;

    return 2 * Math.PI * RoC * RoC * (1 - Math.cos(mirrorRadius / RoC)) * 0.000393701;
};

// for wavelength of green light;
// conversion between nanometers and inches is 3.9370078740157E-8; green light is 550 nanometers
MLB.calcLib.inchesToWavesGreenLight = function (sphereParabolaDifferenceInches) {
    return sphereParabolaDifferenceInches / 0.000022;
};

// see https://en.wikipedia.org/wiki/Rotating_furnace
MLB.calcLib.calcRotatingFurnaceRPM = function (focalLengthMeters) {
    return Math.sqrt(447 / focalLengthMeters);
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
MLB.calcLib.getMagnitudeFromIllum = function (illumination) {
    var log10 = MLB.sharedLib.log10;

    return -2.5 * log10(illumination);
};

MLB.calcLib.getIllumFromMagnitude = function (magnitude) {
    return Math.pow(10, -0.4 * magnitude);
};

MLB.calcLib.addMagnitudes = function (magnitude1, magnitude2) {
    var getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum;

    return getMagnitudeFromIllum(getIllumFromMagnitude(magnitude1) + getIllumFromMagnitude(magnitude2));
};

MLB.calcLib.addArrayMagnitudes = function (magnitudes) {
    var getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        totalIllum = 0;

    if (magnitudes === undefined || magnitudes.length === 0) {
        return undefined;
    }

    magnitudes.forEach(function(value) {
        totalIllum += getIllumFromMagnitude(value) ;
    });
    return getMagnitudeFromIllum(totalIllum);
};

// aperture2 > aperture1 results in a negative magnitude difference
MLB.calcLib.magnitudeDifferenceBetweenApertures = function (aperture1, aperture2) {
    return MLB.calcLib.getMagnitudeFromIllum(aperture2 * aperture2 / aperture1 / aperture1);
};

// if magLoss = 0 (no mag loss), then return 1, ie, no aperture change,
// if magLoss = 0.4 then return 0.83 (equivalent aperture is 0.83 that of the original aperture) since illum reduced to 0.69
MLB.calcLib.calculateApertureFromMagnitude = function (mag) {
    var getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        illum = getIllumFromMagnitude(mag);

    return Math.sqrt(illum);
};

MLB.calcLib.diagObstructionArea = function (mirrorDia, diagSize) {
    return diagSize / mirrorDia * diagSize / mirrorDia;
};

// diagonal offset at right angle to focal plane: need to offset away from focuser and again towards the primary mirror;
// from http://www.telescope-optics.net/newtonian.htm
MLB.calcLib.calcDiagOffsetUsingFocalPoint = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance) {
    return (mirrorDia - diagSize) * diagSize / (4 * (focalLen - diagToFocalPlaneDistance));
};

// from an old Sky and Telescope magazine article (note that the offset is negative)
MLB.calcLib.calcDiagOffsetUsingFullIllumField = function (mirrorDia, focalLen, diagSize, diagToFocalPlaneDistance) {
    var sagitta,
        focalRatio,
        fullyIllumFieldDia,
        p,
        q,
        r,
        n,
        f,
        calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic;

    sagitta = calcSagittaParabolic(mirrorDia, focalLen / mirrorDia);
    focalRatio = focalLen / mirrorDia;
    fullyIllumFieldDia = diagSize - diagToFocalPlaneDistance / focalRatio;
    p = fullyIllumFieldDia * (focalLen - sagitta) + diagToFocalPlaneDistance * (mirrorDia - fullyIllumFieldDia);
    q = 2 * (focalLen - sagitta) - (mirrorDia - fullyIllumFieldDia);
    r = 2 * (focalLen - sagitta) + (mirrorDia - fullyIllumFieldDia);
    n = p / q;
    f = p / r;
    return (f - n) / 2;
};

// adjusts offset for field diameter by using the diagonal to eye distance;
// since diagToEyeDistance > diagToFocalPlaneDistance, the offset will shrink as the diagonal appears closer to the primary mirror;
// from http://www.telescope-optics.net/newtonian.htm
MLB.calcLib.calcDiagOffsetUsingEyeToDiagDistance = function (diagMinorAxis, diagToEyeDistance) {
    return -diagMinorAxis * diagMinorAxis / 4 / diagToEyeDistance;
};

/* from my offset based on field edge study:
    for equal angles, the vertical/horizontal ratio of the
    lefthand side will equal that of the righthand side
    lefthand side: vertical = l - ma/2 - offset
    righthand side: vertical = l + ma/2 + offset
    lefthand side: horizontal = ma/2 - fieldDia/2 - offset
    righthand side: horizontal = ma/2 - fieldDia/2 + offset
    x = l - ma/2; y = l + ma/2; z = ma/2 - fieldDia/2;
    (x-o)/(z-o)=(y+o)/(z+o) ; (z+o)(x-o) = (y+o)(z-o);
    zx - zo + xo - o^2 = yz - yo + zo - o^2;
    xz - zo + xo = yz - yo + zo;
    -zo + xo + yo - zo = yz - xz;
    o (y - 2z + x) = yz - xz;
    o = z(y - x) / (y - 2z + x)
    note that y - x = ma, therefore o also = z * ma / (y - 2z + x)
    ma = 2.828; ma/2 = 1.414; fieldDia/2 = 1; l = 3
    x = 1.586; y = 4.414; z = 0.414
    o = 0.414*2.828/(4.414-2*0.414+1.586)
    o =1.171/5.172=0.226
*/
MLB.calcLib.calcDiagOffsetUsingFieldEdge = function(diagSize, diagToFocalPlaneDistance, fieldDia) {
    var diagSizeHalf = diagSize / 2,
        x = diagToFocalPlaneDistance - diagSizeHalf,
        y = diagToFocalPlaneDistance + diagSizeHalf,
        z = diagSizeHalf - fieldDia / 2;

    return  z * (y - x) / (y - 2 * z + x);
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

// http://stackoverflow.com/questions/4247889/area-of-intersection-between-two-circles
MLB.calcLib.areaIntersectingCircles = function (x0, y0, r0, x1, y1, r1) {
    var rr0 = r0 * r0,
        rr1 = r1 * r1,
        d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)),
        phi,
        theta,
        area1,
        area2;

    // Circles do not overlap
    if (d > r1 + r0) {
        return 0;
    }

    // Circle1 is completely inside circle0
    if (d <= Math.abs(r0 - r1) && r0 >= r1) {
        // Return area of circle1
        return Math.PI * rr1;
    }

    // Circle0 is completely inside circle1
    if (d <= Math.abs(r0 - r1) && r0 < r1) {
        // Return area of circle0
        return Math.PI * rr0;
    }

    // Circles partially overlap
    phi = (Math.acos((rr0 + (d * d) - rr1) / (2 * r0 * d))) * 2;
    theta = (Math.acos((rr1 + (d * d) - rr0) / (2 * r1 * d))) * 2;
    area1 = 0.5 * theta * rr1 - 0.5 * rr1 * Math.sin(theta);
    area2 = 0.5 * phi * rr0 - 0.5 * rr0 * Math.sin(phi);

    // Return area of intersection
    return area1 + area2;
};

// no shortening when secondaryBendingAngleDeg = 90 and tertiaryBendingAngleDeg = 0;
// see binoLayoutForNewtDesigner4.jpg
MLB.calcLib.calcBinoscopeMinimumFocalPlaneToSecondaryDistance = function (aperture, focalPointPerpendicularOffsetFromEdgeOfPrimary, focalPlaneToTertiaryDistance, secondaryBendingAngleDeg, tertiaryBendingAngleDeg) {
    var uom = MLB.sharedLib.uom,
        secondaryToTertiaryDistance,
        shortenedVerticalDistanceDueToTertiaryBendingAngle,
        minimumFocalPlaneToSecondaryDistance;

        shortenedVerticalDistanceDueToTertiaryBendingAngle = Math.sin(tertiaryBendingAngleDeg * uom.degToRad) * focalPlaneToTertiaryDistance;
        secondaryToTertiaryDistance = (aperture / 2 + focalPointPerpendicularOffsetFromEdgeOfPrimary - shortenedVerticalDistanceDueToTertiaryBendingAngle) / Math.cos((90 - secondaryBendingAngleDeg) * uom.degToRad);
        minimumFocalPlaneToSecondaryDistance = secondaryToTertiaryDistance + focalPlaneToTertiaryDistance;

    return {
        minimumFocalPlaneToSecondaryDistance: minimumFocalPlaneToSecondaryDistance,
        shortenedVerticalDistanceDueToTertiaryBendingAngle: shortenedVerticalDistanceDueToTertiaryBendingAngle,
        secondaryToTertiaryDistance: secondaryToTertiaryDistance
    };
};

MLB.calcLib.calcBinoscopeSecondaryBendingAngle = function (aperture, focalPointPerpendicularOffsetFromEdgeOfPrimary, focalPlaneToSecondaryDistance, focalPlaneToTertiaryDistance, tertiaryBendingAngleDeg) {
    var uom = MLB.sharedLib.uom,
        secondaryToTertiaryDistance,
        shortenedVerticalDistanceDueToTertiaryBendingAngle,
        secondaryToTertiaryVerticalDistance,
        elbowAngleRad,
        elbowAngleDeg;

    // hypotenuse
    secondaryToTertiaryDistance = focalPlaneToSecondaryDistance - focalPlaneToTertiaryDistance;
    shortenedVerticalDistanceDueToTertiaryBendingAngle = Math.sin(tertiaryBendingAngleDeg * uom.degToRad) * focalPlaneToTertiaryDistance;
    // side
    secondaryToTertiaryVerticalDistance = aperture / 2 + focalPointPerpendicularOffsetFromEdgeOfPrimary - shortenedVerticalDistanceDueToTertiaryBendingAngle;

    /* math floating point precision problem:
    for example, using NewtDesigner defaults then setting aperture to 23.3 results in an Math.asin out of bounds (needs to be -1 to 1 but is ever so slightly above 1) error:
    secondaryToTertiaryVerticalDistance vs secondaryToTertiaryDistance of 14.65 vs 14.649999999999999, a difference of 1.7763568394002505e-15
    */
    if (Math.abs(secondaryToTertiaryVerticalDistance - secondaryToTertiaryDistance) <= 1.7763568394002505e-15) {
        elbowAngleRad = uom.qtrRev;
    } else {
        // no bending is defined as elbow angle = 90 deg
        elbowAngleRad = Math.asin(secondaryToTertiaryVerticalDistance / secondaryToTertiaryDistance);
    }
    elbowAngleDeg = elbowAngleRad / uom.degToRad;

    return {
        elbowAngleRad: elbowAngleRad,
        elbowAngleDeg: elbowAngleDeg,
        secondaryToTertiaryDistance: secondaryToTertiaryDistance,
        shortenedVerticalDistanceDueToTertiaryBendingAngle: shortenedVerticalDistanceDueToTertiaryBendingAngle,
        secondaryToTertiaryVerticalDistance: secondaryToTertiaryVerticalDistance
    };
};

MLB.calcLib.calcBinoscopeEquivalentApertureBinoviewer = function (aperture) {
    return aperture * 1.4;
};

// based on empirical results across a variety of binoscopes over the decades
MLB.calcLib.calcBinoscopeEquivalentApertureStar = function (aperture) {
    return {
        low: aperture * 1.2,
        high: aperture * 1.4
    };
};

MLB.calcLib.calcBinoscopeEquivalentApertureNebulosity = function (aperture) {
    return {
        low: aperture * 1.4,
        high: aperture * 1.8
    };
};

// see eyepiece divergence study.jpg
MLB.calcLib.calcEyepieceDivergenceFromTertiaryBendingAngle = function (tertiaryBendingAngleDeg, secondaryAxisDownwardTiltAngleDeg) {
    var uom = MLB.sharedLib.uom;

    return tertiaryBendingAngleDeg * Math.cos(secondaryAxisDownwardTiltAngleDeg * uom.degToRad);
};

MLB.calcLib.calcTertiaryBendingAngleFromEyepieceDivergence = function (eyepieceDivergenceDeg, secondaryAxisDownwardTiltAngleDeg) {
    var uom = MLB.sharedLib.uom;

    return eyepieceDivergenceDeg / Math.cos(secondaryAxisDownwardTiltAngleDeg * uom.degToRad);
};

MLB.calcLib.calcEyepieceTipdownFromSecToTertTipdownAndTertBend = function (tertiaryBendingAngleDeg, secondaryAxisDownwardTiltAngleDeg) {
    var uom = MLB.sharedLib.uom;

    return tertiaryBendingAngleDeg * Math.sin(secondaryAxisDownwardTiltAngleDeg * uom.degToRad);
};

// binoscope secondary and tertiary mirrors calculator;
// see binoLayoutForNewtDesigner1.jpg, binoLayoutForNewtDesigner2.jpg, binoLayoutForNewtDesigner3.jpg, binoLayoutForNewtDesigner4.jpg
MLB.calcLib.calcBinoscope = function (mirrorDia, focalRatio, focalPointOffsetFromEdgeOfPrimary, focalPlaneToTertiaryDistance, focalPlaneToSecondaryDistance, secondaryBendingAngleDeg, tertiaryBendingAngleDeg, fieldDia) {
    var uom = MLB.sharedLib.uom,
        focalLength,
        primaryToSecondaryDistance,
        primaryToP3HorizontalDistance,
        secondaryToTertiaryDistance,
        secondaryToTertiaryVerticalLength,
        secondaryToTertiaryHorizontalLength,
        elbowAngleRad,
        elbowAngleDeg,
        anglePrimaryMirrorEdgeToP1Rad,
        anglePrimaryMirrorEdgeToP1Deg,
        anglePrimaryMirrorEdgeToP1AndVerticalRad,
        anglePrimaryMirrorEdgeToP1AndVerticalDeg,
        anglePrimaryMirrorEdgeToP1AndVerticalOutsideRad,
        anglePrimaryMirrorEdgeToP1AndVerticalOutsideDeg,
        secondaryCenterToPrimaryMirrorEdgeRayLength,
        angleSecondaryFaceToVerticalRad,
        angleSecondaryFaceToVerticalDeg,
        angle3UpperRad,
        angle3UpperDeg,
        angle3LowerRad,
        angle3LowerDeg,
        secondaryUpperLength,
        secondaryLowerLength,
        secondaryMajorAxis,
        secondaryMinorAxis,
        secondaryOffset,
        secondaryUpperPointXLength,
        secondaryUpperPointYLength,
        secondaryLowerPointXLength,
        secondaryLowerPointYLength,
        tertiarySizedForP3ToSecondaryRatio,
        tertiarySizedForP3UpperLength,
        tertiarySizedForP3LowerLength,
        tertiarySizedForP3MajorAxis,
        tertiarySizedForP3MinorAxis,
        tertiarySizedForP3Offset,
        tertiarySizedForP3UpperPointXLength,
        tertiarySizedForP3UpperPointYLength,
        tertiarySizedForP3LowerPointXLength,
        tertiarySizedForP3LowerPointYLength,
        // P2 is focal plane as projected by the secondary mirror
        P2centerXLengthFromSecondaryCenter,
        P2centerYLengthFromSecondaryCenter,
        P2FieldEdgeXLengthFromP2Center,
        P2FieldEdgeYLengthFromP2Center,
        P2centerXLengthFromTertiaryCenter,
        P2centerYLengthFromTertiaryCenter,
        secondaryRightEdgeToP2FieldRightEdgeX,
        secondaryRightEdgeToP2FieldRightEdgeY,
        secondaryLeftEdgeToP2FieldLeftEdgeX,
        secondaryLeftEdgeToP2FieldLeftEdgeY,
        slopeSecondaryRightEdgeToP2FieldRightEdge,
        slopeSecondaryLeftEdgeToP2FieldLeftEdge,
        slopeTertiary,
        r1X,
        r2X,
        // P3 is the focal plane after being reflected by the secondary and tertiary
        tertiarySizedForP3FieldUpperPointXLength,
        tertiarySizedForP3FieldUpperPointYLength,
        tertiarySizedForP3FieldLowerPointXLength,
        tertiarySizedForP3FieldLowerPointYLength,
        tertiarySizedForP3FieldUpperLength,
        tertiarySizedForP3FieldLowerLength,
        tertiarySizedForP3FieldMajorAxis,
        tertiarySizedForP3FieldMinorAxis,
        tertiarySizedForP3FieldOffset,
        y2,
        x2,
        s2,
        yU,
        xU,
        yL,
        xL,
        tertiarySizedForP3FieldAndFocalRatioUpperPointXLength,
        tertiarySizedForP3FieldAndFocalRatioUpperPointYLength,
        tertiarySizedForP3FieldAndFocalRatioUpperLength,
        tertiarySizedForP3FieldAndFocalRatioLowerPointXLength,
        tertiarySizedForP3FieldAndFocalRatioLowerPointYLength,
        tertiarySizedForP3FieldAndFocalRatioLowerLength,
        tertiaryBendingAngleRad,
        P3centerXLengthFromTertiaryCenter,
        P3centerYLengthFromTertiaryCenter,
        P3FieldEdgeXLengthFromP3Center,
        P3FieldEdgeYLengthFromP3Center,
        tertiaryAngledAtPrimaryRad,
        tertiaryAngledAtPrimaryDeg,
        tertiaryAngledAtFocalPlaneRad,
        tertiaryAngledAtFocalPlaneDeg,
        tertiaryAngledAtMaxLengthMinorAxis,
        tertiaryAngledAtMaxLengthMajorAxis,
        tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter,
        tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter;

    // no elbow angle = 90 deg
    elbowAngleDeg = secondaryBendingAngleDeg;
    elbowAngleRad = elbowAngleDeg * uom.degToRad;

    focalLength = mirrorDia * focalRatio;

    // primary to secondary distance (always horizontal)
    primaryToSecondaryDistance = focalLength - focalPlaneToSecondaryDistance;

    // secondary to tertiary distance (can be angled)
    secondaryToTertiaryDistance = focalPlaneToSecondaryDistance - focalPlaneToTertiaryDistance;
    secondaryToTertiaryHorizontalLength = Math.cos(elbowAngleRad) * (secondaryToTertiaryDistance);
    secondaryToTertiaryVerticalLength = Math.sin(elbowAngleRad) * (secondaryToTertiaryDistance);

    // get primary mirror edge to focal point angle and to vertical line
    anglePrimaryMirrorEdgeToP1Rad = Math.atan(mirrorDia / 2 / focalLength);
    anglePrimaryMirrorEdgeToP1Deg = anglePrimaryMirrorEdgeToP1Rad / uom.degToRad;
    anglePrimaryMirrorEdgeToP1AndVerticalRad = uom.qtrRev - anglePrimaryMirrorEdgeToP1Rad;
    anglePrimaryMirrorEdgeToP1AndVerticalDeg = anglePrimaryMirrorEdgeToP1AndVerticalRad / uom.degToRad;
    anglePrimaryMirrorEdgeToP1AndVerticalOutsideRad = uom.qtrRev + anglePrimaryMirrorEdgeToP1Rad;
    anglePrimaryMirrorEdgeToP1AndVerticalOutsideDeg = anglePrimaryMirrorEdgeToP1AndVerticalOutsideRad / uom.degToRad;

    // distance from secondary center to top of ray from primary mirror edge to focal point
    secondaryCenterToPrimaryMirrorEdgeRayLength = focalPlaneToSecondaryDistance / focalRatio / 2;

    // angle from secondary face to a vertical line is half that of the elbow angle
    angleSecondaryFaceToVerticalRad = elbowAngleRad / 2;
    angleSecondaryFaceToVerticalDeg = angleSecondaryFaceToVerticalRad / uom.degToRad;

    // solve for upward half of secondary size
    angle3UpperRad = uom.halfRev - anglePrimaryMirrorEdgeToP1AndVerticalRad - angleSecondaryFaceToVerticalRad;
    angle3UpperDeg = angle3UpperRad / uom.degToRad;
    secondaryUpperLength = Math.sin(anglePrimaryMirrorEdgeToP1AndVerticalRad) * secondaryCenterToPrimaryMirrorEdgeRayLength / Math.sin(angle3UpperRad);

    // solve for lower half of secondary size
    angle3LowerRad = uom.halfRev - anglePrimaryMirrorEdgeToP1AndVerticalOutsideRad - angleSecondaryFaceToVerticalRad;
    angle3LowerDeg = angle3LowerRad / uom.degToRad;
    secondaryLowerLength = Math.sin(anglePrimaryMirrorEdgeToP1AndVerticalOutsideRad) * secondaryCenterToPrimaryMirrorEdgeRayLength / Math.sin(angle3LowerRad);

    // secondary size and offset
    secondaryMajorAxis = secondaryUpperLength + secondaryLowerLength;
    secondaryMinorAxis = secondaryCenterToPrimaryMirrorEdgeRayLength * 2;
    secondaryOffset = secondaryLowerLength - secondaryMajorAxis / 2;

    // secondary end point distances
    secondaryUpperPointYLength = Math.cos(angleSecondaryFaceToVerticalRad) * secondaryUpperLength;
    secondaryUpperPointXLength = Math.sin(angleSecondaryFaceToVerticalRad) * secondaryUpperLength;
    secondaryLowerPointYLength = Math.cos(angleSecondaryFaceToVerticalRad) * secondaryLowerLength;
    secondaryLowerPointXLength = Math.sin(angleSecondaryFaceToVerticalRad) * secondaryLowerLength;

    // tertiarySizedForP3 is a smaller version of the secondary, since the finishing optical axis is parallel to the primary mirror axis
    tertiarySizedForP3ToSecondaryRatio = focalPlaneToTertiaryDistance / focalPlaneToSecondaryDistance;
    tertiarySizedForP3UpperLength = secondaryUpperLength * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3LowerLength = secondaryLowerLength * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3MajorAxis = secondaryMajorAxis * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3MinorAxis = secondaryMinorAxis * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3Offset = secondaryOffset * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3UpperPointXLength = secondaryUpperPointXLength * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3UpperPointYLength = secondaryUpperPointYLength * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3LowerPointXLength = secondaryLowerPointXLength * tertiarySizedForP3ToSecondaryRatio;
    tertiarySizedForP3LowerPointYLength = secondaryLowerPointYLength * tertiarySizedForP3ToSecondaryRatio;

    P2centerXLengthFromSecondaryCenter = Math.cos(elbowAngleRad) * focalPlaneToSecondaryDistance;
    P2centerYLengthFromSecondaryCenter = Math.sin(elbowAngleRad) * focalPlaneToSecondaryDistance;

    P2centerXLengthFromTertiaryCenter = P2centerXLengthFromSecondaryCenter * tertiarySizedForP3ToSecondaryRatio;
    P2centerYLengthFromTertiaryCenter = P2centerYLengthFromSecondaryCenter * tertiarySizedForP3ToSecondaryRatio;

    P2FieldEdgeXLengthFromP2Center = Math.sin(elbowAngleRad) * fieldDia / 2;
    P2FieldEdgeYLengthFromP2Center = Math.cos(elbowAngleRad) * fieldDia / 2;

    secondaryRightEdgeToP2FieldRightEdgeX = P2centerXLengthFromSecondaryCenter + secondaryUpperPointXLength - P2FieldEdgeXLengthFromP2Center;
    secondaryRightEdgeToP2FieldRightEdgeY = P2centerYLengthFromSecondaryCenter - secondaryUpperPointYLength + P2FieldEdgeYLengthFromP2Center;
    secondaryLeftEdgeToP2FieldLeftEdgeX = P2centerXLengthFromSecondaryCenter - secondaryLowerPointXLength + P2FieldEdgeXLengthFromP2Center;
    secondaryLeftEdgeToP2FieldLeftEdgeY = P2centerYLengthFromSecondaryCenter + secondaryLowerPointYLength - P2FieldEdgeYLengthFromP2Center;

    // tertiarySizedForP3Field fits between the secondary and the focal plane (not focal point);
    // to calculate, start with the slopes
    slopeSecondaryRightEdgeToP2FieldRightEdge = secondaryRightEdgeToP2FieldRightEdgeY / secondaryRightEdgeToP2FieldRightEdgeX;
    slopeSecondaryLeftEdgeToP2FieldLeftEdge = secondaryLeftEdgeToP2FieldLeftEdgeY / secondaryLeftEdgeToP2FieldLeftEdgeX;
    slopeTertiary = secondaryUpperPointYLength / secondaryUpperPointXLength;

    // need to know the intersections:
    // r1X is the x offset between the tertiary center and the line between the right hand side of the P2 field edge and the secondary edge
    // r2X is the same but for the left hand side of the P2 field edge to the secondary edge
    r1X = -P2centerXLengthFromTertiaryCenter + P2FieldEdgeXLengthFromP2Center + secondaryRightEdgeToP2FieldRightEdgeX * (P2centerYLengthFromTertiaryCenter + P2FieldEdgeYLengthFromP2Center) / secondaryRightEdgeToP2FieldRightEdgeY;
    r2X = -P2centerXLengthFromTertiaryCenter - P2FieldEdgeXLengthFromP2Center + secondaryLeftEdgeToP2FieldLeftEdgeX * (P2centerYLengthFromTertiaryCenter - P2FieldEdgeYLengthFromP2Center) / secondaryLeftEdgeToP2FieldLeftEdgeY;

    /* solve for two intersection of two lines:
        y = rightHandSlope * (r1X - x) and y = tertiarySlope * x
        setting the y's equal to each other: rightHandSlope * (r1X - x) = tertiarySlope * x; x = (rightHandSlope * r1X) / (rightHandSlope + tertiarySlope);
        ditto for the left hand side except that r2X is negative
    */
    tertiarySizedForP3FieldUpperPointXLength = r1X * slopeSecondaryRightEdgeToP2FieldRightEdge / (slopeSecondaryRightEdgeToP2FieldRightEdge + slopeTertiary);
    tertiarySizedForP3FieldUpperPointYLength = tertiarySizedForP3FieldUpperPointXLength * slopeTertiary;
    tertiarySizedForP3FieldUpperLength = Math.sqrt(tertiarySizedForP3FieldUpperPointXLength * tertiarySizedForP3FieldUpperPointXLength + tertiarySizedForP3FieldUpperPointYLength * tertiarySizedForP3FieldUpperPointYLength);

    tertiarySizedForP3FieldLowerPointXLength = -r2X * slopeSecondaryLeftEdgeToP2FieldLeftEdge / (slopeSecondaryLeftEdgeToP2FieldLeftEdge + slopeTertiary);
    tertiarySizedForP3FieldLowerPointYLength = tertiarySizedForP3FieldLowerPointXLength * slopeTertiary;
    tertiarySizedForP3FieldLowerLength = Math.sqrt(tertiarySizedForP3FieldLowerPointXLength * tertiarySizedForP3FieldLowerPointXLength + tertiarySizedForP3FieldLowerPointYLength * tertiarySizedForP3FieldLowerPointYLength);
    tertiarySizedForP3FieldMajorAxis = tertiarySizedForP3FieldLowerLength + tertiarySizedForP3FieldUpperLength;
    tertiarySizedForP3FieldMinorAxis = (secondaryMinorAxis - fieldDia) * tertiarySizedForP3ToSecondaryRatio + fieldDia;
    // or tertiarySizedForP3FieldOffset = tertiarySizedForP3FieldMajorAxis / 2 - tertiarySizedForP3FieldUpperLength
    tertiarySizedForP3FieldOffset = (tertiarySizedForP3FieldLowerLength - tertiarySizedForP3FieldUpperLength) / 2;

    /* alternative tertiary based on P3Field and focal ratio (results in too large of a tertiary because the secondary is calculated for a point sized P3 field)
    included here to study
    using the Sketchup coordinate convention:
    y1,x1 is the center of the tertiary where the on-axis ray intersects the tertiary (assume to be zero: plot from tertiary center that is calculated during plotting)
    y2,x2 is the P2 field edge
    XL is the tertiary to P2 distance (secondaryToTertiaryDistance calculated above)
    s1 = slopeTertiary
    s2 = 1/(FR*2) = mirrorDia / 2 / focalLength
    y,x is the tertiary edge
    from the Sketchup:
    tertiary upper pt:
        x = (y2-y1+x1s1+x2s2)/(s1+s2)
        and y = y1+(x-x1)s1
    */
    y2 = fieldDia / 2;
    x2 = focalPlaneToTertiaryDistance;
    s2 = mirrorDia / 2 / focalLength;
    xU = (y2 + x2 * s2) / (slopeTertiary + s2);
    yU = xU * slopeTertiary;
    xL = (y2 + x2 * s2) / (slopeTertiary - s2);
    yL = xL * slopeTertiary;

    tertiarySizedForP3FieldAndFocalRatioUpperPointXLength = xU;
    tertiarySizedForP3FieldAndFocalRatioUpperPointYLength = yU;
    tertiarySizedForP3FieldAndFocalRatioUpperLength = Math.sqrt(xU * xU + yU * yU, 2);
    tertiarySizedForP3FieldAndFocalRatioLowerPointXLength = xL;
    tertiarySizedForP3FieldAndFocalRatioLowerPointYLength = yL;
    tertiarySizedForP3FieldAndFocalRatioLowerLength = Math.sqrt(xL * xL + yL * yL, 2);

    // for tilted or bent tertiary to focal plane
    tertiaryBendingAngleRad = tertiaryBendingAngleDeg * uom.degToRad;
    P3centerXLengthFromTertiaryCenter = Math.cos(tertiaryBendingAngleRad) * focalPlaneToTertiaryDistance;
    P3centerYLengthFromTertiaryCenter = Math.sin(tertiaryBendingAngleRad) * focalPlaneToTertiaryDistance;
    P3FieldEdgeXLengthFromP3Center = Math.sin(tertiaryBendingAngleRad) * fieldDia / 2;
    P3FieldEdgeYLengthFromP3Center = Math.cos(tertiaryBendingAngleRad) * fieldDia / 2;

    /* mirror facing horizontal = 0 deg; mirror facing upward = 90 deg;
       secondary and tertiary have same convention;
       secondary to tertiary angle is opposite convention: line between them that angles straight upward = 90 deg;
       see binoLayoutForNewtDesigner4.jpg
    */
    tertiaryAngledAtPrimaryRad = (elbowAngleRad - tertiaryBendingAngleRad) / 2;
    tertiaryAngledAtPrimaryDeg = tertiaryAngledAtPrimaryRad / uom.degToRad;
    tertiaryAngledAtFocalPlaneRad = tertiaryAngledAtPrimaryRad + tertiaryBendingAngleRad;
    tertiaryAngledAtFocalPlaneDeg = tertiaryAngledAtFocalPlaneRad / uom.degToRad;
    // expand focal plane size by distance/FR for full illumination of field
    tertiaryAngledAtMaxLengthMinorAxis = focalPlaneToTertiaryDistance / focalRatio + fieldDia;
    tertiaryAngledAtMaxLengthMajorAxis = tertiaryAngledAtMaxLengthMinorAxis / Math.cos(tertiaryAngledAtFocalPlaneRad);
    tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter = Math.sin(tertiaryAngledAtPrimaryRad) * tertiaryAngledAtMaxLengthMajorAxis / 2;
    tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter = Math.cos(tertiaryAngledAtPrimaryRad) * tertiaryAngledAtMaxLengthMajorAxis / 2;

    primaryToP3HorizontalDistance = primaryToSecondaryDistance - secondaryToTertiaryHorizontalLength + focalPlaneToTertiaryDistance;

    return {
        focalLength: focalLength,
        primaryToSecondaryDistance: primaryToSecondaryDistance,
        primaryToP3HorizontalDistance: primaryToP3HorizontalDistance,
        secondaryToTertiaryDistance: secondaryToTertiaryDistance,
        secondaryToTertiaryVerticalLength: secondaryToTertiaryVerticalLength,
        secondaryToTertiaryHorizontalLength: secondaryToTertiaryHorizontalLength,
        elbowAngleRad: elbowAngleRad,
        elbowAngleDeg: elbowAngleDeg,
        anglePrimaryMirrorEdgeToP1Rad: anglePrimaryMirrorEdgeToP1Rad,
        anglePrimaryMirrorEdgeToP1Deg: anglePrimaryMirrorEdgeToP1Deg,
        anglePrimaryMirrorEdgeToP1AndVerticalRad: anglePrimaryMirrorEdgeToP1AndVerticalRad,
        anglePrimaryMirrorEdgeToP1AndVerticalDeg: anglePrimaryMirrorEdgeToP1AndVerticalDeg,
        secondaryCenterToPrimaryMirrorEdgeRayLength: secondaryCenterToPrimaryMirrorEdgeRayLength,
        angleSecondaryFaceToVerticalRad: angleSecondaryFaceToVerticalRad,
        angleSecondaryFaceToVerticalDeg: angleSecondaryFaceToVerticalDeg,
        secondaryUpperLength: secondaryUpperLength,
        secondaryLowerLength: secondaryLowerLength,
        secondaryMajorAxis: secondaryMajorAxis,
        secondaryMinorAxis: secondaryMinorAxis,
        secondaryOffset: secondaryOffset,
        secondaryUpperPointYLength: secondaryUpperPointYLength,
        secondaryUpperPointXLength: secondaryUpperPointXLength,
        secondaryLowerPointYLength: secondaryLowerPointYLength,
        secondaryLowerPointXLength: secondaryLowerPointXLength,
        // same angle as secondary since finishing optical axis is parallel to primary mirror axis
        angleTertiaryFaceToVerticalRad: angleSecondaryFaceToVerticalRad,
        angleTertiaryFaceToVerticalDeg: angleSecondaryFaceToVerticalDeg,
        tertiarySizedForP3UpperLength: tertiarySizedForP3UpperLength,
        tertiarySizedForP3LowerLength: tertiarySizedForP3LowerLength,
        tertiarySizedForP3MajorAxis: tertiarySizedForP3MajorAxis,
        tertiarySizedForP3MinorAxis: tertiarySizedForP3MinorAxis,
        tertiarySizedForP3Offset: tertiarySizedForP3Offset,
        tertiarySizedForP3UpperPointYLength: tertiarySizedForP3UpperPointYLength,
        tertiarySizedForP3UpperPointXLength: tertiarySizedForP3UpperPointXLength,
        tertiarySizedForP3LowerPointYLength: tertiarySizedForP3LowerPointYLength,
        tertiarySizedForP3LowerPointXLength: tertiarySizedForP3LowerPointXLength,
        P2centerXLengthFromSecondaryCenter: P2centerXLengthFromSecondaryCenter,
        P2centerYLengthFromSecondaryCenter: P2centerYLengthFromSecondaryCenter,
        P2centerXLengthFromTertiaryCenter: P2centerXLengthFromTertiaryCenter,
        P2centerYLengthFromTertiaryCenter: P2centerYLengthFromTertiaryCenter,
        P2FieldEdgeXLengthFromP2Center: P2FieldEdgeXLengthFromP2Center,
        P2FieldEdgeYLengthFromP2Center: P2FieldEdgeYLengthFromP2Center,
        secondaryRightEdgeToP2FieldRightEdgeX: secondaryRightEdgeToP2FieldRightEdgeX,
        secondaryRightEdgeToP2FieldRightEdgeY: secondaryRightEdgeToP2FieldRightEdgeY,
        secondaryLeftEdgeToP2FieldLeftEdgeX: secondaryLeftEdgeToP2FieldLeftEdgeX,
        secondaryLeftEdgeToP2FieldLeftEdgeY: secondaryLeftEdgeToP2FieldLeftEdgeY,
        slopeSecondaryRightEdgeToP2FieldRightEdge: slopeSecondaryRightEdgeToP2FieldRightEdge,
        slopeSecondaryLeftEdgeToP2FieldLeftEdge: slopeSecondaryLeftEdgeToP2FieldLeftEdge,
        slopeTertiary : slopeTertiary,
        r1X: r1X,
        r2X: r2X,
        tertiarySizedForP3FieldUpperPointXLength: tertiarySizedForP3FieldUpperPointXLength,
        tertiarySizedForP3FieldUpperPointYLength: tertiarySizedForP3FieldUpperPointYLength,
        tertiarySizedForP3FieldUpperLength: tertiarySizedForP3FieldUpperLength,
        tertiarySizedForP3FieldLowerPointXLength: tertiarySizedForP3FieldLowerPointXLength,
        tertiarySizedForP3FieldLowerPointYLength: tertiarySizedForP3FieldLowerPointYLength,
        tertiarySizedForP3FieldLowerLength: tertiarySizedForP3FieldLowerLength,
        tertiarySizedForP3FieldMajorAxis: tertiarySizedForP3FieldMajorAxis,
        tertiarySizedForP3FieldMinorAxis: tertiarySizedForP3FieldMinorAxis,
        tertiarySizedForP3FieldOffset: tertiarySizedForP3FieldOffset,
        tertiarySizedForP3FieldAndFocalRatioUpperPointXLength: tertiarySizedForP3FieldAndFocalRatioUpperPointXLength,
        tertiarySizedForP3FieldAndFocalRatioUpperPointYLength: tertiarySizedForP3FieldAndFocalRatioUpperPointYLength,
        tertiarySizedForP3FieldAndFocalRatioUpperLength: tertiarySizedForP3FieldAndFocalRatioUpperLength,
        tertiarySizedForP3FieldAndFocalRatioLowerPointXLength: tertiarySizedForP3FieldAndFocalRatioLowerPointXLength,
        tertiarySizedForP3FieldAndFocalRatioLowerPointYLength: tertiarySizedForP3FieldAndFocalRatioLowerPointYLength,
        tertiarySizedForP3FieldAndFocalRatioLowerLength: tertiarySizedForP3FieldAndFocalRatioLowerLength,
        tertiaryBendingAngleRad: tertiaryBendingAngleRad,
        P3centerXLengthFromTertiaryCenter: P3centerXLengthFromTertiaryCenter,
        P3centerYLengthFromTertiaryCenter: P3centerYLengthFromTertiaryCenter,
        P3FieldEdgeXLengthFromP3Center: P3FieldEdgeXLengthFromP3Center,
        P3FieldEdgeYLengthFromP3Center: P3FieldEdgeYLengthFromP3Center,
        tertiaryAngledAtPrimaryRad: tertiaryAngledAtPrimaryRad,
        tertiaryAngledAtPrimaryDeg: tertiaryAngledAtPrimaryDeg,
        tertiaryAngledAtFocalPlaneRad: tertiaryAngledAtFocalPlaneRad,
        tertiaryAngledAtFocalPlaneDeg: tertiaryAngledAtFocalPlaneDeg,
        tertiaryAngledAtMaxLengthMinorAxis: tertiaryAngledAtMaxLengthMinorAxis,
        tertiaryAngledAtMaxLengthMajorAxis: tertiaryAngledAtMaxLengthMajorAxis,
        tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter: tertiaryAngledAtXLengthMajorAxisFromTertiaryCenter,
        tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter: tertiaryAngledAtYLengthMajorAxisFromTertiaryCenter
    };
};

// folded Newtonian

// focalPointToDiagDistance is optional parm
MLB.calcLib.calcFoldedNewtonian = function (mirrorDia, focalRatio, diagSize, focalPointOffsetFromEdgeOfPrimary, focalPointToTertiaryDistance, focalPointToDiagDistance) {
    var diagToPrimaryMirrorDistance,
        focalPointToPrimaryMirrorDistance,
        bentLightPathLength,
        bentLightPathVerticalLength,
        bentLightPathHorizontalLength,
        elbowAngleRad,
        elbowAngleDeg,
        diagMajorAxisSize,
        uom = MLB.sharedLib.uom;

    if (focalPointToDiagDistance === undefined) {
        focalPointToDiagDistance = focalRatio * diagSize;
    }
    diagToPrimaryMirrorDistance = focalRatio * mirrorDia - focalPointToDiagDistance;

    // the distance along the primary optical axis from the focal point projected onto this axis to the diagonal or folding mirror (excluding the focalPointToTertiaryDistance) that the light can be 'folded backwards' is one side of a triangle with the hypotenuse = bentLightPathLength and other side the bentLightPathVerticalLength;
    bentLightPathLength = focalPointToDiagDistance - focalPointToTertiaryDistance;
    bentLightPathVerticalLength = mirrorDia / 2 + focalPointOffsetFromEdgeOfPrimary;
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
        focalPointToDiagDistance: focalPointToDiagDistance,
        elbowAngleDeg: elbowAngleDeg,
        diagMajorAxisSize: diagMajorAxisSize
    };
};

MLB.calcLib.getFoldedNewtonianScalingFactor = function (width, height, focalRatio, diagSize, focalPointToTertiaryDistance, focalPointOffsetFromEdgeOfPrimary, diagToMirrorDistance) {
    var maxWidth,
        maxHeight,
        modelWidthToHeightRatio,
        graphicsWidthToHeightRatio,
        scalingFactor,
        margin;

    maxWidth = diagToMirrorDistance;
    maxHeight = (diagSize * focalRatio + focalPointToTertiaryDistance + focalPointOffsetFromEdgeOfPrimary) * 2;
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

/* see http://www.users.on.net/~dbenn/ECMAScript/surface_brightness.html
       view-source:http://www.users.on.net/~dbenn/ECMAScript/surface_brightness.html
   note that object surface brightness above is in magnitude per square arc-minute whereas the Blackwell data requires object surface brightness in square arc-seconds
   magnitude difference between square arc-seconds and square arc-minutes is (using circular area) 8.6283145212238; if using a square area it is 8.89075625191822 - see MLB.sharedLib.uom and calcLib unit tests
*/

MLB.calcLib.calcSurfaceBrightnessFromArea = function (objMag, minObjArcmin, maxObjArcmin) {
    var uom = MLB.sharedLib.uom,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude;

    return getMagnitudeFromIllum(getIllumFromMagnitude(objMag) / (minObjArcmin * maxObjArcmin * uom.sqrArcminToSqrArcsec));
};

MLB.calcLib.calcMagnitudeFromSurfaceBrightnessAndArea = function (objSurfaceBrightness, minObjArcmin, maxObjArcmin) {
    var uom = MLB.sharedLib.uom,
         getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude;

    return getMagnitudeFromIllum(getIllumFromMagnitude(objSurfaceBrightness) * minObjArcmin * maxObjArcmin * uom.sqrArcminToSqrArcsec);
};

// same answer as above function

MLB.calcLib.calcMagnitudePerArcMinSquaredFromSurfaceBrightnessAndEllipticalArea = function (objSurfaceBrightness, minObjArcmin, maxObjArcmin) {
    var getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude;

    return getMagnitudeFromIllum(getIllumFromMagnitude(objSurfaceBrightness) * minObjArcmin / 2 * maxObjArcmin / 2 * Math.PI);
};

// area of aperture times area of field of view in cm^2deg^2
MLB.calcLib.calcEtendue = function (apertureCm, FOVDeg) {
    return apertureCm * apertureCm * FOVDeg * FOVDeg * Math.PI * Math.PI / 16;
};

/*
from Rob Brown:
A = The product of the illuminated field times the solid angle subtended by the F number of the primary mirror
B = The product of the area of your eyeball pupil times the solid angle subtended by the apparent field of the eyepiece.
When A = B the true field will be maximized and no light will be wasted.

It follows then:
eq 1:
FR = arcsin(illumField / (eyePupil * eyepiece));
eq 2:
eyepiece field (the illumField) also = eyepiece focal length * eyepiece apparent field / 57.3,
so FR also = arcsin(eyepiece focal length * eyepiece apparent field / 57.3 / (eye pupil * eyepiece apparent field))
or FR = arcsin(eyepiece focal length / (eye pupil * 57.3));

ex 1:
illumField=3.6cm
FRAngle=21deg (F2.7)
eyePupil=0.76cm
eyepiece=100deg
A=3.6*21=76cmDeg
B=.76*100=76cmDeg   <-matches when pupil is 7.6mm
using eq 1: FR = arcsin(3.6/(.76*100))=arcsin(0.055)=2.72 (agrees w/ NewtDesigner)

ex 2:
illumField=3.6cm
FRAngle=21deg (F2.7)
eyePupil=0.66cm
eyepiece=100deg
A=3.6*21=76cmDeg
B=.66*100=66cmDeg   <-needs P2 magnification factor of 1.15 to match: either 76/1.15=66 or 66*1.14=76)
    76 reduced to 66 can be thought of as stretching or decreasing the solid angle subtended by the focal ratio from 2.74 to 3.15
    66 increased to 76 can be thought of as increasing the pupil or apparent eyepiece field of view by 1.15

using eq 1: FR = arcsin(3.6/(.66*100))=arcsin(0.055)=3.15 then divide by P2 of 1.15 = 2.74 (agrees w/ NewtDesigner)
using eq 2: FR = arcsin(21/6.7/57.3) = arcsin(0.055)=3.15 then divide by P2 as above

this function finds the focal ratio that maximizes entendue without wasting light for a given eyepiece focal length and eye pupil;
etendue can then be calculated by the aperture area * real field area or by the eye pupil area * eyepiece apparent field of view angle

we also know that the focal ratio of the eyepiece+eye combination should equal the focal ratio of the telescope;
focal ratio of the eyepiece+eye is eyepiece focal length / eye pupil, which is the same as arcsin(eyepiece focal length / eye pupil / 57.3) * 57.3
*/
MLB.calcLib.calcFocalRatioForMaxEtendue = function (eyepieceFLmm, eyePupilmm, comaCorrectorMagFactor) {
    //var FR = Math.asin(eyepieceFLmm / eyePupilmm / 57.3) * 57.3;
    var FR = eyepieceFLmm / eyePupilmm;

    if (comaCorrectorMagFactor) {
        FR /= comaCorrectorMagFactor;
    }
    return FR;
};

MLB.calcLib.VisualDetectCalcParms = function () {
    this.apertureIn = 0;
    this.bkgndBrightEye = 0;
    this.objName = '';
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
        surfBrightObj,
        objPlusBkgnd,
        contrastPercent,
        logContrastObject,
        bkgndBrightAtX,
        illumReductionAtX,
        objSizeDegAtX,
        surfBrightObjAtX,
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
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcSurfaceBrightnessFromArea = MLB.calcLib.calcSurfaceBrightnessFromArea,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        addArrayMagnitudes = MLB.calcLib.addArrayMagnitudes,
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

        // size
        objSizeDegAtX = roundToDecimal(x * parms.minObjArcmin / 60, 1) + ' x ' + roundToDecimal(x * parms.maxObjArcmin / 60, 1);

        // object brightness
        surfBrightObj = calcSurfaceBrightnessFromArea(parms.objMag, parms.minObjArcmin, parms.maxObjArcmin);
        objPlusBkgnd = addArrayMagnitudes([surfBrightObj, parms.bkgndBrightEye]);
        contrastPercent = (getIllumFromMagnitude(objPlusBkgnd - parms.bkgndBrightEye) - 1) * 100;

        // at magnification of X
        illumReductionAtX = (minX / x) * parms.singleEyeFactor * parms.scopeTrans;
        surfBrightObjAtX = getMagnitudeFromIllum(getIllumFromMagnitude(surfBrightObj) * illumReductionAtX);
        bkgndBrightAtX = getMagnitudeFromIllum(getIllumFromMagnitude(parms.bkgndBrightEye) * illumReductionAtX);
        surfBrightObjPlusBkgndAtX = addArrayMagnitudes([surfBrightObjAtX, bkgndBrightAtX]);

        // log of the magnitude difference between object and background;
        // question is which one was data built on?
        // these two following expressions give the same result...
        logContrastObject = -0.4 * (surfBrightObj - parms.bkgndBrightEye);
        //logContrastObject = -0.4 * (surfBrightObjAtX - bkgndBrightAtX);
        // ditto for these two...
        //logContrastObject = -0.4 * (objPlusBkgnd - parms.bkgndBrightEye);
        //logContrastObject = -0.4 * (surfBrightObjPlusBkgndAtX - bkgndBrightAtX);

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
            contrastPercent: contrastPercent,
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
            surfBrightObj: surfBrightObj,
            objPlusBkgnd: objPlusBkgnd,
            objSizeDegAtX: objSizeDegAtX,
            illumReductionAtX: illumReductionAtX,
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
        s = 'input values:\n' +
            '  aperture (in): ' + p.apertureIn + '\n' +
            '  eye limiting magnitude: ' + p.eyeLimitMag + '\n' +
            '  eye max exit pupil mm :' + p.exitPupilmm + '\n' +
            '  sky background brightness: ' + p.bkgndBrightEye + '\n' +
            '  object name: ' + p.objName + '\n' +
            '  object integrated magnitude: ' + p.objMag + '\n' +
            '  object dimensions arcmin: ' + p.maxObjArcmin + ' x ' + p.minObjArcmin + '\n' +
            '  eyepiece apparent field deg: ' + p.apparentFoV + '\n' +
            'calculated values:\n' +
            '  magnification: ' + Math.round(r.x) + '\n' +
            '  actual field deg: ' + r.actualFoV + '\n' +
            '  object fits FoV? ' + r.fitsFoV + '\n' +
            '  object surface brightness MPAS: ' + r.surfBrightObj + '\n' +
            '  object + sky brightness MPAS: ' + r.objPlusBkgnd + '\n' +
            '  at X:\n' +
            '    object size deg: ' + r.objSizeDegAtX + '\n' +
            '    brightness reduction: ' + r.illumReductionAtX + '\n' +
            '    object surface brightness MPAS: ' + r.surfBrightObjAtX + '\n' +
            '    sky MPAS: ' + r.bkgndBrightAtX + '\n' +
            '    object+sky surface brightness MPAS: ' + r.surfBrightObjPlusBkgndAtX + '\n' +
            '  contrast of object+sky to sky %: ' + r.contrastPercent + '\n' +
            '  log (object - sky): ' + r.logContrastObject + '\n' +
            '  log required: ' + r.logContrastRequired + '\n' +
            '  log difference: ' + r.logContrastDiff + '\n' +
            '  detectable? ' + r.detectable + '\n';

        return {
            parms: p,
            result: r,
            text: s
        };
    };

    this.includeResultAsJSON = function (result) {
        var rnd = function (num) {
                return MLB.sharedLib.roundToDecimal(num, 2);
            },
            r,
            p,
            json;

        r = result;
        p = r.parms;
        json = [
            {label: 'aperture (inches - mm)', result: rnd(p.apertureIn) + ' - ' + rnd(p.apertureIn * 25.4)},
            {label: 'is the object detectable?', result: r.detectable},
            {label: 'best  detection magnification \'X\'', result: Math.round(r.x)},
            {label: 'eye pupil (mm)', result: rnd(p.apertureIn / r.x * 25.4)},
            {label: '..', result: ''},
            {label: 'illumination multipler at \'X\'', result: rnd(r.illumReductionAtX)},
            {label: 'log (object-sky)', result: rnd(r.logContrastObject)},
            {label: 'log required', result: rnd(r.logContrastRequired)},
            {label: 'log difference', result: rnd(r.logContrastDiff)},
            {label: 'contrast of object+sky to sky %', result: rnd(r.contrastPercent)},
            {label: '..', result: ''},
            {label: 'eyepiece apparent field (degrees)', result: p.apparentFoV},
            {label: 'actual field (degrees)', result: rnd(r.actualFoV)},
            {label: 'Does the object fit into the field? ', result: r.fitsFoV},
            {label: 'object apparent size at X (degrees)', result: r.objSizeDegAtX},
            {label: '..', result: ''},
            {label: 'object surface brightness MPAS', result: rnd(r.surfBrightObj)},
            {label: 'sky background brightness MPAS', result: p.bkgndBrightEye},
            {label: 'object+sky brightness MPAS', result: rnd(r.objPlusBkgnd)},
            {label: '..', result: ''},
            {label: 'object brightness at \'X\' MPAS', result: rnd(r.surfBrightObjAtX)},
            {label: 'sky background brightness at \'X\' MPAS', result: rnd(r.bkgndBrightAtX)},
            {label: 'object+sky at \'X\' MPAS', result: rnd(r.surfBrightObjPlusBkgndAtX)}
        ];

        return {
            parms: p,
            result: r,
            json: json
        };
    };

    this.includeResultAsJSON_NewtDesigner = function (result, telescopeFLmm) {
        var rnd = function (num) {
                return MLB.sharedLib.roundToDecimal(num, 2);
            },
            r,
            p,
            json;

        r = result;
        p = r.parms;
        json = [
            {label: 'Is the object detectable?',                result: r.detectable},
            {label: 'Contrast of object+sky to sky',            result: rnd(r.contrastPercent) + '%'},
            {label: 'Best detection magnification \'X\'',       result: Math.round(r.x) + 'x'},
            {label: 'Eye pupil',                                result: rnd(p.apertureIn / r.x * 25.4) + ' mm'},
            {label: 'Best eyepiece FL',                         result: rnd(telescopeFLmm / r.x) + ' mm'},
            {label: 'Object apparent size at X',                result: r.objSizeDegAtX + ' degrees'},
            {label: 'Object surface brightness (and at X)',     result: rnd(r.surfBrightObj) + ' (at X=' + rnd(r.surfBrightObjAtX) + ') MPAS'},
            {label: 'Sky background brightness (and at X)',     result: p.bkgndBrightEye + ' (at X=' + rnd(r.bkgndBrightAtX) + ') MPAS'},
            {label: 'Object+sky brightness (and at X)',         result: rnd(r.objPlusBkgnd) + ' (at X=' + rnd(r.surfBrightObjPlusBkgndAtX) + ') MPAS'},
            {label: 'System illumination factor at X',          result: rnd(r.illumReductionAtX)},
            {label: 'Log contrast: (object-sky) - required = ', result: rnd(r.logContrastObject) + ' - ' + rnd(r.logContrastRequired) + ' = ' + rnd(r.logContrastDiff) + ' (positive value means detectable)'}
        ];

        return {
            parms: p,
            result: r,
            json: json
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
    for (eyepieceExitPupilmm = 1; eyepieceExitPupilmm <= parms.eyepieceExitPupilmm; eyepieceExitPupilmm++) {
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

// uses objMag, objectSize1Arcmin, objectSize2Arcmin, bkgndBrightEye
MLB.calcLib.calcContrastOfObjectPlusSkyToSky = function (objMag, objectSize1Arcmin, objectSize2Arcmin, bkgndBrightEye) {
    var calcSurfaceBrightnessFromArea = MLB.calcLib.calcSurfaceBrightnessFromArea,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        addArrayMagnitudes = MLB.calcLib.addArrayMagnitudes,
        objectSurfaceBrightness = calcSurfaceBrightnessFromArea(objMag, objectSize1Arcmin, objectSize2Arcmin),
        objectPlusSkyBackgroundSurfaceBrightness = addArrayMagnitudes([objectSurfaceBrightness, bkgndBrightEye]),
        contrastPercent = (getIllumFromMagnitude(objectPlusSkyBackgroundSurfaceBrightness - bkgndBrightEye) - 1) * 100;

    return {
        contrastPercent: contrastPercent,
        objectSurfaceBrightness: objectSurfaceBrightness,
        objectPlusSkyBackgroundSurfaceBrightness: objectPlusSkyBackgroundSurfaceBrightness
    };
};

// uses objectSurfaceBrightness, bkgndBrightEye
MLB.calcLib.calcContrastOfObjectPlusSkyToSky2 = function (objectSurfaceBrightness, bkgndBrightEye) {
    var getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        addArrayMagnitudes = MLB.calcLib.addArrayMagnitudes,
        objectPlusSkyBackgroundSurfaceBrightness = addArrayMagnitudes([objectSurfaceBrightness, bkgndBrightEye]),
        contrastPercent = (getIllumFromMagnitude(objectPlusSkyBackgroundSurfaceBrightness - bkgndBrightEye) - 1) * 100;

    return {
        contrastPercent: contrastPercent,
        objectPlusSkyBackgroundSurfaceBrightness: objectPlusSkyBackgroundSurfaceBrightness
    };
};

MLB.calcLib.calcSkyFromObjectPlusSky = function (objectSurfaceBrightness, contrastPercent) {
    var addArrayMagnitudes = MLB.calcLib.addArrayMagnitudes,
        getMagnitudeFromIllum = MLB.calcLib.getMagnitudeFromIllum,
        getIllumFromMagnitude = MLB.calcLib.getIllumFromMagnitude,
        objectSurfaceBrightnessIllum = getIllumFromMagnitude(objectSurfaceBrightness),
        bkgndIllum = objectSurfaceBrightnessIllum / (contrastPercent / 100),
        bkgndBrightEye = getMagnitudeFromIllum(bkgndIllum),
        objectPlusSkyBackgroundSurfaceBrightness = addArrayMagnitudes([objectSurfaceBrightness, bkgndBrightEye]);

    return {
        bkgndBrightEye: bkgndBrightEye,
        objectPlusSkyBackgroundSurfaceBrightness: objectPlusSkyBackgroundSurfaceBrightness
    };
};

// Newtonian baffles: focuser, diagonal and primary mirrors

MLB.calcLib.calcNewtBaffle = function (focalPlaneDia, focuserBarrelBottomToFocalPlaneDistance, focuserBarrelID, diagSizeMinorAxis, diagToFocalPlaneDistance, diagtoFocuserBaffleDistance, diagToOppositeSideBaffleDistance, primaryMirrorFocalLength, primaryToBaffleDistance, tubeID) {
    var focuserBaffleToFocalPlaneDistance,
        focuserBaffleOD,
        focuserBaffleID,
        diagonalBaffleOD,
        primaryBaffleOD,
        tubeExtension;

    focuserBaffleToFocalPlaneDistance = diagToFocalPlaneDistance - diagtoFocuserBaffleDistance;
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
        position.alt = altDeg * uom.degToRad;
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

    return initType === (InitType.altazimuth || initType === InitType.star)
        ? position.alt / uom.degToRad
        : position.Dec / uom.degToRad;
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
        calcSagittaParabolic = MLB.calcLib.calcSagittaParabolic,
        effectiveDia = mirrorDia * focalRatio * 4 * Math.sin(angle),
        sphericalSagitta = calcSagittaParabolic(mirrorDia, focalRatio),
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

From my 13.2 inch F3.0 ZipDob article and my Richest Field Telescopes article:
Formula is: mirror diameter = eyepiece field stop * exit pupil * 57.3 / (true field of view * eyepiece focal length * 25.4)
From: true field of view = eyepiece field stop / telescope focal length * 57.3; focal length = focal ratio * mirror diameter; eyepiece focal length / exit pupil = focal ratio

ex: 21mm Ethos with 36.2mm field stop, coma corrector with 1.15x factor, desired FOV of 1.8 deg and 13.2 inch primary mirror at F3 with focal length = 13*3.2=39.6:
exit pupil = 21/3/1.15=6.1, therefore aperture = 2.256 * 36.2 * 6.1 / 1.8 / 21 = 13.2;

coma corrector comments:
    without coma corrector, focal ratio increases from F3 to F3.5, focal length increases from 40 to 46 and magnification remains unchanged (or put another way, using a coma corrector with the above numbers means that focal ratio shrinks, focal length therefore shrinks, but magnification does not change);
    the following equations ignore any coma corrector magnification because they do not use focal ratio or focal length
*/

MLB.calcLib.calcApertureFromFOV_EyepieceFL_EyepieceFieldStop_Pupil = function (FOVdeg, eyepieceFocalLengthmm, eyepieceFieldStopmm, pupilmm) {
    return 2.256 * eyepieceFieldStopmm * pupilmm / FOVdeg / eyepieceFocalLengthmm;
};

MLB.calcLib.calcFOVFromAperture_EyepieceFL_EyepieceFieldStop_Pupil = function (apertureInches, eyepieceFocalLengthmm, eyepieceFieldStopmm, pupilmm) {
    return 2.256 * eyepieceFieldStopmm * pupilmm / apertureInches / eyepieceFocalLengthmm;
};

MLB.calcLib.calcPupilFromAperture_FOV_EyepieceFL_EyepieceFieldStop = function (apertureInches, FOVdeg, eyepieceFocalLengthmm, eyepieceFieldStopmm) {
    return apertureInches * FOVdeg * eyepieceFocalLengthmm / eyepieceFieldStopmm / 2.256;
};

MLB.calcLib.calcEyepieceFieldStopFromAperture_FOV_EyepieceFL_Pupil = function (apertureInches, FOVdeg, eyepieceFocalLengthmm, pupilmm) {
    return apertureInches * FOVdeg * eyepieceFocalLengthmm / pupilmm / 2.256;
};

MLB.calcLib.calcEyepieceFLFromAperture_FOV_EyepieceFieldStop_Pupil = function (apertureInches, FOVdeg, eyepieceFieldStopmm, pupilmm) {
    return 2.256 * eyepieceFieldStopmm * pupilmm / apertureInches / FOVdeg;
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

// both must be in same unit of measurement
MLB.calcLib.calcMagnificationFromApertureAndPupil = function (aperture, pupil) {
    return aperture / pupil;
};

// returns a detection level from 6 (very easy) to 1 (impossible); see examples in unit tests
MLB.calcLib.calcDetectionFromContrastAndObjectApparentSize = function (contrast, objectApparentSizeDeg) {
    var contrastExp,
        sizeExp,
        scalingExp = 0.26,
        detectionLevel;

    if (contrast < 3) {
        return 1;
    }

    contrastExp = contrast > 6
            ? 1
            : 0.2;
    sizeExp = objectApparentSizeDeg > 5
            ? 1
            : 2;

    detectionLevel = Math.floor(Math.pow(Math.pow(contrast, contrastExp) * Math.pow(objectApparentSizeDeg, sizeExp), scalingExp) + 0.5);
    if (detectionLevel > 6) {
        detectionLevel = 6;
    }
    if (detectionLevel < 1) {
        detectionLevel = 1;
    }
    return detectionLevel;
};

MLB.calcLib.detectionLevels = ['impossible', 'very difficult', 'difficult', 'moderate', 'easy', 'very easy'];

MLB.calcLib.translateDetectionLevelIntoWords = function (detectionLevel) {
    return MLB.calcLib.detectionLevels[detectionLevel - 1];
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

// ie, Dawes' Limit
MLB.calcLib.calcTheoreticalResolutionArcsec = function (apertureInches) {
    return 4.6 / apertureInches;
};

MLB.calcLib.calcAiryDiskInches = function (focalRatio) {
    var wavelengthGreenLightInches = 0.000022;

    return focalRatio * 2.44 * wavelengthGreenLightInches;
};

// allowable +- zonal reading deviation for the zonalRadius in question such that the light rays geometrically pass through the Airy disk
// zonal radius can vary from 0 to 1; use 0.000022 for wavelength of green light in inches
MLB.calcLib.calcMillesLacroixTolerance = function (wavelengthLight, mirrorDia, radiusOfCurvature, zonalRadius) {
    // Airy disk radius = 1.22*wl*FL/dia
    var AiryDiskRadius = 1.22 * wavelengthLight * radiusOfCurvature / 2 / mirrorDia;

    // 2*RoC*AiryDiskRadius/zonalRadius
    return 2 * radiusOfCurvature * AiryDiskRadius / (zonalRadius * mirrorDia / 2);
};

// zonal radius can vary from 0 to 1
MLB.calcLib.calcParabolicCorrectionForZone = function (mirrorDia, radiusOfCurvature, zonalRadius) {
    var zone = mirrorDia * zonalRadius / 2;

    return zone * zone / (2 * radiusOfCurvature);
};

MLB.calcLib.calcProjectedFocuserBaffleRadius = function (eyepieceFieldStop, barrelTubeID, focalPlaneToFocuserBarrelBottomDistance, focalPlaneToDiagDistance, telescopeTubeOD, telescopeTubeThickness) {
    var focuserBaffleSlope = (eyepieceFieldStop + barrelTubeID) / 2 / focalPlaneToFocuserBarrelBottomDistance;

    return (focalPlaneToDiagDistance + telescopeTubeOD / 2 - telescopeTubeThickness) * focuserBaffleSlope - eyepieceFieldStop / 2;
};

MLB.calcLib.scalingFactor = function (maxWidth, maxHeight, modelWidth, modelHeight, border) {
    var widthFactor = (maxWidth - border * 2) / modelWidth,
        heightFactor = (maxHeight - border * 2) / modelHeight,
        scalingFactor = widthFactor < heightFactor
            ? widthFactor
            : heightFactor;

    return {
        scalingFactor: scalingFactor,
        width: modelWidth * scalingFactor + border * 2,
        height: modelHeight * scalingFactor + border * 2
    };
};

MLB.calcLib.calcMaxMagnification = function (apertureInches) {
    return 27 * apertureInches;
};

MLB.calcLib.calcMinMagnification = function (apertureInches) {
    return 3.6 * apertureInches;
};

// from William Herschel Discoverer of the Deep Sky by Wolfgang Steinicke, pg 343
// W.H. put the eye's dilated pupil at 0.2 inches
MLB.calcLib.calcWilliamHerschelSpacePenetratingPower = function (apertureInches, diagSizeInches, combinedMirrorsReflectivity) {
    return Math.sqrt(apertureInches * apertureInches - diagSizeInches * diagSizeInches) * combinedMirrorsReflectivity / 0.2;
};

MLB.calcLib.calcComaFreeDiaInches = function (focalRatio) {
    return 0.0007 * Math.pow(focalRatio, 3);
};

MLB.calcLib.calcDiopter = function (focalLengthInches) {
    return 39.37 / focalLengthInches;
};

MLB.calcLib.calcFocalLengthInches = function (diopter) {
    return 39.37 / diopter;
};

/*
    closest near point that eye can focus is assumed to be 25cm;
    if object is placed at focal point of lens then power is 0.25m * diopter;
    if lens is placed very close to the eye and object is placed closer to lens than its focal point, then add 1 more to power (lens changes the diopter of the eye making it myopic so that object can be placed closer to the eye resulting in 1x more magnification);
*/
MLB.calcLib.calcMagnifyingLensPower = function (diopter) {
    var assumedNearPointcm = 25,
        power = assumedNearPointcm / 100 * diopter;

    return {
        lensHeldAwayFromEye: power,
        lensHeldCloseToEye: power + 1
    };
};

// http://www.rfroyce.com/standards.htm

MLB.calcLib.calcStrehlFromRMS = function (rms) {
    return Math.pow((1 - 2 * Math.PI * Math.PI * rms * rms), 2);
};

MLB.calcLib.calcRMSFromStrehl = function (Strehl) {
    return Math.sqrt((Math.sqrt(Strehl) - 1) / (-2 * Math.PI * Math.PI));
};

// 14.05 / 4 = 3.51

MLB.calcLib.calcPVFromRMS = function (rms) {
    return rms * 3.51;
};

MLB.calcLib.calcRMSFromPV = function (PV) {
    return PV / 3.51;
};

// aperture = FOV / objectSize * pupil
// for luminance, units are aperture units squared * deg^2, also see MLB.telescopeCriteriaCalc.calcLuminance
MLB.calcLib.calcApertureFromEyepieceApparentFOVdegs_Pupil_ObjectApparentSize = function (eyepieceApparentFOVdegs, pupil, objectSizeArcmin1, objectSizeArcmin2) {
    var magnification,
        aperture,
        luminance,
        apertures = [],
        objectSizeArcmin = objectSizeArcmin1 > objectSizeArcmin2
            ? objectSizeArcmin1
            : objectSizeArcmin2;

    eyepieceApparentFOVdegs.forEach(function (FOVdeg) {
        magnification = FOVdeg / objectSizeArcmin * 60;
        aperture = magnification * pupil;
        luminance = aperture * aperture * objectSizeArcmin / 60 * objectSizeArcmin / 60;
        apertures.push({'apparentFOVdegs': FOVdeg, 'aperture': aperture, 'luminance': luminance});
    });

    return apertures;
};

/*
Nils Olaf comment on ATM list, January 15, 2011:
coma in wavelengths RMS (550 nm) is 6.7*h/F^3, where h is distance from optical center.
For low power EPs, you have to consider linear coma: 3*h/(16*F^2).
*/
MLB.calcLib.calcComa = function (eyepieceFieldStopmm, focalRatio) {
    return {
        lowOrderComaRMS: 6.7 * (eyepieceFieldStopmm / 2) / (focalRatio * focalRatio * focalRatio),
        linearComaRMS: 3 * (eyepieceFieldStopmm / 2) / (focalRatio * focalRatio) // central 1/3 visible
    };
};

MLB.calcLib.calcGreaterComa = function (eyepieceFieldStopmm, focalRatio) {
    var coma = MLB.calcLib.calcComa(eyepieceFieldStopmm, focalRatio);

    return coma.lowOrderComaRMS > coma.linearComaRMS
        ? coma.lowOrderComaRMS
        : coma.linearComaRMS;
};

MLB.calcLib.calcGreaterComaWithComaCorrector = function (eyepieceFieldStopmm, focalRatio, useComaCorrector) {
    return useComaCorrector
        // per TeleVue's F3 coma reduced to that of an F12
        ? MLB.calcLib.calcGreaterComa(eyepieceFieldStopmm, focalRatio * 4)
        : MLB.calcLib.calcGreaterComa(eyepieceFieldStopmm, focalRatio);
};

MLB.calcLib.calcCollimationToleranceInches = function (focalRatio) {
    return 0.0007 * focalRatio * focalRatio * focalRatio;
};

MLB.calcLib.calcMinimumMirrorSupportPoints = function (apertureInches) {
    var maxMirrorAreaSquareInchesPerSupportPoint = 35,
        mirrorSupportsArray = [3, 6, 9, 12, 18, 27, 54],
        mirrorSupportsArrayLength = mirrorSupportsArray.length,
        apertureAreaInches = apertureInches * apertureInches * Math.PI / 4,
        calculatedPoints = apertureAreaInches / maxMirrorAreaSquareInchesPerSupportPoint,
        ix = 0;

    while (ix < mirrorSupportsArrayLength) {
        if (Math.floor(calculatedPoints) < mirrorSupportsArray[ix]) {
            return mirrorSupportsArray[ix];
        }
        ix += 1;
    }
    return undefined;
};

/*
For 3 point support, minimum bending before refocusing occurs at the 70% radius while after refocusing minimum bending occurs at the 40% radius. See https://www.davidlewistoronto.com/plop/ David Lewis' discussion and further references to Luc Arnold and Richard Schwartz.
For 6 point supports, the ring that the 6 points form is best placed at a radius of 57% according to PLOP.
For 9 point supports, place the inner ring at the 33% radius and the outer ring at the 72% radius. If x is outer radius and y is inner radius then balance point = 2/3(cos(30)x-y) + y) = 2/3*cos(30)x + y/3 = 0.577x + y/3 = 52.6%.
For 18 point supports, place the radii at 38% and 76%. If x is outer radius and y is inner radius then balance point = 2/3(cos(15)x-y) + y) = 2/3*cos(15)x + y/3 = 0.644x + y/3 = 61.6%. Using similar math, place the bar centers at the 53.4% radius.
*/
MLB.calcLib.calcMirrorCell3pt = function (radius) {
    return {
        radius: radius * 0.4
    };
};

MLB.calcLib.calcMirrorCell6pt = function (radius) {
    return {
        radius: radius * 0.57,
        balanceRadius: radius * 0.4936
    };
};

MLB.calcLib.calcMirrorCell9pt = function (radius) {
    return {
        innerRadius: radius * 0.33,
        outerRadius: radius * 0.72,
        balanceRadius: radius * 0.5257
    };
};

MLB.calcLib.calcMirrorCell12pt = function (radius) {
    return {
        innerRadius: radius * 0.19,
        outerRadius: radius * 0.72,
        collimationRadius: radius * 0.53,
        innerBarLength: radius * 0.55,
        midBarLength: radius * 0.64,
        outerBarLength: radius * 0.49,
        innerBarBalanceAlongBar: 0.64,
        midBarBalanceAlongBar: 0.56,
        outerBarBalanceAlongBar: 0.5,
        // uses ...AlongBar factors
        innerBarBalance: radius * 0.55 * 0.64,
        midBarBalance: radius * 0.64 * 0.56,
        outerBarBalance: radius * 0.49 * 0.5
    };
};

MLB.calcLib.calcMirrorCell18pt = function (radius) {
    return {
        innerRadius: radius * 0.38,
        outerRadius: radius * 0.76,
        triangleBalanceRadius: radius * 0.6161,
        pivotBarBalanceRadius: radius * 0.5336
    };
};

MLB.calcLib.calcMirrorCell27pt = function (radius) {
    var uom = MLB.sharedLib.uom;

    return {
        inner6Radius: radius * 0.331,
        mid9Radius: radius * 0.644,
        outer12Radius: radius * 0.849,
        baseTriangleBalanceRadius: radius * 0.562,
        innerTriangleBalanceRadius: radius * 0.404,
        outerTriangleBalanceRadius: radius * 0.760,
        // points are not equidistant, instead angles are 32.7, 87 and 152.7 degrees from vertical
        outerTriangleBalancePtAngles: _.map([32.7, 87, 152.7, 32.7 + 180, 87 + 180, 152.7 + 180], function (s) {return s * uom.degToRad;})
    };
};

// see mirror cell 54 pt support naming.jpg and lockwood 42 inch f3.75 54 pt support
MLB.calcLib.calcMirrorCell54pt = function (radius) {
    return {
        supportPts: [
            {radius: radius * 0.23, pts: 6, offset: false},
            {radius: radius * 0.50, pts: 12, offset: true},
            {radius: radius * 0.70, pts: 12, offset: true},
            {radius: radius * 0.86, pts: 24, offset: true},
        ],
        pivotPts: [
            {radius: radius * 0.40, pts: 6, offset: false},
            {radius: radius * 0.80, pts: 12, offset: true}
        ],
        barPts: [
            {radius: radius * 0.65, pts: 6, offset: false}
        ]
    };
};

MLB.calcLib.calcMirrorCellDimensions = function (supportPoints, radius) {
    var calcMirrorCell3pt = MLB.calcLib.calcMirrorCell3pt,
        calcMirrorCell6pt = MLB.calcLib.calcMirrorCell6pt,
        calcMirrorCell9pt = MLB.calcLib.calcMirrorCell9pt,
        calcMirrorCell12pt = MLB.calcLib.calcMirrorCell12pt,
        calcMirrorCell18pt = MLB.calcLib.calcMirrorCell18pt,
        calcMirrorCell27pt = MLB.calcLib.calcMirrorCell27pt;

    switch (supportPoints) {
        case 3:
            return calcMirrorCell3pt(radius);
        case 6:
            return calcMirrorCell6pt(radius);
        case 9:
            return calcMirrorCell9pt(radius);
        case 12:
            return calcMirrorCell12pt(radius);
        case 18:
            return calcMirrorCell18pt(radius);
        case 27:
            return calcMirrorCell27pt(radius);
        // 54 and larger not defined
        default:
            return undefined;
    }
};

// from https://www.telescope-optics.net/obstruction.htm
MLB.calcLib.calcRMSCausedByCentralObstruction = function (centralObstructionByDiameter) {
    return 0.21 * centralObstructionByDiameter;
};

MLB.calcLib.findWeightedCenterOfPoints = function (points) {
    var pointsLength = points.length,
        sumX = 0,
        sumY = 0;

    _.map(points, function (s) {sumX += s.x; sumY += s.y;});
    return {
        x: sumX / pointsLength,
        y: sumY / pointsLength
    };
};

MLB.calcLib.findOffsetCenterBetweenTwoPoints = function (pointA, pointB, offset) {
    return {
        x: (pointB.x - pointA.x) * offset + pointA.x,
        y: (pointB.y - pointA.y) * offset + pointA.y
    };
};

/*
Use: Determines setup for paraboloid and sphere in Waineo null test.
References:                                 }
    Tom Waineo. "A Null Test for Paraboloids." Telescope Making, #11.
    W. J. Smith. "Modern Optical Engineering." McGraw-Hill.
    R. Kingslake.  "Lens Design Fundamentals." Academic Press.
Developed/programmed by Bob Bridges.
    Uses routines from general program, Ast0391, by Bridges.
Distribution permitted.
Numbered equations are from Smith
Follows the Pascal code, copyright (c) 1993-2017 by Florian Klaempfl and others
Dimensions are in millimeters
*/
MLB.calcLib.WaineoSphericalNull = function (inParms) {
    var NumSurfaces = 3, NumZones = 24;
    var sinI, cosI, sinUI, cosUI, sinIprime, cosIprime, sinUprime, cosUprime, Qprime, sinU, cosU, Q, H, Lprime_par, Lprime_mer, U, Y, Uprime, constant, yP, yPfinal, y0, yPrmdr, Qs, LS, SA, LP, KnifeDist, seperation, LprimeP, LprimeS, yPrmdrOld, QsOld, QsNew, SAold, LPold, LPnew, conic, i;
    var radius, curve, dist, DistX, DistY, Zonal_OPD = [];
    var RefIndex = []; // this is a 2-dimen array

    var ParMerInput = (ObjAngle, Height, ObjDist) => {
        sinU = ObjAngle;
        U = sinU;
        cosU = Math.sqrt(1 - sinU * sinU);
        H = Height;
    };

    var ParRefraction = (y1, u1, c, N, nPrime) => {
        return (c * y1 * (nPrime - N) + N * u1) / nPrime;
    };

    var ParTransfer = (height, angle, dist) => {
        y = height - dist * angle;
        u = Uprime;
    };

    var MerRefraction = (Q1, sinU1, cosU1, c, N, nPrime, i) => {
        var yP2, xc, x, rmdr, dXdY, CA, yPindex;

        if (i ===2 ) {
            yPindex = 0;
            yP = Q1;
            x = c * yP * yP / (1 + Math.sqrt(1 - conic * c * c * yP * yP));
            rmdr = x * sinU1 + yP*cosU1 - Q1;
            dXdY =  c* yP / Math.sqrt(1 - conic * c * c * yP * yP);

            while (Math.abs(rmdr) > 1.0E-16 && yPindex < 100) {
                yPindex = yPindex + 1;
                yP = yP - rmdr / (dXdY * sinU1 + cosU1);
                x = c * yP * yP / (1 + Math.sqrt(1 - conic * c * c * yP * yP));
                rmdr = x * sinU1 + yP * cosU1 - Q1;
                dXdY = c * yP / Math.sqrt(1 - conic * c * c * yP * yP);
            }
            yPrmdr = yP - yPfinal;
            yP2 = yP * yP;
            xc = x + yP / dXdY;
            CA = Q1 - xc * sinU1;
            sinI = CA / Math.sqrt(yP2 + ((xc - x) * (xc - x)));
            DistX[i] = x;
            DistY[i] = yP;
        } else {
            sinI = Q1 * c - sinU1;
        }
        cosI = Math.sqrt(1 - sinI * sinI);
        sinUI = sinU1 * cosI + cosU1 * sinI;
        cosUI = cosU1 * cosI - sinU1 * sinI;
        sinIprime = N * sinI / nPrime;
        cosIprime =  Math.sqrt(1 - sinIprime * sinIprime);
        sinUprime = sinUI * cosIprime - cosUI * sinIprime;
        cosUprime = cosUI * cosIprime + sinUI * sinIprime;

        if (i < 2 || i > 2) {
            DistX[i] = Q1 * sinUI / (cosU1 + cosI);
            DistY[i] = Q1 * (1 + cosUI) / (cosU1 + cosI);
        }
        Qprime = DistX[i] * sinUprime + DistY[i] * cosUprime;
    };

    var MerTransfer = (Qprime1, sinUprime1, cosUprime1, t) => {
        Q = Qprime1 - t * sinUprime1;
        sinU = sinUprime1;
        cosU = cosUprime1;
    };

    var ParMerRays = () => {
        var i;

        ParMerInput(Qs / LS, Qs, LS);
        Y = H;
        Q = H;
        for (i = 1; i <= NumSurfaces; i += 1) {
            Uprime = ParRefraction(Y, U, curve[i], RefIndex[i, 1], RefIndex[i + 1, 1]);
            ParTransfer(Y, Uprime, dist[i]);
            MerRefraction(Q, sinU, cosU, curve[i], RefIndex[i, 1], RefIndex[i + 1, 1], i);
            MerTransfer(Qprime, sinUprime, cosUprime, dist[i]);
            if (i === 2) {
                  radius[3] = Y / Uprime + constant;
                  curve[3] = 1 / radius[3];
            }
        }
        Lprime_par = Y / UPrime;
        Lprime_mer = Qprime / sinUprime;
        SA = Lprime_par + constant - Lprime_mer;
    };

    /*  eg, test parms (in mm):
        var inParms = {
            paraboloidalDia: 500,           // yPfinal
            KEpositionBehindSphere: 150,    // KnifeDist
            nullingSphereRoC: 2000,         // radius[1]
            paraboloidRoC: 5000             // radius[2]
        }, */
    var processInput = (inParms) => {
        constant = 0;
        conic = 0;

        yPfinal = inparms.paraboloidalDia / 2;
        y0 = yPfinal;
        KnifeDist = inparms.KEpositionBehindSphere;
        radius[1] = -inParms.nullingSphereRoC;
        radius[2] = inparms.paraboloidRoC;

        for  (i = 1; i <= NumSurfaces - 1; i+= 1) {
            curve[i] = 1 / radius[i];
        }
        LP = 2 * radius[2];

        RefIndex[1, 1] = 1;
        RefIndex[2, 1] = -1;
        RefIndex[3, 1] = 1;
        RefIndex[4, 1] = 1;
    };

    var Layout = () => {
        LprimeP = LP * radius[2] / (2 * LP - radius[2]);
        LprimeS = LP - LprimeP + KnifeDist;
        LS = LprimeS * radius[1] / (2 * LprimeS - radius[1]);
        seperation = LprimeP - KnifeDist;
        Qs = yPfinal - seperation * yPfinal / LP;
        dist[1] = -seperation;
        dist[2] = 0;
        dist[3] = 0;
    };

/*
function  OPD:extended;
var
OPDdist:array [1..3] of extended;
OPDpar,OPDtemp:extended;
i:integer;
begin
    OPDdist[1] :=sqrt(sqr(LS - DistX[1]) + sqr(DistY[1]));
    OPDdist[2] :=sqrt(sqr(dist[1] - DistX[1] + DistX[2]) +
                      sqr(DistY[2] - DistY[1]));
    OPDdist[3] :=sqrt(sqr(dist[2] - DistX[2] + DistX[3]) +
                      sqr(DistY[3] - DistY[2]));

    OPDpar :=  abs(LS) + abs(dist[1]) + abs(dist[2]);
    OPDtemp := - OPDpar;
    for i := 1 to 3 do
         OPDtemp := OPDtemp + abs(OPDdist[i]);
    OPDtemp := OPDtemp/0.00055;
    OPD := OPDtemp;
end;

procedure Height;    (* output includes correct initial height *)
var QsIndex:integer;
begin
    QsIndex := 0;
    ParMerRays;  (* output includes Parabolic Height remainder,yPrmdr *)
    yPrmdrOld := yPrmdr;
    QsOld := Qs;
    Qs := 0.99*Qs;  (* don"t forget sinU!!!! *)
    ParMerRays;
    while  ((abs(yPrmdr) > 1.0E-16) and (QsIndex < 100)) do
    begin
         QsIndex := QsIndex + 1;
         QsNew := Qs - ((Qs - QsOld)*yPrmdr)/(yPrmdr - yPrmdrOld);
              (* potential problem above *)
         QsOld := Qs;
         Qs := QsNew;
         yPrmdrOld := yPrmdr;  (* check *)
         ParMerRays;  (* output includes yPrmdr *)
    end;
end;
*/

    return {
        lightSourceDistanceInFrontOfSphere: undefined,
        minimumSphereDia: undefined,
        minimumHoleInSphereDia: undefined,
        paraboloidDistanceFromSphere: undefined,
        paraboloidToFocusKEDistance: undefined,
        marginalSphericalAberration: undefined,
        opticalPathSifference: undefined,
        sphericalAberrationZone707: undefined,
        zoneOPD707: undefined,
        minOPD: undefined,
        incrementalBestFocus: undefined
    };
};

// end of file
