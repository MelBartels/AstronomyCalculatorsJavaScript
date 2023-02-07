// copyright Mel Bartels, 2015-2023

/* 
JavaScript port of Mauritz Andersson's PHP.
Ported to JS so that the mask generation can be executed by the browser without need of a http server running PHP.
Minimal refracting applied, mirroring Mauritz's PHP code as much as possible.

Which is licensed under MIT License
GitHub at https://github.com/ztiruam/holomask
Mauritz's website at http://xiluma.se/holomask/

HoloMask
Computes a holographic mask for null testing mirrors
Copyright Mauritz Andersson, 2004-2015
Version: Dec 10, 2004
Version: Dec 7, 2012
Released as Open Source (MIT License): March 31, 2015

The MIT License (MIT)
Copyright (c) [2015] [Mauritz Andersson]
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

MLB.holomaskLib = {};

MLB.holomaskLib.inputParms = {
	diffractionOrder: undefined,
	mirrorDiameterMm: undefined,
	radiusCurvatureMm: undefined,
	conic: undefined,
	wavelengthMm: undefined,
	slitSizeMm: undefined
};

MLB.holomaskLib.parms = {
	scale: 72 / 25.4, // convert to 1 / 72 inch (postscript standard)
	center: undefined, // .3*scale: center square half size 
	errLimit: 0.001, // mm
	stepSize: 1, // mm
	phaseShift: 0.25, // overall phase shift of fringes
	refZone: 0.75,
	interval: 50, // interval between support lines in mm
	mirrorRadiusMm: undefined,
	l: undefined, // reference zone
	requiredSpacing: undefined,
	a: undefined, // diffraction order separation in mm
	mirrorMeanPeriod: undefined,
	mirrorMaxPeriod: undefined,
	mirrorMinPeriod: undefined,
	deviation: undefined
};

MLB.holomaskLib.output = {
	parms: '',
	fringeCount: '',
	fileContents: '',
	graphicLines: []
};

// setInputParms(1, 50, 400, -1, 600 * 1e-6, 0.1);
MLB.holomaskLib.setInputParms = function (diffractionOrder, mirrorDiameterMm, radiusCurvatureMm, conic, wavelengthMm, slitSizeMm) {
	var inputParms = MLB.holomaskLib.inputParms;

	inputParms.diffractionOrder = diffractionOrder;
	inputParms.mirrorDiameterMm = mirrorDiameterMm;
	inputParms.radiusCurvatureMm = radiusCurvatureMm;
	inputParms.conic = conic;
	inputParms.wavelengthMm = wavelengthMm;
	inputParms.slitSizeMm = slitSizeMm;
};

MLB.holomaskLib.setInputParmsFromDOM = function () {
	var inputParms = MLB.holomaskLib.inputParms;

	inputParms.diffractionOrder = +$('input[name = diffractionOrder]').val();
	inputParms.mirrorDiameterMm = +$('input[name = mirrorDiameterMm]').val();
	inputParms.radiusCurvatureMm = +$('input[name = radiusCurvatureMm]').val();
	inputParms.conic = +$('input[name = conic]').val();
	 // note nanometers to millimeters
	inputParms.wavelengthMm = +$('input[name = wavelengthNm]').val() * 1e-6;
	inputParms.slitSizeMm = +$('input[name = slitSizeMm]').val();
};

MLB.holomaskLib.calcParms = function () {
	var inputParms = MLB.holomaskLib.inputParms,
	    parms = MLB.holomaskLib.parms;

	parms.center = 0.3 * parms.scale;
	parms.mirrorRadiusMm = inputParms.mirrorDiameterMm / 2;
	parms.l = 2 * Math.pow(parms.mirrorRadiusMm, 2) / inputParms.radiusCurvatureMm / 2 * parms.refZone * -inputParms.conic;
	parms.requiredSpacing = Math.pow(parms.mirrorRadiusMm, 2) / inputParms.radiusCurvatureMm * (1 - parms.refZone) * parms.mirrorRadiusMm / inputParms.radiusCurvatureMm * -inputParms.conic;
	parms.a = inputParms.slitSizeMm + Math.abs(parms.requiredSpacing);
	parms.mirrorMeanPeriod = inputParms.radiusCurvatureMm / parms.a * inputParms.wavelengthMm;
	parms.mirrorMaxPeriod = inputParms.radiusCurvatureMm / inputParms.slitSizeMm * inputParms.wavelengthMm;
	parms.mirrorMinPeriod = inputParms.radiusCurvatureMm / (parms.a + Math.abs(parms.requiredSpacing)) * inputParms.wavelengthMm;
	parms.deviation = 2 * inputParms.conic * Math.pow((parms.mirrorRadiusMm / Math.sqrt(2)), 4) / (8 * Math.pow(inputParms.radiusCurvatureMm, 3)) / inputParms.wavelengthMm;
	parms.l = 2 * Math.pow(parms.mirrorRadiusMm, 2) / inputParms.radiusCurvatureMm / 2 * parms.refZone * -inputParms.conic;
	parms.requiredSpacing = Math.pow(parms.mirrorRadiusMm, 2) / inputParms.radiusCurvatureMm * (1 - parms.refZone) * parms.mirrorRadiusMm / inputParms.radiusCurvatureMm * -inputParms.conic;
};

MLB.holomaskLib.buildContentPreamble = function () {
	var inputParms = MLB.holomaskLib.inputParms,
	    parms = MLB.holomaskLib.parms,
		output = MLB.holomaskLib.output;

	// output information
	output.parms = "<h3>Results</h3>";
	output.parms += "<table>";
	//output.parms += "<tr><td>Diffraction order m <td>" + inputParms.diffractionOrder + "  ";
	//output.parms += "<tr><td>Mirror diameter (mm) <td>" + inputParms.mirrorDiameterMm + "  ";
	//output.parms += "<tr><td>Mirror radius of curvature (mm) <td>" + inputParms.radiusCurvatureMm + "  ";
	//output.parms += "<tr><td>Conic <td>" + inputParms.conic + "<br>";
	 // note millimeters to nanometers
	//output.parms += "<tr><td>Wavelength (nm) <td>" + inputParms.wavelengthMm * 1e6 + "  ";
	//output.parms += "<tr><td>Diffraction order separation (mm) <td>" + parms.a + "  ";
	//output.parms += "<tr><td>Max slit size (mm) <td>" + inputParms.slitSizeMm  + "  ";
	output.parms += "<tr><td>Resolution on mirror, max period (mm) <td>" + parms.mirrorMaxPeriod + "  ";
	output.parms += "<tr><td> &nbsp; &nbsp; &nbsp; &nbsp; min period (mm) <td>" + parms.mirrorMinPeriod + "  ";
	output.parms += "<tr><td>Deviation from sphere (lambda) <td>" + parms.deviation + "  ";
	if (parms.deviation !== 0) {
		//output.parms += "<tr><td>Wavelength and tolerance, PV = lambda/10 (nm) <td>" + inputParms.wavelengthMm * 1e6 + " +- " + Math.abs(inputParms.wavelengthMm * 1e6 / 20 / parms.deviation) + "  ";
		output.parms += "<tr><td>Tolerance, PV = lambda/10 (nm) <td>" + " +- " + Math.abs(inputParms.wavelengthMm * 1e6 / 20 / parms.deviation) + "  ";
	} else {
		output.parms += "<tr><td><b>Warning: You have a sphere and can null test without a mask.</b> <td>  ";
	}
	output.parms += "</table>";
};

MLB.holomaskLib.generateEPSfileHeader = function () {
	var parms = MLB.holomaskLib.parms,
	    output = MLB.holomaskLib.output,
	    mirrorRadiusAtScale;

	mirrorRadiusAtScale = Math.round(2 * parms.mirrorRadiusMm * parms.scale) + 1;

	output.fileContents = '%!PS-Adobe-2.0 EPSF-1.2' + '\n' +
		'%%Creator:Mauritz Andersson, HoloMask; JavaScript port by Mel Bartels' + '\n' +
		'%%Title:HoloMask' + '\n' +
		'%%CreationDate: 05/03/102 14:16' + '\n' +
		'%%DocumentProcSets:Adobe_Illustrator_1.0 0 0' + '\n' +
		'%%DocumentSuppliedProcSets:Adobe_Illustrator_1.0 0 0' + '\n' +
		'%%DocumentFonts:Helvetica' + '\n' +
		'%%BoundingBox: 0 0 ' + mirrorRadiusAtScale + ' ' + mirrorRadiusAtScale + '\n' +
		'%%TemplateBox: 0 0 ' + mirrorRadiusAtScale + ' ' + mirrorRadiusAtScale + '\n' +
		'%%EndComments' + '\n' +
		'%%BeginProcSet:Adobe_Illustrator_1.0 0 0' + '\n' +
		'% Copyright (C) 1987 Adobe Systems Incorporated.' + '\n' +
		'% All Rights Reserved.' + '\n' +
		'% Adobe Illustrator is a trademark of Adobe Systems Incorporated' + '\n' +
		'/Adobe_Illustrator_1.0 dup 100 dict def load begin' + '\n' +
		'/Version 0 def' + '\n' +
		'/Revision 0 def' + '\n' +
		'% definition operators' + '\n' +
		'/bdef {bind def} bind def' + '\n' +
		'/ldef {load def} bdef' + '\n' +
		'/xdef {exch def} bdef' + '\n' +
		'% graphic state operators' + '\n' +
		'/_K {3 index add neg dup 0 lt {pop 0} if 3 1 roll} bdef' + '\n' +
		'/_k /setmybcolor where {/setcmybcolor get} ' + '\n' +
		'	{{1 sub 4 1 roll _K _K _K setrgbcolor pop} bind} ifelse def' + '\n' +
		'/g {/_b xdef /p {_b setgray} def} bdef' + '\n' +
		'/G {/_B xdef /P {_B setgray} def} bdef' + '\n' +
		'/k {/_b xdef /_y xdef /_m xdef /_c xdef /p {_c _m _y _b _k} def} bdef' + '\n' +
		'/K {/_B xdef /_Y xdef /_M xdef /_C xdef /P {_C _M _Y _B _K} def} bdef' + '\n' +
		'/d /setdash ldef' + '\n' +
		'/_i currentflat def' + '\n' +
		'/i {dup 0 equ {pop _i} if setflat} bdef' + '\n' +
		'/j /setlinejoin ldef' + '\n' +
		'/J /setlinecap ldef' + '\n' +
		'/M /setmiterlimit ldef' + '\n' +
		'/w /setlinewidth ldef' + '\n' +
		'% path construction operators' + '\n' +
		'/_R {.25 sub round .25 add} bdef' + '\n' +
		'/_r {transform _R exch _R exch itransform} bdef' + '\n' +
		'/c {_r curveto} bdef' + '\n' +
		'/C /c ldef' + '\n' +
		'/v {currentpoint 6 2 roll _r curveto} bdef' + '\n' +
		'/V /v ldef' + '\n' +
		'/y {_r 2 copy curveto} bdef' + '\n' +
		'/Y /y ldef' + '\n' +
		'/l {_r lineto} bdef' + '\n' +
		'/L /l ldef' + '\n' +
		'/m {_r moveto} bdef' + '\n' +
		'% error operators' + '\n' +
		'/_e [] def' + '\n' +
		'/_E {_e length 0 ne {gsave 0 g 0 G 0 i 0 J 0 j 1 w 10 M [] 0 d' + '\n' +
		'	/Courier 20 0 0 1 z [0.966 0.259 -0.259 0.966' + '\n' +
		'	_e 0 get _e 2 get add 2 div _e 1 get _e 3 get add 2 div]' + '\n' +
		'	e _f t T grestore} if} bdef' + '\n' +
		'/_fill {{fill} stopped {/_e [pathbbox] def /_f ' + '\n' +
		'	(ERROR: cannot fill, increase flatness) def n _E} if} bdef' + '\n' +
		'/_stroke {{stroke} stopped {/_e [pathbbox] def /_f ' + '\n' +
		'	(ERROR: cannot stroke, increase flatness) def n _E} if} bdef' + '\n' +
		'% path painting operators' + '\n' +
		'/n /newpath ldef' + '\n' +
		'/N /n ldef' + '\n' +
		'/F {p _fill} bdef' + '\n' +
		'/f {closepath F} bdef' + '\n' +
		'/S {P _stroke} bdef' + '\n' +
		'/s {closepath S} bdef' + '\n' +
		'/B {gsave F grestore S} bdef' + '\n' +
		'/b {closepath B} bdef' + '\n' +
		'% text block construction and painting operators' + '\n' +
		'/_s /ashow /def' + '\n' +
		'/_S {(?) exch {2 copy 0 exch put pop dup false charpath currentpoint ' + '\n' +
		'	_g setmatrix _stroke _G setmatrix moveto 3 copy pop rmoveto} forall ' + '\n' +
		'	pop pop pop n} bdef' + '\n' +
		'/_A {_a moveto _t exch 0 exch} bdef' + '\n' +
		'/_L {0 _l neg translate _G currentmatrix pop} bdef' + '\n' +
		'/_w {dup stringwidth exch 3 -1 roll length 1 sub _t mul add exch} bdef' + '\n' +
		'/_z [{0 0} {dup _w exch neg 2 div exch neg 2 div} ' + '\n' +
		'	{dup _w exch neg exch neg}] bdef' + '\n' +
		'/z {_z exch get /_a xdef /_t xdef /_l xdef exch findfont exch scalefont ' + '\n' +
		'	setfont} bdef' + '\n' +
		'/_g matrix def' + '\n' +
		'/_G matrix def' + '\n' +
		'/_D {_g currentmatrix pop gsave concat _G currentmatrix pop} bdef' + '\n' +
		'/e {_D p /t {_A _s _L} def} bdef' + '\n' +
		'/r {_D P /t {_A _S _L} def} bdef' + '\n' +
		'/a {_D /t {dup p _A _s P _A _S _L} def} bdef' + '\n' +
		'/o {_D /t {pop _L} def} bdef' + '\n' +
		'/T {grestore} bdef' + '\n' +
		'% group construction operators' + '\n' +
		'/u {} bdef' + '\n' +
		'/U {} bdef' + '\n' +
		'% font construction operators' + '\n' +
		'/Z {{findfont begin ' + '\n' +
		'		currentdict dup length dict begin ' + '\n' +
		'			1 index /FID ne {def} {pop pop} ifelse' + '\n' +
		'	} forall ' + '\n' +
		'	FontName exch def dup length 0 ne ' + '\n' +
		'	{/Encoding Encoding 256 array copy def 0 exch {dup type /nametype eq' + '\n' +
		'	{/Encoding 2 index 2 index put pop 1 add} {exch pop} ifelse} forall} if pop' + '\n' +
		'	currentdict dup end end /FontName get exch definefont pop} bdef' + '\n' +
		'	end' + '\n' +
		'%%EndProcSet' + '\n' +
		'%%EndProlog' + '\n' +
		'%%BeginSetup' + '\n' +
		'Adobe_Illustrator_1.0 begin' + '\n' +
		'n' + '\n' +
		'%%EndSetup' + '\n' +
		'0 G' + '\n' +
		'0 g' + '\n' +
		'0 j' + '\n' +
		'0 J' + '\n' +
		'0 w' + '\n' +
		'0.000 0.000 0.000 1.000 k' + '\n';
};

// defines the wavefront
MLB.holomaskLib.z = function (x, y) {
	var inputParms = MLB.holomaskLib.inputParms,
	    parms = MLB.holomaskLib.parms,
	    a = parms.a,
		radiusCurvatureMm = inputParms.radiusCurvatureMm,
		conic = inputParms.conic,
		l = parms.l,
		wavelengthMm = inputParms.wavelengthMm,
		diffractionOrder = inputParms.diffractionOrder;

	return 1 / diffractionOrder * (x * a / radiusCurvatureMm + l * (Math.pow(x, 2) + Math.pow(y, 2)) / (2 * Math.pow(radiusCurvatureMm, 2)) + 2 * conic * Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 2) / (8 * Math.pow(radiusCurvatureMm, 3))) / wavelengthMm;
};

// defines the x differentiation of the wavefront
MLB.holomaskLib.z_x = function (x, y) {
	var inputParms = MLB.holomaskLib.inputParms,
	    parms = MLB.holomaskLib.parms,
	    a = parms.a,
		radiusCurvatureMm = inputParms.radiusCurvatureMm,
		conic = inputParms.conic,
		l = parms.l,
		wavelengthMm = inputParms.wavelengthMm,
		diffractionOrder = inputParms.diffractionOrder;

	return 1 / diffractionOrder * (a / radiusCurvatureMm + l * (2 * x) / (2 * Math.pow(radiusCurvatureMm, 2)) + 2 * conic * 2 * (Math.pow(x, 2) + Math.pow(y, 2)) * 2 * x / (8 * Math.pow(radiusCurvatureMm, 3))) / wavelengthMm;
};

// solve iteratively to find x pos of a fringe given y pos using x as initial value
MLB.holomaskLib.find_x = function (x, y, phaseShift) {
	var parms = MLB.holomaskLib.parms,
	    err = 1e10,
		count = 0,
		z = MLB.holomaskLib.z,
		z_x = MLB.holomaskLib.z_x,
		x_n;

	while (err > parms.errLimit && count < 60) {
        count++;
        x_n = x - (z(x, y) - phaseShift) / z_x(x, y);
        err = Math.abs(x_n - x);
        x = x_n;
    }
    if (Math.abs(z(x, y) - phaseShift) < 10 * parms.errLimit) {
        return x;
    }
	// alert('Holomask: Problem to find fringe.');
    return 1e20;
};

// create fringe segment at phaseShift 
// x initial point (x need only be a guess)
/*
$pts array structure
	initially:
	$pts	array[1]		
		[0]	array[2]		
			[0]	float	-23.416666797219	
			[1]	float	0.5	
	then:
	$pts	array[3]		
		[0]	array[2]		
			[0]	float	-23.416666797219	
			[1]	float	0.5	
		[1]	array[2]		
			[0]	float	-23.412961985382	
			[1]	float	1.5	
		[2]	array[2]		
			[0]	float	-23.405323781284	
			[1]	float	2.5			
*/
MLB.holomaskLib.curve = function (x, phaseShift, y_step) {
	var parms = MLB.holomaskLib.parms,
	    find_x = MLB.holomaskLib.find_x,
	    i = 0,
		upp = true,
		y = y_step / 2, //initial moveto point
		xx = find_x(x, y, phaseShift),
		x_pre = xx,
		y_pre = y,
		pts = [],
		yy,
		kk,
		p,
		q;

	pts.push([xx, y]);

    while (upp) {
        i++;
        yy = y + i * y_step;
        xx = find_x(x_pre, yy, phaseShift);
        if (Math.pow(xx, 2) + Math.pow(yy, 2) > Math.pow(parms.mirrorRadiusMm, 2)) {
            upp = false;
            //outside aperture, find intersection
            kk = (xx - x_pre) / (yy - y_pre);
            p = (2 * x_pre * kk - 2 * y_pre * Math.pow(kk, 2)) / (1 + Math.pow(kk, 2));
            q = (Math.pow(y_pre, 2) * Math.pow(kk, 2) + Math.pow(x_pre, 2) - 2 * x_pre * y_pre * kk - Math.pow(parms.mirrorRadiusMm, 2)) / (1 + Math.pow(kk, 2));
            yy = -p / 2 + Math.sqrt(Math.max(Math.pow(p / 2, 2) - q, 0));
            xx = find_x(x_pre, yy, phaseShift);
        }
		pts.push([xx, yy]);
        x_pre = xx;
        y_pre = yy;
    }
    return pts;
};

