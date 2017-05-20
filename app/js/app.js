((w, d) => {
  let compareArr = [];
  const initButton = () => {
    const frag = document.createDocumentFragment();
    const body = document.querySelector('body');
    const wrapper = d.createElement('div');
    const input = d.createElement('input');
    const inputTitle = d.createElement('span');
    const doneButton = d.createElement('button');
    doneButton.innerText = 'Done';
    inputTitle.innerHTML = 'Add the title:';
    wrapper.className = `compare-button-wrapper`;
    input.className = `compare-namer-input`;
    wrapper.appendChild(inputTitle);
    wrapper.appendChild(input);
    wrapper.appendChild(doneButton);
    frag.appendChild(wrapper);
    body.appendChild(frag);
  };

  const getName = () => {
    const input = document.querySelector('.compare-namer-input');
    return input.value;
  };

  const createEntry = (target) => {
    return {
      title: getName(),
      path: getDomPath(target),
    };
  };

  const events = (e) => {
    console.log(e.target.href);
    if (e.target.nodeName === 'A') e.preventDefault();
    const { target } = e;
    const obj = createEntry(target);
    //if (e.target.nodeName === 'A') compareArr = compareArr.concat(e.path.reverse());
    compareArr = compareArr.concat(obj);
    console.log(compareArr);

    const wrapper = document.querySelector(obj.path.wrapperSelect);
    const node = wrapper.querySelector(obj.path.stack)
    console.log(node)
  };

  const buttonClickHandlers = () => {
    const button = d.querySelector('.compare-button-wrapper button');
    button.addEventListener('click', (e) => {
      return fetch(`http://localhost:6969/addManifest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeList: compareArr, url: window.location }),
      });
    });
  };

  const validClick = node => {
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
    const obj = {};
    var stack = [];
    var isShadow = false;
    let count = 5;
    while (count > 0) {
      // console.log(el.nodeName);
      var sibCount = 0;
      var sibIndex = 0;
      // get sibling indexes
      for (var i = 0; i < el.parentNode.childNodes.length; i++) {
        var sib = el.parentNode.childNodes[ i ];
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
      if (el.nodeType === 11) { // for shadow dom, we
        isShadow = true;
        el = el.host;
      }
      if (count === 1) {
        obj.wrapperSelect = `.${el.classList.value.replace(/ /g, '.')}`;
      }
      count--;
    }
    //stack.splice(0, 1); // removes the html element
    return Object.assign({}, obj, { stack: stack.join(' > ') });
    //return stack.join(' > ');
  }

  const hoverEvents = () => {
    const all = d.querySelectorAll('*');
    const body = document.querySelector('body');
    body.classList.add('hover-all');
    console.log(all);
    Array.from(all)
    .filter(validClick)
    .forEach(x => x.addEventListener('click', events));
  };

  const setStyles = () => {
    var node = document.createElement('style');
    document.body.appendChild(node);
    window.addStyleString = function (str) {
      node.innerHTML = str;
    };
  };

  setStyles();
  addStyleString(`* {
  box-sizing: border-box; }

body {
  margin: auto;
  text-align: center;
  width: 80%;
  font-family: Arial; }
  body .compare-namer-input {
    border: 2px solid black;
    width: 100%;
    height: 60px;
    font-size: 20px;
    z-index: 10; }
  body.hover-all img, body.hover-all a, body.hover-all li {
    cursor: pointer; }
  body.hover-all img:hover {
    border: 2px solid green; }
  body.hover-all a:hover {
    border: 2px solid blue; }
  body.hover-all ul:hover {
    border: 2px solid #ff2bc1; }
  body.hover-all li:hover {
    border: 2px solid #27a9ff; }
  body.hover-all p:hover {
    border: 2px solid #ff9119; }
  body.hover-all h1:hover, body.hover-all h2:hover, body.hover-all h3:hover, body.hover-all h4:hover, body.hover-all h5:hover {
    border: 2px solid #ff2438; }

.wrapper {
  flex-direction: row; }
  .wrapper li {
    width: 20%;
    display: inline-block; }
  .wrapper .img-wrapper {
    width: 100%; }
    .wrapper .img-wrapper img {
      width: 100%; }

.compare-button-wrapper {
  position: fixed;
  bottom: 5%;
  right: 5%; }
  .compare-button-wrapper button {
background: red;
    color: white;
    height: 30px;
    width: 90%;
    border: none;
    font-size: 15px;}

.comparison-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.3); }

`);
  hoverEvents();
  initButton();
  buttonClickHandlers();
  //initComparisonFade();

})(window, document);
