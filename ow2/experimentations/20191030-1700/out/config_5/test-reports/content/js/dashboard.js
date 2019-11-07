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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12220829, 12220829, 100.0, 0.12657921978943293, 0, 308, 0.0, 0.0, 1.0, 20359.192084776456, 41434.15936984079, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 260029, 260029, 100.0, 0.12289398490168484, 0, 257, 0.0, 0.0, 1.0, 433.3058381449913, 881.8450846622674, 0.0], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 260048, 260048, 100.0, 0.13506737217744497, 0, 294, 0.0, 0.0, 1.0, 433.3223356428483, 881.8786596481406, 0.0], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 260032, 260032, 100.0, 0.11552424317006972, 0, 303, 0.0, 0.0, 1.0, 433.31011521297904, 881.8545344749512, 0.0], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 260053, 260053, 100.0, 0.1231095199824649, 0, 285, 0.0, 0.0, 1.0, 433.3285010389433, 881.8915798337732, 0.0], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 260034, 260034, 100.0, 0.11288523808425141, 0, 281, 0.0, 0.0, 1.0, 433.3134479575275, 881.8605718198119, 0.0], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 260017, 260017, 100.0, 0.2393266594107291, 0, 304, 1.0, 1.0, 1.0, 433.30533697286023, 881.8448100444859, 0.0], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 260058, 260058, 100.0, 0.11981173430542448, 0, 277, 0.0, 0.0, 1.0, 433.32816788054805, 881.8920196982876, 0.0], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 259982, 259982, 100.0, 0.14424460154934068, 0, 274, 0.0, 0.0, 1.0, 433.31272177563847, 881.8598393850617, 0.0], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 260046, 260046, 100.0, 0.12621228551871558, 0, 285, 0.0, 0.0, 1.0, 433.3197250572797, 881.8737193423245, 0.0], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 259975, 259975, 100.0, 0.11459563419559513, 0, 273, 0.0, 0.0, 1.0, 433.3039436117357, 881.8419744549013, 0.0], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 260065, 260065, 100.0, 0.12325764712668005, 0, 256, 0.0, 0.0, 1.0, 433.33477742156936, 881.9047258707435, 0.0], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 260027, 260027, 100.0, 0.12083360574094075, 0, 262, 0.0, 0.0, 1.0, 433.30322744057696, 881.8408894411426, 0.0], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 259999, 259999, 100.0, 0.12725433559359833, 0, 261, 0.0, 0.0, 1.0, 433.3157784214579, 881.865314678045, 0.0], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 259984, 259984, 100.0, 0.1204997230598804, 0, 267, 0.0, 0.0, 1.0, 433.31027758564653, 881.8541196176635, 0.0], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 260020, 260020, 100.0, 0.119317744788861, 0, 265, 0.0, 0.0, 1.0, 433.29733909241185, 881.8277877622913, 0.0], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 260008, 260008, 100.0, 0.14259561244268748, 0, 308, 0.0, 1.0, 1.0, 433.3213895856075, 881.8774796730607, 0.0], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 259971, 259971, 100.0, 0.11631297337010674, 0, 262, 0.0, 0.0, 1.0, 433.3088319857592, 881.8515503378728, 0.0], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 260042, 260042, 100.0, 0.11892309703817192, 0, 267, 0.0, 0.0, 1.0, 433.31955821874436, 881.8744977533511, 0.0], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 260041, 260041, 100.0, 0.13065631958037469, 0, 285, 0.0, 0.0, 1.0, 433.32005805573283, 881.874397053659, 0.0], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 260005, 260005, 100.0, 0.11735158939251226, 0, 262, 0.0, 0.0, 1.0, 433.32072283172977, 881.8757500288527, 0.0], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259977, 259977, 100.0, 0.12178769660392974, 0, 267, 0.0, 0.0, 1.0, 433.30511045257725, 881.8439764245541, 0.0], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 260038, 260038, 100.0, 0.12059006760550237, 0, 265, 0.0, 0.0, 1.0, 433.3172251753845, 881.8682590483411, 0.0], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259992, 259992, 100.0, 0.12876550047693944, 0, 254, 0.0, 0.0, 1.0, 433.3106116034153, 881.8551721092917, 0.0], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 259989, 259989, 100.0, 0.11218936185761812, 0, 292, 0.0, 0.0, 1.0, 433.31355562148127, 881.8607909327803, 0.0], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 259984, 259984, 100.0, 0.10963366976429435, 0, 283, 0.0, 0.0, 1.0, 433.30883321083274, 881.8522982588872, 0.0], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 260063, 260063, 100.0, 0.12468132721687034, 0, 290, 0.0, 0.0, 1.0, 433.3350551451904, 881.9052910879157, 0.0], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 259986, 259986, 100.0, 0.11177140307555185, 0, 301, 0.0, 0.0, 1.0, 433.3085556381479, 881.851360625673, 0.0], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 260011, 260011, 100.0, 0.21664852640850013, 0, 255, 0.0, 1.0, 1.0, 433.319167729087, 881.872957835454, 0.0], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 260021, 260021, 100.0, 0.11479842012760351, 0, 266, 0.0, 0.0, 1.0, 433.2946732388827, 881.8234803078269, 0.0], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 260020, 260020, 100.0, 0.1143258210906869, 0, 246, 0.0, 0.0, 1.0, 433.29878319063346, 881.8310993907829, 0.0], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 260019, 260019, 100.0, 0.12827908729746537, 0, 297, 0.0, 0.0, 1.0, 433.297116785037, 881.8284533209588, 0.0], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 260059, 260059, 100.0, 0.12300285704397926, 0, 255, 0.0, 0.0, 1.0, 433.3291121101339, 881.8924508178897, 0.0], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 259989, 259989, 100.0, 0.11555873517725815, 0, 253, 0.0, 0.0, 1.0, 433.31283343583283, 881.8596938916346, 0.0], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 259970, 259970, 100.0, 0.1293803131130504, 0, 255, 0.0, 0.0, 1.0, 433.3078874469553, 881.8496280544439, 0.0], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 260035, 260035, 100.0, 0.12072605610783212, 0, 285, 0.0, 0.0, 1.0, 433.31367020602954, 881.8610241302399, 0.0], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 259997, 259997, 100.0, 0.13134766939618683, 0, 288, 0.0, 0.0, 1.0, 433.3131673724753, 881.8603734936986, 0.0], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 259982, 259982, 100.0, 0.10908447507904216, 0, 262, 0.0, 0.0, 1.0, 433.31127737341853, 881.8576452547463, 0.0], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259984, 259984, 100.0, 0.1333274355344902, 0, 302, 0.0, 0.0, 1.0, 433.3131663641621, 881.8599987333143, 0.0], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259975, 259975, 100.0, 0.13134724492739572, 0, 257, 0.0, 0.0, 1.0, 433.30466580664086, 881.8426987705465, 0.0], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 260023, 260023, 100.0, 0.11775496782977059, 0, 287, 0.0, 0.0, 1.0, 433.29728396625245, 881.8284208867062, 0.0], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 260016, 260016, 100.0, 0.12773060119377064, 0, 257, 0.0, 0.0, 1.0, 433.32677828033184, 881.8880738023626, 0.0], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 260043, 260043, 100.0, 0.11042019973619605, 0, 262, 0.0, 0.0, 1.0, 433.3154481407176, 881.8650151494733, 0.0], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 260056, 260056, 100.0, 0.12438090257482996, 0, 267, 0.0, 0.0, 1.0, 433.32988965797637, 881.894033249241, 0.0], "isController": false}, {"data": ["1 \/site-forms-demo\/", 260067, 260067, 100.0, 0.12422183514248343, 0, 257, 0.0, 0.0, 1.0, 433.26014233926855, 881.7532042448347, 0.0], "isController": false}, {"data": ["50 \/site-forms-demo\/", 260000, 260000, 100.0, 0.11041923076922948, 0, 238, 0.0, 0.0, 1.0, 433.3123899011548, 881.858418509772, 0.0], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 260047, 260047, 100.0, 0.13334897153207517, 0, 277, 0.0, 0.0, 1.0, 433.3213913767965, 881.8767379191835, 0.0], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 260050, 260050, 100.0, 0.11302826379542392, 0, 285, 0.0, 0.0, 1.0, 433.3249462197168, 881.8839725799706, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 60, 4.909650564622089E-4, 4.909650564622089E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 12220769, 99.99950903494354, 99.99950903494354], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12220829, 12220829, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 12220769, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 60, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 260029, 260029, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260029, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 260048, 260048, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260048, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 260032, 260032, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260030, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 260053, 260053, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260052, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 260034, 260034, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260034, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 260017, 260017, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260015, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 260058, 260058, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260054, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 4, null, null, null, null, null, null], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 259982, 259982, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259980, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 260046, 260046, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260045, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 259975, 259975, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259973, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 260065, 260065, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260063, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 260027, 260027, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260024, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 3, null, null, null, null, null, null], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 259999, 259999, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259999, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 259984, 259984, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259984, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 260020, 260020, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260020, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 260008, 260008, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260006, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 259971, 259971, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259970, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 260042, 260042, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260038, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 4, null, null, null, null, null, null], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 260041, 260041, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260040, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 260005, 260005, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260004, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259977, 259977, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259976, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 260038, 260038, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260038, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259992, 259992, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259991, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 259989, 259989, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259989, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 259984, 259984, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259981, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 3, null, null, null, null, null, null], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 260063, 260063, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260061, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 259986, 259986, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259984, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 260011, 260011, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260009, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 260021, 260021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260018, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 3, null, null, null, null, null, null], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 260020, 260020, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260019, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 260019, 260019, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 3, null, null, null, null, null, null], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 260059, 260059, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260059, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 259989, 259989, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259988, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 259970, 259970, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259969, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 260035, 260035, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260035, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 259997, 259997, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259996, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 259982, 259982, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259978, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 4, null, null, null, null, null, null], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259984, 259984, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259984, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 259975, 259975, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 259975, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 260023, 260023, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260021, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 2, null, null, null, null, null, null], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 260016, 260016, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260015, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 260043, 260043, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260042, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 1, null, null, null, null, null, null], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 260056, 260056, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260056, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["1 \/site-forms-demo\/", 260067, 260067, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260064, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece: Name does not resolve", 3, null, null, null, null, null, null], "isController": false}, {"data": ["50 \/site-forms-demo\/", 260000, 260000, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260000, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 260047, 260047, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260047, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 260050, 260050, "Non HTTP response code: java.net.UnknownHostException\/Non HTTP response message: lutece", 260050, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
