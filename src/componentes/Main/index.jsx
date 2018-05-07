import React, {Component} from 'react'
import uuid from 'uuid'
import firebase from 'firebase'
import MessageList from '../MessageList'
import InputText from '../InputText'
import ProfileBar from '../ProfileBar'


class Main extends Component{
	
	constructor(props) {
		super(props)
		this.state = {
			user: Object.assign({},this.props.user,{retweets:[]},{favorites:[]}),
			openText:false,
			usernameToReply:'',
			messages:[]
		}

		this.handleSendText = this.handleSendText.bind(this)
		this.handleCloseText = this.handleCloseText.bind(this)
		this.handleOpenText = this.handleOpenText.bind(this)
		this.handleRetweet = this.handleRetweet.bind(this)
		this.handleFavorite = this.handleFavorite.bind(this)
		this.handleonReplyTweet = this.handleonReplyTweet.bind(this)
	}

	componentWillMount() {
		const messagesRef = firebase.database().ref().child('messages')
		messagesRef.on('child_added', snapshot => {
			this.setState({
				messages: this.state.messages.concat(snapshot.val()),
				openText: false
			})
		})
		messagesRef.on("child_changed", snapshot => {
			console.log(snapshot.val());
			this.setState({
				messages: this.state.messages.concat(snapshot.val()),
				openText: false
			})
		});
	}

	handleSendText(event){
		event.preventDefault()

		const messageRef = firebase.database().ref().child('messages')
		const messageID = messageRef.push()

		let newMessage = {
			id: uuid.v4(),
			username: this.props.user.email.split('@')[0],
			displayName: this.props.user.displayName,
			picture: this.props.user.photoURL,
			date: Date.now(),
			text: event.target.text.value,
			retweets:0,
			favorites:0,
			a :messageID.key
		}

		messageID.set(newMessage)
	}

	handleCloseText(event){
		event.preventDefault()
		this.setState({openText:false})
	}


	handleOpenText(event){
		event.preventDefault()
		this.setState({openText:true})
	}

	handleRetweet(msgId){
		let alreadyRetweeted = this.state.user.retweets.filter(fav => fav === msgId)
		if(alreadyRetweeted.length === 0){
			let messages = this.state.messages.map(msg =>{
				if(msg.id === msgId){
					msg.retweets++
				}
				return msg
			})

			let user = Object.assign({},this.state.user)
			user.retweets.push(msgId)

			this.setState({
				messages,
				user
			})
		}
	}

	handleFavorite(msgId){
		let alreadyFavorited = this.state.user.favorites.filter(fav => fav === msgId)
		if(alreadyFavorited.length === 0){
			let messages = this.state.messages.map(msg =>{
				if(msg.id === msgId){
					msg.favorites++
					let value = msg.favorites
					var database = firebase.database();
    				var referencia=database.ref("messages");
					referencia.child(msg.a).update({favorites: value})
				}
				return msg
			})

			let user = Object.assign({},this.state.user)
			user.favorites.push(msgId)

			this.setState({
				messages,
				user
			})
		}else{
			var database = firebase.database();
			var referencia=database.ref("messages");
			console.log("Se quita -1")
			let messages = this.state.messages.map(msg =>{
				if(msg.id === msgId){
					if(msg.favorites > 0){
						msg.favorites--
						referencia.child(msg.a).update({favorites: 0})
					}
					
				}
				return msg
			})
			this.setState({
				messages,
			})
			
		}
	}

	handleonReplyTweet(msgId,usernameToReply){
		this.setState({
			openText:true,
			usernameToReply
		})
	}

	renderOpenText(){
		if (this.state.openText){
			return (
				<InputText
					onSendText = {this.handleSendText}
					onCloseText = {this.handleCloseText}
					usernameToReply = {this.state.usernameToReply}
				/>
			)
		}
	}

	render(){
		return (
			<div>
				<ProfileBar 
					picture = {this.props.user.photoURL}
					username = {this.props.user.email.split('@')[0]}
					onOpenText = {this.handleOpenText}
					onLogout = {this.props.onLogout} 
				/>
				{this.renderOpenText()}
				<MessageList 
				messages = {this.state.messages}
				onRetweet = {this.handleRetweet}
				onFavorite = {this.handleFavorite}
				onReplyTweet = {this.handleonReplyTweet}
				/>
			</div>
			)
	}
}

export default Main