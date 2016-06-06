"use strict";

import AppDispatcher from "./AppDispatcher";
import GoogleBooksConstants from "./GoogleBooksConstants";

/**
 * Action used to load books from Google APIs.
 */
export function loadGoogleBooks() {
  AppDispatcher.dispatch({
    actionType: GoogleBooksConstants.loadGoogleBooks
  });
}

/**
 * Action called when the google books are loaded from Google APIs.
 */
export function googleBooksLoaded(books) {
  AppDispatcher.dispatch({
    actionType: GoogleBooksConstants.googleBooksLoaded,
    books: books
  });
}

/**
 * Action called if there was an error fetching data from google API.
 */
export function googleBooksLoadError(error) {
  AppDispatcher.dispatch({
    actionType: GoogleBooksConstants.googleBooksLoadError,
    error: error
  });
}
