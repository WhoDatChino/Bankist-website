'use strict';

// DEFINING VARIABLES
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const message = document.createElement('div');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const contentArea = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const headerElement = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

///////////////////////////////////////
// FUNCTIONALITY
console.log(header.getBoundingClientRect());
// ////////// BUTTON SCROLLING TO SECTION 1
btnScollTo.addEventListener('click', function (e) {
  // => Get co-ordinates of element you want to scoll to
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ////////// OPEN MODAL WINDOW
const openModal = function (e) {
  // When you click on an <a> tag, it automatically jumps to the top of the web page
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// .querySelectorAll does not create an array but rather a node list. Node lists dont have al the same methods as arrays but it does have the forEach() method
btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});
// These two blocks do essentially the same thing but the above is the much cleaner method of writin it
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

// ////////// CLOSE MODAL WINDOW
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ////////// PAGE NAVIGATION - EXPLANATION UNDER EVENT DELEGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    console.log(`link`);
  }
});

// ////////// TABBED COMPONENTS
// Start by selecting the tabs - top of page
// Functionality
// -> Event handlers to the buttons
//   -- Making use of event delegation by attaching fuction to a common parent
tabsContainer.addEventListener('click', function (e) {
  // Matching strategy
  const clicked = e.target.closest('.operations__tab'); // Need to add closest method cz the tabs all have <span> child elements. When you click on them, they do not select the button. closest() makes sure that if the span tag is clicked, it will select the closest parent w/ the specified class which happens to be the tab itself. When you click the tab, the closest() method has no effect cz it has the same class name as the one specified in the meethod
  // console.log(clicked);

  // -> Ignore clicks that return null. In this case it is clicks in the tabs-container. This happens cz the eventHandler was attached to the parent of the tabs and the closest() method cant find a parent w/ the class name we specified
  if (!clicked) return; // Called a guard clause. It is an if statement that returns early if some condition is matched. When there is nothing clicked, we want the function to return. If clicked is a falsy value (when clicking in tabs container), then !falsy becomes true and the function returns. If something valid is clicked, then the function doesnt return.
  // if(clicked){
  //   clicked.classList.add('operations__tab--active');
  // } // Above solution is more modern and clean

  // Activate Tab
  // Remove the .operations__tab--active class from all the tabs before adding it back to the one that is clicked. Have to use forEach to remove rather than like adding the class in next block cz w/o it, the .operations__tab--active class wont be removed from the previous tab when a new one is clicked. So you remove it from ALL (forEach) tabs when a new tab is clicked. Common coding practise
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // The active tab has a css class applied called .operations__tab--active which moves the tab up slightly to differentiate which is the active one
  clicked.classList.add('operations__tab--active');

  // Activate content area
  // Info for which content area should be displayed is contained w/in the data attribute

  // Removing any previous selection (removing the active class)
  contentArea.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Making the correct content visible
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // What is happening? => Dynamically selecting the content area based on a click to its corresponding tab. Each tab has a data attribute (data-tab = x  -> unique for each tab [in HTML]) that contains a value that corresponds w/ the number in the class of each content area. Including template literal for dynamic selection. Info on the tab that is clicked is stored in the clicked variable, then you just need to access the data attribute to retrive the number so that the correct content area can be selected in the querySelector. Once the correct tab is selected, you want to add the class that makes it visible (operations__content--active => chnges diplay property to something that is not 'none')

  // The idea behind building components like this is to simply add and remove CSS classes as necessry to manipulate content for our needs
});

// ////////// FADING NAV COMPONENTS
// Mouseover and mouseenter are pretty much the same except for the fact that mouseenter does not bubble and we need that functionality cz we are making use of event delegation.
// Opposite of mouseenter : mouseleave. Opposite of mouseover : mouseout => needed to remove the animation when user no longer hovers over element

// Refactoring code
// Any handler function can only really have 1 real argument therefore only 1 real parameter => the event. If you want to pass additional arguments into the handler function, you need to make use of the 'this' keyword as noted
const handleHover = function (e) {
  // console.log(this, e.currentTarget);

  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(ele => {
      if (ele !== hovered) ele.style.opacity = this; // 'this' keyword essentially becomes the opacity
    });
  }
};

// nav.addEventListener('mouseover', function(){ //JS expects a function as the second argument. It will not work to call the handleHover function w/ its own arguments
// handleHover(e, 0.5) // This would work as the eventHandler function is calling another function. However, this isnt very elegant
// });
nav.addEventListener('mouseover', handleHover.bind(0.5)); // This works because bind() returns a new function (creates a copy of the function its called on). In this function, the 'this' variable will be set to whatever value we pass into bind. handleHover.bind(0.5) is itself a new function where 'this' variable is set to 0.5.
// USing the bind() method to pass an 'argument' into the handler function. If you wanted to pass in multiple values into bind(), you could always pass in an array or an object

nav.addEventListener('mouseout', handleHover.bind(1));

