import os
import subprocess
from logger import logger
from datetime import datetime
import psycopg

CURRENT_DAY = datetime.now().day
CURRENT_MONTH = datetime.now().month
CPI_LOADER = 'db_load_cpi_all.py'
CAU_LOADER = 'db_load_cau.py'
DB_PSSWD = '4YUwpduAVz7m'
HOSTNAME = 'eric-pm-kpi-data'

def load_database(kpiSet, numberOfPreloadedDays):
    logger.info(f"Database pre-test loading: {kpiSet} set")
    params = HOSTNAME + ' ' + DB_PSSWD + ' ' + str(CURRENT_MONTH) + ' ' + str(CURRENT_DAY) + ' ' + str(numberOfPreloadedDays)
    match kpiSet:
        case "CPI":
            cmd = "python3 " + CPI_LOADER + ' ' + params + " & > /dev/null 2>&1"
            logger.info(f"command: {cmd}")
            os.system(cmd)
        case "CAU":
            cmd = "python3 " + CAU_LOADER + ' ' + params + " & > /dev/null 2>&1"
            logger.info(f"command: {cmd}")
            os.system(cmd)
        case _:
            logger.error(f"Invalid KPI set has been selected.")

def get_loading_status(kpiSet):
    match kpiSet:
        case "CPI":
            loader_script = CPI_LOADER
        case "CAU":
            loader_script = CAU_LOADER
        case _:
            logger.error(f"Invalid KPI set has been selected.")
    ps_output = subprocess.check_output(["ps", "-ef"])
    ps_lines = ps_output.decode("utf-8").split("\n")
    for line in ps_lines:
        if loader_script in line:
            return("DB loader script is running")
    else:
        return("DB loader script is not running")

def db_get_table_row_count(table):
    db_config = {
        "host": HOSTNAME,
        "port": "5432",
        "dbname": "kpi_service_db",
        "user": "kpi_service_user",
        "password": DB_PSSWD
    }
    with psycopg.connect(**db_config) as connection:
        cursor = connection.cursor()
        cursor.execute(f"""
            SELECT COUNT(*)
            FROM {table}
        """)
        result = cursor.fetchone()
        return result[0]
