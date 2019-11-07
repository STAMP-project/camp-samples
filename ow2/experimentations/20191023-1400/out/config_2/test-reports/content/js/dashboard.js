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

    var data = {"OkPercent": 80.86531065997066, "KoPercent": 19.134689340029343};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8085884732967509, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [1.0, 500, 1500, "43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2"], "isController": false}, {"data": [1.0, 500, 1500, "13 \/site-forms-demo\/js\/bootstrap.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js"], "isController": false}, {"data": [1.0, 500, 1500, "40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "27 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "28 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "48 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "75 \/site-forms-demo\/js\/admin.js"], "isController": false}, {"data": [1.0, 500, 1500, "74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "76 \/site-forms-demo\/js\/app.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js"], "isController": false}, {"data": [1.0, 500, 1500, "31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}, {"data": [0.0, 500, 1500, "60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js"], "isController": false}, {"data": [1.0, 500, 1500, "82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "36 \/site-forms-demo\/js\/bootstrap-datepicker.js"], "isController": false}, {"data": [0.0, 500, 1500, "45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "11 \/site-forms-demo\/js\/jquery\/jquery.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.9969669396420989, 500, 1500, "1 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "50 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [1.0, 500, 1500, "16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 154719, 29605, 19.134689340029343, 3.470879465353362, 0, 10977, 6.0, 10.0, 24.0, 2580.6715260287224, 40037.18378224401, 1401.4898910396475], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 3293, 0, 0.0, 1.1782569085939867, 0, 36, 3.0, 4.0, 12.0, 67.57644161707367, 282.3164230838293, 32.204397958136674], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 3295, 0, 0.0, 1.646737481031862, 0, 73, 3.0, 5.0, 13.0, 67.45828641621455, 1088.8847814195415, 32.016335154570584], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 3293, 0, 0.0, 1.1187367142423343, 0, 55, 3.0, 4.0, 10.0, 67.56534941934424, 81.81741531248717, 31.671257540317615], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 3296, 0, 0.0, 1.5333737864077635, 0, 33, 3.0, 5.0, 12.0, 67.46218556194609, 1024.7795863438198, 32.6111150909798], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 3293, 0, 0.0, 1.4284846644397176, 0, 56, 3.0, 5.0, 13.0, 67.55980468589718, 714.2602007124246, 31.99854030533216], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3293, 0, 0.0, 10.889766170665077, 1, 143, 24.0, 32.0, 54.059999999999945, 67.97258803616397, 306.4076820067704, 121.58100320459894], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 3296, 0, 0.0, 1.6365291262135908, 0, 42, 3.0, 5.0, 11.029999999999745, 67.45390172523177, 713.1405664817961, 32.60711069725559], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 3288, 3288, 100.0, 5.158759124087589, 0, 63, 12.0, 18.0, 32.0, 68.65590612014783, 290.9159928274624, 50.486227840304025], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 3293, 0, 0.0, 1.813240206498633, 0, 74, 4.0, 6.0, 14.0, 67.44633786662298, 2454.0850611059623, 25.292376699983617], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 3288, 3288, 100.0, 5.274330900243306, 0, 61, 12.0, 17.0, 32.0, 68.70468270054538, 291.1226740602211, 49.649868357816], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 3296, 0, 0.0, 1.786711165048539, 0, 63, 4.0, 5.0, 14.029999999999745, 67.3491489405178, 32.75378532458775, 31.24106029955659], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 3293, 0, 0.0, 1.2225933798967508, 0, 31, 3.0, 5.0, 11.11999999999989, 67.59308674411922, 409.12299964848717, 32.14632152772076], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3291, 3291, 100.0, 10.975083561227592, 1, 319, 23.0, 31.0, 53.07999999999993, 68.16345974606988, 289.0290451342143, 37.2103261699737], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 3288, 3288, 100.0, 5.359793187347933, 0, 94, 13.0, 18.0, 34.11000000000013, 68.63584177017013, 290.83097406325015, 36.797926886546286], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 3293, 0, 0.0, 1.3741269359246906, 0, 34, 3.0, 5.0, 12.059999999999945, 67.61251642575559, 1027.063176760379, 32.023506314933066], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3291, 0, 0.0, 2.4099058037070753, 0, 31, 5.0, 7.399999999999636, 17.0, 68.1197218082464, 307.07093346373574, 41.77654814021361], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 3288, 3288, 100.0, 5.363138686131387, 0, 82, 12.0, 18.0, 32.11000000000013, 68.72909698996655, 291.2261248432274, 42.15026651337792], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3293, 0, 0.0, 1.8915882174309142, 0, 43, 4.0, 6.0, 13.059999999999945, 67.47259502100195, 304.15380724311035, 32.682038213297815], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3293, 0, 0.0, 1.9213483146067394, 0, 38, 4.0, 6.0, 16.0, 67.5030235942849, 304.29097354611235, 36.91571602812455], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3291, 0, 0.0, 2.1221513217866876, 0, 37, 5.0, 7.0, 16.0, 68.15498995588874, 307.22991566052974, 38.204066635429825], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3288, 0, 0.0, 2.248175182481744, 0, 32, 5.0, 6.0, 13.0, 68.70181157149126, 4.897687738983263, 38.7789522346894], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 3293, 0, 0.0, 1.435469177042214, 0, 43, 3.0, 5.0, 12.0, 67.51132705988479, 793.5218090749738, 31.975579710980586], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3289, 0, 0.0, 2.3408330799635166, 0, 38, 5.0, 7.0, 13.0, 68.61231642189586, 4.891307713670311, 29.68286735830065], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 3289, 0, 0.0, 1.7862572210398338, 0, 43, 4.0, 6.0, 13.0, 68.6252008262566, 682.4990675923801, 26.739702275074592], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 3288, 0, 0.0, 1.370742092457418, 0, 26, 3.0, 5.0, 11.0, 68.6444393411136, 434.6587350466607, 27.953839067621452], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 3296, 0, 0.0, 1.7715412621359217, 0, 34, 4.0, 5.0, 15.0, 67.40561986175302, 792.2793365781831, 32.58377131989038], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 3289, 0, 0.0, 1.6567345697780451, 0, 37, 4.0, 5.0, 12.0, 68.65958290712481, 645.8292017201428, 26.88719994702837], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3292, 0, 0.0, 8.714763061968407, 1, 77, 20.0, 27.0, 46.0, 68.11081455734177, 307.0307812467672, 99.38211050162415], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 3293, 0, 0.0, 1.0816884300030414, 0, 39, 3.0, 4.0, 10.0, 67.60557597158635, 47.99731809701492, 30.76581875269457], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 3293, 0, 0.0, 1.406012754327363, 0, 88, 3.0, 5.0, 12.0, 67.6319572807558, 1091.6881073179811, 31.43829264222633], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3293, 3293, 100.0, 5.0252049802611545, 0, 261, 11.0, 16.0, 30.059999999999945, 67.64724008299267, 286.84015277378336, 34.550299378325356], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 3296, 0, 0.0, 1.5260922330097073, 0, 58, 3.0, 5.0, 12.0, 67.4125130386763, 281.63157302681367, 32.784601067637496], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 3289, 0, 0.0, 3.21435086652478, 0, 52, 6.0, 9.0, 21.0, 68.61947382695958, 13700.105787649174, 27.742638832384053], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3287, 3287, 100.0, 10.488895649528459, 1, 91, 22.0, 30.0, 45.0, 68.73549277514063, 291.45459924771546, 39.267835227985614], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 3293, 0, 0.0, 1.673246279987854, 0, 54, 3.0, 6.0, 13.0, 67.5431759445379, 4083.3279785376585, 31.594903591243796], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 3289, 3289, 100.0, 6.29005776831864, 0, 58, 14.0, 20.0, 34.09999999999991, 68.5965753853213, 290.664590426669, 44.74854722401818], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 3288, 0, 0.0, 1.5991484184914855, 0, 37, 3.0, 5.0, 12.0, 68.65447256326736, 39.15450388373841, 31.51133018040591], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3288, 0, 0.0, 2.2636861313868675, 0, 27, 5.0, 6.0, 13.0, 68.64873893435777, 4.893904240437615, 32.179096375480206], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3288, 0, 0.0, 2.28923357664233, 0, 40, 5.0, 6.0, 13.0, 68.72047820089453, 4.899018465493459, 37.2459623061489], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 3293, 0, 0.0, 1.8660795627087758, 0, 48, 4.0, 6.0, 15.0, 67.59863694215215, 3112.3759139762183, 30.03650371941331], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3293, 3293, 100.0, 5.115092620710598, 0, 57, 11.0, 16.299999999999727, 31.0, 68.08220310949388, 288.6844979506078, 33.4427228164799], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 3293, 0, 0.0, 1.9744913452778574, 0, 51, 4.0, 6.0, 15.0, 67.4532456625494, 6335.005945911172, 25.558456364325362], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 3296, 0, 0.0, 1.2982402912621411, 0, 29, 3.0, 5.0, 10.029999999999745, 67.45804338927549, 81.68747441670078, 32.279727793696274], "isController": false}, {"data": ["1 \/site-forms-demo\/", 3297, 0, 0.0, 23.466181377009427, 0, 10977, 7.0, 10.099999999999909, 24.019999999999982, 55.009593726537084, 252.80776179402685, 19.71535243910069], "isController": false}, {"data": ["50 \/site-forms-demo\/", 3291, 0, 0.0, 2.1555758128228484, 0, 43, 4.0, 7.0, 16.079999999999927, 68.15922458785519, 307.249004587441, 36.20958806229807], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 3294, 0, 0.0, 1.2197935640558573, 0, 36, 3.0, 4.0, 11.0, 67.45300405455215, 408.2751163380022, 32.738420913195725], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 3296, 0, 0.0, 1.7521237864077648, 0, 62, 3.0, 5.0, 15.0, 67.47185261003071, 4079.0161207778915, 32.22044524053224], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 29605, 100.0, 19.134689340029343], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 154719, 29605, "500", 29605, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 3288, 3288, "500", 3288, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 3288, 3288, "500", 3288, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3291, 3291, "500", 3291, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 3288, 3288, "500", 3288, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 3288, 3288, "500", 3288, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3293, 3293, "500", 3293, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3287, 3287, "500", 3287, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 3289, 3289, "500", 3289, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3293, 3293, "500", 3293, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
