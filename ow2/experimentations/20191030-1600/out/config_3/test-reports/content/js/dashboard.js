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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 903809, 903809, 100.0, 0.07854203708969487, 0, 145, 0.0, 0.0, 1.0, 15077.55571867076, 30685.20413974918, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 19232, 19232, 100.0, 0.06468386023294496, 0, 96, 0.0, 0.0, 1.0, 321.5139508835281, 654.3311266028052, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 19233, 19233, 100.0, 0.07721104351895226, 0, 28, 0.0, 0.0, 1.0, 321.45006016847174, 654.2010990147413, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 19232, 19232, 100.0, 0.06717970049916815, 0, 30, 0.0, 0.0, 1.0, 321.5139508835281, 654.3311266028052, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 19233, 19233, 100.0, 0.07185566474289028, 0, 37, 0.0, 1.0, 1.0, 321.4393154393823, 654.1792318121803, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 19232, 19232, 100.0, 0.06827163061564046, 0, 68, 0.0, 0.0, 1.0, 321.50320132399406, 654.3092495695347, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 19230, 19230, 100.0, 0.20858034321372834, 0, 82, 1.0, 1.0, 2.0, 321.5073898214405, 654.317773816291, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 19233, 19233, 100.0, 0.07091977330629683, 0, 66, 0.0, 0.0, 1.0, 321.42857142857144, 654.1573660714286, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 19226, 19226, 100.0, 0.09445542494538661, 0, 85, 0.0, 1.0, 1.0, 321.56954572823975, 654.444270798488, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 19233, 19233, 100.0, 0.0614048770342637, 0, 28, 0.0, 0.0, 1.0, 321.47692513413676, 654.2557734175206, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 19226, 19226, 100.0, 0.0791636325808802, 0, 92, 0.0, 0.0, 1.0, 321.57492431465033, 654.4552170622376, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 19234, 19234, 100.0, 0.07959862743059123, 0, 40, 0.0, 1.0, 1.0, 321.34861496307684, 653.9946421709493, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 19232, 19232, 100.0, 0.061616056572379334, 0, 33, 0.0, 0.0, 1.0, 321.51932593286074, 654.3420656680487, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 19228, 19228, 100.0, 0.08321198252548326, 0, 88, 0.0, 1.0, 1.0, 321.5761042262472, 654.4576183666984, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 19227, 19227, 100.0, 0.07827534196702501, 0, 85, 0.0, 0.0, 1.0, 321.5808928063691, 654.4673638754621, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 19231, 19231, 100.0, 0.0769590764910821, 0, 64, 0.0, 0.0, 1.0, 321.51335807670444, 654.3336589521266, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 19229, 19229, 100.0, 0.08570388475739774, 0, 41, 0.0, 1.0, 1.0, 321.57131628677024, 654.4478741617472, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 19224, 19224, 100.0, 0.06528297960882146, 0, 89, 0.0, 0.0, 1.0, 321.55222881993814, 654.4090281843272, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 19232, 19232, 100.0, 0.07107945091514174, 0, 29, 0.0, 0.0, 1.0, 321.47095695779353, 654.2436272461346, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 19232, 19232, 100.0, 0.08496256239600643, 0, 129, 0.0, 1.0, 1.0, 321.48170436119887, 654.2654998913462, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 19228, 19228, 100.0, 0.07712710630330798, 0, 49, 0.0, 0.0, 1.0, 321.565348273267, 654.435728321766, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19226, 19226, 100.0, 0.08098408405284496, 0, 85, 0.0, 0.0, 1.0, 321.57492431465033, 654.4589575545269, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 19232, 19232, 100.0, 0.0753431780366059, 0, 89, 0.0, 0.0, 1.0, 321.49245248324166, 654.2911123654319, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19228, 19228, 100.0, 0.07603494903266031, 0, 66, 0.0, 0.0, 1.0, 321.58686089879745, 654.4795098760684, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 19228, 19228, 100.0, 0.07743915123777849, 0, 98, 0.0, 0.0, 1.0, 321.58686089879745, 654.4795098760684, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 19227, 19227, 100.0, 0.06381650803557508, 0, 25, 0.0, 0.0, 1.0, 321.5808928063691, 654.4673638754621, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 19234, 19234, 100.0, 0.07460746594572157, 0, 69, 0.0, 0.0, 1.0, 321.3700918964077, 654.0383510860485, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 19227, 19227, 100.0, 0.07109793519529867, 0, 96, 0.0, 0.0, 1.0, 321.57551430005014, 654.4564177747116, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 19229, 19229, 100.0, 0.17515211399448738, 0, 117, 1.0, 1.0, 1.0, 321.5659386601559, 654.4406696555486, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 19231, 19231, 100.0, 0.06265924808902266, 0, 29, 0.0, 0.0, 1.0, 321.51335807670444, 654.329920148293, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 19231, 19231, 100.0, 0.06832718007383919, 0, 92, 0.0, 0.0, 1.0, 321.51873338571886, 654.3408597420294, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 19231, 19231, 100.0, 0.07643908273100712, 0, 145, 0.0, 0.0, 1.0, 321.52410887447337, 654.3517997015649, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 19234, 19234, 100.0, 0.06748466257668684, 0, 30, 0.0, 0.0, 1.0, 321.3808314396471, 654.0602077345943, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 19228, 19228, 100.0, 0.07702309132515049, 0, 104, 0.0, 0.0, 1.0, 321.58686089879745, 654.4832501181198, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 19224, 19224, 100.0, 0.07901581356637528, 0, 64, 0.0, 1.0, 1.0, 321.5576073865917, 654.4199744078684, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 19232, 19232, 100.0, 0.07362728785357742, 0, 122, 0.0, 0.0, 1.0, 321.4978268137746, 654.298311601471, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 19228, 19228, 100.0, 0.09902225920532587, 0, 64, 0.0, 1.0, 1.0, 321.58148247257157, 654.4685639383194, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 19226, 19226, 100.0, 0.07006137522105443, 0, 92, 0.0, 0.0, 1.0, 321.56954572823975, 654.444270798488, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19227, 19227, 100.0, 0.07016175170333382, 0, 99, 0.0, 0.0, 1.0, 321.5808928063691, 654.4673638754621, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19224, 19224, 100.0, 0.07303370786516886, 0, 105, 0.0, 0.0, 1.0, 321.5468504332118, 654.3980823269661, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 19231, 19231, 100.0, 0.06369923560917275, 0, 33, 0.0, 0.0, 1.0, 321.5079829474212, 654.3189809203377, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 19230, 19230, 100.0, 0.07295891835673445, 0, 108, 0.0, 0.0, 1.0, 321.571906354515, 654.449075041806, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 19233, 19233, 100.0, 0.06416055737534478, 0, 92, 0.0, 0.0, 1.0, 321.4876723777685, 654.2776457375679, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 19233, 19233, 100.0, 0.07232361046118632, 0, 21, 0.0, 1.0, 1.0, 321.43394334419656, 654.1682987590875, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 19234, 19234, 100.0, 0.06540501195799159, 0, 80, 0.0, 0.0, 1.0, 320.87149458652385, 653.0273584123668, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 19228, 19228, 100.0, 0.06698564593301458, 0, 116, 0.0, 0.0, 1.0, 321.57072615981537, 654.4466731611868, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 19233, 19233, 100.0, 0.0754952425518644, 0, 35, 0.0, 0.0, 1.0, 321.45543280239343, 654.2120331642459, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 19233, 19233, 100.0, 0.0715956948993918, 0, 145, 0.0, 0.0, 1.0, 321.4446877141377, 654.1901652307255, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, 6.638570759972516E-4, 6.638570759972516E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 903803, 99.99933614292401, 99.99933614292401], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 903809, 903809, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 903803, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 6, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 19230, 19230, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19230, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 19226, 19226, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19226, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 19226, 19226, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19226, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 19234, 19234, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19234, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 19227, 19227, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19227, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 19231, 19231, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19230, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 19229, 19229, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19229, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 19224, 19224, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19224, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19226, 19226, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19225, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19231, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 19227, 19227, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19227, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 19234, 19234, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19234, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 19227, 19227, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19227, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 19229, 19229, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 19231, 19231, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19231, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 19231, 19231, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19231, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 19231, 19231, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19231, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 19234, 19234, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19234, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19227, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 19224, 19224, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19224, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 19232, 19232, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19232, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 19226, 19226, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19226, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19227, 19227, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19227, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 19224, 19224, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19224, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 19231, 19231, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19231, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 19230, 19230, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19230, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 19234, 19234, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 19228, 19228, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19228, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 19233, 19233, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 19233, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
