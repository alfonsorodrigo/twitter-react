import React, {Component} from 'react'
import {HashRouter, Match} from 'react-router'
import 'normalize-css'
import styles from './app.css'
import Header from '../Header'
import Main from '../Main'
import Profile from '../Profile'
import Login from '../Login'
import firebase from 'firebase'

class App extends Component {

	constructor(){
		super()
		this.state = {
			user:null
		}
		this.handleOnAuth = this.handleOnAuth.bind(this)
		this.handleLogout = this.handleLogout.bind(this)
	}

	componentWillMount() {
		firebase.auth().onAuthStateChanged(user => {
			if(user){
				this.setState({user})
			}else{
				this.setState({user:null})
			}
		})
	}


	handleOnAuth(){
		const provider = new firebase.auth.GithubAuthProvider()
		firebase.auth().signInWithPopup(provider)
			.then(result => console.log(`${result.user.email} ha iniciado sesion`))
			.catch(error => console.error(`Error : ${error.code}: ${error.message} `))
	}

	handleLogout(){
		firebase.auth().signOut()
			.then(() => console.log('Te has desconectado correctamente'))
			.catch(() => console.log('Error'))
	}

	render(){
		return(
			<HashRouter>
				<div>
					<Header />
					<Match exactly pattern='/' render={() => {
						if(this.state.user){
							return (
								<Main 
									user={this.state.user}
									onLogout = {this.handleLogout}
								/>
							)
						}else{
							return(
								<Login 
									onAuth = {this.handleOnAuth}
								/>
							)
						}
					}} />

					<Match pattern='/profile' render={() => {
						return(
						<Profile 
							picture = {this.state.user.photoURL}
							username = {this.state.user.email.split('@')[0]}
							displayName = {this.state.user.displayName}
							location = {this.state.user.location}
							emailAddres = {this.state.user.email}

						/>)
					}} />

					<Match pattern='/user/:username' render={({params}) => {
						return(
							<Profile 
							displayName = {params.username}
							username = {params.username}

						/>
						)
					}} />
				</div>
			</HashRouter>
		)
	}
}
export default App