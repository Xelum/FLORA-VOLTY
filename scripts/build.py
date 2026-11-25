import base64,json,mimetypes
from pathlib import Path
d=Path('dist');assets={}
for p in [*d.glob('*.html'),*d.glob('*.js'),*d.glob('*.css'),*d.joinpath('assets').glob('*'),Path('worker/vendite.html')]:
 k='/'+str(p.relative_to(d)) if d in p.parents else '/vendite'
 assets[k]=[mimetypes.guess_type(str(p))[0] or 'application/octet-stream',base64.b64encode(p.read_bytes()).decode()]
(d/'server').mkdir(exist_ok=True);(d/'server/index.js').write_text('const files='+json.dumps(assets,separators=(',',':'))+';\n'+Path('worker/router.mjs').read_text())
