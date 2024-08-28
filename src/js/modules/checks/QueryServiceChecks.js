import { check, fail } from "k6";
import { STATUS_CODES, globalQueryLimit } from "../constants/Constants.js";
import { getGreaterThen, getKpiFilterEqual, getKpiSelect, getKpis, getRowCountOfTable, getRowsOfTable, getAggregationPeriodForRow, getAggregationPeriodByTableName, getFirstAggregationPeriodOfTable } from "../implementations/QueryServiceImpl.js";


export function checkTablesUnderGivenSchema(schema) {
    let res = getKpis(schema);
    console.log("Checking tables with Query Service: ", res.body);
    console.log("status: ", res.status);
    if(
      !check(res, {
        [`Status code is ${STATUS_CODES.OK}`]: (r) => r.status === STATUS_CODES.OK
      })
    ) fail ("Did not get KPIs back: " + res.status);
}

export function checkSelect(schema, kpiName, kpiColumn, expectedResult) {
  let res = getKpiSelect(schema, kpiName, kpiColumn);
  let data = JSON.parse(res.body).value;
  console.log("Query Service result with 'select': " + JSON.stringify(data));
  if(
    !check(res, {
      [`Status code is ${STATUS_CODES.OK}`]: (res) => res.status === STATUS_CODES.OK,
      [`KPIs are successfully selected`]: (res) => (JSON.parse(res.body).value).length === expectedResult
    })
  ) fail ("Did not get back selected filed of table: " + res.status);
}

export function checkFilterEqual(schema, kpiName, filter, kpiColumn, expectedResult) {
  let res = getKpiFilterEqual(schema, kpiName, filter, kpiColumn);
  console.log("Query Service result with 'filter': ", res.body);
  let length = (JSON.parse(res.body).value).length;
  console.log("element in the list after using 'select': ", length);
  if(
    !check(res, {
      [`Status code is ${STATUS_CODES.OK}`]: (res) => res.status === STATUS_CODES.OK,
      ['Number of element in the list is as expected']: (res) => (JSON.parse(res.body).value).length === expectedResult
    })
  ) fail ("Did not get data back filtered data: " + res.status);
}

export function checkDateLater(schema, kpiName, filter, kpiColumn, expectedResult){
  let res = getGreaterThen(schema, kpiName, filter, kpiColumn);
  console.log("Query Service result with checking 'greater than'", res.body);
  if(
    !check(res, {
      [`Status code is ${STATUS_CODES.OK}`]: (res) => res.status === STATUS_CODES.OK,
      ['Number of element in the list is as expected']: (res) => (JSON.parse(res.body).value).length === expectedResult
    })
  ) fail ("Did not get data back filtered data: " + res.status);
}

export function checkRowCountOfTable(table, expectedRowCount) {
    const tableRowCount = getRowCountOfTable(table);
    if (!check(tableRowCount, {
        ["Number of results for table are correct"]: (r) => r === expectedRowCount
    })) {
        fail(`Row count for '${table}' is unexpected! Expected: ${expectedRowCount}`);
    };
}

export function checkResultsForKPI(table, kpi, rowCount, checkerFunction, checkerArgs = []) {
    checkRowCountOfTable(table, rowCount);

    const tableRowCount = getRowCountOfTable(table);
    const tableAggPeriod = getAggregationPeriodByTableName(table);
    let firstAggBegin;
    if (tableAggPeriod && tableRowCount !== 0) {
        firstAggBegin = getFirstAggregationPeriodOfTable(table);
    }

    let allResultsAreCorrect = true;
    for (let i = 0; i < tableRowCount && allResultsAreCorrect; i += globalQueryLimit) {
        const tableRows = getRowsOfTable(table, i);
        for (let j = 0; j < tableRows.length && allResultsAreCorrect; j++) {
            let row = tableRows[j];
            row._result = row[kpi];
            if (tableAggPeriod) {
                row._aggPeriod = getAggregationPeriodForRow(tableAggPeriod, firstAggBegin, row["aggregation_begin_time"]);
            }

            const checkerResult = checkerFunction.apply(this, [row, ...checkerArgs]);
            if (!checkerResult) {
                allResultsAreCorrect = false;
                console.error(`Result for '${kpi}' is unexpected!`);
                console.error(`Got row: ${JSON.stringify(row)}`);
            }
        }
    }

    if (!check(allResultsAreCorrect, {
        ["KPI results are correct"]: (r) => r === true
    })) {
        fail("KPI results are unexpected!");
    }
}

export function checkerStatic(row, expectedResult) {
    return JSON.stringify(row._result) === JSON.stringify(expectedResult);
}

export function checkerDiffForAggPeriod(row, ...expectedResults) {
    return JSON.stringify(row._result) === JSON.stringify(expectedResults[Math.min(row._aggPeriod, expectedResults.length) - 1]);
}
