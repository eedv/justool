import React from 'react';
import Tabla from './Tabla';
import AppBar from '@material-ui/core/AppBar';
import DrawerToolbar from './DrawerToolbar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';


import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from './Autocomplete';

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

const drawerConfig = [
  {name: 'min25Percent', type: 'textfield', label: 'Min 25%', defaultValue: 1600},
  {name: 'min30Percent', type: 'textfield', label: 'Min 30%', defaultValue: 2800},
  {name: 'minAnfitriona', type: 'textfield', label: 'Min anfitriona'}
]

class App extends React.Component {
  state = {
    mobileOpen: false,
    productList: [],
    order: [],
    min25Percent: 1600,
    min30Percent: 2800
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handlePercentChange = (name, value) => {
    let percent = {[name]: Number(value)}
    this.setState(percent);
  }

  handleProductSelect = (name) => {
    const product = this.state.productList.find((prod) => prod.name === name);
    const order = this.state.order.slice();
    order.push(product);
    this.setState({order})
  }

  handleCommitChanges = (order) => {

    this.setState({order})
  }

  componentDidMount() {
    fetch('https://japi.now.sh/products').then((res) => {
      return res.json()
    }).then((products) => {
      products = products.map((product, index) => {
        product.id = index;
        return product;
      })
      this.setState({productList: products});
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
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <DrawerToolbar ctrlConfig={drawerConfig} classes={classes} onInputChange={this.handlePercentChange}/>
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
              <DrawerToolbar ctrlConfig={drawerConfig} classes={classes} onInputChange={this.handlePercentChange}/>
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Autocomplete
            suggestions={this.state.productList}
            labelValue="name"
            onChange={this.handleProductSelect}
          ></Autocomplete>
          <Tabla
            rows={this.state.order}
            handleCommitChanges={this.handleCommitChanges}
            min25Percent={this.state.min25Percent}
            min30Percent={this.state.min30Percent}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);