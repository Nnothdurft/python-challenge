function buildMetadata(sample) {
  let selector = d3.select("#sample-metadata");
  d3.json("/metadata/" + sample).then((data)=> {
    selector.html("");
    Object.entries(data).forEach(([key, value]) => {
      selector.append("p").text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  d3.json("/samples/"+sample).then((data) => {
    otu_ids = data["otu_ids"];
    sample_values = data["sample_values"];
    otu_labels = data["otu_labels"];
    let pieData = [{
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hoverinfo: otu_labels.slice(0, 10),
      type: 'pie'
    }];
    layout = {
      height: 600,
      width: 600
    };
    Plotly.newPlot("pie", pieData, layout);
    xmax = Math.max.apply(Math, otu_ids);
    ymax = Math.max.apply(Math, otu_ids);
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      marker: {
        size: sample_values,
        color: otu_ids
      },
      mode: 'markers',
      text: otu_labels,
      type: 'scatter'
    }];
    bubbleLayout = {
      xaxis: {
        range: [0, xmax]
      },
      yaxis: {
        range: [0, ymax/10]
      }
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    // console.log(sample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
