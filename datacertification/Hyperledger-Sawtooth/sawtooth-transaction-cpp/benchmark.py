#!/usr/bin/env python3


import subprocess
import datetime
import time
import pathlib
import os
##################### CONFIG #####################
RANCHER_BEARER_TOKEN = os.environ.get('RANCHER_BEARER_TOKEN')
if RANCHER_BEARER_TOKEN == None:
    print("ERROR: Missing RANCHER_BEARER_TOKEN environement variable !")
    quit()

file_sender_log = "sender_log.log"
file_stats_log = "stats_log.log"

do_reboot=True #True/False
do_test_init=True #1/0

# config doc: https://sawtooth.hyperledger.org/docs/pbft/nightly/master/configuring-pbft.html
test_profiles = [
    ############ 5tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "5",
            "js_wait_time": "1"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "5",
            "js_wait_time": "1"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "5",
            "js_wait_time": "1"
        }
    },
    ############### 10tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "5",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "5",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "5",
            "js_wait_time": "0.5"
        }
    },
    ############### 15tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "15",
            "js_wait_time": "1"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "15",
            "js_wait_time": "1"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "15",
            "js_wait_time": "1"
        }
    },
    ############### 20tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "10",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "10",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "10",
            "js_wait_time": "0.5"
        }
    },
    ############### 25tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "25",
            "js_wait_time": "1"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "25",
            "js_wait_time": "1"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "25",
            "js_wait_time": "1"
        }
    },
    ############### 30tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "10",
            "js_wait_time": "0.333"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "10",
            "js_wait_time": "0.333"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "10",
            "js_wait_time": "0.333"
        }
    },
    ############### 40tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "20",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "20",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "20",
            "js_wait_time": "0.5"
        }
    },
    ############### 50tps
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "25",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "25",
            "js_wait_time": "0.5"
        }
    },
    {
        "sender_parameters": {
            "limit": "10000",
            "js_nb_parallele": "25",
            "js_wait_time": "0.5"
        }
    }
]
##################### DEF GENERAL #####################


def log(_str, ts=True, end="\n"):
    now = datetime.datetime.now()
    if ts:
        print("{} | {}".format(now.strftime("%Y-%m-%d %H:%M:%S"), _str), end=end)
        return "{} | {}".format(now.strftime("%Y-%m-%d %H:%M:%S"), _str)
    else:
        print("{}".format(_str), end=end)
        return "{}".format(_str)


def clear_file(filename):
    text_file = open(filename, "w")
    text_file.write("")
    text_file.close()


def append_file(filename, text):
    text_file = open(filename, "a")
    text_file.write(text)
    text_file.close()


def duplicate_file(filename, newfilename):
    filedata = None
    f = open(filename, 'r')
    filedata = f.read()
    f.close()

    f = open(newfilename, 'w')
    f.write(filedata)
    f.close()


def set_file_params(filename, marker, data):
    filedata = None
    f = open(filename, 'r')
    filedata = f.read()
    f.close()

    newdata = filedata.replace(marker, data)

    f = open(filename, 'w')
    f.write(newdata)
    f.close()


##################### DEF RUN SCRIPTS #####################

