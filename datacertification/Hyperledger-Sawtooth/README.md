# Hyperledger Sawtooth

Folder containing the files required to deploy Hyperledger Sawtooth in Kubernetes.
## Environment and requirements

- Kubernetes cluster
- Kubectl (A kubernetes Commande Line Tool to manage the cluster)

## How to ?

1 Move to the project directory

```bash
  cd SIM-TAS-Group-tests/Hyperledger-Sawtooth/
```

2 Generate peers keys

```bash
  kubectl apply -f pbft-keys-configmap.yaml
```


## Other info

batches accepted = (QUEUE_MULTIPLIER) * Ravg of published batches
