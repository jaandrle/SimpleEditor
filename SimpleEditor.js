function class_SimpleEditor(def){
    let editor_element, default_value;
    if(def.editor_element) editor_element= def.editor_element;
    if(def.default_value) default_value= def.default_value;
    let _this= {};
    var editor;
    var caret_position;
    editor_element.contentWindow.location.reload();
    editor_element.onload= function(){
        editor= editor_element.contentDocument;
        editor.body.innerHTML= default_value || "<p></p>";
        editor.designMode= "on";
        editor.body.addEventListener("paste", pasteHandler);
    };

    _this.format= function(action){
        editor_element.contentWindow.focus();
        let selected_value;
        if(document.selection && document.selection.createRange){
            selected_value= document.selection.createRange().htmlText;
        } else if (editor.getSelection) {
            selected_value= editor.getSelection().toString();
        } else {
            selected_value= '';
        }
        let selected_value_correction= null;
        //let warning_text= "Error!";
        
        switch (action){
            case "createEmail":
                action= "createLink";
                if(getSelectionNodename()!=="A"){
                    if(!validateEmail(selected_value)){
                        selected_value= prompt("Please specify the email:", selected_value);
                        if(!validateEmail(selected_value)){
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
                    if(!selected_value){
                        selected_value= prompt("Please specify the URL link:", selected_value);
                        if(!selected_value){
                            action= false;
                            //warning_text+= " Wrong email!"
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
                            //warning_text+= " Wrong email!"
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
        console.log(action);
        if(action) editor.execCommand(action, false, selected_value_correction);
        //else alert(warning_text);
    }
    _this.getContent= function(){
        return editor.body.innerHTML; //DELETE .replace(/(<!--((?!-->).|\n)+-->)/gm,"").replace(/(<[^\/<> ]+) [^>]+(>|$)/g, "$1>"); //DELETE jsete BRka?
    }
    _this.getTextContent= function(){
        return editor.body.innerText; //DELETE .replace(/(<!--((?!-->).|\n)+-->)/gm,"").replace(/(<[^\/<> ]+) [^>]+(>|$)/g, "$1>"); //DELETE jsete BRka?
    }

    function validateEmail(email) {
        let re= /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email);
    }
    function pasteHandler(e) {
        e.stopPropagation();
        e.preventDefault();
        const pastedData= (e.clipboardData || window.clipboardData).getData('Text');
        
        let sel, range;
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
    return Object.freeze(_this);
}
