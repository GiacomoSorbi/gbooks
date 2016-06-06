import React from "react";

export default class GoogleBookItem extends React.Component {

  constructor() {
    super();
  }

  render() {
    const item = this.props.item;
    return (
      <div className="bookCard">
      <div>
        <h5><a href={item.url} target="_blank">{item.title}</a></h5>
        <img className="thumb" src={item.coverUrl} alt={item.title} />
        <p className="clearfix">
          {item.description}
          ...
          [<a href={item.url} target="_blank">Read more</a>]
        </p>
      </div>
      </div>
    );
  }
}