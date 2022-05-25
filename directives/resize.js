const ro = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    const test = document.createElement('div');
    test.style.width = target.getAttribute('resize');
    target.appendChild(test);
    const minToPixels = parseFloat(getComputedStyle(test).width);
    target.removeChild(test);
    // `true` if the container is wider than the minimum
    const isWide = contentRect.width > minToPixels;
    // toggle the class conditionally
    if (isWide) {
      target.setAttribute('resize-max', '');
      target.removeAttribute('resize-min');
    } else {
      target.removeAttribute('resize-max');
      target.setAttribute('resize-min', '');
    }
  }
});

const ResizeDirective = {
  connected: ro.observe.bind(ro),
  disconnected: (element) => {
    ['resize-max', 'resize-min'].forEach(element.removeAttribute.bind(element));
    ro.unobserve(element);
  },
};

customDirectives.define('resize', ResizeDirective);
