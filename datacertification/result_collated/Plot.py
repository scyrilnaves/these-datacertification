import matplotlib
import matplotlib.pyplot as plt
import matplotlib.pyplot as pltfinal
import numpy as np

# Start Plot of Clique Geth
Nodes_5 = [196, 460, 880, 1200, 1500, 1500]
Nodes_10 = [194, 468, 830, 1400, 1400, 1400]
Nodes_20 = [193, 460, 820, 1200, 1200, 1200]
Nodes_25 = [193, 460, 770, 1100, 1100, 1100]
Input = ["200", "500", "1000", "1500", "2000", "3000"]

fig, ax = plt.subplots()
plt.title("Clique Consensus")
plt.xlabel("Input TPS")
plt.ylabel("Output TPS")
ax.plot(Input, Nodes_5, label="5 Nodes")
ax.plot(Input, Nodes_10, label="10 Nodes")
ax.plot(Input, Nodes_20, label="20 Nodes")
ax.plot(Input, Nodes_25, label="25 Nodes")
ax.legend()

plt.savefig('clique.png')
plt.savefig('clique.svg')
# End Plot of Clique Geth
################################################################################################
# Start Plot of IBFT Besu
Nodes_4 = [196, 450, 225, 215]
Nodes_5 = [197, 428, 220, 210]
Nodes_7 = [197, 360, 210, 208]
Nodes_8 = [197, 260, 207, 210]
Nodes_10 = [196, 235, 205, 208]
Nodes_20 = [193, 230, 190, 190]
Nodes_25 = [193, 220, 182, 160]
Input = ["200", "500", "1000", "1500"]

fig, ax = plt.subplots()
plt.title("IBFT Consensus")
plt.xlabel("Input TPS")
plt.ylabel("Output TPS")
ax.plot(Input, Nodes_4, label="4 Nodes")
ax.plot(Input, Nodes_5, label="5 Nodes")
ax.plot(Input, Nodes_7, label="7 Nodes")
ax.plot(Input, Nodes_8, label="8 Nodes")
ax.plot(Input, Nodes_10, label="10 Nodes")
ax.plot(Input, Nodes_20, label="20 Nodes")
ax.plot(Input, Nodes_25, label="25 Nodes")
ax.legend()

plt.savefig('IBFT.png')
plt.savefig('IBFT.svg')
# End Plot of IBFT Besu
################################################################################################
# Start Plot of QBFT Besu
Nodes_5 = [197, 465, 220, 220]
Nodes_10 = [196, 463, 215, 215]
Nodes_15 = [196, 400, 214, 212]
Nodes_17 = [196, 380, 213, 211]
Nodes_19 = [196, 290, 213, 210]
Nodes_20 = [196, 270, 212, 210]
Nodes_25 = [196, 250, 210, 205]
Input = ["200", "500", "1000", "1500"]

fig, ax = plt.subplots()
plt.title("QBFT Consensus")
plt.xlabel("Input TPS")
plt.ylabel("Output TPS")
ax.plot(Input, Nodes_5, label="5 Nodes")
ax.plot(Input, Nodes_10, label="10 Nodes")
ax.plot(Input, Nodes_15, label="15 Nodes")
ax.plot(Input, Nodes_17, label="17 Nodes")
ax.plot(Input, Nodes_19, label="19 Nodes")
ax.plot(Input, Nodes_20, label="20 Nodes")
ax.plot(Input, Nodes_25, label="25 Nodes")
ax.legend()

plt.savefig('QBFT.png')
plt.savefig('QBFT.svg')
# End Plot of QBFT Besu
################################################################################################
# Start Plot of ICBC Measurements
Nodes_3 = [1100, 300]
Nodes_7 = [800, 430]
Nodes_11 = [750, 390]
Nodes_15 = [700, 370]
Input = ["Clique_1500", "IBFT_1500"]

fig, ax = plt.subplots()
plt.title("Azure Test Results")
plt.xlabel("Input TPS")
plt.ylabel("Output TPS")
ax.plot(Input, Nodes_3, label="3 Nodes")
ax.plot(Input, Nodes_7, label="7 Nodes")
ax.plot(Input, Nodes_11, label="11 Nodes")
ax.plot(Input, Nodes_15, label="15 Nodes")
ax.legend()

plt.savefig('ICBC.png')
plt.savefig('ICBC.svg')


################################################################################################
# Start Plot of Sawtooth PBFT
Nodes_4 = [5, 10, 14, 17, 20, 20, 21, 25]
Nodes_6 = [5, 10, 14, 17, 19, 19, 21, 20]
Nodes_12 = [5, 10, 14, 14, 14, 13, 13, 13]
Nodes_18 = [5, 10, 13, 10, 9, 9, 14, 13]
Nodes_24 = [5, 8, 10, 5, 15, 11, 17, 13]
Input = ["5", "10", "15", "20", "25", "30", "40", "50"]

fig, ax = plt.subplots()
plt.title("PBFT Consensus")
plt.xlabel("Input TPS")
plt.ylabel("Output TPS")
ax.plot(Input, Nodes_4, label="4 Nodes")
ax.plot(Input, Nodes_6, label="6 Nodes")
ax.plot(Input, Nodes_12, label="12 Nodes")
ax.plot(Input, Nodes_18, label="18 Nodes")
ax.plot(Input, Nodes_24, label="24 Nodes")

ax.legend()

plt.savefig('PBFT.png')
plt.savefig('PBFT.svg')
# End Plot of PBFT
##################################################################
