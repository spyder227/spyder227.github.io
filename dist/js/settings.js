const deployID = 'AKfycbxEgnX_a6btHE0FUDOkliMnYkQp2U0-ga4jbIgaX-oQgiBrIzzbjH6TNjJw8-K7VR19';
const sheetID = `1HGxrc3juJYQpNCYSfjxSSUjVUVC7ddT6h0rA3REP0qY`;
const oldSheetID = `xxx`;
let successMessage = `<p class="fullWidth">Submission successful!</p>
<button onclick="location.reload();" type="button" class="fullWidth submit">Back to form</button>`;
const threadTags = ["vital","rapidfire","platonic","romantic","antagonistic","coworkers","notlux"];
const chartColors = [
    '#6c90c7', //blue
    '#699e9c', //teal
    '#c283ac', //pink
    '#b483c2', //purple
    '#afa073', //yellow
    '#a9826b', //orange
    '#799e6c', //green
    '#b66363' //red
];

const datasetOptions = {
    backgroundColor: chartColors,
    borderWidth: 5,
    borderColor: '#3e3e3e'
};

const chartOptions = {
    type: 'doughnut',
    options: {
        cutout: '35%',
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: localStorage.getItem('theme') === 'light' ? '#767676' : '#e7e7e7',
                    font: {
                        family: 'Nunito Sans, sans-serif',
                        size: '9',
                        weight: 'bold'
                    }
                }
            }
        }
    }
};

const noLegend = {
    scales: {
        x: {
            ticks: {
                color: localStorage.getItem('theme') === 'light' ? '#767676' : '#e7e7e7',
                font: {
                    family: 'Nunito Sans, sans-serif',
                    size: '8',
                    weight: 'bold'
                }
            }
        },
        y: {
            ticks: {
                color: localStorage.getItem('theme') === 'light' ? '#767676' : '#e7e7e7',
                font: {
                    family: 'Nunito Sans, sans-serif',
                    size: '8',
                    weight: 'bold'
                }
            }
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
        }
    }
};
