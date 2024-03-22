/*Custom slider*/

/*
Autor: Jakiś chłop z internetu

Źródło: https://codingartistweb.com/2021/06/double-range-slider-html-css-javascript/
*/

let $ = (s, c = document) => c.querySelector(s);
let $$ = (s, c = document) => Array.prototype.slice.call(c.querySelectorAll(s));

class DoubleRangeSlider extends EventTarget {
  #minGap = 0;
  #maxGap = Number.MAX_SAFE_INTEGER;
  #inputs;
  style = {
    trackColor: '#124d3d',
    rangeColor: '#30c79f',
  };
  constructor(container){
    super();
    let inputs = $$('input[type="range"]', container);
    if(inputs.length !== 2){
      throw new RangeError('2 range inputs expected');
    }
    let [input1, input2] = inputs;
    if(input1.min >= input1.max || input2.min >= input2.max){
      throw new RangeError('range min should be less than max');
    }
    if(input1.max > input2.max || input1.min > input2.min){
      throw new RangeError('input1\'s max/min should not be greater than input2\'s max/min');
    }
    this.#inputs = inputs;
    let sliderTrack = $('.slider-track', container);
    let lastValue1 = input1.value;
    input1.addEventListener('input', (e) => {
      let value1 = +input1.value;
      let value2 = +input2.value;
      let minGap = this.#minGap;
      let maxGap = this.#maxGap;
      let gap = value2 - value1;
      let newValue1 = value1;
      if(gap < minGap){
        newValue1 = value2 - minGap;
      }else if(gap > maxGap){
        newValue1 = value2 - maxGap;
      }
      input1.value = newValue1;
      if(input1.value !== lastValue1){
        lastValue1 = input1.value;
        passEvent(e);
        fillColor();
      }
    });
    let lastValue2 = input2.value;
    input2.addEventListener('input', (e) => {
      let value1 = +input1.value;
      let value2 = +input2.value;
      let minGap = this.#minGap;
      let maxGap = this.#maxGap;
      let gap = value2 - value1;
      let newValue2 = value2;
      if(gap < minGap){
        newValue2 = value1 + minGap;
      }else if(gap > maxGap){
        newValue2 = value1 + maxGap;
      }
      input2.value = newValue2;
      if(input2.value !== lastValue2){
        lastValue2 = input2.value;
        passEvent(e);
        fillColor();
      }
    });
    let passEvent = (e) => {
      this.dispatchEvent(new e.constructor(e.type, e));
    };
    input1.addEventListener('change', passEvent);
    input2.addEventListener('change', passEvent);
    let fillColor = () => {
      let overallMax = +input2.max;
      let overallMin = +input1.min;
      let overallRange = overallMax - overallMin;
      let left1 = ((input1.value - overallMin) / overallRange * 100) + '%';
      let left2 = ((input2.value - overallMin) / overallRange * 100) + '%';
      let {trackColor, rangeColor} = this.style;
      sliderTrack.style.background = `linear-gradient(to right, ${trackColor} ${left1}, ${rangeColor} ${left1}, ${rangeColor} ${left2}, ${trackColor} ${left2})`;
    };
    this.fillColor = fillColor;
    let init = () => {
      let overallMax = +input2.max;
      let overallMin = +input1.min;
      let overallRange = overallMax - overallMin;
      let range1 = input1.max - overallMin;
      let range2 = overallMax - input2.min;
      input1.style.left = '0px';
      input1.style.width = (range1 / overallRange * 100) + '%';
      input2.style.right = '0px';
      input2.style.width = (range2 / overallRange * 100) + '%';
      fillColor();
    };
    init();
  }
  get minGap(){
    return this.#minGap;
  }
  set minGap(v){
    this.#minGap = v;
  }
  get maxGap(){
    return this.#maxGap;
  }
  set maxGap(v){
    this.#maxGap = v;
  }
  get values(){
    return this.#inputs.map((el) => el.value);
  }
  set values(values){
    if(values.length !== 2 || !values.every(isFinite))
      throw new RangeError();
    let [input1, input2] = this.#inputs;
    let [value1, value2] = values;
    if(value1 > input1.max || value1 < input1.min)
      throw new RangeError('invalid value for input1');
    if(value2 > input2.max || value2 < input2.min)
      throw new RangeError('invalid value for input2');
    input1.value = value1;
    input2.value = value2;
  }
  get inputs(){
    return this.#inputs;
  }
  get overallMin(){
    return this.#inputs[0].min;
  }
  get overallMax(){
    return this.#inputs[1].max;
  }
}

let container = $('#PWM1Slider');
let slider = new DoubleRangeSlider(container);
let container2 = $('#PWM2Slider');
let slider2 = new DoubleRangeSlider(container2);

function main(){

  slider.minGap = 1;
  slider.maxGap = 1000;
  slider2.minGap = 1;
  slider2.maxGap = 1000;

  let inputs = $$('input[name="PWM1"]');
  let outputs = $$('output[name="PWM1"]');
  let inputs2 = $$('input[name="PWM2"]');
  let outputs2 = $$('output[name="PWM2"]');

  outputs[0].value = inputs[0].value;
  outputs[1].value = inputs[1].value;
  outputs2[0].value = inputs2[0].value;
  outputs2[1].value = inputs2[1].value;

  slider.addEventListener('input', (e) => {
    let values = slider.values;
    outputs[0].value = values[0];
    outputs[1].value = values[1];
  });
  slider.addEventListener('change', (e) => {
    let values = slider.values;
    console.log('change', values);
    outputs[0].value = values[0];
    outputs[1].value = values[1];
  });

  slider2.addEventListener('input', (e) => {
    let values = slider2.values;
    outputs2[0].value = values[0];
    outputs2[1].value = values[1];
  });
  slider2.addEventListener('change', (e) => {
    let values = slider2.values;
    console.log('change', values);
    outputs2[0].value = values[0];
    outputs2[1].value = values[1];
  });
}




document.addEventListener('DOMContentLoaded', main);