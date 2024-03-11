const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const { argv } = require("node:process");
const path = require("path");
const fs = require("fs");
const stream = require("stream");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    if (argv.length < 3) {
        console.log("specify path");
        return;
    }

    const filename = argv[2].split("/").pop();
    const filepath = path.join(__dirname, argv[2]);

    const client = new MongoClient("mongodb://mongo1:27017,mongo2:27018,mongo3:27019/?replicaSet=mongo-cluster-replicaset");
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("cluster-poc");
    const bucket = new mongodb.GridFSBucket(db, { bucketName: "cluster-poc-bucket" });

    let totalBytes = 0;
    let { size } = fs.statSync(filepath);

    stream.pipeline(
        fs.createReadStream(filepath),
        new stream.Transform({
            async transform(chunk, encoding, callback) {
                totalBytes += chunk.length;
                console.log(`Upoaded ${totalBytes} of ${size} bytes (${((totalBytes / size) * 100).toFixed(2)}%)`);
                await sleep(10)
                this.push(chunk);
                callback();
            },
        }),
        bucket.openUploadStream(filename, {
            chunkSizeBytes: 1048576,
            metadata: { field: "owner", value: "harsh" },
        }),
        (err) => {
            if (err) console.log(err);
        }
    ).on("close", () => {
        console.log("Uploaded ", filename)
        process.exit(0)
    });
}

main();
