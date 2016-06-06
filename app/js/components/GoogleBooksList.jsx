import React from "react";
import GoogleBooksItem from "./GoogleBookItem.jsx";
import GoogleBooksStore from "../flux/GoogleBooksStore";
import * as GoogleBooksActions from "../flux/GoogleBooksActions";

export default class GoogleBooksList extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  /**
   * Utility function used to load the current state from the store.
   */
  loadStoreState() {
    this.setState({
      books: GoogleBooksStore.getBooks(),
      isLoading: GoogleBooksStore.isLoading(),
      lastError: GoogleBooksStore.getLastError()
    });
  }

  /**
   * This method is called by React when this component gets mounted in the page.
   * Here we register this component to receive change notification events from the GoogleBooksStore.
   * When GoogleBooksStore changes, the component will be rendered again.
   */
  componentDidMount() {

    // Load initial state from store.
    this.loadStoreState();

    // Function used to update the internal state when the books list changes.
    this.__onChange = () => this.loadStoreState();

    // Attach to the store events.
    GoogleBooksStore.addChangeListener(this.__onChange);
  }

  /**
   * This method is called by React when this component gets removed from the page.
   * The component will be removed from GoogleBooksStore notification list.
   */
  componentWillUnmount() {
    GoogleBooksStore.removeChangeListener(this.__onChange);
  }

  /**
   * React will call this method to render the component.
   */
  render() {
    const books = this.state.books;
    const items = books && books.length > 0 ? this.state.books.map((item, index) =>
      <GoogleBooksItem key={index} item={item} />
    ) : <div className="text-center">No books retrieved.</div>;

    return (
      <div className="container-fluid">
        <div className="panel text-center">
          <button type="button" className="btn btn-default" disabled={this.state.isLoading} onClick={GoogleBooksActions.loadGoogleBooks}>
            {books && books.length ? "Refresh" : "Load books"}
          </button>

          {this.state.lastError ? (<div className="text-danger">Error loading: {this.state.lastError}</div>) : null}
        </div>

        <div className="row flex-container">
          {this.state.isLoading ? <div className="loader text-center">loading ...</div> : items}
        </div>
      </div>
    );
  }
}
