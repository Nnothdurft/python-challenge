// from data.js
let tableData = data;
let submit = d3.select("#filter-btn");
let table = document.getElementById("ufo-table");

buildTable(tableData, 0);

submit.on("click", function() {
    d3.event.preventDefault();
    let inputButton = d3.select("#datetime");
    let inputValue = inputButton.property("value");
    console.log(inputValue);
    buildTable(tableData, inputValue);
});

function buildTable(data, filterDate){
    table.innerHTML= `<thead>
    <tr>
      <th class="table-head">Date</th>
      <th class="table-head">City</th>
      <th class="table-head">State</th>
      <th class="table-head">Country</th>
      <th class="table-head">Shape</th>
      <th class="table-head">Duration</th>
      <th class="table-head">Comments</th>
    </tr>
  </thead>
  <tbody></tbody>`;
    if(filterDate != 0){
        newData = data.filter(data => data.datetime === filterDate);
    }
    else{newData = data};
    let tbody = d3.select("tbody");
    newData.forEach((newData)=> {
        let row = tbody.append("tr");
        Object.entries(newData).forEach(([key, value]) => {
            let cell = tbody.append("td");
            cell.text(value);
        });
    });
};