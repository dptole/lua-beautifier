-function() {
  document.body.innerHTML =
    '<div>'
  +   '<h1>Minimalist Lua beautifier</h1>'
  + '</div>'
  + '<div class="box-js-lua-code">'
  +   '<textarea id="js_lua_code" placeholder="Paste and Ctrl + Enter to beautify"></textarea>'
  + '</div>'
  + '<div>'
  +   '<button id="js_lua_beautify">Beautify</button>'
  + '</div>'
  ;
  
  // This program reads a lua source code and formats it
  // It's based on <http://migre.me/mEbec>
  
      // Spaces or tabs or even other strings
  var indentation = "  "
    , js_lua_code = document.querySelector("#js_lua_code")
    , js_lua_beautify = document.querySelector("#js_lua_beautify")
  ;
  
  // Checks if a string (self) starts with another one (phrase)
  // @param self the original string
  // @param phrase the other string that is supposedly at the beginning of the string
  // @return true or false
  function startsWith(self, phrase) {
    return phrase.length && self.length && !self.indexOf(phrase);
  }
  
  // Checks if a string (self) starts with another one (phrase)
  // @param self the original string
  // @param phrase the other string that is supposedly at the end of the string
  // @return true or false
  function endsWith(self, phrase) {
    var last_index_of = self.lastIndexOf(phrase);
    return phrase.length && self.length && ~last_index_of && (last_index_of === self.length - phrase.length);
  }
  
  // Removes whitespace from both ends of the string
  // @param self the string
  // @return string
  function trim(self) {
    return self.replace(/^\s+|\s+$/g, "");
  }
  
  // Repeats a string n times
  // @param self the string
  // @param times number
  // @return string
  function repeat(self, times) {
    times |= 0;
    if(times < 1) return "";
    var copy = self;
    while(--times) self += copy;
    return self;
  }
  
  // Beautify the Lua code
  // @param string the code to beautify
  // @param indentation the base string used for indentation
  // @return string
  function luaBeautifier(string, indentation) {
    var current_indentation = 0
      , next_indentation = 0
    ;
    
    return string.split(/\r?\n/).map(function(line) {
      line = trim(line);
      
      current_indentation = next_indentation;
      
      // Entering in a block
      if(
        startsWith(line, "local function") ||
        startsWith(line, "function") ||
        startsWith(line, "repeat") ||
        startsWith(line, "while") ||
        endsWith(line, "then") ||
        endsWith(line, "do") ||
        endsWith(line, "{")
      ) next_indentation = current_indentation + 1;
      
      // Leaving a block
      if(line === "end" || startsWith(line, "}") || startsWith(line, "until")) {
        current_indentation--;
        next_indentation = current_indentation;
      }
      
      // Entering in a block but this line must be pushed back
      if(startsWith(line, "else") || startsWith(line, "elseif")) {
        current_indentation--;
        next_indentation = current_indentation + 1;
      }
      
      return !line ? "" : repeat(indentation, current_indentation) + line;
    }).join("\n");
  }
  
  js_lua_code.addEventListener("keydown", function(e) {
    // If Ctrl + Enter then beautify
    if(e.ctrlKey && e.keyCode === 13) js_lua_beautify.click();
  });
  
  js_lua_beautify.addEventListener("click", function() {
    js_lua_code.value = luaBeautifier(js_lua_code.value, indentation);
    js_lua_code.focus();
  });
  
  js_lua_code.focus();
}()
