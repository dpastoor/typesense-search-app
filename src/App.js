import React, {Component} from 'react';
// import './App.css';
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash'
import {Search, Grid, Header, Label, Segment} from 'semantic-ui-react'
import TypesenseApi from './api'
import URL from 'url-parse'
// set typesense api
let TYPESENSE_CONFIG = process.env.TYPESENSE_CONFIG;
let pathPrefix = process.env.TYPESENSE_PATH_PREFIX || "";

const navSlug = (slug, nav_target) => {
  if (nav_target === "root") {
    return (slug)
  }
  if (slug[slug.length - 1] === "/") {
    slug = slug.slice(1, -1)
  }
  return (slug + nav_target)
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
    <div style={{
      display: "block",
      width: "80vw"
    }}>
      <Label content={navSlug(slug, nav_target)}/>
      <span style={{
        textAlign: "left"
      }}>
        <Segment.Group>
          {snippets.map((snippet) => {
            return (
              <Segment
                compact
                key={snippet}
                onClick={(e) => {
                e.preventDefault()
              }}>
                <div
                  dangerouslySetInnerHTML={{
                  __html: snippet
                }}/>
              </Segment>
            )
          })}
        </Segment.Group>
      </span>
    </div>
  )
}

class TypesenseSearch extends Component {

  state = {
    isLoading: false,
    results: [],
    value: '',
    tsc: undefined
  }
  componentDidMount = () => {
    // set typesense api
    let tsc;
    if (TYPESENSE_CONFIG !== undefined) {
      // TODO: check if this actually parses
      let configUrl = new URL(TYPESENSE_CONFIG)
      console.log("config for typesense: ", configUrl)
      let protocol = configUrl.protocol;
      if (protocol[protocol.length - 1] === ":") {
        protocol = protocol.slice(0, -1)
      }
      // TODO: port and api key credential
      tsc = new TypesenseApi(configUrl.hostname, "gatsbyserver", "8108", protocol)
    } else {
      console.log("using window information for typesense")
      let protocol = window.location.protocol;
      if (protocol[protocol.length - 1] === ":") {
        protocol = protocol.slice(0, -1)
      }
      tsc = new TypesenseApi(window.location.hostname, "gatsbyserver", "8108", protocol)
    }
    this.setState({tsc})
  }
  resetComponent = () => this.setState({isLoading: false, results: [], value: ''})

  handleResultSelect = (e, {result}) => {
    let {slug, nav_target, source} = result
    // originally tried to do a full slug#nav_target
    let navTo = `${pathPrefix}${navSlug(slug, nav_target)}`;
    console.log("nav to ", navTo);
    window.location = navTo;
  }

  handleSearchChange = (e, {value}) => {
    if (!this.state.tsc) {
      console.error("no typesense configuration setup")
      return
    }
    this.state.tsc
      .getSearchResults(value)
      .then(result => {
        this.setState({value, results: result})
      })
  }
  render() {
    const {isLoading, value, results} = this.state

    return (<Search
      loading={isLoading}
      onResultSelect={this.handleResultSelect}
      onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
      value={value}
      resultRenderer={resultRenderer}
      results={results}
      minCharacters={2}
      {...this.props}/>)
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <TypesenseSearch />
      </div>
    );
  }
}

export default App;
