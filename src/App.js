import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { auth, createUserProfileDocument } from './firebase/firebase-util'

import './App.css'
import './fonts/fonts.css'
import HomePage from './pages/homepage/HomePage'
import ShopPage from './pages/shop/Shop'
import Header from './components/header/Header'
import SignInAndSignUp from './pages/sign-in-and-sign-up/SingInAndSingUp'
import Contact from './pages/contact/Contact'



class App extends React.Component {
  constructor() {
    super()

    this.state = {
      currentUser: null
    }
  }

  unsubscribeFromAuth = null

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth)

        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          })
        })
      } else {
        this.setState({ currentUser: userAuth })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth()
  }

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser}/>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route path='/signin' component={SignInAndSignUp} />
          <Route path='/contact' component={Contact} />
        </Switch>
      </div>
    );
  }
}

export default App;
