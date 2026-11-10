#!/bin/bash
# ART HOUSE — kabinet video-yo'riqnomasini qayta yaratish (8 til, ovozli).
# Talablar: node + playwright (chromium), python3 + edge-tts, ffmpeg (libass bilan).
# Ishga tushirish: tools/guide/run.sh   → guide/kabinet-<til>.mp4 va js/guide-chapters.js yangilanadi.
set -e
cd "$(dirname "$0")"; ROOT=$(cd ../.. && pwd); mkdir -p work/log
( cd "$ROOT" && python3 -m http.server 8765 >/dev/null 2>&1 & echo $! > work/http.pid )
trap 'kill $(cat work/http.pid) 2>/dev/null' EXIT
sleep 1
node -e "const S=require('./script.js');const o={voices:S.VOICES,items:[]};for(const l of S.LANGS){S.PHONE.forEach((b,i)=>o.items.push({l,seg:'phone',i,text:b.s[l]}));S.DESKTOP.forEach((b,i)=>o.items.push({l,seg:'desktop',i,text:b.s[l]}))}require('fs').mkdirSync('work/tts',{recursive:true});require('fs').writeFileSync('work/tts/items.json',JSON.stringify(o))"
python3 tts.py
node bg.js
{ for l in uz ru en fr it es de tr; do echo "$l desktop"; echo "$l phone"; done; } | \
  xargs -P 3 -L 1 sh -c 'node rec.js $0 $1 > work/log/$0-$1.log 2>&1; tail -1 work/log/$0-$1.log'
python3 build.py uz ru en fr it es de tr
mkdir -p "$ROOT/guide" && cp work/final/kabinet-*.mp4 "$ROOT/guide/"
python3 chapters.py "$ROOT/js/guide-chapters.js"
