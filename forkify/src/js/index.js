/* 
import string from './models/Search';
import {add as a, multiply, ID} from './views/searchView';

//Different way
import * as searchView from './views/searchView';
console.log(`Using imported functions! ${searchView.add( searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${string}`);

console.log(`Using imported functions! ${a(ID, 2)} and ${multiply(3, 5)}. ${string}`);
*/

// REDUX is very popular state management library 

import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/recipe';

/*  GLOBAL STATE OF THE APP:
    1- Search Object
    2- Current recipe object
    3- Shopping list object
    4- Liked recipes
*/ 

const state = {};


/*******************  SEARCH CONTROLLER **********************/
 

const controlSearch = async () => {
    // Get the query from the view
    const query = searchView.getInput();

    if (query) {
        // 2- New search object and add to state
        state.search = new Search(query);
        
        // 3- Prepare UI for result
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try {
            // 4- Search for recipes
            await state.search.getResult();
                
            // 5- Render result on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } 
        catch (error) {
            console.log(error);
        }   
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // prevent to reload page
    controlSearch();
});

/*  JUST FOR TESTİNG
    elements.searchForm.addEventListener('load', e => {
    e.preventDefault(); // prevent to reload page
    controlSearch();
}); */

elements.resultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }
    
});

/*******************  RECİPE CONTROLLER **********************/

const controlRecipe = async () => {
    // get id from the Url
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
            
        // Create recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients(); 

            // Calculate serving and time
            state.recipe.calcTime();     
            state.recipe.calcServing();

            // Render recipe
            
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            alert('Error Processing recipe');
        }
    }
}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);


// Handling recipe buttons clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.serving > 1) {
            state.recipe.updateServing('dec'); 
            recipeView.updateServingIngredients(state.recipe);  
        }   
    }
    else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServing('inc');
        recipeView.updateServingIngredients(state.recipe);
    }
});