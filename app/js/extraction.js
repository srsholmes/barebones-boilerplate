((w, d) => {
  console.log('EXTRACT....');
  const body = document.querySelector('body');
  const validClasses = [ 'price', 'station', 'description' ];

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
        stack.unshift(nodeName);
      }
      el = el.parentNode;
      if (el.nodeType === 11) { // for shadow dom, we
        isShadow = true;
        el = el.host;
      }
      function isInPage(node) {
        return (node === document.body || node === document) ? false : document.body.contains(node);
      }

      if (count === 1) {
        obj.wrapperSelect = `.${(isInPage(el) ? el : document.body).classList.value.replace(/ /g, '.')}`;
      }
      count--;
    }
    //stack.splice(0, 1); // removes the html element
    return Object.assign({}, obj, { stack: stack.join(' > ') });
    //return stack.join(' > ');
  }

  const createEntry = (target) => {
    console.log('createEntry', target)
    return {
      title: target.classList,
      path: getDomPath(target),
      node: target,
    };
  };

  const nodes = document.getElementsByTagName("*");
  const res = [ ...nodes ].reduce((acc, curr) => {
    const classArray = curr.classList;
    const hasValidClass = validClasses.some((testClass) => {
      const res = [ ...classArray ].some((x) => {
        return x.includes(testClass);
      });
      return res;
    });
    return hasValidClass ? [ ...acc, createEntry(curr) ] : acc;
  }, []);


  console.log('***********');
  console.log(res);
  console.log('************');


  // Loop over nodes, check the classname, if contains something in the validClasses, then add to the array, using
  // createEntry. Title will be the title of the validNode. If the entry in the valid Node has been used, dont include
  // it next loop?

})(window, document);
