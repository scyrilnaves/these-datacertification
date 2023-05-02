import matplotlib
import matplotlib.pyplot as plt
import numpy as np


################################################################################################
# Start Plot of Conclusion
# Plot the max tps achieve occluding input TPS (it may be procesing bottlenecks)
# PBFT_data = [197, 465, 220, 220]
Clique_data = np.array([None, 1500/1500, None, 1300 /
                        1500, None, None, 1200/1500, None, 1100/1500]).astype(np.double)
Clique_ad = np.isfinite(Clique_data)
IBFT_data = [np.nan, 0.99, np.nan, 235/430,
             np.nan, np.nan, 230/430, np.nan, 220/430]
IBFT_norm = np.ma.masked_where(IBFT_data == np.nan, IBFT_data)
print(Clique_ad)

QBFT_data = [np.nan, 0.98, np.nan, 460/465,
             np.nan, np.nan, 270/465, np.nan, 250/465]
QBFT_norm = np.ma.masked_where(QBFT_data == np.nan, QBFT_data)
PBFT_data = [1, 21/25, 14/25, 14/25, 17/25]
PBFT_norm = np.ma.masked_where(PBFT_data == np.nan, PBFT_data)
Nodes = ["5", "10", "20", "25"]
Nodes_pbft = ["4", "6", "12", "18", "24"]
Nodes_all = ["4", "5", "6", "10", "12", "18", "20", "24", "25"]
# plt.subplot(212)
fig, ax = plt.subplots()
plt.title("BFT Consensus Behaviour")
plt.xlabel("No of Nodes")
plt.ylabel("Output TPS")

plt.plot(Nodes_all[Clique_ad], Clique_data[Clique_ad], 'ko-',
         linestyle="-", color='red', label="Clique Consensus")
# plt.plot(Nodes_all, IBFT_norm, marker='.', markersize=10,
# color='green', label="IBFT Consensus")
# plt.plot(Nodes_all, QBFT_norm, marker='.', markersize=10,
# color='red', label="QBFT Consensus")
# plt.plot(Nodes_all, PBFT_norm, marker='.', markersize=10,
# color='orange', label="PBFT Consensus")

# box = ax.get_position()
# ax.set_position([box.x0, box.y0, box.width * 0.7, box.height])
# plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))
# plt.legend(loc=(0.6, 0.2))
plt.legend()
plt.savefig('Conclusion.png')
plt.savefig('Conclusion.svg')
################################################################################################
