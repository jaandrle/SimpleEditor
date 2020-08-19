!function(e,t){"use strict";"function"==typeof define&&define.amd?define([],function(){return t(window,document)}):"undefined"!=typeof exports?module.exports=t(window,document):window.class_simpleeditor=t(window,document)}(0,function(e,t){return function(){var n={};function o(e){return-1!==e.indexOf(".")&&/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.?)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/gim.test(e)}return n.getVersion=function(){return"0.7.1"},n.validateLink=o,n.init=function(n){var r,i,a={};n.editor_element&&(r=n.editor_element),n.default_value&&(i=n.default_value);var c,d={createLink:o};function s(e,t){return-1===Object.keys(d).indexOf(e)?0:d[e](t)?2:1}function l(e){e||(e={}),e.prev_content||(e.prev_content="innerHTML");var n,o,r="<p>",i="</p>";g()!==e.tag&&(r="<"+e.tag+">",i="</"+e.tag+">"),c.getSelection?(o=(n=c.getSelection()).anchorNode.parentNode,"Range"===n.type?o.outerHTML=r+o[e.prev_content]+i:e.placeholder&&(o.parentNode.insertBefore(c.createElement(e.tag),o.nextSibling).innerText=e.placeholder)):t.selection&&"Control"!==t.selection.type&&console.log(t.selection.createRange().pasteHTML(r+i))}function u(n){n.stopPropagation(),n.preventDefault();var o,r,i=(n.clipboardData||e.clipboardData).getData("Text");c.getSelection?(o=c.getSelection()).getRangeAt&&o.rangeCount&&((r=o.getRangeAt(0)).deleteContents(),r.insertNode(c.createTextNode(i))):t.selection&&"Control"!==t.selection.type&&t.selection.createRange().pasteHTML(i)}function g(){var e;if(t.selection&&t.selection.createRange)return(e=t.selection.createRange()).htmlText;if(c.getSelection){var n=c.getSelection();if("#text"!==n.anchorNode.nodeName){var o=(e=n.getRangeAt(0)).cloneContents(),r=t.createElement("div");return r.appendChild(o),r.childNodes.length?r.childNodes[0].nodeName:e.startContainer.tagName}return c.getSelection().anchorNode.parentNode.nodeName}return""}return r.contentWindow.location.reload(),r.onload=function(){var e,o;c=r.contentDocument,n.styles&&(e=n.styles,(o=t.createElement("style")).appendChild(t.createTextNode(e)),c.head.appendChild(o)),c.body.innerHTML=i||"<p>&nbsp;</p>",c.designMode="on",c.body&&(c.body.addEventListener?c.body.addEventListener("paste",u):c.body.attachEvent("paste",u)),!0===n.auto_resize&&function(e){var t={add:function(){e.setAttribute("data-original-height",e.offsetHeight),e.contentDocument.body.addEventListener("click",t.resize),e.contentDocument.body.addEventListener("paste",t.resize),e.contentDocument.body.addEventListener("cut",t.resize),e.contentDocument.body.addEventListener("input",t.resize),e.contentDocument.body.addEventListener("keyup",t.resize)},remove:function(){e.contentDocument.body.removeEventListener("click",t.resize),e.contentDocument.body.removeEventListener("paste",t.resize),e.contentDocument.body.removeEventListener("cut",t.resize),e.contentDocument.body.removeEventListener("input",t.resize),e.contentDocument.body.removeEventListener("keyup",t.resize)},resize:function(){var t=e.getAttribute("data-original-height");e.style.height="0";var n=this.scrollHeight+e.offsetHeight;t>n&&(n=t),e.style.height=n+"px"}};return t}(r).add()},a.format=function(e,n){var o;r.contentWindow.focus(),o=t.selection&&t.selection.createRange?t.selection.createRange().htmlText:c.getSelection?c.getSelection().toString():"";var i=null;switch(e){case"removeTags":e=!1,l({tag:"P",prev_content:"innerText"});break;case"createHeading":e=!1,l({tag:n=n?n.toUpperCase():"H1",placeholder:"Header"});break;case"underline":"U"===g()&&(e="removeFormat");break;case"strikeThrough":"STRIKE"===g()&&(e="removeFormat");break;case"createEmail":e="createLink","A"!==g()?1===s("createEmail",o)?(o=prompt("Please specify the email:",o))&&1!==s("createEmail",o)?i="mailto:"+o:e=!1:i="mailto:"+o:e="unlink";break;case"createLink":"A"!==g()?1===s(e,o)?(o=prompt("Please specify the URL link:",o))&&1!==s(e,o)?i=o:e=!1:i=o:e="unlink";break;case"insertImage":"IMG"!==g()?o?i=o:(o=prompt("Please specify the URL link of the image:",o))?i=o:e=!1:e="unlink"}e&&c.execCommand(e,!1,i)},a.getContent=function(){return c.body.innerHTML.replace(/<br\/?>\s*<\//gim,"</").replace(/<[^\/>][^>]*><\/[^>]+>/gim,"")},a.getTextContent=function(){return c.body.innerText},a.setValidationFunction=function(e,t){d[e]=t},a.getValidationFunction=function(e){return d[e]},Object.freeze?Object.freeze(a):a},Object.freeze?Object.freeze(n):n}()});