FROM armdocker.rnd.ericsson.se/proj-eric-oss-drop/k6/tooling/k6-base-image:latest

ARG version

# This should match the version of the image being published in the repository.
# Do not use "latest" as testware version
ENV TESTWARE_VERSION=$version
ENV TEST_VERSION=$version

# Defines the staging type on which the container will run
ENV STAGING_TYPE="APPLICATION"

# The application under test. This shuld be immutable
ENV APP_NAME="eric-oss-pm-stats-calc-handling-test"

ADD js/ /tests
ADD resources/ /resources