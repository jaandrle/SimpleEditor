/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true, maxdepth: 3 */
/* global console *///gulp.keep.line
/* gulp *//* global gulp_place */
/* static methods *//* global validators */
gulp_place("class_constructor.sub.js");
/* global editor */
gulp_place("class_method_format.sub.js");
gulp_place("class_methods_getContent_funs.sub.js");
gulp_place("class_methods_validations_funs.sub.js");

function getValidationStatus(
    name, /* _this.format action */
    candidate /* value for checking */
){/* return int (0,1,2):
    0: no validation function
    1: validation failed
    2: validation success */
    if(Object.keys(validators).indexOf(name)===-1) return 0;
    if(!validators[name](candidate)) return 1;
    return 2;
}
function toggleTag(def){
    if(!def) def= {};
    if(!def.prev_content) def.prev_content= "innerHTML";
    var pre_text= '<p>', post_text= '</p>';
    if(getSelectionNodename()!==def.tag){
        pre_text= "<"+def.tag+">";
        post_text= "</"+def.tag+">";
    }
    var sel, sel_node, inserted;
    if(editor.getSelection){
        sel= editor.getSelection();
        sel_node= sel.anchorNode.parentNode;
        if(sel.type==="Range"){
            sel_node.outerHTML= pre_text+sel_node[def.prev_content]+post_text;
        } else if(def.placeholder) {
            inserted= sel_node.parentNode.insertBefore(editor.createElement(def.tag), sel_node.nextSibling);
            inserted.innerText= def.placeholder;
        }
    } else if(document.selection && document.selection.type !== "Control"){// IE < 9
        console.log(document.selection.createRange().pasteHTML(pre_text+post_text));
    }
}
function pasteHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    var pastedData= (e.clipboardData || window.clipboardData).getData('Text');
    
    var sel, range;
    if(editor.getSelection){
        sel= editor.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range= sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(editor.createTextNode(pastedData));
        }
    } else if(document.selection && document.selection.type !== "Control"){// IE < 9
        document.selection.createRange().pasteHTML(pastedData);
    }
}
function getSelectionNodename(){
var range;
if(document.selection && document.selection.createRange){
    range = document.selection.createRange();
    return range.htmlText;
}
else if (editor.getSelection) {
    var selection= editor.getSelection();
    if(selection.anchorNode.nodeName!=="#text"){
    range= selection.getRangeAt(0);
    var clonedSelection=range.cloneContents();
    var div= document.createElement('div');
    div.appendChild(clonedSelection);
    if(!div.childNodes.length) return range.startContainer.tagName;
    return div.childNodes[0].nodeName;
    }
    else {
    return editor.getSelection().anchorNode.parentNode.nodeName;
    }
}
else {
    return '';
}
}
function setStyles(styles){
    var style_el= document.createElement('style');
    style_el.appendChild(document.createTextNode(styles));
    editor.head.appendChild(style_el);
}
