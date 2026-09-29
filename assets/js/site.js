'use strict';
const params = new URLSearchParams(location.search);
if (params.get('via') === 'card') {
  const banner = document.createElement('div'); banner.className = 'scan-banner';
  banner.setAttribute('role', 'region'); banner.setAttribute('aria-label', 'Welcome from my card');
  const message = document.createElement('span'); message.textContent = 'Nice meeting you. Thanks for taking the time to scan my card.';
  const close = document.createElement('button'); close.type = 'button'; close.setAttribute('aria-label', 'Dismiss greeting'); close.textContent = '×'; close.addEventListener('click', () => banner.remove());
  banner.append(message, close); document.querySelector('.site-header').after(banner);
}
const contactButton = document.querySelector('[data-vcard]');
contactButton?.addEventListener('click', () => {
  const card = ['BEGIN:VCARD','VERSION:3.0','FN:Jaehyuk Song','TITLE:BBA Candidate - BI Norwegian Business School','EMAIL:Jaehyuk.song98@gmail.com','TEL;TYPE=CELL:+4740327507','URL:https://jaehyuksong98-collab.github.io/','END:VCARD'].join('\r\n');
  const url = URL.createObjectURL(new Blob([card], {type:'text/vcard'}));
  const a = document.createElement('a'); a.href = url; a.download = 'Jaehyuk-Song.vcf'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#contact-status').textContent = 'Contact card prepared for download.';
});
const paths = {
  finance: {steps:['A liquidity or valuation question','Scenarios & assumption checks','A model to inspect'], context:'Financial analysis · Excel · Python · Validation',label:'Explore the liquidity case',href:'cash-flow-model.html'},
  research: {steps:['An industry question','Source review & data handling','Evidence for a decision'],context:'Market research · Shipping & real estate interests · Source quality',label:'Read the methodology note',href:'insights/liquidity-before-certainty.html'},
  automation: {steps:['A recurring research task','Structured data & AI workflows','A repeatable process'],context:'Business workflows · n8n · APIs · Human review',label:'Explore the workflow',href:'ai-content-workflow.html'}
};
document.querySelectorAll('[data-capability]').forEach(button => button.addEventListener('click', () => {
  const path = paths[button.dataset.capability];
  document.querySelectorAll('[data-capability]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  document.querySelectorAll('[data-step]').forEach((el,i) => el.textContent = path.steps[i]);
  document.querySelector('#capability-context').textContent = path.context;
  const link = document.querySelector('#capability-link'); link.href = path.href; link.textContent = path.label + ' ↗';
}));
const search = document.querySelector('#insight-search');
if (search) {
  const aliases = {'finance-ma':'finance',international:'international',AI:'ai',Finance:'finance'};
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const valid = buttons.length ? buttons.map(b => b.dataset.filter) : ['all'];
  const itemLabel = search.dataset.itemLabel || 'insight';
  let active = aliases[params.get('cat')] || params.get('cat') || 'all'; if (!valid.includes(active)) active = 'all';
  search.value = params.get('q') || '';
  const cards = [...document.querySelectorAll('[data-insight]')];
  function filter(updateURL = true) {
    const query = search.value.trim().toLowerCase(); let count = 0;
    cards.forEach(card => {const matches = (active === 'all' || card.dataset.categories.split(' ').includes(active)) && card.textContent.toLowerCase().includes(query); card.hidden = !matches; if(matches) count++;});
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === active)));
    document.querySelector('#archive-count').textContent = count + ' ' + itemLabel + (count === 1 ? '' : 's') + (query ? ' matching your search' : ' in this view');
    document.querySelector('#archive-empty').hidden = count > 0;
    if(updateURL) { const url = new URL(location.href); if(active === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat',active); if(query) url.searchParams.set('q',search.value.trim()); else url.searchParams.delete('q'); history.replaceState(null,'',url); }
  }
  search.addEventListener('input',()=>filter()); document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;filter();}));
  document.querySelector('#clear-filters').addEventListener('click',()=>{active='all';search.value='';filter();search.focus();});
  window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);active=aliases[p.get('cat')]||p.get('cat')||'all';if(!valid.includes(active))active='all';search.value=p.get('q')||'';filter(false);}); filter(false);
}
const progress = document.querySelector('.reading-progress');
if (progress && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let queued = false;
  function draw(){const max = document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;queued=false;}
  addEventListener('scroll',()=>{if(!queued){requestAnimationFrame(draw);queued=true;}},{passive:true}); addEventListener('resize',draw); draw();
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.animate([{opacity:.65,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'ease-out'});observer.unobserve(entry.target);}}},{threshold:.12});
 document.querySelectorAll('.project-feature,.project-card,.editorial-feature').forEach(el=>observer.observe(el));
}

const projectFilters = [...document.querySelectorAll('[data-project-filter]')];
if (projectFilters.length) {
 const projectCards = [...document.querySelectorAll('[data-project]')];
 function showProjectArea() {
  const requested = location.hash.slice(1);
  const area = projectFilters.some(link => link.dataset.projectFilter === requested) ? requested : 'all';
  let count = 0;
  projectCards.forEach(card => {card.hidden = area !== 'all' && card.dataset.projectArea !== area; if (!card.hidden) count++;});
  projectFilters.forEach(link => link.setAttribute('aria-current', String(link.dataset.projectFilter === area)));
  document.querySelector('#project-count').textContent = count + ' project' + (count === 1 ? '' : 's') + ' in this view';
 }
 projectFilters.forEach(link => link.addEventListener('click', event => {
  event.preventDefault(); history.pushState(null, '', link.getAttribute('href')); showProjectArea();
 }));
 addEventListener('hashchange', showProjectArea); addEventListener('popstate', showProjectArea); showProjectArea();
}

// Reveal the working sequence once, when the diagram enters the viewport.
const mapMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !mapMotionPreference.matches) {
 const maps = [...document.querySelectorAll('.sector-map')];
 const mapObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   entry.target.classList.add('map-playing');
   mapObserver.unobserve(entry.target);
  });
 }, {threshold: .2});
 maps.forEach(map => {
  map.classList.add('map-ready');
  mapObserver.observe(map);
  // Keyboard access never waits for the decorative entrance to finish.
  map.addEventListener('focusin', () => {
   map.classList.remove('map-ready', 'map-playing');
   mapObserver.unobserve(map);
  }, {once: true});
 });
 mapMotionPreference.addEventListener('change', event => {
  if (!event.matches) return;
  mapObserver.disconnect();
  maps.forEach(map => map.classList.remove('map-ready', 'map-playing'));
 });
}

// Keep the working diagram in view while reading a stage, with normal links as fallback.
const stageExplorer = document.querySelector('[data-stage-explorer]');
if (stageExplorer) {
 const layout = stageExplorer.querySelector('.stage-explorer-layout');
 const diagram = stageExplorer.querySelector('.stage-diagram');
 const reading = stageExplorer.querySelector('.stage-reading');
 const closeButton = stageExplorer.querySelector('.stage-close');
 const nodes = [...diagram.querySelectorAll('.map-node')];
 const panels = [...reading.querySelectorAll('.stage-detail')];
 let selected = null;
 let movement, entrance;
 const panelFor = node => document.getElementById('stage-' + node.getAttribute('href').replace('working-', '').replace('.html', ''));
 nodes.forEach(node => {
  node.setAttribute('role', 'button');
  node.setAttribute('aria-expanded', 'false');
  node.setAttribute('aria-controls', panelFor(node).id);
  node.setAttribute('tabindex', '0');
 });
 diagram.querySelector('desc').textContent = 'Five steps in order: set a goal, industry, data, finance, and automation. Choose a step to show its explanation on this page.';
 function showStage(node, focus = true) {
  const before = diagram.getBoundingClientRect();
  const wasOpen = !!selected;
  movement?.cancel(); entrance?.cancel();
  selected = node;
  const panel = node ? panelFor(node) : null;
  nodes.forEach(n => n.setAttribute('aria-expanded', String(n === node)));
  panels.forEach(p => {p.hidden = p !== panel;});
  reading.hidden = !node;
  layout.classList.toggle('is-open', !!node);
  history.replaceState(null, '', location.pathname + location.search + (panel ? '#' + panel.id : ''));
  const svg = diagram.querySelector('svg');
  svg.classList.remove('map-ready', 'map-playing');
  const after = diagram.getBoundingClientRect();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && diagram.animate) {
   if (wasOpen !== !!node && innerWidth > 900) movement = diagram.animate([
    {transform: `translate(${before.left-after.left}px, ${before.top-after.top}px) scale(${before.width/after.width})`},
    {transform: 'none'}
   ], {duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
   if (node) entrance = panel.animate([{opacity:0,transform:innerWidth>900?'translateX(20px)':'translateY(10px)'},{opacity:1,transform:'none'}],{duration:450,delay:wasOpen?0:220,fill:'backwards',easing:'ease-out'});
  }
  if (focus && panel) {
   panel.querySelector('h2').focus({preventScroll:true});
   if (innerWidth <= 900 || reading.getBoundingClientRect().top < 24) reading.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }
 }
 nodes.forEach(node => {
  node.addEventListener('click', event => {
   if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   event.preventDefault(); showStage(node);
  });
  node.addEventListener('keydown', event => {
   if (event.key === ' ' || event.key === 'Enter') {event.preventDefault();showStage(node);}
  });
 });
 function closeStage() {const previous=selected;showStage(null,false);previous?.focus({preventScroll:true});if(innerWidth <= 900) diagram.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
 closeButton.addEventListener('click', closeStage);
 stageExplorer.addEventListener('keydown', event => {if(event.key === 'Escape' && selected){event.preventDefault();closeStage();}});
 function openLinkedStage() {
  const node = nodes.find(n => '#' + panelFor(n).id === location.hash);
  if (!node) return;
  showStage(node);
  (innerWidth <= 900 ? reading : layout).scrollIntoView({behavior:'auto',block:'start'});
 }
 openLinkedStage();
 window.addEventListener('hashchange', openLinkedStage);
}
