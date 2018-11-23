/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true */
/* global _static, gulp_place */
_static.getVersion= function(){ return gulp_place("app.version", "variable"); };
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
