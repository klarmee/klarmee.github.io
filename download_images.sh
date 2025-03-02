#!/bin/bash

# Read the URL file and download each image
while IFS= read -r url; do
    # Extract the filename from the URL and use curl to download it
    filename=$(basename "$url")
    curl -O "$url"
done < urls.txt