def start_sender(sender_parameters, test_name):
    log("Start sender")


    if do_test_init:
        log("Do init")

        log("Set init parameters")
        duplicate_file("docker-compose-sender.yaml", "docker-compose-sender.yaml.benchmark")
        log(" CMD: docker-compose -f docker-compose-sender.yaml.benchmark down", ts=False)
        subprocess.check_output(
            ['docker-compose', '-f', 'docker-compose-sender.yaml.benchmark', 'down'], stderr=subprocess.STDOUT)
        params = "{} {} {} {} {}".format(
            sender_parameters["js_nb_parallele"], sender_parameters["js_wait_time"], sender_parameters["limit"], do_test_init, False)
        set_file_params("docker-compose-sender.yaml.benchmark",
                        "<SENDER_TEST_JS_OPTIONS>", params)
        log("params= {}".format(params))

        log("Set init parameters done")

        log("Do init")
        log(" CMD SENDER: docker-compose -f docker-compose-sender.yaml.benchmark up --no-color --quiet-pull sender-js", ts=False)
        subprocess.call(
        ['docker-compose', '-f', 'docker-compose-sender.yaml.benchmark', 'up', '--no-color', '--quiet-pull', 'sender-js'], stderr=subprocess.STDOUT)
        log("Do init done")

    log("Set sender parameters")
    duplicate_file("docker-compose-sender.yaml", "docker-compose-sender.yaml.benchmark")
    log(" CMD: docker-compose -f docker-compose-sender.yaml.benchmark down", ts=False)
    subprocess.check_output(
        ['docker-compose', '-f', 'docker-compose-sender.yaml.benchmark', 'down'], stderr=subprocess.STDOUT)
    params = "{} {} {} {} {}".format(
        sender_parameters["js_nb_parallele"], sender_parameters["js_wait_time"], sender_parameters["limit"], False, True)
    set_file_params("docker-compose-sender.yaml.benchmark",
                    "<SENDER_TEST_JS_OPTIONS>", params)
    log("Set sender parameters done")

    log("Do sender")
    log(" CMD SENDER: docker-compose -f docker-compose-sender.yaml.benchmark up --no-color --quiet-pull sender-js", ts=False)
    subprocess.call(
        ['docker-compose', '-f', 'docker-compose-sender.yaml.benchmark', 'up', '--no-color', '--quiet-pull', 'sender-js'], stderr=subprocess.STDOUT)
    log("Do sender done")

    log("Sleep {} sec for blockchain stabilize".format(1200))
    time.sleep(1200)


def start_stats(test_name):

    log("Start stats")
    working_dir = pathlib.Path(__file__).parent.absolute()
    append_file(file_stats_log, log(""))
    append_file(file_stats_log,
                "\n============= {} ============\n".format(test_name))
    with open(file_stats_log, "a") as f:
        subprocess.call(
            ['python3', 'test_links.py'], cwd=working_dir, stderr=f, stdout=f)
    append_file(file_stats_log,
                "\n============= END {} ============\n".format(test_name))

    # log("Start stats")
    # working_dir = pathlib.Path(__file__).parent.absolute()
    # result = subprocess.check_output(
    #     ['python3', 'test_links.py'], cwd=working_dir, stderr=subprocess.STDOUT)
    # log(result.decode("utf-8"), ts=False)
    # append_file(file_stats_log,
    #             "\n============= {} ============\n".format(test_name))
    # append_file(file_stats_log, result.decode("utf-8"))
    # append_file(file_stats_log,
    #             "\n============= END {} ============\n".format(test_name))
    time.sleep(1)


def reboot_blockchain():
    log("Rebooting blockchain")
    log("Login in rancher")
    working_dir = pathlib.Path(__file__).parent.absolute() / 'rancher-v2.4.10'

    subprocess.call(['bash', 'restart_blockchain.sh', RANCHER_BEARER_TOKEN],
                    cwd=working_dir, stderr=subprocess.STDOUT)

    log("Wainting for blockchain initialization (5min)")
    time.sleep(300)

    log("Rebooting blockchain Finished")

##################### MAIN #####################


def main(profiles):
    log("Start benchmark Hyperledger Sawtooth PBFT consensus")
    nb_profiles = len(profiles)
    log("Found {} benchmarks".format(nb_profiles))

    log("Clear {}".format(file_sender_log))
    clear_file(file_sender_log)
    log("Clear {}".format(file_stats_log))
    clear_file(file_stats_log)

    for i in range(nb_profiles):
        log("Benchmark n°{}".format(i))

        if do_reboot:
            reboot_blockchain()

        start_sender(profiles[i]["sender_parameters"], "TEST n°{}".format(i))

        # start_stats("TEST n°{}".format(i))

    log("Finishing")

    log("Done {} benchmarks".format(nb_profiles))
    os.system('BEEP=/usr/share/sounds/freedesktop/stereo/complete.oga paplay $BEEP && paplay $BEEP && paplay $BEEP')


# main(test_profiles)
try:
    main(test_profiles)
except Exception as e:
    print("Error: \n %s" % str(e))
