import { Component } from '@marcellejs/core';
import View from './umap.view.svelte';

export class Umap extends Component {
  constructor(options) {
    super();
    this.title = 'umap [custom module 🤖]';
    this.options = options;
  }

  mount(target) {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        options: this.options,
      },
    });
  }
}
 