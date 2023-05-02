#!/bin/bash

convert -density 300 $1 -resize 1024x1024 -background white -flatten $2
