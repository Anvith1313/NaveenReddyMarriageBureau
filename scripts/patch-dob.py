"""
Replaces DateWheelPicker with dark-mode CalPicker in both HTML files.
Run: python scripts/patch-dob.py
"""
import re

# ── New CalPicker CSS (injected by JS, no static CSS needed in <style>) ──────
# The old .dwp-* CSS lines are replaced with a single comment placeholder.
NEW_CSS_COMMENT = "/* CalPicker styles injected by JS */"

# ── New CalPicker JS ──────────────────────────────────────────────────────────
NEW_JS = (
    "function CalPicker(container,opts){\n"
    "  opts=opts||{};this.c=container;\n"
    "  this.minY=opts.minYear||1940;this.maxY=opts.maxYear||(new Date().getFullYear()-18);\n"
    "  this.onCh=opts.onChange||function(){};\n"
    "  this._MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];\n"
    "  this._DAYS=['Su','Mo','Tu','We','Th','Fr','Sa'];\n"
    "  var init=opts.value instanceof Date?opts.value:new Date(1990,0,1);\n"
    "  this._sel=null;this._vY=init.getFullYear();this._vM=init.getMonth();\n"
    "  this._injectStyles();this._render();\n"
    "}\n"
    "CalPicker.prototype._injectStyles=function(){\n"
    "  if(document.getElementById('calpicker-css'))return;\n"
    "  var s=document.createElement('style');s.id='calpicker-css';\n"
    "  s.textContent='.cp-root{background:#2c2c2c;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.5);font-family:\"EB Garamond\",\"Cormorant Garamond\",serif;width:100%;max-width:320px;}'\n"
    "    +'.cp-hdr{background:#1e1e1e;padding:12px 16px 10px;display:flex;align-items:center;justify-content:space-between;}'\n"
    "    +'.cp-month-yr{font-size:0.95rem;color:#e8e8e8;font-weight:500;letter-spacing:0.02em;font-family:\"Cinzel\",serif;}'\n"
    "    +'.cp-arrows{display:flex;gap:2px;}'\n"
    "    +'.cp-arrow{background:none;border:none;color:rgba(255,255,255,0.65);cursor:pointer;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;transition:background 0.15s;padding:0;}'\n"
    "    +'.cp-arrow:hover{background:rgba(255,255,255,0.12);color:#fff;}'\n"
    "    +'.cp-grid{padding:8px 12px 4px;}'\n"
    "    +'.cp-day-hdrs{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px;}'\n"
    "    +'.cp-dh{text-align:center;font-size:0.62rem;color:rgba(255,255,255,0.4);padding:3px 0;font-family:\"Cinzel\",serif;letter-spacing:0.04em;}'\n"
    "    +'.cp-days-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;}'\n"
    "    +'.cp-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:none;border:none;color:rgba(255,255,255,0.82);font-size:0.87rem;cursor:pointer;border-radius:50%;transition:background 0.12s;font-family:\"EB Garamond\",\"Cormorant Garamond\",serif;padding:0;}'\n"
    "    +'.cp-day:hover:not(:disabled):not(.cp-empty){background:rgba(255,255,255,0.1);}'\n"
    "    +'.cp-day.cp-today{border:1.5px solid #B8892A;color:#f0c04a;}'\n"
    "    +'.cp-day.cp-sel{background:#7B1F2E!important;color:#fff8dc!important;border:none!important;font-weight:600;}'\n"
    "    +'.cp-day:disabled,.cp-day.cp-empty{color:transparent;cursor:default;pointer-events:none;}'\n"
    "    +'.cp-footer{display:flex;justify-content:space-between;padding:6px 14px 12px;border-top:1px solid rgba(255,255,255,0.08);}'\n"
    "    +'.cp-btn-clear{background:none;border:none;cursor:pointer;font-family:\"Cinzel\",serif;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;padding:6px 10px;border-radius:6px;color:rgba(255,255,255,0.45);transition:background 0.15s,color 0.15s;}'\n"
    "    +'.cp-btn-clear:hover{color:rgba(255,255,255,0.9);background:rgba(255,255,255,0.07);}'\n"
    "    +'.cp-btn-today{background:none;border:none;cursor:pointer;font-family:\"Cinzel\",serif;font-size:0.52rem;letter-spacing:0.1em;text-transform:uppercase;padding:6px 10px;border-radius:6px;color:#B8892A;transition:background 0.15s;}'\n"
    "    +'.cp-btn-today:hover{background:rgba(184,137,42,0.12);}';\n"
    "  document.head.appendChild(s);\n"
    "};\n"
    "CalPicker.prototype._dim=function(y,m){return new Date(y,m+1,0).getDate();};\n"
    "CalPicker.prototype.setMaxYear=function(y){this.maxY=y;if(this._vY>y)this._vY=y;this._render();};\n"
    "CalPicker.prototype._render=function(){\n"
    "  var self=this;\n"
    "  var today=new Date(),tY=today.getFullYear(),tM=today.getMonth(),tD=today.getDate();\n"
    "  var firstDay=new Date(self._vY,self._vM,1).getDay(),numDays=self._dim(self._vY,self._vM);\n"
    "  var cells='';\n"
    "  for(var i=0;i<firstDay;i++)cells+='<button type=\"button\" class=\"cp-day cp-empty\" disabled></button>';\n"
    "  for(var d=1;d<=numDays;d++){\n"
    "    var isT=(self._vY===tY&&self._vM===tM&&d===tD);\n"
    "    var isS=self._sel&&self._sel.getFullYear()===self._vY&&self._sel.getMonth()===self._vM&&self._sel.getDate()===d;\n"
    "    cells+='<button type=\"button\" class=\"cp-day'+(isT?' cp-today':'')+(isS?' cp-sel':'')+'\" data-d=\"'+d+'\">'+d+'</button>';\n"
    "  }\n"
    "  self.c.innerHTML='<div class=\"cp-root\"><div class=\"cp-hdr\"><span class=\"cp-month-yr\">'+self._MONTHS[self._vM]+', '+self._vY+'</span><div class=\"cp-arrows\"><button type=\"button\" class=\"cp-arrow cp-prev\" aria-label=\"Prev\">&#8593;</button><button type=\"button\" class=\"cp-arrow cp-next\" aria-label=\"Next\">&#8595;</button></div></div><div class=\"cp-grid\"><div class=\"cp-day-hdrs\">'+self._DAYS.map(function(x){return'<div class=\"cp-dh\">'+x+'</div>';}).join('')+'</div><div class=\"cp-days-grid\">'+cells+'</div></div><div class=\"cp-footer\"><button type=\"button\" class=\"cp-btn-clear\">Clear</button><button type=\"button\" class=\"cp-btn-today\">Today</button></div></div>';\n"
    "  self.c.querySelector('.cp-prev').addEventListener('click',function(){if(self._vM===0){self._vY--;self._vM=11;}else self._vM--;self._render();});\n"
    "  self.c.querySelector('.cp-next').addEventListener('click',function(){if(self._vM===11){self._vY++;self._vM=0;}else self._vM++;if(self._vY>self.maxY)self._vY=self.maxY;self._render();});\n"
    "  self.c.querySelector('.cp-btn-clear').addEventListener('click',function(){self._sel=null;self._render();self.onCh(null);});\n"
    "  self.c.querySelector('.cp-btn-today').addEventListener('click',function(){var t=new Date();self._vY=t.getFullYear();self._vM=t.getMonth();self._sel=new Date(t.getFullYear(),t.getMonth(),t.getDate());self._render();self.onCh(self._sel);});\n"
    "  self.c.querySelector('.cp-days-grid').addEventListener('click',function(e){var btn=e.target.closest&&e.target.closest('[data-d]');if(!btn)return;var d=parseInt(btn.dataset.d);self._sel=new Date(self._vY,self._vM,d);self.onCh(self._sel);self._render();});\n"
    "};\n"
    "CalPicker.prototype.getValue=function(){return this._sel||new Date(this._vY,this._vM,1);};\n"
    "CalPicker.prototype.setValue=function(date){if(!date||isNaN(date.getTime()))return;this._sel=new Date(date.getFullYear(),date.getMonth(),date.getDate());this._vY=date.getFullYear();this._vM=date.getMonth();this._render();};\n"
    "window.CalPicker=CalPicker;"
)

