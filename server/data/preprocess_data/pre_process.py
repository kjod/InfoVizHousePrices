import pandas as pd
import numpy as np

df = pd.read_csv('bbga.csv',sep=';')

def preprocess_year(year=None):
    df1 = df[df['jaar'] == year]
    return df1
# 13, 59, 190, 235,236, 248, 254, 337, 729

year=2016

var = ['BEVDICHT','BEVHHMKIND_P','WWOZ_GEM','ORGROEN_P','ORSPORT_P','VKPARKEEROVERLAST_R',
       'VCRIMIN_I','BHHORECA_1000INW','DLABEL_P']
save_var = ['Population_density','Households_with_children','WOZ_value','surface_green','surface_sports','parking_overload',
            'Crime_index','horeca','energy_label']

var2 = ['BEVSUR_P','BEVANTIL_P','BEVTURK_P','BEVMAROK_P','BEVOVNW_P','BEVWEST_P','BEVAUTOCH_P']


save_var2 = ['Surinamese','Antillean','Turks','Moroccan','Other_non_western','Western','No_migration_background']


def separate_var(data=None,v=None):
    separated_data = data[data['variabele'] == v]
    return separated_data

#DLABEL_P,ORGROEN_P,ORSPORT_P,VCRIMIN_I
data = preprocess_year(year=year)

# for i in range(len(var)):
#
#     temp_df = separate_var(data=data,v=var[i])
#     temp_df = temp_df.drop(['jaar','variabele'], axis=1)
#     temp_df.to_csv('preprocesseddata/'+save_var[i]+'_'+str(year)+'.csv', index=False)



for i in range(len(var2)):

    temp_df = separate_var(data=data,v=var2[i])
    temp_df = temp_df.drop(['jaar','variabele'], axis=1)
    temp_df.to_csv('preprocesseddata/'+save_var2[i]+'_'+str(year)+'.csv', index=False)



