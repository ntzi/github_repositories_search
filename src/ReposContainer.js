import React, { Component } from 'react'
import Repo from './Repo'

class ReposContainer extends Component {
  render() {
    return this.props.repos.map((repo) => (
      <Repo key={repo.id} repo={repo} />
    ));
  }
}

export default ReposContainer
