import csv
import array

count = 0
candidates = []
votes = array.array('i')
with open("election_data.csv", 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)
    for rows in csvreader:
        found = False
        count += 1
        minicount = 0
        for names in candidates:
            if names == rows[2]:
                found = True
                votes[minicount] += 1
            minicount += 1
        if found == False:
            candidates.append(rows[2])
            votes.append(1)
results = ("Election Results\n" + 
"-------------------------\n" + 
"Total Votes: " + str(count) + "\n" + 
"-------------------------\n" + 
candidates[0] + ": " + "{:.3f}".format((votes[0]/count)*100) + "% (" + str(votes[0]) + ")\n" + 
candidates[1] + ": " + "{:.3f}".format((votes[1]/count)*100) + "% (" + str(votes[1]) + ")\n" +
candidates[2] + ": " + "{:.3f}".format((votes[2]/count)*100) + "% (" + str(votes[2]) + ")\n" +
candidates[3] + ": " + "{:.3f}".format((votes[3]/count)*100) + "% (" + str(votes[3]) + ")\n" +
"-------------------------\n" + 
"Winner: " + candidates[0] +  "\n" + 
"-------------------------")
print(results)
with open("Results.txt", 'w') as txtFile:
    txtFile.write(results)