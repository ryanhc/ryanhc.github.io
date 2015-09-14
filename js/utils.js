utils = {
    makeEntry: function(entries) {
        var list = document.createElement("ul");
        for (var i = 0; i < entries.length; i++) {
            var item = list.appendChild(document.createElement("li"));
            var link = item.appendChild(document.createElement("a"));
            link.setAttribute("href", entries[i].url);
            link.appendChild(document.createTextNode(entries[i].name));
        }
        return list;
    }
};

