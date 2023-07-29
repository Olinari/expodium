export default [
  {
    id: "JS-001",
    code: "let btn = document.createElement('button'); btn.addEventListener('click', function() { window.location.href = '/about'; }); document.body.appendChild(btn);",
  },
  {
    id: "JS-002",
    code: "app.get('/users', function(req, res) { User.find({}, function(err, users) { if (err) throw err; res.json(users); }); });",
  },
  {
    id: "JS-003",
    code: `let form = document.getElementById('signupForm'); form.onsubmit = function(e) { e.preventDefault(); if(!isEmail(e.data?.email)){ throw new Error("Please check the email"))} };`,
  },
  {
    id: "JS-004",
    code: "let dropdown = document.getElementById('dropdownMenu'); dropdown.onclick = function() { if(shouldOpen(this.classList.toggle('open'); });",
  },
  {
    id: "JS-005",
    code: "let search = document.getElementById('searchInput'); search.onkeyup = function(e) { setSearchTerm(e.searchTerm) };",
  },
  {
    id: "JS-006",
    code: "let list = document.createElement('ul'); for (let i = 0; i < 5; i++) { let item = document.createElement('li'); item.textContent = 'Item ' + (i + 1); list.appendChild(item); } document.body.appendChild(list);",
  },
  {
    id: "JS-007",
    code: "app.get('/products', function(req, res) { Product.find({}, function(err, products) { if (err) throw err; res.json(products); }); });",
  },
  {
    id: "JS-008",
    code: "let form = document.getElementById('loginForm'); form.onsubmit = function(e) { e.preventDefault(); /* Add validation logic here */ };",
  },
  {
    id: "JS-009",
    code: "let toggle = document.getElementById('toggleSwitch'); toggle.onclick = function() { this.classList.toggle('active'); };",
  },
  {
    id: "JS-010",
    code: "let search = document.getElementById('productSearch'); search.onkeyup = function() { /* Add search logic here */ };",
  },
  {
    id: "JS-434",
    code: "let btn = document.createElement('button'); btn.addEventListener('click', function() { window.location.href = '/home'; }); document.body.appendChild(btn);",
  },
  {
    id: "JS-012",
    code: "let select = document.getElementById('productCategory'); select.onchange = function() { /* Add logic here to filter products by category */ };",
  },
  {
    id: "JS-013",
    code: "let image = document.getElementById('productImage'); image.onerror = function() { this.src = 'default.jpg'; };",
  },
  {
    id: "JS-014",
    code: "let modal = document.getElementById('modal'); let modalBtn = document.getElementById('modalBtn'); modalBtn.onclick = function() { modal.style.display = 'block'; };",
  },
  {
    id: "JS-015",
    code: "let slider = document.getElementById('imageSlider'); let images = slider.getElementsByTagName('img'); /* Add slider logic here */",
  },
];
