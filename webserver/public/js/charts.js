//////////
// DATA //
//////////
// Parse the date strings into JavaScript Date objects.
const parseDate = d3.utcParse("%Y-%m-%d %H:%M");
var stats = [];
var aggregatedStats;
var bandWidth = 0;

function fetchAndUpdate(){
    d3.csv('/stats', function(d) {
        // Konwersja odpowiednich pól na liczby
        return {
            Date: d.Date,
            kWh: +d.kWh,  
            Watt: +d.Watt,
            Volt: +d.Volt,
            Amper: +d.Amper,
            Wind: +d.Wind,
            SweepSpeed: +d.SweepSpeed,
            PWMTemperature: +d.PWMTemperature,
            TurbineTemperature: +d.TurbineTemperature
        };})
    .then(data => {
        aggregatedStats = null;
        stats = data;
        aggregatedStats = aggregateData(stats, selectedPrecision);
        stats = null;
        drawChart();
        updateChart();});
}

fetchAndUpdate();
setInterval(fetchAndUpdate, 60000);

////////////////
// SELECTIONS //
////////////////
let selectedPrecision = "1 MIN.";
let selectedDateRange = "1 GODZ.";
let selectedDataType = "kWh";


const precisionOptions = ["1 MIN.", "15 MIN.", "1 GODZ.", "4 GODZ.", "1 DZIEŃ", "1 MIESIĄC", ];
d3.select("#precision").selectAll("option")
    .data(precisionOptions)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

const dateRangeOptions = ["1 GODZ.", "12 GODZ.", "1 DZIEŃ", "1 TYDZIEŃ", "1 MIESIĄC", "3 MIESIĄCE", "6 MIESIĘCY", "1 ROK"];
d3.select("#dateRange").selectAll("option")
    .data(dateRangeOptions)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

const dataTypeOptions = ["kWh", "MOC", "NAPIĘCIE", "PRĄD", "WIATR", "OBROTY", "TEMP. WODY", "TEMP. UZWOJ."];
d3.select("#dataType").selectAll("option")
    .data(dataTypeOptions)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);


d3.select("#precision").on("change", function(event){
    selectedPrecision = d3.select(this).property("value");
    updateChart();
});
d3.select("#dateRange").on("change", function(event){
    selectedDateRange = d3.select(this).property("value");
    updateChart();
});
d3.select("#dataType").on("change", function(event){
    selectedDataType = d3.select(this).property("value");
    updateChart();
});

////////////////
// MISC SETUP //
////////////////
const width = 800;
const height = 450;
const margin = {"Top": 20, "Right": 20, "Bottom": 30, "Left": 50};
const horizontalLines = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const customTickFormat = date => { // Sprawdza, czy miesiąc to styczeń, jeśli tak to zwraca rok, jesli nie to miesiąc
    return date.getMonth() === 0 ? d3.timeFormat("%Y")(date) : d3.timeFormat("%b")(date);
};

////////////////
// CHART MAIN //
////////////////

// Set the domain for the x-axis.
var maxDate = new Date();
var minDate = new Date(new Date().setDate(new Date().getDate() - 30));;

// Create the SVG element.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// Declare the x (horizontal position) scale.
var x = d3.scaleUtc()
    .range([margin.Left, width - margin.Right])
    .domain([d3.timeMonth.floor(minDate), d3.timeMonth.ceil(maxDate)]);

var y = d3.scaleLinear()
    .range([height - margin.Bottom, margin.Top])
    .domain([0, 1000]);

// Add the x-axis.
svg.append("g")
    .attr("id", "xAxis")
    .attr("transform", `translate(0,${height - margin.Bottom})`)
    .style("color", "#007cef")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("stroke-width", 3)
    .call(d3.axisBottom(x)
        .ticks(d3.timeMonth.every(1))  // Ustawia tiki na początku każdego miesiąca
        .tickFormat(customTickFormat));  // Używa zdefiniowanego formatowania dla tików)

