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

    var data = {"OkPercent": 80.8612308639803, "KoPercent": 19.138769136019707};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8085573200774239, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [1.0, 500, 1500, "43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2"], "isController": false}, {"data": [1.0, 500, 1500, "13 \/site-forms-demo\/js\/bootstrap.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js"], "isController": false}, {"data": [1.0, 500, 1500, "40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "27 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "28 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "48 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "75 \/site-forms-demo\/js\/admin.js"], "isController": false}, {"data": [1.0, 500, 1500, "74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "76 \/site-forms-demo\/js\/app.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js"], "isController": false}, {"data": [1.0, 500, 1500, "31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}, {"data": [0.0, 500, 1500, "60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js"], "isController": false}, {"data": [1.0, 500, 1500, "82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "36 \/site-forms-demo\/js\/bootstrap-datepicker.js"], "isController": false}, {"data": [0.0, 500, 1500, "45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "11 \/site-forms-demo\/js\/jquery\/jquery.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.9974180222050091, 500, 1500, "1 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "50 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [1.0, 500, 1500, "16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181856, 34805, 19.138769136019707, 2.9520389758930325, 0, 10953, 5.0, 9.0, 21.0, 3033.9166847399947, 47070.95326680611, 1647.6379181716186], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 3871, 0, 0.0, 0.995091707569102, 0, 27, 2.0, 4.0, 10.0, 79.42956807222735, 331.8356369267467, 37.85315353442085], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 3872, 0, 0.0, 1.404700413223136, 0, 47, 3.0, 5.0, 13.0, 79.16257769054629, 1277.8107877412497, 37.571301521099116], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 3871, 0, 0.0, 0.9772668561095307, 0, 46, 2.0, 4.0, 10.0, 79.42467889531783, 96.17832209979892, 37.23031823218023], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 3872, 0, 0.0, 1.2799586776859473, 0, 34, 3.0, 4.0, 11.0, 79.15610434213754, 1202.4152373456538, 38.26393715757626], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 3871, 0, 0.0, 1.1573236889692613, 0, 52, 2.0, 4.0, 9.279999999999745, 79.41001497528052, 839.5437716038936, 37.611188733409236], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3869, 0, 0.0, 9.195140863272156, 1, 117, 20.0, 28.0, 47.30000000000018, 79.80939807747845, 359.7658022711333, 142.7709073574611], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 3872, 0, 0.0, 1.3189566115702456, 0, 47, 3.0, 4.0, 11.0, 79.15125002555244, 836.8080398209286, 38.26159058852389], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 3866, 3866, 100.0, 4.864459389549909, 0, 74, 12.0, 17.0, 30.0, 80.61220234371743, 341.5784628607323, 59.27830895001877], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 3871, 0, 0.0, 1.4699044174631872, 0, 33, 3.0, 5.0, 12.0, 79.3042694419405, 2885.544702282482, 29.739101040727693], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 3866, 3866, 100.0, 4.783238489394736, 0, 54, 11.0, 16.0, 28.0, 80.62565172054222, 341.63545196819604, 58.26463112617309], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 3872, 0, 0.0, 1.4529958677685977, 0, 52, 3.0, 4.0, 10.269999999999982, 79.06235961938988, 38.450249111773594, 36.67443439375996], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 3871, 0, 0.0, 0.9064841126323941, 0, 20, 2.0, 3.0, 8.0, 79.47196616641689, 481.0227014643084, 37.79574953422365], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3869, 3869, 100.0, 9.60635823210136, 1, 350, 20.0, 27.0, 47.30000000000018, 79.94792742902013, 338.9979500945365, 43.64344866486548], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 3866, 3866, 100.0, 4.757630625969994, 0, 62, 12.0, 16.0, 30.0, 80.57356036764553, 341.4147250343886, 43.19812953304433], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 3870, 0, 0.0, 1.228940568475452, 0, 35, 3.0, 4.0, 12.0, 79.48570489648374, 1207.4220113914105, 37.64703796366661], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3869, 0, 0.0, 2.040320496252257, 0, 34, 4.0, 6.0, 14.300000000000182, 79.92315478526722, 360.27859618046233, 49.01537227065215], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 3865, 3865, 100.0, 4.70245795601552, 0, 98, 11.0, 16.0, 28.0, 80.63843104527436, 341.6896018607866, 49.454037789484666], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3871, 0, 0.0, 1.6502195815034866, 0, 37, 3.0, 6.0, 16.0, 79.3042694419405, 357.48877709374744, 38.41300551093993], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3871, 0, 0.0, 1.650994575045201, 0, 43, 3.0, 6.0, 14.279999999999745, 79.3400286944046, 357.6499730989957, 43.38907819225251], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 3869, 0, 0.0, 1.7909020418712853, 0, 35, 4.0, 6.0, 13.0, 79.9281080857745, 360.3009247304053, 44.80345121214312], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3866, 0, 0.0, 1.898603207449561, 0, 26, 4.0, 5.0, 12.0, 80.62060767835172, 5.7473675395699955, 45.50655394344462], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 3871, 0, 0.0, 1.1934900542495495, 0, 35, 3.0, 4.0, 11.0, 79.37093764737241, 932.9185600818109, 37.59268042868713], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3867, 0, 0.0, 1.9260408585466833, 0, 33, 4.0, 5.0, 11.320000000000164, 80.52223888055971, 5.740354920196152, 34.835304515710895], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 3866, 0, 0.0, 1.5085359544749073, 0, 50, 3.0, 5.0, 12.0, 80.53327778356422, 800.9286142068534, 31.379665855119256], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 3866, 0, 0.0, 1.070356958096225, 0, 43, 2.0, 4.0, 9.0, 80.55677106124065, 510.08799175887145, 32.80485696536851], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 3872, 0, 0.0, 1.5446797520661144, 0, 53, 3.0, 5.0, 13.0, 79.13183871165519, 930.1082136069159, 38.25220718971613], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 3866, 0, 0.0, 1.3049663735126773, 0, 30, 3.0, 4.0, 10.329999999999927, 80.54502270927956, 757.6266198591609, 31.54155674455186], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 3869, 0, 0.0, 7.276815714654951, 1, 86, 16.0, 23.0, 38.30000000000018, 79.91655133951625, 360.2488290851631, 116.61011117881561], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 3870, 0, 0.0, 0.863307493540052, 0, 24, 2.0, 3.0, 8.0, 79.48243992606285, 56.42942756469501, 36.17071973197782], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 3870, 0, 0.0, 1.2217054263565867, 0, 47, 2.0, 4.0, 11.0, 79.4873374822848, 1283.0529309030132, 36.94919203278083], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3870, 3870, 100.0, 4.362273901808779, 0, 230, 10.0, 14.0, 27.0, 79.47917522385607, 337.01033088084284, 40.59336781452805], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 3872, 0, 0.0, 1.1461776859504176, 0, 95, 3.0, 4.0, 9.0, 79.13992560192945, 330.6255876221232, 38.48797163062584], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 3867, 0, 0.0, 2.6834755624515076, 0, 60, 5.0, 8.0, 18.0, 80.54068689729866, 16080.21555929514, 32.56234802293129], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3865, 3865, 100.0, 9.122897800776206, 1, 77, 19.0, 25.0, 41.0, 80.6367486595314, 341.91871355438025, 46.06689254475183], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 3871, 0, 0.0, 1.302505812451561, 0, 28, 3.0, 4.0, 11.0, 79.39861344710178, 4800.049378961214, 37.14056234488452], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 3869, 3869, 100.0, 5.2651848022745025, 0, 63, 12.0, 16.0, 27.0, 80.52364302364302, 341.2032100386592, 52.529095253704625], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 3866, 0, 0.0, 1.3054837040869074, 0, 34, 3.0, 4.0, 10.0, 80.6054793378091, 45.970312434844246, 36.99665555543972], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3866, 0, 0.0, 1.8773926539058439, 0, 41, 4.0, 5.0, 11.0, 80.58867672809139, 5.745091212061202, 37.77594221629283], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 3865, 0, 0.0, 1.862871927554981, 0, 45, 4.0, 6.0, 11.0, 80.6367486595314, 5.7485182149861265, 43.70448779886713], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 3871, 0, 0.0, 1.583828468096101, 0, 32, 3.0, 5.0, 14.0, 79.48502084146115, 3659.6487086058296, 35.31805125279768], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3869, 3869, 100.0, 4.331610235202879, 0, 73, 10.0, 14.0, 27.0, 79.90829856664877, 338.82991443006733, 39.25183025295345], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 3871, 0, 0.0, 1.660811159906997, 0, 40, 3.0, 5.0, 12.279999999999745, 79.3010201991232, 7447.713294501834, 30.047652184824027], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 3872, 0, 0.0, 1.0470041322314068, 0, 36, 2.0, 4.0, 9.0, 79.15286806492499, 95.8491761723701, 37.87588413263012], "isController": false}, {"data": ["1 \/site-forms-demo\/", 3873, 0, 0.0, 19.831913245546136, 0, 10953, 6.0, 9.0, 19.259999999999764, 64.62000500542254, 296.974358940936, 23.159708825185618], "isController": false}, {"data": ["50 \/site-forms-demo\/", 3869, 0, 0.0, 1.8423365210648717, 0, 67, 4.0, 6.0, 14.0, 79.9314106272209, 360.31581196801915, 42.463561895711095], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 3871, 0, 0.0, 1.0387496770860232, 0, 71, 2.0, 4.0, 10.0, 79.23771313941826, 479.60483011534603, 38.45814788114343], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 3872, 0, 0.0, 1.4473140495867758, 0, 51, 3.0, 5.0, 13.0, 79.15772257998569, 4785.486302770111, 37.80090463048145], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 34805, 100.0, 19.138769136019707], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181856, 34805, "500", 34805, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 3866, 3866, "500", 3866, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 3866, 3866, "500", 3866, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3869, 3869, "500", 3869, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 3866, 3866, "500", 3866, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 3865, 3865, "500", 3865, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3870, 3870, "500", 3870, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 3865, 3865, "500", 3865, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 3869, 3869, "500", 3869, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 3869, 3869, "500", 3869, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
