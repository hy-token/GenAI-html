window.addEventListener("DOMContentLoaded",()=>{
  const sidebar=document.getElementById("sidebar");
  const sitemapEl=document.getElementById("sitemap");
  const searchInput=document.getElementById("searchInput");
  const frame=document.getElementById("contentFrame");
  const loader=document.getElementById("loader");
  const breadcrumb=document.getElementById("breadcrumb");
  const prevBtn=document.getElementById("prevBtn");
  const nextBtn=document.getElementById("nextBtn");
  const toggleBtn=document.getElementById("menuToggle");

  if(toggleBtn){ toggleBtn.addEventListener("click",()=>sidebar.classList.toggle("open")); }

  fetch("sitemap.json").then(r=>r.json()).then(links=>{
    let flat=[];
    const flatten=(arr,parent=null)=>{arr.forEach(l=>{if(l.href)flat.push({...l,parent});if(l.children)flatten(l.children,l);});};
    flatten(links);
    let currentIdx=0;

    const renderBreadcrumb=()=>{const node=flat[currentIdx];breadcrumb.textContent=node.parent?`${node.parent.text} > ${node.text}`:node.text;};
    const highlightLink=()=>{document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));const active=document.querySelector(`.sidebar a[href='${flat[currentIdx].href}']`);if(active)active.classList.add('active');};
    const showLoader=()=>{loader.style.display='block';frame.style.visibility='hidden';};
    const hideLoader=()=>{loader.style.display='none';frame.style.visibility='visible';};
    frame.addEventListener('load',hideLoader);

    const renderLinks=(list,parent)=>{list.forEach(link=>{const li=document.createElement('li');const ic=document.createElement('i');ic.className=link.icon;li.appendChild(ic);if(link.href){const a=document.createElement('a');a.href=link.href;a.textContent=link.text;a.addEventListener('click',e=>{e.preventDefault();currentIdx=flat.findIndex(f=>f.href===link.href);navigate();if(window.innerWidth<=768)sidebar.classList.remove('open');});li.appendChild(a);}else{const arrow=document.createElement('i');arrow.className='fas fa-chevron-right toggle-arrow';const span=document.createElement('span');span.textContent=link.text;span.style.marginLeft='8px';span.prepend(arrow);span.addEventListener('click',()=>{const sub=li.querySelector('ul');const open=sub.style.display==='block';sub.style.display=open?'none':'block';arrow.classList.toggle('open',!open);});li.appendChild(span);}if(link.children){const ul=document.createElement('ul');ul.style.display='none';renderLinks(link.children,ul);li.appendChild(ul);}parent.appendChild(li);});};

    const updateSitemap=(filter='')=>{sitemapEl.innerHTML='';renderLinks(links,sitemapEl);};

    const navigate=()=>{showLoader();frame.src=flat[currentIdx].href;highlightLink();renderBreadcrumb();prevBtn.disabled=currentIdx===0;nextBtn.disabled=currentIdx===flat.length-1;};

    prevBtn.addEventListener('click',()=>{if(currentIdx>0){currentIdx--;navigate();}});nextBtn.addEventListener('click',()=>{if(currentIdx<flat.length-1){currentIdx++;navigate();}});searchInput.addEventListener('input',e=>updateSitemap(e.target.value));

    updateSitemap();navigate();
  });
});