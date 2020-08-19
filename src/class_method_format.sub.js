/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true, maxcomplexity: 26, maxdepth: 3 */
/* global prompt *///gulp.keep.line
/* global _this, editor, editor_element, toggleTag, getSelectionNodename, getValidationStatus */
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
