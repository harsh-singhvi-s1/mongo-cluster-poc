const { MongoClient } = require("mongodb");
const { argv } = require("node:process");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    if (argv.length < 3) {
        console.log("specify uri");
        return;
    }

    const client = new MongoClient(argv[2]+"/?directConnection=true");

    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("cluster-poc");
    const collection = db.collection("cluster-poc-bucket.chunks");


    let current = 0 
    while (true) {
        try {
            const res = await collection.countDocuments(); //.find().sort({_id:1}).limit(1).toArray();
            
            if (res != current) {    
                console.log(argv[2] , "=>", res);
                current = res
            }
            
            await sleep(500);
        } catch (e) {
            continue;
        }
    }

    return 0;
}

main();
