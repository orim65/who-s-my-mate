  function showmate(mate) {
    var url = 'xqy/showmate.xqy' + '?mate='+mate;
    loadDoc(url, 'mateimg');
  }

  function search() {
    var query = document.getElementById('q1').value;
    var speaker = document.getElementById('q2').value;
    if (!(query == '' && speaker == '')) {
      var url = 'xqy/searchbystring.xqy' + 
                  '?query=' + query +
                  '&speaker=' + speaker
      ;
      loadDoc(url, 'content');
    }
  }

  function update(uri, path) {
    var url = 'xqy/updateparagraph.xqy' +
                '?uri=' + uri +
                '&path=' + path
    ;
    loadDoc(url, 'status');
  }

  function loadDoc(url, resultelement) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById(resultelement).innerHTML=xhttp.responseText;
        console.log("Requesting "+url);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }  
