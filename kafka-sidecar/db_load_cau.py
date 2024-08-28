import sys
import math
import random
import psycopg
from tqdm import tqdm
from datetime import datetime, timedelta
from multiprocessing import Pool, Manager, Lock


# Configuration for the PostgreSQL connection
db_config = {
    "host": sys.argv[1],
    "port": "5432",
    "dbname": "kpi_service_db",
    "user": "kpi_service_user",
    "password": sys.argv[2]
}

cells = 10938


# Time range for Agg_beg_tim
days = int(sys.argv[5])
end_time = datetime(2024, int(sys.argv[3]), int(sys.argv[4]), 23)
start_time = end_time - timedelta(days=days) + timedelta(hours=1)

#number of partitions created
partition_number = days + 4



class TABLE:
    agg_columns = [
        "aggregation_begin_time",
        "moFdn",
        "nodeFDN"
    ]

    @classmethod
    def create_table(self, cursor):
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS kpi.{self.name}
            ({",".join([f'"{col_name}" {col_type}' for (col_name, col_type) in self.columns])})
            PARTITION BY RANGE (aggregation_begin_time) with (OIDS = FALSE)
        """)
        cursor.execute(f"ALTER TABLE kpi.{self.name} OWNER TO kpi_service_user")

    @classmethod
    def create_partitions(self, cursor):
        date = start_time - timedelta(days=2)
        for _ in range(partition_number):
            partition_name = f"{self.name}_p_{date.strftime('%Y_%m_%d')}"
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS kpi.{partition_name}
                PARTITION OF kpi.{self.name}
                FOR VALUES FROM ('{date}') TO ('{date + timedelta(days=1)}')
            """)
            cursor.execute(f"""
                CREATE UNIQUE INDEX IF NOT EXISTS {partition_name}_ui
                ON kpi.{partition_name} ({",".join([f'"{col}"' for col in self.agg_columns])})
            """)
            cursor.execute(f"ALTER TABLE kpi.{partition_name} OWNER TO kpi_service_user")
            date += timedelta(days=1)


