// copyright Mel Bartels, 2014
// see motorLib unitTests.htm for unit tests; also the motor calculator, motorCalc.htm
// turn on jslint's Tolerate ++ and --

'use strict';

MLB.motorLib = {};

MLB.motorLib.drive = function () {
	this.name = undefined;
	this.speedReductions = [];
	this.totalReduction = undefined;
};

MLB.motorLib.driveBuilder = function (name) {
	var drive = new MLB.motorLib.drive();
	drive.name = name;
	return drive;
};

MLB.motorLib.addReduction = function (drive, name, reduction) {
	if (!isNaN(reduction)) {
		drive.speedReductions.push({name: name, reduction: reduction});
		MLB.motorLib.calcTotalReduction(drive);
	}
};

MLB.motorLib.calcTotalReduction = function (drive) {
	var ix,
		speedReductionsLength = drive.speedReductions.length;

	drive.totalReduction = 1;
	for (ix = 0; ix < speedReductionsLength; ix++) {
		drive.totalReduction *= drive.speedReductions[ix].reduction;
	}
};

MLB.motorLib.calcMotorEncoderTicksPerArcsec = function (drive) {
	return drive.totalReduction * MLB.sharedLib.uom.arcsecToRev;
};

MLB.motorLib.calcRPMs = function (drive, driveAngularSpeedDegreesPerSecond) {
	var ix,
	    speedReductionsLength = drive.speedReductions.length,
		runningReduction = 1,
	    rpms = [];

	for (ix = speedReductionsLength - 1; ix > -1; ix--) {
		runningReduction *= drive.speedReductions[ix].reduction;
		// 'x' deg/sec * 1 rev/360deg * 60 sec/min = x/6 rev/min (rpms)
		rpms[ix] = driveAngularSpeedDegreesPerSecond / 6 * runningReduction;
	}
	return rpms;
};

MLB.motorLib.calcTotalReductionUnitsPerSec = function (drive, driveAngularSpeedDegreesPerSecond) {
	// 'x' deg/sec * 1 rev/360deg = x/360 rev/sec
	return driveAngularSpeedDegreesPerSecond / 360 * drive.totalReduction;
};

MLB.motorLib.calcMaxSlewSpeedDegSec = function (drive, maxMotorRPM) {
	// eg, maxMotorRPM = 1800; 1800rpm * 1min/60sec = 30rps; 30rps * 10,000 encoder ticks/motorRev = 300,000 encoder ticks/sec; 300,000 encoder ticks/sec * 1296000 arcsec/totalReduction(ticks/rev of 37800000) = 10285.714285714286 arcsec/sec; 10285.714285714286 arcsec/sec * 1deg/3600arcsec = 2.857142857142857 deg/sec
	// constant of 6 derived from 1min/60sec * 1296000arcsec/rev * 1deg/3600arcsec = 6 min-deg/sec-rev
	// or 1800 motorRev/min * 10,000 encoder ticks/motorRev / totalReduction(ticks/rev of 37800000) * 6 min-deg/sec-rev = 2.8571428571428568 
	// uoms: motorRev-ticks-rev-min-deg/min-motorRev-ticks-sec-rev = deg/sec
	// alternatively, return maxMotorRPM / 60 * drive.speedReductions[0].reduction / MLB.sharedLib.uom.arcsecToRev / drive.totalReduction / 3600;
	return maxMotorRPM * drive.speedReductions[0].reduction / drive.totalReduction * 6;
};

// end of file
