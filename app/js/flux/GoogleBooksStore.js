import AppDispatcher from "./AppDispatcher";
import { EventEmitter } from "events";
import GoogleBooksConstants from "./GoogleBooksConstants";
import * as GoogleBooksActions from "./GoogleBooksActions";

// Polyfill for "fetch" method. See https://developer.mozilla.org/en/docs/Web/API/Fetch_API
import 'whatwg-fetch';

class GoogleBooksStoreClass extends EventEmitter {

  constructor() {
    super();
    this.__books = [];
    this.__loading = false;
    this.__error = "";
  }

  /**
   * Attaches an event receiver for this store.
   * This is used by views to get notified when something changes in this store.
   * When something changes the callback will be executed.
   * To unregister the callback call method removeChangeListener.
   */
  addChangeListener(cb) {
    this.on("change", cb);
  }

  /**
   * Removes a callback previously registered with method addChangeListener.
   */
  removeChangeListener(cb) {
    this.removeListener("change", cb);
  }

  /**
   * Notifies the store that something changed.
   * Will raise an event that calls every callback registered with addChangeListener method.
   * notifyChange method have to be called each time something changes that needs to be notified to react components.
   */
  notifyChange() {
    this.emit("change");
  }

  /**
   * True if we are loading the data from the server, false otherwise.
   */
  isLoading() {
    return this.__loading;
  }

  /**
   * Gets the list of books loaded trhough Google APIs.
   */
  getBooks() {
    return this.__books;
  }

  /**
   * Gets the last error that happened during load operation.
   */
  getLastError() {
    return this.__error;
  }
}

// Initialize the singleton for GoogleBooksStoreClass.
const GoogleBooksStore = new GoogleBooksStoreClass();

const dispatcherListener = {};

// Function called when GoogleBooksConstants.loadGoogleBooks is dispatched.
dispatcherListener[GoogleBooksConstants.loadGoogleBooks] = payload => {

  if (GoogleBooksStore.isLoading())
    return; // Store is already loading, ignore this request.

  GoogleBooksStore.__error = "";
  GoogleBooksStore.__loading = true;

  // Let's do a query to google to fetch the books.
  fetch('https://www.googleapis.com/books/v1/volumes?q=javascript&orderBy=newest&maxResults=20')
    .then(response => { // Response received
      if (response.ok) // Call succesfull, process as JSON.
        return response.json();

      // An error occourred.
      GoogleBooksStore.__loading = false;
      GoogleBooksActions.googleBooksLoadError(response.statusText || "Error " + response.status);
    })
    .then(data => { // Asynchronous callback, query succesfully executed.
      GoogleBooksStore.__loading = false;
      if (data) {
        // Data received.
        GoogleBooksActions.googleBooksLoaded(data);
      } else {
        GoogleBooksActions.googleBooksLoadError("No data received");
      }
    }).catch(ex => { // Error.
      GoogleBooksStore.__loading = false;
      GoogleBooksActions.googleBooksLoadError("Fatal error: " + ex);
    });

  GoogleBooksStore.notifyChange();
};

// Function called when GoogleBooksConstants.googleBooksLoaded is dispatched.
dispatcherListener[GoogleBooksConstants.googleBooksLoaded] = payload => {

  GoogleBooksStore.__error = "";
  GoogleBooksStore.__books = payload.books.items.map(book => {
    return {
      url: book.volumeInfo.canonicalVolumeLink,
      description: book.volumeInfo.description.slice(0, 200),
      title: book.volumeInfo.title,
      coverUrl: (book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail || book.volumeInfo.imageLinks.smallThumbnail : null) || "http://i.stack.imgur.com/Mmww2.png"
    };
  });

  GoogleBooksStore.notifyChange();
};

// Function called when GoogleBooksConstants.googleBooksLoadError is dispatched.
dispatcherListener[GoogleBooksConstants.googleBooksLoadError] = payload => {
  GoogleBooksStore.__error = payload.error;
  GoogleBooksStore.notifyChange();
};

AppDispatcher.register(payload => {
  const action = dispatcherListener[payload.actionType];
  if (action !== undefined)
    action(payload);
});


export default GoogleBooksStore;
