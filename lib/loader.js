function Loader () {}

Loader.load = function (force) {
  //Loop through all <include> tags
  $("include").each(function (index) {
    //Don't load downloded unless force = true
    if($(this).html() != "" && !force) return;
    var elem = this
    //Now ajax load the source
    $.get(
      $(this).attr("source"),
      function (data) {
        //Set the element's html to the downloded source
        $(elem).html(data)
        //Evaluate the onDownload element of the include
        eval($(elem).attr("onDownload"))
      }
    ).fail(function () {eval($(elem).attr("onerror"))})
  })
}

//Render a template and return the HTML
//Uses the compileCache
Loader.renderTemplate = function(sourceLocator, data) {
  source = $(sourceLocator).html()
  if (Loader.compileCache[sourceLocator] != undefined) return Loader.compileCache[sourceLocator](data)
  else {
     compiled = Handlebars.compile(source)
     Loader.compileCache[sourceLocator] = compiled
     return compiled(data)
  }
}

//Render a template and append the HTML to the target
Loader.renderTemplateAppend = function (sourceLocator, targetLocator, data) {
  $(targetLocator).append(
    Loader.renderTemplate(sourceLocator, data)
  )
}

//Render a template and set the HTML of the target to it
Loader.renderTemplateHTML = function (sourceLocator, targetLocator, data) {
  $(targetLocator).html(
    Loader.renderTemplate(sourceLocator, data)
  )
}

//Clear the compilation cache
Loader.clearCache = function () {
  Loader.compileCache = {}
}

//Clear the cahche for a specific template
Loader.reset = function (templateLocator) {
  Loader.compileCache[templateLocator] = undefined
}

//Force recompilation of a template - will be stored in the compileCache
Loader.update = function (templateLocator) {
  source = $(templateLocator).html()
  Loader.compileCache[templateLocator] = Handlebars.compile(source)
}

Loader.compileCache = {}
