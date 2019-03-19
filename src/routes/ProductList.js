import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  bigImg: {
    width: 120,
    height: 90
  }
});

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    }
  }

  filterProducts(filterTerm, productList) {
    if(filterTerm.length >= 3) {
      let products = productList.filter((p) => p.name.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1);
      this.setState({products});
    }
  }

  render() {
    const { classes, productList} = this.props;
    return (
      <div className={classes.root}>
        <TextField fullWidth label="Filtrar" onChange={(e) => this.filterProducts(e.target.value, productList)}></TextField>
        <Paper className={classes.gridList}>
        <List className={classes.root}>

          {this.state.products.map(product => (
            <ListItem key={product.code} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={product.image} className={classes.bigImg} />
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" className={classes.inline} color="textPrimary">
                    Precio: $ {product.price} {product.isDiscounted ? ' Oferta!': ''}
                    </Typography>
                    Presentacion:  {product.size}
                  </React.Fragment>
                }
              />
              <IconButton aria-label="Comments" href={product.shareURL} target="_blank">
                <InfoIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        </Paper>
      </div>
    );
  }

}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductList);