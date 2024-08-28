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

cells = 87496


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

    @classmethod
    def get_fdns(self, i):
        cells_per_node = 4
        mos = ["EUtranCellTDD", "EUtranCellFDD"]
        node = math.floor(i / cells_per_node / len(mos)) + 1
        mo = mos[math.floor(i / cells_per_node) % len(mos)]
        cell = i % cells_per_node + 1
        return [
            f"ManagedElement=NodeRadio1,ENodeBFunction=1,{mo}=Cell{cell}",
            f"Equipment=1,SubNetwork=DataGenerator1,MeContext=Node{node:05d}"
        ]


class TABLE_CELL_15(TABLE):
    name = "kpi_cell_15"
    aggregation_time = 15
    records_per_agg_period = cells
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["pm_pdcp_vol_dl_drb_FDD", "INTEGER"],
        ["pm_pdcp_vol_dl_drb_TDD", "INTEGER"],
        ["pm_ue_thp_time_dl_FDD", "INTEGER"],
        ["pm_ue_thp_time_dl_TDD", "INTEGER"],
        ["pm_ue_thp_vol_ul_FDD", "INTEGER"],
        ["pm_ue_thp_vol_ul_TDD", "INTEGER"],
        ["pm_ue_thp_time_ul_FDD", "INTEGER"],
        ["pm_ue_thp_time_ul_TDD", "INTEGER"],
        ["pm_cell_ho_prep_FDD", "FLOAT"],
        ["pm_cell_ho_prep_TDD", "FLOAT"],
        ["pm_cell_ho_exe_FDD", "FLOAT"],
        ["pm_cell_ho_exe_TDD", "FLOAT"],
        ["pm_erab_estab_succ_added_FDD", "INTEGER"],
        ["pm_erab_estab_succ_added_TDD", "INTEGER"],
        ["pm_erab_estab_FDD", "INTEGER"],
        ["pm_erab_estab_TDD", "INTEGER"],
        ["pm_ra_succ_cbra_FDD", "INTEGER"],
        ["pm_ra_succ_cbra_TDD", "INTEGER"],
        ["pm_ra_msg_2_att_cbra_FDD", "INTEGER"],
        ["pm_ra_msg_2_att_cbra_TDD", "INTEGER"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            record = [moFdn, nodeFDN]
            for _ in self.columns[2:-2]:
                record.append(random.randint(0, 100))
            yield record


class TABLE_CELL_60(TABLE):
    name = "kpi_cell_60"
    aggregation_time = 60
    records_per_agg_period = cells
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["pm_radio_thp_vol_dl_hourly_TDD", "INTEGER"],
        ["pm_sched_activity_cell_dl_hourly_TDD", "INTEGER"],
        ["pm_radio_thp_vol_dl_hourly_FDD", "INTEGER"],
        ["pm_sched_activity_cell_dl_hourly_FDD", "INTEGER"],
        ["pm_radio_thp_vol_ul_hourly_TDD", "INTEGER"],
        ["pm_sched_activity_cell_ul_hourly_TDD", "INTEGER"],
        ["pm_radio_thp_vol_ul_hourly_FDD", "INTEGER"],
        ["pm_sched_activity_cell_ul_hourly_FDD", "INTEGER"],
        ["pm_cell_downtime_auto_hourly_TDD", "INTEGER"],
        ["pm_cell_downtime_man_hourly_TDD", "INTEGER"],
        ["pm_cell_downtime_auto_hourly_FDD", "INTEGER"],
        ["pm_cell_downtime_man_hourly_FDD", "INTEGER"],
        ["pm_erab_estab_succ_init_hourly_FDD", "INTEGER"],
        ["pm_erab_estab_att_init_hourly_FDD", "INTEGER"],
        ["pm_erab_estab_succ_init_hourly_TDD", "INTEGER"],
        ["pm_erab_estab_att_init_hourly_TDD", "INTEGER"],
        ["pm_s1_sig_conn_estab_succ_hourly_FDD", "INTEGER"],
        ["s1_sig_conn_estab_att_fail_mme_hourly_FDD", "INTEGER"],
        ["pm_s1_sig_conn_estab_succ_hourly_TDD", "INTEGER"],
        ["s1_sig_conn_estab_att_fail_mme_hourly_TDD", "INTEGER"],
        ["pm_rrc_conn_estab_succ_hourly_FDD", "INTEGER"],
        ["rrc_estab_hourly_FDD", "INTEGER"],
        ["pm_rrc_conn_estab_succ_hourly_TDD", "INTEGER"],
        ["rrc_estab_hourly_TDD", "INTEGER"],
        ["e_rab_rel_abnormal_hourly_FDD", "INTEGER"],
        ["e_rab_rel_abnormal_hourly_TDD", "INTEGER"],
        ["e_rab_rel_abnormal_normal_hourly_TDD", "INTEGER"],
        ["e_rab_rel_abnormal_normal_hourly_FDD", "INTEGER"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            record = [moFdn, nodeFDN]
            for _ in self.columns[2:-2]:
                record.append(random.randint(0, 100))
            yield record


class TABLE_CELL_COMPLEX_15(TABLE):
    name = "kpi_cell_complex_15"
    aggregation_time = 15
    records_per_agg_period = cells
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["added_erab_estab_succ_rate_FDD", "FLOAT"],
        ["added_erab_estab_succ_rate_TDD", "FLOAT"],
        ["final_added_erab_estab_succ_rate", "FLOAT"],
        ["rob_rand_acc_succ_rate_FDD", "FLOAT"],
        ["rob_rand_acc_succ_rate_TDD", "FLOAT"],
        ["final_rob_rand_acc_succ_rate", "FLOAT"],
        ["average_dl_pdcp_ue_throughput_FDD", "FLOAT"],
        ["average_dl_pdcp_ue_throughput_TDD", "FLOAT"],
        ["final_average_dl_pdcp_ue_throughput", "FLOAT"],
        ["average_ul_pdcp_ue_throughput_FDD", "FLOAT"],
        ["average_ul_pdcp_ue_throughput_TDD", "FLOAT"],
        ["final_average_ul_pdcp_ue_throughput", "FLOAT"],
        ["intra_frequency_cell_mobility_succ_rate_FDD", "FLOAT"],
        ["intra_frequency_cell_mobility_succ_rate_TDD", "FLOAT"],
        ["final_intra_frequency_cell_mobility_succ_rate", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            record = [moFdn, nodeFDN]
            for _ in self.columns[2:-2]:
                record.append(round(random.uniform(0, 100), 2))
            yield record


class TABLE_CELL_COMPLEX_60(TABLE):
    name = "kpi_cell_complex_60"
    aggregation_time = 60
    records_per_agg_period = cells
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["avg_dl_mac_cell_throughtput_hourly_TDD", "FLOAT"],
        ["avg_dl_mac_cell_throughtput_hourly_FDD", "FLOAT"],
        ["final_avg_dl_mac_cell_throughtput_hourly", "FLOAT"],
        ["avg_ul_mac_cell_throughtput_hourly_TDD", "FLOAT"],
        ["avg_ul_mac_cell_throughtput_hourly_FDD", "FLOAT"],
        ["final_avg_ul_mac_cell_throughtput_hourly", "FLOAT"],
        ["cell_availability_hourly_FDD", "FLOAT"],
        ["cell_availability_hourly_TDD", "FLOAT"],
        ["final_cell_availability_hourly", "FLOAT"],
        ["init_erab_estab_succ_rate_hourly_FDD", "FLOAT"],
        ["init_erab_estab_succ_rate_hourly_TDD", "FLOAT"],
        ["final_init_erab_estab_succ_rate_hourly", "FLOAT"],
        ["e_rab_retainability_percentage_lost_hourly_FDD", "FLOAT"],
        ["e_rab_retainability_percentage_lost_hourly_TDD", "FLOAT"],
        ["final_e_rab_retainability_percentage_lost_hourly", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            record = [moFdn, nodeFDN]
            for _ in self.columns[2:-2]:
                record.append(round(random.uniform(0, 100), 2))
            yield record


class TABLE_CELL_COMPLEX_1440(TABLE):
    name = "kpi_cell_complex_1440"
    aggregation_time = 1440
    records_per_agg_period = cells
    columns = [
        ["moFdn", "VARCHAR(255) NOT NULL"],
        ["nodeFDN", "VARCHAR(255) NOT NULL"],
        ["avg_dl_mac_cell_throughtput_daily_TDD", "FLOAT"],
        ["final_avg_dl_mac_cell_throughtput_daily", "FLOAT"],
        ["avg_dl_mac_cell_throughtput_daily_FDD", "FLOAT"],
        ["aggregation_begin_time", "TIMESTAMP NOT NULL"],
        ["aggregation_end_time", "TIMESTAMP"]
    ]

    @classmethod
    def generator(self):
        for i in range(self.records_per_agg_period):
            moFdn, nodeFDN = self.get_fdns(i)
            record = [moFdn, nodeFDN]
            for _ in self.columns[2:-2]:
                record.append(round(random.uniform(0, 100), 2))
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
        TABLE_CELL_15,
        TABLE_CELL_60,
        TABLE_CELL_COMPLEX_15,
        TABLE_CELL_COMPLEX_60,
        TABLE_CELL_COMPLEX_1440
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
