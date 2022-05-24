const ro = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    const test = document.createElement('div');
    test.style.width = target.getAttribute('threshold');
    target.appendChild(test);
    const minToPixels = parseFloat(getComputedStyle(test).width);
    target.removeChild(test);
    // `true` if the container is wider than the minimum
    const isWide = contentRect.width > minToPixels;
    // toggle the class conditionally
    if (isWide) {
      target.setAttribute('above-threshold', '');
      target.removeAttribute('below-threshold');
    } else {
      target.removeAttribute('above-threshold');
      target.setAttribute('below-threshold', '');
    }
  }
});

const ResizeDirective = {
  connected: ro.observe.bind(ro),
  disconnected: (element) => {
    ['above-threshold', 'below-threshold'].forEach(
      element.removeAttribute.bind(element)
    );
    ro.unobserve(element);
  },
};

customDirectives.define('resize', ResizeDirective);
