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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1065329, 1065329, 100.0, 0.06539106698493852, 0, 125, 0.0, 0.0, 1.0, 17774.442738921516, 36173.79061754413, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22667, 22667, 100.0, 0.05161688798694121, 0, 25, 0.0, 0.0, 1.0, 378.94543266015785, 771.2131656872742, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22669, 22669, 100.0, 0.0745070360404073, 0, 93, 0.0, 0.0, 1.0, 378.92818935544267, 771.1780728679125, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22667, 22667, 100.0, 0.056910927780474053, 0, 87, 0.0, 0.0, 1.0, 378.9390975809552, 771.2040114275624, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22669, 22669, 100.0, 0.06533150999161856, 0, 114, 0.0, 0.0, 1.0, 378.90918815919235, 771.1394024646063, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22667, 22667, 100.0, 0.05858737371509217, 0, 113, 0.0, 0.0, 1.0, 378.9390975809552, 771.2002728112409, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22666, 22666, 100.0, 0.18124062472425603, 0, 98, 1.0, 1.0, 1.0, 378.9920743738087, 771.3080888623215, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22670, 22670, 100.0, 0.06643140714600795, 0, 100, 0.0, 0.0, 1.0, 378.91956943237284, 771.1605299776024, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 22663, 22663, 100.0, 0.07893924017120452, 0, 104, 0.0, 1.0, 1.0, 379.1257507067936, 771.5801410868729, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 22668, 22668, 100.0, 0.05214399152991017, 0, 93, 0.0, 0.0, 1.0, 378.9241416201398, 771.1698350941125, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 22663, 22663, 100.0, 0.051493623968582924, 0, 28, 0.0, 0.0, 1.0, 379.1384358009201, 771.6059572354663, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 22671, 22671, 100.0, 0.0676194256980287, 0, 114, 0.0, 0.0, 1.0, 378.8982852558746, 771.1172133527759, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22667, 22667, 100.0, 0.04486698725018732, 0, 17, 0.0, 0.0, 1.0, 378.9517679511828, 771.2260589943994, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22666, 22666, 100.0, 0.0683402453013323, 0, 93, 0.0, 0.0, 1.0, 379.1125160988175, 771.553206591734, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 22664, 22664, 100.0, 0.06203671020120015, 0, 103, 0.0, 0.0, 1.0, 379.1171107877085, 771.5625575015473, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22666, 22666, 100.0, 0.05770757963469516, 0, 66, 0.0, 0.0, 1.0, 378.97940074906364, 771.2822960557116, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22666, 22666, 100.0, 0.08638489367334326, 0, 40, 0.0, 1.0, 1.0, 379.0871535849877, 771.5015899131977, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 22663, 22663, 100.0, 0.05219962052684987, 0, 24, 0.0, 0.0, 1.0, 379.15112174393124, 771.6317751116725, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22668, 22668, 100.0, 0.061672842773954344, 0, 35, 0.0, 0.0, 1.0, 378.9304759198275, 771.1827263837114, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22668, 22668, 100.0, 0.05276160225869094, 0, 28, 0.0, 0.0, 1.0, 378.9368104312939, 771.195618104313, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22666, 22666, 100.0, 0.07226683137739343, 0, 93, 0.0, 0.0, 1.0, 379.09983441770225, 771.531137756318, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22663, 22663, 100.0, 0.051846622247716495, 0, 26, 0.0, 0.0, 1.0, 379.1384358009201, 771.6059572354663, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22668, 22668, 100.0, 0.05911416975472016, 0, 93, 0.0, 0.0, 1.0, 378.9431451545496, 771.2085102559387, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22666, 22666, 100.0, 0.06710491485043626, 0, 64, 0.0, 0.0, 1.0, 379.1315402114278, 771.5919236334137, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 22666, 22666, 100.0, 0.04857495808700241, 0, 22, 0.0, 0.0, 1.0, 379.1378820065905, 771.6048301774752, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 22665, 22665, 100.0, 0.05298919038164568, 0, 53, 0.0, 0.0, 1.0, 379.1274965708742, 771.5836941930681, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22671, 22671, 100.0, 0.06735477041153869, 0, 101, 0.0, 0.0, 1.0, 378.91728368237204, 771.159615860716, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 22665, 22665, 100.0, 0.048930068387381224, 0, 21, 0.0, 0.0, 1.0, 379.12115484335015, 771.5707877866618, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22666, 22666, 100.0, 0.14576899320568193, 0, 116, 0.0, 1.0, 1.0, 379.0808134867541, 771.492427002149, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 22666, 22666, 100.0, 0.04773669813818057, 0, 17, 0.0, 0.0, 1.0, 378.97940074906364, 771.2822960557116, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22666, 22666, 100.0, 0.060398835259860575, 0, 100, 0.0, 0.0, 1.0, 378.9857374554818, 771.2951922433829, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22666, 22666, 100.0, 0.06282537721697747, 0, 125, 0.0, 0.0, 1.0, 378.9857374554818, 771.2951922433829, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22671, 22671, 100.0, 0.06439945304574148, 0, 93, 0.0, 0.0, 1.0, 378.9299503585218, 771.1816567843354, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 22666, 22666, 100.0, 0.05219271155033962, 0, 56, 0.0, 0.0, 1.0, 379.1378820065905, 771.6085709200357, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22663, 22663, 100.0, 0.07911573931077064, 0, 64, 0.0, 0.0, 1.0, 379.15112174393124, 771.6317751116725, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22667, 22667, 100.0, 0.05479331186306088, 0, 58, 0.0, 0.0, 1.0, 378.93276271356444, 771.1873803662777, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 22666, 22666, 100.0, 0.08647313156269291, 0, 66, 0.0, 1.0, 1.0, 379.11885725755195, 771.5661118405646, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 22663, 22663, 100.0, 0.06217182191236872, 0, 113, 0.0, 0.0, 1.0, 379.1257507067936, 771.5801410868729, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22663, 22663, 100.0, 0.060362705731809685, 0, 37, 0.0, 0.0, 1.0, 379.1257507067936, 771.5801410868729, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22663, 22663, 100.0, 0.06075982879583438, 0, 111, 0.0, 0.0, 1.0, 379.1447786663097, 771.618865957607, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 22667, 22667, 100.0, 0.04874928309877768, 0, 27, 0.0, 0.0, 1.0, 378.95810345404084, 771.2389527326378, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22666, 22666, 100.0, 0.0634871613870995, 0, 33, 0.0, 0.0, 1.0, 379.0744736005887, 771.4757841636981, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 22668, 22668, 100.0, 0.04623257455443766, 0, 25, 0.0, 0.0, 1.0, 378.9304759198275, 771.1827263837114, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22669, 22669, 100.0, 0.062067140147337566, 0, 80, 0.0, 0.0, 1.0, 378.9028548505716, 771.1265131919837, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 22672, 22672, 100.0, 0.063205716302046, 0, 87, 0.0, 0.0, 1.0, 378.2890894832563, 769.8811361489079, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 22666, 22666, 100.0, 0.0639724697785227, 0, 57, 0.0, 0.0, 1.0, 379.10617515220446, 771.5403017746037, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22668, 22668, 100.0, 0.059290629962943805, 0, 42, 0.0, 0.0, 1.0, 378.91780753222, 771.1569442354947, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22669, 22669, 100.0, 0.07040451718205477, 0, 59, 0.0, 0.0, 1.0, 378.92185541161723, 771.165182302549, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, 5.632062958954464E-4, 5.632062958954464E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1065323, 99.9994367937041, 99.9994367937041], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1065329, 1065329, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1065323, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22667, 22667, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22667, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22669, 22669, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22669, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22667, 22667, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22669, 22669, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22669, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22667, 22667, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22667, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 22670, 22670, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22670, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 22668, 22668, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22668, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 22671, 22671, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22671, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22667, 22667, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22667, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 22664, 22664, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22664, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22668, 22668, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22668, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22668, 22668, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22668, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22665, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22668, 22668, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22668, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 22665, 22665, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22665, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 22671, 22671, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22670, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 22665, 22665, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22665, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22665, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 22671, 22671, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22671, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22665, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22667, 22667, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22667, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 22663, 22663, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22663, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 22667, 22667, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22667, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 22668, 22668, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22668, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 22669, 22669, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22669, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 22672, 22672, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22671, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 22666, 22666, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22666, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 22668, 22668, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22668, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 22669, 22669, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 22669, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
