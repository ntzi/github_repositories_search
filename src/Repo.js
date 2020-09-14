import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

/**
* Display the results of the repository search bar as typing.
*/
class Repo extends Component {
  render() {
    return (
      <div>
          <Card bg='light' border="light" style={{ width: '100%' }}>
            <Card.Body>
              <Card.Title> {this.props.repo.name} </Card.Title>
              <Card.Text>
                {this.props.repo.description}
              </Card.Text>
              <Button variant="outline-secondary" onClick={event =>  window.open(this.props.repo.url, '_blank')}>View repository</Button>
            </Card.Body>
          </Card>
          <br />
      </div>
    )
  }
}

export default Repo
