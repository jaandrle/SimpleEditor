# SimpleEditor
JS class for creating very simple text/html editor combinated with ```<iframe>``` element.

**[Actual version](https://github.com/jaandrle/SimpleEditor/releases/tag/v0.3-rc)**
## Editor creation
All browsers tested.
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
