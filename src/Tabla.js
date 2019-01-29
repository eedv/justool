import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { EditingState, SummaryState, IntegratedSummary, DataTypeProvider } from '@devexpress/dx-react-grid';
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
    formatterComponent={({ value }) => `$${value}`}
    {...props}
  />
);


const messages = {
  profit: 'Ganancia',
};
export default class Tabla extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Nombre del producto' },
        { name: 'pricePerUnit', title: 'Precio por unidad' },
        { name: 'qty', title: 'Cantidad' },
        { name: 'subtotal', title: 'Sub total', getCellValue: row => {
          return row.pricePerUnit && row.qty ? Number(row.pricePerUnit) * Number(row.qty) : '0'
        }}
      ],
      rows: [
        {id: 1, name: 'a', pricePerUnit: 300, qty: 2, subtotal: 600},
        {id: 2, name: 'a', pricePerUnit: 500, qty: 2, subtotal: 1000}
      ],
      currencyColumns: ['subtotal'],
      tableColumnExtensions: [
        { columnName: 'pricePerUnit', align: 'right' },
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
      const {min20Percent, min30Percent} = this.props;
      let total = IntegratedSummary.defaultCalculator('sum', rows, getValue);
      let profitPercentage = total >= min30Percent ? 30 : (total >= min20Percent) ? 20 : 0;
      return `${total * profitPercentage / 100} (${profitPercentage})`;
    }
    return IntegratedSummary.defaultCalculator(type, rows, getValue);
  };
  commitChanges({ added, changed, deleted }) {
    let { rows } = this.state;
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
    this.setState({ rows });
  }

  render() {
    const {
      rows, columns, totalSummaryItems, currencyColumns
     } = this.state;

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

          <Table/>

          <TableHeaderRow />
          <TableSummaryRow
            messages={messages}
          />
          <EditingState
            onCommitChanges={this.commitChanges}
          />
          <TableEditRow />
          <TableEditColumn
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
