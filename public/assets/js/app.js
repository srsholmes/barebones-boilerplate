(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function (w, d) {
  var compareArr = [];
  var initButton = function initButton() {
    var frag = document.createDocumentFragment();
    var body = document.querySelector('body');
    var wrapper = d.createElement('div');
    var input = d.createElement('input');
    var inputTitle = d.createElement('span');
    var doneButton = d.createElement('button');
    doneButton.innerText = 'Done';
    inputTitle.innerHTML = 'Add the title:';
    wrapper.className = 'compare-button-wrapper';
    input.className = 'compare-namer-input';
    wrapper.appendChild(inputTitle);
    wrapper.appendChild(input);
    wrapper.appendChild(doneButton);
    frag.appendChild(wrapper);
    body.appendChild(frag);
  };

  var getName = function getName() {
    var input = document.querySelector('.compare-namer-input');
    return input.value;
  };

  var createEntry = function createEntry(target) {
    return {
      title: getName(),
      path: getDomPath(target)
    };
  };

  var events = function events(e) {
    console.log(e.target.href);
    if (e.target.nodeName === 'A') e.preventDefault();
    var target = e.target;

    var obj = createEntry(target);
    //if (e.target.nodeName === 'A') compareArr = compareArr.concat(e.path.reverse());
    compareArr = compareArr.concat(obj);
    console.log(compareArr);

    var wrapper = document.querySelector(obj.path.wrapperSelect);
    var node = wrapper.querySelector(obj.path.stack);
    console.log(node);
  };

  var buttonClickHandlers = function buttonClickHandlers() {
    var button = d.querySelector('.compare-button-wrapper button');
    button.addEventListener('click', function (e) {
      return fetch('http://localhost:6969/addManifest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeList: compareArr, url: window.location })
      });
    });
  };

  var validClick = function validClick(node) {
    switch (node.nodeName) {
      case 'IMG':
      case 'A':
      case 'SPAN':
      case 'UL':
      case 'LI':
      case 'P':
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
        return true;
        break;
      case 'DIV':
        return false;
        break;
      default:
        return false;
    }
  };

  function getDomPath(el) {
    if (!el) {
      return;
    }
    var obj = {};
    var stack = [];
    var isShadow = false;
    var count = 5;
    while (count > 0) {
      // console.log(el.nodeName);
      var sibCount = 0;
      var sibIndex = 0;
      // get sibling indexes
      for (var i = 0; i < el.parentNode.childNodes.length; i++) {
        var sib = el.parentNode.childNodes[i];
        if (sib.nodeName == el.nodeName) {
          if (sib === el) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
      //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
      // } else
      var nodeName = el.nodeName.toLowerCase();
      if (isShadow) {
        nodeName += "::shadow";
        isShadow = false;
      }
      if (sibCount > 1) {
        stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
      } else {
        // last node here...
        console.log('****');
        console.log(nodeName);
        stack.unshift(nodeName);
      }
      el = el.parentNode;
      if (el.nodeType === 11) {
        // for shadow dom, we
        isShadow = true;
        el = el.host;
      }
      if (count === 1) {
        obj.wrapperSelect = '.' + el.classList.value.replace(/ /g, '.');
      }
      count--;
    }
    //stack.splice(0, 1); // removes the html element
    return Object.assign({}, obj, { stack: stack.join(' > ') });
    //return stack.join(' > ');
  }

  var hoverEvents = function hoverEvents() {
    var all = d.querySelectorAll('*');
    var body = document.querySelector('body');
    body.classList.add('hover-all');
    console.log(all);
    Array.from(all).filter(validClick).forEach(function (x) {
      return x.addEventListener('click', events);
    });
  };

  var setStyles = function setStyles() {
    var node = document.createElement('style');
    document.body.appendChild(node);
    window.addStyleString = function (str) {
      node.innerHTML = str;
    };
  };

  setStyles();
  addStyleString('* {\n  box-sizing: border-box; }\n\nbody {\n  margin: auto;\n  text-align: center;\n  width: 80%;\n  font-family: Arial; }\n  body .compare-namer-input {\n    border: 2px solid black;\n    width: 100%;\n    height: 60px;\n    font-size: 20px;\n    z-index: 10; }\n  body.hover-all img, body.hover-all a, body.hover-all li {\n    cursor: pointer; }\n  body.hover-all img:hover {\n    border: 2px solid green; }\n  body.hover-all a:hover {\n    border: 2px solid blue; }\n  body.hover-all ul:hover {\n    border: 2px solid #ff2bc1; }\n  body.hover-all li:hover {\n    border: 2px solid #27a9ff; }\n  body.hover-all p:hover {\n    border: 2px solid #ff9119; }\n  body.hover-all h1:hover, body.hover-all h2:hover, body.hover-all h3:hover, body.hover-all h4:hover, body.hover-all h5:hover {\n    border: 2px solid #ff2438; }\n\n.wrapper {\n  flex-direction: row; }\n  .wrapper li {\n    width: 20%;\n    display: inline-block; }\n  .wrapper .img-wrapper {\n    width: 100%; }\n    .wrapper .img-wrapper img {\n      width: 100%; }\n\n.compare-button-wrapper {\n  position: fixed;\n  bottom: 5%;\n  right: 5%; }\n  .compare-button-wrapper button {\nbackground: red;\n    color: white;\n    height: 30px;\n    width: 90%;\n    border: none;\n    font-size: 15px;}\n\n.comparison-bg {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 0;\n  height: 100%;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.3); }\n\n');
  hoverEvents();
  initButton();
  buttonClickHandlers();
  //initComparisonFade();
})(window, document);

},{}]},{},[1]);
