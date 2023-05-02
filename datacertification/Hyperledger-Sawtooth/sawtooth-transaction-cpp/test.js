var async = require("async");
const fs = require('fs');
var exec = require('child_process').exec;

const verbose = false;
const nb_batch_parallele = parseInt(process.argv[2]);
const waiting_time = parseFloat(process.argv[3]) * 1000;
const limit = parseInt(process.argv[4]);
const do_init = process.argv[5] == "True" ? true : false; //do the car and owner init ?
const do_send = process.argv[6] == "True" ? true : false; //do the car and owner init ?

const init_limit = 500;

// const apiURL = "10.1.0.222:8080";
const apiURL = "apirest.unice.cust.tasfrance.com:80";

const factory_keys = {
    'priv': "4540473db04512cdfb6decaa5cc14c2442d3d3c742b47bf19e0395c07aeb8d20",
    'pub': "02a47084f6228bf7eb91e1628140f5b717cad1d1166b4ad7665e88204e74f92e5c",
}

// cmd for gen keys in docker sawtooth shell
//for i in `seq 1 1000`; do sawtooth keygen --force -q && printf "{\n\"priv\":\"" && cat /root/.sawtooth/keys/root.priv | tr -d '\n' && printf "\",\n\"pub\":\"" && cat /root/.sawtooth/keys/root.pub | tr -d '\n' && printf "\"\n},\n" ; done
const cars_keys = require("./cars_keys.json");
const drivers_keys = require("./drivers_keys.json");

// const tnxprivatekey = "10e796e4d43d51364abd0279975a889049e255961ad0f00b86840977f8273679";
// const tnxpublickey = "032f2ecbb471f6f487b82c915f5bf26c6f0c7c5cc412b45d25ad232a943b11b9d4";
// const batchprivatekey = "276fa81ae93014df52e8fdcc5912349aabfbcf60df3fb40dc1234500dd20bf3b";
// const batchpublickey = "02d064de8ea6280c99cb909d31f18c37f371a1a29e37dc43ca96525bf874f9c879";

var sig_array = fs.readFileSync('signatures.sig').toString().split("\n");
var results = [];

console.log("***** CONFIG *****")
console.log("nb_batch_parallele", nb_batch_parallele)
console.log("waiting_time", waiting_time)
console.log("limit", limit)
console.log("Load config in nodejs => ok")

function get_rnd_index(items) {
    return Math.floor(Math.random() * items.length);
}

function extractAllText(str) {
    const re = /"(.*?)"/g;
    const result = [];
    let current;
    while (current = re.exec(str)) {
        result.push(current.pop());
    }
    return result.length > 0
        ? result
        : [str];
}

function wait(milleseconds) {
    return new Promise(resolve => setTimeout(resolve, milleseconds))
}

async function send(sig_array, next) {
    var total = 0;
    var total_exit = 0;
    var total_success = 0;
    var total_error = 0;
    var total_network_error = 0;
    var i = 0;
    var p_list = {};
    for (sig of sig_array) {
        // console.log(sig)
        (function (i, total) {
            var tmp_index = parseInt(i % init_limit) //get_rnd_index(cars_keys);
            var cmd = `./transaction --mode cartp \
            --tnxprivatekey ${drivers_keys[tmp_index].priv} \
            --tnxpublickey ${drivers_keys[tmp_index].pub} \
            --batchprivatekey ${cars_keys[tmp_index].priv} \
            --batchpublickey ${cars_keys[tmp_index].pub} \
            --cmd crash \
            --accident_ID QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG \
            --signature ${sig} \
            --dataPublicKey Bxm4djh5ap9zBb9YyYHzdw5j6v8IOaHn \
            --url http://${apiURL}/batches`;
            //console.log(cmd)
            var child = exec(cmd);
            //console.log(total, "start")

            // Add the child process to the list for tracking
            p_list[i] = { process: child, content: "" };

            // Listen for any response:
            child.stdout.on('data', function (data) {
                //console.log(child.pid, data);
                p_list[i].content += data;
                var tmp = extractAllText(data);
                if (tmp.length > 1 && data.indexOf("\"link\"") != -1) {
                    results.push(tmp[1])
                    if (verbose)
                        console.log(total, "=> OK");
                    total_success += 1;
                } else if (tmp.length > 1 && data.indexOf("\"link\"") == -1) {
                    if (verbose)
                        console.log(total, "=> Error");
                    total_error += 1;
                } else if (data.indexOf("Gateway") != -1) { //for 504 & 502 errors
                    if (verbose)
                        console.log(total, "=> Error");
                    total_network_error += 1;
                }
            });

            // Listen for any errors:
            // child.stderr.on('data', function (data) {
            //     console.log(child.pid, data);
            //     p_list[i].content += data;
            // });

            // Listen if the process closed
            child.on('close', function (exit_code) {
                total_exit += 1;
                //console.log(total_exit, "exit")
                if (exit_code != 0)
                    console.log('Closed before stop: Closing code: ', exit_code);
            });
        })(i, total)

        i += 1;
        total += 1;

        if (total >= limit) {
            //program should stop
            if (verbose)
                console.log("Waiting all process exit")
            while (total_exit < total) {
                await wait(500)
                process.stdout.write("\r .");
            }
            if (verbose)
                console.log("Finished nodejs")
            fs.writeFileSync("tmp.txt", results.join("\n"), { encoding: 'utf8', flag: 'w' })
            console.log("total_exit", total_exit)
            console.log("total_success", total_success)
            console.log("total_error", total_error)
            console.log("total_network_error", total_network_error)
            await wait(1000)
            return next()
        }

        if (i == nb_batch_parallele) {
            if (verbose)
                console.log("Waiting", waiting_time, "ms")
            await wait(waiting_time)
            i = 0;
        }
    }
}


