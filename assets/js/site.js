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
