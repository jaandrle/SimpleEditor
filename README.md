# SimpleEditor
Třída vytvářející s &lt;iframe>em jednoduchý editor
## Vytvoření instance
  ``var ja_jsem_instance= class_SimpleEditor({
    editor_element: JS_odkaz_na_iframe,
    default_value: defaultni_hodnoty
  });``
## Metody
  - *format*: jako parametr bere "bold", "italic", ... (viz [Document.execCommand()](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand))
  - *getContent*: vrací obsah <iframe>u
