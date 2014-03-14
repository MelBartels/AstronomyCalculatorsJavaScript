// copyright Mel Bartels, 2013-2014

'use strict';

// for csv, see https://code.google.com/p/jquery-csv/

// check for File API support
(function () {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		//alert('All the File APIs are supported.');
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
}());

MLB.objectLibCalc = {};
MLB.objectLibCalc.reader = {};

MLB.objectLibCalc.translateDescription = function () {
	var getDescription = MLB.objectLib.getDescription,
	    codedDescription = $('input[name=codedDescription]').val();

	$('input[name=translatedDescription]').val(getDescription(codedDescription));
};

MLB.objectLibCalc.errorHandler = function (e) {
	switch (e.target.error.code) {
	case e.target.error.NOT_FOUND_ERR:
		alert('File not found');
		break;
	case e.target.error.SECURITY_ERR:
		alert('Security prevented reading the file');
		break;
	case e.target.error.NOT_READABLE_ERR:
		alert('File not readable');
		break;
	case e.target.error.ABORT_ERR:
		break;
	case e.target.error.ENCODING_ERR:
		break;
	default:
		alert('An error occurred reading this file');
	}
};

MLB.objectLibCalc.abortRead = function () {
	MLB.objectLibCalc.reader.abort();
};

MLB.objectLibCalc.readAndDisplayCSV = function (e) {
	var csvResult = document.getElementById('csvResult'),
	    csv = e.target.result,
	    data = $.csv.toArrays(csv),
		rowCount = data.length,
		ixR,
		row,
		itemCount,
		ixI,
		item,
		itemResult,
		catalogs,
	    html = '',
		getCatalogs = MLB.objectLib.getCatalogs,
		getObjectType = MLB.objectLib.getObjectType,
		getConstellation = MLB.objectLib.getConstellation,
		getClassificationFrom = MLB.objectLib.getClassificationFrom,
		getDescription = MLB.objectLib.getDescription;


	for (ixR = 0; ixR < rowCount; ixR++) {
		row = data[ixR];
		html += '<tr>\r\n';
		itemCount = row.length;
		for (ixI = 0; ixI < itemCount; ixI++) {
			item = row[ixI];
			if (ixR > 0) {
				switch (ixI) {
				case 0:
				case 1:
					catalogs = getCatalogs(item);
					if (catalogs.length > 0) {
						itemResult = item + ' (' +  catalogs + ')';
					} else {
						itemResult = '';
					}
					break;
				case 2:
					itemResult = getObjectType(item);
					break;
				case 3:
					itemResult = getConstellation(item);
					break;
				case 13:
					itemResult = item + ' (' + getClassificationFrom(row[2], item) + ')';
					break;
				case 17:
					itemResult = item + ' (' + getDescription(item) + ')';
					break;
				default:
					itemResult = item;
				}
			} else {
				itemResult = item;
			}
			html += '<td>' + itemResult + '</td>\r\n';
		}
		html += '</tr>\r\n';
	}
	csvResult.innerHTML = html;
};

MLB.objectLibCalc.setupReader = function (onloadFunction) {
	var reader;

	// get a new one; only call is here
	MLB.objectLibCalc.reader = new FileReader();
	reader = MLB.objectLibCalc.reader;
	reader.onerror = MLB.objectLibCalc.errorHandler;
	reader.onabort = function (e) {
		alert('File read cancelled');
	};
	reader.onload = onloadFunction;
	reader.onloadstart = function (e) {
		document.getElementById('status').innerHTML = 'Reading file...';
	};
	reader.onloadend = function (e) {
		document.getElementById('status').innerHTML = '...finished.';
	};
	return reader;
};

MLB.objectLibCalc.processFile = function (file) {
	var setupReader = MLB.objectLibCalc.setupReader,
		readAndDisplayCSV = MLB.objectLibCalc.readAndDisplayCSV,
	    csvResult = document.getElementById('csvResult'),
		reader;

	if (file.type.match('text/plain')) {
		reader = setupReader(readAndDisplayCSV);
		reader.readAsText(file);
	} else {
		csvResult.innerHTML = 'Not a txt (csv delimited) file';
	}
};

MLB.objectLibCalc.filesSelected = function (e) {
	MLB.objectLibCalc.processFile(e.target.files[0]);
};

MLB.objectLibCalc.filesSelectedUsingDragAndDrop = function (e) {
	// end the event here: don't let any other handlers act
	e.stopPropagation();
	// otherwise the browser's default behavior will display the file's contents
	e.preventDefault();

	MLB.objectLibCalc.processFile(e.dataTransfer.files[0]);
};

MLB.objectLibCalc.dragOver = function (e) {
	// end the event here: don't let any other handlers act
	e.stopPropagation();
	// otherwise the browser's default behavior will display the file's contents
	e.preventDefault();
	// set cursor style to 'copy' 
	e.dataTransfer.dropEffect = 'copy';
};

window.onload = function () {
	var dropZone;

	document.getElementById('btnTranslate').onclick = MLB.objectLibCalc.translateDescription;
	document.getElementById('btnAbortRead').onclick = MLB.objectLibCalc.abortRead;
	document.getElementById('btnFile').onchange = MLB.objectLibCalc.filesSelected;
	dropZone = document.getElementById('selectedFileDropDiv');
	dropZone.ondragover = MLB.objectLibCalc.dragOver;
	dropZone.ondrop = MLB.objectLibCalc.filesSelectedUsingDragAndDrop;
};

// end of file