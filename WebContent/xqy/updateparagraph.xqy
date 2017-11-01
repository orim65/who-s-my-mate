xquery version "1.0-ml";

let $uri := xdmp:get-request-field("uri")
let $path := xdmp:get-request-field("path")
let $d := fn:doc($uri)

let $xslt := 
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:template match="node()|@*">
      <xsl:copy>
        <xsl:apply-templates select="node()|@*"/>
      </xsl:copy>
    </xsl:template>
    <xsl:template match="{$path}">
      <xsl:copy>
        <xsl:attribute name="standalone">false</xsl:attribute>
        <xsl:apply-templates select="node()"/>
      </xsl:copy>
    </xsl:template>
  </xsl:stylesheet>  
let $dnew := xdmp:xslt-eval($xslt,$d)

return (fn:concat($path, ' in ', $uri, ' updated.'),
xdmp:document-insert($uri, $dnew))
