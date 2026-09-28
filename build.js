class MD extends HTMLElement {
    static observedAttributes = ["file"];

    attributeChangedCallback(n, ov, nv) {
        if(ov === nv || n !== "file" || !nv)
            return;

        this.data = fetch(nv).then(resp=>{
            if(!resp.ok)
                throw resp.statusText

            return resp.text();
        }).catch(console.error);
    }

    connectedCallback(){
        setTimeout(async()=>{
            if(!this.data) {
                this.data = this.innerText;
                this.innerText = "";
            } else if(this.data instanceof Promise) {
                this.data = await this.data;
            }

            this.innerHTML = marked.parse(""+this.data)
                .replace(/<h1>.*<\/h1>/, "");
        }, 1);
        
    }
}

class B extends HTMLElement {
    static observedAttributes = [
        "image",
        "stats",
        "title"
    ];

    attributeChangedCallback(n, ov, nv) {
        if(ov == nv)
            return;

        switch (n) {
            case "image":
                this.image = nv;
                break;

            case "stats":
                this.stats = JSON.parse(nv);
                break;

            case "title":
                this.title = nv;
                break;
        }
    }

    connectedCallback() {
        this.innerHTML = `
            <h2>${this.title}</h2>
            ${build_stats(...this.stats)}
            <img src="${this.image}" alt="${this.title || "Elden Bling"}" />
        `;
    }
}

function build_stats(vig, mind, end, str, dex, int, fth, arc) {
    return `<ul class="stats">
        <li>
            <span class="header">Vigor</span>
            <span>${vig}</span>
        </li>
        <li>
            <span class="header">Mind</span>
            <span>${mind}</span>
        </li>
        <li>
            <span class="header">Endurance</span>
            <span>${end}</span>
        </li>
        <li>
            <span class="header">Strength</span>
            <span>${str}</span>
        </li>
        <li>
            <span class="header">Dexterity</span>
            <span>${dex}</span>
        </li>
        <li>
            <span class="header">Intelligence</span>
            <span>${int}</span>
        </li>
        <li>
            <span class="header">Faith</span>
            <span>${fth}</span>
        </li>
        <li>
            <span class="header">Arcane</span>
            <span>${arc}</span>
        </li>
    </ul>`
}

customElements.define("mark-down", MD);
customElements.define("er-build", B)