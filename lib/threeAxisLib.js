// copyright Mel Bartels, 2012-2014
// translated from Steve Joiner's threeaxis C program
// see threeAxisLib unitTests.htm for unit tests
// turn on jslint's Tolerate ++ and --

'use strict';

/* Tracy Wilson's 3 axis page: http://www.vtwilson.net/telescope.html
   pointing equations for 3 axis mount: http://daisyhill.net/steve/pointing-equations-for-the-alt-alt-az-mount/
   coordinate axes layout: http://daisyhill.net/steve/astronomical-coordinate-systems/
   azimuth starts at north=0 and increases towards the east (east=90, south=180, west=270)
   hour angle is positive to the west and negative to the east
*/

MLB.threeAxisLib = {};

MLB.threeAxisLib.coordVector = function () {
	return {
		x: 0,
		y: 0,
		z: 0
	};
};

// computes the cross product of vectors v1 and v2 and returns the result in the vector w (i.e., w = v1 x v2)
MLB.threeAxisLib.vectorCrossProduct = function (w, v1, v2) {
	w.x = v1.y * v2.z - v1.z * v2.y;
	w.y = v1.z * v2.x - v1.x * v2.z;
	w.z = v1.x * v2.y - v1.y * v2.x;
};

// returns product of two vectors
MLB.threeAxisLib.vectorDotProduct = function (v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

MLB.threeAxisLib.model = function () {
    return {
		// latitude
		lat: 0, // -90 to 90
		// 3 axis coordinates
		a1: 0, // 0 to 180
		a2: 0, // -90 to 90
		a3: 0, // 0 to 360
		// altazimuth coodinates
		alt: 0, // 0 to 90
		az: 0, // 0 to 360
		// equatorial coordinates
		HA: 0, // -180 to 180
		Dec: 0, // -90 to 90
		FR: 0 // 0 to 360
    };
};

MLB.threeAxisLib.a3ToEquat = function () {
	var model = MLB.threeAxisLib.model,
	    lat = model.lat,
		a1 = model.a1,
		a2 = model.a2,
		a3 = model.a3,
		sin = Math.sin,
		cos = Math.cos,
		atan2 = Math.atan2,
		asin = Math.asin;

	model.HA = atan2(-sin(a3) * cos(a1) + cos(a3) * sin(a2) * sin(a1), (-sin(lat) * cos(a3) * cos(a1) - sin(lat) * sin(a3) * sin(a2) * sin(a1) + cos(lat) * cos(a2) * sin(a1)));
	model.Dec = asin(cos(lat) * cos(a3) * cos(a1) + cos(lat) * sin(a3) * sin(a2) * sin(a1) + sin(lat) * cos(a2) * sin(a1));
};

MLB.threeAxisLib.a3ToAltaz = function () {
	var model = MLB.threeAxisLib.model,
		a1 = model.a1,
		a2 = model.a2,
		a3 = model.a3,
		validRev = MLB.coordLib.validRev,
		sin = Math.sin,
		cos = Math.cos,
		atan2 = Math.atan2,
		asin = Math.asin;

	model.az = validRev(atan2(sin(a3) * cos(a1) - cos(a3) * sin(a2) * sin(a1), cos(a3) * cos(a1) + sin(a3) * sin(a2) * sin(a1)));
	model.alt = asin(cos(a2) * sin(a1));
};

MLB.threeAxisLib.a3ToFR = function () {
	var model = MLB.threeAxisLib.model,
	    lat = model.lat,
		a1 = model.a1,
		a2 = model.a2,
		a3 = model.a3,
		coordVector = MLB.threeAxisLib.coordVector,
		fr3a = coordVector(),
		frEquat = coordVector(),
		r = coordVector(),
		p = coordVector(),
		ha,
		dec,
		vectorDotProduct = MLB.threeAxisLib.vectorDotProduct,
		vectorCrossProduct = MLB.threeAxisLib.vectorCrossProduct,
		a3ToEquat = MLB.threeAxisLib.a3ToEquat,
		sin = Math.sin,
		cos = Math.cos,
		acos = Math.acos;

	// compute field rotation vector for alt-alt-az mount
	fr3a.x = cos(a3) * sin(a1) - sin(a3) * sin(a2) * cos(a1);
	fr3a.y = -sin(a3) * sin(a1) - cos(a3) * sin(a2) * cos(a1);
	fr3a.z = cos(a2) * cos(a1);

	// compute local equatorial coordinates
	a3ToEquat();

	// compute field rotation vector for equatorial mount
	frEquat.x = -sin(lat) * cos(ha) * sin(dec) - cos(lat) * cos(dec);
	frEquat.y = sin(ha) * sin(dec);
	frEquat.z = -cos(lat) * cos(ha) * sin(dec) + sin(lat) * cos(dec);

	// compute angle between the two field rotation vectors	
	model.FR = acos(vectorDotProduct(fr3a, frEquat));

	// this gives us 0 <= frot <= pi. In order to determine the full angle, we see if frEquat x fr3a is parallel or antiparallel to the direction vector r
	r.x = -cos(a3) * cos(a1) - sin(a3) * sin(a2) * sin(a1);
	r.y = sin(a3) * cos(a1) - cos(a3) * sin(a2) * sin(a1);
	r.z = cos(a2) * sin(a1);

	vectorCrossProduct(p, frEquat, fr3a);

	if (vectorDotProduct(p, r) < 0) {
		model.FR = 2.0 * Math.PI - model.FR;
	}
};

MLB.threeAxisLib.equatToAltaz = function () {
	var model = MLB.threeAxisLib.model,
	    ha = model.HA,
		dec = model.Dec,
		lat = model.lat,
		validRev = MLB.coordLib.validRev,
		sin = Math.sin,
		cos = Math.cos,
		atan2 = Math.atan2,
		asin = Math.asin;

	model.az = validRev(atan2(-cos(dec) * sin(ha), sin(dec) * cos(lat) - cos(dec) * cos(ha) * sin(lat)));
	model.alt = asin(cos(dec) * cos(ha) * cos(lat) + sin(dec) * sin(lat));
};

MLB.threeAxisLib.altazToEquat = function () {
	var model = MLB.threeAxisLib.model,
	    alt = model.alt,
		az = model.az,
		lat = model.lat,
		sin = Math.sin,
		cos = Math.cos,
		atan2 = Math.atan2,
		asin = Math.asin;

	model.HA = atan2(-cos(alt) * sin(az), sin(alt) * cos(lat) - cos(alt) * cos(az) * sin(lat));
	model.Dec = asin(cos(alt) * cos(az) * cos(lat) + sin(alt) * sin(lat));
};

MLB.threeAxisLib.equatToA3 = function () {
	var model = MLB.threeAxisLib.model,
	    ha = model.HA,
		dec = model.Dec,
		frot = model.FR,
		lat = model.lat,
		fz,
	    vx,
	    vy,
	    vz,
		validRev = MLB.coordLib.validRev,
		sin = Math.sin,
		cos = Math.cos,
		atan2 = Math.atan2,
		asin = Math.asin,
		acos = Math.acos;

	// compute needed components of r, f, and v vectors of alt-alt-az scope by using equations for r, f, and v vectors of equatorial scope that has been pre-rotated by the field rotation
	fz = -cos(lat) * sin(ha) * sin(frot) - cos(lat) * cos(ha) * sin(dec) * cos(frot) + sin(lat) * cos(dec) * cos(frot);
	vx = -sin(lat) * sin(ha) * cos(frot) + sin(lat) * cos(ha) * sin(dec) * sin(frot) + cos(lat) * cos(dec) * sin(frot);
	vy = -cos(ha) * cos(frot) - sin(ha) * sin(dec) * sin(frot);
	vz = -cos(lat) * sin(ha) * cos(frot) + cos(lat) * cos(ha) * sin(dec) * sin(frot) - sin(lat) * cos(dec) * sin(frot);

	model.a2 = asin(vz);
	model.a1 = acos(fz / cos(model.a2));
	model.a3 = validRev(atan2(vx / cos(model.a2), vy / cos(model.a2)));
};

MLB.threeAxisLib.altazToA3 = function () {
	var altazToEquat = MLB.threeAxisLib.altazToEquat,
		equatToA3 = MLB.threeAxisLib.equatToA3;

	altazToEquat();
	equatToA3();
};

// end of file