class TABLE_CELL_GUID_60(TABLE):
    name = "kpi_cell_guid_60"
    aggregation_time = 60
    records_per_agg_period = math.floor(cells * 1.5)
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["counter_cell_reliability_hourly", "INTEGER"],
        ["no_of_trx_points", "INTEGER"],
        ["num_samples_ta_hourly", "INTEGER[]"],
        ["num_samples_rsrp_ta_hourly", "INTEGER[]"],
        ["num_samples_bad_rsrp_ta_hourly", "INTEGER[]"],
        ["pdcch_cfi_mode", "INTEGER"],
        ["bandwidth", "INTEGER"],
        ["freq_band", "INTEGER"],
        ["e_rab_retainability_percentage_lost_hourly_den", "INTEGER"],
        ["num_non_null_counters_count_pmprbavaildl", "INTEGER"],
        ["num_non_null_counters_count_pmpdcchcceactivity", "INTEGER"],
        ["num_non_null_counters_count_pmpdcchcceutil", "INTEGER"],
        ["num_non_null_counters_count_pmprbuseddldtchfirsttransqci", "INTEGER"],
        ["num_non_null_counters_count_pmprbuseddlretrans", "INTEGER"],
        ["num_non_null_counters_count_pmprbuseddlfirsttrans", "INTEGER"],
        ["num_non_null_counters_count_pmactiveuedlsum", "INTEGER"],
        ["num_non_null_counters_count_pmradiothpvoldl", "INTEGER"],
        ["num_non_null_counters_count_pmradiothpvoldlscell", "INTEGER"],
        ["num_non_null_counters_count_pmactiveuedlsumqci", "INTEGER"],
        ["num_non_null_counters_count_pmradiouerepcqidistr", "INTEGER"],
        ["num_non_null_counters_count_pmradiouerepcqidistr2", "INTEGER"],
        ["num_non_null_counters_count_pmradiotxrankdistr", " INTEGER"],
        ["num_non_null_counters_count_pmrrcconnlevsum", "INTEGER"],
        ["num_non_null_counters_count_pmrrcconnlevsamp", "INTEGER"],
        ["pm_flex_rrc_conn_sum_spid", "INTEGER"],
        ["num_calls_cell_hourly", "INTEGER"],
        ["ul_pusch_sinr_hourly_numerator", "FLOAT"],
        ["ul_pusch_sinr_hourly_denominator", "FLOAT"],
        ["sub_ratio_denom", "INTEGER"],
        ["sub_ratio_numerator", "INTEGER"],
        ["pm_flex_rrc_conn_sum", "INTEGER"],
        ["pm_rrc_conn_samp", "INTEGER"],
        ["pm_rrc_conn_lev_sum", "INTEGER"],
        ["pm_rrc_conn_lev_samp", "INTEGER"],
        ["cell_prep_succ_hourly", "INTEGER"],
        ["cell_prep_att_hourly", "INTEGER"],
        ["cell_exe_succ_hourly", "INTEGER"],
        ["cell_exe_att_hourly", "INTEGER"],
        ["dl_pdcp_ue_throughput_num_cell", "INTEGER"],
        ["dl_pdcp_ue_throughput_den_cell", "INTEGER"],
        ["erab_estab_succ_hourly", "INTEGER"],
        ["rrc_conn_estab_att_hourly", "INTEGER"],
        ["connected_users", "FLOAT"],
        ["pm_idle_mode_rel_distr_low_load", "INTEGER"],
        ["pm_idle_mode_rel_distr_low_medium_load", "INTEGER"],
        ["pm_idle_mode_rel_distr_medium_load", "INTEGER"],
        ["pm_idle_mode_rel_distr_medium_high_load", "INTEGER"],
        ["pm_idle_mode_rel_distr_high_load", "INTEGER"],
        ["cqi2", "INTEGER[]"],
        ["cqi1", "INTEGER[]"],
        ["radio_tx_rank_distr", "INTEGER[]"],
        ["pmpdcchcceactivity_sum_den", "FLOAT"],
        ["mac_level_data_vol_dl_rate", "FLOAT"],
        ["volteprbsdl_numerator_transmissions", "FLOAT"],
        ["volteprbsdl_numerator_qci", "INTEGER"],
        ["prb_pairs_available", "INTEGER"],
        ["pmpdcchcceutil_0_norm", "INTEGER"],
        ["num_active_ue_dl_sum_qci", "INTEGER"],
        ["sum_active_ues_in_dl", "BIGINT"],
        ["pmpdcchcceutil_1_19_distribution_product", "FLOAT"],
        ["s1_sig_conn_estab_att_hourly", "INTEGER"],
        ["erab_estab_att_hourly", "INTEGER"],
        ["pm_rrc_conn_estab_succ_hourly", "INTEGER"],
        ["pm_s1_sig_conn_estab_succ_hourly", "INTEGER"],
        ["ul_pdcp_ue_throughput_num_cell", "INTEGER"],
        ["ul_pdcp_ue_throughput_den_cell", "INTEGER"],
        ["e_rab_retainability_percentage_lost_qci1_num", "INTEGER"],
        ["e_rab_retainability_percentage_lost_qci1_den", "INTEGER"],
        ["rrc_conn_estab_succ_hourly", "INTEGER"],
        ["s1_sig_conn_estab_succ_hourly", "INTEGER"],
        ["erab_estab_succ_qci1_hourly", "INTEGER"],
        ["rrc_conn_estab_att_int_hourly", "INTEGER"],
        ["s1_sig_conn_estab_attm_hourly", "INTEGER"],
        ["erab_estab_att_qci1_hourly", "INTEGER"],
        ["e_rab_retainability_percentage_lost_hourly_num", "INTEGER"],
        ["distance_q1", "FLOAT"],
        ["distance_q2", "FLOAT"],
        ["distance_q3", "FLOAT"],
        ["distance_q4", "FLOAT"],
        ["bin_q1", "FLOAT"],
        ["bin_q2", "FLOAT"],
        ["bin_q3", "FLOAT"],
        ["bin_q4", "FLOAT"],
        ["pmpdcchcceutil_0_19_distribution_product", "FLOAT"],
        ["ca_adjustment_factor", "FLOAT"],
        ["qci_samples_per_rop", "INTEGER"],
        ["cce_per_subframe", "FLOAT"],
        ["tti_per_rop", "INTEGER"],
        ["cell_handover_success_rate_hourly", "FLOAT"],
        ["initial_and_added_e_rab_establishment_sr_hourly", "FLOAT"],
        ["e_rab_retainability_percentage_lost_qci1_hourly", "FLOAT"],
        ["double_count_factor_radio_tx_rank_distr", "FLOAT"],
        ["subscription_ratio", "FLOAT"],
        ["connected_endc_users_hourly", "FLOAT"],
        ["connected_users_hourly", "FLOAT"],
        ["initial_and_added_e_rab_establishment_sr_for_qci1_hourly", "FLOAT"],
        ["e_rab_retainability_percentage_lost_hourly", "FLOAT"],
        ["num_non_null_counters_count_app_coverage", "INTEGER"],
        ["num_bad_samples_rsrp_ta_q4", "INTEGER"],
        ["num_bad_samples_rsrp_ta_q3", "INTEGER"],
        ["num_bad_samples_rsrp_ta_q2", "INTEGER"],
        ["num_bad_samples_rsrp_ta_q1", "INTEGER"],
        ["num_samples_rsrp_ta_q4", "INTEGER"],
        ["num_samples_rsrp_ta_q3", "INTEGER"],
        ["num_samples_rsrp_ta_q2", "INTEGER"],
        ["num_samples_rsrp_ta_q1", "INTEGER"],
        ["ul_pusch_sinr_hourly_interim", "FLOAT"],
        ["avg_dl_pdcp_throughput_cell", "FLOAT"],
        ["avg_ul_pdcp_ue_throughput_cell", "FLOAT"],
        ["endc_spid115_ues", "FLOAT"],
        ["pdcchcceutil", "FLOAT"],
        ["available_prbs", "FLOAT"],
        ["active_ues_mbb", "FLOAT"],
        ["sum_active_ues_in_dl_per_no_of_rops", "FLOAT"],
        ["volteprbsdl", "FLOAT"],
        ["active_ues_volte_dl", "FLOAT"],
        ["dlprbstot", "FLOAT"],
        ["num_ue_samples_q1", "INTEGER"],
        ["num_ue_samples_q2", "INTEGER"],
        ["num_ue_samples_q3", "INTEGER"],
        ["num_ue_samples_q4", "INTEGER"],
        ["ue_total_samples_denominator", "INTEGER"],
        ["ue_percentage_q1", "FLOAT"],
        ["ue_percentage_q2", "FLOAT"],
        ["ue_percentage_q3", "FLOAT"],
        ["ue_percentage_q4", "FLOAT"],
        ["bad_rsrp_percentage_q4", "FLOAT"],
        ["bad_rsrp_percentage_q3", "FLOAT"],
        ["bad_rsrp_percentage_q2", "FLOAT"],
        ["bad_rsrp_percentage_q1", "FLOAT"],
        ["ul_pusch_sinr_hourly", "INTEGER"],
        ["per_endc_den", "FLOAT"],
        ["resource_elements_per_prb_interim_mode_4_5_num_den", "FLOAT"],
        ["available_prbs_per_user", "FLOAT"],
        ["cqi", "FLOAT[]"],
        ["percentage_endc_users", "FLOAT"],
        ["resource_elements_per_prb_interim_mode_4_5", "FLOAT"],
        ["cqi_sum", "FLOAT"],
        ["active_ues_dl", "FLOAT"],
        ["resource_elements_per_prb_mode_4", "FLOAT"],
        ["resource_elements_per_prb_mode_5", "FLOAT"],
        ["resource_elements_per_prb", "FLOAT"],
        ["interim_kpi_prbs_and_elements_per_user", "FLOAT"],
        ["achievable_throughput_dist", "FLOAT[]"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        cells_per_node = 4
        node = math.floor(i / cells_per_node ** 2) + 1
        cell1 = math.floor(i / cells_per_node) % cells_per_node  + 1
        cell2 = i % cells_per_node + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell{cell1},EUtranCellTDD=Cell{cell2}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]


    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            values = {
                "moFdn": moFdn,
                "nodeFDN": nodeFDN,
                "counter_cell_reliability_hourly": random.randint(0, 50),
                "no_of_trx_points": random.randint(0, 15),
                "num_samples_ta_hourly": "{1,2,3,4,5,6,7,1099,19652}",
                "num_samples_rsrp_ta_hourly": "{1,2,3,4,5,6,7,1099,19652}",
                "num_samples_bad_rsrp_ta_hourly": "{1,2,3,4,5,6,7,1099,19652}",
                "pdcch_cfi_mode": random.randint(0, 100),
                "bandwidth": random.randint(0, 1),
                "freq_band": random.randint(0, 1),
                "e_rab_retainability_percentage_lost_hourly_den": random.randint(0, 150),
                "num_non_null_counters_count_pmprbavaildl": random.randint(0, 100),
                "num_non_null_counters_count_pmpdcchcceactivity": random.randint(0, 50),
                "num_non_null_counters_count_pmpdcchcceutil": random.randint(0, 30),
                "num_non_null_counters_count_pmprbuseddldtchfirsttransqci": random.randint(0, 30),
                "num_non_null_counters_count_pmprbuseddlretrans": random.randint(0, 30),
                "num_non_null_counters_count_pmprbuseddlfirsttrans": random.randint(0, 1000),
                "num_non_null_counters_count_pmactiveuedlsum": random.randint(0, 45),
                "num_non_null_counters_count_pmradiothpvoldl": random.randint(0, 100),
                "num_non_null_counters_count_pmradiothpvoldlscell": random.randint(0, 1015),
                "num_non_null_counters_count_pmactiveuedlsumqci": random.randint(0, 50),
                "num_non_null_counters_count_pmradiouerepcqidistr": random.randint(0, 30),
                "num_non_null_counters_count_pmradiouerepcqidistr2": random.randint(0, 30),
                "num_non_null_counters_count_pmradiotxrankdistr": random.randint(0, 1000),
                "num_non_null_counters_count_pmrrcconnlevsum": random.randint(0, 100),
                "num_non_null_counters_count_pmrrcconnlevsamp": random.randint(0, 500_000),
                "pm_flex_rrc_conn_sum_spid": random.randint(0, 30),
                "num_calls_cell_hourly": random.randint(0, 1000),
                "ul_pusch_sinr_hourly_numerator": random.randint(0, 1_000_000),
                "ul_pusch_sinr_hourly_denominator": random.randint(0, 500_000),
                "sub_ratio_denom": random.randint(0, 1000),
                "sub_ratio_numerator": random.randint(0, 15),
                "pm_flex_rrc_conn_sum": random.randint(0, 15),
                "pm_rrc_conn_samp": random.randint(0, 30),
                "pm_rrc_conn_lev_sum": random.randint(0, 15),
                "pm_rrc_conn_lev_samp": random.randint(0, 45),
                "cell_prep_succ_hourly": random.randint(0, 30),
                "cell_prep_att_hourly": random.randint(0, 50),
                "cell_exe_succ_hourly": random.randint(0, 70),
                "cell_exe_att_hourly": random.randint(0, 100),
                "dl_pdcp_ue_throughput_num_cell": random.randint(0, 100),
                "dl_pdcp_ue_throughput_den_cell": random.randint(0, 500),
                "erab_estab_succ_hourly": random.randint(0, 1000),
                "rrc_conn_estab_att_hourly": random.randint(-60, 0),
                "connected_users": random.randint(0, 10),
                "pm_idle_mode_rel_distr_low_load": random.randint(0, 50),
                "pm_idle_mode_rel_distr_low_medium_load": random.randint(0, 100),
                "pm_idle_mode_rel_distr_medium_load": random.randint(0, 100),
                "pm_idle_mode_rel_distr_medium_high_load": random.randint(0, 15),
                "pm_idle_mode_rel_distr_high_load": random.randint(0, 30),
                "cqi2": "{1,2,3,4,5,6,7,1099,19652}",
                "cqi1": "{1,2,3,4,5,6,7,1099,19652}",
                "radio_tx_rank_distr": "{1,2,3,4,5,6,7,1099,19652}",
                "pmpdcchcceactivity_sum_den": random.randint(0, 150),
                "mac_level_data_vol_dl_rate": random.randint(0, 15),
                "volteprbsdl_numerator_transmissions": random.randint(0, 5),
                "volteprbsdl_numerator_qci": random.randint(0, 50_000),
                "prb_pairs_available": random.randint(0, 50),
                "pmpdcchcceutil_0_norm": random.randint(-3_000_000, 0),
                "num_active_ue_dl_sum_qci": random.randint(0, 150),
                "sum_active_ues_in_dl": random.randint(0, 100),
                "pmpdcchcceutil_1_19_distribution_product": random.uniform(0, 500_000),
                "s1_sig_conn_estab_att_hourly": random.randint(0, 100),
                "erab_estab_att_hourly": random.randint(0, 1000),
                "pm_rrc_conn_estab_succ_hourly": random.randint(0, 35),
                "pm_s1_sig_conn_estab_succ_hourly": random.randint(0, 50),
                "ul_pdcp_ue_throughput_num_cell": random.randint(0, 1000),
                "ul_pdcp_ue_throughput_den_cell": random.randint(0, 15),
                "e_rab_retainability_percentage_lost_qci1_num": random.randint(0, 100),
                "e_rab_retainability_percentage_lost_qci1_den": random.randint(0, 200),
                "rrc_conn_estab_succ_hourly": random.randint(0, 50),
                "s1_sig_conn_estab_succ_hourly": random.randint(0, 100),
                "erab_estab_succ_qci1_hourly": random.randint(0, 150),
                "rrc_conn_estab_att_int_hourly": random.randint(-101, 0),
                "s1_sig_conn_estab_attm_hourly": random.randint(0, 100),
                "erab_estab_att_qci1_hourly": random.randint(0, 50),
                "e_rab_retainability_percentage_lost_hourly_num": random.randint(0, 100),
                "distance_q1": random.randint(0, 100),
                "distance_q2": random.randint(0, 100),
                "distance_q3": random.randint(0, 100),
                "distance_q4": random.randint(0, 100),
                "bin_q1": random.randint(0, 100),
                "bin_q2": random.randint(0, 100),
                "bin_q3": random.randint(0, 100),
                "bin_q4": random.randint(0, 100),
                "pmpdcchcceutil_0_19_distribution_product": random.randint(0, 100),
                "ca_adjustment_factor": random.randint(0, 100),
                "qci_samples_per_rop": random.randint(0, 100),
                "cce_per_subframe": random.randint(0, 100),
                "tti_per_rop": random.randint(0, 100),
                "cell_handover_success_rate_hourly": random.randint(0, 100),
                "initial_and_added_e_rab_establishment_sr_hourly": random.randint(0, 100),
                "e_rab_retainability_percentage_lost_qci1_hourly": random.randint(0, 100),
                "double_count_factor_radio_tx_rank_distr": random.randint(0, 100),
                "subscription_ratio": random.randint(0, 100),
                "connected_endc_users_hourly": random.randint(0, 100),
                "connected_users_hourly": random.randint(0, 100),
                "initial_and_added_e_rab_establishment_sr_for_qci1_hourly": random.randint(0, 100),
                "e_rab_retainability_percentage_lost_hourly": random.randint(0, 100),
                "num_non_null_counters_count_app_coverage": random.randint(0, 100),
                "num_bad_samples_rsrp_ta_q4": random.randint(0, 100),
                "num_bad_samples_rsrp_ta_q3": random.randint(0, 100),
                "num_bad_samples_rsrp_ta_q2": random.randint(0, 100),
                "num_bad_samples_rsrp_ta_q1": random.randint(0, 100),
                "num_samples_rsrp_ta_q4": random.randint(0, 100),
                "num_samples_rsrp_ta_q3": random.randint(0, 100),
                "num_samples_rsrp_ta_q2": random.randint(0, 100),
                "num_samples_rsrp_ta_q1": random.randint(0, 100),
                "ul_pusch_sinr_hourly_interim": random.randint(0, 100),
                "avg_dl_pdcp_throughput_cell": random.randint(0, 100),
                "avg_ul_pdcp_ue_throughput_cell": random.randint(0, 100),
                "endc_spid115_ues": random.randint(0, 100),
                "pdcchcceutil": random.randint(0, 100),
                "available_prbs": random.randint(0, 100),
                "active_ues_mbb": random.randint(0, 100),
                "sum_active_ues_in_dl_per_no_of_rops": random.randint(0, 100),
                "volteprbsdl": random.randint(0, 100),
                "active_ues_volte_dl": random.randint(0, 100),
                "dlprbstot": random.randint(0, 100),
                "num_ue_samples_q1": random.randint(0, 100),
                "num_ue_samples_q2": random.randint(0, 100),
                "num_ue_samples_q3": random.randint(0, 100),
                "num_ue_samples_q4": random.randint(0, 100),
                "ue_total_samples_denominator": random.randint(0, 100),
                "ue_percentage_q1": random.randint(0, 100),
                "ue_percentage_q2": random.randint(0, 100),
                "ue_percentage_q3": random.randint(0, 100),
                "ue_percentage_q4": random.randint(0, 100),
                "bad_rsrp_percentage_q4": random.randint(0, 100),
                "bad_rsrp_percentage_q3": random.randint(0, 100),
                "bad_rsrp_percentage_q2": random.randint(0, 100),
                "bad_rsrp_percentage_q1": random.randint(0, 100),
                "ul_pusch_sinr_hourly": random.randint(0, 100),
                "per_endc_den": random.randint(0, 100),
                "resource_elements_per_prb_interim_mode_4_5_num_den": random.randint(0, 100),
                "available_prbs_per_user": random.randint(0, 100),
                "cqi": "{1,2,3,4,5,6,7,1099,19652}",
                "percentage_endc_users": random.randint(0, 100),
                "resource_elements_per_prb_interim_mode_4_5": random.randint(0, 100),
                "cqi_sum": random.randint(0, 100),
                "active_ues_dl": random.randint(0, 100),
                "resource_elements_per_prb_mode_4": random.randint(0, 100),
                "resource_elements_per_prb_mode_5": random.randint(0, 100),
                "resource_elements_per_prb": random.randint(0, 100),
                "interim_kpi_prbs_and_elements_per_user": random.randint(0, 100),
                "achievable_throughput_dist": "{1,2,3,4,5,6,7,1099,19652}",
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record


class TABLE_CELL_GUID_FLM_60(TABLE):
    name = "kpi_cell_guid_flm_60"
    aggregation_time = 60
    records_per_agg_period = math.floor(cells / 2)
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["min_num_cqi_samples", "INTEGER"],
        ["min_rops_for_app_cov_reliability", "INTEGER"],
        ["target_throughput_r", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        cells_per_node = 4
        node = i + 1
        cell = i % cells_per_node + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell{cell}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            values = {
                "moFdn": moFdn,
                "nodeFDN": nodeFDN,
                "min_num_cqi_samples": random.randint(0, 100),
                "min_rops_for_app_cov_reliability": random.randint(0, 100),
                "target_throughput_r": random.randint(0, 100)
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record


class TABLE_CELL_SECTOR_60(TABLE):
    name = "kpi_cell_sector_60"
    aggregation_time = 60
    records_per_agg_period = math.floor(cells / 2)
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["pm_ue_throughput_vol_ul", "BIGINT"],
        ["pm_ue_throughput_time_ul", "BIGINT"],
        ["pm_ue_throughput_vol_minus_lasttti_dl", "BIGINT"],
        ["pm_ue_throughput_time_dl", "BIGINT"],
        ["num_calls_cell_sector_hourly", "INTEGER"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        cells_per_node = 4
        node = i + 1
        cell = i % cells_per_node + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell{cell}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            values = {
                "moFdn": moFdn,
                "nodeFDN": nodeFDN,
                "pm_ue_throughput_vol_ul": random.randint(0, 100),
                "pm_ue_throughput_time_ul": random.randint(0, 100),
                "pm_ue_throughput_vol_minus_lasttti_dl": random.randint(0, 100),
                "pm_ue_throughput_time_dl": random.randint(0, 100),
                "num_calls_cell_sector_hourly": random.randint(0, 100)
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record


class TABLE_SECTOR_60(TABLE):
    name = "kpi_sector_60"
    aggregation_time = 60
    records_per_agg_period = math.floor(cells / 2)
    agg_columns = [
        "aggregation_begin_time",
        "nodeFDN"
    ]
    columns = [
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["num_calls_sector_hourly", "INTEGER"],
        ["ul_pdcp_ue_throughput_num_sector", "BIGINT"],
        ["ul_pdcp_ue_throughput_den_sector", "BIGINT"],
        ["avg_ul_pdcp_throughput_sector", "FLOAT"],
        ["dl_pdcp_ue_throughput_num_sector", "BIGINT"],
        ["dl_pdcp_ue_throughput_den_sector", "BIGINT"],
        ["avg_dl_pdcp_throughput_sector", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        node = i + 1
        return f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            nodeFDN = self.get_fdns(i)
            values = {
                "nodeFDN": nodeFDN,
                "num_calls_sector_hourly": random.randint(0, 100),
                "ul_pdcp_ue_throughput_num_sector": random.randint(0, 100),
                "ul_pdcp_ue_throughput_den_sector": random.randint(0, 100),
                "avg_ul_pdcp_throughput_sector": random.randint(0, 100),
                "dl_pdcp_ue_throughput_num_sector": random.randint(0, 100),
                "dl_pdcp_ue_throughput_den_sector": random.randint(0, 100),
                "avg_dl_pdcp_throughput_sector": random.randint(0, 100)
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record


class TABLE_CELL_GUID_1440(TABLE):
    name = "kpi_cell_guid_1440"
    aggregation_time = 1440
    records_per_agg_period = cells * 49
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["counter_cell_reliability_daily", "INTEGER"],
        ["cgi", "VARCHAR(255)"],
        ["synthetic_counter_cell_reliability_daily", "INTEGER"],
        ["num_samples_ta", "INTEGER[]"],
        ["num_samples_rsrp_ta", "INTEGER[]"],
        ["num_samples_bad_rsrp_ta", "INTEGER[]"],
        ["pm_s1_sig_conn_estab_fail_mme_ovl_mos", "INTEGER"],
        ["num_calls_daily", "INTEGER"],
        ["pm_erab_estab_succ_added", "INTEGER"],
        ["pm_erab_estab_att_init", "INTEGER"],
        ["pm_erab_estab_att_added", "INTEGER"],
        ["pm_erab_estab_att_added_ho_ongoing", "INTEGER"],
        ["rrc_conn_estab_succ", "INTEGER"],
        ["rrc_conn_estab_att_reatt", "INTEGER"],
        ["rrc_conn_estab_att_int", "INTEGER"],
        ["s1_sig_conn_estab_succ", "INTEGER"],
        ["s1_sig_conn_estab_att", "INTEGER"],
        ["pm_erab_estab_succ_init_qci1", "INTEGER"],
        ["pm_erab_estab_succ_added_qci1", "INTEGER"],
        ["pm_erab_estab_att_init_qci1", "INTEGER"],
        ["pm_erab_estab_att_added_qci1", "INTEGER"],
        ["pm_erab_estab_att_added_ho_ongoing_qci1", "INTEGER"],
        ["cell_prep_succ", "INTEGER"],
        ["cell_prep_att", "INTEGER"],
        ["cell_exe_succ", "INTEGER"],
        ["cell_exe_att", "INTEGER"],
        ["pm_rrc_conn_estab_fail_mme_ovl_mod", "INTEGER"],
        ["pm_rrc_conn_estab_fail_mme_ovl_mos", "INTEGER"],
        ["pm_rrc_conn_estab_att_reatt", "INTEGER"],
        ["pm_rrc_conn_estab_att", "INTEGER"],
        ["pm_s1_sig_conn_estab_succ", "INTEGER"],
        ["pm_rrc_conn_estab_succ", "INTEGER"],
        ["pm_erab_rel_mme", "INTEGER"],
        ["pm_erab_rel_normal_enb", "INTEGER"],
        ["pm_erab_rel_abnormal_enb", "INTEGER"],
        ["pm_erab_rel_abnormal_mme_act", "INTEGER"],
        ["pm_erab_rel_abnormal_enb_act", "INTEGER"],
        ["pm_erab_rel_mme_qci1", "INTEGER"],
        ["pm_erab_rel_normal_enb_qci1", "INTEGER"],
        ["pm_erab_rel_abnormal_enb_qci1", "INTEGER"],
        ["pm_erab_rel_abnormal_mme_act_qci1", "INTEGER"],
        ["pm_erab_rel_abnormal_enb_act_qci1", "INTEGER"],
        ["pm_cell_downtime_auto_daily", "INTEGER"],
        ["pm_cell_downtime_man_daily", "INTEGER"],
        ["pm_s1_sig_conn_estab_att", "INTEGER"],
        ["rrc_conn_estab_att", "FLOAT"],
        ["contiguity", "FLOAT"],
        ["initial_and_added_e_rab_establishment_sr", "REAL"],
        ["e_rab_retainability_percentage_lost_qci1", "FLOAT"],
        ["initial_and_added_e_rab_establishment_sr_for_qci1", "REAL"],
        ["e_rab_retainability_percentage_lost", "FLOAT"],
        ["cell_handover_success_rate", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        node = math.floor(i / 140) + 1
        cell = math.floor(i % 140) * 31  + 1
        relation = i % 30 + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell{cell},EUtranFreqRelation=Freq1,EUtranCellRelation=Relation{relation}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            values = {
                "moFdn": moFdn,
                "nodeFDN": nodeFDN,
                "counter_cell_reliability_daily": random.randint(0, 100),
                "cgi": f"SupportUnit={random.randint(0, 5)}",
                "synthetic_counter_cell_reliability_daily": random.randint(0, 50),
                "num_samples_ta": "{1,2,3,4,5,6,7,1099,19652}",
                "num_samples_rsrp_ta": "{1,2,3,4,5,6,7,1099,19652}",
                "num_samples_bad_rsrp_ta": "{1,2,3,4,5,6,7,1099,19652}",
                "pm_s1_sig_conn_estab_fail_mme_ovl_mos": random.randint(0, 100),
                "num_calls_daily": random.randint(0, 20),
                "pm_erab_estab_succ_added": random.randint(0, 100),
                "pm_erab_estab_att_init": random.randint(0, 20),
                "pm_erab_estab_att_added": random.randint(0, 20),
                "pm_erab_estab_att_added_ho_ongoing": random.randint(0, 100),
                "rrc_conn_estab_succ": random.randint(0, 100),
                "rrc_conn_estab_att_reatt": random.randint(0, 100),
                "rrc_conn_estab_att_int": random.randint(0, 100),
                "s1_sig_conn_estab_succ": random.randint(0, 50),
                "s1_sig_conn_estab_att": random.randint(0, 50),
                "pm_erab_estab_succ_init_qci1": random.randint(0, 20),
                "pm_erab_estab_succ_added_qci1": random.randint(0, 20),
                "pm_erab_estab_att_init_qci1": random.randint(0, 20),
                "pm_erab_estab_att_added_qci1": random.randint(0, 100),
                "pm_erab_estab_att_added_ho_ongoing_qci1": random.randint(0, 100),
                "cell_prep_succ": random.randint(0, 50),
                "cell_prep_att": random.randint(0, 20),
                "cell_exe_succ": random.randint(0, 50),
                "cell_exe_att": random.randint(0, 100),
                "pm_rrc_conn_estab_fail_mme_ovl_mod": random.randint(0, 50),
                "pm_rrc_conn_estab_fail_mme_ovl_mos": random.randint(0, 100),
                "pm_rrc_conn_estab_att_reatt": random.randint(0, 100),
                "pm_rrc_conn_estab_att": random.randint(0, 100),
                "pm_s1_sig_conn_estab_succ": random.randint(0, 100),
                "pm_rrc_conn_estab_succ": random.randint(0, 20),
                "pm_erab_rel_mme": random.randint(0, 100),
                "pm_erab_rel_normal_enb": random.randint(0, 50),
                "pm_erab_rel_abnormal_enb": random.randint(0, 100),
                "pm_erab_rel_abnormal_mme_act": random.randint(0, 20),
                "pm_erab_rel_abnormal_enb_act": random.randint(0, 100),
                "pm_erab_rel_mme_qci1": random.randint(0, 20),
                "pm_erab_rel_normal_enb_qci1": random.randint(0, 100),
                "pm_erab_rel_abnormal_enb_qci1": random.randint(0, 20),
                "pm_erab_rel_abnormal_mme_act_qci1": random.randint(0, 50),
                "pm_erab_rel_abnormal_enb_act_qci1": random.randint(0, 100),
                "pm_cell_downtime_auto_daily": random.randint(0, 15),
                "pm_cell_downtime_man_daily": random.randint(0, 100),
                "pm_s1_sig_conn_estab_att": random.randint(0, 10),
                "rrc_conn_estab_att": random.randint(0, 100),
                "contiguity": random.randint(0, 100),
                "initial_and_added_e_rab_establishment_sr": random.randint(0, 100),
                "e_rab_retainability_percentage_lost_qci1": random.randint(0, 100),
                "initial_and_added_e_rab_establishment_sr_for_qci1": random.randint(0, 100),
                "e_rab_retainability_percentage_lost": random.randint(0, 100),
                "cell_handover_success_rate": random.randint(0, 100)
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record


class TABLE_CELL_GUID_FLM_1440(TABLE):
    name = "kpi_cell_guid_flm_1440"
    aggregation_time = 1440
    records_per_agg_period = cells * 4
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["min_num_samp_trans_calc", "FLOAT"],
        ["sigma_for_transient", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        cells_per_node = 4
        node = i + 1
        cell = i % cells_per_node + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell{cell}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            values = {
                "moFdn": moFdn,
                "nodeFDN": nodeFDN,
                "min_num_samp_trans_calc": random.randint(0, 100),
                "sigma_for_transient": random.uniform(0, 100)
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record


class TABLE_RELATION_GUID_1440(TABLE):
    name = "kpi_relation_guid_source_guid_target_guid_1440"
    aggregation_time = 1440
    records_per_agg_period = cells * 40
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["source_cell_cgi_daily", "VARCHAR(255)"],
        ["intra_site", "BOOLEAN"],
        ["out_succ_ho_intraf", "INTEGER"],
        ["out_succ_ho_interf", "INTEGER"],
        ["source_fdn", "VARCHAR(255)"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def get_fdns(self, i):
        node = math.floor(i / 140) + 1
        cell = math.floor(i % 140) * 31  + 1
        relation = i % 30 + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,EUtranCellFDD=Cell{cell},EUtranFreqRelation=Freq1,EUtranCellRelation=Relation{relation}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            values = {
                "moFdn": moFdn,
                "nodeFDN": nodeFDN,
                "source_cell_cgi_daily": f"SupportUnit={random.randint(0, 5)},Data",
                "intra_site": random.choice([True, False]),
                "out_succ_ho_intraf": random.randint(0, 100),
                "out_succ_ho_interf": random.randint(0, 100),
                "source_fdn": f"SupportUnit={random.randint(0, 5)}"
            }
            record = []
            for col_name, _ in self.columns[:-2]:
                record.append(values[col_name])
            yield record



def generate_data(table, start_time, end_time, process_couter, tqdm_positions):
    with print_lock:
        position = tqdm_positions.index(None) if None in tqdm_positions else len(tqdm_positions)
        if position == len(tqdm_positions):
            tqdm_positions.append(process_couter)
        else:
            tqdm_positions[position] = process_couter
        pbar = tqdm(
            total=math.ceil((end_time - start_time).total_seconds() / 60 / table.aggregation_time * table.records_per_agg_period),
            desc=f"{table.name}_{start_time.strftime('%Y-%m-%d')}",
            position=position,
            leave=False
        )

    counter = 0
    current_time = start_time
    with psycopg.connect(**db_config) as connection:
        cursor = connection.cursor()
        columns = ','.join([f'"{col_name}"' for col_name, _ in table.columns])
        with cursor.copy(f"COPY kpi.{table.name} ({columns}) FROM STDIN") as copy:
            while current_time < end_time:
                for record in table.generator():
                    record.extend([current_time, current_time + timedelta(minutes=table.aggregation_time)])
                    copy.write_row(record)
                    counter += 1
                    if counter == 1000:
                        with print_lock:
                            pbar.update(counter)
                        counter = 0
                current_time += timedelta(minutes=table.aggregation_time)
        with print_lock:
            pbar.update(counter)
            pbar.refresh()
        connection.commit()

    with print_lock:
        pbar.close()
        tqdm_positions[position] = None


def process_init(l):
    global print_lock
    print_lock = l


def main():
    ENABLED_TABLES = [
        TABLE_CELL_GUID_60,
        TABLE_CELL_GUID_FLM_60,
        TABLE_CELL_SECTOR_60,
        TABLE_SECTOR_60,
        TABLE_CELL_GUID_1440,
        TABLE_CELL_GUID_FLM_1440,
        TABLE_RELATION_GUID_1440
    ]

    try:
        start = datetime.now()

        with psycopg.connect(**db_config) as connection:
            cursor = connection.cursor()
            for table in ENABLED_TABLES:
                table.create_table(cursor)
                table.create_partitions(cursor)
            connection.commit()

        manager = Manager()
        tqdm_positions = manager.list()
        with Pool(12, initializer=process_init, initargs=(Lock(),)) as pool:
            process_couter = 0
            for table in ENABLED_TABLES:
                for i in range(days):
                    process_start_time = start_time + timedelta(days=i)
                    process_end_time = end_time if i + 1 == days else start_time + timedelta(days=i + 1)
                    pool.apply_async(generate_data, args=(table, process_start_time, process_end_time, process_couter, tqdm_positions))
                    process_couter += 1
            pool.close()
            pool.join()

        print("\nData insertion successful!")
        print(f"Whole thing took {(datetime.now() - start).seconds}s")
    except (Exception, psycopg.Error) as error:
        print("Error:", error)


if __name__ == "__main__":
    main()
