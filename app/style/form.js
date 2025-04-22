const d = document;
window.R = {}
HTMLDocument.prototype.gi = (e) => { return d.getElementById(e) };
HTMLDocument.prototype.qs = function (selector) {
    return this.querySelectorAll(selector);
};
HTMLDocument.prototype.ce = function (tag) {
    return this.createElement(tag);
};
{ NodeList }

NodeList.prototype.remove = function () {
    this.forEach((item) => {
        item.remove();
    });
    return null;
};
Element.prototype.ac = function (cls) {
    if (cls.includes(" ")) {
        cls.split(" ").forEach((v) => this.ac(v.trim()));
    } else {
        if (cls.trim() != "") {
            this.classList.add(cls);
        }
    }
    return this;
};
Element.prototype.rc = function (cls) {
    if (cls.includes(" ")) {
        cls.split(" ").forEach((v) => this.rc(v.trim()));
    } else {
        if (cls.trim() != "") {
            this.classList.remove(cls);
        }
    }
    return this;
};
NodeList.prototype.rc = Array.prototype.rc = function (cls) {
    this.forEach((item) => {
        item.rc(cls);
    });
    return this;
};
Element.prototype.bind = function (key, val) {
	this[key] = val;
	return this;
}

class formCls {
    constructor() {
        this.row = [{ "adi": "Mustafa", "soyadi": "Kara", "yasi": 58 }, { "adi": "Deniz", "soyadi": "Koç", "yasi": 30 }, { "adi": "Ece", "soyadi": "Güneş", "yasi": 60 }, { "adi": "Okan", "soyadi": "Güneş", "yasi": 55 }, { "adi": "Deniz", "soyadi": "Kaya", "yasi": 52 }, { "adi": "Mustafa", "soyadi": "Kara", "yasi": 58 }, { "adi": "Ali", "soyadi": "Şahin", "yasi": 49 }, { "adi": "Selin", "soyadi": "Polat", "yasi": 41 }, { "adi": "Okan", "soyadi": "Çelik", "yasi": 42 }, { "adi": "Elif", "soyadi": "Aydın", "yasi": 21 }, { "adi": "Gizem", "soyadi": "Kurt", "yasi": 36 }, { "adi": "Burak", "soyadi": "Güneş", "yasi": 39 }, { "adi": "Selin", "soyadi": "Kurt", "yasi": 48 }, { "adi": "Mustafa", "soyadi": "Polat", "yasi": 31 }, { "adi": "Deniz", "soyadi": "Kaya", "yasi": 42 }];
        this.sortOrder = '';
        this.sortField = 'adi';
        this.prevField = 'adi';
        this.drag = null;
        this.dragger();
        this.tanimlamalar();
        this.run();
    }
    run() {
        this.sortRows('adi', d.qs('thead th:first-child')[0])
    }


    searchRows(query) {
        const filteredRows = this.row.filter(row =>
            row.adi.toLowerCase().includes(query.toLowerCase()) ||
            row.soyadi.toLowerCase().includes(query.toLowerCase()) || row.yasi.toString().toLowerCase().includes(query.toLowerCase())
        );
        this.updateTable(filteredRows);
    }

    updateTable(data) {
        const tbody = d.qs('tbody')[0];
        if (data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3' style='text-align: center;'>Sonuç bulunamadı</td></tr>";
        } else {
            tbody.innerHTML = data.map(
                row => `
                <tr>
                    <td>${row.adi}</td>
                    <td>${row.soyadi}</td>
                    <td>${row.yasi}</td>
                </tr>`
            ).join('');
        }
    }

    sortRows(field, element) {
        this.updateTable(this.sort(this.row, field, element));
    }
    dragger() {
        this.thead = d.querySelector('thead');
        this.tbodyRow = d.querySelector('tbody');
        this.theadCells = this.thead.rows[0].cells;
        Array.from(this.theadCells).forEach(th => {
            th.addEventListener("dragstart", this.dragStart);
            th.addEventListener("dragover", this.dragOver);
            th.addEventListener("dragenter", this.dragEnter);
            th.addEventListener("dragleave", this.dragLeave);
            th.addEventListener("dragend", this.dragEnd);
            th.addEventListener("drop", this.drop);
        })
    }
    dragStart = e => {
        e.target.ac('drag');
        Array.from(this.theadCells).forEach(th => th.rc('drop'));
        this.dragSrc = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("text/plain", e.target.cellIndex);
    }
    dragOver = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }
    dragEnter = e => {
        e.target.ac('over')
    }
    dragLeave = e => {
        e.target.rc('over')
    }
    dragEnd = e => {
        e.target.rc('drag');
        this.headers = Array.from(this.theadCells);
    }
    drop = e => {
        e.stopPropagation();
        e.target.ac('drop');
        this.headers = Array.from(this.theadCells);
        this.targetCellIndex = e.target.closest('th').cellIndex;
        this.cellIndex = e.dataTransfer.getData("text/plain");
        this.insertPosition = this.targetCellIndex > this.cellIndex ? 'afterend' : 'beforebegin';
        this.headers[this.targetCellIndex].insertAdjacentElement(this.insertPosition, this.headers[this.cellIndex]);
        Array.from(this.tbodyRow.rows).forEach(tr => { tr.cells[this.targetCellIndex].insertAdjacentElement(this.insertPosition, tr.cells[this.cellIndex]); })
    }

    tanimlamalar() {
        this.sort = (arr, field, element) => {
            this.sortField = field;
            this.sortOrder = this.prevField == field && this.sortOrder == 'asc' ? 'desc' : 'asc';
            this.prevField = field;
            d.qs('thead th').forEach(th => {
                th.rc('active');
                th.querySelector('i').innerHTML = ''
                th.querySelector('i').className = '';
            });
            if (element) {
                element.ac('active').querySelector('i').ac(`material-icons arrow_${this.sortOrder == 'desc' ? 'upward' : 'downward'}`).innerHTML = this.sortOrder == 'desc' ? 'arrow_upward' : 'arrow_downward'
            }
            return arr.sort((a, b) => {
                var [valA, valB] = [a[field], b[field]];
                if (typeof valA === typeof valB) {
                    if (this.sortOrder === 'asc') {
                        if (valA > valB) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        if (valA < valB) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                } else {
                    return 0;
                }

            });
        }
    }
    sortRows = (field, element) => {
        this.tbody = d.qs('tbody')[0].innerHTML = this.sort(this.row, field, element).map(
            row => `
            <tr>
                <td>${row.adi}</td>
                <td>${row.soyadi}</td>
                <td>${row.yasi}</td>
            </tr>`
        ).join('');

    }
}
if (typeof window.form == 'undefined') {
    window.form = new formCls();
}