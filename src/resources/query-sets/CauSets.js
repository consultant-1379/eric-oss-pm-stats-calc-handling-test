import { SCHEMAS } from "../../tests/modules/constants/Constants.js";
import * as querySetFunctions from "./QuerySetFunctions.js";


export function issueAllRequestsCAU(randomized = false) {
    const requests = [
        /*() => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440"),
        () => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60"),
        () => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_1_filter_15"),
        () => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_dll_60"),
        () => querySetFunctions.getKpiCount(SCHEMAS.KPI_SCHEMA, "kpi_mo_simple_3_1440"),*/

        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "21:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "22:30:00"),
        //() => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "20:30:00"),
        //() => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "02:00:00"),

        /*() => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "23:30:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "03:00:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "05:00:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_60', "aggregation_begin_time", "12:00:00"),*/

        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "20:00:00", "nodeFDN", "MeContext=Node10945", "connected_users"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "22:00:00", "moFdn", "EUtranCellFDD=Cell2,EUtranCellTDD=Cell4", "pmpdcchcceutil_1_19_distribution_product"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "00:00:00", "nodeFDN", "Node02577", "pm_erab_rel_mme"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "00:00:00", "moFdn", "ENodeBFunction=1,EUtranCellFDD=Cell2", "pm_erab_rel_abnormal_enb_act"),

        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "21:00:00", "connected_users", "desc", 10),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "22:00:00", "volteprbsdl_numerator_transmissions", "asc", 12),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "00:00:00", "pm_erab_rel_normal_enb_qci1", "desc", 1),
        () => querySetFunctions.getTimeEqualsWithOrderByAndTopAndCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "00:00:00", "pm_erab_rel_abnormal_mme_act_qci1", "asc", 125),

        /*() => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pm_flex_rrc_conn_sum", 3),
        () => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_rel_mme_qci1", 5),
        () => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pm_idle_mode_rel_distr_high_load", 4),
        () => querySetFunctions.getLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_rel_normal_enb", 100),*/

        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", 3),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", 100),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", 550),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", 10),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", 250),
        () => querySetFunctions.getTop(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", 500),

        /*() => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", 3),
        () => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", 100),
        () => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", 550),
        () => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", 10),
        () => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", 250),
        () => querySetFunctions.getSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", 500),*/

        () => querySetFunctions.getContainsSelectAndLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "SubNetwork=DataGenerator1,MeContext=Node00025", "pm_erab_rel_mme", 300, "pm_rrc_conn_estab_succ"),
        () => querySetFunctions.getContainsSelectAndLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "EUtranCellFDD=Cell2", "ul_pusch_sinr_hourly_numerator", 100000, "aggregation_end_time"),
        () => querySetFunctions.getContainsSelectAndLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", "MeContext=Node01625", "pm_rrc_conn_samp", 10, "sub_ratio_numerator"),
        () => querySetFunctions.getContainsSelectAndLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "02525", "pm_erab_estab_succ_init_qci1", 976, "pm_erab_rel_mme"),

        //() => querySetFunctions.getSelectWithFilter(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "connected_users", "volteprbsdl_numerator_qci", 16),
        //() => querySetFunctions.getSelectWithFilter(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pmpdcchcceutil_0_norm", "mac_level_data_vol_dl_rate", 0),
        //() => querySetFunctions.getSelectWithFilter(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_cell_downtime_auto_daily", "pm_erab_rel_mme_qci1", 2),

        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", 'EUtranCellFDD=Cell4'),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", 'EUtranCellFDD=Cell2'),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", 'SubNetwork=DataGenerator1,MeContext=Node00001'),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "Equipment=1"),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "EUtranCellFDD=Cell3"),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "SubNetwork=DataGenerator1,MeContext=Node00100"),

        /*() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", 'ManagedElement=NodeRadio1'),
        () => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", 'DataGenerator1'),
        () => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", 'ENodeBFunction=1'),
        () => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "DataGenerator1"),
        () => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "93"),*/

        /*() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "asc", "dl_pdcp_ue_throughput_den_cell", 125, "sub_ratio_numerator", 4),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "asc", "cell_exe_att_hourly", 4, "pm_idle_mode_rel_distr_medium_load", 10),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "desc", "ul_pusch_sinr_hourly_denominator", 4500, "e_rab_retainability_percentage_lost_qci1_num", 10),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "desc", "pm_cell_downtime_auto_daily", 145, "pm_erab_rel_normal_enb", 76),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "desc", "pm_erab_estab_succ_init_qci1", 98, "pm_erab_rel_mme", 150),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "desc", "pm_erab_estab_succ_init_qci1", 301, "pm_erab_estab_att_init_qci1", 1000),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "asc", "connected_users", 200, "pm_idle_mode_rel_distr_low_load", 100),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "connected_users", "desc", "pm_idle_mode_rel_distr_medium_load", 1000, "pm_idle_mode_rel_distr_medium_high_load", 1000),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "desc", "pm_rrc_conn_estab_fail_mme_ovl_mod", 2000, "pm_rrc_conn_estab_fail_mme_ovl_mos", 6000),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_rrc_conn_estab_att_reatt", "desc", "pm_s1_sig_conn_estab_succ", 100, "pm_rrc_conn_estab_succ", 60),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "aggregation_begin_time", "asc", "pm_erab_rel_normal_enb", 98, "pm_erab_rel_abnormal_enb_act", 25),*/

        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "sub_ratio_numerator", 1500, "e_rab_retainability_percentage_lost_qci1_den", 9, 10, 2),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pm_flex_rrc_conn_sum", 60, "connected_users", 2, 10, 10),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pm_rrc_conn_samp", 10, "sub_ratio_numerator", 1, 2, 5),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_estab_succ_init_qci1", 300, "pm_rrc_conn_estab_succ", 20, 2, 4),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_rel_mme_qci1", 6500, "pm_erab_rel_abnormal_mme_act", 20, 40, 20),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_rel_mme_qci1", 481, "pm_erab_rel_abnormal_mme_act", 4, 27, 378),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "sum_active_ues_in_dl", 1500, "num_active_ue_dl_sum_qci", 2, 10, 2),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "prb_pairs_available", 100, "volteprbsdl_numerator_qci", 45, 10, 1),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pmpdcchcceactivity_sum_den", 5000, "mac_level_data_vol_dl_rate", 0, 2, 5),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_rel_abnormal_enb", 32, "pm_erab_rel_mme", 15, 2, 4),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_cell_downtime_auto_daily", 156, "pm_cell_downtime_man_daily", 6, 40, 20),

        /*() => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "EUtranCellFDD=Cell1", "num_non_null_counters_count_pmactiveuedlsum", 1, 2),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", "DataGenerator1,MeContext=Node00089", "num_non_null_counters_count_pmactiveuedlsum", 1, 100),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell2", "num_non_null_counters_count_pmradiothpvoldl", 0, 59),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell4", "pm_rrc_conn_estab_succ", 3, 40),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell3", "e_rab_retainability_percentage_lost_qci1_den", 4, 2),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", "DataGenerator1,MeContext=Node02023", "rrc_conn_estab_succ_hourly", -5, 1),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "ManagedElement=NodeRadio1", "erab_estab_succ_qci1_hourly", 1, 5),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell3", "pm_erab_rel_mme_qci1", 10, 4),
        () => querySetFunctions.getCountWithContainsAndGreaterAndSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "09999", "pm_erab_rel_abnormal_mme_act_qci1", 1, 5),*/

        /*() => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "s1_sig_conn_estab_succ", "desc", "pm_erab_estab_succ_init_qci1", 92),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "s1_sig_conn_estab_succ", "asc", "rrc_conn_estab_att_reatt", 128),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "cell_exe_succ", "desc", "rrc_conn_estab_att_reatt", 500),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_estab_att_init_qci1", "asc", "pm_erab_estab_succ_init_qci1", 328),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "sub_ratio_denom", "asc", "sub_ratio_numerator", 10),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "sub_ratio_denom", "desc", "pm_flex_rrc_conn_sum", 125),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "pm_rrc_conn_samp", "desc", "sub_ratio_denom", 20000),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "connected_users", "desc", "num_active_ue_dl_sum_qci", 12000),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "connected_users", "asc", "pm_flex_rrc_conn_sum_spid", 50),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "aggregation_begin_time", "asc", "rrc_conn_estab_att_int_hourly", 14),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "num_calls_cell_hourly", "asc", "ul_pusch_sinr_hourly_denominator", 12500),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_s1_sig_conn_estab_att", "desc", "pm_s1_sig_conn_estab_fail_mme_ovl_mos", 100),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_estab_succ_added", "desc", "num_calls_daily", 1500),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "pm_erab_estab_att_init", "asc", "pm_erab_estab_att_added", 254),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "rrc_conn_estab_succ", "desc", "pm_erab_estab_att_added_ho_ongoing", 65),*/

        //() => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell3", "volteprbsdl_numerator_qci", "desc"),
        () => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", "DataGenerator1,MeContext=Node02000", "prb_pairs_available", "asc"),
        //() => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell4", "pm_erab_rel_abnormal_mme_act", "desc"),
        () => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "DataGenerator1,MeContext=Node02081", "pm_cell_downtime_auto_daily", "asc"),

        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", "DataGenerator1,MeContext=Node00007", "volteprbsdl_numerator_qci", 1100, "connected_users"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "nodeFDN", "ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell3", "dl_pdcp_ue_throughput_den_cell", 125, "sub_ratio_numerator,moFdn"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_60", "moFdn", "ENodeBFunction=1", "prb_pairs_available", 16, "num_calls_cell_hourly"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "ENodeBFunction=1", "pm_s1_sig_conn_estab_fail_mme_ovl_mos", 64, "pm_erab_estab_att_init"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "nodeFDN", "DataGenerator1,MeContext=Node01989", "num_calls_daily", 1000, "rrc_conn_estab_succ,moFdn"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_1440", "moFdn", "EUtranCellFDD=Cell2", "pm_erab_rel_mme_qci1", 4, "nodeFDN,pm_cell_downtime_auto_daily"),

        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_sector_60', "aggregation_begin_time", "21:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_flm_60', "aggregation_begin_time", "21:30:00"),
        /*() => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_sector_60', "aggregation_begin_time", "22:30:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_flm_60', "aggregation_begin_time", "22:30:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_freqband_bandwidth_r_flm_1440', "aggregation_begin_time", "00:00:00"),
        () => querySetFunctions.getTimeLarger(SCHEMAS.KPI_SCHEMA, 'kpi_cell_sector_flm_60', "aggregation_begin_time", "01:30:00"),

        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_flm_60', "aggregation_begin_time", "01:30:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_sector_60', "aggregation_begin_time", "03:00:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_sector_60', "aggregation_begin_time", "05:00:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_guid_flm_60', "aggregation_begin_time", "12:00:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_freqband_bandwidth_r_flm_1440', "aggregation_end_time", "01:30:00"),
        () => querySetFunctions.getTimeLess(SCHEMAS.KPI_SCHEMA, 'kpi_cell_kpi_cell_sector_flm_60sector_60', "aggregation_end_time", "03:00:00"),*/

        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "aggregation_begin_time", "00:00:00", "nodeFDN", "MeContext=Node00700", "min_num_samp_trans_calc"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "aggregation_begin_time", "21:00:00", "moFdn", "EUtranCellFDD=Cell2", "min_rops_for_app_cov_reliability"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "aggregation_begin_time", "20:00:00", "nodeFDN", "MeContext=Node00014", "pm_ue_throughput_time_dl"),
        //() => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "aggregation_begin_time", "00:00:00", "source_cell_cgi_daily", "MeContext=Node00014", "out_succ_ho_interf"),

        /*() => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_freqband_bandwidth_r_flm_1440", "aggregation_begin_time", "00:00:00", "execution_id", "execution_id_1", "bandwidth"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "aggregation_begin_time", "12:00:00", "moFdn", "EUtranCellFDD=Cell2", "avg_dl_pdcp_throughput_sector_interim_degradation"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "aggregation_begin_time", "12:00:00", "moFdn", "EUtranCellFDD=Cell2", "avg_ul_pdcp_throughput_sector_interim_degradation"),
        () => querySetFunctions.getTimeLargerAndContainsAndSelect(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_1440", "aggregation_end_time", "12:00:00", "nodeFDN", "MeContext=Node00700", "coverage_balance_distance_bin"),*/

        /*() => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "sigma_for_transient", "desc", "min_num_samp_trans_calc", 10, "sigma_for_transient", 5),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "aggregation_begin_time", "desc", "out_succ_ho_interf", 150, "out_succ_ho_intraf", 130),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "aggregation_begin_time", "desc", "target_throughput_r", 100, "min_num_cqi_samples", 5),
        () => querySetFunctions.getOrderBywithLessEqualsLessThan(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "pm_ue_throughput_time_ul", "asc", "pm_ue_throughput_vol_ul", 20, "pm_ue_throughput_vol_minus_lasttti_dl", 150),*/

        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "sigma_for_transient", 5, "min_num_samp_trans_calc", 0, 10, 1),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "out_succ_ho_interf", 90, "out_succ_ho_intraf", 90, 2, 5),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "target_throughput_r", 32, "min_num_cqi_samples", 1, 2, 4),
        () => querySetFunctions.getCountWithLessThanGreaterEqualsAndTopSkip(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "pm_ue_throughput_time_ul", 60, "pm_ue_throughput_vol_ul", 11, 40, 20),

        /*() => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "aggregation_begin_time", "desc", "min_num_samp_trans_calc", 10),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "out_succ_ho_intraf", "desc", "out_succ_ho_interf", 127),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "aggregation_begin_time", "asc", "min_num_cqi_samples", 5),
        () => querySetFunctions.getOrderedLessthanWhithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "pm_ue_throughput_time_dl", "desc", "pm_ue_throughput_time_ul", 14),*/

        //() => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "moFdn", "EUtranCellFDD=Cell2", "sigma_for_transient", "desc"),
        //() => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "nodeFDN", "Node00710", "out_succ_ho_intraf", "asc"),
        //() => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "moFdn", "Cell2", "min_rops_for_app_cov_reliability", "desc"),
        //() => querySetFunctions.getContainsWithOrderBy(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "nodeFDN", "=Node00125", "pm_ue_throughput_time_ul", "asc"),

        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "moFdn", "EUtranCellFDD=Cell2", "sigma_for_transient", 1, "nodeFDN"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "moFdn", "2", "out_succ_ho_interf", 128, "out_succ_ho_intraf"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "nodeFDN", "MeContext=Node00700", "min_rops_for_app_cov_reliability", 10, "min_num_cqi_samples"),
        //() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "moFdn", "=Cell3", "pm_ue_throughput_vol_ul", 120, "pm_ue_throughput_vol_minus_lasttti_dl,pm_ue_throughput_time_ul"),*/

        /*() => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_freqband_bandwidth_r_flm_1440", "execution_id", "execution_id_1", "freq_band", 1, "target_throughput_r"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_flm_60", "moFdn", "2", "avg_dl_pdcp_throughput_sector_interim_degradation", 128, "avg_ul_pdcp_throughput_sector_interim_degradation"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_1440", "nodeFDN", "Node00016", "coverage_balance_distance_bin", 20, "coverage_balance_distance"),
        () => querySetFunctions.getContainsSelectOrLessEqual(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_1440", "moFdn", "EUtranCellFDD=Cell2", "coverage_balance_signal_index", 16.9, "moFdn"),*/

        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_1440", "nodeFDN", 'Node00016'),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_relation_guid_source_guid_target_guid_1440", "nodeFDN", "Node00100"),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_guid_flm_60", "moFdn", "EUtranCellFDD=Cell2"),
        //() => querySetFunctions.getContainsWithCount(SCHEMAS.KPI_SCHEMA, "kpi_cell_sector_60", "nodeFDN", "Node00016"),
    ];

    const queryList = randomized ? querySetFunctions.randomizeQueries(requests) : requests;
    for (let i = 0; i < queryList.length; i++) {
        queryList[i]();
    }
}
