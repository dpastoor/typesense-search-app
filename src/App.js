import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash'
import { Search, Grid, Header, Label } from 'semantic-ui-react'
import TypesenseApi from './api'

let tsa = new TypesenseApi('localhost', "gatsbyserver", "8108", "http")

const categoryReducer = (results) => results.reduce((acc, value) => {
  if (Object.hasOwnProperty(acc, value.slug)) {
      let results = acc[value.slug];
      results = results.concat(value.snippets.map((s) => {
          return {snippet: s, branch: value.branch, nav_target: value.nav_target, slug: value.slug}
      }))
      acc[value.slug] = results;
      return acc
  }
  acc[value.slug] = {
      results: value
      .snippets
      .map((s) => {
          return {snippet: s, branch: value.branch, nav_target: value.nav_target, slug: value.slug}
      }),
      name: value.slug
  }
  return acc
}, {})

const resultRenderer = ({slug, nav_target, snippet}) => {
return <div dangerouslySetInnerHTML={{__html: snippet}} /> 
}
const categoryRenderer = ({ name }) => <Label as={'span'} content={name.split("/")[1]} />


class SearchExampleCategory extends Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({isLoading: false, results: [], value: ''})

  handleResultSelect = (e, {result}) => console.log("selected ", result)

  handleSearchChange = (e, {value}) => {
    tsa
      .getSearchResults(value)
      .then(result => {
        console.log(JSON.stringify(categoryReducer(result), null, 2))
        this.setState({value, results: categoryReducer(result)})
      })
  }
  render() {
    const {isLoading, value, results} = this.state

    return (
      <Grid>
        <Grid.Column width={8}>
          <Search
          category
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
            value={value}
            results={results}
            resultRenderer={resultRenderer}
            categoryRenderer={categoryRenderer}
            minCharacters={1}
            {...this.props}/>
        </Grid.Column>
        <Grid.Column width={8}>
          <Header>State</Header>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </Grid.Column>
      </Grid>
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