async.series([
    
    //First init blockchain with init_limit cars using one factory
    //Then set the init_limit owners of each car
    //NOTE: index car == index car driver owner

    function (callback) {
        if (!do_init)
            return callback();
        console.log("Sending new cars...")
        var tmp = 0;
        async.eachOfSeries(cars_keys, function (value, key, each_callback) {
            if (tmp < init_limit) {
                tmp += 1;
                //init new_car
                var cmd = `./transaction --mode cartp \
                --tnxprivatekey ${value.priv} \
                --tnxpublickey ${value.pub} \
                --batchprivatekey ${factory_keys.priv} \
                --batchpublickey ${factory_keys.pub} \
                --cmd new_car \
                --car_brand "Kittmobile" \
                --car_type "Danger" \
                --car_licence "X1-102-10V" \
                --url "http://${apiURL}/batches"`;
                var child = exec(cmd);

                // Listen for any response:
                child.stdout.on('data', function (data) {
                    // console.log(data);
                });
                // Listen if the process closed
                child.on('close', function (exit_code) {
                    if (exit_code != 0)
                        console.log('Closed before stop: Closing code: ', exit_code);
                    each_callback();
                    // setTimeout(each_callback, 5);//wait a little because we have 1000 keys 
                });
            } else {
                each_callback()
            }
        }, callback)
    },

    function (callback) {
        if (!do_init)
            return callback();
        console.log("Sending new owners...")
        var tmp = 0;
        async.eachOfSeries(drivers_keys, function (value, key, each_callback) {
            if (tmp < init_limit) {
                tmp += 1;
                //init new_owner
                var cmd = `./transaction --mode cartp \
                --tnxprivatekey ${value.priv} \
                --tnxpublickey ${value.pub} \
                --batchprivatekey ${cars_keys[key].priv} \
                --batchpublickey ${cars_keys[key].pub} \
                --cmd new_owner \
                --owner_lastname "Pikachou" \
                --owner_name "Mr. V" \
                --owner_address "1 av Atlantis" \
                --owner_country "France" \
                --url "http://${apiURL}/batches"`;
                var child = exec(cmd);

                // Listen for any response:
                child.stdout.on('data', function (data) {
                    // console.log(data);
                });
                // Listen if the process closed
                child.on('close', function (exit_code) {
                    if (exit_code != 0)
                        console.log('Closed before stop: Closing code: ', exit_code);
                    each_callback();
                    // setTimeout(each_callback, 5);//wait a little because we have 1000 keys 
                });
            } else {
                each_callback()
            }
        }, callback)
    },

    function (callback) {
        if (!do_init)
            return callback();
        console.log("Wait 20 sec for 1st stabilization...")
        setTimeout(callback, 20000);
    },
    function (callback) {
        if (!do_send)
            return callback();
        console.log("Sending...")
        send(sig_array, callback); //Do the benchmark
    },
    function (callback) {
        process.exit(0);
    }
])

