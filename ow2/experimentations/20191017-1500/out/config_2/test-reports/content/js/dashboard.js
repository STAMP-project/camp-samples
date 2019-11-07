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

    var data = {"OkPercent": 80.8734057782405, "KoPercent": 19.1265942217595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8086527199375325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [1.0, 500, 1500, "43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2"], "isController": false}, {"data": [1.0, 500, 1500, "13 \/site-forms-demo\/js\/bootstrap.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js"], "isController": false}, {"data": [1.0, 500, 1500, "40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "27 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "28 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "48 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "75 \/site-forms-demo\/js\/admin.js"], "isController": false}, {"data": [1.0, 500, 1500, "74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "76 \/site-forms-demo\/js\/app.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js"], "isController": false}, {"data": [1.0, 500, 1500, "31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}, {"data": [0.0, 500, 1500, "60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js"], "isController": false}, {"data": [1.0, 500, 1500, "82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "36 \/site-forms-demo\/js\/bootstrap-datepicker.js"], "isController": false}, {"data": [0.0, 500, 1500, "45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "11 \/site-forms-demo\/js\/jquery\/jquery.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.9961832061068703, 500, 1500, "1 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "50 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [1.0, 500, 1500, "16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 122944, 23515, 19.1265942217595, 4.337177902134375, 0, 10277, 5.0, 9.0, 25.0, 2055.369800722215, 31891.653104024215, 1116.2450753926626], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 2618, 0, 0.0, 1.8025210084033585, 0, 246, 3.0, 6.0, 28.809999999999945, 53.091602279410274, 221.80261186652066, 25.30146671128146], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 2619, 0, 0.0, 2.2741504390988916, 0, 117, 4.0, 8.0, 30.800000000000182, 53.023707812847974, 855.8875648814103, 25.165548825238393], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 2618, 0, 0.0, 1.7322383498854064, 0, 64, 3.0, 6.0, 29.809999999999945, 53.08729595457771, 64.28539744499645, 24.884669978708306], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 2619, 0, 0.0, 2.145857197403591, 0, 123, 4.0, 7.0, 29.800000000000182, 52.997956168929726, 805.0617267653338, 25.619129202754113], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 2618, 0, 0.0, 2.1344537815126023, 0, 208, 4.0, 7.0, 31.0, 53.08729595457771, 561.2529941447835, 25.143885290986518], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 2618, 0, 0.0, 12.809396485867053, 1, 137, 31.0, 43.04999999999973, 77.80999999999995, 53.374108053007134, 240.60047145769624, 95.51549757900102], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 2619, 0, 0.0, 2.136311569301265, 0, 72, 4.0, 7.0, 30.800000000000182, 52.96794418040247, 559.9911754853878, 25.604621454393772], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 2611, 2611, 100.0, 5.866717732669488, 0, 215, 13.0, 22.0, 47.0, 53.93513736831233, 228.53961039170628, 39.661287537440614], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 2618, 0, 0.0, 2.3873185637891563, 0, 207, 4.0, 7.0, 33.0, 53.02063713874881, 1929.1952335475019, 19.882738927030804], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 2611, 2611, 100.0, 6.166219839142083, 0, 266, 14.0, 24.0, 45.88000000000011, 53.964120370370374, 228.6624202021846, 38.99750886140046], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 2619, 0, 0.0, 2.511263841160746, 0, 125, 5.0, 8.0, 36.80000000000018, 52.91764325547563, 25.735338223854363, 24.546758346045827], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 2618, 0, 0.0, 2.0588235294117756, 0, 247, 3.0, 7.0, 34.0, 53.095909302938736, 321.3754354097795, 25.25166780325309], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 2613, 2613, 100.0, 11.54228855721393, 1, 335, 25.0, 35.0, 62.86000000000013, 53.47604526942676, 226.7509653904795, 29.19248955625934], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 2613, 2613, 100.0, 5.98430922311519, 0, 220, 14.0, 22.0, 48.58000000000038, 53.88962217455865, 228.34674864786132, 28.891994701008496], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 2618, 0, 0.0, 2.1875477463712762, 0, 214, 4.0, 6.049999999999727, 36.0, 53.13146892884686, 807.0898429572391, 25.1648070610261], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 2614, 0, 0.0, 3.2069625095638896, 0, 136, 6.0, 10.0, 35.84999999999991, 53.422165907093664, 240.81710725307067, 32.76281268520979], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 2610, 2610, 100.0, 5.874712643678165, 0, 134, 13.0, 22.0, 44.0, 53.95014262681384, 228.60319224389184, 33.08661090785068], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 2618, 0, 0.0, 2.5920550038197128, 0, 81, 5.0, 9.0, 32.0, 53.03460011344299, 239.07003332387976, 25.68863442994895], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 2618, 0, 0.0, 2.6546982429335344, 0, 117, 5.0, 9.0, 31.0, 53.0550207721147, 239.16208582429832, 29.014464484750228], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 2614, 0, 0.0, 2.8125478194338145, 0, 207, 5.0, 9.0, 34.0, 53.4538464684471, 240.95991728354667, 29.963386594617806], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 2611, 0, 0.0, 3.133282267330524, 0, 122, 5.0, 10.0, 33.0, 53.94851026901938, 3.845938720350014, 30.451405210442577], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 2618, 0, 0.0, 2.1543162719633338, 0, 81, 4.0, 8.0, 33.0, 53.07115345631461, 623.7933623048855, 25.13623967413339], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 2613, 0, 0.0, 3.616915422885572, 0, 134, 6.0, 12.0, 38.86000000000013, 53.80971993410214, 3.836044487489703, 23.279009698053954], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 2613, 0, 0.0, 2.586299272866438, 0, 85, 4.0, 9.0, 35.0, 53.87073497577569, 535.7612939387692, 20.990647710287597], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 2613, 0, 0.0, 1.9854573287409132, 0, 112, 4.0, 7.0, 29.860000000000127, 53.885176936401876, 341.20262427307597, 21.94347537351522], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 2619, 0, 0.0, 2.383734249713629, 0, 124, 4.0, 8.0, 30.800000000000182, 52.94759825327511, 622.3411060316594, 25.594786265010917], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 2613, 0, 0.0, 2.166092613853804, 0, 82, 4.0, 7.0, 34.0, 53.88073243154075, 506.8156394341801, 21.099779008835778], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 2616, 0, 0.0, 10.281345565749245, 1, 187, 25.0, 36.0, 68.97999999999956, 53.437921313886505, 240.88812967275402, 77.9772608596846], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 2618, 0, 0.0, 1.813980137509552, 0, 104, 3.0, 6.0, 32.0, 53.11422195171434, 37.709022811422194, 24.171120536620005], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 2618, 0, 0.0, 2.2055003819709755, 0, 267, 4.0, 7.0, 30.0, 53.13578242338137, 857.6966285899126, 24.69983636086868], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 2618, 2618, 100.0, 5.930099312452253, 0, 228, 13.0, 22.0, 46.61999999999989, 53.14225397856447, 225.33561208488956, 27.141991045692592], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 2619, 0, 0.0, 2.0030546009927424, 0, 130, 4.0, 6.0, 28.0, 52.95295092905235, 221.22336335399015, 25.752509338543035], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 2613, 0, 0.0, 4.905472636815926, 0, 250, 9.0, 18.299999999999727, 51.86000000000013, 53.85186101149994, 10751.702855953228, 21.772139119883764], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 2610, 2610, 100.0, 11.246743295019153, 1, 269, 25.0, 34.0, 56.0, 53.95125782913368, 228.76597802158048, 30.821763505901565], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 2618, 0, 0.0, 2.348739495798323, 0, 116, 4.0, 7.0, 36.809999999999945, 53.07976156684644, 3208.9411323800737, 24.829302529804142], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 2613, 2613, 100.0, 7.664753157290463, 0, 259, 17.0, 28.0, 57.86000000000013, 53.78867411844624, 227.9190009765022, 35.088705381955165], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 2612, 0, 0.0, 2.249617151607965, 0, 81, 4.0, 8.0, 31.0, 53.89122720145251, 30.73484051332838, 24.735231235041674], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 2612, 0, 0.0, 3.4314701378254195, 0, 250, 6.0, 11.0, 38.86999999999989, 53.872331648963595, 3.840508017943694, 25.252655460451685], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 2610, 0, 0.0, 3.028735632183907, 0, 118, 5.0, 9.0, 35.88999999999987, 53.95125782913368, 3.846134591334725, 29.241160249188663], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 2618, 0, 0.0, 2.544308632543925, 0, 109, 4.0, 8.0, 33.0, 53.10560266136557, 2445.0877428470726, 23.596727745040365], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 2616, 2616, 100.0, 6.08868501529051, 0, 266, 12.300000000000182, 23.0, 48.659999999999854, 53.41609833789358, 226.49677635071671, 26.238571742148896], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 2618, 0, 0.0, 3.2337662337662287, 0, 294, 5.0, 10.0, 44.0, 53.0238587110625, 4979.84132431796, 20.091071464738526], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 2619, 0, 0.0, 1.7731958762886566, 0, 99, 3.0, 6.0, 26.0, 52.994738972076085, 64.17331672399838, 25.358810640934845], "isController": false}, {"data": ["1 \/site-forms-demo\/", 2620, 0, 0.0, 27.175190839694615, 0, 10277, 8.0, 15.0, 47.0, 43.83029978586723, 201.43104569559688, 15.708710958411402], "isController": false}, {"data": ["50 \/site-forms-demo\/", 2614, 0, 0.0, 2.747895944912021, 0, 215, 5.0, 9.0, 32.84999999999991, 53.48447027049147, 241.0979636411998, 28.41362483119859], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 2619, 0, 0.0, 1.7682321496754452, 0, 109, 3.0, 6.0, 31.0, 53.03874116527268, 321.02941185777354, 25.74243589759817], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 2619, 0, 0.0, 2.5211912943871644, 0, 264, 4.0, 9.0, 32.80000000000018, 53.011901870293904, 3204.8386691234514, 25.315253920482146], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 23515, 100.0, 19.1265942217595], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 122944, 23515, "500", 23515, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 2611, 2611, "500", 2611, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 2611, 2611, "500", 2611, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 2613, 2613, "500", 2613, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 2613, 2613, "500", 2613, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 2610, 2610, "500", 2610, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 2618, 2618, "500", 2618, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 2610, 2610, "500", 2610, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 2613, 2613, "500", 2613, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 2616, 2616, "500", 2616, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
