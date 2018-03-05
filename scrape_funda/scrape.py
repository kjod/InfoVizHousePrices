from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import pandas as pd
import time
from random import randint

browser = webdriver.Chrome('/home/tushar/Downloads/Funda-Scraper-master/chromedriver')

browser.implicitly_wait(15)
wait = WebDriverWait(browser, 30)
urls = [
        'http://www.funda.nl/koop/amsterdam/p',
    ]

data = []

pages = range(1,139)

for url in urls:
	for page in pages:
		browser.get(url+str(page))
        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.search-result-content")))

        for item in browser.find_elements_by_css_selector("div.search-result-content"):
        	print(item)