# ── CSS lines to replace (line numbers are 1-based) ──────────────────────────
# Both files: lines matching .dwp-root through .dwp-sel-bar (10 lines)
DWP_CSS_PATTERN = re.compile(
    r'\.dwp-root\{[^\n]*\}\n'
    r'\.dwp-row\{[^\n]*\}\n'
    r'\.dwp-col\{[^\n]*\}\n'
    r'\.dwp-col:last-child\{[^\n]*\}\n'
    r'\.dwp-col:active\{[^\n]*\}\n'
    r'\.dwp-col\[data-wc=month\]\{[^\n]*\}\n'
    r'\.dwp-col\[data-wc=year\]\{[^\n]*\}\n'
    r'\.dwp-mask-t\{[^\n]*\}\n'
    r'\.dwp-mask-b\{[^\n]*\}\n'
    r'\.dwp-sel-bar\{[^\n]*\}'
)

# ── JS block pattern: WheelCol + DateWheelPicker through window.DateWheelPicker
DWP_JS_PATTERN = re.compile(
    r'function WheelCol\(el,items,initIdx,cb\)\{.*?window\.DateWheelPicker=DateWheelPicker;',
    re.DOTALL
)

# ── _syncMaxYear patch for index.html ────────────────────────────────────────
SYNC_OLD = re.compile(
    r'function _syncMaxYear\(\)\{if\(window\._dobWP\)\{var my=_maxYr\(\);if\(window\._dobWP\._yc&&window\._dobWP\._years\[0\]!==my\)\{[^}]*\}[^}]*\}\}'
)
SYNC_NEW = "function _syncMaxYear(){if(window._dobWP){window._dobWP.setMaxYear(_maxYr());}}"

