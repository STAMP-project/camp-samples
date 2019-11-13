#
# Check whether the service is ready and replies to HTTP requests
#

URL="http://lutece:8080/site-forms-demo"
EXPECTED=302

set -x

if [ $(curl --silent --output /dev/null --write-out "%{http_code}\n" ${URL}) -eq ${EXPECTED} ]
then
    exit 0
else
    exit 1
fi