// Add the y-axis.
svg.append("g")
    .attr("id", "yAxis")
    .attr("transform", `translate(${margin.Left},0)`)
    .style("color", "#007cef")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("stroke-width", 3)
    .call(d3.axisLeft(y));

const lineVolt = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Volt); })
    .curve(d3.curveMonotoneX);

const lineWatt = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Watt); })
    .curve(d3.curveMonotoneX);

const lineAmper = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Amper); })
    .curve(d3.curveMonotoneX);

const lineWind = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Wind); })
    .curve(d3.curveMonotoneX);

const lineSweepSpeed = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.SweepSpeed); })
    .curve(d3.curveMonotoneX);

const linePWMTemperature = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.PWMTemperature); })
    .curve(d3.curveMonotoneX);

const lineTurbineTemperature = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.TurbineTemperature); })
    .curve(d3.curveMonotoneX);

function drawChart()
{
    svg.selectAll(".grid")
        .data(horizontalLines)
        .enter()
        .append("line")  // Dodaje element linii
        .attr("class", "grid")
        .attr("x1", margin.Left)  // Początek linii na lewo
        .attr("x2", width - margin.Right)  // Koniec linii na prawo
        .attr("y1", d => y(d))  // Y jest taki sam na obu końcach, aby linia była pozioma
        .attr("y2", d => y(d))
        .attr("stroke", "#007cef3a")  // Kolor linii
        .attr("stroke-width", "1px")  // Grubość linii
        .attr("stroke-dasharray", "2,2");  // Styl linii: przerywana

    svg.selectAll(".dot")
        .data(aggregatedStats)
        .enter().append("circle") // Dodaje elementy 'circle' dla każdego punktu danych
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.Date); })
        .attr("cy", function(d) { return y(d.Volt); })
        .attr("r", 5) // Promień punktu
        .style("fill", "#007cef")
        .style("opacity", 0.0);

    svg.append("path")
        .attr("class", "statsLine")
        .datum(aggregatedStats)
        .attr("fill", "none")
        .attr("stroke", "#30c79f")
        .attr("stroke-width", 1)
        .attr("d", lineVolt)
        .attr('clip-path', 'url(#clip)');

    bandWidth = x(aggregatedStats[1].Date) - x(aggregatedStats[0].Date);  // Obliczanie odległości między pierwszymi dwoma punktami

    svg.append("g")
        .attr("class", "statsBars")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(aggregatedStats)
        .join("rect")
        .attr("x", (d) => x(d.Date))
        .attr("y", (d) => y(d.kWh))
        .attr("height", (d) => y(0) - y(d.kWh))
        .attr("width", bandWidth*0.90)
        .attr('clip-path', 'url(#clip)');

    // Definicja obszaru klipowania
    svg.append("clipPath")   // Dodaje nową definicję clipPath
        .attr("id", "clip")   // Nadaje ID dla referencji
        .append("rect")       // Dodaje prostokąt, który służy jako obszar klipowania
        .attr("width", width - margin.Left - margin.Right)  // szerokość klipowania
        .attr("height", height - margin.Top - margin.Bottom) // wysokość klipowania
        .attr("x", margin.Left)
        .attr("y", margin.Top);
    }
