const directives = [];

const shouldMountDirective = (attrName, element) =>
  ['true', ''].includes(element.getAttribute(attrName));

const createDirective = (attrName, { connected, disconnected }) =>
  new MutationObserver((mutations) =>
    mutations.forEach(({ type, target }) => {
      if (type === 'attributes' && shouldMountDirective(attrName, target)) {
        connected(target);
      } else if (type === 'childList') {
        const targets = target.querySelectorAll(`[${attrName}]`);
        targets.forEach((tar) => {
          if (shouldMountDirective(attrName, tar)) {
            connected(tar);
          } else {
            disconnected(tar);
          }
        });
      } else {
        disconnected(target);
      }
    })
  );

const customDirectives = {
  define: (tagName, directive) =>
    directives.push({ tagName, observer: createDirective(tagName, directive) }),
  connect: (element) =>
    directives.forEach(({ tagName, observer }) =>
      observer.observe(element, {
        attributeFilter: [tagName],
        subtree: true,
        childList: true,
      })
    ),
  disconnect: (element) =>
    directives.forEach(({ observer }) => observer.unobserve(element)),
};

window['customDirectives'] = customDirectives;
