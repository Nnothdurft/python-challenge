import csv
import array
from operator import attrgetter

count = 0
candidates = {}
candName = []
votes = array.array('i')
with open("election_data.csv", 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)
    for rows in csvreader:
        found = False
        count += 1
        for names in candidates:
            if names == rows[2]:
                found = True
                candidates[rows[2]] = int(candidates[rows[2]]+1)
        if found == False:
            candidates[rows[2]] = 1
for name in candidates.keys():
    candName.append(name)
votes.append(int(candidates.values()))
print(votes[2])
#for names, votes in candidates.items():
 #   print(names + " " + str(votes))
#print(sorted(candidates, key=lambda candidates: candidates[1], reverse=True))
#results = ("Election Results\n" + 
#"-------------------------\n" + 
#"Total Votes: " + str(count) + "\n" + 
#"-------------------------\n" + 
#"-------------------------\n" + 
#"Winner: " + "\n" + 
#"-------------------------")