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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1128992, 1128992, 100.0, 0.061994239108863675, 0, 133, 0.0, 0.0, 1.0, 18829.714133226593, 38321.43278289594, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 24021, 24021, 100.0, 0.05328670746430199, 0, 31, 0.0, 0.0, 1.0, 401.7830261265179, 817.6912367652963, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 24025, 24025, 100.0, 0.058522372528615745, 0, 51, 0.0, 0.0, 1.0, 401.7356988779827, 817.5949184196445, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 24022, 24022, 100.0, 0.06152693364415938, 0, 65, 0.0, 0.0, 1.0, 401.79303193001823, 817.7116001388262, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 24025, 24025, 100.0, 0.062101977107180524, 0, 48, 0.0, 0.0, 1.0, 401.6551032349745, 817.434632434381, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 24022, 24022, 100.0, 0.05241029056698021, 0, 83, 0.0, 0.0, 1.0, 401.7863116344417, 817.6979232872818, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 24021, 24021, 100.0, 0.16685400274759699, 0, 121, 1.0, 1.0, 1.0, 401.8166307020625, 817.7596273272444, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 24025, 24025, 100.0, 0.05806451612903225, 0, 112, 0.0, 0.0, 1.0, 401.6483883910659, 817.4172279365052, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 24016, 24016, 100.0, 0.07449200532978013, 0, 133, 0.0, 0.0, 1.0, 401.995246225436, 818.123137825985, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 24025, 24025, 100.0, 0.05356919875130064, 0, 65, 0.0, 0.0, 1.0, 401.7491346298557, 817.6222622740422, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 24016, 24016, 100.0, 0.061167554963357344, 0, 82, 0.0, 0.0, 1.0, 402.00197519291606, 818.1368323262082, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 24025, 24025, 100.0, 0.06043704474505758, 0, 50, 0.0, 0.0, 1.0, 401.60139076943653, 817.321580433111, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 24021, 24021, 100.0, 0.04687565047250301, 0, 28, 0.0, 0.0, 1.0, 401.7830261265179, 817.6912367652963, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 24021, 24021, 100.0, 0.06386078847674989, 0, 33, 0.0, 0.0, 1.0, 401.9780109443245, 818.0880613359104, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 24017, 24017, 100.0, 0.05571053836865526, 0, 28, 0.0, 0.0, 1.0, 401.99179847686, 818.1161211189221, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 24021, 24021, 100.0, 0.057408101244743624, 0, 81, 0.0, 0.0, 1.0, 401.796467282216, 817.722332297312, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 24021, 24021, 100.0, 0.07297781108196984, 0, 28, 0.0, 1.0, 1.0, 401.9174781648429, 817.9648676714186, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 24016, 24016, 100.0, 0.050591272485009796, 0, 27, 0.0, 0.0, 1.0, 402.0154338037128, 818.1642227020875, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 24025, 24025, 100.0, 0.059021852237252787, 0, 51, 0.0, 0.0, 1.0, 401.75585284280936, 817.6396745662626, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 24024, 24024, 100.0, 0.058732933732933784, 0, 59, 0.0, 0.0, 1.0, 401.7458485927858, 817.6155746751618, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 24021, 24021, 100.0, 0.05840722700969979, 0, 29, 0.0, 0.0, 1.0, 401.9780109443245, 818.0880613359104, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24016, 24016, 100.0, 0.05929380413057936, 0, 107, 0.0, 0.0, 1.0, 401.995246225436, 818.123137825985, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 24023, 24023, 100.0, 0.05781958956000481, 0, 112, 0.0, 0.0, 1.0, 401.7895969225623, 817.7083496665413, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24021, 24021, 100.0, 0.0573248407643312, 0, 70, 0.0, 0.0, 1.0, 402.02510460251045, 818.1839042887029, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 24018, 24018, 100.0, 0.04575734865517516, 0, 18, 0.0, 0.0, 1.0, 401.9816231233996, 818.0954126847311, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 24017, 24017, 100.0, 0.049090227755340145, 0, 54, 0.0, 0.0, 1.0, 401.9716141126063, 818.0750427838589, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 24025, 24025, 100.0, 0.057398543184183325, 0, 62, 0.0, 0.0, 1.0, 401.621531260448, 817.3625694792711, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 24017, 24017, 100.0, 0.057001290752383686, 0, 124, 0.0, 0.0, 1.0, 401.9648864416141, 818.0613509221911, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 24021, 24021, 100.0, 0.14245868198659437, 0, 113, 0.0, 1.0, 1.0, 401.91075342580353, 817.9511817767329, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 24021, 24021, 100.0, 0.04941509512509892, 0, 95, 0.0, 0.0, 1.0, 401.796467282216, 817.7185916173224, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 24021, 24021, 100.0, 0.05307855626326944, 0, 48, 0.0, 0.0, 1.0, 401.80990933725866, 817.7459482996554, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 24021, 24021, 100.0, 0.06681653553141041, 0, 121, 0.0, 0.0, 1.0, 401.8166307020625, 817.7596273272444, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 24025, 24025, 100.0, 0.05419354838709704, 0, 17, 0.0, 0.0, 1.0, 401.63495937677624, 817.3898977941423, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 24019, 24019, 100.0, 0.05737124776218843, 0, 61, 0.0, 0.0, 1.0, 401.998359805185, 818.129474447271, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 24016, 24016, 100.0, 0.06262491672218438, 0, 96, 0.0, 0.0, 1.0, 402.0154338037128, 818.1642227020875, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 24022, 24022, 100.0, 0.055449171592706764, 0, 112, 0.0, 0.0, 1.0, 401.7795915636656, 817.6842468932413, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 24021, 24021, 100.0, 0.06798218225719165, 0, 51, 0.0, 0.0, 1.0, 401.98473793426604, 818.1017518115335, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 24017, 24017, 100.0, 0.0606653620352252, 0, 121, 0.0, 0.0, 1.0, 402.00525584587314, 818.1435089675778, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24017, 24017, 100.0, 0.057126202273389645, 0, 49, 0.0, 0.0, 1.0, 401.99852704874127, 818.12981481404, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24016, 24016, 100.0, 0.05425549633577594, 0, 70, 0.0, 0.0, 1.0, 402.00870438567125, 818.1505272849012, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 24021, 24021, 100.0, 0.05336996794471519, 0, 95, 0.0, 0.0, 1.0, 401.7897465919545, 817.7049139625325, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 24021, 24021, 100.0, 0.06028058781899167, 0, 62, 0.0, 0.0, 1.0, 401.8973046227978, 817.9238113612408, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 24025, 24025, 100.0, 0.05198751300728424, 0, 34, 0.0, 0.0, 1.0, 401.7491346298557, 817.6222622740422, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 24025, 24025, 100.0, 0.05873048907388151, 0, 112, 0.0, 0.0, 1.0, 401.6483883910659, 817.4172279365052, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 24025, 24025, 100.0, 0.06713839750260168, 0, 119, 0.0, 0.0, 1.0, 400.71052104876907, 815.5122513019965, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 24021, 24021, 100.0, 0.055409849714833086, 0, 82, 0.0, 0.0, 1.0, 401.9780109443245, 818.0918037060512, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 24025, 24025, 100.0, 0.06131113423517204, 0, 30, 0.0, 0.0, 1.0, 401.7424166415839, 817.6085901182234, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 24025, 24025, 100.0, 0.054360041623308944, 0, 51, 0.0, 0.0, 1.0, 401.69539701382735, 817.5128978289221, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, 5.314475213287605E-4, 5.314475213287605E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1128986, 99.99946855247867, 99.99946855247867], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1128992, 1128992, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1128986, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 24022, 24022, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24022, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24024, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 24022, 24022, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24022, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 24016, 24016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24016, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 24016, 24016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24016, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 24017, 24017, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24017, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24020, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 24016, 24016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24016, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24024, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 24024, 24024, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24024, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24016, 24016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24016, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 24023, 24023, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24022, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 24018, 24018, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24018, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 24017, 24017, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24017, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 24017, 24017, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24017, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 24019, 24019, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24019, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 24016, 24016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24016, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 24022, 24022, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24022, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 24017, 24017, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24017, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24017, 24017, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24017, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 24016, 24016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24016, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24021, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24024, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 24021, 24021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24020, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 24025, 24025, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 24025, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
