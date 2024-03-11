#!/bin/bash
sleep 10

mongosh --host mongo1:27017 <<EOF
  var cfg = {
    "_id": "mongo-cluster-replicaset",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongo1:27017",
        "priority": 2,
        "votes": 1
      },
      {
        "_id": 1,
        "host": "mongo2:27018",
        "priority": 1,
        "votes": 1
      },
      {
        "_id": 2,
        "host": "mongo3:27019",
        "priority": 1,
        "votes": 1
      }
      },
      {
        "_id": 3,
        "host": "mongo4:27020",
        "priority": 1,
        "votes": 1
      }
    ]
  };
  rs.initiate(cfg);
EOF