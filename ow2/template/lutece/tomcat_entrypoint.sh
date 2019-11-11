#!/bin/bash

# Start Tomcat
java \
    -Djava.util.logging.config.file=${TOMCAT_HOME}/conf/logging.properties \
    -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager \
    -Djava.awt.headless=true \
    -Xmx512m \
    -XX:+UseConcMarkSweepGC \
    -Djdk.tls.ephemeralDHKeySize=2048 \
    -Djava.endorsed.dirs=${TOMCAT_HOME}/endorsed\
    -classpath ${TOMCAT_HOME}/bin/bootstrap.jar:${TOMCAT_HOME}/bin/tomcat-juli.jar \
    -Dcatalina.base=${TOMCAT_HOME} \
    -Dcatalina.home=${TOMCAT_HOME} \
    -Djava.io.tmpdir=${TOMCAT_TMP} \
    org.apache.catalina.startup.Bootstrap start
