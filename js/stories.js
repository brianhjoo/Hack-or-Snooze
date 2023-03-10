"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="bi bi-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets inputs from form and generates new story.  Creates new HTML elements and
 * prepends them to the existing story list.
 */

async function createAndDisplayNewStory(evt) {
  evt.preventDefault();

  const authorInput = $('#create-author').val();
  const titleInput = $('#create-title').val();
  const urlInput = $('#create-url').val();

  const newStory = {
    title: titleInput,
    author: authorInput,
    url: urlInput,
  };

  const story = await storyList.addStory(currentUser, newStory);

  const storyHTML = generateStoryMarkup(story);

  $allStoriesList.prepend(storyHTML);

  // Clear form input
  $('#create-author').val("");
  $('#create-title').val("");
  $('#create-url').val("");

  // Hide form after submission
  $("#submit-form").attr("style", "display:none");
}

$("#submit-form").on('submit', createAndDisplayNewStory);


/**  */
function displayFavorites(listOfFavorites) {
  for (let favoriteStory of listOfFavorites) {
    const favoriteStoryMarkUp = generateStoryMarkup(favoriteStory);
    $('#favorited-stories').prepend(favoriteStoryMarkUp);
  }
  $('i').toggleClass('bi-star bi-star-fill');
}

// $('i').closest('i').toggleClass('bi-star bi-star-fill');



async function handleFavoritedStar(evt) {

  const $newStoryLi = $(evt.target).closest('li');

  const id = $newStoryLi.attr('id');

  const foundFavoriteStory = storyList.stories.filter(story => {
    return story.storyId === id;
  });

  // if not favorited yet
  if ($(evt.target).hasClass('bi-star')) {
    $(evt.target).closest('i').toggleClass('bi-star bi-star-fill');

    // const [favoriteStory] = foundFavoriteStory;

    await currentUser.addFavorite(foundFavoriteStory[0]);
  } else {
    $(evt.target).closest('i').toggleClass('bi-star-fill bi-star');

    // const [favoriteStory] = foundFavoriteStory;

    await currentUser.removeFavorite(foundFavoriteStory[0]);
  }
}

$('.stories-list').on('click', $('.star'), handleFavoritedStar);
