import csv
import array
trkChange = array.array('i')
incValue = 0
decValue = 0
avgChange = 0
with open("budget_data.csv", 'r') as data:
    formData = csv.reader(data)
    headers = next(formData)
    count = 0
    totalRev = 0
    for row in formData:
        totalRev += int(row[1])
        if count != 0:
            trkChange.append((int(lastrow)-int(row[1]))*-1)
            if (int(lastrow)-int(row[1]))*-1 > incValue:
                incValue = (int(lastrow)-int(row[1]))*-1
                grtInc = row[0]
            if (int(lastrow)-int(row[1]))*-1 < decValue:
                decValue = (int(lastrow)-int(row[1]))*-1
                grtDec = row[0]
        lastrow = row[1]
        count += 1
for nums in trkChange:
    avgChange +=nums
avgChange = avgChange/len(trkChange)
summary = ("Financial Analysis\n" + 
"----------------------------\n" + 
"Total Months: " + str(count) + "\n" + 
"Total: $" + str(totalRev) + "\n" + 
"Average Change: $" + "{:.2f}".format(avgChange) + "\n" + 
"Greatest Increase in Profits: " + grtInc + " ($" + str(incValue) + ")\n" + 
"Greatest Decrease in Profits: " + grtDec + " ($" + str(decValue) + ")")
print(summary)
with open("Analysis.txt", 'w') as textFile:
    textFile.write(summary)