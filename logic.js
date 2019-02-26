class Station {


    allStations = [];
    allAvailability = [];
    apiKey = null;

    buttonHandler = () => {
        this.apiKey = document.getElementById("apikey").value;
        const body = document.getElementsByTagName("body")[0];
        const spinner = document.createElement("div");
        spinner.className = "loader";
        body.appendChild(spinner);
        this.firstRequest();
    }

    preDefinedHeaders = () => {
        return {
            //"Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Client-Identifier": this.apiKey
        };
    }

    byPassCORS = (url) => {
        return `https://cors-anywhere.herokuapp.com/${url}`;
    }

    firstRequest = async() => {

        const url = "https://oslobysykkel.no/api/v1/stations";
        const headers = new Headers(this.preDefinedHeaders());
        const CORS_proxy = this.byPassCORS(url);

        fetch(CORS_proxy, {
            method: "GET",
            headers: headers
        })	.then(rawData => rawData.json())
            .then(jsonData => {
                    this.allStations = jsonData.stations;
                    const buttonElement = document.getElementById("button1");
                    document.getElementById("apikey").value = "";
                    buttonElement.style.color = "#a4a4a4";
                    buttonElement.disabled = true;
                    this.secondRequest();
                }
            )
            .catch(error => console.log(error));
    }

    secondRequest = () => {
        const url = "https://oslobysykkel.no/api/v1/stations/availability";
        const headers = new Headers(this.preDefinedHeaders());
        const CORS_proxy = this.byPassCORS(url);

        fetch(CORS_proxy, {
            method: "GET",
            headers: headers
        })	.then(rawData => rawData.json())
            .then(jsonData => {
                    this.allAvailability = jsonData.stations;
                    const body = document.getElementsByTagName("body")[0];
                    const spinner = document.getElementsByClassName("loader")[0];
                    body.removeChild(spinner);
                    this.createTable();
                }
            )
            .catch(error => console.log(error));
    }

    createTable = () => {
        console.log(this.allStations);
        console.log(this.allAvailability);
        const body = document.getElementsByTagName("body")[0];
        const table = document.createElement("table");
        table.id = "station";

        const headerStation = document.createElement("th");
        const headerLocks = document.createElement("th");
        const headerBicycle = document.createElement("th");

        headerStation.innerHTML = "Stasjon";
        headerLocks.innerHTML = "Tilgjenglige låser";
        headerBicycle.innerHTML = "Tilgjenglige sykler";

        const rowHeader = table.insertRow(0);
        rowHeader.append(headerStation, headerLocks, headerBicycle);

        body.appendChild(table);

        for(let i = 0; i < this.allStations.length-1; i++){
            for(let j = 0; j < this.allAvailability.length-1; j++){
                if(this.allStations[i].id == this.allAvailability[j].id){
                    let newRow = table.insertRow(table.rows.length);
                    let firstCell = newRow.insertCell(0);
                    let secondCell = newRow.insertCell(1);
                    let thirdCell = newRow.insertCell(2);

                    firstCell.innerHTML = this.allStations[i].title;
                    secondCell.innerHTML = this.allAvailability[j].availability.locks;
                    thirdCell.innerHTML = this.allAvailability[j].availability.bikes;
                } 
            }
        }
            
        
                
            
        
    }
}

const station = new Station();