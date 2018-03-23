(function() {
  'use strict';
  
  let store = {
    date: "",
    baseCurrency: "GBP",
    rates: {},
    amountFrom: 1,
    convertedAmount: 1,
    currencyFrom: 'GBP',
    currencyTo: 'EUR',
    rateFrom: 1,
    rateTo: 1,
    amountFromElement: null,
    currencyFromElement: null,
    currencyToElement: null
  };

  function getData() {
    return fetch("https://api.fixer.io/latest?base=GBP").then(res =>
      res.json()
    );
  }

  function setCurrencyOptions(data) {
    let selectElements = document.querySelectorAll("select.currency");

    const currencyOptions = Object.keys(store.rates);

    selectElements.forEach(element => {
      currencyOptions.forEach(value => {
        let optionElement = document.createElement("option");
        optionElement.value = value;
        optionElement.appendChild(document.createTextNode(value));
        element.add(optionElement);
      });
    });
  }

  function cacheData(data) {
    store.date = data.date;
    store.baseCurrency = data.base;
    store.rates = data.rates;
    Object.assign(store.rates, {"GBP": 1});
  }

  function getRateForCurrency(currency) {
    return store.rates[currency];
  }

  function currencyCalculator(amount, rateFrom, rateTo) {
    return amount / rateFrom * rateTo;
  }

  function amountChangeHandler(event) {
    store.amountFrom = event.target.value;
    store.amountToElement.dispatchEvent(store.calculateEvent);
  }

  function currencyFromChangeHandler(event) {
    store.currencyFrom = event.target.value;
    // TODO: change to dispatching actions to update store
    store.rateFrom = getRateForCurrency(store.currencyFrom);
    store.amountToElement.dispatchEvent(store.calculateEvent);
  }

  function currencyToChangeHandler(event) {
    store.currencyTo = event.target.value;
    store.rateTo = getRateForCurrency(store.currencyTo);
    store.amountToElement.dispatchEvent(store.calculateEvent);
  }

  function calculateHandler(event) {
    let calculatedAmount = currencyCalculator(store.amountFrom, store.rateFrom, store.rateTo);

    store.amountToElement.value = calculatedAmount;
  }
  
  function addEventListeners() {
    store.calculateEvent = new Event('calculate');
    
    store.amountToElement.addEventListener('calculate', calculateHandler);
    
    store.amountFromElement.addEventListener(
      "input",
      amountChangeHandler
    );
    store.currencyFromElement.addEventListener(
      "input",
      currencyFromChangeHandler
    );
    store.currencyToElement.addEventListener(
      "input",
      currencyToChangeHandler
    );
  }

  function getDomElements() {
    store.amountFromElement = document.getElementById("amount");
    store.currencyFromElement = document.getElementById("rateFrom");
    store.currencyToElement = document.getElementById("rateTo");
    store.amountToElement = document.getElementById("amountTo");
  }

  function initialiseApp() {
    // Set default values
    store.currencyFromElement.value = store.baseCurrency;
    store.currencyToElement.value = store.currencyTo;
    store.rateFrom = 1;
    store.rateTo = getRateForCurrency(store.currencyTo);
    store.amountToElement.dispatchEvent(store.calculateEvent);
  }
  
  getData().then(data => {
    cacheData(data);
    console.log('Rates', store.rates);
    getDomElements();
    addEventListeners();
    setCurrencyOptions(data);
    initialiseApp();
  });
})();