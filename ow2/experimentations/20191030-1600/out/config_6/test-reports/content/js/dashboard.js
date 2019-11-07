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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1092415, 1092415, 100.0, 0.06683998297350298, 0, 209, 0.0, 0.0, 1.0, 18218.15119323583, 37076.8066414393, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 23245, 23245, 100.0, 0.05880834588083463, 0, 202, 0.0, 0.0, 1.0, 388.3811465138427, 790.4163177098127, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 23246, 23246, 100.0, 0.07080788092575008, 0, 107, 0.0, 0.0, 1.0, 388.34594630715515, 790.3484157822967, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 23245, 23245, 100.0, 0.06706818670681833, 0, 202, 0.0, 0.0, 1.0, 388.37465748847154, 790.4031115292722, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 23246, 23246, 100.0, 0.06340875849608545, 0, 85, 0.0, 0.0, 1.0, 388.32648424710163, 790.3050714560155, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 23245, 23245, 100.0, 0.060486126048612886, 0, 197, 0.0, 0.0, 1.0, 388.3681686799325, 790.3899057900188, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 23244, 23244, 100.0, 0.16266563414214547, 0, 33, 1.0, 1.0, 1.0, 388.3968853390369, 790.4483486782743, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 23246, 23246, 100.0, 0.07812096704809411, 0, 194, 0.0, 0.0, 1.0, 388.307024137643, 790.265467092625, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 23238, 23238, 100.0, 0.07177898270074858, 0, 22, 0.0, 1.0, 1.0, 388.5238501279029, 790.7067418618649, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 23246, 23246, 100.0, 0.06142992342768653, 0, 123, 0.0, 0.0, 1.0, 388.35243409402256, 790.3578834491631, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 23237, 23237, 100.0, 0.07268580281447691, 0, 194, 0.0, 0.0, 1.0, 388.51362648386555, 790.6896742026835, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 23246, 23246, 100.0, 0.05781639852017549, 0, 35, 0.0, 0.0, 1.0, 388.2681097693374, 790.1862702727531, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 23245, 23245, 100.0, 0.0567003656700366, 0, 97, 0.0, 0.0, 1.0, 388.3876357560568, 790.4295243316625, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 23243, 23243, 100.0, 0.0686658348750169, 0, 28, 0.0, 0.0, 1.0, 388.50351847827903, 790.66536377806, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 23239, 23239, 100.0, 0.057274409397994885, 0, 28, 0.0, 0.0, 1.0, 388.52108202093154, 790.7011083316614, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 23244, 23244, 100.0, 0.0541645155739116, 0, 90, 0.0, 0.0, 1.0, 388.3903955085468, 790.4351408591909, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 23244, 23244, 100.0, 0.08402168301497194, 0, 209, 0.0, 1.0, 1.0, 388.500752131038, 790.6597338291828, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 23237, 23237, 100.0, 0.057365408615569734, 0, 89, 0.0, 0.0, 1.0, 388.5201223896069, 790.6991553319734, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 23245, 23245, 100.0, 0.05687244568724486, 0, 119, 0.0, 0.0, 1.0, 388.3487035551991, 790.3502912197607, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 23245, 23245, 100.0, 0.056915465691545805, 0, 114, 0.0, 0.0, 1.0, 388.3551917133072, 790.3634956352853, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 23244, 23244, 100.0, 0.05881087592496935, 0, 28, 0.0, 0.0, 1.0, 388.51373938624056, 790.6861649227786, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23237, 23237, 100.0, 0.08809226664371458, 0, 194, 0.0, 0.0, 1.0, 388.51362648386555, 790.6859351488046, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 23245, 23245, 100.0, 0.06758442675844274, 0, 202, 0.0, 0.0, 1.0, 388.36168008821465, 790.3767004920306, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23240, 23240, 100.0, 0.05425989672977619, 0, 39, 0.0, 0.0, 1.0, 388.5183141916178, 790.6954753665347, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 23240, 23240, 100.0, 0.05430292598967294, 0, 24, 0.0, 0.0, 1.0, 388.52480941554103, 790.7086941620971, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 23239, 23239, 100.0, 0.05680106717156503, 0, 129, 0.0, 0.0, 1.0, 388.5145866421466, 790.6878892209312, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 23246, 23246, 100.0, 0.07437838767960078, 0, 113, 0.0, 0.0, 1.0, 388.2940518148563, 790.2390663888286, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 23239, 23239, 100.0, 0.04707603597400942, 0, 29, 0.0, 0.0, 1.0, 388.5145866421466, 790.6878892209312, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 23244, 23244, 100.0, 0.14399414902770633, 0, 49, 0.0, 1.0, 1.0, 388.48776574408345, 790.6333045026073, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 23244, 23244, 100.0, 0.048141455859576805, 0, 16, 0.0, 0.0, 1.0, 388.38390589493383, 790.4219334814865, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 23244, 23244, 100.0, 0.06066081569437223, 0, 115, 0.0, 0.0, 1.0, 388.38390589493383, 790.4219334814865, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 23244, 23244, 100.0, 0.06448976079848548, 0, 119, 0.0, 0.0, 1.0, 388.3903955085468, 790.4351408591909, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 23246, 23246, 100.0, 0.057257162522584296, 0, 41, 0.0, 0.0, 1.0, 388.30053786790495, 790.2522665202285, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 23240, 23240, 100.0, 0.062005163511187546, 0, 107, 0.0, 0.0, 1.0, 388.5183141916178, 790.6954753665347, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 23237, 23237, 100.0, 0.08258381030253424, 0, 128, 0.0, 0.0, 1.0, 388.5266185125736, 790.7123759572298, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 23245, 23245, 100.0, 0.05416218541621849, 0, 32, 0.0, 0.0, 1.0, 388.3681686799325, 790.3899057900188, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 23241, 23241, 100.0, 0.07620154038122291, 0, 25, 0.0, 1.0, 1.0, 388.47658208805535, 790.6105440151439, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 23238, 23238, 100.0, 0.049617006627076486, 0, 24, 0.0, 0.0, 1.0, 388.5173543770481, 790.6935219939143, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23238, 23238, 100.0, 0.07306997159824452, 0, 202, 0.0, 0.0, 1.0, 388.5108588433953, 790.6803025680035, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23237, 23237, 100.0, 0.05357834488100907, 0, 26, 0.0, 0.0, 1.0, 388.51362648386555, 790.6859351488046, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 23244, 23244, 100.0, 0.0581225262433319, 0, 142, 0.0, 0.0, 1.0, 388.3774164981871, 790.4087265451386, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 23244, 23244, 100.0, 0.07133023575976592, 0, 125, 0.0, 0.0, 1.0, 388.481272876172, 790.6238281184715, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 23245, 23245, 100.0, 0.05136588513658846, 0, 31, 0.0, 0.0, 1.0, 388.3422156138798, 790.337087245435, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 23246, 23246, 100.0, 0.06512948464251984, 0, 25, 0.0, 0.0, 1.0, 388.31351062408123, 790.2786681060404, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 23247, 23247, 100.0, 0.06349206349206339, 0, 109, 0.0, 0.0, 1.0, 387.72140498348847, 789.0773704353464, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 23243, 23243, 100.0, 0.04736910037430612, 0, 24, 0.0, 0.0, 1.0, 388.4970248044394, 790.6521481371598, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 23246, 23246, 100.0, 0.0672803923255614, 0, 115, 0.0, 0.0, 1.0, 388.34594630715515, 790.3484157822967, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 23246, 23246, 100.0, 0.07325991568441818, 0, 105, 0.0, 0.0, 1.0, 388.3394587370531, 790.3352125010441, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, 5.492418174411739E-4, 5.492418174411739E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1092409, 99.99945075818256, 99.99945075818256], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1092415, 1092415, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 1092409, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 23238, 23238, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23238, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 23237, 23237, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23236, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 23243, 23243, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23243, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 23239, 23239, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23239, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 23237, 23237, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23237, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23237, 23237, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23237, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23240, 23240, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23240, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 23240, 23240, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23240, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 23239, 23239, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23239, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 23239, 23239, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23239, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 23240, 23240, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23240, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 23237, 23237, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23237, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 23241, 23241, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23241, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 23238, 23238, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23238, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23238, 23238, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23238, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 23237, 23237, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23237, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23244, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 23244, 23244, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23243, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 23245, 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 23247, 23247, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 23243, 23243, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23243, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 23246, 23246, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 23245, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
