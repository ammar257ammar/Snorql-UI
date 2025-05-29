
(function ($) {

jQuery(document).ready(function() {

        var cookieDecision = getCookie('cookieDecision');

        if (cookieDecision == "" || cookieDecision == "reject") {

            $('#cookieModal').modal();

            $('#cookieModal button.btn-secondary').on('click', function (e) {
                setCookie("cookieDecision", "reject");
		var pathQueryIndex = window.location.href.indexOf("?")
		var path = window.location.href
		
		if(pathQueryIndex != -1){
		  var newPath = window.location.href.substring(0,pathQueryIndex)
		  window.location.href = newPath.endsWith("/") ? newPath.slice(0,-1) +"/cookies.html" : newPath +"/cookies.html";
		}else{
		  window.location.href = path.endsWith("/") ? path.slice(0,-1) +"/cookies.html" : path +"/cookies.html";	
		}
            });

            $("#cookieModal button.btn-primary").on('click', function(){
                setCookie("cookieDecision", "accept");
                $('#cookieModal').modal('hide');
            });
        }

        jQuery("#query-button").on("click",function(event){
            event.preventDefault();

            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;

            var queryEncoded = "?q="+encodeURIComponent(query)+"&endpoint="+encodeURIComponent(jQuery("#endpoint").val().trim());
            var url = window.location.href.split('?')[0] + queryEncoded;

            window.history.replaceState(null, "", url);

            doQuery(jQuery("#endpoint").val(), query, function(json) { displayResult(json, "SPARQL results"); });

		});

		jQuery("#fetch").on("click",function(){
            fetchExamples();
            fetchExamples("-fs");
		});

        //---------------- Populate query from URL (if available) -----------------------

        function findGetParameter(parameterName) {
            var result = null,
                tmp = [];
            location.search
                .substr(1)
                .split("&")
                .forEach(function (item) {
                  tmp = item.split("=");
                  if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
                });
            return result;
        }

        var query = findGetParameter("q");
        if(query != null){
            editor.getDoc().setValue(query);
        }

        //----------------  END OF Populate query from URL (if available) -----------------------

		//---------------- Search funcionality starts ------------------------

        var search = function(e) {
          var pattern = $('#input-search').val();
          var options = {
            ignoreCase: true,
            exactMatch: false,
            revealResults: true
          };
          var results = $('#examples').treeview('search', [ pattern, options ]);
        }

        $('#btn-search').on('click', search);

        $('#btn-clear-search').on('click', function (e) {
          $('#examples').treeview('clearSearch');
          $('#input-search').val('');
        });

        //---------------- Search funcionality ends ------------------------

        //---------------- Search funcionality Fullscreen starts ------------------------

        var searchfs = function(e) {
          var pattern = $('#input-search-fs').val();
          var options = {
            ignoreCase: true,
            exactMatch: false,
            revealResults: true
          };
          var results = $('#examples-fs').treeview('search', [ pattern, options ]);
        }

        $('#btn-search-fs').on('click', searchfs);

        $('#btn-clear-search-fs').on('click', function (e) {
          $('#examples-fs').treeview('clearSearch');
          $('#input-search-fs').val('');
        });

        //---------------- Search funcionality Fullscreen ends ------------------------

		jQuery("#reset-button").on("click",function(){
            editor.getDoc().setValue("");
        });

        jQuery("#export-csv").on("click",function(){
            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;
            exportResults(jQuery("#endpoint").val(), query, "csv");
        });

        jQuery("#export-json").on("click",function(){
            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;
            exportResults(jQuery("#endpoint").val(), query, "json");
        });

        jQuery("#export-xml").on("click",function(){
            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;
            exportResults(jQuery("#endpoint").val(), query, "xml");
        });

        jQuery("#enter-fullscreen").on("click",function(){
            document.getElementById("fullscreen-navbar").style.display="block";
            document.getElementById("footer").style.display="none";
            editor.setOption("fullScreen", !editor.getOption("fullScreen"));
        });

        jQuery("#exit-fullscreen").on("click",function(){
            document.getElementById("fullscreen-navbar").style.display="none";
            document.getElementById("footer").style.display="block";
            if (editor.getOption("fullScreen")) editor.setOption("fullScreen", false);
        });

        jQuery("#examples-fullscreen").on("click",function(){
            $('#examplesModal').modal();
        });

        jQuery("#show-prefixes").on("click",function(event){
            event.preventDefault();
            prefixesUrl = jQuery("#endpoint").val().replace(/\/$/, "")+"?help=nsdecl";

            fetch(prefixesUrl)
                .then((response) => response.text())
                .then((html) => {
                    document.getElementById("prefixesModalBody").innerHTML = $(html).find('#help > table').prop('outerHTML');
                })
                .catch((error) => {
                    document.getElementById("prefixesModalBody").innerHTML = "<h4>Could not obtain prefix information. This functionality works with Virtuoso-based SPARQL endpoints only.</h4>";
                });

            $('#prefixesModal').modal().find('#prefixesModalBody');
        });

        jQuery("#generate-permalink").on("click",function(e){

            e.preventDefault();

            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;
	    query = query.trim()
            query = "?q="+encodeURIComponent(query)+"&endpoint="+encodeURIComponent(jQuery("#endpoint").val().trim());

            var url = window.location.href.split('?')[0] + query;

            var accessToken = "b0021fe4839aefbc4e7967b3578443d9ea6e89bf";
            var params = {
                "long_url" : url.trim()
            };

            $.ajax({
                url: "https://api-ssl.bitly.com/v4/shorten",
                cache: false,
                dataType: "json",
                method: "POST",
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                },
                data: JSON.stringify(params)
            }).done(function(data) {
                $('#permalink-url').html("<a href=\""+data.link+"\" target=\"_blank\">"+data.link+"</a>");
                $('#permalinkModal').modal();
            }).fail(function(data) {
                console.log(data);
            });
        });
    });
})(jQuery);
