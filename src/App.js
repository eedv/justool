import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom"
import AppBar from '@material-ui/core/AppBar';
import DrawerToolbar from './DrawerToolbar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ProductList from './routes/ProductList'
import OrderEditor from './routes/OrderEditor';
import OrderList from './routes/OrderList';
import ConfigEditor from './routes/ConfigEditor';

const drawerWidth = 240;

const styles = theme => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '0 8px',
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	appBar: {
		marginLeft: drawerWidth,
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
		},
	},
	menuButton: {
		marginRight: 20,
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
	},
});

class App extends React.Component {
	state = {
		mobileOpen: false,
		period: {},
		order: []
	};

	handleDrawerToggle = () => {
		this.setState(state => ({ mobileOpen: !state.mobileOpen }));
	};

	render() {
		const { classes, theme, title} = this.props;

		return (
			<div className={classes.root}>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="Open drawer"
							onClick={this.handleDrawerToggle}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit" noWrap>
							{title}
						</Typography>
					</Toolbar>
				</AppBar>
				<nav className={classes.drawer}>
					{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
					<Hidden mdUp implementation="css">
						<Drawer
							container={this.props.container}
							variant="temporary"
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={this.state.mobileOpen}
							onClose={this.handleDrawerToggle}
							classes={{paper: classes.drawerPaper}}
						>
							<div className={classes.drawerHeader}>
								<IconButton onClick={this.handleDrawerToggle}>
									{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
								</IconButton>
							</div>

							<DrawerToolbar classes={classes}/>
						</Drawer>
					</Hidden>
					<Hidden smDown implementation="css">
						<Drawer
							classes={{
								paper: classes.drawerPaper,
							}}
							variant="permanent"
							open
						>
							<div className={classes.toolbar} />
							<DrawerToolbar classes={classes} />
						</Drawer>
					</Hidden>
				</nav>
				<main className={classes.content}>
					<div className={classes.toolbar} ></div>
					<Router>
						<div>
							<Route path="/pedidos/:orderId" exact component={OrderEditor}/>
							<Route path="/" exact render={() => <ProductList></ProductList>}/>
							<Route path="/config" exact component={ConfigEditor}/>
							<Route path="/pedidos" exact component={OrderList}/>
						</div>
					</Router>

				</main>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(App);
