## Snorql - Extended Edition

Simple SPARQL explorer based on the original idea of [kurtjx/SNORQL](https://github.com/kurtjx/SNORQL) and adapted from the fork [eccenca/SNORQL](https://github.com/eccenca/SNORQL) 

The purpose of this project is to develop a fully new UI implementation for Snorql that uses the latest web standards for HTML5, CSS3 and JQuery.

Live Demo of Snorql extended:  https://ammar257ammar.github.io/snorql-extended



## Features

1.  Modern web UI built with [HTML5](https://en.wikipedia.org/wiki/HTML5), [Bootstrap 3.3.7](https://getbootstrap.com/docs/3.3/getting-started/)  and [JQuery](https://jquery.com/).
2.  Responsive design with wonderful look on mobiles and tablets.
3.  Text editor [CodeMirror](https://codemirror.net/) for the SPARQL query with awesome features like SPARQL syntax highlighter, line numbering and bracket matching.
4.  SPARQL examples panel that can fetch SPARQL queries (.rq extension) from any Github repository on fly and execute them against the SPARQL endpoint of your choice
5.  No need for any backend programming language!! it is totally a front end application.



## Github Examples URL

- If you have the SPARQL queries directly inside the repo, then use the full the URL of the repo like the following:

  https://github.com/ammar257ammar/snorql-extended-sparql-examples



- But in case the SPARQL queries are inside a folder in the repository, then you need to provide a Github API URL for that folder and that is constructed as follows:

  If the URL of the folder of the queries is this (for example):

  https://github.com/egonw/SARS-CoV-2-Queries/tree/master/sparql

  Then the URL template you should use is:

  https://api.github.com/repos/{OWNER_USER}/{REPOSITORY_NAME}/contents/{FOLDER_PATH}

  And the final URL becomes like this:

  https://api.github.com/repos/egonw/SARS-CoV-2-Queries/contents/sparql



