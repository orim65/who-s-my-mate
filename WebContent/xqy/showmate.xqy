xquery version "1.0-ml";
(: Return image link, name, other info about a given mate :)
xdmp:set-response-content-type("text/html; charset=utf-8"),
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',

let $mate := xdmp:get-request-field("mate")
let $name := fn:tokenize($mate, ' ')[last()]
for $p in /people/person
where cts:contains($p/@latestname, $name) 
return 
  let $idimg := substring($p/@id,string-length($p/@id)-4)
  let $office := $p/office[@current eq 'yes'][1]
  let $idpar := substring($office/@id,string-length($office/@id)-5)
  let $party :=
    for $m in /members/member
    where fn:ends-with($m/@id, $idpar)
    return fn:data($m/@party)
  return
(
<img src="http://data.openaustralia.org/members/images/mpsL/{$idimg}.jpg" style="float:left"/>,
<h2 style="text-align: center">{$mate}</h2>,
<h3 style="text-align: center">{$party}</h3>
)