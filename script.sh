#!/bin/bash

if [[ -z "${SNORQL_ENDPOINT}" ]]; then
  echo "SNORQL_ENDPOINT is not set"
else
  sed -i -e 's#var _endpoint = '".*"';#var _endpoint = "'"${SNORQL_ENDPOINT}"'";#g' /usr/local/apache2/htdocs/assets/js/snorql.js
fi

if [[ -z "${SNORQL_EXAMPLES_REPO}" ]]; then
  echo "SNORQL_EXAMPLES_REPO is not set"
else
  sed -i -e 's#var _examples_repo = '".*"';#var _examples_repo = "'"${SNORQL_EXAMPLES_REPO}"'";#g' /usr/local/apache2/htdocs/assets/js/snorql.js
fi

if [[ -z "${DEFAULT_GRAPH}" ]]; then
  echo "DEFAULT_GRAPH is not set"
else
  sed -i -e 's#var _defaultGraph = '".*"';#var _defaultGraph = "'"${DEFAULT_GRAPH}"'";#g' /usr/local/apache2/htdocs/assets/js/snorql.js
fi

if [[ -z "${SNORQL_TITLE}" ]]; then
  echo "SNORQL_TITLE is not set"
else
  sed -i -e 's#<title>'".*"'</title>#<title>'"${SNORQL_TITLE}"'</title>#g' /usr/local/apache2/htdocs/index.html
fi
