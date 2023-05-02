import requests
import json

org_url="10.1.0.222"
new_url="127.0.0.1:8080"
i=0
i2=0
i3=0
# f = open("tmp.txt", "r")
with open("tmp.txt", "r") as f:
	for line in f:
		# try:
		response = requests.get(line.strip())
		# response = requests.get(line.replace(org_url, new_url).strip())
		response = json.loads(response.text)
		if response["data"][0]["status"] == "COMMITTED":
			i+=1
		elif response["data"][0]["status"] == "PENDING":
			i2+=1
		else:
			i3+=1
			print(response)
		# except Exception as e:
    	# 	print( "Error: \n %s" % str(e) )
	print("comitted", i)
	print("pending", i2)
	print("error",i3)
	print("total",i+i2+i3)




# #import multiprocessing
# from joblib import Parallel, delayed

# num_cores = 8 #multiprocessing.cpu_count()
# myList=[]
# with open("tmp.txt", "r") as f:
# 	for line in f:
# 		myList.append(line)
# inputs = myList

# def my_function(i):
#     return i * i
# processed_list = Parallel(n_jobs=num_cores)(delayed(my_function(i,parameters) 
#                                                         for i in inputs)