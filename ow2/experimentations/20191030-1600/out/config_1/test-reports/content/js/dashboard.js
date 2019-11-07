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
    cell.colSpan = 6;
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

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [0.0, 500, 1500, "17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [0.0, 500, 1500, "38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2"], "isController": false}, {"data": [0.0, 500, 1500, "13 \/site-forms-demo\/js\/bootstrap.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js"], "isController": false}, {"data": [0.0, 500, 1500, "40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [0.0, 500, 1500, "47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "27 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "28 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "48 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [0.0, 500, 1500, "41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [0.0, 500, 1500, "77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [0.0, 500, 1500, "75 \/site-forms-demo\/js\/admin.js"], "isController": false}, {"data": [0.0, 500, 1500, "74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [0.0, 500, 1500, "76 \/site-forms-demo\/js\/app.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js"], "isController": false}, {"data": [0.0, 500, 1500, "31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [0.0, 500, 1500, "73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}, {"data": [0.0, 500, 1500, "60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js"], "isController": false}, {"data": [0.0, 500, 1500, "82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [0.0, 500, 1500, "101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [0.0, 500, 1500, "36 \/site-forms-demo\/js\/bootstrap-datepicker.js"], "isController": false}, {"data": [0.0, 500, 1500, "45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "11 \/site-forms-demo\/js\/jquery\/jquery.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "1 \/site-forms-demo\/"], "isController": false}, {"data": [0.0, 500, 1500, "50 \/site-forms-demo\/"], "isController": false}, {"data": [0.0, 500, 1500, "18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1003088, 1003088, 100.0, 0.0717643915588682, 0, 224, 0.0, 0.0, 1.0, 16746.88214768686, 34082.54427261591, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 21343, 21343, 100.0, 0.06395539521154463, 0, 214, 0.0, 0.0, 1.0, 357.39044525192986, 727.3453983447479, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 21346, 21346, 100.0, 0.06567975264686614, 0, 35, 0.0, 0.0, 1.0, 357.3329762123977, 727.2284398697624, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 21344, 21344, 100.0, 0.059314092953523447, 0, 95, 0.0, 0.0, 1.0, 357.3533351192071, 727.2698734261987, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 21346, 21346, 100.0, 0.08306005809050862, 0, 117, 0.0, 0.0, 1.0, 357.3210130735365, 727.2040930129397, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 21344, 21344, 100.0, 0.05912668665667151, 0, 87, 0.0, 0.0, 1.0, 357.3473522074704, 727.2614413904887, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 21341, 21341, 100.0, 0.17529637786420452, 0, 96, 1.0, 1.0, 1.0, 357.3988478027867, 727.3624988486401, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 21347, 21347, 100.0, 0.06281913149388711, 0, 99, 0.0, 0.0, 1.0, 357.3257896586934, 727.2138141100752, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 21340, 21340, 100.0, 0.07863167760074984, 0, 30, 0.0, 1.0, 1.0, 357.66961651917404, 727.9135554941003, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 21345, 21345, 100.0, 0.059920356055282446, 0, 103, 0.0, 0.0, 1.0, 357.3281995480037, 727.2187186113669, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 21339, 21339, 100.0, 0.06532639767561799, 0, 31, 0.0, 0.0, 1.0, 357.6708402473978, 727.9160459722432, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 21347, 21347, 100.0, 0.06394341125216672, 0, 28, 0.0, 0.0, 1.0, 357.3018662649594, 727.1651262657963, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 21342, 21342, 100.0, 0.06105332208790156, 0, 96, 0.0, 0.0, 1.0, 357.379684517231, 727.3234985682708, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 21340, 21340, 100.0, 0.08111527647610095, 0, 211, 0.0, 0.0, 1.0, 357.6036866359447, 727.7793778801844, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 21340, 21340, 100.0, 0.08172446110590506, 0, 224, 0.0, 0.0, 1.0, 357.6456392035932, 727.8647579104378, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 21342, 21342, 100.0, 0.0725798894199231, 0, 212, 0.0, 0.0, 1.0, 357.3916538281198, 727.3478579861344, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 21340, 21340, 100.0, 0.10590440487347691, 0, 217, 0.0, 1.0, 1.0, 357.5617439093864, 727.6940178780872, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 21338, 21338, 100.0, 0.06500140594245045, 0, 55, 0.0, 0.0, 1.0, 357.6660688244858, 727.9063353810825, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 21344, 21344, 100.0, 0.06062593703148423, 0, 32, 0.0, 0.0, 1.0, 357.323422563742, 727.2089967019906, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 21344, 21344, 100.0, 0.07285419790104974, 0, 97, 0.0, 0.0, 1.0, 357.3294046742115, 727.2249151679586, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 21340, 21340, 100.0, 0.09273664479850016, 0, 221, 0.0, 0.0, 1.0, 357.5857099768759, 727.7427925701264, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21339, 21339, 100.0, 0.05600074980083421, 0, 14, 0.0, 0.0, 1.0, 357.6588505438882, 727.8916450522099, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 21344, 21344, 100.0, 0.06568590704647692, 0, 116, 0.0, 0.0, 1.0, 357.3294046742115, 727.2211712315008, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21340, 21340, 100.0, 0.06316776007497651, 0, 31, 0.0, 0.0, 1.0, 357.6156720795, 727.8037701305448, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 21340, 21340, 100.0, 0.05763823805060926, 0, 103, 0.0, 0.0, 1.0, 357.63365175129877, 727.8403615719792, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 21340, 21340, 100.0, 0.06054358013120896, 0, 103, 0.0, 0.0, 1.0, 357.6456392035932, 727.8685058626484, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 21347, 21347, 100.0, 0.08080760762636495, 0, 206, 0.0, 0.0, 1.0, 357.3078468130691, 727.1772976156601, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 21340, 21340, 100.0, 0.062136832239925034, 0, 113, 0.0, 0.0, 1.0, 357.63964537699644, 727.8525595367779, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 21341, 21341, 100.0, 0.1442294175530675, 0, 107, 1.0, 1.0, 1.0, 357.56651698947786, 727.7037318418672, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 21342, 21342, 100.0, 0.05383750351419738, 0, 27, 0.0, 0.0, 1.0, 357.3916538281198, 727.3478579861344, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 21342, 21342, 100.0, 0.05800768437822138, 0, 25, 0.0, 0.0, 1.0, 357.3976387842251, 727.360038306958, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 21341, 21341, 100.0, 0.07145869453165299, 0, 105, 0.0, 0.0, 1.0, 357.3868774491744, 727.3381373086713, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 21347, 21347, 100.0, 0.05640136787370603, 0, 18, 0.0, 0.0, 1.0, 357.319808509926, 727.2016415377791, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 21340, 21340, 100.0, 0.06415182755388901, 0, 98, 0.0, 0.0, 1.0, 357.62765832649023, 727.8281640160212, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 21338, 21338, 100.0, 0.07695191676820677, 0, 36, 0.0, 1.0, 1.0, 357.6720640986959, 727.9185367008615, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 21344, 21344, 100.0, 0.05678410794602735, 0, 21, 0.0, 0.0, 1.0, 357.3353869849827, 727.2333461686561, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 21340, 21340, 100.0, 0.08420805998125606, 0, 23, 0.0, 1.0, 1.0, 357.6036866359447, 727.7793778801844, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 21340, 21340, 100.0, 0.061480787253982906, 0, 88, 0.0, 0.0, 1.0, 357.66362188887956, 727.9013554847901, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21340, 21340, 100.0, 0.07380506091846326, 0, 223, 0.0, 0.0, 1.0, 357.6576274595247, 727.8891558844233, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21339, 21339, 100.0, 0.07010637799334529, 0, 113, 0.0, 0.0, 1.0, 357.6768354006034, 727.9282470457593, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 21342, 21342, 100.0, 0.05988192296879384, 0, 97, 0.0, 0.0, 1.0, 357.3856690724584, 727.3356780732455, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 21341, 21341, 100.0, 0.0676163253830652, 0, 105, 0.0, 0.0, 1.0, 357.55453540193685, 727.6793474390979, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 21344, 21344, 100.0, 0.0612350074962519, 0, 95, 0.0, 0.0, 1.0, 357.3174406535641, 727.2005663912093, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 21346, 21346, 100.0, 0.06717886255036078, 0, 40, 0.0, 0.0, 1.0, 357.31503180448607, 727.1919201958486, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 21348, 21348, 100.0, 0.05771032415214515, 0, 130, 0.0, 0.0, 1.0, 356.4296924566734, 725.393850098716, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 21340, 21340, 100.0, 0.06565135895032846, 0, 212, 0.0, 0.0, 1.0, 357.59769421542995, 727.7671823681212, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 21345, 21345, 100.0, 0.07210119465917138, 0, 117, 0.0, 0.0, 1.0, 357.32221775813576, 727.2065447343311, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 21346, 21346, 100.0, 0.0735032324557293, 0, 207, 0.0, 0.0, 1.0, 357.3329762123977, 727.232183492852, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, 5.981529038329638E-4, 5.981529038329638E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1003082, 99.99940184709617, 99.99940184709617], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1003088, 1003088, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1003082, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 21343, 21343, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21343, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 21346, 21346, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21346, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21344, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 21346, 21346, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21346, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21343, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 21341, 21341, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21341, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 21347, 21347, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21347, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 21345, 21345, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21345, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 21339, 21339, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21339, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 21347, 21347, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21347, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 21342, 21342, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21342, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 21342, 21342, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21342, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 21338, 21338, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21338, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21344, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21343, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21339, 21339, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21339, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21344, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21339, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 21347, 21347, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21347, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 21341, 21341, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21341, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 21342, 21342, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21342, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 21342, 21342, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21342, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 21341, 21341, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21341, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 21347, 21347, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21347, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 21338, 21338, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21338, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21344, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 21339, 21339, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21339, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 21342, 21342, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21342, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 21341, 21341, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21341, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 21344, 21344, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21343, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 21346, 21346, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21346, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 21348, 21348, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21347, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 21340, 21340, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21340, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 21345, 21345, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21345, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 21346, 21346, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 21345, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
