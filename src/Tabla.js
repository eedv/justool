import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  EditingState,
  SummaryState,
  IntegratedSummary,
  DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
  Getter,
} from '@devexpress/dx-react-core';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSummaryRow,
  TableEditRow,
  TableEditColumn
} from '@devexpress/dx-react-grid-material-ui';


const getRowId = row => row.id;

const CurrencyTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={({ value }) => `$ ${value}`}
    {...props}
  />
);
const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: "center" }}>
    <Button color="primary" onClick={onExecute} title="Create new row">
      Agregar
    </Button>
  </div>
);
const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);
const EditComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};
const EditCommands = ({ id, onExecute }) => {
  const CommandButton = EditComponents[id];
  return <CommandButton onExecute={onExecute} />;
};
const messages = {
  profit: 'Ganancia',
  sum: 'Total'
};
export default class Tabla extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Nombre del producto', type: String },
        { name: 'price', title: 'Precio por unidad', type: Number  },
        { name: 'qty', title: 'Cantidad', type: Number, getCellValue: row => row.qty || 1 },
        { name: 'subtotal', title: 'Sub total', getCellValue: row => {
          return row.price && row.qty ? Number(row.price) * Number(row.qty) : 0
        }}
      ],
      currencyColumns: ['subtotal', 'price'],
      tableColumnExtensions: [
        { columnName: 'name', wordWrapEnabled: true },
      ],
      editingStateColumnExtensions: [
        { columnName: 'subtotal', editingEnabled: false },
      ],
      totalSummaryItems: [
        { columnName: 'name', type: 'count' },
        { columnName: 'subtotal', type: 'sum' },
        { columnName: 'subtotal', type: 'profit' },
      ],
    };

    this.commitChanges = this.commitChanges.bind(this);
    this.summaryCalculator = this.summaryCalculator.bind(this);
  }
 summaryCalculator(type, rows, getValue) {
    if (type === 'profit') {
      const {min25Percent, min30Percent} = this.props;
      let total = IntegratedSummary.defaultCalculator('sum', rows, getValue);
      let profitPercentage = total >= min30Percent ? 30 : (total >= min25Percent) ? 25 : 0;
      let ammountTo25 = Math.max(min25Percent - total, 0) ;
      let ammountTo30 = Math.max(min30Percent - total, 0);
      let profitMsg = ammountTo25 > 0
        ? `$ ${ammountTo25} para el 25% y $ ${ammountTo30} para el 30%`
        : ammountTo30 > 0
          ? `$ ${ammountTo30} para el 30%`
          : '';
      return `${total * profitPercentage / 100} ( ${profitPercentage}% ${profitMsg})`.trim();
    }
    return IntegratedSummary.defaultCalculator(type, rows, getValue);
  };
  commitChanges = ({ added, changed, deleted }) => {
    let { rows } = this.props
    let { handleCommitChanges } = this.props;
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    handleCommitChanges(rows)
  }

  render() {
    const {
      columns, totalSummaryItems, currencyColumns
     } = this.state;
    const {rows} = this.props
    return (
      <Paper>
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >

          <CurrencyTypeProvider
            for={currencyColumns}
          />
          <SummaryState
            totalItems={totalSummaryItems}
          />
          <IntegratedSummary
            calculator={this.summaryCalculator}
          />

          <Table columnExtensions={this.state.tableColumnExtensions}/>

          <TableHeaderRow />
          <TableSummaryRow
            messages={messages}
          />
          <EditingState
            onCommitChanges={this.commitChanges}
            columnExtensions={this.state.editingStateColumnExtensions}
          />
          <TableEditRow />
          <TableEditColumn
            commandComponent={EditCommands}
            showAddCommand
            showEditCommand
            showDeleteCommand
          />
          <Getter
            name="tableColumns"
            computed={({ tableColumns }) => {
              const result = [
                ...tableColumns.filter(c => c.type !== TableEditColumn.COLUMN_TYPE),
                { key: 'editCommand', type: TableEditColumn.COLUMN_TYPE, width: 140 }
              ];
              return result;
            }
          }
        />
        </Grid>
      </Paper>
    );
  }
}