/*
nav.addEventListener('mouseover', function (e) {
  // Matching the element we are looking for => in this case: elements w/ nav__link class. No need to make use of closest methid cz these elements have no children that you might accidentally click
  if (e.target.classList.contains('nav__link')) {
    // Selecting the one that is being hovered
    const hovered = e.target;
    // Need to select sibling elements => go to parent and select from there
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link'); // Can select the highest possible parent, doesnt have to be a direct parent. This is good practise cz makes code scalable incase we later decide to change the HTMl, the JS will still work
    // const logo = hovered.closest('.nav').querySelector('img') // This is the querySelector to use if you want to select any image that has an image tag
    siblings.forEach(ele => {
      // Checking if current element is not the link itself
      if (ele !== hovered) ele.style.opacity = 0.5;
    });
  }
});

nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    // Selecting the one that is being hovered
    const hovered = e.target;
    // Need to select sibling elements => go to parent and select from there
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link'); // Can select the highest possible parent, doesnt have to be a direct parent. This is good practise cz makes code scalable incase we later decide to change the HTMl, the JS will still work
    // const logo = hovered.closest('.nav').querySelector('img') // This is the querySelector to use if you want to select any image that has an image tag
    siblings.forEach(ele => {
      // Checking if current element is not the link itself
      if (ele !== hovered) ele.style.opacity = 1;
    });
  }
});
*/

// ////////// STICKY NAV BAR
// When do we want the nav bar to become sticky? We want it at the point where the header element is no longer visible
const stickyNav = function (entries) {
  // Dont need to loop over the entries cz there is only 1 threshold
  const [entry] = entries;
  // console.log(entry);

  // Making use of isIntersecting property of IntersectionObserverEntry to add and remove the sticky class to the nav. W/o it, the nav will be sticky at every point -> only want it sticky when header is not in view
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

// Creating observer
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // Making the Nav bar appear when the distance between the bottom of the header and the top of the viewport is the same pixel height as the nav bar itself. Only works w/ px, not rem's and em's and %. Important to use template literal cz of responsive design
});
// We want to observe the header
headerObserver.observe(headerElement);

// ////////// REVEALING SECTION ELEMENTS ON SCROLL
// Section elements begin w/ a class called section--hidden which sets the opacity to 0 and transforms it 8rems in the y direction. To get the scroll in animation, we remove this class which will give the illusion of the section animating into view

const revealSection = function (entries, observer) {
  const [entry] = entries; // Only 1 threshold again. Need to get the entry from the entries using destructuring
  // console.log(entry);

  // We are observing all of the sections at once, but we need a way of identifying the section that is currently in the viewport and displaying only that section => make use of target property in entry variable
  // Need the logic cz else the firt section always loads up too soon cz there is always a IntersectionObserverEntry displayed on page loadup w/ the target of section-1. However, the isIntersecting value is false so we can take advantage of that
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
  } else {
    return;
  }
  observer.unobserve(entry.target); // Stops the observation once the target (section) has been observed => improves performance
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// allSections defined above
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// ////////// LAZY LOADING IMAGES
const imageTargets = document.querySelectorAll('img[data-src]'); // We do not want to select every image on the webpage as we dont want them all to be lazy loaded (like icon and logo). To specify that we are searching for an hTML element w/ a specific property, use the above notation. Selecting img's w/ property of data-src
// console.log(imageTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries; // Only 1 threshold so only 1 entry
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace placeholder image and remove blur filter class
  entry.target.src = entry.target.dataset.src; // entry.target is the element that is currently being intersected (the placeholder image in this case). Setting the src of the target to the data-src attribute stored in the HTML which contains the URL to the high res image. Need to use dataset naming convention when accessing data attributes.
  // JS changes the src of the image behind the scenes and when it does so, it will emit what is called a load event. We can then listen for this event and then remove the filter class on the images.
  // entry.target.classList.remove('lazy-img'); // Cannot simply remove the class, need to wait for the load event. If you do this, this will impact a user who has a slow internet connection and defeats the purpose of using the lazy image loading. The low res img will show up immediately and after a while the high res will eventually be loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // Now the class will only be removed once the image has loaded in the background. Therefore the image will stay completly blurred until the high res one has loaded up.
  });

  observer.unobserve(entry.target); //
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // Makes the images load a little bit before the user scrolls to them so you can give the illusion of a faster website
});

imageTargets.forEach(img => imageObserver.observe(img)); // Need to loop over images cz we want the imageObserver to observe each image

// ////////// BIILDING A SLIDER
// Slider works by clicking directinal buttons, using arrow keys amd clicking dots beneath the slider

