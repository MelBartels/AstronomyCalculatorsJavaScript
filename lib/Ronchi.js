// copyright Mel Bartels, 2011-2014

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
	// display under/over correction
	yes: 0,
	no: 1,

	// zero deviation at ...
	zeroDeviationAtCenter: 0,
	zeroDeviationAtEdge: 1,
	maxZeroDeviationAtEdge: 2,

	// comparison Ronchigram options
	compareRonchigramResultUndercorrected: 0,
	compareRonchigramResultOvercorrected: 1,
	compareRonchigramResultLowZone70: 2,
	compareRonchigramResultHighZone70: 3,
	compareRonchigramResultNone: 4,
	maxCompareRonchigramsResult: 5,

	maxRonchigrams: 4,
	zone70sqrt: 0.7 * 0.7
};

MLB.ronchi.quadrantSetPixel = function (imageData, cg, x, y, r, g, b, opaque) {
	var setPixel = MLB.sharedLib.setPixel;

	setPixel(imageData, cg.x + x, cg.y + y, r, g, b, opaque);
	setPixel(imageData, cg.x - x, cg.y + y, r, g, b, opaque);
	setPixel(imageData, cg.x + x, cg.y - y, r, g, b, opaque);
	setPixel(imageData, cg.x - x, cg.y - y, r, g, b, opaque);
};

// from algorithm in Sky and Telescope magazine: trace light rays through grating;
// correction factor of 1 = parabola
MLB.ronchi.ronchiCalc = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg) {
	MLB.ronchi.ronchiCalcWithAllowableDeviation(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg, 0, false, 0, false, 0);
};

