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

(function ($) {

jQuery(document).ready(function() {

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

        jQuery("#exportCSV").on("click",function(){

            if(jQuery("#queryresults").length){
                jQuery("#queryresults").table2CSV();
            }else{
              alert("Try to export after getting query results, nothing to export for now!");
            }
        });
} );
})(jQuery);
