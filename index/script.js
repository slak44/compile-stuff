'use strict';
hljs.initHighlighting();
var codeBlocks = document.getElementsByClassName('code-block');
for (var i = 0; i < codeBlocks.length; i++) highlightEvt(codeBlocks[i]);

function sendToServer() {
  var data = document.getElementsByClassName('displayable')[0].children[0].innerHTML.replace(/(<\/span>)|(<span(.*?)>|<br>|<div>|<\/div>)/g, '');
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log(this);
  }
  xhr.open('POST', document.getElementsByClassName('displayable')[0].classList[0]);
  xhr.send(data);
}

function highlightEvt(who) {
  who.addEventListener('blur', function (e) {hljs.highlightBlock(who)});
}

function showLang(langName) {
  document.getElementsByClassName('displayable')[0].classList.remove('displayable');
  document.getElementsByClassName(langName)[0].classList.add('displayable');
}