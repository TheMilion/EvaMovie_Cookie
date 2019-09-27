//FUNZIONI DI STAMPA DI TODOS
var ApiKey = "6ac290699faeb117ff37c20029f20b9b";
var url = "https://api.themoviedb.org/3/movie/";
var urlimg = "https://image.tmdb.org/t/p/";
const person = 'https://api.themoviedb.org/3/person/';
const popularmovie = url+"popular?api_key=" + ApiKey + "&language=en-US&page=";
const topratedmovie = url+"top_rated?api_key=" + ApiKey + "&language=en-US&page=";
const upcomingmovie = url+"upcoming?api_key=" + ApiKey + "&language=en-US&page=";
const nowplayingmovie = url+"now_playing?api_key=" + ApiKey + "&language=en-US&page=";
const genere = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + ApiKey + "&language=en-US";
var discover = "https://api.themoviedb.org/3/discover/movie?api_key=" + ApiKey + "&language=it-IT";
var initPage = 1;
var search = "https://api.themoviedb.org/3/search/movie?api_key=" + ApiKey + "&language=en-US"
var counter = 0;
//LISTA TITLE INDEX
var divHomearr = ["Popular-Movie", "Top-Rated", "Up-Coming", "Now-Playing"]

//DICHIARO VARIABILE INIZIALE
var favorite;
var category;


//QUANDO PRONTI STAMPA
$(document).ready(function () {
    getSection();
    getGenre();
    getYear();
    getFavorite();
    getCategory()
    putCategoryinDivSelect();
    putCategoryinDivMultiSelect();
});

function getSection() {
    //Verifica se è stata richiesta una determinata sezione dalla pagina 
    switch (getParametersFromUrl().page) {
        case 'Popular-Movie':
            $("#navbar").show();
            $("#popular").parent('li').addClass('active');
            initPage = 1;
            getPage(popularmovie, 'Popular-Movie');
            break;
        case 'Top-Rated':
            $("#navbar").show();
            $("#toprated").parent('li').addClass('active');
            initPage = 1;
            getPage(topratedmovie, 'Top-Rated');
            break;
        case 'Up-Coming':
            $("#navbar").show();
            $("#upcoming").parent('li').addClass('active');
            initPage = 1;
            getPage(upcomingmovie, 'Up-Coming');
            break;
        case 'Now-Playing':
            $("#navbar").show();
            $("#nowplaying").parent('li').addClass('active');
            initPage = 1;
            getPage(nowplayingmovie, 'Now-Playing');
            break;
        case 'search':
            $("#navbar").show();
            initPage = 1;
            $('#textsearch').val(getParametersFromUrl().search);
            searchform();
            break;
        case 'filter':
            $("#navbar").show();
            //IN DETTAGLIO FILM POSSIBILITA DI CLICCARE IL GENERE SCELTO
            initPage = 1;
            getPage(discover + "&with_genres=" + getParametersFromUrl().category + "&page=", "Filter Results:");
            break;
        case 'discover':
            $("#navbar").show();
            //PRENDE CATEGORIA
            var a = (getParametersFromUrl().category);
            //PRENDE ANNO
            var b = (getParametersFromUrl().year);
            //ESEGUE FUNCTION DISCOVER
            discoverform(a, b);
            break;
        case 'favorite':
            //STAMPA PAGINA FAVORITE
            //STAMPA PAGINA FAVORITE
            $("#navbar3").show();
            $("#navbar").hide();
            //STAMPA PAGINA FAVORITE 
            getFavorite();
            putCategoryinDivSelect();
            toolSelect();

            break;
        case undefined:
            //STAMPA HOME
            $("#navbar").show();
            getHome();
            break;
    }

}




//AL SUBMIT DELLA FORM SEARCH
$("#searchform").on("submit", function (e) {
    e.preventDefault();
    //PASSA LA QUERY STRING NELL URL
    window.location.href = '/index.html?page=search&search=' + $('#searchform input').val();
    searchform();
})

