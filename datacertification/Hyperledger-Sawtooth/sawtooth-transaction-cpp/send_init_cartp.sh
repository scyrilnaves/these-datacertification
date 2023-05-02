#!/bin/bash

apiURL="apirest.unice.cust.tasfrance.com:80"

# tnxprivatekey=$(<tests_keys/driver.priv)
# tnxpublickey=$(<tests_keys/driver.pub)
# batchprivatekey=$(<tests_keys/car.priv)
# batchpublickey=$(<tests_keys/car.pub)

# ./transaction  --mode cartp \
#         --tnxprivatekey $tnxprivatekey \
#         --tnxpublickey $tnxpublickey \
#         --batchprivatekey $batchprivatekey \
#         --batchpublickey $batchpublickey \
#         --cmd crash \
#         --accident_ID "QmfM2r8seH2GiRaC4esTjeraXEachRt8ZsSeGaWTPLyMoG" \
#         --signature "88e19d9043e47b7318fbe2cf83e020da8e98f969b8d47ef50227f659b0d805f832dac88dbfb7639cc0019b6198fa439ed19e1f07de892e75eef5261c74b7e9b6" \
#         --dataPublicKey "Bxm4djh5ap9zBb9YyYHzdw5j6v8IOaHn" \
#         --url "http://$apiURL/batches"


# factory is: 02a47084f6228bf7eb91e1628140f5b717cad1d1166b4ad7665e88204e74f92e5c

tnxprivatekey="10e796e4d43d51364abd0279975a889049e255961ad0f00b86840977f8273679"
tnxpublickey="032f2ecbb471f6f487b82c915f5bf26c6f0c7c5cc412b45d25ad232a943b11b9d4"
batchprivatekey="276fa81ae93014df52e8fdcc5912349aabfbcf60df3fb40dc1234500dd20bf3b"
batchpublickey="02d064de8ea6280c99cb909d31f18c37f371a1a29e37dc43ca96525bf874f9c879"

# init new_car
./transaction --mode cartp \
        --tnxprivatekey $batchprivatekey \
        --tnxpublickey $batchpublickey \
        --batchprivatekey 4540473db04512cdfb6decaa5cc14c2442d3d3c742b47bf19e0395c07aeb8d20 \
        --batchpublickey 02a47084f6228bf7eb91e1628140f5b717cad1d1166b4ad7665e88204e74f92e5c \
        --cmd new_car \
        --car_brand "Kittmobile" \
        --car_type "Danger" \
        --car_licence "X1-102-10V" \
        --url "http://$apiURL/batches"
        
# init new_owner
./transaction --mode cartp \
        --tnxprivatekey $tnxprivatekey \
        --tnxpublickey $tnxpublickey \
        --batchprivatekey $batchprivatekey \
        --batchpublickey $batchpublickey \
        --cmd new_owner \
        --owner_lastname "Pikachou" \
        --owner_name "Mr. V" \
        --owner_address "1 av Atlantis" \
        --owner_country "France" \
        --url "http://$apiURL/batches"