//make path from two curves and remove elements
MLB.holomaskLib.path = function (points_l, points_r, support_interval) {
	var pth,
	    tmp;

    if (points_l.length >= support_interval && points_r.length >= support_interval) {
        pth = array_splice(points_l, 0, support_interval);
        tmp = array_splice(points_r, 0, support_interval);
        tmp = array_reverse(tmp);
        pth = array_merge(pth, tmp);
    } else {
        pth = array_splice(points_l, 0, points_l.length);
        tmp = array_splice(points_r, 0, points_r.length);
        tmp = array_reverse(tmp);
        pth = array_merge(pth, tmp);
    }
    return pth;
};

MLB.holomaskLib.sign = function (s) {
	return s / Math.abs(s + 1e-16);
};

// does the actual output
MLB.holomaskLib.fringe = function (i) {
	var parms = MLB.holomaskLib.parms,
	    inputParms = MLB.holomaskLib.inputParms,
		output = MLB.holomaskLib.output,
		sign = MLB.holomaskLib.sign,
		pth,
		ptm,
		xxm,
		yym,
		str,
		ptKey,
		pt,
		xx,
		yy,
		path = MLB.holomaskLib.path,
		curve = MLB.holomaskLib.curve,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		more_path = true,
		crv_l = curve(-0.8 * parms.mirrorRadiusMm * sign(inputParms.conic), i + parms.phaseShift, parms.stepSize),
        crv_r = curve(-0.8 * parms.mirrorRadiusMm * sign(inputParms.conic), i + 0.5 + parms.phaseShift, parms.stepSize);

	while (more_path) {
        if (Math.min(crv_l.length, crv_r.length) < 1.1 * parms.interval) {
            pth = path(crv_l, crv_r, 1e10);
        } else {
            pth = path(crv_l, crv_r, parms.interval);
        }
        if (pth.length > 2) {
			//up
			ptm = array_pop(pth);
			xxm = ptm[0];
			yym = ptm[1];
			//moveto               
			str = roundToDecimal((xxm + parms.mirrorRadiusMm) * parms.scale, 2) + ' ' + roundToDecimal((yym + parms.mirrorRadiusMm) * parms.scale, 2) + ' m\n';
			output.fileContents += str;
			for (ptKey in pth) {
				pt = pth[ptKey];
				xx = pt[0];
				yy = pt[1];
			   //lineto
				str = roundToDecimal((xx + parms.mirrorRadiusMm) * parms.scale, 2) + ' ' + roundToDecimal((yy + parms.mirrorRadiusMm) * parms.scale, 2) + ' l\n';
				output.fileContents += str;
			}
			//close path
			output.fileContents += 's\n';
			//down
			//moveto
			str = roundToDecimal((xxm + parms.mirrorRadiusMm) * parms.scale, 2) + ' ' + roundToDecimal((-yym + parms.mirrorRadiusMm) * parms.scale, 2) + ' m\n';
			output.fileContents += str;
			for (ptKey in pth) {
				pt = pth[ptKey];
				xx = pt[0];
				yy = pt[1];
			   //lineto
				str = roundToDecimal((xx + parms.mirrorRadiusMm) * parms.scale, 2) + ' ' + roundToDecimal((-yy + parms.mirrorRadiusMm) * parms.scale, 2) + ' l\n';
				output.fileContents += str;
			}
			//close path
			output.fileContents += 's\n';
        } else {
            more_path = false;
        }
    }
};

