
(function ($) {

jQuery(document).ready(function() {

        var cookieDecision = getCookie('cookieDecision');

        if (cookieDecision == "" || cookieDecision == "reject") {

            $('#cookieModal').modal();

            $('#cookieModal button.btn-secondary').on('click', function (e) {
                setCookie("cookieDecision", "reject");
                window.location.href = "http://wikipathways.org";
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
            doQuery(jQuery("#endpoint").val(), query, function(json) { displayResult(json, "SPARQL results"); });

		});

		jQuery("#fetch").on("click",function(){
            fetchExamples();
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
          $('#search-output').html('');
        });

        //---------------- Search funcionality ends ------------------------

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

        jQuery("#generate-permalink").on("click",function(e){

            e.preventDefault();

            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;

            query = "?q="+encodeURIComponent(query);

            var url = window.location.href.split('?')[0] + query;

            url = "http://sparql.wikipathways.org"+query;
            var accessToken = "b0021fe4839aefbc4e7967b3578443d9ea6e89bf";

            var params = {
                "long_url" : url
            };

            console.log(url);
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
                console.log(data.link);
                $('#permalink-url').html("<a href=\""+data.link+"\" target=\"_blank\">"+data.link+"</a>");
                $('#permalinkModal').modal();
            }).fail(function(data) {
                console.log(data);
            });
        });
    });
})(jQuery);
