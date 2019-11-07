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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1057140, 1057140, 100.0, 0.06269557485290923, 0, 96, 0.0, 0.0, 1.0, 17637.81366791244, 35895.72910974832, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22492, 22492, 100.0, 0.057487106526765225, 0, 66, 0.0, 0.0, 1.0, 376.1266910817906, 765.4803258886018, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22496, 22496, 100.0, 0.060677453769559575, 0, 61, 0.0, 0.0, 1.0, 376.0740914106122, 765.3695375973788, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22493, 22493, 100.0, 0.0548615124705462, 0, 58, 0.0, 0.0, 1.0, 376.13712374581945, 765.5015579274666, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22496, 22496, 100.0, 0.058588193456614486, 0, 75, 0.0, 0.0, 1.0, 376.0615178869943, 765.3439485122033, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22493, 22493, 100.0, 0.047614813497532646, 0, 17, 0.0, 0.0, 1.0, 376.13083393254294, 765.4850174955268, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22491, 22491, 100.0, 0.15779645191409747, 0, 68, 1.0, 1.0, 1.0, 376.1602916826947, 765.5449686198592, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22496, 22496, 100.0, 0.06156650071123759, 0, 77, 0.0, 0.0, 1.0, 376.0489452041055, 765.3183611380429, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 22490, 22490, 100.0, 0.06980880391285015, 0, 24, 0.0, 1.0, 1.0, 376.31349976574523, 765.85677100763, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 22495, 22495, 100.0, 0.056279173149588184, 0, 63, 0.0, 0.0, 1.0, 376.11396278152114, 765.4506820670803, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 22490, 22490, 100.0, 0.06482881280569124, 0, 59, 0.0, 0.0, 1.0, 376.33868808567604, 765.9080331743642, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 22498, 22498, 100.0, 0.06547248644323972, 0, 38, 0.0, 0.0, 1.0, 376.0572326413265, 765.3352273676996, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22492, 22492, 100.0, 0.05072914814156145, 0, 47, 0.0, 0.0, 1.0, 376.13927120089636, 765.5021886549492, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22490, 22490, 100.0, 0.06527345486882978, 0, 30, 0.0, 0.0, 1.0, 376.263133239644, 765.7542672572442, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 22490, 22490, 100.0, 0.06216096042685594, 0, 50, 0.0, 0.0, 1.0, 376.3072032125826, 765.8439565381076, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22491, 22491, 100.0, 0.0655373260415278, 0, 72, 0.0, 0.0, 1.0, 376.1414188714587, 765.5065595001171, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22490, 22490, 100.0, 0.07910182303245888, 0, 61, 0.0, 1.0, 1.0, 376.23795503211994, 765.7030256708377, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 22489, 22489, 100.0, 0.05456000711458938, 0, 54, 0.0, 0.0, 1.0, 376.33454934904114, 765.9033525061498, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22495, 22495, 100.0, 0.05645699044232045, 0, 63, 0.0, 0.0, 1.0, 376.12654037152845, 765.4762794279934, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22495, 22495, 100.0, 0.05583462991775936, 0, 25, 0.0, 0.0, 1.0, 376.1328294819918, 765.4890787504598, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22490, 22490, 100.0, 0.06505113383726072, 0, 62, 0.0, 0.0, 1.0, 376.25683837184016, 765.7414562176903, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, 100.0, 0.056158292574477436, 0, 24, 0.0, 0.0, 1.0, 376.3197965296253, 765.8695859059953, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22495, 22495, 100.0, 0.05779062013780871, 0, 33, 0.0, 0.0, 1.0, 376.1516980753474, 765.5274792861562, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, 100.0, 0.06109381947532259, 0, 65, 0.0, 0.0, 1.0, 376.2820191068949, 765.7927029480165, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 22490, 22490, 100.0, 0.0519341929746556, 0, 26, 0.0, 0.0, 1.0, 376.2883148172935, 765.8055157023825, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 22490, 22490, 100.0, 0.05771453979546507, 0, 63, 0.0, 0.0, 1.0, 376.3009068701268, 765.8311424974066, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22497, 22497, 100.0, 0.0600080010668091, 0, 41, 0.0, 0.0, 1.0, 376.05308906124634, 765.3267945348022, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 22490, 22490, 100.0, 0.05104490884837727, 0, 46, 0.0, 0.0, 1.0, 376.29461073836734, 765.8183288855054, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22490, 22490, 100.0, 0.13775011116051503, 0, 57, 0.0, 1.0, 1.0, 376.2316610067417, 765.6902163457517, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 22491, 22491, 100.0, 0.05197634609399355, 0, 63, 0.0, 0.0, 1.0, 376.1351283552136, 765.4937573166652, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22491, 22491, 100.0, 0.053221288515405966, 0, 67, 0.0, 0.0, 1.0, 376.1477095981135, 765.5193621117857, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22491, 22491, 100.0, 0.06077986750255645, 0, 73, 0.0, 0.0, 1.0, 376.1540005351887, 765.5321651516925, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22496, 22496, 100.0, 0.06410028449502134, 0, 45, 0.0, 0.0, 1.0, 376.0426591779082, 765.3093063338933, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 22490, 22490, 100.0, 0.051978657180969334, 0, 26, 0.0, 0.0, 1.0, 376.2883148172935, 765.8055157023825, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22489, 22489, 100.0, 0.065587620614523, 0, 63, 0.0, 0.0, 1.0, 376.33454934904114, 765.8996101986345, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22494, 22494, 100.0, 0.055703743220414305, 0, 47, 0.0, 0.0, 1.0, 376.14126617838866, 765.5062487458614, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 22490, 22490, 100.0, 0.06718541574032913, 0, 22, 0.0, 1.0, 1.0, 376.2694283180807, 765.7670787254689, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 22490, 22490, 100.0, 0.052289906625166416, 0, 34, 0.0, 0.0, 1.0, 376.31349976574523, 765.85677100763, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, 100.0, 0.057581147176522636, 0, 54, 0.0, 0.0, 1.0, 376.3072032125826, 765.8439565381076, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, 100.0, 0.05389061805246741, 0, 23, 0.0, 0.0, 1.0, 376.3449856925317, 765.9208497883164, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 22491, 22491, 100.0, 0.05210973278200178, 0, 23, 0.0, 0.0, 1.0, 376.12883804936786, 765.4809555614088, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22491, 22491, 100.0, 0.06037970743853121, 0, 27, 0.0, 0.0, 1.0, 376.24209575429086, 765.7114526874435, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 22495, 22495, 100.0, 0.05254501000222262, 0, 61, 0.0, 0.0, 1.0, 376.12025147137507, 765.4634805335406, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22496, 22496, 100.0, 0.06192211948790943, 0, 48, 0.0, 0.0, 1.0, 376.0615178869943, 765.3439485122033, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 22499, 22499, 100.0, 0.06284723765500703, 0, 96, 0.0, 0.0, 1.0, 375.39000583965964, 763.9810478278551, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 22490, 22490, 100.0, 0.054424188528234774, 0, 81, 0.0, 0.0, 1.0, 376.263133239644, 765.7542672572442, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22496, 22496, 100.0, 0.06623399715504967, 0, 61, 0.0, 0.0, 1.0, 376.08037848772085, 765.3860713979722, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22496, 22496, 100.0, 0.058766002844950385, 0, 42, 0.0, 0.0, 1.0, 376.06780454370687, 765.3567428409034, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, 5.675691015381123E-4, 5.675691015381123E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1057134, 99.99943243089847, 99.99943243089847], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1057140, 1057140, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1057134, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22492, 22492, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22496, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22493, 22493, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22492, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22496, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22493, 22493, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22493, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22496, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 22495, 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 22498, 22498, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22498, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22492, 22492, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22492, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 22489, 22489, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22488, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22495, 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22495, 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22495, 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22497, 22497, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22497, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22489, 22489, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22489, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22494, 22494, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22494, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22491, 22491, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22491, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 22495, 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22496, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 22499, 22499, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22498, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 22490, 22490, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22490, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22495, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22496, 22496, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22496, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
