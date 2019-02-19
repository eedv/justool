import React from 'react';
import CustomTable from './CustomTable';
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

import LocalStorage from './LocalStorage';

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
      showDetails: false
    }
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleConfigChanges = (name, value) => {
    value = typeof value == 'string' ? Number(value) : value;
    let config = Object.assign({}, this.state.configs, {[name]:value})
    this.setState({configs: config});
  }

  handleTableChange = (actionType, rowData) => {
    const order = this.state.order.slice();
    if(actionType === 'add') {
      const product = this.state.productList.find((prod) => prod.name === rowData.name);
      product.qty = 1;
      order.push(product);
    }
    else if(actionType === 'edit') {
      Object.assign(order.find((row) => row._id === rowData._id), rowData);
    }
    else if(actionType === 'remove') {
      order.splice(order.findIndex((row) => row._id === rowData._id), 1);
    }
    this.setState({order});
    LocalStorage.set('default', order);
  }

  componentDidMount() {
    this.setState({order: LocalStorage.get('default')});
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
              classes={{paper: classes.drawerPaper}}
            >
              <DrawerToolbar configValues={this.state.configs} classes={classes} onInputChange={this.handleConfigChanges}/>
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
              <DrawerToolbar configValues={this.state.configs} classes={classes} onInputChange={this.handleConfigChanges}/>
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Autocomplete
            suggestions={this.state.productList}
            labelValue="name"
            onChange={(name) => this.handleTableChange('add', {name})}
          ></Autocomplete>
          <CustomTable
            rows={this.state.order}
            onTableChange={this.handleTableChange}
            min25Percent={this.state.configs.min25Percent}
            min30Percent={this.state.configs.min30Percent}
            anfCharges={this.state.configs.anfCharges}
            adminCharges={this.state.configs.adminCharges}
            showDetails={this.state.configs.showDetails}
            taxRate={6}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
