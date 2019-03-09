import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom"
import AppBar from '@material-ui/core/AppBar';
import DrawerToolbar from './DrawerToolbar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Utils from './Utils';
import ProductList from './routes/ProductList'
import OrderEditor from './routes/OrderEditor';
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
    productList: [],
    order: [],
    configs: {
      min25Percent: 1600,
      min30Percent: 2800,
      anfCharges: 0,
      adminCharges: 121,
      showDetails: false,
      taxRate: 6
    }
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  componentDidMount() {
    fetch(`https://justoolapi.herokuapp.com/products`).then((res) => {
      return res.json()
    }).then((period) => {
      this.setState({productList: period.products});
    })
  }

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
              <DrawerToolbar configValues={this.state.configs} classes={classes}/>
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
              <DrawerToolbar configValues={this.state.configs} classes={classes} />
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} ></div>
          <Router>
            <div>
                <Route path="/pedido" exact render={() => <OrderEditor productList={this.state.productList} {...this.state.configs}/>}/>
                <Route path="/" exact render={() => <ProductList productList={this.state.productList}></ProductList>}/>
                <Route path="/config" exact render={() => <ConfigEditor ></ConfigEditor>}/>
            </div>
          </Router>

        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
