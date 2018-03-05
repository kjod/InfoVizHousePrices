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

pages = range(1, 2)

for url in urls:
    for page in pages:
        browser.get(url + str(page))
    wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.search-result-content")))

    for item in browser.find_elements_by_css_selector("div.search-result-content"):
        print(item)

        try:
            zipcode1, zipcode2, city = item.find_element_by_css_selector("small.search-result-subtitle").text.split(" ",
                                                                                                                    2)
            zipcode = zipcode1 + " " + zipcode2
            street_name = item.find_element_by_css_selector("h3.search-result-title").text
            street_name = street_name.split('\n')[0]

            house_price = item.find_element_by_css_selector("span.search-result-price").text.lstrip('€ ').rstrip(
                ' k.k,').replace('.', '')

            data.append({
                "street_name":street_name,
                "zipcode":zipcode,
                "house_price":house_price,
            })
        except ValueError:
            pass

    time.sleep(randint(10,15))

browser.close()
df = pd.DataFrame(data)
df.to_csv("AmsterdamFundaPage"+str(min(pages))+'-'+str(max(pages))+".csv",sep=';',encoding='utf-8')
print(len(df))
