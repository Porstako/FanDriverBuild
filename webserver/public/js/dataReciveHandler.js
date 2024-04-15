/*
  Autor: Piotr Gliński
*/

//Plik który odbiera dane z serwera i wyświetla je w przglądarce
const socket = io();

//zmienne globalne
let rpm=20;
let roundDegree=0;

// odbior danych "pythonData" //
socket.on('pythonData', (data) => {
  document.getElementById('Volt').textContent = data.volt;
  document.getElementById('Amper').textContent = data.amper;
  document.getElementById('Watt').textContent = data.watt;
  document.getElementById('PWM2Percentage').textContent = data.PWM2Percentage;
  let x = 0.5 + (data.PWM2Percentage*0.005);
  document.getElementById('PWM2GaugeNotFill').style.transform = `rotate(${x}turn)`;
  if (data.PWMValue === 1){
    document.getElementById('PWMFullDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
    document.getElementById('PWMStopDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
    document.getElementById('PWMAutoDiode').style.background = 'radial-gradient(#00ff0030, #00ff0040)';
  } else if(data.PWMValue === 2){
    document.getElementById('PWMFullDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
    document.getElementById('PWMStopDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
    document.getElementById('PWMAutoDiode').style.background = 'radial-gradient(#00ff0030, #00ff0040)';
  } else{
    document.getElementById('PWMFullDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
    document.getElementById('PWMStopDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
    document.getElementById('PWMAutoDiode').style.background = 'radial-gradient(#00ff00ff, #00ff0040)';
  }
  document.getElementById('lineVoltage').textContent = data.lineVoltage;
  if (data.lineVoltage>252 || data.lineVoltage<100){
    document.getElementById('lineVoltageRedDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
  } else {
    document.getElementById('lineVoltageRedDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
  }
  if (data.overload == 1){
    document.getElementById('overloadDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
  }
  else {
    document.getElementById('overloadDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
  }
  document.getElementById('windSpeed').textContent = data.windSpeed;
  document.getElementById('kWhValue_24H').textContent = data.kWh;
  document.getElementById('kWhValue_30D').textContent = data.kWh;
  document.getElementById('kWhValue_OVERALL').textContent = data.kWh;
  document.getElementById('sweepSpeed').textContent = data.sweepSpeed;
  rpm=data.value;  
  document.getElementById('PWMTemperature').textContent = data.PWMTemperature;
  x= 0.5 + 0.005*data.PWMTemperature;
  document.getElementById('PWMTemperatureGaugeNotFill').style.transform = `rotate(${x}turn)`;
  document.getElementById('turbineTemperature').textContent = data.turbineTemperature;
  x= 0.5 + 0.005*data.turbineTemperature;
  document.getElementById('turbineTemperatureGaugeNotFill').style.transform = `rotate(${x}turn)`;
});

// odbior danych "PWMData"//
socket.on('config', (data) =>{
  if (data.type === 'config'){
    document.getElementById("PWM1MinInput").value=data.PWM1Min;
    slider.values[0]=data.PWM1Min;
    document.getElementById("PWM1Min").textContent=data.PWM1Min;

    document.getElementById("PWM1MaxInput").value=data.PWM1Max;
    slider.values[1]=data.PWM1Max;
    document.getElementById("PWM1Max").textContent=data.PWM1Max;

    document.getElementById("PWM2MinInput").value=data.PWM2Min;
    slider2.values[0]=data.PWM2Min;
    document.getElementById("PWM2Min").textContent=data.PWM2Min;

    document.getElementById("PWM2MaxInput").value=data.PWM2Max;
    slider2.values[1]=data.PWM2Max;
    document.getElementById("PWM2Max").textContent=data.PWM2Max;
    slider.fillColor();
    slider2.fillColor();
    document.getElementById('temperatureInput').value = data.maxTemperature;
    document.getElementById('temperatureOutput').textContent = data.maxTemperature;
    temperatureFillColor();

    if (data.onGrid === true){
      document.getElementById("offGridCheckBox").checked = true;
    }
    else if (data.onGrid === false) {
      document.getElementById("offGridCheckBox").checked = false;
    }

    else if (data.serialNumber !== undefined){
      document.getElementById('serialNumber').textContent = data.serialNumber;
    }
    

  offGridOnGridSettingsChange()
}
});