///////////////
// FUNCTIONS //
///////////////
function aggregateData(stats, precision) {
    const aggregated = [];
    const grouped = d3.group(stats, d => {
        const date = parseDate(d.Date);
        switch (precision){
            case "1 MIN":
                break;
            case "15 MIN.":
                const minutes = date.getMinutes();
                date.setMinutes(minutes - minutes % 15, 0, 0);
                break;
            case "1 GODZ.":
                date.setMinutes(0, 0, 0); // Zeruje minuty i sekundy
                break;
            case "4 GODZ.":
                const hours = date.getHours();
                date.setHours(hours - hours % 4, 0, 0, 0);
                break;
            case "1 DZIEŃ":
                date.setHours(0, 0, 0, 0); // Zeruje godziny, minuty i sekundy
                break;
            case "1 MIESIĄC":
                date.setDate(1); // Ustawia datę na pierwszy dzień miesiąca
                date.setHours(0, 0, 0, 0); // Zeruje godziny, minuty i sekundy
                break;
 
        }
        return date;
    });

    grouped.forEach((values, key) => {
        var temp = { Date: key, kWh: 0 };
        let count = 0;
        values.forEach(v => {
            for (const prop in v) {
                if (prop !== 'Date' && prop !== 'kWh') {
                    temp[prop] = (temp[prop] || 0) + v[prop];
                }
            }
            temp.kWh += parseFloat(v.kWh);
            count++;
        });

        for (const prop in temp) {
            if (prop !== 'Date' && prop !== 'kWh') {
                temp[prop] /= count; // Oblicza średnią dla każdej statystyki, oprócz kWh
            }
        }

        aggregated.push(temp);
    });

    return aggregated;
}

function updateDots() {
    const dots = svg.selectAll(".dot")
                    .data(aggregatedStats, d => d.Date); // Klucz identyfikujący elementy

    // Usuwanie starych elementów
    dots.exit()
        .style("opacity", 0)
        .remove();

    const dotsEnter = dots.enter().append("circle");
            
    switch (selectedDataType){
        case "kWh":

            break;
        case "MOC":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Watt))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Watt))
                .attr('clip-path', 'url(#clip)');
                break;
        case "NAPIĘCIE":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Volt))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Volt))
                .attr('clip-path', 'url(#clip)');
            break;
        case "PRĄD":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Amper))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Amper))
                .attr('clip-path', 'url(#clip)');
            break;
        case "WIATR":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Wind))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.Wind))
                .attr('clip-path', 'url(#clip)');
            break;
        case "OBROTY":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.SweepSpeed))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.SweepSpeed))
                .attr('clip-path', 'url(#clip)');
            break;
        case "TEMP. WODY":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.PWMTemperature))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.PWMTemperature))
                .attr('clip-path', 'url(#clip)');
            break;
        case "TEMP. UZWOJ.":
            // Dodawanie nowych elementów
            dotsEnter.attr("class", "dot")
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.TurbineTemperature))
                .attr("r", 5)
                .style("fill", "#007cef")
                .style("opacity", 0)
                .attr('clip-path', 'url(#clip)');

            // Aktualizacja istniejących elementów
            dotsEnter.merge(dots)
                .style("opacity", 0)
                .attr("cx", d => x(d.Date))
                .attr("cy", d => y(d.TurbineTemperature))
                .attr('clip-path', 'url(#clip)');
            break;
    }
}

