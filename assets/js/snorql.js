var _endpoint = "https://query.wikidata.org/sparql";
var _examples_repo = "https://api.github.com/repos/egonw/SARS-CoV-2-Queries/contents/sparql";
var _defaultGraph = "";
var _namespaces = snorql_namespacePrefixes;

var _poweredByLink = 'https://github.com/ammar257ammar/snorql-extended';
var _poweredByLabel = 'Snorql - Extended Edition';

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue+ ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function changeEndpoint() {
    var newEp = document.getElementById("endpoint").value;
    setCookie("endpoint", newEp);
}

function changeExamplesRepo() {
    var newEx = document.getElementById("examples-repo").value;
    setCookie("examplesrepo", newEx);
}

function getPrefixes(){

    prefixes = '';
    for (prefix in _namespaces) {
        var uri = _namespaces[prefix];
        prefixes = prefixes + 'PREFIX ' + prefix + ': <' + uri + '>\n';
    }
    return prefixes;
}

function fetchExamples() {
    var repo = jQuery("#examples-repo").val();
    if(!repo || (!repo.includes("https://github.com") && !repo.includes("https://api.github.com"))){
        alert("Please enter SPARQL examples Github repo URL!!");
    }else{

        var link = repo;

        if(repo.includes("https://github.com")){
            link = "https://api.github.com/repos/"+repo.substring(19)+"/contents";
        }

        jQuery.ajax({
	        url: link,
		    dataType: 'json',
		    success:function(response){
		        jQuery("#examples").html('');
    	        response.forEach(e => {
    	          if(e["name"].endsWith(".rq")){
                    jQuery("#examples").append("<li class=\"list-group-item sparql-example\">"+e["name"]+"<p class=\"hide\">"+e["download_url"]+"</p></li>");
    	          }
    	        });
		    }
	    });
    }
}

function start(){

    var ep = getCookie('endpoint');
    if (ep != "") {
        _endpoint = ep;
        document.getElementById('endpoint').value = ep;
    }else{
        document.getElementById('endpoint').value = _endpoint;
    }

    var ex = getCookie('examplesrepo');
    if (ex != "") {
        _examples_repo = ex;
        document.getElementById('examples-repo').value = ex;
    }else{
        document.getElementById('examples-repo').value = _examples_repo;
    }

    fetchExamples();

    $('#poweredby').attr('href', _poweredByLink);
    $('#poweredby').text( _poweredByLabel);
}

function doQuery(url, sparql, callback) {

    service = new SPARQL.Service(url);
    service.setMethod('GET');
    if (_defaultGraph != "") {
        service.addDefaultGraph(_defaultGraph);
    }

    service.setRequestHeader('Accept', 'application/sparql-results+json,*/*');
    service.setOutput('json');

    busy = document.createElement('p');
    busy.className = 'busy';
    busy.appendChild(document.createTextNode('Executing query ...'));
    setResult(busy);
    service.query(sparql, {
            success: callback,
            failure: onFailure
    });
}

function onFailure(report) {
    var message = report.responseText.match(/<pre>([\s\S]*)<\/pre>/);
    if (message) {
        var pre = document.createElement('pre');
        pre.innerHTML = message[1];
        setResult(pre);
    } else {
        var div = document.createElement('div');
        div.innerHTML = report.responseText;
        setResult(div);
    }
}

function setResult(node) {
    display(node, 'result');
}

function display(node, whereID) {
    var where = document.getElementById(whereID);
    if (!where) {
        alert('ID not found: ' + whereID);
        return;
    }
    while (where.firstChild) {
        where.removeChild(where.firstChild);
    }
    if (node == null) return;
    where.appendChild(node);
}

function displayResult(json, resultTitle) {

    var div = document.createElement('div');
    var title = document.createElement('h3');
    title.appendChild(document.createTextNode(resultTitle));
    div.appendChild(title);

    if (json.results.bindings.length == 0) {
        var p = document.createElement('p');
        p.className = 'empty';
        p.appendChild(document.createTextNode('[no results]'));
        div.appendChild(p);
    } else {
        div.appendChild(jsonToHTML(json));
    }
    setResult(div);
}

