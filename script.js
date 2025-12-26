/*
  script.js
  - Scroll progress bar
  - Scroll-spy (active nav link)
  - Skills filter (emphasize / reorder) without hiding content
  - Initialize Chart.js mini dashboards
  - Accessibility: keyboard focus and aria updates
*/

const body = document.body;

/* Scroll progress bar */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrollTop = h.scrollTop || document.body.scrollTop;
  const height = h.scrollHeight - h.clientHeight;
  const pct = height > 0 ? (scrollTop/height)*100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', () => { requestAnimationFrame(updateProgress); });
updateProgress();

/* Scroll-spy: observe sections and mark nav link active */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main .section');
const obs = new IntersectionObserver(entries => {
  entries.forEach(ent => {
    const id = ent.target.id;
    const link = document.querySelector('.nav-links a[href="#'+id+'"]');
    if(ent.isIntersecting){
      navLinks.forEach(a=>a.classList.remove('active'));
      if(link) link.classList.add('active');
    }
  });
},{root:null,rootMargin:'-30% 0px -30% 0px',threshold:0});
sections.forEach(s => obs.observe(s));

/* Smooth scroll for nav links (keyboard accessible) */
navLinks.forEach(a=>{ a.addEventListener('click', e=>{ e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'}); }); a.addEventListener('keydown', e=>{ if(e.key === 'Enter') a.click(); }); });

/* Skills filter: default shows all; clicking a filter emphasizes matching cards; does not hide content */
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');
filterBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    skillCards.forEach(card=>{
      card.classList.remove('emphasize','deemphasize');
      if(filter !== 'all'){
        if(card.dataset.category === filter) card.classList.add('emphasize');
        else card.classList.add('deemphasize');
      }
    });
    // Reorder: move emphasized to front for visual priority
    const grid = document.getElementById('skillsGrid');
    const emphasized = Array.from(skillCards).filter(c=>c.classList.contains('emphasize'));
    emphasized.forEach(e=> grid.prepend(e));
  });
});

/* Initialize Chart.js mini dashboards with exposed core numbers beneath each chart */
function createLineChart(ctx, labels, data, color){
  return new Chart(ctx, {type:'line',data:{labels, datasets:[{label:'',data,fill:true,tension:0.3,borderColor:color,backgroundColor:color+'22',pointRadius:3}]},options:{responsive:true,plugins:{legend:{display:false},tooltip:{mode:'index',intersect:false}},scales:{y:{beginAtZero:true}}});
}

// Sample realistic-ish data
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const revenue = [120000,150000,170000,160000,190000,220000,210000,230000,250000,270000,300000,320000];
const users = [800,820,900,940,980,1020,1100,1200,1250,1300,1450,1600];
const funnel = [12000,8000,2500,950]; // impressions->visitors->signups->conversions (example)

// Revenue
const ctxR = document.getElementById('chartRevenue').getContext('2d');
createLineChart(ctxR, months, revenue, 'rgba(0,229,255,0.95)');

// Users
const ctxU = document.getElementById('chartUsers').getContext('2d');
createLineChart(ctxU, months, users, 'rgba(127,0,255,0.9)');

// Funnel as a bar chart (descending) with labels visible under
const ctxF = document.getElementById('chartFunnel').getContext('2d');
new Chart(ctxF, {type:'bar',data:{labels:['Impressions','Visitors','Signups','Conversions'],datasets:[{data:funnel,backgroundColor:['#0ff','rgba(127,0,255,0.7)','rgba(110,231,183,0.7)','rgba(255,255,255,0.12)']} ]},options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{enabled:true}}}});

/* Keyboard focus styles: add visible outline to focused interactive elements */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.documentElement.classList.add('show-focus');
});

/* Basic form handling (no backend): simple accessible feedback */
const form = document.querySelector('.contact-form');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('메시지가 전송되었습니다 (샘플). 실제 송신은 서버 연동 필요합니다.');
    form.reset();
  });
}

/* Ensure initial active nav state */
updateProgress();

