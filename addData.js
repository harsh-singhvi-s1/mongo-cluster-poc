const { MongoClient } = require("mongodb");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    // const client = new MongoClient("mongodb://mongo1:27017,mongo2:27018,mongo3:27019/?replicaSet=mongo-cluster-replicaset");
    const client = new MongoClient("mongodb://mongo1:27017/?replicaSet=mongo-cluster-replicaset");

    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("cluster-poc");
    const collection = db.collection("data");

    while (true) {
        const res = await collection.insertOne({
            ts: new Date().toString(),
        });

        console.log(res);

        await sleep(2000);
    }
}

main();