//Recupera il testo dalla form e ricerca i risultati
function searchform() {
    //setto la stringa per effettuare la ricerca
    var tempSearch = "&query=" + $("#textsearch").val();
    //richiamo la funzione del render con i seguenti parametri
    getPage(search + tempSearch + "&page=", "Search Results: " + $("#textsearch").val() + "");
    //RESETTO LA FORM
    $("#searchform")[0].reset();
    //disabilito LI QUANDO ESEGUO QUESTA FUNZIONE
    $('#menu .navbar-dark').find('li.active').removeClass('active');
}

//Funzione che renderizza pagina home
function getHome() {
    //PULISCO CONTENITORE LISTA FILM
    $("#listafilm").html("");
    //DISABILITO LOAD MORE
    $("#bottoneloadMore").css("display", "none");
    //4 chiamate ajax contemporaneamente con ritorno valori dell'array
    $.when($.ajax(popularmovie), $.ajax(topratedmovie), $.ajax(upcomingmovie), $.ajax(nowplayingmovie)).done(function (data0, data1, data2, data3) {
        var results = [];
        //Popular Movie
        results.push(data0[0]);
        //TopRated Movie
        results.push(data1[0]);
        //UpComing movie
        results.push(data2[0]);
        //NowPlaying Movie
        results.push(data3[0]);
        for (var j = 0; j < divHomearr.length; j++) {
            //creo slider con primi elementi di ogni sezione
            slider(results[j].results[0].id);
            //creo div con nomecontenitore 
            $("#listafilm").append('<div class="d-flex justify-content-between bd-highlight mb-2"><div class="p-2 bd-highlight"><h2>' + divHomearr[j] + '</h2></div><div class="p-2 bd-highlight"><a style="color:red;" href="index.html?page=' + divHomearr[j] + '"><p class="text-right" >View All</a></div></div><div id="' + divHomearr[j] + '" class="movie row"></div>');
            //stampo valori all'interno del div creato
            for (var i = 0; i < 6; i++) {
                $("#" + divHomearr[j] + "").append('<div class="col-md-2"><a href="dettagliofilm.html?id=' + results[j].results[i].id + '"><li class="movies-item"><img src="https://image.tmdb.org/t/p/w500' + results[j].results[i].poster_path + '" class="img-thumbnail rounded"><p></a><label for="' + results[j].results[i].id + '" class="custom-checkbox"><input type="checkbox" class="movie_' + results[j].results[i].id + '" id="' + results[j].results[i].id + '" onclick="modalfavorite(' + results[j].results[i].id + ', \'' + results[j].results[i].title.replace(/'/g, "@@") + '\',\'' + urlimg + "w500" + results[j].results[i].poster_path + '\')"><span class="fa fa-star-o"></span><span class="fa fa-star"></span><span>Favorite</span></label></p><a href="dettagliofilm.html?id=' + results[j].results[i].id + '"><p>' + results[j].results[i].title.replace(/@@/g, "'") + '</p></li></a></div>').children(':last').hide().fadeIn(1000);
            }
            //Controlla il db dei preferiti
        }
        putCheckedFav();
    });
}

//AL SUBMIT DELLA FORM CATEGORIA E ANNO
$("#discoverform").on("submit", function (e) {
    e.preventDefault();
    if ($("#selectgenres").val() == "" && $("#selectyear").val() == "") {
        return;
    }
    //PASSA LA QUERY STRING NELL URL
    window.location.href = '/index.html?page=discover&category=' + $('#selectgenres').val() + '&year=' + $('#selectyear').val();
    //FUNZIONE DISCOVER
    discoverform();
})


function discoverform(categoria, anno) {
    //setto la stringa anno
    var selyear = "&year=" + anno;
    //setto la stringa genres
    var selgen = "&with_genres=" + categoria;
    //setto come pagina la pagina 1
    initPage = 1;
    //richiamo la funzione di render
    getPage(discover + selyear + selgen + "&page=", "Filter Results:");
    //RESETTO LA FORM
    $("#discoverform")[0].reset();
    //disabilito LI QUANDO ESEGUO QUESTA FUNZIONE
    $('#menu .navbar-dark').find('li.active').removeClass('active');
}


function infoMovie() {
    //Chiama l'API e mostra le info del film
    $.when($.ajax(url + getParametersFromUrl().id + "?api_key=" + ApiKey)).done(
        function (data) {
            if(data.backdrop_path==null){
                $(".contenitoreInfoFilm").css(
                    "background-image",
                    "url(/img/card-backdrop.jpg)"
                );
            } else {
                $(".contenitoreInfoFilm").css(
                    "background-image",
                    "url(" + urlimg + "w1280" + data.backdrop_path + ")"
                );
            }
            
            if(data.poster_path == null){
                $("#poster-film").attr("src", "/img/card-poster.jpg");       
            } else {
                $("#poster-film").attr("src", urlimg + "w500" + data.poster_path);
            }
            $("#title").html('<h4><label for="' + data.id + '" class="custom-checkbox"><input type="checkbox" class="movie_' + data.id + '" id="' + data.id + '" onclick="modalfavorite(' + data.id + ', \'' + data.title.replace(/'/g, "@@") + '\',\'' + urlimg + "w500" + data.poster_path + '\')"><span class="fa fa-star-o"></span><span class="fa fa-star"></span><span>Favorite</span></label></h4><p>' + data.title.replace(/@@/g, "'") + '</p>');
            $("#description").html(data.overview);
            $("#year").html(data.release_date);
            $("#genre").append("<p>");
            $.each(data.genres, function (i) {
                $("#genre").append('<a style="color:white;text-decoration: underline;" href="index.html?page=filter&category=' + data.genres[i].id + '">' + data.genres[i].name + '</a>&nbsp;&nbsp;');
            });
            $("#genre").append("</p>");
            $("#vote").append('<div class="stars-outer"><div class="stars-inner"></div>');
            starWidth(data.vote_average);
        }
    );
    //Chiama l'API e mostra gli attori che hanno partecipato al film
    $.when($.ajax(url + getParametersFromUrl().id + '/credits?api_key=' + ApiKey)).done(function (data) {
        $.each(data.cast, function (i) {
            if (data.cast[i].profile_path == null) {
                $('#photoActor').append('<td><img style="cursor:pointer;" class="card" src="/img/noProfilePic.jpg" data-toggle="modal" data-target="#exampleModalCenter" onclick="getPerson(' + data.cast[i].id + ')"></td>')
            } else {
                $('#photoActor').append('<td><img style="cursor:pointer;" class="card" src="' + urlimg + 'w500' + data.cast[i].profile_path + '"  data-toggle="modal" data-target="#exampleModalCenter" onclick="getPerson(' + data.cast[i].id + ')"></td>')
            }
            $('#nameActor').append('<td><h4 style="cursor:pointer;" data-toggle="modal" data-target="#exampleModalCenter" onclick="getPerson(' + data.cast[i].id + ')">' + data.cast[i].name + '</h4></td>')
            $('#characterActor').append('<td><h6 style="cursor:pointer;" data-toggle="modal" data-target="#exampleModalCenter" onclick="getPerson(' + data.cast[i].id + ')">' + data.cast[i].character + '</h6></td>')
        })
    })
}

//Recupera l'id del film dalla query string null'URL
function getParametersFromUrl() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}




//Funzione che renderizza tutte le altre
function getPage(page, el) {
    $.ajax({
        type: "GET",
        url: page + initPage,
        success: function (data) {
            if (data.results == "") {
                $("#listafilm").html("");
                $("#listafilm").append('<p><h2>NESSUN CAMPO TROVATO<h2></p>');
            } else {

                if (initPage >= data.total_pages) {
                    $("#bottoneloadMore").hide()
                }
                else {
                    $("#bottoneloadMore").show()
                }
                if (initPage > 1) {
                    $.each(data.results, function (i) {
                        $("#movieclass").append('<div class="col-md-3"><a href="dettagliofilm.html?id=' + data.results[i].id + '"><li class="movies-item"><img style="heigth:300px" src="https://image.tmdb.org/t/p/w500' + data.results[i].poster_path + '"  alt="" class="img-thumbnail rounded"><p></a><p><p><label for="' + data.results[i].id + '" class="custom-checkbox"><input type="checkbox" class="movie_' + data.results[i].id + '" id="' + data.results[i].id + '" onclick="modalfavorite(' + data.results[i].id + ', \'' + data.results[i].title.replace(/'/g, "@@") + '\',\'' + urlimg + "w500" + data.results[i].poster_path + '\')"><span class="fa fa-star-o"></span><span class="fa fa-star"></span><span>Favorite</span></label></p></p>' + data.results[i].title.replace(/@@/g, "'") + '</p></li></a></div>').children(':last').hide().fadeIn(1000);
                    });
                } else {
                    $("#listafilm").html("");
                    $("#listafilm").append('<p><h2>' + el + '</h2></p><div id="movieclass" class="movie row"></div>');
                    $.each(data.results, function (i) {
                        if (data.results[i].poster_path == null) {
                            $("#movieclass").append('<div class="col-md-3"><a href="dettagliofilm.html?id=' + data.results[i].id + '"><li class="movies-item"><img  style="heigth:300px" src="/img/card-poster.jpg"  alt="" class="img-thumbnail rounded"><p></a><p><p><label for="' + data.results[i].id + '" class="custom-checkbox"><input type="checkbox" class="movie_' + data.results[i].id + '" id="' + data.results[i].id + '" onclick="modalfavorite(' + data.results[i].id + ', \'' + data.results[i].title.replace(/'/g, "@@") + '\',\'' + "/img/card-poster.jpg" + '\')"><span class="fa fa-star-o"></span><span class="fa fa-star"></span><span>Favorite</span></label></p></p>' + data.results[i].title.replace(/@@/g, "'") + '</p></li></a></div>').children(':last').hide().fadeIn(1000);
                        }
                        else {
                            slider(data.results[i].id);
                            $("#movieclass").append('<div class="col-md-3"><a href="dettagliofilm.html?id=' + data.results[i].id + '"><li class="movies-item"><img  style="heigth:300px" src="https://image.tmdb.org/t/p/w500' + data.results[i].poster_path + '"  alt="" class="img-thumbnail rounded"><p></a><p><label for="' + data.results[i].id + '" class="custom-checkbox"><input type="checkbox" class="movie_' + data.results[i].id + '" id="' + data.results[i].id + '" onclick="modalfavorite(' + data.results[i].id + ', \'' + data.results[i].title.replace(/'/g, "@@") + '\',\'' + urlimg + "w500" + data.results[i].poster_path + '\')"><span class="fa fa-star-o"></span><span class="fa fa-star"></span><span>Favorite</span></label></p>' + data.results[i].title.replace(/@@/g, "'") + '</p></p></li></a></div>').children(':last').hide().fadeIn(1000);
                        }
                    });
                }
                putCheckedFav();
                $("#bottoneloadMore").html('<button class="btn btn-primary my-2 my-sm-0" onclick=loadMore("' + page + '")>Load More</button>');
            }
        },
        error: function (e) {
            error404();
        }
    });
}



//Creazione dello slider di foto
function slider(el) {
    //Chiama l'API e mostra le info del film
    $.when($.ajax(url + el + "?api_key=" + ApiKey)).done(
        function (data) {
            if (counter < 4) {
                $("#superContenitoreFilm").append('<a href="dettagliofilm.html?id=' + el + '"><div class="contenitoreInfoFilm" style="display:none" id=' + counter + '><div class="fluid-opacity"><div class="container"><table class="table"><tr><td><img class="card" id="poster-film" src="/img/card-poster.jpg"></td><td><table class="table"><tr><h1 id="title">Title</h1></tr><tr><h4 id="year"></h4></tr><td style="max-width: 500px;"><h1>Description</h1><p id="description"></p></td></table></td></tr></table></div></div></a></div>');
                $("#" + counter).css(
                    "background-image",
                    "url(" + urlimg + "w1280" + data.backdrop_path + ")"
                );
                $("#" + counter + " #poster-film").attr("src", urlimg + "w500" + data.poster_path);
                $("#" + counter + " #title").html(data.title.replace(/@@/g, "'"));
                $("#" + counter + " #description").html(data.overview);
                $("#" + counter + " #year").html(data.release_date);
                counter++;
            }
            sliderAction();
        }
    );
}

//Slider Effect
function sliderAction() {
    var counter = 0;
    $("#superContenitoreFilm #" + counter).show();
    var i = setInterval(function () {
        $("#superContenitoreFilm #" + counter).hide();
        if (counter === 3) {
            sliderAction();
        }
        counter++;
        $("#superContenitoreFilm #" + counter).show();
    }, 6000);


}

//Funzione load more
function loadMore(el) {
    initPage++;
    getPage(el)
}


//FUNZIONE CHE PRELEVA TUTTI I GENERI E VA A CREARE LA SELECT CON I VALORI PRESI DAL GET
function getGenre() {
    $.ajax({
        type: "GET",
        url: genere,
        success: function (data) {
            $.each(data.genres, function (i) {
                var o = new Option(data.genres[i].name, data.genres[i].id);
                $("#selectgenres").append(o);
            });
        },
        error: function () {
            error404();
        }
    });
}






//FUNZIONE CHE CREA UNA SELECT CON RANGE
function getYear() {
    var startDate = 1899;
    var currentDate = 2019;
    for (i = currentDate; i > startDate; i--) {
        var o = new Option(i, i);
        $("#selectyear").append(o);
    }
}

function error404() {
    $('body').children().hide();
    $('#menu').show();
    $('body').append('<br><br><br><br><br><br>  <div class="row"><div class="blank_class col-md-3"></div><div class="col-md-6"><img class="img-thumbnail" style="border:none" src="/img/404.png"></img></div><div class="blank_class col-md-3"></div></div>');
}

function getPerson(id) {
    $.ajax({
        type: "GET",
        url: person + id + '?api_key=' + ApiKey + '&language=en-US',
        success: function (data) {
            if (data.profile_path == null) {
                $('#imgActor').attr('src', '/img/noProfilePic.jpg');
            } else {
                $('#imgActor').attr('src', 'https://image.tmdb.org/t/p/w500' + data.profile_path);
            }
            $('#name').html(data.name);
            if (data.birthday == null) {
                $('#birthday').html('');
            } else {
                $('#birthday').html('Birthday: ' + data.birthday);
            }
            if (data.place_of_birth == null) {
                $('#placeOfBirth').html('');
            } else {
                $('#placeOfBirth').html(data.place_of_birth);
            }
            if (data.biography == "") {
                $('#biography').html('');
            } else {
                $('#biography').html('<strong>Biography: &nbsp;</strong> ' + data.biography);
            }

        }
    })
}


//mostra stelle in rating vote
function starWidth(e) {
    const starTotal = 10;
    const starPercentage = (e / starTotal) * 100;
    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
    $(".stars-inner").css("width", starPercentageRounded);

}

//switch nav menu li active
$('#menu .navbar-dark a').on('click', function () {
    $('#menu .navbar-dark').find('li.active').removeClass('active');
});


function modifymodalfav(indice) {
    $("#multiSelectModal").attr("disabled", false);
    var categoria = favorite[indice].idcategory;
    var idfilm = favorite[indice].id;
    searchMultiCategory(categoria, idfilm);
    var addCategoria = '<p>Crea una nuova categoria:</p><button id="toggleButton" onclick="addModal()" value="add">+</button>';
    $("#aggiungicategory").html(addCategoria);
    $("#sendModal").attr("onclick", 'confirmModify(' + idfilm + ')');
    $("#modalfavorite").modal();

}

function modalfavorite(id, title, photo) {
    $('#modalform')[0].reset();
    $("#multiSelectModal").attr("disabled", false);
    var inputcheck = $("#" + id).prop("checked");
    if (inputcheck) {
        $("#" + id).prop("checked", false);

        var addCategoria = '<p>Crea una nuova categoria:</p><button id="toggleButton" onclick="addModal()" value="add">+</button>';
        $("#aggiungicategory").html(addCategoria);
        $("#sendModal").attr("onclick", 'updateFavorite(\'' + id + '\',\'' + title + '\',\'' + photo + '\')');
        $("#modalfavorite").modal();


    } else {
        $("#" + id).prop("checked", false);
        deleteItemFavorite(id);
    }

}

function addModal() {

    if ($("#toggleButton").val() == "add") {
        $("#multiSelectModal").attr("disabled", true);
        $("#aggiungicategory").append('<input type="text" id="newCategory1" placeholder="Aggiungi Categoria">');
        $("#sendModal").hide();
        $("#btnAddCategory").show().attr("onclick", 'updateCategory(1)');
        $("#toggleButton").val('meno').html("-");
    } else {
        $("#multiSelectModal").attr("disabled", false);
        $("#sendModal").show();
        $("#btnAddCategory").hide();
        $("#toggleButton").val('add').html("+");
        $("#newCategory1").remove();

    }

}


function updateMultiSelectCategory(idfilm, categorie) {

    for (i = 0; i < favorite.length; i++) {
        if (idfilm == favorite[i].id) {
            favorite[i].idcategory = categorie;
        }
    }
    setCategory();
    setFavorite();
}

function confirmModify(idfilm) {
    var categorie = $("#multiSelectModal").val();
    updateMultiSelectCategory(idfilm, categorie)
    toolSelect();
    $("#modalfavorite").modal("hide");
}


function btnNoCategory(){
    $('#modalform')[0].reset();
    $("#multiSelectModal option").attr("selected", false);
}


function searchMultiCategory(categoriefilm, idfilm) {

    btnNoCategory();
    for (i = 0; i < categoriefilm.length; i++) {
        for (j = 0; j < category.length; j++) {
            if (categoriefilm[i] == category[j].id) {
                $("#multiSelectModal option[value=" + categoriefilm[i] + "]").attr("selected", "selected");
            }
        }
    }
    $("#modalform input[type=submit]").attr("id", idfilm);

}

function putCategoryinDivMultiSelect() {
    $.each(category, function (j) {
        var o = new Option(category[j].nome, category[j].id);
        $("#multiSelectModal").append(o);
    })
}


function editSingleCategory(idselect) {
    var tempText = $("#modvalcat").val()
    if (tempText == "") {
        $("#modvalcat").css("border", "solid 2px red");
    } else {
        category[idselect - 1].nome = tempText;
        $("#selectCategory").attr("disabled", false);
        $("#modifiytools").remove();
        $("#modFav").val('add').html("Modifica");
        $("#delFav").attr("disabled", false);
        $("#modifiytools").hide();
        setCategory();
        putCategoryinDivSelect(idselect);
    }
}

function toolMod() {
    if ($("#modFav").val() == "add") {
        $("#selectCategory").attr("disabled", true);
        $("#contenitoreinputmod").html('<div id="modifiytools"><input type="text" id="modvalcat"><button onclick="editSingleCategory(' + $("#selectCategory").val() + ')">conferma</button></div>');
        $("#modFav").val('meno').html("Annulla Modifica");
        $("#toggleButton2").attr("disabled", true);
        $("#delFav").attr("disabled", true);
    } else {
        $("#selectCategory").attr("disabled", false);
        $("#modifiytools").remove();
        $("#modFav").val('add').html("Modifica");
        $("#delFav").attr("disabled", false);
        $("#toggleButton2").attr("disabled", false);
    }
}

function addCategoryFav() {

    if ($("#toggleButton2").val() == "add") {
        $("#selectCategory").attr("disabled", true);
        $("#aggiungicategory2").html('<div id="modifiytools"><input type="text" id="newCategory2"><button onclick="updateCategory(2)">Conferma</button></div>');
        $("#toggleButton2").val('meno').html("-");
        
        $("#modFav").attr("disabled", true);
        $("#delFav").attr("disabled", true);
    } else {
        $("#selectCategory").attr("disabled", false);
        $("#modifiytools").remove();
        $("#toggleButton2").val('add').html("+");
        $("#modFav").attr("disabled", false);
        $("#delFav").attr("disabled", false);
        if($("#selectCategory").val() == "all"){
            $("#modFav").attr("disabled", true);
            $("#delFav").attr("disabled", true);
            }
    }

}

function toolSelect() {
    if(favorite.length==0){
        $('#testo_vuoto').html('<h3>Nessun film aggiunto ai preferiti</h3>')
    }
    var selectValue = $("#selectCategory").val();
    if (isNaN(selectValue)) {
        $("#modFav").attr("disabled", true);
        $("#delFav").attr("disabled", true);
    } else {
        $("#modFav").attr("disabled", false);
        $("#delFav").attr("disabled", false);
    }
    checkCategoryFavorite(selectValue);
}

function putCategoryinDivSelect(e) {
    $("#selectCategory").html('<option value="all">Tutti i Film</option>');
    $.each(category, function (i) {
        var o = new Option(category[i].nome, category[i].id);
        $("#selectCategory").append(o);
    })
    if (e != undefined) {
        $("#selectCategory").val(e);
    }

}





function getCategory() {
    var checkExistCookie = $.cookie("category");
    if (checkExistCookie == undefined) {
        $.cookie("category", "[]");
        category = $.parseJSON($.cookie("category"));
        console.log("Category:", category);
    } else {
        //Prelevo i valori del cookie
        category = $.parseJSON($.cookie("category"));
        if (category) {
            console.log("Category:", category);
        }
        else {
            alert("problema con il file JSON");
        }
    }
}

function getFavorite() {
    var checkExistCookie = $.cookie("favorite");
    if (checkExistCookie == undefined) {
        alert("prova")
        $.cookie("favorite", "[]");
        favorite = $.parseJSON($.cookie("favorite"));
        console.log("Favorite:", favorite);
    } else {
        //Prelevo i valori del cookie
        favorite = $.parseJSON($.cookie("favorite"));
        if (favorite) {
            console.log("Favorite:", favorite);
        }
        else {
            alert("problema con il file JSON");
        }
    }
}

function setCategory() {
    //INSERISCO LA VARIABILE ALL'INTERNO DEL COOKIE
    $.cookie("category", JSON.stringify(category));
}

function setFavorite() {
    //INSERISCO LA VARIABILE ALL'INTERNO DEL COOKIE
    $.cookie("favorite", JSON.stringify(favorite));
}

function updateCategory(e) {
    var id
    var newCategory;
    if (e == 1) {
        newCategory = $("#newCategory1");
    }
    else {
        newCategory = $("#newCategory2");
    }

    if (newCategory.val() == "") {
        newCategory.css("border", "solid 1px red");
        return
    }
    element = newCategory.val();

    if (category.length == 0) {
        id = 1
    } else {
        id = (category[category.length - 1].id) + 1;
    }

    category.push(
        {
            "id": id,
            "nome": element
        }
    );
    //INSERIMENTO ALL'INTERNO DEL COOKIE
    setCategory();
    getCategory();
    if (e == 1) {
        $("#multiSelectModal").html("");
        putCategoryinDivMultiSelect();
        $("#multiSelectModal").attr("disabled", false);
        $("#toggleButton").val('add').html("+");
        $("#sendModal").show();
        $("#btnAddCategory").hide();
        $("#newCategory1").remove();

    } else {

        $("selectCategory").html("");
        putCategoryinDivSelect();
        $("#modifiytools").remove();
        $("#toggleButton2").val('add').html("+");
        $("#modFav").attr("disabled", false);
        $("#delFav").attr("disabled", false);
        $("#selectCategory").val("all");
        toolSelect();
        $("#selectCategory").attr("disabled", false);

    }

}

function updateFavorite(id, title, photo) {
    var idcategorie = $("#multiSelectModal").val();
    if(photo == urlimg){
        photo = "/img/card-poster.jpg";
    }
    favorite.push(
        {
            "id": id,
            "title": title,
            "photo": photo,
            "idcategory": idcategorie
        }
    );
    //INSERIMENTO ALL'INTERNO DEL COOKIE
    setFavorite();
    getFavorite();
    $("#modalfavorite").modal("hide");
    $("#" + id).prop("checked", true);
}

function putCheckedFav() {
    $.each(favorite, function (i) {
        $(".movie_" + favorite[i].id).prop("checked", true);
    })
}

function deleteitemCategory(id) {
    var i = category.length;
    while (i--) {
        if (category[i].id == id) {
            category.splice(i, 1);
        }
    }
    setCategory();
    getCategory()
}

function deleteItemFavorite(id) {
    var i = favorite.length;
    while (i--) {
        if (favorite[i].id == id) {
            favorite.splice(i, 1);
        }
    }
    setFavorite();
    getFavorite()
}

function checkCategoryFavorite(e) {
    //PULISCI TUTTI I DIV
    $("#listafilm").html("");
    $("#superContenitoreFilm").html("");
    $("#navbar").html("");
    $("#navbar2").html("");
    $("#listafilm").append('<p></p><div id="movieclass" class="movie row"></div>');
    
    var test=0;
    for (i = 0; i < favorite.length; i++) {
        $('#testo_vuoto').html('');
        if(favorite[i].photo==null){
            favorite[i].photo = '/img/card-poster.jpg'
        }
        if (isNaN(e)) {
            $("#movieclass").append('\
            <div class="col-md-3">\
                <a href="dettagliofilm.html?id=' + favorite[i].id + '">\
                    <li class="movies-item inline" >\
                        <img  style="heigth:300px" src="' + favorite[i].photo + '"  alt="" class="img-thumbnail rounded"></a> \
                        <p>\
                            <a href="dettagliofilm.html?id=' + favorite[i].id + '">' + favorite[i].title.replace(/@@/g, "'") + '</a>\
                                <a onclick="modifymodalfav(' + i + ')"\
                                <i class="fa fa-pencil" style="color:black"></i>\
                                </a>\
                            <div><span>&nbsp;</span>\
                                <label for="' + favorite[i].id + '" class="custom-checkbox">\
                                <input type="checkbox" class="movie_' + favorite[i].id + '" id="' + favorite[i].id + '" onclick="deleteItemFavorite(' + favorite[i].id + '); toolSelect()"></input>\
                                <span class="fa fa-star-o"></span><span class="fa fa-star"></span>\
                                </label>\
                            </div>\
                        </p>\
                    </li>\
            </div>').children(':last').hide().fadeIn(1000);
            putCheckedFav();
        } else {

            for (j = 0; j < favorite[i].idcategory.length; j++) {
                if (favorite[i].idcategory[j] == e) {
                    $("#movieclass").append('\
                    <div class="col-md-3">\
                        <a href="dettagliofilm.html?id=' + favorite[i].id + '">\
                            <li class="movies-item">\
                                <img  style="heigth:300px" src="' + favorite[i].photo + '"  alt="" class="img-thumbnail rounded"></a>\
                            <p>\
                            <a href="dettagliofilm.html?id=' + favorite[i].id + '">' + favorite[i].title.replace(/@@/g, "'") + '</a>\
                                <a onclick="removeItem(' + i + ',' + $("#selectCategory").val() + ')"<i class="fa fa-times" style="color:red"></i></a>\
                                    <span>&nbsp;</span>\
                                <a onclick="modifymodalfav(' + i + ')";"<i class="fa fa-pencil" style="color:black"></i></a>\
                                    <span>&nbsp;</span>\
                            </p>\
                            </li>\
                        </a>\
                    </div>').children(':last').hide().fadeIn(1000);
                    putCheckedFav();
                    test ++;
                } 
            
            }
            if(test == 0){
                $('#testo_vuoto').html('<h3>Nessun preferito aggiunto alla categoria</h3>')
            }
        }

    }
    

    putCheckedFav();
}

function deleteAllCategory(idcategoria) {
    $.each(favorite, function (i) {
        removeItem(i, idcategoria);
    })
    deleteitemCategory(idcategoria);
    $("#deletemodalfavorite").modal("hide");
    $("#selectCategory").val("all");
    putCategoryinDivSelect();
    toolSelect();
    setFavorite();
    setCategory();
}


function deleteModalfavorite() {
    $("#sendDelete").attr("onclick", "deleteAllCategory(" + $("#selectCategory").val() + ")");
    $("#deletemodalfavorite").modal();
}

function removeItem(indice, idselectedcategory) {
    var idfilm = favorite[indice].id;
    var idcategorie = favorite[indice].idcategory;

    for (j = 0; j < idcategorie.length; j++) {
        if (idcategorie[j] == idselectedcategory) {
            idcategorie.splice(j, 1);
        }
    }
    toolSelect();
    setFavorite();
    setCategory();

}


























































































































































//MILLE RIGHE SEH :) (CIAO VIT E GENNY)