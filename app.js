const grid=document.getElementById("tool-grid"),search=document.getElementById("tool-search"),count=document.getElementById("tool-count");
let activeCategory="All";
function renderCards(){
  const query=search.value.trim().toLowerCase();
  const matches=toolDefinitions.filter(tool=>(activeCategory==="All"||tool.category===activeCategory)&&`${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query));
  grid.innerHTML="";
  matches.forEach(tool=>{
    const card=document.createElement("button");card.type="button";card.className="tool-card";
    card.innerHTML=`<span class="tool-icon" aria-hidden="true">${tool.icon}</span><h3>${tool.name}</h3><p>${tool.description}</p><span class="card-bottom"><span>${tool.category} · ${tool.time}</span><span class="arrow">↗</span></span>`;
    card.addEventListener("click",()=>openTool(tool));grid.appendChild(card);
  });
  count.textContent=`${matches.length} ${matches.length===1?"tool":"tools"}`;
  document.getElementById("empty-state").hidden=matches.length!==0;
}
function openTool(tool){
  document.getElementById("dialog-category").textContent=tool.category.toUpperCase();
  document.getElementById("dialog-title").textContent=tool.name;
  renderTool(tool.id,document.getElementById("dialog-content"));
  document.getElementById("tool-dialog").showModal();
}
document.getElementById("dialog-close").addEventListener("click",()=>document.getElementById("tool-dialog").close());
document.getElementById("tool-dialog").addEventListener("click",event=>{if(event.target.id==="tool-dialog")event.target.close();});
search.addEventListener("input",renderCards);
document.querySelectorAll(".category-chip").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".category-chip").forEach(chip=>chip.classList.remove("active"));
  button.classList.add("active");activeCategory=button.dataset.category;renderCards();
}));
document.getElementById("theme-toggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  document.getElementById("theme-toggle").textContent=document.body.classList.contains("dark")?"☀":"☾";
});
document.addEventListener("keydown",event=>{
  if(event.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){event.preventDefault();search.focus();}
});
renderCards();
