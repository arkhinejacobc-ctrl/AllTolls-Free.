const toolDefinitions = [
  {id:"word-counter",name:"Word Counter",description:"Count words, characters, sentences and paragraphs.",category:"Text",icon:"✍",time:"Instant"},
  {id:"case-converter",name:"Case Converter",description:"Change text to uppercase, lowercase or title case.",category:"Text",icon:"Aa",time:"Instant"},
  {id:"password-generator",name:"Password Generator",description:"Create a random password using your browser.",category:"Generators",icon:"🔐",time:"Instant"},
  {id:"unit-converter",name:"Unit Converter",description:"Convert common length, weight and temperature units.",category:"Converters",icon:"⇄",time:"Instant"},
  {id:"json-formatter",name:"JSON Formatter",description:"Format JSON and check whether it is valid.",category:"Developer",icon:"{ }",time:"Instant"}
];

function renderTool(id, host) {
  const templates = {
    "word-counter": `
      <label for="wc-text">Enter or paste your text</label>
      <textarea id="wc-text" placeholder="Start typing or paste your text here..."></textarea>
      <div class="stats-row">
        <div class="stat"><strong id="wc-words">0</strong><span>Words</span></div>
        <div class="stat"><strong id="wc-chars">0</strong><span>Characters</span></div>
        <div class="stat"><strong id="wc-sentences">0</strong><span>Sentences</span></div>
        <div class="stat"><strong id="wc-paragraphs">0</strong><span>Paragraphs</span></div>
      </div>`,
    "case-converter": `
      <label for="case-text">Your text</label><textarea id="case-text" placeholder="Type or paste text..."></textarea>
      <div class="field-row"><button class="action-button" data-case="upper">UPPERCASE</button><button class="action-button" data-case="lower">lowercase</button><button class="action-button" data-case="title">Title Case</button></div>
      <div id="case-result" class="result-box" hidden></div><button class="action-button" id="case-copy" hidden>Copy result</button>`,
    "password-generator": `
      <label for="pw-length">Password length</label><input id="pw-length" type="number" min="8" max="64" value="16">
      <div class="check-row"><label><input id="pw-upper" type="checkbox" checked> Uppercase</label><label><input id="pw-lower" type="checkbox" checked> Lowercase</label><label><input id="pw-number" type="checkbox" checked> Numbers</label><label><input id="pw-symbol" type="checkbox" checked> Symbols</label></div>
      <button class="action-button" id="pw-generate">Generate password</button><div id="pw-result" class="result-box" hidden></div><button class="action-button" id="pw-copy" hidden>Copy password</button>
      <p class="muted-note">Generated locally in your browser. Avoid reusing passwords across accounts.</p>`,
    "unit-converter": `
      <div class="field-row"><div><label for="unit-type">Measurement</label><select id="unit-type"><option value="length">Length</option><option value="weight">Weight</option><option value="temperature">Temperature</option></select></div><div><label for="unit-value">Value</label><input id="unit-value" type="number" value="1"></div></div>
      <div class="field-row"><div><label for="unit-from">From</label><select id="unit-from"></select></div><div><label for="unit-to">To</label><select id="unit-to"></select></div></div>
      <button class="action-button" id="unit-convert">Convert</button><div id="unit-result" class="result-box" hidden></div>`,
    "json-formatter": `
      <label for="json-input">Paste JSON</label><textarea id="json-input" placeholder='{"hello":"world"}'></textarea>
      <button class="action-button" id="json-format">Format JSON</button><div id="json-result" class="result-box" hidden></div><button class="action-button" id="json-copy" hidden>Copy formatted JSON</button>`
  };
  host.innerHTML = templates[id] || "<p>Tool not found.</p>";
  if (id === "word-counter") setupWordCounter();
  if (id === "case-converter") setupCaseConverter();
  if (id === "password-generator") setupPasswordGenerator();
  if (id === "unit-converter") setupUnitConverter();
  if (id === "json-formatter") setupJsonFormatter();
}

