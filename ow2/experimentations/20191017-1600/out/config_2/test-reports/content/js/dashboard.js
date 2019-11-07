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

    var data = {"OkPercent": 80.86928575254578, "KoPercent": 19.13071424745422};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8086333418639114, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [1.0, 500, 1500, "43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2"], "isController": false}, {"data": [1.0, 500, 1500, "13 \/site-forms-demo\/js\/bootstrap.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js"], "isController": false}, {"data": [1.0, 500, 1500, "40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "27 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "28 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "48 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "75 \/site-forms-demo\/js\/admin.js"], "isController": false}, {"data": [1.0, 500, 1500, "74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "76 \/site-forms-demo\/js\/app.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js"], "isController": false}, {"data": [1.0, 500, 1500, "31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}, {"data": [0.0, 500, 1500, "60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js"], "isController": false}, {"data": [1.0, 500, 1500, "82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "36 \/site-forms-demo\/js\/bootstrap-datepicker.js"], "isController": false}, {"data": [0.0, 500, 1500, "45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "11 \/site-forms-demo\/js\/jquery\/jquery.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.9972059234423023, 500, 1500, "1 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "50 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [1.0, 500, 1500, "16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 168023, 32144, 19.13071424745422, 3.1965504722567104, 0, 11033, 5.0, 10.0, 24.0, 2806.792175467317, 43550.82397450742, 1524.269771446887], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 3578, 0, 0.0, 1.0067076579094434, 0, 31, 2.0, 4.0, 9.0, 73.57598190417437, 307.3809087754472, 35.0635538762081], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 3579, 0, 0.0, 1.468846046381673, 0, 38, 3.0, 5.0, 15.0, 73.43044727123512, 1185.2850224084427, 34.85077868537136], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 3578, 0, 0.0, 1.0346562325321462, 0, 62, 2.0, 4.0, 11.0, 73.55329427484838, 89.06844228594922, 34.47810669133518], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 3579, 0, 0.0, 1.3333333333333366, 0, 70, 3.0, 4.0, 11.0, 73.40032813781788, 1114.9825236169504, 35.48160393380845], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 3578, 0, 0.0, 1.321408608160985, 0, 72, 3.0, 4.0, 14.0, 73.54573484069887, 777.5450443216855, 34.83367323997945], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3575, 0, 0.0, 9.909370629370652, 1, 130, 22.0, 31.0, 58.23999999999978, 73.94307934144122, 333.3215373438405, 132.29194136779185], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 3579, 0, 0.0, 1.4582285554624201, 0, 78, 3.0, 5.0, 12.0, 73.39129721527293, 775.9122887231883, 35.47723839996104], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 3570, 3570, 100.0, 5.114005602240889, 0, 86, 12.0, 18.0, 32.0, 74.70494684858123, 316.5476214609316, 54.93439939158367], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 3579, 0, 0.0, 1.6149762503492562, 0, 46, 3.0, 5.0, 14.0, 73.44400894707681, 2672.31477476478, 27.541503355153804], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 3570, 3570, 100.0, 5.025770308123261, 0, 68, 12.0, 17.0, 31.0, 74.73778968744112, 316.6867865759834, 54.00973082881487], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 3579, 0, 0.0, 1.6557697680916492, 0, 69, 3.0, 5.0, 12.0, 73.32213390149964, 35.65861590131525, 34.01173203438704], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 3578, 0, 0.0, 1.0477920626048043, 0, 40, 2.0, 4.0, 10.210000000000036, 73.59111476758535, 445.42747004833404, 34.99889930841218], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3573, 3573, 100.0, 10.216344808284347, 1, 339, 22.0, 30.0, 49.0, 74.14709056196564, 314.40104220708474, 40.476780882948034], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 3571, 3571, 100.0, 5.150098011761418, 0, 83, 12.0, 19.0, 34.279999999999745, 74.68523863303635, 316.464111746821, 40.041207040563435], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 3576, 0, 0.0, 1.2796420581655474, 0, 62, 3.0, 4.0, 13.0, 73.56359671679249, 1117.4626434860422, 34.8421332105902], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3573, 0, 0.0, 2.2739994402462895, 0, 70, 5.0, 7.0, 16.0, 74.12094181101546, 334.1233080074681, 45.456983845036824], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 3569, 3569, 100.0, 4.996357523115729, 0, 124, 12.0, 18.0, 31.0, 74.75128285684366, 316.743961245942, 45.84356018954865], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3578, 0, 0.0, 1.7892677473448877, 0, 72, 4.0, 6.0, 15.0, 73.43855832187353, 331.04725118532053, 35.57180168715749], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3578, 0, 0.0, 1.7518166573504765, 0, 35, 4.0, 6.0, 15.0, 73.4868245394237, 331.26482624412085, 40.18810716999733], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3573, 0, 0.0, 1.992723201791213, 0, 42, 4.0, 6.0, 16.0, 74.13016867569866, 334.1649009834229, 41.553434394385775], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3570, 0, 0.0, 2.1456582633053256, 0, 71, 4.0, 6.0, 13.0, 74.72996734488822, 5.327429312672695, 42.18156359897011], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 3578, 0, 0.0, 1.295136948015651, 0, 43, 3.0, 5.0, 11.0, 73.49739123289922, 863.8814461710693, 34.8107761210509], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3571, 0, 0.0, 2.183141977037245, 0, 64, 4.0, 6.0, 14.0, 74.60410312121338, 5.318456570164626, 32.275017268259305], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 3571, 0, 0.0, 1.604032483898074, 0, 37, 4.0, 5.0, 12.0, 74.62748949865207, 742.1937041545632, 29.078484677697436], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 3571, 0, 0.0, 1.2436292355082632, 0, 74, 3.0, 4.0, 10.0, 74.6727447618251, 472.83015335515034, 30.408725161797914], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 3579, 0, 0.0, 1.5794914780665013, 0, 91, 3.0, 5.0, 11.199999999999818, 73.37173783800407, 862.4045279474774, 35.467783427550785], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 3571, 0, 0.0, 1.5508260991318958, 0, 74, 3.0, 5.0, 15.0, 74.66649939363526, 702.3317599213817, 29.23951782895287], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3573, 0, 0.0, 7.7212426532325775, 1, 93, 17.0, 24.299999999999727, 44.0, 74.1009581484093, 334.0332254033763, 108.16601327564395], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 3577, 0, 0.0, 1.0243220575901621, 0, 43, 2.0, 4.0, 11.0, 73.57508690375793, 52.235437674835964, 33.48241259487422], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 3576, 0, 0.0, 1.3294183445190162, 0, 52, 3.0, 4.0, 12.0, 73.57419142457411, 1187.6052832585794, 34.20050304501687], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3576, 3576, 100.0, 4.802013422818797, 0, 270, 10.0, 16.0, 32.23000000000002, 73.58176094158316, 312.00391211753333, 37.58130954340625], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 3579, 0, 0.0, 1.3570829840737633, 0, 64, 3.0, 4.0, 12.0, 73.38377314387648, 306.5779116303746, 35.6885927984868], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 3571, 0, 0.0, 2.761691402968355, 0, 46, 5.0, 8.0, 19.0, 74.61813318845728, 14897.758046595849, 30.167878066427065], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3569, 3569, 100.0, 9.716447184085212, 1, 113, 21.0, 28.0, 48.0, 74.75754592488637, 316.98951602134434, 42.70816832622903], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 3578, 0, 0.0, 1.439351593068753, 0, 39, 3.0, 5.0, 13.210000000000036, 73.53968841205246, 4445.847608238788, 34.39991284118469], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 3572, 3572, 100.0, 5.833426651735735, 0, 96, 13.0, 18.0, 33.26999999999998, 74.6047327638422, 316.12298384991334, 48.66793113891268], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 3570, 0, 0.0, 1.5084033613445365, 0, 36, 3.0, 5.0, 13.0, 74.70182046453233, 42.603381983678595, 34.28696837727558], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3570, 0, 0.0, 2.1168067226890708, 0, 65, 4.0, 6.0, 13.289999999999964, 74.69556848139933, 5.324977049943508, 35.01354772565594], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3569, 0, 0.0, 2.160829363967494, 0, 66, 4.0, 6.0, 13.0, 74.73875986848994, 5.328056123437271, 40.507823952160074], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 3577, 0, 0.0, 1.7374895163544872, 0, 72, 3.0, 5.0, 14.2199999999998, 73.57206030564183, 3387.4042258106397, 32.6907103897139], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3574, 3574, 100.0, 4.494963626189144, 0, 62, 10.0, 15.0, 29.25, 74.1109383100052, 314.24774818558836, 36.40410348626231], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 3579, 0, 0.0, 1.7102542609667506, 0, 68, 4.0, 6.0, 13.0, 73.45606797610985, 6898.772962236778, 27.83296325657287], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 3579, 0, 0.0, 1.1634534786253126, 0, 72, 3.0, 4.0, 10.0, 73.39430727585925, 88.8759189668608, 35.12032281754983], "isController": false}, {"data": ["1 \/site-forms-demo\/", 3579, 0, 0.0, 21.724224643755235, 0, 11033, 6.0, 8.0, 20.199999999999818, 59.800497919764744, 274.8253351664188, 21.432405016165685], "isController": false}, {"data": ["50 \/site-forms-demo\/", 3573, 0, 0.0, 2.0282675622725974, 0, 66, 4.0, 6.0, 17.0, 74.13632119514473, 334.19263538748834, 39.38492063492063], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 3579, 0, 0.0, 1.1229393685386952, 0, 32, 3.0, 4.0, 11.0, 73.4379809172053, 444.50059152816254, 35.64323878501077], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 3579, 0, 0.0, 1.4721989382509097, 0, 37, 3.0, 5.0, 11.0, 73.41086702356777, 4438.059701133777, 35.05655661574672], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 32144, 100.0, 19.13071424745422], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 168023, 32144, "500", 32144, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 3570, 3570, "500", 3570, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 3570, 3570, "500", 3570, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3573, 3573, "500", 3573, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 3571, 3571, "500", 3571, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 3569, 3569, "500", 3569, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3576, 3576, "500", 3576, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3569, 3569, "500", 3569, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 3572, 3572, "500", 3572, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3574, 3574, "500", 3574, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
