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

    var data = {"OkPercent": 80.93527617756692, "KoPercent": 19.064723822433074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8090138935953914, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [1.0, 500, 1500, "43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js"], "isController": false}, {"data": [0.0, 500, 1500, "93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2"], "isController": false}, {"data": [1.0, 500, 1500, "13 \/site-forms-demo\/js\/bootstrap.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js"], "isController": false}, {"data": [1.0, 500, 1500, "40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [0.0, 500, 1500, "51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [0.0, 500, 1500, "81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js"], "isController": false}, {"data": [1.0, 500, 1500, "47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [0.0, 500, 1500, "104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "27 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "28 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "48 \/site-forms-demo\/jsp\/site\/Portal.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "75 \/site-forms-demo\/js\/admin.js"], "isController": false}, {"data": [1.0, 500, 1500, "74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js"], "isController": false}, {"data": [1.0, 500, 1500, "76 \/site-forms-demo\/js\/app.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms"], "isController": false}, {"data": [1.0, 500, 1500, "35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js"], "isController": false}, {"data": [1.0, 500, 1500, "31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js"], "isController": false}, {"data": [1.0, 500, 1500, "73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js"], "isController": false}, {"data": [0.0, 500, 1500, "107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}, {"data": [0.0, 500, 1500, "60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js"], "isController": false}, {"data": [1.0, 500, 1500, "82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar"], "isController": false}, {"data": [1.0, 500, 1500, "36 \/site-forms-demo\/js\/bootstrap-datepicker.js"], "isController": false}, {"data": [0.0, 500, 1500, "45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "11 \/site-forms-demo\/js\/jquery\/jquery.min.js"], "isController": false}, {"data": [1.0, 500, 1500, "19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js"], "isController": false}, {"data": [0.9842022116903634, 500, 1500, "1 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "50 \/site-forms-demo\/"], "isController": false}, {"data": [1.0, 500, 1500, "18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js"], "isController": false}, {"data": [1.0, 500, 1500, "16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29510, 5626, 19.064723822433074, 18.647949847509, 0, 45426, 9.0, 13.0, 27.0, 492.4406768347629, 7643.305030631529, 267.30451280537665], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["39 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 629, 0, 0.0, 2.5612082670906213, 0, 30, 5.0, 8.0, 19.700000000000045, 44.22725355083673, 184.76971747117142, 21.07705052032063], "isController": false}, {"data": ["17 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 631, 0, 0.0, 2.695721077654516, 0, 33, 6.0, 8.399999999999977, 14.67999999999995, 43.86513729579423, 708.0535687130691, 20.81880539624609], "isController": false}, {"data": ["34 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 630, 0, 0.0, 2.6460317460317446, 0, 29, 6.0, 8.0, 18.37999999999988, 44.241573033707866, 53.57377984550562, 20.73823735955056], "isController": false}, {"data": ["14 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 632, 0, 0.0, 2.685126582278483, 0, 30, 5.7000000000000455, 7.350000000000023, 19.0, 43.91328515842134, 667.0616705461367, 21.227613431072818], "isController": false}, {"data": ["38 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 630, 0, 0.0, 2.930158730158731, 0, 31, 6.0, 10.0, 20.0, 44.24778761061947, 467.7993639380531, 20.957204092920353], "isController": false}, {"data": ["43 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 627, 0, 0.0, 12.661881977671452, 2, 123, 25.0, 35.60000000000002, 73.60000000000014, 44.85941189096373, 202.21781766473492, 80.27990739250197], "isController": false}, {"data": ["15 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.iframe-transport.js", 632, 0, 0.0, 2.7167721518987316, 0, 26, 6.0, 7.0, 16.66999999999996, 43.80978788298905, 463.1687144738666, 21.17758300984334], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 625, 625, 100.0, 7.908799999999996, 0, 90, 17.0, 23.699999999999932, 47.960000000000036, 46.47531231409875, 196.93005872155712, 34.175693527848004], "isController": false}, {"data": ["13 \/site-forms-demo\/js\/bootstrap.min.js", 630, 0, 0.0, 2.806349206349208, 0, 56, 5.0, 7.449999999999932, 18.069999999999823, 44.04362416107382, 1602.5599537279782, 16.516359060402685], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 624, 624, 100.0, 7.338141025641022, 0, 55, 16.0, 21.0, 34.75, 46.49776453055142, 197.02519560357675, 33.601900149031295], "isController": false}, {"data": ["21 \/site-forms-demo\/js\/plugins\/forms\/terms-of-service.js", 632, 0, 0.0, 3.450949367088608, 0, 78, 6.0, 8.0, 50.66999999999996, 43.646408839779006, 21.22647617403315, 20.246136912983424], "isController": false}, {"data": ["40 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 629, 0, 0.0, 2.709062003179648, 0, 44, 6.0, 8.5, 15.700000000000045, 44.22103487064117, 267.6581778596035, 21.030902326174072], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 626, 626, 100.0, 16.498402555910534, 1, 337, 28.0, 34.0, 257.63000000000056, 45.25737420474263, 191.90187382518795, 24.705929863721803], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 625, 625, 100.0, 7.595199999999999, 0, 66, 17.0, 22.0, 41.0, 46.33748517200475, 196.34604312629745, 24.84304624944395], "isController": false}, {"data": ["32 \/site-forms-demo\/js\/plugins\/asynchronousupload\/vendor\/jquery.ui.widget.js", 628, 0, 0.0, 2.6783439490445833, 0, 34, 6.0, 8.0, 17.0, 44.20045045045045, 671.4238347233953, 20.93478366061374], "isController": false}, {"data": ["47 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 626, 0, 0.0, 3.85463258785942, 0, 54, 8.0, 12.649999999999977, 21.730000000000018, 45.21487901769592, 203.82019682195738, 27.729437522571324], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 623, 623, 100.0, 6.871589085072235, 1, 61, 14.0, 19.0, 36.0, 46.513364192922204, 197.0912961260639, 28.52577413394057], "isController": false}, {"data": ["27 \/site-forms-demo\/jsp\/site\/Portal.jsp", 630, 0, 0.0, 3.5412698412698442, 0, 42, 8.0, 11.0, 19.0, 44.114557804075346, 198.86015510118338, 21.367988936348993], "isController": false}, {"data": ["28 \/site-forms-demo\/jsp\/site\/Portal.jsp", 630, 0, 0.0, 3.612698412698415, 0, 36, 8.0, 10.0, 22.37999999999988, 44.195019291476676, 199.22286039985968, 24.169151175026304], "isController": false}, {"data": ["48 \/site-forms-demo\/jsp\/site\/Portal.jsp", 626, 0, 0.0, 3.4904153354632563, 0, 51, 7.0, 10.0, 20.460000000000036, 45.25737420474263, 204.01175715731637, 25.36887968117409], "isController": false}, {"data": ["94 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 625, 0, 0.0, 3.7520000000000007, 0, 36, 7.0, 10.0, 19.480000000000018, 46.56534048576963, 3.3195994682238115, 26.283951953881687], "isController": false}, {"data": ["41 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 630, 0, 0.0, 2.91746031746032, 0, 37, 6.0, 10.0, 21.68999999999994, 44.20432220039293, 519.5734589882121, 20.93661744842829], "isController": false}, {"data": ["77 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 625, 0, 0.0, 3.4912000000000085, 0, 37, 7.0, 9.0, 19.0, 46.27230325016658, 3.2987091184200787, 20.018193691234174], "isController": false}, {"data": ["75 \/site-forms-demo\/js\/admin.js", 625, 0, 0.0, 2.865600000000001, 0, 39, 6.0, 8.0, 18.74000000000001, 46.32374740587015, 460.7041441224429, 18.04997579584198], "isController": false}, {"data": ["74 \/site-forms-demo\/js\/bootstrap-filestyle.min.js", 625, 0, 0.0, 2.601600000000001, 0, 33, 5.399999999999977, 8.0, 17.74000000000001, 46.34435711107815, 293.4539174885066, 18.872653237616788], "isController": false}, {"data": ["22 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-image.js", 632, 0, 0.0, 2.8275316455696182, 0, 50, 5.0, 7.0, 24.0, 43.78247315552477, 514.6150848631797, 21.164379113266367], "isController": false}, {"data": ["76 \/site-forms-demo\/js\/app.min.js", 625, 0, 0.0, 2.6976000000000036, 0, 51, 5.0, 7.699999999999932, 16.0, 46.320314237011786, 435.70045579189207, 18.139107430704808], "isController": false}, {"data": ["46 \/site-forms-demo\/jsp\/site\/Portal.jsp?page=forms", 626, 0, 0.0, 10.274760383386567, 1, 101, 21.0, 31.0, 57.73000000000002, 45.13663566226837, 203.46749044631912, 65.7578840399452], "isController": false}, {"data": ["35 \/site-forms-demo\/js\/locales\/bootstrap-datepicker.fr.js", 628, 0, 0.0, 2.595541401273886, 0, 26, 6.0, 7.5499999999999545, 18.420000000000073, 44.178684488216675, 31.365140256771017, 20.104752901864227], "isController": false}, {"data": ["31 \/site-forms-demo\/js\/plugins\/asynchronousupload\/load-image.min.js", 628, 0, 0.0, 2.947452229299367, 0, 37, 6.0, 9.0, 19.710000000000036, 44.19733971426561, 713.4158477901331, 20.544857132803152], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 628, 628, 100.0, 9.488853503184703, 0, 259, 13.0, 19.0, 198.55000000000018, 44.21601070196438, 187.48624850383723, 22.582982028444697], "isController": false}, {"data": ["20 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-validate.js", 632, 0, 0.0, 2.5917721518987342, 0, 36, 6.0, 7.0, 12.339999999999918, 43.78550644312041, 182.92421539420812, 21.29412325065817], "isController": false}, {"data": ["73 \/site-forms-demo\/js\/jquery\/jquery-ui.min.js", 625, 0, 0.0, 5.5807999999999955, 0, 62, 11.0, 16.0, 35.48000000000002, 46.286010516181584, 9241.155683574947, 18.713289407909354], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 623, 623, 100.0, 13.470304975922945, 2, 94, 26.0, 34.799999999999955, 60.51999999999998, 46.53073418477855, 197.3012185842856, 26.58249950985884], "isController": false}, {"data": ["33 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 630, 0, 0.0, 3.066666666666664, 0, 33, 7.0, 10.0, 19.0, 44.23536020221879, 2674.2521569126525, 20.692126500842576], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 626, 626, 100.0, 9.220447284345054, 1, 97, 18.0, 25.0, 45.65000000000009, 46.29835071370461, 196.1802185026995, 30.202439723393237], "isController": false}, {"data": ["83 \/site-forms-demo\/js\/plugins\/forms\/multiview\/forms-multiview.js", 625, 0, 0.0, 2.587200000000002, 0, 28, 5.0, 7.0, 13.740000000000009, 46.48222519708464, 26.50939405771233, 21.334615080693144], "isController": false}, {"data": ["82 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 625, 0, 0.0, 3.6304000000000083, 0, 33, 8.0, 10.699999999999932, 16.74000000000001, 46.43387815750371, 3.310227642087667, 21.765880386329865], "isController": false}, {"data": ["101 \/site-forms-demo\/servlet\/plugins\/adminavatar\/avatar", 624, 0, 0.0, 3.5320512820512855, 0, 55, 7.0, 9.0, 23.75, 46.53937947494033, 3.3177487321002386, 25.223980086515514], "isController": false}, {"data": ["36 \/site-forms-demo\/js\/bootstrap-datepicker.js", 628, 0, 0.0, 2.957006369426751, 0, 37, 6.0, 8.549999999999955, 16.0, 44.191119555274085, 2034.6471813208077, 19.635702536767294], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 626, 626, 100.0, 7.321086261980833, 0, 81, 15.0, 21.649999999999977, 36.460000000000036, 45.11061468617136, 191.27957906968365, 22.158827331195504], "isController": false}, {"data": ["11 \/site-forms-demo\/js\/jquery\/jquery.min.js", 630, 0, 0.0, 4.03809523809524, 0, 32, 8.0, 12.0, 20.0, 44.04670348877858, 4136.733907440746, 16.689571243795008], "isController": false}, {"data": ["19 \/site-forms-demo\/js\/plugins\/asynchronousupload\/canvas-to-blob.min.js", 632, 0, 0.0, 2.764240506329115, 0, 43, 6.0, 8.0, 19.339999999999918, 43.888888888888886, 53.146701388888886, 21.00151909722222], "isController": false}, {"data": ["1 \/site-forms-demo\/", 633, 0, 0.0, 653.7693522906778, 0, 45426, 11.600000000000023, 17.0, 40229.17999999997, 10.564261753367045, 48.55021075326691, 3.7862149057477597], "isController": false}, {"data": ["50 \/site-forms-demo\/", 626, 0, 0.0, 3.575079872204473, 0, 78, 8.0, 11.0, 24.730000000000018, 45.26391901663052, 204.04125994215474, 24.04645697758496], "isController": false}, {"data": ["18 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload-process.js", 631, 0, 0.0, 2.7622820919175886, 0, 60, 6.0, 8.0, 16.03999999999985, 43.88649325358186, 265.6332863141605, 21.300378073271666], "isController": false}, {"data": ["16 \/site-forms-demo\/js\/plugins\/asynchronousupload\/jquery.fileupload.js", 632, 0, 0.0, 2.876582278481012, 0, 57, 6.0, 8.0, 18.66999999999996, 43.92244075335326, 2655.334587184655, 20.97468118006811], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 5626, 100.0, 19.064723822433074], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29510, 5626, "500", 5626, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["93 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp?view=view_form_response_details&filter_forms_id_form=-1&selected_panel=forms&id_form_response=2", 625, 625, "500", 625, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["98 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/ManageDirectoryFormResponseDetails.jsp", 624, 624, "500", 624, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 626, 626, "500", 626, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["81 \/site-forms-demo\/jsp\/admin\/plugins\/forms\/MultiviewForms.jsp", 625, 625, "500", 625, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["104 \/site-forms-demo\/jsp\/admin\/DoAdminLogout.jsp", 623, 623, "500", 623, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["37 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 628, 628, "500", 628, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["107 \/site-forms-demo\/jsp\/admin\/AdminLogin.jsp", 623, 623, "500", 623, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["60 \/site-forms-demo\/jsp\/admin\/DoAdminLogin.jsp", 626, 626, "500", 626, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["45 \/site-forms-demo\/jsp\/site\/plugins\/asynchronousupload\/GetMainUploadJs.jsp", 626, 626, "500", 626, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
