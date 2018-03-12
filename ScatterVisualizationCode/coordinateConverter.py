# This script contains code from this website:
# THANKS TO: https://thomasv.nl/2014/03/rd-naar-gps/
# Formules voor benadering zijn gebaseerd op http://www.dekoepel.nl/pdf/Transformatieformules.pdf
# Bovenstaande link werkt helaas niet meer, daar Stiching de Koepel opgeheven is. Backup link: http://media.thomasv.nl/2015/07/Transformatieformules.pdf

import csv

filename = "DistrictWithNameCode.csv"
save_filename = "convertedDistrictWithNameCode.csv"
first_coordinate_index = 2;

class RDWGSConverter:

	X0      = 155000
	Y0      = 463000
	phi0    = 52.15517440
	lam0    = 5.38720621

	def fromRdToWgs( self, coords ):

		Kp = [0,2,0,2,0,2,1,4,2,4,1]
		Kq = [1,0,2,1,3,2,0,0,3,1,1]
		Kpq = [3235.65389,-32.58297,-0.24750,-0.84978,-0.06550,-0.01709,-0.00738,0.00530,-0.00039,0.00033,-0.00012]

		Lp = [1,1,1,3,1,3,0,3,1,0,2,5]
		Lq = [0,1,2,0,3,1,1,2,4,2,0,0]
		Lpq = [5260.52916,105.94684,2.45656,-0.81885,0.05594,-0.05607,0.01199,-0.00256,0.00128,0.00022,-0.00022,0.00026]

		dX = 1E-5 * ( coords[0] - self.X0 )
		dY = 1E-5 * ( coords[1] - self.Y0 )
		
		phi = 0
		lam = 0

		for k in range(len(Kpq)):
			phi = phi + ( Kpq[k] * dX**Kp[k] * dY**Kq[k] )
		phi = self.phi0 + phi / 3600

		for l in range(len(Lpq)):
			lam = lam + ( Lpq[l] * dX**Lp[l] * dY**Lq[l] )
		lam = self.lam0 + lam / 3600

		return [phi,lam]

	def fromWgsToRd( self, coords ):
		
		Rp = [0,1,2,0,1,3,1,0,2]
		Rq = [1,1,1,3,0,1,3,2,3]
		Rpq = [190094.945,-11832.228,-114.221,-32.391,-0.705,-2.340,-0.608,-0.008,0.148]

		Sp = [1,0,2,1,3,0,2,1,0,1]
		Sq = [0,2,0,2,0,1,2,1,4,4]
		Spq = [309056.544,3638.893,73.077,-157.984,59.788,0.433,-6.439,-0.032,0.092,-0.054]

		dPhi = 0.36 * ( coords[0] - self.phi0 )
		dLam = 0.36 * ( coords[1] - self.lam0 )

		X = 0
		Y = 0

		for r in range( len( Rpq ) ):
			X = X + ( Rpq[r] * dPhi**Rp[r] * dLam**Rq[r] ) 
		X = self.X0 + X

		for s in range( len( Spq ) ):
			Y = Y + ( Spq[s] * dPhi**Sp[s] * dLam**Sq[s] )
		Y = self.Y0 + Y

		return [X,Y]

def main():
	# Rotterdam Centraal Station
	coords = [91819, 437802]
	coords = [121342.602522878, 487318.149391012]
	conv = RDWGSConverter()
	wgsCoords = conv.fromRdToWgs( coords )
	newCoords = conv.fromWgsToRd( wgsCoords )
	# Laat de coordinaten voor conversie en de coordinaten na dubbele conversie op het scherm zien
	# om te bewijzen dat het een benadering betreft. Tot slot worden ook nog de WGS coordinaten weergegeven.
	#print( coords, newCoords, wgsCoords )
	
	data_array = []
	
	#USE PYTHON 2
	with open(filename, 'r') as csvfile:
		dataReader = csv.reader(csvfile, delimiter=',', quotechar='\t')
		for row in dataReader:
			#data_array.append(', '.join(row))
			data_array.append(row)
			#print(', '.join(row))
	
	#problem givers
	#print(data_array[92][1])
	#print(data_array[92][2])
	
	rowCounter = 0
	
	#loop over all rows
	for row in data_array:
		rowCounter += 1
		rowOffset = 0
		#loop only over the coordinate couples
		for coordinate_index in xrange(first_coordinate_index, len(row), 2):
			
			#when shifting because of commas in name make sure to don't
			#go over array size
			if(coordinate_index + rowOffset < len(row)):
				#if not row[coordinate_index].replace(".", "").isdigit():
				while(not row[coordinate_index + rowOffset].replace(".", "").isdigit()):
					rowOffset += 1
				
				latitude = row[coordinate_index + rowOffset]
				longitude = row[coordinate_index+ 1 + rowOffset]
				#print("ri: "+ str(rowCounter) + " ci: " + str(coordinate_index))
				
				#print(conv.fromRdToWgs([float(latitude), float(longitude)]))
				GPS_coords = conv.fromRdToWgs([float(latitude), float(longitude)])
				row[coordinate_index] = GPS_coords[0]
				row[coordinate_index+1] = GPS_coords[1]
	
	print("writing array.... ")
	
	#save the complete array
	with open(save_filename, "w+") as my_csv:
		csvWriter = csv.writer(my_csv, delimiter=',')
		csvWriter.writerows(data_array)

if __name__ == "__main__":
	main()