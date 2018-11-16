_this.getContent= function(){
    return editor.body.innerHTML.replace(/<br\/?>\s*<\//gim, "</").replace(/<[^\/>][^>]*><\/[^>]+>/gmi, "");
};
_this.getTextContent= function(){
    return editor.body.innerText; //DELETE .replace(/(<!--((?!-->).|\n)+-->)/gm,"").replace(/(<[^\/<> ]+) [^>]+(>|$)/g, "$1>"); //DELETE some BR cleaner?
};