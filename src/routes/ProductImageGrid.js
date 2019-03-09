import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    width: '70%',
    height: '100%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  }
});

class ProductImageGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    }
  }

  render() {
    const { classes, productList} = this.props;
    return (
      <div className={classes.root}>
        <TextField fullWidth label="Filtrar" onChange={(e) => this.setState({products: productList.filter((p) => p.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)})}></TextField>
        <Paper className={classes.gridList}>
        <GridList cellHeight={400}  cols={3}>
          {this.state.products.map(product => (
            <GridListTile key={product.code} cols={product.cols || 1}>
              <img src={product.image} alt={product.name} />
              <GridListTileBar
                title={product.name}
                subtitle={
                  <div>
                    <div>Precio: $ {product.price} {product.isDiscounted ? ' Oferta!': ''}</div>
                    <div>Presentacion:  {product.size}</div>
                  </div>
                }
                actionIcon={
                  <IconButton href={product.shareURL} target='_blank' className={classes.icon}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}

        </GridList>
        </Paper>
      </div>
    );
  }

}

ProductImageGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductImageGrid);