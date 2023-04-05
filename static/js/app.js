// Setup sample data and other variables
const belly_url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
var bellydata = d3.json(belly_url);
d3.json(belly_url).then(function(data) {
  bellydata = data;
});

// Build metadata function
function buildMetadata(subjectID) {
  d3.json(belly_url).then((data) => {
    // Filter data and logs
    let subjectInfo = bellydata.metadata.filter(subject => subject.id == subjectID)[0];
      console.log(subjectInfo);
    // Use d3 to select the panel with id of `#sample-metadata`
    let demographicInfo = d3.select("#sample-metadata"); 
    // Use `.html("") to clear any existing metadata
    demographicInfo.html("");
    // Present demographic info
    Object.entries(subjectInfo).forEach(function([key, value]) {
        demographicInfo.append("p").text(`${key}: ${value}`);
    });
  });
}

// Build charts function
function buildCharts(subjectID) {
  d3.json(belly_url).then((data) => {
    // Create variables and logs
    let subjectInfo = bellydata.samples.filter(subject => subject.id == subjectID)[0];
      console.log(subjectInfo);
    let otu_ids = subjectInfo.otu_ids;
      console.log(otu_ids);
    let otu_labels = subjectInfo.otu_labels;
      console.log(otu_labels);
    let sample_values = subjectInfo.sample_values;
      console.log(sample_values);
    // Build a bar chart
    let trace_bar = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    let traceData_bar = [trace_bar];
    let layout_bar = {
      title: { text: "<b>Top 10 OTU</b>"},
      xaxis: { title: "Sample Values" },
      width: 800,
      height: 500,
      margin: { t: 50, b: 50 },
      colorway: ["blueviolet"],
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };
    Plotly.newPlot("bar", traceData_bar, layout_bar);
    // Build a Bubble Chart
      let trace_bubble = {
        x: otu_ids,
        y: sample_values,
        margin: { t: 0 },
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Bluered",
          type: 'heatmap'
          },
        text: otu_labels
      };
      let traceData_bubble = [trace_bubble];
      let layout_bubble = {
        title: { text: "<b>OTU ID vs. Sample Values</b>"},
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" },
        width: 1000,
        height: 500
      };
    Plotly.newPlot("bubble", traceData_bubble, layout_bubble);
  });
}; 

// Build init function
function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json(belly_url).then((data) => {
    let sampleNames = data.names;
    // Use the first sample from the list to build the initial plots
    for (let i = 0; i < sampleNames.length; i++) {
      selector
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    }
  });
}

// Build option function
function optionChanged(subjectID) {
  // Fetch new data each time a new sample is selected
  buildCharts(subjectID);
  buildMetadata(subjectID);
}

// Initialize the dashboard
init();