MLB.holomaskLib.fringes = function () {
	var parms = MLB.holomaskLib.parms,
	    output = MLB.holomaskLib.output,
	    find_x = MLB.holomaskLib.find_x,
		fringe = MLB.holomaskLib.fringe,
	    count = 0,
		i,
		x_l,
		x_r;

    for (i = -Math.round(2 * parms.mirrorRadiusMm / parms.mirrorMinPeriod); i <= Math.round(2 * parms.mirrorRadiusMm / parms.mirrorMinPeriod); i++) {
        x_l = Math.min(find_x(-0.9 * parms.mirrorRadiusMm, 0, i - 0.1 + parms.phaseShift), find_x(-0.9 * parms.mirrorRadiusMm, 0, i + 0.6 + parms.phaseShift));
        x_r = Math.max(find_x(0.8 * parms.mirrorRadiusMm, 0, i + 0.6 + parms.phaseShift), find_x(0.8 * parms.mirrorRadiusMm, 0, i - 0.1 + parms.phaseShift));
        if (x_l >= -parms.mirrorRadiusMm && x_r <= parms.mirrorRadiusMm) {
            fringe(i);
            count++;
		}
    }

    output.fringeCount = "<table><tr><td>Number of fringes</td><td>" + count + "</td></tr></table>";
};

