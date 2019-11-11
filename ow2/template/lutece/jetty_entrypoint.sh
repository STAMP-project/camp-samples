#!/bin/bash


JAVA_OPTIONS=('-Dorg.eclipse.jetty.annotations.AnnotationParser.LEVEL=OFF'
              '-Xmx512m')

cd ${JETTY_HOME} && java ${JAVA_OPTIONS[@]} -jar start.jar

