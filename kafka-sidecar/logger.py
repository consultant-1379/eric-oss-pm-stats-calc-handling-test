import logging


logger = logging.getLogger("logger")
logging.basicConfig(
    format="%(asctime)s (%(threadName)s) %(levelname)-8s %(message)s",
    level=logging.INFO,
    datefmt="%Y-%m-%d %H:%M:%S"
)
