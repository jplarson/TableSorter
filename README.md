TableSorter
===========

![Screenshot](http://www.jpl-consulting.com/projects/MooTools/TableSorter/ScreenShots/TableSorter0.gif)

Add click-to-sort capability to any table.

Supports sorting by numbers, strings, dates, checkboxes, and input values.

How to Use
----------

A table can be set up for sorting just by passing the table element (or its ID) to the TableSorter constructor:

	#HTML
	<table id="dataTable">
	  <tr>
	    <th>ID</th>
	    <th>Name</th>
	    <th>Balance</th>
	    <th>DatAdded</th>
	  </tr>
	  ... table data ...
	</table>

	#JS
	var tableSorter = new TableSorter('dataTable');

To enable the more specialized data-type awareness for sort comparisons, we explicitly name them as an option:

	#JS
	var tableSorter = new TableSorter('dataTable', { columnDataTypes: 'int, string, money, date' });
	
To enable persistent sort state for this column (via cookie), we supply a cookie name:

	#JS
	var tableSorter = new TableSorter('dataTable', { cookieName: 'tableSortState' });

Tables should be styled via CSS however you usually would style them, but TableSorter suggests adding two more classes to visually highlight columns which are sorted:

	#HTML
	table th.sortAsc {
		background:			#a8d4e3 url(../images/headerRowBGSortAsc.png) 100% 0 repeat-x;
		color:				#fff;
	}
	table th.sortDesc {
		background:			#a8d4e3 url(../images/headerRowBGSortDesc.png) 100% 0 repeat-x;
		color:				#fff;
	}

TableSorter Options
------------------

There are a few options of TableSorter to customize its behavior:

- columnDataTypes allows you to give hints as to how data should be interpreted for sorting purposes.  Can be supplied by either array or comma-separated list.
- sortDirection and sortColumn control the initial state.  sortColumn is an index into the collection of columns, and sortDirection is either 'asc' or 'desc'.
- headerRowCount and rowsPerRecord give hints about the structure of your table (both default to 1, and in mose cases this is correct).
- headerAscClass and headerDescClass are class names for CSS styling purposes.
- cookieName and cookieDays control persistent sort state (which cookie to save as and for how long).  By default sort state is not saved, so this must be supplied for persistence.
- includeTitles, titleFormula and titleSet control how titles appear (hover over tool tips--by default "Sort by [columnName]").
- footerRowClass and exemptRowClass are the class names for TR elements which should be ignored for sorting purposes.
- dateParseFunction allows you to override the native Date.parse function, nice if you have dd/mm/yyyy dates when your system expects mm/dd/yyyy.


Dependencies
------------
	core:1.4.2/Events
	core:1.4.2/Options