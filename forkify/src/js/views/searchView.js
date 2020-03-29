import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.resultsPages.innerHTML = '';
}

/***************************

Reduce metodu:

bu title olsun : title = "Pasta with tomato"
title.split(' ') yaptığımız zaman bize ["Pasta", "with", "tomato"] şeklinde bir array döndürür.
buna reduce metodu kullanmak istediğimiz zaman şöyle yapmalıyız.

const newTitle = [];
title.split(' ').reduce((acc, curr) => {
    if(acc + curr.length <= limit) {
        newTitle.push(curr);
    }
    return acc + curr.length;
}, 0);

const newTitle = [];  ==> Burada yeni title için boş bir array oluşturduk
title.split(' ').reduce((acc, curr) => {}); ==> Bu satırda reduce metodunu tanımlıyoruz.
Bu metoda iki değer giriyoruz biri accumulator diğeri current value accumulatoru sayaç gibi düşünebiliriz ve bunu 0 dan başlatıyoruz
current value ise title dizisi içerisindeki kelimeleri temsil ediyor bunlar for döngüsü gibi tek tek reduce metodundan geçireceğiz
tabi bunu reduce metodu otomatik yapıyor.

örnek olarak:
acc 0 / acc + cur.length (burda ilk eleman olarak pasta kelimesini alıyoruz) = 5 / newTitle = ["Pasta"]
acc 5 / acc + cur.length = 9 / new Title = ["Pasta", "with"]
acc 9 / ....

return acc + curr.length; ==> bu kod ise accumulator değişkeninin değerini güncellemeye yarıyor yukarıdaki örnekte görüldüğü gibi

***************************/

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        // join metodu newTitle arrayındaki her kelimeyi araya boşluk bıkarak arka arkaya yazmamıza yarar.
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const buttons = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Only button to go next page
        button = buttons(page, 'next');
    }
    else if(page < pages) {
        // button to go next page and previous page
        button = `
            ${buttons(page, 'next')}
            ${buttons(page, 'prev')}
        `;
    }
    else if(page === pages) {
        // Only button to go previous page
        button = buttons(page, 'prev');
    }

    elements.resultsPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    let start = (page - 1) * resPerPage;
    let end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination button
    renderButtons(page, recipes.length, resPerPage);
}