import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash'
import { Search, Grid, Header, Label } from 'semantic-ui-react'
import TypesenseApi from './api'

let tsa = new TypesenseApi('localhost', "gatsbyserver", "8108", "http")

const resultRenderer = ({slug, nav_target}) => {
return <Label content={ slug } key={slug} />
}


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
        console.log(JSON.stringify(result, null, 2))
        this.setState({value, results: result})
      })
  }
  render() {
    const {isLoading, value, results} = this.state

    return (
      <Grid>
        <Grid.Column width={8}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
            value={value}
            results={results}
            resultRenderer={resultRenderer}
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
