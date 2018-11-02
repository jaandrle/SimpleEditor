![IE <=9 - supported](https://img.shields.io/badge/IE%20%3C=9-supported-green.svg) ![IE >9 - tested](https://img.shields.io/badge/IE%20%3E9-tested-brightgreen.svg) ![Firefox - tested](https://img.shields.io/badge/Firefox-tested-brightgreen.svg) ![Chrome - tested](https://img.shields.io/badge/Chrome-tested-brightgreen.svg)  ![Safari - tested](https://img.shields.io/badge/Safari-tested-brightgreen.svg)
# SimpleEditor
JS class for creating very simple text/html editor combinated with ```<iframe>``` element.

**[Actual version](https://github.com/jaandrle/SimpleEditor/releases/tag/v0.3-rc)**
## Editor creation
### JavaScript
  ```javascript
    var i_am_instance= class_SimpleEditor({
        editor_element: iframe_NODE_element,
        default_value: default_content
    });
  ```

### HTML
  ```html
    <iframe id="editor" src='about:blank'></iframe>
    <button onclick="i_am_instance.format('bold');">Bold</button>
```

## Methods
  - *format*(format_name): 
    * primary for using as *onclick* listener
    * format_name= [DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString) command name (i.e. 'Commands List' below);
  - *getContent*: return ```<iframe>``` HTML content
  - *getTextContent*: return ```<iframe>``` text content

## Commands List
  - "**bold**", "**italic**", "**underline**": Toggle bold/italic format new or selected text
  - "**removeFormat**": remove format
  - "**insertOrderedList**", "**insertUnorderedList**", "**insertParagraph**": add ```<ol>```, ```<ul>```, or ```<p>```
  - "**createEmail**", "**createLink**", "**insertImage**": Toggle email, URL link or create image
    * in case of email and URL link: the link is created from selected text (if detected), or you can add link via prompt
    * "**insertImage**": for now no detection implemented (in aditional, you must combine this with some uploader)
  - "**justifyLeft**", "**justifyRight**", "**justifyCenter**", "**justifyFull**": alingment change
  - Another possibilites in [Document.execCommand()](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)

## Register validator
  - Email example:
    ```javascript
      i_am_instance.setValidationFunction("createEmail", function emailValidation(email_candidate) {
        /*_@_*/ let e= email_candidate.split("@"); if(e.length!==2) return false;
        /*_@_._*/ e= [e[0], ...e[1].split(".")]; if(e.length!==3) return false;
        const _e= !/(#|\?|!|\\|\/|\||\.\.)/i.test(e[0]);
        return _e && e.reduce((r,o)=>r&&o.length>1&&!/\s/.test(o), _e);
      });
    ```