MLB.ronchi.ronchiCalcWithAllowableDeviation = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg, deviation, displayDeviation, zeroDeviationAt, displayCompareRonchigram, compareRonchigramResult) {
	var scaledMirrorRadius,
	    scaledMirrorRadiusSquared,
		scaledRadiusOfCurvature,
		scaledGratingOffset,
		scaledLineWidth,
		scaledMirrorZone,
		maxScaledMirrorZone,
		x,
		y,
		ySquared,
		z,
		l,
		u,
		t,
		band,
	    zOver,
		lOver,
		uOver,
		tOver,
		overBand,
		zUnder,
		lUnder,
		uUnder,
		tUnder,
		underBand,
		zZone,
		lZone,
		uZone,
		tZone,
		zoneBand,
		deviationForScaledMirrorZone,
		opaque = 255,
		maxColor = 255,
		dimmedColor = 160,
		int = MLB.sharedLib.int,
		constants = MLB.ronchi.constants,
		quadrantSetPixel = MLB.ronchi.quadrantSetPixel;

	scaledMirrorRadius = mirrorDia / 2 * scalingFactor;
	scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
	scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
	scaledGratingOffset = gratingOffset * scalingFactor;
	scaledLineWidth = scalingFactor / (2 * gratingFreq);

	for (y = 0; y < scaledMirrorRadius; y++) {
		ySquared = y * y;
		maxScaledMirrorZone = ySquared + scaledMirrorRadiusSquared;
		for (x = 0; x < scaledMirrorRadius; x++) {
			scaledMirrorZone = ySquared + x * x;
			if (scaledMirrorZone > scaledMirrorRadiusSquared) {
				break;
			}
			// for spherical mirror, Z=RC;
			z = scaledRadiusOfCurvature + scaledMirrorZone / scaledRadiusOfCurvature;
			// offset*2 for light source that moves with Ronchi grating 
			l = scaledRadiusOfCurvature + scaledGratingOffset * 2 - z;
			// u = projection of ray at scaledMirrorRadius onto grating displaced from RC by gratingOffset 
			u = Math.abs(l * x / z);
			// test for ray blockage by grating 
			t = int((u / scaledLineWidth) + 0.5);
			band = t % 2 === 0;

			if (displayDeviation || displayCompareRonchigram) {
				if (displayCompareRonchigram && (compareRonchigramResult === constants.compareRonchigramResultLowZone70 || compareRonchigramResult === constants.compareRonchigramResultHighZone70)) {
					if (scaledMirrorZone / scaledMirrorRadiusSquared < constants.zone70sqrt) { // inside 70% zone: shape gradually from perfect center to max deviation at 70% zone
						deviationForScaledMirrorZone = deviation * maxScaledMirrorZone * scaledMirrorZone / maxScaledMirrorZone / constants.zone70sqrt;
					} else { // outside 70% zone: shape gradually from perfect edge to max deviation at 70% zone
						deviationForScaledMirrorZone = deviation * maxScaledMirrorZone * (scaledMirrorRadiusSquared - scaledMirrorZone) / maxScaledMirrorZone / (1 - constants.zone70sqrt);
					}
					// invert deviation for high 70% zone
					if (compareRonchigramResult === constants.compareRonchigramResultHighZone70) {
						deviationForScaledMirrorZone = -deviationForScaledMirrorZone;
					}
					zZone = scaledRadiusOfCurvature + (scaledMirrorZone - deviationForScaledMirrorZone) / scaledRadiusOfCurvature;
					lZone = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zZone;
					uZone = Math.abs(lZone * x / zZone);
					tZone = int((uZone / scaledLineWidth) + 0.5);
					zoneBand = tZone % 2 === 0;
				} else if (zeroDeviationAt === constants.zeroDeviationAtCenter) {
					// allowable deviation from perfect paraboloidal that goes from zero at mirror center to max at mirror edge
					deviationForScaledMirrorZone = deviation * maxScaledMirrorZone * scaledMirrorZone / maxScaledMirrorZone;
				} else if (zeroDeviationAt === constants.zeroDeviationAtEdge) {
					// allowable deviation from perfect paraboloidal that goes from max at mirror center to zero at mirror edge
					deviationForScaledMirrorZone = deviation * maxScaledMirrorZone * (scaledMirrorRadiusSquared - scaledMirrorZone) / maxScaledMirrorZone;
				} else {
					deviationForScaledMirrorZone = 0;
					alert('unhandled deviation in MLB.ronchi.ronchiCalcWithAllowableDeviation()');
				}
				if (displayDeviation || compareRonchigramResult === constants.compareRonchigramResultUndercorrected || compareRonchigramResult === constants.compareRonchigramResultOvercorrected) {
					// undercorrected
					zUnder = scaledRadiusOfCurvature + (scaledMirrorZone - deviationForScaledMirrorZone) / scaledRadiusOfCurvature;
					lUnder = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zUnder;
					uUnder = Math.abs(lUnder * x / zUnder);
					tUnder = int((uUnder / scaledLineWidth) + 0.5);
					underBand = tUnder % 2 === 0;
					// overcorrected
					zOver = scaledRadiusOfCurvature + (scaledMirrorZone + deviationForScaledMirrorZone) / scaledRadiusOfCurvature;
					lOver = scaledRadiusOfCurvature + scaledGratingOffset * 2 - zOver;
					uOver = Math.abs(lOver * x / zOver);
					tOver = int((uOver / scaledLineWidth) + 0.5);
					overBand = tOver % 2 === 0;
				}
				// draw a pixel to build the Ronchi bands when the light is blocked				
				if (displayCompareRonchigram) { // if generating the comparision Ronchigram
					// for testing purposes: plot the perfectly corrected Ronchigram
					// if (band) {
						// quadrantSetPixel(imageData, cg, x, y, 128, 128, 128, opaque);
					// }
					// display if comparison Ronchigram under, over or 70%zone selected
					if ((compareRonchigramResult === constants.compareRonchigramResultUndercorrected && underBand) || (compareRonchigramResult === constants.compareRonchigramResultOvercorrected && overBand) || (compareRonchigramResult === constants.compareRonchigramResultLowZone70 && zoneBand) || (compareRonchigramResult === constants.compareRonchigramResultHighZone70 && zoneBand)) {
						quadrantSetPixel(imageData, cg, x, y, 0, 0, 0, opaque);
					}
				} else { // generating the three Ronchigrams based on the three grating offsets but with under/over correction included
					if (band && underBand && overBand) {
						quadrantSetPixel(imageData, cg, x, y, 0, 0, 0, opaque);
					} else if (band && underBand) {
						quadrantSetPixel(imageData, cg, x, y, dimmedColor, 0, 0, opaque);
					} else if (underBand) {
						quadrantSetPixel(imageData, cg, x, y, maxColor, 0, 0, opaque);
					} else if (band && overBand) {
						quadrantSetPixel(imageData, cg, x, y, 0, 0, dimmedColor, opaque);
					} else if (overBand) {
						quadrantSetPixel(imageData, cg, x, y, 0, 0, maxColor, opaque);
					} else if (band) {
						quadrantSetPixel(imageData, cg, x, y, 0, 0, 0, opaque);
					}
				}
			} else { // just display the three Ronchigrams based on the three grating offsets: no deviations, no comparisons
				if (band) {
					quadrantSetPixel(imageData, cg, x, y, 0, 0, 0, opaque);
				}
			}
		}
	}
};

