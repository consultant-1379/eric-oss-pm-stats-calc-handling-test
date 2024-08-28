export function collectAllKpiNames(kpiDefinition){
  const kpiJSON = JSON.parse(kpiDefinition);
  var kpiNames = [];
  getAllKpiNames(kpiJSON, kpiNames);
  return kpiNames;
}

function getAllKpiNames(kpiJSON, kpiNames){
  if (kpiJSON.scheduled_simple != undefined) {
    collectKpiNamesByKind(
      kpiJSON.scheduled_simple.kpi_output_tables,
      kpiNames
    );
  }
  if (kpiJSON.scheduled_complex != undefined) {
    collectKpiNamesByKind(
      kpiJSON.scheduled_complex.kpi_output_tables,
      kpiNames
    );
  }
  if (kpiJSON.on_demand != undefined) {
    collectKpiNamesByKind(
      kpiJSON.on_demand.kpi_output_tables,
      kpiNames
    );
  }
}

function collectKpiNamesByKind(kpiOutputTables, kpiNames) {
  kpiOutputTables.forEach((element) => {
    element.kpi_definitions.forEach((kpiDefinition) => {
      kpiNames.push(kpiDefinition.name)
    });
  });
}

export function collectAllTableNames(kpiDefinition) {
  const kpiJSON = JSON.parse(kpiDefinition);
  var tableNames = [];
  getAllTableNames(kpiJSON, tableNames);
  return tableNames;
}

function getAllTableNames(kpiJSON, tableNames) {
  if (kpiJSON.scheduled_simple != undefined) {
    collectOutputTableNamesByKind(
      kpiJSON.scheduled_simple.kpi_output_tables,
      tableNames
    );
  }
  if (kpiJSON.scheduled_complex != undefined) {
    collectOutputTableNamesByKind(
      kpiJSON.scheduled_complex.kpi_output_tables,
      tableNames
    );
  }
  if (kpiJSON.on_demand != undefined) {
    collectOutputTableNamesByKind(
      kpiJSON.on_demand.kpi_output_tables,
      tableNames
    );
  }
}

function collectOutputTableNamesByKind(kpiOutputTables, tableNames) {
  kpiOutputTables.forEach((element) => {
      if (element.aggregation_period != undefined && element.aggregation_period != -1) {
      tableNames.push(
        makeTableNameWithAggregationPeriod(
          element.alias,
          element.aggregation_period
        )
      );
    } else {
      tableNames.push(makeTableNameWithoutAggregationPeriod(element.alias));
    }
  });
}

function makeTableNameWithAggregationPeriod(alias, aggregationPeriod) {
  return "kpi_" + alias + "_" + aggregationPeriod;
}

function makeTableNameWithoutAggregationPeriod(alias) {
  return "kpi_" + alias;
}
