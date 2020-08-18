
(function ($) {

jQuery(document).ready(function() {

        jQuery("#query-button").on("click",function(event){
            event.preventDefault();

            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;
            doQuery(jQuery("#endpoint").val(), query, function(json) { displayResult(json, "SPARQL results"); });

		});

		jQuery("#fetch").on("click",function(){
            fetchExamples();
		});

		jQuery("#examples").on("click","li",function(e){

			  jQuery.ajax({
				url: jQuery(this).children().first().html(),
				dataType: 'html',
				success:function(response){
				  editor.getDoc().setValue(response);
				}
			  });
		});

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
} );
})(jQuery);
