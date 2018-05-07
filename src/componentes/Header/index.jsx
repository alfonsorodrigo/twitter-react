import React from 'react'
import styles from './headers.css'

function Header(){
	return(
		<header className={styles.root}>
			<h1 className={styles.logo}>Reactt</h1>
		</header>
	)
}

export default Header