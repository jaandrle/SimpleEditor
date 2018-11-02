# SimpleEditor
Třída vytvářející s ```<iframe>```em jednoduchý editor
## Vytvoření editoru
Testováno ve všech prohlížečích.
### v JavaScriptu
  ```javascript
    var ja_jsem_instance= class_SimpleEditor({
        editor_element: JS_odkaz_na_iframe,
        default_value: defaultni_hodnoty
    });
  ```

### v HTML
  ```html
    <iframe id="editor" src='about:blank'></iframe>
    <button onclick="ja_jsem_instance.format('bold');">Bold</button>
```

## Metody
  - *format*(format_name): 
    * typické použití jako naslouchač na příslušné buttony
    * format_name= [DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString) název příkazu (viz 'List příkazů' dále v textu);
  - *getContent*: vrací HTML obsah ```<iframe>```u
  - *getTextContent*: vrací textový obsah obsah ```<iframe>```u

## List příkazů
  - "**bold**", "**italic**", "**underline**": Přepíná bold/italic formát nově psaného (či vybraného textu)
  - "**removeFormat**": zruší formátování
  - "**insertOrderedList**", "**insertUnorderedList**", "**insertParagraph**": přidá ```<ol>```, ```<ul>```, resp. ```<p>```
  - "**createEmail**", "**createLink**", "**insertImage**": Vytvoří/zruší email, URL link či vloží obrázek buť z vybraného textu (zapsané url adresy), případně vyskočí dotaz (prompt)
  - "**justifyLeft**", "**justifyRight**", "**justifyCenter**", "**justifyFull**": změna zarovnání
  - Další možnosti viz [Document.execCommand()](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)

## Registrování validátorů
  - Například email:
    ```javascript
      i_am_instance.setValidationFunction("createEmail", function emailValidation(email_candidate) {
        /*_@_*/ let e= email_candidate.split("@"); if(e.length!==2) return false;
        /*_@_._*/ e= [e[0], ...e[1].split(".")]; if(e.length!==3) return false;
        const _e= !/(#|\?|!|\\|\/|\||\.\.)/i.test(e[0]);
        return _e && e.reduce((r,o)=>r&&o.length>1&&!/\s/.test(o), _e);
      });
    ```