# Web Components Workshop

## :point_down: Start Here

The `main` branch is your playground to follow along with the workshop.

This workshop is divided into modules and sections. To see the end result of each section, run `git checkout {module}.{section}`. Any project setup related to that section can be found in the README.

## FAQ

### What are web components, and why should I care?

Web components are actually a collection of native browser API's including [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), and HTML tags like [`<template>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement) and [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/API/Element/slot). These API's allow developers to build highly reusable components without a dedicated framework tooling such as React, Angular, or Vue.

**These well-supported API's have caused a slow but definite shift in how the web community approaches builds UI for web**, manifesting in one of two ways:

1.  Updating popular frameworks to use web component API's under the hood
2.  Building web components directly, but supplementing gaps like reactive properties, state management, and performant rendering with specific tooling for each challenge.

The second approach has itself created loose frameworks like [Lit](https://lit.dev/), [Stencil](https://stenciljs.com/), and [Hybrids](https://hybrids.js.org/#/).

While it would be easy to simply advocate and teach these new frameworks, **the goal of this workshop is to work as closely as possible with web components**, addressing the core reactive UI problems head on, and usually with more than one solution. This approach will equip developers to pick tools for their projects that balance control, abstraction, elegance, maintainability, and testability.
