// 1.) Use the D3 library to read in samples.json from the URL.
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Sort data sets from url.
function bubbleSort(arr_otu, arr_values, arr_labels) {
    let n = arr_otu.length;
    let swapped;
  
    do {
      swapped = false; // Reset the swapped flag for each pass
  
      // Iterate through the array
      for (let i = 0; i < n - 1; i++) {
        // If the current element is greater than the next one, swap them
        if (arr_values[i] > arr_values[i + 1]) {
          // Swap the elements using destructuring
          [arr_values[i], arr_values[i + 1]] = [arr_values[i + 1], arr_values[i]];
          [arr_otu[i], arr_otu[i + 1]] = [arr_otu[i + 1], arr_otu[i]];
          [arr_labels[i], arr_labels[i + 1]] = [arr_labels[i + 1], arr_labels[i]];
          swapped = true; // Mark that a swap occurred
        }
      }
    } while (swapped); // Repeat if any swaps occurred
    return [arr_otu, arr_values, arr_labels, n]; // Return the sorted array
  }
var data_list = [];

// Fetch data from url.
d3.json(url).then(function(data) {
    // console.log("data: ", data);
    // Data Structure: id #(0-100): OTU(Top Ten), sample values.
    // Drop down menue lets u select a person.
    // The chart for each person will show top ten OTU.
    function init() {
      
      let N = data.samples[0].sample_values.length;
      let trace = {
        type: 'bar',
        x: data_list[0]["values"].slice(N-10, N),
        y: data_list[0]["OTU 10s"].slice(N-10, N).map(otu => `OTU ${otu}`),
        text: data_list[0]["labels"].slice(N-10, N), // Assuming you have otu_labels
        orientation: 'h'
      };
    
      let layout = {
        title: "Top 10 OTUs Found"
      };
      Plotly.newPlot("bar", [trace], layout);
      
      // Plot Bubble Chart
      let trace_bubble = {
        type: "bubble",
        x: data_list[0]["OTU 10s"],
        y: data_list[0]["values"],
        mode: "markers",
        marker: {
            size: data_list[0]["values"],
            color: data_list[0]["OTU 10s"]
        },
        text: data_list[0]["labels"]
    }
    let layout_bubble = {
        title: ""
      };
      Plotly.newPlot("bubble", [trace_bubble], layout_bubble);
      // Plot Demographics
       // Plot Demographics
       let demographics = data.metadata.find(d => d["id"] == "940");
       let demo = d3.select("#sample-metadata");
       console.log("demographics: ", demographics);
       demo.html("");
       // append all metadata to the panel
       demo.append("p").text(`id: ${demographics["id"]}`);
       demo.append("p").text(`ethnicity: ${demographics["ethnicity"]}`);
       demo.append("p").text(`gender: ${demographics["gender"]}`);
       demo.append("p").text(`age: ${demographics["age"]}`);
       demo.append("p").text(`location: ${demographics["location"]}`);
       demo.append("p").text(`bbtype: ${demographics["bbtype"]}`);
       demo.append("p").text(`wfreq: ${demographics["wfreq"]}`);
    }
    
    for (let i = 0; i < data.samples.length; ++i) {
        var doc = {"id#": "", "OTU 10s": [], "values": [], "labels": [], "ethnicity": "", "gender": "","age": -1, "location": "", "bbtype": "", "wfreq": -1};
        doc["id#"] = data.samples[i].id;
        // Find top 10 OTUs.
        let sorted = bubbleSort(data.samples[i].otu_ids, data.samples[i].sample_values, data.samples[i].otu_labels);
        let N = sorted[3];
        let top_ten = sorted[0];
        let top_ten_values = sorted[1];
        let top_ten_labels = sorted[2];
        doc["OTU 10s"] = top_ten;
        doc["values"] = top_ten_values;
        doc["labels"] = top_ten_labels;
        data_list.push(doc);
    }
    init();
    data.names.forEach(function(name) {
        d3.select("#selDataset").append("option").text(name);
      });
      


  /* 2.) Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
  - Use "sample_values" as the values for the bar chart.
  - Use "otu_ids" as the labels for the bar chart.
  - Use "otu_labels" as the hovertext for the chart.
  */
  // D3 Listener using Change

  d3.select("#selDataset").on("change", function() {
      getData();
    });
    
  // Graph
  function getData() {
      let dropdown = d3.select("#selDataset");
      let dataset = dropdown.property("value");
      let N = data_list.find(d => d["id#"] == dataset)["values"].length;
      // Assuming 'data_list' is accessible and structured with the required data
      let selectedData = data_list.find(d => d["id#"] == dataset);
      // Explain the line above: Answer: 
      let trace = {
        type: 'bar',
        x: selectedData["values"].slice(N-10, N),
        y: selectedData["OTU 10s"].slice(N-10, N).map(otu => `OTU ${otu}`),
        text: selectedData["labels"].slice(N-10, N), // Assuming you have otu_labels
        orientation: 'h'
      };
    
      let layout = {
        title: "Top 10 OTUs Found"
      };
    
      Plotly.newPlot("bar", [trace], layout);
      /* 3.) Create a bubble chart that displays each sample.
      - Use otu_ids for the x values.
      - Use sample_values for the y values.- Use sample_values for the marker size.
      - Use otu_ids for the marker colors.
      - Use otu_labels for the text values.
      */
      let trace_bubble = {
          type: "bubble",
          x: selectedData["OTU 10s"],
          y: selectedData["values"],
          mode: "markers",
          marker: {
              size: selectedData["values"],
              color: selectedData["OTU 10s"]
          },
          text: selectedData["labels"]
      }
      let layout_bubble = {
          title: ""
        };
      // console.log("datalist: ", data_list);
      Plotly.newPlot("bubble", [trace_bubble], layout_bubble);
      // Plot Demographics
      let demographics = data.metadata.find(d => d["id"] == dataset);
      let demo = d3.select("#sample-metadata");
      console.log("demographics: ", demographics);
      demo.html("");
      // append all metadata to the panel
      demo.append("p").text(`id: ${demographics["id"]}`);
      demo.append("p").text(`ethnicity: ${demographics["ethnicity"]}`);
      demo.append("p").text(`gender: ${demographics["gender"]}`);
      demo.append("p").text(`age: ${demographics["age"]}`);
      demo.append("p").text(`location: ${demographics["location"]}`);
      demo.append("p").text(`bbtype: ${demographics["bbtype"]}`);
      demo.append("p").text(`wfreq: ${demographics["wfreq"]}`);
 
    }
});
  




// 4.) Display the sample metadata, i.e., an individual's demographic information.


// 5.) Display each key-value pair from the metadata JSON object somewhere on the page.
// 6.) Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:
// 7.) Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file
