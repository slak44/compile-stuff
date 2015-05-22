'use strict';
hljs.initHighlighting();
var codeBlocks = document.getElementsByClassName('code-block');
for (var i = 0; i < codeBlocks.length; i++) highlightEvt(codeBlocks[i]);
function highlightEvt(who) {
  who.addEventListener('blur', function (e) {hljs.highlightBlock(who)});
}