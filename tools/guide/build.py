"""Yakuniy video: python3 tools/guide/build.py <til> ...
   work/out/<til>-phone.webm + <til>-desktop.webm + work/tts/<til>/*.mp3 → work/final/kabinet-<til>.mp4, work/final/<til>.json (boblar)"""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__)); H = os.path.join(D, 'work')
S = json.loads(subprocess.check_output(['node', '-e', "const S=require('%s/script.js');console.log(JSON.stringify({CH:S.CH}))" % D]).decode())
FPS = 20

def ts(x):
    x = max(0, x); h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return '%d:%02d:%05.2f' % (h, m, s)

def esc(t):
    return t.replace('\\', '\\\\').replace('{', '(').replace('}', ')').replace('\n', ' ')

def ass(seg, J, path, lang):
    """phone: matn o'ng panelda (telefon yonida); desktop: pastda, yarim shaffof fonda"""
    head = ('[Script Info]\nScriptType: v4.00+\nPlayResX: 1280\nPlayResY: 720\nWrapStyle: 0\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\n'
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            'Style: Sub,Inter,24,&H00E4EFF3,&H00E4EFF3,&H22171E06,&H00000000,0,0,0,0,100,100,0,0,3,11,0,2,150,150,22,1\n'
            'Style: Side,Inter,31,&H00E4EFF3,&H00E4EFF3,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,4,520,70,0,1\n'
            'Style: Title,Inter,40,&H0086C4DC,&H0086C4DC,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,0,0,7,520,70,170,1\n\n'
            '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n')
    ev = []; B = J['beats']
    for k, b in enumerate(B):
        end = (B[k + 1]['t'] - 0.05) if k + 1 < len(B) else b['t'] + b['dur'] + 1.2
        ev.append('Dialogue: 0,%s,%s,%s,,0,0,0,,{\\fad(150,120)}%s' % (ts(b['t']), ts(end), 'Side' if seg == 'phone' else 'Sub', esc(b['text'])))
    if seg == 'phone':
        title = S['CH']['login-phone'][lang]
        ev.append('Dialogue: 0,%s,%s,Title,,0,0,0,,{\\fad(300,0)}%s' % (ts(0.3), ts(J['dur']), esc(title)))
    open(path, 'w', encoding='utf-8').write(head + '\n'.join(ev) + '\n')

def audio(lang, seg, J, path):
    cmd = ['ffmpeg', '-v', 'error', '-y']; fl = []
    for k, b in enumerate(J['beats']):
        cmd += ['-i', os.path.join(H, 'tts', lang, '%s-%02d.mp3' % (seg, b['i']))]
        d = int(round(b['t'] * 1000)); fl.append('[%d:a]aresample=48000,adelay=%d|%d[a%d]' % (k, d, d, k))
    n = len(J['beats'])
    fl.append(''.join('[a%d]' % k for k in range(n)) + 'amix=inputs=%d:normalize=0:dropout_transition=0,apad,atrim=0:%.3f[out]' % (n, J['dur']))
    cmd += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ac', '1', '-c:a', 'pcm_s16le', path]
    subprocess.check_call(cmd)

def enc():
    return ['-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-g', str(FPS * 4),
            '-c:a', 'aac', '-b:a', '80k', '-ac', '1', '-ar', '48000', '-movflags', '+faststart']

def build(lang):
    T = os.path.join(H, 'tmp', lang); os.makedirs(T, exist_ok=True); F = os.path.join(H, 'final'); os.makedirs(F, exist_ok=True)
    parts, chapters, off = [], [], 0.0
    for seg in ('phone', 'desktop'):
        J = json.load(open(os.path.join(H, 'out', '%s-%s.json' % (lang, seg))))
        a, s, o = os.path.join(T, seg + '.wav'), os.path.join(T, seg + '.ass'), os.path.join(T, seg + '.mp4')
        ass(seg, J, s, lang); audio(lang, seg, J, a)
        src = os.path.join(H, 'out', '%s-%s.webm' % (lang, seg))
        if seg == 'phone':
            vf = '[1:v]scale=307:664:flags=lanczos,setsar=1[ph];[0:v][ph]overlay=150:28:shortest=1,fps=%d,subtitles=%s,fade=t=in:st=0:d=0.6[v]' % (FPS, s)
            cmd = ['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', str(FPS), '-i', os.path.join(H, 'bg_phone.png'), '-i', src, '-i', a,
                   '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-t', '%.3f' % J['dur']] + enc() + [o]
        else:
            vf = '[0:v]fps=%d,scale=1280:720,setsar=1,subtitles=%s,fade=t=in:st=0:d=0.4[v]' % (FPS, s)
            cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-i', a, '-filter_complex', vf, '-map', '[v]', '-map', '1:a', '-t', '%.3f' % J['dur']] + enc() + [o]
        subprocess.check_call(cmd)
        d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', o]).decode())
        for c in J['chapters']:
            chapters.append({'id': c['id'], 't': round(off + (0 if seg == 'phone' and c['id'] == 'login-phone' else c['t']), 1), 'title': S['CH'][c['id']][lang]})
        parts.append(o); off += d
    lst = os.path.join(T, 'list.txt'); open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
    dst = os.path.join(F, 'kabinet-%s.mp4' % lang)
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', dst])
    json.dump({'dur': round(off, 1), 'ch': chapters}, open(os.path.join(F, lang + '.json'), 'w'), ensure_ascii=False)
    print(lang, '%.1f min' % (off / 60), '%.1f MB' % (os.path.getsize(dst) / 1048576))

for l in sys.argv[1:]: build(l)
