// Theme toggle with localStorage
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const saved = localStorage.getItem('theme');
if(saved){ body.setAttribute('data-theme', saved); themeToggle.checked = saved === 'dark'; }
themeToggle?.addEventListener('change', () => {
  const t = themeToggle.checked ? 'dark' : 'light';
  body.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

// Accordion behavior
document.querySelectorAll('.more-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const id = btn.dataset.accordion;
    document.querySelectorAll('.acc-panel').forEach(p => p.style.display='none');
    const panel = document.getElementById(id);
    if(panel) panel.style.display = 'block';
    panel.scrollIntoView({behavior:'smooth',block:'center'});
  });
});

// Sample data for interactive chart
const datasets = {
  sales: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    series: [120,150,170,160,190,220,210,230,250,270,300,320],
  },
  users: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    series: [800,820,900,940,980,1020,1100,1200,1250,1300,1450,1600],
  }
};

const ctx = document.getElementById('vizChart').getContext('2d');
let vizChart = new Chart(ctx, {
  type: 'line',
  data: {labels: datasets.sales.labels, datasets:[{label:'Value',data:datasets.sales.series, tension:0.3, borderWidth:2, pointRadius:4, backgroundColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.95)'}]},
  options: {responsive:true,plugins:{legend:{display:true},tooltip:{mode:'index',intersect:false}},scales:{y:{beginAtZero:true}}
});

function updateChart(which){
  const d = datasets[which];
  vizChart.data.labels = d.labels;
  vizChart.data.datasets[0].data = d.series.slice();
  vizChart.update();
}

document.getElementById('datasetSelect').addEventListener('change', e=> updateChart(e.target.value));

// smoothing control (simple moving average)
document.getElementById('smoothing').addEventListener('input', e=>{
  const k = Number(e.target.value);
  const sel = document.getElementById('datasetSelect').value;
  const src = datasets[sel].series;
  if(k<=0){ vizChart.data.datasets[0].data = src.slice(); vizChart.update(); return; }
  const smoothed = src.map((v,i,arr)=>{
    const start = Math.max(0,i-k);
    const seg = arr.slice(start,i+1);
    return Math.round(seg.reduce((a,b)=>a+b,0)/seg.length);
  });
  vizChart.data.datasets[0].data = smoothed; vizChart.update();
});

// small accessibility: toggle dataset by clicking legend
ctx.canvas.addEventListener('mousemove', ()=>{});
