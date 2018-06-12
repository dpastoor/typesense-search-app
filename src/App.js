import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash'
import {Search, Grid, Header, Label, Segment} from 'semantic-ui-react'
import TypesenseApi from './api'

let tsa = new TypesenseApi('localhost', "gatsbyserver", "8108", "http")

const navSlug = (slug, nav_target) => {
  if (nav_target === "root") {
     return(slug)
  }
  if (slug[slug.length - 1] === "/") {
    slug = slug.slice(1, -1)
  }
  return(slug+nav_target)
}
const transformSlug = function (slug) {
  //assuming each slug has leading and trailing slash
  if (slug[0] !== "/") {
    slug = "/" + slug
  }
  if (slug[slug.length - 1] !== "/") {
    slug = slug + "/"
  }
  let splits = slug.split("/");

  return (`${splits[1]}/${splits[splits.length - 2]}`)
}
const resultRenderer = ({slug, snippets, branch, nav_target}) => {
  return (
    <div 
    style={{
      display: "block",
      width: "80vw"
    }}
    >
      <Label content={navSlug(slug, nav_target)}/>
      <span style={{
        textAlign: "left"
      }}>
      <Segment.Group>
      {snippets.map((snippet) => {
      return (
      <Segment key={snippet}
      onClick={(e) => {
        e.preventDefault()
        console.log(slug, nav_target)
      }}
      > 
      <div dangerouslySetInnerHTML={{__html: snippet}} /> 
       </Segment>)
      })}
      </Segment.Group>
      </span>
    </div>
  )
}

class SearchExampleCategory extends Component {
  state = {
    isLoading: false,
    results: [],
    value: ''
  }
  resetComponent = () => this.setState({isLoading: false, results: [], value: ''})

  handleResultSelect = (e, {result}) => console.log("selected ", result)

  handleSearchChange = (e, {value}) => {
    tsa
      .getSearchResults(value)
      .then(result => {
        this.setState({value, results: result})
      })
  }
  render() {
    const {isLoading, value, results} = this.state

    return (
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
            value={value}
            resultRenderer={resultRenderer}
            results={results}
            minCharacters={2}
            {...this.props}/>
    )
  }
}

class App extends Component {
  async fetchAsync() {
    // await response of fetch call
    let response = await fetch('https://api.github.com');
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
  }

  render() {
    return (
      <div className="App">
        <SearchExampleCategory/>
      </div>
    );
  }
}

export default App;
