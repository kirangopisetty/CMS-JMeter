/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.904375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "CLICK ON ADD TO CART"], "isController": false}, {"data": [0.995, 500, 1500, "SIGN OUT PROCESS-1"], "isController": false}, {"data": [1.0, 500, 1500, "SIGN OUT PROCESS-0"], "isController": false}, {"data": [1.0, 500, 1500, "CLICK ON PRODUCT ID"], "isController": false}, {"data": [1.0, 500, 1500, "ENTER PAYMENT DETAILS"], "isController": false}, {"data": [0.5, 500, 1500, "VISIT HOME PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SIGN IN PROCESS-0"], "isController": false}, {"data": [1.0, 500, 1500, "SIGN IN PROCESS-1"], "isController": false}, {"data": [1.0, 500, 1500, "CLICK ON ITEM ID"], "isController": false}, {"data": [0.99, 500, 1500, "SIGN IN PROCESS"], "isController": false}, {"data": [1.0, 500, 1500, "VISIT SIGN IN PAGE"], "isController": false}, {"data": [0.99, 500, 1500, "SIGN OUT PROCESS"], "isController": false}, {"data": [1.0, 500, 1500, "CLICK ON PROCEED TO CHECKOUT"], "isController": false}, {"data": [0.0, 500, 1500, "TRANSACTION CONTROLLER"], "isController": true}, {"data": [1.0, 500, 1500, "CONFIRM THE ORDER"], "isController": false}, {"data": [1.0, 500, 1500, "CLICK ON RANDOM PET"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1500, 0, 0.0, 213.51866666666683, 140, 1101, 158.0, 326.0, 614.0, 719.97, 123.10217480508823, 510.2789514515798, 90.45621537751333], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["CLICK ON ADD TO CART", 100, 0, 0.0, 168.23, 143, 739, 156.0, 170.0, 213.04999999999956, 735.4799999999982, 10.681478316599017, 50.20774640835292, 6.360069296090579], "isController": false}, {"data": ["SIGN OUT PROCESS-1", 100, 0, 0.0, 161.02999999999992, 141, 639, 154.0, 167.0, 180.74999999999994, 634.7699999999978, 10.704345964461572, 52.76908049668165, 6.031648067865553], "isController": false}, {"data": ["SIGN OUT PROCESS-0", 100, 0, 0.0, 156.48000000000005, 140, 369, 152.0, 166.0, 178.79999999999995, 367.16999999999905, 10.708931248661383, 2.4053263546798034, 6.128353234097237], "isController": false}, {"data": ["CLICK ON PRODUCT ID", 100, 0, 0.0, 162.59000000000006, 144, 460, 156.5, 169.0, 176.89999999999998, 459.09999999999957, 10.670081092616304, 43.23810702758216, 6.34765625], "isController": false}, {"data": ["ENTER PAYMENT DETAILS", 100, 0, 0.0, 159.22, 142, 342, 156.0, 171.70000000000002, 176.95, 340.4299999999992, 10.690613641223006, 49.16220667628822, 12.623902541693393], "isController": false}, {"data": ["VISIT HOME PAGE", 100, 0, 0.0, 655.9599999999997, 581, 1101, 625.0, 763.7000000000003, 849.7499999999998, 1101.0, 9.646922631680493, 53.359540806482734, 4.936511190430253], "isController": false}, {"data": ["SIGN IN PROCESS-0", 100, 0, 0.0, 155.94, 141, 215, 154.5, 166.9, 173.95, 214.63999999999982, 10.650761529449357, 2.392260890403664, 9.205003860901055], "isController": false}, {"data": ["SIGN IN PROCESS-1", 100, 0, 0.0, 161.29999999999998, 141, 388, 154.0, 166.9, 208.1999999999996, 387.81999999999994, 10.667804565820354, 53.641138388094724, 6.521528963089396], "isController": false}, {"data": ["CLICK ON ITEM ID", 100, 0, 0.0, 157.47000000000008, 140, 239, 155.0, 171.8, 177.95, 238.53999999999976, 10.676916506512919, 41.11634669282511, 6.263512972453555], "isController": false}, {"data": ["SIGN IN PROCESS", 100, 0, 0.0, 317.5099999999999, 284, 562, 310.0, 334.9, 379.1499999999998, 561.6499999999999, 10.482180293501049, 55.06215605345913, 15.467357835429771], "isController": false}, {"data": ["VISIT SIGN IN PAGE", 100, 0, 0.0, 155.75000000000006, 141, 218, 154.0, 163.9, 167.95, 217.96999999999997, 10.638297872340425, 42.54488031914894, 6.119099069148936], "isController": false}, {"data": ["SIGN OUT PROCESS", 100, 0, 0.0, 317.76999999999987, 282, 785, 306.5, 334.0, 366.29999999999984, 782.4099999999987, 10.53518752633797, 54.30148414454277, 11.965256926885797], "isController": false}, {"data": ["CLICK ON PROCEED TO CHECKOUT", 100, 0, 0.0, 156.85999999999999, 142, 230, 155.5, 166.0, 170.0, 229.68999999999983, 10.690613641223006, 58.09889151699808, 6.149190854180031], "isController": false}, {"data": ["TRANSACTION CONTROLLER", 100, 0, 0.0, 2568.0299999999997, 2313, 3161, 2535.0, 2792.2000000000003, 2920.7, 3160.66, 8.145975887911373, 421.71931958190777, 68.51386215990551], "isController": true}, {"data": ["CONFIRM THE ORDER", 100, 0, 0.0, 161.00000000000006, 145, 243, 157.5, 171.9, 205.59999999999968, 242.71999999999986, 10.703200256876805, 56.64355165632024, 6.2714064005137535], "isController": false}, {"data": ["CLICK ON RANDOM PET", 100, 0, 0.0, 155.67000000000002, 140, 203, 153.5, 164.0, 176.5499999999999, 202.85999999999993, 10.66552901023891, 41.632642518131405, 6.330783049808021], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1500, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
