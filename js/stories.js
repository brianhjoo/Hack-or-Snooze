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

async function handleSubmitFormInputs(evt) {
  evt.preventDefault();

  const authorInput = $('#create-author').val();
  const titleInput = $('#create-title').val();
  const urlInput = $('#create-url').val();

  const newStory = {
    title: titleInput,
    author: authorInput,
    url: urlInput,
  };

  let story = await storyList.addStory(currentUser, newStory);

  const storyHTML = generateStoryMarkup(story);

  $allStoriesList.prepend(storyHTML);
}


$("#submit-form").on('submit', handleSubmitFormInputs);