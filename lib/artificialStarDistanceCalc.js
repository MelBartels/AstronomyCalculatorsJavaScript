// copyright Mel Bartels, 2014

'use strict';

MLB.artificialStarDistanceCalc = {};

MLB.artificialStarDistanceCalc.calc = function () {
	var mirrorDiameter = +$('input[name=mirrorDiameter]').val(),
	    focalLength = +$('input[name=focalLength]').val(),
		artificialStarDistanceInches = MLB.calcLib.artificialStarDistanceInches,
		artificialStarDistanceMM = MLB.calcLib.artificialStarDistanceMM,
		artificialStarDistance,
		btnUom = document.getElementsByName('uom');

	if (btnUom[0].checked) {
		artificialStarDistance = artificialStarDistanceInches;
	} else if (btnUom[1].checked) {
		artificialStarDistance = artificialStarDistanceMM;
	}

	$('input[name=distance]').val(artificialStarDistance(mirrorDiameter, focalLength));
};

MLB.artificialStarDistanceCalc.load = function () {
	var calc = MLB.artificialStarDistanceCalc.calc,
	    btnCalculateDistance = document.getElementById('btnCalculateDistance');

	// event hookups/subscribes
	btnCalculateDistance.onclick = function () {
		calc();
	};

	calc();
};

// end of file