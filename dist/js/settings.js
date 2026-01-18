const deployID = 'AKfycbxEgnX_a6btHE0FUDOkliMnYkQp2U0-ga4jbIgaX-oQgiBrIzzbjH6TNjJw8-K7VR19';
const sheetID = `1HGxrc3juJYQpNCYSfjxSSUjVUVC7ddT6h0rA3REP0qY`;
const oldSheetID = `xxx`;
let successMessage = `<p class="fullWidth">Submission successful!</p>
<button onclick="location.reload();" type="button" class="fullWidth submit">Back to form</button>`;
const threadTags = ["vital","rapidfire","platonic","romantic","antagonistic","coworkers","familial","notlux"];
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

const relationshipOptions = `<option value="">(select)</option>
    <optgroup label="Family">
        <option value="parent">Parent</option>
        <option value="sibling">Sibling</option>
        <option value="child">Child</option>
        <option value="half-sibling">Half-sibling</option>
        <option value="step-parent">Step-parent</option>
        <option value="step-sibling">Step-sibling</option>
        <option value="step-child">Step-child</option>
        <option value="adopted parent">Adopted Parent</option>
        <option value="adopted sibling">Adopted Sibling</option>
        <option value="adopted sibling">Adopted Child</option>
        <option value="foster child">Foster Child</option>
        <option value="foster sibling">Foster Sibling</option>
        <option value="foster parent">Foster Parent</option>
    </optgroup>
    <optgroup label="Extended Family">
        <option value="ancestor">Ancestor</option>
        <option value="grandparent">Grandparent</option>
        <option value="cousin">Cousin</option>
        <option value="uncle">Uncle</option>
        <option value="aunt">Aunt</option>
        <option value="nephew">Nephew</option>
        <option value="niece">Niece</option>
        <option value="extended family">Extended Family</option>
    </optgroup>
    <optgroup label="Romantic">
        <option value="spouse">Spouse</option>
        <option value="betrothed">Betrothed</option>
        <option value="partner">Partner</option>
        <option value="crush">Crush</option>
        <option value="fling">Fling</option>
    </optgroup>
    <optgroup label="Platonic">
        <option value="found family">Found Family</option>
        <option value="best friend">Best Friend</option>
        <option value="friend">Friend</option>
        <option value="roommate">Roommate</option>
        <option value="neighbour">Neighbour</option>
    </optgroup>
    <optgroup label="Professional">
        <option value="business partner">Business Partner</option>
        <option value="employer">Employer</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
        <option value="co-worker">Co-worker</option>
        <option value="mentor">Mentor</option>
    </optgroup>
    <optgroup label="Antagonistic">
        <option value="ex-spouse">Ex-spouse</option>
        <option value="ex-betrothed">Ex-betrothed</option>
        <option value="ex-parter">Ex-partner</option>
        <option value="ex-friend">Ex-friend</option>
        <option value="rival">Rival</option>
        <option value="annoyance">Annoyance</option>
        <option value="dislikes">Dislikes</option>
        <option value="estranged">Estranged</option>
    </optgroup>
    <optgroup label="Miscellaneous">
        <option value="aquaintance">Aquaintance</option>
        <option value="deceased">Deceased</option>
        <option value="pet">Pet</option>
        <option value="other">Other</option>
    </optgroup>`;