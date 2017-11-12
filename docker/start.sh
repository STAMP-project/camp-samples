#!/bin/bash

mkdir ./workingdir/build
mkdir ./workingdir/out

python ozepy/stamp/dockerbuild.py -d ./workingdir
cp ./workingdir/out/ampimages.yml ./workingdir/ampimages.yml
cp ./workingdir/out/genimages.yml ./workingdir/genimages.yml

python ozepy/stamp/dockercompose.py -d ./workingdir
cp ./workingdir/out/ampcompose.yml ./workingdir/ampcompose.yml

python conf-test-ampli/dockergen/src/dockerfilegen.py -i ./workingdir/genimages.yml
python conf-test-ampli/dockergen/src/composegen.py -i ./workingdir/ampcompose.yml

echo "Searching finished."
echo "Build all images by: bash <your_dir>/build/build.sh"
echo "Launch one of the configurations by: docker-compose <your_dir>/docker-compose/docker-comopose-<number>.yml up"