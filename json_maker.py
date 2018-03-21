from os import walk
from os.path import join

header = "{\"Areas\": [{"
tail = "]}]}"

def is_last(i, last):
	if i < last:
		return ","
	else:
		return ""

# x = []
# y = []
print(header)

info = dict()
datasets = []
for root, dirs, files in walk('data/2016'):
	for dataset in files:
		datasets.append(dataset[:-4])
		with open(join(root, dataset), 'r') as data:
			for line in data.readlines()[1:]:
				line = line.split(',')
				try:
					info[line[0]][dataset[:-4]] = (line[1]).replace("\n", "")
				except:
					info[line[0]] = {dataset[:-4]: (line[1]).replace("\n", "")}

etnicity_info = dict()
ethinicities = []
for root, dirs, files in walk('data/ethinicity'):
	for dataset in files:
		ethinicities.append(dataset[:-4])
		with open(join(root, dataset), 'r') as data:
			for line in data.readlines()[1:]:
				line = line.split(',')
				try:
					etnicity_info[line[0]][dataset[:-4]] = (line[1]).replace("\n", "")
				except:
					etnicity_info[line[0]] = {dataset[:-4]: (line[1]).replace("\n", "")}

# with open("convertedNeighborhoodWithNameCode.csv", 'r') as coords:
# with open("convertedDistrictWithNameCode.csv", 'r') as coords:
with open("amsterdam.csv", 'r') as coords:
		first = True
		# j = 1
		for line in coords.readlines():
			if not first:
				print("]},{")
			else:
				first = False
			all_coords = line[:-1].split(',')
			# print("\"name\": \"district "+str(j)+"\",")
			print("\"area_name\": \""+all_coords[0]+"\",")
			print("\"area_code\": \""+all_coords[1]+"\",")

			for dataset in datasets:
				try:
					print("\"" + dataset + "\": \""+info[all_coords[1]][dataset]+"\",")
				except:
					print("\"" + dataset + "\": \"\",")
			# 	print("\"Population_density_2016\": \""+info[all_coords[1]]+"\",")

			print("\"ethinicities\":[{")
			length = len(ethinicities)
			for i, ethinicity in enumerate(ethinicities):
				try:
					print("\"" + ethinicity + "\": \""+etnicity_info[all_coords[1]][ethinicity]+"\"" + is_last(i+1, length))
				except:
					print("\"" + ethinicity + "\": \"\"" + is_last(i+1, length))
			print("}],")



			print("\"points\":[")
			all_coords = all_coords[2:]
			length = len(all_coords)
			i = 0
			while i < length:
				# x.append(all_coords[i])
				# y.append(all_coords[i+1])
				print("{\"x\":" + str(all_coords[i+1]) + ", \"y\":" + all_coords[i]  + "}" + is_last(i+2, length))
				i += 2
			# j+=1

print(tail)

# print(min(x), max(x))
# print(min(y), max(y))