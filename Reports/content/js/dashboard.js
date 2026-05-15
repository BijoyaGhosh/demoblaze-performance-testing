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

    var data = {"OkPercent": 99.42857142857143, "KoPercent": 0.5714285714285714};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7366666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98, 500, 1500, "Place Order"], "isController": false}, {"data": [0.92, 500, 1500, "Homepage"], "isController": false}, {"data": [0.0, 500, 1500, "Purchase"], "isController": true}, {"data": [0.99, 500, 1500, "Add to Cart"], "isController": false}, {"data": [0.81, 500, 1500, "Product List"], "isController": false}, {"data": [0.99, 500, 1500, "View Cart"], "isController": false}, {"data": [0.42, 500, 1500, "Login"], "isController": true}, {"data": [0.98, 500, 1500, "Product Details"], "isController": false}, {"data": [0.54, 500, 1500, "Authenticate User"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 350, 2, 0.5714285714285714, 530.3771428571432, 88, 3232, 356.5, 651.2000000000006, 2471.1, 3071.78, 9.512420503342936, 17.818775437231615, 2.0381104086264066], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Place Order", 50, 0, 0.0, 372.1999999999998, 296, 790, 353.5, 447.0, 501.7, 790.0, 2.188662727073758, 0.4402973845480412, 0.4638939045743051], "isController": false}, {"data": ["Homepage", 50, 2, 4.0, 273.74, 88, 846, 249.0, 579.4999999999999, 720.9499999999995, 846.0, 2.252962645879331, 19.825587248794665, 0.3608260487541116], "isController": false}, {"data": ["Purchase", 50, 0, 0.0, 2206.8, 1592, 4705, 1848.0, 4118.599999999999, 4459.699999999999, 4705.0, 2.1732516190724565, 8.840295209066806, 2.396179695310123], "isController": true}, {"data": ["Add to Cart", 50, 0, 0.0, 377.76000000000005, 312, 981, 354.5, 448.0, 476.45, 981.0, 2.4424796052952957, 0.4698910959405989, 0.7155701968638561], "isController": false}, {"data": ["Product List", 50, 0, 0.0, 731.0800000000002, 314, 3083, 367.5, 2667.0999999999995, 2979.7, 3083.0, 2.2356360384529395, 6.39907151240778, 0.37333375251509054], "isController": false}, {"data": ["View Cart", 50, 0, 0.0, 372.3800000000001, 309, 535, 365.0, 446.0, 473.6999999999998, 535.0, 2.3213705371651425, 0.6469913586981754, 0.5486051464784809], "isController": false}, {"data": ["Login", 50, 2, 4.0, 1505.88, 410, 3512, 896.0, 3304.5, 3443.2999999999997, 3512.0, 2.192886276917679, 19.834013927568968, 0.8710726777334328], "isController": true}, {"data": ["Product Details", 50, 0, 0.0, 353.3799999999998, 292, 549, 333.0, 446.59999999999997, 499.44999999999976, 549.0, 2.557544757033248, 1.3636908567774935, 0.49702285805626595], "isController": false}, {"data": ["Authenticate User", 50, 0, 0.0, 1232.1, 315, 3232, 562.5, 2994.7, 3105.5499999999997, 3232.0, 2.2897966660560543, 0.5608212928191977, 0.542842811183367], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 846 milliseconds, but should not have lasted longer than 700 milliseconds.", 1, 50.0, 0.2857142857142857], "isController": false}, {"data": ["The operation lasted too long: It took 782 milliseconds, but should not have lasted longer than 700 milliseconds.", 1, 50.0, 0.2857142857142857], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 350, 2, "The operation lasted too long: It took 846 milliseconds, but should not have lasted longer than 700 milliseconds.", 1, "The operation lasted too long: It took 782 milliseconds, but should not have lasted longer than 700 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Homepage", 50, 2, "The operation lasted too long: It took 846 milliseconds, but should not have lasted longer than 700 milliseconds.", 1, "The operation lasted too long: It took 782 milliseconds, but should not have lasted longer than 700 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