function jsonToHTML(json) {

    var table = document.createElement('table');
    table.id = 'queryresults';
    table.className = 'table table-striped table-bordered';

    var thead = document.createElement('thead');
    var tr = document.createElement('tr');

    for (var i in json.head.vars) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(json.head.vars[i]));
        tr.appendChild(th);
    }
    thead.appendChild(tr);

    var tbody = document.createElement('tbody');

    for (var i in json.results.bindings) {
        var binding = json.results.bindings[i];
        var tr = document.createElement('tr');

        for (var v in json.head.vars) {
            td = document.createElement('td');
            var varName = json.head.vars[v];
            var node = binding[varName];

            td.appendChild(nodeToHTML(node, function(uri) { return escape(uri); }));

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function toQName(uri) {
    for (nsURI in _namespaces) {
        if (uri.indexOf(nsURI) == 0) {
            return _namespaces[nsURI] + ':' + uri.substring(nsURI.length);
        }
    }
    return null;
}

function toQNameOrURI(uri) {
    for (nsURI in _namespaces) {
        if (uri.indexOf(nsURI) == 0) {
            return _namespaces[nsURI] + ':' + uri.substring(nsURI.length);
        }
    }
    return '<' + uri + '>';
}

var xsdNamespace = 'http://www.w3.org/2001/XMLSchema#';
var numericXSDTypes = ['long', 'decimal', 'float', 'double', 'int', 'short', 'byte', 'integer',
        'nonPositiveInteger', 'negativeInteger', 'nonNegativeInteger', 'positiveInteger',
        'unsignedLong', 'unsignedInt', 'unsignedShort', 'unsignedByte'];
for (i in numericXSDTypes) {
    numericXSDTypes[i] =  xsdNamespace + numericXSDTypes[i];
}

function nodeToHTML(node, linkMaker) {
    if (!node) {
        var span = document.createElement('span');
        span.className = 'unbound';
        span.title = 'Unbound'
        span.appendChild(document.createTextNode('-'));
        return span;
    }
    if (node.type == 'uri') {
        var span = document.createElement('span');
        span.className = 'uri';
        var qname = toQName(node.value);
        var a = document.createElement('a');
        a.href = node.value;
        a.target = "_blank";

        if (qname) {
            a.appendChild(document.createTextNode(qname));
            span.appendChild(a);
        } else {
            a.appendChild(document.createTextNode(node.value));
            span.appendChild(a);
        }

        return span;
    }
    if (node.type == 'bnode') {
        return document.createTextNode('_:' + node.value);
    }
    if (node.type == 'literal') {
        var text = '"' + node.value + '"';
        if (node['xml:lang']) {
            text += '@' + node['xml:lang'];
        }
        return document.createTextNode(text);
    }
    if (node.type == 'typed-literal') {

        var text = '"' + node.value + '"';

        if (node.datatype) {
            text += '^^' + toQNameOrURI(node.datatype);
        }

        for (i in numericXSDTypes) {
            if (numericXSDTypes[i] == node.datatype) {
                var span = document.createElement('span');
                span.title = text;
                span.appendChild(document.createTextNode(node.value));
                return span;
            }
        }
        return document.createTextNode(text);
    }
    return document.createTextNode('???');
}

function exportResults(url, sparql, type, output) {

    service = new SPARQL.Service(url);
    service.setMethod('GET');
    if (_defaultGraph != "") {
        service.addDefaultGraph(_defaultGraph);
    }

    if(type === "csv"){
        service.setRequestHeader('Accept', 'application/sparql-results+json,*/*');
        service.setOutput('json');
    }else{
        service.setRequestHeader('Accept', 'application/sparql-results+'+type+',*/*');
        service.setOutput(type);
    }

    service.query(sparql, {
            success: function(json) { renderOutput(json, type); },
            failure: onExportFailure
    });
}

function renderOutput(results, type){

    if(type === 'csv'){
        exportCSV(results);
    }else if(type === 'json'){

        var download_link = document.createElement('a');
        download_link.setAttribute('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(JSON.stringify(results)));
        download_link.setAttribute('download', "snorql-json-"+(new Date().getTime() / 1000)+".json");
        download_link.click();

    }else if(type === 'xml'){

        var download_link = document.createElement('a');
        download_link.setAttribute('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(results));
        download_link.setAttribute('download', "snorql-xml-"+(new Date().getTime() / 1000)+".xml");
        download_link.click();
    }
}

function exportCSV(json){

    if (typeof json !== 'undefined') {

        var csv = "";

        for (var i in json.head.vars) {

            csv += formatData(json.head.vars[i]);

            if(i != json.head.vars.length){
                csv += ',';
            }
        }

        csv += "\n";

        for (var i in json.results.bindings) {

            var binding = json.results.bindings[i];

            for (var v in json.head.vars) {

                var varName = json.head.vars[v];
                var node = binding[varName];

                if (typeof node !== 'undefined') {
                    csv += formatData(node.value);
                }else{
                    csv += '' ;
                }

                if(v != json.head.vars.length){
                    csv += ',';
                }

            }
            csv += "\n";
        }

        var download_link = document.createElement('a');
        download_link.setAttribute('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(csv));
        download_link.setAttribute('download', "snorql-csv-"+(new Date().getTime() / 1000)+".csv");
        download_link.click();

    }else{
        alert('Please execute a query fist then try to export');
    }
}

function formatData(input) {
    // RFC4180
    var regexp = new RegExp(/["]/g);
    var output = input.replace(regexp, '""');
    //HTML
    var regexp = new RegExp(/\<[^\<]+\>/g);
    var output = output.replace(regexp, "");
    output = output.replace(/&nbsp;/gi,' '); //replace &nbsp;
    if (output == "") return '';
    return '"' + output.trim() + '"';
}

function onExportFailure(){
    alert("Export failed");
}