MLB.ronchi.plot = function () {
	var canvas,
	    context,
		imageData,
		mirrorDia,
		radiusOfCurvature,
		gratingFreq,
		gratingOffsets,
		shrinkForBorders,
		scalingFactor,
		ronchiCenter,
		ronchiWidth,
		ix,
		circleCenter,
		focalRatio,
		allowableParabolicDeviation,
		displayDeviation,
		zeroDeviationAtResult,
		compareRonchigramResult,
		decimals = 1,
		point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		fillCircle = MLB.sharedLib.fillCircle,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		constants = MLB.ronchi.constants,
		ronchiCalcWithAllowableDeviation = MLB.ronchi.ronchiCalcWithAllowableDeviation,
		calcAllowableParabolicDeviationForQuarterWavefront = MLB.calcLib.calcAllowableParabolicDeviationForQuarterWavefront,
		acceptableDeviation = $('td[id=acceptableDeviation]'),
		showDeviation = function () {
			return $('input[name=showDeviation]');
		},
		zeroDeviationAt = function () {
			return $('input[name=zeroDeviationAt]');
		},
		compareRonchigram = function () {
			return $('input[name=compareRonchigram]');
		};

	canvas = $("#RonchiCanvas")[0];
	context = canvas.getContext("2d");

	mirrorDia = +$('[name=mirrorDia]')[0].value;
	radiusOfCurvature = +$('[name=radiusOfCurvature]')[0].value;
	gratingFreq = +$('[name=gratingFreq]')[0].value;
	gratingOffsets = [+$('[name=gratingOffset1]')[0].value, +$('[name=gratingOffset2]')[0].value, +$('[name=gratingOffset3]')[0].value];

	shrinkForBorders = 0.9;
	scalingFactor = canvas.height / mirrorDia * shrinkForBorders;
	ronchiCenter = point(canvas.width / constants.maxRonchigrams / 2, canvas.height / 2);
	ronchiWidth = canvas.width / constants.maxRonchigrams;

	focalRatio = radiusOfCurvature / mirrorDia / 2;
	allowableParabolicDeviation = calcAllowableParabolicDeviationForQuarterWavefront(focalRatio);
	acceptableDeviation.html("1/4 wavefront paraboloidal deviation is " + roundToDecimal(allowableParabolicDeviation * 100, decimals) + '%. ');

	displayDeviation = showDeviation()[constants.yes].checked;
	// number of zeroDeviationAt radio button options: center=0, edge=1
	for (ix = 0; ix < constants.maxZeroDeviationAtEdge; ix++) {
		if (zeroDeviationAt()[ix].checked) {
			zeroDeviationAtResult = ix;
			break;
		}
	}
	for (ix = 0; ix < constants.maxCompareRonchigramsResult; ix++) {
		if (compareRonchigram()[ix].checked) {
			compareRonchigramResult = ix;
			break;
		}
	}

	for (ix = 0; ix < constants.maxRonchigrams; ix++) {
		// create a new pixel array
		imageData = context.createImageData(ronchiWidth, canvas.height);
		circleCenter = point(ronchiCenter.x + ronchiWidth * ix, ronchiCenter.y);

		if (ix < constants.maxRonchigrams - 1) { // the three standard ronchigrams: inside, at, outside radius of curvature
			ronchiCalcWithAllowableDeviation(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffsets[ix], scalingFactor, imageData, ronchiCenter, allowableParabolicDeviation, displayDeviation, zeroDeviationAtResult, false, compareRonchigramResult);

			// copy the image data back onto the canvas
			context.putImageData(imageData, ronchiWidth * ix, 0);
			// now draw the circle that outlines mirror's aperture in the Ronchigram
			drawCircle(context, circleCenter, mirrorDia / 2 * scalingFactor, 1, 'black');
		} else { // handle potential last contrast image using last gratingOffset
			if (compareRonchigramResult !== constants.compareRonchigramResultNone) {
				ronchiCalcWithAllowableDeviation(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffsets[ix - 1], scalingFactor, imageData, ronchiCenter, allowableParabolicDeviation, displayDeviation, zeroDeviationAtResult, true, compareRonchigramResult);

				context.putImageData(imageData, ronchiWidth * ix, 0);
				drawCircle(context, circleCenter, mirrorDia / 2 * scalingFactor, 1, 'black');
			} else { // don't show contrast image and erase any prior image (oversize by a pixel to catch all)
				fillCircle(context, circleCenter, mirrorDia / 2 * scalingFactor + 1, 'white');
			}
		}
	}
};

$(window).ready(function () {
	var btnPlot = $('input[id=btnPlot]'),
		plot = MLB.ronchi.plot;

	$('input[name=zeroDeviationAt]')[0].checked = true;

	// event hookups/subscribes
	btnPlot.click(function () {
		plot();
	});

	plot();
});

// end of file