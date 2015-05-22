'use strict';
hljs.initHighlighting();
var codeBlocks = document.getElementsByClassName('code-block');
for (var i = 0; i < codeBlocks.length; i++) highlightEvt(codeBlocks[i]);


function highlightEvt(who) {
  who.addEventListener('blur', function (e) {hljs.highlightBlock(who)});
}

function showLang(langName) {
  document.getElementsByClassName('displayable')[0].classList.remove('displayable');
  document.getElementsByClassName(langName)[0].classList.add('displayable');
}