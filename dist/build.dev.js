"use strict";

var StyleDictionaryPackage = require('style-dictionary'); // HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED


StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function formatter(dictionary, config) {
    return "".concat(this.selector, " {\n        ").concat(dictionary.allProperties.map(function (prop) {
      var value = prop.value;

      if (!!value.type && value.type == 'dropShadow') {
        if (value.spread != 0) {
          value = [value.x, value.y, value.blur, value.color].join(' ');
        } else {
          value = [value.x, value.y, value.blur, value.spread, value.color].join(' ');
        }
      }

      return "--".concat(prop.name, ": ").concat(value, ";");
    }).join('\n'), "\n      }");
  }
});
StyleDictionaryPackage.registerTransform({
  name: 'sizes/px',
  type: 'value',
  matcher: function matcher(prop) {
    // You can be more specific here if you only want 'em' units for font sizes    
    return ["fontSize", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.category);
  },
  transformer: function transformer(prop) {
    // You can also modify the value here if you want to convert pixels to ems
    return parseFloat(prop.original.value) + 'px';
  }
});

function getStyleDictionaryConfig(theme) {
  return {
    "source": ["tokens/".concat(theme, ".json")],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px"],
        "buildPath": "output/",
        "files": [{
          "destination": "".concat(theme, ".css"),
          "format": "css/variables",
          "selector": ".".concat(theme, "-theme")
        }]
      }
    }
  };
}

console.log('Build started...'); // PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['global', 'dark', 'light', 'main1', 'main2'].map(function (theme) {
  console.log('\n==============================================');
  console.log("\nProcessing: [".concat(theme, "]"));
  var StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));
  StyleDictionary.buildPlatform('web');
  console.log('\nEnd processing');
});
console.log('\n==============================================');
console.log('\nBuild completed!');