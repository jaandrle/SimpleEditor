            /* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true *///gulp.remove.line
            /* static methods *//* global validateLink, autoResizeArea *///gulp.remove.line
            /* global def, setStyles, pasteHandler *///gulp.remove.line
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