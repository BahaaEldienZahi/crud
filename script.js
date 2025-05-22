let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mode = 'create';
let tmp;

function getTotal() {
    if (price.value) {
        let priceVal = +price.value || 0;
        let taxesVal = +taxes.value || 0;
        let adsVal = +ads.value || 0;
        let discountVal = +discount.value || 0;
        let result = (priceVal + taxesVal + adsVal) - discountVal;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = 'rgb(147, 22, 22)';
    }
}

let datapro;
try {
    datapro = JSON.parse(localStorage.getItem('product')) || [];
} catch (e) {
    console.error("Error parsing product data:", e);
    datapro = [];
}

submit.onclick = function () {
    let newpro = {
        title: title.value.trim(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.trim(),
    };

    if (newpro.title && newpro.price) {
        if (mode === 'create') {
            if (newpro.count > 1) {
                for (let i = 0; i < newpro.count; i++) {
                    datapro.push({ ...newpro });
                }
            } else {
                datapro.push(newpro);
            }
        } else if (mode === 'update') {
            datapro[tmp] = newpro;
            mode = 'create';
            submit.innerHTML = 'Create';
            count.style.display = 'block';
        }
        localStorage.setItem('product', JSON.stringify(datapro));
        clearData();
        showData();
    }
};

function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
    total.style.background = 'rgb(147, 22, 22)';
}

function showData() {
    getTotal();
    let table = '';
    if (datapro.length === 0) {
        table = `<tr><td colspan="10">No products found</td></tr>`;
    } else {
        for (let i = 0; i < datapro.length; i++) {
            table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${datapro[i].title}</td>
                    <td>${datapro[i].price}</td>
                    <td>${datapro[i].taxes}</td>
                    <td>${datapro[i].ads}</td>
                    <td>${datapro[i].discount}</td>
                    <td>${datapro[i].total}</td>
                    <td>${datapro[i].category}</td>
                    <td><button onclick="updateData(${i})" class="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" class="delete">Delete</button></td>
                </tr>`;
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

function deleteData(i) {
    datapro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(datapro));
    showData();
}

function deleteAll() {
    localStorage.removeItem('product');
    datapro = [];
    showData();
}

function updateData(i) {
    title.value = datapro[i].title;
    price.value = datapro[i].price;
    taxes.value = datapro[i].taxes;
    ads.value = datapro[i].ads;
    discount.value = datapro[i].discount;
    category.value = datapro[i].category;
    getTotal();
    count.style.display = 'none';
    submit.innerHTML = 'Update';
    mode = 'update';
    tmp = i;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let searchMood = 'title';
function getSearchMood(id) {
    searchMood = id === 'searchTitle' ? 'title' : 'category';
    document.getElementById('search').placeholder = `Search by ${searchMood}`;
}

function searchData(value) {
    let table = '';
    const searchTerm = value.toLowerCase();
    for (let i = 0; i < datapro.length; i++) {
        const item = datapro[i];
        const field = searchMood === 'title' ? item.title.toLowerCase() : item.category.toLowerCase();
        if (field.includes(searchTerm)) {
            table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    <td>${item.taxes}</td>
                    <td>${item.ads}</td>
                    <td>${item.discount}</td>
                    <td>${item.total}</td>
                    <td>${item.category}</td>
                    <td><button onclick="updateData(${i})" class="update">Update</button></td>
                    <td><button onclick="deleteData(${i})" class="delete">Delete</button></td>
                </tr>`;
        }
    }
    document.getElementById('tbody').innerHTML = table || `<tr><td colspan="10">No results found</td></tr>`;
}

showData();