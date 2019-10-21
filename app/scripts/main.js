/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          const installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here

  // TASK 1
  const $btn = document.getElementById('btn');
  const $baconList = document.getElementById('baconList');
  if( $btn && $baconList ){
    $btn.addEventListener('click', function(){
      $baconList.appendChild( $baconList.querySelector('img').cloneNode(false) );
    });
  }

  // TASK 2

  const validateText = function(input){
    return String(input).trim() !== '';
  };

  const validateEmail = function(input){
    let pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return pattern.test( String(input).trim() );
  };

  const validatePostalCode = function(input){
    let pattern = /^\d{5}$/;
    return pattern.test( String(input).trim() );
  };

  const validatePhone = function(input){
    let pattern = /^\(()\d{3}\)\ \d{3}\-\d{2}\-\d{2}$/; // this will match exact patter as in input placeholder, but it's better to use some advanced libraries because phone numbers are quit complicated around the world
    return pattern.test( String(input).trim() );
  };

  const validateCreditCard = function(input){
    let pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    return pattern.test( String(input).trim() );
  };

  const validateCVV = function(input){
    let pattern = /^\d{3}$/;
    return pattern.test( String(input).trim() );
  };

  const validateExpirationDate = function(input){
    let pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return pattern.test( String(input).trim() );
  };

  const cleanInputErrorOnChangeEvent = function(){
    this.parentNode.classList.remove('form-error');
  };

  const $checkout = document.getElementById('checkout');
  if( $checkout ){

    const $modal = document.querySelector('.modal');
    const $modal_body = $modal.querySelector('.modal__body');
    $modal.querySelector('.modal__btn-ok').addEventListener('click', function(){
      $modal.classList.remove('show');
    });

    $checkout.querySelectorAll('input, select').forEach( (item) => {
      item.addEventListener('change', cleanInputErrorOnChangeEvent);
      item.addEventListener('keyup', cleanInputErrorOnChangeEvent);
    });

    $checkout.querySelector('form').addEventListener('submit', function(e){
      let errors = [];

      const $inputs = this.querySelectorAll('input, select');
      $inputs.forEach( (item) => {

        const type = item.dataset.type ? item.dataset.type : 'text';
        let isValid = true;

        switch( type ){

          case 'email':
            isValid = validateEmail(item.value);
            errors.push( 'Please enter a valid email' );
            break;

          case 'postal_code':
            isValid = validatePostalCode(item.value);
            errors.push( 'Please enter a valid postal code, e.g. 10001' );
            break;

          case 'phone':
            isValid = validatePhone(item.value);
            errors.push( 'Please enter a valid phone number, e.g. (212) 692-93-92' );
            break;

          case 'credit-card':
            isValid = validateCreditCard(item.value);
            errors.push( 'Please enter a valid credit card number, e.g. 0000-0000-0000-0000' );
            break;

          case 'cvv':
            isValid = validateCVV(item.value);
            errors.push( 'Please enter a valid cvv code, e.g. 000' );
            break;

          case 'expiration_date':
            isValid = validateExpirationDate(item.value);
            errors.push( 'Please enter a valid expiration date (MM/YY), e.g. 12/23 ' );
            break;

          case 'text':
            isValid = validateText(item.value);
            errors.push( 'Please fill empty fields' );
            break;

        }

        if( !isValid ){
          item.parentNode.classList.add('form-error');
        }

      });

      if( errors.length > 0 ){

        e.preventDefault();
        e.stopImmediatePropagation();

        $modal_body.innerHTML = errors.join("<br/>");
        $modal.classList.add('show');

        return false;

      }else{

        // allow browser to post form or prevent, serialize and send data to api

      }

    });
  }

})();
