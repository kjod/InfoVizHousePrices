import pandas as pd
import numpy as np

bag_df = pd.read_csv("BAG_CLEANED.csv", sep=';')
brk_df = pd.read_csv("BRK_OBJECTEN_CLEANED.csv", sep=';')

new_df = pd.merge(bag_df, brk_df, on='brk_kot_id')
new_df['kot_koopsom'].replace('', np.nan, inplace=True)
null_df = new_df.kot_koopsom.notnull()
new_df = new_df[null_df]
new_df.to_csv("combined_bag_brk.csv", sep=",",  index=False, encoding='utf-8')