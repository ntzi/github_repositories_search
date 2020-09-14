import React from 'react';
import ReposContainer from './ReposContainer';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'

import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';



import './App.css';

class App extends React.Component {

  state = {
    repos: [],
    searchTerm: '',
    userSearch: '',
    user: []
  }


  /**
  * Call Github API v4.
  * @param {event} e
  */
  searchUser = (e) => {
    const access_token = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;
    e.preventDefault()

    const client = new ApolloClient({
      uri: 'https://api.github.com/graphql',
      headers: {
        'Authorization': `bearer ${access_token}`
      },
      cache: new InMemoryCache()
    });


    let query_repositories = {
      query: gql`
        query($username: String!) {
          user(login: $username){
            id
            name
            login
            avatarUrl
            repositories(last: 100 ) {
              nodes {
                id
                name
                description
                url
              }
            }
          }
        }
      `,
      variables: {
        "username": this.state.userSearch,
      }
    }


    client.query({query: query_repositories.query, variables: query_repositories.variables})
    .then(response => {
      client.query({query: query_repositories.query, variables: query_repositories.variables})
      .then(response => {
        this.setState({ user: response.data.user });
        this.setState({ repos: response.data.user.repositories.nodes });
        console.log(this.state.user.repositories)
      })
      .catch((error) => {
        if(error.message === "Could not resolve to a User with the login of '" + this.state.userSearch + "'."){
          this.setState({ user: {name: "Username: '" + this.state.userSearch + "' is not found."} });
        } else {
          this.setState({ user: {name: "Something gone wrong."} });
          console.log('Error', error.message);
        }
        this.setState({ repos: [] });
      });
    })
    .catch((error) => {
      if(error.message === "Could not resolve to a User with the login of '" + this.state.userSearch + "'."){
        this.setState({ user: {name: "Username: '" + this.state.userSearch + "' is not found."} });
      } else {
        this.setState({ user: {name: "Something gone wrong."} });
        console.log('Error', error.message);
      }
      this.setState({ repos: [] });
    });
  }

  handleChange = (e) => {
    this.setState({ userSearch: e.target.value});
  }

  editSearchTerm = (e) => {
    this.setState({searchTerm: e.target.value})
  }

  /**
  * Search stored repos given an input search.
  */
  dynamicSearch = () => {
    return this.state.repos.filter(repo => repo.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
  }

  render(){
    return (
        <div>
        <Navbar bg="dark" variant="dark" style={{ height: '75px'}}>
          <Navbar.Brand href="#home"></Navbar.Brand>
          <Nav className="mr-auto">
          </Nav>
        </Navbar>
        <Row>
          <Col style={{ height: 75}}>
          </Col>
        </Row>
        <Container fluid="sm">
          <Row>

            <Col sm={4}>
            <Row>
              <Card  style={{ width: '351px'}} border='white'>
                <Form inline onSubmit= {this.searchUser}>
                  <Col>
                  <FormControl type="text" name="name" placeholder="Search username"
                    onChange={this.handleChange} />
                  </Col>
                  <Col>
                  <Button variant="outline-secondary" type="submit">Search</Button>
                  </Col>
                </Form>
                <div style={{ height: 50}} />
                <Card.Img variant="top" src={this.state.user.avatarUrl}/>
                <Card.Body>
                  <Card.Title>{this.state.user.name}</Card.Title>
                  <Card.Text>
                    {this.state.user.login}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            </Col>

            <Col sm={8}>
              <Row>
                <Col style={{ height: 50}}>
                  <Form>
                    <FormControl type="text" id='repo_search_bar' value = {this.state.searchTerm} onChange = {this.editSearchTerm}
                      placeholder="Search repository" />
                  </Form>
                </Col>
              </Row>
              <div style={{ height: 40}} />
              <Row>
                <Col>
                  <ReposContainer repos = {this.dynamicSearch()} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        </div>
    );
  }
}

export default App;
