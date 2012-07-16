/*
---
description: Provides sorting for tables by clicking on column header cells, supports numbers, dates, text, checkboxes, and inputs.

license: MIT-style

authors:
- John Larson

requires:
- core:1.4.2/Events
- core:1.4.2/Options
- core:1.4.2/Cookie

provides: [TableSorter]

...
*/

var TableSorter = new Class({
	
	Implements: [Options, Events],
	
	options: {
		rowsPerRecord:			1,
		headerAscClass:			'sortAsc',
		headerDescClass:		'sortDesc',
		sortDirection:  		'asc',
		sortColumn:    			-1,
		cookieName:				null,
		cookieDays:				999,
		includeTitles:			true,
		titleFormula:			'Sort by [headerText]',
		titleSet:				null,
		footerRowClass:			'footer',
		exemptRowClass:			'sortExempt',
		isCaseSensitive:		false, 
		dateParseFunction:		Date.parse, 
		columnDataTypes:		[] // money, int, numeric, number, real, date, datetime checkbox, select, input, img, image
	},
	
	initialize: function(table, options) {
		
		if(!document.id(table)) throw('Unknown table passed to TableSorter contructor (' + table + ')');
		this.table = document.id(table);
		this.setOptions(options);
		
		// Build our set of data types--hints for comparison operations:
		var columnDataTypes = this.options.columnDataTypes || [];
		if(typeOf(columnDataTypes) == 'string') {  // handled a comma-separated list
			columnDataTypes = columnDataTypes.split(/,\s*/);
		}
		
		var columnCount = columnDataTypes.length;
		this.columnDataTypeSet = columnDataTypes;
		var self = this;
		this.headerCells = this.table.getElement('tr').getChildren();
		this.columnDataTypeSet.each(function(dataType, index) {
			if(dataType + '' != '') { // sortable column!
				th = self.headerCells[index];
				th.columnIndex = index;
				th.setStyle('cursor', 'pointer');
				th.addEvent('click', self.handleHeaderClick.bind(self));
				if(self.options.includeTitles) {
					var thisTitle;
					if(self.options.titleSet)
						thisTitle = self.options.titleSet[index];
					else
						thisTitle = self.options.titleFormula.replace('[headerText]', th.get('text'));
					th.title = thisTitle;
				}
			}
		});
		
		this.tbody = this.table.getElement('tbody')  ||  this.table;
		
		// Create a data set of records.  Records will consist of as many table
		// rows per as given by the rowsPerRecord option (most usually 1,
		// but common use case is 2 when there's a "details" row that is
		// connected to the rows above it).  The structure is this:
		//		record: {
		//			rowSet:		rowDomElements[],
		//			dataSet:	array of comparable-ready raw data values, one per column
		//		}
		var trSet = this.table.getElements('tr');
		trSet.shift(); // take off the header row
		this.recordSet = [];
		this.footerRowSet = [];
		while (trSet.length > 0) {
			var thisRecordRow = trSet.shift();
			if(thisRecordRow.hasClass(this.options.footerRowClass)  ||
			   thisRecordRow.hasClass(this.options.exemptRowClass)) {
				this.footerRowSet.push(thisRecordRow);
			}
			else { // regular sortable record row!
				var thisRecordRowSet = [thisRecordRow];
				for(var i=0; i < this.options.rowsPerRecord-1; i++)
					thisRecordRowSet.push(trSet.shift());
				
				// now build our data structure of raw, comparison-ready data:
				var thisDataSet = new Array(columnCount);
				for(var c=0; c < columnCount; c++) {
					var pureData;
					try {
						var rawData = $(thisRecordRow.getChildren()[c]).getProperty('text');
					} catch(e) {
						throw('Row in table found with less td elements than header. ' +
							'Be certain your table rows are uniform, and that you have ' +
							'set rowsPerRecord correctly in the TableSorter constructor.');
					}
					switch(this.columnDataTypeSet[c]) {
						case 'money': case 'int': case 'numeric': case 'number': case 'real':
							var matchSet = rawData.replace(/,/g, '').match(/([-+]?[0-9]*\.?[0-9]+)/);
							if(matchSet)
								pureData = Number(matchSet[0]);
							else
								pureData = null;
							break;
						case 'date': case 'datetime':
							pureData = this.options.dateParseFunction(rawData);
							break;
						case 'checkbox':
							var theCheckbox = $(thisRecordRow.getChildren()[c]).getElement('input[type=checkbox]');
							pureData = theCheckbox ? theCheckbox.checked : null;
							break;
						case 'select':
							var theSelect = $(thisRecordRow.getChildren()[c]).getElement('select');
							pureData = theSelect ? theSelect.options[theSelect.selectedIndex].text : null;
							break;
						case 'input':
							var theInput = $(thisRecordRow.getChildren()[c]).getElement('input[type=text]');
							pureData = theInput ? theInput.value : null;
							break;
						case 'img': case 'image':
							var theImg = $(thisRecordRow.getChildren()[c]).getElement('img');
							pureData = theImg ? theImg.src : null;
							break;

						default:
							pureData = (this.options.isCaseSensitive ? rawData : rawData.toLowerCase()).trim();
					}
					thisDataSet[c] = pureData;
				}
				this.recordSet.push({ rowSet: thisRecordRowSet, dataSet: thisDataSet });
			}
		}
		
		this.sortColumn = this.options.sortColumn;
		this.sortDirection = this.options.sortDirection;
		
		var recalledSort = this.recallSortOrder();
		if(recalledSort) {
			var sortSet = recalledSort.split(' ');
			this.sortColumn = sortSet[0];
			this.sortDirection = sortSet[1];
		}
		
		if(this.sortColumn != -1) // we should sort!
			this.sortRows();
	},
	
	handleHeaderClick: function(event) {
		var element = event.target;
		if(element.columnIndex == null) // not a header cell click
			return;
		
		if(this.columnDataTypeSet[element.columnIndex] == '') // not a sortable column!
			return;
		
		// as a response to the click, we'll adjust our sort state
		// given by sortColumn and sortDirection:
		if(this.sortColumn == element.columnIndex)
			this.sortDirection = (this.sortDirection == 'asc' ? 'desc' : 'asc');
		else {
			this.sortColumn = element.columnIndex;
			this.sortDirection = 'asc';
		}
		
		// Now we'll sort according to the new sort state:
		this.sortRows();
	},
	
	sortRows: function() {
		
		var sortColumn = this.sortColumn;
		var sortDirection = this.sortDirection;
		
		// First order of business: adjust the markings of the header:
		this.headerCells.each(function(th, index) {
			if(index == sortColumn) {
				th.addClass(sortDirection == 'asc' ?
					this.options.headerAscClass :
					this.options.headerDescClass);
				th.removeClass(sortDirection == 'desc' ?
					this.options.headerAscClass :
					this.options.headerDescClass)
			}
			else {
				th.removeClass(this.options.headerAscClass);
				th.removeClass(this.options.headerDescClass);
			}
		}.bind(this));
		
		this.recordSet.sort(function(r1, r2) {
			var c1 = r1.dataSet[sortColumn];
			var c2 = r2.dataSet[sortColumn];
			return (c1 < c2 ? -1 : (c2 < c1 ? 1 : 0));
		});
		if(sortDirection == 'desc')
			this.recordSet.reverse();
		
		// Now to rebuild the DOM according to our newly-sorted recordSet:
		this.recordSet.each(function(theRecord, index) {
			for(var i=0; i < theRecord.rowSet.length; i++) {
				var thisRow = theRecord.rowSet[i];
				this.tbody.appendChild(thisRow);
			}
		}.bind(this));
		
		// Append the footer rows last, in order:
		for(var i=0; i < this.footerRowSet.length; i++)
			this.tbody.appendChild(this.footerRowSet[i]);
		
		this.saveSortOrder();
	},
	
	
	recallSortOrder: function(){
		return (this.options.cookieName) ? [Cookie.read(this.options.cookieName), false].pick() : false;
	},
	
	saveSortOrder: function(){
		if(this.options.cookieName) 
			Cookie.write(this.options.cookieName, 
				this.sortColumn + ' ' + this.sortDirection,
				{duration:this.options.cookieDays});
	}
});