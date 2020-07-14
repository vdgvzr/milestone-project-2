let page = 1;
const input = document.getElementById("ingredients");

// Enter key for search bar to trigger recipe search
input.addEventListener("keyup", function(event) {
    if(event.keyCode === 13) {
        fetchRecipeInformation();
    }
});

// Previous button pagination
function prevPage() {
    if(page > 1) {
        page--;
        fetchRecipeInformation();
    }

    return page;
}


// Next button pagination
function nextPage() {
    if(page >= 1) {
        page++;
        fetchRecipeInformation();
    }

    return page;
}

// Function call to write search results to index.html in array form
function recipeInformationHTML(results) {
    let arr = [];
    let i;
    let recipes = $(results['results']);

    if(page <= 1) {
        $("#previous").addClass("d-none");
    } else {
        $("#previous").removeClass("d-none");
    }

    if(recipes.length < 10) {
        $("#next").addClass("d-none");
    } else {
        $("#next").removeClass("d-none");
    }

    // If there are no recipes matching the search criteria, return an error message
    if(recipes.length === 0) {
        $("#recipe").html(`<h2 class="search-title">We can't find what you're looking for!</h2>`);

        return;
    }

    for(i = 0; i < recipes.length; i++) {
        arr.push(`
            <div class="recipe-card box-shadow">
                <a href="${results['results'][i]['href']}" target="_blank">
                    <img class="card-image" src="${results['results'][i]['thumbnail']}" onerror="this.onerror=null; this.src='./assets/img/alt.jpeg'"/>
                </a>
                <div class="card-title-box">
                    <h6 class="card-title">${results['results'][i]['title']}</h6>
                </div>
            </div>
        `);
    }

    return arr;
}

// Main search function API call
function fetchRecipeInformation() {
    const api = "https://recipe-puppy.p.rapidapi.com/";
    let ingredients = $("#ingredients").val();
    const apiKey = "c360b33a86msh5b162d84d24e68cp100c0ejsnf72caac1e03f";

    // Return error message if search field is empty 
    if(!ingredients) {
        $("#recipe").html(`<h2 class="search-title">Looks like your kitchen is empty!</h2>`);
        
        return;
    }

    // Display loading gif while information is being requested
    $("#recipe").html(`<img src="./assets/img/loading.gif" alt="loading..." width="24" height="24"/>`);

    $.when(
        $.getJSON(`${api}?p=${page}&i=${ingredients}&rapidapi-key=${apiKey}`)
    ).then(
        function(response) {
            var ingredientsData = response;
            $("#recipe").html(recipeInformationHTML(ingredientsData));
        }, function(errorResponse) {
            if(errorResponse.status === 404) {
                $("#recipe").html(`<h2 class="search-title">No recipe found</h2>`);
            } else if(errorResponse.status === 500) {
                $("#recipe").html(`<h2 class="search-title">Server error</h2>`);
            } else if(errorResponse === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
                $("#recipe").html(`<h4 class="search-title>Too many requests, please wait until ${resetTime.toLocaleDateString()}</h4>`);
            } else {
                $("#recipe").html(`<h2 class="search-title">Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        }
    );

}