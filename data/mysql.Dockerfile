FROM mysql:latest

ADD ./data/dump.sql /tmp/dump.sql
RUN sh -c 'mysql -u root --password=grandma-ill-fray-parch uomi < /tmp/dump.sql'