// Insert all the functionality of the slider in 1 function that we immediately call. We could even pass in values/ options into this entireSliderFunctionality function. Common practise to do so that we dont 'pollute the global variables'
const entireSliderFunctionality = function () {
  const slides = document.querySelectorAll('.slide');
  // Note that the slides already come with the css property overflow : hidden
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.7)';
  // slider.style.overflow = 'visible';

  // Creating starting position for slides. They need to be next to eachother by using css translateX property.
  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); // Multiplying the index value of each slide by 100% to give each their starting position
  // 1st slide: 0%; 2nd: 100%; 3rd: 200%. Width of each slide is 100%

  // Dots
  // Dots will have a class of dots__dot and each have a unique data attribute called data-slide which has a value that corresponds w/ the slide that will be shown when the dots are clicked
  const createDots = function () {
    slides.forEach(function (slide, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = 'dots__dot' data-slide = '${i}' ></button>`
      ); // Buttons get index values of slides as data attribute so we can later read this value to connect the button to the correct slide when one of the dots is clicked
    });
  };

  // This function will be called when the nextSlide and prevSlide functions are called and in the eventListener for when the dots are clicked
  const activeDot = function (curSlide) {
    // first need to remove any styling applied to another button, like what we had to do with the tabs component
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Selecting the dot we want to attach the styling class to
    document
      .querySelector(`.dots__dot[data-slide='${curSlide}']`)
      .classList.add('dots__dot--active'); // Data attribute set dynamically based on the number passed into this function which comes from the currentSlide variable that we call this function w/
  };

  // Slide movement
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    // 1st slide: -100%; 2nd: 0%; 3rd: -100%
    // What is happening? starts at slide 0. When arrow is clicked, value for currentSlide becomes 1. The currentSlide value must be subtracted from index position so that the slide position formula will have the desired end positions

    // Code if were to be called only once on the right button:
    // slides.forEach(
    //   (s, i) => (s.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
    // ); // Refactored into a functin cz this line is used more than once
  };

  // Button functionality - refactored cz use twice
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      // maxSlide is the length of the array (nodeList)
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      // maxSlide is the length of the array (nodeList)
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  // Sets starting conditions for the functions we call. Could be done seperately outside of this init function but this is good programming practise
  const init = function () {
    // Start Position
    goToSlide(0); // Calling the function so that the webpage loads up on slide 0
    createDots();
    activeDot(currentSlide); // Sets starting position for dot styling
  };

  init();

  // Going to the next slide => means to change the value in the transform property of the slides
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Using arrow Keys
  document.addEventListener('keydown', function (e) {
    // console.log(e); // We use this so we can find they key of the button press we want to record. Key of right arrow is ArrowRight

    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // Dot Button functionality
  // Making use of event deleagtion again cz it has better performance when compared to attaching an eventListener on each object
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide // Getting the dataset value.
      const { slide } = e.target.dataset; // Has same output as above but making use of destructuring cz 'slide' values on either side of assignment operator were the same
      // Going to the slide we selected
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

entireSliderFunctionality();
// /////////////////////////////////////
// /////////////////////////////////////
// /////////////////////////////////////

// /////////////////////////////////////
// LECTURES
/*
// ///////////////// HOW THE DOM REALLY WORKS

// DOM is the interface btw the browser (HTML documents rendered in and by the browser) and your JS code
// Can create, delete, modify HTML elemenst, styles, classes, attributes and respond to events
// Works cz DOM tree generated we interact with
// - Tree like structure made from various nodes
// - DOM has MANY methods and propperties inorder to inteact w/ tree
// - Different types of nodes in trees
// -- HTML elements, text
// -- These DOM methods and properties are organised into the different types of objects

// ///////////////// SELECTING, CREATING AND DELETING ELEMENTS

// SELECTING ELEMENTS
// console.log(document.documentElement); // Special way of selectng the entire document (webpage) => just typing document is not enough when you want to select the entire document as it is not the real DOM element; that is why you include the .documentElement. Used in a situation where you want to apply a css style to an entire page
// console.log(document.head); // Selecting the head and body
// console.log(document.body);

// const header = document.querySelector('.header'); // Selects the first element whos class matches this one
// const allSections = document.querySelectorAll('.section'); // Selects multiple elements with the same name. Returns a node list containing all the elements selected
// console.log(allSections);

// As from previous lecture, these methods are not only available on the document but also on all the elements. Used a lot when selecting child elements

document.getElementById('section--1'); // USed when selecting elements that have an id rather than a class. No need for '#' like when these elements are selected using querySelector
const allButtons = document.getElementsByTagName('button'); // Gets all the elements w/ the name of button (note no selector '.'). Unlike querySelectorAll, this returns an HTML collection and NOT a node list. An HTML collection is a live collection => if the DOM changes, then this collection is automatically & immediately updated. This selector is useful because of this auto-update feature. The same doesn't happen with a node list.
// If you use querySelectorAll to retrieve a node list with 4 elements for example and you delete one of those elements after the fact. When you read the original nodelist again, it will still show all 4 as being present. W/ getElementsByTagName, the collection is automatically updated and the original collection will only show 3 elements
// console.log(allButtons);

document.getElementsByClassName('btn'); // Similar to getElementById and getElementsByTagName. No selector again. Also returns a HTML collection

// MOst of the time you will just use querySelector and querySelectorAll UNLESS you need the HTML collection

// CREATING AND INSERTING ELEMENTS

// .insertAdjacentHTML() => most commonly used way of inserting html elements onto a page -> see MDN

const message = document.createElement('div'); // Passing in the string of the tag name. This returns a DOM element that you can save into a variable. At this point, this element is not in the DOM, it is simply a DOM object that we can use to do something on it later. If you want it on the page, you have to manually insert it on the page
message.classList.add('cookie-message'); // class defined in CSS
// message.textContent = `We use cookies for improved functionality and analytics.`;
message.innerHTML = `We use cookies for improved functionality and analytics. <button class = 'btn btn--close-cookie'>Got it!</button>`; // At this point you have a button element that is created and styled but is still not yet inserted in the DOM
// Can use both the textContent and the innerHTML properties to set AND read contents

// header.prepend(message); // This inserts the newly created element into the DOM, specifically into the header we selected earlier. Prepend adds the element as the first child of the element it is attached to => the header in this case
//header.append(message); // Inserts the element as the last child. NOTE: When you insert the same element into multiple places like here, it will only show up in the last one. This is because it is an element in the DOM at this point and it cannot be in multiple places at once, like a person. A DOM element is unique, it cant exist in multiple places at the same time.
// You can use prepend and append to insert elements & to move them cz of the uniqueness characteristics of DOM elements


// Inserting multiple copies of the same element => you would have to copy the first element
header.prepend(message);
header.append(message.cloneNode(true)); // cloneNode is the method to call to create a copy of the element it is attatched to. The argument for that method simply allows/disallows all the child elements of the copied element to be copied as well
// This results in the message showing up in 2 places => or rather the message and a copy of itself


header.before(message); // This method inserts the element BEFORE the header -> as a sibling element
// header.after(message) // Inserts element AFTER the header -> also a sibling

// DELETING ELEMENTS

// Making it so that we can delete the cookie message once the GOT IT! button is pressed
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // NOTE: the element is stored in memory in the message variable therefore we dont need the document.querySelector again
  });
// .remove is a very recent addition. Previously, you had to select the parent element and then remove the child from there:
// message.parentElement.removeChild(message) => here you are movin up and down in the DOM tree, known as DOM traversing

// ////////////////// STYLES, ATTRIBUTES AND CLASSES

// STYLES
// To set a style on an element: element dot style dot propertyName (camelCase)
message.style.backgroundColor = '#37384d';
message.style.width = '120%'; //NOTE: You have to write the value exactly as you would write it in CSS therefore you have to specify the units
// The styles are added as inline styles
// You can use the style property to read values of certain properties:
console.log(message.style.backgroundColor);
console.log(message.style.height); // BUT, it only works for styles that we have set ourselves in JS using the style property. If the style is defined in the style sheet, you wont be able to access it here

console.log(getComputedStyle(message).color); // getComputedStyle returns a huge object containing all the styles associated w/ the selected element. To boil it down, we usually specify a specific attribute that you want to target
console.log(getComputedStyle(message).height); // The result of this is a string => numbers displayed as strings.

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // Since a string is returned, we use another method to read the number value only and add 40 px to it

// CSS Variables (CSS custom properties) => everything defined in the :root class in CSS.
// -CSS Variables have the same idea behind them as JS variables where you defined it once but use it multiple times
// - :root in CSS is equivalent to documentElement in JS

document.documentElement.style.setProperty('--color-primary', '#21A3FE'); // document.documentElement selects the :root in CSS. Then we attach the setProperty method where the first arg is the name of the class you are looking to target and the second is color/attribute you want to change it to. YOu cant change CSS custom properties as as you have done w/ other styles; need to make use of the setProperty method. SetProperty can be used on any property, not just colors

// ATTRIBUTES
// In HTML, attributes are the things that make up each tag :
// <img
//    src="img/logo.png"
//    id="logo"                         => All of these are attributes and can be altered using JS
//    alt="Bankist logo"
//    class="nav__logo"
//    designer = "Keano"                => Not a standard property that is expected to be found in the img tag
//    data-version-number = "3,0"
// />

// Reading attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);

console.log(logo.src); // This displays the absolue URL for the image. The URL in the HTML tag is just the relative URL, relative to the file in which the HTML page is located
console.log(logo.getAttribute('src')); // Displays the link exactly as it is written in the HTML -> relative URL

// Same thing happens w/ links
const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href')); // MUST be in quotes
// Both are the same cz the link in the HTML is already the absolute URL

// If these attributes are defined in the HTML, JS will create these properties on the object. However, it will only do this with standard attributes. If you add a non-standard attribute to the HTML tag, JS will NOT create that property on the object
console.log(logo.className);

//    Non-standard attributes
console.log(logo.designer); // non standard
console.log(logo.getAttribute('designer'));

// Setting Attributes
logo.designer = 'Beautiful minimalist logo';
logo.setAttribute('company', 'Bankist'); // Creates a new attributes on the selected element
console.log(logo);

// Data Attributes
// Special kind of attributes that start w/ the word: 'Data'
console.log(logo.dataset.versionNumber); // Note this only works for data attributes -> reads the value stored in them. Name is specified in camelCase rather than the '-' like in the HTML
// Used often when working w/ the UI when you need to store data in the UI (basically the HTML code)

// CLASSES
logo.classList.add('c', 'j'); // Adding and removing multiple classes from an element
// logo.classList.remove('c', 'j');
logo.classList.toggle('c');
console.log(logo);
logo.classList.contains('c'); // not .inlcudes like in arrays

// can use the className property to set a class name. DONT USE THIS as it removes all the classes and only allows the use of the single class you specify here to be in the element
// logo.className = 'keano' // This will override whatever is already there

// ////////////////// IMPLEMENTING SMOOTH SCROLLING

// you want the first button to scroll to the beginning of section 1 HTML element
const btnScollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// => Add event listener to button
btnScollTo.addEventListener('click', function (e) {
  // => Get co-ordinates of element you want to scoll to
  const s1coords = section1.getBoundingClientRect(); //Returns a DOM rectangle that is an object that contains x-pos, y-pos, width, height, etc of begin of element. The values returned in the object vary depending on the current viewport selection (ie. Where you are on the actual webpage)
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect()); // e.target refera to the element to which the eventListener is attached
  console.log('Current scroll (X/Y): ', window.pageXOffset, window.pageYOffset); //How to see where you are on the page x & y positioning. y is distance btw current position of top of viewport and the top of the webpage. Measured in pixels
  console.log(
    'Viewport height/width:',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // Reading height & width of viewport

  // => Scrolling
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  ); // Global function available on window object. 1st arg is left position. The 2nd argument is the top position (position from top of the viewport) (NOTE: the top that is specified here is always relative to the top of the viewport, and not the top of the document). Both values obtained from DOM rectangle. You need to add the current scoll position to the top value in order for the scoll function to work correctly wherever you are on the page, otherwise w/o that, the scroll feature will only work correctly when the viewport and top of webpage are at the same position. Adding the current scoll position makes it so that the area to scoll is no longer relative to viewport, but is now relative to top of page

  // Way of doing the above but w/ smooth scrolling.
  // Need to specify an object in place of the 2 arguments. in the object you have the left and top positions again as above
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  // To implement smooth scrolling, you need to specify an object with the left, top and behavior properties

  // Modern way of scrolling
  section1.scrollIntoView({ behavior: 'smooth' }); // Need to specify an object w/ the behaviour property
  // This only works w/ modern browsers.
});

// ////////////////// TYPE OF EVENTS AND EVENT HANDLERS

// Event = A signal genereated by a DOM node.
// - mouse click, mouse movement, user generating fullscreen mode etc
// - no matter if we are listening for an event or not, that event will always happen when a user clicks, or scolls or whatever

// See MDN for event reference

// Mouse enter event => Similar to the hover effect in CSS; fires whenever the mouse enters a certain element
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('addEventListener: GREAT! You are reading the heading!');
  h1.removeEventListener('mouseenter', alertH1); // This is the reason you export the function into a variable -> dry code. Can have this anywhere in code eg. in a setTimeout function
};

h1.addEventListener('mouseenter', alertH1);
// removing eventListener

// Another way of attaching an eventListener to an element by using the onEvent property directly on the element. However, this is the old school way of doing things, but it is good to know nevertheless
// In this example, we are looking for a mouseEnter event
// h1.onmouseenter = function (e) {
//   alert('addEventListener: GREAT! You are reading the heading!');
// }; // Simply set the property to the function defined in the addEventListener
// For each of the events in the MDN event reference, there is an onEvent property

// 2 reasons why addEventListener is better:
//  a) Allows us to add multiple event listeners to the same element. onEvent will only allow 1 as any subsequent onEvent will override the preceding one
//  b) Can remove an event handler incase we dont need it anymore
//    - After you have listened for an event and then handled that event, you can then remove that eventListener

// 3rd way of handling events: Using an HTML attribute
// - Shouldnt be used, just for curiosity sake
// - Found in h1.headerTitle in HTML sheet

// ////////////////// EVENT PROPAGATION: BUBBLING AND CAPTURING
// JS events have important properties know as capturing phase and bubbling phase

// click event is generted as soon as link is clicked. However, it does not happen at the target element (the element where the event happens - anchor element in this case); but rather in the root element => very top of DOM tree.
// This is the point where the capturing phase occurs. The event travels all the way down from document root to target element; it passes through every single parent element of the target element. When the event reaches the target, the target phase begins. Events can be handled right at the target using event handlers. This is the time when the event handler waits for the event and then executes the function when the event occurs
// After reaching the target, the event travels back up to the document root in the bubbling phase. The event will again pass through the parent elements. It is as if the event happens in all of the parent elements as well when it bubbles up => therefore if you attach the exact same eventListener to a parent element (different value for querySelector), then you would get the exact same function execution for the parent as well even though the eventListener was attached to a different element. Therefore you are left w/ the function executing twice when the link is clicked
// By default, events can only be handled in bubbling and target phases, however you can setup eventListeners in such a way that they listen to events in the capturing phase instead.
// Not all events have a bubbling and capturing phase. Some events are created right on the target element and therefore can only be handled there.
// Events propogate -> process of capturing and bubbling from one place to another

// This all happens cz there is an event handler attached to an element. Eg. when you click on a button, you are not only clicking that button, but you are also clicking on that button's parent and the parent's parent and so on. JS goes through all the parents one by one to see if if has an eventHandler and execute the function if it does have it

// ////////////////// EVENT PROPAGATION IN PRACTISE

// Creating a random colour - Creating a string: rgb (255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColour = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColour(0, 255));

// Attaching an event handlr to the 'feature' button in nav link and attach event handlers to all its parents
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColour(); // in an event handler, the 'this' keyword points to the element to which the event handler is attached to -> nav-link in this case
  console.log(`LINK`, e.target, e.currentTarget); // the target is the element from which the event originated. .nav__link will be displayed for all the subsequent parents. Just here to show you where the event originated. The target is NOT the element on which the handler is attached. In this case it shows the origination point of where the click happened. Returns the HTML line (element) where the event orginated from. Target element always the same for parents cz all 3 handler functions are handling the exact same event. The 'e' that all 3 recieve is the same event cz of event bubbling
  // e.currentTarget is the element on which the eventHandler is attached. therefore is different for each element. Also returns the HTML code for that element. currentTarget === 'this' keyword
  console.log(e.currentTarget === this);
  // e.stopPropagation(); // This stops the event propagation from here -> event never reaches parent elements => not a good idea to do in practise, only useful in complex code bases w/ many handlers for the same events
});
// Parent of .nav__link element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColour();
  console.log(`CONTAINER`, e.target, e.currentTarget);
});
// When you click on the standalone 'feature' link, not only does it change colour, but so does the parent container in which it is stored. Due to the fact that event happens at document root and then travels down to the target element. From there it bubbles up. Bubbling up means that it is as if the event happens in all of the parent elements as well which is why all the parents also change colour
// Parent of .nav__links
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColour();
  console.log(`NAV`, e.target, e.currentTarget);
});

// Remember that addEventListener is only listening for events in the bubbling phase, but not in the capturing phase cz the capturing phase is not really that useful to us. Therefore it is the default. However you can change this by adding a third parameter to the eventListener function: 'true' (by default its false). Instead of bubbling up from bottom, it comes down from parent. Where it is true, the eventHandler no longer listens for bubbling events, but rather capture events. All elements stll working w/ the same event, they are just looking in different phases.

// Bubbling phase useful for event delegation
// Bubbling and capturing only exists cz of historical reasons when different browsers implemented different versions of JS

// ////////////////// EVENT DELEGATION: IMPLEMENTING PAGE NAVIGATION
document.querySelectorAll('.nav__link').forEach(function (ele) {
  ele.addEventListener('click', function (e) {
    e.preventDefault(); // Stopping the <a> tags from navigating around the page. Still useful to keep the anchor tag as it is w/ the href cz we can use it later by taking the attribute and select the element we want to scroll to based on the value in that href cz it essentially looks like the selector for an id
    const id = this.getAttribute('href'); // use getAttribute cz you dont want the absolute URL, you just want the '#section--1'. Therefore you cant write this.href => Remember 'this' points to the element to which the event handler is attached. '#section--1' looks like a selector already so we can select an element based on this and simply scroll to that element. This is a common practise for site navigation. We put the id of the element we want to scroll to inside the href attribute in the anchor tag so that we can read that href in JS and select that element to scroll to. For this example the id of section 1 is section--1 which matches the href in the anchor tag where we want the user to click so that they can be navigated to that section
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
// The above solution works fine for this project, but it is not efficient. We are attaching an event handler to 3 elements which is okay, but in a situation where you need to attach it to 1000 or 10000 elements w/ the forEach method, you will essentially be creating 10000 copies of that function which will impact performance. Solution for this would be event delegation

// Event delegation -> making use of the bubbling feature to add the event listener to a common parent to the elements we are intersted in => the .nav__links in this case
// - Need 2 steps:
//  a) Add event listener to common parent element
//  b) Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // e.target; //This is what will allow us to see where the event happened
  e.preventDefault();

  // Matching strategy - for seeing if an actual link is clicked, which link is clicked and that the link is an acceptable child of the .nav__links element
  // - Check if target element contains the class we are interested in
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); // note use of e.target instead of 'this' cz the href attribute is no longer on 'this' (.nav__links), but it is rather on the element that is clicked
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    console.log(`link`);
  }
});
// This is a much more optimised solution. We add 1 eventHandler to the parent element of all the elements we are interested in; then we simply determine where the click event came from. Needed a matching strategy to ignore clicks that werent on one of the links
// Event delegation also useful in situations where DOM elements do not exist on webpage upon loadup - they are added dynamically as the user interacts. USeful cz you cant add event handlers on elements that do not exist

// ////////////////// DOM TRAVERSING

// Walking through the DOM allows you to select an element based on another element. Sometimes you need to select an element relative to another element eg. selcting a direct child/parent

// Working w/ h1 element in header
const h1 = document.querySelector('h1');

// Going Downwards : selecting child elements
console.log(h1.querySelectorAll('.highlight')); // Selects ALL childern inside h1 element w/ the class of 'highlight', no matter how nested. Other elements on the webpage that have the 'highlight' class will not be selected here cz they are NOT childern of the h1 tag
console.log(h1.childNodes); // Selects the direct children and returns a node list
console.log(h1.children); // Returns a HTML collection containing whatever elements are inside the element the property is attached to => in this case, 2 span tags and a break tag. This only works for DIRECT children
h1.firstElementChild.style.color = 'white'; // W/ this property you are able to set styles and more to the first child of the element selected
h1.lastElementChild.style.color = 'orangered';

// Going Upwards
console.log(h1.parentNode); // Returns the DIRECT parent. Similar to childNodes. Returns an HTML element => in this case the .header_title element.
console.log(h1.parentElement); // Usualy the one we are interested in. However, in this case these 2 return the same thing cz the parent element also happens to be a node (in this case)

// In some cases we might need to find a parent element, no matter how far away it is in the DOM tree (a parent that is not a direct parent) => closest() method
h1.closest('.header').style.background = 'var(--gradient-secondary)'; // Receives a query string like querySelector. These methods dont just allow you to select elements, but they allow you to set them as well. Setting this to a css variable (aka custom property). What is happening here? => the method is selecting the closest parent element to the h1 tag that has a class of 'header' and applies what you set. In this case, the closest element w/ that class is the entire header tag therefore that is the one that is targeted. USeful for event delegation.
// If selector matches the element on which we call the closest() method, then that will be the element that is returned :
h1.closest('h1').style.background = 'blue';
// Can think of closest() as the opposite to querySelector(). querySelector() finds children no matter how deep in the DOM tree while closest() finds parents no matter how far up in the tree

// Going Sideways - accessing sibling elements
// In JS, you can only access direct sibings ie. the previous and the next one
console.log(h1.previousElementSibling); // In this case it returns null cz h1 is the first child of its parent element so there is no sibling element that comes before it
console.log(h1.nextElementSibling); // Does have a next sibling

// Have the same properties for nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// If you need all the siblings, you can move up to parent element and read all the children from there
console.log(h1.parentElement.children); // Returns an HTML collection. HTML is not an array but is still an iterable so therefore can be spread into an array
[...h1.parentElement.children].forEach(function (ele) {
  // Changing styles of all children besides the one selected:
  if (ele !== h1) {
    ele.style.transform = 'scale(0.5)';
  }
});


// ////////////////// BUILDING A TABBED COMPONENT

// Tabbed components appear in many different ways but the idea is that when you click on a tab the content below it will change, you will have multiple tabs

// ////////////////// IMPLEMENTING STICKY NAVIGATION: THE SCROLL EVENT
// In HTML, the whole nav has a class called sticky where css sets the position: fixed, & makes background slightly transparent. We want to implement this only from a certain point where the user scrolls past section 1.
// Will make use of scoll event, which is avaliable on window (not document) => although there is a better way to implement this functionality

const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function (e) {
  // This event will be fired off each time we scroll on the page. This makes it pretty inefficient
  console.log(window.scrollY); // Gives you current scroll position each time event is fired (pos from top of viewport to top of webpage). Note this is on the window object and not the event. Event parameter is pretty useless on window object

  // NAV should become sticky as soon as we reach the position of the first section
  if (window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});

// ////////////////// THE INTERSECTION OBSERVER API
// Allows us to asynchronously observe changes to the way a certain target element intersects another element or the way it intersects the viewport.
// Allows code to register a callback function that is executed whenever an element they wish to monitor enters or exits another element (or the viewport), or when the amount by which the two intersect changes by a requested amount
// Target MUST be a decendant of the root
// Use cases:
// -> Lazy-loading of images or other content as a page is scrolled.
// -> Implementing "infinite scrolling" web sites, where more and more content is loaded and rendered as you scroll, so that the user doesn't have to flip through pages.
// -> Reporting of visibility of advertisements in order to calculate ad revenues.
// -> Deciding whether or not to perform tasks or animation processes based on whether or not the user will see the result.
// To use it, you need to create a new intersection observer

// Callback is called each time target element intersects devices viewport/specified element(root element) at the threshold we define. Or is called 1st time observer is initially asked to watch the target
// Function is called / 2 args: entries, observer
// observer variable we defined gets passed into the callback function. Using the observer is not always useful, but in some situations it is
// Entries is an array of the threshold entries, known as IntersectionObserverEntry object
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};

// Optionas are the conditions under which you want the callback to be called
const obsOptions = {
  // 1st property it needs is root. Root is the element that the target is intercepting (target is section-1)
  root: null, // The element that is used as the viewport for checking visibility of the target. Must be the ancestor of the target. Null allows us to observe our target element intersecting the entire viewport (also the default)
  threshold: 0.1, // Indicates at what percentage of the target's visibility the observer's callback (obsCallback) should be executed. A threshold of 1.0 means that when 100% of the target is visible within the element specified by the root option, the callback is invoked. Can be an array of values eg. Want callback to run every time visibility passes another 25%, specify array: [0, 0.25, 0.5, 0.75, 1]. Applies to bottom & top of element selected. If value is 0, callback executes as soon as target enters view and as soon as it exits
  rootMargin: '30px', // Much like the margin in css, this is a margin around the root. Can specify like in css top, right, bottom, left. Can either grow or shrink each side of root element's bounding box. Default is all 0's
};
const observer = new IntersectionObserver(obsCallback, obsOptions); // Need to pass in a callback function and an object of functions. Defined them externally cz its a cleaner way to do it, but it would work fine if they were inserted here
observer.observe(section1); // Call the observe method and the argument is the target element

// ////////////////// LAZY LOADING IMAGES

// Key to doing this requires having 2 copies for each image
// - 1st copy is very low res and small in size
// - 2nd is the actual high res image you want to display
// Lazy loading helps massively in performance of website

// In HTML:
// <img src="img/digital-lazy.jpg" data-src="img/digital.jpg" alt="Computer" class="features__img lazy-img" />

// src="img/digital-lazy.jpg" => the low res, small image
// data-src="img/digital.jpg" => the high res image. This is a speacial attribute you can use for lazy loading, but any other data attribute would work (not a standard HTML attribute)
// lazy-img => class applied to low res images that blurs them out so user is nonethewiser to the use of the low res image. Idea is that when the user scrolls to this point the blur fliter is removed and the low res image is replaced w/ the high res one

// ////////////////// LIFECYCLE DOM EVENTS

// Lifecycle of the DOM is the point where the user first loads the page until the point where they leave it or close it down.

// DOM content loaded event
// - this event is fired by the document as soon as the HTML content of the page is completly parsed (HTML has been downloaded and been converted to the DOM tree)
// -- All scripts must be downloaded and executed before the DOM content loaded event can happen
// -- This event does NOT wait for images and other resources to load -> just the HTML and JS
// - This is an event we can listen for

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// W/ this, we can execute code that should only be executed after the DOM is available - the JS code
// script tag in html is put at the end of the html so that the dom tree is already created. In this case we do not need to listen for the DOMContentLoaded event.

// Load event
// Fired by the window object once not only the html is parsed, but also all the images and external resouces like css files are completly loaded

window.addEventListener('load', function (e) {
  console.log(` page fully loaded `, e);
});

// Before Unload event
// Also fired by window object
// Created immediately before a user is about to leave a page
// - Can be used to ask users if the are sure they want to leave the page

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // May need to do this in some browsers -> not in chrome
//   console.log('user has left the building', e);
//   e.returnValue = ''; //Need this to see the DOM event displayed -> set the event's return value to the empty string
// });

// Pretty obtrusive to use, only used in certain, unique circumstances - Used when filling out a form or something where data could be lost if they exited 


// ////////////////// EFFICIENT SCRIPT LOADING: DEFER AND ASYNC

// 3 ways to load a js script into the html
//  a) Regular =>    <script src="script.js">
//  b) Async =>      <script async src="script.js">
//  c) Defer =>      <script defer src="script.js">

// JS file is fetched in 1 of 2 places
// 1) In HTML head
// 2) At end of HTML body

// a) + 1 :
// As user loads page, HTMl is parsed by browser. Parsing html is basically building DOM tree fro html elements
// - At a certain point it will find the script tag, fetch it and execute it
// -- During this time the html parsing will stop -> script needs to be fetched and executed first before the rest of the html can be parsed
// -- At the end of that parsing, the DOMContentLoaded will be fired
// - Not ideal in terms of performance cz there is a period of time where the page is doung nothing but loading the script
// -- The scripts are also loaded before the DOM is ready
// Therefore never use this method

// a) + 2
// All the html is parsed by the time the browser reaches the script tag
// - html parsed till the end, the script is then fetched and executed thereafter and then the DOMContentLoaded is fired
// This method is still not ideal cz the script might be downloaded before the html is still being parsed
// Used if you need to support older browsers cz they dont support async/defer

// b) + 1
// Script is loaded at the same time the html is being parsed, in an asynchronous way
// The html parsing still stops for the html execution before it carries on after that has been completed
// - Script is downloaded asynchronously but then its executed right away in a synchronous way
// Overall time for page loading is shorter
// DOMContentLoaded does NOT wait for an async script (usually DOMContentLoaded waits for ALL scripts to execute)
// - DOMContentLoaded fired off as soon as html finished parsing, which can be before scripts are even fetched, nevermind executed
// Scripts NOT guaranteed to be executed in exact order they are set out in the code
// Used w/ 3rd party scripts that dont care about order of execution such as google analytics and ad scripts etc
// - Code that your own code doesnt need to interact w/

// c) + 1
// Script is still loaded asynchronously but the execution of that script is stalled until the html has been completly parsed
// Loading time is similar to b) + 1 => BUT html parsing is never interupted in this method
// - This is exactly what we want
// DOMContentLoaded fires only AFTER defer script is executed
// Scripts guaranteed to be executed in the order they are declared in the code
// Overall best solution -> especially when script execution order is important
// - Use in your own code and when using 3rd party library -> library declared before your own script so your code can use that library => HAVE to use defer (guarantees order of execution)

// b) + 2     &     c) + 2
// Dont make sense
// - Cz fetching and executing script always happens after parsing html
// - async & defer have no practical effect here.

// Different loading strats can be used for different scripts
*/
