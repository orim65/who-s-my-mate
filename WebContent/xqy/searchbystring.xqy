xquery version "1.0-ml";
(: Return all paragraphs that contain search terms. Boolean search, no ranking. :)
xdmp:set-response-content-type("text/html; charset=utf-8"),
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',

let $q := xdmp:get-request-field("query")
let $s := xdmp:get-request-field("speaker")
for $d in /debates/speech
return 
  for $p in $d//p
  let $uri := fn:base-uri($p)
  where (cts:contains($p, cts:word-query($q)) or fn:string-length($q) eq 0) and 
        (cts:contains($d/@speakername, cts:word-query($s)) or fn:string-length($s) eq 0)  and 
         not($p/@standalone eq 'false')
  return 
(:    <div class="result" data-uri="{$uri}" data-path="{xdmp:path($p)}"> :)
(:    Source uri and path might be useful later in use cases like "expand", "show context", etc. :)
    <div class="result"> 
    From <i>{fn:data($d/@talktype)}</i> by <b>{fn:data($d/@speakername)}</b> 
    on {fn:substring(fn:substring-before($uri,'.xml'),fn:string-length($uri)-13)}
      <div class="feedback">
        <button class="minus" title="Out of context? Click to remove." onclick="this.style.background='red'; update('{$uri}','{xdmp:path($p)}'); this.disabled=true;">&#8211;</button>
      </div>
      <br/> 
      {cts:highlight($p, $q, <b>{$cts:text}</b>)}
    </div>

  