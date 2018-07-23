import pandas as pd
filePath = "Resources\\purchase_data.csv"
gameData = pd.read_csv(filePath)

#Number of Players
totPlayers = pd.DataFrame({"Total Players": gameData["SN"].nunique()}, index=[0])
print(totPlayers)

#Number of unique items
items = gameData["Item ID"].nunique()
avgPrice = "${:.2f}".format(gameData["Price"].mean())
purchases = gameData["Purchase ID"].nunique()
totRev = "${:,.2f}".format(gameData["Price"].sum())
purchAnalysis = {"Number of Unique Items": items, "Average Price": avgPrice, "Number of Purchases": purchases, "Total Revenue": totRev}
pa_df = pd.DataFrame(data=purchAnalysis, index=[0])
print(pa_df)

#Gender Demographics
gender = gameData.drop_duplicates("SN")
males = gender["Gender"][gender.Gender == "Male"].count()
females = gender["Gender"][gender.Gender == "Female"].count()
other = gender["Gender"][gender.Gender == "Other / Non-Disclosed"].count()
total = males + females + other
genderDemo = {"Percentage of Players": ["{:.2f}%".format((males/total)*100), "{:.2f}%".format((females/total)*100), "{:.2f}%".format((other/total)*100)], "Total Count":[males, females, other]}
genderDemo = pd.DataFrame(genderDemo, index=["Male", "Female", "Other / Non-Disclosed"])
print(genderDemo)


#Purchasing Analysis (Gender)
malePurch = gameData["Gender"][gameData.Gender == "Male"].count()
mPrice = gameData["Price"][gameData.Gender == "Male"].mean()
mSum = gameData["Price"][gameData.Gender == "Male"].sum()
femalePurch = gameData["Gender"][gameData.Gender == "Female"].count()
fPrice = gameData["Price"][gameData.Gender == "Female"].mean()
fSum = gameData["Price"][gameData.Gender == "Female"].sum()
otherPurch = gameData["Gender"][gameData.Gender == "Other / Non-Disclosed"].count()
oPrice = gameData["Price"][gameData.Gender == "Other / Non-Disclosed"].mean()
oSum = gameData["Price"][gameData.Gender == "Other / Non-Disclosed"].sum()
genderPurch = {"Gender": ["Female", "Male", "Other / Non-Disclosed"], "Purchase Count": [femalePurch, malePurch, otherPurch], "Average Purchase Price": ["${:.2f}".format(fPrice), "${:.2f}".format(mPrice), "${:.2f}".format(oPrice)], "Total Purchase Value": ["${:.2f}".format(fSum), "${:.2f}".format(mSum), "${:.2f}".format(oSum)], "Avg Purchase Total per Person": ["${:.2f}".format((fSum/femalePurch)), "${:.2f}".format((mSum/malePurch)), "${:.2f}".format((oSum/otherPurch))]}
genderPurch = pd.DataFrame(genderPurch)
genderPurch.set_index("Gender")
print(genderPurch)

#Age Demographics
age_bins = [0, 9.90, 14.90, 19.90, 24.90, 29.90, 34.90, 39.90, 99999]
group_names = ["<10", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40+"]
sum_df = gameData.drop_duplicates("SN")
temp_df = pd.DataFrame({"Age Groups": pd.cut(gameData["Age"], age_bins, labels=group_names)})
SN = sum_df.join(temp_df).groupby("Age Groups").count()["SN"]
grp = ["{:.2f}%".format(x / SN.sum() * 100) for x in SN]
ageDemo = {"Percentage of Players": grp, "Total Count": SN}
ageDemo = pd.DataFrame(ageDemo, index=group_names)
print(ageDemo)

temp_df = pd.DataFrame({"Age Groups": pd.cut(gameData["Age"], age_bins, labels=group_names)})
purchCount = gameData.join(temp_df).groupby("Age Groups").count()["Price"]
avgPurchase = gameData.join(temp_df).groupby("Age Groups").mean()["Price"]
totalPurchase = gameData.join(temp_df).groupby("Age Groups").sum()["Price"]
purchAnalysisAge = pd.DataFrame({"Purchase Count": purchCount,
                                 "Average Purchase Price": avgPurchase,
                                "Total Purchase Value": totalPurchase,
                                "Average Purchase Total per Person": avgPurchase}, index=group_names)
purchAnalysisAge["Average Purchase Price"] = purchAnalysisAge["Average Purchase Price"].apply("${:.2f}".format)
purchAnalysisAge["Total Purchase Value"] = purchAnalysisAge["Total Purchase Value"].apply("${:.2f}".format)
purchAnalysisAge["Average Purchase Total per Person"] = purchAnalysisAge["Average Purchase Total per Person"].apply("${:.2f}".format)
print(purchAnalysisAge)

screenNames = gameData.groupby("SN").count()
screenNames = screenNames.drop(columns=["Age", "Gender", "Item ID", "Item Name", "Price"])
tpv = gameData.groupby("SN").sum()
tpv = tpv.drop(columns=["Purchase ID", "Age", "Item ID"])
screenNames["Average Purchase Price"] = ["${:.2f}".format(x/y) for x, y in zip(tpv["Price"], screenNames["Purchase ID"])]
playerPurchases = pd.merge(screenNames, tpv, on="SN")
playerPurchases = playerPurchases.sort_values(by="Price", ascending=False)
playerPurchases = playerPurchases.rename(columns={"Price": "Total Purchase Value"})
playerPurchases["Total Purchase Value"] = playerPurchases["Total Purchase Value"].map("${:.2f}".format)
print(playerPurchases.head())

totalPurchaseValue = gameData.groupby(["Item ID", "Item Name"])["Price"].sum()
purchaseCount = gameData.groupby(["Item ID", "Item Name"])["Purchase ID"].count()
itemPrice = gameData.groupby(["Item ID", "Item Name"])["Price"].mean()
popularItems = pd.DataFrame({"Purchase Count": purchaseCount, "Item Price": itemPrice, "Total Purchase Value":totalPurchaseValue})
profitableItems = popularItems.copy()
popularItems["Item Price"] = popularItems["Item Price"].map("${:.2f}".format)
popularItems["Total Purchase Value"] = popularItems["Total Purchase Value"].map("${:.2f}".format)
print(popularItems.sort_values(by="Purchase Count", ascending=False).head())

profitableItems = profitableItems.sort_values(by="Total Purchase Value", ascending=False)
profitableItems["Item Price"] = profitableItems["Item Price"].map("${:.2f}".format)
profitableItems["Total Purchase Value"] = profitableItems["Total Purchase Value"].map("${:.2f}".format)
print(profitableItems.head())
