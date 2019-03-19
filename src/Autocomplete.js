import React from "react";
import Downshift from "downshift";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

class Autocomplete extends React.Component {

	renderInput(inputProps) {
		const { InputProps, classes, ref, ...other } = inputProps;

		return (
		  <TextField
			InputProps={{
			  inputRef: ref,
			  classes: {
				root: classes.inputRoot,
				input: classes.inputInput
			  },
			  ...InputProps
			}}
			{...other}
		  />
		);
	  }

	renderSuggestion({
		suggestion,
		index,
		itemProps,
		highlightedIndex,
		selectedItem
	  }) {
		const {labelValue, textTemplate} = this.props;
		const isHighlighted = highlightedIndex === index;
		const isSelected = (selectedItem || "").indexOf(suggestion[labelValue]) > -1;
		const suggestionText = (textTemplate
			? textTemplate.replace(/%{(.+?)}/gi, (match, group) => suggestion[group] || '')
			: suggestion[labelValue]).trim();
		return (
		  <MenuItem
			{...itemProps}
			key={`${suggestion[labelValue]}-${index}`}
			selected={isHighlighted}
			component="div"
			style={{
			  fontWeight: isSelected ? 500 : 400
			}}
		  >
			{suggestionText}
		  </MenuItem>
		);
	}

	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		const {suggestions, labelValue} = this.props;
		let count = 0;

		return inputLength <= 3
		  ? []
		  : suggestions.filter(suggestion => {
			  const keep =
				count < 10 &&
				suggestion[labelValue].toLowerCase().indexOf(inputValue) !== -1;

			  if (keep) {
				count += 1;
			  }

			  return keep;
			});
	  }

  render() {
	const {classes, labelValue, onChange} = this.props;
	return (
		<div className={classes.root} >
		  <Downshift id="downshift-simple" onSelect={onChange}>
			{({
			  getInputProps,
			  getItemProps,
			  getMenuProps,
			  highlightedIndex,
			  inputValue,
			  isOpen,
			  selectedItem,

			}) => (
			  <div className={classes.container}>
				{this.renderInput({
				  fullWidth: true,
				  classes,
				  InputProps: getInputProps({
					placeholder: "Buscar producto"
				  })
				})}
				<div {...getMenuProps()}>
				  {isOpen ? (
					<Paper className={classes.paper} square>
					  {this.getSuggestions(inputValue).map((suggestion, index) =>
						this.renderSuggestion({
						  suggestion,
						  index,
						  itemProps: getItemProps({ item: suggestion[labelValue] }),
						  highlightedIndex,
						  selectedItem
						})
					  )}
					</Paper>
				  ) : null}
				</div>
			  </div>
			)}
		  </Downshift>
		</div>
	  );
  }
}

export default withStyles(styles)(Autocomplete);