function updateInteractionRects() {
    // Przeliczenie szerokości prostokąta dla interakcji
    bandWidth = x(aggregatedStats[1].Date) - x(aggregatedStats[0].Date);

    // Selekcja prostokątów interakcji
    const interactionRects = svg.selectAll(".interaction-rect")
        .data(aggregatedStats, d => d.Date);

    // Usunięcie starych prostokątów, które nie są już potrzebne
    interactionRects.exit()
        .transition()
        .attr("width", 0)  // Animacja zmniejszania szerokości do 0
        .remove();

    // Dodawanie nowych prostokątów i aktualizacja istniejących
    if (selectedDataType=="kWh"){
        const enterRects = interactionRects.enter().append("rect")
        .attr("class", "interaction-rect")
        .attr("y", 0)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("x", d => x(d.Date))  // Ustawienie początkowej pozycji x
        .attr("width", 0)
        .attr('clip-path', 'url(#clip)');

    // Łączenie nowo dodanych prostokątów z istniejącymi i aktualizacja
    enterRects.merge(interactionRects)
        .transition()
        .attr("x", d => x(d.Date))
        .attr("width", bandWidth)
        .attr('clip-path', 'url(#clip)');

    // Dodawanie zdarzeń dla nowych i zaktualizowanych prostokątów
    enterRects.merge(interactionRects)
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1);
            tooltip.html(`${d.Date.toLocaleDateString()}<br/>${parseFloat(d.kWh).toFixed(2)} kWh`)
                .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                .style("top", `${event.clientY - 10}px`);
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });
    }
    else{
        const enterRects = interactionRects.enter().append("rect")
            .attr("class", "interaction-rect")
            .attr("y", 0)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr("x", d => x(d.Date) - bandWidth / 2)  // Ustawienie początkowej pozycji x
            .attr("width", 0)
            .attr('clip-path', 'url(#clip)');  // Początkowa szerokość ustawiona na 0 do animacji

        // Łączenie nowo dodanych prostokątów z istniejącymi i aktualizacja
        enterRects.merge(interactionRects)
            .transition()
            .attr("x", d => x(d.Date) - bandWidth / 2)
            .attr("width", bandWidth)
            .attr('clip-path', 'url(#clip)');

        // Dodawanie zdarzeń dla nowych i zaktualizowanych prostokątów
        switch (selectedDataType)
        {
            case "MOC":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${Math.round(d.Watt)} W`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        updateDots();
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
            case "NAPIĘCIE":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${Math.round(d.Volt)} V`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .transition()
                            .duration(50)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
            case "PRĄD":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${parseFloat(d.Amper).toFixed(1)} A`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .transition()
                            .duration(50)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
            case "WIATR":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${parseFloat(d.Wind).toFixed(1)} m/s`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .transition()
                            .duration(50)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
            case "OBROTY":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${Math.round(d.SweepSpeed)} rpm`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .transition()
                            .duration(50)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
            case "TEMP. WODY":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${Math.round(d.PWMTemperature)} &#176;C`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .transition()
                            .duration(50)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
            case "TEMP. UZWOJ.":
                enterRects.merge(interactionRects)
                    .on("mouseover", (event, d) => {
                        tooltip.style("opacity", 1);
                        tooltip.html(`${d.Date.toLocaleDateString()}<br/>${Math.round(d.TurbineTemperature)} &#176;C`)
                            .style("left", `${event.clientX - 50 - ((window.innerWidth-800)/2)}px`)
                            .style("top", `${event.clientY - 10}px`);
                        svg.selectAll(".dot")
                            .filter(dot => dot.Date === d.Date)
                            .transition()
                            .duration(50)
                            .style("opacity", 1);
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                        updateDots();
                    });
                break;
        }
    }
    
}

function updateChart(){
    // Pobierz aktualną datę
    const now = new Date();
    d3.csv('/stats', function(d) {
        // Konwersja odpowiednich pól na liczby
        return {
            Date: d.Date,
            kWh: +d.kWh,  
            Watt: +d.Watt,
            Volt: +d.Volt,
            Amper: +d.Amper,
            Wind: +d.Wind,
            SweepSpeed: +d.SweepSpeed,
            PWMTemperature: +d.PWMTemperature,
            TurbineTemperature: +d.TurbineTemperature
        };})
    .then(data => {
        aggregatedStats = null;
        stats = data;
        aggregatedStats = aggregateData(stats, selectedPrecision);
        stats = null;});
    // Ustal nowy zakres dat na podstawie wybranej opcji w dateRange
    let startDate;
    switch (selectedDateRange) {
        case "1 GODZ.":
            startDate = new Date(now.getTime() - 60 * 60 * 1000); // 1 godzina wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%H:%M"))
                .ticks(d3.timeMinute.every(5)));
            break;
        case "12 GODZ.":
            startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 godzin wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%H:%M"))
                .ticks(d3.timeHour.every(1))); 
                
            break;
        case "1 DZIEŃ":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 dzień wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%H:%M"))
                .ticks(d3.timeHour.every(2))); 
            break;
        case "1 TYDZIEŃ":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 tydzień wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%d"))
                .ticks(d3.timeDay.every(1)));
            break;
        case "1 MIESIĄC":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 1 miesiąc wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%d"))
                .ticks(d3.timeWeek.every(1)));
            break;
        case "3 MIESIĄCE":
            startDate = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000); // 3 miesiąc wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(customTickFormat)
                .ticks(d3.timeMonth.every(1)));
            break;
        case "6 MIESIĘCY":
            startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000); // 1 miesiąc wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(customTickFormat)
                .ticks(d3.timeMonth.every(1)));
            break;
        case "1 ROK":
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 miesiąc wstecz
            x.domain([startDate, now]);
            d3.select('#xAxis')
                .transition()
                .call(d3.axisBottom(x)
                .tickFormat(customTickFormat)
                .ticks(d3.timeMonth.every(1)));
            break;
        default:
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Domyślnie 1 dzień wstecz
    }
    switch(selectedDataType){
        case "kWh":
            var maxY = d3.max(aggregatedStats, d => d.kWh);
            if (maxY<1) maxY=1;
            else if (maxY<2) maxY=2;
            else if (maxY<5) maxY=5;
            else if (maxY<10) maxY=10;
            else if (maxY<20) maxY=20;
            else if (maxY<40) maxY=40;
            else if (maxY<50) maxY=50;
            else if (maxY<100) maxY=100;
            else if (maxY<200) maxY=200;
            else if (maxY<500) maxY=500;
            else if (maxY<1000) maxY=1000;
            else if (maxY<2000) maxY=2000;
            y.domain([0, maxY]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            const bars = svg.selectAll(".statsBars rect");
            bandWidth = x(aggregatedStats[1].Date) - x(aggregatedStats[0].Date);  // Obliczanie odległości między pierwszymi dwoma punktami

            bars.exit()
                .transition()
                .attr("y", y(0))
                .attr("height", 0)
                .remove();

            bars.transition()
                .style("opacity","0");

            bars.enter().append("rect")
                .attr("fill", "steelblue")
                .merge(bars)
                .data(aggregatedStats)
                .transition()
                .attr("x", d => x(d.Date))
                .attr("y", d => y(d.kWh))
                .attr("height", d => y(0) - y(d.kWh))
                .style("opacity","1")
                .attr("width", bandWidth*0.90);

            svg.selectAll(".statsLine")
                .transition()
                .style("opacity","0");
            break;
        case "MOC":
            y.domain([0, 20000]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .transition() // Rozpocznij animację
                .style("opacity","1")
                .attr("d", lineWatt);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
                
            break;
        case "NAPIĘCIE":
            y.domain([0, 1000]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .transition() // Rozpocznij animację
                .style("opacity","1")
                .attr("d", lineVolt);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
            break;
        case "PRĄD":
            y.domain([0, 50]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .transition() // Rozpocznij animację
                .style("opacity","1")
                .attr("d", lineAmper);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
            break;
        case "WIATR":
            y.domain([0, 20]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .transition() // Rozpocznij animację
                .style("opacity","1")
                .attr("d", lineWind);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
            break;
        case "OBROTY":
            y.domain([0, 1000]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .transition() // Rozpocznij animację
                .style("opacity","1")
                .attr("d", lineSweepSpeed);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
            break;
        case "TEMP. WODY":
            y.domain([0, 100]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .transition() // Rozpocznij animację
                .style("opacity","1")
                .attr("d", linePWMTemperature);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
            break;
        case "TEMP. UZWOJ.":
            y.domain([0, 100]);
            d3.select('#yAxis')
                .transition()
                .call(d3.axisLeft(y)); 
            svg.selectAll(".statsLine")
                .datum(aggregatedStats)
                .style("opacity","1")
                .transition() // Rozpocznij animację
                .attr("d", lineTurbineTemperature);

            svg.selectAll(".statsBars rect")
                .style("opacity","0");
            break;
    }
    updateDots();
    updateInteractionRects();
}

// Funkcja inicjalizująca tooltip
function initTooltip() {
    const tooltip = d3.select("#graphContainer").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute");
    return tooltip;
}

const tooltip = initTooltip();
// Append the SVG element.
document.getElementById("graphContainer").appendChild(svg.node());