MLB.holomaskLib.addCenterSpotAndFooter = function () {
	var centerspot,
	    cornerspot,
		footer,
		output = MLB.holomaskLib.output,
		parms = MLB.holomaskLib.parms;

	centerspot = (-parms.center + parms.mirrorRadiusMm * parms.scale) + ' ' + (-parms.center + parms.mirrorRadiusMm * parms.scale) + ' m\n';
	centerspot += (parms.center + parms.mirrorRadiusMm * parms.scale) + ' ' + (-parms.center + parms.mirrorRadiusMm * parms.scale) + ' l\n';
	centerspot += (parms.center + parms.mirrorRadiusMm * parms.scale) + ' ' + (parms.center + parms.mirrorRadiusMm * parms.scale) + ' l\n';
	centerspot += (-parms.center + parms.mirrorRadiusMm * parms.scale) + ' ' + (parms.center + parms.mirrorRadiusMm * parms.scale) + ' l\n';
	centerspot += (-parms.center + parms.mirrorRadiusMm * parms.scale) + ' ' + (-parms.center + parms.mirrorRadiusMm * parms.scale) + ' l\n';
	centerspot += 'f\n';
	output.fileContents += centerspot;

	cornerspot = '0 0 m\n';
	cornerspot += (parms.center * 10) + ' 0 l\n';
	cornerspot += '0 ' + (parms.center * 10) + ' l\n';
	cornerspot += 'f\n';
	output.fileContents += cornerspot;

	footer = '\n' +
		'%%Trailer\n' +
		'_E end\n';

	output.fileContents += footer;
};

MLB.holomaskLib.extractGraphics = function () {
	var output = MLB.holomaskLib.output;

	// just lines like '7.05 72.28 m' and '135.62 63.78 l' and 'f' and 's' 
	output.graphicLines = output.fileContents.match(/^f$|^s$|(.*)( l| m)$/mg, '$1');
};

// end of file
