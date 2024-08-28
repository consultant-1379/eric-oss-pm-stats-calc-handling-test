import { SCHEMAS } from "../../tests/modules/constants/Constants.js";
import * as querySetFunctions from "./QuerySetFunctions.js";


export function issueAllRequestsFunctional() {
    querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_");
    querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_fdn_complex_expr_60");
    querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_3_1440");

    querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "aggregation_begin_time", "23:00:00");
    querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "aggregation_begin_time", "23:00:00");
    querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, "kpi_fdn_simple_expr_60", "aggregation_begin_time", "21:00:00");
    querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", "aggregation_begin_time", "22:00:00");
    querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "aggregation_begin_time", "22:00:00");

    querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "aggregation_begin_time", "23:45:00");
    querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "aggregation_begin_time", "23:30:00");
    querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", "aggregation_begin_time", "23:00:00");
    querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, "kpi_fdn_complex_expr_60", "aggregation_begin_time", "23:00:00");

    querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "aggregation_begin_time", "23:30:00", "nodeFDN", "ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00104", "mo_sum_15_simple");
    querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "aggregation_begin_time", "23:30:00", "moFdn", "ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject1=1", "max_15_complex");
    querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_2_60", "aggregation_begin_time", "23:00:00", "ossid", "ENM_Athlone_1", "sum_dlb_complex_1");
    querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "aggregation_begin_time", "23:00:00", "moFdn", "ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject1=1", "complex_array");

    querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "aggregation_begin_time", "23:00:00", "float_post_aggregation_1", "asc", 1250);
    querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_fdn_complex_expr_60", "aggregation_begin_time", "23:00:00", "complex_expression", "desc", 10);
    querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_4_1440", "aggregation_begin_time", "00:00:00", "simple_for_tabular", "desc", 20);

    querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "pm_counters_sum_15_simple", 9000);
    querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_2_60", "sum_dlb_complex_1", 7000000);
    querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "complex_divider", 300);
    querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", "mo_count_1440_simple", 6);

    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", 3);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", 100);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", 550);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", 250);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", 500);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", 3);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", 10);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", 55);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", 10);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", 25);
    querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", 50);

    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", 3);
    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", 100);
    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", 55);
    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_fdn_simple_expr_60", 10);
    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_fdn_simple_expr_60", 25);
    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_fdn_simple_expr_60", 50);
    querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_3_1440", 100);

    querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "moFdn", "ManagedObject1=1");
    querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "moFdn", "ManagedElement=MoFDNManagedElement1,Equipment=1,SupportUnit=1,ManagedObject1=1");
    querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "nodeFDN", "SupportUnit=1,MeContext=Node00826");
    querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_2_innerjoin_60", "nodeFDN", "ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node00165");
    querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_fdn_complex_aggr_element_60", "fdn_parse_co", "MeContext=Node00087");

    querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "moFdn", "Equipment=1", "nodeFDN", "asc");
    querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", "nodeFDN", "MeContext=Node003", "aggregation_begin_time", "desc");
    querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_3_1440", "moFdn", "Equipment=1,SupportUnit=1,ManagedObject2=1", "sum_1440_complex", "asc");

    querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "moFdn", "ManagedObject1=1", "pm_counters_sum_15_simple", 10000, "mo_sum_15_simple");
    querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "nodeFDN", "MeContext=Node00218", "float_post_aggregation_1", 24000000, "max_15_complex");
    querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "nodeFDN", "Node00495", "float_inmemory", 9, "complex_array");
    querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", "nodeFDN", "ManagedElement=NodeFDNManagedElement1,Equipment=1,SupportUnit=1,MeContext=Node01114", "mo_count_1440_simple", 6, "mo_max_1440_simple");
    querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_3_1440", "moFdn", "Equipment=1", "sum_1440_complex", 200, "sum_1440_complex");

    querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "nodeFDN", "asc", "max_15_complex", 4000);
    querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", "aggregation_end_time", "asc", "simple_first_element", 200);
    querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_2_innerjoin_60", "aggregation_begin_time", "desc", "inner_join_60_complex_1", 4000);
    querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "complex_divider", "asc", "float_inmemory", 10);
    querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_4_1440", "nodeFDN", "desc", "simple_for_tabular", 6000);

    querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "aggregation_begin_time", "asc", "max_15_complex", 3000, "sum_15_complex ", 9000);
    querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_dll_15", "aggregation_begin_time", "desc", "mo_sum_15_simple_dll", 8000000, "mo_sum_15_simple_dll_2", 9000000);
    querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_array_60", "simple_first_element", "asc", "aggregation_begin_time", "23:00:00Z", "simple_first_element", 101);
    querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "complex_divider", "desc", "aggregation_begin_time", "23:00:00Z", "float_inmemory", 10);
    querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", "aggregation_begin_time", "asc", "mo_max_1440_simple", 1000, "mo_count_1440_simple", 6);

    querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_15", "pm_counters_sum_15_simple", 9000, "mo_sum_15_simple", 3000, 5, 3);
    querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_1_15", "max_15_complex", 5000, "sum_15_complex", 8000, 5000, 2);
    querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_complex_4_60", "complex_divider", 500, "float_inmemory", 9, 50, 100);
    querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440", "mo_max_1440_simple", 2000, "mo_count_1440_simple", 5, 100, 20);
}
