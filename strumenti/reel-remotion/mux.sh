#!/bin/sh
# sh mux.sh out/reel.mp4  -> joins out/video.mp4 (silent) + out/mix.wav
set -e
ffmpeg -v error -y -i out/video.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$1"
ffprobe -v error -show_entries format=duration,size -of compact "$1"
