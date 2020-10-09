#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Oct  8 20:57:10 2020

@author: leovsf
"""

import pandas as pd

df = pd.read_csv('caso.csv')
niteroi = df.loc[df['city'] == 'Niterói']
niteroi = niteroi.drop(niteroi[['state', 'place_type', 'is_last', 'estimated_population_2019', 'order_for_place', 'city_ibge_code', 'city']], axis=1)
niteroi = niteroi.iloc[::-1]
niteroi.to_csv('niteroi_series.csv', index=False)