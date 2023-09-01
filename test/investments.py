import requests
import datetime
import json

INVESTMENT_ENDPOINT = "https://localhost:7160/api/Investment"
HISTORY_ENDPOINT = "https://localhost:7160/api/History"

token = "auth-token"

requestHeaders = {
  'accept': 'text-plain',
  'Authorization': 'Bearer {}'.format(token),
  'Content-Type': 'application/json'
}

## GET ALL TEST ##
response = requests.get(INVESTMENT_ENDPOINT, headers=requestHeaders, verify=False)
investments = response.json()

length = len(investments)
assert response.status_code == 200



## CREATE TEST ##
param = {
 "id": 0,
 "name": "Test Stock",
 "ticker": "TEST",
 "type": "Stock",
 "date_Bought": datetime.date(2021, 9, 15).isoformat(),
 "date_Sold": datetime.date(2022, 9, 15).isoformat(),
 "status": "Sold",
 "cost": 10000,
 "revenue": 10500,
 "dividends": 306,
 "net_Profit_Percentage": 8.06,
 "net_Profit": 806
}

response = requests.post(INVESTMENT_ENDPOINT, data=json.dumps(param), headers=requestHeaders, verify=False)

investments = response.json()
newestID = investments[length]["id"]

assert response.status_code == 200

historyResponse = requests.get(HISTORY_ENDPOINT, headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

history = historyResponse.json()
historyLength = len(history)

assert history[historyLength - 1]["entry"] == "Test Stock has been added to your investments."
latestHistoryID = history[historyLength - 1]["id"]


historyResponse = requests.delete(HISTORY_ENDPOINT + "/" + str(latestHistoryID), headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200



## EDIT TEST ##
param = {
 "id": newestID,
 "name": "Test Stock",
 "ticker": "TEST",
 "type": "Stock",
 "date_Bought": datetime.date(2021, 9, 15).isoformat(),
 "date_Sold": datetime.date(2022, 9, 15).isoformat(),
 "status": "Sold",
 "cost": 10000,
 "revenue": 10700,
 "dividends": 336,
 "net_Profit_Percentage": 10.36,
 "net_Profit": 1036
}

response = requests.put(INVESTMENT_ENDPOINT, data=json.dumps(param), headers=requestHeaders, verify=False)

historyResponse = requests.get(HISTORY_ENDPOINT, headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

history = historyResponse.json()
historyLength = len(history)

assert history[historyLength - 1]["entry"] == "Test Stock had its revenue and dividends changed."

latestHistoryID = history[historyLength - 1]["id"]

historyResponse = requests.delete(HISTORY_ENDPOINT + "/" + str(latestHistoryID), headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200



## GET ONE TEST ##
response = requests.get(INVESTMENT_ENDPOINT + "/" + str(newestID), headers=requestHeaders, verify=False)
assert response.status_code == 200

cocaCola = response.json()

assert cocaCola["revenue"] == 10700



## DELETE TEST ##
response = requests.delete(INVESTMENT_ENDPOINT + "/" + str(newestID), headers=requestHeaders, verify=False)
assert response.status_code == 200

historyResponse = requests.get(HISTORY_ENDPOINT, headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

history = historyResponse.json()
historyLength = len(history)

assert history[historyLength - 1]["entry"] == "Test Stock has been deleted from your investments."

latestHistoryID = history[historyLength - 1]["id"]

historyResponse = requests.delete(HISTORY_ENDPOINT + "/" + str(latestHistoryID), headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

print("INVESTMENT TEST COMPLETED SUCCESSFULLY")