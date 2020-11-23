import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Search from '../pages/search'
import Results from '../pages/results'

const Routes = () => (
    <Switch>
      <Route path="/" exact component={Search} />
      <Route path="/results" exact component={Results} />
    </Switch>
  )
  
export default Routes