function setupWordCounter(){
  const input=document.getElementById("wc-text");
  const update=()=>{
    const text=input.value, trimmed=text.trim();
    document.getElementById("wc-words").textContent=trimmed?trimmed.split(/\s+/).length:0;
    document.getElementById("wc-chars").textContent=text.length;
    document.getElementById("wc-sentences").textContent=(text.match(/[.!?]+(?=\s|$)/g)||[]).length;
    document.getElementById("wc-paragraphs").textContent=trimmed?text.split(/\n\s*\n/).filter(p=>p.trim()).length:0;
  };
  input.addEventListener("input",update);update();
}
function setupCaseConverter(){
  const input=document.getElementById("case-text"), result=document.getElementById("case-result"), copy=document.getElementById("case-copy");
  document.querySelectorAll("[data-case]").forEach(button=>button.addEventListener("click",()=>{
    const mode=button.dataset.case, text=input.value;
    let output=text;
    if(mode==="upper") output=text.toUpperCase();
    if(mode==="lower") output=text.toLowerCase();
    if(mode==="title") output=text.toLowerCase().replace(/(^|[\s-])([a-z])/g,(_,a,b)=>a+b.toUpperCase());
    result.textContent=output;result.hidden=false;copy.hidden=false;
  }));
  copy.addEventListener("click",()=>copyText(result.textContent,copy));
}
function setupPasswordGenerator(){
  const result=document.getElementById("pw-result"),copy=document.getElementById("pw-copy");
  document.getElementById("pw-generate").addEventListener("click",()=>{
    const length=Math.min(64,Math.max(8,Number(document.getElementById("pw-length").value)||16));
    let chars="";
    if(document.getElementById("pw-upper").checked) chars+="ABCDEFGHJKLMNPQRSTUVWXYZ";
    if(document.getElementById("pw-lower").checked) chars+="abcdefghijkmnopqrstuvwxyz";
    if(document.getElementById("pw-number").checked) chars+="23456789";
    if(document.getElementById("pw-symbol").checked) chars+="!@#$%^&*()-_=+?";
    if(!chars){result.textContent="Choose at least one character type.";result.hidden=false;copy.hidden=true;return;}
    const random=new Uint32Array(length);crypto.getRandomValues(random);
    const password=Array.from(random,n=>chars[n%chars.length]).join("");
    result.textContent=password;result.hidden=false;copy.hidden=false;
  });
  copy.addEventListener("click",()=>copyText(result.textContent,copy));
}
const unitOptions={
  length:{m:"Meters",km:"Kilometers",cm:"Centimeters",mi:"Miles",ft:"Feet"},
  weight:{kg:"Kilograms",g:"Grams",lb:"Pounds",oz:"Ounces"},
  temperature:{c:"Celsius",f:"Fahrenheit",k:"Kelvin"}
};
function setupUnitConverter(){
  const type=document.getElementById("unit-type"),from=document.getElementById("unit-from"),to=document.getElementById("unit-to");
  function fill(){const opts=unitOptions[type.value];from.innerHTML="";to.innerHTML="";Object.entries(opts).forEach(([v,n])=>{from.add(new Option(n,v));to.add(new Option(n,v));});to.selectedIndex=1;}
  type.addEventListener("change",fill);fill();
  document.getElementById("unit-convert").addEventListener("click",()=>{
    const value=Number(document.getElementById("unit-value").value),a=from.value,b=to.value;let output;
    if(!Number.isFinite(value)){show("unit-result","Please enter a valid number.");return;}
    if(type.value==="length"){const base={m:1,km:1000,cm:.01,mi:1609.344,ft:.3048};output=value*base[a]/base[b];}
    else if(type.value==="weight"){const base={kg:1,g:.001,lb:.45359237,oz:.028349523125};output=value*base[a]/base[b];}
    else {let c=a==="c"?value:a==="f"?(value-32)*5/9:value-273.15;output=b==="c"?c:b==="f"?c*9/5+32:c+273.15;}
    show("unit-result",`${value} ${unitOptions[type.value][a]} = ${Number(output.toFixed(8))} ${unitOptions[type.value][b]}`);
  });
}
function setupJsonFormatter(){
  const input=document.getElementById("json-input"),result=document.getElementById("json-result"),copy=document.getElementById("json-copy");
  document.getElementById("json-format").addEventListener("click",()=>{
    try{result.textContent=JSON.stringify(JSON.parse(input.value),null,2);result.hidden=false;copy.hidden=false;result.dataset.valid="true";}
    catch(error){result.textContent="Invalid JSON: "+error.message;result.hidden=false;copy.hidden=true;result.dataset.valid="false";}
  });
  copy.addEventListener("click",()=>copyText(result.textContent,copy));
}
function show(id,text){const el=document.getElementById(id);el.textContent=text;el.hidden=false;}
async function copyText(text,button){
  try{await navigator.clipboard.writeText(text);const old=button.textContent;button.textContent="Copied!";setTimeout(()=>button.textContent=old,1200);}
  catch{button.textContent="Copy unavailable";}
}
