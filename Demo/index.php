<?

	DisplayDemoPage();


function DisplayDemoPage() {
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <link rel="SHORTCUT ICON" HREF="images/favicon.gif" type="image/ico">
  <title>MooTools TableSorter Demo</title>
  <meta name="description" content="">
  <meta name="keywords" content="">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link href="css/public.css" media="screen" rel="Stylesheet" type="text/css" />
  
  <script type="text/javascript" src="scripts/mootools-core-1.4.2.js"></script>
  <script type="text/javascript" src="scripts/TableSorter.js"></script>
</head>
<body>
 <div class="centered" style="width: 600px;">
  <h2>TableSorter Demo</h2>
  <p style="width: 450px; margin: 0 auto 20px auto;">
    Functionality to add sort capabilities to a table.
  </p>
  <p>Click on a column header to sort by that column.</p>
  <p>Supports numbers, strings, dates, checkboxes, inputs, and selects when given hints about datatypes in the column.  Code to make this table
  	sortable:<br />
  	<br />
  	<code>new TableSorter('dataTable', { cookieName: 'tableSort', columnDataTypes: 'int, string, date, money, checkbox' });</code>
  </p>
  <table id="dataTable" class="data" width="600px">
    <tr><th>ID</th><th>Name</th><th>Added</th><th>Cost</th><th>Is Rad?</th></tr>
    <tr><td>1</td><td>Mario Kart</td><td>8/12/1996 12:30 pm</td><td>$49.99</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>2</td><td>Mario Kart 64</td><td>2/03/1999 4:02 pm</td><td>$69.99</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>3</td><td>Talking Moose</td><td>6/14/2008 8:22 am</td><td>Priceless</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>4</td><td>Velvet Jones' Diary</td><td>6/14/1989 11:04 pm</td><td>$5.28</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>5</td><td>Stick of gum</td><td>1/05/2012 3:20 pm</td><td>$0.30</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>6</td><td>Carl Fisk's Signature</td><td>4/02/2001 6:14 pm</td><td>$130.00</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>7</td><td>First Car</td><td>12/29/1997 9:10 am</td><td>$10,000.00</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>8</td><td>Ghetto-fab cellphone</td><td>1/07/2010 3:10 pm</td><td>$30</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>9</td><td>Can of tuna</td><td>1/04/2011 11:53 am</td><td>$.69</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>10</td><td>Improv Lessons</td><td>2/18/2012 6:00 pm</td><td>$45.00</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>11</td><td>Fake Moustache</td><td>10/13/1987 1:14 pm</td><td>$3.00</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>12</td><td>Moustache Comb</td><td>10/13/1987 1:17 pm</td><td>$1.15</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>13</td><td>Desk Lamp</td><td>12/27/2010 4:56 pm</td><td>$29.95</td><td class="center"><input type="checkbox" /></td></tr>
    <tr><td>14</td><td>Argentine Prime Rib</td><td>11/16/2009 9:25 pm</td><td>$6.54</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>15</td><td>apples</td><td>11/16/2009 9:25 pm</td><td>$6.54</td><td class="center"><input type="checkbox" checked /></td></tr>
    <tr><td>16</td><td>berries</td><td>11/16/2009 9:25 pm</td><td>$6.54</td><td class="center"><input type="checkbox" checked /></td></tr>
  </table>
 </div>
  
<script type="text/javascript">
	window.addEvent('domready', function() {
		sorter = new TableSorter('dataTable', { cookieName: 'tableSort', isCaseSensitive: false,
			columnDataTypes: 'int, string, date, money, checkbox' });
	});
</script>
</body>
</html>
<?
}

function JSLink($text, $onclick, $class = "button") {
	return "<a href=\"JavaScript:void(0);\" onclick=\"$onclick\" class=\"$class\">$text</a>";
}
?>