"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit form on click on "submit"  */
function navSubmitClick(evt) {
  console.debug("navSubmitclick", evt);
  evt.preventDefault();
  $("#submit-form").attr("style", "display:flex");
}

$navSubmit.on("click", navSubmitClick);

function handleFavoritesNav(evt) {
  evt.preventDefault();
  $("#all-stories-list").hide();

  $('#favorited-stories').empty();

  displayFavorites(currentUser.favorites);
  $('#favorited-stories').attr('style', 'display: block');
}

$favoritesTab.on("click", handleFavoritesNav);

