## Snorql - Extended Edition

Simple SPARQL explorer based on the original idea of [kurtjx/SNORQL](https://github.com/kurtjx/SNORQL) and adapted from the fork [eccenca/SNORQL](https://github.com/eccenca/SNORQL) 

The purpose of this project is to develop a fully new UI implementation for Snorql that uses the latest web standards for HTML5, CSS3 and JQuery.

Live Demo of Snorql extended:  [Demo 1](https://wikipathways.github.io/snorql-extended) 	 [Demo 2](https://ammar257ammar.github.io/snorql-extended)



## Features

1.  Modern web UI built with [HTML5](https://en.wikipedia.org/wiki/HTML5), [Bootstrap 3.3.7](https://getbootstrap.com/docs/3.3/getting-started/)  and [JQuery](https://jquery.com/).
2.  Responsive design with wonderful look on mobiles and tablets.
3.  Text editor [CodeMirror](https://codemirror.net/) for the SPARQL query with awesome features like SPARQL syntax highlighter, line numbering and bracket matching.
4.  SPARQL examples panel that can fetch SPARQL queries (.rq extension) from any GitHub repository on fly and execute them against the SPARQL endpoint of your choice
5.  No need for any backend programming language!! it is totally a front end application.



## GitHub Examples URL

- If you have the SPARQL queries directly inside the repo, then use the full the URL of the repo like the following:

  [https://github.com/wikipathways/SPARQLQueries](https://github.com/wikipathways/SPARQLQueries)



- But in case the SPARQL queries are inside a folder in the repository, then you need to provide a GitHub API URL for that folder and that is constructed as follows:

  If the URL of the folder of the queries is this (for example):

  https://github.com/egonw/SARS-CoV-2-Queries/tree/master/sparql

  Then the URL template you should use is:

  https://api.github.com/repos/{OWNER_USER}/{REPOSITORY_NAME}/contents/{FOLDER_PATH}

  And the final URL becomes like this:

  https://api.github.com/repos/egonw/SARS-CoV-2-Queries/contents/sparql


## Get a URL for a query with JavaScript

- if you want to get a URL for your query (automatically generated for example) without using the permanent link, then you can use the following JavaScript code:

```javascript
// the SPARQL endpoint URL followed by the query variable 'q'
let endpoint = "https://sparql.wikipathways.org/?q=";

// The SPARQL query itself
let sparql = `SELECT DISTINCT ?dataset (str(?titleLit) as ?title) ?date ?license 
WHERE {
   ?dataset a void:Linkset ;
   dcterms:title ?titleLit .
   OPTIONAL {
	 ?dataset dcterms:license ?license ;
	   pav:createdOn ?date .
   }
}`;
			
// create the URL from the endpoint URL and the URI-encoded query string
let encodedQueryUrl = endpoint + encodeURI(sparql);

// now, encodedQueryUrl can be used for your own purpose
```

