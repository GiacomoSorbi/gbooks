jest.disableAutomock();

import GoogleBooksStore from "../GoogleBooksStore";
import * as GoogleBooksActions from "../GoogleBooksActions";

describe("GoogleBooksStore", () => {

  var changeCounter;
  var oldChangeCounter;

  function changeListener() {
    ++changeCounter;
  }

  // Utility function, will fail if change listener was not called.
  function expectChangeListener(changed) {
    if (changed) {
      expect(oldChangeCounter).not.toBe(changeCounter);
      oldChangeCounter = changeCounter;
    } else {
      expect(oldChangeCounter).toBe(changeCounter);
    }
  }

  beforeEach(function () {
    changeCounter = 0;
    oldChangeCounter = 0;
    GoogleBooksStore.addChangeListener(changeListener);
  });

  it("Has valid initial state", () => {
    expect(GoogleBooksStore.isLoading()).toBe(false);
    expect(GoogleBooksStore.getBooks()).toEqual([]);
    expect(GoogleBooksStore.getLastError()).toBe("");
  });

  it("Has working load error handling", () => {
    GoogleBooksActions.googleBooksLoadError("Generic error");

    expectChangeListener(true);

    expect(GoogleBooksStore.isLoading()).toBe(false);
    expect(GoogleBooksStore.getBooks()).toEqual([]);
    expect(GoogleBooksStore.getLastError()).toBe("Generic error");
  });

  it("Has working mock data loading", () => {

    var data = {
      items: [
        {
          volumeInfo: {
            canonicalVolumeLink: "xxx",
            description: "description",
            title: "title",
            imageLinks: {
              smallThumbnail: "yyy"
            }
          }
        }, {
          volumeInfo: {
            canonicalVolumeLink: "xxx1",
            description: "description1",
            title: "title1",
          }
        }
      ]
    };

    GoogleBooksActions.googleBooksLoaded(data);

    expectChangeListener(true);

    expect(GoogleBooksStore.isLoading()).toBe(false);
    expect(GoogleBooksStore.getLastError()).toBe("");
    const books = GoogleBooksStore.getBooks();
    expect(books.length).toBe(data.items.length);
    for (let i = 0; i < data.items.length; ++i) {
      const d = data.items[i];
      expect(books[i].title).toBe(d.volumeInfo.title);
      expect(books[i].description).toBe(d.volumeInfo.description);
      expect(books[i].url).toBe(d.volumeInfo.canonicalVolumeLink);
      if (d.volumeInfo.imageLinks)
        expect(books[i].coverUrl).toBe(d.volumeInfo.imageLinks.smallThumbnail);
    }
  });

  afterEach(function () {
    GoogleBooksStore.removeChangeListener(changeListener);
  });
});
