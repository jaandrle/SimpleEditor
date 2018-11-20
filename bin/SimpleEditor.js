/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true */
/* global define, module*/
(function(module_name, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function(){
            return factory(window, document);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(window, document);
    } else {
        window[module_name] = factory(window, document);
    }
})("class_"+"SimpleEditor", function(window, document){
    'use strict';
    return (function class_SimpleEditor(){
        var _static= {};
        _static.getVersion= function(){ return "0.7.0"; };
        _static.validateLink= validateLink;

        function autoResizeArea(editor_element){
            var local_autoResizeArea= {
                add: function(){
                    editor_element.setAttribute("data-original-height", editor_element.offsetHeight);
                    editor_element.contentDocument.body.addEventListener("click", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.addEventListener("paste", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.addEventListener("cut", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.addEventListener("input", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.addEventListener("keyup", local_autoResizeArea.resize);
                },
                remove: function(){
                    editor_element.contentDocument.body.removeEventListener("click", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.removeEventListener("paste", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.removeEventListener("cut", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.removeEventListener("input", local_autoResizeArea.resize);
                    editor_element.contentDocument.body.removeEventListener("keyup", local_autoResizeArea.resize);
                },
                resize: function(){
                    var area= this;
                    var minHeight= editor_element.getAttribute("data-original-height");
                    editor_element.style.height = "0";
                    var newHeight= area.scrollHeight + editor_element.offsetHeight;
                    if (minHeight > newHeight) { newHeight = minHeight; }
                    editor_element.style.height = newHeight + "px";
                }
            };
            return local_autoResizeArea;
        }
        function validateLink(str){
            if(str.indexOf(".")===-1) return false;
            return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.?)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/igm.test(str); //https://www.regextester.com/94502
        }
        
        _static.init= function(def){
            var _this= {};
            /* global console *///gulp.keep.line
            var editor_element, default_value;
            if(def.editor_element) editor_element= def.editor_element;
            if(def.default_value) default_value= def.default_value;
            var validators= {createLink: validateLink};
            var editor, editor_autoresize;

            editor_element.contentWindow.location.reload();
            editor_element.onload= function(){
                editor= editor_element.contentDocument;
                if(def.styles) setStyles(def.styles);
                editor.body.innerHTML= default_value || "<p>&nbsp;</p>";
                editor.designMode= "on";
                if(editor.body){
                    if(editor.body.addEventListener) editor.body.addEventListener("paste", pasteHandler);
                    else editor.body.attachEvent("paste", pasteHandler);
                }
                if(def.auto_resize===true){
                    editor_autoresize= autoResizeArea(editor_element);
                    editor_autoresize.add();
                }
            };
            /* global prompt *///gulp.keep.line
            _this.format= function(action, param){
                editor_element.contentWindow.focus();
                var selected_value;
                if(document.selection && document.selection.createRange){
                    selected_value= document.selection.createRange().htmlText;
                } else if (editor.getSelection) {
                    selected_value= editor.getSelection().toString();
                } else {
                    selected_value= '';
                }
                var selected_value_correction= null;
                //var warning_text= "Error!";
                
                switch (action){
                    case "removeTags": /* not recommended in live env */
                        action= false;
                        toggleTag({tag: "P", prev_content: "innerText"});
                        break;
                    case "createHeading": /* not recommended in live env */
                        action= false;
                        if(!param) param= "H1";
                        else param= param.toUpperCase();
                        toggleTag({tag: param, placeholder: "Header"});
                        break;
                    case "underline":
                        if(getSelectionNodename()==="U") action= "removeFormat";
                        break;
                    case "strikeThrough":
                        if(getSelectionNodename()==="STRIKE") action= "removeFormat";
                        break;
                    case "createEmail":
                        action= "createLink";
                        if(getSelectionNodename()!=="A"){
                            if(getValidationStatus("createEmail", selected_value)===1){
                                selected_value= prompt("Please specify the email:", selected_value);
                                if(!selected_value||getValidationStatus("createEmail", selected_value)===1){
                                    action= false;
                                    //warning_text+= " Wrong email!"
                                } else {
                                    selected_value_correction= "mailto:"+selected_value;
                                }
                            } else {
                                selected_value_correction= "mailto:"+selected_value;
                            }
                        } else {
                            action= "unlink";
                        }
                        break;
                    case "createLink":
                        if(getSelectionNodename()!=="A"){
                            if(getValidationStatus(action, selected_value)===1){
                                selected_value= prompt("Please specify the URL link:", selected_value);
                                if(!selected_value||getValidationStatus(action, selected_value)===1){
                                    action= false;
                                    //warning_text+= " Wrong URL!"
                                } else {
                                    selected_value_correction= selected_value;
                                }
                            } else {
                                selected_value_correction= selected_value;
                            }
                        } else {
                            action= "unlink";
                        }
                        break;
                    case "insertImage":
                        if(getSelectionNodename()!=="IMG"){
                            if(!selected_value){
                                selected_value= prompt("Please specify the URL link of the image:", selected_value);
                                if(!selected_value){
                                    action= false;
                                    //warning_text+= " Wrong image!"
                                } else {
                                    selected_value_correction= selected_value;
                                }
                            } else {
                                selected_value_correction= selected_value;
                            }
                        } else {
                            action= "unlink";
                        }
                        break;
                    default:
                        break;
                }
                if(action) editor.execCommand(action, false, selected_value_correction);
                //else alert(warning_text);
            };
            _this.getContent= function(){
                return editor.body.innerHTML.replace(/<br\/?>\s*<\//gim, "</").replace(/<[^\/>][^>]*><\/[^>]+>/gmi, "");
            };
            _this.getTextContent= function(){
                return editor.body.innerText; //DELETE .replace(/(<!--((?!-->).|\n)+-->)/gm,"").replace(/(<[^\/<> ]+) [^>]+(>|$)/g, "$1>"); //DELETE some BR cleaner?
            };
            _this.setValidationFunction= function(action, fun){ validators[action]= fun; };
            _this.getValidationFunction= function(action){ return validators[action]; };

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
            return Object.freeze ? Object.freeze(_this) : _this;
        };
        return Object.freeze ? Object.freeze(_static) : _static;
    })();
});