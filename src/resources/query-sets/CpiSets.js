import { SCHEMAS } from "../../tests/modules/constants/Constants.js";
import * as querySetFunctions from "./QuerySetFunctions.js";


export function issueAllRequestsCPI(randomized = false) {
    const requests = [
        //() => querySetFunctions.getKpiCountWithTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60");
        //() => querySetFunctions.getKpiCountWithTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_60"),

        //() => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60"),
        //() => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_60"),

        // () => querySetFunctions.getTimeLargerWithTop(SCHEMAS.KPI_SCHEMA, 'kpi_cell_60', "aggregation_begin_time", "22:00:00"),
        // () => querySetFunctions.getTimeLargerWithTop(SCHEMAS.KPI_SCHEMA, 'kpi_cell_60', "aggregation_begin_time", "23:00:00"),
        // () => querySetFunctions.getTimeLargerWithTop(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_60', "aggregation_begin_time", "22:00:00"),
        // () => querySetFunctions.getTimeLargerWithTop(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_60', "aggregation_begin_time", "23:00:00"),

        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_15', "aggregation_begin_time", "21:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_15', "aggregation_begin_time", "22:30:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_60', "aggregation_begin_time", "21:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_60', "aggregation_begin_time", "22:30:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_60', "aggregation_begin_time", "21:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_60', "aggregation_begin_time", "22:30:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_15', "aggregation_begin_time", "21:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_15', "aggregation_begin_time", "22:30:00"),

        //() => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_60', "aggregation_begin_time", "22:30:00"),
        //() => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_60', "aggregation_begin_time", "23:30:00"),
        //() => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_60', "aggregation_begin_time", "22:30:00"),
        //() => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_complex_60', "aggregation_begin_time", "23:30:00"),

        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "aggregation_begin_time", "23:30:00", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell1", "final_rob_rand_acc_succ_rate"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "23:00:00", "nodeFDN", "Equipment=1,SubNetwork=DataGenerator1,MeContext=Node0082", "final_e_rab_retainability_percentage_lost_hourly"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "23:30:00", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell1", "final_avg_ul_mac_cell_throughtput_hourly"),

        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "23:00:00", "final_cell_availability_hourly", "desc", 10),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "23:00:00", "final_avg_dl_mac_cell_throughtput_hourly", "asc", 1250),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_1440", "aggregation_begin_time", "00:00:00", "avg_dl_mac_cell_throughtput_daily_FDD", "desc", 20),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "aggregation_begin_time", "23:00:00", "final_added_erab_estab_succ_rate", "desc", 10),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "aggregation_begin_time", "23:00:00", "final_rob_rand_acc_succ_rate", "asc", 1250),

        //() => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_e_rab_retainability_percentage_lost_hourly", 68),
        //() => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_avg_ul_mac_cell_throughtput_hourly ", 1001),
        //() => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_avg_dl_mac_cell_throughtput_hourly", 40),
        //() => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_cell_availability_hourly", 750),

        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", 3),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", 100),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", 550),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_60", 10),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_60", 250),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_60", 500),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", 3),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", 10),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", 55),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_15", 10),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_15", 25),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_15", 50),

        //() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "3"),
        //() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "100"),
        //() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "55"),
        //() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_60", "10"),
        //() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_60", "25"),
        //() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_60", "50"),

        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "moFdn", 'ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellTDD=Cell3'),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "moFdn", 'ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell2'),
        () => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "nodeFDN", 'Equipment=1,SubNetwork=DataGenerator1,MeContext=Node0082'),
        () => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "nodeFDN", "Equipment=1,SubNetwork=DataGenerator1,MeContext=Node0160"),
        //() => querySetFunctions.getContains(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "nodeFDN", 'Equipment=1,SubNetwork=DataGenerator1,MeContext=Node00820'),

        //() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "asc", "final_e_rab_retainability_percentage_lost_hourly", 88, "final_avg_ul_mac_cell_throughtput_hourly ", 1001),
        //() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_init_erab_estab_succ_rate_hourly", "desc", "aggregation_begin_time", "22:30:00Z", "final_init_erab_estab_succ_rate_hourly", 11),
        //() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "desc", "final_avg_dl_mac_cell_throughtput_hourly", 5400, "final_avg_ul_mac_cell_throughtput_hourly", 30000),
        //() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_cell_availability_hourly", "desc", "final_cell_availability_hourly", 4000, "final_e_rab_retainability_percentage_lost_hourly", 6000),
        //() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "aggregation_begin_time", "asc", "final_e_rab_retainability_percentage_lost_hourly", 98, "final_init_erab_estab_succ_rate_hourly", 25),

        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_e_rab_retainability_percentage_lost_hourly", 5000, "final_avg_ul_mac_cell_throughtput_hourly", 2, "10000", "2"),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_init_erab_estab_succ_rate_hourly", 10000, "final_avg_dl_mac_cell_throughtput_hourly", 0.1, "100", "20"),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_cell_availability_hourly", 9800, "final_avg_ul_mac_cell_throughtput_hourly", 0.3, 2, 0),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_init_erab_estab_succ_rate_hourly", 32, "final_e_rab_retainability_percentage_lost_hourly", 15, 2, "24"),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "final_cell_availability_hourly", 2400, "final_avg_ul_mac_cell_throughtput_hourly", 6, 40, "230"),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_1440", "avg_dl_mac_cell_throughtput_daily_TDD", 0.3, "final_avg_dl_mac_cell_throughtput_daily", 0.1, 5, 1),
        () => querySetFunctions.getLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "added_erab_estab_succ_rate_TDD", 0.3, "final_added_erab_estab_succ_rate", 0.1, 5, 1),


        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "nodeFDN", "Equipment=1,SubNetwork=DataGenerator1,MeContext=Node0006770", "final_e_rab_retainability_percentage_lost_hourly", 1100, "final_cell_availability_hourly"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "nodeFDN", "Node00067", "final_avg_ul_mac_cell_throughtput_hourly", 10000, "final_avg_ul_mac_cell_throughtput_hourly,moFdn"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellTDD=Cell3", "final_avg_dl_mac_cell_throughtput_hourly", 16, "nodeFDN"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "moFdn", "Cell3", "avg_dl_mac_cell_throughtput_hourly_TDD", 64, "final_avg_ul_mac_cell_throughtput_hourly,final_init_erab_estab_succ_rate_hourly"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "nodeFDN", "SubNetwork=DataGenerator2", "final_init_erab_estab_succ_rate_hourly", 10, "moFdn"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_60", "moFdn", "Function=", "final_cell_availability_hourly", 48, "nodeFDN"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellTDD=Cell3", "final_average_ul_pdcp_ue_throughput", 16, "nodeFDN"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_complex_15", "nodeFDN", "SubNetwork=DataGenerator2", "final_intra_frequency_cell_mobility_succ_rate", 10, "moFdn"),
    ];

    const queryList = randomized ? querySetFunctions.randomizeQueries(requests) : requests;
    for (let i = 0; i < queryList.length; i++) {
        queryList[i]();
    }
}