# ── DateWheelPicker → CalPicker in init calls ────────────────────────────────
def patch_file(path, is_main=False):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)

    # 1. Replace dwp CSS
    m = DWP_CSS_PATTERN.search(content)
    if m:
        content = content[:m.start()] + NEW_CSS_COMMENT + content[m.end():]
        print("  OK CSS replaced (%d chars -> %d chars)" % (m.end()-m.start(), len(NEW_CSS_COMMENT)))
    else:
        print("  FAIL CSS pattern NOT found -- check manually")

    # 2. Replace WheelCol + DateWheelPicker JS
    m = DWP_JS_PATTERN.search(content)
    if m:
        content = content[:m.start()] + NEW_JS + content[m.end():]
        print("  OK JS class replaced")
    else:
        print("  FAIL JS class pattern NOT found")

    # 3. Replace DateWheelPicker init calls with CalPicker
    before = content
    content = content.replace('new DateWheelPicker(con,{', 'new CalPicker(con,{')
    if content != before:
        print("  OK Init call(s) patched")
    else:
        print("  FAIL Init call NOT found")

    # 4. For main index.html: patch _syncMaxYear
    if is_main:
        m = SYNC_OLD.search(content)
        if m:
            content = content[:m.start()] + SYNC_NEW + content[m.end():]
            print("  OK _syncMaxYear patched")
        else:
            print("  FAIL _syncMaxYear pattern NOT found (may need manual check)")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("  Saved. Size: %d -> %d bytes" % (original_len, len(content)))


print("Patching index.html...")
patch_file(r'c:\Users\anvit\OneDrive\Documents\Website\index.html', is_main=True)

print("\nPatching Admin/index.html...")
patch_file(r'c:\Users\anvit\OneDrive\Documents\Website\Admin\index.html', is_main=False)

print("\nDone.")
