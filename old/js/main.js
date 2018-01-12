/*
var entries = [
  {
      name: "Home",
      url: "./index.html"
  },
  {
      name: "Publication",
      url: "./publications.html"
  },
  {
      name: "Development",
      url: "./development.html"
  },
  {
      name: "Service and Teaching",
      url: "./service.html"
  }
];

var nav = document.getElementById("nav");
for (var i = 0; i < entries.length; i++) {
    var item = nav.appendChild(document.createElement("a"));
    item.setAttribute("href", entries[i].url);
    item.appendChild(document.createTextNode(entries[i].name));
    if (i < entries.length - 1) {
        nav.appendChild(document.createTextNode(" | "));
    }
}
*/

var nav = document.getElementById("nav");
var menu = '<a href="./index.html">Home</a> | ' +
           '<a href="./publications.html">Publications</a> | ' +
           '<a href="./development.html">Development</a> | ' +
           '<a href="./service.html">Service and Teaching</a>';
nav.innerHTML = menu;

var footer = document.getElementById("footer");
var date = new Date();
footer.innerHTML = "Copyright &copy; 2005&ndash;" + date.getFullYear() +
                   " Ryan H. Choi. All rights reserved";

