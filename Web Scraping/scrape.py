from splinter import Browser
from bs4 import BeautifulSoup
import time
import pandas as pd

def init_browser():
    executable_path = {"executable_path": "C:\Program Files\chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False)

def marsNews():
    browser = init_browser()
    url = "https://mars.nasa.gov/news/"
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    mars_news = {}
    mars_news["Headline"] = soup.find("div", class_="content_title", attrs="href").get_text()
    mars_news["Body"] = soup.find("div", class_="article_teaser_body").get_text()
    browser.quit()
    return mars_news

def jpl():
    browser = init_browser()
    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url)
    button = browser.find_by_id("full_image")
    button.click()
    nextButton = browser.find_link_by_partial_text("more info")
    time.sleep(2)
    nextButton.click()
    nextButton = browser.find_link_by_partial_href("largesize")
    nextButton.click()
    featured_image_url = {"Featured": browser.url}
    browser.quit()
    return featured_image_url

def marsWeather():
    browser = init_browser()
    url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    tweets = soup.find_all("p", class_="TweetTextSize")
    count = 0
    for tweet in tweets:
        if tweet.text.find("Sol") > -1:
            mars_weather = {"Weather": tweet.text}
            break
    browser.quit()
    return mars_weather

def marsFacts():
    url = "https://space-facts.com/mars/"
    df = pd.read_html(url, attrs={"id": "tablepress-mars"})
    new_df = df[0]
    return new_df.to_html()

def marsHemispheres():
    hemisphere_image_urls = {}
    hemispheres = ["Cerberus Hemisphere", "Schiaparelli Hemisphere", "Syrtis Major Hemisphere", "Valles Marineris Hemisphere"]
    titleOnly = []
    searchTerms = []
    img_urls = []
    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser = init_browser()
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, "html.parser")
    titles = soup.find_all("h3")
    links = soup.find_all("a", class_="itemLink product-item", attrs="href")
    for title in titles:
        titleOnly.append(title.text)
    for title in titleOnly:
        temp = title.split(" ")
        searchTerms.append(temp[0])
    for term in searchTerms:
        thingToClick = browser.find_link_by_partial_text(term)
        thingToClick.click()
        thingToClick = browser.find_by_text("Sample")
        thingToClick.click()
        img_urls.append(browser.url)
        browser.back
        browser.back
    count = 0
    tempDict = {}
    for hemi, imgurl in zip(hemispheres, img_urls):
        tempTitle = "title" + str(count)
        tempDict.update({tempTitle: hemi, "img_url": imgurl})
        count+=1
    hemisphere_image_urls = tempDict
    browser.quit()
    return hemisphere_image_urls

def scrape():
    mars = {}
    mars.update(marsNews())
    mars.update(jpl())
    mars.update(marsWeather())
    mars.update(marsHemispheres())
    return mars