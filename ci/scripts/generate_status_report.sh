#!/usr/bin/env bash

echo "build url: ${BUILD_URL}"

#generates execution-status.properties
docker run --rm -t -v `pwd`:`pwd` --user `id -u`:`id -g` -e RPT_API_URL=${RPT_API_URL} -e RPT_GUI_URL=${RPT_GUI_URL} \
armdocker.rnd.ericsson.se/proj-eric-oss-drop/k6-reporting-tool-cli:latest testware-cli \
get-status -u ${BUILD_URL} \
--path `pwd`

#generates execution-status.json
docker run --rm -t -v `pwd`:`pwd` --user `id -u`:`id -g` -e RPT_API_URL=${RPT_API_URL} -e RPT_GUI_URL=${RPT_GUI_URL} \
armdocker.rnd.ericsson.se/proj-eric-oss-drop/k6-reporting-tool-cli:latest testware-cli \
wait-testware -u ${BUILD_URL} \
--path `pwd`
