function class_SimpleEditor(def){
    let {editor_element, default_value}= def;
    let _this= {};
    var editor;
    editor_element.contentWindow.location.reload();
    editor_element.onload= function(){
        editor= editor_element.contentDocument;
        editor.body.innerHTML= default_value;
        editor.designMode = "on";
    };
    function validateEmail(email) {
        let re= /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email);
    }

    _this.format= function(action){
        editor_element.contentWindow.focus();
        let selected_value= editor.getSelection().toString();
        let selected_value_correction= null;
        //let warning_text= "Error!";

        if(action==="email"){
            action= "createLink";
            if(editor.getSelection().anchorNode.parentNode.nodeName!=="A"){
                if(!validateEmail(selected_value)){
                    selected_value= prompt("Value for email:", selected_value);
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
        }
        if(action) editor.execCommand(action, false, selected_value_correction);
        //else alert(warning_text);
    }
    _this.getContent= function(){
        return editor.body.innerHTML.replace(/(<!--((?!-->).|\n)+-->)/gm,"").replace(/(<[^\/<> ]+) [^>]+(>|$)/g, "$1>");
        //? jsete BRka?
    }
    return Object.freeze(_this);
}
