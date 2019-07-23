// 3rd party packages for IE polyfills, etc
// https://github.com/iamdustan/smoothscroll
import "core-js"; // Gives us es6 native methods
import "custom-event-polyfill"; // Allows custom events in IE 11
import "whatwg-fetch"; // Gives us fetch method
import { polyfill } from "smoothscroll-polyfill"; // Gives us element.scrollTo, etc

// kick off the polyfill!
polyfill();

// document.querySelector('.hello').scrollIntoView({ behavior: 'smooth' });
